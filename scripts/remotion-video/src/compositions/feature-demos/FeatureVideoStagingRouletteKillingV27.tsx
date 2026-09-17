/**
 * FeatureVideoStagingRouletteKillingV27 — feature v27 — 1280x720, 981 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 7 (hero-number), mood violet. One number owns the top-left corner
 * for the whole clip and morphs 1 → 35 → 8 → 6 exactly as the narration names
 * each figure. Beats 1, 3 and 4 play a real recording of the product
 * (shots/v27.json: the features hub, the commit history, the feature's own
 * live page); beat 2 is drawn — the root cause (one instructions file copied
 * by every clip) has no public page to record.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–237  "Watch a few of my videos back to back and they blur together — same layout, same colors, same rhythm every time."
 *  b2 246–516  "Thirty-five different stories ended up looking identical. The problem wasn't the video — it was instructions telling every clip to copy one file."
 *  b3 525–757  "Now each Remotion clip rolls its own staging: one of eight layouts, a fresh mood, never repeating the last two."
 *  b4 766–936  "Six new videos went out, and for the first time, every single one actually looks different." — holds to 981.
 *
 * Single tech name in the whole clip: Remotion (beat 3 chip only).
 */
import React from "react";
import { interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/v27.json";

const P = MOODS.violet;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const LIVE_WIN: Win = { x: 660, y: 180, w: 580, h: 390 };

/** The hero number, top-left, leaving the rest of the frame to the evidence. */
const hero = (value: number, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      top: 34,
      width: 470,
      transform: `scale(${0.86 + 0.14 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div
      style={{
        fontSize: 112,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -4,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
    <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>{label}</div>
  </div>
);

/** The 8 identical mockup cards used only in beat 2 (root-cause, drawn). */
const CardGrid: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div style={{ position: "absolute", left: 660, top: 190, width: 470, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, opacity }}>
    {Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        style={{
          borderRadius: 12,
          background: P.card,
          border: `1.5px solid ${P.dangerEdge}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ width: "70%", height: 8, borderRadius: 4, background: P.dangerEdge }} />
        <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
          <div style={{ width: "48%", height: 22, borderRadius: 5, background: P.dangerBg, border: `1px solid ${P.dangerEdge}` }} />
          <div style={{ width: "48%", height: 22, borderRadius: 5, background: P.dangerBg, border: `1px solid ${P.dangerEdge}` }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ width: 14, height: 14, borderRadius: "50%", background: P.dangerEdge }} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const FeatureVideoStagingRouletteKillingV27: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (audio-measured, do not shift) ────────────────────
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 237, 253));
  const b2 = seg(frame, 246, 262) * (1 - seg(frame, 516, 532));
  const b3 = seg(frame, 525, 541) * (1 - seg(frame, 757, 773));
  const b4 = seg(frame, 766, 782); // holds through 981

  // ── The hero number: one element, four states, morphs at each cut ──
  const heroValue = (): number => {
    if (frame < 237) return 1;
    if (frame < 262)
      return Math.round(interpolate(frame, [237, 262], [1, 35], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
    if (frame < 516) return 35;
    if (frame < 541)
      return Math.round(interpolate(frame, [516, 541], [35, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }));
    if (frame < 757) return 8;
    if (frame < 782)
      return Math.round(interpolate(frame, [757, 782], [8, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
    return 6;
  };
  const heroLabel =
    frame < 262 ? "TEMPLATE FOR EVERY STORY"
    : frame < 541 ? "CLIPS THAT LOOKED IDENTICAL"
    : frame < 782 ? "STAGING ARCHETYPES TO DRAW FROM"
    : "NEW CLIPS, EACH ONE DIFFERENT";
  const heroColor = interpolateColors(
    Math.min(frame, 981),
    [0, 516, 541, 757, 782],
    [P.danger, P.danger, P.accent, P.accent, P.success],
  );
  const heroPop1 = pop(15);
  const heroScale = frame < 15 ? 0 : Math.min(1, heroPop1 + 0.6);

  // beat 3: slide-up transition (not a plain crossfade) + the one tech chip
  const slideUp3 = interpolate(frame, [525, 555], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const chipPop = pop(560);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : the sameness problem, seen live ---------------- */}
        <Group opacity={b1}>
          {hero(heroValue(), heroLabel, heroColor, heroScale)}
          <StatPill x={150} y={220} emoji="😵‍💫" text="They blur together" tone="danger" opacity={b1} />
          <StatPill x={150} y={280} emoji="🎞" text="Same layout, every time" tone="danger" opacity={b1} />
          <CaptionBand y={646} text="Same layout. Same colors. Same rhythm." tone="danger" opacity={b1} />
        </Group>
        <LiveWindow
          file={shots}
          shot="hub"
          title="vitalii.no/features"
          from={15}
          hold={238}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b1}
          win={LIVE_WIN}
        />

        {/* ---------------- beat 2 : the root cause, drawn (no public UI) ---------------- */}
        <Group opacity={b2}>
          {hero(heroValue(), heroLabel, heroColor, heroScale)}
          <Panel x={150} y={220} w={470} h={120} tone="danger" opacity={b2}>
            <div style={{ padding: "16px 20px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: P.danger }}>📄 reference.tsx</div>
              <div style={{ fontSize: 14.5, fontWeight: 500, color: P.muted, marginTop: 6 }}>
                "copy this file exactly" — the instruction every clip got
              </div>
            </div>
          </Panel>
          <CardGrid opacity={b2} />
          <CaptionBand y={646} text="Every clip copied one reference file exactly" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the fix, seen live in the commit history ---------------- */}
        <Group opacity={b3} dy={slideUp3}>
          {hero(heroValue(), heroLabel, heroColor, heroScale)}
          <StatPill x={150} y={220} emoji="🎨" text="8 archetypes × 5 moods" tone="accent" opacity={b3} />
          <FilterChip x={150} y={280} text="Remotion" icon="🎬" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand y={646} text="The fix rewrote the instructions, not the renderer" tone="accent" opacity={b3} />
        </Group>
        <LiveWindow
          file={shots}
          shot="commits"
          title="github.com/…/commits"
          from={525}
          hold={248}
          zoom={(t) => 1 + 0.06 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b3}
          win={LIVE_WIN}
        />

        {/* ---------------- beat 4 : the result, seen live on the feature's own page ---------------- */}
        <Group opacity={b4}>
          {hero(heroValue(), heroLabel, heroColor, heroScale)}
          <StatPill x={150} y={220} emoji="✅" text="Zero repeats across the batch" tone="success" opacity={b4} />
          <CheckBadge x={556} y={40} size={44} opacity={b4} scale={pop(766)} />
          <CaptionBand y={646} text="Six new clips — for the first time, every one looks different" tone="success" opacity={b4} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-v27"
          from={766}
          hold={215}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b4}
          win={LIVE_WIN}
        />
      </div>
    </PaletteProvider>
  );
};
