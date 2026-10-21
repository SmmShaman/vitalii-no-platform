// FeatureMissedEndStoryGuideG12 — feature g12 — 1280x720, 942 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row and commits abdec83 / 8390983):
// b1 15-200   "a quick story starts, then the drive moves on before it finishes"
//             titleTakeover over the feature's own page (backdrop). The deck forms:
//             three story cards punch in and stack — the top one is the one playing.
// b2 200-431  "interrupted by another place, gone for good — street names repeat"
//             cornerTags over the hub. An interrupt card shoves in; the top story
//             card is hard-cut away (lost, not faded) and a repeat badge lands.
// b3 431-597  "GPS shows nothing ahead, the guide picks the last story back up"
//             pipelineFlow (commit 8390983, "fills an empty road ahead") over the
//             page scrolled further. The lost card slides back into the deck.
// b4 597-753  "it says so first, then resumes right where it stopped"
//             handoffExplain (commit abdec83, threads) over the hub scrolled
//             further. The recalled card punches up to full size and glows.
// b5 762-942  "street names now repeat once every two hours, not every pass"
//             no backdrop (gate: last beat is the result, not the page/hub). The
//             deck fans into three result cards, ending on the real number 2.
//
// Persistent element: the card deck (archetype 3), b1 through b5 — the largest,
// most central, longest-lived object on screen; everything else is a small
// side label. Deleting it leaves no story to read.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g12.json";

const B1 = 15;
const B2 = 200;
const B3 = 431;
const B4 = 597;
const B5 = 762;
const END = 942;

/** Accent tuned for the dark stage (mint's own #0B7A5A reads too dark on a plate). */
const ACCENT = "#34D399";
const STAGE = "#0D1B15";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Deck geometry — large and centered; everything else sits around it, small.
const DECK_CX = 640;
const DECK_CY = 360;
const CARD_W = 240;
const CARD_H = 150;

const LABEL_BOX = { x: 40, y: 606, w: 300, h: 80 };
const PLATE_BOX = { x: 700, y: 606, w: 540, h: 96 };

