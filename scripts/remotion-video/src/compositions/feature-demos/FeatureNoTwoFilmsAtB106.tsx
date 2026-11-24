// FeatureNoTwoFilmsAtB106 — feature b106 — 1280x720, 870 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A horizontal timeline ribbon survives every beat: five nodes (one per beat) across
// the bottom third of the frame, a progress fill and a moving marker that advances
// continuously from the first node to the last, never resetting. Beat 1 plays the
// real hub recording wide; beat 4 plays the feature's own page, the strongest evidence
// available since none of the three recent commits name this fix. The kitchen metaphor
// (b3) and the invisible queueing bug (b2) stay drawn, per STEP 0c.
//
// Beat -> effect -> backdrop:
//   b1  (15-212)   titleTakeover    + LiveWindow "hub"  (vitalii.no/features, wide)
//   b2  (212-342)  funnelAbsorption (no backdrop — invisible silent queueing)
//   b3  (342-495)  statusFocus      (no backdrop — kitchen metaphor beat)
//   b4  (495-667)  handoffExplain   + LiveWindow "page" (this feature's own page, zoomed in)
//   b5  (667-870)  pipelineFlow     + LogWindow (guard log, real number: 409)
//                  (holds to 870, drawn result — no page, no hub)
//
// Persistent element: the timeline ribbon (archetype 1), b1 through the end.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, cut } from "./motion-primitives";
import { LiveWindow, LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b106.json";

const B1 = 15;
const B2 = 212;
const B3 = 342;
const B4 = 495;
const B5 = 667;
const END = 870;

const ACCENT = "#8B6BFF";
const STAGE = "#140F2E";

const LOG_WIN = { x: 150, y: 460, w: 980, h: 220 };

const GUARD_LOG: LogLine[] = [
  { t: "guard", text: "second request arrives mid-render", tone: "muted" },
  { t: "guard", text: "in-flight render found for this child", tone: "accent" },
  { t: "guard", text: "request rejected — 409", tone: "danger" },
  { t: "guard", text: "reply includes current stage", tone: "muted" },
  { t: "guard", text: "reply includes minutes left", tone: "muted" },
  { t: "guard", text: "no second render ever starts", tone: "success" },
  { t: "guard", text: "every entry point checks first", tone: "success" },
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
        background: "rgba(20,15,46,0.72)",
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

// -- Timeline ribbon: archetype 1. Five nodes along a horizontal bar, a progress
// fill and a marker that advance continuously across the whole clip, never resetting. --
type Node = { x: number; label: string };

const NODES: Node[] = [
  { x: 160, label: "Request A" },
  { x: 410, label: "Request B" },
  { x: 660, label: "No warning" },
  { x: 910, label: "In-flight check" },
  { x: 1120, label: "409 reply" },
];

const RIBBON_Y = 640;

type Checkpoint = { f: number; x: number };

const CHECKPOINTS: Checkpoint[] = [
  { f: 0, x: NODES[0].x },
  { f: B2, x: NODES[1].x },
  { f: B3, x: NODES[2].x },
  { f: B4, x: NODES[3].x },
  { f: B5, x: NODES[4].x },
];

function markerX(frame: number) {
  for (let i = 0; i < CHECKPOINTS.length - 1; i++) {
    const a = CHECKPOINTS[i];
    const b = CHECKPOINTS[i + 1];
    if (frame < b.f) {
      const p = tween(frame, a.f, b.f - a.f, ease.power2Out);
      return mix(p, a.x, b.x);
    }
  }
  return CHECKPOINTS[CHECKPOINTS.length - 1].x;
}

const TimelineRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const palette = usePalette();
  const x = markerX(frame);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: RIBBON_Y,
          width: 1080,
          height: 4,
          background: "rgba(245,245,242,0.18)",
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 100,
          top: RIBBON_Y,
          width: Math.max(0, x - 100),
          height: 4,
          background: ACCENT,
          borderRadius: 2,
        }}
      />
      {NODES.map((n, i) => {
        const passed = x >= n.x - 2;
        return (
          <div key={i} style={{ position: "absolute", left: n.x - 8, top: RIBBON_Y - 6, width: 16 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: passed ? ACCENT : "transparent",
                border: `2px solid ${passed ? ACCENT : "rgba(245,245,242,0.35)"}`,
                margin: "0 auto",
              }}
            />
            <div
              style={{
                marginTop: 8,
                fontFamily,
                fontSize: 13,
                fontWeight: 700,
                color: passed ? "rgba(245,245,242,0.92)" : "rgba(245,245,242,0.4)",
                textAlign: "center",
                whiteSpace: "nowrap",
                transform: "translateX(-50%)",
                left: "50%",
                position: "relative",
              }}
            >
              {n.label}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: x - 6,
          top: RIBBON_Y - 22,
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `10px solid ${ACCENT}`,
        }}
      />
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
          win={{ x: 60, y: 60, w: 1160, h: 540 }}
        />
      )}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Two requests, one queue", kicker: "Second film queued silently" }}
      />
      {cut(frame, B1, B2) === 1 && <ProductPlate />}

      <MotionInsert
        effect="funnelAbsorption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["Kid A's request", "Kid B's request"],
          result: "Second film queued, unseen",
        }}
      />

      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "No warning given",
          claims: [
            { text: "First order still cooking", verdict: "yes" },
            { text: "Kitchen warns the table", verdict: "no" },
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
          win={{ x: 260, y: 40, w: 760, h: 380 }}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Entry points raced blindly",
          to: "Checks render in flight",
          points: ["Checks in-flight state first", "Second request rejected early"],
        }}
      />

      {cut(frame, B5, END) === 1 && (
        <LogWindow
          lines={GUARD_LOG}
          title="request-guard"
          from={B5 + 14}
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
          system: "Request guard",
          steps: ["Second request arrives", "In-flight check runs", "Reply sent instantly"],
          result: "Stage, minutes left, 409",
        }}
      />

      <TimelineRibbon />
    </AbsoluteFill>
  );
};

export const FeatureNoTwoFilmsAtB106: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
