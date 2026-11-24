// FeatureExplainerVideosStopPaddingB108 — feature b108 — 1280x720, 889 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A deck of four "shot" cards flies in and stacks through b1-b3 (the old timeline piling padded
// shots on top of each other), one card is refused and flies off the stack at b4 (the new engine
// rejecting a shot that sits still too long), and the remaining three cards fan out into a sorted
// row at b5 (line / term / final — three of the five fixed pause kinds the engine now enforces).
// The deck lives in the lower band (y ~588-712) through every beat and never disappears.
//
// Beat -> effect -> backdrop:
//   b1  (15-160)  titleTakeover  + LiveBackdrop "hub"  (vitalii.no/features)
//   b2  (169-338) pipelineFlow   + LiveBackdrop "page" (this feature's own page)
//   b3  (347-481) statusFocus    (no backdrop — only two URLs are verified, both already used)
//   b4  (490-660) handoffExplain + LogWindow (the engine's own refusal log, real numbers)
//   b5  (669-844) percentRing    (holds to 889)
//
// Persistent element: the card deck (archetype 3), b1 through the end.
// Effects keep the bottom 200/1080 px clear (look.safeBottom) — that is where it sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b108.json";

const B1 = 15;
const B2 = 169;
const B3 = 347;
const B4 = 490;
const B5 = 669;
const END = 889;

const ACCENT = "#2BC4D9";
const STAGE = "#0A1620";

const LOG_WIN = { x: 150, y: 120, w: 980, h: 420 };

const REFUSAL_LOG: LogLine[] = [
  { t: "engine", text: "shot duration 2.4s < effect needs 3.1s", tone: "danger" },
  { t: "engine", text: "shot refused — not padded to fit", tone: "danger" },
  { t: "engine", text: "static hold 8.0s reached on shot", tone: "muted" },
  { t: "engine", text: "beat has no on-screen change — rejected", tone: "danger" },
  { t: "engine", text: "pause kind resolved: line (cap 3.0s)", tone: "accent" },
  { t: "engine", text: "planned silence: 11% of runtime", tone: "success" },
  { t: "engine", text: "silence ceiling 15% — within budget", tone: "success" },
];

// -- Product plate: names the product, beat 1 only. --
const ProductPlate: React.FC = () => {
  const palette = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 48,
        width: 760,
        padding: "14px 18px",
        background: "rgba(10,22,32,0.72)",
        border: `1px solid ${palette.accentEdge}`,
        borderRadius: 6,
        fontFamily,
      }}
    >
      <div style={{ color: ACCENT, fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>
        Boytasks
      </div>
      <div style={{ color: "rgba(245,245,242,0.78)", fontSize: 14, lineHeight: 1.35, marginTop: 4 }}>
        A screen-time and task system for my three kids: YouTube access is gated by finishing the
        school and chore tasks in the app first, run on Cloudflare Workers.
      </div>
    </div>
  );
};

// -- Card deck: archetype 3. Four cards fly in and stack (b1-b3), one is refused off the
// pile (b4), the remaining three fan out into a sorted row (b5). --
type CardDef = { dx: number; dy: number; rot: number; label: string; arriveF: number };

const STACK: CardDef[] = [
  { dx: 0, dy: 0, rot: -6, label: "SHOT A", arriveF: B1 + 8 },
  { dx: 6, dy: -5, rot: -2, label: "SHOT B", arriveF: B1 + 45 },
  { dx: 12, dy: -10, rot: 2, label: "SHOT C", arriveF: B2 + 15 },
  { dx: 18, dy: -15, rot: 6, label: "SHOT D", arriveF: B3 + 10 },
];

const FAN_LABELS = ["LINE", "TERM", "FINAL"];
const FAN_X = [460, 640, 820];

const EXIT_START = B4 + 10;
const EXIT_DUR = 20;
const FAN_START = B5 + 10;
const FAN_DUR = 50;

const CX = 640;
const CY = 650;
const CW = 150;
const CH = 112;

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const palette = usePalette();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {STACK.map((card, i) => {
        if (frame < card.arriveF) return null;

        const baseX = CX + card.dx - CW / 2;
        const baseY = CY + card.dy - CH / 2;
        const kind = i === 0 ? "wipe" : i === 1 ? "rise" : i === 2 ? "punch" : "rise";

        let dx = 0;
        let dy = 0;
        let rotDelta = 0;
        let opacity = 1;
        let label = card.label;

        if (i === 3) {
          const p = tween(t, EXIT_START / fps, EXIT_DUR / fps, ease.power3Out);
          dy = mix(p, 0, -160);
          opacity = mix(p, 1, 0);
        } else if (frame >= FAN_START) {
          const p = tween(t, FAN_START / fps, FAN_DUR / fps, ease.power3Out);
          const targetCx = FAN_X[i];
          const targetCy = CY + 40;
          dx = mix(p, 0, targetCx - (baseX + CW / 2));
          dy = mix(p, 0, targetCy - (baseY + CH / 2));
          rotDelta = mix(p, 0, -card.rot);
          if (p > 0.6) label = FAN_LABELS[i];
        }

        return (
          <Arrive key={card.label} at={card.arriveF} kind={kind} box={{ x: baseX, y: baseY, w: CW, h: CH }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `translate(${dx}px, ${dy}px) rotate(${card.rot + rotDelta}deg)`,
                opacity,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(43,196,217,0.14)",
                  border: `2px solid ${ACCENT}`,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily,
                  fontSize: 19,
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  color: palette.ink === "#101828" ? "#F5F5F2" : palette.ink,
                  boxShadow: "6px 6px 0 rgba(0,0,0,0.4)",
                }}
              >
                {label}
              </div>
            </div>
          </Arrive>
        );
      })}
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {cut(frame, B1, B2) === 1 && (
        <LiveBackdrop file={shotsFile} shot="hub" from={B1} hold={B2 - B1} />
      )}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Dead air, nothing moved", kicker: "Explainer video pacing bug" }}
      />
      {cut(frame, B1, B2) === 1 && <ProductPlate />}

      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          system: "Old timeline",
          steps: ["Shot planned", "Camera move queued", "Timeline padded to fit", "Sentence already done"],
          result: "Padding added anyway",
        }}
      />

      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Waiting on nothing",
          claims: [
            { text: "Next shot's move isn't ready", verdict: "unclear" },
            { text: "The sentence already finished", verdict: "yes" },
          ],
        }}
      />

      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Padded to fit the camera move",
          to: "Refused if the shot is too short",
          points: ["Every beat after the first must change something", "A look, a colour, or a layout must shift"],
        }}
      />
      {cut(frame, B4, B5) === 1 && (
        <LogWindow lines={REFUSAL_LOG} title="timing engine" from={B4 + 12} every={14} opacity={0.92} win={LOG_WIN} fontSize={20} />
      )}

      <MotionInsert
        effect="percentRing"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.7}
        data={{
          value: 15,
          threshold: 15,
          label: "Max planned silence per film",
          notes: ["Static shot capped at 8 seconds", "Five fixed pause kinds"],
        }}
      />

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureExplainerVideosStopPaddingB108: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
