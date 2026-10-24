// FeatureNorwegianNamesInsideUkrainianG10 — feature g10 — 1280x720, 987 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood slate. Motion direction (feature-motion skill, 2026-10-07).
// RE-SHOOT 2026-10-23: same narration/windows, repainted in slate, product named in b1,
// and the batch-rewrite number from b5 now runs as a real LogWindow ticker.
//
// Split Duel lives in the bottom band: three red "chaos" tags (GUESSED SPELLING /
// WRONG STRESS / LOST MEANING) on the left, one steady green "NORWEGIAN VOICE,
// SPLICED IN" block on the right — the clip's one tech-credibility caption — with
// a divider between them that slides from mostly-chaos to mostly-order across the
// whole clip. Effects own the frame above; the band stays alive throughout via the
// continuous slide + tag jitter, so nothing in it holds a single pose for a beat.
//
// Beat -> effect (data only from the feature row; no runtime log exists for this
// product, so every on-screen fact comes straight from problem_en / solution_en /
// result_en):
// b1 15-266   "forced into Cyrillic... nothing like a Norwegian would say it" —
//             keywordCaption over the feature's own page (backdrop "page"), plus the
//             product plate: Guide — Stories on the Road.
// b2 266-477  "the app already had a real Norwegian voice saying it correctly" —
//             copyCorrection over the features hub (backdrop "hub").
// b3 477-612  "now the AI marks every Norwegian name instead of translating it" —
//             handoffExplain, drawn (the prompt-rule change).
// b4 612-773  "the audio pipeline splices that real recording into the sentence" —
//             pipelineFlow, drawn (invisible plumbing: the splice mechanism).
// b5 773-987  "every story already published too — rewritten in batches of eight" —
//             titleTakeover (verdict), drawn, plus a LogWindow ticking batch 1/8 through
//             8/8 (the product's own number, no runtime log exists so this is built from
//             the feature row), holds to the end on the real number.
//
// Persistent element: the Split Duel lower band (archetype 0), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g10.json";

const B1 = 15;
const B2 = 266;
const B3 = 477;
const B4 = 612;
const B5 = 773;
const END = 987;

/** slate's own cyan reads flat on a dark stage — brightened for the dark background. */
const ACCENT = "#2FC1E8";
const STAGE = "#10161C";

// Lower band geometry (1280x720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const SplitDuel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const bandOpacity = tween(sec(frame, B1, fps), 0, 0.3, ease.power2Out);

  // Divider slides from 80% (mostly chaos) to 22% (mostly order) across the whole clip.
  const slide = tween(sec(frame, B1, fps), 0, (END - B1) / fps, ease.sineInOut);
  const frac = mix(slide, 0.8, 0.22);
  const dividerX = LT.w * frac;

  const t = sec(frame, B1, fps);
  const jitter = (seed: number) => Math.sin(t * 2.4 + seed) * 2.5;
  const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.6));

  const tags = [
    { label: "GUESSED SPELLING", seed: 0 },
    { label: "WRONG STRESS", seed: 2.1 },
    { label: "LOST MEANING", seed: 4.4 },
  ];

  const orderArrive = frame >= B3 ? punchScale(sec(frame, B3, fps), 0) : 0;

  return (
    <div style={{ position: "absolute", left: LT.x, top: LT.y, width: LT.w, height: LT.h, opacity: bandOpacity }}>
      {/* chaos zone */}
      <div style={{ position: "absolute", left: 0, top: 0, width: dividerX, height: LT.h, overflow: "hidden" }}>
        {tags.map((tg, i) => (
          <div
            key={tg.label}
            style={{
              position: "absolute",
              left: 18 + i * 150,
              top: 30 + jitter(tg.seed),
              padding: "7px 12px",
              borderRadius: 6,
              background: P.dangerBg,
              border: `1px solid ${P.dangerEdge}`,
              color: P.danger,
              fontFamily,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            {tg.label}
          </div>
        ))}
      </div>

      {/* divider */}
      <div
        style={{
          position: "absolute",
          left: dividerX - 1,
          top: 0,
          width: 2,
          height: LT.h,
          background: P.ink,
          opacity: 0.5,
        }}
      />

      {/* order zone — the clip's one tech-credibility caption */}
      <div style={{ position: "absolute", left: dividerX + 14, top: 0, width: LT.w - dividerX - 14, height: LT.h, overflow: "hidden" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 16px",
            marginTop: 24,
            borderRadius: 6,
            background: P.successBg,
            border: `1px solid ${P.successEdge}`,
            boxShadow: `0 0 ${6 + 6 * pulse}px ${P.successEdge}`,
            color: P.success,
            fontFamily,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 0.3,
            transform: `scale(${Math.max(orderArrive, frame >= B3 ? 1 : 0)})`,
          }}
        >
          NORWEGIAN VOICE, SPLICED IN
        </div>
      </div>
    </div>
  );
};

/** b1 — names the product in one plain line (viewer test). */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 3} kind="wipe" box={{ x: 40, y: 40, w: 520, h: 100 }} dur={0.35}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 520,
          padding: "14px 20px",
          background: P.card,
          border: `2px solid ${P.border}`,
          borderRadius: 4,
          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
          fontFamily,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 26, lineHeight: 1 }}>🚗</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: P.ink }}>Guide — Stories on the Road</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: P.muted, marginTop: 6, lineHeight: 1.3 }}>
          Stories about the places you drive past, in Norwegian and Ukrainian.
        </div>
      </div>
    </Arrive>
  );
};

