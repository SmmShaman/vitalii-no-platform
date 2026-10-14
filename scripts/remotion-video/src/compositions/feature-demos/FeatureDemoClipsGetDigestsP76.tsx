// FeatureDemoClipsGetDigestsP76 — feature p76 — 1280x720, 950 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real product's own feature page as evidence, one owner of the frame, a reading
// hold at the end of every beat, cuts not fades.
//
// Beat → picture (data only from this feature's own description + the real
// digest-motion catalog file, scripts/video-processor/skills/digest-motion/effects.json):
// b1 15-195   "Every night, feature clips just sat there — a static screen while a
//             voice narrated over it."
//             keywordCaption over a LiveBackdrop of the feature's own page
//             (backdrop "page"). A small product plate names Portfolio & News
//             Platform once. Ledger enters the lower-third band at "0/23"/danger
//             (nothing shared yet — the stated deficit).
// b2 195-411  "Meanwhile the nightly news digest already used real motion graphics
//             — title cards, counters, callouts."
//             cardCounter over the same continuous page recording — the REAL
//             5-family breakdown of the digest's 23 motion effects (3+3+10+5+2),
//             summing to the exact total used below. Ledger stays in the band,
//             unchanged.
// b3 411-588  "So the same Remotion pipeline that builds the news digest now
//             builds the feature clips too."
//             hubRouting, drawn only (no backdrop — the shared pipeline itself has
//             no public page): the two scripts route into one hub. Ledger flips to
//             "23/23"/success here, in the band, with a small punch.
// b4 588-790  "One shared grammar file plans a motion effect per voice beat — like
//             handing the clips the news show's own editor."
//             pipelineFlow, drawn only — the three real stages this very clip ran
//             through to land on screen. Ledger stays in the band, already flipped.
// b5 790-950  "One engineering build now powers two products instead of one."
//             Fully drawn: the ledger goes BIG — the old 0/23 total struck through,
//             rewritten 23/23 in green — plus a LogWindow (motion_usage) listing
//             the 4 real effects THIS clip itself used in beats 1-4. Holds to END
//             at full brightness, no fade. Neither the feature page nor the hub
//             appears in this beat.
//
// Persistent element: the ledger total (archetype 5) — small in the lower-third
// band (y >= 600) for b1-b4 where a catalog effect owns the stage above it, BIG
// only in b5 (the one beat with no competing catalog effect). The two line items
// (feature clips / news digest) only appear once, fully itemised, in the b5
// reveal — the small band only ever shows the running total. Gate 2: b5 ends on
// a drawn result (ledger + LogWindow), not a page.
//
// GitHub commits were verified tonight (5a7f8ac, 36fd038) but neither states
// this clip's shared-pipeline claim directly — both are generic "tonight's
// clips"/"narration measured" commits for other feature ids, not evidence that
// would read as proof to a blind viewer. So b3's hub and b4's grammar file stay
// drawn, per STEP 0c's "draw the mechanism" fallback when no commit proves the
// sentence.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p76.json";

const B1 = 15;
const B2 = 195;
const B3 = 411;
const B4 = 588;
const B5 = 790;
const END = 950;

const ACCENT = "#B4531F";
const STAGE = "#1C140F";

/** Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the
    ledger total's SMALL home while a catalog effect sits above it (b1-b4). */
const BAND = { x: 40, y: 602, w: 480, h: 96 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 5 — the running ledger total, present every beat, BIG only in b5
    (the one beat with no catalog effect competing for the upper frame). The
    total flips once, at B3, from the stated deficit (0/23) to parity (23/23). */
const LedgerFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B3;
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const status = flipped ? "FULLY SHARED" : "NOT YET SHARED";
  const value = flipped ? "23/23" : "0/23";

  if (frame >= B5) {
    const t = tween(sec(frame, B5 + 4, fps), 0, 0.5, ease.power3Out);
    const strikeT = tween(sec(frame, B5 + 14, fps), 0, 0.4, ease.power2Out);
    return (
      <div style={{ position: "absolute", left: 80, top: 128, width: 820, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(42,32,24,0.6)" }}>
          MOTION EFFECTS LEDGER
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: P.muted,
              textDecoration: strikeT > 0.5 ? "line-through" : "none",
              opacity: 0.55,
            }}
          >
            0/23
          </div>
          <div style={{ fontSize: 118, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color: P.success }}>
            23/23
          </div>
        </div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <LedgerRow label="FEATURE CLIPS" value="23 effects" P={P} />
          <LedgerRow label="NEWS DIGEST" value="23 effects" P={P} />
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "10px 22px",
            borderRadius: 4,
            background: bg,
            border: `2px solid ${color}`,
            color,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          ONE SHARED PIPELINE — TWO PRODUCTS
        </div>
      </div>
    );
  }

  const flipPunch = flipped ? Math.max(0, punchScale(sec(frame, B3, fps), 0) - 1) : 0;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={BAND} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: BAND.x,
          top: BAND.y,
          width: BAND.w,
          height: BAND.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 22px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 800, color, transform: `scale(${1 + flipPunch * 0.3})`, whiteSpace: "nowrap" }}>
          {value}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>EFFECTS SHARED</div>
          <div style={{ fontSize: 15, fontWeight: 800, color }}>{status}</div>
        </div>
      </div>
    </Arrive>
  );
};

