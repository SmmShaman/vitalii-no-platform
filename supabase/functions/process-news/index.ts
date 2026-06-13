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

interface NewsRewriteRequest {
  newsId: string
  title: string
  content: string
  url?: string
  imageUrl?: string | null
  videoUrl?: string | null
  videoType?: string | null
  sourceLink?: string | null    // First external source link (backwards compatibility)
  sourceLinks?: string[]        // ALL external source links extracted from Telegram post
}

/**
 * Process and publish news article
 * Rewrites content in objective journalistic style
 */
serve(async (req) => {
  // Version: 2025-01-28-01 - Use separate telegram_news_rewrite prompt for Telegram donors
  console.log('🚀 Process News v2025-01-28-01 started')
  console.log('📦 Features: Separate prompt for Telegram (telegram_news_rewrite), explicit JSON structure')

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData: NewsRewriteRequest = await req.json()
    console.log('🚀 Processing news for newsId:', requestData.newsId)
    console.log('📎 Received sourceLink:', requestData.sourceLink || 'NULL')

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get Telegram news rewrite prompt from database (separate from RSS)
    const { data: prompts, error: promptError } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('is_active', true)
      .eq('prompt_type', 'telegram_news_rewrite')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (promptError || !prompts || prompts.length === 0) {
      throw new Error('No telegram_news_rewrite prompt configured. Please add a prompt with type "telegram_news_rewrite" in the admin panel.')
    }

    const newsPrompt = prompts[0]
    console.log('Using Telegram news rewrite prompt:', newsPrompt.name)

    return await processWithPrompt(newsPrompt, requestData, supabase, 'news')

  } catch (error: any) {
    console.error('❌ Error processing news:', error)
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
  requestData: NewsRewriteRequest,
  supabase: any,
  type: 'news' | 'blog'
) {
  // Build prompt with placeholders
  // Use sourceLink (real source) instead of Telegram URL when available
  const sourceUrl = requestData.sourceLink || requestData.url || ''
  console.log(`📎 Source URL for AI prompt: ${sourceUrl}`)

  const openingStyle = getRandomOpeningStyle('news')
  console.log('📝 Rewriting with AI (per-language parallel)...')
  console.log(`🎲 Opening style: ${openingStyle}`)

  // Run 3 parallel LLM calls — one per language. Each gets a full token budget
  // so nothing gets truncated mid-sentence when output is long (especially
  // Cyrillic Ukrainian which uses more tokens per character).
  // The legacy DB-stored news_rewrite prompt is no longer needed here.
  void prompt

  const rewrittenContent = await rewriteThreeLanguages(
    requestData.title,
    requestData.content,
    sourceUrl,
    openingStyle,
  )

  // Validate that NO and UA content is actually in the right language (not just English copy)
  const hasCyrillic = (s: string) => /[\u0400-\u04FF]/.test(s)
  const hasNorwegian = (s: string) => /[æøåÆØÅ]/.test(s)
  if (!hasCyrillic(rewrittenContent.ua.title + rewrittenContent.ua.content)) {
    console.warn('⚠️ Ukrainian content appears to be in English — LLM may have skipped translation')
  }
  if (!hasNorwegian(rewrittenContent.no.content)) {
    console.log('ℹ️ Norwegian content has no æøå characters (may still be valid)')
  }

  // Log per-language word counts
  const wcEn = rewrittenContent.en.content.split(/\s+/).length
  const wcNo = rewrittenContent.no.content.split(/\s+/).length
  const wcUa = rewrittenContent.ua.content.split(/\s+/).length
  console.log(`📊 Word counts — EN: ${wcEn}, NO: ${wcNo}, UA: ${wcUa}`)

  // Extract tags from AI response (if available)
  const tags = rewrittenContent.tags || rewrittenContent.en?.tags || []
  console.log(`✅ Content rewritten for all languages, tags: ${tags.length > 0 ? tags.join(', ') : 'none'}`)

  // Append source links to content if available (for each language)
  // Priority: sourceLinks array (all links) > sourceLink (single, backwards compat)
  const sourceLinks = requestData.sourceLinks?.length ? requestData.sourceLinks : (requestData.sourceLink ? [requestData.sourceLink] : [])

  if (sourceLinks.length > 0) {
    console.log(`📎 Appending ${sourceLinks.length} source link(s) to content`)
    sourceLinks.forEach((link, i) => console.log(`   ${i + 1}. ${link}`))

    // Format as Resources section with multiple links
    const formatLinks = (links: string[], headerText: string): string => {
      if (links.length === 1) {
        // Single link - use simple format
        return `\n\n**${headerText}:** [${new URL(links[0]).hostname}](${links[0]})`
      }
      // Multiple links - use bullet list
      const linksList = links.map(link => {
        try {
          const hostname = new URL(link).hostname.replace('www.', '')
          return `- [${hostname}](${link})`
        } catch {
          return `- [Link](${link})`
        }
      }).join('\n')
      return `\n\n**${headerText}:**\n${linksList}`
    }

    rewrittenContent.en.content = rewrittenContent.en.content + formatLinks(sourceLinks, 'Resources')
    rewrittenContent.no.content = rewrittenContent.no.content + formatLinks(sourceLinks, 'Ressurser')
    rewrittenContent.ua.content = rewrittenContent.ua.content + formatLinks(sourceLinks, 'Ресурси')
  }

  // Generate slugs with transliteration and unique suffix
  const uniqueSuffix = requestData.newsId.substring(0, 8)

  // Update news item with rewritten content
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
      tags: tags.length > 0 ? tags : null, // Save tags if available
      is_rewritten: true,
      is_published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', requestData.newsId)

  if (updateError) {
    console.error('Failed to update news:', updateError)
    throw updateError
  }

  console.log('✅ News published:', requestData.newsId)

  // Cross-link enrichment (non-blocking, best-effort)
  try {
    console.log('🔗 Triggering cross-link enrichment...')
    await fetch(`${SUPABASE_URL}/functions/v1/enrich-article-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ articleId: requestData.newsId, type: 'news' })
    })
    console.log('✅ Cross-link enrichment completed')
  } catch (e) {
    console.error('⚠️ Cross-link enrichment failed (non-critical):', e)
  }

  // Update AI prompt usage count
  await supabase
    .from('ai_prompts')
    .update({ usage_count: prompt.usage_count + 1 })
    .eq('id', prompt.id)

  return new Response(
    JSON.stringify({
      success: true,
      newsId: requestData.newsId,
      message: 'News published successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
