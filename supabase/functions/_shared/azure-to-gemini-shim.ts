/**
 * LLM Router Shim — routes calls to Groq / Gemini / NVIDIA NIM per task profile.
 * Drop-in replacement for Azure OpenAI calls.
 *
 * Routes (callers pass `llm_route` in the request body, default 'default'):
 *   quality — gpt-oss-120b → gpt-oss-20b → Groq 70b → NVIDIA          (rewrites + translations)
 *   bulk    — Groq 8b-instant → gpt-oss-20b → Gemini → NVIDIA          (high-volume internal scoring)
 *   default — gpt-oss-120b → gpt-oss-20b → Groq 70b → Gemini → NVIDIA  (creative EN: teasers, prompts)
 *
 * Each gpt-oss model carries only 8k TPM, and one article-sized call is ~4k, so
 * the two of them are chained to double the per-minute headroom before the
 * scarce 70b pool or paid Gemini are touched.
 *
 * Groq rate limits are per-model, so every model in the chain draws from its own
 * pool. The 70b pool (100k TPD) is the scarcest and is shared with the jobbot
 * project, so it is no longer the first choice on any route.
 */

const NVIDIA_API_KEY = Deno.env.get('NVIDIA_API_KEY') || ''
const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY') || ''
// Hard daily budget for Gemini text calls: the shared Google project has billing
// enabled (paid image model), so over-limit text usage would cost real money.
// Once the counter exceeds this, Gemini is skipped and the chain falls to Groq/NVIDIA.
const GEMINI_DAILY_LIMIT = parseInt(Deno.env.get('GEMINI_DAILY_LIMIT') || '150', 10)
const NVIDIA_MODEL = Deno.env.get('NVIDIA_MODEL') || 'meta/llama-3.1-70b-instruct'
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash'
const GROQ_MODEL = Deno.env.get('GROQ_MODEL') || 'llama-3.3-70b-versatile'
const GROQ_MODEL_BULK = Deno.env.get('GROQ_MODEL_BULK') || 'llama-3.1-8b-instant'
// gpt-oss models sit on their own Groq pools and reason before answering.
const GROQ_MODEL_REASON = Deno.env.get('GROQ_MODEL_REASON') || 'openai/gpt-oss-120b'
const GROQ_MODEL_REASON_SMALL = Deno.env.get('GROQ_MODEL_REASON_SMALL') || 'openai/gpt-oss-20b'
const GROQ_REASONING_EFFORT = Deno.env.get('GROQ_REASONING_EFFORT') || 'low'
const FETCH_TIMEOUT_MS = 50_000

export type LlmRoute = 'quality' | 'bulk' | 'default'

// Collect all configured Groq keys (GROQ_API_KEY, GROQ_API_KEY_2, GROQ_API_KEY_3)
const GROQ_KEYS: string[] = [
  Deno.env.get('GROQ_API_KEY') || '',
  Deno.env.get('GROQ_API_KEY_2') || '',
  Deno.env.get('GROQ_API_KEY_3') || '',
].filter(k => k.length > 0)

// Pick a random Groq key to distribute load
function pickGroqKey(): string {
  return GROQ_KEYS[Math.floor(Math.random() * GROQ_KEYS.length)]
}

/** Fetch with AbortController timeout */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = FETCH_TIMEOUT_MS): Promise<globalThis.Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

interface LlmCall {
  messages: Array<{ role: string; content: string }>
  temperature: number
  maxTokens: number
  expectsJson: boolean
}

