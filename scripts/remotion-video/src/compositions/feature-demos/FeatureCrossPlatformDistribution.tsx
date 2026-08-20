/**
 * FeatureCrossPlatformDistribution — feature p13 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: manually re-encoding and uploading to YouTube, Reels, LinkedIn,
 * and Facebook costs 30-45 minutes per video → Remotion renders 2 formats
 * once (vertical + horizontal), then 4 GitHub Actions workflows push to
 * each platform's API → MTKruto pulls source video up to 2GB straight from
 * Telegram, bypassing the Bot API's 20MB cap, with a Telegram-embed
 * fallback if any upload fails → 30-45 min collapses to 2-3 min of
 * monitoring.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const MANUAL = { x: 460, y: 30, w: 360, h: 80 };
const REMOTION = { x: 460, y: 150, w: 360, h: 80 };
const WORKFLOWS = [
  { x: 60, y: 280, w: 270, h: 80, label: "process-video.yml", sub: "YouTube" },
  { x: 350, y: 280, w: 270, h: 80, label: "linkedin-video.yml", sub: "LinkedIn" },
  { x: 640, y: 280, w: 270, h: 80, label: "instagram-video.yml", sub: "Reels" },
  { x: 930, y: 280, w: 270, h: 80, label: "facebook-video.yml", sub: "Facebook" },
];
const MTKRUTO = { x: 460, y: 410, w: 360, h: 80 };

const MANUAL_B: Pt = { x: MANUAL.x + MANUAL.w / 2, y: MANUAL.y + MANUAL.h };
const REMOTION_T: Pt = { x: REMOTION.x + REMOTION.w / 2, y: REMOTION.y };
const REMOTION_B: Pt = { x: REMOTION.x + REMOTION.w / 2, y: REMOTION.y + REMOTION.h };
const WF_T: Pt[] = WORKFLOWS.map((w) => ({ x: w.x + w.w / 2, y: w.y }));
const P_REM_WF: Pt[][] = WF_T.map((w) => [REMOTION_B, w]);
const WF2_B: Pt = { x: WORKFLOWS[2].x + WORKFLOWS[2].w / 2, y: WORKFLOWS[2].y + WORKFLOWS[2].h };
const MTKRUTO_T: Pt = { x: MTKRUTO.x + MTKRUTO.w / 2, y: MTKRUTO.y };

const P_MANUAL_REM: Pt[] = [MANUAL_B, REMOTION_T];
const P_WF2_MTK: Pt[] = [WF2_B, MTKRUTO_T];

export const FeatureCrossPlatformDistribution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–108): manual re-encode + upload to 4 platforms ──
  const manOp = Math.min(1, pop(4)) * lf;
  const manLit = interpolate(frame, [4, 26, 86, 106], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const slowPillIn = seg(frame, 30, 52, Easing.out(Easing.cubic));
  const slowPillOp = slowPillIn * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 18, 40, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (112–248): Remotion renders once, 4 workflows push out ──
  const tMr = seg(frame, 114, 136);
  const tMrVis = frame >= 114 && frame < 190 ? 1 : 0;
  const remOp = appear(118, 18) * lf;
  const remLit = interpolate(frame, [126, 148, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tWf = [0, 1, 2, 3].map((i) => seg(frame, 150 + i * 12, 170 + i * 12));
  const tWfVis = [0, 1, 2, 3].map((i) => (frame >= 150 + i * 12 && frame < 330 ? 1 : 0));
  const wfOp = WORKFLOWS.map((_, i) => appear(154 + i * 12, 16) * lf);
  const wfLit = WORKFLOWS.map((_, i) => {
    const s = 150 + i * 12;
    return interpolate(frame, [s, s + 16, 330, 350], [0, 0.65, 0.65, 0.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const cap2In = seg(frame, 152, 174, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [242, 262], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const formatsPillIn = seg(frame, 176, 198, Easing.out(Easing.cubic));
  const formatsPillOp = formatsPillIn * interpolate(frame, [242, 262], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (250–350): MTKruto bypasses the 20MB Bot API cap ──
  const tWm = seg(frame, 252, 274);
  const tWmVis = frame >= 252 && frame < 330 ? 1 : 0;
  const mtkOp = appear(256, 18) * lf;
  const mtkLit = interpolate(frame, [264, 286, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const fallbackPillIn = seg(frame, 288, 310, Easing.out(Easing.cubic));
  const fallbackPillOp = fallbackPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 258, 280, Easing.out(Easing.cubic));
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

      <Connector pts={P_MANUAL_REM} color={T.accent} width={2.5} progress={tMr} opacity={0.8 * tMrVis * lf} />
      {P_REM_WF.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.accent} width={2} progress={tWf[i]} opacity={0.7 * tWfVis[i] * lf} />
      ))}
      <Connector pts={P_WF2_MTK} color={T.success} width={2.5} progress={tWm} opacity={0.8 * tWmVis * lf} />

      <SchemaNode {...MANUAL} state="danger" lit={manLit} opacity={manOp} label="manual re-encode + upload x4" fontSize={17} />
      <Pill x={MANUAL.x - 10} y={MANUAL.y + MANUAL.h + 14} text="30-45 minutes per video, every time" color={T.danger} opacity={slowPillOp} fontSize={16} />

      <SchemaNode {...REMOTION} state="accent" lit={remLit} opacity={remOp} label="Remotion renders once" fontSize={19} />
      <Token pts={P_MANUAL_REM} t={tMr} opacity={tMrVis * lf} />
      <Pill x={REMOTION.x - 20} y={REMOTION.y - 46} text="1080x1920 vertical + 1920x1080 horizontal" color={T.accent} opacity={formatsPillOp} fontSize={15} />

      {WORKFLOWS.map((w, i) => (
        <SchemaNode key={w.label} {...w} state="accent" lit={wfLit[i]} opacity={wfOp[i]} label={w.label} fontSize={14}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>{w.sub}</div>
        </SchemaNode>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Token key={i} pts={P_REM_WF[i]} t={tWf[i]} opacity={tWfVis[i] * lf} />
      ))}

      <SchemaNode {...MTKRUTO} state="success" lit={mtkLit} opacity={mtkOp} label="MTKruto" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>up to 2GB, bypasses 20MB Bot API limit</div>
      </SchemaNode>
      <Token pts={P_WF2_MTK} t={tWm} color={T.success} opacity={tWmVis * lf} />
      <Pill x={MTKRUTO.x - 20} y={MTKRUTO.y + MTKRUTO.h + 14} text="Telegram embed fallback if any upload fails" color={T.success} opacity={fallbackPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Re-encoding and uploading to 4 platforms, one by one — a huge time sink" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Render once, then 4 workflows push to each platform's own API" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Large source video streams straight from Telegram, no size ceiling" color={T.success} opacity={cap3} fontSize={21} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>One trigger, four platforms, maximum reach</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>30-45 min → 2-3 min of monitoring</div>
      </div>
    </AbsoluteFill>
  );
};
