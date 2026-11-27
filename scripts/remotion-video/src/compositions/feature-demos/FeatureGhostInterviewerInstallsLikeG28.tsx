// FeatureGhostInterviewerInstallsLikeG28 — feature g28 — 1280x720, 893 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline ribbon, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row and commit cfda506f):
// b1 15-190  "a browser tab you might lose if Safari reloads the page mid-call"
//            copyCorrection over the live product (ghost.vitalii.no). Ribbon gets
//            its first stamp: BROWSER TAB, lit red.
// b2 190-367 "no native install prompt on iOS — most people just kept a bookmark"
//            statusFocus over the live product, scrolled further. Ribbon stamp two:
//            INSTALL PROMPT, Android yes / iPhone no.
// b3 367-531 "IS_MOBILE check + InstallAppButton.tsx — a real install path on Android,
//            manual Add to Home Screen on iOS"
//            handoffExplain over the real commit (cfda506f), windowed and zoomed to
//            one hunk. Ribbon stamp three: INSTALL BUTTON, lights up.
// b4 531-721 "the manifest + service worker: network-first, cache-fallback shell"
//            pipelineFlow — invisible plumbing, no public page to show, drawn only.
//            Ribbon stamp four: SHELL CACHED, lights up.
// b5 721-893 "opens from a home-screen icon in one tap, on both Android and iOS"
//            drawn result, no catalog effect — ribbon's fifth and final stamp
//            (INSTALLED ✓) lights up, a LogWindow reveals the install facts.
//            Holds to the end, no fade.
//
// Persistent element: the timeline ribbon lower third (archetype 1), b1 through b5.
// Effects keep the bottom 200/1080 px clear (look.safeBottom) — that is where it sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shotsFile from "./shots/g28.json";

const B1 = 15;
const B2 = 190;
const B3 = 367;
const B4 = 531;
const B5 = 721;
const END = 893;

/** Violet's own accent (#5B37D4) reads clean on a dark violet-tinted stage. */
const ACCENT = "#5B37D4";
const STAGE = "#170F33";

// Lower-third ribbon geometry (1280x720, below the effects' safe bottom at y≈587).
const RIBBON = { x: 40, y: 606, w: 1200, h: 92 };
const STAMP_Y = RIBBON.y + 18;
const STAMP_W = 180;
const STAMP_GAP = 220;
const STAMP_X0 = RIBBON.x + 30;
const LINE_Y = STAMP_Y + 28;

type Stamp = { label: string; sub: string; at: number };
const STAMPS: Stamp[] = [
  { label: "BROWSER TAB", sub: "one bad reload, gone", at: B1 + 10 },
  { label: "INSTALL PROMPT", sub: "Android yes, iPhone no", at: B2 + 10 },
  { label: "INSTALL BUTTON", sub: "cfda506f", at: B3 + 10 },
  { label: "SHELL CACHED", sub: "ghost-shell-v1", at: B4 + 10 },
  { label: "INSTALLED", sub: "one tap, both OSes", at: B5 + 10 },
];

const ProductNamePlate: React.FC = () => {
  const P = usePalette();
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 40, w: 300, h: 56 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 300,
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
        <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>Ghost Interviewer AI</div>
      </div>
    </Arrive>
  );
};

const MECH_BOX = { x: 40, y: 40, w: 1200, h: 130 };
const MECH_STEPS = ["Request the shell", "Try the network first", "Fall back to cache"];

/** b4 has no live page ("invisible plumbing") and PipelineFlow's own chain is
 * small and centered — this top banner keeps the beat from reading empty. */
const ServiceWorkerBanner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B4 || frame >= B5) return null;
  return (
    <Arrive at={B4 + 4} kind="wipe" box={MECH_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: MECH_BOX.x,
          top: MECH_BOX.y,
          width: MECH_BOX.w,
          height: MECH_BOX.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          padding: "16px 28px",
          boxSizing: "border-box",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.accent }}>SERVICE WORKER — INVISIBLE PLUMBING</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: P.ink, marginTop: 4 }}>network-first, cache-fallback shell</div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {MECH_STEPS.map((s, i) => (
            <div
              key={s}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: P.muted,
                background: P.chipBg,
                border: `1px solid ${P.border}`,
                borderRadius: 3,
                padding: "4px 10px",
              }}
            >
              {String(i + 1).padStart(2, "0")} {s}
            </div>
          ))}
        </div>
      </div>
    </Arrive>
  );
};

