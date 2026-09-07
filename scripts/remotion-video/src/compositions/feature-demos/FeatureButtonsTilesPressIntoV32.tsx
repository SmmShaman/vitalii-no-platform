/**
 * FeatureButtonsTilesPressIntoV32 — feature v32 — 1280x720, 951 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 3 (card deck), mood violet. The whole clip is one deck: beats 1-2
 * scatter mismatched button/tile cards (the problem), beat 3 is the STACK —
 * the cards converge into one embossed recipe, beat 4 FANS the recipe out
 * across real circular buttons, beat 5 fans all the way into the six-tile
 * grid that ends the clip. Beat 4 also plays a recording of the real site
 * (shots/v32.json, hub page — every page carries the header buttons this
 * beat talks about). Beat 5's home-screen tiles have no verified recording
 * URL (only the feature's own page, the hub and the repo are authorized), so
 * that beat stays drawn — which also happens to be the archetype's natural
 * payoff: the deck fanned all the way out.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–186  "Every button on my site felt different — some flat, some barely reacting when you pressed them."
 *  b2 195–360  "The home-screen tiles weren't any better — they just grew a little on hover, nothing felt physical."
 *  b3 369–532  "So I built one CSS recipe — an embossed shadow that makes anything look pressed."
 *  b4 541–717  "Now every circular button uses it, in light mode and dark, across every palette."
 *  b5 726–906  "The tiles got the same recipe too — one shadow language, six tiles, pressed into the page." — holds to 951.
 *
 * Single tech name in the whole clip: CSS (beat 3 chip only).
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, Headline, StatPill, FilterChip, CaptionBand, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/v32.json";

const P = MOODS.violet;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const HUB_WIN: Win = { x: 150, y: 230, w: 980, h: 380 };

const pressed = (accent: boolean) => ({
  boxShadow: accent
    ? "inset -6px -6px 12px rgba(76,29,149,0.28), inset 5px 5px 10px rgba(255,255,255,0.75)"
    : "inset -5px -5px 10px rgba(20,10,40,0.18), inset 4px 4px 8px rgba(255,255,255,0.65)",
});

/** buttons scattered mismatched — flat pills and circles, the "before" chaos */
const CHAOS_BUTTONS = [
  { x: 160, y: 110, rot: -8, w: 78, h: 78, r: 39 },
  { x: 340, y: 230, rot: 12, w: 150, h: 50, r: 25 },
  { x: 560, y: 90, rot: -5, w: 64, h: 64, r: 32 },
  { x: 780, y: 260, rot: 9, w: 126, h: 44, r: 22 },
  { x: 940, y: 120, rot: -13, w: 60, h: 60, r: 30 },
  { x: 430, y: 380, rot: 6, w: 160, h: 54, r: 27 },
];

/** six home-screen tile positions, the final fan-out */
const TILE_GRID = [
  { x: 220, y: 170 },
  { x: 510, y: 170 },
  { x: 800, y: 170 },
  { x: 220, y: 340 },
  { x: 510, y: 340 },
  { x: 800, y: 340 },
];
const TILE_W = 260;
const TILE_H = 140;

