// FeatureFiveNewMiniLessonsD07 — feature d07 — 1280x720, 880 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood mint. Motion direction (feature-motion skill, 2026-10-13 —
// wave B reshoot: the previous pass drew a true card deck but declared it "archetype 4
// flow-map" with a connecting route path, which failed the directing gate; this pass draws
// an honest deck and declares archetype 3).
//
// Five real lesson cards (from the commit below, not abstract chips) sit as an actual
// overlapping DECK in the lower band — no connecting path, no route lines. While nothing
// is taught (b1-b2, dim under the live recordings) the deck just sits there with a "?" on
// top. At the hand-off (b3) the five cards fly off the deck one by one, FLIP from a plain
// numbered back to the real lesson label, and settle into a wide fan that spans almost the
// whole 1280x720 frame — the single moment the deck fully owns the stage. For b4 the fan
// collapses back into the small deck row (each card keeping its star / hands-on badge) so
// the matrix panel can own the centre. For b5 it stays collapsed small while a terminal
// window takes the stage and ticks each card green in turn as the real test clears it,
// ending on a bright "5 / 5" stamp. One deck, reused at two scales — never a stack of
// unrelated icons, never a path.
//
// Beat → effect (data only from the feature row and the one matching commit — 8e55152
// "five game lessons — food to sugar, insulin key, type 2 rusty lock, too little insulin,
// low sugar help" informs b3 directly; 4a14f3c and 4683181 belong to feature d08 and are
// not used here):
// b1 15-188   "A kid could play the diabetes game for hours and never actually learn why
//             any of it happens." statusFocus (3 claims, all "no") over the features hub.
//             (keywordCaption/titleTakeover/cornerTags are the forbidden recent openers —
//             this beat uses neither.)
// b2 188-381  "The simulation ran, but nothing stopped to explain what insulin does, or
//             why type 2 is different." cornerTags over the feature's own page.
// b3 381-551  "Five guided lessons now walk through that reasoning step by step, right on
//             the level map." Drawn: no live page shows this — the deck's own hand-off,
//             the five real lesson names (commit 8e55152) fly off the pile, flip face-up,
//             and fan out wide enough to be the single full-stage moment for this archetype.
// b4 551-693  "Each one ends in a quiz or a hands-on round, scored with stars." Drawn — a
//             large custom comparison table (not the shared dark featureMatrix effect, which
//             read too small/low-contrast here) owns the upper band while the fan collapses
//             back into the deck row, enlarged and shifted lower-right so it still carries
//             real weight; each card also keeps its own star / hands-on badge.
// b5 693-880  "A Playwright test plays every lesson through to completion — five for five."
//             Drawn: a terminal window reveals the real test output line by line while the
//             deck's five cards (still collapsed small) tick green one at a time, ending on
//             a bright "5 / 5" stamp. Holds bright to the final frame, no fade.
//
// Persistent element: the card deck (archetype 3), b1 through b5 — the same five lesson
// cards throughout; only their scale (small deck row vs. the big b3 fan) and markings change.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d07.json";

const B1 = 15;
const B2 = 188;
const B3 = 381;
const B4 = 551;
const B5 = 693;
const END = 880;

/** Bright mint tuned for the dark stage. */
const ACCENT = "#1FAE7E";
const STAGE = "#0D2219";

