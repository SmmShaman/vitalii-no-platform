// FeatureNorwegianSchoolCurriculumBackboneB44 — feature b44 — 1280x720, 973 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real Boytasks feature page/hub as evidence where available, one owner of the
// frame, a reading hold at the end of every beat, cuts not fades (cut()).
//
// Beat → effect (data only from the feature row — no commits exist for b44):
// b1 15-221   "my task generator built homework from memory and weak spots — never
//             checking what classes were studying that week"
//             titleTakeover over the feature's own page (backdrop "page"). Names
//             the product (Boytasks) in the kicker. The zoom-in trail's first
//             node (BOYTASKS) activates.
// b2 221-368  "homework should match what's taught in class, for each subject,
//             for every kid"
//             cornerTags: the claim + four facts, over the features hub
//             (backdrop "hub"). Trail zooms to node 2 (THIS WEEK).
// b3 368-506  "like teaching last year's lesson plan while the real class moved on"
//             drawn stale-calendar analogy (no catalog effect — a metaphor beat),
//             single codepoint 📅, a week counter ticking forward continuously
//             beside a frozen one for the whole beat.
// b4 506-717  "now a nightly Cloudflare Workers routine reads the real curriculum
//             and builds each day's practice from that week's unit"
//             pipelineFlow (resolve unit → build practice → 70/30 split) over the
//             page's solution section (backdrop "page2"). Trail zooms to node 3
//             (CURRICULUM UNIT).
// b5 717-973  "it's built from 634 real lesson units across three subjects and
//             nine grades, matched to every child"
//             drawn LogWindow, 6 real lines from the feature's own numbers,
//             holds to the end. Trail zooms to its final node (634 UNITS · 3
//             SUBJECTS · 9 GRADES).
//
// Persistent element: zoom-in drill trail (archetype 2) — 4 nodes narrowing from
// the product down to the exact number, lives at y>=606, b1 through b5. Each
// beat transition zooms one level deeper: the active node is highlighted full
// size, passed nodes shrink and mute, a chevron marks the drill direction.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b44.json";

const B1 = 15;
const B2 = 221;
const B3 = 368;
const B4 = 506;
const B5 = 717;
const END = 973;

const ACCENT = "#0E7490";
const STAGE = "#0B1620";

