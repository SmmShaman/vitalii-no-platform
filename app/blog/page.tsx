import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { BlogListingClient } from './BlogListingClient'
import { getAllBlogPosts, getTagFrequencies, getTopArticles } from '@/integrations/supabase/client'
import { BASE_URL } from '@/utils/seo'
import { toListingItem, listingItemListSchema } from '@/utils/listing'

export const metadata: Metadata = {
  title: 'Blog | Vitalii Berbeha',
  description: 'Blog posts about web development, AI, automation, and technology by Vitalii Berbeha.',
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog | Vitalii Berbeha',
    description: 'Blog posts about web development, AI, automation, and technology.',
    url: `${BASE_URL}/blog`,
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
      getAllBlogPosts({ limit: PAGE_SIZE, offset: 0 }),
      getTagFrequencies('blog'),
      getTopArticles('blog', TOP_PERIOD, 10),
    ])
    return {
      items: (data || []).map((row: any) => toListingItem(row, 'blog')),
      count: count || 0,
      tags,
      top,
    }
  },
  ['blog-listing-first-page'],
  { revalidate: 600 }
)

export const revalidate = 600

export default async function BlogListingPage() {
  const { items, count, tags, top } = await getFirstPage()

  return (
    <>
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(listingItemListSchema(items, 'blog', BASE_URL)),
          }}
        />
      )}
      <BlogListingClient
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
