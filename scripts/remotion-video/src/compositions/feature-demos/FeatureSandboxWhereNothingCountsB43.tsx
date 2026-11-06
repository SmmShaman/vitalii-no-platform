// FeatureSandboxWhereNothingCountsB43 — feature b43 — 1280x720, 931 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Voice-synced beat table (narration windows, do not shift):
//  b1  15-166  "Testing a task set meant running it for real — burning a kid's one real attempt."
//  b2 175-312  "There was no way to check a fix without risking a child's actual progress."
//  b3 321-494  "Parents also found the read-aloud voice too fast, with no way to test a new speed first."
//  b4 503-681  "Now a sandbox replays any child's tasks in Supabase without writing a single real row."
//  b5 690-886  "And a slider lets a parent test the voice — half speed up to one-point-three times — before it saves." — holds to 931.
//
// Beat -> effect (data only from the feature row; plan: shots/b43.motion.json):
//  b1 quoteMarker over the feature's own page (backdrop "page"). Fresh opener — recent
//     clips opened on copyCorrection (g05), titleTakeover (b44), cornerTags (g26).
//  b2 cornerTags over the features hub (backdrop "hub") — the problem + concrete facts.
//  b3 keywordCaption over the feature's own page (backdrop "page") — the voice-speed claim.
//  b4 handoffExplain over the features hub (backdrop "hub") — real run -> sandbox replay.
//  b5 drawn: the timeline archetype's final node lights up + a LogWindow result panel built
//     from the feature's own numbers (0 real rows touched, 0.5x-1.3x speed tested before
//     saving). Never the feature page or the hub (gate 2).
//
// Persistent element: a horizontal timeline ribbon (archetype 1) — a product plate
// ("BOYTASKS") at the left, five sequential stage nodes lighting up left to right as each
// beat is spoken (REAL RUN / NO SAFE TEST / TOO FAST / SANDBOX / SPEED SLIDER), with a
// playhead that crawls the whole ribbon from b1 to b5 and a result badge at the end.
// Single tech name in the whole clip: Supabase (b4 handoffExplain point only).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { Headline, fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b43.json";

const B1 = 15;
const B2 = 175;
const B3 = 321;
const B4 = 503;
const B5 = 690;
const END = 931;

const ACCENT = "#4FB4E8";
const STAGE = "#1B2129";

const LT = { x: 40, y: 600, w: 1200, h: 106 };
const SRC = { x: LT.x + 10, y: LT.y + 10, w: 150, h: 86 };
const TRACK_Y = LT.y + 53;
const NODE_Y = LT.y + 18;
const NODE_H = 70;
const NODE_W = 160;
const NODE_GAP = 14;
const NODE_X0 = SRC.x + SRC.w + 40;

const NODES = [
  { label: "REAL RUN", tone: "danger" as const, at: B1 + 10 },
  { label: "NO SAFE TEST", tone: "danger" as const, at: B2 + 10 },
  { label: "TOO FAST", tone: "danger" as const, at: B3 + 10 },
  { label: "SANDBOX", tone: "success" as const, at: B4 + 10 },
  { label: "SPEED SLIDER", tone: "success" as const, at: B5 + 10 },
];

const nodeX = (i: number) => NODE_X0 + i * (NODE_W + NODE_GAP);

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const lastX = nodeX(NODES.length - 1);
  const crawl = tween(sec(frame, B1 + 20, fps), 0, (B5 + 10 - (B1 + 20)) / fps, ease.linear);
  const playheadX = mix(crawl, NODE_X0 + 10, lastX + NODE_W - 10);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: SRC.x,
            top: SRC.y,
            width: SRC.w,
            height: SRC.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 12px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.2, color: P.ink, textAlign: "center", lineHeight: 1.3 }}>
            BOYTASKS
            <br />
            <span style={{ fontSize: 11, fontWeight: 600, color: P.muted, letterSpacing: 0.6 }}>screen time, gated by real tasks</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: NODE_X0, top: TRACK_Y - 1, width: lastX + NODE_W - NODE_X0, height: 2, background: P.border }} />
      </Arrive>

      {NODES.map((n, i) => {
        const x = nodeX(i);
        const lit = frame >= n.at;
        const color = n.tone === "danger" ? P.danger : P.success;
        return (
          <Arrive key={n.label} at={B1 + 24 + i * 6} kind="rise" box={{ x, y: NODE_Y, w: NODE_W, h: NODE_H }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: NODE_Y,
                width: NODE_W,
                height: NODE_H,
                borderRadius: 4,
                background: lit ? color : P.card,
                border: lit ? `2px solid ${color}` : `2px dashed ${P.muted}`,
                color: lit ? "#fff" : P.muted,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                boxSizing: "border-box",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 0.8,
                transform: `scale(${lit ? punchScale(sec(frame, n.at, fps), 0) : 1})`,
              }}
            >
              {n.label}
            </div>
          </Arrive>
        );
      })}

      {frame < B5 + 10 && (
        <div style={{ position: "absolute", left: playheadX - 9, top: TRACK_Y - 9, width: 18, height: 18, borderRadius: 9, background: P.accent }} />
      )}

      {frame >= B5 + 60 && (
        <div
          style={{
            position: "absolute",
            left: nodeX(NODES.length - 1) + NODE_W + 16,
            top: NODE_Y + 15,
            width: 90,
            height: 40,
            borderRadius: 4,
            background: P.ink,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 800,
            transform: `scale(${punchScale(sec(frame, B5 + 60, fps), 0)})`,
          }}
        >
          0 rows
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="quoteMarker"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{ quote: "One real attempt — testing a fix meant playing it for real.", highlight: "playing it for real" }}
      />

      {/* b2 — the cost of no safe test, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "No way to test a fix safely",
          tags: ["Burns a real attempt", "Writes to real data", "Risks child progress", "No safe test"],
        }}
      />

      {/* b3 — the voice-speed problem, over the feature's own page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.5 }} />}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "The voice was too fast,", line2: "with no way to test a new speed.", keywords: ["too fast", "test a new speed"] }}
      />

      {/* b4 — the fix, over the hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Real run, real risk",
          to: "Sandbox replay, zero risk",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["No real rows written", "No gates fire", "Supabase (database)"],
        }}
      />

      {/* b5 — the result, drawn: never the feature page or the hub (gate 2) */}
      {frame >= B5 && (
        <>
          <div style={{ position: "absolute", left: 40, top: 22, fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.muted, fontFamily }}>
            KID TASK SANDBOX
          </div>
          <div style={{ position: "absolute", left: 1100, top: 22, fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.muted, fontFamily }}>
            B43
          </div>
          <Headline y={64} text="Testing that costs nothing" accentText="zero real rows written" accentColor={P.success} fontSize={34} />
          <LogWindow
            win={{ x: 80, y: 150, w: 1120, h: 400 }}
            title="boytasks sandbox"
            from={B5 + 10}
            every={16}
            opacity={cut(frame, B5, END)}
            lines={[
              { t: "before", text: "real attempts burned per test: 1", tone: "danger" },
              { t: "now", text: "real attempts burned per test: 0", tone: "success" },
              { t: "today", text: "sandbox replay added: zero real rows written", tone: "success" },
              { t: "today", text: "speed slider added: 0.5x - 1.3x range", tone: "accent" },
              { t: "check", text: "parent can preview a speed before saving", tone: "success" },
            ]}
          />
        </>
      )}

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureSandboxWhereNothingCountsB43: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
