/**
 * FeatureMiniCaseStudies — feature p51 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a "React, TypeScript, Next.js" buzzword list led to superficial
 * conversations — recruiters saw tools, not solutions. 90 mini-case studies
 * were authored as .mdx files with a strict frontmatter schema (id, title,
 * problem, solution, result, tech_stack, category). At build time
 * gray-matter parses the metadata and next-mdx-remote renders content;
 * getStaticProps feeds CaseStudyGrid and CaseStudyPage([slug].tsx), so all
 * 90 cases are statically pre-rendered.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BUZZ = { x: 460, y: 56, w: 360, h: 92 };
const BUZZ_B: Pt = { x: BUZZ.x + BUZZ.w / 2, y: BUZZ.y + BUZZ.h };

const MDX = { x: 460, y: 210, w: 360, h: 108 };
const MDX_T: Pt = { x: MDX.x + MDX.w / 2, y: MDX.y };
const MDX_B: Pt = { x: MDX.x + MDX.w / 2, y: MDX.y + MDX.h };

const GRID = { x: 130, y: 390, w: 300, h: 100 };
const GRID_T: Pt = { x: GRID.x + GRID.w / 2, y: GRID.y };

const PAGE = { x: 850, y: 390, w: 300, h: 100 };
const PAGE_T: Pt = { x: PAGE.x + PAGE.w / 2, y: PAGE.y };

export const FeatureMiniCaseStudies: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: buzzword soup, superficial conversations
  const buzzOp = appear(6) * lf;
  const buzzLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: 90 .mdx files, strict frontmatter schema
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 200 ? 1 : 0;
  const mdxOp = appear(140, 18) * lf;
  const mdxLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: getStaticProps feeds CaseStudyGrid + CaseStudyPage
  const tGrid = seg(frame, 228, 252);
  const tGridVis = frame >= 228 && frame < 300 ? 1 : 0;
  const tPage = seg(frame, 228, 252);
  const tPageVis = frame >= 228 && frame < 300 ? 1 : 0;
  const gridOp = appear(234, 18) * lf;
  const pageOp = appear(234, 18) * lf;
  const gridLit = interpolate(frame, [242, 264, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pageLit = interpolate(frame, [242, 264, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 270, 292, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[BUZZ_B, MDX_T]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[MDX_B, GRID_T]} color={T.success} width={2.5} progress={tGrid} opacity={0.8 * tGridVis * lf} />
      <Connector pts={[MDX_B, PAGE_T]} color={T.success} width={2.5} progress={tPage} opacity={0.8 * tPageVis * lf} />

      <SchemaNode {...BUZZ} state="danger" lit={buzzLit} opacity={buzzOp} label="React, TypeScript, Next.js" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>a flat "Skills" buzzword list</div>
      </SchemaNode>
      <Pill x={BUZZ.x + 30} y={BUZZ.y - 46} dx={pill1Dx} text="recruiters see tools, not solutions" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...MDX} state="accent" lit={mdxLit} opacity={mdxOp} label="90 .mdx case studies" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>problem · solution · result · tech_stack</div>
      </SchemaNode>
      <Token pts={[BUZZ_B, MDX_T]} t={tA} opacity={tAVis * lf} />
      <Pill x={MDX.x - 10} y={MDX.y + MDX.h + 14} dx={pill2Dx} text="gray-matter + next-mdx-remote" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...GRID} state="success" lit={gridLit} opacity={gridOp} label="CaseStudyGrid" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>getStaticProps overview</div>
      </SchemaNode>
      <SchemaNode {...PAGE} state="success" lit={pageLit} opacity={pageOp} label="CaseStudyPage[slug]" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>static-generated detail view</div>
      </SchemaNode>
      <Token pts={[MDX_B, GRID_T]} t={tGrid} color={T.success} opacity={tGridVis * lf} />
      <Token pts={[MDX_B, PAGE_T]} t={tPage} color={T.success} opacity={tPageVis * lf} />
      <Pill x={430} y={GRID.y + GRID.h + 14} dx={pill3Dx} text="all 90 cases pre-rendered" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A generic buzzword soup: tools listed, nothing about how they were used" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Each case: a real problem, the solution, and a measurable result" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Statically generated for instant loads and strong SEO" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>2-3x session duration, 40% better conversations</div>
      </div>
    </AbsoluteFill>
  );
};
