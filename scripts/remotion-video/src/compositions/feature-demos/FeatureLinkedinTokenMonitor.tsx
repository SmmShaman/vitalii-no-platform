/**
 * FeatureLinkedinTokenMonitor — feature v04 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: LinkedIn access tokens expire silently, so automated feature posts
 * would just fail without warning, discovered hours later after peak
 * engagement windows were gone → check-linkedin-token, a new Deno Edge
 * Function, makes a GET request to api.linkedin.com/v2/me using the stored
 * LINKEDIN_ACCESS_TOKEN → any 401 or non-2xx response immediately sends a
 * detailed Telegram alert with a direct token-generator link and fix
 * instructions → twice-daily automated posts are never interrupted by an
 * expired token again.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const EXPIRE = { x: 90, y: 56, w: 380, h: 90 };
const EXPIRE_R: Pt = { x: EXPIRE.x + EXPIRE.w, y: EXPIRE.y + EXPIRE.h / 2 };

const FAIL = { x: 650, y: 56, w: 380, h: 90 };
const FAIL_L: Pt = { x: FAIL.x, y: FAIL.y + FAIL.h / 2 };

const CHECK = { x: 150, y: 240, w: 380, h: 96 };
const CHECK_R: Pt = { x: CHECK.x + CHECK.w, y: CHECK.y + CHECK.h / 2 };
const CHECK_B: Pt = { x: CHECK.x + CHECK.w / 2, y: CHECK.y + CHECK.h };

const RESULT = { x: 650, y: 240, w: 380, h: 96 };
const RESULT_L: Pt = { x: RESULT.x, y: RESULT.y + RESULT.h / 2 };
const RESULT_B: Pt = { x: RESULT.x + RESULT.w / 2, y: RESULT.y + RESULT.h };

const ALERT = { x: 380, y: 410, w: 440, h: 92 };
const ALERT_T: Pt = { x: ALERT.x + ALERT.w / 2, y: ALERT.y };

const EXPIRE_TO_FAIL: Pt[] = [EXPIRE_R, FAIL_L];
const CHECK_TO_RESULT: Pt[] = [CHECK_R, RESULT_L];
const RESULT_TO_ALERT: Pt[] = [RESULT_B, { x: RESULT_B.x, y: 370 }, ALERT_T];

export const FeatureLinkedinTokenMonitor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: token expires silently, post fails hours later
  const expireOp = pop(6) * lf;
  const expireLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1 = seg(frame, 24, 48);
  const t1Vis = frame >= 24 && frame < 70 ? 1 : 0;
  const failOp = appear(30, 18) * lf;
  const failLit = interpolate(frame, [36, 58, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: check-linkedin-token calls GET /v2/me, inspects response
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const checkOp = appear(148, 18) * lf;
  const checkLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const resultOp = appear(184, 18) * lf;
  const resultLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: 401/non-2xx triggers an instant Telegram alert
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const alertOp = appear(268, 18) * lf;
  const alertLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={EXPIRE_TO_FAIL} color={T.danger} width={2.5} progress={t1} opacity={0.8 * t1Vis * lf} />
      <Connector pts={CHECK_TO_RESULT} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={RESULT_TO_ALERT} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...EXPIRE} state="danger" lit={expireLit} opacity={expireOp} label="LinkedIn token expires" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>silently, no warning</div>
      </SchemaNode>
      <SchemaNode {...FAIL} state="danger" lit={failLit} opacity={failOp} label="Post fails hours later" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>peak window already gone</div>
      </SchemaNode>
      <Token pts={EXPIRE_TO_FAIL} t={t1} color={T.danger} opacity={t1Vis * lf} />
      <Badge x={FAIL.x + FAIL.w - 20} y={FAIL.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />

      <SchemaNode {...CHECK} state="accent" lit={checkLit} opacity={checkOp} label="check-linkedin-token" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>GET api.linkedin.com/v2/me</div>
      </SchemaNode>
      <SchemaNode {...RESULT} state="accent" lit={resultLit} opacity={resultOp} label="401 or non-2xx?" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>checked before every post</div>
      </SchemaNode>
      <Token pts={CHECK_TO_RESULT} t={t2} opacity={t2Vis * lf} />
      <Pill x={CHECK.x + 10} y={CHECK.y - 46} text="LINKEDIN_ACCESS_TOKEN from Supabase secrets" color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...ALERT} state="success" lit={alertLit} opacity={alertOp} label="Instant Telegram alert" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>token link + fix instructions</div>
      </SchemaNode>
      <Token pts={RESULT_TO_ALERT} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={ALERT.x + 20} y={ALERT.y + ALERT.h + 14} text="sent to TELEGRAM_ADMIN_CHAT_ID" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Expired tokens fail silently — discovered hours after a post should've gone out" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="check-linkedin-token probes the API before it matters" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Any failure fires a Telegram alert with a direct link to fix it" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Recovery is fast and clear, not a mystery hours later</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>twice-daily posts never interrupted</div>
      </div>
    </AbsoluteFill>
  );
};
