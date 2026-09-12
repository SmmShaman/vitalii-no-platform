/**
 * FeaturePagesSilentLoopDoublesV29 — feature v29 — 1280x720, 816 frames @ 30fps, VOICE-SYNCED.
 *
 * Art direction handed down by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md), NOT drawn locally:
 *   archetype 1 "timeline ribbon" — a horizontal band spans the frame at
 *     y=552; a stamp lands on it, left→right, the moment each beat's event
 *     happens. It is the one element that survives every beat (see p18,
 *     FeatureTelegramModeration, for the reference implementation).
 *   mood "slate" — `<PaletteProvider value={MOODS.slate}>` wraps the whole tree.
 *
 * STEP 0c — real product beats: beats 1-2 describe a UI state the live site
 * no longer has (the fix being narrated replaced it), so they stay a drawn
 * metaphor. Beats 3-5 are ONE continuous recording of the feature's own page
 * (shots/v29.json "page") spanning beats 3+4 — the button appearing and the
 * tap are one real interaction narrated across two sentences, so they share
 * one clip instead of an artificial restart — followed by a recording of the
 * features hub ("hub") for beat 5, standing in for "every visitor".
 *
 * Voice-synced beat table (do not shift):
 *  b1  15-169  "A feature page showed a silent looping clip — and that's all most visitors ever saw."
 *  b2 178-340  "The full explanation sat behind a plain text link underneath it, and almost nobody clicked."
 *  b3 349-455  "Now that silent loop doubles as a poster for the real thing."
 *  b4 464-625  "A button appears on top of it; tap it, and the clip swaps for the narrated cut on YouTube."
 *  b5 634-771  "Every visitor now reaches that narrated cut in exactly one click."
 *  tail 771-816 — beat 5 HOLDS at full opacity through the very last frame; no loop, no fade-out.
 *
 * Single tech-credibility caption in the whole clip: FeatureDemoClip.tsx —
 * youtubeId prop (FilterChip, shown for the whole b3+b4 live span).
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
  Cursor,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shotsV29 from "./shots/v29.json";

const P = MOODS.slate;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const BEATS = {
  b1: [15, 169],
  b2: [178, 340],
  b3: [349, 455],
  b4: [464, 625],
  b5: [634, 771],
} as const;

/** The window all live beats share, sized to leave room above for a label
 * strip and below for the ribbon + persistent headline (unlike WIN_DEFAULT,
 * which would run into both). */
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

/** Full-size hero, used only in beat 1 where a drawn window leaves room beside it. */
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

