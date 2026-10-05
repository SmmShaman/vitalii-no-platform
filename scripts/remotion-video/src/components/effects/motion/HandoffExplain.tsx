/**
 * HandoffExplain — "was X, now Y": the old state lands, a line is drawn to the new state (the one hero),
 * one decisive camera move hands the lead position to the new state, then 2–4 numbered points open beside it.
 * data: { from: string, to: string, points: string[] (2-4) }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clip, ease, look, mix, pace, punchScale, tween } from "./grammar";

const BUILD = 4.3;

function parse(data: Record<string, unknown>) {
  const from = clip(data?.from, 40);
  const to = clip(data?.to, 40);
  const raw = Array.isArray(data?.points) ? (data.points as unknown[]) : [];
  const points = raw.map((p) => clip(p, 56)).filter((p) => p.length > 0).slice(0, 4);
  return { from, to, points };
}

export function hasHandoffExplainData(data: Record<string, unknown>): boolean {
  if (!data) return false;
  const p = parse(data);
  return p.from.length > 0 && p.to.length > 0 && p.points.length >= 2;
}

export const HandoffExplain: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const { from, to, points } = parse(data);
  if (!from || !to || points.length < 2) return null;
  const { t } = pace(frame, fps, durationInFrames, BUILD);
  const isV = height > width;

  // geometry (world coordinates == screen coordinates before the camera move)
  const pw = isV ? width - look.safeX * 2 : 620;
  const ph = isV ? 340 : 480;
  const gap = isV ? 170 : 200;
  const oldX = look.safeX;
  const oldY = isV ? 150 : (height - ph) / 2;
  const newX = isV ? look.safeX : oldX + pw + gap;
  const newY = isV ? oldY + ph + gap : oldY;
  const shiftX = isV ? 0 : -(newX - oldX);
  const shiftY = isV ? -(newY - oldY) : 0;
  const cam = tween(t, 2.05, 0.75, ease.power3InOut);
  const camX = mix(cam, 0, shiftX);
  const camY = mix(cam, 0, shiftY);

  // old state
  const oldP = tween(t, 0.16, 0.32, ease.power3Out);
  // line between the states (linear draw)
  const lineP = tween(t, 0.62, 0.52, ease.linear);
  // new state (hero)
  const newScale = punchScale(t, 1.08);
  const newVis = t >= 1.08 ? 1 : 0;

  const ax1 = isV ? width / 2 : oldX + pw + 24;
  const ay1 = isV ? oldY + ph + 24 : oldY + ph / 2;
  const ax2 = isV ? width / 2 : newX - 24;
  const ay2 = isV ? newY - 24 : newY + ph / 2;
  const hs = 18;
  const arrowPath = isV
    ? `M${ax1} ${ay1} L${ax2} ${ay2} M${ax2 - hs} ${ay2 - hs} L${ax2} ${ay2} L${ax2 + hs} ${ay2 - hs}`
    : `M${ax1} ${ay1} L${ax2} ${ay2} M${ax2 - hs} ${ay2 - hs} L${ax2} ${ay2} L${ax2 - hs} ${ay2 + hs}`;

  const titleSize = (s: string) => (isV ? (s.length > 22 ? 56 : 68) : s.length > 22 ? 50 : 62);

  // points block, world coordinates beside / below the new state
  const ptX = isV ? look.safeX : newX + pw + 72;
  const ptY = isV ? newY + ph + 56 : newY;
  // width in SCREEN space: after the camera move the new state sits at oldX
  const ptW = isV ? width - look.safeX * 2 : width - look.safeX - (oldX + pw + 72);
  const rowH = isV ? 190 : Math.min(150, ph / points.length);

  const paper = (label: string, text: string, isNew: boolean, x: number, y: number, scale: number, op: number, dx: number) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: pw,
        height: ph,
        boxSizing: "border-box",
        padding: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: isNew ? accentColor : look.surface,
        color: isNew ? "#0a0a0a" : look.ink,
        borderRadius: look.radius,
        boxShadow: look.shadowHard,
        opacity: op,
        transform: `translateX(${dx}px) scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      <div style={{ fontFamily: look.mono, fontSize: 26, letterSpacing: "0.08em", opacity: 0.7 }}>{label}</div>
      <div
        style={{
          fontFamily: look.font,
          fontWeight: isNew ? 800 : 700,
          fontSize: titleSize(text),
          lineHeight: 1.08,
          letterSpacing: look.tracking.head,
          textDecoration: isNew ? "none" : "none",
          opacity: isNew ? 1 : 0.9,
          overflowWrap: "anywhere",
        }}
      >
        {text}
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${camX}px, ${camY}px)` }}>
        {paper("FØR", from, false, oldX, oldY, 1, oldP, (1 - oldP) * -25)}
        <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path
            d={arrowPath}
            fill="none"
            stroke={look.ink}
            strokeWidth={look.strokeW}
            strokeLinecap="square"
            strokeLinejoin="miter"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - lineP}
            opacity={lineP > 0 ? 1 : 0}
          />
        </svg>
        {paper("NÅ", to, true, newX, newY, newScale, newVis, 0)}
        {points.map((p, i) => {
          const s = 2.95 + i * 0.34;
          const a = tween(t, s, 0.32, ease.power3Out);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: ptX,
                top: ptY + i * rowH,
                width: ptW,
                height: rowH,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: 28,
                borderBottom: `${look.ruleW}px solid ${look.rule}`,
                opacity: a,
                transform: `translateX(${(1 - a) * 35}px)`,
              }}
            >
              <div style={{ fontFamily: look.mono, fontSize: 28, color: accentColor, minWidth: 44 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: look.font,
                  fontWeight: 600,
                  fontSize: isV ? 42 : 40,
                  lineHeight: 1.14,
                  letterSpacing: look.tracking.body,
                  color: look.ink,
                  textShadow: "none",
                }}
              >
                {p}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
