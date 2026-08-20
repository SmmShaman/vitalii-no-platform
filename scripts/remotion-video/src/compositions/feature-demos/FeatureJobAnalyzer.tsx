/**
 * FeatureJobAnalyzer — feature j01 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: FINN.no / NAV.no / LinkedIn dump 500-800+/day into a manual-review
 * bottleneck (4h grind) → job_analyzer Edge Function pulls the CV profile and
 * calls Azure GPT-4's "Vibe & Fit Scanner" for a structured fit_score →
 * batch of 10+ jobs routes through GitHub Actions to dodge Edge Function
 * timeouts → "4h → under 30 min, 90% less time wasted".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SRC = [
  { x: 90, y: 62, w: 210, h: 82, label: "FINN.no" },
  { x: 535, y: 62, w: 210, h: 82, label: "NAV.no" },
  { x: 980, y: 62, w: 210, h: 82, label: "LinkedIn" },
];
const SRC_BOTTOM: Pt[] = SRC.map((s) => ({ x: s.x + s.w / 2, y: s.y + s.h }));

const REVIEW = { x: 465, y: 210, w: 350, h: 104 };
const REVIEW_TOP: Pt = { x: REVIEW.x + REVIEW.w / 2, y: REVIEW.y };
const REVIEW_BOTTOM: Pt = { x: REVIEW.x + REVIEW.w / 2, y: REVIEW.y + REVIEW.h };

const CV = { x: 80, y: 420, w: 230, h: 96 };
const EDGE = { x: 500, y: 420, w: 280, h: 96 };
const AI = { x: 970, y: 420, w: 230, h: 96 };
const CV_R: Pt = { x: CV.x + CV.w, y: CV.y + CV.h / 2 };
const EDGE_L: Pt = { x: EDGE.x, y: EDGE.y + EDGE.h / 2 };
const EDGE_R: Pt = { x: EDGE.x + EDGE.w, y: EDGE.y + EDGE.h / 2 };
const AI_L: Pt = { x: AI.x, y: AI.y + AI.h / 2 };

const SRC_TO_REVIEW: Pt[][] = SRC_BOTTOM.map((p) => [p, REVIEW_TOP]);
const CV_TO_EDGE: Pt[] = [CV_R, EDGE_L];
const EDGE_TO_AI: Pt[] = [EDGE_R, AI_L];

export const FeatureJobAnalyzer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): 3 sources flood a manual-review bottleneck ──
  const srcOp = SRC.map((_, i) => appear(6 + i * 10) * lf);
  const reviewOp = Math.min(1, pop(30)) * lf;
  const reviewLit =
    interpolate(frame, [30, 60, 108, 130], [0, 0.7, 0.7, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const floodPillIn = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const floodPillOp = floodPillIn * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const floodPillDx = (1 - floodPillIn) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;
  const connSrcOp = SRC.map((_, i) => 0.4 * Math.min(srcOp[i], reviewOp));

  // ── Beat 2 (130–235): CV + job_analyzer + Azure GPT-4, token relay ──
  const cvOp = appear(140, 18) * lf;
  const edgeOp = appear(150, 18) * lf;
  const aiOp = appear(160, 18) * lf;
  const t2a = seg(frame, 168, 196);
  const t2aVis = frame >= 168 && frame < 232 ? 1 : 0;
  const t2b = seg(frame, 198, 226);
  const t2bVis = frame >= 198 && frame < 240 ? 1 : 0;
  const edgeLit = interpolate(frame, [168, 190, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const aiLit = interpolate(frame, [198, 220, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const pill2In = seg(frame, 206, 228, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 172, 194, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): batch of 10+ jobs → GitHub Actions dodges timeout ──
  const ghX = pop(248);
  const ghOp = Math.min(1, ghX) * lf;
  const GH = { x: 500, y: 590, w: 280, h: 70 };
  const GH_TOP: Pt = { x: GH.x + GH.w / 2, y: GH.y };
  const EDGE_BOTTOM: Pt = { x: EDGE.x + EDGE.w / 2, y: EDGE.y + EDGE.h };
  const GH_PATH: Pt[] = [EDGE_BOTTOM, GH_TOP];
  const tGH = seg(frame, 252, 280);
  const tGHVis = frame >= 252 && frame < 320 ? 1 : 0;
  const crossScale = pop(252) * interpolate(frame, [278, 292], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const checkScale = pop(292) * lf;
  const pill3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [314, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const hotPillIn = seg(frame, 268, 290, Easing.out(Easing.cubic));
  const hotPillOp = hotPillIn * interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const hotPillDx = (1 - hotPillIn) * 40;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {SRC_TO_REVIEW.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.danger} width={2} opacity={connSrcOp[i]} />
      ))}
      <Connector pts={CV_TO_EDGE} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={EDGE_TO_AI} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={GH_PATH} color={T.amber} width={2.5} progress={tGH} opacity={0.8 * tGHVis * lf} />

      {SRC.map((s, i) => (
        <SchemaNode key={s.label} {...s} state="danger" lit={0.25 * lf} opacity={srcOp[i]} label={s.label} fontSize={22} />
      ))}
      <SchemaNode {...REVIEW} state="danger" lit={reviewLit} opacity={reviewOp} label="Manual review" fontSize={26}>
        <div style={{ fontSize: 15, color: T.muted, fontWeight: 500, marginTop: 2 }}>4+ hours, every day</div>
      </SchemaNode>
      <Pill x={REVIEW.x + 40} y={REVIEW.y - 46} dx={floodPillDx} text="500–800+ listings / day" color={T.danger} opacity={floodPillOp} fontSize={20} />

      <SchemaNode {...CV} state="accent" lit={0.4 * Math.min(1, cvOp) * lf} opacity={cvOp} label="user_profiles" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>anonymized CV</div>
      </SchemaNode>
      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="job_analyzer" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno Edge Function</div>
      </SchemaNode>
      <SchemaNode {...AI} state="accent" lit={aiLit} opacity={aiOp} label="Azure GPT-4" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Vibe & Fit Scanner</div>
      </SchemaNode>
      <Token pts={CV_TO_EDGE} t={t2a} opacity={t2aVis * lf} />
      <Token pts={EDGE_TO_AI} t={t2b} opacity={t2bVis * lf} />
      <Pill x={EDGE.x + 10} y={EDGE.y + EDGE.h + 14} dx={pill2Dx} text="fit_score · pros_and_cons · JSON" color={T.accent} opacity={pill2Op} fontSize={19} />

      <SchemaNode {...GH} state="amber" lit={0.6 * ghOp} opacity={ghOp} label="GitHub Actions" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 1 }}>repository_dispatch</div>
      </SchemaNode>
      <Token pts={GH_PATH} t={tGH} color={T.amber} opacity={tGHVis * lf} />
      <Badge x={EDGE_BOTTOM.x - 18} y={EDGE_BOTTOM.y + 6} kind="cross" scale={crossScale} opacity={crossScale} />
      <Badge x={EDGE_BOTTOM.x - 18} y={EDGE_BOTTOM.y + 6} kind="check" scale={checkScale} opacity={checkScale} />
      <Pill x={GH.x + GH.w + 14} y={GH.y + 18} dx={pill3Dx} text="10+ jobs, batched" color={T.amber} opacity={pill3Op} fontSize={19} />
      <Pill x={AI.x - 30} y={AI.y + AI.h + 14} dx={hotPillDx} text="hot job: fit_score ≥ 50" color={T.amber} opacity={hotPillOp} fontSize={19} />

      <Caption x={90} y={648} w={1100} text="Objective bias-free scoring instead of a 4-hour manual grind" color={T.text} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Token usage logged to system_logs on every call" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Bypasses Edge Function timeouts & API rate limits" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>4+ hours → under 30 minutes</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>90% less time wasted on irrelevant listings</div>
      </div>
    </AbsoluteFill>
  );
};
