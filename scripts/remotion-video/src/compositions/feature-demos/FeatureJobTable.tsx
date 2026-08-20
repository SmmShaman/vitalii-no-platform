/**
 * FeatureJobTable — feature j26 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 200+ raw job postings, finding "IT jobs in Gjøvik, score>70, last
 * week, excluding recruiters" takes 10+ filter clicks and 5 minutes of
 * scrolling → JobTable.tsx (88KB React component) adds dynamic column
 * filters + persistent company exclusion + DateRangePicker, feeding
 * react-virtualized to render 500+ rows at 60fps → same query now 3 clicks,
 * 2 seconds.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const RAW = { x: 440, y: 50, w: 400, h: 90 };
const RAW_B: Pt = { x: RAW.x + RAW.w / 2, y: RAW.y + RAW.h };

const FILTERS = { x: 90, y: 210, w: 260, h: 92 };
const EXCLUDE = { x: 400, y: 210, w: 260, h: 92 };
const DATE = { x: 710, y: 210, w: 260, h: 92 };
const FILTERS_T: Pt = { x: FILTERS.x + FILTERS.w / 2, y: FILTERS.y };
const EXCLUDE_T: Pt = { x: EXCLUDE.x + EXCLUDE.w / 2, y: EXCLUDE.y };
const DATE_T: Pt = { x: DATE.x + DATE.w / 2, y: DATE.y };
const FILTERS_B: Pt = { x: FILTERS.x + FILTERS.w / 2, y: FILTERS.y + FILTERS.h };
const EXCLUDE_B: Pt = { x: EXCLUDE.x + EXCLUDE.w / 2, y: EXCLUDE.y + EXCLUDE.h };
const DATE_B: Pt = { x: DATE.x + DATE.w / 2, y: DATE.y + DATE.h };

const TABLE = { x: 340, y: 360, w: 600, h: 100 };
const TABLE_T: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y };

const VIRT = { x: 460, y: 510, w: 360, h: 80 };
const VIRT_T: Pt = { x: VIRT.x + VIRT.w / 2, y: VIRT.y };
const TABLE_B: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.h };

export const FeatureJobTable: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–112): 200+ raw postings, manual scroll is a nightmare ──
  const rawOp = Math.min(1, pop(6)) * lf;
  const rawLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const countPillIn = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const countPillOp = countPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const countPillDx = (1 - countPillIn) * 40;
  const clickPillIn = seg(frame, 56, 78, Easing.out(Easing.cubic));
  const clickPillOp = clickPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): 3 controls of JobTable.tsx feed the table ──
  const t2a = seg(frame, 138, 164);
  const t2aVis = frame >= 138 && frame < 190 ? 1 : 0;
  const t2b = seg(frame, 144, 170);
  const t2bVis = frame >= 144 && frame < 196 ? 1 : 0;
  const t2c = seg(frame, 150, 176);
  const t2cVis = frame >= 150 && frame < 202 ? 1 : 0;
  const filtOp = appear(132, 18) * lf;
  const excOp = appear(138, 18) * lf;
  const dateOp = appear(144, 18) * lf;
  const filtLit = interpolate(frame, [138, 160, 330, 350], [0, 0.65, 0.65, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const excLit = interpolate(frame, [144, 166, 330, 350], [0, 0.65, 0.65, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const dateLit = interpolate(frame, [150, 172, 330, 350], [0, 0.65, 0.65, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tableOp = appear(178, 18) * lf;
  const tableLit = interpolate(frame, [186, 208, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const excludePillIn = seg(frame, 190, 212, Easing.out(Easing.cubic));
  const excludePillOp = excludePillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): react-virtualized renders 500+ rows at 60fps ──
  const tTv = seg(frame, 250, 276);
  const tTvVis = frame >= 250 && frame < 300 ? 1 : 0;
  const virtOp = appear(266, 18) * lf;
  const virtLit = interpolate(frame, [274, 296, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const rowsPillIn = seg(frame, 280, 302, Easing.out(Easing.cubic));
  const rowsPillOp = rowsPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const fpsPillIn = seg(frame, 286, 308, Easing.out(Easing.cubic));
  const fpsPillOp = fpsPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
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

      <Connector pts={[RAW_B, FILTERS_T]} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={[RAW_B, EXCLUDE_T]} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={[RAW_B, DATE_T]} color={T.accent} width={2.5} progress={t2c} opacity={0.8 * t2cVis * lf} />
      <Connector pts={[FILTERS_B, TABLE_T]} color={T.accent} width={2} opacity={0.4 * Math.min(filtOp, tableOp)} />
      <Connector pts={[EXCLUDE_B, TABLE_T]} color={T.accent} width={2} opacity={0.4 * Math.min(excOp, tableOp)} />
      <Connector pts={[DATE_B, TABLE_T]} color={T.accent} width={2} opacity={0.4 * Math.min(dateOp, tableOp)} />
      <Connector pts={[TABLE_B, VIRT_T]} color={T.success} width={2.5} progress={tTv} opacity={0.8 * tTvVis * lf} />

      <SchemaNode {...RAW} state="danger" lit={rawLit} opacity={rawOp} label="jobs table — unfiltered" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>200+ postings, one long list</div>
      </SchemaNode>
      <Pill x={RAW.x + 30} y={RAW.y - 46} dx={countPillDx} text="IT jobs in Gjøvik, score>70, no recruiters" color={T.danger} opacity={countPillOp} fontSize={17} />
      <Pill x={RAW.x + RAW.w + 20} y={RAW.y + 20} text="10+ clicks · 5 min scrolling" color={T.danger} opacity={clickPillOp} fontSize={18} />

      <SchemaNode {...FILTERS} state="accent" lit={filtLit} opacity={filtOp} label="Column filters" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>status, form_type, source</div>
      </SchemaNode>
      <SchemaNode {...EXCLUDE} state="accent" lit={excLit} opacity={excOp} label="Company exclusion" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>persistent user setting</div>
      </SchemaNode>
      <SchemaNode {...DATE} state="accent" lit={dateLit} opacity={dateOp} label="DateRangePicker" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>date_posted presets</div>
      </SchemaNode>
      <Token pts={[RAW_B, FILTERS_T]} t={t2a} opacity={t2aVis * lf} />
      <Token pts={[RAW_B, EXCLUDE_T]} t={t2b} opacity={t2bVis * lf} />
      <Token pts={[RAW_B, DATE_T]} t={t2c} opacity={t2cVis * lf} />

      <SchemaNode {...TABLE} state="accent" lit={tableLit} opacity={tableOp} label="JobTable.tsx" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>88KB — sort, expand, bulk actions</div>
      </SchemaNode>
      <Pill x={TABLE.x + 40} y={TABLE.y - 46} text="Block Adecco → excluded everywhere" color={T.accent} opacity={excludePillOp} fontSize={16} />

      <SchemaNode {...VIRT} state="success" lit={virtLit} opacity={virtOp} label="react-virtualized" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>renders only visible rows</div>
      </SchemaNode>
      <Token pts={[TABLE_B, VIRT_T]} t={tTv} color={T.success} opacity={tTvVis * lf} />
      <Pill x={VIRT.x - 60} y={VIRT.y + VIRT.h + 14} text="500+ rows" color={T.success} opacity={rowsPillOp} fontSize={18} />
      <Pill x={VIRT.x + VIRT.w - 60} y={VIRT.y + VIRT.h + 14} text="60fps, no lag" color={T.success} opacity={fpsPillOp} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="200+ postings, one flat list — finding anything specific is a nightmare" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Dynamic filters, persistent exclusion, date presets — all feed one table" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Virtual scrolling keeps 500+ rows lag-free, exports to Excel/PDF" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>10 clicks / 5 min → 3 clicks / 2 seconds</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Batch-approve 5 jobs in a single 2-click sweep</div>
      </div>
    </AbsoluteFill>
  );
};
