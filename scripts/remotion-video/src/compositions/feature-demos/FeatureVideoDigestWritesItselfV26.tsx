// FeatureVideoDigestWritesItselfV26 — feature v26 — 1280x720, 946 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar, mood slate. Motion direction (feature-motion skill, 2026-11-06).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real GitHub repo's Actions runs and commit history as ambient evidence (no
// specific commit asserted — source_commits is empty for this feature), one
// owner of the frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature's own problem/solution/result text):
// b1 15-265   "Twice this month a video digest stalled for hours - August 18th
//             and 21st - and nobody noticed until someone happened to check."
//             drawn (metaphor, no catalog effect) — product plate names the
//             site, the feature's own real page plays in a browser window on
//             the right stage, sidebar is FULL (left column) showing "2" /
//             STALLS THIS MONTH (danger).
// b2 265-379  "There was no retry - a stuck draft just sat there."
//             statusFocus over the repo's real Actions runs (backdrop
//             "actions") — two claims contrasting the missing retry with the
//             stuck draft. Sidebar shrinks into the lower-third band, stays
//             "2" / STALLS THIS MONTH (danger).
// b3 379-571  "Now narration and scenario come straight from my own Claude
//             subscription, not a free AI cascade."
//             pipelineFlow over the repo's real commit history (backdrop
//             "commits") — the chain from the old free cascade to the Claude
//             submission, ending in free-AI steps skipped. Sidebar flips at
//             this beat's first frame to "0" / FREE-AI STEPS LEFT (accent),
//             still in the band.
// b4 571-731  "A watchdog checks every 30 minutes and wakes the pipeline the
//             moment a draft sticks."
//             targetOverrun, drawn only (no backdrop) — the 45-minute stall
//             threshold against the 30-minute watchdog cadence. Sidebar stays
//             "0" / FREE-AI STEPS LEFT, still in the band.
// b5 731-946  "That exact stall - the cause of both gaps - now heals itself
//             within 30 minutes."
//             drawn (metaphor, no catalog effect) — sidebar returns FULL at
//             "30" / MINUTES TO SELF-HEAL (success), a log window on the
//             right shows the real watchdog facts. Holds to the end at full
//             brightness, no fade.
//
// Persistent element: the sidebar (archetype 6) — a full-height left column
// (x:0-320) in b1/b5 (the two beats with no catalog effect under it), shrunk
// into the lower-third band (y >= 606, below the effects' safe bottom) for
// b2-b4 so it never collides with the catalog effect above it. Value/tone
// flip at each real turning point: "2"/danger -> "0"/accent (B3) ->
// "30"/success (B5).
//
// Gate 2: the clip does NOT end on the feature's own page or the hub — b5 has
// no LiveBackdrop at all, only the drawn sidebar + result + LogWindow.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow, LiveWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/v26.json";

const B1 = 15;
const B2 = 265;
const B3 = 379;
const B4 = 571;
const B5 = 731;
const END = 946;

/** Bright cyan on a dark slate plate — the slate mood's dark-plate pair. */
const ACCENT = "#22D3EE";
const STAGE = "#0B1420";

