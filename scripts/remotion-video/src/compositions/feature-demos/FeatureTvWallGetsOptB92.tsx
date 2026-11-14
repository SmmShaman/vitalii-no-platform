// FeatureTvWallGetsOptB92 — feature b92 — 1280x720, 936 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: Boytasks — a screen-time and task system for three kids (Cloudflare
// Workers + Supabase). None of tonight's supplied commits (scripted-scenes work)
// match this feature's own sentences, so every beat is either a real recording
// of the feature's public page/hub (STEP 0c) or drawn (no commit is shown).
//
// Beat → effect (data only from the feature row: problem_en / solution_en / result_en):
// b1 15-275   "every card and scene looked the same — dark, thin lines, tiny
//             type, no safe way to try something brighter"
//             cornerTags over the feature's own page (shot "page").
// b2 275-462  "a second React renderer, running side by side, not replacing it"
//             keywordCaption over the features hub (shot "hub") — the hub's own
//             card grid is the closest public stand-in for "cards, side by side".
//             The clip's one tech-credibility caption ("React") sits top-right.
// b3 462-684  "one switch flips the whole wall bright, or just one child's —
//             same lessons, same timing, different skin"
//             handoffExplain over the feature's own page, scrolled further
//             (shot "page2").
// b4 684-936  "all 430" — the result. No page, no hub (gate 2): a LogWindow with
//             the feature's own verification numbers (13 templates, 9 scenes,
//             430 cards), built from result_en — this product keeps no runtime
//             log on the VPS, so nothing here is invented.
//
// Persistent element (archetype 7): one hero number, alive from frame 15 to the
// end — 1 (one look for every card) -> 2 (two renderers) -> 430 (the real
// result), moving corner to corner, finishing centred and large over the log.
import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/b92.json";

const B1 = 15;
const B2 = 275;
const B3 = 462;
const B4 = 684;
const END = 936;

/** Tuned lighter than dawn's #2563EB accent so it still reads on the dark plate. */
const ACCENT = "#5B9DFF";
const STAGE = "#101522";

const clampOpts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const HERO_BOX_W = 840;
const HERO_BOX_H = 360;

const HeroNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const stops = [B1, B2, B2 + 40, B4, B4 + 76, END];
  const size = interpolate(frame, stops, [230, 230, 230, 230, 300, 300], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const cx = interpolate(frame, stops, [175, 175, 1080, 1080, 640, 640], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const cy = interpolate(frame, stops, [560, 560, 560, 560, 170, 170], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const color = interpolateColors(frame, [B1, B2, B2 + 40, B4, B4 + 76], [P.muted, P.muted, P.accent, P.accent, P.success]);
  // The digit's own fontSize stays the literal, full-size 300 at all times — the
  // 230->300 grow is done with a transform scale on the box instead, so the hero
  // figure is always a real >=200px glyph, never a shrunk font-size.
  const scale = size / 300;

  let value: number;
  if (frame < B2) value = 1;
  else if (frame < B2 + 40)
    value = Math.round(interpolate(frame, [B2, B2 + 40], [1, 2], { ...clampOpts, easing: Easing.out(Easing.cubic) }));
  else if (frame < B4) value = 2;
  else if (frame < B4 + 76)
    value = Math.round(interpolate(frame, [B4, B4 + 76], [2, 430], { ...clampOpts, easing: Easing.out(Easing.cubic) }));
  else value = 430;

  const label =
    frame < B2 ? "ONE LOOK FOR EVERY CARD"
    : frame < B3 ? "TWO RENDERERS, SAME DATA"
    : frame < B4 ? "WHOLE WALL OR ONE CHILD"
    : "CARDS VERIFIED IDENTICAL";

  return (
    <div
      style={{
        position: "absolute",
        left: cx - HERO_BOX_W / 2,
        top: cy - HERO_BOX_H / 2,
        width: HERO_BOX_W,
        height: HERO_BOX_H,
        textAlign: "center",
        fontFamily,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      <div style={{ fontSize: 300, fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div
        style={{
          marginTop: 21,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 2,
          color: "#fff",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const LOG_LINES = [
  { t: "01", text: "13/13 card templates -> bright skin", tone: "success" as const },
  { t: "02", text: "9/9 didactic scenes -> bright skin", tone: "success" as const },
  { t: "03", text: "430 live cards diffed vs. dark", tone: "accent" as const },
  { t: "04", text: "dark rendering: byte-identical", tone: "success" as const },
  { t: "05", text: "board_skin -> whole wall: OK", tone: "ink" as const },
  { t: "06", text: "board_skin -> per child: OK", tone: "ink" as const },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "Every card looked the same",
          tags: ["Dark background", "Thin lines", "Tiny type", "No safe way to test"],
        }}
      />

      {/* b2 — the fix (a second renderer, not a replacement), over the hub's own card grid */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "A second renderer,", line2: "running side by side.", keywords: ["second", "side by side"] }}
      />
      {frame >= B2 && frame < B3 && (
        <div style={{ position: "absolute", left: 1040, top: 36, opacity: cut(frame, B2, B3) }}>
          <StatPill x={0} y={0} emoji="⚙️" text="React" tone="accent" fontSize={16} />
        </div>
      )}

      {/* b3 — the switch (whole wall or one child), scrolled further down the same page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Dark skin only",
          to: "Bright or dark, per child",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Same lessons", "Same timing", "Only the skin changes"],
        }}
      />

      {/* b4 — the result: no page, no hub (gate 2) — the real verification numbers instead */}
      {frame >= B4 && (
        <LogWindow
          lines={LOG_LINES}
          title="verify-skin.log"
          from={B4 + 10}
          every={28}
          opacity={1}
          win={{ x: 470, y: 90, w: 760, h: 560 }}
          fontSize={22}
        />
      )}

      <HeroNumber />
    </AbsoluteFill>
  );
};

export const FeatureTvWallGetsOptB92: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
