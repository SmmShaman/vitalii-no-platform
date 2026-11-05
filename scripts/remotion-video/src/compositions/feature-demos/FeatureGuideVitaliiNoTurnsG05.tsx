// FeatureGuideVitaliiNoTurnsG05 — feature g05 — 1280x720, 927 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
// RE-SHOOT (2026-11-05): narration unchanged, picture rewritten end to end.
//
// Guide — Stories on the Road: a personal audio guide for driving. The phone knows where
// it is and plays short local-history stories about the places around it, in Norwegian and
// Ukrainian side by side. Three real commits now exist and are folded into the drawn
// mechanism with their real names — none of them has a verified URL this time, so none is
// recorded; the pipeline stays drawn on a dark stage, never a live code recording:
// - android/.../DriveService.java, Prefs.java — keep telling stories in dead zones
// - worker/src/index.js, app.js, sw.js — drive pack for dead zones, street stories first
// - runner/revoice.py — re-voices published stories with the current voices
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
//              stage (no verified recording of the runner/worker code this time either).
//              Flow-map nodes light up one by one: Harvester → Runner · Claude →
//              Worker · Drive Pack → Phone · GPS. A side panel names the three real files.
// b4 647-772  "It reacts to wherever I am, not to any planned route." handoffExplain over the
//              features hub (the wider system this sits in), points carry the real
//              dead-zone/street-first/DriveService detail from the commits.
// b5 772-927  "And it never speaks without two solid sourced facts behind it." Drawn result
//              (no catalog effect, matching the b44/b45 precedent): a hero "2" fact-count
//              beside a vertical staged checklist of the completed chain — holds to END at
//              full brightness. The last beat is the result, never the page or hub.
//
// Persistent element: the flow-map ribbon (archetype 4), small in the bottom band
// (y >= 600) for b1-b4 so it never competes with an effect; it is replaced by the full-frame
// completed-chain finale for b5 (gate 2: the finale may not be the ribbon alone, it must be
// a new, filled result frame).

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

/** Mood "violet"'s own accent, dark stage tuned to sit under it. */
const ACCENT = "#5B37D4";
const STAGE = "#15122B";

const NODES = ["HARVESTER", "RUNNER · CLAUDE", "WORKER · DRIVE PACK", "PHONE · GPS"];

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
 *  empty top/side/bottom margins the dark stage leaves around it, and names the
 *  three real files the commits touched. */
const SystemFill: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;
  const t = tween(sec(frame, B3 + 6, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>🧭</div>
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
          right: 60,
          top: 46,
          width: 300,
          padding: "12px 16px",
          borderRadius: 6,
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${P.border}`,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, color: P.muted, marginBottom: 6 }}>REAL FILES</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#E8E4F9", lineHeight: 1.7, fontFamily: "monospace" }}>
          DriveService.java
          <br />
          worker/src/index.js
          <br />
          runner/revoice.py
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
        <span>🎧</span>
        <span>Harvester → Runner (Claude + revoice.py) → Worker (drive pack) → Phone</span>
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
  const heroPunch = punchScale(t, 0);
  const kickerUnderline = tween(t, 0.1, 0.5, ease.power3Out);
  const checklist = [
    { label: "Harvester pulls area facts", detail: "local-history wiki · OSM" },
    { label: "Runner writes with Claude", detail: "revoice.py keeps voices current" },
    { label: "Worker builds the drive pack", detail: "street stories cached first" },
    { label: "Phone plays by GPS position", detail: "DriveService survives dead zones" },
  ];

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 20% 40%, ${P.accentBg}22 0%, ${STAGE} 70%)`,
        }}
      />
      <div style={{ position: "absolute", left: 70, top: 52, transform: `scale(${heroPunch})`, transformOrigin: "left top" }}>
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 3, color: "#B9C2CC" }}>THE WHOLE CHAIN, LIT UP</div>
        <div style={{ width: kickerUnderline * 340, height: 3, background: P.accent, marginTop: 10 }} />
      </div>

      <div style={{ position: "absolute", left: 70, top: 160, width: 460, transform: `scale(${heroPunch})`, transformOrigin: "left top" }}>
        <div style={{ fontSize: 220, fontWeight: 800, color: P.accent, lineHeight: 1 }}>2</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#F5F7FA", marginTop: 4, maxWidth: 400 }}>
          sourced facts required, every single story
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#9BA3B4", marginTop: 14, maxWidth: 400 }}>
          Never a generated guess — the companion stays silent until it has them.
        </div>
      </div>

      <div style={{ position: "absolute", left: 630, top: 110, width: 560, display: "flex", flexDirection: "column", gap: 18 }}>
        {checklist.map((item, i) => {
          const at = B5 + 24 + i * 16;
          if (frame < at) return null;
          const sc = punchScale(sec(frame, at, fps), 0);
          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                background: P.successBg,
                border: `2px solid ${P.successEdge}`,
                padding: "14px 18px",
                transform: `scale(${sc})`,
                transformOrigin: "left center",
              }}
            >
              <span style={{ fontSize: 22 }}>✅</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: P.success }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: P.muted, marginTop: 2 }}>{item.detail}</div>
              </div>
            </div>
          );
        })}
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
          wrong: "A fixed route, planned once",
          right: "Never the same route twice",
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

      {/* b3 — the mechanism: no verified recording of the runner/worker code, dark stage */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["Harvester pulls area facts", "Runner writes a story with Claude", "revoice.py keeps the voice current", "Worker serves it by GPS"],
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
          points: ["Street stories play first", "Drive pack cached for dead zones", "DriveService keeps GPS alive in the background"],
        }}
      />

      <FlowMap />

      {/* b5 — the result: a hero fact-count beside the completed chain, holds to END */}
      <Finale />
    </AbsoluteFill>
  );
};

export const FeatureGuideVitaliiNoTurnsG05: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
