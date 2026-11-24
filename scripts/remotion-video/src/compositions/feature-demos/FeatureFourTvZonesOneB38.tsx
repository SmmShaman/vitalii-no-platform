// FeatureFourTvZonesOneB38 — feature b38 — 1280x720, 881 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat -> effect (commits 9e3af18 / 8c7d68c are this feature's own kiosk-split and
// calendar-grid commits; no verified GitHub URL exists this run, so their evidence
// is drawn, never recorded):
// b1 15-265   "one screen — tasks, or a lock screen — never who's home, never this week"
//             cornerTags over a LiveWindow recording of the feature's own page.
// b2 265-448  "the camera feed... cropped into whatever odd shape was left over"
//             keywordCaption, drawn (dark plate, no backdrop).
// b3 448-696  "a Cloudflare Worker feeds a calendar strip and a live camera tile
//             alongside the same screen, scaled down instead of redrawn"
//             hubRouting, drawn — matches commit 8c7d68c (calendar strip mirrors the
//             app's grid, camera kept 16:9). No verified URL shows the diff, so this is
//             a schematic with the real commit cited as a small chip, not a recording.
// b4 696-881  "one glance at the TV now shows four things at once instead of one"
//             drawn only — ledger total flips green plus a LogWindow built from this
//             feature's own zones. Never the feature page or the hub (gate 2). Holds at
//             full opacity to the end, no fade.
//
// Persistent element: the ledger archetype, b1 through b4 — a fixed receipt-styled
// column pinned to the right edge counting "zones" on the kitchen TV: starts at one red
// line (just the screen), gains green lines as the fix is explained, and ends with the
// original line struck through and a new green total.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Panel, IconCard } from "./bright-primitives";
import { MotionInsert, cut } from "./motion-primitives";
import { LiveWindow, LogWindow, LogLine } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b38.json";

const B1 = 15;
const B2 = 265;
const B3 = 448;
const B4 = 696;
const END = 881;

/** Sand's own accent (#B4531F) lifted brighter so it reads on the dark stage. */
const ACCENT = "#F0944B";
const STAGE = "#1A120A";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Ledger geometry (1280x720): a fixed 300px right column, full height.
const LEDGER_W = 300;
const LEDGER_X = 1280 - LEDGER_W;

const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const popAt = (at: number) => {
    const s = punchScale(sec(frame, at, fps), 0);
    const o = tween(sec(frame, at, fps), 0, 0.3, ease.power2Out);
    return { transform: `scale(${s})`, transformOrigin: "left center" as const, opacity: o };
  };

  const screenDone = frame >= B4;

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: LEDGER_W,
        height: 720,
        background: P.card,
        borderLeft: `3px dashed ${P.border}`,
        fontFamily,
        boxShadow: "-6px 0 0 rgba(0,0,0,0.3)",
        padding: "36px 26px 0",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>
        KITCHEN TV — ZONES
      </div>
      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: P.muted }}>
        one screen, counted
      </div>

      <div style={{ marginTop: 28, ...popAt(B1) }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: screenDone ? P.success : P.danger,
            textDecoration: screenDone ? "line-through" : "none",
          }}
        >
          Screen (tasks / lock)
        </div>
        {frame >= B2 && frame < B3 && (
          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: P.danger, ...popAt(B2) }}>
            camera: cropped, unusable
          </div>
        )}
      </div>

      {frame >= B3 && (
        <div style={{ marginTop: 18, ...popAt(B3) }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: P.success }}>+ Camera tile (16:9)</div>
          <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800, color: P.success }}>+ Calendar strip</div>
        </div>
      )}

      {screenDone && (
        <div style={{ marginTop: 34, ...popAt(B4) }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: P.muted, textDecoration: "line-through" }}>
            Old total: 1 zone
          </div>
          <div style={{ marginTop: 6, fontSize: 40, fontWeight: 800, color: P.success, lineHeight: 1 }}>
            Now: 4 zones
          </div>
        </div>
      )}
    </div>
  );
};

const RESULT_LINES: LogLine[] = [
  { text: "kiosk boot — 4 zones mounted", tone: "success" },
  { text: "zone: screen (tasks / lock)", tone: "muted" },
  { text: "zone: camera tile, 16:9 kept", tone: "accent" },
  { text: "zone: calendar strip, app grid", tone: "accent" },
  { text: "worker: youtube-gate serving all 4", tone: "muted" },
  { text: "0 odd crops left", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: one screen, one state, played from the feature's own page */}
      {cut(frame, B1, B2) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features"
          from={B1}
          hold={B2 - B1}
          zoom={(t) => 1 + 0.08 * t}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={1}
          win={{ x: 60, y: 140, w: 780, h: 460 }}
        />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "One screen, one state",
          tags: ["Tasks or lock only", "Never who's home", "Never this week", "Kitchen TV"],
        }}
      />
      {frame >= B1 && frame < B2 && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 630,
            fontFamily,
            fontSize: 16,
            fontWeight: 700,
            color: P.muted,
            opacity: tween(sec(frame, B1, 30), 0.3, 0.6, ease.power2Out),
          }}
        >
          Boytasks — screen-time &amp; task kiosk for three kids, on Cloudflare Workers
        </div>
      )}

      {/* b2 — the camera feed, cropped into whatever space was left */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          line1: "The camera feed",
          line2: "cropped into whatever space was left",
          keywords: ["cropped", "leftover"],
        }}
      />

      {/* b3 — the fix: a Cloudflare Worker feeds calendar strip + camera tile alongside
          the same screen, scaled not redrawn. Matches commit 8c7d68c. No verified URL
          shows the diff, so this is drawn with the real commit cited as a small chip. */}
      <MotionInsert
        effect="hubRouting"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          inputs: ["Calendar strip", "Camera tile (16:9)", "Same screen (kept)"],
          hub: "Cloudflare Worker",
          output: "Scaled, not redrawn",
        }}
      />
      {frame >= B3 && frame < B4 && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 660,
            fontFamily: "monospace",
            fontSize: 14,
            fontWeight: 700,
            color: P.muted,
            opacity: tween(sec(frame, B3, 30), 0.3, 0.6, ease.power2Out),
          }}
        >
          8c7d68c — calendar strip mirrors app grid, camera kept 16:9
        </div>
      )}

      {/* b4 — drawn: one glance now shows four things at once. Never the feature page
          or the hub (gate 2). Holds at full opacity, no fade. */}
      {frame >= B4 && (
        <Panel x={60} y={70} w={880} h={200} tone="success" radius={28} opacity={1}>
          <div style={{ padding: "26px 40px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>
              KITCHEN TV — ONE GLANCE
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#101418", marginTop: 4 }}>
              4 things at once, instead of 1
            </div>
          </div>
        </Panel>
      )}
      {frame >= B4 && (
        <>
          <IconCard x={60} y={300} w={260} emoji="📺" title="Screen" sub="Tasks / lock, kept" tone="accent" />
          <IconCard x={340} y={300} w={260} emoji="📷" title="Camera" sub="16:9 tile, live" tone="success" />
          <IconCard x={620} y={300} w={260} emoji="📅" title="Calendar" sub="Mirrors app grid" tone="success" />
        </>
      )}
      {frame >= B4 + 45 && (
        <LogWindow
          lines={RESULT_LINES}
          title="kiosk log"
          from={B4 + 45}
          every={16}
          opacity={1}
          fontSize={22}
          win={{ x: 60, y: 430, w: 880, h: 230 }}
        />
      )}

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureFourTvZonesOneB38: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
