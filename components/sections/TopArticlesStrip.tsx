'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Flame, Clock, Eye, Loader2 } from 'lucide-react'
import { getTopArticles, type TopArticle, type TopPeriod } from '@/integrations/supabase/client'
import { useTranslations } from '@/contexts/TranslationContext'
import type { ListingLang } from '@/utils/listing'

/**
 * "Most read" strip above the /news and /blog listings.
 *
 * The first window (30 days) arrives server-rendered from page.tsx, so crawlers
 * and the first paint already have it; switching to 7 days or all time fetches
 * from the get_top_articles RPC. Reading time comes from GA4 and is simply
 * omitted per article until that data exists.
 */

const PERIODS: TopPeriod[] = [7, 30, 0]

function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}

function compact(n: number): string {
  if (n >= 10_000) return `${Math.round(n / 1000)}k`
  if (n >= 1_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

interface TopArticlesStripProps {
  kind: 'news' | 'blog'
  initialItems: TopArticle[]
  initialPeriod?: TopPeriod
}

export function TopArticlesStrip({ kind, initialItems, initialPeriod = 30 }: TopArticlesStripProps) {
  const { t, currentLanguage } = useTranslations()
  const lang = currentLanguage.toLowerCase() as ListingLang

  const [period, setPeriod] = useState<TopPeriod>(initialPeriod)
  const [items, setItems] = useState<TopArticle[]>(initialItems)
  const [loading, setLoading] = useState(false)
  const [cache, setCache] = useState<Partial<Record<TopPeriod, TopArticle[]>>>({ [initialPeriod]: initialItems })

  const switchPeriod = useCallback(async (next: TopPeriod) => {
    setPeriod(next)
    const cached = cache[next]
    if (cached) {
      setItems(cached)
      return
    }
    setLoading(true)
    try {
      const rows = await getTopArticles(kind, next, 10)
      setCache(prev => ({ ...prev, [next]: rows }))
      setItems(rows)
    } finally {
      setLoading(false)
    }
  }, [cache, kind])

  useEffect(() => {
    setCache({ [initialPeriod]: initialItems })
  }, [initialItems, initialPeriod])

  if (initialItems.length === 0) return null

  const label = (p: TopPeriod) =>
    p === 7 ? t('top_period_7' as any) : p === 30 ? t('top_period_30' as any) : t('top_period_all' as any)

  return (
    <section aria-labelledby={`top-${kind}-heading`} className="mb-4">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <h2
          id={`top-${kind}-heading`}
          className="flex items-center gap-1.5 text-sm font-semibold text-content"
        >
          <Flame className="w-4 h-4 text-amber-500" />
          {t('top_read_title' as any)}
        </h2>
        <div className="flex items-center gap-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => switchPeriod(p)}
              aria-pressed={period === p}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                period === p
                  ? 'bg-brand text-white'
                  : 'bg-[#2E2E34] text-[#B0B0B8] hover:bg-[#38383E]'
              }`}
            >
              {label(p)}
            </button>
          ))}
        </div>
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-light" />}
      </div>

      <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-1">
        {items.map((item, index) => {
          const title = item[`title_${lang}`] || item.title_en || ''
          const slug = item[`slug_${lang}`] || item.slug_en || item.id
          return (
            <li key={item.id} className="flex items-baseline gap-2 min-w-0 text-xs">
              <span className="font-mono font-semibold text-[#8A8A94] w-4 flex-shrink-0">{index + 1}</span>
              <Link
                href={`/${kind}/${slug}`}
                className="truncate text-content-secondary hover:text-brand-light transition-colors"
                title={title}
              >
                {title}
              </Link>
              <span className="flex items-center gap-2 ml-auto flex-shrink-0 text-[#8A8A94] font-mono">
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />
                  {compact(item.views)}
                </span>
                {item.avg_seconds != null && item.avg_seconds > 0 && (
                  <span className="flex items-center gap-0.5" title={t('top_read_time_hint' as any)}>
                    <Clock className="w-3 h-3" />
                    {formatSeconds(item.avg_seconds)}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
