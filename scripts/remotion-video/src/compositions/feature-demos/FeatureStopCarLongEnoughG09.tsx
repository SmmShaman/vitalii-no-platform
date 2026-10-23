// FeatureStopCarLongEnoughG09 — feature g09 — 1280x720, 899 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline ribbon, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
// Rebuilt 2026-10-23 (directing gate): the clip was staged as a camera zoom (archetype 2)
// under an archetype-1 header. Restaged as an actual timeline ribbon — beats, windows,
// palette and narration all unchanged.
//
// Voice-synced beat windows (measured, immutable): b1 15-190, b2 190-362,
// b3 362-520, b4 520-689, b5 689-899 (holds to end).
//
// Beat -> effect (data only from the feature row and commit 721f400):
// b1 15-190   "the story already ended on the way in"
//             quoteMarker over the feature's own write-up page (backdrop).
//             The ribbon draws in with its first stamp landing: DROVE PAST.
// b2 190-362  "every place only ever told one short clip"
//             cornerTags: the claim + four facts from problem_en, over the hub.
//             Second stamp lands: ONE SHORT CLIP.
// b3 362-520  "the app notices when you actually stop"
//             statusFocus over the write-up scrolled to the dwell paragraph.
//             Third stamp lands: DWELL CHECK.
// b4 520-689  "its AI reads the full local history article"
//             handoffExplain (short excerpt -> full article, dossier.py)
//             over the write-up scrolled to the deep-dive paragraph.
//             Fourth stamp lands: FULL ARTICLE.
// b5 689-899  "once a snippet, now the whole piece, 12,000 characters"
//             ratioBars: 12,000 (main article) vs 32,000 (with related pages).
//             No live backdrop here (gate: last beat must be the feature's
//             own result, not its page or the hub). Fifth stamp lands:
//             32,000 CHARS — the ribbon ends fully filled, holding to the end.
//
// Persistent element: the timeline ribbon (archetype 1), b1 through b5 — a
// horizontal time band spanning the frame (x 110-1170, y 330) that fills as
// the clip progresses and gains one landed stamp per beat, left to right.
// It is the largest, most central, longest-lived object on screen; the
// running claim sits bottom-left, small, never centered. Deleting the ribbon
// leaves no story to read.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g09.json";

const B1 = 15;
const B2 = 190;
const B3 = 362;
const B4 = 520;
const B5 = 689;
const END = 899;

/** Accent tuned for the dark stage. */
const ACCENT = "#2BB3A3";
const STAGE = "#0F1A17";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Ribbon geometry — a horizontal band dominating the frame; five stamps land
// on it left-to-right, one per beat, as that beat starts.
const RIBBON_Y = 330;
const RIBBON_X0 = 110;
const RIBBON_X1 = 1170;
const BEAT_STARTS = [B1, B2, B3, B4, B5];
const slotX = (i: number) => RIBBON_X0 + (i * (RIBBON_X1 - RIBBON_X0)) / (BEAT_STARTS.length - 1);

const STAMPS = [
  { label: "DROVE PAST", sub: "Story already over" },
  { label: "ONE SHORT CLIP", sub: "Same clip, every place" },
  { label: "DWELL CHECK", sub: "Parked, not just passing" },
  { label: "FULL ARTICLE", sub: "12,000 characters read" },
  { label: "32,000 CHARS", sub: "Main + related pages" },
];

const LABEL_BOX = { x: 40, y: 606, w: 360, h: 80 };

