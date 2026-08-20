import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function getSetting(supabase: ReturnType<typeof createClient>, key: string): Promise<string> {
  const { data } = await supabase.from('api_settings').select('key_value').eq('key_name', key).maybeSingle()
  return (data?.key_value as string) || ''
}

async function postToLinkedIn(text: string, supabase: ReturnType<typeof createClient>, videoUrl?: string | null): Promise<{ url?: string; error?: string; videoUsed?: boolean }> {
  const token = (await getSetting(supabase, 'LINKEDIN_ACCESS_TOKEN')) || Deno.env.get('LINKEDIN_ACCESS_TOKEN') || ''
  const urn = (await getSetting(supabase, 'LINKEDIN_PERSON_URN')) || Deno.env.get('LINKEDIN_PERSON_URN') || ''
  if (!token || !urn) return { error: 'LinkedIn credentials not configured' }

  // Native video: Assets API registerUpload → PUT bytes → wait AVAILABLE → ugcPost VIDEO.
  // Any failure falls back to the plain text post so the daily task never dies on media.
  let videoAsset: string | null = null
  if (videoUrl) {
    try {
      const regRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-video'],
            owner: urn,
            serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
          },
        }),
      })
      if (!regRes.ok) throw new Error(`registerUpload ${regRes.status}: ${(await regRes.text()).slice(0, 200)}`)
      const reg = await regRes.json()
      const uploadUrl = reg?.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl
      const asset = reg?.value?.asset
      if (!uploadUrl || !asset) throw new Error('registerUpload: no uploadUrl/asset in response')

      const videoRes = await fetch(videoUrl)
      if (!videoRes.ok) throw new Error(`video fetch ${videoRes.status}`)
      const bytes = new Uint8Array(await videoRes.arrayBuffer())
      if (bytes.length > 50 * 1024 * 1024) throw new Error(`video too large: ${bytes.length} bytes`)

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: bytes,
      })
      if (putRes.status < 200 || putRes.status >= 300) throw new Error(`upload PUT ${putRes.status}`)

      // Poll asset processing (feature clips are ~2.5 MB; usually AVAILABLE well under a minute)
      const assetId = asset.split(':').pop()
      let ready = false
      for (let i = 0; i < 24; i++) {
        await new Promise(r => setTimeout(r, 5000))
        const stRes = await fetch(`https://api.linkedin.com/v2/assets/${assetId}`, {
          headers: { Authorization: `Bearer ${token}`, 'X-Restli-Protocol-Version': '2.0.0' },
        })
        if (!stRes.ok) continue
        const st = await stRes.json()
        const status = st?.recipes?.[0]?.status
        if (status === 'AVAILABLE') { ready = true; break }
        if (status === 'CLIENT_ERROR' || status === 'SERVER_ERROR') throw new Error(`asset processing ${status}`)
      }
      if (!ready) throw new Error('asset not AVAILABLE after 120s')
      videoAsset = asset
    } catch (e) {
      console.error('LinkedIn video upload failed, falling back to text-only:', (e as Error).message)
      videoAsset = null
    }
  }

  const shareContent = videoAsset
    ? {
        shareCommentary: { text: text.slice(0, 3000) },
        shareMediaCategory: 'VIDEO',
        media: [{ status: 'READY', media: videoAsset }],
      }
    : { shareCommentary: { text: text.slice(0, 3000) }, shareMediaCategory: 'NONE' }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
    body: JSON.stringify({
      author: urn,
      lifecycleState: 'PUBLISHED',
      specificContent: { 'com.linkedin.ugc.ShareContent': shareContent },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }),
  })
  if (res.status === 401) return { error: 'LinkedIn token expired' }
  if (!res.ok) return { error: `LinkedIn ${res.status}: ${(await res.text()).slice(0, 300)}` }
  const postId = res.headers.get('x-restli-id') || ''
  return { url: postId ? `https://www.linkedin.com/feed/update/${postId}/` : undefined, videoUsed: !!videoAsset }
}