const Deck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const cardStyle = (i: number, glow: boolean): React.CSSProperties => ({
    position: "absolute",
    left: DECK_CX - CARD_W / 2 + i * 14,
    top: DECK_CY - CARD_H / 2 + i * 14,
    width: CARD_W,
    height: CARD_H,
    borderRadius: 10,
    background: glow ? P.accentBg : P.card,
    border: `3px solid ${glow ? P.accent : P.border}`,
    boxShadow: glow ? `0 0 0 6px ${P.accentEdge}, 8px 8px 0 rgba(0,0,0,0.35)` : "8px 8px 0 rgba(0,0,0,0.3)",
    boxSizing: "border-box",
    padding: "16px 18px",
    color: P.ink,
    fontFamily,
  });

  // b1: three cards punch in and stack; the top one is the story that is playing.
  const b1 = frame >= B1 && frame < B2;
  const showCard0 = frame >= B1 + 10;
  const showCard1 = frame >= B1 + 40;
  const showStoryCard = frame >= B1 + 70 && frame < B2 + 40; // hard-cut away mid-b2, not faded
  const storyPunch = showStoryCard ? punchScale(sec(frame, B1 + 70, fps), 0) : 1;

  // b2: an interrupt card shoves in once the story card is already gone.
  const showInterrupt = frame >= B2 + 20 && frame < B3;
  const interruptPunch = showInterrupt ? punchScale(sec(frame, B2 + 20, fps), 0) : 1;
  const showRepeatBadge = frame >= B2 + 60 && frame < B3;

  // b3: the lost card slides back into the deck from the edge, enlarged and
  // parked low so it doesn't just restate the pipelineFlow band above it.
  const showRecalled = frame >= B3 + 10 && frame < B5;
  const recallSlide = showRecalled ? tween(sec(frame, B3 + 10, fps), 0, 0.4, ease.power3Out) : 0;
  const RECALL_W = 440;
  const RECALL_H = 140;
  const recalledLeft = DECK_CX - RECALL_W / 2 + (1 - recallSlide) * 420;
  // b3: a GPS status ribbon up top — otherwise the frame's top third sits empty
  // while pipelineFlow's compacted diagram occupies only the middle band.
  const showGpsStatus = frame >= B3 + 30 && frame < B4;

  // b4: the recalled card punches up to full size and glows "resumed".
  const resumed = frame >= B4 + 10 && frame < B5;
  const resumePunch = resumed ? punchScale(sec(frame, B4 + 10, fps), 0) : 1;

  // b5: the deck fans out into three labelled results, holds to the end.
  const fan0 = frame >= B5 + 10;
  const fan1 = frame >= B5 + 40;
  const fan2 = frame >= B5 + 70;
  const fanPunch = (at: number) => (frame >= at ? punchScale(sec(frame, at, fps), 0) : 1);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      {frame < B5 && (
        <>
          {showCard0 && <div style={cardStyle(0, false)} />}
          {showCard1 && <div style={cardStyle(1, false)} />}
          {showStoryCard && (
            <div style={{ ...cardStyle(2, true), transform: `scale(${storyPunch})`, transformOrigin: `${DECK_CX}px ${DECK_CY}px` }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>STORY</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>Playing now…</div>
            </div>
          )}

          {showInterrupt && (
            <div
              style={{
                ...cardStyle(1, false),
                background: P.dangerBg,
                border: `3px solid ${P.dangerEdge}`,
                transform: `scale(${interruptPunch})`,
                transformOrigin: `${DECK_CX}px ${DECK_CY}px`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.danger }}>INTERRUPT</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>Another place ahead</div>
            </div>
          )}
          {showRepeatBadge && (
            <Arrive at={B2 + 60} kind="rise" box={{ x: DECK_CX + 160, y: DECK_CY - 150, w: 220, h: 56 }}>
              <div
                style={{
                  position: "absolute",
                  left: DECK_CX + 160,
                  top: DECK_CY - 150,
                  width: 220,
                  height: 56,
                  borderRadius: 8,
                  background: P.dangerBg,
                  border: `2px solid ${P.dangerEdge}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 800,
                  color: P.danger,
                  fontFamily,
                }}
              >
                Street names: every pass
              </div>
            </Arrive>
          )}

          {showRecalled && !resumed && (
            <div
              style={{
                position: "absolute",
                left: recalledLeft,
                top: 560,
                width: RECALL_W,
                height: RECALL_H,
                borderRadius: 10,
                background: P.accentBg,
                border: `3px solid ${P.accent}`,
                boxShadow: `0 0 0 6px ${P.accentEdge}, 8px 8px 0 rgba(0,0,0,0.35)`,
                boxSizing: "border-box",
                padding: "18px 24px",
                color: P.ink,
                fontFamily,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>RECALLED</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8, lineHeight: 1.25 }}>Picked back up — right where it stopped</div>
            </div>
          )}
          {showGpsStatus && (
            <Arrive at={B3 + 30} kind="wipe" box={{ x: 140, y: 64, w: 1000, h: 110 }} dur={0.3}>
              <div
                style={{
                  position: "absolute",
                  left: 140,
                  top: 64,
                  width: 1000,
                  height: 110,
                  borderRadius: 10,
                  background: P.card,
                  border: `3px solid ${P.border}`,
                  boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 32px",
                  fontFamily,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.accent, marginRight: 24 }}>GPS</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: P.ink }}>Nothing due ahead — safe to resume</div>
              </div>
            </Arrive>
          )}

          {resumed && (
            <div
              style={{
                ...cardStyle(2, true),
                width: CARD_W + 30,
                height: CARD_H + 20,
                left: DECK_CX - (CARD_W + 30) / 2 + 28,
                top: DECK_CY - (CARD_H + 20) / 2 + 28,
                transform: `scale(${resumePunch})`,
                transformOrigin: `${DECK_CX}px ${DECK_CY}px`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>RESUMED</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>Back to the story</div>
              <div style={{ fontSize: 13, color: P.muted, marginTop: 4 }}>right where it stopped</div>
            </div>
          )}
        </>
      )}

      {frame >= B5 && (
        <>
          {fan0 && (
            <div
              style={{
                position: "absolute",
                left: 120,
                top: 150,
                width: 320,
                height: 420,
                borderRadius: 10,
                background: P.card,
                border: `3px solid ${P.border}`,
                boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
                boxSizing: "border-box",
                padding: 28,
                fontFamily,
                color: P.ink,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transform: `scale(${fanPunch(B5 + 10)})`,
                transformOrigin: "280px 360px",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>STORIES</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 14, lineHeight: 1.3 }}>Resumed, not lost</div>
            </div>
          )}
          {fan1 && (
            <div
              style={{
                position: "absolute",
                left: 480,
                top: 150,
                width: 320,
                height: 420,
                borderRadius: 10,
                background: P.card,
                border: `3px solid ${P.border}`,
                boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
                boxSizing: "border-box",
                padding: 28,
                fontFamily,
                color: P.ink,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transform: `scale(${fanPunch(B5 + 40)})`,
                transformOrigin: "640px 360px",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>STREET NAMES</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 14, lineHeight: 1.3 }}>Once, not every pass</div>
            </div>
          )}
          {fan2 && (
            <div
              style={{
                position: "absolute",
                left: 840,
                top: 150,
                width: 320,
                height: 420,
                borderRadius: 10,
                background: P.accent,
                border: `3px solid ${P.accentEdge}`,
                boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
                boxSizing: "border-box",
                padding: 28,
                fontFamily,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transform: `scale(${fanPunch(B5 + 70)})`,
                transformOrigin: "1000px 360px",
              }}
            >
              <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}>2</div>
              <div style={{ fontSize: 19, fontWeight: 700, marginTop: 14, textAlign: "center" }}>hours between repeats</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SideLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const label =
    cut(frame, B1, B2) === 1
      ? "A STORY STARTS"
      : cut(frame, B2, B3) === 1
      ? "INTERRUPTED — LOST"
      : cut(frame, B3, B4) === 1
      ? "ROAD AHEAD: CLEAR"
      : cut(frame, B4, B5) === 1
      ? "RESUMED"
      : frame >= B5
      ? "RESULT"
      : null;
  if (!label) return null;
  const at = frame >= B5 ? B5 : frame >= B4 ? B4 : frame >= B3 ? B3 : frame >= B2 ? B2 : B1;
  return (
    <Arrive at={at} kind="wipe" box={LABEL_BOX} dur={0.3}>
      <div
        style={{
          position: "absolute",
          left: LABEL_BOX.x,
          top: LABEL_BOX.y,
          width: LABEL_BOX.w,
          height: LABEL_BOX.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>{label}</div>
      </div>
    </Arrive>
  );
};

const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={PLATE_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: PLATE_BOX.x,
          top: PLATE_BOX.y,
          width: PLATE_BOX.w,
          height: PLATE_BOX.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          boxSizing: "border-box",
          padding: "10px 20px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>GUIDE — STORIES ON THE ROAD</div>
        <div style={{ fontSize: 13, color: P.muted, marginTop: 4, lineHeight: 1.3 }}>
          The phone knows where I am and plays short stories about the places around me — in Norwegian and Ukrainian side by side.
        </div>
      </div>
    </Arrive>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{ title: "A story cut short", kicker: "The drive moves on before it finishes" }}
      />

      {/* b2 — interrupted and lost, plus the street-name repeat, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.72}
        data={{
          statement: "Interrupted once, gone for good",
          tags: ["No way to resume", "Street names repeat", "Every single pass", "Lost mid-sentence"],
        }}
      />

      {/* b3 — GPS shows nothing ahead, the guide resumes (commit 8390983) */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.45 }} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.72}
        data={{
          steps: ["Check next 40s of road", "Nothing due ahead", "commit 8390983 → resumes"],
          result: "Fills the empty road ahead",
          system: "GPS",
        }}
      />

      {/* b4 — says it out loud, resumes in place (commit abdec83, threads) */}
      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub2" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.45 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.72}
        data={{
          from: "No resume cue",
          to: '"Back to the story" cue',
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Says it out loud first", "Picks up right where it stopped", "commit abdec83 · threads"],
        }}
      />

      {/* b5 — the result, drawn only (no page/hub), holds to the end */}

      <SideLabel />
      <ProductPlate />
      <Deck />
    </AbsoluteFill>
  );
};

export const FeatureMissedEndStoryGuideG12: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
