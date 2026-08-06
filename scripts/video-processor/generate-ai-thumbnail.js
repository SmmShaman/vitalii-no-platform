/**
 * generate-ai-thumbnail.js
 *
 * AI-powered YouTube thumbnail generator using Gemini.
 * Uses REAL article images as base + Gemini composition for text overlays.
 * Generates 1280x720 PNG thumbnails with bold text, news aesthetic, vitalii.no branding.
 *
 * Exports:
 *   generateAIThumbnail(articles, clickbaitTitle, dateStr) → single thumbnail path
 *   generateThumbnailVariants(articles, clickbaitTitle, dateStr, count) → array of {style, buffer}
 */

import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

// Paid Gemini removed (owner policy 2026-08-06): thumbnails run OpenRouter → FLUX.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const CF_API_TOKEN = process.env.CF_API_TOKEN || '';
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '1438e8d03009209c4a82ea4c28bdb358';
const TIMEOUT_MS = 60_000;

// ── 4 Overlay Styles (applied on real article images) ──

const VISUAL_STYLES = [
  {
    id: 'dark_overlay',
    name: 'Темне затемнення',
    prompt: 'Darken the entire image to approximately 35-40% of its original brightness. Apply a smooth dark gradient overlay that is darkest on the left side (for text readability) and slightly lighter on the right. Keep the main subject still recognizable.',
  },
  {
    id: 'blur_glass',
    name: 'Blur + Glass',
    prompt: 'Apply a moderate Gaussian blur to the entire image. Then add a semi-transparent frosted glass panel (dark, 70% opacity) covering the left 60% where text will be placed. The right 40% shows the blurred photo more clearly. The glass panel has a subtle border glow in orange (#FF7A00).',
  },
  {
    id: 'zoom_vignette',
    name: 'Zoom + Vignette',
    prompt: 'Crop and zoom into the most visually interesting part of the image to fill the 1280x720 frame. Apply a strong vignette effect — dark corners fading to near-black at edges. Center-right remains brightest. Add slight warm color grading.',
  },
  {
    id: 'split_layout',
    name: 'Split Layout',
    prompt: 'Create a split composition: LEFT half is solid dark navy (#0a1628) to purple (#1a0a3e) gradient (for text). RIGHT half shows the original image, slightly darkened with cinematic color grade. Add a bright orange (#FF7A00) diagonal line (3px with glow) as divider at ~80 degrees.',
  },
];

