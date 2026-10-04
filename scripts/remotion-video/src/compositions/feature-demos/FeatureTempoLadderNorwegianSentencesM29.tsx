/**
 * FeatureTempoLadderNorwegianSentencesM29 — feature m29 — 1280x720, 1000 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 0 split-duel, mood sand (handed down, not re-drawn).
 *
 * The frame is permanently split by a moving vertical divider: CHAOS lives
 * on the left (one fixed tempo, everyone stuck with it), ORDER lives on the
 * right (the new tempo ladder). Both halves are alive at every moment — the
 * divider does not cut at a beat boundary, it slides continuously, chaos
 * shrinking frame by frame as order eats into it, until order owns almost
 * the whole screen by the close. There is no centered headline: each half
 * carries its own label, anchored inside that half.
 *
 * Beat 2 ends on a small LiveWindow recording of the feature's own real,
 * published page (shots/m29.json, "page" shot) sitting inside the still-wide
 * chaos half — proof this shipped, before the ladder appears. Beat 5 does
 * NOT play that page again or the hub (gate 2): it closes on a LogWindow
 * built only from the real numbers already in the brief.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1   15-186  "Every sentence played at the same fixed speed — too fast
 *               to catch, or too slow to bear."
 *  b2  195-361  "Advanced learners sat through needless repeats; beginners
 *               never caught the fast phrase."
 *  b3  370-556  "So playback became a ladder: slow, then normal, then fast,
 *               all in one pass."
 *  b4  565-757  "A Python script now builds that ladder, giving grammar a
 *               real time budget instead of a flat guess."
 *  b5  766-955  "Now the learner hears slow, normal and fast in one pass —
 *               three speeds where there used to be one." — holds to 1000,
 *               no fade-out.
 *
 * Single tech name in the whole clip: Python (one FilterChip, beat 4 only).
 * All numbers (0.75x/1.0x/1.2x, 300ms, 10 words/batch, 650ms, 350s to 600s)
 * come straight from the feature's own description — nothing here is an
 * invented statistic.
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import { LightBg, StatPill, FilterChip, CaptionBand, BrowserWindow, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/m29.json";

const P = MOODS.sand;

const B1_S = 15, B1_E = 186;
const B2_S = 195, B2_E = 361;
const B3_S = 370, B3_E = 556;
const B4_S = 565, B4_E = 757;
const B5_S = 766, B5_E = 955;
const FADE = 9;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const WIN_LOG: Win = { x: 110, y: 120, w: 760, h: 440 };

const LOG_LINES: LogLine[] = [
  { t: "before", text: "fixed tempo: 1.0x only, every sentence & grammar line", tone: "danger" },
  { t: "ladder", text: "ladder_seconds(): 0.75x -> 1.0x -> 1.2x, one pass", tone: "accent" },
  { t: "words", text: "word drills: own slower tempo, 300ms gap, 10 words/batch cap", tone: "ink" },
  { t: "sentences", text: "full sentences: 650ms gap between repeats", tone: "ink" },
  { t: "grammar", text: "GRAMMAR_SEC_LADDER: 350s -> 600s budget", tone: "success" },
  { t: "ui", text: "dashboard dropdown \"Сходинка темпу\": all / grammar / off", tone: "accent" },
];

/** A label that lives INSIDE a half (no centered headline for this archetype). */
const HalfLabel: React.FC<{ side: "left" | "right"; text: string; tone: "danger" | "success" | "accent"; opacity: number }> = ({
  side,
  text,
  tone,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : tone === "success" ? P.success : P.accent;
  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        [side === "left" ? "left" : "right"]: 40,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 1.6,
        color,
        textTransform: "uppercase",
        opacity,
        fontFamily,
        textAlign: side === "left" ? "left" : "right",
        maxWidth: 420,
      }}
    >
      {text}
    </div>
  );
};

/** Big number anchored inside the chaos half, top-left. */
const ChaosHero: React.FC<{ value: string; label: string; opacity: number }> = ({ value, label, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 40, top: 110, opacity, fontFamily }}>
      <div style={{ fontSize: 118, fontWeight: 800, letterSpacing: -4, color: P.danger, lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2, color: P.muted }}>{label}</div>
    </div>
  );
};

