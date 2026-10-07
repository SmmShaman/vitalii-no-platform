// FeatureOneShowUsedSameP74 — feature p74 — 1280x720, 925 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood dawn (handed down by the orchestrating session —
// not re-drawn here, out/lux-archetypes.md is not touched by this file).
//
// The daily video pipeline used to repeat the same motion-graphic effect
// across a single episode because the effect picker had no memory of what it
// had already used. A new jsonb column now records exactly which effect
// played on which beat of which video, and the code enforces a hard cap no
// prompt wording could guarantee.
//
// ONE deck of 6 beat-cards is the object alive for the whole clip (the
// archetype's own "pile shrinking / fan sorting itself" payoff):
// b1  15-223 "One video repeated the same animated effect five times in a
//     row, even though I kept telling it to vary things." The deck fans out
//     fully across the frame: 5 of its 6 cards are stamped with the SAME
//     real effect file (CardCounter.tsx), a red "5x in a row" badge over the
//     fan. Product plate names the product, verbatim, up top. Small
//     secondary LiveWindow (bottom-right) grounds the clip in the real
//     published page without competing with the deck.
// b2 232-435 "The system had no memory — every clip, it reached for its
//     favorite effect again, same day or the next." The single fan splits
//     into TWO piles, "TODAY" and "TOMORROW" — the archetype's "cards fly in
//     and stack" motif — each topped by the identical glowing favorite card.
//     A dashed line with a crossed-out brain links them. Exits sliding down
//     (non-crossfade) into b3.
// b3 444-579 "Now a Postgres column records exactly which effect played in
//     which video." Enters sliding up. The SAME 6-card fan from b1 returns;
//     each card gains a small record stamp and a growing ledger panel below
//     lists "beat -> effect" rows — the real jsonb column,
//     daily_video_drafts.motion_usage, tagged on the ledger. The ONE
//     tech-credibility caption of this clip — FilterChip "Postgres" with a
//     plain gloss underneath — sits beside the ledger.
// b4 588-761 "The code checks that history before picking, and enforces a
//     hard cap no prompt could guarantee." Same fan again: an arrow from the
//     ledger into the deck labeled "checked first", then the 4th and 5th
//     CardCounter.tsx cards (the ones past the cap) grey out under a red
//     capped stamp while the allowed 3 stay lit. Real mechanism names drawn
//     (no commit diff — see note below): visual-director.js,
//     daily-compilation.js.
// b5 770-880 "No effect can repeat more than three times in one video now."
//     Hand-inlined LogWindow (see note below) + the hero fact "3" + a check
//     badge. Holds at full opacity through frame 925, no fade-out, never
//     shows the feature's own page or the /features hub (gate 2).
//
// Non-crossfade transition: b2 -> b3, vertical slide via Group dy (Easing.
// in/out(Easing.cubic)) — same convention as other bright-v2 clips.
// Single tech-credibility caption: FilterChip "Postgres" in b3, plain gloss
// underneath, nowhere else in the clip.
// Real data only: of the three given commits for this feature, 73dc6687a70c
// ("digest-motion skill — 12 editorial motion effects chosen per beat") and
// 61027379de0 ("motion grammar v2 — 12 effects reworked, 11 new") both
// describe BUILDING/EXPANDING the effect catalog — neither commit message
// says what any of the 5 beats actually say (repetition despite the prompt,
// no cross-video memory, a Postgres column, a hard cap), so per the
// evidence-must-match-the-sentence rule neither is shown as a diff. The
// commit that actually matches b3/b4 (587a946, "cross-day motion memory +
// video-wide effect caps") has no verified recordable URL tonight, so it is
// drawn instead, using its own real file/column names: CardCounter.tsx,
// CompositionStrip.tsx, CopyCorrection.tsx (real effect files from the given
// commits), daily_video_drafts.motion_usage (the real jsonb column),
// visual-director.js, daily-compilation.js. The given day's "real log lines"
// are all unrelated clip-factory/wave-pipeline bookkeeping, so b5's
// LogWindow lines are built from this feature's own real facts instead
// (one effect used 5x, another 5x, a third 3x in one video; the fix; the
// result), per the no-noise rule.
// Emoji used (single codepoint only): 🔁 ⭐ 🧠 🚫 📋 🐘 ✅

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette, cardShadow } from "./bright-theme";
import {
  LightBg,
  Group,
  StatPill,
  FilterChip,
  FlowArrow,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine } from "./live-primitives";
