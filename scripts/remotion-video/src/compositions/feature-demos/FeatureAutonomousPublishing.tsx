/**
 * FeatureAutonomousPublishing — feature p20 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: even after moderation, each article needed 4 manual actions —
 * image gen, 3-language rewrite, site publish, social post — 40-60 taps a
 * day at peak → auto-publish-news orchestrates the whole chain: DALL-E 3
 * image → Claude 3 Haiku rewrite (EN/NO/UA) → website publish → 4-platform
 * social post, while schedule-publisher enforces timing windows and rate
 * limits via source_config → "15 minutes to 2 minutes, an 87% cut, role
 * shifted to exception reviewer".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TAPS = { x: 465, y: 56, w: 350, h: 96 };
const TAPS_BOTTOM: Pt = { x: TAPS.x + TAPS.w / 2, y: TAPS.y + TAPS.h };

const ORCH = { x: 465, y: 220, w: 350, h: 100 };
const ORCH_TOP: Pt = { x: ORCH.x + ORCH.w / 2, y: ORCH.y };
const ORCH_BOTTOM: Pt = { x: ORCH.x + ORCH.w / 2, y: ORCH.y + ORCH.h };

const CHAIN = [
  { x: 60, y: 400, w: 190, h: 76, label: "DALL-E 3" },
  { x: 280, y: 400, w: 190, h: 76, label: "Claude 3 Haiku" },
  { x: 500, y: 400, w: 190, h: 76, label: "Website" },
  { x: 720, y: 400, w: 190, h: 76, label: "Social ×4" },
];

const SCHED = { x: 940, y: 220, w: 260, h: 100 };
const SCHED_L: Pt = { x: SCHED.x, y: SCHED.y + SCHED.h / 2 };
const ORCH_R: Pt = { x: ORCH.x + ORCH.w, y: ORCH.y + ORCH.h / 2 };

const TAPS_TO_ORCH: Pt[] = [TAPS_BOTTOM, ORCH_TOP];
const ORCH_TO_SCHED: Pt[] = [ORCH_R, SCHED_L];

export const FeatureAutonomousPublishing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): 40+ manual taps, 4 actions ──
  const tapsOp = appear(6) * lf;
  const tapsLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–260): auto-publish-news orchestrates the chain ──
  const orchOp = appear(140, 18) * lf;
  const orchLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 200 ? 1 : 0;
  const chainOp = CHAIN.map((_, i) => appear(196 + i * 12, 14) * lf);
  const chainConnOp = CHAIN.slice(0, -1).map((_, i) => 0.4 * Math.min(chainOp[i], chainOp[i + 1]));
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (260–340): schedule-publisher enforces windows + rate limits ──
  const schedOp = appear(268, 16) * lf;
  const schedLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 270, 296);
  const t3Vis = frame >= 270 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 278, 300, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 282, 304, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={TAPS_TO_ORCH} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={ORCH_TO_SCHED} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />
      {CHAIN.slice(0, -1).map((c, i) => (
        <Connector key={i} pts={[{ x: c.x + c.w, y: c.y + c.h / 2 }, { x: CHAIN[i + 1].x, y: CHAIN[i + 1].y + CHAIN[i + 1].h / 2 }]} color={T.success} width={2} opacity={chainConnOp[i]} />
      ))}

      <SchemaNode {...TAPS} state="danger" lit={tapsLit} opacity={tapsOp} label="40-60 taps / day" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>image · rewrite × 3 · publish · post</div>
      </SchemaNode>
      <Pill x={TAPS.x + 30} y={TAPS.y + TAPS.h + 14} dx={pill1Dx} text="4 manual actions, every article" color={T.danger} opacity={pill1Op} fontSize={18} />

      <SchemaNode {...ORCH} state="accent" lit={orchLit} opacity={orchOp} label="auto-publish-news" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>orchestrates the full chain</div>
      </SchemaNode>
      <Token pts={TAPS_TO_ORCH} t={t2} opacity={t2Vis * lf} />

      {CHAIN.map((c, i) => (
        <SchemaNode key={i} {...c} state="success" lit={0.4 * chainOp[i]} opacity={chainOp[i]} label={c.label} fontSize={17} />
      ))}

      <SchemaNode {...SCHED} state="amber" lit={schedLit} opacity={schedOp} label="schedule-publisher" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>windows · cadence · rate limits</div>
      </SchemaNode>
      <Token pts={ORCH_TO_SCHED} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={SCHED.x + 10} y={SCHED.y + SCHED.h + 14} dx={pill3Dx} text="source_config — per-source toggles" color={T.amber} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="Image, rewrite, publish, post — four taps per article" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="One function chains every step automatically" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Timing windows and per-source toggles keep it controlled" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>15 minutes to 2 minutes — 87% faster</div>
      </div>
    </AbsoluteFill>
  );
};
