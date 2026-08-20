/**
 * FeatureShadowDom — feature j17 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: FINN.no page hides "Enkel Søknad" inside Shadow DOM → Cheerio/Skyvern
 * both fail to see it → detectApplicationType runs a 3-level heuristic (raw
 * HTML text search bypasses Shadow DOM; "Søk her" priority check overrides
 * false positives) → direct URL construction finn.no/job/apply?adId=... skips
 * the UI entirely → "100% accurate detection, zero manual checks".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PAGE = { x: 90, y: 70, w: 320, h: 110 };
const SHADOW = { x: 490, y: 70, w: 300, h: 110 };
const TOOLS = { x: 870, y: 70, w: 320, h: 110 };
const PAGE_R: Pt = { x: PAGE.x + PAGE.w, y: PAGE.y + PAGE.h / 2 };
const SHADOW_L: Pt = { x: SHADOW.x, y: SHADOW.y + SHADOW.h / 2 };
const SHADOW_R: Pt = { x: SHADOW.x + SHADOW.w, y: SHADOW.y + SHADOW.h / 2 };
const TOOLS_L: Pt = { x: TOOLS.x, y: TOOLS.y + TOOLS.h / 2 };

const DETECT = { x: 465, y: 300, w: 350, h: 130 };
const DETECT_TOP: Pt = { x: DETECT.x + DETECT.w / 2, y: DETECT.y };
const DETECT_BOTTOM: Pt = { x: DETECT.x + DETECT.w / 2, y: DETECT.y + DETECT.h };
const PAGE_BOTTOM: Pt = { x: PAGE.x + PAGE.w / 2, y: PAGE.y + PAGE.h };

const URLBOX = { x: 400, y: 500, w: 480, h: 90 };
const URLBOX_TOP: Pt = { x: URLBOX.x + URLBOX.w / 2, y: URLBOX.y };

const PAGE_TO_DETECT: Pt[] = [PAGE_BOTTOM, DETECT_TOP];
const DETECT_TO_URL: Pt[] = [DETECT_BOTTOM, URLBOX_TOP];

export const FeatureShadowDom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): page + shadow DOM wall + tools that fail ──
  const pageOp = appear(6) * lf;
  const shadowOp = appear(16) * lf;
  const toolsOp = appear(26) * lf;
  const shadowLit = interpolate(frame, [16, 40, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const failX = pop(56) * interpolate(frame, [104, 124], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–225): 3-level heuristic in detectApplicationType ──
  const detectOp = appear(140, 18) * lf;
  const detectLit = interpolate(frame, [148, 175, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 156, 190);
  const t2Vis = frame >= 156 && frame < 224 ? 1 : 0;
  const pill2In = seg(frame, 198, 220, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (226–340): "Søk her" priority check overrides false positive ──
  const priorityIn = seg(frame, 236, 260, Easing.out(Easing.cubic));
  const priorityOp = priorityIn * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const priorityDx = (1 - priorityIn) * 40;
  const overrideCheck = pop(248) * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 250, 272, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): direct URL construction, result ──
  const urlOp = appear(348, 18) * lf;
  const t3 = seg(frame, 356, 388);
  const t3Vis = frame >= 356 && frame < 420 ? 1 : 0;
  const finalCapIn = seg(frame, 396, 418, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(400) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={PAGE_TO_DETECT} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={DETECT_TO_URL} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...PAGE} state="danger" lit={0.25 * lf} opacity={pageOp} label="FINN.no page" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>"Enkel Søknad" button</div>
      </SchemaNode>
      <SchemaNode {...SHADOW} state="danger" lit={shadowLit} opacity={shadowOp} label="Shadow DOM" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>invisible wall</div>
      </SchemaNode>
      <SchemaNode {...TOOLS} state="danger" lit={0.2 * lf} opacity={toolsOp} label="Cheerio · Skyvern" fontSize={20}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>can't detect it</div>
      </SchemaNode>
      <Badge x={SHADOW.x + SHADOW.w / 2 - 18} y={SHADOW.y - 46} kind="cross" scale={failX} opacity={failX} />

      <SchemaNode {...DETECT} state="accent" lit={detectLit} opacity={detectOp} label="detectApplicationType()" fontSize={21}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>
          Cheerio('body').text().includes('enkel søknad')
        </div>
      </SchemaNode>
      <Token pts={PAGE_TO_DETECT} t={t2} color={T.accent} opacity={t2Vis * lf} />
      <Pill x={DETECT.x - 20} y={DETECT.y - 44} dx={pill2Dx} text="raw HTML text search — bypasses Shadow DOM" color={T.accent} opacity={pill2Op} fontSize={18} />

      <Pill x={DETECT.x + 60} y={DETECT.y + DETECT.h + 10} dx={priorityDx} text='"Søk her" found → priority override' color={T.amber} opacity={priorityOp} fontSize={19} />
      <Badge x={DETECT.x + DETECT.w - 10} y={DETECT.y - 10} kind="check" scale={overrideCheck} opacity={overrideCheck} />

      <SchemaNode {...URLBOX} state="success" lit={0.6 * urlOp} opacity={urlOp} label="finn.no/job/apply?adId={finnkode}" fontSize={19}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>direct URL navigation, no UI</div>
      </SchemaNode>
      <Token pts={DETECT_TO_URL} t={t3} color={T.success} opacity={t3Vis * lf} />

      <Caption x={90} y={648} w={1100} text="Standard headless tools can't see through Shadow DOM" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Three-level heuristic reads the raw HTML instead" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Priority check eliminates false positives" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>100% accurate detection, zero manual checks</div>
      </div>
    </AbsoluteFill>
  );
};
