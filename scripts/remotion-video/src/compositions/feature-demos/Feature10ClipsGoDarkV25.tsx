// Feature10ClipsGoDarkV25 — feature v25 — 1280x720, 874 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood sand. Motion direction (feature-motion skill, 2026-11-06).
//
// One editorial effect per spoken sentence, chosen by what changes on screen, over
// the real features hub, commit history and Actions runs as ambient evidence (no
// specific commit asserted), one owner of the frame, a reading hold at the end of
// every beat, cuts not fades.
//
// Beat → effect (data only from the feature's own problem/solution/result text):
// b1 15-207   "Ten of my oldest feature videos still looked like a dark computer
//             terminal while the rest of the site had moved on."
//             drawn (metaphor, no catalog effect) — product plate names the site,
//             the feature's own real page plays in a browser window, ledger is
//             FULL (left column): one red receipt line "10 clips ... DARK", total
//             "10 BEHIND".
// b2 207-369  "A new visual style only proves itself on real content, not a
//             single demo."
//             copyCorrection over the real features hub (backdrop "hub") — the
//             corrected belief: one demo vs. ten real published clips. Ledger
//             shrinks into the lower-third band, stays "10" / CLIPS BEHIND.
// b3 369-491  "So Claude rewrote all ten clips in one parallel batch."
//             pipelineFlow over the repo's real commit history (backdrop
//             "commits") — the chain from 10 old clips through parallel
//             subagents to 10 rewritten clips. Ledger flips at this beat's
//             first frame to "10" / CLIPS REWRITTEN (accent), still in the band.
// b4 491-649  "Each was re-rendered and uploaded back to its exact old link, so
//             nothing broke."
//             statusFocus over the repo's real Actions runs (backdrop "actions")
//             — two claims: the storage key did not change, the old links still
//             resolve. Ledger stays in the band, flips to "0" / BROKEN LINKS.
// b5 649-874  "Now every clip gets a second run too - one a day for ten days,
//             instead of all at once."
//             drawn (metaphor, no catalog effect) — ledger returns FULL: the old
//             "10 BEHIND" total struck through small, a new line for the repost
//             schedule, big total "10 DONE". Holds to the end at full brightness,
//             no fade.
//
// Persistent element: the ledger (archetype 5) — a full-height left receipt
// column (x:0-340) in b1/b5 (the two beats with no catalog effect under it),
// shrunk into the lower-third band (y >= 606, below the effects' safe bottom) for
// b2-b4 so it never collides with the catalog effect above it. The receipt grows
// a line every beat and flips red->green at the real turning point (B3), exactly
// the "ledger rewritten in green with the total struck through" archetype.
//
// Gate 2: the clip does NOT end on the feature's own page or the hub — b5 has no
// LiveBackdrop at all, only the drawn ledger result.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/v25.json";

const B1 = 15;
const B2 = 207;
const B3 = 369;
const B4 = 491;
const B5 = 649;
const END = 874;

/** Accent tuned for the dark stage (sand's #B4531F is too dark on a plate). */
const ACCENT = "#F08A4B";
const STAGE = "#1C1610";

// Right stage — where everything that isn't the ledger lives, never under it.
const STAGE_X = 356;
const STAGE_W = 864;

// Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the
// ledger's SMALL home for b2-b4, same geometry family as other dark clips.
const BAND = { x: 40, y: 606, w: 460, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Tone = "danger" | "accent" | "success";

/** archetype 5 — the ledger, present every beat, FULL left receipt column when
    it owns the frame alone (b1/b5) and shrunk into BAND while a catalog effect
    sits above it (b2-b4). Grows a line each beat, flips red->green at B3. */
const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const phase: { value: string; label: string; tone: Tone } =
    frame < B3
      ? { value: "10", label: "CLIPS BEHIND", tone: "danger" }
      : frame < B4
      ? { value: "10", label: "CLIPS REWRITTEN", tone: "accent" }
      : frame < B5
      ? { value: "0", label: "BROKEN LINKS", tone: "success" }
      : { value: "10", label: "CLIPS DONE", tone: "success" };

  const color = phase.tone === "danger" ? P.danger : phase.tone === "accent" ? ACCENT : P.success;
  const bg = phase.tone === "danger" ? P.dangerBg : phase.tone === "accent" ? "rgba(240,138,74,0.14)" : P.successBg;
  const big = frame < B2 || frame >= B5;

  if (big) {
    const inAt = frame < B2 ? B1 : B5;
    const t = tween(sec(frame, inAt + 4, fps), 0, 0.5, ease.power3Out);
    const isClose = frame >= B5;
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 340,
          height: 720,
          background: "rgba(20,14,8,0.92)",
          borderRight: "2px solid rgba(255,255,255,0.14)",
          opacity: t,
          fontFamily,
        }}
      >
        <div style={{ position: "absolute", left: 32, top: 48, fontSize: 14, fontWeight: 800, letterSpacing: 2, color: "rgba(250,245,238,0.6)" }}>
          STYLE LEDGER
        </div>

        {/* receipt lines — a dashed-rule receipt column */}
        <div style={{ position: "absolute", left: 32, top: 88, width: 276, borderTop: "2px dashed rgba(255,255,255,0.22)" }} />

        <div style={{ position: "absolute", left: 32, top: 106, width: 276, fontSize: 18, fontWeight: 700, color: isClose ? P.success : P.danger }}>
          10 clips{"  "}
          <span style={{ opacity: 0.55, fontWeight: 400 }}>…………</span>
          {"  "}
          {isClose ? "BRIGHT" : "DARK"}
        </div>

        {frame >= B1 + 20 && !isClose && (
          <div style={{ position: "absolute", left: 32, top: 140, width: 276, fontSize: 18, fontWeight: 700, color: P.danger }}>
            1 style{"  "}
            <span style={{ opacity: 0.55, fontWeight: 400 }}>…………</span>
            {"  "}
            2 looks
          </div>
        )}

        {isClose && (
          <>
            <div style={{ position: "absolute", left: 32, top: 140, width: 276, fontSize: 18, fontWeight: 700, color: P.success }}>
              0 links{"  "}
              <span style={{ opacity: 0.55, fontWeight: 400 }}>…………</span>
              {"  "}
              BROKEN
            </div>
            {frame >= B5 + 24 && (
              <div style={{ position: "absolute", left: 32, top: 174, width: 276, fontSize: 18, fontWeight: 700, color: P.success }}>
                1/day x 10{"  "}
                <span style={{ opacity: 0.55, fontWeight: 400 }}>…</span>
                {"  "}
                REPOST
              </div>
            )}
          </>
        )}

        <div style={{ position: "absolute", left: 32, top: 230, width: 276, borderTop: "2px dashed rgba(255,255,255,0.22)" }} />

        {isClose && (
          <div style={{ position: "absolute", left: 32, top: 250, fontSize: 24, fontWeight: 800, color: "rgba(250,245,238,0.4)", textDecoration: "line-through" }}>
            10 BEHIND
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: 32,
            top: isClose ? 280 : 256,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2,
            color: "rgba(250,245,238,0.6)",
          }}
        >
          TOTAL
        </div>
        <div style={{ position: "absolute", left: 32, top: isClose ? 304 : 280, fontSize: 92, fontWeight: 800, lineHeight: 1, color, fontFamily }}>
          {phase.value}
        </div>
        <div
          style={{
            position: "absolute",
            left: 32,
            top: isClose ? 414 : 390,
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
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>STYLE LEDGER</div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>{phase.label}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — the discovery, fully drawn: product plate, the feature's own real page
    playing in a browser window, ledger FULL at "10"/danger. */
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
          border: "1.5px solid #F3C09A",
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
        Ten clips still running the original dark terminal schema.
      </div>
    </>
  );
};

/** b5 — the result, fully drawn: ledger back FULL at "10"/success with the
    struck-through old total. Holds to END, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const captionIn = tween(t, 0.95, 0.3, ease.power2Out);
  const titleIn = tween(t, 0.1, 0.3, ease.power3Out);
  // "one a day for ten days": ten day-tiles light up in order across the beat
  // (a bare right stage here measured 17/48 — the sentence had no picture).
  const lit = Math.min(10, Math.floor(Math.max(0, frame - B5 - 12) / 14) + 1);
  const TW = 156;
  const TG = 21;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: STAGE_X,
          top: 60,
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: 2,
          color: ACCENT,
          opacity: titleIn,
          fontFamily,
        }}
      >
        REPOST SCHEDULE — ONE CLIP A DAY
      </div>
      {Array.from({ length: 10 }, (_, i) => {
        const on = i < lit;
        const x = STAGE_X + (i % 5) * (TW + TG);
        const y = 100 + Math.floor(i / 5) * 200;
        const tileIn = tween(t, 0.15 + i * 0.04, 0.3, ease.power3Out);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: TW,
              height: 180,
              borderRadius: 6,
              background: on ? "rgba(240,138,75,0.22)" : "rgba(255,255,255,0.07)",
              border: `2px solid ${on ? ACCENT : "rgba(255,255,255,0.18)"}`,
              opacity: tileIn,
              transform: `translateY(${mix(tileIn, 14, 0)}px)`,
              fontFamily,
              padding: "16px 16px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: "rgba(250,245,238,0.6)" }}>DAY {i + 1}</div>
            <div style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1, marginTop: 14, color: on ? ACCENT : "rgba(250,245,238,0.35)" }}>
              {on ? "✓" : "·"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 14, color: "#F5F5F2" }}>Clip {i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: "rgba(250,245,238,0.55)" }}>
              {on ? "reposted" : "queued"}
            </div>
          </div>
        );
      })}
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
      Rewritten once in a batch, now reposted slowly — one clip a day for ten days.
    </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — ten clips still dark, fully drawn, over the feature's own real page */}
      <OpeningBeat />

      {/* b2 — one demo is not proof, over the real features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="copyCorrection"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.8}
        data={{
          wrong: "One demo composition proves a new style",
          right: "Ten already-published clips put it to the real test",
          label: "The Real Test",
        }}
      />

      {/* b3 — Claude rewrote all ten in one parallel batch, over the repo's real commits */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="commits" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.5}
        data={{
          system: "Claude subagents",
          steps: ["10 old dark clips", "Parallel subagents", "Bright v2 template", "10 rewritten clips"],
          result: "One batch, ten clips",
        }}
      />

      {/* b4 — re-rendered and uploaded to the exact old link, over the repo's real Actions runs */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="actions" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="statusFocus"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        data={{
          title: "AFTER THE RE-UPLOAD",
          claims: [
            { text: "Storage key changed", verdict: "no" },
            { text: "Old links still resolve", verdict: "yes" },
          ],
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <Ledger />
    </AbsoluteFill>
  );
};

export const Feature10ClipsGoDarkV25: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