/** Big number anchored inside the order half, top-right. */
const OrderHero: React.FC<{ value: string; label: string; opacity: number }> = ({ value, label, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", right: 40, top: 110, opacity, fontFamily, textAlign: "right" }}>
      <div style={{ fontSize: 118, fontWeight: 800, letterSpacing: -4, color: P.success, lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2, color: P.muted }}>{label}</div>
    </div>
  );
};

/** Tiled background texture of a repeating tag — the "it's the same, over and over" wallpaper. */
const ChaosWallpaper: React.FC<{ tagA: string; tagB?: string; opacity: number }> = ({ tagA, tagB, opacity }) => {
  if (opacity <= 0.004) return null;
  const cols = 8;
  const rows = 6;
  return (
    <>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const tag = tagB && (r + c) % 2 === 1 ? tagB : tagA;
          return (
            <div
              key={`w-${r}-${c}`}
              style={{
                position: "absolute",
                left: 24 + c * 150,
                top: 20 + r * 118,
                fontSize: 26,
                fontWeight: 800,
                color: P.danger,
                opacity: opacity * 0.14,
                fontFamily,
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </div>
          );
        })
      )}
    </>
  );
};

/** One rung of the tempo ladder (right-anchored, stable while the panel grows). */
const Rung: React.FC<{ i: number; tempo: string; word: string; lit: number; opacity: number }> = ({
  i,
  tempo,
  word,
  lit,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 60,
        top: 70 + i * 108,
        width: 380,
        height: 82,
        borderRadius: 18,
        background: lit > 0.4 ? P.successBg : P.card,
        border: `2px solid ${lit > 0.4 ? P.success : P.border}`,
        boxShadow: cardShadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
        opacity,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color: lit > 0.4 ? P.success : P.ink, fontVariantNumeric: "tabular-nums" }}>{tempo}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: P.muted, textAlign: "right" }}>{word}</div>
    </div>
  );
};

