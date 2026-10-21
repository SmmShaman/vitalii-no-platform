// FeatureWhenRoadGoesQuietG11 — feature g11 — 1280x720, 1006 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline ribbon, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row and commits abdec83 / 8390983):
// b1 15-198   "long stretches of road had no story — the guide only spoke at
//             places pinned to one point" — titleTakeover over the feature's own
//             page (backdrop). The ribbon draws in with only its two pinned-point
//             markers lit; the whole stretch between them is dark.
// b2 198-417  "but the land between has its own history: old roads, railways,
//             trades — just not tied to a spot" — cornerTags over the hub. Three
//             dim markers rise inside the dark stretch, one per fact.
// b3 417-586  "now when nothing specific is due, the guide starts a chapter about
//             the area instead" — pipelineFlow (commit 8390983, "fills an empty
//             road ahead") over the page scrolled further. The middle dim marker
//             punches into an ACTIVE node.
// b4 586-816  "using Claude, it pulls from old sources — even two 1902 and 1913
//             books never narrated before" — handoffExplain (commit abdec83,
//             threads) over the hub scrolled further. The active node grows a
//             small card listing the two old books.
// b5 816-1006 "quiet stretches now get up to 8 chapters about the district, not
//             silence" — no backdrop (gate: last beat is the result, not the
//             page/hub). Every slot between the two pinned points lights up and
//             the ribbon ends on the real number 8, holding to the end.
//
// Persistent element: the timeline ribbon (archetype 1), b1 through b5 — the
// largest, most central, longest-lived object on screen, bottom-left headline
// stays small. Deleting the ribbon leaves no story to read.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g11.json";

const B1 = 15;
const B2 = 198;
const B3 = 417;
const B4 = 586;
const B5 = 816;
const END = 1006;

/** Accent tuned for the dark stage (sand's own #B4531F reads muddy on a plate). */
const ACCENT = "#E08A3C";
const STAGE = "#241404";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Ribbon geometry — a horizontal band dominating the frame; ten evenly spaced
// slots, the two ends pinned, the eight between them the "land" the guide now
// narrates.
const RIBBON_Y = 330;
const RIBBON_X0 = 100;
const RIBBON_X1 = 1180;
const SLOT_COUNT = 10;
const slotX = (i: number) => RIBBON_X0 + (i * (RIBBON_X1 - RIBBON_X0)) / (SLOT_COUNT - 1);
const LAND = [1, 2, 3, 4, 5, 6, 7, 8];
const DIM_INDEXES = [2, 4, 6];
const ACTIVE_INDEX = 4;
const DIM_TAGS: Record<number, string> = { 2: "Old roads", 4: "Railways", 6: "Trades" };

const LABEL_BOX = { x: 40, y: 606, w: 320, h: 80 };
const PLATE_BOX = { x: 700, y: 606, w: 540, h: 96 };

