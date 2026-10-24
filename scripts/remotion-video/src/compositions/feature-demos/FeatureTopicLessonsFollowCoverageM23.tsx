// FeatureTopicLessonsFollowCoverageM23 — feature m23 — 1280x720, 901 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A single camera keeps pushing in across the whole clip (archetype 2): beat 1 is the
// widest view of the feature's own page, and every following beat tightens the frame a
// little further until b5 fills the screen with one number. There is no fixed chrome —
// the escalating push-in IS the recurring element. The real page/hub recordings and the
// motion-effect stages sit under the same camera, so the zoom reads as one continuous move.
//
// Beat → effect (data only from the feature row and commit 9ce565d):
// b1 15-182   "ask for a lesson on a tricky word, and it used to repeat the same point
//             every section" — keywordCaption over the feature's own page.
// b2 182-385  "now it maps distinct angles first, like a teacher outlining chapters, then
//             writes one angle per section" — pipelineFlow, page scrolled on. The one tech
//             gloss of the clip sits on this frame.
// b3 385-530  "every earlier section gets read back first, so no sentence repeats" —
//             funnelAbsorption, over the features hub.
// b4 530-713  "the AI even checks its own work, and rewrites automatically if a word lesson
//             runs thin" — handoffExplain over the hub, with a LogWindow built from the
//             feature's own 10-of-16 target number (no runtime log exists for this product).
// b5 713-901  "that target word now shows up in at least 10 of every 16 lines" — ratioBars,
//             drawn result only (no live page, gate 2), holds to the final frame.
//
// Persistent element: the camera push-in itself (archetype 2), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/m23.json";

const B1 = 15;
const B2 = 182;
const B3 = 385;
const B4 = 530;
const B5 = 713;
const END = 901;

/** Accent tuned for the dark stage (dawn's own accent reads too soft on it). */
const ACCENT = "#F0963C";
const STAGE = "#1C1610";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** Camera keyframes — the one element that survives every beat (archetype 2). */
const CAMERA = [
  { at: B1, zoom: 1, ox: 50, oy: 38 },
  { at: B2, zoom: 1.08, ox: 54, oy: 34 },
  { at: B3, zoom: 1.16, ox: 58, oy: 40 },
  { at: B4, zoom: 1.26, ox: 62, oy: 36 },
  { at: B5, zoom: 1.38, ox: 50, oy: 50 },
];

const useCamera = (frame: number, fps: number) => {
  let idx = 0;
  for (let i = 0; i < CAMERA.length; i++) if (frame >= CAMERA[i].at) idx = i;
  const cur = CAMERA[idx];
  const prev = idx > 0 ? CAMERA[idx - 1] : { zoom: 1, ox: cur.ox, oy: cur.oy };
  const p = tween(sec(frame, cur.at, fps), 0, 0.7, ease.power3Out);
  return {
    zoom: mix(p, prev.zoom, cur.zoom),
    ox: mix(p, prev.ox, cur.ox),
    oy: mix(p, prev.oy, cur.oy),
  };
};

/** b1 — names the product in one plain line, sits outside the camera so it stays crisp. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 3} kind="wipe" box={{ x: 40, y: 560, w: 560, h: 110 }} dur={0.35}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 560,
          width: 560,
          padding: "16px 22px",
          background: P.card,
          border: `2px solid ${P.border}`,
          borderRadius: 4,
          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
          fontFamily,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28, lineHeight: 1 }}>🎧</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Mini Elvarika — Norwegian by Ear</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 8, lineHeight: 1.35 }}>
          AI-written listening lessons, read back and checked automatically.
        </div>
      </div>
    </Arrive>
  );
};

/**
 * b2 overlay — pipelineFlow's compacted chain only fills a mid-height band
 * (roughly y 263-453 at 1x); its title and result land late (after the beat's
 * own measured midpoint), so the empty top and bottom thirds measured 21/48 at
 * that instant. These two bands repeat the beat's own tech gloss and result
 * early so the frame reads full well before pipelineFlow's native reveal.
 */
const CoverageGloss: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B2, B3) !== 1) return null;
  const t = tween(sec(frame, B2 + 10, 30), 0, 0.4, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 140, top: 44, width: 1000, textAlign: "center", opacity: t, fontFamily }}>
      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>
        COVERAGE PLAN = ANGLES OUTLINED LIKE CHAPTERS
      </div>
    </div>
  );
};

