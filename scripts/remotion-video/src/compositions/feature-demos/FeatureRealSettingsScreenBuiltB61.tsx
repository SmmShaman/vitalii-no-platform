// FeatureRealSettingsScreenBuiltB61 — feature b61 — 1280x720, 938 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: bir — a closed family network for parents and kids: live location, calls
// and a daily activity screen in one app.
//
// Persistent element (archetype 1): a horizontal timeline ribbon low in the frame. One
// stamp lands on it per beat, left to right, and a small non-centered headline at the
// bottom-left carries the running state — "events land on it as stamps left->right"
// from the archetype table.
//
// Beat -> effect (data only from the feature row):
// b1 15-186   "a call rings silent, or a notification never shows"
//             drawn only: a phone's incoming call rings muted, a notification bubble
//             never finishes arriving. First stamp lands: SYMPTOM. Product name plate.
// b2 186-399  "Android itself quietly denied the camera, microphone or call permission"
//             copyCorrection: "The app is broken" -> "Android quietly denied a
//             permission".
// b3 399-551  "no single place to see which permission was missing, or what build"
//             cornerTags: "No single place to check" + the missing facts.
// b4 551-731  "now a settings screen lists every permission and the build hash"
//             handoffExplain: no visibility anywhere -> one settings screen.
// b5 731-938  "troubleshooting a device now comes down to one screen"
//             titleTakeover holds the verdict; the ribbon's fifth stamp (RESOLVED)
//             lands and the clip holds to the final frame.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b61.json";

const B1 = 15;
const B2 = 186;
const B3 = 399;
const B4 = 551;
const B5 = 731;
const END = 938;

const STAGE = "#17140D";
const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const STAMPS = [
  { at: B1 + 20, x: 90, label: "SYMPTOM" },
  { at: B2 + 20, x: 360, label: "ROOT CAUSE" },
  { at: B3 + 20, x: 630, label: "NO VISIBILITY" },
  { at: B4 + 20, x: 900, label: "FIX SHIPPED" },
  { at: B5 + 20, x: 1170, label: "RESOLVED" },
];

const HEADLINES: { from: number; text: string }[] = [
  { from: B1, text: "App looks broken" },
  { from: B2, text: "Permission denied, quietly" },
  { from: B3, text: "No way to see why" },
  { from: B4, text: "Settings screen ships" },
  { from: B5, text: "One screen, not guesswork" },
];

/** persistent archetype element: the timeline ribbon + its stamps + a small running headline. */
const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const headline = [...HEADLINES].reverse().find((h) => frame >= h.from) ?? HEADLINES[0];
  const RIBBON_Y = 652;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: RIBBON_Y,
          width: 1140,
          height: 2,
          background: P.border,
        }}
      />

      {STAMPS.map((s) => {
        if (frame < s.at) return null;
        const scale = punchScale(sec(frame, s.at, fps), 0);
        return (
          <div key={s.label} style={{ position: "absolute", left: s.x - 70, top: RIBBON_Y - 34, width: 140, textAlign: "center" }}>
            <div
              style={{
                margin: "0 auto",
                width: 16,
                height: 16,
                borderRadius: 8,
                background: P.accent,
                border: `2px solid ${P.card}`,
                boxShadow: "3px 3px 0 rgba(0,0,0,0.35)",
                transform: `scale(${scale})`,
              }}
            />
            <div style={{ marginTop: 6, fontSize: 11, fontWeight: 800, letterSpacing: 1, color: P.muted }}>{s.label}</div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 40,
          top: 682,
          fontSize: 17,
          fontWeight: 800,
          color: P.ink,
        }}
      >
        {headline.text}
      </div>
    </div>
  );
};

/** b1: a call rings silent, a notification never finishes — drawn only. */
const PhoneSilent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 || frame >= B2) return null;

  const Phone = { x: 770, y: 70, w: 330, h: 470 };

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div style={{ position: "absolute", left: 50, top: 36, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        PHONE · INCOMING CALL
      </div>

      {frame >= B1 + 44 && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 260,
            width: 300,
            padding: "16px 20px",
            background: P.accentBg,
            border: `2px solid ${P.accentEdge}`,
            borderRadius: 10,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.3)",
            transform: `scale(${punchScale(sec(frame, B1 + 44, fps), 0)})`,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>BIR</div>
          <div style={{ fontSize: 13, color: P.muted, marginTop: 4 }}>Family network: calls, location, daily activity</div>
        </div>
      )}

      <Arrive at={B1} kind="wipe" box={Phone} dur={0.4}>
        <div
          style={{
            position: "absolute",
            left: Phone.x,
            top: Phone.y,
            width: Phone.w,
            height: Phone.h,
            background: P.card,
            border: `4px solid ${P.border}`,
            borderRadius: 32,
            boxShadow: "10px 10px 0 rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: P.muted }}>Incoming call</div>
          <div style={{ fontSize: 54, marginTop: 18 }}>📞</div>
          <div
            style={{
              marginTop: 18,
              fontSize: 60,
              transform: `scale(${1 + 0.08 * Math.sin(sec(frame, B1, fps) * 4)})`,
            }}
          >
            🔇
          </div>
          <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: P.danger }}>(permission blocked)</div>
        </div>
      </Arrive>

      {frame >= B1 + 60 && (
        <div
          style={{
            position: "absolute",
            left: Phone.x + Phone.w - 60,
            top: Phone.y - 24,
            width: 130,
            padding: "10px 14px",
            background: P.card,
            border: `2px dashed ${P.dangerEdge}`,
            borderRadius: 8,
            opacity: 0.55 + 0.35 * Math.abs(Math.sin(sec(frame, B1 + 60, fps) * 3)),
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: P.muted }}>Notification</div>
          <div style={{ fontSize: 16, color: P.muted }}>…</div>
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the symptom, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      {cut(frame, B1, B2) === 1 && <AbsoluteFill style={{ background: "rgba(8,8,8,0.72)" }} />}
      <PhoneSilent />

      {/* b2 — the root cause, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="copyCorrection"
        from={B2}
        dur={B3 - B2}
        accent={P.accent}
        plate={0.72}
        data={{
          wrong: "The app is broken",
          right: "Android quietly denied camera, mic or full-screen call permission",
          label: "ACTUALLY",
        }}
      />

      {/* b3 — the gap, over the feature's own page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.2 }} />}
      <MotionInsert
        effect="cornerTags"
        from={B3}
        dur={B4 - B3}
        accent={P.accent}
        plate={0.72}
        data={{
          statement: "No single place to check",
          tags: ["Camera permission?", "Mic permission?", "Full-screen calls?", "Which build?"],
        }}
      />

      {/* b4 — the fix, over the hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.25 }} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={P.accent}
        plate={0.72}
        data={{
          from: "No visibility anywhere",
          to: "One settings screen",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Every permission listed", "Build hash included", "Tap straight to the fix"],
        }}
      />

      {/* b5 — the verdict, no feature page / hub per gate 2; holds to the final frame */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={P.accent}
        plate={0.72}
        base={STAGE}
        data={{ title: "One screen, not guesswork", kicker: "Every permission plus the build hash" }}
      />

      <Timeline />
    </AbsoluteFill>
  );
};

export const FeatureRealSettingsScreenBuiltB61: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
