/**
 * LineTrend — axis with light grid, then the observed line draws left→right (linear) with points landing
 * under the pen; a dashed least-squares trend is drawn alongside, starting mid-way. The last value is called
 * out in accent and a summary line closes the beat.
 * data: { title?: string, unit?: string, conclusion?: string, points: [{ label: "jan", value: 3 }, ...] }  (3-8 points)
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pace, tween, mix, ease, wipeLR, fmtNum, num, clip, look } from "./grammar";

type Pt = { label: string; value: number };

function parsePoints(data: Record<string, unknown>): Pt[] {
  const raw = Array.isArray(data?.points) ? (data.points as unknown[]) : [];
  return raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return { label: clip(o.label, 10), value: num(o.value) };
    })
    .filter((p) => Number.isFinite(p.value))
    .slice(0, 8);
}

export function hasLineTrendData(data: Record<string, unknown>): boolean {
  return parsePoints(data).length >= 3;
}

/** Round step (1, 2, 2.5, 5 × 10^k) giving about `count` intervals over `span`. */
function niceStep(span: number, count: number): number {
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / mag;
  const m = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return m * mag;
}

export const LineTrend: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const pts = parsePoints(data);
  if (pts.length < 3) return null;
  const n = pts.length;
  const last = n - 1;
  const isVertical = height > width;
  const title = data.title ? clip(data.title, 60) : "";
  const unit = data.unit ? String(data.unit).slice(0, 12) : "";

  const vals = pts.map((q) => q.value);
  const first = vals[0];
  const end = vals[last];
  const change = first !== 0 ? Math.round(((end - first) / Math.abs(first)) * 100) : NaN;
  const auto = `${pts[0].label} → ${pts[last].label}: ${fmtNum(first)} → ${fmtNum(end)}${unit ? " " + unit : ""}${
    Number.isFinite(change) ? ` (${change > 0 ? "+" : change < 0 ? "−" : ""}${fmtNum(Math.abs(change))} %)` : ""
  }`;
  const summary = clip(data.conclusion || auto, 80);

  // timeline
  const DRAW0 = 0.85;
  const DRAW = 0.7 + (n - 1) * 0.45;
  const TREND0 = DRAW0 + DRAW * 0.35;
  const TRENDD = DRAW * 0.8;
  const sumAt = Math.max(DRAW0 + DRAW, TREND0 + TRENDD) + 0.25;
  const { t } = pace(frame, fps, durationInFrames, sumAt + 0.65 + 0.1);

  const titleP = tween(t, 0.16, 0.36, ease.expoOut);
  const planeP = tween(t, 0.3, 0.7, ease.power3Out);
  const drawP = tween(t, DRAW0, DRAW, ease.linear);
  const trendP = tween(t, TREND0, TRENDD, ease.linear);
  const sumP = tween(t, sumAt, 0.65, ease.power3Out);

  const W = Math.min(width - look.safeX * 2, 1700);
  const H = isVertical ? Math.min(height * 0.36, 700) : Math.min(height * 0.44, 470);
  const padL = 120;
  const padR = 56;
  const padTop = 78;
  const padBot = 14;
  const innerW = W - padL - padR;
  const innerH = H - padTop - padBot;

  // y domain on round ticks
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  if (hi - lo < 1e-9) {
    lo -= 1;
    hi += 1;
  }
  const step = niceStep(hi - lo, 4);
  const yMin = Math.floor(lo / step) * step;
  const yMax = Math.max(Math.ceil(hi / step) * step, yMin + step);
  const ticks: number[] = [];
  for (let v = yMin; v <= yMax + step * 1e-6 && ticks.length < 8; v += step) ticks.push(Math.round(v / step) * step);
  const X = (i: number) => padL + (i / last) * innerW;
  const Y = (v: number) => padTop + (1 - (v - yMin) / (yMax - yMin)) * innerH;
  const xy = pts.map((q, i) => [X(i), Y(q.value)] as const);
  const path = xy.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");

  // least squares over index
  const mx = last / 2;
  const my = vals.reduce((s, v) => s + v, 0) / n;
  let sxy = 0;
  let sxx = 0;
  vals.forEach((v, i) => {
    sxy += (i - mx) * (v - my);
    sxx += (i - mx) * (i - mx);
  });
  const slope = sxx ? sxy / sxx : 0;
  const tv = (i: number) => Math.min(yMax, Math.max(yMin, my + slope * (i - mx)));

  const penX = mix(drawP, padL - 12, padL + innerW + 12);
  const trendX = mix(trendP, padL - 12, padL + innerW + 12);
  const valSize = isVertical ? 52 : 46;
  const lastLand = tween(t, DRAW0 + DRAW - 0.1, 0.25, ease.power3Out);

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
        {(title || unit) && (
          <div style={{ clipPath: wipeLR(titleP), marginBottom: 12 }}>
            <div
              style={{
                fontSize: isVertical ? 72 : 84,
                fontWeight: 800,
                letterSpacing: look.tracking.head,
                lineHeight: 1.05,
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              {title}
              {unit && (
                <span style={{ fontFamily: look.mono, fontSize: 30, fontWeight: 500, color: look.muted, marginLeft: 18, letterSpacing: 0 }}>
                  {unit}
                </span>
              )}
            </div>
          </div>
        )}
        <svg
          width={W}
          height={H + 56}
          style={{
            display: "block",
            overflow: "visible",
            opacity: planeP,
            transform: `scale(${mix(planeP, 0.94, 1)})`,
            transformOrigin: "40% 60%",
          }}
        >
          <defs>
            <clipPath id="lt-obs">
              <rect x={0} y={-20} width={Math.max(0, penX)} height={H + 40} />
            </clipPath>
            <clipPath id="lt-trend">
              <rect x={0} y={-20} width={Math.max(0, trendX)} height={H + 40} />
            </clipPath>
          </defs>
          {ticks.map((v, k) => (
            <g key={k}>
              <line x1={padL} x2={padL + innerW} y1={Y(v)} y2={Y(v)} stroke={k === 0 ? look.faint : look.rule} strokeWidth={look.ruleW} opacity={k === 0 ? 1 : 0.7} />
              <text x={padL - 18} y={Y(v) + 9} textAnchor="end" fontSize={24} fontFamily={look.mono} fill={look.muted}>
                {fmtNum(v)}
              </text>
            </g>
          ))}
          {xy.map(([x], i) => (
            <text key={i} x={x} y={H + 44} textAnchor="middle" fontSize={24} fontFamily={look.mono} fill={look.muted}>
              {pts[i].label}
            </text>
          ))}
          <g clipPath="url(#lt-trend)">
            <line
              x1={X(0)}
              y1={Y(tv(0))}
              x2={X(last)}
              y2={Y(tv(last))}
              stroke={accentColor}
              strokeWidth={3}
              strokeDasharray="11 10"
            />
          </g>
          <g clipPath="url(#lt-obs)">
            <path d={path} fill="none" stroke={look.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {xy.map(([x, y], i) => {
            const at = DRAW0 + (i / last) * DRAW;
            const land = i === 0 ? tween(t, 0.3, 0.3, ease.power3Out) : tween(t, at - 0.05, 0.22, ease.power3Out);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={10 * mix(land, 0.8, 1)}
                fill={accentColor}
                stroke={look.ink}
                strokeWidth={2}
                opacity={land}
              />
            );
          })}
          <text
            x={Math.min(xy[last][0], padL + innerW)}
            y={Math.max(valSize, xy[last][1] - 26)}
            textAnchor="end"
            fontSize={valSize}
            fontWeight={800}
            fill={accentColor}
            opacity={lastLand}
            style={{ fontVariantNumeric: "tabular-nums", letterSpacing: look.tracking.hero }}
          >
            {fmtNum(end)}
            {unit ? ` ${unit}` : ""}
          </text>
        </svg>
        <div
          style={{
            marginTop: 20,
            opacity: sumP,
            transform: `translateY(${(1 - sumP) * 15}px)`,
            borderLeft: `4px solid ${accentColor}`,
            background: look.surface,
            padding: "14px 24px",
            borderRadius: `0 ${look.radius}px ${look.radius}px 0`,
            fontSize: isVertical ? 34 : 36,
            fontWeight: 600,
            letterSpacing: look.tracking.body,
            lineHeight: 1.25,
          }}
        >
          {summary}
        </div>
      </div>
    </AbsoluteFill>
  );
};
