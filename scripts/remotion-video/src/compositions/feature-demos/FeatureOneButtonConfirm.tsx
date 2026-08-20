/**
 * FeatureOneButtonConfirm — feature j57 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every job card needed two taps — trigger the draft, then a separate
 * manual approve — before the agent queue picked it up. telegram-bot/index.ts
 * consolidates every card's handlers into one "✅ Підтвердити" (confirm_job_)
 * action; generate_application/index.ts now sets submission_method='agent' +
 * status='pending_manual' at row creation, so it enters the queue immediately.
 * The old draft/approve/queue_agent_ path stays as a dormant fallback, and the
 * queue is processed one application at a time, oldest first ("Заявка N з M").
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const DRAFT = { x: 90, y: 66, w: 280, h: 110 };
const APPROVE = { x: 500, y: 66, w: 280, h: 110 };
const DRAFT_R: Pt = { x: DRAFT.x + DRAFT.w, y: DRAFT.y + DRAFT.h / 2 };
const APPROVE_L: Pt = { x: APPROVE.x, y: APPROVE.y + APPROVE.h / 2 };

const BOT = { x: 465, y: 250, w: 350, h: 120 };
const BOT_TOP: Pt = { x: BOT.x + BOT.w / 2, y: BOT.y };
const BOT_R: Pt = { x: BOT.x + BOT.w, y: BOT.y + BOT.h / 2 };

const QUEUE = { x: 870, y: 266, w: 260, h: 96 };
const QUEUE_L: Pt = { x: QUEUE.x, y: QUEUE.y + QUEUE.h / 2 };

const FALLBACK = { x: 465, y: 430, w: 350, h: 96 };
const FALLBACK_TOP: Pt = { x: FALLBACK.x + FALLBACK.w / 2, y: FALLBACK.y };
const BOT_BOTTOM: Pt = { x: BOT.x + BOT.w / 2, y: BOT.y + BOT.h };

const APPROVE_TO_BOT: Pt[] = [APPROVE_L, { x: APPROVE_L.x - 40, y: APPROVE_L.y }, BOT_TOP];
const BOT_TO_QUEUE: Pt[] = [BOT_R, QUEUE_L];
const BOT_TO_FALLBACK: Pt[] = [BOT_BOTTOM, FALLBACK_TOP];

export const FeatureOneButtonConfirm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: old two-step flow
  const draftOp = appear(6) * lf;
  const approveOp = appear(20) * lf;
  const approveLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: single confirm button consolidates everything
  const botOp = appear(140, 18) * lf;
  const queueOp = appear(158, 18) * lf;
  const botLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const queueLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: dormant fallback path + one-at-a-time queue rule
  const fallbackOp = appear(244, 18) * lf;
  const fallbackLit = interpolate(frame, [252, 274, 330, 350], [0, 0.4, 0.4, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
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

      <Connector pts={APPROVE_TO_BOT} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={BOT_TO_QUEUE} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={BOT_TO_FALLBACK} color={T.amber} width={2} dashed opacity={0.6 * t3Vis * lf} />

      <SchemaNode {...DRAFT} state="danger" lit={0.2 * lf} opacity={draftOp} label="Draft trigger" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>job list · detail · batch · scan card</div>
      </SchemaNode>
      <SchemaNode {...APPROVE} state="danger" lit={approveLit} opacity={approveOp} label="Manual approve" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>second separate tap</div>
      </SchemaNode>
      <Pill x={APPROVE.x + 10} y={APPROVE.y - 46} dx={pill1Dx} text="2 actions, every card" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...BOT} state="accent" lit={botLit} opacity={botOp} label='✅ "Підтвердити"' fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>telegram-bot/index.ts · confirm_job_</div>
      </SchemaNode>
      <SchemaNode {...QUEUE} state="accent" lit={queueLit} opacity={queueOp} label="applications" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>pending_manual · submission_method=agent</div>
      </SchemaNode>
      <Token pts={APPROVE_TO_BOT} t={t2} opacity={t2Vis * lf} />
      <Token pts={BOT_TO_QUEUE} t={t2b} opacity={t2bVis * lf} />
      <Pill x={BOT.x + 20} y={BOT.y + BOT.h + 14} dx={pill2Dx} text="one tap enters the queue" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...FALLBACK} state="amber" lit={fallbackLit} opacity={fallbackOp} label="draft/approve/queue_agent_" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>dormant manual-recovery fallback</div>
      </SchemaNode>
      <Token pts={BOT_TO_FALLBACK} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={FALLBACK.x + 6} y={FALLBACK.y + FALLBACK.h + 12} dx={pill3Dx} text='one at a time · "Заявка N з M"' color={T.amber} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="Every job card needed a draft tap, then a separate approve tap" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="One confirm button now writes the row straight into the queue" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Old approval path stays dormant; queue runs oldest first" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Playwright confirmation screenshot still runs, unchanged</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>one tap instead of two</div>
      </div>
    </AbsoluteFill>
  );
};
