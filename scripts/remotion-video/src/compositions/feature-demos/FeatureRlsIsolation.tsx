/**
 * FeatureRlsIsolation — feature j31 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: User A could accidentally see User B's site_credentials (real
 * passwords) via an unfiltered SELECT → PostgreSQL RLS across 10+ tables
 * (jobs, applications, cv_profiles, site_credentials), SELECT/INSERT/
 * UPDATE/DELETE policies enforcing WHERE user_id = auth.uid(), plus
 * explicit .eq("user_id") on every service_role query that bypasses RLS →
 * User B login shows 0 jobs, 0 applications, $0 cost.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const USER_A = { x: 130, y: 60, w: 220, h: 80, label: "User A" };
const QUERY = { x: 520, y: 60, w: 260, h: 80, label: "unfiltered SELECT" };
const CREDS = { x: 930, y: 60, w: 220, h: 80, label: "site_credentials" };
const USER_A_R: Pt = { x: USER_A.x + USER_A.w, y: USER_A.y + USER_A.h / 2 };
const QUERY_L: Pt = { x: QUERY.x, y: QUERY.y + QUERY.h / 2 };
const QUERY_R: Pt = { x: QUERY.x + QUERY.w, y: QUERY.y + QUERY.h / 2 };
const CREDS_L: Pt = { x: CREDS.x, y: CREDS.y + CREDS.h / 2 };

const TABLES = [
  { x: 130, y: 220, w: 190, h: 66, label: "jobs" },
  { x: 350, y: 220, w: 190, h: 66, label: "applications" },
  { x: 570, y: 220, w: 190, h: 66, label: "cv_profiles" },
  { x: 790, y: 220, w: 190, h: 66, label: "site_credentials" },
];
const TABLES_T: Pt[] = TABLES.map((t) => ({ x: t.x + t.w / 2, y: t.y }));
const TABLES_B: Pt[] = TABLES.map((t) => ({ x: t.x + t.w / 2, y: t.y + t.h }));

const RLS = { x: 440, y: 360, w: 400, h: 100 };
const RLS_T: Pt = { x: RLS.x + RLS.w / 2, y: RLS.y };
const RLS_B: Pt = { x: RLS.x + RLS.w / 2, y: RLS.y + RLS.h };

const RESULT = { x: 440, y: 520, w: 400, h: 78 };
const RESULT_T: Pt = { x: RESULT.x + RESULT.w / 2, y: RESULT.y };

export const FeatureRlsIsolation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): unfiltered SELECT could leak real passwords ──
  const uaOp = appear(6) * lf;
  const queryOp = appear(20) * lf;
  const credsOp = appear(34) * lf;
  const t1a = seg(frame, 24, 46);
  const t1aVis = frame >= 24 && frame < 70 ? 1 : 0;
  const t1b = seg(frame, 40, 62);
  const t1bVis = frame >= 40 && frame < 84 ? 1 : 0;
  const credsLit = interpolate(frame, [40, 62, 96, 116], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const alertScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): RLS policies across 10+ tables ──
  const tabOp = TABLES.map((_, i) => appear(132 + i * 8, 14) * lf);
  const tabLit = TABLES.map((_, i) =>
    interpolate(frame, [132 + i * 8, 154 + i * 8, 330, 350], [0, 0.55, 0.55, 0.16], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const tTr = TABLES.map((_, i) => seg(frame, 168 + i * 5, 192 + i * 5));
  const tTrVis = TABLES.map((_, i) => (frame >= 168 + i * 5 && frame < 220 ? 1 : 0));
  const rlsOp = appear(178, 18) * lf;
  const rlsLit = interpolate(frame, [186, 208, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const policyPillIn = seg(frame, 196, 218, Easing.out(Easing.cubic));
  const policyPillOp = policyPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): service_role bypasses RLS → explicit .eq() everywhere ──
  const tRr = seg(frame, 250, 274);
  const tRrVis = frame >= 250 && frame < 300 ? 1 : 0;
  const resultOp = appear(266, 18) * lf;
  const resultLit = interpolate(frame, [274, 296, 330, 350], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const explicitPillIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const explicitPillOp = explicitPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={[USER_A_R, QUERY_L]} color={T.danger} width={2.5} progress={t1a} opacity={0.8 * t1aVis * lf} />
      <Connector pts={[QUERY_R, CREDS_L]} color={T.danger} width={2.5} progress={t1b} opacity={0.8 * t1bVis * lf} />
      {TABLES_B.map((p, i) => (
        <Connector key={i} pts={[p, RLS_T]} color={T.accent} width={2} progress={tTr[i]} opacity={0.7 * tTrVis[i] * lf} />
      ))}
      <Connector pts={[RLS_B, RESULT_T]} color={T.success} width={2.5} progress={tRr} opacity={0.8 * tRrVis * lf} />

      <SchemaNode {...USER_A} state="idle" lit={0.3 * uaOp * lf} opacity={uaOp} label={USER_A.label} fontSize={22} />
      <SchemaNode {...QUERY} state="danger" lit={0.4 * queryOp * lf} opacity={queryOp} label={QUERY.label} fontSize={19} />
      <SchemaNode {...CREDS} state="danger" lit={credsLit} opacity={credsOp} label={CREDS.label} fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>real login passwords</div>
      </SchemaNode>
      <Token pts={[USER_A_R, QUERY_L]} t={t1a} color={T.danger} opacity={t1aVis * lf} />
      <Token pts={[QUERY_R, CREDS_L]} t={t1b} color={T.danger} opacity={t1bVis * lf} />
      <Badge x={CREDS.x + CREDS.w / 2 - 18} y={CREDS.y - 36} kind="cross" scale={alertScale} opacity={alertScale} />

      {TABLES.map((t, i) => (
        <SchemaNode key={t.label} {...t} state="accent" lit={tabLit[i]} opacity={tabOp[i]} label={t.label} fontSize={15} />
      ))}
      {TABLES_B.map((_, i) => (
        <Token key={i} pts={[TABLES_B[i], RLS_T]} t={tTr[i]} opacity={tTrVis[i] * lf} size={10} />
      ))}
      <SchemaNode {...RLS} state="accent" lit={rlsLit} opacity={rlsOp} label="PostgreSQL RLS" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>WHERE user_id = auth.uid()</div>
      </SchemaNode>
      <Pill x={RLS.x + 30} y={RLS.y - 46} text="SELECT · INSERT · UPDATE · DELETE policies" color={T.accent} opacity={policyPillOp} fontSize={16} />

      <SchemaNode {...RESULT} state="success" lit={resultLit} opacity={resultOp} label="User B logs in" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>0 jobs · 0 applications · $0.00</div>
      </SchemaNode>
      <Token pts={[RLS_B, RESULT_T]} t={tRr} color={T.success} opacity={tRrVis * lf} />
      <Pill x={RESULT.x - 20} y={RESULT.y + RESULT.h + 14} text="service_role bypasses RLS → explicit .eq(user_id) everywhere" color={T.amber} opacity={explicitPillOp} fontSize={14} />

      <Caption x={90} y={648} w={1100} text="A single unfiltered SELECT could expose another user's real passwords" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Row-level security policies enforce user_id = auth.uid() on 10+ tables" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Edge Functions bypass RLS via service_role — every query filters manually" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Zero cross-tenant data leaks, verified in production</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Bulletproof isolation, guaranteed at the database level</div>
      </div>
    </AbsoluteFill>
  );
};
