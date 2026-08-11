/**
 * FeatureLLMFallback — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: article → task router → Gemini fails (pool exhausted) →
 * fallback chain gpt-oss-120b → llama-70b → NVIDIA NIM succeeds →
 * article published; daily-limit pill + "Zero stuck articles".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import {
  Bg,
  SchemaNode,
  Connector,
  Token,
  Caption,
  Badge,
  Pill,
  Pt,
  seg,
  loopFade,
  fontFamily,
} from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ARTICLE = { x: 70, y: 290, w: 210, h: 130 };
const ROUTER = { x: 420, y: 275, w: 250, h: 160 };
const GEMINI = { x: 810, y: 110, w: 230, h: 90 };
const C1 = { x: 810, y: 285, w: 230, h: 84 }; // gpt-oss-120b
const C2 = { x: 810, y: 405, w: 230, h: 84 }; // llama-70b
const C3 = { x: 810, y: 525, w: 230, h: 84 }; // NVIDIA NIM

const P_A_R: Pt[] = [
  { x: ARTICLE.x + ARTICLE.w, y: 355 },
  { x: ROUTER.x, y: 355 },
];
const P_R_G: Pt[] = [
  { x: ROUTER.x + ROUTER.w, y: 320 },
  { x: 745, y: 320 },
  { x: 745, y: 155 },
  { x: GEMINI.x, y: 155 },
];
const P_R_C1: Pt[] = [
  { x: ROUTER.x + ROUTER.w, y: 395 },
  { x: 745, y: 395 },
  { x: 745, y: 327 },
  { x: C1.x, y: 327 },
];
const P_C1_C2: Pt[] = [
  { x: 925, y: C1.y + C1.h },
  { x: 925, y: C2.y },
];
const P_C2_C3: Pt[] = [
  { x: 925, y: C2.y + C2.h },
  { x: 925, y: C3.y },
];

const CHIPS: { label: string; color: string }[] = [
  { label: "quality", color: T.amber },
  { label: "bulk", color: T.accent },
  { label: "default", color: T.muted },
];

export const FeatureLLMFallback: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat 1 (0–105): Article emits token → router; chips highlight ──
  const t1 = seg(frame, 12, 52);
  const t1Vis = frame >= 12 && frame < 54 ? 1 : 0;
  const routerLit =
    interpolate(frame, [50, 62, 210, 240], [0, 0.9, 0.9, 0.35], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  const articleLit = interpolate(frame, [0, 10, 20, 40], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const chipHi = (i: number) => {
    const s = 58 + i * 13;
    return interpolate(frame, [s, s + 7, s + 14, s + 26], [0, 1, 1, 0.25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  };

  // ── Beat 2 (105–210): token → Gemini; red flash + X; caption ──
  const t2 = seg(frame, 112, 148);
  const t2Vis = frame >= 112 && frame < 150 ? 1 : 0;
  const gemPulse =
    frame >= 150
      ? 0.55 + 0.35 * Math.abs(Math.sin(((frame - 150) / 30) * Math.PI)) *
        interpolate(frame, [150, 215], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
  const gemLit = Math.min(1, gemPulse) * lf;
  const xScale = pop(153) * lf;
  const cap1In = seg(frame, 162, 182, Easing.out(Easing.cubic));
  const cap1Out = 1 - seg(frame, 338, 354, Easing.in(Easing.quad));
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 3 (210–345): cascade down the chain; success; published ──
  const t3a = seg(frame, 215, 243); // router → 120b
  const t3aVis = frame >= 215 && frame < 245 ? 1 : 0;
  const t3b = seg(frame, 256, 282); // 120b → llama
  const t3bVis = frame >= 256 && frame < 284 ? 1 : 0;
  const t3c = seg(frame, 294, 316); // llama → NVIDIA
  const t3cVis = frame >= 294 && frame < 318 ? 1 : 0;
  const c1Lit = interpolate(frame, [243, 252, 300, 330], [0, 0.85, 0.85, 0.3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }) * lf;
  const c2Lit = interpolate(frame, [282, 291, 320, 345], [0, 0.85, 0.85, 0.3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }) * lf;
  const c3Flash =
    frame >= 316
      ? 0.6 + 0.4 * Math.abs(Math.sin(((frame - 316) / 22) * Math.PI)) *
        interpolate(frame, [316, 400], [1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
  const c3Lit = Math.min(1, c3Flash) * lf;
  const checkScale = pop(318) * lf;
  const pubScale = pop(332) * lf;
  const articlePubLit = interpolate(frame, [330, 342], [0, 0.75], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }) * lf;

  // ── Beat 4 (345–450): limit pill + end caption ──
  const pillIn = seg(frame, 352, 374, Easing.out(Easing.cubic));
  const pillOp = pillIn * lf;
  const pillDx = (1 - pillIn) * 70;
  const cap2 = seg(frame, 362, 384, Easing.out(Easing.cubic)) * lf;
  const cap2Check = pop(368) * lf;

  const chainOp = 1; // chain always visible (dim) — loop-safe base layout

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {/* Connectors (base, always drawn) */}
      <Connector pts={P_A_R} />
      <Connector pts={P_R_G} />
      <Connector pts={P_R_C1} opacity={chainOp} />
      <Connector pts={P_C1_C2} opacity={chainOp} />
      <Connector pts={P_C2_C3} opacity={chainOp} />

      {/* Active connector highlights while tokens travel */}
      <Connector pts={P_A_R} color={T.accent} width={2.5} progress={t1} opacity={0.7 * t1Vis * lf} />
      <Connector pts={P_R_G} color={T.accent} width={2.5} progress={t2} opacity={0.7 * t2Vis * lf} />
      <Connector pts={P_R_C1} color={T.accent} width={2.5} progress={t3a} opacity={0.7 * t3aVis * lf} />
      <Connector pts={P_C1_C2} color={T.accent} width={2.5} progress={t3b} opacity={0.7 * t3bVis * lf} />
      <Connector pts={P_C2_C3} color={T.accent} width={2.5} progress={t3c} opacity={0.7 * t3cVis * lf} />

      {/* Article */}
      <SchemaNode {...ARTICLE} state="success" lit={Math.max(articleLit, articlePubLit)}>
        {/* doc icon lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "58%", marginBottom: 2 }}>
          {[1, 0.85, 0.65].map((wf, i) => (
            <div key={i} style={{ height: 5, width: `${wf * 100}%`, borderRadius: 3, background: T.muted, opacity: 0.55 }} />
          ))}
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, color: T.text }}>Article</div>
      </SchemaNode>
      {/* published badge on Article */}
      <div
        style={{
          position: "absolute",
          left: ARTICLE.x + ARTICLE.w - 118,
          top: ARTICLE.y - 20,
          transform: `scale(${pubScale})`,
          transformOrigin: "center",
          opacity: pubScale,
          padding: "7px 16px",
          borderRadius: 999,
          background: T.success,
          color: "#12321c",
          fontSize: 24,
          fontWeight: 700,
          boxShadow: `0 0 20px ${hexA(T.success, 0.5)}`,
        }}
      >
        published
      </div>

      {/* Task router with chips */}
      <SchemaNode {...ROUTER} state="accent" lit={routerLit} label="Task router" fontSize={30}>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          {CHIPS.map((c, i) => (
            <div
              key={c.label}
              style={{
                padding: "5px 13px",
                borderRadius: 999,
                fontSize: 20,
                fontWeight: 600,
                color: c.color,
                border: `1px solid ${hexA(c.color, 0.4 + 0.6 * chipHi(i))}`,
                background: hexA(c.color, 0.06 + 0.14 * chipHi(i)),
                boxShadow: chipHi(i) > 0.05 ? `0 0 ${14 * chipHi(i)}px ${hexA(c.color, 0.4 * chipHi(i))}` : "none",
                transform: `scale(${1 + 0.08 * chipHi(i)})`,
              }}
            >
              {c.label}
            </div>
          ))}
        </div>
      </SchemaNode>

      {/* Gemini */}
      <SchemaNode {...GEMINI} state="danger" lit={gemLit} label="Gemini" fontSize={30} />
      <Badge x={GEMINI.x + GEMINI.w - 18} y={GEMINI.y - 16} kind="cross" scale={xScale} opacity={xScale} />

      {/* Fallback chain */}
      <SchemaNode {...C1} state="accent" lit={c1Lit} label="gpt-oss-120b" fontSize={28} />
      <SchemaNode {...C2} state="accent" lit={c2Lit} label="llama-70b" fontSize={28} />
      <SchemaNode {...C3} state="success" lit={c3Lit} label="NVIDIA NIM" fontSize={28} />
      <Badge x={C3.x + C3.w - 18} y={C3.y - 16} kind="check" scale={checkScale} opacity={checkScale} />

      {/* Tokens */}
      <Token pts={P_A_R} t={t1} opacity={t1Vis * lf} />
      <Token pts={P_R_G} t={t2} opacity={t2Vis * lf} />
      <Token pts={P_R_C1} t={t3a} opacity={t3aVis * lf} />
      <Token pts={P_C1_C2} t={t3b} opacity={t3bVis * lf} />
      <Token pts={P_C2_C3} t={t3c} opacity={t3cVis * lf} />

      {/* Daily limit pill near Gemini */}
      <Pill
        x={GEMINI.x - 15}
        y={GEMINI.y + GEMINI.h + 18}
        dx={pillDx}
        text="GEMINI_DAILY_LIMIT: 150/day"
        color={T.amber}
        opacity={pillOp}
        fontSize={24}
      />

      {/* Captions (bottom center) */}
      <Caption
        x={140}
        y={648}
        w={1000}
        text="2026-07-24: pool exhausted — 13 articles stuck"
        color={T.danger}
        opacity={cap1}
        fontSize={26}
        weight={600}
      />
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
          opacity: cap2,
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
            transform: `scale(${cap2Check})`,
            boxShadow: `0 0 16px ${hexA(T.success, 0.5)}`,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero stuck articles</div>
      </div>
    </AbsoluteFill>
  );
};
