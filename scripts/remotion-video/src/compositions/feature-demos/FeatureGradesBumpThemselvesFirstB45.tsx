// FeatureGradesBumpThemselvesFirstB45 — feature b45 — 1280x720, 887 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real Boytasks feature page/hub as evidence where available, one owner of the
// frame, a reading hold at the end of every beat, cuts not fades (cut()).
//
// Beat → effect (data only from the feature row — no commits exist for b45):
// b1 15-191   "a week into school, still on last year's grade — I'd forgotten to bump them"
//             titleTakeover over the feature's own page (backdrop "page"). Names
//             the product (Boytasks) in the kicker. The ledger's three cells
//             wipe in showing grade 3/5/7, each flagged "pending".
// b2 191-367  "that number decides their lessons — forget it, a year goes to the wrong content"
//             cornerTags: the claim + four facts, over the features hub (backdrop "hub").
//             Each ledger cell gets a red "WRONG UNIT" tag, staggered.
// b3 367-509  "like forgetting to set the clocks forward — everything runs on old time"
//             drawn clock analogy (no catalog effect — a metaphor beat), single
//             codepoint ⏰, hands sweeping continuously for the whole beat.
// b4 509-675  "now a nightly cron checks the date and bumps every grade automatically"
//             pipelineFlow (check date → bump grade → log it) over the page's
//             solution section (backdrop "page2"). Ledger cells flip pending → done,
//             staggered, red tags fade, checkmarks punch in with the new grade.
// b5 675-887  "all three boys jumped a grade the same day it shipped — zero manual steps next year"
//             drawn LogWindow, 6 real lines from solution_en/result_en, holds to
//             the end. Ledger gets a final "0 manual steps" stamp beside the header.
//
// Persistent element: the grade ledger (archetype 5), lives at y>=606, b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b45.json";

const B1 = 15;
const B2 = 191;
const B3 = 367;
const B4 = 509;
const B5 = 675;
const END = 887;

const ACCENT = "#2563EB";
const STAGE = "#0F1A2E";

const LT = { x: 40, y: 606, w: 1200, h: 92 };
const CELL_W = 300;
const CELL_X = [302, 622, 942];
const GRADE_FROM = [3, 5, 7];
const GRADE_TO = [4, 6, 8];
const CELL_FLIP_AT = [B4 + 20, B4 + 54, B4 + 88];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Ledger: React.FC = () => {
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
            boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          }}
        />
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: 220 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>BOYTASKS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            grade ledger
            <br />
            3 kids, 1 field each
          </div>
        </div>
      </Arrive>

      {[0, 1, 2].map((i) => {
        const flipAt = CELL_FLIP_AT[i];
        const done = frame >= flipAt;
        const flipT = sec(frame, flipAt, fps);
        const sc = done ? punchScale(flipT, 0) : 1;
        const tagOn = frame >= B2 + 20 + i * 24 && frame < flipAt;
        return (
          <Arrive key={i} at={B1 + 20 + i * 10} kind="rise" box={{ x: CELL_X[i], y: LT.y + 14, w: CELL_W, h: 64 }}>
            <div
              style={{
                position: "absolute",
                left: CELL_X[i],
                top: LT.y + 14,
                width: CELL_W,
                height: 64,
                borderRadius: 4,
                background: done ? P.successBg : P.card,
                border: `2px ${done ? "solid" : "dashed"} ${done ? P.successEdge : P.muted}`,
                boxSizing: "border-box",
                padding: "8px 14px",
                transform: `scale(${sc})`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>CHILD {i + 1}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: done ? P.success : P.ink }}>
                  {done ? GRADE_TO[i] : GRADE_FROM[i]}
                </span>
                {!done && <span style={{ fontSize: 13, color: P.muted }}>pending</span>}
                {done && <span style={{ fontSize: 16, color: P.success }}>✓</span>}
              </div>
              {tagOn && (
                <div style={{ fontSize: 11, fontWeight: 800, color: P.danger, marginTop: 2 }}>WRONG UNIT</div>
              )}
            </div>
          </Arrive>
        );
      })}

      {frame >= B5 + 60 && (
        <div
          style={{
            position: "absolute",
            left: LT.x + 22,
            top: LT.y + 52,
            width: 220,
            fontSize: 14,
            fontWeight: 800,
            color: P.success,
            transform: `scale(${punchScale(sec(frame, B5 + 60, fps), 0)})`,
          }}
        >
          0 manual steps
        </div>
      )}
    </div>
  );
};

const CLOCK_ROWS = [
  { frozen: "Grade 3", real: "Grade 4" },
  { frozen: "Grade 5", real: "Grade 6" },
  { frozen: "Grade 7", real: "Grade 8" },
];

