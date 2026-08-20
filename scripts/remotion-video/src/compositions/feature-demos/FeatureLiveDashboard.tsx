/**
 * FeatureLiveDashboard — feature j30 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: backend scanner finds 5-10 new jobs every 15 minutes, but the
 * frontend stays stale until manual F5 (3-5s reload, missed deadlines) →
 * a Supabase Realtime channel('public:jobs') WebSocket, RLS-secured, feeds
 * INSERT/UPDATE straight into React useState, a 2s debounce batches
 * updates → dashboard behaves like a live feed, no F5, no missed jobs.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SCANNER = { x: 150, y: 60, w: 260, h: 82, label: "Backend scanner" };
const F5 = { x: 850, y: 60, w: 260, h: 82, label: "Manual F5" };
const SCANNER_R: Pt = { x: SCANNER.x + SCANNER.w, y: SCANNER.y + SCANNER.h / 2 };
const F5_L: Pt = { x: F5.x, y: F5.y + F5.h / 2 };

const JOBS = { x: 490, y: 210, w: 300, h: 90 };
const JOBS_T: Pt = { x: JOBS.x + JOBS.w / 2, y: JOBS.y };
const JOBS_B: Pt = { x: JOBS.x + JOBS.w / 2, y: JOBS.y + JOBS.h };

const CHANNEL = { x: 490, y: 350, w: 300, h: 90 };
const CHANNEL_T: Pt = { x: CHANNEL.x + CHANNEL.w / 2, y: CHANNEL.y };
const CHANNEL_L: Pt = { x: CHANNEL.x, y: CHANNEL.y + CHANNEL.h / 2 };
const CHANNEL_R: Pt = { x: CHANNEL.x + CHANNEL.w, y: CHANNEL.y + CHANNEL.h / 2 };

const STATE = { x: 140, y: 490, w: 260, h: 90 };
const BADGE = { x: 850, y: 490, w: 260, h: 90 };
const STATE_T: Pt = { x: STATE.x + STATE.w / 2, y: STATE.y };
const BADGE_T: Pt = { x: BADGE.x + BADGE.w / 2, y: BADGE.y };

export const FeatureLiveDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): scanner finds jobs every 15 min, frontend stays stale ──
  const scannerOp = Math.min(1, pop(6)) * lf;
  const f5Op = appear(22) * lf;
  const scannerLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const f5Lit = interpolate(frame, [22, 44, 96, 116], [0, 0.4, 0.4, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const staleXScale = pop(48) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const rateePillIn = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const rateePillOp = rateePillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): jobs table → Realtime channel, RLS-secured ──
  const jobsOp = appear(134, 18) * lf;
  const jobsLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tJc = seg(frame, 154, 178);
  const tJcVis = frame >= 154 && frame < 200 ? 1 : 0;
  const channelOp = appear(170, 18) * lf;
  const channelLit = interpolate(frame, [178, 200, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const rlsPillIn = seg(frame, 184, 206, Easing.out(Easing.cubic));
  const rlsPillOp = rlsPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): INSERT/UPDATE → useState, 2s debounce, badge count ──
  const tCs = seg(frame, 250, 274);
  const tCsVis = frame >= 250 && frame < 300 ? 1 : 0;
  const tCb = seg(frame, 256, 280);
  const tCbVis = frame >= 256 && frame < 306 ? 1 : 0;
  const stateOp = appear(266, 18) * lf;
  const badgeOp = appear(272, 18) * lf;
  const stateLit = interpolate(frame, [274, 296, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const badgeLit = interpolate(frame, [280, 302, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const debouncePillIn = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const debouncePillOp = debouncePillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={[SCANNER_R, F5_L]} color={T.danger} width={2} opacity={0.4 * Math.min(scannerOp, f5Op)} dashed />
      <Connector pts={[JOBS_B, CHANNEL_T]} color={T.accent} width={2.5} progress={tJc} opacity={0.8 * tJcVis * lf} />
      <Connector pts={[CHANNEL_L, STATE_T]} color={T.success} width={2.5} progress={tCs} opacity={0.8 * tCsVis * lf} />
      <Connector pts={[CHANNEL_R, BADGE_T]} color={T.success} width={2.5} progress={tCb} opacity={0.8 * tCbVis * lf} />

      <SchemaNode {...SCANNER} state="idle" lit={scannerLit} opacity={scannerOp} label={SCANNER.label} fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>finds 5–10 jobs / 15 min</div>
      </SchemaNode>
      <SchemaNode {...F5} state="danger" lit={f5Lit} opacity={f5Op} label={F5.label} fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>3–5s reload, still stale</div>
      </SchemaNode>
      <Badge x={F5.x + F5.w / 2 - 16} y={F5.y - 34} kind="cross" scale={staleXScale} opacity={staleXScale} size={32} />
      <Pill x={F5.x - 30} y={F5.y + F5.h + 14} text="stale UI — 'apply today' jobs get missed" color={T.danger} opacity={rateePillOp} fontSize={16} />

      <SchemaNode {...JOBS} state="accent" lit={jobsLit} opacity={jobsOp} label="jobs table" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>PostgreSQL, RLS by user_id</div>
      </SchemaNode>
      <Token pts={[JOBS_B, CHANNEL_T]} t={tJc} opacity={tJcVis * lf} />

      <SchemaNode {...CHANNEL} state="accent" lit={channelLit} opacity={channelOp} label="channel('public:jobs')" fontSize={17}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Supabase Realtime WebSocket</div>
      </SchemaNode>
      <Pill x={CHANNEL.x - 30} y={CHANNEL.y - 46} text="secured by RLS for user_id" color={T.accent} opacity={rlsPillOp} fontSize={16} />

      <SchemaNode {...STATE} state="success" lit={stateLit} opacity={stateOp} label="React useState" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>INSERT / UPDATE events</div>
      </SchemaNode>
      <SchemaNode {...BADGE} state="success" lit={badgeLit} opacity={badgeOp} label="newItemsCount badge" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>sidebar notification</div>
      </SchemaNode>
      <Token pts={[CHANNEL_L, STATE_T]} t={tCs} color={T.success} opacity={tCsVis * lf} />
      <Token pts={[CHANNEL_R, BADGE_T]} t={tCb} color={T.success} opacity={tCbVis * lf} />
      <Pill x={STATE.x - 10} y={STATE.y + STATE.h + 14} text="2-second debounce prevents UI thrashing" color={T.success} opacity={debouncePillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="New jobs land in the backend every 15 minutes — the frontend never knows" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A WebSocket subscription on the jobs table, secured by row-level security" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Inserts and updates flow straight into state — debounced, never thrashy" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>New jobs appear within 1–2 seconds — no F5</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Saves 5–10 minutes per session, deadlines never missed</div>
      </div>
    </AbsoluteFill>
  );
};
