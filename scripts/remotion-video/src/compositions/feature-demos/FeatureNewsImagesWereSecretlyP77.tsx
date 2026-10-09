// FeatureNewsImagesWereSecretlyP77 — feature p77 — 1280x720, 797 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real GitHub repo's history and the feature's own live page as evidence where
// there is one, one owner of the frame, a reading hold at the end of every beat,
// cuts not fades.
//
// Beat → effect (data only from the feature's own problem/solution/result text):
// b1 15-165   "My image generator was quietly failing for over ten days, and I
//             never knew."
//             drawn (metaphor, no catalog effect) — product plate names the
//             site, the feature's own real page plays in a browser window on
//             the right stage, sidebar is FULL (left column) showing "10+" /
//             DAYS UNNOTICED (danger).
// b2 165-324  "The free provider kept getting rejected — but a paid backup
//             silently covered for it."
//             cornerTags over the repo's real commit history (backdrop
//             "commits") — the claim plus four facts of the silent failure.
//             Sidebar shrinks into the lower-third band, now "0" / FREE
//             SUCCESSES (danger).
// b3 324-442  "So the site looked fine while a hidden bill kept running
//             underneath."
//             statusFocus over the repo's real Actions runs (backdrop
//             "actions") — three claims contrasting what visitors saw with
//             what was actually true. Sidebar stays "0" / FREE SUCCESSES.
// b4 442-615  "I fixed the real bug in Cloudflare's request shape, then
//             deleted every paid fallback."
//             handoffExplain, drawn only (no backdrop) — before/now hand-off
//             from "free path broken + paid fallback" to "free path fixed,
//             zero fallback". Sidebar flips to "-1,060" / LINES DELETED at
//             this beat's first frame, still in the band.
// b5 615-797  "Now if the free path breaks, I see it right away — not ten
//             days later."
//             drawn (metaphor, no catalog effect) — sidebar returns FULL at
//             "1" / FREE PATH ONLY (success), a log window on the right shows
//             the real before/after facts. Holds to the end at full
//             brightness, no fade.
//
// Persistent element: the sidebar (archetype 6) — a full-height left column
// (x:0-320) in b1/b5 (the two beats with no catalog effect under it), shrunk
// into the lower-third band (y >= 606, below the effects' safe bottom) for
// b2-b4 so it never collides with the catalog effect above it. Value/tone
// flip at each real turning point: "10+"/danger -> "0"/danger (B2) ->
// "-1,060"/accent (B4) -> "1"/success (B5).
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
import shotsFile from "./shots/p77.json";

const B1 = 15;
const B2 = 165;
const B3 = 324;
const B4 = 442;
const B5 = 615;
const END = 797;

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
    frame < B2
      ? { value: "10+", label: "DAYS UNNOTICED", tone: "danger" }
      : frame < B4
      ? { value: "0", label: "FREE SUCCESSES", tone: "danger" }
      : frame < B5
      ? { value: "-1,060", label: "LINES DELETED", tone: "accent" }
      : { value: "1", label: "FREE PATH ONLY", tone: "success" };

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
          IMAGE PROVIDER
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

  const flipAt = frame < B4 ? B2 : B4;
  const punch = Math.max(0, punchScale(sec(frame, flipAt, fps), 0) - 1);
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
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>IMAGE PROVIDER</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{phase.label}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — the discovery, fully drawn: product plate, the feature's own real
    page playing in a browser window, sidebar FULL at "10+"/danger. */
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
          my personal site &amp; content pipeline — collects tech news, writes trilingual
          feature stories about my own commits, and renders short narrated video
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
        Ten days of image generations, and every one of them billed — silently.
      </div>
    </>
  );
};

const FACTS_LOG: Array<{ t: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { t: "Aug 19", text: "Cloudflare starts rejecting width/height", tone: "danger" },
  { t: "", text: "FLUX requests: 0 succeeding", tone: "danger" },
  { t: "", text: "paid fallback silently covers every image", tone: "muted" },
  { t: "10+ days", text: "unnoticed — the bill kept rising", tone: "danger" },
  { t: "now", text: "process-image: request shape fixed", tone: "accent" },
  { t: "", text: "paid fallback chain deleted", tone: "accent" },
  { t: "", text: "-1,060 lines from process-image", tone: "success" },
  { t: "", text: "free path only — visible if it breaks", tone: "success" },
];

/** b5 — the result, fully drawn: sidebar back FULL at "1"/success, plus a
    log window with the real before/after facts. Holds to END, no fade. */
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
          IMAGE PROVIDERS NOW
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1, color: "#34D399", marginTop: 4 }}>1</div>
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
          FREE PATH ONLY
        </div>
      </div>
      <LogWindow
        lines={FACTS_LOG}
        title="process-image"
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
        No paid fallback left to hide behind — a broken request shows up today.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the quiet failure, fully drawn, over the feature's own real page */}
      <OpeningBeat />

      {/* b2 — the free path rejected, paid backup covering, over the repo's real commits */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="commits" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.8}
        data={{
          statement: "Free image path silently failing",
          tags: ["Cloudflare FLUX: 0%", "HTTP 400 since Aug 19", "Paid backup covered it", "10+ days unnoticed"],
        }}
      />

      {/* b3 — looks fine vs. the hidden bill, over the repo's real Actions runs */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="actions" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.8}
        data={{
          title: "WHAT WAS REALLY HAPPENING",
          claims: [
            { text: "Images looked fine to visitors", verdict: "yes" },
            { text: "Free provider was working", verdict: "no" },
            { text: "A paid bill was quietly running", verdict: "yes" },
          ],
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
          from: "Free path broken + paid fallback",
          to: "Free path fixed, zero fallback",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: [
            "Fixed Cloudflare request shape in process-image",
            "Deleted the entire paid fallback chain",
            "Removed billed critic + photo-edit steps",
            "1,060 lines removed from one function",
          ],
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureNewsImagesWereSecretlyP77: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
