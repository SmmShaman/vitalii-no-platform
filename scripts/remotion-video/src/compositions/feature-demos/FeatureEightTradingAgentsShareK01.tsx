/**
 * FeatureEightTradingAgentsShareK01 — feature k01 — 1280x720, 933 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 4 "flow map", mood "violet" (both handed down by
 * the orchestrating session). The persistent element for the whole clip is a
 * small top-right "every 30s" loop badge that never fades out. The dominant
 * visual is a flow-map ellipse of the eight real agent jobs (scout.ts,
 * enrich.ts, risk.ts, brain.ts, trader.ts, launcher.ts, treasury.ts,
 * reporter.ts) that fills most of the frame from beat 1 through beat 4: they
 * start as eight lone cards, grow clocks and colliding arrows into a shared
 * center in beat 2, that center pops into a hub named "Desk" (the single
 * Durable Object) in beat 3 — a spring pop, not a crossfade — and in beat 4 a
 * single ticket token walks the loop node by node, illustrating "one cook,
 * one ticket at a time". Beat 5 is the shipped result, so per STEP 0c it
 * scale-pushes in a recording of the real feature page (shots/k01.json, shot
 * "page") as proof, the same way FeatureRiskScoringVetoesSerialK03 (k03) and
 * FeatureTraceabilityScannerLive (p61) close on their own pages.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-237  "A trading bot needs eight jobs done — watch the market,
 *              score risk, decide, trade, and guard the money."
 *  b2 246-372  "Do that with eight separate timers and they trip over each
 *              other's numbers."
 *  b3 381-466  "Now one Durable Object owns the whole loop."
 *  b4 475-647  "Instead of eight cooks fighting over one stove, it's one
 *              cook working a single ticket at a time."
 *  b5 656-888  "Every 30 seconds it walks the whole desk in order — no
 *              server to babysit, no race. Eight schedules became one."
 *              — holds to 933, no fade-out.
 *
 * Single tech name in the whole clip: Durable Object (beat 3/4 chip only).
 * The eight job names and files are the real ones from desk.ts; nothing
 * here is an invented agent or metric.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import { Headline, StatPill, FilterChip, CaptionBand, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/k01.json";

const P = MOODS.violet;

const B1_S = 15, B1_E = 237;
const B2_S = 246, B2_E = 372;
const B3_S = 381, B3_E = 466;
const B4_S = 475, B4_E = 647;
const B5_S = 656, B5_E = 888;
const END = 933;
const FADE = 9;

const HUB = { x: 640, y: 385 };
const RX = 460;
const RY = 195;

const WIN5: Win = { x: 230, y: 150, w: 820, h: 430 };

const AGENTS: { file: string; emoji: string; label: string }[] = [
  { file: "scout.ts", emoji: "🔭", label: "scan market" },
  { file: "enrich.ts", emoji: "📊", label: "pull data" },
  { file: "risk.ts", emoji: "⚖", label: "score risk" },
  { file: "brain.ts", emoji: "🧠", label: "decide" },
  { file: "trader.ts", emoji: "💱", label: "trade" },
  { file: "launcher.ts", emoji: "🚀", label: "launch token" },
  { file: "treasury.ts", emoji: "🛡", label: "guard funds" },
  { file: "reporter.ts", emoji: "📣", label: "report" },
];

function nodePos(i: number): { x: number; y: number } {
  const angle = ((-90 + i * (360 / AGENTS.length)) * Math.PI) / 180;
  return { x: HUB.x + RX * Math.cos(angle), y: HUB.y + RY * Math.sin(angle) };
}

/** One job card on the flow-map ring. */
const NodeCard: React.FC<{
  x: number;
  y: number;
  emoji: string;
  label: string;
  file: string;
  opacity: number;
  jitter?: number;
  glow?: number;
}> = ({ x, y, emoji, label, file, opacity, jitter = 0, glow = 0 }) => {
  if (opacity <= 0.004) return null;
  const bg = glow > 0.15 ? P.successBg : P.card;
  const edge = glow > 0.15 ? P.successEdge : P.border;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 68 + jitter,
        top: y - 54,
        width: 136,
        height: 108,
        borderRadius: 18,
        background: bg,
        border: `1.5px solid ${edge}`,
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
      <div style={{ fontSize: 30 }}>{emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: P.ink, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, fontFamily: "ui-monospace, Menlo, monospace" }}>
        {file}
      </div>
    </div>
  );
};