import shotsFile from "./shots/p74.json";

const FADE = 9;

const B1_S = 15;
const B1_E = 223;
const B2_S = 232;
const B2_E = 435;
const B3_S = 444;
const B3_E = 579;
const B4_S = 588;
const B4_E = 761;
const B5_S = 770;
const END = 925;

const CARD_W = 150;
const CARD_H = 200;

/** The one deck: six beat-cards, five share the same effect, one differs. */
const FAN = [
  { x: 130, y: 285, rot: -14 },
  { x: 310, y: 255, rot: -8 },
  { x: 490, y: 240, rot: -2 },
  { x: 670, y: 240, rot: 4 },
  { x: 850, y: 255, rot: 10 },
  { x: 1030, y: 285, rot: 16 },
];
const CARD_EFFECT = ["CardCounter.tsx", "CardCounter.tsx", "CardCounter.tsx", "CardCounter.tsx", "CardCounter.tsx", "CopyCorrection.tsx"];
const CARD_ICON = ["🔁", "🔁", "🔁", "🔁", "🔁", "🔀"];

const ProductPlate: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 38, width: 560, opacity, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: P.ink, letterSpacing: 0.2 }}>
        Portfolio &amp; News Platform
      </div>
      <div style={{ fontSize: 12.5, color: P.muted, lineHeight: 1.4, marginTop: 4, maxWidth: 520 }}>
        My personal site and content pipeline: it collects tech news, writes
        trilingual feature stories about my own projects&apos; commits, and
        renders short narrated video
      </div>
    </div>
  );
};

const BeatLabel: React.FC<{ x: number; y: number; kicker: string; title: string; opacity: number }> = ({
  x,
  y,
  kicker,
  title,
  opacity,
}) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity }}>
      <div
        style={{
          fontFamily,
          fontSize: 14,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: P.accent,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {kicker}
      </div>
      <div style={{ fontFamily, fontSize: 28, fontWeight: 800, color: P.ink }}>{title}</div>
    </div>
  );
};

const CodeTag: React.FC<{ x: number; y: number; text: string; opacity: number }> = ({ x, y, text, opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "6px 12px",
        borderRadius: 8,
        background: P.chipBg,
        border: `1px solid ${P.border}`,
        fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
        fontSize: 14,
        fontWeight: 700,
        color: P.ink,
        opacity,
      }}
    >
      {text}
    </div>
  );
};

/** One beat-card of the deck. Always labeled. `tone` colors the border/icon; `capped` greys it out with a stamp. */
const Card: React.FC<{
  x: number;
  y: number;
  rot: number;
  idx: number;
  tone: "accent" | "danger" | "muted" | "success";
  opacity: number;
  capped?: boolean;
  stamp?: boolean;
}> = ({ x, y, rot, idx, tone, opacity, capped, stamp }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  const toneColor = tone === "danger" ? P.danger : tone === "success" ? P.success : tone === "muted" ? P.muted : P.accent;
  const toneBgCol = tone === "danger" ? P.dangerBg : tone === "success" ? P.successBg : tone === "muted" ? P.chipBg : P.accentBg;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 16,
        background: capped ? P.chipBg : P.card,
        border: `2px solid ${capped ? P.border : toneColor}`,
        boxShadow: cardShadow,
        transform: `rotate(${rot}deg)`,
        opacity: opacity * (capped ? 0.55 : 1),
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 10,
          padding: "3px 8px",
          borderRadius: 6,
          background: toneBgCol,
          fontSize: 11,
          fontWeight: 800,
          color: toneColor,
          letterSpacing: 0.5,
        }}
      >
        BEAT {idx + 1}
      </div>
      <div style={{ position: "absolute", left: 0, top: 54, width: CARD_W, textAlign: "center", fontSize: 40 }}>
        {CARD_ICON[idx]}
      </div>
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 128,
          width: CARD_W - 16,
          textAlign: "center",
          fontSize: 12,
          fontWeight: 700,
          color: P.ink,
          lineHeight: 1.25,
        }}
      >
        {CARD_EFFECT[idx]}
      </div>
      {stamp ? (
        <div style={{ position: "absolute", left: 10, top: 168, fontSize: 13, fontWeight: 800, color: P.success }}>
          📋 recorded
        </div>
      ) : null}
      {capped ? (
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 72,
            width: CARD_W - 8,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 900,
            color: P.danger,
            transform: "rotate(-10deg)",
            letterSpacing: 1,
          }}
        >
          🚫 capped
        </div>
      ) : null}
    </div>
  );
};

