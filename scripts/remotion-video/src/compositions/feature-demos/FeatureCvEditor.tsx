/**
 * FeatureCvEditor — feature j28 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: the AI PDF parser mis-reads a date, fixing it means an external PDF
 * editor + re-upload + re-parse, 20 minutes wasted → ProfileEditor.tsx gives
 * 9 direct, expandable sections, drag-and-drop reordering, auto-saved to the
 * structured_content JSONB column → instantly available for form auto-fill
 * and cover letters, no re-parsing needed → 20 minutes down to 3 seconds.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PDF = { x: 90, y: 62, w: 230, h: 80, label: "AI PDF parser" };
const EXTERNAL = { x: 400, y: 62, w: 230, h: 80, label: "external PDF editor" };
const REUPLOAD = { x: 710, y: 62, w: 230, h: 80, label: "re-upload + re-parse" };
const PDF_R: Pt = { x: PDF.x + PDF.w, y: PDF.y + PDF.h / 2 };
const EXT_L: Pt = { x: EXTERNAL.x, y: EXTERNAL.y + EXTERNAL.h / 2 };
const EXT_R: Pt = { x: EXTERNAL.x + EXTERNAL.w, y: EXTERNAL.y + EXTERNAL.h / 2 };
const REUP_L: Pt = { x: REUPLOAD.x, y: REUPLOAD.y + REUPLOAD.h / 2 };

const EDITOR = { x: 440, y: 220, w: 400, h: 100 };
const EDITOR_T: Pt = { x: EDITOR.x + EDITOR.w / 2, y: EDITOR.y };
const EDITOR_B: Pt = { x: EDITOR.x + EDITOR.w / 2, y: EDITOR.y + EDITOR.h };

const SECTIONS = [
  { x: 120, y: 380, w: 190, h: 66, label: "Work Experience" },
  { x: 340, y: 380, w: 190, h: 66, label: "Education" },
  { x: 560, y: 380, w: 190, h: 66, label: "Skills" },
  { x: 780, y: 380, w: 190, h: 66, label: "+ 6 more" },
];
const SEC_T: Pt[] = SECTIONS.map((s) => ({ x: s.x + s.w / 2, y: s.y }));

const JSONB = { x: 490, y: 500, w: 300, h: 90 };
const JSONB_T: Pt = { x: JSONB.x + JSONB.w / 2, y: JSONB.y };

export const FeatureCvEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): a bad date fix means external editor + re-upload, 20 minutes ──
  const pdfOp = appear(6) * lf;
  const extOp = appear(16) * lf;
  const reupOp = appear(26) * lf;
  const pdfLit = interpolate(frame, [6, 28, 96, 116], [0, 0.45, 0.45, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1a = seg(frame, 34, 58);
  const t1aVis = frame >= 34 && frame < 80 ? 1 : 0;
  const t1b = seg(frame, 40, 64);
  const t1bVis = frame >= 40 && frame < 86 ? 1 : 0;
  const clockPillIn = seg(frame, 60, 82, Easing.out(Easing.cubic));
  const clockPillOp = clockPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–236): ProfileEditor.tsx — 9 direct sections ──
  const editorOp = appear(134, 18) * lf;
  const editorLit = interpolate(frame, [134, 156, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tSec = SECTIONS.map((_, i) => seg(frame, 156 + i * 8, 178 + i * 8));
  const tSecVis = SECTIONS.map((_, i) => (frame >= 156 + i * 8 && frame < 210 ? 1 : 0));
  const secOp = SECTIONS.map((_, i) => appear(164 + i * 8, 14) * lf);
  const secLit = SECTIONS.map((_, i) =>
    interpolate(frame, [164 + i * 8, 186 + i * 8, 330, 350], [0, 0.6, 0.6, 0.16], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const dragPillIn = seg(frame, 196, 218, Easing.out(Easing.cubic));
  const dragPillOp = dragPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): auto-saved to structured_content JSONB, instantly reused ──
  const tJ = SECTIONS.map((_, i) => seg(frame, 252 + i * 4, 276 + i * 4));
  const tJVis = SECTIONS.map((_, i) => (frame >= 252 + i * 4 && frame < 300 ? 1 : 0));
  const jsonbOp = appear(266, 18) * lf;
  const jsonbLit = interpolate(frame, [274, 296, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const usePillIn = seg(frame, 280, 302, Easing.out(Easing.cubic));
  const usePillOp = usePillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={[PDF_R, EXT_L]} color={T.danger} width={2.5} progress={t1a} opacity={0.8 * t1aVis * lf} />
      <Connector pts={[EXT_R, REUP_L]} color={T.danger} width={2.5} progress={t1b} opacity={0.8 * t1bVis * lf} />
      {SEC_T.map((p, i) => (
        <Connector key={i} pts={[EDITOR_B, p]} color={T.accent} width={2} progress={tSec[i]} opacity={0.7 * tSecVis[i] * lf} />
      ))}
      {SECTIONS.map((s, i) => (
        <Connector key={i} pts={[{ x: s.x + s.w / 2, y: s.y + s.h }, JSONB_T]} color={T.success} width={1.8} progress={tJ[i]} opacity={0.5 * tJVis[i] * lf} />
      ))}

      <SchemaNode {...PDF} state="idle" lit={pdfLit} opacity={pdfOp} label={PDF.label} fontSize={18} />
      <SchemaNode {...EXTERNAL} state="danger" lit={0.4 * extOp * lf} opacity={extOp} label={EXTERNAL.label} fontSize={17} />
      <SchemaNode {...REUPLOAD} state="danger" lit={0.4 * reupOp * lf} opacity={reupOp} label={REUPLOAD.label} fontSize={17} />
      <Token pts={[PDF_R, EXT_L]} t={t1a} color={T.danger} opacity={t1aVis * lf} />
      <Token pts={[EXT_R, REUP_L]} t={t1b} color={T.danger} opacity={t1bVis * lf} />
      <Pill x={REUPLOAD.x - 40} y={REUPLOAD.y + REUPLOAD.h + 14} dx={(1 - clockPillIn) * 40} text="a single date fix: 20 minutes" color={T.danger} opacity={clockPillOp} fontSize={17} />

      <SchemaNode {...EDITOR} state="accent" lit={editorLit} opacity={editorOp} label="ProfileEditor.tsx" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>9 expandable sections</div>
      </SchemaNode>

      {SECTIONS.map((s, i) => (
        <SchemaNode key={s.label} {...s} state="accent" lit={secLit[i]} opacity={secOp[i]} label={s.label} fontSize={15} />
      ))}
      {SEC_T.map((p, i) => (
        <Token key={i} pts={[EDITOR_B, p]} t={tSec[i]} opacity={tSecVis[i] * lf} size={10} />
      ))}
      <Pill x={SECTIONS[0].x - 20} y={SECTIONS[0].y - 46} dx={(1 - dragPillIn) * 40} text="drag & drop reordering" color={T.accent} opacity={dragPillOp} fontSize={16} />

      <SchemaNode {...JSONB} state="success" lit={jsonbLit} opacity={jsonbOp} label="structured_content" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Supabase JSONB, auto-saved</div>
      </SchemaNode>
      <Pill x={JSONB.x - 60} y={JSONB.y + JSONB.h + 14} text="→ form auto-fill · cover letters" color={T.success} opacity={usePillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A wrong date means an external editor and a 20-minute re-upload cycle" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="9 sections, direct edit — add, reorder, delete right inside the app" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every change auto-saves — no backend re-parsing needed, ever" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>20 minutes → 3 seconds, 2 clicks</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Instant sync — no re-parsing, ever again</div>
      </div>
    </AbsoluteFill>
  );
};
