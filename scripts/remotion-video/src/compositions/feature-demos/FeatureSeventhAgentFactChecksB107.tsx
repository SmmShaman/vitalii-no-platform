// FeatureSeventhAgentFactChecksB107 — feature b107 — 1280x720, 852 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A camera-viewfinder bracket (four corner marks) survives every beat, continuously
// converging from a wide rectangle around the whole features hub (b1) down to a tight
// rectangle around the final drawn result (b5) — the frame narrows beat by beat, never
// resetting and never fading. Beat 1 plays the real hub recording wide; beat 4 plays the
// feature's own page recording, framed tighter and zoomed further in, the one element
// the bracket has been converging on. The metaphor beat (b3) and the invisible-pipeline
// beat (b2) stay drawn, per STEP 0c.
//
// Beat -> effect -> backdrop:
//   b1  (15-195)   titleTakeover    + LiveWindow "hub"  (vitalii.no/features, wide)
//   b2  (195-378)  funnelAbsorption (no backdrop — invisible pipeline stage)
//   b3  (378-504)  statusFocus      (no backdrop — metaphor beat, stays drawn)
//   b4  (504-657)  handoffExplain   + LiveWindow "page" (this feature's own page, zoomed in)
//                  + LogWindow (gate_review log, real numbers from the feature)
//   b5  (657-852)  pipelineFlow     (holds to 852, drawn result — no page, no hub)
//
// Persistent element: the viewfinder bracket (archetype 2), b1 through the end.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, cut } from "./motion-primitives";
import { LiveWindow, LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b107.json";

const B1 = 15;
const B2 = 195;
const B3 = 378;
const B4 = 504;
const B5 = 657;
const END = 852;

const ACCENT = "#5B8FFF";
const STAGE = "#0A1322";

const LOG_WIN = { x: 150, y: 460, w: 980, h: 220 };

const REVIEW_LOG: LogLine[] = [
  { t: "review", text: "gate_review started — same beats re-entered", tone: "muted" },
  { t: "review", text: "3rd AI pass this stage — reviewer, not writer", tone: "accent" },
  { t: "review", text: "reviewer touches spoken lines only", tone: "muted" },
  { t: "review", text: "corrections written to review_notes.json", tone: "success" },
  { t: "review", text: "no beat added, no beat removed", tone: "muted" },
  { t: "director", text: "review_notes.json read before planning", tone: "accent" },
  { t: "director", text: "7th agent: script is now fact-checked", tone: "success" },
];

// -- Product plate: names the product, beat 1 only. --
const ProductPlate: React.FC = () => {
  const palette = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 48,
        width: 760,
        padding: "14px 18px",
        background: "rgba(10,19,34,0.72)",
        border: `1px solid ${palette.accentEdge}`,
        borderRadius: 6,
        fontFamily,
      }}
    >
      <div style={{ color: ACCENT, fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>
        Boytasks
      </div>
      <div style={{ color: "rgba(245,245,242,0.78)", fontSize: 14, lineHeight: 1.35, marginTop: 4 }}>
        A screen-time and task system for my three kids: YouTube access is gated by finishing the
        school and chore tasks in the app first, run on Cloudflare Workers.
      </div>
    </div>
  );
};

// -- Viewfinder: archetype 2 zoom-in. Four corner brackets around a rectangle that
// continuously converges across the whole clip, never resetting beat to beat. --
type Checkpoint = { f: number; x: number; y: number; w: number; h: number };

const CHECKPOINTS: Checkpoint[] = [
  { f: 0, x: 60, y: 50, w: 1160, h: 600 },
  { f: B2, x: 140, y: 70, w: 1000, h: 540 },
  { f: B3, x: 240, y: 90, w: 800, h: 460 },
  { f: B4, x: 260, y: 40, w: 760, h: 420 },
  { f: B5, x: 420, y: 140, w: 440, h: 320 },
];

function rectAt(frame: number) {
  for (let i = 0; i < CHECKPOINTS.length - 1; i++) {
    const a = CHECKPOINTS[i];
    const b = CHECKPOINTS[i + 1];
    if (frame < b.f) {
      const p = tween(frame, a.f, b.f - a.f, ease.power2Out);
      return { x: mix(p, a.x, b.x), y: mix(p, a.y, b.y), w: mix(p, a.w, b.w), h: mix(p, a.h, b.h) };
    }
  }
  const last = CHECKPOINTS[CHECKPOINTS.length - 1];
  return { x: last.x, y: last.y, w: last.w, h: last.h };
}

const ARM = 42;
const THICK = 4;

const Corner: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <div style={{ position: "absolute", left: x, top: y, width: ARM, height: ARM, transform: `rotate(${rot}deg)` }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: ARM, height: THICK, background: ACCENT }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: THICK, height: ARM, background: ACCENT }} />
  </div>
);

const Viewfinder: React.FC = () => {
  const frame = useCurrentFrame();
  const r = rectAt(frame);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Corner x={r.x} y={r.y} rot={0} />
      <Corner x={r.x + r.w - ARM} y={r.y} rot={90} />
      <Corner x={r.x + r.w - ARM} y={r.y + r.h - ARM} rot={180} />
      <Corner x={r.x} y={r.y + r.h - ARM} rot={270} />
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {cut(frame, B1, B2) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="hub"
          title="vitalii.no/features"
          from={B1}
          hold={B2 - B1}
          zoom={(t) => 1 + 0.12 * t}
          focus={{ x: 0.5, y: 0.42 }}
          opacity={1}
          win={{ x: 60, y: 60, w: 1160, h: 580 }}
        />
      )}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "A fact slipped through", kicker: "Two AI passes missed it" }}
      />
      {cut(frame, B1, B2) === 1 && <ProductPlate />}

      <MotionInsert
        effect="funnelAbsorption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["Scriptwriter pass", "Literary editor pass", "Render"],
          result: "Wrong fact reached the screen",
        }}
      />

      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Old order",
          claims: [
            { text: "Paper printed first", verdict: "yes" },
            { text: "Fact-checker read it after", verdict: "no" },
          ],
        }}
      />

      {cut(frame, B4, B5) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="this feature's page"
          from={B4}
          hold={B5 - B4}
          zoom={(t) => 1 + 0.18 * t}
          focus={{ x: 0.55, y: 0.35 }}
          opacity={1}
          win={{ x: 260, y: 50, w: 760, h: 380 }}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Director planned blind",
          to: "Reads review notes first",
          points: ["Reviewer touches only the spoken lines", "Can't add or remove a beat"],
        }}
      />
      {cut(frame, B4, B5) === 1 && (
        <LogWindow
          lines={REVIEW_LOG}
          title="gate_review"
          from={B4 + 14}
          every={14}
          opacity={0.92}
          win={LOG_WIN}
          fontSize={20}
        />
      )}

      <MotionInsert
        effect="pipelineFlow"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.7}
        data={{
          system: "Fact-check stage",
          steps: ["Scriptwriter", "Literary editor", "Science reviewer (7th)", "Shots planned"],
          result: "Checked before a single shot is drawn",
        }}
      />

      <Viewfinder />
    </AbsoluteFill>
  );
};

export const FeatureSeventhAgentFactChecksB107: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
