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
// WAVE D fix (2026-11-01): no commit diff / LiveWindow recording is shown — the
// only commit whose message matches this story (7192ce3, "author brain for
// /blog posts") is not among the verified recording URLs, so a new recording
// cannot be made this pass. Instead the mechanism is drawn, PLUS the real
// commit facts are shown verbatim in a drawn terminal (LogWindow, b3) and a
// named product + Telegram plate (b1) replaces the unnamed-product problem.
//
// Beat → effect (data only from the feature row):
// b1 15-172   "I used to dictate a blog post into Telegram and it published itself"
//             cornerTags, drawn — the old behavior, stated as a claim + facts.
//             + ProductTag: names the product and shows a Telegram glyph (the
//             spoken word "Telegram" was never pictured before this fix).
// b2 172-341  "The writer was guessing — inventing details, or forgetting things"
//             statusFocus, drawn — three "no" verdicts against the old writer.
//             + GuessExample: one concrete illustrative guess, not a recaption.
// b3 341-500  "Now it reads my own notes and my project list first"
//             pipelineFlow + LogWindow showing commit 7192ce3's real hash,
//             message and changed files — replaces the generic article-style
//             LiveBackdrop mockup that read as someone else's blog coverage.
// b4 500-654  "If something's missing, it asks — and saves a draft instead"
//             handoffExplain, drawn — publish-first vs ask-then-draft.
//             + AskExample: one concrete question the bot would actually ask.
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
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive } from "./motion-primitives";
import { LogWindow, LogLine } from "./live-primitives";
import { punchScale } from "../../components/effects/motion/grammar";

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

/** Duel-occlusion fix: every catalog effect anchors its text at safeX / width-safeX,
 * which lands inside the OLD_BOX / NEW_BOX columns (x:20-190, x:1090-1260) and gets
 * covered by their opaque panels. Scales + shifts a MotionInsert into the 190-1090
 * gap between the columns so nothing it draws ends up hidden behind the duel. */
const CENTER_LEFT = OLD_BOX.x + OLD_BOX.w;
const CENTER_W = NEW_BOX.x - CENTER_LEFT;
const CENTER_SCALE = CENTER_W / 1280;
const CenterStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: CENTER_LEFT,
      top: (720 - 720 * CENTER_SCALE) / 2,
      width: CENTER_W,
      height: 720 * CENTER_SCALE,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `scale(${CENTER_SCALE})`, transformOrigin: "0 0" }}>
      {children}
    </div>
  </div>
);

const fadeIn = (frame: number, at: number, dur = 10) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** A real "send" glyph standing in for Telegram — the spoken word "Telegram" (b1
 * line 1) was never pictured before this fix (viewer problem #2). */
const TelegramGlyph: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="12" fill="#229ED9" />
    <path
      d="M6 12.2l12.4-5.1c.7-.3 1.3.2 1 1l-2.3 10.3c-.2.8-.8 1-1.4.5l-3.4-2.6-1.8 1.7c-.3.3-.6.2-.6-.2l.3-3 7-6.5c.3-.3-.1-.4-.4-.2l-8.6 5.5-3.6-1.1c-.7-.2-.7-.9.4-1.3z"
      fill="#fff"
    />
  </svg>
);

/** Fix for problems 1+2: the product is never named, and "Telegram" is spoken
 * but never shown. One-line plate in the global top strip (real y 8-52), free
 * of the Duel columns in every beat — shown only while b1's claim is on screen. */
const ProductPlate: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const a = fadeIn(frame, from);
  return (
    <div
      style={{
        position: "absolute",
        left: 190,
        top: 8,
        width: 900,
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 18px",
        background: "#1F1526",
        border: "1px solid #3A2A44",
        borderRadius: 8,
        opacity: a,
        fontFamily,
      }}
    >
      <TelegramGlyph size={22} />
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.4, color: "#F5F5F2" }}>PORTFOLIO &amp; NEWS PLATFORM</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>Telegram blog bot</div>
    </div>
  );
};

/** Fix for problem 3 (half): b2 only recaptioned the narration as a checklist.
 * One concrete, clearly-labelled illustrative example of a guess — not a new
 * product fact, just a picture of the failure mode the line already states. */
const GuessExample: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const a = fadeIn(frame, from);
  return (
    <div
      style={{
        position: "absolute",
        left: 230,
        top: 14,
        width: 820,
        height: 118,
        borderRadius: 8,
        background: "#1F1526",
        border: "1px solid #3A2A44",
        opacity: a,
        padding: "14px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: ACCENT }}>EXAMPLE, ONE NIGHT</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F2" }}>
        "Pushed the pricing page" — no date, no project named
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#E0847A" }}>Old writer guessed: published it under last week's project</div>
    </div>
  );
};

/** Fix for problem 4: b3's background was a generic blog/news mockup, not this
 * product. Replaces it with the real commit that built this feature, shown
 * verbatim in a drawn terminal (no recording exists for this commit yet). */
const BRAIN_COMMIT_LINES: LogLine[] = [
  { t: "commit", text: "7192ce3", tone: "accent" },
  { text: "feat(blog): author brain for /blog posts", tone: "success" },
  { text: "drafts before publishing, never auto-publishes", tone: "ink" },
  { t: "M", text: "supabase/functions/_shared/author-brain.ts", tone: "muted" },
  { t: "M", text: "supabase/functions/process-voice-blog/index.ts", tone: "muted" },
  { t: "M", text: "supabase/functions/telegram-webhook/index.ts", tone: "muted" },
  { t: "A", text: "supabase/migrations/20261024170000_author_brain.sql", tone: "muted" },
  { t: "A", text: "scripts/vps/brain-add.sh", tone: "muted" },
];

/** Fix for problem 3 (other half): b4 only recaptioned "asks a question" as a
 * bullet. One concrete example of the actual question the bot would ask. */
const AskExample: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const a = fadeIn(frame, from);
  return (
    <div
      style={{
        position: "absolute",
        left: 230,
        top: 490,
        width: 820,
        height: 110,
        borderRadius: 8,
        background: "#1F1526",
        border: "1px solid #3A2A44",
        opacity: a,
        padding: "14px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: ACCENT }}>EXAMPLE QUESTION</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F2" }}>"Which project is this for — vitalii.no or Jobbot?"</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#8FD9A8" }}>Draft saved, waits for my reply before publishing</div>
    </div>
  );
};

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
      <CenterStage>
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
      </CenterStage>
      <ProductPlate from={B1 + 6} to={B2} />

      {/* b2 — the old writer under scrutiny, drawn */}
      <CenterStage>
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
      </CenterStage>
      <GuessExample from={B2 + 10} to={B3} />

      {/* b3 — the fix, evidenced by the real commit that built it */}
      <LogWindow
        lines={BRAIN_COMMIT_LINES}
        title="git log --oneline"
        from={B3 + 10}
        every={16}
        opacity={frame >= B3 && frame < B4 ? 1 : 0}
        win={{ x: 200, y: 14, w: 880, h: 226 }}
        fontSize={20}
      />
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
      <CenterStage>
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
      </CenterStage>
      <AskExample from={B4 + 10} to={B5} />

      {/* b5 — the result, drawn (no feature page or hub on the last beat) */}
      <CenterStage>
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
      </CenterStage>

      <Duel />
    </AbsoluteFill>
  );
};

export const FeatureBlogWriterHasMemoryP79: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
