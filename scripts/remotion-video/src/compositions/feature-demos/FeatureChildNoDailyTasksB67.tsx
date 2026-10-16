// FeatureChildNoDailyTasksB67 — feature b67 — 1280x720, 935 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Myron has no daily tasks yet — he's too young for homework — but the YouTube
// gate's rule was "all tasks done, or no TV", checked the same way for every
// kid. With zero tasks assigned, the Cloudflare Worker could never find him
// "done", so he was blocked anyway. The fix: a kid with zero tasks is now
// exempt from the gate entirely, while a parent can still lock the house down.
// Myron now opens the TV himself with his own PIN — no homework needed, even
// at grade zero.
//
// Archetype 7 (hero-number): a giant "0" — his own task count — is the one
// element that survives every beat, the way p15's "40% -> <5%" owned its clip.
// The digit itself never changes (it is always zero tasks), but its colour and
// the line beside it flip from danger to success exactly when the fix lands,
// and the final beat lands the digit beside the word "exempt".
//
// Beat -> effect (data only from the feature row; no GitHub page was verified
// reachable tonight, so the three commits are drawn from their own messages,
// never shown as a live diff):
// b1 15-202   "chores to finish" cornerTags over the feature's own page.
// b2 202-370  "all tasks done, or no TV" keywordCaption, page scrolled further
//             (page2).
// b3 370-539  "could never pass" pipelineFlow — the Worker's own check, 0 of 0,
//             still blocked (page3). Cloudflare Worker is the clip's one tech
//             name, named right on the pipeline frame.
// b4 539-701  "now kids with no tasks are exempt" handoffExplain, backdrop
//             scrolled to the features hub (no second verified page for this
//             feature).
// b5 701-935  drawn result: a LogWindow built from the feature's own facts,
//             plus the hero digit settling on "exempt"; holds to the end.
//
// Persistent element: the hero "0" (archetype 7), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/b67.json";

const B1 = 15;
const B2 = 202;
const B3 = 370;
const B4 = 539;
const B5 = 701;
const END = 935;

/** Accent tuned for the dark stage (mint's #0B7A5A is too dark on a plate). */
const ACCENT = "#5EEAB0";
const STAGE = "#0D1A15";

// Hero band geometry (1280x720) — wide and tall, not a corner badge.
const HERO = { x: 40, y: 452, w: 1200, h: 252 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LABELS = [
  "0 tasks assigned — blocked anyway",
  "Rule: all tasks done, or no TV",
  "0 of 0 — the Worker still says no",
  "0 tasks → exempt, gate skipped",
  "Grade zero. His own PIN. TV unlocked.",
];
const ICONS = ["🔒", "🔒", "🔒", "🔓", "✅"];

/** Archetype 7 (hero-number): a giant, unchanging "0" that flips danger->success once. */
const HeroZero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const starts = [B1, B2, B3, B4, B5];
  let idx = 0;
  for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) idx = i;
  const beatStart = starts[idx];
  const pulse = punchScale(sec(frame, beatStart, fps), 0);
  const tone = idx <= 2 ? P.danger : P.success;

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
          borderRadius: 6,
          boxShadow: "8px 8px 0 rgba(0,0,0,0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: HERO.x + 36,
          top: HERO.y + 14,
          fontSize: 220,
          fontWeight: 900,
          lineHeight: 1,
          color: tone,
          transform: `scale(${pulse})`,
          transformOrigin: "left center",
          fontFamily,
        }}
      >
        0
      </div>
      <div
        style={{
          position: "absolute",
          left: HERO.x + 36,
          top: HERO.y + 206,
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 2.2,
          color: P.muted,
          fontFamily,
        }}
      >
        TASKS TODAY
      </div>
      <div style={{ position: "absolute", left: HERO.x + 330, top: HERO.y + 56, width: 780 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent, fontFamily }}>
          BOYTASKS — YOUTUBE GATE
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: P.ink,
            marginTop: 12,
            fontFamily,
          }}
        >
          {ICONS[idx]} {LABELS[idx]}
        </div>
      </div>
    </Arrive>
  );
};

/** First beat only: names the product in one plain line, per the viewer test. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 2} kind="rise" box={{ x: 40, y: 40, w: 600, h: 60 }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          padding: "12px 20px",
          borderRadius: 6,
          background: "rgba(8,8,8,0.72)",
          border: `1.5px solid ${ACCENT}`,
          fontSize: 20,
          fontWeight: 700,
          color: "#F4FFF9",
          fontFamily,
        }}
      >
        Boytasks — screen-time &amp; task gate
      </div>
    </Arrive>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — the problem: the gate still treats a chore-free child like he owes work */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          statement: "Gate still says: finish your chores",
          tags: ["0 tasks assigned", "Too young for homework", "Checked the same way", "Blocked anyway"],
        }}
      />
      <ProductPlate />

      {/* b2 — the rule: one rule for every child, no matter how many tasks they have */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{ line1: "All tasks done,", line2: "or no TV.", keywords: ["all tasks done", "no TV"] }}
      />

      {/* b3 — the mechanism: the Worker's own check, 0 of 0, still a fail */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          steps: ["Count tasks done", "Compare to tasks assigned", "0 of 0 — still blocked"],
          result: "Access denied",
          system: "Cloudflare Worker: youtube-gate",
        }}
      />

      {/* b4 — the fix: zero tasks now means exempt, parent override untouched */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          from: "Same rule for everyone",
          to: "0 tasks = exempt now",
          points: ["No tasks, no gate check", "Parent lock still works", "Myron unlocks with his PIN"],
        }}
      />

      {/* b5 — the result: Myron's own PIN, shown running and as the hero line */}
      {frame >= B5 && (
        <LogWindow
          title="youtube-gate worker"
          from={B5}
          every={16}
          opacity={1}
          win={{ x: 60, y: 90, w: 1160, h: 340 }}
          fontSize={22}
          lines={[
            { t: "GATE", text: "youtube-gate worker: 0 tasks assigned", tone: "muted" },
            { t: "OLD", text: "rule: all tasks done, or no TV", tone: "danger" },
            { t: "BUG", text: "0 of 0 tasks — always blocked", tone: "danger" },
            { t: "FIX", text: "0-task kids now exempt", tone: "success" },
            { t: "LOCK", text: "parent override still active", tone: "muted" },
            { t: "MYRON", text: "grade zero, own PIN, TV unlocked", tone: "success" },
          ]}
        />
      )}

      <HeroZero />
    </AbsoluteFill>
  );
};

export const FeatureChildNoDailyTasksB67: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
