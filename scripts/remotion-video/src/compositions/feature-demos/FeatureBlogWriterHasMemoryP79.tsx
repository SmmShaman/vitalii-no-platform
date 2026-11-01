// FeatureBlogWriterHasMemoryP79 — feature p79 — 1280x720, 878 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood violet. Motion direction v2 (feature-motion skill).
//
// Portfolio & News Platform's own Telegram blog bot used to publish a dictated voice
// note the instant it arrived — no memory, no check, so it guessed at details or
// forgot things said on another day. The "author brain" now reads the user's own
// notes and project list first, asks when something is missing, and saves a draft
// instead of auto-publishing. Three input paths (voice note, text chat, manual edit)
// all funnel through that same check before Publish / Edit / Cancel.
//
// No commit diff is shown: the only commit whose message matches this story
// (7192ce3, "author brain for /blog posts") is not among tonight's verified URLs;
// the two verified commits (7d81dde, 73ce018) are unrelated to this feature. Per
// the brief's own rule, the mechanism is drawn instead of shown as a live recording.
//
// Beat → effect (data only from the feature row):
// b1 15-172   "I used to dictate a blog post into Telegram and it published itself"
//             cornerTags, drawn — the old behavior, stated as a claim + facts.
// b2 172-341  "The writer was guessing — inventing details, or forgetting things"
//             statusFocus, drawn — three "no" verdicts against the old writer.
// b3 341-500  "Now it reads my own notes and my project list first"
//             pipelineFlow over the feature's own live page (shot "page").
// b4 500-654  "If something's missing, it asks — and saves a draft instead"
//             handoffExplain, drawn — publish-first vs ask-then-draft.
// b5 654-878  "Publish, Edit or Cancel — three ways of writing all go through
//             that same check" — hubRouting, drawn — no feature page or hub
//             on the last beat (gate 2).
//
// Persistent element: a split-duel (archetype 0) — a left OLD column and a right
// NEW column, each a running list of facts revealed beat by beat. At the b5
// climax the OLD column collapses to a struck "RETIRED" stamp and the NEW column
// collapses to a punch-scaled "SAME CHECK" stamp, echoing the hubRouting content
// playing center-stage so the archetype carries the result rather than sitting
// static beside it.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p79.json";

const B1 = 15;
const B2 = 172;
const B3 = 341;
const B4 = 500;
const B5 = 654;
const END = 878;

const ACCENT = "#B98BDE";
const STAGE = "#1C1424";

const OLD_BOX = { x: 20, y: 60, w: 170, h: 600 };
const NEW_BOX = { x: 1090, y: 60, w: 170, h: 600 };

const OLD_FACTS = [
  { text: "Auto-publish", at: B1 + 10 },
  { text: "No memory of notes", at: B1 + 40 },
  { text: "Guessed, invented details", at: B2 + 20 },
];

const NEW_FACTS = [
  { text: "Reads my notes first", at: B3 + 20 },
  { text: "Checks the project list", at: B3 + 70 },
  { text: "Asks if something's missing", at: B4 + 20 },
  { text: "Saves a draft, not live", at: B4 + 70 },
];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Duel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const climax = frame >= B5;
  const stampFlip = punchScale(sec(frame, B5, fps), 0);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={OLD_BOX} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: OLD_BOX.x,
            top: OLD_BOX.y,
            width: OLD_BOX.w,
            height: OLD_BOX.h,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            borderRadius: 4,
            boxSizing: "border-box",
            padding: "16px 12px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.danger }}>OLD WRITER</div>
          {!climax &&
            OLD_FACTS.filter((f) => frame >= f.at).map((f, i) => (
              <div key={f.text} style={{ fontSize: 13, fontWeight: 700, color: P.ink, marginTop: i === 0 ? 14 : 10 }}>
                • {f.text}
              </div>
            ))}
          {climax && (
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 260,
                width: OLD_BOX.w - 20,
                textAlign: "center",
                fontSize: 17,
                fontWeight: 800,
                color: P.danger,
                textDecoration: "line-through",
                transform: `scale(${stampFlip})`,
              }}
            >
              RETIRED
            </div>
          )}
        </div>
      </Arrive>

      <Arrive at={B1 + 10} kind="wipe" box={NEW_BOX} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: NEW_BOX.x,
            top: NEW_BOX.y,
            width: NEW_BOX.w,
            height: NEW_BOX.h,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            borderRadius: 4,
            boxSizing: "border-box",
            padding: "16px 12px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.success }}>AUTHOR BRAIN</div>
          {!climax &&
            NEW_FACTS.filter((f) => frame >= f.at).map((f, i) => (
              <div key={f.text} style={{ fontSize: 13, fontWeight: 700, color: P.ink, marginTop: i === 0 ? 14 : 10 }}>
                ✓ {f.text}
              </div>
            ))}
          {climax && (
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 240,
                width: NEW_BOX.w - 20,
                textAlign: "center",
                fontSize: 16,
                fontWeight: 800,
                color: P.success,
                transform: `scale(${stampFlip})`,
              }}
            >
              SAME CHECK
              <div style={{ fontSize: 12, fontWeight: 700, color: P.ink, marginTop: 6 }}>every time</div>
            </div>
          )}
        </div>
      </Arrive>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the old behavior, drawn */}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "One voice note, instant publish",
          tags: ["No memory", "No check", "Published immediately"],
        }}
      />

      {/* b2 — the old writer under scrutiny, drawn */}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          title: "The old writer",
          claims: [
            { text: "Remembers earlier notes", verdict: "no" },
            { text: "Checks my project list", verdict: "no" },
            { text: "Confirms facts first", verdict: "no" },
          ],
        }}
      />

      {/* b3 — the fix, over the feature's own live page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["My notes", "Project list", "Draft"],
          result: "Checked before writing",
          system: "author-brain 🧠",
        }}
      />

      {/* b4 — publish-first vs ask-then-draft, drawn */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          from: "Publishes right away",
          to: "Asks, then drafts",
          points: ["Missing detail -> a question", "Draft saved, not published", "Safer by default"],
        }}
      />

      {/* b5 — the result, drawn (no feature page or hub on the last beat) */}
      <MotionInsert
        effect="hubRouting"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        data={{
          inputs: ["Voice note", "Text chat", "Manual edit"],
          hub: "Same check",
          output: "Publish, Edit or Cancel",
        }}
      />

      <Duel />
    </AbsoluteFill>
  );
};

export const FeatureBlogWriterHasMemoryP79: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
