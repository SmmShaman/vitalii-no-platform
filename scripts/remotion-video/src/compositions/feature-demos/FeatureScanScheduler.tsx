/**
 * FeatureScanScheduler — feature j36 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: forceRun=true scanned every user simultaneously, every hour —
 * hundreds of requests hammering FINN.no at peak times, guaranteed rate
 * limits → scheduled-scan.yml still fires hourly but calls
 * scheduled-scanner with forceRun=false, which queries
 * scan_time_utc per user and only scans on a match → hourly spikes become
 * a smooth 24-hour flow, zero rate-limiting incidents.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const USERS = [
  { x: 90, y: 60, w: 170, h: 70, label: "User A" },
  { x: 290, y: 60, w: 170, h: 70, label: "User B" },
  { x: 490, y: 60, w: 170, h: 70, label: "User C" },
  { x: 690, y: 60, w: 170, h: 70, label: "+300 more" },
];
const USERS_B: Pt[] = USERS.map((u) => ({ x: u.x + u.w / 2, y: u.y + u.h }));

const FINN = { x: 950, y: 60, w: 220, h: 70, label: "FINN.no" };
const FINN_L: Pt = { x: FINN.x, y: FINN.y + FINN.h / 2 };

const CRON = { x: 90, y: 210, w: 260, h: 84 };
const QUERY = { x: 470, y: 210, w: 340, h: 84 };
const CRON_R: Pt = { x: CRON.x + CRON.w, y: CRON.y + CRON.h / 2 };
const QUERY_L: Pt = { x: QUERY.x, y: QUERY.y + QUERY.h / 2 };
const QUERY_B: Pt = { x: QUERY.x + QUERY.w / 2, y: QUERY.y + QUERY.h };

const CHECK = { x: 470, y: 360, w: 340, h: 90 };
const CHECK_T: Pt = { x: CHECK.x + CHECK.w / 2, y: CHECK.y };
const CHECK_B: Pt = { x: CHECK.x + CHECK.w / 2, y: CHECK.y + CHECK.h };

const RESULT = { x: 440, y: 510, w: 400, h: 78 };
const RESULT_T: Pt = { x: RESULT.x + RESULT.w / 2, y: RESULT.y };

export const FeatureScanScheduler: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): forceRun=true — every user hits FINN.no simultaneously ──
  const userOp = USERS.map((_, i) => appear(4 + i * 6) * lf);
  const finnOp = Math.min(1, pop(30)) * lf;
  const finnLit = interpolate(frame, [30, 52, 96, 116], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tU = USERS_B.map((_, i) => seg(frame, 24 + i * 5, 44 + i * 5));
  const tUVis = USERS_B.map((_, i) => (frame >= 24 + i * 5 && frame < 96 ? 1 : 0));
  const xScale = pop(58) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const ratePillIn = seg(frame, 62, 84, Easing.out(Easing.cubic));
  const ratePillOp = ratePillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): cron hourly → query scan_time_utc per user ──
  const cronOp = appear(134, 18) * lf;
  const cronLit = interpolate(frame, [134, 156, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tCq = seg(frame, 152, 176);
  const tCqVis = frame >= 152 && frame < 198 ? 1 : 0;
  const queryOp = appear(166, 18) * lf;
  const queryLit = interpolate(frame, [174, 196, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const forceRunPillIn = seg(frame, 180, 202, Easing.out(Easing.cubic));
  const forceRunPillOp = forceRunPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): programmatic hour match → only matching users proceed ──
  const tQc = seg(frame, 250, 274);
  const tQcVis = frame >= 250 && frame < 300 ? 1 : 0;
  const checkOp = appear(266, 18) * lf;
  const checkLit = interpolate(frame, [274, 296, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const logPillIn = seg(frame, 280, 302, Easing.out(Easing.cubic));
  const logPillOp = logPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const tCr = seg(frame, 348, 370);
  const tCrVis = frame >= 348 && frame < 392 ? 1 : 0;
  const resultOp = appear(360, 18) * lf;
  const resultLit = interpolate(frame, [366, 388, 430, 450], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {USERS_B.map((p, i) => (
        <Connector key={i} pts={[p, FINN_L]} color={T.danger} width={2} progress={tU[i]} opacity={0.6 * tUVis[i] * lf} />
      ))}
      <Connector pts={[CRON_R, QUERY_L]} color={T.accent} width={2.5} progress={tCq} opacity={0.8 * tCqVis * lf} />
      <Connector pts={[QUERY_B, CHECK_T]} color={T.accent} width={2.5} progress={tQc} opacity={0.8 * tQcVis * lf} />
      <Connector pts={[CHECK_B, RESULT_T]} color={T.success} width={2.5} progress={tCr} opacity={0.8 * tCrVis * lf} />

      {USERS.map((u, i) => (
        <SchemaNode key={u.label} {...u} state="danger" lit={0.35 * userOp[i] * lf} opacity={userOp[i]} label={u.label} fontSize={16} />
      ))}
      <SchemaNode {...FINN} state="danger" lit={finnLit} opacity={finnOp} label={FINN.label} fontSize={19} />
      <Badge x={FINN.x + FINN.w / 2 - 15} y={FINN.y - 32} kind="cross" scale={xScale} opacity={xScale} size={28} />
      {USERS_B.map((_, i) => (
        <Token key={i} pts={[USERS_B[i], FINN_L]} t={tU[i]} color={T.danger} opacity={tUVis[i] * lf} size={9} />
      ))}
      <Pill x={USERS[1].x} y={USERS[1].y + USERS[1].h + 14} text="every user scanned hourly, all at once → rate limit" color={T.danger} opacity={ratePillOp} fontSize={16} />

      <SchemaNode {...CRON} state="accent" lit={cronLit} opacity={cronOp} label="cron: 0 * * * *" fontSize={20} />
      <SchemaNode {...QUERY} state="accent" lit={queryLit} opacity={queryOp} label="scan_time_utc per user" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>WHERE auto_scan_enabled=true</div>
      </SchemaNode>
      <Token pts={[CRON_R, QUERY_L]} t={tCq} opacity={tCqVis * lf} />
      <Pill x={CRON.x + 20} y={CRON.y - 46} text="forceRun=false, not forceRun=true" color={T.accent} opacity={forceRunPillOp} fontSize={16} />

      <SchemaNode {...CHECK} state="success" lit={checkLit} opacity={checkOp} label="scan_time_utc === current_hour?" fontSize={17} />
      <Token pts={[QUERY_B, CHECK_T]} t={tQc} opacity={tQcVis * lf} />
      <Pill x={CHECK.x - 10} y={CHECK.y + CHECK.h + 14} text="'Skipping user X: scan_time_utc=14, current_hour=09'" color={T.success} opacity={logPillOp} fontSize={14} />

      <SchemaNode {...RESULT} state="success" lit={resultLit} opacity={resultOp} label="24-hour smooth traffic flow" fontSize={20} />
      <Token pts={[CHECK_B, RESULT_T]} t={tCr} color={T.success} opacity={tCrVis * lf} />

      <Caption x={90} y={648} w={1100} text="Every user scanned simultaneously, every hour — a guaranteed rate limit" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The cron still fires hourly — but now checks each user's own scan hour" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Only matching users proceed — everyone else is skipped and logged" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Peak-hour spikes become a smooth 24-hour distribution</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero rate-limiting incidents, 100% reliable delivery</div>
      </div>
    </AbsoluteFill>
  );
};
