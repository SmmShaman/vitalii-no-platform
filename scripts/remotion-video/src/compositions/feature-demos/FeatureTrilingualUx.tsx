/**
 * FeatureTrilingualUx — feature j29 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Ukrainians in Norway split across NO/EN/UA — hardcoding one
 * language alienates 66% of users, and if the choice doesn't persist the
 * platform feels broken → translations.ts (~200 keys) + LanguageContext +
 * preferred_analysis_language in Supabase user_settings → the flag switcher
 * propagates into job_analyzer's AI output AND the Telegram bot → one
 * choice, consistent everywhere, 100% linguistic coverage.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FLAGS = [
  { x: 150, y: 62, w: 190, h: 78, label: "🇳🇴 Norsk" },
  { x: 545, y: 62, w: 190, h: 78, label: "🇬🇧 English" },
  { x: 940, y: 62, w: 190, h: 78, label: "🇺🇦 Українська" },
];
const FLAGS_B: Pt[] = FLAGS.map((f) => ({ x: f.x + f.w / 2, y: f.y + f.h }));

const CTX = { x: 490, y: 200, w: 300, h: 90 };
const CTX_T: Pt = { x: CTX.x + CTX.w / 2, y: CTX.y };
const CTX_B: Pt = { x: CTX.x + CTX.w / 2, y: CTX.y + CTX.h };

const SETTINGS = { x: 490, y: 340, w: 300, h: 90 };
const SETTINGS_T: Pt = { x: SETTINGS.x + SETTINGS.w / 2, y: SETTINGS.y };
const SETTINGS_L: Pt = { x: SETTINGS.x, y: SETTINGS.y + SETTINGS.h / 2 };
const SETTINGS_R: Pt = { x: SETTINGS.x + SETTINGS.w, y: SETTINGS.y + SETTINGS.h / 2 };

const ANALYZER = { x: 140, y: 480, w: 260, h: 90 };
const BOT = { x: 850, y: 480, w: 260, h: 90 };
const ANALYZER_T: Pt = { x: ANALYZER.x + ANALYZER.w / 2, y: ANALYZER.y };
const BOT_T: Pt = { x: BOT.x + BOT.w / 2, y: BOT.y };

export const FeatureTrilingualUx: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): 3 languages, one hardcoded choice alienates 66% ──
  const flagOp = FLAGS.map((_, i) => appear(6 + i * 10) * lf);
  const flagLit = FLAGS.map((_, i) =>
    interpolate(frame, [6 + i * 10, 30 + i * 10, 96, 116], [0, 0.4, 0.4, 0.12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const alienPillIn = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const alienPillOp = alienPillIn * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const alienPillDx = (1 - alienPillIn) * 40;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): LanguageContext + user_settings persist the pick ──
  const tF = FLAGS_B.map((_, i) => seg(frame, 130 + i * 6, 154 + i * 6));
  const tFVis = FLAGS_B.map((_, i) => (frame >= 130 + i * 6 && frame < 180 ? 1 : 0));
  const ctxOp = appear(150, 18) * lf;
  const ctxLit = interpolate(frame, [150, 172, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tCs = seg(frame, 176, 200);
  const tCsVis = frame >= 176 && frame < 222 ? 1 : 0;
  const settingsOp = appear(190, 18) * lf;
  const settingsLit = interpolate(frame, [198, 220, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const keysPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const keysPillOp = keysPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): propagates to AI analysis AND Telegram bot ──
  const tSa = seg(frame, 250, 274);
  const tSaVis = frame >= 250 && frame < 300 ? 1 : 0;
  const tSb = seg(frame, 256, 280);
  const tSbVis = frame >= 256 && frame < 306 ? 1 : 0;
  const analyzerOp = appear(266, 18) * lf;
  const botOp = appear(272, 18) * lf;
  const analyzerLit = interpolate(frame, [274, 296, 330, 350], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const botLit = interpolate(frame, [280, 302, 330, 350], [0, 0.65, 0.65, 0.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const langParamPillIn = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const langParamPillOp = langParamPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {FLAGS_B.map((p, i) => (
        <Connector key={i} pts={[p, CTX_T]} color={T.accent} width={2.5} progress={tF[i]} opacity={0.8 * tFVis[i] * lf} />
      ))}
      <Connector pts={[CTX_B, SETTINGS_T]} color={T.accent} width={2.5} progress={tCs} opacity={0.8 * tCsVis * lf} />
      <Connector pts={[SETTINGS_L, ANALYZER_T]} color={T.success} width={2.5} progress={tSa} opacity={0.8 * tSaVis * lf} />
      <Connector pts={[SETTINGS_R, BOT_T]} color={T.success} width={2.5} progress={tSb} opacity={0.8 * tSbVis * lf} />

      {FLAGS.map((f, i) => (
        <SchemaNode key={f.label} {...f} state="idle" lit={flagLit[i]} opacity={flagOp[i]} label={f.label} fontSize={22} />
      ))}
      <Pill x={FLAGS[1].x - 30} y={FLAGS[1].y + FLAGS[1].h + 14} dx={alienPillDx} text="hardcoding one alienates 66% of users" color={T.danger} opacity={alienPillOp} fontSize={17} />

      <SchemaNode {...CTX} state="accent" lit={ctxLit} opacity={ctxOp} label="LanguageContext" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>React Context, ~200 keys</div>
      </SchemaNode>
      {FLAGS_B.map((_, i) => (
        <Token key={i} pts={[FLAGS_B[i], CTX_T]} t={tF[i]} opacity={tFVis[i] * lf} />
      ))}
      <Pill x={CTX.x - 30} y={CTX.y - 46} text="translations.ts en / no / uk" color={T.accent} opacity={keysPillOp} fontSize={16} />

      <SchemaNode {...SETTINGS} state="accent" lit={settingsLit} opacity={settingsOp} label="user_settings" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>preferred_analysis_language</div>
      </SchemaNode>
      <Token pts={[CTX_B, SETTINGS_T]} t={tCs} opacity={tCsVis * lf} />

      <SchemaNode {...ANALYZER} state="success" lit={analyzerLit} opacity={analyzerOp} label="job-analyzer" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno Edge Function</div>
      </SchemaNode>
      <SchemaNode {...BOT} state="success" lit={botLit} opacity={botOp} label="Telegram bot" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>localized notifications</div>
      </SchemaNode>
      <Token pts={[SETTINGS_L, ANALYZER_T]} t={tSa} color={T.success} opacity={tSaVis * lf} />
      <Token pts={[SETTINGS_R, BOT_T]} t={tSb} color={T.success} opacity={tSbVis * lf} />
      <Pill x={SETTINGS.x - 10} y={SETTINGS.y + SETTINGS.h + 14} text="language param passed end-to-end" color={T.success} opacity={langParamPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Hardcoding one language would alienate 66% of a trilingual audience" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="One flag switch, persisted cross-device via Supabase user_settings" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Same choice drives AI analysis output and Telegram notifications too" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>UI, AI, Telegram — one setting, always in sync</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>100% linguistic coverage, every device</div>
      </div>
    </AbsoluteFill>
  );
};
