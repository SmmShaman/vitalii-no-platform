// AI API helpers — cascade: Gemini → Groq → Nvidia NIM
// Text generation: all three providers supported
// Image generation: Gemini only

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'

// ── Gemini ────────────────────────────────────────────────────────────────

async function callGeminiDirect(systemPrompt, userPrompt, opts = {}) {
  const key = process.env.GOOGLE_API_KEY
  if (!key) throw new Error('GOOGLE_API_KEY not set')
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

// ── Image generation (Gemini only) ────────────────────────────────────────

export async function generateGeminiImage(prompt) {
  const key = process.env.GOOGLE_API_KEY
  if (!key) throw new Error('GOOGLE_API_KEY not set')
  const model = 'gemini-3-pro-image-preview'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini image ${res.status}: ${err.slice(0, 300)}`)
  }
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts || []
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      return { base64: part.inlineData.data, mimeType: part.inlineData.mimeType }
    }
  }
  throw new Error('No image data in Gemini response')
}
