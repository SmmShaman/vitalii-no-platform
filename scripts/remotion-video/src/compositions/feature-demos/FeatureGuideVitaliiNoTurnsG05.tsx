// FeatureGuideVitaliiNoTurnsG05 — feature g05 — 1280x720, 927 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Guide — Stories on the Road: a personal audio guide for driving. The phone knows where
// it is and plays short local-history stories about the places around it, in Norwegian and
// Ukrainian side by side. Three pieces: a harvester pulling area facts from the local-history
// wiki/Wikipedia/OSM, a VPS runner that writes short stories with Claude — refusing to write
// anything without two concrete sourced facts — and voices them with edge-tts, and a
// Cloudflare Worker that serves whatever story is ready for the phone's current GPS position.
// No verified commit URL this time, so the pipeline beat (b3) is drawn on a dark stage with
// the real names from the feature text, never a live recording of code.
//
// Beat → effect:
// b1 15-226   "I drive the same region every day, but never the same route — any
//              fixed-itinerary app breaks by day two."
//              copyCorrection over the feature's own page (backdrop). Persistent flow-map
//              ribbon names the product (GUIDE) at the bottom, dim/inactive.
// b2 226-403  "I wanted to actually learn these places, in Norwegian and Ukrainian, without
//              staring at my phone." keywordCaption over the page, scrolled deeper.
// b3 403-647  "Now a companion rides along, turning real local-history facts into short
//              stories with Claude — like a friend narrating the drive." pipelineFlow, dark
//              stage (no verified recording of the runner code). Flow-map nodes light up
//              one by one: Harvester → Runner · Claude → Worker → Phone · GPS.
// b4 647-772  "It reacts to wherever I am, not to any planned route." handoffExplain over the
//              features hub (the wider system this sits in). Phone · GPS node stays active.
// b5 772-927  "And it never speaks without two solid sourced facts behind it." cardCounter
//              ("2 facts required") plus the completed flow map, all nodes lit — holds to
//              END at full brightness. The last beat is the result, never the page or hub.
//
// Persistent element: the flow-map ribbon (archetype 4), small in the bottom band
// (y >= 600) for b1-b4 so it never competes with an effect; it grows into the full-frame
// completed chain for the b5 finale.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g05.json";

const B1 = 15;
const B2 = 226;
const B3 = 403;
const B4 = 647;
const B5 = 772;
const END = 927;

/** Accent tuned for the dark stage. */
const ACCENT = "#8B5CF6";
const STAGE = "#161125";

const NODES = ["HARVESTER", "RUNNER · CLAUDE", "WORKER", "PHONE · GPS"];

