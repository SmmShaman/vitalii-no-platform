// FeatureNoRecordingAppSpeaksB63 — feature b63 — 1280x720, 850 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: Boytasks — a screen-time and task system for three kids (Cloudflare Workers).
//
// Persistent element (archetype 3): a deck of five "phrase cards" (the app's spoken
// lines). It starts as a big messy pile dominating the frame (b1), shrinks into a
// docked row while the explanation plays (b2-b4), and fans out into a wide lit row at
// the end (b5) — "the pile shrinking" then "the fan sorting itself" from the archetype
// table.
//
// Beat -> effect (data only from the feature row; commit 5efc431 is the TTS bridge):
// b1 15-175   "a kid taps a button... and nothing comes out"
//             drawn only: the pile (4 recorded phrase cards) sits big and central; a
//             5th phrase ("New task added") is tapped outside the pile and returns a
//             mute glyph — nothing was ever generated for it.
// b2 175-366  "every spoken line had been a separate pre-recorded clip... stayed silent"
//             funnelAbsorption: the four known phrases funnel to "spoken", the missing
//             one funnels to silence. Deck docks into the lower band.
// b3 366-542  "the app's wrapper had no way to generate speech on its own"
//             drawn only: a browser (has its own voice) vs this app's WebView wrapper
//             (no voice built in) schematic fills the upper frame. Deck stays docked,
//             unchanged.
// b4 542-701  "now it borrows the phone's own text-to-speech voice..."
//             handoffExplain: no built-in voice -> the phone's own voice engine. The
//             docked 5th card (muted) lights up mid-beat — it is covered now too.
// b5 701-850  "cached or not, every phrase gets read out loud now"
//             titleTakeover holds the verdict; the deck fans out into a wide lit row,
//             all five cards green, holding to the final frame.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b63.json";

const B1 = 15;
const B2 = 175;
const B3 = 366;
const B4 = 542;
const B5 = 701;
const END = 850;

const STAGE = "#101722";
const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Rect = { x: number; y: number; w: number; h: number; rot: number };
const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({
  x: mix(p, a.x, b.x),
  y: mix(p, a.y, b.y),
  w: mix(p, a.w, b.w),
  h: mix(p, a.h, b.h),
  rot: mix(p, a.rot, b.rot),
});

const LABELS = ["Good morning!", "Chore done!", "3-day streak!", "Bedtime soon", "New task added"];

// index 0-3: the stack. index 4: the one tapped in b1, outside the pile.
const PILE: Rect[] = [
  { x: 470, y: 150, w: 170, h: 230, rot: -9 },
  { x: 520, y: 170, w: 170, h: 230, rot: -3 },
  { x: 570, y: 158, w: 170, h: 230, rot: 4 },
  { x: 620, y: 142, w: 170, h: 230, rot: 10 },
  { x: 880, y: 150, w: 170, h: 230, rot: 0 },
];
const DOCK: Rect[] = [0, 1, 2, 3, 4].map((i) => ({ x: 40 + i * 164, y: 606, w: 150, h: 84, rot: 0 }));
const FAN: Rect[] = [0, 1, 2, 3, 4].map((i) => ({ x: 58 + i * 236, y: 598, w: 220, h: 100, rot: 0 }));

const LIGHT4 = B4 + 70;

const rectAt = (frame: number, fps: number, i: number): Rect => {
  if (frame < B2) return PILE[i];
  if (frame < B2 + 15) return lerpRect(PILE[i], DOCK[i], tween(sec(frame, B2, fps), 0, 0.5, ease.power3InOut));
  if (frame < B5) return DOCK[i];
  if (frame < B5 + 15) return lerpRect(DOCK[i], FAN[i], tween(sec(frame, B5, fps), 0, 0.5, ease.power3InOut));
  return FAN[i];
};

