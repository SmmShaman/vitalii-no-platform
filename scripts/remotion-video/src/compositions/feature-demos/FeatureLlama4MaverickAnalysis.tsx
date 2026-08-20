/**
 * FeatureLlama4MaverickAnalysis — feature j52 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: job-analyzer's Gemini 2.5 Flash sometimes struggled with the depth
 * needed for complex Norwegian job descriptions, and its latency could be
 * snappier → supabase/functions/job-analyzer/index.ts switched to
 * meta-llama/llama-4-maverick-17b-128e-instruct via the Groq API, chosen for
 * strong instruction following and a larger context window → scout-8x22b
 * added as a Groq-chain fallback via callGroqWithFallback() → processing
 * time cut ~50% (13s → 6-7s), sharper relevance scores.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const GEMINI_OLD = { x: 480, y: 44, w: 320, h: 88 };

const EDGE = { x: 60, y: 250, w: 300, h: 96 };
const MAVERICK = { x: 470, y: 250, w: 340, h: 96 };
const SCOUT = { x: 920, y: 250, w: 270, h: 96 };

const EDGE_R: Pt = { x: EDGE.x + EDGE.w, y: EDGE.y + EDGE.h / 2 };
const MAV_L: Pt = { x: MAVERICK.x, y: MAVERICK.y + MAVERICK.h / 2 };
const MAV_R: Pt = { x: MAVERICK.x + MAVERICK.w, y: MAVERICK.y + MAVERICK.h / 2 };
const SCOUT_L: Pt = { x: SCOUT.x, y: SCOUT.y + SCOUT.h / 2 };

const P_EM: Pt[] = [EDGE_R, MAV_L];
const P_MS: Pt[] = [MAV_R, SCOUT_L];

export const FeatureLlama4MaverickAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): Gemini 2.5 Flash — shallow on complex NO jobs, slow ──
  const gemOp = Math.min(1, pop(10)) * lf;
  const gemLit = interpolate(frame, [10, 34, 96, 116], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): job-analyzer -> Llama 4 Maverick via Groq ──
  const edgeOp = appear(126, 18) * lf;
  const edgeLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tEm = seg(frame, 148, 172);
  const tEmVis = frame >= 148 && frame < 206 ? 1 : 0;
  const mavOp = appear(150, 18) * lf;
  const mavLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const contextPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const contextPillOp = contextPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): scout-8x22b fallback in the Groq chain ──
  const tMs = seg(frame, 240, 264);
  const tMsVis = frame >= 240 && frame < 300 ? 1 : 0;
  const scoutOp = appear(244, 18) * lf;
  const scoutLit = interpolate(frame, [252, 274, 330, 350], [0, 0.7, 0.7, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const fallbackPillIn = seg(frame, 254, 276, Easing.out(Easing.cubic));
  const fallbackPillOp = fallbackPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_EM} color={T.accent} width={2.5} progress={tEm} opacity={0.8 * tEmVis * lf} />
      <Connector pts={P_MS} color={T.amber} width={2.5} progress={tMs} opacity={0.8 * tMsVis * lf} />

      <SchemaNode {...GEMINI_OLD} state="danger" lit={gemLit} opacity={gemOp} label="Gemini 2.5 Flash" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>13s · limited depth on complex NO jobs</div>
      </SchemaNode>
      <Badge x={GEMINI_OLD.x + GEMINI_OLD.w / 2 - 18} y={GEMINI_OLD.y + GEMINI_OLD.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="job-analyzer/index.ts" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno Edge Function</div>
      </SchemaNode>
      <SchemaNode {...MAVERICK} state="success" lit={mavLit} opacity={mavOp} label="Llama 4 Maverick" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>via Groq API</div>
      </SchemaNode>
      <SchemaNode {...SCOUT} state="amber" lit={scoutLit} opacity={scoutOp} label="scout-8x22b" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>fallback</div>
      </SchemaNode>
      <Token pts={P_EM} t={tEm} opacity={tEmVis * lf} />
      <Token pts={P_MS} t={tMs} color={T.amber} opacity={tMsVis * lf} />
      <Pill x={MAVERICK.x + 10} y={MAVERICK.y - 46} dx={0} text="128e context, strong instruction following" color={T.amber} opacity={contextPillOp} fontSize={15} />
      <Pill x={SCOUT.x - 40} y={SCOUT.y + SCOUT.h + 14} text="callGroqWithFallback()" color={T.amber} opacity={fallbackPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Gemini 2.5 Flash sometimes lacked depth on complex Norwegian roles" color={T.danger} opacity={cap1} fontSize={20} weight={600} />
      <Caption x={90} y={648} w={1100} text="job-analyzer now runs on Groq's Llama 4 Maverick instead" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="scout-8x22b stands ready in the same Groq chain if it stumbles" color={T.amber} opacity={cap3} fontSize={21} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~50% faster (13s → 6-7s) · sharper relevance scores</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Faster, sharper matching for less</div>
      </div>
    </AbsoluteFill>
  );
};
