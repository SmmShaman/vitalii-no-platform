/**
 * FeatureInlineButtons — feature j20 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: perfect match found, but a clunky 6-step cross-platform journey
 * (dashboard → find job → write søknad → wait → confirm → send) burns 5min
 * → InlineKeyboardMarkup embeds action buttons directly in the alert →
 * handleCallbackQuery(query_data) parses prefix+job_id and updates the
 * message's keyboard in place → the /apply command batches all approved
 * FINN Easy applications into one dispatch → "4 taps, under 30s, 2x
 * conversion".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const DASH = { x: 90, y: 66, w: 220, h: 92 };
const FIND = { x: 360, y: 66, w: 220, h: 92 };
const WAIT = { x: 630, y: 66, w: 220, h: 92 };
const SEND1 = { x: 900, y: 66, w: 220, h: 92 };
const STEPS = [DASH, FIND, WAIT, SEND1];
const STEP_LABELS = ["Dashboard", "Find job", "Write søknad", "Send"];

const ALERT = { x: 465, y: 230, w: 350, h: 118 };
const ALERT_TOP: Pt = { x: ALERT.x + ALERT.w / 2, y: ALERT.y };
const ALERT_BOTTOM: Pt = { x: ALERT.x + ALERT.w / 2, y: ALERT.y + ALERT.h };

const HANDLER = { x: 465, y: 420, w: 350, h: 96 };
const HANDLER_TOP: Pt = { x: HANDLER.x + HANDLER.w / 2, y: HANDLER.y };

const ALERT_TO_HANDLER: Pt[] = [ALERT_BOTTOM, HANDLER_TOP];

export const FeatureInlineButtons: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): 6-step cross-platform journey (4 steps shown) ──
  const stepOp = STEPS.map((_, i) => appear(6 + i * 12) * lf);
  const stepConnOp = STEPS.slice(0, -1).map((_, i) => 0.35 * Math.min(stepOp[i], stepOp[i + 1]));
  const pill1In = seg(frame, 56, 78, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): InlineKeyboardMarkup buttons on the alert ──
  const alertOp = appear(140, 18) * lf;
  const alertLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const btnLabels = ["Write søknad", "View", "Approve", "Send"];
  const btnOp = btnLabels.map((_, i) => appear(156 + i * 8, 14) * lf);
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): handleCallbackQuery parses prefix+job_id ──
  const handlerOp = appear(244, 18) * lf;
  const handlerLit = interpolate(frame, [252, 274, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {STEPS.slice(0, -1).map((s, i) => (
        <Connector key={i} pts={[{ x: s.x + s.w, y: s.y + s.h / 2 }, { x: STEPS[i + 1].x, y: STEPS[i + 1].y + STEPS[i + 1].h / 2 }]} color={T.danger} width={2} opacity={stepConnOp[i]} />
      ))}
      <Connector pts={ALERT_TO_HANDLER} color={T.accent} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      {STEPS.map((s, i) => (
        <SchemaNode key={i} {...s} state="danger" lit={0.2 * lf} opacity={stepOp[i]} label={STEP_LABELS[i]} fontSize={19} />
      ))}
      <Pill x={DASH.x + 10} y={DASH.y - 46} dx={pill1Dx} text="6 steps, 2 platforms, 5 minutes" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...ALERT} state="accent" lit={alertLit} opacity={alertOp} label="Job alert" fontSize={24}>
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "nowrap", justifyContent: "center" }}>
          {btnLabels.map((b, i) => (
            <div
              key={b}
              style={{
                opacity: btnOp[i],
                fontSize: 12,
                fontWeight: 600,
                padding: "4px 8px",
                borderRadius: 8,
                border: `1px solid ${hexA(T.accent, 0.7)}`,
                color: T.text,
                background: T.nodeFillDeep,
                whiteSpace: "nowrap",
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </SchemaNode>
      <Pill x={ALERT.x + 10} y={ALERT.y - 46} dx={pill2Dx} text="InlineKeyboardMarkup — one tap away" color={T.accent} opacity={pill2Op} fontSize={19} />

      <SchemaNode {...HANDLER} state="accent" lit={handlerLit} opacity={handlerOp} label="handleCallbackQuery()" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>prefix + job_id → action → keyboard updated in place</div>
      </SchemaNode>
      <Token pts={ALERT_TO_HANDLER} t={t3} opacity={t3Vis * lf} />
      <Pill x={HANDLER.x + 10} y={HANDLER.y + HANDLER.h + 12} dx={pill3Dx} text="/apply batches all approved FINN Easy jobs" color={T.amber} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="Perfect match, but a 6-step trip across two platforms" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every action lives as a button on the alert itself" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="One callback handler drives every button, every status" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>seen job → submitted application</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>4 taps, under 30s — 2x conversion rate</div>
      </div>
    </AbsoluteFill>
  );
};
