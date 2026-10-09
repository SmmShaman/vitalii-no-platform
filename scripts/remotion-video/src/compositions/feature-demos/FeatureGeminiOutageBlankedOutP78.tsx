// FeatureGeminiOutageBlankedOutP78 — feature p78 — 1280x720, 871 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real GitHub repo's own commit/run history as evidence where there is one, one
// owner of the frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature's own problem/solution/result text):
// b1 15-185   "One outage, and two whole video segments went out carrying zero
//             AI direction at all."
//             drawn (metaphor, no catalog effect) — the hero number opens BIG at
//             "1" (danger), a product plate names the site, and a column of
//             pipeline chips on the right ends on the single point of failure.
// b2 185-386  "My video pipeline only ever asks one AI service — when it's
//             down, there's no backup plan."
//             pipelineFlow over the repo's commit history (backdrop "commits")
//             as evidence a real GitHub Actions pipeline exists. Hero shrinks
//             into the lower-third band, still "1"/danger.
// b3 386-534  "On October 7th, that's exactly what happened, right in the
//             middle of a render."
//             cornerTags over the repo's Actions runs (backdrop "actions") —
//             the claim plus four facts of the actual outage.
// b4 534-661  "Now Groq quietly steps in the moment that main service fails."
//             handoffExplain, drawn only (no backdrop) — before/now hand-off
//             from "Gemini only" to "Gemini + Groq". Hero flips to "2"/success
//             at this beat's first frame, still in the band.
// b5 661-871  "Every segment still gets its direction — closing the exact gap
//             from October 7th."
//             drawn (metaphor, no catalog effect) — hero returns BIG at "2"
//             (success), a log window on the right shows the real retry path.
//             Holds to the end at full brightness, no fade.
//
// Persistent element: the hero number (archetype 7) — BIG and left-of-centre
// in b1/b5 (the two beats with no catalog effect under it), shrunk into the
// lower-third band (y >= 600, below the effects' safe bottom) for b2-b4 so it
// never collides with the catalog effect above it. Value/tone/status flip
// exactly once, at b4's first frame: "1"/danger/NO FALLBACK -> "2"/success/
// GEMINI + GROQ.
//
// Gate 2: the clip does NOT end on the feature's own page or the hub — b5 has
// no LiveBackdrop at all, only the drawn hero + LogWindow.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p78.json";

const B1 = 15;
const B2 = 185;
const B3 = 386;
const B4 = 534;
const B5 = 661;
const END = 871;

