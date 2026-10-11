/**
 * Article Image Scraper
 *
 * Fetches the original article page and extracts all relevant images.
 * Returns real article images (product photos, event photos, infographics)
 * instead of generic stock photos.
 *
 * No external dependencies — uses regex-based HTML parsing.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MAX_IMAGES_PER_ARTICLE = 8;
const MIN_IMAGE_WIDTH = 300;     // skip tiny icons/logos
const MIN_IMAGE_SIZE = 20_000;   // 20 KB minimum
const MAX_IMAGE_SIZE = 10_000_000; // 10 MB maximum
const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT = 'Mozilla/5.0 (compatible; DailyNewsBot/1.0)';
// Bing News serves its RSS to a browser UA; the bot UA above is fine for article pages.
const BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

// Domains to skip (ad networks, trackers, social widgets)
const BLOCKED_DOMAINS = new Set([
  'facebook.com', 'fbcdn.net', 'doubleclick.net', 'googlesyndication.com',
  'googleadservices.com', 'google-analytics.com', 'twitter.com',
  'platform.twitter.com', 'ads.', 'pixel.', 'tracking.',
  'gravatar.com', 'wp.com/latex', 'shields.io', 'badge.',
]);

// File patterns to skip
const BLOCKED_PATTERNS = [
  /logo/i, /icon/i, /favicon/i, /avatar/i, /badge/i, /button/i,
  /spinner/i, /loading/i, /placeholder/i, /spacer/i, /pixel\./i,
  /1x1/i, /blank\./i, /transparent\./i, /emoji/i, /smiley/i,
  /share/i, /social/i, /widget/i, /banner-ad/i, /advert/i,
];

// ---------------------------------------------------------------------------
// HTML parsing helpers (regex-based, no dependencies)
// ---------------------------------------------------------------------------

/**
 * Extract Open Graph and meta images from HTML head.
 */
