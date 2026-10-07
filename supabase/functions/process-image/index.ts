import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { callLLM } from '../_shared/gemini-llm.ts'
import { generateImageFluxFree } from '../_shared/free-image.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CF_API_TOKEN = Deno.env.get('CF_API_TOKEN') ?? ''
const CF_ACCOUNT_ID = Deno.env.get('CF_ACCOUNT_ID') ?? '1438e8d03009209c4a82ea4c28bdb358'
const R2_BUCKET = 'news-images'
const R2_PUBLIC_BASE = `https://pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev`
const VERSION = '2026-10-07-v15-flux-only'

// Owner rule 2026-10-07: image generation is FREE only — Cloudflare FLUX.
// Paid links removed: Nano Banana Pro (billed GOOGLE_API_KEY, was generating
// every image since OpenRouter ran dry and FLUX 400'd on width/height) and
// OpenRouter (prepaid). Image-to-image edits had no free provider and are off.

// ==========================================
// STRUCTURED BRIEF SYSTEM
// ==========================================

interface StructuredBrief {
  narrative_type: 'comparison' | 'product' | 'announcement' | 'problem_solution' | 'tutorial' | 'analysis'
  entities: Array<{ name: string; role: string; visual_hint: string }>
  core_message: string
  mood: string
  setting: string
}

const COMPOSITION_TEMPLATES: Record<string, string> = {
  comparison: `Split-screen composition. Left side: the OLD/problematic approach (muted warm tones, error states, frustration cues). Right side: the NEW/better solution (fresh cool tones, success states, clean UI). Clear visual contrast between the two halves.`,
  product: `Hero shot composition. The main product/tool is centered and prominent. Supporting context elements arranged around it. Clean background with subtle depth. The product should be recognizable and dominant.`,
  announcement: `Bold headline-forward composition. Key news fact or number is large and prominent. Supporting visual below or behind the text. Newspaper/breaking news editorial aesthetic.`,
  problem_solution: `Before/after layout. Top or left shows the problem state (darker, cluttered). Bottom or right shows the solution (cleaner, brighter). Transition element connecting them (arrow, gradient, or split line).`,
  tutorial: `Step-by-step visual. 2-3 panels or numbered elements showing a process flow. Clean, instructional aesthetic. Each step is clearly separated and labeled.`,
  analysis: `Data-driven composition. Key numbers, charts, or statistics featured prominently. Professional analytical aesthetic with clean typography. Supporting visual context behind the data.`,
}

async function generateStructuredBrief(title: string, content: string): Promise<StructuredBrief | null> {
  try {
    const systemPrompt = `You are an editorial art director. Analyze the article and produce a structured image brief.

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "narrative_type": "comparison" | "product" | "announcement" | "problem_solution" | "tutorial" | "analysis",
  "entities": [
    { "name": "exact name from article", "role": "main_subject|old_solution|new_solution|context|tool|company|person", "visual_hint": "concrete visual: browser window, mobile app, logo, chart, device, interface element" }
  ],
  "core_message": "one sentence: the key takeaway of the article",
  "mood": "professional_optimistic|serious|innovative|dramatic|neutral",
  "setting": "developer_workspace|office|abstract|outdoor|lab|conference|digital_interface"
}

Rules:
- Extract ALL specific products, companies, tools, websites, and people mentioned
- visual_hint must be CONCRETE and DRAWABLE: "laptop showing Finn.no form with red error", not "technology concept"
- If article compares old vs new approach → narrative_type = "comparison"
- If article announces news/numbers/results → narrative_type = "announcement"
- If article describes a specific product/tool → narrative_type = "product"
- Maximum 6 entities, minimum 2`

    const userMessage = `TITLE: ${title}\n\nCONTENT: ${content.substring(0, 1500)}`
    const result = await callLLM(systemPrompt, userMessage, { temperature: 0.2, maxTokens: 500 })

    // Clean JSON from potential markdown wrapping
    const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const brief = JSON.parse(cleaned) as StructuredBrief

    // Validate
    if (!brief.narrative_type || !brief.entities || brief.entities.length === 0) {
      console.error('❌ Invalid brief structure:', brief)
      return null
    }

    console.log(`📋 Structured brief: type=${brief.narrative_type}, entities=${brief.entities.length}, mood=${brief.mood}`)
    return brief
  } catch (e: any) {
    console.error('❌ Failed to generate structured brief:', e.message)
    return null
  }
}

