'use client'

import { useEffect, useState, useRef } from 'react'
import { getFeatureBySlug } from '@/integrations/supabase/client'
import { getCategoryInfo, getProjectInfo } from '@/data/features'
import type { FeatureCategory, ProjectId } from '@/data/features'
import Link from 'next/link'
import { Calendar, ChevronRight, Home, ExternalLink, Brain, Video, Bot, Palette, Server, Layers, Youtube } from 'lucide-react'
import { useTranslations } from '@/contexts/TranslationContext'
import { useTrackingSafe } from '@/contexts/TrackingContext'
import { ShareButtons } from '@/components/ui/ShareButtons'
import { ArticleSkeleton } from '@/components/ui/Skeleton'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { FeatureDemoClip } from '@/components/ui/FeatureDemoClip'
import { generateFeatureSchema, formatDate } from '@/utils/seo'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Video, Bot, Palette, Server, Layers,
}

const labels = {
  en: { features: 'Features', problem: 'Problem', solution: 'How it works', result: 'Result', techStack: 'Tech Stack', notFound: 'Feature Not Found', backHome: 'Back to Home', watchNarrated: 'Watch the narrated version on YouTube', playWithSound: 'Play with sound', muteSound: 'Mute' },
  no: { features: 'Funksjoner', problem: 'Problem', solution: 'Hvordan det fungerer', result: 'Resultat', techStack: 'Teknologier', notFound: 'Funksjon ikke funnet', backHome: 'Tilbake til hjem', watchNarrated: 'Se den fortalte versjonen på YouTube', playWithSound: 'Spill av med lyd', muteSound: 'Demp lyden' },
  ua: { features: 'Функції', problem: 'Проблема', solution: 'Як це працює', result: 'Результат', techStack: 'Технології', notFound: 'Функцію не знайдено', backHome: 'На головну', watchNarrated: 'Дивитись озвучену версію на YouTube', playWithSound: 'Увімкнути звук', muteSound: 'Вимкнути звук' },
}

interface FeatureArticleProps {
  slug: string
  initialLanguage?: 'en' | 'no' | 'ua'
  initialData?: any
}

