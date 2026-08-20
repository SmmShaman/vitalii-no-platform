/**
 * FeatureAtsResolverFree — feature j61 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: matching a scraped listing to the employer's real ATS form used to
 * be done by the LLM agent — reading, searching, opening pages — ~1.2M
 * subscription tokens per application, 16.1M tokens on just 13 jobs on
 * 2026-07-29 with zero applications sent. worker/ats_resolver.py replaces
 * that with plain word-overlap comparison against known ATS domains, tried
 * across three free search channels in order: Google Programmable Search
 * (capped at 80/day), SearxNG, then DuckDuckGo's HTML endpoint. It only ever
 * writes jobs.external_apply_url and leaves unresolved rows untouched.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const AGENT = { x: 90, y: 66, w: 280, h: 110 };
const TOKENS = { x: 500, y: 66, w: 280, h: 110 };
const AGENT_R: Pt = { x: AGENT.x + AGENT.w, y: AGENT.y + AGENT.h / 2 };
const TOKENS_L: Pt = { x: TOKENS.x, y: TOKENS.y + TOKENS.h / 2 };

const RESOLVER = { x: 465, y: 250, w: 350, h: 120 };
const RESOLVER_TOP: Pt = { x: RESOLVER.x + RESOLVER.w / 2, y: RESOLVER.y };
const RESOLVER_R: Pt = { x: RESOLVER.x + RESOLVER.w, y: RESOLVER.y + RESOLVER.h / 2 };

const CHANNELS = { x: 870, y: 258, w: 260, h: 112 };
const CHANNELS_L: Pt = { x: CHANNELS.x, y: CHANNELS.y + CHANNELS.h / 2 };

const WRITE = { x: 465, y: 430, w: 350, h: 96 };
const WRITE_TOP: Pt = { x: WRITE.x + WRITE.w / 2, y: WRITE.y };
const RESOLVER_BOTTOM: Pt = { x: RESOLVER.x + RESOLVER.w / 2, y: RESOLVER.y + RESOLVER.h };

const TOKENS_TO_RESOLVER: Pt[] = [TOKENS_L, { x: TOKENS_L.x - 40, y: TOKENS_L.y }, RESOLVER_TOP];
const RESOLVER_TO_CHANNELS: Pt[] = [RESOLVER_R, CHANNELS_L];
const RESOLVER_TO_WRITE: Pt[] = [RESOLVER_BOTTOM, WRITE_TOP];

export const FeatureAtsResolverFree: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: LLM agent did the matching, burning subscription tokens
  const agentOp = appear(6) * lf;
  const tokensOp = appear(20) * lf;
  const tokensLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: ats_resolver.py plain word-overlap match, three free channels
  const resolverOp = appear(140, 18) * lf;
  const channelsOp = appear(158, 18) * lf;
  const resolverLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const channelsLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: only writes external_apply_url, leaves unresolved rows untouched
  const writeOp = appear(244, 18) * lf;
  const writeLit = interpolate(frame, [252, 274, 330, 350], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const writeCheck = pop(284) * lf;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={TOKENS_TO_RESOLVER} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={RESOLVER_TO_CHANNELS} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={RESOLVER_TO_WRITE} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...AGENT} state="danger" lit={0.2 * lf} opacity={agentOp} label="LLM agent search" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>reads, searches, opens pages</div>
      </SchemaNode>
      <SchemaNode {...TOKENS} state="danger" lit={tokensLit} opacity={tokensOp} label="16.1M tokens · 13 jobs" fontSize={20}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>2026-07-29 · zero sent</div>
      </SchemaNode>
      <Pill x={TOKENS.x + 6} y={TOKENS.y - 46} dx={pill1Dx} text="~1.2M tokens per application" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...RESOLVER} state="accent" lit={resolverLit} opacity={resolverOp} label="ats_resolver.py" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>word-overlap match · known ATS domains</div>
      </SchemaNode>
      <SchemaNode {...CHANNELS} state="accent" lit={channelsLit} opacity={channelsOp} label="3 free channels" fontSize={19}>
        <div style={{ fontSize: 12.5, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>Google CSE → SearxNG → DuckDuckGo</div>
      </SchemaNode>
      <Token pts={TOKENS_TO_RESOLVER} t={t2} opacity={t2Vis * lf} />
      <Token pts={RESOLVER_TO_CHANNELS} t={t2b} opacity={t2bVis * lf} />
      <Pill x={RESOLVER.x + 6} y={RESOLVER.y + RESOLVER.h + 14} dx={pill2Dx} text="blocks LinkedIn, Finn.no, Indeed noise" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...WRITE} state="success" lit={writeLit} opacity={writeOp} label="jobs.external_apply_url" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>never resubmits · untouched if unresolved</div>
      </SchemaNode>
      <Token pts={RESOLVER_TO_WRITE} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Badge x={WRITE.x + WRITE.w - 20} y={WRITE.y - 12} kind="check" scale={writeCheck} opacity={writeCheck} />
      <Pill x={WRITE.x + 30} y={WRITE.y + WRITE.h + 12} dx={pill3Dx} text="a plain script, not an agent turn" color={T.success} opacity={pill3Op} fontSize={19} />

      <Caption x={90} y={648} w={1100} text="The agent itself read, searched, and matched every listing" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Word-overlap comparison across three free search channels" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Only writes the apply URL — never marks a job wrongly resolved" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>runs separately from the agent's own queue</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>zero subscription tokens to resolve a form</div>
      </div>
    </AbsoluteFill>
  );
};
