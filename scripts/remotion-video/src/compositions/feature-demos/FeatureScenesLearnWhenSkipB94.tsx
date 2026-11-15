// FeatureScenesLearnWhenSkipB94 — feature b94 — 1280x720, 958 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A hero band spans the full width at the top of the frame and never leaves —
// one giant number (fontSize 200, "owns" the top of the frame rather than
// sitting as a corner badge next to a window) with an eyebrow label on the
// left and a context sub-label on the right. Its content swaps per beat by
// range-gating, not remounting, so it reads as one object counting through
// the story.
//
// Beat → effect (data only from the feature row; the three given commits
// (89114cd, 50df24b, bf0b0cd) describe unrelated BoardCard work — compound
// words, ten-words-per-card, less text around a task — and match none of
// these beats, so the mechanism is drawn instead):
// b1 15-188   "a topic name is not a scene, yet the writer tried anyway"
//             keywordCaption over the feature's own page. Hero: 100% wasted
//             attempts. A one-beat brand plate bottom-left names the product
//             in plain words (no tech name here — that is reserved for b4).
// b2 188-404  "other cards got a scene less than half the time, at random"
//             cornerTags, still over the page. Hero: <50% had a scene at all.
// b3 404-550  "a kid could hit several plain cards before a scripted one"
//             funnelAbsorption over the page's problem section. Hero: 3+ in
//             a row (no exact count exists in the feature row, so the hero
//             uses the honest "3+" instead of inventing a precise figure).
// b4 550-735  "the writer skips topic-only subjects now, Cloudflare Workers
//             doubles scene coverage" — handoffExplain over the result
//             section. Hero: 2× scene coverage. The one tech name in the
//             whole clip sits inside this beat's bullet list only.
// b5 735-958  "the kiosk hunts for a card with a scene, never repeating one
//             within forty-five minutes" — drawn result, no live page (gate:
//             last beat never replays the feature page or the hub). A
//             LogWindow walks a simulated kiosk pick built from the feature's
//             own vocabulary (Matte / word cards / plan topics / drill types,
//             the 45-minute window) since no runtime log exists for this
//             product. Hero: 45 min no-repeat window, holds to the end.
//
// Persistent element: the hero-number band (archetype 7), full width,
// y 0-190, b1 through b5 — effects play below it, inside the rest of the
// 1280×720 frame.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b94.json";

const B1 = 15;
const B2 = 188;
const B3 = 404;
const B4 = 550;
const B5 = 735;
const END = 958;

/** Accent tuned for the dark stage (violet's flat #5B37D4 reads dull on a plate). */
const ACCENT = "#9B7BFF";
const STAGE = "#140B24";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Hero band geometry — full width, reserves the top of the frame the way
// live-primitives.tsx's WIN_DEFAULT already assumes ("leaves the top 190 px
// to the hero number and pills"); everything else plays below it.
const HERO = { x: 0, y: 0, w: 1280, h: 190 };

type HeroContent = {
  eyebrow: string;
  value: string;
  unit?: string;
  sub: string;
  tone: "danger" | "success" | "accent";
};

const heroFor = (frame: number): HeroContent => {
  if (frame < B2) {
    return { eyebrow: "WASTED ATTEMPTS", value: "100", unit: "%", sub: "topic-only previews, scene tried anyway", tone: "danger" };
  }
  if (frame < B3) {
    return { eyebrow: "HAD A SCENE", value: "<50", unit: "%", sub: "Matte, word cards, plan topics — random pick", tone: "danger" };
  }
  if (frame < B4) {
    return { eyebrow: "IN A ROW", value: "3+", sub: "plain cards before a scripted one lands", tone: "danger" };
  }
  if (frame < B5) {
    return { eyebrow: "SCENE COVERAGE", value: "2", unit: "×", sub: "daily automated run", tone: "accent" };
  }
  return { eyebrow: "NO REPEAT WINDOW", value: "45", unit: "min", sub: "kiosk walk, never repeats a scene", tone: "success" };
};

const HeroNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;
  const c = heroFor(frame);
  const toneColor = c.tone === "danger" ? P.danger : c.tone === "success" ? P.success : P.accent;
  const boundaries = [B1, B2, B3, B4, B5];
  const at = boundaries.filter((b) => frame >= b).pop() ?? B1;
  const scale = punchScale(sec(frame, at + 4, fps), 0);

  return (
    <Arrive at={B1 + 4} kind="wipe" box={HERO} dur={0.45}>
      <div
        style={{
          position: "absolute",
          left: HERO.x,
          top: HERO.y,
          width: HERO.w,
          height: HERO.h,
          background: P.card,
          borderBottom: `3px solid ${P.border}`,
          boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          fontFamily,
          overflow: "visible",
        }}
      >
        <div style={{ width: 340, paddingLeft: 48, fontSize: 17, fontWeight: 800, letterSpacing: 2, color: toneColor, lineHeight: 1.3 }}>
          {c.eyebrow}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "baseline", transform: `scale(${scale})` }}>
          <span style={{ fontSize: 200, fontWeight: 800, color: P.ink, lineHeight: 1 }}>{c.value}</span>
          {c.unit && <span style={{ fontSize: 56, fontWeight: 800, color: toneColor, marginLeft: 8 }}>{c.unit}</span>}
        </div>
        <div style={{ width: 340, paddingRight: 48, fontSize: 16, fontWeight: 600, color: P.muted, textAlign: "right", lineHeight: 1.3 }}>
          {c.sub}
        </div>
      </div>
    </Arrive>
  );
};

/** One-beat brand plate — names the product in plain words, b1 only. */
const BrandPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B2) return null;
  return (
    <Arrive at={B1 + 6} kind="rise" box={{ x: 40, y: 640, w: 500, h: 56 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 640,
          width: 500,
          height: 56,
          background: P.card,
          borderRadius: 4,
          boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, color: P.accent, letterSpacing: 1.4 }}>BOYTASKS</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: P.muted, marginLeft: 10 }}>
          screen-time &amp; task system for 3 kids
        </span>
      </div>
    </Arrive>
  );
};

const kioskLines: LogLine[] = [
  { t: "14:02", text: "try Matte → topic only, no scene", tone: "danger" },
  { t: "14:02", text: "try Word cards → topic only, no scene", tone: "danger" },
  { t: "14:02", text: "try Plan topics → topic only, no scene", tone: "danger" },
  { t: "14:03", text: "try Drill: addition → scene found", tone: "success" },
  { t: "14:03", text: "shown 18m ago → skip (repeat <45m)", tone: "danger" },
  { t: "14:03", text: "try Drill: subtraction → scene found", tone: "success" },
  { t: "14:03", text: "last shown 52m ago → pick it", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — a topic name is not a scene, the writer tried anyway */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "A topic name is not a scene",
          line2: "yet the writer tried anyway",
          keywords: ["topic name", "tried anyway"],
        }}
      />
      <BrandPlate />

      {/* b2 — other cards got a scene less than half the time, at random */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          statement: "A scene, less than half the time",
          tags: ["Matte", "Word cards", "Plan topics", "Random pick"],
        }}
      />

      {/* b3 — several plain cards before a scripted one ever appeared */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["Plain card", "Plain card", "Plain card"],
          result: "Scripted scene, eventually",
        }}
      />

      {/* b4 — the writer skips now, Cloudflare Workers doubles scene coverage */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page4" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Writes a scene regardless",
          to: "Skips, then doubles coverage",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["No scene for topic-only subjects", "Cloudflare Workers daily run", "2x scenes for old drill types"],
        }}
      />

      {/* b5 — the kiosk hunts for a card with a scene, no repeat within 45 min (no live page — gate rule) */}
      <LogWindow
        lines={kioskLines}
        title="kiosk-walk"
        from={B5 + 20}
        every={20}
        opacity={tween(sec(frame, B5, fps), 0, 0.3, ease.power2Out)}
      />

      <HeroNumber />
    </AbsoluteFill>
  );
};

export const FeatureScenesLearnWhenSkipB94: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