const LogWindowP74: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  const frame = useCurrentFrame();
  if (opacity <= 0.004) return null;
  const lines: LogLine[] = [
    { t: "before", text: "CardCounter.tsx used 5x in one video", tone: "danger" },
    { t: "before", text: "a second effect used 5x, a third 3x", tone: "danger" },
    { t: "fix", text: "daily_video_drafts.motion_usage (jsonb) added", tone: "accent" },
    { t: "fix", text: "visual-director.js reads last 3 videos first", tone: "accent" },
    { t: "rule", text: "max 3 uses of one effect, per video", tone: "accent" },
    { t: "result", text: "no effect repeats more than 3x now", tone: "success" },
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity }}>
      <div style={{ position: "absolute", left: 100, top: 56, fontFamily, fontSize: 14, color: P.muted, letterSpacing: 1 }}>
        Portfolio &amp; News Platform · daily video motion picker
      </div>
      <StatPill x={940} y={46} emoji="✅" text="repeats capped in code" tone="success" opacity={1} />
      <LogWindow
        title="visual-director · motion_usage"
        from={B5_S + 8}
        every={14}
        fontSize={21}
        win={{ x: 100, y: 130, w: 1080, h: 320 }}
        opacity={1}
        lines={lines}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 490,
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: seg(frame, B5_S + 50, B5_S + 50 + FADE),
        }}
      >
        <div style={{ fontFamily, fontSize: 72, fontWeight: 800, color: P.success }}>3</div>
        <div style={{ fontFamily, fontSize: 16, color: P.muted, lineHeight: 1.3, maxWidth: 240 }}>
          is the hard cap — no effect
          <br />
          can repeat past it, per video
        </div>
        <div style={{ fontFamily, fontSize: 22, fontWeight: 800, color: P.ink }}>same graphic 5x ⇄ capped at 3</div>
        <CheckBadge x={1120} y={-6} scale={0.9} opacity={1} size={60} />
      </div>
      <CaptionBand
        text="no effect can repeat more than three times in one video now"
        tone="success"
        opacity={seg(frame, B5_S + 70, B5_S + 70 + FADE)}
      />
    </div>
  );
};

