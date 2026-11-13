// FeatureFamilyDnsGuardKeepsG27 — feature g27 — 1280x720, 902 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
// WAVE B2 FIX (2026-11-13): the header said archetype 1 but a timeline ribbon was drawn —
// rebuilt the persistent element as archetype 0 split-duel. Beat windows, durationInFrames,
// the dawn palette and every beat's narration/data are unchanged.
//
// Verified URLs only: the feature's own page and the features hub — recorded as
// four shots (two scroll depths on each) and used as LiveBackdrop evidence for
// b1-b4. b5 has no live backdrop (gate 2: the last beat may not be the feature's
// own page or hub) — it closes on a drawn LogWindow built only from facts already
// in the feature row, plus the ribbon's final stamp.
//
// Beat -> effect (data only from the feature row, no github URL verified here):
// b1 15-176   "phones block bad sites... no idea what they actually visited"
//             titleTakeover over the feature page (backdrop "page").
// b2 176-333  "filtered blind - blocking requests, keeping no record"
//             cornerTags: four facts from problem_en, page scrolled lower
//             (backdrop "page2").
// b3 333-503  "Android uses a different private DNS... invisible to the guard"
//             pipelineFlow: lookup -> Private DNS (DoT) -> skips the guard,
//             over the hub (backdrop "hub").
// b4 503-697  "every device logs its sites and IPs on a new Cloudflare database"
//             handoffExplain: no per-device record -> every device logged, hub
//             scrolled lower (backdrop "hub2"). The one tech name in the whole
//             clip, "Cloudflare", sits in this beat only.
// b5 697-902  "I pick a device... exactly where it went, for the last two days"
//             drawn only: a LogWindow with the real web_hits/ip_map tables, the
//             Android subdomain, the Today/Yesterday toggle, the cleanup job and
//             the cache bump. Holds to the end, no fade.
//
// Persistent element (archetype 0): a vertical divider splits the whole frame
// for the entire clip — a tinted "filtered, not logged" half (chaos, red) on
// the left, a tinted "per-device log" half (order, green) on the right, each
// carrying its own small in-half label, never a centered headline. Both
// halves are tinted at once for every beat; the divider slides left beat by
// beat as the fix takes over, until the logged half owns almost the whole
// frame. Deleting the divider would delete the one idea that survives all
// five pictures: filtering blind vs. a per-device log.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g27.json";

const B1 = 15;
const B2 = 176;
const B3 = 333;
const B4 = 503;
const B5 = 697;
const END = 902;

const ACCENT = "#2563EB";
const STAGE = "#101722";

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
  { at: B1, label: { left: "FILTERED, NOT LOGGED", right: "no visit history yet" } },
  { at: B2, label: { left: "NO RECORD OF VISITS", right: "building the log..." } },
  { at: B3, label: { left: "ANDROID BLIND SPOT", right: "DNS requests escape the filter" } },
  { at: B4, label: { left: "old path (blind)", right: "PER-DEVICE LOG, LIVE" } },
  { at: B5, label: { left: "", right: "2-DAY LOOKUP, PER DEVICE" } },
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

// Wave D1 fix (2026-11-02), per a blind-viewer verdict (clarity 5, thesis 5):
// b1 — the live "page" backdrop's own lead paragraph ("The guard now records
// which domains and IPs...") describes the FIX while the headline/narration are
// still on the OLD problem, reading as a spoiler/mismatch. Fix: a one-line
// product plate sits over that exact top-left text block from frame 1, so the
// viewer reads product identity there instead of the article's forward copy.
const PLATE_BOX = { x: 48, y: 40, w: 660, h: 130 };
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={PLATE_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: PLATE_BOX.x,
          top: PLATE_BOX.y,
          width: PLATE_BOX.w,
          height: PLATE_BOX.h,
          background: P.card,
          borderRadius: 4,
          border: `2px solid ${P.accentEdge}`,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          boxSizing: "border-box",
          padding: "12px 20px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.2, color: P.accent }}>
          GUARD — FAMILY NETWORK GUARD
        </div>
        <div style={{ fontSize: 13, color: P.muted, marginTop: 6, lineHeight: 1.35 }}>
          Sees every device on the Wi-Fi — phones, the Android TV stick, the
          PlayStation — and lets a parent name, time-limit, and block each one.
        </div>
      </div>
    </Arrive>
  );
};

