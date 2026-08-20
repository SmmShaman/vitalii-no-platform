/**
 * FeatureTwoBotRouting — feature j60 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: @soknad_bot carried everything — job cards with approve buttons, plus
 * two-language cover letters, submit receipts, and hand-off notices — so an
 * actionable card was buried under informational volume. The routing rule
 * flips to "does the user have to do something?": @soknad_bot keeps only
 * cards with buttons, blocking questions, 2FA codes, and command replies;
 * @vitalljobtechbot takes everything else. patch-agent-pollers.cjs grows a
 * POLLERS table (ROUTING v4) and strips a stale confirm/cancel block.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SOKNAD = { x: 90, y: 66, w: 280, h: 110 };
const BURIED = { x: 500, y: 66, w: 280, h: 110 };
const SOKNAD_R: Pt = { x: SOKNAD.x + SOKNAD.w, y: SOKNAD.y + SOKNAD.h / 2 };
const BURIED_L: Pt = { x: BURIED.x, y: BURIED.y + BURIED.h / 2 };

const RULE = { x: 465, y: 250, w: 350, h: 120 };
const RULE_TOP: Pt = { x: RULE.x + RULE.w / 2, y: RULE.y };
const RULE_R: Pt = { x: RULE.x + RULE.w, y: RULE.y + RULE.h / 2 };

const TECHBOT = { x: 870, y: 266, w: 260, h: 96 };
const TECHBOT_L: Pt = { x: TECHBOT.x, y: TECHBOT.y + TECHBOT.h / 2 };

const POLLERS = { x: 465, y: 430, w: 350, h: 96 };
const POLLERS_TOP: Pt = { x: POLLERS.x + POLLERS.w / 2, y: POLLERS.y };
const RULE_BOTTOM: Pt = { x: RULE.x + RULE.w / 2, y: RULE.y + RULE.h };

const BURIED_TO_RULE: Pt[] = [BURIED_L, { x: BURIED_L.x - 40, y: BURIED_L.y }, RULE_TOP];
const RULE_TO_TECHBOT: Pt[] = [RULE_R, TECHBOT_L];
const RULE_TO_POLLERS: Pt[] = [RULE_BOTTOM, POLLERS_TOP];

export const FeatureTwoBotRouting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: one bot carried everything
  const soknadOp = appear(6) * lf;
  const buriedOp = appear(20) * lf;
  const buriedLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: one-question routing rule splits the two bots
  const ruleOp = appear(140, 18) * lf;
  const techbotOp = appear(158, 18) * lf;
  const ruleLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const techbotLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: POLLERS table (ROUTING v4) applies split, strips stale block
  const pollersOp = appear(244, 18) * lf;
  const pollersLit = interpolate(frame, [252, 274, 330, 350], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={BURIED_TO_RULE} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={RULE_TO_TECHBOT} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={RULE_TO_POLLERS} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...SOKNAD} state="danger" lit={0.2 * lf} opacity={soknadOp} label="@soknad_bot" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>cards + letters + receipts + hand-offs</div>
      </SchemaNode>
      <SchemaNode {...BURIED} state="danger" lit={buriedLit} opacity={buriedOp} label="Buried actionable card" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>lost in the volume</div>
      </SchemaNode>
      <Pill x={BURIED.x + 10} y={BURIED.y - 46} dx={pill1Dx} text="one bot, everything mixed" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...RULE} state="accent" lit={ruleLit} opacity={ruleOp} label="Does the user act?" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>the one routing question</div>
      </SchemaNode>
      <SchemaNode {...TECHBOT} state="accent" lit={techbotLit} opacity={techbotOp} label="@vitalljobtechbot" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>letters · receipts · hand-offs</div>
      </SchemaNode>
      <Token pts={BURIED_TO_RULE} t={t2} opacity={t2Vis * lf} />
      <Token pts={RULE_TO_TECHBOT} t={t2b} opacity={t2bVis * lf} />
      <Pill x={RULE.x + 10} y={RULE.y + RULE.h + 14} dx={pill2Dx} text="@soknad_bot keeps only buttons + 2FA" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...POLLERS} state="amber" lit={pollersLit} opacity={pollersOp} label="POLLERS table" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>ROUTING v4 · stale confirm block stripped</div>
      </SchemaNode>
      <Token pts={RULE_TO_POLLERS} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={POLLERS.x + 30} y={POLLERS.y + POLLERS.h + 12} dx={pill3Dx} text="pending_manual poller split too" color={T.amber} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="One bot mixed job cards with letters, receipts, hand-offs" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Routing now asks one question: does the user have to act?" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Both pollers apply the same split, stale rules removed" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>@soknad_bot's feed is purely things to act on</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>everything else, one tap away</div>
      </div>
    </AbsoluteFill>
  );
};
