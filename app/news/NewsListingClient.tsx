'use client'

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getAllNews, getTagFrequencies } from '@/integrations/supabase/client'
import type { TagFrequency } from '@/integrations/supabase/client'
import { useTranslations, type Language } from '@/contexts/TranslationContext'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { toListingItem, toSearchResult, type ListingItem, type ListingLang } from '@/utils/listing'
import { CategoryTabs, getActivePageBg } from '@/components/CategoryTabs'
import { Loader2, SearchX, ArrowLeft } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

const Footer = dynamic(
  () => import('@/components/layout/Footer').then(mod => mod.Footer),
  { ssr: false }
)

export interface NewsListingProps {
  /** First page rendered on the server (see page.tsx); empty = fetch on the client as before. */
  initialItems?: ListingItem[]
  initialCount?: number
  initialTags?: TagFrequency[]
  pageSize?: number
}

const DEFAULT_PAGE_SIZE = 12

// useSearchParams() makes a statically rendered route bail out to client
// rendering up to the nearest Suspense boundary — which is why crawlers saw an
// empty shell. Keep it in a leaf that renders nothing, so the list itself is
// part of the server HTML and only the ?tag= sync waits for hydration.
function TagParamSync({ onChange }: { onChange: (tag: string) => void }) {
  const searchParams = useSearchParams()
  const tag = searchParams.get('tag') || ''
  useEffect(() => {
    onChange(tag)
  }, [tag, onChange])
  return null
}

function NewsListingInner({
  initialItems = [],
  initialCount = 0,
  initialTags = [],
  pageSize = DEFAULT_PAGE_SIZE,
}: NewsListingProps) {
  const router = useRouter()
  const { t, currentLanguage, setCurrentLanguage } = useTranslations()
  const languages: Language[] = ['NO', 'EN', 'UA']

  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(var(--surface-listing))'
    return () => { document.body.style.backgroundColor = '' }
  }, [])

  const [tagParam, setTagParam] = useState('')

  const [items, setItems] = useState<ListingItem[]>(initialItems)
  const [totalCount, setTotalCount] = useState(initialCount)
  const [loading, setLoading] = useState(initialItems.length === 0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(pageSize < initialCount)
  const [tags, setTags] = useState<TagFrequency[]>(initialTags)
  // The server already rendered page 0 without a tag filter — skip that first fetch once.
  const serverPagePending = useRef(initialItems.length > 0)

  // Determine active tag state
  const visibleCount = 7 // will be adjusted by CategoryTabs based on mobile
  const topTagNames = useMemo(() => tags.slice(0, visibleCount).map(t => t.tag_name), [tags])
  const activeTag = tagParam === '__other__' ? '__other__' : (tagParam || null)

  useEffect(() => {
    if (initialTags.length === 0) getTagFrequencies('news').then(setTags)
  }, [initialTags.length])

  const fetchResults = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    if (!append) setLoading(true)
    else setLoadingMore(true)

    const offset = pageNum * pageSize

    try {
      const filters: any = {
        limit: pageSize,
        offset,
      }

      if (tagParam === '__other__') {
        // "Other" — exclude top tags
        filters.excludeTags = topTagNames
      } else if (tagParam) {
        filters.tags = [tagParam]
      }

      const { data, count } = await getAllNews(filters)

      const rows: ListingItem[] = (data || []).map((item: any) => toListingItem(item, 'news'))

      if (append) {
        setItems(prev => [...prev, ...rows])
      } else {
        setItems(rows)
      }

      setTotalCount(count || 0)
      setHasMore(offset + pageSize < (count || 0))
    } catch (error) {
      console.error('News listing error:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [tagParam, topTagNames, pageSize])

  useEffect(() => {
    setPage(0)
    if (serverPagePending.current && !tagParam) {
      serverPagePending.current = false
      return
    }
    serverPagePending.current = false
    fetchResults(0, false)
  }, [fetchResults, tagParam])

  // Language is applied here, so switching EN/NO/UA never refetches.
  const lang = currentLanguage.toLowerCase() as ListingLang
  const results = useMemo(() => items.map(item => toSearchResult(item, lang)), [items, lang])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchResults(nextPage, true)
  }

  const handleTagChange = (tag: string | null) => {
    router.replace(tag ? `/news?tag=${encodeURIComponent(tag)}` : '/news', { scroll: false })
  }

  const pageBgTint = getActivePageBg(activeTag, tags, 7)

  return (
    <div className="min-h-screen bg-[rgb(var(--surface-listing))] flex flex-col" style={{ backgroundImage: pageBgTint !== 'transparent' ? `linear-gradient(${pageBgTint}, ${pageBgTint})` : undefined }}>
      <Suspense fallback={null}>
        <TagParamSync onChange={setTagParam} />
      </Suspense>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[rgb(var(--surface-listing))]/95 backdrop-blur-sm border-b border-[#3C3C44]">
        <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#B0B0B8] hover:text-content transition-colors group flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-amber-500 text-lg hidden sm:inline">Vitalii Berbeha</span>
          </Link>

          <h1 className="text-lg font-semibold text-content flex-1">
            {t('news_listing_title')}
          </h1>

          {/* Language buttons — far right */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLanguage(lang)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  currentLanguage === lang
                    ? 'bg-brand text-white'
                    : 'bg-[#2E2E34] text-[#B0B0B8] hover:bg-[#38383E]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        {tags.length > 0 && (
          <div className="px-4 sm:px-6 lg:px-8 py-2 border-t border-[#3C3C44]/50">
            <CategoryTabs
              tags={tags}
              activeTag={activeTag}
              onTagChange={handleTagChange}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-light animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchX className="w-12 h-12 text-[#8A8A94] mb-4" />
            <p className="text-lg font-medium text-[#B0B0B8]">{t('listing_no_articles')}</p>
          </div>
        ) : (
          <>
            {/* Count */}
            <div className="mb-3 text-xs text-[#8A8A94]">
              {totalCount} {t('search_results_count')}
            </div>

            {/* Masonry Layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
              <AnimatePresence mode="popLayout">
                {results.map((result, index) => (
                  <SearchResultCard
                    key={`news-${result.id}`}
                    result={result}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-full text-sm font-medium bg-[#2E2E34] text-content-secondary hover:bg-[#38383E] disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('listing_load_more')}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export function NewsListingClient(props: NewsListingProps) {
  return <NewsListingInner {...props} />
}
