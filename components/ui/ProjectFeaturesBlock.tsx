'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { ProjectFeatureLink } from '@/hooks/useProjects'

const labels = {
  en: { tech: 'Built with', features: 'Features in this project', all: (n: number) => `All ${n} features`, none: 'No published features yet.' },
  no: { tech: 'Bygget med', features: 'Funksjoner i dette prosjektet', all: (n: number) => `Alle ${n} funksjoner`, none: 'Ingen publiserte funksjoner ennå.' },
  ua: { tech: 'Технології', features: 'Фічі цього проєкту', all: (n: number) => `Усі фічі (${n})`, none: 'Опублікованих фіч поки немає.' },
}

interface ProjectFeaturesBlockProps {
  projectId: string
  techTags: string[]
  features: ProjectFeatureLink[]
  featureCount: number
  lang: 'en' | 'no' | 'ua'
  accent?: string
}

// Tech tags + newest features of one project, shown under the project write-up
// on both the desktop modal and the mobile detail view.
export const ProjectFeaturesBlock = ({ projectId, techTags, features, featureCount, lang, accent }: ProjectFeaturesBlockProps) => {
  const t = labels[lang]

  return (
    <div className="mt-8 space-y-6">
      {techTags.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-content-muted mb-2">{t.tech}</h3>
          <div className="flex flex-wrap gap-2">
            {techTags.map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-surface-elevated border border-surface-border text-content-secondary">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-content-muted mb-2">
          {t.features}{featureCount > 0 ? ` · ${featureCount}` : ''}
        </h3>
        {features.length === 0 ? (
          <p className="text-sm text-content-muted">{t.none}</p>
        ) : (
          <ul className="space-y-2">
            {features.map(f => (
              <li key={f.id}>
                <Link
                  href={`/features/${encodeURIComponent(f.slug)}`}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-elevated border border-surface-border hover:bg-surface-border transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-content leading-snug">{f.title}</p>
                    {f.short && <p className="text-sm text-content-secondary mt-0.5 leading-relaxed line-clamp-2">{f.short}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-content-muted" />
                </Link>
              </li>
            ))}
          </ul>
        )}
        {featureCount > features.length && (
          <Link
            href={`/features?project=${encodeURIComponent(projectId)}`}
            className="mt-3 inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-surface-border text-content transition-colors hover:brightness-110"
            style={accent ? { borderColor: accent, color: accent } : undefined}
          >
            {t.all(featureCount)} <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </section>
    </div>
  )
}
