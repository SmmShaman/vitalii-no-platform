/**
 * FeatureGroqJobAnalysis — feature j50 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: analyze_worker.py ran on Gemini 2.5 Flash with a 13s inter_job_sleep
 * to dodge rate limits, so 100 jobs took 20+ minutes → refactored to Groq's
 * OpenAI-compatible endpoint via httpx, llama-3.3-70b-versatile as primary
 * with llama-3.1-8b-instant fallback, json_object responses → Groq's
 * generous limits let inter_job_sleep drop to 2s → 13s → 2s per job
 * (6.5x), 100 jobs now finish in just over 3 minutes.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const GEMINI_OLD = { x: 80, y: 44, w: 280, h: 88 };
const SLOW = { x: 850, y: 44, w: 320, h: 88 };

const WORKER = { x: 60, y: 250, w: 280, h: 96 };
const GROQ = { x: 470, y: 250, w: 260, h: 96 };
const MODEL = { x: 890, y: 250, w: 300, h: 96 };

const GEM_R: Pt = { x: GEMINI_OLD.x + GEMINI_OLD.w, y: GEMINI_OLD.y + GEMINI_OLD.h / 2 };
const SLOW_L: Pt = { x: SLOW.x, y: SLOW.y + SLOW.h / 2 };
const WORKER_R: Pt = { x: WORKER.x + WORKER.w, y: WORKER.y + WORKER.h / 2 };
const GROQ_L: Pt = { x: GROQ.x, y: GROQ.y + GROQ.h / 2 };
const GROQ_R: Pt = { x: GROQ.x + GROQ.w, y: GROQ.y + GROQ.h / 2 };
const MODEL_L: Pt = { x: MODEL.x, y: MODEL.y + MODEL.h / 2 };

const P_GS: Pt[] = [GEM_R, SLOW_L];
const P_WG: Pt[] = [WORKER_R, GROQ_L];
const P_GM: Pt[] = [GROQ_R, MODEL_L];

export const FeatureGroqJobAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): Gemini + 13s sleep -> 20+ min for 100 jobs ──
  const gemOp = Math.min(1, pop(10)) * lf;
  const gemLit = 0.3 * lf;
  const slowOp = appear(30, 18) * lf;
  const slowLit = interpolate(frame, [40, 62, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGs = seg(frame, 36, 58);
  const tGsVis = frame >= 36 && frame < 96 ? 1 : 0;
  const crossScale = pop(50) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): worker -> Groq -> llama-3.3-70b-versatile ──
  const workerOp = appear(126, 18) * lf;
  const workerLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tWg = seg(frame, 148, 172);
  const tWgVis = frame >= 148 && frame < 206 ? 1 : 0;
  const groqOp = appear(150, 18) * lf;
  const groqLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGm = seg(frame, 182, 206);
  const tGmVis = frame >= 182 && frame < 236 ? 1 : 0;
  const modelOp = appear(184, 18) * lf;
  const modelLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const httpxPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const httpxPillOp = httpxPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): fallback model + inter_job_sleep 13s -> 2s ──
  const fallbackScale = pop(250) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const sleepPillIn = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const sleepPillOp = sleepPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_GS} color={T.danger} width={2.5} progress={tGs} opacity={0.8 * tGsVis * lf} />
      <Connector pts={P_WG} color={T.accent} width={2.5} progress={tWg} opacity={0.8 * tWgVis * lf} />
      <Connector pts={P_GM} color={T.accent} width={2.5} progress={tGm} opacity={0.8 * tGmVis * lf} />

      <SchemaNode {...GEMINI_OLD} state="danger" lit={gemLit} opacity={gemOp} label="Gemini 2.5 Flash" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>13s inter_job_sleep</div>
      </SchemaNode>
      <SchemaNode {...SLOW} state="danger" lit={slowLit} opacity={slowOp} label="100 jobs = 20+ minutes" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>bottleneck for users</div>
      </SchemaNode>
      <Token pts={P_GS} t={tGs} color={T.danger} opacity={tGsVis * lf} />
      <Badge x={SLOW.x + SLOW.w / 2 - 18} y={SLOW.y + SLOW.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...WORKER} state="accent" lit={workerLit} opacity={workerOp} label="analyze_worker.py" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>GitHub Actions workflow</div>
      </SchemaNode>
      <SchemaNode {...GROQ} state="accent" lit={groqLit} opacity={groqOp} label="Groq API" fontSize={20}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>OpenAI-compatible endpoint</div>
      </SchemaNode>
      <SchemaNode {...MODEL} state="success" lit={modelLit} opacity={modelOp} label="llama-3.3-70b-versatile" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>primary model</div>
      </SchemaNode>
      <Token pts={P_WG} t={tWg} opacity={tWgVis * lf} />
      <Token pts={P_GM} t={tGm} opacity={tGmVis * lf} />
      <Pill x={GROQ.x - 10} y={GROQ.y - 46} dx={0} text="httpx requests, json_object format" color={T.amber} opacity={httpxPillOp} fontSize={15} />

      <div style={{ position: "absolute", left: MODEL.x - 20, top: MODEL.y + MODEL.h + 40, opacity: fallbackScale, transform: `scale(${fallbackScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.success }}>llama-3.1-8b-instant — fallback</div>
      </div>
      <Badge x={MODEL.x - 34} y={MODEL.y + MODEL.h + 34} kind="check" scale={fallbackScale} opacity={fallbackScale} size={24} />
      <Pill x={WORKER.x + 10} y={WORKER.y + WORKER.h + 14} text="inter_job_sleep: 13s → 2s" color={T.success} opacity={sleepPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A 13s cooldown between jobs meant 100 jobs took 20+ minutes" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="analyze_worker.py now hits Groq's fast, OpenAI-compatible endpoint" color={T.text} opacity={cap2} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Generous rate limits let the cooldown shrink from 13s to 2s" color={T.success} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>13s → 2s per job (6.5x) · 100 jobs in ~3 minutes</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Faster insights, lower cost, same accuracy</div>
      </div>
    </AbsoluteFill>
  );
};
