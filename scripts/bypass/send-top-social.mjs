#!/usr/bin/env node
// Send Top Social — picks top-viewed recent article and posts to social media
// Replaces Supabase edge function send-top-social (blocked by 402)
// Usage: node scripts/bypass/send-top-social.mjs

import { dbQuery, sq, loadSettings } from './db.mjs'
import { callGemini } from './gemini.mjs'

const FB_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID
const IG_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID
let LI_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN
let LI_URN = process.env.LINKEDIN_PERSON_URN
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_CHAT = process.env.TELEGRAM_CHAT_ID
const WEBSITE_BASE = 'https://vitalii.no'

function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function postFacebook(message, imageUrl) {
  if (!FB_TOKEN || !FB_PAGE_ID) throw new Error('Facebook credentials not configured')
  const form = new URLSearchParams({ access_token: FB_TOKEN, message: message.substring(0, 2000) })
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
  return `https://www.facebook.com/${data.id || data.post_id || ''}`
}

async function postInstagram(caption, imageUrl) {
  if (!FB_TOKEN || !IG_ACCOUNT_ID) throw new Error('Instagram credentials not configured')
  if (!imageUrl) throw new Error('Instagram requires an image')
  const createForm = new URLSearchParams({ image_url: imageUrl, caption: caption.substring(0, 2200), access_token: FB_TOKEN })
  const createRes = await fetch(`https://graph.facebook.com/v18.0/${IG_ACCOUNT_ID}/media`, { method: 'POST', body: createForm })
  const createData = await createRes.json()
  if (!createRes.ok || createData.error) throw new Error(createData.error?.message || `IG create ${createRes.status}`)
  await new Promise(r => setTimeout(r, 3000))
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
    headers: { 'Authorization': `Bearer ${LI_TOKEN}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `LinkedIn API ${res.status}`)
  return `https://www.linkedin.com/feed/update/${data.id}/`
}

async function main() {
  console.log(`🔥 Send Top Social — ${new Date().toISOString()}`)

  // Load LinkedIn credentials from api_settings (overrides stale GitHub Actions secrets)
  const liSettings = await loadSettings(['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_PERSON_URN']).catch(() => ({}))
  if (liSettings.LINKEDIN_ACCESS_TOKEN) LI_TOKEN = liSettings.LINKEDIN_ACCESS_TOKEN
  if (liSettings.LINKEDIN_PERSON_URN) LI_URN = liSettings.LINKEDIN_PERSON_URN

  // Find top-viewed published article from last 7 days not already sent as top-social today
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayStart = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()

  const rows = await dbQuery(`
    SELECT n.id, n.title_en, n.content_en, n.description_en, n.slug_en,
           n.processed_image_url, n.image_url, n.views_count
    FROM public.news n
    WHERE n.is_published = true
      AND n.title_en IS NOT NULL
      AND n.published_at >= ${sq(since7d)}
      AND NOT EXISTS (
        SELECT 1 FROM public.social_media_posts sp
        WHERE sp.content_id = n.id
          AND sp.content_type = 'top_social'
          AND sp.created_at >= ${sq(todayStart)}
      )
    ORDER BY n.views_count DESC NULLS LAST
    LIMIT 1
  `)

  if (!rows?.length) {
    console.log('📭 No eligible top article found')
    return
  }

  const article = rows[0]
  const imageUrl = article.processed_image_url || article.image_url || null
  const articleUrl = article.slug_en ? `${WEBSITE_BASE}/news/${article.slug_en}` : null

  console.log(`📰 Top article: "${article.title_en}" (${article.views_count || 0} views)`)

  const platforms = ['facebook', 'instagram', 'linkedin']
  const teaserPrompts = {
    facebook: `Write a "Top Read" Facebook post highlighting this popular article. Start with "🔥 Most read today:". Engaging tone. 2-3 paragraphs. 3-5 hashtags. Return ONLY the post text.`,
    instagram: `Write an Instagram caption for this popular article. Use "🔥 Top Read" opener. Punchy. 5-8 hashtags. Return ONLY the caption.`,
    linkedin: `Write a LinkedIn post sharing this top-read article. Professional insights. Why it matters to tech professionals. 3-5 hashtags. Return ONLY the post text.`,
  }

  const results = []
  for (const platform of platforms) {
    if (platform === 'instagram' && !imageUrl) {
      console.log('  ⏭️  Instagram skipped: no image')
      results.push({ platform, skipped: true, reason: 'no image' })
      continue
    }
    try {
      console.log(`  📤 Posting to ${platform}...`)
      let teaser = await callGemini(
        teaserPrompts[platform],
        `Title: ${article.title_en}\nDescription: ${(article.description_en || '').substring(0, 500)}${articleUrl ? `\nURL: ${articleUrl}` : ''}`
      )
      if (articleUrl) teaser += `\n\n${articleUrl}`

      let postUrl
      if (platform === 'facebook') postUrl = await postFacebook(teaser, imageUrl)
      else if (platform === 'instagram') postUrl = await postInstagram(teaser, imageUrl)
      else if (platform === 'linkedin') postUrl = await postLinkedIn(teaser)

      await dbQuery(`
        INSERT INTO public.social_media_posts (content_id, content_type, platform, language, status, post_content, platform_post_url, created_at)
        VALUES (${sq(article.id)}, 'top_social', ${sq(platform)}, 'en', 'published', ${sq(teaser.substring(0, 500))}, ${sq(postUrl)}, NOW())
        ON CONFLICT DO NOTHING
      `).catch(() => {})

      results.push({ platform, success: true, postUrl })
      console.log(`  ✅ ${platform}: ${postUrl}`)
    } catch (e) {
      console.warn(`  ❌ ${platform} failed: ${e.message}`)
      results.push({ platform, success: false, error: e.message })
    }
  }

  // Telegram summary
  if (TG_TOKEN && TG_CHAT) {
    const icons = { facebook: '📘', instagram: '📸', linkedin: '🔗' }
    const lines = results.map(r => {
      const icon = icons[r.platform] || '📱'
      if (r.skipped) return `⏭️ ${icon} ${r.platform}: ${r.reason}`
      return r.success ? `✅ ${icon} ${r.platform}` : `❌ ${icon} ${r.platform}: ${escapeHtml(r.error?.substring(0, 50) || '')}`
    }).join('\n')

    const tgText = `🔥 <b>Top Social Sent</b>\n\n📰 ${escapeHtml(article.title_en)}${articleUrl ? `\n🔗 ${articleUrl}` : ''}\n👁 ${article.views_count || 0} views\n\n${lines}`
    const method = imageUrl ? 'sendPhoto' : 'sendMessage'
    const payload = imageUrl
      ? { chat_id: TG_CHAT, photo: imageUrl, caption: tgText.substring(0, 1024), parse_mode: 'HTML' }
      : { chat_id: TG_CHAT, text: tgText, parse_mode: 'HTML' }
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(e => console.warn(`  ⚠️ Telegram: ${e.message}`))
  }

  const successCount = results.filter(r => r.success).length
  console.log(`\n✅ Done: ${successCount}/${platforms.length} platforms`)
}

main().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
