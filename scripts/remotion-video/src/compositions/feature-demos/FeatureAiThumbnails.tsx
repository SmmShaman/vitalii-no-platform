/**
 * FeatureAiThumbnails — feature p11 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: an endless wall of manual thumbnail drafts, then Gemini generating
 * 4 psychology-driven concepts in one pass and a moderator tapping the
 * winner straight from Telegram.
 *
 * Story (4 beats):
 *  1. Problem — 15-20 minutes of manual mockups per video, mediocre
 *     click-through, a bottleneck on every single upload. Red zone.
 *  2. Solution — generate-ai-thumbnail.js hands Gemini the article; it
 *     returns 4 concepts, each built around a different psychological hook.
 *  3. How it ships — all 4 land in a Telegram moderation channel; one tap
 *     picks the winner and sends it straight to the pipeline.
 *  4. Result — 15-20 min → 5 seconds, ≈180× faster, 4 A/B options for free.
 *     Green zone, check badge.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  BrowserWindow,
  SkeletonScroll,
  FilterChip,
  StatPill,
  FlowArrow,
  StickyNote,
  Cursor,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

type Concept = { emoji: string; hook: string; caption: string };

const CONCEPTS: Concept[] = [
  { emoji: "📊", hook: "Data point", caption: "62% faster in benchmarks" },
  { emoji: "😲", hook: "Emotional face", caption: "Developer's shocked reaction" },
  { emoji: "⚡", hook: "High contrast", caption: "Neon chip, dark background" },
  { emoji: "❓", hook: "Bold question", caption: "Is this the end of Moore's Law?" },
];

export const FeatureAiThumbnails: React.FC = () => {
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
  const scroll = frame * 2.2;
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const chip1 = pop(132);
  const chip2 = pop(142);
  const chip3 = pop(152);
  const chip4 = pop(164);
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: one tap picks the winner ───────────────────────────────
  const cx = interpolate(frame, [248, 262, 300, 316], [950, 300, 300, 950], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [248, 262, 300, 316], [500, 254, 254, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 248, 258) * (1 - seg(frame, 310, 320));
  const click1 = seg(frame, 266, 282, Easing.out(Easing.quad));
  const picked = seg(frame, 282, 298);
  const check3 = pop(288);
  const cap3 = seg(frame, 260, 282, Easing.out(Easing.cubic));

  // ── Beat 4: the result ────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const speedX = Math.round(interpolate(frame, [384, 414], [1, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Designing one YouTube thumbnail takes" accentText="15-20 minutes" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="thumbnail editor — draft #12" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: a thumbnail that stops the scroll and earns the click"
        />
        <StatPill x={846} y={340} emoji="🎨" text="15-20 min of manual design" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="📉" text="Mediocre click-through" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😩" text="A bottleneck every video" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Endless drafts and mockups — one thumbnail eats 15-20 minutes" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Gemini designs 4 options in" accentText="one pass" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={90} y={132} text="📊 Data point" icon="✓" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={360} y={132} text="😲 Emotional face" icon="✓" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={650} y={132} text="⚡ High contrast" icon="✓" scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={930} y={132} text="❓ Bold question" icon="✓" scale={chip4} opacity={Math.min(1, chip4)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="generate-ai-thumbnail.js — Gemini output" opacity={seg(frame, 168, 182)}>
          <div style={{ position: "relative", width: 1060, height: 354, padding: 20, boxSizing: "border-box", fontFamily }}>
            {CONCEPTS.map((c, i) => {
              const col = i % 2;
              const row = Math.floor(i / 2);
              const t = seg(frame, 184 + i * 12, 184 + i * 12 + 14);
              return (
                <div
                  key={c.hook}
                  style={{
                    position: "absolute",
                    left: col === 0 ? 0 : 520,
                    top: row === 0 ? 0 : 170,
                    width: 500,
                    height: 140,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "0 22px",
                    borderRadius: 16,
                    background: B.accentBg,
                    border: `1.5px solid #C4D7FB`,
                    opacity: t,
                    transform: `scale(${0.94 + t * 0.06})`,
                  }}
                >
                  <div style={{ fontSize: 46 }}>{c.emoji}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: B.accent, letterSpacing: 0.3, textTransform: "uppercase" }}>{c.hook}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: B.ink, marginTop: 4, lineHeight: 1.25 }}>{c.caption}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 328,
              width: 1060,
              textAlign: "center",
              fontSize: 15.5,
              fontWeight: 600,
              color: B.muted,
              opacity: seg(frame, 214, 228) * 0.9,
            }}
          >
            …all 4 ready for review, in the same pass
          </div>
        </BrowserWindow>
        <CaptionBand text="One prompt, four distinct hooks — each engineered to earn a different kind of click" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — ONE TAP PICKS THE WINNER ════ */}
      <Group opacity={b3}>
        <Headline text="One tap in Telegram" accentText="picks the winner" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <BrowserWindow x={190} y={208} w={900} h={340} title="Telegram — moderation channel" opacity={seg(frame, 244, 258)}>
          <div style={{ padding: "6px 0" }}>
            {CONCEPTS.map((c, i) => {
              const isWinner = i === 0;
              const win = isWinner ? picked : 0;
              return (
                <div
                  key={c.hook}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 24px",
                    borderBottom: `1px solid ${B.border}`,
                    background: isWinner ? `rgba(230,247,236,${win})` : "transparent",
                  }}
                >
                  <div style={{ fontSize: 30 }}>{c.emoji}</div>
                  <div style={{ flex: 1, fontSize: 17, fontWeight: 650, color: B.ink }}>{c.caption}</div>
                  <div
                    style={{
                      padding: "4px 14px",
                      borderRadius: 999,
                      fontSize: 13.5,
                      fontWeight: 700,
                      background: isWinner ? B.successBg : B.chipBg,
                      color: isWinner ? B.success : B.muted,
                      border: `1px solid ${isWinner ? "#BFE7CD" : B.border}`,
                    }}
                  >
                    {isWinner ? "Approved" : "Ready"}
                  </div>
                  {isWinner ? (
                    <div style={{ position: "relative", width: 26, height: 26, transform: `scale(${check3})`, opacity: check3 }}>
                      <CheckBadge x={0} y={0} size={26} scale={1} opacity={1} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={click1 % 1} />
        <CaptionBand text="All 4 land in Telegram — a single tap sends the winner straight to the pipeline" tone="accent" opacity={cap3} />
      </Group>

      {/* ════ Beat 4 — RESULT ════ */}
      <Group opacity={b4}>
        <Headline text="The payoff" opacity={seg(frame, 344, 358)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>15-20 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>manual mockups, weak CTR</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>5 sec</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>one tap, 4 options ready</div>
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
            opacity: speedOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{speedX}× faster</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Every video ships with 4 built-in A/B options — no extra work.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>AI Thumbnails · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
