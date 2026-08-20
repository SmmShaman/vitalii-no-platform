/**
 * FeatureMultiRepoSync — feature p63 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: tracking feature.json across 8 GitHub repos meant 8 fragmented
 * CI/CD pipelines, each with its own scanner, logs, cron — unreliable,
 * delayed discovery → feature-scanner.yml (cron '0 0 * * *') runs
 * scripts/scanFeatures.ts, which git-clones each of the 8 repo URLs,
 * searches root or features/ for feature.json, and aggregates
 * featureName/description/techStack into all_features.json → on changes,
 * the workflow commits and pushes it to the central portfolio repo →
 * 8x less CI/CD overhead, 30 min/week saved, one source of truth.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA, lerpColor } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FRAGMENTED = { x: 300, y: 46, w: 680, h: 118 };
const FRAGMENTED_B: Pt = { x: FRAGMENTED.x + FRAGMENTED.w / 2, y: FRAGMENTED.y + FRAGMENTED.h };

const WORKFLOW = { x: 150, y: 240, w: 350, h: 96 };
const WORKFLOW_R: Pt = { x: WORKFLOW.x + WORKFLOW.w, y: WORKFLOW.y + WORKFLOW.h / 2 };

const SCANNER = { x: 620, y: 240, w: 350, h: 96 };
const SCANNER_L: Pt = { x: SCANNER.x, y: SCANNER.y + SCANNER.h / 2 };
const SCANNER_B: Pt = { x: SCANNER.x + SCANNER.w / 2, y: SCANNER.y + SCANNER.h };

const AGGREGATE = { x: 360, y: 400, w: 400, h: 96 };
const AGGREGATE_T: Pt = { x: AGGREGATE.x + AGGREGATE.w / 2, y: AGGREGATE.y };
const AGGREGATE_TR: Pt = { x: AGGREGATE.x + AGGREGATE.w - 40, y: AGGREGATE.y };

const WORKFLOW_TO_SCANNER: Pt[] = [WORKFLOW_R, SCANNER_L];
const SCANNER_TO_AGG: Pt[] = [SCANNER_B, AGGREGATE_TR];

export const FeatureMultiRepoSync: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 8 fragmented pipelines
  const fragOp = pop(6) * lf;
  const fragLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: one cron workflow clones all 8, parses feature.json
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const workflowOp = appear(148, 18) * lf;
  const workflowLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const scannerOp = appear(184, 18) * lf;
  const scannerLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: aggregate + commit/push if changed
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const aggOp = appear(268, 18) * lf;
  const aggLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

  const repoCells = new Array(8).fill(0).map((_, i) => {
    const cellPop = pop(10 + i * 4);
    return (
      <div
        key={i}
        style={{
          width: 46,
          height: 46,
          borderRadius: 10,
          border: `1px solid ${hexA(T.danger, 0.7)}`,
          background: T.nodeFillDeep,
          boxShadow: `0 0 10px ${hexA(T.danger, 0.18)}`,
          transform: `scale(${cellPop})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          color: lerpColor(T.text, T.danger, 0.4),
        }}
      >
        {i + 1}
      </div>
    );
  });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={WORKFLOW_TO_SCANNER} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={SCANNER_TO_AGG} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...FRAGMENTED} state="danger" lit={fragLit} opacity={fragOp} label="8 fragmented CI/CD pipelines" fontSize={19}>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>{repoCells}</div>
      </SchemaNode>
      <Pill x={FRAGMENTED.x + 130} y={FRAGMENTED.y + FRAGMENTED.h + 18} text="own scanner, own cron, own logs — each" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...WORKFLOW} state="accent" lit={workflowLit} opacity={workflowOp} label="feature-scanner.yml" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>cron: '0 0 * * *'</div>
      </SchemaNode>
      <SchemaNode {...SCANNER} state="accent" lit={scannerLit} opacity={scannerOp} label="scanFeatures.ts" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>git clone --depth 1 × 8</div>
      </SchemaNode>
      <Token pts={WORKFLOW_TO_SCANNER} t={t2} opacity={t2Vis * lf} />
      <Pill x={SCANNER.x + 10} y={SCANNER.y - 46} text="parses root/ or features/feature.json" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...AGGREGATE} state="success" lit={aggLit} opacity={aggOp} label="all_features.json" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>featureName, description, techStack</div>
      </SchemaNode>
      <Token pts={SCANNER_TO_AGG} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={AGGREGATE.x + 10} y={AGGREGATE.y + AGGREGATE.h + 14} text="changed? commit + push to portfolio repo" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="8 repos, 8 scanners, 8 crons — feature discovery delayed and unreliable" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="One daily workflow clones all 8 and parses each repo's feature.json" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Only pushes all_features.json when something actually changed" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>8x less CI/CD overhead · 30 min/week saved</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>one authoritative source, zero missed updates</div>
      </div>
    </AbsoluteFill>
  );
};
