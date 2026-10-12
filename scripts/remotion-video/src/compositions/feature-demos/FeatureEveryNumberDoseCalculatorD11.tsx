// FeatureEveryNumberDoseCalculatorD11 — feature d11 — 1280x720, 927 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// feature's own real live page as evidence where there is one, one owner of
// the frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature's own problem/solution/result text):
// b1 15-198   "Bumping carbs up by 15 grams meant tapping a tiny plus button
//             fifteen times."
//             drawn (no catalog effect, keeps the sidebar FULL) — product
//             plate names the Insulin Simulator, the feature's own real page
//             plays in a browser window on the right stage. Sidebar FULL at
//             "15" / TAPS PER CHANGE (danger).
// b2 198-343  "Swipe a food row by accident and it was simply gone, with no
//             way back."
//             statusFocus over the same real page (continuing, backdrop
//             dimmed) — the claim plus the missing undo. Sidebar shrinks to
//             the lower-third band, flips to "0" / UNDO AFTER SWIPE (danger).
// b3 343-495  "The only fix was re-adding it and recalculating the whole
//             day's log by hand."
//             costLedger over the features hub (dimmed) — the manual steps
//             one accidental swipe cost. Sidebar stays "0" / UNDO AFTER
//             SWIPE — same problem, not a new turning point.
// b4 495-654  "A new JavaScript module lets you scrub a number to its value,
//             like turning a dial."
//             handoffExplain, drawn only (no backdrop) — before/now hand-off
//             from tapping to scrubbing. Sidebar flips to "1" / SCRUB PER
//             CHANGE (accent) at this beat's first frame. One tech-term
//             gloss caption: "JavaScript — the code running in your browser."
// b5 654-927  "Now that 15-gram change takes one scrub instead of fifteen
//             taps, and a deleted row returns within 5 seconds."
//             drawn (no catalog effect) — sidebar returns FULL at "5s" /
//             UNDO WINDOW (success), a log window on the right shows the
//             real before/after facts. Holds to the end at full brightness,
//             no fade.
//
// Persistent element: the sidebar (archetype 6) — a full-height left column
// (x:0-320) in b1/b5 (the two beats with no catalog effect under it), shrunk
// into the lower-third band (y >= 606, below the effects' safe bottom) for
// b2-b4 so it never collides with the catalog effect above it. Value/tone
// flip at each real turning point: "15"/danger -> "0"/danger (B2) ->
// "1"/accent (B4) -> "5s"/success (B5).
//
// No commit evidence shown — only the feature's own page and the features
// hub were verified tonight; no GitHub URL, so none of 34e6ff5/0db315b/
// 7360c30 is displayed (34e6ff5's message is the closest match of the three,
// but without a verified recordable URL the rule still withholds it, same as
// d12 and d13).
//
// Gate 2: the clip does NOT end on the feature's own page or the hub — b5 has
// no LiveBackdrop at all, only the drawn sidebar + result + LogWindow.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow, LiveWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d11.json";

const B1 = 15;
const B2 = 198;
const B3 = 343;
const B4 = 495;
const B5 = 654;
const END = 927;

/** Bright mint-green on a near-black green-tinted plate — mint's dark-plate pair. */
const ACCENT = "#2DD98A";
const STAGE = "#0A1712";

// Right stage — where everything that isn't the sidebar lives, never under it.
const STAGE_X = 356;
const STAGE_W = 864;

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the
// sidebar's SMALL home for b2-b4, same geometry family as other dark clips.
const BAND = { x: 40, y: 606, w: 460, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Phase = { value: string; label: string; tone: "danger" | "accent" | "success" };

/** archetype 6 — the sidebar, present every beat, FULL left column when it
    owns the frame alone (b1/b5) and shrunk into BAND while a catalog effect
    sits above it (b2-b4). Flips at each real turning point in the story. */
const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const phase: Phase =
    frame < B2
      ? { value: "15", label: "TAPS PER CHANGE", tone: "danger" }
      : frame < B4
      ? { value: "0", label: "UNDO AFTER SWIPE", tone: "danger" }
      : frame < B5
      ? { value: "1", label: "SCRUB PER CHANGE", tone: "accent" }
      : { value: "5s", label: "UNDO WINDOW", tone: "success" };

  const color = phase.tone === "danger" ? P.danger : phase.tone === "accent" ? ACCENT : P.success;
  const bg = phase.tone === "danger" ? P.dangerBg : phase.tone === "accent" ? "rgba(45,217,138,0.14)" : P.successBg;
  const big = frame < B2 || frame >= B5;

  if (big) {
    const inAt = frame < B2 ? B1 : B5;
    const t = tween(sec(frame, inAt + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 320,
          height: 720,
          background: "rgba(5,10,8,0.92)",
          borderRight: `2px solid rgba(255,255,255,0.14)`,
          opacity: t,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 56,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2,
            color: "rgba(245,245,242,0.6)",
            fontFamily,
          }}
        >
          CARB STEPPER
        </div>
        <div style={{ position: "absolute", left: 32, top: 90, fontSize: 92, fontWeight: 800, lineHeight: 1, color, fontFamily }}>
          {phase.value}
        </div>
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 200,
            padding: "9px 18px",
            borderRadius: 4,
            background: bg,
            border: `2px solid ${color}`,
            color,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1,
            fontFamily,
            maxWidth: 256,
          }}
        >
          {phase.label}
        </div>
      </div>
    );
  }

  const flipAt = frame < B4 ? B2 : B4;
  const punch = Math.max(0, punchScale(sec(frame, flipAt, fps), 0) - 1);
  return (
    <Arrive at={B2 + 4} kind="wipe" box={BAND} dur={0.4}>
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
        <div style={{ fontSize: 42, fontWeight: 800, color, transform: `scale(${1 + punch * 0.3})` }}>{phase.value}</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>CARB STEPPER</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{phase.label}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — the discovery, fully drawn: product plate, the feature's own real
    page playing in a browser window, sidebar FULL at "15"/danger. */
const OpeningBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B1, B2) !== 1) return null;
  const t = sec(frame, B1, fps);
  const plateIn = tween(t, 0.1, 0.3, ease.power3Out);
  const winIn = tween(t, 0.35, 0.35, ease.power3Out);
  const captionIn = tween(t, 0.9, 0.3, ease.power2Out);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: STAGE_X,
          top: 60,
          padding: "7px 16px",
          background: "rgba(8,16,13,0.85)",
          border: "1.5px solid #8FEFC8",
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 700,
          color: "#F5F5F5",
          opacity: plateIn,
          maxWidth: STAGE_W - 20,
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
      <div style={{ position: "absolute", left: STAGE_X, top: 138, width: STAGE_W, height: 420, opacity: winIn }}>
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features"
          from={B1}
          hold={B2 - B1}
          opacity={1}
          win={{ x: 0, y: 0, w: STAGE_W, h: 420 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: STAGE_X,
          top: 586,
          width: STAGE_W,
          fontSize: 22,
          fontWeight: 700,
          color: "#F5F5F2",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Every small change meant hunting for a tiny plus button, tap by tap.
      </div>
    </>
  );
};

