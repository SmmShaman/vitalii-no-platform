/**
 * FunnelAbsorption — 3–6 inputs sit inside a funnel silhouette, are pulled one by one into the gate at its
 * mouth with an ACCELERATING ease (power3.in), and only when all are gone is the single result released below.
 * data: { inputs: string[] (3-6), result: string }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clip, ease, look, mix, pace, punchScale, tween, wipeTD, useMotionConfig } from "./grammar";

const BUILD = 3.3;

function parse(data: Record<string, unknown>) {
  const raw = Array.isArray(data?.inputs) ? (data.inputs as unknown[]) : [];
  const inputs = raw.map((s) => clip(s, 26)).filter((s) => s.length > 0).slice(0, 6);
  return { inputs, result: clip(data?.result, 48) };
}

export function hasFunnelAbsorptionData(data: Record<string, unknown>): boolean {
  if (!data) return false;
  const p = parse(data);
  return p.inputs.length >= 3 && p.result.length > 0;
}

export const FunnelAbsorption: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useMotionConfig();
  const { inputs, result } = parse(data);
  if (inputs.length < 3 || !result) return null;
  const n = inputs.length;
  const { t } = pace(frame, fps, durationInFrames, BUILD);
  const isV = height > width;
  const cx = width / 2;

  // funnel silhouette
  const fTop = isV ? 130 : 80;
  const fBot = isV ? 1090 : 620;
  const halfTop = isV ? width / 2 - look.safeX : 760;
  const halfBot = isV ? 170 : 230;
  const halfAt = (y: number) => mix((y - fTop) / (fBot - fTop), halfTop, halfBot);
  const poly = `${cx - halfTop},${fTop} ${cx + halfTop},${fTop} ${cx + halfBot},${fBot} ${cx - halfBot},${fBot}`;

  // chip layout
  const chipW = isV ? 430 : 290;
  const chipH = isV ? 104 : 108;
  const pos: { x: number; y: number }[] = [];
  if (isV) {
    const pitch = 138;
    const y0 = fTop + 70;
    for (let i = 0; i < n; i++) pos.push({ x: cx + (i % 2 === 0 ? -34 : 34) - chipW / 2, y: y0 + i * pitch });
  } else {
    const rows = n <= 3 ? [n] : n === 4 ? [2, 2] : n === 5 ? [3, 2] : [3, 3];
    const ys = rows.length === 1 ? [190] : [120, 270];
    let k = 0;
    rows.forEach((cnt, r) => {
      const total = cnt * chipW + (cnt - 1) * 24;
      for (let j = 0; j < cnt; j++) pos.push({ x: cx - total / 2 + j * (chipW + 24), y: ys[r] }), k++;
    });
  }

  const gateW = isV ? 420 : 470;
  const gateH = 84;
  const gateY = fBot + 10;
  const gateCx = cx;
  const gateCy = gateY + gateH / 2;
  const gateP = tween(t, 1.2, 0.25, ease.power3Out);

  const funnelP = tween(t, 0.16, 0.45, ease.linear);
  const absStart = (i: number) => 1.55 + i * 0.14;
  const absEnd = absStart(n - 1) + 0.6;
  const resStart = absEnd + 0.1;
  const resY = gateY + gateH + (isV ? 90 : 56);
  const resSize = isV ? (result.length > 24 ? 66 : 84) : result.length > 26 ? 64 : 82;
  const rp = tween(t, resStart, 0.35, ease.expoOut);
  const rs = punchScale(t, resStart, 0.88);
  const absorbed = Math.min(n, Math.max(0, Math.floor((t - 1.55) / 0.14 + 0.5)));

  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, clipPath: wipeTD(funnelP) }}>
        <polygon points={poly} fill="rgba(10,10,10,0.55)" stroke={look.muted} strokeWidth={look.strokeW} strokeLinejoin="round" />
      </svg>

      {inputs.map((s, i) => {
        const a = tween(t, 0.5 + i * 0.12, 0.26, ease.power3Out);
        const ab = tween(t, absStart(i), 0.6, ease.power3In);
        const gx = gateCx - chipW / 2;
        const gy = gateCy - chipH / 2;
        const x = mix(ab, pos[i].x, gx);
        const y = mix(ab, pos[i].y, gy) + (1 - a) * 20;
        const sc = mix(ab, 1, 0.08) * mix(a, 0.8, 1);
        const op = a * (ab > 0.78 ? 1 - (ab - 0.78) / 0.22 : 1);
        if (op <= 0.001) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: chipW,
              height: chipH,
              boxSizing: "border-box",
              padding: "0 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: look.surface,
              borderRadius: look.radius,
              borderLeft: `${look.strokeW}px solid ${look.ink}`,
              opacity: op,
              transform: `scale(${sc})`,
              fontFamily: look.font,
              fontWeight: 600,
              fontSize: isV ? 34 : 30,
              lineHeight: 1.12,
              letterSpacing: look.tracking.body,
              color: look.ink,
            }}
          >
            <span style={{ fontFamily: look.mono, fontSize: 24, color: look.muted }}>{String(i + 1).padStart(2, "0")}</span>
            <span>{s}</span>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: gateCx - gateW / 2,
          top: gateY + (1 - gateP) * -14,
          width: gateW,
          height: gateH,
          background: accentColor,
          borderRadius: look.radius,
          opacity: gateP,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: look.mono,
          fontSize: 34,
          fontWeight: 500,
          color: "#0a0a0a",
        }}
      >
        {absorbed} / {n}
      </div>

      <div
        style={{
          position: "absolute",
          left: look.safeX,
          width: width - look.safeX * 2,
          top: resY,
          textAlign: "center",
          opacity: rp,
          transform: `translateY(${(1 - rp) * 28}px) scale(${rs})`,
          transformOrigin: "50% 0%",
          fontFamily: look.font,
          fontWeight: 800,
          fontSize: resSize,
          lineHeight: 1.06,
          letterSpacing: look.tracking.hero,
          color: look.ink,
        }}
      >
        {result}
      </div>
    </AbsoluteFill>
  );
};
