/**
 * FeatureCredentialVault — feature j33 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: 11+ Norwegian job sites (Webcruiter, FINN, Teamtailor) each need
 * login credentials — hardcoding in .env doesn't scale, plain text is
 * unacceptable → site_credentials table with RLS, generate_secure_password(16)
 * from Python's secrets module, auto_apply.py auto-selects per domain, a
 * Telegram prompt fires on login failure → zero hardcoded passwords,
 * seamless secure automation.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const SITES = [
  { x: 90, y: 60, w: 210, h: 78, label: "Webcruiter" },
  { x: 350, y: 60, w: 210, h: 78, label: "FINN.no" },
  { x: 610, y: 60, w: 210, h: 78, label: "Teamtailor" },
  { x: 870, y: 60, w: 210, h: 78, label: "+8 more" },
];
const SITES_B: Pt[] = SITES.map((s) => ({ x: s.x + s.w / 2, y: s.y + s.h }));

const ENV = { x: 470, y: 210, w: 340, h: 84 };
const ENV_T: Pt = { x: ENV.x + ENV.w / 2, y: ENV.y };

const GENPW = { x: 130, y: 350, w: 280, h: 90 };
const TABLE = { x: 500, y: 350, w: 280, h: 90 };
const AUTOAPPLY = { x: 870, y: 350, w: 260, h: 90 };
const GENPW_R: Pt = { x: GENPW.x + GENPW.w, y: GENPW.y + GENPW.h / 2 };
const TABLE_L: Pt = { x: TABLE.x, y: TABLE.y + TABLE.h / 2 };
const TABLE_R: Pt = { x: TABLE.x + TABLE.w, y: TABLE.y + TABLE.h / 2 };
const AUTOAPPLY_L: Pt = { x: AUTOAPPLY.x, y: AUTOAPPLY.y + AUTOAPPLY.h / 2 };
const TABLE_T: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y };

const TG = { x: 500, y: 500, w: 280, h: 78 };
const TG_T: Pt = { x: TG.x + TG.w / 2, y: TG.y };

export const FeatureCredentialVault: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–116): 11+ sites, hardcoding/plain-text both unacceptable ──
  const siteOp = SITES.map((_, i) => appear(6 + i * 8) * lf);
  const siteLit = SITES.map((_, i) =>
    interpolate(frame, [6 + i * 8, 28 + i * 8, 96, 116], [0, 0.4, 0.4, 0.12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const envOp = Math.min(1, pop(46)) * lf;
  const envLit = interpolate(frame, [46, 68, 96, 116], [0, 0.5, 0.5, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const connSiteOp = SITES.map((_, i) => 0.4 * Math.min(siteOp[i], envOp));
  const xScale = pop(64) * interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): generate_secure_password → site_credentials with RLS ──
  const genOp = appear(134, 18) * lf;
  const genLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tGt = seg(frame, 152, 176);
  const tGtVis = frame >= 152 && frame < 198 ? 1 : 0;
  const tableOp = appear(166, 18) * lf;
  const tableLit = interpolate(frame, [174, 196, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const rlsPillIn = seg(frame, 180, 202, Easing.out(Easing.cubic));
  const rlsPillOp = rlsPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): auto_apply.py auto-selects; login failure → Telegram prompt ──
  const tTa = seg(frame, 250, 274);
  const tTaVis = frame >= 250 && frame < 300 ? 1 : 0;
  const tTt = seg(frame, 256, 280);
  const tTtVis = frame >= 256 && frame < 306 ? 1 : 0;
  const autoOp = appear(266, 18) * lf;
  const autoLit = interpolate(frame, [274, 296, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tgOp = appear(272, 18) * lf;
  const tgLit = interpolate(frame, [280, 302, 330, 350], [0, 0.6, 0.6, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const maskedPillIn = seg(frame, 284, 306, Easing.out(Easing.cubic));
  const maskedPillOp = maskedPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
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

      {SITES_B.map((p, i) => (
        <Connector key={i} pts={[p, ENV_T]} color={T.danger} width={2} opacity={connSiteOp[i]} />
      ))}
      <Connector pts={[GENPW_R, TABLE_L]} color={T.accent} width={2.5} progress={tGt} opacity={0.8 * tGtVis * lf} />
      <Connector pts={[TABLE_R, AUTOAPPLY_L]} color={T.success} width={2.5} progress={tTa} opacity={0.8 * tTaVis * lf} />
      <Connector pts={[TABLE_T, TG_T]} color={T.amber} width={2} progress={tTt} opacity={0.7 * tTtVis * lf} />

      {SITES.map((s, i) => (
        <SchemaNode key={s.label} {...s} state="danger" lit={siteLit[i]} opacity={siteOp[i]} label={s.label} fontSize={19} />
      ))}
      <SchemaNode {...ENV} state="danger" lit={envLit} opacity={envOp} label=".env hardcoded / plain text" fontSize={19} />
      <Badge x={ENV.x + ENV.w / 2 - 18} y={ENV.y - 36} kind="cross" scale={xScale} opacity={xScale} />

      <SchemaNode {...GENPW} state="accent" lit={genLit} opacity={genOp} label="generate_secure_password(16)" fontSize={16}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Python secrets module</div>
      </SchemaNode>
      <SchemaNode {...TABLE} state="accent" lit={tableLit} opacity={tableOp} label="site_credentials" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Supabase, RLS per user</div>
      </SchemaNode>
      <Token pts={[GENPW_R, TABLE_L]} t={tGt} opacity={tGtVis * lf} />
      <Pill x={TABLE.x + 10} y={TABLE.y - 46} text="per-user RLS isolation" color={T.accent} opacity={rlsPillOp} fontSize={16} />

      <SchemaNode {...AUTOAPPLY} state="success" lit={autoLit} opacity={autoOp} label="auto_apply.py" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>auto-selects by domain</div>
      </SchemaNode>
      <Token pts={[TABLE_R, AUTOAPPLY_L]} t={tTa} color={T.success} opacity={tTaVis * lf} />

      <SchemaNode {...TG} state="amber" lit={tgLit} opacity={tgOp} label="Telegram prompt" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>on login failure</div>
      </SchemaNode>
      <Token pts={[TABLE_T, TG_T]} t={tTt} color={T.amber} opacity={tTtVis * lf} />
      <Pill x={TG.x - 20} y={TG.y + TG.h + 14} text="passwords masked by default in dashboard" color={T.amber} opacity={maskedPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="11+ platforms, each needing a login — hardcoding or plain text won't scale" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Cryptographically generated passwords land in an RLS-isolated vault" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="The bot auto-selects credentials by domain — failure pings Telegram" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Zero hardcoded passwords across 11+ job sites</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Uninterrupted, secure automation across all sites</div>
      </div>
    </AbsoluteFill>
  );
};
