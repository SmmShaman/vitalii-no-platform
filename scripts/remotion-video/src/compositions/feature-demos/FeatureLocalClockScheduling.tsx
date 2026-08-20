/**
 * FeatureLocalClockScheduling — feature p60 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a single UTC publish time missed peak windows for both NYC (too
 * early) and Oslo (too late) audiences. feature_posts gained publish_at_utc,
 * target_timezone, and language columns. A daily GitHub Actions cron
 * triggers schedule_feature_posts.ts, a Supabase Edge Function that
 * computes each row's local time per target_timezone and flips status to
 * published only when it's 10 AM there — precise, decoupled, no manual ops.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SINGLE = { x: 460, y: 50, w: 360, h: 88 };
const SINGLE_B: Pt = { x: SINGLE.x + SINGLE.w / 2, y: SINGLE.y + SINGLE.h };

const TABLE = { x: 460, y: 200, w: 360, h: 108 };
const TABLE_T: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y };
const TABLE_L: Pt = { x: TABLE.x, y: TABLE.y + TABLE.h / 2 };
const TABLE_R: Pt = { x: TABLE.x + TABLE.w, y: TABLE.y + TABLE.h / 2 };

const NYC = { x: 110, y: 400, w: 300, h: 100 };
const NYC_T: Pt = { x: NYC.x + NYC.w / 2, y: NYC.y };

const OSLO = { x: 870, y: 400, w: 300, h: 100 };
const OSLO_T: Pt = { x: OSLO.x + OSLO.w / 2, y: OSLO.y };

export const FeatureLocalClockScheduling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: single UTC time, both audiences miss peak windows
  const singleOp = appear(6) * lf;
  const singleLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: feature_posts columns -> schedule_feature_posts.ts
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const tableOp = appear(140, 18) * lf;
  const tableLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: per-timezone local time check -> status=published
  const tB = seg(frame, 226, 250);
  const tBVis = frame >= 226 && frame < 300 ? 1 : 0;
  const tC = seg(frame, 226, 250);
  const tCVis = frame >= 226 && frame < 300 ? 1 : 0;
  const nycOp = appear(232, 18) * lf;
  const osloOp = appear(232, 18) * lf;
  const nycLit = interpolate(frame, [240, 262, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const osloLit = interpolate(frame, [240, 262, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 268, 290, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[SINGLE_B, TABLE_T]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[TABLE_L, NYC_T]} color={T.success} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[TABLE_R, OSLO_T]} color={T.success} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />

      <SchemaNode {...SINGLE} state="danger" lit={singleLit} opacity={singleOp} label="One UTC time for everyone" fontSize={21}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>NYC 6 AM (early) · Oslo 12 PM (late)</div>
      </SchemaNode>
      <Pill x={SINGLE.x + 30} y={SINGLE.y - 44} dx={pill1Dx} text="broadcasting into an empty room" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...TABLE} state="accent" lit={tableLit} opacity={tableOp} label="feature_posts" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>publish_at_utc · target_timezone · language</div>
      </SchemaNode>
      <Token pts={[SINGLE_B, TABLE_T]} t={tA} opacity={tAVis * lf} />
      <Pill x={TABLE.x - 10} y={TABLE.y + TABLE.h + 14} dx={pill2Dx} text="schedule_feature_posts.ts, daily cron" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...NYC} state="success" lit={nycLit} opacity={nycOp} label="America/New_York" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>10 AM local → published</div>
      </SchemaNode>
      <SchemaNode {...OSLO} state="success" lit={osloLit} opacity={osloOp} label="Europe/Oslo" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>10 AM local → published</div>
      </SchemaNode>
      <Token pts={[TABLE_L, NYC_T]} t={tB} color={T.success} opacity={tBVis * lf} />
      <Token pts={[TABLE_R, OSLO_T]} t={tC} color={T.success} opacity={tCVis * lf} />
      <Pill x={430} y={NYC.y + NYC.h + 14} dx={pill3Dx} text="each region hits peak browsing time" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="One UTC time broadcasts into an empty room for half the audience" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Three new columns let every post carry its own local target" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A daily check publishes each post at exactly 10 AM, locally" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>+15% NO views, +20% NYC uplift, first hour</div>
      </div>
    </AbsoluteFill>
  );
};