function assemblePromptFromBrief(brief: StructuredBrief, localizedTitle: string): string {
  const composition = COMPOSITION_TEMPLATES[brief.narrative_type] || COMPOSITION_TEMPLATES.analysis

  const entitiesSection = brief.entities
    .map(e => `- "${e.name}" (${e.role}): show as ${e.visual_hint}`)
    .join('\n')

  return `${composition}

SPECIFIC ELEMENTS THAT MUST BE VISIBLE IN THE IMAGE:
${entitiesSection}

HEADLINE ON IMAGE: "${localizedTitle}"
MOOD: ${brief.mood}
SETTING: ${brief.setting}
CORE MESSAGE: ${brief.core_message}

CENTER-WEIGHTED COMPOSITION (MANDATORY): Keep all critical visual elements and text within the center 70% of the frame. Edges should have ambient/background content only — this ensures the image works when cropped to 1:1 for social media.`
}

// ==========================================
// CASCADING PROVIDERS CONFIGURATION
// ==========================================

/**
 * Track provider usage in the database
 */
async function trackProviderUsage(
  supabase: any,
  providerName: string,
  modelName: string,
  success: boolean
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0]
    // Try upsert with increment
    const { data: existing } = await supabase
      .from('image_provider_usage')
      .select('id, request_count, success_count, failure_count')
      .eq('provider_name', providerName)
      .eq('usage_date', today)
      .single()

    if (existing) {
      await supabase
        .from('image_provider_usage')
        .update({
          request_count: (existing.request_count || 0) + 1,
          success_count: (existing.success_count || 0) + (success ? 1 : 0),
          failure_count: (existing.failure_count || 0) + (success ? 0 : 1),
        })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('image_provider_usage')
        .insert({
          provider_name: providerName,
          model_name: modelName,
          usage_date: today,
          request_count: 1,
          success_count: success ? 1 : 0,
          failure_count: success ? 0 : 1,
        })
    }
  } catch (e) {
    console.log('⚠️ Failed to track provider usage:', e)
  }
}

// ==========================================
// CASCADING PROVIDER IMPLEMENTATIONS
// ==========================================

/**
 * Generate image with free Cloudflare FLUX. Returns base64 or null.
 */
async function generateImageCascading(
  prompt: string,
  supabase: any,
  aspectRatio: '1:1' | '16:9' | '4:5' = '16:9',
): Promise<{ base64: string; provider: string; model: string } | null> {
  const result = await generateImageFluxFree(prompt, aspectRatio)
  await trackProviderUsage(supabase, 'Cloudflare FLUX', '@cf/black-forest-labs/flux-1-schnell', !!result)
  if (!result) console.log('❌ Cloudflare FLUX failed')
  return result
}

// ==========================================
// TEXT OVERLAY
// ==========================================

/**
 * Add branding overlay: date (bottom-left) + vitalii.no (bottom-right)
 * Uses SVG overlay composed onto image via canvas-like approach
 * Lightweight alternative that works in Edge Functions without heavy WASM
 */
async function addBrandingOverlay(
  imageBase64: string,
  language: 'en' | 'no' | 'ua' = 'en'
): Promise<string> {
  // For now, skip overlay in Edge Functions to avoid WASM memory issues
  // Branding text is handled by the frontend CSS overlay
  const now = new Date()
  const dateFormats: Record<string, string> = {
    'ua': now.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }),
    'no': now.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' }),
    'en': now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }
  const dateText = dateFormats[language] || dateFormats['en']
  console.log(`📝 Branding overlay skipped (Edge Function mode). Date: "${dateText}", Watermark: "vitalii.no"`)
  return imageBase64
}

