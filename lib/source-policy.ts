/**
 * Source-attribution policy.
 *
 * Owner rule, 2026-07-25:
 *  - Telegram-sourced articles (the source channels are third-party, usually
 *    Russian-language) get NO source credit and NO photo credit. We are the
 *    author of the rewritten text, and we do not want to point readers at those
 *    channels at all.
 *  - RSS / manual articles (typically Norwegian publishers) keep their source
 *    link AND their image credit. That attribution is mandatory - it is what the
 *    hotlink defence in EVIDENCE_hotlinks.md rests on. Never strip it.
 *  - Inside a Telegram-sourced article we still keep genuinely useful resource
 *    links (GitHub, documentation, demos, the product's own site) and drop only
 *    aggregators, social networks, Russian-domain sources and the channel itself.
 */

const TELEGRAM_HOSTS = ['t.me', 'telegram.me', 'telegram.dog', 'telesco.pe']

/** Aggregators, social networks and republishers - never linked from our articles. */
const BLOCKED_HOSTS = [
  ...TELEGRAM_HOSTS,
  'x.com', 'twitter.com', 'fb.com', 'facebook.com', 'instagram.com',
  'vk.com', 'ok.ru', 'dzen.ru', 'zen.yandex.ru', 'yandex.ru',
  'reddit.com', 'news.ycombinator.com', 'medium.com', 'telegra.ph', 'teletype.in',
  'habr.com', 'vc.ru', 'pikabu.ru', 'tass.ru', 'ria.ru', 'lenta.ru', 'rbc.ru',
  'kommersant.ru', 'gazeta.ru', 'iz.ru', 'rt.com',
]

function hostOf(url?: string | null): string {
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

function hostMatches(host: string, list: string[]): boolean {
  return list.some(b => host === b || host.endsWith('.' + b))
}

/** A .ru site (or a known Russian republisher) is never linked. */
function isRussianHost(host: string): boolean {
  return host.endsWith('.ru') || host.endsWith('.su') || host.endsWith('.рф')
}

export interface SourceLike {
  source_type?: string | null
  original_url?: string | null
  rss_source_url?: string | null
  source_link?: string | null
  source_links?: string[] | null
}

/**
 * True when the article came from a Telegram channel. `source_type` is the
 * primary signal; the host check is the fallback for rows fetched with a
 * narrower select (verified: every telegram row has a t.me original_url and no
 * rss/manual row does).
 */
export function isTelegramSourced(item: SourceLike | null | undefined): boolean {
  if (!item) return false
  if (item.source_type === 'telegram') return true
  return hostMatches(hostOf(item.original_url), TELEGRAM_HOSTS) ||
         hostMatches(hostOf(item.source_link), TELEGRAM_HOSTS)
}

/** Photo credit is shown for publisher-sourced articles only. */
export function showsSourceCredit(item: SourceLike | null | undefined): boolean {
  return !isTelegramSourced(item)
}

/**
 * Resource links to render under an article.
 * Publisher-sourced: untouched (attribution is mandatory).
 * Telegram-sourced: aggregators, social networks, Russian domains and the
 * channel itself are dropped; product sites, GitHub, docs and demos survive.
 */
export function visibleResourceLinks(item: SourceLike | null | undefined): string[] {
  const links = (item?.source_links || []).filter(Boolean)
  if (!isTelegramSourced(item)) {
    if (links.length > 0) return links
    const single = item?.source_link || item?.original_url
    return single ? [single] : []
  }
  return links.filter(link => {
    const host = hostOf(link)
    if (!host) return false
    if (hostMatches(host, BLOCKED_HOSTS)) return false
    if (isRussianHost(host)) return false
    return true
  })
}
