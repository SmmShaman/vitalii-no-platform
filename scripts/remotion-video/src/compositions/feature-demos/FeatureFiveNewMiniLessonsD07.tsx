// FeatureFiveNewMiniLessonsD07 — feature d07 — 1280x720, 880 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood violet. Motion direction (feature-motion skill, 2026-10-07).
//
// The deck is the game's five real lessons (from the commit below), not abstract
// chips. It breathes through the clip: a dim, scattered pile (b1-b2, nothing taught
// yet) folds into a big lit row on a level-map path (b3, the reveal), shrinks back
// into a tidy band while each lesson's ending is explained (b4, room is made for the
// matrix panel above), then expands again for the finale, ticking green one by one
// (b5) and ending on a bright "5 / 5" stamp. No grid state needed — pile, big row,
// small row cover every beat.
//
// Beat → effect (data only from the feature row and the one matching commit —
// 8e55152 "five game lessons — food to sugar, insulin key, type 2 rusty lock, too
// little insulin, low sugar help" informs b3 directly; 4a14f3c "NovoRapid starts
// with the plate" and 4683181 "food by weight, per 100g" both belong to feature
// d08 and are not used here):
// b1 15-188   "A kid could play the diabetes game for hours and never actually
//             learn why any of it happens." keywordCaption over the features hub
//             (titleTakeover opened d08 most recently, so b1 does not repeat it).
// b2 188-381  "The simulation ran, but nothing stopped to explain what insulin
//             does, or why type 2 is different." cornerTags over the feature's
//             own page.
// b3 381-551  "Five guided lessons now walk through that reasoning step by step,
//             right on the level map." Drawn: no live page shows this — the
//             archetype's own hand-off, the five real lesson names (commit
//             8e55152) fold from the dim pile into a lit row on the level-map path.
// b4 551-693  "Each one ends in a quiz or a hands-on round, scored with stars."
//             featureMatrix, drawn (the row shrinks back into the band so the
//             matrix panel owns the centre) — each card also gains its own
//             star / hands-on badge.
// b5 693-880  "A Playwright test plays every lesson through to completion — five
//             for five." Drawn: the row expands back out, each card ticks green
//             in turn, ending on a bright "5 / 5" stamp. Holds bright to the
//             final frame, no fade.
//
// Persistent element: the card deck (archetype 3), b1 through b5 — five cards,
// the same five lessons throughout, only their arrangement and markings change.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d07.json";

const B1 = 15;
const B2 = 188;
const B3 = 381;
const B4 = 551;
const B5 = 693;
const END = 880;

/** Bright violet tuned for the dark stage — the palette's own #5B37D4 reads muddy on a plate. */
const ACCENT = "#A78BFA";
const STAGE = "#17123A";

