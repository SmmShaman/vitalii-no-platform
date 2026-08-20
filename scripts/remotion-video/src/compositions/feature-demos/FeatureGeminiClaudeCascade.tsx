/**
 * FeatureGeminiClaudeCascade — feature p68 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Gemini 2.5 Flash's periodic 503 overload windows silently killed
 * every one of the 10+ edge functions importing _shared/gemini-llm.ts — the
 * daily pipeline would just produce zero output → callLLM() was refactored
 * into a two-provider cascade: it tries callGemini() first, and on any
 * exception logs a warning and calls callClaude() against the Anthropic
 * Messages API, same interface, no per-function changes needed → one shared
 * config change protects 10+ functions from total pipeline failure.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const GEMINI_DOWN = { x: 150, y: 56, w: 380, h: 90 };
const GEMINI_DOWN_R: Pt = { x: GEMINI_DOWN.x + GEMINI_DOWN.w, y: GEMINI_DOWN.y + GEMINI_DOWN.h / 2 };

const FUNCS_DEAD = { x: 650, y: 56, w: 380, h: 90 };
const FUNCS_DEAD_L: Pt = { x: FUNCS_DEAD.x, y: FUNCS_DEAD.y + FUNCS_DEAD.h / 2 };

const CALLLLM = { x: 150, y: 240, w: 380, h: 96 };
const CALLLLM_R: Pt = { x: CALLLLM.x + CALLLLM.w, y: CALLLLM.y + CALLLLM.h / 2 };
const CALLLLM_B: Pt = { x: CALLLLM.x + CALLLLM.w / 2, y: CALLLLM.y + CALLLLM.h };

const GEMINI_TRY = { x: 650, y: 240, w: 380, h: 96 };
const GEMINI_TRY_L: Pt = { x: GEMINI_TRY.x, y: GEMINI_TRY.y + GEMINI_TRY.h / 2 };
const GEMINI_TRY_B: Pt = { x: GEMINI_TRY.x + GEMINI_TRY.w / 2, y: GEMINI_TRY.y + GEMINI_TRY.h };

const CLAUDE_FALLBACK = { x: 380, y: 410, w: 440, h: 92 };
const CLAUDE_FALLBACK_T: Pt = { x: CLAUDE_FALLBACK.x + CLAUDE_FALLBACK.w / 2, y: CLAUDE_FALLBACK.y };

const GEMINI_TO_FUNCS: Pt[] = [GEMINI_DOWN_R, FUNCS_DEAD_L];
const CALLLLM_TO_GEMINI: Pt[] = [CALLLLM_R, GEMINI_TRY_L];
const GEMINI_TO_CLAUDE: Pt[] = [GEMINI_TRY_B, { x: GEMINI_TRY_B.x, y: 370 }, CLAUDE_FALLBACK_T];

export const FeatureGeminiClaudeCascade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: Gemini 503 silently kills 10+ edge functions
  const geminiDownOp = pop(6) * lf;
  const geminiDownLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t1 = seg(frame, 24, 48);
  const t1Vis = frame >= 24 && frame < 70 ? 1 : 0;
  const funcsDeadOp = appear(30, 18) * lf;
  const funcsDeadLit = interpolate(frame, [36, 58, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: callLLM() cascade tries Gemini first
  const t2 = seg(frame, 152, 178);
  const t2Vis = frame >= 152 && frame < 200 ? 1 : 0;
  const callllmOp = appear(148, 18) * lf;
  const callllmLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const geminiTryOp = appear(184, 18) * lf;
  const geminiTryLit = interpolate(frame, [188, 210, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: exception → callClaude(), same interface
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const claudeOp = appear(268, 18) * lf;
  const claudeLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={GEMINI_TO_FUNCS} color={T.danger} width={2.5} progress={t1} opacity={0.8 * t1Vis * lf} />
      <Connector pts={CALLLLM_TO_GEMINI} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={GEMINI_TO_CLAUDE} color={T.amber} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} dashed />

      <SchemaNode {...GEMINI_DOWN} state="danger" lit={geminiDownLit} opacity={geminiDownOp} label="Gemini 503 overload" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>periodic, unpredictable</div>
      </SchemaNode>
      <SchemaNode {...FUNCS_DEAD} state="danger" lit={funcsDeadLit} opacity={funcsDeadOp} label="10+ edge functions die" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>found out an hour later</div>
      </SchemaNode>
      <Token pts={GEMINI_TO_FUNCS} t={t1} color={T.danger} opacity={t1Vis * lf} />
      <Badge x={FUNCS_DEAD.x + FUNCS_DEAD.w - 20} y={FUNCS_DEAD.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />

      <SchemaNode {...CALLLLM} state="accent" lit={callllmLit} opacity={callllmOp} label="callLLM() cascade" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>_shared/gemini-llm.ts</div>
      </SchemaNode>
      <SchemaNode {...GEMINI_TRY} state="accent" lit={geminiTryLit} opacity={geminiTryOp} label="callGemini() tried first" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>same as before</div>
      </SchemaNode>
      <Token pts={CALLLLM_TO_GEMINI} t={t2} opacity={t2Vis * lf} />
      <Pill x={CALLLLM.x + 10} y={CALLLLM.y - 46} text="extracts GOOGLE_API_KEY + ANTHROPIC_API_KEY" color={T.accent} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...CLAUDE_FALLBACK} state="success" lit={claudeLit} opacity={claudeOp} label="callClaude() on exception" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Anthropic Messages API, same interface</div>
      </SchemaNode>
      <Token pts={GEMINI_TO_CLAUDE} t={t3} color={T.amber} opacity={t3Vis * lf} />
      <Pill x={CLAUDE_FALLBACK.x + 20} y={CLAUDE_FALLBACK.y + CLAUDE_FALLBACK.h + 14} text="zero changes in any importing function" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="A Gemini 503 window silently killed every function that imported it" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="callLLM() still tries Gemini first, exactly like before" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Any exception falls straight through to Claude, same call signature" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>~1s added latency during outages, vs total failure before</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>one config change, 10+ functions protected</div>
      </div>
    </AbsoluteFill>
  );
};