function formatDateNorwegian(dateStr) {
  const months = [
    'januar', 'februar', 'mars', 'april', 'mai', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'desember',
  ];
  const d = new Date(dateStr);
  return `${d.getUTCDate()}. ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// ── Image helpers ──

async function downloadImageAsBase64(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!resp.ok) return null;
    const buffer = await resp.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  } catch {
    return null;
  }
}

function getPngDimensions(buffer) {
  if (buffer.length < 24 || buffer[0] !== 137 || buffer[1] !== 80) return null;
  const width = (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19];
  const height = (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23];
  return { width, height };
}

async function ensureSize(buffer) {
  try {
    const sharp = (await import('sharp')).default;
    const meta = await sharp(buffer).metadata();
    console.log(`📐 Output: ${meta.width}×${meta.height} (${meta.format})`);
    if (meta.width !== 1280 || meta.height !== 720) {
      console.log(`🔧 Resizing to 1280×720...`);
      return await sharp(buffer).resize(1280, 720, { fit: 'cover' }).png().toBuffer();
    }
  } catch (e) {
    // Fallback: try PNG header parsing
    const dims = getPngDimensions(buffer);
    if (dims) {
      console.log(`📐 Output (PNG header): ${dims.width}×${dims.height}`);
    } else {
      console.warn(`⚠️ Cannot determine dimensions: ${e.message}, using original`);
    }
  }
  return buffer;
}

// ── Core image call — OpenRouter (prepaid balance), paid Gemini removed
// per owner policy 2026-08-06. Keeps the old name so call sites don't change;
// the `apiKey` argument is ignored. FLUX fallback lives in the callers.

async function callGeminiImage(prompt, _apiKey, inputImageBase64) {
  const orKey = process.env.OPENROUTER_API_KEY || '';
  if (!orKey) {
    console.warn('⚠️ OPENROUTER_API_KEY not set — skipping OpenRouter thumbnail');
    return null;
  }
  const model = process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-2.5-flash-image';

  const content = inputImageBase64
    ? [
        { type: 'text', text: `${prompt}\n\nComposition: strict 16:9 aspect ratio.` },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${inputImageBase64}` } },
      ]
    : `${prompt}\n\nComposition: strict 16:9 aspect ratio.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${orKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content }],
        modalities: ['image', 'text'],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`❌ OpenRouter ${response.status}: ${(await response.text().catch(() => '')).slice(0, 150)}`);
      return null;
    }

    const data = await response.json();
    const dataUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url || '';
    const b64Idx = dataUrl.indexOf('base64,');
    if (b64Idx < 0) {
      console.error('❌ OpenRouter response contains no image data');
      return null;
    }
    return Buffer.from(dataUrl.substring(b64Idx + 7), 'base64');
  } catch (error) {
    console.error(`❌ OpenRouter: ${error.name === 'AbortError' || error.name === 'TimeoutError' ? 'timed out' : error.message}`);
    return null;
  }
}

// ── Prompt Builder ──

function buildThumbnailPrompt(headline, displayDate, articleCount, style, hasImage) {
  const imageInstruction = hasImage
    ? `Take the provided news article image and transform it into a YouTube thumbnail.

