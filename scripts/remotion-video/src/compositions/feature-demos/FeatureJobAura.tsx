/**
 * FeatureJobAura — feature j05 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a generic "78% match" tells you nothing about company culture →
 * the extended job-analyzer Edge Function calls Azure GPT-4 for a job_aura
 * classification (6 types) and 5-axis radar_chart_data → a real pentagon
 * radar chart draws on (tech_stack_fit, soft_skills_fit, culture_match,
 * salary_potential, career_growth) → "15+ min of guessing → under 5 seconds".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const JOB = { x: 70, y: 56, w: 220, h: 82 };
const EDGE = { x: 465, y: 210, w: 350, h: 96 };
const JOB_R: Pt = { x: JOB.x + JOB.w, y: JOB.y + JOB.h / 2 };
const EDGE_L: Pt = { x: EDGE.x, y: EDGE.y + EDGE.h / 2 };
const P_JE: Pt[] = [JOB_R, EDGE_L];

const AURA_TYPES = ["Toxic", "Grind", "Stable", "Growth", "Elite", "Startup"];
const AURA_HI = 3; // "Growth"
const CHIP_XS = [110, 290, 470, 650, 830, 1010];
const CHIP_Y = 356;

const RADAR_CX = 640;
const RADAR_CY = 552;
const RADAR_R = 92;
const AXES = [
  { key: "tech_stack_fit", score: 78 },
  { key: "soft_skills_fit", score: 64 },
  { key: "culture_match", score: 90 },
  { key: "salary_potential", score: 58 },
  { key: "career_growth", score: 92 },
];
const axisPt = (i: number, r: number): Pt => {
  const angle = -Math.PI / 2 + i * ((2 * Math.PI) / AXES.length);
  return { x: RADAR_CX + r * Math.cos(angle), y: RADAR_CY + r * Math.sin(angle) };
};

export const FeatureJobAura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): generic 78% match, culture unknown ──
  const jobOp = Math.min(1, pop(10)) * lf;
  const jobLit = interpolate(frame, [10, 34, 96, 118], [0, 0.45, 0.45, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const pctPillIn = seg(frame, 30, 52, Easing.out(Easing.cubic));
  const pctPillOp = pctPillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const qPillIn = seg(frame, 48, 70, Easing.out(Easing.cubic));
  const qPillOp = qPillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (126–236): edge fn classifies job_aura into 6 types ──
  const tJe = seg(frame, 132, 156);
  const tJeVis = frame >= 132 && frame < 190 ? 1 : 0;
  const edgeOp = appear(134, 18) * lf;
  const edgeLit = interpolate(frame, [142, 164, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const chipOp = AURA_TYPES.map((_, i) => appear(172 + i * 10, 14) * lf);
  const chipHiLit = interpolate(frame, [172 + AURA_HI * 10, 172 + AURA_HI * 10 + 16, 330, 350], [0, 1, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 178, 200, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): radar chart draws on ──
  const radarOp = appear(236, 20) * lf;
  const radarProgress = seg(frame, 240, 300, Easing.out(Easing.cubic));
  const gridOpacity = 0.35 * radarOp;
  const radarPillIn = seg(frame, 250, 272, Easing.out(Easing.cubic));
  const radarPillOp = radarPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 254, 276, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  const gridPts = (r: number) => AXES.map((_, i) => axisPt(i, r)).map((p) => `${p.x},${p.y}`).join(" ");
  const dataPts = AXES.map((a, i) => {
    const r = RADAR_R * (a.score / 100) * radarProgress;
    const p = axisPt(i, r);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_JE} color={T.accent} width={2.5} progress={tJe} opacity={0.8 * tJeVis * lf} />

      <SchemaNode {...JOB} state="idle" lit={jobLit} opacity={jobOp} label="Job listing" fontSize={21} />
      <Pill x={JOB.x + 10} y={JOB.y + JOB.h + 14} text="78% match" color={T.muted} opacity={pctPillOp} fontSize={19} />
      <Pill x={870} y={70} text="Culture: ?" color={T.danger} opacity={qPillOp} fontSize={19} />

      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="job-analyzer (extended)" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Azure GPT-4 · job_aura</div>
      </SchemaNode>
      <Token pts={P_JE} t={tJe} opacity={tJeVis * lf} />

      {AURA_TYPES.map((label, i) => {
        const isHi = i === AURA_HI;
        const c = isHi && chipHiLit > 0.5 ? T.success : T.muted;
        return (
          <Pill
            key={label}
            x={CHIP_XS[i]}
            y={CHIP_Y}
            text={label}
            color={c}
            opacity={chipOp[i]}
            fontSize={18}
          />
        );
      })}

      {/* Radar chart */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, opacity: radarOp }}>
        <polygon points={gridPts(RADAR_R)} fill="none" stroke={T.border} strokeWidth={1.5} opacity={gridOpacity} />
        <polygon points={gridPts(RADAR_R * 0.66)} fill="none" stroke={T.border} strokeWidth={1} opacity={gridOpacity * 0.7} />
        <polygon points={gridPts(RADAR_R * 0.33)} fill="none" stroke={T.border} strokeWidth={1} opacity={gridOpacity * 0.5} />
        {AXES.map((_, i) => {
          const p = axisPt(i, RADAR_R);
          return <line key={i} x1={RADAR_CX} y1={RADAR_CY} x2={p.x} y2={p.y} stroke={T.border} strokeWidth={1} opacity={gridOpacity} />;
        })}
        <polygon points={dataPts} fill={hexA(T.success, 0.28)} stroke={T.success} strokeWidth={2.5} opacity={radarOp} />
      </svg>
      {AXES.map((a, i) => {
        const p = axisPt(i, RADAR_R + 34);
        return (
          <div
            key={a.key}
            style={{
              position: "absolute",
              left: p.x - 70,
              top: p.y - 9,
              width: 140,
              textAlign: "center",
              fontSize: 13,
              fontWeight: 600,
              color: T.muted,
              opacity: radarOp,
              fontFamily,
            }}
          >
            {a.key}
          </div>
        );
      })}
      <Pill x={90} y={470} text="radar_chart_data · Recharts" color={T.success} opacity={radarPillOp} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="A percentage says nothing about toxic culture or a grind shop" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="One of 6 aura types — hex_color, tags, explanation, per role" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={140} w={1100} text="5-axis radar: tech fit, soft skills, culture, salary, career growth" color={T.text} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>15+ minutes of guessing → under 5 seconds</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>See the real vibe before you apply</div>
      </div>
    </AbsoluteFill>
  );
};
