// FeatureForgotClockOutFixB115 — feature b115 — 1280x720, 958 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// b1 (15-214): live page + funnelAbsorption — a dead/forgotten phone, either way the
//   clock-out time comes out wrong. Product plate names Boytasks.
// b2 (214-447): deck opens — cornerTags — the old fix needed a laptop, the TV was read-only.
// b3 (447-614): deck flips — handoffExplain — now the TV remote edits the end time directly.
// b4 (614-747): deck flips — pipelineFlow — one more tap reverts to the original GPS time.
// b5 (747-958): deck flips — ratioBars + LogWindow — 5 new tests, 62 days of lookback. Holds
//   at full brightness to the final frame, no live page, no hub.
//
// Persistent archetype element: CardDeck — a rounded "active card" with two duller cards
// peeking out behind it, and a 4-tab strip across the top that highlights the current
// beat's tab. It is the frame's dominant shape from b2 onward; each MotionInsert effect
// paints its own content (plate=0, no base) directly onto the card's face.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/b115.json";

const B1 = 15;
const B2 = 214;
const B3 = 447;
const B4 = 614;
const B5 = 747;
const END = 958;

const ACCENT = "#B4531F"; // sand accent

const CARD = { x: 110, y: 78, w: 1060, h: 560 };

const ProductNamePlate: React.FC = () => {
  const P = usePalette();
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 40, w: 420, h: 56 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 420,
          height: 56,
          borderRadius: 12,
          background: P.card,
          border: `2px solid ${P.accentEdge}`,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          fontFamily,
          fontSize: 20,
          fontWeight: 700,
          color: P.ink,
        }}
      >
        Boytasks — edit a shift's end time from the TV
      </div>
    </Arrive>
  );
};

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B2) return null;

  const starts = [B2, B3, B4, B5];
  const titles = ["Old fix", "TV remote", "Revert", "Tests"];
  const tilts = [-6, 5, -4, 6];
  let idx = 0;
  if (frame >= B5) idx = 3;
  else if (frame >= B4) idx = 2;
  else if (frame >= B3) idx = 1;
  else idx = 0;

  const beatStart = starts[idx];
  const settle = interpolate(frame, [beatStart, beatStart + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotate = tilts[idx] * (1 - settle);
  const scale = 0.94 + 0.06 * settle;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: CARD.x + 20,
          top: CARD.y + 26,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 28,
          background: P.chipBg,
          border: `2px solid ${P.border}`,
          transform: "rotate(4deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CARD.x + 10,
          top: CARD.y + 14,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 28,
          background: P.card,
          border: `2px solid ${P.border}`,
          transform: "rotate(-2deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 28,
          background: P.card,
          border: `4px solid ${ACCENT}`,
          boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
          transform: `rotate(${rotate}deg) scale(${scale})`,
          transformOrigin: `${CARD.x + CARD.w / 2}px ${CARD.y + CARD.h / 2}px`,
        }}
      />
      <div style={{ position: "absolute", left: 124, top: 16, display: "flex", gap: 24 }}>
        {titles.map((t, i) => {
          const active = i === idx;
          return (
            <div
              key={t}
              style={{
                width: 240,
                height: 50,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 20,
                fontWeight: 700,
                background: active ? ACCENT : P.chipBg,
                color: active ? "#FFFFFF" : P.muted,
                border: `2px solid ${active ? ACCENT : P.border}`,
                transform: active ? "translateY(-6px)" : "translateY(0px)",
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${P.bgTop}, ${P.bgBottom})` }}>
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ inputs: ["Phone dies mid-shift", "Forgotten in a bag"], result: "Clock-out time comes out wrong" }}
      />
      {cut(frame, B1, B2) === 1 && <ProductNamePlate />}

      <CardDeck />

      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0}
        data={{ statement: "No way to fix it from the couch", tags: ["Needs a laptop", "Admin panel login", "TV was read-only"] }}
      />

      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0}
        data={{
          from: "Laptop + admin login",
          to: "TV remote, direct edit",
          points: ["No login needed", "No laptop needed", "Edits the end time directly"],
        }}
      />

      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0}
        data={{ steps: ["Edit end time", "Tap once more", "Revert to original GPS time"], result: "Always recoverable", system: "One-click undo" }}
      />

      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0}
        data={{ a: { label: "New tests", value: 5 }, b: { label: "Days checked back", value: 62 } }}
      />

      {frame >= B5 + 20 && (
        <LogWindow
          title="work-report"
          from={B5 + 20}
          every={16}
          opacity={1}
          win={{ x: 160, y: 560, w: 620, h: 150 }}
          fontSize={18}
          lines={[
            { t: "01", text: "edit_requires_login: false", tone: "success" },
            { t: "02", text: "laptop_required: false", tone: "success" },
            { t: "03", text: "tests_added: 5", tone: "accent" },
            { t: "04", text: "lookback_days: 62", tone: "ink" },
          ]}
        />
      )}
    </AbsoluteFill>
  );
};

export const FeatureForgotClockOutFixB115: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
