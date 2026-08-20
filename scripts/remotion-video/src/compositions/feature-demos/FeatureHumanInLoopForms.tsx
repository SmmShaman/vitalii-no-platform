/**
 * FeatureHumanInLoopForms — feature j22 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Skyvern's fill_form hits a dynamic field no CV has ("Bor du i
 * Norge?", security clearance) and auto_apply.py crashes → a pause_and_ask
 * mechanism writes the field to registration_questions and the worker asks
 * the user in Telegram (InlineKeyboard Ja/Nei or free text) → the worker
 * polls with a 5-minute timeout, then caches the answer in user_answers
 * keyed by question hash so it resumes fill_form and gets reused next time
 * → "100% of unknown-field failures eliminated".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FORM = { x: 465, y: 60, w: 350, h: 100 };
const FORM_BOTTOM: Pt = { x: FORM.x + FORM.w / 2, y: FORM.y + FORM.h };

const QUESTIONS = { x: 90, y: 240, w: 280, h: 100 };
const TELEGRAM = { x: 460, y: 240, w: 280, h: 100 };
const QUESTIONS_R: Pt = { x: QUESTIONS.x + QUESTIONS.w, y: QUESTIONS.y + QUESTIONS.h / 2 };
const TELEGRAM_L: Pt = { x: TELEGRAM.x, y: TELEGRAM.y + TELEGRAM.h / 2 };
const FORM_TO_QUESTIONS: Pt[] = [FORM_BOTTOM, { x: QUESTIONS.x + QUESTIONS.w / 2, y: QUESTIONS.y }];

const CACHE = { x: 830, y: 240, w: 300, h: 100 };
const CACHE_L: Pt = { x: CACHE.x, y: CACHE.y + CACHE.h / 2 };
const TELEGRAM_R: Pt = { x: TELEGRAM.x + TELEGRAM.w, y: TELEGRAM.y + TELEGRAM.h / 2 };

const RESUME = { x: 465, y: 430, w: 350, h: 96 };
const RESUME_TOP: Pt = { x: RESUME.x + RESUME.w / 2, y: RESUME.y };
const TELEGRAM_BOTTOM: Pt = { x: TELEGRAM.x + TELEGRAM.w / 2, y: TELEGRAM.y + TELEGRAM.h };

export const FeatureHumanInLoopForms: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): fill_form hits unknown field, crashes ──
  const formOp = appear(6) * lf;
  const formLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const crossScale = pop(36) * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): pause_and_ask writes registration_questions → Telegram ──
  const qOp = appear(140, 18) * lf;
  const tgOp = appear(158, 18) * lf;
  const qLit = interpolate(frame, [140, 165, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const tgLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): poll with 5-min timeout → cache in user_answers ──
  const cacheOp = appear(196, 18) * lf;
  const cacheLit = interpolate(frame, [204, 226, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3a = seg(frame, 206, 232);
  const t3aVis = frame >= 206 && frame < 260 ? 1 : 0;
  const resumeOp = appear(244, 18) * lf;
  const resumeLit = interpolate(frame, [252, 274, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3b = seg(frame, 254, 280);
  const t3bVis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={FORM_TO_QUESTIONS} color={T.danger} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={[QUESTIONS_R, TELEGRAM_L]} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={[TELEGRAM_R, CACHE_L]} color={T.accent} width={2.5} progress={t3a} opacity={0.8 * t3aVis * lf} />
      <Connector pts={[TELEGRAM_BOTTOM, RESUME_TOP]} color={T.success} width={2.5} progress={t3b} opacity={0.8 * t3bVis * lf} />

      <SchemaNode {...FORM} state="danger" lit={formLit} opacity={formOp} label="Skyvern fill_form()" fontSize={22}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>"Bor du i Norge?" — unknown field</div>
      </SchemaNode>
      <Badge x={FORM.x + FORM.w / 2 - 18} y={FORM.y - 46} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={FORM.x + 20} y={FORM.y + FORM.h + 14} dx={pill1Dx} text="auto_apply.py crashes" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...QUESTIONS} state="accent" lit={qLit} opacity={qOp} label="registration_questions" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>field ID + question</div>
      </SchemaNode>
      <SchemaNode {...TELEGRAM} state="accent" lit={tgLit} opacity={tgOp} label="Telegram · InlineKeyboard" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>"Ja / Nei" or free text</div>
      </SchemaNode>
      <Token pts={FORM_TO_QUESTIONS} t={t2} color={T.danger} opacity={t2Vis * lf} />
      <Token pts={[QUESTIONS_R, TELEGRAM_L]} t={t2b} opacity={t2bVis * lf} />
      <Pill x={TELEGRAM.x - 10} y={TELEGRAM.y - 46} dx={pill2Dx} text="user asked directly, 2-3 questions" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...CACHE} state="amber" lit={cacheLit} opacity={cacheOp} label="user_answers cache" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>keyed by question hash</div>
      </SchemaNode>
      <Token pts={[TELEGRAM_R, CACHE_L]} t={t3a} opacity={t3aVis * lf} />

      <SchemaNode {...RESUME} state="success" lit={resumeLit} opacity={resumeOp} label="fill_form() resumes" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>5-min poll timeout on registration_questions</div>
      </SchemaNode>
      <Token pts={[TELEGRAM_BOTTOM, RESUME_TOP]} t={t3b} color={T.success} opacity={t3bVis * lf} />
      <Pill x={RESUME.x + 20} y={RESUME.y + RESUME.h + 12} dx={pill3Dx} text="cached answers reused next time" color={T.success} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="A field no CV covers used to crash the whole application" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="The bot pauses and asks the user directly, in Telegram" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Answers are cached and reused across future applications" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>under 30 seconds per question</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>100% of unknown-field failures eliminated</div>
      </div>
    </AbsoluteFill>
  );
};
