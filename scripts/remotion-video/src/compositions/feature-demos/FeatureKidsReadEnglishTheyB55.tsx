/**
 * FeatureKidsReadEnglishTheyB55 — feature b55 — 1280x720, 1003 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 4 "flow map" / mood "violet" (pre-assigned, see out/lux-archetypes.md — not
 * redrawn here). The frame is one route diagram: a WORD (source) -> a DICTIONARY node
 * (the sayOf() lookup, decision) -> a three-way fork into ANSWER, CHOICES and HISTORY —
 * the three places the respelling now shows up. Before the fix the word has no route at
 * all (a dead stub ending in IPA + a crossed-out mark); at beat 3 the real route to the
 * dictionary lights up and the word gets a plain respelling; at beat 4 three tokens travel
 * out to the three destinations. The CHOICES node grows into a live recording of the
 * feature's own vitalii.no page at beat 5 — a non-crossfade morph transition.
 *
 * Beats (voice-synced, do not shift):
 *  b1  15-150  "My kids read English words on their study wall, but they've never heard
 *               them spoken." — the WORD node ("suddenly") appears, muted, no route out.
 *  b2 159-360  "A word like suddenly was just letters — no clue how to say it, and IPA
 *               means nothing to a first-grader." — IPA /ˈsʌdənli/ shown crossed out next
 *               to a confused child; still no route out of the WORD node.
 *  b3 369-589  "So I built a plain respelling dictionary — Norwegian letters instead of
 *               phonetic symbols. Suddenly becomes SAD-en-li." — the real route WORD ->
 *               DICTIONARY lights up; the respelling "SAD-en-li" replaces the IPA. The one
 *               tech caption appears here and stays.
 *  b4 598-797  "It shows up under every vocabulary answer, beside each choice before they
 *               pick, and in their review history." — three tokens travel from DICTIONARY
 *               out to ANSWER, CHOICES and HISTORY, each lighting up in turn.
 *  b5 806-958  "2,588 words. Every one of them now sounds like something." — the CHOICES
 *               node grows into a LiveWindow of the feature's own page; the real word count
 *               becomes the hero number. Holds to 1003, no fade-out.
 *
 * Single tech-credibility caption: "en-say.json · sayOf()" (beat 3 onward).
 * Emoji all single-codepoint (🔤📖📝🔘📜🔇🧒❓✅✕), no ZWJ.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LightBg, Group, FilterChip, StatPill, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shotsFile from "./shots/b55.json";

const B1_S = 15, B1_E = 150;
const B2_S = 159, B2_E = 360;
const B3_S = 369, B3_E = 589;
const B4_S = 598, B4_E = 797;
const B5_S = 806, B5_E = 958;
const END = 1003;
const FADE = 9;

type Vec = { x: number; y: number };
const NODE_A: Vec = { x: 170, y: 220 }; // WORD
const NODE_B: Vec = { x: 620, y: 420 }; // DICTIONARY
const NODE_C1: Vec = { x: 1030, y: 170 }; // ANSWER
const NODE_C2: Vec = { x: 1090, y: 420 }; // CHOICES (morphs into LiveWindow)
const NODE_C3: Vec = { x: 1030, y: 610 }; // HISTORY

const WIN5: Win = { x: 560, y: 150, w: 600, h: 420 };

const lerp = (a: Vec, b: Vec, t: number): Vec => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

const BeatLabel: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => {
  const B = usePalette();
  return (
    <div style={{ position: "absolute", left: 70, top: 26, width: 640, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: B.accent, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontSize: 27, fontWeight: 750, color: B.ink, marginTop: 6, lineHeight: 1.25 }}>{title}</div>
    </div>
  );
};

const Node: React.FC<{ pos: Vec; r: number; emoji: string; label: string; tone: string; opacity?: number }> = ({
  pos,
  r,
  emoji,
  label,
  tone,
  opacity = 1,
}) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: pos.x - r, top: pos.y - r, width: r * 2, opacity, fontFamily }}>
      <div
        style={{
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          background: B.card,
          border: `2.5px solid ${tone}`,
          boxShadow: "0 10px 24px rgba(22,35,63,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: r * 0.8,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          marginTop: 8,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 0.5,
          color: B.ink,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Route: React.FC<{ a: Vec; b: Vec; color: string; opacity: number; dashed?: boolean }> = ({
  a,
  b,
  color,
  opacity,
  dashed,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
      strokeDasharray={dashed ? "3 14" : undefined}
      opacity={opacity}
    />
  );
};

const Token: React.FC<{ pos: Vec; emoji: string; opacity: number }> = ({ pos, emoji, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x - 20,
        top: pos.y - 20,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 6px 16px rgba(22,35,63,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        opacity,
      }}
    >
      {emoji}
    </div>
  );
};

export const FeatureKidsReadEnglishTheyB55: React.FC = () => {
  const frame = useCurrentFrame();
  const B = MOODS.violet;

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE);

  // permanent: the real route from WORD to DICTIONARY lights up and stays
  const fixedT = seg(frame, B3_S, B3_S + 18);

  // beat 4: three tokens leave DICTIONARY for the three destinations, staggered
  const leg1 = interpolate(frame, [B4_S + 15, B4_S + 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const leg2 = interpolate(frame, [B4_S + 45, B4_S + 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const leg3 = interpolate(frame, [B4_S + 75, B4_S + 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const arrived1 = seg(frame, B4_S + 80, B4_S + 90);
  const arrived2 = seg(frame, B4_S + 110, B4_S + 120);
  const arrived3 = seg(frame, B4_S + 140, B4_S + 150);

  // beat 4 -> 5: the CHOICES node morphs into a full browser window (non-crossfade)
  const growT = interpolate(frame, [B5_S, B5_S + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const c2R = 56;
  const morphX = interpolate(growT, [0, 1], [NODE_C2.x - c2R, WIN5.x]);
  const morphY = interpolate(growT, [0, 1], [NODE_C2.y - c2R, WIN5.y]);
  const morphW = interpolate(growT, [0, 1], [c2R * 2, WIN5.w]);
  const morphH = interpolate(growT, [0, 1], [c2R * 2, WIN5.h]);
  const c2NodeVisible = 1 - growT;

  const captionOpacity = seg(frame, B3_S + 10, B3_S + 10 + FADE);

  const wordCount = Math.floor(
    interpolate(frame, [B5_S + 10, B5_S + 80], [0, 2588], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

  return (
    <PaletteProvider value={MOODS.violet}>
      <LightBg />

      {/* ---------------- persistent flow map (all beats) ---------------- */}
      <svg style={{ position: "absolute", inset: 0, width: 1280, height: 720 }}>
        <Route a={NODE_A} b={NODE_B} color={B.accent} opacity={fixedT} />
        <Route a={NODE_B} b={NODE_C1} color={B.success} opacity={Math.min(1, leg1 * 1.4) * fixedT} />
        <Route a={NODE_B} b={NODE_C2} color={B.success} opacity={Math.min(1, leg2 * 1.4) * fixedT} />
        <Route a={NODE_B} b={NODE_C3} color={B.success} opacity={Math.min(1, leg3 * 1.4) * fixedT} />
      </svg>

      <Node pos={NODE_A} r={58} emoji="🔤" label="SUDDENLY" tone={B.accent} />
      <Node pos={NODE_B} r={64} emoji="📖" label="DICTIONARY" tone={B.accent} opacity={fixedT} />
      <Node
        pos={NODE_C1}
        r={46}
        emoji="📝"
        label={arrived1 > 0.5 ? "✅ ANSWER" : "ANSWER"}
        tone={arrived1 > 0.5 ? B.success : B.border}
        opacity={fixedT}
      />
      {c2NodeVisible > 0.02 ? (
        <Node
          pos={NODE_C2}
          r={c2R}
          emoji="🔘"
          label={arrived2 > 0.5 ? "✅ CHOICES" : "CHOICES"}
          tone={arrived2 > 0.5 ? B.success : B.border}
          opacity={fixedT * c2NodeVisible}
        />
      ) : null}
      <Node
        pos={NODE_C3}
        r={46}
        emoji="📜"
        label={arrived3 > 0.5 ? "✅ HISTORY" : "HISTORY"}
        tone={arrived3 > 0.5 ? B.success : B.border}
        opacity={fixedT}
      />

      {/* beat 4 travelling tokens */}
      {leg1 > 0.02 && leg1 < 1 ? <Token pos={lerp(NODE_B, NODE_C1, leg1)} emoji="🔊" opacity={b4} /> : null}
      {leg2 > 0.02 && leg2 < 1 ? <Token pos={lerp(NODE_B, NODE_C2, leg2)} emoji="🔊" opacity={b4} /> : null}
      {leg3 > 0.02 && leg3 < 1 ? <Token pos={lerp(NODE_B, NODE_C3, leg3)} emoji="🔊" opacity={b4} /> : null}

      {/* single tech-credibility caption — appears with the fix, stays to the end */}
      <FilterChip x={70} y={630} icon="📖" text="en-say.json · sayOf()" color={B.accent} opacity={captionOpacity} />

      {/* ---------------- beat 1 : words with no sound ---------------- */}
      <Group opacity={b1}>
        <BeatLabel kicker="SILENT WORDS" title="My kids read English words but never hear them spoken" />
        <StatPill x={70} y={330} emoji="🔇" text="suddenly — no sound" tone="accent" />
      </Group>

      {/* ---------------- beat 2 : IPA means nothing to a first-grader ---------------- */}
      <Group opacity={b2}>
        <BeatLabel kicker="THE GAP" title="IPA means nothing to a first-grader" />
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 320,
            fontFamily,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 800, color: B.danger, textDecoration: "line-through" }}>
            /ˈsʌdənli/ ✕
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: B.ink, marginTop: 14 }}>🧒 ❓</div>
        </div>
      </Group>

      {/* ---------------- beat 3 : a plain respelling dictionary ---------------- */}
      <Group opacity={b3}>
        <BeatLabel kicker="THE FIX" title="Norwegian letters, not phonetic symbols" />
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 320,
            fontFamily,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: B.muted }}>suddenly →</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: B.accent, marginTop: 6 }}>SAD-en-li</div>
        </div>
      </Group>

      {/* ---------------- beat 4 : everywhere the word shows up ---------------- */}
      <Group opacity={b4}>
        <BeatLabel kicker="EVERYWHERE" title="Under every answer, beside every choice, in their history" />
      </Group>

      {/* ---------------- beat 5 : the real page, holds to the end ---------------- */}
      <Group opacity={b5}>
        <BeatLabel kicker="THE RESULT" title="2,588 words — every one now sounds like something" />
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 330,
            fontFamily,
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 900, color: B.success }}>{wordCount.toLocaleString("en-US")}</div>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1, color: B.muted, marginTop: 4 }}>
            WORDS NOW SOUND LIKE SOMETHING
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: morphX,
            top: morphY,
            width: morphW,
            height: morphH,
            opacity: growT,
          }}
        >
          <LiveWindow
            file={shotsFile}
            shot="page"
            title="vitalii.no/features/…-b55"
            from={B5_S}
            hold={END - B5_S}
            win={{ x: 0, y: 0, w: morphW, h: morphH }}
            opacity={1}
          />
        </div>
      </Group>
    </PaletteProvider>
  );
};
