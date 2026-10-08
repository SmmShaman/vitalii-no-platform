// FeatureOneCatalog23EffectsP73 — feature p73 — 1280x720, 997 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood mint. Motion direction (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence from the digest's 23-effect catalog, over the real
// product as evidence, one owner of the frame, a reading hold at the end of every beat,
// cuts not fades — the same direction as FeatureFirst20SecondsUsedP75Motion (p75).
//
// Beat → effect (data only from the feature row and commits 73dc668 / 6102737):
// b1 15-210   "writes a script for each news beat, then has to guess which graphic fits"
//             titleTakeover over the feature's own page. The catalog dock (archetype)
//             sits small in the lower third, grey chips, a "?" badge — nothing resolved yet.
// b2 210-421  "the script writer described a visual idea in prose; the renderer guessed"
//             cornerTags: the claim + four facts, over the page scrolled further. The dock
//             puts a red mismatch cross on one chip — the renderer picking the wrong one.
// b3 421-582  "now both sides read from one shared catalog of effects, built with Remotion"
//             handoffExplain over the real commit (73dc668, the digest-motion skill landing).
//             The one tech name ("Remotion") sits in the hand-off points. The dock's chips
//             flip from grey to lit — the catalog is now shared.
// b4 582-799  "no more generic fallback graphics — percent rings, region callouts and
//             timelines get picked by name instead" — effect: drawn. The archetype's
//             payoff: the dock zooms from the lower third to fill the frame, its three
//             named chips (Percent Ring, Region Callout, Timeline) punching large while
//             the other three dim — the catalog, read by name, up close.
// b5 799-997  "that catalog started at 12 effects and grew, the same evening, to 23"
//             ratioBars 12 → 23 over the real commit (6102737, motion grammar v2: 12
//             reworked + 11 new = 23). The dock zooms back to the lower third, fully lit,
//             a "23" badge popping where the "?" used to sit. Holds to the end, no fade.
//
// Persistent element: the catalog dock (archetype 2), b1 through b5 — it never leaves the
// frame; it only changes how close the camera sits to it.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p73.json";

const B1 = 15;
const B2 = 210;
const B3 = 421;
const B4 = 582;
const B5 = 799;
const END = 997;

/** Bright mint accent tuned for the dark stage plate. */
const ACCENT = "#38D996";
const STAGE = "#0C2018";

// The catalog dock: a lower third (archetype's resting geometry, matches the effects'
// safe-bottom band) that zooms up to fill the frame for b4's payoff, then docks back.
const DOCK = { x: 40, y: 606, w: 1200, h: 92 };
const FULL = { x: 140, y: 72, w: 1000, h: 556 };

const ZOOM_IN_START = B4 + 15;
const ZOOM_IN_DUR = 18;
const ZOOM_OUT_START = B5 - 26;
const ZOOM_OUT_DUR = 20;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Chip = { key: string; label: string; hero: boolean };
const CHIPS: Chip[] = [
  { key: "title", label: "Title Takeover", hero: false },
  { key: "corner", label: "Corner Tags", hero: false },
  { key: "handoff", label: "Handoff", hero: false },
  { key: "percent", label: "Percent Ring", hero: true },
  { key: "region", label: "Region Callout", hero: true },
  { key: "timeline", label: "Timeline", hero: true },
];

