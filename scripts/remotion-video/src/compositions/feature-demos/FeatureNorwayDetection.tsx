/**
 * FeatureNorwayDetection — feature p47 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 50+ articles/day, a mix of global tech and Norway-specific content
 * that must run Norwegian-first — manually spotting the cues was a constant
 * drain. detect_norway_relevance.ts (Deno Edge Function) queries Azure
 * OpenAI for named entities (Equinor, Oslo, Stortinget, NAV), returning
 * language_suggestion='no' on high confidence, persisted on the article row.
 * The Telegram bot then shows a "Norwegian detected" badge and pre-selects NO.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FEED = { x: 90, y: 90, w: 300, h: 110 };
const FEED_R: Pt = { x: FEED.x + FEED.w, y: FEED.y + FEED.h / 2 };

const DETECT = { x: 490, y: 90, w: 320, h: 120 };
const DETECT_L: Pt = { x: DETECT.x, y: DETECT.y + DETECT.h / 2 };
const DETECT_B: Pt = { x: DETECT.x + DETECT.w / 2, y: DETECT.y + DETECT.h };

const ENTITIES = { x: 490, y: 290, w: 320, h: 100 };
const ENTITIES_T: Pt = { x: ENTITIES.x + ENTITIES.w / 2, y: ENTITIES.y };
const ENTITIES_R: Pt = { x: ENTITIES.x + ENTITIES.w, y: ENTITIES.y + ENTITIES.h / 2 };

const BOT = { x: 930, y: 290, w: 260, h: 100 };
const BOT_L: Pt = { x: BOT.x, y: BOT.y + BOT.h / 2 };

export const FeatureNorwayDetection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 50+ articles/day, subtle Norway signal buried
  const feedOp = appear(6) * lf;
  const feedLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: detect_norway_relevance.ts -> Azure OpenAI -> language_suggestion='no'
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const detectOp = appear(140, 18) * lf;
  const detectLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [216, 236], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: entities checked, Telegram bot badge pre-selects NO
  const tB = seg(frame, 226, 250);
  const tBVis = frame >= 226 && frame < 290 ? 1 : 0;
  const tC = seg(frame, 244, 268);
  const tCVis = frame >= 244 && frame < 306 ? 1 : 0;
  const entitiesOp = appear(232, 18) * lf;
  const entitiesLit = interpolate(frame, [240, 262, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const botOp = appear(250, 18) * lf;
  const botLit = interpolate(frame, [258, 280, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 268, 290, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[FEED_R, DETECT_L]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[DETECT_B, ENTITIES_T]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[ENTITIES_R, BOT_L]} color={T.success} width={2.5} progress={tC} opacity={0.8 * tCVis * lf} />

      <SchemaNode {...FEED} state="danger" lit={feedLit} opacity={feedOp} label="50+ articles / day" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Norway signal buried in the mix</div>
      </SchemaNode>
      <Pill x={FEED.x + 10} y={FEED.y - 46} dx={pill1Dx} text="manual sifting = constant mental drain" color={T.danger} opacity={pill1Op} fontSize={17} />

      <SchemaNode {...DETECT} state="accent" lit={detectLit} opacity={detectOp} label="detect_norway_relevance.ts" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>Deno Edge Fn → Azure OpenAI</div>
      </SchemaNode>
      <Token pts={[FEED_R, DETECT_L]} t={tA} opacity={tAVis * lf} />
      <Pill x={DETECT.x + 10} y={DETECT.y + DETECT.h + 14} dx={pill2Dx} text="language_suggestion = 'no'" color={T.accent} opacity={pill2Op} fontSize={17} />

      <SchemaNode {...ENTITIES} state="amber" lit={entitiesLit} opacity={entitiesOp} label="Equinor · Oslo · Stortinget · NAV" fontSize={15}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>companies · places · policy refs</div>
      </SchemaNode>
      <Token pts={[DETECT_B, ENTITIES_T]} t={tB} color={T.accent} opacity={tBVis * lf} />

      <SchemaNode {...BOT} state="success" lit={botLit} opacity={botOp} label="Telegram bot" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>"Norwegian detected" badge</div>
      </SchemaNode>
      <Token pts={[ENTITIES_R, BOT_L]} t={tC} color={T.success} opacity={tCVis * lf} />
      <Pill x={BOT.x - 20} y={BOT.y + BOT.h + 14} dx={pill3Dx} text="NO pre-selected for the moderator" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Subtle Norway-relevant cues, missed among 50+ articles a day" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="An LLM checks each article for named Norwegian entities" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="High confidence flags the article, streamlining final publishing" color={T.amber} opacity={cap3} fontSize={23} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>~25% flagged, 95%+ accuracy, 15-30 min saved daily</div>
      </div>
    </AbsoluteFill>
  );
};
