/**
 * FeatureOneVoiceCommandCreatesC07 — feature c07 — 1280x720, 951 frames @ 30fps, VOICE-SYNCED.
 * archetype 2 zoom-in, mood slate: the lower third zooms from "every date, one
 * by one" down to a single "repeat" field, settling on the real safety number
 * (200) by the last beat — the camera-zoom story told as a shrinking set.
 *
 * Beats (measured, immutable):
 *  b1  15–194  the AI used to spell out every date itself
 *  b2 194–377  a six-month series broke the reply (bare processing error)
 *  b3 377–549  analogy: writing every Tuesday by hand vs. "repeat weekly"
 *  b4 549–735  fix: one repeat field, server walks the dates, JSON never breaks
 *  b5 735–951  safeguard: capped at 200 events
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, WIN_DEFAULT, type LogLine } from "./live-primitives";
import shotsFile from "./shots/c07.json";

const B1 = 15;
const B2 = 194;
const B3 = 377;
const B4 = 549;
const B5 = 735;
const END = 951;

/** slate's accent (#0E7490) reads fine on the dark plate — no override needed. */
const ACCENT = "#22B8D8";
const STAGE = "#0C1620";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const LOG_LINES: LogLine[] = [
  { t: "$", text: 'dictate: "every Tuesday until June"', tone: "muted" },
  { text: "repeat: { days: [tue], until }", tone: "ink" },
  { text: "server.ts loop: day-by-day (UTC)", tone: "ink" },
  { text: "+ DST offset fix for local time", tone: "muted" },
  { text: "cap: 200 rows max", tone: "accent" },
  { text: "status: series created", tone: "success" },
];

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  // The zoom: a shrinking set of date chips, one per beat, settling on 200.
  const beat = frame >= B5 ? 5 : frame >= B4 ? 4 : frame >= B3 ? 3 : frame >= B2 ? 2 : 1;
  const kicker = ["", "THE PROBLEM", "WHAT BROKE", "THE ANALOGY", "THE FIX", "THE SAFEGUARD"][beat];
  const line = [
    "",
    "AI types out every date, one by one",
    "Six months of Tuesdays → JSON breaks",
    '"every Tuesday" → one "repeat weekly" field',
    "repeat field in, server walks the dates",
    "hard cap: 200 events, ever",
  ][beat];
  const chipCount = [0, 6, 4, 3, 2, 1][beat];
  const lastChipIsNumber = beat === 5;

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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 14, width: 230 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>{kicker}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.25 }}>{line}</div>
        </div>
        <div style={{ position: "absolute", left: LT.x + 280, top: LT.y + 26, width: LT.w - 300, height: 40, display: "flex", alignItems: "center", gap: 10 }}>
          {Array.from({ length: chipCount }).map((_, i) => {
            const isLast = lastChipIsNumber && i === chipCount - 1;
            return (
              <div
                key={i}
                style={{
                  padding: isLast ? "8px 18px" : "8px 14px",
                  borderRadius: 999,
                  background: isLast ? P.accent : P.accentBg,
                  border: `1px solid ${isLast ? P.accent : P.accentEdge}`,
                  color: isLast ? "#fff" : P.accent,
                  fontSize: isLast ? 18 : 13,
                  fontWeight: 800,
                }}
              >
                {isLast ? "200" : "•"}
              </div>
            );
          })}
        </div>
      </Arrive>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page: AI spells out every date */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "One sentence, one semester", kicker: "Every date used to be typed out by the AI itself" }}
      />

      {/* b2 — what broke: a six-month series, bare processing error */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="commit-a" from={B2} hold={B3 - B2} focus={{ x: 0.5, y: 0.3 }} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A six-month series broke the reply",
          tags: ["Every date typed by the AI", "JSON broke mid-reply", "Bare processing error"],
        }}
      />

      {/* b3 — the analogy, drawn only (no live backdrop for a metaphor beat) */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "Like writing every Tuesday on a calendar by hand,",
          line2: 'instead of saying "repeat weekly."',
          keywords: ["every", "Tuesday", "repeat", "weekly"],
        }}
      />

      {/* b4 — the fix, over the commit that moves expansion to the server */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="commit-b" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.3 }} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "AI types every date",
          to: "Server fills in each date",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["One repeat field only", "Loops day by day in UTC", "JSON never breaks"],
        }}
      />

      {/* b5 — the safeguard, drawn LogWindow built from the feature's own facts */}
      {frame >= B5 && (
        <LogWindow
          lines={LOG_LINES}
          title="calendar-bot worker"
          from={B5}
          opacity={1}
          win={{ ...WIN_DEFAULT, x: Math.round((width - WIN_DEFAULT.w) / 2) }}
        />
      )}

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureOneVoiceCommandCreatesC07: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
