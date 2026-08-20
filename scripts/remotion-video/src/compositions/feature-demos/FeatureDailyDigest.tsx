/**
 * FeatureDailyDigest — feature p10 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: a daily video news digest needs a 3-5 person team, 24-40
 * man-hours → daily-video-bot (GitHub Actions) ranks stories with Azure
 * OpenAI, generate-script.js writes 10 sixty-second segments,
 * generate-voiceover.js renders Zvukogram audio → daily-compilation.js
 * stitches it all with Remotion — intro, transitions, end card → under 10
 * minutes of compute, one Telegram tap to publish.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const TEAM = { x: 460, y: 30, w: 360, h: 80 };
const BOT = { x: 460, y: 150, w: 360, h: 80 };
const RANK = { x: 90, y: 290, w: 280, h: 90 };
const SCRIPT = { x: 500, y: 290, w: 280, h: 90 };
const VOICE = { x: 900, y: 290, w: 280, h: 90 };
const COMPILE = { x: 390, y: 440, w: 500, h: 80 };

const TEAM_B: Pt = { x: TEAM.x + TEAM.w / 2, y: TEAM.y + TEAM.h };
const BOT_T: Pt = { x: BOT.x + BOT.w / 2, y: BOT.y };
const BOT_B: Pt = { x: BOT.x + BOT.w / 2, y: BOT.y + BOT.h };
const RANK_T: Pt = { x: RANK.x + RANK.w / 2, y: RANK.y };
const RANK_R: Pt = { x: RANK.x + RANK.w, y: RANK.y + RANK.h / 2 };
const SCRIPT_L: Pt = { x: SCRIPT.x, y: SCRIPT.y + SCRIPT.h / 2 };
const SCRIPT_R: Pt = { x: SCRIPT.x + SCRIPT.w, y: SCRIPT.y + SCRIPT.h / 2 };
const VOICE_L: Pt = { x: VOICE.x, y: VOICE.y + VOICE.h / 2 };
const VOICE_B: Pt = { x: VOICE.x + VOICE.w / 2, y: VOICE.y + VOICE.h };
const COMPILE_T: Pt = { x: COMPILE.x + COMPILE.w / 2, y: COMPILE.y };

const P_TEAM_BOT: Pt[] = [TEAM_B, BOT_T];
const P_BOT_RANK: Pt[] = [BOT_B, RANK_T];
const P_RANK_SCRIPT: Pt[] = [RANK_R, SCRIPT_L];
const P_SCRIPT_VOICE: Pt[] = [SCRIPT_R, VOICE_L];
const P_VOICE_COMPILE: Pt[] = [VOICE_B, COMPILE_T];

export const FeatureDailyDigest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–104): manual production, 24-40 man-hours daily ──
  const teamOp = Math.min(1, pop(4)) * lf;
  const teamLit = interpolate(frame, [4, 26, 84, 104], [0, 0.5, 0.5, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const hoursPillIn = seg(frame, 30, 52, Easing.out(Easing.cubic));
  const hoursPillOp = hoursPillIn * interpolate(frame, [86, 106], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 18, 40, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (110–246): daily-video-bot ranks, scripts, voices ──
  const tTb = seg(frame, 112, 134);
  const tTbVis = frame >= 112 && frame < 190 ? 1 : 0;
  const botOp = appear(116, 18) * lf;
  const botLit = interpolate(frame, [124, 146, 330, 350], [0, 0.65, 0.65, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tBr = seg(frame, 148, 170);
  const tBrVis = frame >= 148 && frame < 330 ? 1 : 0;
  const rankOp = appear(152, 18) * lf;
  const rankLit = interpolate(frame, [160, 182, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tRs = seg(frame, 174, 196);
  const tRsVis = frame >= 174 && frame < 330 ? 1 : 0;
  const scriptOp = appear(178, 18) * lf;
  const scriptLit = interpolate(frame, [186, 208, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tSvo = seg(frame, 200, 222);
  const tSvoVis = frame >= 200 && frame < 330 ? 1 : 0;
  const voiceOp = appear(204, 18) * lf;
  const voiceLit = interpolate(frame, [212, 234, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 152, 174, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [240, 260], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–350): Remotion compiles the final broadcast ──
  const tVc = seg(frame, 252, 274);
  const tVcVis = frame >= 252 && frame < 330 ? 1 : 0;
  const compileOp = appear(256, 18) * lf;
  const compileLit = interpolate(frame, [264, 286, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const stitchPillIn = seg(frame, 288, 310, Easing.out(Easing.cubic));
  const stitchPillOp = stitchPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      <Connector pts={P_TEAM_BOT} color={T.accent} width={2.5} progress={tTb} opacity={0.8 * tTbVis * lf} />
      <Connector pts={P_BOT_RANK} color={T.accent} width={2.5} progress={tBr} opacity={0.8 * tBrVis * lf} />
      <Connector pts={P_RANK_SCRIPT} color={T.accent} width={2.5} progress={tRs} opacity={0.8 * tRsVis * lf} />
      <Connector pts={P_SCRIPT_VOICE} color={T.accent} width={2.5} progress={tSvo} opacity={0.8 * tSvoVis * lf} />
      <Connector pts={P_VOICE_COMPILE} color={T.success} width={2.5} progress={tVc} opacity={0.8 * tVcVis * lf} />

      <SchemaNode {...TEAM} state="danger" lit={teamLit} opacity={teamOp} label="3-5 person production team" fontSize={18} />
      <Pill x={TEAM.x - 10} y={TEAM.y + TEAM.h + 14} text="24-40 man-hours for a 10-minute broadcast" color={T.danger} opacity={hoursPillOp} fontSize={16} />

      <SchemaNode {...BOT} state="accent" lit={botLit} opacity={botOp} label="daily-video-bot" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>triggered by GitHub Actions</div>
      </SchemaNode>
      <Token pts={P_TEAM_BOT} t={tTb} opacity={tTbVis * lf} />

      <SchemaNode {...RANK} state="accent" lit={rankLit} opacity={rankOp} label="Azure OpenAI ranks stories" fontSize={15} />
      <Token pts={P_BOT_RANK} t={tBr} opacity={tBrVis * lf} />
      <SchemaNode {...SCRIPT} state="accent" lit={scriptLit} opacity={scriptOp} label="generate-script.js" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>up to 10 x 60s segments</div>
      </SchemaNode>
      <Token pts={P_RANK_SCRIPT} t={tRs} opacity={tRsVis * lf} />
      <SchemaNode {...VOICE} state="accent" lit={voiceLit} opacity={voiceOp} label="generate-voiceover.js" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Zvukogram TTS</div>
      </SchemaNode>
      <Token pts={P_SCRIPT_VOICE} t={tSvo} opacity={tSvoVis * lf} />

      <SchemaNode {...COMPILE} state="success" lit={compileLit} opacity={compileOp} label="daily-compilation.js" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Remotion — intro, transitions, end card</div>
      </SchemaNode>
      <Token pts={P_VOICE_COMPILE} t={tVc} color={T.success} opacity={tVcVis * lf} />
      <Pill x={COMPILE.x - 10} y={COMPILE.y - 46} text="metadata prepped for direct YouTube upload" color={T.success} opacity={stitchPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Curating, scripting, recording, editing — a full production team, daily" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="One pipeline ranks, scripts, and voices 10 segments automatically" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Remotion stitches every asset into a branded, ready-to-publish show" color={T.success} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>From 24-40 man-hours to autonomous compute</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Under 10 minutes, one Telegram tap to publish</div>
      </div>
    </AbsoluteFill>
  );
};
