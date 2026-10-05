/**
 * CornerTags — one central statement stays put; 2–4 short tags arrive one at a time from the
 * corners (who / what / where / how much). Open space is kept around the centre.
 * data: { "statement": "...", "tags": ["...","...","...","..."] }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clip, ease, look, pace, tween, wipeLR, mix } from "./grammar";

const s = (v: unknown, n: number) => clip(v, n);

function readTags(data: Record<string, unknown>): string[] {
  const raw = Array.isArray(data?.tags) ? data.tags : [];
  return raw.map((t) => s(t, 26)).filter(Boolean).slice(0, 4);
}

export function hasCornerTagsData(data: Record<string, unknown>): boolean {
  return !!data && s(data.statement, 90).length > 0 && readTags(data).length >= 2;
}

const FIRST = 0.3;
const STEP = 0.72;
const BUILD = FIRST + STEP * 3 + 0.3;

export const CornerTags: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  if (!hasCornerTagsData(data)) return null;
  const isVertical = height > width;
  const statement = s(data.statement, 90);
  const tags = readTags(data);
  const n = tags.length;
  // corner slots: 0 TL, 1 TR, 2 BL, 3 BR
  const slots = n === 2 ? [0, 3] : n === 3 ? [0, 1, 3] : [0, 1, 2, 3];
  const build = FIRST + STEP * (n - 1) + 0.3;
  const { t } = pace(frame, fps, durationInFrames, Math.min(BUILD, build));

  const len = statement.length;
  const fontSize = isVertical ? (len > 55 ? 68 : 82) : len > 60 ? 84 : len > 36 ? 98 : 112;
  const stP = tween(t, 0.16, 0.4, ease.power3Out);

  const tagFont = isVertical ? 36 : 42;
  const padX = look.safeX;
  const padY = look.safeY + (isVertical ? 60 : 24);

  return (
    <AbsoluteFill style={{ fontFamily: look.font }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: isVertical ? width - look.safeX * 2 : 1180,
            padding: isVertical ? "44px 40px" : "52px 64px",
            background: look.surface,
            borderRadius: look.radius,
            boxShadow: look.shadowHard,
            clipPath: wipeLR(stP),
          }}
        >
          <div
            style={{
              color: look.ink,
              fontSize,
              fontWeight: 850,
              lineHeight: 1.08,
              letterSpacing: look.tracking.head,
              textAlign: "center",
            }}
          >
            {statement}
          </div>
        </div>
      </AbsoluteFill>

      {tags.map((label, i) => {
        const slot = slots[i];
        const right = slot === 1 || slot === 3;
        const bottom = slot >= 2;
        const start = FIRST + STEP * i;
        const p = tween(t, start, 0.28, ease.power4Out);
        const dx = (right ? 1 : -1) * 40 * (1 - p);
        const dy = (bottom ? 1 : -1) * 28 * (1 - p);
        const sc = mix(p, 0.88, 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              [right ? "right" : "left"]: padX,
              [bottom ? "bottom" : "top"]: bottom ? look.safeBottom : padY,
              maxWidth: isVertical ? (width - padX * 2) * 0.48 : 520,
              padding: "16px 28px",
              background: accentColor,
              color: "#111",
              fontSize: tagFont,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: look.tracking.head,
              borderRadius: look.radius,
              textAlign: right ? "right" : "left",
              opacity: p,
              transform: `translate(${dx}px, ${dy}px) scale(${sc})`,
              transformOrigin: `${right ? "100%" : "0%"} ${bottom ? "100%" : "0%"}`,
            }}
          >
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
