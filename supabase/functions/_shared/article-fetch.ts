/**
 * Download the real article behind a link and extract its text.
 *
 * Extracted from analyze-rss-article on 2026-07-26 so the telegram path can run the
 * same "fetch the real article before rewriting" rule the RSS path already runs. Both
 * callers must behave identically: a teaser is enough to DECIDE whether an item is
 * worth our attention, but never enough to REWRITE from. When the fetch fails we skip
 * the article instead of letting the model invent one.
 *
 * Regex-based rather than DOM-based on purpose — the edge runtime has no parser and
 * this only needs to be good enough to tell "we got the article" from "we got a nav bar".
 */

export interface ArticleContent {
  text: string
  title: string
  imageUrl: string | null
}

export async function fetchArticleContent(url: string): Promise<ArticleContent> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    return extractArticleContent(html)
  } catch (error: any) {
    console.error('Error fetching article:', error)
    throw new Error(`Failed to fetch article: ${error.message}`)
  }
}

/**
 * Extract article content from HTML using regex patterns
 * This is a simplified readability-like approach
 */
export function extractArticleContent(html: string): ArticleContent {
  // Extract title
  let title = ''
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    title = decodeHTMLEntities(titleMatch[1]).trim()
  }

  // Try og:title as fallback
  if (!title) {
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    if (ogTitleMatch) {
      title = decodeHTMLEntities(ogTitleMatch[1]).trim()
    }
  }

  // Extract og:image (decode HTML entities in URL)
  let imageUrl: string | null = null
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  if (ogImageMatch) {
    imageUrl = decodeHTMLEntities(ogImageMatch[1])
  }

  // Remove scripts, styles, and other non-content elements
  const content = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  // Try to find article content
  let articleText = ''

  // Method 1: Look for article tag
  const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  if (articleMatch) {
    articleText = articleMatch[1]
  }

  // Method 2: Look for main content div patterns
  if (!articleText || articleText.length < 500) {
    const mainPatterns = [
      /<div[^>]+class=["'][^"']*(?:post-content|article-content|entry-content|content-body|story-body|article-body)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
      /<div[^>]+id=["']content["'][^>]*>([\s\S]*?)<\/div>/i,
    ]

    for (const pattern of mainPatterns) {
      const match = content.match(pattern)
      if (match && match[1].length > (articleText?.length || 0)) {
        articleText = match[1]
      }
    }
  }

  // Method 3: Collect all paragraph text
  if (!articleText || articleText.length < 500) {
    const paragraphs: string[] = []
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
    let pMatch
    while ((pMatch = pRegex.exec(content)) !== null) {
      const pText = stripTags(pMatch[1]).trim()
      if (pText.length > 50) { // Only include substantial paragraphs
        paragraphs.push(pText)
      }
    }
    if (paragraphs.length > 0) {
      articleText = paragraphs.join('\n\n')
    }
  }

  // Clean up the extracted text
  const text = stripTags(articleText)
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()

  return { text, title, imageUrl }
}

/**
 * Strip HTML tags from text
 */
export function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
}

/**
 * Decode HTML entities
 */
export function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
}

/**
 * Is this a link we can meaningfully download an article from?
 *
 * Telegram posts carry a lot of links that are not sources: the channel's own t.me
 * permalinks, share buttons, hashtag searches, and app deep links. telegram-scraper
 * already filters those at ingest, but source_links rows written before that filter
 * existed still contain them, so re-check here.
 */
export function isFetchableSourceUrl(url: string): boolean {
  if (!url || !/^https?:\/\//i.test(url)) return false
  if (/t\.me\/|telegram\.me\/|telegram\.org\//i.test(url)) return false
  if (/twitter\.com\/intent\/|facebook\.com\/sharer\//i.test(url)) return false
  if (/\?q=%23|\?q=#/.test(url)) return false
  // Media files and archives carry no article text.
  if (/\.(jpe?g|png|gif|webp|mp4|mov|webm|mp3|pdf|zip|tar|gz)(\?|$)/i.test(url)) return false
  return true
}
