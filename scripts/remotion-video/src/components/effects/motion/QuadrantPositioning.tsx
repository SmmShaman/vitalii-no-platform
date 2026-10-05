/**
 * QuadrantPositioning — two crossed axes with labels; 2–6 items pop in one at a time at their literal
 * x/y (0–100); the focus item is established last, in accent, the rest dim.
 * data: { xLabel: string, yLabel: string, items: [{ label: string, x: number, y: number }], focus?: string }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clip, ease, look, mix, num, pace, tween, wipeLR } from "./grammar";

type Item = { label: string; x: number; y: number };
const BUILD = 3.4;

function parse(data: Record<string, unknown>) {
  const raw = Array.isArray(data?.items) ? (data.items as unknown[]) : [];
  const items: Item[] = [];
  for (const r of raw) {
    const o = (r ?? {}) as Record<string, unknown>;
    const x = num(o.x);
    const y = num(o.y);
    const label = clip(o.label, 24);
    if (!label || !isFinite(x) || !isFinite(y)) continue;
    items.push({ label, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }
  return { xLabel: clip(data?.xLabel, 24), yLabel: clip(data?.yLabel, 24), items: items.slice(0, 6) };
}

export function hasQuadrantPositioningData(data: Record<string, unknown>): boolean {
  if (!data) return false;
  const p = parse(data);
  return p.xLabel.length > 0 && p.yLabel.length > 0 && p.items.length >= 2;
}

export const QuadrantPositioning: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const { xLabel, yLabel, items } = parse(data);
  if (!xLabel || !yLabel || items.length < 2) return null;
  const n = items.length;
  const { t } = pace(frame, fps, durationInFrames, BUILD);
  const isV = height > width;

  // plot rectangle (axes cross in its centre); items live in an inner area
  const L = look.safeX;
  const R = width - look.safeX;
  const T = isV ? 200 : 130;
  const B = isV ? height - 220 : height - 110;
  const cx = (L + R) / 2;
  const cy = (T + B) / 2;
  const padX = isV ? 40 : 90;
  const padY = isV ? 70 : 60;
  const px = (x: number) => L + padX + ((R - L - padX * 2) * x) / 100;
  const py = (y: number) => B - padY - ((B - T - padY * 2) * y) / 100;

  const xAx = tween(t, 0.16, 0.55, ease.linear);
  const yAx = tween(t, 0.28, 0.48, ease.linear);
  const labP = tween(t, 0.65, 0.3, ease.power3Out);
  const itemStart = (i: number) => 0.88 + i * 0.36;
  const focusStart = itemStart(n - 1) + 0.35 + 0.5;
  const fp = tween(t, focusStart, 0.3, ease.power2Out);
  const focusLabel = String(data?.focus ?? "").trim().toLowerCase();
  const fi = focusLabel ? items.findIndex((it) => it.label.toLowerCase() === focusLabel || it.label.toLowerCase().startsWith(focusLabel.slice(0, 23))) : -1;

  const hs = 18;
  const xPath = `M${L} ${cy} L${R} ${cy} M${R - hs} ${cy - hs} L${R} ${cy} L${R - hs} ${cy + hs}`;
  const yPath = `M${cx} ${B} L${cx} ${T} M${cx - hs} ${T + hs} L${cx} ${T} L${cx + hs} ${T + hs}`;

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    fontFamily: look.font,
    fontWeight: 700,
    fontSize: 36,
    letterSpacing: look.tracking.body,
    color: look.ink,
    opacity: labP,
    transform: `translateY(${(1 - labP) * 0}px)`,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={xPath} fill="none" stroke={look.ink} strokeWidth={look.strokeW - 1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - xAx} opacity={xAx > 0 ? 1 : 0} />
        <path d={yPath} fill="none" stroke={look.ink} strokeWidth={look.strokeW - 1} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - yAx} opacity={yAx > 0 ? 1 : 0} />
      </svg>
      <div style={{ ...labelStyle, right: width - R, top: cy + 28, textAlign: "right" }}>{xLabel} →</div>
      <div style={{ ...labelStyle, left: cx + 28, top: T - 6 }}>↑ {yLabel}</div>

      {items.map((it, i) => {
        const s = itemStart(i);
        const p = tween(t, s, 0.35, ease.expoOut);
        if (p <= 0) return null;
        const isF = i === fi;
        const dim = fi >= 0 && !isF ? mix(fp, 1, 0.55) : 1;
        const x = px(it.x);
        const y = py(it.y);
        const flip = x > (L + R) / 2 + (R - L) * 0.12;
        const dot = isF ? mix(fp, 26, 38) : 26;
        const accOn = isF ? fp : 0;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: x - dot / 2,
                top: y - dot / 2,
                width: dot,
                height: dot,
                borderRadius: "50%",
                background: accOn > 0.5 ? accentColor : look.ink,
                border: "3px solid #0a0a0a",
                boxSizing: "border-box",
                opacity: p * dim,
                transform: `scale(${mix(p, 0.64, 1)})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: y,
                ...(flip ? { right: width - x + dot / 2 + 16 } : { left: x + dot / 2 + 16 }),
                transform: `translateY(-50%) scale(${mix(p, 0.64, 1)})`,
                transformOrigin: flip ? "100% 50%" : "0% 50%",
                opacity: p * dim,
                background: look.scrim,
                padding: "6px 14px",
                borderRadius: look.radius,
                fontFamily: look.font,
                fontWeight: isF ? 850 : 650,
                fontSize: isV ? 40 : 40,
                letterSpacing: look.tracking.head,
                color: accOn > 0.5 ? accentColor : look.ink,
                whiteSpace: "nowrap",
              }}
            >
              {it.label}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
