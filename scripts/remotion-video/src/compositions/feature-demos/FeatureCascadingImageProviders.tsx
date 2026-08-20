/**
 * FeatureCascadingImageProviders — feature p24 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a single image provider was a lottery — Grok rate-limited, Gemini
 * occasionally returned inappropriate content, Together AI quality was a
 * coin toss, ~25% failure rate → a cascading service tries Grok first, each
 * call wrapped in a 40-second Promise.race timeout, and falls back to
 * Gemini on failure → every attempt logs to image_provider_usage, and the
 * admin panel lets the cascade order be changed live → "~75% to 98%+
 * success".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SOLO = { x: 465, y: 56, w: 350, h: 96 };
const SOLO_BOTTOM: Pt = { x: SOLO.x + SOLO.w / 2, y: SOLO.y + SOLO.h };

const GROK = { x: 200, y: 240, w: 260, h: 96 };
const GEMINI = { x: 820, y: 240, w: 260, h: 96 };
const GROK_R: Pt = { x: GROK.x + GROK.w, y: GROK.y + GROK.h / 2 };
const GEMINI_L: Pt = { x: GEMINI.x, y: GEMINI.y + GEMINI.h / 2 };
const SOLO_TO_GROK: Pt[] = [SOLO_BOTTOM, { x: GROK.x + GROK.w / 2, y: GROK.y }];

const USAGE = { x: 465, y: 420, w: 350, h: 96 };
const USAGE_TOP: Pt = { x: USAGE.x + USAGE.w / 2, y: USAGE.y };
const GROK_BOTTOM: Pt = { x: GROK.x + GROK.w / 2, y: GROK.y + GROK.h };

export const FeatureCascadingImageProviders: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): single provider, ~25% failure rate ──
  const soloOp = appear(6) * lf;
  const soloLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const crossScale = pop(34) * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): Grok first, 40s Promise.race timeout ──
  const grokOp = appear(140, 18) * lf;
  const grokLit = interpolate(frame, [148, 175, 220, 240], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): Grok times out, falls back to Gemini ──
  const grokCrossScale = pop(230) * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const gemOp = appear(238, 16) * lf;
  const gemLit = interpolate(frame, [246, 268, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 240, 268);
  const t3Vis = frame >= 240 && frame < 300 ? 1 : 0;
  const pill3In = seg(frame, 250, 272, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 254, 276, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const usageOp = appear(280, 16) * lf;
  const usageLit = interpolate(frame, [288, 310, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3b = seg(frame, 282, 308);
  const t3bVis = frame >= 282 && frame < 330 ? 1 : 0;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={SOLO_TO_GROK} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={[GROK_R, GEMINI_L]} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />
      <Connector pts={[GROK_BOTTOM, USAGE_TOP]} color={T.success} width={2.5} progress={t3b} opacity={0.8 * t3bVis * lf} />

      <SchemaNode {...SOLO} state="danger" lit={soloLit} opacity={soloOp} label="one provider, no fallback" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>rate limits · bad content · flaky quality</div>
      </SchemaNode>
      <Badge x={SOLO.x + SOLO.w / 2 - 18} y={SOLO.y - 46} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={SOLO.x + 60} y={SOLO.y + SOLO.h + 14} dx={pill1Dx} text="~25% failure rate" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...GROK} state="accent" lit={grokLit} opacity={grokOp} label="Grok (XAI)" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>40s Promise.race timeout</div>
      </SchemaNode>
      <Token pts={SOLO_TO_GROK} t={t2} opacity={t2Vis * lf} />
      <Badge x={GROK.x + GROK.w - 20} y={GROK.y - 12} kind="cross" scale={grokCrossScale} opacity={grokCrossScale} />
      <Pill x={GROK.x - 10} y={GROK.y - 46} dx={pill2Dx} text="tried first, every time" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...GEMINI} state="success" lit={gemLit} opacity={gemOp} label="Gemini (Google)" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>fallback on timeout / failure</div>
      </SchemaNode>
      <Token pts={[GROK_R, GEMINI_L]} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={GEMINI.x - 10} y={GEMINI.y + GEMINI.h + 12} dx={pill3Dx} text="reorderable live from admin panel" color={T.success} opacity={pill3Op} fontSize={16} />

      <SchemaNode {...USAGE} state="success" lit={usageLit} opacity={usageOp} label="image_provider_usage" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>success/failure logged per provider</div>
      </SchemaNode>
      <Token pts={[GROK_BOTTOM, USAGE_TOP]} t={t3b} color={T.success} opacity={t3bVis * lf} />

      <Caption x={90} y={648} w={1100} text="One provider meant a coin-flip on every image generation" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Grok goes first, every call bounded by a hard timeout" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="A timeout falls straight through to Gemini, logged either way" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>~75% to 98%+ generation success</div>
      </div>
    </AbsoluteFill>
  );
};
