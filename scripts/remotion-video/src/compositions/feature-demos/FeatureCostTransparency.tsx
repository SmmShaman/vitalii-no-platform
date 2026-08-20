/**
 * FeatureCostTransparency — feature j39 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Azure GPT-4 costs $2.50/1M input, $10/1M output — users only saw
 * their real spend when the monthly invoice hit, flying blind → every call
 * in job-analyzer / generate_application extracts prompt_tokens and
 * completion_tokens, computes cost = (in*PRICE_IN + out*PRICE_OUT)/1M,
 * writes it to system_logs with user_id + function_name → a MetricCard
 * shows real-time SUM(cost_usd) → active users see $2-5/week, no surprises.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const CALLS = { x: 440, y: 50, w: 400, h: 88, label: "Azure GPT-4 call" };
const CALLS_B: Pt = { x: CALLS.x + CALLS.w / 2, y: CALLS.y + CALLS.h };

const INVOICE = { x: 850, y: 210, w: 300, h: 78, label: "monthly invoice" };
const INVOICE_T: Pt = { x: INVOICE.x + INVOICE.w / 2, y: INVOICE.y };

const EXTRACT = { x: 130, y: 210, w: 280, h: 78, label: "usage.prompt_tokens" };
const EXTRACT_T: Pt = { x: EXTRACT.x + EXTRACT.w / 2, y: EXTRACT.y };
const EXTRACT_B: Pt = { x: EXTRACT.x + EXTRACT.w / 2, y: EXTRACT.y + EXTRACT.h };

const FORMULA = { x: 470, y: 350, w: 340, h: 90 };
const FORMULA_T: Pt = { x: FORMULA.x + FORMULA.w / 2, y: FORMULA.y };
const FORMULA_B: Pt = { x: FORMULA.x + FORMULA.w / 2, y: FORMULA.y + FORMULA.h };

const LOGS = { x: 130, y: 500, w: 260, h: 78 };
const CARD = { x: 850, y: 500, w: 300, h: 78 };
const LOGS_T: Pt = { x: LOGS.x + LOGS.w / 2, y: LOGS.y };
const CARD_T: Pt = { x: CARD.x + CARD.w / 2, y: CARD.y };

export const FeatureCostTransparency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): users fly blind until the monthly invoice hits ──
  const callsOp = Math.min(1, pop(6)) * lf;
  const callsLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tCi = seg(frame, 30, 54);
  const tCiVis = frame >= 30 && frame < 96 ? 1 : 0;
  const invoiceOp = appear(38, 18) * lf;
  const invoiceLit = interpolate(frame, [38, 60, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const priceePillIn = seg(frame, 22, 44, Easing.out(Easing.cubic));
  const priceePillOp = priceePillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): extract tokens → compute cost formula ──
  const tCe = seg(frame, 138, 162);
  const tCeVis = frame >= 138 && frame < 184 ? 1 : 0;
  const extractOp = appear(148, 18) * lf;
  const extractLit = interpolate(frame, [148, 170, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tEf = seg(frame, 168, 192);
  const tEfVis = frame >= 168 && frame < 214 ? 1 : 0;
  const formulaOp = appear(178, 18) * lf;
  const formulaLit = interpolate(frame, [186, 208, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): write to system_logs → MetricCard shows real-time sum ──
  const tFl = seg(frame, 250, 274);
  const tFlVis = frame >= 250 && frame < 300 ? 1 : 0;
  const tFc = seg(frame, 256, 280);
  const tFcVis = frame >= 256 && frame < 306 ? 1 : 0;
  const logsOp = appear(266, 18) * lf;
  const cardOp = appear(272, 18) * lf;
  const logsLit = interpolate(frame, [274, 296, 330, 350], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cardLit = interpolate(frame, [280, 302, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const fieldsPillIn = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const fieldsPillOp = fieldsPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={[CALLS_B, INVOICE_T]} color={T.danger} width={2.5} progress={tCi} opacity={0.8 * tCiVis * lf} />
      <Connector pts={[CALLS_B, EXTRACT_T]} color={T.accent} width={2.5} progress={tCe} opacity={0.8 * tCeVis * lf} />
      <Connector pts={[EXTRACT_B, FORMULA_T]} color={T.accent} width={2.5} progress={tEf} opacity={0.8 * tEfVis * lf} />
      <Connector pts={[FORMULA_B, LOGS_T]} color={T.success} width={2.5} progress={tFl} opacity={0.8 * tFlVis * lf} />
      <Connector pts={[FORMULA_B, CARD_T]} color={T.success} width={2.5} progress={tFc} opacity={0.8 * tFcVis * lf} />

      <SchemaNode {...CALLS} state="idle" lit={callsLit} opacity={callsOp} label={CALLS.label} fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>job-analyzer, generate_application</div>
      </SchemaNode>
      <Pill x={CALLS.x + 30} y={CALLS.y - 44} dx={(1 - priceePillIn) * 40} text="$2.50 / 1M input · $10.00 / 1M output" color={T.danger} opacity={priceePillOp} fontSize={16} />
      <SchemaNode {...INVOICE} state="danger" lit={invoiceLit} opacity={invoiceOp} label={INVOICE.label} fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>the only time spend is visible</div>
      </SchemaNode>
      <Token pts={[CALLS_B, INVOICE_T]} t={tCi} color={T.danger} opacity={tCiVis * lf} />

      <SchemaNode {...EXTRACT} state="accent" lit={extractLit} opacity={extractOp} label={EXTRACT.label} fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>+ completion_tokens</div>
      </SchemaNode>
      <Token pts={[CALLS_B, EXTRACT_T]} t={tCe} opacity={tCeVis * lf} />
      <SchemaNode {...FORMULA} state="accent" lit={formulaLit} opacity={formulaOp} label="cost_usd formula" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>(in×PRICE_IN + out×PRICE_OUT) / 1M</div>
      </SchemaNode>
      <Token pts={[EXTRACT_B, FORMULA_T]} t={tEf} opacity={tEfVis * lf} />

      <SchemaNode {...LOGS} state="success" lit={logsLit} opacity={logsOp} label="system_logs" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>user_id, function_name</div>
      </SchemaNode>
      <SchemaNode {...CARD} state="success" lit={cardLit} opacity={cardOp} label="Dashboard MetricCard" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>real-time SUM(cost_usd)</div>
      </SchemaNode>
      <Token pts={[FORMULA_B, LOGS_T]} t={tFl} color={T.success} opacity={tFlVis * lf} />
      <Token pts={[FORMULA_B, CARD_T]} t={tFc} color={T.success} opacity={tFcVis * lf} />
      <Pill x={LOGS.x - 10} y={LOGS.y + LOGS.h + 14} text="event_type · cost_usd · tokens · model" color={T.success} opacity={fieldsPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Users fly blind on AI spend until the monthly invoice lands — sticker shock" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every call's token usage feeds a precise per-call cost formula" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Logged with full context, surfaced live on the dashboard's MetricCard" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>200 jobs + 30 cover letters / week</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Predictable $2–5/week, zero surprises</div>
      </div>
    </AbsoluteFill>
  );
};
