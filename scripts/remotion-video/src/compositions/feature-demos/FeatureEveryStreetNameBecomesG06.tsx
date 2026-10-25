// FeatureEveryStreetNameBecomesG06 — feature g06 — 1280x720, 908 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction (feature-motion skill, 2026-10-07).
//
// Ledger lower third: a receipt-style ticket in the y>=606 band carries two risk
// line items that post in red as the problem beats land, then each is struck
// through and rewritten in green once its fix arrives — same geometry and
// mechanic as d09/p75's lower third (feature-motion skill convention).
//
// Beat → picture (data only from the feature row and the feature's own live
// page; none of the given commits — 111c47e, 5414aba, d0311d6 — says what any
// beat says, so no commit diff appears anywhere in this clip):
// b1 15-201   "street names fly past at speed, history unread"
//             titleTakeover over the feature's own page (backdrop "page").
//             Ledger wipes in; the product name plate rises; first red line
//             item "street meaning asserted without proof" posts.
// b2 201-314  "no meaning without proof, nothing invented"
//             keywordCaption over the page scrolled on (backdrop "page2").
//             Second red line item "thin stubs risk a forced story" posts.
// b3 314-438  "like a tour guide who only speaks when sure of the facts"
//             drawn (no catalog effect, no backdrop) — the metaphor beat.
//             Ledger holds at two red items while the claim lands.
// b4 438-723  "every named street pulled from OpenStreetMap gets a story,
//             naming a place only when a source confirms it — Kolbuvegen
//             matches the village of Kolbu"
//             pipelineFlow over the hub (backdrop "hub"). The clip's one tech
//             name — OpenStreetMap — gets its gloss here. First ledger line
//             item strikes through and rewrites green.
// b5 723-908  "only the thinnest stubs get skipped, under 60 meters"
//             cornerTags, drawn only (no backdrop, per gate 2 — the last beat
//             never plays the feature page or hub); the real "60 meters"
//             number is one of its own corner tags. Holds bright to the final
//             frame. Second ledger line item strikes through and rewrites
//             green.
//
// Persistent element: the ledger lower third (archetype 5), b1 through b5, y>=606.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g06.json";

const B1 = 15;
const B2 = 201;
const B3 = 314;
const B4 = 438;
const B5 = 723;
const END = 908;

const ACCENT = "#B4531F";
const STAGE = "#1C140C";

// Ledger geometry — same band as the other archetype-5 references (y>=606).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type RowState = "hidden" | "red" | "striking" | "resolved";

const rowState = (frame: number, showAt: number, strikeAt: number, strikeDur: number): RowState => {
  if (frame < showAt) return "hidden";
  if (frame < strikeAt) return "red";
  if (frame < strikeAt + strikeDur) return "striking";
  return "resolved";
};

const STRIKE_DUR = 30;

const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const row1 = rowState(frame, B1 + 20, B4, STRIKE_DUR); // meaning unconfirmed -> source confirmed
  const row2 = rowState(frame, B2 + 20, B5, STRIKE_DUR); // thin stubs risk -> skip rule

  const strike1 = tween(sec(frame, B4, fps), 0, STRIKE_DUR / fps, ease.power3InOut);
  const strike2 = tween(sec(frame, B5, fps), 0, STRIKE_DUR / fps, ease.power3InOut);

  const openCount = (row1 === "red" || row1 === "striking" ? 1 : 0) + (row2 === "red" || row2 === "striking" ? 1 : 0);
  const allResolved = row1 === "resolved" && row2 === "resolved" && openCount === 0;
  const badgeColor = openCount > 0 ? P.danger : P.success;
  const badgeText = openCount > 0 ? `${openCount} open` : "0 open";

  const row1Text = row1 === "resolved" ? "name confirmed by source (Kolbuvegen → Kolbu)" : "street meaning asserted without proof";
  const row2Text = row2 === "resolved" ? "stubs under 60m skipped" : "thin stubs risk a forced story";
  const row1Color = row1 === "resolved" ? P.success : P.danger;
  const row2Color = row2 === "resolved" ? P.success : P.danger;

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
            border: `2px solid ${allResolved ? P.successEdge : P.border}`,
            borderRadius: 4,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "absolute", left: 16, top: 8, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted, whiteSpace: "nowrap" }}>
            🧾 LEDGER
          </div>
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 6,
              fontSize: 15,
              fontWeight: 800,
              color: badgeColor,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {badgeText}
          </div>

          {row1 !== "hidden" && (
            <div style={{ position: "absolute", left: 16, top: 30, fontSize: 14, fontWeight: 700, color: row1Color, whiteSpace: "nowrap" }}>
              {row1Text}
              {row1 === "striking" && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 7,
                    height: 2,
                    width: "100%",
                    background: P.ink,
                    transformOrigin: "left center",
                    transform: `scaleX(${strike1})`,
                  }}
                />
              )}
            </div>
          )}

          {row2 !== "hidden" && (
            <div style={{ position: "absolute", left: 16, top: 54, fontSize: 14, fontWeight: 700, color: row2Color, whiteSpace: "nowrap" }}>
              {row2Text}
              {row2 === "striking" && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 7,
                    height: 2,
                    width: "100%",
                    background: P.ink,
                    transformOrigin: "left center",
                    transform: `scaleX(${strike2})`,
                  }}
                />
              )}
            </div>
          )}
        </div>
      </Arrive>

      {frame >= B1 + 20 && frame < B2 && (
        <Arrive at={B1 + 20} kind="rise" box={{ x: LT.x + 16, y: LT.y - 104, w: 420, h: 90 }}>
          <div
            style={{
              position: "absolute",
              left: LT.x + 16,
              top: LT.y - 104,
              width: 420,
              padding: "10px 16px",
              background: P.card,
              border: `2px solid ${P.border}`,
              borderRadius: 4,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.4, color: P.ink }}>STORIES ON THE ROAD</div>
            <div style={{ marginTop: 1, fontSize: 12, fontWeight: 600, color: P.muted }}>
              a personal audio guide for driving, in Norwegian and Ukrainian
            </div>
          </div>
        </Arrive>
      )}
    </div>
  );
};

