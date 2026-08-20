/**
 * FeatureCvParser — feature j03 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: onboarding demands 9 structured profile sections, manual entry
 * causes abandonment → PDF upload hits Supabase Storage → analyze_profile
 * Edge Function extracts text and calls Azure GPT-4 against a strict 9-section
 * JSON schema → output validated and versioned into user_profiles JSONB →
 * "30+ min → 12 seconds, complete profile from day one".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FORM = { x: 465, y: 70, w: 350, h: 100 };

const PDF = { x: 70, y: 330, w: 190, h: 88 };
const EDGE = { x: 330, y: 330, w: 280, h: 104 };
const AI = { x: 680, y: 330, w: 210, h: 104 };
const JSONB = { x: 960, y: 330, w: 240, h: 104 };

const PDF_R: Pt = { x: PDF.x + PDF.w, y: PDF.y + PDF.h / 2 };
const EDGE_L: Pt = { x: EDGE.x, y: EDGE.y + EDGE.h / 2 };
const EDGE_R: Pt = { x: EDGE.x + EDGE.w, y: EDGE.y + EDGE.h / 2 };
const AI_L: Pt = { x: AI.x, y: AI.y + AI.h / 2 };
const AI_R: Pt = { x: AI.x + AI.w, y: AI.y + AI.h / 2 };
const JSONB_L: Pt = { x: JSONB.x, y: JSONB.y + JSONB.h / 2 };
const JSONB_BOTTOM: Pt = { x: JSONB.x + JSONB.w / 2, y: JSONB.y + JSONB.h };

const P_PDF: Pt[] = [PDF_R, EDGE_L];
const P_MID: Pt[] = [EDGE_R, AI_L];
const P_OUT: Pt[] = [AI_R, JSONB_L];

const SECTIONS = ["personalInfo", "workExperience", "education", "skills", "languages", "certifications"];
const CHIP_XS = [530, 690, 850, 570, 730, 890];
const CHIP_Y = [480, 480, 480, 550, 550, 550];

export const FeatureCvParser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): manual 9-section form, high abandonment ──
  const formOp = Math.min(1, pop(10)) * lf;
  const formLit = interpolate(frame, [10, 34, 100, 118], [0, 0.6, 0.6, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const pillIn = seg(frame, 34, 56, Easing.out(Easing.cubic));
  const pillOp = pillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–240): PDF → edge fn → GPT-4 → JSONB, schema chips fan out ──
  const pdfOp = appear(130, 16) * lf;
  const tPdf = seg(frame, 148, 170);
  const tPdfVis = frame >= 148 && frame < 200 ? 1 : 0;
  const edgeOp = appear(148, 18) * lf;
  const edgeLit = interpolate(frame, [156, 178, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tMid = seg(frame, 182, 204);
  const tMidVis = frame >= 182 && frame < 218 ? 1 : 0;
  const aiOp = appear(182, 18) * lf;
  const aiLit = interpolate(frame, [190, 212, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tOut = seg(frame, 216, 236);
  const tOutVis = frame >= 216 && frame < 250 ? 1 : 0;
  const jsonbOp = appear(224, 18) * lf;
  const jsonbLit = interpolate(frame, [232, 254, 330, 350], [0, 0.6, 0.6, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 186, 208, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [238, 258], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const chipOp = SECTIONS.map((_, i) => appear(238 + i * 10, 14) * interpolate(frame, [312, 334], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf);

  // ── Beat 3 (240–338): validated + versioned into JSONB ──
  const checkScale = pop(280) * lf;
  const validPillIn = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const validPillOp = validPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 270, 292, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_PDF} color={T.accent} width={2.5} progress={tPdf} opacity={0.8 * tPdfVis * lf} />
      <Connector pts={P_MID} color={T.accent} width={2.5} progress={tMid} opacity={0.8 * tMidVis * lf} />
      <Connector pts={P_OUT} color={T.accent} width={2.5} progress={tOut} opacity={0.8 * tOutVis * lf} />

      <SchemaNode {...FORM} state="danger" lit={formLit} opacity={formOp} label="9 sections, by hand" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>workExperience, skills, ...</div>
      </SchemaNode>
      <Pill x={FORM.x + 30} y={FORM.y - 46} text="30+ min, high abandonment" color={T.danger} opacity={pillOp} fontSize={20} />

      <SchemaNode {...PDF} state="accent" lit={0.35 * Math.min(1, pdfOp) * lf} opacity={pdfOp} label="PDF resume" fontSize={19} />
      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="analyze_profile" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno Edge Fn · PDF parsing</div>
      </SchemaNode>
      <SchemaNode {...AI} state="accent" lit={aiLit} opacity={aiOp} label="Azure GPT-4" fontSize={20} />
      <SchemaNode {...JSONB} state="success" lit={jsonbLit} opacity={jsonbOp} label="user_profiles" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>JSONB, versioned</div>
      </SchemaNode>

      <Token pts={P_PDF} t={tPdf} opacity={tPdfVis * lf} />
      <Token pts={P_MID} t={tMid} opacity={tMidVis * lf} />
      <Token pts={P_OUT} t={tOut} opacity={tOutVis * lf} />

      {SECTIONS.map((s, i) => (
        <Pill key={s} x={CHIP_XS[i]} y={CHIP_Y[i]} text={s} color={T.accent} opacity={chipOp[i]} fontSize={16} />
      ))}

      <Badge x={JSONB_BOTTOM.x - 18} y={JSONB_BOTTOM.y + 8} kind="check" scale={checkScale} opacity={checkScale} />
      <Pill x={JSONB.x - 40} y={JSONB.y - 46} text="schema validated · versioned" color={T.amber} opacity={validPillOp} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="30+ minutes of manual entry across 9 sections → abandoned profiles" color={T.text} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Strict JSON schema — 9 sections, every field typed" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Validated output, versioned for future edits" color={T.amber} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>30+ minutes → 12-second PDF upload</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Complete, structured profile from day one</div>
      </div>
    </AbsoluteFill>
  );
};
