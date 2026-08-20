/**
 * FeatureKeyPhraseCallouts — feature p69 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: AI news videos showed every spoken word as an on-screen subtitle,
 * text crawling even during narrative blocks with nothing critical said,
 * while the Visual Director's maxTokens=2000 randomly truncated effect
 * assignments mid-video → AnimatedSubtitles was ripped out of
 * VisualBlockScene.tsx's Layer 3 and replaced with KeyPhraseCallout, which
 * only surfaces numbers/percentages, company names on first mention
 * (tracked via blockIndex + allBlocks), and direct quotes → maxTokens
 * raised to 4000 and the effect palette capped to 2-3 per video →
 * NowThis/Vox-style clean narrative, callouts only on real data points.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PROBLEM = { x: 250, y: 46, w: 780, h: 112 };
const PROBLEM_B: Pt = { x: PROBLEM.x + PROBLEM.w / 2, y: PROBLEM.y + PROBLEM.h };

const CALLOUT = { x: 150, y: 240, w: 380, h: 100 };
const CALLOUT_R: Pt = { x: CALLOUT.x + CALLOUT.w, y: CALLOUT.y + CALLOUT.h / 2 };
const CALLOUT_B: Pt = { x: CALLOUT.x + CALLOUT.w / 2, y: CALLOUT.y + CALLOUT.h };

const TYPES = { x: 650, y: 240, w: 380, h: 100 };
const TYPES_L: Pt = { x: TYPES.x, y: TYPES.y + TYPES.h / 2 };
const TYPES_B: Pt = { x: TYPES.x + TYPES.w / 2, y: TYPES.y + TYPES.h };

const FIX = { x: 380, y: 410, w: 440, h: 96 };
const FIX_T: Pt = { x: FIX.x + FIX.w / 2, y: FIX.y };

const PROBLEM_TO_CALLOUT: Pt[] = [PROBLEM_B, { x: PROBLEM_B.x, y: 200 }, CALLOUT_R];
const CALLOUT_TO_TYPES: Pt[] = [CALLOUT_R, TYPES_L];
const TYPES_TO_FIX: Pt[] = [TYPES_B, { x: TYPES_B.x, y: 370 }, FIX_T];

export const FeatureKeyPhraseCallouts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: subtitle soup + JSON truncation
  const problemOp = pop(6) * lf;
  const problemLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: KeyPhraseCallout replaces AnimatedSubtitles, 3 content types
  const t2a = seg(frame, 148, 172);
  const t2aVis = frame >= 148 && frame < 194 ? 1 : 0;
  const t2b = seg(frame, 180, 204);
  const t2bVis = frame >= 180 && frame < 226 ? 1 : 0;
  const calloutOp = appear(148, 18) * lf;
  const calloutLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const typesOp = appear(184, 18) * lf;
  const typesLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: maxTokens fix + capped effect palette
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const fixOp = appear(268, 18) * lf;
  const fixLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={PROBLEM_TO_CALLOUT} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={CALLOUT_TO_TYPES} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={TYPES_TO_FIX} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...PROBLEM} state="danger" lit={problemLit} opacity={problemOp} label="Subtitle soup + JSON truncation" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>every word on screen · maxTokens=2000 cuts effects mid-video</div>
      </SchemaNode>
      <Badge x={PROBLEM.x + PROBLEM.w - 20} y={PROBLEM.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />
      <Pill x={PROBLEM.x + 200} y={PROBLEM.y + PROBLEM.h + 18} text="like a bad PowerPoint, even during silence" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...CALLOUT} state="accent" lit={calloutLit} opacity={calloutOp} label="KeyPhraseCallout" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>replaces AnimatedSubtitles</div>
      </SchemaNode>
      <Token pts={PROBLEM_TO_CALLOUT} t={t2a} opacity={t2aVis * lf} />
      <SchemaNode {...TYPES} state="accent" lit={typesLit} opacity={typesOp} label="Only 3 content types" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>numbers/% · first-mention names · quotes</div>
      </SchemaNode>
      <Token pts={CALLOUT_TO_TYPES} t={t2b} opacity={t2bVis * lf} />

      <SchemaNode {...FIX} state="success" lit={fixLit} opacity={fixOp} label="maxTokens 2000 → 4000" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>effect palette capped to 2-3/video</div>
      </SchemaNode>
      <Token pts={TYPES_TO_FIX} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={FIX.x + 30} y={FIX.y + FIX.h + 14} text="NowThis/Vox-style visual consistency" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Every spoken word crawled on screen, narrative blocks included" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="KeyPhraseCallout surfaces only numbers, first-mention names, and quotes" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Bigger token budget and a capped effect palette finish the video" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Background + voice during narrative, callouts only on real data</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>JSON truncation eliminated, effects run full length</div>
      </div>
    </AbsoluteFill>
  );
};
