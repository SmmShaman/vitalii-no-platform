/**
 * FeatureQuestionMarkWasBlinkingB56 — feature b56 — 1280x720, 948 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 5 "ledger" / mood "sand" (pre-assigned, see out/lux-archetypes.md — not
 * redrawn here). The whole frame is a receipt-style ledger of Gordiy's four task-card
 * types (letter recognition, number, handwriting, pairing). The ledger panel and its
 * four row labels persist through every beat; only each row's VALUE column changes —
 * from a neutral "— — —" (wordless by design), to a blinking ❓ status on the header,
 * to a real bokmål + Ukrainian instruction line per row, to a final checked-off total.
 * At beat 5 a small "view page" badge grows into a live recording of the feature's own
 * vitalii.no page — a non-crossfade morph transition, same device as the flow-map clips.
 *
 * Beats (voice-synced, do not shift):
 *  b1  15-199  "My son can't read yet, so his tasks are pictures and letters — no words,
 *               on purpose." — ledger rows sit at their neutral "— — —" state; a small
 *               tag introduces Gordiy.
 *  b2 208-371  "But one card still blinked a question mark, with no way to know what to
 *               do without me right there." — the ledger header status badge blinks a
 *               red ❓; a matching callout sits in the empty right-hand slot.
 *  b3 380-562  "So each card now writes its own instruction — one line in Norwegian, one
 *               in Ukrainian." — the four rows reveal their real bilingual lines one at a
 *               time; the header badge turns green; the one tech caption appears.
 *  b4 571-731  "A parent or older sibling reads it aloud; he still can't read a single
 *               word himself." — a small vignette in the right-hand slot: an adult reads
 *               a row aloud, the child still can't decode it himself.
 *  b5 740-903  "Every card, letter, number, or handwriting — now speaks in two
 *               languages." — the ledger total settles on the real count (4 card types ×
 *               2 languages = 8 instruction lines); a small badge grows into a LiveWindow
 *               of the feature's own page. Holds to 948, no fade-out.
 *
 * Single tech-credibility caption: "earlyTasks() · both(no, uk)" (appears with beat 3,
 * stays through the rest of the clip). Emoji all single-codepoint (🧒🧑🔤🔢📝🧩❓✅🔊🔍),
 * no ZWJ.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LightBg, Panel, FilterChip, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shotsFile from "./shots/b56.json";

const B1_S = 15, B1_E = 199;
const B2_S = 208, B2_E = 371;
const B3_S = 380, B3_E = 562;
const B4_S = 571, B4_E = 731;
const B5_S = 740, B5_E = 903;
const END = 948;
const FADE = 9;

const LEDGER: Win = { x: 50, y: 150, w: 610, h: 460 };
const RIGHT: Win = { x: 700, y: 150, w: 500, h: 460 };

const ROW3_STARTS = [B3_S + 10, B3_S + 56, B3_S + 102, B3_S + 148];
const ROW_FADE = 22;

const ROWS = [
  {
    emoji: "🔤",
    label: "Letter recognition",
    no: "Hvilken bokstav begynner alle tre på?",
    ua: "На яку букву починаються всі три?",
  },
  {
    emoji: "🔢",
    label: "Number",
    no: "Hvor mange gjenstander teller du her?",
    ua: "Скільки предметів ти тут рахуєш?",
  },
  {
    emoji: "📝",
    label: "Handwriting",
    no: "Se hvordan ordet skrives for hånd",
    ua: "Дивись, як слово пишеться від руки",
  },
  {
    emoji: "🧩",
    label: "Pairing",
    no: "Hvilke to kort hører sammen?",
    ua: "Які дві картки пасують разом?",
  },
];

const BeatLabel: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => {
  const B = usePalette();
  return (
    <div style={{ position: "absolute", left: 70, top: 26, width: 640, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: B.accent, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontSize: 27, fontWeight: 750, color: B.ink, marginTop: 6, lineHeight: 1.25 }}>{title}</div>
    </div>
  );
};

const LedgerRow: React.FC<{
  emoji: string;
  label: string;
  no: string;
  ua: string;
  filled: number; // 0 = neutral, 1 = fully revealed (monotonic)
  blinkQ: boolean; // this row shows the blinking-question-mark state
  blink: boolean; // current blink phase
  done: boolean; // beat 5: checked-off styling
}> = ({ emoji, label, no, ua, filled, blinkQ, blink, done }) => {
  const B = usePalette();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "9px 0",
        borderBottom: `1.5px dashed ${B.border}`,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 24, width: 32 }}>{emoji}</div>
      <div style={{ width: 150, fontSize: 15, fontWeight: 700, color: B.ink }}>{label}</div>
      <div style={{ flex: 1 }} />
      <div style={{ width: 320, textAlign: "right" }}>
        {filled < 0.5 ? (
          blinkQ ? (
            <div style={{ fontSize: 20, fontWeight: 800, color: B.danger, opacity: blink ? 1 : 0.2 }}>
              ❓ NO INSTRUCTION
            </div>
          ) : (
            <div style={{ fontSize: 17, fontWeight: 700, color: B.muted }}>— — —</div>
          )
        ) : (
          <div style={{ opacity: filled }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.ink }}>
              {done ? "✅ " : ""}NO: {no}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginTop: 2 }}>UA: {ua}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const FeatureQuestionMarkWasBlinkingB56: React.FC = () => {
  const frame = useCurrentFrame();
  const B = MOODS.sand;

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE);

  const blink = Math.floor((frame - B2_S) / 10) % 2 === 0;
  const headerPhase: "idle" | "gap" | "fixed" = frame < B2_S ? "idle" : frame < B3_S ? "gap" : "fixed";

  const rowFilled = ROW3_STARTS.map((s) => seg(frame, s, s + ROW_FADE));
  const done = frame >= B5_S;

  const captionOpacity = seg(frame, B3_S + 10, B3_S + 10 + FADE);

  // beat 4 -> 5: a small "view page" badge grows into the full LiveWindow (non-crossfade)
  const growT = interpolate(frame, [B5_S, B5_S + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const BADGE_R = 40;
  const badgeCx = LEDGER.x + LEDGER.w - BADGE_R;
  const badgeCy = LEDGER.y + LEDGER.h - BADGE_R;
  const morphX = interpolate(growT, [0, 1], [badgeCx - BADGE_R, RIGHT.x]);
  const morphY = interpolate(growT, [0, 1], [badgeCy - BADGE_R, RIGHT.y]);
  const morphW = interpolate(growT, [0, 1], [BADGE_R * 2, RIGHT.w]);
  const morphH = interpolate(growT, [0, 1], [BADGE_R * 2, RIGHT.h]);

  const totalCount = Math.floor(
    interpolate(frame, [B5_S + 10, B5_S + 70], [0, 8], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

  return (
    <PaletteProvider value={MOODS.sand}>
      <LightBg />

      {/* ---------------- persistent ledger (all beats) ---------------- */}
      <Panel x={LEDGER.x} y={LEDGER.y} w={LEDGER.w} h={LEDGER.h} tone="card">
        <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px 28px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily }}>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.5, color: B.muted, textTransform: "uppercase" }}>
              Gordiy&apos;s task cards
            </div>
            {headerPhase === "idle" ? (
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.border }} />
            ) : headerPhase === "gap" ? (
              <div style={{ fontSize: 14, fontWeight: 800, color: B.danger, opacity: blink ? 1 : 0.25 }}>
                ❓ ZONE SUMMARY: NO INSTRUCTION
              </div>
            ) : (
              <div style={{ fontSize: 14, fontWeight: 800, color: B.success }}>✅ INSTRUCTED</div>
            )}
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly", marginTop: 10 }}>
            {ROWS.map((r, i) => (
              <LedgerRow
                key={r.label}
                emoji={r.emoji}
                label={r.label}
                no={r.no}
                ua={r.ua}
                filled={rowFilled[i]}
                blinkQ={i === 0}
                blink={blink}
                done={done}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 14,
              borderTop: `2px solid ${B.ink}`,
              fontFamily,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1, color: B.ink }}>
              TOTAL INSTRUCTION LINES
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, color: done ? B.success : B.muted }}>
              {done ? totalCount : "—"}
            </div>
          </div>
        </div>
      </Panel>

      {/* single tech-credibility caption — appears with the fix, stays to the end */}
      <FilterChip x={700} y={110} icon="🔧" text="earlyTasks() · both(no, uk)" color={B.accent} opacity={captionOpacity} />

      {/* ---------------- beat 1 : wordless by design ---------------- */}
      {b1 > 0.004 ? (
        <div style={{ opacity: b1 }}>
          <BeatLabel kicker="WORDLESS BY DESIGN" title="My son can't read yet — his tasks are pictures and letters" />
          <div
            style={{
              position: "absolute",
              left: RIGHT.x,
              top: RIGHT.y + 40,
              width: RIGHT.w,
              textAlign: "center",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 54 }}>🧒</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.ink, marginTop: 8 }}>Gordiy — can&apos;t read yet</div>
          </div>
        </div>
      ) : null}

      {/* ---------------- beat 2 : one card still blinked a question mark ---------------- */}
      {b2 > 0.004 ? (
        <div style={{ opacity: b2 }}>
          <BeatLabel kicker="THE GAP" title="But one card still blinked a question mark" />
          <div
            style={{
              position: "absolute",
              left: RIGHT.x,
              top: RIGHT.y + 150,
              width: RIGHT.w,
              textAlign: "center",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 64, color: B.danger, opacity: blink ? 1 : 0.25 }}>❓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: B.ink, marginTop: 10 }}>
              No way to know what to do — without Dad right there
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------- beat 3 : each card writes its own instruction ---------------- */}
      {b3 > 0.004 ? <BeatLabel kicker="THE FIX" title="Each card now writes its own instruction — NO + UA" /> : null}

      {/* ---------------- beat 4 : read aloud, still can't read it himself ---------------- */}
      {b4 > 0.004 ? (
        <div style={{ opacity: b4 }}>
          <BeatLabel kicker="READ ALOUD" title="A parent or older sibling reads it aloud" />
          <Panel x={RIGHT.x} y={RIGHT.y} w={RIGHT.w} h={RIGHT.h} tone="card" opacity={b4}>
            <div style={{ padding: 28, fontFamily, textAlign: "center" }}>
              <div style={{ fontSize: 40 }}>🧑 🔊</div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 18,
                  fontWeight: 700,
                  color: B.ink,
                  background: B.chipBg,
                  borderRadius: 14,
                  padding: "14px 18px",
                }}
              >
                &quot;Se hvordan ordet skrives for hånd&quot;
              </div>
              <div style={{ marginTop: 26, fontSize: 40 }}>🧒</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.muted, marginTop: 8 }}>
                Still can&apos;t read a single word himself
              </div>
            </div>
          </Panel>
        </div>
      ) : null}

      {/* ---------------- beat 5 : now speaks in two languages, holds to the end ---------------- */}
      {b5 > 0.004 ? (
        <div style={{ opacity: b5 }}>
          <BeatLabel kicker="THE RESULT" title="Every card now speaks in two languages" />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: morphX,
          top: morphY,
          width: morphW,
          height: morphH,
          opacity: growT,
        }}
      >
        <LiveWindow
          file={shotsFile}
          shot="page"
          title="vitalii.no/features/…-b56"
          from={B5_S}
          hold={END - B5_S}
          win={{ x: 0, y: 0, w: morphW, h: morphH }}
          opacity={1}
        />
      </div>
      {growT > 0.02 && growT < 0.98 ? (
        <div
          style={{
            position: "absolute",
            left: badgeCx - BADGE_R,
            top: badgeCy - BADGE_R,
            width: BADGE_R * 2,
            height: BADGE_R * 2,
            borderRadius: "50%",
            background: B.card,
            border: `2.5px solid ${B.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            opacity: 1 - growT,
          }}
        >
          🔍
        </div>
      ) : null}
    </PaletteProvider>
  );
};