interface ProcessImageRequest {
  imageUrl?: string  // Now optional - not needed for text-to-image
  newsId?: string
  promptType?: 'enhance' | 'linkedin_optimize' | 'generate' | 'custom'
  customPrompt?: string
  // News context for AI image generation
  newsTitle?: string
  newsDescription?: string
  newsUrl?: string
  // NEW: Generate image from prompt only (text-to-image mode)
  generateFromPrompt?: boolean
  // Language for text on the image (ua, no, en)
  language?: 'en' | 'no' | 'ua'
  // Aspect ratio: '16:9' website/LinkedIn/Facebook (default), '4:5' Instagram portrait, '1:1' Instagram square
  aspectRatio?: '1:1' | '16:9' | '4:5'
}

interface ProcessImageResponse {
  success: boolean
  processedImageUrl?: string
  processedImageUrlWide?: string  // 16:9 format URL
  originalImageUrl?: string
  error?: string
  message?: string
  aspectRatio?: '1:1' | '16:9' | '4:5'
  provider?: string  // Which provider generated the image (Cloudflare FLUX)
  debug?: {
    version: string
    timestamp: string
    lastApiError: string | null
    [key: string]: any
  }
}

/**
 * Process and enhance images for LinkedIn using AI
 * Supports Google Imagen API for image enhancement
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData: ProcessImageRequest = await req.json()
    console.log('🖼️ Image processing request:', {
      imageUrl: requestData.imageUrl?.substring(0, 50) + '...',
      newsId: requestData.newsId,
      promptType: requestData.promptType,
      generateFromPrompt: requestData.generateFromPrompt,
      hasNewsContext: !!(requestData.newsTitle || requestData.newsDescription),
      aspectRatio: requestData.aspectRatio || '16:9'
    })

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // TEXT-TO-IMAGE MODE: Generate image from prompt stored in DB
    if (requestData.generateFromPrompt && requestData.newsId) {
      const aspectRatio = requestData.aspectRatio || '16:9'
      console.log('🎨 Text-to-image mode: generating from stored prompt', requestData.language ? `(language: ${requestData.language})` : '', `(aspectRatio: ${aspectRatio})`)
      return await handleTextToImageGeneration(supabase, requestData.newsId, requestData.language, aspectRatio)
    }

    // STANDARD MODE: Process existing image
    if (!requestData.imageUrl) {
      throw new Error('Image URL is required (or use generateFromPrompt=true with newsId)')
    }

    // Get the prompt from database or use default
    let prompt = await getImagePrompt(supabase, requestData.promptType || 'linkedin_optimize')

    if (requestData.customPrompt) {
      prompt = requestData.customPrompt
    }

    // If we have news context, inject it into the prompt
    if (requestData.newsTitle || requestData.newsDescription) {
      prompt = buildContextualPrompt(prompt, {
        title: requestData.newsTitle,
        description: requestData.newsDescription,
        url: requestData.newsUrl
      })
    }

    console.log('📝 Using prompt:', prompt.substring(0, 200) + '...')

    // Download the original image
    const imageData = await downloadImage(requestData.imageUrl)
    console.log('📥 Downloaded image, size:', imageData.length, 'bytes')

    // Photo edits used paid Gemini; FLUX is text-to-image only, so the original image is kept.
    const processedImageUrl: string | null = null

    if (!processedImageUrl) {
      // If AI processing fails, return original image
      console.log('⚠️ AI processing failed, using original image')
      return new Response(
        JSON.stringify({
          success: true,
          processedImageUrl: requestData.imageUrl,
          originalImageUrl: requestData.imageUrl,
          error: 'AI processing unavailable, using original image'
        } as ProcessImageResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If newsId provided, update the news record with processed image
    if (requestData.newsId) {
      await supabase
        .from('news')
        .update({
          processed_image_url: processedImageUrl,
          image_processed_at: new Date().toISOString()
        })
        .eq('id', requestData.newsId)
    }

    console.log('✅ Image processed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        processedImageUrl,
        originalImageUrl: requestData.imageUrl
      } as ProcessImageResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('❌ Error processing image:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error'
      } as ProcessImageResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

/**
 * Handle text-to-image generation mode
 * Gets prompt from DB and generates image with free Cloudflare FLUX
 */
