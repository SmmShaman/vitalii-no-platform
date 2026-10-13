// FeatureProductNamesWereNorwegianD13 — feature d13 — 1280x720, 894 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split duel, mood sand. Motion direction (feature-motion skill, 2026-10-07).
//
// Only two URLs were verified tonight — the feature's own page and the features
// hub — so only b1 and b2 carry a live recording; b3-b5 are drawn (catalog effect
// over the dark stage, no backdrop), the way p77's b4 ("drawn only, no backdrop")
// already does it in this codebase.
//
// b1 15-205   "A Ukrainian-speaking parent logging her child's meal had to
//             recognize a word written only in Norwegian." cornerTags over the
//             feature's own page (shots/d13.json "page") — the human problem,
//             no tech name yet.
// b2 205-357  "Search for it in her own language and nothing came up — not even
//             a close match." statusFocus over the features hub ("hub") — NO
//             search succeeds, UA search fails, matching the split-duel archetype.
// b3 357-516  "Even new products scanned in by photo came back Norwegian-only,
//             every time." pipelineFlow, drawn — the AI scan pipeline still only
//             writes the Norwegian name.
// b4 516-690  "Now a Ukrainian line sits right under the Norwegian name, saved
//             straight into Cloudflare." handoffExplain, drawn — the one tech
//             name in the whole script lands here, with a one-line plain gloss
//             (TechGloss) explaining it as "the database behind every product".
// b5 690-894  "Search овсянка today and it finds havregrøt — the same entry, in
//             her own language." copyCorrection, drawn — the real result, no
//             invented number. Holds bright to the final frame, no fade. Neither
//             the feature page nor the hub is shown in this beat.
//
// Persistent element: a split-duel lower third (archetype 0) — a NO card and a
// UA card either side of a centre bar. Its state changes on every beat (plain →
// confirmed/miss → scanning → arriving → matched) so no card sits still for more
// than one beat; it resolves into a single "SAME ENTRY" badge only in b5.
//
// Commits: only 7360c30 ("product names and portions in Ukrainian under the
// Norwegian ones") matches this feature. 34e6ff5 and 0db315b belong to sibling
// features d11/d12 and are not used here — no commit evidence is shown at all,
// since no GitHub URL was verified tonight.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut, Arrive } from "./motion-primitives";
import shotsFile from "./shots/d13.json";

const B1 = 15;
const B2 = 205;
const B3 = 357;
const B4 = 516;
const B5 = 690;
const END = 894;

/** Accent tuned for the dark stage — sand's own #B4531F reads muddy on a plate
 * (same fix as p75 and d07). */
const ACCENT = "#F08A4B";
const STAGE = "#1C1610";

const PLATE_BOX = { x: 40, y: 28, w: 420, h: 38 };
const GLOSS_BOX = { x: 40, y: 80, w: 460, h: 26 };
const BAND = { x: 40, y: 606, w: 1200, h: 92 };

type DuelState = "plain" | "confirmed" | "miss" | "scanning" | "arriving" | "matched";

function duelAt(frame: number): { left: DuelState; right: DuelState; rightText: string; beatStart: number } {
  if (frame < B2) return { left: "plain", right: "plain", rightText: "?", beatStart: B1 };
  if (frame < B3) return { left: "confirmed", right: "miss", rightText: "—", beatStart: B2 };
  if (frame < B4) return { left: "scanning", right: "scanning", rightText: "—", beatStart: B3 };
  if (frame < B5) return { left: "confirmed", right: "arriving", rightText: "овсянка", beatStart: B4 };
  return { left: "matched", right: "matched", rightText: "овсянка", beatStart: B5 };
}

const MARK: Record<DuelState, { glyph: string; color: string } | null> = {
  plain: null,
  confirmed: { glyph: "✓", color: "#6FB36F" },
  miss: { glyph: "✕", color: "#D4594A" },
  scanning: { glyph: "···", color: "#D7A23E" },
  arriving: { glyph: "✓", color: "#6FB36F" },
  matched: { glyph: "✓", color: "#6FB36F" },
};

