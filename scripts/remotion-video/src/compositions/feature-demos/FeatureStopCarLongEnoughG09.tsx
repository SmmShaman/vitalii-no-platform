// FeatureStopCarLongEnoughG09 — feature g09 — 1280x720, 899 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Voice-synced beat windows (measured, immutable): b1 15-190, b2 190-362,
// b3 362-520, b4 520-689, b5 689-899 (holds to end).
//
// Beat -> effect (data only from the feature row and commit 721f400):
// b1 15-190   "the story already ended on the way in"
//             quoteMarker over the feature's own write-up page (backdrop).
//             The lower third (archetype 2) is wide: a small map-and-card
//             mock of the whole app, zoom x1, labelled "WIDE VIEW".
// b2 190-362  "every place only ever told one short clip"
//             cornerTags: the claim + four facts from problem_en, over the hub.
// b3 362-520  "the app notices when you actually stop"
//             statusFocus over the write-up scrolled to the dwell paragraph.
//             The lower third zooms to x2 on the speed badge.
// b4 520-689  "its AI reads the full local history article"
//             handoffExplain (short excerpt -> full article, dossier.py)
//             over the write-up scrolled to the deep-dive paragraph.
//             The lower third zooms to x4 on the article panel.
// b5 689-899  "once a snippet, now the whole piece, 12,000 characters"
//             ratioBars: 12,000 (main article) vs 32,000 (with related pages).
//             No live backdrop here (gate: last beat must be the feature's
//             own result, not its page or the hub). Lower third zooms to x6
//             on the character counter — the clip ends on this number.
//
// Persistent element: the "camera" lower third (archetype 2), b1 through b5 —
// a miniature map-and-card mock whose viewfinder rectangle shrinks and moves
// deeper into one element every beat, with a zoom-factor readout. It owns
// y>=606; the motion effects above keep the frame above that line.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g09.json";

const B1 = 15;
const B2 = 190;
const B3 = 362;
const B4 = 520;
const B5 = 689;
const END = 899;

/** Accent tuned for the dark stage. */
const ACCENT = "#2BB3A3";
const STAGE = "#0F1A17";

// Lower third geometry (1280x720, below the effects' safe bottom at y~=600).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const MAP_X = 70;
const MAP_Y = LT.y + 10;
const MAP_W = 150;
const MAP_H = 72;

// Viewfinder targets inside the mini map, one per beat (x,y,w,h in map-local px).
const TARGETS = [
  { x: 4, y: 4, w: MAP_W - 8, h: MAP_H - 8, zoom: 1, label: "WIDE VIEW" }, // b1
  { x: 14, y: 10, w: 60, h: 26, zoom: 2, label: "ONE PLACE" }, // b2
  { x: 90, y: 12, w: 40, h: 20, zoom: 2, label: "SPEED CHECK" }, // b3
  { x: 18, y: 36, w: 70, h: 28, zoom: 4, label: "FULL ARTICLE" }, // b4
  { x: 44, y: 48, w: 30, h: 16, zoom: 6, label: "12,000 -> 32,000 CHARS" }, // b5
];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const beatStarts = [B1, B2, B3, B4, B5];
  let idx = 0;
  for (let i = 0; i < beatStarts.length; i++) if (frame >= beatStarts[i]) idx = i;
  const prevIdx = Math.max(0, idx - 1);
  const at = beatStarts[idx];
  const p = tween(sec(frame, at, fps), 0, 0.6, ease.power3InOut);
  const from = TARGETS[prevIdx];
  const to = TARGETS[idx];
  const vx = idx === prevIdx ? to.x : mix(p, from.x, to.x);
  const vy = idx === prevIdx ? to.y : mix(p, from.y, to.y);
  const vw = idx === prevIdx ? to.w : mix(p, from.w, to.w);
  const vh = idx === prevIdx ? to.h : mix(p, from.h, to.h);
  const zoom = idx === prevIdx ? to.zoom : mix(p, from.zoom, to.zoom);

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
      </Arrive>

      {/* miniature map-and-card mock: a wide view the camera zooms into */}
      <div
        style={{
          position: "absolute",
          left: MAP_X,
          top: MAP_Y,
          width: MAP_W,
          height: MAP_H,
          background: P.successBg,
          border: `2px solid ${P.successEdge}`,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            style={{
              position: "absolute",
              left: 10 + (n % 2) * 70,
              top: 8 + Math.floor(n / 2) * 30,
              width: 16,
              height: 16,
              borderRadius: 8,
              background: P.ink,
            }}
          />
        ))}
      </div>

      {/* viewfinder brackets: scale+move onto the active target */}
      <div
        style={{
          position: "absolute",
          left: MAP_X + vx,
          top: MAP_Y + vy,
          width: vw,
          height: vh,
          border: `3px solid ${P.accent}`,
          boxShadow: "0 0 0 2px rgba(0,0,0,0.3)",
        }}
      />

      <div style={{ position: "absolute", left: MAP_X + MAP_W + 28, top: LT.y + 14, width: 420 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
          ZOOM &times;{Math.round(zoom)}
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: P.ink, marginTop: 4 }}>{to.label}</div>
      </div>

      <div style={{ position: "absolute", left: 760, top: LT.y + 16, width: 400, textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>GUIDE</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
          Stories on the Road
        </div>
      </div>
    </div>
  );
};

/** Beat 1 only: names the product in one plain line (owner rule, STEP 0e). */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B2) return null;
  const t = tween(sec(frame, B1 + 2, 30), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 18,
        width: 1280,
        textAlign: "center",
        opacity: t,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: P.accent }}>
        GUIDE — STORIES ON THE ROAD
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#E8F4F1", marginTop: 2 }}>
        Knows where you are. Plays short stories about places nearby — Norwegian + Ukrainian.
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own write-up */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-top" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="quoteMarker"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          quote: "You park by the farm. Walk around. The story already ended on the way in.",
          highlight: "already ended",
          source: "Every stop, before today",
        }}
      />
      <ProductPlate />

      {/* b2 — what every place offered before (problem_en) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile as any} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "One short clip. One tiny slice of history.",
          tags: ["Same clip every time", "Built from a short excerpt", "No matter how long you stay", "Nothing deeper offered"],
        }}
      />

      {/* b3 — the fix: a real dwell check, not a slow corner */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-mid" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Is this a real stop?",
          claims: [
            { text: "Driving past at speed", verdict: "no" },
            { text: "Slowing for a corner", verdict: "unclear" },
            { text: "Parked, walking around", verdict: "yes" },
          ],
        }}
      />

      {/* b4 — the deep dive, over the write-up's deep-dive paragraph (dossier.py, 721f400) */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-mid2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Short excerpt (first story)",
          to: "Full local-history article",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Up to 12,000 characters read", "Related pages folded in too", "Skips what you already heard", "dossier.py, deep=True"],
        }}
      />

      {/* b5 — the result: drawn only, holds to the end (no page/hub on the last beat) */}
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        plate={0}
        data={{
          title: "Characters built into the deep story",
          a: { label: "Main article alone", value: 12000 },
          b: { label: "With related pages", value: 32000 },
          unit: "chars",
          caption: "Once a snippet, now the whole piece",
        }}
      />

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureStopCarLongEnoughG09: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
