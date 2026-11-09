// FeatureCalendarStripGrowsUpB40 — feature b40 — 1280x720, 852 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar narrative, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row):
// b1 15-291   "seven days crammed onto one screen, clipped titles, no location, no real faces"
//             drawn: seven cramped mini-columns with truncated titles and circle-initial avatars,
//             plus a product plate ("BOYTASKS — kitchen TV calendar, Cloudflare Workers") so the
//             brand is named before the problem is even explained. WAVE D fix 2026-11-09.
// b2 291-419  "rebuilt in React to show three days"
//             handoffExplain, drawn on a clean dark plate — WAVE D fix: dropped the live backdrop
//             of the feature's own write-up page, whose background prose (ISO week, component and
//             variable names) a casual viewer can't read in the time given; the schematic's own
//             real name, CalendarStrip.tsx, is the evidence instead.
// b3 419-535  "every chip gets room for the full title and the venue"
//             keywordCaption, same WAVE D fix — drawn on a clean dark plate, no live backdrop.
// b4 535-687  "each kid's header cycles through real photos, not a flat circle"
//             copyCorrection over the features hub — unchanged: that backdrop is a card grid, not
//             dense prose, and this beat already read clearly to a blind viewer.
// b5 687-852  "seven columns became three"
//             drawn: 7 -> 3 result stamp + a log window built from the feature's own numbers,
//             WAVE D fix: reworded to plain English (no "ISO week" jargon) and retimed so lines
//             keep revealing later into the beat instead of sitting static for the last third.
//
// Persistent element: the sidebar narrative lower third (archetype 6), b1 through b5 — a fixed
// label card plus a state chip that lights up (danger -> success) as the strip is rebuilt.
// Effects keep the bottom 200/1080 px clear (look.safeBottom) — that is where it sits.
//
// WAVE D fix 2026-11-09: a blind viewer (clarity 6/10, thesis 9/10) named five problems — dense
// unreadable background prose, the finished calendar never shown running, a b5 tail that looked
// like a frozen repeat, no visible brand, and jargon framing this as an internal changelog. See
// out/factory/waveD1fix-20261109-0000-b40.done for the fix summary.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b40.json";

const B1 = 15;
const B2 = 291;
const B3 = 419;
const B4 = 535;
const B5 = 687;
const END = 852;

/** Accent tuned for the dark stage (violet's native #5B37D4 reads muddy on a plate). */
const ACCENT = "#9B7EF5";
const STAGE = "#140F24";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const SidebarNarrative: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

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
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>THE STRIP</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            kitchen TV
            <br />
            calendar
          </div>
        </div>
      </Arrive>

      {frame >= B1 + 20 && (
        <StateChip
          text={
            frame >= B5 + 40
              ? "7 -> 3, DONE"
              : frame >= B4 + 20
              ? "+ REAL PHOTOS"
              : frame >= B3 + 20
              ? "+ VENUE & TITLE"
              : frame >= B2 + 20
              ? "3 DAYS ON SCREEN"
              : "7 DAYS, CLIPPED"
          }
          at={
            frame >= B5 + 40
              ? B5 + 40
              : frame >= B4 + 20
              ? B4 + 20
              : frame >= B3 + 20
              ? B3 + 20
              : frame >= B2 + 20
              ? B2 + 20
              : B1 + 20
          }
          lit={frame >= B2 + 20}
          fps={fps}
          frame={frame}
          P={P}
        />
      )}
    </div>
  );
};

const StateChip: React.FC<{
  text: string;
  at: number;
  lit: boolean;
  fps: number;
  frame: number;
  P: ReturnType<typeof usePalette>;
}> = ({ text, at, lit, fps, frame, P }) => {
  const dot = punchScale(sec(frame, at, fps), 0);
  return (
    <div
      style={{
        position: "absolute",
        left: LT.x + 260,
        top: LT.y + 14,
        width: 420,
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
        }}
      />
      <div style={{ fontSize: 20, fontWeight: 800, color: lit ? P.success : P.danger, whiteSpace: "nowrap" }}>
        {text}
      </div>
    </div>
  );
};