const FrameInner: React.FC<{ b1: number; b2: number; b3: number; b4: number; b5: number }> = ({
  b1,
  b2,
  b3,
  b4,
  b5,
}) => {
  const frame = useCurrentFrame();
  const P = usePalette();

  const b2ExitY = interpolate(frame, [B2_E, B2_E + FADE], [0, 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const b3EnterY = interpolate(frame, [B3_S, B3_S + FADE], [-36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // b1: cards pop in one by one, left to right.
  const cardIn = (i: number, start: number) => seg(frame, start + i * 14, start + i * 14 + FADE);

  // b3: ledger rows (beat -> effect) appear one by one below the deck.
  const ledgerRow = (i: number) => seg(frame, B3_S + 70 + i * 16, B3_S + 70 + i * 16 + FADE);

  // b4: cards 3 and 4 (0-indexed) are past the cap and grey out.
  const capFrom = B4_S + 30;

  return (
    <AbsoluteFillLocal>
      <LightBg />

      {/* Beat 1: the fan, five identical cards, one different, a red 5x badge */}
      <Group opacity={b1}>
        <ProductPlate opacity={seg(frame, B1_S + 5, B1_S + 5 + FADE)} />
        <BeatLabel x={60} y={610} kicker="one episode" title="the same effect, five times in a row" opacity={1} />
        {FAN.map((c, i) => (
          <Card key={`f1-${i}`} x={c.x} y={c.y} rot={c.rot} idx={i} tone={i < 5 ? "danger" : "muted"} opacity={cardIn(i, B1_S + 20)} />
        ))}
        <StatPill x={470} y={170} emoji="🔁" text="CardCounter.tsx — 5x in a row" tone="danger" opacity={seg(frame, B1_S + 55, B1_S + 55 + FADE)} />
        <LiveWindow
          file={shotsFile as any}
          shot="page"
          title="vitalii.no/features/one-show-used…"
          from={B1_S + 70}
          hold={130}
          zoom={() => 1.05}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={seg(frame, B1_S + 70, B1_S + 70 + FADE)}
          win={{ x: 840, y: 480, w: 360, h: 220 }}
        />
        <CaptionBand
          text="one video repeated the same animated effect five times in a row, even though I kept telling it to vary things"
          tone="danger"
          opacity={seg(frame, B1_S + 95, B1_S + 95 + FADE)}
        />
      </Group>

      {/* Beat 2: two piles, today and tomorrow, both topped by the same favorite card */}
      <Group opacity={b2} dy={b2ExitY}>
        <BeatLabel x={60} y={610} kicker="no memory" title="the same favorite, day after day" opacity={1} />
        {["MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
          <div
            key={`daychip-${d}`}
            style={{
              position: "absolute",
              left: 170 + i * 165,
              top: 80,
              width: 130,
              padding: "8px 10px",
              borderRadius: 10,
              background: P.chipBg,
              border: `1.5px solid ${P.border}`,
              fontFamily,
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: seg(frame, B2_S + 5 + i * 6, B2_S + 5 + i * 6 + FADE),
            }}
          >
            <span style={{ fontSize: 16 }}>⭐</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>{d}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: P.danger }}>CardCounter.tsx</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 250, top: 150, fontFamily, fontSize: 15, fontWeight: 800, color: P.muted, letterSpacing: 2, opacity: seg(frame, B2_S + 5, B2_S + 5 + FADE) }}>
          TODAY
        </div>
        <div style={{ position: "absolute", left: 790, top: 150, fontFamily, fontSize: 15, fontWeight: 800, color: P.muted, letterSpacing: 2, opacity: seg(frame, B2_S + 5, B2_S + 5 + FADE) }}>
          TOMORROW
        </div>
        {[0, 1, 2].map((i) => (
          <React.Fragment key={`pile-${i}`}>
            <div
              style={{
                position: "absolute",
                left: 250 + i * 10,
                top: 230 + i * 10,
                width: 170,
                height: 190,
                borderRadius: 16,
                background: P.chipBg,
                border: `1.5px solid ${P.border}`,
                opacity: seg(frame, B2_S + 15 + i * 8, B2_S + 15 + i * 8 + FADE),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 790 + i * 10,
                top: 230 + i * 10,
                width: 170,
                height: 190,
                borderRadius: 16,
                background: P.chipBg,
                border: `1.5px solid ${P.border}`,
                opacity: seg(frame, B2_S + 15 + i * 8, B2_S + 15 + i * 8 + FADE),
              }}
            />
          </React.Fragment>
        ))}
        <div
          style={{
            position: "absolute",
            left: 250,
            top: 200,
            width: 170,
            height: 190,
            borderRadius: 18,
            background: P.card,
            border: `3px solid ${P.danger}`,
            boxShadow: `0 0 36px ${P.dangerEdge}`,
            opacity: seg(frame, B2_S + 60, B2_S + 60 + FADE),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
          }}
        >
          <div style={{ fontSize: 42 }}>⭐</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.danger, marginTop: 6 }}>CardCounter.tsx</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 790,
            top: 200,
            width: 170,
            height: 190,
            borderRadius: 18,
            background: P.card,
            border: `3px solid ${P.danger}`,
            boxShadow: `0 0 36px ${P.dangerEdge}`,
            opacity: seg(frame, B2_S + 75, B2_S + 75 + FADE),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
          }}
        >
          <div style={{ fontSize: 42 }}>⭐</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.danger, marginTop: 6 }}>CardCounter.tsx</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 430,
            top: 290,
            width: 350,
            height: 2,
            borderTop: `2px dashed ${P.border}`,
            opacity: seg(frame, B2_S + 95, B2_S + 95 + FADE),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 580,
            top: 268,
            fontSize: 26,
            opacity: seg(frame, B2_S + 100, B2_S + 100 + FADE),
          }}
        >
          🧠🚫
        </div>
        <StatPill x={470} y={470} emoji="🧠" text="no memory — same day or the next" tone="danger" opacity={seg(frame, B2_S + 65, B2_S + 65 + FADE)} />
        <CaptionBand
          text="the system had no memory — every clip, it reached for its favorite effect again, same day or the next"
          tone="danger"
          opacity={seg(frame, B2_S + 90, B2_S + 90 + FADE)}
        />
      </Group>

      {/* Beat 3: the deck returns, each card gets a record stamp, a ledger grows below */}
      <Group opacity={b3} dy={b3EnterY}>
        <BeatLabel x={60} y={610} kicker="the fix, part 1" title="every beat, now on the record" opacity={1} />
        {FAN.map((c, i) => (
          <Card key={`f3-${i}`} x={c.x} y={c.y} rot={c.rot} idx={i} tone={i < 5 ? "accent" : "muted"} opacity={seg(frame, B3_S + 10 + i * 10, B3_S + 10 + i * 10 + FADE)} stamp />
        ))}
        <CodeTag x={90} y={70} text="daily_video_drafts.motion_usage" opacity={seg(frame, B3_S + 80, B3_S + 80 + FADE)} />
        <FilterChip x={90} y={120} text="Postgres" icon="🐘" color={P.accent} opacity={seg(frame, B3_S + 95, B3_S + 95 + FADE)} />
        <div style={{ position: "absolute", left: 90, top: 158, fontFamily, fontSize: 13.5, color: P.muted, maxWidth: 240, lineHeight: 1.4, opacity: seg(frame, B3_S + 105, B3_S + 105 + FADE) }}>
          a database table column
        </div>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 500,
            width: 1100,
            height: 130,
            borderRadius: 14,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: cardShadow,
            opacity: seg(frame, B3_S + 60, B3_S + 60 + FADE),
            fontFamily,
            padding: "12px 20px",
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>LEDGER — beat → effect played</div>
          {FAN.map((_, i) => (
            <div key={`ledger-${i}`} style={{ display: "flex", gap: 14, fontSize: 13.5, marginTop: 6, opacity: ledgerRow(i) }}>
              <span style={{ color: P.muted, minWidth: 64 }}>beat {i + 1}</span>
              <span style={{ color: P.ink, fontWeight: 700 }}>{CARD_EFFECT[i]}</span>
            </div>
          ))}
        </div>
        <CaptionBand
          text="now a Postgres column records exactly which effect played in which video"
          opacity={seg(frame, B3_S + 125, B3_S + 125 + FADE)}
        />
      </Group>

      {/* Beat 4: the deck checks its own history, then the cap kicks in */}
      <Group opacity={b4}>
        <BeatLabel x={60} y={610} kicker="the fix, part 2" title="checked first, capped in code" opacity={1} />
        {FAN.map((c, i) => {
          const isCapped = i === 3 || i === 4;
          return (
            <Card
              key={`f4-${i}`}
              x={c.x}
              y={c.y}
              rot={c.rot}
              idx={i}
              tone={isCapped ? "muted" : i < 5 ? "success" : "muted"}
              opacity={b4 > 0.004 ? 1 : 0}
              capped={isCapped && seg(frame, capFrom + (i - 3) * 20, capFrom + (i - 3) * 20 + FADE) > 0.5}
            />
          );
        })}
        <FlowArrow x={210} y={500} len={880} color={P.accent} progress={seg(frame, B4_S + 15, B4_S + 60)} opacity={seg(frame, B4_S + 15, B4_S + 15 + FADE)} />
        <div style={{ position: "absolute", left: 90, top: 470, fontFamily, fontSize: 13, fontWeight: 800, color: P.accent, opacity: seg(frame, B4_S + 20, B4_S + 20 + FADE) }}>
          checked first
        </div>
        <CodeTag x={90} y={70} text="visual-director.js" opacity={seg(frame, B4_S + 20, B4_S + 20 + FADE)} />
        <CodeTag x={300} y={70} text="daily-compilation.js" opacity={seg(frame, B4_S + 28, B4_S + 28 + FADE)} />
        <StatPill x={700} y={70} emoji="🚫" text="cap: 3 uses of one effect, per video" tone="danger" opacity={seg(frame, B4_S + 45, B4_S + 45 + FADE)} />
        <StatPill x={700} y={130} emoji="✅" text="3 unique effects kept per video" tone="success" opacity={seg(frame, B4_S + 60, B4_S + 60 + FADE)} />
        <CaptionBand
          text="the code checks that history before picking, and enforces a hard cap no prompt could guarantee"
          opacity={seg(frame, B4_S + 70, B4_S + 70 + FADE)}
        />
      </Group>

      {/* Beat 5: hand-inlined LogWindow, holds to END, no fade-out */}
      <LogWindowP74 opacity={b5} />
    </AbsoluteFillLocal>
  );
};

const AbsoluteFillLocal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, overflow: "hidden" }}>{children}</div>
);

export const FeatureOneShowUsedSameP74: React.FC = () => {
  const frame = useCurrentFrame();

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE);

  return (
    <PaletteProvider value={MOODS.dawn}>
      <FrameInner b1={b1} b2={b2} b3={b3} b4={b4} b5={b5} />
    </PaletteProvider>
  );
};
