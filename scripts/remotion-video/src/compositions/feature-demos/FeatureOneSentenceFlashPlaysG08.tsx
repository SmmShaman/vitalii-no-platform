// FeatureOneSentenceFlashPlaysG08 — feature g08 — 1280x720, 977 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Voice-synced beat windows (measured, immutable): b1 15-185, b2 185-336,
// b3 336-510, b4 510-684, b5 684-808, b6 808-977 (holds to end).
//
// Beat -> effect (data only from the feature row and commit 0437e5f):
// b1  "driving through a valley, a story about a farm you were never headed toward"
//     quoteMarker over the feature's own write-up page (backdrop).
// b2  "every story just started mid-sentence, no warning before it began"
//     cornerTags: the claim + four facts, over the hub.
// b3  "GPS now checks whether your road actually passes the place" (0437e5f DriveService)
//     pipelineFlow over the write-up scrolled to the on-route paragraph.
// b4  "a short heads-up first — in 200 metres, right — before anything plays"
//     titleTakeover ("200M"), drawn only — this IS the hero figure for this beat,
//     no page/hub behind it, nothing competing for the centre.
// b5  "only a one-line flash follows, full narration waits"
//     keywordCaption, drawn only, lower-third — stays out of the centre so the
//     climax number in b6 is the next thing to own it.
// b6  "full narration only starts once you've stayed close for eight seconds"
//     hand-built hero figure (archetype 7's own climax, not a catalog effect):
//     fontSize 240, "8s" over "DWELL REACHED", the feature's own result,
//     holding to the end. Drawn only — gate 2 (last beat is the result, not
//     the feature's page or the hub).
//
// Archetype rule (STEP 0): the hero number owns the centre of the frame at
// every beat where it appears, and no beat runs a second centred catalog
// effect alongside it — b4 and b6 are each the single dominant thing on
// their own 1280x720 stage.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g08.json";

const B1 = 15;
const B2 = 185;
const B3 = 336;
const B4 = 510;
const B5 = 684;
const B6 = 808;
const END = 977;

const ACCENT = "#5B37D4";
const STAGE = "#110D24";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

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
      <div style={{ fontSize: 15, fontWeight: 600, color: "#2A2456", marginTop: 2 }}>
        Knows where you are. Plays short stories about places nearby — Norwegian + Ukrainian.
      </div>
    </div>
  );
};

/** Beat 6 only: the climax hero figure — hand-built, archetype 7's own dominant number. */
const HeroNumberFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B6) return null;
  const p = tween(sec(frame, B6 + 2, 30), 0, 0.5, ease.power3Out);
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: p,
          transform: `scale(${0.9 + 0.1 * p})`,
        }}
      >
        <div
          style={{
            fontSize: 240,
            fontWeight: 800,
            color: P.success,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          8s
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: 4,
            color: "#E7E3F8",
            marginTop: 18,
          }}
        >
          DWELL REACHED
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#9C93C9", marginTop: 10 }}>
          Full narration begins.
        </div>
      </div>
    </AbsoluteFill>
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
          quote: "Driving through a valley, you'd hear a story about a farm you were never actually headed toward.",
          highlight: "never actually headed toward",
          source: "Every drive, before today",
        }}
      />
      <ProductPlate />

      {/* b2 — no warning, mid-sentence, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile as any} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "No warning. It just began mid-sentence.",
          tags: ["Any nearby place", "On your road or not", "No heads-up first", "Full story, every time"],
        }}
      />

      {/* b3 — the fix: on-route check (0437e5f DriveService), over the write-up */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-mid" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Live GPS position", "Match to road path", "Check distance to place"],
          result: "On-route only",
          system: "0437e5f DriveService",
        }}
      />

      {/* b4 — the heads-up number, drawn only: this IS the hero figure for this beat */}
      <MotionInsert
        effect="titleTakeover"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0}
        data={{
          title: "200M",
          kicker: "Heads-up first — before anything plays.",
        }}
      />

      {/* b5 — the flash-only line, drawn only, lower-third so it doesn't fight b6's number */}
      <MotionInsert
        effect="keywordCaption"
        from={B5}
        dur={B6 - B5}
        accent={ACCENT}
        base={STAGE}
        plate={0}
        data={{
          line1: "Only a one-line flash follows.",
          line2: "Full narration waits.",
          keywords: ["one-line", "waits"],
        }}
      />

      {/* b6 — the result: hand-built hero figure, drawn only, holds to the end */}
      <HeroNumberFinal />
    </AbsoluteFill>
  );
};

export const FeatureOneSentenceFlashPlaysG08: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
