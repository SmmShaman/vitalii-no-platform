const VERSION_STAMP = '2026-06-13-split-per-language'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { generateLocalizedSlug } from '../_shared/slug-helpers.ts'
import { getRandomOpeningStyle } from '../_shared/opening-styles.ts'
import { rewriteThreeLanguages } from '../_shared/rewrite-per-language.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface ImageWithMeta {
  url: string
  alt?: string
  title?: string
  credit?: string
  caption?: string
  source?: string
}

interface RSSNewsRewriteRequest {
  newsId: string
  title?: string
  content?: string
  url?: string
  imageUrl?: string | null
  images?: string[] | null  // Array of all image URLs
  imagesWithMeta?: ImageWithMeta[] | null  // Images with copyright metadata
}

/**
 * Process RSS news article with summary-style rewrite
 * Creates a short informational overview with link to original source
 */
serve(async (req) => {
  // Version: 2025-01-28-01 - Fix: save image_url to database
  console.log('🚀 Process RSS News v2025-01-28-01 started')
  console.log('📦 Features: Summary-style rewrite, auto source link append, image_url preservation')

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData: RSSNewsRewriteRequest = await req.json()
    console.log('🚀 Processing RSS news for newsId:', requestData.newsId)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch news record to get RSS source URL and content
    const { data: news, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', requestData.newsId)
      .single()

    if (fetchError || !news) {
      console.error('Failed to fetch news:', fetchError)
      throw new Error('News record not found')
    }

    // Use data from request or from database
    const title = requestData.title || news.original_title || ''
    const content = requestData.content || news.original_content || ''
    const sourceUrl = news.rss_source_url || requestData.url || ''

    console.log(`📎 RSS Source URL: ${sourceUrl}`)

    // Get news rewrite prompt from database (single prompt for all news sources)
    const { data: prompts, error: promptError } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('is_active', true)
      .eq('prompt_type', 'news_rewrite')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (promptError || !prompts || prompts.length === 0) {
      throw new Error('No news_rewrite prompt configured. Please add a prompt with type "news_rewrite" in the admin panel.')
    }

    const rssPrompt = prompts[0]
    console.log('Using news rewrite prompt:', rssPrompt.name)

    // Get images array from request or database
    const images = requestData.images || news.images || []
    const imagesWithMeta = requestData.imagesWithMeta || news.images_with_meta || []

    return await processWithPrompt(rssPrompt, requestData.newsId, title, content, sourceUrl, supabase, requestData.imageUrl || news.image_url, images, imagesWithMeta)

  } catch (error: any) {
    console.error('❌ Error processing RSS news:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function processWithPrompt(
  prompt: any,
  newsId: string,
  title: string,
  content: string,
  sourceUrl: string,
  supabase: any,
  imageUrl: string | null,
  images: string[],
  imagesWithMeta: ImageWithMeta[]
) {
  const openingStyle = getRandomOpeningStyle('news')
  console.log('📝 Rewriting with AI (per-language parallel)...')
  console.log(`🎲 Opening style: ${openingStyle}`)

  // Run 3 parallel LLM calls — one per language. Each gets a full token budget
  // so nothing gets truncated mid-sentence when output is long (especially
  // Cyrillic Ukrainian which uses more tokens per character).
  // The legacy DB-stored news_rewrite prompt is no longer needed here —
  // the per-language helper builds focused prompts inline. We keep the
  // prompt fetch above for parity, but its text is unused now.
  void prompt

  const rewrittenContent = await rewriteThreeLanguages(title, content, sourceUrl, openingStyle)
  const tags = rewrittenContent.tags
  console.log(`✅ Content rewritten for all languages, tags: ${tags.length > 0 ? tags.join(', ') : 'none'}`)

  // Append source link to content (RSS-specific feature)
  if (sourceUrl) {
    console.log(`📎 Appending source link to content: ${sourceUrl}`)

    const appendSource = (content: string, label: string, url: string): string => {
      try {
        const hostname = new URL(url).hostname.replace('www.', '')
        return `${content}\n\n${label}: ${hostname}`
      } catch {
        return content
      }
    }

    rewrittenContent.en.content = appendSource(rewrittenContent.en.content, 'Source', sourceUrl)
    rewrittenContent.no.content = appendSource(rewrittenContent.no.content, 'Kilde', sourceUrl)
    rewrittenContent.ua.content = appendSource(rewrittenContent.ua.content, 'Джерело', sourceUrl)
  }

  // Generate slugs with transliteration and unique suffix
  const uniqueSuffix = newsId.substring(0, 8)

  // Update news item with rewritten content
  console.log(`📷 Saving image_url: ${imageUrl || 'none'}`)
  console.log(`📷 Saving images array: ${images.length} images`)
  console.log(`📷 Saving images_with_meta: ${imagesWithMeta.length} images with copyright info`)
  const { error: updateError } = await supabase
    .from('news')
    .update({
      title_en: rewrittenContent.en.title,
      content_en: rewrittenContent.en.content,
      description_en: rewrittenContent.en.description,
      slug_en: generateLocalizedSlug(rewrittenContent.en.title, 'en', uniqueSuffix),
      title_ua: rewrittenContent.ua.title,
      content_ua: rewrittenContent.ua.content,
      description_ua: rewrittenContent.ua.description,
      slug_ua: generateLocalizedSlug(rewrittenContent.ua.title, 'ua', uniqueSuffix),
      title_no: rewrittenContent.no.title,
      content_no: rewrittenContent.no.content,
      description_no: rewrittenContent.no.description,
      slug_no: generateLocalizedSlug(rewrittenContent.no.title, 'no', uniqueSuffix),
      tags: tags.length > 0 ? tags : null,
      image_url: imageUrl,
      images: images.length > 0 ? images : null,
      images_with_meta: imagesWithMeta.length > 0 ? imagesWithMeta : null,
      is_rewritten: true,
      is_published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pre_moderation_status: 'approved'
    })
    .eq('id', newsId)

  if (updateError) {
    console.error('Failed to update news:', updateError)
    throw updateError
  }

  console.log('✅ RSS News published:', newsId)

  // Cross-link enrichment (non-blocking, best-effort)
  try {
    console.log('🔗 Triggering cross-link enrichment...')
    await fetch(`${SUPABASE_URL}/functions/v1/enrich-article-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ articleId: newsId, type: 'news' })
    })
    console.log('✅ Cross-link enrichment completed')
  } catch (e) {
    console.error('⚠️ Cross-link enrichment failed (non-critical):', e)
  }

  // Auto-generate LinkedIn teaser (non-blocking, best-effort)
  try {
    console.log('📣 Triggering LinkedIn teaser generation...')
    const { data: newsRecord } = await supabase
      .from('news')
      .select('title_en,content_en')
      .eq('id', newsId)
      .single()
    if (newsRecord?.title_en && newsRecord?.content_en) {
      await fetch(`${SUPABASE_URL}/functions/v1/generate-social-teasers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newsId,
          title: newsRecord.title_en,
          content: newsRecord.content_en,
          platform: 'linkedin',
          language: 'en'
        })
      })
      console.log('✅ LinkedIn teaser generated')
    }
  } catch (e) {
    console.error('⚠️ LinkedIn teaser generation failed (non-critical):', e)
  }

  // Update AI prompt usage count
  await supabase
    .from('ai_prompts')
    .update({ usage_count: prompt.usage_count + 1 })
    .eq('id', prompt.id)

  return new Response(
    JSON.stringify({
      success: true,
      newsId: newsId,
      message: 'RSS News published successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
