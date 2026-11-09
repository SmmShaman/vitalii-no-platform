// FeatureKiosksEmptyWeekFillsB39 — feature b39 — 1280x720, 952 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row):
// b1 15-241   "the kitchen TV's weekly calendar looked nearly empty, even though most of the
//             family's real schedule lived in Google Calendar"
//             drawn: seven day boxes each labelled "no events", hero number 0 "SOURCES ON
//             SCREEN". WAVE C 2026-11-09 fix: header/label text was P.ink (#101828, a dark
//             navy meant for light paper cards) on the dark stage — effectively invisible;
//             switched to light text. Subtitle also arrived at B1+170, after the beat's
//             midpoint capture frame — retimed to B1+20, alongside a faster day-box stagger.
// b2 241-403  "a kiosk that never logs into anything could never see events hidden behind a login"
//             cornerTags over the feature's own write-up page.
// b3 403-562  "now it pulls those events in and merges them with the household calendar and the
//             sports app"
//             hubRouting over the write-up page, scrolled further — hero number climbs 0 -> 3.
// b4 562-783  "every event is color-coded, so one glance shows sports, a note, or the calendar itself"
//             keywordCaption over the features hub.
// b5 783-952  "three separate sources, one real week, nothing invisible anymore"
//             drawn: hero number 3 "SOURCES MERGED" + a log window from the feature's own numbers.
//
// Persistent element: a hero number (archetype 7) — fontSize 240, owning the frame during the
// two drawn beats (b1, b5) where no catalog effect competes; shrinks to a small corner badge
// inside the universal safe-bottom band (y>=600) during the three catalog-effect beats (b2-b4)
// so it never collides with the effect's own layout.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b39.json";

const B1 = 15;
const B2 = 241;
const B3 = 403;
const B4 = 562;
const B5 = 783;
const END = 952;

const MERGE_START = B3 + 20;
const MERGE_END = B3 + 110;

const ACCENT = "#22B8CF";
const STAGE = "#0A1016";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const heroValue = (frame: number): number => {
  if (frame < MERGE_START) return 0;
  if (frame >= MERGE_END) return 3;
  const t = (frame - MERGE_START) / (MERGE_END - MERGE_START);
  return Math.round(t * 3);
};

const HeroNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const big = frame < B2 || frame >= B5;
  const value = heroValue(frame);
  const lit = value > 0;
  const label =
    frame >= B5
      ? "SOURCES MERGED"
      : frame >= B4
      ? "COLOR-CODED"
      : frame >= B3
      ? "MERGING"
      : frame >= B2
      ? "NO LOGIN"
      : "SOURCES ON SCREEN";

  const sc = frame >= B5 ? punchScale(sec(frame, B5 + 10, fps), 0) : 1;

  if (big) {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 150,
          width: 1280,
          textAlign: "center",
          fontFamily,
          transform: `scale(${sc})`,
        }}
      >
        <div style={{ fontSize: 240, fontWeight: 800, color: lit ? P.success : P.danger, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.85)", marginTop: 8 }}>
          {label}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 1090,
        top: 606,
        width: 150,
        height: 92,
        background: lit ? P.successBg : P.dangerBg,
        border: `2px solid ${lit ? P.successEdge : P.dangerEdge}`,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 800, color: lit ? P.success : P.danger, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: P.muted, marginTop: 4, textAlign: "center" }}>
        {label}
      </div>
    </div>
  );
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const B1Drawn: React.FC = () => {
  return (
    <>
      <Arrive at={B1 + 4} kind="wipe" box={{ x: 90, y: 60, w: 1100, h: 40 }} dur={0.45}>
        <div style={{ position: "absolute", left: 90, top: 60, fontSize: 28, fontWeight: 800, color: "rgba(255,255,255,0.92)", letterSpacing: 1 }}>
          BOYTASKS — kitchen kiosk, Cloudflare Workers
        </div>
      </Arrive>
      <Arrive at={B1 + 20} kind="rise" box={{ x: 90, y: 448, w: 1100, h: 40 }} dur={0.4}>
        <div style={{ position: "absolute", left: 90, top: 448, fontSize: 20, fontWeight: 600, color: ACCENT }}>
          Most of the week lived in Google Calendar — invisible on the TV
        </div>
      </Arrive>
      {DAYS.map((d, i) => {
        const w = 150;
        const gap = 14;
        const x0 = (1280 - (7 * w + 6 * gap)) / 2;
        const x = x0 + i * (w + gap);
        return (
          <Arrive key={d} at={B1 + 16 + i * 7} kind="rise" box={{ x, y: 520, w, h: 140 }} dur={0.35}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: 520,
                width: w,
                height: 140,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.26)",
                borderRadius: 6,
                padding: 10,
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.5, color: "rgba(255,255,255,0.75)" }}>
                {d}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  right: 10,
                  bottom: 14,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                — no events —
              </div>
            </div>
          </Arrive>
        );
      })}
    </>
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
      from={B5 + 30}
      every={16}
      opacity={1}
      win={{ x: 150, y: 340, w: 980, h: 330 }}
    />
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, drawn: nearly empty week */}
      {cut(frame, B1, B2) === 1 && <B1Drawn />}

      {/* b2 — the cause, over the feature's own write-up page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page1" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A kiosk that never logs in can't see Google",
          tags: ["No login", "No session", "No cookies", "Hidden events"],
        }}
      />

      {/* b3 — the merge, over the write-up page, scrolled further */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} />}
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
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub1" from={B4} hold={B5 - B4} />}
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

      {/* b5 — the result, drawn, holds to the end */}
      {frame >= B5 && <B5Drawn />}

      <HeroNumber />
    </AbsoluteFill>
  );
};

export const FeatureKiosksEmptyWeekFillsB39: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
