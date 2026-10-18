// FeatureAutoUpdateActuallyInstallsB60 — feature b60 — 1280x720, 1020 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Product: bir — a closed family network for parents and kids: live location, calls and a daily
// activity screen in one app. This feature: pushing a new build to three kids' phones meant
// texting each one a link and hoping they tapped install — devices quietly sat outdated for
// weeks with no way to tell who had updated. Fix: an update pusher polls the current version
// every 5 minutes and notifies devices over FCM; the devices table gained update_status,
// update_detail, update_at, update_pushed, fed by a dedicated endpoint that accepts one of seven
// states from no_permission through downloading to installed (commits e447431, 9eaaffe).
//
// Beat → effect (data only from the feature's own sentences and those two commits):
// b1 15-302    "texting them to tap a link... devices quietly sat outdated for weeks" —
//              titleTakeover, over the feature's own page (backdrop "page") for texture; the old
//              manual-texting routine isn't shown live anywhere, so the claim carries the beat.
// b2 302-445   "the phone checks in every few minutes and installs the update by itself" —
//              handoffExplain, BEFORE (text a link) -> NOW (phone checks in itself), over the
//              feature's own page scrolled on (backdrop "page2") — server/src/routes/devices.js
//              named on screen.
// b3 445-623   "reports back the whole way — downloading, waiting on a permission, stuck, done" —
//              cornerTags, the four real update_status states, over the feature's status section
//              (backdrop "page3").
// b4 623-799   "one push over FCM starts it all, no link to click, no text to send" —
//              pipelineFlow, over the feature's solution section (backdrop "page4") — the FCM
//              push pipeline named on screen.
// b5 799-1020  "now you can see all three kids' phones... at a glance" — drawn, no page backdrop
//              (gate 2): a dark stage, LogWindow replaying the devices table's own status
//              columns, hero number 3 (three kids' phones), holds to the final frame.
//
// Persistent element (archetype 0): a vertical divider splits the whole frame for the entire
// clip — a tinted "manual texting" half (chaos, chasing kids to tap install) on the left, a
// tinted "self-updating" half (order, phone reports on its own) on the right, each carrying its
// own small in-half label, never a centered headline. Both halves are tinted at once for every
// beat; the divider itself slides left beat by beat as the fix takes over, until the
// self-updating half owns almost the whole frame. Deleting the divider would delete the one idea
// that survives all five pictures: chasing a tap vs. a phone that reports on its own.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b60.json";

const B1 = 15;
const B2 = 302;
const B3 = 445;
const B4 = 623;
const B5 = 799;
const END = 1020;

/** Brighter than dawn's raw accent (#2563EB) so it stays legible on the dark MotionInsert plate. */
const ACCENT = "#5B9DFF";
const STAGE = "#0F1626";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Divider holds one x per beat, sliding there over 0.45s at the start of that beat.
const STOPS: { at: number; x: number }[] = [
  { at: B1, x: 980 },
  { at: B2, x: 760 },
  { at: B3, x: 540 },
  { at: B4, x: 320 },
  { at: B5, x: 140 },
];

const dividerX = (frame: number, fps: number) => {
  if (frame < B1) return STOPS[0].x;
  let idx = 0;
  for (let i = 0; i < STOPS.length; i++) if (frame >= STOPS[i].at) idx = i;
  const cur = STOPS[idx];
  const prev = idx > 0 ? STOPS[idx - 1].x : cur.x;
  const p = tween(sec(frame, cur.at, fps), 0, 0.45, ease.power3Out);
  return mix(p, prev, cur.x);
};

type HalfLabel = { left: string; right: string };
const LABELS: { at: number; label: HalfLabel }[] = [
  { at: B1, label: { left: "MANUAL: TEXT A LINK", right: "device: not checked in yet" } },
  { at: B2, label: { left: "HOPE THEY TAP INSTALL", right: "checking in every 5 min" } },
  { at: B3, label: { left: "BEFORE: silent, no status", right: "NOW: reports every step" } },
  { at: B4, label: { left: "old path (texting)", right: "FCM PUSH → AUTO INSTALL" } },
  { at: B5, label: { left: "", right: "3 PHONES, STATUS AT A GLANCE" } },
];

