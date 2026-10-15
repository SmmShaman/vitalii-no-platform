// FeatureInsteadWaitingCameraKioskB68 — feature b68 — 1280x720, 872 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: Boytasks — screen time for the kids, gated by finishing school/chore tasks first
// (React + Cloudflare Workers + Supabase). This feature: the family TV used to trust only the
// hallway camera to know who was home — when one of the four boys slipped out, the TV kept
// treating him as present and the whole house stayed gated on a boy who had already left. Fix:
// a kiosk where any boy taps his own name the moment he leaves (a two-tap confirm guards
// against accidental taps), and workers/youtube-gate/index.js updates the house instantly; the
// camera brings him back the same way the moment it sees him again (commits f044a0a, 549a28e,
// 875a550).
//
// Beat → effect (data only from the feature's own sentences and those three commits):
// b1 15-164   "One of the four boys slipped out — TV still thought he was home" — titleTakeover,
//             over the feature's own page (backdrop "page") for texture; the old bug itself
//             isn't shown live anywhere, so the claim carries the beat.
// b2 164-339  "trusted only the hallway camera... whole house stuck" — quoteMarker, quoting the
//             old rule as the false premise, over the same page scrolled on (backdrop "page2").
// b3 339-465  "any boy taps his own name on the kiosk" — handoffExplain, BEFORE (wait for the
//             camera) -> NOW (tap your name), over the feature's own kiosk section
//             (backdrop "page3") — src/pages/TvPage.tsx named on screen.
// b4 465-651  "two-tap confirm... Cloudflare Workers updates instantly" — pipelineFlow, over the
//             feature's solution section (backdrop "page4") — workers/youtube-gate/index.js
//             named on screen.
// b5 651-872  "camera brings him back... two taps" — drawn, no page backdrop (gate 2): a dark
//             stage, LogWindow replaying the kiosk/camera handoff, hero number 2 (the taps),
//             holds to the final frame.
//
// Persistent element (archetype 0): a vertical divider splits the whole frame for the entire
// clip — a tinted "stuck" half (chaos, camera-only) on the left, a tinted "kiosk" half (order,
// instant) on the right, each carrying its own small in-half label, never a centered headline.
// Both halves are tinted at once for every beat; the divider itself slides left beat by beat as
// the fix takes over, until the kiosk half owns almost the whole frame. Deleting the divider
// would delete the one idea that survives all five pictures: before vs. after, side by side.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b68.json";

const B1 = 15;
const B2 = 164;
const B3 = 339;
const B4 = 465;
const B5 = 651;
const END = 872;

/** Bright, legible on the dark MotionInsert plate (violet's own accent #5B37D4 is too dark). */
const ACCENT = "#9B86FF";
const STAGE = "#140F24";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Divider holds one x per beat, sliding there over 0.45s at the start of that beat.
const STOPS: { at: number; x: number }[] = [
  { at: B1, x: 980 },
  { at: B2, x: 940 },
  { at: B3, x: 640 },
  { at: B4, x: 420 },
  { at: B5, x: 160 },
];

const dividerX = (frame: number, fps: number) => {
  if (frame < B1) return STOPS[0].x;
  let idx = 0;
  for (let i = 0; i < STOPS.length; i++) if (frame >= STOPS[i].at) idx = i;
  const cur = STOPS[idx];
  const prev = idx > 0 ? STOPS[idx - 1].x : cur.x;
  const p = tween(sec(frame, cur.at, fps), 0, 0.45, ease.power3Out);
  return mix(p, prev, cur.x);
};

type HalfLabel = { left: string; right: string };
const LABELS: { at: number; label: HalfLabel }[] = [
  { at: B1, label: { left: "STUCK ON OLD DATA", right: "kiosk: not tapped yet" } },
  { at: B2, label: { left: "RULE: CAMERA ONLY", right: "kiosk: waiting" } },
  { at: B3, label: { left: "BEFORE: wait for camera", right: "NOW: tap your name" } },
  { at: B4, label: { left: "old path (idle)", right: "2-TAP CONFIRM → WORKERS" } },
  { at: B5, label: { left: "", right: "HOME ↔ AWAY IN 2 TAPS" } },
];

