// FeatureEverySchoolSubjectDayB86 — feature b86 — archetype 0 split duel, mood mint —
// 1280x720, 863 frames @ 30fps, VOICE-SYNCED. Motion direction v2 (feature-motion skill).
//
// The kiosk calendar used to show a day as nothing but its homework card — no
// assignment, no screen at all. A Cloudflare Workers routine now loads the
// child's real timetable in order and attaches homework only to the subject
// it belongs to. A second, smaller bug lived in the same card: the homework
// line itself used to scroll sideways off the edge; it now shrinks to fit,
// down to 55% size, before it is ever cut off.
//
// The three given commits (2cd9d31/4c024eb/ebc36f8, all KioskFrame.tsx) do
// read close to this feature's own words, but no GitHub URL was verified for
// recording this wave — only the feature's own page and the hub were. So no
// diff is shown; every beat draws the mechanism from the feature's own
// problem/solution/result text instead, per the viewer-test rule.
//
// Beat → effect (data only from the feature row):
// b1 15-151    "parent checks the calendar, sees nothing but homework"
//              titleTakeover over the feature's own page — names the product.
// b2 151-299   "blank screen, as if school never happened"
//              keywordCaption, still over the page (scrolled further).
// b3 299-501   "calendar lists every subject in timetable order, homework
//              attached only where it exists" — pipelineFlow, the real
//              recompute steps. One small tech gloss sits beside it
//              ("timetable — the real school schedule").
// b4 501-657   "homework line used to scroll sideways, hard to read"
//              cornerTags over the page's second bug section.
// b5 657-863   "now it shrinks to fit, down to 55%, before it's cut off"
//              drawn: a LogWindow with the real fit-to-width mechanism,
//              ending on the 55% shrink stat held bright to END.
//
// Persistent element: the split-duel lower third (archetype 0) — a BLANK
// half (danger) vs an ALL SUBJECTS half (success), the divider sliding right
// as the timetable fix lands (b3) and again as the homework line is also
// fixed (b5). A second, independent "homework" pill overflows/wobbles
// sideways through b1-b4, then shrinks to 55% and docks cleanly at b5 —
// the clip's second mechanism, never left unchanged for more than one beat.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b86.json";

const B1 = 15;
const B2 = 151;
const B3 = 299;
const B4 = 501;
const B5 = 657;
const END = 863;

