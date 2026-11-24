// FeatureTapKioskCalendarOpensB85 — feature b85 — 1280x720, 913 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Boytasks: the kitchen kiosk calendar already showed homework notes, but a child's real
// ukeplan — the actual PDF page the teacher sent — only ever existed as an email attachment
// a parent had to dig out and show on a phone. flyt_plans.py now watches the family's email
// archive on HOME-PC for any attachment named like a weekly plan, stores the PDF's own text
// untouched (weekly_plans) and every page rendered to a JPEG (weekly_plan_pages); a Cloudflare
// Worker gate serves those pages to a new WeeklyPlan.tsx screen opened full-screen from
// KioskFrame.tsx. Only two URLs were verified tonight — the feature's own page and the
// features hub — so only those two carry live recordings; b3 (the backend watcher) is drawn
// only, no backdrop.
//
// b1 15-202   "Every week, a teacher's homework plan landed as a PDF, buried in an email no
//             kid could open." titleTakeover over a LiveBackdrop of the feature's own page —
//             the opener, not reused from the last three clips (regionCallout, keywordCaption,
//             cardCounter). Product plate names Boytasks. Hero shrunk in the band, "0"/danger.
// b2 211-345  "To see it on TV, a parent had to dig it out and show it on a phone."
//             keywordCaption over the same page, scrolled further — a claim with no number,
//             so the two words that carry it are tagged. Hero stays banded, "0"/danger.
// b3 354-516  "Now Cloudflare watches that email for the PDF and turns every page into a
//             picture." pipelineFlow, drawn only (no backdrop) — the mechanism itself, named
//             with the real tables (weekly_plan_pages) since no GitHub URL was verified
//             tonight for a live diff. Hero stays banded, still "0"/danger.
// b4 525-696  "Tap the calendar, pick a week, and the real plan appears — swipe through it
//             like a book." handoffExplain over a LiveBackdrop of the features hub — the
//             product change itself (BEFORE/NOW), named with the real screen (WeeklyPlan.tsx).
//             Hero stays banded, still "0"/danger (the number only flips once the result is
//             spoken, in b5).
// b5 705-913  "Four boys, four calendars, each one opening its own week, no phone required."
//             Hero flips BIG to "4"/success here — the one beat with no catalog effect
//             competing for the upper frame. Drawn LogWindow with the real ingest facts, plus
//             the clip's one tech caption ("Cloudflare Workers"). Holds to END at full
//             brightness, no fade. Neither the feature page nor the hub is shown in this beat.
//
// Persistent element: the hero number (archetype 7) — shrunk into the lower-third band
// (y >= 606) for b1-b4 where a catalog effect owns the stage above it, then BIG (fontSize 260,
// satisfies gate 1) for b5, the only beat where it is the frame's sole owner. Value/tone flip
// exactly once, at b5's first frame — 0 -> 4.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b85.json";

const B1 = 15;
const B2 = 211;
const B3 = 354;
const B4 = 525;
const B5 = 705;
const END = 913;

/** Brighter than mint's #0B7A5A so it reads on the dark plate. */
const ACCENT = "#3FD69A";
const STAGE = "#0B1F17";

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the hero
// number's SMALL home while a catalog effect sits above it (b1-b4).
const BAND = { x: 40, y: 606, w: 420, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 7 — the hero number, present every beat, BIG only in b5 (the one
    beat with no catalog effect), shrunk into BAND for b1-b4. Flips once, at B5. */
const HeroFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B5;
  const value = flipped ? "4" : "0";
  const status = flipped ? "BOYS, DIRECT ON TV" : "ON TV WITHOUT A PHONE";
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const big = frame >= B5;

  if (big) {
    const t = tween(sec(frame, B5 + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div style={{ position: "absolute", left: 90, top: 150, width: 560, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(245,245,242,0.62)" }}>
          BOYS WITH THEIR OWN PLAN ON TV
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

  const flipPunch = Math.max(0, punchScale(sec(frame, B5, fps), 0) - 1);
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
        <div style={{ fontSize: 56, fontWeight: 800, color, transform: `scale(${1 + flipPunch * 0.3})` }}>
          {value}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>BOYS</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{status}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — small product plate naming Boytasks, over the LiveBackdrop + effect. */
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
        background: "rgba(8,20,15,0.85)",
        border: "1.5px solid #B2DECC",
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
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>BOYTASKS</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>
        a screen-time and task system for my kids — kiosk calendar, run on Cloudflare Workers
      </span>
    </div>
  );
};

const RESULT_LOG: Array<{ t: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { t: "before", text: "plan: PDF attachment, buried in email", tone: "danger" },
  { t: "", text: "opened only on a parent's phone", tone: "danger" },
  { t: "now", text: "flyt_plans.py watches the HOME-PC email", tone: "accent" },
  { t: "", text: "weekly_plan_pages: one JPEG per page", tone: "accent" },
  { t: "", text: "WeeklyPlan.tsx opens full-screen from the kiosk", tone: "accent" },
  { t: "", text: "boys with their own week on TV: 0 → 4", tone: "success" },
];

/** b5 — the result, fully drawn: LogWindow with the real ingest facts + the
    clip's one tech caption. Holds to END at full brightness, no fade. */
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
        title="flyt_plans.py"
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
          color: "#CDE9DB",
          background: "rgba(8,20,15,0.6)",
          borderRadius: 8,
          padding: "6px 14px",
          opacity: techIn,
          fontFamily,
        }}
      >
        Cloudflare Workers — serving pages straight to the kiosk
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
        Four boys, four calendars — each one opening its own week.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — buried in an email, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.03} />
      )}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{ kicker: "Every week's homework, as a PDF", title: "Buried in an email" }}
      />
      <ProductPlate />

      {/* b2 — dig it out, show it on a phone, over the page scrolled further */}
      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} push={0.03} />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.72}
        data={{
          line1: "A parent had to dig it out",
          line2: "and show it on a phone",
          keywords: ["dig it out", "phone"],
        }}
      />

      {/* b3 — the mechanism itself, drawn only (no backdrop) */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          steps: ["Email watched for PDF", "Each page saved as JPEG", "Served via Cloudflare"],
          result: "Stored in weekly_plan_pages",
          system: "Cloudflare Worker",
        }}
      />

      {/* b4 — tap, pick a week, swipe through it, over the features hub */}
      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} push={0.05} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.78}
        data={{
          from: "No real plan on the TV",
          to: "Tap, pick a week, swipe page by page",
          points: [
            "One tap opens WeeklyPlan.tsx full-screen",
            "Pick any week with arrow buttons",
            "Jumps to the nearest week that has a plan",
          ],
          fromLabel: "BEFORE",
          toLabel: "NOW",
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <HeroFigure />
    </AbsoluteFill>
  );
};

export const FeatureTapKioskCalendarOpensB85: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
