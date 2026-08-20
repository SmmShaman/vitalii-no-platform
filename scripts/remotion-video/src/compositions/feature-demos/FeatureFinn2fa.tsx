/**
 * FeatureFinn2fa — feature j07 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Skyvern fills the FINN.no "Enkel Søknad" form perfectly, then freezes
 * cold at the SMS 2FA prompt → it writes a code_requested row to
 * finn_auth_requests, Telegram Bot API DMs the user, the user types the
 * 6-digit code back → finn-2fa-webhook polls every 10s and must return the
 * code to Skyvern inside its strict 30s HTTP timeout → "~30s of human input,
 * the rest is fully automated".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SKY = { x: 465, y: 40, w: 350, h: 90 };
const TABLE = { x: 60, y: 260, w: 250, h: 88 };
const TG = { x: 350, y: 260, w: 230, h: 88 };
const USER = { x: 620, y: 260, w: 180, h: 88 };
const WEBHOOK = { x: 840, y: 260, w: 260, h: 88 };

const SKY_B: Pt = { x: SKY.x + SKY.w / 2, y: SKY.y + SKY.h };
const TABLE_T: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y };
const TABLE_R: Pt = { x: TABLE.x + TABLE.w, y: TABLE.y + TABLE.h / 2 };
const TG_L: Pt = { x: TG.x, y: TG.y + TG.h / 2 };
const TG_R: Pt = { x: TG.x + TG.w, y: TG.y + TG.h / 2 };
const USER_L: Pt = { x: USER.x, y: USER.y + USER.h / 2 };
const USER_R: Pt = { x: USER.x + USER.w, y: USER.y + USER.h / 2 };
const WEBHOOK_L: Pt = { x: WEBHOOK.x, y: WEBHOOK.y + WEBHOOK.h / 2 };
const WEBHOOK_T: Pt = { x: WEBHOOK.x + WEBHOOK.w / 2, y: WEBHOOK.y };
const SKY_R: Pt = { x: SKY.x + SKY.w, y: SKY.y + SKY.h / 2 };

const P_TRIG: Pt[] = [SKY_B, TABLE_T];
const P_TT: Pt[] = [TABLE_R, TG_L];
const P_TU: Pt[] = [TG_R, USER_L];
const P_UW: Pt[] = [USER_R, WEBHOOK_L];
const P_LOOP: Pt[] = [WEBHOOK_T, { x: WEBHOOK_T.x, y: 160 }, { x: SKY_R.x + 40, y: 160 }, { x: SKY_R.x + 40, y: SKY.y + SKY.h / 2 }, SKY_R];

export const FeatureFinn2fa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): Skyvern freezes cold at the 2FA prompt ──
  const skyOp = Math.min(1, pop(10)) * lf;
  const skyLit = interpolate(frame, [10, 34, 96, 118], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const promptPillIn = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const promptPillOp = promptPillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (126–246): the relay — table → Telegram → user → webhook ──
  const tTrig = seg(frame, 128, 150);
  const tTrigVis = frame >= 128 && frame < 180 ? 1 : 0;
  const tableOp = appear(130, 16) * lf;
  const tableLit = interpolate(frame, [138, 158, 330, 350], [0, 0.65, 0.65, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tTt = seg(frame, 160, 182);
  const tTtVis = frame >= 160 && frame < 208 ? 1 : 0;
  const tgOp = appear(162, 16) * lf;
  const tgLit = interpolate(frame, [170, 190, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tTu = seg(frame, 190, 210);
  const tTuVis = frame >= 190 && frame < 234 ? 1 : 0;
  const userOp = appear(192, 16) * lf;
  const userLit = interpolate(frame, [198, 218, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tUw = seg(frame, 216, 238);
  const tUwVis = frame >= 216 && frame < 262 ? 1 : 0;
  const webhookOp = appear(218, 16) * lf;
  const webhookLit = interpolate(frame, [224, 244, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [240, 260], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const pollPillIn = seg(frame, 226, 248, Easing.out(Easing.cubic));
  const pollPillOp = pollPillIn * interpolate(frame, [312, 334], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (246–340): code returns inside the 30s HTTP timeout ──
  const tLoop = seg(frame, 250, 292);
  const tLoopVis = frame >= 250 && frame < 322 ? 1 : 0;
  const timeoutPillIn = seg(frame, 256, 278, Easing.out(Easing.cubic));
  const timeoutPillOp = timeoutPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const checkScale = pop(296) * lf;
  const skyResumeLit = interpolate(frame, [296, 314, 330, 350], [0, 0.85, 0.85, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_TRIG} color={T.danger} width={2.5} progress={tTrig} opacity={0.75 * tTrigVis * lf} />
      <Connector pts={P_TT} color={T.accent} width={2.5} progress={tTt} opacity={0.8 * tTtVis * lf} />
      <Connector pts={P_TU} color={T.accent} width={2.5} progress={tTu} opacity={0.8 * tTuVis * lf} />
      <Connector pts={P_UW} color={T.accent} width={2.5} progress={tUw} opacity={0.8 * tUwVis * lf} />
      <Connector pts={P_LOOP} color={T.success} width={2.5} progress={tLoop} opacity={0.8 * tLoopVis * lf} />

      <SchemaNode {...SKY} state={frame >= 296 ? "success" : "danger"} lit={Math.max(skyLit, skyResumeLit)} opacity={skyOp} label="Skyvern · FINN.no" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Enkel Søknad — 2FA prompt</div>
      </SchemaNode>
      <Badge x={SKY.x + SKY.w / 2 - 18} y={SKY.y + SKY.h + 6} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={SKY.x - 20} y={SKY.y - 46} text="Enter your SMS code…" color={T.danger} opacity={promptPillOp} fontSize={19} />

      <SchemaNode {...TABLE} state="accent" lit={tableLit} opacity={tableOp} label="finn_auth_requests" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>code_requested row</div>
      </SchemaNode>
      <SchemaNode {...TG} state="accent" lit={tgLit} opacity={tgOp} label="Telegram Bot API" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>DMs the user</div>
      </SchemaNode>
      <SchemaNode {...USER} state="accent" lit={userLit} opacity={userOp} label="You" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>types 6 digits</div>
      </SchemaNode>
      <SchemaNode {...WEBHOOK} state="accent" lit={webhookLit} opacity={webhookOp} label="finn-2fa-webhook" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>polls every 10s</div>
      </SchemaNode>

      <Token pts={P_TRIG} t={tTrig} color={T.danger} opacity={tTrigVis * lf} />
      <Token pts={P_TT} t={tTt} opacity={tTtVis * lf} />
      <Token pts={P_TU} t={tTu} opacity={tTuVis * lf} />
      <Token pts={P_UW} t={tUw} opacity={tUwVis * lf} />
      <Token pts={P_LOOP} t={tLoop} color={T.success} opacity={tLoopVis * lf} />

      <Pill x={WEBHOOK.x - 10} y={WEBHOOK.y - 46} text="30s HTTP timeout window" color={T.amber} opacity={timeoutPillOp} fontSize={18} />
      <Badge x={SKY_R.x - 6} y={SKY.y + SKY.h / 2 - 14} kind="check" scale={checkScale} opacity={checkScale} size={28} />

      <Caption x={90} y={648} w={1100} text="Form filled flawlessly, then frozen cold at the SMS prompt" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Skyvern hands off to a human, over Telegram, mid-flow" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="The code has to make it back before the 30s timeout fires" color={T.amber} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~30 seconds of human input — that's it</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Truly hands-off FINN Enkel Søknad submissions</div>
      </div>
    </AbsoluteFill>
  );
};
