/**
 * CardCounter — receipt-style cards land one after another from the left on a fixed cadence while a
 * two-level counter ticks in the same beat: the count of cards (big) and the running sum (smaller).
 * A plain summary line closes the block; everything then holds still.
 * data: { cards: [{label, value}, ...] (2-6), unit?: string, totalLabel?: string, countLabel?: string, summary?: string }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pace, tween, ease, fmtNum, num, clip, look } from "./grammar";

interface Card {
  label: string;
  value: number;
}

function parseCards(data: Record<string, unknown>): Card[] {
  const raw = Array.isArray(data?.cards) ? (data.cards as unknown[]) : [];
  return raw
    .map((c) => {
      const o = (c && typeof c === "object" ? c : {}) as Record<string, unknown>;
      return { label: clip(o.label, 22), value: num(o.value) };
    })
    .filter((c) => Number.isFinite(c.value))
    .slice(0, 6);
}

export function hasCardCounterData(data: Record<string, unknown>): boolean {
  return !!data && parseCards(data).length >= 2;
}

const FIRST = 0.4;
const STEP = 0.43;
const ENTER = 0.25;
const TICK = 0.27;

export const CardCounter: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const cards = parseCards(data);
  if (cards.length < 2) return null;

  const isVertical = height > width;
  const n = cards.length;
  const unit = data.unit ? clip(data.unit, 12) : "";
  const totalLabel = data.totalLabel ? clip(data.totalLabel, 20) : "Totalt";
  const countLabel = data.countLabel ? clip(data.countLabel, 14) : "poster";

  const cardT = (i: number) => FIRST + i * STEP;
  const lastTick = cardT(n - 1) + TICK;
  const tSummary = lastTick + 0.9;
  const BUILD = tSummary + 0.25;
  const { t } = pace(frame, fps, durationInFrames, BUILD);

  // counters ride the same beat as the arrivals
  let count = 0;
  let running = 0;
  let total = 0;
  cards.forEach((c, i) => {
    const p = tween(t, cardT(i), TICK, ease.power2Out);
    count += p;
    running += c.value * p;
    total += c.value;
  });
  const decimals = Math.abs(total) < 100 && cards.some((c) => !Number.isInteger(c.value)) ? 1 : 0;
  const fmtRun = (x: number) =>
    x.toLocaleString("nb-NO", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const totalText = fmtRun(running);
  const summary = data.summary ? clip(data.summary, 64) : `${n} ${countLabel} · ${fmtRun(total)}${unit ? " " + unit : ""}`;

  // ── geometry ──
  const safeX = look.safeX;
  const cardH = 112;
  const cardGap = 20;
  const cardsW = isVertical ? width - safeX * 2 : 760;
  const sheetW = isVertical ? width - safeX * 2 : 844;
  const sheetH = isVertical ? 470 : 560;
  const sheetIn = tween(t, 0.16, 0.3, ease.power3Out);
  const sumIn = tween(t, tSummary, 0.25, ease.linear);

  const totalFont = Math.min(isVertical ? 104 : 112, (sheetW - 80) / (Math.max(totalText.length, 3) * 0.62 + (unit ? unit.length * 0.28 : 0)));

  const sheet = (
    <div
      style={{
        width: sheetW,
        height: sheetH,
        boxSizing: "border-box",
        background: look.surface,
        border: `${look.ruleW}px solid ${look.rule}`,
        borderRadius: look.radius,
        boxShadow: "12px 12px 0 rgba(0,0,0,0.55)",
        padding: "36px 44px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 26,
        opacity: Math.min(1, sheetIn * 4),
        transform: `translateX(${(1 - sheetIn) * 24}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <div
          style={{
            fontFamily: look.font,
            fontWeight: 800,
            fontSize: isVertical ? 140 : 156,
            letterSpacing: "-0.06em",
            lineHeight: 0.95,
            color: look.ink,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(count)}
        </div>
        <div style={{ fontFamily: look.font, fontWeight: 600, fontSize: 38, color: look.muted }}>{countLabel}</div>
      </div>
      <div style={{ height: look.ruleW, background: look.rule }} />
      <div>
        <div style={{ fontFamily: look.font, fontWeight: 600, fontSize: 30, color: look.muted, marginBottom: 8 }}>
          {totalLabel}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, whiteSpace: "nowrap" }}>
          <div
            style={{
              fontFamily: look.font,
              fontWeight: 700,
              fontSize: totalFont,
              letterSpacing: look.tracking.hero,
              lineHeight: 1,
              color: accentColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {totalText}
          </div>
          {unit && <div style={{ fontFamily: look.font, fontWeight: 600, fontSize: 38, color: look.muted }}>{unit}</div>}
        </div>
      </div>
    </div>
  );

  const list = (
    <div style={{ width: cardsW, display: "flex", flexDirection: "column", gap: cardGap }}>
      {cards.map((c, i) => {
        const p = tween(t, cardT(i), ENTER, ease.power4Out);
        const shown = t >= cardT(i);
        return (
          <div
            key={i}
            style={{
              height: cardH,
              boxSizing: "border-box",
              background: look.surface,
              border: `${look.ruleW}px solid ${look.rule}`,
              borderRadius: look.radius,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 30px",
              opacity: shown ? Math.min(1, p * 3) : 0,
              transform: `translateX(${(1 - p) * -35}px)`,
            }}
          >
            <div style={{ fontFamily: look.mono, fontSize: 26, color: look.muted, width: 40 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                flex: 1,
                fontFamily: look.font,
                fontWeight: 650,
                fontSize: 36,
                letterSpacing: look.tracking.body,
                color: look.ink,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontFamily: look.font,
                fontWeight: 800,
                fontSize: 52,
                letterSpacing: look.tracking.head,
                color: look.ink,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {fmtNum(c.value)}
              {unit && <span style={{ fontSize: 30, fontWeight: 600, color: look.muted, marginLeft: 10 }}>{unit}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );

  const summaryEl = (
    <div
      style={{
        fontFamily: look.font,
        fontWeight: 700,
        fontSize: 48,
        letterSpacing: look.tracking.head,
        lineHeight: 1.12,
        color: look.ink,
        textAlign: isVertical ? "center" : "left",
        opacity: sumIn,
        minHeight: 54,
      }}
    >
      {summary}
    </div>
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: look.scrim }} />
      {isVertical ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column", gap: 48 }}>
          {sheet}
          {list}
          {summaryEl}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 100 }}>
          {list}
          <div style={{ width: sheetW, display: "flex", flexDirection: "column", gap: 34 }}>
            {sheet}
            {summaryEl}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
