/**
 * FeatureOpenrouterImageBudget — feature v15 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: process-image's generateImageCascading() had two free tiers —
 * Cloudflare-hosted FLUX, then direct Gemini as a last resort — while the
 * site's small prepaid OpenRouter balance sat completely unused. A new
 * priority-(-1) tier goes first: generateImageViaOpenRouter() calls
 * google/gemini-2.5-flash-image through OpenRouter at ~$0.04/image,
 * spending the balance down. On any failure — including a 402 once the
 * balance is exhausted — the cascade falls through unchanged to the
 * existing free Cloudflare FLUX tier, then direct Gemini. The change is a
 * pure addition of 68 lines, nothing removed, so the old free path keeps
 * working exactly as before once the balance runs out.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const BALANCE = { x: 465, y: 30, w: 350, h: 70 };
const BALANCE_B: Pt = { x: BALANCE.x + BALANCE.w / 2, y: BALANCE.y + BALANCE.h };

const OPENROUTER = { x: 400, y: 158, w: 480, h: 100 };
const OPENROUTER_T: Pt = { x: OPENROUTER.x + OPENROUTER.w / 2, y: OPENROUTER.y };
const OPENROUTER_B: Pt = { x: OPENROUTER.x + OPENROUTER.w / 2, y: OPENROUTER.y + OPENROUTER.h };

const CLOUDFLARE = { x: 465, y: 310, w: 350, h: 80 };
const CLOUDFLARE_T: Pt = { x: CLOUDFLARE.x + CLOUDFLARE.w / 2, y: CLOUDFLARE.y };
const CLOUDFLARE_B: Pt = { x: CLOUDFLARE.x + CLOUDFLARE.w / 2, y: CLOUDFLARE.y + CLOUDFLARE.h };

const GEMINI_D = { x: 465, y: 440, w: 350, h: 80 };
const GEMINI_D_T: Pt = { x: GEMINI_D.x + GEMINI_D.w / 2, y: GEMINI_D.y };

const BALANCE_TO_OR: Pt[] = [BALANCE_B, OPENROUTER_T];
const OR_TO_CF: Pt[] = [OPENROUTER_B, CLOUDFLARE_T];
const CF_TO_GEM: Pt[] = [CLOUDFLARE_B, GEMINI_D_T];

export const FeatureOpenrouterImageBudget: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): the prepaid balance just sits there, unused ──
  const balOp = pop(6) * lf;
  const balLit = interpolate(frame, [6, 30, 96, 118], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 40, 62, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [100, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 24, 46, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (120–225): new priority -1 tier spends the balance first ──
  const t2 = seg(frame, 138, 164);
  const t2Vis = frame >= 138 && frame < 216 ? 1 : 0;
  const orOp = appear(148, 18) * lf;
  const orLit = interpolate(frame, [156, 180, 420, 440], [0, 0.85, 0.85, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2In = seg(frame, 182, 204, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [212, 234], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 160, 182, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [212, 234], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (225–330): failure/402 falls through unchanged to the free tiers ──
  const t3a = seg(frame, 236, 262);
  const t3aVis = frame >= 236 && frame < 300 ? 1 : 0;
  const cfOp = appear(244, 16) * lf;
  const cfLit = interpolate(frame, [252, 274, 420, 440], [0, 0.55, 0.55, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3b = seg(frame, 278, 304);
  const t3bVis = frame >= 278 && frame < 336 ? 1 : 0;
  const gemOp = appear(286, 16) * lf;
  const gemLit = interpolate(frame, [294, 316, 420, 440], [0, 0.55, 0.55, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 296, 318, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [326, 348], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 260, 282, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 348], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (330–450): result ──
  const metricOp = seg(frame, 350, 372, Easing.out(Easing.cubic)) * lf;
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={BALANCE_TO_OR} color={T.accent} width={2.5} progress={t2} opacity={0.85 * t2Vis * lf} />
      <Connector pts={OR_TO_CF} color={T.amber} width={2} progress={t3a} opacity={0.8 * t3aVis * lf} dashed />
      <Connector pts={CF_TO_GEM} color={T.success} width={2.5} progress={t3b} opacity={0.75 * t3bVis * lf} />

      <SchemaNode {...BALANCE} state="danger" lit={balLit} opacity={balOp} label="prepaid OpenRouter balance" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>sat unused before this change</div>
      </SchemaNode>
      <Pill x={870} y={44} text="no way to spend it on images" color={T.danger} opacity={pill1Op} fontSize={15} />

      <SchemaNode {...OPENROUTER} state="success" lit={orLit} opacity={orOp} label="OpenRouter: gemini-2.5-flash-image" fontSize={19}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>new priority -1 tier · goes first</div>
      </SchemaNode>
      <Token pts={BALANCE_TO_OR} t={t2} opacity={t2Vis * lf} />
      <Pill x={OPENROUTER.x + OPENROUTER.w - 40} y={OPENROUTER.y - 42} text="~$0.04/image — spends the balance down" color={T.success} opacity={pill2Op} fontSize={15} />

      <SchemaNode {...CLOUDFLARE} state="idle" lit={cfLit} opacity={cfOp} label="Cloudflare FLUX (free)" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>unchanged fallback</div>
      </SchemaNode>
      <Token pts={OR_TO_CF} t={t3a} color={T.amber} opacity={t3aVis * lf} />

      <SchemaNode {...GEMINI_D} state="idle" lit={gemLit} opacity={gemOp} label="Gemini direct (free)" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>final fallback, unchanged</div>
      </SchemaNode>
      <Token pts={CF_TO_GEM} t={t3b} color={T.success} opacity={t3bVis * lf} />
      <Pill x={GEMINI_D.x + GEMINI_D.w + 30} y={GEMINI_D.y + 14} text="pure addition — 68 lines, nothing removed" color={T.amber} opacity={pill3Op} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Two free tiers existed — the prepaid OpenRouter balance just sat there" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="A new priority -1 tier spends the balance on gemini-2.5-flash-image first" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Any failure — including a 402 once spent — falls through unchanged to the free tiers" color={T.amber} opacity={cap3} fontSize={20} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: T.muted }}>Near-Pro images while the balance lasts, free path unchanged once spent</div>
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
        <div style={{ fontSize: 25, fontWeight: 600, color: T.success }}>a dormant balance now spends itself on quality</div>
      </div>
    </AbsoluteFill>
  );
};
