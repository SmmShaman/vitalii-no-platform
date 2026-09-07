/**
 * LinkedIn helpers shared by post-to-linkedin and nano-social-publish.
 *
 * Why a first comment for the link: LinkedIn's feed ranks posts with an external URL in
 * the body below native posts. The body therefore says "link in the first comment", and
 * the article URL is posted as a comment by the same author right after publishing.
 */

const RESTLI_HEADERS = (token: string) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'X-Restli-Protocol-Version': '2.0.0',
})

/** Localized body line replacing the raw article URL. */
export const LINKEDIN_LINK_IN_COMMENT: Record<string, string> = {
  en: '📖 Full article on vitalii.no — link in the first comment 👇',
  no: '📖 Hele artikkelen på vitalii.no — lenke i første kommentar 👇',
  ua: '📖 Повна стаття на vitalii.no — посилання в першому коментарі 👇',
}

/** Localized text of that first comment. */
export const LINKEDIN_COMMENT_LABEL: Record<string, string> = {
  en: '🔗 Full article',
  no: '🔗 Hele artikkelen',
  ua: '🔗 Повна стаття',
}

/**
 * Upload an image to LinkedIn (Assets API) and return the asset URN, or null on any failure.
 * Callers fall back to ARTICLE/NONE share categories when this returns null.
 */
export async function uploadImageToLinkedIn(
  imageUrl: string,
  token: string,
  ownerUrn: string,
): Promise<string | null> {
  try {
    console.log('🖼️ Uploading image to LinkedIn...', imageUrl.substring(0, 60))

    const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
      method: 'POST',
      headers: RESTLI_HEADERS(token),
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: ownerUrn,
          serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
        },
      }),
    })
    if (!registerResponse.ok) {
      console.error('LinkedIn register upload error:', registerResponse.status, (await registerResponse.text()).slice(0, 200))
      return null
    }
    const registerResult = await registerResponse.json()
    const uploadUrl = registerResult.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl
    const asset = registerResult.value?.asset
    if (!uploadUrl || !asset) {
      console.error('Missing upload URL or asset from register response')
      return null
    }

    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      console.error('Failed to download source image:', imageResponse.status)
      return null
    }
    const imageBuffer = await imageResponse.arrayBuffer()
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': contentType },
      body: imageBuffer,
    })
    if (!uploadResponse.ok) {
      console.error('LinkedIn upload error:', uploadResponse.status, (await uploadResponse.text()).slice(0, 200))
      return null
    }
    console.log('✅ Image uploaded to LinkedIn, asset:', asset)
    return asset
  } catch (error) {
    console.error('Error uploading image to LinkedIn:', (error as Error).message)
    return null
  }
}

/**
 * Post a comment under a freshly published share/ugcPost as the same author.
 * Retries once — the post is sometimes not yet commentable in the first second.
 */
export async function commentOnLinkedInPost(
  postUrn: string,
  text: string,
  token: string,
  actorUrn: string,
): Promise<{ ok: boolean; error?: string }> {
  const endpoint = `https://api.linkedin.com/v2/socialActions/${encodeURIComponent(postUrn)}/comments`
  let lastError = ''
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: RESTLI_HEADERS(token),
        body: JSON.stringify({ actor: actorUrn, message: { text: text.slice(0, 1250) } }),
      })
      if (res.ok || res.status === 201) return { ok: true }
      lastError = `comment ${res.status}: ${(await res.text()).slice(0, 200)}`
    } catch (e) {
      lastError = (e as Error).message
    }
    console.warn(`⚠️ LinkedIn comment attempt ${attempt} failed: ${lastError}`)
    await new Promise(r => setTimeout(r, 2000 * attempt))
  }
  return { ok: false, error: lastError }
}
