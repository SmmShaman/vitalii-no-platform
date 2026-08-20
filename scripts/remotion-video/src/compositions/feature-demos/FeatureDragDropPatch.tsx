/**
 * FeatureDragDropPatch — feature j40 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Webcruiter/Easycruit drop-zone CV uploads block 80%+ of
 * applications — headless Chrome's DataTransfer API behaves differently,
 * conventional drag-and-drop just doesn't register → handler_patched.py
 * replaces mouse-drag events with a DataTransfer drop: create object,
 * inject file blob, dispatch 'drop', fallback to input.click() — mounted
 * via docker-compose volume so future Skyvern updates never overwrite it
 * → uploads work first-try, 100% of target platforms unblocked.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SITES = { x: 150, y: 55, w: 300, h: 82, label: "Webcruiter · Easycruit" };
const DROPZONE = { x: 830, y: 55, w: 300, h: 82, label: "drop-zone upload" };
const SITES_R: Pt = { x: SITES.x + SITES.w, y: SITES.y + SITES.h / 2 };
const DROPZONE_L: Pt = { x: DROPZONE.x, y: DROPZONE.y + DROPZONE.h / 2 };

const MOUSE = { x: 480, y: 210, w: 320, h: 78, label: "Skyvern mouse-drag events" };
const MOUSE_T: Pt = { x: MOUSE.x + MOUSE.w / 2, y: MOUSE.y };

const STEPS = [
  { x: 90, y: 350, w: 260, h: 68, label: "1. new DataTransfer()" },
  { x: 370, y: 350, w: 260, h: 68, label: "2. dt.items.add(file)" },
  { x: 650, y: 350, w: 260, h: 68, label: "3. dispatch 'drop'" },
  { x: 930, y: 350, w: 260, h: 68, label: "4. input.click() fallback" },
];
const STEPS_T: Pt[] = STEPS.map((s) => ({ x: s.x + s.w / 2, y: s.y }));

const MOUNT = { x: 440, y: 500, w: 400, h: 80 };
const MOUNT_T: Pt = { x: MOUNT.x + MOUNT.w / 2, y: MOUNT.y };

export const FeatureDragDropPatch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): drop-zone uploads block 80%+ of target applications ──
  const sitesOp = appear(6) * lf;
  const dropOp = appear(20) * lf;
  const sitesLit = interpolate(frame, [6, 28, 96, 116], [0, 0.45, 0.45, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const dropLit = interpolate(frame, [20, 42, 96, 116], [0, 0.45, 0.45, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1 = seg(frame, 30, 54);
  const t1Vis = frame >= 30 && frame < 78 ? 1 : 0;
  const xScale = pop(60) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const blockPillIn = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const blockPillOp = blockPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): handler_patched.py replaces mouse-drag with DataTransfer ──
  const mouseOp = appear(134, 18) * lf;
  const mouseLit = interpolate(frame, [134, 156, 330, 350], [0, 0.45, 0.45, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tM = STEPS_T.map((_, i) => seg(frame, 156 + i * 6, 180 + i * 6));
  const tMVis = STEPS_T.map((_, i) => (frame >= 156 + i * 6 && frame < 226 ? 1 : 0));
  const stepOp = STEPS.map((_, i) => appear(164 + i * 6, 14) * lf);
  const stepLit = STEPS.map((_, i) =>
    interpolate(frame, [164 + i * 6, 186 + i * 6, 330, 350], [0, 0.65, 0.65, 0.18], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const jsPillIn = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const jsPillOp = jsPillIn * interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [226, 246], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–340): mounted via docker-compose volume, survives updates ──
  const tSm = seg(frame, 254, 278);
  const tSmVis = frame >= 254 && frame < 302 ? 1 : 0;
  const mountOp = appear(268, 18) * lf;
  const mountLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const localePillIn = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const localePillOp = localePillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[SITES_R, DROPZONE_L]} color={T.danger} width={2.5} progress={t1} opacity={0.8 * t1Vis * lf} />
      {STEPS_T.map((p, i) => (
        <Connector key={i} pts={[MOUSE_T, p]} color={T.accent} width={2} progress={tM[i]} opacity={0.7 * tMVis[i] * lf} />
      ))}
      <Connector pts={[{ x: STEPS[3].x + STEPS[3].w / 2, y: STEPS[3].y + STEPS[3].h }, MOUNT_T]} color={T.success} width={2.5} progress={tSm} opacity={0.8 * tSmVis * lf} />

      <SchemaNode {...SITES} state="danger" lit={sitesLit} opacity={sitesOp} label={SITES.label} fontSize={19} />
      <SchemaNode {...DROPZONE} state="danger" lit={dropLit} opacity={dropOp} label={DROPZONE.label} fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>files don't register</div>
      </SchemaNode>
      <Token pts={[SITES_R, DROPZONE_L]} t={t1} color={T.danger} opacity={t1Vis * lf} />
      <Badge x={DROPZONE.x + DROPZONE.w / 2 - 16} y={DROPZONE.y - 34} kind="cross" scale={xScale} opacity={xScale} size={32} />
      <Pill x={SITES.x + 20} y={SITES.y + SITES.h + 14} text="80%+ of target applications blocked" color={T.danger} opacity={blockPillOp} fontSize={17} />

      <SchemaNode {...MOUSE} state="danger" lit={mouseLit} opacity={mouseOp} label={MOUSE.label} fontSize={17} />
      {STEPS.map((s, i) => (
        <SchemaNode key={s.label} {...s} state="accent" lit={stepLit[i]} opacity={stepOp[i]} label={s.label} fontSize={14} />
      ))}
      {STEPS_T.map((_, i) => (
        <Token key={i} pts={[MOUSE_T, STEPS_T[i]]} t={tM[i]} opacity={tMVis[i] * lf} size={9} />
      ))}
      <Pill x={STEPS[1].x - 10} y={STEPS[1].y - 44} text="handler_patched.py replaces upload_file()" color={T.accent} opacity={jsPillOp} fontSize={15} />

      <SchemaNode {...MOUNT} state="success" lit={mountLit} opacity={mountOp} label="docker-compose volume mount" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Skyvern updates never overwrite it</div>
      </SchemaNode>
      <Token pts={[{ x: STEPS[3].x + STEPS[3].w / 2, y: STEPS[3].y + STEPS[3].h }, MOUNT_T]} t={tSm} color={T.success} opacity={tSmVis * lf} />
      <Pill x={MOUNT.x - 40} y={MOUNT.y + MOUNT.h + 14} text="BROWSER_LOCALE=nb-NO for correct Norwegian" color={T.success} opacity={localePillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Drop-zone uploads on key platforms silently fail — headless Chrome's DataTransfer differs" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="A 4-step JS sequence rebuilds the drop event by hand, with a click fallback" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Mounted as a volume override — the fix survives every future Skyvern update" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Works on the first attempt, every time</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>100% of target application platforms unblocked</div>
      </div>
    </AbsoluteFill>
  );
};