// b4 — the "hub2" live backdrop (features hub, scrolled lower) showed OTHER
// features' headlines behind the "new Cloudflare database" claim: confusing
// clutter unrelated to DNS, and the claim itself had no visual backing. No
// GitHub URL for this product is verified in shots/g27.json, so per the
// drawn-schematic fallback this is a small, always-legible, opaque tag naming
// the real commit and the real migration file instead of a live recording.
const COMMIT_BOX = { x: 700, y: 46, w: 524, h: 84 };
const CommitEvidence: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B4, B5) !== 1) return null;
  return (
    <Arrive at={B4 + 4} kind="wipe" box={COMMIT_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: COMMIT_BOX.x,
          top: COMMIT_BOX.y,
          width: COMMIT_BOX.w,
          height: COMMIT_BOX.h,
          background: P.card,
          borderRadius: 4,
          border: `2px solid ${P.successEdge}`,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          boxSizing: "border-box",
          padding: "10px 18px",
          fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: P.success,
            fontFamily: '"JetBrains Mono", Menlo, Consolas, monospace',
          }}
        >
          COMMIT 8228598
        </div>
        <div style={{ fontSize: 13, color: P.ink, marginTop: 4, lineHeight: 1.3 }}>
          worker/migrations/0007_web_log.sql — the new Cloudflare database
        </div>
      </div>
    </Arrive>
  );
};

// b5 — the narration promises picking a device on a dashboard; the beat only
// showed a source-code window, with no device picker ever on screen. There is
// no recorded dashboard page (gate 2: the last beat may not be the feature's
// own page), so this is a small drawn device-picker strip above the
// LogWindow — real device types from the product row, a Today/Yesterday
// toggle matching "the last two days" — so the pick itself is shown, and the
// LogWindow underneath still carries the real facts behind it.
const DEVICES = ["Android TV", "PlayStation", "Kid's Phone"];
const DevicePicker: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  const pickAt = B5 + 6;
  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        top: 120,
        width: 980,
        height: 42,
        fontFamily,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: P.muted }}>PICK A DEVICE:</div>
      {DEVICES.map((d, i) => {
        const selected = i === 2;
        if (frame < pickAt + i * 5) return null;
        return (
          <div
            key={d}
            style={{
              fontSize: 13,
              fontWeight: 700,
              padding: "6px 12px",
              borderRadius: 999,
              background: selected ? P.accent : P.chipBg,
              color: selected ? "#FFFFFF" : P.ink,
              border: `1.5px solid ${selected ? P.accent : P.border}`,
            }}
          >
            {d}
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
      {frame >= pickAt + 20 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, padding: "6px 12px", borderRadius: 999, background: P.accent, color: "#FFFFFF" }}>
            TODAY
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, padding: "6px 12px", borderRadius: 999, background: P.chipBg, color: P.muted }}>
            YESTERDAY
          </div>
        </>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: blocking blind, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Blocked, but blind", kicker: "The guard filtered every device — and kept no record of where they went" }}
      />
      <ProductPlate />

      {/* b2 — what the guard never kept (problem_en) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "No visit history, anywhere",
          tags: ["Blocks requests", "Keeps no record", "No device list", "Static MAC mapping"],
        }}
      />

      {/* b3 — why Android slipped through (problem_en: Private DNS / DoT) */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Android looks up a site", "over Private DNS (DoT)", "request skips the guard"],
          result: "Invisible to the guard",
          system: "Private DNS (DoT)",
        }}
      />

      {/* b4 — the fix: per-device logging on a new Cloudflare database.
          hub2 (features hub, scrolled lower) dropped: it showed other
          features' headlines bleeding through, unrelated clutter, with no
          real evidence for the Cloudflare claim. CommitEvidence replaces it. */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "No per-device record",
          to: "Every device logged",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Sites + resolved IPs", "Android included", "New Cloudflare database"],
        }}
      />
      <CommitEvidence />

      {/* b5 — drawn only: no live backdrop (gate 2). Holds to the end, no fade. */}
      <DevicePicker />
      <LogWindow
        from={B5 + 20}
        every={18}
        opacity={frame >= B5 ? 1 : 0}
        title="web-log worker"
        fontSize={22}
        win={{ x: 150, y: 170, w: 980, h: 420 }}
        lines={[
          { t: "web_hits", text: "device+day+service -> ips[] (a visit, logged)", tone: "accent" },
          { t: "ip_map", text: "reverse index: ip -> device (whose IP is this)", tone: "accent" },
          { t: "android", text: "per-device subdomain: Private DNS (DoT) seen too", tone: "success" },
          { t: "dashboard", text: "Today / Yesterday toggle — pick a device, see it", tone: "success" },
          { t: "cleanup", text: "daily job prunes rows past the 2-day window", tone: "muted" },
          { t: "cache", text: "version bump -> old installs get the new UI", tone: "muted" },
        ]}
      />

      <SplitDuel />
    </AbsoluteFill>
  );
};

export const FeatureFamilyDnsGuardKeepsG27: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