export function FeatureArticle({ slug, initialLanguage, initialData }: FeatureArticleProps) {
  const { currentLanguage } = useTranslations()
  const tracking = useTrackingSafe()
  const [feature, setFeature] = useState<any>(initialData || null)
  const [loading, setLoading] = useState(!initialData)
  const hasTrackedView = useRef(false)

  useEffect(() => {
    const fetchFeature = async () => {
      if (initialData && feature?.id === initialData.id) {
        if (!hasTrackedView.current) {
          const lang = currentLanguage.toLowerCase() as 'en' | 'no' | 'ua'
          const title = initialData[`title_${lang}`] || initialData.title_en
          tracking?.trackArticleView('feature', initialData.id, title, currentLanguage)
          hasTrackedView.current = true
        }
        return
      }

      const data = await getFeatureBySlug(slug)
      setFeature(data)
      setLoading(false)

      if (data && !hasTrackedView.current) {
        const lang = currentLanguage.toLowerCase() as 'en' | 'no' | 'ua'
        const title = data[`title_${lang}`] || data.title_en
        tracking?.trackArticleView('feature', data.id, title, currentLanguage)
        hasTrackedView.current = true
      }
    }
    fetchFeature()
  }, [slug, currentLanguage, tracking])

  const lang = currentLanguage.toLowerCase() as 'en' | 'no' | 'ua'
  const t = labels[lang]
  const title = feature?.[`title_${lang}`] || feature?.title_en || ''
  const problem = feature?.[`problem_${lang}`] || feature?.problem_en || ''
  const solution = feature?.[`solution_${lang}`] || feature?.solution_en || ''
  const result = feature?.[`result_${lang}`] || feature?.result_en || ''
  const shortDescription = feature?.[`short_description_${lang}`] || feature?.short_description_en || ''
  const currentSlug = feature?.[`slug_${lang}`] || feature?.slug_en || slug

  const schemaLang = initialLanguage || lang
  const featureSchema = feature ? generateFeatureSchema(feature, schemaLang) : null

  if (loading) {
    return <ArticleSkeleton />
  }

  if (!feature) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-content">
        <h1 className="text-2xl font-bold mb-4">{t.notFound}</h1>
        <Link href="/" className="text-brand-light hover:text-brand-light">
          {t.backHome}
        </Link>
      </div>
    )
  }

  const catInfo = getCategoryInfo(feature.category as FeatureCategory)
  const project = getProjectInfo(feature.project_id as ProjectId)
  const Icon = iconMap[catInfo.icon]

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featureSchema) }}
      />

      <article itemScope itemType="https://schema.org/CreativeWork">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-2xl mx-auto px-4 py-4"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <ol className="flex items-center gap-2 text-sm text-content-muted">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
              <a href="/" itemProp="item" className="flex items-center gap-1.5 hover:text-brand-light transition-colors">
                <Home className="w-4 h-4" />
                <span itemProp="name">Home</span>
              </a>
              <meta itemProp="position" content="1" />
            </li>
            <ChevronRight className="w-4 h-4 text-content-faint" />
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
              <a href="/features" itemProp="item" className="text-brand-light hover:text-brand-light/80 transition-colors">
                <span itemProp="name">{t.features}</span>
              </a>
              <meta itemProp="position" content="2" />
            </li>
            <ChevronRight className="w-4 h-4 text-content-faint" />
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center">
              <span
                itemProp="name"
                className="text-content font-medium truncate max-w-[200px] sm:max-w-[300px]"
                title={title}
              >
                {title}
              </span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>

        {/* Content Container */}
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          {/* Badges */}
          <ScrollReveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href={`/features?category=${encodeURIComponent(feature.category)}`}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${catInfo.color.bg} ${catInfo.color.text} hover:brightness-125 transition-all`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {catInfo.label[lang]}
              </Link>
              <Link
                href={`/features?project=${encodeURIComponent(feature.project_id)}`}
                className={`text-xs px-2.5 py-1 rounded-full ${project.color.bg} ${project.color.text} hover:brightness-125 transition-all`}
              >
                {project.name[lang]}
              </Link>
            </div>
          </ScrollReveal>

          {/* Title */}
          <ScrollReveal delay={0.1}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-content mb-4 leading-tight">
              {title}
            </h1>
          </ScrollReveal>

          {/* Meta */}
          <ScrollReveal delay={0.15}>
            <div className="flex flex-wrap items-center gap-3 text-sm text-content-muted mb-6">
              {(feature.published_at || feature.discovered_at) && (
                <time dateTime={feature.published_at || feature.discovered_at} className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-light/60" />
                  {formatDate(feature.published_at || feature.discovered_at)}
                </time>
              )}
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-content-secondary transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> {project.name[lang]}
                </a>
              )}
            </div>
          </ScrollReveal>

          {/* Demo clip. Prefer the voiced cut — it is the same file LinkedIn and
              Facebook get, so the page and the feed never show different videos.
              `story_media_url` is only set on clips whose voiceover was muxed
              separately; voice-synced clips carry the audio in demo_media_url. */}
          {(feature.story_media_url || feature.demo_media_url) && (
            <ScrollReveal delay={0.18}>
              <FeatureDemoClip
                src={feature.story_media_url || feature.demo_media_url}
                type={feature.demo_media_type}
                title={title}
                hasSound={!!feature.youtube_video_id}
                soundOnLabel={t.playWithSound}
                soundOffLabel={t.muteSound}
                className={feature.youtube_video_id ? 'mb-3' : 'mb-6'}
              />
            </ScrollReveal>
          )}

          {/* Narrated cut on YouTube. The YouTube description already links back
              here, so this closes the loop the other way — added 2026-08-26 when
              the site was the only one of the three channels with no way out. */}
          {feature.youtube_video_id && (
            <ScrollReveal delay={0.19}>
              <a
                href={`https://www.youtube.com/watch?v=${feature.youtube_video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-content-secondary hover:text-content-primary transition-colors"
              >
                <Youtube className="w-4 h-4" />
                {t.watchNarrated}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </ScrollReveal>
          )}

          {shortDescription && (
            <ScrollReveal delay={0.2}>
              <p className="text-lg text-content-secondary leading-relaxed mb-8">
                {shortDescription}
              </p>
            </ScrollReveal>
          )}

          {/* Problem */}
          <ScrollReveal delay={0.25}>
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-content-secondary uppercase tracking-wider mb-2">
                {t.problem}
              </h2>
              <p className="text-base text-content-secondary leading-relaxed">
                {problem}
              </p>
            </section>
          </ScrollReveal>

          {/* Solution */}
          <ScrollReveal delay={0.3}>
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-2">
                {t.solution}
              </h2>
              <p className="text-base text-content-secondary leading-relaxed">
                {solution}
              </p>
            </section>
          </ScrollReveal>

          {/* Result */}
          <ScrollReveal delay={0.35}>
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-brand uppercase tracking-wider mb-2">
                {t.result}
              </h2>
              <p className="text-base text-content-secondary leading-relaxed">
                {result}
              </p>
            </section>
          </ScrollReveal>

          {/* Tech Stack */}
          {feature.tech_stack?.length > 0 && (
            <ScrollReveal delay={0.4}>
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-content-muted uppercase tracking-wider mb-2">
                  {t.techStack}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {feature.tech_stack.map((tech: string) => (
                    <span
                      key={tech}
                      className={`text-xs px-2.5 py-1 rounded-md ${catInfo.color.bg} ${catInfo.color.text} border border-current/20`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* Hashtags */}
          {feature.hashtags?.length > 0 && (
            <ScrollReveal delay={0.45}>
              <div className="flex flex-wrap gap-1.5 mb-8">
                {feature.hashtags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/features?tag=${encodeURIComponent(tag.replace('#', ''))}`}
                    className="text-xs text-content-faint hover:text-content-secondary hover:bg-surface-elevated px-1.5 py-0.5 rounded transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Share */}
          <ScrollReveal delay={0.5}>
            <section aria-labelledby="share-section">
              <h2 id="share-section" className="sr-only">Share this feature</h2>
              <div className="py-6 border-t border-surface-border">
                <ShareButtons
                  url={`/features/${currentSlug}`}
                  title={title}
                  description={shortDescription}
                />
              </div>
            </section>
          </ScrollReveal>
        </div>
      </article>
    </>
  )
}
