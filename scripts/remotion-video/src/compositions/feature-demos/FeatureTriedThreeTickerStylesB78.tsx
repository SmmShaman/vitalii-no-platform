/**
 * FeatureTriedThreeTickerStylesB78 — feature b78 — 1280x720, 886 frames @ 30fps, VOICE-SYNCED.
 * archetype 1 timeline [ribbon], mood violet: three on-screen attempts — ticker, paging,
 * static — land as stamps on a horizontal time band, ending on the one that holds still.
 *
 * Beats (measured, immutable):
 *  b1   15–186  kids could only see today's events on the kitchen kiosk calendar
 *  b2  186–367  a scrolling ticker felt like a TV news crawl
 *  b3  367–510  paging was calmer, but still shifted every few seconds
 *  b4  510–664  doubled the backend window, one week to two
 *  b5  664–886  static text that holds still — two weeks on screen
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, WIN_DEFAULT, type LogLine } from "./live-primitives";
import shotsFile from "./shots/b78.json";

const B1 = 15;
const B2 = 186;
const B3 = 367;
const B4 = 510;
const B5 = 664;
const END = 886;

/** violet's raw accent (#5B37D4) reads too dark on the dark plate — brighter override. */
const ACCENT = "#9B82FF";
const STAGE = "#140E26";

// Timeline ribbon geometry (1280×720, below the effects' safe bottom at y≈587).
const RIBBON = { x: 40, y: 614, w: 1200, h: 76 };
const TRACK_X = RIBBON.x + 300;
const TRACK_W = RIBBON.w - 340;

const LOG_LINES: LogLine[] = [
  { t: "$", text: 'ticker.tsx removed — "flickers, gets in the way"', tone: "muted" },
  { text: "pager.tsx removed — still shifts every few seconds", tone: "muted" },
  { text: "backend window: 7 days -> 14 days", tone: "ink" },
  { text: "static.tsx: wraps lines, shrinks font to fit", tone: "accent" },
  { text: "two weeks of family events, on screen", tone: "ink" },
  { text: "status: holds still", tone: "success" },
];

type StampTone = "neutral" | "danger" | "accent" | "success";
const STAMPS: { label: string; tone: StampTone }[] = [
  { label: "TODAY", tone: "neutral" },
  { label: "TICKER", tone: "danger" },
  { label: "PAGING", tone: "danger" },
  { label: "2 WEEKS", tone: "accent" },
  { label: "STATIC", tone: "success" },
];

const TimelineRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  // Beats land left→right on the band — a new stamp arrives every beat, none ever idle.
  const beat = frame >= B5 ? 5 : frame >= B4 ? 4 : frame >= B3 ? 3 : frame >= B2 ? 2 : 1;
  const kicker = ["", "BOYTASKS", "ATTEMPT 1", "ATTEMPT 2", "THE FIX", "WHAT STUCK"][beat];
  const headline = [
    "",
    "Gates YouTube behind school & chore tasks, on Cloudflare Workers",
    "Scrolling ticker: flickers, gets in the way",
    "Paging: calmer, still shifts every few seconds",
    "Backend window widened: 1 week to 2 weeks",
    "Static text that holds still, nothing moves",
  ][beat];

  const toneColor = (tone: StampTone) =>
    tone === "danger"
      ? { fg: P.danger, bg: P.dangerBg, edge: P.dangerEdge }
      : tone === "accent"
      ? { fg: P.accent, bg: P.accentBg, edge: P.accentEdge }
      : tone === "success"
      ? { fg: P.success, bg: P.successBg, edge: P.successEdge }
      : { fg: P.muted, bg: P.chipBg, edge: P.border };

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={RIBBON} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: RIBBON.x,
            top: RIBBON.y,
            width: RIBBON.w,
            height: RIBBON.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: RIBBON.x + 22, top: RIBBON.y + 14, width: 250 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>{kicker}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.25 }}>{headline}</div>
        </div>

        {/* the time band itself */}
        <div
          style={{
            position: "absolute",
            left: TRACK_X,
            top: RIBBON.y + RIBBON.h / 2,
            width: TRACK_W,
            height: 2,
            background: P.border,
          }}
        />

        {STAMPS.map((s, i) => {
          if (i >= beat) return null;
          const isCurrent = i === beat - 1;
          const { fg, bg, edge } = toneColor(s.tone);
          const slotX = TRACK_X + (TRACK_W / 4) * i;
          return (
            <div
              key={s.label}
              style={{
                position: "absolute",
                left: slotX - (isCurrent ? 46 : 36),
                top: RIBBON.y + RIBBON.h / 2 - (isCurrent ? 22 : 16),
                padding: isCurrent ? "7px 14px" : "5px 10px",
                borderRadius: 999,
                background: isCurrent ? fg : bg,
                border: `1px solid ${edge}`,
                color: isCurrent ? "#fff" : fg,
                fontSize: isCurrent ? 14 : 11,
                fontWeight: 800,
                textDecoration: !isCurrent && s.tone === "danger" ? "line-through" : "none",
              }}
            >
              {s.label}
            </div>
          );
        })}
      </Arrive>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page: only today's events, on the kiosk */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          line1: "Our kids could only see today's events",
          line2: "on the kitchen kiosk calendar",
          keywords: ["today's events", "kitchen kiosk"],
        }}
      />

      {/* b2 — attempt 1: a scrolling ticker, too busy to glance at */}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{
          statement: "A scrolling ticker felt like a TV news crawl",
          tags: ["Right-to-left scroll", "Too busy to glance at", '"Flicker and get in the way"'],
        }}
      />

      {/* b3 — attempt 2: paging, calmer but still shifting on its own */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          from: "Scrolling ticker",
          to: "Paging every few seconds",
          points: ["Calmer than scrolling", "Still shifted on its own", "Also flickered, got in the way"],
        }}
      />

      {/* b4 — the fix underneath: double the backend window */}
      <MotionInsert
        effect="ratioBars"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          a: { label: "Backend window (before)", value: 1 },
          b: { label: "Backend window (now)", value: 2 },
          unit: "weeks",
          title: "Cloudflare Workers backend window",
        }}
      />

      {/* b5 — what stuck: static text that holds still, built from the feature's own facts */}
      {frame >= B5 && (
        <LogWindow
          lines={LOG_LINES}
          title="kiosk-calendar worker"
          from={B5}
          opacity={1}
          win={{ ...WIN_DEFAULT, x: Math.round((width - WIN_DEFAULT.w) / 2) }}
        />
      )}

      <TimelineRibbon />
    </AbsoluteFill>
  );
};

export const FeatureTriedThreeTickerStylesB78: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