export const FeaturePagesSilentLoopDoublesV29: React.FC = () => {
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

  // The live "page" recording spans b3+b4 as one continuous beat — it is one
  // real interaction narrated across two sentences, not two separate shots.
  const b34 = Math.min(seg(frame, BEATS.b3[0] + 2, BEATS.b3[0] + 16), 1 - seg(frame, BEATS.b4[1] - 10, BEATS.b4[1] - 2));

  const heroPop1 = pop(BEATS.b1[0]);
  const heroPop5 = pop(BEATS.b5[0]);
  const chipPop = pop(365);
  const tapPop = pop(549);

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
    { x: ribbonX0, start: BEATS.b1[0] + 6, emoji: "🔇", label: "silent loop", color: P.danger },
    { x: ribbonX0 + 265, start: BEATS.b2[0] + 6, emoji: "🔗", label: "hidden link", color: P.danger },
    { x: ribbonX0 + 530, start: BEATS.b3[0] + 6, emoji: "🎬", label: "new poster", color: P.accent },
    { x: ribbonX0 + 795, start: BEATS.b4[0] + 6, emoji: "👆", label: "tap → sound", color: P.accent },
    { x: ribbonX0 + 1060, start: BEATS.b5[0] + 6, emoji: "✅", label: "one click", color: P.success },
  ];

  // ── Beat 2: idle cursor, wandering, never near the buried link ──
  const cursorX2 = 900 + 20 * Math.sin(frame / 13);
  const cursorY2 = 380 + 14 * Math.cos(frame / 10);

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
          Feature page sound
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
          One click reaches the narrated cut
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

        {/* ════ Beat 1 — the silent loop, drawn (historical state) ════ */}
        <Group opacity={b1}>
          <BrowserWindow x={110} y={90} w={560} h={340} title="vitalii.no/features/… (autoplay, muted)" opacity={1}>
            <div style={{ position: "absolute", right: 14, top: 14, fontSize: 22, opacity: 0.75 }}>🔁</div>
            <div style={{ position: "absolute", left: 0, top: 60, width: 560, textAlign: "center", fontSize: 100 }}>🔇</div>
            <div style={{ position: "absolute", left: 0, top: 182, width: 560, textAlign: "center", fontSize: 20, fontWeight: 700, color: P.muted }}>
              looping silently, no controls shown
            </div>
          </BrowserWindow>
          {hero(740, "0", "%", "VOLUME — MUTED ON PURPOSE", P.danger, heroPop1)}
          <StatPill x={744} y={282} emoji="🔁" text="loops forever, no controls shown" tone="danger" opacity={b1} />
          <StatPill x={744} y={336} emoji="👀" text="the only thing most visitors saw" tone="danger" opacity={b1} />
        </Group>

        {/* ════ Beat 2 — the buried link, drawn (historical state) ════ */}
        <Group opacity={b2}>
          <Panel x={340} y={110} w={600} h={300} tone="danger" opacity={1}>
            <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 34 }}>🔇</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: P.ink, fontFamily }}>Feature demo clip (looping, muted)</span>
            </div>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 100,
                width: 180,
                height: 100,
                borderRadius: 8,
                background: P.dangerBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
              }}
            >
              🔇
            </div>
            <div style={{ position: "absolute", left: 26, top: 210, width: 270, height: 46, border: `2px dashed ${P.danger}`, borderRadius: 10 }} />
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 222,
                fontSize: 16,
                fontWeight: 600,
                color: P.accent,
                textDecoration: "underline",
                fontFamily,
              }}
            >
              Watch the narrated version →
            </div>
            <div
              style={{
                position: "absolute",
                left: 310,
                top: 222,
                fontSize: 14,
                fontWeight: 800,
                color: P.danger,
                transform: "rotate(-8deg)",
                fontFamily,
              }}
            >
              EASY TO MISS
            </div>
          </Panel>
          <Cursor x={cursorX2} y={cursorY2} opacity={b2} />
          <StatPill x={340} y={424} emoji="👀" text="almost nobody clicked it" tone="danger" opacity={b2} />
        </Group>

        {/* ════ Beats 3-4 — the live page, one continuous recording ════ */}
        <LiveWindow
          file={shotsV29}
          shot="page"
          title="vitalii.no/features/the-feature-pages-silent-loop-…-v29"
          from={BEATS.b3[0]}
          hold={276}
          zoom={(t) => 1 + 0.12 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b34}
          win={WIN2}
        />
        <Group opacity={b34}>
          <FilterChip
            x={WIN2.x + WIN2.w - 210}
            y={WIN2.y + 42 + 14}
            text="FeatureDemoClip.tsx — youtubeId prop"
            icon="🔊"
            color={P.accent}
            scale={chipPop}
            opacity={Math.min(1, chipPop)}
          />
        </Group>

        {/* beat 3 label — fades out sliding left as beat 4's label pushes in */}
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
          🎬 Poster, not just a loop
        </div>
        {/* beat 4 label + tap flourish */}
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 15,
            opacity: b4,
            transform: `translateX(${b4TranslateX}px) scale(${b4Scale})`,
            transformOrigin: "left top",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 800, color: P.success }}>👆 One tap → sound on</span>
          <span style={{ fontSize: 30, transform: `scale(${Math.min(1, tapPop)})`, transformOrigin: "center", opacity: Math.min(1, tapPop) }}>✨</span>
        </div>

        {/* ════ Beat 5 — the live hub, holds through the tail ════ */}
        <LiveWindow
          file={shotsV29}
          shot="hub"
          title="vitalii.no/features — every feature page"
          from={BEATS.b5[0]}
          hold={182}
          zoom={(t) => 1 + 0.08 * easeOut(t)}
          focus={{ x: 0.5, y: 0.25 }}
          opacity={b5}
          win={WIN2}
        />
        <Group opacity={b5}>
          {heroMini("1", "CLICK TO THE NARRATED CUT", P.success, heroPop5)}
          <CheckBadge x={1080} y={16} size={40} opacity={b5} scale={heroPop5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
