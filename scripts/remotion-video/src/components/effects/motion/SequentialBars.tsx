/**
 * SequentialBars — columns grow one at a time from a shared baseline, each with a counter
 * riding its top edge; at the end the tallest takes the accent color, the rest go grey.
 * data: { title?: string, unit?: string, items: [{ label: "2023", value: 12 }, ...] }  (2-6 items)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { colors, typography, glass } from "../../../design-system";

type Item = { label: string; value: number };

const num = (v: unknown): number =>
  typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[^0-9.,-]/g, "").replace(",", "."));
const trunc = (s: string, n = 28) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const fmt = (v: number) => v.toLocaleString("nb-NO", { maximumFractionDigits: 1 });

function parseItems(data: Record<string, unknown>): Item[] {
  const raw = Array.isArray(data?.items) ? (data.items as unknown[]) : [];
  return raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { label: trunc(String(o.label ?? "")), value: num(o.value) };
    })
    .filter((i) => Number.isFinite(i.value))
    .slice(0, 6);
}

export function hasSequentialBarsData(data: Record<string, unknown>): boolean {
  return parseItems(data).length >= 2;
}

export const SequentialBars: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const items = parseItems(data);
  if (items.length < 2) return null;
  const d = Math.max(durationInFrames, 30);
  const isVertical = height > width;
  const title = data.title ? trunc(String(data.title), 60) : "";
  const unit = data.unit ? String(data.unit) : "";

  const buildEnd = d * 0.55;
  const start = d * 0.06;
  const slot = (buildEnd - start) / items.length;
  const hiStart = buildEnd;
  const hiEnd = Math.min(buildEnd + d * 0.12, d - 9);
  const hi = interpolate(frame, [hiStart, Math.max(hiEnd, hiStart + 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, d * 0.08], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [d - 8, d], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const maxAbs = Math.max(...items.map((i) => Math.abs(i.value)), 1e-9);
  const tallest = items.reduce((b, it, i) => (Math.abs(it.value) > Math.abs(items[b].value) ? i : b), 0);

  const panelW = Math.min(width * (isVertical ? 0.9 : 0.78), 1500);
  const chartH = height * (isVertical ? 0.38 : 0.5);
  const gap = panelW * 0.04;
  const barW = (panelW - gap * (items.length + 1)) / items.length;
  const numSize = isVertical ? 54 : 56;
  const labelSize = isVertical ? 30 : 28;

  return (
    <AbsoluteFill
      style={{
        background: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn * fadeOut,
        fontFamily: typography.fontFamily.primary,
        color: "#fff",
      }}
    >
      <div
        style={{
          width: panelW + 60,
          padding: "40px 30px 36px",
          background: glass.backgroundStrong,
          border: `1px solid ${glass.border}`,
          borderRadius: glass.borderRadiusLarge,
        }}
      >
        {title && (
          <div style={{ fontSize: isVertical ? 40 : 38, fontWeight: 700, marginBottom: 12, textAlign: "center" }}>
            {title}
          </div>
        )}
        <div style={{ position: "relative", height: chartH + numSize + 24, width: panelW, margin: "0 auto" }}>
          {items.map((it, i) => {
            const s = start + i * slot;
            const g = interpolate(frame, [s, s + slot * 0.9], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const h = (Math.abs(it.value) / maxAbs) * chartH;
            const curH = h * g;
            const isTop = i === tallest;
            const left = gap + i * (barW + gap);
            const baseAlpha = 0.85 - 0.55 * hi;
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: "absolute",
                    left,
                    bottom: 0,
                    width: barW,
                    height: curH,
                    borderRadius: "10px 10px 0 0",
                    background: `rgba(255,255,255,${isTop ? 0.85 - 0.85 * hi : baseAlpha})`,
                  }}
                />
                {isTop && (
                  <div
                    style={{
                      position: "absolute",
                      left,
                      bottom: 0,
                      width: barW,
                      height: curH,
                      borderRadius: "10px 10px 0 0",
                      background: accentColor,
                      opacity: hi,
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    left: left - gap / 2,
                    width: barW + gap,
                    bottom: curH + 8,
                    textAlign: "center",
                    fontFamily: "'Inter', sans-serif",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 800,
                    fontSize: numSize,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    opacity: g > 0.001 ? 1 : 0,
                    color: isTop && hi > 0.5 ? accentColor : "#fff",
                  }}
                >
                  {fmt(it.value * g)}
                  {unit && <span style={{ fontSize: numSize * 0.4, marginLeft: 6, opacity: 0.7 }}>{unit}</span>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ position: "relative", width: panelW, margin: "0 auto", borderTop: "2px solid rgba(255,255,255,0.5)", height: labelSize * 2 }}>
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: gap + i * (barW + gap) - gap / 2,
                width: barW + gap,
                top: 12,
                textAlign: "center",
                fontSize: labelSize,
                fontWeight: 600,
                color: colors.textMuted,
                opacity: interpolate(frame, [start + i * slot, start + i * slot + slot * 0.5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {it.label}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