async function postToFacebook(text: string, imageUrl: string | null, videoUrl?: string | null): Promise<{ url?: string; error?: string; videoUsed?: boolean }> {
  const fbToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN') || ''
  const fbPageId = Deno.env.get('FACEBOOK_PAGE_ID') || ''
  if (!fbToken || !fbPageId) return { error: 'Facebook credentials not configured' }

  // Native video post: Graph pulls the file itself from file_url (R2 public URL).
  // On failure fall back to the plain feed post below.
  if (videoUrl) {
    const vForm = new URLSearchParams({
      access_token: fbToken,
      file_url: videoUrl,
      description: text.slice(0, 2000),
    })
    const vRes = await fetch(`https://graph.facebook.com/v19.0/${fbPageId}/videos`, { method: 'POST', body: vForm })
    const vData = await vRes.json()
    if (vRes.ok && !vData.error && vData.id) {
      return { url: `https://www.facebook.com/${fbPageId}/videos/${vData.id}`, videoUsed: true }
    }
    console.error('Facebook video post failed, falling back to text:', vData?.error?.message || vRes.status)
  }

  const form = new URLSearchParams({ access_token: fbToken, message: text.slice(0, 2000) })
  let endpoint = `https://graph.facebook.com/v19.0/${fbPageId}/feed`
  if (imageUrl) {
    form.append('url', imageUrl)
    endpoint = `https://graph.facebook.com/v19.0/${fbPageId}/photos`
  }
  const res = await fetch(endpoint, { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok || data.error) return { error: data.error?.message || `Facebook ${res.status}` }
  const id = data.id || data.post_id
  return { url: id ? `https://www.facebook.com/${id}` : undefined, videoUsed: false }
}

async function postToInstagram(caption: string, imageUrl: string | null): Promise<{ url?: string; error?: string }> {
  const fbToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN') || ''
  const igId = Deno.env.get('INSTAGRAM_ACCOUNT_ID') || ''
  if (!fbToken || !igId) return { error: 'Instagram credentials not configured' }
  if (!imageUrl) return { error: 'Instagram requires an image' }

  const createForm = new URLSearchParams({ image_url: imageUrl, caption: caption.slice(0, 2200), access_token: fbToken })
  const createRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media`, { method: 'POST', body: createForm })
  const createData = await createRes.json()
  if (!createRes.ok || createData.error) return { error: createData.error?.message || `IG create ${createRes.status}` }

  await new Promise(r => setTimeout(r, 3000))
  const pubForm = new URLSearchParams({ creation_id: createData.id, access_token: fbToken })
  const pubRes = await fetch(`https://graph.facebook.com/v19.0/${igId}/media_publish`, { method: 'POST', body: pubForm })
  const pubData = await pubRes.json()
  if (!pubRes.ok || pubData.error) return { error: pubData.error?.message || `IG publish ${pubRes.status}` }
  return { url: `https://www.instagram.com/p/${pubData.id}/` }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    const body = await req.json().catch(() => ({}))
    const { platform, text, imageUrl, videoUrl, dryRun } = body as {
      platform?: 'linkedin' | 'facebook' | 'instagram'
      text?: string
      imageUrl?: string | null
      videoUrl?: string | null
      dryRun?: boolean
    }

    if (!platform || !text) return json({ ok: false, error: 'platform and text are required' }, 400)

    if (dryRun) {
      // Validate credentials are present without actually posting
      const checks: Record<string, boolean> = {
        linkedin: !!(Deno.env.get('LINKEDIN_ACCESS_TOKEN') || (await getSetting(supabase, 'LINKEDIN_ACCESS_TOKEN'))),
        facebook: !!(Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN') && Deno.env.get('FACEBOOK_PAGE_ID')),
        instagram: !!(Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN') && Deno.env.get('INSTAGRAM_ACCOUNT_ID')),
      }
      return json({ ok: true, dryRun: true, platform, credentialsOk: checks[platform], textLength: text.length })
    }

    let result: { url?: string; error?: string; videoUsed?: boolean }
    if (platform === 'linkedin') result = await postToLinkedIn(text, supabase, videoUrl || null)
    else if (platform === 'facebook') result = await postToFacebook(text, imageUrl || null, videoUrl || null)
    else if (platform === 'instagram') result = await postToInstagram(text, imageUrl || null)
    else return json({ ok: false, error: `Unknown platform: ${platform}` }, 400)

    if (result.error) return json({ ok: false, error: result.error })
    return json({ ok: true, url: result.url, videoUsed: result.videoUsed ?? false })
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500)
  }
})
