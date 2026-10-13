// FeatureDoseCalculatorWasThreeD12 — feature d12 — 1280x720, 879 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood violet. Motion direction (feature-motion skill, 2026-10-12).
//
// Only two URLs were verified tonight — the feature's own page and the features
// hub — so only those two carry live recordings; b4 and b5 are drawn only (no
// backdrop), the way p77/p78's "drawn only" beats already do it in this codebase.
// No GitHub URL was verified tonight, so no commit diff appears anywhere in this
// clip — even though 0db315b's message ("sticky save bar") echoes b4, its own
// files are .claude/skills/* markdown, not the app code, so it is not shown.
//
// b1 15-182    "Logging a meal meant scrolling past three screens before you even
//              reached the food list." cornerTags over a dimmed LiveBackdrop of
//              the feature's own page — the three screens named from the real
//              restructure (base values, correction table, weight notes). Product
//              plate names the app. Hero enters the band at "3"/danger.
// b2 182-344   "Once the dose was calculated, you scrolled all the way back up
//              just to find save." statusFocus over the same dimmed backdrop
//              (continuous recording) — dose shown yes, save visible no. Hero
//              stays in the band, "3"/danger.
// b3 344-507   "A two-minute task, done several times a day, became a hunt every
//              single time." Hero returns BIG at "3"/danger over a dimmed
//              LiveBackdrop of the features hub; a drawn HuntCard on the right
//              names the repetition.
// b4 507-669   "A JavaScript rewrite put dose and save on one bar that follows
//              you down the page." handoffExplain, drawn only (no backdrop) —
//              the fix itself. Hero stays banded, still "3"/danger (the number
//              only changes once the result is spoken, in b5).
// b5 669-879   "The whole log now fits in one scroll instead of three, with save
//              always in view." Hero flips BIG to "1"/success here. Drawn
//              LogWindow with the real before/after facts, plus the clip's one
//              tech caption ("JavaScript"). Holds to END at full brightness, no
//              fade. Neither the feature page nor the hub is shown in this beat.
//
// Persistent element: the hero number (archetype 7) — BIG (fontSize 260,
// satisfies gate 1) in b3/b5, the two beats with no catalog effect competing for
// the upper frame; shrunk into the lower-third band (y >= 606) for b1/b2/b4 where
// a catalog effect or drawn explainer owns the stage above it. Value/tone flip
// exactly once, at b5's first frame — 3 -> 1.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d12.json";

const B1 = 15;
const B2 = 182;
const B3 = 344;
const B4 = 507;
const B5 = 669;
const END = 879;

/** Brighter than violet's #5B37D4 so it reads on the dark plate. */
const ACCENT = "#8C6FF5";
const STAGE = "#140F26";

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the hero
// number's SMALL home while a catalog effect or drawn explainer sits above it.
const BAND = { x: 40, y: 606, w: 420, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 7 — the hero number, present every beat, BIG when it owns the frame
    alone (b3/b5, no catalog effect) and shrunk into BAND while something else
    sits above it (b1/b2/b4). Flips once, at B5. */
const HeroFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B5;
  const value = flipped ? "1" : "3";
  const status = flipped ? "SAVE ALWAYS VISIBLE" : "SCROLL EVERY TIME";
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const big = (frame >= B3 && frame < B4) || frame >= B5;

  if (big) {
    const inAt = frame < B4 ? B3 : B5;
    const t = tween(sec(frame, inAt + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div style={{ position: "absolute", left: 90, top: 150, width: 560, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(245,245,242,0.62)" }}>
          SCREENS BEFORE SAVE
        </div>
        <div style={{ fontSize: 260, fontWeight: 800, lineHeight: 1, color, marginTop: 6 }}>{value}</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 14,
            padding: "10px 22px",
            borderRadius: 4,
            background: bg,
            border: `2px solid ${color}`,
            color,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          {status}
        </div>
      </div>
    );
  }

  const entryAt = frame < B3 ? B1 : B4;
  const flipPunch = flipped ? Math.max(0, punchScale(sec(frame, B5, fps), 0) - 1) : 0;
  return (
    <Arrive at={entryAt + 4} kind="wipe" box={BAND} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: BAND.x,
          top: BAND.y,
          width: BAND.w,
          height: BAND.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 22px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, color, transform: `scale(${1 + flipPunch * 0.3})` }}>
          {value}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>SCREENS</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{status}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — small product plate naming the app, over the dimmed LiveBackdrop + effect. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B1, B2) !== 1) return null;
  const t = tween(sec(frame, B1 + 4, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 24,
        padding: "7px 16px",
        background: "rgba(10,8,20,0.85)",
        border: "1.5px solid #CDC1F3",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        color: "#F5F5F5",
        opacity: t,
        maxWidth: 560,
        lineHeight: 1.4,
        fontFamily,
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>INSULIN SIMULATOR</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>
        an educational type-1-diabetes simulator — insulin calculator with a dose journal
      </span>
    </div>
  );
};

/** b3 — drawn hunt card over a dimmed LiveBackdrop of the features hub. */
const HuntCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B3, B4) !== 1) return null;
  const t = tween(sec(frame, B3 + 6, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 740,
        top: 140,
        width: 460,
        padding: 28,
        borderRadius: 6,
        background: "rgba(16,10,30,0.88)",
        border: `2px solid ${P.danger}`,
        boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: P.danger }}>🔁 EVERY SINGLE TIME</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#F5F5F2", marginTop: 8 }}>
        Same 3-screen scroll, 3-5× a day
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(245,245,242,0.75)", marginTop: 14 }}>
        a two-minute task, turned into a hunt
      </div>
    </div>
  );
};

