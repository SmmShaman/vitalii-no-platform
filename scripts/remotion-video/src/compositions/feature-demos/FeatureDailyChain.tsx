/**
 * FeatureDailyChain — feature j66 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: scanning, scoring, and queueing ran on independent schedules with no
 * idea of each other — a vacancy found at 08:56 could sit unscored past
 * midday because scoring waited on a separate six-hour cron. worker/
 * daily_chain.sh now runs all three stages back to back through a run()
 * wrapper that reports failure but always continues to the next stage; only
 * the form-filling agent keeps its own schedule, capped by
 * max_applications_per_day.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const CRONS = { x: 90, y: 66, w: 280, h: 110 };
const STUCK = { x: 500, y: 66, w: 280, h: 110 };
const CRONS_R: Pt = { x: CRONS.x + CRONS.w, y: CRONS.y + CRONS.h / 2 };
const STUCK_L: Pt = { x: STUCK.x, y: STUCK.y + STUCK.h / 2 };

const CHAIN = { x: 465, y: 250, w: 350, h: 120 };
const CHAIN_TOP: Pt = { x: CHAIN.x + CHAIN.w / 2, y: CHAIN.y };
const CHAIN_R: Pt = { x: CHAIN.x + CHAIN.w, y: CHAIN.y + CHAIN.h / 2 };

const WRAP = { x: 870, y: 258, w: 260, h: 112 };
const WRAP_L: Pt = { x: WRAP.x, y: WRAP.y + WRAP.h / 2 };

const SEPARATE = { x: 465, y: 430, w: 350, h: 96 };
const SEPARATE_TOP: Pt = { x: SEPARATE.x + SEPARATE.w / 2, y: SEPARATE.y };
const CHAIN_BOTTOM: Pt = { x: CHAIN.x + CHAIN.w / 2, y: CHAIN.y + CHAIN.h };

const STUCK_TO_CHAIN: Pt[] = [STUCK_L, { x: STUCK_L.x - 40, y: STUCK_L.y }, CHAIN_TOP];
const CHAIN_TO_WRAP: Pt[] = [CHAIN_R, WRAP_L];
const CHAIN_TO_SEPARATE: Pt[] = [CHAIN_BOTTOM, SEPARATE_TOP];

export const FeatureDailyChain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: three independent crons, no coordination
  const cronsOp = appear(6) * lf;
  const stuckOp = appear(20) * lf;
  const stuckLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: daily_chain.sh runs scan → score → resolve in one pass
  const chainOp = appear(140, 18) * lf;
  const wrapOp = appear(158, 18) * lf;
  const chainLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const wrapLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: form-filling agent keeps its own separate schedule
  const separateOp = appear(244, 18) * lf;
  const separateLit = interpolate(frame, [252, 274, 330, 350], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={STUCK_TO_CHAIN} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={CHAIN_TO_WRAP} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={CHAIN_TO_SEPARATE} color={T.amber} width={2} dashed opacity={0.6 * t3Vis * lf} />

      <SchemaNode {...CRONS} state="danger" lit={0.2 * lf} opacity={cronsOp} label="3 independent crons" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>scan · score (6h) · queue</div>
      </SchemaNode>
      <SchemaNode {...STUCK} state="danger" lit={stuckLit} opacity={stuckOp} label="Found 08:56, unscored" fontSize={19}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>sits invisible past midday</div>
      </SchemaNode>
      <Pill x={STUCK.x + 20} y={STUCK.y - 46} dx={pill1Dx} text="no idea about each other" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...CHAIN} state="accent" lit={chainLit} opacity={chainOp} label="daily_chain.sh" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>scan → score → resolve, one pass</div>
      </SchemaNode>
      <SchemaNode {...WRAP} state="accent" lit={wrapLit} opacity={wrapOp} label="run() wrapper" fontSize={20}>
        <div style={{ fontSize: 12.5, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>reports failure, keeps going</div>
      </SchemaNode>
      <Token pts={STUCK_TO_CHAIN} t={t2} opacity={t2Vis * lf} />
      <Token pts={CHAIN_TO_WRAP} t={t2b} opacity={t2bVis * lf} />
      <Pill x={CHAIN.x + 10} y={CHAIN.y + CHAIN.h + 14} dx={pill2Dx} text="scores yesterday's leftovers too" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...SEPARATE} state="amber" lit={separateLit} opacity={separateOp} label="Form-filling agent" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>own schedule · max_applications_per_day</div>
      </SchemaNode>
      <Pill x={SEPARATE.x + 40} y={SEPARATE.y + SEPARATE.h + 12} dx={pill3Dx} text="only stage kept separate, on purpose" color={T.amber} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Scan, score, and queue ran on unrelated schedules" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="One script chains all three stages, back to back" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="A broken stage can't block the ones after it" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>no more waiting on an unrelated six-hour cron</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>scanned, scored, and queued in the same run</div>
      </div>
    </AbsoluteFill>
  );
};
