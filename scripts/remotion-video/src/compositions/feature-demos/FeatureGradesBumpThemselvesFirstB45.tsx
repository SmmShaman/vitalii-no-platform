// FeatureGradesBumpThemselvesFirstB45 — feature b45 — 1280x720, 887 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
// Fix (2026-11-13, Wave B2 retry): the header said archetype 4 but a flow-map (source node +
// three lanes + merge bus) had been drawn for this clip; rebuilt as a genuine card-deck: three
// report-card chips (one per child) fly in and stack overlapping at b1, jitter under red
// "WRONG UNIT" tags at b2-b3, then fan out across the full width at b4 as each card flips
// pending -> done and punches in the new grade, settling into a sorted row with a final
// "0 manual steps" callout once all three have bumped. Beat windows, durationInFrames, the
// palette, and the per-beat narration/effects are unchanged.
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real Boytasks feature page/hub as evidence where available, one owner of the
// frame, a reading hold at the end of every beat, cuts not fades (cut()).
//
// Beat → effect (data only from the feature row — no commits exist for b45):
// b1 15-191   "a week into school, still on last year's grade — I'd forgotten to bump them"
//             titleTakeover over the feature's own page (backdrop "page"). Names
//             the product (Boytasks) in the kicker. The three report cards fly in
//             and stack, overlapping, each showing last year's grade (3/5/7).
// b2 191-367  "that number decides their lessons — forget it, a year goes to the wrong content"
//             cornerTags: the claim + four facts, over the features hub (backdrop "hub").
//             The stacked pile jitters; each card gets a red "WRONG UNIT" tag, staggered.
// b3 367-509  "like forgetting to set the clocks forward — everything runs on old time"
//             drawn clock analogy (no catalog effect — a metaphor beat), single
//             codepoint ⏰, hands sweeping continuously for the whole beat. The pile
//             keeps jittering underneath, still stacked and still wrong.
// b4 509-675  "now a nightly cron checks the date and bumps every grade automatically"
//             pipelineFlow (check date → bump grade → log it) over the page's
//             solution section (backdrop "page2"). Each card flips pending → done
//             and flies out of the pile into its own slot, staggered, punching in
//             the new grade as the pile fans into a sorted row.
// b5 675-887  "all three boys jumped a grade the same day it shipped — zero manual steps next year"
//             drawn LogWindow, 6 real lines from solution_en/result_en, holds to
//             the end. The fanned row holds sorted and done; a "0 manual steps"
//             callout punches in once all three cards have flipped.
//
// Persistent element: a card-deck (archetype 3) — three report-card chips, one per
// child's grade, fly in and stack overlapping at b1, jitter with "WRONG UNIT" tags
// through b2-b3, then fan out into a sorted row across the full width at b4 as each
// flips pending -> done, holding fanned and done through b5. Lives at y>=600 (band
// extends to y 566 for the final callout), uses the full canvas width, visible b1
// through b5.

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

const LT = { x: 40, y: 600, w: 1200, h: 110 };
const CARD_W = 260;
const CARD_H = 92;
const STACK_X = [40, 54, 68];
const STACK_Y = [609, 613, 617];
const STACK_ROT = [-3, 2, -1];
const FAN_X = [40, 510, 980];
const FAN_Y = 609;
const GRADE_FROM = [3, 5, 7];
const GRADE_TO = [4, 6, 8];
const CARD_FLIP_AT = [B4 + 20, B4 + 54, B4 + 88];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 3 card-deck: three report-card chips fly in and stack overlapping, jitter
 *  under "WRONG UNIT" tags, then fan out into a sorted row as each flips pending -> done. */
