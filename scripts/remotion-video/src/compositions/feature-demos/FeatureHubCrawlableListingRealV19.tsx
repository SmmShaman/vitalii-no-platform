// FeatureHubCrawlableListingRealV19 — feature v19 — 1280x720, 973 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row, no numbers exist for v19 so none are used):
// b1 15-198   "every feature sat on its own lonely page"
//             cornerTags over the real feature page (backdrop "feature") — the problem
//             stated as four facts. Split-duel band: BEFORE fills almost the whole strip.
// b2 198-405  "no filter, no project view, full reload to share"
//             keywordCaption over a dark plate (no backdrop — nothing new to film, same
//             problem restated). Band keeps sliding toward AFTER.
// b3 405-581  "I built one hub: click a badge, list filters instantly"
//             handoffExplain over the real hub (backdrop "hub") — live click on a filter
//             chip. Band crosses the midpoint; AFTER zone gets its first label.
// b4 581-745  "a cached Supabase query backs it, never re-hits the database"
//             pipelineFlow over the real commit history (backdrop "commits") — evidence
//             the caching work actually shipped. AFTER zone now dominates.
// b5 745-973  "crawlable, filterable, shareable by a direct link" — the verdict
//             titleTakeover over a dark plate (never the feature's own page or the hub —
//             gate 2). Split-duel band ends on three labelled, checked results:
//             Crawlable / Filterable / Shareable. Holds to the end, no fade.
//
// Persistent element: the split-duel band (archetype 0), b1 through b5 — BEFORE (red,
// left) yields to AFTER (green, right) as the divider slides across all five beats.

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import shotsFile from "./shots/v19.json";

const B1 = 15;
const B2 = 198;
const B3 = 405;
const B4 = 581;
const B5 = 745;
const END = 973;

/** Accent tuned for the dark stage (violet's own #5B37D4 reads muddy on a dark plate). */
const ACCENT = "#AA91FF";
const STAGE = "#1B1740";

// Split-duel band geometry (1280x720, below the effects' safe bottom at y≈587).
const BAND_Y = 606;
const TAG_H = 20;
const ROW_Y = BAND_Y + TAG_H + 6;
const ROW_H = 68;

const CHECKS = [
  { label: "Crawlable", detail: "hub + every feature page in the sitemap" },
  { label: "Filterable", detail: "category & project badges" },
  { label: "Shareable", detail: "deep-linkable modal, bookmarkable URL" },
];

const SplitDuelBand: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const dividerX = interpolate(frame, [B1, B2, B3, B4, B5, END], [1100, 820, 560, 300, 80, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const afterW = 1280 - dividerX;

  const beforeText = cut(frame, B1, B2) === 1 ? "Lonely page, no index" : cut(frame, B2, B3) === 1 ? "No filter, no project view" : null;
  const afterText = cut(frame, B3, B4) === 1 ? "One hub, instant filter" : cut(frame, B4, B5) === 1 ? "Cached query, no DB hit" : null;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* b1 — names the product as a small plate */}
      {frame < B2 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BAND_Y,
            width: 1280,
            height: TAG_H,
            background: "rgba(27,23,64,0.82)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1.6,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
          }}
        >
          PRODUCT: FEATURES HUB — vitalii.no/features
        </div>
      )}

      <Arrive at={B1 + 6} kind="wipe" box={{ x: 0, y: ROW_Y, w: 1280, h: ROW_H }} dur={0.4}>
        <div style={{ position: "absolute", left: 0, top: ROW_Y, width: dividerX, height: ROW_H, background: P.dangerBg, borderRight: `3px solid ${P.dangerEdge}` }} />
        <div style={{ position: "absolute", left: dividerX, top: ROW_Y, width: afterW, height: ROW_H, background: P.successBg }} />
        <div style={{ position: "absolute", left: dividerX - 2, top: ROW_Y, width: 4, height: ROW_H, background: P.ink }} />

        <div style={{ position: "absolute", left: 16, top: ROW_Y + 8, fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.danger }}>BEFORE</div>
        {beforeText && dividerX > 170 && (
          <div style={{ position: "absolute", left: 16, top: ROW_Y + 30, fontSize: 17, fontWeight: 700, color: P.ink, maxWidth: dividerX - 32 }}>
            {beforeText}
          </div>
        )}

        <div style={{ position: "absolute", left: dividerX + 16, top: ROW_Y + 8, fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.success }}>AFTER</div>
        {afterText && afterW > 170 && (
          <div style={{ position: "absolute", left: dividerX + 16, top: ROW_Y + 30, fontSize: 17, fontWeight: 700, color: P.ink, maxWidth: afterW - 32 }}>
            {afterText}
          </div>
        )}

        {frame >= B5 &&
          CHECKS.map((c, i) => {
            const at = B5 + 12 + i * 22;
            if (frame < at) return null;
            const x = dividerX + 16 + i * ((afterW - 32) / 3);
            return (
              <div key={c.label} style={{ position: "absolute", left: x, top: ROW_Y + 26, width: (afterW - 32) / 3 - 10 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: P.success }}>✓ {c.label}</div>
                <div style={{ fontSize: 12, color: P.muted, marginTop: 3, lineHeight: 1.25 }}>{c.detail}</div>
              </div>
            );
          })}
      </Arrive>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own lonely page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="feature" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "One feature, one lonely page",
          tags: ["Separate page per feature", "No topic browse", "Full reload just to share a link", "401 features, no index"],
        }}
      />

      {/* b2 — the same problem, no new page to film */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{ statement: "No filter. No project view. Full reload just to share one link." }}
      />

      {/* b3 — the fix, over the real hub (live click on a filter chip) */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "401 separate pages, no index",
          to: "One filterable hub",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Click a category badge", "List filters instantly", "URL updates — shareable link"],
        }}
      />

      {/* b4 — the caching mechanism, over the real commit history */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="commits" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Click category badge", "Cached Supabase query runs", "Filtered list renders"],
          result: "No repeat database hit",
          system: "Supabase (cached query)",
        }}
      />

      {/* b5 — the verdict, holds to the end. Never the feature page or the hub (gate 2). */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "Crawlable. Filterable. Shareable.",
          kicker: "Every feature page and the hub, indexed and deep-linkable",
        }}
      />

      <SplitDuelBand />
    </AbsoluteFill>
  );
};

export const FeatureHubCrawlableListingRealV19: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
