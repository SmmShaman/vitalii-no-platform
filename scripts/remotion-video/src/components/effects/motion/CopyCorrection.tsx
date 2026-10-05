/**
 * CopyCorrection — the wrong claim sits on a muted card, a hand-drawn strike crosses it with a
 * red-free X mark; then an accent-bordered card slides in below with the correct claim and a check.
 * data: { "wrong": "old claim", "right": "corrected claim", "label"?: "Faktisk" }
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { glass, typography, clampBoth } from "../../../design-system";

const str = (v: unknown, max: number): string => {
  const s = typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
};

export function hasCopyCorrectionData(data: Record<string, unknown>): boolean {
  return !!data && str(data.wrong, 160).length > 0 && str(data.right, 160).length > 0;
}

export const CopyCorrection: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  if (!hasCopyCorrectionData(data)) return null;
  const d = Math.max(durationInFrames, 30);
  const isVertical = height > width;

  const wrong = str(data.wrong, 160);
  const right = str(data.right, 160);
  const label = str(data.label, 24);
  const fs = isVertical ? 44 : 46;
  const cardW = isVertical ? width * 0.86 : width * 0.62;

  const wrongP = interpolate(frame, [0, d * 0.12], [0, 1], clampBoth);
  const strikeP = interpolate(frame, [d * 0.2, d * 0.32], [0, 1], clampBoth);
  const crossP = interpolate(frame, [d * 0.3, d * 0.38], [0, 1], clampBoth);
  const rightS = spring({
    frame: Math.max(0, frame - Math.round(d * 0.42)),
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });
  const checkP = interpolate(frame, [d * 0.5, d * 0.58], [0, 1], clampBoth);
  const fadeOut = interpolate(frame, [d - 8, d], [1, 0], clampBoth);

  const card: React.CSSProperties = {
    position: "relative",
    width: cardW,
    boxSizing: "border-box",
    padding: "28px 36px",
    borderRadius: glass.borderRadiusLarge,
    backdropFilter: `blur(${glass.blur}px)`,
    fontFamily: typography.fontFamily.primary,
    fontSize: fs,
    fontWeight: 700,
    lineHeight: 1.3,
  };
  const mark = Math.round(fs * 1.5);

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        background: "rgba(0,0,0,0.25)",
        justifyContent: "center",
        alignItems: "center",
        gap: 36,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          ...card,
          background: glass.background,
          border: `1px solid ${glass.border}`,
          color: "rgba(255,255,255,0.55)",
          opacity: wrongP,
          transform: `translateY(${(1 - wrongP) * 20}px)`,
        }}
      >
        <span style={{ position: "relative", display: "inline-block" }}>
          {wrong}
          {/* strike runs over the text only (an SVG dash scaled across the card broke into pieces) */}
          <span
            style={{
              position: "absolute",
              left: -6,
              top: "54%",
              height: 5,
              width: `calc(${strikeP * 100}% + ${strikeP * 12}px)`,
              background: "#fff",
              borderRadius: 3,
              opacity: 0.9,
              transform: "rotate(-2deg)",
              transformOrigin: "left center",
            }}
          />
        </span>
        <div
          style={{
            position: "absolute",
            top: -mark * 0.4,
            right: -mark * 0.25,
            width: mark,
            height: mark,
            borderRadius: "50%",
            background: "#2a2a2a",
            border: "2px solid rgba(255,255,255,0.5)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: mark * 0.6,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            opacity: crossP,
            transform: `scale(${0.6 + 0.4 * crossP})`,
          }}
        >
          ✕
        </div>
      </div>

      <div
        style={{
          ...card,
          background: glass.backgroundStrong,
          border: `3px solid ${accentColor}`,
          color: "#fff",
          opacity: rightS,
          transform: `translateY(${(1 - rightS) * 60}px)`,
        }}
      >
        {label && (
          <div
            style={{
              fontSize: fs * 0.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: accentColor,
              marginBottom: 8,
            }}
          >
            {label}
          </div>
        )}
        {right}
        <div
          style={{
            position: "absolute",
            top: -mark * 0.4,
            right: -mark * 0.25,
            width: mark,
            height: mark,
            borderRadius: "50%",
            background: accentColor,
            color: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: mark * 0.6,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            opacity: checkP,
            transform: `scale(${0.6 + 0.4 * checkP})`,
          }}
        >
          ✓
        </div>
      </div>
    </AbsoluteFill>
  );
};
