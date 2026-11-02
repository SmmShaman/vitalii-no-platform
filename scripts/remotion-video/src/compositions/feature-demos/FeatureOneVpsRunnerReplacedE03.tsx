// FeatureOneVpsRunnerReplacedE03 — feature e03 — 1280x720, 973 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood sand. RE-SHOOT (feature-motion skill, 2026-11-02):
// same beats, same sentences, same page/hub backdrops — only the staging changed,
// from a timeline ribbon to a split-duel divider.
//
// The Divider is the persistent, frame-dominating object: a bright vertical line
// splits the stage into a shrinking CHAOS half (left, danger-tinted — the three
// fragile services) and a growing ORDER half (right, success-tinted — the one VPS
// runner), with a short text label living inside each half, never centered. The
// line holds far right through b1 (order is "not built yet", a thin sliver), slides
// to center as the fix lands in b2, holds through b3/b4 while the mechanism is
// explained, then slides almost fully off-screen left in b5 as chaos disappears and
// order wins the whole frame — the payoff is the divider itself, not just a caption.
// Deleting the Divider leaves no duel to read, so it never becomes decoration.
//
// No commit is shown: 134cd47 (Supabase hardening) and 86095d3 (Android TWA) match
// neither beat, and fef7168 (the AI runner replacing Azure/Zvukogram/Stanza) covers
// b1+b2 broadly but not any one sentence precisely enough for a 2.0-2.4x diff zoom —
// so b1/b2 keep the feature's own page/hub as real evidence, same as the original
// cut, and b3-b5 draw the mechanism instead of forcing a diff that doesn't fit.
//
// No LogWindow: this product keeps no runtime log on the VPS, and the real page/hub
// backdrops already cover "show the real product" for b1/b2 — a synthetic log would
// cost a beat better spent on the duel resolving.
//
// Beat -> effect:
// b1 15-321   problem: three outside services, any one breaking stalls a lesson.
//             titleTakeover over the feature's own page (backdrop). Divider holds
//             far right (1120) — order is a bare 160px "not built yet" sliver.
// b2 321-431  the fix lands: one VPS runner replaces all three.
//             handoffExplain over the features hub (backdrop). Divider slides
//             1120 -> 420 as it plays.
// b3 431-588  analogy: every back door closed, every sale passes the till.
//             keywordCaption, drawn — plus a literal schematic: three doors shut
//             inside the chaos half, a till appears inside the order half.
// b4 588-770  mechanism: the three old dependencies route into the one hub, which
//             routes out to analysis, playlist generation and billing.
//             hubRouting, drawn. Divider holds at 420.
// b5 770-973  payoff: ~1800 lines of fragile code deleted for good.
//             ratioBars, 1796 vs 682 lines — drawn, holds to the true end. Divider
//             slides 420 -> -40, chaos fully gone, order owns the frame.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/e03.json";

const B1 = 15;
const B2 = 321;
const B3 = 431;
const B4 = 588;
const B5 = 770;
const END = 973;

/** sand's native accent (#B4531F) reads muddy on a dark stage — brightened for it. */
const ACCENT = "#F2994A";
const STAGE = "#1C140B";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Divider position: holds far right through b1, slides to center for b2, holds
// through b3/b4, then slides almost off-screen left through b5.
const dividerXAt = (frame: number, fps: number) => {
  if (frame < B2) return 1120;
  if (frame < B3) return mix(tween(sec(frame, B2, fps), 0, (B3 - B2) / fps, ease.power3Out), 1120, 420);
  if (frame < B5) return 420;
  return mix(tween(sec(frame, B5, fps), 0, (END - B5) / fps, ease.power3Out), 420, -40);
};

const LEFT_TEXT: { at: number; text: string }[] = [
  { at: B1, text: "3 FRAGILE SERVICES" },
  { at: B2, text: "SHUTTING DOWN" },
  { at: B3, text: "DOORS CLOSED" },
  { at: B4, text: "OLD DEPENDENCIES" },
  { at: B5, text: "1,796 LINES, GONE" },
];
const RIGHT_TEXT: { at: number; text: string }[] = [
  { at: B1, text: "NOT BUILT YET 🚧" },
  { at: B2, text: "ONE VPS RUNNER" },
  { at: B3, text: "EVERY SALE → TILL" },
  { at: B4, text: "3 NEW JOBS" },
  { at: B5, text: "682 LINES" },
];
const textAt = (list: { at: number; text: string }[], frame: number) => {
  let cur = list[0].text;
  for (const item of list) {
    if (frame >= item.at) cur = item.text;
    else break;
  }
  return cur;
};

// DividerWash — the full-bleed chaos/order color split. Only drawn once b1/b2's
// live backdrops are gone (b3 onward), so it never fights the real recording.
const DividerWash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B3) return null;
  const x = Math.max(dividerXAt(frame, fps), 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: x, height: 720, background: P.dangerBg }} />
      <div style={{ position: "absolute", left: x, top: 0, width: 1280 - x, height: 720, background: P.successBg }} />
    </div>
  );
};

// The bright glowing line itself — always on top, through every beat, live or drawn.
const DividerLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < B1) return null;
  const x = dividerXAt(frame, fps);
  if (x < -30 || x > 1310) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 2,
        top: 0,
        width: 5,
        height: 720,
        background: ACCENT,
        boxShadow: `0 0 24px 6px ${ACCENT}`,
      }}
    />
  );
};

