#!/usr/bin/env node
// Schedule Publisher — picks next due article and runs auto-publish pipeline
// Replaces Supabase edge function schedule-publisher (blocked by 402)

import { dbQuery, sq, loadSettings } from './db.mjs'
import { publishArticle } from './auto-publish.mjs'

// Get current Oslo time (hours and minutes as local values)
function getOsloNow() {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Oslo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(now)
  const get = (type) => parseInt(parts.find(p => p.type === type)?.value || '0')
  return new Date(Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second')))
}

function isInsideWindow(windows) {
  const now = getOsloNow()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  for (const win of windows) {
    const [sh, sm] = win.start.split(':').map(Number)
    const [eh, em] = win.end.split(':').map(Number)
    const startMin = sh * 60 + sm
    const endMin = eh * 60 + em
    if (nowMin >= startMin && nowMin < endMin) return { inside: true, window: win.id }
  }
  return { inside: false }
}

async function countInFlight() {
  const rows = await dbQuery(`
    SELECT COUNT(*) AS count FROM public.news
    WHERE auto_publish_status IN ('pending','variant_selection','image_generation','content_rewrite','social_posting')
  `)
  return parseInt(rows[0]?.count || 0)
}

async function main() {
  const osloNow = getOsloNow()
  console.log(`📅 Schedule Publisher — ${osloNow.getHours()}:${String(osloNow.getMinutes()).padStart(2,'0')} Oslo time`)

  // Load config
  const settings = await loadSettings(['PUBLISH_SCHEDULE_ENABLED', 'PUBLISH_SCHEDULE_WINDOWS'])
  if (settings.PUBLISH_SCHEDULE_ENABLED === 'false') {
    console.log('📴 Schedule publishing disabled')
    return
  }

  let windows = []
  try {
    const parsed = JSON.parse(settings.PUBLISH_SCHEDULE_WINDOWS || '{"windows":[]}')
    windows = parsed.windows || []
  } catch {}

  // Check if inside active window
  const { inside, window: currentWindow } = isInsideWindow(windows)
  if (!inside) {
    console.log(`⏰ Outside publishing window — oslo ${osloNow.getHours()}:${String(osloNow.getMinutes()).padStart(2,'0')}`)
    console.log(`   Windows: ${windows.map(w => `${w.id}(${w.start}-${w.end})`).join(', ')}`)
    return
  }
  console.log(`✅ Inside window: ${currentWindow}`)

  // Check in-flight
  const inFlight = await countInFlight()
  if (inFlight > 0) {
    console.log(`⏳ ${inFlight} article(s) in-flight, waiting`)
    return
  }

  // Pick next due scheduled article
  const nowIso = osloNow.toISOString()
  const rows = await dbQuery(`
    SELECT id, telegram_message_id, preset_config
    FROM public.news
    WHERE auto_publish_status = 'scheduled'
      AND scheduled_publish_at <= ${sq(nowIso)}
    ORDER BY scheduled_publish_at ASC
    LIMIT 1
  `)

  if (!rows?.length) {
    console.log('📭 No due scheduled articles')
    return
  }

  const article = rows[0]
  console.log(`🚀 Publishing scheduled article: ${article.id}`)

  // Transition to 'queued' to prevent double-pick
  await dbQuery(`
    UPDATE public.news
    SET auto_publish_status = 'queued', auto_publish_started_at = NOW()
    WHERE id = ${sq(article.id)} AND auto_publish_status = 'scheduled'
  `)

  // Run the pipeline
  const result = await publishArticle(article.id)
  if (result.skipped) {
    console.log(`⏭️  Skipped: ${result.reason}`)
  } else {
    console.log(`✅ Published: ${result.title || article.id}`)
  }
}

main().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