/** Persistent archetype 0 spine: a sliding vertical divider, tinted halves, in-half labels. */
const SplitDuel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const x = dividerX(frame, fps);
  let cur = LABELS[0].label;
  for (const l of LABELS) if (frame >= l.at) cur = l.label;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: x, height: 720, background: P.danger, opacity: 0.16 }} />
      <div style={{ position: "absolute", left: x, top: 0, width: 1280 - x, height: 720, background: P.success, opacity: 0.14 }} />
      <div
        style={{
          position: "absolute",
          left: x - 2,
          top: 0,
          width: 4,
          height: 720,
          background: P.accent,
          boxShadow: `0 0 22px 4px ${P.accent}`,
        }}
      />
      {cur.left && (
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 24,
            padding: "8px 14px",
            borderRadius: 4,
            background: P.card,
            border: `2px solid ${P.dangerEdge}`,
            fontSize: 14,
            fontWeight: 800,
            color: P.danger,
            letterSpacing: 0.4,
          }}
        >
          {cur.left}
        </div>
      )}
      {cur.right && (
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 24,
            padding: "8px 14px",
            borderRadius: 4,
            background: P.card,
            border: `2px solid ${P.successEdge}`,
            fontSize: 14,
            fontWeight: 800,
            color: P.success,
            letterSpacing: 0.4,
            textAlign: "right",
          }}
        >
          {cur.right}
        </div>
      )}
    </div>
  );
};

/** b5 — no page backdrop allowed here (gate 2): dark stage, the kiosk/camera handoff, the "2". */
const ResultStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;
  const at = B5 + 100;
  const sc = frame >= at ? punchScale(sec(frame, at, fps), 0) : 0;
  const reveal = frame >= at ? 1 : tween(sec(frame, B5, fps), 0.1, 0.3, ease.power3Out);

  return (
    <>
      <LogWindow
        title="youtube-gate worker"
        from={B5 + 20}
        every={14}
        opacity={1}
        win={{ x: 140, y: 250, w: 1000, h: 280 }}
        fontSize={21}
        lines={[
          { t: "kiosk", text: "tap: boy → away", tone: "accent" },
          { t: "TvPage.tsx", text: "second tap confirms — no accidents", tone: "muted" },
          { t: "workers/youtube-gate", text: "activeIdSet() excludes him", tone: "ink" },
          { t: "guard", text: "NRK / Prisma / Kyivstar stay plain TV only", tone: "muted" },
          { t: "camera: hallway", text: "sees him again → away cleared", tone: "success" },
        ]}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 30,
          width: 1280,
          textAlign: "center",
          opacity: reveal,
          fontFamily,
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 800, color: P.success, transform: `scale(${sc || 1})`, lineHeight: 1 }}>2</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: P.ink, marginTop: 4 }}>taps to say he's gone — or that he's back</div>
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the claim: the TV didn't notice he'd left */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "He left. The TV didn't notice.", kicker: "Boytasks — one of four boys slipped out, the hallway camera still called him home" }}
      />

      {/* b2 — the false premise, quoted */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="quoteMarker"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          quote: "Trust only the hallway camera — and the whole house stays stuck on a boy who already left.",
          source: "old rule",
          highlight: "whole house stays stuck",
        }}
      />

      {/* b3 — the fix: tap your own name */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Wait for the hallway camera",
          to: "Tap your own name on the kiosk",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Any of the 4 boys", "The moment he's gone", "src/pages/TvPage.tsx"],
        }}
      />

      {/* b4 — the guard and the instant update */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page4" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Tap name once", "Confirm with second tap", "Workers push the update"],
          result: "House updates instantly — no accidental taps",
          system: "workers/youtube-gate/index.js",
        }}
      />

      {/* b5 — the result, holds to the end */}
      <ResultStage />

      <SplitDuel />

      {/* product plate — beat 1 only, so it doesn't sit unchanged across the whole clip */}
      {cut(frame, B1, B2) === 1 && (
        <Arrive at={B1 + 4} kind="wipe" box={{ x: 24, y: 86, w: 300, h: 60 }} dur={0.45}>
          <div style={{ position: "absolute", left: 24, top: 90 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2.2, color: ACCENT, fontFamily }}>BOYTASKS</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2, fontFamily }}>home/away kiosk · b68</div>
          </div>
        </Arrive>
      )}
    </AbsoluteFill>
  );
};

export const FeatureInsteadWaitingCameraKioskB68: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
