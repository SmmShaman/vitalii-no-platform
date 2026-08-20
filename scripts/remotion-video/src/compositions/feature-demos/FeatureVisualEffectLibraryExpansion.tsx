/**
 * FeatureVisualEffectLibraryExpansion — feature v09 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a ~4.5-minute digest has ~40 phrase-level visual blocks, but
 * VisualBlockScene.tsx only implemented 4 backgroundEffect and 5 textEffect
 * variants — repetition was mathematically guaranteed, and the richer
 * scene-effect layer was chosen by regex-matching a free-text description,
 * incidental rather than deliberate → 3 new background effects (pushIn,
 * parallaxDrift, pulseGlow) and 3 new text effects (wordFade, slideIn,
 * glitchIn) take the library from 4/5 to 7/8 → aiDirectSingleSegment() gets
 * a usedSoFar tracker so segment 8 knows what segments 1-7 already used →
 * a new sceneEffect field is checked before the old regex fallback, taking
 * the scene-effect layer from 17 to 19 types.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA, lerpColor } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PROBLEM = { x: 250, y: 46, w: 780, h: 108 };
const PROBLEM_B: Pt = { x: PROBLEM.x + PROBLEM.w / 2, y: PROBLEM.y + PROBLEM.h };

const EXPAND = { x: 130, y: 232, w: 500, h: 116 };
const EXPAND_R: Pt = { x: EXPAND.x + EXPAND.w, y: EXPAND.y + EXPAND.h / 2 };
const EXPAND_B: Pt = { x: EXPAND.x + EXPAND.w / 2, y: EXPAND.y + EXPAND.h };

const TRACKER = { x: 680, y: 232, w: 450, h: 116 };
const TRACKER_L: Pt = { x: TRACKER.x, y: TRACKER.y + TRACKER.h / 2 };
const TRACKER_B: Pt = { x: TRACKER.x + TRACKER.w / 2, y: TRACKER.y + TRACKER.h };

const SCENE = { x: 380, y: 400, w: 440, h: 92 };
const SCENE_T: Pt = { x: SCENE.x + SCENE.w / 2, y: SCENE.y };

const PROBLEM_TO_EXPAND: Pt[] = [PROBLEM_B, { x: PROBLEM_B.x, y: 190 }, EXPAND_R];
const EXPAND_TO_TRACKER: Pt[] = [EXPAND_R, TRACKER_L];
const TRACKER_TO_SCENE: Pt[] = [TRACKER_B, { x: TRACKER_B.x, y: 370 }, SCENE_T];

const NumberPair: React.FC<{ label: string; before: number; after: number }> = ({ label, before, after }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
    <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, width: 108 }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: hexA(T.danger, 0.85) }}>{before}</div>
    <div style={{ fontSize: 13, color: T.muted }}>→</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: lerpColor(T.text, T.success, 0.4) }}>{after}</div>
  </div>
);

export const FeatureVisualEffectLibraryExpansion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 40 blocks, only 4 bg + 5 text effects
  const problemOp = pop(6) * lf;
  const problemLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: library expands, usedSoFar tracker
  const t2a = seg(frame, 148, 172);
  const t2aVis = frame >= 148 && frame < 194 ? 1 : 0;
  const t2b = seg(frame, 180, 204);
  const t2bVis = frame >= 180 && frame < 226 ? 1 : 0;
  const expandOp = appear(148, 18) * lf;
  const expandLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const trackerOp = appear(184, 18) * lf;
  const trackerLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: sceneEffect field, 17 → 19 types
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const sceneOp = appear(268, 18) * lf;
  const sceneLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={PROBLEM_TO_EXPAND} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={EXPAND_TO_TRACKER} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={TRACKER_TO_SCENE} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...PROBLEM} state="danger" lit={problemLit} opacity={problemOp} label="~40 blocks, 4 bg + 5 text effects" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>repetition mathematically guaranteed</div>
      </SchemaNode>
      <Pill x={PROBLEM.x + 170} y={PROBLEM.y + PROBLEM.h + 18} text="scene effect picked by regex, not by choice" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...EXPAND} state="accent" lit={expandLit} opacity={expandOp} label="Library expanded" fontSize={19}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          <NumberPair label="backgroundEffect" before={4} after={7} />
          <NumberPair label="textEffect" before={5} after={8} />
        </div>
      </SchemaNode>
      <Token pts={PROBLEM_TO_EXPAND} t={t2a} opacity={t2aVis * lf} />
      <SchemaNode {...TRACKER} state="accent" lit={trackerLit} opacity={trackerOp} label="usedSoFar tracker" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>segment 8 sees what 1-7 already used</div>
      </SchemaNode>
      <Token pts={EXPAND_TO_TRACKER} t={t2b} opacity={t2bVis * lf} />

      <SchemaNode {...SCENE} state="success" lit={sceneLit} opacity={sceneOp} label="sceneEffect field, deliberate" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>17 → 19 overlay types, checked before regex</div>
      </SchemaNode>
      <Token pts={TRACKER_TO_SCENE} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={SCENE.x + 30} y={SCENE.y + SCENE.h + 14} text="verified: npx tsc --noEmit, zero errors" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Too few real options across 40 blocks — repeats were baked in by the math" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Three new background and three new text effects nearly double the library" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The video now has explicit memory of what it already showed the viewer" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>4→7 backgrounds · 5→8 text effects · 17→19 scene overlays</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>no more visual deja vu in daily videos</div>
      </div>
    </AbsoluteFill>
  );
};