export const FeatureButtonsTilesPressIntoV32: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 186, 202));
  const b2 = seg(frame, 195, 211) * (1 - seg(frame, 360, 376));
  const b3 = seg(frame, 369, 385) * (1 - seg(frame, 532, 548));
  const b4 = seg(frame, 541, 557) * (1 - seg(frame, 717, 733));
  const b5 = seg(frame, 726, 742); // holds through 951

  const chipPop = pop(456);

  // beat 2: the tiles "just grow a little on hover" — a small, unconvincing pulse
  const tilePulse = 1 + 0.05 * Math.sin((frame - 195) * 0.15);

  // beat 3: four samples fly in from the corners and stack into one recipe card
  const cornerFrom: [number, number][] = [
    [60, 40],
    [1180, 40],
    [60, 640],
    [1180, 640],
  ];
  const stackAt = { x: 590, y: 260 };
  const convergeT = interpolate(frame, [369, 405], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  // beat 4: fan of four real buttons this recipe now drives
  const FAN_ICONS = [
    { emoji: "🔍", label: "header search" },
    { emoji: "✕", label: "modal close" },
    { emoji: "▶", label: "marquee play" },
    { emoji: "←", label: "news back" },
  ];
  const fanPop = (i: number) => pop(557 + i * 10);

  // beat 5: the six tiles fan fully out
  const tilePop = (i: number) => pop(742 + i * 10);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : mismatched buttons everywhere ---------------- */}
        <Group opacity={b1}>
          <Headline y={40} text="Every button felt different." accentColor={P.danger} opacity={b1} fontSize={28} />
          {CHAOS_BUTTONS.map((c, i) => {
            const s = pop(15 + i * 8);
            return (
              <div
                key={`c1-${i}`}
                style={{
                  position: "absolute",
                  left: c.x,
                  top: c.y,
                  width: c.w,
                  height: c.h,
                  borderRadius: c.r,
                  background: P.card,
                  border: `1.5px solid ${P.border}`,
                  transform: `rotate(${c.rot}deg) scale(${Math.min(1, s)})`,
                  opacity: Math.min(1, s),
                }}
              />
            );
          })}
          <StatPill x={150} y={560} emoji="😐" text="flat, or barely reacting" tone="danger" opacity={b1} />
          <CaptionBand y={646} text="Some flat, some barely reacting when you pressed them" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : the home-screen tiles, no better ---------------- */}
        <Group opacity={b2}>
          <Headline y={40} text="The tiles weren't any better." accentColor={P.danger} opacity={b2} fontSize={28} />
          {TILE_GRID.map((t, i) => {
            const s = pop(195 + i * 6);
            return (
              <div
                key={`t2-${i}`}
                style={{
                  position: "absolute",
                  left: t.x,
                  top: t.y - 30,
                  width: TILE_W * 0.7,
                  height: TILE_H * 0.7,
                  borderRadius: 18,
                  background: P.card,
                  border: `1.5px solid ${P.border}`,
                  transform: `scale(${Math.min(1, s) * tilePulse})`,
                  opacity: Math.min(1, s),
                }}
              />
            );
          })}
          <StatPill x={150} y={560} emoji="😑" text="grows a little on hover, nothing physical" tone="danger" opacity={b2} />
          <CaptionBand y={646} text="Just a little bigger on hover — nothing felt physical" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the stack — one CSS recipe ---------------- */}
        <Group opacity={b3}>
          <Headline y={40} text="One CSS recipe — an embossed shadow." accentColor={P.accent} opacity={b3} fontSize={28} />
          {cornerFrom.map((from, i) => {
            const x = from[0] + (stackAt.x - from[0]) * convergeT + i * 4;
            const y = from[1] + (stackAt.y - from[1]) * convergeT + i * 4;
            return (
              <div
                key={`s3-${i}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 130,
                  height: 90,
                  borderRadius: 20,
                  background: P.card,
                  ...pressed(true),
                  opacity: b3,
                }}
              />
            );
          })}
          <FilterChip x={528} y={370} text="CSS" icon="🎨" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <StatPill x={150} y={560} emoji="🪄" text="makes anything look pressed" tone="accent" opacity={b3} />
          <CaptionBand y={646} text="An embossed shadow that makes anything look pressed" tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : the recipe rolls out — real buttons, real site ---------------- */}
        <Group opacity={b4}>
          <Headline y={40} text="Every circular button, light and dark, every palette." accentColor={P.accent} opacity={b4} fontSize={24} />
          {FAN_ICONS.map((f, i) => {
            const s = fanPop(i);
            return (
              <div
                key={`f4-${i}`}
                style={{
                  position: "absolute",
                  left: 250 + i * 230,
                  top: 130,
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  background: P.card,
                  ...pressed(true),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  transform: `scale(${Math.min(1, s)})`,
                  opacity: Math.min(1, s),
                }}
              >
                {f.emoji}
              </div>
            );
          })}
          {FAN_ICONS.map((f, i) => (
            <div
              key={`fl4-${i}`}
              style={{
                position: "absolute",
                left: 250 + i * 230 - 20,
                top: 226,
                width: 130,
                textAlign: "center",
                fontSize: 13.5,
                fontWeight: 600,
                color: P.muted,
                opacity: Math.min(1, fanPop(i)),
              }}
            >
              {f.label}
            </div>
          ))}
        </Group>
        <LiveWindow
          file={shots}
          shot="hub"
          title="vitalii.no — every page carries the header buttons"
          from={541}
          hold={192}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.15 }}
          opacity={b4}
          win={HUB_WIN}
        />
        <Group opacity={b4}>
          <CaptionBand y={646} text="Now every circular button uses it, in light mode and dark" tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : the deck fans all the way out — six tiles ---------------- */}
        <Group opacity={b5}>
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 34,
              fontFamily,
            }}
          >
            <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 800, letterSpacing: -4, color: P.success }}>6</div>
            <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>TILES, PRESSED INTO THE PAGE</div>
          </div>
          <StatPill x={780} y={52} emoji="✅" text="one shadow language" tone="success" opacity={b5} />
          {TILE_GRID.map((t, i) => {
            const s = tilePop(i);
            return (
              <div
                key={`t5-${i}`}
                style={{
                  position: "absolute",
                  left: t.x,
                  top: t.y,
                  width: TILE_W,
                  height: TILE_H,
                  borderRadius: 22,
                  background: P.card,
                  ...pressed(true),
                  transform: `scale(${Math.min(1, s)})`,
                  opacity: Math.min(1, s),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                }}
              >
                🏠
              </div>
            );
          })}
          <CaptionBand y={646} text="Six tiles, pressed into the page instead of just growing on hover" tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
