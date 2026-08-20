/**
 * FeatureLoginWallCheck — feature j68 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: on 2026-08-06, Storebrand's Recman and Europris's Talentech forms
 * both ran the complete recon-and-fill sequence only to fail at the final
 * submit — the email was already registered. skills/form-filling/SKILL.md
 * gets phase 0b: before any recon spend, check whether the form needs login
 * at all, and if so whether the profile email is already registered. A wall
 * with IMAP access triggers a password-reset flow read over IMAP; a wall
 * without it routes straight to manual_review with a real reason logged.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BURNED = { x: 90, y: 66, w: 280, h: 110 };
const FAILED = { x: 500, y: 66, w: 280, h: 110 };
const BURNED_R: Pt = { x: BURNED.x + BURNED.w, y: BURNED.y + BURNED.h / 2 };
const FAILED_L: Pt = { x: FAILED.x, y: FAILED.y + FAILED.h / 2 };

const PHASE = { x: 465, y: 250, w: 350, h: 120 };
const PHASE_TOP: Pt = { x: PHASE.x + PHASE.w / 2, y: PHASE.y };
const PHASE_R: Pt = { x: PHASE.x + PHASE.w, y: PHASE.y + PHASE.h / 2 };

const REGISTERED = { x: 870, y: 266, w: 260, h: 96 };
const REGISTERED_L: Pt = { x: REGISTERED.x, y: REGISTERED.y + REGISTERED.h / 2 };

const IMAP = { x: 465, y: 430, w: 350, h: 96 };
const IMAP_TOP: Pt = { x: IMAP.x + IMAP.w / 2, y: IMAP.y };
const PHASE_BOTTOM: Pt = { x: PHASE.x + PHASE.w / 2, y: PHASE.y + PHASE.h };

const FAILED_TO_PHASE: Pt[] = [FAILED_L, { x: FAILED_L.x - 40, y: FAILED_L.y }, PHASE_TOP];
const PHASE_TO_REGISTERED: Pt[] = [PHASE_R, REGISTERED_L];
const PHASE_TO_IMAP: Pt[] = [PHASE_BOTTOM, IMAP_TOP];

export const FeatureLoginWallCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: two full recon runs, wasted at the final submit
  const burnedOp = appear(6) * lf;
  const failedOp = appear(20) * lf;
  const failedLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: phase 0b checks the login wall before spending anything
  const phaseOp = appear(140, 18) * lf;
  const registeredOp = appear(158, 18) * lf;
  const phaseLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const registeredLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: IMAP password-reset flow, or manual_review with a reason
  const imapOp = appear(244, 18) * lf;
  const imapLit = interpolate(frame, [252, 274, 330, 350], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const imapCheck = pop(284) * lf;
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

      <Connector pts={FAILED_TO_PHASE} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={PHASE_TO_REGISTERED} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={PHASE_TO_IMAP} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...BURNED} state="danger" lit={0.2 * lf} opacity={burnedOp} label="Storebrand + Europris" fontSize={20}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>full recon-and-fill, 2026-08-06</div>
      </SchemaNode>
      <SchemaNode {...FAILED} state="danger" lit={failedLit} opacity={failedOp} label="Fails at final submit" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>email already registered</div>
      </SchemaNode>
      <Pill x={FAILED.x + 6} y={FAILED.y - 46} dx={pill1Dx} text="every token spent, generic error" color={T.danger} opacity={pill1Op} fontSize={18} />

      <SchemaNode {...PHASE} state="accent" lit={phaseLit} opacity={phaseOp} label="SKILL.md phase 0b" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>guest submit, or a login wall?</div>
      </SchemaNode>
      <SchemaNode {...REGISTERED} state="accent" lit={registeredLit} opacity={registeredOp} label="Email registered?" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>before any recon spend</div>
      </SchemaNode>
      <Token pts={FAILED_TO_PHASE} t={t2} opacity={t2Vis * lf} />
      <Token pts={PHASE_TO_REGISTERED} t={t2b} opacity={t2bVis * lf} />
      <Pill x={PHASE.x + 16} y={PHASE.y + PHASE.h + 14} dx={pill2Dx} text="one cheap check, run first" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...IMAP} state="success" lit={imapLit} opacity={imapOp} label="IMAP password-reset" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>no IMAP → manual_review + reason</div>
      </SchemaNode>
      <Token pts={PHASE_TO_IMAP} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Badge x={IMAP.x + IMAP.w - 20} y={IMAP.y - 12} kind="check" scale={imapCheck} opacity={imapCheck} />
      <Pill x={IMAP.x + 20} y={IMAP.y + IMAP.h + 12} dx={pill3Dx} text="reads the reset email, continues" color={T.success} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="Two full recon runs failed only at the final submit click" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="A cheap login-wall check now runs before any spend" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="A registered wall triggers reset-by-IMAP, or a logged reason" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>every wall now logs a real reason, not a generic failure</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>caught in phase 0b, not at the last step</div>
      </div>
    </AbsoluteFill>
  );
};
