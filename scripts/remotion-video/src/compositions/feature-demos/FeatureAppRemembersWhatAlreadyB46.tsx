/**
 * FeatureAppRemembersWhatAlreadyB46 — feature b46 — 1280x720, 948 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (2026-09-24): same narration, same beat windows, new picture.
 * archetype 4 "flow map", mood "violet" (handed down, not re-drawn).
 *
 * The old cut staged a radial hub with three orbiting satellites. This cut
 * stages the same idea as a literal horizontal pipeline: a wide "Memory
 * Gate" bar sits dead-center of the frame; a Source card on the left feeds
 * into it, an Output card on the right comes out of it. In beats 1-2 the
 * gate is empty/dashed — there is no check yet, so duplicates pile up
 * against it (a fan of ghost copies) instead of passing through. Beat 3 is
 * the one UI beat (per STEP 0c): a LiveWindow recording of the feature's own
 * real page scale-pushes in as proof the check is real. Beat 4 lights the
 * gate solid — both the Worksheet and AI Lesson lanes now flow through it
 * and come out the other side fresh, with the single tech chip (Supabase).
 * Beat 5 does not play the feature page or the hub (gate 2): it closes on a
 * LogWindow built only from the numbers already in the narration.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-199  "A first-grader's worksheets kept repeating — the same six
 *              colors, the same pig, three days running."
 *  b2 208-360  "The AI-written lessons repeated too: one topic ran fourteen
 *              days straight."
 *  b3 369-558  "Now every worksheet checks a rolling memory of what each
 *              child already saw, stored in Supabase."
 *  b4 567-743  "The AI's daily lessons follow the same rule now — no
 *              repeating recent words or topics."
 *  b5 752-903  "The review track now moves on after ten days, instead of
 *              stalling on the same step." — holds to 948, no fade-out.
 *
 * Single tech name in the whole clip: Supabase (one FilterChip, beat 4 only).
 * All numbers (6 colors, 3 days, 14 days, 10 days) come straight from the
 * narration — nothing here is an invented statistic.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import { Headline, StatPill, FilterChip, CaptionBand, CheckBadge, FlowArrow, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/b46.json";

const P = MOODS.violet;

const B1_S = 15, B1_E = 199;
const B2_S = 208, B2_E = 360;
const B3_S = 369, B3_E = 558;
const B4_S = 567, B4_E = 743;
const B5_S = 752, B5_E = 903;
const FADE = 9;

const WIN3: Win = { x: 230, y: 150, w: 820, h: 430 };
const WIN_LOG: Win = { x: 250, y: 150, w: 880, h: 420 };

const GATE = { x: 560, y: 140, w: 160, h: 500 };
const SOURCE_X = 60;
const OUTPUT_X = 990;
const CARD_W = 230;
const CARD_H = 130;
const LANE_Y = { worksheet: 165, ai: 335, review: 505 };

/** One rectangular lane card (source or output), top-left anchored. */
const LaneCard: React.FC<{
  x: number;
  y: number;
  emoji: string;
  label: string;
  sub: string;
  tone: "danger" | "success";
  opacity: number;
}> = ({ x, y, emoji, label, sub, tone, opacity }) => {
  if (opacity <= 0.004) return null;
  const bg = tone === "success" ? P.successBg : P.dangerBg;
  const edge = tone === "success" ? P.successEdge : P.dangerEdge;
  const subColor = tone === "success" ? P.success : P.danger;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 18,
        background: P.card,
        border: `1.5px solid ${edge}`,
        boxShadow: cardShadow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        opacity,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 28 }}>{emoji}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: P.ink }}>{label}</div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: subColor,
          background: bg,
          borderRadius: 8,
          padding: "3px 10px",
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </div>
    </div>
  );
};

/** Fan of ghost duplicates piling up against the closed gate — the "it just
 * keeps repeating, nothing stops it" visual for beats 1-2. */
const DuplicateStack: React.FC<{ laneY: number; opacity: number }> = ({ laneY, opacity }) => {
  if (opacity <= 0.004) return null;
  const startX = SOURCE_X + CARD_W + 26;
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: startX + i * 78,
            top: laneY + i * 16,
            width: 150,
            height: CARD_H - 20,
            borderRadius: 16,
            border: `1.5px dashed ${P.dangerEdge}`,
            background: "rgba(255,255,255,0.5)",
            opacity: opacity * (0.5 - i * 0.13),
          }}
        />
      ))}
    </>
  );
};

/** Faint grayscale tiling of the beat's own repeating icon, filling the
 * canvas rows the active single lane does not reach. */
