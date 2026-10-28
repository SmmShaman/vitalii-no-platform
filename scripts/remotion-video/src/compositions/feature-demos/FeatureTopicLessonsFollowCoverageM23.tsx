// FeatureTopicLessonsFollowCoverageM23 — feature m23 — 1280x720, 901 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
// RE-SHOOT 2026-10-28: narration and beat windows unchanged from the previous pass
// (archetype 2 zoom-in / mood slate); only the picture changes to a real card deck.
//
// Four cards ARE the story: b1 they sit in an identical, overlapping pile (the same
// point, repeated); b2 they fan out into a labelled row, one angle per card; b3 each
// gets a read-back checkmark in turn; b4 the thin one visibly flips to "Rewritten".
// At b5 the deck becomes a new, bigger grid of 16 line-cards, 10 lit, for the
// feature's own 10-of-16 result — the same "cards" language carried to its finale
// (gate 2: drawn only, never the feature page or hub, holds to the final frame).
//
// Beat → effect (data only from the feature row and commit 9ce565d):
// b1 15-182   "ask for a lesson on a tricky word, and it used to repeat the same point
//             every section" — titleTakeover over the feature's own page (small proof
//             window, corner). The deck pile dominates the centre of the frame.
// b2 182-385  "now it maps distinct angles first, like a teacher outlining chapters, then
//             writes one angle per section" — pipelineFlow + the deck fanning out. The
//             one tech gloss of the clip sits in pipelineFlow's own system label.
// b3 385-530  "every earlier section gets read back first, so no sentence repeats" —
//             funnelAbsorption, each fanned card gaining its checkmark in turn.
// b4 530-713  "the AI even checks its own work, and rewrites automatically if a word lesson
//             runs thin" — handoffExplain, one card flips; a LogWindow shows the product's
//             own target-word check running (no runtime log exists, lines built from the
//             feature's own numbers).
// b5 713-901  "that target word now shows up in at least 10 of every 16 lines" — the deck's
//             final form: a 4x4 grid of line-cards, 10 lit green, holds to the final frame.
//
// Persistent element: the card deck itself (archetype 3), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive, cut } from "./motion-primitives";
import { LiveWindow, LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/m23.json";

const B1 = 15;
const B2 = 182;
const B3 = 385;
const B4 = 530;
const B5 = 713;
const END = 901;

/** Accent brightened for the dark plate (dawn's own #2563EB reads a touch flat on it). */
const ACCENT = "#4C8DFF";
const STAGE = "#10182B";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const PROOF_WIN = { x: 760, y: 420, w: 460, h: 260 };

/** b1 — names the product in one plain line. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 3} kind="wipe" box={{ x: 40, y: 560, w: 560, h: 110 }} dur={0.35}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 560,
          width: 560,
          padding: "16px 22px",
          background: P.card,
          border: `2px solid ${P.border}`,
          borderRadius: 4,
          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
          fontFamily,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28, lineHeight: 1 }}>🎧</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Mini Elvarika — Norwegian by Ear</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 8, lineHeight: 1.35 }}>
          AI-written listening lessons, read back and checked automatically.
        </div>
      </div>
    </Arrive>
  );
};

/** b2-b4 — a short top ribbon restating what changes this beat, keeps the frame full. */
const TopRibbon: React.FC<{ text: string; from: number; dur: number }> = ({ text, from, dur }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, from, from + dur) !== 1) return null;
  return (
    <Arrive at={from + 3} kind="wipe" box={{ x: 140, y: 40, w: 1000, h: 56 }} dur={0.3}>
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 40,
          width: 1000,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: P.card,
          border: `2px solid ${P.border}`,
          borderRadius: 28,
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1.2, color: P.ink, fontFamily }}>{text}</div>
      </div>
    </Arrive>
  );
};

/** The archetype itself: 4 cards, pile → fan → checked → one flips. b1 through b4. */
const CARD_W = 170;
const CARD_H = 110;
const FAN_X = [264, 458, 652, 846];
const FAN_Y = 260;
const FAN_LABELS = ["Morning routine", "Ordering food", "Travel & transit", "Work & study"];

const AngleDeck: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B5) return null;

  const moveP = tween(sec(frame, B2, fps), 0, 0.6, ease.power3Out);

  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const k = i - 1.5;
        const pileX = 640 - CARD_W / 2 + k * 14;
        const pileY = 295 - CARD_H / 2 + k * 10;
        const pileRot = k * 6;

        const x = mix(moveP, pileX, FAN_X[i]);
        const y = mix(moveP, pileY, FAN_Y);
        const rot = mix(moveP, pileRot, 0);

        const label = frame >= B2 ? FAN_LABELS[i] : "Same point";
        const checkT = tween(sec(frame, B3 + 10 + i * 34, fps), 0, 0.3, ease.power2Out);

        let flipScale = 1;
        let shownLabel = label;
        if (i === 1 && frame >= B4) {
          const fp = tween(sec(frame, B4 + 15, fps), 0, 0.8, ease.power3InOut);
          flipScale = fp < 0.5 ? 1 - 2 * fp : 2 * (fp - 0.5);
          shownLabel = fp < 0.5 ? label : "Rewritten ✓";
        }

        return (
          <div
            key={i}
            style={{ position: "absolute", left: x, top: y, width: CARD_W, height: CARD_H, transform: `rotate(${rot}deg)` }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `scaleX(${flipScale})`,
                background: P.card,
                border: `2px solid ${P.border}`,
                borderRadius: 8,
                boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, fontFamily, lineHeight: 1.25 }}>{shownLabel}</div>
            </div>
            {checkT > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  top: -10,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: P.success,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  opacity: checkT,
                }}
              >
                ✓
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

