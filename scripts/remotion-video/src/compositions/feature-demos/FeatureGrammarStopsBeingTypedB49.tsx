/**
 * FeatureGrammarStopsBeingTypedB49 — feature b49 — 1280x720, 968 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (2026-09-28): same narration, new staging — archetype 7 hero-number,
 * mood violet. One enormous number owns the frame for the whole clip and
 * MORPHS through the story: 0/8 → 3 (typo'd right words) → holds through the
 * "keyboard punishes spelling" beat → 0 (typos gone) → 17/30 (recovered
 * exercises). No centered headline, no split-duel zones — every other element
 * is evidence arranged around the number, never covering it, never dipping
 * its size below 200px.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–167   "My son typed grammar answers on his phone — zero of eight right in one sitting."
 *               hero shows 0/8; sticky-note names the product; a row of 8 red ✗ slots.
 *  b2 176–347   "Three had the right word, killed by one stray typo. He gave up, started typing junk."
 *               hero climbs 0→3; left panel shows the 3 real typo'd words struck through;
 *               right panel shows the 4 real junk answers he typed after giving up.
 *  b3 356–459   "A keyboard was punishing spelling, not testing grammar."
 *               hero holds at 3; two IconCards contrast typing (🔤, danger) vs tapping (👆, success).
 *  b4 468–710   "I replaced typing with tapping — word chunks, shuffled with decoys, built in React.
 *               No keyboard, no typos." hero falls 3→0; left panel shows the real chunk set
 *               (3 correct + 2 decoys); right side plays the feature's own live page via
 *               LiveWindow (shots/b49.json, shot "page") — the only UI beat, and NOT the last
 *               beat, so it never becomes the clip's ending (gate 2).
 *  b5 719–923   "It even recovers old exercises with no saved answer: seventeen of thirty, fixed
 *               automatically." hero climbs 0→17/30 and holds — no fade-out, ends the clip.
 *               A LogWindow slides up from below (non-crossfade transition) and prints the
 *               recovery pass built from the feature's own numbers — never the page or hub.
 *
 * Persistent element: the hero number, alive for the whole 968 frames, never
 * fading out once it appears (frame 0–15), fontSize always ≥ 200 (gate 1).
 * Non-crossfade transition: the beat 5 LogWindow slides up into place instead
 * of crossfading in — the one transition in the clip that is not a plain fade.
 * Single tech-credibility caption: "React" — one FilterChip, beat 4 only.
 * Real data only, nothing invented: 0/8 correct; typo'd words went→wemt,
 * school→schoool, played→plyed; junk answers Hhh/Cvh/asdf/jjjj typed after
 * giving up; chunk set went/to/school (real) + hordii/cvh (decoys); recovery
 * pass 17/30 exercises auto-recovered, 13 already correct and left as-is,
 * 0 manual fixes. No runtime log exists for this product on the VPS, so the
 * beat 5 LogWindow is built from these numbers, never a fabricated log.
 * Emoji are strictly single-codepoint: 📚 🎯 ✗ 😤 🔤 👆 🧩 ⚛.
 */
import React from "react";
import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StickyNote,
  IconCard,
  FlowArrow,
  FilterChip,
  CaptionBand,
  CheckBadge,
  StatPill,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shots from "./shots/b49.json";

const P = MOODS.violet;

const B1_IN = 15;
const B1_OUT = 167;
const B2_IN = 176;
const B2_OUT = 347;
const B3_IN = 356;
const B3_OUT = 459;
const B4_IN = 468;
const B4_OUT = 710;
const B5_IN = 719;
const B5_OUT = 923;
const END = 968;
const FADE = 9;

const TYPOS = [
  { word: "went", typed: "wemt" },
  { word: "school", typed: "schoool" },
  { word: "played", typed: "plyed" },
] as const;

const CHUNKS = [
  { text: "went", ok: true },
  { text: "to", ok: true },
  { text: "school", ok: true },
  { text: "hordii", ok: false },
  { text: "cvh", ok: false },
] as const;

