/**
 * LineTrend — baseline axis, a line draws left to right (stroke-dashoffset) with dots landing
 * on each point, the last point labelled in accent; then a dashed least-squares trend fades in.
 * data: { title?: string, unit?: string, points: [{ label: "jan", value: 3 }, ...] }  (3-8 points)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { colors, typography, glass } from "../../../design-system";

type Pt = { label: string; value: number };

const num = (v: unknown): number =>
  typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[^0-9.,-]/g, "").replace(",", "."));
const trunc = (s: string, n = 28) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const fmt = (v: number) => v.toLocaleString("nb-NO", { maximumFractionDigits: 1 });

function parsePoints(data: Record<string, unknown>): Pt[] {
  const raw = Array.isArray(data?.points) ? (data.points as unknown[]) : [];
  return raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { label: trunc(String(o.label ?? ""), 12), value: num(o.value) };
    })
    .filter((p) => Number.isFinite(p.value))
    .slice(0, 8);
}

export function hasLineTrendData(data: Record<string, unknown>): boolean {
  return parsePoints(data).length >= 3;
}

export const LineTrend: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const pts = parsePoints(data);
  if (pts.length < 3) return null;
  const d = Math.max(durationInFrames, 30);
  const isVertical = height > width;
  const title = data.title ? trunc(String(data.title), 60) : "";
  const unit = data.unit ? String(data.unit) : "";
  const n = pts.length;

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const p = interpolate(frame, [d * 0.08, d * 0.45], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const trendP = interpolate(frame, [d * 0.47, d * 0.58], [0, 1], clamp);
  const fadeIn = interpolate(frame, [0, d * 0.08], [0, 1], clamp);
  const fadeOut = interpolate(frame, [d - 8, d], [1, 0], clamp);

  const W = Math.min(width * (isVertical ? 0.88 : 0.74), 1500);
  const H = height * (isVertical ? 0.36 : 0.46);
  const padX = 70;
  const padTop = 70;
  const padBot = 20;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBot;

  const vals = pts.map((q) => q.value);
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (hi - lo < 1e-9) {
    lo -= 1;
    hi += 1;
  }
  const pad = (hi - lo) * 0.12;
  lo -= pad;
  hi += pad;
  const X = (i: number) => padX + (i / (n - 1)) * innerW;
  const Y = (v: number) => padTop + (1 - (v - lo) / (hi - lo)) * innerH;

  const xy = pts.map((q, i) => [X(i), Y(q.value)] as const);
  const path = xy.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  let len = 0;
  for (let i = 1; i < n; i++) len += Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
  len = Math.max(len, 1);

  // least squares over index
  const mx = (n - 1) / 2;
  const my = vals.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  vals.forEach((v, i) => {
    sxy += (i - mx) * (v - my);
    sxx += (i - mx) * (i - mx);
  });
  const slope = sxx ? sxy / sxx : 0;
  const tv = (i: number) => my + slope * (i - mx);

  const labelSize = isVertical ? 26 : 24;
  const valSize = isVertical ? 48 : 46;
  const last = n - 1;
  const lastAppear = interpolate(p * last, [last - 0.5, last], [0, 1], clamp);

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
          padding: "36px 30px 28px",
          background: glass.backgroundStrong,
          border: `1px solid ${glass.border}`,
          borderRadius: glass.borderRadiusLarge,
        }}
      >
        {(title || unit) && (
          <div style={{ fontSize: isVertical ? 38 : 36, fontWeight: 700, marginBottom: 6, textAlign: "center" }}>
            {title}
            {unit && (
              <span style={{ color: colors.textMuted, fontSize: "0.7em", marginLeft: title ? 14 : 0 }}>{unit}</span>
            )}
          </div>
        )}
        <svg width={W} height={H + labelSize + 22} style={{ display: "block", overflow: "visible" }}>
          <line x1={padX - 20} x2={W - padX + 20} y1={H} y2={H} stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
          <path
            d={path}
            fill="none"
            stroke="#fff"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
          />
          <line
            x1={X(0)}
            y1={Y(tv(0))}
            x2={X(last)}
            y2={Y(tv(last))}
            stroke={accentColor}
            strokeWidth={4}
            strokeDasharray="12 12"
            strokeLinecap="round"
            opacity={trendP * 0.9}
          />
          {xy.map(([x, y], i) => {
            const land = interpolate(p * last, [i - 0.15, i + 0.1], [0, 1], clamp);
            const isLast = i === last;
            return (
              <g key={i} opacity={i === 0 ? 1 : land}>
                <circle cx={x} cy={y} r={(isLast ? 13 : 9) * (0.6 + 0.4 * (i === 0 ? 1 : land))} fill={isLast ? accentColor : "#fff"} />
                <text
                  x={x}
                  y={H + labelSize + 14}
                  textAnchor="middle"
                  fontSize={labelSize}
                  fontWeight={600}
                  fill={colors.textMuted}
                  fontFamily={typography.fontFamily.primary}
                >
                  {pts[i].label}
                </text>
              </g>
            );
          })}
          <text
            x={Math.min(xy[last][0], W - padX - 10)}
            y={xy[last][1] - 26}
            textAnchor="middle"
            fontSize={valSize}
            fontWeight={800}
            fill={accentColor}
            opacity={lastAppear}
            fontFamily="'Inter', sans-serif"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(pts[last].value)}
            {unit ? ` ${unit}` : ""}
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
