/**
 * FeatureSkillsReorder — feature p45 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every job application meant manually reshuffling 30+ portfolio
 * skills across 6 categories — React up top for a frontend role, AWS/Docker
 * up top for DevOps. A SkillsList component built on Framer Motion's
 * Reorder.Group/Reorder.Item lets any visitor drag skills into place; each
 * fetches its logo from the SimpleIcons CDN and is colored by category. The
 * order persists client-side in localStorage — zero server state, zero API.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SKILLS = { x: 90, y: 66, w: 280, h: 110 };
const ROLES = { x: 500, y: 66, w: 280, h: 110 };
const SKILLS_R: Pt = { x: SKILLS.x + SKILLS.w, y: SKILLS.y + SKILLS.h / 2 };
const ROLES_L: Pt = { x: ROLES.x, y: ROLES.y + ROLES.h / 2 };

const LIST = { x: 465, y: 250, w: 350, h: 120 };
const LIST_TOP: Pt = { x: LIST.x + LIST.w / 2, y: LIST.y };
const LIST_R: Pt = { x: LIST.x + LIST.w, y: LIST.y + LIST.h / 2 };

const ICONS = { x: 870, y: 266, w: 260, h: 96 };
const ICONS_L: Pt = { x: ICONS.x, y: ICONS.y + ICONS.h / 2 };

const STORAGE = { x: 465, y: 430, w: 350, h: 96 };
const STORAGE_TOP: Pt = { x: STORAGE.x + STORAGE.w / 2, y: STORAGE.y };
const LIST_BOTTOM: Pt = { x: LIST.x + LIST.w / 2, y: LIST.y + LIST.h };

const ROLES_TO_LIST: Pt[] = [ROLES_L, { x: ROLES_L.x - 40, y: ROLES_L.y }, LIST_TOP];
const LIST_TO_ICONS: Pt[] = [LIST_R, ICONS_L];
const LIST_TO_STORAGE: Pt[] = [LIST_BOTTOM, STORAGE_TOP];

export const FeatureSkillsReorder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: manual reshuffle of 30+ skills, per role
  const skillsOp = appear(6) * lf;
  const rolesOp = appear(20) * lf;
  const rolesLit = interpolate(frame, [20, 44, 108, 128], [0, 0.6, 0.6, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: SkillsList — Framer Motion Reorder, SimpleIcons per category
  const listOp = appear(140, 18) * lf;
  const iconsOp = appear(158, 18) * lf;
  const listLit = interpolate(frame, [140, 165, 330, 350], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 150, 178);
  const t2Vis = frame >= 150 && frame < 214 ? 1 : 0;
  const t2b = seg(frame, 186, 212);
  const t2bVis = frame >= 186 && frame < 232 ? 1 : 0;
  const iconsLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 162, 184, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: order persists in localStorage, zero server calls
  const storageOp = appear(244, 18) * lf;
  const storageLit = interpolate(frame, [252, 274, 330, 350], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={ROLES_TO_LIST} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={LIST_TO_ICONS} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={LIST_TO_STORAGE} color={T.amber} width={2} dashed opacity={0.6 * t3Vis * lf} />

      <SchemaNode {...SKILLS} state="danger" lit={0.2 * lf} opacity={skillsOp} label="30+ skills, 6 categories" fontSize={19}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>reshuffled by hand</div>
      </SchemaNode>
      <SchemaNode {...ROLES} state="danger" lit={rolesLit} opacity={rolesOp} label="React role vs DevOps role" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>different order, every time</div>
      </SchemaNode>
      <Pill x={ROLES.x + 10} y={ROLES.y - 46} dx={pill1Dx} text="a time-sink for every application" color={T.danger} opacity={pill1Op} fontSize={17} />

      <SchemaNode {...LIST} state="accent" lit={listLit} opacity={listOp} label="SkillsList" fontSize={23}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>Framer Motion Reorder.Group/Item</div>
      </SchemaNode>
      <SchemaNode {...ICONS} state="accent" lit={iconsLit} opacity={iconsOp} label="SimpleIcons CDN" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>6 category colors</div>
      </SchemaNode>
      <Token pts={ROLES_TO_LIST} t={t2} opacity={t2Vis * lf} />
      <Token pts={LIST_TO_ICONS} t={t2b} opacity={t2bVis * lf} />
      <Pill x={LIST.x + 30} y={LIST.y + LIST.h + 14} dx={pill2Dx} text="drag any skill to the top" color={T.accent} opacity={pill2Op} fontSize={18} />

      <SchemaNode {...STORAGE} state="amber" lit={storageLit} opacity={storageOp} label="localStorage only" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>vitalii_skills_list · zero API calls</div>
      </SchemaNode>
      <Pill x={STORAGE.x + 40} y={STORAGE.y + STORAGE.h + 12} dx={pill3Dx} text="no auth, no server-side state" color={T.amber} opacity={pill3Op} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="A manual reshuffle before every single job application" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Any visitor drags skills into place, colored by category" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="The order sticks client-side — nothing touches the server" color={T.amber} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>snappy, performant, zero server load</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>a manual chore, now a 2-second drag-and-drop</div>
      </div>
    </AbsoluteFill>
  );
};
