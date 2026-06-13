#!/usr/bin/env node
// Auto-publish pipeline — bypasses blocked Supabase edge functions
// Runs inline: Gemini image gen → R2 upload → content rewrite → social posting → Telegram

import { dbQuery, sq, loadSettings } from './db.mjs'
import { callGemini, extractJSON, generateGeminiImage } from './gemini.mjs'

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '1438e8d03009209c4a82ea4c28bdb358'
const CF_API_TOKEN = process.env.CF_API_TOKEN
const R2_BUCKET = 'news-images'
const R2_PUBLIC_BASE = 'https://pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev'
const WEBSITE_BASE = 'https://vitalii.no'

const FB_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID
const LI_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
const LI_URN = process.env.LINKEDIN_PERSON_URN
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_CHAT = process.env.TELEGRAM_CHAT_ID

// ── Helpers ──────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function slugify(text) {
  return (text || '').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    .substring(0, 80).replace(/^-|-$/g, '')
}

async function uploadToR2(key, buffer, mimeType = 'image/jpeg') {
  if (!CF_API_TOKEN) throw new Error('CF_API_TOKEN not set')
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(key).replace(/%2F/g, '/')}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${CF_API_TOKEN}`, 'Content-Type': mimeType },
    body: buffer,
  })
  if (!res.ok) throw new Error(`R2 upload failed ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return `${R2_PUBLIC_BASE}/${key}`
}

async function setStatus(newsId, status) {
  await dbQuery(`UPDATE public.news SET auto_publish_status = ${sq(status)}, auto_publish_started_at = COALESCE(auto_publish_started_at, NOW()) WHERE id = ${sq(newsId)}`)
  console.log(`  📊 ${status}`)
}

async function tgSend(text) {
  if (!TG_TOKEN || !TG_CHAT) return
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML' }),
  })
}

async function tgSendPhoto(imageUrl, caption) {
  if (!TG_TOKEN || !TG_CHAT) return
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT, photo: imageUrl, caption: caption.substring(0, 1024), parse_mode: 'HTML' }),
  })
}

// ── Image pipeline ───────────────────────────────────────────────────────

async function buildAndUploadImage(newsId, title, content) {
  // 1. Generate prompt
  const promptText = await callGemini(
    `You are an editorial art director. Create a detailed image generation prompt for a news article.
Rules: No text in image. No faces or specific people. Professional, clean, modern design.
Suitable for tech/business news. 1:1 square aspect ratio. Photorealistic style.
Return ONLY the prompt text.`,
    `Title: ${title}\nContent: ${content.substring(0, 600)}`
  )

  // 2. Generate image
  const fullPrompt = `${promptText.substring(0, 800)}\n\nTechnical: 1:1 square, photorealistic, editorial quality, no text, no logos`
  const imgData = await generateGeminiImage(fullPrompt)

  // 3. Upload to R2
  const buffer = Buffer.from(imgData.base64, 'base64')
  const ext = imgData.mimeType.includes('png') ? 'png' : 'jpg'
  const key = `processed/auto-${newsId.substring(0, 8)}-${Date.now()}.${ext}`
  return uploadToR2(key, buffer, imgData.mimeType)
}

// ── Content rewrite ──────────────────────────────────────────────────────

async function rewriteToEnglish(title, content, sourceUrl) {
  const text = await callGemini(
    `You are a professional news editor. Rewrite the article in English.
Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "engaging English title (under 100 chars)",
  "description": "2-3 sentences summary in plain text",
  "content": "3-5 paragraphs in plain English, no markdown, no bold, no bullet points",
  "slug": "url-slug-from-title",
  "tags": ["tag1", "tag2", "tag3"]
}`,
    `Title: ${title}\nSource: ${sourceUrl || ''}\nContent:\n${content.substring(0, 3000)}`
  )
  return extractJSON(text)
}

async function rewriteToNorwegian(title, content, sourceUrl) {
  const text = await callGemini(
    `Du er en erfaren norsk teknologi-journalist. Skriv om artikkelen på naturlig norsk (bokmål), behold alle fakta intakt.
Returner KUN gyldig JSON (ingen markdown, ingen backticks):
{
  "title": "engasjerende norsk tittel (under 100 tegn)",
  "description": "2-3 setninger sammendrag på vanlig tekst",
  "content": "3-5 avsnitt på flytende norsk bokmål, ingen markdown, ingen fet skrift, ingen punktlister",
  "slug": "url-slug-fra-tittelen-ascii-only"
}`,
    `Title: ${title}\nSource: ${sourceUrl || ''}\nContent:\n${content.substring(0, 3000)}`
  )
  return extractJSON(text)
}

