/**
 * FeatureAppRemembersWhatAlreadyB46 — feature b46 — 1280x720, 948 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 4 "flow map", mood "violet" (both handed down by
 * the orchestrating session). The dominant visual for almost the whole clip
 * is a flow map of three satellites — Worksheet, AI Lesson, Review Track —
 * around a central Memory hub. In beats 1-2 the satellites are disconnected
 * ghosts that spin off duplicate copies (the repeats); in beat 4 the hub
 * pops solid and every satellite gets a real spoke and a checkmark. Beat 3
 * is the one UI beat: per STEP 0c it scale-pushes in a recording of the
 * feature's own real page (shots/b46.json, shot "page") as proof that the
 * memory check is real and live, the same way FeatureEightTradingAgentsShareK01
 * (k01) and FeatureKioskWallStopsRecitingB47 (b47) push in their evidence.
 * Beat 5 does NOT play the feature page or the hub (gate 2): Boytasks keeps
 * no runtime log on the VPS, so it closes on a LogWindow built only from the
 * numbers already in the narration — never an invented metric.
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
import { Headline, StatPill, FilterChip, CaptionBand, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/b46.json";

const P = MOODS.violet;

const B1_S = 15, B1_E = 199;
const B2_S = 208, B2_E = 360;
const B3_S = 369, B3_E = 558;
const B4_S = 567, B4_E = 743;
const B5_S = 752, B5_E = 903;
const END = 948;
const FADE = 9;

const HUB = { x: 640, y: 420 };
const RX = 280;
const RY = 170;

const WIN3: Win = { x: 230, y: 150, w: 820, h: 430 };
const WIN_LOG: Win = { x: 250, y: 150, w: 880, h: 420 };

type NodeKey = "worksheet" | "ai" | "review";

const NODES: { key: NodeKey; angle: number; emoji: string; label: string }[] = [
  { key: "worksheet", angle: -90, emoji: "📝", label: "Worksheet" },
  { key: "ai", angle: 30, emoji: "🤖", label: "AI Lesson" },
  { key: "review", angle: 150, emoji: "🔁", label: "Review Track" },
];

function nodePos(angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: HUB.x + RX * Math.cos(rad), y: HUB.y + RY * Math.sin(rad) };
}

/** One satellite card on the flow-map, with a small stat line under it. */
const NodeCard: React.FC<{
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
        left: x - 96,
        top: y - 58,
        width: 192,
        height: 116,
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
      <div style={{ fontSize: 30 }}>{emoji}</div>
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

/** Ghost duplicate trail behind a node — the visual for "it just repeats". */
const GhostTrail: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <>
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - 96 + i * 10,
            top: y - 58 + i * 10,
            width: 192,
            height: 116,
            borderRadius: 18,
            background: P.card,
            border: `1.5px dashed ${P.dangerEdge}`,
            opacity: opacity * (0.32 - i * 0.09),
          }}
        />
      ))}
    </>
  );
};

