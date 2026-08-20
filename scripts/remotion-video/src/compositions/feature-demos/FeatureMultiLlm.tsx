/**
 * FeatureMultiLlm — feature p07 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a 4-hour Azure OpenAI outage once killed the entire content
 * pipeline — a single point of failure → LLMProviderService routes through
 * Azure, Gemini, Grok, and Groq, hopping past whichever is down → image
 * generation cascades specifically: Grok for creative prompts, falling back
 * to Gemini for technical illustrations → "zero downtime, best of both
 * worlds".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ROUTER = { x: 465, y: 40, w: 350, h: 88 };
const PROVIDERS = [
  { x: 70, y: 210, w: 250, h: 92, label: "Azure OpenAI" },
  { x: 350, y: 210, w: 250, h: 92, label: "Google Gemini" },
  { x: 630, y: 210, w: 250, h: 92, label: "Grok (XAI)" },
  { x: 910, y: 210, w: 250, h: 92, label: "Groq" },
];

const GROK_IMG = { x: 350, y: 400, w: 280, h: 90 };
const GEMINI_IMG = { x: 660, y: 400, w: 280, h: 90 };

const ROUTER_B: Pt = { x: ROUTER.x + ROUTER.w / 2, y: ROUTER.y + ROUTER.h };
const PROV_T: Pt[] = PROVIDERS.map((p) => ({ x: p.x + p.w / 2, y: p.y }));
const P_ROUTE: Pt[][] = PROV_T.map((p) => [ROUTER_B, p]);
const GROK_IMG_R: Pt = { x: GROK_IMG.x + GROK_IMG.w, y: GROK_IMG.y + GROK_IMG.h / 2 };
const GEMINI_IMG_L: Pt = { x: GEMINI_IMG.x, y: GEMINI_IMG.y + GEMINI_IMG.h / 2 };
const P_GG: Pt[] = [GROK_IMG_R, GEMINI_IMG_L];

export const FeatureMultiLlm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): Azure outage kills the single-vendor pipeline ──
  const azureOp = Math.min(1, pop(10)) * lf;
  const azureLit = interpolate(frame, [10, 34, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(44) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const outagePillIn = seg(frame, 38, 60, Easing.out(Easing.cubic));
  const outagePillOp = outagePillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): router cascades past the dead provider ──
  const routerOp = appear(126, 18) * lf;
  const routerLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const provOp = PROVIDERS.map((_, i) => appear(140 + i * 10, 16) * lf);
  const tRoute = [0, 1, 2, 3].map((i) => seg(frame, 160 + i * 22, 178 + i * 22));
  const tRouteVis = [0, 1, 2, 3].map((i) => (frame >= 160 + i * 22 && frame < 200 + i * 22 ? 1 : 0));
  const azureDeadLit = 0.15 * lf;
  const geminiHiLit = interpolate(frame, [182, 200, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const fallbackPillIn = seg(frame, 186, 208, Easing.out(Easing.cubic));
  const fallbackPillOp = fallbackPillIn * interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (250–340): image-gen cascade — Grok creative → Gemini technical ──
  const grokImgOp = appear(252, 18) * lf;
  const grokImgLit = interpolate(frame, [260, 282, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGg = seg(frame, 268, 290);
  const tGgVis = frame >= 268 && frame < 320 ? 1 : 0;
  const geminiImgOp = appear(272, 18) * lf;
  const geminiImgLit = interpolate(frame, [280, 302, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const abPillIn = seg(frame, 258, 280, Easing.out(Easing.cubic));
  const abPillOp = abPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {P_ROUTE.map((pts, i) => (
        <Connector
          key={i}
          pts={pts}
          color={i === 0 ? T.danger : i === 1 ? T.success : T.accent}
          width={2.5}
          progress={tRoute[i]}
          opacity={0.8 * tRouteVis[i] * lf}
        />
      ))}
      <Connector pts={P_GG} color={T.amber} width={2.5} progress={tGg} opacity={0.8 * tGgVis * lf} />

      <SchemaNode {...ROUTER} state="accent" lit={routerLit} opacity={routerOp} label="LLMProviderService" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>routes, falls back automatically</div>
      </SchemaNode>

      {PROVIDERS.map((p, i) => (
        <SchemaNode
          key={p.label}
          x={p.x}
          y={p.y}
          w={p.w}
          h={p.h}
          state={i === 0 ? "danger" : i === 1 ? "success" : "idle"}
          lit={i === 0 ? Math.max(azureLit, azureDeadLit) : i === 1 ? geminiHiLit : 0.2 * lf}
          opacity={i === 0 ? azureOp : provOp[i]}
          label={p.label}
          fontSize={19}
        />
      ))}
      <Badge x={PROVIDERS[0].x + PROVIDERS[0].w / 2 - 18} y={PROVIDERS[0].y + PROVIDERS[0].h + 6} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={PROVIDERS[0].x - 10} y={PROVIDERS[0].y - 46} text="4-hour outage — pipeline dead" color={T.danger} opacity={outagePillOp} fontSize={17} />
      <Pill x={PROVIDERS[1].x - 10} y={PROVIDERS[1].y + PROVIDERS[1].h + 44} text="automatic fallback, zero downtime" color={T.success} opacity={fallbackPillOp} fontSize={16} />

      {[0, 1, 2, 3].map((i) => (
        <Token key={i} pts={P_ROUTE[i]} t={tRoute[i]} color={i === 0 ? T.danger : T.accent} opacity={tRouteVis[i] * lf} />
      ))}

      <SchemaNode {...GROK_IMG} state="amber" lit={grokImgLit} opacity={grokImgOp} label="Grok · creative prompts" fontSize={17} />
      <SchemaNode {...GEMINI_IMG} state="amber" lit={geminiImgLit} opacity={geminiImgOp} label="Gemini · technical illustration" fontSize={16} />
      <Token pts={P_GG} t={tGg} color={T.amber} opacity={tGgVis * lf} />
      <Pill x={GROK_IMG.x - 20} y={GROK_IMG.y - 46} text="regenerate-translations — A/B tests providers" color={T.amber} opacity={abPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="A single vendor outage once killed the whole pipeline" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="4 providers, dynamic priority — the router hops past whichever is down" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Image gen cascades too — Grok for creative, Gemini for technical" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Zero downtime during every outage since</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Best of both worlds — creative and technical</div>
      </div>
    </AbsoluteFill>
  );
};
