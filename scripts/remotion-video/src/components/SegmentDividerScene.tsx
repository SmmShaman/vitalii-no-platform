/**
 * SegmentDividerScene — a 1.5 s chapter stamp before each story.
 *
 * Was 3.5 s of black with a big number (31 s of dead air over a 9-story show,
 * flagged by the owner 2026-10-05). Now the story's own photo is already on
 * screen with a slow push-in, and the number + category land on it as a stamp.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../design-system";
import { categoryLabel, ease, look, mix, punchScale, tween, wipeLR } from "./effects/motion/grammar";

export interface SegmentDividerSceneProps {
  segmentNumber: number;
  totalSegments: number;
  category?: string;
  accentColor?: string;
  /** The story's first photo, shown behind the stamp */
  imageSrc?: string;
}

export const SegmentDividerScene: React.FC<SegmentDividerSceneProps> = ({
  segmentNumber,
  totalSegments,
  category,
  accentColor = colors.brand,
  imageSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const total = durationInFrames / fps;
  const isV = height > width;

  const push = mix(tween(t, 0, total, ease.linear), 1.02, 1.08);
  const s = punchScale(t, 0.08, 0.75, 1.04, 0.22, 0.16);
  const kick = tween(t, 0.3, 0.28, ease.expoOut);
  const bar = tween(t, 0.2, 0.6, ease.power2Out);
  const src = imageSrc ? (imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)) : "";
  const num = String(segmentNumber).padStart(2, "0");

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, overflow: "hidden" }}>
      {src && (
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})` }} />
      )}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: `0 ${look.safeX}px ${isV ? 360 : look.safeBottom}px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
          <div
            style={{
              fontFamily: look.font,
              fontWeight: 850,
              fontSize: isV ? 220 : 240,
              lineHeight: 0.82,
              color: accentColor,
              letterSpacing: look.tracking.hero,
              transform: `scale(${s})`,
              transformOrigin: "0% 100%",
              opacity: t < 0.08 ? 0 : 1,
            }}
          >
            {num}
          </div>
          <div style={{ paddingBottom: 12, clipPath: wipeLR(kick) }}>
            <div style={{ fontFamily: look.mono, fontSize: 30, color: look.muted }}>
              {`/ ${String(totalSegments).padStart(2, "0")}`}
            </div>
            {category && (
              <div style={{ fontFamily: look.font, fontWeight: 700, fontSize: 48, color: look.ink, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {categoryLabel(category)}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 28, height: 6, width: "100%", background: "rgba(255,255,255,0.18)" }}>
          <div style={{ height: "100%", width: `${(segmentNumber / totalSegments) * 100 * bar}%`, background: accentColor }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