// The per-beat label living inside each half — never centered, always tracking the line.
const DividerLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;
  const x = dividerXAt(frame, fps);
  const leftText = textAt(LEFT_TEXT, frame);
  const rightText = textAt(RIGHT_TEXT, frame);
  const leftW = Math.max(Math.min(340, x - 40), 0);
  const rightW = Math.max(Math.min(340, 1280 - x - 40), 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {leftW > 30 && (
        <div
          style={{
            position: "absolute",
            left: Math.max(x - leftW - 20, 10),
            top: 616,
            width: leftW,
            textAlign: "right",
            fontSize: leftW < 160 ? 12 : 16,
            fontWeight: 800,
            letterSpacing: 1,
            color: P.danger,
          }}
        >
          {leftText}
        </div>
      )}
      {rightW > 30 && (
        <div
          style={{
            position: "absolute",
            left: Math.min(x + 20, 1280 - rightW - 10),
            top: 616,
            width: rightW,
            textAlign: "left",
            fontSize: rightW < 160 ? 12 : 16,
            fontWeight: 800,
            letterSpacing: 1,
            color: P.success,
          }}
        >
          {rightText}
        </div>
      )}
    </div>
  );
};

// b1's three services, stacked inside the chaos half, grey out once b2 lands.
const CHIPS = [
  { label: "AZURE", seed: 0 },
  { label: "ZVUKOGRAM", seed: 2.1 },
  { label: "STANZA", seed: 4.4 },
];

const SubChips: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 || frame >= B3) return null;
  const t = sec(frame, B1, fps);
  const dimmed = frame >= B2;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {CHIPS.map((c, i) => (
        <div
          key={c.label}
          style={{
            position: "absolute",
            left: 170,
            top: 170 + i * 34 + Math.sin(t * 2.4 + c.seed) * 2.5,
            padding: "5px 10px",
            borderRadius: 5,
            background: dimmed ? P.chipBg : P.dangerBg,
            border: `1px solid ${dimmed ? P.border : P.dangerEdge}`,
            color: dimmed ? P.muted : P.danger,
            fontSize: 12,
            fontWeight: 700,
            opacity: dimmed ? 0.5 : 1,
          }}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
};

const PLATE_BOX = { x: 60, y: 48, w: 640, h: 86 };

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
          border: `2px solid ${P.accentEdge}`,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          boxSizing: "border-box",
          padding: "10px 20px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.2, color: P.accent }}>🛠 ELVARIKA — TEXT BECOMES A LESSON</div>
        <div style={{ fontSize: 13, color: P.muted, marginTop: 4, lineHeight: 1.3 }}>
          Paste or upload any text — Elvarika turns it into vocabulary and audio playlists.
        </div>
      </div>
    </Arrive>
  );
};

// The shop/till analogy, drawn literally: doors shut inside the chaos half,
// a till appears inside the order half — the schematic lives in the archetype.
const DoorTillSchematic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B3, B4) !== 1) return null;
  const t = sec(frame, B3, fps);
  const doors = ["AZURE", "ZVUKOGRAM", "STANZA"];
  const doorW = 100;
  const gap = 14;
  const totalW = doors.length * doorW + (doors.length - 1) * gap;
  const startX = 190 - totalW / 2;
  const doorY = 260;
  const doorH = 90;
  const tillCloseAt = 0.4 + (doors.length - 1) * 0.5 + 0.5;
  const tillP = tween(t, tillCloseAt, 0.35, ease.power3Out);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      {doors.map((label, i) => {
        const closeAt = 0.4 + i * 0.5;
        const closeP = tween(t, closeAt, 0.4, ease.power3Out);
        const x = startX + i * (doorW + gap);
        return (
          <div key={label} style={{ position: "absolute", left: x, top: doorY, width: doorW, height: doorH }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 8,
                border: `3px solid ${closeP > 0.5 ? P.border : P.dangerEdge}`,
                background: closeP > 0.5 ? P.chipBg : P.dangerBg,
                boxSizing: "border-box",
                transform: `scaleX(${mix(closeP, 1, 0.08)})`,
                transformOrigin: "left center",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -24,
                textAlign: "center",
                fontFamily,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.6,
                color: closeP > 0.5 ? P.muted : P.danger,
              }}
            >
              {label}
            </div>
            {closeP > 0.85 && (
              <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔒</div>
            )}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 850 - 110,
          top: 270,
          width: 220,
          height: 70,
          borderRadius: 8,
          background: P.successBg,
          border: `3px solid ${P.successEdge}`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: tillP,
          transform: `scale(${mix(tillP, 0.85, 1)})`,
          fontFamily,
        }}
      >
        <span style={{ fontSize: 20 }}>🧾</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: P.success, letterSpacing: 0.6 }}>EVERY SALE → TILL</span>
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      {/* b2 — the fix lands, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}

      <DividerWash />

      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.82}
        data={{
          title: "Three outside services, one point of failure",
          kicker: "If one broke, a lesson stalled mid-word — and a gap let requests skip payment",
        }}
      />

      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.82}
        data={{
          from: "Azure + Zvukogram + Stanza",
          to: "One VPS we control",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Lesson checks", "Playlist audio", "Billing"],
        }}
      />

      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.18}
        data={{
          line1: "Every back door closed — every sale passes the till.",
          keywords: ["door", "till"],
        }}
      />
      <DoorTillSchematic />

      <MotionInsert
        effect="hubRouting"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.18}
        data={{
          inputs: ["Azure analysis", "Zvukogram TTS", "Stanza NLP"],
          hub: "VPS runner",
          outputs: ["Analysis", "Playlist gen", "Billing"],
        }}
      />

      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.18}
        data={{
          title: "Code deleted",
          a: { label: "Old edge functions", value: 1796 },
          b: { label: "New runner", value: 682 },
          unit: "lines",
          caption: "Three services, one file",
        }}
      />

      <DividerLine />
      <DividerLabels />
      <SubChips />
      <ProductPlate />
    </AbsoluteFill>
  );
};

export const FeatureOneVpsRunnerReplacedE03: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
