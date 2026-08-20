/**
 * FeatureRoundRobinScraper — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 6 Telegram channels + GH Actions scheduler → INDEX = (minute/10)%6
 * picks ONE channel per run (<90s) → a second run tries to start while the
 * first is still in flight, concurrency guard blocks it (queued, waits) →
 * fast sweep across all 6 channels (full ~60min cycle) → "Zero rate limit hits".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import {
  Bg,
  SchemaNode,
  Connector,
  Token,
  Caption,
  Badge,
  Pill,
  Pt,
  seg,
  loopFade,
  pathPoint,
  fontFamily,
} from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SCHED = { x: 505, y: 90, w: 270, h: 118 };
const SCHED_CX = SCHED.x + SCHED.w / 2; // 640
const SCHED_BOTTOM: Pt = { x: SCHED_CX, y: SCHED.y + SCHED.h }; // 640,208

const CH_XS = [80, 274, 468, 662, 856, 1050];
const CH_Y = 380;
const CH_W = 150;
const CH_H = 92;
const CH = CH_XS.map((x) => ({ x, y: CH_Y, w: CH_W, h: CH_H }));
const CH_CX = CH.map((c) => c.x + c.w / 2);

const HILITE_I = 2; // 3rd channel — the one INDEX picks in beat 2
const BLOCK_I = 4; // channel the blocked 2nd run was heading for

const CH_PATH: Pt[][] = CH_CX.map((cx) => [SCHED_BOTTOM, { x: cx, y: CH_Y }]);
const P_HILITE = CH_PATH[HILITE_I];
const P_BLOCK = CH_PATH[BLOCK_I];
const BLOCK_CAP = 0.42; // 2nd run only gets 42% of the way before it's blocked
const BLOCKED_PT = pathPoint(P_BLOCK, BLOCK_CAP);

export const FeatureRoundRobinScraper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): scheduler + 6 channels appear; formula pill ──
  const schedOpacity = Math.min(1, pop(0)) * lf;
  const schedLit =
    interpolate(frame, [0, 24], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const chOpacity = CH.map((_, i) => appear(14 + i * 12) * lf);
  const chAmbientLit = CH.map((_, i) =>
    interpolate(frame, [14 + i * 12, 14 + i * 12 + 18], [0, 0.1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const formulaIn = seg(frame, 52, 76, Easing.out(Easing.cubic));
  const formulaOp = formulaIn * interpolate(frame, [130, 150], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const formulaDx = (1 - formulaIn) * 60;

  // ── Beat 2 (120–210): token → highlighted channel; "one per run" / "<90s" ──
  const t2 = seg(frame, 124, 168);
  const t2Vis = frame >= 124 && frame < 170 ? 1 : 0;
  const hiliteLit =
    interpolate(frame, [166, 180, 320, 344], [0, 0.9, 0.9, 0.25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  const pill2In = seg(frame, 174, 196, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [300, 332], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 50;
  const cap2In = seg(frame, 182, 202, Easing.out(Easing.cubic));
  const cap2Op = cap2In * interpolate(frame, [200, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (210–330): 2nd run token blocked; queued pill; concurrency caption ──
  const t3Cap = interpolate(frame, [216, 248], [0, BLOCK_CAP], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t3Vis = interpolate(frame, [216, 224, 300, 334], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const xScale = pop(252) * (frame < 334 ? 1 : Math.max(0, interpolate(frame, [320, 334], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))) * lf;
  const pillQIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pillQOp = pillQIn * interpolate(frame, [312, 334], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pillQDx = (1 - pillQIn) * 40;
  const cap3In = seg(frame, 228, 250, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [340, 362], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (330–450): sweep all 6 channels fast; final caption ──
  const sweepLit = CH.map((_, i) => {
    const s = 348 + i * 12;
    return interpolate(frame, [s, s + 8, s + 20], [0, 1, 0.28], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const finalCapIn = seg(frame, 382, 404, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(388) * lf;
  const mtPillIn = seg(frame, 364, 386, Easing.out(Easing.cubic));
  const mtPillOp = mtPillIn * lf;
  const mtPillDx = (1 - mtPillIn) * 40;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {/* Base connectors — scheduler fans out to all 6 channels, always drawn (dim) */}
      {CH_PATH.map((pts, i) => (
        <Connector key={i} pts={pts} opacity={0.35 * Math.min(chOpacity[i], schedOpacity)} />
      ))}

      {/* Beat 2: highlighted travel connector */}
      <Connector pts={P_HILITE} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      {/* Beat 3: blocked 2nd run — capped draw-on, frozen partway */}
      <Connector pts={P_BLOCK} color={T.danger} width={2.5} progress={t3Cap} opacity={0.8 * t3Vis} />

      {/* Scheduler node */}
      <SchemaNode {...SCHED} state="accent" lit={schedLit} opacity={schedOpacity} label="GH Actions scheduler" fontSize={26}>
        <div style={{ fontSize: 15, color: T.muted, fontWeight: 500, marginTop: 2 }}>realtime-scraper.yml</div>
      </SchemaNode>
      <Pill
        x={SCHED.x + 6}
        y={SCHED.y + SCHED.h + 14}
        dx={formulaDx}
        text="INDEX = (minute / 10) % 6"
        color={T.amber}
        opacity={formulaOp}
        fontSize={21}
      />

      {/* 6 channel nodes */}
      {CH.map((c, i) => (
        <SchemaNode
          key={i}
          {...c}
          state={i === HILITE_I ? "accent" : "idle"}
          lit={Math.max(chAmbientLit[i], i === HILITE_I ? hiliteLit : 0, sweepLit[i])}
          opacity={chOpacity[i]}
          label={`CH ${i + 1}`}
          fontSize={24}
        />
      ))}

      {/* Beat 2: token travels to highlighted channel */}
      <Token pts={P_HILITE} t={t2} opacity={t2Vis * lf} />
      <Pill
        x={CH[HILITE_I].x - 22}
        y={CH[HILITE_I].y + CH[HILITE_I].h + 16}
        dx={pill2Dx}
        text="one channel per run"
        color={T.accent}
        opacity={pill2Op}
        fontSize={20}
      />

      {/* Beat 3: 2nd run token, blocked partway, red X, queued pill */}
      <Token pts={P_BLOCK} t={t3Cap} color={T.danger} opacity={t3Vis} />
      <Badge x={BLOCKED_PT.x - 18} y={BLOCKED_PT.y - 44} kind="cross" scale={xScale} opacity={xScale} />
      <Pill
        x={BLOCKED_PT.x - 30}
        y={BLOCKED_PT.y + 14}
        dx={pillQDx}
        text="queued — waiting"
        color={T.danger}
        opacity={pillQOp}
        fontSize={20}
      />

      {/* MTKruto pill, appears late, near scheduler */}
      <Pill
        x={SCHED.x + SCHED.w - 150}
        y={SCHED.y - 42}
        dx={mtPillDx}
        text="MTKruto"
        color={T.muted}
        opacity={mtPillOp}
        fontSize={19}
      />

      {/* Captions (bottom center) */}
      <Caption
        x={90}
        y={648}
        w={1100}
        text="< 90s per run — well inside GitHub's 2-minute timeout"
        color={T.text}
        opacity={cap2Op}
        fontSize={24}
        weight={600}
      />
      <Caption
        x={90}
        y={648}
        w={1100}
        text="concurrency: telegram-scraper · cancel-in-progress: false"
        color={T.danger}
        opacity={cap3}
        fontSize={24}
        weight={600}
      />
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero rate limit hits</div>
      </div>
    </AbsoluteFill>
  );
};
