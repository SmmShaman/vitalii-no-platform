/**
 * FeatureAiCommitMiner — feature p55 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 10-20 commits/day across multiple projects meant 2-3 wasted hours
 * weekly sifting git logs, missing updates and forgetting to post about
 * them. feature-discovery.yml runs `git log --pretty=format` daily, piping
 * commit data to a Supabase Edge Function (discover-features/index.ts) that
 * calls Claude 3.5 Sonnet for {title, description, tags} JSON. Results
 * upsert into features_to_approve; the admin panel reviews and moves
 * approved rows into published_features.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const CRON = { x: 90, y: 70, w: 300, h: 96 };
const CRON_R: Pt = { x: CRON.x + CRON.w, y: CRON.y + CRON.h / 2 };

const EDGE = { x: 490, y: 70, w: 320, h: 108 };
const EDGE_L: Pt = { x: EDGE.x, y: EDGE.y + EDGE.h / 2 };
const EDGE_B: Pt = { x: EDGE.x + EDGE.w / 2, y: EDGE.y + EDGE.h };

const APPROVE = { x: 130, y: 320, w: 300, h: 110 };
const APPROVE_T: Pt = { x: APPROVE.x + APPROVE.w / 2, y: APPROVE.y };
const APPROVE_R: Pt = { x: APPROVE.x + APPROVE.w, y: APPROVE.y + APPROVE.h / 2 };

const PUBLISHED = { x: 850, y: 320, w: 300, h: 110 };
const PUBLISHED_L: Pt = { x: PUBLISHED.x, y: PUBLISHED.y + PUBLISHED.h / 2 };

export const FeatureAiCommitMiner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 2-3h weekly wasted, updates missed
  const cronOp = appear(6) * lf;
  const cronLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: feature-discovery.yml -> discover-features/index.ts -> Claude 3.5 Sonnet
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const edgeOp = appear(140, 18) * lf;
  const edgeLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: features_to_approve -> admin review -> published_features
  const tB = seg(frame, 226, 250);
  const tBVis = frame >= 226 && frame < 300 ? 1 : 0;
  const tC = seg(frame, 260, 284);
  const tCVis = frame >= 260 && frame < 320 ? 1 : 0;
  const approveOp = appear(232, 18) * lf;
  const approveLit = interpolate(frame, [240, 262, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const publishedOp = appear(266, 18) * lf;
  const publishedLit = interpolate(frame, [274, 296, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 268, 290, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[CRON_R, EDGE_L]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[EDGE_B, APPROVE_T]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[APPROVE_R, PUBLISHED_L]} color={T.success} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />

      <SchemaNode {...CRON} state="danger" lit={cronLit} opacity={cronOp} label="10-20 commits / day" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>2-3h/week wasted, updates missed</div>
      </SchemaNode>
      <Pill x={CRON.x + 10} y={CRON.y - 46} dx={pill1Dx} text="steals dev time, feels like a chore" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="discover-features/index.ts" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>git log --pretty=format → Claude 3.5 Sonnet</div>
      </SchemaNode>
      <Token pts={[CRON_R, EDGE_L]} t={tA} opacity={tAVis * lf} />
      <Pill x={EDGE.x} y={EDGE.y + EDGE.h + 14} dx={pill2Dx} text='JSON: {"title","description","tags"}' color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...APPROVE} state="amber" lit={approveLit} opacity={approveOp} label="features_to_approve" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>admin panel: review, edit</div>
      </SchemaNode>
      <Token pts={[EDGE_B, APPROVE_T]} t={tB} opacity={tBVis * lf} />

      <SchemaNode {...PUBLISHED} state="success" lit={publishedLit} opacity={publishedOp} label="published_features" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>approved, now live</div>
      </SchemaNode>
      <Token pts={[APPROVE_R, PUBLISHED_L]} t={tC} color={T.success} opacity={tCVis * lf} />
      <Pill x={APPROVE.x + 260} y={APPROVE.y + APPROVE.h + 14} dx={pill3Dx} text="one click to move a row across" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="2-3 wasted hours weekly, and updates still slipped through" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="A daily cron feeds yesterday's commits straight to Claude 3.5 Sonnet" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="I approve or reject — nothing publishes without a manual click" color={T.amber} opacity={cap3} fontSize={23} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Under 15 min/week, 80-90% AI accuracy</div>
      </div>
    </AbsoluteFill>
  );
};