async function rewriteToUkrainian(title, content, sourceUrl) {
  const text = await callGemini(
    `Ти досвідчений український журналіст, який пише про технології. Перепиши статтю українською мовою, зберігши всі факти.
Поверни ЛИШЕ валідний JSON (без markdown, без backticks):
{
  "title": "захопливий український заголовок (до 100 символів)",
  "description": "2-3 речення резюме звичайним текстом",
  "content": "3-5 абзаців природною українською, без markdown, без жирного, без буллетів",
  "slug": "url-slug-from-title-ascii-only"
}`,
    `Title: ${title}\nSource: ${sourceUrl || ''}\nContent:\n${content.substring(0, 3000)}`
  )
  return extractJSON(text)
}

// ── Teaser generation ────────────────────────────────────────────────────

const TEASER_PROMPTS = {
  facebook: `Write an engaging Facebook post for this news article. 2-3 short paragraphs. Conversational tone. End with a question. Include 3-5 relevant hashtags. Return ONLY the post text.`,
  instagram: `Write an Instagram caption for this news. Punchy opener. 3-4 short sentences. 5-8 relevant hashtags. Return ONLY the caption text.`,
  linkedin: `Write a professional LinkedIn post about this news. Insightful tone. 2-3 paragraphs. Key takeaway. 3-5 professional hashtags. Return ONLY the post text.`,
}

async function generateTeaser(platform, title, content, articleUrl) {
  const system = TEASER_PROMPTS[platform] || TEASER_PROMPTS.facebook
  let teaser = await callGemini(system, `Title: ${title}\nContent: ${content.substring(0, 1000)}`)
  if (articleUrl) teaser += `\n\n${articleUrl}`
  return teaser
}

// ── Social posting ───────────────────────────────────────────────────────

async function postFacebook(message, imageUrl) {
  if (!FB_TOKEN || !FB_PAGE_ID) throw new Error('Facebook credentials not configured')
  const form = new URLSearchParams({
    access_token: FB_TOKEN,
    message: message.substring(0, 2000),
  })
  let endpoint
  if (imageUrl) {
    form.append('url', imageUrl)
    endpoint = `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/photos`
  } else {
    endpoint = `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/feed`
  }
  const res = await fetch(endpoint, { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error?.message || `FB API ${res.status}`)
  const id = data.id || data.post_id || ''
  return `https://www.facebook.com/${id}`
}

async function postInstagram(caption, imageUrl) {
  if (!FB_TOKEN || !IG_ACCOUNT_ID) throw new Error('Instagram credentials not configured')
  if (!imageUrl) throw new Error('Instagram requires an image')

  // Create media container
  const createForm = new URLSearchParams({ image_url: imageUrl, caption: caption.substring(0, 2200), access_token: FB_TOKEN })
  const createRes = await fetch(`https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media`, { method: 'POST', body: createForm })
  const createData = await createRes.json()
  if (!createRes.ok || createData.error) throw new Error(createData.error?.message || `IG create ${createRes.status}`)

  await new Promise(r => setTimeout(r, 3000)) // wait for container

  // Publish
  const pubForm = new URLSearchParams({ creation_id: createData.id, access_token: FB_TOKEN })
  const pubRes = await fetch(`https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media_publish`, { method: 'POST', body: pubForm })
  const pubData = await pubRes.json()
  if (!pubRes.ok || pubData.error) throw new Error(pubData.error?.message || `IG publish ${pubRes.status}`)

  return `https://www.instagram.com/p/${pubData.id}/`
}

async function postLinkedIn(text) {
  if (!LI_TOKEN || !LI_URN) throw new Error('LinkedIn credentials not configured')
  const body = {
    author: LI_URN,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: text.substring(0, 3000) },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  }
  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LI_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `LinkedIn API ${res.status}`)
  return `https://www.linkedin.com/feed/update/${data.id}/`
}

// Track post in social_media_posts table
async function trackPost(newsId, platform, language, postUrl, content, status = 'published', errorMessage = null) {
  try {
    await dbQuery(`
      INSERT INTO public.social_media_posts (content_id, content_type, platform, language, status, post_content, platform_post_url, error_message, created_at)
      VALUES (${sq(newsId)}, 'news', ${sq(platform)}, ${sq(language)}, ${sq(status)}, ${sq((content || '').substring(0, 500))}, ${sq(postUrl)}, ${sq(errorMessage)}, NOW())
      ON CONFLICT DO NOTHING
    `)
  } catch (e) {
    console.warn(`  ⚠️ Failed to track post: ${e.message}`)
  }
}

// ── Main pipeline ─────────────────────────────────────────────────────────

