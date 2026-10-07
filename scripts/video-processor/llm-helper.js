/**
 * LLM Helper for Video Processor scripts (Node.js)
 *
 * Backend: free Gemini key only. NVIDIA NIM (llama-3.3-70b EOL 2026-08-26, 410)
 * and Claude (Anthropic API account has no credits) were dead links and were
 * removed on 2026-10-07.
 */

// Free no-billing Gemini key ONLY (owner policy 2026-08-06) — the paid
// GOOGLE_API_KEY must never be a text fallback. Needs the GEMINI_FREE_API_KEY
// secret in GitHub Actions; without it callers fall back to heuristics.
const GEMINI_FREE_API_KEY = process.env.GEMINI_FREE_API_KEY || '';
const GEMINI_FREE_MODEL = process.env.GEMINI_FREE_MODEL_LITE || 'gemini-3.1-flash-lite';
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
    }
  }

  if (errors.length > 0) {
    throw new Error(`All LLM backends failed:\n  - ${errors.join('\n  - ')}`);
  }
  throw new Error('No LLM credentials available (GEMINI_FREE_API_KEY required)');
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
