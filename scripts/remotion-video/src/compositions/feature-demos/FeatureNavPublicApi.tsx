/**
 * FeatureNavPublicApi — feature j14 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Arbeidsplassen's JS-heavy DOM breaks HTML scrapers monthly →
 * reverse-engineered network requests uncover a hidden public JSON API →
 * nav-enhancer.ts fetches /api/stillinger directly for structured fields
 * (jobTitle, companyName, applicationDeadline...) → a fallback to HTML
 * scraping stays in place for resilience → 6+ months, zero fixes, versus
 * FINN.no's HTML scraper needing 4 fixes in the same window.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const DOM = { x: 460, y: 30, w: 360, h: 80 };
const ENHANCER = { x: 90, y: 180, w: 280, h: 90 };
const API = { x: 500, y: 180, w: 280, h: 90 };
const FALLBACK = { x: 900, y: 180, w: 280, h: 90 };
const COMPARE = [
  { x: 280, y: 350, w: 340, h: 90, label: "NAV.no · nav-enhancer" },
  { x: 660, y: 350, w: 340, h: 90, label: "FINN.no · HTML scraper" },
];

const DOM_B: Pt = { x: DOM.x + DOM.w / 2, y: DOM.y + DOM.h };
const ENH_T: Pt = { x: ENHANCER.x + ENHANCER.w / 2, y: ENHANCER.y };
const ENH_R: Pt = { x: ENHANCER.x + ENHANCER.w, y: ENHANCER.y + ENHANCER.h / 2 };
const API_L: Pt = { x: API.x, y: API.y + API.h / 2 };
const API_R: Pt = { x: API.x + API.w, y: API.y + API.h / 2 };
const FB_L: Pt = { x: FALLBACK.x, y: FALLBACK.y + FALLBACK.h / 2 };
const CMP_T: Pt[] = COMPARE.map((c) => ({ x: c.x + c.w / 2, y: c.y }));
const API_B: Pt = { x: API.x + API.w / 2, y: API.y + API.h };

const P_DOM_ENH: Pt[] = [DOM_B, ENH_T];
const P_ENH_API: Pt[] = [ENH_R, API_L];
const P_API_FB: Pt[] = [API_R, FB_L];
const P_API_CMP0: Pt[] = [API_B, CMP_T[0]];

export const FeatureNavPublicApi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–108): JS-heavy DOM breaks scrapers monthly ──
  const domOp = Math.min(1, pop(4)) * lf;
  const domLit = interpolate(frame, [4, 26, 86, 106], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(38) * interpolate(frame, [86, 106], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const breakPillIn = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const breakPillOp = breakPillIn * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (114–238): reverse-engineered hidden JSON API ──
  const tDe = seg(frame, 116, 138);
  const tDeVis = frame >= 116 && frame < 200 ? 1 : 0;
  const enhOp = appear(120, 18) * lf;
  const enhLit = interpolate(frame, [128, 150, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tEa = seg(frame, 152, 174);
  const tEaVis = frame >= 152 && frame < 330 ? 1 : 0;
  const apiOp = appear(156, 18) * lf;
  const apiLit = interpolate(frame, [164, 186, 330, 350], [0, 0.8, 0.8, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const fieldsPillIn = seg(frame, 188, 210, Easing.out(Easing.cubic));
  const fieldsPillOp = fieldsPillIn * interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (242–336): fallback stays in place for resilience ──
  const tAf = seg(frame, 244, 266);
  const tAfVis = frame >= 244 && frame < 330 ? 1 : 0;
  const fbOp = appear(248, 18) * lf;
  const fbLit = interpolate(frame, [256, 278, 330, 350], [0, 0.4, 0.4, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap3In = seg(frame, 252, 274, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): 6 months zero fixes vs 4 fixes for FINN ──
  const tAc = seg(frame, 352, 374);
  const tAcVis = frame >= 352 && frame < 450 ? 1 : 0;
  const cmpOp = COMPARE.map((_, i) => appear(356 + i * 10, 16) * lf);
  const cmpLit = [
    interpolate(frame, [368, 390], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf,
    interpolate(frame, [378, 400], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf,
  ];
  const checkScale4 = pop(392) * lf;
  const crossScale4 = pop(400) * lf;
  const finalCapIn = seg(frame, 404, 426, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_DOM_ENH} color={T.danger} width={2.5} progress={tDe} opacity={0.8 * tDeVis * lf} />
      <Connector pts={P_ENH_API} color={T.accent} width={2.5} progress={tEa} opacity={0.8 * tEaVis * lf} />
      <Connector pts={P_API_FB} color={T.amber} width={2} dashed opacity={0.5 * tAfVis * lf} />
      <Connector pts={P_API_CMP0} color={T.success} width={2.5} progress={tAc} opacity={0.8 * tAcVis * lf} />

      <SchemaNode {...DOM} state="danger" lit={domLit} opacity={domOp} label="Arbeidsplassen DOM" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>JS-heavy, breaks monthly</div>
      </SchemaNode>
      <Badge x={DOM.x + DOM.w - 20} y={DOM.y - 18} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={DOM.x - 10} y={DOM.y + DOM.h + 14} text="hours debugging fragile XPath / regex" color={T.danger} opacity={breakPillOp} fontSize={16} />

      <SchemaNode {...ENHANCER} state="accent" lit={enhLit} opacity={enhOp} label="nav-enhancer.ts" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>reverse-engineered requests</div>
      </SchemaNode>
      <Token pts={P_DOM_ENH} t={tDe} color={T.danger} opacity={tDeVis * lf} />

      <SchemaNode {...API} state="success" lit={apiLit} opacity={apiOp} label="/api/stillinger" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>hidden public JSON API</div>
      </SchemaNode>
      <Token pts={P_ENH_API} t={tEa} opacity={tEaVis * lf} />
      <Pill x={API.x - 30} y={API.y - 46} text="jobTitle · companyName · applicationDeadline · applicationUrl" color={T.success} opacity={fieldsPillOp} fontSize={14} />

      <SchemaNode {...FALLBACK} state="amber" lit={fbLit} opacity={fbOp} label="HTML scraping fallback" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>if the API ever fails</div>
      </SchemaNode>

      {COMPARE.map((c, i) => (
        <SchemaNode key={c.label} {...c} state={i === 0 ? "success" : "danger"} lit={cmpLit[i]} opacity={cmpOp[i]} label={c.label} fontSize={17} />
      ))}
      <Token pts={P_API_CMP0} t={tAc} color={T.success} opacity={tAcVis * lf} />
      <Badge x={COMPARE[0].x + COMPARE[0].w / 2 - 17} y={COMPARE[0].y + COMPARE[0].h + 10} kind="check" scale={checkScale4} opacity={checkScale4} />
      <Badge x={COMPARE[1].x + COMPARE[1].w / 2 - 17} y={COMPARE[1].y + COMPARE[1].h + 10} kind="cross" scale={crossScale4} opacity={crossScale4} />

      <Caption x={90} y={648} w={1100} text="Every minor site update broke the scraper — monthly XPath fire drills" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A hidden JSON API returns clean, structured job data directly" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="HTML scraping stays wired in as a fallback, just in case" color={T.amber} opacity={cap3} fontSize={23} weight={600} />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 610,
          width: 1280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: finalCap,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 600, color: T.success }}>6+ months, zero fixes</div>
        <div style={{ fontSize: 20, fontWeight: 500, color: T.muted }}>vs. 4 fixes for the FINN.no HTML scraper</div>
      </div>
    </AbsoluteFill>
  );
};