export async function publishArticle(newsId) {
  console.log(`\n🚀 Auto-publishing: ${newsId}`)

  // Load article
  const rows = await dbQuery(`
    SELECT n.*, ns.name AS source_name
    FROM public.news n
    LEFT JOIN public.news_sources ns ON ns.id = n.source_id
    WHERE n.id = ${sq(newsId)}
  `)
  if (!rows?.length) throw new Error(`Article not found: ${newsId}`)
  const news = rows[0]

  // Guard: already completed
  if (news.auto_publish_status === 'completed') {
    console.log('⏭️  Already completed, skipping')
    return { skipped: true, reason: 'already_completed' }
  }
  if (['pending', 'variant_selection', 'image_generation', 'content_rewrite', 'social_posting'].includes(news.auto_publish_status)) {
    console.log(`⏭️  Already in progress (${news.auto_publish_status}), skipping`)
    return { skipped: true, reason: 'in_progress' }
  }

  await setStatus(newsId, 'pending')

  let imageUrl = news.processed_image_url || news.image_url || null

  // STEP 1: Generate image
  await setStatus(newsId, 'image_generation')
  try {
    console.log('  🖼️  Generating image...')
    const url = await buildAndUploadImage(newsId, news.original_title || '', news.original_content || '')
    imageUrl = url
    await dbQuery(`UPDATE public.news SET processed_image_url = ${sq(url)} WHERE id = ${sq(newsId)}`)
    console.log(`  ✅ Image: ${url}`)
  } catch (e) {
    console.warn(`  ⚠️  Image failed (will post without): ${e.message}`)
  }

  // STEP 2: Rewrite content
  await setStatus(newsId, 'content_rewrite')
  let rewritten = null
  try {
    console.log('  📝 Rewriting content...')
    rewritten = await rewriteToEnglish(
      news.original_title || '',
      news.original_content || '',
      news.original_url || ''
    )
    const slug = rewritten.slug || slugify(rewritten.title)
    rewritten.slug = slug || `news-${Date.now()}`
    await dbQuery(`
      UPDATE public.news SET
        title_en = ${sq(rewritten.title)},
        content_en = ${sq(rewritten.content)},
        description_en = ${sq(rewritten.description)},
        slug_en = ${sq(rewritten.slug)},
        tags = ${sq(JSON.stringify(rewritten.tags || []))}::jsonb
      WHERE id = ${sq(newsId)}
    `)
    console.log(`  ✅ Rewritten EN: "${rewritten.title}"`)

    // Norwegian + Ukrainian rewrites (non-fatal: if one fails the article still publishes)
    const noEnContent = rewritten.content || news.original_content || ''
    const noEnTitle = rewritten.title || news.original_title || ''
    try {
      const no = await rewriteToNorwegian(noEnTitle, noEnContent, news.original_url || '')
      const noSlug = no.slug || slugify(no.title)
      await dbQuery(`
        UPDATE public.news SET
          title_no = ${sq(no.title)},
          content_no = ${sq(no.content)},
          description_no = ${sq(no.description)},
          slug_no = ${sq(noSlug)}
        WHERE id = ${sq(newsId)}
      `)
      console.log(`  ✅ Rewritten NO: "${no.title}"`)
    } catch (e) {
      console.warn(`  ⚠️  Norwegian rewrite failed: ${e.message}`)
    }
    try {
      const ua = await rewriteToUkrainian(noEnTitle, noEnContent, news.original_url || '')
      const uaSlug = ua.slug || slugify(ua.title)
      await dbQuery(`
        UPDATE public.news SET
          title_ua = ${sq(ua.title)},
          content_ua = ${sq(ua.content)},
          description_ua = ${sq(ua.description)},
          slug_ua = ${sq(uaSlug)},
          is_rewritten = true
        WHERE id = ${sq(newsId)}
      `)
      console.log(`  ✅ Rewritten UA: "${ua.title}"`)
    } catch (e) {
      console.warn(`  ⚠️  Ukrainian rewrite failed: ${e.message}`)
    }
  } catch (e) {
    console.warn(`  ⚠️  Content rewrite failed: ${e.message}`)
    rewritten = {
      title: news.original_title || 'Tech News',
      content: news.original_content || '',
      description: (news.original_content || '').substring(0, 250),
      slug: `news-${Date.now()}`,
      tags: [],
    }
    // Save fallback so slug_en/title_en are not NULL (website needs them)
    await dbQuery(`
      UPDATE public.news SET
        title_en = ${sq(rewritten.title)},
        content_en = ${sq(rewritten.content)},
        description_en = ${sq(rewritten.description)},
        slug_en = ${sq(rewritten.slug)}
      WHERE id = ${sq(newsId)}
    `).catch(() => {})
  }

  // STEP 3: Social posting
  await setStatus(newsId, 'social_posting')

  // Load settings
  const settings = await loadSettings(['AUTO_PUBLISH_PLATFORMS', 'AUTO_PUBLISH_LANGUAGES'])
  const platforms = (settings.AUTO_PUBLISH_PLATFORMS || 'facebook,instagram').split(',').map(s => s.trim()).filter(Boolean)
  const lang = (settings.AUTO_PUBLISH_LANGUAGES || 'en').split(',')[0].trim()

  const title = rewritten.title || news.original_title || 'News'
  const content = rewritten.content || news.original_content || ''
  const slug = rewritten.slug
  const articleUrl = slug ? `${WEBSITE_BASE}/news/${slug}` : null

  // LinkedIn score filter (only if NOT explicitly set via preset)
  const linkedinScore = news.rss_analysis?.linkedin_score || 0
  const LINKEDIN_MIN_SCORE = 7

  const socialResults = []
  for (const platform of platforms) {
    if (platform === 'linkedin' && linkedinScore > 0 && linkedinScore < LINKEDIN_MIN_SCORE) {
      const reason = `score ${linkedinScore}/10 < ${LINKEDIN_MIN_SCORE}`
      console.log(`  🔗 LinkedIn SKIPPED: ${reason}`)
      socialResults.push({ platform, lang, success: false, skipped: true, reason })
      continue
    }
    try {
      console.log(`  📤 Posting to ${platform}...`)
      const teaser = await generateTeaser(platform, title, content, articleUrl)
      let postUrl = null
      if (platform === 'facebook') {
        postUrl = await postFacebook(teaser, imageUrl)
      } else if (platform === 'instagram') {
        if (!imageUrl) {
          socialResults.push({ platform, lang, success: false, error: 'No image for Instagram' })
          console.warn('  ⚠️  Instagram skipped: no image')
          continue
        }
        postUrl = await postInstagram(teaser, imageUrl)
      } else if (platform === 'linkedin') {
        postUrl = await postLinkedIn(teaser)
      }
      await trackPost(newsId, platform, lang, postUrl, teaser)
      socialResults.push({ platform, lang, success: true, postUrl })
      console.log(`  ✅ ${platform}: ${postUrl}`)
    } catch (e) {
      console.warn(`  ❌ ${platform} failed: ${e.message}`)
      socialResults.push({ platform, lang, success: false, error: e.message })
      // Persist actual Meta API error to error_message column (not just Telegram log)
      await trackPost(newsId, platform, lang, null, '', 'failed', e.message || 'Unknown error').catch(() => {})
    }
  }

  // STEP 4: Mark complete + publish
  await dbQuery(`
    UPDATE public.news SET
      auto_publish_status = 'completed',
      auto_publish_completed_at = NOW(),
      is_published = true,
      published_at = NOW()
    WHERE id = ${sq(newsId)}
  `)

  // STEP 5: Telegram summary
  const successCount = socialResults.filter(r => r.success).length
  const icons = { facebook: '📘', instagram: '📸', linkedin: '🔗' }
  const socialText = socialResults.map(r => {
    const icon = icons[r.platform] || '📱'
    if (r.skipped) return `⏭️ ${icon} ${r.platform}: ${r.reason}`
    return r.success
      ? `✅ ${icon} ${r.platform}: <a href="${r.postUrl}">${r.postUrl?.substring(0, 40)}</a>`
      : `❌ ${icon} ${r.platform}: ${escapeHtml(r.error?.substring(0, 50) || 'error')}`
  }).join('\n')

  const sourceName = escapeHtml(news.source_name || (news.rss_source_url ? new URL(news.rss_source_url).hostname : 'RSS'))
  const caption = `🤖 <b>Auto-Published</b>\n\n📰 ${escapeHtml(title)}${articleUrl ? `\n🔗 ${articleUrl}` : ''}\n📌 ${sourceName}\n\n${socialText}\n\n${successCount > 0 ? `✅ ${successCount}/${socialResults.filter(r => !r.skipped).length} posted` : '❌ All failed'}`

  if (imageUrl) {
    await tgSendPhoto(imageUrl, caption)
  } else {
    await tgSend(caption)
  }

  console.log(`\n✅ Complete: ${successCount}/${socialResults.filter(r => !r.skipped).length} social posts`)
  return { success: true, newsId, title, socialResults }
}

// CLI entry point
if (process.argv[1]?.endsWith('auto-publish.mjs')) {
  const newsId = process.argv[2]
  if (!newsId) {
    console.error('Usage: node scripts/bypass/auto-publish.mjs <newsId>')
    process.exit(1)
  }
  publishArticle(newsId)
    .then(r => { console.log('\nResult:', r?.skipped ? `skipped (${r.reason})` : 'done'); process.exit(0) })
    .catch(e => { console.error('FATAL:', e.message); process.exit(1) })
}
