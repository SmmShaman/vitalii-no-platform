/**
 * FeatureSocialAnalyticsDashboard — feature p16 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: paying $25/month/profile for Shield App felt wasteful — the
 * platform already processes all the raw post and engagement data itself
 * → sync-social-metrics (Deno) runs every 6 hours, pulling Facebook Graph
 * API + Instagram Media API into posts and a new follower_history table →
 * daily snapshots feed a Recharts admin dashboard — summary cards,
 * engagement charts, top posts, follower trends, a posting heatmap, CSV
 * export → $25/month drops to $0, zero recurring cost.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SHIELD = { x: 460, y: 30, w: 360, h: 80 };
const SYNC = { x: 460, y: 150, w: 360, h: 80 };
const FB = { x: 90, y: 290, w: 280, h: 90 };
const IG = { x: 500, y: 290, w: 280, h: 90 };
const FOLLOWERS = { x: 900, y: 290, w: 280, h: 90 };
const DASH = { x: 390, y: 430, w: 500, h: 80 };

const SHIELD_B: Pt = { x: SHIELD.x + SHIELD.w / 2, y: SHIELD.y + SHIELD.h };
const SYNC_T: Pt = { x: SYNC.x + SYNC.w / 2, y: SYNC.y };
const SYNC_B: Pt = { x: SYNC.x + SYNC.w / 2, y: SYNC.y + SYNC.h };
const FB_T: Pt = { x: FB.x + FB.w / 2, y: FB.y };
const FB_B: Pt = { x: FB.x + FB.w / 2, y: FB.y + FB.h };
const IG_T: Pt = { x: IG.x + IG.w / 2, y: IG.y };
const IG_B: Pt = { x: IG.x + IG.w / 2, y: IG.y + IG.h };
const FOLLOWERS_T: Pt = { x: FOLLOWERS.x + FOLLOWERS.w / 2, y: FOLLOWERS.y };
const FOLLOWERS_B: Pt = { x: FOLLOWERS.x + FOLLOWERS.w / 2, y: FOLLOWERS.y + FOLLOWERS.h };
const DASH_T: Pt = { x: DASH.x + DASH.w / 2, y: DASH.y };

const P_SHIELD_SYNC: Pt[] = [SHIELD_B, SYNC_T];
const P_SYNC_FB: Pt[] = [SYNC_B, FB_T];
const P_SYNC_IG: Pt[] = [SYNC_B, IG_T];
const P_SYNC_FOL: Pt[] = [SYNC_B, FOLLOWERS_T];
const P_FB_DASH: Pt[] = [FB_B, DASH_T];
const P_IG_DASH: Pt[] = [IG_B, DASH_T];
const P_FOL_DASH: Pt[] = [FOLLOWERS_B, DASH_T];

export const FeatureSocialAnalyticsDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–108): paying for data the platform already has ──
  const shieldOp = Math.min(1, pop(4)) * lf;
  const shieldLit = interpolate(frame, [4, 26, 86, 106], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(38) * interpolate(frame, [86, 106], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const wastePillIn = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const wastePillOp = wastePillIn * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 18, 40, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (112–252): sync-social-metrics pulls FB + IG + follower history ──
  const tSs = seg(frame, 114, 136);
  const tSsVis = frame >= 114 && frame < 190 ? 1 : 0;
  const syncOp = appear(118, 18) * lf;
  const syncLit = interpolate(frame, [126, 148, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tSf = [0, 1, 2].map((i) => seg(frame, 150 + i * 16, 170 + i * 16));
  const tSfVis = [0, 1, 2].map((i) => (frame >= 150 + i * 16 && frame < 330 ? 1 : 0));
  const srcOp = [FB, IG, FOLLOWERS].map((_, i) => appear(154 + i * 16, 16) * lf);
  const srcLit = [FB, IG, FOLLOWERS].map((_, i) => {
    const s = 150 + i * 16;
    return interpolate(frame, [s, s + 16, 330, 350], [0, 0.7, 0.7, 0.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const sixHourPillIn = seg(frame, 202, 224, Easing.out(Easing.cubic));
  const sixHourPillOp = sixHourPillIn * interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 156, 178, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (256–350): daily snapshots feed the Recharts dashboard ──
  const tFd = seg(frame, 258, 280);
  const tFdVis = frame >= 258 && frame < 330 ? 1 : 0;
  const tId = seg(frame, 264, 286);
  const tIdVis = frame >= 264 && frame < 330 ? 1 : 0;
  const tFold = seg(frame, 270, 292);
  const tFoldVis = frame >= 270 && frame < 330 ? 1 : 0;
  const dashOp = appear(262, 18) * lf;
  const dashLit = interpolate(frame, [278, 300, 330, 350], [0, 0.8, 0.8, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const chartsPillIn = seg(frame, 296, 318, Easing.out(Easing.cubic));
  const chartsPillOp = chartsPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (360–450): result ──
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;
  const metricOp = seg(frame, 366, 388, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_SHIELD_SYNC} color={T.danger} width={2.5} progress={tSs} opacity={0.8 * tSsVis * lf} />
      <Connector pts={P_SYNC_FB} color={T.accent} width={2} progress={tSf[0]} opacity={0.8 * tSfVis[0] * lf} />
      <Connector pts={P_SYNC_IG} color={T.accent} width={2} progress={tSf[1]} opacity={0.8 * tSfVis[1] * lf} />
      <Connector pts={P_SYNC_FOL} color={T.accent} width={2} progress={tSf[2]} opacity={0.8 * tSfVis[2] * lf} />
      <Connector pts={P_FB_DASH} color={T.success} width={2} progress={tFd} opacity={0.7 * tFdVis * lf} />
      <Connector pts={P_IG_DASH} color={T.success} width={2} progress={tId} opacity={0.7 * tIdVis * lf} />
      <Connector pts={P_FOL_DASH} color={T.success} width={2} progress={tFold} opacity={0.7 * tFoldVis * lf} />

      <SchemaNode {...SHIELD} state="danger" lit={shieldLit} opacity={shieldOp} label="Shield App" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>$25/month/profile</div>
      </SchemaNode>
      <Badge x={SHIELD.x + SHIELD.w - 18} y={SHIELD.y - 18} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={SHIELD.x - 20} y={SHIELD.y + SHIELD.h + 14} text="paying for data the platform already has" color={T.danger} opacity={wastePillOp} fontSize={15} />

      <SchemaNode {...SYNC} state="accent" lit={syncLit} opacity={syncOp} label="sync-social-metrics" fontSize={18} />
      <Token pts={P_SHIELD_SYNC} t={tSs} color={T.danger} opacity={tSsVis * lf} />
      <Pill x={SYNC.x - 10} y={SYNC.y - 46} text="runs every 6 hours" color={T.accent} opacity={sixHourPillOp} fontSize={15} />

      <SchemaNode {...FB} state="accent" lit={srcLit[0]} opacity={srcOp[0]} label="Facebook Graph API" fontSize={16} />
      <Token pts={P_SYNC_FB} t={tSf[0]} opacity={tSfVis[0] * lf} />
      <SchemaNode {...IG} state="accent" lit={srcLit[1]} opacity={srcOp[1]} label="Instagram Media API" fontSize={16} />
      <Token pts={P_SYNC_IG} t={tSf[1]} opacity={tSfVis[1] * lf} />
      <SchemaNode {...FOLLOWERS} state="accent" lit={srcLit[2]} opacity={srcOp[2]} label="follower_history" fontSize={16} />
      <Token pts={P_SYNC_FOL} t={tSf[2]} opacity={tSfVis[2] * lf} />

      <SchemaNode {...DASH} state="success" lit={dashLit} opacity={dashOp} label="Recharts admin dashboard" fontSize={18} />
      <Token pts={P_FB_DASH} t={tFd} color={T.success} opacity={tFdVis * lf} />
      <Token pts={P_IG_DASH} t={tId} color={T.success} opacity={tIdVis * lf} />
      <Token pts={P_FOL_DASH} t={tFold} color={T.success} opacity={tFoldVis * lf} />
      <Pill x={DASH.x - 10} y={DASH.y - 46} text="summary cards · engagement · top posts · heatmap" color={T.success} opacity={chartsPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="A $25/month subscription for insights from data we already own" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every 6 hours, engagement and follower data syncs automatically" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Daily snapshots power a full dashboard — trends, rankings, exports" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Actionable insight, zero recurring cost</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>$25/month → $0</div>
      </div>
    </AbsoluteFill>
  );
};
