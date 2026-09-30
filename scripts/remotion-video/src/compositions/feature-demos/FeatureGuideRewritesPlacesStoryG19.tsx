// FeatureGuideRewritesPlacesStoryG19 — feature g19 — 1280x720, 897 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood dawn.
//
// Guide — Stories on the Road. A personal audio guide for driving: the phone
// knows where I am and plays short stories about the places around me, in
// Norwegian and Ukrainian side by side.
//
// b1 15-292: product plate ("Guide — Stories on the Road") + danger StatPill
//   ("thin story, never revisited") + LiveWindow playing the real feature page
//   (shots/g19.json, shot "page") — the two verified URLs are the feature's own
//   page and the /features hub; the page is shown here, the hub is never shown
//   (kept clear of the final beat per gate 2).
// b2 301-491: the ribbon becomes a 21-day drive-history axis. A place marker
//   crawls along it lighting up the nights it was actually driven past, then
//   the real numbers land: STORY_GEN=3 (re-queue threshold) and MAX_PLACES=120
//   (per-run cap) on a small queue of skipped + stale "ready" places, sorted
//   most-driven-first.
// b3 500-713: non-crossfade vertical slide (b2 exits down, b3 enters from
//   above — no plain crossfade) into the Wikidata duplicate-merge mechanism:
//   "Stabo nedre" and "Nedre Stabu" slide together into one pin as twin()'s
//   direction-word normalizer + Levenshtein fallback recognize them as the
//   same place. Single tech-credibility caption: FilterChip "Wikidata" with a
//   plain gloss ("a free structured database of facts").
// b4 722-852: hand-inlined LogWindow (no runtime log exists for this product;
//   every line is built from the feature's own numbers) — route_days scored,
//   STORY_GEN re-queue, twin() merge, then the hero result 6 -> 10 sentences.
//   Holds at full opacity through frame 897, no fade-out, never shows the page
//   or hub.
//
// Persistent element: the horizontal 21-day drive-history ribbon spanning
// RIBBON_LEFT..RIBBON_RIGHT, with the "THIS PLACE" marker whose state (color,
// badge, sentence count) evolves across beats 2-4.
// Non-crossfade transition: b2 -> b3, vertical slide via Group dy (Easing.in/
// out(Easing.cubic)), following the g17 convention.
// Single tech-credibility caption: FilterChip "Wikidata" in b3, plain gloss
// underneath, nowhere else in the clip.
// Real data only: 21-day window ("last three weeks"), STORY_GEN=3,
// MAX_PLACES=120, direction words (nedre, øvre, søndre, vestre), Levenshtein
// fallback, "Stabo nedre" / "Nedre Stabu", 6 -> 10 sentences (12-22 words
// each). Source: features.problem_en/solution_en/result_en for g19, commit
// 9ac7ab8 (route_days scoring + twin() merge + 10-sentence cap) represented
// only as these derived numbers and function names, never as a live diff —
// its GitHub URL was not in the verified-URL list for this feature.
// Emoji used (single codepoint only): 🛑 📍 🌙 🔁 🧩 ✅ ⛪ 🏚 ⛰

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  CheckBadge,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine } from "./live-primitives";
import shotsFile from "./shots/g19.json";

const FADE = 9;

const B1_S = 15;
const B1_E = 292;
const B2_S = 301;
const B2_E = 491;
const B3_S = 500;
const B3_E = 713;
const B4_S = 722;
const END = 897;

const RIBBON_Y = 128;
const RIBBON_LEFT = 90;
const RIBBON_RIGHT = 1190;

const BeatLabel: React.FC<{
  x: number;
  y: number;
  kicker: string;
  title: string;
  opacity: number;
}> = ({ x, y, kicker, title, opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity }}>
      <div
        style={{
          fontFamily,
          fontSize: 14,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: P.accent,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {kicker}
      </div>
      <div style={{ fontFamily, fontSize: 30, fontWeight: 800, color: P.ink }}>
        {title}
      </div>
    </div>
  );
};

const DayTicks: React.FC<{ opacity: number; litFrac: number }> = ({
  opacity,
  litFrac,
}) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  const n = 21;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const frac = i / (n - 1);
        const x = RIBBON_LEFT + frac * (RIBBON_RIGHT - RIBBON_LEFT);
        const lit = frac <= litFrac;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 3,
              top: RIBBON_Y - 3,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: lit ? P.accent : P.border,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

