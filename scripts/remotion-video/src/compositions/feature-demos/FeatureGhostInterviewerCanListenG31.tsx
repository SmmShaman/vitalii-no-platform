// FeatureGhostInterviewerCanListenG31 — feature g31 — 1280x720, 894 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card deck, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Ghost Interviewer AI used to transcribe a video call with a speaker-to-mic round trip:
// play the other person's voice out of the speakers, then catch it again with the mic.
// This clip tells the fix — listening straight to the shared browser tab — through a
// persistent card-deck lower third: four claims about that old trick start stacked as a
// pile, then fan out into a grid, flipping red to green one by one as each gets fixed.
//
// Beat → effect (plan: shots/g31.motion.json):
// b1 15-255   "let their voice play through your speakers, then catch it again with the mic"
//             titleTakeover over the product page. Card pile starts forming.
// b2 255-453  "that round trip added echo and noise, and failed outright on laptops with no mic path"
//             statusFocus, fully drawn — no echo / no clean audio / no laptop support.
// b3 453-663  "the Web Speech API listens straight to the shared tab"
//             funnelAbsorption over the matching commit diff. First 3 cards fan out,
//             flip red -> green.
// b4 663-894  "a fresh listener needs a moment to wake up, so the restart timer stretched
//             from 6 to 12 seconds"
//             copyCorrection over the same commit's other hunk. 4th card appears directly
//             in its slot, flips 6s -> 12s.
//
// Persistent element: the card-deck lower third (archetype 3), b1 through b4.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LiveWindow } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g31.json";

const B1 = 15;
const B2 = 255;
const B3 = 453;
const B4 = 663;
const END = 894;
void END;

/** Mint's native accent #0B7A5A reads muddy on a dark plate — brightened for the stage. */
const ACCENT = "#36D9A4";
const STAGE = "#0F1F18";

// Card-deck lower third geometry (1280x720). Tall enough that the piled cards
// (offset diagonally, see STACK_DX/DY) read as a multi-card hand, not one card.
const DECK = { x: 40, y: 540, w: 1200, h: 155 };
const CARD_W = 280;
const CARD_H = 120;
const SLOT_Y = DECK.y + 15;
const SLOT_X = [60, 350, 640, 930];
const STACK_X = 60;
// Piled (pre-fan) offsets for cards 0-2, stepping diagonally up-right so all three
// are visible at once instead of fully overlapping at one point.
const STACK_DX = [0, 50, 100];
const STACK_DY = [0, -35, -70];
// Fan happens in a short window ending at FLIP[i] — before that the card sits in
// its static piled pose (jittered), matching "pile forms, then fans out on cue".
const FAN_WINDOW = 90;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Card = { icon: string; label: string; before: string; after: string };
const CARDS: Card[] = [
  { icon: "🎤", label: "AUDIO PATH", before: "SPEAKER → MIC", after: "SHARED TAB" },
  { icon: "🔇", label: "ECHO & NOISE", before: "PRESENT", after: "GONE" },
  { icon: "💻", label: "LAPTOP MICS", before: "FAILS", after: "WORKS" },
  { icon: "⏱", label: "RESTART TIMER", before: "6s", after: "12s" },
];
const APPEAR = [25, 265, 295, 673];
const FLIP = [463, 483, 513, 753];

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {CARDS.map((c, i) => {
        if (frame < APPEAR[i]) return null;
        const lit = frame >= FLIP[i];
        const stacked = i < 3;
        const p = stacked
          ? tween(sec(frame, FLIP[i] - FAN_WINDOW, fps), 0, FAN_WINDOW / fps, ease.power3InOut)
          : 1;
        const x = stacked ? mix(p, STACK_X + STACK_DX[i], SLOT_X[i]) : SLOT_X[i];
        const y = stacked ? mix(p, SLOT_Y + STACK_DY[i], SLOT_Y) : SLOT_Y;
        const rot = stacked ? mix(p, 6 + i * 3, 0) : 0;
        const zIndex = stacked ? 10 - i + (p > 0.98 ? 0 : 20) : 10;
        return (
          <Arrive key={i} at={APPEAR[i]} kind="rise" box={{ x, y, w: CARD_W, h: CARD_H }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 6,
                background: lit ? P.successBg : P.dangerBg,
                border: `2px solid ${lit ? P.successEdge : P.dangerEdge}`,
                boxShadow: "4px 4px 0 rgba(0,0,0,0.35)",
                boxSizing: "border-box",
                padding: "8px 14px",
                transform: `rotate(${rot}deg)`,
                zIndex,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 30 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.1, color: P.ink }}>{c.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: lit ? P.success : P.danger, marginTop: 6 }}>
                  {lit ? c.after : c.before}
                </div>
              </div>
            </div>
          </Arrive>
        );
      })}
    </div>
  );
};

const ProductNamePlate: React.FC = () => {
  const P = usePalette();
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 40, w: 340, h: 56 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 340,
          height: 56,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>Ghost Interviewer AI</div>
      </div>
    </Arrive>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the old trick: play the other voice through speakers, catch it with the mic */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="product" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{ title: "The Speaker-To-Mic Trick", kicker: "How video-call transcription used to work" }}
      />
      {frame >= B1 && frame < B2 && <ProductNamePlate />}

      {/* b2 — the cost of that round trip: echo, noise, and laptops with no mic path */}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "The round trip",
          claims: [
            { text: "No echo", verdict: "no" },
            { text: "Clean audio", verdict: "no" },
            { text: "Works on laptops", verdict: "no" },
          ],
        }}
      />

      {/* b3 — the fix: the Web Speech API listens straight to the shared tab */}
      {cut(frame, B3, B4) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="commit"
          title="github.com/.../commit/399456a"
          from={B3}
          hold={B4 - B3}
          zoom={() => 2.2}
          focus={{ x: 0.5, y: 0.42 }}
          opacity={1}
          win={{ x: 40, y: 40, w: 1200, h: 540 }}
        />
      )}
      <MotionInsert
        effect="funnelAbsorption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{ inputs: ["Echo", "Background noise", "No mic path"], result: "Clean tab audio, direct" }}
      />

      {/* b4 — the knock-on fix: a fresh listener needs a moment, restart timer 6s -> 12s */}
      {cut(frame, B4, END) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="commit2"
          title="github.com/.../commit/399456a"
          from={B4}
          hold={END - B4}
          zoom={() => 2.2}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={1}
          win={{ x: 40, y: 40, w: 1200, h: 540 }}
        />
      )}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={END - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          wrong: "Restart timer: 6 seconds",
          right: "Restart timer: 12 seconds",
          label: "A fresh listener needs to wake up",
        }}
      />

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureGhostInterviewerCanListenG31: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
