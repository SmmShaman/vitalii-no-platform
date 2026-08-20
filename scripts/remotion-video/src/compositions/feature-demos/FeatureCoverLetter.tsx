/**
 * FeatureCoverLetter — feature j02 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a blank søknad page vs. bokmål/culture/structure requirements (40-60
 * min grind) → generate_application Edge Function pulls the job + CV profile
 * into Azure GPT-4, which writes cover_letter_no + cover_letter_uk in one
 * shot → the Ukrainian draft is reviewed, one Approve tap finalizes the
 * Norwegian letter → "8 seconds, 2-3 → 15+ letters/day".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BLANK = { x: 465, y: 68, w: 350, h: 100 };
const TAGS = [
  { label: "bokmål", dx: -290, dy: 40 },
  { label: "cultural nuance", dx: 230, dy: -10 },
  { label: "letter structure", dx: -260, dy: 110 },
];

const JOB = { x: 80, y: 260, w: 220, h: 88 };
const CV = { x: 80, y: 380, w: 220, h: 88 };
const EDGE = { x: 420, y: 300, w: 300, h: 108 };
const AI = { x: 850, y: 300, w: 250, h: 108 };
const NO = { x: 720, y: 470, w: 220, h: 84 };
const UK = { x: 990, y: 470, w: 220, h: 84 };

const JOB_R: Pt = { x: JOB.x + JOB.w, y: JOB.y + JOB.h / 2 };
const CV_R: Pt = { x: CV.x + CV.w, y: CV.y + CV.h / 2 };
const EDGE_L: Pt = { x: EDGE.x, y: EDGE.y + EDGE.h / 2 };
const EDGE_R: Pt = { x: EDGE.x + EDGE.w, y: EDGE.y + EDGE.h / 2 };
const AI_L: Pt = { x: AI.x, y: AI.y + AI.h / 2 };
const AI_BOTTOM: Pt = { x: AI.x + AI.w / 2, y: AI.y + AI.h };
const NO_TOP: Pt = { x: NO.x + NO.w / 2, y: NO.y };
const UK_TOP: Pt = { x: UK.x + UK.w / 2, y: UK.y };

const P_JOB: Pt[] = [JOB_R, EDGE_L];
const P_CV: Pt[] = [CV_R, EDGE_L];
const P_MID: Pt[] = [EDGE_R, AI_L];
const P_NO: Pt[] = [AI_BOTTOM, NO_TOP];
const P_UK: Pt[] = [AI_BOTTOM, UK_TOP];

export const FeatureCoverLetter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): blank page vs. requirement tags ──
  const blankOp = Math.min(1, pop(10)) * lf;
  const blankLit = interpolate(frame, [10, 34, 100, 118], [0, 0.6, 0.6, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tagOp = TAGS.map((_, i) => appear(28 + i * 16) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf);
  const tagDx = TAGS.map((_, i) => (1 - Math.min(1, appear(28 + i * 16))) * 30);
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;
  const timePillIn = seg(frame, 36, 58, Easing.out(Easing.cubic));
  const timePillOp = timePillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 2 (128–234): job+CV → edge fn → GPT-4 → two letters ──
  const jobOp = appear(130, 16) * lf;
  const cvOp = appear(140, 16) * lf;
  const tJob = seg(frame, 150, 172);
  const tJobVis = frame >= 150 && frame < 210 ? 1 : 0;
  const tCv = seg(frame, 156, 178);
  const tCvVis = frame >= 156 && frame < 210 ? 1 : 0;
  const edgeOp = appear(150, 18) * lf;
  const edgeLit = interpolate(frame, [160, 182, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tMid = seg(frame, 186, 210);
  const tMidVis = frame >= 186 && frame < 222 ? 1 : 0;
  const aiOp = appear(186, 18) * lf;
  const aiLit = interpolate(frame, [196, 216, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tNo = seg(frame, 214, 236);
  const tNoVis = frame >= 214 && frame < 246 ? 1 : 0;
  const tUk = seg(frame, 214, 236);
  const tUkVis = frame >= 214 && frame < 246 ? 1 : 0;
  const noOp = appear(224, 18) * lf;
  const ukOp = appear(224, 18) * lf;
  const cap2In = seg(frame, 190, 212, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [244, 264], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (240–338): Approve tap on the Ukrainian draft ──
  const ukLit = interpolate(frame, [244, 264, 300, 320], [0.2, 0.85, 0.85, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const approvePillIn = seg(frame, 250, 272, Easing.out(Easing.cubic));
  const approvePillOp = approvePillIn * interpolate(frame, [292, 312], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const approveDx = (1 - approvePillIn) * 30;
  const noSuccessScale = pop(296) * lf;
  const noState: "accent" | "success" = frame >= 296 ? "success" : "accent";
  const costPillIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const costPillOp = costPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const costDx = (1 - costPillIn) * 30;
  const cap3In = seg(frame, 252, 274, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [324, 344], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_JOB} color={T.accent} width={2.5} progress={tJob} opacity={0.8 * tJobVis * lf} />
      <Connector pts={P_CV} color={T.accent} width={2.5} progress={tCv} opacity={0.8 * tCvVis * lf} />
      <Connector pts={P_MID} color={T.accent} width={2.5} progress={tMid} opacity={0.8 * tMidVis * lf} />
      <Connector pts={P_NO} color={T.success} width={2.5} progress={tNo} opacity={0.75 * tNoVis * lf} />
      <Connector pts={P_UK} color={T.accent} width={2.5} progress={tUk} opacity={0.75 * tUkVis * lf} />

      <SchemaNode {...BLANK} state="danger" lit={blankLit} opacity={blankOp} label="Blank søknad" fontSize={26}>
        <div style={{ fontSize: 15, color: T.muted, fontWeight: 500, marginTop: 2 }}>0 words, deadline looming</div>
      </SchemaNode>
      {TAGS.map((t, i) => (
        <Pill key={t.label} x={BLANK.x + BLANK.w / 2 - 70 + t.dx} y={BLANK.y + t.dy} dx={tagDx[i]} text={t.label} color={T.danger} opacity={tagOp[i]} fontSize={18} />
      ))}
      <Pill x={BLANK.x + 40} y={BLANK.y - 46} text="40–60 min per letter" color={T.danger} opacity={timePillOp} fontSize={20} />

      <SchemaNode {...JOB} state="accent" lit={0.35 * Math.min(1, jobOp) * lf} opacity={jobOp} label="job listing" fontSize={20} />
      <SchemaNode {...CV} state="accent" lit={0.35 * Math.min(1, cvOp) * lf} opacity={cvOp} label="active CV profile" fontSize={19} />
      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="generate_application" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno Edge Function</div>
      </SchemaNode>
      <SchemaNode {...AI} state="accent" lit={aiLit} opacity={aiOp} label="Azure GPT-4" fontSize={22} />
      <SchemaNode {...NO} state={noState} lit={Math.max(0.3, noSuccessScale * 0.8) * lf} opacity={noOp} label="cover_letter_no" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>formal Bokmål</div>
      </SchemaNode>
      <SchemaNode {...UK} state="accent" lit={ukLit} opacity={ukOp} label="cover_letter_uk" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>for review</div>
      </SchemaNode>

      <Token pts={P_JOB} t={tJob} opacity={tJobVis * lf} />
      <Token pts={P_CV} t={tCv} opacity={tCvVis * lf} />
      <Token pts={P_MID} t={tMid} opacity={tMidVis * lf} />
      <Token pts={P_NO} t={tNo} color={T.success} opacity={tNoVis * lf} />
      <Token pts={P_UK} t={tUk} opacity={tUkVis * lf} />

      <Pill x={UK.x + 40} y={UK.y + UK.h + 12} dx={approveDx} text="✓ Approve" color={T.success} opacity={approvePillOp} fontSize={19} />
      <Pill x={EDGE.x + 30} y={EDGE.y - 46} dx={costDx} text="tokens & cost tracked" color={T.amber} opacity={costPillOp} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="Every quality application ate 40–60 minutes, 10–15 times a week" color={T.text} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Greeting → company fit → experience → motivation → closing" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Review the Ukrainian draft, tap Approve — Bokmål letter is ready" color={T.success} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Generate → complete søknad in 8 seconds</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>2–3 → 15+ letters sent per day</div>
      </div>
    </AbsoluteFill>
  );
};
