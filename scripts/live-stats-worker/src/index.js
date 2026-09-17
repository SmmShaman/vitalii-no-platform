/**
 * vitalii-live-stats — public, cached page-view numbers for the badge on vitalii.no.
 *
 * GET /  →  { now, today, week, month, updated_at }
 *   now    page loads in the last 5 minutes ("on the site right now")
 *   today  page loads since midnight Europe/Oslo
 *   week   page loads in the last 7 days (UTC days, incl. today)
 *   month  page loads in the last 30 days
 *
 * Numbers come from Cloudflare Web Analytics (GraphQL rumPageloadEventsAdaptiveGroups);
 * count is already sample-corrected by Cloudflare. The analytics token never leaves the Worker; the response is
 * cached for CACHE_SECONDS per colo, so GraphQL sees at most ~1 query/min/colo
 * (limit: 300 per 5 min per account).
 */

const GRAPHQL = 'https://api.cloudflare.com/client/v4/graphql'

const QUERY = `
query($acct:String!,$site:String!,$hosts:[String!],$now5:Time!,$todayStart:Time!,$weekDate:Date!,$monthDate:Date!){
  viewer{ accounts(filter:{accountTag:$acct}){
    now:   rumPageloadEventsAdaptiveGroups(filter:{siteTag:$site,requestHost_in:$hosts,datetime_geq:$now5},      limit:1){count sum{visits} avg{sampleInterval}}
    today: rumPageloadEventsAdaptiveGroups(filter:{siteTag:$site,requestHost_in:$hosts,datetime_geq:$todayStart},limit:1){count sum{visits} avg{sampleInterval}}
    week:  rumPageloadEventsAdaptiveGroups(filter:{siteTag:$site,requestHost_in:$hosts,date_geq:$weekDate},      limit:1){count sum{visits} avg{sampleInterval}}
    month: rumPageloadEventsAdaptiveGroups(filter:{siteTag:$site,requestHost_in:$hosts,date_geq:$monthDate},     limit:1){count sum{visits} avg{sampleInterval}}
  }}
}`

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

/** Midnight of today in Europe/Oslo, as a UTC instant. */
function osloMidnightUtc(now) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(now).reduce((o, p) => (o[p.type] = p.value, o), {})
  const asIfUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second)
  const offsetMs = asIfUtc - now.getTime()
  return new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day) - offsetMs)
}

// count / sum.visits are already extrapolated by Cloudflare's adaptive sampling
// (verified 2026-09-17: on a 1:10 day every group's count is a multiple of 10).
function scaled(group) {
  const g = (group && group[0]) || {}
  return {
    views: Math.round(g.count || 0),
    visits: Math.round((g.sum && g.sum.visits) || 0),
  }
}

async function fetchStats(env) {
  const now = new Date()
  const variables = {
    acct: env.CF_ACCOUNT_ID,
    site: env.SITE_TAG,
    hosts: (env.ALLOWED_HOSTS || 'vitalii.no').split(',').map(s => s.trim()),
    now5: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
    todayStart: osloMidnightUtc(now).toISOString(),
    weekDate: isoDate(new Date(now.getTime() - 6 * 86400 * 1000)),
    monthDate: isoDate(new Date(now.getTime() - 29 * 86400 * 1000)),
  }
  const r = await fetch(GRAPHQL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.CF_ANALYTICS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables }),
  })
  const body = await r.json()
  if (body.errors && body.errors.length) {
    throw new Error(body.errors.map(e => e.message).join('; '))
  }
  const acct = body.data.viewer.accounts[0] || {}
  const out = {}
  for (const k of ['now', 'today', 'week', 'month']) out[k] = scaled(acct[k])
  return {
    now: out.now.views,
    today: out.today.views,
    week: out.week.views,
    month: out.month.views,
    visits: { today: out.today.visits, week: out.week.visits, month: out.month.visits },
    updated_at: now.toISOString(),
  }
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
    if (request.method !== 'GET') return new Response('method not allowed', { status: 405, headers: CORS })

    const ttl = parseInt(env.CACHE_SECONDS || '60', 10)
    const cacheKey = new Request(new URL('/', request.url).toString(), { method: 'GET' })
    const cache = caches.default
    const hit = await cache.match(cacheKey)
    if (hit) return hit

    let payload, status = 200
    try {
      payload = await fetchStats(env)
    } catch (e) {
      payload = { error: String(e.message || e) }
      status = 502
    }
    const res = new Response(JSON.stringify(payload), {
      status,
      headers: {
        ...CORS,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': `public, max-age=${status === 200 ? ttl : 10}`,
      },
    })
    if (status === 200) ctx.waitUntil(cache.put(cacheKey, res.clone()))
    return res
  },
}
