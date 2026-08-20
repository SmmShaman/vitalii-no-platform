/**
 * FeatureSkyvernSliderPatch — feature j12 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a slider/range input ("years of experience", "desired salary") is
 * a 100% dead end for Skyvern's default drag-and-drop in headless Chrome →
 * navigation goals updated with a 3-step fallback: click to focus, then
 * input_text, then a JS element.value set → for stubborn cases,
 * handler_patched.py adds a DataTransfer drop fallback, mounted into the
 * Skyvern Docker container via a docker-compose volume override → near
 * 100% success, first attempt.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FORM = { x: 460, y: 30, w: 360, h: 80 };
const SKY = { x: 460, y: 160, w: 360, h: 80 };
const FALLBACK = [
  { x: 90, y: 300, w: 280, h: 80, label: "click to focus" },
  { x: 500, y: 300, w: 280, h: 80, label: "input_text(value)" },
  { x: 900, y: 300, w: 280, h: 80, label: "JS: element.value =" },
];
const DOCKER = { x: 390, y: 460, w: 500, h: 90 };

const FORM_B: Pt = { x: FORM.x + FORM.w / 2, y: FORM.y + FORM.h };
const SKY_T: Pt = { x: SKY.x + SKY.w / 2, y: SKY.y };
const SKY_B: Pt = { x: SKY.x + SKY.w / 2, y: SKY.y + SKY.h };
const FB_T: Pt[] = FALLBACK.map((f) => ({ x: f.x + f.w / 2, y: f.y }));
const P_SKY_FB: Pt[][] = FB_T.map((f) => [SKY_B, f]);
const FB2_B: Pt = { x: FALLBACK[2].x + FALLBACK[2].w / 2, y: FALLBACK[2].y + FALLBACK[2].h };
const DOCKER_T: Pt = { x: DOCKER.x + DOCKER.w / 2, y: DOCKER.y };

const P_FORM_SKY: Pt[] = [FORM_B, SKY_T];
const P_FB2_DOCKER: Pt[] = [FB2_B, DOCKER_T];

export const FeatureSkyvernSliderPatch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–112): drag-and-drop always fails on headless Chrome ──
  const formOp = Math.min(1, pop(4)) * lf;
  const formLit = interpolate(frame, [4, 26, 88, 108], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tFs = seg(frame, 16, 38);
  const tFsVis = frame >= 16 && frame < 90 ? 1 : 0;
  const skyOp = appear(20, 18) * lf;
  const skyLit = interpolate(frame, [28, 50, 88, 108], [0, 0.6, 0.6, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(54) * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const failPillIn = seg(frame, 58, 80, Easing.out(Easing.cubic));
  const failPillOp = failPillIn * interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (118–246): 3-step fallback cascade ──
  const tFb = [0, 1, 2].map((i) => seg(frame, 122 + i * 30, 144 + i * 30));
  const tFbVis = [0, 1, 2].map((i) => (frame >= 122 + i * 30 && frame < 162 + i * 30 ? 1 : 0));
  const fbOp = FALLBACK.map((_, i) => appear(118 + i * 30, 16) * lf);
  const fbLit = [0, 1, 2].map((i) => {
    const s = 122 + i * 30;
    return interpolate(frame, [s, s + 16, 330, 350], [0, i === 2 ? 0.8 : 0.45, i === 2 ? 0.8 : 0.45, 0.18], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf;
  });
  const cap2In = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [244, 264], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const noDragPillIn = seg(frame, 226, 248, Easing.out(Easing.cubic));
  const noDragPillOp = noDragPillIn * interpolate(frame, [244, 264], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (250–352): handler_patched.py + docker-compose volume mount ──
  const tF2d = seg(frame, 252, 274);
  const tF2dVis = frame >= 252 && frame < 276 ? 1 : 0;
  const dockerOp = appear(256, 18) * lf;
  const dockerLit = interpolate(frame, [264, 286, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const mountPillIn = seg(frame, 288, 310, Easing.out(Easing.cubic));
  const mountPillOp = mountPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 258, 280, Easing.out(Easing.cubic));
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

      <Connector pts={P_FORM_SKY} color={T.danger} width={2.5} progress={tFs} opacity={0.8 * tFsVis * lf} />
      {P_SKY_FB.map((pts, i) => (
        <Connector
          key={i}
          pts={pts}
          color={i === 2 ? T.success : T.amber}
          width={2.5}
          progress={tFb[i]}
          opacity={0.8 * tFbVis[i] * lf}
        />
      ))}
      <Connector pts={P_FB2_DOCKER} color={T.success} width={2.5} progress={tF2d} opacity={0.8 * tF2dVis * lf} />

      <SchemaNode {...FORM} state="idle" lit={formLit} opacity={formOp} label="salary / experience slider" fontSize={19} />
      <Token pts={P_FORM_SKY} t={tFs} color={T.danger} opacity={tFsVis * lf} />

      <SchemaNode {...SKY} state="danger" lit={skyLit} opacity={skyOp} label="Skyvern drag-and-drop" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>headless Chrome</div>
      </SchemaNode>
      <Badge x={SKY.x + SKY.w - 18} y={SKY.y - 18} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={SKY.x - 10} y={SKY.y + SKY.h + 14} text="100% failure rate — kills the whole application" color={T.danger} opacity={failPillOp} fontSize={16} />

      {FALLBACK.map((f, i) => (
        <SchemaNode key={f.label} {...f} state={i === 2 ? "success" : "amber"} lit={fbLit[i]} opacity={fbOp[i]} label={f.label} fontSize={16} />
      ))}
      {[0, 1, 2].map((i) => (
        <Token key={i} pts={P_SKY_FB[i]} t={tFb[i]} color={i === 2 ? T.success : T.amber} opacity={tFbVis[i] * lf} />
      ))}
      <Pill x={FALLBACK[0].x - 10} y={FALLBACK[0].y - 44} text="DO NOT try to drag" color={T.amber} opacity={noDragPillOp} fontSize={16} />

      <SchemaNode {...DOCKER} state="success" lit={dockerLit} opacity={dockerOp} label="handler_patched.py" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>DataTransfer drop fallback</div>
      </SchemaNode>
      <Token pts={P_FB2_DOCKER} t={tF2d} color={T.success} opacity={tF2dVis * lf} />
      <Pill x={DOCKER.x - 10} y={DOCKER.y - 46} text="mounted via docker-compose volume override" color={T.success} opacity={mountPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Slider inputs — a 100% dead end for headless Chrome drag-and-drop" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Cascading fallback: click, then type the value, then set it via JS" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Stubborn cases get a patched drop handler baked into the container" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>A single patch unblocked a whole category of forms</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Near 100% success, first attempt</div>
      </div>
    </AbsoluteFill>
  );
};
