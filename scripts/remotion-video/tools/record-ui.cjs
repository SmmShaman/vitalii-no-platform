#!/usr/bin/env node
/**
 * record-ui.cjs — deterministic, frame-exact capture of a LIVE web page for a
 * feature clip (pilot 2026-09-06, feature p61).
 *
 * Why not Playwright's recordVideo: its webm timeline stretches ~1.1x against
 * wall-clock (measured on the Elvarika demo), so narration placed by time
 * walks off the picture. Here every clip frame is one screenshot taken at a
 * scroll position and mouse position computed FROM THE FRAME NUMBER, so the
 * result is as deterministic as a Remotion render and lands exactly inside
 * the voice-synced beat windows.
 *
 * Output per shot:  public/rec/<id>-<shot>/fNNNN.jpg  (one JPEG per frame, 30 fps)
 *                   public/rec/<id>-<shot>.json      (viewport, dsf, per-frame cursor)
 * Then encode + publish with tools/encode-rec.sh on a host that has ffmpeg.
 *
 * Usage:  PW_PATH=<path to a playwright package> node tools/record-ui.cjs p61 [shot ...]
 *         CHROME=<executable> to override the browser build.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const { chromium } = require(process.env.PW_PATH || "playwright");

const FPS = 30;
const OUT_DIR = path.resolve(__dirname, "..", "public", "rec");

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.max(0, Math.min(1, t));

/** A shot: one page, N frames, scroll/mouse as functions of frame. */
const SHOTS = {
  p61: {
    viewport: { width: 1120, height: 466 },
    dsf: 1.25,
    shots: [
      {
        name: "hub",
        url: "https://vitalii.no/features",
        frames: 150,
        // Beat 1: the wall of features. Slow drift down the grid, cursor
        // wandering across cards like someone looking for one.
        scrollY: (f, n) => Math.round(lerp(0, 2200, easeInOut(f / (n - 1)))),
        mouse: (f, n) => {
          const t = f / (n - 1);
          return { x: Math.round(lerp(220, 900, t) + 120 * Math.sin(t * 9)), y: Math.round(180 + 120 * Math.sin(t * 5.2)) };
        },
      },
      {
        name: "commits",
        url: "https://github.com/SmmShaman/vitalii-no-platform/commits/main",
        frames: 171,
        // Beat 2: digging through the commit history by hand.
        scrollY: (f, n) => Math.round(lerp(0, 2600, easeInOut(f / (n - 1)))),
        mouse: (f, n) => ({ x: 420, y: Math.round(150 + 200 * clamp01(Math.sin((f / n) * 6) * 0.5 + 0.5)) }),
      },
      {
        name: "actions",
        url: "https://github.com/SmmShaman/vitalii-no-platform/actions/workflows/discover-features.yml",
        frames: 100,
        // Beat 4: the Action that does the digging now. Gentle settle.
        scrollY: (f, n) => Math.round(lerp(0, 260, easeOut(f / (n - 1)))),
        mouse: (f, n) => ({ x: Math.round(lerp(300, 520, easeOut(f / (n - 1)))), y: 250 }),
      },
      {
        name: "page",
        url: "https://vitalii.no/features/feature-traceability-every-feature-every-commit-instantly-linked-p61",
        frames: 220,
        // Beat 5: the feature's own page, drifting down to the result.
        scrollY: (f, n) => Math.round(lerp(0, 760, easeInOut(f / (n - 1)))),
        mouse: (f, n) => ({ x: 560, y: Math.round(lerp(220, 300, f / (n - 1))) }),
      },
    ],
  },
};

async function dismissBanners(page) {
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
  // Belt and braces: anything still fixed at the bottom-right that looks like a consent box.
  await page.addStyleTag({
    content: `[class*="cookie" i], [id*="cookie" i], [aria-label*="cookie" i] { display: none !important; }`,
  });
}

async function recordShot(browser, cfg, shot, id) {
  const ctx = await browser.newContext({
    viewport: cfg.viewport,
    deviceScaleFactor: cfg.dsf,
    locale: "en-US",
    colorScheme: "light",
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  });
  const page = await ctx.newPage();
  console.log(`[${shot.name}] goto ${shot.url}`);
  await page.goto(shot.url, { waitUntil: "networkidle", timeout: 90000 }).catch(async (e) => {
    console.log(`[${shot.name}] networkidle timed out (${e.message.split("\n")[0]}) — continuing with what loaded`);
  });
  await page.waitForTimeout(800);
  await dismissBanners(page);
  // Warm the scroll range once so lazy content is in place before frame 0.
  const maxY = shot.scrollY(shot.frames - 1, shot.frames);
  await page.evaluate((y) => window.scrollTo(0, y), maxY);
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  // Frames live under public/rec/<id>-<shot>/ (git-ignored). Encoding is a
  // separate step (tools/encode-rec.sh) on a host with a full ffmpeg: the
  // Playwright ffmpeg build has libvpx only and cannot even decode JPEG.
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const framesDir = path.join(OUT_DIR, `${id}-${shot.name}`);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir);
  const cursor = [];
  const t0 = Date.now();
  for (let f = 0; f < shot.frames; f++) {
    const y = shot.scrollY(f, shot.frames);
    const m = shot.mouse(f, shot.frames);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.mouse.move(m.x, m.y);
    await page.waitForTimeout(25);
    await page.screenshot({
      path: path.join(framesDir, `f${String(f).padStart(4, "0")}.jpg`),
      type: "jpeg",
      quality: 90,
    });
    cursor.push([m.x, m.y]);
    if (f % 30 === 0) console.log(`[${shot.name}] frame ${f}/${shot.frames}`);
  }
  console.log(`[${shot.name}] ${shot.frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  await ctx.close();

  const written = fs.readdirSync(framesDir).filter((n) => n.endsWith(".jpg")).length;
  if (written !== shot.frames) throw new Error(`[${shot.name}] expected ${shot.frames} frames, found ${written}`);

  fs.writeFileSync(
    path.join(OUT_DIR, `${id}-${shot.name}.json`),
    JSON.stringify({ id, shot: shot.name, url: shot.url, fps: FPS, frames: shot.frames, viewport: cfg.viewport, dsf: cfg.dsf, cursor }),
  );
  const mb = (fs.readdirSync(framesDir).reduce((a, n) => a + fs.statSync(path.join(framesDir, n)).size, 0) / 1048576).toFixed(1);
  console.log(`[${shot.name}] -> ${path.relative(process.cwd(), framesDir)}/ (${mb} MB of frames)`);
}

(async () => {
  const [id, ...only] = process.argv.slice(2);
  const cfg = SHOTS[id];
  if (!cfg) {
    console.error(`no shot table for "${id}" — known: ${Object.keys(SHOTS).join(", ")}`);
    process.exit(2);
  }
  const browser = await chromium.launch({
    executablePath: process.env.CHROME || undefined,
    args: ["--hide-scrollbars", "--disable-gpu"],
  });
  try {
    for (const shot of cfg.shots) {
      if (only.length && !only.includes(shot.name)) continue;
      await recordShot(browser, cfg, shot, id);
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error("record-ui failed:", e);
  process.exit(1);
});
