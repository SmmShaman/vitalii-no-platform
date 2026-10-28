// FeatureSugarHubCanFixD15 — feature d15 — 1280x720, 936 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One subject — the feature's own article page — held in frame the whole clip, the camera
// pushing in a little further every beat until, by b4, the reader is reading one paragraph.
// b5 breaks the pattern on purpose (gate: last beat is never the feature page or the hub):
// it closes on the fix actually running, a terminal log built from the feature's own words.
//
// Beat → effect (data only from the feature row, no invented numbers):
// b1 15-222   "a dead feed, found only by logging into the server by hand"
//             titleTakeover over the article's top (shot "wide"). Kicker names the product
//             plainly: "Diabet — tools built for my son Artem".
// b2 222-382  "a failed refresh could corrupt the saved session for good"
//             cornerTags over the problem paragraph (shot "problem"), camera pushed in further.
// b3 382-563  "temp file, then atomic rename — bridge/sugar_hub.py"
//             handoffExplain over the fix paragraph (shot "fix"), pushed in further still.
// b4 563-745  "Telegram alert the moment a refresh fails, instead of staying silently broken"
//             copyCorrection over the alert paragraph (shot "alert"), tightest push of the four.
// b5 745-936  "one command now revives a dead login" — bridge/relogin.sh, a drawn terminal log,
//             holds at full brightness to the end, no fade.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive, cut } from "./motion-primitives";
import { LiveShot, LogWindow, recSize, type LogLine } from "./live-primitives";
import shotsFile from "./shots/d15.json";

const B1 = 15;
const B2 = 222;
const B3 = 382;
const B4 = 563;
const B5 = 745;
const END = 936;

/** Accent tuned for the dark plate (slate's #0E7490 reads muddy on a dark backdrop). */
const ACCENT = "#5EEAD4";
const STAGE = "#0B1620";

const FULL_WIN = { x: 0, y: -42, w: 1280, h: 762 };

// LiveShot already fits the recording's width to the window (base = win.w / recW);
// `cover` below is the same correction LiveBackdrop uses to also cover the height,
// so a zoom() of 1.0 means "just covers the frame" and every beat escalates from there.
const { w: REC_W, h: REC_H } = recSize(shotsFile);
const COVER = Math.max(1, 720 / REC_H / (1280 / REC_W));

const relogLines: LogLine[] = [
  { t: "$", text: "bridge/relogin.sh", tone: "accent" },
  { text: "checking CareLink session...", tone: "muted" },
  { text: "session expired — refresh needed", tone: "danger" },
  { text: "writing new token to temp file", tone: "muted" },
  { text: "atomic rename: token.tmp -> token.json", tone: "muted" },
  { text: "login refreshed", tone: "success" },
  { text: "sugar-hub.service restarted", tone: "success" },
  { text: "feed live again — one command", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — the problem found only by hand, top of the article */}
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
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "A feed that died, silently", kicker: "Diabet — tools built for my son Artem" }}
      />

      {/* b2 — a failed refresh could corrupt the session for good */}
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
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A failed login refresh could corrupt the session",
          tags: ["No warning sent", "Fix: log in by hand", "Risk: feed gone for good", "No alert"],
        }}
      />

      {/* b3 — temp file, then atomic rename */}
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
          from: "Direct overwrite",
          to: "Temp file, then safe rename",
          points: ["A failed write can't corrupt it", "Old token kept until the swap"],
        }}
      />

      {/* b4 — Telegram alert the moment a refresh fails */}
      {cut(frame, B4, B5) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="alert"
          from={B4}
          hold={B5 - B4}
          zoom={(t) => COVER * (2.0 + 0.15 * t)}
          focus={{ x: 0.5, y: 0.6 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{ wrong: "Broken, and no one told", right: "Telegram alert, the moment it fails", label: "NOW" }}
      />

      {/* b5 — the fix actually running (never the feature page or the hub) */}
      {frame >= B5 && (
        <>
          <Arrive at={B5 + 2} kind="wipe" box={{ x: 0, y: 40, w: 1280, h: 92 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 40,
                width: 1280,
                height: 92,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: "#fff",
              }}
            >
              One command, session fixed
            </div>
          </Arrive>
          <LogWindow
            lines={relogLines}
            title="bridge/relogin.sh"
            from={B5 + 14}
            every={16}
            opacity={1}
            win={{ x: 140, y: 170, w: 1000, h: 420 }}
            fontSize={22}
          />
          <Arrive at={B5 + 24} kind="rise" box={{ x: 0, y: 620, w: 1280, h: 60 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 628,
                width: 1280,
                textAlign: "center",
                fontSize: 20,
                fontWeight: 600,
                color: ACCENT,
              }}
            >
              Reviving a dead login used to mean doing it by hand. Now it's one command.
            </div>
          </Arrive>
        </>
      )}
    </AbsoluteFill>
  );
};

export const FeatureSugarHubCanFixD15: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
