// FeatureStickGuardCameraSnapshotsB58 — feature b58 — 1280x720, 908 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per spoken sentence (shots/b58.motion.json), over the real
// product page as evidence where a verified URL exists (only the feature's own
// page is verified tonight — no commit page, the commit below is drawn as a
// label, never recorded), one owner of the frame, a reading hold at the end of
// every beat, cuts not fades.
//
// Beat → effect (data only from the feature row and commit 32f154b):
// b1 15-249   "One old phone on a shelf kept the camera and stick guard alive —
//             a dropped Wi-Fi handshake and nobody noticed until dark."
//             titleTakeover over the feature's own page (backdrop "page"). The
//             hero number opens on 1 — ONE PHONE, every service on it.
// b2 249-416  "Like running security on someone's personal cellphone — one dead
//             battery and it's dark."
//             keywordCaption, no backdrop (the analogy is drawn, not evidenced).
//             The hero number stays 1 but re-lands on a new label — ONE
//             BATTERY — so nothing sits unchanged across the cut.
// b3 416-653  "Now a small Python script runs as a background service on the
//             home PC itself, restarting automatically after every reboot."
//             handoffExplain, drawn (commit 32f154b names bridge.py — labelled,
//             never recorded, no verified commit URL tonight). The hero number
//             jumps to 311 — the real line count of that script.
// b4 653-908  "Camera feed, stick guard, PTZ, and tunnel access — all four
//             services now survive a reboot without anyone touching a phone."
//             cardCounter draws the four services themselves (never the page or
//             hub — gate 2), over a LogWindow built from this feature's own
//             services (bridge.py's own job list, not a runtime log — none
//             exists on the VPS for this product). The hero number lands on 4
//             and holds, full brightness, to the final frame.
//
// Persistent element: the hero number (archetype 7), b1 through b5 — it owns
// the frame at fontSize 230, left of centre, changing value and label every
// beat (1 → 1 relabelled → 311 → 4) while the effects above it carry the event.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/b58.json";

const B1 = 15;
const B2 = 249;
const B3 = 416;
const B4 = 653;
const END = 908;

/** Bright slate accent tuned to read on the dark plate. */
const ACCENT = "#7FC4FF";
const STAGE = "#0D1620";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type HeroState = { value: string; label: string; kicker: string; tone: "danger" | "accent" | "success" };

function heroFor(frame: number): HeroState {
  if (frame < B2) return { value: "1", label: "ONE PHONE", kicker: "SINGLE POINT OF FAILURE", tone: "danger" };
  if (frame < B3) return { value: "1", label: "ONE BATTERY", kicker: "AND THE WHOLE CHAIN WENT DARK", tone: "danger" };
  if (frame < B4) return { value: "311", label: "LINES OF PYTHON", kicker: "COMMIT 32f154b · bridge.py", tone: "accent" };
  return { value: "4", label: "SERVICES SURVIVE A REBOOT", kicker: "GUARD · FRAMES · PTZ · TUNNELS", tone: "success" };
}

const HeroNumber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;
  const hero = heroFor(frame);
  // Re-lands every time the beat (and so the hero state) changes — a fresh punch, not a static hold.
  const changeAt = frame < B2 ? B1 : frame < B3 ? B2 : frame < B4 ? B3 : B4;
  const t = sec(frame, changeAt + 4, fps);
  const sc = punchScale(Math.max(t, 0), 0);
  const in0 = tween(Math.max(t, 0), 0, 0.3, ease.power3Out);
  const tone = hero.tone === "danger" ? P.danger : hero.tone === "success" ? P.success : P.accent;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={changeAt + 2} kind="wipe" box={{ x: 70, y: 150, w: 600, h: 40 }} dur={0.4}>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 150,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2.2,
            color: P.muted,
          }}
        >
          {hero.kicker}
        </div>
      </Arrive>

      <div
        style={{
          position: "absolute",
          left: 70,
          top: 210,
          width: 640,
          fontSize: 230,
          lineHeight: 0.95,
          fontWeight: 800,
          letterSpacing: -6,
          color: tone,
          transform: `scale(${sc})`,
          transformOrigin: "left top",
          opacity: in0,
        }}
      >
        {hero.value}
      </div>

      <Arrive at={changeAt + 14} kind="rise" box={{ x: 70, y: 470, w: 600, h: 40 }}>
        <div style={{ position: "absolute", left: 70, top: 470, fontSize: 27, fontWeight: 700, color: P.ink }}>
          {hero.label}
        </div>
      </Arrive>
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
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "One phone, every service", kicker: "Camera, stick guard, PTZ, two tunnels — all on one phone" }}
      />

      {/* b2 — the analogy, drawn, no backdrop */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "Security on someone's personal cellphone",
          line2: "one dead battery and it's dark",
          keywords: ["personal cellphone", "dead battery"],
        }}
      />

      {/* b3 — the fix, drawn (commit 32f154b named, never recorded — not a verified URL tonight) */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          from: "Phone on a shelf (Termux)",
          to: "Home PC, Scheduled Task",
          fromLabel: "Before",
          toLabel: "Now",
          points: ["311-line Python script", "SYSTEM account", "Restarts itself every reboot"],
        }}
      />

      {/* b4 — the result, drawn, never the page/hub (gate 2); LogWindow built from this feature's own services */}
      {frame >= B4 && (
        <LogWindow
          lines={[
            { text: "bridge.py — SYSTEM scheduled task", tone: "muted" },
            { text: "guard: running", tone: "success" },
            { text: "frames → R2: uploading", tone: "success" },
            { text: "ptz: relay ok", tone: "success" },
            { text: "tunnel rtsp → oracle-vm: up", tone: "success" },
            { text: "tunnel sshd → oracle-vm: up", tone: "success" },
            { text: "reboot: auto-restart armed", tone: "accent" },
          ]}
          title="bridge.py"
          from={B4}
          every={16}
          opacity={1}
        />
      )}
      <MotionInsert
        effect="cardCounter"
        from={B4}
        dur={END - B4}
        accent={ACCENT}
        plate={0.72}
        data={{
          cards: [
            { label: "Camera feed", value: 1 },
            { label: "Stick guard", value: 1 },
            { label: "PTZ relay", value: 1 },
            { label: "SSH tunnels", value: 1 },
          ],
          totalLabel: "services survive a reboot",
          summary: "All four, every reboot",
        }}
      />

      <HeroNumber />
    </AbsoluteFill>
  );
};

export const FeatureStickGuardCameraSnapshotsB58: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
