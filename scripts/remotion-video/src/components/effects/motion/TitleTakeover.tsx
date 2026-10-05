/**
 * TitleTakeover — oversized uppercase headline punches in (scale-down settle), letters hold
 * position; thin accent rule and small kicker appear beneath.
 * data: { "title": "3-6 word headline", "kicker"?: "small label" }
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, typography, clampBoth } from "../../../design-system";

const str = (v: unknown, max: number): string => {
  const s = typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
};

export function hasTitleTakeoverData(data: Record<string, unknown>): boolean {
  return !!data && str(data.title, 80).length > 0;
}

// Greedy balanced split of words into n lines by character count.
function balance(words: string[], n: number): string[] {
  if (n <= 1 || words.length <= 1) return [words.join(" ")];
  const total = words.join(" ").length;
  const target = total / n;
  const lines: string[] = [];
  let cur: string[] = [];
  for (const w of words) {
    const next = [...cur, w].join(" ").length;
    if (cur.length && lines.length < n - 1 && next > target * 1.1) {
      lines.push(cur.join(" "));
      cur = [w];
    } else cur.push(w);
  }
  if (cur.length) lines.push(cur.join(" "));
  return lines;
}

export const TitleTakeover: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  if (!hasTitleTakeoverData(data)) return null;
  const d = Math.max(durationInFrames, 30);
  const isVertical = height > width;

  const title = str(data.title, 80).toUpperCase();
  const kicker = str(data.kicker, 40);
  const words = title.split(/\s+/);
  const nLines = isVertical ? Math.min(words.length, 3) : title.length > 22 ? Math.min(words.length, 2) : 1;
  const lines = balance(words, nLines);
  const longest = Math.max(...lines.map((l) => l.length), 1);

  const boxW = width * 0.85;
  // Heavy Inter caps at tight tracking ≈ 0.6em per glyph.
  const fontSize = Math.max(40, Math.min(boxW / (longest * 0.6), isVertical ? 240 : 260, height * 0.3));

  const s = spring({ frame, fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });
  const scale = interpolate(s, [0, 1], [1.35, 1]);
  const opacity = interpolate(frame, [0, d * 0.05 + 1], [0, 1], clampBoth);
  const ruleP = interpolate(frame, [d * 0.15, d * 0.3], [0, 1], clampBoth);
  const kickP = interpolate(frame, [d * 0.22, d * 0.36], [0, 1], clampBoth);
  const fadeOut = interpolate(frame, [d - 8, d], [1, 0], clampBoth);

  return (
    <AbsoluteFill
      style={{
        background: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <div style={{ width: boxW, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "left center",
            opacity,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: colors.text,
            textShadow: "0 6px 40px rgba(0,0,0,0.5)",
          }}
        >
          {lines.map((l, i) => (
            <div key={i} style={{ whiteSpace: "nowrap" }}>
              {l}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: fontSize * 0.14,
            height: Math.max(4, fontSize * 0.03),
            width: `${ruleP * 38}%`,
            background: accentColor,
            borderRadius: 4,
          }}
        />
        {kicker && (
          <div
            style={{
              marginTop: fontSize * 0.1,
              fontFamily: typography.fontFamily.primary,
              fontWeight: 700,
              fontSize: Math.max(22, fontSize * 0.14),
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accentColor,
              opacity: kickP,
              transform: `translateY(${(1 - kickP) * 14}px)`,
            }}
          >
            {kicker}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
