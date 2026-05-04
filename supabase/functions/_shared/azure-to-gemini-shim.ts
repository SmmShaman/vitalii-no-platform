/**
 * LLM Router Shim — Groq (primary, round-robin keys) → Gemini → NVIDIA NIM (fallback)
 * Drop-in replacement for Azure OpenAI calls.
 *
 * Provider order: Groq (300+ t/s, round-robin across up to 3 keys) → Gemini → NVIDIA NIM
 */

const NVIDIA_API_KEY = Deno.env.get('NVIDIA_API_KEY') || ''
const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY') || ''
const NVIDIA_MODEL = Deno.env.get('NVIDIA_MODEL') || 'meta/llama-3.1-70b-instruct'
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash'
const GROQ_MODEL = Deno.env.get('GROQ_MODEL') || 'llama-3.1-8b-instant'
const FETCH_TIMEOUT_MS = 50_000

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

export async function azureFetch(
  _url: string,
  options: RequestInit,
): Promise<Response> {
  const body = JSON.parse(options.body as string)
  const messages: Array<{role: string; content: string}> = body.messages || []
  const temperature = body.temperature ?? 0.5
  const maxTokens = body.max_tokens ?? 8000

  const systemMsg = messages.find(m => m.role === 'system')?.content || ''
  const expectsJson = /json/i.test(systemMsg)

  // ── Provider 1: Groq (fastest — 300+ tokens/sec, round-robin across keys) ──
  if (GROQ_KEYS.length > 0) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const groqBody: Record<string, unknown> = {
          model: GROQ_MODEL,
          messages,
          temperature,
          max_tokens: Math.min(maxTokens, 8192),
        }
        if (expectsJson) groqBody.response_format = { type: 'json_object' }

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
          let text = groqData?.choices?.[0]?.message?.content?.trim() || ''
          if (text) {
            if (text.startsWith('```')) {
              text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
            }
            console.log(`🟢 Groq (${GROQ_MODEL}) — ${text.length} chars`)
            return new Response(JSON.stringify({
              choices: [{ message: { content: text, role: 'assistant' }, finish_reason: 'stop' }],
              usage: groqData.usage || { total_tokens: 0 },
            }), { status: 200, headers: { 'Content-Type': 'application/json' } })
          }
        }

        const status = groqRes.status
        const errText = await groqRes.text().catch(() => '')
        console.warn(`⚠️ Groq failed (${status}): ${errText.substring(0, 200)}`)

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
  }

  // ── Provider 2: Gemini ──
  if (GOOGLE_API_KEY) {
    console.log(`🟡 Fallback to Gemini (${GEMINI_MODEL})`)

    const parts = messages.map(m => m.content).join('\n\n')
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GOOGLE_API_KEY}`

    const generationConfig: Record<string, unknown> = { temperature, maxOutputTokens: maxTokens }
    if (expectsJson) {
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
        let text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''

        if (!text) {
          const blockReason = geminiData?.candidates?.[0]?.finishReason || geminiData?.promptFeedback?.blockReason || 'unknown'
          console.warn(`⚠️ Gemini returned empty text. Reason: ${blockReason}`)
        } else {
          if (text.startsWith('```')) {
            text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
          }
          console.log(`🟡 Gemini (${GEMINI_MODEL}) — ${text.length} chars`)
          return new Response(JSON.stringify({
            choices: [{ message: { content: text, role: 'assistant' }, finish_reason: 'stop' }],
            usage: { total_tokens: 0 },
          }), { status: 200, headers: { 'Content-Type': 'application/json' } })
        }
      } else {
        const err = await geminiRes.text()
        console.warn(`⚠️ Gemini failed (${geminiRes.status}): ${err.substring(0, 200)}`)
      }
    } catch (e) {
      console.warn(`⚠️ Gemini error: ${(e as Error).message}`)
    }
  }

  // ── Provider 3: NVIDIA NIM (slow on free tier, last resort) ──
  if (NVIDIA_API_KEY) {
    console.log(`🔵 Fallback to NVIDIA NIM (${NVIDIA_MODEL})`)
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
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
        })

        if (nvidiaRes.ok) {
          const nvidiaData = await nvidiaRes.json()
          let text = nvidiaData?.choices?.[0]?.message?.content?.trim() || ''

          if (text) {
            if (text.startsWith('```')) {
              text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
            }
            console.log(`🔵 NVIDIA NIM (${NVIDIA_MODEL.split('/')[1]}) — ${text.length} chars`)
            return new Response(JSON.stringify({
              choices: [{ message: { content: text, role: 'assistant' }, finish_reason: 'stop' }],
              usage: nvidiaData.usage || { total_tokens: 0 },
            }), { status: 200, headers: { 'Content-Type': 'application/json' } })
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
  }

  throw new Error('All LLM providers failed (Groq / Gemini / NVIDIA)')
}
