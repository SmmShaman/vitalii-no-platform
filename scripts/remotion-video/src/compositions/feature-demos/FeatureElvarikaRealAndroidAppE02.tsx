// FeatureElvarikaRealAndroidAppE02 — feature e02 — 1280x720, 994 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Timeline lives in the bottom band: five milestones (Browser tab → Android
// install → Lock screen → CI tested → Zero store steps) on a ribbon that fills
// left to right as the voice reaches each one; the active node pulses, finished
// nodes stay lit, the rest stay dim — continuous motion for the whole clip.
// Opener is cornerTags, not titleTakeover (b58/g11/g12 all opened with it).
//
// Beat → effect (data only from the feature row and commit 86095d3):
// b1 15-237   problem: browser tab only, no lock-screen controls.
//             cornerTags over the feature's own page (backdrop) — names the
//             product in the central statement + four problem tags.
// b2 237-410  the fix lands: installs like a real Android app.
//             handoffExplain over the features hub (backdrop) — before/now +
//             three consequences.
// b3 410-607  mechanism: the Media Session API routes lock-screen actions.
//             hubRouting, drawn (no commit names this file, so the mechanism
//             is drawn with the real API name instead of a diff).
// b4 607-770  mechanism: two GitHub Actions workflows build and test every push
//             (android.yml, android-e2e.yml — commit 86095d3's own files).
//             pipelineFlow, drawn.
// b5 770-994  payoff: zero manual steps, zero store review — holds to the end.
//             Drawn LogWindow (no runtime log on the VPS for this product, so
//             the lines are built from the workflow names and the feature's own
//             result text, never invented) — never shows the page or hub again.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/e02.json";

const B1 = 15;
const B2 = 237;
const B3 = 410;
const B4 = 607;
const B5 = 770;
const END = 994;

const ACCENT = "#5B37D4"; // violet's native accent — reads fine on the dark stage
const STAGE = "#120E22";

// Lower band geometry (1280x720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const NODES = [
  { label: "Browser tab" },
  { label: "Android install" },
  { label: "Lock screen" },
  { label: "CI tested" },
  { label: "Zero store steps" },
];
const STARTS = [B1, B2, B3, B4, B5];

const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const bandOpacity = tween(sec(frame, B1, fps), 0, 0.3, ease.power2Out);

  // Progress along the ribbon slides continuously from 0 to 1 across the whole clip.
  const progress = tween(sec(frame, B1, fps), 0, (END - B1) / fps, ease.linear);
  const n = NODES.length;
  const nodeX = (i: number) => LT.x + 30 + (i * (LT.w - 60)) / (n - 1);
  const lineY = LT.y + 22;

  let activeIndex = 0;
  for (let i = 0; i < STARTS.length; i++) if (frame >= STARTS[i]) activeIndex = i;
  const pulse = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(sec(frame, B1, fps) * 2.2));

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity: bandOpacity }}>
      {/* base rail */}
      <div style={{ position: "absolute", left: nodeX(0), top: lineY - 1, width: nodeX(n - 1) - nodeX(0), height: 2, background: P.border }} />
      {/* filled rail */}
      <div
        style={{
          position: "absolute",
          left: nodeX(0),
          top: lineY - 1,
          width: (nodeX(n - 1) - nodeX(0)) * progress,
          height: 2,
          background: P.accent,
        }}
      />
      {NODES.map((node, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const scale = active ? punchScale(sec(frame, STARTS[i], fps), 0) : 1;
        return (
          <div key={node.label} style={{ position: "absolute", left: nodeX(i) - 70, top: lineY - 44, width: 140, textAlign: "center" }}>
            <div
              style={{
                margin: "0 auto",
                width: 16,
                height: 16,
                borderRadius: 8,
                background: done || active ? P.accent : P.card,
                border: `2px solid ${done || active ? P.accent : P.border}`,
                boxShadow: active ? `0 0 ${6 + 6 * pulse}px ${P.accentEdge}` : "none",
                transform: `scale(${Math.max(scale, done ? 1 : 0.85)})`,
              }}
            />
            <div
              style={{
                marginTop: 8,
                fontFamily,
                fontSize: 14,
                fontWeight: done || active ? 800 : 500,
                color: done || active ? P.ink : P.muted,
              }}
            >
              {node.label}
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
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "Elvarika — text becomes a lesson",
          tags: ["No lock-screen play", "Browser tab only", "Stuck mid-walk", "Tab must stay open"],
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
          from: "Browser tab only",
          to: "Real Android app",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Installs like a native app", "Lock-screen controls work", "Play, pause, skip, stop"],
        }}
      />

      {/* b3 — the mechanism, drawn */}
      <MotionInsert
        effect="hubRouting"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          inputs: ["Play", "Pause", "Next track", "Stop"],
          hub: "Media Session API",
          output: "App playback",
        }}
      />

      {/* b4 — the CI mechanism, drawn */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          steps: ["Push code", "Build APK", "Test on emulator"],
          result: "Signed APK ready",
          system: "GitHub Actions",
        }}
      />

      {/* b5 — show it running, holds to the true end */}
      {frame >= B5 && (
        <LogWindow
          title="android.yml"
          from={B5}
          every={16}
          opacity={logOpacity}
          fontSize={22}
          lines={[
            { t: "00:00", text: "push -> main", tone: "accent" },
            { t: "00:04", text: "android.yml: build APK", tone: "ink" },
            { t: "00:41", text: "APK signed", tone: "success" },
            { t: "00:42", text: "android-e2e.yml: emulator boot", tone: "ink" },
            { t: "01:58", text: "play / pause / stop on lock screen OK", tone: "success" },
            { t: "02:10", text: "0 manual steps, 0 store review", tone: "success" },
          ]}
        />
      )}

      <Timeline />
    </AbsoluteFill>
  );
};

export const FeatureElvarikaRealAndroidAppE02: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
