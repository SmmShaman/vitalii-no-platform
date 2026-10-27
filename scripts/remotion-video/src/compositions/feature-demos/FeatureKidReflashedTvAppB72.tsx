// FeatureKidReflashedTvAppB72 — feature b72 — 1280x720, 920 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A kid reinstalled the TV app from the Play Store and wiped every parental setting
// in one tap — the guard already blocked YouTube/Spotify, but the Store and Settings
// themselves were never covered. A Python script on the home PC now locks those too,
// the same way it locks YouTube and Spotify. Data only from the feature row
// (problem_en/solution_en/result_en) + the two named commits — b4 shows the one tech
// caption this clip allows ("Python (home PC)"), matched to its own sentence.
//
// Beat → effect:
// b1 15-199   "A kid opened the Play Store, reinstalled the TV app, and wiped every
//             parental setting in one tap." keywordCaption over the feature's own
//             page (backdrop). Lower third: the BOYTASKS product plate arrives —
//             the only mover this beat — the four app-cards sit fanned/closed.
// b2 208-388  "The guard already blocked YouTube and Spotify — but nothing stopped
//             the Store or Settings themselves." cornerTags over the page scrolled
//             further. Lower third: the four cards deal out into open slots, lit
//             as OPEN (unguarded).
// b3 397-512  "It's like locking the fridge but leaving the kitchen door wide open."
//             No catalog effect — a drawn fridge/door analogy owns the upper frame;
//             the lower third's cards hold their b2 OPEN state (no public UI to show).
// b4 521-725  "Now a home-PC script written in Python locks the Store, Settings and
//             every install screen the same way." pipelineFlow on the dark base —
//             the clip's one tech caption ("Python (home PC)"). Lower third: the
//             four cards flip OPEN -> LOCKED, one at a time.
// b5 734-875  "One gap left in a system with an override for everything — now zero."
//             funnelAbsorption: the four now-locked surfaces absorbed into one
//             result. Lower third: a fifth RESULT card arrives reading "0 gaps" —
//             holds to the final frame (920), no fade.
//
// Persistent element: the card-deck lower third (archetype 3), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b72.json";

const B1 = 15;
const B2 = 208;
const B3 = 397;
const B4 = 521;
const B5 = 734;
const END = 920;

const ACCENT = "#0B7A5A";
const STAGE = "#0E231B";

// Lower third geometry (1280x720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const PLATE_W = 228;
const CARD_W = 165;
const CARD_X = [288, 467, 646, 825];
const CARD_LABEL = ["PLAY STORE", "SETTINGS", "PERMISSIONS", "INSTALL SCREEN"];
const RESULT_X = 1020;
const RESULT_W = 170;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const dealt = frame >= B2 + 10;
  const locked = frame >= B4 + 20;
  const resultIn = frame >= B5 + 24;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* product plate */}
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: LT.w,
            height: LT.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: PLATE_W - 38 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>BOYTASKS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            screen-time guard,
            <br />
            three kids
          </div>
        </div>
      </Arrive>

      {/* four app-cards: closed stack (b1) -> dealt + OPEN (b2) -> LOCKED (b4) */}
      {CARD_X.map((x, i) => {
        if (frame < B1 + 10) return null;
        const stackX = LT.x + PLATE_W + 50;
        const curX = mix(tween(sec(frame, B2 + 10 + i * 14, fps), 0, 0.4, ease.power3Out), stackX, x);
        const rot = dealt ? 0 : (i - 1.5) * 5;
        const tone = locked ? P.success : P.danger;
        const bg = locked ? P.successBg : P.dangerBg;
        const edge = locked ? P.successEdge : P.dangerEdge;
        const flipT = tween(sec(frame, B4 + 20 + i * 18, fps), 0, 0.3, ease.power3Out);
        return (
          <Arrive key={i} at={B1 + 10} kind="rise" box={{ x: stackX, y: LT.y + 14, w: CARD_W, h: 64 }}>
            <div
              style={{
                position: "absolute",
                left: curX,
                top: LT.y + 14,
                width: CARD_W,
                height: 64,
                background: bg,
                border: `2px solid ${edge}`,
                borderRadius: 4,
                padding: "8px 10px",
                boxSizing: "border-box",
                overflow: "hidden",
                transform: `rotate(${dealt ? 0 : rot}deg) scaleX(${locked ? Math.abs(1 - flipT * 2) : 1})`,
                zIndex: dealt ? 1 : 10 - i,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: tone }}>{CARD_LABEL[i]}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginTop: 4 }}>{locked ? "locked" : "open"}</div>
            </div>
          </Arrive>
        );
      })}

      {/* RESULT card: arrives in b5, holds to final frame */}
      {resultIn && (
        <Arrive at={B5 + 24} kind="punch" box={{ x: RESULT_X, y: LT.y + 14, w: RESULT_W, h: 64 }}>
          <div
            style={{
              position: "absolute",
              left: RESULT_X,
              top: LT.y + 14,
              width: RESULT_W,
              height: 64,
              background: P.success,
              border: `2px solid ${P.success}`,
              borderRadius: 4,
              color: "#fff",
              padding: "8px 12px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6 }}>RESULT</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>0 gaps left</div>
          </div>
        </Arrive>
      )}
    </div>
  );
};

