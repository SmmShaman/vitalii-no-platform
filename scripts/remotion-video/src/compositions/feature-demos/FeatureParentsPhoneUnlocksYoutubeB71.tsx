// FeatureParentsPhoneUnlocksYoutubeB71 — feature b71 — 1280x720, 898 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// On Oct 14 the family's YouTube gate (tier 2) defaulted OPEN whenever nobody had
// started a task, so a quiet morning read as 80 free minutes with zero chores done.
// The fix flips the default to locked and gives a parent a fast way back in: a QR
// scan, a Google sign-in, a WebAuthn fingerprint check — no shared password.
// Archetype 2 (zoom-in) is a persistent viewfinder strip, bottom band, that zooms
// tighter and narrows its focus caption every beat, from "wide view of the gate"
// down to "30 min window granted" — the camera is the dominant device under each
// beat's effect, the way the flow-map lower third carried p75.
//
// Beat -> effect (data only from the feature row; the boytasks repo is private, so
// the parent-phone mechanism is drawn with the feature's own terms, not recorded):
// b1 15-199   "80 minutes, zero chores" titleTakeover over the feature's own page.
// b2 199-378  "nobody had to earn it" cornerTags, page scrolled further (page2).
// b3 378-506  "now it defaults locked" copyCorrection, page scrolled further still
//             (page3).
// b4 506-747  "scan, sign in, confirm" pipelineFlow — QR -> Google -> WebAuthn,
//             drawn (no public page for a parent's phone flow); WebAuthn is the
//             clip's one tech name, glossed right on the pipeline frame.
// b5 747-898  "30 minutes of access" drawn result: a LogWindow built from the
//             feature's own numbers, plus the hero "30 MIN" stamp; holds to the end.
//
// Persistent element: the zoom viewfinder strip (archetype 2), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/b71.json";

const B1 = 15;
const B2 = 199;
const B3 = 378;
const B4 = 506;
const B5 = 747;
const END = 898;

/** Accent tuned for the dark stage (slate's #0E7490 is too dark on a plate). */
const ACCENT = "#49C5E0";
const STAGE = "#101B20";

// Lower third geometry (1280x720, below the effects' safe bottom at y~587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const ZOOM_VALUES = [1.0, 1.4, 1.9, 2.5, 3.2];
const FOCUS_LABELS = [
  "Tier 2 gate — wide view",
  "Default: OPEN (bug)",
  "Default: LOCKED (fix)",
  "QR → Google → WebAuthn",
  "Granted: 30 min window",
];

