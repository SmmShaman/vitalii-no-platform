/**
 * FeatureTelegramModeration — feature p18 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 50+ articles/day from 6 Telegram channels + RSS need image, language,
 * and platform decisions → a single telegram-webhook Edge Function handles
 * every inline button via a strict action_prefix_${newsId} pattern, editing
 * the SAME message each step instead of spamming new ones → video posts
 * (videoUrl && videoType) skip the image/language steps entirely and jump
 * straight to publish → "hours to 8 seconds, 4 taps".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FEED = { x: 465, y: 56, w: 350, h: 96 };
const FEED_BOTTOM: Pt = { x: FEED.x + FEED.w / 2, y: FEED.y + FEED.h };

const WEBHOOK = { x: 465, y: 220, w: 350, h: 118 };
const WEBHOOK_TOP: Pt = { x: WEBHOOK.x + WEBHOOK.w / 2, y: WEBHOOK.y };
const WEBHOOK_L: Pt = { x: WEBHOOK.x, y: WEBHOOK.y + WEBHOOK.h / 2 };
const WEBHOOK_R: Pt = { x: WEBHOOK.x + WEBHOOK.w, y: WEBHOOK.y + WEBHOOK.h / 2 };
const WEBHOOK_BOTTOM: Pt = { x: WEBHOOK.x + WEBHOOK.w / 2, y: WEBHOOK.y + WEBHOOK.h };

const STEPS = { x: 90, y: 260, w: 260, h: 78 };
const VIDEO = { x: 930, y: 260, w: 260, h: 78 };

const PUBLISH = { x: 465, y: 450, w: 350, h: 90 };
const PUBLISH_TOP: Pt = { x: PUBLISH.x + PUBLISH.w / 2, y: PUBLISH.y };

const FEED_TO_WEBHOOK: Pt[] = [FEED_BOTTOM, WEBHOOK_TOP];
const WEBHOOK_TO_STEPS: Pt[] = [WEBHOOK_L, { x: STEPS.x + STEPS.w, y: STEPS.y + STEPS.h / 2 }];
const WEBHOOK_TO_VIDEO: Pt[] = [WEBHOOK_R, { x: VIDEO.x, y: VIDEO.y + VIDEO.h / 2 }];
const WEBHOOK_TO_PUBLISH: Pt[] = [WEBHOOK_BOTTOM, PUBLISH_TOP];

export const FeatureTelegramModeration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): 50+/day feed, complex branching ──
  const feedOp = appear(6) * lf;
  const feedLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): telegram-webhook central handler, edits same message ──
  const whOp = appear(140, 18) * lf;
  const whLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const stepsOp = appear(190, 16) * lf;
  const t2b = seg(frame, 192, 216);
  const t2bVis = frame >= 192 && frame < 236 ? 1 : 0;
  const pill2In = seg(frame, 198, 220, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): video posts bypass steps ──
  const videoOp = appear(244, 16) * lf;
  const videoLit = interpolate(frame, [246, 268, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 248, 274);
  const t3Vis = frame >= 248 && frame < 310 ? 1 : 0;
  const pill3In = seg(frame, 256, 278, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const pubOp = appear(280, 18) * lf;
  const pubLit = interpolate(frame, [288, 310, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3b = seg(frame, 290, 316);
  const t3bVis = frame >= 290 && frame < 330 ? 1 : 0;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={FEED_TO_WEBHOOK} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={WEBHOOK_TO_STEPS} color={T.accent} width={2} progress={t2b} opacity={0.7 * t2bVis * lf} />
      <Connector pts={WEBHOOK_TO_VIDEO} color={T.amber} width={2} progress={t3} opacity={0.7 * t3Vis * lf} />
      <Connector pts={WEBHOOK_TO_PUBLISH} color={T.success} width={2.5} progress={t3b} opacity={0.8 * t3bVis * lf} />

      <SchemaNode {...FEED} state="danger" lit={feedLit} opacity={feedOp} label="6 channels + RSS feeds" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>50+ articles / day</div>
      </SchemaNode>
      <Pill x={FEED.x + 40} y={FEED.y + FEED.h + 14} dx={pill1Dx} text="image · language · platform decisions" color={T.danger} opacity={pill1Op} fontSize={17} />

      <SchemaNode {...WEBHOOK} state="accent" lit={whLit} opacity={whOp} label="telegram-webhook" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>action_prefix_${"{"}newsId{"}"}</div>
      </SchemaNode>
      <Token pts={FEED_TO_WEBHOOK} t={t2} opacity={t2Vis * lf} />
      <Pill x={WEBHOOK.x + 10} y={WEBHOOK.y - 46} dx={pill2Dx} text="edits the SAME message every step" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...STEPS} state="accent" lit={0.4 * stepsOp} opacity={stepsOp} label="image → lang → platform" fontSize={16} />
      <Token pts={WEBHOOK_TO_STEPS} t={t2b} opacity={t2bVis * lf} />

      <SchemaNode {...VIDEO} state="amber" lit={videoLit} opacity={videoOp} label="videoUrl && videoType" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>skips straight to publish</div>
      </SchemaNode>
      <Token pts={WEBHOOK_TO_VIDEO} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={VIDEO.x - 20} y={VIDEO.y + VIDEO.h + 12} dx={pill3Dx} text="processed_image_url > image_url > null" color={T.amber} opacity={pill3Op} fontSize={15} />

      <SchemaNode {...PUBLISH} state="success" lit={pubLit} opacity={pubOp} label="Publish options" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>LinkedIn · Instagram · Facebook</div>
      </SchemaNode>
      <Token pts={WEBHOOK_TO_PUBLISH} t={t3b} color={T.success} opacity={t3bVis * lf} />

      <Caption x={90} y={648} w={1100} text="Complex branching by image, language, and platform, by hand" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="One handler, one message, edited step by step" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Video posts skip straight to publish — no wasted steps" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Hours to 8 seconds, 4 taps per article</div>
      </div>
    </AbsoluteFill>
  );
};