// Small deck row (home for b1-b2, and the collapsed shape for b4-b5) vs. the big fan used
// only for the b3 hand-off.
const BAND = { x: 40, y: 606, w: 1200, h: 92 };
const FAN_W = 216;
const FAN_H = 270;
// Enlarged + spread (was a tight band around y=268-360 — scored 19/48 on frame-fill) so
// the b3 hand-off, the single full-stage moment for this archetype, actually fills the
// canvas. Bounds re-verified at the ±22deg rotation extremes to stay inside [0,1280]x[0,720]
// with margin (worst case ~29px horizontal, ~94px vertical).
const FAN_X = [180, 410, 640, 870, 1100];
const FAN_Y = [460, 360, 260, 360, 460];
const FAN_ROT = [-22, -11, 0, 11, 22];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

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

  const pileCx = BAND.x + BAND.w / 2;
  const pileCy = BAND.y + BAND.h / 2;
  const pileW = 128;
  const pileH = 96;

  // bigness: 0 through b2 (small deck), ramps to 1 during b3 (the fan), ramps back to 0
  // during b4 and stays 0 through b5 (small deck row, terminal owns the stage).
  const dealt = frame >= B3 ? tween(sec(frame, B3, fps), 0, 0.9, ease.power3Out) : 0;
  const recollapsed = frame >= B4 ? tween(sec(frame, B4, fps), 0, 0.4, ease.power3InOut) : 0;
  const bigness = Math.max(0, dealt - recollapsed);

  const showQuestion = frame < B3;
  const kicker =
    frame >= B5
      ? "PLAYWRIGHT: FIVE FOR FIVE"
      : frame >= B4
      ? "QUIZ OR HANDS-ON, SCORED IN STARS"
      : frame >= B3
      ? "FIVE GUIDED LESSONS"
      : "NO LESSONS, JUST PLAY";

  // b3 only — the title grows and centers for the single full-stage fan moment (b1/b2/b4/b5
  // keep the small corner kicker untouched).
  const isFanBeat = frame >= B3 && frame < B4;

  const stampStart = B5 + 150;
  const showStamp = frame >= stampStart;
  const stampPop = showStamp ? punchScale(sec(frame, stampStart, fps), 0) : 1;

  // Each card's rect: small overlapping deck slot <-> its own stop in the big fan.
  // Each card's own deal progress (per-card stagger) — drives both the position mix
  // and the flip. Clamped 0..1 by tween, so it stays 1 forever once dealt.
  const foldT = LESSONS.map((_, i) => tween(sec(frame, B3, fps), i * 0.07, 0.5, ease.power3Out));

  // b4 — a modest size/position boost for the collapsed deck (scored 17/48 on frame-fill:
  // small deck + small table, most of the canvas black) so it helps fill the frame
  // alongside the bigger comparison table below. b4T is an exact 0 outside [B4,B5) — at
  // frame<B4 and frame>=B5 pileCxEff/pileCyEff/pileWEff/pileHEff equal the untouched
  // baseline exactly, so b1/b2/b3/b5 are pixel-for-pixel unaffected.
  const B4_ENTER_START = B4 + 12; // right after the b3->b4 collapse-to-small finishes
  const B4_ENTER_END = B4_ENTER_START + 10;
  const B4_EXIT_START = B5 - 12; // ramp back to baseline just before the cut to b5
  const b4T =
    frame < B4 || frame >= B5
      ? 0
      : frame < B4_ENTER_START
      ? 0
      : frame < B4_ENTER_END
      ? ease.power3Out(clamp01((frame - B4_ENTER_START) / (B4_ENTER_END - B4_ENTER_START)))
      : frame < B4_EXIT_START
      ? 1
      : 1 - ease.power3InOut(clamp01((frame - B4_EXIT_START) / (B5 - B4_EXIT_START)));
  const pileCxEff = mix(b4T, pileCx, 950);
  const pileCyEff = mix(b4T, pileCy, 609);
  const pileWEff = mix(b4T, pileW, 180);
  const pileHEff = mix(b4T, pileH, 136);

  const cardRects: Rect[] = LESSONS.map((_, i) => {
    const smallRect: Rect = {
      x: pileCxEff - pileWEff / 2 + i * 7 - (N - 1) * 3.5,
      y: pileCyEff - pileHEff / 2 - i * 3 + ((N - 1) * 3) / 2,
      w: pileWEff,
      h: pileHEff,
    };
    const bigRect: Rect = { x: FAN_X[i] - FAN_W / 2, y: FAN_Y[i] - FAN_H / 2, w: FAN_W, h: FAN_H };
    const settled = mixRect(bigness, smallRect, bigRect);
    return mixRect(foldT[i], smallRect, settled);
  });
  const smallRot = (i: number) => (i - (N - 1) / 2) * 5;
  const cardRot = LESSONS.map((_, i) => {
    const settledRot = mix(bigness, smallRot(i), FAN_ROT[i]);
    return mix(foldT[i], smallRot(i), settledRot);
  });

  const arrivesAt = (i: number) => B5 + i * 25;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* corner suit motifs — pure background texture, no connecting lines, no path */}
      {[
        { x: 70, y: 56, ch: "♠" },
        { x: 1200, y: 56, ch: "♦" },
        { x: 70, y: 664, ch: "♣" },
        { x: 1200, y: 664, ch: "♥" },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x - 20,
            top: s.y - 20,
            width: 40,
            height: 40,
            fontSize: 30,
            color: P.border,
            opacity: 0.35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {s.ch}
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: isFanBeat ? 640 : 40,
          top: isFanBeat ? 44 : 40,
          transform: isFanBeat ? "translateX(-50%)" : "none",
          fontSize: isFanBeat ? 30 : 14,
          fontWeight: 800,
          letterSpacing: isFanBeat ? 3 : 2,
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
            top: 36,
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
        const rect = cardRects[i];
        const rot = cardRot[i];

        const arriveT = sec(frame, B1 + 4, fps);
        const entranceScale = punchScale(arriveT, i * 0.05);
        const entranceOpacity = tween(arriveT, i * 0.05, 0.12, ease.linear);

        // The flip: 1 -> 0 -> 1 (never mirrored), face swaps at the midpoint.
        const flipMag = Math.abs(Math.cos(clamp01(foldT[i]) * Math.PI));
        const showFront = foldT[i] > 0.5;

        const big = rect.h > 130;
        const bg = showFront ? P.successBg : P.card;
        const edge = showFront ? P.successEdge : P.border;
        const fg = showFront ? P.success : P.muted;

        const badgeT = frame >= B4 ? tween(sec(frame, B4 + i * 10, fps), 0, 0.3, ease.power3Out) : 0;
        const checkStart = arrivesAt(i);
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
              transform: `rotate(${rot}deg) scale(${entranceScale}) scaleX(${flipMag})`,
              transformOrigin: "50% 50%",
              opacity: entranceOpacity,
              zIndex: i + 1,
              borderRadius: 14,
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
            {showFront ? (
              <>
                <div style={{ fontSize: big ? 26 : 13, fontWeight: 800, color: fg, textAlign: "center", lineHeight: 1.2 }}>
                  {lesson.label}
                </div>
                {badgeT > 0.01 && (
                  <div
                    style={{
                      marginTop: big ? 16 : 6,
                      fontSize: big ? 28 : 14,
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
              </>
            ) : (
              <div style={{ fontSize: big ? 30 : 18, fontWeight: 900, color: fg, opacity: 0.8 }}>{i + 1}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * b4's comparison table, drawn custom (not the shared dark `featureMatrix` motion effect,
 * whose dark-on-dark surface read as small/low-contrast against this stage) — a large,
 * bright mint-mood card so it reads as a genuinely large element on the frame-fill check.
 * Sits in the upper band (top 80 to roughly 460) well clear of the enlarged deck in the
 * lower-right (see pileCxEff/pileCyEff above) and the small top-left kicker.
 */
const LessonTable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B4 || frame >= B5) return null;

  const t = sec(frame, B4, fps);
  const headerOpacity = tween(t, 0.1, 0.3, ease.power3Out);
  const row1Opacity = tween(t, 0.4, 0.3, ease.power3Out);
  const row2Opacity = tween(t, 0.75, 0.3, ease.power3Out);
  const rows: { label: string; value: string; stars: string }[] = [
    { label: "4 lessons", value: "Multiple-choice quiz", stars: "★★★" },
    { label: "1 lesson", value: "Hands-on round", stars: "★★★" },
  ];
  const cols = "300px 1fr 1fr";

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 80,
        width: 1140,
        padding: "36px 48px",
        borderRadius: 18,
        background: P.card,
        border: `2px solid ${P.border}`,
        boxShadow: "10px 10px 0 rgba(0,0,0,0.35)",
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: cols,
          columnGap: 24,
          marginBottom: 14,
          opacity: headerOpacity,
        }}
      >
        <div />
        <div style={{ fontSize: 34, fontWeight: 800, color: ACCENT, letterSpacing: 1 }}>Ends with</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: ACCENT, letterSpacing: 1 }}>Scored</div>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.label}
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            columnGap: 24,
            alignItems: "center",
            minHeight: 110,
            borderTop: i > 0 ? `1.5px solid ${P.border}` : "none",
            opacity: i === 0 ? row1Opacity : row2Opacity,
          }}
        >
          <div style={{ fontSize: 38, fontWeight: 700, color: P.ink, borderLeft: `4px solid ${ACCENT}`, paddingLeft: 16 }}>
            {r.label}
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: P.ink }}>{r.value}</div>
          <div style={{ fontSize: 38, fontWeight: 800, color: P.amber }}>{r.stars}</div>
        </div>
      ))}
    </div>
  );
};

