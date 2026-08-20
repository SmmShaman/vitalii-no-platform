/**
 * FeaturePerPlatformConsent — feature j70 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: POLICY v8 (j69) let one button both approve a job and grant
 * permission to explore its form — convenient, but a single LinkedIn tap
 * could commit to a form the bot hadn't inspected, while NAV/FINN's more
 * predictable forms stayed stuck behind the same manual gate. POLICY v9
 * splits trust by platform: LinkedIn now needs explicit review before any
 * exploration, while NAV/FINN regain an auto_soknad_min_score queue —
 * still gated at the final send by skyvern_metadata.owner_confirmed.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ONEBTN = { x: 90, y: 66, w: 280, h: 110 };
const SLOWED = { x: 500, y: 66, w: 280, h: 110 };
const ONEBTN_R: Pt = { x: ONEBTN.x + ONEBTN.w, y: ONEBTN.y + ONEBTN.h / 2 };
const SLOWED_L: Pt = { x: SLOWED.x, y: SLOWED.y + SLOWED.h / 2 };

const POLICY = { x: 465, y: 250, w: 350, h: 120 };
const POLICY_TOP: Pt = { x: POLICY.x + POLICY.w / 2, y: POLICY.y };
const POLICY_R: Pt = { x: POLICY.x + POLICY.w, y: POLICY.y + POLICY.h / 2 };

const LINKEDIN = { x: 870, y: 266, w: 260, h: 96 };
const LINKEDIN_L: Pt = { x: LINKEDIN.x, y: LINKEDIN.y + LINKEDIN.h / 2 };

const NAVFINN = { x: 465, y: 430, w: 350, h: 96 };
const NAVFINN_TOP: Pt = { x: NAVFINN.x + NAVFINN.w / 2, y: NAVFINN.y };
const POLICY_BOTTOM: Pt = { x: POLICY.x + POLICY.w / 2, y: POLICY.y + POLICY.h };

const SLOWED_TO_POLICY: Pt[] = [SLOWED_L, { x: SLOWED_L.x - 40, y: SLOWED_L.y }, POLICY_TOP];
const POLICY_TO_LINKEDIN: Pt[] = [POLICY_R, LINKEDIN_L];
const POLICY_TO_NAVFINN: Pt[] = [POLICY_BOTTOM, NAVFINN_TOP];

export const FeaturePerPlatformConsent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: one button, wrong for both LinkedIn and NAV/FINN
  const onebtnOp = appear(6) * lf;
  const slowedOp = appear(20) * lf;
  const slowedLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: POLICY v9 splits trust by platform
  const policyOp = appear(140, 18) * lf;
  const linkedinOp = appear(158, 18) * lf;
  const policyLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const linkedinLit = interpolate(frame, [186, 208, 330, 350], [0, 0.65, 0.65, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: NAV/FINN regain an auto queue, still gated at final send
  const navfinnOp = appear(244, 18) * lf;
  const navfinnLit = interpolate(frame, [252, 274, 330, 350], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const navfinnCheck = pop(284) * lf;
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

      <Connector pts={SLOWED_TO_POLICY} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={POLICY_TO_LINKEDIN} color={T.danger} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={POLICY_TO_NAVFINN} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...ONEBTN} state="danger" lit={0.2 * lf} opacity={onebtnOp} label="One button, two jobs" fontSize={20}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>approve + explore, same tap</div>
      </SchemaNode>
      <SchemaNode {...SLOWED} state="danger" lit={slowedLit} opacity={slowedOp} label="NAV/FINN gated too" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>slowed the safest platforms</div>
      </SchemaNode>
      <Pill x={SLOWED.x + 4} y={SLOWED.y - 46} dx={pill1Dx} text="LinkedIn tap risked an uninspected form" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...POLICY} state="accent" lit={policyLit} opacity={policyOp} label="POLICY v9" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>trust split, per platform</div>
      </SchemaNode>
      <SchemaNode {...LINKEDIN} state="danger" lit={linkedinLit} opacity={linkedinOp} label="LinkedIn: review first" fontSize={18}>
        <div style={{ fontSize: 12.5, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>shortcut removed</div>
      </SchemaNode>
      <Token pts={SLOWED_TO_POLICY} t={t2} opacity={t2Vis * lf} />
      <Token pts={POLICY_TO_LINKEDIN} t={t2b} color={T.danger} opacity={t2bVis * lf} />
      <Pill x={POLICY.x + 30} y={POLICY.y + POLICY.h + 14} dx={pill2Dx} text="a human look before the form is touched" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...NAVFINN} state="success" lit={navfinnLit} opacity={navfinnOp} label="NAV/FINN: auto queue back" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>owner_confirmed still gates send</div>
      </SchemaNode>
      <Token pts={POLICY_TO_NAVFINN} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Badge x={NAVFINN.x + NAVFINN.w - 20} y={NAVFINN.y - 12} kind="check" scale={navfinnCheck} opacity={navfinnCheck} />
      <Pill x={NAVFINN.x + 20} y={NAVFINN.y + NAVFINN.h + 12} dx={pill3Dx} text="score clears the bar, queue moves fast" color={T.success} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="One shortcut approved a job and unlocked exploring its form" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="LinkedIn now always needs a human look, no shortcut left" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="NAV and FINN move fast again, still gated at the final send" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>RECON_ALLOWED governs opening a form before consent</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>trust scoped per platform, and per job</div>
      </div>
    </AbsoluteFill>
  );
};