const DuelCard: React.FC<{ x: number; w: number; lang: string; text: string; st: DuelState }> = ({
  x,
  w,
  lang,
  text,
  st,
}) => {
  const mark = MARK[st];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: BAND.y,
        width: w,
        height: BAND.h,
        background: "rgba(28,22,16,0.82)",
        border: `1.5px solid ${ACCENT}`,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        fontFamily,
        color: "#F6EFE6",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 2, color: ACCENT, width: 46 }}>{lang}</div>
      <div style={{ fontSize: 24, fontWeight: 700, flex: 1 }}>{text}</div>
      {mark && <div style={{ fontSize: 22, fontWeight: 800, color: mark.color }}>{mark.glyph}</div>}
    </div>
  );
};

/** Persistent archetype 0 (split duel): a NO search result against a UA search
 * result. State changes at every beat boundary — see duelAt/MARK above. */
const SplitDuel: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B1) return null;
  const state = duelAt(frame);
  const cardW = (BAND.w - 2) / 2;
  return (
    <Arrive at={state.beatStart} kind="rise" box={BAND} dur={0.3}>
      <DuelCard x={BAND.x} w={cardW} lang="NO" text="havregrøt" st={state.left} />
      <div
        style={{
          position: "absolute",
          left: BAND.x + cardW,
          top: BAND.y + 10,
          width: 2,
          height: BAND.h - 20,
          background: ACCENT,
          opacity: state.left === "matched" ? 0 : 0.6,
        }}
      />
      <DuelCard x={BAND.x + cardW + 2} w={cardW} lang="UA" text={state.rightText} st={state.right} />
      {state.left === "matched" && (
        <div
          style={{
            position: "absolute",
            left: BAND.x + BAND.w / 2 - 54,
            top: BAND.y - 28,
            width: 108,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 1.3,
            color: ACCENT,
            background: "rgba(28,22,16,0.85)",
            borderRadius: 999,
            padding: "4px 0",
            fontFamily,
          }}
        >
          SAME ENTRY
        </div>
      )}
    </Arrive>
  );
};

/** "Insulin Simulator" product-name plate (same pill as d07/d08) — names the app in b1. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B1) return null;
  return (
    <Arrive at={B1} kind="wipe" box={PLATE_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: PLATE_BOX.x,
          top: PLATE_BOX.y,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px",
          borderRadius: 999,
          background: "rgba(23,18,14,0.82)",
          border: `1.5px solid ${ACCENT}`,
          color: "#F6EFE6",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 0.3,
          fontFamily,
        }}
      >
        <span style={{ color: ACCENT, fontWeight: 800 }}>Insulin Simulator</span>
        <span style={{ opacity: 0.85 }}>— logs meals in Ukrainian too</span>
      </div>
    </Arrive>
  );
};

/** One plain gloss for the one tech name in the script, shown only during b4. */
const TechGloss: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B4 || frame >= B5) return null;
  return (
    <Arrive at={B4} kind="rise" box={GLOSS_BOX} dur={0.35}>
      <div style={{ position: "absolute", left: GLOSS_BOX.x, top: GLOSS_BOX.y, fontFamily, fontSize: 15, fontWeight: 600, color: "#D9CBB8" }}>
        <span style={{ color: ACCENT, fontWeight: 800 }}>Cloudflare</span> — the database behind every product
      </div>
    </Arrive>
  );
};

/** b3 — supplementary, always-visible "every time" strip across the top of the
    frame. pipelineFlow's own chain compacts to a small centered glyph and its
    frame/title/result land late in the beat (by design, per its own internal
    pacing), so without this the top two-thirds of the canvas sit bare for most
    of the beat regardless of which frame is sampled. */
