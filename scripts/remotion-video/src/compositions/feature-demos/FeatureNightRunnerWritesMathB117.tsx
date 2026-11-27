// FeatureNightRunnerWritesMathB117 — feature b117 — 1280x720, 1078 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Persistent element: a deck of math cards that owns the center of the frame — cards
// fly in and pile up messily (red, hand-timed) through b1–b2, then the whole pile
// fans out into a sorted 3x2 grid the moment the fix lands in b3, flips green, and
// each card gets its own self-check mark through b4. The pile shrinking into a sorted
// fan IS the story. This deck is the element that survives every beat.
//
// Beat → effect (data only from the feature row; no live product URL or commit
// diff is verified for this feature tonight — only the feature's own page is,
// so b1 touches it briefly and everything else is drawn):
// b1 15-190    "building one math card by hand, timing every beat, over and over"
//              funnelAbsorption; three math cards fly into a messy, hand-stacked
//              pile tagged "manual"; small inset of the feature's own page grounds it.
// b2 190-398   "the real timing lived in a video component the robot couldn't run"
//              statusFocus — two more cards join the pile tagged "blocked in CI",
//              pile still messy and growing.
// b3 398-587   "rewrote that logic in plain code, exact fractions not rounded"
//              handoffExplain, citing cardRules.js (commit 9ff0b73) — the whole
//              pile fans out into a sorted grid and flips from red to green.
// b4 587-770   "it checks its own math before anything renders, catches drift"
//              pipelineFlow, citing series-parity.mjs (same commit) — each card in
//              the grid gets its own check mark, left to right.
// b5 770-1078  "lands on the exact same frame: 2992, not 2991"
//              drawn result, no catalog effect — a stamp posts below the grid:
//              old drift struck through, "0 frames · 2992" in green. A LogWindow
//              confirms the match. Holds to the end.

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive, cut } from "./motion-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shotsFile from "./shots/b117.json";

const B1 = 15;
const B2 = 190;
const B3 = 398;
const B4 = 587;
const B5 = 770;
const END = 1078;

/** Slate's own accent brightened a touch for a dark plate. */
const ACCENT = "#5B8DEF";
const STAGE = "#0F1620";

const DECK_BOX = { x: 260, y: 40, w: 760, h: 640 };
const TITLE_H = 86;
const GRID_PAD_X = 40;
const GRID_PAD_TOP = 32;
const CARD_GAP = 16;
const STAMP_GAP = 14;
const STAMP_H = 44;
const FAN_DUR = 42;
const CARD_W = (DECK_BOX.w - GRID_PAD_X * 2 - CARD_GAP * 2) / 3;
const CARD_H = (DECK_BOX.h - TITLE_H - GRID_PAD_TOP - STAMP_GAP - STAMP_H - 14 - CARD_GAP) / 2;
const GRID_TOP = DECK_BOX.y + TITLE_H + GRID_PAD_TOP;

type CardDef = { i: number; math: string; tag: string; arrive: number };
const CARDS: CardDef[] = [
  { i: 0, math: "3/8 + 1/4", tag: "manual", arrive: B1 + 10 },
  { i: 1, math: "1/2 × 2/3", tag: "manual", arrive: B1 + 60 },
  { i: 2, math: "5/6 − 1/3", tag: "manual", arrive: B1 + 110 },
  { i: 3, math: "7/8 + 1/8", tag: "blocked in CI", arrive: B2 + 10 },
  { i: 4, math: "2/5 × 5/6", tag: "blocked in CI", arrive: B2 + 80 },
];

/** 0.4 → 1 ease-out pop on arrival, no external motion-grammar dependency. */
const popIn = (frame: number, start: number, dur = 10) => {
  if (frame < start) return 0.4;
  const t = Math.min(1, (frame - start) / dur);
  return 0.4 + 0.6 * (1 - Math.pow(1 - t, 3));
};

const PRODUCT_BOX = { x: 36, y: 32, w: 200, h: 84 };

/** One-line context a first-time viewer needs: what the card metaphor even is.
 * Sits left of DECK_BOX (which starts at x:260), so it never collides with the pile. */
const ProductNamePlate: React.FC = () => {
  const P = usePalette();
  return (
    <Arrive at={B1 + 4} kind="wipe" box={PRODUCT_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: PRODUCT_BOX.x,
          top: PRODUCT_BOX.y,
          width: PRODUCT_BOX.w,
          height: PRODUCT_BOX.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 14px",
          boxSizing: "border-box",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>Boytasks — Night Runner</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, marginTop: 4, lineHeight: 1.3 }}>
          Each card = one worked example in an auto-built kids' math video
        </div>
      </div>
    </Arrive>
  );
};

