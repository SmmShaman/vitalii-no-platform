// FeatureVacationModeKidsKeepB70 — feature b70 — 1280x720, 1003 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline ribbon, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: Boytasks — screen time for three kids, gated by finishing school/chore tasks first
// (React + Cloudflare Workers + Supabase). This feature: a child away from the home TV (no
// camera there either) used to be judged by the same gate as a child at home — finishing his
// tasks with no bonus to show read as "done, unpaid" and silently shut down his brothers'
// YouTube even though THEY were home watching. Fix: a server-side away_mode:<child> flag the
// youtube-gate Cloudflare Worker excludes from activeIdSet(); away, the child gets one task at
// a time, no cap, no bonus, until the home camera clears the flag again (commit 1aeb09f).
//
// Beat → effect (data only from the feature row and commit 1aeb09f):
// b1 15-178   "stays at his grandmother's for weeks — no TV, no camera"
//             titleTakeover over the feature's own page (backdrop "page").
// b2 178-468  "judged by home rules... read as done, unpaid... shut his brothers' YouTube"
//             cornerTags: the claim + four facts from problem_en, scrolled further down the
//             same page (backdrop "page2").
// b3 468-625  "a Supabase flag marks him off-site, and the home gate learns to skip him"
//             handoffExplain over the page's solution section (backdrop "page3") —
//             workers/youtube-gate/index.js is named on screen (real file from the commit).
// b4 625-826  "one task at a time, no cap, no bonus — for as long as he's gone"
//             pipelineFlow over the features hub (backdrop "hub") — this feature living
//             among the others, not the result.
// b5 826-1003 "his brothers' YouTube never drops again. Zero false shutdowns"
//             no page/hub backdrop (gate 2): a dark stage carries the ZERO stat and a
//             LogWindow replaying the gate's own state, holding to the final frame.
//
// Persistent element (archetype 1): a timeline ribbon along the bottom (y>=606) with a small
// "BOYTASKS" plate bottom-left and five stamps landing left→right as the story moves —
// AWAY → FALSE GATE → away_mode FLAG → 1 TASK AT A TIME → 0 SHUTDOWNS. Deleting the ribbon
// would delete the clip's spine: it is the only thing that ties five different pictures into
// one argument.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b70.json";

const B1 = 15;
const B2 = 178;
const B3 = 468;
const B4 = 625;
const B5 = 826;
const END = 1003;

/** Bright, legible on the dark MotionInsert plate (mint's own accent #0B7A5A is too dark). */
const ACCENT = "#4ADE9A";
const STAGE = "#0E1A15";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Ribbon geometry — below the effects' safe line (y>=600 at 720p).
const RIBBON = { x: 40, y: 606, w: 1200, h: 96 };
const LINE_Y = RIBBON.y + 46;
const PLATE_W = 240;
const SLOT0 = RIBBON.x + PLATE_W + 24;
const SLOT_W = (RIBBON.w - PLATE_W - 24) / 5;

type Tone = "muted" | "danger" | "accent" | "ink" | "success";
const STAMPS: { at: number; label: string; icon: string; tone: Tone }[] = [
  { at: B1 + 40, label: "AWAY", icon: "🧳", tone: "muted" },
  { at: B2 + 40, label: "FALSE GATE", icon: "🔴", tone: "danger" },
  { at: B3 + 40, label: "away_mode FLAG", icon: "🚩", tone: "accent" },
  { at: B4 + 40, label: "1 TASK AT A TIME", icon: "✅", tone: "ink" },
  { at: B5 + 10, label: "0 SHUTDOWNS", icon: "🟢", tone: "success" },
];

const TimelineRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const arrivedCount = STAMPS.filter((s) => frame >= s.at).length;

  const toneColors = (tone: Tone) => {
    if (tone === "danger") return { fg: P.danger, bg: P.dangerBg, edge: P.dangerEdge };
    if (tone === "accent") return { fg: P.accent, bg: P.accentBg, edge: P.accentEdge };
    if (tone === "success") return { fg: P.success, bg: P.successBg, edge: P.successEdge };
    if (tone === "ink") return { fg: P.ink, bg: P.card, edge: P.border };
    return { fg: P.muted, bg: P.chipBg, edge: P.border };
  };

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* small product plate, bottom-left, not centered — present from b1 through the end */}
      <Arrive at={B1 + 4} kind="wipe" box={{ x: RIBBON.x, y: RIBBON.y, w: PLATE_W, h: RIBBON.h }} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: RIBBON.x,
            top: RIBBON.y,
            width: PLATE_W,
            height: RIBBON.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: RIBBON.x + 20, top: RIBBON.y + 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>BOYTASKS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            away mode · b70
          </div>
        </div>
        <div style={{ position: "absolute", left: SLOT0 - 20, top: LINE_Y - 1, width: RIBBON.w - PLATE_W - 4, height: 2, background: P.border }} />
      </Arrive>

      {STAMPS.map((s, i) => {
        if (frame < s.at) return null;
        const dim = i < arrivedCount - 1;
        const { fg, bg, edge } = toneColors(s.tone);
        const x = SLOT0 + i * SLOT_W + 6;
        const w = SLOT_W - 12;
        const sc = punchScale(sec(frame, s.at, fps), 0);
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: x,
              top: RIBBON.y + 14,
              width: w,
              height: 66,
              borderRadius: 4,
              background: bg,
              border: `2px solid ${edge}`,
              transform: `scale(${sc})`,
              opacity: dim ? 0.58 : 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              boxSizing: "border-box",
              padding: "0 6px",
            }}
          >
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: fg, textAlign: "center", lineHeight: 1.15 }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
};

/** b5 — no page/hub backdrop allowed here (gate 2): a dark stage, the gate's own state, the number. */
const ResultStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;
  const at = B5 + 110;
  const sc = frame >= at ? punchScale(sec(frame, at, fps), 0) : 0;
  const reveal = frame >= at ? 1 : tween(sec(frame, B5, fps), 0.1, 0.3, ease.power3Out);

  return (
    <>
      <LogWindow
        title="youtube-gate worker"
        from={B5 + 20}
        every={14}
        opacity={1}
        win={{ x: 140, y: 268, w: 1000, h: 280 }}
        fontSize={21}
        lines={[
          { t: "settings", text: "away_mode:<child> → true", tone: "accent" },
          { t: "TasksPage", text: "toggle read from any phone", tone: "muted" },
          { t: "daily-cron", text: "next task queued (bonus_reserve)", tone: "muted" },
          { t: "youtube-gate", text: "awayModeIds() excludes <child>", tone: "ink" },
          { t: "activeIdSet()", text: "brothers only → YouTube stays on", tone: "success" },
          { t: "camera: home", text: "away_mode:<child> cleared", tone: "success" },
        ]}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 48,
          width: 1280,
          textAlign: "center",
          opacity: reveal,
          fontFamily,
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 800, color: P.success, transform: `scale(${sc || 1})`, lineHeight: 1 }}>0</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: P.ink, marginTop: 4 }}>false shutdowns for his brothers, ever since</div>
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the human problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "No TV. Still judged.", kicker: "Away at Grandma's for weeks — no camera either" }}
      />

      {/* b2 — the concrete facts (problem_en), scrolled further down the same page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: 'A false "done but unpaid"',
          tags: ["No bonus to gate away", "Read as done, unpaid", "Shut brothers' YouTube", "They were home, watching"],
        }}
      />

      {/* b3 — the fix, over the page's solution section */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Same rules for every child",
          to: "away_mode:<child> flag",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Toggled from any phone", "Gate skips the away child", "workers/youtube-gate/index.js"],
        }}
      />

      {/* b4 — how it works while he's away, over the features hub (this feature among the others) */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["One task prepared", "Marked done", "Next task queued"],
          result: "No cap. No bonus needed.",
          system: "TasksPage + daily-cron",
        }}
      />

      {/* b5 — the result, holds to the end */}
      <ResultStage />

      <TimelineRibbon />
    </AbsoluteFill>
  );
};

export const FeatureVacationModeKidsKeepB70: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
