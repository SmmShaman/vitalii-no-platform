// FeatureMuseumArchivesAlongRouteG21 — feature g21 — 1280x720, 932 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row, meta-g21.json, no invented numbers):
// b1 15-189   "Kilometers of road went by with nothing to say — real history sat just out of reach."
//             cornerTags over the feature's own page (backdrop).
// b2 189-323  "The places the app already knew were too far off to ever surface it."
//             targetOverrun over the features hub (backdrop) — 600m actual vs 150m target.
// b3 323-523  "Now it checks DigitaltMuseum's archive — old photographs, museum records —
//             for anything near the track."
//             pipelineFlow, no page/hub behind it (base stage only) — system caption glosses
//             DigitaltMuseum inline.
// b4 523-787  "A find near a known place joins its story. A find with nothing nearby becomes
//             a brand-new stop, named after the farm it came from."
//             featureMatrix over a worker LogWindow (no runtime log exists for this product;
//             lines paraphrased straight from meta-g21.json, not invented).
// b5 787-932  "The reach: 150 meters off the road."
//             titleTakeover, no page/hub behind it (gate: last beat never ends on the
//             feature page or the hub) — the zoom dial's own final bright ring carries the close.
//
// Persistent element: a "zoom-in" radius dial (archetype 2) in the bottom band — a search-radius
// circle and readout that starts dim at "600 m" and zooms down to a bright "150 m", with find
// markers lighting up as the archive check and the join/new-stop split land.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, IconCard, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g21.json";

const B1 = 15;
const B2 = 189;
const B3 = 323;
const B4 = 523;
const B5 = 787;
const END = 932;

/** Accent tuned for the dark stage (slate's #0E7490 reads fine, kept as-is). */
const ACCENT = "#22A3C2";
const STAGE = "#101A22";

// Zoom-dial band (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const DIAL_CX = LT.x + 56;
const DIAL_CY = LT.y + LT.h / 2;
const DIAL_R_MAX = 34;
const DIAL_R_MIN = 14;
// Coordinates used by elements nested INSIDE the card div (which is itself
// absolutely positioned at LT.x/LT.y) must be relative to the card's own
// origin, not the full-frame origin — otherwise LT.x/LT.y gets added twice.
const REL_CX = DIAL_CX - LT.x;
const REL_CY = DIAL_CY - LT.y;

// LogWindow sits above the zoom-dial band so the two never overlap.
const LOG_WIN = { x: 150, y: 150, w: 980, h: 430 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const ZoomDial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const found = frame >= B3 + 40; // DigitaltMuseum check landed
  const split = frame >= B4 + 40; // join / new-stop split landed
  const final = frame >= B5 + 40; // reach confirmed
  const zoomP = Math.max(0, Math.min(1, sec(frame, B2, fps) / 1.4));
  const radius = DIAL_R_MAX - (DIAL_R_MAX - DIAL_R_MIN) * zoomP;
  const stampP = final ? punchScale(sec(frame, B5 + 40, fps), 0) : 0;
  const readout = final ? "150 m" : frame >= B2 ? `${Math.round(600 - (600 - 150) * zoomP)} m` : "600 m";

  // x/top here are relative to the card div's own origin (see REL_CX/REL_CY above).
  const Marker: React.FC<{ x: number; lit: boolean }> = ({ x, lit }) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: REL_CY - 5,
        width: 10,
        height: 10,
        borderRadius: 5,
        background: lit ? P.success : P.border,
        border: `2px solid ${lit ? P.successEdge : P.muted}`,
      }}
    />
  );

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 20} kind="wipe" box={LT}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: LT.w,
            height: LT.h,
            borderRadius: 14,
            background: P.card,
            border: `2px solid ${P.border}`,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: REL_CX - DIAL_R_MAX - 10,
              top: REL_CY - DIAL_R_MAX - 10,
              width: (DIAL_R_MAX + 10) * 2,
              height: (DIAL_R_MAX + 10) * 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: DIAL_R_MAX + 10 - radius,
                top: DIAL_R_MAX + 10 - radius,
                width: radius * 2,
                height: radius * 2,
                borderRadius: "50%",
                border: `3px solid ${final ? P.success : P.accent}`,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: REL_CX + DIAL_R_MAX + 24,
              top: 14,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1.6,
              color: final ? P.success : P.muted,
            }}
          >
            SEARCH RADIUS
          </div>
          <div
            style={{
              position: "absolute",
              left: REL_CX + DIAL_R_MAX + 24,
              top: 34,
              fontSize: 30,
              fontWeight: 800,
              color: final ? P.success : P.ink,
            }}
          >
            {readout}
          </div>
          <div style={{ position: "absolute", left: REL_CX + 220, top: 16, fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: found ? P.success : P.muted }}>
            ARCHIVE CHECK
          </div>
          <Marker x={REL_CX + 220} lit={found} />
          <div style={{ position: "absolute", left: REL_CX + 420, top: 16, fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: split ? P.success : P.muted }}>
            JOIN OR NEW STOP
          </div>
          <Marker x={REL_CX + 420} lit={split} />
          <div style={{ position: "absolute", left: REL_CX + 620, top: 16, fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: final ? P.success : P.muted }}>
            REACH CONFIRMED
          </div>
          <Marker x={REL_CX + 620} lit={final} />
        </div>
      </Arrive>
      {final && (
        <div
          style={{
            position: "absolute",
            left: DIAL_CX - DIAL_R_MIN - 16,
            top: DIAL_CY - DIAL_R_MIN - 16,
            width: (DIAL_R_MIN + 16) * 2,
            height: (DIAL_R_MIN + 16) * 2,
            borderRadius: "50%",
            border: `3px solid ${P.success}`,
            transform: `scale(${stampP})`,
            transformOrigin: "center",
          }}
        />
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — real history out of reach, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
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
        <div style={{ position: "absolute", left: 90, top: 28, fontSize: 18, fontWeight: 750, color: "#DCE8EE", fontFamily }}>
          🧭 Guide — Stories on the Road — a personal audio guide for driving: the phone knows
          where I am and plays short stories about the places around me, in Norwegian and
          Ukrainian side by side.
        </div>
      )}

      {/* b2 — known places were too far off to ever surface it, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
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
          win={LOG_WIN}
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

      {/* b5 — the reach, no page or hub behind it */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
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

      <ZoomDial />
    </AbsoluteFill>
  );
};

export const FeatureMuseumArchivesAlongRouteG21: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
