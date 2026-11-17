// FeaturePracticeCardUsedAskB93 — feature b93 — 1280x720, 935 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat -> effect (commits 89114cd/50df24b/bf0b0cd are this feature's own commits; a commit
// only informs the beat whose sentence it proves):
// b1 15-175   "eight compound words meant eight separate cards, each waiting its turn"
//             cardCounter over the feature's own page (backdrop "page"). Matches commit
//             89114cd (lists for compound words (8) and mental-maths facts (8)). Opener
//             deliberately NOT titleTakeover (b97, b98) and NOT keywordCaption (b94).
// b2 176-354  "picking one card, answering, walking back... ate up the drilling time"
//             pipelineFlow, same page scrolled to the practice-cycle section (backdrop "page2").
// b3 355-557  "now one card holds the whole set — all eight... together"
//             ratioBars (8 cards -> 1 card), page scrolled further (backdrop "page3").
//             Matches commit 89114cd.
// b4 558-723  "each word is still tracked on its own in Supabase, so the due one shows first"
//             quadrantPositioning, drawn only — informed by commit 50df24b (repetition
//             tracked per word). No verified URL shows the Supabase row, so this is a
//             schematic with the real word examples, not a recording.
// b5 724-935  "vocabulary cards go even further — one card now holds ten words at once"
//             targetOverrun (1 -> 10 words/card), drawn, matches commit 50df24b, followed
//             by a LogWindow result. Ends here, never on the feature page or the hub (gate 2).
//
// Persistent element: the sidebar archetype, b1 through b5 — a fixed 320px left column
// holding the running claim (a big number plus a short label) that snaps to a new value
// and new label at every beat; the big stage to its right swaps content per beat.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Panel, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow, LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b93.json";

const B1 = 15;
const B2 = 176;
const B3 = 355;
const B4 = 558;
const B5 = 724;
const END = 935;

/** Sand's own accent (#B4531F) lifted brighter so it reads on the dark stage. */
const ACCENT = "#F0944B";
const STAGE = "#1A120A";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Sidebar geometry (1280x720): a fixed 320px left column, full height.
const COL_W = 320;

const BEATS = [
  { at: B1, value: 8, label: "EIGHT WORDS,\nEIGHT CARDS" },
  { at: B2, value: 8, label: "PICK, ANSWER,\nWALK BACK, REPEAT" },
  { at: B3, value: 1, label: "ONE CARD HOLDS\nALL EIGHT" },
  { at: B4, value: 1, label: "TRACKED PER WORD\nIN SUPABASE" },
  { at: B5, value: 10, label: "NOW TEN WORDS\nPER CARD" },
];

const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  let idx = 0;
  for (let i = 0; i < BEATS.length; i++) if (frame >= BEATS[i].at) idx = i;
  const { at, value, label } = BEATS[idx];
  const scale = punchScale(sec(frame, at, fps), 0);
  const fade = tween(sec(frame, at, fps), 0, 0.3, ease.power2Out);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: COL_W,
        height: 720,
        background: P.card,
        borderRight: `3px solid ${P.border}`,
        fontFamily,
        boxShadow: "6px 0 0 rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ position: "absolute", left: 28, top: 36, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        BOYTASKS
      </div>
      <div style={{ position: "absolute", left: 28, top: 58, width: 260, fontSize: 13, fontWeight: 600, color: P.muted, lineHeight: 1.3 }}>
        Screen time unlocks after tasks are done
      </div>

      <div
        style={{
          position: "absolute",
          left: 28,
          top: 230,
          fontSize: 150,
          fontWeight: 800,
          color: P.ink,
          lineHeight: 1,
          opacity: fade,
          transform: `scale(${scale})`,
          transformOrigin: "left center",
        }}
      >
        {value}
      </div>

      <div
        style={{
          position: "absolute",
          left: 28,
          top: 420,
          width: 260,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 0.8,
          color: P.accent,
          lineHeight: 1.35,
          whiteSpace: "pre-line",
          opacity: fade,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const RESULT_LINES: LogLine[] = [
  { t: "card", text: "compound-word deck: 8 → 1 card", tone: "success" },
  { t: "card", text: "math-facts deck: 8 → 1 card", tone: "success" },
  { text: "each word tracked on its own", tone: "muted" },
  { text: "due word surfaces first", tone: "accent" },
  { text: "vocabulary deck: 1 → 10 words/card", tone: "success" },
  { text: "fresh words picked each visit", tone: "muted" },
  { text: "drilling time back", tone: "accent" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: eight separate cards, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cardCounter"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          cards: [
            { label: "Compound words", value: 8 },
            { label: "Math facts", value: 8 },
          ],
          unit: "cards",
          totalLabel: "Separate decks",
        }}
      />

      {/* b2 — the old pick/answer/walk-back cycle */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Pick a card", "Answer it", "Walk back for the next"],
          result: "Drilling time lost",
          system: "Old flow",
        }}
      />

      {/* b3 — one card now holds the whole set (was ratioBars — its bracket/ratio reveal
          hadn't started yet at the beat's measured midpoint, leaving the frame sparse) */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} />}
      {frame >= B3 && frame < B4 && (
        <Panel x={140} y={90} w={1000} h={420} tone="note" radius={28} opacity={1}>
          <div style={{ padding: "30px 40px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>ONE CARD, WHOLE SET</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#101418", marginTop: 4 }}>Eight cards become one</div>
          </div>
          <div style={{ display: "flex", height: 230, alignItems: "center", justifyContent: "space-around", padding: "0 40px" }}>
            <IconCard x={0} y={0} w={260} emoji="🗂️" title="8 compound words" sub="Used to be 8 cards" tone="accent" />
            <IconCard x={0} y={0} w={260} emoji="🧮" title="8 math facts" sub="Also 8 separate cards" tone="accent" />
            <IconCard x={0} y={0} w={260} emoji="🃏" title="Now: 1 card" sub="Holds the whole set" tone="success" />
          </div>
        </Panel>
      )}

      {/* b4 — drawn: each word tracked on its own, due one shows first */}
      <MotionInsert
        effect="quadrantPositioning"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          xLabel: "correct in a row",
          yLabel: "days since last seen",
          items: [
            { label: "sykkel", x: 25, y: 85 },
            { label: "ost", x: 80, y: 15 },
            { label: "bro", x: 50, y: 50 },
            { label: "fisk", x: 15, y: 70 },
            { label: "katt", x: 90, y: 90 },
            { label: "stein", x: 8, y: 10 },
          ],
          focus: "sykkel",
        }}
      />

      {/* b5 — drawn: ten words per card, ending on the real result (supplemented with two
          flanking cards — targetOverrun's own content is a thin centered track that left
          the corners empty at the beat's measured midpoint) */}
      <MotionInsert
        effect="targetOverrun"
        from={B5}
        dur={Math.round((END - B5) * 0.55)}
        accent={ACCENT}
        data={{ label: "Words per vocabulary card", value: 10, target: 1, unit: "words" }}
      />
      {frame >= B5 && frame < B5 + Math.round((END - B5) * 0.55) && (
        <>
          <IconCard x={950} y={70} w={260} emoji="🔄" title="Fresh words" sub="Picked every visit" tone="accent" />
          <IconCard x={950} y={470} w={260} emoji="⏳" title="Drilling time" sub="Back where it belongs" tone="success" />
        </>
      )}
      {frame >= B5 + Math.round((END - B5) * 0.5) && (
        <LogWindow lines={RESULT_LINES} title="deck log" from={B5 + Math.round((END - B5) * 0.55)} every={16} opacity={1} fontSize={22} />
      )}

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeaturePracticeCardUsedAskB93: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
