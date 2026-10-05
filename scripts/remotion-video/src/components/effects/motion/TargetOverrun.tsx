/**
 * TargetOverrun — horizontal track with a goal line; a fill grows with a counter on its edge.
 * Beyond the goal the fill turns accent with a "+X %" badge; short of it the gap is outlined with "−X %".
 * data: { label: string, value: number, target: number, unit?: string }  (target > 0)
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

export function hasTargetOverrunData(data: Record<string, unknown>): boolean {
  if (!data) return false;
  const v = num(data.value);
  const t = num(data.target);
  return Number.isFinite(v) && Number.isFinite(t) && t > 0;
}

export const TargetOverrun: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  if (!hasTargetOverrunData(data)) return null;

  const isVertical = height > width;
  const d = Math.max(durationInFrames, 30);
  const value = num(data.value);
  const target = num(data.target);
  const unit = data.unit ? String(data.unit).slice(0, 12) : "";
  const label = trunc(data.label, 48);
  // keep one decimal for small values (35,1 mrd.), whole numbers otherwise
  const fmt = (n: number) => n.toLocaleString("nb-NO", { maximumFractionDigits: Math.abs(n) < 100 && n % 1 !== 0 ? 1 : 0 });

  const at = (a: number, b: number) =>
    interpolate(frame, [a * d, Math.max(b * d, a * d + 0.01)], [0, 1], clampBoth);
  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clampBoth);

  const padX = width * (isVertical ? 0.08 : 0.1);
  const trackW = width - padX * 2;
  const trackH = isVertical ? 70 : 64;
  const trackY = height * 0.52;
  const maxV = Math.max(value, target, 0) * 1.18 || 1;
  const xOf = (n: number) => padX + (Math.max(0, n) / maxV) * trackW;

  const intro = at(0, 0.1);
  const fillP = Easing.out(Easing.cubic)(at(0.12, 0.5));
  const cur = Math.max(0, value) * fillP;
  const goalX = xOf(target);
  const edgeX = xOf(cur);
  const over = value > target;
  const pct = Math.round((value / target - 1) * 100);
  const badgeP = spring({ frame: Math.max(0, frame - 0.5 * d), fps, config: { damping: 16, stiffness: 120 } });
  const badgeText = `${over ? "+" : "−"}${Math.abs(pct).toLocaleString("nb-NO")} %`;
  const showBadge = pct !== 0;

  const baseW = Math.max(0, xOf(Math.min(cur, target)) - padX);
  const overW = over ? Math.max(0, edgeX - goalX) : 0;
  const fillColor = over ? "rgba(255,255,255,0.88)" : accentColor;
  const bigFont = isVertical ? 76 : 88;

  const valueText = `${fmt(cur)}${unit ? " " + unit : ""}`;
  const badgeCx = over ? (goalX + xOf(value)) / 2 : (xOf(value) + goalX) / 2;
  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    left: badgeCx,
    top: trackY + trackH + 26,
    transform: `translateX(-50%) scale(${badgeP})`,
    opacity: badgeP,
    padding: "10px 26px",
    borderRadius: 999,
    background: over ? accentColor : "rgba(0,0,0,0.45)",
    border: `2px solid ${accentColor}`,
    color: over ? "#0a0a0a" : colors.text,
    fontFamily: NUM_FONT,
    fontWeight: 800,
    fontSize: isVertical ? 44 : 48,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.5))" }} />
      {/* label */}
      <div
        style={{
          position: "absolute",
          left: padX,
          right: padX,
          top: trackY - (isVertical ? 330 : 300),
          fontFamily: typography.fontFamily.primary,
          fontWeight: 700,
          fontSize: isVertical ? 54 : 56,
          color: colors.text,
          opacity: intro,
          transform: `translateY(${(1 - intro) * 20}px)`,
          lineHeight: 1.2,
          textShadow: "0 2px 14px rgba(0,0,0,0.6)",
        }}
      >
        {label}
      </div>

      {/* counter on fill edge */}
      <div
        style={{
          position: "absolute",
          left: Math.min(Math.max(edgeX, padX + 90), width - padX - 90),
          top: trackY - bigFont - 40,
          transform: "translateX(-50%)",
          fontFamily: NUM_FONT,
          fontVariantNumeric: "tabular-nums",
          fontWeight: 800,
          fontSize: bigFont,
          color: over && cur > target ? accentColor : colors.text,
          whiteSpace: "nowrap",
          opacity: intro,
          textShadow: "0 2px 14px rgba(0,0,0,0.6)",
        }}
      >
        {valueText}
      </div>

      {/* track */}
      <div
        style={{
          position: "absolute",
          left: padX,
          top: trackY,
          width: trackW,
          height: trackH,
          borderRadius: trackH / 2,
          background: glass.backgroundStrong,
          border: `1px solid ${glass.borderStrong}`,
          opacity: intro,
        }}
      />
      {/* shortfall gap outline */}
      {!over && (
        <div
          style={{
            position: "absolute",
            left: xOf(value),
            top: trackY,
            width: Math.max(0, goalX - xOf(value)),
            height: trackH,
            borderRadius: trackH / 2,
            border: `3px dashed ${accentColor}`,
            boxSizing: "border-box",
            opacity: at(0.5, 0.6),
          }}
        />
      )}
      {/* fill base */}
      <div
        style={{
          position: "absolute",
          left: padX,
          top: trackY,
          width: baseW,
          height: trackH,
          borderRadius: trackH / 2,
          background: fillColor,
        }}
      />
      {/* overrun part */}
      {over && overW > 0 && (
        <div
          style={{
            position: "absolute",
            left: goalX,
            top: trackY,
            width: overW,
            height: trackH,
            borderRadius: `0 ${trackH / 2}px ${trackH / 2}px 0`,
            background: accentColor,
          }}
        />
      )}
      {/* goal line */}
      <div
        style={{
          position: "absolute",
          left: goalX - 2,
          top: trackY - 22,
          width: 4,
          height: trackH + 44,
          background: colors.text,
          borderRadius: 2,
          opacity: intro,
          transform: `scaleY(${intro})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: goalX,
          top: trackY + trackH + 30,
          transform: "translateX(-50%)",
          fontFamily: typography.fontFamily.primary,
          fontWeight: 600,
          fontSize: isVertical ? 30 : 30,
          color: colors.textMuted,
          whiteSpace: "nowrap",
          opacity: intro,
          display: showBadge && Math.abs(badgeCx - goalX) < 170 ? "none" : "block",
        }}
      >
        {`Mål: ${fmt(target)}${unit ? " " + unit : ""}`}
      </div>
      {showBadge && <div style={badgeStyle}>{badgeText}</div>}
      {showBadge && Math.abs(badgeCx - goalX) < 170 && (
        <div
          style={{
            position: "absolute",
            left: goalX,
            top: trackY + trackH + 100,
            transform: "translateX(-50%)",
            fontFamily: typography.fontFamily.primary,
            fontWeight: 600,
            fontSize: 30,
            color: colors.textMuted,
            whiteSpace: "nowrap",
            opacity: intro,
          }}
        >
          {`Mål: ${fmt(target)}${unit ? " " + unit : ""}`}
        </div>
      )}
    </AbsoluteFill>
  );
};
