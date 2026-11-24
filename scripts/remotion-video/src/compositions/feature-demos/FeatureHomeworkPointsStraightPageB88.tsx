// FeatureHomeworkPointsStraightPageB88 — feature b88 — 1280x720, 1074 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Boytasks — a screen-time and task system for the owner's three kids (YouTube access
// gated by finishing school and chore tasks first, run on Cloudflare Workers). This
// clip is about ONE feature of it: homework used to show a bare page number with no
// link to a chapter. No GitHub commit URL is verified for b88 (only the feature's own
// page + the features hub), so b4/b5 are drawn only — no commit diff is shown; b5's
// LogWindow lines come only from the feature's own data (real textbook filename from
// commit 96e37c8, and the VO's literal quoted result).
//
// Beat -> picture (data only from the feature row, no invented numbers):
// b1 15-261    "my son's weekly homework just said 's. 83, 84 and 85'"
//              titleTakeover over the feature's own page (backdrop); kicker names
//              Boytasks. Flow-map strip appears: a lone "S. 83" node, rest dim.
// b2 270-445   "the app had no idea which chapter that was, couldn't teach toward class"
//              cornerTags: the claim + 3 facts, over the page scrolled further. Flow
//              node 2 flips to a red "NO MATCH" tag.
// b3 454-677   "a Cloudflare Workers script reads his real textbook's contents"
//              pipelineFlow over the features hub (backdrop) — three steps, naming
//              Cloudflare Workers once. Flow strip lights up: arrow + node 2 relabel.
// b4 686-838   "every homework card now names the actual chapter, not a bare number"
//              DRAWN (no backdrop — no verified commit URL): three homework cards
//              flip from a page number to a chapter name, check badges land.
// b5 847-1029  "tonight's card reads 'Kapittel 4: Brøk' — not 's. 83'"
//              DRAWN LogWindow, lines built only from the feature's own data (real
//              textbook file + the literal quoted result); holds to the end at full
//              brightness, no fade.
//
// Persistent element: the flow-map strip (archetype 4) lives at y>=606 — three nodes
// (PAGE NUMBER -> TEXTBOOK LOOKUP -> CHAPTER NAME) joined by connectors — and visibly
// changes at every beat boundary (b1 node1 appears, b2 node2 flips to NO MATCH, b3
// connector lights + node2 relabels, b4 node3 appears + connector completes, b5 all
// three relabel to the final, held result) while the upper 580px carries each beat's
// own effect or drawn result.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Headline, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b88.json";

const B1 = 15;
const B2 = 270;
const B3 = 454;
const B4 = 686;
const B5 = 847;
const END = 1074;

/** Warm accent against sand's own tone so it reads on the dark stage plate. */
const ACCENT = "#C2762E";
const STAGE = "#1C140C";

