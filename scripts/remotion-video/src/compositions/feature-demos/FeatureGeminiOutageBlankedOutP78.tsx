// FeatureGeminiOutageBlankedOutP78 — feature p78 — 1280x720, 871 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood violet. Motion direction v3 — RESHOOT (feature-motion skill, 2026-10-09).
//
// Re-shoot of this clip: same narration/frame windows, different staging. The prior
// draft opened on a drawn beat and used cornerTags (b3) + handoffExplain (b4) — both
// effects already used in all three of p77/p73/b69, and a drawn opener matches p77's
// own opener. This version opens on a catalog effect and swaps in funnelAbsorption /
// pipelineFlow / copyCorrection, none of which repeat recently used effects.
//
// Beat → picture (data only from the feature's own problem/solution/result text):
// b1 15-185   "One outage, and two whole video segments went out carrying zero AI
//             direction at all."
//             funnelAbsorption over a dimmed LiveBackdrop of the feature's own page —
//             three failure facts collapse into the stated cost. Product plate names
//             the site. Hero enters the lower-third band at "2"/danger.
// b2 185-386  "My video pipeline only ever asks one AI service — when it's down,
//             there's no backup plan."
//             pipelineFlow over the same dimmed LiveBackdrop as b1 (continuous
//             recording) — the four-hop pipeline ending on its single point of
//             failure. Hero stays in the band, "2"/danger.
// b3 386-534  "On October 7th, that's exactly what happened, right in the middle of a
//             render."
//             Drawn incident card ("OCT 7", mid-render, danger) over a dimmed
//             LiveBackdrop of the repo's real Actions runs list (ambient evidence,
//             no specific commit asserted). Hero returns BIG at "2"/danger.
// b4 534-661  "Now Groq quietly steps in the moment that main service fails."
//             copyCorrection over the same Actions backdrop (continuous recording) —
//             the wrong/right hand-off. Hero flips to "0"/success at this beat's
//             first frame, in the band.
// b5 661-871  "Every segment still gets its direction — closing the exact gap from
//             October 7th."
//             Drawn full-stage LogWindow with the real retry path. Hero BIG at
//             "0"/success. Holds to END at full brightness, no fade. The clip's one
//             tech caption glosses "Groq" here.
//
// Persistent element: the hero number (archetype 7) — BIG (fontSize 260, satisfies
// gate 1) in b3/b5, the two beats with no catalog effect competing for the upper
// frame; shrunk into the lower-third band (y >= 606) for b1/b2/b4 where a catalog
// effect owns the stage above it. Value/tone flip exactly once, at b4's first frame.
//
// Gate 2: b5 ends on a drawn result (LogWindow + hero), not the feature's own page or
// the hub.
// Commits 5a7f8ac / 36fd038 / 46f7255 do not match any beat's spoken content, so no
// commit diff appears anywhere in this clip.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
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

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the hero
// number's SMALL home while a catalog effect sits above it (b1/b2/b4).
const BAND = { x: 40, y: 606, w: 420, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 7 — the hero number, present every beat, BIG when it owns the frame
    alone (b3/b5, no catalog effect) and shrunk into BAND while a catalog effect
    sits above it (b1/b2/b4). Flips once, at B4. */
const HeroFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B4;
  const value = flipped ? "0" : "2";
  const status = flipped ? "GROQ FALLBACK LIVE" : "NO FALLBACK";
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const big = (frame >= B3 && frame < B4) || frame >= B5;

  if (big) {
    const inAt = frame < B4 ? B3 : B5;
    const t = tween(sec(frame, inAt + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div style={{ position: "absolute", left: 90, top: 150, width: 560, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(245,245,242,0.62)" }}>
          SEGMENTS WITH NO AI DIRECTION
        </div>
        <div style={{ fontSize: 260, fontWeight: 800, lineHeight: 1, color, marginTop: 6 }}>{value}</div>
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

  const entryAt = frame < B3 ? B1 : B4;
  const flipPunch = flipped ? Math.max(0, punchScale(sec(frame, B4, fps), 0) - 1) : 0;
  return (
    <Arrive at={entryAt + 4} kind="wipe" box={BAND} dur={0.4}>
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
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>SEGMENTS BLIND</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{status}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — small product plate naming the site, over the dimmed LiveBackdrop + effect. */
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
        background: "rgba(10,8,20,0.85)",
        border: "1.5px solid #CDC1F3",
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
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>PORTFOLIO &amp; NEWS PLATFORM</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>
        my personal site &amp; content pipeline — collects tech news, writes trilingual
        feature stories about my own commits, and renders short narrated video
      </span>
    </div>
  );
};

/** b3 — drawn incident card over a dimmed LiveBackdrop of the repo's real Actions runs. */
const IncidentCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B3, B4) !== 1) return null;
  const t = tween(sec(frame, B3 + 6, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 740,
        top: 140,
        width: 460,
        padding: 28,
        borderRadius: 6,
        background: "rgba(16,10,30,0.88)",
        border: `2px solid ${P.danger}`,
        boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: P.danger }}>⏱ OCT 7</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#F5F5F2", marginTop: 8 }}>
        Gemini: 503 Service Unavailable
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, color: "rgba(245,245,242,0.75)", marginTop: 14 }}>
        mid-render — visual-director.js had no backend to call
      </div>
    </div>
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

/** b5 — the result, fully drawn: LogWindow with the real retry path + the clip's one
    tech caption. Holds to END at full brightness, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const captionIn = tween(t, 0.9, 0.3, ease.power2Out);
  const techIn = tween(t, 1.3, 0.3, ease.power2Out);
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
          right: 40,
          top: 14,
          maxWidth: 380,
          textAlign: "right",
          fontSize: 16,
          fontWeight: 700,
          color: "#DCD4F5",
          background: "rgba(10,8,20,0.6)",
          borderRadius: 8,
          padding: "6px 14px",
          opacity: techIn,
          fontFamily,
        }}
      >
        Groq — a second AI service, on standby
      </div>
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
          fontFamily,
        }}
      >
        Every segment still gets its direction — the October 7th gap is closed.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1+b2 — the outage's cost, then the vulnerable pipeline, over the feature's own page (continuous recording, no restart) */}
      {cut(frame, B1, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B3 - B1} push={0.03} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{
          inputs: ["Gemini goes down", "No fallback configured", "Render keeps going anyway"],
          result: "2 segments ship with zero AI direction",
        }}
      />
      <ProductPlate />

      {/* b2 — the vulnerable pipeline (problem), over the same dimmed backdrop */}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.78}
        data={{
          system: "video pipeline",
          steps: ["GitHub Actions run", "visual-director.js", "llm-helper.js", "Gemini (only)"],
          result: "Down = no backup plan",
        }}
      />

      {/* b3+b4 — the October 7th outage, then the fix, over the repo's real Actions runs (continuous recording, no restart) */}
      {cut(frame, B3, B5) === 1 && <LiveBackdrop file={shotsFile} shot="actions" from={B3} hold={B5 - B3} />}
      {cut(frame, B3, B4) === 1 && <AbsoluteFill style={{ background: `rgba(10,8,20,${PLATE})` }} />}
      <IncidentCard />

      {/* b4 — the fix, over the same Actions backdrop, dimmed by its own plate */}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.75}
        data={{
          wrong: "Gemini only — no backup plan",
          right: "Groq steps in automatically",
          label: "NOW",
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
