/**
 * FeatureMiniVitaliiNoUpgradesM22 — feature m22 — 1280x720, 930 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 3 card deck, mood violet (handed down by the orchestrating session —
 * not re-drawn here, out/lux-archetypes.md is not touched by this file).
 *
 * A deck of 6 narration-clip cards is the ONE object alive for the whole clip.
 * It starts as a messy pile (all cards tagged "robotic"), flies apart into a
 * 3x2 grid, then two cards in that grid change state as the story runs:
 *   pile (frame < ~174)         — all 6 cards: 🤖 robotic, same every time
 *   fan-out (b2)                — all 6 cards: 🎙️ Chirp 3 · Kore/Charon
 *   quota warning (b3)         — cards 5+6 amber: ⚠ low quota
 *   stand-in swap (b4)          — cards 5+6 dip off and rise back: 🎭 stand-in
 *   result (b5, holds to 930)   — 4 green + 2 amber-but-checked, deck settled
 *
 * Beats, measured from the Chirp-3 narration build (do not hand-tune without
 * rebuilding audio):
 *   b1  15-165  "A robotic voice reading your lesson breaks the mood before
 *                the lesson even starts."                    — product plate + LiveWindow(hub)
 *   b2 174-409  "mini.vitalii.no's Norwegian narration now runs on Google's
 *                Chirp 3 voices, closer to a real newsreader." — deck fans out, commit chip
 *   b3 418-497  "But free voice quotas run dry some months."  — quota gauge, 2 cards amber
 *   b4 506-753  "So instead of failing, a busy month just quietly drops that
 *                clip back to the older voice, like a stand-in stepping onto
 *                the stage."                                  — stand-in swap + LogWindow
 *   b5 762-885  "The good voice plays by default, and a rough month never
 *                means dead air." (holds to 930)               — deck settled, drawn result
 *
 * Only one public URL is used (the features hub, beat1 only — never the last
 * beat, Gate 2). The feature's own page exists as a verified URL tonight too
 * but is not recorded: the deck itself carries beats 2-5, and a second live
 * window would compete with it for the frame (Gate 1 — the deck must dominate).
 * No verified repo URL this time, so the one matching commit (af3f5c4) is
 * shown as a drawn hash chip, never a recorded GitHub page.
 *
 * Single tech name on screen: "Chirp 3" only (already spoken in the narration
 * audio at b2). The fallback engine is never named — "the older voice" /
 * "previous voice" / "stand-in" stands in for it on purpose.
 */
import React from "react";
import { useCurrentFrame, interpolate, interpolateColors } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, Panel, StatPill, CheckBadge, CaptionBand, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shots from "./shots/m22.json";

const P = MOODS.violet;
const HUB_SHOT = "hub";

const BEATS = {
  b1: [15, 165],
  b2: [174, 409],
  b3: [418, 497],
  b4: [506, 753],
  b5: [762, 885],
} as const;

const CARD_W = 188;
const CARD_H = 212;
const GX = (col: number) => 316 + col * 230;
const GY = (row: number) => 132 + row * 245;
const PILE_X = (i: number) => 546 + (i - 2.5) * 24;
const PILE_Y = (i: number) => 254 + (i - 2.5) * 18;
const PILE_ROT = (i: number) => -22 + i * 8;

const SWAP_START = (i: number) => 540 + (i - 4) * 90; // only meaningful for i = 4, 5

type CardLabel = { icon: string; main: string; sub: string };

