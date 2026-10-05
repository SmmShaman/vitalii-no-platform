/**
 * SequentialBars — columns rise one at a time from a shared baseline (0.6 s apart), each with a
 * value tag glued to its tip. Category labels and baseline are on screen before the first bar.
 * Negative values hang below the baseline. Optional data.highlight=true dims all but the tallest at the end.
 * data: { title?: string, unit?: string, highlight?: boolean, items: [{ label: "2023", value: 12 }, ...] }  (2-6 items)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pace, tween, ease, wipeLR, fmtNum, num, clip, look, DIM } from "./grammar";

type Item = { label: string; value: number };

function parseItems(data: Record<string, unknown>): Item[] {
  const raw = Array.isArray(data?.items) ? (data.items as unknown[]) : [];
  return raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { label: clip(o.label, 20), value: num(o.value) };
    })
    .filter((i) => Number.isFinite(i.value))
    .slice(0, 6);
}

export function hasSequentialBarsData(data: Record<string, unknown>): boolean {
  return parseItems(data).length >= 2;
}

const STEP = 0.6;
const GROW = 0.95;
const FIRST = 0.75;

export const SequentialBars: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const items = parseItems(data);
  if (items.length < 2) return null;
  const n = items.length;
  const isVertical = height > width;
  const title = data.title ? clip(data.title, 60) : "";
  const unit = data.unit ? String(data.unit).slice(0, 12) : "";
  const highlight = data.highlight === true;

  const lastEnd = FIRST + (n - 1) * STEP + GROW;
  const { t } = pace(frame, fps, durationInFrames, lastEnd + (highlight ? 0.6 : 0.1));

  const titleP = tween(t, 0.16, 0.36, ease.expoOut);
  const baseP = tween(t, 0.3, 0.3, ease.power3Out);
  const dimP = highlight ? tween(t, lastEnd + 0.1, 0.4, ease.sineInOut) : 0;

  const posMax = Math.max(0, ...items.map((i) => i.value));
  const negMax = Math.max(0, ...items.map((i) => -i.value));
  const range = Math.max(posMax + negMax, 1e-9);
  const tallest = items.reduce((b, it, i) => (Math.abs(it.value) > Math.abs(items[b].value) ? i : b), 0);

  const W = Math.min(width - look.safeX * 2, 1700);
  const numSize = isVertical ? 60 : 52;
  const labelSize = isVertical ? 32 : 34;
  const titleSize = isVertical ? 72 : 84;
  const tagH = numSize + 18;
  const chartH = isVertical ? Math.min(height * 0.42, 800) : 470;
  const unitPx = (chartH - tagH * (1 + (negMax > 0 ? 1 : 0))) / range;
  const zeroY = tagH + posMax * unitPx; // baseline y inside the chart box
  const boxH = tagH + range * unitPx + (negMax > 0 ? tagH : 0);

  const gap = Math.min(76, 250 / n);
  const barW = Math.min(215, (W - gap * (n + 1)) / n);
  const rowW = barW * n + gap * (n + 1);
  const left = (i: number) => gap + i * (barW + gap);

  return (
    <AbsoluteFill
      style={{
        background: look.scrim,
        padding: `${look.safeY}px ${look.safeX}px`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: look.font,
        color: look.ink,
      }}
    >
      <div style={{ width: W }}>
        {title && (
          <div style={{ clipPath: wipeLR(titleP), marginBottom: 36, paddingLeft: gap }}>
            <div
              style={{
                fontSize: titleSize,
                fontWeight: 800,
                letterSpacing: look.tracking.head,
                lineHeight: 1.05,
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              {title}
            </div>
          </div>
        )}
        <div style={{ position: "relative", width: rowW, height: boxH + 24 + labelSize * 1.3, margin: "0 auto" }}>
          {items.map((it, i) => {
            const s = FIRST + i * STEP;
            const g = tween(t, s, GROW, ease.power2Out);
            const len = Math.abs(it.value) * unitPx * g;
            const neg = it.value < 0;
            const decimals = Number.isInteger(it.value) || Math.abs(it.value) >= 10 ? 0 : 1;
            const shown = g >= 1 ? it.value : Math.round(it.value * g * 10 ** decimals) / 10 ** decimals;
            const op = highlight && i !== tallest ? 1 - (1 - DIM) * dimP : 1;
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: "absolute",
                    left: left(i),
                    width: barW,
                    height: len,
                    top: neg ? zeroY : zeroY - len,
                    background: accentColor,
                    borderRadius: neg ? "0 0 2px 2px" : "2px 2px 0 0",
                    opacity: op,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: left(i) - gap / 2,
                    width: barW + gap,
                    top: neg ? zeroY + len + 8 : zeroY - len - tagH + 6,
                    height: numSize + 8,
                    textAlign: "center",
                    fontWeight: 800,
                    letterSpacing: look.tracking.hero,
                    fontVariantNumeric: "tabular-nums",
                    fontSize: numSize,
                    lineHeight: 1.1,
                    whiteSpace: "nowrap",
                    opacity: g > 0.001 ? op : 0,
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {fmtNum(shown)}
                  {unit && (
                    <span style={{ fontFamily: look.mono, fontSize: Math.max(24, numSize * 0.45), fontWeight: 500, marginLeft: 8, color: look.muted }}>
                      {unit}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
          {/* baseline */}
          <div
            style={{
              position: "absolute",
              left: 0,
              width: rowW,
              top: zeroY - 1.5,
              height: 3,
              background: look.ink,
              transformOrigin: "0 50%",
              transform: `scaleX(${baseP})`,
            }}
          />
          {/* category labels: present from the start, under the whole chart */}
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: left(i) - gap / 2,
                width: barW + gap,
                top: boxH + 16,
                textAlign: "center",
                fontSize: labelSize,
                fontWeight: 600,
                color: look.muted,
                opacity: baseP,
                lineHeight: 1.2,
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
