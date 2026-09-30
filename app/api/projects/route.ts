import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Cache for 10 minutes; projects and features change at most a few times a day
export const revalidate = 600

const LATEST_FEATURES = 6
const TECH_TAGS = 8

export async function GET() {
  if (!supabaseUrl || !supabaseAnonKey) {
    const { projects } = await import('@/data/features')
    return NextResponse.json({ projects, source: 'static' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: rows, error } = await supabase
      .from('feature_projects')
      .select('*')
      .eq('is_active', true)
      .order('name_en', { ascending: true })

    if (error) throw error

    // Features per project: count, most used tech, newest few for the detail view
    const { data: featureRows } = await supabase
      .from('features')
      .select('feature_id, project_id, tech_stack, created_at, title_en, title_no, title_ua, short_description_en, short_description_no, short_description_ua, slug_en, slug_no, slug_ua')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    const countMap: Record<string, number> = {}
    const techMap: Record<string, Record<string, number>> = {}
    const latestMap: Record<string, unknown[]> = {}
    for (const f of featureRows || []) {
      countMap[f.project_id] = (countMap[f.project_id] || 0) + 1
      const techs = (techMap[f.project_id] ||= {})
      for (const t of (f.tech_stack || []) as string[]) techs[t] = (techs[t] || 0) + 1
      const latest = (latestMap[f.project_id] ||= [])
      if (latest.length < LATEST_FEATURES) {
        latest.push({
          id: f.feature_id,
          title: { en: f.title_en, no: f.title_no, ua: f.title_ua },
          shortDescription: { en: f.short_description_en, no: f.short_description_no, ua: f.short_description_ua },
          slug: { en: f.slug_en, no: f.slug_no, ua: f.slug_ua },
          createdAt: f.created_at,
        })
      }
    }
    const topTech = (id: string) =>
      Object.entries(techMap[id] || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, TECH_TAGS)
        .map(([t]) => t)

    const projects = (rows || []).map(r => ({
      id: r.id,
      name: { en: r.name_en, no: r.name_no, ua: r.name_ua },
      description: { en: r.description_en, no: r.description_no, ua: r.description_ua },
      longDescription: { en: r.long_description_en, no: r.long_description_no, ua: r.long_description_ua },
      url: r.repo_url || undefined,
      badge: r.badge || r.id.charAt(0).toUpperCase(),
      color: {
        bg: r.color_bg || 'bg-gray-500/20',
        text: r.color_text || 'text-gray-400',
      },
      imageUrl: r.image_url || undefined,
      featureCount: countMap[r.id] || 0,
      techTags: topTech(r.id),
      latestFeatures: latestMap[r.id] || [],
    }))

    return NextResponse.json({ projects, source: 'database', total: projects.length })
  } catch (err) {
    console.error('Projects API error:', err)
    const { projects } = await import('@/data/features')
    return NextResponse.json({ projects, source: 'static_fallback' })
  }
}
