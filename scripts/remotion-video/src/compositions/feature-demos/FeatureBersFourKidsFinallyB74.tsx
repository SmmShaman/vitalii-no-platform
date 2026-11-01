// FeatureBersFourKidsFinallyB74 — feature b74 — 1280x720, 999 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction v2 (feature-motion skill).
//
// Ber — Family Network: one app for the whole family, four kids sharing it. Until
// commit e82d6de (web redesign), every kid's avatar was the same flat grey circle on
// the same flat green screen — no way to tell them apart at a glance. The redesign
// gives each kid their own color (sun, coral, mint, grape) everywhere they look,
// redrawn in Tailwind CSS with squircle avatars, a floating tab bar and new icons.
//
// Beat → effect (data only from the feature row and commits e82d6de / 2e0f429):
// b1 15-190   "one app, four kids, one look"
//             cornerTags, drawn — the claim + three facts, plus a one-line
//             product plate (WAVE D: the app's name/purpose was never stated).
// b2 190-391  "one flat green screen, the same grey circle for everyone"
//             keywordCaption, drawn, plus a row of four identical grey circles
//             labelled with the real kid names (WAVE D: line 2 was a bare
//             sentence on black — now the "same for everyone" claim is drawn).
// b3 391-597  "each kid gets their own color — sun, coral, mint, grape"
//             handoffExplain, plus four real-color squircles built from the
//             KIDS palette below (WAVE D: replaces a LiveBackdrop of the
//             feature's own blog-style article page, which never showed the
//             colors and read as news coverage rather than the product).
// b4 597-815  "squircle avatars, floating tab bar, new icons — Tailwind CSS"
//             pipelineFlow, plus a drawn git-log window naming the two real
//             commits (e82d6de web redesign, 2e0f429 android icon match)
//             (WAVE D: replaces the second LiveBackdrop of the same article
//             page; the pipeline's text labels now have real evidence behind
//             them instead of just re-captioning the narration).
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
import { MotionInsert, Arrive } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";

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

/** b1 fix: the app's name and purpose were never stated anywhere on screen. */
const ProductTag: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 + 6 || frame >= B2) return null;
  const p = tween(sec(frame, B1 + 6, fps), 0, 0.3, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 150,
        width: 1280,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      <div style={{ background: "rgba(8,8,8,0.62)", border: `1.5px solid ${P.accent}55`, borderRadius: 10, padding: "14px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.2, color: P.accent, fontFamily }}>BER — FAMILY NETWORK</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#F5ECE0", marginTop: 6, fontFamily }}>One shared app for parents and kids</div>
      </div>
    </div>
  );
};

/** b2 fix: the line was a bare sentence on black. Draw the "same for everyone"
 * claim it states — four identical grey circles, one per real kid name. */
const SameCircles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B2 || frame >= B3) return null;
  const names = ["Emma", "Leo", "Nora", "Oskar"];
  const d = 84;
  const gap = 48;
  const totalW = names.length * d + (names.length - 1) * gap;
  const x0 = (1280 - totalW) / 2;
  return (
    <div style={{ position: "absolute", left: 0, top: 150, width: 1280, height: 160 }}>
      {names.map((name, i) => {
        const at = B2 + 10 + i * 6;
        if (frame < at) return null;
        const p = tween(sec(frame, at, fps), 0, 0.3, ease.power3Out);
        const x = x0 + i * (d + gap);
        return (
          <div key={name} style={{ position: "absolute", left: x, top: 0, width: d, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
            <div style={{ width: d, height: d, borderRadius: "50%", background: "#6B6B6B", border: `2px solid ${P.border}`, margin: "0 auto" }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: "#C9C2B8", marginTop: 10, fontFamily }}>{name.toUpperCase()}</div>
          </div>
        );
      })}
    </div>
  );
};

/** b3 fix: replaces a LiveBackdrop of the feature's own blog-style article page
 * (read as news coverage, never showed a color) with the four real squircle
 * colors from the KIDS palette above — the claim rendered, not just named. */
const ColorSquircles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < B3 || frame >= B4) return null;
  const d = 72;
  const gap = 40;
  const totalW = KIDS.length * d + (KIDS.length - 1) * gap;
  const x0 = (1280 - totalW) / 2;
  return (
    <div style={{ position: "absolute", left: 0, top: 36, width: 1280, height: 110 }}>
      {KIDS.map((kid, i) => {
        const at = B3 + 10 + i * 16;
        if (frame < at) return null;
        const p = tween(sec(frame, at, fps), 0, 0.3, ease.power3Out);
        const x = x0 + i * (d + gap);
        return (
          <div key={kid.name} style={{ position: "absolute", left: x, top: 0, width: d, textAlign: "center", opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
            <div style={{ width: d, height: d, borderRadius: 20, background: kid.hex, boxShadow: "0 4px 10px rgba(0,0,0,0.35)", margin: "0 auto" }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: "#F5ECE0", marginTop: 8, fontFamily }}>{kid.color.toUpperCase()}</div>
          </div>
        );
      })}
    </div>
  );
};

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
      {/* b1 — the claim, drawn, plus the product plate (name + purpose) */}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "One app, four kids, one look",
          tags: ["4 kids, 1 app", "Same look for all", "No way to tell apart", "Same grey circle"],
        }}
      />
      <ProductTag />

      {/* b2 — the exact before-state, drawn, plus the four identical grey circles it names */}
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
      <SameCircles />

      {/* b3 — the fix, plus the real squircle colors instead of a LiveBackdrop of the article page */}
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
      <ColorSquircles />

      {/* b4 — the redraw, plus the real commit log instead of a second LiveBackdrop */}
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
      {frame >= B4 && frame < B5 && (
        <LogWindow
          title="git log --oneline"
          win={{ x: 140, y: 20, w: 1000, h: 216 }}
          from={B4 + 10}
          every={26}
          fontSize={18}
          opacity={1}
          lines={[
            { t: "e82d6de", text: "feat(web): bright family redesign", tone: "accent" },
            { text: "new tokens, Phosphor icons, playful UI", tone: "ink" },
            { t: "2e0f429", text: "feat(android): blue launcher icon", tone: "accent" },
            { text: "app colours matched to the redesign", tone: "ink" },
          ]}
        />
      )}

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
