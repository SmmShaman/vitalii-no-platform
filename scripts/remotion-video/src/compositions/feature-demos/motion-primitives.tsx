/**
 * motion-primitives — the digest's editorial motion inside a feature clip (2026-10-07).
 *
 * The daily digest got a motion grammar and 23 editorial effects on 2026-10-05
 * (components/effects/motion, skill digest-motion). The owner judged it "much
 * better" and asked for the same direction in the feature clips. This file is
 * the bridge, so a clip uses the SAME effects and the SAME grammar instead of
 * re-inventing fades per clip:
 *
 * - <MotionInsert> plays one digest effect for one voice beat. The effect is
 *   authored for a 1920×1080 stage; here it renders in a scaled 1920×1080 box
 *   and gets the beat length through MotionStageContext, so its own timeline
 *   (absolute-second beats, reading hold at the end) fits the beat window.
 *   It sits on a dark plate over whatever is behind it — usually the real
 *   product (<LiveBackdrop>), the way the digest puts effects over the photo.
 * - <LiveBackdrop> is a recording from shots/<id>.json, full-bleed, as the
 *   evidence layer under an effect.
 * - <Arrive> moves the clip's own bright pieces by the grammar: punch+settle,
 *   left→right wipe or a short rise — never a 9-frame opacity fade.
 * - cut(frame, start, next) is the beat visibility rule: on from the beat's
 *   first frame, off at the next beat's first frame. No exit fade.
 *
 * Effect data comes only from the feature row (problem / solution / result,
 * commits). The skill feature-motion (scripts/remotion-video/skills) says which
 * effect a sentence gets.
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { MOTION_EFFECTS, type MotionEffectType } from "../../components/effects/motion";
import {
  MotionStageContext,
  setMotionLocale,
  punchScale,
  tween,
  ease,
  mix,
} from "../../components/effects/motion/grammar";
import { LiveShot, type ShotsFile } from "./live-primitives";

const STAGE_W = 1920;
const STAGE_H = 1080;
/** Owner rule from the digest: white text never sits bare on a picture. */
export const PLATE = 0.66;

/** Beat visibility: 1 inside [start, next), else 0 — the cut to the next beat is the exit. */
export const cut = (frame: number, start: number, next: number) => (frame >= start && frame < next ? 1 : 0);

export const MotionInsert: React.FC<{
  effect: MotionEffectType;
  data: Record<string, unknown>;
  /** first frame of the beat */
  from: number;
  /** frames until the next beat starts (the effect holds through the gap) */
  dur: number;
  accent: string;
  /** dark plate over the backdrop, 0..1 */
  plate?: number;
  /** solid colour under the plate when nothing is behind the insert */
  base?: string;
  images?: string[];
}> = ({ effect, data, from, dur, accent, plate = PLATE, base, images }) => {
  const { width } = useVideoConfig();
  const entry = MOTION_EFFECTS[effect];
  // A feature clip is written by hand: missing data is a bug, not a quiet skip.
  if (!entry.hasData(data)) throw new Error(`MotionInsert: "${effect}" got no usable data`);
  // Feature clips are English; the digest's own host keeps "nb-NO".
  setMotionLocale("en-US");
  const s = width / STAGE_W;
  const Component = entry.Component;
  return (
    <Sequence from={from} durationInFrames={dur} layout="none">
      <AbsoluteFill style={{ background: base }}>
        <AbsoluteFill style={{ background: `rgba(8,8,8,${plate})` }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${s})`,
            transformOrigin: "0 0",
          }}
        >
          <MotionStageContext.Provider value={{ width: STAGE_W, height: STAGE_H, durationInFrames: dur }}>
            <Component data={data} accentColor={accent} images={images} />
          </MotionStageContext.Provider>
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

/**
 * A recording from shots/<id>.json filling the whole 1280×720 frame (cover fit),
 * with a slow push-in — the evidence layer under a MotionInsert.
 */
export const LiveBackdrop: React.FC<{
  file: ShotsFile;
  shot: string;
  from: number;
  hold: number;
  /** extra push-in over the recording, 0..0.15 */
  push?: number;
  focus?: { x: number; y: number };
}> = ({ file, shot, from, hold, push = 0.06, focus = { x: 0.5, y: 0.35 } }) => {
  const { width, height } = useVideoConfig();
  const recW = Math.floor((file.viewport.width * file.dsf) / 2) * 2;
  const recH = Math.floor((file.viewport.height * file.dsf) / 2) * 2;
  // LiveShot scales the recording to the window width; cover the height too.
  const cover = Math.max(1, height / recH / (width / recW));
  return (
    <LiveShot
      file={file}
      shot={shot}
      from={from}
      hold={hold}
      zoom={(t) => cover * (1 + push * t)}
      focus={focus}
      opacity={1}
      win={{ x: 0, y: -42, w: width, h: height + 42 }}
    />
  );
};

/**
 * The grammar for the clip's own pieces. `box` is where the child sits in the
 * 1280×720 frame (needed for the wipe and the punch origin).
 * - punch: 67 % → 103.5 % expo.out, settles to 100 % (the hero object)
 * - wipe: left→right clip reveal (text, labels)
 * - rise: 18 px up with power3.out (secondary pieces)
 */
export const Arrive: React.FC<{
  at: number;
  kind?: "punch" | "wipe" | "rise";
  box: { x: number; y: number; w: number; h: number };
  dur?: number;
  children: React.ReactNode;
}> = ({ at, kind = "rise", box, dur, children }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  if (frame < at) return null;
  const t = (frame - at) / fps;
  let style: React.CSSProperties = {};
  if (kind === "punch") {
    const sc = punchScale(t, 0);
    style = {
      transform: `scale(${sc})`,
      transformOrigin: `${box.x + box.w / 2}px ${box.y + box.h / 2}px`,
      opacity: tween(t, 0, 0.08, ease.linear),
    };
  } else if (kind === "wipe") {
    const p = tween(t, 0, dur ?? 0.35, ease.power3Out);
    const right = width - (box.x + box.w * p);
    style = { clipPath: `inset(${box.y}px ${right}px ${height - (box.y + box.h)}px ${box.x}px)` };
  } else {
    const p = tween(t, 0, dur ?? 0.3, ease.power3Out);
    style = { transform: `translateY(${mix(p, 18, 0)}px)`, opacity: p };
  }
  return <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
};
