/**
 * FeatureGrammarDrillsTeachWordsM24 — feature m24 — 1280x720, 938 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 3 card deck, mood sand (handed down by the orchestrating session —
 * not re-drawn here, out/lux-archetypes.md is not touched by this file).
 *
 * A deck of 5 cards is the ONE object alive for the whole clip. Its 5 slots
 * map onto the real 5-step explanation the feature speaks (why → form →
 * mistake → contrast → summary), so the deck itself IS the mechanism:
 *   pile (b1)            — 5 cards, random textbook chapters, no two alike
 *   still piled (b2)      — relabeled "answer shown" — rule then answer, no gap
 *   fan-out grid (b3)      — relabeled into the 5 real steps, Claude commit chip
 *   spotlight (b4)         — steps 3+4 (mistake/contrast) ring-highlighted while
 *                            a drawn pause gauge counts the real 2.5s + 45ms/char
 *   settled (b5, to 938)   — all 5 steps checked green, LogWindow of real numbers
 *
 * Beats, measured from the voiceover build (do not hand-tune without rebuilding
 * audio):
 *   b1  15-172  "The grammar lesson never matched what I'd just heard - it just
 *                came from wherever the textbook was."       — product plate + LiveWindow(page)
 *   b2 181-374  "Worse, it explained the rule, then jumped to a question - I'd
 *                end up reading the answer, not recalling it." — Q/A-with-no-gap demo
 *   b3 383-516  "Now Claude builds the grammar break from the exact sentences I
 *                just heard."                                  — deck fans into 5 real steps, commit chip
 *   b4 525-718  "It names my actual mistake out loud, contrasts it with the
 *                right form, then pauses before the answer plays." — mistake/contrast + pause gauge
 *   b5 727-893  "That pause is a real 2.5 seconds - long enough to actually try
 *                to remember." (holds to 938)                  — deck settled + LogWindow
 *
 * Verified public URLs tonight: the feature's own page (beat1's LiveWindow) and
 * the features hub (not recorded — the deck must dominate the frame, same call
 * as the archetype-3 precedent). No repo/GitHub URL is verified tonight, so the
 * one commit whose message matches a beat (fd1c39b, matches beat3 exactly) is
 * drawn as a static hash chip, never a recorded GitHub page. e65653b (voice)
 * and 36252e3 (word mode, belongs to m25) match no m24 beat and are not shown.
 *
 * Single tech name on screen: "Claude" only (already spoken in the narration
 * audio at b3), with one plain-English gloss.
 */
import React from "react";
import { useCurrentFrame, interpolateColors } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, Panel, StatPill, CheckBadge, CaptionBand, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shots from "./shots/m24.json";

const P = MOODS.sand;
const PAGE_SHOT = "page";

const BEATS = {
  b1: [15, 172],
  b2: [181, 374],
  b3: [383, 516],
  b4: [525, 718],
  b5: [727, 893],
} as const;

const CARD_W = 190;
const CARD_H = 196;
const GX = (i: number) => 65 + i * 240;
const GY = 290;
const PILE_X = (i: number) => 640 + (i - 2) * 22;
const PILE_Y = (i: number) => 330 + (i - 2) * 16;
const PILE_ROT = (i: number) => -20 + i * 10;

type CardLabel = { icon: string; main: string; sub: string };

const PILE_LABELS: CardLabel[] = [
  { icon: "📖", main: "Ch. 7", sub: "random rule" },
  { icon: "📖", main: "Ch. 2", sub: "random rule" },
  { icon: "📖", main: "Ch. 9", sub: "random rule" },
  { icon: "📖", main: "Ch. 4", sub: "random rule" },
  { icon: "📖", main: "Ch. 11", sub: "random rule" },
];

const STEP_LABELS: CardLabel[] = [
  { icon: "🤔", main: "Step 1", sub: "why" },
  { icon: "🔤", main: "Step 2", sub: "form" },
  { icon: "❌", main: "Step 3", sub: "your mistake" },
  { icon: "🔁", main: "Step 4", sub: "right form" },
  { icon: "✅", main: "Step 5", sub: "summary" },
];

