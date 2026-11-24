// FeatureDadsRealGpsHoursB87 — feature b87 — archetype 1 timeline, mood sand —
// 1280x720, 957 frames @ 30fps, VOICE-SYNCED. Motion direction v2 (feature-motion skill).
//
// GPS Work Report: hours were tracked by GPS geofence, but the only number
// that ever mattered for pay was whatever ended up on the payslip — no way to
// see, day by day, whether the hours the payslip paid for matched the hours
// GPS actually recorded. A new reconciliation function reads the payslip's
// GPS arrival times plus its training/extra/backpay lines, recomputes each
// day's shift, and tags every day against what the payslip's own lines
// cover. The work report now shows this day by day, with any kroner
// difference highlighted in red.
//
// The commits handed to this batch (2cd9d31/4c024eb/ebc36f8, KioskFrame.tsx /
// school calendar) do not say anything the b87 beats say — none is shown;
// every beat draws the mechanism from the feature's own problem/solution/
// result text instead, per the viewer-test rule.
//
// Beat → effect (data only from the feature row):
// b1 15-231    "GPS tracked, payday only ever showed one number"
//              titleTakeover over the feature's own page — names the tool.
// b2 231-373   "no way to tell if that number matched the hours worked"
//              keywordCaption over the hub.
// b3 373-546   "work report compares GPS time against the payslip, day by day"
//              pipelineFlow over the page — the real recompute steps. One
//              small tech gloss sits beside it ("hours worked beyond shift").
// b4 546-744   "training, extra, unpaid — every day gets tagged"
//              cornerTags over the hub — the four real tag kinds.
// b5 744-957   "any gap between worked and paid now shows up in red"
//              drawn: a LogWindow with the real reconciliation mechanism,
//              ending on the kroner gap flagged red, holds bright to END.
//
// Persistent element: the day-by-day timeline (archetype 1), b1 through b5 —
// five day nodes start unmarked, light up as GPS is imported (b3), take their
// tag colour (b4), and the mismatched day flags red (b5).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b87.json";

const B1 = 15;
const B2 = 231;
const B3 = 373;
const B4 = 546;
const B5 = 744;
const END = 957;

/** Accent tuned for the dark stage (sand's native #B4531F is too dark on a plate). */
const ACCENT = "#F08A4B";
const STAGE = "#1C1610";

// Timeline geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 46;
const TRACK_X0 = 300;
const TRACK_X1 = 1190;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TAGS = ["Training", "Normal", "Extra", "Normal", "Unpaid"];
const MISMATCH_IDX = 4;
const dayX = (i: number) => TRACK_X0 + (i * (TRACK_X1 - TRACK_X0)) / (DAYS.length - 1);

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;
  const tagTone = (tag: string) => (tag === "Training" ? P.accent : tag === "Extra" ? P.success : tag === "Unpaid" ? P.danger : P.muted);

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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: 220 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>WORK REPORT</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            GPS hours
            <br />
            vs payslip
          </div>
        </div>
        <div style={{ position: "absolute", left: TRACK_X0 - 10, top: LINE_Y - 1, width: TRACK_X1 - TRACK_X0 + 20, height: 2, background: P.border }} />
      </Arrive>

      {DAYS.map((day, i) => {
        const x = dayX(i);
        const litAt = B3 + i * 18;
        const taggedAt = B4 + i * 18;
        const lit = frame >= litAt;
        const tagged = frame >= taggedAt;
        const tag = TAGS[i];
        const isMismatch = i === MISMATCH_IDX;
        const flashAt = B5 + 60;
        const flashing = isMismatch && frame >= flashAt;
        const pulse = 0.6 + 0.4 * Math.sin(frame / 5);
        const tone = tagged ? tagTone(tag) : lit ? P.accent : P.muted;
        return (
          <Arrive key={day} at={B1 + 34 + i * 6} kind="rise" box={{ x: x - 40, y: LT.y + 10, w: 80, h: 70 }}>
            <div style={{ position: "absolute", left: x - 40, top: LT.y + 10, width: 80, textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: P.ink, letterSpacing: 1 }}>{day}</div>
              <div
                style={{
                  margin: "6px auto 0",
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: tone,
                  opacity: flashing ? pulse : 1,
                  boxShadow: flashing ? `0 0 0 4px ${P.dangerBg}` : "none",
                }}
              />
              <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6, color: tagged ? tone : P.muted }}>
                {tagged ? tag : lit ? "checking…" : "?"}
              </div>
              {flashing && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: P.danger,
                    marginTop: 2,
                    transform: `scale(${punchScale(sec(frame, flashAt, fps), 0)})`,
                  }}
                >
                  gap!
                </div>
              )}
            </div>
          </Arrive>
        );
      })}
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "read", text: "payslip: GPS arrivals + training/extra/backpay lines", tone: "ink" },
  { t: "calc", text: "recompute each day: worked, break, over-norm minutes", tone: "ink" },
  { t: "tag", text: "day → training | extra | unpaid | normal", tone: "accent" },
  { t: "sum", text: "totals: GPS worked time vs money actually paid", tone: "ink" },
  { t: "cmp", text: "GPS hours ≠ paid hours on one day this week", tone: "danger" },
  { t: "flag", text: "kroner gap highlighted RED — impossible to miss", tone: "danger" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — one number, no proof, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "One number. No proof.", kicker: "GPS Work Report — Dad's hours vs the payslip" }}
      />

      {/* b2 — no way to check it matched, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "No way to check",
          line2: "if the payslip matched the hours he actually worked",
          keywords: ["check", "matched"],
        }}
      />

      {/* b3 — the real recompute steps, over the page */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.25 }} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["GPS arrival logged", "Shift recomputed", "Day compared to payslip"],
          result: "Day by day, not just one total",
          system: "Work report",
        }}
      />
      {frame >= B3 + 100 && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 560,
            fontSize: 18,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.78)",
            opacity: tween(sec(frame, B3 + 100, fps), 0, 0.3, ease.power3Out),
          }}
        >
          over-norm — hours worked beyond shift
        </div>
      )}

      {/* b4 — the four real tag kinds, over the hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="cornerTags"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Every day gets a tag",
          tags: ["Training", "Extra hours", "Unpaid time", "Normal pay"],
        }}
      />

      {/* b5 — the result: the real gap, drawn as a worker log; no page/hub here (gate 2) */}
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
              Any gap now shows up in red.
            </div>
          </Arrive>
          <LogWindow
            lines={LOG_LINES}
            title="work-report.log"
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

export const FeatureDadsRealGpsHoursB87: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
