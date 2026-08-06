// AI API helpers — cascade: free Gemini → Groq → Nvidia NIM
// Owner policy 2026-08-06: paid GOOGLE_API_KEY removed everywhere. Text runs on
// the no-billing GEMINI_FREE_API_KEY (429s over quota, never invoices); images
// go OpenRouter (prepaid balance) → Cloudflare FLUX (free).
// NOTE: gemini-2.5-flash 404s on the free project — lite is the workhorse.

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_FREE_MODEL_LITE || 'gemini-3.1-flash-lite'

// ── Gemini (free key) ─────────────────────────────────────────────────────

async function callGeminiDirect(systemPrompt, userPrompt, opts = {}) {
  const key = process.env.GEMINI_FREE_API_KEY
  if (!key) throw new Error('GEMINI_FREE_API_KEY not set')
  const model = opts.model || DEFAULT_GEMINI_MODEL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: { temperature: opts.temperature ?? 0.5, maxOutputTokens: opts.maxTokens ?? 8000 },
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini ${model} ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Gemini returned empty response')
  return text
}

// ── Groq ──────────────────────────────────────────────────────────────────

async function callGroq(systemPrompt, userPrompt, opts = {}) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('GROQ_API_KEY not set')
  const model = opts.groqModel || 'llama-3.3-70b-versatile'
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: opts.temperature ?? 0.5,
      max_tokens: opts.maxTokens ?? 8000,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq ${model} ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content || ''
  if (!text) throw new Error('Groq returned empty response')
  return text
}

// ── Nvidia NIM ────────────────────────────────────────────────────────────

async function callNvidia(systemPrompt, userPrompt, opts = {}) {
  const key = process.env.NVIDIA_API_KEY
  if (!key) throw new Error('NVIDIA_API_KEY not set')
  const model = opts.nvidiaModel || 'meta/llama-3.3-70b-instruct'
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: opts.temperature ?? 0.5,
      max_tokens: opts.maxTokens ?? 4000,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Nvidia ${model} ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content || ''
  if (!text) throw new Error('Nvidia returned empty response')
  return text
}

// ── Cascade: try providers in order ──────────────────────────────────────

export async function callGemini(systemPrompt, userPrompt, opts = {}) {
  const providers = [
    { name: 'Gemini', fn: () => callGeminiDirect(systemPrompt, userPrompt, opts) },
    { name: 'Groq', fn: () => callGroq(systemPrompt, userPrompt, opts) },
    { name: 'Nvidia', fn: () => callNvidia(systemPrompt, userPrompt, opts) },
  ]

  const errors = []
  for (const provider of providers) {
    try {
      const result = await provider.fn()
      if (errors.length > 0) console.log(`  ✅ ${provider.name} succeeded (after ${errors.length} failed)`)
      return result
    } catch (e) {
      console.warn(`  ⚠️  ${provider.name} failed: ${e.message.slice(0, 100)}`)
      errors.push(`${provider.name}: ${e.message.slice(0, 100)}`)
    }
  }
  throw new Error(`All AI providers failed:\n${errors.join('\n')}`)
}

export function extractJSON(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error(`No JSON found in: ${cleaned.slice(0, 200)}`)
  return JSON.parse(match[0])
}

// ── Groq Whisper transcription ────────────────────────────────────────────

export async function transcribeAudio(audioPath, mimeType = 'audio/ogg') {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('GROQ_API_KEY not set for transcription')

  const { readFileSync } = await import('fs')
  const audioData = readFileSync(audioPath)
  const blob = new Blob([audioData], { type: mimeType })

  const form = new FormData()
  form.append('file', blob, 'audio.ogg')
  form.append('model', 'whisper-large-v3')
  form.append('response_format', 'text')

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}` },
    body: form,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq Whisper ${res.status}: ${err.slice(0, 200)}`)
  }
  return res.text()
}

// ── Image generation: OpenRouter (prepaid) → Cloudflare FLUX (free) ──────
// Keeps the old export name so callers (auto-publish.mjs) don't change.

export async function generateGeminiImage(prompt) {
  const errors = []

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const model = process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-2.5-flash-image'
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: `Generate an image: ${prompt}` }],
          modalities: ['image', 'text'],
        }),
        signal: AbortSignal.timeout(90_000),
      })
      if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`)
      const data = await res.json()
      const dataUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url || ''
      const b64Idx = dataUrl.indexOf('base64,')
      if (b64Idx < 0) throw new Error('OpenRouter response contains no image data')
      const mime = dataUrl.slice(5, dataUrl.indexOf(';')) || 'image/png'
      return { base64: dataUrl.substring(b64Idx + 7), mimeType: mime }
    } catch (e) {
      console.warn(`  ⚠️  OpenRouter image failed: ${e.message.slice(0, 120)}`)
      errors.push(`OpenRouter: ${e.message.slice(0, 120)}`)
    }
  }

  const cfToken = process.env.CF_AI_TOKEN
  const cfAccount = process.env.CF_ACCOUNT_ID || '1438e8d03009209c4a82ea4c28bdb358'
  if (cfToken) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cfAccount}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${cfToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `${prompt}\n\nStyle: professional editorial photography, no text in image, no watermarks`.slice(0, 2000),
            steps: 4, width: 1280, height: 720,
          }),
        },
      )
      if (!res.ok) throw new Error(`FLUX ${res.status}: ${(await res.text()).slice(0, 200)}`)
      const data = await res.json()
      if (!data?.success || !data?.result?.image) throw new Error(`FLUX success=false`)
      return { base64: data.result.image, mimeType: 'image/jpeg' }
    } catch (e) {
      console.warn(`  ⚠️  Cloudflare FLUX failed: ${e.message.slice(0, 120)}`)
      errors.push(`FLUX: ${e.message.slice(0, 120)}`)
    }
  }

  throw new Error(`Free image cascade failed:\n${errors.join('\n') || 'no provider configured (OPENROUTER_API_KEY / CF_AI_TOKEN)'}`)
}