/** b4 overlay — the product running, lines built from the feature's own 10-of-16 target. */
const RUNNER_LINES: LogLine[] = [
  { t: "04:02", text: "section 3 drafted", tone: "ink" },
  { t: "04:03", text: "target-word check: 6/16 lines", tone: "danger" },
  { t: "04:03", text: "below target → rewriting section 3", tone: "accent" },
  { t: "04:05", text: "section 3 rewritten", tone: "ink" },
  { t: "04:06", text: "target-word check: 11/16 lines", tone: "success" },
  { t: "04:06", text: "section 3 saved", tone: "success" },
];

/** b5 — the deck's final form: a 4x4 grid of 16 line-cards, 10 lit. Drawn only (gate 2). */
const GCARD_W = 170;
const GCARD_H = 105;
const GGAP = 20;
const GRID_X = (1280 - (4 * GCARD_W + 3 * GGAP)) / 2;
const GRID_Y = 120;

const LineGrid: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  return (
    <>
      {Array.from({ length: 16 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = GRID_X + col * (GCARD_W + GGAP);
        const y = GRID_Y + row * (GCARD_H + GGAP);
        const appearAt = B5 + 6 + i * 8;
        const p = tween(sec(frame, appearAt, fps), 0, 0.3, ease.power3Out);
        if (p <= 0.001) return null;
        const hit = i < 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + (1 - p) * 16,
              width: GCARD_W,
              height: GCARD_H,
              opacity: p,
              background: hit ? P.successBg : P.card,
              border: `2px solid ${hit ? P.success : P.border}`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 900,
              color: hit ? P.success : P.muted,
              fontFamily,
            }}
          >
            {hit ? "✓" : "—"}
          </div>
        );
      })}
    </>
  );
};

const ResultHeadline: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  const t = tween(sec(frame, B5 + 6, 30), 0, 0.4, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 140, top: 50, width: 1000, textAlign: "center", opacity: t, fontFamily }}>
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>THE RESULT</div>
    </div>
  );
};

const ResultCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  const t = tween(sec(frame, B5 + 16, 30), 0, 0.4, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 140, top: 640, width: 1000, textAlign: "center", opacity: t, fontFamily }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: P.ink }}>
        That target word now shows up in at least 10 of every 16 lines
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — the human problem: a pile of identical cards, same point repeated */}
      {cut(frame, B1, B2) === 1 && (
        <LiveWindow file={shotsFile} shot="page" title="vitalii.no/features" from={B1} hold={B2 - B1} opacity={1} win={PROOF_WIN} />
      )}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Same Point, Repeated", kicker: "Every section repeated the same point" }}
      />

      {/* b2 — the fix: the deck fans into distinct angles, one tech gloss on the frame */}
      {cut(frame, B2, B3) === 1 && (
        <LiveWindow file={shotsFile} shot="page2" title="vitalii.no/features" from={B2} hold={B3 - B2} opacity={1} win={PROOF_WIN} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["List distinct angles", "Assign one per section", "Write that angle only"],
          result: "No angle repeats",
          system: "Coverage plan = angles outlined like chapters",
        }}
      />
      <TopRibbon text="COVERAGE PLAN: ONE ANGLE PER SECTION" from={B2} dur={B3 - B2} />

      {/* b3 — every earlier section is read back first, each card checked in turn */}
      {cut(frame, B3, B4) === 1 && (
        <LiveWindow file={shotsFile} shot="hub" title="vitalii.no/features" from={B3} hold={B4 - B3} opacity={1} win={PROOF_WIN} />
      )}
      <MotionInsert
        effect="funnelAbsorption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{ inputs: ["Section 1", "Section 2", "Section 3"], result: "No sentence repeats" }}
      />
      <TopRibbon text="READ-BACK CHECK: NO REPEATED SENTENCES" from={B3} dur={B4 - B3} />

      {/* b4 — the self-check and automatic rewrite; one card flips, the runner shown live */}
      {cut(frame, B4, B5) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="hub"
          title="vitalii.no/features"
          from={B4}
          hold={B5 - B4}
          focus={{ x: 0.6, y: 0.4 }}
          opacity={1}
          win={PROOF_WIN}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "First draft of a section",
          to: "Automatic rewrite if thin",
          points: ["Checks target-word count", "Rewrites if below target", "Section stays strong"],
        }}
      />
      <TopRibbon text="SELF-CHECK: REWRITE IF A SECTION RUNS THIN" from={B4} dur={B5 - B4} />
      {cut(frame, B4, B5) === 1 && (
        <LogWindow
          lines={RUNNER_LINES}
          title="lesson-runner"
          from={B4 + 10}
          every={18}
          opacity={1}
          win={{ x: 40, y: 420, w: 460, h: 260 }}
          fontSize={20}
        />
      )}

      {/* the archetype: 4 cards, pile → fan → checked → flip, b1 through b4 */}
      <AngleDeck fps={fps} />

      {/* b5 — the deck's final form, drawn only (gate 2), holds to the final frame */}
      <LineGrid fps={fps} />
      <ResultHeadline />
      <ResultCaption />

      <ProductPlate />
    </AbsoluteFill>
  );
};

export const FeatureTopicLessonsFollowCoverageM23: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
