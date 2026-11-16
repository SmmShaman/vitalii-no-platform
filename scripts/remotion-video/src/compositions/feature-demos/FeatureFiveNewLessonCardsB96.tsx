/**
 * FeatureFiveNewLessonCardsB96 — feature b96 — 1280x720, 814 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 1 (timeline ribbon), mood violet. A horizontal progress ribbon runs across
 * the lower frame (y>=600) for the whole clip, the one element that survives every beat;
 * a stamp lands on it left-to-right the moment each beat's claim becomes true. Everything
 * above it switches per beat: the real hub (b1) and the real feature page (b3) play behind
 * that beat's catalog effect; b2/b4/b5 are catalog effects alone on a dark plate.
 *
 * Only 2 verified recordings (shots/b96.json): the features hub (beat 1) and the
 * feature's own page (beat 3). Boytasks' textbook reader and its fact-checker have no
 * public page, so those beats are drawn straight from the feature row's own text — no
 * invented numbers.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-173 "My kids' tutoring app could quiz them all day, but it never taught them anything first."
 *  b2 173-321 "It picked random topics with no link to what they were studying at school that week."
 *  b3 321-463 "Now it reads straight from their real textbook, chapter by chapter."
 *  b4 463-612 "AI checks every fact against that source before a single card gets written."
 *  b5 612-769 "Each kid now wakes up to five new lesson cards a day, one ladder per subject." — holds to 814.
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { MotionInsert } from "./motion-primitives";
import { LiveWindow, type Win } from "./live-primitives";
import shotsFile from "./shots/b96.json";

const B1 = 15;
const B2 = 173;
const B3 = 321;
const B4 = 463;
const B5 = 612;
const END = 814;

const ACCENT = "#8C6FE0";
const STAGE = "#1B1033";
const fontFamily = 'Inter, "Helvetica Neue", Arial, sans-serif';

const easeOut = Easing.out(Easing.cubic);

function pop(frame: number, start: number, dur = 18): number {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
}

const WIN_HUB: Win = { x: 150, y: 40, w: 980, h: 480 };
const WIN_PAGE: Win = { x: 150, y: 40, w: 980, h: 480 };

/** The archetype element: a horizontal time band in the lower third that survives
 * every beat while the full-frame catalog effects above it switch per beat. */
const RIBBON_Y = 610;

const STAMPS: { x: number; at: number; label: string }[] = [
  { x: 110, at: B1, label: "Random quiz" },
  { x: 370, at: B2, label: "No class link" },
  { x: 630, at: B3, label: "Real textbook" },
  { x: 890, at: B4, label: "Fact-checked" },
  { x: 1150, at: B5, label: "5 cards/day" },
];

function fillX(frame: number): number {
  return interpolate(
    frame,
    [B1, B1 + 20, B2, B2 + 20, B3, B3 + 20, B4, B4 + 20, B5, B5 + 20],
    [90, 110, 110, 370, 370, 630, 630, 890, 890, 1150],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut }
  );
}

