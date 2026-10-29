// FeatureKiosksSugarBadgeJustD16 — feature d16 — 1280x720, 883 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Persistent element (archetype 4, survives every beat b1 through b5): a lower-third flow
// map — KIOSK -> GATE -> {OTHER ROUTES (static, unchanged), HISTORY} -> TREND -> STAMP.
// HISTORY starts red "blocked" and flips green "<=24h" at the B3 hand-off; TREND lights up
// at B4; STAMP lands "24h" at B5. OTHER ROUTES never changes state — it is the visual proof
// that every other kiosk route (badge, current, display) was left untouched.
//
// Beat -> effect (data only from the feature row, no invented numbers):
// b1 15-180   "one number, never a trend" — cornerTags over the article's top (shot "wide").
// b2 180-351  "walled off from history entirely" — keywordCaption over the problem paragraph
//             (shot "problem"), the word "rejected" picked out.
// b3 351-530  "found the wall inside the API and moved it" — handoffExplain over the fix
//             paragraph (shot "fix"); one point glosses "API" in plain words. HISTORY flips
//             red -> green here.
// b4 530-678  "every reading ... shows up as a trend" — pipelineFlow over the result
//             paragraph (shot "result"). TREND node lights up here.
// b5 678-883  "one dot became a full day" — breaks the pattern on purpose (gate: last beat
//             is never the feature page or the hub): a wipe-in headline over the empty top
//             band, then ratioBars draws the clamp itself, single reading (1h) vs full day
//             (24h) — the feature's own before/after facts, no invented numbers. STAMP lands
//             "24h" in the flow map at the same moment, the two endings read as one result
//             instead of two.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import { LiveShot, recSize } from "./live-primitives";
import shotsFile from "./shots/d16.json";

const B1 = 15;
const B2 = 180;
const B3 = 351;
const B4 = 530;
const B5 = 678;
const END = 883;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** Accent tuned for the mint palette so overlays read on both the live photo and the card. */
const ACCENT = "#0B7A5A";
const STAGE = "#0B1620";

const FULL_WIN = { x: 0, y: -42, w: 1280, h: 762 };
const LT_WIN = { x: 0, y: 606, w: 1280, h: 114 };

const { w: REC_W, h: REC_H } = recSize(shotsFile);
const COVER = Math.max(1, 720 / REC_H / (1280 / REC_W));

