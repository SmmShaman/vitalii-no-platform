/**
 * KeywordCaption — two balanced lines build word by word in the lower-middle of frame;
 * words matching keywords turn accent colored with a short underline sweep.
 * data: { "line1": "...", "line2"?: "...", "keywords": ["word", ...] }
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, typography, clampBoth } from "../../../design-system";

const str = (v: unknown, max: number): string => {
  const s = typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
};
const norm = (w: string) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

export function hasKeywordCaptionData(data: Record<string, unknown>): boolean {
  return !!data && str(data.line1, 120).length > 0;
}

export const KeywordCaption: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  if (!hasKeywordCaptionData(data)) return null;
  const d = Math.max(durationInFrames, 30);
  const isVertical = height > width;

  const lines = [str(data.line1, 120), str(data.line2, 120)].filter(Boolean).map((l) => l.split(/\s+/));
  const kws = new Set(
    (Array.isArray(data.keywords) ? data.keywords : []).slice(0, 12).map((k) => norm(String(k))).filter(Boolean)
  );
  const total = lines.reduce((a, l) => a + l.length, 0);
  const buildEnd = d * 0.5;
  const per = buildEnd / Math.max(total, 1);
  const longest = Math.max(...lines.map((l) => l.join(" ").length), 1);
  const fontSize = Math.max(30, Math.min((width * 0.88) / (longest * 0.55), isVertical ? 72 : 76));
  const fadeOut = interpolate(frame, [d - 8, d], [1, 0], clampBoth);

  let idx = 0;
  return (
    <AbsoluteFill style={{ opacity: fadeOut, justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          marginBottom: height * (isVertical ? 0.26 : 0.18),
          width: width * 0.9,
          textAlign: "center",
          fontFamily: typography.fontFamily.primary,
          fontWeight: 800,
          fontSize,
          lineHeight: 1.25,
          color: "#fff",
          textShadow: "0 3px 24px rgba(0,0,0,0.7)",
        }}
      >
        {lines.map((ws, li) => (
          <div key={li}>
            {ws.map((w, wi) => {
              const start = idx++ * per;
              const p = interpolate(frame, [start, start + 8], [0, 1], clampBoth);
              const isKw = kws.has(norm(w));
              const sweep = isKw ? interpolate(frame, [start + 6, start + 20], [0, 1], clampBoth) : 0;
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    marginRight: "0.28em",
                    opacity: p,
                    transform: `translateY(${(1 - p) * 16}px)`,
                    color: isKw ? accentColor : colors.text,
                    backgroundImage: isKw ? `linear-gradient(${accentColor}, ${accentColor})` : undefined,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "0 100%",
                    backgroundSize: `${sweep * 100}% ${Math.max(3, fontSize * 0.06)}px`,
                    paddingBottom: 4,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