const B1Drawn: React.FC = () => {
  const P = usePalette();
  const letters = ["O", "M", "L", "I", "N", "U", "A"];
  return (
    <>
      <Arrive at={B1 + 4} kind="wipe" box={{ x: 90, y: 58, w: 700, h: 30 }} dur={0.4}>
        <div style={{ position: "absolute", left: 90, top: 58, fontSize: 20, fontWeight: 800, letterSpacing: 2.5, color: ACCENT }}>
          BOYTASKS — kitchen TV calendar, Cloudflare Workers
        </div>
      </Arrive>
      <Arrive at={B1 + 4} kind="wipe" box={{ x: 90, y: 110, w: 1100, h: 60 }} dur={0.45}>
        <div style={{ position: "absolute", left: 90, top: 110, fontSize: 40, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>
          SEVEN DAYS. ONE SCREEN.
        </div>
      </Arrive>
      <Arrive at={B1 + 24} kind="rise" box={{ x: 90, y: 178, w: 1100, h: 40 }}>
        <div style={{ position: "absolute", left: 90, top: 178, fontSize: 22, fontWeight: 600, color: ACCENT }}>
          Every event: a clipped title. No location. No real faces.
        </div>
      </Arrive>
      {letters.map((l, i) => {
        const x = 90 + i * 150;
        return (
          <Arrive key={l} at={B1 + 44 + i * 6} kind="rise" box={{ x, y: 250, w: 136, h: 300 }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: 250,
                width: 136,
                height: 300,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 6,
                padding: 10,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: P.accentBg,
                  border: `2px solid ${P.accentEdge}`,
                  color: P.accent,
                  fontSize: 14,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                {l}
              </div>
              <div
                style={{
                  width: "100%",
                  height: 18,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  overflow: "hidden",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: 11,
                  padding: "2px 6px",
                  whiteSpace: "nowrap",
                }}
              >
                Soccer practic…
              </div>
            </div>
          </Arrive>
        );
      })}
    </>
  );
};

const B5Drawn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sc = punchScale(sec(frame, B5 + 10, fps), 0);
  const lines: LogLine[] = [
    { t: "01", text: "7 columns shrank to 3", tone: "success" },
    { t: "02", text: "each chip: full title + venue + city", tone: "ink" },
    { t: "03", text: "week number moved inside the date cell", tone: "muted" },
    { t: "04", text: "kid header: real photo, not a flat circle", tone: "success" },
    { t: "05", text: "up to 8 photos per kid, rotating", tone: "accent" },
    { t: "06", text: "no photos yet? falls back to the circle", tone: "muted" },
    { t: "07", text: "result: 3 days you can actually read", tone: "success" },
  ];
  return (
    <>
      {frame >= B5 + 10 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 70,
            width: 1280,
            textAlign: "center",
            fontSize: 56,
            fontWeight: 800,
            color: "#fff",
            transform: `scale(${sc})`,
          }}
        >
          7 → 3
        </div>
      )}
      <LogWindow lines={lines} title="boytasks — kiosk calendar" from={B5 + 20} every={20} opacity={1} />
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, drawn: seven cramped columns */}
      {cut(frame, B1, B2) === 1 && <B1Drawn />}

      {/* b2 — the fix, drawn schematic (WAVE D fix: dropped the live backdrop of the write-up
          page — its own background prose was unreadable at clip size; the schematic's own
          real name, CalendarStrip.tsx, is the evidence instead) */}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          from: "Seven columns, one line each",
          to: "Three columns, full chip",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Rebuilt in React", "Three days on screen", "CalendarStrip.tsx — the calendar's code"],
        }}
      />

      {/* b3 — the chip grows (WAVE D fix: same unreadable write-up prose problem as b2, same
          fix — dropped the live backdrop, drawn on a clean dark plate instead) */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          line1: "Every chip gets a venue line",
          line2: "full title plus the city, not just a time",
          keywords: ["venue", "full title"],
        }}
      />

      {/* b4 — the kid header, over the features hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub1" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          wrong: "Flat colored circle with an initial",
          right: "Real photo, cycling up to 8 per kid",
          label: "KID HEADER",
        }}
      />

      {/* b5 — the result, drawn, holds to the end */}
      {frame >= B5 && <B5Drawn />}

      <SidebarNarrative />
    </AbsoluteFill>
  );
};

export const FeatureCalendarStripGrowsUpB40: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