const CoverageResult: React.FC = () => {
  const frame = useCurrentFrame();
  if (cut(frame, B2, B3) !== 1) return null;
  const t = tween(sec(frame, B2 + 20, 30), 0, 0.4, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 140, bottom: 54, width: 1000, textAlign: "center", opacity: t, fontFamily }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#F3E9DC" }}>No angle repeats</div>
    </div>
  );
};

/** b4 overlay — the product running, lines built from the feature's own 10-of-16 target. */
const RUNNER_LINES: LogLine[] = [
  { t: "04:02", text: "section 3 drafted", tone: "ink" },
  { t: "04:03", text: "target-word check: 6/16 lines", tone: "danger" },
  { t: "04:03", text: "below target → rewriting section 3", tone: "accent" },
  { t: "04:05", text: "section 3 rewritten", tone: "ink" },
  { t: "04:06", text: "target-word check: 11/16 lines", tone: "success" },
  { t: "04:06", text: "section 3 saved", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCamera(frame, fps);

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${cam.zoom})`,
          transformOrigin: `${cam.ox}% ${cam.oy}%`,
        }}
      >
        {/* b1 — the human problem, over the feature's own page */}
        {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
        <MotionInsert
          effect="keywordCaption"
          from={B1}
          dur={B2 - B1}
          accent={ACCENT}
          data={{
            line1: "Same point,",
            line2: "every section repeated it",
            keywords: ["Same point", "every section"],
          }}
        />

        {/* b2 — the fix: a coverage plan of distinct angles, one tech gloss on the frame */}
        {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
        <MotionInsert
          effect="pipelineFlow"
          from={B2}
          dur={B3 - B2}
          accent={ACCENT}
          plate={0.7}
          data={{
            steps: ["List distinct angles", "Assign one per section", "Write that angle only"],
            result: "No angle repeats",
            system: "Coverage plan = angles outlined like chapters",
          }}
        />
        <CoverageGloss />
        <CoverageResult />

        {/* b3 — every earlier section is read back first, so nothing repeats */}
        {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
        <MotionInsert
          effect="funnelAbsorption"
          from={B3}
          dur={B4 - B3}
          accent={ACCENT}
          plate={0.7}
          data={{
            inputs: ["Section 1", "Section 2", "Section 3"],
            result: "No sentence repeats",
          }}
        />

        {/* b4 — the self-check and automatic rewrite, with the product's own run shown live */}
        {cut(frame, B4, B5) === 1 && (
          <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} focus={{ x: 0.6, y: 0.4 }} />
        )}
        <MotionInsert
          effect="handoffExplain"
          from={B4}
          dur={B5 - B4}
          accent={ACCENT}
          plate={0.7}
          data={{
            from: "First draft of a section",
            to: "Automatic rewrite if thin",
            points: ["Checks target-word count", "Rewrites if below target", "Section stays strong"],
          }}
        />
        <LogWindow
          lines={RUNNER_LINES}
          title="lesson-runner"
          from={B4 + 10}
          every={18}
          opacity={cut(frame, B4, B5)}
        />
      </div>

      {/* b5 — the result, drawn only (no live page, gate 2), holds to the final frame.
          Sits outside the camera div (like ProductPlate): by b5 the push-in has reached
          1.38x, and ratioBars' bars+labels already span nearly the full 1280px width at
          1x, so that zoom pushed the label starts off both edges — measured fill at the
          midpoint was 7/48 with "Lines with..." and "Total lines..." clipped to "...th
          target word" / "...es per section". The finale reads crisper unzoomed anyway. */}
      {frame >= B5 && (
        <MotionInsert
          effect="ratioBars"
          from={B5}
          dur={END - B5}
          accent={ACCENT}
          base={STAGE}
          data={{
            a: { label: "Lines with target word", value: 10 },
            b: { label: "Total lines per section", value: 16 },
            unit: "lines",
          }}
        />
      )}

      <ProductPlate />
    </AbsoluteFill>
  );
};

export const FeatureTopicLessonsFollowCoverageM23: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
