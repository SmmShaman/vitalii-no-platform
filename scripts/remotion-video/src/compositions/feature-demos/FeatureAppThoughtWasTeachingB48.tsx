/**
 * FeatureAppThoughtWasTeachingB48 — feature b48 — 1280x720, 925 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 6 "sidebar narrative", mood "slate" (both handed
 * down by the orchestrating session, not re-rolled). The fixed left column
 * (0-320px) is the ONE recurring element for the whole clip: a big percentage
 * that changes what it measures as the story turns — the dashboard's claimed
 * grammar score (71 → 78 → 85), then the real first-try accuracy revealed
 * under the guessing floor (50, danger), then the retry-repair rate the fix
 * produced (16 → 65, success) — the exact number the narration ends on.
 *
 * The right stage (356-1220px) swaps content per beat. Beat 2 slides in
 * horizontally instead of crossfading; beat 3 scale-pushes the real product
 * page in as evidence; beat 5 rises in on the log window.
 *
 * Beats 1, 2 and 4 are the dashboard mockup / retry loop / validator
 * schematic — invisible plumbing, stay drawn per STEP 0c. Beat 3 is the
 * substantiated claim, so it plays a recording of the real feature page
 * (shots/b48.json, shot "page"), zoomed on the guessing-floor paragraph.
 * Beat 5 does NOT play the feature page or the hub (gate 2): it closes on a
 * LogWindow built from the feature row's own numbers — Boytasks keeps no
 * runtime log on the VPS, so these lines are assembled from problem/solution
 * /result, never invented.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-149  "A parent's dashboard said the child was acing grammar, week after week."
 *  b2 158-311  "But a failed round could just be retried until it passed, hiding the real score."
 *  b3 320-490  "On his actual first answers, grammar sat at fifty percent - the same as pure guessing."
 *  b4 499-683  "A single TypeScript rule now checks every answer the same way, and a wrong one
 *              gets a real second try."
 *  b5 692-880  "Maths mistakes now get corrected on retry sixty-five percent of the time, up from
 *              just sixteen." — holds to 925.
 *
 * Single tech name in the whole clip: TypeScript (beat 4 chip only).
 * All numbers on screen (71/78/85% weekly scores, 49.9-56% first-try accuracy,
 * 756 answers, 16%→65% retry-repair, 1121/1121 numeric answers) are the real
 * values from the feature row — nothing here is invented.
 */
import React from "react";
import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Panel,
  StatPill,
  IconCard,
  FilterChip,
  FlowArrow,
  CheckBadge,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/b48.json";

const P = MOODS.slate;

const STAGE_X = 356;
const STAGE_W = 864;

const B1_S = 15, B1_E = 149;
const B2_S = 158, B2_E = 311;
const B3_S = 320, B3_E = 490;
const B4_S = 499, B4_E = 683;
const B5_S = 692, B5_E = 880;
const END = 925;
const FADE = 16;

const WIN3: Win = { x: 374, y: 146, w: 806, h: 396 };
const WIN5: Win = { x: 356, y: 150, w: 864, h: 414 };

const LOG_LINES: LogLine[] = [
  { t: "skills", text: "420 curriculum skills loaded (LK20)", tone: "accent" },
  { t: "check", text: "answerCheck(): \"2,35\" == 2.35 → true", tone: "muted" },
  { t: "grammar", text: "mode: recognition → typed correction", tone: "accent" },
  { t: "retry", text: "miss on first try → re-asked, multiple choice", tone: "muted" },
  { t: "result", text: "maths retry-repair: 16% → 65%", tone: "success" },
  { t: "numbers", text: "1121 / 1121 answers no longer rounded", tone: "success" },
];