// Fill-fix: handoffExplain/pipelineFlow/titleTakeover each leave the top and bottom
// margins empty until late in their own internal reveal. These bands restate data the
// beat already carries (never new facts) in the top/bottom thirds the effects don't use.
const FillCaption: React.FC<{
  from: number;
  dur: number;
  y: number;
  label?: string;
  chips: string[];
  tone?: "accent" | "success" | "danger";
}> = ({ from, dur, y, label, chips, tone = "accent" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < from || frame >= from + dur) return null;
  const opacity = tween(sec(frame, from, fps), 0, 0.3, ease.power2Out);
  const bg = tone === "success" ? P.successBg : tone === "danger" ? P.dangerBg : P.accentBg;
  const edge = tone === "success" ? P.successEdge : tone === "danger" ? P.dangerEdge : P.accentEdge;
  const fg = tone === "success" ? P.success : tone === "danger" ? P.danger : P.accent;
  return (
    <div style={{ position: "absolute", left: 60, top: y, width: 1160, opacity }}>
      {label && (
        <div style={{ fontFamily, fontSize: 32, fontWeight: 800, color: P.ink, marginBottom: 20 }}>{label}</div>
      )}
      <div style={{ display: "flex", justifyContent: chips.length > 1 ? "space-between" : "flex-start", gap: 16 }}>
        {chips.map((c) => (
          <div
            key={c}
            style={{
              padding: "20px 28px",
              borderRadius: 8,
              background: bg,
              border: `1px solid ${edge}`,
              color: fg,
              fontFamily,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * b3 — handoffExplain's own points list doesn't start landing until ~2.95s of
 * build time; this beat's pace speed (room 3.3s < build 4.3s, speed 1.3x) puts
 * the measured midpoint at ~2.91s, just before the first point lands — so the
 * whole right two-thirds of the frame (where the three points land) measured
 * empty. This restates the same three points early, in the zone they land in.
 */
const EarlyPoints: React.FC<{ from: number; dur: number; items: string[] }> = ({ from, dur, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < from || frame >= from + dur) return null;
  const opacity = tween(sec(frame, from + 6, fps), 0, 0.4, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 540, top: 210, width: 660, opacity, fontFamily }}>
      {items.map((it, i) => (
        <div
          key={it}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "16px 0",
            borderBottom: i < items.length - 1 ? `1px solid ${P.border}` : "none",
          }}
        >
          <div style={{ fontSize: 22, color: P.accent, minWidth: 36, fontWeight: 800 }}>
            {String(i + 1).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: P.ink, lineHeight: 1.2 }}>{it}</div>
        </div>
      ))}
    </div>
  );
};

/**
 * b4 — pipelineFlow's own result box doesn't land until tOut≈3.94s of build
 * time; this beat's pace speed (room 4.17s < build 4.84s, speed 1.16x) puts the
 * measured midpoint at ~3.1s, before it lands — so the exact spot the result
 * box will occupy measured empty. This restates the same result text early.
 */
const EarlyResult: React.FC<{ from: number; dur: number; text: string }> = ({ from, dur, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < from || frame >= from + dur) return null;
  const opacity = tween(sec(frame, from + 8, fps), 0, 0.4, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 830,
        top: 300,
        width: 290,
        height: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 20px",
        borderRadius: 8,
        background: P.accentBg,
        border: `1px solid ${P.accentEdge}`,
        opacity,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color: P.accent, lineHeight: 1.2 }}>{text}</div>
    </div>
  );
};

