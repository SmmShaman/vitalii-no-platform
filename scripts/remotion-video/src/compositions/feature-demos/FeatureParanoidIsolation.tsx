/**
 * FeatureParanoidIsolation — feature j32 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: service_role keys bypass RLS entirely — one forgotten
 * .eq("user_id") across hundreds of queries in scheduled-scanner,
 * job-analyzer, auto_apply.py or api.ts is a leak waiting to happen → a
 * line-by-line audit: scheduled-scanner loops per user, telegram-bot calls
 * getUserIdFromChat() first in every handler, auto_apply.py threads user_id
 * through every subsequent query → zero data leak incidents since.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ROLE = { x: 440, y: 50, w: 400, h: 84, label: "service_role key" };
const ROLE_B: Pt = { x: ROLE.x + ROLE.w / 2, y: ROLE.y + ROLE.h };

const FUNCS = [
  { x: 90, y: 200, w: 220, h: 78, label: "scheduled-scanner" },
  { x: 350, y: 200, w: 220, h: 78, label: "job-analyzer" },
  { x: 610, y: 200, w: 220, h: 78, label: "auto_apply.py" },
  { x: 870, y: 200, w: 220, h: 78, label: "telegram-bot" },
];
const FUNCS_T: Pt[] = FUNCS.map((f) => ({ x: f.x + f.w / 2, y: f.y }));
const FUNCS_B: Pt[] = FUNCS.map((f) => ({ x: f.x + f.w / 2, y: f.y + f.h }));

const AUDIT = { x: 440, y: 350, w: 400, h: 90 };
const AUDIT_T: Pt = { x: AUDIT.x + AUDIT.w / 2, y: AUDIT.y };
const AUDIT_B: Pt = { x: AUDIT.x + AUDIT.w / 2, y: AUDIT.y + AUDIT.h };

const RESULT = { x: 440, y: 500, w: 400, h: 80 };
const RESULT_T: Pt = { x: RESULT.x + RESULT.w / 2, y: RESULT.y };

export const FeatureParanoidIsolation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): service_role bypasses RLS entirely, hundreds of queries ──
  const roleOp = Math.min(1, pop(8)) * lf;
  const roleLit = interpolate(frame, [8, 30, 96, 116], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tRf = FUNCS_T.map((_, i) => seg(frame, 26 + i * 8, 50 + i * 8));
  const tRfVis = FUNCS_T.map((_, i) => (frame >= 26 + i * 8 && frame < 96 ? 1 : 0));
  const funcOp = FUNCS.map((_, i) => appear(34 + i * 8, 14) * lf);
  const funcLit = FUNCS.map((_, i) =>
    interpolate(frame, [34 + i * 8, 56 + i * 8, 96, 116], [0, 0.45, 0.45, 0.14], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const bypassPillIn = seg(frame, 66, 88, Easing.out(Easing.cubic));
  const bypassPillOp = bypassPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): line-by-line audit of every query, every function ──
  const tFa = FUNCS_B.map((_, i) => seg(frame, 138 + i * 6, 162 + i * 6));
  const tFaVis = FUNCS_B.map((_, i) => (frame >= 138 + i * 6 && frame < 200 ? 1 : 0));
  const auditOp = appear(154, 18) * lf;
  const auditLit = interpolate(frame, [162, 184, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const scannerPillIn = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const scannerPillOp = scannerPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): getUserIdFromChat() first call, user_id threaded through ──
  const tAr = seg(frame, 250, 274);
  const tArVis = frame >= 250 && frame < 300 ? 1 : 0;
  const resultOp = appear(266, 18) * lf;
  const resultLit = interpolate(frame, [274, 296, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const threadPillIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const threadPillOp = threadPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      {FUNCS_T.map((p, i) => (
        <Connector key={i} pts={[ROLE_B, p]} color={T.danger} width={2} progress={tRf[i]} opacity={0.6 * tRfVis[i] * lf} />
      ))}
      {FUNCS_B.map((p, i) => (
        <Connector key={i} pts={[p, AUDIT_T]} color={T.accent} width={2} progress={tFa[i]} opacity={0.7 * tFaVis[i] * lf} />
      ))}
      <Connector pts={[AUDIT_B, RESULT_T]} color={T.success} width={2.5} progress={tAr} opacity={0.8 * tArVis * lf} />

      <SchemaNode {...ROLE} state="danger" lit={roleLit} opacity={roleOp} label={ROLE.label} fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>bypasses RLS completely</div>
      </SchemaNode>
      {FUNCS.map((f, i) => (
        <SchemaNode key={f.label} {...f} state="danger" lit={funcLit[i]} opacity={funcOp[i]} label={f.label} fontSize={16} />
      ))}
      {FUNCS_T.map((_, i) => (
        <Token key={i} pts={[ROLE_B, FUNCS_T[i]]} t={tRf[i]} color={T.danger} opacity={tRfVis[i] * lf} size={10} />
      ))}
      <Pill x={ROLE.x + 60} y={ROLE.y + ROLE.h + 14} text="one forgotten .eq(user_id) = a leak" color={T.danger} opacity={bypassPillOp} fontSize={17} />

      <SchemaNode {...AUDIT} state="accent" lit={auditLit} opacity={auditOp} label="Line-by-line code audit" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>every .from().select() verified</div>
      </SchemaNode>
      {FUNCS_B.map((_, i) => (
        <Token key={i} pts={[FUNCS_B[i], AUDIT_T]} t={tFa[i]} opacity={tFaVis[i] * lf} size={10} />
      ))}
      <Pill x={AUDIT.x - 20} y={AUDIT.y - 46} text="scanner loop: per-user, filtered inner queries" color={T.accent} opacity={scannerPillOp} fontSize={15} />

      <SchemaNode {...RESULT} state="success" lit={resultLit} opacity={resultOp} label="Application-level guarantee" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>user_id threaded through every call</div>
      </SchemaNode>
      <Token pts={[AUDIT_B, RESULT_T]} t={tAr} color={T.success} opacity={tArVis * lf} />
      <Pill x={RESULT.x - 30} y={RESULT.y + RESULT.h + 14} text="getUserIdFromChat() — first call, every handler" color={T.success} opacity={threadPillOp} fontSize={14} />

      <Caption x={90} y={648} w={1100} text="Hundreds of service_role queries — one forgotten filter is a leak away" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A meticulous audit verifies user_id filtering on every single query" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Second layer beneath RLS — application code enforces isolation too" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Even a compromised service_role key stays user-scoped</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero data leak incidents since implementation</div>
      </div>
    </AbsoluteFill>
  );
};
