/**
 * FeatureAgentSubmit — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: job card approved once → OLD flow (stop + 2nd confirm + hungry
 * poller) gets struck out → NEW flow runs end-to-end unattended →
 * "1 run instead of 2 · idle-wake cost: 0".
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
  Pill,
  Pt,
  seg,
  loopFade,
  fontFamily,
} from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const CARD = { x: 60, y: 200, w: 330, h: 210 };
const BTN = { x: CARD.x + 65, y: CARD.y + 118, w: 200, h: 52 };
const BTN_C = { x: BTN.x + BTN.w / 2, y: BTN.y + BTN.h / 2 };

// OLD flow row (top)
const OLD_Y = 160;
const OLD_CY = 195;
const N1 = { x: 430, y: OLD_Y, w: 160, h: 70 }; // fill form
const STOP_C = { x: 672, y: OLD_CY };
const N2 = { x: 748, y: OLD_Y, w: 190, h: 70 }; // 2nd confirm
const POLLER_C = { x: 1030, y: OLD_CY };

// NEW flow row (bottom)
const NEW_Y = 400;
const NEW_CY = 435;
const M1 = { x: 430, y: NEW_Y, w: 120, h: 70 }; // recon
const M2 = { x: 578, y: NEW_Y, w: 100, h: 70 }; // fill
const M3 = { x: 706, y: NEW_Y, w: 175, h: 70 }; // screenshot
const M4 = { x: 909, y: NEW_Y, w: 130, h: 70 }; // submit
const ENV_C = { x: 1122, y: NEW_CY };

const NEW_LINE: Pt[] = [
  { x: 436, y: NEW_CY },
  { x: 1168, y: NEW_CY },
];

const octagonPoints = (cx: number, cy: number, r: number): string => {
  const pts: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 8) + (i * Math.PI) / 4;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
};

export const FeatureAgentSubmit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat 1 (0–105): cursor presses Confirm once ──
  const move = seg(frame, 18, 55, Easing.inOut(Easing.cubic));
  const curX = interpolate(move, [0, 1], [540, BTN_C.x + 12]);
  const curY = interpolate(move, [0, 1], [560, BTN_C.y + 8]);
  const curOp =
    seg(frame, 12, 20, Easing.out(Easing.quad)) * (1 - seg(frame, 92, 106, Easing.in(Easing.quad)));
  const press = interpolate(frame, [57, 62, 68], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ripple = seg(frame, 60, 86, Easing.out(Easing.cubic));
  const btnGlow = interpolate(frame, [58, 66, 110, 140], [0, 1, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap1 = seg(frame, 72, 94, Easing.out(Easing.cubic)) * lf;

  // ── Beat 2 (105–225): OLD flow appears, runs, then gets struck ──
  const oldIn = (i: number) => seg(frame, 105 + i * 7, 130 + i * 7, Easing.out(Easing.cubic));
  const dim = interpolate(frame, [198, 224], [1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gray = interpolate(frame, [198, 224], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldOp = (i: number) => oldIn(i) * dim * lf;

  const tOldA = seg(frame, 132, 150);
  const tOldAVis = frame >= 132 && frame < 152 ? 1 : 0;
  const tOldB = seg(frame, 166, 180);
  const tOldBVis = frame >= 166 && frame < 182 ? 1 : 0;
  const tOldC = seg(frame, 183, 196);
  const tOldCVis = frame >= 183 && frame < 198 ? 1 : 0;
  const stopPulse =
    frame >= 150 && frame < 200
      ? 0.55 + 0.45 * Math.abs(Math.sin(((frame - 150) / 16) * Math.PI))
      : frame >= 200
        ? 0.3
        : 0;
  const counterVal = interpolate(frame, [122, 200], [0, 190], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const strike = seg(frame, 198, 222, Easing.inOut(Easing.cubic));
  const pollerSpin = frame >= 105 ? (frame - 105) * 7 : 0;

  // ── Beat 3 (225–345): NEW flow, one continuous arrow ──
  const newIn = (i: number) => seg(frame, 225 + i * 5, 246 + i * 5, Easing.out(Easing.cubic));
  const newOp = (i: number) => newIn(i) * lf;
  const newDraw = seg(frame, 238, 318, Easing.inOut(Easing.quad));
  const tipX = 436 + (1168 - 436) * newDraw;
  const litNode = (cx: number) =>
    interpolate(tipX, [cx - 40, cx + 5], [0, 0.8], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  const badgePop = pop(300) * lf;
  const envPop = pop(317) * lf;
  const envTextOp = seg(frame, 322, 342, Easing.out(Easing.cubic)) * lf;

  // ── Beat 4 (345–450): end chip ──
  const chipSpring = pop(352, 13);
  const chipOp = seg(frame, 352, 366) * lf;

  const kTokens = Math.round(counterVal);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {/* ═══ NEW flow continuous arrow (behind nodes) ═══ */}
      <Connector pts={NEW_LINE} color={hexA(T.success, 0.28)} width={2} opacity={newIn(0) * lf} />
      <Connector
        pts={NEW_LINE}
        color={T.success}
        width={3}
        progress={newDraw}
        arrow
        opacity={(newDraw > 0.001 ? 0.85 : 0) * lf}
      />
      <Token pts={NEW_LINE} t={newDraw} color={T.success} opacity={(newDraw > 0.001 && newDraw < 0.999 ? 1 : 0) * lf} />

      {/* ═══ Job card (static base — matches first & last frame) ═══ */}
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 16,
          border: `1px solid ${T.border}`,
          background: T.nodeFill,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: `1px solid ${T.border}`,
            background: T.nodeFillDeep,
            color: T.text,
            fontSize: 24,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Job: Frontend Developer
        </div>
        <div style={{ padding: "14px 18px 0" }}>
          <div style={{ height: 7, width: "86%", borderRadius: 4, background: T.muted, opacity: 0.35 }} />
          <div style={{ height: 7, width: "62%", borderRadius: 4, background: T.muted, opacity: 0.35, marginTop: 10 }} />
        </div>
      </div>
      {/* Confirm button */}
      <div
        style={{
          position: "absolute",
          left: BTN.x,
          top: BTN.y,
          width: BTN.w,
          height: BTN.h,
          borderRadius: 12,
          background: T.success,
          color: "#12321c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 700,
          transform: `scale(${1 - 0.06 * press})`,
          boxShadow: `0 0 ${22 * btnGlow}px ${hexA(T.success, 0.55 * btnGlow)}`,
        }}
      >
        ✅ Confirm
      </div>
      {/* press ripple */}
      {ripple > 0.001 && ripple < 0.999 ? (
        <div
          style={{
            position: "absolute",
            left: BTN_C.x - 40,
            top: BTN_C.y - 40,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `2px solid ${T.success}`,
            transform: `scale(${0.3 + ripple * 1.4})`,
            opacity: (1 - ripple) * lf,
          }}
        />
      ) : null}
      {/* cursor dot */}
      <div
        style={{
          position: "absolute",
          left: curX - 10,
          top: curY - 10,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#ffffff",
          border: `2px solid ${hexA("#6366F1", 0.9)}`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.55)",
          transform: `scale(${1 - 0.25 * press})`,
          opacity: curOp * lf,
        }}
      />
      <Caption x={CARD.x} y={CARD.y + CARD.h + 18} w={CARD.w} text="approved once" color={T.success} opacity={cap1} fontSize={25} weight={600} />

      {/* ═══ OLD FLOW row ═══ */}
      <Caption x={430} y={116} w={220} text="OLD FLOW" color={T.muted} opacity={oldOp(0)} fontSize={20} weight={700} align="left" />
      <Connector pts={[{ x: 590, y: OLD_CY }, { x: 636, y: OLD_CY }]} opacity={oldOp(1)} />
      <Connector pts={[{ x: 708, y: OLD_CY }, { x: 748, y: OLD_CY }]} opacity={oldOp(2)} />
      <Connector pts={[{ x: 938, y: OLD_CY }, { x: 994, y: OLD_CY }]} opacity={oldOp(3)} />

      <SchemaNode {...N1} label="fill form" fontSize={28} opacity={oldOp(1)} grayscale={gray} />
      {/* STOP sign */}
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{ position: "absolute", left: 0, top: 0, opacity: oldOp(2), filter: `grayscale(${gray})` }}>
        <polygon
          points={octagonPoints(STOP_C.x, STOP_C.y, 38)}
          fill={T.nodeFillDeep}
          stroke={T.danger}
          strokeWidth={2.5}
          style={{ filter: stopPulse > 0.05 ? `drop-shadow(0 0 ${10 * stopPulse}px ${hexA(T.danger, 0.7)})` : undefined }}
        />
        <text
          x={STOP_C.x}
          y={STOP_C.y + 7}
          textAnchor="middle"
          fill={T.danger}
          fontSize={20}
          fontWeight={700}
          fontFamily={fontFamily}
          letterSpacing={1}
        >
          STOP
        </text>
      </svg>
      <SchemaNode {...N2} label="2nd confirm" fontSize={28} opacity={oldOp(3)} grayscale={gray} />
      {/* Poller: circle with rotating arrow */}
      <div
        style={{
          position: "absolute",
          left: POLLER_C.x - 36,
          top: POLLER_C.y - 36,
          width: 72,
          height: 72,
          opacity: oldOp(4),
          filter: `grayscale(${gray})`,
        }}
      >
        <svg width={72} height={72} viewBox="0 0 72 72" style={{ transform: `rotate(${pollerSpin}deg)` }}>
          <circle cx={36} cy={36} r={33} fill={T.nodeFillDeep} stroke={T.border} strokeWidth={1.5} />
          <path d="M 36 12 A 24 24 0 1 1 15 24" fill="none" stroke={T.amber} strokeWidth={4} strokeLinecap="round" />
          <polygon points="15,24 8,16 20,13" fill={T.amber} />
        </svg>
      </div>
      <Caption x={920} y={112} w={230} text="every 2 min" color={T.muted} opacity={oldOp(4)} fontSize={24} weight={500} />
      <Caption
        x={880}
        y={244}
        w={310}
        text={`${kTokens}k tokens / wake`}
        color={T.amber}
        opacity={oldOp(4)}
        fontSize={25}
        weight={700}
      />

      {/* red diagonal strike across the OLD row */}
      <Connector
        pts={[{ x: 412, y: 134 }, { x: 1256, y: 272 }]}
        color={T.danger}
        width={5}
        progress={strike}
        opacity={(strike > 0.001 ? 0.9 : 0) * lf}
      />

      {/* ═══ NEW FLOW row ═══ */}
      <Caption x={430} y={356} w={220} text="NEW FLOW" color={T.success} opacity={newOp(0) * 0.8} fontSize={20} weight={700} align="left" />
      <SchemaNode {...M1} label="recon" fontSize={28} state="success" lit={litNode(M1.x + M1.w / 2)} opacity={newOp(0)} />
      <SchemaNode {...M2} label="fill" fontSize={28} state="success" lit={litNode(M2.x + M2.w / 2)} opacity={newOp(1)} />
      <SchemaNode {...M3} label="screenshot" fontSize={28} state="success" lit={litNode(M3.x + M3.w / 2)} opacity={newOp(2)} />
      <SchemaNode {...M4} label="submit" fontSize={28} state="success" lit={litNode(M4.x + M4.w / 2)} opacity={newOp(3)} />
      {/* status: sent badge above submit */}
      <div
        style={{
          position: "absolute",
          left: M4.x - 12,
          top: NEW_Y - 58,
          transform: `scale(${Math.max(0.001, badgePop)})`,
          transformOrigin: "center bottom",
          opacity: badgePop,
          padding: "7px 18px",
          borderRadius: 999,
          background: T.success,
          color: "#12321c",
          fontSize: 24,
          fontWeight: 700,
          whiteSpace: "nowrap",
          boxShadow: `0 0 20px ${hexA(T.success, 0.5)}`,
        }}
      >
        status: sent
      </div>
      {/* Envelope */}
      <div
        style={{
          position: "absolute",
          left: ENV_C.x - 30,
          top: ENV_C.y - 22,
          width: 60,
          height: 44,
          transform: `scale(${Math.max(0.001, envPop)})`,
          opacity: envPop,
        }}
      >
        <svg width={60} height={44} viewBox="0 0 60 44">
          <rect x={1.5} y={1.5} width={57} height={41} rx={7} fill={T.nodeFillDeep} stroke={T.success} strokeWidth={2.5} />
          <polyline points="3,5 30,26 57,5" fill="none" stroke={T.success} strokeWidth={2.5} strokeLinejoin="round" />
        </svg>
      </div>
      <Caption x={950} y={490} w={320} text="FYI receipt, no buttons" color={T.muted} opacity={envTextOp} fontSize={24} weight={500} />

      {/* ═══ Beat 4: end chip ═══ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 606,
          width: 1280,
          display: "flex",
          justifyContent: "center",
          opacity: chipOp,
        }}
      >
        <div
          style={{
            transform: `scale(${0.85 + 0.15 * chipSpring})`,
            padding: "13px 30px",
            borderRadius: 999,
            border: `1px solid ${hexA(T.success, 0.7)}`,
            background: T.nodeFillDeep,
            color: T.text,
            fontSize: 27,
            fontWeight: 600,
            boxShadow: `0 0 24px ${hexA(T.success, 0.2)}`,
            whiteSpace: "nowrap",
          }}
        >
          1 run instead of 2&nbsp;&nbsp;·&nbsp;&nbsp;idle-wake cost: 0
        </div>
      </div>
    </AbsoluteFill>
  );
};