const RepeatWallpaper: React.FC<{ opacity: number; emoji: string }> = ({ opacity, emoji }) => {
  if (opacity <= 0.004) return null;
  const cellW = 150;
  const cellH = 110;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 400, opacity: opacity * 0.24 }}>
        {[0, 1].map((r) =>
          [0, 1].map((c) => (
            <div key={`l-${r}-${c}`} style={{ position: "absolute", left: c * cellW, top: r * cellH, fontSize: 32, filter: "grayscale(1)" }}>
              {emoji}
            </div>
          ))
        )}
      </div>
      <div style={{ position: "absolute", left: 760, top: 150, opacity: opacity * 0.24 }}>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <div key={`r-${r}-${c}`} style={{ position: "absolute", left: c * cellW, top: r * cellH, fontSize: 32, filter: "grayscale(1)" }}>
              {emoji}
            </div>
          ))
        )}
      </div>
    </>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "before", text: "worksheet: same 6 colors, same pig — 3 days running", tone: "danger" },
  { t: "before", text: "ai lesson: one topic ran 14 days straight", tone: "danger" },
  { t: "check", text: "memory.lastSeen(childId) → rolling window, Supabase", tone: "accent" },
  { t: "after", text: "worksheet: new colors, new animal — no repeat window", tone: "success" },
  { t: "after", text: "ai lesson: no repeating recent words or topics", tone: "success" },
  { t: "after", text: "review track: was stalling → now moves on after 10 days", tone: "success" },
];