function stripFence(text: string): string {
  if (text.startsWith('```')) {
    return text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  return text
}

function okResponse(text: string, usage: unknown): Response {
  return new Response(JSON.stringify({
    choices: [{ message: { content: text, role: 'assistant' }, finish_reason: 'stop' }],
    usage: usage || { total_tokens: 0 },
  }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

async function tryGroq(call: LlmCall, model: string): Promise<Response | null> {
  if (GROQ_KEYS.length === 0) return null
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const isReasoning = model.startsWith('openai/gpt-oss')
      // Reasoning tokens are charged against max_tokens, so a tight budget comes
      // back as an empty completion. Give reasoning models headroom on top of
      // whatever the caller asked for.
      const tokenBudget = isReasoning
        ? Math.min(Math.max(call.maxTokens + 1500, 2000), 8192)
        : Math.min(call.maxTokens, 8192)
      const groqBody: Record<string, unknown> = {
        model,
        messages: call.messages,
        temperature: call.temperature,
        max_tokens: tokenBudget,
      }
      if (isReasoning) groqBody.reasoning_effort = GROQ_REASONING_EFFORT
      if (call.expectsJson) groqBody.response_format = { type: 'json_object' }

      const groqRes = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${pickGroqKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groqBody),
      })

      if (groqRes.ok) {
        const groqData = await groqRes.json()
        const text = stripFence(groqData?.choices?.[0]?.message?.content?.trim() || '')
        if (text) {
          const u = groqData.usage || {}
          console.log(`🟢 Groq (${model}) — ${text.length} chars | tokens: ${u.prompt_tokens || 0}+${u.completion_tokens || 0}`)
          return okResponse(text, groqData.usage)
        }
      }

      const status = groqRes.status
      const errText = await groqRes.text().catch(() => '')
      console.warn(`⚠️ Groq ${model} failed (${status}): ${errText.substring(0, 200)}`)

      if ((status === 429 || status === 503) && attempt === 0) {
        await new Promise(r => setTimeout(r, 3000))
        continue
      }
      break
    } catch (e) {
      const msg = (e as Error).message
      if (msg.includes('aborted') && attempt === 0) {
        console.warn(`⚠️ Groq timeout, retrying...`)
        continue
      }
      console.warn(`⚠️ Groq error: ${msg}`)
      break
    }
  }
  return null
}

/**
 * Increment today's Gemini call counter and check the budget.
 * Fail-open: if the counter itself errors, allow the call (Groq still backs it up).
 */
async function geminiBudgetOk(): Promise<boolean> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return true
  try {
    const res = await fetchWithTimeout(`${supabaseUrl}/rest/v1/rpc/bump_llm_usage`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_provider: 'gemini' }),
    }, 5_000)
    if (!res.ok) return true
    const count = await res.json()
    if (typeof count === 'number' && count > GEMINI_DAILY_LIMIT) {
      console.warn(`🛑 Gemini daily budget exhausted (${count}/${GEMINI_DAILY_LIMIT}) — skipping Gemini`)
      return false
    }
    return true
  } catch {
    return true
  }
}

