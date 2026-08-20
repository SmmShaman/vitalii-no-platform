/**
 * FeatureReconGatedWake — feature j63 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: recon of a new ATS site costs ~6.8M tokens, measured across three
 * sites on 2026-07-26 alone — and any row reaching the fill queue could
 * trigger it, cached or not. Commit b514cb2 bumps patch-agent-pollers.cjs to
 * POLICY v7: it lists cached fill scripts, extracts each row's host, and
 * only sends cached-host rows to the agent unless a RECON_ALLOWED flag
 * exists — uncached rows are counted separately instead.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ANYROW = { x: 90, y: 66, w: 280, h: 110 };
const COST = { x: 500, y: 66, w: 280, h: 110 };
const ANYROW_R: Pt = { x: ANYROW.x + ANYROW.w, y: ANYROW.y + ANYROW.h / 2 };
const COST_L: Pt = { x: COST.x, y: COST.y + COST.h / 2 };

const POLICY = { x: 465, y: 250, w: 350, h: 120 };
const POLICY_TOP: Pt = { x: POLICY.x + POLICY.w / 2, y: POLICY.y };
const POLICY_R: Pt = { x: POLICY.x + POLICY.w, y: POLICY.y + POLICY.h / 2 };

const CACHED = { x: 870, y: 266, w: 260, h: 96 };
const CACHED_L: Pt = { x: CACHED.x, y: CACHED.y + CACHED.h / 2 };

const FLAG = { x: 465, y: 430, w: 350, h: 96 };
const FLAG_TOP: Pt = { x: FLAG.x + FLAG.w / 2, y: FLAG.y };
const POLICY_BOTTOM: Pt = { x: POLICY.x + POLICY.w / 2, y: POLICY.y + POLICY.h };

const COST_TO_POLICY: Pt[] = [COST_L, { x: COST_L.x - 40, y: COST_L.y }, POLICY_TOP];
const POLICY_TO_CACHED: Pt[] = [POLICY_R, CACHED_L];
const POLICY_TO_FLAG: Pt[] = [POLICY_BOTTOM, FLAG_TOP];

export const FeatureReconGatedWake: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: any row could trigger recon, cached or not
  const anyrowOp = appear(6) * lf;
  const costOp = appear(20) * lf;
  const costLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: POLICY v7 checks cached scripts, extracts host
  const policyOp = appear(140, 18) * lf;
  const cachedOp = appear(158, 18) * lf;
  const policyLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const cachedLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: RECON_ALLOWED flag governs uncached hosts, counted separately
  const flagOp = appear(244, 18) * lf;
  const flagLit = interpolate(frame, [252, 274, 330, 350], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={COST_TO_POLICY} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={POLICY_TO_CACHED} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={POLICY_TO_FLAG} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...ANYROW} state="danger" lit={0.2 * lf} opacity={anyrowOp} label="Any fill-queue row" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>cached or brand-new, same path</div>
      </SchemaNode>
      <SchemaNode {...COST} state="danger" lit={costLit} opacity={costOp} label="~6.8M tokens" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>3 sites · 2026-07-26</div>
      </SchemaNode>
      <Pill x={COST.x + 24} y={COST.y - 46} dx={pill1Dx} text="recon triggers on any row" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...POLICY} state="accent" lit={policyLit} opacity={policyOp} label="POLICY v7" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>lists cached form-scripts, extracts host</div>
      </SchemaNode>
      <SchemaNode {...CACHED} state="accent" lit={cachedLit} opacity={cachedOp} label="Host cached?" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>only then goes to the agent</div>
      </SchemaNode>
      <Token pts={COST_TO_POLICY} t={t2} opacity={t2Vis * lf} />
      <Token pts={POLICY_TO_CACHED} t={t2b} opacity={t2bVis * lf} />
      <Pill x={POLICY.x + 20} y={POLICY.y + POLICY.h + 14} dx={pill2Dx} text="ls /workspace/agent/form-scripts" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...FLAG} state="amber" lit={flagLit} opacity={flagOp} label="RECON_ALLOWED flag" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>else: awaiting_recon_total / hosts</div>
      </SchemaNode>
      <Token pts={POLICY_TO_FLAG} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={FLAG.x + 40} y={FLAG.y + FLAG.h + 12} dx={pill3Dx} text="new hosts need explicit permission" color={T.amber} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="Any row reaching the queue could trigger a fresh recon" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="The poller checks the cache and each row's host first" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Uncached hosts wait on a flag, reported by count and name" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>the poller reports exactly what's waiting on that decision</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>woken only for forms it's already solved</div>
      </div>
    </AbsoluteFill>
  );
};
