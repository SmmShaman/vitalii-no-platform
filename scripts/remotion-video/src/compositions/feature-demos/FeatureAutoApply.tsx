/**
 * FeatureAutoApply — feature j06 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: Webcruiter's 5-step form, Easycruit's forced registration, and
 * Teamtailor's hidden tabs each cost 10-15 manual minutes → one Telegram
 * "Send" tap wakes auto_apply.py (a polling systemd daemon) which hands the
 * job to Skyvern's Docker browser automation → two workers race for the same
 * row, claim_applications() RPC locks it so only one wins → "15 min → 3 min,
 * zero involvement after the click".
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const PLAT = [
  { x: 80, y: 44, w: 250, h: 92, label: "Webcruiter", sub: "5-step form, drag-drop CV" },
  { x: 515, y: 44, w: 250, h: 92, label: "Easycruit", sub: "forced registration first" },
  { x: 950, y: 44, w: 250, h: 92, label: "Teamtailor", sub: "fields hidden behind tabs" },
];

const SEND = { x: 80, y: 250, w: 210, h: 82 };
const WORKER = { x: 390, y: 250, w: 300, h: 92 };
const SKY = { x: 800, y: 250, w: 240, h: 92 };

const SEND_R: Pt = { x: SEND.x + SEND.w, y: SEND.y + SEND.h / 2 };
const WORKER_L: Pt = { x: WORKER.x, y: WORKER.y + WORKER.h / 2 };
const WORKER_R: Pt = { x: WORKER.x + WORKER.w, y: WORKER.y + WORKER.h / 2 };
const SKY_L: Pt = { x: SKY.x, y: SKY.y + SKY.h / 2 };
const SKY_TOP: Pt = { x: SKY.x + SKY.w / 2, y: SKY.y };
const PLAT0_BOTTOM: Pt = { x: PLAT[0].x + PLAT[0].w / 2, y: PLAT[0].y + PLAT[0].h };

const P_SW: Pt[] = [SEND_R, WORKER_L];
const P_WS: Pt[] = [WORKER_R, SKY_L];
const P_SP: Pt[] = [SKY_TOP, { x: SKY_TOP.x, y: 140 }, PLAT0_BOTTOM];

export const FeatureAutoApply: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): 3 unique, painful platforms ──
  const platOp = PLAT.map((_, i) => appear(8 + i * 14) * lf);
  const platLit = PLAT.map(() => 0.22 * lf);
  const cap1In = seg(frame, 46, 68, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;
  const timePillIn = seg(frame, 54, 76, Easing.out(Easing.cubic));
  const timePillOp = timePillIn * interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 2 (126–236): Send tap → daemon → Skyvern → platform ──
  const sendOp = appear(128, 16) * lf;
  const tSw = seg(frame, 138, 160);
  const tSwVis = frame >= 138 && frame < 196 ? 1 : 0;
  const workerOp = appear(140, 18) * lf;
  const workerLit = interpolate(frame, [148, 170, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tWs = seg(frame, 172, 196);
  const tWsVis = frame >= 172 && frame < 224 ? 1 : 0;
  const skyOp = appear(174, 18) * lf;
  const skyLit = interpolate(frame, [182, 204, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tSp = seg(frame, 200, 226);
  const tSpVis = frame >= 200 && frame < 260 ? 1 : 0;
  const plat0HiLit = interpolate(frame, [206, 228, 330, 350], [0.22, 0.85, 0.85, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 178, 200, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [234, 254], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const pollPillIn = seg(frame, 148, 170, Easing.out(Easing.cubic));
  const pollPillOp = pollPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): claim_applications() RPC row-lock ──
  const wAScale = pop(248) * lf;
  const wBScale = pop(258) * lf;
  const lockScale = pop(268) * interpolate(frame, [312, 330], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const crossScale = pop(276) * interpolate(frame, [312, 330], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const lockPillIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const lockPillOp = lockPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
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

      <Connector pts={P_SW} color={T.accent} width={2.5} progress={tSw} opacity={0.8 * tSwVis * lf} />
      <Connector pts={P_WS} color={T.accent} width={2.5} progress={tWs} opacity={0.8 * tWsVis * lf} />
      <Connector pts={P_SP} color={T.accent} width={2.5} progress={tSp} opacity={0.8 * tSpVis * lf} />

      {PLAT.map((p, i) => (
        <SchemaNode
          key={p.label}
          x={p.x}
          y={p.y}
          w={p.w}
          h={p.h}
          state="danger"
          lit={i === 0 ? Math.max(platLit[i], plat0HiLit) : platLit[i]}
          opacity={platOp[i]}
          label={p.label}
          fontSize={22}
        >
          <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>{p.sub}</div>
        </SchemaNode>
      ))}
      <Pill x={PLAT[1].x + 30} y={PLAT[1].y + PLAT[1].h + 14} text="10–15 min per application" color={T.danger} opacity={timePillOp} fontSize={19} />

      <SchemaNode {...SEND} state="accent" lit={0.4 * Math.min(1, sendOp) * lf} opacity={sendOp} label="Send tap" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>Telegram / Dashboard</div>
      </SchemaNode>
      <SchemaNode {...WORKER} state="accent" lit={workerLit} opacity={workerOp} label="auto_apply.py" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>systemd daemon · polls / 10s</div>
      </SchemaNode>
      <SchemaNode {...SKY} state="accent" lit={skyLit} opacity={skyOp} label="Skyvern" fontSize={21}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Docker · browser automation</div>
      </SchemaNode>
      <Token pts={P_SW} t={tSw} opacity={tSwVis * lf} />
      <Token pts={P_WS} t={tWs} opacity={tWsVis * lf} />
      <Token pts={P_SP} t={tSp} opacity={tSpVis * lf} />
      <Pill x={WORKER.x + 40} y={WORKER.y - 46} dx={0} text="claim_applications() RPC" color={T.amber} opacity={pollPillOp} fontSize={18} />

      {/* Beat 3: two workers race, one locks the row */}
      <div style={{ position: "absolute", left: WORKER.x + 20, top: WORKER.y + WORKER.h + 44, opacity: wAScale, transform: `scale(${wAScale})`, fontFamily }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.success }}>worker A → locked row</div>
      </div>
      <div style={{ position: "absolute", left: WORKER.x + 20, top: WORKER.y + WORKER.h + 76, opacity: wBScale, transform: `scale(${wBScale})`, fontFamily }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.danger }}>worker B → skips, already claimed</div>
      </div>
      <Badge x={WORKER.x - 4} y={WORKER.y + WORKER.h + 38} kind="check" scale={lockScale} opacity={lockScale} size={26} />
      <Badge x={WORKER.x - 4} y={WORKER.y + WORKER.h + 70} kind="cross" scale={crossScale} opacity={crossScale} size={26} />
      <Pill x={SKY.x + 10} y={SKY.y - 46} dx={0} text="one worker wins, zero duplicate sends" color={T.amber} opacity={lockPillOp} fontSize={17} />

      <Caption x={90} y={648} w={1100} text="Each platform is a unique beast — 10-15 minutes, every time" color={T.danger} opacity={cap1} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Polls Supabase every 10s, hands the job to Skyvern's browser automation" color={T.text} opacity={cap2} fontSize={23} weight={600} />
      <Caption x={90} y={648} w={1100} text="Row-level lock — safe under multiple concurrent workers" color={T.amber} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>15 minutes manual → 3 minutes average, 10+ platforms</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>Zero user involvement after the click</div>
      </div>
    </AbsoluteFill>
  );
};
