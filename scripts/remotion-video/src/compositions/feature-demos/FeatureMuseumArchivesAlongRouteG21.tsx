// FeatureMuseumArchivesAlongRouteG21 — feature g21 — 1280x720, 932 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
// RE-SHOOT 2026-10-20: narration and beat windows unchanged; the picture is rewritten
// because the first pass staged "zoom" as a theme (a small shrinking radius dial in the
// bottom band) instead of the archetype itself — a camera move. This pass is a real
// camera: a viewfinder reticle opens on the whole 1280x720 frame in b1 (a wide, small-scale
// view) and continuously tightens, beat by beat, until by b5 it frames only the result —
// the reticle never jump-cuts, it is one continuous zoom for the full 932 frames.
//
// Beat → effect (data only from the feature row, meta-g21.json, no invented numbers):
// b1 15-189   "Kilometers of road went by with nothing to say — real history sat just out
//             of reach." cornerTags over the feature's own page (LiveBackdrop, strong
//             push-in — the camera is already moving). Reticle: wide open, near full frame.
// b2 189-323  "The places the app already knew were too far off to ever surface it."
//             targetOverrun over the features hub (LiveBackdrop, strong push-in).
//             Reticle: first tightening, now a large center-right box.
// b3 323-523  "Now it checks DigitaltMuseum's archive — old photographs, museum records —
//             for anything near the track." pipelineFlow, no page/hub behind it (base stage
//             only) — system caption glosses DigitaltMuseum inline. Reticle: tighter still,
//             framing the pipeline chain.
// b4 523-787  "A find near a known place joins its story. A find with nothing nearby becomes
//             a brand-new stop, named after the farm it came from." featureMatrix over a
//             worker LogWindow (no runtime log exists for this product; lines paraphrased
//             straight from meta-g21.json, not invented). Reticle: framing the log window.
// b5 787-932  "The reach: 150 meters off the road." titleTakeover, no page/hub behind it
//             (gate: last beat never ends on the feature page or the hub) — the reticle
//             closes all the way down onto the headline and holds there, full brightness,
//             to the final frame: the camera has zoomed all the way into the one answer.
//
// Persistent element: the zoom reticle (archetype 2) — four corner brackets plus a live
// "×" readout, continuously interpolated across all five beats (one camera move, not five
// cuts), shrinking from a near-full-frame box in b1 to a tight frame around the b5 result.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, IconCard, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow, track } from "./live-primitives";
import shotsFile from "./shots/g21.json";

const B1 = 15;
const B2 = 189;
const B3 = 323;
const B4 = 523;
const B5 = 787;
const END = 932;

/** Indigo/plum accent tuned to read on the dark stage. */
const ACCENT = "#8E7CF0";
const STAGE = "#140F2B";

// Reticle keyframes: [frame, x, y, w, h] — a single continuous camera move across the
// whole clip. b1 opens near full-frame ("a wide, small-scale view of a whole interface");
// each later key tightens onto that beat's own content; b5 closes onto the headline and
// holds (frame repeated at END so the last beat does not keep drifting).
const RETICLE: number[][] = [
  [B1, 36, 34, 1208, 652],
  [B2, 130, 110, 900, 440],
  [B3, 300, 150, 420, 330],
  [B4, 300, 150, 460, 330],
  [B5, 330, 260, 420, 190],
  [END, 330, 260, 420, 190],
];

const ZOOM_BASE = 1208 * 652;

