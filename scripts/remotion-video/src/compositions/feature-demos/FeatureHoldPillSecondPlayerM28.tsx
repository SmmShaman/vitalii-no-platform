// FeatureHoldPillSecondPlayerM28 — feature m28 — 1280x720, 811 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood sand. Motion direction (feature-motion skill, 2026-10-07).
//
// Product: Mini Elvarika — Norwegian by Ear, a personal listening app for learning
// Norwegian (type a word or topic, Claude writes everyday A1-C1 scenes, edge-tts
// voices them, the player mixes Norwegian audio). Only two URLs were verified
// tonight — the feature's own page and the features hub — so only those two carry
// live recordings; b3/b4/b5 are drawn only (no backdrop) or dimmed-backdrop only,
// the way earlier clips in this codebase already do it. No GitHub URL was verified
// tonight, so no commit diff appears — commit fd21d39's own files (worker/public/
// app.js, sw.js, style.css) are referenced only by name, in the b5 log.
//
// b1 15-198    "With the phone in your pocket, fabric pressure alone could pause
//              the music or skip a track on its own." keywordCaption over a dimmed
//              LiveBackdrop of the feature's own page. Product plate names the app.
//              Hero banded at "0"/danger.
// b2 198-356   "Now a lock screen catches every stray touch, like a child-lock on
//              a car door." funnelAbsorption over the same dimmed backdrop
//              (continuous recording). Hero stays banded, "0"/danger.
// b3 356-508   "Only one deliberate move gets through: holding down the unlock
//              pill." Hero returns BIG, flips to "1"/success here — over a dimmed
//              LiveBackdrop of the features hub; a drawn hold-pill progress ring
//              on the right names the one gesture that gets through.
// b4 508-656   "A few lines of JavaScript throw up a full-screen lock the instant
//              you tap it." handoffExplain, drawn only (no backdrop) — the
//              mechanism itself. Hero shrinks back into the band, stays
//              "1"/success (the number already flipped in b3).
// b5 656-811   "Hold the pill for one second, and the player wakes back up."
//              Hero BIG again at "1"/success. Drawn LogWindow with the real
//              before/after facts and the feature's own file names, plus the
//              clip's one tech caption ("JavaScript"). Holds to END at full
//              brightness, no fade — the 656-766 spoken line plus a silent tail
//              to 811 that keeps the same held frame.
//
// Persistent element: the hero number (archetype 7) — BIG (fontSize 260, satisfies
// gate 1) in b3/b5, the two beats with no catalog effect competing for the upper
// frame; shrunk into the lower-third band (y >= 606) for b1/b2/b4 where a catalog
// effect or drawn explainer owns the stage above it. Value/tone flip exactly once,
// at b3's first frame — 0 -> 1.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/m28.json";

const B1 = 15;
const B2 = 198;
const B3 = 356;
const B4 = 508;
const B5 = 656;
const END = 811;

/** Brighter than sand's raw #B4531F so it reads on the dark plate. */
const ACCENT = "#F0924A";
const STAGE = "#1C140A";

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the hero
// number's SMALL home while a catalog effect or drawn explainer sits above it.
const BAND = { x: 40, y: 606, w: 420, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 7 — the hero number, present every beat, BIG when it owns the frame
    alone (b3/b5, no catalog effect) and shrunk into BAND while something else
    sits above it (b1/b2/b4). Flips once, at B3. */
const HeroFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B3;
  const value = flipped ? "1" : "0";
  const status = flipped ? "ONE DELIBERATE HOLD" : "ANY STRAY TOUCH COUNTS";
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const big = (frame >= B3 && frame < B4) || frame >= B5;

  if (big) {
    const inAt = frame < B4 ? B3 : B5;
    const t = tween(sec(frame, inAt + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div style={{ position: "absolute", left: 90, top: 150, width: 560, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(250,244,232,0.62)" }}>
          SECONDS TO TRIGGER IT
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
  const flipPunch = flipped ? Math.max(0, punchScale(sec(frame, B3, fps), 0) - 1) : 0;
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
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>SECONDS</div>
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
        background: "rgba(20,14,8,0.85)",
        border: "1.5px solid #E8C9A8",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        color: "#FAF4E8",
        opacity: t,
        maxWidth: 560,
        lineHeight: 1.4,
        fontFamily,
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>MINI ELVARIKA</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>
        Norwegian by Ear — a personal listening app, voiced scenes in your pocket
      </span>
    </div>
  );
};

/** b3 — drawn hold-pill progress ring, over a dimmed LiveBackdrop of the features hub. */
const HoldPillCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B3, B4) !== 1) return null;
  const t = tween(sec(frame, B3 + 6, fps), 0, 0.35, ease.power3Out);
  const ringT = tween(sec(frame, B3 + 10, fps), 0, 1.0, ease.power2Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 740,
        top: 140,
        width: 460,
        padding: 28,
        borderRadius: 6,
        background: "rgba(24,16,8,0.88)",
        border: `2px solid ${P.success}`,
        boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: P.success }}>🔒 ONE GESTURE GETS THROUGH</div>
      <div
        style={{
          margin: "18px auto",
          width: 160,
          height: 160,
          borderRadius: 80,
          border: `10px solid ${P.border}`,
          borderTopColor: P.success,
          transform: `rotate(${ringT * 360}deg)`,
          boxSizing: "border-box",
        }}
      />
      <div style={{ fontSize: 22, fontWeight: 800, color: "#FAF4E8", textAlign: "center" }}>HOLD ~1s</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(250,244,232,0.75)", marginTop: 14, textAlign: "center" }}>
        every other touch is caught — only the deliberate hold unlocks it
      </div>
    </div>
  );
};

