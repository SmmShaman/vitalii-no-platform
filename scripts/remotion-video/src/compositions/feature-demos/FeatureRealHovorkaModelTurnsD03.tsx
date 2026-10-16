// FeatureRealHovorkaModelTurnsD03 — feature d03 — 1280x720, 873 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// RE-SHOOT (2026-10-16): narration and beat windows kept exactly from the prior cut;
// only the picture changes. The prior cut used archetype 7 hero-number / mood dawn and
// leaned on a GitHub commit screenshot for its b4 evidence — tonight's verified-URL
// list has no GitHub page for this repo, so that LiveWindow is gone. The commit's own
// message is now text evidence only, quoted inside a drawn effect, never a live diff
// (same rule used for b67 tonight).
//
// Archetype 0 (split-duel): a danger-toned "GENERIC BODY" panel (left) against a
// success-toned "REAL HOVORKA MODEL" panel (right) in the lower third (y>=606),
// divided by a slider that starts generic-dominant and slides to model-dominant
// exactly when the fix lands at b3 — the sentence where Artem's dad builds the game
// on a real Hovorka model instead of a generic one. Same geometry as d04's lower
// third (feature-motion skill convention).
//
// Beat -> picture (data only from the feature's own text; of the three given commits
// — 02ed872, f3234bf, df2d642 — only 02ed872's message matches a beat's sentence, so
// only it is quoted, in b4, as text, never a live diff):
// b1 15-154   "Artem's parents wanted him to learn about his diabetes by playing a
//             game." keywordCaption over LiveBackdrop "page". A product plate names
//             the Insulin Simulator once. Duel wipes in, generic-dominant.
// b2 154-336  "But every simulator online used a generic kid's body — nothing
//             matched his real doses." cornerTags, same continuous "page" recording
//             (no restart). Duel panels update their facts, still generic-dominant.
// b3 336-488  "So his dad built the game on a real Hovorka model instead of a generic
//             one." handoffExplain, drawn (no public page for the model build itself).
//             THE FIX: duel divider slides to model-dominant here, with a punch.
// b4 488-661  "It's tuned to Artem's own insulin, his own weight, like a tutor who
//             already read his chart." pipelineFlow, drawn — quotes 02ed872's own
//             commit message as the system line (text evidence only, no live diff).
// b5 661-873  "Now the glucose curves match sheet 08.10 — his own doctor's
//             worksheet." Fully drawn: a LogWindow (t1d-model.js, the model's own
//             real facts) plus the duel's right panel landing on "MATCH: SHEET
//             08.10". Holds to END at full brightness. Neither the feature page nor
//             the hub appears in this beat.
//
// Persistent element: the split-duel lower third (archetype 0), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/d03.json";

const B1 = 15;
const B2 = 154;
const B3 = 336;
const B4 = 488;
const B5 = 661;
const END = 873;

/** Accent tuned for the dark stage (violet's own #5B37D4 reads muddy on #10151D). */
const ACCENT = "#8B7CF6";
const STAGE = "#10151D";

