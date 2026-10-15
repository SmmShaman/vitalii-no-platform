// FeatureRealHovorkaModelTurnsD03 — feature d03 — 1280x720, 873 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real product's own feature page as evidence, one owner of the frame, a reading
// hold at the end of every beat, cuts not fades.
//
// Beat → picture (data only from the feature's own problem/solution/result text):
// b1 15-154   "Artem's parents wanted him to learn about his diabetes by playing a
//             game."
//             titleTakeover over a LiveBackdrop of the feature's own page
//             (backdrop "page"). A small product plate names the Insulin
//             Simulator once. Hero enters the lower-third band at "08.10"/danger
//             ("GENERIC BODY, NOT HIS" — nothing has been confirmed yet).
// b2 154-336  "But every simulator online used a generic kid's body — nothing
//             matched his real doses."
//             cornerTags over the same continuous page recording — the claim plus
//             three plain facts from problem_en. Hero stays in the band, unchanged.
// b3 336-488  "So his dad built the game on a real Hovorka model instead of a
//             generic one."
//             handoffExplain, drawn only (no commit's message names "Hovorka
//             model" by itself — the model build has no public page, so this
//             stays invisible plumbing). Generic body → real Hovorka model,
//             with explicit English fromLabel/toLabel ("BEFORE"/"NOW" — the
//             catalog component's Norwegian defaults were a stray-looking "NÅ"
//             tag a blind viewer flagged as a rendering bug). A BeatRail on the
//             right restates the handoff's own points plus one gloss line
//             ("Hovorka model = the published equation…") since the term is
//             never defined anywhere else on screen. Hero flips to "08.10"/
//             success here, in the band, with a small punch.
// b4 488-661  "It's tuned to Artem's own insulin, his own weight, like a tutor who
//             already read his chart."
//             CommitEvidence: the ONE commit whose message says this — 02ed872
//             "realistic Artem's day and missions on a calibrated type 1 body"
//             — a LiveWindow (shot "commit") zoomed 2.0-2.3x onto the day.js
//             hunk, real code instead of an abstract pipeline diagram. One
//             caption below names "Hovorka 2004 model" and glosses NovoRapid/
//             Levemir inline, so no jargon is left undefined. Hero stays in
//             the band, already flipped to success.
// b5 661-873  "Now the glucose curves match sheet 08.10 — his own doctor's
//             worksheet."
//             Fully drawn: hero number goes BIG (fontSize 210, owns the frame) at
//             "08.10"/success, plus a LogWindow (t1d-model.js) with the model's own
//             real facts. Holds to END at full brightness, no fade. Neither the
//             feature page nor the hub appears in this beat.
//
// Persistent element: the hero number (archetype 7) — small in the lower-third
// band (y >= 606) for b1-b4 where a catalog effect/LiveWindow owns the stage
// above it, BIG (fontSize 210, satisfies gate 1) only in b5, the one beat with
// no competing visual. Value never changes (08.10, the real worksheet from
// result_en); only its tone/status flips once, at b3's first frame, from "not
// yet matched" to "matched". Gate 2: b5 ends on a drawn result (LogWindow +
// hero), not a page.
//
// Of this feature's three commits, only 02ed872 ("Artem's day" + missions on a
// calibrated body) says what any beat says — it is shown in b4. The other two
// (game-mode level map; an unrelated Android APK fix) match no sentence here
// and are not shown. The model build itself (b3) has no commit whose message
// names "Hovorka model" — it stays drawn, per STEP 0c, invisible plumbing.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d03.json";

const B1 = 15;
const B2 = 154;
const B3 = 336;
const B4 = 488;
const B5 = 661;
const END = 873;

const ACCENT = "#2563EB";
const STAGE = "#10151D";

/** Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the
    hero number's SMALL home while a catalog effect sits above it (b1-b4). */
const BAND = { x: 40, y: 606, w: 460, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 7 — the hero number, present every beat, BIG only in b5 (the one
    beat with no catalog effect competing for the upper frame). The value never
    changes (08.10, from result_en); only tone/status flips once, at B3. */
const HeroFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B3;
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const status = flipped ? "ARTEM'S OWN WORKSHEET" : "GENERIC BODY, NOT HIS";
  const value = "08.10";

  if (frame >= B5) {
    const t = tween(sec(frame, B5 + 4, fps), 0, 0.5, ease.power3Out);
    return (
      <div style={{ position: "absolute", left: 80, top: 150, width: 760, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(22,35,63,0.6)" }}>
          GLUCOSE CURVE NOW MATCHES
        </div>
        <div style={{ fontSize: 210, fontWeight: 800, lineHeight: 1, letterSpacing: -4, color, marginTop: 6 }}>
          {value}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 14,
            padding: "10px 22px",
            borderRadius: 4,
            background: bg,
            border: `2px solid ${color}`,
            color,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          SHEET 08.10 — {status}
        </div>
      </div>
    );
  }

  const flipPunch = flipped ? Math.max(0, punchScale(sec(frame, B3, fps), 0) - 1) : 0;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={BAND} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: BAND.x,
          top: BAND.y,
          width: BAND.w,
          height: BAND.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 22px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color, transform: `scale(${1 + flipPunch * 0.3})`, whiteSpace: "nowrap" }}>
          {value}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>SHEET 08.10</div>
          <div style={{ fontSize: 15, fontWeight: 800, color }}>{status}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b1 — small product plate naming the Insulin Simulator, over the LiveBackdrop + effect. */
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
        background: "rgba(16,21,29,0.85)",
        border: "1.5px solid #9DBCEF",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        color: "#F5F5F5",
        opacity: t,
        maxWidth: 560,
        lineHeight: 1.4,
        fontFamily,
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>INSULIN SIMULATOR</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>
        a diabetes game I built for my son Artem — a real, Hovorka-calibrated glucose model
      </span>
    </div>
  );
};

