/**
 * FeatureMtkrutoVideo — feature p21 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Telegram Bot API's 20MB wall chokes on the 50-500MB videos flowing
 * from 6 channels → a Deno service built on MTKruto connects as a full
 * MTProto client, bypassing the Bot API to pull files up to 2GB →
 * processAndUploadVideo pushes to YouTube (unlisted, Data API v3) and
 * LinkedIn/Instagram/Facebook Graph APIs, with the heavy lifting offloaded
 * to GitHub Actions to sidestep Edge Function /tmp limits → "100% of
 * video-too-large failures eliminated".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const VIDEOS = { x: 465, y: 56, w: 350, h: 96 };
const VIDEOS_BOTTOM: Pt = { x: VIDEOS.x + VIDEOS.w / 2, y: VIDEOS.y + VIDEOS.h };

const BOTAPI = { x: 465, y: 200, w: 350, h: 80 };
const BOTAPI_BOTTOM: Pt = { x: BOTAPI.x + BOTAPI.w / 2, y: BOTAPI.y + BOTAPI.h };

const MTKRUTO = { x: 465, y: 330, w: 350, h: 96 };
const MTKRUTO_TOP: Pt = { x: MTKRUTO.x + MTKRUTO.w / 2, y: MTKRUTO.y };
const MTKRUTO_BOTTOM: Pt = { x: MTKRUTO.x + MTKRUTO.w / 2, y: MTKRUTO.y + MTKRUTO.h };

const GH = { x: 850, y: 330, w: 280, h: 96 };
const GH_L: Pt = { x: GH.x, y: GH.y + GH.h / 2 };
const MTKRUTO_R: Pt = { x: MTKRUTO.x + MTKRUTO.w, y: MTKRUTO.y + MTKRUTO.h / 2 };

const DESTS = [
  { x: 90, y: 500, w: 190, h: 70, label: "YouTube" },
  { x: 310, y: 500, w: 190, h: 70, label: "LinkedIn" },
  { x: 530, y: 500, w: 190, h: 70, label: "Instagram" },
];

const VIDEOS_TO_BOTAPI: Pt[] = [VIDEOS_BOTTOM, { x: BOTAPI.x + BOTAPI.w / 2, y: BOTAPI.y }];
const MTKRUTO_TO_DESTS: Pt[][] = DESTS.map((d) => [MTKRUTO_BOTTOM, { x: d.x + d.w / 2, y: d.y }]);

export const FeatureMtkrutoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): Bot API's 20MB wall chokes on big videos ──
  const vidOp = appear(6) * lf;
  const vidLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const botOp = appear(20) * lf;
  const botLit = interpolate(frame, [20, 44, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const crossScale = pop(48) * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): MTKruto MTProto bypasses the limit ──
  const mtOp = appear(140, 18) * lf;
  const mtLit = interpolate(frame, [148, 175, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): GitHub Actions offload + fan-out to platforms ──
  const ghOp = appear(244, 16) * lf;
  const ghLit = interpolate(frame, [252, 274, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 300 ? 1 : 0;
  const destOp = DESTS.map((_, i) => appear(268 + i * 10, 14) * lf);
  const t3d = DESTS.map((_, i) => seg(frame, 262 + i * 8, 292 + i * 8));
  const t3dVis = DESTS.map((_, i) => (frame >= 262 + i * 8 && frame < 330 ? 1 : 0));
  const pill3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={VIDEOS_TO_BOTAPI} color={T.danger} width={2} opacity={0.4 * Math.min(vidOp, botOp)} />
      <Connector pts={[BOTAPI_BOTTOM, MTKRUTO_TOP]} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={[MTKRUTO_R, GH_L]} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />
      {MTKRUTO_TO_DESTS.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.success} width={2} progress={t3d[i]} opacity={0.7 * t3dVis[i] * lf} />
      ))}

      <SchemaNode {...VIDEOS} state="danger" lit={vidLit} opacity={vidOp} label="50–500MB+ videos" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>6 Telegram channels</div>
      </SchemaNode>
      <SchemaNode {...BOTAPI} state="danger" lit={botLit} opacity={botOp} label="Bot API — 20MB limit" fontSize={19} />
      <Badge x={BOTAPI.x + BOTAPI.w / 2 - 18} y={BOTAPI.y - 42} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...MTKRUTO} state="accent" lit={mtLit} opacity={mtOp} label="MTKruto — MTProto client" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>up to 2GB, no Bot API wall</div>
      </SchemaNode>
      <Token pts={[BOTAPI_BOTTOM, MTKRUTO_TOP]} t={t2} opacity={t2Vis * lf} />
      <Pill x={MTKRUTO.x + 10} y={MTKRUTO.y - 42} dx={pill2Dx} text="full MTProto client access" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...GH} state="amber" lit={ghLit} opacity={ghOp} label="GitHub Actions" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>sidesteps Edge Function /tmp limits</div>
      </SchemaNode>
      <Token pts={[MTKRUTO_R, GH_L]} t={t3} color={T.amber} opacity={t3Vis * lf} />

      {DESTS.map((d, i) => (
        <SchemaNode key={i} {...d} state="success" lit={0.4 * destOp[i]} opacity={destOp[i]} label={d.label} fontSize={17} />
      ))}
      <Pill x={DESTS[0].x + 10} y={DESTS[0].y + DESTS[0].h + 12} dx={pill3Dx} text="processAndUploadVideo() fans out" color={T.success} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="News videos regularly blew past the Bot API's 20MB ceiling" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="A full MTProto client pulls files up to 2GB" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="GitHub Actions does the heavy lifting off the Edge Function" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>100% of "video too large" failures gone</div>
      </div>
    </AbsoluteFill>
  );
};