const PLAYWRIGHT_LINES: LogLine[] = [
  { text: "> npx playwright test insulin-lessons.spec.ts", tone: "muted" },
  { text: "✓ Food → Sugar lesson completes", tone: "success" },
  { text: "✓ Insulin Key lesson completes", tone: "success" },
  { text: "✓ Type 2: Rusty Lock lesson completes", tone: "success" },
  { text: "✓ Too Little Insulin (hands-on) completes", tone: "success" },
  { text: "✓ Low Sugar Help lesson completes", tone: "success" },
  { text: "5 passed (5/5)", tone: "accent" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // b1 — a one-line product plate: who this is, named plainly for a blind viewer.
  const plateT = tween(sec(frame, B1 + 4, fps), 0, 0.3, ease.power3Out);
  const plateOpacity = frame >= B1 && frame < B2 ? plateT : 0;

  // b5 — the LogWindow fades in just after the cut, well clear of the small deck band (y >= 606).
  const logOpacity = frame >= B5 ? tween(sec(frame, B5, fps), 0, 0.25, ease.power3Out) : 0;
  const captionOpacity = frame >= B5 + 8 ? tween(sec(frame, B5 + 8, fps), 0, 0.25, ease.power3Out) : 0;

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — plays for hours, learns nothing, over the features hub */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="statusFocus"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          title: "After hours of play",
          claims: [
            { text: "Why insulin matters?", verdict: "no" },
            { text: "Why type 2 is different?", verdict: "no" },
            { text: "Any of it explained?", verdict: "no" },
          ],
        }}
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
            background: "rgba(13,34,25,0.8)",
            border: `1.5px solid ${ACCENT}`,
            color: "#EAFBF2",
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

      {/* b3 — archetype only: the five real lesson cards (commit 8e55152) fly off the deck, flip, and fan out */}

      {/* b4 — each lesson's own ending, drawn custom large table (no live page shows this);
          the fan collapses back to the deck row, enlarged/repositioned to lower-right so it
          still fills real space alongside the table */}
      <LessonTable />

      {/* b5 — a real Playwright run, line by line, while the deck's cards tick green; holds to the end */}
      {logOpacity > 0.004 && (
        <LogWindow
          lines={PLAYWRIGHT_LINES}
          title="insulin-lessons.spec.ts"
          from={B5 + 8}
          every={16}
          opacity={logOpacity}
          win={{ x: 150, y: 140, w: 980, h: 450 }}
          fontSize={22}
        />
      )}
      {captionOpacity > 0.004 && (
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 104,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 0.3,
            color: "#EAFBF2",
            opacity: captionOpacity,
            fontFamily,
          }}
        >
          Playwright — automated browser test
        </div>
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureFiveNewMiniLessonsD07: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
