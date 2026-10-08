// FeatureOneCatalog23EffectsP73 — feature p73 — 1280x720, 997 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood dawn. Motion direction (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence from the digest's 23-effect catalog, over the real
// product as evidence, one owner of the frame, a reading hold at the end of every beat,
// cuts not fades — the same direction as FeatureFirst20SecondsUsedP75Motion (p75).
//
// Beat → effect (data only from the feature row and commits 73dc668 / 6102737):
// b1 15-210   "writes a script for each news beat, then has to guess which graphic fits"
//             titleTakeover over the feature's own page. The card deck (archetype) flies
//             in and lands as a loose, slightly rotated pile over the lower third, a "?"
//             badge above it — nothing resolved yet.
// b2 210-421  "the script writer described a visual idea in prose; the renderer guessed"
//             cornerTags: the claim + four facts, over the page scrolled further. The pile
//             puts a red mismatch cross on one card — the renderer picking the wrong one.
// b3 421-582  "now both sides read from one shared catalog of effects, built with Remotion"
//             handoffExplain over the real commit (73dc668, the digest-motion skill landing).
//             The one tech name ("Remotion") sits in the hand-off points. The pile folds,
//             one card at a time, into a tidy row — the catalog is now shared.
// b4 582-799  "no more generic fallback graphics — percent rings, region callouts and
//             timelines get picked by name instead" — effect: drawn. The archetype's
//             payoff: the row fans out into a two-row grid filling the frame, the three
//             named cards (Percent Ring, Region Callout, Timeline) on top, large, while
//             the other three sit small and dim below — the catalog, read by name, up close.
// b5 799-997  "that catalog started at 12 effects and grew, the same evening, to 23"
//             ratioBars 12 → 23 over the real commit (6102737, motion grammar v2: 12
//             reworked + 11 new = 23). The grid folds back into the row, fully lit, a "23"
//             badge popping where the "?" used to sit. Holds to the end, no fade.
//
// Persistent element: the card deck (archetype 3), b1 through b5 — it never leaves the
// frame; the same six cards only change how they are arranged (pile → row → grid → row).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LiveWindow, LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p73.json";

const B1 = 15;
const B2 = 210;
const B3 = 421;
const B4 = 582;
const B5 = 799;
const END = 997;

/** Dawn accent (azure on deep navy) tuned for the dark stage plate. */
const ACCENT = "#4C8DFF";
const STAGE = "#0E1526";

// The card deck: six cards that start as a loose pile over the lower third (archetype's
// resting band, matches the effects' safe-bottom band), fold into a tidy row once the
// catalog is shared, then fan out into a grid filling the frame for b4's payoff.
const BAND = { x: 40, y: 606, w: 1200, h: 92 };
const GRID = { x: 140, y: 72, w: 1000, h: 556 };

const GRID_IN_START = B4 + 15;
const GRID_IN_DUR = 18;
const GRID_OUT_START = B5 - 26;
const GRID_OUT_DUR = 20;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Rect = { x: number; y: number; w: number; h: number };
const mixRect = (p: number, a: Rect, b: Rect): Rect => ({
  x: mix(p, a.x, b.x),
  y: mix(p, a.y, b.y),
  w: mix(p, a.w, b.w),
  h: mix(p, a.h, b.h),
});

// b3: a second, sharply-zoomed window onto the real commit that earns "built with
// Remotion" — the full-bleed LiveBackdrop behind HandoffExplain stays, but a blind
// viewer read it as an AI chat screenshot because its scroll target (shots/p73.json)
// used to land on the commit message, not the diff. Fades out before HandoffExplain's
// own camera pan (~local frame 77) brings its "new" card into this same screen region.
const LW3_IN = B3 + 6;
const LW3_HOLD_END = B3 + 70;
const LW3_OUT_DUR = 10;

// b5: "see it work" — a terminal log built only from this feature's own real names
// and numbers (no invented article content), proving the catalog gets read by name.
const CATALOG_LOG: LogLine[] = [
  { t: "73dc668", text: "catalog landed: 12 effects", tone: "accent" },
  { t: "pick", text: "percentRing   — by name", tone: "ink" },
  { t: "pick", text: "regionCallout — by name", tone: "ink" },
  { t: "pick", text: "timeline      — by name", tone: "ink" },
  { t: "6102737", text: "+11 new, same evening", tone: "accent" },
  { t: "done", text: "catalog: 23, 0 fallbacks", tone: "success" },
];

