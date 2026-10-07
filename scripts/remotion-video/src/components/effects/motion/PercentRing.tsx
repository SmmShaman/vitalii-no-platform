/**
 * PercentRing — one percentage counted up in sync with a ring (same power2.out tween). With a
 * `threshold` the arc turns accent the moment the count crosses it; then 1–2 conclusion lines.
 * data: { value: 62, label: "fikk svar i tide", threshold?: 50, notes?: ["...", "..."] }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pace, tween, ease, wipeLR, punchScale, fmtNum, num, clip, look, useMotionConfig } from "./grammar";

function parse(data: Record<string, unknown>) {
  const value = num(data?.value);
  const th = num(data?.threshold);
  const notes = (Array.isArray(data?.notes) ? (data.notes as unknown[]) : [])
    .map((n) => clip(n, 90))
    .filter(Boolean)
    .slice(0, 2);
  return {
    value: Math.min(100, Math.max(0, value)),
    ok: Number.isFinite(value) && value >= 0,
    label: clip(data?.label, 70),
    threshold: Number.isFinite(th) && th > 0 && th < 100 ? th : null,
    notes,
  };
}

export function hasPercentRingData(data: Record<string, unknown>): boolean {
  const p = parse(data);
  return p.ok && !!p.label;
}

export const PercentRing: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useMotionConfig();
  const { value, ok, label, threshold, notes } = parse(data);
  if (!ok || !label) return null;
  const isVertical = height > width;
  const noteStart = 3.9;
  const { t } = pace(frame, fps, durationInFrames, notes.length ? noteStart + (notes.length - 1) * 0.65 + 0.3 : 3.6);

  const size = isVertical ? 760 : 560;
  const R = 115;
  const C = 2 * Math.PI * R;
  const cp = tween(t, 1.0, 2.4, ease.power2Out);
  const shown = value * cp;
  const crossed = threshold !== null && shown >= threshold;
  const arcColor = threshold === null ? accentColor : crossed ? accentColor : look.ink;
  const scale = punchScale(t, 0.4, 0.9);
  const ringVisible = t >= 0.16;
  const thAngle = threshold !== null ? (threshold / 100) * 2 * Math.PI - Math.PI / 2 : 0;

  const ring = (
    <div style={{ width: size, height: size, flex: "none", position: "relative", transform: `scale(${scale})`, opacity: ringVisible ? 1 : 0 }}>
      <svg viewBox="0 0 340 340" width={size} height={size}>
        <g transform="rotate(-90 170 170)">
          <circle cx={170} cy={170} r={R} fill="none" stroke={look.faint} strokeWidth={16} />
          <circle
            cx={170}
            cy={170}
            r={R}
            fill="none"
            stroke={arcColor}
            strokeWidth={16}
            strokeDasharray={C}
            strokeDashoffset={C * (1 - shown / 100)}
          />
        </g>
        {threshold !== null && (
          <line
            x1={170 + (R - 16) * Math.cos(thAngle)}
            y1={170 + (R - 16) * Math.sin(thAngle)}
            x2={170 + (R + 16) * Math.cos(thAngle)}
            y2={170 + (R + 16) * Math.sin(thAngle)}
            stroke={look.ink}
            strokeWidth={3}
          />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isVertical ? 190 : 140,
          fontWeight: 800,
          letterSpacing: look.tracking.hero,
          fontVariantNumeric: "tabular-nums",
          color: arcColor,
        }}
      >
        {fmtNum(shown, 1)}
        <span style={{ fontSize: isVertical ? 80 : 60, marginLeft: 6, color: look.muted, letterSpacing: 0 }}>%</span>
      </div>
    </div>
  );

  const text = (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: isVertical ? 34 : 28 }}>
      <div
        style={{
          clipPath: wipeLR(tween(t, 0.16, 0.4, ease.expoOut)),
          fontSize: isVertical ? 76 : 84,
          fontWeight: 780,
          lineHeight: 1.05,
          letterSpacing: look.tracking.head,
          textAlign: isVertical ? "center" : "left",
        }}
      >
        {label}
      </div>
      {notes.map((n, i) => (
        <div
          key={i}
          style={{
            clipPath: wipeLR(tween(t, noteStart + i * 0.65, 0.3, ease.expoOut)),
            borderLeft: `5px solid ${accentColor}`,
            paddingLeft: 22,
            fontSize: isVertical ? 42 : 38,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: look.tracking.body,
          }}
        >
          {n}
        </div>
      ))}
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: `${look.safeY}px ${look.safeX}px`,
        fontFamily: look.font,
        color: look.ink,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          gap: isVertical ? 50 : 80,
          padding: isVertical ? "56px 48px" : "52px 72px",
          background: look.surface,
          borderRadius: look.radius,
          boxShadow: look.shadowHard,
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {ring}
        {text}
      </div>
    </AbsoluteFill>
  );
};
