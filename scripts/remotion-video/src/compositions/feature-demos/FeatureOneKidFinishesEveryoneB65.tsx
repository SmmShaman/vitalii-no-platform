/**
 * FeatureOneKidFinishesEveryoneB65 — feature b65 — 1280x720, 828 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 5 "ledger", mood "dawn" (both handed down by the
 * orchestrating session, not re-rolled). One receipt-style ledger card is the
 * recurring element across beats 1, 2 and 4: each kid's homework status is
 * itemised (two brothers done, youngest not), then the old "ANY child passes"
 * unlock rule is appended as its own loophole section, then — after the live
 * evidence beat — the card returns with a strike/kill/replace flip (never a
 * crossfade) showing the unlock rule and the "who's missing" field both fixed
 * in green. Beat 3 scale-pushes the real product page in as the substantiated
 * claim, the second non-crossfade move; beat 5 rises in on a LogWindow, the
 * third.
 *
 * Beats 1, 2 and 4 are the loophole diagnosis and the strict-mode ledger flip
 * — all metaphor/plumbing, so they stay drawn per STEP 0c. Beat 3 is the
 * substantiated claim ("I built a strict mode, in a Cloudflare Worker, that
 * checks who's actually caught up"), so it plays a recording of the real
 * feature page (shots/b65.json, shot "page"). Beat 5 does NOT play the
 * feature page or the hub (gate 2): it closes on a LogWindow built from the
 * feature row's own numbers — Boytasks keeps no runtime log on the VPS, so
 * these lines are assembled from problem/solution/result, never invented.
 * No GitHub URL was verified tonight, so the fix beat names the real file
 * (src/pages/AdminPage.tsx) as a drawn label rather than a recorded diff.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-185  "One TV, a houseful of kids — and one finished child used to
 *              unlock it for everybody."
 *  b2 194-324  "The ones who hadn't touched their own schoolwork still got to
 *              watch, every time."
 *  b3 333-480  "I built a strict mode, in a Cloudflare Worker, that checks
 *              who's actually caught up."
 *  b4 489-636  "Now it locks the screen, and the admin panel names exactly
 *              who still owes work."
 *  b5 645-783  "One finished child used to be enough. Now it has to be every
 *              single one." — holds to 828.
 *
 * Single tech name in the whole clip: Cloudflare Worker (beat 3 chip only,
 * matching beat 3's own sentence). All numbers on screen (3 kids, 2 of 3
 * owing work, 3/3 caught up) are the real values from the feature row and the
 * given product line — nothing here is invented.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, Headline, CaptionBand, StatPill, IconCard, FilterChip, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/b65.json";

const P = MOODS.dawn;

const B1_S = 15, B1_E = 185;
const B2_S = 194, B2_E = 324;
const B3_S = 333, B3_E = 480;
const B4_S = 489, B4_E = 636;
const B5_S = 645, B5_E = 783;
const END = 828;
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

export const FeatureOneKidFinishesEveryoneB65: React.FC = () => {
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

  // beat 1: each kid's homework status appears one by one
  const row0In = seg(frame, B1_S + 20, B1_S + 32);
  const row1In = seg(frame, B1_S + 40, B1_S + 52);
  const row2In = seg(frame, B1_S + 60, B1_S + 72);
  const totalIn = seg(frame, B1_S + 90, B1_S + 106);
  const sideIn1 = pop(B1_S + 26);

  // beat 2: the loophole section appended below the same card
  const dividerOp = seg(frame, B2_S + 8, B2_S + 20);
  const sectionTitleOp = seg(frame, B2_S + 14, B2_S + 26);
  const row3In = seg(frame, B2_S + 30, B2_S + 42);
  const row4In = seg(frame, B2_S + 50, B2_S + 62);
  const row5In = seg(frame, B2_S + 70, B2_S + 82);
  const sideIn2 = pop(B2_S + 20);

  // beat 3: scale-push the real evidence in + two strict-mode callouts
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const flagPop = pop(B3_S + 40);
  const checkPop3 = pop(B3_S + 92);
  const chipPop = pop(B3_S + 60);

  // beat 4: the flip — unlock rule and who's-missing field, both fixed
  const strike1S = B4_S + 20, strike1E = strike1S + 14;
  const old1Gone = strike1E + 10;
  const new1In = old1Gone + 14;
  const strike2S = B4_S + 60, strike2E = strike2S + 14;
  const old2Gone = strike2E + 10;
  const new2In = old2Gone + 14;
  const resultLineOp = seg(frame, B4_S + 120, B4_S + 136);
  const sideIn4 = pop(B4_S + 30);

  // beat 5: rise-in on the log window (the third non-crossfade move)
  const b5dy = interpolate(frame, [B5_S, B5_S + 26], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const statPop = pop(B5_S + 10);
  const checkPop5 = pop(B5_S + 150);
  const LOG_LINES: LogLine[] = [
    { t: "flag", text: "strict_all_home: true", tone: "accent" },
    { t: "check", text: "daily_subjects: child_a=done, child_b=done, child_c=pending", tone: "muted" },
    { t: "old", text: "tv_unlocked (old rule): true — any() passed", tone: "danger" },
    { t: "new", text: "tv_unlocked (strict mode): false — all() required", tone: "success" },
    { t: "admin", text: "AdminPage: owing=['child_c: math, reading']", tone: "accent" },
    { t: "result", text: "child_c completes reading → all()=true", tone: "success" },
    { t: "wall", text: "tv_unlocked: true — 3/3 kids caught up", tone: "success" },
  ];

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= per-beat headline ================= */}
        <Headline y={26} text="One finished kid used to unlock the TV for everyone." opacity={b1} fontSize={30} />
        <Headline y={26} text="The ones still owing work got to watch anyway." opacity={b2} fontSize={30} />
        <Headline y={26} text="Strict mode checks who's actually caught up." opacity={b3} fontSize={30} />
        <Headline y={26} text="Now the admin panel names exactly who's missing." opacity={b4} fontSize={30} />

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
          📺 Boytasks — a screen-time system for three kids: YouTube unlocks only after schoolwork is done
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
            {frame < B3_S ? "🏠 TONIGHT'S HOMEWORK" : "🏠 TV UNLOCK LEDGER — FIXED"}
          </div>
        </div>
        <Dash y={CARD_Y + 52} opacity={cardOp} />

        {/* beat 1 rows: three kids, three statuses */}
        <LedgerRow y={CARD_Y + 70} label="Brother A" value="Done" tone="success" opacity={row0In * cardOp1} />
        <LedgerRow y={CARD_Y + 106} label="Brother B" value="Done" tone="success" opacity={row1In * cardOp1} />
        <LedgerRow y={CARD_Y + 142} label="Youngest child" value="Not done" tone="danger" opacity={row2In * cardOp1} />
        <Dash y={CARD_Y + 172} opacity={totalIn * cardOp1} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 184, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: totalIn * cardOp1 }}>
          TV STATUS
        </div>
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 204, fontSize: 26, fontWeight: 800, color: P.danger, opacity: totalIn * cardOp1 }}>
          🔓 UNLOCKED
        </div>

        {/* beat 2: the loophole section appended below */}
        <Dash y={CARD_Y + 246} opacity={dividerOp * b2} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 260, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: sectionTitleOp * b2 }}>
          OLD UNLOCK RULE
        </div>
        <LedgerRow y={CARD_Y + 286} label="Check logic" value="ANY child passes" tone="danger" opacity={row3In * b2} />
        <LedgerRow y={CARD_Y + 318} label="Still owing work" value="2 of 3 kids" tone="danger" opacity={row4In * b2} />
        <LedgerRow y={CARD_Y + 350} label="Happens" value="every single day" tone="danger" opacity={row5In * b2} />

        {/* beat 4: the flip — unlock rule + who's-missing, both fixed */}
        <LedgerRow
          y={CARD_Y + 70}
          label="Unlock rule"
          value="ANY child passes"
          tone="danger"
          strike={seg(frame, strike1S, strike1E)}
          opacity={cardOp2 * (1 - seg(frame, strike1E, old1Gone))}
        />
        <LedgerRow y={CARD_Y + 70} label="Unlock rule" value="ALL children pass" tone="success" opacity={seg(frame, old1Gone, new1In) * b4} />
        <LedgerRow
          y={CARD_Y + 106}
          label="Who's missing"
          value="not shown"
          tone="danger"
          strike={seg(frame, strike2S, strike2E)}
          opacity={cardOp2 * (1 - seg(frame, strike2E, old2Gone))}
        />
        <LedgerRow y={CARD_Y + 106} label="Who's missing" value="named in Admin panel" tone="success" opacity={seg(frame, old2Gone, new2In) * b4} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 300, fontSize: 13, fontWeight: 700, color: P.muted, opacity: resultLineOp * b4, fontFamily: "monospace" }}>
          src/pages/AdminPage.tsx
        </div>
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 326, fontSize: 16, fontWeight: 700, color: P.success, opacity: resultLineOp * b4 }}>
          → TV stays dark until every kid is caught up
        </div>

        {/* side flanking tiles — beat 1 */}
        <IconCard x={40} y={280} w={250} emoji="👦" title="Brothers" sub="Both finished" tone="success" opacity={b1} scale={Math.min(1, sideIn1)} />
        <IconCard x={990} y={280} w={250} emoji="🧒" title="Youngest" sub="Not finished" tone="danger" opacity={b1} scale={Math.min(1, sideIn1)} />

        {/* side flanking tiles — beat 2 */}
        <IconCard x={40} y={280} w={250} emoji="📺" title="TV unlocked" sub="because ONE passed" tone="danger" opacity={b2} scale={Math.min(1, sideIn2)} />
        <IconCard x={990} y={280} w={250} emoji="📚" title="Work left undone" sub="2 of 3 kids, daily" tone="danger" opacity={b2} scale={Math.min(1, sideIn2)} />

        {/* side flanking tiles — beat 4 */}
        <IconCard x={40} y={280} w={250} emoji="🔒" title="Locked by default" sub="until all three pass" tone="success" opacity={b4} scale={Math.min(1, sideIn4)} />
        <IconCard x={990} y={280} w={250} emoji="📋" title="Admin panel" sub="names who's left" tone="success" opacity={b4} scale={Math.min(1, sideIn4)} />

        {/* per-beat caption band */}
        <CaptionBand text="One finished child unlocked the TV for the whole house" opacity={b1} tone="danger" />
        <CaptionBand text="Two of three kids still owed work, every night" opacity={b2} tone="danger" />
        <CaptionBand text="A Cloudflare Worker checks every kid before it unlocks" opacity={b3} tone="accent" />
        <CaptionBand text="The admin panel now names exactly who's missing" opacity={b4} tone="accent" />

        {/* ================= beat 3: the real page, and the strict-mode callouts ================= */}
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
            title="vitalii.no/features/…-b65"
            win={WIN3}
            from={B3_S}
            hold={B3_E - B3_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.4 }}
            opacity={1}
          />
        </div>
        <Panel x={40} y={180} w={290} h={90} tone="accent" opacity={b3 * Math.min(1, flagPop)}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: P.accent }}>🧩 strict_all_home flag</div>
          </div>
        </Panel>
        <StatPill x={40} y={300} emoji="📋" text="checks every kid's daily subjects" tone="success" opacity={b3 * Math.min(1, checkPop3)} />
        <FilterChip
          x={950}
          y={180}
          text="Cloudflare Worker"
          icon="⚙️"
          color={P.accent}
          scale={Math.min(1, chipPop)}
          opacity={b3 * Math.min(1, chipPop)}
        />

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
            One finished kid used to be enough. Now it has to be every one.
          </div>
          <Panel x={40} y={150} w={210} h={170} tone="success" opacity={Math.min(1, statPop)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 30 }}>✅</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>3/3</div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", lineHeight: 1.3 }}>
                KIDS
                <br />
                CAUGHT UP
              </div>
            </div>
          </Panel>
          <LogWindow lines={LOG_LINES} title="boytasks — youtube-gate worker" from={B5_S + 14} every={24} opacity={1} win={WIN_LOG} fontSize={20} />
          <CheckBadge x={1156} y={130} size={40} opacity={1} scale={Math.min(1, checkPop5)} />
        </div>
        <CaptionBand text="Every kid caught up, every time: 3/3" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
