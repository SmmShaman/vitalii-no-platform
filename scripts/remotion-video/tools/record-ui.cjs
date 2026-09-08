#!/usr/bin/env node
/**
 * record-ui.cjs — deterministic, frame-exact capture of LIVE web pages for a
 * feature clip (owner rule 2026-09-06: the centre of a UI beat is the real
 * product, not a drawn mockup).
 *
 * Why not Playwright's recordVideo: its webm timeline stretches ~1.1x against
 * wall-clock (measured on the Elvarika demo), so narration placed by time
 * walks off the picture. Here every clip frame is one screenshot taken at a
 * scroll position and mouse position computed FROM THE FRAME NUMBER, so the
 * result is as deterministic as a Remotion render and lands exactly inside
 * the voice-synced beat windows.
 *
 * Input:   src/compositions/feature-demos/shots/<id>.json   (the shot spec — see
 *          live-primitives.tsx for the type; the composition imports the same file)
 * Output:  public/rec/<id>-<shot>/fNNNN.jpg   one JPEG per frame, 30 fps (git-ignored)
 *          public/rec/<id>-<shot>.json        per-frame cursor, for debugging
 * Then:    bash tools/encode-rec.sh <id>      → public/rec/<id>-<shot>.mp4 (H.264)
 *
 * Usage:   node tools/record-ui.cjs <id> [shot ...]
 *          PW_PATH=<playwright package dir>   when playwright is not in node_modules
 *          CHROME=<chromium executable>       to override the browser build
 *
 * A page that answers with HTTP >= 400 FAILS the run on purpose: a 404 recorded
 * into a clip is worse than no clip, and the factory reads the failure.
 */
const fs = require("fs");
const path = require("path");

const { chromium } = require(process.env.PW_PATH || "playwright");

const FPS = 30;
const RVID = path.resolve(__dirname, "..");
const OUT_DIR = path.join(RVID, "public", "rec");
const SPEC_DIR = path.join(RVID, "src", "compositions", "feature-demos", "shots");

// ── keyframe interpolation — MUST stay identical to live-primitives.tsx ──
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
/** kfs: [[frame, v1, v2, ...], ...] sorted by frame → values at frame f, eased between keys. */
function track(kfs, f) {
  if (!kfs.length) return [];
  if (f <= kfs[0][0]) return kfs[0].slice(1);
  const last = kfs[kfs.length - 1];
  if (f >= last[0]) return last.slice(1);
  for (let i = 1; i < kfs.length; i++) {
    const a = kfs[i - 1], b = kfs[i];
    if (f <= b[0]) {
      const t = easeInOut((f - a[0]) / (b[0] - a[0]));
      return a.slice(1).map((v, k) => v + (b[k + 1] - v) * t);
    }
  }
  return last.slice(1);
}

