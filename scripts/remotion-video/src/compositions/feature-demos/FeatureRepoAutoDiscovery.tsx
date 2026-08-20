/**
 * FeatureRepoAutoDiscovery — feature p66 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: adding each new GitHub repository to feature scanning was a manual,
 * error-prone step — new projects or features got missed, leaving the
 * portfolio incomplete → a GitHub Actions + Supabase Edge Function workflow
 * periodically scans for new or updated repositories, diffs them against
 * the known project list, and auto-inserts matches into the project
 * database, configured for feature extraction → the portfolio stays
 * complete and current with zero manual repo management.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const MANUAL = { x: 90, y: 56, w: 320, h: 90 };
const MANUAL_R: Pt = { x: MANUAL.x + MANUAL.w, y: MANUAL.y + MANUAL.h / 2 };

const STALE = { x: 500, y: 56, w: 320, h: 90 };
const STALE_L: Pt = { x: STALE.x, y: STALE.y + STALE.h / 2 };

const SCAN = { x: 150, y: 240, w: 380, h: 96 };
const SCAN_R: Pt = { x: SCAN.x + SCAN.w, y: SCAN.y + SCAN.h / 2 };

const COMPARE = { x: 640, y: 240, w: 380, h: 96 };
const COMPARE_L: Pt = { x: COMPARE.x, y: COMPARE.y + COMPARE.h / 2 };
const COMPARE_B: Pt = { x: COMPARE.x + COMPARE.w / 2, y: COMPARE.y + COMPARE.h };

const INSERT = { x: 380, y: 400, w: 440, h: 92 };
const INSERT_T: Pt = { x: INSERT.x + INSERT.w / 2, y: INSERT.y };

const MANUAL_TO_STALE: Pt[] = [MANUAL_R, STALE_L];
const SCAN_TO_COMPARE: Pt[] = [SCAN_R, COMPARE_L];
const COMPARE_TO_INSERT: Pt[] = [COMPARE_B, { x: COMPARE_B.x, y: 360 }, INSERT_T];

export const FeatureRepoAutoDiscovery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: manual repo adding leaves the portfolio stale
  const manualOp = pop(6) * lf;
  const manualLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1 = seg(frame, 24, 48);
  const t1Vis = frame >= 24 && frame < 70 ? 1 : 0;
  const staleOp = appear(30, 18) * lf;
  const staleLit = interpolate(frame, [36, 58, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: periodic scan diffs repos against known projects
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const scanOp = appear(148, 18) * lf;
  const scanLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const compareOp = appear(184, 18) * lf;
  const compareLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: auto-insert into projects table, queued for extraction
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const insertOp = appear(268, 18) * lf;
  const insertLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={MANUAL_TO_STALE} color={T.danger} width={2.5} progress={t1} opacity={0.8 * t1Vis * lf} />
      <Connector pts={SCAN_TO_COMPARE} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={COMPARE_TO_INSERT} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...MANUAL} state="danger" lit={manualLit} opacity={manualOp} label="Add each repo by hand" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>slow, error-prone</div>
      </SchemaNode>
      <SchemaNode {...STALE} state="danger" lit={staleLit} opacity={staleOp} label="Missed projects" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>portfolio falls out of date</div>
      </SchemaNode>
      <Token pts={MANUAL_TO_STALE} t={t1} color={T.danger} opacity={t1Vis * lf} />
      <Badge x={STALE.x + STALE.w - 20} y={STALE.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />

      <SchemaNode {...SCAN} state="accent" lit={scanLit} opacity={scanOp} label="Periodic repo scan" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>GitHub Actions + Edge Function</div>
      </SchemaNode>
      <SchemaNode {...COMPARE} state="accent" lit={compareLit} opacity={compareOp} label="Diff vs known projects" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>new or updated repos</div>
      </SchemaNode>
      <Token pts={SCAN_TO_COMPARE} t={t2} opacity={t2Vis * lf} />
      <Pill x={SCAN.x + 10} y={SCAN.y - 46} text="runs on a schedule, no trigger needed" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...INSERT} state="success" lit={insertLit} opacity={insertOp} label="projects table INSERT" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>configured for feature extraction</div>
      </SchemaNode>
      <Token pts={COMPARE_TO_INSERT} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={INSERT.x + 20} y={INSERT.y + INSERT.h + 14} text="queued for the next scan cycle" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Every new repo needed a manual add — easy to miss, easy to fall behind" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A scheduled scan diffs live GitHub repos against the known project list" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="New matches insert themselves and queue for feature extraction" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Zero manual repo management</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>portfolio stays complete and current</div>
      </div>
    </AbsoluteFill>
  );
};
