/**
 * FeatureImagePrompt — feature p03 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: feeding raw article text straight to an image model gives generic,
 * ~30%-relevant results → Stage 1 classifies the article into one of 7
 * categories and extracts {company, category, visual_concept, color_scheme}
 * → Stage 2 picks a pre-optimized template for that category and fills its
 * placeholders → "~30% → ~85% relevant, both stages tunable independently".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ARTICLE = { x: 465, y: 36, w: 350, h: 82 };
const STAGE1 = { x: 130, y: 210, w: 340, h: 104 };
const STAGE2 = { x: 810, y: 210, w: 340, h: 104 };
const OUTPUT = { x: 465, y: 448, w: 350, h: 92 };

const CATS = ["tech_product", "marketing_campaign", "ai_research", "business_news", "science", "lifestyle", "general"];
const CAT_HI = 0;
const CHIP_XS = [70, 240, 430, 610, 790, 950, 1090];
const CHIP_Y = 350;

const ARTICLE_B: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y + ARTICLE.h };
const STAGE1_T: Pt = { x: STAGE1.x + STAGE1.w / 2, y: STAGE1.y };
const STAGE2_T: Pt = { x: STAGE2.x + STAGE2.w / 2, y: STAGE2.y };
const STAGE1_R: Pt = { x: STAGE1.x + STAGE1.w, y: STAGE1.y + STAGE1.h / 2 };
const STAGE2_L: Pt = { x: STAGE2.x, y: STAGE2.y + STAGE2.h / 2 };
const STAGE1_B: Pt = { x: STAGE1.x + STAGE1.w / 2, y: STAGE1.y + STAGE1.h };
const STAGE2_B: Pt = { x: STAGE2.x + STAGE2.w / 2, y: STAGE2.y + STAGE2.h };
const OUTPUT_T: Pt = { x: OUTPUT.x + OUTPUT.w / 2, y: OUTPUT.y };

const P_A1: Pt[] = [ARTICLE_B, STAGE1_T];
const P_A2: Pt[] = [ARTICLE_B, STAGE2_T];
const P_12: Pt[] = [STAGE1_R, STAGE2_L];
const P_1O: Pt[] = [STAGE1_B, { x: STAGE1_B.x, y: 410 }, OUTPUT_T];
const P_2O: Pt[] = [STAGE2_B, { x: STAGE2_B.x, y: 410 }, OUTPUT_T];

export const FeatureImagePrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): raw text straight to image gen = generic, ~30% ──
  const articleOp = Math.min(1, pop(10)) * lf;
  const articleLit = interpolate(frame, [10, 34, 96, 118], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const relPillIn = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const relPillOp = relPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–236): Stage 1 classifies into 1 of 7 categories ──
  const tA1 = seg(frame, 126, 148);
  const tA1Vis = frame >= 126 && frame < 176 ? 1 : 0;
  const stage1Op = appear(128, 18) * lf;
  const stage1Lit = interpolate(frame, [136, 158, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const chipOp = CATS.map((_, i) => appear(166 + i * 8, 12) * lf);
  const chipHiLit = interpolate(frame, [166 + CAT_HI * 8, 166 + CAT_HI * 8 + 14, 330, 350], [0, 1, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const jsonPillIn = seg(frame, 178, 200, Easing.out(Easing.cubic));
  const jsonPillOp = jsonPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 170, 192, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (238–340): Stage 2 fills the matching template ──
  const tA2 = seg(frame, 238, 258);
  const tA2Vis = frame >= 238 && frame < 284 ? 1 : 0;
  const t12 = seg(frame, 240, 260);
  const t12Vis = frame >= 240 && frame < 284 ? 1 : 0;
  const stage2Op = appear(242, 18) * lf;
  const stage2Lit = interpolate(frame, [250, 272, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const t1o = seg(frame, 262, 288);
  const t1oVis = frame >= 262 && frame < 316 ? 1 : 0;
  const t2o = seg(frame, 266, 292);
  const t2oVis = frame >= 266 && frame < 316 ? 1 : 0;
  const outputOp = appear(292, 18) * lf;
  const checkScale = pop(296) * lf;
  const cap3In = seg(frame, 268, 290, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [322, 342], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_A1} color={T.accent} width={2.5} progress={tA1} opacity={0.8 * tA1Vis * lf} />
      <Connector pts={P_A2} color={T.accent} width={2} progress={tA2} opacity={0.6 * tA2Vis * lf} />
      <Connector pts={P_12} color={T.accent} width={2.5} progress={t12} opacity={0.8 * t12Vis * lf} />
      <Connector pts={P_1O} color={T.success} width={2.5} progress={t1o} opacity={0.7 * t1oVis * lf} />
      <Connector pts={P_2O} color={T.success} width={2.5} progress={t2o} opacity={0.8 * t2oVis * lf} />

      <SchemaNode {...ARTICLE} state="idle" lit={articleLit} opacity={articleOp} label="Raw article text" fontSize={22} />
      <Badge x={ARTICLE.x + ARTICLE.w / 2 - 18} y={ARTICLE.y + ARTICLE.h + 44} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={ARTICLE.x + 20} y={ARTICLE.y + ARTICLE.h + 80} text="~30% relevant, generic results" color={T.danger} opacity={relPillOp} fontSize={19} />

      <SchemaNode {...STAGE1} state="accent" lit={stage1Lit} opacity={stage1Op} label="Stage 1 · Classifier" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>company, category, visual_concept</div>
      </SchemaNode>
      <SchemaNode {...STAGE2} state="accent" lit={stage2Lit} opacity={stage2Op} label="Stage 2 · Template" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>fills {"{placeholders}"}</div>
      </SchemaNode>
      <SchemaNode {...OUTPUT} state="success" lit={0.7 * Math.min(1, outputOp) * lf} opacity={outputOp} label="Optimized image prompt" fontSize={19} />
      <Badge x={OUTPUT.x + OUTPUT.w / 2 - 18} y={OUTPUT.y - 40} kind="check" scale={checkScale} opacity={checkScale} />

      <Token pts={P_A1} t={tA1} opacity={tA1Vis * lf} />
      <Token pts={P_12} t={t12} opacity={t12Vis * lf} />
      <Token pts={P_1O} t={t1o} color={T.success} opacity={t1oVis * lf} />
      <Token pts={P_2O} t={t2o} color={T.success} opacity={t2oVis * lf} />

      {CATS.map((c, i) => (
        <Pill key={c} x={CHIP_XS[i]} y={CHIP_Y} text={c} color={i === CAT_HI && chipHiLit > 0.5 ? T.success : T.muted} opacity={chipOp[i]} fontSize={15} />
      ))}
      <Pill x={STAGE1.x + 10} y={STAGE1.y - 46} text="{company, category, visual_concept, color_scheme}" color={T.amber} opacity={jsonPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Raw text straight to image gen — generic, ~30% relevant" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Classified into 1 of 7 categories, structured JSON extracted" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Both stages editable independently — instant propagation, no redeploy" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~30% relevant → ~85% relevant images</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Modular — tune classification or visuals independently</div>
      </div>
    </AbsoluteFill>
  );
};