type Chip = { key: string; label: string; hero: boolean; gloss?: string };
const CHIPS: Chip[] = [
  { key: "title", label: "Title Takeover", hero: false },
  { key: "corner", label: "Corner Tags", hero: false },
  { key: "handoff", label: "Handoff", hero: false },
  { key: "percent", label: "Percent Ring", hero: true, gloss: "a % fills a ring" },
  { key: "region", label: "Region Callout", hero: true, gloss: "a map pin + label" },
  { key: "timeline", label: "Timeline", hero: true, gloss: "steps light up in order" },
];

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Row layout: six even slots across the band — the resting state once folded.
  const PAD = 10;
  const GAP = 6;
  const slotW = (BAND.w - PAD * 2 - GAP * 5) / 6;
  const rowH = BAND.h - PAD * 2;
  const rowY = BAND.y + PAD;

  // Grid layout: hero cards big on top, plain cards small and dim below.
  const colGap = 24;
  const colW = (GRID.w - colGap * 2) / 3;
  const topRowH = GRID.h * 0.62;
  const bottomRowH = GRID.h - topRowH - 16;
  const bottomCardW = colW * 0.7;

  const gridInT = tween(sec(frame, GRID_IN_START, fps), 0, GRID_IN_DUR / fps, ease.power3Out);
  const gridOutT = tween(sec(frame, GRID_OUT_START, fps), 0, GRID_OUT_DUR / fps, ease.power3Out);
  const gridness = gridInT * (1 - gridOutT);

  const mismatch = frame >= B2 && frame < B3;
  const showQuestion = frame < B2;
  const showCounter = frame >= B5 + 40;
  const counterPop = showCounter ? punchScale(sec(frame, B5 + 40, fps), 0) : 1;

  const kicker = gridness > 0.5 ? "PICKED BY NAME" : frame >= B3 ? "ONE SHARED CATALOG" : "GUESSWORK, CARD BY CARD";

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {showQuestion && (
        <div
          style={{
            position: "absolute",
            left: BAND.x + BAND.w / 2 - 14,
            top: BAND.y - 40,
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

      {showCounter && (
        <div
          style={{
            position: "absolute",
            left: BAND.x + BAND.w - 56,
            top: BAND.y - 42,
            width: 44,
            height: 32,
            borderRadius: 6,
            background: P.success,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 800,
            transform: `scale(${counterPop})`,
          }}
        >
          23
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: BAND.x + PAD,
          top: BAND.y - 24,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 2,
          color: P.accent,
        }}
      >
        {kicker}
      </div>

      {CHIPS.map((chip, i) => {
        // Pile: a loose stack over the band's centre, each card nudged and rotated.
        const pileW = 150;
        const pileH = 72;
        const pileCx = BAND.x + BAND.w / 2;
        const pileCy = BAND.y + BAND.h / 2;
        const pileRect: Rect = {
          x: pileCx - pileW / 2 + (i - 2.5) * 5,
          y: pileCy - pileH / 2 - i * 2,
          w: pileW,
          h: pileH,
        };
        const pileRot = (i - 2.5) * 3.5;

        const rowRect: Rect = { x: BAND.x + PAD + i * (slotW + GAP), y: rowY, w: slotW, h: rowH };

        const isHero = chip.hero; // percent / region / timeline
        const heroCol = i - 3; // 0,1,2 for the three hero cards
        const plainCol = i; // 0,1,2 for the three plain cards
        const gridRect: Rect = isHero
          ? { x: GRID.x + heroCol * (colW + colGap), y: GRID.y, w: colW, h: topRowH }
          : {
              x: GRID.x + plainCol * (colW + colGap) + (colW - bottomCardW) / 2,
              y: GRID.y + topRowH + 16,
              w: bottomCardW,
              h: bottomRowH,
            };

        // Fold from the pile into the row, one card at a time, once the catalog is shared.
        const foldT = tween(sec(frame, B3, fps), i * 0.06, 0.5, ease.power3Out);
        const settled = mixRect(gridness, rowRect, gridRect);
        const rect = mixRect(foldT, pileRect, settled);
        const rotation = pileRot * (1 - foldT);

        // Fly in and stack at the very start of the clip, staggered.
        const arriveT = sec(frame, B1 + 4, fps);
        const entranceScale = punchScale(arriveT, i * 0.05);
        const entranceOpacity = tween(arriveT, i * 0.05, 0.12, ease.linear);

        const isMismatchTarget = mismatch && chip.key === "corner";
        const landed = foldT > 0.5; // lights up the moment this card's own fold completes
        const dimInGrid = gridness > 0.5 && !isHero;
        const heroBigInGrid = gridness > 0.5 && isHero;

        const bg = isMismatchTarget ? P.dangerBg : landed ? P.successBg : P.chipBg;
        const edge = isMismatchTarget ? P.dangerEdge : landed ? P.successEdge : P.border;
        const fg = isMismatchTarget ? P.danger : landed ? P.success : P.muted;
        const labelSize = heroBigInGrid ? 24 : 14;

        return (
          <div
            key={chip.key}
            style={{
              position: "absolute",
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              transform: `rotate(${rotation}deg) scale(${entranceScale})`,
              opacity: entranceOpacity * (dimInGrid ? 0.55 : 1),
              zIndex: isMismatchTarget ? 50 : i,
              borderRadius: 6,
              background: bg,
              border: `2px solid ${edge}`,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: labelSize, fontWeight: 800, color: fg, textAlign: "center", lineHeight: 1.15 }}>
              {chip.label}
            </div>
            {heroBigInGrid && chip.gloss && (
              <div style={{ fontSize: 13, fontWeight: 600, color: P.muted, textAlign: "center", marginTop: 4, lineHeight: 1.2 }}>
                {chip.gloss}
              </div>
            )}
            {isMismatchTarget && (
              <div style={{ position: "absolute", fontSize: rect.h * 0.7, color: P.danger, fontWeight: 900 }}>×</div>
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

  // b1 — a one-line product plate: who this is, so a stranger isn't left guessing.
  const plateT = tween(sec(frame, B1 + 4, fps), 0, 0.3, ease.power3Out);
  const plateOpacity = frame >= B1 && frame < B2 ? plateT : 0;

  // b3 — the sharp, zoomed window onto the real commit (see LW3_* comment above).
  const lw3In = tween(sec(frame, LW3_IN, fps), 0, 0.2, ease.power2Out);
  const lw3Out = tween(sec(frame, LW3_HOLD_END, fps), 0, LW3_OUT_DUR / fps, ease.power2Out);
  const lw3Opacity = frame >= B3 && frame < B4 ? lw3In * (1 - lw3Out) : 0;

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Which graphic fits?", kicker: "My digest guesses, beat by beat" }}
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
            background: "rgba(14,21,38,0.78)",
            border: `1.5px solid ${ACCENT}`,
            color: "#EAF1FF",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.3,
            fontFamily,
            opacity: plateOpacity,
            transform: `translateY(${(1 - plateOpacity) * -8}px)`,
          }}
        >
          <span style={{ color: ACCENT, fontWeight: 800 }}>vitalii.no</span>
          <span style={{ opacity: 0.85 }}>— Portfolio &amp; News Platform</span>
        </div>
      )}

      {/* b2 — no shared vocabulary between the two steps */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Two sides, no shared vocabulary",
          tags: ["Idea described in prose", "Renderer's fixed list", "Guesswork every beat", "Mismatched graphics"],
        }}
      />

      {/* b3 — the fix, over the real commit landing the shared catalog skill */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="commit1" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Guessing from two separate lists",
          to: "One shared effects catalog",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Script picks an effect by name", "Renderer resolves the same name", "Built with Remotion"],
        }}
      />
      {lw3Opacity > 0.004 && (
        <LiveWindow
          file={shotsFile}
          shot="commit1"
          title="commit 73dc668 · MotionPreviewEntry.tsx"
          from={B3}
          hold={B4 - B3}
          zoom={(t) => 2.0 + 0.3 * t}
          focus={{ x: 0.42, y: 0.3 }}
          opacity={lw3Opacity}
          win={{ x: 740, y: 140, w: 460, h: 380 }}
        />
      )}

      {/* b4 — archetype only: the row fans out into a grid, naming the three effects */}

      {/* b5 — the result, over the commit that took the catalog from 12 to 23, holds to the end.
          RatioBars already darkens its own stage (look.scrim) for text contrast, so stacking
          the usual plate=0.7 on top left the commit diff almost fully black behind the two
          bars — most of the frame read as empty. A much lighter plate here lets the real
          diff show through while RatioBars' own scrim still carries the text contrast. */}
      {frame >= B5 && <LiveBackdrop file={shotsFile} shot="commit2" from={B5} hold={END - B5} focus={{ x: 0.5, y: 0.3 }} />}
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.15}
        data={{
          title: "Effects in the shared catalog",
          a: { label: "Started the catalog", value: 12 },
          b: { label: "By the same evening", value: 23 },
          unit: "effects",
          caption: "+11 in one evening",
        }}
      />
      {frame >= B5 && (
        <LogWindow
          lines={CATALOG_LOG}
          title="digest-motion log"
          from={B5 + 14}
          every={18}
          opacity={1}
          win={{ x: 40, y: 16, w: 560, h: 208 }}
        />
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureOneCatalog23EffectsP73: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
