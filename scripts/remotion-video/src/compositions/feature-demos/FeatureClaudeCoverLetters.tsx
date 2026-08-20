/**
 * FeatureClaudeCoverLetters — feature j49 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Gemini/Groq handled cover letters but struggled with formal
 * Norwegian tone, and Ukrainian translation sometimes mixed in English →
 * a callClaude() function added Claude Haiku (claude-haiku-4-5-20251001) to
 * generate_application/index.ts, and callLLM now prioritizes
 * Claude → Gemini → Groq → the Ukrainian prompt was fixed for Cyrillic-only
 * output → ~30% less manual review, 100% uptime via the 3-tier chain.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const OLD = { x: 380, y: 44, w: 400, h: 88 };

const ROUTER = { x: 400, y: 200, w: 480, h: 80 };
const TIERS = [
  { x: 80, y: 340, w: 280, h: 84, label: "Claude Haiku" },
  { x: 500, y: 340, w: 260, h: 84, label: "Gemini" },
  { x: 900, y: 340, w: 260, h: 84, label: "Groq" },
];

const ROUTER_B: Pt = { x: ROUTER.x + ROUTER.w / 2, y: ROUTER.y + ROUTER.h };
const TIER_T: Pt[] = TIERS.map((t) => ({ x: t.x + t.w / 2, y: t.y }));
const P_RT: Pt[][] = TIER_T.map((t) => [ROUTER_B, t]);

export const FeatureClaudeCoverLetters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): formal Norwegian tone off, Ukrainian mixed English ──
  const oldOp = Math.min(1, pop(10)) * lf;
  const oldLit = interpolate(frame, [10, 34, 96, 116], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): callLLM prioritizes Claude, cascades to fallbacks ──
  const routerOp = appear(126, 18) * lf;
  const routerLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tRoute = [0, 1, 2].map((i) => seg(frame, 150 + i * 20, 168 + i * 20));
  const tRouteVis = [0, 1, 2].map((i) => (frame >= 150 + i * 20 && frame < 200 + i * 20 ? 1 : 0));
  const tierOp = TIERS.map((_, i) => appear(156 + i * 16, 16) * lf);
  const tierLit = TIERS.map((_, i) =>
    interpolate(frame, [164 + i * 16, 186 + i * 16, 330, 350], [0, i === 0 ? 0.75 : 0.4, i === 0 ? 0.75 : 0.2, i === 0 ? 0.3 : 0.1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const primaryPillIn = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const primaryPillOp = primaryPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): Ukrainian prompt fixed — Cyrillic-only ──
  const cyrillicScale = pop(252) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const cyrillicPillIn = seg(frame, 248, 270, Easing.out(Easing.cubic));
  const cyrillicPillOp = cyrillicPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {P_RT.map((pts, i) => (
        <Connector key={i} pts={pts} color={i === 0 ? T.success : T.amber} width={2.5} progress={tRoute[i]} opacity={0.8 * tRouteVis[i] * lf} />
      ))}

      <SchemaNode {...OLD} state="danger" lit={oldLit} opacity={oldOp} label="Formal tone felt slightly off" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>Ukrainian output mixed in English</div>
      </SchemaNode>
      <Badge x={OLD.x + OLD.w / 2 - 18} y={OLD.y + OLD.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...ROUTER} state="accent" lit={routerLit} opacity={routerOp} label="callLLM() orchestrator" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>generate_application/index.ts</div>
      </SchemaNode>
      <Pill x={ROUTER.x + 60} y={ROUTER.y - 44} dx={0} text="Claude → Gemini → Groq priority" color={T.amber} opacity={primaryPillOp} fontSize={15} />

      {TIERS.map((t, i) => (
        <SchemaNode key={t.label} x={t.x} y={t.y} w={t.w} h={t.h} state={i === 0 ? "success" : "amber"} lit={tierLit[i]} opacity={tierOp[i]} label={t.label} fontSize={19} />
      ))}
      {[0, 1, 2].map((i) => (
        <Token key={i} pts={P_RT[i]} t={tRoute[i]} color={i === 0 ? T.success : T.amber} opacity={tRouteVis[i] * lf} />
      ))}
      <div style={{ position: "absolute", left: TIERS[0].x + 10, top: TIERS[0].y + TIERS[0].h + 18, opacity: cyrillicScale, transform: `scale(${cyrillicScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.success }}>Cyrillic-only UA translation</div>
      </div>
      <Badge x={TIERS[0].x - 24} y={TIERS[0].y + TIERS[0].h + 12} kind="check" scale={cyrillicScale} opacity={cyrillicScale} size={24} />
      <Pill x={TIERS[1].x - 20} y={TIERS[1].y + TIERS[1].h + 14} text="claude-haiku-4-5-20251001, tracked cost" color={T.success} opacity={cyrillicPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Complex Norwegian instructions and Ukrainian output needed manual fixes" color={T.danger} opacity={cap1} fontSize={20} weight={600} />
      <Caption x={90} y={648} w={1100} text="Claude Haiku now leads, Gemini and Groq stand ready behind it" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The Ukrainian prompt was fixed to guarantee Cyrillic-only output" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~30% less manual review · 100% uptime, 3-tier chain</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Norwegian nuance handled, uptime guaranteed</div>
      </div>
    </AbsoluteFill>
  );
};
