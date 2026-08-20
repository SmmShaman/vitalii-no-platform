/**
 * FeaturePocketJobCard — feature j23 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: deep AI insights (score, aura, 5-axis radar, pros/cons, tasks,
 * deadline) dumped into one Telegram message became an unreadable wall of
 * text, truncated by the 4096-char limit → a compact job card shows
 * aura_emoji + company + title + score + deadline + form_type with
 * Apply/Ignore buttons → a "Details" button calls editMessageText to expand
 * the SAME message in place with pros/cons, tasks, radar scores → "under 3
 * seconds per decision, 100% compliance with the 4096-char limit".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const WALL = { x: 415, y: 56, w: 450, h: 118 };
const WALL_BOTTOM: Pt = { x: WALL.x + WALL.w / 2, y: WALL.y + WALL.h };

const CARD = { x: 465, y: 240, w: 350, h: 150 };
const CARD_TOP: Pt = { x: CARD.x + CARD.w / 2, y: CARD.y };
const CARD_BOTTOM: Pt = { x: CARD.x + CARD.w / 2, y: CARD.y + CARD.h };

const DETAILS = { x: 465, y: 460, w: 350, h: 96 };
const DETAILS_TOP: Pt = { x: DETAILS.x + DETAILS.w / 2, y: DETAILS.y };

const WALL_TO_CARD: Pt[] = [WALL_BOTTOM, CARD_TOP];
const CARD_TO_DETAILS: Pt[] = [CARD_BOTTOM, DETAILS_TOP];

export const FeaturePocketJobCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): unreadable wall of text, truncated ──
  const wallOp = appear(6) * lf;
  const wallLit = interpolate(frame, [6, 30, 108, 128], [0, 0.45, 0.45, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): compact job card ──
  const cardOp = appear(140, 18) * lf;
  const cardLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t2 = seg(frame, 156, 190);
  const t2Vis = frame >= 156 && frame < 224 ? 1 : 0;
  const btnOp = ["Apply", "Ignore"].map((_, i) => appear(180 + i * 10, 14) * lf);
  const pill2In = seg(frame, 200, 222, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): Details → editMessageText expands in place ──
  const detOp = appear(244, 18) * lf;
  const detLit = interpolate(frame, [252, 274, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3 = seg(frame, 254, 280);
  const t3Vis = frame >= 254 && frame < 320 ? 1 : 0;
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

      <Connector pts={WALL_TO_CARD} color={T.accent} width={2.5} progress={t2} opacity={0.8 * t2Vis * lf} />
      <Connector pts={CARD_TO_DETAILS} color={T.success} width={2.5} progress={t3} opacity={0.8 * t3Vis * lf} />

      <SchemaNode {...WALL} state="danger" lit={wallLit} opacity={wallOp} label="score · aura · radar · pros/cons · tasks…" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>one giant message, truncated at 4096 chars</div>
      </SchemaNode>
      <Pill x={WALL.x + 60} y={WALL.y - 44} dx={pill1Dx} text="unreadable on mobile" color={T.danger} opacity={pill1Op} fontSize={19} />

      <SchemaNode {...CARD} state="accent" lit={cardLit} opacity={cardOp} label="💚 Growth · Acme AS" fontSize={20}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2, textAlign: "center" }}>
          78% score · deadline Fri · Enkel Søknad
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {["Apply", "Ignore"].map((b, i) => (
            <div
              key={b}
              style={{
                opacity: btnOp[i],
                fontSize: 13,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 8,
                border: `1px solid ${hexA(T.accent, 0.7)}`,
                color: T.text,
                background: T.nodeFillDeep,
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </SchemaNode>
      <Token pts={WALL_TO_CARD} t={t2} opacity={t2Vis * lf} />
      <Pill x={CARD.x + 30} y={CARD.y - 44} dx={pill2Dx} text="6 aura types, one glance" color={T.accent} opacity={pill2Op} fontSize={19} />

      <SchemaNode {...DETAILS} state="success" lit={detLit} opacity={detOp} label="editMessageText()" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>same message → pros/cons, tasks, radar</div>
      </SchemaNode>
      <Token pts={CARD_TO_DETAILS} t={t3} color={T.success} opacity={t3Vis * lf} />
      <Pill x={DETAILS.x + 20} y={DETAILS.y + DETAILS.h + 12} dx={pill3Dx} text="cover letters truncated to 1500 chars" color={T.success} opacity={pill3Op} fontSize={18} />

      <Caption x={90} y={648} w={1100} text="Every insight crammed into one message was unreadable" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="A compact card shows what matters — score, deadline, aura" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Full details are one tap away, no new message sent" color={T.success} opacity={cap3} fontSize={24} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>apply-or-not, decided in one glance</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Under 3 seconds per decision</div>
      </div>
    </AbsoluteFill>
  );
};
