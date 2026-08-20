/**
 * FeatureSocialAutoPublisher — feature p53 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 30-60 minutes a week evaporated into manual social sharing —
 * crafting copy, double-checking links, missing prime engagement windows.
 * A daily GitHub Actions workflow (social-publisher.yml) fires at 08:00 UTC,
 * queries the features table for approved + unpublished_social rows, and
 * calls the publishToSocial.ts Edge Function, which posts to the LinkedIn
 * and Facebook Graph APIs. On success, published_social flips to true,
 * guaranteeing no re-posts.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const CRON = { x: 90, y: 250, w: 260, h: 108 };
const CRON_R: Pt = { x: CRON.x + CRON.w, y: CRON.y + CRON.h / 2 };

const QUERY = { x: 430, y: 250, w: 280, h: 108 };
const QUERY_L: Pt = { x: QUERY.x, y: QUERY.y + QUERY.h / 2 };
const QUERY_R: Pt = { x: QUERY.x + QUERY.w, y: QUERY.y + QUERY.h / 2 };

const PUBLISH = { x: 780, y: 250, w: 300, h: 108 };
const PUBLISH_L: Pt = { x: PUBLISH.x, y: PUBLISH.y + PUBLISH.h / 2 };
const PUBLISH_B: Pt = { x: PUBLISH.x + PUBLISH.w / 2, y: PUBLISH.y + PUBLISH.h };

const FLAG = { x: 630, y: 420, w: 340, h: 90 };
const FLAG_T: Pt = { x: FLAG.x + FLAG.w / 2, y: FLAG.y };

export const FeatureSocialAutoPublisher: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: manual sharing eats 30-60 min/week
  const cronOp = appear(6) * lf;
  const cronLit = interpolate(frame, [6, 30, 96, 116], [0, 0.4, 0.4, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: 08:00 UTC cron queries approved + unpublished_social
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const queryOp = appear(140, 18) * lf;
  const queryLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: publishToSocial.ts dispatches, published_social flag set
  const tB = seg(frame, 226, 250);
  const tBVis = frame >= 226 && frame < 296 ? 1 : 0;
  const tC = seg(frame, 258, 282);
  const tCVis = frame >= 258 && frame < 320 ? 1 : 0;
  const publishOp = appear(232, 18) * lf;
  const publishLit = interpolate(frame, [240, 262, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const flagOp = appear(264, 18) * lf;
  const flagLit = interpolate(frame, [272, 294, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[CRON_R, QUERY_L]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[QUERY_R, PUBLISH_L]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[PUBLISH_B, FLAG_T]} color={T.success} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />

      <SchemaNode {...CRON} state="danger" lit={cronLit} opacity={cronOp} label="Manual sharing" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>30-60 min/week, context-switching</div>
      </SchemaNode>
      <Pill x={CRON.x} y={CRON.y - 46} dx={pill1Dx} text="misses prime engagement windows" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...QUERY} state="accent" lit={queryLit} opacity={queryOp} label="social-publisher.yml" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>08:00 UTC → approved + unpublished_social</div>
      </SchemaNode>
      <Token pts={[CRON_R, QUERY_L]} t={tA} opacity={tAVis * lf} />
      <Pill x={QUERY.x - 20} y={QUERY.y - 46} dx={pill2Dx} text="features table, queried daily" color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...PUBLISH} state="accent" lit={publishLit} opacity={publishOp} label="publishToSocial.ts" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>LinkedIn + Facebook Graph APIs</div>
      </SchemaNode>
      <Token pts={[QUERY_R, PUBLISH_L]} t={tB} opacity={tBVis * lf} />

      <SchemaNode {...FLAG} state="success" lit={flagLit} opacity={flagOp} label="published_social = true" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>guarantees zero re-posts</div>
      </SchemaNode>
      <Token pts={[PUBLISH_B, FLAG_T]} t={tC} color={T.success} opacity={tCVis * lf} />
      <Pill x={FLAG.x + 10} y={FLAG.y + FLAG.h + 14} dx={pill3Dx} text="live within minutes of approval" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="30-60 minutes a week just crafting and scheduling social posts" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A daily cron finds approved, unpublished features automatically" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A flag on the row makes the whole flow safely idempotent" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>50+ posts in 2 months, 100% on-time delivery</div>
      </div>
    </AbsoluteFill>
  );
};
