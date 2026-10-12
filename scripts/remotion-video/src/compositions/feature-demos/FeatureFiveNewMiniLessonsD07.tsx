// FeatureFiveNewMiniLessonsD07 — feature d07 — 1280x720, 880 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood mint. Motion direction (feature-motion skill, 2026-10-07).
//
// The map is the game's five real lessons (from the commit below) as nodes on a
// level-map route, not abstract icons. It breathes through the clip: a dim,
// disconnected scatter (b1-b2, nothing taught yet) folds into a big lit zigzag
// route spanning the whole frame with a token traveling it (b3, the reveal),
// shrinks back into a tidy connected band while each lesson's ending is explained
// (b4, room is made for the matrix panel above), then expands again across the
// full frame for the finale — a second token travels the route ticking each node
// green in turn, and the route itself forks into two branches (quiz / hands-on),
// ending on a bright "5 / 5" stamp. No grid state needed — scatter, big zigzag,
// small band cover every beat.
//
// Beat → effect (data only from the feature row and the one matching commit —
// 8e55152 "five game lessons — food to sugar, insulin key, type 2 rusty lock, too
// little insulin, low sugar help" informs b3 directly; 4a14f3c "NovoRapid starts
// with the plate" and 4683181 "food by weight, per 100g" both belong to feature
// d08 and are not used here):
// b1 15-188   "A kid could play the diabetes game for hours and never actually
//             learn why any of it happens." titleTakeover over the features hub.
// b2 188-381  "The simulation ran, but nothing stopped to explain what insulin
//             does, or why type 2 is different." cornerTags over the feature's
//             own page.
// b3 381-551  "Five guided lessons now walk through that reasoning step by step,
//             right on the level map." Drawn: no live page shows this — the
//             archetype's own hand-off, the five real lesson names (commit
//             8e55152) fold from the dim scatter into a lit zigzag route across
//             the whole frame, a token traveling node to node as each lands.
// b4 551-693  "Each one ends in a quiz or a hands-on round, scored with stars."
//             featureMatrix, drawn (the route shrinks back into the band so the
//             matrix panel owns the centre) — each node also gains its own
//             star / hands-on badge.
// b5 693-880  "A Playwright test plays every lesson through to completion — five
//             for five." Drawn: the route expands back out across the full frame,
//             a second token travels it ticking each node green in turn, and the
//             route forks into two branch lines ending on "QUIZ · 4" and
//             "HANDS-ON · 1" chips, closing on a bright "5 / 5" stamp. Holds
//             bright to the final frame, no fade.
//
// Persistent element: the lesson flow-map (archetype 4), b1 through b5 — five
// nodes, the same five lessons throughout; only the route's shape (scatter, big
// zigzag, small band) and its markings (badges, checks, branch) change.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d07.json";

const B1 = 15;
const B2 = 188;
const B3 = 381;
const B4 = 551;
const B5 = 693;
const END = 880;

/** Bright teal-green tuned for the dark stage (mint's #0B7A5A reads muddy on a plate). */
const ACCENT = "#34D399";
const STAGE = "#0D1F18";

// Resting band (scatter's "home" position, and b4's compact connected row) vs.
// the big zigzag route for the b3 reveal and the b5 finale — five points spread
// across the whole 1280x720 frame, not a straight strip.
const BAND = { x: 40, y: 606, w: 1200, h: 92 };
const NODE_BIG_W = 196;
const NODE_BIG_H = 118;
const BIG_PTS: { x: number; y: number }[] = [
  { x: 150, y: 230 },
  { x: 410, y: 460 },
  { x: 665, y: 210 },
  { x: 920, y: 460 },
  { x: 1150, y: 230 },
];
const QUIZ_CHIP = { x: 380, y: 590 };
const HANDSON_CHIP = { x: 900, y: 590 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Rect = { x: number; y: number; w: number; h: number };
const mixRect = (p: number, a: Rect, b: Rect): Rect => ({
  x: mix(p, a.x, b.x),
  y: mix(p, a.y, b.y),
  w: mix(p, a.w, b.w),
  h: mix(p, a.h, b.h),
});

type Lesson = { key: string; label: string; handsOn?: boolean };
/** The real five lessons from commit 8e55152, in commit order. */
const LESSONS: Lesson[] = [
  { key: "food", label: "Food → Sugar" },
  { key: "ikey", label: "Insulin Key" },
  { key: "rusty", label: "Type 2: Rusty Lock" },
  { key: "low", label: "Too Little Insulin", handsOn: true },
  { key: "help", label: "Low Sugar Help" },
];
const N = LESSONS.length;

/** A route segment between two node centers; draws on with `progress` 0..1. */
const Route: React.FC<{ x1: number; y1: number; x2: number; y2: number; progress: number; color: string; opacity?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  progress,
  color,
  opacity = 1,
}) => {
  if (progress <= 0.004 || opacity <= 0.004) return null;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y1 - 1.5,
        width: len * progress,
        height: 3,
        borderRadius: 2,
        background: color,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "0 50%",
        opacity,
      }}
    />
  );
};

