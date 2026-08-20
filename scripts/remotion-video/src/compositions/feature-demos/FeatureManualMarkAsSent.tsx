/**
 * FeatureManualMarkAsSent — feature j48 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: many Norwegian job portals need no cover letter or aren't wired to
 * Skyvern, so users applied outside the bot with zero dashboard visibility →
 * a "Mark as Sent" action in JobTable.tsx and the job expansion view calls
 * handleMarkJobAsSent() → api.markJobAsSentManually() creates a minimal
 * applications row (status='sent') only if none exists for that job_id +
 * user_id → 100% of applications now tracked, covering ~20% that used to
 * fall outside the automated flow entirely.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PORTAL = { x: 80, y: 44, w: 300, h: 88 };
const BLINDSPOT = { x: 850, y: 44, w: 300, h: 88 };

const BUTTON = { x: 60, y: 250, w: 280, h: 96 };
const HANDLER = { x: 470, y: 250, w: 300, h: 96 };
const API = { x: 900, y: 250, w: 290, h: 96 };

const PORTAL_R: Pt = { x: PORTAL.x + PORTAL.w, y: PORTAL.y + PORTAL.h / 2 };
const BLIND_L: Pt = { x: BLINDSPOT.x, y: BLINDSPOT.y + BLINDSPOT.h / 2 };
const BUTTON_R: Pt = { x: BUTTON.x + BUTTON.w, y: BUTTON.y + BUTTON.h / 2 };
const HANDLER_L: Pt = { x: HANDLER.x, y: HANDLER.y + HANDLER.h / 2 };
const HANDLER_R: Pt = { x: HANDLER.x + HANDLER.w, y: HANDLER.y + HANDLER.h / 2 };
const API_L: Pt = { x: API.x, y: API.y + API.h / 2 };

const P_PB: Pt[] = [PORTAL_R, BLIND_L];
const P_BH: Pt[] = [BUTTON_R, HANDLER_L];
const P_HA: Pt[] = [HANDLER_R, API_L];

export const FeatureManualMarkAsSent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): manual applications fall outside the dashboard ──
  const portalOp = Math.min(1, pop(10)) * lf;
  const portalLit = 0.3 * lf;
  const blindOp = appear(30, 18) * lf;
  const blindLit = interpolate(frame, [40, 62, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tPb = seg(frame, 36, 58);
  const tPbVis = frame >= 36 && frame < 96 ? 1 : 0;
  const crossScale = pop(50) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): Mark as Sent -> handler -> API call ──
  const buttonOp = appear(126, 18) * lf;
  const buttonLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tBh = seg(frame, 148, 172);
  const tBhVis = frame >= 148 && frame < 206 ? 1 : 0;
  const handlerOp = appear(150, 18) * lf;
  const handlerLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tHa = seg(frame, 182, 206);
  const tHaVis = frame >= 182 && frame < 236 ? 1 : 0;
  const apiOp = appear(184, 18) * lf;
  const apiLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const bulkPillIn = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const bulkPillOp = bulkPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): guard — only inserts if no record exists ──
  const guardScale = pop(250) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const guardPillIn = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const guardPillOp = guardPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_PB} color={T.danger} width={2.5} progress={tPb} opacity={0.8 * tPbVis * lf} />
      <Connector pts={P_BH} color={T.accent} width={2.5} progress={tBh} opacity={0.8 * tBhVis * lf} />
      <Connector pts={P_HA} color={T.accent} width={2.5} progress={tHa} opacity={0.8 * tHaVis * lf} />

      <SchemaNode {...PORTAL} state="danger" lit={portalLit} opacity={portalOp} label="Small portal, direct apply" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>no søknad, no Skyvern link</div>
      </SchemaNode>
      <SchemaNode {...BLINDSPOT} state="danger" lit={blindLit} opacity={blindOp} label="Dashboard blind spot" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>application activity untracked</div>
      </SchemaNode>
      <Token pts={P_PB} t={tPb} color={T.danger} opacity={tPbVis * lf} />
      <Badge x={BLINDSPOT.x + BLINDSPOT.w / 2 - 18} y={BLINDSPOT.y + BLINDSPOT.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...BUTTON} state="accent" lit={buttonLit} opacity={buttonOp} label="'Mark as Sent'" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>JobTable.tsx, bulk + inline</div>
      </SchemaNode>
      <SchemaNode {...HANDLER} state="accent" lit={handlerLit} opacity={handlerOp} label="handleMarkJobAsSent()" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>dashboard action</div>
      </SchemaNode>
      <SchemaNode {...API} state="success" lit={apiLit} opacity={apiOp} label="markJobAsSentManually()" fontSize={15}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>services/api.ts</div>
      </SchemaNode>
      <Token pts={P_BH} t={tBh} opacity={tBhVis * lf} />
      <Token pts={P_HA} t={tHa} opacity={tHaVis * lf} />
      <Pill x={BUTTON.x + 10} y={BUTTON.y - 46} dx={0} text="bulk action or inline, either works" color={T.amber} opacity={bulkPillOp} fontSize={15} />

      <div style={{ position: "absolute", left: API.x - 30, top: API.y + API.h + 40, opacity: guardScale, transform: `scale(${guardScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.success }}>status='sent' — only if no row exists</div>
      </div>
      <Badge x={API.x - 34} y={API.y + API.h + 34} kind="check" scale={guardScale} opacity={guardScale} size={24} />
      <Pill x={HANDLER.x - 10} y={HANDLER.y + HANDLER.h + 14} text="applications table stays consistent" color={T.success} opacity={guardPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Manual applications on smaller portals had zero dashboard visibility" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="One click records the application without a generated søknad" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Never overwrites an existing application row" color={T.success} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>100% of applications tracked · ~20% used to fall through</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>A complete picture of every job hunt</div>
      </div>
    </AbsoluteFill>
  );
};
