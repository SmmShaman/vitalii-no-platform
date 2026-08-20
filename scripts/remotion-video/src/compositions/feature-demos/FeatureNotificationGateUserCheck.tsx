/**
 * FeatureNotificationGateUserCheck — feature j56 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every analyzed job pushed its own Telegram card regardless of
 * score, and with two people's applications now flowing through the same
 * tables, nothing stopped the agent from hand-filling the wrong person's
 * form → a per-user card_notify_min_score (default 40) in
 * analyze_worker.py gates the per-job card, rolling low scorers into one
 * digest line instead → skills/application-pipeline now documents a
 * binding rule: verify application.user_id matches the operator before
 * hand-authoring or submitting anything, else flag manual_review.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const NOISE = { x: 60, y: 44, w: 340, h: 88 };
const RISK = { x: 850, y: 44, w: 330, h: 88 };

const SCORE = { x: 50, y: 250, w: 300, h: 96 };
const WORKER = { x: 480, y: 250, w: 280, h: 96 };
const DIGEST = { x: 900, y: 250, w: 280, h: 96 };

const NOISE_R: Pt = { x: NOISE.x + NOISE.w, y: NOISE.y + NOISE.h / 2 };
const RISK_L: Pt = { x: RISK.x, y: RISK.y + RISK.h / 2 };
const SCORE_R: Pt = { x: SCORE.x + SCORE.w, y: SCORE.y + SCORE.h / 2 };
const WORKER_L: Pt = { x: WORKER.x, y: WORKER.y + WORKER.h / 2 };
const WORKER_R: Pt = { x: WORKER.x + WORKER.w, y: WORKER.y + WORKER.h / 2 };
const DIGEST_L: Pt = { x: DIGEST.x, y: DIGEST.y + DIGEST.h / 2 };

const P_NR: Pt[] = [NOISE_R, RISK_L];
const P_SW: Pt[] = [SCORE_R, WORKER_L];
const P_WD: Pt[] = [WORKER_R, DIGEST_L];

export const FeatureNotificationGateUserCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): notification noise + no cross-user safeguard ──
  const noiseOp = Math.min(1, pop(10)) * lf;
  const noiseLit = 0.3 * lf;
  const riskOp = appear(30, 18) * lf;
  const riskLit = interpolate(frame, [40, 62, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tNr = seg(frame, 36, 58);
  const tNrVis = frame >= 36 && frame < 96 ? 1 : 0;
  const crossScale = pop(50) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): card_notify_min_score gates the per-job card ──
  const scoreOp = appear(126, 18) * lf;
  const scoreLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tSw = seg(frame, 148, 172);
  const tSwVis = frame >= 148 && frame < 206 ? 1 : 0;
  const workerOp = appear(150, 18) * lf;
  const workerLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tWd = seg(frame, 182, 206);
  const tWdVis = frame >= 182 && frame < 236 ? 1 : 0;
  const digestOp = appear(184, 18) * lf;
  const digestLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const defaultPillIn = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const defaultPillOp = defaultPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): user_id check before hand-authoring/submitting ──
  const checkScale = pop(250) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const mismatchPillIn = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const mismatchPillOp = mismatchPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_NR} color={T.danger} width={2.5} progress={tNr} opacity={0.8 * tNrVis * lf} />
      <Connector pts={P_SW} color={T.accent} width={2.5} progress={tSw} opacity={0.8 * tSwVis * lf} />
      <Connector pts={P_WD} color={T.accent} width={2.5} progress={tWd} opacity={0.8 * tWdVis * lf} />

      <SchemaNode {...NOISE} state="danger" lit={noiseLit} opacity={noiseOp} label="Every job = own Telegram card" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>low score, same notification weight</div>
      </SchemaNode>
      <SchemaNode {...RISK} state="danger" lit={riskLit} opacity={riskOp} label="No cross-user safeguard" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>operator + Natalia, shared tables</div>
      </SchemaNode>
      <Token pts={P_NR} t={tNr} color={T.danger} opacity={tNrVis * lf} />
      <Badge x={RISK.x + RISK.w / 2 - 18} y={RISK.y + RISK.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...SCORE} state="accent" lit={scoreLit} opacity={scoreOp} label="card_notify_min_score" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>per-user setting</div>
      </SchemaNode>
      <SchemaNode {...WORKER} state="accent" lit={workerLit} opacity={workerOp} label="analyze_worker.py" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>gates the per-job card</div>
      </SchemaNode>
      <SchemaNode {...DIGEST} state="success" lit={digestLit} opacity={digestOp} label="Evening digest" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>single filtered-count line</div>
      </SchemaNode>
      <Token pts={P_SW} t={tSw} opacity={tSwVis * lf} />
      <Token pts={P_WD} t={tWd} opacity={tWdVis * lf} />
      <Pill x={SCORE.x + 10} y={SCORE.y - 46} dx={0} text="default 40, still analyzed and stored" color={T.amber} opacity={defaultPillOp} fontSize={15} />

      <div style={{ position: "absolute", left: DIGEST.x - 40, top: DIGEST.y + DIGEST.h + 40, opacity: checkScale, transform: `scale(${checkScale})`, fontFamily }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.success }}>verify application.user_id first</div>
      </div>
      <Badge x={DIGEST.x - 34} y={DIGEST.y + DIGEST.h + 34} kind="check" scale={checkScale} opacity={checkScale} size={24} />
      <Pill x={WORKER.x - 20} y={WORKER.y + WORKER.h + 14} text="mismatch → manual_review + bot notify" color={T.success} opacity={mismatchPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Every job, high or low score, generated the same notification weight" color={T.danger} opacity={cap1} fontSize={20} weight={600} />
      <Caption x={90} y={648} w={1100} text="Low scorers now roll into a single digest line instead of their own card" color={T.text} opacity={cap2} fontSize={20} weight={600} />
      <Caption x={90} y={648} w={1100} text="Nothing acts on another user's application without an explicit check" color={T.success} opacity={cap3} fontSize={21} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Tunable notification volume · explicit cross-user check</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Quieter inbox, safer multi-user data</div>
      </div>
    </AbsoluteFill>
  );
};
