/**
 * FeatureMatrix — 2–3 option columns × 2–4 rows. Option headings are fixed first; then row by row
 * the row label lands, followed by its values left→right. Values are text or true/false (✓ / ×).
 * data: { options: ["A","B"], rows: [{ label: "Pris", values: ["199 kr", true] }, ...] }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pace, tween, ease, wipeLR, clip, look } from "./grammar";

type Cell = string | boolean;
type Row = { label: string; values: Cell[] };

function parse(data: Record<string, unknown>): { options: string[]; rows: Row[] } {
  const opts = (Array.isArray(data?.options) ? (data.options as unknown[]) : [])
    .map((o) => clip(o, 22))
    .filter(Boolean)
    .slice(0, 3);
  const raw = Array.isArray(data?.rows) ? (data.rows as unknown[]) : [];
  const rows = raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      const vals = Array.isArray(o.values) ? (o.values as unknown[]) : [];
      const values: Cell[] = opts.map((_, i) => {
        const v = vals[i];
        return typeof v === "boolean" ? v : clip(v, 40);
      });
      return { label: clip(o.label, 26), values };
    })
    .filter((r) => r.label)
    .slice(0, 4);
  return { options: opts, rows };
}

export function hasFeatureMatrixData(data: Record<string, unknown>): boolean {
  const p = parse(data);
  return p.options.length >= 2 && p.rows.length >= 2;
}

const STEP = 1.2;

export const FeatureMatrix: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const { options, rows } = parse(data);
  if (options.length < 2 || rows.length < 2) return null;
  const isVertical = height > width;
  const nOpt = options.length;
  const { t } = pace(frame, fps, durationInFrames, 1 + (rows.length - 1) * STEP + 0.3 + nOpt * 0.25 + 0.4);

  const panelW = Math.min(width - look.safeX * 2, isVertical ? 940 : 1600);
  const labelW = isVertical ? 210 : 320;
  const gap = isVertical ? 14 : 28;
  const cols = `${labelW}px repeat(${nOpt}, 1fr)`;
  const cellSize = isVertical ? (nOpt === 3 ? 28 : 34) : nOpt === 3 ? 36 : 42;
  const headSize = isVertical ? (nOpt === 3 ? 30 : 38) : nOpt === 3 ? 40 : 48;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: look.font, color: look.ink }}>
      <div
        style={{
          width: panelW,
          padding: "40px 44px 44px",
          background: look.surface,
          borderRadius: look.radius,
          boxShadow: look.shadowHard,
          boxSizing: "border-box",
        }}
      >
        {/* fixed headings */}
        <div style={{ display: "grid", gridTemplateColumns: cols, columnGap: gap, marginBottom: 12 }}>
          <div />
          {options.map((o, i) => (
            <div
              key={i}
              style={{
                clipPath: wipeLR(tween(t, 0.16 + i * 0.1, 0.4, ease.expoOut)),
                background: look.ink,
                color: "#111",
                borderRadius: 3,
                padding: "14px 20px",
                fontSize: headSize,
                fontWeight: 750,
                letterSpacing: look.tracking.head,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {o}
            </div>
          ))}
        </div>

        {rows.map((r, ri) => {
          const t0 = 1 + ri * STEP;
          const chipP = tween(t, t0, 0.24, ease.power3Out);
          return (
            <div
              key={ri}
              style={{
                display: "grid",
                gridTemplateColumns: cols,
                columnGap: gap,
                alignItems: "center",
                minHeight: isVertical ? 150 : 140,
                borderBottom: `${look.ruleW}px solid ${look.rule}`,
              }}
            >
              <div
                style={{
                  transform: `scaleX(${chipP})`,
                  transformOrigin: "left center",
                  borderLeft: `4px solid ${accentColor}`,
                  paddingLeft: 16,
                  fontSize: isVertical ? 30 : 36,
                  fontWeight: 650,
                  lineHeight: 1.15,
                  letterSpacing: look.tracking.body,
                  opacity: chipP > 0.001 ? 1 : 0,
                }}
              >
                {r.label}
              </div>
              {r.values.map((v, vi) => {
                const p = tween(t, t0 + 0.35 + vi * 0.3, 0.4, ease.power2Out);
                return (
                  <div
                    key={vi}
                    style={{
                      clipPath: wipeLR(p),
                      fontSize: typeof v === "boolean" ? (isVertical ? 64 : 72) : cellSize,
                      fontWeight: typeof v === "boolean" ? 800 : 500,
                      lineHeight: 1.15,
                      letterSpacing: look.tracking.body,
                      padding: "0 6px",
                      color: v === true ? accentColor : v === false ? look.muted : look.ink,
                    }}
                  >
                    {v === true ? "✓" : v === false ? "×" : v}
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
