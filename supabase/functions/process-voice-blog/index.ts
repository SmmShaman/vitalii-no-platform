import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { HUMANIZER_ARTICLE, VOICE_JOURNALISM } from '../_shared/humanizer-prompt.ts'
import { azureFetch } from '../_shared/azure-to-gemini-shim.ts'
import { generateImageFree } from '../_shared/free-image.ts'
import { uploadToR2 } from '../_shared/r2-upload.ts'
import { loadAuthorBrain } from '../_shared/author-brain.ts'
import { generateLocalizedSlug } from '../_shared/slug-helpers.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const VERSION = '2026-10-24-author-brain'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function editTelegramMessage(chatId: number, messageId: number, text: string, replyMarkup?: unknown) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId, message_id: messageId, text,
      parse_mode: 'HTML', disable_web_page_preview: true,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  console.log(`${VERSION} started`)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    const { rawText, chatId, messageId, blogPostId, authorId } = await req.json() as {
      rawText: string; chatId: number; messageId: number; blogPostId?: string; authorId?: string
    }

    if (!rawText || !chatId) throw new Error('rawText and chatId required')

    // Dedup check: prevent duplicate voice blog posts from webhook retries
    // Uses fuzzy match (first 100 chars) because Gemini transcription varies slightly each time
    if (!blogPostId) {
      const prefix = rawText.slice(0, 100)
      const { data: existingPosts } = await supabase
        .from('blog_posts')
        .select('id, created_at')
        .not('original_voice_text', 'is', null)
        .like('original_voice_text', `${prefix.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`)
        .order('created_at', { ascending: false })
        .limit(1)
      if (existingPosts && existingPosts.length > 0) {
        const age = Date.now() - new Date(existingPosts[0].created_at).getTime()
        if (age < 30 * 60 * 1000) { // within 30 minutes = likely duplicate
          console.log(`⚠️ Similar voice blog exists (${existingPosts[0].id}, ${Math.round(age/1000)}s ago), skipping`)
          return new Response(JSON.stringify({ success: true, blogPostId: existingPosts[0].id, isDuplicate: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
      }
    }

    // Update status
    if (messageId) {
      await editTelegramMessage(chatId, messageId, '🧠 <b>Генерую блог-пост...</b>\n\nОбробляю текст AI...')
    }

    // Load AI prompt from DB
    const { data: promptData } = await supabase
      .from('ai_prompts')
      .select('prompt_text')
      .eq('prompt_type', 'voice_blog_rewrite')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    const basePrompt = promptData?.prompt_text || `Turn the author's dictation into a trilingual blog post for his personal blog vitalii.no.`
    const brain = await loadAuthorBrain(supabase)
    const today = new Date().toISOString().slice(0, 10)
    const voiceSafeguards = `
TODAY: ${today}

TWO SOURCES OF TRUTH — nothing else:
1. The DICTATION (user message): what the author wants to say today. It is the topic and the spine of the post.
2. <author_brain>: verified background — who he is, his projects, and a dated journal of what really happened.

RULES:
- Every fact in the post must come from the dictation or from <author_brain>. If neither says it, it does not go in: no invented tools, frameworks, libraries, numbers, code, test setups, quotes, results or plans.
- Use <author_brain> to understand what the dictation is about: find the project and the concrete event (journal entries near today's date are usually what he means), then tell that story with the real details from the brain.
- The dictation decides the topic. Do not drift to other projects or journal entries unless they directly explain it.
- Private life (children, health, home, money, job search) only if the dictation itself brings it up. Never addresses, phone numbers or e-mails.
- Never write that he scrapes FINN or any website; job vacancies come from public job listings and official job-market APIs (NAV).
- Never mention server IPs, file paths, tokens, keys or passwords.
- LENGTH follows the true material. A two-sentence dictation with one matching journal entry gives 120-250 words per language. Never pad to reach a length; short is fine.
- If the dictation is too thin to tell what it is about and <author_brain> does not resolve it, do not write a post. Return only {"clarify": "<one short question in Ukrainian asking for the missing detail>"}.
- Write each language natively. No English phrases inside the Norwegian or Ukrainian text. Open with the concrete situation, never a hook formula ("this changes everything", "Ever wondered...?").

<author_brain>
${brain}
</author_brain>

Return ONLY valid JSON without markdown fences:
{"en":{"title":"...","content":"...","description":"one sentence"},"no":{"title":"...","content":"...","description":"one sentence"},"ua":{"title":"...","content":"...","description":"one sentence"},"tags":["tag1","tag2"],"category":"Tech"}`
    const systemPrompt = `${basePrompt}\n\n${HUMANIZER_ARTICLE}\n\n${VOICE_JOURNALISM}\n\n${voiceSafeguards}`

    // article route = Claude subscription first, free models as fallback
    console.log(`📝 Calling article LLM route: ${rawText.length} chars dictation, ${brain.length} chars brain...`)
    const llmRes = await azureFetch('', {
      method: 'POST',
      body: JSON.stringify({
        llm_route: 'article',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `DICTATION:\n${rawText.slice(0, 5000)}` },
        ],
        max_tokens: 16000,
      }),
    })

    if (!llmRes.ok) throw new Error(`LLM ${llmRes.status}: ${(await llmRes.text()).slice(0, 200)}`)

    const llmData = await llmRes.json()
    const aiText = llmData?.choices?.[0]?.message?.content || ''
    const cleaned = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let blogData: {
      clarify?: string
      en: { title: string; content: string; description: string }
      no: { title: string; content: string; description: string }
      ua: { title: string; content: string; description: string }
      tags: string[]; category: string
    }

    try {
      blogData = JSON.parse(cleaned.match(/\{[\s\S]*\}/)?.[0] || cleaned)
    } catch {
      throw new Error(`Failed to parse LLM response: ${cleaned.slice(0, 300)}`)
    }

    // Too little to go on — ask instead of inventing
    if (blogData.clarify && !blogData.en) {
      console.log(`❓ Clarify: ${blogData.clarify}`)
      if (messageId) {
        await editTelegramMessage(chatId, messageId,
          `❓ <b>Замало деталей для посту</b>\n\n${blogData.clarify}\n\n<i>Надішли /blog ще раз і розкажи докладніше.</i>`)
      }
      return new Response(JSON.stringify({ success: false, clarify: blogData.clarify }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (!blogData.en || !blogData.no || !blogData.ua) throw new Error('LLM response missing en/no/ua')

    if (messageId) {
      await editTelegramMessage(chatId, messageId, '🖼️ <b>Генерую зображення...</b>')
    }

    // Generate image via process-image
    let imageUrl: string | null = null
    try {
      const imgRes = await fetch(`${SUPABASE_URL}/functions/v1/generate-image-prompt`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsId: '00000000-0000-0000-0000-000000000000',
          title: blogData.en.title,
          content: blogData.en.content.slice(0, 500),
          mode: 'full',
        }),
      })
      const imgPromptData = await imgRes.json()
      const imgPrompt = imgPromptData?.prompt

      if (imgPrompt) {
        // Free Cloudflare FLUX only (owner rule 2026-10-07)
        const freeImg = await generateImageFree(imgPrompt, '16:9')
        if (freeImg) {
          const imgBytes = Uint8Array.from(atob(freeImg.base64), c => c.charCodeAt(0))
          const path = `blog-covers/voice-blog-${Date.now()}.png`
          const publicUrl = await uploadToR2(path, imgBytes, 'image/png')
          if (publicUrl) {
            imageUrl = publicUrl
          }
        }
      }
    } catch (e) {
      console.error('Image generation failed (non-critical):', e)
    }

    // Calculate reading time
    const wordCount = blogData.en.content.split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    // Insert or update blog post
    const slugSuffix = Date.now().toString(36)
    const postData = {
      title_en: blogData.en.title,
      title_no: blogData.no.title,
      title_ua: blogData.ua.title,
      content_en: blogData.en.content,
      content_no: blogData.no.content,
      content_ua: blogData.ua.content,
      description_en: blogData.en.description,
      description_no: blogData.no.description,
      description_ua: blogData.ua.description,
      slug_en: generateLocalizedSlug(blogData.en.title, 'en', slugSuffix),
      slug_no: generateLocalizedSlug(blogData.no.title, 'no', slugSuffix),
      slug_ua: generateLocalizedSlug(blogData.ua.title, 'ua', slugSuffix),
      tags: blogData.tags || [],
      category: blogData.category || 'Tech',
      reading_time: readingTime,
      image_url: imageUrl,
      source_type: 'voice',
      original_voice_text: rawText,
      is_published: false,
      draft_chat_id: chatId,
      draft_message_id: messageId,
      ...(authorId ? { author_id: authorId } : {}),
    }

    let postId: string
    if (blogPostId) {
      // Update existing draft
      await supabase.from('blog_posts').update(postData).eq('id', blogPostId)
      postId = blogPostId
    } else {
      // Insert new draft
      const { data: inserted, error: insertErr } = await supabase
        .from('blog_posts').insert(postData).select('id').single()
      if (insertErr) throw new Error(`Insert failed: ${insertErr.message}`)
      postId = inserted.id
    }

    console.log(`✅ Blog draft ${postId}: ${blogData.en.title}`)

    // Send preview to Telegram
    // The owner reads the whole draft here before publishing (Telegram caps a message at 4096 chars)
    const escapeHtml = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const uaBody = blogData.ua.content.length > 2600 ? blogData.ua.content.slice(0, 2600) + '…' : blogData.ua.content
    const preview = `📝 <b>Чернетка блог-посту</b> (ще не опублікована)\n\n` +
      `📌 <b>${escapeHtml(blogData.ua.title)}</b>\n\n` +
      `${escapeHtml(uaBody)}\n\n` +
      `🏷 ${(blogData.tags || []).join(', ')}\n` +
      `📖 ~${readingTime} хв читання\n` +
      `🖼️ ${imageUrl ? 'Зображення ✅' : 'Без зображення'}\n\n` +
      `🌐 EN: ${blogData.en.title}\n` +
      `🌐 NO: ${blogData.no.title}`

    const keyboard = {
      inline_keyboard: [
        [
          { text: '✅ Опублікувати', callback_data: `vb_pub_${postId}` },
          { text: '✏️ Редагувати', callback_data: `vb_edit_${postId}` },
        ],
        [
          { text: '🔄 Регенерувати', callback_data: `vb_regen_${postId}` },
          { text: '❌ Скасувати', callback_data: `vb_cancel_${postId}` },
        ],
      ],
    }

    if (messageId) {
      await editTelegramMessage(chatId, messageId, preview, keyboard)
    }

    return new Response(JSON.stringify({ success: true, blogPostId: postId, title: blogData.en.title }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('❌ Voice blog failed:', err)
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
