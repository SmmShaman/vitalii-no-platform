import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { NewsListingClient } from './NewsListingClient'
import { getAllNews, getTagFrequencies, getTopArticles } from '@/integrations/supabase/client'
import { BASE_URL } from '@/utils/seo'
import { toListingItem, listingItemListSchema } from '@/utils/listing'

export const metadata: Metadata = {
  title: 'News | Vitalii Berbeha',
  description: 'Latest tech news, AI updates, and industry insights curated by Vitalii Berbeha.',
  alternates: {
    canonical: `${BASE_URL}/news`,
  },
  openGraph: {
    title: 'News | Vitalii Berbeha',
    description: 'Latest tech news, AI updates, and industry insights.',
    url: `${BASE_URL}/news`,
    type: 'website',
  },
}

const PAGE_SIZE = 12
const TOP_PERIOD = 30 as const

// First page + tag bar are rendered on the server so crawlers see the articles
// without JavaScript; the client takes over for tags, paging and language.
const getFirstPage = unstable_cache(
  async () => {
    const [{ data, count }, tags, top] = await Promise.all([
      getAllNews({ limit: PAGE_SIZE, offset: 0 }),
      getTagFrequencies('news'),
      getTopArticles('news', TOP_PERIOD, 10),
    ])
    return {
      items: (data || []).map((row: any) => toListingItem(row, 'news')),
      count: count || 0,
      tags,
      top,
    }
  },
  ['news-listing-first-page'],
  { revalidate: 600 }
)

export const revalidate = 600

export default async function NewsListingPage() {
  const { items, count, tags, top } = await getFirstPage()

  return (
    <>
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(listingItemListSchema(items, 'news', BASE_URL)),
          }}
        />
      )}
      <NewsListingClient
        initialTop={top}
        initialTopPeriod={TOP_PERIOD}
        initialItems={items}
        initialCount={count}
        initialTags={tags}
        pageSize={PAGE_SIZE}
      />
    </>
  )
}
