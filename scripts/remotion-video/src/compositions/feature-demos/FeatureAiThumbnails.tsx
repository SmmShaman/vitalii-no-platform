/**
 * FeatureAiThumbnails — feature p11 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * ART-DIRECTION REWRITE (2026-08-30), drawn from `out/lux-batch-instructions.md`:
 *   archetype = 3 "card deck"   mood = sand   (const P = MOODS.sand)
 *   rhythm    = 4 beats (~136 / ~126 / ~114 / ~90 frames)
 *   transition = the 4 concept cards SLIDE in from off-screen right (not a
 *   crossfade) once the draft pile has fully faded — the deck itself carries
 *   the story forward physically across beats 2→3→4 (fan out, tap, shrink to
 *   corner) instead of being re-drawn per beat.
 *
 * Story (kept from the old version, staging rebuilt):
 *  1. Problem — a messy pile of manual thumbnail drafts, 15-20 minutes and
 *     still not right. Red statpills.
 *  2. Solution — 4 concept cards fly in from Gemini and land as a stack,
 *     then fan into a 2×2 grid, one per psychological hook.
 *  3. How it ships — a Telegram window frames the grid; a cursor taps the
 *     winner, which glows green while the other three shrink away.
 *  4. Result — the winning card shrinks into the corner as proof while a
 *     hero number lands: 15-20 min → 5 sec, ≈180× faster.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  BrowserWindow,
  StatPill,
  FlowArrow,
  Cursor,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.sand;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Concept = { emoji: string; hook: string; caption: string };

const CONCEPTS: Concept[] = [
  { emoji: "📊", hook: "Data point", caption: "62% faster in benchmarks" },
  { emoji: "😲", hook: "Emotional face", caption: "Developer's shocked reaction" },
  { emoji: "⚡", hook: "High contrast", caption: "Neon chip, dark background" },
  { emoji: "❓", hook: "Bold question", caption: "Is this the end of Moore's Law?" },
];

const SLOTS = [
  { x: 355, y: 150 },
  { x: 655, y: 150 },
  { x: 355, y: 340 },
  { x: 655, y: 340 },
] as const;

const DRAFTS: { title: string; dx: number; dy: number; rot: number; at: number }[] = [
  { title: "Draft #1", dx: 0, dy: 0, rot: -7, at: 18 },
  { title: "Draft #2", dx: 22, dy: -14, rot: 5, at: 30 },
  { title: "Draft #3", dx: -16, dy: -30, rot: -4, at: 42 },
  { title: "Draft #4", dx: 34, dy: -46, rot: 8, at: 54 },
  { title: "Draft #5", dx: -28, dy: -62, rot: -9, at: 66 },
  { title: "Draft #6", dx: 12, dy: -78, rot: 3, at: 78 },
];

export const FeatureAiThumbnails: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (headline/statpill/caption groups only) ───────────
  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 120, 136)) * lf;
  const b2 = seg(frame, 136, 152) * (1 - seg(frame, 246, 262)) * lf;
  const b3 = seg(frame, 254, 270) * (1 - seg(frame, 352, 368)) * lf;
  const b4 = seg(frame, 360, 376) * lf;

  // ── The deck: 4 concept cards, alive from beat 2 through beat 4 ────
  const cardState = (i: number) => {
    const winner = i === 0;
    const eS = 138 + i * 10;
    const eE = eS + 18;
    const fS = 192 + i * 10;
    const fE = fS + 26;
    const slot = SLOTS[i];
    const stX = 505 + i * 4;
    const stY = 225 - i * 4;
    const stR = -8 + i * 5;
    let x: number, y: number, rot: number, scale: number, opacity: number;
    if (winner) {
      x = interpolate(frame, [eS, eE, fS, fE, 356, 376], [1400, stX, stX, slot.x, slot.x, 90], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
      y = interpolate(frame, [eS, eE, fS, fE, 356, 376], [260, stY, stY, slot.y, slot.y, 250], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
      rot = interpolate(frame, [eS, eE, fS, fE], [14, stR, stR, 0], CLAMP);
      scale = interpolate(frame, [eS, eE, 300, 316, 356, 376], [0.85, 1, 1, 1.14, 1.14, 0.85], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
      opacity = interpolate(frame, [eS, eS + 8], [0, 1], CLAMP);
    } else {
      const xS = 316 + (i - 1) * 10;
      const xE = xS + 22;
      x = interpolate(frame, [eS, eE, fS, fE], [1400, stX, stX, slot.x], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
      y = interpolate(frame, [eS, eE, fS, fE], [260, stY, stY, slot.y], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
      rot = interpolate(frame, [eS, eE, fS, fE], [14, stR, stR, 0], CLAMP);
      scale = interpolate(frame, [eS, eE, xS, xE], [0.85, 1, 1, 0], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
      opacity = interpolate(frame, [eS, eS + 8, xS, xE], [0, 1, 1, 0], CLAMP);
    }
    return { x, y, rot, scale, opacity: opacity * lf };
  };

  // ── Beat 3: cursor taps the winner ──────────────────────────────────
  const cursorX = interpolate(frame, [288, 300, 312, 326], [1050, 490, 490, 1050], { ...CLAMP, easing: Easing.inOut(Easing.quad) });
  const cursorY = interpolate(frame, [288, 300, 312, 326], [560, 235, 235, 560], { ...CLAMP, easing: Easing.inOut(Easing.quad) });
  const cursorOpacity = seg(frame, 286, 296) * (1 - seg(frame, 320, 330));
  const clickAmt = seg(frame, 300, 316, Easing.out(Easing.quad));
  const winnerGlow = seg(frame, 300, 316);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Beat 1 — PROBLEM: the messy draft pile ════ */}
        <Group opacity={b1}>
          <Headline text="Every thumbnail starts as" accentText="another blind draft" accentColor={P.danger} opacity={seg(frame, 4, 18)} />
          {DRAFTS.map((d) => {
            const s = pop(d.at);
            if (s <= 0.004) return null;
            return (
              <div
                key={d.title}
                style={{
                  position: "absolute",
                  left: 150 + d.dx,
                  top: 330 + d.dy,
                  width: 250,
                  height: 150,
                  borderRadius: 14,
                  background: P.card,
                  border: `1.5px solid ${P.dangerEdge}`,
                  boxShadow: cardShadow,
                  transform: `rotate(${d.rot}deg) scale(${s})`,
                  transformOrigin: "center",
                  opacity: Math.min(1, s),
                  padding: "16px 18px",
                  boxSizing: "border-box",
                  fontFamily,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: P.danger, letterSpacing: 0.3 }}>{d.title}</div>
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {[0.85, 0.65, 0.5].map((f, k) => (
                    <div key={k} style={{ width: `${f * 100}%`, height: 9, borderRadius: 5, background: P.chipBg }} />
                  ))}
                </div>
              </div>
            );
          })}
          <StatPill x={760} y={200} emoji="🎨" text="15-20 minutes of manual design" tone="danger" scale={pop(58)} opacity={Math.min(1, pop(58))} />
          <StatPill x={760} y={262} emoji="📉" text="Mediocre click-through" tone="danger" scale={pop(70)} opacity={Math.min(1, pop(70))} />
          <StatPill x={760} y={324} emoji="😩" text="A bottleneck every video" tone="danger" scale={pop(82)} opacity={Math.min(1, pop(82))} />
          <CaptionBand text="Endless drafts, never quite right — 15-20 minutes gone every time" tone="danger" opacity={seg(frame, 90, 106)} />
        </Group>

        {/* ════ Beat 2 — SOLUTION: Gemini's 4 concepts land ════ */}
        <Group opacity={b2}>
          <Headline text="Gemini designs 4 options in" accentText="one pass" accentColor={P.accent} opacity={seg(frame, 140, 156)} />
          <CaptionBand text="One prompt, four distinct hooks — each engineered to earn a different kind of click" tone="accent" opacity={seg(frame, 230, 246)} />
          <div style={{ position: "absolute", left: 0, top: 600, width: 1280, textAlign: "center", fontSize: 14.5, fontWeight: 600, color: P.muted, opacity: seg(frame, 236, 252), fontFamily }}>
            via Google Gemini API — generate-ai-thumbnail.js
          </div>
        </Group>

        {/* ════ Beat 3 — HOW: a tap in Telegram picks the winner ════ */}
        <BrowserWindow x={300} y={104} w={680} h={470} title="Telegram — moderation channel" opacity={seg(frame, 254, 270)} />
        <Group opacity={b3}>
          <Headline text="One tap in Telegram" accentText="picks the winner" accentColor={P.accent} opacity={seg(frame, 258, 274)} />
          <CaptionBand text="All four land in Telegram — a single tap sends the winner straight to the pipeline" tone="accent" opacity={seg(frame, 278, 294)} />
        </Group>
        <Cursor x={cursorX} y={cursorY} opacity={cursorOpacity} click={clickAmt} />

        {/* ════ The deck itself — persists across beats 2, 3, 4 ════ */}
        {CONCEPTS.map((c, i) => {
          const st = cardState(i);
          if (st.opacity <= 0.004) return null;
          const winner = i === 0;
          const hl = winner ? winnerGlow : 0;
          return (
            <div
              key={c.hook}
              style={{
                position: "absolute",
                left: st.x,
                top: st.y,
                width: 270,
                height: 170,
                transform: `rotate(${st.rot}deg) scale(${st.scale})`,
                transformOrigin: "top left",
                opacity: st.opacity,
                borderRadius: 18,
                background: P.card,
                border: `2px solid ${hl > 0.5 ? P.successEdge : P.accentEdge}`,
                boxShadow: hl > 0.4 ? `0 0 0 ${hl * 6}px ${P.successBg}, ${cardShadow}` : cardShadow,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
              }}
            >
              <div style={{ fontSize: 40 }}>{c.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: P.accent, textTransform: "uppercase", letterSpacing: 0.4, marginTop: 8 }}>{c.hook}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: P.ink, marginTop: 6, lineHeight: 1.25, padding: "0 16px", textAlign: "center" }}>{c.caption}</div>
              {winner && hl > 0.3 ? (
                <div style={{ position: "absolute", right: 12, top: 12 }}>
                  <CheckBadge x={0} y={0} size={26} scale={Math.min(1, hl * 1.4)} opacity={Math.min(1, hl * 1.4)} />
                </div>
              ) : null}
            </div>
          );
        })}

        {/* ════ Beat 4 — RESULT ════ */}
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: 90, top: 220, fontSize: 15, fontWeight: 700, color: P.accent, letterSpacing: 1, opacity: seg(frame, 362, 378), fontFamily }}>
            SELECTED CONCEPT
          </div>
          <FlowArrow x={400} y={330} len={140} progress={seg(frame, 372, 392, Easing.inOut(Easing.cubic))} color={P.success} />
          <div style={{ position: "absolute", left: 580, top: 140, width: 640, fontFamily }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: P.muted, textDecoration: "line-through", opacity: seg(frame, 376, 392) }}>was 15-20 min</div>
            <div style={{ fontSize: 118, fontWeight: 800, color: P.success, letterSpacing: -4, opacity: Math.min(1, pop(388)) }}>5 sec</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: P.accent, marginTop: 8, opacity: seg(frame, 402, 418) }}>≈180× faster · 4 options, free</div>
          </div>
          <CheckBadge x={300} y={365} size={44} scale={pop(392)} opacity={Math.min(1, pop(392))} />
          <div style={{ position: "absolute", left: 0, top: 560, width: 1280, textAlign: "center", opacity: seg(frame, 412, 428), fontFamily }}>
            <div style={{ fontSize: 21, fontWeight: 650, color: P.muted }}>Every video ships with 4 built-in A/B options — no extra work.</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: P.accent, marginTop: 10 }}>AI Thumbnails · vitalii.no</div>
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
