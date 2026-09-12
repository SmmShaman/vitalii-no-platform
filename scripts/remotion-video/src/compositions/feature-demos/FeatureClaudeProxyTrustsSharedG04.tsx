/**
 * FeatureClaudeProxyTrustsSharedG04 — feature g04 — 1280x720, 799 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 3 "card-deck", mood "mint" (both handed down by the
 * orchestrating session). A dashed archway ("the door into the proxy") owns
 * the frame for beats 1-4. Beat 1 docks the one real credential card that
 * already opens it. Beat 2 tries a ghost card that never fits. Beat 3 is the
 * non-crossfade centerpiece: two rejected-option cards fly in from opposite
 * top corners, collide, get stamped with a red X and fly off. Beat 4 docks a
 * second card successfully and lights up a row of character-check boxes
 * feeding the clip's one tech chip. Beat 5 scale-pushes the real product
 * window in — the second non-crossfade transition — closing on the real
 * count of valid ways in.
 *
 * Beats 1-4 are the door metaphor, the browser-less program, the rejected
 * options and the invisible constant-time check — all metaphor/plumbing, so
 * they stay drawn per STEP 0c. Beat 5 is the shipped result, so it plays a
 * recording of the real feature page (shots/g04.json, shot "page") the way
 * FeatureTraceabilityScannerLive (p61) closes on its own feature page.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-148  "I had one door into my Claude proxy, guarded by one person's
 *              login."
 *  b2 157-313  "Then a second, browser-less program needed the same door —
 *              with no login to show."
 *  b3 322-448  "It would have needed its own paid key, or a fake login just
 *              to get in."
 *  b4 457-638  "Instead, it got a shared secret, checked one character at a
 *              time so a wrong guess leaks nothing."
 *  b5 647-754  "Now that same door has two valid ways in instead of one." —
 *              holds to 799.
 *
 * Single tech name in the whole clip: constant-time check (beat 4 chip only).
 * The 8-box character check and the "1 door -> 2 valid ways in" close are the
 * real shape of the shared-secret auth added to the Claude proxy — nothing
 * here is an invented metric.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LightBg, Panel, FilterChip, CheckBadge, CaptionBand, Headline, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/g04.json";

const P = MOODS.mint;

const B1_S = 15, B1_E = 148;
const B2_S = 157, B2_E = 313;
const B3_S = 322, B3_E = 448;
const B4_S = 457, B4_E = 638;
const B5_S = 647, B5_E = 754;
const END = 799;
const FADE = 9;

const DOOR_X = 520;
const DOOR_Y = 150;
const DOOR_W = 240;
const DOOR_H = 400;
const SLOT1 = { x: 640, y: 245 };
const SLOT2 = { x: 640, y: 400 };

const WIN5: Win = { x: 230, y: 172, w: 820, h: 384 };

/** One flying credential card, center-anchored so rotation/scale read naturally. */
const Card: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
  tone?: "neutral" | "danger" | "success" | "ghost";
  emoji: string;
  title: string;
  fontSize?: number;
}> = ({ x, y, w = 210, h = 84, rotate = 0, scale = 1, opacity = 1, tone = "neutral", emoji, title, fontSize = 15 }) => {
  const B = usePalette();
  if (opacity <= 0.004 || scale <= 0.004) return null;
  const bg = tone === "danger" ? B.dangerBg : tone === "success" ? B.successBg : tone === "ghost" ? "transparent" : B.card;
  const edge = tone === "danger" ? B.dangerEdge : tone === "success" ? B.successEdge : B.border;
  const fg = tone === "danger" ? B.danger : tone === "success" ? B.success : B.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
        opacity,
        borderRadius: 16,
        background: bg,
        border: tone === "ghost" ? `2px dashed ${B.border}` : `1.5px solid ${edge}`,
        boxShadow: tone === "ghost" ? "none" : "0 12px 28px rgba(16,40,29,0.16)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 24 }}>{emoji}</div>
      <div style={{ fontSize, fontWeight: 700, color: fg, textAlign: "center", padding: "0 10px", lineHeight: 1.15 }}>{title}</div>
    </div>
  );
};