const Ribbon: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: RIBBON_LEFT,
        top: RIBBON_Y,
        width: RIBBON_RIGHT - RIBBON_LEFT,
        height: 2,
        background: P.border,
        opacity,
      }}
    />
  );
};

const OTHER_STOPS = [
  { frac: 0.14, emoji: "⛪", label: "church" },
  { frac: 0.36, emoji: "🏚", label: "farm" },
  { frac: 0.86, emoji: "⛰", label: "ridge" },
];

const OtherStops: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <>
      {OTHER_STOPS.map((s, i) => {
        const x = RIBBON_LEFT + s.frac * (RIBBON_RIGHT - RIBBON_LEFT);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 24,
              top: RIBBON_Y + 14,
              opacity: opacity * 0.7,
              textAlign: "center",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 20 }}>{s.emoji}</div>
            <div style={{ fontSize: 12, color: P.muted, marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        );
      })}
    </>
  );
};

const PlaceMarker: React.FC<{
  x: number;
  opacity: number;
  tone: "danger" | "accent" | "success";
  label: string;
}> = ({ x, opacity, tone, label }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  const color =
    tone === "danger" ? P.danger : tone === "success" ? P.success : P.accent;
  const bg =
    tone === "danger" ? P.dangerBg : tone === "success" ? P.successBg : P.accentBg;
  return (
    <div style={{ position: "absolute", left: x - 70, top: RIBBON_Y - 54, opacity }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: color,
          margin: "0 auto 8px",
          boxShadow: `0 0 0 5px ${bg}`,
        }}
      />
      <div
        style={{
          fontFamily,
          fontSize: 16,
          fontWeight: 700,
          color,
          background: bg,
          padding: "4px 10px",
          borderRadius: 8,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const QueueRow: React.FC<{
  x: number;
  y: number;
  w: number;
  emoji: string;
  text: string;
  tag: string;
  tone: "danger" | "accent";
  opacity: number;
}> = ({ x, y, w, emoji, text, tag, tone, opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : P.accent;
  const bg = tone === "danger" ? P.dangerBg : P.accentBg;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: P.card,
        border: `1px solid ${P.border}`,
        borderRadius: 12,
        padding: "10px 16px",
        fontFamily,
      }}
    >
      <div style={{ fontSize: 17, color: P.ink, fontWeight: 600 }}>
        {emoji} {text}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color,
          background: bg,
          padding: "3px 9px",
          borderRadius: 7,
        }}
      >
        {tag}
      </div>
    </div>
  );
};

const NamePin: React.FC<{
  x: number;
  y: number;
  text: string;
  opacity: number;
  merged: boolean;
}> = ({ x, y, text, opacity, merged }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        fontFamily,
        fontSize: 20,
        fontWeight: 700,
        color: merged ? P.success : P.ink,
        background: merged ? P.successBg : P.card,
        border: `2px solid ${merged ? P.successEdge : P.border}`,
        borderRadius: 14,
        padding: "10px 18px",
        boxShadow: "0 4px 14px rgba(20,30,60,0.08)",
      }}
    >
      📍 {text}
    </div>
  );
};

const LogWindowG19: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  const frame = useCurrentFrame();
  const lines: LogLine[] = [
    { t: "scan", text: "21-day drive history scored per place", tone: "muted" },
    { t: "queue", text: "STORY_GEN=3 -> re-queue stale + skipped", tone: "accent" },
    { t: "cap", text: "MAX_PLACES=120 per run, most-driven first", tone: "muted" },
    { t: "match", text: 'twin(): "Stabo nedre" = "Nedre Stabu"', tone: "success" },
    { t: "write", text: "story_prompt(): 12-22 words/sentence", tone: "muted" },
    { t: "result", text: "sentences per place: 6 -> 10", tone: "success" },
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity }}>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 60,
          fontFamily,
          fontSize: 14,
          color: P.muted,
          letterSpacing: 1,
        }}
      >
        Guide — Stories on the Road · nightly research pass
      </div>
      <LogWindow
        title="guide-research · nightly pass"
        from={B4_S + 8}
        every={24}
        fontSize={21}
        win={{ x: 190, y: 150, w: 900, h: 330 }}
        opacity={1}
        lines={lines}
      />
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 522,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: seg(frame, B4_S + 140, B4_S + 140 + FADE),
        }}
      >
        <div style={{ fontFamily, fontSize: 90, fontWeight: 800, color: P.success }}>
          10
        </div>
        <div style={{ fontFamily, fontSize: 18, color: P.muted, maxWidth: 420, lineHeight: 1.35 }}>
          sentences on your most-driven roads
          <br />
          (was 6 — thin, and never revisited)
        </div>
        <CheckBadge x={560} y={40} scale={0.9} opacity={1} size={60} />
      </div>
    </div>
  );
};