export const FeatureMiniVitaliiNoUpgradesM22: React.FC = () => {
  const frame = useCurrentFrame();

  /** A beat that fades in after its window opens and is fully gone before it closes. */
  const zone = (name: keyof typeof BEATS) => {
    const [s, e] = BEATS[name];
    return Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));
  };

  const b1 = zone("b1");
  const b2 = zone("b2");
  const b3 = zone("b3");
  const b4 = zone("b4");
  // The last beat has nothing to hand over to — it holds through the tail.
  const b5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);

  // Beat 4's caption/log group slides up instead of crossfading — the one
  // non-crossfade beat transition.
  const b4dy = (1 - seg(frame, 506, 532)) * 26;

  // ── The deck world: one shrink+shift while the LogWindow explains the fallback ──
  const logPhase = Math.min(seg(frame, 590, 625), 1 - seg(frame, 715, 748));
  const deckShift = logPhase * -150;
  const deckScale = 1 - logPhase * 0.16;
  // Beats 2-3 show the grid alone against empty margins — blow it up around its
  // own center while nothing else is happening, back to 1 well before beat 4's
  // shrink (590) or the swap dip (SWAP_START) ever begin.
  const gridBoost = interpolate(frame, [178, 205, 480, 505], [1, 1.3, 1.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const baseBg = interpolateColors(frame, [165, 185], [P.dangerBg, P.successBg]);
  const baseEdge = interpolateColors(frame, [165, 185], [P.dangerEdge, P.successEdge]);
  const baseText = interpolateColors(frame, [165, 185], [P.danger, P.success]);
  const warnBg = interpolateColors(frame, [424, 468], [P.successBg, P.noteBg]);
  const warnEdge = interpolateColors(frame, [424, 468], [P.successEdge, P.noteBorder]);
  const warnText = interpolateColors(frame, [424, 468], [P.success, P.amber]);

  const cardLabel = (i: number): CardLabel => {
    if (frame < 174) return { icon: "🤖", main: "robotic", sub: "same every time" };
    if (i < 4 || frame < 424) return { icon: "🎙️", main: "Chirp 3", sub: i % 2 === 0 ? "Kore" : "Charon" };
    const swapStart = SWAP_START(i);
    if (frame < swapStart + 35) return { icon: "🎙️", main: "Chirp 3", sub: "low quota ⚠" };
    return { icon: "🎭", main: "stand-in", sub: "previous voice" };
  };

  const cards = Array.from({ length: 6 }, (_, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const t = seg(frame, 178 + i * 8, 224 + i * 8);
    const x = PILE_X(i) + (GX(col) - PILE_X(i)) * t;
    const y = PILE_Y(i) + (GY(row) - PILE_Y(i)) * t;
    const rot = PILE_ROT(i) * (1 - t);

    const affected = i === 4 || i === 5;
    const swapStart = SWAP_START(i);
    const swapT = affected ? seg(frame, swapStart, swapStart + 70) : 0;
    const dipY = affected ? Math.sin(Math.min(Math.max(swapT, 0), 1) * Math.PI) * 90 : 0;
    const dipScale = affected ? 1 - 0.06 * Math.sin(Math.min(Math.max(swapT, 0), 1) * Math.PI) : 1;
    // While a card is still in the pile (t<1) it reads bigger — the deck is the
    // archetype's object and must dominate beat 1's frame. Fades to 1 by the
    // time it lands in the grid, so beats 2-5 are untouched.
    const pileBoost = 1 + 0.3 * (1 - t);

    const bg = affected && frame >= 424 ? warnBg : baseBg;
    const edge = affected && frame >= 424 ? warnEdge : baseEdge;
    const text = affected && frame >= 424 ? warnText : baseText;
    const label = cardLabel(i);
    const checkOn = affected ? seg(frame, 770, 792) : 0;

    return { i, x, y: y + dipY, rot, scale: dipScale * pileBoost, bg, edge, text, label, checkOn };
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Persistent top-right wordmark — never fades, keeps the top row filled ════ */}
        <div
          style={{
            position: "absolute",
            left: 970,
            top: 32,
            width: 270,
            textAlign: "right",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: 1.8,
            color: P.muted,
            opacity: 0.85,
          }}
        >
          🎧 MINI ELVARIKA
        </div>

        {/* ════ THE DECK — archetype 3, alive for the whole clip ════ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateX(${deckShift}px) scale(${deckScale * gridBoost})`,
            transformOrigin: "640px 360px",
          }}
        >
          {cards.map((c) => (
            <div
              key={c.i}
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 18,
                background: c.bg,
                border: `2px solid ${c.edge}`,
                boxShadow: "0 10px 30px rgba(22,35,63,0.14)",
                transform: `rotate(${c.rot}deg) scale(${c.scale})`,
                fontFamily,
              }}
            >
              <div style={{ padding: "20px 18px" }}>
                <div style={{ fontSize: 40 }}>{c.label.icon}</div>
                <div style={{ fontSize: 21, fontWeight: 800, color: c.text, marginTop: 12 }}>{c.label.main}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4 }}>{c.label.sub}</div>
              </div>
              <CheckBadge x={CARD_W - 34} y={-10} scale={Math.min(1, c.checkOn)} opacity={Math.min(1, c.checkOn)} size={30} />
            </div>
          ))}
        </div>

        {/* ════ Beat 1 — product plate + the real features hub, deck still a pile ════ */}
        <Group opacity={b1}>
          <Panel x={40} y={30} w={320} h={116} tone="card" opacity={1}>
            <div style={{ padding: "16px 20px", fontFamily }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Mini Elvarika</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: P.accent, marginTop: 2 }}>Norwegian by Ear</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: P.muted, marginTop: 6, lineHeight: 1.35 }}>
                A personal listening app — pick a word or topic, get a narrated lesson
              </div>
            </div>
          </Panel>
          <LiveWindow
            file={shots as any}
            shot={HUB_SHOT}
            title="vitalii.no/features"
            from={40}
            hold={100}
            zoom={(t) => 1 + 0.1 * t}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={1}
            win={{ x: 800, y: 340, w: 440, h: 310 }}
          />
          <StatPill x={64} y={168} emoji="🤖" text="same robotic voice, every lesson" tone="danger" fontSize={16} opacity={seg(frame, 40, 62)} />
          <CaptionBand y={664} text="A robotic voice broke the mood before the lesson even started" tone="card" fontSize={20} opacity={seg(frame, 60, 82)} />
        </Group>

        {/* ════ Beat 2 — the deck fans out, Chirp 3 badges, drawn commit evidence ════ */}
        <Group opacity={b2}>
          <StatPill x={64} y={40} emoji="🔊" text="Chirp 3 voices" tone="accent" fontSize={17} opacity={seg(frame, 210, 232)} />
          <div
            style={{
              position: "absolute",
              left: 64,
              top: 96,
              padding: "9px 16px",
              borderRadius: 10,
              background: P.chipBg,
              border: `1px solid ${P.border}`,
              fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
              fontSize: 14.5,
              color: P.muted,
              opacity: seg(frame, 236, 258),
            }}
          >
            af3f5c4 · Chirp 3 HD voices (Kore/Charon)
          </div>
          <CaptionBand y={664} text="Norwegian narration now runs on Google's Chirp 3 voices" tone="card" fontSize={20} opacity={seg(frame, 268, 290)} />
        </Group>

        {/* ════ Beat 3 — the quota gauge draining, two cards already amber ════ */}
        <Group opacity={b3}>
          <Panel x={340} y={40} w={600} h={72} tone="note" opacity={1}>
            <div style={{ padding: "12px 22px", fontFamily }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: P.muted, letterSpacing: 0.6 }}>FREE VOICE QUOTA THIS MONTH</div>
              <div style={{ position: "relative", width: 556, height: 12, borderRadius: 6, background: "#EDE3C8", marginTop: 8 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: 12,
                    borderRadius: 6,
                    background: P.amber,
                    width: Math.max(18, 556 - Math.min(1, seg(frame, 424, 476)) * 470),
                  }}
                />
              </div>
            </div>
          </Panel>
          <CaptionBand y={664} text="But free voice quotas run dry some months" tone="card" fontSize={20} opacity={seg(frame, 430, 452)} />
        </Group>

        {/* ════ Beat 4 — the stand-in swap, explained by a drawn log of the fallback ════ */}
        <Group opacity={b4} dy={b4dy}>
          <Group opacity={logPhase}>
            <LogWindow
              title="mini-elvarika-runner"
              lines={[
                { text: "Chirp 3 quota check…", tone: "muted" },
                { text: "month limit reached", tone: "danger" },
                { text: "fallback → previous voice engine", tone: "accent" },
                { text: "clip rendered anyway", tone: "success" },
                { text: "no failure, no dead air", tone: "success" },
              ]}
              from={628}
              every={20}
              opacity={1}
              win={{ x: 900, y: 150, w: 340, h: 380 }}
              fontSize={17}
            />
          </Group>
          <CaptionBand y={664} text="A busy month drops that clip to the older voice, like a stand-in stepping on stage" tone="card" fontSize={20} opacity={seg(frame, 560, 582)} />
        </Group>

        {/* ════ Beat 5 — deck settled: 4 green, 2 amber-but-checked, holds to the end ════ */}
        <Group opacity={b5}>
          <CaptionBand y={664} text="The good voice plays by default — a rough month never means dead air" tone="card" fontSize={20} opacity={seg(frame, 800, 822)} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
