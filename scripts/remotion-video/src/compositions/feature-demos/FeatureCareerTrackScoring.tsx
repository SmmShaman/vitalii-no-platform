/**
 * FeatureCareerTrackScoring — feature j55 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every job scored the same way regardless of role, and scoring for
 * higher-level "career" roles stayed optimistic on two real blockers — years
 * of paid craft experience and native-level Norwegian → classify_track() in
 * analyze_worker.py adds a jobs.track column, splitting vocational from
 * career-track roles → a seniority gate caps career-track scores at 60 and
 * a language gate caps them at 50, backed by both a prompt instruction and a
 * deterministic keyword backstop, applied during scoring itself →
 * career-track jobs are now structurally blocked from auto-submit.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const JOB = { x: 80, y: 44, w: 280, h: 88 };
const BLOCKERS = { x: 820, y: 44, w: 340, h: 88 };

const CLASSIFY = { x: 50, y: 250, w: 300, h: 96 };
const TRACK = { x: 490, y: 250, w: 280, h: 96 };
const GATES = { x: 900, y: 250, w: 290, h: 96 };

const JOB_R: Pt = { x: JOB.x + JOB.w, y: JOB.y + JOB.h / 2 };
const BLOCK_L: Pt = { x: BLOCKERS.x, y: BLOCKERS.y + BLOCKERS.h / 2 };
const CLASSIFY_R: Pt = { x: CLASSIFY.x + CLASSIFY.w, y: CLASSIFY.y + CLASSIFY.h / 2 };
const TRACK_L: Pt = { x: TRACK.x, y: TRACK.y + TRACK.h / 2 };
const TRACK_R: Pt = { x: TRACK.x + TRACK.w, y: TRACK.y + TRACK.h / 2 };
const GATES_L: Pt = { x: GATES.x, y: GATES.y + GATES.h / 2 };

const P_JB: Pt[] = [JOB_R, BLOCK_L];
const P_CT: Pt[] = [CLASSIFY_R, TRACK_L];
const P_TG: Pt[] = [TRACK_R, GATES_L];

export const FeatureCareerTrackScoring: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): one scoring style, real blockers ignored ──
  const jobOp = Math.min(1, pop(10)) * lf;
  const jobLit = 0.3 * lf;
  const blockOp = appear(30, 18) * lf;
  const blockLit = interpolate(frame, [40, 62, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tJb = seg(frame, 36, 58);
  const tJbVis = frame >= 36 && frame < 96 ? 1 : 0;
  const crossScale = pop(50) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): classify_track() -> jobs.track -> gates ──
  const classifyOp = appear(126, 18) * lf;
  const classifyLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tCt = seg(frame, 148, 172);
  const tCtVis = frame >= 148 && frame < 206 ? 1 : 0;
  const trackOp = appear(150, 18) * lf;
  const trackLit = interpolate(frame, [158, 180, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tTg = seg(frame, 182, 206);
  const tTgVis = frame >= 182 && frame < 236 ? 1 : 0;
  const gatesOp = appear(184, 18) * lf;
  const gatesLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const signalPillIn = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const signalPillOp = signalPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): hard score caps 60 / 50, applied during scoring ──
  const capScale = pop(250) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const automodePillIn = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const automodePillOp = automodePillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_JB} color={T.danger} width={2.5} progress={tJb} opacity={0.8 * tJbVis * lf} />
      <Connector pts={P_CT} color={T.accent} width={2.5} progress={tCt} opacity={0.8 * tCtVis * lf} />
      <Connector pts={P_TG} color={T.accent} width={2.5} progress={tTg} opacity={0.8 * tTgVis * lf} />

      <SchemaNode {...JOB} state="accent" lit={jobLit} opacity={jobOp} label="Every job, one scoring style" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>vocational and career alike</div>
      </SchemaNode>
      <SchemaNode {...BLOCKERS} state="danger" lit={blockLit} opacity={blockOp} label="Seniority + Norwegian gaps ignored" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>self-taught skill, B1 fluency</div>
      </SchemaNode>
      <Token pts={P_JB} t={tJb} color={T.danger} opacity={tJbVis * lf} />
      <Badge x={BLOCKERS.x + BLOCKERS.w / 2 - 18} y={BLOCKERS.y + BLOCKERS.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...CLASSIFY} state="accent" lit={classifyLit} opacity={classifyOp} label="classify_track()" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>analyze_worker.py</div>
      </SchemaNode>
      <SchemaNode {...TRACK} state="amber" lit={trackLit} opacity={trackOp} label="jobs.track" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>vocational vs career</div>
      </SchemaNode>
      <SchemaNode {...GATES} state="success" lit={gatesLit} opacity={gatesOp} label="seniority + language gates" fontSize={15}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>cap score at 60 / 50</div>
      </SchemaNode>
      <Token pts={P_CT} t={tCt} opacity={tCtVis * lf} />
      <Token pts={P_TG} t={tTg} opacity={tTgVis * lf} />
      <Pill x={CLASSIFY.x + 10} y={CLASSIFY.y - 46} dx={0} text="leadership / IT / education-leadership signal" color={T.amber} opacity={signalPillOp} fontSize={14} />

      <div style={{ position: "absolute", left: GATES.x - 40, top: GATES.y + GATES.h + 40, opacity: capScale, transform: `scale(${capScale})`, fontFamily }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.success }}>applied during scoring, not after</div>
      </div>
      <Badge x={GATES.x - 34} y={GATES.y + GATES.h + 34} kind="check" scale={capScale} opacity={capScale} size={24} />
      <Pill x={TRACK.x - 20} y={TRACK.y + TRACK.h + 14} text="/automode hard-blocks career-track auto-submit" color={T.success} opacity={automodePillOp} fontSize={14} />

      <Caption x={90} y={648} w={1100} text="A career job could score well despite disqualifying real-world gaps" color={T.danger} opacity={cap1} fontSize={20} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every job now gets classified as vocational or career-track first" color={T.text} opacity={cap2} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Career-track scores hit a hard ceiling — not a scoring nudge" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Code-enforced ceiling: 60 (seniority) / 50 (language)</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Honest scores, not sugarcoated odds</div>
      </div>
    </AbsoluteFill>
  );
};
