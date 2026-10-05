/**
 * RegionCallout — the news photo fills a framed plane; everything but one rectangle is dimmed,
 * a slow push-in settles on it, then a leader line draws to a margin note that wipes in.
 * data: { "region": {"x":30,"y":20,"w":35,"h":30}, "note": "...", "label"?: "..." }  (% of the photo)
 * Needs images[0].
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from "remotion";
import { clip, ease, look, mix, pace, tween, wipeLR } from "./grammar";

type Region = { x: number; y: number; w: number; h: number };

function readRegion(data: Record<string, unknown>): Region | null {
  const r: any = data?.region;
  if (!r || typeof r !== "object") return null;
  const x = Number(r.x), y = Number(r.y), w = Number(r.w), h = Number(r.h);
  if (![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) return null;
  const cx = Math.min(Math.max(x, 0), 95), cy = Math.min(Math.max(y, 0), 95);
  return { x: cx, y: cy, w: Math.min(w, 100 - cx), h: Math.min(h, 100 - cy) };
}

export function hasRegionCalloutData(data: Record<string, unknown>): boolean {
  return !!data && !!readRegion(data) && clip(data.note, 70).length > 0;
}

const BUILD = 2.0;

export const RegionCallout: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor, images }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const photo = images?.[0];
  if (!hasRegionCalloutData(data) || !photo) return null;
  const isVertical = height > width;
  const reg = readRegion(data)!;
  const note = clip(data.note, 70);
  const label = clip(data.label, 40);
  const { t } = pace(frame, fps, durationInFrames, BUILD);

  // plane geometry
  const planeW = isVertical ? width - look.safeX * 2 : 1240;
  const planeH = isVertical ? 800 : height - look.safeY - look.safeBottom;
  const planeX = look.safeX;
  const planeY = isVertical ? 140 : look.safeY;
  const noteW = isVertical ? planeW : width - look.safeX - (planeX + planeW + 72);
  const noteX = isVertical ? planeX : planeX + planeW + 72;

  // region in plane px, after the push-in (origin = region centre)
  const S = mix(tween(t, 0.65, 0.7, ease.power3InOut), 1, 1.045);
  const rx = (reg.x / 100) * planeW, ry = (reg.y / 100) * planeH;
  const rw = (reg.w / 100) * planeW, rh = (reg.h / 100) * planeH;
  const ocx = rx + rw / 2, ocy = ry + rh / 2;
  const sx = (v: number) => ocx + (v - ocx) * S;
  const sy = (v: number) => ocy + (v - ocy) * S;

  const focus = tween(t, 0.65, 0.25);
  const winP = tween(t, 0.16, 0.28);

  // note box (estimated height) and leader path in page px
  const noteFs = isVertical ? 40 : 36;
  const noteH = isVertical ? 170 : 230;
  let pts: [number, number][];
  let noteLeft = noteX, noteTop: number;
  if (isVertical) {
    const ax = Math.min(Math.max(planeX + sx(rx + rw / 2) - planeX, planeX + 90), planeX + planeW - 90);
    const bx = planeX + sx(rx + rw / 2);
    const ey = planeY + planeH + 36;
    noteTop = ey + 44;
    pts = [[bx, planeY + sy(ry + rh)], [bx, ey], [ax, ey], [ax, noteTop]];
  } else {
    const ny = Math.min(Math.max(planeY + sy(ry + rh / 2), planeY + noteH / 2 + 30), planeY + planeH - noteH / 2 - 30);
    const ex = planeX + planeW + 36;
    noteTop = ny - noteH / 2;
    pts = [[planeX + sx(rx + rw), planeY + sy(ry + rh / 2)], [ex, planeY + sy(ry + rh / 2)], [ex, ny], [noteX, ny]];
  }
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const leader = tween(t, 1.1, 0.38, ease.linear);
  const noteP = tween(t, 1.45, 0.3, ease.power3Out);
  const labelP = tween(t, 1.7, 0.3, ease.power3Out);

  return (
    <AbsoluteFill style={{ fontFamily: look.font }}>
      <div
        style={{
          position: "absolute",
          left: planeX,
          top: planeY,
          width: planeW,
          height: planeH,
          overflow: "hidden",
          background: look.surface,
          border: `6px solid ${look.ink}`,
          borderRadius: look.radius,
          boxShadow: look.shadowHard,
          opacity: winP,
          boxSizing: "content-box",
          marginLeft: -6,
          marginTop: -6,
        }}
      >
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${ocx}px ${ocy}px`, transform: `scale(${S})` }}>
          <Img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              left: rx,
              top: ry,
              width: rw,
              height: rh,
              border: `3px solid ${accentColor}`,
              borderRadius: look.radius,
              boxShadow: "0 0 0 4000px rgba(0,0,0,0.62)",
              opacity: focus,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke={accentColor} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - leader} strokeLinejoin="miter" />
      </svg>

      {label && (
        <div
          style={{
            position: "absolute",
            left: noteLeft,
            top: noteTop - 44,
            width: noteW,
            color: accentColor,
            fontFamily: look.mono,
            fontSize: 26,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            opacity: labelP,
            transform: `translateY(${(1 - labelP) * 8}px)`,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: noteLeft,
          top: noteTop,
          width: noteW,
          boxSizing: "border-box",
          padding: "22px 28px",
          background: look.surface,
          borderLeft: `4px solid ${accentColor}`,
          borderRadius: look.radius,
          boxShadow: look.shadowHard,
          color: look.ink,
          fontSize: noteFs,
          fontWeight: 650 as number,
          lineHeight: 1.18,
          letterSpacing: look.tracking.body,
          clipPath: wipeLR(noteP),
        }}
      >
        {note}
      </div>
    </AbsoluteFill>
  );
};