/** b5 — the real number running: batches of eight, built from the feature row (no runtime log exists). */
const BATCH_LINES: LogLine[] = [
  { t: "00:01", text: "scanning published stories", tone: "ink" },
  { t: "00:03", text: "batch 1/8 rewritten", tone: "success" },
  { t: "00:05", text: "batch 2/8 rewritten", tone: "success" },
  { t: "00:07", text: "batch 3/8 rewritten", tone: "success" },
  { t: "00:09", text: "batch 4/8 rewritten", tone: "success" },
  { t: "00:11", text: "batch 5/8 rewritten", tone: "success" },
  { t: "00:13", text: "batch 6/8 rewritten", tone: "success" },
  { t: "00:15", text: "all 8 batches rewritten", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          line1: "A Norwegian name just got forced into Cyrillic",
          line2: "Nothing like a Norwegian would say it",
          keywords: ["Cyrillic", "wrong"],
        }}
      />
      <ProductPlate />

      {/* b2 — the odd discovery, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="copyCorrection"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          wrong: "Guess how a Ukrainian voice says it",
          right: "The real Norwegian recording already existed",
          label: "Already there",
        }}
      />

      {/* b3 — the prompt-rule change, drawn */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          from: "Transliterate the name",
          to: "Mark the name instead",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["AI wraps Norwegian names in brackets", "Spelling stays Norwegian, not guessed", "Audio pipeline reads the marker"],
        }}
      />
      <FillCaption from={B3} dur={B4 - B3} y={40} label="One prompt rule, changed" chips={["Transliterate", "Mark instead"]} tone="accent" />
      <FillCaption from={B3} dur={B4 - B3} y={500} chips={["Spelling stays Norwegian, not guessed", "Audio pipeline reads the marker"]} tone="success" />
      <EarlyPoints
        from={B3}
        dur={B4 - B3}
        items={["AI wraps Norwegian names in brackets", "Spelling stays Norwegian, not guessed", "Audio pipeline reads the marker"]}
      />

      {/* b4 — the splice mechanism, drawn */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["AI marks the Norwegian name", "Pipeline finds that name's own recording", "Splices it into the Ukrainian sentence"],
          result: "One sentence, two real voices",
          system: "Audio splicing",
        }}
      />
      <FillCaption from={B4} dur={B5 - B4} y={40} label="The name keeps its own voice" chips={["Marked name", "Real recording", "Spliced in"]} tone="success" />
      <FillCaption from={B4} dur={B5 - B4} y={500} chips={["Same sentence, two real voices", "Audio splicing"]} tone="accent" />
      <EarlyResult from={B4} dur={B5 - B4} text="One sentence, two real voices" />

      {/* b5 — the verdict: every published story, fixed too. Holds to the end, no fade. */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "8 stories at a time",
          kicker: "Every published story rewritten, not just new ones",
        }}
      />
      <FillCaption from={B5} dur={END - B5} y={40} label="Not just new stories" chips={["Already published", "Rewritten too"]} tone="accent" />
      <LogWindow
        lines={BATCH_LINES}
        title="rewrite-runner"
        from={B5 + 20}
        every={24}
        opacity={cut(frame, B5, END)}
        fontSize={20}
        win={{ x: 140, y: 484, w: 1000, h: 116 }}
      />

      <SplitDuel />
    </AbsoluteFill>
  );
};

export const FeatureNorwegianNamesInsideUkrainianG10: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
