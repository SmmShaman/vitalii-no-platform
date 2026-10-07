/**
 * RatioBars — two horizontal bars grow one AFTER the other on one linear scale, value tags glued to the
 * bar tips; then a bracket draws on the right and the ratio (larger / smaller) wipes in as "×3,2".
 * data: { a: { label, value }, b: { label, value }, unit?: string, title?: string, caption?: string }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pace, tween, ease, wipeLR, fmtNum, num, clip, look, useMotionConfig, motionLocale } from "./grammar";

type Side = { label: string; value: number };

function parseSide(x: unknown): Side | null {
  const o = (x ?? {}) as Record<string, unknown>;
  const value = num(o.value);
  if (!Number.isFinite(value) || value <= 0) return null;
  return { label: clip(o.label, 28), value };
}

export function hasRatioBarsData(data: Record<string, unknown>): boolean {
  return !!parseSide(data?.a) && !!parseSide(data?.b);
}

const GROW = 1.1;
const B1 = 0.75;
const B2 = B1 + GROW + 0.5;
const BR = B2 + GROW + 0.2;
const RATIO = BR + 0.4 + 0.05;

export const RatioBars: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useMotionConfig();
  const a = parseSide(data?.a);
  const b = parseSide(data?.b);
  if (!a || !b) return null;
  const isVertical = height > width;
  const unit = data.unit ? String(data.unit).slice(0, 12) : "";
  const title = data.title ? clip(data.title, 60) : "";
  const caption = data.caption ? clip(data.caption, 20) : "";

  const { t } = pace(frame, fps, durationInFrames, RATIO + 0.4);
  const titleP = tween(t, 0.16, 0.36, ease.expoOut);
  const labelP = tween(t, 0.35, 0.3, ease.power3Out);
  const grows = [tween(t, B1, GROW, ease.power2Out), tween(t, B2, GROW, ease.power2Out)];
  const bracketP = tween(t, BR, 0.4, ease.linear);
  const ratioP = tween(t, RATIO, 0.35, ease.expoOut);

  const big = Math.max(a.value, b.value);
  const ratio = big / Math.min(a.value, b.value);
  const ratioText = "×" + (Math.round(ratio * 10) / 10).toLocaleString(motionLocale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const aBigger = a.value >= b.value;

  const areaW = Math.min(width - look.safeX * 2, 1700);
  const valueW = isVertical ? 230 : 280;
  const ratioW = isVertical ? 250 : 400;
  const bracketW = 36;
  const barMax = Math.max(areaW - valueW - bracketW - ratioW, 120);
  const barH = isVertical ? 90 : 84;
  const rowGap = isVertical ? 190 : 170;
  const labelSize = isVertical ? 36 : 38;
  const valSize = isVertical ? 56 : 52;
  const rowTop = (i: number) => labelSize + 22 + i * rowGap;
  const areaH = rowTop(1) + barH;

  const rows = [a, b];
  const lens = rows.map((r) => (r.value / big) * barMax);
  const cy = rows.map((_, i) => rowTop(i) + barH / 2);
  const bx = barMax + valueW;
  const bracketLen = bracketW * 2 + Math.abs(cy[1] - cy[0]);
  const ratioSize = isVertical ? 110 : 150;

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
      <div style={{ width: areaW }}>
        {title && (
          <div style={{ clipPath: wipeLR(titleP), marginBottom: 44 }}>
            <div
              style={{
                fontSize: isVertical ? 72 : 84,
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
        <div style={{ position: "relative", width: areaW, height: areaH }}>
          {rows.map((r, i) => {
            const isBig = (i === 0) === aBigger;
            const g = grows[i];
            const len = lens[i] * g;
            const decimals = Number.isInteger(r.value) || r.value >= 10 ? 0 : 1;
            const shown = g >= 1 ? r.value : Math.round(r.value * g * 10 ** decimals) / 10 ** decimals;
            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: rowTop(i) - labelSize - 14,
                    fontSize: labelSize,
                    fontWeight: 600,
                    color: look.muted,
                    whiteSpace: "nowrap",
                    opacity: labelP,
                    lineHeight: 1.1,
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
                    background: isBig ? accentColor : look.ink,
                    opacity: isBig ? 1 : 0.82,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: len + 22,
                    top: rowTop(i),
                    height: barH,
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 800,
                    letterSpacing: look.tracking.hero,
                    fontVariantNumeric: "tabular-nums",
                    fontSize: valSize,
                    whiteSpace: "nowrap",
                    opacity: g > 0.001 ? 1 : 0,
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {fmtNum(shown)}
                  {unit && (
                    <span style={{ fontFamily: look.mono, fontSize: 28, fontWeight: 500, marginLeft: 8, color: look.muted }}>{unit}</span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
          <svg width={areaW} height={areaH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path
              d={`M ${bx} ${cy[0]} H ${bx + bracketW} V ${cy[1]} H ${bx}`}
              fill="none"
              stroke={accentColor}
              strokeWidth={look.strokeW}
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeDasharray={bracketLen}
              strokeDashoffset={bracketLen * (1 - bracketP)}
              opacity={bracketP > 0 ? 1 : 0}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: bx + bracketW + 28,
              top: (cy[0] + cy[1]) / 2 - ratioSize * 0.55,
              clipPath: wipeLR(ratioP),
            }}
          >
            <div
              style={{
                fontSize: ratioSize,
                fontWeight: 800,
                letterSpacing: look.tracking.hero,
                lineHeight: 1,
                color: accentColor,
                whiteSpace: "nowrap",
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              {ratioText}
            </div>
            {caption && (
              <div style={{ fontFamily: look.mono, fontSize: 26, color: look.muted, marginTop: 6, whiteSpace: "nowrap" }}>{caption}</div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
