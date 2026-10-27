// FeatureEveryStreetNameBecomesG06 — feature g06 — 1280x720, 908 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction (feature-motion skill, 2026-10-07).
// RE-SHOOT (2026-10-27): same narration/beat windows as before — the picture is redrawn.
// Fix vs the previous cut: ACCENT/STAGE were borrowed from the "sand" mood by mistake
// (#B4531F/#1C140C) while the tree renders MOODS.dawn — every effect tinted a warm
// terracotta against a navy-palette ledger. Now ACCENT=#2563EB/STAGE=#0F1626, the
// values every other dawn clip in this repo uses.
//
// Ledger lower third: a receipt-style ticket in the y>=606 band — dashed tear line
// under the header, monospace running total — carries two risk line items that post
// in red as the problem beats land, then each is struck through and rewritten in
// green once its fix arrives (same mechanic as d09/p75's lower third).
//
// Beat → picture (data only from the feature row and the feature's own live page;
// none of the given commits — 111c47e, 5414aba, d0311d6 — says what any beat says,
// so no commit diff appears anywhere in this clip):
// b1 15-201   "street signs fly past, the real history behind each name unread"
//             quoteMarker over the feature's own page (backdrop "page") — not
//             titleTakeover (g07 already opened on that this wave) and not
//             cornerTags (p80's opener). Ledger wipes in; the product plate
//             "GUIDE — STORIES ON THE ROAD" rises; first red line item posts.
// b2 201-314  "never invents a meaning it can't actually prove"
//             keywordCaption over the page scrolled on (backdrop "page2").
//             Second red line item "thin stubs risk a forced story" posts.
// b3 314-438  "like a tour guide who only speaks once sure of the facts"
//             drawn (no catalog effect, no backdrop) — a signpost stands lit but
//             silent until a source-check animates in, then a speech bubble pops.
//             Ledger holds at two red items while the claim lands.
// b4 438-723  "every named street pulled from OpenStreetMap gets a story, naming
//             a place only when a source confirms it — Kolbuvegen matches Kolbu"
//             pipelineFlow over the hub (backdrop "hub"). The clip's one tech
//             name — OpenStreetMap — gets its gloss here. First ledger line item
//             strikes through and rewrites green.
// b5 723-908  "only the thinnest stubs get skipped, under 60 meters"
//             cornerTags, drawn only (no backdrop, per gate 2 — the last beat
//             never plays the feature page or hub); a 60M hero number anchors
//             the frame as its own big mover. Holds bright to the final frame.
//             Second ledger line item strikes through and rewrites green.
//
// Persistent element: the ledger lower third (archetype 5), b1 through b5, y>=606.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g06.json";

const B1 = 15;
const B2 = 201;
const B3 = 314;
const B4 = 438;
const B5 = 723;
const END = 908;

const ACCENT = "#2563EB";
const STAGE = "#0F1626";

// Ledger geometry — same band as the other archetype lower-thirds (y>=606).
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

  const resolvedCount = (row1 === "resolved" ? 1 : 0) + (row2 === "resolved" ? 1 : 0);
  const openCount = (row1 === "red" || row1 === "striking" ? 1 : 0) + (row2 === "red" || row2 === "striking" ? 1 : 0);
  const allResolved = resolvedCount === 2;
  const badgeColor = openCount > 0 ? P.danger : P.success;
  const badgeText = `${resolvedCount}/2 confirmed`;

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
            🧾 STREET LEDGER
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
              fontFamily: "monospace",
              whiteSpace: "nowrap",
            }}
          >
            {badgeText}
          </div>
          {/* tear line under the header, receipt-style */}
          <div
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              top: 26,
              height: 0,
              borderTop: `1.5px dashed ${P.border}`,
            }}
          />

          {row1 !== "hidden" && (
            <div style={{ position: "absolute", left: 16, top: 34, fontSize: 14, fontWeight: 700, color: row1Color, whiteSpace: "nowrap" }}>
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
            <div style={{ position: "absolute", left: 16, top: 58, fontSize: 14, fontWeight: 700, color: row2Color, whiteSpace: "nowrap" }}>
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
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.4, color: P.ink }}>GUIDE — STORIES ON THE ROAD</div>
            <div style={{ marginTop: 1, fontSize: 12, fontWeight: 600, color: P.muted }}>
              a personal audio guide for driving, Norwegian and Ukrainian side by side
            </div>
          </div>
        </Arrive>
      )}
    </div>
  );
};

/** b3 — the one plain analogy: a tour guide who only speaks once sure of the facts.
 * A signpost stands lit but silent through the beat's first third; a source-check
 * animates across a checklist; only then does a speech bubble pop with the line.
 * Fills the wide margins the old emoji+badge layout left bare (measured 24/48). */
const SignpostAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;
  const t = sec(frame, B3, fps);
  const signT = tween(t, 0.1, 0.35, ease.power3Out);
  const checklistT = tween(t, 0.5, 0.3, ease.power3Out);
  const check1 = tween(t, 0.8, 0.25, ease.power3Out);
  const check2 = tween(t, 1.1, 0.25, ease.power3Out);
  const bubbleT = tween(t, 1.5, 0.35, ease.power3Out);
  const footerT = tween(t, 2.0, 0.3, ease.power3Out);

  const checkRow = (label: string, p: number, top: number) => (
    <div style={{ position: "absolute", left: 420, top, width: 440, display: "flex", alignItems: "center", gap: 12, opacity: checklistT }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          background: p > 0.5 ? P.successBg : P.card,
          border: `2px solid ${p > 0.5 ? P.successEdge : P.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: P.success,
          flexShrink: 0,
        }}
      >
        {p > 0.5 ? "✓" : ""}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: P.ink, fontFamily }}>{label}</div>
    </div>
  );

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 606 }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${P.bgTop}, ${P.bgBottom})` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 44,
          width: 1280,
          textAlign: "center",
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 2.4,
          color: P.accent,
          opacity: signT,
          fontFamily,
        }}
      >
        THE TOUR GUIDE RULE
      </div>

      {/* signpost, left third */}
      <div style={{ position: "absolute", left: 90, top: 140, width: 280, textAlign: "center", opacity: signT, transform: `translateY(${(1 - signT) * 18}px)` }}>
        <div style={{ fontSize: 120, lineHeight: 1 }}>🪧</div>
        <div style={{ marginTop: 14, fontSize: 18, fontWeight: 800, color: P.ink, fontFamily }}>Stands silent</div>
        <div style={{ marginTop: 4, fontSize: 14, fontWeight: 600, color: P.muted, fontFamily }}>until it's sure</div>
      </div>

      {checkRow("Checks the source first", check1, 200)}
      {checkRow("Confirms the real place", check2, 254)}

      {/* speech bubble only pops once the checklist clears */}
      <div
        style={{
          position: "absolute",
          left: 420,
          top: 320,
          width: 440,
          padding: "18px 22px",
          background: P.card,
          border: `2px solid ${P.accentEdge}`,
          borderRadius: 10,
          boxShadow: "5px 5px 0 rgba(0,0,0,0.35)",
          opacity: bubbleT,
          transform: `scale(${mix(bubbleT, 0.85, 1)})`,
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 800, color: P.ink, fontFamily, lineHeight: 1.35 }}>
          "Kolbuvegen — named for the village of Kolbu."
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 40,
          top: 520,
          width: 1200,
          height: 60,
          background: P.accentBg,
          border: `1px solid ${P.accentEdge}`,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: 0.4,
          color: P.ink,
          textAlign: "center",
          opacity: footerT,
        }}
      >
        Only speaks when the facts check out
      </div>
    </div>
  );
};

/** b5 — the skip rule, drawn only (gate 2: never the feature page or hub).
 * The number is the hero: a 60M figure owns the upper-left third while the
 * cornerTags effect's own statement/tags carry the rest of the frame. */
const SixtyMeterHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5 || frame >= END) return null;
  const t = sec(frame, B5, fps);
  const numberT = tween(t, 0.15, 0.4, ease.power3Out);
  const labelT = tween(t, 0.55, 0.3, ease.power3Out);

  return (
    <div style={{ position: "absolute", left: 60, top: 150, width: 440, opacity: numberT, transform: `scale(${mix(numberT, 0.85, 1)})` }}>
      <div style={{ fontSize: 150, fontWeight: 800, color: P.accent, lineHeight: 1, fontFamily }}>60m</div>
      <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800, color: P.ink, fontFamily, opacity: labelT }}>
        shorter than this — skipped
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
        effect="quoteMarker"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{ quote: "Street signs fly past — the real history behind each name goes unread.", highlight: "history behind each name" }}
      />

      {/* b2 — never invents a meaning it can't prove, page scrolled on */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} push={0.03} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "Never invents a meaning", line2: "it can't actually prove", keywords: ["invents", "prove"] }}
      />

      {/* b3 — the tour-guide metaphor, drawn only, no backdrop and no commit fit */}
      <SignpostAnalogy />

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
            "Match the name to a place only if a source confirms it",
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
          statement: "Under 60 meters, no story",
          tags: ["One address only: skip", "Length checked first", "Everything else: a story"],
        }}
      />
      <SixtyMeterHero />

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureEveryStreetNameBecomesG06: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
