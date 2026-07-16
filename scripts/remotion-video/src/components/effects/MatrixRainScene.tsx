/**
 * MatrixRainScene — digital rain overlay for tech/AI/data/cyber stories.
 * Wraps remotion-bits' MatrixRain, tinted to the segment's accentColor with fade in/out.
 * Triggered by "matrix", "digital rain", "code rain", "cyber", "hacking" in sceneDescription.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MatrixRain } from "remotion-bits";
import { clampBoth } from "../../design-system";

interface MatrixRainSceneProps {
  accentColor?: string;
}

export const MatrixRainScene: React.FC<MatrixRainSceneProps> = ({
  accentColor = "#00FF9C",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], clampBoth);
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], clampBoth);

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut * 0.55, pointerEvents: "none" }}>
      <MatrixRain color={accentColor} fontSize={22} density={0.85} speed={1.1} />
    </AbsoluteFill>
  );
};
