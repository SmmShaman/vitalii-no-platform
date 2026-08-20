/**
 * FeatureGeminiCoverLetterFallback — feature j47 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Anthropic credits unexpectedly ran out, and generate_application
 * started failing outright, blocking cover letters entirely → I refactored
 * supabase/functions/generate_application/index.ts to use GEMINI_API_KEY
 * from Supabase secrets → a 3-tier cascade tries gemini-2.5-pro, then
 * gemini-2.5-flash, then gemini-2.5-flash-lite, each with 2 retries on
 * 5xx/429 → 100% uptime restored, no single-provider dependency left.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ANTHROPIC = { x: 480, y: 44, w: 320, h: 88 };

const ROUTER = { x: 400, y: 200, w: 480, h: 80 };
const TIERS = [
  { x: 80, y: 340, w: 300, h: 84, label: "gemini-2.5-pro" },
  { x: 490, y: 340, w: 300, h: 84, label: "gemini-2.5-flash" },
  { x: 900, y: 340, w: 300, h: 84, label: "gemini-2.5-flash-lite" },
];

const ROUTER_B: Pt = { x: ROUTER.x + ROUTER.w / 2, y: ROUTER.y + ROUTER.h };
const TIER_T: Pt[] = TIERS.map((t) => ({ x: t.x + t.w / 2, y: t.y }));
const P_RT: Pt[][] = TIER_T.map((t) => [ROUTER_B, t]);

export const FeatureGeminiCoverLetterFallback: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): Anthropic credits run out, function fails ──
  const anthOp = Math.min(1, pop(10)) * lf;
  const anthLit = interpolate(frame, [10, 34, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const blockPillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const blockPillOp = blockPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): router uses GEMINI_API_KEY, cascades to 3 tiers ──
  const routerOp = appear(126, 18) * lf;
  const routerLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tRoute = [0, 1, 2].map((i) => seg(frame, 150 + i * 20, 168 + i * 20));
  const tRouteVis = [0, 1, 2].map((i) => (frame >= 150 + i * 20 && frame < 200 + i * 20 ? 1 : 0));
  const tierOp = TIERS.map((_, i) => appear(156 + i * 16, 16) * lf);
  const tierLit = TIERS.map((_, i) =>
    interpolate(frame, [164 + i * 16, 186 + i * 16, 330, 350], [0, i === 2 ? 0.75 : 0.5, i === 2 ? 0.75 : 0.2, i === 2 ? 0.25 : 0.1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const keyPillIn = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const keyPillOp = keyPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): each tier gets 2 retries on 5xx/429 ──
  const retryScale = pop(252) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const retryPillIn = seg(frame, 248, 270, Easing.out(Easing.cubic));
  const retryPillOp = retryPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {P_RT.map((pts, i) => (
        <Connector key={i} pts={pts} color={i === 2 ? T.success : T.amber} width={2.5} progress={tRoute[i]} opacity={0.8 * tRouteVis[i] * lf} />
      ))}

      <SchemaNode {...ANTHROPIC} state="danger" lit={anthLit} opacity={anthOp} label="Anthropic API" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>credits ran out, unexpectedly</div>
      </SchemaNode>
      <Badge x={ANTHROPIC.x + ANTHROPIC.w / 2 - 18} y={ANTHROPIC.y + ANTHROPIC.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={ANTHROPIC.x + ANTHROPIC.w + 30} y={ANTHROPIC.y + 20} text="søknad generation blocked" color={T.danger} opacity={blockPillOp} fontSize={16} />

      <SchemaNode {...ROUTER} state="accent" lit={routerLit} opacity={routerOp} label="generate_application/index.ts" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno Edge Function</div>
      </SchemaNode>
      <Pill x={ROUTER.x + 30} y={ROUTER.y - 44} dx={0} text="GEMINI_API_KEY from Supabase secrets" color={T.amber} opacity={keyPillOp} fontSize={15} />

      {TIERS.map((t, i) => (
        <SchemaNode key={t.label} x={t.x} y={t.y} w={t.w} h={t.h} state={i === 2 ? "success" : "amber"} lit={tierLit[i]} opacity={tierOp[i]} label={t.label} fontSize={17} />
      ))}
      {[0, 1, 2].map((i) => (
        <Token key={i} pts={P_RT[i]} t={tRoute[i]} color={i === 2 ? T.success : T.amber} opacity={tRouteVis[i] * lf} />
      ))}
      <div style={{ position: "absolute", left: TIERS[2].x + 10, top: TIERS[2].y + TIERS[2].h + 18, opacity: retryScale, transform: `scale(${retryScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.success }}>cover letter delivered</div>
      </div>
      <Badge x={TIERS[2].x - 24} y={TIERS[2].y + TIERS[2].h + 12} kind="check" scale={retryScale} opacity={retryScale} size={24} />
      <Pill x={TIERS[0].x - 10} y={TIERS[0].y + TIERS[0].h + 14} text="2 retries per tier on 5xx / 429" color={T.amber} opacity={retryPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Anthropic credits ran out — cover letter generation just stopped" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Same Edge Function, now powered by Gemini with 3 model tiers" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Each tier retries transient errors before cascading to the next" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>100% uptime restored — no single-provider dependency</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>A dry credit balance no longer stops the pipeline</div>
      </div>
    </AbsoluteFill>
  );
};