function extractMetaImages(html) {
  const images = [];

  // og:image
  const ogMatches = html.matchAll(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi);
  for (const m of ogMatches) images.push({ url: m[1], priority: 10, source: 'og:image' });

  // og:image reverse attribute order
  const ogMatches2 = html.matchAll(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/gi);
  for (const m of ogMatches2) images.push({ url: m[1], priority: 10, source: 'og:image' });

  // twitter:image
  const twMatches = html.matchAll(/<meta[^>]*(?:name|property)=["']twitter:image["'][^>]*content=["']([^"']+)["']/gi);
  for (const m of twMatches) images.push({ url: m[1], priority: 9, source: 'twitter:image' });

  // twitter:image reverse
  const twMatches2 = html.matchAll(/<meta[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["']twitter:image["']/gi);
  for (const m of twMatches2) images.push({ url: m[1], priority: 9, source: 'twitter:image' });

  return images;
}

/**
 * Extract images from article body content.
 * Prioritizes images inside <article>, <main>, or content divs.
 */
function extractBodyImages(html) {
  const images = [];

  // Try to find article/main content region
  let contentHtml = '';
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const contentDivMatch = html.match(/<div[^>]*class=["'][^"']*(?:article|post|entry|story|content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);

  if (articleMatch) contentHtml = articleMatch[1];
  else if (mainMatch) contentHtml = mainMatch[1];
  else if (contentDivMatch) contentHtml = contentDivMatch[1];
  else contentHtml = html; // fallback to full page

  // Extract all <img> tags
  const imgMatches = contentHtml.matchAll(/<img[^>]*\bsrc=["']([^"']+)["'][^>]*/gi);
  for (const m of imgMatches) {
    const tag = m[0];
    const src = m[1];

    // Check dimensions if available
    const widthMatch = tag.match(/width=["']?(\d+)/i);
    const heightMatch = tag.match(/height=["']?(\d+)/i);
    const width = widthMatch ? parseInt(widthMatch[1]) : 0;
    const height = heightMatch ? parseInt(heightMatch[1]) : 0;

    // Skip if explicitly small
    if (width > 0 && width < MIN_IMAGE_WIDTH) continue;
    if (height > 0 && height < 100) continue;

    // Extract alt text for relevance scoring
    const altMatch = tag.match(/alt=["']([^"']*?)["']/i);
    const alt = altMatch ? altMatch[1] : '';

    // Priority: larger images and those with alt text rank higher
    let priority = 5;
    if (width >= 600 || (alt && alt.length > 10)) priority = 7;
    if (width >= 1000) priority = 8;

    images.push({ url: src, priority, source: 'img', width, height, alt });
  }

  // Extract <picture><source> tags (modern responsive images)
  const sourceMatches = contentHtml.matchAll(/<source[^>]*\bsrcset=["']([^"'\s,]+)/gi);
  for (const m of sourceMatches) {
    images.push({ url: m[1], priority: 6, source: 'picture' });
  }

  // Extract CSS background images from figure/div tags
  const bgMatches = contentHtml.matchAll(/style=["'][^"']*background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/gi);
  for (const m of bgMatches) {
    images.push({ url: m[1], priority: 4, source: 'bg-image' });
  }

  return images;
}

/**
 * Extract images from JSON-LD structured data.
 */
function extractJsonLdImages(html) {
  const images = [];
  const scriptMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

  for (const m of scriptMatches) {
    try {
      const data = JSON.parse(m[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item.image) {
          const imgs = Array.isArray(item.image) ? item.image : [item.image];
          for (const img of imgs) {
            const url = typeof img === 'string' ? img : img?.url;
            if (url) images.push({ url, priority: 8, source: 'json-ld' });
          }
        }
        if (item.thumbnailUrl) {
          images.push({ url: item.thumbnailUrl, priority: 7, source: 'json-ld-thumb' });
        }
      }
    } catch { /* ignore invalid JSON-LD */ }
  }

  return images;
}

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

function resolveUrl(imageUrl, baseUrl) {
  try {
    if (imageUrl.startsWith('data:')) return null; // skip data URIs
    if (imageUrl.startsWith('//')) return `https:${imageUrl}`;
    return new URL(imageUrl, baseUrl).toString();
  } catch {
    return null;
  }
}

function isBlockedUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    for (const blocked of BLOCKED_DOMAINS) {
      if (hostname.includes(blocked)) return true;
    }
  } catch {
    return true;
  }
  const path = url.toLowerCase();
  return BLOCKED_PATTERNS.some((p) => p.test(path));
}

function getImageExtension(url, contentType) {
  if (contentType?.includes('jpeg') || contentType?.includes('jpg')) return '.jpg';
  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('webp')) return '.webp';
  if (contentType?.includes('gif')) return '.gif';
  if (contentType?.includes('avif')) return '.avif';

  const ext = url.match(/\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i);
  if (ext) return `.${ext[1].toLowerCase()}`;
  return '.jpg'; // default
}

// ---------------------------------------------------------------------------
// Download with validation
// ---------------------------------------------------------------------------

async function downloadImage(url, destPath) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    });

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('image')) return null;

    const contentLength = parseInt(res.headers.get('content-length') || '0');
    if (contentLength > 0 && contentLength < MIN_IMAGE_SIZE) return null;
    if (contentLength > MAX_IMAGE_SIZE) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_IMAGE_SIZE) return null;
    if (buf.length > MAX_IMAGE_SIZE) return null;

    await writeFile(destPath, buf);
    return { size: buf.length, contentType };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Scrape images from an article's source URL.
 *
 * @param {string} articleUrl - The source article URL
 * @param {string} publicDir - Directory to save downloaded images
 * @param {string} prefix - Filename prefix (e.g., "article_0")
 * @param {object} options
 * @param {number} options.maxImages - Max images to return (default 5)
 * @param {string[]} options.existingImages - Already known image URLs to include
 * @returns {Promise<{images: string[], attribution: string[]}>}
 */
export async function scrapeArticleImages(articleUrl, publicDir, prefix, options = {}) {
  const { maxImages = MAX_IMAGES_PER_ARTICLE, existingImages = [] } = options;
  const result = { images: [], attribution: [] };

  if (!articleUrl) return result;

  await mkdir(publicDir, { recursive: true });

  console.log(`[scraper] Fetching: ${articleUrl}`);

  let html;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.log(`[scraper] HTTP ${res.status} for ${articleUrl}`);
      return result;
    }
    html = await res.text();
  } catch (e) {
    console.log(`[scraper] Fetch failed: ${e.message}`);
    return result;
  }

  // Collect all candidate images from different sources
  const candidates = [
    ...extractMetaImages(html),
    ...extractJsonLdImages(html),
    ...extractBodyImages(html),
  ];

  // Add existing images from DB (highest priority)
  for (const url of existingImages) {
    if (url) candidates.unshift({ url, priority: 11, source: 'db' });
  }

  // Resolve URLs, deduplicate, filter blocked
  const seen = new Set();
  const resolved = [];
  for (const c of candidates) {
    const url = resolveUrl(c.url, articleUrl);
    if (!url) continue;
    if (seen.has(url)) continue;
    if (isBlockedUrl(url)) continue;
    // Skip SVGs (usually icons/logos)
    if (url.toLowerCase().endsWith('.svg')) continue;
    seen.add(url);
    resolved.push({ ...c, url });
  }

  // Sort by priority (highest first)
  resolved.sort((a, b) => b.priority - a.priority);

  // Download top candidates
  let downloaded = 0;
  for (const candidate of resolved) {
    if (downloaded >= maxImages) break;

    const ext = getImageExtension(candidate.url, '');
    const filename = `${prefix}_scraped_${downloaded}${ext}`;
    const destPath = join(publicDir, filename);

    const dl = await downloadImage(candidate.url, destPath);
    if (dl) {
      result.images.push(filename);
      result.attribution.push(`Source: ${new URL(articleUrl).hostname}`);
      console.log(`[scraper]   ✅ ${filename} (${(dl.size / 1024).toFixed(0)} KB, ${candidate.source})`);
      downloaded++;
    }
  }

  console.log(`[scraper] ${articleUrl}: ${downloaded}/${resolved.length} images downloaded`);
  return result;
}

/**
 * Norwegian outlets are never used as a related-article image source (owner rule,
 * 2026-10-11): their photos are largely NTB/Scanpix, and a downloaded copy in a
 * rendered video is exactly the exposure the Copyright Agent claims were about.
 * Everything under .no is skipped, plus Norwegian outlets on other TLDs.
 */
const NORWEGIAN_HOSTS = ['e24.com', 'nettavisen.com', 'tek.com'];
// Syndication shells: the page is a JS app with no article photos in the HTML.
const RELATED_SKIP_HOSTS = ['msn.com', 'bing.com', 'news.google.com', 'consent.google.com'];

function isNorwegianHost(host) {
  return host.endsWith('.no') || NORWEGIAN_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
}

/**
 * Search news for related articles covering the same story.
 * Returns up to `limit` article URLs on other (non-Norwegian) news sites.
 *
 * Bing News RSS, because Google News RSS no longer resolves (0 related articles in
 * every digest render checked in Oct 2026):
 * its <link>s are opaque news.google.com/rss/articles/CBMi... ids that redirect to
 * consent.google.com, never to the article, so every story got 0 related articles.
 * Bing wraps each link as bing.com/news/apiclick.aspx?...&url=<real article URL>.
 *
 * @param {string} headline - Article headline to search for
 * @param {string} originalUrl - Original article URL (to exclude from results)
 * @param {number} limit - Max URLs to return (default 3)
 * @returns {Promise<string[]>}
 */
async function searchRelatedArticles(headline, originalUrl, limit = 3) {
  if (!headline || headline.length < 10) return [];

  // Use first 8 words of headline for a focused search
  const query = headline.split(/\s+/).slice(0, 8).join(' ');
  const url = `https://www.bing.com/news/search?format=rss&setlang=en-US&cc=US&q=${encodeURIComponent(query)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': BROWSER_USER_AGENT },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.log(`[search] "${query.substring(0, 40)}..." → Bing News HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>[\s\S]*?<\/item>/gi)].map(m => m[0]);

    const links = [];
    const seenHosts = new Set();
    const origHost = originalUrl ? safeHost(originalUrl) : '';
    let skippedNo = 0;

    for (const item of items) {
      if (links.length >= limit) break;
      const rawLink = (item.match(/<link>([^<]+)/) || [])[1];
      if (!rawLink) continue;

      let realUrl = rawLink.trim().replace(/&amp;/g, '&');
      try {
        const wrapped = new URL(realUrl).searchParams.get('url');
        if (wrapped) realUrl = wrapped;
      } catch { continue; }

      const host = safeHost(realUrl);
      if (!host || host === origHost || seenHosts.has(host)) continue;
      if (RELATED_SKIP_HOSTS.some(h => host === h || host.endsWith(`.${h}`))) continue;
      if (isNorwegianHost(host)) { skippedNo++; continue; }

      seenHosts.add(host);
      links.push(realUrl);
    }

    const noNote = skippedNo > 0 ? `, ${skippedNo} Norwegian skipped` : '';
    console.log(`[search] "${query.substring(0, 40)}..." → ${links.length} related articles (${items.length} Bing results${noNote})`);
    if (links.length > 0) {
      links.forEach((l, i) => console.log(`[search]   ${i + 1}. ${safeHost(l)}`));
    }
    return links;
  } catch (e) {
    console.log(`[search] Bing News search failed: ${e.name === 'AbortError' ? 'timeout' : e.message}`);
    return [];
  }
}

function safeHost(u) {
  try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; }
}

/**
 * Scrape images for all segments from their source articles
 * AND from related (non-Norwegian) articles found via Bing News search.
 *
 * @param {Array<{sourceLink: string, headline?: string, existingImages?: string[]}>} articles
 * @param {string} publicDir
 * @returns {Promise<Record<number, {images: string[], attribution: string[]}>>}
 */
export async function scrapeAllArticleImages(articles, publicDir) {
  const result = {};

  for (let i = 0; i < articles.length; i++) {
    result[i] = { images: [], attribution: [] };
  }

  // Step 1: Scrape original article images
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (!article.sourceLink) {
      console.log(`[scraper] Segment ${i}: no source link, skipping`);
      continue;
    }

    try {
      const scraped = await scrapeArticleImages(
        article.sourceLink,
        publicDir,
        `seg_${i}`,
        { maxImages: 4, existingImages: article.existingImages || [] },
      );
      result[i] = scraped;
    } catch (e) {
      console.log(`[scraper] Segment ${i} failed: ${e.message}`);
    }
  }

  // Step 2: Search for related articles and scrape additional images
  console.log(`\n[scraper] 🔍 Searching for related articles to get more images...`);
  for (let i = 0; i < articles.length; i++) {
    const existing = result[i].images.length;
    if (existing >= 6) {
      console.log(`[scraper] Segment ${i}: already has ${existing} images, skipping search`);
      continue;
    }

    const headline = articles[i].headline || '';
    const sourceLink = articles[i].sourceLink || '';
    if (!headline) continue;

    try {
      const relatedUrls = await searchRelatedArticles(headline, sourceLink, 3);

      for (let j = 0; j < relatedUrls.length; j++) {
        const currentCount = result[i].images.length;
        if (currentCount >= 8) break;

        const maxExtra = 8 - currentCount;
        try {
          const extra = await scrapeArticleImages(
            relatedUrls[j],
            publicDir,
            `seg_${i}_related_${j}`,
            { maxImages: Math.min(3, maxExtra), existingImages: [] },
          );
          if (extra.images.length > 0) {
            result[i].images.push(...extra.images);
            result[i].attribution.push(...extra.attribution);
            console.log(`[scraper]   +${extra.images.length} from ${new URL(relatedUrls[j]).hostname}`);
          }
        } catch (e) {
          console.log(`[scraper]   Related ${j} failed: ${e.message}`);
        }
      }
    } catch (e) {
      console.log(`[scraper] Search failed for segment ${i}: ${e.message}`);
    }
  }

  const total = Object.values(result).reduce((n, s) => n + s.images.length, 0);
  console.log(`[scraper] Done: ${total} images across ${articles.length} articles`);

  return result;
}