const LedgerRow: React.FC<{ label: string; value: string; P: ReturnType<typeof usePalette> }> = ({ label, value, P }) => (
  <div style={{ display: "flex", justifyContent: "space-between", width: 420, fontSize: 24, fontWeight: 700 }}>
    <span style={{ color: P.ink }}>{label}</span>
    <span style={{ color: P.success }}>{value}</span>
  </div>
);

/** b1 — small product plate naming the real product, over the LiveBackdrop + effect. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B1, B2) !== 1) return null;
  const t = tween(sec(frame, B1 + 4, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 24,
        padding: "7px 16px",
        background: "rgba(28,20,15,0.85)",
        border: "1.5px solid #E0B38D",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        color: "#F5F5F5",
        opacity: t,
        maxWidth: 560,
        lineHeight: 1.4,
        fontFamily,
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>VITALII.NO — PORTFOLIO & NEWS PLATFORM</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>
        the pipeline that renders this feature's own clip, every night
      </span>
    </div>
  );
};

const LOG_LINES: Array<{ t?: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { text: "beat1 -> keywordCaption", tone: "muted" },
  { text: "beat2 -> cardCounter", tone: "ink" },
  { text: "beat3 -> hubRouting", tone: "accent" },
  { text: "beat4 -> pipelineFlow", tone: "accent" },
  { text: "4 effects this clip, 0 repeats", tone: "success" },
  { text: "features.motion_usage updated", tone: "success" },
];

/** b5 — the result, fully drawn: LogWindow with this clip's own real effect usage.
    Holds to END at full brightness, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const captionIn = tween(t, 1.3, 0.3, ease.power2Out);
  return (
    <>
      <LogWindow
        lines={LOG_LINES}
        title="motion_usage"
        from={B5 + 14}
        every={16}
        opacity={1}
        win={{ x: 680, y: 56, w: 540, h: 470 }}
        fontSize={18}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 540,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#2A2018",
          opacity: captionIn,
          fontFamily,
        }}
      >
        One shared grammar file, not a second pipeline, now plans every beat's picture.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1+b2 — the flat-screen problem, then the digest's own effect catalog, over the feature's own page (continuous recording, no restart) */}
      {cut(frame, B1, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B3 - B1} push={0.03} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{
          line1: "A static screen",
          line2: "while a voice narrated",
          keywords: ["static", "narrated"],
        }}
      />
      <ProductPlate />

      {/* b2 — the digest's real 23-effect catalog, over the same continuous backdrop */}
      <MotionInsert
        effect="cardCounter"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.78}
        data={{
          cards: [
            { label: "Kinetic type", value: 3 },
            { label: "Evidence", value: 3 },
            { label: "Comparison", value: 10 },
            { label: "Process", value: 5 },
            { label: "Cards", value: 2 },
          ],
          unit: "effects",
          totalLabel: "All effects",
        }}
      />

      {/* b3 — the fix: one shared pipeline, drawn only (invisible plumbing, no public page) */}
      <MotionInsert
        effect="hubRouting"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.78}
        data={{
          inputs: ["News digest script", "Feature clip script"],
          hub: "One shared pipeline",
          output: "One render engine",
        }}
      />

      {/* b4 — how a beat gets its effect, drawn only */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.78}
        data={{
          steps: ["Voice beat measured", "Grammar picks an effect", "MotionInsert renders it"],
          result: "One effect per beat",
          system: "grammar.ts (shared)",
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <LedgerFigure />
    </AbsoluteFill>
  );
};

export const FeatureDemoClipsGetDigestsP76: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
