/**
 * FeaturePaperModeSimulatesSlippageK02 — feature k02 — 1280x720, 802 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 5 "ledger", mood "dawn" (both handed down by the
 * orchestrating session). One receipt/invoice card is the ONE recurring
 * element for beats 1-4: line items for the cost of testing with real money
 * add up in red, then the same card is rewritten in green with the total
 * struck through the moment the story flips to paper mode — the strike/kill/
 * replace swap is a wipe, never a crossfade. Beat 5 scale-pushes the real
 * product window in, the second non-crossfade transition, and closes on the
 * real number the VO ends on.
 *
 * Beats 1-4 are the problem, the missing sandbox, the paper-mode analogy and
 * the invisible fill mechanics — all metaphor/plumbing, so they stay drawn
 * per STEP 0c. Beat 5 is the shipped result, so it plays a recording of the
 * real feature page (shots/k02.json, shot "page") the way
 * FeatureTraceabilityScannerLive (p61) closes on its own feature page.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-117  "How do you test a trading strategy before risking real money?"
 *  b2 126-252  "Pump-dot-fun has no test net, no safe practice ground at all."
 *  b3 261-399  "So my trading agent now runs a paper mode, a flight simulator
 *              for trades."
 *  b4 408-595  "It fills orders at real prices, charging the same three
 *              percent slippage and fees a live trade would."
 *  b5 604-757  "It ran for days on real prices before I trusted it with all
 *              eight trading agents." — holds to 802.
 *
 * Single tech name in the whole clip: DexScreener prices (beat 4 chip only).
 * The 3% slippage / 1.5% fee model and the "eight trading agents" figure are
 * the real values from trader.ts / the eight-agent desk — nothing here is an
 * invented metric. The pre-flip SOL loss line items are illustrative mockup
 * numbers for the "cost of testing live" ledger, not a claimed real result.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, FilterChip, CheckBadge, CaptionBand, Headline, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/k02.json";

const P = MOODS.dawn;

const B1_S = 15, B1_E = 117;
const B2_S = 126, B2_E = 252;
const B3_S = 261, B3_E = 399;
const B4_S = 408, B4_E = 595;
const B5_S = 604, B5_E = 757;
const END = 802;
const FADE = 9;

const CARD_X = 340;
const CARD_Y = 92;
const CARD_W = 600;
const CARD_H = 480;
const PAD = 28;

const WIN5: Win = { x: 230, y: 172, w: 820, h: 384 };

/** One receipt line: label, dotted leader, value — with an optional strike-through wipe. */
const LedgerRow: React.FC<{
  y: number;
  label: string;
  value: string;
  tone: "danger" | "success";
  opacity?: number;
  strike?: number;
}> = ({ y, label, value, tone, opacity = 1, strike = 0 }) => {
  if (opacity <= 0.004) return null;
  const c = tone === "danger" ? P.danger : P.success;
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X + PAD,
        top: y,
        width: CARD_W - PAD * 2,
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        opacity,
        fontFamily,
      }}
    >
      <span style={{ position: "relative", fontSize: 18, fontWeight: 650, color: P.ink, whiteSpace: "nowrap" }}>
        {label}
        {strike > 0.004 ? (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "54%",
              height: 2,
              width: `${Math.min(1, strike) * 100}%`,
              background: P.danger,
            }}
          />
        ) : null}
      </span>
      <span style={{ flex: 1, borderBottom: `2px dotted ${P.border}`, marginBottom: 5 }} />
      <span style={{ fontSize: 18, fontWeight: 800, color: c, whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
};

const Dash: React.FC<{ y: number; opacity?: number }> = ({ y, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: CARD_X + PAD,
      top: y,
      width: CARD_W - PAD * 2,
      borderBottom: `1.5px dashed ${P.border}`,
      opacity,
    }}
  />
);

const ROWS_OLD = [
  { label: "Untested strategy", value: "-0.4 SOL" },
  { label: "Guessed slippage", value: "-0.3 SOL" },
  { label: "No sandbox to test in", value: "-0.6 SOL" },
];
const ROWS_NEW = [
  { label: "Untested strategy", value: "$0 (paper)" },
  { label: "Guessed slippage", value: "$0 (paper)" },
  { label: "No sandbox to test in", value: "$0 (paper)" },
];
const ROW_Y = [CARD_Y + 84, CARD_Y + 120, CARD_Y + 156];

