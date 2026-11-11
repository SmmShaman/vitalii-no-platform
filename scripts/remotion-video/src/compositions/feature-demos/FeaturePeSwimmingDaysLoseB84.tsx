// FeaturePeSwimmingDaysLoseB84 — feature b84 — 1280x720, 821 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood mint. Motion direction (feature-motion skill, 2026-11-11).
//
// Only two URLs were verified tonight — the feature's own page and the features
// hub — so only those two carry live recordings; b1 and b2 describe a chip that
// no longer exists in the shipped UI, so they are drawn only (no backdrop), the
// way d12/p77/p78's "drawn only" beats already do it in this codebase. None of
// the three given commits (8105113, aa00cd4, fa2325a) textually describes this
// chip-to-frame change — all three are about the delivery-shift report and the
// events-before-homework reorder — so no commit diff is shown anywhere; the fix
// is drawn from the feature's own words instead.
//
// Beat → effect (data only from the feature row):
// b1 15-237    "Swim or gym day used to get its own tiny chip, crammed next to
//              homework and real school events on our kitchen kiosk."
//              titleTakeover, drawn only. Product plate names Boytasks. A small
//              drawn OLD CELL mockup on the right shows three crowded chips.
// b2 237-367   "On a busy day, that chip for pack-your-kit just got buried."
//              cornerTags, drawn only — the same OLD CELL mockup continues,
//              one chip now dimmed/buried under the others.
// b3 367-527   "Now the whole cell gets a thin colored frame instead, drawn
//              with SVG." copyCorrection over a LiveBackdrop of the feature's
//              own page (shot "page") — chip corrected to frame.
// b4 527-638   "The kit word loops endlessly around that frame's edge."
//              keywordCaption over a LiveBackdrop of the same page, scrolled
//              further (shot "pageDetail") — continuous recording, no restart.
// b5 638-821   "Homework keeps its space, and the one reminder that matters
//              never disappears." Drawn only (gate 2: never page/hub here).
//              Hero flips BIG here. Drawn LogWindow with the real before/after
//              facts, plus the clip's one tech caption ("SVG"). Holds to END
//              at full brightness, no fade.
//
// Persistent element: the hero number (archetype 7) — BIG (fontSize 260,
// satisfies gate 1) in b5, the only beat with no catalog effect competing for
// the upper frame; shrunk into the lower-third band (y >= 606) for b1-b4 where
// a catalog effect owns the stage above it. Value/tone flip exactly once, at
// b5's first frame — the lesson's own row in the cell: 1 -> 0.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b84.json";

const B1 = 15;
const B2 = 237;
const B3 = 367;
const B4 = 527;
const B5 = 638;
const END = 821;

