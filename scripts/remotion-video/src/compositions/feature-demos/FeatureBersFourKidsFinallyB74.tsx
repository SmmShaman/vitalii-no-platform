// FeatureBersFourKidsFinallyB74 — feature b74 — 1280x720, 999 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction v2 (feature-motion skill).
//
// Ber — Family Network: one app for the whole family, four kids sharing it. Until
// commit e82d6de (web redesign), every kid's avatar was the same flat grey circle on
// the same flat green screen — no way to tell them apart at a glance. The redesign
// gives each kid their own color (sun, coral, mint, grape) everywhere they look,
// redrawn in Tailwind CSS with squircle avatars, a floating tab bar and new icons.
//
// Beat → effect (data only from the feature row and commit e82d6de):
// b1 15-190   "one app, four kids, one look"
//             cornerTags, drawn — the claim + three facts.
// b2 190-391  "one flat green screen, the same grey circle for everyone"
//             keywordCaption, drawn — the exact before-state no longer exists on
//             the live site, so it is stated, not screenshotted.
// b3 391-597  "each kid gets their own color — sun, coral, mint, grape"
//             handoffExplain over the feature's own live page (shot "page").
// b4 597-815  "squircle avatars, floating tab bar, new icons — Tailwind CSS"
//             pipelineFlow over the same live page, scrolled on (shot "page2").
// b5 815-999  "four colors, finally theirs"
//             titleTakeover, drawn — no feature page or hub on the last beat (gate 2).
//
// Persistent element: the kids' color ledger (archetype 5) — four line items,
// cost (grey, struck) → credit (their own color, checked), lit one by one through
// b3 and held through b4. The TOTAL flip ("1 shared look" → "4 kids, 4 colors")
// lands inside the ledger band itself at b5, so the archetype carries the result
// instead of a separate element carrying it next to a static band.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b74.json";

const B1 = 15;
const B2 = 190;
const B3 = 391;
const B4 = 597;
const B5 = 815;
const END = 999;

const ACCENT = "#5FC9D6";
const STAGE = "#1A1512";

const LEDGER = { x: 40, y: 606, w: 1200, h: 92 };
const TITLE_W = 210;
const CHIP_X0 = LEDGER.x + TITLE_W + 20;
const CHIP_W = 232;
const CHIP_GAP = 10;

const KIDS = [
  { name: "Emma", color: "sun", hex: "#FDBB2D", lightAt: B3 + 20 },
  { name: "Leo", color: "coral", hex: "#FF6F59", lightAt: B3 + 55 },
  { name: "Nora", color: "mint", hex: "#3DBE9C", lightAt: B3 + 90 },
  { name: "Oskar", color: "grape", hex: "#9B5FB0", lightAt: B3 + 125 },
];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const litCount = KIDS.filter((k) => frame >= k.lightAt).length;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LEDGER} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LEDGER.x,
            top: LEDGER.y,
            width: LEDGER.w,
            height: LEDGER.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: LEDGER.x + 22, top: LEDGER.y + 14, width: TITLE_W - 30 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>KIDS&apos; COLORS</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: P.ink, marginTop: 6 }}>{litCount}/4 theirs</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: LEDGER.x + TITLE_W,
            top: LEDGER.y + 10,
            width: 2,
            height: LEDGER.h - 20,
            background: P.border,
          }}
        />
      </Arrive>

      {KIDS.map((kid, i) => {
        const x = CHIP_X0 + i * (CHIP_W + CHIP_GAP);
        const lit = frame >= kid.lightAt;
        const flip = tween(sec(frame, kid.lightAt, fps), 0, 0.4, ease.power3InOut);
        return (
          <Arrive key={kid.name} at={B1 + 20 + i * 6} kind="rise" box={{ x, y: LEDGER.y + 14, w: CHIP_W, h: 64 }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: LEDGER.y + 14,
                width: CHIP_W,
                height: 64,
                background: lit ? `${kid.hex}22` : P.dangerBg,
                border: `2px solid ${lit ? kid.hex : P.dangerEdge}`,
                borderRadius: 4,
                padding: "8px 12px",
                boxSizing: "border-box",
                transform: `scale(${1 + 0.05 * Math.sin(flip * Math.PI)})`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.2, color: lit ? kid.hex : P.danger }}>
                {kid.name.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginTop: 4,
                  color: lit ? P.ink : P.muted,
                  textDecoration: lit ? "none" : "line-through",
                }}
              >
                {lit ? `${kid.color} ✓` : "grey circle"}
              </div>
            </div>
          </Arrive>
        );
      })}

      {/* b5: the total flip lands inside the ledger itself — the archetype carries the result */}
      {frame >= B5 + 40 && (
        <div
          style={{
            position: "absolute",
            left: LEDGER.x + TITLE_W + 40,
            top: LEDGER.y + 14,
            width: LEDGER.w - TITLE_W - 80,
            height: 64,
            borderRadius: 4,
            background: P.ink,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            fontSize: 20,
            fontWeight: 800,
            transform: `scale(${punchScale(sec(frame, B5 + 40, fps), 0)})`,
          }}
        >
          <span style={{ textDecoration: "line-through", opacity: 0.6 }}>1 shared look</span>
          <span style={{ color: P.success }}>{"→"} 4 kids, 4 colors</span>
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the claim, drawn */}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "One app, four kids, one look",
          tags: ["4 kids, 1 app", "Same look for all", "No way to tell apart"],
        }}
      />

      {/* b2 — the exact before-state, drawn (no longer live to screenshot) */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          line1: "One flat green screen,",
          line2: "the same grey circle for everyone.",
          keywords: ["flat green", "grey circle"],
        }}
      />

      {/* b3 — the fix, over the feature's own live page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Same grey for everyone",
          to: "Each kid's own color",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Sun, coral, mint, grape", "Everywhere they look", "e82d6de web redesign"],
        }}
      />

      {/* b4 — the redraw, over the same live page scrolled further */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Squircle avatars", "Floating tab bar", "New icons"],
          result: "Redrawn in Tailwind CSS",
          system: "Tailwind CSS 🎨",
        }}
      />

      {/* b5 — the result, drawn (no feature page or hub on the last beat) */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        data={{ title: "Four colors, finally theirs", kicker: "One redesign, four kids" }}
      />

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureBersFourKidsFinallyB74: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
