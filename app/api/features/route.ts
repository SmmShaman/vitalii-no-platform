import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cache the GET result for 1 hour instead of hitting Supabase on every visit
export const revalidate = 3600

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Fallback to static data if Supabase not configured
    const { allFeatures } = await import('@/data/features')
    return NextResponse.json({ features: allFeatures, source: 'static' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: features, error } = await supabase
      .from('features')
      .select('*, feature_projects(repo_url)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform DB rows to Feature interface format
    const formatted = (features || []).map(f => ({
      id: f.feature_id,
      projectId: f.project_id,
      category: f.category,
      slug: { en: f.slug_en, no: f.slug_no, ua: f.slug_ua },
      title: { en: f.title_en, no: f.title_no, ua: f.title_ua },
      shortDescription: { en: f.short_description_en, no: f.short_description_no, ua: f.short_description_ua },
      problem: { en: f.problem_en, no: f.problem_no, ua: f.problem_ua },
      solution: { en: f.solution_en, no: f.solution_no, ua: f.solution_ua },
      result: { en: f.result_en, no: f.result_no, ua: f.result_ua },
      techStack: f.tech_stack || [],
      hashtags: f.hashtags || [],
      sourceCommits: f.source_commits || [],
      createdAt: f.created_at,
      demoMediaUrl: f.demo_media_url || null,
      demoMediaType: f.demo_media_type || null,
      repoUrl: (f.feature_projects as { repo_url?: string } | null)?.repo_url || null,
    }))

    return NextResponse.json({ features: formatted, source: 'database', total: formatted.length })
  } catch (err) {
    console.error('Features API error:', err)
    // Fallback to static
    const { allFeatures } = await import('@/data/features')
    return NextResponse.json({ features: allFeatures, source: 'static_fallback' })
  }
}
