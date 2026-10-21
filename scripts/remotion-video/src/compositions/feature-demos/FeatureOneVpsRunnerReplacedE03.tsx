// FeatureOneVpsRunnerReplacedE03 — feature e03 — 1280x720, 973 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Split Duel lives in the bottom band: three red "chaos" tags (Azure / Zvukogram /
// Stanza) on the left, one steady green "VPS RUNNER (systemd)" block on the right —
// the clip's one tech-credibility caption — with a divider between them that slides
// from mostly-chaos to mostly-order across the whole clip. Effects own the frame
// above; the band stays alive throughout via the continuous slide + tag jitter, so
// nothing in it holds a single pose for more than a beat.
//
// No LogWindow: there is no runtime log for this product on the VPS, and the real
// page/hub backdrops in b1/b2 already cover "play the real product" — a synthetic
// log would have cost a beat better spent on the hubRouting mechanism and the
// ratioBars payoff.
//
// Beat → effect (data only from the feature row and commit fef7168):
// b1 15-321   problem: three outside services, a credits bypass running client-side.
//             cornerTags over the feature's own page (backdrop) — central claim
//             plus four short problem tags.
// b2 321-431  the fix lands: one VPS runner replaces all three.
//             handoffExplain over the features hub (backdrop) — before/now +
//             three mechanism points.
// b3 431-588  analogy: every back door closed, every sale passes the till.
//             keywordCaption, drawn (no backdrop) — "door"/"till" carry the accent.
// b4 588-770  mechanism: the three old dependencies route into the one hub, which
//             now routes out to analysis, playlist generation and billing.
//             hubRouting, drawn (no backdrop).
// b5 770-973  payoff: ~1800 lines of fragile edge-function code deleted for good.
//             ratioBars 1796 (old edge functions) vs 682 (new runner) — drawn (no
//             backdrop), holds to the true end. Never shows the page or hub again.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/e03.json";

const B1 = 15;
const B2 = 321;
const B3 = 431;
const B4 = 588;
const B5 = 770;
const END = 973;

const ACCENT = "#2563EB"; // dawn's native accent — reads fine on the dark stage, no retune needed
const STAGE = "#0B1220";

// Lower band geometry (1280x720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const SplitDuel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const bandOpacity = tween(sec(frame, B1, fps), 0, 0.3, ease.power2Out);

  // Divider slides from 78% (mostly chaos) to 24% (mostly order) across the whole clip.
  const slide = tween(sec(frame, B1, fps), 0, (END - B1) / fps, ease.sineInOut);
  const frac = mix(slide, 0.78, 0.24);
  const dividerX = LT.w * frac;

  const t = sec(frame, B1, fps);
  const jitter = (seed: number) => Math.sin(t * 2.4 + seed) * 2.5;
  const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.6));

  const tags = [
    { label: "AZURE", seed: 0 },
    { label: "ZVUKOGRAM", seed: 2.1 },
    { label: "STANZA", seed: 4.4 },
  ];

  const orderArrive = frame >= B2 ? punchScale(sec(frame, B2, fps), 0) : 0;

  return (
    <div style={{ position: "absolute", left: LT.x, top: LT.y, width: LT.w, height: LT.h, opacity: bandOpacity }}>
      {/* chaos zone */}
      <div style={{ position: "absolute", left: 0, top: 0, width: dividerX, height: LT.h, overflow: "hidden" }}>
        {tags.map((tg, i) => (
          <div
            key={tg.label}
            style={{
              position: "absolute",
              left: 18 + i * 128,
              top: 30 + jitter(tg.seed),
              padding: "7px 12px",
              borderRadius: 6,
              background: P.dangerBg,
              border: `1px solid ${P.dangerEdge}`,
              color: P.danger,
              fontFamily,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            {tg.label}
          </div>
        ))}
      </div>

      {/* divider */}
      <div
        style={{
          position: "absolute",
          left: dividerX - 1,
          top: 0,
          width: 2,
          height: LT.h,
          background: P.ink,
          opacity: 0.5,
        }}
      />

      {/* order zone — the clip's one tech-credibility caption */}
      <div style={{ position: "absolute", left: dividerX + 14, top: 0, width: LT.w - dividerX - 14, height: LT.h, overflow: "hidden" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 16px",
            marginTop: 24,
            borderRadius: 6,
            background: P.successBg,
            border: `1px solid ${P.successEdge}`,
            boxShadow: `0 0 ${6 + 6 * pulse}px ${P.successEdge}`,
            color: P.success,
            fontFamily,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 0.3,
            transform: `scale(${Math.max(orderArrive, frame >= B2 ? 1 : 0)})`,
          }}
        >
          VPS RUNNER (systemd)
        </div>
      </div>
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
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "Three outside services — one failure stalled a lesson",
          tags: ["Any service breaks it", "Billing ran in browser", "Replay = free ride", "Cost on every request"],
        }}
      />

      {/* b2 — the fix lands, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          from: "Three outside services",
          to: "One VPS runner",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Analysis + playlist, one process", "Credits charged only server-side", "Jobs queue, Postgres trigger wakes it"],
        }}
      />

      {/* b3 — the till analogy, drawn */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          line1: "Every back door closed — every sale passes the till.",
          keywords: ["door", "till"],
        }}
      />

      {/* b4 — the mechanism, drawn */}
      <MotionInsert
        effect="hubRouting"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          inputs: ["Azure analysis", "Zvukogram TTS", "Stanza NLP"],
          hub: "VPS runner",
          outputs: ["Analysis", "Playlist gen", "Billing"],
        }}
      />

      {/* b5 — the payoff, drawn, holds to the true end */}
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        data={{
          title: "Code deleted",
          a: { label: "Old edge functions", value: 1796 },
          b: { label: "New runner", value: 682 },
          unit: "lines",
          caption: "Three services, one file",
        }}
      />

      <SplitDuel />
    </AbsoluteFill>
  );
};

export const FeatureOneVpsRunnerReplacedE03: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
