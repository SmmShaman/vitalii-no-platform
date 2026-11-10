// FeatureKioskScreenStopsGuessingB80 — feature b80 — 1280x720, 992 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood slate. Motion direction v2 (feature-motion skill, 2026-11-10).
//
// Beat → effect (data only from the feature row; no commit matches this story, so the
// mechanism is drawn from the feature's own words — lookup table, real titles, icons —
// never from the three "flyt" login commits):
// b1 15-270   "a bare calendar — vague labels, homework cut off, cancelled lessons as-is"
//             cornerTags: the one claim ringed by the three broken facts.
// b2 270-411  "nobody could tell at a glance which child had gym or swimming"
//             keywordCaption: the claim without numbers, no fix yet.
// b3 411-623  "a lookup table color-codes, hides cancelled lessons, gives real titles"
//             pipelineFlow: the lookup table's four steps landing on "labelled right".
// b4 623-763  "gym and swimming days get their own icon from the timetable"
//             handoffExplain: no icon (before) -> backpack icon (now).
// b5 763-992  "every pupil's whole week now rotates — no more guessing"
//             funnelAbsorption holding to the end; the four problems from b1 collapse
//             into the one result, over the route's own screen, never the feature page.
//
// Persistent element: the flow-map route (archetype 4) — raw schedule -> lookup table ->
// kiosk screen, a token travelling the line, recolouring from wrong (red) to right
// (teal) once it passes the lookup table. Effects keep the bottom clear (look.safeBottom)
// — that is where the route sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, CaptionBand } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b80.json";

const B1 = 15;
const B2 = 270;
const B3 = 411;
const B4 = 623;
const B5 = 763;
const END = 992;

/** Accent tuned for the dark stage (slate's #0E7490 reads flat on a plate). */
const ACCENT = "#5FD4EC";
const STAGE = "#0B1620";

// Lower third geometry (1280x720, below the effects' safe bottom at y~587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LABEL_X = LT.x + 22;
const ROUTE_Y = LT.y + 50;
const NODE_A_X = 300;
const NODE_B_X = 680;
const NODE_C_X = 1060;
const NODE_W = 150;

const AB_START = B3 + 20;
const AB_DUR = Math.max(1, B4 - B3 - 50);
const BC_START = B4 + 10;
const BC_DUR = Math.max(1, B5 - B4 - 40);
const PULSE_AT = B5 + 20;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

function labelFor(frame: number): [string, string] {
  if (frame < B2) return ["Vague labels,", "homework cut off"];
  if (frame < B3) return ["Nobody sees", "gym or swimming"];
  if (frame < B4) return ["Lookup table", "colors it right"];
  if (frame < B5) return ["Each child's", "own PE icon"];
  return ["Whole week,", "rotating now"];
}

const Node: React.FC<{ x: number; label: string; tone: "danger" | "success" | "muted" }> = ({ x, label, tone }) => {
  const P = usePalette();
  const bg = tone === "success" ? P.successBg : tone === "danger" ? P.dangerBg : P.chipBg;
  const edge = tone === "success" ? P.successEdge : tone === "danger" ? P.dangerEdge : P.border;
  const fg = tone === "success" ? P.success : tone === "danger" ? P.danger : P.muted;
  return (
    <div
      style={{
        position: "absolute",
        left: x - NODE_W / 2,
        top: ROUTE_Y - 17,
        width: NODE_W,
        height: 34,
        background: bg,
        border: `2px solid ${edge}`,
        borderRadius: 17,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: 1,
        color: fg,
      }}
    >
      {label}
    </div>
  );
};

const RouteMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const [line1, line2] = labelFor(frame);

  const bLit = frame >= B3;
  const abP = tween(sec(frame, AB_START, fps), 0, AB_DUR / fps, ease.power3Out);
  const bcP = tween(sec(frame, BC_START, fps), 0, BC_DUR / fps, ease.power3Out);
  const tokenX = frame < AB_START ? NODE_A_X : frame < BC_START ? mix(abP, NODE_A_X, NODE_B_X) : mix(bcP, NODE_B_X, NODE_C_X);
  const tokenLit = frame >= AB_START;
  const cLit = bcP >= 1;

  const pulse = frame >= PULSE_AT ? punchScale(sec(frame, PULSE_AT, fps), 0, 1, 1.1, 0.2, 0.25) : 1;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: LT.w,
            height: LT.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: LABEL_X, top: LT.y + 16, width: 220 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>THE ROUTE</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            {line1}
            <br />
            {line2}
          </div>
        </div>
        {/* route line */}
        <div style={{ position: "absolute", left: NODE_A_X, top: ROUTE_Y - 1, width: NODE_C_X - NODE_A_X, height: 2, background: P.border }} />
      </Arrive>

      <Node x={NODE_A_X} label="RAW SCHEDULE" tone="danger" />
      <Node x={NODE_B_X} label="LOOKUP TABLE" tone={bLit ? "success" : "muted"} />
      <Node x={NODE_C_X} label="KIOSK SCREEN" tone={cLit ? "success" : "danger"} />

      {frame >= B1 && (
        <div
          style={{
            position: "absolute",
            left: tokenX - 7,
            top: ROUTE_Y - 7,
            width: 14,
            height: 14,
            borderRadius: 7,
            background: tokenLit ? P.success : P.danger,
            border: `2px solid ${P.card}`,
            boxShadow: "0 0 0 2px rgba(0,0,0,0.25)",
            transform: cLit ? `scale(${pulse})` : undefined,
            transformOrigin: `${tokenX}px ${ROUTE_Y}px`,
          }}
        />
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A bare calendar, nothing useful",
          tags: ["Vague event labels", "Homework cut off", "Cancelled still shown", "Nobody notices"],
        }}
      />
      {frame >= B1 && frame < B2 && (
        <CaptionBand
          y={26}
          tone="accent"
          fontSize={17}
          text="🎒 Boytasks — YouTube unlocks only after school and chore tasks are done"
          opacity={tween(sec(frame, B1, 30), 0, 0.4, ease.power2Out)}
        />
      )}

      {/* b2 — the gap nobody could close, over the feature's own page further down */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "Nobody could tell,",
          line2: "gym day from swimming day.",
          keywords: ["gym", "swimming"],
        }}
      />

      {/* b3 — the fix: drawn, no commit matches this feature */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          steps: ["Reads the subject", "Colors by subject", "Hides cancelled lessons", "Shows the real title"],
          result: "Every event labelled right",
          system: "Lookup table",
        }}
      />

      {/* b4 — the PE icon, drawn */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          from: "No icon for PE days",
          to: "Backpack icon shown",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Pulled from each child's timetable", "Flags gym day", "Flags swimming day"],
        }}
      />

      {/* b5 — the result, holds to the end; the route itself shows it, never the page */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          inputs: ["Vague event labels", "Cut-off homework", "Stale cancelled lessons", "No PE icon"],
          result: "Whole week shown clearly",
        }}
      />

      <RouteMap />
    </AbsoluteFill>
  );
};

export const FeatureKioskScreenStopsGuessingB80: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
