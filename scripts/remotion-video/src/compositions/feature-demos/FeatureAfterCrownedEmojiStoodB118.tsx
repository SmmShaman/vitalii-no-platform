// FeatureAfterCrownedEmojiStoodB118 — feature b118 — 1280x720, 971 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood mint. Motion direction v2 (feature-motion skill, 2026-11-28).
//
// A route of 5 nodes travels the WHOLE frame bottom-left to top-right, a token
// riding to the active node; at b4 it branches into two sub-nodes (the two
// geometry moves) that both feed the result node. This persists across every
// beat — the archetype's own rule ("a token travels the route and branches"):
// b1  15-203  "a label stood in for a face"                  keywordCaption over the live page
// b2 203-355  "a formula, never a rectangle you watch build"  handoffExplain over the live page
// b3 355-543  "a history effect strings portraits chapter"    pipelineFlow, drawn (no commit URL verified)
// b4 543-751  "fills a rectangle, folds a triangle, half"      ratioBars, drawn
// b5 751-971  "7 rows of 4 squares land on 28 square meters"  drawn: LogWindow of real facts
//             + hand-drawn 7x4 = 28 m^2 result card.
// Gate 2: the last beat never shows the feature page or the hub — it is
// fully drawn, held at full brightness to the end.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive, cut } from "./motion-primitives";
import { LiveWindow, LogWindow, type LogLine } from "./live-primitives";
import shotsFile from "./shots/b118.json";

const B1 = 15;
const B2 = 203;
const B3 = 355;
const B4 = 543;
const B5 = 751;
const END = 971;

/** Mint's own accent (#0B7A5A) reads dark on the dark stage; a brighter twin. */
const ACCENT = "#34D399";
const STAGE = "#0C1A14";

type Node = { x: number; y: number; label: string };

const NODES: Node[] = [
  { x: 150, y: 610, label: "EMOJI LABEL" },
  { x: 430, y: 520, label: "FORMULA ONLY" },
  { x: 700, y: 400, label: "HISTORY FX" },
  { x: 960, y: 260, label: "GEOMETRY FX" },
  { x: 1150, y: 130, label: "28 m²" },
];

function activeIndex(frame: number): number {
  if (frame < B2) return 0;
  if (frame < B3) return 1;
  if (frame < B4) return 2;
  if (frame < B5) return 3;
  return 4;
}

