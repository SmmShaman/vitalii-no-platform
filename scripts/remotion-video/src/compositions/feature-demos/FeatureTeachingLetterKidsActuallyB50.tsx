/**
 * FeatureTeachingLetterKidsActuallyB50 — feature b50 — 1280x720, 835 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 7 "hero-number" (pre-assigned, not redrawn here) / mood "violet"
 * (pre-assigned, not redrawn here): a hero number top-left, two StatPills to
 * its right, the main visual in the window area below, caption band at the
 * bottom — same skeleton as FeatureTraceabilityScannerLive.tsx (p61).
 *
 * UI beats (3, 5) play REAL recordings via LiveWindow, driven by
 * shots/b50.json (STEP 0c): the feature's own write-up page and the features
 * hub — the only two verified public URLs for this feature. Beats 1, 2 and 4
 * are drawn: a letter-shape comparison, a notebook mockup and a 40-card
 * frequency grid, none of which is a page a viewer could visit.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–183  "My son's teacher writes 'l' as a slanted loop. On his screen, it was a bare stick."
 *  b2 192–306  "He was learning letters he couldn't even recognize in his own notebook."
 *  b3 315–487  "So lessons now show how each letter looks written by hand, using a font called Playwrite NO."
 *  b4 496–632  "The TV wall used to show that handwriting once in every forty cards."
 *  b5 641–790  "Now every card for a young child shows it — one in forty became one in one." — holds to 835.
 *
 * Hero numbers walk the story: 6 → 0 → 1 → 1/40 → 1/1 (ends on the real result).
 * Single tech name in the whole clip: Playwrite NO (beat 3 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, CaptionBand, Panel, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, WIN_DEFAULT, WIN_BAR } from "./live-primitives";
import shots from "./shots/b50.json";

const P = MOODS.violet;
const WIN = WIN_DEFAULT;
const BAR = WIN_BAR;

const CONFUSABLE = ["l", "e", "t", "f", "r", "a"];
const NOTEBOOK_LINES = [0.62, 0.8, 0.46, 0.85, 0.55, 0.72];
const GRID_HIGHLIGHT = 22; // one card among forty

/** The hero number, top-left, leaving the centre of the frame to the product. */
const hero = (value: string, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      top: 34,
      width: 470,
      transform: `scale(${0.86 + 0.14 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 800, letterSpacing: -4, color, fontVariantNumeric: "tabular-nums" }}>
      {value}
    </div>
    <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>{label}</div>
  </div>
);

export const FeatureTeachingLetterKidsActuallyB50: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 183, 199));
  const b2 = seg(frame, 192, 208) * (1 - seg(frame, 306, 322));
  const b3 = seg(frame, 315, 331) * (1 - seg(frame, 487, 503));
  const b4 = seg(frame, 496, 512) * (1 - seg(frame, 632, 648));
  const b5 = seg(frame, 641, 657); // holds through 835

  const heroPop1 = pop(15);
  const heroPop2 = pop(192);
  const heroPop3 = pop(315);
  const heroPop4 = pop(496);
  const heroPop5 = pop(641);

  // beat 2: the "?" badge pulses once the notebook lines have settled
  const questionPop = pop(228);

  // beat 4: independent slide-in ramp, the required non-crossfade transition
  const slide4 = interpolate(frame, [496, 530], [70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : the same letter, two shapes ---------------- */}
        <Group opacity={b1}>
          {hero("6", "LETTERS THAT LOOKED WRONG ONSCREEN", P.danger, heroPop1)}
          <StatPill x={690} y={52} emoji="✍" text="teacher's 'l' is a slanted loop" tone="danger" opacity={b1} />
          <StatPill x={690} y={112} emoji="🖥" text="the screen showed a bare stick" tone="danger" opacity={b1} />
          <Panel x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} tone="danger" opacity={b1}>
            <div style={{ position: "absolute", left: 30, top: 20, fontSize: 20, fontWeight: 800, color: P.ink }}>SAME LETTER, TWO SHAPES</div>
            <div style={{ position: "absolute", left: 50, top: 70, width: 420, height: 230, borderRadius: 16, background: P.card, border: `1.5px solid ${P.border}` }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 16, textAlign: "center", fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>
                TEACHER'S NOTEBOOK
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 44, textAlign: "center", fontSize: 140, lineHeight: 1, fontStyle: "italic", fontFamily: "cursive", color: P.ink, transform: "skewX(-6deg)" }}>
                l
              </div>
            </div>
            <div style={{ position: "absolute", left: 510, top: 70, width: 420, height: 230, borderRadius: 16, background: P.card, border: `1.5px solid ${P.border}` }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 16, textAlign: "center", fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>
                THE OLD SCREEN
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 44, textAlign: "center", fontSize: 140, lineHeight: 1, fontWeight: 800, fontFamily: "system-ui, sans-serif", color: P.danger }}>
                l
              </div>
            </div>
            {CONFUSABLE.map((c, i) => (
              <div
                key={c}
                style={{
                  position: "absolute",
                  left: 40 + i * 152,
                  top: 330,
                  width: 140,
                  height: 76,
                  borderRadius: 12,
                  background: P.dangerBg,
                  border: `1.5px solid ${P.dangerEdge}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  fontWeight: 800,
                  color: P.danger,
                }}
              >
                {c}
              </div>
            ))}
          </Panel>
          <CaptionBand y={664} fontSize={22} text="Handwritten by the teacher. Printed flat on the screen." tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : known by hand, unreadable onscreen ---------------- */}
        <Group opacity={b2}>
          {hero("0", "SCREEN LETTERS HE KNEW FROM HIS NOTEBOOK", P.danger, heroPop2)}
          <StatPill x={690} y={52} emoji="📓" text="wrote them all year by hand" tone="danger" opacity={b2} />
          <StatPill x={690} y={112} emoji="❓" text="still didn't know them onscreen" tone="danger" opacity={b2} />
          <Panel x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} tone="danger" opacity={b2}>
            <div style={{ position: "absolute", left: 30, top: 20, fontSize: 20, fontWeight: 800, color: P.ink }}>HIS NOTEBOOK, ALL YEAR</div>
            {NOTEBOOK_LINES.map((w, i) => (
              <div
                key={`nb-${i}`}
                style={{
                  position: "absolute",
                  left: 40,
                  top: 84 + i * 46,
                  width: 620 * w,
                  height: 16,
                  borderRadius: 8,
                  background: `${P.ink}22`,
                  transform: `rotate(${i % 2 === 0 ? -1.1 : 0.8}deg)`,
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: 760,
                top: 140,
                width: 150,
                height: 150,
                borderRadius: 75,
                background: P.dangerBg,
                border: `2px solid ${P.dangerEdge}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
                fontWeight: 800,
                color: P.danger,
                transform: `scale(${0.85 + 0.15 * Math.min(1, questionPop)})`,
              }}
            >
              ?
            </div>
            <div style={{ position: "absolute", left: 40, top: 400, fontSize: 15, fontWeight: 700, color: P.muted }}>
              SAME LETTERS. STILL UNREADABLE ONSCREEN.
            </div>
          </Panel>
          <CaptionBand y={664} fontSize={22} text="He knew these letters by hand — not from the screen." tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the real page, shown in real handwriting ---------------- */}
        <Group opacity={b3}>
          {hero("1", "NEW STEP: SHOW IT IN HIS OWN HAND", P.accent, heroPop3)}
          <StatPill x={690} y={52} emoji="✍" text="shown in real handwriting now" tone="accent" opacity={b3} />
          <StatPill x={690} y={112} emoji="🎯" text="matches the classroom exactly" tone="accent" opacity={b3} />
          <LiveWindow file={shots} shot="page" title="vitalii.no/features/…-b50" from={315} hold={158} opacity={b3} win={WIN} />
          <FilterChip x={WIN.x + WIN.w - 210} y={WIN.y + BAR + 14} text="Playwrite NO" icon="🔤" color={P.accent} opacity={b3} />
          <CaptionBand y={664} fontSize={22} text="Every lesson now shows the letter in real handwriting." tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : one card in forty ---------------- */}
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `translateX(${slide4}px)` }}>
            {hero("1/40", "CARDS SHOWED REAL HANDWRITING", P.danger, heroPop4)}
            <StatPill x={690} y={52} emoji="📺" text="the wall showed 1 real card" tone="danger" opacity={b4} />
            <StatPill x={690} y={112} emoji="🃏" text="the other 39 didn't" tone="danger" opacity={b4} />
            <Panel x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} tone="danger" opacity={b4}>
              <div style={{ position: "absolute", left: 30, top: 20, fontSize: 20, fontWeight: 800, color: P.ink }}>40 CARDS ON THE WALL</div>
              {Array.from({ length: 40 }, (_, i) => {
                const col = i % 8;
                const row = Math.floor(i / 8);
                const on = i === GRID_HIGHLIGHT;
                return (
                  <div
                    key={`cell-${i}`}
                    style={{
                      position: "absolute",
                      left: 62 + col * 108,
                      top: 70 + row * 64,
                      width: 100,
                      height: 56,
                      borderRadius: 10,
                      background: on ? P.accentBg : "#E3E9F2",
                      border: on ? `2px solid ${P.accentEdge}` : "1px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                    }}
                  >
                    {on ? "✍" : ""}
                  </div>
                );
              })}
              <div style={{ position: "absolute", left: 62, top: 400, fontSize: 15, fontWeight: 700, color: P.muted }}>
                1 CARD IN 40 SHOWED HIS HANDWRITING
              </div>
            </Panel>
            <CaptionBand y={664} fontSize={22} text="Only one card in forty showed real handwriting." tone="danger" opacity={b4} />
          </div>
        </Group>

        {/* ---------------- beat 5 : the real hub, every card now ---------------- */}
        <Group opacity={b5}>
          {hero("1/1", "CARDS NOW SHOW REAL HANDWRITING", P.success, heroPop5)}
          <StatPill x={690} y={52} emoji="✅" text="every young learner's card" tone="success" opacity={b5} />
          <StatPill x={690} y={112} emoji="✍" text="always his own teacher's hand" tone="success" opacity={b5} />
          <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={heroPop5} />
          <LiveWindow file={shots} shot="hub" title="vitalii.no/features" from={641} hold={194} opacity={b5} win={WIN} />
          <CaptionBand y={664} fontSize={22} text="Now every card shows it — in his own teacher's hand." tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
