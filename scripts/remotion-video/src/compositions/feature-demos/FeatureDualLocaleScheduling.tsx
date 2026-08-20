/**
 * FeatureDualLocaleScheduling — feature p65 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: one global publish time hit two audiences unevenly — 10 AM CET
 * landed at 4 AM in NYC and 10 AM NYC landed at 4 PM in Oslo, half the
 * audience missing peak engagement → posts gained scheduled_at_en and
 * scheduled_at_no (timestampz), each set to true local 10 AM via admin
 * date/time pickers → a daily GitHub Actions cron runs
 * publish-scheduled-posts.ts, flips is_published_X once the local time has
 * passed, and triggers Next.js revalidatePath per locale → 30-40% fewer
 * missed engagement windows.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ONE_SCHEDULE = { x: 350, y: 46, w: 580, h: 106 };
const ONE_SCHEDULE_B: Pt = { x: ONE_SCHEDULE.x + ONE_SCHEDULE.w / 2, y: ONE_SCHEDULE.y + ONE_SCHEDULE.h };

const POSTS = { x: 350, y: 218, w: 580, h: 106 };
const POSTS_T: Pt = { x: POSTS.x + POSTS.w / 2, y: POSTS.y };
const POSTS_B: Pt = { x: POSTS.x + POSTS.w / 2, y: POSTS.y + POSTS.h };

const CRON = { x: 350, y: 390, w: 580, h: 98 };
const CRON_T: Pt = { x: CRON.x + CRON.w / 2, y: CRON.y };

const SCHEDULE_TO_POSTS: Pt[] = [ONE_SCHEDULE_B, POSTS_T];
const POSTS_TO_CRON: Pt[] = [POSTS_B, CRON_T];

export const FeatureDualLocaleScheduling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: one global schedule misses both audiences
  const scheduleOp = pop(6) * lf;
  const scheduleLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: two locale-specific scheduled columns, true local 10 AM
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const postsOp = appear(148, 18) * lf;
  const postsLit = interpolate(frame, [148, 172, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: daily cron flips the flag, revalidates per locale
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const cronOp = appear(268, 18) * lf;
  const cronLit = interpolate(frame, [276, 298, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={SCHEDULE_TO_POSTS} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={POSTS_TO_CRON} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...ONE_SCHEDULE} state="danger" lit={scheduleLit} opacity={scheduleOp} label="Single 10 AM CET post" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>NYC: 4 AM too early · Oslo: 4 PM too late</div>
      </SchemaNode>
      <Pill x={ONE_SCHEDULE.x + 130} y={ONE_SCHEDULE.y + ONE_SCHEDULE.h + 18} text="half the audience misses the window" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...POSTS} state="accent" lit={postsLit} opacity={postsOp} label="scheduled_at_en · scheduled_at_no" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>10 AM America/New_York · 10 AM Europe/Oslo</div>
      </SchemaNode>
      <Token pts={SCHEDULE_TO_POSTS} t={t2} opacity={t2Vis * lf} />
      <Pill x={POSTS.x + 30} y={POSTS.y - 46} text="UTC timestamps set via admin date/time pickers" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...CRON} state="success" lit={cronLit} opacity={cronOp} label="publish-scheduled-posts.ts" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>daily cron · flips is_published_X</div>
      </SchemaNode>
      <Token pts={POSTS_TO_CRON} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={CRON.x + 20} y={CRON.y + CRON.h + 14} text="Next.js revalidatePath, per locale" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="One global time zone means half the audience gets it at the wrong hour" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Each locale stores its own true-local 10 AM as a UTC timestamp" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A daily cron publishes each locale exactly when it's 10 AM there" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>30-40% fewer missed engagement windows</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>10 AM in NYC and Oslo, simultaneously</div>
      </div>
    </AbsoluteFill>
  );
};
