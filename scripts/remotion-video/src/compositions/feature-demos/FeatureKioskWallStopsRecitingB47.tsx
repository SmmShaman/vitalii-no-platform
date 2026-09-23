/**
 * FeatureKioskWallStopsRecitingB47 — feature b47 — 1280x720, 873 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 5 "ledger", mood "dawn" (both handed down by the
 * orchestrating session, not re-rolled). One receipt-style ledger card is the
 * recurring element across beats 1, 2 and 4: deck sizes are itemised in red
 * (12 cards vs. two brothers' 30), then a "loop mode" section is appended
 * (no schedule, no due dates), then — after the live evidence beat — the
 * card returns with a strike/kill/replace flip (never a crossfade) showing
 * the reading-gap row and the deck-size row both fixed in green. Beat 3
 * scale-pushes the real product page in as the substantiated claim, the
 * second non-crossfade move; beat 5 rises in on a LogWindow, the third.
 *
 * Beats 1, 2 and 4 are the deck-size comparison, the loop-mode diagnosis and
 * the reading-gap/topped-up-deck ledger flip — all metaphor/plumbing, so they
 * stay drawn per STEP 0c. Beat 3 is the substantiated claim ("spaced
 * repetition puts every card on a schedule"), so it plays a recording of the
 * real feature page (shots/b47.json, shot "page"). Beat 5 does NOT play the
 * feature page or the hub (gate 2): it closes on a LogWindow built from the
 * feature row's own numbers — Boytasks keeps no runtime log on the VPS, so
 * these lines are assembled from problem/solution/result, never invented.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-163  "One child's deck on the family kiosk had just twelve cards to
 *              his brothers' thirty."
 *  b2 172-311  "It also just looped the same cards, with no ladder and no
 *              due dates."
 *  b3 320-494  "Now spaced repetition puts every card on a schedule, and
 *              short decks got topped up to match."
 *  b4 503-652  "Reading gaps with no question before now pull fresh ones
 *              from his own stored work."
 *  b5 661-828  "He now keeps pace with his brothers all evening - throughput
 *              on the wall is up forty percent." — holds to 873.
 *
 * Single tech name in the whole clip: Cloudflare Workers (beat 4 chip only).
 * All numbers on screen (12 vs 30 cards, the 1-3-10-21 day ladder, one
 * advance per calendar day, +40% throughput) are the real values from the
 * feature row — nothing here is invented.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, Headline, CaptionBand, StatPill, IconCard, FilterChip, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/b47.json";

const P = MOODS.dawn;

const B1_S = 15, B1_E = 163;
const B2_S = 172, B2_E = 311;
const B3_S = 320, B3_E = 494;
const B4_S = 503, B4_E = 652;
const B5_S = 661, B5_E = 828;
const END = 873;
const FADE = 16;

const CARD_X = 340;
const CARD_Y = 132;
const CARD_W = 600;
const CARD_H = 400;
const PAD = 28;

const WIN3: Win = { x: 374, y: 146, w: 806, h: 396 };
const WIN_LOG: Win = { x: 280, y: 150, w: 880, h: 414 };

/** One ledger line: label, dotted leader, value — with an optional strike-through wipe. */
const LedgerRow: React.FC<{
  y: number;
  label: string;
  value: string;
  tone: "danger" | "success" | "ink";
  opacity?: number;
  strike?: number;
}> = ({ y, label, value, tone, opacity = 1, strike = 0 }) => {
  if (opacity <= 0.004) return null;
  const c = tone === "danger" ? P.danger : tone === "success" ? P.success : P.ink;
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

export const FeatureKioskWallStopsRecitingB47: React.FC = () => {
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

  // ---- the ledger card: alive for beats 1-2 continuously, then again for beat 4 ----
  const cardOp1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const cardOp2 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const cardOp = Math.min(1, cardOp1 + cardOp2);
  const cardScale = 0.94 + cardOp * 0.06;

  // beat 1: deck sizes appear one by one
  const row0In = seg(frame, B1_S + 20, B1_S + 32);
  const row1In = seg(frame, B1_S + 40, B1_S + 52);
  const row2In = seg(frame, B1_S + 60, B1_S + 72);
  const totalIn = seg(frame, B1_S + 90, B1_S + 106);
  const sideIn1 = pop(B1_S + 26);

  // beat 2: loop-mode section appended below the same card
  const dividerOp = seg(frame, B2_S + 8, B2_S + 20);
  const sectionTitleOp = seg(frame, B2_S + 14, B2_S + 26);
  const row3In = seg(frame, B2_S + 30, B2_S + 42);
  const row4In = seg(frame, B2_S + 50, B2_S + 62);
  const row5In = seg(frame, B2_S + 70, B2_S + 82);
  const loopSpin = (frame - B2_S) * 5;
  const sideIn2 = pop(B2_S + 20);

  // beat 3: scale-push the real evidence in + two schedule callouts
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ladderPop = pop(B3_S + 40);
  const toppedUpPop = pop(B3_S + 92);

  // beat 4: the flip — reading gaps fixed, deck topped up
  const strike1S = B4_S + 20, strike1E = strike1S + 14;
  const old1Gone = strike1E + 10;
  const new1In = old1Gone + 14;
  const strike2S = B4_S + 60, strike2E = strike2S + 14;
  const old2Gone = strike2E + 10;
  const new2In = old2Gone + 14;
  const chipPop = pop(B4_S + 96);
  const resultLineOp = seg(frame, B4_S + 120, B4_S + 136);
  const sideIn4 = pop(B4_S + 30);

  // beat 5: rise-in on the log window (the third non-crossfade move)
  const b5dy = interpolate(frame, [B5_S, B5_S + 26], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const throughputRaw = interpolate(frame, [B5_S + 20, B5_S + 140], [0, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const throughput = Math.round(throughputRaw);
  const statPop = pop(B5_S + 10);
  const checkPop = pop(B5_S + 150);
  const LOG_LINES: LogLine[] = [
    { t: "decks", text: "deck[youngest]: 12 → 30 cards (topped up)", tone: "success" },
    { t: "ladder", text: "review ladder: 1 → 3 → 10 → 21 days", tone: "accent" },
    { t: "cap", text: "advance cap: 1 step max per calendar day", tone: "muted" },
    { t: "reading", text: "reading_gap queue: sourced from own finished work", tone: "accent" },
    { t: "result", text: "card throughput: +40% per hour", tone: "success" },
    { t: "wall", text: "kiosk wall: all three decks now even", tone: "success" },
  ];

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= per-beat headline ================= */}
        <Headline y={26} text="One child's deck ran dry — the others didn't." opacity={b1} fontSize={30} />
        <Headline y={26} text="It wasn't studying. It was just looping." opacity={b2} fontSize={30} />
        <Headline y={26} text="Now every card is on its own schedule." opacity={b3} fontSize={30} />
        <Headline y={26} text="Even the empty spots got filled." opacity={b4} fontSize={30} />

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 76,
            width: 1280,
            textAlign: "center",
            fontSize: 19,
            fontWeight: 650,
            color: P.muted,
            opacity: b1,
            fontFamily,
          }}
        >
          📱 Boytasks — a family kiosk display for kids' daily learning
        </div>

        {/* ================= the ledger (archetype 5) — beats 1, 2 and 4 ================= */}
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
            transform: `scale(${cardScale})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ position: "absolute", left: PAD, top: 22, fontSize: 14, fontWeight: 700, letterSpacing: 2, color: P.muted }}>
            {frame < B3_S ? "🗂 KIOSK DECK SIZES" : "🗂 KIOSK LEDGER — FIXED"}
          </div>
        </div>
        <Dash y={CARD_Y + 52} opacity={cardOp} />

        {/* beat 1 rows: three kids, three deck sizes */}
        <LedgerRow y={CARD_Y + 70} label="Brother A" value="30 cards" tone="ink" opacity={row0In * cardOp1} />
        <LedgerRow y={CARD_Y + 106} label="Brother B" value="30 cards" tone="ink" opacity={row1In * cardOp1} />
        <LedgerRow y={CARD_Y + 142} label="Youngest child" value="12 cards" tone="danger" opacity={row2In * cardOp1} />
        <Dash y={CARD_Y + 172} opacity={totalIn * cardOp1} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 184, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: totalIn * cardOp1 }}>
          SHORTEST DECK
        </div>
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 204, fontSize: 26, fontWeight: 800, color: P.danger, opacity: totalIn * cardOp1 }}>
          12 / 30 cards
        </div>

        {/* beat 2: loop-mode section appended below */}
        <Dash y={CARD_Y + 246} opacity={dividerOp * b2} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 260, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: sectionTitleOp * b2 }}>
          LOOP MODE — NO STUDY LOGIC
        </div>
        <LedgerRow y={CARD_Y + 286} label="Same 12 cards" value="every 5 seconds" tone="danger" opacity={row3In * b2} />
        <LedgerRow y={CARD_Y + 318} label="Schedule" value="none" tone="danger" opacity={row4In * b2} />
        <LedgerRow y={CARD_Y + 350} label="Due dates" value="none" tone="danger" opacity={row5In * b2} />

        {/* beat 4: the flip — reading gaps + deck size, both fixed */}
        <LedgerRow
          y={CARD_Y + 70}
          label="Reading gap"
          value="no question"
          tone="danger"
          strike={seg(frame, strike1S, strike1E)}
          opacity={cardOp2 * (1 - seg(frame, strike1E, old1Gone))}
        />
        <LedgerRow y={CARD_Y + 70} label="Reading gap" value="from own finished work" tone="success" opacity={seg(frame, old1Gone, new1In) * b4} />
        <LedgerRow
          y={CARD_Y + 106}
          label="Youngest deck"
          value="12 cards"
          tone="danger"
          strike={seg(frame, strike2S, strike2E)}
          opacity={cardOp2 * (1 - seg(frame, strike2E, old2Gone))}
        />
        <LedgerRow y={CARD_Y + 106} label="Youngest deck" value="30 cards (topped up)" tone="success" opacity={seg(frame, old2Gone, new2In) * b4} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 320, fontSize: 16, fontWeight: 700, color: P.success, opacity: resultLineOp * b4 }}>
          → Wall stays even all evening
        </div>
        <FilterChip
          x={CARD_X + CARD_W - 244}
          y={CARD_Y + 12}
          text="Cloudflare Workers"
          icon="🗓"
          color={P.accent}
          scale={Math.min(1, chipPop)}
          opacity={b4 * Math.min(1, chipPop)}
        />

        {/* side flanking tiles — beat 1 */}
        <IconCard x={40} y={280} w={250} emoji="👦" title="Brothers" sub="30 cards each" tone="success" opacity={b1} scale={Math.min(1, sideIn1)} />
        <IconCard x={990} y={280} w={250} emoji="🧒" title="Youngest" sub="Only 12 cards" tone="danger" opacity={b1} scale={Math.min(1, sideIn1)} />

        {/* side flanking tiles — beat 2 */}
        <div style={{ position: "absolute", left: 40, top: 280, opacity: b2, transform: `scale(${Math.min(1, sideIn2)})`, transformOrigin: "center top" }}>
          <IconCard x={0} y={0} w={250} emoji="🔁" title="Same cards" sub="looped every 5s" tone="danger" opacity={1} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 1115,
            top: 300,
            fontSize: 30,
            opacity: b2,
            transform: `rotate(${loopSpin}deg)`,
          }}
        >
          🔁
        </div>
        <IconCard x={990} y={280} w={250} emoji="🚫" title="No ladder" sub="no due dates" tone="danger" opacity={b2} scale={Math.min(1, sideIn2)} />

        {/* side flanking tiles — beat 4 */}
        <IconCard x={40} y={280} w={250} emoji="✅" title="Reading gaps" sub="now generate questions" tone="success" opacity={b4} scale={Math.min(1, sideIn4)} />
        <IconCard x={990} y={280} w={250} emoji="📦" title="Deck topped up" sub="12 → 30 cards" tone="success" opacity={b4} scale={Math.min(1, sideIn4)} />

        {/* per-beat caption band */}
        <CaptionBand text="One child ran out a third of the way through the evening" opacity={b1} tone="danger" />
        <CaptionBand text="No ladder, no due dates — just a five-second loop" opacity={b2} tone="danger" />
        <CaptionBand text="Every card now has its own schedule" opacity={b3} tone="accent" />
        <CaptionBand text="Reading gaps are no longer a dead field" opacity={b4} tone="accent" />

        {/* ================= beat 3: the real page, and the schedule callouts ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: b3,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN3.x + WIN3.w / 2}px ${WIN3.y + WIN3.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-b47"
            win={WIN3}
            from={B3_S}
            hold={B3_E - B3_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.4 }}
            opacity={1}
          />
        </div>
        <Panel x={40} y={180} w={290} h={90} tone="accent" opacity={b3 * Math.min(1, ladderPop)}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: P.accent }}>🗓 1-3-10-21 day ladder</div>
          </div>
        </Panel>
        <StatPill x={40} y={300} emoji="📦" text="short decks topped up to 30" tone="success" opacity={b3 * Math.min(1, toppedUpPop)} />

        {/* ================= beat 5: it is already working (rise-in, LogWindow) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b5, transform: `translateY(${b5dy}px)` }}>
          <div
            style={{
              position: "absolute",
              left: 260,
              top: 60,
              width: 900,
              fontSize: 29,
              fontWeight: 800,
              color: P.ink,
              letterSpacing: -0.2,
              fontFamily,
            }}
          >
            The fix is already running.
          </div>
          <Panel x={40} y={150} w={210} h={170} tone="success" opacity={Math.min(1, statPop)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 30 }}>🚀</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>+{throughput}%</div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", lineHeight: 1.3 }}>
                THROUGHPUT
                <br />
                ON THE WALL
              </div>
            </div>
          </Panel>
          <LogWindow lines={LOG_LINES} title="boytasks — kiosk scheduler" from={B5_S + 14} every={26} opacity={1} win={WIN_LOG} fontSize={21} />
          <CheckBadge x={1156} y={130} size={40} opacity={1} scale={Math.min(1, checkPop)} />
        </div>
        <CaptionBand text="Throughput on the wall: +40%" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
