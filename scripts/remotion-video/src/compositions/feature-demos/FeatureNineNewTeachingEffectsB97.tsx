/**
 * FeatureNineNewTeachingEffectsB97 — feature b97 — 1280x720, 871 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 2 (zoom-in), mood dawn. Beat 1 is a wide, small-scale view of the
 * real vitalii.no features hub; every beat after it pushes a single outer
 * camera further in, so the frame ends on a filled 3x3 grid at beat 5. Content
 * inside the push switches by cut() / Sequence mounting, never a fade — only
 * the camera moves continuously.
 *
 * Only 2 verified recordings (shots/b97.json): hub (beat 1) and the feature's
 * own page (beat 2). The Boytasks lesson-card player and its effects catalog
 * have no public page, so beats 3-5 are drawn straight from the feature row's
 * own text — no invented numbers.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-161 "Every lesson video used to borrow its animations from a news-graphics library."
 *  b2 170-333 "That library was built for grown-up fact-checking, not for how a child actually learns."
 *  b3 342-497 "It had no way to swap a wrong answer for the right one, or sort items into bins."
 *  b4 506-672 "So I built Remotion effects made only for teaching, like zooming in and revealing the answer."
 *  b5 681-826 "Nine new teaching effects now power every lesson card, start to finish." — holds to 871.
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { MotionInsert, cut } from "./motion-primitives";
import { LiveWindow, type Win } from "./live-primitives";
import shotsFile from "./shots/b97.json";

const B1 = 15;
const B2 = 170;
const B3 = 342;
const B4 = 506;
const B5 = 681;
const END = 871;

const ACCENT = "#E2832E";
const STAGE = "#231509";
const fontFamily = 'Inter, "Helvetica Neue", Arial, sans-serif';

const easeOut = Easing.out(Easing.cubic);

/** The single outer "camera": a continuous push-in across the whole clip. Content
 * underneath switches hard via cut()/Sequence — only this transform moves smoothly. */
function camScale(frame: number): number {
  return interpolate(
    frame,
    [0, 60, B2, B2 + 55, B3, B3 + 55, B4, B4 + 55, B5, B5 + 60],
    [1, 1.08, 1.08, 1.2, 1.2, 1.38, 1.38, 1.58, 1.58, 1.82],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut }
  );
}

function pop(frame: number, start: number, dur = 18): number {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
}

const WIN_WIDE: Win = { x: 260, y: 160, w: 760, h: 360 };
const WIN_PAGE: Win = { x: 150, y: 150, w: 980, h: 470 };

const EFFECTS: { label: string; icon: string }[] = [
  { label: "Zoom Reveal", icon: "🔍" },
  { label: "Answer Swap", icon: "🔄" },
  { label: "Sort to Bins", icon: "🗂" },
  { label: "Highlight Step", icon: "✨" },
  { label: "Compare Pair", icon: "⚖" },
  { label: "Count Up", icon: "🔢" },
  { label: "Match Pairs", icon: "🧩" },
  { label: "Progress Fill", icon: "📊" },
  { label: "Build Sequence", icon: "🧱" },
];

