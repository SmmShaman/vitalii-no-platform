/**
 * FeatureVideoFactoryV3 — feature p08 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * ART-DIRECTION DEMO (2026-08-30). Same feature and same story as
 * FeatureVideoFactory.tsx, staged under the new rules in
 * `out/lux-batch-instructions.md`:
 *   archetype  = 7 "hero number"  (drawn from the feature id)
 *   mood       = violet           (drawn from the feature id)
 *   rhythm     = 5 beats x 90 frames (the old clip was 4 beats x ~115)
 *   transition = one scale-push + slide-up (not every cut is a crossfade)
 *
 * One enormous figure owns the frame for the whole clip and MORPHS — 45 minutes
 * per video → 360 minutes a day → a countdown while the machine works → 3 →
 * 93%. Every other element is evidence arranged around it. No centered
 * headline, no zone panels, no 3-icon strip, no two result cards.
 *
 * Story (5 beats):
 *  1. 45 — the minutes one video costs by hand, with the four manual chores.
 *  2. 360 — the same 45 multiplied by the 8 articles that land in a day.
 *  3. One click on "Generate": the number is pushed into the corner and the
 *     real interface slides up from below; the clock starts falling.
 *  4. The machine stamps off each chore while the number lands on 3.
 *  5. 93% — before/after chips, the one tech-credibility line, check badge.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, interpolateColors, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  BrowserWindow,
  StatPill,
  FilterChip,
  Cursor,
  CheckBadge,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.violet;

/** Manual chores that make up the 45 minutes (beat 1). */
const CHORES: { emoji: string; text: string; x: number; y: number; at: number }[] = [
  { emoji: "📝", text: "Write the script · 12 min", x: 34, y: 214, at: 20 },
  { emoji: "🎙️", text: "Record the voice · 8 min", x: 34, y: 292, at: 30 },
  { emoji: "✂️", text: "Cut the subtitles · 15 min", x: 878, y: 214, at: 40 },
  { emoji: "📤", text: "Export two sizes · 10 min", x: 878, y: 292, at: 50 },
];

/** What the factory stamps off while the clock falls (beat 4). */
const STAMPS: { emoji: string; label: string; detail: string }[] = [
  { emoji: "📝", label: "Script written", detail: "18 lines · 92 words" },
  { emoji: "🎙️", label: "Voice recorded", detail: "92 sec · word-level captions" },
  { emoji: "🎬", label: "Video rendered", detail: "subtitles + blurred background" },
  { emoji: "📤", label: "Both formats out", detail: "1080×1920 · 1920×1080" },
];