const Ribbon: React.FC<{ frame: number }> = ({ frame }) => {
  const fx = fillX(frame);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: RIBBON_Y + 12,
          width: 1140,
          height: 6,
          borderRadius: 3,
          background: "rgba(255,255,255,0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: RIBBON_Y + 12,
          width: Math.max(0, fx - 70),
          height: 6,
          borderRadius: 3,
          background: ACCENT,
        }}
      />
      {STAMPS.map((s) => {
        const lit = pop(frame, s.at, 14);
        return (
          <div key={s.label} style={{ position: "absolute", left: s.x - 70, top: RIBBON_Y, width: 140, textAlign: "center" }}>
            <div
              style={{
                margin: "0 auto",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: lit > 0.05 ? ACCENT : "rgba(255,255,255,0.15)",
                border: `2px solid ${lit > 0.05 ? ACCENT : "rgba(255,255,255,0.35)"}`,
                transform: `scale(${0.7 + 0.3 * lit})`,
                boxShadow: lit > 0.5 ? "0 0 0 6px rgba(140,111,224,0.25)" : "none",
              }}
            />
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 800,
                color: lit > 0.5 ? "#FFF4FF" : "rgba(255,244,255,0.5)",
                opacity: Math.max(0.5, lit),
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE, overflow: "hidden", fontFamily }}>
      {/* ---------------- beat 1 : real hub behind the opener ---------------- */}
      {/* Sequence-gated so the BrowserWindow chrome (unconditionally opaque while mounted)
          unmounts at B2 instead of sitting on top of every later beat. */}
      <Sequence from={B1} durationInFrames={B2 - B1} layout="none">
        <LiveWindow
          file={shotsFile}
          shot="hub"
          title="vitalii.no/features"
          from={0}
          hold={B2 - B1}
          zoom={(t) => 1 + 0.08 * t}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={1}
          win={WIN_HUB}
        />
      </Sequence>
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{ title: "All quiz, no teaching first", kicker: "Boytasks — lesson cards, before today" }}
      />

      {/* ---------------- beat 2 : the old app's claim, drawn ---------------- */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{ line1: "Random topics,", line2: "no link to this week's class", keywords: ["Random", "no link"] }}
      />

      {/* ---------------- beat 3 : real feature page behind the solution ---------------- */}
      <Sequence from={B3} durationInFrames={B4 - B3} layout="none">
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features/five-new-lesson-cards…"
          from={0}
          hold={B4 - B3}
          zoom={(t) => 1 + 0.08 * t}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={1}
          win={WIN_PAGE}
        />
      </Sequence>
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          steps: ["Real textbook", "Chapter by chapter", "Lesson draft"],
          result: "Matches this week's class",
          system: "Boytasks lesson engine",
        }}
      />

      {/* ---------------- beat 4 : the fact-check gate, drawn ---------------- */}
      {/* StatusFocus caps its row height at 230px regardless of canvas height, so with only
          2 claims it leaves large empty top/bottom bands on a 720-tall frame. Filler header
          + badge below restate (never invent) the beat's own two "yes" verdicts to fill the
          canvas, gated to this beat only. */}
      {B4 <= frame && frame < B5 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 96,
              width: 1280,
              textAlign: "center",
              opacity: pop(frame, B4, 14),
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, color: "#FFF4FF", letterSpacing: 0.4 }}>
              Fact-check gate
            </div>
            <div style={{ marginTop: 8, fontSize: 16, fontWeight: 600, color: "rgba(255,244,255,0.6)" }}>
              Every card passes this before it reaches a kid
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 108,
              width: 1280,
              textAlign: "center",
              opacity: pop(frame, B4 + 60, 14),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(140,111,224,0.18)",
                border: `2px solid ${ACCENT}`,
              }}
            >
              <span style={{ fontSize: 20, color: ACCENT }}>✓</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#FFF4FF" }}>Textbook-verified</span>
            </div>
          </div>
        </>
      )}
      <MotionInsert
        effect="statusFocus"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          claims: [
            { text: "Every fact checked against textbook", verdict: "yes" },
            { text: "Card written only after the check", verdict: "yes" },
          ],
        }}
      />

      {/* ---------------- beat 5 : drawn finale — the five daily cards ---------------- */}
      <MotionInsert
        effect="cardCounter"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{
          cards: [
            { label: "Math", value: 1 },
            { label: "Norwegian", value: 1 },
            { label: "English", value: 1 },
            { label: "Science", value: 1 },
            { label: "Social studies", value: 1 },
          ],
          unit: "card",
          totalLabel: "Cards today",
        }}
      />

      <Ribbon frame={frame} />

      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: 18,
          fontSize: 14,
          fontWeight: 700,
          color: "rgba(255,244,255,0.55)",
          letterSpacing: 0.3,
        }}
      >
        Boytasks — daily lesson cards
      </div>
    </AbsoluteFill>
  );
};

export const FeatureFiveNewLessonCardsB96: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);

void END;
