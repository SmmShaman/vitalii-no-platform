// FeatureSandboxWhereNothingCountsB43 — feature b43 — 1280x720, 931 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
// RE-SHOOT 2026-11-08 — narration and windows unchanged; this is the picture's second rewrite.
// The 2026-11-07 cut scored clarity 6/10 (wave D). Fixes applied:
//  1. b1 opened with quoteMarker, a forbidden recent opener (g22 opened the same way) —
//     swapped to titleTakeover.
//  2. b2 and b4 showed the features HUB scrolling past unrelated feature cards (a kiosk
//     calendar, a glucose chart, a one-button remote...) as "evidence" for claims about
//     testing a kid's tasks — nothing to do with the sentence. Replaced with the feature's
//     own page: shallow scroll for b2 (still problem-framed), a deep scroll for b4 (the
//     paragraph that actually describes the sandbox fix).
//  3. b1 and b3 previously shared one "page" shot whose own scroll curve independently
//     drifted into the solution paragraph mid-beat while the caption still narrated the
//     problem. Now b1/b2/b3 each get their own shot capped at a shallow scroll band
//     (0-640px) so the solution paragraph is visible ONLY at b4.
//  4. b5's result card held static for ~160 frames once its log lines finished — added a
//     1 -> 0 tick mid-beat and a continuing pulse on the hero number through the final frame.
//
// Voice-synced beat table (narration windows, do not shift):
//  b1  15-166  "Testing a task set meant running it for real — burning a kid's one real attempt."
//  b2 175-312  "There was no way to check a fix without risking a child's actual progress."
//  b3 321-494  "Parents also found the read-aloud voice too fast, with no way to test a new speed first."
//  b4 503-681  "Now a sandbox replays any child's tasks in Supabase without writing a single real row."
//  b5 690-886  "And a slider lets a parent test the voice — half speed up to one-point-three times — before it saves." — holds to 931.
//
// Beat -> effect (data only from the feature row; plan: shots/b43.motion.json):
//  b1 titleTakeover over the feature's own page (backdrop "page1").
//  b2 cornerTags over the feature's own page, shallow scroll (backdrop "page2").
//  b3 keywordCaption over the feature's own page, shallow scroll (backdrop "page3").
//  b4 handoffExplain over the feature's own page, deep scroll — the real fix paragraph
//     (backdrop "page4").
//  b5 drawn: the timeline archetype's final node lights up + a LogWindow result panel built
//     from the feature's own numbers (0 real rows touched, 0.5x-1.3x speed tested before
//     saving). Never the feature page or the hub (gate 2).
//
// Persistent element: a horizontal timeline ribbon (archetype 1) — a product plate
// ("BOYTASKS") at the left, five numbered icon-nodes lighting up left to right on a track
// that fills with accent colour as each beat is spoken (REAL RUN / NO SAFE TEST / TOO FAST /
// SANDBOX / SPEED SLIDER). Single tech name in the whole clip: Supabase, glossed in b4.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
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

const ACCENT = "#E0943D";
const STAGE = "#1F160D";

const LT = { x: 40, y: 606, w: 1200, h: 92 };
const SRC = { x: LT.x + 10, y: LT.y + 13, w: 150, h: 66 };
const TRACK_Y = LT.y + 46;
const NODE_Y = LT.y + 10;
const NODE_D = 72;
const NODE_GAP = 20;
const NODE_X0 = SRC.x + SRC.w + 44;

const NODES = [
  { label: "REAL RUN", icon: "\u{1F501}", tone: "danger" as const, at: B1 + 10 },
  { label: "NO SAFE TEST", icon: "\u{1F6D1}", tone: "danger" as const, at: B2 + 10 },
  { label: "TOO FAST", icon: "\u{23E9}", tone: "danger" as const, at: B3 + 10 },
  { label: "SANDBOX", icon: "\u{1F9EA}", tone: "success" as const, at: B4 + 10 },
  { label: "SPEED SLIDER", icon: "\u{1F39A}", tone: "success" as const, at: B5 + 10 },
];

