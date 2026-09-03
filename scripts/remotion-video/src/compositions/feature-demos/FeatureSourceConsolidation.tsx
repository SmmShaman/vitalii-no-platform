/**
 * FeatureSourceConsolidation — feature p22 — 1280x720, 889 frames @30fps.
 * VOICE-SYNCED (owner rule, 2026-08-31) — the beat windows below are measured
 * from the real voiceover, not a designer's guess. Rebuild the audio and you
 * must rebuild these numbers with it.
 *
 * Art direction handed down by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md), NOT drawn locally:
 *   archetype 4 "flow map" — 32 scattered source nodes (6 blue Telegram
 *     circles + 26 smaller RSS circles) spread across the whole left/centre
 *     of the frame; thin lines converge on a single "moderation queue" panel
 *     on the right. The node field is the one element that survives every
 *     beat (present from b1, wired up from b3 on), so the clip reads as one
 *     map growing more organized rather than five slides.
 *   mood "slate" — `<PaletteProvider value={MOODS.slate}>` wraps the whole tree.
 *
 * Beat windows (measured, fps 30):
 *   b1  15-255  "I used to check six Telegram channels and 26 RSS feeds
 *                every single day, by hand, just hunting for one good story."
 *   b2 264-383  "That's 32 different clocks, all ticking on their own
 *                schedule."
 *   b3 392-571  "So I automated the entire intake with GitHub Actions,
 *                funneling everything into one queue."
 *   b4 580-767  "It rotates through sources so none of them throttles me,
 *                and batches the rest to keep it fast and cheap."
 *   b5 776-844  "32 sources, one queue."
 *   tail 844-889 — b5 HOLDS, it does not fade to an empty frame.
 *
 * Sync notes: the node field (chaos) is what beat 1 shows — no lines, no
 * queue, just 32 scattered circles and a cursor manually visiting a few of
 * them one at a time. The "32" itself is not spoken until beat 2, so the big
 * hero number only appears there. The lines + queue panel + the one allowed
 * tech caption ("GitHub Actions") do not appear until beat 3, the moment the
 * narration says "automated the entire intake". The round-robin beacon and
 * the four travelling RSS batches do not appear until beat 4, the moment the
 * narration names those two mechanics. The b3→b4 handoff is a scale+slide
 * push (not a plain crossfade): the beat-4 mechanism layer enters zoomed in
 * and slides down into place instead of fading over the top of beat 3.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import { LightBg, Group, Panel, Cursor, CheckBadge, seg, fontFamily } from "./bright-primitives";

const P = MOODS.slate;

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const B1: readonly [number, number] = [15, 255];
const B2: readonly [number, number] = [264, 383];
const B3: readonly [number, number] = [392, 571];
const B4: readonly [number, number] = [580, 767];
const B5: readonly [number, number] = [776, 844];

/** Fade in after the beat opens, fully gone before it closes (~9-frame gaps). */
const zone = (frame: number, s: number, e: number) => Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));

// ── The 32-source field: 6 Telegram (bold, accent) + 26 RSS (small, muted) ──
type Pt = { x: number; y: number };

const TG_NODES: Pt[] = [
  { x: 150, y: 120 },
  { x: 620, y: 90 },
  { x: 860, y: 150 },
  { x: 200, y: 430 },
  { x: 500, y: 560 },
  { x: 760, y: 500 },
];

const RSS_NODES: Pt[] = Array.from({ length: 26 }, (_, i) => {
  const col = i % 7;
  const row = Math.floor(i / 7);
  const jitterX = Math.sin(i * 12.9) * 18;
  const jitterY = Math.cos(i * 7.3) * 14;
  return { x: 90 + col * 135 + jitterX, y: 90 + row * 157 + jitterY };
});

const ALL_NODES: Pt[] = [...TG_NODES, ...RSS_NODES];

const QUEUE = { x: 930, y: 270, w: 310, h: 170 };
const ANCHOR: Pt = { x: QUEUE.x, y: QUEUE.y + QUEUE.h / 2 };

const RSS_BATCHES: number[][] = [
  [0, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25],
];
type Box = { minX: number; maxX: number; minY: number; maxY: number };
const boxOf = (idxs: number[]): Box => {
  const xs = idxs.map((i) => RSS_NODES[i].x);
  const ys = idxs.map((i) => RSS_NODES[i].y);
  return { minX: Math.min(...xs) - 22, maxX: Math.max(...xs) + 22, minY: Math.min(...ys) - 22, maxY: Math.max(...ys) + 22 };
};
const BATCH_BOXES: Box[] = RSS_BATCHES.map(boxOf);