const ZoomReticle: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;
  const [x, y, w, h] = track(RETICLE, frame);
  const zoomX = Math.sqrt(ZOOM_BASE / (w * h));
  const arm = 26;
  const Corner: React.FC<{ cx: number; cy: number; hx: 1 | -1; vy: 1 | -1 }> = ({ cx, cy, hx, vy }) => (
    <>
      <div style={{ position: "absolute", left: cx, top: cy - 2, width: arm * hx, height: 4, background: P.accent }} />
      <div style={{ position: "absolute", left: cx - 2, top: cy, width: 4, height: arm * vy, background: P.accent }} />
    </>
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Corner cx={x} cy={y} hx={1} vy={1} />
      <Corner cx={x + w} cy={y} hx={-1} vy={1} />
      <Corner cx={x} cy={y + h} hx={1} vy={-1} />
      <Corner cx={x + w} cy={y + h} hx={-1} vy={-1} />
      <div
        style={{
          position: "absolute",
          left: x + w - 86,
          top: y - 30,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 1,
          color: P.accent,
          background: "rgba(0,0,0,0.42)",
          padding: "3px 10px",
          borderRadius: 8,
        }}
      >
        {zoomX.toFixed(1)}×
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — real history out of reach, over the feature's own page, camera already moving */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.14} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Real history, just out of reach",
          tags: ["Known places too far", "History unheard", "Kilometers of silence", "Every single pass"],
        }}
      />
      {/* product-line plate, carried for the length of b1 — plain text, not a competing effect */}
      {frame >= B1 && frame < B2 && (
        <div style={{ position: "absolute", left: 90, top: 28, fontSize: 18, fontWeight: 750, color: "#E7E2FB", fontFamily }}>
          🧭 Guide — Stories on the Road — a personal audio guide for driving: the phone knows
          where I am and plays short stories about the places around me, in Norwegian and
          Ukrainian side by side.
        </div>
      )}

      {/* b2 — known places were too far off to ever surface it, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} push={0.14} />}
      <MotionInsert
        effect="targetOverrun"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          label: "Known places, distance off the road",
          value: 600,
          target: 150,
          unit: "m",
        }}
      />

      {/* b3 — DigitaltMuseum archive check, drawn mechanism (no public UI for the match itself) */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["Walk the drive track", "Check DigitaltMuseum", "Match finds near track"],
          result: "Real history surfaces",
          system: "DigitaltMuseum — museum archive",
        }}
      />
      {/* the pipeline chain sits compacted mid-frame, leaving the top band empty — fill it with
          the two real actors the chain's labels already name (the compaction has no prop for size). */}
      {frame >= B3 && frame < B4 && (
        <>
          <IconCard x={90} y={70} w={300} emoji="📍" title="Known places" sub="already on the map" tone="accent" />
          <IconCard x={890} y={70} w={300} emoji="🏛" title="DigitaltMuseum" sub="museum archive" tone="accent" />
        </>
      )}

      {/* b4 — join existing place or become a new stop; no runtime log exists, so the worker
          window shows real behaviour paraphrased from the feature's own description. */}
      {cut(frame, B4, B5) === 1 && (
        <LogWindow
          win={{ x: 150, y: 150, w: 980, h: 430 }}
          title="archive match worker"
          from={B4 + 10}
          every={16}
          opacity={1}
          lines={[
            { text: "find within 150m of drive track", tone: "muted" },
            { text: "known place nearby? check radius", tone: "muted" },
            { text: "yes -> append to that place's story", tone: "accent" },
            { text: "no -> create new place", tone: "accent" },
            { text: "name new place after the farm it came from", tone: "muted" },
            { text: "flows into the normal story pipeline", tone: "muted" },
            { text: "catalog gains a confirmed stop", tone: "success" },
          ]}
        />
      )}
      <MotionInsert
        effect="featureMatrix"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          options: ["Near a known place", "Nothing nearby"],
          rows: [
            { label: "Becomes", values: ["Joins its story", "New stop"] },
            { label: "Named after", values: ["the existing place", "the farm"] },
          ],
        }}
      />

      {/* b5 — the reach, no page or hub behind it — the reticle closes onto this result */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{ title: "150 meters off the road", kicker: "History, no longer out of reach" }}
      />
      {/* the headline sits vertically centered, leaving top and lower bands empty — flank it with
          the real before/after numbers (already used in b2) as labelled callouts, not new figures. */}
      {frame >= B5 && (
        <>
          <StatPill x={110} y={100} emoji="📍" text="Old reach: 600 m" tone="accent" opacity={0.75} />
          <StatPill x={760} y={100} emoji="✅" text="New reach: 150 m" tone="success" />
        </>
      )}

      <ZoomReticle />
    </AbsoluteFill>
  );
};

export const FeatureMuseumArchivesAlongRouteG21: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
