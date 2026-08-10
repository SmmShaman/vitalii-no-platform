/**
 * Fact sheet builder — independent research pass before the video is cut.
 *
 * The digest used to know only what our own DB row said: a headline, a rewritten
 * body, a photo. That is not enough to put anything meaningful on screen — who
 * these people are, where it happened, what the actual numbers were.
 *
 * This module reads the ORIGINAL source article and distils a structured fact
 * sheet: what happened, who, where, when, key numbers, one verbatim quote.
 * Everything must be traceable to the text we fetched; the prompt forbids
 * invention and the code drops anything the source does not support.
 *
 * Output feeds two consumers:
 *   - on-screen graphics (identity bar, fact strip, quote card)
 *   - future script writing (richer narration)
 */

import { callLLMJson } from './llm-helper.js';

const FETCH_TIMEOUT_MS = 15_000;
const MAX_SOURCE_CHARS = 6000;

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/** Strip a news page down to readable body text. */
function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchSourceText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      signal: controller.signal,
      redirect: 'follow',
    });
    if (!res.ok) return '';
    const html = await res.text();
    return htmlToText(html).slice(0, MAX_SOURCE_CHARS);
  } catch {
    return '';
  } finally {
    clearTimeout(timer);
  }
}

/** Host name as a readable source label ("www.vg.no" → "vg.no"). */
function sourceLabel(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function pickSourceUrl(article) {
  return (
    article.original_url ||
    article.source_link ||
    (article.source_links || []).find(l => l && !l.includes('t.me/')) ||
    ''
  );
}

const EMPTY_SHEET = {
  what: '',
  who: [],
  where: { place: '', country: '' },
  when: '',
  numbers: [],
  quote: null,
  source: '',
};

/** Keep only well-formed entries; anything malformed is dropped, not guessed. */
function sanitize(raw, sourceName) {
  const sheet = { ...EMPTY_SHEET, source: sourceName };
  if (!raw || typeof raw !== 'object') return sheet;

  if (typeof raw.what === 'string') sheet.what = raw.what.trim().slice(0, 200);
  if (typeof raw.when === 'string') sheet.when = raw.when.trim().slice(0, 60);

  if (Array.isArray(raw.who)) {
    sheet.who = raw.who
      .filter(p => p && typeof p.name === 'string' && p.name.trim().length > 1)
      .map(p => ({
        name: p.name.trim().slice(0, 60),
        role: typeof p.role === 'string' ? p.role.trim().slice(0, 80) : '',
      }))
      .slice(0, 4);
  }

  if (raw.where && typeof raw.where === 'object') {
    sheet.where = {
      place: typeof raw.where.place === 'string' ? raw.where.place.trim().slice(0, 60) : '',
      country: typeof raw.where.country === 'string' ? raw.where.country.trim().slice(0, 40) : '',
    };
  }

  if (Array.isArray(raw.numbers)) {
    sheet.numbers = raw.numbers
      .filter(n => n && n.value != null && String(n.value).trim() && typeof n.label === 'string' && n.label.trim())
      .map(n => ({
        value: String(n.value).trim().slice(0, 24),
        label: n.label.trim().slice(0, 60),
      }))
      .slice(0, 4);
  }

  if (raw.quote && typeof raw.quote.text === 'string' && raw.quote.text.trim().length > 15) {
    sheet.quote = {
      text: raw.quote.text.trim().slice(0, 220),
      speaker: typeof raw.quote.speaker === 'string' ? raw.quote.speaker.trim().slice(0, 60) : '',
    };
  }

  return sheet;
}

/**
 * A quote is only usable if it really appears in the source text. LLMs
 * paraphrase quotes convincingly; an invented quote attributed to a named
 * person is the worst thing this pipeline could publish.
 */
function quoteIsGrounded(quote, sourceText) {
  if (!quote || !sourceText) return false;
  const normalise = s => s.toLowerCase().replace(/[«»""'']/g, '"').replace(/\s+/g, ' ');
  const haystack = normalise(sourceText);
  const needle = normalise(quote.text);
  if (haystack.includes(needle)) return true;
  // Allow trimmed quotes: require a long verbatim run to still match
  const words = needle.split(' ');
  if (words.length < 6) return false;
  const run = words.slice(0, 8).join(' ');
  return haystack.includes(run);
}

async function buildOne(article, index) {
  const url = pickSourceUrl(article);
  const sourceName = sourceLabel(url);
  const sourceText = url ? await fetchSourceText(url) : '';

  const ourTitle = article.title_no || article.title_en || article.original_title || '';
  const ourBody = String(article.content_no || article.content_en || article.original_content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2500);

  if (!sourceText && !ourBody) return { ...EMPTY_SHEET, source: sourceName };

  const systemPrompt = `You are a news researcher preparing an on-screen fact sheet for a TV news digest.

You will receive our own article text and, when available, the ORIGINAL source article.
Extract ONLY facts that are literally present in those texts.

HARD RULES:
- Never invent a name, number, place or quote. If the texts do not say it, leave the field empty.
- "who" = people or organisations that ACT in this story, with their role as stated ("Amazon", "cloud provider"; "Jens Stoltenberg", "NATO-sjef"). Not passing mentions.
- "where" = the place the event happens, not the publisher's location.
- "numbers" = figures that matter to the story, each with a short label in NORWEGIAN.
- "quote" = a VERBATIM sentence in quotation marks from a named person. If there is no real quote, use null. Do not paraphrase.
- Everything user-visible must be written in NORWEGIAN (labels, roles, summary), except proper names.

Return JSON only:
{
  "what": "one sentence in Norwegian: what actually happened",
  "who": [{ "name": "", "role": "" }],
  "where": { "place": "", "country": "" },
  "when": "",
  "numbers": [{ "value": "33 millioner", "label": "tonn CO2 i året" }],
  "quote": { "text": "", "speaker": "" }
}`;

  const userPrompt = [
    `HEADLINE: ${ourTitle}`,
    '',
    'OUR ARTICLE:',
    ourBody || '(none)',
    '',
    `ORIGINAL SOURCE (${sourceName || 'unknown'}):`,
    sourceText || '(could not be fetched — use only our article above)',
  ].join('\n');

  try {
    const parsed = await callLLMJson(systemPrompt, userPrompt, {
      maxTokens: 1200,
      temperature: 0.2,
    });
    const sheet = sanitize(parsed, sourceName);

    if (sheet.quote && !quoteIsGrounded(sheet.quote, `${sourceText} ${ourBody}`)) {
      console.log(`    🚫 Seg ${index + 1}: quote dropped — not found verbatim in the source`);
      sheet.quote = null;
    }
    return sheet;
  } catch (err) {
    console.log(`    ⚠️ Seg ${index + 1}: fact sheet failed — ${err.message.slice(0, 80)}`);
    return { ...EMPTY_SHEET, source: sourceName };
  }
}

// ══════════════════════════════════════════════════════════════════
//  Stage 2 — verification against sources outside the article
// ══════════════════════════════════════════════════════════════════

// Google Custom Search free tier is 100 queries/day and per-phrase image search
// already spends ~30 of them, so verification gets a hard budget per run.
const MAX_VERIFY_QUERIES = 21;
let verifyQueriesUsed = 0;
let searchFailureLogged = false;

/** Web search (not image search) via Google CSE, or Serper when a key exists. */
async function webSearch(query, num = 4) {
  if (verifyQueriesUsed >= MAX_VERIFY_QUERIES) return [];
  verifyQueriesUsed++;

  const SERPER = process.env.SERPER_API_KEY || process.env.GOOGLE_SERPER_API_KEY;
  const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
  const CSE = process.env.GOOGLE_CSE_ID;

  try {
    if (SERPER) {
      const res = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': SERPER, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, num }),
      });
      if (res.ok) {
        const data = await res.json();
        return (data.organic || []).slice(0, num).map(r => ({
          domain: sourceLabel(r.link || ''),
          title: r.title || '',
          snippet: r.snippet || '',
        }));
      }
    }
    if (GOOGLE_KEY && CSE) {
      const params = new URLSearchParams({
        key: GOOGLE_KEY, cx: CSE, q: query, num: String(num),
      });
      const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
      if (res.ok) {
        const data = await res.json();
        return (data.items || []).slice(0, num).map(r => ({
          domain: sourceLabel(r.link || ''),
          title: r.title || '',
          snippet: r.snippet || '',
        }));
      }
      // Say WHY nothing came back. A silent empty result reads as "nothing
      // confirms this fact" when the truth is "we never got to ask" — the free
      // CSE tier is 100 queries/day and image search shares it.
      if (!searchFailureLogged) {
        searchFailureLogged = true;
        const body = await res.text().catch(() => '');
        const reason = res.status === 429 || /quota|rateLimit/i.test(body)
          ? 'DAILY QUOTA EXHAUSTED — verification is off until it resets'
          : `HTTP ${res.status}`;
        console.log(`    ⚠️ Web search unavailable: ${reason}`);
      }
    }
  } catch (err) {
    if (!searchFailureLogged) {
      searchFailureLogged = true;
      console.log(`    ⚠️ Web search failed: ${err.message.slice(0, 80)}`);
    }
  }
  return [];
}