// Lower third geometry — same band as d04's split-duel reference (y>=606, safe-bottom clear above).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** Archetype 0 (split-duel): a generic-vs-real-model duel that slides to the win at b3. */
const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const shift = tween(sec(frame, B3, fps), 0, 0.6, ease.power3InOut);
  const genericFrac = frame >= B3 ? mix(shift, 0.76, 0.2) : 0.76;
  const dividerX = LT.x + genericFrac * LT.w;

  const genericLine = frame < B2 ? "Not his own numbers" : "Didn't match his real doses";
  const modelLine = frame < B4 ? "Built by his dad" : frame < B5 ? "Tuned to his weight + insulin" : "MATCH: SHEET 08.10";

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: dividerX - LT.x,
            height: LT.h,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            borderRadius: 4,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "absolute", left: 16, top: 10, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.danger, whiteSpace: "nowrap" }}>
            👤 GENERIC BODY
          </div>
          <div style={{ position: "absolute", left: 16, top: 36, fontSize: 14, fontWeight: 700, color: P.ink, whiteSpace: "nowrap" }}>{genericLine}</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: dividerX,
            top: LT.y,
            width: LT.x + LT.w - dividerX,
            height: LT.h,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            borderRadius: 4,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "absolute", left: 16, top: 10, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.success, whiteSpace: "nowrap" }}>
            🩺 HOVORKA MODEL
          </div>
          <div style={{ position: "absolute", left: 16, top: 36, fontSize: 14, fontWeight: 700, color: P.ink, whiteSpace: "nowrap" }}>{modelLine}</div>
        </div>
        <div style={{ position: "absolute", left: dividerX - 2, top: LT.y, width: 4, height: LT.h, background: P.ink }} />
      </Arrive>

      {cut(frame, B1, B2) === 1 && (
        <Arrive at={B1 + 20} kind="rise" box={{ x: LT.x + 16, y: LT.y - 48, w: 300, h: 34 }}>
          <div
            style={{
              position: "absolute",
              left: LT.x + 16,
              top: LT.y - 48,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0.4,
              color: P.ink,
              background: P.card,
              border: `2px solid ${P.border}`,
              borderRadius: 4,
              padding: "5px 12px",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
            }}
          >
            INSULIN SIMULATOR
          </div>
        </Arrive>
      )}
    </div>
  );
};

/** b5 — the result, fully drawn: LogWindow with the model's own real facts. Holds to END. */
const LOG_LINES: Array<{ text: string; tone?: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { text: "loading t1d-model.js (Hovorka, per kg)…", tone: "muted" },
  { text: "NovoRapid + Levemir absorption curves ready", tone: "ink" },
  { text: "correction dose rounded to 0.5 units", tone: "ink" },
  { text: "4 missions run on Artem's own 24h day", tone: "accent" },
  { text: "glucose curve checked vs sheet 08.10", tone: "success" },
  { text: "match: his own doctor's worksheet", tone: "success" },
];

const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const captionIn = tween(t, 1.3, 0.3, ease.power2Out);
  return (
    <>
      <LogWindow
        lines={LOG_LINES}
        title="t1d-model.js"
        from={B5 + 14}
        every={16}
        opacity={1}
        win={{ x: 680, y: 56, w: 540, h: 470 }}
        fontSize={18}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 100,
          width: 540,
          fontSize: 24,
          fontWeight: 700,
          color: "#E6ECFA",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Not a generic textbook body — his own doctor&apos;s numbers, running in the game.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1+b2 — the human problem, then the generic-body facts, over the feature's own page (continuous recording, no restart) */}
      {cut(frame, B1, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B3 - B1} push={0.03} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        base={STAGE}
        plate={0.78}
        data={{ line1: "A game,", line2: "not a textbook.", keywords: ["game", "textbook"] }}
      />

      {/* b2 — every simulator used a generic body, same continuous backdrop */}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        plate={0.78}
        data={{
          statement: "Every simulator used a generic body",
          tags: ["Generic carb ratios", "Generic corrections", "Didn't match his real doses"],
        }}
      />

      {/* b3 — the fix: a real Hovorka model, drawn only (invisible plumbing, no public page) */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        plate={0.78}
        data={{
          from: "Generic simulator body",
          to: "Real Hovorka model",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Tuned to his own weight", "Per-kg insulin math", "Built by his dad"],
        }}
      />

      {/* b4 — tuned to Artem's own insulin and weight: the one matching commit, quoted as text, never a live diff */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0.78}
        data={{
          steps: ["Calibrate to his weight", "Match NovoRapid + Levemir doses", "Run his real day"],
          result: "Tutor who already read the chart",
          system: 'commit 02ed872 — "realistic Artem\'s day and missions on a calibrated type 1 body"',
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureRealHovorkaModelTurnsD03: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
