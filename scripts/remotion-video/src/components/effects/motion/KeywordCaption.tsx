/**
 * KeywordCaption — a pre-laid lower-third caption (1–2 lines). Words appear in place with a
 * short linear opacity step (no movement); keywords carry the accent: heavier weight, accent
 * tint and a fine underline. Nothing moves after a word has arrived.
 * data: { "line1": "...", "line2"?: "...", "keywords": ["word", ...] }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clip, ease, look, pace, tween, useMotionConfig } from "./grammar";

const norm = (w: string) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

export function hasKeywordCaptionData(data: Record<string, unknown>): boolean {
  return !!data && clip(data.line1, 120).length > 0;
}

export const KeywordCaption: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useMotionConfig();
  if (!hasKeywordCaptionData(data)) return null;
  const isVertical = height > width;

  const lines = [clip(data.line1, 120), clip(data.line2, 120)].filter(Boolean).map((l) => l.split(/\s+/));
  const kws = new Set(
    (Array.isArray(data.keywords) ? data.keywords : []).slice(0, 12).map((k) => norm(String(k))).filter(Boolean)
  );
  const total = lines.reduce((a, l) => a + l.length, 0);

  const first = 0.4;
  const window = Math.min(3.25, 0.24 * Math.max(total - 1, 0));
  const { t } = pace(frame, fps, durationInFrames, first + window + 0.1);
  const step = total > 1 ? window / (total - 1) : 0;

  const sideMargin = isVertical ? look.safeX : 240;
  const boxW = width - sideMargin * 2;
  const longest = Math.max(...lines.map((l) => l.join(" ").length), 1);
  const fontSize = Math.max(34, Math.min(isVertical ? 64 : 58, boxW / (longest * 0.52)));
  // sit above the scene's lower third (story title + source)
  const bottom = isVertical ? height * 0.14 : look.safeBottom + 40;

  let idx = 0;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      {/* bottom shade instead of a heavy text shadow */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "42%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.6))",
        }}
      />
      <div
        style={{
          position: "relative",
          marginBottom: bottom,
          width: boxW,
          textAlign: "center",
          fontFamily: look.font,
          fontWeight: 500,
          fontSize,
          lineHeight: 1.24,
          letterSpacing: "-0.025em",
          color: look.ink,
          textShadow: "0 2px 6px rgba(0,0,0,0.7)",
        }}
      >
        {lines.map((ws, li) => (
          <div key={li} style={{ marginTop: li ? 12 : 0 }}>
            {ws.map((w, wi) => {
              const p = tween(t, first + idx++ * step, 0.1, ease.linear);
              const isKw = kws.has(norm(w));
              return (
                <React.Fragment key={wi}>
                  <span
                    style={{
                      opacity: p,
                      fontWeight: isKw ? 800 : 500,
                      color: isKw ? `color-mix(in srgb, ${accentColor} 45%, white)` : look.ink,
                      textDecoration: isKw ? "underline" : "none",
                      textDecorationThickness: 2,
                      textUnderlineOffset: 7,
                      textDecorationColor: isKw ? accentColor : undefined,
                    }}
                  >
                    {w}
                  </span>
                  {wi < ws.length - 1 ? " " : null}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
