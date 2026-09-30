// Resized copies of OUR images via the Next image optimizer.
//
// Only local files and our own R2 bucket go through it. External publisher images
// stay direct hotlinks on purpose: proxying them would store a copy on our server,
// which the hotlink defence in the Copyright Agent (NTB) matter depends on not doing.
const R2_PUBLIC = 'https://pub-612755c33acf4a878ca21c80dcd5cbe8.r2.dev/'

export const COVER_WIDTH = 640

export function optimizedImageUrl(src: string | undefined | null, width: number): string | undefined {
  if (!src) return undefined
  const ours = (src.startsWith('/') && !src.startsWith('/_next/') && !src.startsWith('//')) || src.startsWith(R2_PUBLIC)
  if (!ours) return src
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`
}

// One resized copy of a project cover for every place that shows it (hover grid, projects
// window, mobile). Same URL everywhere means the browser fetches each cover once; the raw
// files are ~500 KB each and 13 of them at once tripped Cloudflare's per-IP 429.
export function coverUrl(src: string | undefined, width: number = COVER_WIDTH): string | undefined {
  return optimizedImageUrl(src, width)
}
