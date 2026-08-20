/**
 * FeatureLetterWrittenLast — feature j62 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: the cover letter used to get written before the rest of the form,
 * committing to content before the agent knew what fields the form even had.
 * Commit 50b1713 rewrites the fill-run prompt to fill everything except the
 * letter first, writing it last and only if a letter field exists. The same
 * commit turns the manual-review poller fully mechanical — always
 * wakeAgent:false, reporting counts instead of waking the agent for nothing.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const LETTER = { x: 90, y: 66, w: 280, h: 110 };
const POLLER = { x: 500, y: 66, w: 280, h: 110 };
const LETTER_R: Pt = { x: LETTER.x + LETTER.w, y: LETTER.y + LETTER.h / 2 };
const POLLER_L: Pt = { x: POLLER.x, y: POLLER.y + POLLER.h / 2 };

const COMMIT = { x: 465, y: 250, w: 350, h: 120 };
const COMMIT_TOP: Pt = { x: COMMIT.x + COMMIT.w / 2, y: COMMIT.y };
const COMMIT_R: Pt = { x: COMMIT.x + COMMIT.w, y: COMMIT.y + COMMIT.h / 2 };

const LAST = { x: 870, y: 266, w: 260, h: 96 };
const LAST_L: Pt = { x: LAST.x, y: LAST.y + LAST.h / 2 };

const MECH = { x: 465, y: 430, w: 350, h: 96 };
const MECH_TOP: Pt = { x: MECH.x + MECH.w / 2, y: MECH.y };
const COMMIT_BOTTOM: Pt = { x: COMMIT.x + COMMIT.w / 2, y: COMMIT.y + COMMIT.h };

const POLLER_TO_COMMIT: Pt[] = [POLLER_L, { x: POLLER_L.x - 40, y: POLLER_L.y }, COMMIT_TOP];
const COMMIT_TO_LAST: Pt[] = [COMMIT_R, LAST_L];
const COMMIT_TO_MECH: Pt[] = [COMMIT_BOTTOM, MECH_TOP];

export const FeatureLetterWrittenLast: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: letter written first, poller wakes for nothing
  const letterOp = appear(6) * lf;
  const pollerOp = appear(20) * lf;
  const pollerLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: commit 50b1713 rewrites the fill-run order
  const commitOp = appear(140, 18) * lf;
  const lastOp = appear(158, 18) * lf;
  const commitLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const lastLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: manual-review poller goes fully mechanical
  const mechOp = appear(244, 18) * lf;
  const mechLit = interpolate(frame, [252, 274, 330, 350], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={POLLER_TO_COMMIT} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={COMMIT_TO_LAST} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={COMMIT_TO_MECH} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...LETTER} state="danger" lit={0.2 * lf} opacity={letterOp} label="Cover letter first" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>before fields are even known</div>
      </SchemaNode>
      <SchemaNode {...POLLER} state="danger" lit={pollerLit} opacity={pollerOp} label="Poller wakes every row" fontSize={19}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>even with nothing changed</div>
      </SchemaNode>
      <Pill x={POLLER.x + 12} y={POLLER.y - 46} dx={pill1Dx} text="content committed too early" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...COMMIT} state="accent" lit={commitLit} opacity={commitOp} label="commit 50b1713" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>fill everything else first</div>
      </SchemaNode>
      <SchemaNode {...LAST} state="accent" lit={lastLit} opacity={lastOp} label="Letter written last" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>only if a letter field exists</div>
      </SchemaNode>
      <Token pts={POLLER_TO_COMMIT} t={t2} opacity={t2Vis * lf} />
      <Token pts={COMMIT_TO_LAST} t={t2b} opacity={t2bVis * lf} />
      <Pill x={COMMIT.x + 20} y={COMMIT.y + COMMIT.h + 14} dx={pill2Dx} text="one fill-run, one decision order" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...MECH} state="amber" lit={mechLit} opacity={mechOp} label="wakeAgent: false" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>pending_manual_total · awaiting_promotion</div>
      </SchemaNode>
      <Token pts={COMMIT_TO_MECH} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={MECH.x + 40} y={MECH.y + MECH.h + 12} dx={pill3Dx} text="reports counts, not a wake-up" color={T.amber} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="Letter content was locked in before the form was even seen" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every field gets filled first — the letter is the last decision" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="The review poller now only counts rows, never wakes for nothing" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>the letter now reflects the actual filled-out form</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>one fewer wasted wake-up, every check</div>
      </div>
    </AbsoluteFill>
  );
};