export const FeatureGrammarDrillsTeachWordsM24: React.FC = () => {
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

  // Beat 4's demo slides up instead of crossfading — the one non-crossfade
  // beat transition.
  const b4dy = (1 - seg(frame, 525, 551)) * 26;

  // Beat 5 permanently shifts the deck aside to make room for the LogWindow —
  // rises once and stays (the beat holds to the end, nothing reverts).
  const logPhase = seg(frame, 760, 800);
  const deckShift = logPhase * -150;
  const deckScale = 1 - logPhase * 0.14;

  const baseBg = interpolateColors(frame, [374, 400, 727, 760], [P.dangerBg, P.accentBg, P.accentBg, P.successBg]);
  const baseEdge = interpolateColors(frame, [374, 400, 727, 760], [P.dangerEdge, P.accentEdge, P.accentEdge, P.successEdge]);
  const baseText = interpolateColors(frame, [374, 400, 727, 760], [P.danger, P.accent, P.accent, P.success]);

  const cardLabel = (i: number): CardLabel => {
    if (frame < 181) return PILE_LABELS[i];
    if (frame < 383) return { icon: "👀", main: "answer shown", sub: "reading, not recalling" };
    return STEP_LABELS[i];
  };

  const cards = Array.from({ length: 5 }, (_, i) => {
    const t = seg(frame, 188 + i * 8, 234 + i * 8);
    const x = PILE_X(i) + (GX(i) - PILE_X(i)) * t;
    const y = PILE_Y(i) + (GY - PILE_Y(i)) * t;
    const rot = PILE_ROT(i) * (1 - t);
    // While still in the pile it reads bigger — the deck is the archetype's
    // object and must dominate beat 1's frame.
    const pileBoost = 1 + 0.3 * (1 - t);

    // Beat 4 spotlights the two steps it is actually demonstrating.
    const spotlighted = i === 2 || i === 3;
    const highlight = spotlighted ? Math.min(1, seg(frame, 525, 551)) * (1 - seg(frame, 705, 718)) : 0;

    const checkOn = frame >= 727 ? seg(frame, 745, 777) : 0;
    const label = cardLabel(i);

    return {
      i,
      x,
      y,
      rot,
      scale: pileBoost * (1 + 0.1 * highlight),
      highlight,
      label,
      checkOn,
    };
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Persistent brand block — never fades ════ */}
        <div style={{ position: "absolute", left: 900, top: 14, width: 340, textAlign: "right" }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1.8, color: P.muted, opacity: 0.85 }}>
            🎧 MINI ELVARIKA
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: P.accent, opacity: 0.8, marginTop: 2 }}>
            Grammar drills, from what you heard
          </div>
        </div>

        {/* ════ THE DECK — archetype 3, alive for the whole clip ════ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateX(${deckShift}px) scale(${deckScale})`,
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
                background: baseBg,
                border: `2px solid ${baseEdge}`,
                boxShadow: c.highlight > 0.01 ? `0 0 0 4px ${P.amber}66, 0 10px 30px rgba(22,35,63,0.14)` : "0 10px 30px rgba(22,35,63,0.14)",
                transform: `rotate(${c.rot}deg) scale(${c.scale})`,
                fontFamily,
              }}
            >
              <div style={{ padding: "18px 18px" }}>
                <div style={{ fontSize: 38 }}>{c.label.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: baseText, marginTop: 10 }}>{c.label.main}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 4 }}>{c.label.sub}</div>
              </div>
              <CheckBadge x={CARD_W - 34} y={-10} scale={Math.min(1, c.checkOn)} opacity={Math.min(1, c.checkOn)} size={30} />
            </div>
          ))}
        </div>

        {/* ════ Beat 1 — product plate + the real feature page, deck still a pile ════ */}
        <Group opacity={b1}>
          <Panel x={40} y={30} w={340} h={150} tone="card" opacity={1}>
            <div style={{ padding: "16px 20px", fontFamily }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Mini Elvarika</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: P.accent, marginTop: 2 }}>Norwegian by Ear</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: P.muted, marginTop: 6, lineHeight: 1.35 }}>
                A personal listening app — pick a word or topic, get a narrated lesson
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  fontStyle: "italic",
                  color: P.ink,
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: `1px solid ${P.border}`,
                }}
              >
                📖 grammar lesson: "Ch. 9 — the passive voice" — never what you just heard
              </div>
            </div>
          </Panel>
          <LiveWindow
            file={shots as any}
            shot={PAGE_SHOT}
            title="vitalii.no/features"
            from={45}
            hold={100}
            zoom={(t) => 1 + 0.1 * t}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={1}
            win={{ x: 800, y: 340, w: 440, h: 310 }}
          />
          <StatPill x={64} y={198} emoji="📖" text="wherever the textbook was" tone="danger" fontSize={16} opacity={seg(frame, 45, 67)} />
          <CaptionBand y={664} text="The grammar lesson never matched what I'd just heard" tone="card" fontSize={20} opacity={seg(frame, 62, 84)} />
        </Group>

        {/* ════ Beat 2 — rule then answer, no gap between them ════ */}
        <Group opacity={b2}>
          <Panel x={64} y={40} w={560} h={140} tone="danger" opacity={1}>
            <div style={{ padding: "16px 24px", fontFamily }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.8, color: P.muted }}>RULE EXPLAINED</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
                <div style={{ fontSize: 19, fontWeight: 700, color: P.ink }}>Q: Er du sulten?</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: P.muted }}>→</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: P.ink }}>A: Ja, jeg er sulten.</div>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: P.danger, marginTop: 10 }}>
                no pause — you just read it
              </div>
            </div>
          </Panel>
          <StatPill x={64} y={198} emoji="👀" text="reading the answer, not recalling it" tone="danger" fontSize={16} opacity={seg(frame, 208, 230)} />
          <CaptionBand y={664} text="It explained the rule, then jumped to a question" tone="card" fontSize={20} opacity={seg(frame, 260, 282)} />
        </Group>

        {/* ════ Beat 3 — the deck fans into the 5 real steps, drawn commit evidence ════ */}
        <Group opacity={b3}>
          <StatPill x={64} y={40} emoji="📚" text="48 sentences just heard" tone="accent" fontSize={17} opacity={seg(frame, 395, 417)} />
          <div
            style={{
              position: "absolute",
              left: 64,
              top: 78,
              fontSize: 13,
              fontWeight: 600,
              color: P.muted,
              maxWidth: 460,
              lineHeight: 1.3,
              opacity: seg(frame, 405, 427),
            }}
          >
            Claude = the AI that writes each explanation
          </div>
          <div
            style={{
              position: "absolute",
              left: 64,
              top: 112,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.8,
              color: P.muted,
              opacity: seg(frame, 421, 443),
            }}
          >
            THE ACTUAL CODE CHANGE
          </div>
          <div
            style={{
              position: "absolute",
              left: 64,
              top: 130,
              padding: "9px 16px",
              borderRadius: 10,
              background: P.chipBg,
              border: `1px solid ${P.border}`,
              fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
              fontSize: 14.5,
              color: P.muted,
              opacity: seg(frame, 421, 443),
            }}
          >
            fd1c39b · teacher-style grammar tied to words heard
          </div>
          <CaptionBand y={664} text="Now Claude builds the grammar break from the exact sentences I just heard" tone="card" fontSize={20} opacity={seg(frame, 460, 482)} />
        </Group>

        {/* ════ Beat 4 — mistake vs right form, then the real pause before the answer plays ════ */}
        <Group opacity={b4} dy={b4dy}>
          <Panel x={310} y={110} w={660} h={170} tone="card" opacity={1}>
            <div style={{ padding: "18px 26px", fontFamily }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: P.muted, letterSpacing: 0.6 }}>YOUR ANSWER → THE RIGHT FORM</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: P.danger, marginTop: 10, textDecoration: "line-through" }}>
                ❌ jeg kjøper huset i går
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: P.success, marginTop: 8 }}>
                ✅ jeg kjøpte huset i går
              </div>
            </div>
          </Panel>
          <Panel x={310} y={300} w={660} h={94} tone="note" opacity={1}>
            <div style={{ padding: "14px 24px", fontFamily }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.muted, letterSpacing: 0.5 }}>
                ⏳ 2.5s + 45ms × letters — before the answer plays
              </div>
              <div style={{ position: "relative", width: 600, height: 12, borderRadius: 6, background: "#EDE3C8", marginTop: 10 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: 12,
                    borderRadius: 6,
                    background: P.amber,
                    width: Math.max(10, 600 - Math.min(1, seg(frame, 560, 643)) * 590),
                  }}
                />
              </div>
            </div>
          </Panel>
          <StatPill x={64} y={40} emoji="🔊" text="answer plays" tone="success" fontSize={17} opacity={seg(frame, 643, 665)} />
          <CaptionBand y={664} text="It names the mistake, contrasts it with the right form, then pauses before the answer plays" tone="card" fontSize={20} opacity={seg(frame, 668, 690)} />
        </Group>

        {/* ════ Beat 5 — deck settled, all 5 steps checked, holds to the end ════ */}
        <Group opacity={b5}>
          <StatPill x={64} y={40} emoji="🎓" text="B2/C1 nuance drills too" tone="success" fontSize={17} opacity={seg(frame, 745, 767)} />
          <Group opacity={logPhase}>
            <LogWindow
              title="mini-elvarika: grammar_block()"
              lines={[
                { text: "grammar_block(): last 48 sentences", tone: "muted" },
                { text: "kind = 'heard'", tone: "accent" },
                { text: "why -> form -> mistake -> contrast -> summary", tone: "ink" },
                { text: "pause = 2.5s + 45ms x chars", tone: "accent" },
                { text: "'kjopte' -> wait 2.77s", tone: "muted" },
                { text: "play answer audio", tone: "success" },
              ]}
              from={800}
              every={20}
              opacity={1}
              win={{ x: 800, y: 130, w: 420, h: 420 }}
              fontSize={20}
            />
          </Group>
          <CaptionBand y={664} text="That pause is a real 2.5 seconds — long enough to actually try to remember" tone="card" fontSize={20} opacity={seg(frame, 780, 802)} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
