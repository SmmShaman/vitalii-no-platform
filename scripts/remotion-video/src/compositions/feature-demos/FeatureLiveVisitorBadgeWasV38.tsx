/**
 * FeatureLiveVisitorBadgeWasV38 — feature v38 — 1280x720, 905 frames @ 30fps, VOICE-SYNCED.
 *
 * Art direction handed down by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md), NOT drawn locally:
 *   archetype 1 "timeline ribbon" — a horizontal band spans the frame at
 *     y=552; a stamp lands on it, left→right, the moment each beat's event
 *     happens (reference: FeaturePagesSilentLoopDoublesV29.tsx).
 *   mood "dawn" — `<PaletteProvider value={MOODS.dawn}>` wraps the whole tree.
 *
 * STEP 0c — real product beats: beats 1-2 describe a state that no longer
 * exists on the live site (the badge used to show numbers nobody had
 * checked, and the 10x-inflated history has since been backfilled) — they
 * stay a drawn metaphor. Beats 3-4 are the backend fix itself, so per STEP 0c
 * "the real diff is the strongest shot for a backend feature": two real
 * commit diffs (shots/v38.json "diff1", "diff2") — the Cloudflare worker and
 * the backfill script are two separate commits, so they are two separate
 * live shots rather than one artificially continuous recording. Beat 5 is
 * the live result: a recording of the feature's own page ("page").
 *
 * Voice-synced beat table (do not shift):
 *  b1  15-189  "I wanted a badge showing how many people are on my site right now — but some of my old numbers were already wrong."
 *  b2 198-378  "Some days had been multiplied by up to ten times, turning a quiet Tuesday into a viral one."
 *  b3 387-591  "A small Cloudflare worker now fetches the real count every minute, without ever exposing a secret key."
 *  b4 600-712  "I also rebuilt every inflated day in the history for good."
 *  b5 721-860  "Now the badge refreshes every sixty seconds, live and accurate."
 *  tail 860-905 — beat 5 HOLDS at full opacity through the very last frame; no loop, no fade-out.
 *
 * Single tech-credibility caption in the whole clip: a FilterChip reading
 * "Cloudflare Worker", shown only over beat 3's diff.
 * The b3→b4 label swap (translateX) is the one beat transition that is not a
 * plain crossfade.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  BrowserWindow,
  StatPill,
  FilterChip,
  CheckBadge,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shotsV38 from "./shots/v38.json";

const P = MOODS.dawn;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const BEATS = {
  b1: [15, 189],
  b2: [198, 378],
  b3: [387, 591],
  b4: [600, 712],
  b5: [721, 860],
} as const;

/** The window all live beats share, sized to leave room above for a label
 * strip and below for the ribbon + persistent headline. */
const WIN2 = { x: 150, y: 90, w: 980, h: 395 };

