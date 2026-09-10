/**
 * FeatureRiskScoringVetoesSerialK03 — feature k03 — 1280x720, 856 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 6 "sidebar narrative", mood "sand" (both handed down
 * by the orchestrating session). The fixed left column (0-320px) is the ONE
 * recurring element for the whole clip: a live mint counter for the wallet
 * under review, climbing toward the veto line at 50 — the number the VO ends
 * on. The right stage (356-1220px) swaps content per beat. Beat 3 slides in
 * horizontally instead of crossfading; beat 5 scale-pushes the real product
 * window in instead of a plain fade.
 *
 * Beats 1-4 are metaphor / invisible-plumbing (a scam pattern, a legacy
 * scoring gauge, an analogy, an API-to-scorer data pull) and stay drawn per
 * STEP 0c. Beat 5 is the shipped result, so it plays a recording of the real
 * feature page (shots/k03.json, shot "page") the way FeatureTraceabilityScannerLive
 * (p61) closes on its own feature page as proof.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-133  "How do you catch a scammer who's minted dozens of throwaway coins before?"
 *  b2 142-262  "My risk scorer only checked how concentrated the top holders were."
 *  b3 271-520  "That let a serial token creator score the same as a clean, first-time
 *              launch, like trusting a repeat shoplifter as a first-time customer."
 *  b4 529-664  "Now it pulls real holder and creator data from Jupiter's market API."
 *  b5 673-811  "A wallet is vetoed outright the moment it crosses fifty of its own mints."
 *              — holds to 856.
 *
 * Single tech name in the whole clip: Jupiter API (beat 4 chip only).
 * The four data thresholds shown in beat 4 (devMints > 50, netBuyers <= 0,
 * holders < 20, traders < 10) and the veto line of 50 are the real values from
 * risk.ts — nothing here is an invented metric.
 */
import React from "react";
import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, StatPill, FilterChip, FlowArrow, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/k03.json";

const P = MOODS.sand;

const STAGE_X = 356;
const STAGE_W = 864;

const B1_S = 15, B1_E = 133;
const B2_S = 142, B2_E = 262;
const B3_S = 271, B3_E = 520;
const B4_S = 529, B4_E = 664;
const B5_S = 673, B5_E = 811;
const END = 856;
const FADE = 9;
const CROSS = B5_S + 32; // 705 — the frame the counter crosses 50

const WIN5: Win = { x: 372, y: 150, w: 820, h: 384 };

const COINS: { ticker: string; emoji: string }[] = [
  { ticker: "$MOON7", emoji: "🚀" },
  { ticker: "$DOGE99", emoji: "🐶" },
  { ticker: "$PUMPX", emoji: "⚡" },
  { ticker: "$RUG42", emoji: "🎯" },
  { ticker: "$SAFEX", emoji: "🛡" },
];

const CHIPS: string[] = [
  "devMints > 50 → hard veto",
  "netBuyers ≤ 0 → −12 pts",
  "holders < 20 → −10 pts",
  "traders < 10 → −8 pts",
];