// Right stage — where everything that isn't the sidebar lives, never under it.
const STAGE_X = 356;
const STAGE_W = 864;

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the
// sidebar's SMALL home for b2-b4, same geometry family as other dark clips.
const BAND = { x: 40, y: 606, w: 460, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Phase = { value: string; label: string; tone: "danger" | "accent" | "success" };

/** archetype 6 — the sidebar, present every beat, FULL left column when it
    owns the frame alone (b1/b5) and shrunk into BAND while a catalog effect
    sits above it (b2-b4). Flips at each real turning point in the story. */
const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const phase: Phase =
    frame < B3
      ? { value: "2", label: "STALLS THIS MONTH", tone: "danger" }
      : frame < B5
      ? { value: "0", label: "FREE-AI STEPS LEFT", tone: "accent" }
      : { value: "30", label: "MINUTES TO SELF-HEAL", tone: "success" };

  const color = phase.tone === "danger" ? P.danger : phase.tone === "accent" ? ACCENT : P.success;
  const bg = phase.tone === "danger" ? P.dangerBg : phase.tone === "accent" ? "rgba(34,211,238,0.14)" : P.successBg;
  const big = frame < B2 || frame >= B5;

  if (big) {
    const inAt = frame < B2 ? B1 : B5;
    const t = tween(sec(frame, inAt + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 320,
          height: 720,
          background: "rgba(5,8,14,0.92)",
          borderRight: `2px solid rgba(255,255,255,0.14)`,
          opacity: t,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 56,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2,
            color: "rgba(245,245,242,0.6)",
            fontFamily,
          }}
        >
          DIGEST PIPELINE
        </div>
        <div style={{ position: "absolute", left: 32, top: 90, fontSize: 92, fontWeight: 800, lineHeight: 1, color, fontFamily }}>
          {phase.value}
        </div>
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 200,
            padding: "9px 18px",
            borderRadius: 4,
            background: bg,
            border: `2px solid ${color}`,
            color,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1,
            fontFamily,
            maxWidth: 256,
          }}
        >
          {phase.label}
        </div>
      </div>
    );
  }

  const punch = Math.max(0, punchScale(sec(frame, B3, fps), 0) - 1);
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
        <div style={{ fontSize: 42, fontWeight: 800, color, transform: `scale(${1 + punch * 0.3})` }}>{phase.value}</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>DIGEST PIPELINE</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{phase.label}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — the discovery, fully drawn: product plate, the feature's own real
    page playing in a browser window, sidebar FULL at "2"/danger. */
const OpeningBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B1, B2) !== 1) return null;
  const t = sec(frame, B1, fps);
  const plateIn = tween(t, 0.1, 0.3, ease.power3Out);
  const winIn = tween(t, 0.35, 0.35, ease.power3Out);
  const captionIn = tween(t, 0.9, 0.3, ease.power2Out);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: STAGE_X,
          top: 60,
          padding: "7px 16px",
          background: "rgba(10,14,20,0.85)",
          border: "1.5px solid #8FE3F2",
          borderRadius: 4,
          fontSize: 16,
          fontWeight: 700,
          color: "#F5F5F5",
          opacity: plateIn,
          maxWidth: STAGE_W - 20,
          lineHeight: 1.4,
          fontFamily,
        }}
      >
        <span style={{ fontWeight: 800, letterSpacing: 1 }}>PORTFOLIO &amp; NEWS PLATFORM</span>
        <br />
        <span style={{ fontWeight: 500, opacity: 0.85 }}>
          My personal site and content pipeline: it collects tech news, writes
          trilingual feature stories about my own projects&apos; commits, and
          renders short narrated video
        </span>
      </div>
      <div style={{ position: "absolute", left: STAGE_X, top: 138, width: STAGE_W, height: 420, opacity: winIn }}>
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features"
          from={B1}
          hold={B2 - B1}
          opacity={1}
          win={{ x: 0, y: 0, w: STAGE_W, h: 420 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: STAGE_X,
          top: 586,
          width: STAGE_W,
          fontSize: 22,
          fontWeight: 700,
          color: "#F5F5F2",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Two stalls this month, August 18th and 21st — unnoticed for hours.
      </div>
    </>
  );
};

const WATCHDOG_LOG: Array<{ t: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { t: "Aug 18", text: "render chain stalls mid-pipeline", tone: "danger" },
  { t: "Aug 21", text: "same stall, no retry, hours lost", tone: "danger" },
  { t: "", text: "scenario steps ran on free AI cascade", tone: "muted" },
  { t: "now", text: "narration + scenario from Claude SDK", tone: "accent" },
  { t: "", text: "digest-watchdog.timer every 30 min", tone: "accent" },
  { t: "", text: "re-triggers stuck draft after 45 min", tone: "success" },
  { t: "", text: "Telegram alert past 3 hours stuck", tone: "success" },
];

