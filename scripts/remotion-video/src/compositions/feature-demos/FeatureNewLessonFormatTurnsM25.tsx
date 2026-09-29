/**
 * FeatureNewLessonFormatTurnsM25 — feature m25 — 1280x720, 891 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 4 "flow map", mood "slate" (handed down, not re-drawn; re-shoot
 * from mood "mint" — same beats, same narration, cooler graphite/cyan skin).
 *
 * The old format forced every requested word through ONE linear story: a
 * single unbranching lane from request to a buried word, or — for an
 * uploaded document — the same lane just reading the whole file start to
 * finish. Beats 1-2 draw exactly that: a single straight lane, no branches,
 * a target word buried halfway along it. Beat 3 is where the flow map
 * actually appears: a "Word Plan" hub drops into the middle of that same
 * lane and splits it into independent routes, one per word, with a token
 * visibly traveling and forking down each route — the one tech name in the
 * whole clip (Claude) is glossed in plain English right next to the hub.
 * The one UI beat (per STEP 0c) is the real feature page, scale-pushed in
 * beside the hub as proof the format is real (non-crossfade transition).
 * Beat 4 fully branches: every route is lit and four independent word
 * flashcards sit on the right, each checked on its own. Beat 5 does not
 * play the feature page or the hub (gate 2): it closes on a LogWindow built
 * only from the numbers already in the narration and the feature's own
 * result — held at full brightness through the tail, no fade-out.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-150  "I wanted to drill one word - but had to sit through an
 *              entire story to reach it."
 *  b2 159-337  "Every sentence buried it in a narrative, and uploading a
 *              document just read the whole file aloud."
 *  b3 346-503  "Now a new lesson format builds a pool of just the words
 *              that matter, using Claude."
 *  b4 512-699  "Like flashcards instead of a novel - each word stands
 *              alone, with its own checked sentences."
 *  b5 708-846  "Ask for the 20 most common adverbs, and that's exactly
 *              what you get to drill." — holds to 891, no fade-out.
 *
 * Single tech name in the whole clip: Claude (one FilterChip, beat 3-4
 * only, with a plain-English gloss caption right beside it).
 * All numbers (60-word pool, 6/8/10 sentences per word, 20 adverbs) come
 * straight from the narration and the feature's own description — nothing
 * here is an invented statistic.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import { Headline, StatPill, FilterChip, CaptionBand, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/m25.json";

const P = MOODS.slate;

const B1_S = 15, B1_E = 150;
const B2_S = 159, B2_E = 337;
const B3_S = 346, B3_E = 503;
const B4_S = 512, B4_E = 699;
const B5_S = 708, B5_E = 846;
const FADE = 9;

const WIN3: Win = { x: 230, y: 150, w: 820, h: 430 };
const WIN_LOG: Win = { x: 250, y: 150, w: 880, h: 420 };

const SOURCE = { x: 60, y: 290, w: 210, h: 150 };
const HUB = { x: 540, y: 260, w: 200, h: 200 };
const LANE_Y = 320, LANE_H = 110, LANE_X1 = 280, LANE_X2 = 960;
const OUT_X = 980, OUT_W = 230, OUT_H = 110;
const OUT_Y = [40, 190, 340, 490];

/** The single old-format lane: one straight, unbranching bar with a target
 * word buried inside it (beat 1) or a "reads the whole file" marker at the
 * far end (beat 2). No routing, no forks — the opposite of the flow map. */
