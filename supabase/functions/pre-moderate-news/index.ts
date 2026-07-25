import { azureFetch } from '../_shared/azure-to-gemini-shim.ts'
const VERSION_STAMP = '2026-03-29-force-redeploy'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { fetchRecentTitles } from '../_shared/duplicate-helpers.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface PreModerationResult {
  approved: boolean
  reason: string
  is_advertisement: boolean
  is_duplicate: boolean
  quality_score: number
  /**
   * False means we never got a verdict (no prompt, LLM down, unparseable answer).
   * Owner rule 2026-07-25: a post we could not judge is SKIPPED, not published and
   * not held - callers move on to the next item. Never fail open to approved=true.
   */
  moderated: boolean
}

const DEFAULT_MIN_QUALITY = 6

/** Technical failure - the caller skips this item and carries on. */
function unmoderated(reason: string): Response {
  console.warn(`⏭️ Not moderated (${reason}) — post will be skipped`)
  return new Response(
    JSON.stringify({
      approved: false,
      moderated: false,
      reason: `Not moderated: ${reason}`,
      is_advertisement: false,
      is_duplicate: false,
      quality_score: 0,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

/**
 * Pre-moderate news post using AI before sending to Telegram bot
 * This filters out spam, advertisements, duplicates, and low-quality content
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, content, url } = await req.json()

    console.log('🤖 AI Pre-moderation started for:', title?.substring(0, 50))

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get active pre-moderation prompt (most recently updated)
    const { data: prompts, error: promptError } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('is_active', true)
      .eq('prompt_type', 'pre_moderation')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (promptError) {
      console.error('Error fetching prompt:', promptError)
      throw promptError
    }

    if (!prompts || prompts.length === 0) {
      return unmoderated('no active pre_moderation prompt configured')
    }

    // Minimum quality the AI must give a post for it to reach the site.
    const { data: minSetting } = await supabase
      .from('api_settings')
      .select('key_value')
      .eq('key_name', 'MIN_QUALITY_SCORE')
      .maybeSingle()
    const minQuality = parseInt(minSetting?.key_value ?? '', 10) || DEFAULT_MIN_QUALITY

    // Fetch recent titles for duplicate context
    const recentTitles = await fetchRecentTitles(supabase, 7, 20)
    const recentTitlesContext = recentTitles.length > 0
      ? `\n\nRECENT ARTICLES (last 7 days) for duplicate comparison:\n${recentTitles.map((a, i) => `${i + 1}. ${a.title}`).join('\n')}\n\nIf the article above covers the SAME event/story as any recent article, set is_duplicate to true.`
      : ''

    // Prepare AI prompt
    const prompt = prompts[0].prompt_text
      .replace('{title}', title || '')
      .replace('{content}', content || '')
      .replace('{url}', url || '')
      + recentTitlesContext

    console.log('Using pre-moderation prompt:', prompts[0].name, `(+${recentTitles.length} recent titles for dedup)`)

    console.log('🤖 Calling AI for pre-moderation...')

    const openaiResponse = await azureFetch('gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a content moderator. Analyze posts and respond ONLY with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent moderation
        max_tokens: 300,
        // Own route since 2026-07-25: free-Gemini Lite judges first. It applies this
        // prompt far more strictly than Groq did (mean 2.97 vs 5.45 over the same 29
        // articles) and runs on a separate free quota, so moderation no longer spends
        // Groq's daily token budget that the evening rewrites need.
        llm_route: 'moderation'
      })
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('AI error:', errorText)
      return unmoderated(`LLM error ${openaiResponse.status}`)
    }

    const aiResult = await openaiResponse.json()
    const aiContent = aiResult.choices[0].message.content

    console.log('AI response:', aiContent)

    // Parse AI response
    let moderationResult: PreModerationResult
    try {
      // Extract JSON from AI response (sometimes it adds markdown)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        moderationResult = JSON.parse(jsonMatch[0])
      } else {
        moderationResult = JSON.parse(aiContent)
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return unmoderated('LLM answer was not valid JSON')
    }

    moderationResult.moderated = true
    moderationResult.quality_score = Number(moderationResult.quality_score) || 0

    // Enforce: is_advertisement=true → always reject
    if (moderationResult.is_advertisement && moderationResult.approved) {
      console.log('⚠️ AI marked as advertisement but approved — overriding to REJECT')
      moderationResult.approved = false
      moderationResult.reason = `[Auto-rejected: advertisement] ${moderationResult.reason}`
    }

    // Enforce the quality floor. The AI has always returned quality_score; until
    // 2026-07-25 nobody looked at it, so a 2/10 link dump published like anything else.
    if (moderationResult.approved && moderationResult.quality_score < minQuality) {
      console.log(`⚠️ Quality ${moderationResult.quality_score}/10 below floor ${minQuality} — overriding to REJECT`)
      moderationResult.approved = false
      moderationResult.reason = `[Auto-rejected: quality ${moderationResult.quality_score}/10 < ${minQuality}] ${moderationResult.reason}`
    }

    console.log(moderationResult.approved ? '✅ Approved' : '❌ Rejected:', moderationResult.reason)

    // Update AI prompt usage count
    await supabase
      .from('ai_prompts')
      .update({ usage_count: prompts[0].usage_count + 1 })
      .eq('id', prompts[0].id)

    return new Response(
      JSON.stringify(moderationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('❌ Error in pre-moderation:', error)
    return unmoderated(error?.message || 'unexpected error')
  }
})
