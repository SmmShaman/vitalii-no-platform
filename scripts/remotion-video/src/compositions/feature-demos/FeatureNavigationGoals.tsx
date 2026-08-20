/**
 * FeatureNavigationGoals — feature j11 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a generic automation script hits Webcruiter, Easycruit, Teamtailor
 * (and 13+ more) and fails on each one's unique flow → near-zero success →
 * navigation_goals.py's detect_site_type() picks the platform, then
 * template functions like _webcruiter_application() generate precise
 * step-by-step instructions → build_memory_section() layers in historical
 * form data from site_form_memory → 85%+ success, ~30 min to add a platform.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const GENERIC = { x: 460, y: 30, w: 360, h: 80 };
const PLATFORMS = [
  { x: 90, y: 160, w: 220, h: 70, label: "Webcruiter" },
  { x: 340, y: 160, w: 220, h: 70, label: "Easycruit" },
  { x: 590, y: 160, w: 220, h: 70, label: "Teamtailor" },
  { x: 840, y: 160, w: 220, h: 70, label: "+13 more" },
];
const DETECT = { x: 90, y: 330, w: 280, h: 90 };
const NAVGOALS = { x: 500, y: 330, w: 300, h: 90 };
const MEMORY = { x: 900, y: 330, w: 280, h: 90 };

const GENERIC_B: Pt = { x: GENERIC.x + GENERIC.w / 2, y: GENERIC.y + GENERIC.h };
const PLAT_T: Pt[] = PLATFORMS.map((p) => ({ x: p.x + p.w / 2, y: p.y }));
const P_GEN_PLAT: Pt[][] = PLAT_T.map((p) => [GENERIC_B, p]);
const PLAT0_B: Pt = { x: PLATFORMS[0].x + PLATFORMS[0].w / 2, y: PLATFORMS[0].y + PLATFORMS[0].h };
const DETECT_T: Pt = { x: DETECT.x + DETECT.w / 2, y: DETECT.y };
const DETECT_R: Pt = { x: DETECT.x + DETECT.w, y: DETECT.y + DETECT.h / 2 };
const NAVGOALS_L: Pt = { x: NAVGOALS.x, y: NAVGOALS.y + NAVGOALS.h / 2 };
const NAVGOALS_R: Pt = { x: NAVGOALS.x + NAVGOALS.w, y: NAVGOALS.y + NAVGOALS.h / 2 };
const MEMORY_L: Pt = { x: MEMORY.x, y: MEMORY.y + MEMORY.h / 2 };

const P_P0_DETECT: Pt[] = [PLAT0_B, DETECT_T];
const P_DETECT_NAV: Pt[] = [DETECT_R, NAVGOALS_L];
const P_NAV_MEM: Pt[] = [NAVGOALS_R, MEMORY_L];

export const FeatureNavigationGoals: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): generic script fails on every quirky platform ──
  const genOp = Math.min(1, pop(4)) * lf;
  const genLit = interpolate(frame, [4, 26, 90, 110], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tPlat = [0, 1, 2, 3].map((i) => seg(frame, 14 + i * 16, 30 + i * 16));
  const tPlatVis = [0, 1, 2, 3].map((i) => (frame >= 14 + i * 16 && frame < 60 + i * 16 ? 1 : 0));
  const platOp = PLATFORMS.map((_, i) => appear(12 + i * 16, 14) * lf);
  const platLit = PLATFORMS.map((_, i) => {
    const s = 14 + i * 16;
    return interpolate(frame, [s, s + 14, 92, 112], [0, 0.5, 0.5, 0.15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const xScale = [0, 1, 2, 3].map((i) =>
    pop(30 + i * 16 + 8) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf,
  );
  const failPillIn = seg(frame, 74, 96, Easing.out(Easing.cubic));
  const failPillOp = failPillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (122–248): detect_site_type() → navigation_goals.py templates ──
  const tP0d = seg(frame, 124, 146);
  const tP0dVis = frame >= 124 && frame < 148 ? 1 : 0;
  const detectOp = appear(126, 18) * lf;
  const detectLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tDn = seg(frame, 150, 172);
  const tDnVis = frame >= 150 && frame < 174 ? 1 : 0;
  const navOp = appear(154, 18) * lf;
  const navLit = interpolate(frame, [162, 184, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tmplPillIn = seg(frame, 186, 208, Easing.out(Easing.cubic));
  const tmplPillOp = tmplPillIn * interpolate(frame, [238, 258], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 156, 178, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [238, 258], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const checkScale2 = pop(196) * lf;

  // ── Beat 3 (262–352): build_memory_section() layers in historical data ──
  const tNm = seg(frame, 264, 286);
  const tNmVis = frame >= 264 && frame < 288 ? 1 : 0;
  const memOp = appear(268, 18) * lf;
  const memLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const memPillIn = seg(frame, 300, 322, Easing.out(Easing.cubic));
  const memPillOp = memPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (360–450): result ──
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;
  const metricOp = seg(frame, 366, 388, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {P_GEN_PLAT.map((pts, i) => (
        <Connector key={i} pts={pts} color={i === 0 ? T.accent : T.danger} width={2.5} progress={tPlat[i]} opacity={0.8 * tPlatVis[i] * lf} />
      ))}
      <Connector pts={P_P0_DETECT} color={T.accent} width={2.5} progress={tP0d} opacity={0.8 * tP0dVis * lf} />
      <Connector pts={P_DETECT_NAV} color={T.accent} width={2.5} progress={tDn} opacity={0.8 * tDnVis * lf} />
      <Connector pts={P_NAV_MEM} color={T.accent} width={2.5} progress={tNm} opacity={0.8 * tNmVis * lf} />

      <SchemaNode {...GENERIC} state="idle" lit={genLit} opacity={genOp} label="generic automation script" fontSize={19} />

      {PLATFORMS.map((p, i) => (
        <SchemaNode key={p.label} {...p} state={i === 0 ? "success" : "danger"} lit={platLit[i]} opacity={platOp[i]} label={p.label} fontSize={17} />
      ))}
      {[1, 2, 3].map((i) => (
        <Badge key={i} x={PLATFORMS[i].x + PLATFORMS[i].w / 2 - 16} y={PLATFORMS[i].y - 34} kind="cross" scale={xScale[i]} opacity={xScale[i]} size={32} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Token key={i} pts={P_GEN_PLAT[i]} t={tPlat[i]} color={i === 0 ? T.accent : T.danger} opacity={tPlatVis[i] * lf} />
      ))}
      <Pill x={PLATFORMS[2].x - 20} y={PLATFORMS[2].y + PLATFORMS[2].h + 14} text="wildly diverse UI flows — near-zero success" color={T.danger} opacity={failPillOp} fontSize={16} />

      <SchemaNode {...DETECT} state="accent" lit={detectLit} opacity={detectOp} label="detect_site_type()" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>16+ platforms by URL domain</div>
      </SchemaNode>
      <Token pts={P_P0_DETECT} t={tP0d} color={T.accent} opacity={tP0dVis * lf} />

      <SchemaNode {...NAVGOALS} state="accent" lit={navLit} opacity={navOp} label="navigation_goals.py" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>15+ template functions</div>
      </SchemaNode>
      <Token pts={P_DETECT_NAV} t={tDn} opacity={tDnVis * lf} />
      <Badge x={NAVGOALS.x + NAVGOALS.w / 2 - 17} y={NAVGOALS.y - 40} kind="check" scale={checkScale2} opacity={checkScale2} />
      <Pill x={NAVGOALS.x - 40} y={NAVGOALS.y + NAVGOALS.h + 14} text="_webcruiter_application() · _easycruit_application()" color={T.accent} opacity={tmplPillOp} fontSize={15} />

      <SchemaNode {...MEMORY} state="amber" lit={memLit} opacity={memOp} label="build_memory_section()" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>historical form patterns</div>
      </SchemaNode>
      <Token pts={P_NAV_MEM} t={tNm} color={T.amber} opacity={tNmVis * lf} />
      <Pill x={MEMORY.x - 30} y={MEMORY.y + MEMORY.h + 14} text="remembers field values + common pitfalls" color={T.amber} opacity={memPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Multi-step wizards, cookie popups, hidden forms — one script can't handle it all" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="detect_site_type() picks the platform, a template builds precise instructions" color={T.text} opacity={cap2} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Historical form memory boosts robustness via pattern matching" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~30 min to add a new platform — not hours of debugging</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>85%+ success rate on supported platforms</div>
      </div>
    </AbsoluteFill>
  );
};