/** Stage caption — lives INSIDE the right stage, never under the sidebar. */
const StageCaption: React.FC<{ text: string; opacity: number; tone?: "ink" | "danger" | "accent" | "success" }> = ({
  text,
  opacity,
  tone = "ink",
}) => {
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : tone === "accent" ? P.accent : tone === "success" ? P.success : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE_X,
        top: 606,
        width: STAGE_W,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 650,
        lineHeight: 1.3,
        color,
        opacity,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

const StageHeading: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE_X,
        top: 62,
        width: STAGE_W,
        fontSize: 29,
        fontWeight: 800,
        color: P.ink,
        opacity,
        letterSpacing: -0.2,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

export const FeatureRiskScoringVetoesSerialK03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  // ---- the sidebar counter: the one element that survives every beat ----
  const countRaw = interpolate(
    frame,
    [0, B1_S, B1_E, B2_S, B2_E, B3_S, B3_E, B4_S, B4_E, B5_S, CROSS, B5_E, END],
    [0, 0, 3, 3, 7, 7, 11, 11, 46, 46, 50, 50, 50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const count = Math.round(countRaw);
  const vetoOn = seg(frame, CROSS, CROSS + 16);
  const numberColor = interpolateColors(frame, [0, B4_S, B4_E, CROSS, CROSS + 16], [
    P.ink,
    P.ink,
    P.danger,
    P.danger,
    P.success,
  ] as any);
  const barFill = Math.min(1, count / 50);
  const stampPop = frame < CROSS ? 0 : spring({ frame: frame - CROSS, fps, config: { damping: 10, mass: 0.7 } });

  // ---- beat 1 : the scam pattern ----
  const coinIn = (i: number) => seg(frame, B1_S + 10 + i * 16, B1_S + 10 + i * 16 + 14);

  // ---- beat 3 : horizontal slide-in (the non-crossfade transition) ----
  const b3dx = interpolate(frame, [B3_S, B3_S + 30], [70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ---- beat 4 : the Jupiter data pull ----
  const arrowProgress = interpolate(frame, [B4_S + 10, B4_S + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const chipRow = (i: number) => seg(frame, B4_S + 55 + i * 18, B4_S + 55 + i * 18 + 14);
  const jupiterChipPop = pop(B4_S + 30);

  // ---- beat 5 : scale-push the real product in (the other non-crossfade transition) ----
  const pushScale = interpolate(frame, [B5_S, B5_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const resultStripIn = seg(frame, B5_S + 60, B5_S + 76);
  const checkPop = pop(CROSS);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= persistent sidebar (archetype 6) ================= */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 320,
            height: 720,
            background: P.card,
            borderRight: `2px solid ${P.border}`,
            opacity: seg(frame, 0, 15),
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 44, fontSize: 14, fontWeight: 800, letterSpacing: 2, color: P.muted }}>
            WALLET UNDER REVIEW
          </div>
          <div
            style={{
              position: "absolute",
              left: 32,
              top: 74,
              padding: "6px 14px",
              borderRadius: 999,
              background: P.chipBg,
              border: `1.5px solid ${P.border}`,
              fontSize: 15,
              fontWeight: 700,
              color: P.muted,
              fontFamily: "ui-monospace, Menlo, monospace",
            }}
          >
            8fJ2…mK4Q
          </div>

          <div
            style={{
              position: "absolute",
              left: 32,
              top: 190,
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -3,
              color: numberColor as unknown as string,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {count}
          </div>
          <div style={{ position: "absolute", left: 34, top: 344, width: 250, fontSize: 15.5, fontWeight: 700, letterSpacing: 1, color: P.muted, lineHeight: 1.35 }}>
            {vetoOn > 0.5 ? "SERIAL MINTER" : "TOKENS MINTED"}
            <br />
            {vetoOn > 0.5 ? "— VETOED" : "BY THIS WALLET"}
          </div>

          <div style={{ position: "absolute", left: 32, top: 410, width: 256, height: 10, borderRadius: 6, background: P.chipBg, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${barFill * 100}%`,
                borderRadius: 6,
                background: numberColor as unknown as string,
              }}
            />
          </div>
          <div style={{ position: "absolute", left: 32, top: 430, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted }}>
            VETO LINE → 50 MINTS
          </div>

          {stampPop > 0.02 ? (
            <div
              style={{
                position: "absolute",
                left: 32,
                top: 490,
                padding: "10px 18px",
                borderRadius: 12,
                background: P.successBg,
                border: `2px solid ${P.successEdge}`,
                color: P.success,
                fontWeight: 800,
                fontSize: 20,
                transform: `scale(${Math.min(1, stampPop)}) rotate(-3deg)`,
                transformOrigin: "left center",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🚫 HARD VETO
            </div>
          ) : null}
        </div>

        {/* ================= beat 1 : same wallet, new coin ================= */}
        <StageHeading text="Same wallet. New coin. Again." opacity={b1} />
        <StatPill x={STAGE_X} y={112} emoji="😵" text="buyers fooled, every single time" tone="danger" opacity={b1} />
        {COINS.map((c, i) => (
          <Panel key={c.ticker} x={STAGE_X + i * 172} y={214} w={152} h={112} tone="danger" opacity={b1 * coinIn(i)}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transform: `translateY(${(1 - coinIn(i)) * 14}px)`,
              }}
            >
              <div style={{ fontSize: 34 }}>{c.emoji}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: P.ink }}>{c.ticker}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: P.danger }}>same wallet</div>
            </div>
          </Panel>
        ))}
        <StageCaption text="Same wallet, a new coin every few hours" opacity={b1} tone="danger" />

        {/* ================= beat 2 : the old check saw one thing ================= */}
        <StageHeading text="The old check looked at one thing." opacity={b2} />
        <Panel x={STAGE_X} y={140} w={430} h={300} tone="danger" opacity={b2}>
          <div style={{ position: "absolute", left: 24, top: 20, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>
            RISK INPUTS CHECKED
          </div>
          <div style={{ position: "absolute", left: 24, top: 56, fontSize: 19, fontWeight: 700, color: P.ink }}>
            ☑ Top-10 holder concentration
          </div>
          <div style={{ position: "absolute", left: 24, top: 96, fontSize: 19, fontWeight: 700, color: P.muted, textDecoration: "line-through" }}>
            ☐ Mint history
          </div>
          <div style={{ position: "absolute", left: 24, top: 136, fontSize: 19, fontWeight: 700, color: P.muted, textDecoration: "line-through" }}>
            ☐ Net buyer count
          </div>
          <div style={{ position: "absolute", left: 24, top: 200, width: 382, height: 60, borderRadius: 12, background: P.chipBg, display: "flex", alignItems: "center", padding: "0 18px", fontSize: 15, fontWeight: 700, color: P.muted }}>
            "...and a couple of source flags."
          </div>
        </Panel>
        <Panel x={STAGE_X + 470} y={140} w={280} h={300} tone="success" opacity={b2}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: P.success }}>PASS ✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: P.muted, textAlign: "center" }}>looks safe</div>
          </div>
        </Panel>
        <StatPill x={STAGE_X} y={462} emoji="🙈" text="mint history? never checked" tone="danger" opacity={b2} />
        <StageCaption text="One factor decided everything" opacity={b2} tone="danger" />

        {/* ================= beat 3 : same verdict (slide-in, no crossfade) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b3, transform: `translateX(${b3dx}px)` }}>
          <StageHeading text="Same score. Same trust." opacity={1} />
          <Panel x={STAGE_X} y={178} w={330} h={290} tone="danger" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ fontSize: 46 }}>🥷</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Serial minter</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: P.danger }}>40 tokens minted before</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, color: P.success }}>PASS ✅</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 350, top: 178, width: 130, height: 290, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: 800, color: P.muted }}>
            =
          </div>
          <Panel x={STAGE_X + 500} y={178} w={330} h={290} tone="card" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ fontSize: 46 }}>🙂</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>First-time launch</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: P.muted }}>brand-new wallet</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800, color: P.success }}>PASS ✅</div>
            </div>
          </Panel>
          <StageCaption text="Like trusting a repeat shoplifter as a first-time customer" opacity={1} />
        </div>

        {/* ================= beat 4 : the real data pull ================= */}
        <StageHeading text="Now the scorer asks for the real history." opacity={b4} />
        <Panel x={STAGE_X} y={160} w={260} h={140} tone="accent" opacity={b4}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 38 }}>🛰</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, textAlign: "center" }}>Jupiter Tokens API</div>
          </div>
        </Panel>
        <div style={{ position: "absolute", left: STAGE_X + 270, top: 218 }}>
          <FlowArrow x={0} y={0} len={140} progress={arrowProgress} color={P.accent} opacity={b4} />
        </div>
        <FilterChip
          x={STAGE_X + 20}
          y={78}
          text="Jupiter API"
          icon="🛰"
          color={P.accent}
          scale={Math.min(1, jupiterChipPop)}
          opacity={b4 * Math.min(1, jupiterChipPop)}
        />
        <Panel x={STAGE_X + 430} y={140} w={330} h={280} tone="card" opacity={b4}>
          <div style={{ position: "absolute", left: 22, top: 18, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>
            scoreCandidate()
          </div>
          {CHIPS.map((c, i) => (
            <div
              key={c}
              style={{
                position: "absolute",
                left: 22,
                top: 56 + i * 52,
                width: 286,
                padding: "10px 14px",
                borderRadius: 10,
                background: P.dangerBg,
                border: `1.5px solid ${P.dangerEdge}`,
                fontSize: 15.5,
                fontWeight: 700,
                color: P.danger,
                opacity: chipRow(i),
                transform: `translateX(${(1 - chipRow(i)) * 18}px)`,
              }}
            >
              {c}
            </div>
          ))}
        </Panel>
        <StageCaption text="Real mint and holder history, not just price" opacity={b4} tone="accent" />

        {/* ================= beat 5 : the real page, and the veto ================= */}
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
            title="vitalii.no/features/…-k03"
            win={WIN5}
            from={B5_S}
            hold={END - B5_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b5}
          />
        </div>
        <CheckBadge x={1150} y={130} size={40} opacity={b5} scale={checkPop} />
        <div
          style={{
            position: "absolute",
            left: WIN5.x + 24,
            top: WIN5.y + WIN5.h - 70,
            padding: "12px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.96)",
            border: `1.5px solid ${P.successEdge}`,
            boxShadow: "0 14px 34px rgba(42,32,24,0.16)",
            opacity: b5 * resultStripIn,
            transform: `translateY(${(1 - resultStripIn) * 14}px)`,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          50 mints → hard veto
        </div>
        <StageCaption text="Live on vitalii.no now" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