const LimitationCard: React.FC<{
  x: number;
  title: string;
  sub: string;
  visible: number;
}> = ({ x, title, sub, visible }) => {
  const P = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 160,
        width: 520,
        height: 400,
        borderRadius: 20,
        background: P.card,
        border: `2px solid ${P.border}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
        opacity: visible,
        transform: `translateY(${(1 - visible) * 20}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 28, top: 24, fontSize: 22, fontWeight: 800, color: P.ink, letterSpacing: -0.4 }}>
        {title}
      </div>
      <div style={{ position: "absolute", left: 28, top: 58, fontSize: 15, fontWeight: 600, color: P.muted }}>{sub}</div>
      <div
        style={{
          position: "absolute",
          left: 28,
          top: 110,
          width: 464,
          height: 220,
          borderRadius: 14,
          background: "rgba(0,0,0,0.18)",
          border: `1.5px dashed ${P.border}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 220,
          transform: "translate(-50%, -50%)",
          fontSize: 86,
          color: P.danger,
          lineHeight: 1,
          fontWeight: 900,
        }}
      >
        🚫
      </div>
      <div
        style={{
          position: "absolute",
          left: 28,
          bottom: 22,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 1.6,
          color: P.danger,
        }}
      >
        NO CONTROL — FIXED ANIMATION ONLY
      </div>
    </div>
  );
};

/** At beat 5 the outer camera is held at its final scale (1.82, origin 50% 46%),
 * so only x in [288,992] / y in [149,545] survives on screen — this grid is sized
 * to that safe box, not the full 1280x720 canvas, or its edges get cropped. */
const FinaleMatrix: React.FC<{ frame: number }> = ({ frame }) => {
  const P = usePalette();
  const headerIn = pop(frame, B5, 20);
  const cols = 3;
  const tileW = 210;
  const tileH = 76;
  const gap = 10;
  const gridW = cols * tileW + (cols - 1) * gap;
  const x0 = 640 - gridW / 2;
  const boxLeft = 315;
  const boxWidth = 650;
  const gridTop = 222;
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      <div
        style={{
          position: "absolute",
          left: boxLeft,
          top: 164,
          width: boxWidth,
          textAlign: "center",
          opacity: headerIn,
          transform: `translateY(${(1 - headerIn) * 14}px)`,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, color: "#FFF4E8" }}>
          NINE TEACHING EFFECTS
        </div>
        <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: "rgba(255,244,232,0.68)" }}>
          One catalog. Every lesson card, start to finish.
        </div>
      </div>
      {EFFECTS.map((e, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const t = pop(frame, B5 + 24 + i * 10, 16);
        return (
          <div
            key={e.label}
            style={{
              position: "absolute",
              left: x0 + c * (tileW + gap),
              top: gridTop + r * (tileH + gap),
              width: tileW,
              height: tileH,
              borderRadius: 12,
              background: P.card,
              border: `2px solid ${P.accentEdge}`,
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              opacity: t,
              transform: `scale(${0.9 + 0.1 * t})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <div style={{ fontSize: 20, lineHeight: 1 }}>{e.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: P.ink, letterSpacing: -0.1, textAlign: "center" }}>{e.label}</div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: boxLeft,
          top: 484,
          width: boxWidth,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 700,
          color: "#FFF4E8",
        }}
      >
        Nine teaching effects now power every lesson card, start to finish.
      </div>
      <div
        style={{
          position: "absolute",
          left: boxLeft,
          top: 512,
          width: boxWidth,
          textAlign: "center",
          fontSize: 9,
          fontWeight: 600,
          color: "rgba(255,244,232,0.5)",
          letterSpacing: 0.3,
        }}
      >
        Shown: the Miljøgifter lesson sample
      </div>
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const scale = camScale(frame);

  return (
    <AbsoluteFill style={{ background: STAGE, overflow: "hidden", fontFamily }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: "50% 46%",
        }}
      >
        {/* ---------------- beat 1 : wide real view of the old hub ---------------- */}
        <Sequence from={B1} durationInFrames={B2 - B1} layout="none">
          <LiveWindow
            file={shotsFile}
            shot="hub"
            title="vitalii.no/features"
            from={0}
            hold={B2 - B1}
            zoom={(t) => 1 + 0.06 * t}
            focus={{ x: 0.5, y: 0.3 }}
            opacity={1}
            win={WIN_WIDE}
          />
        </Sequence>
        <MotionInsert
          effect="titleTakeover"
          from={B1}
          dur={B2 - B1}
          accent={ACCENT}
          plate={0.72}
          data={{ title: "Borrowed from a news library", kicker: "Boytasks — lesson videos, before today" }}
        />

        {/* ---------------- beat 2 : zoom onto this feature's own page ---------------- */}
        <Sequence from={B2} durationInFrames={B3 - B2} layout="none">
          <LiveWindow
            file={shotsFile}
            shot="page"
            title="vitalii.no/features/nine-new-teaching-effects…"
            from={0}
            hold={B3 - B2}
            zoom={(t) => 1 + 0.1 * t}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={1}
            win={WIN_PAGE}
          />
        </Sequence>
        <MotionInsert
          effect="statusFocus"
          from={B2}
          dur={B3 - B2}
          accent={ACCENT}
          plate={0.72}
          data={{
            claims: [
              { text: "Built for grown-up fact-checking", verdict: "yes" },
              { text: "Built for how a child learns", verdict: "no" },
            ],
          }}
        />

        {/* ---------------- beat 3 : drawn — the two missing capabilities ----------------
         * Counter-scaled against the outer camera: beats 3-4 are self-contained graphics
         * authored for a static 1280x720 frame, not for being pushed in on, so they cancel
         * the outer zoom (1/scale) rather than get magnified past the frame edges. */}
        {cut(frame, B3, B4) === 1 && (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${1 / scale})`, transformOrigin: "50% 46%" }}>
            <AbsoluteFill style={{ background: STAGE }}>
              <LimitationCard x={100} title="Swap the answer" sub="wrong → right" visible={pop(frame, B3 + 6)} />
              <LimitationCard x={660} title="Sort into bins" sub="scattered → grouped" visible={pop(frame, B3 + 22)} />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 600,
                  width: 1280,
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: 700,
                  color: P.ink,
                  opacity: pop(frame, B3 + 40),
                }}
              >
                No swap. No bins. One fixed animation, every time.
              </div>
            </AbsoluteFill>
          </div>
        )}

        {/* ---------------- beat 4 : the handoff to teaching-only effects ---------------- */}
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 / scale})`, transformOrigin: "50% 46%" }}>
          <MotionInsert
            effect="handoffExplain"
            from={B4}
            dur={B5 - B4}
            accent={ACCENT}
            base={STAGE}
            data={{
              from: "News-graphics animations",
              to: "9 teaching-only Remotion effects",
              points: [
                "Zoom in to reveal the right answer",
                "Swap a wrong answer for the right one",
                "Sort items into their own bins",
              ],
            }}
          />
        </div>

        {/* ---------------- beat 5 : drawn finale — the full catalog, zoomed to fill ---------------- */}
        {frame >= B5 && <FinaleMatrix frame={frame} />}
      </div>
    </AbsoluteFill>
  );
};

export const FeatureNineNewTeachingEffectsB97: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);

void END;