/** b1 — a one-line product plate, drawn, naming the product and the son plainly. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  const p = tween(sec(frame, B1 + 10, fps), 0, 0.5, ease.power2Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 40,
        padding: "10px 18px",
        background: P.card,
        border: `2px solid ${P.accent}`,
        borderRadius: 4,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
        opacity: p,
        transform: `translateY(${(1 - p) * -10}px)`,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>DIABET</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: P.ink, marginTop: 2 }}>
        The kiosk TV showing my son Artem's glucose
      </div>
    </div>
  );
};

const NodeChip: React.FC<{ x: number; w: number; y: number; h: number; bg: string; border: string; text: string; textColor: string; fontSize?: number }> = (
  { x, w, y, h, bg, border, text, textColor, fontSize = 13 }
) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: bg,
      border: `2px solid ${border}`,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize,
      fontWeight: 800,
      color: textColor,
      textAlign: "center",
      lineHeight: 1.1,
      padding: "0 6px",
    }}
  >
    {text}
  </div>
);

const Arrow: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: 20, fontWeight: 700, color }}>{"→"}</div>
);

/** Archetype 4 — flow-map lower third. Persists from B1 through END (every beat). */
const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();

  const flipP = tween(sec(frame, B3 + 10, fps), 0, 0.5, ease.power2Out);
  const lightP = tween(sec(frame, B4 + 10, fps), 0, 0.5, ease.power2Out);
  const stampP = tween(sec(frame, B5 + 10, fps), 0, 0.5, ease.power2Out);
  const pulse = 1 + 0.08 * Math.sin(Math.min(1, lightP) * Math.PI);

  const topRow = LT_WIN.y + 10;
  const botRow = LT_WIN.y + 54;
  const rowH = 36;

  return (
    <div
      style={{
        position: "absolute",
        left: LT_WIN.x,
        top: LT_WIN.y,
        width: LT_WIN.w,
        height: LT_WIN.h,
        background: P.card,
        borderTop: `2px solid ${P.accent}`,
        boxShadow: "0 -6px 16px rgba(0,0,0,0.3)",
        fontFamily,
      }}
    >
      <NodeChip x={30} w={110} y={topRow + 18} h={rowH} bg={P.chipBg} border={P.border} text="KIOSK" textColor={P.ink} />
      <Arrow x={150} y={topRow + 26} color={P.muted} />
      <NodeChip x={180} w={110} y={topRow + 18} h={rowH} bg={P.chipBg} border={P.border} text="GATE" textColor={P.ink} />
      <Arrow x={300} y={topRow + 26} color={P.muted} />

      <NodeChip
        x={330}
        w={200}
        y={topRow}
        h={32}
        bg={P.successBg}
        border={P.successEdge}
        text="OTHER ROUTES — unchanged"
        textColor={P.success}
        fontSize={11}
      />

      <div style={{ position: "absolute", left: 330, top: botRow, width: 200, height: 32 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            color: P.danger,
          }}
        >
          HISTORY: blocked
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            color: P.success,
            opacity: flipP,
          }}
        >
          HISTORY: {"≤"}24h
        </div>
      </div>

      <Arrow x={540} y={topRow + 26} color={P.muted} />
      <div style={{ position: "absolute", left: 570, top: topRow + 18, transform: `scale(${pulse})` }}>
        <NodeChip
          x={0}
          w={120}
          y={0}
          h={rowH}
          bg={lightP > 0.5 ? P.accentBg : P.chipBg}
          border={lightP > 0.5 ? P.accent : P.border}
          text="TREND"
          textColor={lightP > 0.5 ? P.accent : P.ink}
        />
      </div>
      <Arrow x={710} y={topRow + 26} color={P.muted} />

      <div
        style={{
          position: "absolute",
          left: 740,
          top: topRow + 14,
          width: 90,
          height: rowH + 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 900,
          color: P.accent,
          opacity: stampP,
          transform: `scale(${mix(stampP, 0.6, 1)})`,
        }}
      >
        24h
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — one number, never a trend */}
      {cut(frame, B1, B2) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="wide"
          from={B1}
          hold={B2 - B1}
          zoom={(t) => COVER * (1 + 0.08 * t)}
          focus={{ x: 0.5, y: 0.25 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "The kiosk screen could only ever show one number",
          tags: ["No history", "No trend", "Just now", "One dot"],
        }}
      />
      <ProductPlate />

      {/* b2 — walled off from history entirely */}
      {cut(frame, B2, B3) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="problem"
          from={B2}
          hold={B3 - B2}
          zoom={(t) => COVER * (1.3 + 0.1 * t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          line1: "The history route rejected every kiosk-scoped request outright",
          line2: "The kiosk only ever saw a single reading, never a trend",
          keywords: ["rejected"],
        }}
      />

      {/* b3 — found the wall inside the API and moved it */}
      {cut(frame, B3, B4) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="fix"
          from={B3}
          hold={B4 - B3}
          zoom={(t) => COVER * (1.65 + 0.13 * t)}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          fromLabel: "BEFORE",
          toLabel: "NOW",
          from: "History route: reject kiosk tokens",
          to: "History route resolves first, clamped to 24h",
          points: [
            "Reorder the route checks in the API",
            "API = bridge/sugar_hub.py's request handler",
            "Kiosk tokens capped at 24h, not refused",
          ],
        }}
      />

      {/* b4 — every reading now shows up as a trend */}
      {cut(frame, B4, B5) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="result"
          from={B4}
          hold={B5 - B4}
          zoom={(t) => COVER * (2.0 + 0.15 * t)}
          focus={{ x: 0.5, y: 0.6 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          steps: ["Every 5-min reading", "History route", "Clamped to 24h"],
          result: "Trend, not snapshot",
        }}
      />

      {/* b5 — one dot became a full day (never the feature page or the hub) */}
      <Arrive at={B5 + 2} kind="wipe" box={{ x: 0, y: 40, w: 1280, h: 92 }} dur={0.4}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(8,8,8,0.7)",
            color: "#fff",
            fontFamily,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: 0.2,
            textAlign: "center",
          }}
        >
          One dot became a full day
        </div>
      </Arrive>
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        data={{
          title: "Kiosk history window",
          a: { label: "Single reading", value: 1 },
          b: { label: "Full day", value: 24 },
          unit: "h",
        }}
      />
      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureKiosksSugarBadgeJustD16: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