const RepeatStrip: React.FC = () => {
  const frame = useCurrentFrame();
  if (cut(frame, B3, B4) !== 1) return null;
  const items = ["🥣 oatmeal", "🍞 bread", "🧀 cheese", "🥛 milk"];
  return (
    <Arrive at={B3 + 4} kind="rise" box={{ x: 60, y: 56, w: 1160, h: 150 }} dur={0.3}>
      <div style={{ position: "absolute", left: 60, top: 56, width: 1160, fontFamily }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: ACCENT }}>
          EVERY NEW PRODUCT, SAME RESULT
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
          {items.map((label) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: "16px 18px",
                borderRadius: 8,
                background: "rgba(28,22,16,0.82)",
                border: `1.5px solid ${ACCENT}`,
                color: "#F6EFE6",
                fontSize: 20,
                fontWeight: 700,
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <div>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: ACCENT, marginTop: 8 }}>
                NO ONLY
              </div>
            </div>
          ))}
        </div>
      </div>
    </Arrive>
  );
};

/** b4 — supplementary, always-visible database-row mockup on the right half of
    the frame. handoffExplain's own camera move lands its new-state box roughly
    over the left half, and its staggered points list starts only in the back
    half of the beat; this card does not depend on that timing, so the right
    side is never left bare regardless of which frame is sampled. */
const TranslationRowPreview: React.FC = () => {
  const frame = useCurrentFrame();
  if (cut(frame, B4, B5) !== 1) return null;
  return (
    <Arrive at={B4 + 6} kind="rise" box={{ x: 820, y: 150, w: 380, h: 360 }} dur={0.3}>
      <div
        style={{
          position: "absolute",
          left: 820,
          top: 150,
          width: 380,
          padding: 24,
          borderRadius: 8,
          background: "rgba(28,22,16,0.88)",
          border: `2px solid ${ACCENT}`,
          fontFamily,
          color: "#F6EFE6",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 2, color: ACCENT }}>
          DATABASE ROW — "oatmeal"
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(246,239,230,0.6)", letterSpacing: 1 }}>
            NO COLUMN
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>havregrøt</div>
        </div>
        <div style={{ marginTop: 20, opacity: 0.6 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(246,239,230,0.6)", letterSpacing: 1 }}>
            UA COLUMN — BEFORE
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, fontStyle: "italic" }}>(empty)</div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT, letterSpacing: 1 }}>UA COLUMN — NOW</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: ACCENT }}>овсянка</div>
        </div>
      </div>
    </Arrive>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "Product names were Norwegian-only",
          tags: ["Ukrainian parent", "Daily meal log", "No Ukrainian name"],
        }}
      />

      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          title: "Searching for oatmeal",
          claims: [
            { text: "Norwegian: havregrøt — found", verdict: "yes" },
            { text: "Ukrainian: овсянка — found", verdict: "no" },
          ],
        }}
      />

      {/* b3 — drawn only (no backdrop), the AI pipeline still writing Norwegian-only */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          steps: ["Photo of product", "AI reads label", "Entry saved"],
          result: "Norwegian only",
          system: "AI scan pipeline",
        }}
      />
      <RepeatStrip />

      {/* b4 — the fix, drawn only (no backdrop); the one tech name lands here */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          from: "Norwegian only",
          to: "Norwegian + Ukrainian",
          points: [
            "New translation column",
            "Picker, viewer, calculator updated",
            "Search checks both languages",
            "AI pipeline fills the Ukrainian line",
          ],
          fromLabel: "BEFORE",
          toLabel: "NOW",
        }}
      />
      <TranslationRowPreview />

      {/* b5 — the result, drawn only; neither the page nor the hub is shown here */}
      <MotionInsert
        effect="copyCorrection"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          wrong: "овсянка → no results",
          right: "овсянка → havregrøt",
          label: "Search today",
        }}
      />

      <ProductPlate />
      <TechGloss />
      <SplitDuel />
    </AbsoluteFill>
  );
};

export const FeatureProductNamesWereNorwegianD13: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
