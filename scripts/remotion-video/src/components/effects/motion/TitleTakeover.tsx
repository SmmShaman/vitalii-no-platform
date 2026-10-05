/**
 * TitleTakeover — one condensed, heavy, slanted headline punches in (67 % → 103.5 % expo.out,
 * then settles to 100 %) and holds dead still; an optional kicker is a plain line that wipes in
 * left→right after the headline has settled.
 * data: { "title": "headline, ≤ 32 chars", "kicker"?: "plain support line" }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clip, ease, look, pace, punchScale, tween, wipeLR } from "./grammar";

const BUILD = 1.1;
const CONDENSE = 0.86; // horizontal squeeze that gives Inter a display-condensed look

export function hasTitleTakeoverData(data: Record<string, unknown>): boolean {
  return !!data && clip(data.title, 32).length > 0;
}

// Greedy balanced split into two lines (only used when a single line would be too small).
function splitTwo(words: string[]): string[] {
  if (words.length < 2) return [words.join(" ")];
  const total = words.join(" ").length;
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const diff = Math.abs(a - (total - a));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

export const TitleTakeover: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  if (!hasTitleTakeoverData(data)) return null;
  const isVertical = height > width;
  const { t } = pace(frame, fps, durationInFrames, BUILD);

  const title = clip(data.title, 32).toUpperCase();
  const kicker = clip(data.kicker, 60);
  const words = title.split(/\s+/);

  const targetW = width * 0.875;
  const glyph = 0.66 * CONDENSE; // em per glyph, heavy caps, tight tracking, squeezed
  const maxSize = height * 0.3;
  let lines = [title];
  let fontSize = Math.min(targetW / (title.length * glyph), maxSize);
  if (isVertical && fontSize < 120 && words.length > 1) {
    lines = splitTwo(words);
    const longest = Math.max(...lines.map((l) => l.length));
    fontSize = Math.min(targetW / (longest * glyph), maxSize);
  }
  fontSize = Math.max(56, fontSize);

  const start = 0.16;
  const scale = punchScale(t, start);
  const opacity = tween(t, start, 0.23, ease.expoOut);
  const kickP = tween(t, start + 0.4 + 0.15, 0.27, ease.power2Out);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 45% at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0.3))", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: targetW, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <div
          style={{
            alignSelf: "center",
            transform: `scale(${scale}) skewX(-4deg) scaleX(${CONDENSE})`,
            transformOrigin: "50% 48%",
            opacity,
            fontFamily: look.font,
            fontWeight: 800,
            fontSize,
            lineHeight: 0.98,
            letterSpacing: "-0.025em",
            textAlign: "center",
            color: "#F5F5F5",
          }}
        >
          {lines.map((l, i) => (
            <div key={i} style={{ whiteSpace: "nowrap" }}>
              {l}
            </div>
          ))}
        </div>
        {kicker && (
          <div
            style={{
              marginTop: fontSize * 0.1,
              fontFamily: look.font,
              fontWeight: 500,
              fontSize: isVertical ? 36 : 43,
              letterSpacing: look.tracking.body,
              textAlign: "right",
              color: look.ink,
              clipPath: wipeLR(kickP),
              textShadow: "0 3px 18px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            {kicker}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
