/**
 * FeatureContentRewrite — feature p02 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: one new article must serve 3 audiences — manual translation of
 * 5-10 articles/day is unsustainable → process-news fires on a publish
 * webhook, pulling a language-specific template from prompt_templates for 3
 * concurrent Azure OpenAI calls → each output gets its own tone (formal NO,
 * conversational UA, SEO EN) and its own slug, avoiding duplicate-content
 * penalties → "3x content output, near-zero translation cost".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ARTICLE = { x: 465, y: 44, w: 350, h: 86 };
const TEMPLATES = { x: 70, y: 200, w: 260, h: 90 };
const EDGE = { x: 465, y: 200, w: 350, h: 96 };

const OUT = [
  { x: 150, y: 400, w: 250, h: 106, label: "EN", sub: "SEO-optimized, conversational" },
  { x: 515, y: 400, w: 250, h: 106, label: "NO", sub: "formal Bokmål" },
  { x: 880, y: 400, w: 250, h: 106, label: "UA", sub: "native, conversational" },
];

const ARTICLE_B: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y + ARTICLE.h };
const EDGE_T: Pt = { x: EDGE.x + EDGE.w / 2, y: EDGE.y };
const TEMPLATES_R: Pt = { x: TEMPLATES.x + TEMPLATES.w, y: TEMPLATES.y + TEMPLATES.h / 2 };
const EDGE_L: Pt = { x: EDGE.x, y: EDGE.y + EDGE.h / 2 };
const EDGE_B: Pt = { x: EDGE.x + EDGE.w / 2, y: EDGE.y + EDGE.h };
const OUT_T: Pt[] = OUT.map((o) => ({ x: o.x + o.w / 2, y: o.y }));

const P_AE: Pt[] = [ARTICLE_B, EDGE_T];
const P_TE: Pt[] = [TEMPLATES_R, EDGE_L];
const P_EO: Pt[][] = OUT_T.map((p) => [EDGE_B, p]);

export const FeatureContentRewrite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): one article, 3 audiences to serve ──
  const articleOp = Math.min(1, pop(10)) * lf;
  const articleLit = interpolate(frame, [10, 34, 96, 118], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const audPillIn = seg(frame, 34, 56, Easing.out(Easing.cubic));
  const audPillOp = audPillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (126–246): process-news fans out 3 concurrent AI calls ──
  const tAe = seg(frame, 128, 150);
  const tAeVis = frame >= 128 && frame < 180 ? 1 : 0;
  const edgeOp = appear(130, 18) * lf;
  const edgeLit = interpolate(frame, [138, 160, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const templatesOp = appear(150, 18) * lf;
  const templatesLit = interpolate(frame, [158, 180, 330, 350], [0, 0.6, 0.6, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tTe = seg(frame, 162, 184);
  const tTeVis = frame >= 162 && frame < 210 ? 1 : 0;
  const tEo = seg(frame, 188, 214);
  const tEoVis = frame >= 188 && frame < 250 ? 1 : 0;
  const outOp = OUT.map((_, i) => appear(214 + i * 6, 16) * lf);
  const outLit = OUT.map((_, i) =>
    interpolate(frame, [214 + i * 6, 236 + i * 6, 330, 350], [0, 0.7, 0.7, 0.25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const cap2In = seg(frame, 166, 188, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const concurrentPillIn = seg(frame, 192, 214, Easing.out(Easing.cubic));
  const concurrentPillOp = concurrentPillIn * interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (250–340): distinct slugs, no duplicate-content penalty ──
  const slugOp = OUT.map((_, i) => appear(258 + i * 8, 14) * interpolate(frame, [314, 334], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf);
  const cap3In = seg(frame, 268, 290, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  const slugText = ["/en/article-slug", "/no/artikkel-slug", "/ua/stattya-slug"];

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_AE} color={T.accent} width={2.5} progress={tAe} opacity={0.8 * tAeVis * lf} />
      <Connector pts={P_TE} color={T.amber} width={2.5} progress={tTe} opacity={0.8 * tTeVis * lf} />
      {P_EO.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.accent} width={2.5} progress={tEo} opacity={0.8 * tEoVis * lf} />
      ))}

      <SchemaNode {...ARTICLE} state="idle" lit={articleLit} opacity={articleOp} label="New article" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>publish webhook fires</div>
      </SchemaNode>
      <Pill x={ARTICLE.x + 30} y={ARTICLE.y - 46} text="3 audiences: NO · UA · int'l tech" color={T.danger} opacity={audPillOp} fontSize={19} />

      <SchemaNode {...TEMPLATES} state="amber" lit={templatesLit} opacity={templatesOp} label="prompt_templates" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>editable per language</div>
      </SchemaNode>
      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="process-news" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>3 concurrent Azure calls</div>
      </SchemaNode>
      <Token pts={P_AE} t={tAe} opacity={tAeVis * lf} />
      <Token pts={P_TE} t={tTe} color={T.amber} opacity={tTeVis * lf} />
      {P_EO.map((pts, i) => (
        <Token key={i} pts={pts} t={tEo} opacity={tEoVis * lf} />
      ))}
      <Pill x={EDGE.x + 60} y={EDGE.y - 46} text="webhook → 3 parallel rewrites" color={T.accent} opacity={concurrentPillOp} fontSize={18} />

      {OUT.map((o, i) => (
        <SchemaNode key={o.label} x={o.x} y={o.y} w={o.w} h={o.h} state="success" lit={outLit[i]} opacity={outOp[i]} label={o.label} fontSize={24}>
          <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>{o.sub}</div>
        </SchemaNode>
      ))}
      {OUT.map((o, i) => (
        <Pill key={o.label} x={o.x + 10} y={o.y + o.h + 12} text={slugText[i]} color={T.success} opacity={slugOp[i]} fontSize={15} />
      ))}

      <Caption x={90} y={648} w={1100} text="5-10 articles a day, manually translated — unsustainable" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Tone adapts per language — no code deploy, just a template edit" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={340} w={1100} text="Consistent slugs per language — SEO-distinct, no duplicate-content penalty" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>3x content output, near-zero translation cost</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Native tone, not a generic translation</div>
      </div>
    </AbsoluteFill>
  );
};
