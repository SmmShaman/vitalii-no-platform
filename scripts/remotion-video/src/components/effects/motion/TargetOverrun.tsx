/**
 * TargetOverrun — a track that ends AT the goal line; the fill climbs to the goal (sine.inOut) and, when the
 * value exceeds it, continues into a hatched excess segment that hangs outside the track (power2.out).
 * The hero number counts in the same two phases and stays parked in one place. Short of the goal, the gap
 * is outlined (dashed) and a "−X %" tag closes the beat. Verdict arrives last as a wipe.
 * data: { label: string, value: number, target: number, unit?: string, note?: string }  (target > 0)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pace, tween, mix, ease, wipeLR, fmtNum, num, clip, look, useMotionConfig } from "./grammar";

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
  const { width, height, fps, durationInFrames } = useMotionConfig();
  if (!hasTargetOverrunData(data)) return null;

  const isVertical = height > width;
  const value = Math.max(0, num(data.value));
  const target = num(data.target);
  const unit = data.unit ? String(data.unit).slice(0, 12) : "";
  const label = clip(data.label, 60);
  const note = data.note ? clip(data.note, 70) : "";
  const over = value > target;
  const pct = Math.round((num(data.value) / target - 1) * 100);
  const showVerdict = pct !== 0;

  // timeline (absolute seconds)
  const P1 = 0.95;
  const P1D = over ? 1.9 : 2.2;
  const P2 = P1 + P1D;
  const P2D = over ? 1.0 : 0;
  const fillEnd = P2 + P2D;
  const verdictAt = fillEnd + 0.2;
  const noteAt = verdictAt + 0.5;
  const build = (note ? noteAt + 0.65 : showVerdict ? verdictAt + 0.35 : fillEnd) + 0.1;
  const { t } = pace(frame, fps, durationInFrames, build);

  const labelP = tween(t, 0.16, 0.36, ease.expoOut);
  const trackP = tween(t, 0.45, 0.25, ease.power3Out);
  const goalP = tween(t, 0.55, 0.3, ease.power3Out);

  // progress in units: phase 1 to min(value,target) with sine.inOut, phase 2 beyond target with power2.out
  const p1Target = Math.min(value, target);
  let cur = mix(tween(t, P1, P1D, ease.sineInOut), 0, p1Target);
  if (over) cur = target + (value - target) * tween(t, P2, P2D, ease.power2Out);
  const done = t >= fillEnd;

  const W = Math.min(width - look.safeX * 2, 1700);
  const trackH = isVertical ? 80 : 72;
  const ppu = W / Math.max(value, target);
  const goalX = target * ppu;
  const fillBase = Math.min(cur, target) * ppu;
  const fillOver = over ? Math.max(0, cur - target) * ppu : 0;

  const decimals = Number.isInteger(value) || value >= 100 ? 0 : 1;
  const shown = done ? value : Math.round(cur * 10 ** decimals) / 10 ** decimals;
  const heroSize = isVertical ? 124 : 150;
  const verdictP = tween(t, verdictAt, 0.3, ease.expoOut);
  const noteP = tween(t, noteAt, 0.4, ease.power3Out);
  const gapP = tween(t, verdictAt - 0.1, 0.3, ease.expoOut);

  const verdictText = `${over ? "+" : "−"}${fmtNum(Math.abs(pct))} %`;
  const gapStart = value * ppu;
  const vCenter = over ? (goalX + value * ppu) / 2 : (gapStart + goalX) / 2;
  const goalText = `Mål: ${fmtNum(target)}${unit ? " " + unit : ""}`;

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
        <div style={{ clipPath: wipeLR(labelP) }}>
          <div
            style={{
              fontSize: isVertical ? 68 : 80,
              fontWeight: 800,
              letterSpacing: look.tracking.head,
              lineHeight: 1.08,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            {label}
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: heroSize,
            fontWeight: 800,
            letterSpacing: look.tracking.hero,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            color: over && done ? accentColor : look.ink,
            opacity: trackP,
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          {fmtNum(shown)}
          {unit && (
            <span style={{ fontFamily: look.mono, fontSize: heroSize * 0.3, fontWeight: 500, marginLeft: 14, color: look.muted, letterSpacing: 0 }}>
              {unit}
            </span>
          )}
        </div>

        <div style={{ position: "relative", height: trackH + 150, marginTop: isVertical ? 40 : 32 }}>
          {/* goal label, right-aligned to the line, above it */}
          <div
            style={{
              position: "absolute",
              right: W - goalX - 8,
              top: 0,
              fontFamily: look.mono,
              fontSize: 28,
              color: look.muted,
              whiteSpace: "nowrap",
              opacity: goalP,
            }}
          >
            {goalText}
          </div>
          <div style={{ position: "absolute", left: 0, top: 56, width: W, height: trackH }}>
            {/* track ends at the goal */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: goalX,
                height: trackH,
                background: "rgba(245,245,242,0.14)",
                outline: `${look.ruleW}px solid ${look.rule}`,
                outlineOffset: -look.ruleW,
                opacity: trackP,
              }}
            />
            {/* base fill */}
            <div style={{ position: "absolute", left: 0, top: 0, width: fillBase, height: trackH, background: accentColor }} />
            {/* shortfall gap */}
            {!over && (
              <div
                style={{
                  position: "absolute",
                  left: gapStart,
                  top: 0,
                  width: Math.max(0, goalX - gapStart),
                  height: trackH,
                  border: `3px dashed ${accentColor}`,
                  boxSizing: "border-box",
                  clipPath: wipeLR(gapP),
                }}
              />
            )}
            {/* excess, hatched, outside the track */}
            {over && fillOver > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: goalX,
                  top: 0,
                  width: fillOver,
                  height: trackH,
                  background: `repeating-linear-gradient(135deg, ${look.ink} 0 7px, rgba(245,245,242,0.38) 7px 11px)`,
                }}
              />
            )}
            {/* goal line, on screen before the fill starts */}
            <div
              style={{
                position: "absolute",
                left: goalX - 2,
                top: -20,
                width: 4,
                height: trackH + 44,
                background: look.ink,
                transformOrigin: "50% 100%",
                transform: `scaleY(${goalP})`,
              }}
            />
            <div style={{ position: "absolute", left: 0, top: trackH + 14, fontFamily: look.mono, fontSize: 26, color: look.faint, opacity: trackP }}>0</div>
            {showVerdict && (
              <div
                style={{
                  position: "absolute",
                  left: Math.min(Math.max(vCenter, 110), W - 110),
                  top: trackH + 22,
                  transform: "translateX(-50%)",
                  clipPath: wipeLR(verdictP),
                }}
              >
                <div
                  style={{
                    padding: "8px 24px",
                    background: over ? accentColor : look.surface,
                    border: `2px solid ${accentColor}`,
                    borderRadius: look.radius,
                    color: over ? "#0a0a0a" : look.ink,
                    fontWeight: 800,
                    fontSize: isVertical ? 44 : 48,
                    letterSpacing: look.tracking.head,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {verdictText}
                </div>
              </div>
            )}
          </div>
        </div>
        {note && (
          <div
            style={{
              marginTop: 8,
              fontSize: 36,
              fontWeight: 500,
              color: look.muted,
              opacity: noteP,
              transform: `translateY(${(1 - noteP) * 15}px)`,
            }}
          >
            {note}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