/** Archetype 2 (zoom-in): a viewfinder that zooms tighter and renames its focus every beat. */
const ZoomStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const starts = [B1, B2, B3, B4, B5];
  let idx = 0;
  for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) idx = i;
  const beatStart = starts[idx];
  const pulse = punchScale(sec(frame, beatStart, fps), 0);
  const zoom = ZOOM_VALUES[idx];
  const focus = FOCUS_LABELS[idx];
  const tone = idx <= 1 ? P.danger : idx === 2 ? P.accent : P.success;

  return (
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
      <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: 210 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>PARENT OVERRIDE</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4 }}>zoom viewfinder</div>
      </div>
      {/* crosshair that physically scales up with the zoom value */}
      <div
        style={{
          position: "absolute",
          left: LT.x + 272,
          top: LT.y + 16,
          width: 60,
          height: 60,
          transform: `scale(${1 + (zoom - 1) * 0.16})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, border: `3px solid ${tone}`, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 27, top: -6, width: 6, height: 20, background: tone }} />
        <div style={{ position: "absolute", left: 27, top: 46, width: 6, height: 20, background: tone }} />
        <div style={{ position: "absolute", left: -6, top: 27, width: 20, height: 6, background: tone }} />
        <div style={{ position: "absolute", left: 46, top: 27, width: 20, height: 6, background: tone }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: LT.x + 360,
          top: LT.y + 19,
          fontSize: 30,
          fontWeight: 800,
          color: tone,
          fontVariantNumeric: "tabular-nums",
          transform: `scale(${pulse})`,
          transformOrigin: "left center",
        }}
      >
        {zoom.toFixed(1)}&times;
      </div>
      <div style={{ position: "absolute", left: LT.x + 500, top: LT.y + 17, width: 660 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>FOCUS</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: P.ink, marginTop: 4 }}>{focus}</div>
      </div>
    </Arrive>
  );
};

/** b4 — top caption for the drawn-only mechanism beat (no public page for a phone flow). */
const DrawnCaption: React.FC<{ text: string; from: number; dur: number }> = ({ text, from, dur }) => {
  const frame = useCurrentFrame();
  if (cut(frame, from, from + dur) !== 1) return null;
  return (
    <Arrive at={from + 6} kind="rise" box={{ x: 40, y: 56, w: 1200, h: 90 }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 56,
          width: 1200,
          padding: "20px 32px",
          background: "rgba(10,16,20,0.85)",
          border: `2px solid ${ACCENT}`,
          borderRadius: 6,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 0.4,
          color: "#E8FBFF",
          fontFamily,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </div>
    </Arrive>
  );
};

/** The hero number for the result beat — arrives with a punch, holds to the end. */
const ResultStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < B5 + 20) return null;
  const sc = punchScale(sec(frame, B5 + 20, fps), 0);
  return (
    <div
      style={{
        position: "absolute",
        left: 940,
        top: 118,
        width: 260,
        height: 110,
        borderRadius: 6,
        background: ACCENT,
        color: "#061217",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
        transform: `scale(${sc})`,
      }}
    >
      <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>30</div>
      <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.6 }}>MIN GRANTED</div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — the problem: a quiet gate, 80 free minutes, zero chores */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "80 minutes, zero chores", kicker: "Oct 14 — the gate stayed open anyway" }}
      />

      {/* b2 — why: tier 2 defaulted open, nobody had to earn it */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Tier 2 defaulted to OPEN",
          tags: ["No tasks started", "Nobody had to earn it", "Default stayed open", "Oct 14: 80 min free"],
        }}
      />

      {/* b3 — the fix: default flips from open to locked */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="copyCorrection"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{ wrong: "Tier 2 opens by default", right: "Tier 2 locks by default", label: "NOW" }}
      />

      {/* b4 — the mechanism: scan, sign in, confirm (drawn, no public page for a phone flow) */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          steps: ["Scan the kiosk QR", "Sign in with Google", "Confirm with WebAuthn"],
          result: "Tier 2 unlocks",
          system: "WebAuthn (phone's own fingerprint check)",
        }}
      />
      <DrawnCaption text="QR SCAN → GOOGLE SIGN-IN → WEBAUTHN — NO SHARED PASSWORD" from={B4} dur={B5 - B4} />

      {/* b5 — the result: 30 minutes of access, shown running and as the hero number */}
      {frame >= B5 && (
        <LogWindow
          title="youtube-gate worker"
          from={B5}
          every={16}
          opacity={1}
          win={{ x: 60, y: 110, w: 1160, h: 480 }}
          fontSize={22}
          lines={[
            { t: "TIER2", text: "default: OPEN (bug)", tone: "danger" },
            { t: "OCT14", text: "80 min free, 0 tasks done", tone: "danger" },
            { t: "FIX", text: "default flips to LOCKED", tone: "muted" },
            { t: "SCAN", text: "parent scans kiosk QR code", tone: "muted" },
            { t: "AUTH", text: "Google sign-in matches parent_emails", tone: "muted" },
            { t: "PASSKEY", text: "WebAuthn: phone fingerprint OK", tone: "success" },
            { t: "GRANT", text: "qr_pass set, tier2 unlocked", tone: "success" },
            { t: "WINDOW", text: "30 min, countdown on the TV", tone: "success" },
          ]}
        />
      )}
      {frame >= B5 && <ResultStamp />}

      <ZoomStrip />
    </AbsoluteFill>
  );
};

export const FeatureParentsPhoneUnlocksYoutubeB71: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