/** Persistent archetype 0 spine: a sliding vertical divider, tinted halves, in-half labels. */
const SplitDuel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const x = dividerX(frame, fps);
  let cur = LABELS[0].label;
  for (const l of LABELS) if (frame >= l.at) cur = l.label;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: x, height: 720, background: P.danger, opacity: 0.16 }} />
      <div style={{ position: "absolute", left: x, top: 0, width: 1280 - x, height: 720, background: P.success, opacity: 0.14 }} />
      <div
        style={{
          position: "absolute",
          left: x - 2,
          top: 0,
          width: 4,
          height: 720,
          background: P.accent,
          boxShadow: `0 0 22px 4px ${P.accent}`,
        }}
      />
      {cur.left && (
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 24,
            padding: "8px 14px",
            borderRadius: 4,
            background: P.card,
            border: `2px solid ${P.dangerEdge}`,
            fontSize: 14,
            fontWeight: 800,
            color: P.danger,
            letterSpacing: 0.4,
          }}
        >
          {cur.left}
        </div>
      )}
      {cur.right && (
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 24,
            padding: "8px 14px",
            borderRadius: 4,
            background: P.card,
            border: `2px solid ${P.successEdge}`,
            fontSize: 14,
            fontWeight: 800,
            color: P.success,
            letterSpacing: 0.4,
            textAlign: "right",
          }}
        >
          {cur.right}
        </div>
      )}
    </div>
  );
};

/** b5 — no page backdrop allowed here (gate 2): dark stage, the devices table's own states, the "3". */
const ResultStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;
  const at = B5 + 100;
  const sc = frame >= at ? punchScale(sec(frame, at, fps), 0) : 0;
  const reveal = frame >= at ? 1 : tween(sec(frame, B5, fps), 0.1, 0.3, ease.power3Out);

  return (
    <>
      <LogWindow
        title="devices table"
        from={B5 + 20}
        every={14}
        opacity={1}
        win={{ x: 140, y: 250, w: 1000, h: 280 }}
        fontSize={21}
        lines={[
          { t: "device: kid1", text: "update_status: installed", tone: "success" },
          { t: "device: kid2", text: "update_status: downloading", tone: "accent" },
          { t: "device: kid3", text: "update_status: no_permission — waiting", tone: "muted" },
          { t: "server/src/routes/devices.js", text: "update_pushed = true, update_at ticks", tone: "ink" },
          { t: "poll", text: "version.json checked every 5 min, no tap needed", tone: "muted" },
        ]}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 30,
          width: 1280,
          textAlign: "center",
          opacity: reveal,
          fontFamily,
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 800, color: P.success, transform: `scale(${sc || 1})`, lineHeight: 1 }}>3</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: P.ink, marginTop: 4 }}>phones at a glance — updated, downloading, or stuck</div>
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the claim: weeks out of date, chasing a tap */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Out of date for weeks", kicker: "bir — pushing a new build to three kids' phones meant texting each one a link" }}
      />

      {/* b2 — the fix: the phone checks in on its own */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Text a link, hope they tap install",
          to: "Phone checks in and updates itself",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Polls version.json every 5 min", "No text message needed", "server/src/routes/devices.js"],
        }}
      />

      {/* b3 — the real reporting states */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          statement: "Every phone reports back",
          tags: ["Downloading", "Waiting on permission", "Stuck", "Installed"],
        }}
      />

      {/* b4 — the push pipeline, no link, no text */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page4" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Version check every 5 min", "FCM push notification", "Auto install, no tap"],
          result: "No link, no text needed",
          system: "FCM (push notifications)",
        }}
      />

      {/* b5 — the result, holds to the end */}
      <ResultStage />

      <SplitDuel />

      {/* product plate — beat 1 only, so it doesn't sit unchanged across the whole clip */}
      {cut(frame, B1, B2) === 1 && (
        <Arrive at={B1 + 4} kind="wipe" box={{ x: 24, y: 86, w: 300, h: 60 }} dur={0.45}>
          <div style={{ position: "absolute", left: 24, top: 90 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2.2, color: ACCENT, fontFamily }}>BIR</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2, fontFamily }}>auto-update tracker · b60</div>
          </div>
        </Arrive>
      )}
    </AbsoluteFill>
  );
};

export const FeatureAutoUpdateActuallyInstallsB60: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
