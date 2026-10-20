// FeatureOneTapAnywhereBlocksG13 — feature g13 — 1280x720, 904 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per spoken sentence (shots/g13.motion.json), over the real
// product page as evidence where a verified URL exists (only the feature's own
// page is verified tonight — no commit page), one owner of the frame, a reading
// hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature row; problem/solution/result):
// b1 15-226   "Family Link never saw the PlayStation or the TV stick, and the
//             router's own page only worked from inside the house."
//             titleTakeover over the feature's own page (backdrop "page"). The
//             card-deck starts here: four device cards punch in scattered, dim,
//             dashed — unseen. A small "GUARD" product tag names the thing.
// b2 226-320  "It's like a guest list that skips half the house."
//             keywordCaption, no backdrop (the analogy is drawn, not evidenced).
//             Cards stay scattered; no new mover.
// b3 320-478  "The only way to cut a device off was walking home and digging
//             through router menus."
//             drawn only — the archetype carries it alone: a padlock lands on
//             the router card, a tiny figure rises and walks toward it.
// b4 478-682  "A Cloudflare Worker now talks to the router directly, listing
//             every device with its name and today's usage."
//             handoffExplain over the feature's own page, scrolled further
//             (backdrop "page2"). The one tech name, Cloudflare Worker, sits in
//             the handoff data. The cards snap from scatter into an even bright
//             row and each gets a name + usage chip — the "fan out" of the deck.
// b5 682-904  "That one tap works the same from home Wi-Fi, from a stranger's
//             Wi-Fi, or from 5G."
//             statusFocus draws the three-location verdict itself (no page/hub
//             — gate 2); the archetype lands its own tap: a finger punches onto
//             the guest-laptop card and it flips to a blocked, red state. Holds
//             to the end, no fade.
//
// Persistent element: the card-deck band (archetype 3), b1 through b5 — four
// device cards that start scattered/dim and resolve into a bright, named,
// one-tapped row. It lives at y >= 600, clear of every effect's own frame.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g13.json";

const B1 = 15;
const B2 = 226;
const B3 = 320;
const B4 = 478;
const B5 = 682;
const END = 904;

/** Bright mint accent tuned to read on the dark plate (mint's own #0B7A5A is too dark). */
const ACCENT = "#34D9A6";
const STAGE = "#0C1A15";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const BAND_Y = 630;
const BAND_H = 80;
const GAP = 24;
const CARD_W = 272;
const SLOT_X = [60, 60 + (CARD_W + GAP), 60 + 2 * (CARD_W + GAP), 60 + 3 * (CARD_W + GAP)];

type DeviceCard = { emoji: string; label: string; usage: string };
const DEVICES: DeviceCard[] = [
  { emoji: "📺", label: "TV Stick", usage: "2h 14m" },
  { emoji: "🎮", label: "PlayStation", usage: "54m" },
  { emoji: "💻", label: "Guest Laptop", usage: "11m" },
  { emoji: "🔒", label: "Router", usage: "enforces it" },
];

