// FeatureAnyPhoneBecomesDrawingB57 — feature b57 — 1280x720, 873 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar narrative, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
// RE-SHOOT (2026-10-29): narration/beat windows unchanged; picture rewritten after the
// viewer verdict (waveD1-20261023-2300-b57.done) flagged unrelated-product text bleeding
// through the "hub" backdrop and a frozen b5 ending.
//
// A fixed left column (0-320px) carries the product plate and a running claim that
// updates once per beat; the big stage on the right is full-bleed MotionInsert/LiveBackdrop.
// The column is the only element that survives every beat (archetype 6); the stage swaps
// content under it.
//
// Fix vs the previous pass: every live beat now scrolls the feature's OWN article page
// only (never the features hub, which carried other projects' headlines into frame), and
// the backdrop plate is raised to 0.82 so the real page's own background text (Durable
// Object, wrangler.toml, etc.) never competes with the drawn caption.
//
// Beat -> effect (data only from the feature row and commit 6e708ac):
// b1 15-170   "my kids wanted to draw with a real tablet, not squint at a tiny screen" —
//             keywordCaption over the feature's own page top (backdrop "top"). Opener is
//             NOT titleTakeover (m23/d15/d14 and the previous b57 pass all opened with it).
// b2 170-324  "the tablet plugs into a phone, but nothing reached the TV in real time" —
//             cornerTags: the gap + four facts, over the page scrolled to the problem text
//             (backdrop "problem").
// b3 324-517  "so phone and TV now talk directly, over WebRTC — like a wire across the room" —
//             pipelineFlow: capture -> WebRTC link -> mirror, over the page's fix section
//             (backdrop "fix"). The one tech name of the clip, with its gloss on the frame.
// b4 517-678  "every stroke streams live, with a backup relay if the link drops" —
//             handoffExplain: direct link -> server relay, over the page's result section
//             (backdrop "result").
// b5 678-873  "now the kids draw with a real tablet on the big screen — for a $30 pen" —
//             drawn result only (no live page, per gate 2): a $30 hero figure and three
//             delivered chips staggered across the whole beat so the ending holds alive,
//             not frozen, through the final frame.
//
// Persistent element: the left sidebar column (archetype 6), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b57.json";

const B1 = 15;
const B2 = 170;
const B3 = 324;
const B4 = 517;
const B5 = 678;
const END = 873;

/** Accent tuned for the dark stage (sand's #B4531F is too dark on a plate). */
const ACCENT = "#F08A4B";
const STAGE = "#1C1610";
/** Raised from the default 0.66 so the real page's own background text never competes. */
const PLATE = 0.82;

const SIDEBAR = { x: 0, y: 0, w: 320, h: 720 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** The running claim in the fixed left column — the only element that survives every beat. */
const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  const claims: { at: number; eyebrow: string; line: string }[] = [
    { at: B1, eyebrow: "THE ASK", line: "A real tablet, not a phone" },
    { at: B2, eyebrow: "THE GAP", line: "No link to the TV" },
    { at: B3, eyebrow: "THE FIX", line: "WebRTC links phone <-> TV" },
    { at: B4, eyebrow: "BACKUP", line: "Relay takes over if it drops" },
    { at: B5, eyebrow: "RESULT", line: "$30 tablet, real TV canvas" },
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
        <div style={{ fontSize: 40, lineHeight: 1 }}>🎨</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: P.ink, marginTop: 10 }}>Boytasks</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 6, lineHeight: 1.35 }}>
          Earn YouTube time by finishing tasks first.
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

/** b5 — the drawn result: no live page (gate 2), holds to the final frame. */
const ResultPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;
  const t = sec(frame, B5 + 10, fps);
  const sc = punchScale(Math.max(0, t), 0);

  return (
    <div style={{ position: "absolute", left: SIDEBAR.w, top: 0, width: 1280 - SIDEBAR.w, height: 720 }}>
      <AbsoluteFill style={{ background: `linear-gradient(135deg, ${P.bgTop}, ${P.bgBottom})` }} />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 130,
          transform: `scale(${sc})`,
          transformOrigin: "left center",
        }}
      >
        <div style={{ fontSize: 220, fontWeight: 800, color: P.ink, lineHeight: 1 }}>$30</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: P.accent, marginTop: 4 }}>pen, real TV canvas</div>
      </div>
      {[
        { label: "Direct WebRTC link", delay: 50 },
        { label: "Backup relay if it drops", delay: 85 },
        { label: "Works with any phone at home", delay: 125 },
      ].map((chip, i) => {
        const at = B5 + chip.delay;
        if (frame < at) return null;
        const s = punchScale(sec(frame, at, fps), 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 90,
              top: 400 + i * 68,
              width: 650,
              height: 56,
              borderRadius: 4,
              background: P.successBg,
              border: `2px solid ${P.successEdge}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 20px",
              transform: `scale(${s})`,
              transformOrigin: "left center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 20 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: P.ink }}>{chip.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — the human problem, over the feature's own page top */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="top" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={PLATE}
        data={{
          line1: "My kids wanted to draw with a real tablet",
          line2: "not squint at a tiny phone screen",
          keywords: ["tablet"],
        }}
      />

      {/* b2 — the gap, page scrolled to the problem text */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="problem" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={PLATE}
        data={{
          statement: "No link from phone to TV",
          tags: ["Tablet -> phone only", "Pen stuck on phone", "TV in another room", "No live link"],
        }}
      />

      {/* b3 — how the fix works; the one tech name of the clip, with its gloss */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="fix" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={PLATE}
        data={{
          steps: ["Phone captures stroke", "WebRTC links the TV", "Canvas mirrors live"],
          result: "Draws appear instantly",
          system: "WebRTC = direct peer link",
        }}
      />

      {/* b4 — the fallback: direct link hands off to a server relay */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="result" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={PLATE}
        data={{
          from: "Direct WebRTC link",
          to: "Server relay takes over",
          points: ["Strokes keep streaming", "Switches automatically", "Drawing never stops"],
        }}
      />

      {/* b5 — the result, drawn only (no live page, gate 2), holds to the final frame */}
      <ResultPanel />

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureAnyPhoneBecomesDrawingB57: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
