/**
 * CompositionStrip — an empty 0–100 % strip with its axis, then the segments wipe in one by one (0.85 s each,
 * in input order); each legend row (square swatch, label, share) rises AFTER its segment has landed; a
 * "100 % av helheten" tag closes the beat.
 * data: { title?: string, items: [{ label: "Google", value: 61 }, ...] }  (2-6 items, percentages;
 * normalised to 100, with an "Andre" remainder added only if the sum is below 100)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pace, tween, ease, wipeLR, fmtNum, num, clip, look, useMotionConfig } from "./grammar";

type Item = { label: string; value: number };

function parseItems(data: Record<string, unknown>): Item[] {
  const raw = Array.isArray(data?.items) ? (data.items as unknown[]) : [];
  const items = raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { label: clip(o.label, 22), value: num(o.value) };
    })
    .filter((i) => Number.isFinite(i.value) && i.value > 0)
    .slice(0, 6);
  if (items.length < 2) return items;
  const sum = items.reduce((s, i) => s + i.value, 0);
  if (sum < 99.5 && items.length < 6) return [...items, { label: "Andre", value: 100 - sum }];
  return items.map((i) => ({ ...i, value: (i.value / sum) * 100 }));
}

export function hasCompositionStripData(data: Record<string, unknown>): boolean {
  return parseItems(data).length >= 2;
}

const WIPE = 0.85;

export const CompositionStrip: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useMotionConfig();
  const items = parseItems(data);
  if (items.length < 2) return null;
  const n = items.length;
  const isVertical = height > width;
  const title = data.title ? clip(data.title, 60) : "";

  const STEP = Math.max(0.7, Math.min(1.1, 4 / n));
  const S0 = 0.9;
  const legendAt = (i: number) => S0 + i * STEP + WIPE + 0.15;
  const tagAt = legendAt(n - 1) + 0.5;
  const { t } = pace(frame, fps, durationInFrames, tagAt + 0.4 + 0.1);

  const titleP = tween(t, 0.16, 0.36, ease.expoOut);
  const stripP = tween(t, 0.5, 0.22, ease.power3Out);
  const tagP = tween(t, tagAt, 0.3, ease.expoOut);

  const total = items.reduce((s, i) => s + i.value, 0);
  const W = Math.min(width - look.safeX * 2, 1700);
  const stripH = isVertical ? 150 : 170;
  const titleSize = isVertical ? 72 : 84;
  const legendSize = isVertical ? 34 : 37;
  const pctSize = isVertical ? 38 : 40;
  const swatch = 34;
  const cols = isVertical ? 1 : 2;
  const colGap = 110;
  const cellW = (W - colGap * (cols - 1)) / cols;

  const tones = [
    accentColor,
    look.ink,
    "rgba(245,245,242,0.62)",
    "rgba(245,245,242,0.40)",
    "rgba(245,245,242,0.26)",
    "rgba(245,245,242,0.16)",
  ];

  let acc = 0;
  const segs = items.map((it, i) => {
    const share = it.value / total;
    const x = acc * W;
    acc += share;
    const wipe = tween(t, S0 + i * STEP, WIPE, ease.power2Out);
    return { it, x, w: share * W, wipe, color: tones[i], legend: tween(t, legendAt(i), 0.4, ease.power3Out) };
  });

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
      <div style={{ width: W }}>
        {title && (
          <div style={{ clipPath: wipeLR(titleP), marginBottom: 44 }}>
            <div
              style={{
                fontSize: titleSize,
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
        {/* empty strip + axis */}
        <div style={{ position: "relative", width: W, height: stripH, opacity: 1 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(245,245,242,0.08)",
              outline: `${look.ruleW}px solid ${look.rule}`,
              outlineOffset: -look.ruleW,
              opacity: stripP,
            }}
          />
          {segs.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.x + (i > 0 ? 2 : 0),
                width: Math.max(0, s.w - (i > 0 ? 2 : 0)),
                top: 0,
                height: stripH,
                background: s.color,
                clipPath: wipeLR(s.wipe),
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: look.mono,
            fontSize: 26,
            color: look.muted,
            marginTop: 12,
            opacity: stripP,
          }}
        >
          <span>0 %</span>
          <span style={{ opacity: tagP, clipPath: wipeLR(tagP), color: look.ink }}>100 % av helheten</span>
          <span>100 %</span>
        </div>
        {/* legend: reserved layout, rows rise after their segment */}
        <div
          style={{
            marginTop: isVertical ? 56 : 48,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
            columnGap: colGap,
            rowGap: isVertical ? 22 : 24,
          }}
        >
          {segs.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: s.legend,
                transform: `translateY(${(1 - s.legend) * 15}px)`,
              }}
            >
              <span style={{ width: swatch, height: swatch, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: legendSize, fontWeight: 600, color: look.muted, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>
                {s.it.label}
              </span>
              <span
                style={{
                  fontSize: pctSize,
                  fontWeight: 800,
                  letterSpacing: look.tracking.head,
                  fontVariantNumeric: "tabular-nums",
                  textAlign: "right",
                  color: i === 0 ? accentColor : look.ink,
                  whiteSpace: "nowrap",
                }}
              >
                {fmtNum(s.it.value)} %
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