/** b3 — the one plain analogy: a tour guide who only speaks when sure of the facts.
 * Two flanking cards (never guesses / confirms first) plus a top kicker fill the wide
 * empty margins the centered emoji+badge used to leave untouched (measured 13/48). */
const AnalogyPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;
  const kickerT = tween(sec(frame, B3 + 2, fps), 0, 0.3, ease.power3Out);
  const emojiT = tween(sec(frame, B3 + 6, fps), 0, 0.3, ease.power3Out);
  const sideT = tween(sec(frame, B3 + 14, fps), 0, 0.35, ease.power3Out);
  const badgeT = tween(sec(frame, B3 + 24, fps), 0, 0.3, ease.power3Out);

  const sideCard = (emoji: string, label: string, side: "left" | "right") => (
    <div
      style={{
        position: "absolute",
        [side]: 70,
        top: 220,
        width: 260,
        textAlign: "center",
        opacity: sideT,
        transform: `translateY(${(1 - sideT) * 20}px)`,
      }}
    >
      <div style={{ fontSize: 64, lineHeight: 1 }}>{emoji}</div>
      <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800, color: P.ink, letterSpacing: 0.3, fontFamily }}>
        {label}
      </div>
    </div>
  );

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 606 }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${P.bgTop}, ${P.bgBottom})` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 56,
          width: 1280,
          textAlign: "center",
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 2.4,
          color: P.accent,
          opacity: kickerT,
          fontFamily,
        }}
      >
        THE ANALOGY
      </div>
      {sideCard("🚫", "Never guesses", "left")}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 213,
          width: 1280,
          textAlign: "center",
          fontSize: 180,
          lineHeight: 1,
          opacity: emojiT,
          transform: `scale(${0.9 + emojiT * 0.1})`,
        }}
      >
        🧭
      </div>
      {sideCard("✅", "Confirms first", "right")}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 460,
          width: 1280,
          textAlign: "center",
          opacity: badgeT,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "10px 22px",
            borderRadius: 999,
            background: P.accentBg,
            border: `1.5px solid ${P.accentEdge}`,
            color: P.accent,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 0.5,
            fontFamily,
          }}
        >
          ONLY SPEAKS WHEN THE FACTS CHECK OUT
        </div>
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — street signs fly past, no story, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.03} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Signs With No Story", kicker: "Street names fly past at 70 km/h, history unread" }}
      />

      {/* b2 — no meaning without proof, nothing invented, page scrolled on */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} push={0.03} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "No meaning without proof", line2: "nothing invented", keywords: ["proof", "invented"] }}
      />

      {/* b3 — the tour-guide metaphor, drawn only, no backdrop and no commit fit */}
      <AnalogyPanel />

      {/* b4 — the fix: OpenStreetMap harvest, source-confirmed match, over the hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} push={0.03} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: [
            "Pull every named street from OpenStreetMap",
            "Match name to a place only if a source confirms it",
            "Kolbuvegen matches the village of Kolbu",
          ],
          result: "Every street gets a verified story",
          system: "OpenStreetMap = free, crowd-mapped street data",
        }}
      />

      {/* b5 — the skip rule, drawn only (gate 2), holds to the final frame */}
      <MotionInsert
        effect="cornerTags"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.82}
        data={{
          statement: "Thin stubs don't get a story",
          tags: [
            "Under 60 meters: skip",
            "One address only: skip",
            "Length checked first",
            "Everything else: a story",
          ],
        }}
      />
      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureEveryStreetNameBecomesG06: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
