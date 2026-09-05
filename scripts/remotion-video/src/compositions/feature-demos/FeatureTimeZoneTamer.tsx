/**
 * FeatureTimeZoneTamer — feature p58 — 1280x720, 1002 frames @ 30fps, VOICE-SYNCED.
 *
 * ART-DIRECTION REWRITE (2026-09-05). Archetype 5 "ledger" / mood "sand". A
 * central receipt-style card runs New York and Oslo as two ledger lines that
 * start wrong (in red/amber) and get struck through and rewritten in green
 * once the fix lands — flanked by two big city-time cards that live-update
 * on either side, so the two-city story fills the whole frame rather than
 * hiding in one column.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–160   "I post one time for two cities. NY and Oslo don't wake up together."
 *  b2 169–361   "Ten AM UTC meant six AM in NY, noon in Oslo — someone always got the worst hour."
 *  b3 370–567   "Now a scheduler checks each city's own ten AM, like a mail carrier..."
 *  b4 576–776   "An hourly job checks Supabase, then fires the post at ten AM, locally."
 *  b5 785–957   "...lifted first-hour clicks and shares by up to thirty percent." — holds to 1002.
 *
 * Single tech name in the whole clip: Supabase (beat 4 only).
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, Easing, interpolate } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, CaptionBand, CheckBadge, seg, fontFamily } from "./bright-primitives";

const P = MOODS.sand;

const CARD_X = 340;
const CARD_Y = 46;
const CARD_W = 600;
const CARD_H = 580;
const PAD = 34;

// ── Single flip timeline: bad local times → each city's own 10 AM ──────
const FLIP_STRIKE_START = 372;
const FLIP_STRIKE_END = 384;
const FLIP_OLD_GONE = 394;
const FLIP_NEW_IN = 408;

const Dash: React.FC<{ y: number }> = ({ y }) => (
  <div
    style={{
      position: "absolute",
      left: CARD_X + PAD,
      top: y,
      width: CARD_W - PAD * 2,
      borderBottom: `1.5px dashed ${P.border}`,
    }}
  />
);

const LedgerLine: React.FC<{
  y: number;
  label: string;
  value: string;
  tone: "muted" | "danger" | "amber" | "success";
  opacity: number;
  strike?: number;
}> = ({ y, label, value, tone, opacity, strike = 0 }) => {
  if (opacity <= 0.004) return null;
  const c = tone === "danger" ? P.danger : tone === "amber" ? P.amber : tone === "success" ? P.success : P.muted;
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
      <span style={{ fontSize: 18, fontWeight: 700, color: P.ink, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ flex: 1, borderBottom: `2px dotted ${P.border}`, marginBottom: 5 }} />
      <span style={{ position: "relative", fontSize: 22, fontWeight: 800, color: c, whiteSpace: "nowrap" }}>
        {value}
        {strike > 0.004 ? (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              height: 2.5,
              width: `${Math.min(1, strike) * 100}%`,
              background: P.ink,
            }}
          />
        ) : null}
      </span>
    </div>
  );
};

const CityCard: React.FC<{
  x: number;
  emoji: string;
  city: string;
  time0: string;
  time1: string;
  time1Tag: string;
  time1Tone: "danger" | "amber";
  time2Sub: string;
  op0: number;
  op1: number;
  op2: number;
}> = ({ x, emoji, city, time0, time1, time1Tag, time1Tone, time2Sub, op0, op1, op2 }) => {
  const tone1 = time1Tone === "danger" ? P.danger : P.amber;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 210,
        width: 230,
        height: 300,
        borderRadius: 22,
        background: P.card,
        border: `2px solid ${op2 > 0.5 ? P.successEdge : op1 > 0.5 ? tone1 : P.border}`,
        boxShadow: "0 14px 34px rgba(42,32,24,0.14)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 22,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, letterSpacing: 0.5 }}>
        {emoji} {city}
      </div>

      {/* phase 0 — shared UTC anchor */}
      {op0 > 0.004 ? (
        <div style={{ position: "absolute", top: 108, width: 230, textAlign: "center", opacity: op0 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: P.muted, fontVariantNumeric: "tabular-nums" }}>{time0}</div>
          <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 650, color: P.muted }}>same moment, everywhere</div>
        </div>
      ) : null}

      {/* phase 1 — bad local time */}
      {op1 > 0.004 ? (
        <div
          style={{
            position: "absolute",
            top: 108,
            width: 230,
            textAlign: "center",
            opacity: op1,
            transform: `translateY(${(1 - op1) * 16}px)`,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 800, color: tone1, fontVariantNumeric: "tabular-nums" }}>{time1}</div>
          <div style={{ marginTop: 10, fontSize: 15, fontWeight: 700, color: tone1 }}>{time1Tag}</div>
        </div>
      ) : null}

      {/* phase 2 — fixed, each city's own 10 AM */}
      {op2 > 0.004 ? (
        <div style={{ position: "absolute", top: 100, width: 230, textAlign: "center", opacity: op2 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums" }}>10:00 AM</div>
          <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: P.success }}>✓ perfect timing</div>
          <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 650, color: P.muted }}>{time2Sub}</div>
        </div>
      ) : null}
    </div>
  );
};

