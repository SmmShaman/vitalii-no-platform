import React from "react";
import { AbsoluteFill, Composition, registerRoot } from "remotion";
import { MOTION_EFFECTS, type MotionEffectType } from "./components/effects/motion";
import samples from "../../video-processor/skills/digest-motion/effects.json";

const Preview: React.FC<{ effect: string }> = ({ effect }) => {
  const e = (samples as any).effects.find((x: any) => x.name === effect);
  const { Component } = MOTION_EFFECTS[effect as MotionEffectType];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2430,#0a0a0a)" }}>
      <Component data={e.example} accentColor="#FF7A00" />
    </AbsoluteFill>
  );
};
const Root: React.FC = () => (
  <>
    {Object.keys(MOTION_EFFECTS).map((k) => (
      <Composition key={k} id={`mp-${k}`} component={Preview as any} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ effect: k }} />
    ))}
  </>
);
registerRoot(Root);