async function tryGemini(call: LlmCall): Promise<Response | null> {
  if (!GOOGLE_API_KEY) return null
  if (!(await geminiBudgetOk())) return null
  const parts = call.messages.map(m => m.content).join('\n\n')
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GOOGLE_API_KEY}`

  const generationConfig: Record<string, unknown> = { temperature: call.temperature, maxOutputTokens: call.maxTokens }
  // Gemini 2.5 thinking tokens count against maxOutputTokens AND are billed as
  // output — small-budget calls were coming back truncated mid-sentence after
  // ~750 thought tokens. Disable thinking by default (0); override via env.
  generationConfig.thinkingConfig = { thinkingBudget: parseInt(Deno.env.get('GEMINI_THINKING_BUDGET') || '0', 10) }
  if (call.expectsJson) {
    generationConfig.responseMimeType = 'application/json'
  }

  try {
    const geminiRes = await fetchWithTimeout(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: parts }] }],
        generationConfig,
      }),
    })

    if (geminiRes.ok) {
      const geminiData = await geminiRes.json()
      const text = stripFence(geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '')
      if (text) {
        const um = geminiData.usageMetadata || {}
        console.log(`🟡 Gemini (${GEMINI_MODEL}) — ${text.length} chars | tokens: ${um.promptTokenCount || 0}+${(um.candidatesTokenCount || 0) + (um.thoughtsTokenCount || 0)}`)
        return okResponse(text, { total_tokens: um.totalTokenCount || 0 })
      }
      const blockReason = geminiData?.candidates?.[0]?.finishReason || geminiData?.promptFeedback?.blockReason || 'unknown'
      console.warn(`⚠️ Gemini returned empty text. Reason: ${blockReason}`)
    } else {
      const err = await geminiRes.text()
      console.warn(`⚠️ Gemini failed (${geminiRes.status}): ${err.substring(0, 200)}`)
    }
  } catch (e) {
    console.warn(`⚠️ Gemini error: ${(e as Error).message}`)
  }
  return null
}

async function tryNvidia(call: LlmCall): Promise<Response | null> {
  if (!NVIDIA_API_KEY) return null
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const nvidiaRes = await fetchWithTimeout('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: call.messages,
          temperature: call.temperature,
          max_tokens: call.maxTokens,
        }),
      })

      if (nvidiaRes.ok) {
        const nvidiaData = await nvidiaRes.json()
        const text = stripFence(nvidiaData?.choices?.[0]?.message?.content?.trim() || '')
        if (text) {
          console.log(`🔵 NVIDIA NIM (${NVIDIA_MODEL.split('/')[1]}) — ${text.length} chars`)
          return okResponse(text, nvidiaData.usage)
        }
      }

      const status = nvidiaRes.status
      const errText = await nvidiaRes.text().catch(() => '')
      console.warn(`⚠️ NVIDIA NIM failed (${status}): ${errText.substring(0, 200)}`)

      if ((status === 429 || status === 503) && attempt === 0) {
        await new Promise(r => setTimeout(r, 5000))
        continue
      }
      break
    } catch (e) {
      const msg = (e as Error).message
      if (msg.includes('aborted') && attempt === 0) {
        console.warn(`⚠️ NVIDIA NIM timeout on attempt 1, retrying...`)
        continue
      }
      console.warn(`⚠️ NVIDIA NIM error: ${msg}`)
      break
    }
  }
  return null
}

export async function azureFetch(
  _url: string,
  options: RequestInit,
): Promise<Response> {
  const body = JSON.parse(options.body as string)
  const route: LlmRoute = body.llm_route === 'quality' || body.llm_route === 'bulk' ? body.llm_route : 'default'

  const call: LlmCall = {
    messages: body.messages || [],
    temperature: body.temperature ?? 0.5,
    maxTokens: body.max_tokens ?? 8000,
    // Force-JSON only when the system prompt POSITIVELY asks for JSON — "No JSON,
    // no metadata" style prohibitions must not trigger json_object mode.
    expectsJson: (() => {
      const sys = body.messages?.find((m: { role: string }) => m.role === 'system')?.content || ''
      return /json/i.test(sys) && !/no json|not json|без json/i.test(sys)
    })(),
  }

  let providers: Array<() => Promise<Response | null>>
  if (route === 'quality') {
    // RULE: rewrites and translations never touch Gemini - it is a paid model on
    // this project (billing is enabled) and rewrite is the highest-volume task we
    // have. Owner decision 2026-07-25. Do not add tryGemini to this chain.
    providers = [
      () => tryGroq(call, GROQ_MODEL_REASON),
      () => tryGroq(call, GROQ_MODEL_REASON_SMALL),
      () => tryGroq(call, GROQ_MODEL),
      () => tryNvidia(call),
    ]
  } else if (route === 'bulk') {
    providers = [
      () => tryGroq(call, GROQ_MODEL_BULK),
      () => tryGroq(call, GROQ_MODEL_REASON_SMALL),
      () => tryGemini(call),
      () => tryNvidia(call),
    ]
  } else {
    providers = [
      () => tryGroq(call, GROQ_MODEL_REASON),
      () => tryGroq(call, GROQ_MODEL_REASON_SMALL),
      () => tryGroq(call, GROQ_MODEL),
      () => tryGemini(call),
      () => tryNvidia(call),
    ]
  }

  for (const provider of providers) {
    const res = await provider()
    if (res) return res
  }

  throw new Error(`All LLM providers failed (route=${route})`)
}
