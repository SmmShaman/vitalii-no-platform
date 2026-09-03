/**
 * FeatureAutonomousPublishing — feature p20 — 1280x720, 939 frames @30fps.
 * VOICE-SYNCED (owner rule, 2026-08-31) — beat windows below are measured
 * from the real voiceover. Rebuild the audio and you must rebuild these
 * numbers with it.
 *
 * Art direction handed down by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md), NOT drawn locally:
 *   archetype 3 "card deck" — the pile IS the frame, not a corner prop.
 *     Cards are 230-360px wide and live centered in the frame's middle
 *     band (x ~410-855, y ~245-505). They fly in and stack through the
 *     problem beats (b1-b3, growing from 5 to 12 cards, genuinely dense
 *     by b3), then COLLAPSE (not a crossfade — every card animates
 *     position+scale toward one point) into a hero card at the start of
 *     b4, which releases an orderly conveyor of 4 labeled chips, which
 *     in turn gives way to the final 2-panel result fan in b5. The pile
 *     SHRINKS across the whole clip: 12 cards -> 4 chips -> 2 panels ->
 *     "0 taps". REVISION 2026-09-03 (owner note): the first pass buried
 *     the deck in the lower-left corner at ~180px under a big centered
 *     headline + giant number, which is exactly the retired default
 *     layout. Fixed by (1) resizing/recentering the deck so it is what
 *     the viewer watches, (2) replacing every big centered Headline with
 *     one small persistent kicker+title bottom-left (p18-style) so nothing
 *     out-shouts the cards, (3) shrinking the running number into a small
 *     corner readout that persists the whole clip (60 -> 4 -> 0) instead
 *     of a 118px hero digit, (4) giving beat 2 four full-size labelled
 *     cards, one per narrated phrase, and (5) adding a ground shadow under
 *     the b3 pile so its bulk reads as genuinely heavy.
 *   mood "dawn" — `<PaletteProvider value={MOODS.dawn}>` wraps the tree.
 *
 * Beat windows (measured, fps 30):
 *   b1  15-177  "Forty taps a day. Sometimes sixty. Just to move articles
 *                from one step to the next."
 *   b2 186-369  "Generate the picture. Rewrite it in three languages.
 *                Put it on the site. Post it. Repeat."
 *   b3 378-551  "None of it was thinking. It was the same buttons in the
 *                same order, a factory line with no conveyor."
 *   b4 560-762  "So one Supabase function became the conveyor. It runs
 *                the chain and stops only to ask when something looks
 *                wrong."
 *   b5 771-894  "Fifteen minutes per article became two. And the taps
 *                went to zero."
 *   tail 894-939 — b5 HOLDS, it does not fade to an empty frame.
 *
 * Sync notes: b1 spawns 5 unlabeled tap-cards on the pile. b2 spawns 4
 * BIG labelled cards, one per clause of "Generate the picture / Rewrite in
 * 3 languages / Publish on the site / Post to social", each landing near
 * the words that name it, followed by a ↻ repeat cue for "Repeat.". b3
 * adds 3 more filler cards (pile now 12, at its heaviest) plus a ground
 * shadow and a broken dashed line reading "no conveyor between steps". At
 * frame 540 (inside b3's own window) every pile card starts flying toward
 * one point — the non-crossfade transition — and by ~580 (early b4) that
 * point has become the "auto-publish-news" hero card, which releases 4
 * conveyor chips in sequence. A ❓→✓ badge on the "Publish" chip covers
 * "stops only to ask when something looks wrong". The ONE tech caption of
 * the clip sits in b4, naming auto-publish-news. b5 introduces its own
 * BEFORE/NOW panels with a fan-open entrance (rotating in from opposite
 * angles) so the "fan sorts itself" beat is a fresh formation, not a
 * crossfade of the conveyor chips. The small kicker/title label and the
 * corner number both survive every beat without ever fading out.
 */
