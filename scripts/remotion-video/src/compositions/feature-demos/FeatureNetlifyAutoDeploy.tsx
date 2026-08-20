/**
 * FeatureNetlifyAutoDeploy — feature j41 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: manual deploy loop burned 7-10 min per tweak, 3+ hours/day → Netlify
 * wired straight to the jobbot-norway GitHub repo (main branch, npm run build,
 * dist/) → PR branches get their own preview URL so stakeholders test before
 * merge → git push now means a 15s Vite build + 5s CDN deploy, live globally.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const DEV = { x: 80, y: 60, w: 230, h: 90 };
const OLD_STEPS = { x: 80, y: 220, w: 700, h: 74 };

const GIT = { x: 90, y: 250, w: 220, h: 88 };
const NETLIFY = { x: 500, y: 250, w: 280, h: 88 };
const CDN = { x: 950, y: 250, w: 230, h: 88 };

const GIT_R: Pt = { x: GIT.x + GIT.w, y: GIT.y + GIT.h / 2 };
const NET_L: Pt = { x: NETLIFY.x, y: NETLIFY.y + NETLIFY.h / 2 };
const NET_R: Pt = { x: NETLIFY.x + NETLIFY.w, y: NETLIFY.y + NETLIFY.h / 2 };
const CDN_L: Pt = { x: CDN.x, y: CDN.y + CDN.h / 2 };

const P_GN: Pt[] = [GIT_R, NET_L];
const P_NC: Pt[] = [NET_R, CDN_L];

export const FeatureNetlifyAutoDeploy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): manual loop, 7-10 min per tweak ──
  const devOp = Math.min(1, pop(10)) * lf;
  const devLit = 0.3 * lf;
  const oldStepsOp = appear(30, 20) * lf;
  const crossScale = pop(50) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const timePillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const timePillOp = timePillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–236): git push -> Netlify build -> CDN ──
  const gitOp = appear(126, 18) * lf;
  const gitLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGn = seg(frame, 148, 172);
  const tGnVis = frame >= 148 && frame < 206 ? 1 : 0;
  const netOp = appear(150, 18) * lf;
  const netLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tNc = seg(frame, 182, 206);
  const tNcVis = frame >= 182 && frame < 236 ? 1 : 0;
  const cdnOp = appear(184, 18) * lf;
  const cdnLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const buildPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const buildPillOp = buildPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): PR preview URLs + one-click rollback ──
  const prScale = pop(248) * lf;
  const rollbackScale = pop(262) * lf;
  const previewPillIn = seg(frame, 244, 266, Easing.out(Easing.cubic));
  const previewPillOp = previewPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
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

      <Connector pts={P_GN} color={T.accent} width={2.5} progress={tGn} opacity={0.8 * tGnVis * lf} />
      <Connector pts={P_NC} color={T.accent} width={2.5} progress={tNc} opacity={0.8 * tNcVis * lf} />

      <SchemaNode {...DEV} state="danger" lit={devLit} opacity={devOp} label="git push" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>15-20 deploys/day</div>
      </SchemaNode>
      <div style={{ position: "absolute", left: OLD_STEPS.x, top: OLD_STEPS.y, width: OLD_STEPS.w, opacity: oldStepsOp, fontFamily }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.danger }}>commit → push → manual deploy → 5-min build wait → manual test</div>
      </div>
      <Badge x={DEV.x + DEV.w / 2 - 18} y={DEV.y + DEV.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={DEV.x - 10} y={DEV.y + DEV.h + 46} text="7-10 min per iteration, 3+ hrs/day" color={T.danger} opacity={timePillOp} fontSize={17} />

      <SchemaNode {...GIT} state="accent" lit={gitLit} opacity={gitOp} label="GitHub" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>jobbot-norway · main</div>
      </SchemaNode>
      <SchemaNode {...NETLIFY} state="accent" lit={netLit} opacity={netOp} label="Netlify" fontSize={21}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>npm run build → dist/</div>
      </SchemaNode>
      <SchemaNode {...CDN} state="success" lit={cdnLit} opacity={cdnOp} label="Global CDN" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>~500KB gzipped</div>
      </SchemaNode>
      <Token pts={P_GN} t={tGn} opacity={tGnVis * lf} />
      <Token pts={P_NC} t={tNc} opacity={tNcVis * lf} />
      <Pill x={NETLIFY.x + 20} y={NETLIFY.y - 46} dx={0} text="15s Vite build + 5s CDN deploy" color={T.amber} opacity={buildPillOp} fontSize={18} />

      {/* Beat 3: PR preview + rollback */}
      <div style={{ position: "absolute", left: NETLIFY.x - 10, top: NETLIFY.y + NETLIFY.h + 44, opacity: prScale, transform: `scale(${prScale})`, fontFamily }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.success }}>every PR → unique preview URL</div>
      </div>
      <div style={{ position: "absolute", left: NETLIFY.x - 10, top: NETLIFY.y + NETLIFY.h + 76, opacity: rollbackScale, transform: `scale(${rollbackScale})`, fontFamily }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.amber }}>rollback = one click, zero downtime</div>
      </div>
      <Badge x={NETLIFY.x - 34} y={NETLIFY.y + NETLIFY.h + 38} kind="check" scale={prScale} opacity={prScale} size={26} />
      <Pill x={CDN.x - 40} y={CDN.y - 46} dx={0} text="stakeholders test before merge" color={T.amber} opacity={previewPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Every tweak: commit, push, manual deploy, 5-min wait, manual test" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="git push -> Netlify builds with Vite -> deploys globally to CDN" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every PR gets its own preview URL, plus one-click rollback" color={T.amber} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>3+ hours/day waiting -&gt; virtually zero</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>15s build, 5s deploy, live globally</div>
      </div>
    </AbsoluteFill>
  );
};
