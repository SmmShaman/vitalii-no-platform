/**
 * FeatureTelegramModeration — feature p18 — 1280x720, 1002 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 3 (card deck), mood slate. A pile of identical decision-cards
 * (every one of fifty articles a day) flies apart into a fan of the three
 * decisions that pile actually hides — then the story moves onto the real
 * product: the same three decisions, now asked one at a time inside a single
 * rewriting Telegram bubble, proven by real commit/Action history.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–216  "Fifty articles a day. Every one of them needed a decision, and every decision meant opening something else."
 *  b2 225–388  "Pick the picture. Pick the language. Pick where it goes. Hours of it, every single day."
 *  b3 397–583  "Now it all happens inside one Telegram message, the way a form fills itself in as you tap."
 *  b4 592–805  "The message rewrites itself after every tap. Same bubble, next question. Nothing to open, nothing to type."
 *  b5 814–957  "Hours per article became eight seconds. Four taps, and it is published." — holds to 1002.
 *
 * Single tech name in the whole clip: Telegram Bot API (beat 4 chip only).
 * Non-crossfade transition: the beat1→beat2 stack-to-fan card flight.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow, toneBg, toneEdge, Tone } from "./bright-theme";
import {
  LightBg,
  Group,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, WIN_DEFAULT } from "./live-primitives";
import shots from "./shots/p18.json";

const P = MOODS.slate;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const LABELS = [
  { icon: "🖼", text: "Photo" },
  { icon: "🌍", text: "Language" },
  { icon: "📲", text: "Platform" },
];
const STACK = [
  { x: 640, y: 421, rotate: -6 },
  { x: 640, y: 421, rotate: 0 },
  { x: 640, y: 421, rotate: 6 },
];
const FAN = [
  { x: 260, y: 421, rotate: -8 },
  { x: 640, y: 421, rotate: 0 },
  { x: 1020, y: 421, rotate: 8 },
];
const FILLERS = [
  { x: 640, y: 462, rotate: -14 },
  { x: 640, y: 380, rotate: 12 },
];

const CardFace: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  opacity: number;
  tone: Tone;
  children?: React.ReactNode;
}> = ({ x, y, w = 220, h = 150, rotate = 0, opacity, tone, children }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      borderRadius: 18,
      background: toneBg(tone, P),
      border: `2px solid ${toneEdge(tone, P)}`,
      boxShadow: cardShadow,
      opacity,
      transform: `rotate(${rotate}deg)`,
    }}
  >
    {children}
  </div>
);

export const FeatureTelegramModeration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (audio-measured, do not shift) ────────────────────
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 216, 232));
  const b2 = seg(frame, 225, 241) * (1 - seg(frame, 388, 404));
  const b3 = seg(frame, 397, 413) * (1 - seg(frame, 583, 599));
  const b4 = seg(frame, 592, 608) * (1 - seg(frame, 805, 821));
  const b5 = seg(frame, 814, 830); // holds through 1002

  // the deck of cards survives across b1+b2 as one continuous element
  const deck = seg(frame, 15, 31) * (1 - seg(frame, 388, 404));
  const flyT = easeInOut(interpolate(frame, [200, 241], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));

  const heroPop1 = pop(15);
  const hero1 = Math.min(1, heroPop1 + 0.6);
  const chipPop = pop(605);

  // beat 4: the bubble asks one question at a time, then rewrites itself
  const step1 = seg(frame, 592, 608) * (1 - seg(frame, 663, 679));
  const step2 = seg(frame, 663, 679) * (1 - seg(frame, 734, 750));
  const step3 = seg(frame, 734, 750) * (1 - seg(frame, 805, 821));

  const heroPop5 = pop(814);
  const hero5 = Math.min(1, heroPop5 + 0.6);

  const bubbleW = 300;
  const bubbleX = WIN_DEFAULT.x + WIN_DEFAULT.w - bubbleW - 24;
  const bubbleY = WIN_DEFAULT.y + 24;

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : the pile of identical decisions ---------------- */}
        <Group opacity={b1}>
          <div style={{ position: "absolute", left: 150, top: 34, width: 470, opacity: hero1 }}>
            <div style={{ fontSize: 96, lineHeight: 1, fontWeight: 800, letterSpacing: -4, color: P.danger, fontVariantNumeric: "tabular-nums" }}>50+</div>
            <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, letterSpacing: 2, color: P.muted }}>ARTICLES A DAY</div>
          </div>
          <StatPill x={700} y={60} emoji="😩" text="Every one needs its own decision" tone="danger" opacity={b1} />
          <CaptionBand y={680} text="Fifty articles a day, each one needing a decision" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : the pile is really three repeated decisions ---------------- */}
        <Group opacity={b2}>
          <div style={{ position: "absolute", left: 0, top: 40, width: 1280, textAlign: "center", fontSize: 24, fontWeight: 700, color: P.ink, opacity: b2 }}>
            Pick the picture. Pick the language. Pick where it goes.
          </div>
          <CaptionBand y={680} text="Hours of it, every single day" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- the deck itself: stack (b1) flies into a fan (b2) ---------------- */}
        <Group opacity={deck}>
          {FILLERS.map((f, i) => (
            <CardFace key={`f${i}`} x={f.x} y={f.y} rotate={f.rotate} opacity={1 - flyT} tone="card" />
          ))}
          {[0, 1, 2].map((i) => {
            const x = lerp(STACK[i].x, FAN[i].x, flyT);
            const y = lerp(STACK[i].y, FAN[i].y, flyT);
            const rotate = lerp(STACK[i].rotate, FAN[i].rotate, flyT);
            const label = LABELS[i];
            return (
              <CardFace key={i} x={x} y={y} rotate={rotate} opacity={1} tone="accent">
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, opacity: 1 - flyT }}>
                    📰
                  </div>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: flyT }}>
                    <div style={{ fontSize: 40 }}>{label.icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>{label.text}</div>
                  </div>
                </div>
              </CardFace>
            );
          })}
        </Group>

        {/* ---------------- beat 3 : one Telegram message replaces the pile ---------------- */}
        <Group opacity={b3}>
          <StatPill x={70} y={70} emoji="💬" text="One Telegram message" tone="accent" opacity={b3} />
          <StatPill x={70} y={130} emoji="🔁" text="Fills itself in as you tap" tone="accent" opacity={b3} />
          <CaptionBand y={680} text="One Telegram message replaces the whole workflow" tone="accent" opacity={b3} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-p18"
          from={397}
          hold={202}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b3}
          win={WIN_DEFAULT}
        />

        {/* ---------------- beat 4 : the same bubble rewrites itself, question by question ---------------- */}
        <Group opacity={b4}>
          <FilterChip x={70} y={70} text="Telegram Bot API" icon="⚙" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <div style={{ position: "absolute", left: bubbleX, top: bubbleY, width: bubbleW, borderRadius: 18, background: P.card, border: `2px solid ${P.accentEdge}`, boxShadow: cardShadow, padding: "18px 20px" }}>
            <div style={{ position: "relative", height: 74 }}>
              {[step1, step2, step3].map((op, i) => (
                <div key={i} style={{ position: "absolute", inset: 0, opacity: op, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 34 }}>{LABELS[i].icon}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, color: P.muted }}>NEXT QUESTION</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: P.ink, marginTop: 4 }}>{LABELS[i].text}?</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CaptionBand y={680} text="Same bubble, next question — nothing to open, nothing to type" tone="accent" opacity={b4} />
        </Group>
        <LiveWindow
          file={shots}
          shot="commits"
          title="github.com/…/commits"
          from={592}
          hold={229}
          zoom={(t) => 1 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b4}
          win={WIN_DEFAULT}
        />

        {/* ---------------- beat 5 : hours become eight seconds ---------------- */}
        <Group opacity={b5}>
          <div style={{ position: "absolute", left: 150, top: 34, width: 470, opacity: hero5 }}>
            <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 800, letterSpacing: -4, color: P.success, fontVariantNumeric: "tabular-nums" }}>8</div>
            <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>SECONDS PER ARTICLE</div>
          </div>
          <StatPill x={520} y={50} emoji="⚡" text="Four taps" tone="success" opacity={b5} />
          <StatPill x={520} y={110} emoji="✅" text="Published" tone="success" opacity={b5} />
          <CheckBadge x={900} y={50} size={44} opacity={b5} scale={heroPop5} />
          <CaptionBand y={680} text="Four taps. Eight seconds. Published." tone="success" opacity={b5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="actions"
          title="github.com/…/actions"
          from={814}
          hold={188}
          zoom={(t) => 1 + 0.12 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
          win={WIN_DEFAULT}
        />
      </div>
    </PaletteProvider>
  );
};
