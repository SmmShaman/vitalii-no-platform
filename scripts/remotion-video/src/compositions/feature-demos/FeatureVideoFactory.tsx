/**
 * FeatureVideoFactory — feature p08 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: video gets 5-10x the reach of text, but hand-editing one clip ate
 * 30-60 minutes — unscalable at 5-10 articles/day → generateBroadcastScript
 * (Azure gpt-4-turbo) writes a structured script, Zvukogram Neural TTS adds
 * a voiceover with word-level timestamps, Remotion renders animated
 * subtitles over a blurred background → it fans out to Vertical (Reels/
 * TikTok) and Horizontal (YouTube) templates, with a raw-text fallback if
 * any step fails → "45 min → 3 min, a 93% cut".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ARTICLE = { x: 465, y: 34, w: 350, h: 80 };
const SCRIPT = { x: 80, y: 190, w: 280, h: 96 };
const TTS = { x: 400, y: 190, w: 280, h: 96 };
const REMOTION = { x: 720, y: 190, w: 280, h: 96 };

const VERT = { x: 260, y: 380, w: 260, h: 92 };
const HORZ = { x: 620, y: 380, w: 260, h: 92 };
const FALLBACK = { x: 940, y: 380, w: 260, h: 92 };

const ARTICLE_B: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y + ARTICLE.h };
const SCRIPT_T: Pt = { x: SCRIPT.x + SCRIPT.w / 2, y: SCRIPT.y };
const SCRIPT_R: Pt = { x: SCRIPT.x + SCRIPT.w, y: SCRIPT.y + SCRIPT.h / 2 };
const TTS_L: Pt = { x: TTS.x, y: TTS.y + TTS.h / 2 };
const TTS_R: Pt = { x: TTS.x + TTS.w, y: TTS.y + TTS.h / 2 };
const REMOTION_L: Pt = { x: REMOTION.x, y: REMOTION.y + REMOTION.h / 2 };
const REMOTION_B: Pt = { x: REMOTION.x + REMOTION.w / 2, y: REMOTION.y + REMOTION.h };
const VERT_T: Pt = { x: VERT.x + VERT.w / 2, y: VERT.y };
const HORZ_T: Pt = { x: HORZ.x + HORZ.w / 2, y: HORZ.y };
const FALLBACK_T: Pt = { x: FALLBACK.x + FALLBACK.w / 2, y: FALLBACK.y };

const P_AS: Pt[] = [ARTICLE_B, SCRIPT_T];
const P_ST: Pt[] = [SCRIPT_R, TTS_L];
const P_TR: Pt[] = [TTS_R, REMOTION_L];
const P_RV: Pt[] = [REMOTION_B, { x: REMOTION_B.x, y: 340 }, VERT_T];
const P_RH: Pt[] = [REMOTION_B, HORZ_T];
const P_RF: Pt[] = [REMOTION_B, { x: REMOTION_B.x, y: 340 }, FALLBACK_T];

export const FeatureVideoFactory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): text has reach, but manual video is unscalable ──
  const articleOp = Math.min(1, pop(10)) * lf;
  const articleLit = interpolate(frame, [10, 34, 96, 116], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pillIn = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pillOp = pillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–248): script → TTS voiceover → Remotion render ──
  const tAs = seg(frame, 126, 148);
  const tAsVis = frame >= 126 && frame < 174 ? 1 : 0;
  const scriptOp = appear(128, 18) * lf;
  const scriptLit = interpolate(frame, [136, 158, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tSt = seg(frame, 160, 182);
  const tStVis = frame >= 160 && frame < 208 ? 1 : 0;
  const ttsOp = appear(162, 18) * lf;
  const ttsLit = interpolate(frame, [170, 192, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tTr = seg(frame, 194, 216);
  const tTrVis = frame >= 194 && frame < 240 ? 1 : 0;
  const remotionOp = appear(196, 18) * lf;
  const remotionLit = interpolate(frame, [204, 226, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 166, 188, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [234, 254], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const wordPillIn = seg(frame, 174, 196, Easing.out(Easing.cubic));
  const wordPillOp = wordPillIn * interpolate(frame, [234, 254], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (250–340): fans out to 2 templates, with a fallback net ──
  const tRv = seg(frame, 252, 274);
  const tRvVis = frame >= 252 && frame < 306 ? 1 : 0;
  const tRh = seg(frame, 256, 278);
  const tRhVis = frame >= 256 && frame < 310 ? 1 : 0;
  const tRf = seg(frame, 260, 282);
  const tRfVis = frame >= 260 && frame < 314 ? 1 : 0;
  const vertOp = appear(258, 18) * lf;
  const vertLit = interpolate(frame, [266, 288, 330, 350], [0, 0.7, 0.7, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const horzOp = appear(262, 18) * lf;
  const horzLit = interpolate(frame, [270, 292, 330, 350], [0, 0.7, 0.7, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const fallbackOp = appear(266, 18) * lf;
  const fallbackLit = interpolate(frame, [274, 296, 330, 350], [0, 0.5, 0.5, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_AS} color={T.accent} width={2.5} progress={tAs} opacity={0.8 * tAsVis * lf} />
      <Connector pts={P_ST} color={T.accent} width={2.5} progress={tSt} opacity={0.8 * tStVis * lf} />
      <Connector pts={P_TR} color={T.accent} width={2.5} progress={tTr} opacity={0.8 * tTrVis * lf} />
      <Connector pts={P_RV} color={T.success} width={2.5} progress={tRv} opacity={0.8 * tRvVis * lf} />
      <Connector pts={P_RH} color={T.success} width={2.5} progress={tRh} opacity={0.8 * tRhVis * lf} />
      <Connector pts={P_RF} color={T.amber} width={2} progress={tRf} opacity={0.6 * tRfVis * lf} dashed />

      <SchemaNode {...ARTICLE} state="idle" lit={articleLit} opacity={articleOp} label="Raw article text" fontSize={22} />
      <Badge x={ARTICLE.x + ARTICLE.w / 2 - 18} y={ARTICLE.y + ARTICLE.h + 40} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={ARTICLE.x + 10} y={ARTICLE.y + ARTICLE.h + 78} text="manual video edit: 30-60 min" color={T.danger} opacity={pillOp} fontSize={18} />

      <SchemaNode {...SCRIPT} state="accent" lit={scriptLit} opacity={scriptOp} label="generateBroadcastScript" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Azure gpt-4-turbo</div>
      </SchemaNode>
      <SchemaNode {...TTS} state="accent" lit={ttsLit} opacity={ttsOp} label="Zvukogram Neural TTS" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>word-level timestamps</div>
      </SchemaNode>
      <SchemaNode {...REMOTION} state="accent" lit={remotionLit} opacity={remotionOp} label="Remotion render" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>subtitles · blur · progress bar</div>
      </SchemaNode>
      <Token pts={P_AS} t={tAs} opacity={tAsVis * lf} />
      <Token pts={P_ST} t={tSt} opacity={tStVis * lf} />
      <Token pts={P_TR} t={tTr} opacity={tTrVis * lf} />
      <Pill x={TTS.x + 10} y={TTS.y - 46} text="synced, word-level timestamps" color={T.amber} opacity={wordPillOp} fontSize={16} />

      <SchemaNode {...VERT} state="success" lit={vertLit} opacity={vertOp} label="VerticalVideo.tsx" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>1080×1920 · Reels/TikTok</div>
      </SchemaNode>
      <SchemaNode {...HORZ} state="success" lit={horzLit} opacity={horzOp} label="HorizontalVideo.tsx" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>1920×1080 · YouTube</div>
      </SchemaNode>
      <SchemaNode {...FALLBACK} state="amber" lit={fallbackLit} opacity={fallbackOp} label="fallback: raw text" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>if any step fails</div>
      </SchemaNode>
      <Token pts={P_RV} t={tRv} color={T.success} opacity={tRvVis * lf} />
      <Token pts={P_RH} t={tRh} color={T.success} opacity={tRhVis * lf} />
      <Token pts={P_RF} t={tRf} color={T.amber} opacity={tRfVis * lf} />

      <Caption x={90} y={648} w={1100} text="Video gets 5-10x the reach — but 30-60 minutes to hand-edit, per clip" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Script → neural voiceover → Remotion render, fully automated" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Two formats, one pipeline — and a safe fallback if any step fails" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>45 minutes → 3 minutes — a 93% cut</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Broadcast-quality, consistent branding, every time</div>
      </div>
    </AbsoluteFill>
  );
};
