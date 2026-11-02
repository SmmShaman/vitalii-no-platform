// FeatureFamilyDnsGuardKeepsG27 — feature g27 — 1280x720, 902 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline ribbon, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
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
// Persistent element: the timeline ribbon (archetype 1) lower third, b1-b5 — a
// product plate at left, five stamps landing left-to-right as the story moves
// from "filtered blind" (red) to "logged per device" (green).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/g27.json";

const B1 = 15;
const B2 = 176;
const B3 = 333;
const B4 = 503;
const B5 = 697;
const END = 902;

const ACCENT = "#2563EB";
const STAGE = "#101722";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 50;
const LINE_START = LT.x + 236;
const LINE_END = LT.x + LT.w - 20;
const STAMP_W = 150;

type Tone = "danger" | "success";
const STAMPS: { at: number; label: string; tone: Tone }[] = [
  { at: B1 + 20, label: "FILTERED,\nNOT LOGGED", tone: "danger" },
  { at: B2 + 20, label: "NO RECORD\nOF VISITS", tone: "danger" },
  { at: B3 + 20, label: "ANDROID\nBLIND SPOT", tone: "danger" },
  { at: B4 + 20, label: "PER-DEVICE\nLOG", tone: "success" },
  { at: B5 + 20, label: "2-DAY\nLOOKUP", tone: "success" },
];
const STAMP_GAP = (LINE_END - LINE_START - STAMP_W) / (STAMPS.length - 1);

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Ribbon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const progress = Math.max(0, Math.min(1, (frame - B1) / (END - B1)));
  const lineW = (LINE_END - LINE_START) * progress;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: 196 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>GUARD</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            Family Network
            <br />
            Guard
          </div>
        </div>
        {/* ribbon track + filled progress */}
        <div style={{ position: "absolute", left: LINE_START, top: LINE_Y - 1, width: LINE_END - LINE_START, height: 2, background: P.border }} />
        <div style={{ position: "absolute", left: LINE_START, top: LINE_Y - 1, width: lineW, height: 2, background: P.ink }} />
      </Arrive>

      {STAMPS.map((s, i) => {
        if (frame < s.at) return null;
        const sx = LINE_START + i * STAMP_GAP;
        const t = sec(frame, s.at, fps);
        const bg = s.tone === "danger" ? P.dangerBg : P.successBg;
        const edge = s.tone === "danger" ? P.dangerEdge : P.successEdge;
        const ink = s.tone === "danger" ? P.danger : P.success;
        return (
          <Arrive key={s.label} at={s.at} kind="punch" box={{ x: sx, y: LT.y + 14, w: STAMP_W, h: 64 }}>
            <div
              style={{
                position: "absolute",
                left: sx,
                top: LT.y + 14,
                width: STAMP_W,
                height: 64,
                background: bg,
                border: `2px solid ${edge}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 10px",
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: ink, whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.25 }}>
                {s.label}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: sx + STAMP_W / 2 - 5,
                top: LINE_Y - 5,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: ink,
              }}
            />
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
      {/* b1 — the problem: blocking blind, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Blocked, but blind", kicker: "The guard filtered every device — and kept no record of where they went" }}
      />

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

      {/* b4 — the fix: per-device logging on a new Cloudflare database */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub2" from={B4} hold={B5 - B4} />}
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

      {/* b5 — drawn only: no live backdrop (gate 2). Holds to the end, no fade. */}
      <LogWindow
        from={B5 + 20}
        every={18}
        opacity={frame >= B5 ? 1 : 0}
        title="web-log worker"
        fontSize={22}
        win={{ x: 150, y: 170, w: 980, h: 420 }}
        lines={[
          { t: "web_hits", text: "device + day + service -> ips[], hit_count++", tone: "accent" },
          { t: "ip_map", text: "reverse index: ip -> device (whose IP is this)", tone: "accent" },
          { t: "android", text: "per-device subdomain -> Private DNS (DoT)", tone: "success" },
          { t: "dashboard", text: "Today / Yesterday toggle, per device", tone: "success" },
          { t: "cleanup", text: "daily job prunes rows past the 2-day window", tone: "muted" },
          { t: "cache", text: "version bump -> old installs get the new UI", tone: "muted" },
        ]}
      />

      <Ribbon />
    </AbsoluteFill>
  );
};

export const FeatureFamilyDnsGuardKeepsG27: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
