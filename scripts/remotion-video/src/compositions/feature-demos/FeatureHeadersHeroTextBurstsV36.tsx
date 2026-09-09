/**
 * FeatureHeadersHeroTextBurstsV36 — feature v36 — 1280x720, 993 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 7 "hero number" (drawn by the orchestrating session, not re-drawn
 * here), mood mint: one enormous figure owns the frame from beat 1 and never
 * leaves — it only morphs value, size, position and color as the story moves
 * from bug to fix. Almost no chrome around it.
 *
 * UI beats (4, 5) play REAL recordings via LiveWindow, driven by
 * shots/v36.json: the two commit pages stand in for the (now unreproducible)
 * live homepage. Beats 1-3 are drawn — beats 1-2 depict a bug that no longer
 * exists on the live site, beat 3 is an explicit metaphor.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–181  "My homepage's hero title used to have a faint dust smudge sitting on it — even at rest."
 *  b2 190–337  "And a stray cursor flicker between tiles could restart the whole burst mid-flight."
 *  b3 346–490  "Like a movie jumping back to its opening frame because someone coughed in the theater."
 *  b4 499–689  "A single canvas component now stays invisible at rest, only bursting apart when you hover."
 *  b5 698–948  "A 160-millisecond pause now swallows that flicker, holding the swirl to 7,000 grains so it never restarts." — holds to 993.
 *
 * Single tech name in the whole clip: Canvas API (beat 4 chip only).
 */
import React from "react";
import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, CaptionBand, Panel, seg, fontFamily } from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shots from "./shots/v36.json";

const P = MOODS.mint;
const LIVE_WIN = { x: 230, y: 150, w: 820, h: 383 };