/** One math card: pile position until B3, then eases into its sorted grid cell and flips red → green. */
const MathCard: React.FC<{ def: CardDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < def.arrive) return null;

  const col = def.i % 3;
  const row = Math.floor(def.i / 3);
  const rowOffset = row === 1 ? (CARD_W + CARD_GAP) / 2 : 0;
  const gridX = DECK_BOX.x + GRID_PAD_X + rowOffset + col * (CARD_W + CARD_GAP);
  const gridY = GRID_TOP + row * (CARD_H + CARD_GAP);

  const pileCenterX = DECK_BOX.x + DECK_BOX.w / 2;
  const pileCenterY = GRID_TOP + (CARD_H * 2 + CARD_GAP) / 2;
  const pileX = pileCenterX - CARD_W / 2 + Math.sin(def.i * 2.3) * 60;
  const pileY = pileCenterY - CARD_H / 2 + Math.cos(def.i * 1.7) * 50;
  const pileRot = Math.sin(def.i * 4.1) * 14 - 4;

  const fanT = interpolate(frame, [B3, B3 + FAN_DUR], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = pileX + (gridX - pileX) * fanT;
  const y = pileY + (gridY - pileY) * fanT;
  const rot = pileRot * (1 - fanT);
  const scale = popIn(frame, def.arrive);

  const flipped = frame >= B3;
  const color = flipped ? P.success : P.danger;
  const tag = flipped ? "exact fraction" : def.tag;
  const checked = frame >= B4 + def.i * 12;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        transform: `rotate(${rot}deg) scale(${scale})`,
        background: P.card,
        border: `3px solid ${color}`,
        borderRadius: 8,
        boxShadow: "0 10px 24px rgba(0,0,0,0.5)",
        fontFamily,
        padding: 14,
        boxSizing: "border-box",
        zIndex: 10 + def.i,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: P.muted, textTransform: "uppercase" }}>
        {tag}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: P.ink, marginTop: 10 }}>{def.math}</div>
      {checked && (
        <div style={{ position: "absolute", right: 12, bottom: 10, fontSize: 24, fontWeight: 900, color: P.success }}>
          ✓
        </div>
      )}
    </div>
  );
};

