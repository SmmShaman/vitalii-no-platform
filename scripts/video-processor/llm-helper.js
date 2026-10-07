/**
 * LLM Helper for Video Processor scripts (Node.js)
 *
 * Chain: free Gemini key → Groq gpt-oss-120b (free tier). NVIDIA NIM
 * (llama-3.3-70b EOL 2026-08-26, 410) and Claude (Anthropic API account has no
 * credits) were dead links and were removed on 2026-10-07.
 */

// Free no-billing Gemini key ONLY (owner policy 2026-08-06) — the paid
// GOOGLE_API_KEY must never be a text fallback. Needs the GEMINI_FREE_API_KEY
// secret in GitHub Actions; without it callers fall back to heuristics.
const GEMINI_FREE_API_KEY = process.env.GEMINI_FREE_API_KEY || '';
const GEMINI_FREE_MODEL = process.env.GEMINI_FREE_MODEL_LITE || 'gemini-3.1-flash-lite';
// Groq free tier: gpt-oss-120b = 8k TPM / 200k TPD, pool shared with the
// portfolio edge functions (digest runs ~05:00 UTC, before they drain it).
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_VIDEO_MODEL || 'openai/gpt-oss-120b';
const LLM_TIMEOUT_MS = 120_000;

/** Fetch with AbortController timeout */
async function fetchWithTimeout(url, options, timeoutMs = LLM_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Call LLM with system + user prompt. Returns raw text.
 * Accumulates errors from all providers for better diagnostics.
 */
export async function callLLM(systemPrompt, userPrompt, options = {}) {
  const { maxTokens = 4000, temperature = 0.7, jsonMode = false } = options;
  const errors = [];

  // Free Gemini key (429s over quota, never invoices).
  if (GEMINI_FREE_API_KEY) {
    try {
      return await callGemini(systemPrompt, userPrompt, { maxTokens, temperature, jsonMode });
    } catch (err) {
      errors.push(`Gemini: ${err.message}`);
      console.warn(`⚠️ Gemini failed: ${err.message.substring(0, 120)}, falling back to Groq`);
    }
  }

  if (GROQ_API_KEY) {
    try {
      return await callGroq(systemPrompt, userPrompt, { maxTokens, temperature, jsonMode });
    } catch (err) {
      errors.push(`Groq: ${err.message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`All LLM backends failed:\n  - ${errors.join('\n  - ')}`);
  }
  throw new Error('No LLM credentials available (GEMINI_FREE_API_KEY or GROQ_API_KEY required)');
}

/**
 * Call LLM and parse JSON response. Safe JSON extraction with fallback.
 */
export async function callLLMJson(systemPrompt, userPrompt, options = {}) {
  const raw = await callLLM(systemPrompt, userPrompt, { ...options, jsonMode: true });

  // Extract JSON — try markdown fences first, then raw
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/i);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : raw.trim();

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // Fallback: extract first {...} block (non-greedy)
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch { /* fall through */ }
    }
    console.error(`LLM JSON parse failed. Raw (500 chars): ${raw.substring(0, 500)}`);
    throw new Error(`LLM JSON parse failed: ${e.message}`);
  }
}

// ── Gemini (free no-billing key) ──

async function callGemini(systemPrompt, userPrompt, { maxTokens, temperature, jsonMode }) {
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_FREE_MODEL}:generateContent?key=${GEMINI_FREE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
        },
      }),
    },
  );

  if (!response.ok) {
    const bodyText = await response.text().catch(() => '');
    throw new Error(`Gemini ${response.status}: ${bodyText.substring(0, 300)}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const content = parts.map(p => p.text || '').join('').trim();
  if (!content) throw new Error('Empty Gemini response');

  const usage = data.usageMetadata;
  if (usage) {
    console.log(`💰 Gemini tokens: ${usage.promptTokenCount}+${usage.candidatesTokenCount}`);
  }

  return content;
}

// ── Groq gpt-oss (free tier, OpenAI-compatible) ──

async function callGroq(systemPrompt, userPrompt, { maxTokens, temperature, jsonMode }) {
  // gpt-oss reasons before answering and those tokens count against max_tokens:
  // without reasoning_effort + headroom it returns EMPTY content.
  const response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      max_tokens: Math.min(Math.max(maxTokens + 1500, 2000), 8192),
      reasoning_effort: 'low',
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => '');
    throw new Error(`Groq ${response.status}: ${bodyText.substring(0, 300)}`);
  }

  const data = await response.json();
  const content = (data.choices?.[0]?.message?.content || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  if (!content) throw new Error('Empty Groq response');

  const usage = data.usage;
  if (usage) {
    console.log(`💰 Groq tokens: ${usage.prompt_tokens}+${usage.completion_tokens}`);
  }

  return content;
}
