/**
 * FeatureAutonomousPublishing — feature p20 — 1280x720, 939 frames @30fps.
 * VOICE-SYNCED (owner rule, 2026-08-31) — beat windows below are measured
 * from the real voiceover. Rebuild the audio and you must rebuild these
 * numbers with it.
 *
 * Art direction handed down by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md), NOT drawn locally:
 *   archetype 3 "card deck" — a stack of small cards flies in and grows
 *     taller through the problem beats (b1-b3), then COLLAPSES (not a
 *     crossfade — every card animates position+scale toward a single
 *     point) into one hero card at the start of b4, which then releases
 *     an orderly conveyor of 4 labeled chips, which in turn fans open
 *     into the final 2-card result grid in b5. The pile SHRINKS across
 *     the whole clip: ~12 visible cards -> 4 conveyor chips -> 2 result
 *     panels -> "0 taps". A thin stage line under the deck's footprint
 *     is rendered continuously from frame ~10 to the end and never
 *     fades — the one element that survives every beat.
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
 * Sync notes: b1-b3 keep adding cards to the SAME pile (5 generic taps in
 * b1, 4 labeled step-cards in b2 timed to their own clause, 3 more filler
 * cards in b3) so the pile is visibly taller by the time b3 calls it "a
 * factory line with no conveyor". At ~540 (inside b3's own window, just
 * before its fade-out) every pile card starts flying toward one point —
 * this is the non-crossfade transition — and by ~600 (early b4) that point
 * has become the "auto-publish-news" hero card, which releases 4 conveyor
 * chips across the rest of b4. A small ❓→✓ badge on the "Publish" chip
 * covers "stops only to ask when something looks wrong". The ONE tech
 * caption of the clip sits in b4, naming auto-publish-news. b5 does not
 * reuse the chip elements; it introduces its own BEFORE/NOW panels with a
 * fan-open entrance (rotating in from opposite angles, like a hand of
 * cards opening) so the "fan sorts itself" beat is a fresh formation, not
 * a plain crossfade of the same nodes.
 */
