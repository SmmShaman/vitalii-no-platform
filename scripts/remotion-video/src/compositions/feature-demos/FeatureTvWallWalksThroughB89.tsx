// FeatureTvWallWalksThroughB89 — feature b89 — 1280x720, 935 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Boytasks' kids quiz wall vs. the family calendar — the wall just grabbed the next
// card off a deck with no link to tomorrow's real class. No GitHub commit URL is
// verified for b89 (only the feature's own page + the features hub), so b4/b5 are
// drawn only — no commit diff is shown; b5's LogWindow lines come only from the
// feature's own numbers (nightly sync widened 1 -> 2 drifted schedules re-aligned).
//
// Beat -> picture (data only from the feature row, no invented numbers):
// b1 15-164   "a quiz wall and the family calendar told two different stories"
//             titleTakeover over the feature's own page (backdrop); the kicker
//             names Boytasks. Card-deck lower third appears as a messy, red pile.
// b2 164-342  "the wall just grabbed the next card, never checking tomorrow"
//             cornerTags: the claim + 3 facts from problem_en, over the page
//             scrolled further down. One deck card flips a "wrong day" tag.
// b3 342-557  "it walks tomorrow's real timetable, child by child, subject by subject"
//             pipelineFlow over the features hub (backdrop) — three steps, naming
//             Cloudflare Workers once. Deck cards align into a green, ordered row.
// b4 557-717  "a glowing ring lights the matching day, calendar and wall agree"
//             DRAWN (no backdrop — no verified commit URL): today's wall card and
//             tomorrow's calendar tile punch in together under a glowing ring.
//             A check badge lands on the deck row below.
// b5 717-935  "a small Cloudflare Workers job now catches up two drifted
//             schedules a night instead of one"
//             DRAWN LogWindow, lines built only from the feature's own numbers
//             (1 -> 2 drifted schedules re-aligned/night); holds to the end at
//             full brightness, no fade.
//
// Persistent element: the card-deck lower third (archetype 3) lives at y>=606 and
// visibly changes at every beat boundary (b1 appear, b2 tag flip, b3 align+recolor,
// b4 check badge, b5 label swap) while the upper 580px carries each beat's own
// effect or drawn result.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Headline, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b89.json";

const B1 = 15;
const B2 = 164;
const B3 = 342;
const B4 = 557;
const B5 = 717;
const END = 935;

/** Brighter than slate's own accent (#0E7490) so it reads on the dark stage plate. */
const ACCENT = "#22B8D6";
const STAGE = "#121A22";

// Lower third geometry (1280x720, below the effects' safe bottom at y~587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const CHIP_X0 = 268;
const CHIP_W = 230;
const CHIP_GAP = 26;
const CHIP_X = [CHIP_X0, CHIP_X0 + CHIP_W + CHIP_GAP, CHIP_X0 + (CHIP_W + CHIP_GAP) * 2];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // b3: the scattered pile straightens into an ordered, matching row.
  const hand = tween(sec(frame, B3, fps), 0, 0.6, ease.power3InOut);
  const isNew = frame >= B3;
  const tone = isNew ? P.success : P.danger;
  const jitter = [6, -4, 8].map((j) => mix(hand, j, 0));

  const label = frame >= B5 ? "SYNCED NIGHTLY" : frame >= B3 ? "WALL = CALENDAR" : "QUIZ WALL";

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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 30, width: 190 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>{label}</div>
        </div>
      </Arrive>

      {[0, 1, 2].map((i) => (
        <Arrive key={i} at={B1 + 18 + i * 8} kind="rise" box={{ x: CHIP_X[i], y: LT.y + 14 + jitter[i], w: CHIP_W, h: 64 }}>
          <div
            style={{
              position: "absolute",
              left: CHIP_X[i],
              top: LT.y + 14 + jitter[i],
              width: CHIP_W,
              height: 64,
              background: isNew ? P.successBg : P.dangerBg,
              border: `2px solid ${isNew ? P.successEdge : P.dangerEdge}`,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 1,
              color: tone,
            }}
          >
            {isNew ? `MATCHED ${i + 1}` : "WRONG DAY"}
          </div>
        </Arrive>
      ))}

      {frame >= B4 + 20 && (
        <div
          style={{
            position: "absolute",
            left: CHIP_X[1] + CHIP_W - 18,
            top: LT.y - 10,
            width: 36,
            height: 36,
            borderRadius: 18,
            background: P.success,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
            transform: `scale(${punchScale(sec(frame, B4 + 20, fps), 0)})`,
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
};

const GlowMatch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const ringScale = punchScale(sec(frame, B4 + 24, fps), 0);
  return (
    <>
      <Headline y={56} text="Wall and calendar agree" accentColor={P.success} fontSize={34} />
      <Arrive at={B4 + 4} kind="rise" box={{ x: 300, y: 190, w: 260, h: 220 }}>
        <IconCard x={300} y={190} w={260} emoji="📅" title="Today's wall card" sub="matched" tone="success" />
      </Arrive>
      <Arrive at={B4 + 4} kind="rise" box={{ x: 720, y: 190, w: 260, h: 220 }}>
        <IconCard x={720} y={190} w={260} emoji="🗓️" title="Tomorrow's class" sub="matched" tone="success" />
      </Arrive>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 220,
          width: 200,
          height: 200,
          borderRadius: 100,
          border: `6px solid ${P.success}`,
          boxShadow: `0 0 50px ${P.success}`,
          transform: `scale(${ringScale})`,
        }}
      />
    </>
  );
};

const RESULT_LINES: LogLine[] = [
  { t: "02:00", text: "nightly sync: scan family calendars", tone: "muted" },
  { t: "02:00", text: "drifted schedule found", tone: "danger" },
  { t: "02:00", text: "re-align schedule 1", tone: "accent" },
  { t: "02:00", text: "re-align schedule 2", tone: "accent" },
  { t: "02:00", text: "before: 1 re-aligned / night", tone: "muted" },
  { t: "02:00", text: "after: 2 re-aligned / night", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the mismatch, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Wall and calendar disagree", kicker: "Boytasks: the kids' quiz wall vs. the family calendar" }}
      />

      {/* b2 — what the wall actually did (problem_en) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "The wall just grabs the next card in the deck",
          tags: ["No link to tomorrow's class", "Same subject, wrong day", "Calendar says otherwise"],
        }}
      />

      {/* b3 — the fix, over the features hub */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Read each kid's calendar column", "Pull tomorrow's class order", "Walk subjects in that order"],
          result: "Wall matches tomorrow's timetable",
          system: "Cloudflare Workers",
        }}
      />

      {/* b4 — drawn only: no verified commit URL, so no diff is shown */}
      {frame >= B4 && frame < B5 && <GlowMatch />}

      {/* b5 — drawn LogWindow, holds to the end at full brightness */}
      {frame >= B5 && (
        <LogWindow
          lines={RESULT_LINES}
          title="sync worker log"
          from={B5 + 10}
          every={16}
          opacity={1}
          win={{ x: 180, y: 140, w: 920, h: 420 }}
        />
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureTvWallWalksThroughB89: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
