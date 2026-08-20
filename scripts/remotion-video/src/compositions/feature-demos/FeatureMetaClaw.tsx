/**
 * FeatureMetaClaw — feature j04 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Skyvern hits an unknown Webcruiter form and fails cold (~60% first
 * attempt) → extract_memory_from_task() parses the step log, feeds
 * generate_skill_from_memory() → Gemini 2.5 Flash writes a SKILL GUIDE into
 * site_form_memory (JSONB) → next run on a DIFFERENT Webcruiter subdomain
 * queries that memory (domain-normalized), injects it as PREVIOUS EXPERIENCE,
 * and succeeds → "60% → 90%+ on repeat attempts".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const S1 = { x: 465, y: 44, w: 350, h: 86 };
const EXTRACT = { x: 80, y: 234, w: 270, h: 90 };
const GEMINI = { x: 465, y: 234, w: 270, h: 90 };
const MEMORY = { x: 850, y: 234, w: 270, h: 90 };
const S2 = { x: 465, y: 460, w: 350, h: 86 };

const S1_B: Pt = { x: S1.x + S1.w / 2, y: S1.y + S1.h };
const EXTRACT_T: Pt = { x: EXTRACT.x + EXTRACT.w / 2, y: EXTRACT.y };
const EXTRACT_R: Pt = { x: EXTRACT.x + EXTRACT.w, y: EXTRACT.y + EXTRACT.h / 2 };
const GEMINI_L: Pt = { x: GEMINI.x, y: GEMINI.y + GEMINI.h / 2 };
const GEMINI_R: Pt = { x: GEMINI.x + GEMINI.w, y: GEMINI.y + GEMINI.h / 2 };
const MEMORY_L: Pt = { x: MEMORY.x, y: MEMORY.y + MEMORY.h / 2 };
const MEMORY_B: Pt = { x: MEMORY.x + MEMORY.w / 2, y: MEMORY.y + MEMORY.h };
const S2_T: Pt = { x: S2.x + S2.w / 2, y: S2.y };

const P_TRIG: Pt[] = [S1_B, EXTRACT_T];
const P_EG: Pt[] = [EXTRACT_R, GEMINI_L];
const P_GM: Pt[] = [GEMINI_R, MEMORY_L];
const P_LOOP: Pt[] = [MEMORY_B, { x: MEMORY_B.x, y: 396 }, { x: S2_T.x, y: 396 }, S2_T];

export const FeatureMetaClaw: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): Skyvern hits an unknown form, fails cold ──
  const s1Op = Math.min(1, pop(10)) * lf;
  const s1Lit = interpolate(frame, [10, 34, 96, 118], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const ratePillIn = seg(frame, 54, 76, Easing.out(Easing.cubic));
  const ratePillOp = ratePillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (126–236): extract → Gemini → SKILL GUIDE stored ──
  const tTrig = seg(frame, 126, 150);
  const tTrigVis = frame >= 126 && frame < 180 ? 1 : 0;
  const extractOp = appear(128, 18) * lf;
  const extractLit = interpolate(frame, [136, 158, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tEg = seg(frame, 160, 184);
  const tEgVis = frame >= 160 && frame < 210 ? 1 : 0;
  const geminiOp = appear(160, 18) * lf;
  const geminiLit = interpolate(frame, [168, 190, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGm = seg(frame, 194, 218);
  const tGmVis = frame >= 194 && frame < 244 ? 1 : 0;
  const memoryOp = appear(196, 18) * lf;
  const memoryLit = interpolate(frame, [204, 226, 330, 350], [0, 0.7, 0.7, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const skillPillIn = seg(frame, 206, 228, Easing.out(Easing.cubic));
  const skillPillOp = skillPillIn * interpolate(frame, [312, 334], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (236–340): domain-normalized replay succeeds ──
  const tLoop = seg(frame, 244, 280);
  const tLoopVis = frame >= 244 && frame < 320 ? 1 : 0;
  const s2Op = appear(250, 18) * lf;
  const s2Lit = interpolate(frame, [258, 280, 330, 350], [0, 0.3, 0.3, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const expPillIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const expPillOp = expPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const checkScale = pop(288) * lf;
  const s2SuccessLit = interpolate(frame, [288, 306, 330, 350], [0, 0.85, 0.85, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
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

      <Connector pts={P_TRIG} color={T.danger} width={2.5} progress={tTrig} opacity={0.75 * tTrigVis * lf} />
      <Connector pts={P_EG} color={T.accent} width={2.5} progress={tEg} opacity={0.8 * tEgVis * lf} />
      <Connector pts={P_GM} color={T.accent} width={2.5} progress={tGm} opacity={0.8 * tGmVis * lf} />
      <Connector pts={P_LOOP} color={T.success} width={2.5} progress={tLoop} opacity={0.8 * tLoopVis * lf} />

      <SchemaNode {...S1} state="danger" lit={s1Lit} opacity={s1Op} label="Skyvern · Webcruiter form" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>unknown fields, no memory</div>
      </SchemaNode>
      <Badge x={S1.x + S1.w / 2 - 18} y={S1.y + S1.h + 6} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={S1.x + 60} y={S1.y - 46} text="~60% first-attempt success" color={T.danger} opacity={ratePillOp} fontSize={19} />

      <SchemaNode {...EXTRACT} state="accent" lit={extractLit} opacity={extractOp} label="extract_memory_from_task()" fontSize={16} />
      <SchemaNode {...GEMINI} state="accent" lit={geminiLit} opacity={geminiOp} label="Gemini 2.5 Flash" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>generate_skill_from_memory()</div>
      </SchemaNode>
      <SchemaNode {...MEMORY} state="success" lit={memoryLit} opacity={memoryOp} label="site_form_memory" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>PostgreSQL JSONB</div>
      </SchemaNode>
      <Token pts={P_TRIG} t={tTrig} color={T.danger} opacity={tTrigVis * lf} />
      <Token pts={P_EG} t={tEg} opacity={tEgVis * lf} />
      <Token pts={P_GM} t={tGm} opacity={tGmVis * lf} />
      <Pill x={MEMORY.x - 30} y={MEMORY.y - 46} dx={0} text="SKILL GUIDE (JSON) written" color={T.amber} opacity={skillPillOp} fontSize={18} />

      <SchemaNode {...S2} state={frame >= 288 ? "success" : "accent"} lit={Math.max(s2Lit, s2SuccessLit)} opacity={s2Op} label="Skyvern · new subdomain" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>same platform, different site</div>
      </SchemaNode>
      <Token pts={P_LOOP} t={tLoop} color={T.success} opacity={tLoopVis * lf} />
      <Pill x={S2.x + 30} y={S2.y - 46} text="PREVIOUS EXPERIENCE injected" color={T.success} opacity={expPillOp} fontSize={18} />
      <Badge x={S2.x + S2.w / 2 - 18} y={S2.y + S2.h + 6} kind="check" scale={checkScale} opacity={checkScale} />

      <Caption x={90} y={648} w={1100} text="No memory — every new site repeats the same failure" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Step log → skill guide → stored per domain" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Domain-normalized — one lesson helps every subdomain" color={T.success} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~60% first attempt → 90%+ on repeat attempts</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>The bot gets smarter with every application</div>
      </div>
    </AbsoluteFill>
  );
};
