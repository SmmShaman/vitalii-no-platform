/**
 * FeatureLiveBadgeDrawsFlagV39 — feature v39 — 1280x720, 854 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 3 (card deck), mood sand. The deck IS the twenty thousand article
 * rows being rescanned: beat 1 shows four calm rows (the innocent "most read"
 * widget), beat 2 explodes them into a dozen scattered row-cards (the full
 * rescan on every page load), beat 3 slams that same deck into a red "3.0s"
 * timeout wall (the invisible server limit — no UI for this, stays drawn),
 * beat 4 has the deck converge and get absorbed into a recording of the real
 * fix commit (the single indexed lookup swallows the whole scan), and beat 5
 * plays a recording of the feature's own page while one calm "indexed" card
 * sits in front of it. Beats 4-5 are recordings (shots/v39.json); 1-3 have no
 * authorized "before" UI to record (the live site already runs the fixed
 * version) and beat 3 is the DB timeout itself, so all three stay drawn.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–150  "A simple 'most read' list on the homepage nearly took down the whole page."
 *  b2 159–339  "Finding it meant scanning all twenty thousand articles, every single time someone opened the page."
 *  b3 348–488  "That crept past the three-second limit the server allows before it simply gives up."
 *  b4 497–687  "So one PostgreSQL function now answers with a single indexed lookup instead of a full rescan."
 *  b5 696–809  "One indexed call now replaces a scan of twenty thousand." — holds to 854.
 *
 * Single tech name in the whole clip: PostgreSQL (beat 4 chip only).
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, CaptionBand, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, WIN_DEFAULT } from "./live-primitives";
import shots from "./shots/v39.json";

const P = MOODS.sand;
const WIN = WIN_DEFAULT;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** the survivor: a small top-left value that carries the argument across every beat. */
const stat = (value: string, unit: string | undefined, label: string, color: string, scale: number) => (
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
    <div style={{ fontSize: 88, lineHeight: 1, fontWeight: 800, letterSpacing: -3, color, fontVariantNumeric: "tabular-nums" }}>
      {value}
      {unit ? <span style={{ fontSize: 88 * 0.36, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, letterSpacing: 2, color: P.muted }}>{label}</div>
  </div>
);

/** one row-card of the deck — an article row being scanned. */
const RowCard: React.FC<{ x: number; y: number; rot: number; opacity: number; scale: number; w?: number; h?: number }> = ({
  x,
  y,
  rot,
  opacity,
  scale,
  w = 112,
  h = 70,
}) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 12,
        background: P.card,
        border: `1.5px solid ${P.border}`,
        boxShadow: "0 8px 18px rgba(80,50,10,0.14)",
        opacity,
        transform: `rotate(${rot}deg) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 10px",
      }}
    >
      <div style={{ width: "70%", height: 8, borderRadius: 4, background: P.accentBg }} />
      <div style={{ width: "45%", height: 8, borderRadius: 4, background: "#EFE3CC", marginTop: 8 }} />
    </div>
  );
};

/** neat widget row for beat 1 — the calm "most read" list before the fix. */
const NeatRow: React.FC<{ y: number; opacity: number; scale: number }> = ({ y, opacity, scale }) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 520,
        top: y,
        width: 600,
        height: 76,
        borderRadius: 14,
        background: P.card,
        border: `1.5px solid ${P.border}`,
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 20px",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: P.accentBg }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: "80%", height: 11, borderRadius: 5, background: "#EFE3CC" }} />
        <div style={{ width: "50%", height: 11, borderRadius: 5, background: "#F3EADB", marginTop: 9 }} />
      </div>
    </div>
  );
};

const SCATTER: { x: number; y: number; rot: number }[] = [
  { x: 120, y: 110, rot: -6 },
  { x: 300, y: 70, rot: 8 },
  { x: 500, y: 120, rot: -10 },
  { x: 700, y: 80, rot: 5 },
  { x: 900, y: 130, rot: -8 },
  { x: 1080, y: 90, rot: 10 },
  { x: 160, y: 430, rot: 7 },
  { x: 360, y: 490, rot: -5 },
  { x: 560, y: 450, rot: 9 },
  { x: 760, y: 500, rot: -7 },
  { x: 960, y: 460, rot: 6 },
  { x: 1100, y: 410, rot: -9 },
];

export const FeatureLiveBadgeDrawsFlagV39: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // fade-out windows end exactly where the next beat's fade-in starts (9-frame
  // gap, not the usual 16) — a wider fade-out here left the outgoing stat()
  // number visibly ghosted under the incoming one for 7 frames at every cut.
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 150, 159));
  const b2 = seg(frame, 159, 175) * (1 - seg(frame, 339, 348));
  const b3 = seg(frame, 348, 364) * (1 - seg(frame, 488, 497));
  const b4 = seg(frame, 497, 513) * (1 - seg(frame, 687, 696));
  const b5 = seg(frame, 696, 712); // holds through 854

  const statPop1 = pop(15);
  const statPop2 = pop(159);
  const statPop3 = pop(348);
  const statPop4 = pop(497);
  const statPop5 = pop(696);
  const chipPop = pop(560);

  // beat 2: the counter races up to twenty thousand while the deck scatters
  const rescanCount = Math.floor(
    interpolate(frame, [159, 300], [1, 20000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  // beat 3: cards slam rightward into the timeout wall (a slide, not a crossfade)
  const slamT = interpolate(frame, [348, 400], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const countdown = Math.max(0, 3 - interpolate(frame, [348, 428], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const wallFlash = seg(frame, 428, 444);

  // beat 4: the deck converges on the fix and is absorbed into the window
  const winCenterX = WIN.x + WIN.w * 0.5;
  const winCenterY = WIN.y + WIN.h * 0.5;
  const convergeT = interpolate(frame, [497, 570], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const absorb = interpolate(frame, [545, 585], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : a calm, ordinary "most read" widget ---------------- */}
        <Group opacity={b1}>
          {stat("1", undefined, "SIMPLE WIDGET, HOMEPAGE", P.muted, statPop1)}
          <StatPill x={150} y={560} emoji="📰" text="a most-read list on the homepage" tone="danger" opacity={b1} />
          {[0, 1, 2, 3].map((i) => (
            <NeatRow key={`n1-${i}`} y={172 + i * 88} opacity={Math.min(1, pop(15 + i * 8))} scale={Math.min(1, pop(15 + i * 8))} />
          ))}
          <CaptionBand y={646} text="A simple 'most read' list nearly took down the whole page" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : the deck scatters — the full rescan, every load ---------------- */}
        <Group opacity={b2}>
          {stat(rescanCount.toLocaleString("en-US"), undefined, "ARTICLES RESCANNED, EVERY PAGE LOAD", P.danger, statPop2)}
          <StatPill x={880} y={560} emoji="🔁" text="every single time the page opens" tone="danger" opacity={b2} />
          {SCATTER.map((c, i) => {
            const s = Math.min(1, pop(159 + i * 9));
            return <RowCard key={`s2-${i}`} x={c.x} y={c.y} rot={c.rot} opacity={s} scale={s} />;
          })}
          <CaptionBand y={646} text="Scanning all twenty thousand articles, every single time" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the deck slams into the 3-second wall (metaphor, no UI) ---------------- */}
        <Group opacity={b3}>
          {stat(countdown.toFixed(2), "S", "LEFT BEFORE THE SERVER GIVES UP", P.danger, statPop3)}
          <StatPill x={150} y={560} emoji="⏱" text="the anonymous query timeout" tone="danger" opacity={b3} />
          <div
            style={{
              position: "absolute",
              left: 980,
              top: 70,
              width: 16,
              height: 540,
              borderRadius: 8,
              background: wallFlash > 0.3 ? P.danger : P.dangerBg,
              border: `2px solid ${P.danger}`,
              boxShadow: wallFlash > 0.3 ? `0 0 ${24 * wallFlash}px rgba(192,57,43,0.6)` : "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 1006,
              top: 300,
              width: 140,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 1.4,
              color: P.danger,
              transform: "rotate(90deg)",
              transformOrigin: "left top",
            }}
          >
            3.0S LIMIT
          </div>
          {SCATTER.map((c, i) => {
            const targetX = 950 - (i % 4) * 90;
            const targetY = 100 + Math.floor(i / 4) * 150;
            const x = c.x + (targetX - c.x) * slamT;
            const y = c.y + (targetY - c.y) * slamT;
            return <RowCard key={`w3-${i}`} x={x} y={y} rot={c.rot * (1 - slamT)} opacity={b3} scale={1} />;
          })}
          <CaptionBand y={646} text="That crept past the three-second limit — the server simply gives up" tone="danger" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : the deck is absorbed into the real fix ---------------- */}
        <Group opacity={b4}>
          {stat("1", undefined, "INDEXED LOOKUP, NOT A RESCAN", P.accent, statPop4)}
          <StatPill x={880} y={560} emoji="⚡" text="a single indexed lookup" tone="accent" opacity={b4} />
          <FilterChip x={WIN.x + WIN.w - 230} y={WIN.y - 34} text="PostgreSQL" icon="🐘" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          {SCATTER.map((c, i) => {
            const x = c.x + (winCenterX - c.x) * convergeT;
            const y = c.y + (winCenterY - c.y) * convergeT;
            const s = Math.max(0, 1 - convergeT * 0.6) * absorb;
            return <RowCard key={`a4-${i}`} x={x} y={y} rot={c.rot} opacity={s} scale={Math.max(0.2, 1 - convergeT * 0.7)} w={90} h={56} />;
          })}
        </Group>
        <LiveWindow
          file={shots}
          shot="fix1"
          title="github.com — the indexed most-read function"
          from={497}
          hold={190}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.45, y: 0.4 }}
          opacity={b4}
        />
        <Group opacity={b4}>
          <CaptionBand y={646} text="One PostgreSQL function answers with a single indexed lookup" tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : one calm card, the feature shipped, holds to the tail ---------------- */}
        <Group opacity={b5}>
          {stat("1", undefined, "INDEXED CALL REPLACES 20,000", P.success, statPop5)}
          <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={statPop5} />
          <StatPill x={880} y={560} emoji="✅" text="one call, every time" tone="success" opacity={b5} />
          <RowCard x={150} y={560} rot={-2} opacity={b5} scale={Math.min(1, statPop5)} w={130} h={64} />
          <CaptionBand y={646} text="One indexed call now replaces a scan of twenty thousand" tone="success" opacity={b5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features — the fix, shipped"
          from={696}
          hold={158}
          zoom={(t) => 1.08 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.45 }}
          opacity={b5}
        />
      </div>
    </PaletteProvider>
  );
};
