/**
 * FeatureCommentReplies — feature p05 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 20+ daily comments across Facebook, Instagram, and the blog cost
 * 1-2 manual hours → sync-comments (every 30 min) pulls them in, each one
 * scored -1..+1 by Azure sentiment analysis, then generate-comment-reply
 * drafts a context-aware reply → the draft lands in Telegram with
 * Reply/Edit/Ignore buttons, a human taps one → "1-2 hours → under 10
 * minutes, human-in-the-loop keeps the brand voice".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SRC = [
  { x: 90, y: 50, w: 220, h: 80, label: "Facebook" },
  { x: 530, y: 50, w: 220, h: 80, label: "Instagram" },
  { x: 970, y: 50, w: 220, h: 80, label: "Blog" },
];
const SYNC = { x: 465, y: 200, w: 350, h: 88 };
const SENTIMENT = { x: 260, y: 344, w: 320, h: 92 };
const REPLY = { x: 700, y: 344, w: 320, h: 92 };
const TG = { x: 465, y: 494, w: 350, h: 88 };

const SRC_B: Pt[] = SRC.map((s) => ({ x: s.x + s.w / 2, y: s.y + s.h }));
const SYNC_T: Pt = { x: SYNC.x + SYNC.w / 2, y: SYNC.y };
const SYNC_B: Pt = { x: SYNC.x + SYNC.w / 2, y: SYNC.y + SYNC.h };
const SENTIMENT_T: Pt = { x: SENTIMENT.x + SENTIMENT.w / 2, y: SENTIMENT.y };
const SENTIMENT_R: Pt = { x: SENTIMENT.x + SENTIMENT.w, y: SENTIMENT.y + SENTIMENT.h / 2 };
const REPLY_L: Pt = { x: REPLY.x, y: REPLY.y + REPLY.h / 2 };
const REPLY_B: Pt = { x: REPLY.x + REPLY.w / 2, y: REPLY.y + REPLY.h };
const TG_T: Pt = { x: TG.x + TG.w / 2, y: TG.y };

const P_SRC_SYNC: Pt[][] = SRC_B.map((p) => [p, SYNC_T]);
const P_SS: Pt[] = [SYNC_B, SENTIMENT_T];
const P_SR: Pt[] = [SENTIMENT_R, REPLY_L];
const P_RT: Pt[] = [REPLY_B, { x: REPLY_B.x, y: 466 }, TG_T];

export const FeatureCommentReplies: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): 20+ comments a day, all answered by hand ──
  const srcOp = SRC.map((_, i) => appear(8 + i * 12) * lf);
  const syncOp = Math.min(1, pop(38)) * lf;
  const syncLit = interpolate(frame, [38, 62, 100, 118], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const connOp = SRC.map((_, i) => 0.4 * Math.min(srcOp[i], syncOp));
  const pillIn = seg(frame, 48, 70, Easing.out(Easing.cubic));
  const pillOp = pillIn * interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 46, 68, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (126–246): sentiment scored, reply drafted ──
  const tSs = seg(frame, 128, 150);
  const tSsVis = frame >= 128 && frame < 178 ? 1 : 0;
  const sentimentOp = appear(130, 18) * lf;
  const sentimentLit = interpolate(frame, [138, 160, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const gaugeX = seg(frame, 150, 200, Easing.out(Easing.cubic));
  const tSr = seg(frame, 182, 204);
  const tSrVis = frame >= 182 && frame < 230 ? 1 : 0;
  const replyOp = appear(184, 18) * lf;
  const replyLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 166, 188, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–340): Telegram — Reply / Edit / Ignore, human taps ──
  const tRt = seg(frame, 250, 272);
  const tRtVis = frame >= 250 && frame < 300 ? 1 : 0;
  const tgOp = appear(254, 18) * lf;
  const tgLit = interpolate(frame, [262, 284, 330, 350], [0, 0.7, 0.7, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const btnOp = [0, 1, 2].map((i) => appear(268 + i * 10, 12) * lf);
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

      {P_SRC_SYNC.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.danger} width={2} opacity={connOp[i]} />
      ))}
      <Connector pts={P_SS} color={T.accent} width={2.5} progress={tSs} opacity={0.8 * tSsVis * lf} />
      <Connector pts={P_SR} color={T.accent} width={2.5} progress={tSr} opacity={0.8 * tSrVis * lf} />
      <Connector pts={P_RT} color={T.accent} width={2.5} progress={tRt} opacity={0.8 * tRtVis * lf} />

      {SRC.map((s, i) => (
        <SchemaNode key={s.label} {...s} state="danger" lit={0.2 * lf} opacity={srcOp[i]} label={s.label} fontSize={20} />
      ))}
      <SchemaNode {...SYNC} state="danger" lit={syncLit} opacity={syncOp} label="20+ comments / day" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>sync-comments · every 30 min</div>
      </SchemaNode>
      <Pill x={SYNC.x - 20} y={SYNC.y - 46} text="1-2 hours, manually, every day" color={T.danger} opacity={pillOp} fontSize={19} />

      <SchemaNode {...SENTIMENT} state="accent" lit={sentimentLit} opacity={sentimentOp} label="Sentiment score" fontSize={19}>
        <div
          style={{
            width: 220,
            height: 6,
            borderRadius: 3,
            background: T.border,
            marginTop: 8,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${gaugeX * 78}%`, background: `linear-gradient(90deg, ${T.danger}, ${T.success})` }} />
        </div>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 4 }}>−1 ··· +1</div>
      </SchemaNode>
      <SchemaNode {...REPLY} state="accent" lit={replyLit} opacity={replyOp} label="generate-comment-reply" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>article context + sentiment</div>
      </SchemaNode>
      <Token pts={P_SS} t={tSs} opacity={tSsVis * lf} />
      <Token pts={P_SR} t={tSr} opacity={tSrVis * lf} />
      <Token pts={P_RT} t={tRt} opacity={tRtVis * lf} />

      <SchemaNode {...TG} state="accent" lit={tgLit} opacity={tgOp} label="Telegram bot" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>draft ready for review</div>
      </SchemaNode>
      <Pill x={TG.x + 20} y={TG.y + TG.h + 14} text="✓ Reply" color={T.success} opacity={btnOp[0]} fontSize={17} />
      <Pill x={TG.x + 140} y={TG.y + TG.h + 14} text="Edit" color={T.amber} opacity={btnOp[1]} fontSize={17} />
      <Pill x={TG.x + 240} y={TG.y + TG.h + 14} text="Ignore" color={T.muted} opacity={btnOp[2]} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="20+ comments a day, every reply typed out by hand" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Sentiment scored, then a context-aware draft is written" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Human taps Reply, Edit, or Ignore — full control preserved" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>1-2 hours → under 10 minutes daily</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Human-in-the-loop keeps the brand voice</div>
      </div>
    </AbsoluteFill>
  );
};
