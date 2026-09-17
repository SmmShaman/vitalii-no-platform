'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/contexts/TranslationContext'

/**
 * Live page-view badge fed by the vitalii-live-stats Worker
 * (scripts/live-stats-worker): flags of whoever is on the site right now,
 * then today · 7 days · 30 days.
 * Polls once a minute; renders nothing until the first successful fetch and
 * disappears again if the Worker is unreachable.
 */

const STATS_URL = process.env.NEXT_PUBLIC_LIVE_STATS_URL || 'https://vitalii-live-stats.boytasks.workers.dev/'
const POLL_MS = 60_000

interface LiveStats {
  now: number
  /** One ISO-2 code per page load in the last 5 minutes; two readers in China give ["CN","CN"]. */
  countries?: string[]
  today: number
  week: number
  month: number
}

/** ISO-3166-1 alpha-2 → emoji flag, via the regional-indicator block. */
function flagOf(code: string): string | null {
  if (!/^[A-Za-z]{2}$/.test(code)) return null
  const upper = code.toUpperCase()
  return String.fromCodePoint(
    0x1f1e6 + upper.charCodeAt(0) - 65,
    0x1f1e6 + upper.charCodeAt(1) - 65,
  )
}

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 10_000) return `${Math.round(n / 1000)}k`
  if (n >= 1_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

interface LiveStatsBadgeProps {
  className?: string
  style?: React.CSSProperties
}

export function LiveStatsBadge({ className = '', style }: LiveStatsBadgeProps) {
  const { t } = useTranslations()
  const [stats, setStats] = useState<LiveStats | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const r = await fetch(STATS_URL, { cache: 'no-store' })
        if (!r.ok) throw new Error(String(r.status))
        const data = await r.json()
        if (!cancelled && typeof data.today === 'number') setStats(data)
      } catch {
        if (!cancelled) setStats(null)
      }
    }
    load()
    const id = setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  if (!stats) return null

  const flags = (stats.countries || []).filter(c => flagOf(c) !== null)

  const items: Array<[string, number]> = [
    [t('live_today' as any), stats.today],
    [t('live_week' as any), stats.week],
    [t('live_month' as any), stats.month],
  ]

  return (
    <div
      className={`flex items-center gap-2 whitespace-nowrap font-mono ${className}`}
      style={style}
      aria-live="polite"
      title={t('live_views_hint' as any)}
    >
      <span className="flex items-center gap-1">
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${stats.now > 0 ? 'animate-ping' : ''}`} />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-semibold">{stats.now}</span>
        <span className="opacity-70">{t('live_now' as any)}</span>
        {flags.length > 0 && (
          <span className="flex items-center gap-[1px] leading-none" aria-label={flags.join(' ')}>
            {flags.map((code, i) => (
              <span key={`${code}-${i}`} title={code}>{flagOf(code)}</span>
            ))}
          </span>
        )}
      </span>
      {items.map(([label, value]) => (
        <span key={label} className="flex items-center gap-1">
          <span className="opacity-40">·</span>
          <span className="font-semibold">{compact(value)}</span>
          <span className="opacity-70">{label}</span>
        </span>
      ))}
    </div>
  )
}
