/**
 * FeatureSocialAutopilot — feature p56 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: crafting and scheduling 1-2 LinkedIn/Facebook posts a day cost
 * 30-45 minutes and kept getting deprioritized during deep coding sessions.
 * A daily GitHub Actions cron triggers a TypeScript Edge Function that
 * filters the features table for is_approved=TRUE and a stale or null
 * last_published_at, fills social_post_templates with feature_name and
 * short_description, and publishes via the LinkedIn and Facebook Graph
 * APIs — updating last_published_at afterward so nothing repeats.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const MANUAL = { x: 90, y: 60, w: 300, h: 96 };
const MANUAL_R: Pt = { x: MANUAL.x + MANUAL.w, y: MANUAL.y + MANUAL.h / 2 };

const CRON = { x: 490, y: 60, w: 300, h: 96 };
const CRON_L: Pt = { x: CRON.x, y: CRON.y + CRON.h / 2 };
const CRON_B: Pt = { x: CRON.x + CRON.w / 2, y: CRON.y + CRON.h };

const TEMPLATE = { x: 320, y: 240, w: 340, h: 108 };
const TEMPLATE_T: Pt = { x: TEMPLATE.x + TEMPLATE.w / 2, y: TEMPLATE.y };
const TEMPLATE_R: Pt = { x: TEMPLATE.x + TEMPLATE.w, y: TEMPLATE.y + TEMPLATE.h / 2 };

const APIS = { x: 800, y: 240, w: 300, h: 108 };
const APIS_L: Pt = { x: APIS.x, y: APIS.y + APIS.h / 2 };
const APIS_B: Pt = { x: APIS.x + APIS.w / 2, y: APIS.y + APIS.h };

const DEDUP = { x: 630, y: 420, w: 340, h: 90 };
const DEDUP_T: Pt = { x: DEDUP.x + DEDUP.w / 2, y: DEDUP.y };

export const FeatureSocialAutopilot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 30-45 min/day, deprioritized during coding
  const manualOp = appear(6) * lf;
  const manualLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: daily cron -> Edge Function filters is_approved + last_published_at
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const tB = seg(frame, 168, 192);
  const tBVis = frame >= 168 && frame < 226 ? 1 : 0;
  const cronOp = appear(140, 18) * lf;
  const cronLit = interpolate(frame, [148, 172, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const templateOp = appear(178, 18) * lf;
  const templateLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 196, 218, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: publish, then update last_published_at (dedup)
  const tC = seg(frame, 250, 274);
  const tCVis = frame >= 250 && frame < 320 ? 1 : 0;
  const tD = seg(frame, 284, 308);
  const tDVis = frame >= 284 && frame < 340 ? 1 : 0;
  const apisOp = appear(256, 18) * lf;
  const apisLit = interpolate(frame, [264, 286, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const dedupOp = appear(290, 18) * lf;
  const dedupLit = interpolate(frame, [298, 320, 340, 360], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 296, 318, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [346, 366], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [346, 366], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[MANUAL_R, CRON_L]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[CRON_B, TEMPLATE_T]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[TEMPLATE_R, APIS_L]} color={T.success} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />
      <Connector pts={[APIS_B, DEDUP_T]} color={T.success} width={2.5} progress={tD} opacity={0.8 * tDVis * lf} />

      <SchemaNode {...MANUAL} state="danger" lit={manualLit} opacity={manualOp} label="30-45 min / day" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>deprioritized mid-sprint</div>
      </SchemaNode>
      <Pill x={MANUAL.x + 10} y={MANUAL.y - 46} dx={pill1Dx} text="erratic presence, missed opportunities" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...CRON} state="accent" lit={cronLit} opacity={cronOp} label="Daily GitHub Actions cron" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>is_approved=TRUE, stale last_published_at</div>
      </SchemaNode>
      <Token pts={[MANUAL_R, CRON_L]} t={tA} opacity={tAVis * lf} />

      <SchemaNode {...TEMPLATE} state="accent" lit={templateLit} opacity={templateOp} label="social_post_templates" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>feature_name + short_description</div>
      </SchemaNode>
      <Token pts={[CRON_B, TEMPLATE_T]} t={tB} opacity={tBVis * lf} />
      <Pill x={TEMPLATE.x - 10} y={TEMPLATE.y + TEMPLATE.h + 14} dx={pill2Dx} text="template filled per feature" color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...APIS} state="success" lit={apisLit} opacity={apisOp} label="LinkedIn + Facebook" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>Graph APIs, native publish</div>
      </SchemaNode>
      <Token pts={[TEMPLATE_R, APIS_L]} t={tC} color={T.success} opacity={tCVis * lf} />

      <SchemaNode {...DEDUP} state="success" lit={dedupLit} opacity={dedupOp} label="last_published_at updated" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>no redundant posts</div>
      </SchemaNode>
      <Token pts={[APIS_B, DEDUP_T]} t={tD} color={T.success} opacity={tDVis * lf} />
      <Pill x={DEDUP.x + 20} y={DEDUP.y + DEDUP.h + 14} dx={pill3Dx} text="1-2 features published every weekday" color={T.success} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="30-45 minutes daily, and the chore kept getting skipped" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A cron filters approved features that haven't posted recently" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Templated, published, and marked done — fully autonomous" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>0 min manual work, ~20% more engagement</div>
      </div>
    </AbsoluteFill>
  );
};
