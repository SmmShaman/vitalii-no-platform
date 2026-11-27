// FeatureKlientScansBusinesssWholeK05 — feature k05 — 1280x720, 997 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Before this feature, picking a free sample for a business meant opening its
// website and every social profile by hand, guessing how much content already
// existed, and writing a one-off AI prompt from scratch each time. Klient now
// crawls the site + socials, scores existing content, and chains four AI
// agents (visual → analyst → prompt-writer → reviewer) into a ready prompt —
// and the runner was rewritten to do three businesses at once instead of one.
//
// Archetype 0 (split-duel): a bottom band (y 560-720) is cut in two by a
// divider that slides closed over the clip — chaos (manual, per-platform
// guessing) on the left shrinks away, order (the automated pipeline) on the
// right fills in. The divider itself runs the full frame height (0-720) so
// the "screen halved" read holds even though MotionInsert's effects still own
// the frame above the band (motion system's "one owner of frame" rule — same
// solution as the lower-third flow-map in the sanctioned p75 reference).
//
// Persistent element through all five beats: a top-left "KLIENT — SAMPLE
// SCAN" plate that names the product in beat 1 and changes its status line
// every beat, locking to "✓ 3 at once" in b5.
//
// Beat → effect (plan: shots/k05.motion.json):
// b1  15-333   the problem: open the site, check every social page, guess
//              the content, write a prompt from scratch → cornerTags.
// b2 333-527   the swap: browsing by hand → one Node.js crawler covering the
//              site + every social page in one pass → handoffExplain.
// b3 527-698   the 4-agent chain: look → analyze → write → review → a
//              ready-to-send sample → pipelineFlow.
// b4 698-832   the analogy: less guesswork, more an assembly line →
//              keywordCaption.
// b5 832-997   drawn result (gate 2: never the feature page or hub) — real
//              facts from solution_en/result_en: crawl, scan, 4 agents,
//              1→3 parallel jobs, per-step token cost recorded.
//
// Single tech name in the whole clip: Node.js (beats 2-3 only).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, WIN_DEFAULT } from "./live-primitives";
import shotsFile from "./shots/k05.json";

const B1 = 15;
const B2 = 333;
const B3 = 527;
const B4 = 698;
const B5 = 832;
const END = 997;

/** Brighter than the mood's own accent (#0B7A5A), which reads too dark on the dark plate. */
const ACCENT = "#39D98A";
const STAGE = "#0E201A";

const BADGE = { x: 40, y: 40, w: 300, h: 64 };
const BAND_Y = 560;
const BAND_H = 160;

/** The archetype: a divider sliding closed over a chaos/order bottom band, full-height line. */
const SplitDuel: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B1) return null;
  const dividerX = interpolate(frame, [B1, B2, B3, B4, B5, END], [1150, 950, 700, 450, 220, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chips = [
    { x: 16, label: "Site?" },
    { x: 150, label: "FB?" },
    { x: 284, label: "IG?" },
    { x: 418, label: "LinkedIn?" },
    { x: 552, label: "TikTok?" },
    { x: 686, label: "YouTube?" },
  ];
  const checklist = [
    { at: B2, text: "✓ Node.js crawl: site + socials" },
    { at: B3, text: "✓ 4 agents chained" },
    { at: B4, text: "✓ Reviews its own work" },
    { at: B5, text: "✓ 3 at once" },
  ];
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 0, y: BAND_Y, w: 1280, h: BAND_H }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: BAND_Y,
          width: dividerX,
          height: BAND_H,
          overflow: "hidden",
          background: "#F4E4DC",
          fontFamily,
        }}
      >
        <div style={{ position: "absolute", left: 16, top: 2, fontSize: 13, fontWeight: 800, letterSpacing: 2, color: "#8A5A3C" }}>
          BEFORE
        </div>
        {chips.map((c) => (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: c.x,
              top: 30,
              width: 120,
              padding: "8px 12px",
              background: "#FFFFFF",
              borderRadius: 4,
              fontSize: 15,
              fontWeight: 700,
              color: "#6B4530",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.35)",
            }}
          >
            {c.label}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: dividerX,
          top: BAND_Y,
          width: 1280 - dividerX,
          height: BAND_H,
          overflow: "hidden",
          background: "#DFF5EA",
          fontFamily,
        }}
      >
        <div style={{ position: "absolute", left: 988, top: 2, fontSize: 13, fontWeight: 800, letterSpacing: 2, color: ACCENT }}>
          NOW
        </div>
        {checklist.map((row, i) => (
          <div
            key={row.text}
            style={{
              position: "absolute",
              left: 988,
              top: 24 + i * 24,
              fontSize: 14,
              fontWeight: row.at === B5 ? 800 : 700,
              color: frame >= row.at ? "#10281D" : "transparent",
              opacity: frame >= row.at ? 1 : 0,
            }}
          >
            {row.text}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: dividerX - 2,
          top: 0,
          width: 4,
          height: 720,
          background: ACCENT,
          boxShadow: `0 0 18px ${ACCENT}`,
        }}
      />
    </Arrive>
  );
};

