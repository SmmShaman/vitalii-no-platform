// FeatureRotatedMacAddressUsedG26 — feature g26 — 1280x720, 871 frames @ 30fps, VOICE-SYNCED.
// archetype 7 hero-number, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Guard: my kids' phones rotate their Wi-Fi MAC address on their own (Android and iOS both
// do this for privacy), so Guard kept treating the same phone as a brand-new, nameless
// device — no name, no owner, no limit, no block. Every rule I'd set just silently stopped
// applying. The fix is a twinOf() check that runs on every device sync: a device with no
// name/owner/limit and a randomized-looking MAC is matched against an older, now-offline
// row with the same hostname that went quiet right before it appeared. A match fires a
// Telegram alert and the dashboard shows a merge button that folds the old row's settings
// and history into the new MAC.
//
// Beat → effect (data only from the feature row, no verified commit URL this time):
// b1 15-266   "My kids' phones change their network ID on their own, so Guard saw each one
//              as a brand-new device — no rules, no limits."
//              cornerTags over the feature's own page (backdrop). Bottom-band badge names
//              the product (GUARD) and shows "0 of 4 fields kept".
// b2 266-418  "Every rule I'd set just vanished, like someone swapped in a new name tag."
//              keywordCaption over the page, scrolled deeper — same badge, unchanged.
// b3 418-576  "A check running on Cloudflare Workers now spots the pattern and flags the
//              match." handoffExplain, dark stage (no verified recording of the twinOf()
//              code). Badge flips 0/4 → 4/4 the moment the hand-off lands.
// b4 576-726  "The old phone shows up tagged as a likely twin the instant it reconnects."
//              pipelineFlow over the features hub (the wider system this sits in).
// b5 726-871  "One tap merges its whole history back into place."
//              pure drawn hero-number reveal — no effect, no backdrop — "1" at fontSize 240
//              owns the frame (gate 1), the 4-field merge checklist lands beside it, holds
//              to END at full brightness. The last beat is the result, never the page or
//              hub (gate 2).
//
// Persistent element: the hero-number badge (archetype 7), small in the bottom band
// (y >= 600) for b1-b4 so it never competes with an effect; it steps aside for the
// full-frame hero-number finale in b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g26.json";

const B1 = 15;
const B2 = 266;
const B3 = 418;
const B4 = 576;
const B5 = 726;
const END = 871;

/** Accent tuned for the dark stage. */
const ACCENT = "#5EA8D8";
const STAGE = "#11161C";

