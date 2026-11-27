// FeatureGuitarThatsReallyPlayedB116 — feature b116 — 1280x720, 919 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row; no live commit page is verified
// tonight, so the mechanism is drawn with the real file/commit names instead):
// b1 15-250   "a guitar actually played, a shape that really folds — each one
//              meant a brand new effect built from scratch"
//              funnelAbsorption over the live feature page. Zoom panel: a guitar
//              glyph and a cube wireframe, each tagged "from scratch".
// b2 250-340  "the duplicate code only kept piling up"
//              keywordCaption, drawn. Zoom panel: three near-identical code
//              blocks stack up.
// b3 340-526  "the shared pieces — timing, camera, checks — pulled into one kit"
//              hubRouting, drawn. Zoom panel: the stack collapses into one
//              labelled "Shared model kit" box.
// b4 526-776  "its first real test: a real photo, camera walking to each
//              labelled point instead of a drawn diagram"
//              handoffExplain, drawn with the real file name (LabelledPicture.tsx).
//              Zoom panel: a photo frame with up to 6 pins, camera walks pin to pin.
// b5 776-919  "the kit held up — model effects now number four"
//              drawn result, no catalog effect. Zoom panel reaches its closest
//              frame on a "4" badge with the four effect chips checked; a
//              LogWindow reveals the real count and point limit. Holds to END,
//              no fade.
//
// Persistent element: the Zoom panel (archetype 2) — one big frame, center,
// slowly zooming in (scale 1.0 → 1.35) from b1 to the end, its focus point
// walking beat to beat the same way the feature's own LabelledPicture effect
// walks its camera to each labelled point.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/b116.json";

const B1 = 15;
const B2 = 250;
const B3 = 340;
const B4 = 526;
const B5 = 776;
const END = 919;

/** Dawn's own accent (#2563EB) reads clean on a dark navy stage. */
const ACCENT = "#2563EB";
const STAGE = "#0B1324";

const PANEL = { x: 240, y: 70, w: 800, h: 460 };

const ProductNamePlate: React.FC = () => {
  const P = usePalette();
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 40, w: 320, h: 56 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 320,
          height: 56,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>Lesson Video — model effects kit</div>
      </div>
    </Arrive>
  );
};

const CODE_STACK = [0, 1, 2];
const PINS = [
  { x: 0.22, y: 0.3, label: "roof" },
  { x: 0.55, y: 0.22, label: "flag" },
  { x: 0.78, y: 0.45, label: "door" },
  { x: 0.4, y: 0.65, label: "window" },
];

const ZoomPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const scale = interpolate(frame, [B1, END], [1, 1.35], { extrapolateRight: "clamp" });
  const focusX = frame < B4 ? 0.5 : interpolate(frame, [B4, B5], [0.22, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const originX = PANEL.x + PANEL.w * focusX;
  const originY = PANEL.y + PANEL.h * 0.5;

  const pinIndex = Math.min(PINS.length - 1, Math.floor(((frame - B4) / (B5 - B4)) * PINS.length));

  return (
    <Arrive at={B1 + 4} kind="wipe" box={PANEL} dur={0.45}>
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          background: P.card,
          border: `2px solid ${P.border}`,
          borderRadius: 8,
          boxShadow: "10px 10px 0 rgba(0,0,0,0.12)",
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: `${originX}px ${originY}px`,
        }}
      >
        {/* b1 — guitar + cube, each a from-scratch effect */}
        {frame >= B1 && frame < B2 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 120 }}>🎸</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, marginTop: 8 }}>Guitar effect</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: P.danger, background: P.dangerBg, borderRadius: 4, padding: "3px 10px", marginTop: 6, display: "inline-block" }}>from scratch</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 110, height: 110, border: `6px solid ${P.accent}`, borderRadius: 10, transform: "rotate(18deg)" }} />
              <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, marginTop: 8 }}>Solid-fold effect</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: P.danger, background: P.dangerBg, borderRadius: 4, padding: "3px 10px", marginTop: 6, display: "inline-block" }}>from scratch</div>
            </div>
          </div>
        )}

        {/* b2 — duplicate code piling up */}
        {frame >= B2 && frame < B3 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 0, flexDirection: "column-reverse", padding: 40 }}>
            {CODE_STACK.map((i) => {
              const t = Math.min(1, Math.max(0, (frame - (B2 + i * 18)) / 16));
              return (
                <div
                  key={i}
                  style={{
                    width: 560,
                    height: 70,
                    marginBottom: 10,
                    background: P.dangerBg,
                    border: `2px solid ${P.dangerEdge}`,
                    borderRadius: 6,
                    opacity: t,
                    transform: `translateY(${(1 - t) * 30}px)`,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 20,
                    fontSize: 15,
                    fontWeight: 700,
                    color: P.danger,
                  }}
                >
                  effect code (copy {i + 1})
                </div>
              );
            })}
          </div>
        )}

        {/* b3 — the stack collapses into one shared kit */}
        {frame >= B3 && frame < B4 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 420,
                height: 240,
                background: P.accentBg,
                border: `3px solid ${P.accentEdge}`,
                borderRadius: 10,
                padding: 24,
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: P.accent, marginBottom: 14 }}>Shared model kit</div>
              {["Timing", "Camera moves", "Checks"].map((label, i) => {
                const t = Math.min(1, Math.max(0, (frame - (B3 + 20 + i * 22)) / 18));
                return (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 10,
                      opacity: t,
                      transform: `translateX(${(1 - t) * -40}px)`,
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: P.accent }} />
                    <div style={{ fontSize: 16, fontWeight: 700, color: P.ink }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* b4 — a real photo, camera walking pin to pin */}
        {frame >= B4 && frame < B5 && (
          <div style={{ position: "absolute", left: 20, top: 20, width: PANEL.w - 40, height: PANEL.h - 40, background: P.bgBottom, borderRadius: 6 }}>
            {PINS.map((p, i) => {
              const active = i <= pinIndex;
              return (
                <div
                  key={p.label}
                  style={{
                    position: "absolute",
                    left: (PANEL.w - 40) * p.x - 10,
                    top: (PANEL.h - 40) * p.y - 10,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    background: active ? P.accent : P.chipBg,
                    border: `2px solid ${active ? P.accent : P.border}`,
                  }}
                >
                  {active && (
                    <div style={{ position: "absolute", left: 24, top: -4, fontSize: 13, fontWeight: 800, color: P.ink, background: P.card, borderRadius: 4, padding: "2px 8px", whiteSpace: "nowrap" }}>
                      {p.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* b5 — closest zoom, the result: four effects */}
        {frame >= B5 && (
          <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontSize: 140, fontWeight: 900, color: P.accent, lineHeight: 1 }}>4</div>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {["Guitar", "Solid-fold", "Example series", "Labelled picture"].map((label) => (
                <div
                  key={label}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: P.success,
                    background: P.successBg,
                    border: `1px solid ${P.successEdge}`,
                    borderRadius: 4,
                    padding: "4px 10px",
                  }}
                >
                  ✓ {label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Arrive>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — two real-physics effects, each built from scratch, over the live feature page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          inputs: ["Guitar effect", "Solid-fold effect", "Example-series effect"],
          result: "Each one, a brand-new effect, every time",
        }}
      />
      {cut(frame, B1, B2) === 1 && <ProductNamePlate />}

      {/* b2 — the duplicate code piling up, drawn (no public page proves this) */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{ line1: "The duplicate code", line2: "just kept piling up", keywords: ["duplicate code"] }}
      />

      {/* b3 — the shared pieces pulled into one kit */}
      <MotionInsert
        effect="hubRouting"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{ inputs: ["Timing", "Camera moves", "Checks"], hub: "Shared model kit", output: "Reused by every effect" }}
      />

      {/* b4 — the first real test: a real photo, camera walking to each labelled point */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.72}
        base={STAGE}
        data={{
          from: "Drawn diagram",
          to: "Real photo, camera walks to each point",
          points: ["LabelledPicture.tsx", "Camera walks to up to 6 points", "Built on the shared kit"],
        }}
      />

      {/* b5 — the result: four model effects now exist. Drawn, holds to the end. */}
      {frame >= B5 && (
        <LogWindow
          title="model kit"
          from={B5 + 20}
          every={16}
          opacity={1}
          win={{ x: 60, y: 560, w: 560, h: 150 }}
          fontSize={18}
          lines={[
            { t: "01", text: "model_effects_count: 4", tone: "accent" },
            { t: "02", text: "labelled_points_max: 6", tone: "success" },
            { t: "03", text: "proof_cards: 3", tone: "ink" },
            { t: "04", text: "shared kit: phases, camera, checks, look", tone: "success" },
          ]}
        />
      )}

      <ZoomPanel />
    </AbsoluteFill>
  );
};

export const FeatureGuitarThatsReallyPlayedB116: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
