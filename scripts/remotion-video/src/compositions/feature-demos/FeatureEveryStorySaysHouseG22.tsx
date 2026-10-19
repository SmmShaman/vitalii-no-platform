// FeatureEveryStorySaysHouseG22 — feature g22 — 1280x720, 963 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row, meta-g22.json, no invented numbers):
// b1 15-165   "the story starts talking — but never says which house"
//             keywordCaption over the feature's own page (backdrop).
// b2 165-298  "digits came out wrong every time"
//             cornerTags: house numbers / years / counts / every voice line.
// b3 298-502  "every story opens with its real address, Kartverket, two languages"
//             handoffExplain — no public UI for an address lookup, base stage only.
// b4 502-640  "every number inside is spelled out in words"
//             copyCorrection over a worker LogWindow (no runtime log exists for this
//             product; lines are paraphrased straight from meta-g22.json, not invented).
// b5 640-794  "even the old stories are rewritten the same way"
//             pipelineFlow over the features hub (backdrop).
// b6 794-963  "the result: zero digits left to mishear"
//             titleTakeover, no page/hub behind it (gate: last beat never ends on the
//             feature page or the hub) — the card deck's own final stamp carries the close.
//
// Persistent element: a card deck (archetype 3) in the bottom band, one card lighting
// up per beat, peeling from a dim "which house?" pile to a bright "0 digits left" stamp.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, IconCard, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g22.json";

const B1 = 15;
const B2 = 165;
const B3 = 298;
const B4 = 502;
const B5 = 640;
const B6 = 794;
const END = 963;

/** Accent tuned for the dark stage (violet's #5B37D4 reads fine, kept as-is). */
const ACCENT = "#8E6FEA";
const STAGE = "#17132B";

// Card-deck band (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const CARD_W = 272;
const GAP = 18;
const CARD_H = 70;
const CARD_Y = LT.y + 11;
const SLOT_X = (i: number) => LT.x + 14 + i * (CARD_W + GAP);

// LogWindow sits above the card-deck band so the two never overlap.
const LOG_WIN = { x: 150, y: 150, w: 980, h: 430 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const lit1 = frame >= B3 + 40; // ADDRESS
  const lit2 = frame >= B4 + 40; // WORDS
  const lit3 = frame >= B5 + 40; // CATALOG
  const final = frame >= B6 + 40; // RESULT
  const stampP = final ? punchScale(sec(frame, B6 + 40, fps), 0) : 0;

  const Card: React.FC<{ i: number; label: string; value: string; lit: boolean; big?: boolean }> = ({
    i,
    label,
    value,
    lit,
    big,
  }) => (
    <div
      style={{
        position: "absolute",
        left: SLOT_X(i),
        top: CARD_Y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 10,
        background: lit ? P.successBg : P.card,
        border: `2px solid ${lit ? P.successEdge : P.border}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.6, color: lit ? P.success : P.muted }}>
        {label}
      </div>
      <div style={{ fontSize: big ? 26 : 17, fontWeight: 800, color: lit ? P.ink : P.muted, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 20} kind="wipe" box={LT} dur={0.5}>
        <Card i={0} label={final ? "RESULT" : "OPENING"} value={final ? "0 digits left" : "which house?"} lit={final} big={final} />
        <Card i={1} label="ADDRESS" value={lit1 ? "Kartverket, named" : "not spoken"} lit={lit1} />
        <Card i={2} label="NUMBERS" value={lit2 ? "spelled in words" : "left as digits"} lit={lit2} />
        <Card i={3} label="CATALOG" value={lit3 ? "old chapters too" : "new stories only"} lit={lit3} />
      </Arrive>
      {final && (
        <div
          style={{
            position: "absolute",
            left: SLOT_X(0) - 6,
            top: CARD_Y - 14,
            width: CARD_W + 12,
            height: CARD_H + 28,
            borderRadius: 12,
            border: `3px solid ${P.success}`,
            transform: `scale(${stampP})`,
            transformOrigin: "center",
          }}
        />
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "The story starts talking.", line2: "Never says which house.", keywords: ["which house"] }}
      />

      {/* b2 — digits misread every time, drawn (no public UI for this) */}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          statement: "Digits, misread every time",
          tags: ["House numbers", "Years", "Counts", "Every voice line"],
        }}
      />
      {/* the corner tags leave the top strip and the gap above the card deck empty —
          fill both with the beat's own statement and tag words, nothing new. */}
      {frame >= B2 && frame < B3 && (
        <>
          <StatPill x={110} y={30} emoji="🔢" text="House numbers, Years, Counts" tone="accent" />
          <StatPill x={700} y={30} emoji="📢" text="Digits, misread every time" tone="danger" />
          <StatPill x={470} y={540} emoji="🗣" text="Every voice line" tone="accent" />
        </>
      )}

      {/* b3 — the fix: real address, two languages, before the flash begins */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          from: "No address spoken",
          to: "Real address, spoken first",
          points: [
            "Looked up via Kartverket (Norway's address registry)",
            "Spoken in Ukrainian",
            "Spoken in Norwegian",
          ],
        }}
      />
      {/* the old/new handoff panel sits mid-frame, leaving the top band empty — fill it
          with the two real facts the panel's own points already name. */}
      {frame >= B3 && frame < B4 && (
        <>
          <IconCard x={90} y={70} w={300} emoji="🏠" title="Real address" sub="spoken first" tone="accent" />
          <IconCard x={890} y={70} w={300} emoji="🌐" title="Kartverket" sub="address registry" tone="accent" />
        </>
      )}

      {/* b4 — every number spelled out; no runtime log exists, so the worker window
          shows real behaviour paraphrased from the feature's own description. */}
      {cut(frame, B4, B5) === 1 && (
        <LogWindow
          win={LOG_WIN}
          title="retroactive respell"
          from={B4 + 10}
          every={16}
          opacity={1}
          lines={[
            { text: "scan generated text for raw digits", tone: "muted" },
            { text: "found: house numbers, years, counts", tone: "muted" },
            { text: "spell each one out in words", tone: "accent" },
            { text: "zero digits left in new text", tone: "success" },
            { text: "walk already-published catalog", tone: "muted" },
            { text: "re-voice only touched chapters", tone: "accent" },
            { text: "catalog matches, nothing re-rendered twice", tone: "success" },
          ]}
        />
      )}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          wrong: "17 families lived here in 1942",
          right: "seventeen families lived here in nineteen forty-two",
          label: "spelled out, not digits",
        }}
      />

      {/* b5 — even the old catalog gets rewritten, over the features hub */}
      {cut(frame, B5, B6) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B5} hold={B6 - B5} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B5}
        dur={B6 - B5}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Walk the catalog", "Rewrite stray digits", "Re-voice touched chapters"],
          result: "Old stories now match new ones",
        }}
      />

      {/* b6 — the result, no page or hub behind it */}
      <MotionInsert
        effect="titleTakeover"
        from={B6}
        dur={END - B6}
        accent={ACCENT}
        data={{ title: "Zero digits left", kicker: "Every story. Every chapter." }}
      />
      {/* the headline sits vertically centered, leaving top and lower bands empty — flank it
          with the real before/after (already named in b2/b4), not new figures. */}
      {frame >= B6 && (
        <>
          <StatPill x={110} y={100} emoji="🔢" text="Before: digits in every chapter" tone="accent" opacity={0.75} />
          <StatPill x={740} y={100} emoji="✅" text="After: zero digits left" tone="success" />
        </>
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureEveryStorySaysHouseG22: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
