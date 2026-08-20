/**
 * FeatureAgentPlaywrightRouting — feature j54 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: external-site applications ran through a legacy Python
 * worker + Skyvern pipeline alongside newer agent-driven tooling, so two
 * code paths could both act on the same row → commit 7a371ef routes
 * non-FINN applications to the agent (Playwright) and tags them
 * submission_method='agent' so claim_applications() explicitly skips them →
 * the old Skyvern path stays behind a FALLBACK_TO_SKYVERN_WORKER flag
 * (default false), FINN's own flow untouched → the same-day follow-up
 * commit 1235c80 fully decommissions Skyvern.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const APP = { x: 80, y: 44, w: 280, h: 88 };
const RACE = { x: 830, y: 44, w: 330, h: 88 };

const TAG = { x: 50, y: 250, w: 300, h: 96 };
const CLAIM = { x: 480, y: 250, w: 300, h: 96 };
const PLAYWRIGHT = { x: 900, y: 250, w: 280, h: 96 };

const APP_R: Pt = { x: APP.x + APP.w, y: APP.y + APP.h / 2 };
const RACE_L: Pt = { x: RACE.x, y: RACE.y + RACE.h / 2 };
const TAG_R: Pt = { x: TAG.x + TAG.w, y: TAG.y + TAG.h / 2 };
const CLAIM_L: Pt = { x: CLAIM.x, y: CLAIM.y + CLAIM.h / 2 };
const CLAIM_R: Pt = { x: CLAIM.x + CLAIM.w, y: CLAIM.y + CLAIM.h / 2 };
const PLAY_L: Pt = { x: PLAYWRIGHT.x, y: PLAYWRIGHT.y + PLAYWRIGHT.h / 2 };

const P_AR: Pt[] = [APP_R, RACE_L];
const P_TC: Pt[] = [TAG_R, CLAIM_L];
const P_CP: Pt[] = [CLAIM_R, PLAY_L];

export const FeatureAgentPlaywrightRouting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): two independent pipelines could race on one row ──
  const appOp = Math.min(1, pop(10)) * lf;
  const appLit = 0.3 * lf;
  const raceOp = appear(30, 18) * lf;
  const raceLit = interpolate(frame, [40, 62, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tAr = seg(frame, 36, 58);
  const tArVis = frame >= 36 && frame < 96 ? 1 : 0;
  const crossScale = pop(50) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): tagged agent rows, claim_applications() skips them ──
  const tagOp = appear(126, 18) * lf;
  const tagLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tTc = seg(frame, 148, 172);
  const tTcVis = frame >= 148 && frame < 206 ? 1 : 0;
  const claimOp = appear(150, 18) * lf;
  const claimLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tCp = seg(frame, 182, 206);
  const tCpVis = frame >= 182 && frame < 236 ? 1 : 0;
  const playOp = appear(184, 18) * lf;
  const playLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const commitPillIn = seg(frame, 130, 152, Easing.out(Easing.cubic));
  const commitPillOp = commitPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): old path kept as flag, FINN untouched ──
  const flagScale = pop(250) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const flagPillIn = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const flagPillOp = flagPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_AR} color={T.danger} width={2.5} progress={tAr} opacity={0.8 * tArVis * lf} />
      <Connector pts={P_TC} color={T.accent} width={2.5} progress={tTc} opacity={0.8 * tTcVis * lf} />
      <Connector pts={P_CP} color={T.accent} width={2.5} progress={tCp} opacity={0.8 * tCpVis * lf} />

      <SchemaNode {...APP} state="accent" lit={appLit} opacity={appOp} label="External application" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>non-FINN job site</div>
      </SchemaNode>
      <SchemaNode {...RACE} state="danger" lit={raceLit} opacity={raceOp} label="Two pipelines could race" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>worker/Skyvern + agent tooling</div>
      </SchemaNode>
      <Token pts={P_AR} t={tAr} color={T.danger} opacity={tArVis * lf} />
      <Badge x={RACE.x + RACE.w / 2 - 18} y={RACE.y + RACE.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...TAG} state="accent" lit={tagLit} opacity={tagOp} label="submission_method='agent'" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>commit 7a371ef</div>
      </SchemaNode>
      <SchemaNode {...CLAIM} state="success" lit={claimLit} opacity={claimOp} label="claim_applications()" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>explicitly skips agent rows</div>
      </SchemaNode>
      <SchemaNode {...PLAYWRIGHT} state="success" lit={playLit} opacity={playOp} label="Agent + Playwright" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>browser automation</div>
      </SchemaNode>
      <Token pts={P_TC} t={tTc} opacity={tTcVis * lf} />
      <Token pts={P_CP} t={tCp} opacity={tCpVis * lf} />
      <Pill x={TAG.x + 10} y={TAG.y - 46} dx={0} text="no race between the two pipelines" color={T.amber} opacity={commitPillOp} fontSize={15} />

      <div style={{ position: "absolute", left: PLAYWRIGHT.x - 40, top: PLAYWRIGHT.y + PLAYWRIGHT.h + 40, opacity: flagScale, transform: `scale(${flagScale})`, fontFamily }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.success }}>FINN's own flow stays untouched</div>
      </div>
      <Badge x={PLAYWRIGHT.x - 34} y={PLAYWRIGHT.y + PLAYWRIGHT.h + 34} kind="check" scale={flagScale} opacity={flagScale} size={24} />
      <Pill x={CLAIM.x - 20} y={CLAIM.y + CLAIM.h + 14} text="FALLBACK_TO_SKYVERN_WORKER — off by default" color={T.amber} opacity={flagPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Legacy worker/Skyvern and newer agent tooling could both claim one row" color={T.danger} opacity={cap1} fontSize={20} weight={600} />
      <Caption x={90} y={648} w={1100} text="Agent rows are tagged, and the legacy claimer explicitly skips them" color={T.text} opacity={cap2} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="Skyvern remains only as a disabled emergency escape hatch" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Same-day follow-up fully decommissions Skyvern</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>One pipeline, one browser agent, no races</div>
      </div>
    </AbsoluteFill>
  );
};
