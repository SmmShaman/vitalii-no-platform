/**
 * FeatureTimeZoneTamer — feature p58 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a single UTC publish time hit NYC and Oslo unevenly — 10 AM UTC
 * meant 6 AM for NYC (too early) and 12 PM for Oslo (too late). An hourly
 * GitHub Action runs a TypeScript script against Supabase's scheduled_posts
 * table, filtered by locale and scheduled_at_utc; it computes each locale's
 * target 10 AM local time (America/New_York, Europe/Oslo), converts to UTC,
 * and checks a +/-15 minute window before invoking publish_feature_post.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const UTC = { x: 490, y: 50, w: 300, h: 84 };
const UTC_L: Pt = { x: UTC.x, y: UTC.y + UTC.h / 2 };
const UTC_R: Pt = { x: UTC.x + UTC.w, y: UTC.y + UTC.h / 2 };

const NYC = { x: 110, y: 50, w: 250, h: 84 };
const NYC_R: Pt = { x: NYC.x + NYC.w, y: NYC.y + NYC.h / 2 };

const OSLO = { x: 920, y: 50, w: 250, h: 84 };
const OSLO_L: Pt = { x: OSLO.x, y: OSLO.y + OSLO.h / 2 };

const ACTION = { x: 490, y: 220, w: 300, h: 100 };
const ACTION_T: Pt = { x: ACTION.x + ACTION.w / 2, y: ACTION.y };
const ACTION_B: Pt = { x: ACTION.x + ACTION.w / 2, y: ACTION.y + ACTION.h };

const WINDOW = { x: 460, y: 390, w: 360, h: 100 };
const WINDOW_T: Pt = { x: WINDOW.x + WINDOW.w / 2, y: WINDOW.y };

export const FeatureTimeZoneTamer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: single UTC time, both audiences miss the window
  const utcOp = appear(6) * lf;
  const utcLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const nycOp = appear(20) * lf;
  const osloOp = appear(20) * lf;
  const nycLit = interpolate(frame, [20, 44, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const osloLit = interpolate(frame, [20, 44, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: hourly GitHub Action -> per-locale target time
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const tB = seg(frame, 130, 154);
  const tBVis = frame >= 130 && frame < 190 ? 1 : 0;
  const actionOp = appear(140, 18) * lf;
  const actionLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: +/-15 min window check -> publish_feature_post
  const tC = seg(frame, 226, 250);
  const tCVis = frame >= 226 && frame < 300 ? 1 : 0;
  const windowOp = appear(232, 18) * lf;
  const windowLit = interpolate(frame, [240, 262, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 258, 280, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 250, 272, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[NYC_R, UTC_L]} color={T.danger} width={2} dashed opacity={0.5 * nycOp} />
      <Connector pts={[UTC_R, OSLO_L]} color={T.danger} width={2} dashed opacity={0.5 * osloOp} />
      <Connector pts={[{ x: UTC.x + UTC.w / 2, y: UTC.y + UTC.h }, ACTION_T]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[ACTION_B, WINDOW_T]} color={T.accent} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />

      <SchemaNode {...NYC} state="danger" lit={nycLit} opacity={nycOp} label="NYC — 6 AM" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>too early</div>
      </SchemaNode>
      <SchemaNode {...UTC} state="idle" lit={utcLit} opacity={utcOp} label="One post, 10 AM UTC" fontSize={20} />
      <SchemaNode {...OSLO} state="danger" lit={osloLit} opacity={osloOp} label="Oslo — 12 PM" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>too late</div>
      </SchemaNode>
      <Pill x={UTC.x + 10} y={UTC.y - 46} dx={pill1Dx} text="one audience always misses the window" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...ACTION} state="accent" lit={actionLit} opacity={actionOp} label="Hourly GitHub Action" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>scheduled_posts: locale, scheduled_at_utc</div>
      </SchemaNode>
      <Token pts={[{ x: UTC.x + UTC.w / 2, y: UTC.y + UTC.h }, ACTION_T]} t={tB} opacity={tBVis * lf} />
      <Pill x={ACTION.x - 10} y={ACTION.y + ACTION.h + 14} dx={pill2Dx} text="target 10 AM local, per timezone" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...WINDOW} state="success" lit={windowLit} opacity={windowOp} label="±15 min window → publish_feature_post" fontSize={16} />
      <Token pts={[ACTION_B, WINDOW_T]} t={tC} color={T.success} opacity={tCVis * lf} />
      <Pill x={WINDOW.x + 20} y={WINDOW.y + WINDOW.h + 14} dx={pill3Dx} text="status set to published" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A single UTC time means someone always gets it at the wrong hour" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every hour, a script computes each locale's true 10 AM in UTC" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A tight time window keeps publishing precise, not just close enough" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>20-30% higher click-through in the first hour</div>
      </div>
    </AbsoluteFill>
  );
};
