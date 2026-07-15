import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { Metadata } from 'next'
import { getFeatureBySlug } from '@/integrations/supabase/client'
import { FeatureArticle } from './FeatureArticle'
import { ArticleLayout } from '@/components/ArticleLayout'
import {
  BASE_URL,
  detectSlugLanguage,
  generateAlternates,
  generateOpenGraph,
  generateTwitterCard,
  generateRobots,
  truncateDescription,
} from '@/utils/seo'

// unstable_cache: tells Next.js this data is cacheable (ISR-compatible)
// cache(): deduplicates within the same request (generateMetadata + page)
const getFeatureCached = cache(
  unstable_cache(
    async (slug: string) => getFeatureBySlug(slug),
    ['feature-by-slug'],
    { revalidate: 3600 }
  )
)

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const feature = await getFeatureCached(slug)

  if (!feature) {
    return {
      title: 'Feature Not Found | Vitalii Berbeha',
      description: 'The requested feature could not be found.',
      robots: generateRobots(false, true),
    }
  }

  const lang = detectSlugLanguage({ slug_en: feature.slug_en, slug_no: feature.slug_no, slug_ua: feature.slug_ua }, slug)
  const title = feature[`title_${lang}`] || feature.title_en || 'Feature'
  const description = truncateDescription(feature[`short_description_${lang}`] || feature.short_description_en)
  const url = `${BASE_URL}/features/${slug}`

  return {
    title: `${title} | Vitalii Berbeha Features`,
    description,
    keywords: feature.hashtags?.join(', ') || feature.tech_stack?.join(', ') || '',
    authors: [{ name: 'Vitalii Berbeha', url: BASE_URL }],
    alternates: generateAlternates('features', {
      en: feature.slug_en,
      no: feature.slug_no,
      ua: feature.slug_ua,
    }, slug),
    openGraph: generateOpenGraph(
      title,
      description,
      null,
      url,
      'article',
      {
        publishedTime: feature.published_at || feature.discovered_at,
        modifiedTime: feature.updated_at || feature.published_at || feature.discovered_at,
        authors: ['Vitalii Berbeha'],
        tags: feature.hashtags,
        section: 'Features',
      },
      lang
    ),
    twitter: generateTwitterCard(title, description, null),
    robots: generateRobots(true, true),
  }
}

// ISR: pages generated on-demand, cached for 1 hour
export const revalidate = 3600
export const dynamicParams = true

// Empty staticParams enables ISR on-demand generation (without build-time generation)
export function generateStaticParams() {
  return []
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params
  const feature = await getFeatureCached(slug)
  const lang = feature ? detectSlugLanguage({ slug_en: feature.slug_en, slug_no: feature.slug_no, slug_ua: feature.slug_ua }, slug) : 'en'

  return (
    <ArticleLayout>
      <FeatureArticle slug={slug} initialLanguage={lang} initialData={feature} />
    </ArticleLayout>
  )
}
