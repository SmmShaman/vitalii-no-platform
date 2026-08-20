/**
 * FeatureFinnkodeRegex — feature j13 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: FINN.no job URLs come in 20+ shapes and finnkode is the only ID
 * that matters → extractFinnkode() cascades through 5 regex patterns in
 * priority order (miss, then hit), with a Cheerio data-finnkode fallback
 * behind it → the intuitive apply URL /job/apply/XXXXX 404s — the real one
 * is /job/apply?adId=XXXXX → 100% extraction across 2000+ test URLs, zero
 * lost applications.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const URLIN = { x: 440, y: 30, w: 400, h: 80 };
const REGEX = [
  { x: 40, y: 160, w: 220, h: 70, label: "?finnkode=(\\d+)" },
  { x: 285, y: 160, w: 220, h: 70, label: "/job/\\d+" },
  { x: 530, y: 160, w: 220, h: 70, label: "/ad/\\d+.html" },
  { x: 775, y: 160, w: 220, h: 70, label: "/\\d+$" },
  { x: 1020, y: 160, w: 220, h: 70, label: "/job/.../(\\d+)" },
];
const APPLY = [
  { x: 140, y: 330, w: 460, h: 90, label: "finn.no/job/apply/XXXXX" },
  { x: 680, y: 330, w: 460, h: 90, label: "finn.no/job/apply?adId=XXXXX" },
];

const URLIN_B: Pt = { x: URLIN.x + URLIN.w / 2, y: URLIN.y + URLIN.h };
const RX_T: Pt[] = REGEX.map((r) => ({ x: r.x + r.w / 2, y: r.y }));
const P_URLIN_RX: Pt[][] = RX_T.map((r) => [URLIN_B, r]);
const RX1_B: Pt = { x: REGEX[1].x + REGEX[1].w / 2, y: REGEX[1].y + REGEX[1].h };
const APPLY_T: Pt[] = APPLY.map((a) => ({ x: a.x + a.w / 2, y: a.y }));
const P_RX1_APPLY: Pt[][] = APPLY_T.map((a) => [RX1_B, a]);

export const FeatureFinnkodeRegex: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–110): 20+ URL shapes, finnkode is the only thing that matters ──
  const urlOp = Math.min(1, pop(4)) * lf;
  const urlLit = interpolate(frame, [4, 26, 88, 108], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;
  const chaosPillIn = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const chaosPillOp = chaosPillIn * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 2 (116–246): cascading regex — miss, then hit ──
  const rxOp = REGEX.map((_, i) => appear(116 + i * 6, 14) * lf);
  const rxAmbientLit = REGEX.map((_, i) => 0.12 * lf);
  const tRx0 = seg(frame, 128, 150);
  const tRx0Vis = frame >= 128 && frame < 170 ? 1 : 0;
  const xScale0 = pop(154) * interpolate(frame, [200, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tRx1 = seg(frame, 172, 194);
  const tRx1Vis = frame >= 172 && frame < 330 ? 1 : 0;
  const rx1Lit = interpolate(frame, [186, 208, 330, 350], [0, 0.85, 0.85, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const checkScale1 = pop(198) * lf;
  const cap2In = seg(frame, 132, 154, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const cheerioPillIn = seg(frame, 214, 236, Easing.out(Easing.cubic));
  const cheerioPillOp = cheerioPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (250–352): the correct apply URL discovery ──
  const t3a0 = seg(frame, 254, 276);
  const t3a0Vis = frame >= 254 && frame < 330 ? 1 : 0;
  const app0Op = appear(258, 18) * lf;
  const app0Lit = interpolate(frame, [266, 288, 330, 350], [0, 0.55, 0.55, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const xScale3 = pop(292) * interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3a1 = seg(frame, 266, 288);
  const t3a1Vis = frame >= 266 && frame < 330 ? 1 : 0;
  const app1Op = appear(270, 18) * lf;
  const app1Lit = interpolate(frame, [278, 300, 330, 350], [0, 0.8, 0.8, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const checkScale3 = pop(304) * lf;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (360–450): result ──
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;
  const metricOp = seg(frame, 366, 388, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {P_URLIN_RX.map((pts, i) => (
        <Connector
          key={i}
          pts={pts}
          color={i === 0 ? T.danger : i === 1 ? T.success : T.border}
          width={2}
          progress={i === 0 ? tRx0 : i === 1 ? tRx1 : 1}
          opacity={i === 0 ? 0.8 * tRx0Vis * lf : i === 1 ? 0.8 * tRx1Vis * lf : 0.18 * rxOp[i]}
        />
      ))}
      {P_RX1_APPLY.map((pts, i) => (
        <Connector
          key={i}
          pts={pts}
          color={i === 0 ? T.danger : T.success}
          width={2.5}
          progress={i === 0 ? t3a0 : t3a1}
          opacity={0.8 * (i === 0 ? t3a0Vis : t3a1Vis) * lf}
        />
      ))}

      <SchemaNode {...URLIN} state="idle" lit={urlLit} opacity={urlOp} label="finn.no/... — 20+ URL shapes" fontSize={19} />
      <Pill x={URLIN.x - 10} y={URLIN.y + URLIN.h + 14} text="finnkode is the only ID that matters" color={T.amber} opacity={chaosPillOp} fontSize={16} />

      {REGEX.map((r, i) => (
        <SchemaNode
          key={r.label}
          {...r}
          state={i === 1 ? "success" : i === 0 ? "danger" : "idle"}
          lit={i === 1 ? rx1Lit : i === 0 ? interpolate(frame, [128, 150, 200, 220], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf : rxAmbientLit[i]}
          opacity={rxOp[i]}
          label={r.label}
          fontSize={14}
        />
      ))}
      <Token pts={P_URLIN_RX[0]} t={tRx0} color={T.danger} opacity={tRx0Vis * lf} />
      <Token pts={P_URLIN_RX[1]} t={tRx1} opacity={tRx1Vis * lf} color={T.success} />
      <Badge x={REGEX[0].x + REGEX[0].w / 2 - 14} y={REGEX[0].y - 32} kind="cross" scale={xScale0} opacity={xScale0} size={28} />
      <Badge x={REGEX[1].x + REGEX[1].w / 2 - 14} y={REGEX[1].y - 32} kind="check" scale={checkScale1} opacity={checkScale1} size={28} />
      <Pill x={REGEX[3].x - 20} y={REGEX[3].y + REGEX[3].h + 14} text="miss → Cheerio parses data-finnkode from HTML" color={T.muted} opacity={cheerioPillOp} fontSize={15} />

      {APPLY.map((a, i) => (
        <SchemaNode key={a.label} {...a} state={i === 0 ? "danger" : "success"} lit={i === 0 ? app0Lit : app1Lit} opacity={i === 0 ? app0Op : app1Op} label={a.label} fontSize={17} />
      ))}
      <Badge x={APPLY[0].x + APPLY[0].w / 2 - 17} y={APPLY[0].y - 40} kind="cross" scale={xScale3} opacity={xScale3} />
      <Badge x={APPLY[1].x + APPLY[1].w / 2 - 17} y={APPLY[1].y - 40} kind="check" scale={checkScale3} opacity={checkScale3} />

      <Caption x={90} y={648} w={1100} text="Without a reliable finnkode, automated applications grind to a halt" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="5 regex patterns in priority order — first miss, second one hits" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The intuitive apply URL 404s — adId as a query param is the real one" color={T.danger} opacity={cap3} fontSize={21} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>2000+ diverse FINN.no test URLs</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>100% extraction rate, zero lost applications</div>
      </div>
    </AbsoluteFill>
  );
};
