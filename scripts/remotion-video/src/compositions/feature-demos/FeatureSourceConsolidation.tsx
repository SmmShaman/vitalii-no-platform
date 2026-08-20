/**
 * FeatureSourceConsolidation — feature p22 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 6 Telegram channels + 26 RSS feeds, each with its own format and
 * schedule, meant a manual sifting grind every day → realtime-scraper.yml
 * round-robins the Telegram channels every 10 minutes, rss-monitor-v2.yml
 * batches the 26 feeds (8 sources × 4 batches) every 30 minutes, both
 * funnel into pre-moderate-news for AI filtering → everything lands in one
 * Telegram queue, all 32 sources configured no-code in news_sources → "32
 * sources, one queue, zero rate-limit hits".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TG = { x: 130, y: 60, w: 260, h: 90 };
const RSS = { x: 890, y: 60, w: 260, h: 90 };
const TG_BOTTOM: Pt = { x: TG.x + TG.w / 2, y: TG.y + TG.h };
const RSS_BOTTOM: Pt = { x: RSS.x + RSS.w / 2, y: RSS.y + RSS.h };

const SCRAPER = { x: 90, y: 220, w: 300, h: 100 };
const RSSMON = { x: 890, y: 220, w: 300, h: 100 };
const SCRAPER_BOTTOM: Pt = { x: SCRAPER.x + SCRAPER.w / 2, y: SCRAPER.y + SCRAPER.h };
const RSSMON_BOTTOM: Pt = { x: RSSMON.x + RSSMON.w / 2, y: RSSMON.y + RSSMON.h };
const SCRAPER_TOP: Pt = { x: SCRAPER.x + SCRAPER.w / 2, y: SCRAPER.y };
const RSSMON_TOP: Pt = { x: RSSMON.x + RSSMON.w / 2, y: RSSMON.y };

const MOD = { x: 465, y: 380, w: 350, h: 96 };
const MOD_TOP: Pt = { x: MOD.x + MOD.w / 2, y: MOD.y };
const MOD_BOTTOM: Pt = { x: MOD.x + MOD.w / 2, y: MOD.y + MOD.h };

const QUEUE = { x: 465, y: 540, w: 350, h: 80 };
const QUEUE_TOP: Pt = { x: QUEUE.x + QUEUE.w / 2, y: QUEUE.y };

export const FeatureSourceConsolidation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): 32 disparate sources, manual sifting ──
  const tgOp = appear(6) * lf;
  const rssOp = appear(6) * lf;
  const srcLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): realtime-scraper.yml + rss-monitor-v2.yml ──
  const scOp = appear(140, 18) * lf;
  const rmOp = appear(140, 18) * lf;
  const scLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2a = seg(frame, 150, 178);
  const t2aVis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 150, 178);
  const t2bVis = frame >= 150 && frame < 214 ? 1 : 0;
  const pill2aIn = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2aOp = pill2aIn * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2aDx = (1 - pill2aIn) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): both funnel into pre-moderate-news ──
  const modOp = appear(244, 18) * lf;
  const modLit = interpolate(frame, [252, 274, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3a = seg(frame, 254, 282);
  const t3aVis = frame >= 254 && frame < 316 ? 1 : 0;
  const t3b = seg(frame, 254, 282);
  const t3bVis = frame >= 254 && frame < 316 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const queueOp = appear(290, 16) * lf;
  const queueLit = interpolate(frame, [298, 320, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3c = seg(frame, 292, 316);
  const t3cVis = frame >= 292 && frame < 330 ? 1 : 0;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[TG_BOTTOM, SCRAPER_TOP]} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={[RSS_BOTTOM, RSSMON_TOP]} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={[SCRAPER_BOTTOM, MOD_TOP]} color={T.accent} width={2.5} progress={t3a} opacity={0.8 * t3aVis * lf} />
      <Connector pts={[RSSMON_BOTTOM, MOD_TOP]} color={T.accent} width={2.5} progress={t3b} opacity={0.8 * t3bVis * lf} />
      <Connector pts={[MOD_BOTTOM, QUEUE_TOP]} color={T.success} width={2.5} progress={t3c} opacity={0.8 * t3cVis * lf} />

      <SchemaNode {...TG} state="danger" lit={srcLit} opacity={tgOp} label="6 Telegram channels" fontSize={19} />
      <SchemaNode {...RSS} state="danger" lit={srcLit} opacity={rssOp} label="26 RSS feeds" fontSize={19} />
      <Pill x={TG.x + 10} y={TG.y + TG.h + 12} dx={pill1Dx} text="32 sources, one at a time" color={T.danger} opacity={pill1Op} fontSize={17} />

      <SchemaNode {...SCRAPER} state="accent" lit={scLit} opacity={scOp} label="realtime-scraper.yml" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>round-robin, every 10 min</div>
      </SchemaNode>
      <SchemaNode {...RSSMON} state="accent" lit={scLit} opacity={rmOp} label="rss-monitor-v2.yml" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>8/batch × 4, every 30 min</div>
      </SchemaNode>
      <Token pts={[TG_BOTTOM, SCRAPER_TOP]} t={t2a} opacity={t2aVis * lf} />
      <Token pts={[RSS_BOTTOM, RSSMON_TOP]} t={t2b} opacity={t2bVis * lf} />
      <Pill x={SCRAPER.x + 10} y={SCRAPER.y + SCRAPER.h + 12} dx={pill2aDx} text="respects Telegram rate limits" color={T.accent} opacity={pill2aOp} fontSize={16} />

      <SchemaNode {...MOD} state="accent" lit={modLit} opacity={modOp} label="pre-moderate-news" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>AI filtering, one funnel</div>
      </SchemaNode>
      <Token pts={[SCRAPER_BOTTOM, MOD_TOP]} t={t3a} opacity={t3aVis * lf} />
      <Token pts={[RSSMON_BOTTOM, MOD_TOP]} t={t3b} opacity={t3bVis * lf} />
      <Pill x={MOD.x + 20} y={MOD.y - 44} dx={pill3Dx} text="news_sources — all 32, no-code" color={T.accent} opacity={pill3Op} fontSize={17} />

      <SchemaNode {...QUEUE} state="success" lit={queueLit} opacity={queueOp} label="1 Telegram moderation queue" fontSize={19} />
      <Token pts={[MOD_BOTTOM, QUEUE_TOP]} t={t3c} color={T.success} opacity={t3cVis * lf} />

      <Caption x={90} y={648} w={1100} text="32 sources, 32 formats, 32 reasons to lose track" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Two scheduled workflows do the pulling, on their own cadence" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every source funnels into the same AI filter and queue" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 645,
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
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: T.success,
            color: "#12321c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 19,
            fontWeight: 700,
            transform: `scale(${finalCheck})`,
            boxShadow: `0 0 16px ${hexA(T.success, 0.5)}`,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, color: T.success }}>32 sources, 1 queue, zero rate-limit hits</div>
      </div>
    </AbsoluteFill>
  );
};
