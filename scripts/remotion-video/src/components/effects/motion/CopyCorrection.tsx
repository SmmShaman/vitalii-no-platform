/**
 * CopyCorrection — ONE reading position. A paper strip carries the wrong claim; a linear strike
 * is drawn through it and an X stamps on; the strip tips off and falls away; the corrected strip
 * lands in the same place and gets the single approval check.
 * data: { "wrong": "old claim", "right": "corrected claim", "label"?: "Faktisk" }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { clip, ease, look, mix, pace, tween } from "./grammar";

const BUILD = 3.15;
const PAPER = "#F5F2EA";
const INK = "#141414";

export function hasCopyCorrectionData(data: Record<string, unknown>): boolean {
  return !!data && clip(data.wrong, 160).length > 0 && clip(data.right, 160).length > 0;
}

const Badge: React.FC<{ size: number; p: number; bg: string; fg: string; kind: "x" | "check" }> = ({ size, p, bg, fg, kind }) => (
  <div
    style={{
      position: "absolute",
      top: -size * 0.43,
      right: -size * 0.29,
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      border: `3px solid ${INK}`,
      boxShadow: `0 0 0 3px ${PAPER}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: p,
      transform: `scale(${mix(p, 0.7, 1)})`,
    }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={4} strokeLinecap="square">
      {kind === "x" ? <path d="M5 5L19 19M19 5L5 19" /> : <path d="M4 13L10 19L20 6" />}
    </svg>
  </div>
);

export const CopyCorrection: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  if (!hasCopyCorrectionData(data)) return null;
  const isVertical = height > width;
  const { t } = pace(frame, fps, durationInFrames, BUILD);

  const wrong = clip(data.wrong, 160);
  const right = clip(data.right, 160);
  const label = clip(data.label, 24);

  const cardW = isVertical ? width - look.safeX * 2 : Math.min(1450, width * 0.76);
  const padX = isVertical ? 48 : 90;
  const longest = Math.max(wrong.length, right.length);
  // two lines allowed: size so the longer claim fits in ~2 lines
  const fs = Math.max(40, Math.min(isVertical ? 60 : 91, ((cardW - padX * 2) * 2) / (longest * 0.55 + 6)));
  const badge = Math.round(fs * 1.1);

  // wrong card
  const inP = tween(t, 0.16, 0.28, ease.power3Out);
  const strikeP = tween(t, 0.9, 0.35, ease.linear);
  const xP = tween(t, 1.18, 0.2, ease.power3Out);
  const disc = tween(t, 2.05, 0.34, ease.power3In);
  // right card
  const arr = tween(t, 2.4, 0.34, ease.power4Out);
  const checkP = tween(t, 2.92, 0.2, ease.power3Out);

  const card: React.CSSProperties = {
    gridArea: "1 / 1",
    position: "relative",
    boxSizing: "border-box",
    padding: `${fs * 0.55}px ${padX}px`,
    background: PAPER,
    border: `2px solid ${INK}`,
    borderRadius: look.radius,
    color: INK,
    fontFamily: look.font,
    fontWeight: 800,
    fontSize: fs,
    lineHeight: 1.05,
    letterSpacing: "-0.05em",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.25)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "grid", width: cardW }}>
        {(
          <div
            style={{
              ...card,
              boxShadow: "12px 14px 0 rgba(0,0,0,0.6)",
              opacity: inP * (1 - disc),
              transformOrigin: "20% 100%",
              transform: `translateY(${mix(inP, 24, 0) + 350 * disc}px) rotate(${10 * disc}deg)`,
            }}
          >
            <span>{wrong}</span>
            <div
              style={{
                position: "absolute",
                left: "8%",
                right: "8%",
                top: "50%",
                height: 6,
                marginTop: -3,
                background: INK,
                transformOrigin: "left center",
                transform: `scaleX(${strikeP})`,
              }}
            />
            <Badge size={badge} p={xP} bg={PAPER} fg={INK} kind="x" />
          </div>
        )}
        {(
          <div
            style={{
              ...card,
              boxShadow: `12px 14px 0 ${accentColor}`,
              opacity: arr,
              transformOrigin: "50% 50%",
              transform: `translateY(${mix(arr, -60, 0)}px) rotate(${mix(arr, -3, 0)}deg)`,
            }}
          >
            {label && (
              <div style={{ fontSize: fs * 0.36, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: fs * 0.12, color: "#8A3F00" }}>
                {label}
              </div>
            )}
            <span>{right}</span>
            <Badge size={badge} p={checkP} bg={accentColor} fg={INK} kind="check" />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
