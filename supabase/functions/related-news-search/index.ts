/**
 * related-news-search — Bing News RSS fetched from the VPS on behalf of the digest render.
 *
 * Why it exists: Bing News answers GitHub-hosted runners (Azure datacenter IPs) with an
 * empty feed, so the render's related-article search found 0 articles for 9/10 stories
 * (preview run 2026-10-11). The same query from the VPS returns the real results.
 * The render calls Bing directly first and only falls back here when it gets nothing.
 *
 * Returns the real article URLs (unwrapped from bing.com/news/apiclick.aspx?url=...).
 * Filtering (Norwegian outlets, same host, syndication shells) stays in the caller.
 * Service-role key required, so this is not an open proxy.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const VERSION = '2026-10-11-v1'
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

serve(async (req) => {
  if (!SERVICE_KEY || req.headers.get('authorization') !== `Bearer ${SERVICE_KEY}`) {
    return json({ error: 'unauthorized' }, 401)
  }

  let query = ''
  try { query = String((await req.json()).query || '').trim().slice(0, 200) } catch { /* */ }
  if (query.length < 3) return json({ error: 'query required' }, 400)

  const url = `https://www.bing.com/news/search?format=rss&setlang=en-US&cc=US&q=${encodeURIComponent(query)}`
  try {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 10000)
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': UA } })
    clearTimeout(timeout)
    if (!res.ok) return json({ error: `Bing HTTP ${res.status}`, urls: [] }, 502)

    const xml = await res.text()
    const urls: string[] = []
    for (const m of xml.matchAll(/<item>[\s\S]*?<\/item>/gi)) {
      const raw = (m[0].match(/<link>([^<]+)/) || [])[1]
      if (!raw) continue
      let real = raw.trim().replace(/&amp;/g, '&')
      try { real = new URL(real).searchParams.get('url') || real } catch { continue }
      urls.push(real)
    }
    console.log(`🔎 related-news-search ${VERSION}: "${query.slice(0, 50)}" → ${urls.length}`)
    return json({ urls })
  } catch (e) {
    return json({ error: (e as Error).name === 'AbortError' ? 'Bing timeout' : (e as Error).message, urls: [] }, 502)
  }
})