/** Brighter than violet's #5B37D4 so it reads on the dark plate. */
const ACCENT = "#8C6FF5";
const STAGE = "#140F26";

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the
// hero number's SMALL home for b2-b4, same geometry as other violet clips.
const BAND = { x: 40, y: 606, w: 420, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 7 — the hero number, present every beat, BIG when it owns the
    frame alone (b1/b5) and shrunk into BAND while a catalog effect sits above
    it (b2-b4). Flips once, at B4. */
const HeroFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B4;
  const value = flipped ? "2" : "1";
  const status = flipped ? "GEMINI + GROQ" : "NO FALLBACK";
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const big = frame < B2 || frame >= B5;

  if (big) {
    const inAt = frame < B2 ? B1 : B5;
    const t = tween(sec(frame, inAt + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div style={{ position: "absolute", left: 90, top: 150, width: 560, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(245,245,242,0.62)" }}>
          LLM BACKENDS AVAILABLE
        </div>
        <div style={{ fontSize: 280, fontWeight: 800, lineHeight: 1, color, marginTop: 6 }}>{value}</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 14,
            padding: "10px 22px",
            borderRadius: 4,
            background: bg,
            border: `2px solid ${color}`,
            color,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          {status}
        </div>
      </div>
    );
  }

  const flipPunch = flipped ? Math.max(0, punchScale(sec(frame, B4, fps), 0) - 1) : 0;
  return (
    <Arrive at={B2 + 4} kind="wipe" box={BAND} dur={0.4}>
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
        <div style={{ fontSize: 56, fontWeight: 800, color, transform: `scale(${1 + flipPunch * 0.3})` }}>
          {value}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>LLM BACKENDS</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{status}</div>
        </div>
      </div>
    </Arrive>
  );
};

type Hop = { label: string; fail?: boolean };
const HOPS: Hop[] = [
  { label: "GitHub Actions run" },
  { label: "visual-director.js" },
  { label: "llm-helper.js" },
  { label: "Gemini (only)", fail: true },
];

/** b1 — the problem, fully drawn: product plate, big hero "1", and the
    pipeline's single point of failure laid out as a chip column. */
const OpeningBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B1, B2) !== 1) return null;
  const t = sec(frame, B1, fps);
  const plateIn = tween(t, 0.1, 0.3, ease.power3Out);
  const chipsIn = tween(t, 0.35, 0.35, ease.power3Out);
  const captionIn = tween(t, 0.8, 0.3, ease.power2Out);
  const COL_X = 712;
  const COL_W = 468;
  const CHIP_Y0 = 170;
  const CHIP_H = 76;
  const CHIP_GAP = 16;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 70,
          padding: "7px 16px",
          background: "rgba(10,8,20,0.85)",
          border: "1.5px solid #CDC1F3",
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 700,
          color: "#F5F5F5",
          opacity: plateIn,
          maxWidth: 560,
          lineHeight: 1.4,
        }}
      >
        <span style={{ fontWeight: 800, letterSpacing: 1 }}>PORTFOLIO &amp; NEWS PLATFORM</span>
        <br />
        <span style={{ fontWeight: 500, opacity: 0.85 }}>
          my personal site &amp; content pipeline — collects tech news, writes trilingual
          feature stories about my own commits, and renders short narrated video
        </span>
      </div>
      {HOPS.map((h, i) => {
        const y = CHIP_Y0 + i * (CHIP_H + CHIP_GAP);
        return (
          <div
            key={h.label}
            style={{
              position: "absolute",
              left: COL_X,
              top: y,
              width: COL_W,
              height: CHIP_H,
              borderRadius: 4,
              background: h.fail ? "rgba(194,42,91,0.14)" : "rgba(255,255,255,0.06)",
              border: `2px solid ${h.fail ? "#C22A5B" : "#CDC1F3"}`,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              fontSize: 20,
              fontWeight: 800,
              color: h.fail ? "#F08BAA" : "#F5F5F2",
              opacity: chipsIn,
              transform: `translateX(${(1 - chipsIn) * 30}px)`,
            }}
          >
            {h.fail ? "✖ " : "→ "}
            {h.label}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 540,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#F5F5F2",
          opacity: captionIn,
        }}
      >
        No fallback meant two segments rendered with zero AI direction.
      </div>
    </>
  );
};

const RETRY_LOG: Array<{ t: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { t: "Oct 7", text: "visual-director.js: requesting Gemini…", tone: "muted" },
  { t: "", text: "Gemini: 503 Service Unavailable", tone: "danger" },
  { t: "", text: "2 segments: no AI-generated direction", tone: "danger" },
  { t: "now", text: "llm-helper.js: Gemini call failed", tone: "muted" },
  { t: "", text: "llm-helper.js: retrying on Groq…", tone: "accent" },
  { t: "", text: "Groq: visual direction returned", tone: "success" },
  { t: "", text: "segment keeps its direction", tone: "success" },
];

/** b5 — the result, fully drawn: big hero "2" plus a log window showing the
    real retry path. Holds to END at full brightness, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const captionIn = tween(t, 0.9, 0.3, ease.power2Out);
  return (
    <>
      <LogWindow
        lines={RETRY_LOG}
        title="llm-helper.js"
        from={B5 + 14}
        every={16}
        opacity={1}
        win={{ x: 660, y: 56, w: 560, h: 470 }}
        fontSize={18}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 540,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#F5F5F2",
          opacity: captionIn,
        }}
      >
        Groq catches the call now — the exact gap from October 7th is closed.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the outage's cost, fully drawn */}
      <OpeningBeat />

      {/* b2 — the vulnerable pipeline (problem), over the repo's real commit history */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="commits" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.8}
        data={{
          system: "video-processor",
          steps: ["GitHub Actions run", "visual-director.js", "llm-helper.js", "Gemini (only)"],
          result: "Down = no direction",
        }}
      />

      {/* b3 — the October 7th outage, over the repo's real Actions runs */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="actions" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="cornerTags"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.8}
        data={{
          statement: "October 7th outage",
          tags: ["Gemini: 503", "Mid-render", "2 segments blind", "No fallback"],
        }}
      />

      {/* b4 — the fix, drawn only (no backdrop) */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          from: "Gemini only",
          to: "Gemini + Groq",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: [
            "llm-helper.js retries Groq",
            "visual-director.js wired in",
            "3 workflows updated",
            "Segment keeps its direction",
          ],
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <HeroFigure />
    </AbsoluteFill>
  );
};

export const FeatureGeminiOutageBlankedOutP78: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
