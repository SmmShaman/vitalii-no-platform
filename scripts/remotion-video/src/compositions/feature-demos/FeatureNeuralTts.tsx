/**
 * FeatureNeuralTts — feature p12 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * ART-DIRECTION REWRITE (2026-08-30), drawn from `out/lux-batch-instructions.md`:
 *   archetype = 4 "flow map"   mood = slate   (const P = MOODS.slate)
 *   rhythm    = 4 beats (~136 / ~126 / ~116 / ~90 frames)
 *   transition = beat 1's two broken routes SLIDE off-screen left while
 *   beat 2's clean route slides in from the right (not a crossfade) — the
 *   whole map physically swaps instead of dissolving.
 *
 * Story (kept from the old version, staging rebuilt):
 *  1. Problem — two routes off one "new article" node both dead-end badly:
 *     robotic TTS, or a $50-200/video human voice actor → $250-2000/day.
 *  2. Solution — one clean route: article text → Zvukogram API, which
 *     branches into .mp3 audio AND a word_timestamps JSON array, both
 *     feeding into Remotion's AnimatedSubtitles node.
 *  3. How it stays perfect — a mock video frame shows captions lighting up
 *     one word at a time, driven by those exact timestamps.
 *  4. Result — $250-2000/day → a few dollars a day, quality indistinguishable
 *     from human.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  IconCard,
  StatPill,
  FlowArrow,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.slate;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const CAPTION_WORDS = ["Ukraine's", "tech", "sector", "keeps", "shipping", "features"];

/** A route segment between two node centers; draws on with `progress` 0..1. */
const Route: React.FC<{ x1: number; y1: number; x2: number; y2: number; progress: number; color: string; opacity?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  progress,
  color,
  opacity = 1,
}) => {
  if (progress <= 0.004 || opacity <= 0.004) return null;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y1 - 2,
        width: len * progress,
        height: 4,
        borderRadius: 2,
        background: color,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "0 50%",
        opacity,
      }}
    />
  );
};

/** A small glowing dot traveling a route, `t` 0..1. */
const Token: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; color: string }> = ({ x1, y1, x2, y2, t, color }) => {
  if (t <= 0 || t >= 1) return null;
  const x = x1 + (x2 - x1) * t;
  const y = y1 + (y2 - y1) * t;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 6,
        top: y - 6,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }}
    />
  );
};

const Title: React.FC<{ text: string; sub?: string; subColor?: string; opacity: number }> = ({ text, sub, subColor, opacity }) => (
  <div style={{ position: "absolute", left: 50, top: 34, opacity, fontFamily }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: P.ink }}>{text}</div>
    {sub ? <div style={{ fontSize: 17, fontWeight: 700, color: subColor ?? P.muted, marginTop: 6 }}>{sub}</div> : null}
  </div>
);

