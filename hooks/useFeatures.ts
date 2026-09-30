'use client'

import { useState, useEffect } from 'react'
import { allFeatures } from '@/data/features'
import type { Feature } from '@/data/features'

const EMPTY = { en: '', no: '', ua: '' }

// One request per page load for each list, shared by every component that asks.
let litePromise: Promise<Feature[] | null> | null = null
let fullPromise: Promise<Feature[] | null> | null = null

function loadLite(): Promise<Feature[] | null> {
  litePromise ||= fetch('/api/features/lite')
    .then(res => res.json())
    .then(data => (data.features?.length > 0
      ? (data.features as Partial<Feature>[]).map(f => ({
          shortDescription: EMPTY, problem: EMPTY, solution: EMPTY, result: EMPTY, hashtags: [],
          ...f,
        }) as Feature)
      : null))
    .catch(err => { console.warn('⚠️ useFeatures: lite fetch failed:', err.message || err); return null })
  return litePromise
}

function loadFull(): Promise<Feature[] | null> {
  fullPromise ||= fetch('/api/features')
    .then(res => res.json())
    .then(data => (data.features?.length > 0 ? data.features as Feature[] : null))
    .catch(err => { console.warn('⚠️ useFeatures: full fetch failed:', err.message || err); fullPromise = null; return null })
  return fullPromise
}

/**
 * Features for the site. By default only the light list (titles, category, tech, date)
 * is fetched — enough for the home tiles. Pass `full = true` once the features window
 * is opened; from then on the full texts are returned.
 */
export function useFeatures(full: boolean = false): Feature[] {
  const [lite, setLite] = useState<Feature[] | null>(null)
  const [fullList, setFullList] = useState<Feature[] | null>(null)

  useEffect(() => {
    let cancelled = false
    loadLite().then(list => { if (!cancelled && list) setLite(list) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!full) return
    let cancelled = false
    loadFull().then(list => { if (!cancelled && list) setFullList(list) })
    return () => { cancelled = true }
  }, [full])

  return fullList || lite || allFeatures
}
