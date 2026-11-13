// FeatureGeofenceDadsPhoneClocksB82 — feature b82 — 1280x720, 950 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → picture (data only from this feature's own page + the given commits):
// b1 15-198   "Pay, never recorded" — titleTakeover over the feature's own
//             LiveBackdrop (shot "page"). Flow-map band enters at DEPOT only, every
//             other node dim — nothing is tracked yet.
// b2 198-360  "Redone by hand, every month, no record" — cornerTags, drawn only (the
//             manual math has no public page). Route unchanged at DEPOT.
// b3 360-543  "Phone leaves the depot, geofence fires, Worker logs it" — pipelineFlow
//             over the feature's own page scrolled further (shot "page2"). Route lights
//             GEOFENCE then WORKER in sequence during this beat — this is the fix.
// b4 543-730  "Split pay, skip the break, no typing" — handoffExplain, drawn only.
//             Route advances to WORK_SHIFTS — the pay is now computed, not typed.
// b5 730-950  "A parent opens the month on the kiosk" — fully drawn: the route reaches
//             KIOSK and the whole map goes BIG, plus a LogWindow (work_shifts) listing
//             this feature's own real columns. Holds to END at full brightness, no fade.
//             Neither the feature page nor the hub appears.
//
// Persistent element: the DEPOT→GEOFENCE→WORKER→WORK_SHIFTS→KIOSK route (archetype 4) —
// small in the lower-third band (y >= 600) for b1-b4 while a catalog effect owns the
// stage above it, BIG only in b5 (the one beat with no competing catalog effect).
// Gate 2: b5 ends on a drawn result (route + LogWindow), not a page.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b82.json";

const B1 = 15;
const B2 = 198;
const B3 = 360;
const B4 = 543;
const B5 = 730;
const END = 950;

const ACCENT = "#7C3AED";
const STAGE = "#0F172A";

/** Lower-third band (1280x720) — the 5-node route while a catalog effect sits
    above it (b1-b4). */
const BAND = { x: 40, y: 605, w: 1200, h: 100 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** small labelled fact badge for an otherwise-empty top corner — used on the
    drawn b4 beat to add frame coverage without touching the shared effect. */
const CornerFact: React.FC<{ value: string; label: string; corner: "tl" | "tr"; from: number; to: number }> = ({
  value,
  label,
  corner,
  from,
  to,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < from || frame >= to) return null;
  const t = tween(sec(frame, from, fps), 0, 0.3, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        top: 26,
        [corner === "tl" ? "left" : "right"]: 48,
        textAlign: corner === "tl" ? "left" : "right",
        opacity: t,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 800, color: P.accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: P.muted, marginTop: 4 }}>{label}</div>
    </div>
  );
};

const NODES = ["DEPOT", "GEOFENCE", "WORKER", "WORK_SHIFTS", "KIOSK"];

/** discrete breakpoints — the route advances in steps, not a continuous crawl. */
const BREAKPOINTS = [
  { at: B1, idx: 0 },
  { at: B3 + 20, idx: 1 },
  { at: B3 + 90, idx: 2 },
  { at: B4 + 40, idx: 3 },
  { at: B5 + 30, idx: 4 },
];

const activeIdxAt = (frame: number) => {
  let idx = 0;
  for (const bp of BREAKPOINTS) {
    if (frame >= bp.at) idx = bp.idx;
  }
  return idx;
};

/** archetype 4 — the geofence→pay route, present every beat, BIG only in b5
    (the one beat with no catalog effect competing for the upper frame). */
const FlowMapFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const activeIdx = activeIdxAt(frame);
  const justLitAt = BREAKPOINTS.find((bp) => bp.idx === activeIdx)?.at ?? B1;
  const punch = Math.max(0, punchScale(sec(frame, justLitAt, fps), 0) - 1);

  if (frame >= B5) {
    const t = tween(sec(frame, B5 + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div style={{ position: "absolute", left: 80, top: 150, width: 1040, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(226,232,240,0.6)" }}>
          SHIFT PIPELINE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 20 }}>
          {NODES.map((n, i) => {
            const lit = i <= activeIdx;
            const nodePunch = i === activeIdx ? Math.max(0, punchScale(sec(frame, B5 + 4, fps), 0) - 1) : 0;
            return (
              <React.Fragment key={n}>
                <div
                  style={{
                    padding: "16px 22px",
                    borderRadius: 4,
                    background: lit ? P.successBg : P.card,
                    border: `2.5px solid ${lit ? P.success : P.muted}`,
                    color: lit ? P.success : P.muted,
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: 1,
                    whiteSpace: "nowrap",
                    transform: `scale(${1 + nodePunch * 0.15})`,
                    boxShadow: "4px 4px 0 rgba(0,0,0,0.35)",
                  }}
                >
                  {n}
                </div>
                {i < NODES.length - 1 && (
                  <div style={{ width: 44, height: 3, background: i < activeIdx ? P.success : P.muted, opacity: 0.6 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 28,
            padding: "10px 22px",
            borderRadius: 4,
            background: P.successBg,
            border: `2px solid ${P.success}`,
            color: P.success,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          GEOFENCE TO KIOSK, NO BUTTON
        </div>
      </div>
    );
  }

  return (
    <Arrive at={B1 + 4} kind="wipe" box={BAND} dur={0.4}>
      <div style={{ position: "absolute", left: BAND.x, top: BAND.y, width: BAND.w, fontFamily }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {NODES.map((n, i) => {
            const lit = i <= activeIdx;
            return (
              <React.Fragment key={n}>
                <div
                  style={{
                    padding: "7px 14px",
                    borderRadius: 4,
                    background: lit ? P.successBg : P.card,
                    border: `1.5px solid ${lit ? P.success : P.muted}`,
                    color: lit ? P.success : P.muted,
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                    transform: i === activeIdx ? `scale(${1 + punch * 0.15})` : undefined,
                    boxShadow: "3px 3px 0 rgba(0,0,0,0.3)",
                  }}
                >
                  {n}
                </div>
                {i < NODES.length - 1 && (
                  <div style={{ width: 22, height: 2, background: i < activeIdx ? P.success : P.muted, opacity: 0.6 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — small product plate naming the real product and the real page, over the
    LiveBackdrop + titleTakeover. Carries the clip's one emoji (single codepoint). */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B1, B2) !== 1) return null;
  const t = tween(sec(frame, B1 + 4, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 24,
        padding: "7px 16px",
        background: "rgba(15,23,42,0.85)",
        border: "1.5px solid #C4B5FD",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        color: "#F8FAFC",
        opacity: t,
        maxWidth: 580,
        lineHeight: 1.4,
        fontFamily,
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>📍 VITALII.NO — BOYTASKS</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>a geofence on dad's phone clocks his delivery shifts</span>
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { text: "work_shifts table (own service key only)", tone: "accent" },
  { text: "geofence exit -> work-event route logged", tone: "success" },
  { text: "pay split: before 06:00 / after 06:00", tone: "ink" },
  { text: "unpaid break over 330 min", tone: "muted" },
  { text: "0 shifts typed by hand this month", tone: "danger" },
  { text: "kiosk report: every day, every reason", tone: "success" },
];

/** b5 — the result, fully drawn: LogWindow with this feature's own real fields.
    Holds to END at full brightness, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const captionIn = tween(t, 1.3, 0.3, ease.power2Out);
  return (
    <>
      <LogWindow
        lines={LOG_LINES}
        title="work_shifts"
        from={B5 + 14}
        every={16}
        opacity={1}
        win={{ x: 680, y: 56, w: 540, h: 470 }}
        fontSize={18}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 540,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#E2E8F0",
          opacity: captionIn,
          fontFamily,
        }}
      >
        A parent opens the whole month on the kiosk and sees exactly which days counted, and why.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{ title: "Pay, never recorded", kicker: "Dad's delivery shifts start at a fixed 02:15" }}
      />
      <ProductPlate />

      {/* b2 — the manual pain, over the problem paragraph of the feature's own page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.62}
        data={{
          statement: "Shift pay existed only in memory",
          tags: ["Redone by hand", "Every single month", "No record to check", "0 shifts typed by hand"],
        }}
      />

      {/* b3 — the fix, over the feature's own page scrolled further */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.42}
        data={{
          steps: ["Phone leaves the depot", "Geofence event fires", "Cloudflare Worker logs it"],
          result: "Shift recorded the moment he leaves",
          system: "work-event route (Cloudflare Worker)",
        }}
      />

      {/* b4 — the payoff, over the "how it works" section that describes the split */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.62}
        data={{
          from: "Manual math, after the fact",
          to: "Split pay + break rule, automatic",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Before/after 06:00 tariffs", "Unpaid break over 330 min", "No typing required", "Kiosk report, every day"],
        }}
      />
      <CornerFact value="2" label="PAY PERIODS, SPLIT AT 06:00" corner="tl" from={B4} to={B5} />
      <CornerFact value="330min" label="UNPAID BREAK THRESHOLD" corner="tr" from={B4} to={B5} />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <FlowMapFigure />
    </AbsoluteFill>
  );
};

export const FeatureGeofenceDadsPhoneClocksB82: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
