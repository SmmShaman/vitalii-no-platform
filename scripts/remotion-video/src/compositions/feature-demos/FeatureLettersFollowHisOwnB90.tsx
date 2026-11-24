// FeatureLettersFollowHisOwnB90 — feature b90 — 1280x720, 968 frames @ 30fps, VOICE-SYNCED.
//
// archetype 3 card-deck, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
// NEW FILE (2026-11-22): no prior composition existed for b90.
//
// b1 (15-211)   timelineNodes over LiveBackdrop "page" — the app's fixed calendar, +2 letters/week from day 1
// b2 (211-371)  handoffExplain, drawn — app assumed week 1, real classroom starts week 42
// b3 (371-529)  targetOverrun, drawn over LiveBackdrop "page2" (+ plate) — app already 15 letters ahead of class
// b4 (529-734)  drawn: LogWindow "school-sync nightly" — the real Cloudflare Workers fix, no catalog effect
// b5 (734-968, LAST beat) cardCounter, drawn, no backdrop — gap folds from 15 to 0, holds to the final frame
//
// Persistent element (archetype 3, card-deck): six letter cards (B F H L P V) sit in a
// tight rotated STACK, red, through b1-b3 ("WEEK 42" flag pins in for b2, "+15 ahead"
// badge for b3). During b4 they actively FAN OUT into a 2x3 grid while the color
// sweeps red -> amber -> green; by b5 they are settled, green, evenly spaced, with a
// "15 CLOSED" banner above — the pile shrinking into the fan tells the whole story.
//
// Single tech name in the whole clip: Cloudflare Workers (the nightly job that fixes
// the order) — named once, in the LogWindow.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import shotsFile from "./shots/b90.json";

const B1 = 15;
const B2 = 211;
const B3 = 371;
const B4 = 529;
const B5 = 734;
const END = 968;

const CARDS = ["B", "F", "H", "L", "P", "V"];
const GRID_COLS = [1000, 1150];
const GRID_ROWS = [160, 320, 480];
const GRID_POS = CARDS.map((_, i) => ({ x: GRID_COLS[i % 2], y: GRID_ROWS[Math.floor(i / 2)] }));
const STACK_CENTER = { x: 1075, y: 320 };
const CARD_W = 108;
const CARD_H = 128;
const BADGE_BOX = { x: 995, y: 40, w: 160, h: 34 };

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const p = frame < B4 ? 0 : frame >= B5 ? 1 : (frame - B4) / (B5 - B4);
  const color = frame < B4 ? P.danger : frame < B5 ? P.amber : P.success;

  return (
    <>
      {CARDS.map((letter, i) => {
        const stackX = STACK_CENTER.x + (i - 2.5) * 6;
        const stackY = STACK_CENTER.y + (i - 2.5) * 4;
        const stackRot = (i - 2.5) * 9;
        const grid = GRID_POS[i];
        const x = stackX + (grid.x - stackX) * p;
        const y = stackY + (grid.y - stackY) * p;
        const rot = stackRot * (1 - p);
        return (
          <div
            key={letter}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CARD_W,
              height: CARD_H,
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              background: P.card,
              border: `2px solid ${color}`,
              borderRadius: 14,
              boxShadow: "0 10px 26px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              fontSize: 54,
              fontWeight: 800,
              color,
              zIndex: i,
            }}
          >
            {letter}
          </div>
        );
      })}

      {cut(frame, B2, B3) === 1 && (
        <Arrive at={B2} kind="punch" box={BADGE_BOX}>
          <div
            style={{
              position: "absolute",
              left: BADGE_BOX.x,
              top: BADGE_BOX.y,
              width: BADGE_BOX.w,
              height: BADGE_BOX.h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: P.noteBg,
              border: `1px solid ${P.noteBorder}`,
              borderRadius: 999,
              color: P.ink,
              fontSize: 15,
              fontWeight: 700,
              fontFamily,
            }}
          >
            WEEK 42
          </div>
        </Arrive>
      )}

      {cut(frame, B3, B4) === 1 && (
        <Arrive at={B3} kind="punch" box={BADGE_BOX}>
          <div
            style={{
              position: "absolute",
              left: BADGE_BOX.x,
              top: BADGE_BOX.y,
              width: BADGE_BOX.w,
              height: BADGE_BOX.h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: P.dangerBg,
              border: `1px solid ${P.dangerEdge}`,
              borderRadius: 999,
              color: P.danger,
              fontSize: 15,
              fontWeight: 700,
              fontFamily,
            }}
          >
            +15 ahead
          </div>
        </Arrive>
      )}

      {frame >= B5 && (
        <Arrive at={B5} kind="punch" box={{ x: 965, y: 40, w: 220, h: 34 }}>
          <div
            style={{
              position: "absolute",
              left: 965,
              top: 40,
              width: 220,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: P.successBg,
              border: `1px solid ${P.successEdge}`,
              borderRadius: 999,
              color: P.success,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 0.3,
              fontFamily,
            }}
          >
            15 CLOSED ✓
          </div>
        </Arrive>
      )}
    </>
  );
};