export const FeatureNeuralTts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const travel = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], CLAMP);

  // ── Map-swap transition: routes slide off/on, not a crossfade ──────
  const slideOut = interpolate(frame, [112, 138], [0, -1280], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const slideIn = interpolate(frame, [112, 138], [1280, 0], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });

  // ── Beat 3 & 4 windows (normal crossfades) ──────────────────────────
  const b3 = seg(frame, 250, 266) * (1 - seg(frame, 356, 372)) * lf;
  const b4 = seg(frame, 360, 376) * lf;

  // ── Beat 3: word-perfect sync ────────────────────────────────────────
  const videoOp = seg(frame, 254, 270, Easing.out(Easing.cubic));
  const wordStart = 278;
  const wordStep = 11;
  const activeIdx = Math.max(0, Math.min(CAPTION_WORDS.length - 1, Math.floor((frame - wordStart) / wordStep)));
  const jsonPill = pop(292);
  const techCap = seg(frame, 316, 332);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Beat 1 — PROBLEM: two broken routes (slides off left) ════ */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${slideOut}px)`, opacity: seg(frame, 0, 10) * lf }}>
          <Title text="Two broken paths to a voiceover" sub="Both blow the budget" subColor={P.danger} opacity={seg(frame, 4, 18)} />
          <Route x1={140} y1={195} x2={490} y2={145} progress={seg(frame, 26, 40)} color={P.danger} />
          <Token x1={140} y1={195} x2={490} y2={145} t={travel(40, 52)} color={P.danger} />
          <Route x1={490} y1={145} x2={780} y2={145} progress={seg(frame, 52, 64)} color={P.danger} />
          <Token x1={490} y1={145} x2={780} y2={145} t={travel(64, 76)} color={P.danger} />
          <Route x1={140} y1={195} x2={490} y2={395} progress={seg(frame, 30, 44)} color={P.danger} />
          <Token x1={140} y1={195} x2={490} y2={395} t={travel(44, 56)} color={P.danger} />
          <Route x1={490} y1={395} x2={800} y2={395} progress={seg(frame, 56, 70)} color={P.danger} />
          <Token x1={490} y1={395} x2={800} y2={395} t={travel(70, 84)} color={P.danger} />

          <IconCard x={40} y={140} w={200} emoji="📄" title="New article" sub="needs a voice" tone="card" scale={pop(14)} opacity={Math.min(1, pop(14))} />
          <IconCard x={380} y={90} w={220} emoji="🤖" title="Standard TTS" sub="Google · AWS Polly" tone="danger" scale={pop(40)} opacity={Math.min(1, pop(40))} />
          <IconCard x={680} y={90} w={200} emoji="😬" title="Sounds robotic" sub="viewers bounce" tone="danger" scale={pop(64)} opacity={Math.min(1, pop(64))} />
          <IconCard x={380} y={340} w={220} emoji="🎤" title="Voice actor" sub="$50–200 / video" tone="danger" scale={pop(44)} opacity={Math.min(1, pop(44))} />
          <IconCard x={680} y={340} w={240} emoji="💸" title="$250–2,000/day" sub="for 5–10 videos" tone="danger" scale={pop(70)} opacity={Math.min(1, pop(70))} />
          <CaptionBand text="Neither option scales — too robotic, or too expensive" tone="danger" opacity={seg(frame, 88, 102)} />
        </div>

        {/* ════ Beat 2 — SOLUTION: one clean route (slides in from right) ════ */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${slideIn}px)`, opacity: (1 - seg(frame, 246, 262)) * lf }}>
          <Title text="One clean path: Zvukogram" sub="Text in, human-quality audio + timestamps out" subColor={P.accent} opacity={seg(frame, 144, 160)} />
          <Route x1={170} y1={345} x2={530} y2={345} progress={seg(frame, 154, 168)} color={P.accent} />
          <Token x1={170} y1={345} x2={530} y2={345} t={travel(168, 180)} color={P.accent} />
          <Route x1={530} y1={345} x2={890} y2={225} progress={seg(frame, 186, 200)} color={P.success} />
          <Token x1={530} y1={345} x2={890} y2={225} t={travel(200, 212)} color={P.success} />
          <Route x1={530} y1={345} x2={910} y2={465} progress={seg(frame, 186, 200)} color={P.success} />
          <Token x1={530} y1={345} x2={910} y2={465} t={travel(200, 212)} color={P.success} />
          <Route x1={890} y1={225} x2={1150} y2={345} progress={seg(frame, 212, 226)} color={P.success} />
          <Token x1={890} y1={225} x2={1150} y2={345} t={travel(226, 238)} color={P.success} />
          <Route x1={910} y1={465} x2={1150} y2={345} progress={seg(frame, 212, 226)} color={P.success} />
          <Token x1={910} y1={465} x2={1150} y2={345} t={travel(226, 238)} color={P.success} />

          <IconCard x={60} y={290} w={220} emoji="📝" title="Article script" sub="raw text, ready to voice" tone="card" scale={pop(144)} opacity={Math.min(1, pop(144))} />
          <IconCard x={400} y={290} w={260} emoji="🔊" title="Zvukogram API" sub="human-quality neural voice" tone="accent" scale={pop(168)} opacity={Math.min(1, pop(168))} />
          <IconCard x={780} y={170} w={220} emoji="🎧" title=".mp3 audio" sub="ready to publish" tone="success" scale={pop(200)} opacity={Math.min(1, pop(200))} />
          <IconCard x={780} y={410} w={260} emoji="🕒" title="word_timestamps" sub="{word, start, end}" tone="success" scale={pop(204)} opacity={Math.min(1, pop(204))} />
          <IconCard x={1040} y={290} w={220} emoji="🎬" title="AnimatedSubtitles" sub="Remotion component" tone="accent" scale={pop(226)} opacity={Math.min(1, pop(226))} />
          <StatPill x={190} y={478} emoji="🔁" text="pivot from OpenAI TTS — better quality + exact timing" tone="accent" scale={pop(180)} opacity={Math.min(1, pop(180))} fontSize={16.5} />
          <CaptionBand text="Real text goes in, human-quality audio and word timestamps come out" tone="accent" opacity={seg(frame, 236, 252)} />
        </div>

        {/* ════ Beat 3 — WORD-PERFECT SYNC ════ */}
        <Group opacity={b3}>
          <Title text="Captions light up word by word" sub="Driven by the exact timestamps above" subColor={P.success} opacity={seg(frame, 258, 274)} />
          <div
            style={{
              position: "absolute",
              left: 340,
              top: 150,
              width: 600,
              height: 340,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(16,24,40,0.22)",
              opacity: videoOp,
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #16324A 0%, #0B1D2E 100%)" }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 34,
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 10,
                padding: "0 34px",
              }}
            >
              {CAPTION_WORDS.map((w, i) => (
                <span
                  key={w}
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: i === activeIdx ? "#FFD35A" : "#FFFFFF",
                    textShadow: "0 2px 8px rgba(0,0,0,0.55)",
                    fontFamily,
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
          <StatPill x={454} y={510} emoji="🕒" text="word_timestamps: {word, start_time, end_time}" tone="success" scale={jsonPill} opacity={Math.min(1, jsonPill)} fontSize={16.5} />
          <CaptionBand text="Each word lights up exactly when it's spoken — no guessing, no drift" tone="success" opacity={seg(frame, 300, 316)} y={614} />
          <div style={{ position: "absolute", left: 0, top: 590, width: 1280, textAlign: "center", fontSize: 15, fontWeight: 600, color: P.muted, opacity: techCap, fontFamily }}>
            via Remotion's AnimatedSubtitles component
          </div>
        </Group>

        {/* ════ Beat 4 — RESULT ════ */}
        <Group opacity={b4}>
          <Title text="The payoff" opacity={seg(frame, 362, 378)} />
          <StatPill x={90} y={260} emoji="💸" text="$250–2,000/day" tone="danger" scale={pop(368)} opacity={Math.min(1, pop(368))} />
          <FlowArrow x={380} y={290} len={160} progress={seg(frame, 380, 398, Easing.inOut(Easing.cubic))} color={P.success} />
          <div style={{ position: "absolute", left: 580, top: 160, width: 640, fontFamily }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: P.muted, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 68, fontWeight: 800, color: P.success, opacity: Math.min(1, pop(392)) }}>a few dollars/day</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: P.accent, marginTop: 10, opacity: seg(frame, 402, 418) }}>quality: indistinguishable from human</div>
          </div>
          <CheckBadge x={590} y={330} size={44} scale={pop(410)} opacity={Math.min(1, pop(410))} />
          <div style={{ position: "absolute", left: 0, top: 560, width: 1280, textAlign: "center", opacity: seg(frame, 420, 436), fontFamily }}>
            <div style={{ fontSize: 21, fontWeight: 650, color: P.muted }}>Word-level sync turns generic captions into a polished, synced overlay.</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: P.accent, marginTop: 10 }}>Zvukogram TTS · vitalii.no</div>
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
