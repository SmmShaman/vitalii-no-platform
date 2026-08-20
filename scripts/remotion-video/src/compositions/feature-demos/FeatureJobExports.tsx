/**
 * FeatureJobExports — feature j27 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: sharing a curated job list with a NAV consultant meant copy-paste
 * (destroys formatting/links) or screenshots (static, unfilterable) → a
 * React export module picks columns via ColumnSelectionModal, xlsx builds
 * clickable-link, color-coded-score Excel files, jsPDF makes a print-ready
 * PDF, both actions logged to export_history → one click, 50+ jobs,
 * professional output.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PASTE = { x: 110, y: 60, w: 260, h: 84, label: "copy-paste" };
const SHOT = { x: 470, y: 60, w: 260, h: 84, label: "screenshot" };
const CONSULT = { x: 830, y: 60, w: 300, h: 84, label: "NAV consultant" };
const PASTE_R: Pt = { x: PASTE.x + PASTE.w, y: PASTE.y + PASTE.h / 2 };
const SHOT_R: Pt = { x: SHOT.x + SHOT.w, y: SHOT.y + SHOT.h / 2 };
const CONSULT_L: Pt = { x: CONSULT.x, y: CONSULT.y + CONSULT.h / 2 };

const MODAL = { x: 490, y: 210, w: 300, h: 88 };
const MODAL_B: Pt = { x: MODAL.x + MODAL.w / 2, y: MODAL.y + MODAL.h };

const XLSX = { x: 210, y: 350, w: 300, h: 100 };
const PDF = { x: 770, y: 350, w: 300, h: 100 };
const XLSX_T: Pt = { x: XLSX.x + XLSX.w / 2, y: XLSX.y };
const PDF_T: Pt = { x: PDF.x + PDF.w / 2, y: PDF.y };
const XLSX_B: Pt = { x: XLSX.x + XLSX.w / 2, y: XLSX.y + XLSX.h };
const PDF_B: Pt = { x: PDF.x + PDF.w / 2, y: PDF.y + PDF.h };

const LOG = { x: 490, y: 510, w: 300, h: 78 };
const LOG_T: Pt = { x: LOG.x + LOG.w / 2, y: LOG.y };

export const FeatureJobExports: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–112): copy-paste / screenshot both fail the consultant ──
  const pasteOp = appear(6) * lf;
  const shotOp = appear(16) * lf;
  const consultOp = Math.min(1, pop(30)) * lf;
  const pasteLit = interpolate(frame, [6, 28, 96, 116], [0, 0.45, 0.45, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const shotLit = interpolate(frame, [16, 38, 96, 116], [0, 0.45, 0.45, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale1 = pop(46) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale2 = pop(56) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): ColumnSelectionModal → xlsx / jsPDF generation ──
  const modalOp = appear(134, 18) * lf;
  const modalLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tMx = seg(frame, 152, 178);
  const tMxVis = frame >= 152 && frame < 200 ? 1 : 0;
  const tMp = seg(frame, 158, 184);
  const tMpVis = frame >= 158 && frame < 206 ? 1 : 0;
  const xlsxOp = appear(170, 18) * lf;
  const pdfOp = appear(176, 18) * lf;
  const xlsxLit = interpolate(frame, [178, 200, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pdfLit = interpolate(frame, [184, 206, 330, 350], [0, 0.7, 0.7, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const linkPillIn = seg(frame, 190, 212, Easing.out(Easing.cubic));
  const linkPillOp = linkPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): color-coded scores + export_history log ──
  const tXl = seg(frame, 250, 274);
  const tXlVis = frame >= 250 && frame < 300 ? 1 : 0;
  const tPl = seg(frame, 256, 280);
  const tPlVis = frame >= 256 && frame < 306 ? 1 : 0;
  const logOp = appear(270, 18) * lf;
  const logLit = interpolate(frame, [278, 300, 330, 350], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const colorPillIn = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const colorPillOp = colorPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
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

      <Connector pts={[PASTE_R, CONSULT_L]} color={T.danger} width={2} opacity={0.4 * Math.min(pasteOp, consultOp)} />
      <Connector pts={[SHOT_R, CONSULT_L]} color={T.danger} width={2} opacity={0.4 * Math.min(shotOp, consultOp)} />
      <Connector pts={[MODAL_B, XLSX_T]} color={T.accent} width={2.5} progress={tMx} opacity={0.8 * tMxVis * lf} />
      <Connector pts={[MODAL_B, PDF_T]} color={T.accent} width={2.5} progress={tMp} opacity={0.8 * tMpVis * lf} />
      <Connector pts={[XLSX_B, LOG_T]} color={T.success} width={2.5} progress={tXl} opacity={0.8 * tXlVis * lf} />
      <Connector pts={[PDF_B, LOG_T]} color={T.success} width={2.5} progress={tPl} opacity={0.8 * tPlVis * lf} />

      <SchemaNode {...PASTE} state="danger" lit={pasteLit} opacity={pasteOp} label={PASTE.label} fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>kills formatting & links</div>
      </SchemaNode>
      <SchemaNode {...SHOT} state="danger" lit={shotLit} opacity={shotOp} label={SHOT.label} fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>static, unfilterable</div>
      </SchemaNode>
      <SchemaNode {...CONSULT} state="idle" lit={0.2 * lf} opacity={consultOp} label={CONSULT.label} fontSize={21} />
      <Badge x={PASTE.x + PASTE.w / 2 - 16} y={PASTE.y - 34} kind="cross" scale={xScale1} opacity={xScale1} size={32} />
      <Badge x={SHOT.x + SHOT.w / 2 - 16} y={SHOT.y - 34} kind="cross" scale={xScale2} opacity={xScale2} size={32} />

      <SchemaNode {...MODAL} state="accent" lit={modalLit} opacity={modalOp} label="ColumnSelectionModal" fontSize={18} />

      <SchemaNode {...XLSX} state="accent" lit={xlsxLit} opacity={xlsxOp} label="xlsx export" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>cell.l Target hyperlinks</div>
      </SchemaNode>
      <SchemaNode {...PDF} state="accent" lit={pdfLit} opacity={pdfOp} label="jsPDF export" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>print-ready, page numbers</div>
      </SchemaNode>
      <Token pts={[MODAL_B, XLSX_T]} t={tMx} opacity={tMxVis * lf} />
      <Token pts={[MODAL_B, PDF_T]} t={tMp} opacity={tMpVis * lf} />
      <Pill x={XLSX.x - 10} y={XLSX.y - 46} text="clickable jobTitle cells" color={T.accent} opacity={linkPillOp} fontSize={16} />

      <SchemaNode {...LOG} state="success" lit={logLit} opacity={logOp} label="export_history" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Supabase table</div>
      </SchemaNode>
      <Token pts={[XLSX_B, LOG_T]} t={tXl} color={T.success} opacity={tXlVis * lf} />
      <Token pts={[PDF_B, LOG_T]} t={tPl} color={T.success} opacity={tPlVis * lf} />
      <Pill x={LOG.x - 60} y={LOG.y + LOG.h + 14} text="green >70 · yellow 40–70 · red <40" color={T.success} opacity={colorPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Copy-paste kills formatting, screenshots are static — sharing is painful" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Pick columns once — xlsx and jsPDF build clickable, formatted exports" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Color-coded scores, auto-fit columns — every export logged for retrieval" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>50+ jobs, one click, ready for any NAV consultant</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Professional formatting, zero manual data entry</div>
      </div>
    </AbsoluteFill>
  );
};