/** b4 — a supplementary, always-visible lock-screen mockup on the right half of
    the frame, filling the space handoffExplain's own camera move leaves open. */
const PillLockPreview: React.FC = () => {
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
        background: "rgba(24,16,8,0.88)",
        border: `2px solid ${P.success}`,
        boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: P.success }}>
        📱 WHAT THE SCREEN DOES NOW
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
            color: "rgba(250,244,232,0.6)",
            textAlign: "center",
            padding: "0 12px",
          }}
        >
          Any tap in your pocket reaches the player
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>NOW — LOCKED</div>
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
            <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>SCREEN</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FAF4E8" }}>Full-screen lock</div>
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
            Hold pill
          </div>
        </div>
      </div>

      <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(250,244,232,0.75)", marginTop: 16 }}>
        up the instant you tap — no settings, no setup
      </div>
    </div>
  );
};

const RESULT_LOG: Array<{ t: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { t: "before", text: "pocket pressure alone could pause or skip a track", tone: "danger" },
  { t: "", text: "app.js: no gesture gate on playback", tone: "danger" },
  { t: "now", text: "sw.js + app.js: full-screen lock added", tone: "accent" },
  { t: "", text: "style.css: lock pill with hold-to-unlock", tone: "accent" },
  { t: "", text: "hold ~1s on the pill wakes the player", tone: "success" },
  { t: "", text: "stray touches blocked: 0 → full lock", tone: "success" },
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
        title="app.js"
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
          color: "#F5DEC0",
          background: "rgba(20,14,8,0.6)",
          borderRadius: 8,
          padding: "6px 14px",
          opacity: techIn,
          fontFamily,
        }}
      >
        JavaScript — a few lines of code running right in your browser
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 540,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#FAF4E8",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Hold the pill for one second — the player wakes back up.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1+b2 — fabric pressure skipping tracks, then the lock screen catching
          every stray touch, over the feature's own page (continuous recording) */}
      {cut(frame, B1, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B3 - B1} push={0.03} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{
          line1: "Fabric pressure alone",
          line2: "could skip your track",
          keywords: ["fabric pressure"],
        }}
      />
      <ProductPlate />

      {/* b2 — the catch, over the same dimmed backdrop */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.78}
        data={{
          inputs: ["Fabric pressure", "Pocket brush", "Accidental taps"],
          result: "Caught by the lock screen — a child-lock for your pocket",
        }}
      />

      {/* b3 — the one gesture that gets through, over a dimmed LiveBackdrop of the hub */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      {cut(frame, B3, B4) === 1 && <AbsoluteFill style={{ background: `rgba(20,14,8,${PLATE})` }} />}
      <HoldPillCard />

      {/* b4 — the mechanism, drawn only (no backdrop) */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          from: "Tap anywhere unlocks it",
          to: "Full-screen lock appears instantly",
          points: ["A few lines of JavaScript", "No settings, no setup", "Works the instant you tap"],
          fromLabel: "BEFORE",
          toLabel: "NOW",
        }}
      />
      <PillLockPreview />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <HeroFigure />
    </AbsoluteFill>
  );
};

export const FeatureHoldPillSecondPlayerM28: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
