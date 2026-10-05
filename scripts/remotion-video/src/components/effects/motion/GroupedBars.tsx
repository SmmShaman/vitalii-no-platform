/**
 * GroupedBars — two series compared across 2–3 metrics. Every metric has its OWN scale and unit;
 * inside a metric series A grows first, then series B, and only then the next metric starts.
 * data: { series: ["Før","Nå"], metrics: [{ label: "Pris", unit: "kr", a: 199, b: 149 }, ...] }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pace, tween, ease, wipeLR, fmtNum, num, clip, look } from "./grammar";

type Metric = { label: string; unit: string; a: number; b: number };

function parse(data: Record<string, unknown>): { series: [string, string]; metrics: Metric[] } {
  const s = Array.isArray(data?.series) ? (data.series as unknown[]) : [];
  const series: [string, string] = [clip(s[0] ?? "Før", 18) || "A", clip(s[1] ?? "Nå", 18) || "B"];
  const raw = Array.isArray(data?.metrics) ? (data.metrics as unknown[]) : [];
  const metrics = raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { label: clip(o.label, 30), unit: clip(o.unit, 12), a: num(o.a), b: num(o.b) };
    })
    .filter((m) => m.label && Number.isFinite(m.a) && Number.isFinite(m.b) && m.a >= 0 && m.b >= 0 && m.a + m.b > 0)
    .slice(0, 3);
  return { series, metrics };
}

export function hasGroupedBarsData(data: Record<string, unknown>): boolean {
  return parse(data).metrics.length >= 2;
}

const STEP = 0.9; // seconds between bars
const GROW = 1.1;

export const GroupedBars: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const { series, metrics } = parse(data);
  if (metrics.length < 2) return null;
  const isVertical = height > width;
  const nBars = metrics.length * 2;
  const { t } = pace(frame, fps, durationInFrames, 1 + (nBars - 1) * STEP + GROW);

  const panelW = Math.min(width - look.safeX * 2, isVertical ? 940 : 1500);
  const labelSize = isVertical ? 40 : 40;
  const valSize = isVertical ? 40 : 44;
  const valW = isVertical ? 230 : 260;
  const trackH = isVertical ? 60 : 52;
  const trackW = panelW - 80 - valW - 24;
  const groupGap = isVertical ? 70 : 34;
  const seriesColor = [look.muted, accentColor];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: look.font, color: look.ink }}>
      <div
        style={{
          width: panelW,
          padding: "36px 40px 40px",
          background: look.surface,
          borderRadius: look.radius,
          boxShadow: look.shadowHard,
          boxSizing: "border-box",
        }}
      >
        {/* legend */}
        <div
          style={{
            display: "flex",
            gap: 44,
            marginBottom: 22,
            clipPath: wipeLR(tween(t, 0.16, 0.3, ease.power2Out)),
          }}
        >
          {series.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32, fontWeight: 600 }}>
              <span style={{ width: 28, height: 28, background: seriesColor[i], display: "inline-block" }} />
              {s}
            </div>
          ))}
        </div>

        {metrics.map((m, g) => {
          const max = Math.max(m.a, m.b) * 1.05;
          const axisP = tween(t, 0.4 + g * 0.05, 0.3, ease.power2Out);
          return (
            <div key={g} style={{ marginTop: g === 0 ? 0 : groupGap }}>
              <div style={{ clipPath: wipeLR(axisP), fontSize: labelSize, fontWeight: 750, letterSpacing: look.tracking.head }}>
                {m.label}
                {m.unit && (
                  <span style={{ fontFamily: look.mono, fontSize: 26, fontWeight: 400, color: look.muted, marginLeft: 16 }}>
                    {m.unit}
                  </span>
                )}
              </div>
              {/* axis: 0 … max */}
              <div
                style={{
                  clipPath: wipeLR(axisP),
                  display: "flex",
                  justifyContent: "space-between",
                  width: trackW,
                  fontFamily: look.mono,
                  fontSize: 24,
                  color: look.muted,
                  margin: "6px 0 6px",
                }}
              >
                <span>0</span>
                <span>{fmtNum(max, 1)}</span>
              </div>
              {[m.a, m.b].map((v, i) => {
                const p = tween(t, 1 + (g * 2 + i) * STEP, GROW, ease.power2Out);
                const dec = v < 1 ? 2 : 1;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", height: trackH, marginTop: i ? 14 : 0 }}>
                    <div style={{ position: "relative", width: trackW, height: trackH, borderLeft: `${look.strokeW}px solid ${look.ink}`, boxSizing: "border-box" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: (v / max) * trackW * p,
                          background: seriesColor[i],
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: valW,
                        paddingLeft: 24,
                        fontSize: valSize,
                        fontWeight: 800,
                        letterSpacing: look.tracking.hero,
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                        opacity: p > 0.001 ? 1 : 0,
                        color: i === 1 ? accentColor : look.ink,
                      }}
                    >
                      {fmtNum(v * p, dec)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
