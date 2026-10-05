/**
 * CompositionStrip — segments assemble left to right into one continuous 100% strip; each
 * legend entry (dot, label, "61 %") appears as its segment lands. First item = accent, rest grey.
 * data: { title?: string, items: [{ label: "Google", value: 61 }, ...] }  (2-6 items, percentages;
 * normalised to 100, with an "Andre" remainder added only if the sum is below 100)
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
  const items = raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { label: trunc(String(o.label ?? "")), value: num(o.value) };
    })
    .filter((i) => Number.isFinite(i.value) && i.value > 0)
    .slice(0, 6);
  if (items.length < 2) return items;
  const sum = items.reduce((s, i) => s + i.value, 0);
  if (sum < 99.5) return [...items, { label: "Andre", value: 100 - sum }];
  return items.map((i) => ({ ...i, value: (i.value / sum) * 100 }));
}

export function hasCompositionStripData(data: Record<string, unknown>): boolean {
  return parseItems(data).length >= 2;
}

const GREYS = [0.8, 0.62, 0.48, 0.36, 0.27, 0.2, 0.15];

export const CompositionStrip: React.FC<{
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

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const fadeIn = interpolate(frame, [0, d * 0.08], [0, 1], clamp);
  const fadeOut = interpolate(frame, [d - 8, d], [1, 0], clamp);
  const t0 = d * 0.08;
  const t1 = d * 0.55;
  const fill = interpolate(frame, [t0, t1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  const total = items.reduce((s, i) => s + i.value, 0);
  const stripW = Math.min(width * (isVertical ? 0.88 : 0.78), 1500);
  const stripH = isVertical ? 110 : 120;
  const legendSize = isVertical ? 34 : 32;
  const pctSize = isVertical ? 40 : 38;

  let acc = 0;
  const segs = items.map((it, i) => {
    const share = it.value / total;
    const from = acc;
    acc += share;
    const w = Math.max(0, Math.min(share, fill - from)) * stripW;
    const landed = fill >= acc - 1e-6;
    // legend appears as its segment finishes landing
    const lt = t0 + (t1 - t0) * 0; // base
    void lt;
    const landFrame = (() => {
      // invert easing numerically (monotonic): first frame where fill >= acc
      let lo = t0;
      let hi = t1;
      for (let k = 0; k < 20; k++) {
        const mid = (lo + hi) / 2;
        const f = interpolate(mid, [t0, t1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        if (f >= acc) hi = mid;
        else lo = mid;
      }
      return hi;
    })();
    const show = interpolate(frame, [landFrame - 4, landFrame + 6], [0, 1], clamp);
    const color =
      i === 0 ? accentColor : `rgba(255,255,255,${GREYS[Math.min(i - 1, GREYS.length - 1)]})`;
    return { it, w, landed, show, color, share };
  });

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
          padding: "40px 34px 36px",
          background: glass.backgroundStrong,
          border: `1px solid ${glass.border}`,
          borderRadius: glass.borderRadiusLarge,
        }}
      >
        {title && (
          <div style={{ fontSize: isVertical ? 40 : 38, fontWeight: 700, marginBottom: 28, textAlign: "center" }}>
            {title}
          </div>
        )}
        <div
          style={{
            width: stripW,
            height: stripH,
            display: "flex",
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {segs.map((s, i) => (
            <div
              key={i}
              style={{
                width: s.w,
                height: "100%",
                flexShrink: 0,
                background: s.color,
                borderRight: s.w > 3 && i < segs.length - 1 ? "2px solid rgba(0,0,0,0.45)" : "none",
                boxSizing: "border-box",
              }}
            />
          ))}
        </div>
        <div
          style={{
            width: stripW,
            marginTop: 36,
            display: "flex",
            flexWrap: "wrap",
            gap: isVertical ? "18px 36px" : "16px 48px",
            justifyContent: "center",
          }}
        >
          {segs.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: s.show,
                transform: `translateY(${(1 - s.show) * 14}px)`,
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: 11, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: legendSize, fontWeight: 600, color: colors.textMuted }}>{s.it.label}</span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 800,
                  fontSize: pctSize,
                  color: i === 0 ? accentColor : "#fff",
                }}
              >
                {fmt(s.it.value)} %
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
