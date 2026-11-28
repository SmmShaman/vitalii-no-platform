// FeatureKlientsMapUsedBeK07 — feature k07 — 1280x720, 913 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood dawn. Motion direction v2 (feature-motion skill, 2026-11-28).
//
// One live recording of the feature's own page ("page" in shots/k07.json), the
// camera pushing in beat by beat (push 0.02 → 0.07 → 0.11 → 0.15, focus walking
// down toward the card) so archetype 2 is the camera, not a fade:
// b1  15-223  "bouncing between a map popup and a tab"      titleTakeover
// b2 223-399  "one big card holds the whole picture"        copyCorrection
// b3 399-570  "J and K jump ... on the Leaflet map"          keywordCaption
// b4 570-740  "a background scan ... pulls in real photos"  handoffExplain
// b5 740-913  "one card, two keys, up to 16 photos"          drawn: LogWindow
//             of real facts (no runtime log exists for this project) + a
//             hand-drawn 2→1 screens / 16 photos-per-lead result card.
// Gate 2: the last beat never shows the feature page or the hub — it is
// fully drawn, held at full brightness to the end.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import shotsFile from "./shots/k07.json";

const B1 = 15;
const B2 = 223;
const B3 = 399;
const B4 = 570;
const B5 = 740;
const END = 913;

/** Dawn's own accent (#2563EB) reads flat on the dark stage; a brighter twin. */
const ACCENT = "#2E8BFF";
const STAGE = "#121833";

const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B2) return null;
  const box = { x: 40, y: 40, w: 340, h: 74 };
  return (
    <Arrive at={B1 + 4} kind="wipe" box={box} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          fontFamily,
        }}
      >
        <div style={{ position: "absolute", left: 18, top: 12, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: P.accent }}>
          KLIENT
        </div>
        <div style={{ position: "absolute", left: 18, top: 34, fontSize: 16, fontWeight: 700, color: P.ink }}>
          lead workspace
        </div>
      </div>
    </Arrive>
  );
};

const JargonGloss: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B3 + 40 || frame >= B4) return null;
  const box = { x: 1280 - 300, y: 40, w: 260, h: 44 };
  return (
    <Arrive at={B3 + 40} kind="rise" box={box}>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: P.accentBg,
          border: `2px solid ${P.accentEdge}`,
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 700,
          color: P.ink,
          fontFamily,
        }}
      >
        Leaflet — map library
      </div>
    </Arrive>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "01", text: "client tab replaces map popup + Analiz tab", tone: "accent" },
  { t: "02", text: "J / K jump to next / previous lead", tone: "ink" },
  { t: "03", text: "filters: kommune, status, category, saturation", tone: "muted" },
  { t: "04", text: "quick scan downloads up to 16 photos/lead", tone: "success" },
  { t: "05", text: "skips logos, tiny images, duplicates", tone: "muted" },
  { t: "06", text: "quota pause now blocks full analyses only", tone: "ink" },
  { t: "07", text: "scan jobs run with zero AI calls", tone: "success" },
];

const ResultCard: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5 + 40) return null;
  const box = { x: 800, y: 160, w: 380, h: 420 };
  return (
    <Arrive at={B5 + 40} kind="punch" box={box}>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          background: P.card,
          borderRadius: 8,
          boxShadow: "10px 10px 0 rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          fontFamily,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: P.ink }}>2 → 1</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: P.muted, marginTop: 4 }}>screens per lead</div>
        </div>
        <div style={{ width: 260, height: 2, background: P.border }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: P.accent }}>16</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: P.muted, marginTop: 4 }}>photos per lead</div>
        </div>
      </div>
    </Arrive>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: popup + tab, wide view of the whole interface */}
      {cut(frame, B1, B2) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.02} focus={{ x: 0.5, y: 0.28 }} />
      )}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Map Popup + Tab", kicker: "The Old Way" }}
      />
      <ProductPlate />

      {/* b2 — the fix: one Client tab, camera pushes a little closer */}
      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} push={0.07} focus={{ x: 0.5, y: 0.34 }} />
      )}
      <MotionInsert
        effect="copyCorrection"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ wrong: "Split: popup + Analiz tab", right: "One Client tab", label: "Now" }}
      />

      {/* b3 — J/K navigation, closer still toward the card */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} push={0.11} focus={{ x: 0.5, y: 0.42 }} />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "J and K jump between leads", line2: "right on the Leaflet map", keywords: ["J", "K"] }}
      />
      <JargonGloss />

      {/* b4 — the scan no longer blocked by the quota pause, tightest zoom */}
      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B4} hold={B5 - B4} push={0.15} focus={{ x: 0.56, y: 0.48 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Quota pause blocks jobs",
          to: "Scans need no AI call",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Full analyses still pause", "Photo scans run free"],
        }}
      />

      {/* b5 — drawn result only: never the feature page or hub (gate 2) */}
      {frame >= B5 && (
        <LogWindow
          lines={LOG_LINES}
          title="klient scan log"
          from={B5 + 4}
          every={16}
          opacity={1}
          win={{ x: 60, y: 140, w: 680, h: 500 }}
        />
      )}
      <ResultCard />
    </AbsoluteFill>
  );
};

export const FeatureKlientsMapUsedBeK07: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
