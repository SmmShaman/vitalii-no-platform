// FeatureKiosksEmptyWeekFillsB39 — feature b39 — 1280x720, 952 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar narrative, mood sand. Motion direction v2 (feature-motion skill, 2026-11-10).
// RE-SHOOT: narration and beat windows kept exactly as measured; only the picture is new —
// the old version was drawn archetype 7 hero-number / mood slate, which did not match the
// archetype drawn for tonight.
//
// Beat → effect (data only from the feature row; the one real commit, 516a87e "feat(tv): show
// the mirrored Google Calendar on the kiosk strip", has no verified GitHub URL tonight, so its
// real file name is named in the sidebar plate instead of shot as a live diff):
// b1 15-241   "the kitchen TV's weekly calendar looked nearly empty, even though most of the
//             family's real schedule lived in Google Calendar"
//             cornerTags over the feature's own write-up page — the opener, not reused from
//             the last three clips (v22 keywordCaption, b40 drawn, b43 titleTakeover).
// b2 241-403  "a kiosk that never logs into anything could never see events hidden behind a login"
//             copyCorrection over the write-up page, scrolled further — corrects the easy
//             assumption that the TV already saw everything.
// b3 403-562  "now it pulls those events in and merges them with the household calendar and the
//             sports app"
//             hubRouting over the write-up page, scrolled further still — three named sources
//             into one endpoint.
// b4 562-783  "every event is color-coded, so one glance shows whether it's sports, a
//             handwritten note, or the calendar itself"
//             keywordCaption over the features hub.
// b5 783-952  "three separate sources, one real week, nothing invisible anymore"
//             drawn: a log window from the feature's own numbers, holding to the end — never
//             the write-up page or the hub again (gate 2).
//
// Persistent element: the sidebar narrative lower third (archetype 6) — a fixed "THE SOURCES"
// label card plus a state chip that climbs 0 -> 3 and relights danger -> success as each
// source is folded in. Effects keep the bottom clear (y>=600) — that is where it sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b39.json";

const B1 = 15;
const B2 = 241;
const B3 = 403;
const B4 = 562;
const B5 = 783;
const END = 952;

/** Accent tuned for the dark stage (sand's native #B4531F reads muddy on a plate). */
const ACCENT = "#F08A4B";
const STAGE = "#1A120A";

// Lower third geometry (1280x720, below the effects' safe bottom at y~587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const SOURCE_STEPS: { at: number; count: number; text: string }[] = [
  { at: B1, count: 0, text: "0 SOURCES ON SCREEN" },
  { at: B2 + 20, count: 0, text: "LOGIN REQUIRED, NONE GIVEN" },
  { at: B3 + 20, count: 1, text: "1 OF 3 FOLDED IN" },
  { at: B3 + 90, count: 2, text: "2 OF 3 FOLDED IN" },
  { at: B4 + 10, count: 3, text: "3 OF 3, COLOR-CODED" },
  { at: B5 + 30, count: 3, text: "3 SOURCES, MERGED" },
];

function stepFor(frame: number) {
  let s = SOURCE_STEPS[0];
  for (const step of SOURCE_STEPS) {
    if (frame >= step.at) s = step;
  }
  return s;
}

const SidebarNarrative: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const step = stepFor(frame);
  const lit = step.count > 0;
  const dot = punchScale(sec(frame, step.at, fps), 0);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: LT.w,
            height: LT.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: 190 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>THE SOURCES</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            kitchen TV
            <br />
            kiosk strip
          </div>
        </div>
      </Arrive>

      <div
        style={{
          position: "absolute",
          left: LT.x + 260,
          top: LT.y + 14,
          width: 460,
          height: 64,
          background: lit ? P.successBg : P.dangerBg,
          border: `2px solid ${lit ? P.successEdge : P.dangerEdge}`,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: lit ? P.success : P.danger,
            marginRight: 16,
            transform: `scale(${dot})`,
            flexShrink: 0,
          }}
        />
        <div style={{ fontSize: 19, fontWeight: 800, color: lit ? P.success : P.danger, whiteSpace: "nowrap" }}>
          {step.text}
        </div>
      </div>

      {frame >= B1 + 10 && frame < B2 && (
        <div style={{ position: "absolute", left: LT.x + 740, top: LT.y + 30, width: 420, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>
          KioskFrame.tsx — Cloudflare Workers
        </div>
      )}
    </div>
  );
};

const B5Drawn: React.FC = () => {
  const lines: LogLine[] = [
    { t: "01", text: "calendar server -> fetched in parallel", tone: "accent" },
    { t: "02", text: "3 sources merged into 1 list", tone: "success" },
    { t: "03", text: "Google events auto-detected", tone: "ink" },
    { t: "04", text: "colored distinct green", tone: "success" },
    { t: "05", text: "counts per source logged", tone: "muted" },
    { t: "06", text: "no family member -> full-width banner", tone: "ink" },
    { t: "07", text: "nothing silently dropped", tone: "success" },
  ];
  return (
    <LogWindow
      lines={lines}
      title="kiosk calendar"
      from={B5 + 20}
      every={16}
      opacity={1}
      win={{ x: 150, y: 300, w: 980, h: 340 }}
    />
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, opener, over the feature's own write-up page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "TV calendar: almost empty",
          tags: ["Real week lives in Google", "None of it on screen", "7 nearly-blank days"],
        }}
      />

      {/* b2 — the cause, over the write-up page, scrolled further */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="copyCorrection"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          wrong: "Assume the TV sees every event",
          right: "No login means Google's events stay hidden",
          label: "Why",
        }}
      />

      {/* b3 — the merge, over the write-up page, scrolled further still */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="hubRouting"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["Household calendar", "Sports club app", "Google Calendar"],
          hub: "Kiosk calendar endpoint",
          output: "One merged week",
        }}
      />

      {/* b4 — the color coding, over the features hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="keywordCaption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "Every event is color-coded",
          line2: "sports, a note, or the calendar itself",
          keywords: ["color-coded"],
        }}
      />

      {/* b5 — the result, drawn, holds to the end — never the write-up page or hub again */}
      {frame >= B5 && <B5Drawn />}

      <SidebarNarrative />
    </AbsoluteFill>
  );
};

export const FeatureKiosksEmptyWeekFillsB39: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
