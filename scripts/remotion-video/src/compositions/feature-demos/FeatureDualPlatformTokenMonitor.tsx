/**
 * FeatureDualPlatformTokenMonitor — feature v07 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: the token-expiry monitor only ever watched LinkedIn — a Facebook
 * Page token could expire with zero warning, the first sign being a failed
 * post in production, exactly the blind spot the LinkedIn monitor was built
 * to close → check-linkedin-token now runs both checks in one invocation:
 * LinkedIn moved off the deprecated /v2/me to /v2/userinfo, and a new
 * Facebook check hits the Graph API with FACEBOOK_PAGE_ACCESS_TOKEN and
 * FACEBOOK_PAGE_ID → both results collect into a combined
 * { linkedin, facebook } object, and either platform failing 401 fires its
 * own alert through the same sendTelegramAlert() path.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BLINDSPOT = { x: 350, y: 46, w: 580, h: 104 };
const BLINDSPOT_BL: Pt = { x: BLINDSPOT.x + 100, y: BLINDSPOT.y + BLINDSPOT.h };
const BLINDSPOT_BR: Pt = { x: BLINDSPOT.x + BLINDSPOT.w - 100, y: BLINDSPOT.y + BLINDSPOT.h };

const LI_CHECK = { x: 90, y: 226, w: 380, h: 96 };
const LI_CHECK_T: Pt = { x: LI_CHECK.x + LI_CHECK.w / 2, y: LI_CHECK.y };
const LI_CHECK_B: Pt = { x: LI_CHECK.x + LI_CHECK.w / 2, y: LI_CHECK.y + LI_CHECK.h };

const FB_CHECK = { x: 810, y: 226, w: 380, h: 96 };
const FB_CHECK_T: Pt = { x: FB_CHECK.x + FB_CHECK.w / 2, y: FB_CHECK.y };
const FB_CHECK_B: Pt = { x: FB_CHECK.x + FB_CHECK.w / 2, y: FB_CHECK.y + FB_CHECK.h };

const COMBINED = { x: 380, y: 400, w: 440, h: 92 };
const COMBINED_TL: Pt = { x: COMBINED.x + 60, y: COMBINED.y };
const COMBINED_TR: Pt = { x: COMBINED.x + COMBINED.w - 60, y: COMBINED.y };

const BLIND_TO_LI: Pt[] = [BLINDSPOT_BL, LI_CHECK_T];
const BLIND_TO_FB: Pt[] = [BLINDSPOT_BR, FB_CHECK_T];
const LI_TO_COMBINED: Pt[] = [LI_CHECK_B, COMBINED_TL];
const FB_TO_COMBINED: Pt[] = [FB_CHECK_B, COMBINED_TR];

export const FeatureDualPlatformTokenMonitor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: Facebook token had zero warning
  const blindOp = pop(6) * lf;
  const blindLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: both checks run in the same invocation
  const t2a = seg(frame, 152, 178);
  const t2aVis = frame >= 152 && frame < 200 ? 1 : 0;
  const t2b = seg(frame, 156, 182);
  const t2bVis = frame >= 156 && frame < 204 ? 1 : 0;
  const liOp = appear(148, 18) * lf;
  const liLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const fbOp = appear(152, 18) * lf;
  const fbLit = interpolate(frame, [152, 176, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: combined { linkedin, facebook } result, shared alert path
  const t3a = seg(frame, 254, 282);
  const t3aVis = frame >= 254 && frame < 322 ? 1 : 0;
  const t3b = seg(frame, 258, 286);
  const t3bVis = frame >= 258 && frame < 326 ? 1 : 0;
  const combinedOp = appear(272, 18) * lf;
  const combinedLit = interpolate(frame, [280, 302, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 288, 310, Easing.out(Easing.cubic));
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

      <Connector pts={BLIND_TO_LI} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={BLIND_TO_FB} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={LI_TO_COMBINED} color={T.success} width={2.5} progress={t3a} opacity={0.8 * t3aVis * lf} />
      <Connector pts={FB_TO_COMBINED} color={T.success} width={2.5} progress={t3b} opacity={0.8 * t3bVis * lf} />

      <SchemaNode {...BLINDSPOT} state="danger" lit={blindLit} opacity={blindOp} label="Facebook token: zero warning" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>only LinkedIn was ever checked</div>
      </SchemaNode>
      <Badge x={BLINDSPOT.x + BLINDSPOT.w - 20} y={BLINDSPOT.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />
      <Pill x={BLINDSPOT.x + 130} y={BLINDSPOT.y + BLINDSPOT.h + 18} text="first sign of trouble: a failed post" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...LI_CHECK} state="accent" lit={liLit} opacity={liOp} label="LinkedIn check" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>moved to /v2/userinfo</div>
      </SchemaNode>
      <Token pts={BLIND_TO_LI} t={t2a} opacity={t2aVis * lf} />
      <SchemaNode {...FB_CHECK} state="accent" lit={fbLit} opacity={fbOp} label="Facebook check" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Graph API, PAGE_ACCESS_TOKEN</div>
      </SchemaNode>
      <Token pts={BLIND_TO_FB} t={t2b} opacity={t2bVis * lf} />

      <SchemaNode {...COMBINED} state="success" lit={combinedLit} opacity={combinedOp} label="{ linkedin, facebook }" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>one invocation, both statuses</div>
      </SchemaNode>
      <Token pts={LI_TO_COMBINED} t={t3a} color={T.success} opacity={t3aVis * lf} />
      <Token pts={FB_TO_COMBINED} t={t3b} color={T.success} opacity={t3bVis * lf} />
      <Pill x={COMBINED.x + 10} y={COMBINED.y + COMBINED.h + 14} text="either 401 fires its own sendTelegramAlert()" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="LinkedIn was covered — Facebook's token could expire with no warning" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="One function now checks both platforms in the same invocation" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Each platform's status collects independently, alerts share one path" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>One call, status for both platforms</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>the exact blind spot closed for good</div>
      </div>
    </AbsoluteFill>
  );
};