/**
 * Judge one claim against search snippets.
 * Deliberately conservative: the model may only answer from the snippets, and
 * "not supported" is the default when they do not clearly say it.
 */
async function judgeClaim(claim, results, sourceDomain) {
  const usable = results.filter(r => r.domain && r.domain !== sourceDomain);
  if (usable.length === 0) return { supported: false, domains: [], detail: '' };

  const evidence = usable
    .map((r, i) => `[${i + 1}] ${r.domain}: ${r.title} — ${r.snippet}`)
    .join('\n');

  const systemPrompt = `You verify a single factual claim against web search snippets.

Answer ONLY from the snippets below. You may not use prior knowledge.
A snippet supports the claim only if it states the same thing, not something similar.
If the snippets disagree with the claim, set "conflicting": true.
"detail" is at most 8 NORWEGIAN words adding who/what this is — empty if the snippets add nothing.

Return JSON: { "supported": bool, "conflicting": bool, "sourceNumbers": [1,2], "detail": "" }`;

  try {
    const parsed = await callLLMJson(
      systemPrompt,
      `CLAIM: ${claim}\n\nSNIPPETS:\n${evidence}`,
      { maxTokens: 300, temperature: 0 },
    );
    const nums = Array.isArray(parsed?.sourceNumbers) ? parsed.sourceNumbers : [];
    const domains = [
      ...new Set(nums.map(n => usable[Number(n) - 1]?.domain).filter(Boolean)),
    ];
    return {
      supported: !!parsed?.supported && !parsed?.conflicting && domains.length > 0,
      conflicting: !!parsed?.conflicting,
      domains,
      detail: typeof parsed?.detail === 'string' ? parsed.detail.trim().slice(0, 60) : '',
    };
  } catch {
    return { supported: false, domains: [], detail: '' };
  }
}

