/**
 * FeatureRaceConditionPosting — feature p17 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: wasAlreadyPosted() only checked status='posted', leaving a ~3s
 * window where two concurrent requests both slip through → createSocialPost()
 * now inserts a 'pending' row first into social_posts, which carries a
 * UNIQUE(content_id, platform, language) constraint → the second insert hits
 * Postgres error 23505 and aborts immediately, only the winner flips
 * pending → posted after the LinkedIn call succeeds → "zero duplicate
 * posts".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const REQ_A = { x: 130, y: 66, w: 240, h: 90 };
const REQ_B = { x: 900, y: 66, w: 240, h: 90 };
const REQ_A_BOTTOM: Pt = { x: REQ_A.x + REQ_A.w / 2, y: REQ_A.y + REQ_A.h };
const REQ_B_BOTTOM: Pt = { x: REQ_B.x + REQ_B.w / 2, y: REQ_B.y + REQ_B.h };

const TABLE = { x: 465, y: 240, w: 350, h: 118 };
const TABLE_TOP: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y };
const TABLE_BOTTOM: Pt = { x: TABLE.x + TABLE.w / 2, y: TABLE.y + TABLE.h };

const LINKEDIN = { x: 465, y: 440, w: 350, h: 96 };
const LINKEDIN_TOP: Pt = { x: LINKEDIN.x + LINKEDIN.w / 2, y: LINKEDIN.y };

const A_TO_TABLE: Pt[] = [REQ_A_BOTTOM, TABLE_TOP];
const B_TO_TABLE: Pt[] = [REQ_B_BOTTOM, TABLE_TOP];
const TABLE_TO_LI: Pt[] = [TABLE_BOTTOM, LINKEDIN_TOP];

export const FeatureRaceConditionPosting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–120): two concurrent requests, ~3s window ──
  const aOp = appear(6) * lf;
  const bOp = appear(6) * lf;
  const reqLit = interpolate(frame, [6, 30, 108, 128], [0, 0.5, 0.5, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1In = seg(frame, 44, 66, Easing.out(Easing.cubic));
  const pill1Op = pill1In * interpolate(frame, [104, 126], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill1Dx = (1 - pill1In) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [108, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (130–235): createSocialPost() inserts 'pending' with UNIQUE constraint ──
  const tableOp = appear(140, 18) * lf;
  const tableLit = interpolate(frame, [148, 175, 330, 350], [0, 0.75, 0.75, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const tA = seg(frame, 150, 182);
  const tAVis = frame >= 150 && frame < 214 ? 1 : 0;
  const pill2In = seg(frame, 194, 216, Easing.out(Easing.cubic));
  const pill2Op = pill2In * interpolate(frame, [296, 318], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill2Dx = (1 - pill2In) * 40;
  const cap2In = seg(frame, 164, 186, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (236–340): second insert hits 23505, aborts ──
  const tB = seg(frame, 190, 222);
  const tBVis = frame >= 190 && frame < 250 ? 1 : 0;
  const crossScale = pop(226) * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3In = seg(frame, 234, 256, Easing.out(Easing.cubic));
  const pill3Op = pill3In * interpolate(frame, [316, 338], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const pill3Dx = (1 - pill3In) * 40;
  const cap3In = seg(frame, 240, 262, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;
  const liOp = appear(258, 18) * lf;
  const liLit = interpolate(frame, [266, 288, 330, 350], [0, 0.7, 0.7, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const t3c = seg(frame, 268, 296);
  const t3cVis = frame >= 268 && frame < 320 ? 1 : 0;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={A_TO_TABLE} color={T.accent} width={2.5} progress={tA} opacity={0.8 * tAVis * lf} />
      <Connector pts={B_TO_TABLE} color={T.danger} width={2.5} progress={tB} opacity={0.8 * tBVis} />
      <Connector pts={TABLE_TO_LI} color={T.success} width={2.5} progress={t3c} opacity={0.8 * t3cVis * lf} />

      <SchemaNode {...REQ_A} state="accent" lit={reqLit} opacity={aOp} label="Request A" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>post article #482</div>
      </SchemaNode>
      <SchemaNode {...REQ_B} state="danger" lit={reqLit} opacity={bOp} label="Request B" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>same article, ~3s later</div>
      </SchemaNode>
      <Pill x={REQ_A.x + 10} y={REQ_A.y + REQ_A.h + 12} dx={pill1Dx} text="wasAlreadyPosted() missed 'pending'" color={T.danger} opacity={pill1Op} fontSize={17} />

      <SchemaNode {...TABLE} state="accent" lit={tableLit} opacity={tableOp} label="social_posts" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>UNIQUE(content_id, platform, language)</div>
      </SchemaNode>
      <Token pts={A_TO_TABLE} t={tA} opacity={tAVis * lf} />
      <Token pts={B_TO_TABLE} t={tB} color={T.danger} opacity={tBVis} />
      <Badge x={TABLE.x + TABLE.w - 20} y={TABLE.y - 12} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={TABLE.x + 20} y={TABLE.y - 46} dx={pill2Dx} text="Request A inserted 'pending' first" color={T.accent} opacity={pill2Op} fontSize={18} />
      <Pill x={TABLE.x - 10} y={TABLE.y + TABLE.h + 14} dx={pill3Dx} text="Request B: Postgres 23505 → abort" color={T.danger} opacity={pill3Op} fontSize={18} />

      <SchemaNode {...LINKEDIN} state="success" lit={liLit} opacity={liOp} label="LinkedIn API" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>pending → posted, only once</div>
      </SchemaNode>
      <Token pts={TABLE_TO_LI} t={t3c} color={T.success} opacity={t3cVis * lf} />

      <Caption x={90} y={648} w={1100} text="A 3-second gap between check and post let duplicates slip through" color={T.danger} opacity={cap1} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every attempt now inserts a pending row before posting" color={T.text} opacity={cap2} fontSize={24} weight={600} />
      <Caption x={90} y={648} w={1100} text="A UNIQUE constraint makes the database the tie-breaker" color={T.danger} opacity={cap3} fontSize={24} weight={600} />

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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero duplicate posts, across every platform</div>
      </div>
    </AbsoluteFill>
  );
};
