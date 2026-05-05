#!/usr/bin/env node
// RSS Monitor — fetches and analyzes RSS feeds, saves to DB, sends to Telegram
// Replaces Supabase edge function monitor-rss-sources (blocked by 402)
// Usage: node scripts/bypass/monitor-rss.mjs [--batch 0] [--batch-size 8]

import { dbQuery, sq, loadSettings } from './db.mjs'
import { callGemini, extractJSON } from './gemini.mjs'

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_CHAT = process.env.TELEGRAM_CHAT_ID

// ── RSS Parsing ──────────────────────────────────────────────────────────

function decodeEntities(text) {
  return (text || '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
    || xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match ? decodeEntities(match[1].trim()) : ''
}

function extractImageFromDescription(html) {
  const match = html.match(/src=["']([^"']+\.(jpg|jpeg|png|webp|gif))[^"']*/i)
  return match ? match[1] : null
}

function extractMediaImage(itemXml) {
  const patterns = [
    /media:content[^>]+url=["']([^"']+)["'][^>]*type=["']image[^"']*["']/i,
    /media:content[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i,
    /media:thumbnail[^>]+url=["']([^"']+)["']/i,
    /enclosure[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i,
    /enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image[^"']*["']/i,
  ]
  for (const p of patterns) {
    const m = itemXml.match(p)
    if (m?.[1]) return m[1]
  }
  return null
}

function parseRssFeed(xml) {
  const isAtom = xml.includes('<feed') && xml.includes('xmlns="http://www.w3.org/2005/Atom"')
  const itemPattern = isAtom ? /<entry[\s\S]*?<\/entry>/gi : /<item[\s\S]*?<\/item>/gi
  const items = xml.match(itemPattern) || []

  return items.slice(0, 10).map(item => {
    const title = extractTag(item, 'title')
    const link = isAtom
      ? (item.match(/href=["']([^"']+)["']/) || [])[1]
      : (extractTag(item, 'link') || item.match(/<link>([^<]+)<\/link>/)?.[1] || '')
    const description = extractTag(item, isAtom ? 'summary' : 'description') || extractTag(item, 'content')
    const pubDate = extractTag(item, isAtom ? 'updated' : 'pubDate') || extractTag(item, 'published')
    const imageUrl = extractMediaImage(item) || extractImageFromDescription(description)

    return {
      title: title.replace(/<[^>]+>/g, '').trim(),
      url: link?.trim() || '',
      description: description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 1000),
      pubDate,
      imageUrl,
    }
  }).filter(a => a.title && a.url)
}

async function fetchRss(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20000)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 NewsBot/1.0' },
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const xml = await res.text()
    return parseRssFeed(xml)
  } catch (e) {
    clearTimeout(timeout)
    throw e
  }
}

// ── Duplicate check ──────────────────────────────────────────────────────

async function isDuplicate(url, title) {
  const rows = await dbQuery(`
    SELECT id FROM public.news
    WHERE original_url = ${sq(url)}
       OR original_title = ${sq(title)}
    LIMIT 1
  `)
  return rows?.length > 0
}

// ── AI analysis ──────────────────────────────────────────────────────────

async function analyzeArticle(title, description, sourceName) {
  const text = await callGemini(
    `You are a news relevance analyst for a tech/business news site focused on Norway and technology.
Analyze this article and return ONLY valid JSON:
{
  "relevance_score": 1-10,
  "linkedin_score": 1-10,
  "category": "technology|business|norway|ai|politics|science|other",
  "summary": "2-3 sentence summary in English",
  "key_points": ["point1", "point2"],
  "recommended_action": "publish|skip",
  "skip_reason": "only if skip",
  "is_norway_related": true|false
}

Score 7-10: breaking tech news, AI/ML, major business news, Norway-related tech
Score 5-6: interesting but not critical
Score 1-4: opinion, duplicate topic, clickbait, or off-topic`,
    `Source: ${sourceName}\nTitle: ${title}\nDescription: ${description.substring(0, 500)}`
  )
  return extractJSON(text)
}

// ── Telegram notification ─────────────────────────────────────────────────

const CATEGORY_SHORT = {
  technology: '💻 Tech', ai: '🤖 AI', business: '📼 Business',
  norway: '🇳🇴 Norway', politics: '🏛 Politics', science: '🔬 Science', other: '📰 Other',
}

function getShortSummary(summary, maxWords = 9) {
  if (!summary) return ''
  const first = summary.split(/[.!?]/)[0]?.trim() || summary
  const words = first.split(/\s+/)
  return words.length <= maxWords ? first : words.slice(0, maxWords).join(' ') + '...'
}

function buildKeyboard(newsId) {
  return {
    inline_keyboard: [
      [
        { text: '🚀 EN', callback_data: `pr_ane_${newsId}` },
        { text: '🚀 NO', callback_data: `pr_ann_${newsId}` },
        { text: '🚀 UA', callback_data: `pr_anu_${newsId}` },
      ],
      [
        { text: '📝 EN', callback_data: `pr_abe_${newsId}` },
        { text: '📝 NO', callback_data: `pr_abn_${newsId}` },
        { text: '📝 UA', callback_data: `pr_abu_${newsId}` },
      ],
      [
        { text: '🔧 Вручну', callback_data: `manual_${newsId}` },
        { text: '❌ Skip', callback_data: `reject_${newsId}` },
      ],
    ],
  }
}

async function sendToTelegram(newsId, title, sourceName, score, summary, imageUrl, articleUrl, analysis) {
  if (!TG_TOKEN || !TG_CHAT) return
  const relevanceEmoji = score >= 7 ? '🟢' : score >= 5 ? '🟡' : '🔴'
  const categoryShort = CATEGORY_SHORT[analysis?.category] || '📰 Other'
  const shortSummary = getShortSummary(summary)
  const keyPoints = (analysis?.key_points || []).map(p => `• ${escapeHtml(p)}`).join('\n')
  const action = (analysis?.recommended_action || 'skip').toUpperCase()
  const skipReason = analysis?.skip_reason ? `\nℹ️ ${escapeHtml(analysis.skip_reason)}` : ''
  const url = articleUrl || ''

  const expandable = `<blockquote expandable>📋 ${escapeHtml(summary || '')}${keyPoints ? '\n\n' + keyPoints : ''}

🎯 ${action}${skipReason}</blockquote>`

  const text = `📰 <b>RSS</b> | 📌 ${escapeHtml(sourceName)} | ${relevanceEmoji} ${score}/10 | ${categoryShort}
🔗 <a href="${url}">${escapeHtml(title.substring(0, 100))}</a>

💬 ${escapeHtml(shortSummary)}

${expandable}

newsId:${newsId}`

  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: buildKeyboard(newsId),
      }),
    })
    const data = await res.json()
    const msgId = data.result?.message_id || null
    if (msgId && newsId) {
      await dbQuery(`UPDATE public.news SET telegram_message_id = ${msgId} WHERE id = ${sq(newsId)}`)
    }
    return msgId
  } catch (e) {
    console.warn(`  ⚠️  Telegram send failed: ${e.message}`)
    return null
  }
}

