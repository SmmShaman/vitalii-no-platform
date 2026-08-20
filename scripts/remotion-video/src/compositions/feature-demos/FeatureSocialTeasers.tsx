/**
 * FeatureSocialTeasers — feature p04 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 9 platform×language teasers per article, hand-written, cost 20-30
 * soul-crushing minutes → generate-social-teasers fires once, pulling a
 * per-platform prompt from ai_prompts and producing all 9 in one pass →
 * the result is cached in social_teaser_{platform}_{lang}, so every later
 * view is free → "one Azure call per article, +20-30% LinkedIn impressions".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ARTICLE = { x: 465, y: 36, w: 350, h: 82 };
const EDGE = { x: 465, y: 188, w: 350, h: 96 };
const CACHE = { x: 400, y: 560, w: 480, h: 76 };

const PLATFORMS = ["LinkedIn", "Instagram", "Facebook"];
const LANGS = ["EN", "NO", "UA"];
const COL_XS = [300, 585, 870];
const ROW_YS = [332, 396, 460];

const ARTICLE_B: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y + ARTICLE.h };
const EDGE_T: Pt = { x: EDGE.x + EDGE.w / 2, y: EDGE.y };
const EDGE_B: Pt = { x: EDGE.x + EDGE.w / 2, y: EDGE.y + EDGE.h };
const CACHE_T: Pt = { x: CACHE.x + CACHE.w / 2, y: CACHE.y };

const P_AE: Pt[] = [ARTICLE_B, EDGE_T];
const P_EC: Pt[] = [EDGE_B, { x: EDGE_B.x, y: 530 }, CACHE_T];

export const FeatureSocialTeasers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): 9 teasers, hand-written, 20-30 min ──
  const articleOp = Math.min(1, pop(10)) * lf;
  const articleLit = interpolate(frame, [10, 34, 96, 118], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const pillIn = seg(frame, 34, 56, Easing.out(Easing.cubic));
  const pillOp = pillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (126–250): one call generates all 9, from ai_prompts ──
  const tAe = seg(frame, 128, 150);
  const tAeVis = frame >= 128 && frame < 180 ? 1 : 0;
  const edgeOp = appear(130, 18) * lf;
  const edgeLit = interpolate(frame, [138, 160, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const chipDelay = (r: number, c: number) => 164 + (r * 3 + c) * 7;
  const chipOp = PLATFORMS.map((_, r) => LANGS.map((_, c) => appear(chipDelay(r, c), 12) * lf));
  const cap2In = seg(frame, 168, 190, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const promptPillIn = seg(frame, 142, 164, Easing.out(Easing.cubic));
  const promptPillOp = promptPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (250–340): cached — one Azure call, free after that ──
  const tEc = seg(frame, 254, 280);
  const tEcVis = frame >= 254 && frame < 316 ? 1 : 0;
  const cacheOp = appear(258, 18) * lf;
  const cacheLit = interpolate(frame, [266, 288, 330, 350], [0, 0.7, 0.7, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const checkScale = pop(292) * lf;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
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

      <Connector pts={P_AE} color={T.accent} width={2.5} progress={tAe} opacity={0.8 * tAeVis * lf} />
      <Connector pts={P_EC} color={T.success} width={2.5} progress={tEc} opacity={0.8 * tEcVis * lf} />

      <SchemaNode {...ARTICLE} state="idle" lit={articleLit} opacity={articleOp} label="New article" fontSize={22} />
      <Pill x={ARTICLE.x + 10} y={ARTICLE.y - 46} text="9 teasers, by hand — 20-30 min" color={T.danger} opacity={pillOp} fontSize={19} />

      <SchemaNode {...EDGE} state="accent" lit={edgeLit} opacity={edgeOp} label="generate-social-teasers" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>one call, all 9 at once</div>
      </SchemaNode>
      <Token pts={P_AE} t={tAe} opacity={tAeVis * lf} />
      <Pill x={EDGE.x - 40} y={EDGE.y - 46} text="prompt per platform, from ai_prompts" color={T.amber} opacity={promptPillOp} fontSize={16} />

      {PLATFORMS.map((p, r) => (
        <div key={p} style={{ position: "absolute", left: 90, top: ROW_YS[r] + 6, fontSize: 15, fontWeight: 600, color: T.muted, opacity: chipOp[r][0], fontFamily }}>
          {p}
        </div>
      ))}
      {PLATFORMS.map((p, r) =>
        LANGS.map((l, c) => (
          <Pill key={`${p}-${l}`} x={COL_XS[c]} y={ROW_YS[r]} text={l} color={T.accent} opacity={chipOp[r][c]} fontSize={16} />
        )),
      )}

      <SchemaNode {...CACHE} state="success" lit={cacheLit} opacity={cacheOp} label="social_teaser_{platform}_{lang}" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>cached — served free after</div>
      </SchemaNode>
      <Token pts={P_EC} t={tEc} color={T.success} opacity={tEcVis * lf} />
      <Badge x={CACHE.x + CACHE.w / 2 - 18} y={CACHE.y - 40} kind="check" scale={checkScale} opacity={checkScale} />

      <Caption x={90} y={648} w={1100} text="9 unique teasers by hand, every article — 20-30 minutes gone" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="One call generates all 9 — platform tone, language, in one pass" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="One Azure call per article — every later view is served from cache" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>30+ minutes saved per article</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>+20-30% LinkedIn impressions and clicks</div>
      </div>
    </AbsoluteFill>
  );
};