export const FeatureTimeZoneTamer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (voice-synced; fade-in 16f, fade-out 16f, b5 holds) ──
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 160, 176));
  const b2 = seg(frame, 169, 185) * (1 - seg(frame, 361, 377));
  const b3 = seg(frame, 370, 386) * (1 - seg(frame, 567, 583));
  const b4 = seg(frame, 576, 592) * (1 - seg(frame, 776, 792));
  const b5 = seg(frame, 785, 801); // holds full opacity through frame 1002 — no fade-out

  // ── Phase timeline shared by ledger rows + both city cards ──────────
  const phase0Op = b1;
  const phase1Op = seg(frame, 169, 185) * (1 - seg(frame, FLIP_STRIKE_END, FLIP_OLD_GONE));
  const rowStrike = seg(frame, FLIP_STRIKE_START, FLIP_STRIKE_END);
  const phase2Op = seg(frame, FLIP_OLD_GONE, FLIP_NEW_IN); // no fade-out — holds to the end

  const cardPop = pop(4);
  const mailIconOp = b3;

  // ── Beat 4 — hourly check wipes open (non-crossfade transition) ─────
  const wipeH = interpolate(frame, [576, 604], [0, 118], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const wipeLine1 = Math.min(1, pop(590));
  const wipeLine2 = Math.min(1, pop(606));

  // ── Beat 5 — the payoff ──────────────────────────────────────────────
  const totalWipeH = interpolate(frame, [785, 813], [0, 132], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const heroOp = seg(frame, 800, 818);
  const checkScale = pop(824);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Flanking city cards — alive for the whole clip ════ */}
        <CityCard
          x={60}
          emoji="🗽"
          city="NEW YORK"
          time0="10:00"
          time1="6:00 AM"
          time1Tag="😴 fast asleep"
          time1Tone="danger"
          time2Sub="fires at 14:00 UTC"
          op0={phase0Op}
          op1={phase1Op}
          op2={phase2Op}
        />
        <CityCard
          x={990}
          emoji="🏔"
          city="OSLO"
          time0="10:00"
          time1="12:00 PM"
          time1Tag="🍽 on lunch"
          time1Tone="amber"
          time2Sub="fires at 08:00 UTC"
          op0={phase0Op}
          op1={phase1Op}
          op2={phase2Op}
        />

        {/* ════ THE LEDGER — alive for the whole clip ════ */}
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
            boxShadow: "0 16px 40px rgba(42,32,24,0.16)",
            opacity: Math.min(1, cardPop),
            transform: `scale(${0.94 + Math.min(1, cardPop) * 0.06})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ position: "absolute", left: PAD, top: 24, fontSize: 14, fontWeight: 700, letterSpacing: 2, color: P.muted }}>
            🧾 POST TIME LEDGER
          </div>
          <div style={{ position: "absolute", left: PAD, top: 46, fontSize: 22, fontWeight: 800, color: P.danger, opacity: 1 - phase2Op }}>
            ONE POST TIME FOR BOTH
          </div>
          <div style={{ position: "absolute", left: PAD, top: 46, fontSize: 22, fontWeight: 800, color: P.success, opacity: phase2Op }}>
            EACH CITY'S OWN 10 AM
          </div>
          <div style={{ position: "absolute", left: CARD_X + CARD_W - PAD - 40, top: -4, fontSize: 38, opacity: mailIconOp }}>📬</div>
        </div>
        <Dash y={CARD_Y + 90} />

        <LedgerLine y={CARD_Y + 116} label="NEW YORK 🗽" value="10:00 UTC" tone="muted" opacity={phase0Op} />
        <LedgerLine y={CARD_Y + 116} label="NEW YORK 🗽" value="6:00 AM" tone="danger" opacity={phase1Op} strike={rowStrike} />
        <LedgerLine y={CARD_Y + 116} label="NEW YORK 🗽" value="10:00 AM ✓" tone="success" opacity={phase2Op} />

        <LedgerLine y={CARD_Y + 160} label="OSLO 🏔" value="10:00 UTC" tone="muted" opacity={phase0Op} />
        <LedgerLine y={CARD_Y + 160} label="OSLO 🏔" value="12:00 PM" tone="amber" opacity={phase1Op} strike={rowStrike} />
        <LedgerLine y={CARD_Y + 160} label="OSLO 🏔" value="10:00 AM ✓" tone="success" opacity={phase2Op} />

        <Dash y={CARD_Y + 200} />

        {/* ════ Beat 4 — hourly job, wiped open ════ */}
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 224, width: CARD_W - PAD * 2, height: wipeH, overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.6, color: P.muted, marginBottom: 10 }}>HOW IT FIRES</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: wipeLine1, fontSize: 16, fontWeight: 650, color: P.ink }}>
            <span>⏰</span>
            <span>Hourly job checks Supabase, every city, every hour</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, opacity: wipeLine2, fontSize: 16, fontWeight: 650, color: P.success }}>
            <span>🎯</span>
            <span>Fires the post the instant it's 10 AM, locally</span>
          </div>
        </div>

        {/* ════ Beat 5 — the payoff ════ */}
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 356, width: CARD_W - PAD * 2, height: totalWipeH, overflow: "hidden" }}>
          <div style={{ borderBottom: `1.5px dashed ${P.border}`, marginBottom: 14 }} />
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.6, color: P.muted }}>FIRST-HOUR CLICKS + SHARES</div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 14, opacity: heroOp }}>
            <span style={{ fontSize: 56, fontWeight: 800, color: P.success, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>
              +30%
            </span>
            <span style={{ fontSize: 15, fontWeight: 650, color: P.muted }}>up to, right on schedule</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: CARD_X + CARD_W - 76, top: CARD_Y + 356, opacity: Math.min(1, checkScale) }}>
          <CheckBadge x={0} y={0} size={40} scale={checkScale} opacity={Math.min(1, checkScale)} />
        </div>

        {/* ════ Captions ════ */}
        <CaptionBand text="One UTC post time — two cities, two different mornings" tone="accent" opacity={b1} />
        <CaptionBand text="6 AM in New York, noon in Oslo — someone always got the worst hour" tone="danger" opacity={b2} />
        <CaptionBand text="Now every city is checked against its own ten AM" tone="success" opacity={b3} />
        <CaptionBand text="An hourly job, backed by Supabase, fires right on time" tone="accent" opacity={b4} />
        <CaptionBand text="Up to 30% more first-hour clicks and shares" tone="success" opacity={b5} />
      </div>
    </PaletteProvider>
  );
};