/** Thin spoke line from the hub out to a node. */
const Spoke: React.FC<{ to: { x: number; y: number }; opacity: number; highlight?: number }> = ({
  to,
  opacity,
  highlight = 0,
}) => {
  if (opacity <= 0.004) return null;
  const dx = to.x - HUB.x;
  const dy = to.y - HUB.y;
  const full = Math.sqrt(dx * dx + dy * dy);
  const len = Math.max(0, full - 150);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const startX = HUB.x + (dx / full) * 78;
  const startY = HUB.y + (dy / full) * 78;
  const color = highlight > 0.15 ? P.success : P.accentEdge;
  return (
    <div
      style={{
        position: "absolute",
        left: startX,
        top: startY,
        width: len,
        height: highlight > 0.15 ? 4 : 2.5,
        background: color,
        opacity,
        transform: `rotate(${angleDeg}deg)`,
        transformOrigin: "0 50%",
        borderRadius: 4,
      }}
    />
  );
};

export const FeatureEightTradingAgentsShareK01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  const nodesShown = Math.max(b1, b2, b3, b4);
  const hubShown = Math.max(b3, b4);
  const hubPop = Math.min(1, pop(B3_S));

  // ---- persistent element: the 30-second loop badge, never fades out ----
  const badgeIn = seg(frame, 0, 15);
  const badgePulse = 1 + 0.05 * Math.sin(frame / 10);

  // ---- beat 1 : eight lone jobs, staggered entrance ----
  const cardIn = (i: number) => seg(frame, B1_S + 6 + i * 10, B1_S + 6 + i * 10 + 14);

  // ---- beat 2 : timers collide on the same shared rows ----
  const jitterFor = (i: number) => Math.sin((frame + i * 13) / 3.2) * 2.4 * b2;
  const collideRing = (frame % 26) / 26;
  const collideOpacity = (1 - collideRing) * b2 * 0.55;

  // ---- beat 4 : one ticket, one node at a time ----
  const t4 = Math.max(0, Math.min(1, (frame - B4_S) / (B4_E - B4_S)));
  const contIdx = t4 * AGENTS.length;
  const idxFrom = Math.floor(contIdx) % AGENTS.length;
  const idxTo = (idxFrom + 1) % AGENTS.length;
  const frac = contIdx - Math.floor(contIdx);
  const posFrom = nodePos(idxFrom);
  const posTo = nodePos(idxTo);
  const ticketX = posFrom.x + (posTo.x - posFrom.x) * frac;
  const ticketY = posFrom.y + (posTo.y - posFrom.y) * frac;
  const glowFor = (i: number) => {
    const d = Math.min(Math.abs(contIdx - i), AGENTS.length - Math.abs(contIdx - i));
    return Math.max(0, 1 - d * 2.2) * b4;
  };

  // ---- beat 5 : scale-push the real product in (non-crossfade transition) ----
  const pushScale = interpolate(frame, [B5_S, B5_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const resultStripIn = seg(frame, B5_S + 60, B5_S + 76);
  const checkPop = Math.min(1, pop(B5_S + 40));

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

        {/* ================= persistent badge : the 30s loop ================= */}
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 36,
            padding: "9px 18px",
            borderRadius: 999,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: cardShadow,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: badgeIn,
            transform: `scale(${badgePulse})`,
            fontSize: 16,
            fontWeight: 700,
            color: P.muted,
          }}
        >
          <span style={{ fontSize: 18 }}>🔁</span>
          every 30s
        </div>

        {/* ================= beat headlines ================= */}
        <Headline y={42} text="A trading bot needs eight jobs done." opacity={b1} fontSize={33} />
        <Headline y={42} text="Eight separate timers, one shared database." opacity={b2} fontSize={31} />
        <Headline y={42} text="One Durable Object" accentText="owns the whole loop." accentColor={P.accent} opacity={b3} fontSize={34} />
        <Headline y={42} text="One cook, one ticket, one stove." opacity={b4} fontSize={33} />
        <Headline y={42} text="Eight schedules became" accentText="one." accentColor={P.success} opacity={b5} fontSize={34} />

        {/* ================= flow-map ring : the dominant visual, beats 1-4 ================= */}
        {AGENTS.map((a, i) => {
          const pos = nodePos(i);
          return (
            <NodeCard
              key={a.file}
              x={pos.x}
              y={pos.y}
              emoji={a.emoji}
              label={a.label}
              file={a.file}
              opacity={nodesShown * (b1 > 0.004 ? cardIn(i) : 1)}
              jitter={jitterFor(i)}
              glow={glowFor(i)}
            />
          );
        })}

        {/* ---- beat 2 : shared center under collision, arrows converging ---- */}
        {AGENTS.map((a, i) => (
          <Spoke key={`arrow-${a.file}`} to={nodePos(i)} opacity={b2 * 0.5} />
        ))}
        <div
          style={{
            position: "absolute",
            left: HUB.x - 30,
            top: HUB.y - 30,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            opacity: b2,
          }}
        >
          🗄
        </div>
        <div
          style={{
            position: "absolute",
            left: HUB.x - 46,
            top: HUB.y - 46,
            width: 92,
            height: 92,
            borderRadius: "50%",
            border: `3px solid ${P.danger}`,
            opacity: collideOpacity,
          }}
        />
        <StatPill x={430} y={112} emoji="⚠" text="racing for the same rows" tone="danger" opacity={b2} />

        {/* ---- beats 3-4 : the hub, "Desk", spokes solid ---- */}
        {AGENTS.map((a, i) => (
          <Spoke key={`spoke-${a.file}`} to={nodePos(i)} opacity={hubShown} highlight={glowFor(i)} />
        ))}
        <div
          style={{
            position: "absolute",
            left: HUB.x - 78 * hubPop,
            top: HUB.y - 78 * hubPop,
            width: 156 * hubPop,
            height: 156 * hubPop,
            borderRadius: "50%",
            background: P.accentBg,
            border: `2.5px solid ${P.accent}`,
            boxShadow: cardShadow,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            opacity: hubShown * hubPop,
          }}
        >
          <div style={{ fontSize: 30 * hubPop }}>🧭</div>
          <div style={{ fontSize: 20 * hubPop, fontWeight: 800, color: P.ink }}>Desk</div>
        </div>
        <FilterChip
          x={528}
          y={112}
          text="Durable Object"
          icon="🧭"
          color={P.accent}
          scale={hubPop}
          opacity={hubShown * hubPop}
        />

        {/* ---- beat 4 : the one ticket walking the loop ---- */}
        {b4 > 0.004 ? (
          <div
            style={{
              position: "absolute",
              left: ticketX - 26,
              top: ticketY - 26,
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: P.card,
              border: `2.5px solid ${P.success}`,
              boxShadow: cardShadow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              opacity: b4,
            }}
          >
            🎫
          </div>
        ) : null}

        {/* ================= per-beat captions ================= */}
        <CaptionBand text="Watch the market, score risk, decide, trade, guard the funds." opacity={b1} />
        <CaptionBand text="All eight reach for the same database rows at once." opacity={b2} tone="danger" />
        <CaptionBand text="Desk — a single Durable Object with one alarm loop." opacity={b3} tone="accent" />
        <CaptionBand text="It works the queue in order — never two jobs at once." opacity={b4} tone="success" />

        {/* ================= beat 5 : the real page, scale-pushed in ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN5.x + WIN5.w / 2}px ${WIN5.y + WIN5.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-k01"
            win={WIN5}
            from={B5_S}
            hold={END - B5_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b5}
          />
        </div>
        <CheckBadge x={1150} y={130} size={40} opacity={b5} scale={checkPop} />
        <div
          style={{
            position: "absolute",
            left: WIN5.x + 24,
            top: WIN5.y + WIN5.h - 70,
            padding: "12px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.96)",
            border: `1.5px solid ${P.successEdge}`,
            boxShadow: "0 14px 34px rgba(22,17,64,0.16)",
            opacity: b5 * resultStripIn,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          8 jobs → 1 loop, every 30s
        </div>
        <CaptionBand text="Live on vitalii.no now." opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
