/**
 * FeatureDupeDetection — feature p06 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: breaking news hits all 6 Telegram channels at once, so the same
 * story gets scraped up to 6 times → Stage 1 does a free fuzzy title match
 * against a 48h cache (Levenshtein < 3) and kills most duplicates instantly
 * → only ambiguous survivors reach Stage 2, a real embeddings comparison
 * against a Supabase vector DB → "40% duplicate rate → under 3%, review
 * time near zero".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const CH_XS = [90, 260, 430, 690, 860, 1030];
const CH_Y = 40;
const CH_W = 150;
const CH_H = 72;
const CH = CH_XS.map((x) => ({ x, y: CH_Y, w: CH_W, h: CH_H }));

const ARTICLE = { x: 465, y: 176, w: 350, h: 78 };
const STAGE1 = { x: 130, y: 320, w: 340, h: 100 };
const STAGE2 = { x: 810, y: 320, w: 340, h: 100 };
const UNIQUE = { x: 465, y: 490, w: 350, h: 86 };

const CH_B: Pt[] = CH.map((c) => ({ x: c.x + c.w / 2, y: c.y + c.h }));
const ARTICLE_T: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y };
const ARTICLE_B: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y + ARTICLE.h };
const STAGE1_T: Pt = { x: STAGE1.x + STAGE1.w / 2, y: STAGE1.y };
const STAGE1_R: Pt = { x: STAGE1.x + STAGE1.w, y: STAGE1.y + STAGE1.h / 2 };
const STAGE2_T: Pt = { x: STAGE2.x + STAGE2.w / 2, y: STAGE2.y };
const STAGE2_L: Pt = { x: STAGE2.x, y: STAGE2.y + STAGE2.h / 2 };
const STAGE1_B: Pt = { x: STAGE1.x + STAGE1.w / 2, y: STAGE1.y + STAGE1.h };
const STAGE2_B: Pt = { x: STAGE2.x + STAGE2.w / 2, y: STAGE2.y + STAGE2.h };
const UNIQUE_T: Pt = { x: UNIQUE.x + UNIQUE.w / 2, y: UNIQUE.y };

const P_CH_A: Pt[][] = CH_B.map((p) => [p, ARTICLE_T]);
const P_A1: Pt[] = [ARTICLE_B, STAGE1_T];
const P_A2: Pt[] = [ARTICLE_B, STAGE2_T];
const P_12: Pt[] = [STAGE1_R, STAGE2_L];
const P_1U: Pt[] = [STAGE1_B, { x: STAGE1_B.x, y: 460 }, UNIQUE_T];
const P_2U: Pt[] = [STAGE2_B, { x: STAGE2_B.x, y: 460 }, UNIQUE_T];

export const FeatureDupeDetection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): breaking news hits all 6 channels at once ──
  const chOp = CH.map((_, i) => appear(6 + i * 8) * lf);
  const articleOp = Math.min(1, pop(58)) * lf;
  const articleLit = interpolate(frame, [58, 82, 98, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const connOp = CH.map((_, i) => 0.4 * Math.min(chOp[i], articleOp));
  const pillIn = seg(frame, 64, 86, Easing.out(Easing.cubic));
  const pillOp = pillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 62, 84, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–236): Stage 1 kills most duplicates, free and fast ──
  const tA1 = seg(frame, 126, 148);
  const tA1Vis = frame >= 126 && frame < 176 ? 1 : 0;
  const tA2 = seg(frame, 126, 148);
  const tA2Vis = frame >= 126 && frame < 176 ? 1 : 0;
  const stage1Op = appear(128, 18) * lf;
  const stage1Lit = interpolate(frame, [136, 158, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const stage2Op = appear(128, 18) * lf;
  const stage2Lit = interpolate(frame, [136, 158, 330, 350], [0, 0.5, 0.5, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(184) * interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const rejectPillIn = seg(frame, 190, 212, Easing.out(Easing.cubic));
  const rejectPillOp = rejectPillIn * interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (248–340): ambiguous survivor → embeddings comparison ──
  const t12 = seg(frame, 250, 272);
  const t12Vis = frame >= 250 && frame < 296 ? 1 : 0;
  const t2u = seg(frame, 276, 300);
  const t2uVis = frame >= 276 && frame < 330 ? 1 : 0;
  const uniqueOp = appear(300, 18) * lf;
  const checkScale = pop(304) * lf;
  const embedPillIn = seg(frame, 254, 276, Easing.out(Easing.cubic));
  const embedPillOp = embedPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 258, 280, Easing.out(Easing.cubic));
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

      {P_CH_A.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.danger} width={2} opacity={connOp[i]} />
      ))}
      <Connector pts={P_A1} color={T.accent} width={2.5} progress={tA1} opacity={0.8 * tA1Vis * lf} />
      <Connector pts={P_A2} color={T.accent} width={2} progress={tA2} opacity={0.5 * tA2Vis * lf} />
      <Connector pts={P_12} color={T.amber} width={2.5} progress={t12} opacity={0.8 * t12Vis * lf} />
      <Connector pts={P_2U} color={T.success} width={2.5} progress={t2u} opacity={0.8 * t2uVis * lf} />

      {CH.map((c, i) => (
        <SchemaNode key={i} {...c} state="danger" lit={0.2 * lf} opacity={chOp[i]} label={`CH ${i + 1}`} fontSize={19} />
      ))}
      <SchemaNode {...ARTICLE} state="danger" lit={articleLit} opacity={articleOp} label="Same story, up to 6x" fontSize={22} />
      <Pill x={ARTICLE.x + 10} y={ARTICLE.y - 46} text="breaking news hits every channel at once" color={T.danger} opacity={pillOp} fontSize={17} />

      <SchemaNode {...STAGE1} state="amber" lit={stage1Lit} opacity={stage1Op} label="Stage 1 · title match" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>48h cache · Levenshtein &lt; 3</div>
      </SchemaNode>
      <SchemaNode {...STAGE2} state="accent" lit={stage2Lit} opacity={stage2Op} label="Stage 2 · embeddings" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Azure + Supabase vector DB</div>
      </SchemaNode>
      <Badge x={STAGE1.x + STAGE1.w / 2 - 18} y={STAGE1.y + STAGE1.h + 6} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={STAGE1.x - 20} y={STAGE1.y + STAGE1.h + 44} text="most rejected here — free, instant" color={T.danger} opacity={rejectPillOp} fontSize={16} />

      <Token pts={P_A1} t={tA1} opacity={tA1Vis * lf} />
      <Token pts={P_A2} t={tA2} opacity={tA2Vis * lf} />
      <Token pts={P_12} t={t12} color={T.amber} opacity={t12Vis * lf} />
      <Token pts={P_2U} t={t2u} color={T.success} opacity={t2uVis * lf} />
      <Pill x={STAGE2.x + 20} y={STAGE2.y - 46} text="only ambiguous titles reach here" color={T.amber} opacity={embedPillOp} fontSize={17} />

      <SchemaNode {...UNIQUE} state="success" lit={0.7 * Math.min(1, uniqueOp) * lf} opacity={uniqueOp} label="Truly unique article" fontSize={20} />
      <Badge x={UNIQUE.x + UNIQUE.w / 2 - 18} y={UNIQUE.y - 40} kind="check" scale={checkScale} opacity={checkScale} />

      <Caption x={90} y={648} w={1100} text="The same breaking story, scraped up to 6 times over" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Fuzzy title match against a 48h cache — fast, free, catches most" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Only truly ambiguous titles get the expensive embeddings check" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~40% duplicate rate → under 3%</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Daily duplicate review time — near zero</div>
      </div>
    </AbsoluteFill>
  );
};
