/**
 * FeatureTenTabDashboard — feature p43 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: managing content solo across 5-7 platforms (Telegram, Supabase,
 * GitHub, social media, AI tools) meant constant app-hopping — 30-60 minutes
 * lost daily. A Next.js/React SPA backed by Supabase consolidates it into
 * 10 lazy-loaded tabs, each its own component (Overview, Queue, News/Blog,
 * Monitor, Social, Analytics, Skills, Settings), keeping data fetches
 * modular instead of monolithic. Daily switching drops to virtually zero.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PLATFORMS = { x: 90, y: 66, w: 280, h: 110 };
const LOST = { x: 500, y: 66, w: 280, h: 110 };
const PLATFORMS_R: Pt = { x: PLATFORMS.x + PLATFORMS.w, y: PLATFORMS.y + PLATFORMS.h / 2 };
const LOST_L: Pt = { x: LOST.x, y: LOST.y + LOST.h / 2 };

const DASH = { x: 465, y: 250, w: 350, h: 120 };
const DASH_TOP: Pt = { x: DASH.x + DASH.w / 2, y: DASH.y };
const DASH_R: Pt = { x: DASH.x + DASH.w, y: DASH.y + DASH.h / 2 };

const TABS = { x: 870, y: 250, w: 260, h: 130 };
const TABS_L: Pt = { x: TABS.x, y: TABS.y + TABS.h / 2 };

const MODULAR = { x: 465, y: 430, w: 350, h: 96 };
const MODULAR_TOP: Pt = { x: MODULAR.x + MODULAR.w / 2, y: MODULAR.y };
const DASH_BOTTOM: Pt = { x: DASH.x + DASH.w / 2, y: DASH.y + DASH.h };

const LOST_TO_DASH: Pt[] = [LOST_L, { x: LOST_L.x - 40, y: LOST_L.y }, DASH_TOP];
const DASH_TO_TABS: Pt[] = [DASH_R, TABS_L];
const DASH_TO_MODULAR: Pt[] = [DASH_BOTTOM, MODULAR_TOP];

export const FeatureTenTabDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 5-7 platforms, constant app-hopping
  const platformsOp = appear(6) * lf;
  const lostOp = appear(20) * lf;
  const lostLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: one SPA, 10 lazy-loaded tabs
  const dashOp = appear(140, 18) * lf;
  const tabsOp = appear(158, 18) * lf;
  const dashLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const tabsLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: modularity prevents monolithic fetches
  const modularOp = appear(244, 18) * lf;
  const modularLit = interpolate(frame, [252, 274, 330, 350], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={LOST_TO_DASH} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={DASH_TO_TABS} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={DASH_TO_MODULAR} color={T.amber} width={2} dashed opacity={0.6 * t3Vis * lf} />

      <SchemaNode {...PLATFORMS} state="danger" lit={0.2 * lf} opacity={platformsOp} label="5–7 platforms" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Telegram · Supabase · GitHub · social</div>
      </SchemaNode>
      <SchemaNode {...LOST} state="danger" lit={lostLit} opacity={lostOp} label="30–60 min lost, daily" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>constant context switching</div>
      </SchemaNode>
      <Pill x={LOST.x + 30} y={LOST.y - 46} dx={pill1Dx} text="focus broken, app after app" color={T.danger} opacity={pill1Op} fontSize={18} />

      <SchemaNode {...DASH} state="accent" lit={dashLit} opacity={dashOp} label="One 10-tab dashboard" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Next.js / React SPA · Supabase</div>
      </SchemaNode>
      <SchemaNode {...TABS} state="accent" lit={tabsLit} opacity={tabsOp} label="Lazy-loaded tabs" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>Overview · Queue · Monitor · Social · Analytics</div>
      </SchemaNode>
      <Token pts={LOST_TO_DASH} t={t2} opacity={t2Vis * lf} />
      <Token pts={DASH_TO_TABS} t={t2b} opacity={t2bVis * lf} />
      <Pill x={DASH.x + 20} y={DASH.y + DASH.h + 14} dx={pill2Dx} text="each tab, its own component" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...MODULAR} state="amber" lit={modularLit} opacity={modularOp} label="Modular, not monolithic" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>each tab fetches only its own data</div>
      </SchemaNode>
      <Pill x={MODULAR.x + 40} y={MODULAR.y + MODULAR.h + 12} dx={pill3Dx} text="Settings alone holds 9 sub-tabs" color={T.amber} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="Every task meant hopping between five or more separate tools" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="One SPA, ten dedicated tabs, backed by a single Supabase project" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Each tab loads and fetches independently, on demand" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>morning routine: 5–7 tools down to 15 minutes</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>10+ app switches a day, down to virtually zero</div>
      </div>
    </AbsoluteFill>
  );
};