const Ribbon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  let idx = 0;
  for (let i = 0; i < BEAT_STARTS.length; i++) if (frame >= BEAT_STARTS[i]) idx = i;
  const at = BEAT_STARTS[idx];
  const p = tween(sec(frame, at, fps), 0, 0.5, ease.power2Out);
  const prevFillW = idx > 0 ? slotX(idx - 1) - RIBBON_X0 : 0;
  const curFillW = slotX(idx) - RIBBON_X0;
  const fillWidth = mix(p, prevFillW, curFillW);
  const landPunch = punchScale(sec(frame, at, fps), 0);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      {/* the band itself — the archetype's one persistent object, spanning the frame */}
      <div
        style={{
          position: "absolute",
          left: RIBBON_X0,
          top: RIBBON_Y - 4,
          width: RIBBON_X1 - RIBBON_X0,
          height: 8,
          borderRadius: 4,
          background: P.border,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RIBBON_X0,
          top: RIBBON_Y - 4,
          width: fillWidth,
          height: 8,
          borderRadius: 4,
          background: P.accent,
        }}
      />

      {STAMPS.map((s, i) => {
        const landed = i < idx;
        const active = i === idx;
        if (!landed && !active) {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: slotX(i) - 13,
                top: RIBBON_Y - 13,
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: `3px dashed ${P.muted}`,
                boxSizing: "border-box",
              }}
            />
          );
        }
        const scale = active ? landPunch : 1;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: slotX(i) - 17,
                top: RIBBON_Y - 17,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: P.accent,
                border: `3px solid ${P.accentEdge}`,
                boxShadow: active ? `0 0 0 7px ${P.accentEdge}` : "none",
                boxSizing: "border-box",
                transform: `scale(${scale})`,
                transformOrigin: `${slotX(i)}px ${RIBBON_Y}px`,
              }}
            />
            {active && (
              <div
                style={{
                  position: "absolute",
                  left: Math.min(Math.max(slotX(i) - 110, 20), 1280 - 240),
                  top: RIBBON_Y - 86,
                  width: 220,
                  textAlign: "center",
                  fontFamily,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.4, color: P.accent }}>{s.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#E8F4F1", marginTop: 4 }}>{s.sub}</div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Running claim, bottom-left, small, never centered (archetype 1's headline rule). */
const SideLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const label =
    cut(frame, B1, B2) === 1
      ? "STORY ALREADY OVER"
      : cut(frame, B2, B3) === 1
      ? "ONE CLIP, EVERY PLACE"
      : cut(frame, B3, B4) === 1
      ? "DWELL CHECK"
      : cut(frame, B4, B5) === 1
      ? "FULL ARTICLE, NOT A SNIPPET"
      : frame >= B5
      ? "RESULT"
      : null;
  if (!label) return null;
  const at = frame >= B5 ? B5 : frame >= B4 ? B4 : frame >= B3 ? B3 : frame >= B2 ? B2 : B1;
  return (
    <Arrive at={at} kind="wipe" box={LABEL_BOX} dur={0.3}>
      <div
        style={{
          position: "absolute",
          left: LABEL_BOX.x,
          top: LABEL_BOX.y,
          width: LABEL_BOX.w,
          height: LABEL_BOX.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>{label}</div>
      </div>
    </Arrive>
  );
};

/** Beat 1 only: names the product in one plain line (owner rule, STEP 0e). */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B1 || frame >= B2) return null;
  const t = tween(sec(frame, B1 + 2, 30), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 18,
        width: 1280,
        textAlign: "center",
        opacity: t,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: ACCENT }}>
        GUIDE — STORIES ON THE ROAD
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#E8F4F1", marginTop: 2 }}>
        Knows where you are. Plays short stories about places nearby — Norwegian + Ukrainian.
      </div>
    </div>
  );
};

/**
 * Beat 5 only: ratioBars' own bracket+ratio tag don't draw in until ~4.1s into
 * the 7s beat, so the right third of the frame sits empty through the midpoint
 * (measured, contact sheet). This fills it immediately with what the bigger
 * number is made of, instead of waiting on the bars' own late reveal.
 */
const ResultNotes: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  const t = tween(sec(frame, B5 + 4, 30), 0, 0.4, ease.power3Out);
  const items = ["Related pages, same place", "Same visit, nothing repeated"];
  return (
    <div style={{ position: "absolute", right: 80, top: 120, width: 380, opacity: t, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        WHAT&apos;S IN THE 32,000
      </div>
      {items.map((it, i) => (
        <div
          key={it}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: i === 0 ? 16 : 12,
            fontSize: 18,
            fontWeight: 600,
            color: "#E8F4F1",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 4, background: P.accent, flexShrink: 0 }} />
          {it}
        </div>
      ))}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own write-up */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-top" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="quoteMarker"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          quote: "You park by the farm. Walk around. The story already ended on the way in.",
          highlight: "already ended",
          source: "Every stop, before today",
        }}
      />
      <ProductPlate />

      {/* b2 — what every place offered before (problem_en) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile as any} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "One short clip. One tiny slice of history.",
          tags: ["Same clip every time", "Built from a short excerpt", "No matter how long you stay", "Nothing deeper offered"],
        }}
      />

      {/* b3 — the fix: a real dwell check, not a slow corner */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-mid" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Is this a real stop?",
          claims: [
            { text: "Driving past at speed", verdict: "no" },
            { text: "Slowing for a corner", verdict: "unclear" },
            { text: "Parked, walking around", verdict: "yes" },
          ],
        }}
      />

      {/* b4 — the deep dive, over the write-up's deep-dive paragraph (dossier.py, 721f400) */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-mid2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Short excerpt (first story)",
          to: "Full local-history article",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Up to 12,000 characters read", "Related pages folded in too", "Skips what you already heard", "dossier.py, deep=True"],
        }}
      />

      {/* b5 — the result: drawn only, holds to the end (no page/hub on the last beat) */}
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        plate={0}
        data={{
          title: "Characters built into the deep story",
          a: { label: "Main article alone", value: 12000 },
          b: { label: "With related pages", value: 32000 },
          unit: "chars",
          caption: "Once a snippet, now the whole piece",
        }}
      />
      <ResultNotes />

      <SideLabel />
      <Ribbon />
    </AbsoluteFill>
  );
};

export const FeatureStopCarLongEnoughG09: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