const FrameInner: React.FC<{
  b1: number;
  b2: number;
  b3: number;
  b4: number;
}> = ({ b1, b2, b3, b4 }) => {
  const frame = useCurrentFrame();
  const P = usePalette();

  const ribbonOpacity = Math.min(1, b1 * 0.5 + b2 + b3 * 0.4 + b4 * 0.12);
  const stopsOpacity = Math.min(1, b2 + b3 * 0.8 + b4 * 0.3);

  const b2ExitY = interpolate(frame, [B2_E, B2_E + FADE], [0, -34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const b3EnterY = interpolate(frame, [B3_S, B3_S + FADE], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const markerX = RIBBON_LEFT + 0.62 * (RIBBON_RIGHT - RIBBON_LEFT);
  const litFrac = interpolate(frame, [B2_S, B2_S + 120], [0.1, 0.95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFillLocal>
      <LightBg />
      <Ribbon opacity={ribbonOpacity} />
      <DayTicks opacity={b2} litFrac={litFrac} />
      <OtherStops opacity={stopsOpacity} />

      {/* Beat 1: product + LiveWindow of the real page */}
      <Group opacity={b1}>
        <BeatLabel
          x={60}
          y={600}
          kicker="Guide — Stories on the Road"
          title="a story, told once, never again"
          opacity={1}
        />
        <StatPill
          x={720}
          y={60}
          emoji="🛑"
          text="thin story, stuck forever"
          tone="danger"
          opacity={seg(frame, B1_S + 20, B1_S + 20 + FADE)}
        />
        <LiveWindow
          file={shotsFile as any}
          shot="page"
          title="vitalii.no/features · the-guide-now-rewrites…"
          from={B1_S + 30}
          hold={B1_E - (B1_S + 30) - 20}
          zoom={() => 1.08}
          focus={{ x: 0.45, y: 0.4 }}
          opacity={1}
          win={{ x: 140, y: 150, w: 1000, h: 440 }}
        />
      </Group>

      {/* Beat 2: route_days scoring + queue, exits sliding down */}
      <Group opacity={b2} dy={b2ExitY}>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 40,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 1,
            opacity: seg(frame, B2_S + 5, B2_S + 5 + FADE),
          }}
        >
          route_days() — scored per place, nightly
        </div>
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 34,
            textAlign: "right",
            fontFamily,
            opacity: seg(frame, B2_S + 15, B2_S + 15 + FADE),
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 800, color: P.ink }}>21</div>
          <div style={{ fontSize: 13, color: P.muted }}>nights tracked</div>
        </div>
        <BeatLabel
          x={60}
          y={600}
          kicker="every night, scored"
          title="most-driven roads go first"
          opacity={1}
        />
        <PlaceMarker
          x={markerX}
          opacity={seg(frame, B2_S + 20, B2_S + 20 + FADE)}
          tone="accent"
          label="THIS PLACE · 18/21 nights"
        />
        <QueueRow
          x={150}
          y={290}
          w={700}
          emoji="🌙"
          text="skipped — too few facts"
          tag="re-queue"
          tone="accent"
          opacity={seg(frame, B2_S + 50, B2_S + 50 + FADE)}
        />
        <QueueRow
          x={150}
          y={390}
          w={700}
          emoji="🔁"
          text='"ready" but stale (gen 1)'
          tag="STORY_GEN=3"
          tone="accent"
          opacity={seg(frame, B2_S + 80, B2_S + 80 + FADE)}
        />
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 290,
            opacity: seg(frame, B2_S + 95, B2_S + 95 + FADE),
            fontFamily,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 800, color: P.accent }}>3</div>
          <div style={{ fontSize: 13, color: P.muted, maxWidth: 170 }}>
            STORY_GEN threshold
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 390,
            opacity: seg(frame, B2_S + 110, B2_S + 110 + FADE),
            fontFamily,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 800, color: P.accent }}>120</div>
          <div style={{ fontSize: 13, color: P.muted, maxWidth: 170 }}>
            places re-researched per run
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 500,
            width: 1000,
            height: 10,
            borderRadius: 5,
            background: P.border,
            opacity: seg(frame, B2_S + 130, B2_S + 130 + FADE),
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "62%",
              height: "100%",
              background: P.accent,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 518,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            opacity: seg(frame, B2_S + 130, B2_S + 130 + FADE),
          }}
        >
          most-driven-first ordering of the requeue list
        </div>
      </Group>

      {/* Beat 3: Wikidata duplicate merge, enters sliding down from above */}
      <Group opacity={b3} dy={b3EnterY}>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 40,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 1,
            opacity: seg(frame, B3_S + 5, B3_S + 5 + FADE),
          }}
        >
          Wikidata place matching — before
        </div>
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 34,
            textAlign: "right",
            fontFamily,
            opacity: seg(frame, B3_S + 150, B3_S + 150 + FADE),
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 800, color: P.success }}>2 → 1</div>
          <div style={{ fontSize: 13, color: P.muted }}>names merged</div>
        </div>
        <BeatLabel
          x={60}
          y={600}
          kicker="Wikidata place names"
          title="two spellings, one place"
          opacity={1}
        />
        <NamePin
          x={200}
          y={230}
          text="Stabo nedre"
          opacity={1 - seg(frame, B3_S + 90, B3_S + 90 + 30)}
          merged={false}
        />
        <NamePin
          x={760}
          y={230}
          text="Nedre Stabu"
          opacity={1 - seg(frame, B3_S + 90, B3_S + 90 + 30)}
          merged={false}
        />
        <div style={{ opacity: seg(frame, B3_S + 100, B3_S + 100 + FADE) }}>
          <NamePin x={470} y={230} text="Stabo nedre" opacity={1} merged />
        </div>
        <FilterChip
          x={870}
          y={480}
          text="Wikidata"
          icon="🧩"
          color={P.accent}
          scale={1}
          opacity={seg(frame, B3_S + 40, B3_S + 40 + FADE)}
        />
        <div
          style={{
            position: "absolute",
            left: 870,
            top: 522,
            fontFamily,
            fontSize: 15,
            color: P.muted,
            maxWidth: 260,
            opacity: seg(frame, B3_S + 40, B3_S + 40 + FADE),
          }}
        >
          a free structured database of facts
        </div>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 340,
            fontFamily,
            fontSize: 17,
            color: P.ink,
            maxWidth: 560,
            lineHeight: 1.4,
            opacity: seg(frame, B3_S + 60, B3_S + 60 + FADE),
          }}
        >
          twin(): normalizes direction words — nedre, øvre, søndre, vestre
        </div>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 400,
            fontFamily,
            fontSize: 17,
            color: P.ink,
            maxWidth: 560,
            lineHeight: 1.4,
            opacity: seg(frame, B3_S + 130, B3_S + 130 + FADE),
          }}
        >
          falls back to a short Levenshtein check on the rest
        </div>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 480,
            fontFamily,
            fontSize: 15,
            color: P.success,
            fontWeight: 700,
            opacity: seg(frame, B3_S + 160, B3_S + 160 + FADE),
          }}
        >
          ✅ one pin on the map, not two
        </div>
      </Group>

      {/* Beat 4: hand-inlined LogWindow, holds to END, no fade-out */}
      <Panel
        x={0}
        y={0}
        w={1280}
        h={720}
        tone="card"
        opacity={b4 * 0.001}
        radius={0}
      />
      <LogWindowG19 opacity={b4} />
    </AbsoluteFillLocal>
  );
};

const AbsoluteFillLocal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, overflow: "hidden" }}>
    {children}
  </div>
);

export const FeatureGuideRewritesPlacesStoryG19: React.FC = () => {
  const frame = useCurrentFrame();

  const b1 =
    seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 =
    seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 =
    seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE);

  return (
    <PaletteProvider value={MOODS.dawn}>
      <FrameInner b1={b1} b2={b2} b3={b3} b4={b4} />
    </PaletteProvider>
  );
};
