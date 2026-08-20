/**
 * FeatureGitCommitMiner — feature p52 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 10-20 commits/day across multiple repos meant 30-60 min/project
 * weekly lost to manual git log sifting, and features still got forgotten.
 * feature-discovery.yml triggers daily at 3 AM Oslo, runs `git log
 * --since="24 hours ago"`, and streams commit messages + diffs to
 * gpt-3.5-turbo, which classifies each as {type: "feature", description}.
 * Results persist in discovered_features; a Next.js admin panel at
 * /admin/feature-review lets me approve or reject before anything ships.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const CRON = { x: 490, y: 56, w: 300, h: 92 };
const CRON_L: Pt = { x: CRON.x, y: CRON.y + CRON.h / 2 };
const CRON_R: Pt = { x: CRON.x + CRON.w, y: CRON.y + CRON.h / 2 };
const CRON_B: Pt = { x: CRON.x + CRON.w / 2, y: CRON.y + CRON.h };

const GITLOG = { x: 100, y: 56, w: 260, h: 92 };
const GITLOG_R: Pt = { x: GITLOG.x + GITLOG.w, y: GITLOG.y + GITLOG.h / 2 };

const GPT = { x: 920, y: 56, w: 260, h: 92 };
const GPT_L: Pt = { x: GPT.x, y: GPT.y + GPT.h / 2 };

const TABLE = { x: 460, y: 230, w: 360, h: 100 };
const TABLE_T: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y };
const TABLE_B: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.h };

const ADMIN = { x: 440, y: 400, w: 400, h: 100 };
const ADMIN_T: Pt = { x: ADMIN.x + ADMIN.w / 2, y: ADMIN.y };

export const FeatureGitCommitMiner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 30-60 min/project weekly, features still forgotten
  const gitlogOp = appear(6) * lf;
  const gitlogLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: feature-discovery.yml 3AM Oslo -> git log --since 24h -> gpt-3.5-turbo
  const tA = seg(frame, 132, 156);
  const tAVis = frame >= 132 && frame < 194 ? 1 : 0;
  const tB = seg(frame, 132, 156);
  const tBVis = frame >= 132 && frame < 194 ? 1 : 0;
  const cronOp = appear(140, 18) * lf;
  const cronLit = interpolate(frame, [148, 172, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const gptOp = appear(140, 18) * lf;
  const gptLit = interpolate(frame, [148, 172, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: discovered_features table -> /admin/feature-review
  const tC = seg(frame, 198, 222);
  const tCVis = frame >= 198 && frame < 264 ? 1 : 0;
  const tD = seg(frame, 236, 260);
  const tDVis = frame >= 236 && frame < 300 ? 1 : 0;
  const tableOp = appear(204, 18) * lf;
  const tableLit = interpolate(frame, [212, 234, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const adminOp = appear(242, 18) * lf;
  const adminLit = interpolate(frame, [250, 272, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 256, 278, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[GITLOG_R, CRON_L]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[CRON_R, GPT_L]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[CRON_B, TABLE_T]} color={T.accent} width={2} dashed opacity={0.6 * tCVis * lf} />
      <Connector pts={[TABLE_B, ADMIN_T]} color={T.success} width={2.5} progress={tD} opacity={0.8 * tDVis * lf} />

      <SchemaNode {...GITLOG} state="danger" lit={gitlogLit} opacity={gitlogOp} label="git log, 5+ repos" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>30-60 min/project weekly</div>
      </SchemaNode>
      <Pill x={GITLOG.x} y={GITLOG.y + GITLOG.h + 12} dx={pill1Dx} text="cool features forgotten, never shown" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...CRON} state="accent" lit={cronLit} opacity={cronOp} label="feature-discovery.yml" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>daily 3 AM Oslo</div>
      </SchemaNode>
      <Token pts={[GITLOG_R, CRON_L]} t={tA} opacity={tAVis * lf} />

      <SchemaNode {...GPT} state="accent" lit={gptLit} opacity={gptOp} label="gpt-3.5-turbo" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>classifies feature vs fix</div>
      </SchemaNode>
      <Token pts={[CRON_R, GPT_L]} t={tB} opacity={tBVis * lf} />
      <Pill x={CRON.x - 10} y={CRON.y + CRON.h + 46} dx={pill2Dx} text='{"type":"feature","description":"..."}' color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...TABLE} state="amber" lit={tableLit} opacity={tableOp} label="discovered_features" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>structured findings persisted</div>
      </SchemaNode>

      <SchemaNode {...ADMIN} state="success" lit={adminLit} opacity={adminOp} label="/admin/feature-review" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>review, refine, approve</div>
      </SchemaNode>
      <Token pts={[TABLE_B, ADMIN_T]} t={tD} color={T.success} opacity={tDVis * lf} />
      <Pill x={ADMIN.x + 30} y={ADMIN.y + ADMIN.h + 14} dx={pill3Dx} text="pushed live only on my approval" color={T.success} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="30-60 minutes per project, every week, just to spot new features" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A nightly cron reads yesterday's commits and lets an LLM classify them" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every AI suggestion still passes through a manual review UI" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>5-10 min for all projects, ~80% AI-drafted</div>
      </div>
    </AbsoluteFill>
  );
};
