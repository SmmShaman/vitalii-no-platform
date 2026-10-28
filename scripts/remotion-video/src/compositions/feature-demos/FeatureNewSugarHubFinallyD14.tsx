// FeatureNewSugarHubFinallyD14 — feature d14 — 1280x720, 972 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A horizontal timeline ribbon sits low in frame for the whole clip — four nodes that light
// up one by one as the story moves from "locked in one app" to "live now". Distinct from
// d15's archetype-2 zoom-in: the camera push here is gentle and constant, the ribbon is
// what actually carries the archetype.
//
// Beat → effect (data only from the feature row, no invented numbers):
// b1 15-184   "locked inside one app, nobody else could see it"
//             titleTakeover over the article's top (shot "wide"). Kicker names the product
//             plainly: "Diabet — tools built for my son Artem".
// b2 184-359  "the kiosk badge, a future alert — none of them could reach it"
//             statusFocus over the problem paragraph (shot "problem").
// b3 359-549  "a service polls CareLink on schedule, caches it, backs off on failure"
//             pipelineFlow over the build paragraph (shot "build") — bridge/sugar_hub.py.
// b4 549-741  "now a read-only feed any app can call, even the kiosk badge"
//             handoffExplain over the feed paragraph (shot "feed").
// b5 741-927  "one service, four numbers, live now" — bridge/sugar_hub.py, a drawn terminal
//             log, holds at full brightness to the end, no fade.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive, cut } from "./motion-primitives";
import { LiveShot, LogWindow, recSize, type LogLine } from "./live-primitives";
import shotsFile from "./shots/d14.json";

const B1 = 15;
const B2 = 184;
const B3 = 359;
const B4 = 549;
const B5 = 741;
const END = 972;

/** Warm dark plate tuned for the sand mood (sand's own tones read muddy on a dark backdrop). */
const ACCENT = "#F4A94B";
const STAGE = "#1C1610";

const FULL_WIN = { x: 0, y: -42, w: 1280, h: 762 };

const { w: REC_W, h: REC_H } = recSize(shotsFile);
const COVER = Math.max(1, 720 / REC_H / (1280 / REC_W));

const feedLines: LogLine[] = [
  { t: "$", text: "systemctl status sugar-hub", tone: "accent" },
  { text: "polling CareLink on schedule...", tone: "muted" },
  { text: "backoff cleared — feed healthy", tone: "muted" },
  { text: "serving /api/glucose (read-only)", tone: "muted" },
  { text: "kiosk-scoped badge connected", tone: "success" },
  { text: "value 6.4 • trend rising • level in-range", tone: "success" },
  { text: "four numbers every call: value, trend, level, age", tone: "success" },
];

/** The archetype itself: a horizontal progress ribbon, present from b1 to the end. */
const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const RX = 40;
  const RY = 606;
  const RW = 1200;
  const RH = 92;
  const LINE_Y = RY + 50;
  const progress = Math.max(0, Math.min(1, (frame - B1) / (END - B1)));
  const nodes = [
    { label: "LOCKED IN APP", at: B1, x: 0 },
    { label: "SERVICE POLLS", at: B3, x: 0.33 },
    { label: "FEED OPENS", at: B4, x: 0.66 },
    { label: "LIVE NOW", at: B5, x: 1 },
  ];

  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: RX, y: RY, w: RW, h: RH }} dur={0.45}>
      <div
        style={{
          position: "absolute",
          left: RX,
          top: RY,
          width: RW,
          height: RH,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RX + 18,
          top: LINE_Y - 1,
          width: RW - 36,
          height: 2,
          background: P.border,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RX + 18,
          top: LINE_Y - 1,
          width: (RW - 36) * progress,
          height: 2,
          background: P.accent,
        }}
      />
      {nodes.map((n, i) => {
        const cx = RX + 18 + (RW - 36) * n.x;
        const lit = frame >= n.at;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: cx - 7,
                top: LINE_Y - 7,
                width: 14,
                height: 14,
                borderRadius: 7,
                background: lit ? P.accent : P.card,
                border: `2px solid ${lit ? P.accent : P.muted}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: Math.min(Math.max(cx - 80, RX + 10), RX + RW - 170),
                top: LINE_Y + 14,
                width: 170,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.2,
                textAlign: "center",
                color: lit ? P.ink : P.muted,
              }}
            >
              {n.label}
            </div>
          </React.Fragment>
        );
      })}
    </Arrive>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — the feed locked inside one app */}
      {cut(frame, B1, B2) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="wide"
          from={B1}
          hold={B2 - B1}
          zoom={(t) => COVER * (1.0 + 0.02 * t)}
          focus={{ x: 0.5, y: 0.22 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "A feed trapped in one app", kicker: "Diabet — tools built for my son Artem" }}
      />

      {/* b2 — who could actually see Artem's sugar */}
      {cut(frame, B2, B3) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="problem"
          from={B2}
          hold={B3 - B2}
          zoom={(t) => COVER * (1.02 + 0.02 * t)}
          focus={{ x: 0.5, y: 0.38 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Who could see Artem's sugar?",
          claims: [
            { text: "CareLink's own app", verdict: "yes" },
            { text: "The family kiosk", verdict: "no" },
            { text: "A future alert", verdict: "no" },
          ],
        }}
      />

      {/* b3 — a service polls, caches, backs off on failure */}
      {cut(frame, B3, B4) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="build"
          from={B3}
          hold={B4 - B3}
          zoom={(t) => COVER * (1.04 + 0.02 * t)}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Poll CareLink on schedule", "Cache the reading", "Back off on failure"],
          result: "No hammering CareLink's API",
        }}
      />

      {/* b4 — now a read-only feed any app can call */}
      {cut(frame, B4, B5) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="feed"
          from={B4}
          hold={B5 - B4}
          zoom={(t) => COVER * (1.06 + 0.02 * t)}
          focus={{ x: 0.5, y: 0.62 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          fromLabel: "BEFORE",
          toLabel: "NOW",
          from: "Locked inside one app",
          to: "Read-only feed, any app can call",
          points: ["Even a kiosk badge can call it", "No admin access needed"],
        }}
      />

      {/* b5 — the fix actually running (never the feature page or the hub) */}
      {frame >= B5 && (
        <Arrive at={B5 + 2} kind="wipe" box={{ x: 0, y: 40, w: 1280, h: 92 }} dur={0.4}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 40,
              width: 1280,
              height: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: 0.5,
              color: "#fff",
            }}
          >
            One service, open to any app
          </div>
        </Arrive>
      )}
      {frame >= B5 && (
        <LogWindow
          lines={feedLines}
          title="bridge/sugar_hub.py"
          from={B5 + 14}
          every={16}
          opacity={1}
          win={{ x: 140, y: 170, w: 1000, h: 400 }}
          fontSize={22}
        />
      )}

      <Timeline />
    </AbsoluteFill>
  );
};

export const FeatureNewSugarHubFinallyD14: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