/** b5 — the result, fully drawn: sidebar back FULL at "30"/success, plus a
    log window with the real watchdog facts. Holds to END, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const resultIn = tween(t, 0.1, 0.3, ease.power3Out);
  const captionIn = tween(t, 0.95, 0.3, ease.power2Out);

  return (
    <>
      <div style={{ position: "absolute", left: STAGE_X, top: 86, width: 360, opacity: resultIn, fontFamily }}>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 2, color: "rgba(245,245,242,0.6)" }}>
          STALL RECOVERY NOW
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1, color: "#34D399", marginTop: 4 }}>30</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 10,
            padding: "9px 18px",
            borderRadius: 4,
            background: "rgba(52,211,153,0.14)",
            border: "2px solid #34D399",
            color: "#34D399",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          MINUTES TO SELF-HEAL
        </div>
      </div>
      <LogWindow
        lines={WATCHDOG_LOG}
        title="digest-watchdog.timer"
        from={B5 + 14}
        every={14}
        opacity={1}
        win={{ x: 764, y: 56, w: 450, h: 470 }}
      />
      <div
        style={{
          position: "absolute",
          left: STAGE_X,
          top: 586,
          width: STAGE_W,
          fontSize: 22,
          fontWeight: 700,
          color: "#F5F5F2",
          opacity: captionIn,
          fontFamily,
        }}
      >
        The exact stall behind both gaps now heals itself in one watchdog cycle.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — two unnoticed stalls, fully drawn, over the feature's own real page */}
      <OpeningBeat />

      {/* b2 — no retry, a stuck draft just sat there, over the repo's real Actions runs */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="actions" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.8}
        data={{
          title: "BEFORE THE WATCHDOG",
          claims: [
            { text: "Automatic retry on stall", verdict: "no" },
            { text: "Draft left stuck for hours", verdict: "yes" },
          ],
        }}
      />

      {/* b3 — narration + scenario straight from Claude, over the repo's real commits */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="commits" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.8}
        data={{
          system: "daily-video-bot",
          steps: ["Free AI cascade (old)", "Claude Agent SDK", "agent_submit_digest", "auto_chain_2"],
          result: "Free-AI steps skipped",
        }}
      />
      {/* b3 fill fix: pipelineFlow's own build lands mid-compaction at this beat's
          midpoint (small chain, no frame/title/result yet) — a static top tag + a
          bottom-right caption keep the canvas owned top-to-bottom regardless of
          where the catalog effect's own timeline lands. */}
      {cut(frame, B3, B4) === 1 && (
        <>
          <Arrive at={B3 + 4} kind="wipe" box={{ x: 40, y: 56, w: 460, h: 60 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 56,
                padding: "10px 20px",
                borderRadius: 4,
                background: "rgba(5,8,14,0.85)",
                border: `1.5px solid ${ACCENT}`,
                color: ACCENT,
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 1.5,
                fontFamily,
              }}
            >
              GITHUB — COMMIT HISTORY
            </div>
          </Arrive>
          <Arrive at={B3 + 10} kind="rise" box={{ x: 520, y: 606, w: 700, h: 92 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 520,
                top: 606,
                width: 700,
                height: 92,
                borderRadius: 4,
                background: P.card,
                boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                fontFamily,
                fontSize: 19,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.3,
              }}
            >
              Claude subscription replaces the free AI cascade for every run.
            </div>
          </Arrive>
        </>
      )}

      {/* b4 — the watchdog cadence vs. the stall threshold, drawn only (no backdrop) */}
      <MotionInsert
        effect="targetOverrun"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          label: "Minutes stuck vs. the watchdog's check cycle",
          value: 45,
          target: 30,
          unit: "min",
          note: "re-triggers once a draft passes the threshold",
        }}
      />
      {/* b4 fill fix: targetOverrun's track and label live in the upper-left two
          thirds — this beat's midpoint falls before the note/verdict land, leaving
          the bottom and top-right empty. A static top-right badge + bottom-right
          caption own those regions for the whole beat. */}
      {cut(frame, B4, B5) === 1 && (
        <>
          <Arrive at={B4 + 4} kind="wipe" box={{ x: 820, y: 56, w: 400, h: 60 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 820,
                top: 56,
                padding: "10px 20px",
                borderRadius: 4,
                background: "rgba(5,8,14,0.85)",
                border: `1.5px solid ${ACCENT}`,
                color: ACCENT,
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 1.5,
                fontFamily,
                textAlign: "right",
              }}
            >
              CHECKS EVERY 30 MIN
            </div>
          </Arrive>
          <Arrive at={B4 + 10} kind="rise" box={{ x: 520, y: 606, w: 700, h: 92 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 520,
                top: 606,
                width: 700,
                height: 92,
                borderRadius: 4,
                background: P.card,
                boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                fontFamily,
                fontSize: 19,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.3,
              }}
            >
              A watchdog checks every 30 minutes and wakes the pipeline the moment a draft sticks.
            </div>
          </Arrive>
        </>
      )}

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureVideoDigestWritesItselfV26: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