function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ── Save article to DB ────────────────────────────────────────────────────

async function saveArticle(article, analysis, source) {
  const rows = await dbQuery(`
    INSERT INTO public.news (
      original_title, original_content, original_url,
      image_url, rss_source_url, source_type,
      rss_analysis, auto_publish_status, created_at
    ) VALUES (
      ${sq(article.title)},
      ${sq(article.description)},
      ${sq(article.url)},
      ${sq(article.imageUrl || null)},
      ${sq(source.rss_url)},
      'rss',
      ${sq(JSON.stringify({
        summary: analysis.summary || '',
        relevance_score: analysis.relevance_score || 0,
        linkedin_score: analysis.linkedin_score || 0,
        category: analysis.category || 'other',
        key_points: analysis.key_points || [],
        recommended_action: analysis.recommended_action || 'skip',
        is_norway_related: analysis.is_norway_related || false,
      }))}::jsonb,
      'new',
      NOW()
    )
    ON CONFLICT (original_url) DO NOTHING
    RETURNING id
  `)
  return rows?.[0]?.id || null
}

// ── Auto-schedule high-scoring articles ──────────────────────────────────

async function autoSchedule(newsId, score) {
  if (score < 7) return false

  // Find next available slot (simple: now + 5 minutes if today's windows still open)
  const osloNow = getOsloNow()
  let scheduledAt = new Date(osloNow.getTime() + 5 * 60 * 1000)

  // Load publishing windows
  const settings = await loadSettings(['PUBLISH_SCHEDULE_WINDOWS', 'PUBLISH_SCHEDULE_ENABLED'])
  if (settings.PUBLISH_SCHEDULE_ENABLED === 'false') return false

  let windows = []
  try {
    windows = JSON.parse(settings.PUBLISH_SCHEDULE_WINDOWS || '{"windows":[]}').windows || []
  } catch {}

  const nowMin = osloNow.getHours() * 60 + osloNow.getMinutes()
  let inWindow = false
  for (const win of windows) {
    const [sh, sm] = win.start.split(':').map(Number)
    const [eh, em] = win.end.split(':').map(Number)
    if (nowMin >= sh * 60 + sm && nowMin < eh * 60 + em) { inWindow = true; break }
  }

  if (!inWindow) {
    // Find next window start today
    for (const win of windows) {
      const [sh, sm] = win.start.split(':').map(Number)
      const winStartMin = sh * 60 + sm
      if (winStartMin > nowMin) {
        scheduledAt = new Date(osloNow)
        scheduledAt.setHours(sh, sm + 1, 0, 0)
        break
      }
    }
  }

  await dbQuery(`
    UPDATE public.news
    SET auto_publish_status = 'scheduled',
        scheduled_publish_at = ${sq(scheduledAt.toISOString())}
    WHERE id = ${sq(newsId)}
  `)
  console.log(`  📅 Auto-scheduled: ${scheduledAt.getHours()}:${String(scheduledAt.getMinutes()).padStart(2,'0')} Oslo`)
  return true
}

