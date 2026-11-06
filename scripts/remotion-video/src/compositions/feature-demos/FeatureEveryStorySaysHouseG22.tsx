// FeatureEveryStorySaysHouseG22 — feature g22 — 1280x720, 963 frames @ 30fps, VOICE-SYNCED.
// RE-SHOOT (2026-11-06): same narration, same windows. archetype 3 card-deck, mood mint.
// Only new picture detail: commit 9f169ae ("numbers spoken as words and the house
// address before every flash", files address.py/respell.py/runner.py) is the one commit
// of the three given tonight whose message matches a beat's sentence (b3+b4). No verified
// GitHub URL was listed to record it live, so it is cited as a small tech caption instead
// of a diff screenshot — the other two commits (a32dc6e place-off-the-road, aa9d0f2
// museum-records) don't prove any sentence in THIS clip's narration and are not shown.
//
// Beat → effect (data only from the feature row / meta-g22.json, no invented numbers):
// b1 15-165   "the story starts talking — but never says which house"
//             quoteMarker over the feature's own page (backdrop). Fresh opener — the
//             previous cut (mood violet) opened on keywordCaption, same as g21/b78, and
//             this session already opened on cornerTags (g26) and copyCorrection (g05).
// b2 165-298  "digits came out wrong every time"
//             statusFocus: three claims (house numbers / years / counts), each marked ×.
// b3 298-502  "every story opens with its real address, Kartverket, two languages"
//             hubRouting — Kartverket + street/number route into the real address, which
//             routes out to Ukrainian and Norwegian. No public UI for this, base stage only.
// b4 502-640  "every number inside is spelled out in words"
//             copyCorrection over a worker LogWindow (no runtime log exists for this
//             product; lines are paraphrased straight from the feature text, not invented).
// b5 640-794  "even the old stories are rewritten the same way"
//             pipelineFlow over the features hub (backdrop).
// b6 794-963  "the result: zero digits left to mishear"
//             percentRing, no page/hub behind it (gate: last beat never ends on the
//             feature page or the hub) — ring fills to a clean catalog, card deck closes.
//
// Persistent element: a card deck (archetype 3) in the bottom band, one card lighting
// up per beat, peeling from a dim "which house?" pile to a bright "0 digits left" stamp.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette, cardShadow } from "./bright-theme";
import { fontFamily, StatPill } from "./bright-primitives";
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

const ACCENT = "#2BBE8F";
const STAGE = "#0E1A16";

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

// bright-primitives' IconCard titles use the light-theme "ink" colour, which is
// near-black and invisible on this clip's dark stage — this is the same card
// but with a readable title colour for a dark background.
const DarkIconCard: React.FC<{
  x: number;
  y: number;
  w: number;
  emoji: string;
  title: string;
  sub?: string;
  tone?: "danger" | "success" | "accent";
}> = ({ x, y, w, emoji, title, sub, tone = "accent" }) => {
  const P = usePalette();
  const c = tone === "danger" ? P.danger : tone === "success" ? P.success : P.accent;
  const bg = tone === "danger" ? P.dangerBg : tone === "success" ? P.successBg : P.accentBg;
  const edge = tone === "danger" ? P.dangerEdge : tone === "success" ? P.successEdge : P.accentEdge;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily }}>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: 30,
          background: bg,
          border: `2px solid ${edge}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 56,
          boxShadow: cardShadow,
        }}
      >
        {emoji}
      </div>
      <div style={{ fontSize: 23, fontWeight: 700, color: P.bgTop, textAlign: "center", lineHeight: 1.25 }}>{title}</div>
      {sub ? <div style={{ fontSize: 17.5, fontWeight: 600, color: c, textAlign: "center", lineHeight: 1.3 }}>{sub}</div> : null}
    </div>
  );
};

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
        effect="quoteMarker"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          quote: "A quiet street, decades ago — but never which house.",
          highlight: "which house",
        }}
      />

      {/* b2 — digits misread every time, drawn (no public UI for this) */}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "Every number, misread",
          claims: [
            { text: "House numbers", verdict: "no" },
            { text: "Years", verdict: "no" },
            { text: "Counts", verdict: "no" },
          ],
        }}
      />
      {frame >= B2 && frame < B3 && (
        <>
          <DarkIconCard x={840} y={70} w={360} emoji="🚗" title="Driving at speed" sub="no way to double-check" tone="danger" />
          <DarkIconCard x={840} y={250} w={360} emoji="🔢" title="Digits only" sub="never spelled out" tone="danger" />
          <DarkIconCard x={840} y={430} w={360} emoji="📉" title="Counts drift" sub="totals never verified" tone="danger" />
          <StatPill x={470} y={540} emoji="🗣" text="Every voice line" tone="accent" />
        </>
      )}

      {/* b3 — the fix: real address, two languages, before the flash begins */}
      <MotionInsert
        effect="hubRouting"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          inputs: ["Kartverket registry", "Street + house number"],
          hub: "Real address, spoken first",
          outputs: ["Ukrainian", "Norwegian"],
        }}
      />
      {frame >= B3 && frame < B4 && (
        <>
          <DarkIconCard x={90} y={70} w={300} emoji="🏠" title="Real address" sub="spoken first" tone="accent" />
          <DarkIconCard x={890} y={70} w={300} emoji="🌐" title="Kartverket" sub="address registry" tone="accent" />
          <StatPill x={150} y={520} emoji="📍" text="Looked up automatically" tone="accent" />
          <StatPill x={740} y={520} emoji="🗣" text="Spoken before the story starts" tone="accent" />
          <div style={{ position: "absolute", left: 40, top: 18, fontSize: 14, fontWeight: 700, letterSpacing: 0.4, color: "#8FD9BC", fontFamily }}>
            address.py · respell.py — commit 9f169ae
          </div>
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
        effect="percentRing"
        from={B6}
        dur={END - B6}
        accent={ACCENT}
        base={STAGE}
        data={{
          value: 100,
          label: "catalog clean of stray digits",
          threshold: 50,
          notes: ["Every chapter respelled", "Zero digits left to mishear"],
        }}
      />
      {frame >= B6 && (
        <>
          {/* kept in the top band, clear of the percentRing's own centred ring+text block
              (which sits lower, roughly y 240-480) — the old IconCards at y 220/400 sat
              right on top of that text and their title used the light-theme ink colour,
              invisible on this dark stage. */}
          <StatPill x={110} y={100} emoji="🔢" text="Before: digits in every chapter" tone="accent" opacity={0.75} />
          <StatPill x={740} y={100} emoji="✅" text="After: zero digits left" tone="success" />
          <StatPill x={110} y={170} emoji="📬" text="New stories — auto-respelled" tone="success" />
          <StatPill x={740} y={170} emoji="🗂" text="Old catalog — rewritten too" tone="success" />
        </>
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureEveryStorySaysHouseG22: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