const Deck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const bumpedCount = CARD_FLIP_AT.filter((at) => frame >= at).length;

  // Not-yet-flipped cards still sit at the overlapping stack x-positions (40/54/68),
  // which collide with card 0's fan destination (also x=40) — render done cards last
  // so a flipped card is never hidden behind a still-stacked neighbour.
  const order = [0, 1, 2].slice().sort((a, b) => Number(frame >= CARD_FLIP_AT[a]) - Number(frame >= CARD_FLIP_AT[b]));

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {order.map((i) => {
        const flipAt = CARD_FLIP_AT[i];
        const done = frame >= flipAt;
        const flipT = sec(frame, flipAt, fps);
        const fan = done ? tween(flipT, 0, 0.5, ease.power3Out) : 0;
        const x = mix(fan, STACK_X[i], FAN_X[i]);
        const y = mix(fan, STACK_Y[i], FAN_Y);
        const rot = mix(fan, STACK_ROT[i], 0);
        const sc = done ? punchScale(flipT, 0) : 1;
        const jitter = !done && frame >= B2 && frame < B3 ? Math.sin((frame - B2 + i * 7) / 3) * 1.4 : 0;
        const tagOn = frame >= B2 + 20 + i * 24 && frame < flipAt;

        return (
          <Arrive key={i} at={B1 + 6 + i * 6} kind="rise" box={{ x: STACK_X[i], y: STACK_Y[i], w: CARD_W, h: CARD_H }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 8,
                background: done ? P.successBg : P.card,
                border: `2px ${done ? "solid" : "dashed"} ${done ? P.successEdge : P.muted}`,
                boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
                boxSizing: "border-box",
                padding: "12px 18px",
                transform: `rotate(${rot + jitter}deg) scale(${sc})`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>CHILD {i + 1}</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: done ? P.success : P.ink }}>
                  Grade {done ? GRADE_TO[i] : GRADE_FROM[i]}
                </span>
                {done && <span style={{ fontSize: 18, color: P.success }}>✓</span>}
              </div>
              {!done && <span style={{ fontSize: 12, color: P.muted }}>still last year's</span>}
              {tagOn && <span style={{ fontSize: 11, fontWeight: 800, color: P.danger }}>WRONG UNIT</span>}
            </div>
          </Arrive>
        );
      })}

      {bumpedCount === 3 && (
        <div
          style={{
            position: "absolute",
            left: 320,
            top: 624,
            width: 170,
            textAlign: "center",
            fontSize: 14,
            fontWeight: 800,
            color: P.success,
            transform: `scale(${punchScale(sec(frame, CARD_FLIP_AT[2], fps), 0)})`,
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
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 1040 }}>
            Runs itself every night — checks today's date, bumps every grade, logs what happened
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 40,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 18px",
          borderRadius: 999,
          background: P.accentBg,
          border: `2px solid ${P.accentEdge}`,
        }}
      >
        <span style={{ fontSize: 20 }}>🗓️</span>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.2, color: P.accent }}>EVERY AUGUST, UNATTENDED</span>
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

/** b5 only — a non-developer has no cue that the terminal panel IS the before/after
 *  proof; this names it in plain English above the log window. */
const ProofFill: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < from) return null;
  const t = tween(sec(frame, from + 4, 30), 0, 0.3, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 150, top: 46, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 30 }}>✅</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1.6, color: P.success }}>
            THE PROOF — IT RAN ON ITS OWN
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 2 }}>
            Real run, 2026-08-17, 02:00 — nobody touched this
          </div>
        </div>
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
        plate={0.78}
        data={{ kicker: "Boytasks — my 3 kids' screen time, gated by school tasks", title: "I Forgot To Bump The Grade" }}
      />

      {/* b2 — why it matters: wrong content for a year */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.86}
        data={{
          statement: "One grade field decides the lessons — miss it, a year goes to the wrong content",
          tags: ["Still grade 3, 5, 7", "Wrong lesson unit", "Wrong difficulty", "Wrong bonus tasks"],
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
        plate={0.82}
        data={{
          steps: ["Check the date", "Bump every grade", "Log what happened"],
          system: "Nightly cron — runs itself, every night",
          result: "Zero manual steps",
        }}
      />
      {cut(frame, B4, B5) === 1 && <CronFill from={B4} />}

      {/* b5 — the result: all three boys bumped, holds to the end */}
      {frame >= B5 && <ProofFill from={B5} />}
      {frame >= B5 && (
        <LogWindow
          title="Boytasks — automatic run, 2026-08-17"
          from={B5}
          every={24}
          opacity={1}
          win={{ x: 150, y: 110, w: 980, h: 480 }}
          fontSize={22}
          lines={[
            { t: "02:00", text: "Checking date -> today is Aug 17, 2026", tone: "accent" },
            { t: "02:00", text: "Child 1: Grade 3 -> Grade 4  done", tone: "success" },
            { t: "02:00", text: "Child 2: Grade 5 -> Grade 6  done", tone: "success" },
            { t: "02:00", text: "Child 3: Grade 7 -> Grade 8  done", tone: "success" },
            { t: "02:00", text: "Next bump saved for Aug 2027", tone: "muted" },
            { t: "02:00", text: "Manual steps needed: 0", tone: "success" },
          ]}
        />
      )}

      <Deck />
    </AbsoluteFill>
  );
};

export const FeatureGradesBumpThemselvesFirstB45: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