export const FeatureAppRemembersWhatAlreadyB46: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  const gatePop = Math.min(1, pop(B4_S));
  const checkPop = Math.min(1, pop(B4_S + 30));
  const gateGhost = Math.max(b1, b2) * 0.5;
  const gateLit = b4 * gatePop;

  // ---- beat 3 : scale-push the real page in (non-crossfade transition) ----
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arrowIn = (start: number) => interpolate(frame, [start, start + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(165deg, ${P.bgTop} 0%, ${P.bgBottom} 100%)`,
          }}
        />

        {/* ================= beat headlines ================= */}
        <Headline y={42} text="A first-grader's worksheets kept repeating." opacity={b1} fontSize={32} />
        <Headline y={42} text="The AI-written lessons repeated too." opacity={b2} fontSize={32} />
        <Headline y={42} text="Now every worksheet checks a" accentText="rolling memory." accentColor={P.accent} opacity={b3} fontSize={30} />
        <Headline y={42} text="The AI's daily lessons follow the" accentText="same rule now." accentColor={P.success} opacity={b4} fontSize={30} />
        <Headline y={42} text="The review track" accentText="moves on after 10 days." accentColor={P.success} opacity={b5} fontSize={30} />

        {/* ================= beat 1 : product line ================= */}
        <div style={{ position: "absolute", left: 90, top: 96, fontSize: 20, fontWeight: 750, color: P.ink, opacity: b1 }}>
          🧒 Boytasks — a family app for daily learning
        </div>

        {/* ================= the Memory Gate — dominant vertical bar, every beat ================= */}
        <div
          style={{
            position: "absolute",
            left: GATE.x,
            top: GATE.y,
            width: GATE.w,
            height: GATE.h,
            borderRadius: 24,
            background: gateLit > 0.15 ? P.accentBg : "rgba(255,255,255,0.4)",
            border: gateLit > 0.15 ? `3px solid ${P.accent}` : `3px dashed ${P.border}`,
            boxShadow: gateLit > 0.15 ? cardShadow : "none",
            opacity: Math.max(gateGhost, gateLit, b3 * 0.6),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 34 }}>🧠</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: gateLit > 0.15 ? P.ink : P.muted, textAlign: "center" }}>
            {gateLit > 0.15 ? "Memory Gate" : "no memory yet"}
          </div>
        </div>

        {/* ================= beats 1-2 : single lane piling up against the closed gate ================= */}
        <RepeatWallpaper opacity={b1} emoji="🐷" />
        <RepeatWallpaper opacity={b2} emoji="🤖" />

        <LaneCard x={SOURCE_X} y={LANE_Y.worksheet} emoji="📝" label="Worksheet" sub="🎨🐷 — 3 days" tone="danger" opacity={b1} />
        <DuplicateStack laneY={LANE_Y.worksheet} opacity={b1} />
        <StatPill x={90} y={LANE_Y.worksheet + CARD_H + 20} emoji="⚠" text="same 6 colors, same pig — 3 days" tone="danger" opacity={b1} />

        <LaneCard x={SOURCE_X} y={LANE_Y.ai} emoji="🤖" label="AI Lesson" sub="14-day streak" tone="danger" opacity={b2} />
        <DuplicateStack laneY={LANE_Y.ai} opacity={b2} />
        <StatPill x={90} y={LANE_Y.ai + CARD_H + 20} emoji="⚠" text="one topic — 14 days straight" tone="danger" opacity={b2} />

        {/* ================= beat 4 : gate lights up, two lanes flow through, chip ================= */}
        <FlowArrow x={SOURCE_X + CARD_W + 10} y={LANE_Y.worksheet + CARD_H / 2 - 3} len={GATE.x - (SOURCE_X + CARD_W + 10) - 10} progress={arrowIn(B4_S)} color={P.success} opacity={b4} />
        <FlowArrow x={GATE.x + GATE.w + 10} y={LANE_Y.worksheet + CARD_H / 2 - 3} len={OUTPUT_X - (GATE.x + GATE.w + 10) - 10} progress={arrowIn(B4_S + 14)} color={P.success} opacity={b4} />
        <LaneCard x={SOURCE_X} y={LANE_Y.worksheet} emoji="📝" label="Worksheet" sub="generator" tone="success" opacity={b4} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.worksheet} emoji="📝" label="Worksheet" sub="new colors, new pig ✓" tone="success" opacity={b4} />
        <CheckBadge x={OUTPUT_X + CARD_W - 10} y={LANE_Y.worksheet - 6} size={30} opacity={b4} scale={checkPop} />

        <FlowArrow x={SOURCE_X + CARD_W + 10} y={LANE_Y.ai + CARD_H / 2 - 3} len={GATE.x - (SOURCE_X + CARD_W + 10) - 10} progress={arrowIn(B4_S + 6)} color={P.success} opacity={b4} />
        <FlowArrow x={GATE.x + GATE.w + 10} y={LANE_Y.ai + CARD_H / 2 - 3} len={OUTPUT_X - (GATE.x + GATE.w + 10) - 10} progress={arrowIn(B4_S + 20)} color={P.success} opacity={b4} />
        <LaneCard x={SOURCE_X} y={LANE_Y.ai} emoji="🤖" label="AI Lesson" sub="daily writer" tone="success" opacity={b4} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.ai} emoji="🤖" label="AI Lesson" sub="no repeat window ✓" tone="success" opacity={b4} />
        <CheckBadge x={OUTPUT_X + CARD_W - 10} y={LANE_Y.ai - 6} size={30} opacity={b4} scale={checkPop} />

        <FlowArrow x={SOURCE_X + CARD_W + 10} y={LANE_Y.review + CARD_H / 2 - 3} len={GATE.x - (SOURCE_X + CARD_W + 10) - 10} progress={arrowIn(B4_S + 40)} color={P.accentEdge} opacity={b4 * 0.7} />
        <FlowArrow x={GATE.x + GATE.w + 10} y={LANE_Y.review + CARD_H / 2 - 3} len={OUTPUT_X - (GATE.x + GATE.w + 10) - 10} progress={arrowIn(B4_S + 54)} color={P.accentEdge} opacity={b4 * 0.7} />
        <LaneCard x={SOURCE_X} y={LANE_Y.review} emoji="🔁" label="Review Track" sub="step queue" tone="success" opacity={b4 * 0.7} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.review} emoji="🔁" label="Review Track" sub="moves on ✓" tone="success" opacity={b4 * 0.7} />

        <FilterChip x={GATE.x - 20} y={GATE.y - 46} text="Supabase" icon="🧠" color={P.accent} scale={Math.min(1, gatePop)} opacity={gateLit} />

        {/* ================= per-beat captions ================= */}
        <CaptionBand text="Same colors, same pig, day after day." opacity={b1} tone="danger" />
        <CaptionBand text="The AI's own lessons drifted into the same rut." opacity={b2} tone="danger" />
        <CaptionBand text="A rolling memory of what each child already saw." opacity={b3} tone="accent" />
        <CaptionBand text="No repeating recent words or topics — ever." opacity={b4} tone="success" />

        {/* ================= beat 3 : the real page, scale-pushed in ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN3.x + WIN3.w / 2}px ${WIN3.y + WIN3.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-b46"
            win={WIN3}
            from={B3_S}
            hold={B3_E - B3_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b3}
          />
        </div>

        {/* ================= beat 5 : the result, from real numbers only (gate 2: never the feature page/hub) ================= */}
        <LogWindow lines={LOG_LINES} title="boytasks — memory check" from={B5_S + 10} every={26} opacity={b5} win={WIN_LOG} fontSize={21} />
        <CaptionBand text="Ten days, not stuck on the same step." opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
