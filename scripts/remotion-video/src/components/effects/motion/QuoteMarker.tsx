/**
 * QuoteMarker — large quotation in a glass panel with an oversized quote mark; once the text
 * settles a semi-transparent accent marker sweeps behind the highlight; source fades in below.
 * data: { "quote": "full quote", "highlight"?: "substring of quote", "source"?: "Name, role" }
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { glass, typography, clampBoth } from "../../../design-system";

const str = (v: unknown, max: number): string => {
  const s = typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
};

export function hasQuoteMarkerData(data: Record<string, unknown>): boolean {
  return !!data && str(data.quote, 400).length > 0;
}

export const QuoteMarker: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  if (!hasQuoteMarkerData(data)) return null;
  const d = Math.max(durationInFrames, 30);
  const isVertical = height > width;

  const quote = str(data.quote, 400);
  const hl = str(data.highlight, 200);
  const source = str(data.source, 60);

  let start = hl ? quote.toLowerCase().indexOf(hl.toLowerCase()) : -1;
  let end = start + hl.length;
  if (start < 0) {
    const m = quote.match(/(\S+\s+){0,2}\S+[^\p{L}\p{N}]*$/u);
    start = m ? quote.length - m[0].length : 0;
    end = quote.length;
  }
  const before = quote.slice(0, start);
  const mid = quote.slice(start, end);
  const after = quote.slice(end);

  const fs = Math.max(30, Math.min(isVertical ? 58 : 56, (isVertical ? 1.9 : 2.6) * Math.sqrt((width * height) / Math.max(quote.length, 20)) * 0.5));
  const panelS = spring({ frame, fps, config: { damping: 16, stiffness: 110, mass: 0.8 } });
  const sweep = interpolate(frame, [d * 0.3, d * 0.5], [0, 1], clampBoth);
  const srcP = interpolate(frame, [d * 0.45, d * 0.58], [0, 1], clampBoth);
  const fadeOut = interpolate(frame, [d - 8, d], [1, 0], clampBoth);

  return (
    <AbsoluteFill style={{ opacity: fadeOut, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: isVertical ? width * 0.88 : width * 0.68,
          boxSizing: "border-box",
          padding: isVertical ? "110px 48px 48px" : "120px 80px 56px",
          borderRadius: glass.borderRadiusLarge,
          background: "rgba(10,10,10,0.55)",
          border: `1px solid ${glass.borderStrong}`,
          backdropFilter: `blur(${glass.blurStrong}px)`,
          opacity: panelS,
          transform: `translateY(${(1 - panelS) * 30}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 36,
            fontFamily: "Georgia, serif",
            fontSize: 220,
            lineHeight: 1,
            color: accentColor,
            opacity: 0.85,
            height: 120,
            overflow: "visible",
          }}
        >
          “
        </div>
        <div
          style={{
            fontFamily: typography.fontFamily.primary,
            fontWeight: 700,
            fontSize: fs,
            lineHeight: 1.35,
            color: "#fff",
          }}
        >
          {before}
          <span
            style={{
              backgroundImage: `linear-gradient(${accentColor}66, ${accentColor}66)`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 65%",
              backgroundSize: `${sweep * 100}% 70%`,
              WebkitBoxDecorationBreak: "clone",
              boxDecorationBreak: "clone",
              padding: "0 0.12em",
              margin: "0 -0.12em",
            }}
          >
            {mid}
          </span>
          {after}
        </div>
        {source && (
          <div
            style={{
              marginTop: 32,
              fontFamily: typography.fontFamily.primary,
              fontWeight: 600,
              fontSize: Math.max(22, fs * 0.5),
              color: "rgba(255,255,255,0.7)",
              opacity: srcP,
              transform: `translateY(${(1 - srcP) * 12}px)`,
            }}
          >
            <span style={{ color: accentColor }}>— </span>
            {source}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
