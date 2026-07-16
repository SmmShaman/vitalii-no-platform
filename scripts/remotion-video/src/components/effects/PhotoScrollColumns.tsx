/**
 * PhotoScrollColumns — 2-3 columns of article photos drifting past at different speeds.
 * Wraps remotion-bits' ScrollingColumns for continuous parallax motion, distinct from
 * PhotoCollage's static pop-in layout. Needs 3+ images to look intentional (not sparse).
 * Triggered by "scrolling photos", "photo stream", "image feed", "parallax photos".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ScrollingColumns } from "remotion-bits";
import { clampBoth } from "../../design-system";

interface PhotoScrollColumnsProps {
  images: string[];
}

export const PhotoScrollColumns: React.FC<PhotoScrollColumnsProps> = ({ images }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, height } = useVideoConfig();

  if (images.length < 3) return null;

  const fadeIn = interpolate(frame, [0, 15], [0, 1], clampBoth);
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], clampBoth);

  const columnCount = images.length >= 6 ? 3 : 2;
  const columns = Array.from({ length: columnCount }, (_, i) => ({
    images: images.filter((_, idx) => idx % columnCount === i),
    speed: 0.4 + i * 0.25,
    direction: (i % 2 === 0 ? "up" : "down") as "up" | "down",
  }));

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <ScrollingColumns
        columns={columns}
        height={height}
        gap={16}
        columnGap={16}
        imageStyle={{ borderRadius: 10, objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
