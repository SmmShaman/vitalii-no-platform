// FeatureFarm500MetersOffG20 — feature g20 — 1280x720, 950 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row, meta-g20.json, no invented numbers):
// b1 15-206   "Some farms sat just off the road — close enough to matter, too far for
//             the app to ever mention them."
//             cornerTags over the feature's own page (backdrop).
// b2 206-406  "The trigger only fired within 120 meters, so real local history got
//             driven straight past."
//             targetOverrun over the features hub (backdrop) — 120m old radius vs
//             the 550m useful reach.
// b3 406-579  "Now the geofence fires for places off the road too, not just the ones
//             sitting right on it."
//             pipelineFlow over a worker LogWindow (no runtime log exists for this
//             product; lines paraphrased straight from the DriveService commit and
//             the feature's own description, not invented).
// b4 579-727  "A new voice line gives the direction and distance as the car passes
//             abeam."
//             featureMatrix, no page/hub behind it (base stage only).
// b5 727-950  "The reach: 250 to 550 meters off the road — now, their moment."
//             titleTakeover, no page/hub behind it (gate: last beat never ends on
//             the feature page or the hub) — the timeline's own final bright node
//             carries the close.
//
// Persistent element: a timeline ribbon (archetype 1) in the bottom band — five
// labelled stage nodes on a fill line, lighting up one at a time as the clip plays,
// the last one landing on the real final reach.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g20.json";

const B1 = 15;
const B2 = 206;
const B3 = 406;
const B4 = 579;
const B5 = 727;
const END = 950;

/** Accent tuned for the dark stage (sand's warm tone kept as-is, lifted for contrast). */
const ACCENT = "#D9A441";
const STAGE = "#231A0E";

// Timeline band (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const NODES = [
  { label: "120m only", at: B1 },
  { label: "Off-road blind spot", at: B2 },
  { label: "Geofence extended", at: B3 },
  { label: "Voice line added", at: B4 },
  { label: "250-550m reach", at: B5 },
];
const NODE_X = (i: number) => LT.x + 40 + (i / (NODES.length - 1)) * (LT.w - 80);
const LINE_Y = LT.y + 34;

// LogWindow sits above the timeline band so the two never overlap.
const LOG_WIN = { x: 150, y: 150, w: 980, h: 430 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const TimelineBand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const prog = Math.max(0, Math.min(1, (frame - B1) / (END - B1)));
  const final = frame >= B5 + 40;
  const stampP = final ? punchScale(sec(frame, B5 + 40, fps), 0) : 0;

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
              left: 40,
              top: LINE_Y - 2,
              width: LT.w - 80,
              height: 4,
              borderRadius: 2,
              background: P.border,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 40,
              top: LINE_Y - 2,
              width: (LT.w - 80) * prog,
              height: 4,
              borderRadius: 2,
              background: final ? P.success : P.accent,
            }}
          />
          {NODES.map((n, i) => {
            const lit = frame >= n.at + 15;
            const x = NODE_X(i);
            return (
              <React.Fragment key={n.label}>
                <div
                  style={{
                    position: "absolute",
                    left: x - LT.x - 7,
                    top: LINE_Y - 7,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    background: lit ? (i === NODES.length - 1 ? P.success : P.accent) : P.card,
                    border: `3px solid ${lit ? (i === NODES.length - 1 ? P.successEdge : P.accentEdge) : P.border}`,
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: x - LT.x - 70,
                    top: LINE_Y + 14,
                    width: 140,
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    color: lit ? P.ink : P.muted,
                  }}
                >
                  {n.label}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Arrive>
      {final && (
        <div
          style={{
            position: "absolute",
            left: NODE_X(NODES.length - 1) - 20,
            top: LINE_Y - 20,
            width: 40,
            height: 40,
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
      {/* b1 — close enough to matter, too far to mention, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Close enough, too far to mention",
          tags: ["120m-only trigger", "Farms off the road", "History driven past", "Every single pass"],
        }}
      />
      {/* product-line plate, carried for the length of b1 — plain text, not a competing effect */}
      {frame >= B1 && frame < B2 && (
        <div style={{ position: "absolute", left: 90, top: 28, fontSize: 18, fontWeight: 750, color: "#3A2A12", fontFamily }}>
          🧭 Guide — Stories on the Road — a personal audio guide for driving: the phone knows
          where I am and plays short stories about the places around me, in Norwegian and
          Ukrainian side by side.
        </div>
      )}

      {/* b2 — the old trigger radius drove real history past, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="targetOverrun"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          label: "Old trigger radius vs useful reach",
          value: 120,
          target: 550,
          unit: "m",
        }}
      />

      {/* b3 — the geofence now fires off the road too; no runtime log exists, so the
          worker window shows real behaviour paraphrased from the DriveService commit. */}
      {cut(frame, B3, B4) === 1 && (
        <LogWindow
          win={LOG_WIN}
          title="DriveService geofence worker"
          from={B3 + 10}
          every={16}
          opacity={1}
          lines={[
            { text: "scan drive track for known places", tone: "muted" },
            { text: "nothing directly on the road nearby", tone: "muted" },
            { text: "off-road place found, 310 m away", tone: "accent" },
            { text: "geofence fires anyway", tone: "accent" },
            { text: "trigger radius: 120m -> 550m", tone: "success" },
            { text: "local history surfaces", tone: "success" },
          ]}
        />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          steps: ["Walk the drive track", "Check for off-road places", "Fire the geofence anyway"],
          result: "Local history surfaces",
          system: "DriveService — the app's background location watcher",
        }}
      />

      {/* b4 — a new voice line gives direction and distance abeam, drawn mechanism */}
      <MotionInsert
        effect="featureMatrix"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          options: ["On the road", "Off the road"],
          rows: [
            { label: "Voice line", values: ["Always had one", "Now gets one too"] },
            { label: "Direction + distance", values: ["No", "Yes, as it passes abeam"] },
          ],
        }}
      />

      {/* b5 — the reach, no page or hub behind it */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        data={{ title: "250 to 550 meters off the road", kicker: "Now, their moment." }}
      />

      <TimelineBand />
    </AbsoluteFill>
  );
};

export const FeatureFarm500MetersOffG20: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
