// FeatureEnding6971LoopB37 — feature b37 — 1280x720, 1043 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat -> effect (no commit list supplied this run; the feature's own page is the
// only verified evidence, used once in b1, never again per gate 2):
// b1 15-244   "the exact same problem — 69 times 71 — three days running"
//             cornerTags over a LiveWindow recording of the feature's own page.
// b2 244-380  "it felt like a bug, and it never fixed what she actually got wrong"
//             keywordCaption, drawn (dark plate, no backdrop).
// b3 380-641  "a memory in Supabase... so a maker rerolls before repeating one"
//             handoffExplain, drawn — the flow-map archetype below gains its
//             "check last 200 / reroll" node at the same moment.
// b4 641-787  "a third of every bonus set now even targets her actual weak topics"
//             percentRing (33), drawn — flow-map gains its "weak-topic pick" node.
// b5 787-1043 "36,600 generated answers checked... zero duplicates, zero repeats"
//             drawn only — a result panel plus a LogWindow built from this run's
//             own numbers. Never the feature page or the hub (gate 2). Holds at
//             full opacity to the end, no fade.
//
// Persistent element: the flow-map archetype, b1 through b5 — a full-width band in
// the lower third (y 460-720) holding nodes and routes a question travels through;
// stuck looping on one node in b1-b2, it grows a branch and a token that advances
// node by node as the fix and its results are explained.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Panel, IconCard } from "./bright-primitives";
import { MotionInsert, cut } from "./motion-primitives";
import { LiveWindow, LogWindow, LogLine } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b37.json";

const B1 = 15;
const B2 = 244;
const B3 = 380;
const B4 = 641;
const B5 = 787;
const END = 1043;

/** Violet's own accent (#5B37D4) lifted brighter so it reads on the dark stage. */
const ACCENT = "#8B6FEF";
const STAGE = "#130E24";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Flow-map geometry (1280x720): full-width band in the lower third, y >= 600
// (the convention set by p75's flow-map-under-the-effects staging).
const FLOW_TOP = 600;
const FLOW_H = 120;
const FLOW_CY = FLOW_TOP + 60;

type Node = { x: number; label: string };
const NODES: Node[] = [
  { x: 150, label: "New question" },
  { x: 400, label: "Check last 200" },
  { x: 650, label: "Fresh → deliver" },
  { x: 900, label: "Weak-topic pick" },
  { x: 1150, label: "Delivered" },
];

const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // furthest node reached (0-4) and how far the token has travelled toward it
  let reached = 0;
  let travelFrom = B1;
  let travelTo = B2;
  if (frame >= B5) {
    reached = 4;
    travelFrom = B5;
    travelTo = B5 + 45;
  } else if (frame >= B4) {
    reached = 3;
    travelFrom = B4;
    travelTo = B4 + 45;
  } else if (frame >= B3) {
    reached = 2;
    travelFrom = B3;
    travelTo = B3 + 45;
  }

  const travelT = Math.max(0, Math.min(1, (frame - travelFrom) / (travelTo - travelFrom)));
  const prevX = reached > 0 ? NODES[reached - 1].x : NODES[0].x;
  const curX = NODES[reached].x;
  const tokenX = reached === 0 ? NODES[0].x + Math.sin(frame / 10) * 14 : prevX + (curX - prevX) * ease.power2Out(travelT);
  const tokenY = FLOW_CY;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: FLOW_TOP,
        width: 1280,
        height: FLOW_H,
        background: "rgba(255,255,255,0.03)",
        borderTop: `3px solid ${P.border}44`,
        fontFamily,
      }}
    >
      <div style={{ position: "absolute", left: 48, top: 14, fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>
        BONUS QUIZ — QUESTION FLOW
      </div>

      {NODES.map((n, i) => {
        if (i > reached + 1) return null;
        const live = i <= reached;
        const appearAt = i === 0 ? B1 : i === 1 ? B3 : i === 2 ? B3 : i === 3 ? B4 : B5;
        const scale = punchScale(sec(frame, appearAt, fps), 0);
        const op = tween(sec(frame, appearAt, fps), 0, 0.3, ease.power2Out);
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: n.x - 90,
              top: FLOW_CY - 28,
              width: 180,
              height: 56,
              borderRadius: 12,
              border: `2px solid ${live ? P.success : P.border}`,
              background: live ? P.successBg : P.card,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 800,
              color: live ? P.success : P.muted,
              padding: "0 10px",
              opacity: op,
              transform: `scale(${scale})`,
            }}
          >
            {n.label}
          </div>
        );
      })}

      {frame >= B1 && frame < B3 && (
        <div
          style={{
            position: "absolute",
            left: NODES[0].x - 90,
            top: FLOW_CY + 38,
            width: 180,
            textAlign: "center",
            fontSize: 11.5,
            fontWeight: 700,
            color: P.danger,
            opacity: tween(sec(frame, B1, fps), 0.5, 0.8, ease.power2Out),
          }}
        >
          {frame < B2 ? "↺ loops, same question" : "↺ loops — weak spots untouched"}
        </div>
      )}

      {reached >= 2 && (
        <div
          style={{
            position: "absolute",
            left: NODES[1].x + 90,
            top: FLOW_CY + 38,
            width: 170,
            textAlign: "left",
            fontSize: 11.5,
            fontWeight: 700,
            color: P.muted,
            opacity: tween(sec(frame, B3, fps), 0.5, 0.8, ease.power2Out),
          }}
        >
          Seen → reroll (dashed back)
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: tokenX - 10,
          top: tokenY - 10,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: ACCENT,
          boxShadow: `0 0 16px ${ACCENT}`,
        }}
      />
    </div>
  );
};

