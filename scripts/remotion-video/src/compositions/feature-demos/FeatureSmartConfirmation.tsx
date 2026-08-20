/**
 * FeatureSmartConfirmation — feature j21 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: pressing "Send" felt like a blind jump — no idea if a stale
 * name/email/phone would go out with 10-15 apps/week → sendApplication
 * pulls user_profiles + cover_letters + site_credentials from Supabase and
 * renders an HTML preview → edit_email / edit_phone / edit_cover_letter
 * buttons patch the field live and re-render the same message in place →
 * "zero wrong-email tickets, 5 fields checked in under 2 seconds".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BLIND = { x: 465, y: 66, w: 350, h: 96 };
const BLIND_BOTTOM: Pt = { x: BLIND.x + BLIND.w / 2, y: BLIND.y + BLIND.h };

const PROFILE = { x: 90, y: 240, w: 230, h: 100 };
const LETTER = { x: 350, y: 240, w: 230, h: 100 };
const CREDS = { x: 610, y: 240, w: 230, h: 100 };
const SRC3 = [PROFILE, LETTER, CREDS];
const SRC3_TOP: Pt[] = SRC3.map((s) => ({ x: s.x + s.w / 2, y: s.y }));

const PREVIEW = { x: 890, y: 240, w: 300, h: 140 };
const PREVIEW_L: Pt = { x: PREVIEW.x, y: PREVIEW.y + PREVIEW.h / 2 };

const EDIT = { x: 465, y: 440, w: 350, h: 96 };
const EDIT_TOP: Pt = { x: EDIT.x + EDIT.w / 2, y: EDIT.y };
const PREVIEW_BOTTOM: Pt = { x: PREVIEW.x + PREVIEW.w / 2, y: PREVIEW.y + PREVIEW.h };

const BLIND_TO_SRC: Pt[][] = SRC3_TOP.map((p) => [BLIND_BOTTOM, p]);
const SRC_TO_PREVIEW: Pt[] = [{ x: CREDS.x + CREDS.w, y: CREDS.y + CREDS.h / 2 }, PREVIEW_L];
const PREVIEW_TO_EDIT: Pt[] = [PREVIEW_BOTTOM, EDIT_TOP];

export const FeatureSmartConfirmation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): pressing Send is a blind jump ──
  const blindOp = appear(6) * lf;
  const blindLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const qMarkScale = pop(30) * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): fetch profile + letter + creds → build preview ──
  const srcOp = SRC3.map((_, i) => appear(140 + i * 10, 16) * lf);
  const srcLit = SRC3.map((_, i) => {
    const s = 146 + i * 10;
    return interpolate(frame, [s, s + 20, 330, 350], [0, 0.6, 0.6, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  });
  const t2 = SRC3.map((_, i) => seg(frame, 150 + i * 8, 176 + i * 8));
  const t2Vis = SRC3.map((_, i) => (frame >= 150 + i * 8 && frame < 214 ? 1 : 0));
  const previewOp = appear(196, 18) * lf;
  const previewLit = interpolate(frame, [196, 220, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2b = seg(frame, 204, 228);
  const t2bVis = frame >= 204 && frame < 232 ? 1 : 0;
  const cap2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): edit buttons patch a field, re-render in place ──
  const editOp = appear(244, 18) * lf;
  const editLit = interpolate(frame, [252, 274, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
  const editCheck = pop(284) * lf;
  const pill3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricIn = seg(frame, 358, 380, Easing.out(Easing.cubic));
  const metricOp = metricIn * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {BLIND_TO_SRC.map((pts, i) => (
        <Connector key={i} pts={pts} color={T.accent} width={2.5} progress={t2[i]} opacity={0.8 * t2Vis[i] * lf} />
      ))}
      <Connector pts={SRC_TO_PREVIEW} color={T.accent} width={2.5} progress={t2b} opacity={0.8 * t2bVis * lf} />
      <Connector pts={PREVIEW_TO_EDIT} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...BLIND} state="danger" lit={blindLit} opacity={blindOp} label='Press "Send"' fontSize={24}>
        <div style={{ fontSize: 14, color: T.muted, fontWeight: 500, marginTop: 2 }}>current email? phone? no idea</div>
      </SchemaNode>
      <Badge x={BLIND.x + BLIND.w / 2 - 18} y={BLIND.y - 46} kind="cross" scale={qMarkScale} opacity={qMarkScale} />

      <SchemaNode {...PROFILE} state="accent" lit={srcLit[0]} opacity={srcOp[0]} label="user_profiles" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>name · email · phone</div>
      </SchemaNode>
      <SchemaNode {...LETTER} state="accent" lit={srcLit[1]} opacity={srcOp[1]} label="cover_letters" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>first 200 chars</div>
      </SchemaNode>
      <SchemaNode {...CREDS} state="accent" lit={srcLit[2]} opacity={srcOp[2]} label="site_credentials" fontSize={18} />
      {t2.map((t, i) => (
        <Token key={i} pts={BLIND_TO_SRC[i]} t={t} opacity={t2Vis[i] * lf} />
      ))}

      <SchemaNode {...PREVIEW} state="accent" lit={previewLit} opacity={previewOp} label="Preview message" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>
          parse_mode: HTML — 5 fields shown
        </div>
      </SchemaNode>
      <Token pts={SRC_TO_PREVIEW} t={t2b} opacity={t2bVis * lf} />
      <Caption x={90} y={648} w={1100} text="Pressing Send used to be a leap of faith on stale data" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every field is fetched fresh and shown before sending" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Edit buttons patch Supabase, then re-render in place" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <SchemaNode {...EDIT} state="success" lit={editLit} opacity={editOp} label="edit_email · edit_phone · confirm_send" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>update() → re-render preview</div>
      </SchemaNode>
      <Token pts={PREVIEW_TO_EDIT} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Badge x={EDIT.x + EDIT.w - 20} y={EDIT.y - 12} kind="check" scale={editCheck} opacity={editCheck} />
      <Pill x={EDIT.x + 30} y={EDIT.y + EDIT.h + 12} dx={pill3Dx} text="zero wrong-email tickets" color={T.success} opacity={pill3Op} fontSize={19} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>5 fields checked, under 2 seconds</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>No more blind applications</div>
      </div>
    </AbsoluteFill>
  );
};