export const FeatureHeadersHeroTextBurstsV36: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 181, 197));
  const b2 = seg(frame, 190, 206) * (1 - seg(frame, 337, 353));
  const b3 = seg(frame, 346, 362) * (1 - seg(frame, 490, 506));
  const b4 = seg(frame, 499, 515) * (1 - seg(frame, 689, 705));
  const b5 = seg(frame, 698, 714); // holds through 993, no fade-out

  // ---------------- the persistent hero number, alive for the whole clip ----------------
  const heroSize = interpolate(frame, [0, 346, 382, 993], [260, 260, 120, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const heroTop = interpolate(frame, [0, 346, 382, 993], [150, 150, 20, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const heroColor = interpolateColors(
    Math.min(frame, 900),
    [0, 499, 540, 698, 760],
    [P.danger, P.danger, P.accent, P.accent, P.success]
  );

  const heroValue = (): string => {
    if (frame < 499) return "1";
    if (frame < 540) {
      return Math.round(
        interpolate(frame, [499, 540], [1, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
      ).toString();
    }
    if (frame < 698) return "160";
    if (frame < 760) {
      return Math.round(
        interpolate(frame, [698, 760], [160, 7000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
      ).toLocaleString();
    }
    return "7,000";
  };

  const heroLabel =
    frame < 190
      ? "TILE — LEFT A SMUDGE AT REST"
      : frame < 499
      ? "FRAME — COULD RESTART THE BURST"
      : frame < 698
      ? "MS — DEBOUNCE SWALLOWS THE FLICKER"
      : "GRAINS — CAP, SO IT NEVER RESTARTS";

  // ---------------- beat 3: the "movie snapping back" metaphor, non-looping ----------------
  const preSnap = interpolate(frame, [370, 420], [0, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const postSnap = interpolate(frame, [420, 434], [0.82, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const barFraction = frame < 420 ? preSnap : postSnap;

  // beat 2: a flickering 2x2 tile grid, one tile flashing
  const flicker = Math.floor(frame / 6) % 2 === 0;

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- persistent hero number ---------------- */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: heroTop,
            width: 1280,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: heroSize,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: -3,
              color: heroColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {heroValue()}
          </div>
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700, letterSpacing: 1.6, color: P.muted }}>{heroLabel}</div>
        </div>

        {/* ---------------- beat 1 : the permanent dust smudge ---------------- */}
        <Group opacity={b1}>
          <div
            style={{
              position: "absolute",
              left: 570,
              top: 460,
              width: 140,
              height: 70,
              borderRadius: "48% 52% 55% 45% / 55% 45% 55% 45%",
              background: `radial-gradient(circle, ${P.dangerEdge} 0%, ${P.dangerBg} 70%, transparent 100%)`,
            }}
          />
          <StatPill x={90} y={520} emoji="😶" text="sits there, even with nothing hovered" tone="danger" opacity={b1} />
          <StatPill x={90} y={580} emoji="🧱" text="built for one tile only" tone="danger" opacity={b1} />
          <CaptionBand y={646} text="A faint dust mound sat there — even when nothing was hovered." tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : the flicker restart glitch ---------------- */}
        <Group opacity={b2}>
          <div style={{ position: "absolute", left: 560, top: 450, width: 160, height: 160, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  borderRadius: 10,
                  background: P.card,
                  border: `2px solid ${i === 0 && flicker ? P.danger : P.border}`,
                  boxShadow: i === 0 && flicker ? `0 0 12px ${P.danger}` : "none",
                }}
              />
            ))}
          </div>
          <StatPill x={90} y={520} emoji="🔀" text="cursor flickers between tiles" tone="danger" opacity={b2} />
          <StatPill x={90} y={580} emoji="⏮" text="restarts mid-flight" tone="danger" opacity={b2} />
          <CaptionBand y={646} text="A cursor flicker between tiles could reset the whole burst mid-flight." tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the movie-snapping-back metaphor ---------------- */}
        <Group opacity={b3}>
          <Panel x={340} y={280} w={600} h={200} tone="card" />
          <div style={{ position: "absolute", left: 372, top: 308, fontSize: 20, fontWeight: 800, color: P.ink }}>🎬 NOW SHOWING: burst.mp4</div>
          <div
            style={{
              position: "absolute",
              left: 372,
              top: 380,
              width: 536,
              height: 22,
              borderRadius: 11,
              background: "#fff",
              border: `1.5px solid ${P.border}`,
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${barFraction * 100}%`, height: "100%", background: P.accent, borderRadius: 11 }} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 372,
              top: 418,
              fontSize: 32,
              opacity: pop(420, 12),
              transform: `scale(${0.6 + 0.4 * pop(420, 12)})`,
            }}
          >
            ⏮
          </div>
          <CaptionBand y={646} text="Like a movie jumping back to its opening frame because someone coughed." tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : real commit, canvas component ---------------- */}
        <Group opacity={b4}>
          <FilterChip x={LIVE_WIN.x} y={110} text="Canvas API" icon="" opacity={b4} />
          <LiveWindow
            file={shots}
            shot="fix"
            title="github.com — commit e030b46 · canvas burst component"
            from={499}
            hold={190}
            opacity={b4}
            win={LIVE_WIN}
          />
          <StatPill x={LIVE_WIN.x} y={545} emoji="✨" text="invisible at rest" tone="success" opacity={b4} />
          <CaptionBand y={646} text="A single canvas component now stays invisible at rest, only bursting apart on hover." tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : the real feature page, no more restarts ---------------- */}
        <Group opacity={b5}>
          <CheckBadge x={790} y={18} size={40} opacity={b5} scale={pop(698, 11)} />
          <LiveWindow
            file={shots}
            shot="page"
            title="vitalii.no/features/…-v36"
            from={698}
            hold={295}
            opacity={b5}
            win={LIVE_WIN}
          />
          <StatPill x={LIVE_WIN.x} y={545} emoji="🔁" text="never restarts again" tone="success" opacity={b5} />
          <StatPill x={LIVE_WIN.x + 260} y={545} emoji="⏱" text="160ms swallows the flicker" tone="success" opacity={b5} />
          <CaptionBand y={646} text="A 160ms pause and a 7,000-grain cap — it never restarts again." tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
