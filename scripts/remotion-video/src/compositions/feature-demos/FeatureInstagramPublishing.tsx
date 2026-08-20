/**
 * FeatureInstagramPublishing — feature p15 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: strict aspect ratio rules, mandatory business accounts, and
 * cryptic errors (#10, #24, #100, #190) drove a 40% failure rate →
 * post-to-instagram (Deno) creates a Reels container, polls its status
 * every 10s up to 30 times, then publishes → aspect ratio is validated
 * locally before the API call, and every error code maps to a clear fix →
 * failure rate plummets from 40% to under 5%.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ERRORS = { x: 460, y: 30, w: 360, h: 80 };
const POSTFN = { x: 460, y: 150, w: 360, h: 80 };
const CONTAINER = { x: 90, y: 290, w: 280, h: 90 };
const POLL = { x: 500, y: 290, w: 280, h: 90 };
const PUBLISH = { x: 900, y: 290, w: 280, h: 90 };
const VALIDATE = { x: 230, y: 430, w: 380, h: 80 };
const ERRMAP = { x: 670, y: 430, w: 380, h: 80 };

const ERRORS_B: Pt = { x: ERRORS.x + ERRORS.w / 2, y: ERRORS.y + ERRORS.h };
const POSTFN_T: Pt = { x: POSTFN.x + POSTFN.w / 2, y: POSTFN.y };
const POSTFN_B: Pt = { x: POSTFN.x + POSTFN.w / 2, y: POSTFN.y + POSTFN.h };
const CONTAINER_T: Pt = { x: CONTAINER.x + CONTAINER.w / 2, y: CONTAINER.y };
const CONTAINER_R: Pt = { x: CONTAINER.x + CONTAINER.w, y: CONTAINER.y + CONTAINER.h / 2 };
const POLL_L: Pt = { x: POLL.x, y: POLL.y + POLL.h / 2 };
const POLL_R: Pt = { x: POLL.x + POLL.w, y: POLL.y + POLL.h / 2 };
const PUBLISH_L: Pt = { x: PUBLISH.x, y: PUBLISH.y + PUBLISH.h / 2 };
const VALIDATE_T: Pt = { x: VALIDATE.x + VALIDATE.w / 2, y: VALIDATE.y };
const ERRMAP_T: Pt = { x: ERRMAP.x + ERRMAP.w / 2, y: ERRMAP.y };

const P_ERR_POST: Pt[] = [ERRORS_B, POSTFN_T];
const P_POST_CONT: Pt[] = [POSTFN_B, CONTAINER_T];
const P_CONT_POLL: Pt[] = [CONTAINER_R, POLL_L];
const P_POLL_PUB: Pt[] = [POLL_R, PUBLISH_L];
const P_POST_VAL: Pt[] = [POSTFN_B, VALIDATE_T];
const P_POST_MAP: Pt[] = [POSTFN_B, ERRMAP_T];

export const FeatureInstagramPublishing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–108): cryptic errors, 40% failure rate ──
  const errOp = Math.min(1, pop(4)) * lf;
  const errLit = interpolate(frame, [4, 26, 86, 106], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const failPillIn = seg(frame, 30, 52, Easing.out(Easing.cubic));
  const failPillOp = failPillIn * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 18, 40, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (112–248): Reels container → poll → publish ──
  const tEp = seg(frame, 114, 136);
  const tEpVis = frame >= 114 && frame < 190 ? 1 : 0;
  const postOp = appear(118, 18) * lf;
  const postLit = interpolate(frame, [126, 148, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tPc = seg(frame, 150, 172);
  const tPcVis = frame >= 150 && frame < 330 ? 1 : 0;
  const contOp = appear(154, 18) * lf;
  const contLit = interpolate(frame, [162, 184, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tCp = seg(frame, 176, 198);
  const tCpVis = frame >= 176 && frame < 330 ? 1 : 0;
  const pollOp = appear(180, 18) * lf;
  const pollLit = interpolate(frame, [188, 210, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tPp = seg(frame, 202, 224);
  const tPpVis = frame >= 202 && frame < 330 ? 1 : 0;
  const pubOp = appear(206, 18) * lf;
  const pubLit = interpolate(frame, [214, 236, 330, 350], [0, 0.8, 0.8, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 156, 178, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [240, 260], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–350): local validation + error-fix mapping ──
  const tPv = seg(frame, 252, 274);
  const tPvVis = frame >= 252 && frame < 330 ? 1 : 0;
  const valOp = appear(256, 18) * lf;
  const valLit = interpolate(frame, [264, 286, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tPm = seg(frame, 262, 284);
  const tPmVis = frame >= 262 && frame < 330 ? 1 : 0;
  const mapOp = appear(266, 18) * lf;
  const mapLit = interpolate(frame, [274, 296, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const ratioPillIn = seg(frame, 288, 310, Easing.out(Easing.cubic));
  const ratioPillOp = ratioPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (360–450): result ──
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;
  const metricOp = seg(frame, 366, 388, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_ERR_POST} color={T.accent} width={2.5} progress={tEp} opacity={0.8 * tEpVis * lf} />
      <Connector pts={P_POST_CONT} color={T.accent} width={2} progress={tPc} opacity={0.8 * tPcVis * lf} />
      <Connector pts={P_CONT_POLL} color={T.accent} width={2} progress={tCp} opacity={0.8 * tCpVis * lf} />
      <Connector pts={P_POLL_PUB} color={T.success} width={2} progress={tPp} opacity={0.8 * tPpVis * lf} />
      <Connector pts={P_POST_VAL} color={T.amber} width={2} progress={tPv} opacity={0.7 * tPvVis * lf} />
      <Connector pts={P_POST_MAP} color={T.amber} width={2} progress={tPm} opacity={0.7 * tPmVis * lf} />

      <SchemaNode {...ERRORS} state="danger" lit={errLit} opacity={errOp} label="cryptic API errors" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>#10 · #24 · #100 · #190</div>
      </SchemaNode>
      <Pill x={ERRORS.x - 10} y={ERRORS.y + ERRORS.h + 14} text="40% failure rate — endless manual debugging" color={T.danger} opacity={failPillOp} fontSize={16} />

      <SchemaNode {...POSTFN} state="accent" lit={postLit} opacity={postOp} label="post-to-instagram" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno Edge Function</div>
      </SchemaNode>
      <Token pts={P_ERR_POST} t={tEp} opacity={tEpVis * lf} />

      <SchemaNode {...CONTAINER} state="accent" lit={contLit} opacity={contOp} label="create container" fontSize={16} />
      <Token pts={P_POST_CONT} t={tPc} opacity={tPcVis * lf} />
      <SchemaNode {...POLL} state="accent" lit={pollLit} opacity={pollOp} label="poll status" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>every 10s, up to 30x</div>
      </SchemaNode>
      <Token pts={P_CONT_POLL} t={tCp} opacity={tCpVis * lf} />
      <SchemaNode {...PUBLISH} state="success" lit={pubLit} opacity={pubOp} label="publish" fontSize={17} />
      <Token pts={P_POLL_PUB} t={tPp} color={T.success} opacity={tPpVis * lf} />

      <SchemaNode {...VALIDATE} state="amber" lit={valLit} opacity={valOp} label="aspect ratio pre-validation" fontSize={15}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>parses headers locally, rejects upfront</div>
      </SchemaNode>
      <Token pts={P_POST_VAL} t={tPv} color={T.amber} opacity={tPvVis * lf} />
      <SchemaNode {...ERRMAP} state="amber" lit={mapLit} opacity={mapOp} label="error → fix mapping" fontSize={15}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>every code, a clear next step</div>
      </SchemaNode>
      <Token pts={P_POST_MAP} t={tPm} color={T.amber} opacity={tPmVis * lf} />
      <Pill x={VALIDATE.x - 10} y={VALIDATE.y - 46} text="4:5 to 1.91:1 — rejected before the API call" color={T.amber} opacity={ratioPillOp} fontSize={14} />

      <Caption x={90} y={648} w={1100} text="Strict aspect ratios, cryptic errors — 40% of posts silently rejected" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Reels needs its own dance: container, poll, then publish" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Validate locally first, and every error becomes self-diagnosable" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>No more sifting through obtuse documentation</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Failure rate: 40% → under 5%</div>
      </div>
    </AbsoluteFill>
  );
};