/** Brighter than mint's #0B7A5A so it reads on the dark plate. */
const ACCENT = "#3FD69A";
const STAGE = "#0B1A15";

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the hero
// number's SMALL home while a catalog effect sits above it.
const BAND = { x: 40, y: 606, w: 460, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 7 — the hero number, present every beat, BIG when it owns the frame
    alone (b5, no catalog effect competing) and shrunk into BAND while a catalog
    effect sits above it (b1-b4). Flips once, at B5: own row in the cell, 1 -> 0. */
const HeroFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B5;
  const value = flipped ? "0" : "1";
  const status = flipped ? "NO ROW — JUST A FRAME" : "OWN CHIP, OWN ROW";
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const big = flipped;

  if (big) {
    const t = tween(sec(frame, B5 + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div style={{ position: "absolute", left: 90, top: 150, width: 560, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(237,250,244,0.62)" }}>
          OWN ROW IN THE CELL
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

  const flipPunch = Math.max(0, punchScale(sec(frame, B1, fps), 0) - 1);
  return (
    <Arrive at={B1 + 4} kind="wipe" box={BAND} dur={0.4}>
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
        <div style={{ fontSize: 56, fontWeight: 800, color, transform: `scale(${1 + flipPunch * 0.15})` }}>
          {value}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>ROW IN THE CELL</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{status}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — small product plate naming the app, over the drawn titleTakeover. */
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
        background: "rgba(8,16,13,0.85)",
        border: "1.5px solid #9FE8C8",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        color: "#F5F5F5",
        opacity: t,
        maxWidth: 620,
        lineHeight: 1.4,
        fontFamily,
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>BOYTASKS</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>
        a screen-time and task system for my three kids — YouTube is gated by finishing the
        school and chore tasks first, run on Cloudflare Workers
      </span>
    </div>
  );
};

/** b1+b2 — drawn OLD CELL mockup: three chips crammed in one kiosk calendar
    cell. In b2, the kit chip dims — "buried" under homework and the event. */
const OldCellMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B1, B3) !== 1) return null;
  const t = tween(sec(frame, B1 + 10, fps), 0, 0.4, ease.power3Out);
  const buried = frame >= B2;
  const buriedP = buried ? tween(sec(frame, B2 + 6, fps), 0, 0.4, ease.power2Out) : 0;
  const chip = (label: string, dim: number) => (
    <div
      style={{
        borderRadius: 4,
        padding: "9px 12px",
        background: P.dangerBg,
        border: `2px solid ${P.dangerEdge}`,
        color: P.danger,
        fontSize: 15,
        fontWeight: 800,
        opacity: 1 - dim * 0.65,
        transform: `translateY(${dim * 6}px)`,
      }}
    >
      {label}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 760,
        top: 150,
        width: 440,
        padding: 26,
        borderRadius: 6,
        background: "rgba(10,20,17,0.88)",
        border: `2px solid ${P.danger}`,
        boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 2, color: P.danger }}>TUESDAY — OLD CELL</div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {chip("🏠 Homework due", 0)}
        {chip("🏫 Parent meeting 18:00", 0)}
        {chip("🩱 Pack swim kit", buriedP)}
      </div>
      {buried && (
        <div style={{ marginTop: 14, fontSize: 15, fontWeight: 700, color: "rgba(237,250,244,0.65)", opacity: buriedP }}>
          its own chip, crowded out
        </div>
      )}
    </div>
  );
};

const RESULT_LOG: Array<{ t: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { t: "before", text: "KioskFrame.tsx: kit lesson = its own chip + row", tone: "danger" },
  { t: "", text: "competes with homework for cell space", tone: "danger" },
  { t: "now", text: "kit-day matcher checks only the leading word", tone: "accent" },
  { t: "", text: "PerimeterWord: SVG textPath around the cell edge", tone: "accent" },
  { t: "", text: "word repeats a whole number of times — no seam", tone: "accent" },
  { t: "", text: "own row in the cell: 1 → 0", tone: "success" },
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
        title="KioskFrame.tsx"
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
          color: "#D4F5E6",
          background: "rgba(8,16,13,0.6)",
          borderRadius: 8,
          padding: "6px 14px",
          opacity: techIn,
          fontFamily,
        }}
      >
        SVG — vector drawing built into the browser
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 540,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#F0FAF4",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Homework keeps its space — the kit reminder never disappears.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the old chip, drawn only */}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        base={STAGE}
        data={{ title: "One tiny chip", kicker: "Crammed next to homework on the kiosk" }}
      />
      <ProductPlate />

      {/* b2 — buried on a busy day, drawn only (same OLD CELL mockup continues) */}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          statement: "On a busy day, the kit reminder got buried",
          tags: ["Pack-your-kit chip", "Stacked with homework", "Easy to miss"],
        }}
      />
      <OldCellMockup />

      {/* b3 — the fix, over the feature's own page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="copyCorrection"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          wrong: "Own small chip in the cell",
          right: "Whole cell = a thin SVG frame",
          label: "Now",
        }}
      />

      {/* b4 — the loop, over the same page, scrolled further (continuous recording) */}
      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="pageDetail" from={B4} hold={B5 - B4} />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "The kit word loops the frame's edge",
          line2: "No seam, no stop",
          keywords: ["loops", "edge"],
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <HeroFigure />
    </AbsoluteFill>
  );
};

export const FeaturePeSwimmingDaysLoseB84: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
