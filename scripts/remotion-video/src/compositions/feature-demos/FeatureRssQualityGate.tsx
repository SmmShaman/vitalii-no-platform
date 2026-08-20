/**
 * FeatureRssQualityGate — feature v10 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Telegram-scraper and fetch-news both routed through pre-moderate-news
 * before publishing, but analyze-rss-article never did — RSS articles were
 * approved purely on relevance_score >= 5, which measures on-brand topic fit,
 * not substance. A backtest across 198 published RSS articles found 19%
 * scored 3 or lower out of 10 on quality → analyze-rss-article now calls
 * pre-moderate-news for every RSS article, and both the relevance and
 * quality floors read from api_settings instead of being hardcoded → a
 * second backtest found raising the quality floor to 6 would reject ~35%
 * of them.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TELEGRAM = { x: 70, y: 50, w: 300, h: 82 };
const TELEGRAM_B: Pt = { x: TELEGRAM.x + TELEGRAM.w / 2, y: TELEGRAM.y + TELEGRAM.h };

const FETCHNEWS = { x: 490, y: 50, w: 300, h: 82 };
const FETCHNEWS_B: Pt = { x: FETCHNEWS.x + FETCHNEWS.w / 2, y: FETCHNEWS.y + FETCHNEWS.h };

const RSS = { x: 910, y: 50, w: 300, h: 82 };
const RSS_B: Pt = { x: RSS.x + RSS.w / 2, y: RSS.y + RSS.h };

const GATE = { x: 390, y: 250, w: 500, h: 100 };
const GATE_TL: Pt = { x: GATE.x + 80, y: GATE.y };
const GATE_TC: Pt = { x: GATE.x + GATE.w / 2, y: GATE.y };
const GATE_TR: Pt = { x: GATE.x + GATE.w - 80, y: GATE.y };
const GATE_B: Pt = { x: GATE.x + GATE.w / 2, y: GATE.y + GATE.h };

const SETTINGS = { x: 390, y: 420, w: 500, h: 92 };
const SETTINGS_T: Pt = { x: SETTINGS.x + SETTINGS.w / 2, y: SETTINGS.y };

const TELEGRAM_TO_GATE: Pt[] = [TELEGRAM_B, GATE_TL];
const FETCHNEWS_TO_GATE: Pt[] = [FETCHNEWS_B, GATE_TC];
const RSS_TO_GATE: Pt[] = [RSS_B, GATE_TR];
const GATE_TO_SETTINGS: Pt[] = [GATE_B, SETTINGS_T];

export const FeatureRssQualityGate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Beat 1: RSS is the one source skipping the substance check
  const teleOp = pop(6) * lf;
  const teleLit = 0.35 * lf;
  const fetchOp = pop(14) * lf;
  const fetchLit = 0.35 * lf;
  const rssOp = pop(22) * lf;
  const rssLit = interpolate(frame, [22, 44, 96, 116], [0, 0.55, 0.55, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // Beat 2: RSS now wired into the same gate
  const t2a = seg(frame, 148, 172);
  const t2aVis = frame >= 148 && frame < 194 ? 1 : 0;
  const t2b = seg(frame, 152, 176);
  const t2bVis = frame >= 152 && frame < 198 ? 1 : 0;
  const t2c = seg(frame, 156, 180);
  const t2cVis = frame >= 156 && frame < 202 ? 1 : 0;
  const gateOp = appear(148, 18) * lf;
  const gateLit = interpolate(frame, [148, 172, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // Beat 3: both floors tunable via api_settings
  const t3 = seg(frame, 254, 282);
  const t3Vis = frame >= 254 && frame < 322 ? 1 : 0;
  const settingsOp = appear(268, 18) * lf;
  const settingsLit = interpolate(frame, [276, 298, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={TELEGRAM_TO_GATE} color={T.success} width={2.5} progress={t2a} opacity={0.7 * t2aVis * lf} />
      <Connector pts={FETCHNEWS_TO_GATE} color={T.success} width={2.5} progress={t2b} opacity={0.7 * t2bVis * lf} />
      <Connector pts={RSS_TO_GATE} color={T.accent} width={2.5} progress={t2c} opacity={0.9 * t2cVis * lf} />
      <Connector pts={GATE_TO_SETTINGS} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...TELEGRAM} state="success" lit={teleLit} opacity={teleOp} label="Telegram-scraper" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>already gated</div>
      </SchemaNode>
      <SchemaNode {...FETCHNEWS} state="success" lit={fetchLit} opacity={fetchOp} label="fetch-news" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>already gated</div>
      </SchemaNode>
      <SchemaNode {...RSS} state="danger" lit={rssLit} opacity={rssOp} label="analyze-rss-article" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>relevance_score only</div>
      </SchemaNode>
      <Badge x={RSS.x + RSS.w - 20} y={RSS.y - 18} kind="cross" scale={xScale} opacity={xScale} size={26} />
      <Pill x={RSS.x - 40} y={RSS.y + RSS.h + 18} text="19% of 198 published articles scored ≤3/10" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...GATE} state="accent" lit={gateLit} opacity={gateOp} label="pre-moderate-news" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>the one shared substance check</div>
      </SchemaNode>
      <Token pts={RSS_TO_GATE} t={t2c} opacity={t2cVis * lf} />

      <SchemaNode {...SETTINGS} state="success" lit={settingsLit} opacity={settingsOp} label="api_settings: both floors tunable" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>relevance ≥5 · quality ≥6, no redeploy</div>
      </SchemaNode>
      <Token pts={GATE_TO_SETTINGS} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={SETTINGS.x + 30} y={SETTINGS.y + SETTINGS.h + 14} text="raising quality to 6 would reject ~35%" color={T.success} opacity={pill3Op} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="RSS was the only intake path skipping the actual substance check" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="analyze-rss-article now calls the same pre-moderate-news gate" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Both thresholds live in api_settings — tune either without a redeploy" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Telegram, fetch-news, and RSS: one shared quality bar</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>no more RSS blind spot in moderation</div>
      </div>
    </AbsoluteFill>
  );
};
