/**
 * FeatureRssTierSystem — feature p44 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 26+ RSS feeds made a noisy mess — critical updates from Reuters and
 * TechCrunch buried under low-quality obscure blogs. NewsMonitorManager adds
 * four color-coded tier columns; sources drag-and-drop between them via
 * Framer Motion. A Supabase monitor-rss-sources Edge Function always fetches
 * Tier 1 first, with decreasing frequency down the tiers, and streams live
 * article previews through Supabase Realtime.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FEEDS = { x: 90, y: 66, w: 280, h: 110 };
const NOISY = { x: 500, y: 66, w: 280, h: 110 };
const FEEDS_R: Pt = { x: FEEDS.x + FEEDS.w, y: FEEDS.y + FEEDS.h / 2 };
const NOISY_L: Pt = { x: NOISY.x, y: NOISY.y + NOISY.h / 2 };

const MANAGER = { x: 465, y: 250, w: 350, h: 120 };
const MANAGER_TOP: Pt = { x: MANAGER.x + MANAGER.w / 2, y: MANAGER.y };
const MANAGER_R: Pt = { x: MANAGER.x + MANAGER.w, y: MANAGER.y + MANAGER.h / 2 };

const FETCH = { x: 870, y: 250, w: 260, h: 130 };
const FETCH_L: Pt = { x: FETCH.x, y: FETCH.y + FETCH.h / 2 };

const REALTIME = { x: 465, y: 430, w: 350, h: 96 };
const REALTIME_TOP: Pt = { x: REALTIME.x + REALTIME.w / 2, y: REALTIME.y };
const MANAGER_BOTTOM: Pt = { x: MANAGER.x + MANAGER.w / 2, y: MANAGER.y + MANAGER.h };

const NOISY_TO_MANAGER: Pt[] = [NOISY_L, { x: NOISY_L.x - 40, y: NOISY_L.y }, MANAGER_TOP];
const MANAGER_TO_FETCH: Pt[] = [MANAGER_R, FETCH_L];
const MANAGER_TO_REALTIME: Pt[] = [MANAGER_BOTTOM, REALTIME_TOP];

export const FeatureRssTierSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 26+ feeds, critical news buried in noise
  const feedsOp = appear(6) * lf;
  const noisyOp = appear(20) * lf;
  const noisyLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: four tier columns, drag-and-drop, Tier 1 fetched first
  const managerOp = appear(140, 18) * lf;
  const fetchOp = appear(158, 18) * lf;
  const managerLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const fetchLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: Realtime previews, decreasing frequency per tier
  const realtimeOp = appear(244, 18) * lf;
  const realtimeLit = interpolate(frame, [252, 274, 330, 350], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={NOISY_TO_MANAGER} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={MANAGER_TO_FETCH} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={MANAGER_TO_REALTIME} color={T.amber} width={2} dashed opacity={0.6 * t3Vis * lf} />

      <SchemaNode {...FEEDS} state="danger" lit={0.2 * lf} opacity={feedsOp} label="26+ RSS feeds" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Reuters buried under blogs</div>
      </SchemaNode>
      <SchemaNode {...NOISY} state="danger" lit={noisyLit} opacity={noisyOp} label="No priority at all" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>same weight, every source</div>
      </SchemaNode>
      <Pill x={NOISY.x + 20} y={NOISY.y - 46} dx={pill1Dx} text="critical news lost in the noise" color={T.danger} opacity={pill1Op} fontSize={18} />

      <SchemaNode {...MANAGER} state="accent" lit={managerLit} opacity={managerOp} label="NewsMonitorManager" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>4 tier columns · drag-and-drop</div>
      </SchemaNode>
      <SchemaNode {...FETCH} state="accent" lit={fetchLit} opacity={fetchOp} label="Tier 1 fetched first" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>lower tiers, decreasing frequency</div>
      </SchemaNode>
      <Token pts={NOISY_TO_MANAGER} t={t2} opacity={t2Vis * lf} />
      <Token pts={MANAGER_TO_FETCH} t={t2b} opacity={t2bVis * lf} />
      <Pill x={MANAGER.x + 10} y={MANAGER.y + MANAGER.h + 14} dx={pill2Dx} text="drag a source between tiers" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...REALTIME} state="amber" lit={realtimeLit} opacity={realtimeOp} label="Live previews, per source" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Supabase Realtime · pre-mod toggle</div>
      </SchemaNode>
      <Pill x={REALTIME.x + 30} y={REALTIME.y + REALTIME.h + 12} dx={pill3Dx} text="new sources start at Tier 4" color={T.amber} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="Everything from every feed carried the same weight" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Four tiers, dragged into place, decide what fetches first" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Sources earn their way up from Tier 4 with consistent quality" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Tier 1 news now surfaces within minutes</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>~70% more efficient, hours of upkeep down to minutes</div>
      </div>
    </AbsoluteFill>
  );
};
