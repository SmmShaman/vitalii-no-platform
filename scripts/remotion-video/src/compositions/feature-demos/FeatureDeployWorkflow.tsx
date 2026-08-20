/**
 * FeatureDeployWorkflow — feature j35 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: manually deploying 14 Edge Functions, 3 needing --no-verify-jwt
 * and 11 needing JWT, is a ticking time bomb of human error → push to main
 * (paths filter on supabase/functions/**) triggers deploy-supabase-functions.yml
 * → telegram-bot/scheduled-scanner/finn-2fa-webhook deploy with
 * --no-verify-jwt, then a for-loop deploys the remaining 11 with JWT →
 * zero forgotten functions, zero misconfigured flags, under 2 minutes.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const MANUAL = { x: 440, y: 55, w: 400, h: 88, label: "manual: supabase functions deploy" };
const MANUAL_B: Pt = { x: MANUAL.x + MANUAL.w / 2, y: MANUAL.y + MANUAL.h };

const NOJWT = { x: 160, y: 200, w: 280, h: 78, label: "--no-verify-jwt" };
const JWT = { x: 840, y: 200, w: 280, h: 78, label: "requires JWT" };
const NOJWT_T: Pt = { x: NOJWT.x + NOJWT.w / 2, y: NOJWT.y };
const JWT_T: Pt = { x: JWT.x + JWT.w / 2, y: JWT.y };

const PUSH = { x: 90, y: 350, w: 260, h: 84, label: "git push main" };
const WORKFLOW = { x: 470, y: 350, w: 340, h: 84, label: "deploy-supabase-functions.yml" };
const PUSH_R: Pt = { x: PUSH.x + PUSH.w, y: PUSH.y + PUSH.h / 2 };
const WORKFLOW_L: Pt = { x: WORKFLOW.x, y: WORKFLOW.y + WORKFLOW.h / 2 };
const WORKFLOW_B: Pt = { x: WORKFLOW.x + WORKFLOW.w / 2, y: WORKFLOW.y + WORKFLOW.h };

const RESULT = { x: 440, y: 500, w: 400, h: 80 };
const RESULT_T: Pt = { x: RESULT.x + RESULT.w / 2, y: RESULT.y };

export const FeatureDeployWorkflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): 14 functions, 3 need --no-verify-jwt, mixing them up = outage ──
  const manualOp = Math.min(1, pop(6)) * lf;
  const manualLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tNj = seg(frame, 26, 50);
  const tNjVis = frame >= 26 && frame < 96 ? 1 : 0;
  const tJw = seg(frame, 32, 56);
  const tJwVis = frame >= 32 && frame < 96 ? 1 : 0;
  const nojwtOp = appear(34, 18) * lf;
  const jwtOp = appear(40, 18) * lf;
  const xScale = pop(66) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const errorPillIn = seg(frame, 60, 82, Easing.out(Easing.cubic));
  const errorPillOp = errorPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): git push main → deploy-supabase-functions.yml ──
  const pushOp = appear(134, 18) * lf;
  const pushLit = interpolate(frame, [134, 156, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tPw = seg(frame, 152, 178);
  const tPwVis = frame >= 152 && frame < 202 ? 1 : 0;
  const workflowOp = appear(168, 18) * lf;
  const workflowLit = interpolate(frame, [176, 198, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pathPillIn = seg(frame, 182, 204, Easing.out(Easing.cubic));
  const pathPillOp = pathPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): 3 no-jwt deploy first, then a for-loop deploys the other 11 ──
  const tWr = seg(frame, 250, 274);
  const tWrVis = frame >= 250 && frame < 300 ? 1 : 0;
  const resultOp = appear(266, 18) * lf;
  const resultLit = interpolate(frame, [274, 296, 330, 350], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const loopPillIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const loopPillOp = loopPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[MANUAL_B, NOJWT_T]} color={T.danger} width={2.5} progress={tNj} opacity={0.8 * tNjVis * lf} />
      <Connector pts={[MANUAL_B, JWT_T]} color={T.danger} width={2.5} progress={tJw} opacity={0.8 * tJwVis * lf} />
      <Connector pts={[PUSH_R, WORKFLOW_L]} color={T.accent} width={2.5} progress={tPw} opacity={0.8 * tPwVis * lf} />
      <Connector pts={[WORKFLOW_B, RESULT_T]} color={T.success} width={2.5} progress={tWr} opacity={0.8 * tWrVis * lf} />

      <SchemaNode {...MANUAL} state="danger" lit={manualLit} opacity={manualOp} label={MANUAL.label} fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>14 functions, one flag each</div>
      </SchemaNode>
      <SchemaNode {...NOJWT} state="danger" lit={0.4 * nojwtOp * lf} opacity={nojwtOp} label={NOJWT.label} fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>3 functions</div>
      </SchemaNode>
      <SchemaNode {...JWT} state="danger" lit={0.4 * jwtOp * lf} opacity={jwtOp} label={JWT.label} fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>11 functions</div>
      </SchemaNode>
      <Token pts={[MANUAL_B, NOJWT_T]} t={tNj} color={T.danger} opacity={tNjVis * lf} />
      <Token pts={[MANUAL_B, JWT_T]} t={tJw} color={T.danger} opacity={tJwVis * lf} />
      <Badge x={640 - 18} y={NOJWT.y + NOJWT.h + 10} kind="cross" scale={xScale} opacity={xScale} size={30} />
      <Pill x={430} y={NOJWT.y + NOJWT.h + 58} dx={0} text="wrong flag = broken webhook, production outage" color={T.danger} opacity={errorPillOp} fontSize={16} />

      <SchemaNode {...PUSH} state="accent" lit={pushLit} opacity={pushOp} label={PUSH.label} fontSize={20} />
      <SchemaNode {...WORKFLOW} state="accent" lit={workflowLit} opacity={workflowOp} label={WORKFLOW.label} fontSize={17} />
      <Token pts={[PUSH_R, WORKFLOW_L]} t={tPw} opacity={tPwVis * lf} />
      <Pill x={WORKFLOW.x + 20} y={WORKFLOW.y - 46} text="paths: supabase/functions/**" color={T.accent} opacity={pathPillOp} fontSize={16} />

      <SchemaNode {...RESULT} state="success" lit={resultLit} opacity={resultOp} label="All 14 functions deployed" fontSize={20} />
      <Token pts={[WORKFLOW_B, RESULT_T]} t={tWr} color={T.success} opacity={tWrVis * lf} />
      <Pill x={RESULT.x - 10} y={RESULT.y + RESULT.h + 14} text="3 --no-verify-jwt first, then a for-loop for the rest" color={T.success} opacity={loopPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="14 functions, 3 needing a special flag — one mistake breaks production" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A push to main, filtered by path, triggers the deploy workflow itself" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The JWT/no-JWT logic is codified in the pipeline, not remembered by hand" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Zero forgotten functions, zero misconfigured flags</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Production updated reliably, under 2 minutes</div>
      </div>
    </AbsoluteFill>
  );
};
