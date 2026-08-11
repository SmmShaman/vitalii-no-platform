import { Metadata } from 'next'
import Link from 'next/link'
import { getFeaturesList } from '@/integrations/supabase/client'
import { allFeatures, categories, getCategoryInfo, getProjectInfo } from '@/data/features'
import type { FeatureCategory, ProjectId } from '@/data/features'
import { BASE_URL, generateRobots } from '@/utils/seo'

export const metadata: Metadata = {
  title: 'Features | Vitalii Berbeha',
  description:
    'Production features and case studies by Vitalii Berbeha: AI automation, bots and scraping, media pipelines, frontend UX, and DevOps infrastructure across real projects.',
  robots: generateRobots(true, true),
  alternates: {
    canonical: `${BASE_URL}/features`,
  },
  openGraph: {
    title: 'Features | Vitalii Berbeha',
    description: 'Production features and case studies: AI automation, bots, media pipelines, frontend UX, DevOps.',
    url: `${BASE_URL}/features`,
    type: 'website',
  },
}

interface FeatureRow {
  id: string
  feature_id: string
  project_id: string
  category: string
  slug_en: string | null
  slug_no: string | null
  slug_ua: string | null
  title_en: string | null
  title_no: string | null
  title_ua: string | null
  short_description_en: string | null
  short_description_no: string | null
  short_description_ua: string | null
  tech_stack: string[] | null
  hashtags: string[] | null
  published_at: string | null
  discovered_at: string | null
  created_at: string | null
}

// Map the static fallback data to the same row shape as the DB query
function staticFeatureRows(): FeatureRow[] {
  return allFeatures.map((f) => ({
    id: f.id,
    feature_id: f.id,
    project_id: f.projectId,
    category: f.category,
    slug_en: f.slug?.en || null,
    slug_no: f.slug?.no || null,
    slug_ua: f.slug?.ua || null,
    title_en: f.title.en,
    title_no: f.title.no,
    title_ua: f.title.ua,
    short_description_en: f.shortDescription.en,
    short_description_no: f.shortDescription.no,
    short_description_ua: f.shortDescription.ua,
    tech_stack: f.techStack,
    hashtags: f.hashtags,
    published_at: null,
    discovered_at: null,
    created_at: f.createdAt || null,
  }))
}

interface Props {
  searchParams: Promise<{ tag?: string; category?: string }>
}

export default async function FeaturesListingPage({ searchParams }: Props) {
  const params = await searchParams
  const tagFilter = params.tag?.trim() || null
  const categoryFilter = params.category?.trim() || null

  let features: FeatureRow[] = (await getFeaturesList()) as FeatureRow[]
  if (!features || features.length === 0) {
    features = staticFeatureRows()
  }

  if (categoryFilter) {
    features = features.filter((f) => f.category === categoryFilter)
  }

  if (tagFilter) {
    const normalized = tagFilter.replace(/^#/, '').toLowerCase()
    features = features.filter((f) =>
      (f.hashtags || []).some((h) => h.replace(/^#/, '').toLowerCase() === normalized)
    )
  }

  return (
    <main className="min-h-screen bg-surface text-content">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-content mb-3 leading-tight">
          Features
        </h1>
        <p className="text-base md:text-lg text-content-secondary leading-relaxed mb-8 max-w-3xl">
          Production features and case studies from real projects: AI automation, bots and scraping,
          media pipelines, frontend UX, and DevOps infrastructure.
        </p>

        {/* Category chips */}
        <nav aria-label="Feature categories" className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/features"
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !categoryFilter && !tagFilter
                ? 'bg-surface-elevated text-content border-surface-border'
                : 'text-content-muted border-surface-border hover:text-content hover:bg-surface-elevated'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/features?category=${encodeURIComponent(cat.id)}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                categoryFilter === cat.id
                  ? `${cat.color.bg} ${cat.color.text} border-surface-border`
                  : 'text-content-muted border-surface-border hover:text-content hover:bg-surface-elevated'
              }`}
            >
              {cat.label.en}
            </Link>
          ))}
        </nav>

        {/* Active tag filter indicator */}
        {tagFilter && (
          <p className="text-sm text-content-muted mb-6">
            Filtered by tag: <span className="text-brand-light">#{tagFilter.replace(/^#/, '')}</span>{' '}
            <Link href="/features" className="ml-2 underline hover:text-content transition-colors">
              Clear
            </Link>
          </p>
        )}

        {/* Card grid */}
        {features.length === 0 ? (
          <p className="text-content-muted py-12">No features found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const slug = feature.slug_en || feature.slug_no || feature.slug_ua || feature.feature_id
              const title = feature.title_en || feature.title_no || feature.title_ua || 'Feature'
              const description =
                feature.short_description_en ||
                feature.short_description_no ||
                feature.short_description_ua ||
                ''
              const catInfo = getCategoryInfo(feature.category as FeatureCategory)
              const project = getProjectInfo(feature.project_id as ProjectId)

              return (
                <div
                  key={feature.id}
                  className="flex flex-col rounded-xl border border-surface-border bg-surface-elevated/40 hover:bg-surface-elevated transition-colors p-5"
                >
                  <Link href={`/features/${slug}`} className="flex-1 group">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${catInfo.color.bg} ${catInfo.color.text}`}>
                        {catInfo.label.en}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${project.color.bg} ${project.color.text}`}>
                        {project.name.en}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-content leading-snug mb-2 group-hover:text-brand-light transition-colors">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-sm text-content-secondary leading-relaxed mb-3 line-clamp-3">
                        {description}
                      </p>
                    )}
                    {(feature.tech_stack?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {feature.tech_stack!.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] px-2 py-0.5 rounded-md text-content-muted border border-surface-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                  {(feature.hashtags?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      {feature.hashtags!.map((tag) => {
                        const clean = tag.replace(/^#/, '')
                        return (
                          <Link
                            key={tag}
                            href={`/features?tag=${encodeURIComponent(clean)}`}
                            className="text-[11px] text-content-faint hover:text-content-secondary transition-colors"
                          >
                            #{clean}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