/** A source dot on the map: bigger accent circle for Telegram, small muted circle for RSS. */
const NodeDot: React.FC<{ x: number; y: number; emoji: string; color: string; size: number; opacity: number }> = ({
  x,
  y,
  emoji,
  color,
  size,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: P.card,
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        opacity,
        boxShadow: cardShadow,
        fontFamily,
      }}
    >
      {emoji}
    </div>
  );
};

/** Small floating tooltip that appears where the cursor clicks — real-sounding source names. */
const NodeTag: React.FC<{ x: number; y: number; text: string; opacity: number; gold?: boolean }> = ({
  x,
  y,
  text,
  opacity,
  gold,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 74,
        top: y - 46,
        width: 148,
        textAlign: "center",
        fontSize: 13,
        fontWeight: 700,
        color: gold ? P.amber : P.ink,
        background: P.card,
        border: `1.5px solid ${gold ? P.amber : P.accent}`,
        borderRadius: 8,
        padding: "5px 6px",
        opacity,
        boxShadow: cardShadow,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

export const FeatureSourceConsolidation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = zone(frame, B1[0], B1[1]);
  const b2 = zone(frame, B2[0], B2[1]);
  const b3 = zone(frame, B3[0], B3[1]);
  // b4 fades in and back out (handed to b5 with a scale push), b5 has nothing
  // to hand over to — it holds through the tail instead of fading out.
  const b4 = zone(frame, B4[0], B4[1]);
  const b5 = seg(frame, B5[0] + 2, B5[0] + 16);

  // ── Persistent map: 32 nodes fade in once during beat 1 and never leave ──
  const nodeIn = (i: number, base: number, step: number) => seg(frame, base + i * step, base + i * step + 14);

  // ── Persistent lines + queue: introduced exactly when beat 3 names them ──
  const LINE_BASE = B3[0] + 6;
  const LINE_STEP = 2.5;
  const queuePop = Math.min(1, pop(B3[0] + 18));

  // ── Beat 1: the problem — manual, one at a time ──
  const waypoints: { t: number; pos: Pt; label: string; gold?: boolean }[] = [
    { t: 55, pos: TG_NODES[0], label: "@ai_news_channel" },
    { t: 95, pos: RSS_NODES[2], label: "TechCrunch RSS" },
    { t: 135, pos: TG_NODES[1], label: "@tech_digest_no" },
    { t: 175, pos: RSS_NODES[9], label: "HackerNews RSS" },
    { t: 215, pos: RSS_NODES[16], label: "DevTo RSS — found it! ⭐", gold: true },
  ];
  const cursorFrames = [30, 55, 70, 95, 110, 135, 150, 175, 190, 215, 245];
  const cursorXs = [
    TG_NODES[0].x, TG_NODES[0].x, RSS_NODES[2].x, RSS_NODES[2].x,
    TG_NODES[1].x, TG_NODES[1].x, RSS_NODES[9].x, RSS_NODES[9].x,
    RSS_NODES[16].x, RSS_NODES[16].x, RSS_NODES[16].x,
  ];
  const cursorYs = [
    TG_NODES[0].y, TG_NODES[0].y, RSS_NODES[2].y, RSS_NODES[2].y,
    TG_NODES[1].y, TG_NODES[1].y, RSS_NODES[9].y, RSS_NODES[9].y,
    RSS_NODES[16].y, RSS_NODES[16].y, RSS_NODES[16].y,
  ];
  const cursorX = interpolate(frame, cursorFrames, cursorXs, {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });
  const cursorY = interpolate(frame, cursorFrames, cursorYs, {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });
  const clicks = waypoints.map((w) => seg(frame, w.t - 6, w.t + 8, Easing.out(Easing.quad)));

  // ── Beat 2: 32 different clocks, all ticking on their own schedule ──
  const CLOCK_TARGETS = [TG_NODES[0], TG_NODES[2], TG_NODES[4], RSS_NODES[3], RSS_NODES[12], RSS_NODES[19]];
  const CLOCK_SPEEDS = [7, -5, 9, -11, 6, -8];

  // ── Beat 3→4 push transition (not a plain crossfade) ──
  const b4EnterT = seg(frame, B4[0] + 2, B4[0] + 18);
  const b4Scale = 1.06 - 0.06 * b4EnterT;
  const b4TranslateY = -18 * (1 - b4EnterT);

  // ── Beat 4: round-robin beacon across the 6 Telegram nodes, then into the queue ──
  const beaconFrames = [590, 598, 614, 621, 637, 644, 660, 667, 683, 690, 706, 713, 729, 745];
  const beaconXs = [
    TG_NODES[0].x, TG_NODES[0].x, TG_NODES[0].x, TG_NODES[1].x, TG_NODES[1].x,
    TG_NODES[2].x, TG_NODES[2].x, TG_NODES[3].x, TG_NODES[3].x, TG_NODES[4].x,
    TG_NODES[4].x, TG_NODES[5].x, TG_NODES[5].x, ANCHOR.x,
  ];
  const beaconYs = [
    TG_NODES[0].y, TG_NODES[0].y, TG_NODES[0].y, TG_NODES[1].y, TG_NODES[1].y,
    TG_NODES[2].y, TG_NODES[2].y, TG_NODES[3].y, TG_NODES[3].y, TG_NODES[4].y,
    TG_NODES[4].y, TG_NODES[5].y, TG_NODES[5].y, ANCHOR.y,
  ];
  const beaconX = interpolate(frame, beaconFrames, beaconXs, {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });
  const beaconY = interpolate(frame, beaconFrames, beaconYs, {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });
  const beaconOp = seg(frame, 590, 600) * (1 - seg(frame, 748, 758));

  // ── Beat 5: the payoff hero line ──
  const finaleIn = Math.min(1, pop(B5[0] + 6));
  const check = Math.min(1, pop(B5[0] + 18));

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />
      <PaletteProvider value={P}>
        {/* ════ Persistent flow lines — appear once beat 3 names automation ════ */}
        <svg style={{ position: "absolute", inset: 0, width: 1280, height: 720, pointerEvents: "none" }}>
          {ALL_NODES.map((n, i) => {
            const op = seg(frame, LINE_BASE + i * LINE_STEP, LINE_BASE + i * LINE_STEP + 14);
            if (op <= 0.004) return null;
            const isTg = i < 6;
            return (
              <line
                key={i}
                x1={n.x}
                y1={n.y}
                x2={ANCHOR.x}
                y2={ANCHOR.y}
                stroke={isTg ? P.accent : P.border}
                strokeWidth={isTg ? 2.2 : 1.4}
                opacity={op * (isTg ? 0.55 : 0.4)}
              />
            );
          })}
        </svg>

        {/* Gentle continuous flow dots along the 6 Telegram routes once drawn — keeps the map alive through quiet stretches. */}
        {TG_NODES.map((n, i) => {
          const lineOp = seg(frame, LINE_BASE + i * LINE_STEP, LINE_BASE + i * LINE_STEP + 14);
          if (lineOp < 0.999) return null;
          const speed = 0.006 + i * 0.0015;
          const t = (frame * speed) % 1;
          const dx = n.x + (ANCHOR.x - n.x) * t;
          const dy = n.y + (ANCHOR.y - n.y) * t;
          return (
            <div
              key={`flow-${i}`}
              style={{
                position: "absolute", left: dx - 4, top: dy - 4, width: 8, height: 8,
                borderRadius: "50%", background: P.accent, opacity: 0.85,
              }}
            />
          );
        })}

        {/* ════ Persistent 32-node field — fades in during beat 1, never leaves ════ */}
        {ALL_NODES.map((n, i) => {
          const isTg = i < 6;
          const op = isTg ? nodeIn(i, 22, 5) : nodeIn(i - 6, 22, 3);
          return (
            <NodeDot
              key={i}
              x={n.x}
              y={n.y}
              emoji={isTg ? "📱" : "📰"}
              color={isTg ? P.accent : P.muted}
              size={isTg ? 40 : 26}
              opacity={op}
            />
          );
        })}

        {/* ════ Persistent queue panel + the one tech caption — from beat 3 on ════ */}
        <Panel x={QUEUE.x} y={QUEUE.y} w={QUEUE.w} h={QUEUE.h} tone="accent" opacity={queuePop}>
          <div style={{ padding: "22px 26px", fontFamily }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: P.accent, letterSpacing: 0.6 }}>MODERATION QUEUE</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: P.ink, marginTop: 10 }}>One queue</div>
            <div style={{ fontSize: 16.5, fontWeight: 600, color: P.muted, marginTop: 8, lineHeight: 1.35 }}>
              everything funnels in here first
            </div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute", left: QUEUE.x + 20, top: QUEUE.y - 40,
            padding: "6px 14px", borderRadius: 999, background: P.card,
            border: `1.5px solid ${P.accentEdge}`, color: P.accent,
            fontSize: 14.5, fontWeight: 700, opacity: queuePop, boxShadow: cardShadow, fontFamily,
          }}
        >
          {"🔧 GitHub Actions"}
        </div>
        {/* success overlay: the panel's border/tone shifts to success once beat 5 lands */}
        <Panel x={QUEUE.x} y={QUEUE.y} w={QUEUE.w} h={QUEUE.h} tone="success" opacity={b5}>
          <div style={{ padding: "22px 26px", fontFamily }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: P.success, letterSpacing: 0.6 }}>MODERATION QUEUE</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: P.ink, marginTop: 10 }}>One queue</div>
            <div style={{ fontSize: 16.5, fontWeight: 600, color: P.muted, marginTop: 8, lineHeight: 1.35 }}>
              live — filled automatically
            </div>
          </div>
        </Panel>

        {/* ════ Beat 1 — PROBLEM: manual, one at a time ════ */}
        <Group opacity={b1}>
          <div style={{ position: "absolute", left: 955, top: 50, width: 280, fontFamily }}>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 999,
                background: P.dangerBg, border: `1.5px solid ${P.dangerEdge}`, color: P.danger,
                fontSize: 18, fontWeight: 700, marginBottom: 14, opacity: Math.min(1, pop(35)), boxShadow: cardShadow,
              }}
            >
              <span style={{ fontSize: 22 }}>{"📱"}</span>6 Telegram channels
            </div>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 999,
                background: P.dangerBg, border: `1.5px solid ${P.dangerEdge}`, color: P.danger,
                fontSize: 18, fontWeight: 700, marginBottom: 14, opacity: Math.min(1, pop(50)), boxShadow: cardShadow,
              }}
            >
              <span style={{ fontSize: 22 }}>{"📰"}</span>26 RSS feeds
            </div>
            <div
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", borderRadius: 999,
                background: P.dangerBg, border: `1.5px solid ${P.dangerEdge}`, color: P.danger,
                fontSize: 18, fontWeight: 700, opacity: Math.min(1, pop(65)), boxShadow: cardShadow,
              }}
            >
              <span style={{ fontSize: 22 }}>{"👆"}</span>checked one by one
            </div>
            <div
              style={{
                marginTop: 22, fontSize: 19, fontWeight: 700, color: P.amber,
                opacity: seg(frame, 205, 219),
              }}
            >
              {"⭐ hunting for one good story"}
            </div>
          </div>

          <Cursor
            x={cursorX}
            y={cursorY}
            opacity={seg(frame, 30, 40) * (1 - seg(frame, 245, 255))}
            click={Math.max(...clicks.map((c) => c % 1))}
          />
          {waypoints.map((w, i) => (
            <NodeTag
              key={i}
              x={w.pos.x}
              y={w.pos.y}
              text={w.label}
              gold={w.gold}
              opacity={seg(frame, w.t - 4, w.t + 6) * (1 - seg(frame, w.t + (w.gold ? 34 : 26), w.t + (w.gold ? 44 : 34)))}
            />
          ))}
        </Group>

        {/* ════ Beat 2 — 32 different clocks, own schedules ════ */}
        <Group opacity={b2}>
          <div
            style={{
              position: "absolute", left: 955, top: 60, fontSize: 176, fontWeight: 800, letterSpacing: -6,
              color: P.danger, opacity: Math.min(1, pop(B2[0] + 10)), fontFamily,
            }}
          >
            32
          </div>
          <div
            style={{
              position: "absolute", left: 960, top: 268, fontSize: 24, fontWeight: 700, color: P.ink,
              opacity: seg(frame, B2[0] + 22, B2[0] + 36), fontFamily,
            }}
          >
            different clocks
          </div>
          <div
            style={{
              position: "absolute", left: 960, top: 302, fontSize: 17, fontWeight: 600, color: P.muted,
              opacity: seg(frame, B2[0] + 30, B2[0] + 44), fontFamily,
            }}
          >
            6 Telegram + 26 RSS
          </div>
          <div
            style={{
              position: "absolute", left: 960, top: 338, fontSize: 18.5, fontWeight: 700, color: P.danger,
              opacity: seg(frame, B2[0] + 40, B2[0] + 54), fontFamily,
            }}
          >
            each on its own schedule
          </div>

          {CLOCK_TARGETS.map((n, i) => {
            const rot = frame * CLOCK_SPEEDS[i];
            const op = Math.min(1, pop(B2[0] + 8 + i * 5));
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: n.x - 16, top: n.y - 16, width: 32, height: 32, borderRadius: "50%",
                  background: P.card, border: `2px solid ${P.danger}`, display: "flex", alignItems: "center",
                  justifyContent: "center", opacity: op, boxShadow: cardShadow, fontFamily,
                }}
              >
                <div style={{ fontSize: 16, transform: `rotate(${rot}deg)` }}>{"🕐"}</div>
              </div>
            );
          })}
        </Group>

        {/* ════ Beat 3 — transient caption (queue/lines/tag above are persistent) ════ */}
        <Group opacity={b3}>
          <div
            style={{
              position: "absolute", left: 955, top: 460, width: 290, fontSize: 18, fontWeight: 650, color: P.accent,
              lineHeight: 1.35, opacity: Math.min(1, pop(B3[0] + 40)), fontFamily,
            }}
          >
            Two scheduled jobs feed the queue automatically
          </div>
        </Group>

        {/* ════ Beat 4 — round-robin + batching, entering with a scale push ════ */}
        <div
          style={{
            position: "absolute", inset: 0, opacity: b4,
            transform: `translateY(${b4TranslateY}px) scale(${b4Scale})`, transformOrigin: "center", fontFamily,
          }}
        >
          <div
            style={{
              position: "absolute", left: beaconX - 12, top: beaconY - 12, width: 24, height: 24, borderRadius: "50%",
              background: P.accent, opacity: beaconOp, boxShadow: `0 0 18px 6px ${P.accentEdge}`,
            }}
          />
          {BATCH_BOXES.map((box, i) => {
            const start = 585 + i * 44;
            const cx0 = (box.minX + box.maxX) / 2;
            const cy0 = (box.minY + box.maxY) / 2;
            const w0 = box.maxX - box.minX;
            const h0 = box.maxY - box.minY;
            const appear = seg(frame, start, start + 8);
            const travel = seg(frame, start + 20, start + 36, Easing.inOut(Easing.cubic));
            const fadeOut = 1 - seg(frame, start + 30, start + 40);
            const op = Math.min(appear, fadeOut);
            if (op <= 0.004) return null;
            const cx = cx0 + (ANCHOR.x - cx0) * travel;
            const cy = cy0 + (ANCHOR.y - cy0) * travel;
            const scale = 1 - 0.72 * travel;
            const w = w0 * scale;
            const h = h0 * scale;
            return (
              <div
                key={i}
                style={{
                  position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: 18,
                  background: P.accentBg, border: `2px solid ${P.accent}`, opacity: op * 0.85,
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute", left: 955, top: 462, width: 290, display: "flex", alignItems: "center", gap: 10,
              fontSize: 18, fontWeight: 700, color: P.ink,
            }}
          >
            <span style={{ fontSize: 22 }}>{"🔁"}</span>round-robin — no throttling
          </div>
          <div
            style={{
              position: "absolute", left: 955, top: 500, width: 290, display: "flex", alignItems: "center", gap: 10,
              fontSize: 18, fontWeight: 700, color: P.ink,
            }}
          >
            <span style={{ fontSize: 22 }}>{"💸"}</span>batched — fast &amp; cheap
          </div>
        </div>

        {/* ════ Beat 5 — the payoff, holds through the tail ════ */}
        <Group opacity={b5}>
          <div
            style={{
              position: "absolute", left: QUEUE.x + 20, top: QUEUE.y - 40, transform: `scale(${0.7 + 0.3 * check})`,
              transformOrigin: "left center", opacity: check,
            }}
          >
            <CheckBadge x={0} y={-6} size={40} scale={1} opacity={1} />
          </div>
          <div
            style={{
              position: "absolute", left: 0, top: 566, width: 1280, textAlign: "center",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
              opacity: finaleIn, transform: `scale(${0.94 + 0.06 * finaleIn})`, fontFamily,
            }}
          >
            <span style={{ fontSize: 44, fontWeight: 800, color: P.success }}>32 sources, one queue.</span>
          </div>
        </Group>

        {/* ════ Persistent headline — small, bottom-left, never centered, on top ════ */}
        <div
          style={{
            position: "absolute", left: 70, top: 620, fontSize: 15, fontWeight: 700, letterSpacing: 2.2,
            textTransform: "uppercase", color: P.accent, opacity: seg(frame, 20, 40), fontFamily,
          }}
        >
          Source consolidation
        </div>
        <div
          style={{
            position: "absolute", left: 70, top: 644, fontSize: 19, fontWeight: 700, color: P.ink,
            opacity: seg(frame, 20, 40), fontFamily,
          }}
        >
          32 feeds, one moderation queue
        </div>
      </PaletteProvider>
    </div>
  );
};