const CatalogDock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const inT = tween(sec(frame, ZOOM_IN_START, fps), 0, ZOOM_IN_DUR / fps, ease.power3Out);
  const outT = tween(sec(frame, ZOOM_OUT_START, fps), 0, ZOOM_OUT_DUR / fps, ease.power3Out);
  const zoom = inT * (1 - outT);

  const box = {
    x: mix(zoom, DOCK.x, FULL.x),
    y: mix(zoom, DOCK.y, FULL.y),
    w: mix(zoom, DOCK.w, FULL.w),
    h: mix(zoom, DOCK.h, FULL.h),
  };
  const heroReveal = zoom > 0.6;

  const mismatch = frame >= B2 && frame < B3;
  const lit = frame >= B3;
  const showQuestion = frame < B2;
  const showCounter = frame >= B5 + 40;
  const counterPop = showCounter ? punchScale(sec(frame, B5 + 40, fps), 0) : 1;

  const PAD = mix(zoom, 10, 30);
  const GAP = mix(zoom, 6, 18);
  const slotW = (box.w - PAD * 2 - GAP * 5) / 6;
  const slotH = box.h - PAD * 2 - mix(zoom, 0, 46);
  const slotY = box.y + PAD + mix(zoom, 0, 46);

  const kicker = heroReveal ? "PICKED BY NAME" : "THE EFFECTS CATALOG";
  const kickerSize = mix(zoom, 12, 20);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={DOCK} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: box.x,
            top: box.y,
            width: box.w,
            height: box.h,
            background: P.card,
            borderRadius: 6,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
      </Arrive>

      <div
        style={{
          position: "absolute",
          left: box.x + PAD,
          top: box.y + 10,
          fontSize: kickerSize,
          fontWeight: 800,
          letterSpacing: 2,
          color: P.accent,
        }}
      >
        {kicker}
      </div>

      {showQuestion && (
        <div
          style={{
            position: "absolute",
            left: box.x + box.w - 44,
            top: box.y + 10,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            color: P.danger,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
          }}
        >
          ?
        </div>
      )}

      {showCounter && (
        <div
          style={{
            position: "absolute",
            left: box.x + box.w - 56,
            top: box.y + 6,
            width: 44,
            height: 32,
            borderRadius: 6,
            background: P.success,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
            transform: `scale(${counterPop})`,
          }}
        >
          23
        </div>
      )}

      {CHIPS.map((chip, i) => {
        const x = box.x + PAD + i * (slotW + GAP);
        const isMismatchTarget = mismatch && chip.key === "corner";
        const dim = heroReveal && !chip.hero;
        const heroBig = heroReveal && chip.hero;
        const bg = isMismatchTarget ? P.dangerBg : lit ? (dim ? P.chipBg : P.successBg) : P.chipBg;
        const edge = isMismatchTarget ? P.dangerEdge : lit ? (dim ? P.border : P.successEdge) : P.border;
        const fg = isMismatchTarget ? P.danger : lit ? (dim ? P.muted : P.success) : P.muted;
        const labelSize = heroBig ? mix(zoom, 11, 26) : mix(zoom, 10, 16);
        return (
          <div
            key={chip.key}
            style={{
              position: "absolute",
              left: x,
              top: slotY,
              width: slotW,
              height: heroBig ? slotH * 1.12 : slotH,
              transform: heroBig ? `translateY(${-slotH * 0.06}px)` : undefined,
              borderRadius: 6,
              background: bg,
              border: `2px solid ${edge}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              boxSizing: "border-box",
              opacity: dim ? 0.55 : 1,
            }}
          >
            <div style={{ fontSize: labelSize, fontWeight: 800, color: fg, textAlign: "center", lineHeight: 1.15 }}>
              {chip.label}
            </div>
            {isMismatchTarget && (
              <div style={{ position: "absolute", fontSize: slotH * 0.7, color: P.danger, fontWeight: 900 }}>×</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Which graphic fits?", kicker: "My digest guesses, beat by beat" }}
      />

      {/* b2 — no shared vocabulary between the two steps */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Two sides, no shared vocabulary",
          tags: ["Idea described in prose", "Renderer's fixed list", "Guesswork every beat", "Mismatched graphics"],
        }}
      />

      {/* b3 — the fix, over the real commit landing the shared catalog skill */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="commit1" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Guessing from two separate lists",
          to: "One shared effects catalog",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Script picks an effect by name", "Renderer resolves the same name", "Built with Remotion"],
        }}
      />

      {/* b4 — archetype only: the dock zooms in, naming the three effects */}

      {/* b5 — the result, over the commit that took the catalog from 12 to 23, holds to the end.
          RatioBars already darkens its own stage (look.scrim) for text contrast, so stacking
          the usual plate=0.7 on top left the commit diff almost fully black behind the two
          bars — most of the frame read as empty. A much lighter plate here lets the real
          diff show through while RatioBars' own scrim still carries the text contrast. */}
      {frame >= B5 && <LiveBackdrop file={shotsFile} shot="commit2" from={B5} hold={END - B5} focus={{ x: 0.5, y: 0.3 }} />}
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.15}
        data={{
          title: "Effects in the shared catalog",
          a: { label: "Started the catalog", value: 12 },
          b: { label: "By the same evening", value: 23 },
          unit: "effects",
          caption: "+11 in one evening",
        }}
      />

      <CatalogDock />
    </AbsoluteFill>
  );
};

export const FeatureOneCatalog23EffectsP73: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