export const FeatureVideoFactoryV3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows: 5 x 90 frames ───────────────────────────────────
  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 78, 92)) * lf;
  const b2 = seg(frame, 88, 100) * (1 - seg(frame, 168, 182)) * lf;
  const b3 = seg(frame, 178, 190) * (1 - seg(frame, 262, 274)) * lf;
  const b4 = seg(frame, 286, 300) * (1 - seg(frame, 350, 362)) * lf;
  const b5 = seg(frame, 358, 372) * lf;

  // ── The hero number: one element, five states ─────────────────────
  const heroSize = interpolate(frame, [0, 178, 214, 292, 330, 450], [300, 300, 104, 104, 268, 268], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const heroCX = interpolate(frame, [178, 214, 292, 330], [640, 176, 176, 858], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const heroTop = interpolate(frame, [178, 214, 292, 330], [188, 44, 44, 210], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const heroColor = interpolateColors(
    Math.min(frame, 420),
    [0, 150, 200, 300, 360],
    [P.danger, P.danger, P.accent, P.accent, P.success],
  );

  const heroValue = (): number => {
    if (frame < 92) return 45;
    if (frame < 160)
      return Math.round(
        interpolate(frame, [92, 160], [45, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
      );
    if (frame < 206) return 360;
    if (frame < 330)
      return Math.round(
        interpolate(frame, [206, 330], [360, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }),
      );
    if (frame < 372) return 3;
    return Math.round(
      interpolate(frame, [372, 418], [3, 93], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
    );
  };

  const heroLabel =
    frame < 92 ? "MINUTES FOR ONE VIDEO"
    : frame < 206 ? "MINUTES OF EDITING A DAY"
    : frame < 330 ? "MINUTES LEFT"
    : frame < 372 ? "MINUTES FOR ONE VIDEO"
    : "LESS TIME PER VIDEO";

  // ── Beat 2: the day stack ─────────────────────────────────────────
  const dayBar = seg(frame, 108, 158, Easing.out(Easing.cubic));

  // ── Beat 3: the push + slide-up ───────────────────────────────────
  const winY = interpolate(frame, [190, 226], [726, 214], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const genScale = pop(196);
  const cx = interpolate(frame, [200, 214, 232, 262], [980, 402, 402, 1120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [200, 214, 232, 262], [560, 268, 268, 470], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 198, 208) * (1 - seg(frame, 244, 258));
  const click = seg(frame, 214, 230, Easing.out(Easing.quad));

  // ── Beat 5: the proof ─────────────────────────────────────────────
  const beforeIn = seg(frame, 368, 382, Easing.out(Easing.cubic));
  const afterIn = pop(384);
  const check = pop(400);
  const techOp = seg(frame, 408, 424);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ THE HERO NUMBER — alive for the whole clip ════ */}
        <div
          style={{
            position: "absolute",
            left: heroCX - 400,
            top: heroTop,
            width: 800,
            textAlign: "center",
            opacity: lf,
            fontFamily,
          }}
        >
          <div
            style={{
              fontSize: heroSize,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: -6,
              color: heroColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {heroValue()}
            {frame >= 372 ? <span style={{ fontSize: heroSize * 0.52 }}>%</span> : null}
          </div>
          <div
            style={{
              marginTop: heroSize * 0.06,
              fontSize: Math.max(13, heroSize * 0.075),
              fontWeight: 700,
              letterSpacing: 3.4,
              color: P.muted,
            }}
          >
            {heroLabel}
          </div>
        </div>

        {/* ════ Beat 1 — what those minutes are ════ */}
        <Group opacity={b1}>
          {CHORES.map((c) => {
            const s = pop(c.at);
            return (
              <StatPill
                key={c.text}
                x={c.x}
                y={c.y}
                emoji={c.emoji}
                text={c.text}
                tone="danger"
                scale={s}
                opacity={Math.min(1, s)}
                fontSize={17}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 596,
              width: 1280,
              textAlign: "center",
              fontSize: 21,
              fontWeight: 600,
              color: P.muted,
              opacity: seg(frame, 56, 72),
            }}
          >
            Video reaches 5–10× more people than text — and costs an evening to make
          </div>
        </Group>

        {/* ════ Beat 2 — multiplied by a normal day ════ */}
        <Group opacity={b2}>
          <div style={{ position: "absolute", left: 0, top: 112, width: 1280, display: "flex", justifyContent: "center", gap: 13 }}>
            {Array.from({ length: 8 }, (_, i) => {
              const s = pop(102 + i * 5);
              return (
                <div
                  key={i}
                  style={{
                    width: 44,
                    height: 58,
                    borderRadius: 7,
                    background: P.card,
                    border: `1.5px solid ${P.dangerEdge}`,
                    opacity: Math.min(1, s),
                    transform: `translateY(${(1 - Math.min(1, s)) * -16}px)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 5,
                    padding: "0 9px",
                  }}
                >
                  {[1, 0.78, 0.92, 0.6].map((f, k) => (
                    <div
                      key={k}
                      style={{ width: `${f * 100}%`, height: 4, borderRadius: 2, background: P.dangerEdge }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 182,
              width: 1280,
              textAlign: "center",
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: 2,
              color: P.muted,
              opacity: seg(frame, 116, 130),
            }}
          >
            8 ARTICLES LAND TODAY · 45 MINUTES EACH
          </div>
          <div
            style={{
              position: "absolute",
              left: 210,
              top: 566,
              width: 860,
              height: 20,
              borderRadius: 10,
              background: P.chipBg,
              border: `1.5px solid ${P.border}`,
              overflow: "hidden",
              opacity: seg(frame, 104, 118),
            }}
          >
            <div style={{ width: 860 * dayBar, height: "100%", background: P.danger, opacity: 0.85 }} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 600,
              width: 1280,
              textAlign: "center",
              fontSize: 21,
              fontWeight: 600,
              color: P.danger,
              opacity: seg(frame, 140, 156),
            }}
          >
            Six hours of editing — so most articles never get a video at all
          </div>
        </Group>

        {/* ════ Beat 3 — the number is pushed aside, the tool slides up ════ */}
        <Group opacity={b3}>
          <BrowserWindow x={318} y={winY} w={880} h={392} title="video factory — one article, one click" opacity={1}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 880, padding: "26px 30px", fontFamily }}>
              <div style={{ fontSize: 23, fontWeight: 700, color: P.ink }}>
                “Norway’s AI job market — what changed this month”
              </div>
              <div style={{ fontSize: 16.5, fontWeight: 500, color: P.muted, marginTop: 8 }}>
                1 240 words · ready to publish · no video yet
              </div>
            </div>
            <FilterChip x={54} y={168} text="▶  Generate video" icon="" scale={genScale} opacity={Math.min(1, genScale)} color={P.accent} />
            <div
              style={{
                position: "absolute",
                left: 54,
                top: 244,
                fontSize: 17,
                fontWeight: 600,
                color: P.muted,
                opacity: seg(frame, 232, 248),
              }}
            >
              That is the whole interaction. Nothing else is asked of you.
            </div>
          </BrowserWindow>
          <Cursor x={cx} y={cy} opacity={cursorOp} click={click} />
        </Group>

        {/* ════ Beat 4 — the factory stamps the chores off ════ */}
        <Group opacity={b4}>
          {STAMPS.map((s, i) => {
            const t = seg(frame, 290 + i * 11, 303 + i * 11, Easing.out(Easing.cubic));
            return (
              <div
                key={s.label}
                style={{
                  position: "absolute",
                  left: 62,
                  top: 168 + i * 92,
                  width: 400,
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                  opacity: t,
                  transform: `translateX(${(1 - t) * -26}px)`,
                }}
              >
                <div style={{ fontSize: 27 }}>{s.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 19, fontWeight: 700, color: P.ink }}>{s.label}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 500, color: P.muted, marginTop: 2 }}>{s.detail}</div>
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: P.successBg,
                    border: `1.5px solid ${P.success}`,
                    color: P.success,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  ✓
                </div>
              </div>
            );
          })}
        </Group>

        {/* ════ Beat 5 — the proof ════ */}
        <Group opacity={b5}>
          <div
            style={{
              position: "absolute",
              left: 74,
              top: 246,
              display: "flex",
              alignItems: "center",
              gap: 22,
              opacity: beforeIn,
            }}
          >
            <div
              style={{
                padding: "16px 26px",
                borderRadius: 16,
                background: P.dangerBg,
                border: `1.5px solid ${P.dangerEdge}`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: P.muted }}>BY HAND</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: P.danger, marginTop: 4 }}>45 min</div>
            </div>
            <div style={{ fontSize: 30, color: P.muted, opacity: Math.min(1, afterIn) }}>→</div>
            <div
              style={{
                padding: "16px 26px",
                borderRadius: 16,
                background: P.successBg,
                border: `1.5px solid ${P.successEdge}`,
                transform: `scale(${0.9 + Math.min(1, afterIn) * 0.1})`,
                opacity: Math.min(1, afterIn),
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: P.muted }}>AUTOMATIC</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: P.success, marginTop: 4 }}>3 min</div>
            </div>
          </div>
          <CheckBadge x={84} y={404} scale={check} opacity={Math.min(1, check)} size={40} />
          <div
            style={{
              position: "absolute",
              left: 138,
              top: 396,
              width: 340,
              lineHeight: 1.35,
              fontSize: 19,
              fontWeight: 600,
              color: P.ink,
              opacity: Math.min(1, check),
            }}
          >
            Two formats ready to post,
every single time
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 636,
              width: 1280,
              textAlign: "center",
              fontSize: 17,
              fontWeight: 600,
              color: P.muted,
              opacity: techOp,
            }}
          >
            Under the hood: Remotion renders the voiceover, subtitles and both aspect ratios
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
