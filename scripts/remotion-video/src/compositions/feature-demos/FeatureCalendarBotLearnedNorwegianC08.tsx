// FeatureCalendarBotLearnedNorwegianC08 — feature c08 — 1280x720, 904 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Verified URLs only: the feature's own page, the features hub, the commit history,
// and commit 857c746c — recorded as four shots and used as LiveBackdrop/LiveWindow
// evidence for b1-b4. Commit 40cb6cd2 (weekly-series parsing) proves a different
// sentence than any beat here, so it is never shown. b5 has no live backdrop
// (gate 2: the last beat may not be the feature's own page or hub, and no commit
// matches its sentence) — it closes on a drawn LogWindow built only from facts
// already in the feature row, plus the deck's final card.
//
// Beat -> effect (data only from the feature row, no invented numbers):
// b1 15-249   "Say 'Hoffsvangen skole'... it heard noise - spelling it out
//             phonetically, wrong every time."
//             titleTakeover over the feature page (backdrop "page").
// b2 249-375  "It never knew the real name, just sounded it out and guessed."
//             keywordCaption over the hub (backdrop "hub").
// b3 375-550  "Now a SQLite table holds the real names and every wrong guess
//             the bot has ever made."
//             pipelineFlow: hears a name -> checks SQLite vocab table -> matches
//             canonical name, over the commit history (backdrop "commits").
// b4 550-734  "It checks that table first - like a notepad of corrections, not
//             a fresh guess every time."
//             handoffExplain over a zoomed, focused view of commit 857c746c (the
//             commit that actually adds the Norwegian-first lookup) — the one
//             piece of evidence zoomed 2.1x-2.4x on the diff hunk.
// b5 734-904  "Hear a name once, and it's matched correctly every time after."
//             drawn only: a LogWindow with the real vocab-table facts (canonical
//             names, aliases, self-learning on correction, Cyrillic refused).
//             Holds to the end, no fade.
//
// Persistent element: the card deck (archetype 3) low band, b1-b5 — a product
// plate at left, five cards flying in and fanning left-to-right as the story
// moves from "guessing phonetically" (red) to "matched every time" (green).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shotsFile from "./shots/c08.json";

const B1 = 15;
const B2 = 249;
const B3 = 375;
const B4 = 550;
const B5 = 734;
const END = 904;

const ACCENT = "#5B37D4";
const STAGE = "#15102B";

// Deck band geometry (1280x720, below the effects' safe bottom at y≈587).
const LT = { x: 30, y: 586, w: 1220, h: 128 };
const CARD_W = 160;
const CARD_H = 96;
const CARD_START = LT.x + 210;
const CARD_END = LT.x + LT.w - 16;

type Tone = "danger" | "success";
const CARDS: { at: number; label: string; tone: Tone; tilt: number }[] = [
  { at: B1 + 20, label: "PHONETIC\nGUESSES", tone: "danger", tilt: -4 },
  { at: B2 + 20, label: "NO REAL\nNAMES", tone: "danger", tilt: 3 },
  { at: B3 + 20, label: "VOCAB TABLE\nBUILT", tone: "success", tilt: -3 },
  { at: B4 + 20, label: "CHECKS\nFIRST", tone: "success", tilt: 2 },
  { at: B5 + 20, label: "LEARNS\nONCE", tone: "success", tilt: -2 },
];
const CARD_GAP = (CARD_END - CARD_START - CARD_W) / (CARDS.length - 1);

const Deck: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

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
            boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          }}
        />
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 20, width: 170 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>CALENDAR</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            Calendar
            <br />
            Telegram Bot
          </div>
        </div>
      </Arrive>

      {CARDS.map((c, i) => {
        if (frame < c.at) return null;
        const cx = CARD_START + i * CARD_GAP;
        const bg = c.tone === "danger" ? P.dangerBg : P.successBg;
        const edge = c.tone === "danger" ? P.dangerEdge : P.successEdge;
        const ink = c.tone === "danger" ? P.danger : P.success;
        return (
          <Arrive key={c.label} at={c.at} kind="punch" box={{ x: cx, y: LT.y + 14, w: CARD_W, h: CARD_H }}>
            <div
              style={{
                position: "absolute",
                left: cx,
                top: LT.y + 14,
                width: CARD_W,
                height: CARD_H,
                transform: `rotate(${c.tilt}deg)`,
                background: bg,
                border: `2px solid ${edge}`,
                borderRadius: 6,
                boxShadow: "4px 5px 0 rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 10px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.8, color: ink, whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.3 }}>
                {c.label}
              </div>
            </div>
          </Arrive>
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: heard noise, not a name, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Heard noise, not a name", kicker: "Every Norwegian place name, spelled out phonetically — wrong every time" }}
      />

      {/* b2 — what the bot never kept: the real name, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.6}
        data={{
          line1: "Never knew the real name",
          line2: "just sounded it out and guessed",
          keywords: ["sounded it out", "guessed"],
        }}
      />

      {/* b3 — the fix: a SQLite vocab table of real names and past guesses, over the commit history */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="commits" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.65}
        data={{
          steps: ["Hears a place name", "Checks the SQLite vocab table", "Matches the canonical name"],
          result: "Real names, not guesses",
          system: "SQLite vocab table",
        }}
      />

      {/* b4 — checks the notepad first: zoomed on the commit that adds the lookup */}
      {cut(frame, B4, B5) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="commit"
          title="calendar-bot · commit 857c746c"
          from={B4}
          hold={B5 - B4}
          zoom={(t) => 2.1 + 0.3 * t}
          focus={{ x: 0.5, y: 0.42 }}
          opacity={1}
          win={{ x: 150, y: 196, w: 980, h: 450 }}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.5}
        data={{
          from: "Fresh guess every time",
          to: "Checks the notepad first",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["SQLite vocab table", "Canonical name + aliases", "Written in Norwegian, not Cyrillic"],
        }}
      />

      {/* b5 — drawn only: no live backdrop (gate 2). Holds to the end, no fade. */}
      <LogWindow
        from={B5 + 20}
        every={18}
        opacity={frame >= B5 ? 1 : 0}
        title="calendar-bot · vocab table"
        fontSize={22}
        win={{ x: 150, y: 170, w: 980, h: 420 }}
        lines={[
          { t: "vocab", text: "place -> \"Hoffsvangen skole\" (alias: Хоусваген Скуле)", tone: "accent" },
          { t: "vocab", text: "term -> \"Utviklingssamtale\" (alias: Утвіклінгссамталє)", tone: "accent" },
          { t: "lookup", text: "checks canonical name + aliases before any phonetic guess", tone: "success" },
          { t: "learn", text: "correction heard once -> new alias appended automatically", tone: "success" },
          { t: "guard", text: "canonical entries must be Norwegian, never Cyrillic", tone: "muted" },
        ]}
      />

      <Deck />
    </AbsoluteFill>
  );
};

export const FeatureCalendarBotLearnedNorwegianC08: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
