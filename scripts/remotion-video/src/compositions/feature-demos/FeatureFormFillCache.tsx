/**
 * FeatureFormFillCache — feature j58 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every job application paid for form-filling recon from scratch —
 * scripts written to /tmp/formfill/ were wiped on container rebuild, so 58
 * scripts got thrown away between 22.07 and 27.07 at ~6.8M tokens per new
 * ATS site. skills/form-filling/CACHE.md now banks a profile.json + fill.mjs
 * per form host in /workspace/agent/form-scripts/<host>/; SKILL.md phase 0
 * checks the cache first and skips recon on a hit; phase 9 makes banking the
 * new profile mandatory before the turn ends.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TMP = { x: 90, y: 66, w: 280, h: 110 };
const SCRIPTS = { x: 500, y: 66, w: 280, h: 110 };
const TMP_R: Pt = { x: TMP.x + TMP.w, y: TMP.y + TMP.h / 2 };
const SCRIPTS_L: Pt = { x: SCRIPTS.x, y: SCRIPTS.y + SCRIPTS.h / 2 };

const CACHE = { x: 465, y: 250, w: 350, h: 120 };
const CACHE_TOP: Pt = { x: CACHE.x + CACHE.w / 2, y: CACHE.y };
const CACHE_R: Pt = { x: CACHE.x + CACHE.w, y: CACHE.y + CACHE.h / 2 };

const SKILL = { x: 870, y: 266, w: 260, h: 96 };
const SKILL_L: Pt = { x: SKILL.x, y: SKILL.y + SKILL.h / 2 };

const BANK = { x: 465, y: 430, w: 350, h: 96 };
const BANK_TOP: Pt = { x: BANK.x + BANK.w / 2, y: BANK.y };
const CACHE_BOTTOM: Pt = { x: CACHE.x + CACHE.w / 2, y: CACHE.y + CACHE.h };

const SCRIPTS_TO_CACHE: Pt[] = [SCRIPTS_L, { x: SCRIPTS_L.x - 40, y: SCRIPTS_L.y }, CACHE_TOP];
const CACHE_TO_SKILL: Pt[] = [CACHE_R, SKILL_L];
const CACHE_TO_BANK: Pt[] = [CACHE_BOTTOM, BANK_TOP];

export const FeatureFormFillCache: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: recon from scratch every time, wiped on rebuild
  const tmpOp = appear(6) * lf;
  const scriptsOp = appear(20) * lf;
  const scriptsLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: profile.json + fill.mjs keyed by host, SKILL.md checks cache first
  const cacheOp = appear(140, 18) * lf;
  const skillOp = appear(158, 18) * lf;
  const cacheLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const skillLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: phase 9 makes banking the profile mandatory
  const bankOp = appear(244, 18) * lf;
  const bankLit = interpolate(frame, [252, 274, 330, 350], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const bankCheck = pop(284) * lf;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={SCRIPTS_TO_CACHE} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={CACHE_TO_SKILL} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={CACHE_TO_BANK} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...TMP} state="danger" lit={0.2 * lf} opacity={tmpOp} label="/tmp/formfill/" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>wiped on container rebuild</div>
      </SchemaNode>
      <SchemaNode {...SCRIPTS} state="danger" lit={scriptsLit} opacity={scriptsOp} label="58 scripts thrown away" fontSize={20}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>7 tries on one COWI widget</div>
      </SchemaNode>
      <Pill x={SCRIPTS.x - 4} y={SCRIPTS.y - 46} dx={pill1Dx} text="~6.8M tokens per new site" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...CACHE} state="accent" lit={cacheLit} opacity={cacheOp} label="form-scripts/<host>/" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>profile.json + fill.mjs · keyed by host</div>
      </SchemaNode>
      <SchemaNode {...SKILL} state="accent" lit={skillLit} opacity={skillOp} label="SKILL.md phase 0" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>cache hit → skip recon</div>
      </SchemaNode>
      <Token pts={SCRIPTS_TO_CACHE} t={t2} opacity={t2Vis * lf} />
      <Token pts={CACHE_TO_SKILL} t={t2b} opacity={t2bVis * lf} />
      <Pill x={CACHE.x + 10} y={CACHE.y + CACHE.h + 14} dx={pill2Dx} text="8 platforms = 80% of the queue" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...BANK} state="success" lit={bankLit} opacity={bankOp} label="Phase 9: bank the profile" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>mandatory before turn ends · CACHE v5</div>
      </SchemaNode>
      <Token pts={CACHE_TO_BANK} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Badge x={BANK.x + BANK.w - 20} y={BANK.y - 12} kind="check" scale={bankCheck} opacity={bankCheck} />
      <Pill x={BANK.x + 30} y={BANK.y + BANK.h + 12} dx={pill3Dx} text="nothing lost again" color={T.success} opacity={pill3Op} fontSize={19} />

      <Caption x={90} y={648} w={1100} text="Every application paid for the same recon from scratch" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="One cached profile per ATS host, checked before recon starts" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Banking the new profile is now mandatory, not optional" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>a new site still costs the recon budget once</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>every repeat on that host costs nothing extra</div>
      </div>
    </AbsoluteFill>
  );
};
