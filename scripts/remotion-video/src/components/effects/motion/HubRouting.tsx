/**
 * HubRouting — input pills feed a central hub: connectors draw in sequence with a dot travelling each path,
 * then one connector runs from the hub to the optional output pill.
 * data: { inputs: string[] (2-5), hub: string, output?: string }
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { colors, glass, typography, clampBoth } from "../../../design-system";

const trunc = (s: unknown, n = 28) => {
  const t = String(s ?? "").trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
};

function parseInputs(data: Record<string, unknown>): string[] {
  const raw = Array.isArray(data?.inputs) ? (data.inputs as unknown[]) : [];
  return raw.map((s) => trunc(s)).filter((s) => s.length > 0).slice(0, 5);
}

export function hasHubRoutingData(data: Record<string, unknown>): boolean {
  return !!data && parseInputs(data).length >= 2 && trunc(data.hub).length > 0;
}

type Pt = { x: number; y: number };
const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
};

export const HubRouting: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const inputs = parseInputs(data);
  const hub = trunc(data?.hub);
  if (inputs.length < 2 || !hub) return null;

  const isVertical = height > width;
  const d = Math.max(durationInFrames, 30);
  const n = inputs.length;
  const output = data.output ? trunc(data.output) : "";
  const hasOut = output.length > 0;

  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clampBoth);
  const at = (a: number, b: number) =>
    interpolate(frame, [a * d, Math.max(b * d, a * d + 0.01)], [0, 1], clampBoth);

  // geometry
  const R = isVertical ? 120 : 130;
  const pw = isVertical ? 420 : 340;
  const ph = isVertical ? 96 : 92;
  const hubC: Pt = isVertical ? { x: width * 0.7, y: height * 0.46 } : { x: width * (hasOut ? 0.5 : 0.6), y: height * 0.5 };
  const pillGap = isVertical ? 150 : 128;
  const colH = (n - 1) * pillGap;
  const inX = isVertical ? width * 0.05 : width * 0.06;
  const pills = inputs.map((_, i) => ({
    x: inX,
    y: (isVertical ? hubC.y : height * 0.5) - colH / 2 + i * pillGap - ph / 2,
  }));
  const outW = isVertical ? 420 : 340;
  const outPos: Pt = isVertical
    ? { x: hubC.x - outW / 2, y: hubC.y + R + 190 }
    : { x: width * 0.94 - outW, y: hubC.y - ph / 2 };

  const seg = 0.4 / n;
  const t0 = (i: number) => 0.05 + i * seg;
  const outStart = 0.46;

  const paths = inputs.map((_, i) => {
    const s: Pt = { x: pills[i].x + pw, y: pills[i].y + ph / 2 };
    const dx = hubC.x - s.x;
    const dy = hubC.y - s.y;
    const len = Math.hypot(dx, dy) || 1;
    const e: Pt = { x: hubC.x - (dx / len) * R, y: hubC.y - (dy / len) * R };
    const c1: Pt = { x: s.x + (e.x - s.x) * 0.55, y: s.y };
    const c2: Pt = { x: e.x - (e.x - s.x) * 0.45, y: e.y };
    return { s, e, c1, c2 };
  });

  const hubPulse = (() => {
    // pulse when a dot arrives
    let m = 0;
    for (let i = 0; i < n; i++) {
      const arrive = (t0(i) + seg * 1.0) * d;
      const k = interpolate(frame, [arrive, arrive + 6, arrive + 14], [0, 1, 0], clampBoth);
      m = Math.max(m, k);
    }
    return m;
  })();

  const hubP = spring({ frame: Math.max(0, frame - 0.02 * d), fps, config: { damping: 16, stiffness: 110 } });
  const outP = spring({ frame: Math.max(0, frame - 0.58 * d), fps, config: { damping: 16, stiffness: 110 } });
  const outLine = Easing.inOut(Easing.cubic)(at(outStart, 0.58));
  const oS: Pt = isVertical ? { x: hubC.x, y: hubC.y + R } : { x: hubC.x + R, y: hubC.y };
  const oE: Pt = isVertical ? { x: hubC.x, y: outPos.y } : { x: outPos.x, y: hubC.y };

  const hubFont = hub.length > 16 ? 26 : hub.length > 9 ? 32 : 40;
  const pillFont = isVertical ? 30 : 28;

  const pillStyle = (accent: boolean): React.CSSProperties => ({
    position: "absolute",
    width: pw,
    height: ph,
    boxSizing: "border-box",
    borderRadius: ph / 2,
    background: accent ? accentColor : glass.backgroundStrong,
    border: accent ? "none" : `1px solid ${glass.borderStrong}`,
    backdropFilter: accent ? undefined : `blur(${glass.blur}px)`,
    color: accent ? "#0a0a0a" : colors.text,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
    textAlign: "center",
    fontFamily: typography.fontFamily.primary,
    fontWeight: 700,
    fontSize: pillFont,
    lineHeight: 1.1,
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))" }} />
      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
        {paths.map((p, i) => {
          const prog = Easing.inOut(Easing.cubic)(at(t0(i), t0(i) + seg * 1.0));
          const dot = bez(p.s, p.c1, p.c2, p.e, prog);
          const path = `M ${p.s.x} ${p.s.y} C ${p.c1.x} ${p.c1.y} ${p.c2.x} ${p.c2.y} ${p.e.x} ${p.e.y}`;
          return (
            <g key={i}>
              <path d={path} fill="none" stroke={colors.textTrack} strokeWidth={3} />
              <path
                d={path}
                fill="none"
                stroke={colors.textMuted}
                strokeWidth={4}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - prog}
                opacity={prog > 0 ? 1 : 0}
              />
              {prog > 0 && prog < 1 && <circle cx={dot.x} cy={dot.y} r={9} fill={accentColor} />}
            </g>
          );
        })}
        {hasOut && (
          <>
            <line x1={oS.x} y1={oS.y} x2={oE.x} y2={oE.y} stroke={colors.textTrack} strokeWidth={3} />
            <line
              x1={oS.x}
              y1={oS.y}
              x2={oS.x + (oE.x - oS.x) * outLine}
              y2={oS.y + (oE.y - oS.y) * outLine}
              stroke={accentColor}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={outLine > 0 ? 1 : 0}
            />
          </>
        )}
      </svg>

      {inputs.map((s, i) => {
        const p = Math.min(1, spring({ frame: Math.max(0, frame - t0(i) * d + 8), fps, config: { damping: 16, stiffness: 110 } }));
        return (
          <div
            key={i}
            style={{
              ...pillStyle(false),
              left: pills[i].x,
              top: pills[i].y,
              opacity: p,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            {s}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: hubC.x - R,
          top: hubC.y - R,
          width: R * 2,
          height: R * 2,
          boxSizing: "border-box",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.5)",
          border: `4px solid ${accentColor}`,
          boxShadow: `0 0 ${20 + hubPulse * 40}px ${accentColor}${hubPulse > 0.3 ? "99" : "44"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 22,
          textAlign: "center",
          fontFamily: typography.fontFamily.primary,
          fontWeight: 800,
          fontSize: hubFont,
          color: colors.text,
          lineHeight: 1.1,
          wordBreak: "break-word",
          opacity: Math.min(1, hubP),
          transform: `scale(${(0.85 + 0.15 * Math.min(1, hubP)) * (1 + hubPulse * 0.04)})`,
        }}
      >
        {hub}
      </div>

      {hasOut && (
        <div
          style={{
            ...pillStyle(true),
            width: outW,
            left: outPos.x,
            top: outPos.y,
            opacity: Math.min(1, outP),
            transform: `scale(${0.88 + 0.12 * Math.min(1, outP)})`,
          }}
        >
          {output}
        </div>
      )}
    </AbsoluteFill>
  );
};
