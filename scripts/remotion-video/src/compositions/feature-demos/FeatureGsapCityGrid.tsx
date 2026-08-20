/**
 * FeatureGsapCityGrid — feature p54 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a static `map()` of tech logos was a dead end — visitors glanced
 * and scrolled past in 3-5 seconds. SkillsGridAnimation.tsx uses GSAP's
 * MotionPathPlugin with a hand-defined 7-street "city grid" [x,y] coordinate
 * array. Each skill icon animates along that path via gsap.to() inside a
 * gsap.timeline(), with stagger and duration tuned so nothing overlaps —
 * an infinite, smooth loop through the grid.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const STATIC = { x: 460, y: 50, w: 360, h: 84 };
const STATIC_B: Pt = { x: STATIC.x + STATIC.w / 2, y: STATIC.y + STATIC.h };

const COMPONENT = { x: 460, y: 186, w: 360, h: 88 };
const COMPONENT_T: Pt = { x: COMPONENT.x + COMPONENT.w / 2, y: COMPONENT.y };

// 7-street city grid path (simplified zigzag for illustration)
const GRID_PATH: Pt[] = [
  { x: 140, y: 340 },
  { x: 400, y: 340 },
  { x: 400, y: 410 },
  { x: 660, y: 410 },
  { x: 660, y: 340 },
  { x: 920, y: 340 },
  { x: 920, y: 410 },
  { x: 1140, y: 410 },
];

const TIMELINE = { x: 460, y: 470, w: 360, h: 90 };

export const FeatureGsapCityGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: static list, dead end
  const staticOp = appear(6) * lf;
  const staticLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: SkillsGridAnimation.tsx, GSAP MotionPathPlugin, 7-street grid
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 200 ? 1 : 0;
  const componentOp = appear(140, 18) * lf;
  const componentLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: 7-street grid path, token(s) travelling continuously
  const gridOp = appear(226, 18) * lf;
  const pathProgress = seg(frame, 226, 340, Easing.linear);
  const tok1 = (pathProgress + 0) % 1;
  const tok2 = (pathProgress + 0.33) % 1;
  const tok3 = (pathProgress + 0.66) % 1;
  const pathVis = frame >= 226 && frame < 350 ? 1 : 0;
  const pill3In = seg(frame, 250, 272, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 240, 262, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const timelineOp = appear(226, 18) * lf;
  const timelineLit = interpolate(frame, [234, 256, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[STATIC_B, COMPONENT_T]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={GRID_PATH} color={T.border} width={2} opacity={0.5 * gridOp} />
      <Connector pts={GRID_PATH} color={T.accent} width={2.5} progress={1} opacity={0.4 * pathVis * lf} />

      <SchemaNode {...STATIC} state="danger" lit={staticLit} opacity={staticOp} label="Static skill list — map()" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>flat tech logos, no motion</div>
      </SchemaNode>
      <Pill x={STATIC.x + 20} y={STATIC.y - 44} dx={pill1Dx} text="visitors glance, scroll past in 3-5s" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...COMPONENT} state="accent" lit={componentLit} opacity={componentOp} label="SkillsGridAnimation.tsx" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>GSAP MotionPathPlugin</div>
      </SchemaNode>
      <Pill x={COMPONENT.x + 40} y={COMPONENT.y + COMPONENT.h + 12} dx={pill2Dx} text="7-street [x, y] city grid path" color={T.accent} opacity={pill2Op} fontSize={16} />

      {gridOp > 0.01 ? (
        <>
          <Token pts={GRID_PATH} t={tok1} color={T.success} opacity={pathVis * lf * gridOp} size={12} />
          <Token pts={GRID_PATH} t={tok2} color={T.accent} opacity={pathVis * lf * gridOp} size={12} />
          <Token pts={GRID_PATH} t={tok3} color={T.amber} opacity={pathVis * lf * gridOp} size={12} />
        </>
      ) : null}
      <Pill x={GRID_PATH[0].x - 20} y={GRID_PATH[0].y - 46} dx={pill3Dx} text="gsap.timeline · stagger prevents overlaps" color={T.success} opacity={pill3Op} fontSize={16} />

      <SchemaNode {...TIMELINE} state="success" lit={timelineLit} opacity={timelineOp} label="gsap.timeline()" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>tuned ease, continuous loop</div>
      </SchemaNode>
      <Caption x={90} y={648} w={1100} text="A flat map() of logos: skimmed and forgotten in seconds" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="A hand-tuned city grid path drives every icon's motion" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Staggered timeline, tuned easing — nothing ever collides" color={T.success} opacity={cap3} fontSize={23} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Viewing time up from 3-5s to 15-20s</div>
      </div>
    </AbsoluteFill>
  );
};