const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const active = activeIndex(frame);
  const branching = frame >= B4 && frame < B5;
  const R = { x: 870, y: 150, label: "RECT" };
  const T = { x: 1060, y: 170, label: "TRI" };

  return (
    <>
      <svg
        width={1280}
        height={720}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {NODES.slice(0, NODES.length - 1).map((n, i) => {
          const next = NODES[i + 1];
          const traveled = i < active;
          return (
            <line
              key={`seg-${i}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke={traveled ? P.accent : P.border}
              strokeWidth={traveled ? 4 : 3}
              strokeDasharray={traveled ? undefined : "6 8"}
            />
          );
        })}
        {branching && (
          <>
            <line x1={NODES[3].x} y1={NODES[3].y} x2={R.x} y2={R.y} stroke={P.accent} strokeWidth={3} />
            <line x1={NODES[3].x} y1={NODES[3].y} x2={T.x} y2={T.y} stroke={P.accent} strokeWidth={3} />
            <line x1={R.x} y1={R.y} x2={NODES[4].x} y2={NODES[4].y} stroke={P.border} strokeWidth={3} strokeDasharray="6 8" />
            <line x1={T.x} y1={T.y} x2={NODES[4].x} y2={NODES[4].y} stroke={P.border} strokeWidth={3} strokeDasharray="6 8" />
          </>
        )}
      </svg>

      {NODES.map((n, i) => {
        const state = i < active ? "done" : i === active ? "active" : "future";
        const size = state === "active" ? 22 : 14;
        const fill = state === "future" ? P.card : P.accent;
        const border = state === "future" ? P.border : P.accent;
        return (
          <div key={`node-${i}`}>
            <div
              style={{
                position: "absolute",
                left: n.x - size / 2,
                top: n.y - size / 2,
                width: size,
                height: size,
                borderRadius: size / 2,
                background: fill,
                border: `3px solid ${border}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: n.x - 70,
                top: n.y + size / 2 + 8,
                width: 140,
                textAlign: "center",
                fontFamily,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                color: state === "future" ? P.muted : P.ink,
              }}
            >
              {n.label}
            </div>
          </div>
        );
      })}

      {branching &&
        [R, T].map((b, i) => (
          <div key={`branch-${i}`}>
            <div
              style={{
                position: "absolute",
                left: b.x - 9,
                top: b.y - 9,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: P.accent,
                border: `3px solid ${P.accent}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: b.x - 50,
                top: b.y - 36,
                width: 100,
                textAlign: "center",
                fontFamily,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1,
                color: P.ink,
              }}
            >
              {b.label}
            </div>
          </div>
        ))}
    </>
  );
};

const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B2) return null;
  const box = { x: 40, y: 40, w: 420, h: 74 };
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
          BOYTASKS
        </div>
        <div style={{ position: "absolute", left: 18, top: 34, fontSize: 15, fontWeight: 700, color: P.ink }}>
          screen-time + task system for the kids
        </div>
      </div>
    </Arrive>
  );
};

const JargonGloss: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B3 + 40 || frame >= B4) return null;
  const box = { x: 40, y: 40, w: 300, h: 44 };
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
        Remotion — code that renders video frames
      </div>
    </Arrive>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "01", text: "history effect: real portraits, chapter by chapter", tone: "accent" },
  { t: "02", text: "geometry effect: counted squares fill a rectangle", tone: "ink" },
  { t: "03", text: "triangle fold proves the half, on screen", tone: "muted" },
  { t: "04", text: "7 rows x 4 squares = 28 counted squares", tone: "success" },
  { t: "05", text: "built in Remotion, sofa-readable layout", tone: "muted" },
  { t: "06", text: "essence first: story and model, not a formula", tone: "ink" },
];

const ResultCard: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5 + 40) return null;
  const box = { x: 770, y: 150, w: 420, h: 420 };
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
          gap: 24,
          fontFamily,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: P.ink }}>7 rows x 4</div>
        <div style={{ width: 280, height: 2, background: P.border }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: P.accent }}>28 m²</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: P.muted, marginTop: 4 }}>counted, not formula</div>
        </div>
      </div>
    </Arrive>
  );
};

const STAGE_WIN = { x: 520, y: 110, w: 720, h: 500 };

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: a crowned emoji label stands in for a real face */}
      {cut(frame, B1, B2) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features"
          from={B1}
          hold={B2 - B1}
          opacity={1}
          win={STAGE_WIN}
        />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.55}
        data={{ line1: "A crowned emoji stood in", line2: "for a real king", keywords: ["emoji", "king"] }}
      />
      <ProductPlate />

      {/* b2 — the problem: area was just a formula, not a built shape */}
      {cut(frame, B2, B3) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features"
          from={B2}
          hold={B3 - B2}
          opacity={1}
          win={STAGE_WIN}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.55}
        data={{
          from: "Area was just a formula",
          to: "A rectangle you watch get built",
          points: ["Squares counted one by one", "Proof you can see"],
        }}
      />

      {/* b3 — the fix: history effect strings portraits chapter by chapter */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{ steps: ["Chapter 1", "Chapter 2", "Chapter 3"], result: "One continuous story", system: "History effect" }}
      />
      <JargonGloss />

      {/* b4 — the fix: geometry effect fills a rectangle, folds a triangle, proves half */}
      <MotionInsert
        effect="ratioBars"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{ a: { label: "Rectangle", value: 28 }, b: { label: "Triangle (half)", value: 14 }, unit: "m²" }}
      />

      {/* b5 — drawn result only: never the feature page or hub (gate 2) */}
      {frame >= B5 && (
        <LogWindow
          lines={LOG_LINES}
          title="lesson-video effects"
          from={B5 + 4}
          every={16}
          opacity={1}
          win={{ x: 60, y: 140, w: 660, h: 460 }}
        />
      )}
      <ResultCard />

      <FlowMap />
    </AbsoluteFill>
  );
};

export const FeatureAfterCrownedEmojiStoodB118: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
