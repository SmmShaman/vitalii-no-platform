/**
 * CardCounter — cards are added one by one while a total counter updates in lockstep;
 * at the end an accent summary badge with the total settles.
 * data: { cards: [{label, value}, ...] (2-6), unit?: string, totalLabel?: string }
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { colors, glass, typography, clampBoth } from "../../../design-system";

const num = (v: unknown): number => {
  if (typeof v === "number") return v;
  return parseFloat(String(v ?? "").replace(/[^0-9.,-]/g, "").replace(",", "."));
};
const trunc = (s: unknown, n = 28) => {
  const t = String(s ?? "").trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
};
const NUM_FONT = "'Inter', sans-serif";

interface Card {
  label: string;
  value: number;
}

function parseCards(data: Record<string, unknown>): Card[] {
  const raw = Array.isArray(data?.cards) ? (data.cards as unknown[]) : [];
  return raw
    .map((c) => {
      const o = (c && typeof c === "object" ? c : {}) as Record<string, unknown>;
      return { label: trunc(o.label, 24), value: num(o.value) };
    })
    .filter((c) => Number.isFinite(c.value))
    .slice(0, 6);
}

export function hasCardCounterData(data: Record<string, unknown>): boolean {
  return !!data && parseCards(data).length >= 2;
}

export const CardCounter: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const cards = parseCards(data);
  if (cards.length < 2) return null;

  const isVertical = height > width;
  const d = Math.max(durationInFrames, 30);
  const n = cards.length;
  const unit = data.unit ? String(data.unit).slice(0, 20) : "";
  const totalLabel = data.totalLabel ? trunc(data.totalLabel, 20) : "Totalt";
  const fmt = (x: number) =>
    (Math.round(x * 100) / 100).toLocaleString("nb-NO", { maximumFractionDigits: 1 });

  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clampBoth);
  const start = 0.06 * d;
  const slot = (0.44 * d) / n;

  // running total, in lockstep with each card
  let running = 0;
  let total = 0;
  const locals: number[] = [];
  cards.forEach((c, i) => {
    const t0 = start + i * slot;
    const p = interpolate(frame, [t0, t0 + Math.max(slot * 0.8, 0.01)], [0, 1], clampBoth);
    locals.push(p);
    running += c.value * Easing.out(Easing.cubic)(p);
    total += c.value;
  });

  const badgeP = spring({ frame: Math.max(0, frame - 0.56 * d), fps, config: { damping: 16, stiffness: 120 } });

  const cols = isVertical ? 2 : n <= 3 ? n : n === 4 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const gridW = isVertical ? width * 0.88 : width * 0.58;
  const gap = 24;
  const cardW = (gridW - gap * (cols - 1)) / cols;
  const cardH = isVertical ? 200 : 230;

  const valueFont = Math.min(isVertical ? 64 : 72, cardW / 4.2);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))" }} />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isVertical ? 70 : 80,
          padding: isVertical ? "0 5%" : "0 5%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cardW}px)`,
            gridAutoRows: `${cardH}px`,
            gap,
            width: gridW,
            minHeight: rows * cardH + (rows - 1) * gap,
          }}
        >
          {cards.map((c, i) => {
            const p = Easing.out(Easing.cubic)(locals[i]);
            return (
              <div
                key={i}
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})`,
                  background: glass.backgroundStrong,
                  border: `1px solid ${glass.borderStrong}`,
                  borderRadius: glass.borderRadiusLarge,
                  backdropFilter: `blur(${glass.blur}px)`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 28px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontFamily: typography.fontFamily.primary,
                    fontWeight: 600,
                    fontSize: isVertical ? 28 : 30,
                    color: colors.textMuted,
                    marginBottom: 8,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontFamily: NUM_FONT,
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 800,
                    fontSize: valueFont,
                    color: colors.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmt(c.value)}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            minWidth: isVertical ? 0 : width * 0.25,
          }}
        >
          <div
            style={{
              fontFamily: typography.fontFamily.primary,
              fontWeight: 600,
              fontSize: isVertical ? 38 : 36,
              color: colors.textMuted,
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {totalLabel}
          </div>
          <div
            style={{
              fontFamily: NUM_FONT,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 900,
              fontSize: isVertical ? 140 : 120,
              color: colors.text,
              lineHeight: 1,
              whiteSpace: "nowrap",
              textShadow: "0 2px 18px rgba(0,0,0,0.6)",
            }}
          >
            {fmt(running)}
          </div>
          {unit && (
            <div
              style={{
                fontFamily: typography.fontFamily.primary,
                fontWeight: 600,
                fontSize: isVertical ? 38 : 34,
                color: colors.textMuted,
              }}
            >
              {unit}
            </div>
          )}
          <div
            style={{
              marginTop: 10,
              padding: "12px 34px",
              borderRadius: 999,
              background: accentColor,
              color: "#0a0a0a",
              fontFamily: NUM_FONT,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 800,
              fontSize: isVertical ? 44 : 40,
              whiteSpace: "nowrap",
              opacity: badgeP,
              transform: `scale(${0.8 + 0.2 * badgeP})`,
            }}
          >
            {`${cards.length} ${cards.length === 1 ? "post" : "poster"} · ${fmt(total)}${unit ? " " + unit : ""}`}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
