// FeaturePerPlatformConsent — feature j70 — 1280x720, 952 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row — auto_soknad_min_score,
// skyvern_metadata.owner_confirmed, RECON_ALLOWED are real flags; no numbers exist
// on this row so none are used):
// b1 15-212   "one tap used to both approve a LinkedIn job and open its form"
//             cornerTags over the real feature page (backdrop "feature") — the
//             problem as four facts. Timeline ribbon: node 1 lights, POLICY v8.
// b2 221-379  "meanwhile NAV/FINN sat waiting on that same manual gate"
//             keywordCaption over a dark plate (no new page to film). Ribbon: node 2.
// b3 388-556  "I split the trust: LinkedIn always needs a human look first"
//             handoffExplain over the real commit history, ZOOMED on the policy
//             diff (backdrop "commits") — evidence the split actually shipped.
//             Ribbon: node 3 lights, banner flips to POLICY v9.
// b4 565-747  "NAV/FINN get their auto-queue back, confirmed in Telegram"
//             pipelineFlow over a dark plate (the commit proves the split, not
//             the queue mechanics — drawn instead). Ribbon: node 4.
// b5 756-907  "consent is scoped per job and per platform now" — the verdict
//             LogWindow only — never the feature's own page or the hub (gate 2).
//             Ribbon: node 5, holds to the end, no fade.
//
// Persistent element: the timeline ribbon (archetype 1), b1 through b5 — five
// stage nodes light up left to right as the clip crosses each beat boundary.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LiveShot, LogWindow } from "./live-primitives";
import shotsFile from "./shots/j70.json";

const B1 = 15;
const B2 = 221;
const B3 = 388;
const B4 = 565;
const B5 = 756;
const END = 952;

/** Accent tuned for the dark stage (dawn's own #2563EB reads flat on a dark plate). */
const ACCENT = "#6FA8FF";
const STAGE = "#101826";

const NODES = [
  { x: 140, label: "One button, no review" },
  { x: 390, label: "NAV/FINN wait on the same gate" },
  { x: 640, label: "LinkedIn now requires review" },
  { x: 890, label: "NAV/FINN auto-queue returns" },
  { x: 1140, label: "Consent scoped per job, per platform" },
];

const BAND_Y = 606;
const TAG_H = 20;
const ROW_Y = BAND_Y + TAG_H + 6;
const DOT_Y = ROW_Y + 16;

const TimelineRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const activeIdx = frame >= B5 ? 4 : frame >= B4 ? 3 : frame >= B3 ? 2 : frame >= B2 ? 1 : 0;
  const policy = frame >= B3 ? "POLICY v9" : "POLICY v8";

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {frame < B2 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BAND_Y,
            width: 1280,
            height: TAG_H,
            background: "rgba(16,24,38,0.82)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1.6,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
          }}
        >
          PRODUCT: JOBBOT NORWAY — sources NAV/FINN/LinkedIn jobs, scores fit, applies
        </div>
      )}

      <div style={{ position: "absolute", left: 16, top: ROW_Y + 4, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>
        {policy}
      </div>

      {/* connecting line */}
      <div style={{ position: "absolute", left: NODES[0].x, top: DOT_Y - 1, width: NODES[4].x - NODES[0].x, height: 2, background: P.border }} />
      <div
        style={{
          position: "absolute",
          left: NODES[0].x,
          top: DOT_Y - 1,
          width: ((NODES[4].x - NODES[0].x) * activeIdx) / 4,
          height: 2,
          background: P.accent,
        }}
      />

      {NODES.map((n, i) => {
        const on = i <= activeIdx;
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: n.x - 7,
              top: DOT_Y - 7,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: on ? P.accent : "transparent",
              border: `2px solid ${on ? P.accent : P.border}`,
            }}
          />
        );
      })}

      <div style={{ position: "absolute", left: 16, top: ROW_Y + 36, fontSize: 17, fontWeight: 700, color: P.ink, maxWidth: 1248 }}>
        {NODES[activeIdx].label}
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own lonely page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="feature" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "One tap approved AND opened the form",
          tags: ["LinkedIn only", "No review yet", "Form unseen", "Policy v8"],
        }}
      />

      {/* b2 — the same gate, no new page to film */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "NAV and FINN jobs",
          line2: "stuck on the same manual gate",
          keywords: ["NAV", "FINN", "manual gate"],
        }}
      />

      {/* b3 — the fix, over the real commit history, zoomed on the policy diff */}
      {cut(frame, B3, B4) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="commits"
          from={B3}
          hold={B4 - B3}
          zoom={() => 2.2}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={1}
          win={{ x: 0, y: -42, w: 1280, h: 762 }}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "One button, no review",
          to: "Human review, no shortcut",
          points: ["LinkedIn exploration blocked until reviewed", "RECON_ALLOWED gates the form", "No single-tap commit"],
        }}
      />

      {/* b4 — the auto-queue mechanics, drawn (the commit proves the split, not this) */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["Score clears auto_soknad_min_score", "Bot auto-queues the application", "Owner confirms in Telegram", "Skyvern sends it"],
          result: "Fast queue, still owner-gated",
          system: "NAV/FINN auto-queue",
        }}
      />

      {/* b5 — the verdict, holds to the end. Never the feature page or the hub (gate 2). */}
      {frame >= B5 && (
        <LogWindow
          title="jobbot-norway"
          from={B5}
          every={14}
          opacity={1}
          fontSize={20}
          win={{ x: 140, y: 40, w: 1000, h: 520 }}
          lines={[
            { text: "POLICY v8 → v9 applied", tone: "accent" },
            { text: "platform: linkedin → RECON_ALLOWED = false", tone: "danger" },
            { text: "action: hold for owner review before explore", tone: "muted" },
            { text: "platform: nav → score ≥ auto_soknad_min_score", tone: "success" },
            { text: "platform: finn → score ≥ auto_soknad_min_score", tone: "success" },
            { text: "queued → awaiting skyvern_metadata.owner_confirmed", tone: "muted" },
            { text: "owner confirms in Telegram → application sent", tone: "success" },
            { text: "consent scoped: per job, per platform", tone: "accent" },
          ]}
        />
      )}

      <TimelineRibbon />
    </AbsoluteFill>
  );
};

export const FeaturePerPlatformConsent: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
