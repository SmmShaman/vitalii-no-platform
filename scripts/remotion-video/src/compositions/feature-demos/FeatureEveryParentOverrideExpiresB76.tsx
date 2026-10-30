// FeatureEveryParentOverrideExpiresB76 — feature b76 — 1280x720, 951 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Boytasks: screen time for the kids is gated behind finishing school/chore tasks.
// The QR-pass unlock already timed out after 30 min; three other admin entry points
// into the same tier-2 access did not. Fixed in commit 1cb1828 — every admin path now
// stamps the same 30-min expiry inside the youtube-gate Cloudflare Worker.
// (Commit ac7ca49 is a different feature — Artem's glucose badge — and is not used here.)
//
// Beat → effect (data only from the feature row and commit 1cb1828):
// b1 15-292    "QR pass auto-locked in 30 min, any other button could stay open all day"
//              titleTakeover over the feature's own page (backdrop). Bottom-band badge
//              names the product (Boytasks) and shows "1 of 4 unlock paths timed".
// b2 292-439   "like one self-closing latch on a door with three others left wide open"
//              keywordCaption over the page, scrolled deeper — same badge, unchanged.
// b3 439-627   "every admin button stamps the same timer inside the Cloudflare Worker"
//              handoffExplain, dark stage (no verified recording of the Worker code).
//              Badge flips 1/4 → 4/4 the moment the hand-off lands.
// b4 627-763   "when it runs out, the normal lock rules take over automatically"
//              pipelineFlow over the features hub (the wider system this sits in).
// b5 763-951   "all four unlock paths now expire in thirty minutes, not just one"
//              pure drawn hero-number reveal — no effect, no backdrop — "30" at
//              fontSize 240 owns the frame (gate 1), the 4-path checklist lands beside
//              it, holds to END at full brightness. The last beat is the result, never
//              the page or hub (gate 2).
//
// Persistent element: the hero-number badge (archetype 7), small in the bottom band
// (y >= 600) for b1-b4 so it never competes with an effect; it steps aside for the
// full-frame hero-number finale in b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b76.json";

const B1 = 15;
const B2 = 292;
const B3 = 439;
const B4 = 627;
const B5 = 763;
const END = 951;

/** Accent tuned for the dark stage. */
const ACCENT = "#5EA8D8";
const STAGE = "#11161C";

// Badge geometry (1280x720, bottom band y >= 600 the effects keep clear).
const LT = { x: 40, y: 600, w: 1200, h: 104 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Badge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 || frame >= B5) return null;

  const flipped = frame >= B3 + 40;
  const tone = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const edge = flipped ? P.successEdge : P.dangerEdge;
  const count = flipped ? 4 : 1;
  const showBrand = frame < B2;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: LT.w,
            height: LT.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: LT.x + 22,
            top: LT.y + 10,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            color: P.muted,
            opacity: showBrand ? 1 : 0,
          }}
        >
          BOYTASKS
        </div>
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 26, fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>
          30-MIN AUTO-LOCK
        </div>
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 48, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: tone, fontVariantNumeric: "tabular-nums" }}>{count}</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: P.ink }}>of 4 unlock paths timed</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: LT.x + LT.w - 160,
            top: LT.y + 22,
            width: 130,
            height: 60,
            borderRadius: 4,
            background: bg,
            border: `2px solid ${edge}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            color: tone,
            textAlign: "center",
          }}
        >
          {flipped ? "ALL SAFE" : "3 LEFT OPEN"}
        </div>
      </Arrive>
    </div>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;

  const t = sec(frame, B5, fps);
  const punch = punchScale(t, 0);
  const underline = tween(t, 0.2, 0.7, ease.power3Out);
  const paths = ["QR pass", "Master switch", "Unlock command", "yt-on / sp-on"];

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 28% 40%, ${P.accentBg} 0%, ${STAGE} 62%)`,
        }}
      />
      <div style={{ position: "absolute", left: 80, top: 130, transform: `scale(${punch})`, transformOrigin: "left top" }}>
        <div style={{ fontSize: 240, fontWeight: 900, color: P.accent, lineHeight: 0.85, letterSpacing: -4 }}>30</div>
      </div>
      <div style={{ position: "absolute", left: 86, top: 420, fontSize: 44, fontWeight: 800, color: "#F5F7FA", letterSpacing: 4 }}>
        MINUTES
      </div>
      <div style={{ position: "absolute", left: 86, top: 480, width: underline * 560, height: 4, background: P.accent }} />
      <div style={{ position: "absolute", left: 86, top: 502, fontSize: 24, fontWeight: 700, color: "#B9C2CC" }}>
        4 of 4 unlock paths — not just the QR pass
      </div>
      {paths.map((label, i) => {
        const at = B5 + 70 + i * 8;
        if (frame < at) return null;
        const sc = punchScale(sec(frame, at, fps), 0);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: 700,
              top: 150 + i * 68,
              width: 420,
              height: 56,
              borderRadius: 6,
              background: P.successBg,
              border: `2px solid ${P.successEdge}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingLeft: 18,
              fontSize: 20,
              fontWeight: 700,
              color: P.success,
              transform: `scale(${sc})`,
              transformOrigin: "left center",
            }}
          >
            <span>✅</span>
            <span>{label}</span>
          </div>
        );
      })}
    </AbsoluteFill>
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
        data={{ title: "One Timer, Four Buttons", kicker: "QR pass auto-locked in 30 min — the others didn't" }}
      />

      {/* b2 — the analogy */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "One self-closing latch. Three doors left wide open.", keywords: ["latch", "open"] }}
      />

      {/* b3 — the fix: no verified recording of the Worker code, dark stage */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          from: "Only the QR pass timed out",
          to: "All 4 admin paths time out",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Master switch", "Unlock command", "yt-on / sp-on buttons", "Cloudflare Worker — guards every lock"],
        }}
      />

      {/* b4 — the result mechanism, over the features hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["30-min timer expires", "Tier 2 access drops", "Bonus + QR rules resume"],
          result: "No manual reset needed",
          system: "Cloudflare Worker",
        }}
      />

      <Badge />

      {/* b5 — hero-number finale, holds to END */}
      <Finale />
    </AbsoluteFill>
  );
};

export const FeatureEveryParentOverrideExpiresB76: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
