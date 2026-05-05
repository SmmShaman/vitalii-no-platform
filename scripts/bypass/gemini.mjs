// Gemini API helpers (text + image generation)

const DEFAULT_MODEL = 'gemini-2.5-flash'

export async function callGemini(systemPrompt, userPrompt, opts = {}) {
  const key = process.env.GOOGLE_API_KEY
  if (!key) throw new Error('GOOGLE_API_KEY not set')
  const model = opts.model || DEFAULT_MODEL
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.5,
        maxOutputTokens: opts.maxTokens ?? 8000,
      },
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini ${model} ${res.status}: ${err.slice(0, 300)}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Gemini returned empty response')
  return text
}

export function extractJSON(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error(`No JSON found in: ${cleaned.slice(0, 200)}`)
  return JSON.parse(match[0])
}

// Generate image using Gemini 3 Pro Image
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