// Ribbon geometry (1280x720, bottom band y >= 600 the effects keep clear).
const LT = { x: 40, y: 600, w: 1200, h: 104 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** -1 before the pipeline beat starts, 0-3 while nodes light up one by one through
 *  b3, 3 held through b4 (the phone/GPS node stays active), 4 once everything is done. */
const activeIndex = (frame: number): number => {
  if (frame < B3) return -1;
  if (frame < B4) {
    const step = (B4 - B3) / NODES.length;
    return Math.min(NODES.length - 1, Math.floor((frame - B3) / step));
  }
  if (frame < B5) return NODES.length - 1;
  return NODES.length;
};

const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B5) return null;

  const active = activeIndex(frame);
  const showBrand = frame < B2;
  const nodeW = 240;
  const gap = 36;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: LT.w,
            height: LT.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: LT.x + 22,
            top: LT.y + 10,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            color: P.muted,
            opacity: showBrand ? 1 : 0,
          }}
        >
          GUIDE
        </div>
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 26, fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>
          STORIES ON THE ROAD
        </div>
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 52, display: "flex", alignItems: "center", gap: 10 }}>
          {NODES.map((label, i) => {
            const done = active > i || active === NODES.length;
            const isActive = active === i;
            const tone = done ? P.success : isActive ? P.accent : P.muted;
            const bg = done ? P.successBg : isActive ? P.accentBg : P.chipBg;
            const edge = done ? P.successEdge : isActive ? P.accentEdge : P.border;
            return (
              <React.Fragment key={label}>
                <div
                  style={{
                    width: nodeW,
                    height: 40,
                    borderRadius: 4,
                    background: bg,
                    border: `2px solid ${edge}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 800,
                    color: tone,
                    letterSpacing: 0.5,
                  }}
                >
                  {label}
                </div>
                {i < NODES.length - 1 && (
                  <div style={{ width: gap, textAlign: "center", fontSize: 18, fontWeight: 800, color: P.muted }}>→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Arrive>
    </div>
  );
};

/** b3 only — pipelineFlow's own content sits in a mid-frame band; this fills the
 *  empty top/bottom margins the dark stage leaves around it. */
const SystemFill: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;
  const t = tween(sec(frame, B3 + 6, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>🗺️</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.accent }}>THE SYSTEM</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 820 }}>
            No story gets written without two concrete sourced facts behind it
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 548,
          width: 1160,
          height: 46,
          borderRadius: 6,
          background: P.card,
          border: `2px solid ${P.accent}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingLeft: 20,
          fontSize: 15,
          fontWeight: 700,
          color: P.ink,
        }}
      >
        <span>🎙️</span>
        <span>Harvester → Runner (Claude) → Worker → Phone — voiced with edge-tts</span>
      </div>
    </div>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;

  const t = sec(frame, B5, fps);
  const punch = punchScale(t, 0);
  const underline = tween(t, 0.2, 0.7, ease.power3Out);
  const nodeW = 260;
  const gap = 44;
  const startX = 140;
  const rowY = 330;

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 30%, ${P.accentBg} 0%, ${STAGE} 62%)`,
        }}
      />
      <div style={{ position: "absolute", left: startX, top: 150, transform: `scale(${punch})`, transformOrigin: "left top" }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: "#F5F7FA", letterSpacing: 2 }}>The whole chain, lit up</div>
        <div style={{ width: underline * 560, height: 4, background: P.accent, marginTop: 14 }} />
      </div>
      <div style={{ position: "absolute", left: startX, top: rowY, display: "flex", alignItems: "center", gap }}>
        {NODES.map((label, i) => {
          const at = B5 + 20 + i * 14;
          if (frame < at) return null;
          const sc = punchScale(sec(frame, at, fps), 0);
          return (
            <React.Fragment key={label}>
              <div
                style={{
                  width: nodeW,
                  height: 72,
                  borderRadius: 8,
                  background: P.successBg,
                  border: `3px solid ${P.successEdge}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  fontSize: 20,
                  fontWeight: 800,
                  color: P.success,
                  transform: `scale(${sc})`,
                  transformOrigin: "center",
                }}
              >
                <span>✅</span>
                <span>{label}</span>
              </div>
              {i < NODES.length - 1 && <div style={{ fontSize: 28, fontWeight: 800, color: P.muted }}>→</div>}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: startX, top: rowY + 110, fontSize: 22, fontWeight: 700, color: "#B9C2CC", maxWidth: 1000 }}>
        Every story needs two sourced facts first — never a generated guess.
      </div>
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="copyCorrection"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          wrong: "A fixed delivery route, planned once",
          right: "A route that is never the same twice",
          label: "Breaks by day two",
        }}
      />

      {/* b2 — the desire: learn the places, in two languages */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "I wanted to learn these places,",
          line2: "in Norwegian and Ukrainian, without the phone",
          keywords: ["Norwegian", "Ukrainian"],
        }}
      />

      {/* b3 — the mechanism: no verified recording of the runner code, dark stage */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["Harvester pulls area facts", "Runner writes a story with Claude", "Needs 2 sourced facts first", "edge-tts voices the story"],
          result: "Ready to play, like a friend narrating",
          system: "Local-history companion",
        }}
      />
      <SystemFill />

      {/* b4 — reacts to location, not a route, over the features hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Follows a planned route",
          to: "Reacts to GPS position",
          fromLabel: "ROUTE PLANNER",
          toLabel: "NOW",
          points: ["No fixed itinerary needed", "Cloudflare Worker serves by location", "Android app runs GPS as a foreground service"],
        }}
      />

      <FlowMap />

      {/* b5 — the result: the completed chain, then the hero number on top, holds to END */}
      <Finale />
      <MotionInsert
        effect="cardCounter"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        data={{
          cards: [{ label: "Sourced facts required", value: 2 }],
          unit: "facts",
          totalLabel: "Minimum, every story",
        }}
      />
    </AbsoluteFill>
  );
};

export const FeatureGuideVitaliiNoTurnsG05: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
