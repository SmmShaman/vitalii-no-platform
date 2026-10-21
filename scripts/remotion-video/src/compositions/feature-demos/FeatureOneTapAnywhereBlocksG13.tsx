// FeatureOneTapAnywhereBlocksG13 — feature g13 — 1280x720, 904 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card deck, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
// RE-SHOOT (2026-10-21): previous cut opened with titleTakeover (banned tonight) and leaned on
// handoffExplain (already used by b58/g11/g12) plus a non-recordable commit-page backdrop.
// Beat windows and export name are locked and unchanged from the prior cut.
//
// Archetype lives in the bottom band: five cards (PlayStation+TV stick → guest list → walk
// home → Cloudflare Worker → one tap) start stacked in a center pile and fly out to a fanned
// row as their beat arrives, then stay docked — continuous motion for the whole clip.
//
// Beat → effect (data only from the feature row and commits 3506979/2213b79/a94dba0):
// b1 15-226   problem: Family Link misses the PlayStation, the TV stick, and the router page
//             only works from inside the house. statusFocus over the feature's own page.
// b2 226-320  the complaint, as a quote: a guest list that skips half the house. quoteMarker
//             over the features hub.
// b3 320-478  the old workaround: notice → walk home → open router admin → hunt for a MAC →
//             finally blocked. funnelAbsorption, drawn.
// b4 478-682  mechanism: router agent + device/MAC + usage all route through a Cloudflare
//             Worker into one live device list. hubRouting, drawn.
// b5 682-904  payoff: same tap blocks from home Wi-Fi, a stranger's Wi-Fi, or 5G — holds to the
//             true end. Drawn LogWindow (no runtime log on the VPS for this product, so the
//             lines are built from the worker/agent file names and the real 300 pkts/30s
//             threshold from commit a94dba0 — never invented).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g13.json";

const B1 = 15;
const B2 = 226;
const B3 = 320;
const B4 = 478;
const B5 = 682;
const END = 904;

const ACCENT = "#34D9A6"; // bright mint accent tuned to read on the dark plate (mint's own #0B7A5A is too dark)
const STAGE = "#0C1A15";

// Lower band geometry (1280x720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const CARDS = [
  { icon: "🎮", label: "PlayStation + TV stick" },
  { icon: "📋", label: "Half the guest list" },
  { icon: "🚶", label: "Walk home to block" },
  { icon: "⚙️", label: "Cloudflare Worker" },
  { icon: "👆", label: "One tap, anywhere" },
];
const STARTS = [B1, B2, B3, B4, B5];
const CARD_W = 200;
const CARD_H = 72;
const GAP = 50;
const slotX = (i: number) => LT.x + i * (CARD_W + GAP);
const pileX = LT.x + LT.w / 2 - CARD_W / 2;
const pileY = LT.y;

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 - 10) return null;

  const bandOpacity = tween(sec(frame, B1 - 10, fps), 0, 0.3, ease.power2Out);

  let activeIndex = -1;
  for (let i = 0; i < STARTS.length; i++) if (frame >= STARTS[i]) activeIndex = i;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity: bandOpacity }}>
      {CARDS.map((card, i) => {
        const started = frame >= STARTS[i];
        const flight = started ? tween(sec(frame, STARTS[i], fps), 0, 0.55, ease.power3Out) : 0;
        const x = mix(flight, pileX + i * 3, slotX(i));
        const y = mix(flight, pileY, LT.y);
        const punch = started ? punchScale(sec(frame, STARTS[i], fps), 0) : 1;
        const scale = started ? Math.max(punch, 1) : 0.9;
        const active = i === activeIndex;
        return (
          <div
            key={card.label}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CARD_W,
              height: CARD_H,
              transform: `scale(${scale})`,
              transformOrigin: "center",
              borderRadius: 14,
              background: active ? P.accentBg : P.card,
              border: `2px solid ${active ? P.accent : P.border}`,
              boxShadow: active ? `0 0 16px ${P.accentEdge}` : "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 14px",
              opacity: started ? 1 : 0.55,
            }}
          >
            <div style={{ fontSize: 26 }}>{card.icon}</div>
            <div
              style={{
                fontFamily,
                fontSize: 14,
                fontWeight: active ? 800 : 600,
                color: active ? P.ink : P.muted,
                lineHeight: 1.15,
              }}
            >
              {card.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const logOpacity = tween(sec(frame, B5, 30), 0, 0.3, ease.power2Out);

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="statusFocus"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          title: "Family Link blind spots",
          claims: [
            { text: "Sees the PlayStation", verdict: "no" },
            { text: "Sees the Android TV stick", verdict: "no" },
            { text: "Router page works outside the house", verdict: "no" },
          ],
        }}
      />

      {/* b2 — the complaint, as a quote, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="quoteMarker"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          quote: "It's like a guest list that skips half the house.",
          highlight: "skips half the house",
        }}
      />

      {/* b3 — the old workaround, drawn */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          inputs: [
            "Notice a device acting up",
            "Walk home first",
            "Open the router admin page",
            "Hunt the device list for a MAC",
          ],
          result: "Finally blocked",
        }}
      />

      {/* b4 — the mechanism, drawn */}
      <MotionInsert
        effect="hubRouting"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          inputs: ["Router agent", "Device name + MAC", "Today's usage"],
          hub: "Cloudflare Worker",
          output: "Live device list",
        }}
      />

      {/* b5 — the payoff, holds to the true end */}
      {frame >= B5 && (
        <LogWindow
          title="guard worker"
          from={B5}
          every={16}
          opacity={logOpacity}
          fontSize={22}
          lines={[
            { t: "00:00", text: "tap -> block device", tone: "accent" },
            { t: "00:01", text: "worker/src/index.js: route to router agent", tone: "ink" },
            { t: "00:02", text: "guard_agent.py + router.py apply block", tone: "ink" },
            { t: "00:03", text: "protected devices skip (300 pkts/30s threshold)", tone: "ink" },
            { t: "00:04", text: "same tap: home Wi-Fi, stranger's Wi-Fi, 5G", tone: "success" },
            { t: "00:05", text: "block confirmed", tone: "success" },
          ]}
        />
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureOneTapAnywhereBlocksG13: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
