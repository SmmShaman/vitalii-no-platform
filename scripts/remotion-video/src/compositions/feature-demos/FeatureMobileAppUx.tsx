/**
 * FeatureMobileAppUx — feature p31 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: the desktop BentoGrid squashed onto a 375px screen became an
 * unreadable, pinch-zoom mess → useIsMobile() (SSR-safe, initial false)
 * activates a dedicated BentoGridMobile with 7 native-feeling screens →
 * Framer Motion swipe carousel (50px threshold) and a glassmorphism
 * bottom nav respect env(safe-area-inset-bottom) → 100% content
 * visibility, zero elements obscured by notches.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TOP = { x: 440, y: 50, w: 400, h: 88, label: "Desktop BentoGrid on 375px" };
const TOP_B: Pt = { x: TOP.x + TOP.w / 2, y: TOP.y + TOP.h };

const RIGHT1 = { x: 850, y: 210, w: 300, h: 78, label: "tiny text, cramped sections" };
const RIGHT1_T: Pt = { x: RIGHT1.x + RIGHT1.w / 2, y: RIGHT1.y };

const LEFT1 = { x: 130, y: 210, w: 280, h: 78, label: "useIsMobile() hook" };
const LEFT1_T: Pt = { x: LEFT1.x + LEFT1.w / 2, y: LEFT1.y };
const LEFT1_B: Pt = { x: LEFT1.x + LEFT1.w / 2, y: LEFT1.y + LEFT1.h };

const MID = { x: 470, y: 350, w: 340, h: 90 };
const MID_T: Pt = { x: MID.x + MID.w / 2, y: MID.y };
const MID_B: Pt = { x: MID.x + MID.w / 2, y: MID.y + MID.h };

const BOTLEFT = { x: 130, y: 500, w: 260, h: 78 };
const BOTRIGHT = { x: 850, y: 500, w: 300, h: 78 };
const BOTLEFT_T: Pt = { x: BOTLEFT.x + BOTLEFT.w / 2, y: BOTLEFT.y };
const BOTRIGHT_T: Pt = { x: BOTRIGHT.x + BOTRIGHT.w / 2, y: BOTRIGHT.y };

export const FeatureMobileAppUx: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): desktop layout squashed onto mobile is unreadable ──
  const topOp = Math.min(1, pop(6)) * lf;
  const topLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tCi = seg(frame, 30, 54);
  const tCiVis = frame >= 30 && frame < 96 ? 1 : 0;
  const rightOp = appear(38, 18) * lf;
  const rightLit = interpolate(frame, [38, 60, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(70) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 22, 44, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): useIsMobile() activates BentoGridMobile's 7 screens ──
  const tCe = seg(frame, 138, 162);
  const tCeVis = frame >= 138 && frame < 184 ? 1 : 0;
  const leftOp = appear(148, 18) * lf;
  const leftLit = interpolate(frame, [148, 170, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tEf = seg(frame, 168, 192);
  const tEfVis = frame >= 168 && frame < 214 ? 1 : 0;
  const midOp = appear(178, 18) * lf;
  const midLit = interpolate(frame, [186, 208, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): swipe carousel + glassmorphism nav respect safe areas ──
  const tFl = seg(frame, 250, 274);
  const tFlVis = frame >= 250 && frame < 300 ? 1 : 0;
  const tFc = seg(frame, 256, 280);
  const tFcVis = frame >= 256 && frame < 306 ? 1 : 0;
  const botLeftOp = appear(266, 18) * lf;
  const botRightOp = appear(272, 18) * lf;
  const botLeftLit = interpolate(frame, [274, 296, 330, 350], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const botRightLit = interpolate(frame, [280, 302, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[TOP_B, RIGHT1_T]} color={T.danger} width={2.5} progress={tCi} opacity={0.8 * tCiVis * lf} />
      <Connector pts={[TOP_B, LEFT1_T]} color={T.accent} width={2.5} progress={tCe} opacity={0.8 * tCeVis * lf} />
      <Connector pts={[LEFT1_B, MID_T]} color={T.accent} width={2.5} progress={tEf} opacity={0.8 * tEfVis * lf} />
      <Connector pts={[MID_B, BOTLEFT_T]} color={T.success} width={2.5} progress={tFl} opacity={0.8 * tFlVis * lf} />
      <Connector pts={[MID_B, BOTRIGHT_T]} color={T.success} width={2.5} progress={tFc} opacity={0.8 * tFcVis * lf} />

      <SchemaNode {...TOP} state="idle" lit={topLit} opacity={topOp} label={TOP.label} fontSize={19} />
      <Token pts={[TOP_B, RIGHT1_T]} t={tCi} color={T.danger} opacity={tCiVis * lf} />
      <SchemaNode {...RIGHT1} state="danger" lit={rightLit} opacity={rightOp} label={RIGHT1.label} fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>pinch-zoom, feels like a PDF</div>
      </SchemaNode>
      <Badge x={RIGHT1.x + RIGHT1.w / 2 - 16} y={RIGHT1.y - 34} kind="cross" scale={xScale} opacity={xScale} size={32} />
      <Pill x={TOP.x - 30} y={TOP.y - 44} text="carefully crafted desktop layout, ruined" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...LEFT1} state="accent" lit={leftLit} opacity={leftOp} label={LEFT1.label} fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>SSR-safe, initial false</div>
      </SchemaNode>
      <Token pts={[TOP_B, LEFT1_T]} t={tCe} opacity={tCeVis * lf} />
      <SchemaNode {...MID} state="accent" lit={midLit} opacity={midOp} label="BentoGridMobile, 7 screens" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>Home · About · Projects · Skills · News · Blog</div>
      </SchemaNode>
      <Token pts={[LEFT1_B, MID_T]} t={tEf} opacity={tEfVis * lf} />

      <SchemaNode {...BOTLEFT} state="success" lit={botLeftLit} opacity={botLeftOp} label="Framer Motion swipe" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>50px threshold</div>
      </SchemaNode>
      <SchemaNode {...BOTRIGHT} state="success" lit={botRightLit} opacity={botRightOp} label="glassmorphism bottom nav" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>env(safe-area-inset-bottom)</div>
      </SchemaNode>
      <Token pts={[MID_B, BOTLEFT_T]} t={tFl} color={T.success} opacity={tFlVis * lf} />
      <Token pts={[MID_B, BOTRIGHT_T]} t={tFc} color={T.success} opacity={tFcVis * lf} />
      <Pill x={BOTLEFT.x - 10} y={BOTLEFT.y + BOTLEFT.h + 14} text="backdrop-filter: blur(10px)" color={T.success} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Squashing a desktop BentoGrid onto a 375px screen made it an unreadable mess" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A dedicated BentoGridMobile component renders 7 native-feeling mobile screens" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Swipe gestures and a glassmorphism bottom nav clear every device notch" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>100% content visibility, zero obscured elements</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>A fluid, native-feeling mobile app UX</div>
      </div>
    </AbsoluteFill>
  );
};
