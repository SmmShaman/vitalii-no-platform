// Per-language rewrite helper: runs 3 parallel LLM calls (en, no, ua) instead
// of one big "all-languages-in-one-JSON" call. Each language gets its own
// full token budget so nothing gets truncated mid-sentence.
//
// Used by process-news and process-rss-news.

import { azureFetch } from './azure-to-gemini-shim.ts'
import { HUMANIZER_ARTICLE, VOICE_JOURNALISM } from './humanizer-prompt.ts'

export interface LanguageRewrite {
  title: string
  content: string
  description: string
  tags?: string[]
}

export interface ThreeLangResult {
  en: LanguageRewrite
  no: LanguageRewrite
  ua: LanguageRewrite
  tags: string[]
}

const LANG_NAMES = {
  en: 'English',
  no: 'Norwegian Bokmål',
  ua: 'Ukrainian',
} as const

const LANG_GUIDANCE: Record<'en' | 'no' | 'ua', string> = {
  en: 'Write objective, factual English in AP/Reuters journalistic style.',
  no: 'Write naturally in Norwegian Bokmål — NOT translated from English. Use Norwegian idioms and natural sentence flow. Always use ø, å, æ correctly.',
  ua: 'Write naturally in Ukrainian — NOT translated word-by-word. Use Ukrainian journalistic style with proper Cyrillic. Avoid Russian or English calques.',
}

/**
 * Tolerant JSON parser: LLMs commonly emit JSON with raw newlines/tabs inside
 * string literals (invalid per spec). This walks the text and escapes control
 * characters that occur inside string literals before handing to JSON.parse.
 */
function tolerantParseJSON(text: string): any {
  try {
    return JSON.parse(text)
  } catch (_) {
    // Fall through to sanitizer
  }
  let inString = false
  let escape = false
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (escape) {
      out += c
      escape = false
      continue
    }
    if (c === '\\') {
      out += c
      escape = true
      continue
    }
    if (c === '"') {
      inString = !inString
      out += c
      continue
    }
    if (inString) {
      if (c === '\n') { out += '\\n'; continue }
      if (c === '\r') { out += '\\r'; continue }
      if (c === '\t') { out += '\\t'; continue }
      const code = c.charCodeAt(0)
      if (code < 0x20) {
        out += '\\u' + code.toString(16).padStart(4, '0')
        continue
      }
    }
    out += c
  }
  return JSON.parse(out)
}

function buildPerLangSystemPrompt(langCode: 'en' | 'no' | 'ua', openingStyle: string): string {
  const langName = LANG_NAMES[langCode]
  const guidance = LANG_GUIDANCE[langCode]
  const tagsInstruction =
    langCode === 'en'
      ? `,\n  "tags": ["tag1", "tag2", "tag3"]   // 3-5 lowercase English tags`
      : ''

  return `You are a professional ${langName} news editor. Rewrite the article in ${langName} ONLY (no other languages in the output).

${guidance}

Return ONLY valid JSON (no markdown fence, no backticks). Use \\n\\n inside the content string for paragraph breaks — DO NOT use literal line breaks inside the JSON string values.

{
  "title": "engaging ${langName} title (5-12 words)",
  "description": "2-3 sentence summary in ${langName}",
  "content": "Full article, 400-500 words, 4-5 paragraphs separated by \\n\\n"${tagsInstruction}
}

DEPTH REQUIREMENTS:
- 400-500 words — a substantive article, NOT a summary
- Preserve key technical details, numbers, product names
- Include WHAT happened, WHY it matters, brief CONTEXT
- Plain text only — NO **bold**, NO *italic*, NO #headers, NO [links](url), NO bullet points
- IMPORTANT JSON SAFETY: Use \\n\\n (escaped) for paragraph breaks, never raw newlines inside string values

${HUMANIZER_ARTICLE}

${VOICE_JOURNALISM}

OPENING STYLE DIRECTIVE: ${openingStyle}`
}

function buildUserPrompt(title: string, content: string, sourceUrl: string): string {
  return `Original Title: ${title}\n\nOriginal Content:\n${content.substring(0, 6000)}\n\nSource URL: ${sourceUrl}`
}