const LOG_WIN = { x: 60, y: 140, w: 860, h: 420 };

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: "#0E1420" }}>
      {/* b1 */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile as any} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="timelineNodes"
        from={B1}
        dur={B2 - B1}
        accent={P.accent}
        data={{
          nodes: [
            { date: "Day 1", label: "App starts: +2 letters/week" },
            { date: "Week 1", label: "+2 letters (fixed)" },
            { date: "Week 2", label: "+2 letters (fixed)" },
          ],
          activeIndex: 2,
        }}
      />
      {cut(frame, B1, B2) === 1 && (
        <Arrive at={B1} kind="rise" box={{ x: 40, y: 630, w: 440, h: 50 }}>
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 630,
              width: 440,
              height: 50,
              display: "flex",
              alignItems: "center",
              paddingLeft: 16,
              background: "rgba(255,255,255,0.95)",
              border: `1px solid ${P.border}`,
              borderRadius: 12,
              fontFamily,
              fontSize: 20,
              fontWeight: 700,
              color: P.ink,
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            Boytasks — letters by calendar
          </div>
        </Arrive>
      )}

      {/* b2 — drawn, no backdrop */}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={P.accent}
        base="#0E1420"
        data={{
          from: "App assumes class starts week 1",
          to: "Real classroom starts week 42",
          fromLabel: "APP",
          toLabel: "CLASS",
          points: ["Real classroom starts week 42", "Taught in its own order", "App never asked the class"],
        }}
      />

      {/* b3 — live screenshot + plate + targetOverrun */}
      {cut(frame, B3, B4) === 1 && (
        <>
          <LiveBackdrop file={shotsFile as any} shot="page2" from={B3} hold={B4 - B3} />
          <AbsoluteFill style={{ background: `rgba(8,8,8,${PLATE})` }} />
        </>
      )}
      <MotionInsert
        effect="targetOverrun"
        from={B3}
        dur={B4 - B3}
        accent={P.accent}
        data={{ label: "letters quizzed vs class progress", value: 20, target: 5, unit: "letters" }}
      />

      {/* b4 — drawn: LogWindow only, no catalog effect */}
      {cut(frame, B4, B5) === 1 && (
        <LogWindow
          title="school-sync nightly"
          from={B4}
          every={20}
          opacity={1}
          fontSize={22}
          win={LOG_WIN}
          lines={[
            { t: "cron", text: "Cloudflare Workers daily-cron: reading weekly plan…", tone: "muted" },
            { t: "slot", text: "re-align untouched sets this slot", tone: "ink" },
            { t: "fire", text: "2 fires per slot, cap 14", tone: "accent" },
            { t: "order", text: "publishing class's real letter order", tone: "success" },
            { t: "sync", text: "Boytasks list updated nightly", tone: "success" },
            { t: "done", text: "known-letters now follows class", tone: "success" },
          ]}
        />
      )}

      {/* b5 — LAST beat, drawn, no backdrop, holds to END */}
      <MotionInsert
        effect="cardCounter"
        from={B5}
        dur={END - B5}
        accent={P.accent}
        base="#0E1420"
        data={{
          cards: [
            { label: "before fix", value: 15 },
            { label: "after fix", value: 0 },
          ],
          totalLabel: "list now matches the class",
        }}
      />

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureLettersFollowHisOwnB90: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
