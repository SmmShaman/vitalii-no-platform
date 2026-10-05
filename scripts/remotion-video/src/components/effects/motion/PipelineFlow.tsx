/**
 * PipelineFlow — stage cards appear one by one (left→right, top→bottom in 9:16) joined by drawn arrows;
 * then a dashed rounded box draws around the chain and the optional result card lands beyond it in accent.
 * data: { steps: string[] (3-5), result?: string }
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Easing } from "remotion";
import { colors, glass, typography, clampBoth } from "../../../design-system";

const trunc = (s: unknown, n = 28) => {
  const t = String(s ?? "").trim();
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
};

function parseSteps(data: Record<string, unknown>): string[] {
  const raw = Array.isArray(data?.steps) ? (data.steps as unknown[]) : [];
  return raw.map((s) => trunc(s)).filter((s) => s.length > 0).slice(0, 5);
}

export function hasPipelineFlowData(data: Record<string, unknown>): boolean {
  return !!data && parseSteps(data).length >= 3;
}

export const PipelineFlow: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const steps = parseSteps(data);
  if (steps.length < 3) return null;

  const isVertical = height > width;
  const d = Math.max(durationInFrames, 30);
  const n = steps.length;
  const result = data.result ? trunc(data.result) : "";
  const hasResult = result.length > 0;

  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clampBoth);
  const at = (a: number, b: number) =>
    interpolate(frame, [a * d, Math.max(b * d, a * d + 0.01)], [0, 1], clampBoth);

  // geometry
  const arrow = isVertical ? 70 : 76;
  const pad = 36;
  const resGap = isVertical ? 70 : 80;
  let cw: number;
  let ch: number;
  let rw: number;
  let rh: number;
  if (isVertical) {
    cw = width * 0.7;
    ch = 110;
    rw = width * 0.7;
    rh = 130;
  } else {
    rw = hasResult ? 270 : 0;
    rh = 150;
    const avail = width * 0.93 - (hasResult ? rw + resGap : 0) - pad * 2;
    cw = Math.min(280, (avail - (n - 1) * arrow) / n);
    ch = 150;
  }
  const chainW = isVertical ? cw : n * cw + (n - 1) * arrow;
  const chainH = isVertical ? n * ch + (n - 1) * arrow : ch;
  const boxW = chainW + pad * 2;
  const boxH = chainH + pad * 2;
  const totalW = isVertical ? boxW : boxW + (hasResult ? resGap + rw : 0);
  const totalH = isVertical ? boxH + (hasResult ? resGap + rh : 0) : boxH;
  const ox = (width - totalW) / 2;
  const oy = (height - totalH) / 2;
  const bx = ox;
  const by = oy;
  const cx0 = bx + pad;
  const cy0 = by + pad;

  const cardPos = steps.map((_, i) => ({
    x: isVertical ? cx0 : cx0 + i * (cw + arrow),
    y: isVertical ? cy0 + i * (ch + arrow) : cy0,
  }));

  // timings
  const step = 0.36 / n;
  const cardT = (i: number) => 0.04 + i * step;
  const boxP = Easing.inOut(Easing.cubic)(at(0.42, 0.54));
  const resP = spring({ frame: Math.max(0, frame - 0.54 * d), fps, config: { damping: 16, stiffness: 110 } });

  const rx = isVertical ? bx + (boxW - rw) / 2 : bx + boxW + resGap;
  const ry = isVertical ? by + boxH + resGap : by + (boxH - rh) / 2;

  const rectR = 34;
  const arrowLines: React.ReactNode[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p = Easing.out(Easing.cubic)(at(cardT(i) + step * 0.6, cardT(i) + step * 1.3));
    const a = cardPos[i];
    const x1 = isVertical ? a.x + cw / 2 : a.x + cw + 8;
    const y1 = isVertical ? a.y + ch + 8 : a.y + ch / 2;
    const x2 = isVertical ? x1 : x1 + arrow - 16;
    const y2 = isVertical ? y1 + arrow - 16 : y1;
    const ex = x1 + (x2 - x1) * p;
    const ey = y1 + (y2 - y1) * p;
    const hs = 12;
    const head = isVertical
      ? `${ex - hs},${ey - hs} ${ex},${ey} ${ex + hs},${ey - hs}`
      : `${ex - hs},${ey - hs} ${ex},${ey} ${ex - hs},${ey + hs}`;
    arrowLines.push(
      <g key={i} opacity={p > 0 ? 1 : 0}>
        <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={colors.textMuted} strokeWidth={4} strokeLinecap="round" />
        <polyline points={head} fill="none" stroke={colors.textMuted} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      </g>,
    );
  }

  const maskId = "pipeflow-box-mask";
  const fontSize = isVertical ? 36 : Math.max(22, Math.min(32, cw / 8.5));

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))" }} />
      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <mask id={maskId}>
            <rect
              x={bx}
              y={by}
              width={boxW}
              height={boxH}
              rx={rectR}
              fill="none"
              stroke="#fff"
              strokeWidth={14}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - boxP}
            />
          </mask>
        </defs>
        {arrowLines}
        <rect
          x={bx}
          y={by}
          width={boxW}
          height={boxH}
          rx={rectR}
          fill="none"
          stroke={colors.textMuted}
          strokeWidth={3}
          strokeDasharray="16 12"
          mask={`url(#${maskId})`}
        />
        {hasResult && (
          <line
            x1={isVertical ? bx + boxW / 2 : bx + boxW}
            y1={isVertical ? by + boxH : by + boxH / 2}
            x2={isVertical ? bx + boxW / 2 : bx + boxW + (resGap - 14) * resP}
            y2={isVertical ? by + boxH + (resGap - 14) * resP : by + boxH / 2}
            stroke={accentColor}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={resP > 0.01 ? 1 : 0}
          />
        )}
      </svg>

      {steps.map((s, i) => {
        const sp = spring({ frame: Math.max(0, frame - cardT(i) * d), fps, config: { damping: 16, stiffness: 110 } });
        const vis = frame >= cardT(i) * d ? 1 : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cardPos[i].x,
              top: cardPos[i].y,
              width: cw,
              height: ch,
              boxSizing: "border-box",
              background: glass.backgroundStrong,
              border: `1px solid ${glass.borderStrong}`,
              borderRadius: glass.borderRadiusLarge,
              backdropFilter: `blur(${glass.blur}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              textAlign: "center",
              opacity: vis * Math.min(1, sp),
              transform: `translateY(${(1 - Math.min(1, sp)) * 30}px)`,
            }}
          >
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: 24,
                color: accentColor,
                marginBottom: 6,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontFamily: typography.fontFamily.primary,
                fontWeight: 700,
                fontSize,
                color: colors.text,
                lineHeight: 1.15,
                wordBreak: "break-word",
              }}
            >
              {s}
            </div>
          </div>
        );
      })}

      {hasResult && (
        <div
          style={{
            position: "absolute",
            left: rx,
            top: ry,
            width: rw,
            height: rh,
            boxSizing: "border-box",
            background: accentColor,
            borderRadius: glass.borderRadiusLarge,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 18px",
            textAlign: "center",
            fontFamily: typography.fontFamily.primary,
            fontWeight: 800,
            fontSize: isVertical ? 40 : 32,
            color: "#0a0a0a",
            lineHeight: 1.15,
            wordBreak: "break-word",
            opacity: Math.min(1, resP),
            transform: `scale(${0.85 + 0.15 * Math.min(1, resP)})`,
          }}
        >
          {result}
        </div>
      )}
    </AbsoluteFill>
  );
};
