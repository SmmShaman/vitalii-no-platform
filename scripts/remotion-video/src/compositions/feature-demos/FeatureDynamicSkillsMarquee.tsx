/**
 * FeatureDynamicSkillsMarquee — feature p57 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a wall of 50+ skill buzzwords was a dead end — visitors skimmed
 * past, missing how deeply interconnected the stack really was. The
 * SkillsMarquee component makes each word clickable; onClick sets
 * activeSkill in React state, conditionally rendering LogoGridOverlay,
 * which fetches 5-10 related logos from skillsData.json into a responsive
 * grid. GSAP drives the marquee's continuous scroll and the overlay's
 * fade-in/scale-up transitions.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const WALL = { x: 380, y: 50, w: 500, h: 92 };
const WALL_B: Pt = { x: WALL.x + WALL.w / 2, y: WALL.y + WALL.h };

const MARQUEE = { x: 400, y: 200, w: 460, h: 92 };
const MARQUEE_T: Pt = { x: MARQUEE.x + MARQUEE.w / 2, y: MARQUEE.y };
const MARQUEE_B: Pt = { x: MARQUEE.x + MARQUEE.w / 2, y: MARQUEE.y + MARQUEE.h };

const OVERLAY = { x: 430, y: 350, w: 400, h: 76 };
const OVERLAY_B: Pt = { x: OVERLAY.x + OVERLAY.w / 2, y: OVERLAY.y + OVERLAY.h };

// 5 related logo tiles revealed in the grid
const LOGOS = [
  { x: 190, y: 480, w: 130, h: 84, label: "React" },
  { x: 350, y: 480, w: 130, h: 84, label: "GSAP" },
  { x: 510, y: 480, w: 130, h: 84, label: "TS" },
  { x: 670, y: 480, w: 130, h: 84, label: "CSS" },
  { x: 830, y: 480, w: 130, h: 84, label: "Vite" },
];
const LOGO_T: Pt[] = LOGOS.map((l) => ({ x: l.x + l.w / 2, y: l.y }));

export const FeatureDynamicSkillsMarquee: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: buzzword wall, dead-end
  const wallOp = appear(6) * lf;
  const wallLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: SkillsMarquee onClick -> activeSkill state -> LogoGridOverlay
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const marqueeOp = appear(140, 18) * lf;
  const marqueeLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: GSAP fade-in/scale-up reveals 5-10 related logos
  const tB = seg(frame, 226, 250);
  const tBVis = frame >= 226 && frame < 300 ? 1 : 0;
  const overlayOp = appear(232, 18) * lf;
  const overlayLit = interpolate(frame, [240, 262, 330, 350], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const logoOp = LOGOS.map((_, i) => appear(258 + i * 8, 14) * lf);
  const logoScale = LOGOS.map((_, i) => pop(258 + i * 8, 12));
  const pill3In = seg(frame, 300, 322, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[WALL_B, MARQUEE_T]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[MARQUEE_B, { x: OVERLAY.x + OVERLAY.w / 2, y: OVERLAY.y }]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      {LOGO_T.map((p, i) => (
        <Connector key={i} pts={[OVERLAY_B, p]} color={T.success} width={2} opacity={0.5 * logoOp[i]} />
      ))}

      <SchemaNode {...WALL} state="danger" lit={wallLit} opacity={wallOp} label="50+ buzzwords — a static wall" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>visitors skim past, miss the depth</div>
      </SchemaNode>
      <Pill x={WALL.x + 40} y={WALL.y - 46} dx={pill1Dx} text="a flat, lifeless resume" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...MARQUEE} state="accent" lit={marqueeLit} opacity={marqueeOp} label="SkillsMarquee — onClick" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>sets activeSkill in React state</div>
      </SchemaNode>
      <Token pts={[WALL_B, MARQUEE_T]} t={tA} opacity={tAVis * lf} />
      <Pill x={MARQUEE.x + 30} y={MARQUEE.y + MARQUEE.h + 12} dx={pill2Dx} text="LogoGridOverlay conditionally renders" color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...OVERLAY} state="success" lit={overlayLit} opacity={overlayOp} label="skillsData.json → related logos" fontSize={16} />
      <Token pts={[MARQUEE_B, { x: OVERLAY.x + OVERLAY.w / 2, y: OVERLAY.y }]} t={tB} opacity={tBVis * lf} />

      {LOGOS.map((l, i) => (
        <div
          key={l.label}
          style={{
            position: "absolute",
            left: l.x,
            top: l.y,
            width: l.w,
            height: l.h,
            borderRadius: 12,
            border: `1px solid ${hexA(T.success, 0.7)}`,
            background: T.nodeFill,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 600,
            color: T.success,
            opacity: logoOp[i],
            transform: `scale(${logoScale[i]})`,
            boxShadow: `0 0 14px ${hexA(T.success, 0.25)}`,
          }}
        >
          {l.label}
        </div>
      ))}
      <Pill x={430} y={LOGOS[0].y + LOGOS[0].h + 14} dx={pill3Dx} text="5-10 logos, revealed with GSAP scale-up" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A wall of buzzwords, skimmed past, telling visitors nothing" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Click any skill — React state drives what appears next" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Related tech reveals itself, GSAP-animated, grouped as ecosystems" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>80%+ click-through across 50+ technologies</div>
      </div>
    </AbsoluteFill>
  );
};