async function handleTextToImageGeneration(
  supabase: any,
  newsId: string,
  language?: 'en' | 'no' | 'ua',
  aspectRatio: '1:1' | '16:9' | '4:5' = '16:9',
): Promise<Response> {
  console.log(`🎨 Starting text-to-image generation for news: ${newsId}${language ? ` (language: ${language})` : ''} [aspectRatio: ${aspectRatio}]`)

  // 1. Get news record with the stored prompt
  const { data: news, error: newsError } = await supabase
    .from('news')
    .select('id, image_generation_prompt, title_en, title_no, title_ua, content_en, description_en, description_no, description_ua, processed_image_url, processed_image_url_wide, image_retry_count')
    .eq('id', newsId)
    .single()

  if (newsError || !news) {
    console.error('❌ News not found:', newsId)
    console.error('🔍 DEBUG: newsError code:', newsError?.code)
    console.error('🔍 DEBUG: newsError message:', newsError?.message)
    console.error('🔍 DEBUG: newsError details:', newsError?.details)
    console.error('🔍 DEBUG: news data:', news)
    return new Response(
      JSON.stringify({
        success: false,
        error: `News not found: ${newsId}`,
        debug: {
          version: VERSION,
          timestamp: new Date().toISOString(),
          lastApiError: null,
          errorCode: newsError?.code,
          errorMessage: newsError?.message,
          errorDetails: newsError?.details
        }
      } as ProcessImageResponse),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Check if we already have a processed image for this aspect ratio (only on first attempt)
  const existingImageUrl = aspectRatio === '16:9' ? news.processed_image_url_wide : news.processed_image_url
  if (existingImageUrl) {
    console.log(`✅ Image already generated for ${aspectRatio}:`, existingImageUrl)
    return new Response(
      JSON.stringify({
        success: true,
        processedImageUrl: existingImageUrl,
        aspectRatio,
        message: `Image already exists for ${aspectRatio}`
      } as ProcessImageResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // 2. Generate structured brief from article content, then assemble prompt
  const localizedTitle = (language === 'ua' ? news.title_ua : language === 'no' ? news.title_no : news.title_en) || news.title_en || ''
  let imagePrompt = news.image_generation_prompt

  if (news.content_en && news.title_en) {
    console.log('📋 Generating structured brief from article...')
    const brief = await generateStructuredBrief(news.title_en, news.content_en)
    if (brief) {
      const briefPrompt = assemblePromptFromBrief(brief, localizedTitle)
      // Merge: structured brief as primary, stored prompt as additional visual guidance
      imagePrompt = imagePrompt
        ? `${briefPrompt}\n\nADDITIONAL VISUAL GUIDANCE (from art director): ${imagePrompt}`
        : briefPrompt
      console.log('✅ Structured brief assembled, narrative:', brief.narrative_type)
    } else {
      console.log('⚠️ Brief generation failed, using stored prompt')
    }
  }

  if (!imagePrompt) {
    console.log('⚠️ No prompt available, using basic fallback')
    imagePrompt = `Professional editorial illustration for: ${news.title_en || 'technology news'}. Clean, modern, 16:9 landscape format.`
  }

  console.log('📝 Using prompt:', imagePrompt.substring(0, 300) + '...')

  // 3. Generate with free Cloudflare FLUX
  const result = await generateImageCascading(imagePrompt, supabase, aspectRatio)

  if (!result) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Cloudflare FLUX failed',
        debug: { version: VERSION, timestamp: new Date().toISOString(), lastApiError: null }
      } as ProcessImageResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Apply branding overlay (date + vitalii.no)
  const brandedBase64 = await addBrandingOverlay(result.base64, language || 'en')

  // Upload to Supabase Storage
  const processedImageUrl = await uploadProcessedImage(brandedBase64)

  // Save to database
  const updateData: Record<string, any> = {
    image_processed_at: new Date().toISOString(),
    image_provider_used: result.provider,
    image_model_used: result.model,
    image_retry_count: 0,
  }
  // Always save to main field (website uses processed_image_url)
  updateData.processed_image_url = processedImageUrl
  if (aspectRatio === '16:9') {
    updateData.processed_image_url_wide = processedImageUrl
  }

  await supabase.from('news').update(updateData).eq('id', newsId)

  console.log(`✅ Image generated by ${result.provider} (${result.model})`)

  return new Response(
    JSON.stringify({
      success: true,
      processedImageUrl,
      aspectRatio,
      provider: result.provider,
      message: `Image generated by ${result.provider} (${aspectRatio})`,
      debug: {
        version: VERSION,
        timestamp: new Date().toISOString(),
        lastApiError: null,
        provider: result.provider,
        model: result.model,
      }
    } as ProcessImageResponse),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

/**
 * Get image processing prompt from database
 */
async function getImagePrompt(supabase: any, promptType: string): Promise<string> {
  const { data: prompt, error } = await supabase
    .from('ai_prompts')
    .select('prompt_text')
    .eq('prompt_type', `image_${promptType}`)
    .eq('is_active', true)
    .single()

  if (error || !prompt) {
    // Return default prompt
    return getDefaultPrompt(promptType)
  }

  return prompt.prompt_text
}

/**
 * Default prompts for different use cases
 */
function getDefaultPrompt(promptType: string): string {
  const prompts: Record<string, string> = {
    enhance: 'Enhance this image: improve clarity, adjust brightness and contrast for better visibility, sharpen details while maintaining natural look.',
    linkedin_optimize: `Based on this reference image and the article context below, create a NEW professional illustration for LinkedIn.

ARTICLE CONTEXT:
{title}
{description}

INSTRUCTIONS:
1. Analyze the reference image and understand the article topic
2. Create a completely NEW, eye-catching illustration that represents the article theme
3. Style: Modern, professional, suitable for LinkedIn audience
4. Include visual metaphors or symbols related to the topic
5. Use vibrant but professional colors
6. Make it visually engaging to encourage clicks
7. Aspect ratio: Square (1:1)
8. No text on the image - the visual should speak for itself

Generate a high-quality, professional illustration that will stand out in LinkedIn feed.`,
    generate: `Create a NEW professional illustration based on this article:

TITLE: {title}

DESCRIPTION: {description}

REFERENCE: Use the provided image as style/context reference only.

REQUIREMENTS:
- Modern, clean design suitable for LinkedIn
- Visually represent the key theme of the article
- Professional color palette
- Eye-catching but not clickbait
- No text overlays
- Square orientation (1:1)

Generate the illustration now.`,
    custom: 'Process this image to improve its quality.'
  }
  return prompts[promptType] || prompts.custom
}

/**
 * Build prompt with news context placeholders replaced
 */
function buildContextualPrompt(
  basePrompt: string,
  context: { title?: string; description?: string; url?: string }
): string {
  let prompt = basePrompt

  // Replace placeholders with actual content
  if (context.title) {
    prompt = prompt.replace(/\{title\}/g, context.title)
  } else {
    prompt = prompt.replace(/\{title\}/g, '[No title provided]')
  }

  if (context.description) {
    // Truncate description if too long
    const shortDesc = context.description.substring(0, 500)
    prompt = prompt.replace(/\{description\}/g, shortDesc)
  } else {
    prompt = prompt.replace(/\{description\}/g, '[No description provided]')
  }

  if (context.url) {
    prompt = prompt.replace(/\{url\}/g, context.url)
  } else {
    prompt = prompt.replace(/\{url\}/g, '')
  }

  return prompt
}

/**
 * Download image from URL and return as base64
 */
async function downloadImage(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) {
    throw new Error(`Invalid content type: ${contentType}`)
  }
  const contentLengthHeader = response.headers.get('content-length')
  if (contentLengthHeader && parseInt(contentLengthHeader) > 15_000_000) {
    throw new Error(`Image too large: ${contentLengthHeader} bytes`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )

  return base64
}

/**
 * Upload processed image to Supabase Storage
 */
async function uploadProcessedImage(base64Image: string): Promise<string> {
  // Convert base64 to Uint8Array
  const binaryString = atob(base64Image)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const fileName = `processed/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`

  // Upload to Cloudflare R2 via API
  const r2Url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${fileName}`
  const res = await fetch(r2Url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'image/jpeg',
    },
    body: bytes,
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Failed to upload to R2:', res.status, err)
    throw new Error('Failed to upload processed image to R2')
  }

  return `${R2_PUBLIC_BASE}/${fileName}`
}
