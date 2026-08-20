/**
 * FeatureManualVisualDirectives — feature v08 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: phrase-level visual planning for daily videos ran through an
 * NVIDIA/Claude API chain broken three ways at once — a deprecated model
 * 404ing, a 60s-per-segment hang after the model swap (10 minutes wasted
 * per render), and a zero-credit Claude fallback — while directVisuals()
 * silently never even ran in production DRAFT_ID mode → autoDigest() now
 * pauses after script generation, a scheduled task wakes the owner with the
 * segment scripts, directives are written by hand via a Claude subscription
 * and POSTed to submit_visual_directives, saved to visual_directives_ai →
 * directVisuals() takes a precomputedDirectives param, skips the broken API
 * call but still runs the timestamp-merge pipeline, and is now called
 * unconditionally in DRAFT_ID mode.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BROKEN = { x: 250, y: 44, w: 780, h: 112 };
const BROKEN_B: Pt = { x: BROKEN.x + BROKEN.w / 2, y: BROKEN.y + BROKEN.h };

const YOU = { x: 150, y: 236, w: 380, h: 100 };
const YOU_R: Pt = { x: YOU.x + YOU.w, y: YOU.y + YOU.h / 2 };
const YOU_B: Pt = { x: YOU.x + YOU.w / 2, y: YOU.y + YOU.h };

const SUBMIT = { x: 650, y: 236, w: 380, h: 100 };
const SUBMIT_L: Pt = { x: SUBMIT.x, y: SUBMIT.y + SUBMIT.h / 2 };
const SUBMIT_B: Pt = { x: SUBMIT.x + SUBMIT.w / 2, y: SUBMIT.y + SUBMIT.h };

const RESUME = { x: 380, y: 410, w: 440, h: 92 };
const RESUME_T: Pt = { x: RESUME.x + RESUME.w / 2, y: RESUME.y };

const BROKEN_TO_YOU: Pt[] = [BROKEN_B, { x: BROKEN_B.x, y: 200 }, YOU_R];
const YOU_TO_SUBMIT: Pt[] = [YOU_R, SUBMIT_L];
const SUBMIT_TO_RESUME: Pt[] = [SUBMIT_B, { x: SUBMIT_B.x, y: 370 }, RESUME_T];

export const FeatureManualVisualDirectives: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: broken 3-way API chain
  const brokenOp = pop(6) * lf;
  const brokenLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: written by hand via a Claude subscription, POSTed
  const t2a = seg(frame, 148, 172);
  const t2aVis = frame >= 148 && frame < 194 ? 1 : 0;
  const t2b = seg(frame, 180, 204);
  const t2bVis = frame >= 180 && frame < 226 ? 1 : 0;
  const youOp = appear(148, 18) * lf;
  const youLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const submitOp = appear(184, 18) * lf;
  const submitLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: directVisuals resumes, DRAFT_ID bug fixed
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const resumeOp = appear(268, 18) * lf;
  const resumeLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={BROKEN_TO_YOU} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={YOU_TO_SUBMIT} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={SUBMIT_TO_RESUME} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...BROKEN} state="danger" lit={brokenLit} opacity={brokenOp} label="NVIDIA 404 → 60s hang → Claude: no credits" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>10 minutes wasted per render</div>
      </SchemaNode>
      <Badge x={BROKEN.x + BROKEN.w - 20} y={BROKEN.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />
      <Pill x={BROKEN.x + 190} y={BROKEN.y + BROKEN.h + 18} text="directVisuals() also silently skipped in production" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...YOU} state="accent" lit={youLit} opacity={youOp} label="Directives written by hand" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>own Claude subscription, not metered API</div>
      </SchemaNode>
      <Token pts={BROKEN_TO_YOU} t={t2a} opacity={t2aVis * lf} />
      <SchemaNode {...SUBMIT} state="accent" lit={submitLit} opacity={submitOp} label="submit_visual_directives" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>saved to visual_directives_ai</div>
      </SchemaNode>
      <Token pts={YOU_TO_SUBMIT} t={t2b} opacity={t2bVis * lf} />

      <SchemaNode {...RESUME} state="success" lit={resumeLit} opacity={resumeOp} label="directVisuals(precomputedDirectives)" fontSize={16}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>now runs unconditionally in DRAFT_ID mode</div>
      </SchemaNode>
      <Token pts={SUBMIT_TO_RESUME} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={RESUME.x + 20} y={RESUME.y + RESUME.h + 14} text="timestamp-merge pipeline still runs after TTS" color={T.success} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="A 3-way broken API chain, and the fix was never even wired to run" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The owner writes directives by hand and posts them back to the pipeline" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A hidden bug is fixed too: this path now actually runs on real videos" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>No metered API dependency · 10 min/render reclaimed</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>phrase-level visual matching finally runs</div>
      </div>
    </AbsoluteFill>
  );
};