export const FeatureClaudeProxyTrustsSharedG04: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ---- transient captions/headline per beat (fade in AND out) ----
  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  // ---- the door: alive for beats 1-4, gone before beat 5 ----
  const doorOp = Math.min(1, pop(B1_S + 2)) * (1 - seg(frame, B4_E, B4_E + FADE));

  // beat 1: the one real credential flies in and docks in slot 1
  const CARD1_S = B1_S + 8, CARD1_E = B1_S + 70;
  const card1X = interpolate(frame, [CARD1_S, CARD1_E], [-260, SLOT1.x], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const card1Rotate = interpolate(frame, [CARD1_S, CARD1_E], [-6, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const card1FadeIn = seg(frame, B1_S + 33, B1_S + 45); // starts once the card is already fully on-canvas
  const card1Op = doorOp * card1FadeIn;

  // beat 2: a ghost card approaches slot 2 from off-canvas, never docks, recoils away
  const CARD2_TRAVEL_S = B2_S + 10, CARD2_TRAVEL_E = B2_S + 70;
  const card2Approach = interpolate(frame, [CARD2_TRAVEL_S, CARD2_TRAVEL_E], [1450, 760], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const card2Recoil = interpolate(frame, [CARD2_TRAVEL_E, CARD2_TRAVEL_E + 25], [760, 860], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const card2X = frame < CARD2_TRAVEL_E ? card2Approach : card2Recoil;
  const card2OpIn = seg(frame, B2_S + 40, B2_S + 54); // fades in only once safely on-canvas
  const card2OpOut = 1 - seg(frame, B2_S + 108, B2_S + 122);
  const card2Op = card2OpIn * card2OpOut;
  const noFitPop = pop(B2_S + 60, 14);

  // beat 3: two rejected options fly from opposite top corners, collide, get stamped, fly off
  const COLLIDE_S = B3_S + 4, COLLIDE_E = B3_S + 55;
  const collideT = interpolate(frame, [COLLIDE_S, COLLIDE_E], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic),
  });
  const STAMP_S = B3_S + 55, STAMP_E = B3_S + 72;
  const stampT = seg(frame, STAMP_S, STAMP_E);
  const FLY_S = B3_S + 78, FLY_E = B3_S + 118;
  const flyT = interpolate(frame, [FLY_S, FLY_E], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic),
  });
  const cardOpacity3 = seg(frame, B3_S + 14, B3_S + 30) * (1 - seg(frame, B3_S + 116, B3_S + 126));

  const cardAx = interpolate(collideT, [0, 1], [120, 620]) - flyT * 300;
  const cardAy = interpolate(collideT, [0, 1], [-60, 300]) + flyT * 500;
  const cardArot = interpolate(collideT, [0, 1], [-20, -6]) - flyT * 40;
  const cardBx = interpolate(collideT, [0, 1], [1160, 660]) + flyT * 300;
  const cardBy = interpolate(collideT, [0, 1], [-60, 300]) + flyT * 500;
  const cardBrot = interpolate(collideT, [0, 1], [20, 6]) + flyT * 40;

  // beat 4: the shared secret docks in slot 2, then character checks light up left to right
  const CARD4_S = B4_S + 8, CARD4_E = B4_S + 45;
  const card4X = interpolate(frame, [CARD4_S, CARD4_E], [1450, SLOT2.x], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const card4Rotate = interpolate(frame, [CARD4_S, CARD4_E], [6, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const card4FadeIn = seg(frame, B4_S + 30, B4_S + 44);
  const card4Op = doorOp * card4FadeIn;

  const CHECK_N = 8, CHECK_START = B4_S + 55, CHECK_STEP = 14;
  const checkLit = (i: number) => seg(frame, CHECK_START + i * CHECK_STEP, CHECK_START + i * CHECK_STEP + 8);
  const tagPop = pop(CHECK_START + CHECK_N * CHECK_STEP + 12);
  const chipPop = pop(B4_S + 70);

  // ---- beat 5: scale-push the real product in (the other non-crossfade transition) ----
  const pushScale = interpolate(frame, [B5_S, B5_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const statPop = pop(B5_S + 10);
  const checkBadgePop = pop(B5_S + 130);
  const resultStripIn = seg(frame, B5_S + 60, B5_S + 76);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= per-beat headline ================= */}
        <Headline y={26} text="One door into the proxy. One login." opacity={b1} fontSize={30} />
        <Headline y={26} text="A new program needs in — no login to show." opacity={b2} fontSize={30} />
        <Headline y={26} text="A paid key? A fake login? Both rejected." opacity={b3} fontSize={30} />
        <Headline y={26} text="Instead: a shared secret, checked one character at a time." opacity={b4} fontSize={28} />

        {/* ================= the door (archetype 3, card-deck) — beats 1-4 ================= */}
        <div
          style={{
            position: "absolute",
            left: DOOR_X,
            top: DOOR_Y,
            width: DOOR_W,
            height: DOOR_H,
            borderRadius: "120px 120px 24px 24px",
            background: P.card,
            border: `3px dashed ${P.border}`,
            boxShadow: "0 20px 50px rgba(16,40,29,0.18)",
            opacity: doorOp * 0.92,
          }}
        >
          <div style={{ position: "absolute", top: 18, left: 0, width: "100%", textAlign: "center", fontSize: 34 }}>🔒</div>
          <div style={{ position: "absolute", top: 62, left: 0, width: "100%", textAlign: "center", fontSize: 13, fontWeight: 800, letterSpacing: 3, color: P.muted }}>
            PROXY
          </div>
        </div>

        {/* beat 1: the one real credential docks */}
        <Card x={card1X} y={SLOT1.y} rotate={card1Rotate} opacity={card1Op} tone="success" emoji="🔑" title="Google login (owner)" />

        {/* beat 2: the ghost card that never fits */}
        <Card x={card2X} y={SLOT2.y} rotate={-4} opacity={card2Op} tone="ghost" emoji="🤖" title="Headless worker · nothing to show" />
        <div
          style={{
            position: "absolute",
            left: 900,
            top: SLOT2.y - 90,
            transform: `translate(-50%, -50%) scale(${Math.min(1, noFitPop)})`,
            opacity: card2Op,
            padding: "6px 14px",
            borderRadius: 999,
            background: P.dangerBg,
            border: `1.5px solid ${P.dangerEdge}`,
            color: P.danger,
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          ✕ no login to show
        </div>

        {/* beat 3: two rejected options collide and get discarded */}
        <Card x={cardAx} y={cardAy} rotate={cardArot} opacity={cardOpacity3} tone="danger" emoji="💳" title="Its own paid key" />
        <Card x={cardBx} y={cardBy} rotate={cardBrot} opacity={cardOpacity3} tone="danger" emoji="🎭" title="A fake login just to get in" />
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 300,
            transform: `translate(-50%, -50%) scale(${Math.min(1, stampT * 1.3)})`,
            opacity: stampT * (1 - flyT) * cardOpacity3,
            fontSize: 90,
            fontWeight: 900,
            color: P.danger,
          }}
        >
          ✕
        </div>

        {/* beat 4: the shared secret docks, character checks light up, one tech chip */}
        <Card x={card4X} y={SLOT2.y} rotate={card4Rotate} opacity={card4Op} tone="success" emoji="🔐" title="Shared secret key" />
        {Array.from({ length: CHECK_N }).map((_, i) => {
          const lit = checkLit(i);
          const boxW = 30, gap = 8, totalW = CHECK_N * boxW + (CHECK_N - 1) * gap;
          const startX = 640 - totalW / 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: startX + i * (boxW + gap),
                top: 575,
                width: boxW,
                height: 30,
                borderRadius: 8,
                opacity: card4Op,
                background: lit > 0.5 ? P.successBg : P.card,
                border: `2px solid ${lit > 0.5 ? P.successEdge : P.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 800,
                color: P.success,
              }}
            >
              {lit > 0.5 ? "•" : ""}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 616,
            transform: `translate(-50%, -50%) scale(${Math.min(1, tagPop)})`,
            opacity: card4Op * Math.min(1, tagPop),
            fontSize: 16,
            fontWeight: 800,
            color: P.success,
          }}
        >
          ✓ no time leak
        </div>
        <FilterChip
          x={DOOR_X + DOOR_W + 40}
          y={190}
          text="constant-time check"
          icon="⏱"
          color={P.accent}
          scale={Math.min(1, chipPop)}
          opacity={card4Op * Math.min(1, chipPop)}
        />

        {/* per-beat caption band */}
        <CaptionBand text="Guarded by one person's Google login" opacity={b1} tone="accent" />
        <CaptionBand text="No browser, no login to show" opacity={b2} tone="danger" />
        <CaptionBand text="A paid key or a fake login — both wrong" opacity={b3} tone="danger" />
        <CaptionBand text="One wrong character leaks nothing" opacity={b4} tone="accent" />

        {/* ================= beat 5 : the real page, and the number ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN5.x + WIN5.w / 2}px ${WIN5.y + WIN5.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-g04"
            win={WIN5}
            from={B5_S}
            hold={END - B5_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b5}
          />
        </div>
        <Panel x={40} y={150} w={190} h={170} tone="success" opacity={b5 * Math.min(1, statPop)}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ fontSize: 30 }}>🔑</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>2</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", lineHeight: 1.3 }}>
              VALID WAYS
              <br />
              IN NOW
            </div>
          </div>
        </Panel>
        <CheckBadge x={WIN5.x + WIN5.w - 42} y={WIN5.y - 22} size={40} opacity={b5} scale={checkBadgePop} />
        <div
          style={{
            position: "absolute",
            left: WIN5.x + 24,
            top: WIN5.y + WIN5.h - 70,
            padding: "12px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.96)",
            border: `1.5px solid ${P.successEdge}`,
            boxShadow: "0 14px 34px rgba(22,35,63,0.16)",
            opacity: b5 * resultStripIn,
            transform: `translateY(${(1 - resultStripIn) * 14}px)`,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          1 door → 2 valid ways in
        </div>
        <CaptionBand text="Live on vitalii.no now" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
