/**
 * Shared LLM helper — Gemini primary, Groq fallback, Claude last resort
 * Usage: import { callLLM } from '../_shared/gemini-llm.ts'
 */

const DEFAULT_MODEL = 'gemini-2.5-flash'

interface LLMOptions {
  temperature?: number
  maxTokens?: number
  model?: string
}

/**
 * Call LLM with system + user prompt. Gemini primary → Groq → Claude fallback.
 */
export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options: LLMOptions = {},
): Promise<string> {
  const groqKey = Deno.env.get('GROQ_API_KEY') || ''

  // Rewrite/translation runs on Groq ONLY (owner decision, 2026-07-23).
  // Gemini is deliberately NOT used here; GOOGLE_API_KEY stays set because other
  // functions (image validation, transcription, comment replies) call Gemini directly.
  if (!groqKey) {
    throw new Error('GROQ_API_KEY is required for rewrite/translation (Groq-only mode)')
  }

  return await callGroq(systemPrompt, userPrompt, options, groqKey)
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  options: LLMOptions,
  apiKey: string,
): Promise<string> {
  const model = options.model || DEFAULT_MODEL
  const temperature = options.temperature ?? 0.5
  const maxTokens = options.maxTokens ?? 8000

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini ${model} error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Gemini returned empty response')
  return text
}

async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  options: LLMOptions,
  apiKey: string,
): Promise<string> {
  const temperature = options.temperature ?? 0.5
  // Groq free tier counts prompt + max_tokens against a 12000 TPM limit — a large
  // max_tokens gets the whole request rejected with 413 before generation starts.
  // Estimate prompt tokens (~4 chars/token) and cap max_tokens to stay under the limit.
  const promptTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 4)
  const budget = Math.max(11500 - promptTokens, 1000)
  const maxTokens = Math.min(options.maxTokens ?? 8000, budget)

  // 2026-08-19: llama-3.3-70b-versatile decommissioned by Groq (404). qwen3.6-27b
  // is the remaining general chat model; it reasons in-band, so hide the thinking.
  const model = Deno.env.get('GROQ_MODEL') || 'qwen/qwen3.6-27b'
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  }
  if (model.startsWith('qwen/')) body.reasoning_format = 'hidden'

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  const text = (data?.choices?.[0]?.message?.content || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  if (!text) throw new Error('Groq returned empty response')

  const usage = data.usage
  if (usage) console.log(`💰 Groq tokens: ${usage.prompt_tokens}+${usage.completion_tokens}`)
  return text
}

async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  options: LLMOptions,
  apiKey: string,
): Promise<string> {
  const temperature = options.temperature ?? 0.5
  const maxTokens = options.maxTokens ?? 8000

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  const text = (data.content || [])
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text || '')
    .join('')
    .trim()
  if (!text) throw new Error('Claude returned empty response')

  const usage = data.usage
  if (usage) console.log(`💰 Claude tokens: ${usage.input_tokens}+${usage.output_tokens}`)
  return text
}

/**
 * Extract JSON from LLM response (handles markdown fences)
 */
export function extractJSON(text: string): string {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error(`No JSON found in response: ${cleaned.slice(0, 200)}`)
  return match[0]
}
