/**
 * FeatureCrossPlatformDistribution — feature p13 — 1280x720, 15s @ 30fps,
 * silent, loop-friendly. ART-DIRECTION REWORK (2026-08-30): archetype 5
 * "ledger", mood mint. The whole frame is one receipt/invoice column — the
 * old centered-headline + zone-panels + 3-icon-strip + 2-result-cards layout
 * is retired.
 *
 * Kept from the old story: problem → solution → how → number.
 *
 * Story (continuous ledger, 4 beats, ~110-150 frames each):
 *  1. (0-134)   Problem — 4 manual line items (encode/resize/compress/upload
 *     per platform) add up in red under a "BY HAND" total, 30-45 min.
 *  2. (128-264) Solution — the title flips to "AUTOMATIC" and each row is
 *     struck through in place, then replaced with its GitHub Actions
 *     workflow — a wipe/kill-and-show swap, never a crossfade — closing on a
 *     green 2-3 min total.
 *  3. (264-374) How — a capacity note wipes open under the total: the Bot
 *     API's 20MB ceiling vs MTKruto pulling up to 2GB straight from
 *     Telegram, plus the Telegram-embed fallback. One small tech caption.
 *  4. (374-450) Result — before/after minute chips, the derived ≈15× speed,
 *     check badge, footer.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, StatPill, CheckBadge, seg, loopFade, fontFamily } from "./bright-primitives";

const P = MOODS.mint;

const CARD_X = 380;
const CARD_Y = 42;
const CARD_W = 520;
const CARD_H = 462;
const PAD = 30;

const ROWS_OLD = [
  { label: "YouTube — encode 16:9, upload", value: "10 min" },
  { label: "Instagram Reels — resize 9:16, upload", value: "10 min" },
  { label: "LinkedIn — compress under 200MB", value: "8 min" },
  { label: "Facebook — re-export, upload", value: "8 min" },
];
const ROWS_NEW = [
  { label: "process-video.yml runs", value: "done" },
  { label: "instagram-video.yml runs", value: "done" },
  { label: "linkedin-video.yml runs", value: "done" },
  { label: "facebook-video.yml runs", value: "done" },
];
const ROW_Y = [114, 152, 190, 228];

/** One receipt line: label, dotted leader, value — with an optional strike-through wipe. */
const LedgerRow: React.FC<{
  y: number;
  label: string;
  value: string;
  tone: "danger" | "success";
  opacity?: number;
  strike?: number;
  fontSize?: number;
}> = ({ y, label, value, tone, opacity = 1, strike = 0, fontSize = 17 }) => {
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
      <span style={{ position: "relative", fontSize, fontWeight: 600, color: P.ink, whiteSpace: "nowrap" }}>
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
      <span style={{ fontSize, fontWeight: 800, color: c, whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
};

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

export const FeatureCrossPlatformDistribution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const cardPop = pop(4);

  // ── Title swap: "BY HAND" → "AUTOMATIC" ───────────────────────────
  const titleOldOp = 1 - seg(frame, 116, 130);
  const titleNewOp = seg(frame, 130, 146);

  // ── Beat 1 caption ─────────────────────────────────────────────────
  const cap1Op = seg(frame, 34, 50) * (1 - seg(frame, 116, 132));

  // ── Row swap (strike old → gone → new), staggered per row ─────────
  const rowStrikeStart = (i: number) => 134 + i * 12;
  const rowStrikeEnd = (i: number) => rowStrikeStart(i) + 10;
  const rowOldGone = (i: number) => rowStrikeEnd(i) + 8;
  const rowNewIn = (i: number) => rowOldGone(i) + 12;

  // ── Total swap ──────────────────────────────────────────────────────
  const TOTAL_STRIKE_START = 204;
  const TOTAL_STRIKE_END = 214;
  const TOTAL_OLD_GONE = 222;
  const TOTAL_NEW_IN = 234;
  const totalStrike = seg(frame, TOTAL_STRIKE_START, TOTAL_STRIKE_END);
  const totalOldOp = 1 - seg(frame, TOTAL_STRIKE_END, TOTAL_OLD_GONE);
  const totalNewOp = seg(frame, TOTAL_OLD_GONE, TOTAL_NEW_IN);

  // ── Beat 2 caption ─────────────────────────────────────────────────
  const cap2Op = seg(frame, 240, 256) * (1 - seg(frame, 276, 292));

  // ── Beat 3: capacity note wipes open ───────────────────────────────
  const WIPE_START = 292;
  const WIPE_END = 320;
  const wipeH = interpolate(frame, [WIPE_START, WIPE_END], [0, 128], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rowAOp = Math.min(1, pop(300));
  const rowBOp = Math.min(1, pop(314));
  const fallbackOp = seg(frame, 324, 338);
  const techCapOp = seg(frame, 338, 352) * (1 - seg(frame, 364, 378));

  // ── Beat 4: result ──────────────────────────────────────────────────
  const chipOp = seg(frame, 374, 390, Easing.out(Easing.cubic));
  const ratio = Math.round(
    interpolate(frame, [386, 408], [1, 15], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );
  const heroOp = seg(frame, 386, 402);
  const checkScale = pop(398);
  const footerOp = seg(frame, 404, 420);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily, opacity: lf }}>
        <LightBg />

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
            boxShadow: "0 16px 40px rgba(16,40,29,0.16)",
            opacity: Math.min(1, cardPop),
            transform: `scale(${0.94 + Math.min(1, cardPop) * 0.06})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ position: "absolute", left: PAD, top: 24, fontSize: 15, fontWeight: 700, letterSpacing: 2, color: P.muted }}>
            🧾 VIDEO DISTRIBUTION
          </div>
          <div style={{ position: "absolute", left: PAD, top: 44, fontSize: 15, fontWeight: 800, letterSpacing: 1, opacity: titleOldOp, color: P.danger }}>
            — BY HAND
          </div>
          <div style={{ position: "absolute", left: PAD, top: 44, fontSize: 15, fontWeight: 800, letterSpacing: 1, opacity: titleNewOp, color: P.success }}>
            — AUTOMATIC
          </div>
        </div>
        <Dash y={CARD_Y + 58} />

        {ROWS_OLD.map((r, i) => (
          <LedgerRow
            key={r.label}
            y={ROW_Y[i]}
            label={r.label}
            value={r.value}
            tone="danger"
            strike={seg(frame, rowStrikeStart(i), rowStrikeEnd(i))}
            opacity={1 - seg(frame, rowStrikeEnd(i), rowOldGone(i))}
          />
        ))}
        {ROWS_NEW.map((r, i) => (
          <LedgerRow key={r.label} y={ROW_Y[i]} label={r.label} value={r.value} tone="success" opacity={seg(frame, rowOldGone(i), rowNewIn(i))} />
        ))}

        <Dash y={CARD_Y + 228} />

        {/* Total */}
        <div style={{ position: "absolute", left: CARD_X + PAD, top: 284, fontSize: 14, fontWeight: 700, letterSpacing: 2, color: P.muted }}>
          TOTAL PER VIDEO
        </div>
        <div style={{ position: "absolute", left: CARD_X + PAD, top: 305, width: CARD_W - PAD * 2 }}>
          <span
            style={{
              position: "relative",
              fontSize: 30,
              fontWeight: 800,
              color: P.danger,
              opacity: totalOldOp,
              fontFamily,
            }}
          >
            30–45 MIN
            {totalStrike > 0.004 ? (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  height: 3,
                  width: `${Math.min(1, totalStrike) * 100}%`,
                  background: P.ink,
                }}
              />
            ) : null}
          </span>
          <span style={{ position: "absolute", left: 0, top: 0, fontSize: 30, fontWeight: 800, color: P.success, opacity: totalNewOp, fontFamily }}>
            2–3 MIN
          </span>
        </div>

        <Dash y={336} />

        {/* Beat 1 / Beat 2 captions */}
        <div style={{ position: "absolute", left: 90, top: 520, width: 1100, textAlign: "center", fontSize: 20, fontWeight: 650, color: P.danger, opacity: cap1Op, fontFamily }}>
          Every platform means its own format, size limit and upload flow
        </div>
        <div style={{ position: "absolute", left: 90, top: 520, width: 1100, textAlign: "center", fontSize: 20, fontWeight: 650, color: P.accent, opacity: cap2Op, fontFamily }}>
          One trigger — GitHub Actions ships the right format to each API
        </div>

        {/* ════ Beat 3 — capacity note, wiped open ════ */}
        <div style={{ position: "absolute", left: CARD_X + PAD, top: 350, width: CARD_W - PAD * 2, height: wipeH, overflow: "hidden" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, marginBottom: 8 }}>BIG FILES</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: rowAOp, fontSize: 15, fontWeight: 650, color: P.danger }}>
            <span>🚫</span>
            <span style={{ flex: 1 }}>Bot API caps uploads at</span>
            <span style={{ fontWeight: 800 }}>20 MB</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: rowBOp, marginTop: 8, fontSize: 15, fontWeight: 650, color: P.success }}>
            <span>✅</span>
            <span style={{ flex: 1 }}>MTKruto pulls from Telegram</span>
            <span style={{ fontWeight: 800 }}>up to 2GB</span>
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, opacity: fallbackOp, fontSize: 13.5, fontWeight: 600, color: P.muted }}>
            <span>🛟</span>
            <span>Falls back to a Telegram embed if any upload fails</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 90, top: 520, width: 1100, textAlign: "center", fontSize: 16, fontWeight: 600, color: P.muted, opacity: techCapOp, fontFamily }}>
          via MTKruto, a full MTProto client
        </div>

        {/* ════ Beat 4 — the payoff ════ */}
        <StatPill x={310} y={576} emoji="⏱" text="30–45 min by hand" tone="danger" fontSize={17} opacity={chipOp} />
        <div style={{ position: "absolute", left: 634, top: 584, fontSize: 26, color: P.muted, fontWeight: 700, opacity: chipOp, fontFamily }}>→</div>
        <StatPill x={690} y={576} emoji="✅" text="2–3 min automatic" tone="success" fontSize={17} opacity={chipOp} />
        <div style={{ position: "absolute", left: 0, top: 626, width: 1280, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, opacity: heroOp, fontFamily }}>
          <div style={{ position: "relative", width: 44, height: 44 }}>
            <CheckBadge x={0} y={0} size={44} scale={checkScale} opacity={Math.min(1, checkScale)} />
          </div>
          <span style={{ fontSize: 44, fontWeight: 800, color: P.success }}>≈{ratio}× faster</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 692, width: 1280, textAlign: "center", fontSize: 14, fontWeight: 600, color: P.accent, opacity: footerOp, fontFamily }}>
          Remotion renders both formats · GitHub Actions ships them · vitalii.no
        </div>
      </div>
    </PaletteProvider>
  );
};