export const FeatureTempoLadderNorwegianSentencesM29: React.FC = () => {
  const frame = useCurrentFrame();

  const full = seg(frame, 0, 15);

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through 1000 — no fade-out

  // The divider: chaos (left) shrinks, order (right) grows, continuously.
  const dividerX = interpolate(
    frame,
    [0, B1_E, B2_S, B2_E, B3_S, B3_E, B4_S, B4_E, B5_S, B5_E, 1000],
    [1060, 1060, 1040, 980, 980, 460, 460, 200, 200, 70, 70],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const orderW = 1280 - dividerX;

  // Beat 2: proof-of-shipped inset (LiveWindow), tucked into the still-wide chaos half.
  const liveFrom = 258;
  const liveWin: Win = { x: 560, y: 356, w: 400, h: 300 };
  const liveZoom = (t: number) => 1 + 0.08 * easeInOut(t);

  // Beat 4: ladder rungs light up one by one, and the grammar budget bar grows.
  const litRung = (i: number) => seg(frame, B3_S + 40 + i * 50, B3_S + 56 + i * 50);
  const budgetGrow = interpolate(frame, [B4_S + 20, B4_S + 140], [350, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ladderOpacity = Math.max(b3, b4);

  // Beat 5: the LogWindow slides up — the clip's non-crossfade transition.
  const logSlide = interpolate(frame, [B5_S, B5_S + 20], [46, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= CHAOS — left half, shrinking ================= */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: dividerX,
            height: 720,
            overflow: "hidden",
            background: P.dangerBg,
            opacity: full,
          }}
        >
          <ChaosWallpaper tagA="1.0x" opacity={b1} />
          <ChaosWallpaper tagA="🎓" tagB="🌱" opacity={b2} />

          <div style={{ position: "absolute", left: 40, top: 30, width: 460, fontSize: 18, fontWeight: 700, color: P.ink, opacity: b1, lineHeight: 1.35 }}>
            🎧 Mini Elvarika — Norwegian by Ear: type a word, Claude writes
            A1-C1 scenes, edge-tts voices them.
          </div>

          <HalfLabel side="left" text="One Fixed Speed For Everyone" tone="danger" opacity={b1} />
          <HalfLabel side="left" text="Still One Speed, For Every Learner" tone="danger" opacity={b2} />

          <ChaosHero value="1.0x" label="ONLY TEMPO, EVERY TIME" opacity={Math.max(b1, b2)} />

          <StatPill x={40} y={300} emoji="😩" text="too slow to bear" tone="danger" opacity={b1} />
          <StatPill x={40} y={356} emoji="😣" text="too fast to catch" tone="danger" opacity={b1} />

          <StatPill x={40} y={300} emoji="🎓" text="advanced: needless repeats" tone="danger" opacity={b2} />
          <StatPill x={40} y={356} emoji="🌱" text="beginner: missed the phrase" tone="danger" opacity={b2} />

          <div
            style={{
              transform: `scale(${interpolate(frame, [liveFrom, liveFrom + 18], [0.93, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              transformOrigin: `${liveWin.x + liveWin.w / 2}px ${liveWin.y + liveWin.h / 2}px`,
            }}
          >
            <LiveWindow
              file={shots as any}
              shot="page"
              title="vitalii.no/features/…-m29"
              win={liveWin}
              from={liveFrom}
              hold={102}
              zoom={liveZoom}
              focus={{ x: 0.5, y: 0.35 }}
              opacity={b2}
            />
          </div>
        </div>

        {/* ================= ORDER — right half, growing ================= */}
        <div
          style={{
            position: "absolute",
            left: dividerX,
            top: 0,
            width: orderW,
            height: 720,
            overflow: "hidden",
            background: P.successBg,
            opacity: full,
          }}
        >
          <HalfLabel side="right" text="A Tempo Ladder: Slow · Normal · Fast" tone="accent" opacity={b3} />
          <HalfLabel side="right" text="A Python Script Builds The Ladder" tone="success" opacity={b4} />
          <HalfLabel side="right" text="Three Speeds, One Pass" tone="success" opacity={b5} />

          <OrderHero value="3" label="SPEEDS IN ONE PASS" opacity={b3} />
          <OrderHero value="600" label="SEC GRAMMAR BUDGET" opacity={b4} />

          <Rung i={0} tempo="0.75x" word="slow" lit={litRung(0)} opacity={ladderOpacity} />
          <Rung i={1} tempo="1.0x" word="normal" lit={litRung(1)} opacity={ladderOpacity} />
          <Rung i={2} tempo="1.2x" word="fast" lit={litRung(2)} opacity={ladderOpacity} />

          {/* beat 4: grammar budget bar growing from the real 350s baseline to 600s */}
          <div style={{ position: "absolute", right: 60, top: 420, width: 380, opacity: b4, fontFamily }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: P.muted, marginBottom: 8 }}>
              GRAMMAR TIME BUDGET: {Math.round(budgetGrow)}s (was 350s)
            </div>
            <div style={{ width: 380, height: 20, borderRadius: 10, background: P.chipBg, border: `1.5px solid ${P.border}`, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${(budgetGrow / 600) * 100}%`,
                  background: P.success,
                  borderRadius: 10,
                }}
              />
            </div>
          </div>

          <FilterChip x={Math.max(10, orderW - 430)} y={490} text="Python" icon="🐍" color={P.accent} opacity={b4} />

          {/* beat 5: the result — LogWindow only, never the feature page or hub (gate 2) */}
          <div
            style={{
              position: "absolute",
              left: Math.max(20, orderW - WIN_LOG.w - 60),
              top: 0,
              transform: `translateY(${logSlide}px)`,
            }}
          >
            <LogWindow lines={LOG_LINES} title="runner.py — tempo ladder" from={B5_S + 10} every={28} opacity={b5} win={WIN_LOG} fontSize={20} />
          </div>
        </div>

        {/* ================= divider ================= */}
        <div
          style={{
            position: "absolute",
            left: dividerX - 3,
            top: 0,
            width: 6,
            height: 720,
            background: P.ink,
            boxShadow: "0 0 18px rgba(0,0,0,0.25)",
            opacity: full,
          }}
        />

        {/* ================= captions ================= */}
        <CaptionBand text="One fixed speed — too fast to catch, or too slow to bear." opacity={b1} tone="danger" />
        <CaptionBand text="Advanced learners wait through repeats; beginners miss the fast phrase." opacity={b2} tone="danger" />
        <CaptionBand text="Playback becomes a ladder: slow, then normal, then fast." opacity={b3} tone="accent" />
        <CaptionBand text="A Python script builds the ladder — grammar gets a real time budget." opacity={b4} tone="success" />
        <CaptionBand text="Slow, normal, fast, one pass — three speeds where there used to be one." opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
