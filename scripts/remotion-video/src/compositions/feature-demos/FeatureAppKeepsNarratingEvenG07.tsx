// FeatureAppKeepsNarratingEvenG07 — feature g07 — 1280x720, 1057 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar narrative, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A fixed left column (0-320px) carries the product plate and a running claim that
// updates once per beat; the big stage on the right is full-bleed MotionInsert/
// LiveBackdrop, the way the digest stages its effects. The column is the only element
// that survives every beat (archetype 6); the stage swaps content under it.
//
// Beat → effect (data only from the feature row and commits 111c47e / 5414aba):
// b1 15-202   "a story cutting off mid-sentence felt broken"
//             titleTakeover over the feature's own page (backdrop "page").
// b2 202-320  "it kept rambling about places I'd already passed"
//             cornerTags: the gap + four facts, over the page scrolled on.
// b3 320-451  "like a radio that cuts dead mid-song instead of fading out"
//             drawn: the one plain analogy, old vs new, no backdrop.
// b4 451-650  "the Android app pre-downloads stories ahead of time"
//             pipelineFlow: dead zone -> drive pack -> cached audio, over the hub.
//             The one tech name of the clip, with its gloss on the frame.
// b5 650-852  "matched the car's position to the story's sentences"
//             handoffExplain: ignores position -> matches GPS to sentences, over the hub.
// b6 852-1057 "plays start to finish across four kilometers"
//             drawn result only (no live page, per gate 2): a LogWindow built from the
//             feature's own numbers, holding on the 4 km result to the final frame.
//
// Persistent element: the left sidebar column (archetype 6), b1 through b6.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/g07.json";

const B1 = 15;
const B2 = 202;
const B3 = 320;
const B4 = 451;
const B5 = 650;
const B6 = 852;
const END = 1057;

/** Accent tuned for the dark stage (sand's #B4531F is too dark on a plate). */
const ACCENT = "#F08A4B";
const STAGE = "#1C1610";

const SIDEBAR = { x: 0, y: 0, w: 320, h: 720 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** The running claim in the fixed left column — the only element that survives every beat. */
const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  const claims: { at: number; eyebrow: string; line: string }[] = [
    { at: B1, eyebrow: "THE PROBLEM", line: "Stories die in dead zones" },
    { at: B2, eyebrow: "THE GAP", line: "Talks past where I've driven" },
    { at: B3, eyebrow: "LIKE", line: "A radio that cuts dead mid-song" },
    { at: B4, eyebrow: "THE FIX", line: "App pre-downloads stories ahead" },
    { at: B5, eyebrow: "PRECISION", line: "Stops cleanly at my position" },
    { at: B6, eyebrow: "RESULT", line: "4 km of silence, now full narration" },
  ];
  const active = claims.filter((c) => frame >= c.at).pop();

  return (
    <div
      style={{
        position: "absolute",
        left: SIDEBAR.x,
        top: SIDEBAR.y,
        width: SIDEBAR.w,
        height: SIDEBAR.h,
        background: P.card,
        borderRight: `2px solid ${P.border}`,
        boxShadow: "8px 0 24px rgba(0,0,0,0.35)",
        fontFamily,
      }}
    >
      {/* product plate — names the product in one plain line (b1, persists) */}
      <div style={{ position: "absolute", left: 28, top: 40, width: 264 }}>
        <div style={{ fontSize: 40, lineHeight: 1 }}>🎧</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: P.ink, marginTop: 10 }}>Stories on the Road</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 6, lineHeight: 1.35 }}>
          A personal audio guide for driving, in Norwegian and Ukrainian.
        </div>
      </div>

      <div style={{ position: "absolute", left: 28, top: 190, width: 264, height: 1, background: P.border }} />

      {/* the running claim — replaced whole, no crossfade, once per beat */}
      {active &&
        claims.map((c) =>
          c === active ? (
            <Arrive key={c.at} at={c.at + 3} kind="wipe" box={{ x: 28, y: 222, w: 264, h: 110 }} dur={0.35}>
              <div style={{ position: "absolute", left: 28, top: 222, width: 264 }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>{c.eyebrow}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: P.ink, marginTop: 8, lineHeight: 1.3 }}>
                  {c.line}
                </div>
              </div>
            </Arrive>
          ) : null
        )}
    </div>
  );
};

