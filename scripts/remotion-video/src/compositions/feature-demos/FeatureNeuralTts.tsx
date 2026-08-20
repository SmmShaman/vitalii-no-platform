/**
 * FeatureNeuralTts — feature p12 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: standard TTS sounds robotic, human voiceover artists cost
 * $50-200/video — 5-10 videos/day would blow the budget by $250-2000 →
 * generateVideoScript pivots to the Zvukogram API for higher quality and
 * precise timestamps → the API returns .mp3 audio plus a word_timestamps
 * JSON array feeding Remotion's AnimatedSubtitles → human-quality audio for
 * a few dollars, with pixel-perfect word-level caption sync.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ROBOT = { x: 140, y: 30, w: 340, h: 80 };
const HUMAN = { x: 780, y: 30, w: 340, h: 80 };
const ZVUK = { x: 460, y: 170, w: 360, h: 80 };
const MP3 = { x: 90, y: 310, w: 280, h: 90 };
const TS = { x: 500, y: 310, w: 280, h: 90 };
const SUBS = { x: 900, y: 310, w: 280, h: 90 };

const ROBOT_B: Pt = { x: ROBOT.x + ROBOT.w / 2, y: ROBOT.y + ROBOT.h };
const HUMAN_B: Pt = { x: HUMAN.x + HUMAN.w / 2, y: HUMAN.y + HUMAN.h };
const ZVUK_T: Pt = { x: ZVUK.x + ZVUK.w / 2, y: ZVUK.y };
const ZVUK_B: Pt = { x: ZVUK.x + ZVUK.w / 2, y: ZVUK.y + ZVUK.h };
const MP3_T: Pt = { x: MP3.x + MP3.w / 2, y: MP3.y };
const TS_T: Pt = { x: TS.x + TS.w / 2, y: TS.y };
const TS_R: Pt = { x: TS.x + TS.w, y: TS.y + TS.h / 2 };
const SUBS_L: Pt = { x: SUBS.x, y: SUBS.y + SUBS.h / 2 };

const P_ROBOT_ZVUK: Pt[] = [ROBOT_B, ZVUK_T];
const P_HUMAN_ZVUK: Pt[] = [HUMAN_B, ZVUK_T];
const P_ZVUK_MP3: Pt[] = [ZVUK_B, MP3_T];
const P_ZVUK_TS: Pt[] = [ZVUK_B, TS_T];
const P_TS_SUBS: Pt[] = [TS_R, SUBS_L];

export const FeatureNeuralTts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–112): robotic TTS or unsustainable human cost ──
  const robotOp = Math.min(1, pop(4)) * lf;
  const robotLit = interpolate(frame, [4, 26, 88, 108], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const humanOp = Math.min(1, pop(14)) * lf;
  const humanLit = interpolate(frame, [14, 36, 88, 108], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale0 = pop(40) * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const crossScale1 = pop(48) * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const costPillIn = seg(frame, 54, 76, Easing.out(Easing.cubic));
  const costPillOp = costPillIn * interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 22, 44, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [94, 114], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (118–246): pivot to Zvukogram ──
  const tRz = seg(frame, 120, 142);
  const tRzVis = frame >= 120 && frame < 190 ? 1 : 0;
  const tHz = seg(frame, 120, 142);
  const tHzVis = frame >= 120 && frame < 190 ? 1 : 0;
  const zvukOp = appear(124, 18) * lf;
  const zvukLit = interpolate(frame, [132, 154, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const pivotPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const pivotPillOp = pivotPillIn * interpolate(frame, [242, 262], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 156, 178, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [242, 262], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–350): mp3 + word_timestamps → AnimatedSubtitles ──
  const tZm = seg(frame, 252, 274);
  const tZmVis = frame >= 252 && frame < 330 ? 1 : 0;
  const mp3Op = appear(256, 18) * lf;
  const mp3Lit = interpolate(frame, [264, 286, 330, 350], [0, 0.65, 0.65, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tZt = seg(frame, 252, 274);
  const tZtVis = frame >= 252 && frame < 330 ? 1 : 0;
  const tsOp = appear(256, 18) * lf;
  const tsLit = interpolate(frame, [264, 286, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tTsSub = seg(frame, 278, 300);
  const tTsSubVis = frame >= 278 && frame < 330 ? 1 : 0;
  const subsOp = appear(282, 18) * lf;
  const subsLit = interpolate(frame, [290, 312, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const wordPillIn = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const wordPillOp = wordPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 258, 280, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (360–450): result ──
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;
  const metricOp = seg(frame, 366, 388, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_ROBOT_ZVUK} color={T.danger} width={2.5} progress={tRz} opacity={0.8 * tRzVis * lf} />
      <Connector pts={P_HUMAN_ZVUK} color={T.danger} width={2.5} progress={tHz} opacity={0.8 * tHzVis * lf} />
      <Connector pts={P_ZVUK_MP3} color={T.accent} width={2} progress={tZm} opacity={0.8 * tZmVis * lf} />
      <Connector pts={P_ZVUK_TS} color={T.accent} width={2} progress={tZt} opacity={0.8 * tZtVis * lf} />
      <Connector pts={P_TS_SUBS} color={T.success} width={2.5} progress={tTsSub} opacity={0.8 * tTsSubVis * lf} />

      <SchemaNode {...ROBOT} state="danger" lit={robotLit} opacity={robotOp} label="Google / AWS Polly TTS" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>painfully robotic</div>
      </SchemaNode>
      <Badge x={ROBOT.x + ROBOT.w - 18} y={ROBOT.y - 18} kind="cross" scale={crossScale0} opacity={crossScale0} />

      <SchemaNode {...HUMAN} state="danger" lit={humanLit} opacity={humanOp} label="human voiceover artists" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>$50-200 per video</div>
      </SchemaNode>
      <Badge x={HUMAN.x + HUMAN.w - 18} y={HUMAN.y - 18} kind="cross" scale={crossScale1} opacity={crossScale1} />
      <Pill x={460} y={128} dx={0} text="$250-2000/day for 5-10 videos" color={T.danger} opacity={costPillOp} fontSize={16} />

      <SchemaNode {...ZVUK} state="accent" lit={zvukLit} opacity={zvukOp} label="Zvukogram API" fontSize={20} />
      <Token pts={P_ROBOT_ZVUK} t={tRz} color={T.danger} opacity={tRzVis * lf} />
      <Token pts={P_HUMAN_ZVUK} t={tHz} color={T.danger} opacity={tHzVis * lf} />
      <Pill x={ZVUK.x - 30} y={ZVUK.y + ZVUK.h + 14} text="pivot from OpenAI TTS — better quality + timestamps" color={T.accent} opacity={pivotPillOp} fontSize={15} />

      <SchemaNode {...MP3} state="accent" lit={mp3Lit} opacity={mp3Op} label=".mp3 audio" fontSize={18} />
      <Token pts={P_ZVUK_MP3} t={tZm} opacity={tZmVis * lf} />
      <SchemaNode {...TS} state="accent" lit={tsLit} opacity={tsOp} label="word_timestamps JSON" fontSize={16} />
      <Token pts={P_ZVUK_TS} t={tZt} opacity={tZtVis * lf} />
      <Pill x={TS.x - 30} y={TS.y - 46} text="{word, start_time, end_time}" color={T.accent} opacity={wordPillOp} fontSize={15} />
      <SchemaNode {...SUBS} state="success" lit={subsLit} opacity={subsOp} label="AnimatedSubtitles" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Remotion</div>
      </SchemaNode>
      <Token pts={P_TS_SUBS} t={tTsSub} color={T.success} opacity={tTsSubVis * lf} />

      <Caption x={90} y={648} w={1100} text="Robotic TTS or $50-200/video human talent — neither scales" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A pivot to Zvukogram for higher quality and precise timestamps" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Word-level timestamps drive pixel-perfect, synchronized captions" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Human-quality audio, virtually indistinguishable</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>$250-2000/day → a few dollars</div>
      </div>
    </AbsoluteFill>
  );
};