const ClockAnalogy: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const t = sec(frame, from, fps);
  const inAmt = tween(t, 0, 0.3, ease.power3Out);
  const panelIn = tween(t, 0.15, 0.45, ease.power3Out);
  const spin = (t / (dur / fps)) * 220;
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      <div
        style={{
          position: "absolute",
          left: 430,
          top: 56,
          width: 420,
          height: 420,
          borderRadius: 210,
          border: `6px solid ${P.accent}`,
          background: "rgba(255,255,255,0.04)",
          opacity: inAmt,
          transform: `scale(${mix(inAmt, 0.85, 1)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 4,
            height: 136,
            background: "#fff",
            transformOrigin: "50% 100%",
            transform: `translate(-50%,-100%) rotate(${spin}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 4,
            height: 94,
            background: P.accent,
            transformOrigin: "50% 100%",
            transform: `translate(-50%,-100%) rotate(${spin * 2.1}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 90,
            fontSize: 74,
            transform: "translate(-50%, 30px)",
            textAlign: "center",
          }}
        >
          ⏰
        </div>
      </div>

      <div style={{ position: "absolute", left: 60, top: 150, width: 300, opacity: panelIn, transform: `translateY(${mix(panelIn, 16, 0)}px)` }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.danger }}>STILL FROZEN</div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {CLOCK_ROWS.map((r, i) => (
            <div
              key={i}
              style={{
                borderRadius: 4,
                border: `2px dashed ${P.muted}`,
                background: P.card,
                padding: "10px 16px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: P.muted }}>CHILD {i + 1}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: P.ink, marginTop: 2 }}>{r.frozen}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", right: 60, top: 150, width: 300, opacity: panelIn, transform: `translateY(${mix(panelIn, 16, 0)}px)` }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.accent }}>REAL SCHOOL YEAR</div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {CLOCK_ROWS.map((r, i) => (
            <div
              key={i}
              style={{
                borderRadius: 4,
                border: `2px solid ${P.accentEdge}`,
                background: P.accentBg,
                padding: "10px 16px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: P.muted }}>CHILD {i + 1}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: P.accent, marginTop: 2 }}>{r.real}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, top: 500, width: 1280, textAlign: "center", opacity: inAmt }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: "#fff", fontFamily, letterSpacing: 0.5 }}>
          Forgot to set the clock forward
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, color: P.muted, fontFamily, marginTop: 10 }}>
          Everything keeps running on old time
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** b4 only — pipelineFlow's own chain sits in a mid-frame band; this fills the empty top
 *  margin (naming the nightly cron) and the narrow gap above the ledger strip. */
const CronFill: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < from) return null;
  const t = tween(sec(frame, from + 6, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>🌙</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.accent }}>NIGHTLY CRON</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 820 }}>
            Runs itself every night — checks today's date, bumps every grade, logs what happened
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 544,
          width: 1160,
          height: 46,
          borderRadius: 6,
          background: P.card,
          border: `2px solid ${P.accent}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingLeft: 20,
          fontSize: 15,
          fontWeight: 700,
          color: P.ink,
        }}
      >
        <span>✅</span>
        <span>Zero manual steps — it ships itself, every August</span>
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — forgot to bump the grade, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ kicker: "Boytasks — screen time gated by finishing school tasks", title: "I Forgot To Bump The Grade" }}
      />

      {/* b2 — why it matters: wrong content for a year */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "children.grade decides the lessons — miss it, a year runs on the wrong content",
          tags: ["grade 3/5/7", "wrong unit", "wrong band", "wrong bonus"],
        }}
      />

      {/* b3 — the daylight-saving analogy, drawn */}
      {cut(frame, B3, B4) === 1 && <ClockAnalogy from={B3} dur={B4 - B3} />}

      {/* b4 — the fix: nightly cron bumps every grade */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Check the date", "Bump every grade", "Log what happened"],
          system: "Nightly cron — runs itself, every night",
          result: "Zero manual steps",
        }}
      />
      {cut(frame, B4, B5) === 1 && <CronFill from={B4} />}

      {/* b5 — the result: all three boys bumped, holds to the end */}
      {frame >= B5 && (
        <LogWindow
          title="grade_bump_date worker"
          from={B5}
          every={24}
          opacity={1}
          win={{ x: 150, y: 110, w: 980, h: 480 }}
          fontSize={22}
          lines={[
            { t: "02:00", text: "grade_bump_date check -> today >= 2026-08-17", tone: "accent" },
            { t: "02:00", text: "grade_bump: child 1 grade 3 -> 4", tone: "success" },
            { t: "02:00", text: "grade_bump: child 2 grade 5 -> 6", tone: "success" },
            { t: "02:00", text: "grade_bump: child 3 grade 7 -> 8", tone: "success" },
            { t: "02:00", text: "grade_bump_date rolled forward +1 year", tone: "muted" },
            { t: "02:00", text: "manual steps required: 0", tone: "success" },
          ]}
        />
      )}

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureGradesBumpThemselvesFirstB45: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