import React from "react";
import { useCurrentFrame, spring, useVideoConfig, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import { LightBg, Group, Panel, FlowArrow, CheckBadge, CaptionBand, seg, fontFamily } from "./bright-primitives";

const P = MOODS.dawn;

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const BEATS = {
  b1: [15, 177],
  b2: [186, 369],
  b3: [378, 551],
  b4: [560, 762],
  b5: [771, 894],
} as const;

/** Deterministic pseudo-random in [-range, range] from an integer seed (no per-frame flicker). */
const jitter = (seed: number, range: number): number => {
  const v = Math.sin(seed * 12.9898) * 43758.5453;
  return ((v - Math.floor(v)) - 0.5) * 2 * range;
};

type CardTone = "card" | "danger" | "success" | "accent";

/** One deck card — center-anchored (x/y are the card's CENTER) so pile→collapse→fan math is plain lerp. */
const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
  tone?: CardTone;
  emoji?: string;
  title?: string;
  sub?: string;
  fontSize?: number;
}> = ({ x, y, w, h, rotate = 0, scale = 1, opacity = 1, tone = "card", emoji, title, sub, fontSize = 16 }) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  const bg = tone === "danger" ? P.dangerBg : tone === "success" ? P.successBg : tone === "accent" ? P.accentBg : P.card;
  const edge = tone === "danger" ? P.dangerEdge : tone === "success" ? P.successEdge : tone === "accent" ? P.accentEdge : P.border;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 18,
        background: bg,
        border: `2px solid ${edge}`,
        boxShadow: cardShadow,
        opacity,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily,
      }}
    >
      {emoji ? <div style={{ fontSize: fontSize * 1.9, lineHeight: 1 }}>{emoji}</div> : null}
      {title ? (
        <div style={{ fontSize, fontWeight: 700, color: P.ink, textAlign: "center", padding: "0 12px", lineHeight: 1.22 }}>
          {title}
        </div>
      ) : null}
      {sub ? (
        <div style={{ fontSize: fontSize * 0.66, fontWeight: 600, color: P.muted, textAlign: "center", padding: "0 10px" }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};

type PileCard = { spawn: number; emoji: string; title?: string; big?: boolean };

// 12 pile cards, in spawn order: 5 generic taps (b1), 4 BIG labelled steps (b2, one per narrated
// clause), 3 more filler taps (b3, pushing the pile to its heaviest).
const PILE_CARDS: PileCard[] = [
  { spawn: 26, emoji: "🖱️" },
  { spawn: 46, emoji: "🖱️" },
  { spawn: 66, emoji: "🖱️" },
  { spawn: 86, emoji: "🖱️" },
  { spawn: 106, emoji: "🖱️" },
  { spawn: 204, emoji: "🎨", title: "Generate the picture", big: true },
  { spawn: 246, emoji: "🌍", title: "Rewrite in 3 languages", big: true },
  { spawn: 288, emoji: "🌐", title: "Publish on the site", big: true },
  { spawn: 322, emoji: "📢", title: "Post to social", big: true },
  { spawn: 396, emoji: "🖱️" },
  { spawn: 414, emoji: "🖱️" },
  { spawn: 432, emoji: "🖱️" },
];

// The pile lives dead-center, in the frame's middle band — this is the spine of the clip.
const PILE_CX = 640;
const PILE_BASE_CY = 430;
const GENERIC_W = 230;
const GENERIC_H = 150;
const BIG_W = 360;
const BIG_H = 210;

const HERO_CX = 220;
const HERO_CY = 350;
const COLLAPSE_START = 540;
const COLLAPSE_STAGGER = 4;
const COLLAPSE_DUR = 38;

const CONVEYOR = [
  { x: 500, emoji: "🎨", title: "Image" },
  { x: 720, emoji: "🌍", title: "Rewrite ×3" },
  { x: 940, emoji: "🌐", title: "Publish" },
  { x: 1160, emoji: "📢", title: "Post" },
];
const CONVEYOR_SPAWN = [608, 640, 672, 704];
const CONVEYOR_ARROW_X = [378, 598, 818, 1038];

export const FeatureAutonomousPublishing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  /** Beat zone: fades in after the beat opens, fully gone before it closes. */
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

  // ── Persistent small label + corner readout — survive every beat, never fade out ──
  const labelIn = seg(frame, 20, 36);
  const stageIn = seg(frame, 8, 22);
  const tapCount = Math.round(
    frame < 20 ? 0 : frame < 90 ? Math.min(40, ((frame - 20) / 60) * 40) : Math.min(60, 40 + ((frame - 90) / 30) * 20),
  );
  const readoutVal = frame < 555 ? String(tapCount) : frame < 766 ? "4" : "0";
  const readoutLabel = frame < 555 ? "manual taps today" : frame < 766 ? "automated steps" : "manual taps now";
  const readoutColor = frame < 555 ? P.danger : frame < 766 ? P.accent : P.success;

  // ── Beat 2: repeat cue near the end of the clause list ──
  const repeatOp = seg(frame, 338, 354);

  // ── Beat 3: "no conveyor" broken-line marks, ground shadow, gentle pile wobble ──
  const wobble = Math.sin(frame * 0.1) * (zone("b3") > 0.02 ? 2.2 : 0);
  const gapOp = seg(frame, 432, 448);
  const shadowOp = zone("b3") * 0.9;

  // ── Beat 4: hero + conveyor ──
  const heroPop = pop(580);
  const heroLabelOp = seg(frame, 602, 616);
  const techCapOp = seg(frame, 618, 634) * (1 - seg(frame, 748, 760));
  const arrowsOp = (i: number) => seg(frame, CONVEYOR_SPAWN[i] - 6, CONVEYOR_SPAWN[i] + 10);
  const questionOp = seg(frame, 700, 712) * (1 - seg(frame, 726, 736));
  const resolveOp = seg(frame, 726, 738);

  // ── Beat 5: fan-open result panels ──
  const beforePop = pop(BEATS.b5[0] + 10);
  const afterPop = pop(BEATS.b5[0] + 26);
  const arrRes = seg(frame, BEATS.b5[0] + 30, BEATS.b5[0] + 46, Easing.inOut(Easing.cubic));
  const zeroPop = pop(BEATS.b5[0] + 56);
  const check = pop(BEATS.b5[0] + 68);
  const resultCapOp = seg(frame, BEATS.b5[0] + 64, BEATS.b5[0] + 80, Easing.out(Easing.cubic));

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />
      <PaletteProvider value={P}>
        {/* ════ Persistent small label — p18-style, bottom-left, never the biggest thing on screen ════ */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 622,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: P.accent,
            opacity: labelIn,
            fontFamily,
          }}
        >
          Autonomous publishing
        </div>
        <div style={{ position: "absolute", left: 60, top: 646, fontSize: 19, fontWeight: 700, color: P.ink, opacity: labelIn, fontFamily }}>
          Forty taps become one function
        </div>

        {/* ════ Persistent corner readout — small, secondary, survives every beat (60 → 4 → 0) ════ */}
        <div style={{ position: "absolute", left: 972, top: 40, fontSize: 52, fontWeight: 800, letterSpacing: -2, color: readoutColor, opacity: labelIn, fontFamily }}>
          {readoutVal}
        </div>
        <div style={{ position: "absolute", left: 972, top: 100, width: 220, fontSize: 14, fontWeight: 650, color: P.muted, opacity: labelIn, fontFamily }}>
          {readoutLabel}
        </div>

        {/* ════ Persistent stage line — the deck's footprint, survives every beat ════ */}
        <div style={{ position: "absolute", left: 340, top: 540, width: 600, height: 3, borderRadius: 2, background: P.border, opacity: stageIn * 0.9 }} />

        {/* ════ Beat 1 — PROBLEM: the pile begins ════ */}
        <Group opacity={b1}>
          <CaptionBand text="Just to move one article from step to step" tone="danger" opacity={seg(frame, 120, 140)} y={578} />
        </Group>

        {/* ════ Beat 2 — PROBLEM: the four steps, spelled out, one card per phrase ════ */}
        <Group opacity={b2}>
          <CaptionBand text="Generate. Rewrite × 3. Publish. Post. Then repeat." tone="danger" opacity={seg(frame, 326, 342)} y={578} />
          <div
            style={{
              position: "absolute",
              left: 900,
              top: 320,
              width: 160,
              textAlign: "center",
              fontSize: 40,
              color: P.danger,
              opacity: repeatOp,
              transform: `scale(${0.7 + 0.3 * repeatOp}) rotate(${(1 - repeatOp) * -50}deg)`,
              fontFamily,
            }}
          >
            ↻
          </div>
        </Group>

        {/* ════ Beat 3 — PROBLEM: no conveyor, the pile at its heaviest ════ */}
        <Group opacity={b3}>
          {/* ground shadow under the pile — sells the weight of 12 stacked cards */}
          <div
            style={{
              position: "absolute",
              left: PILE_CX - 280,
              top: 500,
              width: 560,
              height: 46,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(22,35,63,0.32) 0%, rgba(22,35,63,0) 72%)",
              opacity: shadowOp,
            }}
          />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 900, top: 300 + i * 34, width: 34, height: 5, borderRadius: 2, background: P.danger, opacity: gapOp * 0.75 }} />
          ))}
          <div style={{ position: "absolute", left: 900, top: 404, width: 260, fontSize: 16, fontWeight: 700, color: P.danger, opacity: gapOp, fontFamily }}>
            Twelve manual actions — stacked, none of them connected
          </div>
          <CaptionBand text="A factory line with no conveyor" tone="danger" opacity={seg(frame, 502, 518)} y={578} />
        </Group>

        {/* ════ THE PILE — the spine of the clip: spawns in b1, grows through b2/b3, collapses at the b3→b4 seam ════ */}
        {PILE_CARDS.map((c, i) => {
          const p = pop(c.spawn);
          if (p <= 0.004) return null;
          const cx = PILE_CX + jitter(i * 3.1 + 1, 32);
          const cy = PILE_BASE_CY - i * 10 + wobble * (i / PILE_CARDS.length);
          const rot = jitter(i * 7.7 + 2, 8) + wobble * 0.4;
          const flyDy = (1 - Math.min(1, p)) * 180;

          const cs = COLLAPSE_START + i * COLLAPSE_STAGGER;
          const ce = cs + COLLAPSE_DUR;
          const t = seg(frame, cs, ce, Easing.in(Easing.cubic));

          const x = cx + (HERO_CX - cx) * t;
          const y = cy + flyDy + (HERO_CY - (cy + flyDy)) * t;
          const scale = Math.max(0, Math.min(1.06, p)) * (1 - t);
          const opacity = Math.max(0, Math.min(1, p)) * (1 - t);

          const w = c.big ? BIG_W : GENERIC_W;
          const h = c.big ? BIG_H : GENERIC_H;
          const fontSize = c.big ? 21 : 16;

          return (
            <Card key={c.spawn} x={x} y={y} w={w} h={h} rotate={rot * (1 - t)} scale={scale} opacity={opacity} tone="danger" emoji={c.emoji} title={c.title} fontSize={fontSize} />
          );
        })}

        {/* ════ Beat 4 — SOLUTION: hero card + conveyor ════ */}
        <Group opacity={b4}>
          <Card x={HERO_CX} y={HERO_CY} w={300} h={200} scale={Math.min(1.06, heroPop)} opacity={Math.min(1, heroPop)} tone="success" emoji="⚡" title="auto-publish-news" sub="runs the whole chain" fontSize={22} />
          <div style={{ position: "absolute", left: HERO_CX - 150, top: HERO_CY + 112, width: 300, textAlign: "center", fontSize: 16, fontWeight: 650, color: P.success, opacity: heroLabelOp, fontFamily }}>
            one Supabase Edge Function
          </div>

          <FlowArrow x={CONVEYOR_ARROW_X[0]} y={HERO_CY - 3} len={38} progress={arrowsOp(0)} color={P.success} />
          {CONVEYOR.map((c, i) => {
            const p = pop(CONVEYOR_SPAWN[i]);
            if (p <= 0.004) return null;
            return <Card key={c.title} x={c.x} y={HERO_CY} w={180} h={130} scale={Math.min(1.06, p)} opacity={Math.min(1, p)} tone="accent" emoji={c.emoji} title={c.title} fontSize={18} />;
          })}
          {[1, 2, 3].map((i) => (
            <FlowArrow key={i} x={CONVEYOR_ARROW_X[i]} y={HERO_CY - 3} len={38} progress={arrowsOp(i)} color={P.success} />
          ))}

          {/* "stops only to ask when something looks wrong" — a quick review flag on Publish */}
          <div
            style={{
              position: "absolute",
              left: CONVEYOR[2].x + 50,
              top: HERO_CY - 100,
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: P.card,
              border: `2.5px solid ${P.amber}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 21,
              opacity: questionOp,
              boxShadow: cardShadow,
              fontFamily,
            }}
          >
            ?
          </div>
          <div style={{ position: "absolute", left: CONVEYOR[2].x + 50, top: HERO_CY - 100, opacity: resolveOp }}>
            <CheckBadge x={0} y={0} size={42} scale={Math.min(1, resolveOp * 2)} opacity={Math.min(1, resolveOp)} />
          </div>

          <CaptionBand text="auto-publish-news runs the whole chain inside one Supabase Edge Function" tone="accent" opacity={techCapOp} y={578} />
        </Group>

        {/* ════ Beat 5 — RESULT, fan-opens and holds through the tail ════ */}
        <Group opacity={b5}>
          <Panel x={150} y={190} w={430} h={210} tone="danger" opacity={Math.min(1, beforePop)}>
            <div style={{ padding: "26px 30px", transform: `rotate(${(1 - Math.min(1, beforePop)) * -16}deg)`, transformOrigin: "bottom right", fontFamily }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: P.danger, letterSpacing: 1 }}>BEFORE</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: P.ink, marginTop: 14 }}>15 minutes</div>
              <div style={{ fontSize: 24, fontWeight: 650, color: P.muted, marginTop: 6 }}>per article, fully manual</div>
            </div>
          </Panel>
          <FlowArrow x={598} y={288} len={130} progress={arrRes} color={P.success} />
          <Panel x={700} y={190} w={430} h={210} tone="success" opacity={Math.min(1, afterPop)}>
            <div style={{ padding: "26px 30px", transform: `rotate(${(1 - Math.min(1, afterPop)) * 16}deg) scale(${0.9 + 0.1 * Math.min(1, afterPop)})`, transformOrigin: "bottom left", fontFamily }}>
              <div style={{ fontSize: 19, fontWeight: 700, color: P.success, letterSpacing: 1 }}>NOW</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: P.ink, marginTop: 14 }}>2 minutes</div>
              <div style={{ fontSize: 24, fontWeight: 650, color: P.muted, marginTop: 6 }}>per article, automatic</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: 0, top: 448, width: 1280, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: resultCapOp, fontFamily }}>
            <div style={{ position: "relative", width: 54, height: 54, transform: `scale(${Math.min(1, zeroPop)})` }}>
              <CheckBadge x={0} y={0} size={54} scale={Math.min(1, check)} opacity={Math.min(1, check)} />
            </div>
            <span style={{ fontSize: 54, fontWeight: 800, color: P.success }}>0 taps</span>
          </div>
          <div style={{ position: "absolute", left: 0, top: 562, width: 1280, textAlign: "center", opacity: resultCapOp, fontFamily }}>
            <div style={{ fontSize: 22, fontWeight: 650, color: P.muted }}>The article moves itself — review only when something looks wrong.</div>
          </div>
        </Group>
      </PaletteProvider>
    </div>
  );
};