/** b3: no public UI recorded for this beat — a drawn fridge/door analogy owns the frame. */
const FridgeDoorAnalogy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = sec(frame, B3, fps);
  const fridgeP = tween(t, 0.1, 0.4, ease.power3Out);
  const doorP = tween(t, 0.45, 0.4, ease.power3Out);

  return (
    <AbsoluteFill style={{ background: STAGE, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
      <div style={{ textAlign: "center", transform: `scale(${mix(fridgeP, 0.8, 1)})`, opacity: fridgeP }}>
        <div style={{ fontSize: 150, lineHeight: 1 }}>🔒</div>
        <div style={{ fontFamily, fontSize: 24, fontWeight: 800, color: "#fff", marginTop: 12 }}>FRIDGE — locked</div>
      </div>
      <div style={{ textAlign: "center", transform: `scale(${mix(doorP, 0.8, 1)})`, opacity: doorP }}>
        <div style={{ fontSize: 150, lineHeight: 1 }}>🚪</div>
        <div style={{ fontFamily, fontSize: 24, fontWeight: 800, color: "#fff", marginTop: 12 }}>KITCHEN DOOR — wide open</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 210,
          textAlign: "center",
          fontFamily,
          fontSize: 40,
          fontWeight: 800,
          color: "#fff",
          opacity: tween(t, 0.3, 0.4, ease.power3Out),
        }}
      >
        Lock one thing. Leave the other wide open.
      </div>
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the wipe, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ line1: "Reinstalled. Wiped.", line2: "Every parental setting, one tap.", keywords: ["Reinstalled.", "Wiped."] }}
      />

      {/* b2 — the existing guard's blind spot, over the page scrolled further */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ statement: "Blocked everywhere — except here", tags: ["YouTube blocked", "Spotify blocked", "Play Store open", "Settings open"] }}
      />

      {/* b3 — the analogy, drawn (no recording exists for this beat) */}
      {cut(frame, B3, B4) === 1 && <FridgeDoorAnalogy />}

      {/* b4 — the mechanism, dark base, the clip's one tech caption */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.5}
        base={STAGE}
        data={{
          steps: ["Foreground app checked each cycle", "Matched against the guard list", "Lock screen fires"],
          system: "Python (home PC)",
          result: "Same lock as YouTube, Spotify",
        }}
      />

      {/* b5 — the result, holds to the final frame */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.5}
        base={STAGE}
        data={{ inputs: ["Play Store open", "Settings open", "Permission dialogs", "Install screens"], result: "Zero gaps left" }}
      />

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureKidReflashedTvAppB72: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
