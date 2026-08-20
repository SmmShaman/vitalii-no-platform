/**
 * FeatureVisualDirector — feature p09 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every auto-generated video looked identical — same backgrounds,
 * same predictable text animations, visual monotony killing engagement →
 * VisualDirector segments the script into phrases, an Azure OpenAI prompt
 * does semantic analysis, then assigns one of 8 Remotion effects per
 * phrase (glitch, globe, data-dashboard...) → ContextualImageFetcher pulls
 * Pexels/Google Images to match → each video gains a distinct identity,
 * +20-30% engagement.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SCRIPT = { x: 460, y: 30, w: 360, h: 70 };
const VD = { x: 460, y: 150, w: 360, h: 80 };
const EFFECTS = [
  "blur-text",
  "particles",
  "glitch",
  "globe",
  "data-dashboard",
  "perlin-waves",
  "photo-native",
  "infographic",
].map((label, i) => ({ x: 45 + i * 150, y: 280, w: 140, h: 64, label }));
const FETCHER = { x: 460, y: 400, w: 360, h: 80 };

const SCRIPT_B: Pt = { x: SCRIPT.x + SCRIPT.w / 2, y: SCRIPT.y + SCRIPT.h };
const VD_T: Pt = { x: VD.x + VD.w / 2, y: VD.y };
const VD_B: Pt = { x: VD.x + VD.w / 2, y: VD.y + VD.h };
const EFF_T: Pt[] = EFFECTS.map((e) => ({ x: e.x + e.w / 2, y: e.y }));
const P_VD_EFF: Pt[][] = EFF_T.map((e) => [VD_B, e]);
const EFF6_B: Pt = { x: EFFECTS[6].x + EFFECTS[6].w / 2, y: EFFECTS[6].y + EFFECTS[6].h };
const FETCHER_T: Pt = { x: FETCHER.x + FETCHER.w / 2, y: FETCHER.y };

const P_SCRIPT_VD: Pt[] = [SCRIPT_B, VD_T];
const P_EFF6_FETCHER: Pt[] = [EFF6_B, FETCHER_T];

const PICK_ORDER = [2, 3, 4]; // glitch, globe, data-dashboard — sequential picks in beat 2

export const FeatureVisualDirector: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–108): identical, bland videos — visual monotony ──
  const scriptOp = Math.min(1, pop(4)) * lf;
  const scriptLit = interpolate(frame, [4, 26, 86, 106], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const blandPillIn = seg(frame, 30, 52, Easing.out(Easing.cubic));
  const blandPillOp = blandPillIn * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (112–248): semantic analysis picks 1 of 8 effects, phrase by phrase ──
  const tSv = seg(frame, 114, 136);
  const tSvVis = frame >= 114 && frame < 260 ? 1 : 0;
  const vdOp = appear(118, 18) * lf;
  const vdLit = interpolate(frame, [126, 148, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const effOp = EFFECTS.map((_, i) => appear(140 + i * 6, 12) * lf);
  const effAmbient = 0.1 * lf;
  const tPick = PICK_ORDER.map((_, k) => seg(frame, 156 + k * 26, 176 + k * 26));
  const tPickVis = PICK_ORDER.map((_, k) => (frame >= 156 + k * 26 && frame < 216 + k * 26 ? 1 : 0));
  const pickLit = EFFECTS.map((_, i) => {
    const k = PICK_ORDER.indexOf(i);
    if (k === -1) return effAmbient;
    const s = 156 + k * 26;
    return interpolate(frame, [s, s + 14, s + 44, s + 60], [0, 0.85, 0.85, 0.25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const eightPillIn = seg(frame, 220, 242, Easing.out(Easing.cubic));
  const eightPillOp = eightPillIn * interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 126, 148, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (252–350): ContextualImageFetcher pulls matching photos ──
  const tEf = seg(frame, 254, 276);
  const tEfVis = frame >= 254 && frame < 330 ? 1 : 0;
  const fetchOp = appear(258, 18) * lf;
  const fetchLit = interpolate(frame, [266, 288, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const pexelsPillIn = seg(frame, 290, 312, Easing.out(Easing.cubic));
  const pexelsPillOp = pexelsPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
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

      <Connector pts={P_SCRIPT_VD} color={T.accent} width={2.5} progress={tSv} opacity={0.8 * tSvVis * lf} />
      {P_VD_EFF.map((pts, i) => {
        const k = PICK_ORDER.indexOf(i);
        return (
          <Connector
            key={i}
            pts={pts}
            color={T.amber}
            width={k === -1 ? 1.5 : 2.5}
            progress={k === -1 ? 1 : tPick[k]}
            opacity={k === -1 ? 0.12 * effOp[i] : 0.8 * tPickVis[k] * lf}
          />
        );
      })}
      <Connector pts={P_EFF6_FETCHER} color={T.success} width={2.5} progress={tEf} opacity={0.8 * tEfVis * lf} />

      <SchemaNode {...SCRIPT} state="idle" lit={scriptLit} opacity={scriptOp} label="script — segmented into phrases" fontSize={18} />
      <Pill x={SCRIPT.x - 20} y={SCRIPT.y + SCRIPT.h + 14} text="every video looked the same — visual monotony" color={T.danger} opacity={blandPillOp} fontSize={15} />

      <SchemaNode {...VD} state="accent" lit={vdLit} opacity={vdOp} label="VisualDirector" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Azure OpenAI semantic analysis</div>
      </SchemaNode>
      <Token pts={P_SCRIPT_VD} t={tSv} opacity={tSvVis * lf} />

      {EFFECTS.map((e, i) => (
        <SchemaNode key={e.label} {...e} state={PICK_ORDER.includes(i) ? "amber" : "idle"} lit={pickLit[i]} opacity={effOp[i]} label={e.label} fontSize={13} />
      ))}
      {PICK_ORDER.map((i, k) => (
        <Token key={i} pts={P_VD_EFF[i]} t={tPick[k]} color={T.amber} opacity={tPickVis[k] * lf} />
      ))}
      <Pill x={EFFECTS[3].x - 30} y={EFFECTS[3].y - 46} text="8 dynamically-imported effect components" color={T.amber} opacity={eightPillOp} fontSize={15} />

      <SchemaNode {...FETCHER} state="success" lit={fetchLit} opacity={fetchOp} label="ContextualImageFetcher" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Pexels + Google Images</div>
      </SchemaNode>
      <Token pts={P_EFF6_FETCHER} t={tEf} color={T.success} opacity={tEfVis * lf} />
      <Pill x={FETCHER.x - 20} y={FETCHER.y + FETCHER.h + 14} text="every frame contextually aligned" color={T.success} opacity={pexelsPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Nordic energy policy or Silicon Valley AI — every video looked identical" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Semantic analysis assigns the right visual effect, phrase by phrase" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Contextual images replace static backgrounds, frame by frame" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Every video gains its own visual identity</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Estimated +20-30% viewer engagement</div>
      </div>
    </AbsoluteFill>
  );
};
