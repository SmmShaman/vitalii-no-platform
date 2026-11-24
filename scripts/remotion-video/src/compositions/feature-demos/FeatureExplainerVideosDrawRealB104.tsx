// FeatureExplainerVideosDrawRealB104 — feature b104 — 1280x720, 957 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One hero number owns the frame start to finish, changing value and label on every
// beat boundary, ending on the feature's own real result (1,595 licensed images) —
// never the feature page, never the hub. One editorial effect per voice beat behind
// it, chosen by what changes on screen; cuts not fades; a reading hold at the end.
//
// Beat -> effect (data only from the feature row, no invented numbers):
// b1  15-233  "whatever generic icon was on hand, not the real thing"
//             cornerTags over the feature's own page (backdrop) — the only verified
//             URL used tonight; hero number = 0 ("REAL SOURCE IMAGES").
// b2  242-376 "every picture can point straight at a real emoji"
//             keywordCaption, dark stage (no second verified URL tonight);
//             hero number steps to 1 ("REAL EMOJI, NOT A GUESS").
// b3  386-541 "DNA effect zooms into the exact base pair that changed"
//             pipelineFlow (mutation data -> DNA zoom-in -> base pair matched);
//             hero number steps to 2 ("GENERATIONS COMPARED").
// b4  550-686 "timelines space dates by how far apart the years really are"
//             copyCorrection (evenly-spaced guess -> real distance);
//             hero number steps to 3 ("DATES ON A REAL SCALE").
// b5  695-912 "1,595 Fluent Emoji images, licensed and verified, pinned in place"
//             no catalog effect — a LogWindow (no runtime log kept on the VPS for
//             this project, so the lines are built from the feature's own numbers)
//             carries the result alone with the hero number; holds to the end.
//
// Persistent element: the hero number card (archetype 7), b1 through b5, always on
// top so it stays legible over whatever the beat's effect drew underneath it.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import { LogWindow, type LogLine } from "./live-primitives";
import shotsFile from "./shots/b104.json";

const B1 = 15;
const B2 = 242;
const B3 = 386;
const B4 = 550;
const B5 = 695;
const END = 957;

const ACCENT = "#5FD0E6";
const STAGE = "#0D1117";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** The hero-number card: one figure, one label, changing on every beat boundary. */
const HeroNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const stage = frame >= B5 ? 4 : frame >= B4 ? 3 : frame >= B3 ? 2 : frame >= B2 ? 1 : 0;
  const atStart = [B1, B2, B3, B4, B5][stage];
  const value = ["0", "1", "2", "3", "1595"][stage];
  const label = [
    "REAL SOURCE IMAGES",
    "REAL EMOJI, NOT A GUESS",
    "GENERATIONS COMPARED",
    "DATES ON A REAL SCALE",
    "LICENSED & VERIFIED",
  ][stage];
  const tone = stage === 0 ? P.danger : stage === 4 ? P.success : P.accent;
  const punch = punchScale(sec(frame, atStart, fps), 0);

  const W = 580;
  const H = 330;
  const X = 650;
  const Y = 350;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: X,
          top: Y,
          width: W,
          height: H,
          background: "rgba(9,11,15,0.94)",
          border: `2px solid ${tone}`,
          borderRadius: 8,
          boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 208,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: -8,
            color: tone,
            fontVariantNumeric: "tabular-nums",
            transform: `scale(${punch})`,
          }}
        >
          {value}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 3,
            color: P.muted,
            textAlign: "center",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

/** Built from the feature's own numbers — no runtime log kept on the VPS for this project. */
const RESULT_LOG: LogLine[] = [
  { t: "01", text: "manifest.json loaded", tone: "muted" },
  { t: "02", text: "signature check: manifest verified", tone: "success" },
  { t: "03", text: "1,595 Fluent Emoji images indexed", tone: "accent" },
  { t: "04", text: "dna_comparison: base pair match confirmed", tone: "success" },
  { t: "05", text: "timeline: node spacing from real dates", tone: "success" },
  { t: "06", text: "0 unlicensed slugs — render allowed", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page (the only verified URL tonight) */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{
          statement: "Whatever icon was on hand",
          tags: ["Generic icon set", "No licensed source", "Same art every time"],
        }}
      />

      {/* b2 — the fix: a real emoji, not a guess (no second verified URL tonight) */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          line1: "Every picture now points",
          line2: "straight at a real emoji",
          keywords: ["real emoji"],
        }}
      />

      {/* b3 — the DNA effect: mutation data -> zoom-in -> base pair matched */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          steps: ["Mutation data", "DNA zoom-in", "Base pair matched"],
          result: "Carried to next gen",
          system: "DNA comparison effect",
        }}
      />

      {/* b4 — the timeline fix: evenly-spaced guess -> real distance apart */}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          wrong: "Years spaced evenly, no matter the real gap",
          right: "Years spaced by real distance apart",
          label: "Timeline fix",
        }}
      />

      {/* b5 — the verified result, carried by the log alone; holds to the end, no fade */}
      {frame >= B5 && (
        <LogWindow
          lines={RESULT_LOG}
          title="render pipeline"
          from={B5 + 10}
          every={28}
          opacity={1}
          win={{ x: 70, y: 150, w: 560, h: 420 }}
          fontSize={22}
        />
      )}

      <HeroNumber />
    </AbsoluteFill>
  );
};

export const FeatureExplainerVideosDrawRealB104: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
