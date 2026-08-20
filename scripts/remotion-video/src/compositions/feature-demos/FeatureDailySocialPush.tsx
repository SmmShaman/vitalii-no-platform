/**
 * FeatureDailySocialPush — feature p50 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: promoting new features on LinkedIn/Facebook cost 30-45 minutes a
 * day of manual copywriting and scheduling, often skipped during coding
 * sprints. A daily GitHub Actions cron (social-publish.yml) triggers
 * publishDailyFeatures.ts, which queries Supabase for unpromoted features
 * (is_promoted=false, priority>0), calls generateSocialPostContent.ts for
 * AI copy + hashtags, then dispatches via publishToFacebook.ts and
 * publishToLinkedIn.ts against the platform Graph/UGC APIs.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const MANUAL = { x: 90, y: 70, w: 300, h: 100 };
const MANUAL_R: Pt = { x: MANUAL.x + MANUAL.w, y: MANUAL.y + MANUAL.h / 2 };

const CRON = { x: 490, y: 70, w: 300, h: 100 };
const CRON_L: Pt = { x: CRON.x, y: CRON.y + CRON.h / 2 };
const CRON_B: Pt = { x: CRON.x + CRON.w / 2, y: CRON.y + CRON.h };

const COPY = { x: 490, y: 230, w: 300, h: 100 };
const COPY_T: Pt = { x: COPY.x + COPY.w / 2, y: COPY.y };
const COPY_L: Pt = { x: COPY.x, y: COPY.y + COPY.h / 2 };
const COPY_R: Pt = { x: COPY.x + COPY.w, y: COPY.y + COPY.h / 2 };

const FB = { x: 130, y: 400, w: 250, h: 100 };
const FB_T: Pt = { x: FB.x + FB.w / 2, y: FB.y };

const LI = { x: 900, y: 400, w: 250, h: 100 };
const LI_T: Pt = { x: LI.x + LI.w / 2, y: LI.y };

export const FeatureDailySocialPush: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: 30-45 min/day manual posting, often skipped
  const manualOp = appear(6) * lf;
  const manualLit = interpolate(frame, [6, 30, 96, 116], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: social-publish.yml -> publishDailyFeatures.ts -> AI copy
  const tA = seg(frame, 130, 154);
  const tAVis = frame >= 130 && frame < 190 ? 1 : 0;
  const tB = seg(frame, 168, 192);
  const tBVis = frame >= 168 && frame < 226 ? 1 : 0;
  const cronOp = appear(140, 18) * lf;
  const cronLit = interpolate(frame, [148, 172, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const copyOp = appear(178, 18) * lf;
  const copyLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 196, 218, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [246, 266], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: dispatch to Facebook + LinkedIn
  const tFb = seg(frame, 254, 278);
  const tFbVis = frame >= 254 && frame < 320 ? 1 : 0;
  const tLi = seg(frame, 254, 278);
  const tLiVis = frame >= 254 && frame < 320 ? 1 : 0;
  const fbOp = appear(260, 18) * lf;
  const liOp = appear(260, 18) * lf;
  const fbLit = interpolate(frame, [268, 290, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const liLit = interpolate(frame, [268, 290, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 282, 304, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 276, 298, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [318, 340], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // Beat 4: result
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={[MANUAL_R, CRON_L]} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={[CRON_B, COPY_T]} color={T.accent} width={2.5} progress={tB} opacity={0.8 * tBVis * lf} />
      <Connector pts={[COPY_L, FB_T]} color={T.success} width={2.5} progress={tFb} opacity={0.8 * tFbVis * lf} />
      <Connector pts={[COPY_R, LI_T]} color={T.success} width={2.5} progress={tLi} opacity={0.8 * tLiVis * lf} />

      <SchemaNode {...MANUAL} state="danger" lit={manualLit} opacity={manualOp} label="30-45 min / day" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>manual copy, hashtags, scheduling</div>
      </SchemaNode>
      <Pill x={MANUAL.x + 10} y={MANUAL.y - 46} dx={pill1Dx} text="often skipped during coding sprints" color={T.danger} opacity={pill1Op} fontSize={16} />

      <SchemaNode {...CRON} state="accent" lit={cronLit} opacity={cronOp} label="social-publish.yml" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>daily GitHub Actions cron</div>
      </SchemaNode>
      <Token pts={[MANUAL_R, CRON_L]} t={tA} opacity={tAVis * lf} />

      <SchemaNode {...COPY} state="accent" lit={copyLit} opacity={copyOp} label="publishDailyFeatures.ts" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>is_promoted=false → AI copy + hashtags</div>
      </SchemaNode>
      <Token pts={[CRON_B, COPY_T]} t={tB} opacity={tBVis * lf} />
      <Pill x={COPY.x - 10} y={COPY.y + COPY.h + 14} dx={pill2Dx} text="generateSocialPostContent.ts" color={T.accent} opacity={pill2Op} fontSize={16} />

      <SchemaNode {...FB} state="success" lit={fbLit} opacity={fbOp} label="publishToFacebook.ts" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>Facebook Graph API</div>
      </SchemaNode>
      <SchemaNode {...LI} state="success" lit={liLit} opacity={liOp} label="publishToLinkedIn.ts" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>LinkedIn ugcPosts</div>
      </SchemaNode>
      <Token pts={[COPY_L, FB_T]} t={tFb} color={T.success} opacity={tFbVis * lf} />
      <Token pts={[COPY_R, LI_T]} t={tLi} color={T.success} opacity={tLiVis * lf} />
      <Pill x={490} y={FB.y + FB.h + 14} dx={pill3Dx} text="zero manual intervention after approval" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="30-45 minutes lost daily to crafting posts and double-checking links" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A daily cron queries unpromoted features and drafts AI copy" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Dispatched straight to LinkedIn and Facebook via their APIs" color={T.success} opacity={cap3} fontSize={22} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>15+ hours/month back, 14 feature posts a week</div>
      </div>
    </AbsoluteFill>
  );
};