/** b4 — a supplementary, always-visible (for the full beat) sticky-bar mockup on
    the right half of the frame. handoffExplain's own camera move + staggered
    points list leaves that half empty for a while; this card does not depend on
    that timing, so the right half is never left bare regardless of which frame
    is sampled. */
const StickyBarPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B4, B5) !== 1) return null;
  const t = tween(sec(frame, B4 + 6, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 780,
        top: 120,
        width: 420,
        padding: 28,
        borderRadius: 6,
        background: "rgba(16,10,30,0.88)",
        border: `2px solid ${P.success}`,
        boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: P.success }}>
        📌 WHAT THE SCROLL LOOKS LIKE NOW
      </div>

      <div style={{ marginTop: 18, opacity: 0.55 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>BEFORE</div>
        <div
          style={{
            marginTop: 6,
            height: 60,
            borderRadius: 4,
            border: `1.5px dashed ${P.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 700,
            color: "rgba(245,245,242,0.6)",
            textAlign: "center",
            padding: "0 12px",
          }}
        >
          Save lives up top — scroll away, it's gone
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>NOW — STICKY</div>
        <div
          style={{
            marginTop: 6,
            borderRadius: 4,
            border: `1.5px solid ${P.border}`,
            background: "rgba(0,0,0,0.3)",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>DOSE</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#F5F5F2" }}>6.0 U</div>
          </div>
          <div
            style={{
              padding: "10px 24px",
              borderRadius: 4,
              background: P.success,
              color: "#0A0A0A",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            Save
          </div>
        </div>
      </div>

      <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(245,245,242,0.75)", marginTop: 16 }}>
        the bar follows you down the page — never out of reach
      </div>
    </div>
  );
};

const RESULT_LOG: Array<{ t: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { t: "before", text: "calc.html: base values → correction → weight → food", tone: "danger" },
  { t: "", text: "save button: top of page only", tone: "danger" },
  { t: "now", text: "calc.html: one page, 3 compact steps", tone: "accent" },
  { t: "", text: "calc.js: sticky bottom bar added", tone: "accent" },
  { t: "", text: "dose + Save: visible while scrolling", tone: "success" },
  { t: "", text: "screens before save: 3 → 1", tone: "success" },
];

/** b5 — the result, fully drawn: LogWindow with the real before/after facts +
    the clip's one tech caption. Holds to END at full brightness, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const captionIn = tween(t, 0.9, 0.3, ease.power2Out);
  const techIn = tween(t, 1.3, 0.3, ease.power2Out);
  return (
    <>
      <LogWindow
        lines={RESULT_LOG}
        title="calc.js"
        from={B5 + 14}
        every={16}
        opacity={1}
        win={{ x: 660, y: 56, w: 560, h: 470 }}
        fontSize={18}
      />
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 14,
          maxWidth: 380,
          textAlign: "right",
          fontSize: 16,
          fontWeight: 700,
          color: "#DCD4F5",
          background: "rgba(10,8,20,0.6)",
          borderRadius: 8,
          padding: "6px 14px",
          opacity: techIn,
          fontFamily,
        }}
      >
        JavaScript — the code running in your browser
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 540,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#F5F5F2",
          opacity: captionIn,
          fontFamily,
        }}
      >
        One scroll instead of three — save is always in view.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1+b2 — the three-screen scroll, then the hunt for save, over the feature's
          own page (continuous recording, no restart) */}
      {cut(frame, B1, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B3 - B1} push={0.03} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{
          statement: "Three screens before food list",
          tags: ["Base values", "Correction table", "Weight notes"],
        }}
      />
      <ProductPlate />

      {/* b2 — the hunt for save, over the same dimmed backdrop */}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.78}
        data={{
          title: "After the dose is calculated",
          claims: [
            { text: "Dose shown on screen", verdict: "yes" },
            { text: "Save button visible", verdict: "no" },
          ],
        }}
      />

      {/* b3 — the daily hunt, over a dimmed LiveBackdrop of the features hub */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      {cut(frame, B3, B4) === 1 && <AbsoluteFill style={{ background: `rgba(10,8,20,${PLATE})` }} />}
      <HuntCard />

      {/* b4 — the fix, drawn only (no backdrop) */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          from: "Save button up top",
          to: "Sticky bar: dose + save",
          points: ["No more scrolling up", "Dose updates as you scroll", "Save one tap away"],
          fromLabel: "BEFORE",
          toLabel: "NOW",
        }}
      />
      <StickyBarPreview />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <HeroFigure />
    </AbsoluteFill>
  );
};

export const FeatureDoseCalculatorWasThreeD12: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
