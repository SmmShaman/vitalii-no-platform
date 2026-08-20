/**
 * FeatureParticleBackground — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: browser-frame canvas w/ 200 (stylized) particles + WebGLRenderer
 * config chips → mousemove drives a subtle parallax shift → devicePixelRatio
 * gets capped at 1.5x while IntersectionObserver pauses the loop off-screen →
 * prefers-reduced-motion settles everything down; "60fps on any device".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA, lerpColor } from "./theme";
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
const CANVAS = { x: 90, y: 130, w: 470, h: 330 };
const RENDERER = { x: 720, y: 130, w: 470, h: 330 };
const TOPBAR_H = 30;

const CANVAS_INNER = {
  x: CANVAS.x + 22,
  y: CANVAS.y + TOPBAR_H + 18,
  w: CANVAS.w - 44,
  h: CANVAS.h - TOPBAR_H - 40,
};

// Base fractional positions (0..1) for the stylized particle field.
const PARTICLES: { bx: number; by: number; phase: number }[] = [
  { bx: 0.08, by: 0.15, phase: 0 },
  { bx: 0.22, by: 0.55, phase: 0.6 },
  { bx: 0.35, by: 0.25, phase: 1.2 },
  { bx: 0.5, by: 0.7, phase: 1.8 },
  { bx: 0.62, by: 0.35, phase: 2.4 },
  { bx: 0.78, by: 0.6, phase: 3.0 },
  { bx: 0.9, by: 0.2, phase: 3.6 },
  { bx: 0.15, by: 0.8, phase: 4.2 },
  { bx: 0.45, by: 0.12, phase: 4.8 },
  { bx: 0.7, by: 0.85, phase: 5.4 },
  { bx: 0.3, by: 0.45, phase: 6.0 },
  { bx: 0.85, by: 0.45, phase: 6.6 },
  { bx: 0.55, by: 0.55, phase: 7.2 },
  { bx: 0.1, by: 0.35, phase: 7.8 },
  { bx: 0.65, by: 0.15, phase: 8.4 },
  { bx: 0.4, by: 0.9, phase: 9.0 },
];

const CHIPS: { label: string; color: string }[] = [
  { label: "powerPreference: low-power", color: T.accent },
  { label: "antialias: true", color: T.accent },
  { label: "alpha: true", color: T.accent },
];

const MM_PATH: Pt[] = [
  { x: 150, y: 494 },
  { x: CANVAS.x + 74, y: CANVAS.y + CANVAS.h - 8 },
];
const MID_CONNECTOR: Pt[] = [
  { x: CANVAS.x + CANVAS.w, y: CANVAS.y + CANVAS.h / 2 },
  { x: RENDERER.x, y: RENDERER.y + RENDERER.h / 2 },
];
const RM_PATH: Pt[] = [
  { x: 990, y: 494 },
  { x: CANVAS.x + CANVAS.w - 70, y: CANVAS.y + CANVAS.h - 8 },
];

export const FeatureParticleBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const appear = (start: number, len = 20) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): canvas + renderer appear; chips highlight ──
  const canvasAppear = appear(0, 20);
  const rendererAppear = appear(10, 20);
  const canvasScale = 0.94 + 0.06 * Math.min(1, pop(0));
  const rendererScale = 0.94 + 0.06 * Math.min(1, pop(10));
  const chipHi = (i: number) => {
    const s = 34 + i * 16;
    return interpolate(frame, [s, s + 8, s + 18, s + 32], [0, 1, 1, 0.22], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };
  const rendererLit =
    interpolate(frame, [10, 30, 410, 430], [0, 0.55, 0.55, 0.15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;

  const cap1 = interpolate(frame, [16, 36, 96, 116], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;

  // ── Beat 2 (120–210): mousemove token → canvas; parallax shift ──
  const tMM = seg(frame, 128, 168);
  const tMMVis = frame >= 128 && frame < 200 ? 1 : 0;
  const mmPillIn = seg(frame, 124, 146, Easing.out(Easing.cubic));
  const mmPillOp =
    mmPillIn *
    interpolate(frame, [178, 200], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    lf;
  const mmPillDx = (1 - mmPillIn) * 40;
  const parallaxActive = interpolate(frame, [130, 150, 190, 210], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const parallaxDx = 16 * parallaxActive;
  const parallaxDy = -10 * parallaxActive;

  const cap2 = interpolate(frame, [128, 148, 196, 214], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;

  // ── Beat 3 (210–330): DPR cap flip; pause/resume via IntersectionObserver ──
  const dprIn = seg(frame, 218, 238, Easing.out(Easing.cubic));
  const dprOp =
    dprIn *
    interpolate(frame, [304, 324], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    lf;
  const dprDx = (1 - dprIn) * 40;
  const dprFlipped = frame >= 250;
  const dprArrowScale = pop(250) * lf;

  const obsIn = seg(frame, 256, 278, Easing.out(Easing.cubic));
  const obsOp =
    obsIn *
    interpolate(frame, [316, 334], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    lf;
  const obsDx = (1 - obsIn) * 40;
  const obsLit = interpolate(frame, [256, 266, 296, 306], [0, 1, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dimFactor = interpolate(frame, [250, 266, 296, 312], [1, 0.35, 0.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cap3 = interpolate(frame, [222, 242, 312, 330], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;

  // ── Beat 4 (330–450): prefers-reduced-motion → settle; final 60fps state ──
  const tRM = seg(frame, 344, 374);
  const tRMVis = frame >= 344 && frame < 400 ? 1 : 0;
  const rmPillIn = seg(frame, 340, 362, Easing.out(Easing.cubic));
  const rmPillOp = rmPillIn * lf;
  const rmPillDx = (1 - rmPillIn) * 40;

  const finalCapIn = seg(frame, 388, 410, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(392) * lf;
  const canvasSuccess = frame >= 386;
  const successGlow = pop(386) * lf;

  // ── Drift amplitude: ramp up → freeze (pause) → resume → calm settle ──
  const driftAmp = interpolate(
    frame,
    [0, 20, 250, 266, 296, 312, 340, 366],
    [0, 1, 1, 0.05, 0.05, 1, 1, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const canvasOpacity = canvasAppear * lf;
  const rendererOpacity = rendererAppear * lf;
  const particleOpacity = canvasAppear * dimFactor * lf;

  const canvasBaseLit = interpolate(frame, [0, 20, 340, 360], [0, 0.5, 0.5, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const canvasLit = Math.max(canvasBaseLit * dimFactor, successGlow * 0.9) * lf;
  const canvasColor = canvasSuccess ? T.success : T.accent;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {/* Base connector between canvas and renderer (always drawn, dim) */}
      <Connector pts={MID_CONNECTOR} opacity={0.3 * Math.min(canvasAppear, rendererAppear) * lf} />

      {/* Beat 2: mousemove connector + token */}
      <Connector pts={MM_PATH} color={T.accent} width={2.5} progress={tMM} opacity={0.75 * tMMVis * lf} />
      <Token pts={MM_PATH} t={tMM} opacity={tMMVis * lf} />

      {/* Beat 4: prefers-reduced-motion connector + token */}
      <Connector pts={RM_PATH} color={T.muted} width={2.5} progress={tRM} opacity={0.7 * tRMVis * lf} />
      <Token pts={RM_PATH} t={tRM} color={T.muted} opacity={tRMVis * lf} />

      {/* Canvas / browser-frame node */}
      <div
        style={{
          position: "absolute",
          left: CANVAS.x,
          top: CANVAS.y,
          width: CANVAS.w,
          height: CANVAS.h,
          borderRadius: 16,
          border: `1px solid ${lerpColor(T.border, canvasColor, Math.min(1, canvasLit) * 0.95)}`,
          background: T.nodeFill,
          boxShadow: canvasLit > 0.01 ? `0 0 ${30 * canvasLit}px ${hexA(canvasColor, 0.4 * canvasLit)}` : "none",
          opacity: canvasOpacity,
          transform: `scale(${canvasScale})`,
          transformOrigin: "center",
          overflow: "hidden",
          fontFamily,
        }}
      >
        {/* browser chrome top bar */}
        <div
          style={{
            height: TOPBAR_H,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 12px",
            background: T.nodeFillDeep,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: hexA(T.danger, 0.6) }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: hexA(T.amber, 0.6) }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: hexA(T.success, 0.6) }} />
          <div style={{ fontSize: 13, color: T.muted, marginLeft: 8, letterSpacing: 0.3 }}>canvas</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 12,
            fontSize: 15,
            fontWeight: 500,
            color: T.muted,
          }}
        >
          200 particles
        </div>
      </div>

      {/* Stylized particle field — page-absolute dots inside canvas bounds */}
      {PARTICLES.map((p, i) => {
        const px =
          CANVAS_INNER.x +
          p.bx * CANVAS_INNER.w +
          Math.sin(frame / 45 + p.phase) * 10 * driftAmp +
          parallaxDx;
        const py =
          CANVAS_INNER.y +
          p.by * CANVAS_INNER.h +
          Math.cos(frame / 38 + p.phase * 1.3) * 8 * driftAmp +
          parallaxDy;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: 7,
              height: 7,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, #ffffff, ${canvasColor} 65%)`,
              boxShadow: `0 0 8px 2px ${hexA(canvasColor, 0.55)}`,
              opacity: particleOpacity,
            }}
          />
        );
      })}

      {/* Renderer node with config chips */}
      <SchemaNode
        {...RENDERER}
        state="accent"
        lit={rendererLit}
        opacity={rendererOpacity}
        label="WebGLRenderer"
        fontSize={28}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 10,
            transform: `scale(${rendererScale})`,
          }}
        >
          {CHIPS.map((c, i) => (
            <div
              key={c.label}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 600,
                color: c.color,
                border: `1px solid ${hexA(c.color, 0.35 + 0.6 * chipHi(i))}`,
                background: hexA(c.color, 0.05 + 0.13 * chipHi(i)),
                boxShadow: chipHi(i) > 0.05 ? `0 0 ${12 * chipHi(i)}px ${hexA(c.color, 0.35 * chipHi(i))}` : "none",
                transform: `scale(${1 + 0.05 * chipHi(i)})`,
                textAlign: "center",
              }}
            >
              {c.label}
            </div>
          ))}
        </div>
      </SchemaNode>

      {/* Beat 2: mousemove pill */}
      <Pill x={70} y={494} dx={mmPillDx} text="mousemove" color={T.accent} opacity={mmPillOp} fontSize={20} />

      {/* Beat 3: devicePixelRatio pill (flips text at frame 250) + down-arrow badge */}
      <Pill
        x={340}
        y={494}
        dx={dprDx}
        text={dprFlipped ? "DPR capped @1.5×" : "devicePixelRatio: 2×"}
        color={T.amber}
        opacity={dprOp}
        fontSize={20}
      />
      <div
        style={{
          position: "absolute",
          left: 342,
          top: 460,
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: T.amber,
          color: "#3a2a05",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 700,
          transform: `scale(${dprArrowScale})`,
          opacity: dprArrowScale,
          boxShadow: `0 0 14px ${hexA(T.amber, 0.5)}`,
        }}
      >
        ↓
      </div>

      {/* Beat 3: IntersectionObserver pill */}
      <Pill
        x={720}
        y={494}
        dx={obsDx}
        text="IntersectionObserver"
        color={lerpColor(T.muted, T.amber, obsLit)}
        opacity={obsOp}
        fontSize={20}
      />

      {/* Beat 4: prefers-reduced-motion pill */}
      <Pill
        x={930}
        y={494}
        dx={rmPillDx}
        text="prefers-reduced-motion"
        color={T.muted}
        opacity={rmPillOp}
        fontSize={20}
      />

      {/* Captions (bottom center) */}
      <Caption x={90} y={648} w={1100} text="200 particles, GPU-efficient renderer" color={T.text} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Subtle parallax tracks the cursor" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption
        x={90}
        y={648}
        w={1100}
        text="Pauses off-screen · DPR capped — resource-efficient"
        color={T.amber}
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>60fps on any device — even 5-year-old Android</div>
      </div>
    </AbsoluteFill>
  );
};
