import type { SearchResult } from '@/components/search/SearchResultCard'

/**
 * Compact, language-agnostic row for the /news and /blog listings.
 *
 * The listing pages render their first page on the server so crawlers see the
 * articles without JavaScript. Rows are trimmed to what the card needs (no
 * content_* bodies) before they cross the server → client boundary, and the
 * language is applied on the client so switching EN/NO/UA never refetches.
 */
export interface ListingItem {
  id: string
  type: 'news' | 'blog'
  title_en: string | null
  title_no: string | null
  title_ua: string | null
  original_title?: string | null
  description_en: string | null
  description_no: string | null
  description_ua: string | null
  slug_en: string | null
  slug_no: string | null
  slug_ua: string | null
  image_url: string | null
  processed_image_url: string | null
  tags: string[] | null
  published_at: string | null
  views_count: number
  video_url?: string | null
  video_type?: string | null
  category?: string | null
  reading_time?: number | null
}

export type ListingLang = 'en' | 'no' | 'ua'

export function toListingItem(row: any, type: 'news' | 'blog'): ListingItem {
  const item: ListingItem = {
    id: row.id,
    type,
    title_en: row.title_en ?? null,
    title_no: row.title_no ?? null,
    title_ua: row.title_ua ?? null,
    description_en: row.description_en ?? null,
    description_no: row.description_no ?? null,
    description_ua: row.description_ua ?? null,
    slug_en: row.slug_en ?? null,
    slug_no: row.slug_no ?? null,
    slug_ua: row.slug_ua ?? null,
    image_url: row.image_url ?? null,
    processed_image_url: row.processed_image_url ?? null,
    tags: row.tags ?? null,
    published_at: row.published_at ?? null,
    views_count: row.views_count || 0,
  }
  if (type === 'news') {
    item.original_title = row.original_title ?? null
    item.video_url = row.video_url ?? null
    item.video_type = row.video_type ?? null
  } else {
    item.category = row.category ?? null
    item.reading_time = row.reading_time ?? null
  }
  return item
}

export function toSearchResult(item: ListingItem, lang: ListingLang): SearchResult {
  const result: SearchResult = {
    id: item.id,
    type: item.type,
    title: item[`title_${lang}`] || item.title_en || item.original_title || '',
    description: item[`description_${lang}`] || item.description_en || '',
    slug: item[`slug_${lang}`] || item.slug_en || item.id,
    image_url: item.image_url,
    processed_image_url: item.processed_image_url,
    tags: item.tags,
    published_at: item.published_at,
    views_count: item.views_count,
  }
  if (item.type === 'news') {
    result.video_url = item.video_url
    result.video_type = item.video_type
  } else {
    result.category = item.category
    result.reading_time = item.reading_time
  }
  return result
}

/** JSON-LD ItemList so crawlers get the article URLs even before hydration. */
export function listingItemListSchema(
  items: ListingItem[],
  type: 'news' | 'blog',
  baseUrl: string,
  lang: ListingLang = 'en'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/${type}/${item[`slug_${lang}`] || item.slug_en || item.id}`,
      name: item[`title_${lang}`] || item.title_en || item.original_title || '',
    })),
  }
}