/** A small glowing dot traveling a route, `t` 0..1. */
const Token: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; color: string }> = ({ x1, y1, x2, y2, t, color }) => {
  if (t <= 0 || t >= 1) return null;
  const x = x1 + (x2 - x1) * t;
  const y = y1 + (y2 - y1) * t;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 7,
        top: y - 7,
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 12px ${color}`,
      }}
    />
  );
};

const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Band layout: a tidy row of five slots inside BAND (scatter's "home" position, and b4's compact row).
  const PAD = 10;
  const GAP = 6;
  const slotW = (BAND.w - PAD * 2 - GAP * (N - 1)) / N;
  const rowH = BAND.h - PAD * 2;
  const rowY = BAND.y + PAD;

  const pileCx = BAND.x + BAND.w / 2;
  const pileCy = BAND.y + BAND.h / 2;

  const shrink = tween(sec(frame, B4, fps), 0, 0.4, ease.power3InOut);
  const expand = tween(sec(frame, B5, fps), 0, 0.4, ease.power3InOut);
  // 0 = small (band) route, 1 = big zigzag route — settles small through b4, big again from b5.
  const bigness = mix(expand, 1 - shrink, 1);

  const inBig = (frame >= B3 && frame < B4) || frame >= B5;
  const showQuestion = frame < B3;
  const kicker =
    frame >= B5
      ? "PLAYWRIGHT: FIVE FOR FIVE"
      : frame >= B4
      ? "QUIZ OR HANDS-ON, SCORED IN STARS"
      : frame >= B3
      ? "FIVE GUIDED LESSONS"
      : "NO LESSONS, JUST PLAY";
  const kickerY = inBig ? 96 : BAND.y - 28;
  const kickerX = inBig ? 60 : BAND.x + PAD;

  const stampStart = B5 + 140;
  const showStamp = frame >= stampStart;
  const stampPop = showStamp ? punchScale(sec(frame, stampStart, fps), 0) : 1;

  // Compute every node's rect + fold progress first, so the routes between them
  // can be drawn from real (animated) centers before the node chips go on top.
  const nodes = LESSONS.map((lesson, i) => {
    const pileW = 150;
    const pileH = 72;
    const pileRect: Rect = {
      x: pileCx - pileW / 2 + (i - 2) * 6,
      y: pileCy - pileH / 2 - i * 2,
      w: pileW,
      h: pileH,
    };
    const pileRot = (i - 2) * 3.5;

    const smallRect: Rect = { x: BAND.x + PAD + i * (slotW + GAP), y: rowY, w: slotW, h: rowH };
    const bigRect: Rect = { x: BIG_PTS[i].x - NODE_BIG_W / 2, y: BIG_PTS[i].y - NODE_BIG_H / 2, w: NODE_BIG_W, h: NODE_BIG_H };
    const settled = mixRect(bigness, smallRect, bigRect);

    const foldT = tween(sec(frame, B3, fps), i * 0.07, 0.5, ease.power3Out);
    const rect = mixRect(foldT, pileRect, settled);
    const rotation = pileRot * (1 - foldT);
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;

    const arriveT = sec(frame, B1 + 4, fps);
    const entranceScale = punchScale(arriveT, i * 0.05);
    const entranceOpacity = tween(arriveT, i * 0.05, 0.12, ease.linear);

    const landed = foldT > 0.5;
    const badgeT = frame >= B4 ? tween(sec(frame, B4 + i * 10, fps), 0, 0.3, ease.power3Out) : 0;
    const checkStart = B5 + i * 25;
    const checkT = frame >= B5 ? tween(sec(frame, checkStart, fps), 0, 0.25, ease.power3Out) : 0;

    return { lesson, i, rect, rotation, cx, cy, foldT, entranceScale, entranceOpacity, landed, badgeT, checkT };
  });

  // Discovery token (b3): leads the folding-in wave along the chain.
  const discoveryT = frame >= B3 && frame < B4 ? tween(sec(frame, B3, fps), 0.05, 0.9, ease.sineInOut) : 0;
  // Test token (b5): a second pass, driving the "five for five" read along the chain.
  const testT = frame >= B5 ? tween(sec(frame, B5, fps), 0.1, 1.1, ease.sineInOut) : 0;

  const chainPos = (t: number) => {
    const seg = Math.min(N - 2, Math.floor(t * (N - 1)));
    const local = t * (N - 1) - seg;
    const a = nodes[seg];
    const b = nodes[seg + 1];
    return { x: mix(local, a.cx, b.cx), y: mix(local, a.cy, b.cy) };
  };

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* the level-map route — the main chain, both bands and the big zigzag */}
      {nodes.slice(0, N - 1).map((a, i) => {
        const b = nodes[i + 1];
        const progress = Math.min(a.foldT, b.foldT);
        return <Route key={`route-${i}`} x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy} progress={progress} color={P.border} />;
      })}

      {/* b5 finale: the route forks into two branches — quiz (4) and hands-on (1) */}
      {inBig &&
        frame >= B5 &&
        nodes.map((node) => {
          const target = node.lesson.handsOn ? HANDSON_CHIP : QUIZ_CHIP;
          return (
            <Route
              key={`branch-${node.i}`}
              x1={node.cx}
              y1={node.cy}
              x2={target.x}
              y2={target.y}
              progress={node.checkT}
              color={node.lesson.handsOn ? P.amber : P.success}
              opacity={0.85}
            />
          );
        })}
      {inBig && frame >= B5 && (
        <>
          <div
            style={{
              position: "absolute",
              left: QUIZ_CHIP.x - 86,
              top: QUIZ_CHIP.y - 20,
              width: 172,
              padding: "8px 12px",
              borderRadius: 999,
              background: P.successBg,
              border: `1.5px solid ${P.successEdge}`,
              color: P.success,
              fontSize: 15,
              fontWeight: 800,
              textAlign: "center",
              opacity: Math.max(...nodes.filter((n) => !n.lesson.handsOn).map((n) => n.checkT)),
            }}
          >
            ★★★ QUIZ · 4
          </div>
          <div
            style={{
              position: "absolute",
              left: HANDSON_CHIP.x - 86,
              top: HANDSON_CHIP.y - 20,
              width: 172,
              padding: "8px 12px",
              borderRadius: 999,
              background: P.noteBg,
              border: `1.5px solid ${P.amber}`,
              color: P.amber,
              fontSize: 15,
              fontWeight: 800,
              textAlign: "center",
              opacity: Math.max(...nodes.filter((n) => n.lesson.handsOn).map((n) => n.checkT)),
            }}
          >
            ✋ HANDS-ON · 1
          </div>
        </>
      )}

      {discoveryT > 0 && discoveryT < 1 && (
        <Token
          x1={chainPos(discoveryT).x}
          y1={chainPos(discoveryT).y}
          x2={chainPos(discoveryT).x}
          y2={chainPos(discoveryT).y}
          t={0.5}
          color={ACCENT}
        />
      )}
      {testT > 0 && testT < 1 && (
        <Token
          x1={chainPos(testT).x}
          y1={chainPos(testT).y}
          x2={chainPos(testT).x}
          y2={chainPos(testT).y}
          t={0.5}
          color={P.success}
        />
      )}

      <div
        style={{
          position: "absolute",
          left: kickerX,
          top: kickerY,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 2,
          color: ACCENT,
          opacity: frame >= B1 + 10 ? 1 : 0,
        }}
      >
        {kicker}
      </div>

      {showQuestion && (
        <div
          style={{
            position: "absolute",
            left: pileCx - 14,
            top: BAND.y - 46,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            color: P.danger,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
          }}
        >
          ?
        </div>
      )}

      {showStamp && (
        <div
          style={{
            position: "absolute",
            left: 1280 / 2 - 90,
            top: 94,
            width: 180,
            height: 56,
            borderRadius: 6,
            background: P.success,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 800,
            transform: `scale(${stampPop})`,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
          }}
        >
          5 / 5
        </div>
      )}

      {nodes.map(({ lesson, i, rect, rotation, foldT, entranceScale, entranceOpacity, landed, badgeT, checkT }) => {
        const bg = landed ? P.successBg : P.chipBg;
        const edge = landed ? P.successEdge : P.border;
        const fg = landed ? P.success : P.muted;
        const big = bigness > 0.5;

        return (
          <div
            key={lesson.key}
            style={{
              position: "absolute",
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              transform: `rotate(${rotation}deg) scale(${entranceScale})`,
              opacity: entranceOpacity,
              zIndex: i + 1,
              borderRadius: big ? 999 : 6,
              background: bg,
              border: `2px solid ${edge}`,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: big ? 20 : 13, fontWeight: 800, color: fg, textAlign: "center", lineHeight: 1.2 }}>
              {lesson.label}
            </div>
            {badgeT > 0.01 && (
              <div
                style={{
                  marginTop: big ? 12 : 6,
                  fontSize: big ? 22 : 14,
                  fontWeight: 800,
                  color: P.amber,
                  opacity: badgeT,
                  transform: `scale(${mix(badgeT, 0.6, 1)})`,
                }}
              >
                {lesson.handsOn ? "✋" : "★★★"}
              </div>
            )}
            {checkT > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  top: -10,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: P.success,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  transform: `scale(${mix(checkT, 0.4, 1)})`,
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.35)",
                }}
              >
                ✓
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // b1 — a one-line product plate: who this is, named plainly for a blind viewer.
  const plateT = tween(sec(frame, B1 + 4, fps), 0, 0.3, ease.power3Out);
  const plateOpacity = frame >= B1 && frame < B2 ? plateT : 0;

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — plays for hours, learns nothing, over the features hub */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Plays For Hours, Learns Nothing", kicker: "The simulation never stops to explain" }}
      />
      {plateOpacity > 0.004 && (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 28,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(13,31,24,0.8)",
            border: `1.5px solid ${ACCENT}`,
            color: "#EAFFF4",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.3,
            fontFamily,
            opacity: plateOpacity,
            transform: `translateY(${(1 - plateOpacity) * -8}px)`,
          }}
        >
          <span style={{ color: ACCENT, fontWeight: 800 }}>Insulin Simulator</span>
          <span style={{ opacity: 0.85 }}>— built for my son Artem</span>
        </div>
      )}

      {/* b2 — insulin and type 2 never explained, over the feature's own page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          statement: "The simulation ran, unexplained",
          tags: ["Insulin? Never explained", "Type 1 vs Type 2? Unclear", "No pause to teach", "Quizzes, but no lessons"],
        }}
      />

      {/* b3 — archetype only: the five real lesson names (commit 8e55152) fold into the lit row */}

      {/* b4 — each lesson's own ending, drawn (no live page shows this); the row shrinks to make room */}
      <MotionInsert
        effect="featureMatrix"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          options: ["Ends with", "Scored"],
          rows: [
            { label: "4 lessons", values: ["Multiple-choice quiz", "★★★"] },
            { label: "1 lesson", values: ["Hands-on round", "★★★"] },
          ],
        }}
      />

      {/* b5 — archetype only: five green checks, then the "5 / 5" stamp, holds to the end */}

      <FlowMap />
    </AbsoluteFill>
  );
};

export const FeatureFiveNewMiniLessonsD07: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
