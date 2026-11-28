// FeatureTvClockUsedShowD19 — feature d19 — 1280x720, 897 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar, mood slate. Motion direction v2 (feature-motion skill, 2026-11-28).
//
// A fixed left column (320px) holds the running claim and never goes away —
// the archetype's own rule ("the only recurring element is the column"). The
// big stage on the right swaps content per beat:
// b1  15-248  "no sense of climbing, falling, or what's coming"   keywordCaption over the live page
// b2 248-410  "snapshot wasn't enough to plan around"             titleTakeover over the live page
// b3 410-567  "an SVG chart draws the last 24 hours as one line"  lineTrend, drawn (no commit URL verified)
// b4 567-701  "the next 5 hours of weather line up hour by hour"  pipelineFlow, drawn
// b5 701-897  "a full day behind and five hours ahead"            drawn: LogWindow of real facts
//             + hand-drawn 24h / 5h result card.
// Gate 2: the last beat never shows the feature page or the hub — it is
// fully drawn, held at full brightness to the end.
// The sidebar column is painted LAST in the tree so it stays opaque over
// whatever MotionInsert/LiveWindow renders underneath it (both are full-bleed).

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive, cut } from "./motion-primitives";
import { LiveWindow, LogWindow, type LogLine } from "./live-primitives";
import shotsFile from "./shots/d19.json";

const B1 = 15;
const B2 = 248;
const B3 = 410;
const B4 = 567;
const B5 = 701;
const END = 897;

/** Slate's own accent (#0E7490) reads muddy on the dark stage; a brighter twin. */
const ACCENT = "#22D3EE";
const STAGE = "#0B1620";

const SIDEBAR_W = 320;

function claimFor(frame: number): string {
  if (frame < B2) return "SNAPSHOT ONLY";
  if (frame < B3) return "NOT ENOUGH TO PLAN";
  if (frame < B4) return "24H SUGAR LINE";
  if (frame < B5) return "5H FORECAST STRIP";
  return "FULL DAY, BOTH WAYS";
}

function dotIndex(frame: number): number {
  if (frame < B2) return 0;
  if (frame < B3) return 1;
  if (frame < B4) return 2;
  if (frame < B5) return 3;
  return 4;
}

const SidebarClaim: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const active = dotIndex(frame);
  const claim = claimFor(frame);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SIDEBAR_W,
        height: 720,
        background: P.card,
        borderRight: `2px solid ${P.border}`,
        fontFamily,
      }}
    >
      <div style={{ position: "absolute", left: 28, top: 36, fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.accent }}>
        DIABET
      </div>
      <div style={{ position: "absolute", left: 28, top: 58, fontSize: 15, fontWeight: 700, color: P.muted }}>
        Type 1 Diabetes Toolkit
      </div>

      <div style={{ position: "absolute", left: 28, right: 28, top: 320 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: P.muted, marginBottom: 10 }}>
          RUNNING CLAIM
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: P.ink, lineHeight: 1.25 }}>{claim}</div>
      </div>

      <div style={{ position: "absolute", left: 28, bottom: 48, display: "flex", gap: 10 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: i === active ? P.accent : P.border,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const JargonGloss: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B3 + 40 || frame >= B4) return null;
  const box = { x: 980, y: 40, w: 260, h: 44 };
  return (
    <Arrive at={B3 + 40} kind="rise" box={box}>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: P.accentBg,
          border: `2px solid ${P.accentEdge}`,
          borderRadius: 4,
          fontSize: 14,
          fontWeight: 700,
          color: P.ink,
          fontFamily,
        }}
      >
        SVG — vector chart in the browser
      </div>
    </Arrive>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "01", text: "weather cell: icon + temp + 5 hourly cells", tone: "accent" },
  { t: "02", text: "sugar cell: value + trend arrow + 24h SVG line", tone: "ink" },
  { t: "03", text: "chart draws last 24h inside the safe corridor", tone: "muted" },
  { t: "04", text: "forecast strip: next 5 hours, hour by hour", tone: "success" },
  { t: "05", text: "repaints with the clock's day/night colors", tone: "muted" },
  { t: "06", text: "repaints with the existing alert flash", tone: "ink" },
  { t: "07", text: "no separate color logic to maintain", tone: "success" },
];

const ResultCard: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5 + 40) return null;
  const box = { x: 760, y: 160, w: 420, h: 420 };
  return (
    <Arrive at={B5 + 40} kind="punch" box={box}>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          background: P.card,
          borderRadius: 8,
          boxShadow: "10px 10px 0 rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          fontFamily,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: P.ink }}>24h</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: P.muted, marginTop: 4 }}>sugar history</div>
        </div>
        <div style={{ width: 280, height: 2, background: P.border }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: P.accent }}>5h</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: P.muted, marginTop: 4 }}>weather ahead</div>
        </div>
      </div>
    </Arrive>
  );
};

const STAGE_WIN = { x: SIDEBAR_W + 40, y: 110, w: 1280 - SIDEBAR_W - 80, h: 500 };

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: a single snapshot reading, no trend */}
      {cut(frame, B1, B2) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features"
          from={B1}
          hold={B2 - B1}
          opacity={1}
          win={STAGE_WIN}
        />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.55}
        data={{ line1: "No sense of climbing", line2: "falling, or what's coming", keywords: ["climbing", "falling"] }}
      />

      {/* b2 — the stakes: a snapshot isn't enough to plan around */}
      {cut(frame, B2, B3) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features"
          from={B2}
          hold={B3 - B2}
          opacity={1}
          win={STAGE_WIN}
        />
      )}
      <MotionInsert
        effect="titleTakeover"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.55}
        data={{ title: "Not Enough To Plan", kicker: "Type 1 Diabetes" }}
      />

      {/* b3 — the fix: 24h sugar line, drawn (no verified commit URL to show) */}
      <MotionInsert
        effect="lineTrend"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "Sugar — Last 24h",
          unit: "mg/dL",
          points: [
            { label: "-24h", value: 118 },
            { label: "-18h", value: 95 },
            { label: "-12h", value: 142 },
            { label: "-6h", value: 110 },
            { label: "now", value: 128 },
          ],
        }}
      />
      <JargonGloss />

      {/* b4 — the forecast strip, hour by hour */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{ steps: ["+1h", "+2h", "+3h", "+4h", "+5h"], result: "Forecast strip", system: "Weather cell" }}
      />

      {/* b5 — drawn result only: never the feature page or hub (gate 2) */}
      {frame >= B5 && (
        <LogWindow
          lines={LOG_LINES}
          title="clock bridge log"
          from={B5 + 4}
          every={16}
          opacity={1}
          win={{ x: SIDEBAR_W + 40, y: 140, w: 640, h: 500 }}
        />
      )}
      <ResultCard />

      <SidebarClaim />
    </AbsoluteFill>
  );
};

export const FeatureTvClockUsedShowD19: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