import React from "react";
import { useCurrentFrame, spring, useVideoConfig, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  FlowArrow,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";

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
}> = ({ x, y, w, h, rotate = 0, scale = 1, opacity = 1, tone = "card", emoji, title, sub, fontSize = 14 }) => {
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
        borderRadius: 14,
        background: bg,
        border: `1.5px solid ${edge}`,
        boxShadow: cardShadow,
        opacity,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        fontFamily,
      }}
    >
      {emoji ? <div style={{ fontSize: fontSize * 1.7, lineHeight: 1 }}>{emoji}</div> : null}
      {title ? (
        <div style={{ fontSize, fontWeight: 700, color: P.ink, textAlign: "center", padding: "0 8px", lineHeight: 1.2 }}>
          {title}
        </div>
      ) : null}
      {sub ? (
        <div style={{ fontSize: fontSize * 0.72, fontWeight: 600, color: P.muted, textAlign: "center", padding: "0 6px" }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};

type PileCard = { spawn: number; emoji: string; title?: string; big?: boolean };

// 12 pile cards, in spawn order: 5 generic taps (b1), 4 labeled steps (b2), 3 more filler taps (b3).
const PILE_CARDS: PileCard[] = [
  { spawn: 26, emoji: "🖱️" }, // 🖱️
  { spawn: 46, emoji: "🖱️" },
  { spawn: 66, emoji: "🖱️" },
  { spawn: 86, emoji: "🖱️" },
  { spawn: 106, emoji: "🖱️" },
  { spawn: 200, emoji: "🎨", title: "Generate image", big: true }, // 🎨
  { spawn: 240, emoji: "🌍", title: "Rewrite × 3", big: true }, // 🌍
  { spawn: 284, emoji: "🌐", title: "Publish site", big: true }, // 🌐
  { spawn: 320, emoji: "📢", title: "Post social", big: true }, // 📢
  { spawn: 396, emoji: "🖱️" },
  { spawn: 416, emoji: "🖱️" },
  { spawn: 436, emoji: "🖱️" },
];

const PILE_X = 250;
const PILE_BASE_Y = 560;
const HERO_CX = 300;
const HERO_CY = 300;
const COLLAPSE_START = 540;
const COLLAPSE_STAGGER = 4;
const COLLAPSE_DUR = 38;

const CONVEYOR = [
  { x: 500, emoji: "🎨", title: "Image" },
  { x: 690, emoji: "🌍", title: "Rewrite ×3" },
  { x: 880, emoji: "🌐", title: "Publish" },
  { x: 1070, emoji: "📢", title: "Post" },
];
const CONVEYOR_SPAWN = [604, 640, 676, 712];

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

  // ── Persistent stage line — present from frame ~10 to the end, never fades ──
  const stageIn = seg(frame, 8, 22);

  // ── Beat 1: taps counter (visible through the whole problem arc b1-b3) ──
  const tapCount = Math.round(
    frame < 20 ? 0 : frame < 90 ? Math.min(40, ((frame - 20) / 60) * 40) : Math.min(60, 40 + ((frame - 90) / 30) * 20),
  );
  const counterOp = seg(frame, 22, 38);
  const numberPop = pop(24);

  // ── Beat 2: repeat cue near the end of the clause list ──
  const repeatOp = seg(frame, 336, 352);

  // ── Beat 3: "no conveyor" broken-line marks + gentle pile wobble ──
  const wobble = Math.sin(frame * 0.12) * (zone("b3") > 0.02 ? 1.6 : 0);
  const gapOp = seg(frame, 430, 446);

  // ── Beat 4: hero + conveyor ──
  const heroPop = pop(576);
  const heroLabelOp = seg(frame, 590, 604);
  const techCapOp = seg(frame, 606, 622) * (1 - seg(frame, 748, 760));
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
        {/* ════ Persistent footer credit — fades in early, never leaves ════ */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 680,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            color: P.accent,
            opacity: seg(frame, 20, 36),
            fontFamily,
          }}
        >
          Autonomous Publishing &middot; vitalii.no
        </div>

        {/* ════ Persistent stage line — the deck's footprint, survives every beat ════ */}
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 636,
            width: 980,
            height: 3,
            borderRadius: 2,
            background: P.border,
            opacity: stageIn * 0.9,
          }}
        />

        {/* ════ Beat 1 — PROBLEM: the pile begins ════ */}
        <Group opacity={b1}>
          <Headline text="Forty taps a day." accentText="Sometimes sixty." accentColor={P.danger} opacity={seg(frame, 18, 32)} />
          <CaptionBand text="Just to move one article from step to step" tone="danger" opacity={seg(frame, 120, 140)} y={598} />
        </Group>

        {/* ════ Beat 2 — PROBLEM: the four steps, spelled out ════ */}
        <Group opacity={b2}>
          <Headline text="The same four steps." accentText="Every single article." accentColor={P.danger} opacity={seg(frame, 190, 204)} />
          <CaptionBand text="Generate. Rewrite × 3. Publish. Post. Then repeat." tone="danger" opacity={seg(frame, 322, 338)} y={598} />
          <div
            style={{
              position: "absolute",
              left: PILE_X - 90,
              top: 300,
              width: 180,
              textAlign: "center",
              fontSize: 34,
              opacity: repeatOp,
              transform: `scale(${0.7 + 0.3 * repeatOp}) rotate(${(1 - repeatOp) * -40}deg)`,
              fontFamily,
            }}
          >
            ↻
          </div>
        </Group>

        {/* ════ Beat 3 — PROBLEM: no conveyor, the pile at its worst ════ */}
        <Group opacity={b3}>
          <Headline text="None of it was thinking." accentText="Same buttons, same order." accentColor={P.danger} opacity={seg(frame, 384, 398)} />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 470,
                top: 330 + i * 34,
                width: 30,
                height: 4,
                borderRadius: 2,
                background: P.danger,
                opacity: gapOp * 0.7,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: 470,
              top: 430,
              fontSize: 16,
              fontWeight: 700,
              color: P.danger,
              opacity: gapOp,
              fontFamily,
            }}
          >
            no conveyor between steps
          </div>
          <CaptionBand text="A factory line with no conveyor" tone="danger" opacity={seg(frame, 500, 516)} y={598} />
        </Group>

        {/* ════ THE PILE — spawns in b1, grows through b2/b3, collapses at the b3→b4 seam ════ */}
        {(() => {
          return PILE_CARDS.map((c, i) => {
            const p = pop(c.spawn);
            if (p <= 0.004) return null;
            const cx = PILE_X + jitter(i * 3.1 + 1, 18);
            const cy = PILE_BASE_Y - i * 11 + wobble * (i / PILE_CARDS.length);
            const rot = jitter(i * 7.7 + 2, 9) + wobble * 0.4;
            const flyDy = (1 - Math.min(1, p)) * 150;

            const cs = COLLAPSE_START + i * COLLAPSE_STAGGER;
            const ce = cs + COLLAPSE_DUR;
            const t = seg(frame, cs, ce, Easing.in(Easing.cubic));

            const x = cx + (HERO_CX - cx) * t;
            const y = cy + flyDy + (HERO_CY - (cy + flyDy)) * t;
            const scale = Math.max(0, Math.min(1.06, p)) * (1 - t);
            const opacity = Math.max(0, Math.min(1, p)) * (1 - t);

            const w = c.big ? 152 : 96;
            const h = c.big ? 92 : 62;
            const fontSize = c.big ? 14 : 12;

            return (
              <Card
                key={c.spawn}
                x={x}
                y={y}
                w={w}
                h={h}
                rotate={rot * (1 - t)}
                scale={scale}
                opacity={opacity}
                tone="danger"
                emoji={c.emoji}
                title={c.title}
                fontSize={fontSize}
              />
            );
          });
        })()}

        {/* ════ Big tap counter — rides alongside the pile through b1-b3 ════ */}
        <div
          style={{
            position: "absolute",
            left: 470,
            top: 150,
            fontSize: 118,
            fontWeight: 800,
            letterSpacing: -4,
            color: P.danger,
            opacity: Math.min(1, numberPop) * Math.max(b1, b2, b3),
            fontFamily,
          }}
        >
          {tapCount}
        </div>
        <div
          style={{
            position: "absolute",
            left: 474,
            top: 268,
            fontSize: 22,
            fontWeight: 650,
            color: P.muted,
            opacity: counterOp * Math.max(b1, b2, b3),
            fontFamily,
          }}
        >
          manual taps, most days
        </div>

        {/* ════ Beat 4 — SOLUTION: hero card + conveyor ════ */}
        <Group opacity={b4}>
          <Headline text="One function" accentText="became the conveyor." accentColor={P.success} opacity={seg(frame, 566, 580)} />
          <Card
            x={HERO_CX}
            y={HERO_CY}
            w={260}
            h={178}
            scale={Math.min(1.06, heroPop)}
            opacity={Math.min(1, heroPop)}
            tone="success"
            emoji="⚡"
            title="auto-publish-news"
            sub="runs the whole chain"
            fontSize={19}
          />
          <div
            style={{
              position: "absolute",
              left: HERO_CX - 130,
              top: HERO_CY + 96,
              width: 260,
              textAlign: "center",
              fontSize: 15,
              fontWeight: 650,
              color: P.success,
              opacity: heroLabelOp,
              fontFamily,
            }}
          >
            one Supabase Edge Function
          </div>

          <FlowArrow x={HERO_CX + 130} y={HERO_CY - 3} len={90} progress={arrowsOp(0)} color={P.success} />
          {CONVEYOR.map((c, i) => {
            const p = pop(CONVEYOR_SPAWN[i]);
            if (p <= 0.004) return null;
            return (
              <Card
                key={c.title}
                x={c.x}
                y={HERO_CY}
                w={158}
                h={104}
                scale={Math.min(1.06, p)}
                opacity={Math.min(1, p)}
                tone="accent"
                emoji={c.emoji}
                title={c.title}
                fontSize={16}
              />
            );
          })}
          {[1, 2, 3].map((i) => (
            <FlowArrow key={i} x={CONVEYOR[i - 1].x + 79} y={HERO_CY - 3} len={92} progress={arrowsOp(i)} color={P.success} />
          ))}

          {/* "stops only to ask when something looks wrong" — a quick review flag on Publish */}
          <div
            style={{
              position: "absolute",
              left: CONVEYOR[2].x + 46,
              top: HERO_CY - 66,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: P.card,
              border: `2.5px solid ${P.amber}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              opacity: questionOp,
              boxShadow: cardShadow,
              fontFamily,
            }}
          >
            ?
          </div>
          <div style={{ position: "absolute", left: CONVEYOR[2].x + 46, top: HERO_CY - 66, opacity: resolveOp }}>
            <CheckBadge x={0} y={0} size={40} scale={Math.min(1, resolveOp * 2)} opacity={Math.min(1, resolveOp)} />
          </div>

          <CaptionBand text="auto-publish-news runs the whole chain inside one Supabase Edge Function" tone="accent" opacity={techCapOp} y={598} />
        </Group>

        {/* ════ Beat 5 — RESULT, fan-opens and holds through the tail ════ */}
        <Group opacity={b5}>
          <Headline text="The payoff" accentColor={P.success} opacity={seg(frame, BEATS.b5[0] + 4, BEATS.b5[0] + 18)} />
          <Panel x={150} y={190} w={430} h={210} tone="danger" opacity={Math.min(1, beforePop)}>
            <div
              style={{
                padding: "26px 30px",
                transform: `rotate(${(1 - Math.min(1, beforePop)) * -16}deg)`,
                transformOrigin: "bottom right",
                fontFamily,
              }}
            >
              <div style={{ fontSize: 19, fontWeight: 700, color: P.danger, letterSpacing: 1 }}>BEFORE</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: P.ink, marginTop: 14 }}>15 minutes</div>
              <div style={{ fontSize: 24, fontWeight: 650, color: P.muted, marginTop: 6 }}>per article, fully manual</div>
            </div>
          </Panel>
          <FlowArrow x={598} y={288} len={130} progress={arrRes} color={P.success} />
          <Panel x={700} y={190} w={430} h={210} tone="success" opacity={Math.min(1, afterPop)}>
            <div
              style={{
                padding: "26px 30px",
                transform: `rotate(${(1 - Math.min(1, afterPop)) * 16}deg) scale(${0.9 + 0.1 * Math.min(1, afterPop)})`,
                transformOrigin: "bottom left",
                fontFamily,
              }}
            >
              <div style={{ fontSize: 19, fontWeight: 700, color: P.success, letterSpacing: 1 }}>NOW</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: P.ink, marginTop: 14 }}>2 minutes</div>
              <div style={{ fontSize: 24, fontWeight: 650, color: P.muted, marginTop: 6 }}>per article, automatic</div>
            </div>
          </Panel>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 448,
              width: 1280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              opacity: resultCapOp,
              fontFamily,
            }}
          >
            <div style={{ position: "relative", width: 54, height: 54, transform: `scale(${Math.min(1, zeroPop)})` }}>
              <CheckBadge x={0} y={0} size={54} scale={Math.min(1, check)} opacity={Math.min(1, check)} />
            </div>
            <span style={{ fontSize: 54, fontWeight: 800, color: P.success }}>0 taps</span>
          </div>
          <div style={{ position: "absolute", left: 0, top: 560, width: 1280, textAlign: "center", opacity: resultCapOp, fontFamily }}>
            <div style={{ fontSize: 22, fontWeight: 650, color: P.muted }}>
              The article moves itself — review only when something looks wrong.
            </div>
          </div>
        </Group>
      </PaletteProvider>
    </div>
  );
};