const StoryLane: React.FC<{ opacity: number; markerText: string; markerAt: number; label: string; icon: string }> = ({
  opacity,
  markerText,
  markerAt,
  label,
  icon,
}) => {
  if (opacity <= 0.004) return null;
  const markerX = LANE_X1 + (LANE_X2 - LANE_X1) * markerAt;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: LANE_X1,
          top: LANE_Y,
          width: LANE_X2 - LANE_X1,
          height: LANE_H,
          borderRadius: LANE_H / 2,
          background: P.dangerBg,
          border: `1.5px dashed ${P.dangerEdge}`,
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LANE_X1,
          top: LANE_Y - 34,
          fontSize: 16,
          fontWeight: 750,
          color: P.danger,
          opacity,
        }}
      >
        {icon} {label}
      </div>
      <div
        style={{
          position: "absolute",
          left: markerX - 46,
          top: LANE_Y + LANE_H / 2 - 22,
          width: 92,
          height: 44,
          borderRadius: 12,
          background: P.card,
          border: `2px solid ${P.danger}`,
          boxShadow: cardShadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 800,
          color: P.ink,
          opacity,
        }}
      >
        {markerText}
      </div>
    </>
  );
};

/** Faint full-canvas tiling so the single active lane still leaves the
 * whole 1280x720 frame textured (frame-fill gate), not empty. */
const RepeatWallpaper: React.FC<{ opacity: number; emoji: string }> = ({ opacity, emoji }) => {
  if (opacity <= 0.004) return null;
  const cols = 7, rows = 5, stepX = 165, stepY = 145, startX = 44, startY = 15;
  return (
    <>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <div
            key={`w-${r}-${c}`}
            style={{
              position: "absolute",
              left: startX + c * stepX,
              top: startY + r * stepY,
              fontSize: 30,
              opacity: opacity * 0.24,
              filter: "grayscale(1)",
            }}
          >
            {emoji}
          </div>
        ))
      )}
    </>
  );
};

/** A straight route from the hub to one output card, with a token that
 * travels and (in beat 3) visibly forks off the shared trunk. */
const Route: React.FC<{ x1: number; y1: number; x2: number; y2: number; progress: number; color: string; opacity: number }> = ({
  x1,
  y1,
  x2,
  y2,
  progress,
  color,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity, pointerEvents: "none" }}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - Math.max(0, Math.min(1, progress)))}
      />
    </svg>
  );
};

const Token: React.FC<{ x1: number; y1: number; x2: number; y2: number; t: number; color: string; opacity: number }> = ({
  x1,
  y1,
  x2,
  y2,
  t,
  color,
  opacity,
}) => {
  if (opacity <= 0.004 || t <= 0 || t >= 1) return null;
  const x = x1 + (x2 - x1) * t;
  const y = y1 + (y2 - y1) * t;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 7,
        top: y - 7,
        width: 14,
        height: 14,
        borderRadius: 7,
        background: color,
        opacity,
        boxShadow: `0 0 12px ${color}`,
      }}
    />
  );
};

const WORDS = [
  { w: "ofte", gloss: "often" },
  { w: "sjelden", gloss: "rarely" },
  { w: "alltid", gloss: "always" },
  { w: "aldri", gloss: "never" },
];

const WordCard: React.FC<{ y: number; word: string; gloss: string; opacity: number; checkPop: number }> = ({
  y,
  word,
  gloss,
  opacity,
  checkPop,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: OUT_X,
        top: y,
        width: OUT_W,
        height: OUT_H,
        borderRadius: 16,
        background: P.card,
        border: `1.5px solid ${P.successEdge}`,
        boxShadow: cardShadow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        opacity,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 20 }}>🔤</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: P.ink }}>{word}</div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: P.success,
          background: P.successBg,
          borderRadius: 8,
          padding: "2px 8px",
        }}
      >
        {gloss}
      </div>
      <CheckBadge x={OUT_X + OUT_W - 14} y={y - 4} size={24} opacity={opacity} scale={checkPop} />
    </div>
  );
};

const IdleOutput: React.FC<{ y: number; opacity: number }> = ({ y, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: OUT_X,
        top: y,
        width: OUT_W,
        height: OUT_H,
        borderRadius: 16,
        background: "rgba(255,255,255,0.5)",
        border: `1.5px dashed ${P.border}`,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 700,
        color: P.muted,
      }}
    >
      waiting…
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "before", text: "old format: one story — the requested word buried inside", tone: "danger" },
  { t: "before", text: "upload a document → whole file read aloud, no filtering", tone: "danger" },
  { t: "check", text: "word_plan() (Claude) → pool of up to 60 words, each with forms + gloss", tone: "accent" },
  { t: "after", text: "write_words() → 6, 8, or 10 checked sentences per word", tone: "success" },
  { t: "after", text: "ask: \"20 most common adverbs\" → 20 independent word cards", tone: "success" },
  { t: "after", text: "no story required — each word stands alone", tone: "success" },
];

