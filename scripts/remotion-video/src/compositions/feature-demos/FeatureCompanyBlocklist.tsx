/**
 * FeatureCompanyBlocklist — feature j67 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: the owner asked for one company (NAMMO) to never receive an
 * auto-application, no matter the score. The only prior lever was lowering
 * the scoring threshold, which also hid the listing from review entirely.
 * A COMPANY_BLOCKLIST set + company_blocked() in worker/analyze_worker.py
 * runs before the score-threshold check in main(): a match logs 🚫 and
 * skips the application, but the job is still analyzed and carded.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const LOWER = { x: 90, y: 66, w: 280, h: 110 };
const NAMMO = { x: 500, y: 66, w: 280, h: 110 };
const LOWER_R: Pt = { x: LOWER.x + LOWER.w, y: LOWER.y + LOWER.h / 2 };
const NAMMO_L: Pt = { x: NAMMO.x, y: NAMMO.y + NAMMO.h / 2 };

const BLOCK = { x: 465, y: 250, w: 350, h: 120 };
const BLOCK_TOP: Pt = { x: BLOCK.x + BLOCK.w / 2, y: BLOCK.y };
const BLOCK_R: Pt = { x: BLOCK.x + BLOCK.w, y: BLOCK.y + BLOCK.h / 2 };

const MAIN = { x: 870, y: 266, w: 260, h: 96 };
const MAIN_L: Pt = { x: MAIN.x, y: MAIN.y + MAIN.h / 2 };

const CARD = { x: 465, y: 430, w: 350, h: 96 };
const CARD_TOP: Pt = { x: CARD.x + CARD.w / 2, y: CARD.y };
const BLOCK_BOTTOM: Pt = { x: BLOCK.x + BLOCK.w / 2, y: BLOCK.y + BLOCK.h };

const NAMMO_TO_BLOCK: Pt[] = [NAMMO_L, { x: NAMMO_L.x - 40, y: NAMMO_L.y }, BLOCK_TOP];
const BLOCK_TO_MAIN: Pt[] = [BLOCK_R, MAIN_L];
const BLOCK_TO_CARD: Pt[] = [BLOCK_BOTTOM, CARD_TOP];

export const FeatureCompanyBlocklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: lowering the threshold also hid the listing
  const lowerOp = appear(6) * lf;
  const nammoOp = appear(20) * lf;
  const nammoLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: COMPANY_BLOCKLIST + company_blocked() checked in main()
  const blockOp = appear(140, 18) * lf;
  const mainOp = appear(158, 18) * lf;
  const blockLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const mainLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: 🚫 no application, but job still analyzed and carded
  const cardOp = appear(244, 18) * lf;
  const cardLit = interpolate(frame, [252, 274, 330, 350], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
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

      <Connector pts={NAMMO_TO_BLOCK} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={BLOCK_TO_MAIN} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={BLOCK_TO_CARD} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...LOWER} state="danger" lit={0.2 * lf} opacity={lowerOp} label="Lower the threshold?" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>hides the listing too</div>
      </SchemaNode>
      <SchemaNode {...NAMMO} state="danger" lit={nammoLit} opacity={nammoOp} label="Never auto-apply: NAMMO" fontSize={18}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>owner's day-one request</div>
      </SchemaNode>
      <Pill x={NAMMO.x + 30} y={NAMMO.y - 46} dx={pill1Dx} text="no lever for this before" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...BLOCK} state="accent" lit={blockLit} opacity={blockOp} label="COMPANY_BLOCKLIST" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>company_blocked() · substring match</div>
      </SchemaNode>
      <SchemaNode {...MAIN} state="accent" lit={mainLit} opacity={mainOp} label="checked in main()" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>before the score threshold</div>
      </SchemaNode>
      <Token pts={NAMMO_TO_BLOCK} t={t2} opacity={t2Vis * lf} />
      <Token pts={BLOCK_TO_MAIN} t={t2b} opacity={t2bVis * lf} />
      <Pill x={BLOCK.x + 10} y={BLOCK.y + BLOCK.h + 14} dx={pill2Dx} text="lowercased, checked as substring" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...CARD} state="amber" lit={cardLit} opacity={cardOp} label="✕ no application" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>job still analyzed and carded</div>
      </SchemaNode>
      <Token pts={BLOCK_TO_CARD} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={CARD.x + 30} y={CARD.y + CARD.h + 12} dx={pill3Dx} text="scoring logic untouched" color={T.amber} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="The only lever available also hid the job from review" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="A named-company check runs ahead of the score gate" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="No application gets created, but the card still appears" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>enforced automatically, no scoring changes needed</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>excluded from auto-apply, still visible for review</div>
      </div>
    </AbsoluteFill>
  );
};
