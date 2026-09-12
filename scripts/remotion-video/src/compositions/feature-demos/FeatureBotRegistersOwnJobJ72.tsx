/**
 * FeatureBotRegistersOwnJobJ72 — feature j72 — 1280x720, 846 frames @ 30fps, VOICE-SYNCED.
 *
 * WAVE B (2026-09-12), drawn from `out/lux-batch-instructions.md`:
 *   archetype = 3 "card deck"   mood = sand   (const P = MOODS.sand)
 *
 * The deck is 4 job-posting cards (one is "the perfect match"). It is the ONE
 * element that survives every beat: it lands in beat 1, loses its winner to
 * the account wall in beat 2, sits idle while the bot gives up in beat 3,
 * shrinks into a strip that unlocks card-by-card while the real automation
 * runs in beat 4, then hands the winner back — unlocked and ready — in beat 5.
 * Non-crossfade transitions: the cards SLIDE in from off-screen in beat 1,
 * and the whole deck SCALE-PUSHES from the big 2x2 grid into the top strip
 * at the start of beat 4 — neither is a plain opacity crossfade.
 *
 * UI beats play the real product (owner rule, 2026-09-06): beats 4 and 5 are
 * recordings from shots/j72.json, not mockups —
 *   actions  github.com/SmmShaman/jobbot-norway/actions            beat 4
 *   page     vitalii.no/features/…-j72 (this feature's own page)   beat 5
 * Beats 1-3 describe the external account-wall problem (not our product),
 * so — like the metaphor beat in FeatureTraceabilityScannerLive — they stay
 * drawn.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–156  "Some job sites make you create an account just to apply — no guest option at all."
 *  b2 165–268  "A perfect match got skipped the second that wall showed up."
 *  b3 277–387  "Our bot used to see that wall and simply give up every time."
 *  b4 396–555  "Now it registers the account on its own, confirms the email, and imports the resume."
 *  b5 564–801  "Tested live on a real Webcruiter posting: zero applications before, every section filled and ready to send now." — holds to 846.
 *
 * Single tech name in the whole clip: Webcruiter (beat 5 chip only).
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import {
  LightBg,
  Group,
  StatPill,
  FilterChip,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, WIN_DEFAULT } from "./live-primitives";
import shots from "./shots/j72.json";

const P = MOODS.sand;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WIN = WIN_DEFAULT;

type Card = { role: string; city: string };
const CARDS: Card[] = [
  { role: "Senior Frontend Developer", city: "Oslo" },
  { role: "DevOps Engineer", city: "Bergen" },
  { role: "Backend Developer", city: "Trondheim" },
  { role: "Data Analyst", city: "Stavanger" },
];
const WINNER = 0;

const BIG_SLOTS = [
  { x: 335, y: 175 },
  { x: 675, y: 175 },
  { x: 335, y: 365 },
  { x: 675, y: 365 },
] as const;
const BIG_W = 270;
const BIG_H = 170;

const MINI_W = 210;
const MINI_H = 80;
const MINI_START_X = (1280 - (MINI_W * 4 + 24 * 3)) / 2;
const MINI_SLOTS = [0, 1, 2, 3].map((i) => ({ x: MINI_START_X + i * (MINI_W + 24), y: 18 }));

const FINAL_SLOT = { x: WIN.x + WIN.w - 300, y: WIN.y + WIN.h - 128, w: 270, h: 112 };

const hero = (
  value: string,
  unit: string | undefined,
  label: string,
  color: string,
  scale: number,
  top: number = 34,
  size: number = 96,
) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      top,
      width: 470,
      transform: `scale(${0.86 + 0.14 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div
      style={{
        fontSize: size,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -3,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
      {unit ? <span style={{ fontSize: size * 0.34, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, letterSpacing: 1.6, color: P.muted }}>{label}</div>
  </div>
);

export const FeatureBotRegistersOwnJobJ72: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows: fade in over 16f, fade out over 16f at the NEXT beat's
  // start (the ~9f silence gap makes the two ramps overlap into a natural
  // crossfade). Beat 5 has no fade-out — it holds full opacity to frame 846.
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 156, 172));
  const b2 = seg(frame, 165, 181) * (1 - seg(frame, 268, 284));
  const b3 = seg(frame, 277, 293) * (1 - seg(frame, 387, 403));
  const b4 = seg(frame, 396, 412) * (1 - seg(frame, 555, 571));
  const b5 = seg(frame, 564, 580); // holds through 846

  // ── The deck: position + unlock state, alive from beat 1 to the very end ──
  const ptToMini = seg(frame, 400, 428); // beat 4: big grid -> top strip (scale-push)
  const ptToFinal = seg(frame, 600, 624); // beat 5: winner strip slot -> final corner card
  const skipStamp = seg(frame, 210, 226); // beat 2: winner gets slammed with "skipped"

  const cardBox = (i: number) => {
    const winner = i === WINNER;
    const eS = 30 + i * 14;
    const eE = eS + 20;
    const arrive = seg(frame, eS, eE, Easing.out(Easing.cubic));
    const bigX = interpolate(frame, [eS, eE], [1460, BIG_SLOTS[i].x], { ...CLAMP, easing: Easing.out(Easing.cubic) });
    const bigY = interpolate(frame, [eS, eE], [BIG_SLOTS[i].y - 60, BIG_SLOTS[i].y], { ...CLAMP, easing: Easing.out(Easing.cubic) });
    const rot = interpolate(frame, [eS, eE], [9, winner ? -2 : -2 + i * 3], CLAMP);
    const opacity = interpolate(frame, [eS, eS + 10], [0, 1], CLAMP);
    const grey = winner ? skipStamp * (1 - ptToMini) : 0;

    const miniX = MINI_SLOTS[i].x;
    const miniY = MINI_SLOTS[i].y;
    const winScale = interpolate(frame, [600, 624], [1, 1], CLAMP); // placeholder kept explicit for clarity

    let x = bigX + (miniX - bigX) * ptToMini;
    let y = bigY + (miniY - bigY) * ptToMini;
    let w = BIG_W + (MINI_W - BIG_W) * ptToMini;
    let h = BIG_H + (MINI_H - BIG_H) * ptToMini;
    let scale = 1;

    if (winner) {
      x = x + (FINAL_SLOT.x - miniX) * ptToFinal;
      y = y + (FINAL_SLOT.y - miniY) * ptToFinal;
      w = w + (FINAL_SLOT.w - MINI_W) * ptToFinal;
      h = h + (FINAL_SLOT.h - MINI_H) * ptToFinal;
    }

    const unlockStart = 450 + i * 28;
    const unlock = seg(frame, unlockStart, unlockStart + 16);

    return { x, y, w, h, rot: rot * (1 - ptToMini * 0.6), opacity: opacity * arrive, grey, unlock, scale: winScale };
  };

  // ── Beat 2 micro-beats on the winner card ──
  const matchTag = seg(frame, 180, 196) * (1 - seg(frame, 206, 214));

  // ── Beat 3: bot walks up to the wall and bounces off ──
  const botX = interpolate(frame, [277, 312, 332, 348, 382], [-90, 430, 452, 418, -90], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });
  const heroPop3 = pop(290);

  // ── Beat 5 payoff ──
  const readyPop = seg(frame, 630, 646);
  const heroPop5 = pop(650);
  const chipPop = pop(672);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= beat 1 : the wall, before the deck even lands ================= */}
        <Group opacity={b1}>
          <StatPill x={90} y={52} emoji="😩" text="no guest option at all" tone="danger" opacity={b1} />
          <StatPill x={90} y={112} emoji="🔒" text="account wall on every posting" tone="danger" opacity={b1} />
          <CaptionBand y={664} fontSize={22} text="Some job sites won't even let you look without an account first" tone="danger" opacity={b1} />
        </Group>

        {/* ================= beat 3 : hero number sits over the idle deck ================= */}
        <Group opacity={b3}>
          {hero("0", undefined, "APPLICATIONS COMPLETED HERE", P.danger, heroPop3)}
          <StatPill x={780} y={52} emoji="🤖" text="the bot sees the wall" tone="danger" opacity={b3} />
          <StatPill x={780} y={112} emoji="🚫" text="and gives up, every time" tone="danger" opacity={b3} />
          <div style={{ position: "absolute", left: botX, top: 240, fontSize: 64, filter: "grayscale(0.4)" }}>🤖</div>
          <CaptionBand y={664} fontSize={22} text="It saw that wall and simply walked away — every single time" tone="danger" opacity={b3} />
        </Group>

        {/* ================= beat 4 : the real automation, deck unlocking above it ================= */}
        <Group opacity={b4}>
          <CaptionBand y={664} fontSize={22} text="Now it registers the account, confirms the e-mail, imports the resume" tone="accent" opacity={b4} />
        </Group>
        <LiveWindow
          file={shots}
          shot="actions"
          title="github.com — Actions · jobbot-norway"
          from={396}
          hold={175}
          zoom={(t) => 1 + 0.07 * t}
          focus={{ x: 0.3, y: 0.35 }}
          opacity={b4}
        />

        {/* ================= beat 5 : the feature's own page proves the result ================= */}
        <Group opacity={b5}>
          {hero("3", undefined, "SECTIONS FILLED AND READY", P.success, heroPop5, 106, 52)}
          <StatPill x={780} y={106} emoji="✅" text="zero before, filled now" tone="success" opacity={b5} />
          <StatPill x={780} y={150} emoji="📄" text="personal, questions, cover letter" tone="success" opacity={b5} />
          <CaptionBand y={664} fontSize={22} text="Tested live on Webcruiter: every section filled, ready to send" tone="success" opacity={b5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features — the bot registers its own job-site accounts"
          from={564}
          hold={282}
          zoom={(t) => 1 + 0.09 * t}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
        />
        <FilterChip
          x={WIN.x + WIN.w - 220}
          y={WIN.y + 14}
          text="Webcruiter"
          icon="🌐"
          color={P.accent}
          scale={chipPop}
          opacity={b5 * Math.min(1, chipPop)}
        />

        {/* ================= the deck itself : survives every single beat ================= */}
        {CARDS.map((c, i) => {
          const box = cardBox(i);
          if (box.opacity <= 0.004) return null;
          const winner = i === WINNER;
          const lockedBg = "#F4E4D2";
          const lockedEdge = P.dangerEdge;
          const unlockedEdge = P.successEdge;
          const edge = box.grey > 0.3 ? P.danger : box.unlock > 0.5 ? unlockedEdge : lockedEdge;
          return (
            <div
              key={c.role}
              style={{
                position: "absolute",
                left: box.x,
                top: box.y,
                width: box.w,
                height: box.h,
                transform: `rotate(${box.rot}deg)`,
                transformOrigin: "center",
                opacity: box.opacity,
                borderRadius: 16,
                background: box.grey > 0.3 ? "#EDEAE4" : lockedBg,
                border: `2px solid ${edge}`,
                boxShadow: cardShadow,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 20px",
                boxSizing: "border-box",
                fontFamily,
                filter: box.grey > 0.3 ? "saturate(0.35)" : "none",
              }}
            >
              <div style={{ fontSize: box.w > 240 ? 19 : 15, fontWeight: 700, color: P.ink, lineHeight: 1.25 }}>{c.role}</div>
              <div style={{ fontSize: box.w > 240 ? 15 : 12.5, fontWeight: 600, color: P.muted, marginTop: 4 }}>{c.city}</div>
              <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: box.w > 240 ? 30 : 22 }}>
                {box.unlock > 0.5 ? "🔓" : "🔒"}
              </div>

              {winner && matchTag > 0.004 ? (
                <div
                  style={{
                    position: "absolute",
                    left: -10,
                    top: -16,
                    padding: "4px 12px",
                    borderRadius: 999,
                    background: P.successBg,
                    border: `1.5px solid ${P.successEdge}`,
                    color: P.success,
                    fontSize: 14,
                    fontWeight: 700,
                    opacity: matchTag,
                    transform: `scale(${0.7 + 0.3 * matchTag})`,
                    whiteSpace: "nowrap",
                  }}
                >
                  🎯 perfect match
                </div>
              ) : null}

              {winner && box.grey > 0.3 ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) rotate(-8deg) scale(${Math.min(1, skipStamp * 1.3)})`,
                    padding: "6px 16px",
                    borderRadius: 8,
                    background: P.danger,
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: 1,
                    opacity: skipStamp,
                    whiteSpace: "nowrap",
                  }}
                >
                  ❌ SKIPPED
                </div>
              ) : null}

              {winner && readyPop > 0.004 ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: -18,
                    transform: `translateX(-50%) scale(${0.7 + 0.3 * readyPop})`,
                    padding: "5px 14px",
                    borderRadius: 999,
                    background: P.successBg,
                    border: `1.5px solid ${P.successEdge}`,
                    color: P.success,
                    fontSize: 15,
                    fontWeight: 800,
                    opacity: readyPop,
                    whiteSpace: "nowrap",
                  }}
                >
                  ✅ Ready to submit
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </PaletteProvider>
  );
};
