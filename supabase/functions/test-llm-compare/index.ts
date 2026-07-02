// Temporary test function — compare two NVIDIA NIM models on the same prompt.
// Delete after use.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const NVIDIA_API_KEY = Deno.env.get('NVIDIA_API_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { content, title, model } = await req.json()

    if (!NVIDIA_API_KEY) {
      return new Response(JSON.stringify({ error: 'NVIDIA_API_KEY not set' }), { status: 500 })
    }

    const systemPrompt = `You are an experienced Norwegian tech-news journalist. Rewrite the user's article in clear, neutral Norwegian (bokmål), keeping all facts intact. Output ONLY the rewritten article body (no title, no metadata, 250-400 words).`

    const userMessage = title ? `Title: ${title}\n\nBody: ${content}` : content

    const t0 = Date.now()
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.5,
        max_tokens: 1200
      })
    })
    const elapsed = Date.now() - t0

    const bodyText = await res.text()
    if (!res.ok) {
      return new Response(JSON.stringify({ error: bodyText.substring(0, 800), status: res.status, model, elapsed_ms: elapsed }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const data = JSON.parse(bodyText)
    return new Response(JSON.stringify({
      model,
      elapsed_ms: elapsed,
      output: data.choices?.[0]?.message?.content || '(empty)',
      usage: data.usage || null
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
