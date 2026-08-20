/**
 * FeatureGeminiSkillGuides — feature j42 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: after every Skyvern automation attempt, generate_skill_from_memory()
 * used to bill Azure GPT-4 at $2.50/1M input tokens, 200+ calls/month → I
 * refactored it to hit Gemini 2.5 Flash's free tier with a rich payload
 * (site_domain, outcome, form_fields, navigation_flow, upload_methods) →
 * the 200-400 word guide is persisted in site_form_memory.skill_guide and
 * injected into the next navigation goal via build_memory_section() →
 * $0/month, +15-20% application success rate, Azure kept for high-value work.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SKY = { x: 80, y: 44, w: 240, h: 88 };
const AZURE = { x: 940, y: 44, w: 260, h: 88 };

const FUNC = { x: 70, y: 250, w: 280, h: 92 };
const GEMINI = { x: 500, y: 250, w: 250, h: 92 };
const MEM = { x: 900, y: 250, w: 300, h: 92 };

const SKY_R: Pt = { x: SKY.x + SKY.w, y: SKY.y + SKY.h / 2 };
const AZURE_L: Pt = { x: AZURE.x, y: AZURE.y + AZURE.h / 2 };
const FUNC_R: Pt = { x: FUNC.x + FUNC.w, y: FUNC.y + FUNC.h / 2 };
const GEMINI_L: Pt = { x: GEMINI.x, y: GEMINI.y + GEMINI.h / 2 };
const GEMINI_R: Pt = { x: GEMINI.x + GEMINI.w, y: GEMINI.y + GEMINI.h / 2 };
const MEM_L: Pt = { x: MEM.x, y: MEM.y + MEM.h / 2 };
const MEM_TOP: Pt = { x: MEM.x + MEM.w - 20, y: MEM.y };
const SKY_BOTTOM: Pt = { x: SKY.x + SKY.w / 2, y: SKY.y + SKY.h };

const P_SA: Pt[] = [SKY_R, AZURE_L];
const P_FG: Pt[] = [FUNC_R, GEMINI_L];
const P_GM: Pt[] = [GEMINI_R, MEM_L];
const P_LOOP: Pt[] = [MEM_TOP, { x: MEM_TOP.x, y: 150 }, SKY_BOTTOM];

export const FeatureGeminiSkillGuides: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): every Skyvern attempt bills Azure GPT-4 ──
  const skyOp = Math.min(1, pop(10)) * lf;
  const skyLit = 0.3 * lf;
  const azureOp = appear(30, 18) * lf;
  const azureLit = interpolate(frame, [40, 62, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tSa = seg(frame, 36, 58);
  const tSaVis = frame >= 36 && frame < 96 ? 1 : 0;
  const costPillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const costPillOp = costPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): refactor -> Gemini 2.5 Flash -> skill_guide ──
  const funcOp = appear(126, 18) * lf;
  const funcLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tFg = seg(frame, 148, 172);
  const tFgVis = frame >= 148 && frame < 206 ? 1 : 0;
  const geminiOp = appear(150, 18) * lf;
  const geminiLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGm = seg(frame, 182, 206);
  const tGmVis = frame >= 182 && frame < 236 ? 1 : 0;
  const memOp = appear(184, 18) * lf;
  const memLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const payloadPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const payloadPillOp = payloadPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): guide loops back into the next navigation goal ──
  const tLoop = seg(frame, 250, 284);
  const tLoopVis = frame >= 250 && frame < 320 ? 1 : 0;
  const loopLit = interpolate(frame, [258, 280, 330, 350], [0, 0.6, 0.6, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const injectPillIn = seg(frame, 254, 276, Easing.out(Easing.cubic));
  const injectPillOp = injectPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_SA} color={T.danger} width={2.5} progress={tSa} opacity={0.8 * tSaVis * lf} />
      <Connector pts={P_FG} color={T.accent} width={2.5} progress={tFg} opacity={0.8 * tFgVis * lf} />
      <Connector pts={P_GM} color={T.accent} width={2.5} progress={tGm} opacity={0.8 * tGmVis * lf} />
      <Connector pts={P_LOOP} color={T.success} width={2.5} progress={tLoop} opacity={0.7 * tLoopVis * lf} dashed />

      <SchemaNode {...SKY} state="accent" lit={Math.max(skyLit, loopLit)} opacity={skyOp} label="Skyvern attempt" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>form-filling automation</div>
      </SchemaNode>
      <SchemaNode {...AZURE} state="danger" lit={azureLit} opacity={azureOp} label="Azure GPT-4" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>$2.50/1M in · 200+ calls/mo</div>
      </SchemaNode>
      <Token pts={P_SA} t={tSa} color={T.danger} opacity={tSaVis * lf} />
      <Pill x={AZURE.x - 40} y={AZURE.y + AZURE.h + 14} text="paying for a repetitive task" color={T.danger} opacity={costPillOp} fontSize={17} />

      <SchemaNode {...FUNC} state="accent" lit={funcLit} opacity={funcOp} label="generate_skill_from_memory()" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>auto_apply.py</div>
      </SchemaNode>
      <SchemaNode {...GEMINI} state="success" lit={geminiLit} opacity={geminiOp} label="Gemini 2.5 Flash" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>REST API · free tier</div>
      </SchemaNode>
      <SchemaNode {...MEM} state="success" lit={memLit} opacity={memOp} label="site_form_memory.skill_guide" fontSize={15}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>200-400 word guide</div>
      </SchemaNode>
      <Token pts={P_FG} t={tFg} opacity={tFgVis * lf} />
      <Token pts={P_GM} t={tGm} opacity={tGmVis * lf} />
      <Token pts={P_LOOP} t={tLoop} color={T.success} opacity={tLoopVis * lf} />
      <Pill x={FUNC.x + 10} y={FUNC.y - 46} dx={0} text="site_domain, outcome, form_fields, nav_flow" color={T.amber} opacity={payloadPillOp} fontSize={15} />
      <Pill x={MEM.x - 60} y={MEM.y + MEM.h + 14} text="injected via build_memory_section()" color={T.success} opacity={injectPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="200+ calls a month, $2.50/1M tokens, for a repetitive skill guide" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="generate_skill_from_memory() now hits Gemini's free tier instead" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The guide feeds the bot's next navigation goal — it gets smarter each time" color={T.success} opacity={cap3} fontSize={21} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>$0/month for 200+ calls · +15-20% application success rate</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Azure GPT-4 reserved for high-value tasks only</div>
      </div>
    </AbsoluteFill>
  );
};
