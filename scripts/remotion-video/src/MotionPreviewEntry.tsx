import React from "react";
import { AbsoluteFill, Composition, Img, registerRoot, staticFile } from "remotion";
import { MOTION_EFFECTS, type MotionEffectType } from "./components/effects/motion";
import samples from "../../video-processor/skills/digest-motion/effects.json";

/**
 * Dev preview for the digest-motion effects: every effect from effects.json with its
 * example data, at 3 s and 5 s, over a dimmed photo like in the real scene.
 * Usage: npx remotion still src/MotionPreviewEntry.tsx mp-<effect>-90 out.png --frame=N
 * (put any JPG at public/_prev_photo.jpg; it is not committed).
 */
const Preview: React.FC<{ effect: string }> = ({ effect }) => {
  const e = (samples as any).effects.find((x: any) => x.name === effect);
  const { Component } = MOTION_EFFECTS[effect as MotionEffectType];
  const photo = staticFile("_prev_photo.jpg");
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <Img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
      <Component data={e.example} accentColor="#FF7A00" images={[photo]} />
    </AbsoluteFill>
  );
};
const Root: React.FC = () => (
  <>
    {Object.keys(MOTION_EFFECTS).flatMap((k) =>
      [90, 150].map((d) => (
        <Composition key={`${k}-${d}`} id={`mp-${k}-${d}`} component={Preview as any} durationInFrames={d} fps={30} width={1920} height={1080} defaultProps={{ effect: k }} />
      )),
    )}
  </>
);
registerRoot(Root);