// Resting band (pile, and the tidy-but-small row during b4) vs. the big row for
// the b3 reveal and the b5 finale.
const BAND = { x: 40, y: 606, w: 1200, h: 92 };
const ROW_BIG = { x: 60, y: 168, w: 1160, h: 400 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Rect = { x: number; y: number; w: number; h: number };
const mixRect = (p: number, a: Rect, b: Rect): Rect => ({
  x: mix(p, a.x, b.x),
  y: mix(p, a.y, b.y),
  w: mix(p, a.w, b.w),
  h: mix(p, a.h, b.h),
});

type Lesson = { key: string; label: string; handsOn?: boolean };
/** The real five lessons from commit 8e55152, in commit order. */
const LESSONS: Lesson[] = [
  { key: "food", label: "Food → Sugar" },
  { key: "ikey", label: "Insulin Key" },
  { key: "rusty", label: "Type 2: Rusty Lock" },
  { key: "low", label: "Too Little Insulin", handsOn: true },
  { key: "help", label: "Low Sugar Help" },
];
const N = LESSONS.length;

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Band layout: a tidy row of five slots inside BAND (pile's "home" position, and b4's compact row).
  const PAD = 10;
  const GAP = 6;
  const slotW = (BAND.w - PAD * 2 - GAP * (N - 1)) / N;
  const rowH = BAND.h - PAD * 2;
  const rowY = BAND.y + PAD;

  // Big-row layout: five large cards filling most of the frame (the reveal + finale).
  const gapBig = 20;
  const cardWBig = (ROW_BIG.w - gapBig * (N - 1)) / N;

  const pileCx = BAND.x + BAND.w / 2;
  const pileCy = BAND.y + BAND.h / 2;

  const shrink = tween(sec(frame, B4, fps), 0, 0.4, ease.power3InOut);
  const expand = tween(sec(frame, B5, fps), 0, 0.4, ease.power3InOut);
  // 0 = small (band) row, 1 = big row — settles small through b4, big again from b5.
  const bigness = mix(expand, 1 - shrink, 1);

  const inBig = (frame >= B3 && frame < B4) || frame >= B5;
  const showQuestion = frame < B3;
  const kicker =
    frame >= B5
      ? "PLAYWRIGHT: FIVE FOR FIVE"
      : frame >= B4
      ? "QUIZ OR HANDS-ON, SCORED IN STARS"
      : frame >= B3
      ? "FIVE GUIDED LESSONS"
      : "NO LESSONS, JUST PLAY";
  const kickerY = inBig ? ROW_BIG.y - 34 : BAND.y - 28;
  const kickerX = inBig ? ROW_BIG.x : BAND.x + PAD;

  const stampStart = B5 + 140;
  const showStamp = frame >= stampStart;
  const stampPop = showStamp ? punchScale(sec(frame, stampStart, fps), 0) : 1;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* the level-map path — only while the row is big (the reveal + the finale) */}
      {inBig && (
        <div
          style={{
            position: "absolute",
            left: ROW_BIG.x,
            top: ROW_BIG.y + ROW_BIG.h + 18,
            width: ROW_BIG.w,
            height: 2,
            background: P.border,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          left: kickerX,
          top: kickerY,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 2,
          color: ACCENT,
          opacity: frame >= B1 + 10 ? 1 : 0,
        }}
      >
        {kicker}
      </div>

      {showQuestion && (
        <div
          style={{
            position: "absolute",
            left: pileCx - 14,
            top: BAND.y - 46,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            color: P.danger,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
          }}
        >
          ?
        </div>
      )}

      {showStamp && (
        <div
          style={{
            position: "absolute",
            left: 1280 / 2 - 90,
            top: ROW_BIG.y - 74,
            width: 180,
            height: 56,
            borderRadius: 6,
            background: P.success,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 800,
            transform: `scale(${stampPop})`,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
          }}
        >
          5 / 5
        </div>
      )}

      {LESSONS.map((lesson, i) => {
        const pileW = 150;
        const pileH = 72;
        const pileRect: Rect = {
          x: pileCx - pileW / 2 + (i - 2) * 6,
          y: pileCy - pileH / 2 - i * 2,
          w: pileW,
          h: pileH,
        };
        const pileRot = (i - 2) * 3.5;

        const smallRect: Rect = { x: BAND.x + PAD + i * (slotW + GAP), y: rowY, w: slotW, h: rowH };
        const bigRect: Rect = { x: ROW_BIG.x + i * (cardWBig + gapBig), y: ROW_BIG.y, w: cardWBig, h: ROW_BIG.h };
        const settled = mixRect(bigness, smallRect, bigRect);

        const foldT = tween(sec(frame, B3, fps), i * 0.07, 0.5, ease.power3Out);
        const rect = mixRect(foldT, pileRect, settled);
        const rotation = pileRot * (1 - foldT);

        const arriveT = sec(frame, B1 + 4, fps);
        const entranceScale = punchScale(arriveT, i * 0.05);
        const entranceOpacity = tween(arriveT, i * 0.05, 0.12, ease.linear);

        const landed = foldT > 0.5;
        const bg = landed ? P.successBg : P.chipBg;
        const edge = landed ? P.successEdge : P.border;
        const fg = landed ? P.success : P.muted;
        const big = rect.h > 150;

        const badgeT = frame >= B4 ? tween(sec(frame, B4 + i * 10, fps), 0, 0.3, ease.power3Out) : 0;
        const checkStart = B5 + i * 25;
        const checkT = frame >= B5 ? tween(sec(frame, checkStart, fps), 0, 0.25, ease.power3Out) : 0;

        return (
          <div
            key={lesson.key}
            style={{
              position: "absolute",
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              transform: `rotate(${rotation}deg) scale(${entranceScale})`,
              opacity: entranceOpacity,
              zIndex: i,
              borderRadius: 6,
              background: bg,
              border: `2px solid ${edge}`,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: big ? 20 : 13, fontWeight: 800, color: fg, textAlign: "center", lineHeight: 1.2 }}>
              {lesson.label}
            </div>
            {badgeT > 0.01 && (
              <div
                style={{
                  marginTop: big ? 12 : 6,
                  fontSize: big ? 22 : 14,
                  fontWeight: 800,
                  color: P.amber,
                  opacity: badgeT,
                  transform: `scale(${mix(badgeT, 0.6, 1)})`,
                }}
              >
                {lesson.handsOn ? "✋" : "★★★"}
              </div>
            )}
            {checkT > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  top: -10,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: P.success,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  transform: `scale(${mix(checkT, 0.4, 1)})`,
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.35)",
                }}
              >
                ✓
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // b1 — a one-line product plate: who this is, named plainly for a blind viewer.
  const plateT = tween(sec(frame, B1 + 4, fps), 0, 0.3, ease.power3Out);
  const plateOpacity = frame >= B1 && frame < B2 ? plateT : 0;

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — plays for hours, learns nothing, over the features hub */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ line1: "Plays for hours,", line2: "learns nothing.", keywords: ["hours", "nothing"] }}
      />
      {plateOpacity > 0.004 && (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 28,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(23,18,58,0.8)",
            border: `1.5px solid ${ACCENT}`,
            color: "#F3EEFF",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.3,
            fontFamily,
            opacity: plateOpacity,
            transform: `translateY(${(1 - plateOpacity) * -8}px)`,
          }}
        >
          <span style={{ color: ACCENT, fontWeight: 800 }}>Insulin Simulator</span>
          <span style={{ opacity: 0.85 }}>— built for my son Artem</span>
        </div>
      )}

      {/* b2 — insulin and type 2 never explained, over the feature's own page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          statement: "The simulation ran, unexplained",
          tags: ["Insulin? Never explained", "Type 1 vs Type 2? Unclear", "No pause to teach", "Quizzes, but no lessons"],
        }}
      />

      {/* b3 — archetype only: the five real lesson names (commit 8e55152) fold into the lit row */}

      {/* b4 — each lesson's own ending, drawn (no live page shows this); the row shrinks to make room */}
      <MotionInsert
        effect="featureMatrix"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          options: ["Ends with", "Scored"],
          rows: [
            { label: "4 lessons", values: ["Multiple-choice quiz", "★★★"] },
            { label: "1 lesson", values: ["Hands-on round", "★★★"] },
          ],
        }}
      />

      {/* b5 — archetype only: five green checks, then the "5 / 5" stamp, holds to the end */}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureFiveNewMiniLessonsD07: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
