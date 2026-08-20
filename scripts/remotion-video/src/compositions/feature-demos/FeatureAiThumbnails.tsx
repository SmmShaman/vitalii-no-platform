/**
 * FeatureAiThumbnails — feature p11 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: manual thumbnail design costs 15-20 minutes per video for
 * mediocre CTR → generate-ai-thumbnail.js extracts title/takeaways/summary,
 * Gemini generates 4 concepts each hooking a different psychological angle
 * (data point, emotional face, high contrast, provocative question) →
 * all 4 land in a Telegram moderation channel as inline images, one tap
 * picks the winner → 15-20 min collapses to 5 seconds, with A/B testing
 * built in for free.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ARTICLE = { x: 460, y: 30, w: 360, h: 70 };
const GEMINI = { x: 460, y: 150, w: 360, h: 80 };
const THUMBS = [
  { x: 90, y: 280, w: 260, h: 80, label: "striking data point" },
  { x: 370, y: 280, w: 260, h: 80, label: "emotional human face" },
  { x: 650, y: 280, w: 260, h: 80, label: "high visual contrast" },
  { x: 930, y: 280, w: 260, h: 80, label: "provocative question" },
];
const TELEGRAM = { x: 460, y: 410, w: 360, h: 80 };

const ARTICLE_B: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y + ARTICLE.h };
const GEMINI_T: Pt = { x: GEMINI.x + GEMINI.w / 2, y: GEMINI.y };
const GEMINI_B: Pt = { x: GEMINI.x + GEMINI.w / 2, y: GEMINI.y + GEMINI.h };
const TH_T: Pt[] = THUMBS.map((t) => ({ x: t.x + t.w / 2, y: t.y }));
const TH_B: Pt[] = THUMBS.map((t) => ({ x: t.x + t.w / 2, y: t.y + t.h }));
const TELEGRAM_T: Pt = { x: TELEGRAM.x + TELEGRAM.w / 2, y: TELEGRAM.y };

const P_ART_GEM: Pt[] = [ARTICLE_B, GEMINI_T];
const P_GEM_TH: Pt[][] = TH_T.map((t) => [GEMINI_B, t]);
const P_TH_TG: Pt[][] = TH_B.map((t) => [t, TELEGRAM_T]);

export const FeatureAiThumbnails: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–104): 15-20 min manual design, mediocre CTR ──
  const artOp = Math.min(1, pop(4)) * lf;
  const artLit = interpolate(frame, [4, 26, 84, 104], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const slowPillIn = seg(frame, 30, 52, Easing.out(Easing.cubic));
  const slowPillOp = slowPillIn * interpolate(frame, [86, 106], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 18, 40, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (110–248): Gemini generates 4 psychological-hook concepts ──
  const tAg = seg(frame, 112, 134);
  const tAgVis = frame >= 112 && frame < 190 ? 1 : 0;
  const gemOp = appear(116, 18) * lf;
  const gemLit = interpolate(frame, [124, 146, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGt = [0, 1, 2, 3].map((i) => seg(frame, 148 + i * 14, 168 + i * 14));
  const tGtVis = [0, 1, 2, 3].map((i) => (frame >= 148 + i * 14 && frame < 330 ? 1 : 0));
  const thOp = THUMBS.map((_, i) => appear(150 + i * 14, 16) * lf);
  const thLit = THUMBS.map((_, i) => {
    const s = 148 + i * 14;
    return interpolate(frame, [s, s + 16, 330, 350], [0, 0.65, 0.65, 0.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const cap2In = seg(frame, 150, 172, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [244, 264], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–350): all 4 land in Telegram, one tap picks ──
  const tTt = [0, 1, 2, 3].map((i) => seg(frame, 254 + i * 8, 276 + i * 8));
  const tTtVis = [0, 1, 2, 3].map((i) => (frame >= 254 + i * 8 && frame < 330 ? 1 : 0));
  const tgOp = appear(258, 18) * lf;
  const tgLit = interpolate(frame, [266, 288, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const checkScale3 = pop(300) * lf;
  const cap3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (360–450): result ──
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;
  const metricOp = seg(frame, 366, 388, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_ART_GEM} color={T.accent} width={2.5} progress={tAg} opacity={0.8 * tAgVis * lf} />
      {P_GEM_TH.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.amber} width={2} progress={tGt[i]} opacity={0.7 * tGtVis[i] * lf} />
      ))}
      {P_TH_TG.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.success} width={2} progress={tTt[i]} opacity={0.6 * tTtVis[i] * lf} />
      ))}

      <SchemaNode {...ARTICLE} state="idle" lit={artLit} opacity={artOp} label="article: title, takeaways, summary" fontSize={16} />
      <Pill x={ARTICLE.x - 20} y={ARTICLE.y + ARTICLE.h + 14} text="15-20 min manual design — mediocre CTR" color={T.danger} opacity={slowPillOp} fontSize={16} />

      <SchemaNode {...GEMINI} state="accent" lit={gemLit} opacity={gemOp} label="Google Gemini API" fontSize={19} />
      <Token pts={P_ART_GEM} t={tAg} opacity={tAgVis * lf} />

      {THUMBS.map((t, i) => (
        <SchemaNode key={t.label} {...t} state="amber" lit={thLit[i]} opacity={thOp[i]} label={t.label} fontSize={14} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Token key={i} pts={P_GEM_TH[i]} t={tGt[i]} color={T.amber} opacity={tGtVis[i] * lf} />
      ))}

      <SchemaNode {...TELEGRAM} state="success" lit={tgLit} opacity={tgOp} label="Telegram moderation channel" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>4 inline images, one tap picks</div>
      </SchemaNode>
      {[0, 1, 2, 3].map((i) => (
        <Token key={i} pts={P_TH_TG[i]} t={tTt[i]} color={T.success} opacity={tTtVis[i] * lf} />
      ))}
      <Badge x={TELEGRAM.x + TELEGRAM.w / 2 - 17} y={TELEGRAM.y + TELEGRAM.h + 10} kind="check" scale={checkScale3} opacity={checkScale3} />

      <Caption x={90} y={648} w={1100} text="15-20 minutes of brainstorming for a mediocre, low-CTR thumbnail" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="4 distinct concepts, each engineered around a different psychological hook" color={T.text} opacity={cap2} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="A single tap in Telegram picks the winner and feeds the video pipeline" color={T.success} opacity={cap3} fontSize={21} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>4 options in, fast A/B testing on every category</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>15-20 min → 5 seconds to approve</div>
      </div>
    </AbsoluteFill>
  );
};
