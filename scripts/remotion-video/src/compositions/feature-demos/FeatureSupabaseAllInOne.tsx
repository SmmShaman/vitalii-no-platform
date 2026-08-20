/**
 * FeatureSupabaseAllInOne — feature j38 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: piecing together PostgreSQL, Auth0, Lambda, S3, Pusher and API
 * Gateway means 5-7 separate configs, billings, API keys — a constant
 * cognitive drain for a solo dev → one Supabase project: PostgreSQL for
 * 10+ tables, Auth for JWTs, 14 Deno Edge Functions, Storage for resumes,
 * Realtime WebSockets, RLS for isolation → zero DevOps overhead, $100+/mo
 * AWS equivalent down to $25/mo Pro plan.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SERVICES = [
  { x: 60, y: 55, w: 170, h: 66, label: "PostgreSQL" },
  { x: 250, y: 55, w: 170, h: 66, label: "Auth0" },
  { x: 440, y: 55, w: 170, h: 66, label: "Lambda" },
  { x: 630, y: 55, w: 170, h: 66, label: "S3" },
  { x: 820, y: 55, w: 170, h: 66, label: "Pusher" },
  { x: 1010, y: 55, w: 210, h: 66, label: "API Gateway" },
];
const SERVICES_B: Pt[] = SERVICES.map((s) => ({ x: s.x + s.w / 2, y: s.y + s.h }));

const COST = { x: 460, y: 195, w: 360, h: 78 };
const COST_T: Pt = { x: COST.x + COST.w / 2, y: COST.y };

const SUPA = { x: 440, y: 330, w: 400, h: 100 };
const SUPA_T: Pt = { x: SUPA.x + SUPA.w / 2, y: SUPA.y };
const SUPA_B: Pt = { x: SUPA.x + SUPA.w / 2, y: SUPA.y + SUPA.h };

const FEATS = [
  { x: 130, y: 500, w: 210, h: 70, label: "10+ tables + RLS" },
  { x: 390, y: 500, w: 210, h: 70, label: "14 Edge Functions" },
  { x: 650, y: 500, w: 210, h: 70, label: "Auth + Storage" },
  { x: 910, y: 500, w: 210, h: 70, label: "Realtime" },
];
const FEATS_T: Pt[] = FEATS.map((f) => ({ x: f.x + f.w / 2, y: f.y }));

export const FeatureSupabaseAllInOne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): 5-7 separate services, each its own config/billing/keys ──
  const svcOp = SERVICES.map((_, i) => appear(4 + i * 6) * lf);
  const svcLit = SERVICES.map((_, i) =>
    interpolate(frame, [4 + i * 6, 26 + i * 6, 96, 116], [0, 0.4, 0.4, 0.12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const costOp = Math.min(1, pop(46)) * lf;
  const costLit = interpolate(frame, [46, 68, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const connSvcOp = SERVICES.map((_, i) => 0.35 * Math.min(svcOp[i], costOp));
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): consolidated into one Supabase project ──
  const supaOp = Math.min(1, pop(140)) * lf;
  const supaLit = interpolate(frame, [140, 162, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const oneUrlPillIn = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const oneUrlPillOp = oneUrlPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): PostgreSQL, Edge Functions, Auth/Storage, Realtime all live in one project ──
  const tF = FEATS_T.map((_, i) => seg(frame, 250 + i * 6, 274 + i * 6));
  const tFVis = FEATS_T.map((_, i) => (frame >= 250 + i * 6 && frame < 300 ? 1 : 0));
  const featOp = FEATS.map((_, i) => appear(258 + i * 6, 14) * lf);
  const featLit = FEATS.map((_, i) =>
    interpolate(frame, [258 + i * 6, 280 + i * 6, 330, 350], [0, 0.65, 0.65, 0.18], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const rlsPillIn = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const rlsPillOp = rlsPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      {SERVICES_B.map((p, i) => (
        <Connector key={i} pts={[p, COST_T]} color={T.danger} width={1.6} opacity={connSvcOp[i]} />
      ))}
      {FEATS_T.map((p, i) => (
        <Connector key={i} pts={[SUPA_B, p]} color={T.success} width={2} progress={tF[i]} opacity={0.7 * tFVis[i] * lf} />
      ))}

      {SERVICES.map((s, i) => (
        <SchemaNode key={s.label} {...s} state="danger" lit={svcLit[i]} opacity={svcOp[i]} label={s.label} fontSize={15} />
      ))}
      <SchemaNode {...COST} state="danger" lit={costLit} opacity={costOp} label="5–7 configs, billings, API keys" fontSize={18} />

      <SchemaNode {...SUPA} state="accent" lit={supaLit} opacity={supaOp} label="One Supabase project" fontSize={26} />
      <Pill x={SUPA.x + 40} y={SUPA.y - 46} text="single project URL + service_role key" color={T.accent} opacity={oneUrlPillOp} fontSize={16} />

      {FEATS.map((f, i) => (
        <SchemaNode key={f.label} {...f} state="success" lit={featLit[i]} opacity={featOp[i]} label={f.label} fontSize={16} />
      ))}
      {FEATS_T.map((_, i) => (
        <Token key={i} pts={[SUPA_B, FEATS_T[i]]} t={tF[i]} color={T.success} opacity={tFVis[i] * lf} size={10} />
      ))}
      <Pill x={FEATS[1].x - 20} y={FEATS[1].y + FEATS[1].h + 14} text="strict per-user RLS isolation throughout" color={T.success} opacity={rlsPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="5-7 separate services — each its own config, billing, and API keys" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="One project replaces the whole stack — a single URL, a single key" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Database, functions, auth, storage, realtime — all under one roof" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>$100+/month AWS equivalent → $25/month Pro plan</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero DevOps overhead, concept to MVP fast</div>
      </div>
    </AbsoluteFill>
  );
};
