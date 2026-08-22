/**
 * FeatureNeuralTts — feature p12 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a mock video frame with live
 * word-by-word caption highlighting, and a big before→after cost metric.
 *
 * Story (4 beats):
 *  1. Problem — 5-10 videos a day need a voiceover; standard TTS sounds
 *     robotic, human voice actors cost $50-200/video → $250-2000/day. Red zone.
 *  2. Solution — one API swap: article text goes into Zvukogram, which
 *     returns human-quality .mp3 audio plus a word_timestamps JSON array.
 *  3. How it stays perfect — a mock video frame shows captions lighting up
 *     one word at a time, driven by those exact timestamps. Tech-credibility
 *     line: Remotion's AnimatedSubtitles component.
 *  4. Result — before/after cost cards: $250-2000/day → a few dollars a day,
 *     audio quality virtually indistinguishable from human. Green zone.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  IconCard,
  FlowArrow,
  StatPill,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const CAPTION_WORDS = ["Ukraine's", "tech", "sector", "keeps", "shipping", "features"];

export const FeatureNeuralTts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows ──────────────────────────────────────────────────
  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: the problem ───────────────────────────────────────────
  const card1 = pop(20);
  const card2 = pop(32);
  const pill1 = pop(56);
  const cap1 = seg(frame, 64, 80);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const cardA = pop(132);
  const cardB = pop(150);
  const cardC = pop(170);
  const arr1 = seg(frame, 140, 154, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 158, 172, Easing.inOut(Easing.cubic));
  const pivotPill = pop(184);
  const cap2 = seg(frame, 198, 214);

  // ── Beat 3: word-perfect sync ──────────────────────────────────────
  const videoOp = seg(frame, 244, 258, Easing.out(Easing.cubic));
  const wordStart = 262;
  const wordStep = 11;
  const activeIdx = Math.max(0, Math.min(CAPTION_WORDS.length - 1, Math.floor((frame - wordStart) / wordStep)));
  const jsonPill = pop(276);
  const cap3 = seg(frame, 296, 312);
  const techCap = seg(frame, 300, 316);

  // ── Beat 4: the result ────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="5-10 videos a day, and one" accentText="voice problem" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <IconCard x={210} y={150} w={300} emoji="🤖" title="Standard TTS" sub="sounds painfully robotic" tone="danger" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={770} y={150} w={300} emoji="🎤" title="Human voice actors" sub="$50–200 per video" tone="danger" scale={card2} opacity={Math.min(1, card2)} />
        <StatPill x={454} y={378} emoji="💸" text="$250–2000/day for 5–10 videos" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <CaptionBand text="Neither option scales — too robotic, or too expensive" tone="danger" opacity={cap1} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="One API swap:" accentText="Zvukogram" accentColor={B.accent} opacity={seg(frame, 116, 130)} />
        <IconCard x={110} y={190} w={300} emoji="📝" title="Article script" sub="raw text, ready to voice" tone="card" scale={cardA} opacity={Math.min(1, cardA)} />
        <IconCard x={490} y={190} w={300} emoji="🔊" title="Zvukogram API" sub="human-quality neural voice" tone="accent" scale={cardB} opacity={Math.min(1, cardB)} />
        <IconCard x={870} y={190} w={300} emoji="🎧" title=".mp3 + word timestamps" sub="{word, start, end}" tone="success" scale={cardC} opacity={Math.min(1, cardC)} />
        <FlowArrow x={412} y={234} len={76} progress={arr1} />
        <FlowArrow x={792} y={234} len={76} progress={arr2} color={B.success} />
        <StatPill x={452} y={420} emoji="🔁" text="pivot from OpenAI TTS — better quality + exact timing" tone="accent" scale={pivotPill} opacity={Math.min(1, pivotPill)} fontSize={17} />
        <CaptionBand text="Real text goes in, human-quality audio and word timestamps come out" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — WORD-PERFECT SYNC ════ */}
      <Group opacity={b3}>
        <Headline text="Captions light up" accentText="word by word" accentColor={B.success} opacity={seg(frame, 240, 254)} />
        <div
          style={{
            position: "absolute",
            left: 340,
            top: 160,
            width: 600,
            height: 320,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(22,35,63,0.18)",
            opacity: videoOp,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #1B2C4D 0%, #0E1930 100%)" }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 30,
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
        <StatPill x={454} y={498} emoji="🕒" text="word_timestamps: {word, start_time, end_time}" tone="success" scale={jsonPill} opacity={Math.min(1, jsonPill)} fontSize={17} />
        <CaptionBand text="Each word lights up exactly when it's spoken — no guessing, no drift" tone="success" opacity={cap3} y={614} />
        <div style={{ position: "absolute", left: 0, top: 590, width: 1280, textAlign: "center", fontSize: 15, fontWeight: 600, color: B.muted, opacity: techCap, fontFamily }}>
          via Remotion's AnimatedSubtitles component
        </div>
      </Group>

      {/* ════ Beat 4 — RESULT ════ */}
      <Group opacity={b4}>
        <Headline text="The payoff" opacity={seg(frame, 344, 358)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: B.ink, marginTop: 14 }}>$250–2000</div>
            <div style={{ fontSize: 24, fontWeight: 650, color: B.muted, marginTop: 6 }}>spent per day on voiceover</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: B.ink, marginTop: 14 }}>a few dollars</div>
            <div style={{ fontSize: 24, fontWeight: 650, color: B.muted, marginTop: 6 }}>for the same 5–10 videos</div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 424,
            width: 1280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            opacity: seg(frame, 384, 398, Easing.out(Easing.cubic)),
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 34, fontWeight: 800, color: B.success }}>quality indistinguishable from human</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            One API call replaces a whole voiceover budget, every single day.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Zvukogram TTS · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