/** Accent tuned for the dark stage (mint's #0B7A5A reads flat on a plate). */
const ACCENT = "#3FD69B";
const STAGE = "#0C1A14";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const PLATE_W = 190;
const SPLIT_X = LT.x + PLATE_W + 22; // 252
const SPLIT_W = LT.x + LT.w - 12 - SPLIT_X;
const SPLIT_Y = LT.y + 12;
const SPLIT_H = LT.h - 24;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Divider fraction across the split zone: starts near the left (blank days
  // own almost everything), grows once the timetable fix lands (b3), grows
  // again once the homework-line fix also lands (b5).
  const t1 = tween(sec(frame, B3 + 40, fps), 0, 160 / fps, ease.power3InOut);
  const t2 = tween(sec(frame, B5 + 20, fps), 0, 120 / fps, ease.power3InOut);
  const frac = mix(t2, mix(t1, 0.14, 0.55), 0.85);
  const dividerX = SPLIT_X + frac * SPLIT_W;
  const orderW = SPLIT_X + SPLIT_W - dividerX;
  const blankW = dividerX - SPLIT_X;

  // The homework pill: oversized and wobbling (depicting "scrolls sideways")
  // through b1-b4, then shrinks to 55% width and settles flat for b5.
  const shrinkT = tween(sec(frame, B5 + 40, fps), 0, 140 / fps, ease.power3InOut);
  const baseW = 150;
  const pillW = mix(shrinkT, baseW, baseW * 0.55);
  const wobble = frame < B5 + 40 ? Math.sin(frame * 0.16) * 14 : 0;
  const fitted = frame >= B5 + 40 + 100;
  const percentOn = frame >= B5 + 60;

  const subjectsOn = frame >= B3 + 60;

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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: PLATE_W - 32 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>BOYTASKS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            screen-time &amp;
            <br />
            task system
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, marginTop: 4 }}>Cloudflare Workers</div>
        </div>
      </Arrive>

      {/* blank half */}
      <Arrive at={B1 + 20} kind="wipe" box={{ x: SPLIT_X, y: SPLIT_Y, w: SPLIT_W, h: SPLIT_H }} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: SPLIT_X,
            top: SPLIT_Y,
            width: blankW,
            height: SPLIT_H,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 10, top: 6, fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: P.danger, whiteSpace: "nowrap" }}>
            BLANK
          </div>
          <div style={{ position: "absolute", left: 10, top: SPLIT_H - 22, fontSize: 11, fontWeight: 600, color: P.danger, whiteSpace: "nowrap" }}>
            no homework, no screen
          </div>
        </div>

        {/* all-subjects half */}
        <div
          style={{
            position: "absolute",
            left: dividerX,
            top: SPLIT_Y,
            width: orderW,
            height: SPLIT_H,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 10, top: 6, fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: P.success, whiteSpace: "nowrap" }}>
            ALL SUBJECTS
          </div>
          {subjectsOn &&
            ["Math", "Norsk", "Eng", "PE", "Art"].map((s, i) => {
              const dx = 10 + i * 36;
              if (dx > orderW - 20) return null;
              return (
                <div
                  key={s}
                  style={{
                    position: "absolute",
                    left: dx,
                    top: SPLIT_H - 28,
                    fontSize: 9,
                    fontWeight: 700,
                    color: P.success,
                    transform: `scale(${punchScale(sec(frame, B3 + 60 + i * 4, fps), 0)})`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </div>
              );
            })}
        </div>

        {/* divider bar */}
        <div
          style={{
            position: "absolute",
            left: dividerX - 2,
            top: SPLIT_Y - 4,
            width: 4,
            height: SPLIT_H + 8,
            background: P.ink,
          }}
        />
      </Arrive>

      {/* the independent homework-line pill: overflows + wobbles, then shrinks to 55% and fits */}
      <Arrive at={B1 + 30} kind="rise" box={{ x: LT.x + LT.w - 190, y: LT.y + LT.h - 30, w: 190, h: 20 }}>
        <div
          style={{
            position: "absolute",
            left: LT.x + LT.w - 190,
            top: LT.y + LT.h - 30,
            width: 190,
            height: 20,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: (190 - pillW) / 2 + wobble,
              top: 0,
              width: pillW,
              height: 20,
              borderRadius: 4,
              background: fitted ? P.successBg : P.dangerBg,
              border: `1.5px solid ${fitted ? P.successEdge : P.dangerEdge}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: fitted ? 9 : 10,
              fontWeight: 800,
              color: fitted ? P.success : P.danger,
              whiteSpace: "nowrap",
            }}
          >
            HOMEWORK
          </div>
        </div>
        {percentOn && (
          <div
            style={{
              position: "absolute",
              left: LT.x + LT.w - 190,
              top: LT.y + LT.h - 50,
              width: 190,
              textAlign: "center",
              fontSize: 13,
              fontWeight: 800,
              color: P.ink,
              transform: `scale(${punchScale(sec(frame, B5 + 60, fps), 0)})`,
            }}
          >
            55%
          </div>
        )}
      </Arrive>
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "load", text: "timetable fetched in its real weekday order", tone: "ink" },
  { t: "slot", text: "each subject rendered in its own slot", tone: "ink" },
  { t: "attach", text: "homework attached only where a subject has it", tone: "accent" },
  { t: "measure", text: "homework line width measured against the card", tone: "ink" },
  { t: "overflow", text: "line overflowed the card — used to scroll sideways", tone: "danger" },
  { t: "fit", text: "font scaled to 55% — fits before it's ever cut off", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — nothing but homework, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Nothing but homework.", kicker: "Boytasks — school calendar, Cloudflare Workers" }}
      />

      {/* b2 — blank screen, as if school never happened */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "A blank screen", line2: "as if school never happened", keywords: ["blank", "never happened"] }}
      />

      {/* b3 — the fix: real timetable order, homework only where it exists */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Timetable loaded in its real order", "Every subject gets its slot", "Homework attached only where it exists"],
          result: "A full day, not just homework",
          system: "School calendar",
        }}
      />
      {frame >= B3 + 110 && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 560,
            fontSize: 18,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.78)",
            opacity: tween(sec(frame, B3 + 110, fps), 0, 0.3, ease.power3Out),
          }}
        >
          timetable — the real school schedule
        </div>
      )}

      {/* b4 — the homework line itself was hard to read */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page4" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.35 }} />}
      <MotionInsert
        effect="cornerTags"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "The homework line itself was hard to read",
          tags: ["Scrolled sideways", "Cut off mid-word", "No width check", "Easy to miss"],
        }}
      />

      {/* b5 — the result: shrinks to fit, 55%, drawn as a worker log; no page/hub here (gate 2) */}
      {frame >= B5 && (
        <AbsoluteFill style={{ background: "rgba(8,8,8,0.66)" }}>
          <Arrive at={B5 + 6} kind="wipe" box={{ x: 150, y: 120, w: 980, h: 60 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 150,
                top: 120,
                width: 980,
                fontSize: 34,
                fontWeight: 800,
                color: "#fff",
                fontFamily,
              }}
            >
              Shrinks to fit. Never cut off.
            </div>
          </Arrive>
          <LogWindow
            lines={LOG_LINES}
            title="kiosk-calendar.log"
            from={B5 + 40}
            every={16}
            opacity={1}
            win={{ x: 150, y: 196, w: 980, h: 450 }}
            fontSize={20}
          />
        </AbsoluteFill>
      )}

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureEverySchoolSubjectDayB86: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
