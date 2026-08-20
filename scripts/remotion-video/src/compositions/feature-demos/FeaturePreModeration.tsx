/**
 * FeaturePreModeration — feature p01 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 6 Telegram channels + RSS feeds dump 50-80 articles/day, ~70% spam,
 * into a 2-hour manual moderation grind → pre-moderate-news calls
 * Jobbot-gpt-4.1-mini with a prompt loaded live from ai_prompts (no
 * redeploy) → rejected articles are discarded immediately, never touching
 * the articles table, while approved ones pass through → "2+ hours → 15
 * minutes, prompt refined 12+ times with zero code changes".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SRC1 = { x: 140, y: 54, w: 300, h: 88 };
const SRC2 = { x: 840, y: 54, w: 300, h: 88 };
const QUEUE = { x: 465, y: 208, w: 350, h: 104 };

const PROMPT = { x: 80, y: 400, w: 250, h: 92 };
const EDGE = { x: 420, y: 400, w: 340, h: 100 };
const ARTICLES = { x: 850, y: 400, w: 260, h: 100 };

const SRC1_B: Pt = { x: SRC1.x + SRC1.w / 2, y: SRC1.y + SRC1.h };
const SRC2_B: Pt = { x: SRC2.x + SRC2.w / 2, y: SRC2.y + SRC2.h };
const QUEUE_T: Pt = { x: QUEUE.x + QUEUE.w / 2, y: QUEUE.y };
const QUEUE_B: Pt = { x: QUEUE.x + QUEUE.w / 2, y: QUEUE.y + QUEUE.h };
const PROMPT_R: Pt = { x: PROMPT.x + PROMPT.w, y: PROMPT.y + PROMPT.h / 2 };
const EDGE_L: Pt = { x: EDGE.x, y: EDGE.y + EDGE.h / 2 };
const EDGE_T: Pt = { x: EDGE.x + EDGE.w / 2, y: EDGE.y };
const EDGE_R: Pt = { x: EDGE.x + EDGE.w, y: EDGE.y + EDGE.h / 2 };
const ARTICLES_L: Pt = { x: ARTICLES.x, y: ARTICLES.y + ARTICLES.h / 2 };

const P_S1: Pt[] = [SRC1_B, QUEUE_T];
const P_S2: Pt[] = [SRC2_B, QUEUE_T];
const P_QE: Pt[] = [QUEUE_B, EDGE_T];
const P_PE: Pt[] = [PROMPT_R, EDGE_L];
const P_EA: Pt[] = [EDGE_R, ARTICLES_L];

export const FeaturePreModeration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): 6 channels + RSS flood a manual queue ──
  const src1Op = appear(8) * lf;
  const src2Op = appear(20) * lf;
  const queueOp = Math.min(1, pop(34)) * lf;
  const queueLit = interpolate(frame, [34, 60, 100, 120], [0, 0.65, 0.65, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const connSrcOp = Math.min(1, Math.min(src1Op, src2Op)) * Math.min(1, queueOp) * 0.4;
  const spamPillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const spamPillOp = spamPillIn * interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 48, 70, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [104, 124], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–236): queue → edge fn (+ live prompt) classifies ──
  const tQe = seg(frame, 130, 152);
  const tQeVis = frame >= 130 && frame < 182 ? 1 : 0;
  const edgeOp = appear(132, 18) * lf;
  const edgeLit = interpolate(frame, [140, 162, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const promptOp = appear(156, 18) * lf;
  const promptLit = interpolate(frame, [164, 186, 330, 350], [0, 0.65, 0.65, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tPe = seg(frame, 168, 190);
  const tPeVis = frame >= 168 && frame < 216 ? 1 : 0;
  const cap2In = seg(frame, 172, 194, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [224, 244], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const jsonPillIn = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const jsonPillOp = jsonPillIn * interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): reject discarded, approve reaches articles table ──
  const tEa = seg(frame, 246, 270);
  const tEaVis = frame >= 246 && frame < 310 ? 1 : 0;
  const articlesOp = appear(250, 18) * lf;
  const articlesLit = interpolate(frame, [258, 280, 330, 350], [0, 0.7, 0.7, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(256) * interpolate(frame, [312, 330], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const rejectPillIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const rejectPillOp = rejectPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
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

      <Connector pts={P_S1} color={T.danger} width={2} opacity={connSrcOp} />
      <Connector pts={P_S2} color={T.danger} width={2} opacity={connSrcOp} />
      <Connector pts={P_QE} color={T.accent} width={2.5} progress={tQe} opacity={0.8 * tQeVis * lf} />
      <Connector pts={P_PE} color={T.amber} width={2.5} progress={tPe} opacity={0.8 * tPeVis * lf} />
      <Connector pts={P_EA} color={T.success} width={2.5} progress={tEa} opacity={0.8 * tEaVis * lf} />

      <SchemaNode {...SRC1} state="danger" lit={0.2 * lf} opacity={src1Op} label="6 Telegram channels" fontSize={20} />
      <SchemaNode {...SRC2} state="danger" lit={0.2 * lf} opacity={src2Op} label="RSS feeds" fontSize={20} />
      <SchemaNode {...QUEUE} state="danger" lit={queueLit} opacity={queueOp} label="Moderation queue" fontSize={25}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>50–80/day, ~70% spam</div>
      </SchemaNode>
      <Pill x={QUEUE.x + 40} y={QUEUE.y - 46} text="2+ hours, manually, every day" color={T.danger} opacity={spamPillOp} fontSize={19} />

      <SchemaNode {...PROMPT} state="amber" lit={promptLit} opacity={promptOp} label="ai_prompts" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>editable, no redeploy</div>
      </SchemaNode>
      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="pre-moderate-news" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Jobbot-gpt-4.1-mini</div>
      </SchemaNode>
      <SchemaNode {...ARTICLES} state="success" lit={articlesLit} opacity={articlesOp} label="articles table" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>approved / flagged</div>
      </SchemaNode>
      <Token pts={P_QE} t={tQe} opacity={tQeVis * lf} />
      <Token pts={P_PE} t={tPe} color={T.amber} opacity={tPeVis * lf} />
      <Token pts={P_EA} t={tEa} color={T.success} opacity={tEaVis * lf} />
      <Pill x={EDGE.x + 20} y={EDGE.y + EDGE.h + 14} text="approve · reject · flag" color={T.accent} opacity={jsonPillOp} fontSize={18} />

      <Badge x={EDGE.x + EDGE.w / 2 - 60} y={EDGE.y + EDGE.h - 16} kind="cross" scale={crossScale} opacity={crossScale} size={30} />
      <Pill x={EDGE.x - 30} y={EDGE.y + EDGE.h + 52} text="rejected → discarded, never stored" color={T.danger} opacity={rejectPillOp} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="70% spam, 2+ hours of manual review, every single day" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Prompt loaded live from ai_prompts — edit it, no redeploy needed" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={340} w={1100} text="Rejected content never reaches the articles table or the bot" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>2+ hours → 15 minutes of daily review</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Prompt refined 12+ times, zero code changes</div>
      </div>
    </AbsoluteFill>
  );
};
