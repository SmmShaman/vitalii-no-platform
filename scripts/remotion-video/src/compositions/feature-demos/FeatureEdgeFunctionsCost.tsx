/**
 * FeatureEdgeFunctionsCost — feature p23 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: traffic spikes unpredictably but idles 95% of the time — paying for
 * an always-on server felt like burning cash → 43 Deno Edge Functions, each
 * its own microservice at supabase/functions/<name>/index.ts, share common
 * code through 10 helper files in _shared/ → each redeploys independently
 * in ~10 seconds via `supabase functions deploy --no-verify-jwt` → "$0/month
 * on the free tier, cold starts under 500ms".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SERVER = { x: 465, y: 56, w: 350, h: 96 };
const SERVER_BOTTOM: Pt = { x: SERVER.x + SERVER.w / 2, y: SERVER.y + SERVER.h };

const FUNCS = { x: 465, y: 220, w: 350, h: 100 };
const FUNCS_TOP: Pt = { x: FUNCS.x + FUNCS.w / 2, y: FUNCS.y };
const FUNCS_L: Pt = { x: FUNCS.x, y: FUNCS.y + FUNCS.h / 2 };
const FUNCS_BOTTOM: Pt = { x: FUNCS.x + FUNCS.w / 2, y: FUNCS.y + FUNCS.h };

const SHARED = { x: 850, y: 232, w: 260, h: 76 };
const SHARED_L: Pt = { x: SHARED.x, y: SHARED.y + SHARED.h / 2 };

const DEPLOY = { x: 465, y: 420, w: 350, h: 96 };
const DEPLOY_TOP: Pt = { x: DEPLOY.x + DEPLOY.w / 2, y: DEPLOY.y };

const SERVER_TO_FUNCS: Pt[] = [SERVER_BOTTOM, FUNCS_TOP];
const FUNCS_TO_SHARED: Pt[] = [FUNCS_L, SHARED_L];
const FUNCS_TO_DEPLOY: Pt[] = [FUNCS_BOTTOM, DEPLOY_TOP];

export const FeatureEdgeFunctionsCost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): always-on server, idle 95% of the time ──
  const srvOp = appear(6) * lf;
  const srvLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): 43 microservices, shared utilities ──
  const funcsOp = appear(140, 18) * lf;
  const funcsLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const sharedOp = appear(190, 16) * lf;
  const sharedLit = interpolate(frame, [198, 220, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2b = seg(frame, 192, 216);
  const t2bVis = frame >= 192 && frame < 236 ? 1 : 0;
  const pill2In = seg(frame, 198, 220, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): isolated ~10s deploys, version logging ──
  const depOp = appear(244, 18) * lf;
  const depLit = interpolate(frame, [252, 274, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={SERVER_TO_FUNCS} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={FUNCS_TO_SHARED} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={FUNCS_TO_DEPLOY} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...SERVER} state="danger" lit={srvLit} opacity={srvOp} label="Always-on server" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>idle 95% of the time</div>
      </SchemaNode>
      <Pill x={SERVER.x + 30} y={SERVER.y + SERVER.h + 14} dx={pill1Dx} text="paying to do nothing, most of the day" color={T.danger} opacity={pill1Op} fontSize={17} />

      <SchemaNode {...FUNCS} state="accent" lit={funcsLit} opacity={funcsOp} label="43 Deno Edge Functions" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>supabase/functions/&lt;name&gt;/index.ts</div>
      </SchemaNode>
      <Token pts={SERVER_TO_FUNCS} t={t2} opacity={t2Vis * lf} />
      <Pill x={FUNCS.x + 10} y={FUNCS.y - 46} dx={pill2Dx} text="scale to zero — no idle cost" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...SHARED} state="accent" lit={sharedLit} opacity={sharedOp} label="_shared/" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>10 helper files, no duplication</div>
      </SchemaNode>
      <Token pts={FUNCS_TO_SHARED} t={t2b} opacity={t2bVis * lf} />

      <SchemaNode {...DEPLOY} state="success" lit={depLit} opacity={depOp} label="functions deploy --no-verify-jwt" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>isolated, ~10 seconds each</div>
      </SchemaNode>
      <Token pts={FUNCS_TO_DEPLOY} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={DEPLOY.x + 20} y={DEPLOY.y + DEPLOY.h + 12} dx={pill3Dx} text="each logs its own version" color={T.success} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="Traffic spikes hard, then sits idle — always-on felt wasteful" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="43 independent microservices share code, not compute" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Any single function redeploys without touching the rest" color={T.success} opacity={cap3} fontSize={24} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>$0/month backend, cold starts under 500ms</div>
      </div>
    </AbsoluteFill>
  );
};