const RESULT_LINES: LogLine[] = [
  { text: "memory check — last 200 Qs loaded", tone: "muted" },
  { text: "36,600 generated answers checked", tone: "accent" },
  { text: "duplicates found: 0", tone: "success" },
  { text: "repeats found: 0", tone: "success" },
  { text: "weak-topic targeting: 33% of bonus sets", tone: "accent" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: the same question, three days running, on the feature's own page */}
      {cut(frame, B1, B2) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features"
          from={B1}
          hold={B2 - B1}
          zoom={(t) => 1 + 0.08 * t}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={1}
          win={{ x: 60, y: 70, w: 780, h: 420 }}
        />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "Same problem, 3 days straight",
          tags: ["69 x 71", "Bonus math task", "3 days running", "Boytasks"],
        }}
      />
      {frame >= B1 && frame < B2 && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 510,
            fontFamily,
            fontSize: 16,
            fontWeight: 700,
            color: P.muted,
            opacity: tween(sec(frame, B1, 30), 0.3, 0.6, ease.power2Out),
          }}
        >
          Boytasks — screen-time &amp; task kiosk for three kids, on Cloudflare Workers
        </div>
      )}

      {/* b2 — never fixed what she actually got wrong */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          line1: "Felt like a bug",
          line2: "never fixed what she actually got wrong",
          keywords: ["bug", "never fixed"],
        }}
      />

      {/* b3 — the fix: a memory in Supabase, reroll before repeating one */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          from: "No memory, same Q repeats",
          to: "Checks last 200, rerolls",
          points: ["Supabase stores last 200 Qs per kid", "Reroll before repeating one", "Runs before every bonus set"],
        }}
      />

      {/* b4 — a third of every bonus set now targets her weak topics */}
      <MotionInsert
        effect="percentRing"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          value: 33,
          label: "of every bonus set now targets her weak topics",
          notes: ["Picked from her actual misses"],
        }}
      />

      {/* b5 — drawn: 36,600 checked, zero duplicates, zero repeats. Never the feature
          page or the hub (gate 2). Holds at full opacity, no fade. */}
      {frame >= B5 && (
        <Panel x={60} y={70} w={880} h={190} tone="success" radius={28} opacity={1}>
          <div style={{ padding: "26px 40px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>
              36,600 ANSWERS CHECKED AFTER THE FIX
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#101418", marginTop: 4 }}>
              0 duplicates — 0 repeats
            </div>
          </div>
        </Panel>
      )}
      {frame >= B5 && (
        <>
          <IconCard x={60} y={290} w={260} emoji="🔁" title="Reroll" sub="Before repeating one" tone="accent" />
          <IconCard x={340} y={290} w={260} emoji="🎯" title="Weak topics" sub="33% of bonus sets" tone="success" />
          <IconCard x={620} y={290} w={260} emoji="✅" title="Checked" sub="36,600 answers" tone="success" />
        </>
      )}
      {frame >= B5 + 45 && (
        <LogWindow
          lines={RESULT_LINES}
          title="bonus quiz log"
          from={B5 + 45}
          every={16}
          opacity={1}
          fontSize={22}
          win={{ x: 60, y: 390, w: 880, h: 200 }}
        />
      )}

      <FlowMap />
    </AbsoluteFill>
  );
};

export const FeatureEnding6971LoopB37: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
