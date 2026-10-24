/**
 * Cloudflare R2 upload — primary image storage (Supabase Storage buckets are gone on
 * the self-hosted stack, so `storage.from(...).upload` fails with "Bucket not found").
 */
// Cloudflare R2 — primary storage (replaces Supabase Storage)
const CF_API_TOKEN = Deno.env.get('CF_API_TOKEN') ?? ''
const CF_ACCOUNT_ID = Deno.env.get('CF_ACCOUNT_ID') ?? '1438e8d03009209c4a82ea4c28bdb358'
const R2_BUCKET = 'news-images'
const R2_PUBLIC_BASE = 'https://pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev'

export async function uploadToR2(key: string, data: Uint8Array, contentType: string): Promise<string | null> {
  if (!CF_API_TOKEN) {
    console.error('❌ CF_API_TOKEN not set — cannot upload to R2')
    return null
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${key}`
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': contentType,
      },
      body: data,
    })
    if (!res.ok) {
      const err = await res.text()
      console.error(`❌ R2 upload failed for ${key}: ${res.status} ${err.substring(0, 200)}`)
      return null
    }
    return `${R2_PUBLIC_BASE}/${key}`
  } catch (e: any) {
    console.error(`❌ R2 upload exception for ${key}: ${e?.message}`)
    return null
  }
}
