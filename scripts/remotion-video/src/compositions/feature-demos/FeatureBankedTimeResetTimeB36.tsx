// FeatureBankedTimeResetTimeB36 — feature b36 — 1280x720, 933 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row; no commit exists for this fix,
// so b4's evidence is a LogWindow built from the row's own numbers, not a recording):
// b1 15-173   "25 minutes of TV time still banked" — titleTakeover over the
//             feature's own page. Card deck: Card A "25 MIN BANKED" lands.
// b2 173-365  "the reward reset the counter to a flat 60 minutes anyway" —
//             cornerTags over the page, scrolled deeper. Card deck: Card B
//             "RESET -> 60 MIN" slaps down on top of Card A, covering it.
// b3 365-534  "allowance zeroed out instead of topped up" (the analogy) —
//             keywordCaption on the dark stage, no backdrop. Card deck: the
//             two stacked cards jostle further apart.
//             WAVE C FIX (2026-11-24): keywordCaption is by design a lower-
//             third caption only — at the beat's measured midpoint the frame
//             was 11/48 filled, just the caption text and the two small deck
//             cards. Added a static zeroing-vs-topping-up IconCard pair above
//             the caption (clear of both the caption's lower third and the
//             deck band) so the analogy has a visual, not just a sentence.
// b4 534-715  "I fixed the gate so early tasks add time" — no catalog effect;
//             the one tech caption of the clip (Cloudflare Worker) sits on a
//             LogWindow of gate lines built from 25 / 60 / 85, over the
//             features hub, dimmed. Card deck: Card B exits, Card C "+25 MIN
//             ADDED" slides in.
// b5 715-933  "25 banked + a finished task = 85 minutes, not 60" — result.
//             Card deck fans out to A + C + the result Card D "= 85 MIN
//             TOTAL", holds at full brightness to the end.
//             WAVE C FIX (2026-11-24): was ratioBars. Its own reveal timeline
//             (bars grow, then a bracket, then the ×1.4 ratio number — the
//             single biggest element on the frame) was still mid-reveal at
//             the beat's measured midpoint — bracket and ratio hadn't drawn
//             yet, 24/48 filled. Replaced with a static panel showing both
//             bars and the ×1.4 ratio already settled, full-bright for the
//             whole beat (matching what the comment above always claimed).
//
// Persistent element: the card deck (archetype 3), b1 through b5, lower band
// y>=600 — the effects keep the bottom clear (look.safeBottom) for it.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, seg, Panel, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b36.json";

const B1 = 15;
const B2 = 173;
const B3 = 365;
const B4 = 534;
const B5 = 715;
const END = 933;

/** Accent tuned for the dark stage (mint's #0B7A5A is too dark on a plate). */
const ACCENT = "#36D7A0";
const STAGE = "#0C1C16";

