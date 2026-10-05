/**
 * CostLedger — 2–5 amount lines populate an editorial ledger in reading order; a heavy ruled
 * total lands last and counts up to the sum computed from the lines.
 * data: { title?: string, unit?: string, lines: [{ label, value }, ...], totalLabel?: string }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pace, tween, ease, wipeLR, fmtNum, num, clip, look } from "./grammar";

type Line = { label: string; value: number };

function parseLines(data: Record<string, unknown>): Line[] {
  const raw = Array.isArray(data?.lines) ? (data.lines as unknown[]) : [];
  return raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { label: clip(o.label, 34), value: num(o.value) };
    })
    .filter((l) => l.label && Number.isFinite(l.value))
    .slice(0, 5);
}

export function hasCostLedgerData(data: Record<string, unknown>): boolean {
  return parseLines(data).length >= 2;
}

const STEP = 0.8;

export const CostLedger: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const lines = parseLines(data);
  if (lines.length < 2) return null;
  const n = lines.length;
  const isVertical = height > width;
  const { t } = pace(frame, fps, durationInFrames, 1.3 + n * STEP + 1.4);

  const title = data.title ? clip(data.title, 60) : "";
  const unit = data.unit ? clip(data.unit, 16) : "";
  const totalLabel = clip(data.totalLabel ?? "Totalt", 20) || "Totalt";
  const sum = Math.round(lines.reduce((s, l) => s + l.value, 0) * 100) / 100;

  const panelW = Math.min(width - look.safeX * 2, isVertical ? 940 : 1400);
  const rowSize = isVertical ? 42 : 46;
  const titleSize = isVertical ? 72 : 80;

  const totalStart = 1 + n * STEP;
  const rise = tween(t, totalStart, 0.4, ease.power3Out);
  const ruleP = tween(t, totalStart, 0.3, ease.linear);
  const cp = tween(t, totalStart + 0.3, 1.4, ease.power2Out);
  const done = cp >= 1;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: look.font, color: look.ink }}>
      <div
        style={{
          width: panelW,
          padding: "44px 56px 48px",
          background: look.surface,
          borderRadius: look.radius,
          boxShadow: look.shadowHard,
          boxSizing: "border-box",
        }}
      >
        {title && (
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 760,
              lineHeight: 1.05,
              letterSpacing: look.tracking.head,
              marginBottom: 30,
              clipPath: wipeLR(tween(t, 0.16, 0.4, ease.expoOut)),
            }}
          >
            {title}
          </div>
        )}
        {lines.map((l, i) => {
          const p = tween(t, 1 + i * STEP, 0.3, ease.power2Out);
          return (
            <div
              key={i}
              style={{
                clipPath: wipeLR(p),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 24,
                padding: "16px 0",
                borderBottom: `${look.ruleW}px solid ${look.rule}`,
                fontSize: rowSize,
              }}
            >
              <span style={{ fontWeight: 500, letterSpacing: look.tracking.body }}>{l.label}</span>
              <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {fmtNum(l.value, 2)}
                {unit && <span style={{ fontFamily: look.mono, fontSize: 26, fontWeight: 400, color: look.muted, marginLeft: 12 }}>{unit}</span>}
              </span>
            </div>
          );
        })}
        {/* heavy total rule, drawn left→right */}
        <div style={{ height: 5, marginTop: 14, width: `${ruleP * 100}%`, background: look.ink }} />
        <div
          style={{
            opacity: rise > 0.001 ? 1 : 0,
            transform: `translateY(${(1 - rise) * 20}px)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 24,
            paddingTop: 18,
          }}
        >
          <span style={{ fontSize: isVertical ? 40 : 44, fontWeight: 700, letterSpacing: look.tracking.head }}>{totalLabel}</span>
          <span
            style={{
              fontSize: isVertical ? 110 : 130,
              fontWeight: 800,
              letterSpacing: look.tracking.hero,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
              color: done ? accentColor : look.ink,
            }}
          >
            {fmtNum(sum * cp, 2)}
            {unit && <span style={{ fontFamily: look.mono, fontSize: 34, fontWeight: 400, color: look.muted, marginLeft: 16, letterSpacing: 0 }}>{unit}</span>}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