/** b3 — the one plain analogy: a radio that cuts dead vs. one that fades out clean. */
const AnalogyPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;
  const t = Math.max(0, sec(frame, B3 + 6, fps));
  const sc = punchScale(t, 0);
  const stageW = 1280 - SIDEBAR.w;

  const rows: { label: string; tone: "danger" | "success"; cut: boolean; delay: number }[] = [
    { label: "Radio cuts dead mid-song", tone: "danger", cut: true, delay: 24 },
    { label: "This app fades out clean", tone: "success", cut: false, delay: 46 },
  ];

  return (
    <div style={{ position: "absolute", left: SIDEBAR.w, top: 0, width: stageW, height: 720 }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, #241B12, #120D08)` }} />
      <div
        style={{
          position: "absolute",
          left: stageW / 2 - 90,
          top: 90,
          fontSize: 150,
          lineHeight: 1,
          transform: `scale(${sc})`,
          transformOrigin: "center center",
        }}
      >
        📻
      </div>
      {rows.map((r, i) => {
        const at = B3 + r.delay;
        if (frame < at) return null;
        const p = Math.min(1, sec(frame, at, fps) / 0.6);
        const barW = 560;
        const bg = r.tone === "danger" ? P.dangerBg : P.successBg;
        const edge = r.tone === "danger" ? P.dangerEdge : P.successEdge;
        const fillColor = r.tone === "danger" ? P.danger : P.success;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (stageW - barW) / 2,
              top: 360 + i * 130,
              width: barW,
            }}
          >
            <div
              style={{
                width: barW,
                height: 56,
                borderRadius: 4,
                background: bg,
                border: `2px solid ${edge}`,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${p * (r.cut ? 62 : 100)}%`,
                  background: fillColor,
                  opacity: r.cut ? 1 : 1 - p * 0.75,
                  WebkitMaskImage: r.cut ? "none" : "linear-gradient(to right, black 50%, transparent 100%)",
                  maskImage: r.cut ? "none" : "linear-gradient(to right, black 50%, transparent 100%)",
                }}
              />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: P.ink, marginTop: 10 }}>{r.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/** b6 — the result: a LogWindow built from the feature's own numbers, holds to the final frame. */
const ResultPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B6) return null;
  const t = sec(frame, B6 + 10, fps);
  const sc = punchScale(Math.max(0, t), 0);
  const stageW = 1280 - SIDEBAR.w;

  const lines = [
    { t: "drive", text: "GET /api/drive/pack — stories + streets bundled", tone: "muted" as const },
    { t: "sync", text: "Pack refreshed every 10 min while online", tone: "ink" as const },
    { t: "cache", text: "Audio prefetched 8 km ahead", tone: "ink" as const },
    { t: "store", text: "On-device cache: up to 800 MB", tone: "ink" as const },
    { t: "gps", text: "Position checked every 100 m", tone: "muted" as const },
    { t: "zone", text: "Signal lost — 4 km dead zone entered", tone: "danger" as const },
    { t: "play", text: "Narration continues from cache", tone: "success" as const },
    { t: "log", text: "POST /api/drive/played — queued, synced later", tone: "success" as const },
  ];

  return (
    <div style={{ position: "absolute", left: SIDEBAR.w, top: 0, width: stageW, height: 720 }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${P.bgTop}, ${P.bgBottom})` }} />
      <LogWindow
        lines={lines}
        title="drive pack"
        from={B6 + 6}
        every={16}
        opacity={1}
        win={{ x: 60, y: 40, w: 840, h: 420 }}
      />
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 500,
          transform: `scale(${sc})`,
          transformOrigin: "left center",
        }}
      >
        <div style={{ fontSize: 110, fontWeight: 800, color: P.ink, lineHeight: 1 }}>4 km</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: P.accent, marginTop: 4 }}>dead zone, start to finish</div>
      </div>
      {frame >= B6 + 60 && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 650,
            width: 700,
            height: 56,
            borderRadius: 4,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 20px",
            transform: `scale(${punchScale(sec(frame, B6 + 60, fps), 0)})`,
            transformOrigin: "left center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 20 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: P.ink }}>No signal, no silence</div>
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — the human problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Dead Air on the Drive", kicker: "Long dead zones used to cut narration mid-sentence" }}
      />

      {/* b2 — the gap, page scrolled on */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Stories didn't know I'd already driven past",
          tags: ["Signal gone for miles", "Story kept talking past the stop", "No offline cache", "Dead air or stale talk"],
        }}
      />

      {/* b3 — the one plain analogy, drawn only, no backdrop */}
      <AnalogyPanel />

      {/* b4 — how the fix works; the one tech name of the clip, with its gloss */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Phone nears a dead zone", "Android app pre-loads the drive pack", "Audio cached on the device"],
          result: "Narration keeps playing offline",
          system: "Drive pack = bundled stories + streets",
        }}
      />

      {/* b5 — precision: the story now matches the car's own sentence boundaries */}
      {frame >= B5 && frame < B6 && (
        <LiveBackdrop file={shotsFile} shot="hub2" from={B5} hold={B6 - B5} focus={{ x: 0.6, y: 0.4 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B5}
        dur={B6 - B5}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Story ignores my position",
          to: "Story matches GPS to its own sentences",
          points: ["Checked every 100 meters", "Finishes the current sentence", "Stops cleanly, never overlaps"],
        }}
      />

      {/* b6 — the result, drawn only (no live page, gate 2), holds to the final frame */}
      <ResultPanel />

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureAppKeepsNarratingEvenG07: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