/** Ribbon stamp: a small circle that lands on the timeline and never leaves. */
const Stamp: React.FC<{ x: number; emoji: string; label: string; color: string; scale: number; opacity: number }> = ({
  x,
  emoji,
  label,
  color,
  scale,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 20,
          top: 535,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: P.card,
          border: `2.5px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 19,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          boxShadow: cardShadow,
          opacity,
          fontFamily,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          position: "absolute",
          left: x - 74,
          top: 584,
          width: 148,
          textAlign: "center",
          fontSize: 14.5,
          fontWeight: 700,
          color,
          opacity,
          fontFamily,
        }}
      >
        {label}
      </div>
    </>
  );
};

/** Full-size hero, used in beats 1-2 where a drawn panel leaves room beside it. */
const hero = (x: number, value: string, unit: string | undefined, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 78,
      width: 470,
      transform: `scale(${0.86 + 0.14 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div style={{ fontSize: 100, lineHeight: 1, fontWeight: 800, letterSpacing: -3, color, fontVariantNumeric: "tabular-nums" }}>
      {value}
      {unit ? <span style={{ fontSize: 100 * 0.34, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>{label}</div>
  </div>
);

/** Compact hero for beat 5, sized to fit the strip above the full-width live window. */
const heroMini = (value: string, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      top: 8,
      display: "flex",
      alignItems: "baseline",
      gap: 14,
      transform: `scale(${0.85 + 0.15 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div style={{ fontSize: 64, fontWeight: 800, color, letterSpacing: -2, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.6, color: P.muted, maxWidth: 420 }}>{label}</div>
  </div>
);

export const FeatureLiveVisitorBadgeWasV38: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  /** Zone visibility: fades in after the beat opens, fully gone before it closes. */
  const zone = (name: keyof typeof BEATS) => {
    const [s, e] = BEATS[name];
    return Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));
  };

  const b1 = zone("b1");
  const b2 = zone("b2");
  const b3 = zone("b3");
  const b4 = zone("b4");
  // b5 has nothing to hand over to — it holds through the tail instead of fading out.
  const b5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);

  const heroPop1 = pop(BEATS.b1[0]);
  const heroPop2 = pop(BEATS.b2[0]);
  const heroPop5 = pop(BEATS.b5[0]);
  const chipPop = pop(BEATS.b3[0] + 20);

  // ── Ribbon spine — present from the first frame, grows as the story moves ──
  const ribbonX0 = 110;
  const ribbonW = 1060;
  const ribbonIn = seg(frame, 8, 24);
  const ribbonProgress = interpolate(frame, [15, BEATS.b5[1]], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const stamps = [
    { x: ribbonX0, start: BEATS.b1[0] + 6, emoji: "❓", label: "badge you couldn't trust", color: P.danger },
    { x: ribbonX0 + 265, start: BEATS.b2[0] + 6, emoji: "📈", label: "×10 on some days", color: P.danger },
    { x: ribbonX0 + 530, start: BEATS.b3[0] + 6, emoji: "🔧", label: "worker, no leaked key", color: P.accent },
    { x: ribbonX0 + 795, start: BEATS.b4[0] + 6, emoji: "🔨", label: "history rebuilt", color: P.accent },
    { x: ribbonX0 + 1060, start: BEATS.b5[0] + 6, emoji: "✅", label: "60s, live, accurate", color: P.success },
  ];

  // ── Beat 3 → 4 label swap (not a plain crossfade) ──
  const b3ExitT = seg(frame, BEATS.b3[1] - 10, BEATS.b3[1] - 2);
  const b3TranslateX = -40 * b3ExitT;
  const b4EnterT = seg(frame, BEATS.b4[0] + 2, BEATS.b4[0] + 16);
  const b4TranslateX = 50 * (1 - b4EnterT);
  const b4Scale = 0.94 + 0.06 * b4EnterT;

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Persistent headline — small, bottom-left, never centered ════ */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 626,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: P.accent,
            opacity: seg(frame, 18, 34),
            fontFamily,
          }}
        >
          Live visitor badge
        </div>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 652,
            fontSize: 20,
            fontWeight: 700,
            color: P.ink,
            opacity: seg(frame, 18, 34),
            fontFamily,
          }}
        >
          Real counts, no inflated history
        </div>

        {/* ════ Ribbon spine — the one element that survives every beat ════ */}
        <div
          style={{
            position: "absolute",
            left: ribbonX0,
            top: 552,
            width: ribbonW,
            height: 6,
            borderRadius: 3,
            background: P.border,
            opacity: ribbonIn,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: ribbonX0,
            top: 552,
            width: ribbonW * ribbonProgress,
            height: 6,
            borderRadius: 3,
            background: P.accent,
            opacity: ribbonIn,
          }}
        />
        {stamps.map((s) => (
          <Stamp
            key={s.label}
            x={s.x}
            emoji={s.emoji}
            label={s.label}
            color={s.color}
            scale={Math.min(1, pop(s.start))}
            opacity={Math.min(1, pop(s.start))}
          />
        ))}

        {/* ════ Beat 1 — the untrustworthy badge, drawn (historical state) ════ */}
        <Group opacity={b1}>
          <BrowserWindow x={110} y={90} w={560} h={340} title="vitalii.no — homepage badge" opacity={1}>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 40,
                padding: "10px 18px",
                borderRadius: 999,
                background: P.dangerBg,
                border: `1.5px solid ${P.dangerEdge}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 18,
                fontWeight: 700,
                color: P.danger,
              }}
            >
              🔴 visitors right now: 347
            </div>
            <div style={{ position: "absolute", left: 40, top: 130, fontSize: 17, fontWeight: 600, color: P.muted, width: 460 }}>
              a live number on the homepage — but some of the history behind it was never checked
            </div>
          </BrowserWindow>
          {hero(740, "?", undefined, "COULD I TRUST THIS BADGE", P.danger, heroPop1)}
          <StatPill x={744} y={282} emoji="🌐" text="pulled from Cloudflare Analytics" tone="danger" opacity={b1} />
          <StatPill x={744} y={336} emoji="🔍" text="found by reading my own sync code" tone="danger" opacity={b1} />
        </Group>

        {/* ════ Beat 2 — the ×10 spike, drawn (historical state) ════ */}
        <Group opacity={b2}>
          <Panel x={340} y={190} w={600} h={300} tone="danger" opacity={1}>
            <div style={{ position: "absolute", left: 40, top: 28, fontSize: 17, fontWeight: 700, color: P.ink, fontFamily }}>
              a quiet Tuesday vs. the recorded number
            </div>
            <div style={{ position: "absolute", left: 60, top: 90, width: 70, height: 36, borderRadius: 6, background: "#C9D3E2" }} />
            <div style={{ position: "absolute", left: 46, top: 130, width: 98, textAlign: "center", fontSize: 13, fontWeight: 700, color: P.muted }}>
              quiet Tuesday
            </div>
            <div style={{ position: "absolute", left: 220, top: 30, width: 70, height: 200, borderRadius: 6, background: P.danger, opacity: 0.85 }} />
            <div style={{ position: "absolute", left: 206, top: 236, width: 98, textAlign: "center", fontSize: 13, fontWeight: 700, color: P.danger }}>
              same day, ×10
            </div>
            <div
              style={{
                position: "absolute",
                left: 340,
                top: 90,
                fontSize: 15,
                fontWeight: 800,
                color: P.danger,
                transform: "rotate(-6deg)",
                fontFamily,
              }}
            >
              looked viral — wasn't
            </div>
          </Panel>
          {hero(340, "10", "×", "SOME DAYS MULTIPLIED", P.danger, heroPop2)}
          <StatPill x={340} y={504} emoji="🧮" text="double-counted Cloudflare's own sampling math" tone="danger" opacity={b2} />
        </Group>

        {/* ════ Beat 3 — the Cloudflare worker, a real commit ════ */}
        <LiveWindow
          file={shotsV38}
          shot="diff1"
          title="commit d5b0d6f — Cloudflare Worker"
          from={BEATS.b3[0]}
          hold={BEATS.b3[1] - BEATS.b3[0]}
          zoom={(t) => 1 + 0.14 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b3}
          win={WIN2}
        />
        <Group opacity={b3}>
          <FilterChip
            x={WIN2.x + WIN2.w - 300}
            y={WIN2.y + 42 + 14}
            text="Cloudflare Worker"
            icon="🔒"
            color={P.accent}
            scale={chipPop}
            opacity={Math.min(1, chipPop)}
          />
        </Group>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 15,
            opacity: b3,
            transform: `translateX(${b3TranslateX}px)`,
            fontSize: 22,
            fontWeight: 800,
            color: P.accent,
            fontFamily,
          }}
        >
          🔧 Fetches the real count every minute
        </div>

        {/* ════ Beat 4 — the backfill script, a second real commit ════ */}
        <LiveWindow
          file={shotsV38}
          shot="diff2"
          title="commit 7fcb068 — historical backfill"
          from={BEATS.b4[0]}
          hold={BEATS.b4[1] - BEATS.b4[0]}
          zoom={(t) => 1 + 0.1 * easeOut(t)}
          focus={{ x: 0.5, y: 0.45 }}
          opacity={b4}
          win={WIN2}
        />
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 15,
            opacity: b4,
            transform: `translateX(${b4TranslateX}px) scale(${b4Scale})`,
            transformOrigin: "left top",
            fontSize: 22,
            fontWeight: 800,
            color: P.success,
            fontFamily,
          }}
        >
          🔨 Every inflated day, rebuilt for good
        </div>

        {/* ════ Beat 5 — the live page, holds through the tail ════ */}
        <LiveWindow
          file={shotsV38}
          shot="page"
          title="vitalii.no/features/the-live-visitor-badge-…-v38"
          from={BEATS.b5[0]}
          hold={905 - BEATS.b5[0]}
          zoom={(t) => 1 + 0.08 * easeOut(t)}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={b5}
          win={WIN2}
        />
        <Group opacity={b5}>
          {heroMini("60s", "REFRESH — LIVE AND ACCURATE", P.success, heroPop5)}
          <CheckBadge x={1080} y={16} size={40} opacity={b5} scale={heroPop5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