const Ribbon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const resultMode = frame >= B5;
  const dimRevealed = frame >= B2 + 10 && !resultMode;
  const activated = frame >= B3 + 20;
  const bookCard = frame >= B4 + 20 && frame < B5;
  const activePunch = frame >= B3 + 20 && frame < B4 ? punchScale(sec(frame, B3 + 20, fps), 0) : 1;
  const resultPunch = (at: number) => (frame >= at ? punchScale(sec(frame, at, fps), 0) : 0.001);

  const pinStyle = (x: number): React.CSSProperties => ({
    position: "absolute",
    left: x - 18,
    top: RIBBON_Y - 18,
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: P.card,
    border: `4px solid ${P.ink}`,
    boxSizing: "border-box",
  });

  const dimStyle = (x: number): React.CSSProperties => ({
    position: "absolute",
    left: x - 11,
    top: RIBBON_Y - 11,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "transparent",
    border: `3px dashed ${P.muted}`,
    boxSizing: "border-box",
  });

  const litStyle = (x: number, scale: number): React.CSSProperties => ({
    position: "absolute",
    left: x - 15,
    top: RIBBON_Y - 15,
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: P.accent,
    border: `3px solid ${P.accentEdge}`,
    boxShadow: `0 0 0 6px ${P.accentEdge}`,
    boxSizing: "border-box",
    transform: `scale(${scale})`,
    transformOrigin: `${x}px ${RIBBON_Y}px`,
  });

  // b5 only: the land slots zigzag above/below the line so the result reads
  // across three rows of the frame, not one thin band.
  const landDotStyle = (x: number, y: number, scale: number): React.CSSProperties => ({
    position: "absolute",
    left: x - 22,
    top: y - 22,
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: P.accent,
    border: `3px solid ${P.accentEdge}`,
    boxShadow: `0 0 0 8px ${P.accentEdge}`,
    boxSizing: "border-box",
    transform: `scale(${scale})`,
    transformOrigin: `${x}px ${y}px`,
  });

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      {/* the band itself, always on once drawn */}
      <div
        style={{
          position: "absolute",
          left: RIBBON_X0,
          top: RIBBON_Y - (resultMode ? 14 : 4),
          width: RIBBON_X1 - RIBBON_X0,
          height: resultMode ? 28 : 8,
          borderRadius: resultMode ? 14 : 4,
          background: resultMode ? P.accentBg : P.border,
        }}
      />

      {/* b1 — the two pinned points, long dark gap between them */}
      <div style={pinStyle(slotX(0))} />
      <div style={pinStyle(slotX(9))} />
      {frame < B2 && (
        <>
          <Arrive at={B1 + 8} kind="rise" box={{ x: slotX(0) - 90, y: RIBBON_Y + 28, w: 180, h: 32 }}>
            <div style={{ position: "absolute", left: slotX(0) - 90, top: RIBBON_Y + 28, width: 180, textAlign: "center", fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: P.ink, fontFamily }}>
              PINNED POINT
            </div>
          </Arrive>
          <Arrive at={B1 + 8} kind="rise" box={{ x: slotX(9) - 90, y: RIBBON_Y + 28, w: 180, h: 32 }}>
            <div style={{ position: "absolute", left: slotX(9) - 90, top: RIBBON_Y + 28, width: 180, textAlign: "center", fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: P.ink, fontFamily }}>
              PINNED POINT
            </div>
          </Arrive>
        </>
      )}

      {/* b2 — three dim markers rise inside the gap, one per fact */}
      {!resultMode &&
        DIM_INDEXES.map((i) =>
          dimRevealed && !(activated && i === ACTIVE_INDEX) ? (
            <React.Fragment key={i}>
              <div style={dimStyle(slotX(i))} />
              <div
                style={{
                  position: "absolute",
                  left: slotX(i) - 60,
                  top: RIBBON_Y - 52,
                  width: 120,
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: P.muted,
                  fontFamily,
                }}
              >
                {DIM_TAGS[i]}
              </div>
            </React.Fragment>
          ) : null
        )}

      {/* b3 — the middle dim marker punches into an active node */}
      {!resultMode && activated && !bookCard && (
        <>
          <div style={litStyle(slotX(ACTIVE_INDEX), activePunch)} />
          <div
            style={{
              position: "absolute",
              left: slotX(ACTIVE_INDEX) - 70,
              top: RIBBON_Y - 56,
              width: 140,
              textAlign: "center",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1.1,
              color: P.accent,
              fontFamily,
            }}
          >
            CHAPTER STARTS
          </div>
          {/* status ribbon up top — otherwise the top third sits empty while
              pipelineFlow's compacted diagram occupies only the middle band */}
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
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.accent, marginRight: 24 }}>ROUTE CHECK</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: P.ink }}>Nothing specific due — starts a chapter instead</div>
            </div>
          </Arrive>
          {/* a bigger card low in the frame, not just a label under the node */}
          <Arrive at={B3 + 40} kind="rise" box={{ x: 420, y: 560, w: 440, h: 140 }} dur={0.3}>
            <div
              style={{
                position: "absolute",
                left: 420,
                top: 560,
                width: 440,
                height: 140,
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
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>CHAPTER, NOT A PIN</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8, lineHeight: 1.25 }}>About the area, not one pinned point</div>
            </div>
          </Arrive>
        </>
      )}

      {/* b4 — the active node grows a small card with the two old books */}
      {!resultMode && bookCard && (
        <>
          <div style={litStyle(slotX(ACTIVE_INDEX), 1)} />
          <div
            style={{
              position: "absolute",
              left: slotX(ACTIVE_INDEX) - 130,
              top: RIBBON_Y - 190,
              width: 260,
              height: 130,
              borderRadius: 10,
              background: P.card,
              border: `3px solid ${P.border}`,
              boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
              boxSizing: "border-box",
              padding: "14px 18px",
              fontFamily,
              color: P.ink,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: P.accent }}>OLD SOURCES</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 8 }}>Guidebook, 1902</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>District record, 1913</div>
          </div>
        </>
      )}

      {/* b5 — every land slot lights up in a zigzag across three rows, ending
          on the hero number 8 inside a card, with a result card below */}
      {resultMode && (
        <>
          {LAND.map((i, idx) => {
            const x = slotX(i);
            const yOff = [-80, 0, 80][idx % 3];
            const y = RIBBON_Y + yOff;
            const scale = resultPunch(B5 + 8 + idx * 10);
            return (
              <React.Fragment key={i}>
                {yOff !== 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: x - 2,
                      top: Math.min(y, RIBBON_Y) + 14,
                      width: 4,
                      height: Math.max(Math.abs(yOff) - 14, 1),
                      background: P.accentEdge,
                    }}
                  />
                )}
                <div style={landDotStyle(x, y, scale)} />
              </React.Fragment>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 400,
              top: 50,
              width: 480,
              height: 160,
              borderRadius: 10,
              background: P.card,
              border: `3px solid ${P.border}`,
              boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              color: P.ink,
            }}
          >
            <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1 }}>8</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8, letterSpacing: 1.2 }}>CHAPTERS, NOT SILENCE</div>
          </div>
          {frame >= B5 + 8 + (LAND.length - 1) * 10 && (
            <div
              style={{
                position: "absolute",
                left: 340,
                top: 560,
                width: 600,
                height: 130,
                borderRadius: 10,
                background: P.accentBg,
                border: `3px solid ${P.accent}`,
                boxShadow: `0 0 0 6px ${P.accentEdge}, 8px 8px 0 rgba(0,0,0,0.35)`,
                boxSizing: "border-box",
                padding: "16px 28px",
                fontFamily,
                color: P.ink,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>DISTRICT GUIDE</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8, lineHeight: 1.3 }}>
                Quiet stretches now get up to 8 chapters about the area, not silence.
              </div>
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
      ? "ONLY PINNED POINTS"
      : cut(frame, B2, B3) === 1
      ? "HISTORY BETWEEN"
      : cut(frame, B3, B4) === 1
      ? "CHAPTER STARTS"
      : cut(frame, B4, B5) === 1
      ? "OLD SOURCES, NEW VOICE"
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
      {/* b1 — only pinned points, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{ title: "Long stretches, no story", kicker: "The guide only spoke at one pinned point" }}
      />

      {/* b2 — the land between has its own history, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.72}
        data={{
          statement: "The land between has its own history",
          tags: ["Old roads", "Railways", "Trades", "Never tied to a spot"],
        }}
      />

      {/* b3 — nothing specific due, the guide starts a chapter (commit 8390983) */}
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
          steps: ["Checks the road ahead", "Nothing specific due", "commit 8390983 → starts a chapter"],
          result: "Fills the quiet stretch",
          system: "Route check",
        }}
      />

      {/* b4 — Claude pulls from old sources, never narrated before (commit abdec83, threads) */}
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
          from: "Never narrated",
          to: "Claude writes the chapter",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Claude — AI that reads old text", "Even 1902 & 1913 books", "commit abdec83 · threads"],
        }}
      />

      {/* b5 — the result, drawn only (no page/hub), holds to the end */}

      <SideLabel />
      <ProductPlate />
      <Ribbon />
    </AbsoluteFill>
  );
};

export const FeatureWhenRoadGoesQuietG11: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
