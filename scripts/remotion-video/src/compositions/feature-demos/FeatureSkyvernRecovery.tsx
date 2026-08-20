/**
 * FeatureSkyvernRecovery — feature j09 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a Skyvern login_failed error blocks a job application → worker's
 * error handler catches it, LLM evaluation identifies the recruiting
 * platform domain → Telegram Bot API sends inline keyboard "Update
 * password" / "Register from scratch" → retry chain with exponential
 * backoff [5s, 10s] up to 3 attempts → "resolved in under 30 seconds".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SKYVERN = { x: 90, y: 90, w: 280, h: 96 };
const WORKER = { x: 500, y: 90, w: 280, h: 96 };
const LLM = { x: 910, y: 90, w: 280, h: 96 };
const TG = { x: 500, y: 320, w: 280, h: 100 };
const RETRY = [
  { x: 210, y: 500, w: 190, h: 76, label: "attempt 1" },
  { x: 545, y: 500, w: 190, h: 76, label: "attempt 2 · +5s" },
  { x: 880, y: 500, w: 190, h: 76, label: "attempt 3 · +10s" },
];

const SKY_R: Pt = { x: SKYVERN.x + SKYVERN.w, y: SKYVERN.y + SKYVERN.h / 2 };
const WORKER_L: Pt = { x: WORKER.x, y: WORKER.y + WORKER.h / 2 };
const WORKER_R: Pt = { x: WORKER.x + WORKER.w, y: WORKER.y + WORKER.h / 2 };
const LLM_L: Pt = { x: LLM.x, y: LLM.y + LLM.h / 2 };
const WORKER_B: Pt = { x: WORKER.x + WORKER.w / 2, y: WORKER.y + WORKER.h };
const TG_T: Pt = { x: TG.x + TG.w / 2, y: TG.y };
const TG_B: Pt = { x: TG.x + TG.w / 2, y: TG.y + TG.h };
const RETRY_T: Pt[] = RETRY.map((r) => ({ x: r.x + r.w / 2, y: r.y }));

const P_ERR: Pt[] = [SKY_R, WORKER_L];
const P_LLM: Pt[] = [WORKER_R, LLM_L];
const P_TG: Pt[] = [WORKER_B, TG_T];
const P_RETRY: Pt[][] = RETRY_T.map((r) => [TG_B, r]);

export const FeatureSkyvernRecovery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–108): login_failed blocks the application ──
  const skyOp = Math.min(1, pop(4)) * lf;
  const skyLit = interpolate(frame, [4, 26, 88, 108], [0, 0.6, 0.6, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(30) * interpolate(frame, [86, 106], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const errPillIn = seg(frame, 28, 50, Easing.out(Easing.cubic));
  const errPillOp = errPillIn * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 30, 52, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (114–228): worker catches it, LLM identifies domain, Telegram fires ──
  const workerOp = appear(116, 18) * lf;
  const workerLit = interpolate(frame, [124, 146, 320, 340], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tErr = seg(frame, 118, 138);
  const tErrVis = frame >= 118 && frame < 140 ? 1 : 0;
  const llmOp = appear(144, 18) * lf;
  const llmLit = interpolate(frame, [152, 174, 320, 340], [0, 0.65, 0.65, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tLlm = seg(frame, 148, 168);
  const tLlmVis = frame >= 148 && frame < 170 ? 1 : 0;
  const domainPillIn = seg(frame, 172, 194, Easing.out(Easing.cubic));
  const domainPillOp = domainPillIn * interpolate(frame, [224, 244], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 150, 172, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [224, 244], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  const tgOp = appear(198, 18) * lf;
  const tgLit = interpolate(frame, [206, 228, 320, 340], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tTg = seg(frame, 200, 222);
  const tTgVis = frame >= 200 && frame < 224 ? 1 : 0;

  // ── Beat 3 (232–330): retry chain, exponential backoff ──
  const tRetry = [0, 1, 2].map((i) => seg(frame, 244 + i * 26, 262 + i * 26));
  const tRetryVis = [0, 1, 2].map((i) => (frame >= 244 + i * 26 && frame < 284 + i * 26 ? 1 : 0));
  const retryOp = RETRY.map((_, i) => appear(238 + i * 26, 16) * lf);
  const retryLit = [0, 1, 2].map((i) => {
    const s = 244 + i * 26;
    return interpolate(frame, [s, s + 18, 340, 358], [0, i === 2 ? 0.85 : 0.5, i === 2 ? 0.85 : 0.5, 0.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const backoffPillIn = seg(frame, 306, 328, Easing.out(Easing.cubic));
  const backoffPillOp = backoffPillIn * interpolate(frame, [352, 372], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 300, 322, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [352, 372], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const checkScale3 = pop(358) * lf;

  // ── Beat 4 (360–450): result ──
  const finalCapIn = seg(frame, 376, 398, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(382) * lf;
  const metricOp = seg(frame, 362, 384, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_ERR} color={T.danger} width={2.5} progress={tErr} opacity={0.8 * tErrVis * lf} />
      <Connector pts={P_LLM} color={T.accent} width={2.5} progress={tLlm} opacity={0.8 * tLlmVis * lf} />
      <Connector pts={P_TG} color={T.accent} width={2.5} progress={tTg} opacity={0.8 * tTgVis * lf} />
      {P_RETRY.map((pts, i) => (
        <Connector
          key={i}
          pts={pts}
          color={i === 2 ? T.success : T.amber}
          width={2.5}
          progress={tRetry[i]}
          opacity={0.8 * tRetryVis[i] * lf}
        />
      ))}

      <SchemaNode {...SKYVERN} state="danger" lit={skyLit} opacity={skyOp} label="Skyvern" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>login_failed</div>
      </SchemaNode>
      <Badge x={SKYVERN.x + SKYVERN.w - 20} y={SKYVERN.y - 18} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={SKYVERN.x - 10} y={SKYVERN.y + SKYVERN.h + 14} text="blocks the application — deadline risk" color={T.danger} opacity={errPillOp} fontSize={16} />

      <SchemaNode {...WORKER} state="accent" lit={workerLit} opacity={workerOp} label="auto_apply.py worker" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>error handling</div>
      </SchemaNode>
      <Token pts={P_ERR} t={tErr} color={T.danger} opacity={tErrVis * lf} />

      <SchemaNode {...LLM} state="accent" lit={llmLit} opacity={llmOp} label="LLM eval" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>identifies domain</div>
      </SchemaNode>
      <Token pts={P_LLM} t={tLlm} opacity={tLlmVis * lf} />
      <Pill x={LLM.x - 10} y={LLM.y + LLM.h + 14} text="webcruiter.no" color={T.accent} opacity={domainPillOp} fontSize={16} />

      <SchemaNode {...TG} state="accent" lit={tgLit} opacity={tgOp} label="Telegram Bot API" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Update password · Register from scratch</div>
      </SchemaNode>
      <Token pts={P_TG} t={tTg} opacity={tTgVis * lf} />

      {RETRY.map((r, i) => (
        <SchemaNode
          key={i}
          {...r}
          state={i === 2 ? "success" : "amber"}
          lit={retryLit[i]}
          opacity={retryOp[i]}
          label={r.label}
          fontSize={17}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <Token key={i} pts={P_RETRY[i]} t={tRetry[i]} color={i === 2 ? T.success : T.amber} opacity={tRetryVis[i] * lf} />
      ))}
      <Badge x={RETRY[2].x + RETRY[2].w / 2 - 17} y={RETRY[2].y - 40} kind="check" scale={checkScale3} opacity={checkScale3} />
      <Pill x={RETRY[0].x - 10} y={RETRY[0].y + RETRY[0].h + 12} text="exponential backoff [5s, 10s] · up to 3 attempts" color={T.amber} opacity={backoffPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A typo or password change silently blocks submissions — found 30-60 min later" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Worker catches login_failed, LLM identifies the platform instantly" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Retry chain with exponential backoff — resilient by design" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>From a 30-60 minute blind spot to a proactive fix</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Resolved in under 30 seconds</div>
      </div>
    </AbsoluteFill>
  );
};
