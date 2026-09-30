'use client'

import { useState, useEffect, useMemo } from 'react'
import { projects as staticProjects } from '@/data/features'
import type { ProjectInfo } from '@/data/features'

type Localized = { en: string | null; no: string | null; ua: string | null }

interface ProjectFeatureRow {
  id: string
  title: Localized
  shortDescription: Localized
  slug: Localized
  createdAt?: string
}

interface ProjectWithFeatureCount extends ProjectInfo {
  featureCount?: number
  imageUrl?: string
  longDescription?: Localized
  techTags?: string[]
  latestFeatures?: ProjectFeatureRow[]
}

export interface ProjectFeatureLink {
  id: string
  title: string
  short: string
  slug: string
}

export interface CarouselProject {
  title: string
  short: string
  full: string
  image?: string
  projectId: string
  featureCount: number
  techTags: string[]
  features: ProjectFeatureLink[]
}

const pick = (v: Localized | undefined, lang: 'en' | 'no' | 'ua') => v?.[lang] || v?.en || v?.no || v?.ua || ''

export function useProjects(): ProjectInfo[] {
  const [projects, setProjects] = useState<ProjectWithFeatureCount[]>(staticProjects)

  useEffect(() => {
    let cancelled = false
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data.projects?.length > 0) {
          setProjects(data.projects)
        }
      })
      .catch((err) => {
        console.warn('⚠️ useProjects: API fetch failed, using static fallback:', err.message || err)
      })
    return () => { cancelled = true }
  }, [])

  return projects
}

export function useProjectsCarousel(lang: 'en' | 'no' | 'ua'): { carousel: CarouselProject[]; projects: ProjectWithFeatureCount[] } {
  const [projects, setProjects] = useState<ProjectWithFeatureCount[]>(staticProjects)

  useEffect(() => {
    let cancelled = false
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data.projects?.length > 0) {
          setProjects(data.projects)
        }
      })
      .catch((err) => {
        console.warn('⚠️ useProjectsCarousel: API fetch failed, using static fallback:', err.message || err)
      })
    return () => { cancelled = true }
  }, [])

  const carousel = useMemo(() => {
    return projects.map(p => {
      const name = typeof p.name === 'string' ? p.name : (p.name as Record<string, string>)?.[lang] || (p.name as Record<string, string>)?.en || String(p.name)
      const desc = typeof p.description === 'string' ? p.description : (p.description as Record<string, string>)?.[lang] || (p.description as Record<string, string>)?.en || ''
      const row = p as ProjectWithFeatureCount

      return {
        title: name,
        short: desc.length > 120 ? desc.slice(0, 117) + '...' : desc,
        // Full write-up for the detail view; the short DB description is the fallback
        full: pick(row.longDescription, lang) || desc,
        image: row.imageUrl,
        projectId: p.id,
        featureCount: row.featureCount || 0,
        techTags: row.techTags || [],
        features: (row.latestFeatures || []).map(f => ({
          id: f.id,
          title: pick(f.title, lang),
          short: pick(f.shortDescription, lang),
          slug: pick(f.slug, lang) || f.id,
        })),
      }
    })
  }, [projects, lang])

  return { carousel, projects }
}
