/**
 * FeatureFormMemory — feature j10 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: webcruiter.no form fails twice, succeeds on the 3rd try — but
 * nothing is remembered, every new instance starts from zero → a
 * site_form_memory JSONB table + normalize_domain_for_memory() collapses
 * 12+ platform variants to a canonical domain, get_form_memory() retrieves
 * the last successful config → _calc_max_steps() shrinks the step budget as
 * confidence grows (25 → 12 steps) → success rate 60% → 92%, -40% API cost.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FORM = { x: 500, y: 30, w: 280, h: 80 };
const ATTEMPTS = [
  { x: 160, y: 160, w: 200, h: 70, label: "attempt 1" },
  { x: 400, y: 160, w: 200, h: 70, label: "attempt 2" },
  { x: 640, y: 160, w: 200, h: 70, label: "attempt 3 ✓" },
];
const NORM = { x: 90, y: 330, w: 280, h: 90 };
const TABLE = { x: 500, y: 330, w: 300, h: 90 };
const GETMEM = { x: 900, y: 330, w: 280, h: 90 };
const STEPS = { x: 460, y: 480, w: 360, h: 70 };

const FORM_B: Pt = { x: FORM.x + FORM.w / 2, y: FORM.y + FORM.h };
const ATT_T: Pt[] = ATTEMPTS.map((a) => ({ x: a.x + a.w / 2, y: a.y }));
const P_FORM_ATT: Pt[][] = ATT_T.map((a) => [FORM_B, a]);
const ATT3_B: Pt = { x: ATTEMPTS[2].x + ATTEMPTS[2].w / 2, y: ATTEMPTS[2].y + ATTEMPTS[2].h };
const NORM_T: Pt = { x: NORM.x + NORM.w / 2, y: NORM.y };
const NORM_R: Pt = { x: NORM.x + NORM.w, y: NORM.y + NORM.h / 2 };
const TABLE_L: Pt = { x: TABLE.x, y: TABLE.y + TABLE.h / 2 };
const TABLE_R: Pt = { x: TABLE.x + TABLE.w, y: TABLE.y + TABLE.h / 2 };
const GETMEM_L: Pt = { x: GETMEM.x, y: GETMEM.y + GETMEM.h / 2 };
const TABLE_B: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.h };
const STEPS_T: Pt = { x: STEPS.x + STEPS.w / 2, y: STEPS.y };

const P_A3_NORM: Pt[] = [ATT3_B, NORM_T];
const P_NORM_TABLE: Pt[] = [NORM_R, TABLE_L];
const P_TABLE_GET: Pt[] = [TABLE_R, GETMEM_L];
const P_TABLE_STEPS: Pt[] = [TABLE_B, STEPS_T];

export const FeatureFormMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–112): 3 attempts, fail-fail-succeed, nothing remembered ──
  const formOp = Math.min(1, pop(4)) * lf;
  const formLit = interpolate(frame, [4, 26, 88, 108], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tAtt = [0, 1, 2].map((i) => seg(frame, 16 + i * 22, 34 + i * 22));
  const tAttVis = [0, 1, 2].map((i) => (frame >= 16 + i * 22 && frame < 56 + i * 22 ? 1 : 0));
  const attOp = ATTEMPTS.map((_, i) => appear(14 + i * 22, 14) * lf);
  const attLit = [0, 1, 2].map((i) => {
    const s = 16 + i * 22;
    return interpolate(frame, [s, s + 16, 100, 118], [0, i === 2 ? 0.75 : 0.5, i === 2 ? 0.75 : 0.5, 0.15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const xScale = [0, 1].map((i) => pop(34 + i * 22 + 12) * interpolate(frame, [96, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf);
  const checkScale1 = pop(78) * lf;
  const noMemPillIn = seg(frame, 82, 104, Easing.out(Easing.cubic));
  const noMemPillOp = noMemPillIn * interpolate(frame, [110, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [104, 124], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–252): normalize_domain → site_form_memory → get_form_memory ──
  const tA3n = seg(frame, 130, 152);
  const tA3nVis = frame >= 130 && frame < 154 ? 1 : 0;
  const normOp = appear(132, 18) * lf;
  const normLit = interpolate(frame, [140, 162, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tNt = seg(frame, 156, 178);
  const tNtVis = frame >= 156 && frame < 180 ? 1 : 0;
  const tableOp = appear(160, 18) * lf;
  const tableLit = interpolate(frame, [168, 190, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tTg = seg(frame, 184, 206);
  const tTgVis = frame >= 184 && frame < 208 ? 1 : 0;
  const getMemOp = appear(188, 18) * lf;
  const getMemLit = interpolate(frame, [196, 218, 330, 350], [0, 0.65, 0.65, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const domainPillIn = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const domainPillOp = domainPillIn * interpolate(frame, [244, 264], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [244, 264], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (268–352): _calc_max_steps() shrinks the budget as confidence grows ──
  const tTs = seg(frame, 270, 292);
  const tTsVis = frame >= 270 && frame < 294 ? 1 : 0;
  const stepsOp = appear(274, 18) * lf;
  const stepsLit = interpolate(frame, [282, 304, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const stepsPillIn = seg(frame, 296, 318, Easing.out(Easing.cubic));
  const stepsPillOp = stepsPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 282, 304, Easing.out(Easing.cubic));
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

      {P_FORM_ATT.map((pts, i) => (
        <Connector key={i} pts={pts} color={i === 2 ? T.success : T.danger} width={2.5} progress={tAtt[i]} opacity={0.8 * tAttVis[i] * lf} />
      ))}
      <Connector pts={P_A3_NORM} color={T.accent} width={2.5} progress={tA3n} opacity={0.8 * tA3nVis * lf} />
      <Connector pts={P_NORM_TABLE} color={T.accent} width={2.5} progress={tNt} opacity={0.8 * tNtVis * lf} />
      <Connector pts={P_TABLE_GET} color={T.accent} width={2.5} progress={tTg} opacity={0.8 * tTgVis * lf} />
      <Connector pts={P_TABLE_STEPS} color={T.amber} width={2.5} progress={tTs} opacity={0.8 * tTsVis * lf} />

      <SchemaNode {...FORM} state="idle" lit={formLit} opacity={formOp} label="webcruiter.no form" fontSize={19} />

      {ATTEMPTS.map((a, i) => (
        <SchemaNode key={i} {...a} state={i === 2 ? "success" : "danger"} lit={attLit[i]} opacity={attOp[i]} label={a.label} fontSize={17} />
      ))}
      {[0, 1].map((i) => (
        <Badge key={i} x={ATTEMPTS[i].x + ATTEMPTS[i].w / 2 - 16} y={ATTEMPTS[i].y - 34} kind="cross" scale={xScale[i]} opacity={xScale[i]} size={32} />
      ))}
      <Badge x={ATTEMPTS[2].x + ATTEMPTS[2].w / 2 - 16} y={ATTEMPTS[2].y - 34} kind="check" scale={checkScale1} opacity={checkScale1} size={32} />
      {[0, 1, 2].map((i) => (
        <Token key={i} pts={P_FORM_ATT[i]} t={tAtt[i]} color={i === 2 ? T.success : T.danger} opacity={tAttVis[i] * lf} />
      ))}
      <Pill x={ATTEMPTS[2].x - 30} y={ATTEMPTS[2].y + ATTEMPTS[2].h + 14} text="hard-won experience — never saved" color={T.danger} opacity={noMemPillOp} fontSize={16} />

      <SchemaNode {...NORM} state="accent" lit={normLit} opacity={normOp} label="normalize_domain_for_memory()" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>12+ platforms → canonical domain</div>
      </SchemaNode>
      <Token pts={P_A3_NORM} t={tA3n} color={T.accent} opacity={tA3nVis * lf} />

      <SchemaNode {...TABLE} state="accent" lit={tableLit} opacity={tableOp} label="site_form_memory" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Supabase JSONB</div>
      </SchemaNode>
      <Token pts={P_NORM_TABLE} t={tNt} opacity={tNtVis * lf} />
      <Pill x={TABLE.x - 20} y={TABLE.y - 46} text="*.webcruiter.no → webcruiter.no" color={T.accent} opacity={domainPillOp} fontSize={15} />

      <SchemaNode {...GETMEM} state="accent" lit={getMemLit} opacity={getMemOp} label="get_form_memory()" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>latest successful config</div>
      </SchemaNode>
      <Token pts={P_TABLE_GET} t={tTg} opacity={tTgVis * lf} />

      <SchemaNode {...STEPS} state="amber" lit={stepsLit} opacity={stepsOp} label="_calc_max_steps()" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>confidence-based step budget</div>
      </SchemaNode>
      <Token pts={P_TABLE_STEPS} t={tTs} color={T.amber} opacity={tTsVis * lf} />
      <Pill x={STEPS.x - 10} y={STEPS.y - 42} text="25 steps → 12 steps by the 5th attempt" color={T.amber} opacity={stepsPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Fail, fail, succeed on the 3rd try — but nothing is remembered" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="JSONB memory + domain normalization — the bot now remembers" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="More confidence, fewer steps — directly cuts Skyvern token cost" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Success rate 60% → 92% across all platforms</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>-40% Skyvern API token cost</div>
      </div>
    </AbsoluteFill>
  );
};