const Deck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;
  const big = frame < B2;
  const fanned = frame >= B5 + 15;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div style={{ position: "absolute", left: 50, top: 36, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        PHRASE LIBRARY
      </div>

      {[0, 1, 2, 3, 4].map((i) => {
        const r = rectAt(frame, fps, i);
        const lit = i !== 4 || frame >= LIGHT4;
        const justLit = i === 4 && frame >= LIGHT4 && frame < LIGHT4 + 18;
        const pulse = justLit ? punchScale(sec(frame, LIGHT4, fps), 0) : 1;
        const tone = lit ? { bg: P.successBg, edge: P.successEdge, text: P.success } : { bg: P.card, edge: P.dangerEdge, text: P.muted };
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              transform: `rotate(${r.rot}deg) scale(${pulse})`,
              background: tone.bg,
              border: `${lit ? 2 : 2} ${i === 4 && !lit ? "dashed" : "solid"} ${tone.edge}`,
              borderRadius: big ? 10 : 6,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.45)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: big ? 15 : fanned ? 16 : 13, fontWeight: 700, color: tone.text, textAlign: "center", lineHeight: 1.25 }}>
              {LABELS[i]}
            </div>
            {!lit && <div style={{ marginTop: 6, fontSize: big ? 30 : 18 }}>🔇</div>}
            {lit && fanned && <div style={{ marginTop: 6, fontSize: 18 }}>🔊</div>}
          </div>
        );
      })}

      {/* b1: a tap arrives on the missing phrase, nothing comes out */}
      {frame >= B1 + 20 && frame < B2 && (
        <>
          <div
            style={{
              position: "absolute",
              left: mix(tween(sec(frame, B1 + 20, fps), 0, 0.5, ease.power3Out), 1040, 965),
              top: mix(tween(sec(frame, B1 + 20, fps), 0, 0.5, ease.power3Out), 560, 300),
              width: 20,
              height: 20,
              borderRadius: 10,
              background: P.ink,
              opacity: 0.85,
            }}
          />
          {frame >= B1 + 42 && (
            <div
              style={{
                position: "absolute",
                left: 920,
                top: 240,
                fontSize: 46,
                transform: `scale(${punchScale(sec(frame, B1 + 42, fps), 0)})`,
              }}
            >
              🔇
            </div>
          )}
        </>
      )}
    </div>
  );
};

/** b3: a browser (has its own voice) vs this app's WebView wrapper (no voice) — drawn only. */
const Schematic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;

  const BoxLeft = { x: 140, y: 120, w: 440, h: 360 };
  const BoxRight = { x: 700, y: 120, w: 440, h: 360 };

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B3 + 6} kind="wipe" box={BoxLeft} dur={0.4}>
        <div
          style={{
            position: "absolute",
            left: BoxLeft.x,
            top: BoxLeft.y,
            width: BoxLeft.w,
            height: BoxLeft.h,
            background: P.successBg,
            border: `3px solid ${P.successEdge}`,
            borderRadius: 10,
            boxShadow: "8px 8px 0 rgba(0,0,0,0.4)",
            padding: 28,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: P.ink }}>A BROWSER</div>
          <div style={{ fontSize: 46, marginTop: 24 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: P.success, marginTop: 14 }}>Has its own voice</div>
          <div style={{ fontSize: 15, color: P.muted, marginTop: 8 }}>Can read any text out loud</div>
        </div>
      </Arrive>

      <Arrive at={B3 + 30} kind="wipe" box={BoxRight} dur={0.4}>
        <div
          style={{
            position: "absolute",
            left: BoxRight.x,
            top: BoxRight.y,
            width: BoxRight.w,
            height: BoxRight.h,
            background: P.dangerBg,
            border: `3px solid ${P.dangerEdge}`,
            borderRadius: 10,
            boxShadow: "8px 8px 0 rgba(0,0,0,0.4)",
            padding: 28,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: P.ink }}>THIS APP'S WRAPPER</div>
          <div style={{ fontSize: 46, marginTop: 24 }}>❌</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: P.danger, marginTop: 14 }}>No voice built in</div>
          <div style={{ fontSize: 15, color: P.muted, marginTop: 8 }}>Only plays clips it already has</div>
          <div style={{ position: "absolute", right: 24, bottom: 20, fontSize: 13, fontWeight: 700, letterSpacing: 1.2, color: P.muted }}>
            WebView
          </div>
        </div>
      </Arrive>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page, dimmed by hand (no MotionInsert here) */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      {cut(frame, B1, B2) === 1 && <AbsoluteFill style={{ background: "rgba(8,8,8,0.72)" }} />}

      {/* b2 — the mechanism, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B2}
        dur={B3 - B2}
        accent={P.accent}
        plate={0.72}
        data={{
          inputs: ["Good morning!", "Chore done!", "3-day streak!", "New task added"],
          result: "No recorded clip -> silence",
        }}
      />

      {/* b3 — the limitation, drawn schematic over the feature's own page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.2 }} />}
      {cut(frame, B3, B4) === 1 && <AbsoluteFill style={{ background: "rgba(8,8,8,0.76)" }} />}
      <Schematic />

      {/* b4 — the fix, over the hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.25 }} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={P.accent}
        plate={0.72}
        data={{
          from: "No built-in voice",
          to: "Phone's own voice engine",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Uses the phone's own voice", "Covers every missing clip"],
        }}
      />

      {/* b5 — the result, no feature page / hub per gate 2; holds to the final frame */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={P.accent}
        plate={0.72}
        base={STAGE}
        data={{ title: "Every phrase speaks now", kicker: "Cached or not" }}
      />

      <Deck />
    </AbsoluteFill>
  );
};

export const FeatureNoRecordingAppSpeaksB63: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