/** Stage caption — lives INSIDE the right stage, never under the sidebar. */
const StageCaption: React.FC<{ text: string; opacity: number; tone?: "ink" | "danger" | "accent" | "success" }> = ({
  text,
  opacity,
  tone = "ink",
}) => {
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : tone === "accent" ? P.accent : tone === "success" ? P.success : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE_X,
        top: 636,
        width: STAGE_W,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 650,
        lineHeight: 1.3,
        color,
        opacity,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

const StageHeading: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE_X,
        top: 60,
        width: STAGE_W,
        fontSize: 29,
        fontWeight: 800,
        color: P.ink,
        opacity,
        letterSpacing: -0.2,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

export const FeatureAppThoughtWasTeachingB48: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  // ---- the sidebar number: what it measures changes with the story ----
  const scoreRaw = interpolate(
    frame,
    [0, 15, 60, 100, B1_E, B2_S, B2_E, B3_S, 340, 410, B3_E, B4_S, B4_E, B5_S, 720, 812, B5_E, END],
    [71, 71, 71, 78, 85, 85, 85, 85, 85, 50, 50, 50, 50, 16, 16, 65, 65, 65],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const score = Math.round(scoreRaw);
  const numberColor = interpolateColors(
    frame,
    [0, 320, 410, 692, 812],
    [P.ink, P.ink, P.danger, P.danger, P.success] as any
  );
  const barFill = Math.min(1, score / 100);
  const fixedStampPop = frame < 780 ? 0 : spring({ frame: frame - 780, fps, config: { damping: 10, mass: 0.7 } });

  const label =
    frame < B3_S
      ? "WEEKLY GRAMMAR SCORE"
      : frame < B5_S
      ? "FIRST-TRY ACCURACY"
      : "RETRY-REPAIR RATE";
  const sub =
    frame < B3_S
      ? "AS SHOWN ON THE DASHBOARD"
      : frame < B5_S
      ? "OUT OF 756 REAL ANSWERS"
      : "MATHS MISTAKES FIXED";

  // ---- beat 1 : the three weekly scores the dashboard showed ----
  const weekIn = (i: number) => pop(B1_S + 26 + i * 16);

  // ---- beat 2 : slide-in (the non-crossfade transition) ----
  const b2dx = interpolate(frame, [B2_S, B2_S + 30], [70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const loopArrow1 = interpolate(frame, [B2_S + 30, B2_S + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const loopArrow2 = interpolate(frame, [B2_S + 66, B2_S + 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ---- beat 3 : scale-push the real evidence in ----
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ---- beat 4 : messy labels -> one validator ----
  const chipPop = pop(B4_S + 24);
  const rowIn = (i: number) => seg(frame, B4_S + 60 + i * 16, B4_S + 60 + i * 16 + 12);
  const arrowProgress = interpolate(frame, [B4_S + 10, B4_S + 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ---- beat 5 : rise-in on the log window (the third non-crossfade move) ----
  const b5dy = interpolate(frame, [B5_S, B5_S + 26], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= persistent sidebar (archetype 6) ================= */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 320,
            height: 720,
            background: P.card,
            borderRight: `2px solid ${P.border}`,
            opacity: seg(frame, 0, 15),
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 44, fontSize: 14, fontWeight: 800, letterSpacing: 2, color: P.muted }}>
            🧒 GRAMMAR PRACTICE
          </div>
          <div
            style={{
              position: "absolute",
              left: 32,
              top: 78,
              width: 250,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 0.6,
              color: P.muted,
              lineHeight: 1.3,
            }}
          >
            {label}
          </div>

          <div
            style={{
              position: "absolute",
              left: 32,
              top: 118,
              fontSize: 128,
              fontWeight: 800,
              letterSpacing: -3,
              color: numberColor as unknown as string,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {score}%
          </div>
          <div style={{ position: "absolute", left: 34, top: 268, width: 256, fontSize: 15.5, fontWeight: 700, letterSpacing: 0.6, color: P.muted, lineHeight: 1.35 }}>
            {sub}
          </div>

          <div style={{ position: "absolute", left: 32, top: 320, width: 256, height: 10, borderRadius: 6, background: P.chipBg, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${barFill * 100}%`,
                borderRadius: 6,
                background: numberColor as unknown as string,
              }}
            />
          </div>
          <div style={{ position: "absolute", left: 32, top: 340, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted }}>
            50% ≈ GUESSING FLOOR
          </div>

          {fixedStampPop > 0.02 ? (
            <div
              style={{
                position: "absolute",
                left: 32,
                top: 400,
                padding: "10px 18px",
                borderRadius: 12,
                background: P.successBg,
                border: `2px solid ${P.successEdge}`,
                color: P.success,
                fontWeight: 800,
                fontSize: 20,
                transform: `scale(${Math.min(1, fixedStampPop)}) rotate(-3deg)`,
                transformOrigin: "left center",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              ✅ FIXED
            </div>
          ) : null}
        </div>

        {/* ================= beat 1 : the dashboard looked great ================= */}
        <StageHeading text="The dashboard looked great, week after week." opacity={b1} />
        <div
          style={{
            position: "absolute",
            left: STAGE_X,
            top: 106,
            width: STAGE_W,
            fontSize: 19,
            fontWeight: 650,
            color: P.muted,
            opacity: b1,
          }}
        >
          📱 Boytasks — a family app for daily reading and grammar practice
        </div>
        <IconCard x={STAGE_X + 40} y={210} w={230} emoji="📈" title="Week 4" sub="71% grammar" tone="success" opacity={b1} scale={Math.min(1, weekIn(0))} />
        <IconCard x={STAGE_X + 310} y={210} w={230} emoji="📈" title="Week 5" sub="78% grammar" tone="success" opacity={b1} scale={Math.min(1, weekIn(1))} />
        <IconCard x={STAGE_X + 580} y={210} w={230} emoji="📈" title="Week 6" sub="85% grammar" tone="success" opacity={b1} scale={Math.min(1, weekIn(2))} />
        <StageCaption text="Scores in the 70s and 80s, lesson after lesson" opacity={b1} />

        {/* ================= beat 2 : a retry could hide the truth (slide-in) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b2, transform: `translateX(${b2dx}px)` }}>
          <StageHeading text="But a failed round could just be retried." opacity={1} />
          <Panel x={STAGE_X} y={190} w={210} h={200} tone="danger" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ fontSize: 36 }}>❌</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: P.ink }}>Try 1</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 218, top: 275 }}>
            <FlowArrow x={0} y={0} len={92} progress={loopArrow1} color={P.muted} opacity={1} />
          </div>
          <Panel x={STAGE_X + 320} y={190} w={210} h={200} tone="danger" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ fontSize: 36 }}>❌</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: P.ink }}>Try 2</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 538, top: 275 }}>
            <FlowArrow x={0} y={0} len={92} progress={loopArrow2} color={P.muted} opacity={1} />
          </div>
          <Panel x={STAGE_X + 640} y={190} w={224} h={200} tone="success" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ fontSize: 36 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: P.ink }}>Try 3 — PASS</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.success }}>saved to the score</div>
            </div>
          </Panel>
          <StatPill x={STAGE_X} y={430} emoji="🙈" text="only the winning try is remembered" tone="danger" opacity={1} />
          <StageCaption text="The dashboard only remembers the winning try" opacity={1} tone="danger" />
        </div>

        {/* ================= beat 3 : the real first-try answers (scale-push) ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: b3,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN3.x + WIN3.w / 2}px ${WIN3.y + WIN3.h / 2}px`,
          }}
        >
          <StageHeading text="On his real first answers, not the retries." opacity={1} />
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-b48"
            win={WIN3}
            from={B3_S}
            hold={B3_E - B3_S}
            zoom={(t) => 1 + 0.12 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.4 }}
            opacity={1}
          />
          <StatPill x={STAGE_X + 40} y={558} emoji="🪙" text="49.9–56% — same as a coin flip" tone="danger" opacity={1} />
          <StageCaption text="756 real answers, right at the guessing floor" opacity={1} tone="danger" />
        </div>

        {/* ================= beat 4 : one rule checks every answer ================= */}
        <StageHeading text="Now one rule checks every answer." opacity={b4} />
        <Panel x={STAGE_X} y={150} w={330} h={210} tone="danger" opacity={b4}>
          <div style={{ position: "absolute", left: 20, top: 16, fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: P.muted }}>
            86 DIFFERENT LABELS
          </div>
          {["\"tall_ord\"", "\"number-simple\"", "\"grammar_v2\"", "\"...and 83 more\""].map((t, i) => (
            <div
              key={t}
              style={{
                position: "absolute",
                left: 20,
                top: 52 + i * 40,
                padding: "6px 12px",
                borderRadius: 8,
                background: P.dangerBg,
                border: `1.5px solid ${P.dangerEdge}`,
                fontSize: 14.5,
                fontWeight: 700,
                color: P.danger,
                opacity: rowIn(i),
                transform: `translateX(${(1 - rowIn(i)) * 16}px)`,
                fontFamily: "ui-monospace, Menlo, monospace",
              }}
            >
              {t}
            </div>
          ))}
        </Panel>
        <div style={{ position: "absolute", left: STAGE_X + 340, top: 250 }}>
          <FlowArrow x={0} y={0} len={110} progress={arrowProgress} color={P.accent} opacity={b4} />
        </div>
        <FilterChip
          x={STAGE_X + 20}
          y={80}
          text="TypeScript"
          icon="🛠"
          color={P.accent}
          scale={Math.min(1, chipPop)}
          opacity={b4 * Math.min(1, chipPop)}
        />
        <Panel x={STAGE_X + 470} y={150} w={314} h={210} tone="card" opacity={b4}>
          <div style={{ position: "absolute", left: 20, top: 16, fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: P.muted }}>
            answerCheck() — everywhere
          </div>
          <div style={{ position: "absolute", left: 20, top: 54, fontSize: 15.5, fontWeight: 700, color: P.success }}>✅ "2,35" = 2.35</div>
          <div style={{ position: "absolute", left: 20, top: 90, fontSize: 15.5, fontWeight: 700, color: P.success }}>✅ "3/4" = "0,75"</div>
          <div style={{ position: "absolute", left: 20, top: 126, fontSize: 15.5, fontWeight: 700, color: P.accent }}>↻ wrong → typed retry</div>
          <div style={{ position: "absolute", left: 20, top: 162, fontSize: 15.5, fontWeight: 700, color: P.accent }}>↻ then multiple choice</div>
        </Panel>
        <StageCaption text="One function, checked the same way everywhere" opacity={b4} tone="accent" />

        {/* ================= beat 5 : it is already working (rise-in) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b5, transform: `translateY(${b5dy}px)` }}>
          <StageHeading text="The fix is already running." opacity={1} />
          <LogWindow lines={LOG_LINES} title="boytasks — grading engine" from={B5_S + 14} every={26} opacity={1} win={WIN5} fontSize={21} />
          <CheckBadge x={1156} y={130} size={40} opacity={1} scale={Math.min(1, fixedStampPop)} />
          <StageCaption text="Maths retry-repair: 16% → 65%" opacity={1} tone="success" />
        </div>
      </div>
    </PaletteProvider>
  );
};
