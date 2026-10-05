/**
 * RatioBars — two horizontal bars grow on one shared linear scale with values at their ends;
 * a bracket on the right then resolves their relation as a big "×3,2" (larger / smaller).
 * data: { a: { label, value }, b: { label, value }, unit?: string }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { colors, typography, glass } from "../../../design-system";

type Side = { label: string; value: number };

const num = (v: unknown): number =>
  typeof v === "number" ? v : parseFloat(String(v ?? "").replace(/[^0-9.,-]/g, "").replace(",", "."));
const trunc = (s: string, n = 28) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const fmt = (v: number) => v.toLocaleString("nb-NO", { maximumFractionDigits: 1 });

function parseSide(x: unknown): Side | null {
  const o = (x ?? {}) as Record<string, unknown>;
  const value = num(o.value);
  if (!Number.isFinite(value) || value <= 0) return null;
  return { label: trunc(String(o.label ?? "")), value };
}

export function hasRatioBarsData(data: Record<string, unknown>): boolean {
  return !!parseSide(data?.a) && !!parseSide(data?.b);
}

export const RatioBars: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const a = parseSide(data?.a);
  const b = parseSide(data?.b);
  if (!a || !b) return null;
  const d = Math.max(durationInFrames, 30);
  const isVertical = height > width;
  const unit = data.unit ? String(data.unit) : "";

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const growEnd = d * 0.4;
  const grow = interpolate(frame, [d * 0.06, growEnd], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bracketP = interpolate(frame, [d * 0.42, d * 0.52], [0, 1], clamp);
  const ratioP = interpolate(frame, [d * 0.5, d * 0.62], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fadeIn = interpolate(frame, [0, d * 0.08], [0, 1], clamp);
  const fadeOut = interpolate(frame, [d - 8, d], [1, 0], clamp);

  const big = Math.max(a.value, b.value);
  const small = Math.min(a.value, b.value);
  const ratio = big / small;
  const ratioText = "×" + (Math.round(ratio * 10) / 10).toFixed(1).replace(".", ",");
  const aBigger = a.value >= b.value;

  const areaW = Math.min(width * (isVertical ? 0.92 : 0.84), 1600);
  const valueW = isVertical ? 200 : 230;
  const ratioW = isVertical ? 220 : 380;
  const bracketGap = 50;
  const barMax = Math.max(areaW - valueW - bracketGap - ratioW, 120);
  const barH = isVertical ? 90 : 100;
  const rowGap = isVertical ? 170 : 150;
  const labelSize = isVertical ? 34 : 32;
  const valSize = isVertical ? 52 : 58;
  const rowTop = (i: number) => 50 + i * rowGap;
  const areaH = rowTop(1) + barH + 20;

  const rows = [a, b];
  const lens = rows.map((r) => (r.value / big) * barMax);
  const cy = rows.map((_, i) => rowTop(i) + barH / 2);
  const bx = barMax + valueW + 10;
  const bracketLen = 40 + Math.abs(cy[1] - cy[0]) + 40;

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
          padding: "36px 34px",
          background: glass.backgroundStrong,
          border: `1px solid ${glass.border}`,
          borderRadius: glass.borderRadiusLarge,
        }}
      >
        <div style={{ position: "relative", width: areaW, height: areaH }}>
          {rows.map((r, i) => {
            const isBig = (i === 0) === aBigger;
            const len = lens[i] * grow;
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: rowTop(i) - labelSize - 14,
                    fontSize: labelSize,
                    fontWeight: 700,
                    color: colors.textMuted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.label}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: rowTop(i),
                    width: len,
                    height: barH,
                    borderRadius: 12,
                    background: isBig ? accentColor : "rgba(255,255,255,0.55)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: len + 18,
                    top: rowTop(i),
                    height: barH,
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'Inter', sans-serif",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 800,
                    fontSize: valSize,
                    whiteSpace: "nowrap",
                    opacity: grow > 0.02 ? 1 : 0,
                  }}
                >
                  {fmt(r.value * grow)}
                  {unit && <span style={{ fontSize: valSize * 0.45, marginLeft: 8, opacity: 0.7 }}>{unit}</span>}
                </div>
              </React.Fragment>
            );
          })}
          <svg width={areaW} height={areaH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path
              d={`M ${bx} ${cy[0]} H ${bx + 28} V ${cy[1]} H ${bx}`}
              fill="none"
              stroke={accentColor}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={bracketLen + 60}
              strokeDashoffset={(bracketLen + 60) * (1 - bracketP)}
              opacity={bracketP > 0 ? 1 : 0}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: bx + 28 + 24,
              top: (cy[0] + cy[1]) / 2 - (isVertical ? 60 : 80),
              height: isVertical ? 120 : 160,
              display: "flex",
              alignItems: "center",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: isVertical ? 96 : 150,
              color: accentColor,
              whiteSpace: "nowrap",
              opacity: ratioP,
              transform: `translateX(${(1 - ratioP) * -24}px)`,
            }}
          >
            {ratioText}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