/** b4 — the mechanism, drawn only, with the clip's one tech-term gloss. */
const JsGloss: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B4, B5) !== 1) return null;
  const t = sec(frame, B4, fps);
  const in_ = tween(t, 1.0, 0.3, ease.power2Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 700,
        top: 650,
        width: 500,
        fontSize: 18,
        fontWeight: 600,
        color: "rgba(245,245,242,0.75)",
        opacity: in_,
        fontFamily,
        textAlign: "right",
      }}
    >
      JavaScript — the code running in your browser
    </div>
  );
};

const RESULT_LOG: Array<{ t: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { t: "before", text: "+15g change = 15 taps on the stepper", tone: "danger" },
  { t: "", text: "swipe a row by accident = gone, no undo", tone: "danger" },
  { t: "", text: "fix meant re-adding + recalculating by hand", tone: "muted" },
  { t: "now", text: "calc.js: new scrub-to-value module", tone: "accent" },
  { t: "", text: "+15g change = 1 scrub, not 15 taps", tone: "success" },
  { t: "", text: "deleted row returns within 5 seconds", tone: "success" },
];

/** b5 — the result, fully drawn: sidebar back FULL at "5s"/success, plus a
    log window with the real before/after facts. Holds to END, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const resultIn = tween(t, 0.1, 0.3, ease.power3Out);
  const captionIn = tween(t, 0.95, 0.3, ease.power2Out);

  return (
    <>
      <div style={{ position: "absolute", left: STAGE_X, top: 86, width: 400, opacity: resultIn, fontFamily }}>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 2, color: "rgba(245,245,242,0.6)" }}>
          15-GRAM CHANGE NOW TAKES
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1, color: "#34D399", marginTop: 4 }}>1</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 10,
            padding: "9px 18px",
            borderRadius: 4,
            background: "rgba(52,211,153,0.14)",
            border: "2px solid #34D399",
            color: "#34D399",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          SCRUB, NOT 15 TAPS
        </div>
      </div>
      <LogWindow
        lines={RESULT_LOG}
        title="calc.js"
        from={B5 + 14}
        every={14}
        opacity={1}
        win={{ x: 764, y: 56, w: 450, h: 470 }}
      />
      <div
        style={{
          position: "absolute",
          left: STAGE_X,
          top: 586,
          width: STAGE_W,
          fontSize: 22,
          fontWeight: 700,
          color: "#F5F5F2",
          opacity: captionIn,
          fontFamily,
        }}
      >
        One scrub instead of fifteen taps — and a swipe is never final.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — fifteen taps for one change, fully drawn, over the feature's own real page */}
      <OpeningBeat />

      {/* b2 — swipe gone with no undo, over the same real page (dimmed, continuing) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.8}
        data={{
          title: "AFTER AN ACCIDENTAL SWIPE",
          claims: [
            { text: "Food row swiped away", verdict: "yes" },
            { text: "Undo button available", verdict: "no" },
          ],
        }}
      />

      {/* b3 — the manual recalculation one swipe cost, over the features hub (dimmed) */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="costLedger"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.8}
        data={{
          title: "ONE ACCIDENTAL SWIPE =",
          unit: "steps",
          lines: [
            { label: "Re-add the deleted food", value: 1 },
            { label: "Recheck breakfast total", value: 1 },
            { label: "Recheck lunch total", value: 1 },
            { label: "Recheck dinner total", value: 1 },
          ],
          totalLabel: "STEPS BY HAND",
        }}
      />

      {/* b4 — the fix, drawn only (no backdrop), plus the one tech-term gloss */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          from: "Tap the plus button, fifteen times",
          to: "Drag one finger to the value",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["One scrub sets the number directly", "Works like turning a dial", "Powers every number in the calculator"],
        }}
      />
      <JsGloss />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureEveryNumberDoseCalculatorD11: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
