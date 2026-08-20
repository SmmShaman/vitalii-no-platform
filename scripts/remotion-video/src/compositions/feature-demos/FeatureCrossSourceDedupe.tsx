/**
 * FeatureCrossSourceDedupe — feature j16 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: "Software Developer at Telenor" lands 3x — from FINN, LinkedIn,
 * and NAV — cluttering the feed and burning AI tokens on identical content
 * → job_insert's normalizeJobString() lowercases, trims, and strips
 * Norwegian legal suffixes (AS, ASA, DA...) before a SELECT dedup check →
 * a strong match merges the new URL into source_urls instead of inserting
 * a duplicate → job counts drop 15-20%, one clean canonical record.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SOURCES = [
  { x: 140, y: 30, w: 220, h: 70, label: "FINN.no" },
  { x: 460, y: 30, w: 220, h: 70, label: "LinkedIn" },
  { x: 780, y: 30, w: 220, h: 70, label: "NAV.no" },
];
const JOBINS = { x: 390, y: 170, w: 500, h: 90 };
const NORM = { x: 390, y: 330, w: 500, h: 90 };
const MERGE = { x: 250, y: 470, w: 340, h: 80 };
const SKIP = { x: 690, y: 470, w: 340, h: 80 };

const SRC_B: Pt[] = SOURCES.map((s) => ({ x: s.x + s.w / 2, y: s.y + s.h }));
const JOBINS_T: Pt = { x: JOBINS.x + JOBINS.w / 2, y: JOBINS.y };
const P_SRC_JI: Pt[][] = SRC_B.map((s) => [s, JOBINS_T]);
const JOBINS_B: Pt = { x: JOBINS.x + JOBINS.w / 2, y: JOBINS.y + JOBINS.h };
const NORM_T: Pt = { x: NORM.x + NORM.w / 2, y: NORM.y };
const NORM_B: Pt = { x: NORM.x + NORM.w / 2, y: NORM.y + NORM.h };
const MERGE_T: Pt = { x: MERGE.x + MERGE.w / 2, y: MERGE.y };
const SKIP_T: Pt = { x: SKIP.x + SKIP.w / 2, y: SKIP.y };

const P_JI_NORM: Pt[] = [JOBINS_B, NORM_T];
const P_NORM_MERGE: Pt[] = [NORM_B, MERGE_T];
const P_NORM_SKIP: Pt[] = [NORM_B, SKIP_T];

export const FeatureCrossSourceDedupe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): same job, 3 sources, visual clutter ──
  const srcOp = SOURCES.map((_, i) => Math.min(1, pop(4 + i * 10)) * lf);
  const srcLit = SOURCES.map((_, i) =>
    interpolate(frame, [4 + i * 10, 26 + i * 10, 88, 108], [0, 0.5, 0.5, 0.15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const tSrc = [0, 1, 2].map((i) => seg(frame, 34 + i * 16, 56 + i * 16));
  const tSrcVis = [0, 1, 2].map((i) => (frame >= 34 + i * 16 && frame < 108 + i * 16 ? 1 : 0));
  const jobinsOp = appear(40, 18) * lf;
  const jobinsLit = interpolate(frame, [48, 70, 88, 108], [0, 0.4, 0.4, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const samePillIn = seg(frame, 70, 92, Easing.out(Easing.cubic));
  const samePillOp = samePillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (120–246): normalizeJobString() strips noise ──
  const jobinsLit2 = interpolate(frame, [124, 146, 330, 350], [0, 0.6, 0.6, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tJn = seg(frame, 150, 172);
  const tJnVis = frame >= 150 && frame < 330 ? 1 : 0;
  const normOp = appear(154, 18) * lf;
  const normLit = interpolate(frame, [162, 184, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const stripPillIn = seg(frame, 186, 208, Easing.out(Easing.cubic));
  const stripPillOp = stripPillIn * interpolate(frame, [238, 258], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 156, 178, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [238, 258], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–352): merge into source_urls, skip the duplicate insert ──
  const tNm = seg(frame, 252, 274);
  const tNmVis = frame >= 252 && frame < 330 ? 1 : 0;
  const mergeOp = appear(256, 18) * lf;
  const mergeLit = interpolate(frame, [264, 286, 330, 350], [0, 0.8, 0.8, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const checkScale3 = pop(290) * lf;
  const tNs = seg(frame, 252, 274);
  const tNsVis = frame >= 252 && frame < 330 ? 1 : 0;
  const skipOp = appear(256, 18) * lf;
  const skipLit = interpolate(frame, [264, 286, 330, 350], [0, 0.4, 0.4, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale3 = pop(290) * lf;
  const cap3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
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

      {P_SRC_JI.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.danger} width={2} progress={tSrc[i]} opacity={0.7 * tSrcVis[i] * lf} />
      ))}
      <Connector pts={P_JI_NORM} color={T.accent} width={2.5} progress={tJn} opacity={0.8 * tJnVis * lf} />
      <Connector pts={P_NORM_MERGE} color={T.success} width={2.5} progress={tNm} opacity={0.8 * tNmVis * lf} />
      <Connector pts={P_NORM_SKIP} color={T.danger} width={2.5} progress={tNs} opacity={0.8 * tNsVis * lf} />

      {SOURCES.map((s, i) => (
        <SchemaNode key={s.label} {...s} state="idle" lit={srcLit[i]} opacity={srcOp[i]} label={s.label} fontSize={18}>
          <div style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>Software Developer · Telenor</div>
        </SchemaNode>
      ))}
      {[0, 1, 2].map((i) => (
        <Token key={i} pts={P_SRC_JI[i]} t={tSrc[i]} color={T.danger} opacity={tSrcVis[i] * lf} />
      ))}

      <SchemaNode {...JOBINS} state="idle" lit={Math.max(jobinsLit, jobinsLit2)} opacity={jobinsOp} label="job_insert Edge Function" fontSize={19} />
      <Pill x={JOBINS.x - 10} y={JOBINS.y - 46} text="same job, posted 3x — wasted AI tokens" color={T.danger} opacity={samePillOp} fontSize={16} />

      <SchemaNode {...NORM} state="accent" lit={normLit} opacity={normOp} label="normalizeJobString()" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>lowercase, trim, strip suffixes</div>
      </SchemaNode>
      <Token pts={P_JI_NORM} t={tJn} color={T.accent} opacity={tJnVis * lf} />
      <Pill x={NORM.x - 10} y={NORM.y - 46} text='"Telenor AS" → "telenor" — strips AS, ASA, A/S, DA' color={T.accent} opacity={stripPillOp} fontSize={15} />

      <SchemaNode {...MERGE} state="success" lit={mergeLit} opacity={mergeOp} label="merge into source_urls" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>1 canonical record</div>
      </SchemaNode>
      <Token pts={P_NORM_MERGE} t={tNm} color={T.success} opacity={tNmVis * lf} />
      <Badge x={MERGE.x + MERGE.w / 2 - 17} y={MERGE.y - 42} kind="check" scale={checkScale3} opacity={checkScale3} />

      <SchemaNode {...SKIP} state="danger" lit={skipLit} opacity={skipOp} label="duplicate insert" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>skipped</div>
      </SchemaNode>
      <Token pts={P_NORM_SKIP} t={tNs} color={T.danger} opacity={tNsVis * lf} />
      <Badge x={SKIP.x + SKIP.w / 2 - 17} y={SKIP.y - 42} kind="cross" scale={crossScale3} opacity={crossScale3} />

      <Caption x={90} y={648} w={1100} text="FINN, LinkedIn, NAV — the exact same job, three times over" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Normalize the name, then check for an existing match before inserting" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A match merges the source URL in — no duplicate ever gets inserted" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Job counts drop 15-20% — fewer tokens spent analyzing duplicates</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>A clean feed — no more duplicate spam</div>
      </div>
    </AbsoluteFill>
  );
};
