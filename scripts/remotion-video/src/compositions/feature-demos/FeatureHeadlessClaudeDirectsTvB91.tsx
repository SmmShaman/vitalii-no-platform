// FeatureHeadlessClaudeDirectsTvB91 — feature b91 — 1280x720, 808 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: Boytasks — a screen-time and task system for three kids (Cloudflare
// Workers + Supabase). None of tonight's supplied commits (scripted-scenes work)
// match this feature's own sentences (they describe specific exercise types, not
// the authoring pipeline itself), so every beat is either a real recording of the
// feature's own page/hub (STEP 0c) or drawn (no commit is shown).
//
// Beat → effect (data only from the feature row: problem_en / solution_en / result_en):
// b1 15-258   "every new lesson meant hand-coding a new React screen, no way to
//             check it matched the lesson first"
//             keywordCaption over the feature's own page (shot "page").
// b2 258-444  "now a lesson is a script — timed steps an AI puts together on
//             its own" — cornerTags over the features hub (shot "hub"), the
//             hub's own card grid standing in for "many lessons, one system".
//             The clip's one tech-credibility caption ("Claude") sits top-right.
// b3 444-633  "every script is checked twice — before the wall accepts it, and
//             again on the screen itself" — handoffExplain over the feature's
//             own page, scrolled further (shot "page2").
// b4 633-808  "three to eight" — the result. No page, no hub (gate 2): the
//             flow-map's last node lights up, a hero count 3 -> 8 and a
//             LogWindow with the feature's own verification numbers — this
//             product keeps no runtime log on the VPS, so nothing here is
//             invented.
//
// Persistent element (archetype 4): a flow-map lower third, four nodes (Hand-
// coded -> Script written -> AI assembles -> Checked twice), alive from frame
// 15 to the end. The connecting line fills node to node as the beats advance;
// the active node is lit, in front of whatever effect is playing above it.
import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/b91.json";

const B1 = 15;
const B2 = 258;
const B3 = 444;
const B4 = 633;
const END = 808;

/** Tuned lighter than violet's base accent so it still reads on the dark plate. */
const ACCENT = "#B98BFF";
const STAGE = "#130F1C";

const clampOpts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const LT = { x: 40, y: 606, w: 1200, h: 92 };
const FLOW_LABELS = ["HAND-CODED", "SCRIPT WRITTEN", "AI ASSEMBLES", "CHECKED TWICE"];

const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const n = FLOW_LABELS.length;
  const gap = LT.w / n;
  const nodeCx = (i: number) => gap * (i + 0.5);

  const activeIndex = frame < B2 ? 0 : frame < B3 ? 1 : frame < B4 ? 2 : 3;
  const progress = interpolate(frame, [B1, B2, B3, B4, END], [0, 1, 2, 3, 3], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const lineX0 = nodeCx(0);
  const lineX1 = nodeCx(n - 1);
  const fillX = lineX0 + (progress / (n - 1)) * (lineX1 - lineX0);

  return (
    <div style={{ position: "absolute", left: LT.x, top: LT.y, width: LT.w, height: LT.h, fontFamily }}>
      <div style={{ position: "absolute", left: 0, top: 30, width: LT.w, height: 4, background: P.border, borderRadius: 2 }} />
      <div
        style={{
          position: "absolute",
          left: lineX0,
          top: 30,
          width: Math.max(0, fillX - lineX0),
          height: 4,
          background: P.accent,
          borderRadius: 2,
        }}
      />
      {FLOW_LABELS.map((label, i) => {
        const on = i <= activeIndex;
        const isActive = i === activeIndex;
        const dotSize = isActive ? 24 : 16;
        const color = !on ? P.muted : isActive ? P.accent : P.success;
        return (
          <div key={label} style={{ position: "absolute", left: nodeCx(i) - 90, top: 0, width: 180, textAlign: "center" }}>
            <div
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: "50%",
                background: color,
                margin: `${28 - dotSize / 2}px auto 0`,
                boxShadow: isActive ? `0 0 0 6px ${P.accentBg}` : "none",
              }}
            />
            <div style={{ marginTop: 10, fontSize: isActive ? 15 : 12, fontWeight: 800, letterSpacing: 1, color: isActive ? "#fff" : P.muted }}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HERO_STOPS = [B4, B4 + 40];
const HeroCount: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B4) return null;
  const value = Math.round(interpolate(frame, HERO_STOPS, [3, 8], { ...clampOpts, easing: Easing.out(Easing.cubic) }));
  const color = interpolateColors(frame, HERO_STOPS, [P.muted, P.success]);
  return (
    <div style={{ position: "absolute", left: 0, top: 54, width: 1280, textAlign: "center", fontFamily }}>
      <div style={{ fontSize: 150, fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {frame < B4 + 20 ? 3 : value}
        <span style={{ fontSize: 60, fontWeight: 700, color: P.muted, margin: "0 14px" }}>{"→"}</span>
        {value === 8 ? 8 : value}
      </div>
      <div style={{ marginTop: 10, fontSize: 20, fontWeight: 800, letterSpacing: 2, color: "#fff" }}>LESSON TYPES, ONE WEEK</div>
    </div>
  );
};

const LOG_LINES = [
  { t: "01", text: "hand-coded exercise types: 3 -> 8", tone: "success" as const },
  { t: "02", text: "each script: 5 timed beats", tone: "accent" as const },
  { t: "03", text: "AI session assembles beats -> scene", tone: "ink" as const },
  { t: "04", text: "pre-check: wall accepts script", tone: "success" as const },
  { t: "05", text: "post-check: screen re-verifies it", tone: "success" as const },
  { t: "06", text: "newest 5 types: zero hand code", tone: "accent" as const },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ line1: "Every new lesson meant", line2: "hand-coding a new screen.", keywords: ["hand-coding", "new screen"] }}
      />

      {/* b2 — the fix (a lesson is now a script), over the hub's own card grid */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{ statement: "Lessons are now scripts", tags: ["Timed steps", "AI-assembled", "No hand code"] }}
      />
      {frame >= B2 && frame < B3 && (
        <div style={{ position: "absolute", left: 1040, top: 36, opacity: cut(frame, B2, B3) }}>
          <StatPill x={0} y={0} emoji="🤖" text="Claude" tone="accent" fontSize={16} />
        </div>
      )}

      {/* b3 — the double-check, scrolled further down the same page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Written once, hoped it worked",
          to: "Checked twice, every time",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Before the wall accepts it", "Again on the screen itself"],
        }}
      />

      {/* b4 — the result: no page, no hub (gate 2) — the real verification numbers instead */}
      {frame >= B4 && (
        <LogWindow
          lines={LOG_LINES}
          title="verify-scenes.log"
          from={B4 + 46}
          every={22}
          opacity={1}
          win={{ x: 340, y: 240, w: 600, h: 330 }}
          fontSize={20}
        />
      )}
      <HeroCount />

      <FlowMap />
    </AbsoluteFill>
  );
};

export const FeatureHeadlessClaudeDirectsTvB91: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
