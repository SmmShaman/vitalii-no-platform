/**
 * FeaturePerSourceThreshold — feature j65 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every source used the same auto-apply score bar, but a LinkedIn
 * posting has no application form attached — acting on it means expensive
 * search-and-resolve first — while NAV and FINN hand over a working apply
 * URL directly. analyze_worker.py gains AUTO_SOKNAD_MIN_BY_SOURCE, a
 * per-source threshold map with LinkedIn at 85 (post-rescore, meaning every
 * significant requirement is met) while NAV/FINN keep the normal minimum.
 * Jobs above the normal bar but below LinkedIn's still get a Telegram card
 * for manual confirmation — the threshold only gates automation.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SAMEBAR = { x: 90, y: 66, w: 280, h: 110 };
const EXPENSIVE = { x: 500, y: 66, w: 280, h: 110 };
const SAMEBAR_R: Pt = { x: SAMEBAR.x + SAMEBAR.w, y: SAMEBAR.y + SAMEBAR.h / 2 };
const EXPENSIVE_L: Pt = { x: EXPENSIVE.x, y: EXPENSIVE.y + EXPENSIVE.h / 2 };

const MAP = { x: 465, y: 250, w: 350, h: 120 };
const MAP_TOP: Pt = { x: MAP.x + MAP.w / 2, y: MAP.y };
const MAP_R: Pt = { x: MAP.x + MAP.w, y: MAP.y + MAP.h / 2 };

const SPLIT = { x: 870, y: 258, w: 260, h: 112 };
const SPLIT_L: Pt = { x: SPLIT.x, y: SPLIT.y + SPLIT.h / 2 };

const CARD = { x: 465, y: 430, w: 350, h: 96 };
const CARD_TOP: Pt = { x: CARD.x + CARD.w / 2, y: CARD.y };
const MAP_BOTTOM: Pt = { x: MAP.x + MAP.w / 2, y: MAP.y + MAP.h };

const EXPENSIVE_TO_MAP: Pt[] = [EXPENSIVE_L, { x: EXPENSIVE_L.x - 40, y: EXPENSIVE_L.y }, MAP_TOP];
const MAP_TO_SPLIT: Pt[] = [MAP_R, SPLIT_L];
const MAP_TO_CARD: Pt[] = [MAP_BOTTOM, CARD_TOP];

export const FeaturePerSourceThreshold: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: same threshold for every source
  const samebarOp = appear(6) * lf;
  const expensiveOp = appear(20) * lf;
  const expensiveLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: per-source threshold map
  const mapOp = appear(140, 18) * lf;
  const splitOp = appear(158, 18) * lf;
  const mapLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const splitLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: below LinkedIn's bar but above normal min → still a Telegram card
  const cardOp = appear(244, 18) * lf;
  const cardLit = interpolate(frame, [252, 274, 330, 350], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={EXPENSIVE_TO_MAP} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={MAP_TO_SPLIT} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={MAP_TO_CARD} color={T.amber} width={2} dashed opacity={0.6 * t3Vis * lf} />

      <SchemaNode {...SAMEBAR} state="danger" lit={0.2 * lf} opacity={samebarOp} label="Same score bar" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>LinkedIn = NAV = FINN</div>
      </SchemaNode>
      <SchemaNode {...EXPENSIVE} state="danger" lit={expensiveLit} opacity={expensiveOp} label="LinkedIn: no direct form" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>needs search + resolve first</div>
      </SchemaNode>
      <Pill x={EXPENSIVE.x + 6} y={EXPENSIVE.y - 46} dx={pill1Dx} text="expensive work on weak matches" color={T.danger} opacity={pill1Op} fontSize={17} />

      <SchemaNode {...MAP} state="accent" lit={mapLit} opacity={mapOp} label="AUTO_SOKNAD_MIN_BY_SOURCE" fontSize={19}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>per-source threshold map</div>
      </SchemaNode>
      <SchemaNode {...SPLIT} state="accent" lit={splitLit} opacity={splitOp} label="LINKEDIN: 85" fontSize={20}>
        <div style={{ fontSize: 12.5, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>NAV / FINN: normal min (60)</div>
      </SchemaNode>
      <Token pts={EXPENSIVE_TO_MAP} t={t2} opacity={t2Vis * lf} />
      <Token pts={MAP_TO_SPLIT} t={t2b} opacity={t2bVis * lf} />
      <Pill x={MAP.x + 30} y={MAP.y + MAP.h + 14} dx={pill2Dx} text="85 now means every requirement met" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...CARD} state="amber" lit={cardLit} opacity={cardOp} label="Between 60 and 85" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>still gets a Telegram card</div>
      </SchemaNode>
      <Pill x={CARD.x + 30} y={CARD.y + CARD.h + 12} dx={pill3Dx} text="manual confirmation, not blocked" color={T.amber} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="One bar for every source, no matter the cost behind it" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="LinkedIn needs a much higher score before automation runs" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="The threshold gates automation, never the user's own tap" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>NAV and FINN still clear the normal bar at 60</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 640,
          width: 1280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: finalCap,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.success,
            color: "#12321c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 21,
            fontWeight: 700,
            transform: `scale(${finalCheck})`,
            boxShadow: `0 0 16px ${hexA(T.success, 0.5)}`,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>LinkedIn auto-applies now score 85+</div>
      </div>
    </AbsoluteFill>
  );
};
