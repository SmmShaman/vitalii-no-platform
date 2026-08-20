/**
 * FeatureDashboard — feature j24 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: job hunting felt like a black box — "did the bot find 5 or 50
 * jobs?" → DashboardPage.tsx (React 19 + TS) pulls user-scoped data via
 * useSupabaseQuery + RLS into 4 metric cards → a Recharts pipeline chart
 * shows New→Analyzed→Written→Approved→Sent→Submitted, a Leaflet map plots
 * jobs across Norway color-coded by status → "review time under 3 seconds,
 * 47 jobs found this week".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BLACKBOX = { x: 465, y: 56, w: 350, h: 100 };
const BLACKBOX_BOTTOM: Pt = { x: BLACKBOX.x + BLACKBOX.w / 2, y: BLACKBOX.y + BLACKBOX.h };

const DASH = { x: 465, y: 220, w: 350, h: 96 };
const DASH_TOP: Pt = { x: DASH.x + DASH.w / 2, y: DASH.y };
const DASH_BOTTOM: Pt = { x: DASH.x + DASH.w / 2, y: DASH.y + DASH.h };

const METRICS = [
  { x: 80, y: 380, w: 150, h: 84, label: "47", sub: "jobs found" },
  { x: 250, y: 380, w: 150, h: 84, label: "12", sub: "in progress" },
  { x: 420, y: 380, w: 150, h: 84, label: "3", sub: "submitted" },
  { x: 590, y: 380, w: 150, h: 84, label: "$2.40", sub: "AI cost" },
];

const CHART = { x: 800, y: 380, w: 190, h: 84 };
const MAP = { x: 1010, y: 380, w: 190, h: 84 };

const PIPELINE = ["New", "Analyzed", "Written", "Approved", "Sent", "Submitted"];

export const FeatureDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): black box guessing game ──
  const bbOp = appear(6) * lf;
  const bbLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const qScale = pop(30) * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): DashboardPage.tsx pulls via RLS → metric cards ──
  const dashOp = appear(140, 18) * lf;
  const dashLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 156, 186);
  const t2Vis = frame >= 156 && frame < 220 ? 1 : 0;
  const metricOp = METRICS.map((_, i) => appear(190 + i * 8, 14) * lf);
  const pill2In = seg(frame, 198, 220, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): Recharts pipeline + Leaflet map, color-coded ──
  const chartOp = appear(244, 16) * lf;
  const mapOp = appear(258, 16) * lf;
  const chartLit = interpolate(frame, [244, 264, 330, 350], [0, 0.6, 0.6, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const mapLit = interpolate(frame, [258, 278, 330, 350], [0, 0.6, 0.6, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 268, 290, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 272, 294, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const barHeights = PIPELINE.map((_, i) => 24 - i * 3);
  const barOp = PIPELINE.map((_, i) => appear(248 + i * 6, 12) * lf);
  const markerOp = [0, 1, 2].map((i) => appear(262 + i * 8, 12) * lf);
  const markerColor = [T.success, T.amber, T.danger];

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[BLACKBOX_BOTTOM, DASH_TOP]} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />

      <SchemaNode {...BLACKBOX} state="danger" lit={bbLit} opacity={bbOp} label="Job hunt = black box" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>5 jobs found or 50? no idea</div>
      </SchemaNode>
      <Badge x={BLACKBOX.x + BLACKBOX.w / 2 - 18} y={BLACKBOX.y - 46} kind="cross" scale={qScale} opacity={qScale} />

      <SchemaNode {...DASH} state="accent" lit={dashLit} opacity={dashOp} label="DashboardPage.tsx" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>useSupabaseQuery + RLS</div>
      </SchemaNode>
      <Token pts={[BLACKBOX_BOTTOM, DASH_TOP]} t={t2} opacity={t2Vis * lf} />
      <Pill x={DASH.x + 10} y={DASH.y - 46} dx={pill2Dx} text="user-scoped, real-time" color={T.accent} opacity={pill2Op} fontSize={19} />

      {METRICS.map((m, i) => (
        <SchemaNode key={i} {...m} state="accent" lit={0.4 * metricOp[i]} opacity={metricOp[i]} label={m.label} fontSize={26}>
          <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>{m.sub}</div>
        </SchemaNode>
      ))}

      <SchemaNode {...CHART} state="amber" lit={chartLit} opacity={chartOp} fontSize={12}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 30 }}>
          {barHeights.map((h, i) => (
            <div key={i} style={{ width: 10, height: h, background: hexA(T.amber, 0.7 * barOp[i]), borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 4 }}>pipeline</div>
      </SchemaNode>

      <SchemaNode {...MAP} state="success" lit={mapLit} opacity={mapOp} fontSize={12}>
        <div style={{ display: "flex", gap: 8 }}>
          {markerColor.map((c, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: c,
                opacity: markerOp[i],
                boxShadow: `0 0 8px ${hexA(c, 0.6)}`,
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 6 }}>job map</div>
      </SchemaNode>
      <Pill x={CHART.x - 20} y={CHART.y + CHART.h + 14} dx={pill3Dx} text="Recharts pipeline · Leaflet map" color={T.success} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="No way to tell if the pipeline was working or stalled" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Four metric cards give the whole picture at a glance" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Pipeline chart and job map reveal exactly where things stall" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 620,
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Review time: under 3 seconds</div>
      </div>
    </AbsoluteFill>
  );
};