const LT = { x: 40, y: 606, w: 1200, h: 92 };
const NODE_X = [60, 300, 540, 780];
const NODE_W = [200, 200, 200, 440];
const NODE_LABEL = ["BOYTASKS", "THIS WEEK", "CURRICULUM UNIT", "634 UNITS · 3 SUBJECTS · 9 GRADES"];
const ACTIVATE_AT = [B1 + 10, B2 + 10, B4 + 10, B5 + 10];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const DrillTrail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  let furthest = -1;
  for (let i = 0; i < ACTIVATE_AT.length; i++) {
    if (frame >= ACTIVATE_AT[i]) furthest = i;
  }

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {[0, 1, 2, 3].map((i) => {
        if (furthest < i) return null;
        const active = i === furthest;
        const flipT = sec(frame, ACTIVATE_AT[i], fps);
        const sc = active ? punchScale(flipT, 0) : 0.86;
        return (
          <React.Fragment key={i}>
            <Arrive at={ACTIVATE_AT[i]} kind="rise" box={{ x: NODE_X[i], y: LT.y + 20, w: NODE_W[i], h: 56 }}>
              <div
                style={{
                  position: "absolute",
                  left: NODE_X[i],
                  top: LT.y + 20,
                  width: NODE_W[i],
                  height: 56,
                  borderRadius: 4,
                  background: active ? P.accentBg : P.chipBg,
                  border: `2px solid ${active ? P.accent : P.border}`,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 10px",
                  transform: `scale(${sc})`,
                  boxShadow: active ? "6px 6px 0 rgba(0,0,0,0.35)" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: active ? 15 : 12,
                    fontWeight: 800,
                    letterSpacing: 1.2,
                    color: active ? P.accent : P.muted,
                    textAlign: "center",
                  }}
                >
                  {NODE_LABEL[i]}
                </span>
              </div>
            </Arrive>
            {i < 3 && furthest >= i + 1 && (
              <div
                style={{
                  position: "absolute",
                  left: NODE_X[i] + NODE_W[i],
                  top: LT.y + 34,
                  width: NODE_X[i + 1] - (NODE_X[i] + NODE_W[i]),
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: P.muted,
                }}
              >
                ›
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const STALE_SUBJECTS = ["Maths · wk 12", "Norwegian · wk 12", "English · wk 12"];
const REAL_SUBJECTS = ["Maths", "Norwegian", "English"];

const StalePlanAnalogy: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const t = sec(frame, from, fps);
  const inAmt = tween(t, 0, 0.3, ease.power3Out);
  const chipsIn = tween(t, 0.2, 0.5, ease.power3Out);
  const progress = Math.min(1, t / (dur / fps));
  const liveWeek = 12 + Math.floor(progress * 35);

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 1280, textAlign: "center", opacity: inAmt }}>
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 2.4, color: P.muted }}>
          3 SUBJECTS · 9 GRADES · EVERY WEEK
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          top: 110,
          width: 340,
          height: 280,
          borderRadius: 10,
          border: `6px solid ${P.border}`,
          background: "rgba(255,255,255,0.04)",
          opacity: inAmt,
          transform: `scale(${mix(inAmt, 0.9, 1)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 56 }}>📅</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: P.muted, marginTop: 8 }}>PLAN</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", marginTop: 4 }}>Week 12</div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6, opacity: chipsIn }}>
          {STALE_SUBJECTS.map((s) => (
            <div
              key={s}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: P.muted,
                border: `1px dashed ${P.muted}`,
                borderRadius: 4,
                padding: "3px 10px",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 610, top: 220, width: 60, textAlign: "center", opacity: inAmt, fontSize: 30, fontWeight: 800, color: P.muted }}>
        ≠
      </div>

      <div
        style={{
          position: "absolute",
          left: 820,
          top: 110,
          width: 340,
          height: 280,
          borderRadius: 10,
          border: `6px solid ${ACCENT}`,
          background: "rgba(255,255,255,0.04)",
          opacity: inAmt,
          transform: `scale(${mix(inAmt, 0.9, 1)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT }}>REAL CLASS</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", marginTop: 4 }}>Week {liveWeek}</div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6, opacity: chipsIn }}>
          {REAL_SUBJECTS.map((s) => (
            <div
              key={s}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: ACCENT,
                border: `1px solid ${ACCENT}`,
                borderRadius: 4,
                padding: "3px 10px",
                textAlign: "center",
              }}
            >
              {s} · wk {liveWeek}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, top: 500, width: 1280, textAlign: "center", opacity: inAmt }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", fontFamily, letterSpacing: 0.5 }}>
          Still Teaching Last Year&apos;s Plan
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: P.muted, fontFamily, marginTop: 10 }}>
          The real class already moved on
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the generator built homework from stale memory, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ kicker: "Boytasks — screen time gated by finishing school tasks", title: "Built From Memory, Not Class" }}
      />

      {/* b2 — why it matters: homework should match class, every subject, every kid */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Match what's taught in class — every subject, every kid",
          tags: ["Norwegian", "English", "Maths", "9 grades"],
        }}
      />

      {/* b3 — the stale-calendar analogy, drawn */}
      {cut(frame, B3, B4) === 1 && <StalePlanAnalogy from={B3} dur={B4 - B3} />}

      {/* b4 — the fix: nightly Cloudflare Workers routine reads the real curriculum */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Resolve this week's unit", "Build today's practice", "70% unit / 30% review"],
          system: "Cloudflare Workers — runs nightly",
          result: "Matched to class, every week",
        }}
      />

      {/* b5 — the result: 634 units, 3 subjects, 9 grades, holds to the end */}
      {frame >= B5 && (
        <LogWindow
          title="curriculum_worker"
          from={B5}
          every={24}
          opacity={1}
          win={{ x: 150, y: 110, w: 980, h: 480 }}
          fontSize={22}
          lines={[
            { t: "03:00", text: "curriculum_worker resolve -> week 34, grade 6, subject: Maths", tone: "accent" },
            { t: "03:00", text: "unit index: 634 lesson units (3 subjects, grades 1-9)", tone: "success" },
            { t: "03:00", text: "practice built: 70% this week's unit / 30% review", tone: "success" },
            { t: "03:00", text: "worker bundle size: 0.9MB", tone: "muted" },
            { t: "03:00", text: "admin preview: curriculum match confirmed", tone: "accent" },
            { t: "03:00", text: "tasks generated: 3 kids, every subject matched", tone: "success" },
          ]}
        />
      )}

      <DrillTrail />
    </AbsoluteFill>
  );
};

export const FeatureNorwegianSchoolCurriculumBackboneB44: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