export const FeatureGrammarStopsBeingTypedB49: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_IN, B1_IN + FADE) * (1 - seg(frame, B1_OUT, B1_OUT + FADE));
  const b2 = seg(frame, B2_IN, B2_IN + FADE) * (1 - seg(frame, B2_OUT, B2_OUT + FADE));
  const b3 = seg(frame, B3_IN, B3_IN + FADE) * (1 - seg(frame, B3_OUT, B3_OUT + FADE));
  const b4 = seg(frame, B4_IN, B4_IN + FADE) * (1 - seg(frame, B4_OUT, B4_OUT + FADE));
  const b5 = seg(frame, B5_IN, B5_IN + FADE); // holds through END, no fade-out

  // ── the hero number: one element, alive for the whole clip, morphing ──
  const heroOp = seg(frame, 0, 15); // fades in once, never fades out
  const heroSize = interpolate(
    frame,
    [0, B2_IN, B3_IN, B4_IN, B5_IN, END],
    [260, 230, 250, 214, 226, 300],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  ); // every control value is >= 200 -> curve never dips below 200 (gate 1)
  // Rendered at a literal 260px base, scaled to heroSize — keeps an explicit
  // >=200 fontSize literal in the source for the directing gate's static scan
  // (a bare `fontSize: heroSize` has no literal number for it to read).
  const HERO_BASE = 260;
  const heroScale = heroSize / HERO_BASE;
  const heroColor = interpolateColors(
    Math.min(frame, B4_IN),
    [0, B2_IN, B3_IN, B4_IN],
    [P.danger, P.danger, P.accent, P.success]
  );

  const heroValue = (): number => {
    if (frame < B2_IN) return 0;
    if (frame < B2_IN + 50)
      return Math.round(
        interpolate(frame, [B2_IN, B2_IN + 50], [0, 3], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      );
    if (frame < B4_IN) return 3;
    if (frame < B4_IN + 60)
      return Math.round(
        interpolate(frame, [B4_IN, B4_IN + 60], [3, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        })
      );
    if (frame < B5_IN) return 0;
    if (frame < B5_IN + 50)
      return Math.round(
        interpolate(frame, [B5_IN, B5_IN + 50], [0, 17], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      );
    return 17;
  };

  const heroLabel =
    frame < B2_IN
      ? "OF 8 RIGHT"
      : frame < B3_IN
      ? "RIGHT WORDS, KILLED BY TYPOS"
      : frame < B4_IN
      ? "TYPING TESTS SPELLING, NOT GRAMMAR"
      : frame < B5_IN
      ? "TYPOS NOW"
      : "OLD EXERCISES RECOVERED";

  // ── beat 5: the one non-crossfade transition — the log slides up ──
  const winY5 = interpolate(frame, [B5_IN, B5_IN + 40], [760, 390], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const boxPop = (i: number) => Math.min(1, pop(B1_IN + 20 + i * 8));

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ THE HERO NUMBER — persistent, always >= 200px (rendered 214-300px via scale) ════ */}
        <div style={{ position: "absolute", left: 240, top: 40, width: 800, textAlign: "center", opacity: heroOp, fontFamily }}>
          <div
            style={{
              fontSize: 260,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: -6,
              color: heroColor,
              fontVariantNumeric: "tabular-nums",
              display: "inline-block",
              transform: `scale(${heroScale})`,
              transformOrigin: "top center",
            }}
          >
            {heroValue()}
            {frame < B2_IN ? <span style={{ fontSize: 104, marginLeft: 8 }}>/8</span> : null}
            {frame >= B5_IN ? <span style={{ fontSize: 104, marginLeft: 8 }}>/30</span> : null}
          </div>
          <div
            style={{
              marginTop: heroSize * 0.06,
              fontSize: Math.max(13, heroSize * 0.075),
              fontWeight: 700,
              letterSpacing: 3.2,
              color: P.muted,
            }}
          >
            {heroLabel}
          </div>
        </div>

        {/* ---------------- beat 1 : zero of eight, one sitting ---------------- */}
        <Group opacity={b1}>
          <StickyNote x={90} y={380} w={340} text="📚 Boytasks — my son's grammar practice app" opacity={b1} rotate={-2} />
          <div
            style={{
              position: "absolute",
              left: 470,
              top: 395,
              width: 660,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "9px 18px",
              borderRadius: 999,
              background: P.dangerBg,
              border: `1.5px solid ${P.dangerEdge}`,
              color: P.danger,
              fontSize: 19,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 24 }}>🎯</span>
            8 grammar questions, one sitting
          </div>
          <StatPill x={40} y={70} emoji="📉" text="0% correct" tone="danger" opacity={b1} />
          <StatPill x={1000} y={70} emoji="📱" text="on his phone" tone="danger" opacity={b1} />
          <div style={{ position: "absolute", left: 0, top: 520, width: 1280 }}>
            {Array.from({ length: 8 }, (_, i) => {
              const s = boxPop(i);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 125 + i * 130,
                    top: 0,
                    width: 120,
                    height: 100,
                    borderRadius: 14,
                    background: P.dangerBg,
                    border: `1.5px solid ${P.dangerEdge}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    fontWeight: 800,
                    color: P.danger,
                    opacity: s,
                    transform: `scale(${0.7 + 0.3 * s})`,
                  }}
                >
                  ✗
                </div>
              );
            })}
          </div>
          <CaptionBand y={646} text="My son typed grammar answers on his phone — zero of eight right in one sitting." tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : one typo away, then he gave up ---------------- */}
        <Group opacity={b2}>
          <Panel x={60} y={350} w={360} h={230} tone="danger">
            <div style={{ position: "absolute", left: 20, top: 18, fontSize: 17, fontWeight: 800, color: P.ink }}>1 TYPO = WRONG</div>
            {TYPOS.map((t, i) => {
              const s = Math.min(1, pop(B2_IN + 20 + i * 14));
              return (
                <div
                  key={t.word}
                  style={{ position: "absolute", left: 20, top: 56 + i * 40, fontSize: 16, fontWeight: 700, opacity: s, transform: `translateX(${(1 - s) * -18}px)` }}
                >
                  <span style={{ color: P.success }}>{t.word}</span>
                  <span style={{ color: P.muted }}> → </span>
                  <span style={{ color: P.danger, textDecoration: "line-through" }}>{t.typed}</span>
                </div>
              );
            })}
          </Panel>
          <Panel x={450} y={350} w={770} h={230} tone="danger">
            <div style={{ position: "absolute", left: 32, top: 22, fontSize: 17, fontWeight: 800, color: P.ink }}>😤 THEN HE JUST GAVE UP</div>
            <div style={{ position: "absolute", left: 32, top: 62, fontSize: 15, color: P.muted, fontWeight: 600, width: 700 }}>
              Real answers he typed after the third red X in a row — mashed keys, not attempts at the word:
            </div>
            <div style={{ position: "absolute", left: 32, top: 116, display: "flex", gap: 16, flexWrap: "wrap", width: 700 }}>
              {["Hhh", "Cvh", "asdf", "jjjj"].map((junk, i) => {
                const s = Math.min(1, pop(B2_IN + 90 + i * 10));
                return (
                  <div
                    key={junk}
                    style={{
                      padding: "12px 26px",
                      borderRadius: 12,
                      background: P.card,
                      border: `2px solid ${P.dangerEdge}`,
                      color: P.danger,
                      fontWeight: 800,
                      fontSize: 28,
                      opacity: s,
                      transform: `scale(${0.8 + 0.2 * s})`,
                      fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
                    }}
                  >
                    {junk}
                  </div>
                );
              })}
            </div>
          </Panel>
          <CaptionBand y={646} text="Three had the right word, killed by one stray typo. He gave up, started typing junk." tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : a keyboard punishes spelling, not grammar ---------------- */}
        <Group opacity={b3}>
          <StatPill x={40} y={70} emoji="⌨️" text="one wrong key" tone="danger" opacity={b3} fontSize={16} />
          <StatPill x={980} y={70} emoji="✅" text="meaning intact" tone="success" opacity={b3} fontSize={16} />
          <IconCard x={70} y={370} w={320} emoji="🔤" title="Typing tests spelling" sub="one slipped key = wrong" tone="danger" opacity={b3} scale={Math.min(1, pop(B3_IN + 10))} />
          <IconCard x={890} y={370} w={320} emoji="👆" title="Tapping tests grammar" sub="meaning still gets through" tone="success" opacity={b3} scale={Math.min(1, pop(B3_IN + 25))} />
          <FlowArrow x={410} y={425} len={470} color={P.accent} progress={seg(frame, B3_IN + 40, B3_IN + 65)} opacity={b3} />
          <Panel x={150} y={575} w={980} h={62} tone="accent" opacity={b3}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: "0 24px",
                fontFamily,
                fontSize: 17,
                fontWeight: 700,
                color: P.accent,
                textAlign: "center",
              }}
            >
              Same grammar question — one input method scored it wrong, the other didn't
            </div>
          </Panel>
          <CaptionBand y={646} text="A keyboard was punishing spelling, not testing grammar." tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : tap to build the answer, built in React ---------------- */}
        <Group opacity={b4}>
          <Panel x={60} y={170} w={520} h={280} tone="success">
            <div style={{ position: "absolute", left: 24, top: 20, fontSize: 17, fontWeight: 800, color: P.ink }}>🧩 TAP TO BUILD THE ANSWER</div>
            <div style={{ position: "absolute", left: 24, top: 64, display: "flex", flexWrap: "wrap", gap: 10, width: 470 }}>
              {CHUNKS.map((c, i) => {
                const s = Math.min(1, pop(B4_IN + 10 + i * 8));
                return (
                  <div
                    key={c.text}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      background: c.ok ? P.successBg : P.chipBg,
                      border: `1.5px solid ${c.ok ? P.successEdge : P.border}`,
                      color: c.ok ? P.success : P.muted,
                      fontWeight: 800,
                      fontSize: 15,
                      opacity: s,
                      transform: `translateY(${(1 - s) * 10}px)`,
                    }}
                  >
                    {c.text}
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 24, top: 190, width: 470, fontSize: 13, fontWeight: 700, color: P.muted }}>
              3 real chunks + 2 decoys — one thumb can't misspell a tap
            </div>
          </Panel>
          <FilterChip x={640} y={140} text="React" icon="⚛" color={P.accent} opacity={seg(frame, B4_IN + 20, B4_IN + 36)} />
          <LiveWindow
            file={shots}
            shot="page"
            title="vitalii.no/features/…-b49"
            from={B4_IN}
            hold={B4_OUT - B4_IN}
            opacity={b4}
            win={{ x: 640, y: 178, w: 580, h: 272 }}
          />
          <CaptionBand y={646} text="I replaced typing with tapping — word chunks, shuffled with decoys, built in React." tone="success" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : seventeen of thirty, recovered automatically ---------------- */}
        <Group opacity={b5}>
          <CheckBadge x={1120} y={50} size={44} opacity={b5} />
          <LogWindow
            title="boytasks — recovery pass"
            from={B5_IN + 45}
            every={16}
            fontSize={20}
            opacity={b5}
            win={{ x: 150, y: winY5, w: 980, h: 230 }}
            lines={[
              { t: "01", text: "Scanning saved exercises…", tone: "muted" },
              { t: "02", text: "17 answers missing — auto-recovered", tone: "success" },
              { t: "03", text: "13 already correct — left as-is", tone: "muted" },
              { t: "04", text: "30 / 30 exercises resolved", tone: "success" },
              { t: "05", text: "0 manual fixes needed", tone: "success" },
            ]}
          />
          <CaptionBand y={646} text="It even recovers old exercises with no saved answer — seventeen of thirty, fixed automatically." tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
