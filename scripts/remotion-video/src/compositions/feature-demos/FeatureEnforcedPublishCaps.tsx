/**
 * FeatureEnforcedPublishCaps — feature v11 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: articles that passed moderation still needed a manual Telegram
 * approval tap, and even though PUBLISH_SCHEDULE_MAX_PER_DAY (30) and a
 * LinkedIn daily limit existed as settings, nothing in the code actually
 * enforced them — an approval burst could blow past both → computeScheduledTime
 * now slots each approved article into a spaced publish queue with no manual
 * tap required, schedule-publisher reads and enforces the 30/day cap,
 * LINKEDIN_DAILY_LIMIT (default 1) reserves LinkedIn for the single daily
 * top pick, and the queue drains one article at a time so an approval burst
 * doesn't fire simultaneous LLM requests.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TAP = { x: 150, y: 56, w: 380, h: 90 };
const TAP_R: Pt = { x: TAP.x + TAP.w, y: TAP.y + TAP.h / 2 };

const UNREAD = { x: 650, y: 56, w: 380, h: 90 };
const UNREAD_L: Pt = { x: UNREAD.x, y: UNREAD.y + UNREAD.h / 2 };

const COMPUTE = { x: 150, y: 240, w: 380, h: 96 };
const COMPUTE_R: Pt = { x: COMPUTE.x + COMPUTE.w, y: COMPUTE.y + COMPUTE.h / 2 };
const COMPUTE_B: Pt = { x: COMPUTE.x + COMPUTE.w / 2, y: COMPUTE.y + COMPUTE.h };

const DRAIN = { x: 650, y: 240, w: 380, h: 96 };
const DRAIN_L: Pt = { x: DRAIN.x, y: DRAIN.y + DRAIN.h / 2 };
const DRAIN_B: Pt = { x: DRAIN.x + DRAIN.w / 2, y: DRAIN.y + DRAIN.h };

const CAPS = { x: 340, y: 410, w: 500, h: 92 };
const CAPS_T: Pt = { x: CAPS.x + CAPS.w / 2, y: CAPS.y };

const TAP_TO_UNREAD: Pt[] = [TAP_R, UNREAD_L];
const COMPUTE_TO_DRAIN: Pt[] = [COMPUTE_R, DRAIN_L];
const DRAIN_TO_CAPS: Pt[] = [DRAIN_B, { x: DRAIN_B.x, y: 370 }, CAPS_T];

export const FeatureEnforcedPublishCaps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: manual tap required, caps existed but unenforced
  const tapOp = pop(6) * lf;
  const tapLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1 = seg(frame, 24, 48);
  const t1Vis = frame >= 24 && frame < 70 ? 1 : 0;
  const unreadOp = appear(30, 18) * lf;
  const unreadLit = interpolate(frame, [36, 58, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: computeScheduledTime slots the queue, drains one at a time
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const computeOp = appear(148, 18) * lf;
  const computeLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const drainOp = appear(184, 18) * lf;
  const drainLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: hard caps finally enforced
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const capsOp = appear(268, 18) * lf;
  const capsLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={TAP_TO_UNREAD} color={T.danger} width={2.5} progress={t1} opacity={0.8 * t1Vis * lf} />
      <Connector pts={COMPUTE_TO_DRAIN} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={DRAIN_TO_CAPS} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...TAP} state="danger" lit={tapLit} opacity={tapOp} label="Manual Telegram tap" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>required even after passing</div>
      </SchemaNode>
      <SchemaNode {...UNREAD} state="danger" lit={unreadLit} opacity={unreadOp} label="30/day, 1/day LinkedIn" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>settings existed, unread by code</div>
      </SchemaNode>
      <Token pts={TAP_TO_UNREAD} t={t1} color={T.danger} opacity={t1Vis * lf} />
      <Badge x={UNREAD.x + UNREAD.w - 20} y={UNREAD.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />

      <SchemaNode {...COMPUTE} state="accent" lit={computeLit} opacity={computeOp} label="computeScheduledTime()" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>slots into a spaced queue</div>
      </SchemaNode>
      <SchemaNode {...DRAIN} state="accent" lit={drainLit} opacity={drainOp} label="Drains one at a time" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>no simultaneous LLM bursts</div>
      </SchemaNode>
      <Token pts={COMPUTE_TO_DRAIN} t={t2} opacity={t2Vis * lf} />
      <Pill x={COMPUTE.x + 10} y={COMPUTE.y - 46} text="no manual tap needed anymore" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...CAPS} state="success" lit={capsLit} opacity={capsOp} label="30/day cap · LinkedIn 1/day" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>both actually enforced in code now</div>
      </SchemaNode>
      <Token pts={DRAIN_TO_CAPS} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={CAPS.x + 20} y={CAPS.y + CAPS.h + 14} text="LinkedIn reserved for the daily top pick" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A manual tap was still required, and existing caps went unenforced" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Approved articles now slot themselves into a spaced publish queue" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The 30/day and LinkedIn 1/day settings are finally read and enforced" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Unread settings become real limits</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>no tap, no burst — publishing runs itself</div>
      </div>
    </AbsoluteFill>
  );
};
