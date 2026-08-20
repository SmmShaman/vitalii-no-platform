/**
 * FeatureAiFeatureMiner — feature p49 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 10-20 commits/day across multiple projects meant manually sifting
 * `git log` for portfolio-worthy features — a 2-3h weekly chore that still
 * missed subtle updates. A weekly feature-discovery.yml GitHub Actions cron
 * triggers discover-features.ts, which queries the GitHub API for recent
 * commits, batches messages, and feeds them to Claude 3.5 Sonnet in JSON
 * mode. Extracted {title, description, commit_hash, repo_name} rows upsert
 * into portfolio_features with pending_review status.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const COMMITS = { x: 90, y: 130, w: 280, h: 108 };
const COMMITS_R: Pt = { x: COMMITS.x + COMMITS.w, y: COMMITS.y + COMMITS.h / 2 };

const WORKFLOW = { x: 500, y: 60, w: 300, h: 100 };
const WORKFLOW_L: Pt = { x: WORKFLOW.x, y: WORKFLOW.y + WORKFLOW.h / 2 };
const WORKFLOW_B: Pt = { x: WORKFLOW.x + WORKFLOW.w / 2, y: WORKFLOW.y + WORKFLOW.h };

const CLAUDE = { x: 500, y: 240, w: 300, h: 100 };
const CLAUDE_T: Pt = { x: CLAUDE.x + CLAUDE.w / 2, y: CLAUDE.y };
const CLAUDE_B: Pt = { x: CLAUDE.x + CLAUDE.w / 2, y: CLAUDE.y + CLAUDE.h };

const TABLE = { x: 460, y: 420, w: 380, h: 100 };
const TABLE_T: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y };

export const FeatureAiFeatureMiner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 10-20 commits/day, manual sifting is a 2-3h chore
  const commitsOp = appear(6) * lf;
  const commitsLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: feature-discovery.yml -> discover-features.ts -> Claude 3.5 Sonnet
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const tB = seg(frame, 168, 192);
  const tBVis = frame >= 168 && frame < 226 ? 1 : 0;
  const workflowOp = appear(140, 18) * lf;
  const workflowLit = interpolate(frame, [148, 172, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const claudeOp = appear(178, 18) * lf;
  const claudeLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 196, 218, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: JSON extraction lands in portfolio_features, pending_review
  const tC = seg(frame, 250, 274);
  const tCVis = frame >= 250 && frame < 320 ? 1 : 0;
  const tableOp = appear(260, 18) * lf;
  const tableLit = interpolate(frame, [268, 292, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 282, 304, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 276, 298, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[COMMITS_R, WORKFLOW_L]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[WORKFLOW_B, CLAUDE_T]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[CLAUDE_B, TABLE_T]} color={T.success} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />

      <SchemaNode {...COMMITS} state="danger" lit={commitsLit} opacity={commitsOp} label="10-20 commits / day" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>multiple repos, manual git log</div>
      </SchemaNode>
      <Pill x={COMMITS.x + 10} y={COMMITS.y - 46} dx={pill1Dx} text="2-3h weekly chore, still misses updates" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...WORKFLOW} state="accent" lit={workflowLit} opacity={workflowOp} label="feature-discovery.yml" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>weekly GitHub Actions cron</div>
      </SchemaNode>
      <Token pts={[COMMITS_R, WORKFLOW_L]} t={tA} opacity={tAVis * lf} />

      <SchemaNode {...CLAUDE} state="accent" lit={claudeLit} opacity={claudeOp} label="discover-features.ts" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>GitHub API → Claude 3.5 Sonnet</div>
      </SchemaNode>
      <Token pts={[WORKFLOW_B, CLAUDE_T]} t={tB} opacity={tBVis * lf} />
      <Pill x={CLAUDE.x - 10} y={CLAUDE.y + CLAUDE.h + 14} dx={pill2Dx} text="JSON mode: title, description, commit_hash" color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...TABLE} state="success" lit={tableLit} opacity={tableOp} label="portfolio_features" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>status = pending_review</div>
      </SchemaNode>
      <Token pts={[CLAUDE_B, TABLE_T]} t={tC} color={T.success} opacity={tCVis * lf} />
      <Pill x={TABLE.x + 30} y={TABLE.y + TABLE.h + 14} dx={pill3Dx} text="reviewed before it ever ships" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Manually sifting git log for portfolio-worthy work every week" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="A weekly cron batches commits and hands them to Claude in JSON mode" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Structured features land as pending_review, never auto-published" color={T.success} opacity={cap3} fontSize={23} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Quarterly updates → weekly, review down to 15-20 min</div>
      </div>
    </AbsoluteFill>
  );
};
