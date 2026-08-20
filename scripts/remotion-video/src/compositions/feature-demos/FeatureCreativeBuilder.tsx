/**
 * FeatureCreativeBuilder — feature p19 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: vague feedback like "more corporate" or "warmer colors" is useless
 * as a direct prompt, forcing 2+ hours of manual tweak-and-regenerate daily
 * → a Telegram bot walks moderators through cb_hub_${uuid} (7 categories) →
 * cb_c_XX_${uuid} (6 options each) → cb_s_XX_N_${uuid} updates session state
 * in Supabase, all 42 elements editable no-code in creative_elements →
 * cb_gen_${uuid} compiles the selections + article metadata into a real
 * prompt for Azure OpenAI → "2 hours to 15 minutes, an 87% reduction".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const VAGUE = { x: 465, y: 56, w: 350, h: 96 };
const VAGUE_BOTTOM: Pt = { x: VAGUE.x + VAGUE.w / 2, y: VAGUE.y + VAGUE.h };

const HUB = { x: 465, y: 220, w: 350, h: 96 };
const HUB_TOP: Pt = { x: HUB.x + HUB.w / 2, y: HUB.y };
const HUB_R: Pt = { x: HUB.x + HUB.w, y: HUB.y + HUB.h / 2 };
const HUB_BOTTOM: Pt = { x: HUB.x + HUB.w / 2, y: HUB.y + HUB.h };

const ELEMENTS = { x: 900, y: 232, w: 260, h: 72 };
const ELEMENTS_L: Pt = { x: ELEMENTS.x, y: ELEMENTS.y + ELEMENTS.h / 2 };

const GEN = { x: 465, y: 440, w: 350, h: 96 };
const GEN_TOP: Pt = { x: GEN.x + GEN.w / 2, y: GEN.y };

const VAGUE_TO_HUB: Pt[] = [VAGUE_BOTTOM, HUB_TOP];
const HUB_TO_ELEMENTS: Pt[] = [HUB_R, ELEMENTS_L];
const HUB_TO_GEN: Pt[] = [HUB_BOTTOM, GEN_TOP];

export const FeatureCreativeBuilder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): vague feedback, unusable for prompts ──
  const vagueOp = appear(6) * lf;
  const vagueLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const crossScale = pop(34) * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): cb_hub → 7 categories → 6 options each ──
  const hubOp = appear(140, 18) * lf;
  const hubLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const elOp = appear(190, 16) * lf;
  const elLit = interpolate(frame, [198, 220, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2b = seg(frame, 192, 216);
  const t2bVis = frame >= 192 && frame < 236 ? 1 : 0;
  const pill2In = seg(frame, 198, 220, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): cb_gen compiles selections + metadata → Azure ──
  const genOp = appear(244, 18) * lf;
  const genLit = interpolate(frame, [252, 274, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={VAGUE_TO_HUB} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={HUB_TO_ELEMENTS} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={HUB_TO_GEN} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...VAGUE} state="danger" lit={vagueLit} opacity={vagueOp} label='"more corporate", "warmer"' fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>useless for a real prompt</div>
      </SchemaNode>
      <Badge x={VAGUE.x + VAGUE.w / 2 - 18} y={VAGUE.y - 46} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={VAGUE.x + 30} y={VAGUE.y + VAGUE.h + 14} dx={pill1Dx} text="2+ hours of trial and error, daily" color={T.danger} opacity={pill1Op} fontSize={18} />

      <SchemaNode {...HUB} state="accent" lit={hubLit} opacity={hubOp} label="cb_hub_${uuid}" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>7 categories → 6 options each, tap-based</div>
      </SchemaNode>
      <Token pts={VAGUE_TO_HUB} t={t2} opacity={t2Vis * lf} />
      <Pill x={HUB.x + 10} y={HUB.y - 46} dx={pill2Dx} text="cb_s_XX_N — session state in Supabase" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...ELEMENTS} state="accent" lit={elLit} opacity={elOp} label="creative_elements" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>7×6 = 42 elements, no-code</div>
      </SchemaNode>
      <Token pts={HUB_TO_ELEMENTS} t={t2b} opacity={t2bVis * lf} />

      <SchemaNode {...GEN} state="success" lit={genLit} opacity={genOp} label="cb_gen → Azure OpenAI" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>selections + article metadata compiled</div>
      </SchemaNode>
      <Token pts={HUB_TO_GEN} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={GEN.x + 30} y={GEN.y + GEN.h + 12} dx={pill3Dx} text="cb_rst clears choices instantly" color={T.success} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text='"Warmer colors" is not a prompt a model can act on' color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="7×6 tap-based menu turns vague taste into real parameters" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every choice compiles straight into the image prompt" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>2 hours → 15 minutes per article</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>87% less iteration time</div>
      </div>
    </AbsoluteFill>
  );
};