IMAGE PROCESSING:
${style.prompt}`
    : `Generate a professional YouTube thumbnail with a dark gradient background (navy #0a1628 to purple #1a0a3e).
${style.prompt}`;

  return `${imageInstruction}

OUTPUT: 16:9 landscape image.

TEXT OVERLAYS — render these EXACTLY as specified:

1. MAIN HEADLINE (dominant element, upper-left area):
"${headline}"
- Font: Impact or Montserrat ExtraBold, 160-220px height
- Color: pure white (#FFFFFF)
- Add thick black outline (3-4px stroke) AND strong drop shadow for readability
- Maximum 2 lines, left-aligned
- This is the MOST important visual element — it must DOMINATE the thumbnail

2. ARTICLE COUNT BADGE (top-right corner):
"${articleCount}" inside an orange (#FF7A00) circle or rounded square
- Number should be large and bold (80-100px)
- White text on solid orange background

3. CHANNEL BRANDING (bottom-left, subtle):
"vitalii.no" — small white text (24-28px), semi-transparent

COMPOSITION RULES:
- Text in LEFT 60% of frame, image detail visible in RIGHT 40%
- Bottom-right corner MUST be empty (YouTube duration badge zone)
- All text within center 84% safe area
- Strong visual hierarchy: headline > badge > branding
- Maximum 3 colors: dark background, orange #FF7A00 accent, white text

TEXT LANGUAGE: Norwegian Bokmal ONLY. No emojis anywhere.
OUTPUT: Image only, no text response.`;
}

// ── Cloudflare FLUX Fallback ──

async function callCloudflareFlux(headline, articleCount, dateStr) {
  if (!CF_API_TOKEN) return null;
  const prompt = `Professional YouTube news thumbnail, dark navy background, bold white headline text "${headline}", orange badge with number ${articleCount}, photorealistic news studio aesthetic, 16:9 format, dramatic lighting, no watermarks`;
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, steps: 4, width: 1280, height: 720 }),
      }
    );
    if (!res.ok) { console.error(`❌ Cloudflare FLUX: ${res.status}`); return null; }
    const data = await res.json();
    if (!data?.success || !data?.result?.image) { console.error('❌ Cloudflare FLUX: no image in response'); return null; }
    console.log('✅ Cloudflare FLUX thumbnail generated');
    return Buffer.from(data.result.image, 'base64');
  } catch (e) {
    console.error(`❌ Cloudflare FLUX: ${e.message}`);
    return null;
  }
}

// ── Single Thumbnail (backward compat) ──

export async function generateAIThumbnail(articles, clickbaitTitle, dateStr) {
  const displayDate = formatDateNorwegian(dateStr);

  // Try to use the first article's image
  let imageBase64 = null;
  for (const a of articles) {
    const imgUrl = a.processed_image_url || a.image_url;
    if (imgUrl) {
      imageBase64 = await downloadImageAsBase64(imgUrl);
      if (imageBase64) break;
    }
  }

  let buffer = null;

  // Try OpenRouter first (prepaid balance)
  if (OPENROUTER_API_KEY) {
    const prompt = buildThumbnailPrompt(clickbaitTitle, displayDate, articles.length, VISUAL_STYLES[0], !!imageBase64);
    console.log(`🖼️ Generating thumbnail via OpenRouter (${imageBase64 ? 'with article image' : 'text-only'})...`);
    buffer = await callGeminiImage(prompt, null, imageBase64);
    if (!buffer) console.warn('⚠️ OpenRouter thumbnail failed, trying Cloudflare FLUX...');
  }

  // Fallback: Cloudflare FLUX
  if (!buffer) {
    buffer = await callCloudflareFlux(clickbaitTitle, articles.length, dateStr);
  }

  if (!buffer) {
    console.warn('⚠️ All thumbnail providers failed');
    return null;
  }

  buffer = await ensureSize(buffer);
  const outputPath = join(tmpdir(), `yt_thumb_${dateStr}_${Date.now()}.png`);
  await writeFile(outputPath, buffer);
  console.log(`✅ AI thumbnail saved: ${outputPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
  return outputPath;
}

// ── 4 Variant Generation ──

export async function generateThumbnailVariants(articles, clickbaitTitle, dateStr, count = 4) {
  if (!OPENROUTER_API_KEY) {
    console.log('⚠️ OPENROUTER_API_KEY not set');
    return [];
  }

  const displayDate = formatDateNorwegian(dateStr);
  const styles = VISUAL_STYLES.slice(0, count);

  // Collect article images
  const articleImages = [];
  for (const a of articles) {
    const imgUrl = a.processed_image_url || a.image_url;
    if (imgUrl) {
      articleImages.push(imgUrl);
      if (articleImages.length >= count) break;
    }
  }

  // Download images in parallel
  console.log(`📥 Downloading ${articleImages.length} article images...`);
  const imageBase64List = await Promise.all(articleImages.map(downloadImageAsBase64));
  const validImages = imageBase64List.filter(Boolean);
  console.log(`✅ Downloaded ${validImages.length}/${articleImages.length} images`);

  console.log(`🖼️ Generating ${styles.length} variants sequentially...`);
  const variants = [];

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    const img = validImages.length > 0 ? validImages[i % validImages.length] : null;
    console.log(`  🎨 ${i + 1}/${styles.length}: ${style.name} (${img ? 'with image' : 'text-only'})`);

    const prompt = buildThumbnailPrompt(clickbaitTitle, displayDate, articles.length, style, !!img);
    let buffer = await callGeminiImage(prompt, null, img);

    if (buffer) {
      buffer = await ensureSize(buffer);
      console.log(`  ✅ ${style.name}: ${(buffer.length / 1024).toFixed(0)} KB`);
      variants.push({ style: style.id, styleName: style.name, buffer });
    } else {
      console.warn(`  ⚠️ ${style.name} failed, skipping`);
    }
  }

  console.log(`✅ Generated ${variants.length}/${styles.length} variants`);
  return variants;
}

export { VISUAL_STYLES };
