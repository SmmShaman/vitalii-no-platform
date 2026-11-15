// FeatureHomeworkStopsBeingOwnB95 — feature b95 — 1280x720, 977 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split duel, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// The quiz deck used to treat every day the same, homework included. The lower
// third draws the fix as a halved band: a dangerBg "ANY DAY" half on the left vs
// a successBg "MON–FRI" half on the right, split by a divider that slides right
// as the weekday routine takes over — both halves live on screen at once, the
// label sits inside each half, nothing is centered.
//
// Beat → effect (data only from the feature row, no commits — the three given
// commits (89114cd, 50df24b, bf0b0cd) describe unrelated BoardCard work and do
// not match any beat, so the mechanism is drawn instead):
// b1 15-187   "treated every day the same — even weekends, with no homework due"
//             cornerTags over the feature's own page. Lower third: divider sits
//             far left, the ANY DAY half fills almost the whole band, a homework
//             dot wanders inside it.
// b2 187-375  "homework also showed up as its own card, cutting into the subject"
//             keywordCaption, still over the page. The wandering dot keeps
//             cutting across the ANY DAY half — nothing has settled yet.
// b3 375-601  "a Cloudflare Workers routine checks the weekday, tags 'I dag'"
//             handoffExplain over the page's solution paragraph. The divider
//             slides right, the MON–FRI half grows, an "I DAG" pill punches in
//             on today's day-dot — the one tech name sits inside this beat only.
// b4 601-760  "homework rides along on that subject's card instead of its own"
//             funnelAbsorption over the page's result paragraph. The wandering
//             homework dot flies across the divider and docks on the I DAG pill.
// b5 760-977  "weekends now show zero homework" — drawn result, no live page
//             (gate: last beat never replays the feature page or the hub).
//             ratioBars on the dark stage; the lower third's Sat/Sun dots stamp
//             a "0" and the divider finishes its slide, holding to the end.
//
// Persistent element: the split-duel lower third (archetype 0), b1 through b5.
// Effects keep the bottom 200/1080 px clear (look.safeBottom) — that is where it sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b95.json";

const B1 = 15;
const B2 = 187;
const B3 = 375;
const B4 = 601;
const B5 = 760;
const END = 977;

