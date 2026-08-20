/**
 * FeatureJobLinkAnalysis — feature j19 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: job links pile up from friends/recruiters/FINN/LinkedIn, each one a
 * 5-10 min manual review → message_handler.ts runs a high-priority regex for
 * job board URLs, extract_job_text scrapes the page into the jobs table →
 * job-analyzer calls Azure OpenAI for score/aura/pros/cons → rich Telegram
 * message with action buttons, all inside 15 seconds → "78% Match · Growth
 * aura" in under 15s.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const LINKS = { x: 465, y: 60, w: 350, h: 96 };
const LINKS_BOTTOM: Pt = { x: LINKS.x + LINKS.w / 2, y: LINKS.y + LINKS.h };

const HANDLER = { x: 465, y: 220, w: 350, h: 96 };
const HANDLER_TOP: Pt = { x: HANDLER.x + HANDLER.w / 2, y: HANDLER.y };
const HANDLER_BOTTOM: Pt = { x: HANDLER.x + HANDLER.w / 2, y: HANDLER.y + HANDLER.h };

const JOBS = { x: 870, y: 240, w: 260, h: 90 };
const JOBS_L: Pt = { x: JOBS.x, y: JOBS.y + JOBS.h / 2 };
const HANDLER_R: Pt = { x: HANDLER.x + HANDLER.w, y: HANDLER.y + HANDLER.h / 2 };

const AI = { x: 465, y: 400, w: 350, h: 96 };
const AI_TOP: Pt = { x: AI.x + AI.w / 2, y: AI.y };

const LINKS_TO_HANDLER: Pt[] = [LINKS_BOTTOM, HANDLER_TOP];
const HANDLER_TO_JOBS: Pt[] = [HANDLER_R, JOBS_L];
const HANDLER_TO_AI: Pt[] = [HANDLER_BOTTOM, AI_TOP];

export const FeatureJobLinkAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): links pile up, manual review friction ──
  const linksOp = appear(6) * lf;
  const linksLit = interpolate(frame, [6, 30, 108, 128], [0, 0.55, 0.55, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): regex handler → extract_job_text → jobs table ──
  const handlerOp = appear(140, 18) * lf;
  const jobsOp = appear(158, 18) * lf;
  const handlerLit = interpolate(frame, [140, 165, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const jobsLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): job-analyzer + Azure OpenAI → score/aura/pros/cons ──
  const aiOp = appear(244, 18) * lf;
  const aiLit = interpolate(frame, [252, 274, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={LINKS_TO_HANDLER} color={T.danger} width={2} opacity={0.4 * Math.min(linksOp, handlerOp)} />
      <Connector pts={HANDLER_TO_JOBS} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={HANDLER_TO_AI} color={T.accent} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...LINKS} state="danger" lit={linksLit} opacity={linksOp} label="finn.no · nav.no · linkedin.com" fontSize={20}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>links from friends, recruiters, search</div>
      </SchemaNode>
      <Pill x={LINKS.x + 40} y={LINKS.y - 46} dx={pill1Dx} text="5–10 min manual review each" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...HANDLER} state="accent" lit={handlerLit} opacity={handlerOp} label="message_handler.ts" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>high-priority regex → extract_job_text</div>
      </SchemaNode>
      <Token pts={LINKS_TO_HANDLER} t={t2} opacity={t2Vis * lf} />
      <SchemaNode {...JOBS} state="accent" lit={jobsLit} opacity={jobsOp} label="jobs table" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>full text persisted</div>
      </SchemaNode>
      <Token pts={HANDLER_TO_JOBS} t={t2b} opacity={t2bVis * lf} />
      <Pill x={HANDLER.x - 10} y={HANDLER.y - 46} dx={pill2Dx} text="URL detected → scrape triggered" color={T.accent} opacity={pill2Op} fontSize={19} />

      <SchemaNode {...AI} state="amber" lit={aiLit} opacity={aiOp} label="job-analyzer · Azure OpenAI" fontSize={20}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>score · aura · pros · cons</div>
      </SchemaNode>
      <Token pts={HANDLER_TO_AI} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={AI.x + AI.w + 14} y={AI.y + 22} dx={pill3Dx} text="structured JSON in ~15s" color={T.amber} opacity={pill3Op} fontSize={19} />

      <Caption x={90} y={648} w={1100} text="Every promising link cost 5-10 minutes to judge by hand" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Job-board URLs are caught and scraped automatically" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Azure OpenAI turns raw text into a structured verdict" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>💚 78% Match · Growth aura</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Full AI analysis, under 15 seconds</div>
      </div>
    </AbsoluteFill>
  );
};
