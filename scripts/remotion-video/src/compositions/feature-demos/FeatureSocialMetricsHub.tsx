/**
 * FeatureSocialMetricsHub — feature p48 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: paying $25/month for Shield App to chart LinkedIn analytics felt
 * wasteful — the raw posting data for Facebook/Instagram already lived in
 * my own system. A sync-social-metrics Edge Function, on a daily Supabase
 * cron, queries Facebook Graph API and Instagram Media API insights per
 * post, storing follower counts in follower_history and rollups in
 * analytics_snapshots. A Recharts dashboard renders 6 summary cards, trend
 * charts, sortable top posts, and CSV export — for $0/month.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SHIELD = { x: 490, y: 56, w: 300, h: 96 };
const SHIELD_B: Pt = { x: SHIELD.x + SHIELD.w / 2, y: SHIELD.y + SHIELD.h };

const SYNC = { x: 490, y: 216, w: 300, h: 108 };
const SYNC_T: Pt = { x: SYNC.x + SYNC.w / 2, y: SYNC.y };
const SYNC_L: Pt = { x: SYNC.x, y: SYNC.y + SYNC.h / 2 };
const SYNC_R: Pt = { x: SYNC.x + SYNC.w, y: SYNC.y + SYNC.h / 2 };
const SYNC_B: Pt = { x: SYNC.x + SYNC.w / 2, y: SYNC.y + SYNC.h };

const FB = { x: 130, y: 216, w: 250, h: 108 };
const FB_R: Pt = { x: FB.x + FB.w, y: FB.y + FB.h / 2 };

const IG = { x: 900, y: 216, w: 250, h: 108 };
const IG_L: Pt = { x: IG.x, y: IG.y + IG.h / 2 };

const DASH = { x: 400, y: 400, w: 480, h: 108 };
const DASH_T: Pt = { x: DASH.x + DASH.w / 2, y: DASH.y };

export const FeatureSocialMetricsHub: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: $25/month for charts on data I already own
  const shieldOp = appear(6) * lf;
  const shieldLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: sync-social-metrics cron pulls FB + IG insights
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const tFb = seg(frame, 150, 174);
  const tFbVis = frame >= 150 && frame < 210 ? 1 : 0;
  const tIg = seg(frame, 150, 174);
  const tIgVis = frame >= 150 && frame < 210 ? 1 : 0;
  const syncOp = appear(140, 18) * lf;
  const syncLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const fbOp = appear(158, 18) * lf;
  const igOp = appear(158, 18) * lf;
  const fbLit = interpolate(frame, [166, 188, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const igLit = interpolate(frame, [166, 188, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 178, 200, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: Recharts dashboard — 6 cards, trend charts, CSV export
  const tD = seg(frame, 226, 250);
  const tDVis = frame >= 226 && frame < 290 ? 1 : 0;
  const dashOp = appear(232, 18) * lf;
  const dashLit = interpolate(frame, [240, 262, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[SHIELD_B, SYNC_T]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[FB_R, SYNC_L]} color={T.accent} width={2.5} progress={tFb} opacity={0.8 * tFbVis * lf} />
      <Connector pts={[IG_L, SYNC_R]} color={T.accent} width={2.5} progress={tIg} opacity={0.8 * tIgVis * lf} />
      <Connector pts={[SYNC_B, DASH_T]} color={T.success} width={2.5} progress={tD} opacity={0.8 * tDVis * lf} />

      <SchemaNode {...SHIELD} state="danger" lit={shieldLit} opacity={shieldOp} label="Shield App — $25/month" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>charts on data I already own</div>
      </SchemaNode>
      <Pill x={SHIELD.x + 10} y={SHIELD.y - 46} dx={pill1Dx} text="recurring expense for a personal project" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...FB} state="idle" lit={fbLit} opacity={fbOp} label="Facebook Graph API" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>/{"{post_id}"}/insights</div>
      </SchemaNode>
      <SchemaNode {...IG} state="idle" lit={igLit} opacity={igOp} label="Instagram Media API" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>/{"{media_id}"}/insights</div>
      </SchemaNode>
      <SchemaNode {...SYNC} state="accent" lit={syncLit} opacity={syncOp} label="sync-social-metrics" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>daily Supabase cron</div>
      </SchemaNode>
      <Token pts={[SHIELD_B, SYNC_T]} t={tA} opacity={tAVis * lf} />
      <Token pts={[FB_R, SYNC_L]} t={tFb} opacity={tFbVis * lf} />
      <Token pts={[IG_L, SYNC_R]} t={tIg} opacity={tIgVis * lf} />
      <Pill x={SYNC.x - 10} y={SYNC.y + SYNC.h + 14} dx={pill2Dx} text="follower_history + analytics_snapshots" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...DASH} state="success" lit={dashLit} opacity={dashOp} label="Admin dashboard · Recharts" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>6 summary cards · trends · CSV export</div>
      </SchemaNode>
      <Token pts={[SYNC_B, DASH_T]} t={tD} color={T.success} opacity={tDVis * lf} />
      <Pill x={DASH.x + 40} y={DASH.y + DASH.h + 14} dx={pill3Dx} text="7D / 30D / 90D / YTD comparisons" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Paying monthly to chart data my own system already had" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="A daily cron pulls Facebook and Instagram insights directly" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="A custom Recharts dashboard replaces the subscription entirely" color={T.success} opacity={cap3} fontSize={23} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>$25/month replaced with $0/month, real-time insights</div>
      </div>
    </AbsoluteFill>
  );
};
