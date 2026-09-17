/**
 * FeatureTimeZoneTamer — feature p58 — 1280x720, 1002 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (2026-09-17), STEP 0c: beats and windows are unchanged from the
 * prior cut — only the picture changes. Archetype 5 "ledger" / mood "sand".
 * A narrow receipt-style ledger runs down the left edge for the whole clip —
 * New York and Oslo start wrong (red/amber), get struck through, are
 * rewritten in green, then grow a "total" line for the payoff. The right
 * side of the frame is a reused stage: drawn for the two conceptual beats
 * (the shared UTC anchor, the two bad local times), then the real product
 * for the three beats that have public evidence — the scheduler's own
 * commit, the hourly job's own commit, and the feature's own page.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–160   "I post one time for two cities. NY and Oslo don't wake up together."
 *  b2 169–361   "Ten AM UTC meant six AM in NY, noon in Oslo — someone always got the worst hour."
 *  b3 370–567   "Now a scheduler checks each city's own ten AM, like a mail carrier..." — LIVE: commit 60406c4
 *  b4 576–776   "An hourly job checks Supabase, then fires the post at ten AM, locally." — LIVE: commit dcd93e2
 *  b5 785–957   "...lifted first-hour clicks and shares by up to thirty percent." — LIVE: feature page, holds to 1002.
 *
 * Single tech name in the whole clip: Supabase (beat 4 chip only).
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, Easing, interpolate } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, CaptionBand, CheckBadge, StatPill, FilterChip, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/p58.json";

const P = MOODS.sand;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// ── Left ledger spine — persistent for the whole clip ───────────────────
const SPINE_X = 60;
const SPINE_Y = 46;
const SPINE_W = 300;
const SPINE_H = 580;
const PAD = 24;

// ── Right stage — reused for drawn beats (1,2) and live beats (3,4,5) ───
const STAGE_X = 390;
const STAGE_Y = 150;
const STAGE_W = 820;
const STAGE_H = 420;
const WIN_MAIN: Win = { x: STAGE_X, y: STAGE_Y, w: STAGE_W, h: STAGE_H };

// ── Single flip timeline: bad local times → each city's own 10 AM ──────
const FLIP_STRIKE_START = 372;
const FLIP_STRIKE_END = 384;
const FLIP_OLD_GONE = 394;
const FLIP_NEW_IN = 408;

const Dash: React.FC<{ y: number }> = ({ y }) => (
  <div
    style={{
      position: "absolute",
      left: SPINE_X + PAD,
      top: y,
      width: SPINE_W - PAD * 2,
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
        left: SPINE_X + PAD,
        top: y,
        width: SPINE_W - PAD * 2,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        opacity,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: P.ink, letterSpacing: 0.5 }}>{label}</span>
      <span style={{ position: "relative", fontSize: 24, fontWeight: 800, color: c, whiteSpace: "nowrap" }}>
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

  // ── Phase timeline — the ledger spine's rows (unchanged frame math) ──
  const phase0Op = b1;
  const phase1Op = seg(frame, 169, 185) * (1 - seg(frame, FLIP_STRIKE_END, FLIP_OLD_GONE));
  const rowStrike = seg(frame, FLIP_STRIKE_START, FLIP_STRIKE_END);
  const phase2Op = seg(frame, FLIP_OLD_GONE, FLIP_NEW_IN); // no fade-out — holds to the end

  const spinePop = pop(4);
  const mailIconOp = b3;

  // ── Beat 3 — mail-carrier pill slides up (non-crossfade transition) ──
  const slideUp3 = interpolate(frame, [370, 400], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Beat 4 — hourly-job wipe, inside the spine ───────────────────────
  const wipeH = interpolate(frame, [576, 604], [0, 118], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const wipeLine1 = Math.min(1, pop(590));
  const wipeLine2 = Math.min(1, pop(606));
  const chipPop = pop(600);

  // ── Beat 5 — the payoff total, inside the spine ──────────────────────
  const totalWipeH = interpolate(frame, [785, 813], [0, 100], {
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

        {/* ════ THE LEDGER — persistent left spine, alive for the whole clip ════ */}
        <div
          style={{
            position: "absolute",
            left: SPINE_X,
            top: SPINE_Y,
            width: SPINE_W,
            height: SPINE_H,
            borderRadius: 18,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: "0 16px 40px rgba(42,32,24,0.16)",
            opacity: Math.min(1, spinePop),
            transform: `scale(${0.94 + Math.min(1, spinePop) * 0.06})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ position: "absolute", left: PAD, top: 22, fontSize: 13, fontWeight: 700, letterSpacing: 1.6, color: P.muted }}>
            🧾 POST TIME LEDGER
          </div>
          <div style={{ position: "absolute", left: PAD, top: 44, width: SPINE_W - PAD * 2, fontSize: 16, fontWeight: 800, color: P.danger, opacity: 1 - phase2Op }}>
            ONE TIME FOR BOTH
          </div>
          <div style={{ position: "absolute", left: PAD, top: 44, width: SPINE_W - PAD * 2, fontSize: 16, fontWeight: 800, color: P.success, opacity: phase2Op }}>
            EACH CITY'S OWN 10 AM
          </div>
          <div style={{ position: "absolute", left: SPINE_X + SPINE_W - 46, top: -2, fontSize: 32, opacity: mailIconOp }}>📬</div>
        </div>
        <Dash y={SPINE_Y + 82} />

        <LedgerLine y={SPINE_Y + 100} label="NEW YORK 🗽" value="10:00 UTC" tone="muted" opacity={phase0Op} />
        <LedgerLine y={SPINE_Y + 100} label="NEW YORK 🗽" value="6:00 AM 😴" tone="danger" opacity={phase1Op} strike={rowStrike} />
        <LedgerLine y={SPINE_Y + 100} label="NEW YORK 🗽" value="10:00 AM ✓" tone="success" opacity={phase2Op} />

        <LedgerLine y={SPINE_Y + 156} label="OSLO 🏔" value="10:00 UTC" tone="muted" opacity={phase0Op} />
        <LedgerLine y={SPINE_Y + 156} label="OSLO 🏔" value="12:00 PM 🍽" tone="amber" opacity={phase1Op} strike={rowStrike} />
        <LedgerLine y={SPINE_Y + 156} label="OSLO 🏔" value="10:00 AM ✓" tone="success" opacity={phase2Op} />

        <Dash y={SPINE_Y + 210} />

        {/* ── Beat 4 — how it fires, wiped open inside the spine ── */}
        <div style={{ position: "absolute", left: SPINE_X + PAD, top: SPINE_Y + 228, width: SPINE_W - PAD * 2, height: wipeH, overflow: "hidden" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.4, color: P.muted, marginBottom: 8 }}>HOW IT FIRES</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, opacity: wipeLine1, fontSize: 13.5, fontWeight: 650, color: P.ink }}>
            <span>⏰</span>
            <span>Hourly job checks Supabase, every city</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 10, opacity: wipeLine2, fontSize: 13.5, fontWeight: 650, color: P.success }}>
            <span>🎯</span>
            <span>Fires the instant it's 10 AM, locally</span>
          </div>
        </div>

        {/* ── Beat 5 — the payoff total, wiped open inside the spine ── */}
        <div style={{ position: "absolute", left: SPINE_X + PAD, top: SPINE_Y + 420, width: SPINE_W - PAD * 2, height: totalWipeH, overflow: "hidden" }}>
          <div style={{ borderBottom: `1.5px dashed ${P.border}`, marginBottom: 12 }} />
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.4, color: P.muted }}>FIRST-HOUR LIFT</div>
          <div style={{ marginTop: 6, opacity: heroOp }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: P.success, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>+30%</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: SPINE_X + SPINE_W - 60, top: SPINE_Y + 434, opacity: Math.min(1, checkScale) }}>
          <CheckBadge x={0} y={0} size={34} scale={checkScale} opacity={Math.min(1, checkScale)} />
        </div>

        {/* ════ beat 1 : drawn — the shared UTC anchor ════ */}
        <div
          style={{
            position: "absolute",
            left: STAGE_X,
            top: STAGE_Y,
            width: STAGE_W,
            height: STAGE_H,
            borderRadius: 18,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: b1,
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 800, color: P.muted, letterSpacing: -3, fontVariantNumeric: "tabular-nums" }}>10:00 UTC</div>
          <div style={{ marginTop: 14, fontSize: 18, fontWeight: 650, color: P.muted }}>one post time, fired for both cities at once</div>
          <div style={{ marginTop: 26, display: "flex", gap: 40, fontSize: 22, fontWeight: 700, color: P.ink }}>
            <span>🗽 New York</span>
            <span>🏔 Oslo</span>
          </div>
        </div>

        {/* ════ beat 2 : drawn — the two bad local times ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE_Y, width: STAGE_W, height: STAGE_H, opacity: b2, display: "flex", gap: 30 }}>
          <div
            style={{
              flex: 1,
              borderRadius: 18,
              background: P.card,
              border: `2px solid ${P.dangerEdge}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>🗽 NEW YORK</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: P.danger, fontVariantNumeric: "tabular-nums" }}>6:00 AM</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: P.danger }}>😴 fast asleep</div>
          </div>
          <div
            style={{
              flex: 1,
              borderRadius: 18,
              background: P.card,
              border: `2px solid ${P.amber}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>🏔 OSLO</div>
            <div style={{ fontSize: 64, fontWeight: 800, color: P.amber, fontVariantNumeric: "tabular-nums" }}>12:00 PM</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: P.amber }}>🍽 on lunch</div>
          </div>
        </div>

        {/* ════ beat 3 : LIVE — the scheduler's own commit ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE_Y - 58, opacity: b3, transform: `translateY(${slideUp3}px)` }}>
          <StatPill x={0} y={0} emoji="📬" text="Checks each city's own 10 AM, like a mail carrier" tone="accent" opacity={b3} />
        </div>
        <LiveWindow
          file={shots}
          shot="scheduler"
          title="github.com/…/commit/60406c4"
          from={370}
          hold={213}
          zoom={(t) => 1 + 0.05 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b3}
          win={WIN_MAIN}
        />

        {/* ════ beat 4 : LIVE — the hourly job's own commit ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE_Y - 58, opacity: b4 }}>
          <StatPill x={0} y={0} emoji="⏰" text="An hourly job checks Supabase, every city" tone="accent" opacity={b4} />
        </div>
        <div style={{ position: "absolute", left: STAGE_X + STAGE_W - 150, top: STAGE_Y - 58 }}>
          <FilterChip x={0} y={0} text="Supabase" icon="🔍" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
        </div>
        <LiveWindow
          file={shots}
          shot="job"
          title="github.com/…/commit/dcd93e2"
          from={576}
          hold={216}
          zoom={(t) => 1 + 0.07 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b4}
          win={WIN_MAIN}
        />

        {/* ════ beat 5 : LIVE — the feature's own page ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE_Y - 58, opacity: b5 }}>
          <StatPill x={0} y={0} emoji="🎯" text="Fires the instant it's 10 AM, locally" tone="success" opacity={b5} />
        </div>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-p58"
          from={785}
          hold={217}
          zoom={(t) => 1 + 0.09 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
          win={WIN_MAIN}
        />

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
