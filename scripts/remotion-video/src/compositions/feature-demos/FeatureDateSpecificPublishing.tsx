/**
 * FeatureDateSpecificPublishing — feature p67 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: send-top-social only ever gathered and published content for
 * "today" — a missed day couldn't be corrected, gaps couldn't be backfilled,
 * future content couldn't be pre-staged out of sequence → a targetDate
 * parameter was added to the function, overriding the default 'today'
 * behavior so it gathers and publishes content relevant to any precise
 * date passed in → significantly more control: re-run a past date, fill a
 * gap, or pre-stage a future one.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TODAY_ONLY = { x: 150, y: 56, w: 380, h: 90 };
const TODAY_ONLY_R: Pt = { x: TODAY_ONLY.x + TODAY_ONLY.w, y: TODAY_ONLY.y + TODAY_ONLY.h / 2 };

const GAP = { x: 650, y: 56, w: 380, h: 90 };
const GAP_L: Pt = { x: GAP.x, y: GAP.y + GAP.h / 2 };

const PARAM = { x: 150, y: 240, w: 380, h: 96 };
const PARAM_R: Pt = { x: PARAM.x + PARAM.w, y: PARAM.y + PARAM.h / 2 };
const PARAM_B: Pt = { x: PARAM.x + PARAM.w / 2, y: PARAM.y + PARAM.h };

const OVERRIDE = { x: 650, y: 240, w: 380, h: 96 };
const OVERRIDE_L: Pt = { x: OVERRIDE.x, y: OVERRIDE.y + OVERRIDE.h / 2 };
const OVERRIDE_B: Pt = { x: OVERRIDE.x + OVERRIDE.w / 2, y: OVERRIDE.y + OVERRIDE.h };

const CALENDAR = { x: 380, y: 410, w: 440, h: 92 };
const CALENDAR_T: Pt = { x: CALENDAR.x + CALENDAR.w / 2, y: CALENDAR.y };

const TODAY_TO_GAP: Pt[] = [TODAY_ONLY_R, GAP_L];
const PARAM_TO_OVERRIDE: Pt[] = [PARAM_R, OVERRIDE_L];
const OVERRIDE_TO_CALENDAR: Pt[] = [OVERRIDE_B, { x: OVERRIDE_B.x, y: 370 }, CALENDAR_T];

export const FeatureDateSpecificPublishing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: hardcoded to "today" — a missed day is gone for good
  const todayOp = pop(6) * lf;
  const todayLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1 = seg(frame, 24, 48);
  const t1Vis = frame >= 24 && frame < 70 ? 1 : 0;
  const gapOp = appear(30, 18) * lf;
  const gapLit = interpolate(frame, [36, 58, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: targetDate parameter overrides "today"
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const paramOp = appear(148, 18) * lf;
  const paramLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const overrideOp = appear(184, 18) * lf;
  const overrideLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: any precise date — backfill, gap-fill, pre-stage
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const calOp = appear(268, 18) * lf;
  const calLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={TODAY_TO_GAP} color={T.danger} width={2.5} progress={t1} opacity={0.8 * t1Vis * lf} />
      <Connector pts={PARAM_TO_OVERRIDE} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={OVERRIDE_TO_CALENDAR} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...TODAY_ONLY} state="danger" lit={todayLit} opacity={todayOp} label="send-top-social()" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>hardcoded to "today" only</div>
      </SchemaNode>
      <SchemaNode {...GAP} state="danger" lit={gapLit} opacity={gapOp} label="Missed day, gone for good" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>no backfill, no re-run</div>
      </SchemaNode>
      <Token pts={TODAY_TO_GAP} t={t1} color={T.danger} opacity={t1Vis * lf} />
      <Badge x={GAP.x + GAP.w - 20} y={GAP.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />

      <SchemaNode {...PARAM} state="accent" lit={paramLit} opacity={paramOp} label="send-top-social(targetDate)" fontSize={17}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>new optional parameter</div>
      </SchemaNode>
      <SchemaNode {...OVERRIDE} state="accent" lit={overrideLit} opacity={overrideOp} label="Overrides default 'today'" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>gathers content for that date</div>
      </SchemaNode>
      <Token pts={PARAM_TO_OVERRIDE} t={t2} opacity={t2Vis * lf} />
      <Pill x={PARAM.x + 10} y={PARAM.y - 46} text="same function, one new switch" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...CALENDAR} state="success" lit={calLit} opacity={calOp} label="Any date: past, present, future" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>backfill · gap-fill · pre-stage</div>
      </SchemaNode>
      <Token pts={OVERRIDE_TO_CALENDAR} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={CALENDAR.x + 30} y={CALENDAR.y + CALENDAR.h + 14} text="content out of sequence, on demand" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Publishing only ever ran for today — a missed day just stayed missed" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A targetDate parameter lets the same function target any precise date" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Re-run a past date, fill a gap, or stage a future one — all on demand" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>No longer locked to "today"</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>comprehensive, accurate social presence</div>
      </div>
    </AbsoluteFill>
  );
};