/** b3 — handoffExplain builds up over ~4.3s and stays sparse through most of
    the beat (points land late in the build), so it gets a rail of the SAME
    real facts the catalog effect already carries (handoffExplain's own
    points), spread down the right side of the canvas and visible from the
    first half-second — no backdrop exists for the beat to lean on instead.
    A one-line gloss under the header names what "Hovorka model" is, since
    the term is never explained anywhere else on screen. b4 now plays the
    real commit instead (CommitEvidence, below); b1/b2/b5 are untouched. */
const BeatRail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;

  const items = ["Tuned to his own weight", "Per-kg insulin math", "Built by his dad"];
  const tops = [128, 300, 472];
  const headerT = tween(sec(frame, B3 + 2, fps), 0, 0.3, ease.power3Out);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 54,
          width: 460,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 2,
          color: "rgba(230,236,250,0.55)",
          opacity: headerT,
          fontFamily,
        }}
      >
        WHY A REAL MODEL
      </div>
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 78,
          width: 460,
          fontSize: 15,
          fontWeight: 600,
          color: "rgba(230,236,250,0.8)",
          opacity: headerT,
          fontFamily,
        }}
      >
        Hovorka model = the published equation doctors use for insulin vs. glucose
      </div>
      {items.map((label, i) => {
        const t = tween(sec(frame, B3 + 4 + i * 4, fps), 0, 0.35, ease.power3Out);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: 760,
              top: tops[i],
              width: 460,
              background: P.card,
              borderRadius: 4,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.4)",
              padding: "20px 24px",
              opacity: t,
              fontFamily,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>{`0${i + 1}`}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: P.ink, marginTop: 4 }}>{label}</div>
          </div>
        );
      })}
    </>
  );
};

/** b4 window above the hero band, clear of BAND (y 606-698). */
const WIN_COMMIT = { x: 150, y: 90, w: 980, h: 460 };

/** b4 — "tuned to Artem's own insulin, his own weight, like a tutor who already
    read his chart": the ONE commit whose message says this ("realistic Artem's
    day and missions on a calibrated type 1 body", 02ed872), zoomed onto the
    day.js hunk — real evidence instead of an abstract pipeline diagram.
    A single caption carries the tech name plus a gloss for NovoRapid/Levemir,
    so the jargon is never left undefined. */
const CommitEvidence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B4, B5) !== 1) return null;
  const kickerT = tween(sec(frame, B4 + 2, fps), 0, 0.3, ease.power3Out);
  const captionT = tween(sec(frame, B4 + 3, fps), 0, 0.35, ease.power3Out);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: WIN_COMMIT.x,
          top: WIN_COMMIT.y - 36,
          width: WIN_COMMIT.w,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 2,
          color: "rgba(230,236,250,0.55)",
          opacity: kickerT,
          fontFamily,
        }}
      >
        LIKE A TUTOR WHO ALREADY READ HIS CHART
      </div>
      <LiveWindow
        file={shotsFile}
        shot="commit"
        title="github.com/SmmShaman/vitalii-no-platform/commit/02ed872"
        from={B4}
        hold={B5 - B4}
        zoom={(t) => 2.0 + 0.3 * ease.sineInOut(t)}
        focus={{ x: 0.5, y: 0.3 }}
        opacity={1}
        win={WIN_COMMIT}
      />
      <div
        style={{
          position: "absolute",
          left: WIN_COMMIT.x,
          top: WIN_COMMIT.y + WIN_COMMIT.h + 20,
          width: WIN_COMMIT.w,
          fontSize: 20,
          fontWeight: 700,
          color: "#E6ECFA",
          opacity: captionT,
          fontFamily,
        }}
      >
        Hovorka 2004 model — real NovoRapid (fast insulin) + Levemir (long-acting) doses, not generic.
      </div>
    </>
  );
};

const LOG_LINES: Array<{ t?: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { text: "loading t1d-model.js (Hovorka, per kg)…", tone: "muted" },
  { text: "NovoRapid + Levemir absorption curves ready", tone: "ink" },
  { text: "correction dose rounded to 0.5 units", tone: "ink" },
  { text: "4 missions run on Artem's own 24h day", tone: "accent" },
  { text: "glucose curve checked vs sheet 08.10", tone: "success" },
  { text: "match: his own doctor's worksheet", tone: "success" },
];

/** b5 — the result, fully drawn: LogWindow with the model's own real facts.
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
        title="t1d-model.js"
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
          color: "#16233F",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Not a generic textbook body — his own doctor's numbers, running in the game.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1+b2 — the human problem, then the generic-body facts, over the feature's own page (continuous recording, no restart) */}
      {cut(frame, B1, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B3 - B1} push={0.03} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{ title: "A Game, Not a Textbook", kicker: "Artem's parents wanted a real lesson, not a generic one" }}
      />
      <ProductPlate />

      {/* b2 — the generic-body facts, over the same continuous backdrop */}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.78}
        data={{
          statement: "Every simulator used a generic body",
          tags: ["Generic carb ratios", "Generic corrections", "Didn't match his body"],
        }}
      />

      {/* b3 — the fix: a real Hovorka model, drawn only (invisible plumbing, no public page) */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.78}
        data={{
          from: "Generic simulator body",
          to: "Real Hovorka model",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Tuned to his own weight", "Per-kg insulin math", "Built by his dad"],
        }}
      />

      {/* b4 — how it's wrapped into Artem's real day: the real commit, not a diagram */}
      <CommitEvidence />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <BeatRail />
      <HeroFigure />
    </AbsoluteFill>
  );
};

export const FeatureRealHovorkaModelTurnsD03: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
