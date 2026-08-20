/**
 * FeatureAiFeaturePosts — feature p62 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: crafting a unique feature post per project was a 2-3h/week grind of
 * customizing static templates that still felt generic → generateFeaturePost
 * Edge Function fetches project data (title, tech stack, URL) from the
 * projects table, builds a context-rich prompt from ai_prompts templates,
 * and sends it to Gemini AI → the structured JSON response is validated and
 * stored in feature_posts, auto-queued for publishing → 100% AI-generated,
 * +40% content variety, 2-3h/week reclaimed.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TEMPLATES = { x: 70, y: 50, w: 260, h: 88 };
const PROJECTS = { x: 70, y: 190, w: 260, h: 88 };
const PROJECTS_R: Pt = { x: PROJECTS.x + PROJECTS.w, y: PROJECTS.y + PROJECTS.h / 2 };

const FUNC = { x: 420, y: 120, w: 300, h: 100 };
const FUNC_L: Pt = { x: FUNC.x, y: FUNC.y + FUNC.h / 2 };
const FUNC_R: Pt = { x: FUNC.x + FUNC.w, y: FUNC.y + FUNC.h / 2 };
const FUNC_B: Pt = { x: FUNC.x + FUNC.w / 2, y: FUNC.y + FUNC.h };

const GEMINI = { x: 800, y: 120, w: 210, h: 100 };
const GEMINI_L: Pt = { x: GEMINI.x, y: GEMINI.y + GEMINI.h / 2 };
const GEMINI_B: Pt = { x: GEMINI.x + GEMINI.w / 2, y: GEMINI.y + GEMINI.h };

const POSTS = { x: 420, y: 330, w: 300, h: 90 };
const POSTS_T: Pt = { x: POSTS.x + POSTS.w / 2, y: POSTS.y };

const PROJECTS_TO_FUNC: Pt[] = [PROJECTS_R, FUNC_L];
const FUNC_TO_GEMINI: Pt[] = [FUNC_R, GEMINI_L];
const GEMINI_TO_POSTS: Pt[] = [GEMINI_B, { x: GEMINI_B.x, y: 290 }, POSTS_T];

export const FeatureAiFeaturePosts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: static templates, still felt generic
  const templatesOp = pop(6) * lf;
  const templatesLit = interpolate(frame, [6, 28, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const projectsOp = appear(24) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: generateFeaturePost() pulls project data, prompts Gemini
  const t2a = seg(frame, 148, 172);
  const t2aVis = frame >= 148 && frame < 194 ? 1 : 0;
  const t2b = seg(frame, 180, 204);
  const t2bVis = frame >= 180 && frame < 226 ? 1 : 0;
  const funcOp = appear(148, 18) * lf;
  const funcLit = interpolate(frame, [156, 178, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const geminiOp = appear(184, 18) * lf;
  const geminiLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: validated JSON stored, auto-queued for publishing
  const t3 = seg(frame, 250, 278);
  const t3Vis = frame >= 250 && frame < 320 ? 1 : 0;
  const postsOp = appear(266, 18) * lf;
  const postsLit = interpolate(frame, [274, 296, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 282, 304, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
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

      <Connector pts={PROJECTS_TO_FUNC} color={T.accent} width={2.5} progress={t2a} opacity={0.8 * t2aVis * lf} />
      <Connector pts={FUNC_TO_GEMINI} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={GEMINI_TO_POSTS} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...TEMPLATES} state="danger" lit={templatesLit} opacity={templatesOp} label="Static templates" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>customized by hand, still generic</div>
      </SchemaNode>
      <SchemaNode {...PROJECTS} state="idle" lit={0} opacity={projectsOp} label="projects table" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>title, tech stack, URL</div>
      </SchemaNode>
      <Badge x={TEMPLATES.x + TEMPLATES.w - 20} y={TEMPLATES.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />
      <Pill x={TEMPLATES.x} y={TEMPLATES.y + TEMPLATES.h + 14} text="2-3h/week, still felt copy-pasted" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...FUNC} state="accent" lit={funcLit} opacity={funcOp} label="generateFeaturePost()" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>Edge Function · ai_prompts template</div>
      </SchemaNode>
      <Token pts={PROJECTS_TO_FUNC} t={t2a} opacity={t2aVis * lf} />

      <SchemaNode {...GEMINI} state="accent" lit={geminiLit} opacity={geminiOp} label="Gemini AI" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>structured JSON post</div>
      </SchemaNode>
      <Token pts={FUNC_TO_GEMINI} t={t2b} opacity={t2bVis * lf} />
      <Pill x={FUNC.x + 10} y={FUNC.y - 46} text="emojis + hashtags, on-brand" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...POSTS} state="success" lit={postsLit} opacity={postsOp} label="feature_posts table" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>validated, queued to publish</div>
      </SchemaNode>
      <Token pts={GEMINI_TO_POSTS} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={POSTS.x + 10} y={POSTS.y + POSTS.h + 14} text="LinkedIn · Instagram · Facebook" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Manually customizing templates: 2-3h/week, output still felt generic" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="generateFeaturePost() builds a prompt from project data and asks Gemini" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Validated JSON lands in feature_posts, queued across three platforms" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>100% AI-generated · +40% content variety</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>2-3h/week of copywriting reclaimed</div>
      </div>
    </AbsoluteFill>
  );
};
