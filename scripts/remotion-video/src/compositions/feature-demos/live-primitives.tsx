/**
 * live-primitives — the real product inside a bright v2 clip (owner rule, 2026-09-06).
 *
 * A UI beat no longer shows a drawn mockup: it shows a recording of the live
 * page, made by tools/record-ui.cjs from the SAME shot spec this file reads.
 * The spec lives in `shots/<feature id>.json`; the recorder turns it into
 * `public/rec/<id>-<shot>.mp4` (on the GitHub runner, before the render) and
 * <LiveShot> plays that file inside a BrowserWindow with a camera move and a
 * drawn cursor that sits exactly where the recorder's mouse was.
 *
 * The keyframe interpolation here MUST stay identical to record-ui.cjs.
 */
import React from "react";
import { Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrowserWindow, Cursor, seg } from "./bright-primitives";

export type ShotSpec = {
  /** [a-z0-9-], used in file names */
  name: string;
  url: string;
  /** frames recorded at 30 fps */
  frames: number;
  /** [[frame, scrollY], ...] eased between keys */
  scroll: number[][];
  /** [[frame, x, y], ...] in CSS px of the recorder viewport */
  mouse: number[][];
  /** frames at which the recorder really clicked at the mouse position */
  clicks?: number[];
  hide?: string[];
};

export type ShotsFile = {
  id: string;
  viewport: { width: number; height: number };
  dsf: number;
  hide?: string[];
  shots: ShotSpec[];
};

export type Win = { x: number; y: number; w: number; h: number };

/** The window most clips use: leaves the top 190 px to the hero number and pills. */
export const WIN_DEFAULT: Win = { x: 150, y: 196, w: 980, h: 450 };
export const WIN_BAR = 42;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

export function track(kfs: number[][], f: number): number[] {
  if (!kfs.length) return [];
  if (f <= kfs[0][0]) return kfs[0].slice(1);
  const last = kfs[kfs.length - 1];
  if (f >= last[0]) return last.slice(1);
  for (let i = 1; i < kfs.length; i++) {
    const a = kfs[i - 1];
    const b = kfs[i];
    if (f <= b[0]) {
      const t = easeInOut((f - a[0]) / (b[0] - a[0]));
      return a.slice(1).map((v, k) => v + (b[k + 1] - v) * t);
    }
  }
  return last.slice(1);
}

/** Encoded frame size: device pixels, cropped to even numbers by encode-rec.sh. */
export const recSize = (file: ShotsFile) => ({
  w: Math.floor((file.viewport.width * file.dsf) / 2) * 2,
  h: Math.floor((file.viewport.height * file.dsf) / 2) * 2,
});

/**
 * One recording, played inside the window's inner area from clip frame
 * `from`. After `frames` the last frame is FROZEN until `hold` frames have
 * passed — never looped: a repeated picture under new words is a defect.
 *
 * `zoom(t)` (t = 0..1 over the recording) and `focus` (0..1 of the inner
 * area) are the camera: the picture is scaled around the focus point.
 */
export const LiveShot: React.FC<{
  file: ShotsFile;
  shot: string;
  from: number;
  hold?: number;
  zoom?: (t: number) => number;
  focus?: { x: number; y: number };
  opacity: number;
  win?: Win;
}> = ({ file, shot, from, hold, zoom = () => 1, focus = { x: 0.5, y: 0.5 }, opacity, win = WIN_DEFAULT }) => {
  const frame = useCurrentFrame();
  const spec = file.shots.find((s) => s.name === shot);
  if (!spec) throw new Error(`LiveShot: no shot "${shot}" in shots/${file.id}.json`);
  const frames = spec.frames;
  const span = hold ?? frames;
  const local = frame - from;
  if (local < 0 || local >= span || opacity <= 0.004) return null;

  const { w: REC_W, h: REC_H } = recSize(file);
  const innerH = win.h - WIN_BAR;
  const base = win.w / REC_W;
  const t = clamp01(local / (frames - 1));
  const s = base * zoom(t);
  const tx = focus.x * win.w - focus.x * REC_W * s;
  const ty = focus.y * innerH - focus.y * REC_H * s;
  const videoStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: REC_W,
    height: REC_H,
    transform: `translate(${tx}px, ${ty}px) scale(${s})`,
    transformOrigin: "0 0",
  };
  const src = staticFile(`rec/${file.id}-${spec.name}.mp4`);
  const rf = Math.min(local, frames - 1);
  const [mx, my] = track(spec.mouse, rf);
  const cx = mx * file.dsf * s + tx;
  const cy = my * file.dsf * s + ty;
  const click = (spec.clicks ?? []).reduce(
    (acc, c) => Math.max(acc, rf >= c && rf < c + 16 ? seg(rf, c, c + 16) : 0),
    0
  );

  return (
    <div
      style={{
        position: "absolute",
        left: win.x,
        top: win.y + WIN_BAR,
        width: win.w,
        height: innerH,
        overflow: "hidden",
        borderRadius: "0 0 14px 14px",
        opacity,
        background: "#fff",
      }}
    >
      <Sequence from={from} durationInFrames={span} layout="none">
        {local < frames ? (
          <OffthreadVideo src={src} muted style={videoStyle} />
        ) : (
          <Freeze frame={frames - 1}>
            <OffthreadVideo src={src} muted style={videoStyle} />
          </Freeze>
        )}
      </Sequence>
      <Cursor x={cx} y={cy} click={click} />
    </div>
  );
};

/** BrowserWindow + LiveShot in one: the usual way a UI beat is staged. */
export const LiveWindow: React.FC<{
  file: ShotsFile;
  shot: string;
  title: string;
  from: number;
  hold?: number;
  zoom?: (t: number) => number;
  focus?: { x: number; y: number };
  opacity: number;
  win?: Win;
}> = ({ title, win = WIN_DEFAULT, ...rest }) => (
  <>
    <BrowserWindow x={win.x} y={win.y} w={win.w} h={win.h} title={title} opacity={rest.opacity} />
    <LiveShot win={win} {...rest} />
  </>
);