/** Archetype 3: a deck of math cards piles up messily, then fans into a sorted, checked grid. */
const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const status =
    frame >= B5
      ? "✓ frame-exact"
      : frame >= B4
      ? "series-parity.mjs"
      : frame >= B3
      ? "cardRules.js — 9ff0b73"
      : frame >= B2
      ? "blocked in CI"
      : "building manual";

  /** Plain-language gloss under the status line — every jargon term that
   * appears above gets one line translating it, right under it. */
  const statusGloss =
    frame >= B5
      ? "matches the hand-checked original, frame for frame"
      : frame >= B4
      ? "self-check that catches drift before it renders"
      : frame >= B3
      ? "the file that computes each card's exact timing"
      : frame >= B2
      ? "CI = the overnight robot — it can't open a browser"
      : "";

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: DECK_BOX.x,
          top: DECK_BOX.y,
          width: DECK_BOX.w,
          height: DECK_BOX.h,
          background: P.card,
          border: `4px solid ${ACCENT}`,
          borderRadius: 8,
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: DECK_BOX.x + 32,
          top: DECK_BOX.y + 24,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 2,
          color: P.muted,
          textTransform: "uppercase",
        }}
      >
        Night runner — card deck
      </div>
      <div
        style={{
          position: "absolute",
          left: DECK_BOX.x + 32,
          top: DECK_BOX.y + 50,
          fontSize: 16,
          fontWeight: 700,
          color: frame >= B3 ? P.success : P.danger,
        }}
      >
        {status}
      </div>
      {statusGloss && (
        <div
          style={{
            position: "absolute",
            left: DECK_BOX.x + 32,
            top: DECK_BOX.y + 72,
            width: DECK_BOX.w - 64,
            fontSize: 12,
            fontWeight: 600,
            color: P.muted,
          }}
        >
          {statusGloss}
        </div>
      )}

      {CARDS.map((def) => (
        <MathCard key={def.i} def={def} />
      ))}

      {frame >= B5 && (
        <Arrive
          at={B5}
          kind="rise"
          box={{ x: DECK_BOX.x + 32, y: GRID_TOP + CARD_H * 2 + CARD_GAP + STAMP_GAP, w: DECK_BOX.w - 64, h: STAMP_H }}
        >
          <div
            style={{
              position: "absolute",
              left: DECK_BOX.x + 32,
              top: GRID_TOP + CARD_H * 2 + CARD_GAP + STAMP_GAP,
              width: DECK_BOX.w - 64,
              height: STAMP_H,
              borderTop: `3px solid ${P.ink}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 10,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: P.muted, textDecoration: "line-through" }}>
              drift, 1 frame short
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: P.success }}>0 frames · 2992</div>
          </div>
        </Arrive>
      )}

      {[B1, B2, B3, B4, B5].map((at, i) => {
        const lit = frame >= at;
        const y = 140 + i * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 1150,
              top: y,
              width: 28,
              height: 28,
              borderRadius: 14,
              background: lit ? ACCENT : P.chipBg,
              border: `2px solid ${lit ? ACCENT : P.border}`,
              boxShadow: lit ? `0 0 0 6px ${P.accentBg}` : "none",
            }}
          />
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — one card, timed by hand, over and over. Small inset grounds the feature. */}
      {cut(frame, B1, B2) === 1 && <ProductNamePlate />}
      {cut(frame, B1, B2) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="feature"
          title="vitalii.no/features"
          from={B1}
          hold={130}
          zoom={() => 1}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={0.9}
          win={{ x: 60, y: 420, w: 260, h: 150 }}
        />
      )}
      <MotionInsert
        effect="funnelAbsorption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0}
        data={{ inputs: ["Every beat", "Every card", "Every day"], result: "Hours of manual timing" }}
      />

      {/* b2 — the timing lived inside a video component the robot couldn't run.
          Wrapped at zIndex above the card pile (10-14): the pile's messy cards
          were painting over this claim text (the "cut off by a red X" bug the
          blind viewer hit) because an explicit z-index sibling always wins
          over a z-index:auto one, regardless of paint order. */}
      <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
        <MotionInsert
          effect="statusFocus"
          from={B2}
          dur={B3 - B2}
          accent={ACCENT}
          plate={0}
          data={{
            title: "Nightly build",
            claims: [
              { text: "Timing lives in a video component", verdict: "yes" },
              { text: "That component runs in the CI robot", verdict: "no" },
            ],
          }}
        />
      </div>

      {/* b3 — rewritten in plain code, exact fractions, not rounded */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0}
        data={{
          from: "Rounded floats, video component",
          to: "Exact fractions, plain code",
          points: ["cardRules.js — exact fractions (9ff0b73)", "No browser needed", "Runs anywhere, same answer"],
        }}
      />

      {/* b4 — it checks its own math before anything renders */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0}
        data={{
          steps: ["Compute the exact timing", "Compare against the rule", "Catch drift before render"],
          result: "A wrong clip never reaches the kids",
          system: "series-parity.mjs",
        }}
      />

      <CardDeck />

      {/* b5 — the result: frame 2992, not 2991. Drawn, holds to the end.
          Wrapped at zIndex above the card pile (10-14): the finished grid was
          painting over this log (the "code obscured behind cards" bug the
          blind viewer hit) for the same z-index reason as b2. By now the
          grid has already shown its fan-out and checkmarks for 135 frames
          (B4+48 .. B5), so the log taking over the frame is the beat change,
          not a loss. */}
      {frame >= B5 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
          <LogWindow
            title="night-runner"
            from={B5 + 20}
            every={16}
            opacity={1}
            win={{ x: 140, y: 70, w: 1000, h: 420 }}
            fontSize={22}
            lines={[
              { t: "01", text: "expected_frame: 2992", tone: "accent" },
              { t: "02", text: "rendered_frame: 2992", tone: "success" },
              { t: "03", text: "drift: 0 frames", tone: "success" },
              { t: "04", text: "timing_source: exact fractions (cardRules.js)", tone: "ink" },
              { text: "→ the file that computes each card's exact timing", tone: "muted" },
              { t: "05", text: "self_check: passed before render", tone: "success" },
              { t: "06", text: "status: lesson ships, frame-exact", tone: "success" },
              { text: "→ the video a kid watches matches the hand-checked original", tone: "muted" },
            ]}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

export const FeatureNightRunnerWritesMathB117: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
