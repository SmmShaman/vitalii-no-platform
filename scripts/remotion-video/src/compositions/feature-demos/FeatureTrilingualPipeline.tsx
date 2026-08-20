/**
 * FeatureTrilingualPipeline — feature p46 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: three audiences (global tech EN, Norwegian professionals, Ukrainian
 * diaspora) needed native-quality content, not machine translation — manual
 * adaptation cost 2-3h/article. process-news Edge Function sends the article
 * to Azure OpenAI GPT-4, fetching language-specific prompts from ai_prompts
 * (prompt_en/no/ua), writing title/content/description/slug into _en/_no/_ua
 * columns. hreflang tags link all three versions for SEO; TranslationContext
 * drives 143+ UI keys client-side.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ARTICLE = { x: 490, y: 56, w: 300, h: 92 };
const ARTICLE_B: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y + ARTICLE.h };

const PROCESS = { x: 490, y: 208, w: 300, h: 100 };
const PROCESS_T: Pt = { x: PROCESS.x + PROCESS.w / 2, y: PROCESS.y };
const PROCESS_B: Pt = { x: PROCESS.x + PROCESS.w / 2, y: PROCESS.y + PROCESS.h };

const OUT = [
  { x: 100, y: 380, w: 220, h: 96, label: "title_en / content_en" },
  { x: 530, y: 380, w: 220, h: 96, label: "title_no / content_no" },
  { x: 960, y: 380, w: 220, h: 96, label: "title_ua / content_ua" },
];
const OUT_T: Pt[] = OUT.map((o) => ({ x: o.x + o.w / 2, y: o.y }));

export const FeatureTrilingualPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: one article, three distinct audiences, manual adaptation costly
  const articleOp = appear(6) * lf;
  const articleLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: process-news Edge Function -> Azure GPT-4 -> ai_prompts (prompt_en/no/ua)
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const processOp = appear(140, 18) * lf;
  const processLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: three native-quality outputs land, hreflang links them for SEO
  const tOut = OUT_T.map((_, i) => seg(frame, 222 + i * 8, 246 + i * 8));
  const tOutVis = OUT_T.map((_, i) => (frame >= 222 + i * 8 && frame < 300 ? 1 : 0));
  const outOp = OUT.map((_, i) => appear(232 + i * 8, 18) * lf);
  const outLit = OUT.map((_, i) =>
    interpolate(frame, [238 + i * 8, 262 + i * 8, 330, 350], [0, 0.6, 0.6, 0.16], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const pill3In = seg(frame, 268, 290, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[ARTICLE_B, PROCESS_T]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      {OUT_T.map((p, i) => (
        <Connector key={i} pts={[PROCESS_B, p]} color={T.success} width={2.5} progress={tOut[i]} opacity={0.8 * tOutVis[i] * lf} />
      ))}

      <SchemaNode {...ARTICLE} state="idle" lit={articleLit} opacity={articleOp} label="1 source article" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>EN tech · NO professionals · UA diaspora</div>
      </SchemaNode>
      <Pill x={ARTICLE.x + 20} y={ARTICLE.y - 46} dx={pill1Dx} text="manual adaptation: 2-3h per article" color={T.danger} opacity={pill1Op} fontSize={18} />

      <SchemaNode {...PROCESS} state="accent" lit={processLit} opacity={processOp} label="process-news Edge Function" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>Azure GPT-4 · ai_prompts: prompt_en/no/ua</div>
      </SchemaNode>
      <Token pts={[ARTICLE_B, PROCESS_T]} t={tA} opacity={tAVis * lf} />
      <Pill x={PROCESS.x - 20} y={PROCESS.y + PROCESS.h + 14} dx={pill2Dx} text="tailored tone & cultural context per language" color={T.accent} opacity={pill2Op} fontSize={17} />

      {OUT.map((o, i) => (
        <SchemaNode key={o.label} {...o} state="success" lit={outLit[i]} opacity={outOp[i]} label={o.label} fontSize={16} />
      ))}
      {OUT_T.map((p, i) => (
        <Token key={i} pts={[PROCESS_B, p]} t={tOut[i]} color={T.success} opacity={tOutVis[i] * lf} />
      ))}
      <Pill x={OUT[1].x - 20} y={OUT[1].y + OUT[1].h + 14} dx={pill3Dx} text="hreflang links all three · slug_en/no/ua" color={T.success} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="Native-quality content for three audiences, not machine translation" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="One article, one Edge Function, three language-specific AI prompts" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Each version reads authentically, cross-linked for SEO" color={T.success} opacity={cap3} fontSize={23} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>2-3h of manual adaptation, fully automated</div>
      </div>
    </AbsoluteFill>
  );
};
