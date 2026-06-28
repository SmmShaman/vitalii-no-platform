#!/usr/bin/env node
// Publish Feature Social — posts a published feature project to social media
// Replaces Supabase edge function publish-feature-social (blocked by 402)
// Usage: node scripts/bypass/publish-feature-social.mjs [--lang en|no]

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
  const args = process.argv.slice(2)
  const langIdx = args.indexOf('--lang')
  const lang = langIdx >= 0 ? args[langIdx + 1] : 'en'

  console.log(`📋 Publish Feature Social — lang=${lang} — ${new Date().toISOString()}`)

  // Load LinkedIn credentials from api_settings (overrides stale GitHub Actions secrets)
  const settings = await loadSettings(['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_PERSON_URN']).catch(() => ({}))
  if (settings.LINKEDIN_ACCESS_TOKEN) LI_TOKEN = settings.LINKEDIN_ACCESS_TOKEN
  if (settings.LINKEDIN_PERSON_URN) LI_URN = settings.LINKEDIN_PERSON_URN
  console.log(`  🔑 LinkedIn token: ${settings.LINKEDIN_ACCESS_TOKEN ? 'api_settings' : 'env var'}`)

  // Find a published feature not yet posted for this language today
  const todayStart = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()

  const rows = await dbQuery(`
    SELECT f.*
    FROM public.features f
    WHERE f.status = 'published'
      AND f.title_${lang === 'no' ? 'no' : 'en'} IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.feature_social_posts fsp
        WHERE fsp.feature_id = f.feature_id
          AND fsp.language = ${sq(lang)}
          AND fsp.created_at >= ${sq(todayStart)}
      )
    ORDER BY f.created_at DESC
    LIMIT 1
  `)

  if (!rows?.length) {
    console.log('📭 No unpublished features found for today')
    return
  }

  const feature = rows[0]
  const title = lang === 'no' ? (feature.title_no || feature.title_en) : feature.title_en
  const shortDesc = lang === 'no'
    ? (feature.short_description_no || feature.short_description_en || '')
    : (feature.short_description_en || '')
  const problem = lang === 'no'
    ? (feature.problem_no || feature.problem_en || '')
    : (feature.problem_en || '')
  const solution = lang === 'no'
    ? (feature.solution_no || feature.solution_en || '')
    : (feature.solution_en || '')
  const result = lang === 'no'
    ? (feature.result_no || feature.result_en || '')
    : (feature.result_en || '')
  const techStack = (feature.tech_stack || []).join(', ')
  const hashtags = (feature.hashtags || []).join(' ')
  const featureUrl = `${WEBSITE_BASE}/features/${feature.feature_id}`

  console.log(`🔧 Feature: "${title}" (${feature.feature_id})`)

  const contentSummary = [
    `Title: ${title}`,
    shortDesc ? `Description: ${shortDesc}` : '',
    problem ? `Problem: ${problem.substring(0, 300)}` : '',
    solution ? `Solution: ${solution.substring(0, 300)}` : '',
    result ? `Result: ${result.substring(0, 200)}` : '',
    techStack ? `Tech: ${techStack}` : '',
    `URL: ${featureUrl}`,
  ].filter(Boolean).join('\n')

  const langLabel = lang === 'no' ? 'Norwegian' : 'English'
  const teaserPrompts = {
    facebook: `Write a Facebook post about this project/feature in ${langLabel}. Highlight the problem solved and result. Engaging, personal tone. 2-3 paragraphs. Include relevant hashtags. Return ONLY the post text.`,
    instagram: `Write an Instagram caption about this project in ${langLabel}. Punchy opener. What was built. 5-8 hashtags. Return ONLY the caption.`,
    linkedin: `Write a LinkedIn post showcasing this project in ${langLabel}. Professional developer perspective. Problem-solution-result format. Why it matters. 3-5 professional hashtags. Return ONLY the post text.`,
  }

  const platforms = ['facebook', 'instagram', 'linkedin']
  const results = []

  for (const platform of platforms) {
    try {
      console.log(`  📤 Posting to ${platform} (${lang})...`)
      let teaser = await callGemini(
        teaserPrompts[platform],
        contentSummary
      )
      if (hashtags && !teaser.includes('#')) teaser += `\n\n${hashtags}`
      teaser += `\n\n${featureUrl}`

      let postUrl
      if (platform === 'facebook') postUrl = await postFacebook(teaser, null)
      else if (platform === 'instagram') {
        console.log('  ⏭️  Instagram skipped: features have no image')
        results.push({ platform, skipped: true, reason: 'no image' })
        continue
      } else if (platform === 'linkedin') postUrl = await postLinkedIn(teaser)

      // Track in feature_social_posts
      await dbQuery(`
        INSERT INTO public.feature_social_posts (feature_id, platform, language, post_content, platform_post_url, status, posted_at, created_at)
        VALUES (${sq(feature.feature_id)}, ${sq(platform)}, ${sq(lang)}, ${sq(teaser.substring(0, 500))}, ${sq(postUrl)}, 'published', NOW(), NOW())
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

    const tgText = `🔧 <b>Feature Published (${lang.toUpperCase()})</b>\n\n📌 ${escapeHtml(title)}\n🔗 ${featureUrl}\n\n${lines}`
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text: tgText, parse_mode: 'HTML' }),
    }).catch(e => console.warn(`  ⚠️ Telegram: ${e.message}`))
  }

  const successCount = results.filter(r => r.success).length
  console.log(`\n✅ Done: ${successCount} platforms`)
}

main().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