function getOsloNow() {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Oslo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  const parts = formatter.formatToParts(new Date())
  const get = (t) => parseInt(parts.find(p => p.type === t)?.value || '0')
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')))
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  // Parse CLI args
  const args = process.argv.slice(2)
  const batchIndex = parseInt(args[args.indexOf('--batch') + 1] ?? '0') || 0
  const batchSize = parseInt(args[args.indexOf('--batch-size') + 1] ?? '8') || 8

  console.log(`📡 RSS Monitor — batch ${batchIndex} (size ${batchSize}) — ${new Date().toISOString()}`)

  // Load active sources
  const sources = await dbQuery(`
    SELECT id, name, rss_url, tier
    FROM public.news_monitor_sources
    WHERE is_active = true
    ORDER BY tier, name
  `)

  if (!sources?.length) {
    console.log('⚠️  No active RSS sources')
    return
  }

  const startIdx = batchIndex * batchSize
  const endIdx = Math.min(startIdx + batchSize, sources.length)
  const batch = sources.slice(startIdx, endIdx)

  console.log(`📰 Processing ${batch.length} sources (${startIdx}-${endIdx - 1} of ${sources.length}): ${batch.map(s => s.name).join(', ')}`)

  let analyzed = 0, saved = 0, skipped = 0, errors = 0

  for (const source of batch) {
    try {
      console.log(`\n🔍 ${source.name}`)
      const articles = await fetchRss(source.rss_url)
      console.log(`  📄 ${articles.length} articles`)

      for (const article of articles) {
        try {
          // Duplicate check
          if (await isDuplicate(article.url, article.title)) {
            console.log(`  ⏭️  Duplicate: ${article.title.substring(0, 60)}`)
            skipped++
            continue
          }

          // AI analysis
          const analysis = await analyzeArticle(article.title, article.description, source.name)
          analyzed++

          const score = analysis.relevance_score || 0
          const action = analysis.recommended_action || 'skip'

          if (score < 5 || action === 'skip') {
            console.log(`  ⏭️  Low score (${score}): ${article.title.substring(0, 60)}`)
            skipped++
            continue
          }

          // Save to DB
          const newsId = await saveArticle(article, analysis, source)
          if (!newsId) {
            console.log(`  ⚠️  Already exists (conflict): ${article.title.substring(0, 60)}`)
            skipped++
            continue
          }
          saved++
          console.log(`  ✅ Saved (score ${score}): ${article.title.substring(0, 60)}`)

          // Auto-schedule if score >= 7
          await autoSchedule(newsId, score)

          // Send to Telegram
          const msgId = await sendToTelegram(newsId, article.title, source.name, score, analysis.summary, article.imageUrl, article.url, analysis)
          if (msgId) {
            console.log(`  📱 Sent to Telegram (msg: ${msgId})`)
          }

          await new Promise(r => setTimeout(r, 200)) // rate limit
        } catch (e) {
          console.warn(`  ❌ Article error: ${e.message}`)
          errors++
        }
      }
    } catch (e) {
      console.error(`❌ Source error (${source.name}): ${e.message}`)
      errors++
    }
  }

  // Zombie cleanup
  const zombieCutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  await dbQuery(`
    UPDATE public.news
    SET auto_publish_status = 'failed',
        auto_publish_error = 'Zombie: stuck >10min, auto-cleaned by rss-monitor'
    WHERE auto_publish_status IN ('pending','variant_selection','image_generation','content_rewrite','social_posting')
      AND auto_publish_started_at < ${sq(zombieCutoff)}
  `).catch(() => {})

  console.log(`\n✅ RSS Monitor done: ${batch.length} sources, ${analyzed} analyzed, ${saved} saved, ${skipped} skipped, ${errors} errors`)
}

main().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
