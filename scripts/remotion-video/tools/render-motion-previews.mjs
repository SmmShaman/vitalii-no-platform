// Renders stills of every digest-motion effect (3 frames x 3 s/5 s blocks) in ONE browser.
// Usage: node tools/render-motion-previews.mjs [outDir] [effect1,effect2]
// Needs public/_prev_photo.jpg (any JPG; not committed) and a local Chrome.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = process.argv[2] || path.join(root, "out/motion-previews");
const only = process.argv[3] ? process.argv[3].split(",") : null;
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/MotionPreviewEntry.tsx"), publicDir: path.join(root, "public") });
const browser = await openBrowser("chrome", { browserExecutable: "/usr/bin/google-chrome", timeoutInMilliseconds: 120000 });
const effects = JSON.parse(fs.readFileSync(path.join(root, "../video-processor/skills/digest-motion/effects.json"))).effects.filter(e => e.motion).map(e => e.name);
for (const eff of effects) {
  if (only && !only.includes(eff)) continue;
  for (const d of [90, 150]) {
    const id = `mp-${eff}-${d}`;
    const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser, timeoutInMilliseconds: 120000 });
    for (const f of [Math.round(d * 0.25), Math.round(d * 0.55), d - 1]) {
      try {
        await renderStill({ composition, serveUrl, output: `${out}/${eff}-${d}-${String(f).padStart(3, "0")}.png`, frame: f, puppeteerInstance: browser, scale: 0.5, timeoutInMilliseconds: 120000 });
      } catch (e) { console.log(`FAIL ${id} f${f}: ${e.message.split("\n")[0]}`); }
    }
  }
  console.log(`done ${eff}`);
}
await browser.close({ silent: true });
