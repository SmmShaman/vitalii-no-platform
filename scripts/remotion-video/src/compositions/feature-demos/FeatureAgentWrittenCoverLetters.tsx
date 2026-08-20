/**
 * FeatureAgentWrittenCoverLetters — feature j53 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every søknad ran through a paid LLM — Claude primary, Gemini and
 * Groq behind it — nearly 300 lines just to pick a model and log its cost,
 * and any provider outage could fail the whole application mid-flow →
 * generate_application/index.ts was stripped down to insert an
 * applications row with status='pending_manual', cost_usd=0 and return
 * immediately → a polling task hands it to the Jobbot agent itself, which
 * writes the letter and flips status to draft → $0 API cost per søknad,
 * zero dependency on any LLM provider staying up.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const OLD = { x: 300, y: 44, w: 420, h: 88 };

const EDGE = { x: 50, y: 250, w: 300, h: 96 };
const ROW = { x: 480, y: 250, w: 290, h: 96 };
const AGENT = { x: 900, y: 250, w: 280, h: 96 };

const EDGE_R: Pt = { x: EDGE.x + EDGE.w, y: EDGE.y + EDGE.h / 2 };
const ROW_L: Pt = { x: ROW.x, y: ROW.y + ROW.h / 2 };
const ROW_R: Pt = { x: ROW.x + ROW.w, y: ROW.y + ROW.h / 2 };
const AGENT_L: Pt = { x: AGENT.x, y: AGENT.y + AGENT.h / 2 };

const P_ER: Pt[] = [EDGE_R, ROW_L];
const P_RA: Pt[] = [ROW_R, AGENT_L];

export const FeatureAgentWrittenCoverLetters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): every søknad paid an LLM, ~300 lines, outage risk ──
  const oldOp = Math.min(1, pop(10)) * lf;
  const oldLit = interpolate(frame, [10, 34, 96, 116], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const linesPillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const linesPillOp = linesPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): stripped function -> pending_manual row -> agent ──
  const edgeOp = appear(126, 18) * lf;
  const edgeLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tEr = seg(frame, 148, 172);
  const tErVis = frame >= 148 && frame < 206 ? 1 : 0;
  const rowOp = appear(150, 18) * lf;
  const rowLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tRa = seg(frame, 182, 206);
  const tRaVis = frame >= 182 && frame < 236 ? 1 : 0;
  const agentOp = appear(184, 18) * lf;
  const agentLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const noKeysPillIn = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const noKeysPillOp = noKeysPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): polling task hands to agent, flips to draft ──
  const draftScale = pop(250) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const queuedPillIn = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const queuedPillOp = queuedPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_ER} color={T.accent} width={2.5} progress={tEr} opacity={0.8 * tErVis * lf} />
      <Connector pts={P_RA} color={T.accent} width={2.5} progress={tRa} opacity={0.8 * tRaVis * lf} />

      <SchemaNode {...OLD} state="danger" lit={oldLit} opacity={oldOp} label="Claude → Gemini → Groq, every call" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>$$ per søknad, outage = failure</div>
      </SchemaNode>
      <Badge x={OLD.x + OLD.w / 2 - 18} y={OLD.y + OLD.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={OLD.x + OLD.w + 20} y={OLD.y + 24} text="~300 lines just to pick a model" color={T.danger} opacity={linesPillOp} fontSize={15} />

      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="generate_application/index.ts" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>no LLM client, no API keys</div>
      </SchemaNode>
      <SchemaNode {...ROW} state="success" lit={rowLit} opacity={rowOp} label="applications row" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>pending_manual, cost_usd=0</div>
      </SchemaNode>
      <SchemaNode {...AGENT} state="success" lit={agentLit} opacity={agentOp} label="Jobbot agent" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>writes the letter itself</div>
      </SchemaNode>
      <Token pts={P_ER} t={tEr} opacity={tErVis * lf} />
      <Token pts={P_RA} t={tRa} opacity={tRaVis * lf} />
      <Pill x={EDGE.x + 20} y={EDGE.y - 46} dx={0} text="returns immediately, pending: true" color={T.amber} opacity={noKeysPillOp} fontSize={15} />

      <div style={{ position: "absolute", left: AGENT.x - 30, top: AGENT.y + AGENT.h + 40, opacity: draftScale, transform: `scale(${draftScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.success }}>fills cover_letter_no/uk → status: draft</div>
      </div>
      <Badge x={AGENT.x - 34} y={AGENT.y + AGENT.h + 34} kind="check" scale={draftScale} opacity={draftScale} size={24} />
      <Pill x={ROW.x - 20} y={ROW.y + ROW.h + 14} text="a polling task picks up pending_manual rows" color={T.success} opacity={queuedPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Every cover letter paid a real dollar cost, and a fallback chain to manage" color={T.danger} opacity={cap1} fontSize={20} weight={600} />
      <Caption x={90} y={648} w={1100} text="The function now just queues the application and returns instantly" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The Jobbot agent writes the søknad itself — no API call at all" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>$0 API cost per søknad · zero LLM provider dependency</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 640,
          width: 1280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: finalCap,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.success,
            color: "#12321c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 21,
            fontWeight: 700,
            transform: `scale(${finalCheck})`,
            boxShadow: `0 0 16px ${hexA(T.success, 0.5)}`,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>No provider can take this feature down</div>
      </div>
    </AbsoluteFill>
  );
};
