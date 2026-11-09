// Feature150DemoClipsRenderV22 — feature v22 — 1280x720, 851 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood mint. RE-SHOOT 2026-11-09: narration unchanged, picture rewritten
// (viewer test had no plain product plate on b1; opener diversified off the recent-openers list).
//
// Beat → effect (data only from the feature row; no verified commit for v22, so
// b4 draws the render pipeline on a dark plate instead of a LiveBackdrop):
// b1 15-192   "the picture just... stopped, mid-voiceover"
//             keywordCaption over the features hub (wide shot, zoom 1.0x).
// b2 192-320  "nearly half of every voiced clip froze on its last frame"
//             percentRing over the hub, pushed in tighter (zoom 1.6x).
// b3 320-476  "and most of the 150 features had no clip at all — just 2 did"
//             ratioBars over the hub, pushed in further (zoom 2.2x).
// b4 476-677  "Remotion builds the clip, then loops the footage instead of freezing it"
//             copyCorrection (freeze -> loop, struck through and corrected), drawn on a dark
//             plate (zoom 2.8x, no public commit to film), plus a drawn 3-step points row
//             (HandoffPoints) since copyCorrection's data shape has no points array.
// b5 677-851  "the catalog went from 2 clips to over 150"
//             no catalog effect: a LogWindow plays the real render/catalog numbers,
//             holds to the end (zoom readout settles at LOCKED).
//
// Persistent element (archetype 2 — camera, not fade): a viewfinder HUD — four
// corner brackets that close in beat by beat, a bottom-left zoom readout
// ("×1.0" → "LOCKED") with a target label that changes every beat, plus a small
// fixed top-left product plate ("Portfolio & News Platform") that names the
// maker from b1 onward.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import { LogWindow, type LogLine } from "./live-primitives";
import shotsFile from "./shots/v22.json";

const B1 = 15;
const B2 = 192;
const B3 = 320;
const B4 = 476;
const B5 = 677;
const END = 851;

/** mint's own accent (#0B7A5A) reads too dark on a dark plate; brighten for the stage. */
const ACCENT = "#34D399";
const STAGE = "#0B1F17";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// zoom readout + corner-bracket inset per beat — the archetype's one element.
const ZOOM_STOPS = [
  { at: B1, mult: "1.0", inset: 56, label: "ALL FEATURE CLIPS" },
  { at: B2, mult: "1.6", inset: 46, label: "HALF: FROZEN TAIL" },
  { at: B3, mult: "2.2", inset: 36, label: "148 WITH NO CLIP" },
  { at: B4, mult: "2.8", inset: 27, label: "RENDER PIPELINE" },
  { at: B5, mult: "LOCKED", inset: 18, label: "150+ CLIPS NOW" },
];

const LOG_LINES: LogLine[] = [
  { t: "[render]", text: "features_without_clip: 148", tone: "danger" },
  { t: "[render]", text: "generating .tsx x148 (schema primitives)", tone: "ink" },
  { t: "[step8]", text: "ffmpeg -stream_loop until hold+tail", tone: "accent" },
  { t: "[step8]", text: "freeze-frame tail: removed", tone: "success" },
  { t: "[catalog]", text: "demo clips: 2 -> 150+", tone: "success" },
];

// b4's catalog effect (copyCorrection) is a centered strike-through card with no points
// array — this draws the 3 supporting points as its own row, timed to land well before
// the beat's midpoint capture frame, and positioned clear of the card (y 250-450) and the
// ZoomHud readout (y 606-698).
const B4_POINTS = [
  "Remotion renders a short clip",
  "ffmpeg -stream_loop to voice length",
  "no more frozen tail",
];

const HandoffPoints: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B4) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B4 + 10} kind="rise" box={{ x: 240, y: 108, w: 800, h: 40 }} dur={0.35}>
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 108,
            width: 800,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          How the fix works
        </div>
      </Arrive>
      {B4_POINTS.map((text, i) => {
        const w = 326;
        const x = 96 + i * (w + 33);
        return (
          <Arrive key={text} at={B4 + 24 + i * 14} kind="rise" box={{ x, y: 480, w, h: 100 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: 480,
                width: w,
                height: 100,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 4,
                padding: "14px 18px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: P.accent, marginBottom: 6 }}>STEP {i + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}>
                {text}
              </div>
            </div>
          </Arrive>
        );
      })}
    </div>
  );
};

