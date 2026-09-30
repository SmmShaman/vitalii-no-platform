import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Light list for the home page tiles (latest items + category counts): no
// problem/solution/result texts. The full /api/features (~700 KB) is fetched
// only when the features window opens.
export const revalidate = 3600

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ features: [], source: 'unconfigured' })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase
      .from('features')
      .select('feature_id, project_id, category, title_en, title_no, title_ua, slug_en, slug_no, slug_ua, tech_stack, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error

    const features = (data || []).map(f => ({
      id: f.feature_id,
      projectId: f.project_id,
      category: f.category,
      title: { en: f.title_en, no: f.title_no, ua: f.title_ua },
      slug: { en: f.slug_en, no: f.slug_no, ua: f.slug_ua },
      techStack: (f.tech_stack || []).slice(0, 3),
      createdAt: f.created_at,
    }))

    return NextResponse.json({ features, source: 'database', total: features.length })
  } catch (err) {
    console.error('Features lite API error:', err)
    return NextResponse.json({ features: [], source: 'error' })
  }
}
