/**
 * FeatureStaleSweep — feature j64 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: unresolvable applications used to linger forever — a search that
 * found nothing just left a note and kept getting retried, and a row stuck
 * on a broken search channel (Google AUP-flagged, DuckDuckGo rate-limited)
 * had no upper bound at all. ats_resolver.py gains sweep_stale(): rows older
 * than a configurable cutoff (default 24h) move to manual_review with a
 * logged reason — nothing deleted, the Telegram card still works.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const RETRIED = { x: 90, y: 66, w: 280, h: 110 };
const NOBOUND = { x: 500, y: 66, w: 280, h: 110 };
const RETRIED_R: Pt = { x: RETRIED.x + RETRIED.w, y: RETRIED.y + RETRIED.h / 2 };
const NOBOUND_L: Pt = { x: NOBOUND.x, y: NOBOUND.y + NOBOUND.h / 2 };

const SWEEP = { x: 465, y: 250, w: 350, h: 120 };
const SWEEP_TOP: Pt = { x: SWEEP.x + SWEEP.w / 2, y: SWEEP.y };
const SWEEP_R: Pt = { x: SWEEP.x + SWEEP.w, y: SWEEP.y + SWEEP.h / 2 };

const REVIEW = { x: 870, y: 266, w: 260, h: 96 };
const REVIEW_L: Pt = { x: REVIEW.x, y: REVIEW.y + REVIEW.h / 2 };

const KEPT = { x: 465, y: 430, w: 350, h: 96 };
const KEPT_TOP: Pt = { x: KEPT.x + KEPT.w / 2, y: KEPT.y };
const SWEEP_BOTTOM: Pt = { x: SWEEP.x + SWEEP.w / 2, y: SWEEP.y + SWEEP.h };

const NOBOUND_TO_SWEEP: Pt[] = [NOBOUND_L, { x: NOBOUND_L.x - 40, y: NOBOUND_L.y }, SWEEP_TOP];
const SWEEP_TO_REVIEW: Pt[] = [SWEEP_R, REVIEW_L];
const SWEEP_TO_KEPT: Pt[] = [SWEEP_BOTTOM, KEPT_TOP];

export const FeatureStaleSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: unresolvable rows linger forever
  const retriedOp = appear(6) * lf;
  const noboundOp = appear(20) * lf;
  const noboundLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: sweep_stale() with a configurable cutoff
  const sweepOp = appear(140, 18) * lf;
  const reviewOp = appear(158, 18) * lf;
  const sweepLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const reviewLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: nothing deleted, Telegram card still works
  const keptOp = appear(244, 18) * lf;
  const keptLit = interpolate(frame, [252, 274, 330, 350], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={NOBOUND_TO_SWEEP} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={SWEEP_TO_REVIEW} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={SWEEP_TO_KEPT} color={T.amber} width={2} dashed opacity={0.6 * t3Vis * lf} />

      <SchemaNode {...RETRIED} state="danger" lit={0.2 * lf} opacity={retriedOp} label="Found nothing, retried" fontSize={19}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>note written, row stays</div>
      </SchemaNode>
      <SchemaNode {...NOBOUND} state="danger" lit={noboundLit} opacity={noboundOp} label="No upper bound" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Google AUP-flagged · DDG rate-limited</div>
      </SchemaNode>
      <Pill x={NOBOUND.x + 20} y={NOBOUND.y - 46} dx={pill1Dx} text="unworkable rows bury the rest" color={T.danger} opacity={pill1Op} fontSize={18} />

      <SchemaNode {...SWEEP} state="accent" lit={sweepLit} opacity={sweepOp} label="sweep_stale()" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>24h cutoff · RESOLVER_SKIP_AFTER_HOURS</div>
      </SchemaNode>
      <SchemaNode {...REVIEW} state="accent" lit={reviewLit} opacity={reviewOp} label="manual_review" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>error_message explains why</div>
      </SchemaNode>
      <Token pts={NOBOUND_TO_SWEEP} t={t2} opacity={t2Vis * lf} />
      <Token pts={SWEEP_TO_REVIEW} t={t2b} opacity={t2bVis * lf} />
      <Pill x={SWEEP.x + 6} y={SWEEP.y + SWEEP.h + 14} dx={pill2Dx} text="empty search result also moves it" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...KEPT} state="amber" lit={keptLit} opacity={keptOp} label="Nothing deleted" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Telegram card still works, push by hand</div>
      </SchemaNode>
      <Pill x={KEPT.x + 50} y={KEPT.y + KEPT.h + 12} dx={pill3Dx} text="owner can still act on it" color={T.amber} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="Unworkable jobs sat in the queue with no way out" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Stale rows get swept out to manual_review after a cutoff" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Nothing is lost — the card still works for a manual push" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>surfaced once, flagged, never re-tried every run</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>the active queue only holds jobs it can move</div>
      </div>
    </AbsoluteFill>
  );
};
