/**
 * FeatureGeminiPreScreen — feature v14 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: pre-moderate-news and analyze-rss-article both scored articles on
 * the same shared Groq pool, the pool that also does rewrite/translation
 * work — comparing 29 already-scored articles found Groq averaged 5.45 with
 * 15 approvals while a stricter check averaged 2.97 with only 2 → a new
 * GEMINI_FREE_API_KEY (unbilled, confirmed via its 429 quota metric name)
 * now takes first hop on a new "moderation" route used by both functions,
 * Groq only as fallback → thinkingBudget:0 only works on the Lite model, so
 * free-key calls get 3x the output budget to survive the full model's
 * "thinking" tax; on the quality/rewrite route the free key sits behind
 * NVIDIA, capped near 20 calls/day → RSS volume held steady (6.60 vs 6.63
 * mean) but Gemini flagged off-topic pieces Groq scored 5-6 and would have
 * passed, 30% scored 8+ vs 16% under Groq, ~100 calls/day of the 500/day cap.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PRE_MOD = { x: 90, y: 50, w: 300, h: 88 };
const RSS = { x: 890, y: 50, w: 300, h: 88 };
const PRE_MOD_B: Pt = { x: PRE_MOD.x + PRE_MOD.w / 2, y: PRE_MOD.y + PRE_MOD.h };
const RSS_B: Pt = { x: RSS.x + RSS.w / 2, y: RSS.y + RSS.h };

const GEMINI = { x: 390, y: 230, w: 500, h: 110 };
const GEMINI_TL: Pt = { x: GEMINI.x + 90, y: GEMINI.y };
const GEMINI_TR: Pt = { x: GEMINI.x + GEMINI.w - 90, y: GEMINI.y };
const GEMINI_B: Pt = { x: GEMINI.x + GEMINI.w / 2, y: GEMINI.y + GEMINI.h };

const GROQ = { x: 390, y: 430, w: 500, h: 90 };
const GROQ_T: Pt = { x: GROQ.x + GROQ.w / 2, y: GROQ.y };

const PRE_MOD_TO_GROQ: Pt[] = [PRE_MOD_B, GROQ_T];
const RSS_TO_GROQ: Pt[] = [RSS_B, GROQ_T];
const PRE_MOD_TO_GEMINI: Pt[] = [PRE_MOD_B, GEMINI_TL];
const RSS_TO_GEMINI: Pt[] = [RSS_B, GEMINI_TR];
const GEMINI_TO_GROQ: Pt[] = [GEMINI_B, GROQ_T];

export const FeatureGeminiPreScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): one shared Groq pool, scored too generously ──
  const preModOp = pop(6) * lf;
  const preModLit = interpolate(frame, [6, 30, 420, 440], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const rssOp = pop(14) * lf;
  const rssLit = interpolate(frame, [14, 38, 420, 440], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const groqOp = appear(22, 18) * lf;
  const groqLit = interpolate(frame, [22, 46, 420, 440], [0, 0.45, 0.45, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const crossScale = pop(40) * interpolate(frame, [96, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  const tDirectA = seg(frame, 26, 52);
  const directVisA = frame >= 26 && frame < 130 ? 1 : 0;
  const tDirectB = seg(frame, 30, 56);
  const directVisB = frame >= 30 && frame < 130 ? 1 : 0;

  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 26, 48, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (120–225): free Gemini key becomes first hop, Groq is fallback ──
  const gemOp = appear(134, 18) * lf;
  const gemLit = interpolate(frame, [140, 164, 420, 440], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2a = seg(frame, 142, 168);
  const t2aVis = frame >= 142 && frame < 210 ? 1 : 0;
  const t2b = seg(frame, 146, 172);
  const t2bVis = frame >= 146 && frame < 214 ? 1 : 0;
  const fallbackT = seg(frame, 192, 216);
  const fallbackVis = frame >= 192 ? 1 : 0;
  const fallbackOp = fallbackVis * interpolate(frame, [192, 210], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  const pill2In = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [206, 228], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 152, 174, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [206, 228], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (225–330): thinkingBudget quirk, quality route caps at NVIDIA ──
  const pill3In = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 250, 272, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (330–450): result ──
  const metricOp = seg(frame, 340, 362, Easing.out(Easing.cubic)) * lf;
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={PRE_MOD_TO_GROQ} color={T.danger} width={2.5} progress={tDirectA} opacity={0.6 * directVisA * lf} />
      <Connector pts={RSS_TO_GROQ} color={T.danger} width={2.5} progress={tDirectB} opacity={0.6 * directVisB * lf} />
      <Connector pts={PRE_MOD_TO_GEMINI} color={T.accent} width={2.5} progress={t2a} opacity={0.85 * t2aVis * lf} />
      <Connector pts={RSS_TO_GEMINI} color={T.accent} width={2.5} progress={t2b} opacity={0.85 * t2bVis * lf} />
      <Connector pts={GEMINI_TO_GROQ} color={T.amber} width={2} progress={fallbackT} opacity={fallbackOp} dashed />

      <SchemaNode {...PRE_MOD} state="accent" lit={preModLit} opacity={preModOp} label="pre-moderate-news" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>spam / quality gate</div>
      </SchemaNode>
      <SchemaNode {...RSS} state="accent" lit={rssLit} opacity={rssOp} label="analyze-rss-article" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>was on the "bulk" route</div>
      </SchemaNode>

      <SchemaNode {...GROQ} state="idle" lit={groqLit} opacity={groqOp} label="shared Groq pool" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>now fallback only</div>
      </SchemaNode>
      <Badge x={GROQ.x + GROQ.w - 24} y={GROQ.y - 16} kind="cross" scale={crossScale} opacity={crossScale} size={28} />
      <Pill x={GROQ.x + 30} y={GROQ.y + GROQ.h + 16} text="Groq avg 5.45 (15/29 approved) vs strict avg 2.97 (2/29)" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...GEMINI} state="success" lit={gemLit} opacity={gemOp} label="GEMINI_FREE_API_KEY — moderation route" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>no billing account · 429 quota name confirms free tier</div>
      </SchemaNode>
      <Token pts={PRE_MOD_TO_GEMINI} t={t2a} opacity={t2aVis * lf} />
      <Token pts={RSS_TO_GEMINI} t={t2b} opacity={t2bVis * lf} />
      <Pill x={GEMINI.x + 40} y={GEMINI.y - 44} text="first hop for both — Groq falls back only if exhausted" color={T.success} opacity={pill2Op} fontSize={16} />

      <Pill x={GROQ.x - 20} y={GEMINI.y + GEMINI.h + 24} text="thinkingBudget:0 rejected on full models — free key gets 3x output tokens" color={T.amber} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Pre-moderation and RSS relevance shared one pool — Groq scored too generously" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A free, unbilled Gemini key now takes first hop; Groq is fallback only" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Quality-route rewrites still keep the free key behind NVIDIA — capped near 20 calls/day" color={T.amber} opacity={cap3} fontSize={21} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: T.muted }}>~100 calls/day combined, well under the 500/day free-tier cap</div>
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
        <div style={{ fontSize: 25, fontWeight: 600, color: T.success }}>flags what Groq missed — 30% scored 8+ vs 16% before</div>
      </div>
    </AbsoluteFill>
  );
};