const ZoomHud: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  let stopIdx = 0;
  for (let i = 0; i < ZOOM_STOPS.length; i++) if (frame >= ZOOM_STOPS[i].at) stopIdx = i;
  const stop = ZOOM_STOPS[stopIdx];
  const prevInset = stopIdx > 0 ? ZOOM_STOPS[stopIdx - 1].inset : ZOOM_STOPS[0].inset;
  const settle = tween(sec(frame, stop.at, fps), 0, 0.5, ease.power2Out);
  const inset = mix(settle, prevInset, stop.inset);

  const BOX = { x: 40, y: 606, w: 420, h: 92 };
  const bracket = (corner: "tl" | "tr" | "bl" | "br") => {
    const size = 34;
    const left = corner === "tl" || corner === "bl" ? inset : width - inset - size;
    const top = corner === "tl" || corner === "tr" ? inset : height - inset - size;
    const borders: React.CSSProperties =
      corner === "tl"
        ? { borderTop: `3px solid ${P.accent}`, borderLeft: `3px solid ${P.accent}` }
        : corner === "tr"
        ? { borderTop: `3px solid ${P.accent}`, borderRight: `3px solid ${P.accent}` }
        : corner === "bl"
        ? { borderBottom: `3px solid ${P.accent}`, borderLeft: `3px solid ${P.accent}` }
        : { borderBottom: `3px solid ${P.accent}`, borderRight: `3px solid ${P.accent}` };
    return (
      <div
        key={corner}
        style={{ position: "absolute", left, top, width: size, height: size, ...borders }}
      />
    );
  };

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {(["tl", "tr", "bl", "br"] as const).map(bracket)}

      <Arrive at={B1 + 2} kind="wipe" box={{ x: 40, y: 40, w: 420, h: 48 }} dur={0.4}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 40,
            height: 48,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            background: P.card,
            borderRadius: 4,
            boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 800, color: P.ink, whiteSpace: "nowrap" }}>
            Portfolio &amp; News Platform
          </div>
        </div>
      </Arrive>

      <Arrive at={B1 + 4} kind="wipe" box={BOX} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: BOX.x,
            top: BOX.y,
            width: BOX.w,
            height: BOX.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            gap: 18,
          }}
        />
      </Arrive>
      <div
        key={`mult-${stopIdx}`}
        style={{
          position: "absolute",
          left: BOX.x + 22,
          top: BOX.y + 18,
          fontSize: 26,
          fontWeight: 800,
          color: P.accent,
          transform: `scale(${punchScale(sec(frame, stop.at, fps), 0)})`,
        }}
      >
        {stop.mult === "LOCKED" ? "LOCKED" : `×${stop.mult}`}
      </div>
      <div
        key={`label-${stopIdx}`}
        style={{
          position: "absolute",
          left: BOX.x + 130,
          top: BOX.y + 16,
          width: BOX.w - 150,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 1.4,
          color: P.ink,
          lineHeight: 1.3,
          opacity: tween(sec(frame, stop.at, fps), 0, 0.3, ease.power2Out),
        }}
      >
        ZOOM {stop.mult === "LOCKED" ? "" : "IN -> "}
        <br />
        {stop.label}
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const logOpacity = frame >= B5 ? tween(sec(frame, B5 + 6, 30), 0, 0.4, ease.power2Out) : 0;

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the picture stopped, mid-voiceover, wide shot of the hub */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B1} hold={B2 - B1} push={0.04} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "The picture just stops",
          line2: "but the voiceover keeps going",
          keywords: ["stops"],
        }}
      />

      {/* b2 — nearly half of every voiced clip froze, pushed in tighter */}
      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} push={0.08} focus={{ x: 0.55, y: 0.3 }} />
      )}
      <MotionInsert
        effect="percentRing"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          value: 50,
          label: "of voiced clips froze on the last frame",
          notes: ["Voice kept going", "Picture already stopped"],
        }}
      />

      {/* b3 — most of the 150 features had no clip at all, pushed in further */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} push={0.1} focus={{ x: 0.5, y: 0.25 }} />
      )}
      <MotionInsert
        effect="ratioBars"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          a: { label: "Had a demo clip", value: 2 },
          b: { label: "Features total", value: 150 },
          unit: "features",
        }}
      />

      {/* b4 — Remotion builds the clip, then loops the footage (no public commit, draw it) */}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          wrong: "Freeze last frame, fill the silence",
          right: "Loop the footage instead",
          label: "THE FIX",
        }}
      />
      <HandoffPoints />

      {/* b5 — the catalog went from 2 clips to over 150, shown as the real render log, holds to the end */}
      {frame >= B5 && (
        <LogWindow
          lines={LOG_LINES}
          title="feature-demos render log"
          from={B5 + 10}
          every={22}
          opacity={logOpacity}
          win={{ x: 120, y: 100, w: 1040, h: 480 }}
        />
      )}

      <ZoomHud />
    </AbsoluteFill>
  );
};

export const Feature150DemoClipsRenderV22: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