const Ribbon: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const litCount = STAMPS.filter((s) => frame >= s.at).length;
  const lastX = STAMP_X0 + (litCount - 1) * STAMP_GAP + STAMP_W / 2;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={RIBBON} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: RIBBON.x,
            top: RIBBON.y,
            width: RIBBON.w,
            height: RIBBON.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        {/* base rail */}
        <div
          style={{
            position: "absolute",
            left: STAMP_X0 + STAMP_W / 2,
            top: LINE_Y,
            width: STAMP_GAP * (STAMPS.length - 1),
            height: 3,
            background: P.border,
          }}
        />
        {/* lit rail, grows stamp by stamp */}
        {litCount > 1 && (
          <div
            style={{
              position: "absolute",
              left: STAMP_X0 + STAMP_W / 2,
              top: LINE_Y,
              width: lastX - (STAMP_X0 + STAMP_W / 2),
              height: 3,
              background: P.accent,
            }}
          />
        )}
      </Arrive>

      {STAMPS.map((s, i) => {
        if (frame < s.at - 6) return null;
        const x = STAMP_X0 + i * STAMP_GAP;
        const lit = frame >= s.at;
        return (
          <Arrive key={s.label} at={s.at} kind="punch" box={{ x, y: STAMP_Y, w: STAMP_W, h: 56 }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: STAMP_Y,
                width: STAMP_W,
                height: 56,
                background: lit ? P.accentBg : P.chipBg,
                border: `2px solid ${lit ? P.accentEdge : P.border}`,
                borderRadius: 4,
                padding: "6px 10px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: lit ? P.accent : P.muted }}>
                {lit ? "✓ " : ""}
                {s.label}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, marginTop: 2 }}>{s.sub}</div>
            </div>
          </Arrive>
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — a browser tab, one bad reload and it's gone, over the live product */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="product" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="copyCorrection"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          wrong: "Just a browser tab",
          right: "One reload, gone",
          label: "Before",
        }}
      />
      {cut(frame, B1, B2) === 1 && <ProductNamePlate />}

      {/* b2 — iOS has no install prompt at all, over the live product scrolled further */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="product2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Install prompt",
          claims: [
            { text: "Android gets a native prompt", verdict: "yes" },
            { text: "iPhone gets one too", verdict: "no" },
          ],
        }}
      />

      {/* b3 — the fix, over the real commit, zoomed to one hunk */}
      {cut(frame, B3, B4) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="commit"
          title="github.com/SmmShaman/Ghost-Interviewer-AI/commit/cfda506f"
          from={B3}
          hold={B4 - B3}
          zoom={() => 2.2}
          focus={{ x: 0.5, y: 0.42 }}
          opacity={1}
          win={{ x: 40, y: 40, w: 1200, h: 540 }}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.72}
        data={{
          from: "Browser tab, easy to lose",
          to: "Home-screen app icon",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["cfda506f", "Standalone app manifest", "192 and 512 px icons"],
        }}
      />

      {/* b4 — the manifest + service worker: invisible plumbing, no public page to show */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["Request the shell", "Try the network first", "Fall back to cache"],
          result: "App shows, even on a weak connection",
          system: "Service worker",
        }}
      />
      <ServiceWorkerBanner />

      {/* b5 — the result: one tap from the home screen, on both Android and iOS. Drawn, holds to the end. */}
      {frame >= B5 && (
        <LogWindow
          title="service worker"
          from={B5 + 20}
          every={16}
          opacity={1}
          win={{ x: 140, y: 70, w: 1000, h: 480 }}
          fontSize={22}
          lines={[
            { t: "01", text: "manifest: standalone, icons 192/512", tone: "accent" },
            { t: "02", text: "beforeinstallprompt: captured (Android)", tone: "success" },
            { t: "03", text: "iOS: manual Add to Home Screen steps shown", tone: "ink" },
            { t: "04", text: "sw.js: registered in production", tone: "success" },
            { t: "05", text: "cache: ghost-shell-v1, network-first", tone: "success" },
            { t: "06", text: "status: opens in one tap, both platforms", tone: "success" },
          ]}
        />
      )}

      <Ribbon />
    </AbsoluteFill>
  );
};

export const FeatureGhostInterviewerInstallsLikeG28: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
