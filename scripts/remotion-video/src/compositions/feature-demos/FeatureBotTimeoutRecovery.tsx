/**
 * FeatureBotTimeoutRecovery — feature j45 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: slow external job-board APIs or user inactivity froze whole
 * automation chains, flooding support with "bot stuck" reports →
 * timeoutHandler in botStateService.ts fires after
 * TELEGRAM_RESPONSE_TIMEOUT_MS (60s), sending an inline Retry/Cancel keyboard
 * → callbackQueryHandlers.ts re-enqueues or clears the pending action →
 * a staleMessageDetector in messageQueueProcessor.ts also marks anything
 * unanswered past QUEUE_SKIP_TIMEOUT_MS (5 min) as SKIPPED → 85-90% fewer
 * frozen-bot reports, 15-20% of stalled items cleared weekly.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FROZEN = { x: 400, y: 44, w: 320, h: 88 };

const TIMEOUT = { x: 60, y: 250, w: 300, h: 96 };
const KEYBOARD = { x: 480, y: 250, w: 280, h: 96 };
const HANDLERS = { x: 880, y: 250, w: 320, h: 96 };

const FROZEN_BOTTOM: Pt = { x: FROZEN.x + FROZEN.w / 2, y: FROZEN.y + FROZEN.h };
const TIMEOUT_TOP: Pt = { x: TIMEOUT.x + TIMEOUT.w / 2, y: TIMEOUT.y };
const TIMEOUT_R: Pt = { x: TIMEOUT.x + TIMEOUT.w, y: TIMEOUT.y + TIMEOUT.h / 2 };
const KEY_L: Pt = { x: KEYBOARD.x, y: KEYBOARD.y + KEYBOARD.h / 2 };
const KEY_R: Pt = { x: KEYBOARD.x + KEYBOARD.w, y: KEYBOARD.y + KEYBOARD.h / 2 };
const HAND_L: Pt = { x: HANDLERS.x, y: HANDLERS.y + HANDLERS.h / 2 };

const P_FT: Pt[] = [FROZEN_BOTTOM, { x: FROZEN_BOTTOM.x, y: 190 }, TIMEOUT_TOP];
const P_TK: Pt[] = [TIMEOUT_R, KEY_L];
const P_KH: Pt[] = [KEY_R, HAND_L];

export const FeatureBotTimeoutRecovery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): slow API / inactivity freezes the chain ──
  const frozenOp = Math.min(1, pop(10)) * lf;
  const frozenLit = interpolate(frame, [10, 34, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const ticketPillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const ticketPillOp = ticketPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): timeoutHandler -> inline Retry/Cancel -> handlers ──
  const tFt = seg(frame, 118, 142);
  const tFtVis = frame >= 118 && frame < 172 ? 1 : 0;
  const timeoutOp = appear(126, 18) * lf;
  const timeoutLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tTk = seg(frame, 148, 172);
  const tTkVis = frame >= 148 && frame < 206 ? 1 : 0;
  const keyOp = appear(150, 18) * lf;
  const keyLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tKh = seg(frame, 182, 206);
  const tKhVis = frame >= 182 && frame < 236 ? 1 : 0;
  const handOp = appear(184, 18) * lf;
  const handLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const sixtyPillIn = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const sixtyPillOp = sixtyPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): staleMessageDetector — 5 min, marks SKIPPED ──
  const retryScale = pop(250) * lf;
  const cancelScale = pop(264) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const staleePillIn = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const stalePillOp = staleePillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_FT} color={T.accent} width={2.5} progress={tFt} opacity={0.8 * tFtVis * lf} />
      <Connector pts={P_TK} color={T.accent} width={2.5} progress={tTk} opacity={0.8 * tTkVis * lf} />
      <Connector pts={P_KH} color={T.accent} width={2.5} progress={tKh} opacity={0.8 * tKhVis * lf} />

      <SchemaNode {...FROZEN} state="danger" lit={frozenLit} opacity={frozenOp} label="Bot freezes mid-chain" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>slow API or user inactivity</div>
      </SchemaNode>
      <Badge x={FROZEN.x + FROZEN.w / 2 - 18} y={FROZEN.y + FROZEN.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={FROZEN.x + FROZEN.w + 30} y={FROZEN.y + 20} text="flood of support tickets" color={T.danger} opacity={ticketPillOp} fontSize={16} />

      <SchemaNode {...TIMEOUT} state="accent" lit={timeoutLit} opacity={timeoutOp} label="timeoutHandler()" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>botStateService.ts</div>
      </SchemaNode>
      <SchemaNode {...KEYBOARD} state="amber" lit={keyLit} opacity={keyOp} label="Retry / Cancel" fontSize={20}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>inline keyboard</div>
      </SchemaNode>
      <SchemaNode {...HANDLERS} state="success" lit={handLit} opacity={handOp} label="callbackQueryHandlers.ts" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>re-enqueue or clear</div>
      </SchemaNode>
      <Token pts={P_FT} t={tFt} opacity={tFtVis * lf} />
      <Token pts={P_TK} t={tTk} opacity={tTkVis * lf} />
      <Token pts={P_KH} t={tKh} opacity={tKhVis * lf} />
      <Pill x={TIMEOUT.x + 10} y={TIMEOUT.y - 46} dx={0} text="TELEGRAM_RESPONSE_TIMEOUT_MS = 60s" color={T.amber} opacity={sixtyPillOp} fontSize={15} />

      <div style={{ position: "absolute", left: HANDLERS.x - 20, top: HANDLERS.y + HANDLERS.h + 40, opacity: retryScale, transform: `scale(${retryScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.success }}>handleRetryAction — re-enqueued</div>
      </div>
      <div style={{ position: "absolute", left: HANDLERS.x - 20, top: HANDLERS.y + HANDLERS.h + 68, opacity: cancelScale, transform: `scale(${cancelScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.amber }}>staleMessageDetector — 5 min → SKIPPED</div>
      </div>
      <Badge x={HANDLERS.x - 34} y={HANDLERS.y + HANDLERS.h + 34} kind="check" scale={retryScale} opacity={retryScale} size={24} />
      <Pill x={KEYBOARD.x - 30} y={KEYBOARD.y - 46} dx={0} text="messageQueueProcessor.ts — queue never blocks" color={T.amber} opacity={stalePillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Slow external APIs froze whole automation chains" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="A 60s timeout hands the user an instant Retry / Cancel choice" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Anything still unanswered after 5 min is skipped — queue keeps moving" color={T.amber} opacity={cap3} fontSize={20} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>85-90% fewer "frozen bot" reports · 5 min max pending</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Users control frozen ops, not the other way around</div>
      </div>
    </AbsoluteFill>
  );
};