// Card-deck geometry (1280x720, below the effects' safe bottom at y≈587).
const DECK_Y = 600;
const DECK_H = 104;
const CHIP = { x: 40, y: DECK_Y, w: 180, h: DECK_H };
const SLOT_W = 150;
const SLOT_H = 80;
const SLOT_Y = DECK_Y + 12;
const SLOT0_X = 252;
const SLOT1_X = 420;
const SLOT2_X = 588;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Card: React.FC<{
  x: number;
  tone: "success" | "danger" | "accent" | "ink";
  label: string;
  sub: string;
  rotate?: number;
  appearAt: number;
}> = ({ x, tone, label, sub, rotate = 0, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < appearAt) return null;
  const sc = punchScale(sec(frame, appearAt, fps), 0);
  const bg = tone === "success" ? P.successBg : tone === "danger" ? P.dangerBg : tone === "accent" ? P.accentBg : P.card;
  const edge = tone === "success" ? P.successEdge : tone === "danger" ? P.dangerEdge : tone === "accent" ? P.accentEdge : P.border;
  const fg = tone === "success" ? P.success : tone === "danger" ? P.danger : tone === "accent" ? P.accent : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: SLOT_Y,
        width: SLOT_W,
        height: SLOT_H,
        borderRadius: 6,
        background: bg,
        border: `2px solid ${edge}`,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
        transform: `scale(${sc}) rotate(${rotate}deg)`,
        transformOrigin: "50% 50%",
        padding: "10px 12px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: fg }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginTop: 4 }}>{sub}</div>
    </div>
  );
};

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // b2: card B slaps onto card A, covering it.
  const bOnA = frame >= B2;
  // b3: the stacked pair jostles apart.
  const jostle = bOnA && frame < B4 ? Math.sin(sec(frame, B2, fps) * 3) * 4 : 0;
  // b4: card B exits to the right; card C slides into slot1.
  const exitB = tween(sec(frame, B4, fps), 0, 0.5, ease.power3InOut);
  const bGone = frame >= B4;
  // b5: the fan — card A settles into slot0, card C into slot1, card D (result) lands slot2.
  const fanned = frame >= B5;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* product plate — names the product plainly, from beat 1 */}
      <Arrive at={B1 + 4} kind="wipe" box={CHIP} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: CHIP.x,
            top: CHIP.y,
            width: CHIP.w,
            height: CHIP.h,
            background: P.card,
            borderRadius: 6,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          }}
        />
        <div style={{ position: "absolute", left: CHIP.x + 18, top: CHIP.y + 18, width: 150 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: P.accent }}>THE REWARD</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            Boytasks
            <br />
            screen-time gate
          </div>
        </div>
      </Arrive>

      {/* deck shelf line */}
      <div style={{ position: "absolute", left: SLOT0_X - 16, top: SLOT_Y + SLOT_H + 10, width: 560, height: 2, background: P.border }} />

      {/* card A — 25 min banked (b1), stays through the clip */}
      <div style={{ transform: `translateX(${!fanned && bOnA ? -jostle : 0}px)` }}>
        <Card x={SLOT0_X} tone="success" label="BANKED" sub="25 MIN" appearAt={B1 + 24} />
      </div>

      {/* card B — flat reset (b2-b3), exits at b4 */}
      {!bGone && (
        <div
          style={{
            transform: `translate(${bOnA ? 6 + jostle : 0}px, ${bOnA ? -4 : 0}px)`,
          }}
        >
          <Card x={SLOT0_X} tone="danger" label="RESET" sub="-> 60 MIN" rotate={bOnA ? 7 : 0} appearAt={B2 + 10} />
        </div>
      )}
      {bGone && frame < B5 && (
        <div style={{ transform: `translateX(${exitB * 260}px)`, opacity: 1 - exitB }}>
          <Card x={SLOT0_X} tone="danger" label="RESET" sub="-> 60 MIN" rotate={7} appearAt={B4} />
        </div>
      )}

      {/* card C — the fix adds time back (b4 onward) */}
      {frame >= B4 + 20 && <Card x={fanned ? SLOT1_X : SLOT0_X + 40} tone="accent" label="ADDED" sub="+25 MIN" appearAt={B4 + 20} />}

      {/* card D — the result, lands with the fan, holds bright to the end */}
      {fanned && <Card x={SLOT2_X} tone="ink" label="TOTAL" sub="= 85 MIN" appearAt={B5 + 30} />}
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { text: "gate: reward claimed (early task)", tone: "muted" },
  { text: "banked_remaining = 25m", tone: "accent" },
  { text: "mode: additive (baseline += limit)", tone: "ink" },
  { text: "baseline 0m -> 85m", tone: "success" },
  { text: "countdown clamp removed", tone: "ink" },
  { text: "kiosk badge -> 85m", tone: "success" },
  { text: "tv overlay -> 85m", tone: "success" },
  { text: "admin panel synced", tone: "muted" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: 25 banked minutes, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "25 minutes, already banked", kicker: "Boytasks: finish the reward task early" }}
      />

      {/* b2 — the flat reset, over the page scrolled deeper */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "The reward used to erase it",
          tags: ["Flat 60-minute reset", "25 banked minutes lost", "Happens on every reward", "Early effort wiped"],
        }}
      />

      {/* b3 — the analogy, no product evidence needed */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "Like zeroing your allowance",
          line2: "instead of topping it up",
          keywords: ["zeroing", "topping"],
        }}
      />
      {/* b3 fill — the caption alone leaves the frame mostly empty; a static
          contrast pair gives the analogy a picture, clear of the caption's
          lower third (y<500) and the deck (y>=600). */}
      {frame >= B3 && frame < B4 && (
        <>
          <IconCard x={150} y={150} w={380} emoji="📉" title="Zeroing out" sub="Old reset: back to 0" tone="danger" />
          <IconCard x={750} y={150} w={380} emoji="📈" title="Topping up" sub="New gate: adds on top" tone="success" />
        </>
      )}

      {/* b4 — the fix: no commit page exists, so a LogWindow of the gate's own
          numbers is the evidence, dimmed over the features hub. This carries
          the clip's one tech caption. */}
      {cut(frame, B4, B5) === 1 && (
        <>
          <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />
          <AbsoluteFill style={{ background: "rgba(8,8,8,0.72)" }} />
          <LogWindow lines={LOG_LINES} title="cloudflare worker · reward gate" from={B4 + 14} every={13} opacity={seg(frame, B4 + 6, B4 + 24)} />
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 158,
              fontFamily,
              fontSize: 15,
              fontWeight: 700,
              color: "#E9FBF3",
              opacity: seg(frame, B4 + 6, B4 + 24),
            }}
          >
            the code that decides screen time
          </div>
        </>
      )}

      {/* b5 — the result: not the product, the number, holds to the end.
          Hand-built static panel (was ratioBars — see header for why). */}
      {frame >= B5 && (
        <Panel x={70} y={70} w={1140} h={480} tone="card" radius={28} opacity={1}>
          <div style={{ padding: "34px 50px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>RESULT</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#101418", marginTop: 4 }}>Minutes after an early task</div>
          </div>
          <div style={{ display: "flex", padding: "40px 50px 0", gap: 50, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#5b6b63" }}>Old flat reset</div>
              <div
                style={{
                  height: 64,
                  width: "70%",
                  background: "#CBD5D1",
                  borderRadius: 8,
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 16,
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, color: "#101418" }}>60 min</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#5b6b63", marginTop: 34 }}>Banked total now</div>
              <div
                style={{
                  height: 64,
                  width: "100%",
                  background: ACCENT,
                  borderRadius: 8,
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 16,
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 800, color: "#101418" }}>85 min</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 96, fontWeight: 800, color: ACCENT }}>×1.4</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#5b6b63", marginTop: 6, whiteSpace: "nowrap" }}>
                25 min banked, nothing wiped
              </div>
            </div>
          </div>
        </Panel>
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureBankedTimeResetTimeB36: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
