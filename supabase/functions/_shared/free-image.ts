/**
 * Free image generation — shared by every function that needs an image OUTSIDE
 * the main process-image flow (blog covers, video thumbnails, Telegram bot edits).
 *
 * Owner rule 2026-10-07: images are FREE only → Cloudflare Workers AI
 * FLUX.1-schnell (~200/day). OpenRouter (prepaid) and the billed
 * GOOGLE_API_KEY are never used. Returns null when FLUX is unavailable and the
 * caller degrades gracefully (keeps old image / skips thumbnail).
 *
 * Input-image edits are not supported: FLUX is text-to-image and cannot see
 * the source photo, so an edit returns null instead of silently ignoring it.
 */

const CF_ACCOUNT_ID = Deno.env.get('CF_ACCOUNT_ID') || '1438e8d03009209c4a82ea4c28bdb358'

export interface FreeImageResult {
  base64: string
  provider: string
  model: string
}

export interface InputImage {
  data: string // raw base64, no data: prefix
  mimeType: string
}

export async function generateImageFree(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '4:5' = '16:9',
  inputImage?: InputImage,
): Promise<FreeImageResult | null> {
  if (inputImage) {
    console.warn('⚠️ Photo edit needs an image-to-image model — no free provider, skipping')
    return null
  }
  return generateImageFluxFree(prompt, aspectRatio)
}

/**
 * Cloudflare FLUX text-to-image (free tier). Returns null when FLUX is
 * unavailable and the caller degrades gracefully.
 */
export async function generateImageFluxFree(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '4:5' = '16:9',
): Promise<FreeImageResult | null> {
  const fluxBase64 = await generateImageViaCloudflareFlux(prompt, aspectRatio)
  if (fluxBase64) {
    return { base64: fluxBase64, provider: 'Cloudflare FLUX', model: '@cf/black-forest-labs/flux-1-schnell' }
  }
  return null
}

/** Cloudflare Workers AI FLUX.1-schnell — free, ~200/day. Returns raw base64 or null. */
async function generateImageViaCloudflareFlux(
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '4:5',
): Promise<string | null> {
  const aiToken = Deno.env.get('CF_AI_TOKEN')
  if (!aiToken) {
    console.log('ℹ️ CF_AI_TOKEN not set — skipping Cloudflare FLUX')
    return null
  }

  // 2026-08-19: CF now REJECTS width/height on flux-1-schnell ("Additional or
  // unevaluated properties '/width, /height' not allowed", HTTP 400) — the model
  // takes only prompt+steps and always returns a square image. The aspect-ratio
  // hint goes into the prompt instead; the render crops to fit.
  const arHint = aspectRatio === '16:9'
    ? ' Wide 16:9 landscape framing with safe margins for horizontal crop.'
    : aspectRatio === '4:5'
      ? ' Vertical portrait framing with safe margins for vertical crop.'
      : ''

  // FLUX is bad at rendering text; strip branding/text blocks and add a guard.
  const cleanedPrompt = prompt
    .replace(/⚠️[\s\S]*?(?=\n\n|$)/g, '')
    .replace(/BRANDING ELEMENTS[\s\S]*?(?=\n\n|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 1500)
  const finalPrompt = `${cleanedPrompt}\n\nStyle: professional editorial photography, no text in image, no watermarks, clean composition, photorealistic.${arHint}`

  try {
    const t0 = Date.now()
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${aiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, steps: 4 }),
      },
    )
    const dt = Date.now() - t0

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.warn(`⚠️ Cloudflare FLUX HTTP ${res.status} (${dt}ms): ${body.substring(0, 200)}`)
      return null
    }

    const data = await res.json()
    if (!data?.success || !data?.result?.image) {
      console.warn(`⚠️ Cloudflare FLUX success=false: ${JSON.stringify(data?.errors || data).substring(0, 200)}`)
      return null
    }

    console.log(`✅ Cloudflare FLUX generated image in ${dt}ms`)
    return data.result.image
  } catch (e) {
    console.warn(`⚠️ Cloudflare FLUX exception: ${(e as Error)?.message || String(e)}`)
    return null
  }
}

/**
 * Free-first TEXT call for one-off Gemini usages outside the shim.
 * Uses the no-billing GEMINI_FREE_API_KEY (429 over quota, never an invoice).
 * gemini-3.1-flash-lite: 500 req/day, no thinking. NOTE: gemini-2.5-flash
 * 404s on the free project — do not "upgrade" the default model blindly.
 */
export async function callFreeGeminiText(
  prompt: string,
  opts: { temperature?: number; maxOutputTokens?: number; systemPrompt?: string; inlineData?: InputImage } = {},
): Promise<string | null> {
  const key = Deno.env.get('GEMINI_FREE_API_KEY')
  if (!key) {
    console.warn('⚠️ GEMINI_FREE_API_KEY not set — free Gemini text call skipped')
    return null
  }
  const model = Deno.env.get('GEMINI_FREE_MODEL_LITE') || 'gemini-3.1-flash-lite'
  const parts: unknown[] = [{ text: prompt }]
  if (opts.inlineData) parts.push({ inlineData: { mimeType: opts.inlineData.mimeType, data: opts.inlineData.data } })

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(opts.systemPrompt ? { systemInstruction: { parts: [{ text: opts.systemPrompt }] } } : {}),
          contents: [{ parts }],
          generationConfig: {
            temperature: opts.temperature ?? 0.6,
            maxOutputTokens: opts.maxOutputTokens ?? 4000,
          },
        }),
        signal: AbortSignal.timeout(60_000),
      },
    )
    if (!res.ok) {
      const err = await res.text().catch(() => '')
      console.warn(`⚠️ Free Gemini (${model}) ${res.status}: ${err.substring(0, 150)}`)
      return null
    }
    const data = await res.json()
    const text = (data?.candidates?.[0]?.content?.parts || []).map((p: { text?: string }) => p.text || '').join('').trim()
    return text || null
  } catch (e) {
    console.warn(`⚠️ Free Gemini text error: ${(e as Error)?.message || e}`)
    return null
  }
}
