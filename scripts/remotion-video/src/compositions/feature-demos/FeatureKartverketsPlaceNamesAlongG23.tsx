/**
 * FeatureKartverketsPlaceNamesAlongG23 — feature g23 — 1280x720, 891 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 4 "flow-map" (assigned, not re-rolled): a horizontal road with fixed
 * place-dots runs the full width of the frame; a pipeline of nodes (Kartverket ->
 * research.py -> runner.py/dossier.py) sits above it and a token (the "Hoff" marker
 * on the road) travels/branches as the pipeline resolves it. Mood "violet" (assigned).
 *
 * Voice-synced beats (frame windows are load-bearing, do not shift):
 *   b1  15-232  "Driving past Hoff, a small place on the daily route, the guide
 *                stayed silent — it only knew spots added by hand."
 *   b2 241-393  "Now it pulls straight from Kartverket, Norway's own official
 *                register of place names."
 *   b3 402-649  "It keeps real farms, holdings and hamlets near the road, skips
 *                plain addresses, and looks up a local wiki page to back each name."
 *   b4 658-846  "Each name even gets translated into Ukrainian — as long as it
 *                sits within five hundred meters of the road." (holds to 891,
 *                no fade-out)
 *
 * Product plate (beat 1, verbatim): "Guide — Stories on the Road — A personal
 * audio guide for driving: the phone knows where I am and plays short stories
 * about the places around me, in Norwegian and Ukrainian side by side."
 *
 * Commit 35dd391 ("feat: Kartverket place names by the road, side corridor 100 m")
 * matches beats 2/3 and is represented ONLY as a drawn pipeline using the real
 * names from the feature (Kartverket/Geonorge, research.py, runner.py/dossier.py)
 * — no commit hash or diff is ever shown on screen, since no verified GitHub
 * diff URL exists tonight. Commit 79c0513 belongs to g24's story (replay, not
 * Kartverket) and is excluded entirely.
 *
 * Beat 3's LiveWindow plays the real feature page (shots/g23.json, shot "page")
 * — the only verified public URL used tonight, besides the (unused) hub.
 *
 * One tech caption: "Wikipedia" with a plain gloss ("a crowd-written encyclopedia,
 * used to confirm local history."), tied to beat 3's "looks up a local wiki page".
 *
 * LogWindow (beat 4) is built only from the feature's own real numbers: Kartverket/
 * Geonorge source, farms/holdings/hamlets kept vs addresses/admin-boundaries
 * filtered, 100m road corridor widened to 500m for settlements, NO+UA translation,
 * Hoff silent -> found as the concrete example.
 *
 * Single-codepoint emoji used: 🛣 🗺 🔎 📖 🚜 ⛪ 🏛 📍 🔇 ✓ 🇺🇦
 */
