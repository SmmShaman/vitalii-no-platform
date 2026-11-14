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
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b92.json";

const B1 = 15;
const B2 = 275;
const B3 = 462;
const B4 = 684;
const END = 936;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

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

/** b1 only — names the actual product behind this whole clip (WAVE D1 fix,
 *  2026-11-14): a blind viewer could not tell what app this "TV wall" belongs
 *  to. Bottom-left, clear of the cornerTags above and the hero "1" at cx=175. */
const ProductPlate: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < from) return null;
  const t = tween(sec(frame, from, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 420, top: 636, display: "flex", alignItems: "center", gap: 16, fontFamily, opacity: t }}>
      <div style={{ fontSize: 34 }}>📺</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1, color: "#fff" }}>Boytasks</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 2, maxWidth: 700 }}>
          Screen-time &amp; task system for three kids — the TV wall they unlock by finishing tasks
        </div>
      </div>
    </div>
  );
};

/** b2 only — the viewer could not see a second renderer, only a caption
 *  claiming one; draws it with the feature's own real component name
 *  (BoardCardBright, already named on the feature's own live page) so the
 *  claim has evidence beyond the caption, and glosses "React" in passing. */
const RendererSchematic: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < from) return null;
  const t = tween(sec(frame, from + 6, 30), 0, 0.35, ease.power3Out);
  const boxStyle: React.CSSProperties = {
    width: 260,
    height: 84,
    borderRadius: 10,
    background: P.card,
    border: `2px solid ${P.border}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily,
  };
  return (
    <div style={{ position: "absolute", left: 60, top: 76, width: 760, fontFamily, opacity: t }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={boxStyle}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: P.muted }}>ORIGINAL RENDERER</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: P.ink, marginTop: 4 }}>Dark skin only</div>
        </div>
        <div style={{ textAlign: "center", width: 80 }}>
          <div style={{ fontSize: 26, color: P.accent }}>→</div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: P.muted }}>SAME DATA</div>
        </div>
        <div style={{ ...boxStyle, border: `2px solid ${P.accentEdge}`, background: P.accentBg }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: P.accent }}>NEW RENDERER</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: P.ink, marginTop: 4 }}>BoardCardBright</div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, color: P.muted, maxWidth: 700 }}>
        Two React components draw the same card data — one dark, one bright.
      </div>
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
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "Every card looked the same",
          tags: ["Dark background", "Thin lines", "Tiny type", "No safe way to test"],
        }}
      />
      {cut(frame, B1, B2) === 1 && <ProductPlate from={B1 + 30} />}

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
      {cut(frame, B2, B3) === 1 && <RendererSchematic from={B2} />}

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
          // Repositioned (WAVE D1 fix, 2026-11-14): the hero "430" settles at
          // cx=640/cy=170 with an 840x360 box (y: -10 to 350) — the window
          // used to start at y=90 and sat directly under the digit, leaving
          // line 04 dim/overlapped. Moved below the digit's settled footprint
          // so every line is clear once the number lands.
          win={{ x: 290, y: 360, w: 700, h: 345 }}
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