/** Accent tuned for the dark stage (mint's #0B7A5A reads flat on a plate). */
const ACCENT = "#3FD69B";
const STAGE = "#0C1A14";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const PLATE_W = 190;
const SPLIT_X = LT.x + PLATE_W + 22; // 252
const SPLIT_W = LT.x + LT.w - 12 - SPLIT_X; // leaves a 12px margin, matches p75's route-line convention
const SPLIT_Y = LT.y + 12;
const SPLIT_H = LT.h - 24;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Divider fraction across the split zone: starts near the left (chaos owns
  // almost everything), then slides right in three stages — one per beat that
  // changes the picture (b3 adopts the routine, b4 absorbs homework, b5 empties
  // the weekends).
  const t1 = tween(sec(frame, B3 + 40, fps), 0, 160 / fps, ease.power3InOut);
  const t2 = tween(sec(frame, B4 + 10, fps), 0, 110 / fps, ease.power3InOut);
  const t3 = tween(sec(frame, B5 + 20, fps), 0, 120 / fps, ease.power3InOut);
  const frac = mix(t3, mix(t2, mix(t1, 0.12, 0.48), 0.7), 0.9);
  const dividerX = SPLIT_X + frac * SPLIT_W;
  const orderW = SPLIT_X + SPLIT_W - dividerX;
  const chaosW = dividerX - SPLIT_X;

  // The wandering "homework" dot: jitters inside the chaos half through b1/b2,
  // then flies across the divider during b4 and docks on the I DAG pill.
  const dock = tween(sec(frame, B4, fps), 0, (B5 - B4) / fps, ease.sineInOut);
  const wanderX = SPLIT_X + chaosW * 0.5 + Math.sin(frame * 0.22) * Math.min(18, chaosW * 0.3);
  const dagDotCx = dividerX + orderW * 0.42;
  const homeworkX = frame >= B4 ? mix(dock, wanderX, dagDotCx) : wanderX;
  const homeworkY = frame >= B4 ? mix(dock, SPLIT_Y + SPLIT_H / 2, SPLIT_Y + 20) : SPLIT_Y + SPLIT_H / 2;
  const docked = frame >= B4 + (B5 - B4) * 0.9;

  const dagPillOn = frame >= B3 + 60;
  const weekendZero = frame >= B5 + 70;

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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: PLATE_W - 32 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>BOYTASKS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            screen-time &amp;
            <br />
            task system
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, marginTop: 4 }}>Cloudflare Workers</div>
        </div>
      </Arrive>

      {/* chaos half — ANY DAY */}
      <Arrive at={B1 + 20} kind="wipe" box={{ x: SPLIT_X, y: SPLIT_Y, w: SPLIT_W, h: SPLIT_H }} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: SPLIT_X,
            top: SPLIT_Y,
            width: chaosW,
            height: SPLIT_H,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 10, top: 6, fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: P.danger, whiteSpace: "nowrap" }}>
            ANY DAY
          </div>
          <div style={{ position: "absolute", left: 10, top: SPLIT_H - 22, fontSize: 11, fontWeight: 600, color: P.danger, whiteSpace: "nowrap" }}>
            homework, every day
          </div>
        </div>

        {/* order half — MON–FRI */}
        <div
          style={{
            position: "absolute",
            left: dividerX,
            top: SPLIT_Y,
            width: orderW,
            height: SPLIT_H,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 10, top: 6, fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: P.success, whiteSpace: "nowrap" }}>
            MON–FRI
          </div>
          {/* five weekday dots + two dim weekend dots, right-aligned inside the half */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const isWeekend = i >= 5;
            const dx = orderW - 18 - (6 - i) * 20;
            if (dx < 18) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: dx,
                  top: SPLIT_H - 28,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: isWeekend ? (weekendZero ? P.chipBg : P.border) : P.success,
                  border: isWeekend ? `1px solid ${P.border}` : "none",
                }}
              />
            );
          })}
          {weekendZero && (
            <div
              style={{
                position: "absolute",
                right: 8,
                top: SPLIT_H - 50,
                fontSize: 13,
                fontWeight: 800,
                color: P.ink,
                transform: `scale(${punchScale(sec(frame, B5 + 70, fps), 0)})`,
              }}
            >
              0
            </div>
          )}
          {dagPillOn && (
            <div
              style={{
                position: "absolute",
                left: orderW * 0.32,
                top: 6,
                padding: "2px 8px",
                borderRadius: 10,
                background: P.accent,
                color: "#fff",
                fontSize: 11,
                fontWeight: 800,
                transform: `scale(${punchScale(sec(frame, B3 + 60, fps), 0)})`,
                whiteSpace: "nowrap",
              }}
            >
              I DAG
            </div>
          )}
        </div>

        {/* divider bar */}
        <div
          style={{
            position: "absolute",
            left: dividerX - 2,
            top: SPLIT_Y - 4,
            width: 4,
            height: SPLIT_H + 8,
            background: P.ink,
          }}
        />

        {/* the wandering / docking homework dot */}
        <div
          style={{
            position: "absolute",
            left: homeworkX - 7,
            top: homeworkY - 7,
            width: 14,
            height: 14,
            borderRadius: 7,
            background: docked ? P.accent : P.danger,
          }}
        />
      </Arrive>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — every day treated the same, even weekends */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "Same deck, every single day",
          tags: ["Even weekends", "No homework needed", "Random topic rotation", "No sense of 'today'"],
        }}
      />

      {/* b2 — homework as its own card, cutting into the real subject */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "Homework interrupted the deck",
          line2: "as a card of its own",
          keywords: ["interrupted", "card of its own"],
        }}
      />

      {/* b3 — the fix: a weekday-aware routine, tagged "I dag" */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Every day, any topic",
          to: "Weekday-aware subjects",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Mon–Fri after 12:00 Oslo time", "Tags the match 'I dag'", "Cloudflare Workers routine"],
        }}
      />

      {/* b4 — homework rides along on that subject's card */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page4" from={B4} hold={B5 - B4} focus={{ x: 0.3, y: 0.3 }} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["Homework due tomorrow", "A separate task card", "Mixed into any subject"],
          result: "Rides along on today's subject card",
        }}
      />

      {/* b5 — weekends drop to zero, drawn on the dark stage (no live page — gate rule) */}
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          title: "Homework days per week",
          a: { label: "Before: every day", value: 7 },
          b: { label: "Now: weekdays only", value: 5 },
          unit: "days",
          caption: "Weekends: 0 homework items",
        }}
      />

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureHomeworkStopsBeingOwnB95: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
