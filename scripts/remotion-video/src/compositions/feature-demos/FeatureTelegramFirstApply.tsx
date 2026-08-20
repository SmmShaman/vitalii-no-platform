/**
 * FeatureTelegramFirstApply — feature j18 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 80% mobile users stuck with a desktop-only web dashboard, a painful
 * 5-step dance to apply → telegram-bot/index.ts, a 3200+ line Deno Edge
 * Function (v15.0), becomes the primary interface: callback queries like
 * write_cover_letter / approve_application / send_application → every user
 * is authenticated via getUserIdFromChat() linking Telegram → Supabase
 * profiles → "95% of daily interactions, 4 taps, under 30 seconds".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const MOBILE = { x: 100, y: 66, w: 230, h: 96 };
const WEB = { x: 500, y: 66, w: 280, h: 96 };
const MOBILE_R: Pt = { x: MOBILE.x + MOBILE.w, y: MOBILE.y + MOBILE.h / 2 };
const WEB_L: Pt = { x: WEB.x, y: WEB.y + WEB.h / 2 };

const BOT = { x: 465, y: 230, w: 350, h: 118 };
const BOT_TOP: Pt = { x: BOT.x + BOT.w / 2, y: BOT.y };
const BOT_BOTTOM: Pt = { x: BOT.x + BOT.w / 2, y: BOT.y + BOT.h };

const PROFILES = { x: 870, y: 250, w: 260, h: 90 };
const PROFILES_L: Pt = { x: PROFILES.x, y: PROFILES.y + PROFILES.h / 2 };
const BOT_R: Pt = { x: BOT.x + BOT.w, y: BOT.y + BOT.h / 2 };

const AUTH = { x: 465, y: 420, w: 350, h: 96 };
const AUTH_TOP: Pt = { x: AUTH.x + AUTH.w / 2, y: AUTH.y };

const MOBILE_TO_BOT: Pt[] = [MOBILE_R, { x: MOBILE_R.x + 60, y: MOBILE_R.y }, BOT_TOP];
const BOT_TO_PROFILES: Pt[] = [BOT_R, PROFILES_L];
const BOT_TO_AUTH: Pt[] = [BOT_BOTTOM, AUTH_TOP];

export const FeatureTelegramFirstApply: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): mobile user vs desktop-only web dashboard ──
  const mobileOp = appear(6) * lf;
  const webOp = appear(20) * lf;
  const webLit = interpolate(frame, [20, 44, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const stepsPillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const stepsPillOp = stepsPillIn * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const stepsPillDx = (1 - stepsPillIn) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): telegram-bot/index.ts scrapes + matches against profiles ──
  const botOp = appear(140, 18) * lf;
  const profOp = appear(158, 18) * lf;
  const botLit = interpolate(frame, [140, 165, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const profLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): getUserIdFromChat() security link ──
  const authOp = appear(244, 18) * lf;
  const authLit = interpolate(frame, [252, 274, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const lockCheck = pop(284) * lf;
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
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={MOBILE_TO_BOT} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={BOT_TO_PROFILES} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={BOT_TO_AUTH} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...MOBILE} state="danger" lit={0.25 * lf} opacity={mobileOp} label="80% mobile users" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>on the go</div>
      </SchemaNode>
      <SchemaNode {...WEB} state="danger" lit={webLit} opacity={webOp} label="Web dashboard" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>desktop-only luxury</div>
      </SchemaNode>
      <Pill x={WEB.x + 20} y={WEB.y - 46} dx={stepsPillDx} text="5-step dance just to apply" color={T.danger} opacity={stepsPillOp} fontSize={19} />

      <SchemaNode {...BOT} state="accent" lit={botLit} opacity={botOp} label="telegram-bot/index.ts" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>3200+ lines · Deno Edge Function v15.0</div>
      </SchemaNode>
      <SchemaNode {...PROFILES} state="accent" lit={profLit} opacity={profOp} label="user_profiles" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Cheerio scrape + skill match</div>
      </SchemaNode>
      <Token pts={MOBILE_TO_BOT} t={t2} opacity={t2Vis * lf} />
      <Token pts={BOT_TO_PROFILES} t={t2b} opacity={t2bVis * lf} />
      <Pill x={BOT.x + 30} y={BOT.y + BOT.h + 14} dx={pill2Dx} text="write_cover_letter · approve_application" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...AUTH} state="success" lit={authLit} opacity={authOp} label="getUserIdFromChat()" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Telegram user → Supabase profile</div>
      </SchemaNode>
      <Token pts={BOT_TO_AUTH} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Badge x={AUTH.x + AUTH.w - 20} y={AUTH.y - 12} kind="check" scale={lockCheck} opacity={lockCheck} />
      <Pill x={AUTH.x + 10} y={AUTH.y + AUTH.h + 12} dx={pill3Dx} text="secured — multi-user safe" color={T.success} opacity={pill3Op} fontSize={19} />

      <Caption x={90} y={648} w={1100} text="A job alert to a submitted application meant 5 painful steps" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Callback buttons drive the entire flow inside the chat" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every callback authenticated before touching a profile" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>notification → submitted cover letter</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>95% of interactions, 4 taps, under 30 seconds</div>
      </div>
    </AbsoluteFill>
  );
};
