/**
 * FeatureLinkedinNativeUpload — feature p14 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: default LinkedIn link previews are small and blurry, costing
 * 2-3x fewer impressions → post-to-linkedin (Deno) first calls
 * wasAlreadyPosted() against both 'posted' and 'pending' to kill a race
 * condition → then works the Assets API handshake — register, get an
 * upload URL, stream the binary, get the URN, build the UGC post — with an
 * ARTICLE-type fallback if the image upload fails → impressions jump
 * 200%+, double-posting bug gone.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BLURRY = { x: 460, y: 30, w: 360, h: 80 };
const POSTFN = { x: 460, y: 150, w: 360, h: 80 };
const DUPE = { x: 90, y: 290, w: 320, h: 90 };
const ASSETS = { x: 480, y: 290, w: 320, h: 90 };
const UGC = { x: 870, y: 290, w: 320, h: 90 };

const BLURRY_B: Pt = { x: BLURRY.x + BLURRY.w / 2, y: BLURRY.y + BLURRY.h };
const POSTFN_T: Pt = { x: POSTFN.x + POSTFN.w / 2, y: POSTFN.y };
const POSTFN_B: Pt = { x: POSTFN.x + POSTFN.w / 2, y: POSTFN.y + POSTFN.h };
const DUPE_T: Pt = { x: DUPE.x + DUPE.w / 2, y: DUPE.y };
const ASSETS_T: Pt = { x: ASSETS.x + ASSETS.w / 2, y: ASSETS.y };
const ASSETS_R: Pt = { x: ASSETS.x + ASSETS.w, y: ASSETS.y + ASSETS.h / 2 };
const UGC_L: Pt = { x: UGC.x, y: UGC.y + UGC.h / 2 };

const P_BLURRY_POST: Pt[] = [BLURRY_B, POSTFN_T];
const P_POST_DUPE: Pt[] = [POSTFN_B, DUPE_T];
const P_POST_ASSETS: Pt[] = [POSTFN_B, ASSETS_T];
const P_ASSETS_UGC: Pt[] = [ASSETS_R, UGC_L];

export const FeatureLinkedinNativeUpload: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–108): blurry previews, complex multi-step API ──
  const blurOp = Math.min(1, pop(4)) * lf;
  const blurLit = interpolate(frame, [4, 26, 86, 106], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const impressionPillIn = seg(frame, 30, 52, Easing.out(Easing.cubic));
  const impressionPillOp = impressionPillIn * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 18, 40, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (112–246): post-to-linkedin, race-condition guard ──
  const tBp = seg(frame, 114, 136);
  const tBpVis = frame >= 114 && frame < 190 ? 1 : 0;
  const postOp = appear(118, 18) * lf;
  const postLit = interpolate(frame, [126, 148, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tPd = seg(frame, 150, 172);
  const tPdVis = frame >= 150 && frame < 330 ? 1 : 0;
  const dupeOp = appear(154, 18) * lf;
  const dupeLit = interpolate(frame, [162, 184, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const dupePillIn = seg(frame, 186, 208, Easing.out(Easing.cubic));
  const dupePillOp = dupePillIn * interpolate(frame, [242, 262], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 156, 178, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [242, 262], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–350): Assets API handshake → UGC post, ARTICLE fallback ──
  const tPa = seg(frame, 252, 274);
  const tPaVis = frame >= 252 && frame < 330 ? 1 : 0;
  const assetsOp = appear(256, 18) * lf;
  const assetsLit = interpolate(frame, [264, 286, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tAu = seg(frame, 278, 300);
  const tAuVis = frame >= 278 && frame < 330 ? 1 : 0;
  const ugcOp = appear(282, 18) * lf;
  const ugcLit = interpolate(frame, [290, 312, 330, 350], [0, 0.8, 0.8, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const checkScale3 = pop(304) * lf;
  const fallbackPillIn = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const fallbackPillOp = fallbackPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 258, 280, Easing.out(Easing.cubic));
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

      <Connector pts={P_BLURRY_POST} color={T.accent} width={2.5} progress={tBp} opacity={0.8 * tBpVis * lf} />
      <Connector pts={P_POST_DUPE} color={T.accent} width={2} progress={tPd} opacity={0.8 * tPdVis * lf} />
      <Connector pts={P_POST_ASSETS} color={T.accent} width={2} progress={tPa} opacity={0.8 * tPaVis * lf} />
      <Connector pts={P_ASSETS_UGC} color={T.success} width={2.5} progress={tAu} opacity={0.8 * tAuVis * lf} />

      <SchemaNode {...BLURRY} state="danger" lit={blurLit} opacity={blurOp} label="default link preview" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>small, blurry, uncontrollable</div>
      </SchemaNode>
      <Pill x={BLURRY.x - 10} y={BLURRY.y + BLURRY.h + 14} text="2-3x fewer impressions than native images" color={T.danger} opacity={impressionPillOp} fontSize={16} />

      <SchemaNode {...POSTFN} state="accent" lit={postLit} opacity={postOp} label="post-to-linkedin" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno Edge Function</div>
      </SchemaNode>
      <Token pts={P_BLURRY_POST} t={tBp} opacity={tBpVis * lf} />

      <SchemaNode {...DUPE} state="accent" lit={dupeLit} opacity={dupeOp} label="wasAlreadyPosted()" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>checks posted + pending</div>
      </SchemaNode>
      <Token pts={P_POST_DUPE} t={tPd} opacity={tPdVis * lf} />
      <Pill x={DUPE.x - 10} y={DUPE.y + DUPE.h + 14} text="race-condition double-posts, eliminated" color={T.accent} opacity={dupePillOp} fontSize={14} />

      <SchemaNode {...ASSETS} state="accent" lit={assetsLit} opacity={assetsOp} label="Assets API handshake" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>register → upload URL → stream → URN</div>
      </SchemaNode>
      <Token pts={P_POST_ASSETS} t={tPa} opacity={tPaVis * lf} />
      <Pill x={ASSETS.x - 10} y={ASSETS.y - 46} text="falls back to ARTICLE type if upload fails" color={T.amber} opacity={fallbackPillOp} fontSize={14} />

      <SchemaNode {...UGC} state="success" lit={ugcLit} opacity={ugcOp} label="UGC post created" fontSize={17} />
      <Token pts={P_ASSETS_UGC} t={tAu} color={T.success} opacity={tAuVis * lf} />
      <Badge x={UGC.x + UGC.w / 2 - 17} y={UGC.y - 40} kind="check" scale={checkScale3} opacity={checkScale3} />

      <Caption x={90} y={648} w={1100} text="Small, blurry link previews and a brutal multi-step upload API" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A duplicate check runs first — no post ever fires twice" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Register, upload, get the URN, then publish — with a safety net" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Reliable, high-impact delivery without manual oversight</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Impressions per post up over 200%</div>
      </div>
    </AbsoluteFill>
  );
};