// Fixed scatter offsets (one per card) — disorder before the Worker lists everything.
const SCATTER = [
  { dx: 34, dy: -18, rot: -7 },
  { dx: -22, dy: 16, rot: 6 },
  { dx: 18, dy: -12, rot: -5 },
  { dx: -14, dy: 14, rot: 8 },
];

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // b4: the deck snaps from scatter into an even bright row — the one mover of this beat.
  const handStart = B4 + 6;
  const hand = tween(sec(frame, handStart, fps), 0, 1.3, ease.power3Out);
  const settled = frame >= handStart;

  // b5: a finger taps the guest-laptop card and it flips to blocked.
  const tapAt = B5 + 20;
  const tapped = frame >= tapAt;
  const tapScale = tapped ? punchScale(sec(frame, tapAt, fps), 0) : 0;
  const blockedAt = B5 + 40;
  const blocked = frame >= blockedAt;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* b1 only: names the product */}
      {frame >= B1 && frame < B2 && (
        <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 602, w: 420, h: 26 }} dur={0.4}>
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 602,
              width: 420,
              height: 26,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0.6,
              color: P.accent,
            }}
          >
            <span>🛡️ GUARD</span>
            <span style={{ color: P.muted, fontWeight: 600 }}>— a private family-network guard</span>
          </div>
        </Arrive>
      )}

      {DEVICES.map((d, i) => {
        const slotX = SLOT_X[i];
        const scatter = SCATTER[i];
        const x = mix(hand, slotX + scatter.dx, slotX);
        const y = mix(hand, BAND_Y + scatter.dy, BAND_Y);
        const rot = mix(hand, scatter.rot, 0);
        const isTapCard = i === 2;
        const cardBlocked = isTapCard && blocked;
        const tone = cardBlocked ? P.danger : settled ? P.success : P.muted;
        const bg = cardBlocked ? P.dangerBg : settled ? P.successBg : P.card;
        const border = cardBlocked ? P.dangerEdge : settled ? P.successEdge : P.border;
        return (
          <Arrive key={d.label} at={B1 + 10 + i * 7} kind="punch" box={{ x: slotX, y: BAND_Y, w: CARD_W, h: BAND_H }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: CARD_W,
                height: BAND_H,
                transform: `rotate(${rot}deg)`,
                background: bg,
                border: `2px ${settled ? "solid" : "dashed"} ${border}`,
                borderRadius: 4,
                boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
                boxSizing: "border-box",
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 22 }}>
                {d.emoji} <span style={{ fontSize: 17, fontWeight: 800, color: P.ink }}>{d.label}</span>
              </div>
              {settled && (
                <div style={{ fontSize: 14, fontWeight: 700, color: tone, marginTop: 4 }}>
                  {cardBlocked ? "🚫 BLOCKED" : d.usage}
                </div>
              )}
              {/* b3: padlock lands on the router card while it is still unreachable */}
              {i === 3 && frame >= B3 + 20 && frame < B4 && (
                <div style={{ position: "absolute", right: 10, top: 8, fontSize: 20 }}>🔒</div>
              )}
            </div>
          </Arrive>
        );
      })}

      {/* b3: a tiny figure rises and walks toward the locked router — the only way in used to be on foot */}
      {frame >= B3 + 30 && frame < B4 && (
        <Arrive at={B3 + 30} kind="rise" box={{ x: SLOT_X[3] - 50, y: BAND_Y - 36, w: 36, h: 36 }}>
          <div style={{ position: "absolute", left: SLOT_X[3] - 50, top: BAND_Y - 36, fontSize: 28 }}>🚶</div>
        </Arrive>
      )}

      {/* b5: the tap itself */}
      {tapped && !blocked && (
        <div
          style={{
            position: "absolute",
            left: SLOT_X[2] + CARD_W / 2 - 16,
            top: BAND_Y - 10,
            width: 32,
            height: 32,
            fontSize: 30,
            transform: `scale(${tapScale})`,
          }}
        >
          👆
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Family Link never saw them", kicker: "PlayStation, TV stick, guest laptops — and the router page only worked from home" }}
      />

      {/* b2 — the analogy, drawn, no backdrop */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{ line1: "A guest list that skips half the house", keywords: ["guest list", "skips"] }}
      />

      {/* b3 — the old way, archetype only */}

      {/* b4 — the Worker, over the feature's own page scrolled further */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Router page, home Wi-Fi only",
          to: "Cloudflare Worker, every device",
          fromLabel: "Before",
          toLabel: "Now",
          points: ["Device name", "Today's usage"],
        }}
      />

      {/* b5 — the verdict, drawn (never the page/hub — gate 2), holds to the end */}
      <MotionInsert
        effect="statusFocus"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "One tap, same block",
          claims: [
            { text: "Home Wi-Fi", verdict: "yes" },
            { text: "Stranger's Wi-Fi", verdict: "yes" },
            { text: "5G", verdict: "yes" },
          ],
        }}
      />

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureOneTapAnywhereBlocksG13: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
