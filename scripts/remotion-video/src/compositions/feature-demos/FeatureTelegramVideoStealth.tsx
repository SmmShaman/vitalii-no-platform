/**
 * FeatureTelegramVideoStealth — feature p64 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: sending a video URL via Telegram's sendMessage always triggered an
 * unwanted preview message first, forcing manual deletion on 5-10 videos a
 * day → publishVideoToTelegram was refactored so telegram_publisher.ts calls
 * the Bot API's sendVideo directly with the file_id/URL and caption, from
 * the outset → a single clean post, no preview to clean up → review time
 * per video drops from 30-60s to 0, 5-10 minutes saved daily.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SENDMSG = { x: 90, y: 56, w: 300, h: 90 };
const SENDMSG_R: Pt = { x: SENDMSG.x + SENDMSG.w, y: SENDMSG.y + SENDMSG.h / 2 };

const PREVIEW = { x: 500, y: 56, w: 300, h: 90 };
const PREVIEW_L: Pt = { x: PREVIEW.x, y: PREVIEW.y + PREVIEW.h / 2 };

const FUNC = { x: 250, y: 240, w: 360, h: 96 };
const FUNC_R: Pt = { x: FUNC.x + FUNC.w, y: FUNC.y + FUNC.h / 2 };
const FUNC_B: Pt = { x: FUNC.x + FUNC.w / 2, y: FUNC.y + FUNC.h };

const SENDVIDEO = { x: 700, y: 240, w: 300, h: 96 };
const SENDVIDEO_L: Pt = { x: SENDVIDEO.x, y: SENDVIDEO.y + SENDVIDEO.h / 2 };
const SENDVIDEO_B: Pt = { x: SENDVIDEO.x + SENDVIDEO.w / 2, y: SENDVIDEO.y + SENDVIDEO.h };

const CLEAN = { x: 420, y: 400, w: 400, h: 90 };
const CLEAN_T: Pt = { x: CLEAN.x + CLEAN.w / 2, y: CLEAN.y };

const SENDMSG_TO_PREVIEW: Pt[] = [SENDMSG_R, PREVIEW_L];
const FUNC_TO_SENDVIDEO: Pt[] = [FUNC_R, SENDVIDEO_L];
const SENDVIDEO_TO_CLEAN: Pt[] = [SENDVIDEO_B, { x: SENDVIDEO_B.x, y: 360 }, CLEAN_T];

export const FeatureTelegramVideoStealth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: sendMessage(videoURL) always triggers a preview first
  const sendmsgOp = pop(6) * lf;
  const sendmsgLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1 = seg(frame, 24, 48);
  const t1Vis = frame >= 24 && frame < 70 ? 1 : 0;
  const previewOp = appear(30, 18) * lf;
  const previewLit = interpolate(frame, [36, 58, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: refactor calls sendVideo directly
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const funcOp = appear(148, 18) * lf;
  const funcLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const sendvideoOp = appear(184, 18) * lf;
  const sendvideoLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: single clean post from the outset
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const cleanOp = appear(268, 18) * lf;
  const cleanLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={SENDMSG_TO_PREVIEW} color={T.danger} width={2.5} progress={t1} opacity={0.8 * t1Vis * lf} />
      <Connector pts={FUNC_TO_SENDVIDEO} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={SENDVIDEO_TO_CLEAN} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...SENDMSG} state="danger" lit={sendmsgLit} opacity={sendmsgOp} label="sendMessage(videoURL)" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>5-10 videos/day</div>
      </SchemaNode>
      <SchemaNode {...PREVIEW} state="danger" lit={previewLit} opacity={previewOp} label="Preview lands first" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>manual delete, every time</div>
      </SchemaNode>
      <Token pts={SENDMSG_TO_PREVIEW} t={t1} color={T.danger} opacity={t1Vis * lf} />
      <Badge x={PREVIEW.x + PREVIEW.w - 20} y={PREVIEW.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />

      <SchemaNode {...FUNC} state="accent" lit={funcLit} opacity={funcOp} label="publishVideoToTelegram()" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>telegram_publisher.ts</div>
      </SchemaNode>
      <SchemaNode {...SENDVIDEO} state="accent" lit={sendvideoLit} opacity={sendvideoOp} label="Bot API sendVideo" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>file_id/URL + caption</div>
      </SchemaNode>
      <Token pts={FUNC_TO_SENDVIDEO} t={t2} opacity={t2Vis * lf} />
      <Pill x={FUNC.x + 10} y={FUNC.y - 46} text="bypasses the intermediate preview" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...CLEAN} state="success" lit={cleanLit} opacity={cleanOp} label="Single clean video post" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>feed integrity preserved</div>
      </SchemaNode>
      <Token pts={SENDVIDEO_TO_CLEAN} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={CLEAN.x + 20} y={CLEAN.y + CLEAN.h + 14} text="fire and forget, as intended" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A URL always triggers Telegram's preview — deleted by hand, every post" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="publishVideoToTelegram now calls sendVideo directly, no URL preview" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="One clean video message lands, nothing left to clean up after" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>30-60s → 0 review time · 5-10 min/day saved</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>100% of preview spam eliminated</div>
      </div>
    </AbsoluteFill>
  );
};