export const FeatureNewLessonFormatTurnsM25: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  const hubGhost = Math.max(b1, b2) * 0.42;
  const hubPop = Math.min(1, pop(B3_S));
  const hubOpen = Math.max(b3, b4) * hubPop;
  const hubTail = b5 * 0.15;
  const hubOpacity = Math.max(hubGhost, hubOpen, hubTail);
  const hubLit = hubOpen > 0.15;

  const checkPop = Math.min(1, pop(B4_S + 20));
  const chipPop = Math.min(1, pop(B3_S + 24));

  // ---- beat 3 : scale-push the real page in (non-crossfade transition) ----
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ---- token travel + branch progress, one per output route ----
  const hubCx = HUB.x + HUB.w, hubCy = HUB.y + HUB.h / 2;
  const routeProgress = (delay: number) => interpolate(frame, [B3_S + delay, B3_S + delay + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const branchP3 = routeProgress(30); // beat 3: only the first route forks
  const branchP4 = [0, 1, 2, 3].map((i) => interpolate(frame, [B4_S + i * 10, B4_S + i * 10 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const tokenT3 = ((frame - (B3_S + 20)) % 60) / 60;
  const tokenT4 = [0, 1, 2, 3].map((i) => ((frame - (B4_S + 10 + i * 6)) % 70) / 70);

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
        <Headline y={42} text="I wanted to drill one word —" accentText="not sit through a story." accentColor={P.danger} opacity={b1} fontSize={30} />
        <Headline y={42} text="Uploading a document just" accentText="read the whole file aloud." accentColor={P.danger} opacity={b2} fontSize={30} />
        <Headline y={42} text="Now a lesson format builds a" accentText="pool of just the words." accentColor={P.accent} opacity={b3} fontSize={30} />
        <Headline y={42} text="Like flashcards," accentText="not a novel." accentColor={P.success} opacity={b4} fontSize={32} />
        <Headline y={42} text="Ask for 20 adverbs —" accentText="that's exactly what you drill." accentColor={P.success} opacity={b5} fontSize={28} />

        {/* ================= beats 1-2 : product line plate ================= */}
        <div style={{ position: "absolute", left: 90, top: 96, fontSize: 19, fontWeight: 750, color: P.ink, opacity: Math.max(b1, b2) }}>
          🎧 Mini Elvarika — Norwegian by Ear, a personal listening app
        </div>

        {/* ================= background texture (frame-fill) ================= */}
        <RepeatWallpaper opacity={b1} emoji="📖" />
        <RepeatWallpaper opacity={b2} emoji="📄" />

        {/* ================= persistent request source ================= */}
        <div
          style={{
            position: "absolute",
            left: SOURCE.x,
            top: SOURCE.y,
            width: SOURCE.w,
            height: SOURCE.h,
            borderRadius: 18,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: cardShadow,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontFamily,
          }}
        >
          <div style={{ fontSize: 26 }}>📝</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>Request</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: P.muted }}>
            {b1 > 0.4 ? "one word" : b2 > 0.4 ? "a document" : "20 adverbs"}
          </div>
        </div>

        {/* ================= beats 1-2 : the single unbranching lane ================= */}
        <StoryLane opacity={b1} markerText="sjelden" markerAt={0.62} label="one story, one buried word" icon="📖" />
        <StoryLane opacity={b2} markerText="📢 all" markerAt={0.9} label="reads the whole file, start to finish" icon="📄" />
        <StatPill x={90} y={LANE_Y + LANE_H + 26} emoji="⚠" text="the word you asked for is buried inside" tone="danger" opacity={b1} />
        <StatPill x={90} y={LANE_Y + LANE_H + 26} emoji="⚠" text="no way to focus on the words that matter" tone="danger" opacity={b2} />

        {/* ================= the Word Plan hub — persistent, changes state ================= */}
        <div
          style={{
            position: "absolute",
            left: HUB.x,
            top: HUB.y,
            width: HUB.w,
            height: HUB.h,
            borderRadius: "50%",
            background: hubLit ? P.accentBg : P.chipBg,
            border: hubLit ? `3px solid ${P.accent}` : `3px dashed ${P.accentEdge}`,
            boxShadow: hubLit ? cardShadow : "none",
            opacity: hubOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 32 }}>🔀</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: hubLit ? P.ink : P.muted, textAlign: "center" }}>
            {hubLit ? "Word Plan" : "no plan yet"}
          </div>
        </div>
        <FilterChip x={HUB.x - 10} y={HUB.y - 44} text="Claude" icon="🤖" color={P.accent} scale={chipPop} opacity={Math.max(b3, b4)} />
        <StatPill x={HUB.x - 40} y={HUB.y + HUB.h + 14} emoji="💬" text="the AI that picks the words" tone="accent" opacity={Math.max(b3, b4)} />

        {/* ================= beats 3-4 : routes fanning from the hub to each word ================= */}
        {OUT_Y.map((y, i) => {
          const cy = y + OUT_H / 2;
          const p = i === 0 ? Math.max(branchP3, branchP4[i]) : branchP4[i];
          const on = Math.max(b3 * (i === 0 ? 1 : 0), b4);
          return (
            <React.Fragment key={i}>
              <Route x1={hubCx} y1={hubCy} x2={OUT_X} y2={cy} progress={p} color={P.success} opacity={on} />
              {i === 0 && <Token x1={hubCx} y1={hubCy} x2={OUT_X} y2={cy} t={tokenT3} color={P.accent} opacity={b3} />}
              <Token x1={hubCx} y1={hubCy} x2={OUT_X} y2={cy} t={tokenT4[i]} color={P.success} opacity={b4} />
            </React.Fragment>
          );
        })}

        <IdleOutput y={OUT_Y[0]} opacity={Math.max(b1, b2) * 0.55} />
        <IdleOutput y={OUT_Y[1]} opacity={Math.max(b1, b2, b3) * 0.55} />
        <IdleOutput y={OUT_Y[2]} opacity={Math.max(b1, b2, b3) * 0.55} />
        <IdleOutput y={OUT_Y[3]} opacity={Math.max(b1, b2, b3) * 0.55} />

        {WORDS.map((wd, i) => (
          <WordCard key={wd.w} y={OUT_Y[i]} word={wd.w} gloss={wd.gloss} opacity={b4} checkPop={checkPop} />
        ))}
        {b3 > 0.15 && <WordCard y={OUT_Y[0]} word={WORDS[0].w} gloss={WORDS[0].gloss} opacity={b3} checkPop={checkPop} />}

        {/* ================= per-beat captions ================= */}
        <CaptionBand text="One story. One word, if you're lucky." opacity={b1} tone="danger" />
        <CaptionBand text="Upload a document, get the whole thing read back." opacity={b2} tone="danger" />
        <CaptionBand text="A pool of just the words that matter." opacity={b3} tone="accent" />
        <CaptionBand text="Each word stands alone, with its own checked sentences." opacity={b4} tone="success" />

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
            title="vitalii.no/features/…-m25"
            win={WIN3}
            from={B3_S}
            hold={B3_E - B3_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b3}
          />
        </div>

        {/* ================= beat 5 : the result, from real numbers only (gate 2: never the feature page/hub) ================= */}
        <LogWindow lines={LOG_LINES} title="mini-elvarika — word_plan()" from={B5_S + 10} every={22} opacity={b5} win={WIN_LOG} fontSize={21} />
        <CaptionBand text="Ask for 20 adverbs, drill exactly 20 adverbs." opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