// Flow-map geometry (1280x720, below the effects' safe bottom at y~587).
const FY = 606;
const FH = 92;
const NODE_W = 300;
const GAP = 150;
const NODE_X = [40, 40 + NODE_W + GAP, 40 + (NODE_W + GAP) * 2];
const ARROW_X = [NODE_X[0] + NODE_W, NODE_X[1] + NODE_W];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const FlowStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const node2Live = frame >= B3;
  const node3Live = frame >= B4;
  const final = frame >= B5;

  const arrow1On = frame >= B3;
  const arrow2 = tween(sec(frame, B4, fps), 0, 0.5, ease.power3InOut);

  const node1Label = "S. 83";
  const node2Label = final ? "MATEMATIKK4A" : node2Live ? "CLOUDFLARE WORKERS" : frame >= B2 ? "NO MATCH" : "?";
  const node2Tone = final || node2Live ? P.success : frame >= B2 ? P.danger : P.muted;
  const node3Label = final ? "KAPITTEL 4: BRØK" : "CHAPTER NAME";
  const node3Tone = P.success;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={{ x: NODE_X[0], y: FY, w: NODE_W, h: FH }}>
        <div
          style={{
            position: "absolute",
            left: NODE_X[0],
            top: FY,
            width: NODE_W,
            height: FH,
            background: P.card,
            border: `2px solid ${P.dangerEdge}`,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 1.5,
            color: P.danger,
          }}
        >
          {node1Label}
        </div>
      </Arrive>

      <div
        style={{
          position: "absolute",
          left: ARROW_X[0],
          top: FY + FH / 2 - 4,
          width: GAP,
          height: 8,
          background: arrow1On ? P.success : P.dangerEdge,
          opacity: frame >= B1 + 20 ? 1 : 0,
        }}
      />

      <Arrive at={B1 + 22} kind="rise" box={{ x: NODE_X[1], y: FY, w: NODE_W, h: FH }}>
        <div
          style={{
            position: "absolute",
            left: NODE_X[1],
            top: FY,
            width: NODE_W,
            height: FH,
            background: node2Live ? P.successBg : frame >= B2 ? P.dangerBg : P.card,
            border: `2px solid ${node2Live ? P.successEdge : frame >= B2 ? P.dangerEdge : P.border}`,
            borderRadius: 4,
            opacity: frame < B2 ? 0.35 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1,
            color: node2Tone,
          }}
        >
          {node2Label}
        </div>
      </Arrive>

      <div
        style={{
          position: "absolute",
          left: ARROW_X[1],
          top: FY + FH / 2 - 4,
          width: mix(arrow2, 0, GAP),
          height: 8,
          background: final ? P.success : P.accent,
          opacity: frame >= B3 + 10 ? 1 : 0,
        }}
      />

      <Arrive at={B4 + 6} kind="punch" box={{ x: NODE_X[2], y: FY, w: NODE_W, h: FH }}>
        <div
          style={{
            position: "absolute",
            left: NODE_X[2],
            top: FY,
            width: NODE_W,
            height: FH,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: final ? 14 : 15,
            fontWeight: 800,
            letterSpacing: 1,
            color: node3Tone,
          }}
        >
          {node3Label}
        </div>
      </Arrive>
    </div>
  );
};

const CardFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const items = [
    { x: 120, emoji: "📐" },
    { x: 510, emoji: "🔤" },
    { x: 900, emoji: "📖" },
  ];
  return (
    <>
      <Headline y={56} text="Every card names the chapter" accentColor={P.success} fontSize={34} />
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <Arrive at={B4 + 4 + i * 10} kind="rise" box={{ x: it.x, y: 190, w: 260, h: 220 }}>
            <IconCard x={it.x} y={190} w={260} emoji={it.emoji} title="Homework card" sub="chapter, not page" tone="success" />
          </Arrive>
          {frame >= B4 + 24 + i * 10 && (
            <div
              style={{
                position: "absolute",
                left: it.x + 260 - 18,
                top: 190 - 14,
                width: 36,
                height: 36,
                borderRadius: 18,
                background: P.success,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 800,
                transform: `scale(${punchScale(sec(frame, B4 + 24 + i * 10, fps), 0)})`,
              }}
            >
              ✓
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const RESULT_LINES: LogLine[] = [
  { t: "19:40", text: "scan homework note: s. 83, 84, 85", tone: "muted" },
  { t: "19:40", text: "textbook: matematikk4a_cappelen.json", tone: "accent" },
  { t: "19:40", text: "load chapter titles + grammar focus", tone: "accent" },
  { t: "19:40", text: "match pages 83-85 -> chapter", tone: "accent" },
  { t: "19:40", text: "before: card read 's. 83'", tone: "danger" },
  { t: "19:40", text: "after: card reads 'Kapittel 4: Brøk'", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the bare page number, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Just a page number, no chapter", kicker: "Boytasks: homework note read 's. 83, 84, 85'" }}
      />

      {/* b2 — why that broke (problem_en) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "The app had no idea which chapter that was",
          tags: ["No page-to-chapter map", "Can't teach toward his class", "Just a bare number"],
        }}
      />

      {/* b3 — the fix, over the features hub */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Read his real textbook's contents", "Pull chapter titles and grammar focus", "Match page numbers to a chapter"],
          result: "Homework card names the real chapter",
          system: "Cloudflare Workers",
        }}
      />

      {/* b4 — drawn only: no verified commit URL, so no diff is shown */}
      {frame >= B4 && frame < B5 && <CardFlip />}

      {/* b5 — drawn LogWindow, holds to the end at full brightness */}
      {frame >= B5 && (
        <LogWindow
          lines={RESULT_LINES}
          title="homework worker log"
          from={B5 + 10}
          every={16}
          opacity={1}
          win={{ x: 160, y: 130, w: 960, h: 430 }}
        />
      )}

      <FlowStrip />
    </AbsoluteFill>
  );
};

export const FeatureHomeworkPointsStraightPageB88: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
