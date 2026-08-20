/**
 * FeatureGeminiFallbackRetry — feature j46 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Gemini 2.5 Flash's intermittent 503s could stall a single job
 * analysis for up to 195s across 6 retries before failing outright →
 * _call_gemini_api() in worker/analyze_worker.py now retries the primary
 * model 3x with exponential backoff (5s, 10s, 20s) → still failing on
 * 503/429 switches to GEMINI_FALLBACK_MODEL (gemini-2.0-flash) for 2 more
 * attempts → recovery time drops from 195s to ~50s, failures nearly gone.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const JOB = { x: 80, y: 44, w: 260, h: 88 };
const PRIMARY = { x: 900, y: 44, w: 280, h: 88 };

const CALL = { x: 60, y: 250, w: 300, h: 96 };
const RETRY = { x: 490, y: 250, w: 270, h: 96 };
const FALLBACK = { x: 900, y: 250, w: 280, h: 96 };

const JOB_R: Pt = { x: JOB.x + JOB.w, y: JOB.y + JOB.h / 2 };
const PRIMARY_L: Pt = { x: PRIMARY.x, y: PRIMARY.y + PRIMARY.h / 2 };
const CALL_R: Pt = { x: CALL.x + CALL.w, y: CALL.y + CALL.h / 2 };
const RETRY_L: Pt = { x: RETRY.x, y: RETRY.y + RETRY.h / 2 };
const RETRY_R: Pt = { x: RETRY.x + RETRY.w, y: RETRY.y + RETRY.h / 2 };
const FALLBACK_L: Pt = { x: FALLBACK.x, y: FALLBACK.y + FALLBACK.h / 2 };

const P_JP: Pt[] = [JOB_R, PRIMARY_L];
const P_CR: Pt[] = [CALL_R, RETRY_L];
const P_RF: Pt[] = [RETRY_R, FALLBACK_L];

export const FeatureGeminiFallbackRetry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): Gemini 2.5 Flash 503s stall analysis up to 195s ──
  const jobOp = Math.min(1, pop(10)) * lf;
  const jobLit = 0.3 * lf;
  const primaryOp = appear(30, 18) * lf;
  const primaryLit = interpolate(frame, [40, 62, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tJp = seg(frame, 36, 58);
  const tJpVis = frame >= 36 && frame < 96 ? 1 : 0;
  const crossScale = pop(50) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const timePillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const timePillOp = timePillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): 3 retries, exponential backoff ──
  const callOp = appear(126, 18) * lf;
  const callLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tCr = seg(frame, 148, 172);
  const tCrVis = frame >= 148 && frame < 206 ? 1 : 0;
  const retryOp = appear(150, 18) * lf;
  const retryLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const backoffPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const backoffPillOp = backoffPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): still failing -> gemini-2.0-flash fallback ──
  const tRf = seg(frame, 240, 264);
  const tRfVis = frame >= 240 && frame < 300 ? 1 : 0;
  const fallbackOp = appear(244, 18) * lf;
  const fallbackLit = interpolate(frame, [252, 274, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const configPillIn = seg(frame, 254, 276, Easing.out(Easing.cubic));
  const configPillOp = configPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_JP} color={T.danger} width={2.5} progress={tJp} opacity={0.8 * tJpVis * lf} />
      <Connector pts={P_CR} color={T.accent} width={2.5} progress={tCr} opacity={0.8 * tCrVis * lf} />
      <Connector pts={P_RF} color={T.amber} width={2.5} progress={tRf} opacity={0.8 * tRfVis * lf} />

      <SchemaNode {...JOB} state="accent" lit={jobLit} opacity={jobOp} label="Job analysis request" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>worker/analyze_worker.py</div>
      </SchemaNode>
      <SchemaNode {...PRIMARY} state="danger" lit={primaryLit} opacity={primaryOp} label="Gemini 2.5 Flash" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>503 errors at peak times</div>
      </SchemaNode>
      <Token pts={P_JP} t={tJp} color={T.danger} opacity={tJpVis * lf} />
      <Badge x={PRIMARY.x + PRIMARY.w / 2 - 18} y={PRIMARY.y + PRIMARY.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={PRIMARY.x - 90} y={PRIMARY.y + PRIMARY.h + 46} text="up to 195s before failing outright" color={T.danger} opacity={timePillOp} fontSize={16} />

      <SchemaNode {...CALL} state="accent" lit={callLit} opacity={callOp} label="_call_gemini_api()" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>analyze_worker.py</div>
      </SchemaNode>
      <SchemaNode {...RETRY} state="amber" lit={retryLit} opacity={retryOp} label="3 retries" fontSize={20}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>5s → 10s → 20s backoff</div>
      </SchemaNode>
      <SchemaNode {...FALLBACK} state="success" lit={fallbackLit} opacity={fallbackOp} label="gemini-2.0-flash" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>fallback, 2 more retries</div>
      </SchemaNode>
      <Token pts={P_CR} t={tCr} opacity={tCrVis * lf} />
      <Token pts={P_RF} t={tRf} color={T.amber} opacity={tRfVis * lf} />
      <Pill x={CALL.x + 10} y={CALL.y - 46} dx={0} text="primary model exponential backoff" color={T.amber} opacity={backoffPillOp} fontSize={15} />
      <Pill x={FALLBACK.x - 60} y={FALLBACK.y - 46} dx={0} text="GEMINI_FALLBACK_MODEL config" color={T.success} opacity={configPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="One overloaded model could stall a job analysis for over 3 minutes" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Primary model gets 3 chances with growing backoff before giving up" color={T.text} opacity={cap2} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Still down? A slightly lighter model finishes the job instead" color={T.success} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>195s worst-case recovery → ~50s, failures nearly eliminated</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Users get their job insights even during outages</div>
      </div>
    </AbsoluteFill>
  );
};
