/**
 * FeatureAutoRegister — feature j08 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 5-7 platforms, each with unique forms and password rules, force
 * 30+ minutes of manual registration → register_site.py (Skyvern Docker)
 * checks site_credentials for dupes, then mints a 16-char password via
 * Python's secrets module → an unknown field logs to registration_questions
 * and pings Telegram inline buttons, with a strict 5-minute reply timeout →
 * "30+ min → under 2 min, credentials auto-retrieved forever after".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const FORM = { x: 465, y: 76, w: 350, h: 96 };
const SITES = ["Webcruiter", "Easycruit", "JobbNorge", "Teamtailor", "FINN.no", "NAV.no"];
const CHIP_XS = [150, 340, 530, 720, 910, 1060];
const CHIP_YS = [220, 180, 220, 220, 180, 220];

const DAEMON = { x: 70, y: 300, w: 280, h: 94 };
const CRED = { x: 420, y: 300, w: 250, h: 94 };
const SECRETS = { x: 740, y: 300, w: 270, h: 94 };
const QFIELD = { x: 90, y: 470, w: 320, h: 90 };
const TG = { x: 480, y: 470, w: 300, h: 90 };

const DAEMON_R: Pt = { x: DAEMON.x + DAEMON.w, y: DAEMON.y + DAEMON.h / 2 };
const CRED_L: Pt = { x: CRED.x, y: CRED.y + CRED.h / 2 };
const CRED_R: Pt = { x: CRED.x + CRED.w, y: CRED.y + CRED.h / 2 };
const SECRETS_L: Pt = { x: SECRETS.x, y: SECRETS.y + SECRETS.h / 2 };
const SECRETS_B: Pt = { x: SECRETS.x + SECRETS.w / 2, y: SECRETS.y + SECRETS.h };
const QFIELD_T: Pt = { x: QFIELD.x + QFIELD.w / 2, y: QFIELD.y };
const QFIELD_R: Pt = { x: QFIELD.x + QFIELD.w, y: QFIELD.y + QFIELD.h / 2 };
const TG_L: Pt = { x: TG.x, y: TG.y + TG.h / 2 };

const P_DC: Pt[] = [DAEMON_R, CRED_L];
const P_CS: Pt[] = [CRED_R, SECRETS_L];
const P_SQ: Pt[] = [SECRETS_B, { x: SECRETS_B.x, y: 420 }, QFIELD_T];
const P_QT: Pt[] = [QFIELD_R, TG_L];

export const FeatureAutoRegister: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): 6 platforms, each a manual registration ──
  const formOp = Math.min(1, pop(10)) * lf;
  const formLit = interpolate(frame, [10, 34, 96, 118], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const chipOp = SITES.map((_, i) => appear(20 + i * 10, 14) * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf);
  const pillIn = seg(frame, 48, 70, Easing.out(Easing.cubic));
  const pillOp = pillIn * interpolate(frame, [98, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–234): daemon → dedup check → password minted ──
  const daemonOp = appear(130, 18) * lf;
  const daemonLit = interpolate(frame, [138, 160, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tDc = seg(frame, 150, 172);
  const tDcVis = frame >= 150 && frame < 200 ? 1 : 0;
  const credOp = appear(152, 18) * lf;
  const credLit = interpolate(frame, [160, 182, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tCs = seg(frame, 184, 206);
  const tCsVis = frame >= 184 && frame < 230 ? 1 : 0;
  const secretsOp = appear(186, 18) * lf;
  const secretsLit = interpolate(frame, [194, 216, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const dedupPillIn = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const dedupPillOp = dedupPillIn * interpolate(frame, [218, 238], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): unknown field → Telegram inline buttons, 5-min timeout ──
  const tSq = seg(frame, 242, 268);
  const tSqVis = frame >= 242 && frame < 300 ? 1 : 0;
  const qfieldOp = appear(246, 18) * lf;
  const qfieldLit = interpolate(frame, [254, 276, 330, 350], [0, 0.6, 0.6, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tQt = seg(frame, 272, 294);
  const tQtVis = frame >= 272 && frame < 320 ? 1 : 0;
  const tgOp = appear(276, 18) * lf;
  const tgLit = interpolate(frame, [284, 306, 330, 350], [0, 0.7, 0.7, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const timeoutPillIn = seg(frame, 288, 310, Easing.out(Easing.cubic));
  const timeoutPillOp = timeoutPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 256, 278, Easing.out(Easing.cubic));
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

      <Connector pts={P_DC} color={T.accent} width={2.5} progress={tDc} opacity={0.8 * tDcVis * lf} />
      <Connector pts={P_CS} color={T.accent} width={2.5} progress={tCs} opacity={0.8 * tCsVis * lf} />
      <Connector pts={P_SQ} color={T.amber} width={2.5} progress={tSq} opacity={0.8 * tSqVis * lf} />
      <Connector pts={P_QT} color={T.amber} width={2.5} progress={tQt} opacity={0.8 * tQtVis * lf} />

      <SchemaNode {...FORM} state="danger" lit={formLit} opacity={formOp} label="Manual registration × 7" fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>unique forms, password rules</div>
      </SchemaNode>
      {SITES.map((s, i) => (
        <Pill key={s} x={CHIP_XS[i]} y={CHIP_YS[i]} text={s} color={T.danger} opacity={chipOp[i]} fontSize={17} />
      ))}
      <Pill x={FORM.x + 60} y={FORM.y - 46} text="30+ min, repetitive, per platform" color={T.danger} opacity={pillOp} fontSize={19} />

      <SchemaNode {...DAEMON} state="accent" lit={daemonLit} opacity={daemonOp} label="register_site.py" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Skyvern Docker</div>
      </SchemaNode>
      <SchemaNode {...CRED} state="accent" lit={credLit} opacity={credOp} label="site_credentials" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>dedup check</div>
      </SchemaNode>
      <SchemaNode {...SECRETS} state="accent" lit={secretsLit} opacity={secretsOp} label="secrets.token()" fontSize={18}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>16-char password</div>
      </SchemaNode>
      <Token pts={P_DC} t={tDc} opacity={tDcVis * lf} />
      <Token pts={P_CS} t={tCs} opacity={tCsVis * lf} />
      <Pill x={CRED.x + 10} y={CRED.y - 46} text="prevents duplicate accounts" color={T.amber} opacity={dedupPillOp} fontSize={17} />

      <SchemaNode {...QFIELD} state="amber" lit={qfieldLit} opacity={qfieldOp} label="registration_questions" fontSize={16}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>unknown field logged</div>
      </SchemaNode>
      <SchemaNode {...TG} state="amber" lit={tgLit} opacity={tgOp} label="Telegram · inline buttons" fontSize={17}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>asks you directly</div>
      </SchemaNode>
      <Token pts={P_SQ} t={tSq} color={T.amber} opacity={tSqVis * lf} />
      <Token pts={P_QT} t={tQt} color={T.amber} opacity={tQtVis * lf} />
      <Pill x={TG.x + 20} y={TG.y + TG.h + 12} text="5-minute reply timeout" color={T.amber} opacity={timeoutPillOp} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="5-7 platforms, unique forms and password rules, every time" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Checks for an existing account, then mints a fresh 16-char password" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Unknown field? Ask you directly, over Telegram, in the moment" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>30+ minutes → under 2 minutes of Telegram taps</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Credentials auto-retrieved for every future application</div>
      </div>
    </AbsoluteFill>
  );
};
