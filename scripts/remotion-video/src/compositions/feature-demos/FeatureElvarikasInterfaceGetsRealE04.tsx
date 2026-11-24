// FeatureElvarikasInterfaceGetsRealE04 — feature e04 — 1280x720, 1011 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Elvarika — a learning app that turns pasted/uploaded text into vocabulary and
// audio playlists (a VPS runner analyzes it with Claude). This clip is about ONE
// change: every visitor used to stare at a blank screen for up to 3s before the
// interface rebuild. No GitHub commit URL is verified for e04 (only the feature's
// own page + the features hub), so b5 is drawn only — no commit diff is shown;
// its LogWindow lines come only from the feature's own numbers (first-load bundle
// 2.4MB -> 0.65MB).
//
// Beat -> picture (data only from the feature row, no invented numbers):
// b1 15-184    "every visitor stared at a blank screen for up to three seconds"
//              titleTakeover over the feature's own page (backdrop); kicker
//              names Elvarika. Timeline ribbon node 1 lights: "3S BLANK SCREEN".
// b2 193-375   "that wait was just a health check, sitting on years of leftovers"
//              copyCorrection over the page scrolled further. Timeline node 2
//              lights: "HEALTH CHECK FOUND".
// b3 384-610   "the whole interface got rebuilt around one design system"
//              pipelineFlow over the features hub (backdrop) — three steps,
//              naming React once. Timeline node 3 lights: "NEW DESIGN SYSTEM".
// b4 619-784   "dead screens got deleted, the blocking check is gone"
//              handoffExplain over the page (fast reload, backdrop). Timeline
//              node 4 lights: "DEAD SCREENS CUT".
// b5 793-966   "the file it has to load first dropped from 2.4MB to 0.65"
//              DRAWN (no backdrop — no verified commit URL): before/after bundle
//              cards + LogWindow with the feature's own numbers; timeline node 5
//              lights: "0.65 MB BUNDLE". Holds to the end at full brightness.
//
// Persistent element: the timeline ribbon (archetype 1) lives at y>=606 — a
// horizontal line that fills left-to-right across the whole clip, with 5 dots
// that light up and label themselves at each beat boundary (b1 node1, b2 node2,
// b3 node3, b4 node4, b5 node5) — while the upper 580px carries each beat's own
// effect or drawn result.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Headline, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/e04.json";

const B1 = 15;
const B2 = 193;
const B3 = 384;
const B4 = 619;
const B5 = 793;
const END = 1011;

/** Minty accent darker than mint's own accent so it reads on the dark stage plate. */
const ACCENT = "#0E8F66";
const STAGE = "#0C1B16";

// Timeline ribbon geometry (1280x720, below the effects' safe bottom at y~587).
const RY = 650;
const RX0 = 40;
const RX1 = 1240;
const NODE_X = [40, 340, 640, 940, 1240];
const NODE_STARTS = [B1, B2, B3, B4, B5];
const NODE_LABELS = ["3S BLANK SCREEN", "HEALTH CHECK FOUND", "NEW DESIGN SYSTEM", "DEAD SCREENS CUT", "0.65 MB BUNDLE"];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const TimelineRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const progress = tween(sec(frame, B1, fps), 0, (END - B1) / fps, ease.linear);
  const fillW = mix(progress, 0, RX1 - RX0);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div style={{ position: "absolute", left: RX0, top: RY, width: RX1 - RX0, height: 4, background: P.border }} />
      <div style={{ position: "absolute", left: RX0, top: RY, width: fillW, height: 4, background: frame >= B5 ? P.success : P.accent }} />

      {NODE_X.map((x, i) => {
        const active = frame >= NODE_STARTS[i];
        const final = i === 4 && frame >= B5;
        return (
          <Arrive key={i} at={NODE_STARTS[i]} kind="punch" box={{ x: x - 10, y: RY - 10, w: 20, h: 20 }}>
            <div
              style={{
                position: "absolute",
                left: x - 10,
                top: RY - 10,
                width: 20,
                height: 20,
                borderRadius: 10,
                background: active ? (final ? P.success : P.accent) : P.card,
                border: `3px solid ${active ? (final ? P.success : P.accent) : P.border}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: Math.max(16, Math.min(x - 85, 1100)),
                top: RY - 44,
                width: 170,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                color: active ? (final ? P.success : P.accent) : P.muted,
              }}
            >
              {NODE_LABELS[i]}
            </div>
          </Arrive>
        );
      })}
    </div>
  );
};

const BundleResult: React.FC = () => {
  const P = usePalette();
  return (
    <>
      <Headline y={56} text="Main bundle: 2.4MB to 0.65MB" accentColor={P.success} fontSize={32} />
      <Arrive at={B5 + 4} kind="rise" box={{ x: 300, y: 150, w: 260, h: 180 }}>
        <IconCard x={300} y={150} w={260} emoji="📦" title="Before" sub="2.4 MB first load" tone="danger" />
      </Arrive>
      <Arrive at={B5 + 14} kind="rise" box={{ x: 720, y: 150, w: 260, h: 180 }}>
        <IconCard x={720} y={150} w={260} emoji="⚡" title="After" sub="0.65 MB first load" tone="success" />
      </Arrive>
    </>
  );
};

const RESULT_LINES: LogLine[] = [
  { t: "build", text: "bundle analyze: main.js", tone: "muted" },
  { t: "build", text: "design system: tree-shaken", tone: "accent" },
  { t: "build", text: "dead screens: removed from bundle", tone: "accent" },
  { t: "build", text: "health-check blocker: removed", tone: "accent" },
  { t: "build", text: "before: 2.4 MB first load", tone: "danger" },
  { t: "build", text: "after: 0.65 MB first load", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the blank screen, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Three seconds, blank screen", kicker: "Elvarika: every visitor waited before anything appeared" }}
      />

      {/* b2 — why it waited (problem_en) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="copyCorrection"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          wrong: "Looked like a slow network",
          right: "A blocking health check, plus years of unused pages",
          label: "Actually",
        }}
      />

      {/* b3 — the fix, over the features hub */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["New design system", "New colors and fonts", "Cleaned-up React codebase"],
          result: "One interface, rebuilt",
          system: "React",
        }}
      />

      {/* b4 — the cleanup, over the feature's own page reloading fast */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Health check blocks render",
          to: "First screen just appears",
          points: ["Dead screens deleted", "Blocking check removed"],
        }}
      />

      {/* b5 — drawn only: no verified commit URL, holds to the end at full brightness */}
      {frame >= B5 && <BundleResult />}
      {frame >= B5 && (
        <LogWindow
          lines={RESULT_LINES}
          title="build output"
          from={B5 + 60}
          every={14}
          opacity={1}
          win={{ x: 180, y: 360, w: 920, h: 220 }}
        />
      )}

      <TimelineRibbon />
    </AbsoluteFill>
  );
};

export const FeatureElvarikasInterfaceGetsRealE04: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
