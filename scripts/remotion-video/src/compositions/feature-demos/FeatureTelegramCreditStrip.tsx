/**
 * FeatureTelegramCreditStrip — feature v16 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: every article rendered a "Photo: t.me" caption and a link back to
 * the originating channel regardless of source, even though Telegram
 * content is rewritten in-house by the time it's published → a new
 * lib/source-policy.ts centralizes the decision: isTelegramSourced() checks
 * source_type='telegram' first, falling back to a t.me/telegram.me/
 * telegram.dog/telesco.pe host check → showsSourceCredit() hides the photo
 * caption entirely for Telegram-sourced articles → visibleResourceLinks()
 * still keeps genuinely useful links (product site, GitHub, docs, demos)
 * but drops aggregators, social networks, and any .ru/.su/.рф domain via
 * BLOCKED_HOSTS, plus the channel link itself — publisher-sourced articles
 * (RSS, manual, typically Norwegian) are left completely untouched, since
 * that attribution is exactly what the hotlink legal defence depends on →
 * Telegram articles now read as our own reporting, publishers keep credit
 * exactly as before.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ARTICLE = { x: 465, y: 34, w: 350, h: 76 };
const ARTICLE_B: Pt = { x: ARTICLE.x + ARTICLE.w / 2, y: ARTICLE.y + ARTICLE.h };

const POLICY = { x: 390, y: 186, w: 500, h: 96 };
const POLICY_T: Pt = { x: POLICY.x + POLICY.w / 2, y: POLICY.y };
const POLICY_BL: Pt = { x: POLICY.x + 90, y: POLICY.y + POLICY.h };
const POLICY_BR: Pt = { x: POLICY.x + POLICY.w - 90, y: POLICY.y + POLICY.h };

const TELEGRAM_BR = { x: 90, y: 360, w: 430, h: 104 };
const TELEGRAM_BR_T: Pt = { x: TELEGRAM_BR.x + TELEGRAM_BR.w / 2, y: TELEGRAM_BR.y };

const PUBLISHER_BR = { x: 760, y: 360, w: 430, h: 104 };
const PUBLISHER_BR_T: Pt = { x: PUBLISHER_BR.x + PUBLISHER_BR.w / 2, y: PUBLISHER_BR.y };

const ARTICLE_TO_POLICY: Pt[] = [ARTICLE_B, POLICY_T];
const POLICY_TO_TELEGRAM: Pt[] = [POLICY_BL, TELEGRAM_BR_T];
const POLICY_TO_PUBLISHER: Pt[] = [POLICY_BR, PUBLISHER_BR_T];

export const FeatureTelegramCreditStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): every article credited the source channel regardless ──
  const artOp = pop(6) * lf;
  const artLit = interpolate(frame, [6, 30, 96, 118], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const crossScale = pop(36) * interpolate(frame, [96, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [100, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (120–225): source-policy.ts decides by source_type, then host ──
  const t2 = seg(frame, 138, 164);
  const t2Vis = frame >= 138 && frame < 216 ? 1 : 0;
  const polOp = appear(148, 18) * lf;
  const polLit = interpolate(frame, [156, 180, 420, 440], [0, 0.8, 0.8, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 182, 204, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [212, 234], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [212, 234], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (225–330): branch — Telegram hides credit, publishers untouched ──
  const t3a = seg(frame, 236, 262);
  const t3aVis = frame >= 236 && frame < 320 ? 1 : 0;
  const telOp = appear(244, 16) * lf;
  const telLit = interpolate(frame, [252, 274, 420, 440], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3b = seg(frame, 240, 266);
  const t3bVis = frame >= 240 && frame < 320 ? 1 : 0;
  const pubOp = appear(248, 16) * lf;
  const pubLit = interpolate(frame, [256, 278, 420, 440], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 288, 310, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [326, 348], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 348], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (330–450): result ──
  const telCheck = pop(352) * lf;
  const pubCheck = pop(360) * lf;
  const metricOp = seg(frame, 340, 362, Easing.out(Easing.cubic)) * lf;
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={ARTICLE_TO_POLICY} color={T.accent} width={2.5} progress={t2} opacity={0.85 * t2Vis * lf} />
      <Connector pts={POLICY_TO_TELEGRAM} color={T.success} width={2.5} progress={t3a} opacity={0.8 * t3aVis * lf} />
      <Connector pts={POLICY_TO_PUBLISHER} color={T.muted} width={2} progress={t3b} opacity={0.6 * t3bVis * lf} dashed />

      <SchemaNode {...ARTICLE} state="danger" lit={artLit} opacity={artOp} label="any published article" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>"Photo: t.me" + channel link, always</div>
      </SchemaNode>
      <Badge x={ARTICLE.x + ARTICLE.w - 20} y={ARTICLE.y - 16} kind="cross" scale={crossScale} opacity={crossScale} size={26} />
      <Pill x={ARTICLE.x - 140} y={ARTICLE.y + ARTICLE.h + 14} text="credited regardless of where content came from" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...POLICY} state="success" lit={polLit} opacity={polOp} label="lib/source-policy.ts" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>isTelegramSourced(): source_type, then t.me host</div>
      </SchemaNode>
      <Token pts={ARTICLE_TO_POLICY} t={t2} opacity={t2Vis * lf} />
      <Pill x={POLICY.x + 60} y={POLICY.y - 42} text="18/18 telegram rows carry a t.me original_url" color={T.success} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...TELEGRAM_BR} state="success" lit={telLit} opacity={telOp} label="Telegram-sourced" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>credit + channel link hidden</div>
      </SchemaNode>
      <Token pts={POLICY_TO_TELEGRAM} t={t3a} color={T.success} opacity={t3aVis * lf} />
      <Badge x={TELEGRAM_BR.x + TELEGRAM_BR.w - 18} y={TELEGRAM_BR.y - 16} kind="check" scale={telCheck} opacity={telCheck} size={26} />

      <SchemaNode {...PUBLISHER_BR} state="idle" lit={pubLit} opacity={pubOp} label="Publisher-sourced (RSS / manual)" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>mandatory credit kept, untouched</div>
      </SchemaNode>
      <Token pts={POLICY_TO_PUBLISHER} t={t3b} color={T.muted} opacity={t3bVis * lf} />
      <Badge x={PUBLISHER_BR.x + PUBLISHER_BR.w - 18} y={PUBLISHER_BR.y - 16} kind="check" scale={pubCheck} opacity={pubCheck} size={26} />

      <Pill x={340} y={488} text="keeps GitHub/docs/demo links — drops aggregators + .ru/.su/.рф via BLOCKED_HOSTS" color={T.amber} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Every article credited the source channel, regardless of where it came from" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="source-policy.ts decides by source_type first, then a t.me host check" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Publisher-sourced articles stay untouched — that credit is what the hotlink defence depends on" color={T.amber} opacity={cap3} fontSize={19} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: T.muted }}>Telegram content reads as our own reporting; publisher credit is untouched</div>
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
        <div style={{ fontSize: 25, fontWeight: 600, color: T.success }}>no channel credit, no channel link — our reporting</div>
      </div>
    </AbsoluteFill>
  );
};
