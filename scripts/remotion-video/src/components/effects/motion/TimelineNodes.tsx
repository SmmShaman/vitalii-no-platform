/**
 * TimelineNodes — one track, 3–5 dated milestones that land one at a time (dot, big date, label);
 * the active milestone is established last, as a state change to accent.
 * data: { nodes: [{ date: string, label: string }] (3-5), activeIndex?: number }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clip, ease, look, mix, pace, tween, useMotionConfig } from "./grammar";

type Node = { date: string; label: string };
const BUILD = 4.6;

function parse(data: Record<string, unknown>): Node[] {
  const raw = Array.isArray(data?.nodes) ? (data.nodes as unknown[]) : [];
  return raw
    .map((n) => {
      const o = (n ?? {}) as Record<string, unknown>;
      return { date: clip(o.date, 10), label: clip(o.label, 44) };
    })
    .filter((n) => n.date.length > 0)
    .slice(0, 5);
}

export function hasTimelineNodesData(data: Record<string, unknown>): boolean {
  return !!data && parse(data).length >= 3;
}

export const TimelineNodes: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useMotionConfig();
  const nodes = parse(data);
  if (nodes.length < 3) return null;
  const n = nodes.length;
  const { t } = pace(frame, fps, durationInFrames, BUILD);
  const isV = height > width;

  const ai = typeof data.activeIndex === "number" && data.activeIndex >= 0 && data.activeIndex < n ? Math.floor(data.activeIndex) : n - 1;
  const pitch = 0.6;
  const nodeStart = (i: number) => 0.55 + i * pitch;
  const activeStart = nodeStart(n - 1) + 0.55 + 0.35;
  const act = tween(t, activeStart, 0.3, ease.power2Out);
  const ruleP = tween(t, 0.16, 0.75, ease.linear);

  const spanX = width - look.safeX * 2;
  const colW = spanX / n;
  const maxLen = Math.max(...nodes.map((x) => x.date.length));
  const dateSize = isV ? 110 : Math.max(64, Math.min(130, Math.floor((colW * 0.92) / (maxLen * 0.6))));
  const labelSize = isV ? 40 : 36;

  const trackY = height / 2 + (isV ? 0 : 20);
  const trackX = look.safeX + 50;
  const rowH = (height - look.safeY * 2 - 80) / n;

  const items = nodes.map((nd, i) => {
    const s = nodeStart(i);
    const dot = tween(t, s, 0.22, ease.power3Out);
    const date = tween(t, s + 0.1, 0.3, ease.power3Out);
    const lab = tween(t, s + 0.28, 0.25, ease.power3Out);
    const isA = i === ai;
    const dim = isA ? 1 : mix(act, 1, 0.55);
    const dotSize = isA ? mix(act, 28, 44) : 28;
    const cx = look.safeX + colW / 2 + i * colW;
    const cy = look.safeY + 40 + rowH * i + rowH / 2;
    const stack = (txt: string, extra: React.CSSProperties) => (
      <div style={{ display: "grid", ...extra }}>
        <div style={{ gridArea: "1/1", color: look.ink, opacity: 1 - (isA ? act : 0) }}>{txt}</div>
        <div style={{ gridArea: "1/1", color: accentColor, opacity: isA ? act : 0 }}>{txt}</div>
      </div>
    );
    const dateEl = stack(nd.date, {
      fontFamily: look.font,
      fontWeight: 800,
      fontSize: dateSize,
      letterSpacing: look.tracking.hero,
      lineHeight: 1,
      whiteSpace: "nowrap",
    });
    const labEl = (
      <div
        style={{
          fontFamily: look.font,
          fontWeight: 500,
          fontSize: labelSize,
          lineHeight: 1.18,
          letterSpacing: look.tracking.body,
          color: look.ink,
          opacity: lab * (isA ? 1 : mix(act, 1, 0.7)),
          transform: `translateY(${(1 - lab) * 15}px)`,
        }}
      >
        {nd.label}
      </div>
    );
    const dotEl = (x: number, y: number) => (
      <div
        style={{
          position: "absolute",
          left: x - dotSize / 2,
          top: y - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: isA && act > 0.5 ? accentColor : look.ink,
          border: `${look.ruleW + 2}px solid #0a0a0a`,
          boxSizing: "border-box",
          transform: `scale(${mix(dot, 0.2, 1)})`,
          opacity: dot,
        }}
      />
    );
    if (isV) {
      return (
        <React.Fragment key={i}>
          {dotEl(trackX, cy)}
          <div
            style={{
              position: "absolute",
              left: trackX + 70,
              top: cy - rowH / 2 + 6,
              width: width - look.safeX - (trackX + 70),
              opacity: dim,
            }}
          >
            <div style={{ opacity: date, transform: `translateY(${(1 - date) * 25}px)` }}>{dateEl}</div>
            <div style={{ marginTop: 10 }}>{labEl}</div>
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment key={i}>
        {dotEl(cx, trackY)}
        <div
          style={{
            position: "absolute",
            left: cx - colW / 2 + 8,
            width: colW - 16,
            top: trackY - 60 - dateSize,
            height: dateSize,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            opacity: date * dim,
            transform: `translateY(${(1 - date) * 25}px)`,
          }}
        >
          {dateEl}
        </div>
        <div style={{ position: "absolute", left: cx - colW / 2 + 12, width: colW - 24, top: trackY + 54, textAlign: "center", opacity: dim }}>
          {labEl}
        </div>
      </React.Fragment>
    );
  });

  return (
    <AbsoluteFill>
      {isV ? (
        <div
          style={{
            position: "absolute",
            left: trackX - look.strokeW / 2,
            top: look.safeY + 40,
            width: look.strokeW,
            height: rowH * n,
            background: look.ink,
            transformOrigin: "top",
            transform: `scaleY(${ruleP})`,
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            left: look.safeX,
            top: trackY - look.strokeW / 2,
            width: spanX,
            height: look.strokeW,
            background: look.ink,
            transformOrigin: "left",
            transform: `scaleX(${ruleP})`,
          }}
        />
      )}
      {items}
    </AbsoluteFill>
  );
};