const nodeX = (i: number) => NODE_X0 + i * (NODE_D + 70 + NODE_GAP);

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const lastX = nodeX(NODES.length - 1) + NODE_D;
  const crawl = tween(sec(frame, B1 + 20, fps), 0, (B5 + 10 - (B1 + 20)) / fps, ease.linear);
  const fillX = mix(crawl, NODE_X0, lastX);

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
            padding: "0 10px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1, color: P.ink, textAlign: "center", lineHeight: 1.3 }}>
            BOYTASKS
            <br />
            <span style={{ fontSize: 10, fontWeight: 600, color: P.muted, letterSpacing: 0.5 }}>screen time, gated by real tasks</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: NODE_X0, top: TRACK_Y - 1, width: lastX - NODE_X0, height: 3, background: P.border }} />
        <div style={{ position: "absolute", left: NODE_X0, top: TRACK_Y - 1, width: Math.max(0, fillX - NODE_X0), height: 3, background: ACCENT }} />
      </Arrive>

      {NODES.map((n, i) => {
        const x = nodeX(i);
        const lit = frame >= n.at;
        const color = n.tone === "danger" ? P.danger : P.success;
        return (
          <Arrive key={n.label} at={B1 + 24 + i * 6} kind="rise" box={{ x, y: NODE_Y, w: NODE_D + 70, h: NODE_D + 20 }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: NODE_Y,
                width: NODE_D,
                height: NODE_D,
                borderRadius: NODE_D / 2,
                background: lit ? color : P.card,
                border: lit ? `2px solid ${color}` : `2px dashed ${P.muted}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                boxSizing: "border-box",
                transform: `scale(${lit ? punchScale(sec(frame, n.at, fps), 0) : 1})`,
              }}
            >
              {n.icon}
            </div>
            <div
              style={{
                position: "absolute",
                left: x - 15,
                top: NODE_Y + NODE_D + 2,
                width: NODE_D + 30,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.6,
                color: lit ? color : P.muted,
              }}
            >
              {n.label}
            </div>
          </Arrive>
        );
      })}
    </div>
  );
};

const RESULT_LOG = [
  { t: "before", text: "real attempts burned per test: 1", tone: "danger" as const },
  { t: "now", text: "real attempts burned per test: 0", tone: "success" as const },
  { t: "today", text: "sandbox replay added: zero real rows written", tone: "success" as const },
  { t: "today", text: "speed slider added: 0.5x - 1.3x range", tone: "accent" as const },
  { t: "check", text: "parent can preview a speed before saving", tone: "success" as const },
];

const ResultBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;
  const t = tween(sec(frame, B5 + 4, fps), 0, 0.4, ease.power3Out);
  // the hero number ticks 1 -> 0 partway through the beat, instead of landing on 0 and freezing.
  const tickAt = B5 + 36;
  const ticked = frame >= tickAt;
  const tickPunch = ticked ? punchScale(sec(frame, tickAt, fps), 0) : 1;
  // a slow continuing pulse on the number's glow keeps the result from reading as a frozen screen.
  const pulse = 0.5 + 0.5 * Math.sin(frame / 11);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 150,
          width: 520,
          padding: "26px 30px",
          borderRadius: 10,
          border: `2px solid ${P.success}`,
          background: "rgba(0,0,0,0.6)",
          boxSizing: "border-box",
          fontFamily,
          opacity: t,
          boxShadow: ticked ? `0 0 ${18 + pulse * 14}px rgba(21,127,59,${0.25 + pulse * 0.2})` : undefined,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.4, color: P.muted }}>
          KID TASK SANDBOX — RESULT
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 16 }}>
          <span
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: ticked ? P.success : P.danger,
              lineHeight: 1,
              display: "inline-block",
              transform: `scale(${tickPunch})`,
            }}
          >
            {ticked ? "0" : "1"}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>real rows written</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 18, fontWeight: 700, color: ACCENT }}>
          per test — down from 1 every time
        </div>
      </div>
      <LogWindow
        win={{ x: 630, y: 110, w: 610, h: 480 }}
        title="boytasks sandbox"
        from={B5 + 10}
        every={22}
        opacity={cut(frame, B5, END)}
        fontSize={21}
        lines={RESULT_LOG}
      />
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page, shallow scroll */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page1" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.8}
        data={{ title: "One real attempt. Burned.", kicker: "Testing a kid's tasks meant running them for real" }}
      />

      {/* b2 — the cost of no safe test, still over the problem paragraph (shallow scroll) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.8}
        data={{
          statement: "No way to test a fix safely",
          tags: ["Burns a real attempt", "Writes to real data", "Risks child progress", "No safe test"],
        }}
      />

      {/* b3 — the voice-speed problem, still shallow — the fix paragraph stays hidden until b4 */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.8}
        data={{ line1: "The voice was too fast,", line2: "with no speed test first.", keywords: ["too fast", "speed test"] }}
      />

      {/* b4 — the fix, over the deep-scrolled paragraph that actually describes the sandbox */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page4" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        data={{
          from: "Real run, real risk",
          to: "Sandbox replay, zero risk",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["No real rows written", "No gates fire", "Supabase — the kids' task database"],
        }}
      />

      {/* b5 — the result, drawn: never the feature page or the hub (gate 2) */}
      <ResultBeat />

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureSandboxWhereNothingCountsB43: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