async function rewriteOneLanguage(
  langCode: 'en' | 'no' | 'ua',
  title: string,
  content: string,
  sourceUrl: string,
  openingStyle: string,
): Promise<LanguageRewrite> {
  const systemPrompt = buildPerLangSystemPrompt(langCode, openingStyle)
  const userPrompt = buildUserPrompt(title, content, sourceUrl)

  const response = await azureFetch('gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 8000, // Per-provider max output. Plenty for ~500 words even in Cyrillic.
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`AI rewrite [${langCode}] failed: ${response.status} ${errText.substring(0, 200)}`)
  }

  const data = await response.json()
  const aiContent = data.choices?.[0]?.message?.content?.trim() || ''
  const finishReason = data.choices?.[0]?.finish_reason || 'unknown'
  console.log(`  [${langCode}] finish=${finishReason} chars=${aiContent.length}`)

  // Find JSON. If the response was truncated mid-string, try to close the JSON
  // by adding closing chars (lazy fix-up so we at least get title/description).
  let jsonStr = aiContent
  const firstBrace = jsonStr.indexOf('{')
  if (firstBrace > 0) jsonStr = jsonStr.substring(firstBrace)
  const lastBrace = jsonStr.lastIndexOf('}')
  if (lastBrace < 0) {
    // Try to close the object: append closing quote + brace
    // This handles "title": "..." \n "content": "incomplete<EOF>
    let attempt = jsonStr
    if (!attempt.endsWith('"')) attempt += '"'
    attempt += '}'
    try {
      const parsed = tolerantParseJSON(attempt)
      if (parsed.title) {
        console.warn(`  [${langCode}] response was truncated; salvaged title="${parsed.title}"`)
        throw new Error(`Response truncated (finish=${finishReason}); only got title="${parsed.title}"`)
      }
    } catch (_) {}
    throw new Error(`No JSON found in [${langCode}] response (finish=${finishReason}): ${aiContent.substring(0, 300)}`)
  }
  jsonStr = jsonStr.substring(0, lastBrace + 1)
  const jsonMatch = [jsonStr]

  let parsed: any
  try {
    parsed = tolerantParseJSON(jsonMatch[0])
  } catch (e: any) {
    throw new Error(`JSON parse failed for [${langCode}]: ${e.message}. Raw: ${jsonMatch[0].substring(0, 300)}`)
  }

  if (!parsed.title || !parsed.content || !parsed.description) {
    throw new Error(
      `Missing required field in [${langCode}]: title=${!!parsed.title} content=${!!parsed.content} description=${!!parsed.description}`,
    )
  }

  return {
    title: String(parsed.title).trim(),
    content: String(parsed.content).trim(),
    description: String(parsed.description).trim(),
    tags: Array.isArray(parsed.tags) ? parsed.tags : undefined,
  }
}

/**
 * Run all 3 language rewrites in parallel. If any single one fails, throws with a
 * message that says which language(s) failed. All-or-nothing semantics keep
 * downstream save-logic unchanged.
 */
export async function rewriteThreeLanguages(
  title: string,
  content: string,
  sourceUrl: string,
  openingStyle: string,
): Promise<ThreeLangResult> {
  const t0 = Date.now()
  console.log(`🌍 Starting 3 parallel rewrites (EN + NO + UA)`)

  const results = await Promise.allSettled([
    rewriteOneLanguage('en', title, content, sourceUrl, openingStyle),
    rewriteOneLanguage('no', title, content, sourceUrl, openingStyle),
    rewriteOneLanguage('ua', title, content, sourceUrl, openingStyle),
  ])

  const elapsed = Date.now() - t0
  const failures: string[] = []
  if (results[0].status === 'rejected') failures.push(`en: ${results[0].reason?.message || results[0].reason}`)
  if (results[1].status === 'rejected') failures.push(`no: ${results[1].reason?.message || results[1].reason}`)
  if (results[2].status === 'rejected') failures.push(`ua: ${results[2].reason?.message || results[2].reason}`)

  if (failures.length > 0) {
    throw new Error(`Per-language rewrite failed (${failures.length}/3): ${failures.join(' | ')}`)
  }

  const en = (results[0] as PromiseFulfilledResult<LanguageRewrite>).value
  const no = (results[1] as PromiseFulfilledResult<LanguageRewrite>).value
  const ua = (results[2] as PromiseFulfilledResult<LanguageRewrite>).value

  console.log(
    `✅ 3 rewrites done in ${elapsed}ms — EN=${en.content.length}ch NO=${no.content.length}ch UA=${ua.content.length}ch`,
  )

  return {
    en,
    no,
    ua,
    tags: en.tags || no.tags || ua.tags || [],
  }
}