const FILL_ROWS = [
  { label: "Order price", value: "real market" },
  { label: "Slippage", value: "-3%" },
  { label: "Fee", value: "-1.5%" },
];
const FILL_ROW_Y = [CARD_Y + 424, CARD_Y + 460, CARD_Y + 496];

export const FeaturePaperModeSimulatesSlippageK02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ---- transient captions/headline per beat (fade in AND out) ----
  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  // ---- the ledger card: alive for beats 1-4, gone before beat 5 ----
  const cardOp = Math.min(1, pop(4)) * (1 - seg(frame, B4_E, B4_E + FADE));

  // beat 1: first two cost rows
  const row0In = seg(frame, B1_S + 15, B1_S + 27);
  const row1In = seg(frame, B1_S + 45, B1_S + 57);
  // beat 2: third cost row + total
  const row2In = seg(frame, B2_S + 20, B2_S + 32);
  const totalOldIn = seg(frame, B2_S + 46, B2_S + 62);

  // beat 3: the flip — strike each row, swap it, then swap the total and title
  const rowStrikeStart = (i: number) => B3_S + 10 + i * 14;
  const rowStrikeEnd = (i: number) => rowStrikeStart(i) + 10;
  const rowOldGone = (i: number) => rowStrikeEnd(i) + 8;
  const rowNewIn = (i: number) => rowOldGone(i) + 12;

  const TITLE_OLD_GONE = B3_S + 55; // 316
  const TITLE_NEW_IN = B3_S + 69; // 330
  const titleOldOp = 1 - seg(frame, TITLE_OLD_GONE, TITLE_OLD_GONE + 14);
  const titleNewOp = seg(frame, TITLE_OLD_GONE + 14, TITLE_NEW_IN + 16);

  const TOTAL_STRIKE_S = B3_S + 79; // 340
  const TOTAL_STRIKE_E = TOTAL_STRIKE_S + 12;
  const TOTAL_OLD_GONE = TOTAL_STRIKE_E + 8;
  const TOTAL_NEW_IN = TOTAL_OLD_GONE + 14;
  const totalStrike = seg(frame, TOTAL_STRIKE_S, TOTAL_STRIKE_E);
  const totalOldOp = totalOldIn * (1 - seg(frame, TOTAL_STRIKE_E, TOTAL_OLD_GONE));
  const totalNewOp = seg(frame, TOTAL_OLD_GONE, TOTAL_NEW_IN);

  // beat 4: the sample-fill extension + the one tech chip
  const wipeOp = seg(frame, B4_S + 5, B4_S + 21);
  const fillHeaderOp = seg(frame, B4_S + 16, B4_S + 30);
  const fillRowIn = (i: number) => seg(frame, B4_S + 32 + i * 16, B4_S + 32 + i * 16 + 14);
  const resultRowOp = seg(frame, B4_S + 96, B4_S + 112);
  const chipPop = pop(B4_S + 20);

  // ---- beat 5: scale-push the real product in (the other non-crossfade transition) ----
  const pushScale = interpolate(frame, [B5_S, B5_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const agentCountRaw = interpolate(frame, [B5_S + 20, B5_S + 140], [1, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const agentCount = Math.round(agentCountRaw);
  const statPop = pop(B5_S + 10);
  const checkPop = pop(B5_S + 130);
  const resultStripIn = seg(frame, B5_S + 60, B5_S + 76);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= per-beat headline ================= */}
        <Headline y={26} text="Real money on the line." opacity={b1} fontSize={30} />
        <Headline y={26} text="No sandbox to test in." opacity={b2} fontSize={30} />
        <Headline y={26} text="So it flies in a simulator instead." opacity={b3} fontSize={30} />
        <Headline y={26} text="The simulator charges real costs too." opacity={b4} fontSize={30} />

        {/* ================= the ledger (archetype 5) — beats 1-4 ================= */}
        <div
          style={{
            position: "absolute",
            left: CARD_X,
            top: CARD_Y,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 18,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: "0 16px 40px rgba(22,35,63,0.16)",
            opacity: cardOp,
            transform: `scale(${0.94 + cardOp * 0.06})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ position: "absolute", left: PAD, top: 22, fontSize: 14, fontWeight: 700, letterSpacing: 2, color: P.muted }}>
            🧾 COST OF TESTING LIVE
          </div>
          <div style={{ position: "absolute", left: PAD, top: 44, fontSize: 15, fontWeight: 800, letterSpacing: 1, opacity: titleOldOp, color: P.danger }}>
            — REAL MONEY AT RISK
          </div>
          <div style={{ position: "absolute", left: PAD, top: 44, fontSize: 15, fontWeight: 800, letterSpacing: 1, opacity: titleNewOp, color: P.success }}>
            — PAPER MODE
          </div>
        </div>
        <Dash y={CARD_Y + 66} opacity={cardOp} />

        {ROWS_OLD.map((r, i) => (
          <LedgerRow
            key={`old-${r.label}`}
            y={ROW_Y[i]}
            label={r.label}
            value={r.value}
            tone="danger"
            strike={seg(frame, rowStrikeStart(i), rowStrikeEnd(i))}
            opacity={
              (i === 0 ? row0In : i === 1 ? row1In : row2In) * (1 - seg(frame, rowStrikeEnd(i), rowOldGone(i)))
            }
          />
        ))}
        {ROWS_NEW.map((r, i) => (
          <LedgerRow key={`new-${r.label}`} y={ROW_Y[i]} label={r.label} value={r.value} tone="success" opacity={seg(frame, rowOldGone(i), rowNewIn(i))} />
        ))}

        <Dash y={CARD_Y + 196} opacity={cardOp} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 212, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted }}>
          TOTAL PER STRATEGY TESTED
        </div>
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 232, width: CARD_W - PAD * 2 }}>
          <span style={{ position: "relative", fontSize: 28, fontWeight: 800, color: P.danger, opacity: totalOldOp }}>
            -1.3 SOL
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                height: 3,
                width: `${Math.min(1, totalStrike) * 100}%`,
                background: P.danger,
              }}
            />
          </span>
          <span style={{ fontSize: 28, fontWeight: 800, color: P.success, opacity: totalNewOp, marginLeft: totalNewOp > 0.01 ? -280 : 0 }}>
            $0 real risk
          </span>
        </div>

        {/* beat 4: sample-fill extension of the same ledger */}
        <Dash y={CARD_Y + 286} opacity={cardOp * wipeOp} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 300, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: cardOp * fillHeaderOp }}>
          SAMPLE PAPER FILL
        </div>
        {FILL_ROWS.map((r, i) => (
          <LedgerRow key={r.label} y={FILL_ROW_Y[i]} label={r.label} value={r.value} tone="success" opacity={cardOp * fillRowIn(i)} />
        ))}
        <div
          style={{
            position: "absolute",
            left: CARD_X + PAD,
            top: CARD_Y + 534,
            width: CARD_W - PAD * 2,
            fontSize: 16,
            fontWeight: 700,
            color: P.accent,
            opacity: cardOp * resultRowOp,
          }}
        >
          → Paper balance updated, same as a live fill
        </div>
        <FilterChip
          x={CARD_X + CARD_W - 218}
          y={CARD_Y + 12}
          text="DexScreener prices"
          icon="📈"
          color={P.accent}
          scale={Math.min(1, chipPop)}
          opacity={cardOp * b4 * Math.min(1, chipPop)}
        />

        {/* per-beat caption band */}
        <CaptionBand text="Every practice trade risked real SOL" opacity={b1} tone="danger" />
        <CaptionBand text="Pump-dot-fun has no safe place to test at all" opacity={b2} tone="danger" />
        <CaptionBand text="A flight simulator for trades" opacity={b3} tone="accent" />
        <CaptionBand text="Same slippage, same fees, zero real risk" opacity={b4} tone="accent" />

        {/* ================= beat 5 : the real page, and the number ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN5.x + WIN5.w / 2}px ${WIN5.y + WIN5.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-k02"
            win={WIN5}
            from={B5_S}
            hold={END - B5_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b5}
          />
        </div>
        <Panel x={40} y={150} w={190} h={170} tone="success" opacity={b5 * Math.min(1, statPop)}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ fontSize: 30 }}>🤖</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{agentCount}</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", lineHeight: 1.3 }}>
              TRADING AGENTS
              <br />
              ON PAPER MODE
            </div>
          </div>
        </Panel>
        <CheckBadge x={WIN5.x + WIN5.w - 42} y={WIN5.y - 22} size={40} opacity={b5} scale={checkPop} />
        <div
          style={{
            position: "absolute",
            left: WIN5.x + 24,
            top: WIN5.y + WIN5.h - 70,
            padding: "12px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.96)",
            border: `1.5px solid ${P.successEdge}`,
            boxShadow: "0 14px 34px rgba(22,35,63,0.16)",
            opacity: b5 * resultStripIn,
            transform: `translateY(${(1 - resultStripIn) * 14}px)`,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          8 agents running on paper mode
        </div>
        <CaptionBand text="Live on vitalii.no now" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
