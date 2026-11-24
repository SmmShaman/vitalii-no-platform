// FeatureKidsSeeHowManyB101 — feature b101 — 1280x720, 810 frames @ 30fps, VOICE-SYNCED.
//
// archetype 5 ledger, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
// NEW FILE (2026-11-22): no prior composition existed for b101.
//
// b1 (15-207)  titleTakeover over LiveBackdrop "page"  — names the product, "asking felt like a coin flip"
// b2 (207-353) pipelineFlow, drawn                      — record -> send -> wait -> find out it failed
// b3 (353-568) drawn: LogWindow "explain capacity" over LiveBackdrop "page2" — the real status line, numbers read out
// b4 (568-810, LAST beat) cardCounter, drawn, no backdrop — four numbers fold into one line, holds to the final frame
//
// Persistent element (archetype 5, ledger): a receipt-style strip, y>=580, four
// line items (THIS WEEK / RIGHT NOW / NEXT SLOT / RESET). They sit unknown in
// red through b1-b2 (a small "turn wasted" stamp punches in for b2), flip to
// green one by one while the LogWindow reads them out in b3, and in b4 a total
// banner punches in above a strike-through line across all four — the ledger
// rewritten in green with the total struck through.
//
// Single tech name in the whole clip: Claude (the family's subscription the
// capacity line reads from) — named once, in the LogWindow.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import shotsFile from "./shots/b101.json";

const B1 = 15;
const B2 = 207;
const B3 = 353;
const B4 = 568;
const END = 810;

const LT = { x: 40, y: 580, w: 1200, h: 130 };
const CHIP_GAP = 24;
const CHIP_W = (LT.w - CHIP_GAP * 3) / 4;
const ROWS_TOP = LT.y + 40;

const CHIPS = [
  { label: "THIS WEEK", good: "2 left" },
  { label: "RIGHT NOW", good: "free" },
  { label: "NEXT SLOT", good: "18:40" },
  { label: "RESET", good: "Mon" },
];

const FLIP_STEP = 40;

const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <div
      style={{
        position: "absolute",
        left: LT.x,
        top: LT.y,
        width: LT.w,
        height: LT.h,
        background: "rgba(255,255,255,0.96)",
        border: `1px solid ${P.border}`,
        borderRadius: 14,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        fontFamily,
      }}
    >
      {frame >= B4 && (
        <Arrive at={B4} kind="punch" box={{ x: LT.x + LT.w / 2 - 190, y: LT.y + 6, w: 380, h: 26 }}>
          <div
            style={{
              position: "absolute",
              left: LT.w / 2 - 190,
              top: 6,
              width: 380,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: P.successBg,
              border: `1px solid ${P.successEdge}`,
              borderRadius: 999,
              color: P.success,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            4 NUMBERS &rarr; 1 LINE
          </div>
        </Arrive>
      )}

      {cut(frame, B2, B3) === 1 && (
        <Arrive at={B2} kind="punch" box={{ x: LT.x + LT.w - 150, y: LT.y - 18, w: 130, h: 26 }}>
          <div
            style={{
              position: "absolute",
              left: LT.w - 150,
              top: -18,
              width: 130,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: P.dangerBg,
              border: `1px solid ${P.dangerEdge}`,
              borderRadius: 999,
              color: P.danger,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            ✗ turn wasted
          </div>
        </Arrive>
      )}

      <div style={{ position: "absolute", left: 0, top: ROWS_TOP - LT.y, width: LT.w, display: "flex" }}>
        {CHIPS.map((chip, i) => {
          const flipped = frame >= B3 + i * FLIP_STEP;
          const x = i * (CHIP_W + CHIP_GAP);
          const color = flipped ? P.success : P.danger;
          return (
            <div key={chip.label} style={{ position: "absolute", left: x, top: 0, width: CHIP_W }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: P.muted, letterSpacing: 0.5 }}>{chip.label}</div>
              <div
                style={{
                  marginTop: 6,
                  borderBottom: `2px dotted ${P.border}`,
                  width: "100%",
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  fontSize: 32,
                  fontWeight: 800,
                  color,
                  textDecoration: frame >= B4 ? "line-through" : "none",
                }}
              >
                {flipped ? chip.good : "?"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LOG_WIN = { x: 140, y: 120, w: 1000, h: 430 };

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: "#0E1420" }}>
      {/* b1 */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile as any} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={P.accent}
        data={{ title: "Ber — Family Network", kicker: "Asking felt like a coin flip" }}
      />

      {/* b2 — drawn, no backdrop */}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={P.accent}
        base="#0E1420"
        data={{ steps: ["Record the question", "Send it", "Wait", "Find out it failed"], result: "Turn already spent" }}
      />

      {/* b3 — drawn: live screenshot + plate + LogWindow, no catalog effect */}
      {cut(frame, B3, B4) === 1 && (
        <>
          <LiveBackdrop file={shotsFile as any} shot="page2" from={B3} hold={B4 - B3} />
          <AbsoluteFill style={{ background: `rgba(8,8,8,${PLATE})` }} />
          <LogWindow
            title="explain capacity"
            from={B3}
            every={20}
            opacity={1}
            fontSize={22}
            win={LOG_WIN}
            lines={[
              { t: "ask", text: "checking family Claude plan…", tone: "muted" },
              { t: "week", text: "this week: 2 explainers left", tone: "ink" },
              { t: "now", text: "subscription: free right now", tone: "success" },
              { t: "slot", text: "next slot: 18:40 if busy", tone: "muted" },
              { t: "reset", text: "weekly count resets Monday", tone: "muted" },
              { t: "shown", text: "status line shown before recording", tone: "success" },
            ]}
          />
        </>
      )}

      {/* b4 — LAST beat, drawn, no backdrop, holds to END */}
      <MotionInsert
        effect="cardCounter"
        from={B4}
        dur={END - B4}
        accent={P.accent}
        base="#0E1420"
        data={{
          cards: [
            { label: "this week", value: 1 },
            { label: "right now", value: 1 },
            { label: "next slot", value: 1 },
            { label: "reset", value: 1 },
          ],
          totalLabel: "folded into one line",
        }}
      />

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureKidsSeeHowManyB101: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
