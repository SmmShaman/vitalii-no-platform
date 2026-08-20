/**
 * FeatureOneButtonRecon — feature j69 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: recon on a brand-new ATS host costs ~6.8M tokens, so the fill-queue
 * poller only released cached platforms, or a new one via a manually created
 * RECON_ALLOWED file — but every application already required the owner's
 * card-button press to enter the queue, making that a second approval for
 * the same decision. POLICY v8 in patch-agent-pollers.cjs switches the fill
 * pool to the full unfiltered set once a row is card-approved; SKILL.md
 * phase 0 treats an uncached host as simply a platform to recon this run.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const CARD = { x: 90, y: 66, w: 280, h: 110 };
const FLAG = { x: 500, y: 66, w: 280, h: 110 };
const CARD_R: Pt = { x: CARD.x + CARD.w, y: CARD.y + CARD.h / 2 };
const FLAG_L: Pt = { x: FLAG.x, y: FLAG.y + FLAG.h / 2 };

const POLICY = { x: 465, y: 250, w: 350, h: 120 };
const POLICY_TOP: Pt = { x: POLICY.x + POLICY.w / 2, y: POLICY.y };
const POLICY_R: Pt = { x: POLICY.x + POLICY.w, y: POLICY.y + POLICY.h / 2 };

const PHASE0 = { x: 870, y: 266, w: 260, h: 96 };
const PHASE0_L: Pt = { x: PHASE0.x, y: PHASE0.y + PHASE0.h / 2 };

const LEGACY = { x: 465, y: 430, w: 350, h: 96 };
const LEGACY_TOP: Pt = { x: LEGACY.x + LEGACY.w / 2, y: LEGACY.y };
const POLICY_BOTTOM: Pt = { x: POLICY.x + POLICY.w / 2, y: POLICY.y + POLICY.h };

const FLAG_TO_POLICY: Pt[] = [FLAG_L, { x: FLAG_L.x - 40, y: FLAG_L.y }, POLICY_TOP];
const POLICY_TO_PHASE0: Pt[] = [POLICY_R, PHASE0_L];
const POLICY_TO_LEGACY: Pt[] = [POLICY_BOTTOM, LEGACY_TOP];

export const FeatureOneButtonRecon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: two separate approvals for the same decision
  const cardOp = appear(6) * lf;
  const flagOp = appear(20) * lf;
  const flagLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: POLICY v8 unifies the two gates into one
  const policyOp = appear(140, 18) * lf;
  const phase0Op = appear(158, 18) * lf;
  const policyLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const phase0Lit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: RECON_ALLOWED kept only as a dormant legacy override
  const legacyOp = appear(244, 18) * lf;
  const legacyLit = interpolate(frame, [252, 274, 330, 350], [0, 0.4, 0.4, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={FLAG_TO_POLICY} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={POLICY_TO_PHASE0} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={POLICY_TO_LEGACY} color={T.amber} width={2} dashed opacity={0.6 * t3Vis * lf} />

      <SchemaNode {...CARD} state="danger" lit={0.2 * lf} opacity={cardOp} label="Card button press" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>already approves the job</div>
      </SchemaNode>
      <SchemaNode {...FLAG} state="danger" lit={flagLit} opacity={flagOp} label="RECON_ALLOWED file" fontSize={20}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>separate manual step</div>
      </SchemaNode>
      <Pill x={FLAG.x + 20} y={FLAG.y - 46} dx={pill1Dx} text="two approvals, one decision" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...POLICY} state="accent" lit={policyLit} opacity={policyOp} label="POLICY v8" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>fill pool: full unfiltered set</div>
      </SchemaNode>
      <SchemaNode {...PHASE0} state="accent" lit={phase0Lit} opacity={phase0Op} label="phase 0 rewritten" fontSize={18}>
        <div style={{ fontSize: 12.5, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>uncached host = recon this run</div>
      </SchemaNode>
      <Token pts={FLAG_TO_POLICY} t={t2} opacity={t2Vis * lf} />
      <Token pts={POLICY_TO_PHASE0} t={t2b} opacity={t2bVis * lf} />
      <Pill x={POLICY.x + 20} y={POLICY.y + POLICY.h + 14} dx={pill2Dx} text="every approved row is eligible" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...LEGACY} state="amber" lit={legacyLit} opacity={legacyOp} label="RECON_ALLOWED stays" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>dormant legacy override only</div>
      </SchemaNode>
      <Pill x={LEGACY.x + 30} y={LEGACY.y + LEGACY.h + 12} dx={pill3Dx} text="nothing checks it as required" color={T.amber} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="A card press and a manual flag gated the same recon" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="POLICY v8: card approval alone unlocks the full pool" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="The old flag survives, unused, as a legacy override" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>POLICY v7 (07-29) → POLICY v8 (08-06)</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>one button now covers both approvals</div>
      </div>
    </AbsoluteFill>
  );
};