/** Spoke line from the hub out to a satellite. */
const Spoke: React.FC<{ to: { x: number; y: number }; opacity: number; solid: boolean }> = ({ to, opacity, solid }) => {
  if (opacity <= 0.004) return null;
  const dx = to.x - HUB.x;
  const dy = to.y - HUB.y;
  const full = Math.sqrt(dx * dx + dy * dy);
  const len = Math.max(0, full - 150);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const startX = HUB.x + (dx / full) * 72;
  const startY = HUB.y + (dy / full) * 72;
  return (
    <div
      style={{
        position: "absolute",
        left: startX,
        top: startY,
        width: len,
        height: solid ? 4 : 2,
        background: solid ? P.success : P.accentEdge,
        opacity,
        transform: `rotate(${angleDeg}deg)`,
        transformOrigin: "0 50%",
        borderRadius: 4,
        borderTop: solid ? "none" : `2px dashed ${P.accentEdge}`,
      }}
    />
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

  // ---- flow-map visibility per satellite (recedes for beat 3's live proof) ----
  const worksheetShown = Math.max(b1, b2, b4);
  const aiShown = Math.max(b2, b4);
  const reviewShown = b4;
  const hubGhost = 0.4 * Math.max(b1, b2);
  const hubPop = Math.min(1, pop(B4_S));
  const hubSolid = b4 * hubPop;

  const worksheetTone: "danger" | "success" = b4 > 0.5 ? "success" : "danger";
  const aiTone: "danger" | "success" = b4 > 0.5 ? "success" : "danger";

  const posWorksheet = nodePos(NODES[0].angle);
  const posAi = nodePos(NODES[1].angle);
  const posReview = nodePos(NODES[2].angle);

  const trailOpacity1 = b1;
  const trailOpacity2 = b2;

  // ---- beat 3 : scale-push the real page in (non-crossfade transition) ----
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ---- beat 4 : the checkmark pops per satellite ----
  const checkPop = Math.min(1, pop(B4_S + 30));

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
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 100,
            fontSize: 20,
            fontWeight: 750,
            color: P.ink,
            opacity: b1,
          }}
        >
          🧒 Boytasks — a family app for daily learning
        </div>

        {/* ================= flow-map : dominant visual, beats 1-2 & 4 ================= */}
        <Spoke to={posWorksheet} opacity={Math.max(hubGhost, hubSolid > 0.004 ? hubSolid : 0)} solid={hubSolid > 0.5} />
        <Spoke to={posAi} opacity={Math.max(aiShown > 0.004 ? hubGhost : 0, hubSolid)} solid={hubSolid > 0.5} />
        <Spoke to={posReview} opacity={hubSolid} solid={hubSolid > 0.5} />

        {/* hub */}
        <div
          style={{
            position: "absolute",
            left: HUB.x - 74 * Math.max(0.72, hubSolid || 1),
            top: HUB.y - 74 * Math.max(0.72, hubSolid || 1),
            width: 148 * Math.max(0.72, hubSolid || 1),
            height: 148 * Math.max(0.72, hubSolid || 1),
            borderRadius: "50%",
            background: hubSolid > 0.15 ? P.accentBg : P.chipBg,
            border: hubSolid > 0.15 ? `2.5px solid ${P.accent}` : `2px dashed ${P.border}`,
            boxShadow: hubSolid > 0.15 ? cardShadow : "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            opacity: Math.max(hubGhost, hubSolid),
          }}
        >
          <div style={{ fontSize: 28 }}>🧠</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: hubSolid > 0.15 ? P.ink : P.muted }}>Memory</div>
        </div>

        {/* worksheet satellite */}
        <GhostTrail x={posWorksheet.x} y={posWorksheet.y} opacity={trailOpacity1} />
        <NodeCard
          x={posWorksheet.x}
          y={posWorksheet.y}
          emoji="📝"
          label="Worksheet"
          sub={b4 > 0.5 ? "new colors, new pig ✓" : "🎨🐷 — 3 days running"}
          tone={worksheetTone}
          opacity={worksheetShown}
        />
        {b4 > 0.5 ? <CheckBadge x={posWorksheet.x + 74} y={posWorksheet.y - 82} size={30} opacity={b4} scale={checkPop} /> : null}

        {/* ai lesson satellite */}
        <GhostTrail x={posAi.x} y={posAi.y} opacity={trailOpacity2} />
        <NodeCard
          x={posAi.x}
          y={posAi.y}
          emoji="🤖"
          label="AI Lesson"
          sub={b4 > 0.5 ? "no repeat window ✓" : "14-day streak"}
          tone={aiTone}
          opacity={aiShown}
        />
        {b4 > 0.5 ? <CheckBadge x={posAi.x + 74} y={posAi.y - 82} size={30} opacity={b4} scale={checkPop} /> : null}

        {/* review track satellite — introduced fixed, in beat 4 */}
        <NodeCard
          x={posReview.x}
          y={posReview.y}
          emoji="🔁"
          label="Review Track"
          sub="moves on ✓"
          tone="success"
          opacity={reviewShown}
        />
        {b4 > 0.5 ? <CheckBadge x={posReview.x + 74} y={posReview.y - 82} size={30} opacity={b4} scale={checkPop} /> : null}

        {/* ---- beat 1-2 stats (numbers are the heroes) ---- */}
        <StatPill x={430} y={112} emoji="⚠" text="same 6 colors, same pig — 3 days" tone="danger" opacity={b1} />
        <StatPill x={430} y={112} emoji="⚠" text="one topic — 14 days straight" tone="danger" opacity={b2} />

        {/* ---- beat 4 : single tech chip ---- */}
        <FilterChip x={528} y={112} text="Supabase" icon="🧠" color={P.accent} scale={Math.min(1, hubPop)} opacity={hubSolid} />

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

        {/* ================= beat 5 : the result, from real numbers only ================= */}
        <LogWindow lines={LOG_LINES} title="boytasks — memory check" from={B5_S + 10} every={26} opacity={b5} win={WIN_LOG} fontSize={21} />
        <CaptionBand text="Ten days, not stuck on the same step." opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