/** Persistent product plate — changes state every beat, locks to the win in b5. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;
  const done = frame >= B5;
  const status =
    frame >= B5 ? "✓ 3 at once" : frame >= B4 ? "self-checking" : frame >= B3 ? "4 AI agents" : frame >= B2 ? "Node.js crawl" : "manual mode";
  return (
    <Arrive at={B1 + 4} kind="wipe" box={BADGE} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: BADGE.x,
          top: BADGE.y,
          width: BADGE.w,
          height: BADGE.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          padding: "9px 16px",
          boxSizing: "border-box",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.accent }}>KLIENT — SAMPLE SCAN</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: done ? P.success : P.ink, marginTop: 4 }}>{status}</div>
      </div>
    </Arrive>
  );
};

const RESULT_FACTS: { label: string; value: string }[] = [
  { label: "businesses scanned at once", value: "3 (was 1)" },
  { label: "agents per scan", value: "4 chained" },
];

const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  const win = WIN_DEFAULT;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 118, width: 1280, textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 3, color: ACCENT, fontFamily }}>RESULT</div>
      </div>
      <div style={{ position: "absolute", left: win.x, top: 158, width: win.w, display: "flex", gap: 24 }}>
        {RESULT_FACTS.map((f) => (
          <div
            key={f.label}
            style={{
              flex: 1,
              background: P.card,
              borderRadius: 4,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
              padding: "14px 18px",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.4, color: P.muted, textTransform: "uppercase" }}>
              {f.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: P.ink, marginTop: 4 }}>{f.value}</div>
          </div>
        ))}
      </div>
      <LogWindow
        title="runner.mjs"
        from={B5 + 10}
        every={16}
        opacity={1}
        win={{ x: win.x, y: 230, w: win.w, h: 416 }}
        lines={[
          { t: "01", text: "crawl.mjs: site + FB/IG/LinkedIn/TikTok/YouTube", tone: "ink" },
          { t: "02", text: "scan.mjs: score existing content volume", tone: "muted" },
          { t: "03", text: "agents.mjs: visual → analyst → writer → reviewer", tone: "ink" },
          { t: "04", text: "runner.mjs: 1 job at a time → 3 side by side", tone: "success" },
          { t: "05", text: "claude.mjs: token cost recorded per agent step", tone: "muted" },
          { t: "06", text: "result: scan + prompt automatic, 3 businesses at once", tone: "success" },
        ]}
      />
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: manual research, per-platform guessing */}
      {cut(frame, B1, B2) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.03} focus={{ x: 0.5, y: 0.4 }} />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "No playbook — guess, then start over",
          tags: ["Open the website", "Check every social page", "Guess the content", "Write a prompt from scratch"],
        }}
      />

      {/* b2 — the swap: browsing by hand → one Node.js crawler */}
      {cut(frame, B2, B3) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} push={0.05} focus={{ x: 0.45, y: 0.35 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Browsing by hand",
          to: "One Node.js crawler",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Site + every social page", "One pass, not tab by tab"],
        }}
      />

      {/* b3 — the 4-agent chain */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} push={0.07} focus={{ x: 0.4, y: 0.3 }} />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Look", "Analyze", "Write", "Review"],
          result: "Sample ready to send",
          system: "4 AI agents",
        }}
      />

      {/* b4 — the analogy */}
      {cut(frame, B4, B5) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B4} hold={B5 - B4} push={0.09} focus={{ x: 0.35, y: 0.25 }} />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "Less guesswork,",
          line2: "more an assembly line",
          keywords: ["assembly line"],
        }}
      />

      {/* b5 — the result, drawn (never the feature page or the hub), holds to the end */}
      <Result />

      <SplitDuel />
      <ProductPlate />
    </AbsoluteFill>
  );
};

export const FeatureKlientScansBusinesssWholeK05: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