function loadSpec(id) {
  const p = path.join(SPEC_DIR, `${id}.json`);
  if (!fs.existsSync(p)) throw new Error(`no shot spec at ${path.relative(RVID, p)}`);
  const spec = JSON.parse(fs.readFileSync(p, "utf8"));
  const problems = [];
  if (!spec.viewport || !spec.viewport.width || !spec.viewport.height) problems.push("viewport {width,height} missing");
  if (!spec.dsf) problems.push("dsf missing");
  if (!Array.isArray(spec.shots) || !spec.shots.length) problems.push("shots[] empty");
  for (const s of spec.shots || []) {
    if (!/^[a-z0-9-]+$/.test(s.name || "")) problems.push(`shot name "${s.name}" must be [a-z0-9-]`);
    if (!/^https?:\/\//.test(s.url || "")) problems.push(`${s.name}: url must be http(s)`);
    if (!(s.frames >= 30)) problems.push(`${s.name}: frames must be >= 30`);
    for (const key of ["scroll", "mouse"]) {
      const k = s[key];
      if (!Array.isArray(k) || !k.length) { problems.push(`${s.name}: ${key} keyframes missing`); continue; }
      for (let i = 1; i < k.length; i++) if (!(k[i][0] > k[i - 1][0])) problems.push(`${s.name}: ${key} keyframes must be strictly increasing in frame`);
      if (k[k.length - 1][0] > s.frames - 1) problems.push(`${s.name}: ${key} keyframe beyond the last frame ${s.frames - 1}`);
    }
    for (const c of s.clicks || []) if (!(c >= 0 && c < s.frames)) problems.push(`${s.name}: click at ${c} outside 0..${s.frames - 1}`);
  }
  if (problems.length) throw new Error(`shot spec ${id}.json is invalid:\n  - ` + problems.join("\n  - "));
  return spec;
}

async function dismissBanners(page, hide) {
  // Cookie banners on vitalii.no ("Accept all") and github.com ("Accept").
  for (const label of [/^Accept all$/i, /^Accept$/i, /^Accept all cookies$/i]) {
    try {
      const btn = page.getByRole("button", { name: label }).first();
      if (await btn.isVisible({ timeout: 800 })) {
        await btn.click({ timeout: 2000 });
        await page.waitForTimeout(400);
      }
    } catch {
      /* not there */
    }
  }
  const sel = [`[class*="cookie" i]`, `[id*="cookie" i]`, `[aria-label*="cookie" i]`, ...hide];
  await page.addStyleTag({ content: `${sel.join(", ")} { display: none !important; }` }).catch(() => {});
}

async function recordShot(browser, spec, shot, id) {
  const ctx = await browser.newContext({
    viewport: spec.viewport,
    deviceScaleFactor: spec.dsf,
    locale: "en-US",
    colorScheme: "light",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  });
  const page = await ctx.newPage();
  console.log(`[${shot.name}] goto ${shot.url}`);
  let resp = null;
  try {
    resp = await page.goto(shot.url, { waitUntil: "networkidle", timeout: 90000 });
  } catch (e) {
    console.log(`[${shot.name}] networkidle not reached (${e.message.split("\n")[0]}) — continuing with what loaded`);
  }
  if (resp && resp.status() === 429) {
    // github.com throttles /commits/<branch> per IP without a Retry-After; one
    // pause and one more try before failing the run (factory rule 2026-09-08).
    console.log(`[${shot.name}] HTTP 429 — waiting 30 s and retrying once`);
    await page.waitForTimeout(30000);
    try {
      resp = await page.goto(shot.url, { waitUntil: "networkidle", timeout: 90000 });
    } catch (e) {
      console.log(`[${shot.name}] retry: networkidle not reached (${e.message.split("\n")[0]}) — continuing with what loaded`);
    }
  }
  if (resp && resp.status() >= 400) throw new Error(`[${shot.name}] ${shot.url} answered HTTP ${resp.status()}`);
  await page.waitForTimeout(800);
  const hide = [...(spec.hide || []), ...(shot.hide || [])];
  await dismissBanners(page, hide);
  // Warm the whole scroll range once so lazy content is in place before frame 0.
  const maxY = Math.max(...shot.scroll.map((k) => k[1]));
  await page.evaluate((y) => window.scrollTo(0, y), maxY);
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const framesDir = path.join(OUT_DIR, `${id}-${shot.name}`);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir);
  const cursor = [];
  const clicks = new Set(shot.clicks || []);
  const t0 = Date.now();
  for (let f = 0; f < shot.frames; f++) {
    const [y] = track(shot.scroll, f);
    const [mx, my] = track(shot.mouse, f);
    await page.evaluate((yy) => window.scrollTo(0, yy), Math.round(y));
    await page.mouse.move(mx, my);
    if (clicks.has(f)) {
      // A real click: the page may navigate or open something; give it a beat.
      await page.mouse.click(mx, my);
      await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(300);
      await dismissBanners(page, hide);
    }
    await page.waitForTimeout(25);
    await page.screenshot({
      path: path.join(framesDir, `f${String(f).padStart(4, "0")}.jpg`),
      type: "jpeg",
      quality: 90,
    });
    cursor.push([Math.round(mx), Math.round(my)]);
    if (f % 30 === 0) console.log(`[${shot.name}] frame ${f}/${shot.frames}`);
  }
  console.log(`[${shot.name}] ${shot.frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  await ctx.close();

  const written = fs.readdirSync(framesDir).filter((n) => n.endsWith(".jpg")).length;
  if (written !== shot.frames) throw new Error(`[${shot.name}] expected ${shot.frames} frames, found ${written}`);
  fs.writeFileSync(
    path.join(OUT_DIR, `${id}-${shot.name}.json`),
    JSON.stringify({ id, shot: shot.name, url: shot.url, fps: FPS, frames: shot.frames, viewport: spec.viewport, dsf: spec.dsf, cursor }),
  );
  const mb = (fs.readdirSync(framesDir).reduce((a, n) => a + fs.statSync(path.join(framesDir, n)).size, 0) / 1048576).toFixed(1);
  console.log(`[${shot.name}] -> ${path.relative(process.cwd(), framesDir)}/ (${mb} MB of frames)`);
}

(async () => {
  const [id, ...only] = process.argv.slice(2);
  if (!id) {
    console.error("usage: node tools/record-ui.cjs <feature id> [shot ...]");
    process.exit(2);
  }
  const spec = loadSpec(id);
  const browser = await chromium.launch({
    executablePath: process.env.CHROME || undefined,
    args: ["--hide-scrollbars", "--disable-gpu"],
  });
  try {
    for (const shot of spec.shots) {
      if (only.length && !only.includes(shot.name)) continue;
      await recordShot(browser, spec, shot, id);
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error("record-ui failed:", e.message || e);
  process.exit(1);
});
