// One resized copy of a project cover for every place that shows it (hover grid, projects
// window, mobile). Same URL everywhere means the browser fetches each cover once; the raw
// files are ~500 KB each and 13 of them at once tripped Cloudflare's per-IP 429.
export const COVER_WIDTH = 640

export function coverUrl(src: string | undefined, width: number = COVER_WIDTH): string | undefined {
  if (!src || !src.startsWith('/') || src.startsWith('/_next/')) return src
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`
}
