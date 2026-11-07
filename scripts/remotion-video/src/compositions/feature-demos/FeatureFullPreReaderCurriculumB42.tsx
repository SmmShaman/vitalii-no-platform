// FeatureFullPreReaderCurriculumB42 — feature b42 — 1280x720, 898 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real Boytasks feature page/hub as evidence where available, one owner of the
// frame, a reading hold at the end of every beat, cuts not fades (cut()).
//
// Beat -> effect (data only from the feature row — no commits exist for b42):
// b1 15-200   "a toddler and a first-grader can't read — and the voice called S
//             'ess,' not its real sound"
//             cornerTags: the claim + three facts, over the feature's own page
//             (backdrop "page1"). Names the product in a small plate. Split-duel
//             band opens on the chaos side.
// b2 200-354  "lessons made for readers confused them, or skipped teaching and
//             jumped to the test"
//             keywordCaption over the feature's own page, continued (backdrop
//             "page1b" — was "hub1", an unrelated hub page, fixed Wave D); the
//             confusion words land highlighted.
// b3 354-517  "now every letter comes from a local lesson that teaches first —
//             like a patient tutor"
//             pipelineFlow (local lesson bank -> teach first -> guided try ->
//             practice) over the page's description (backdrop "page2").
// b4 517-685  "built in React, it speaks each letter's real sound and tracks
//             progress on its own"
//             copyCorrection: the wrong glyph name corrected to the real sound,
//             over the page's description (backdrop "page3").
// b5 685-898  "the older boy's bonus round went from nothing to working, and the
//             younger one's lessons grew to eight"
//             drawn LogWindow, 6 real lines from the feature's own numbers,
//             holds to the end.
//
// Persistent element: split-duel band (archetype 0) — a chaos-left / order-right
// divider that lives at y>=606, b1 through b5, sliding continuously right as the
// narration moves from problem to fix; left label mutes and shrinks, right label
// solidifies and grows to fill the band by the final beat.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b42.json";

const B1 = 15;
const B2 = 200;
const B3 = 354;
const B4 = 517;
const B5 = 685;
const END = 898;

const ACCENT = "#B45309";
const STAGE = "#1C140B";

const BAND = { x: 40, y: 606, w: 1200, h: 92 };

const SplitDuel: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const t = Math.min(1, Math.max(0, (frame - B1) / (END - B1)));
  const eT = ease.power3InOut(t);
  const dividerX = mix(eT, BAND.x + 150, BAND.x + BAND.w - 150);
  const leftW = dividerX - BAND.x;
  const rightW = BAND.x + BAND.w - dividerX;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: BAND.x,
          top: BAND.y,
          width: leftW,
          height: BAND.h,
          borderRadius: 4,
          border: `2px dashed ${P.muted}`,
          background: P.chipBg,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: mix(eT, 1, 0.35),
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.2, color: P.muted, textAlign: "center", padding: "0 8px" }}>
          GUESSES THE SOUND
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: dividerX - 2,
          top: BAND.y,
          width: 4,
          height: BAND.h,
          background: ACCENT,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: dividerX,
          top: BAND.y,
          width: rightW,
          height: BAND.h,
          borderRadius: 4,
          border: `2px solid ${ACCENT}`,
          background: P.accentBg,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.2, color: ACCENT, textAlign: "center", padding: "0 8px" }}>
          TEACHES FIRST
        </span>
      </div>
    </div>
  );
};

const ProductPlate: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const t = (frame - from) / fps;
  const inAmt = Math.min(1, Math.max(0, t / 0.3));
  if (frame < from || frame >= from + dur) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 36,
        width: 920,
        padding: "8px 14px",
        borderRadius: 6,
        background: "rgba(0,0,0,0.55)",
        border: `1px solid ${P.border}`,
        opacity: inAmt,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.35 }}>
        Boytasks — a screen-time and task system for three kids: YouTube is gated by finishing
        school and chore tasks first, run on Cloudflare Workers. No LLM — lessons generate locally.
      </span>
    </div>
  );
};

// b4's copyCorrection has no slot for a tech gloss, so "React" and "tracks
// progress" (named in the narration) got no on-screen evidence — added Wave D.
const TechGloss: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (!(cut(frame, B4, B5) === 1)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 36,
        width: 760,
        padding: "8px 14px",
        borderRadius: 6,
        background: "rgba(0,0,0,0.55)",
        border: `1px solid ${P.border}`,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
        ⚛ Built in React — each session auto-saves progress, no server round-trip
      </span>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — two non-readers, the voice names the glyph instead of the sound */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page1" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "The voice said \"ess\" — not the sound a child needs",
          tags: ["Toddler + 1st grader", "Can't read yet", "Wrong letter sound"],
        }}
      />
      <ProductPlate from={B1} dur={B2 - B1} />

      {/* b2 — lessons built for readers confused them, or skipped straight to the test */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page1b" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "Lessons made for readers confused them",
          line2: "or skipped teaching and jumped to the test",
          keywords: ["confused", "skipped", "jumped", "test"],
        }}
      />

      {/* b3 — every letter now comes from a local lesson that teaches first */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Local lesson bank", "Teach first", "Guided try", "Practice"],
          result: "Teaches before it tests",
          // PipelineFlow clips "system" to 22 chars for its title — the old string
          // "Boytasks — on-device, React" was silently truncated before "React"
          // ever rendered (Wave D fix: the viewer never saw the tech name).
          system: "Boytasks — React app",
        }}
      />

      {/* b4 — built in React, every letter speaks its real sound */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          label: "Phoneme map",
          wrong: "S -> \"ess\"",
          right: "S -> \"sss\" — the real sound",
        }}
      />
      <TechGloss />

      {/* b5 — the result: bonus round built, lessons grew to eight, holds to the end */}
      {frame >= B5 && (
        <LogWindow
          title="lesson_engine"
          from={B5}
          every={24}
          opacity={1}
          win={{ x: 150, y: 110, w: 980, h: 480 }}
          fontSize={22}
          lines={[
            { t: "07:00", text: "lesson_engine: grade <= 2 -> generate from local banks (no AI call)", tone: "accent" },
            { t: "07:00", text: "letter progression: 26 letters, phoneme map forces real sound", tone: "success" },
            { t: "07:00", text: "mastery loop: consecutive correct tracked per skill, items retire", tone: "success" },
            { t: "07:00", text: "older boy: tier-2 bonus round 0 -> 1 (built locally)", tone: "accent" },
            { t: "07:00", text: "younger boy: lesson count 4 -> 8", tone: "success" },
            { t: "07:00", text: "admin preview: both sessions regenerated, teach-first confirmed", tone: "muted" },
          ]}
        />
      )}

      <SplitDuel />
    </AbsoluteFill>
  );
};

export const FeatureFullPreReaderCurriculumB42: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
