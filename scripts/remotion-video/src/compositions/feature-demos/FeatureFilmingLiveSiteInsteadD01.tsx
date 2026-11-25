// FeatureFilmingLiveSiteInsteadD01 — feature d01 — 1280x720, 914 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (facts only from the feature row — the pipeline runs with no VPS log,
// so the ledger/LogWindow text names real files/helpers: pilot/v06-live.mjs, CookieConsent,
// utils/cookieConsent.ts, window.__demo, output/feature-v06.mp4, the 0.67x retime factor —
// no number is invented):
// b1 15-219   "every demo clip I made before was filmed against a fake stand-in page --
//              it looked real, but proved nothing" — cornerTags over the real feature page
//              (backdrop "feature"). Ledger: product plate, first red line.
// b2 219-341  "the actual site could be broken, and the demo still played"
//              keywordCaption over a dark plate (no new page to film). Ledger: second red line.
// b3 341-517  "a Playwright script now drives a real browser at the live site and clicks
//              through the real feature" — handoffExplain over the real hub page
//              (backdrop "hub") — evidence the recorder hits production. Ledger: red total
//              struck through, green column starts.
// b4 517-676  "if it records, the feature actually works -- the clip doubles as a smoke test"
//              statusFocus over a dark plate (the verdict, not a new page). Ledger: second
//              green line.
// b5 676-914  "it's retimed to 0.67x afterward, just enough to make the real thing feel calm
//              on camera" — the verdict — LogWindow only — never the feature's own page or
//              the hub (gate 2). Ledger: third green line, holds to the end, no fade.
//
// Persistent element: the ledger band (archetype 5) in the bottom strip — a red column of
// costs grows through b1-b2, gets struck through at b3, and a green column of fixes grows
// underneath it through b3-b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/d01.json";

const B1 = 15;
const B2 = 219;
const B3 = 341;
const B4 = 517;
const B5 = 676;
const END = 914;

/** Accent tuned for the dark stage (slate's own #0E7490 reads flat on a dark plate). */
const ACCENT = "#5FE0E0";
const STAGE = "#0E1A22";

const RED_ROWS = ["✗ Fake harness page", "✗ Site breaks, demo still plays"];
const GREEN_ROWS = ["✓ Real Chromium @ live site", "✓ Clip doubles as smoke test", "✓ Retimed 0.67x for calm camera"];

const BAND_Y = 600;
const TAG_H = 20;
const RED_Y = BAND_Y + TAG_H + 8;
const GREEN_Y = RED_Y + 40;

const LedgerBand: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const redCount = frame >= B2 ? 2 : 1;
  const struck = frame >= B3;
  const greenCount = frame >= B5 ? 3 : frame >= B4 ? 2 : frame >= B3 ? 1 : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {frame < B2 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BAND_Y,
            width: 1280,
            height: TAG_H,
            background: "rgba(14,26,34,0.82)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1.6,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
          }}
        >
          PRODUCT: DEMO VIDEO PIPELINE — real React components run offline, Playwright
          records the tour, voice + ffmpeg finish it
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 16,
          top: RED_Y,
          fontSize: 16,
          fontWeight: 700,
          color: P.danger,
          textDecoration: struck ? "line-through" : "none",
          opacity: struck ? 0.55 : 1,
        }}
      >
        {RED_ROWS.slice(0, redCount).join("   ")}
      </div>

      {greenCount > 0 && (
        <div
          style={{
            position: "absolute",
            left: 16,
            top: GREEN_Y,
            fontSize: 16,
            fontWeight: 700,
            color: P.success,
          }}
        >
          {GREEN_ROWS.slice(0, greenCount).join("   ")}
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the old lie, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="feature" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A fake stand-in page proved nothing",
          tags: ["Synthetic harness", "Looked real", "Site could be broken", "No proof"],
        }}
      />

      {/* b2 — the risk, no new page to film */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "The site could be broken",
          line2: "and the demo still played",
          keywords: ["broken site", "fake demo"],
        }}
      />

      {/* b3 — the fix, over the real hub page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Fake harness page",
          to: "Real Chromium on live site",
          points: ["Opens the production URL", "Clears the cookie banner itself", "Drives the real DOM, not a copy"],
        }}
      />

      {/* b4 — the verdict, drawn (a recording that succeeds IS the proof) */}
      <MotionInsert
        effect="statusFocus"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "Smoke test verdict",
          claims: [
            { text: "Recording completes", verdict: "yes" },
            { text: "Feature works in production", verdict: "yes" },
          ],
        }}
      />

      {/* b5 — the finish, holds to the end. Never the feature page or the hub (gate 2). */}
      {frame >= B5 && (
        <LogWindow
          title="demo-recorder"
          from={B5}
          every={14}
          opacity={1}
          fontSize={20}
          win={{ x: 140, y: 40, w: 1000, h: 520 }}
          lines={[
            { text: "pilot/v06-live.mjs launches real Chromium", tone: "accent" },
            { text: "target: production URL, not a harness copy", tone: "muted" },
            { text: "CookieConsent cleared via utils/cookieConsent.ts", tone: "success" },
            { text: "window.__demo drives the real feature click-through", tone: "success" },
            { text: "recording completes -> output/feature-v06.mp4", tone: "success" },
            { text: "retime pass: 0.67x applied to the raw capture", tone: "accent" },
            { text: "a successful recording is the smoke test", tone: "accent" },
          ]}
        />
      )}

      <LedgerBand />
    </AbsoluteFill>
  );
};

export const FeatureFilmingLiveSiteInsteadD01: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