// Badge geometry (1280x720, bottom band y >= 600 the effects keep clear).
const LT = { x: 40, y: 600, w: 1200, h: 104 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Badge: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B5) return null;

  const flipped = frame >= B3 + 40;
  const tone = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const edge = flipped ? P.successEdge : P.dangerEdge;
  const count = flipped ? 4 : 0;
  const showBrand = frame < B3;

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
        <div
          style={{
            position: "absolute",
            left: LT.x + 22,
            top: LT.y + 8,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 3,
            color: P.muted,
            opacity: showBrand ? 1 : 0,
          }}
        >
          GUARD
        </div>
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 20, fontSize: 12, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>
          MAC TWIN CHECK
        </div>
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 38, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: tone, fontVariantNumeric: "tabular-nums" }}>{count}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>of 4 fields kept</span>
        </div>
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 80, fontSize: 10.5, fontWeight: 600, color: P.muted, maxWidth: 440 }}>
          Name & owner · Time limit & block · Usage history · Events log
        </div>
        <div
          style={{
            position: "absolute",
            left: LT.x + LT.w - 160,
            top: LT.y + 22,
            width: 130,
            height: 60,
            borderRadius: 4,
            background: bg,
            border: `2px solid ${edge}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            color: tone,
            textAlign: "center",
          }}
        >
          {flipped ? "TWIN FOUND" : "NO MATCH"}
        </div>
      </Arrive>
    </div>
  );
};

/** b3 only — handoffExplain's own content sits in a mid-frame band; this fills the
 *  empty top/bottom margins the dark stage leaves around it. */
const HandoffFill: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;
  const t = tween(sec(frame, B3 + 6, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>🔧</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.accent }}>THE FIX</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 820 }}>
            Same hostname, no name, no owner, no limit — the pattern a rotated MAC always leaves behind
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 548,
          width: 1160,
          height: 46,
          borderRadius: 6,
          background: P.card,
          border: `2px solid ${P.accent}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingLeft: 20,
          fontSize: 15,
          fontWeight: 700,
          color: P.ink,
        }}
      >
        <span>🛡️</span>
        <span>Old row goes quiet • new row appears • Cloudflare Worker fires the match</span>
      </div>
    </div>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;

  const t = sec(frame, B5, fps);
  const punch = punchScale(t, 0);
  const underline = tween(t, 0.2, 0.7, ease.power3Out);
  const fields = ["Name & owner", "Time limit & block", "Usage history", "Events log"];

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 28% 40%, ${P.accentBg} 0%, ${STAGE} 62%)`,
        }}
      />
      <div style={{ position: "absolute", left: 80, top: 130, transform: `scale(${punch})`, transformOrigin: "left top" }}>
        <div style={{ fontSize: 240, fontWeight: 900, color: P.accent, lineHeight: 0.85, letterSpacing: -4 }}>1</div>
      </div>
      <div style={{ position: "absolute", left: 86, top: 420, fontSize: 44, fontWeight: 800, color: "#F5F7FA", letterSpacing: 4 }}>
        TAP
      </div>
      <div style={{ position: "absolute", left: 86, top: 480, width: underline * 560, height: 4, background: P.accent }} />
      <div style={{ position: "absolute", left: 86, top: 502, fontSize: 24, fontWeight: 700, color: "#B9C2CC" }}>
        Merges the twin's whole history back into one row
      </div>
      {fields.map((label, i) => {
        const at = B5 + 34 + i * 18;
        if (frame < at) return null;
        const sc = punchScale(sec(frame, at, fps), 0);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: 700,
              top: 150 + i * 68,
              width: 420,
              height: 56,
              borderRadius: 6,
              background: P.successBg,
              border: `2px solid ${P.successEdge}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingLeft: 18,
              fontSize: 20,
              fontWeight: 700,
              color: P.success,
              transform: `scale(${sc})`,
              transformOrigin: "left center",
            }}
          >
            <span>✅</span>
            <span>{label}</span>
          </div>
        );
      })}
      {(() => {
        const capAt = B5 + 34 + 3 * 18 + 14;
        if (frame < capAt) return null;
        const pulse = 1 + 0.025 * Math.sin(sec(frame, capAt, fps) * 3.4);
        return (
          <div
            style={{
              position: "absolute",
              left: 688,
              top: 138,
              width: 444,
              height: 68 * 4 + 12,
              borderRadius: 10,
              border: `2px solid ${P.success}`,
              transform: `scale(${pulse})`,
              transformOrigin: "center",
              opacity: 0.6,
            }}
          />
        );
      })()}
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
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
          statement: "GUARD: a rotated MAC erased every rule",
          tags: ["Android + iOS feature", "No name, no owner", "Zero limits applied", "Happens automatically"],
        }}
      />

      {/* b2 — the analogy */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "A new name tag. Every rule vanished.", keywords: ["vanished"] }}
      />

      {/* b3 — the fix: no verified recording of the twinOf() code, dark stage */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          from: "Random MAC = brand-new device",
          to: "Random MAC = matched & flagged",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Same hostname, old row offline", "Cloudflare Worker scans deviceStates()", "D1 match leads to a Telegram alert"],
        }}
      />
      <HandoffFill />

      {/* b4 — the result mechanism, over the features hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Phone reconnects with new MAC", "twinOf() check matches old row", "Device flagged as likely twin"],
          result: "No manual reset needed",
          system: "Cloudflare Worker",
        }}
      />

      <Badge />

      {/* b5 — hero-number finale, holds to END */}
      <Finale />
    </AbsoluteFill>
  );
};

export const FeatureRotatedMacAddressUsedG26: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
