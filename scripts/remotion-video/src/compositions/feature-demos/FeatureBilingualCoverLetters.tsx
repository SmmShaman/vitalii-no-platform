/**
 * FeatureBilingualCoverLetters — feature j44 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: cover letters only generated in one language, forcing manual
 * translation for NO/UA (15-20 min per application) → useCoverLetterLanguage
 * hook drives CoverLetterPreview and ExportModal, flowing into
 * CoverLetterRenderer which pulls coverLetterData.body.no / .ua → PDF export
 * via react-to-pdf respects currentLanguage, CoverLetterTemplate.tsx swaps
 * text blocks with no reload → 15-20 min saved per switch, ~60% of users.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ONE_LANG = { x: 80, y: 44, w: 300, h: 88 };

const HOOK = { x: 60, y: 250, w: 310, h: 96 };
const RENDERER = { x: 480, y: 250, w: 300, h: 96 };
const EXPORT = { x: 890, y: 250, w: 300, h: 96 };

const ONE_BOTTOM: Pt = { x: ONE_LANG.x + ONE_LANG.w / 2, y: ONE_LANG.y + ONE_LANG.h };
const HOOK_TOP: Pt = { x: HOOK.x + HOOK.w / 2, y: HOOK.y };
const HOOK_R: Pt = { x: HOOK.x + HOOK.w, y: HOOK.y + HOOK.h / 2 };
const REN_L: Pt = { x: RENDERER.x, y: RENDERER.y + RENDERER.h / 2 };
const REN_R: Pt = { x: RENDERER.x + RENDERER.w, y: RENDERER.y + RENDERER.h / 2 };
const EXP_L: Pt = { x: EXPORT.x, y: EXPORT.y + EXPORT.h / 2 };

const P_OH: Pt[] = [ONE_BOTTOM, { x: ONE_BOTTOM.x, y: 190 }, HOOK_TOP];
const P_HR: Pt[] = [HOOK_R, REN_L];
const P_RE: Pt[] = [REN_R, EXP_L];

export const FeatureBilingualCoverLetters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): only one language, manual re-entry ──
  const oneOp = Math.min(1, pop(10)) * lf;
  const oneLit = interpolate(frame, [10, 34, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(46) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const timePillIn = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const timePillOp = timePillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): hook -> renderer -> export, body.no / body.ua ──
  const tOh = seg(frame, 118, 142);
  const tOhVis = frame >= 118 && frame < 172 ? 1 : 0;
  const hookOp = appear(126, 18) * lf;
  const hookLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tHr = seg(frame, 148, 172);
  const tHrVis = frame >= 148 && frame < 206 ? 1 : 0;
  const renOp = appear(150, 18) * lf;
  const renLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tRe = seg(frame, 182, 206);
  const tReVis = frame >= 182 && frame < 236 ? 1 : 0;
  const expOp = appear(184, 18) * lf;
  const expLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const bodyPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const bodyPillOp = bodyPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): PDF export respects language, instant switch ──
  const pdfScale = pop(250) * lf;
  const instantScale = pop(264) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const templatePillIn = seg(frame, 244, 266, Easing.out(Easing.cubic));
  const templatePillOp = templatePillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_OH} color={T.accent} width={2.5} progress={tOh} opacity={0.8 * tOhVis * lf} />
      <Connector pts={P_HR} color={T.accent} width={2.5} progress={tHr} opacity={0.8 * tHrVis * lf} />
      <Connector pts={P_RE} color={T.accent} width={2.5} progress={tRe} opacity={0.8 * tReVis * lf} />

      <SchemaNode {...ONE_LANG} state="danger" lit={oneLit} opacity={oneOp} label="Cover letter — one language" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>manual translation needed NO/UA</div>
      </SchemaNode>
      <Badge x={ONE_LANG.x + ONE_LANG.w / 2 - 18} y={ONE_LANG.y + ONE_LANG.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={ONE_LANG.x + ONE_LANG.w + 40} y={ONE_LANG.y + 20} text="15-20 min per application" color={T.danger} opacity={timePillOp} fontSize={17} />

      <SchemaNode {...HOOK} state="accent" lit={hookLit} opacity={hookOp} label="useCoverLetterLanguage()" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>NO/UA toggle state</div>
      </SchemaNode>
      <SchemaNode {...RENDERER} state="accent" lit={renLit} opacity={renOp} label="CoverLetterRenderer" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>body.no / body.ua</div>
      </SchemaNode>
      <SchemaNode {...EXPORT} state="success" lit={expLit} opacity={expOp} label="ExportModal → PDF" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>react-to-pdf</div>
      </SchemaNode>
      <Token pts={P_OH} t={tOh} color={T.accent} opacity={tOhVis * lf} />
      <Token pts={P_HR} t={tHr} opacity={tHrVis * lf} />
      <Token pts={P_RE} t={tRe} opacity={tReVis * lf} />
      <Pill x={HOOK.x + 20} y={HOOK.y + HOOK.h + 14} dx={0} text="defaults to user settings 'NO'/'UA'" color={T.amber} opacity={bodyPillOp} fontSize={15} />

      <div style={{ position: "absolute", left: EXPORT.x - 30, top: EXPORT.y + EXPORT.h + 40, opacity: pdfScale, transform: `scale(${pdfScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.success }}>PDF export respects currentLanguage</div>
      </div>
      <div style={{ position: "absolute", left: EXPORT.x - 30, top: EXPORT.y + EXPORT.h + 68, opacity: instantScale, transform: `scale(${instantScale})`, fontFamily }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.amber }}>instant, reload-free switching</div>
      </div>
      <Badge x={EXPORT.x - 34} y={EXPORT.y + EXPORT.h + 34} kind="check" scale={pdfScale} opacity={pdfScale} size={24} />
      <Pill x={HOOK.x - 10} y={HOOK.y - 46} dx={0} text="CoverLetterTemplate.tsx — conditional blocks" color={T.amber} opacity={templatePillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="One language only — users manually re-typed each NO/UA application" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="A language hook flows straight through to the renderer and PDF export" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Switching language never triggers a reload — formatting stays consistent" color={T.amber} opacity={cap3} fontSize={20} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>15-20 min saved per switch · ~60% of active users</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero manual translation, ever again</div>
      </div>
    </AbsoluteFill>
  );
};