import React from "react";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import {
  LightBg,
  Headline,
  Panel,
  FilterChip,
  StatPill,
  CheckBadge,
  FlowArrow,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import shots from "./shots/g23.json";

const P = MOODS.violet;

const B1_S = 15, B1_E = 232;
const B2_S = 241, B2_E = 393;
const B3_S = 402, B3_E = 649;
const B4_S = 658, B4_E = 846; // holds to 891, no fade-out

const FADE = 9;

const WIN3: Win = { x: 230, y: 150, w: 820, h: 430 };
const WIN_LOG: Win = { x: 250, y: 150, w: 880, h: 420 };

const ROAD_Y = 560;
const ROAD_X0 = 70;
const ROAD_X1 = 1210;
const CHURCH_X = 220;
const MUSEUM_X = 430;
const FARM_X = 640;
const HOFF_X = 900;

const KV_X = 80, KV_Y = 130, NODE_W = 220;
const RESEARCH_X = 80, RESEARCH_Y = 270;
const RUNNER_X = 790, RUNNER_Y = 270;

const LOG_LINES: LogLine[] = [
  { text: "source: Kartverket · Geonorge place-name register", tone: "accent" },
  { text: "research.py: scanning names along the daily route", tone: "muted" },
  { text: "✓ keep farms, holdings, hamlets", tone: "success" },
  { text: "✗ skip plain addresses, admin boundaries", tone: "danger" },
  { text: "corridor: 100 m beside road, widened to 500 m for settlements", tone: "ink" },
  { text: "Hoff: 🔇 silent → 📍 found — story written NO + 🇺🇦 UA", tone: "success" },
];

/** Small road-side place marker — dot + emoji label, lit or dimmed. */
const RoadDot: React.FC<{ x: number; emoji: string; lit?: boolean; opacity?: number }> = ({
  x,
  emoji,
  lit = true,
  opacity = 1,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: x - 22, top: ROAD_Y - 48, opacity, fontFamily }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: lit ? P.card : "#E9E6F4",
          border: `2px solid ${lit ? P.accentEdge : P.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          boxShadow: cardShadow,
          filter: lit ? undefined : "grayscale(0.6)",
        }}
      >
        {emoji}
      </div>
    </div>
  );
};

/** Pipeline node card — Kartverket / research.py / runner.py. */
const PipeNode: React.FC<{
  x: number;
  y: number;
  emoji: string;
  title: string;
  sub?: string;
  opacity?: number;
  scale?: number;
}> = ({ x, y, emoji, title, sub, opacity = 1, scale = 1 }) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: NODE_W,
        padding: "14px 16px",
        borderRadius: 16,
        background: P.card,
        border: `1.5px solid ${P.accentEdge}`,
        boxShadow: cardShadow,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        fontFamily,
      }}
    >
      <div style={{ fontSize: 24 }}>{emoji}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: P.ink, marginTop: 4 }}>{title}</div>
      {sub ? <div style={{ fontSize: 13, color: P.muted, marginTop: 3, lineHeight: 1.3 }}>{sub}</div> : null}
    </div>
  );
};

/** Vertical connector — FlowArrow is horizontal-only, so a small local helper. */
const VertArrow: React.FC<{ x: number; y: number; len: number; progress?: number; opacity?: number }> = ({
  x,
  y,
  len,
  progress = 1,
  opacity = 1,
}) => {
  if (opacity <= 0.004 || progress <= 0.004) return null;
  const shaft = Math.max(2, (len - 16) * progress);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 7, height: shaft, borderRadius: 4, background: P.accent }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: `16px solid ${P.accent}`,
          opacity: progress > 0.85 ? 1 : 0,
        }}
      />
    </div>
  );
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping: 14, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE); // holds — no fade-out term

  const pipelineOn = frame >= B2_S ? 1 : 0;
  const kvPop = pop(B2_S);
  const researchPop = pop(B2_S + 16);
  const arrow1 = interpolate(frame, [B2_S + 10, B2_S + 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const runnerPop = pop(B3_S);
  const arrow2 = interpolate(frame, [B3_S + 8, B3_S + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vArrow = interpolate(frame, [B3_S + 70, B3_S + 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Hoff marker: 🔇 silent (b1) -> checking pulse (b2) -> 📍 found (b3 strike/flip) -> small corner badge (b4)
  const hoffState: "silent" | "checking" | "found" = frame < B2_S ? "silent" : frame < B3_S + 115 ? "checking" : "found";
  const hoffFlip = interpolate(frame, [B3_S + 108, B3_S + 118], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const checkPulse = frame >= B2_S ? (Math.sin((frame - B2_S) / 6) + 1) / 2 : 0;

  // Beat 3 LiveWindow — scale-push entrance.
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w3cx = WIN3.x + WIN3.w / 2;
  const w3cy = WIN3.y + WIN3.h / 2;

  // Beat 4 LogWindow — rise-in.
  const riseY = interpolate(frame, [B4_S, B4_S + 18], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const plateOp = interpolate(frame, [B1_S + 4, B1_S + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      <LightBg />

      {/* persistent road strip, visible from beat 1 onward, dims under beat-3 LiveWindow */}
      <div
        style={{
          position: "absolute",
          left: ROAD_X0,
          top: ROAD_Y,
          width: ROAD_X1 - ROAD_X0,
          height: 10,
          borderRadius: 5,
          background: P.border,
          opacity: 0.9,
        }}
      />
      <RoadDot x={CHURCH_X} emoji="⛪" lit opacity={frame >= B1_S ? (frame < B3_S ? 1 : 0.4) : 0} />
      <RoadDot x={MUSEUM_X} emoji="🏛" lit opacity={frame >= B1_S ? (frame < B3_S ? 1 : 0.4) : 0} />
      <RoadDot x={FARM_X} emoji="🚜" lit opacity={frame >= B1_S ? (frame < B3_S ? 1 : 0.4) : 0} />

      {/* Hoff marker — state machine, non-crossfade flips */}
      {frame >= B1_S ? (
        <div style={{ position: "absolute", left: HOFF_X - 70, top: ROAD_Y - 100, width: 140, textAlign: "center", opacity: frame < B4_S ? 1 : 0.0, fontFamily }}>
          {hoffState === "silent" ? (
            <div style={{ fontSize: 15, fontWeight: 800, color: P.muted, background: "#EDEBF7", border: `1.5px solid ${P.border}`, borderRadius: 999, padding: "6px 14px", display: "inline-block" }}>
              🔇 SILENT — Hoff
            </div>
          ) : hoffState === "checking" ? (
            <div style={{ fontSize: 15, fontWeight: 800, color: P.accent, background: P.accentBg, border: `1.5px solid ${P.accentEdge}`, borderRadius: 999, padding: "6px 14px", display: "inline-block", opacity: 0.55 + checkPulse * 0.45 }}>
              🔎 checking Kartverket… Hoff
            </div>
          ) : (
            <div style={{ fontSize: 15, fontWeight: 800, color: P.success, background: P.successBg, border: `1.5px solid ${P.successEdge}`, borderRadius: 999, padding: "6px 14px", display: "inline-block", transform: `scale(${0.85 + hoffFlip * 0.15})` }}>
              📍 Hoff — found ✓
            </div>
          )}
        </div>
      ) : null}

      {/* small persistent corner badge once resolved, carried into beat 4 */}
      <div style={{ position: "absolute", left: 60, top: 110, opacity: frame >= B3_S + 118 ? 1 : 0, fontFamily }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: P.success, background: P.successBg, border: `1.5px solid ${P.successEdge}`, borderRadius: 999, padding: "6px 14px" }}>
          ✓ Hoff — now a stop
        </div>
      </div>

      {/* persistent pipeline skeleton — the architecture is on screen from beat 1,
          dormant/grayed until Kartverket is wired in, so the frame is never half
          empty waiting for the pipeline to start popping in at beat 2 */}
      <div style={{ opacity: frame >= B1_S ? 0.32 : 0, filter: "grayscale(0.9)" }}>
        <PipeNode x={KV_X} y={KV_Y} emoji="🗺" title="Kartverket" sub="Geonorge place-name register" />
        <VertArrow x={KV_X + NODE_W / 2 - 3} y={KV_Y + 92} len={60} progress={1} />
        <PipeNode x={RESEARCH_X} y={RESEARCH_Y} emoji="🔎" title="research.py" sub="filters names along the route" />
        <FlowArrow x={RESEARCH_X + NODE_W + 14} y={RESEARCH_Y + 46} len={460} progress={1} color={P.muted} />
        <PipeNode x={RUNNER_X} y={RUNNER_Y} emoji="📖" title="runner.py / dossier.py" sub="matches a local wiki page" />
        <VertArrow x={RUNNER_X + NODE_W / 2 - 3} y={RUNNER_Y + 92} len={360} progress={1} />
      </div>

      {/* pipeline nodes, beat 2 onward, dim under beat-3 LiveWindow */}
      <div style={{ opacity: pipelineOn ? (frame < B3_S ? 1 : 0.45) : 0 }}>
        <PipeNode x={KV_X} y={KV_Y} emoji="🗺" title="Kartverket" sub="Geonorge place-name register" opacity={kvPop} scale={0.9 + kvPop * 0.1} />
        <VertArrow x={KV_X + NODE_W / 2 - 3} y={KV_Y + 92} len={60} progress={1} opacity={researchPop} />
        <PipeNode x={RESEARCH_X} y={RESEARCH_Y} emoji="🔎" title="research.py" sub="filters names along the route" opacity={researchPop} scale={0.9 + researchPop * 0.1} />
        <FlowArrow x={RESEARCH_X + NODE_W + 14} y={RESEARCH_Y + 46} len={460} progress={arrow2} color={P.accent} opacity={runnerPop > 0.1 ? 1 : 0} />
        <PipeNode x={RUNNER_X} y={RUNNER_Y} emoji="📖" title="runner.py / dossier.py" sub="matches a local wiki page" opacity={runnerPop} scale={0.9 + runnerPop * 0.1} />
        <VertArrow x={RUNNER_X + NODE_W / 2 - 3} y={RUNNER_Y + 92} len={360} progress={vArrow} opacity={runnerPop} />
      </div>

      {/* beat 1 */}
      <Headline y={42} text="A place along the road, Hoff — the guide used to say nothing." opacity={b1} />
      <Panel x={40} y={96} w={430} h={132} tone="card" opacity={plateOp * b1}>
        <div style={{ position: "absolute", left: 20, top: 16, right: 20 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: P.ink }}>🛣 Guide — Stories on the Road</div>
          <div style={{ fontSize: 14, color: P.muted, lineHeight: 1.4, marginTop: 8 }}>
            A personal audio guide for driving: the phone knows where I am
            and plays short stories about the places around me, in
            Norwegian and Ukrainian side by side.
          </div>
        </div>
      </Panel>
      <CaptionBand text="Only spots added by hand ever got a story." opacity={b1} />

      {/* beat 2 */}
      <Headline y={42} text="Now it pulls straight from Kartverket —" accentText="Norway's own place-name register." accentColor={P.accent} opacity={b2} />
      <CaptionBand text="Norway's official register of place names, not a hand-kept list." opacity={b2} />

      {/* beat 3 */}
      <Headline y={42} text="Real farms, holdings and hamlets kept — plain addresses skipped." opacity={b3} />
      <StatPill x={80} y={400} emoji="✓" text="farms, holdings, hamlets" tone="success" opacity={b3} />
      <StatPill x={80} y={450} emoji="✗" text="plain addresses, admin bounds" tone="danger" opacity={b3} />
      <FilterChip x={790} y={400} text="Wikipedia" icon="📖" opacity={b3} color={P.accent} />
      <div style={{ position: "absolute", left: 790, top: 450, width: 220, fontSize: 13, color: P.muted, lineHeight: 1.3, opacity: b3, fontFamily }}>
        a crowd-written encyclopedia, used to confirm local history.
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          transform: `scale(${pushScale})`,
          transformOrigin: `${w3cx}px ${w3cy}px`,
        }}
      >
        <LiveWindow file={shots as any} shot="page" title="vitalii.no — kartverkets-place-names-along-the-road" from={B3_S} hold={B3_E - B3_S} opacity={b3} win={WIN3} />
      </div>
      <CaptionBand text="Each kept name is matched to a local wiki page to back the story." opacity={b3} />

      {/* beat 4 */}
      <Headline y={42} text="Each name even gets translated into Ukrainian —" accentText="within 500 m of the road." accentColor={P.accent} opacity={b4} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `translateY(${riseY}px)` }}>
        <LogWindow lines={LOG_LINES} title="runner.py — Hoff" from={B4_S + 6} every={22} opacity={b4} win={WIN_LOG} fontSize={21} />
      </div>
      <CheckBadge x={WIN_LOG.x + WIN_LOG.w - 70} y={WIN_LOG.y - 24} opacity={interpolate(frame, [B4_S + 150, B4_S + 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <CaptionBand text="The 100 m road corridor widens to 500 m for proper settlements like Hoff." opacity={b4} />
    </>
  );
};

export const FeatureKartverketsPlaceNamesAlongG23: React.FC = () => (
  <PaletteProvider value={P}>
    <Scene />
  </PaletteProvider>
);