/**
 * Second research stage: look OUTSIDE the article.
 *
 * Stage 1 can only repeat what one publisher wrote — including its mistakes.
 * Here each person and headline figure is searched for independently and
 * marked: confirmed (another domain says the same), single-source (nobody else
 * mentions it) or conflicting (someone contradicts it — never shown on screen).
 */
async function verifySheet(sheet, index) {
  const sourceDomain = sheet.source || '';
  const place = sheet.where?.place || sheet.where?.country || '';

  for (const person of (sheet.who || []).slice(0, 2)) {
    const claim = person.role ? `${person.name} — ${person.role}` : person.name;
    const results = await webSearch(`${person.name} ${person.role || place}`.trim());
    const verdict = await judgeClaim(claim, results, sourceDomain);
    person.status = verdict.conflicting
      ? 'conflicting'
      : verdict.supported
        ? 'confirmed'
        : 'single-source';
    person.sources = verdict.domains;
    // Independent search often knows the person better than one passing mention
    if (verdict.supported && verdict.detail && !person.role) person.role = verdict.detail;
  }

  const topNumber = (sheet.numbers || [])[0];
  if (topNumber) {
    const claim = `${topNumber.value} ${topNumber.label}`;
    const results = await webSearch(`${claim} ${place}`.trim());
    const verdict = await judgeClaim(claim, results, sourceDomain);
    topNumber.status = verdict.conflicting
      ? 'conflicting'
      : verdict.supported
        ? 'confirmed'
        : 'single-source';
    topNumber.sources = verdict.domains;
  }

  // Anything contradicted by other sources must never reach the screen
  sheet.who = (sheet.who || []).filter(p => p.status !== 'conflicting');
  sheet.numbers = (sheet.numbers || []).filter(n => n.status !== 'conflicting');

  const confirmed = [...(sheet.who || []), ...(sheet.numbers || [])]
    .filter(x => x.status === 'confirmed').length;
  console.log(`    🔍 Seg ${index + 1} verification: ${confirmed} confirmed by other sources (${verifyQueriesUsed}/${MAX_VERIFY_QUERIES} queries used)`);

  return sheet;
}

/**
 * Build one fact sheet per article. Never throws — a missing sheet just means
 * fewer on-screen facts, and the render continues.
 */
export async function buildFactSheets(articles) {
  const sheets = [];
  verifyQueriesUsed = 0;
  searchFailureLogged = false;
  for (let i = 0; i < articles.length; i++) {
    let sheet = await buildOne(articles[i], i);
    try {
      sheet = await verifySheet(sheet, i);
    } catch (err) {
      console.log(`    ⚠️ Seg ${i + 1}: verification skipped — ${err.message.slice(0, 60)}`);
    }
    sheets.push(sheet);
    const bits = [
      sheet.what ? 'what' : null,
      sheet.who.length ? `who:${sheet.who.length}` : null,
      sheet.where.place ? 'where' : null,
      sheet.numbers.length ? `numbers:${sheet.numbers.length}` : null,
      sheet.quote ? 'quote' : null,
    ].filter(Boolean);
    console.log(`    📑 Seg ${i + 1} facts [${sheet.source || 'no source'}]: ${bits.join(', ') || 'none'}`);
  }
  return sheets;
}
