// FeatureVerifyBeforeYouShowV21 — feature v21 — 1280x720, 925 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row; no runtime log exists on the VPS
// for this pipeline, so b4's evidence is a LogWindow built from the row's own
// numbers, not a recording):
// b1 15-192   "My daily video digest narrated whatever the source article said,
//             no questions asked" — titleTakeover over the feature's own page.
//             Timeline: stamp "ARTICLE IN" lands at the left end of the ribbon.
// b2 192-346  "One exaggerated headline, and that claim went straight into a
//             published video" — statusFocus over the page, scrolled deeper.
//             Timeline: stamp "UNCHECKED" lands next on the ribbon.
// b3 346-481  "Like repeating a rumor on camera without calling anyone to
//             confirm it" (the analogy) — keywordCaption on the dark stage.
//             Timeline: stamp "LIKE A RUMOR" lands.
//             WAVE C FIX (2026-11-24): keywordCaption is by design a lower-
//             third caption only — at the beat's measured midpoint the frame
//             was 16/48 filled, just the caption text and the timeline band.
//             Added a static rumor-vs-confirm IconCard pair above the caption
//             (clear of both the caption's lower third and the ribbon) so the
//             analogy has a visual, not just a sentence.
// b4 481-725  "Now a research step checks every fact with real Google searches
//             before it's allowed on screen" — no catalog effect; the one tech
//             caption of the clip (Google CSE) sits on a LogWindow of the
//             checker's own numbers, dimmed over the repo's commit history.
//             Timeline: stamp "21 CHECKS" lands.
// b5 725-925  "Up to twenty-one independent checks per digest, so nothing airs
//             on faith alone" — ratioBars on the dark stage (no page/hub/repo —
//             this is the result, not the product). Timeline: final stamp
//             "VERIFIED" lands bright, ribbon completes, holds to the end.
//             WAVE C FIX (2026-11-24): was ratioBars. Its own reveal timeline
//             (bars grow, then a bracket, then the ×21.0 ratio number — the
//             single biggest element on the frame) was still mid-reveal at
//             the beat's measured midpoint — bracket and ratio hadn't drawn
//             yet, 26/48 filled. Replaced with a static panel showing both
//             bars and the ×21.0 ratio already settled, full-bright for the
//             whole beat (matching what the comment above always claimed).
//
// Persistent element: the timeline ribbon (archetype 1), b1 through b5, lower
// band y>=600 — the effects keep the bottom clear (look.safeBottom) for it.
// Each beat both adds a new stamp AND extends the connecting line to reach it,
// so the ribbon is never static even though earlier stamps stay on screen.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, seg, Panel, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/v21.json";

const B1 = 15;
const B2 = 192;
const B3 = 346;
const B4 = 481;
const B5 = 725;
const END = 925;

/** Accent tuned for the dark stage (violet's #5B37D4 is too dark on a plate). */
const ACCENT = "#B79DFF";
const STAGE = "#140F24";

// Timeline-ribbon geometry (1280x720, below the effects' safe bottom at y≈587).
const RIBBON_Y = 650;
const RIBBON_X0 = 230;
const RIBBON_X1 = 1200;
const PLATE = { x: 40, y: 600, w: 170, h: 100 };
const STAMP_X = [260, 480, 700, 920, 1140];
const STAMP_LABELS = [
  { label: "ARTICLE IN", tone: "ink" as const },
  { label: "UNCHECKED", tone: "danger" as const },
  { label: "LIKE A RUMOR", tone: "danger" as const },
  { label: "21 CHECKS", tone: "accent" as const },
  { label: "VERIFIED", tone: "success" as const },
];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Stamp: React.FC<{
  x: number;
  tone: "success" | "danger" | "accent" | "ink";
  label: string;
  appearAt: number;
  bright?: boolean;
}> = ({ x, tone, label, appearAt, bright = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < appearAt) return null;
  const sc = punchScale(sec(frame, appearAt, fps), 0);
  const bg = tone === "success" ? P.successBg : tone === "danger" ? P.dangerBg : tone === "accent" ? P.accentBg : P.card;
  const edge = tone === "success" ? P.successEdge : tone === "danger" ? P.dangerEdge : tone === "accent" ? P.accentEdge : P.border;
  const fg = tone === "success" ? P.success : tone === "danger" ? P.danger : tone === "accent" ? P.accent : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 70,
        top: RIBBON_Y - 46,
        width: 140,
        textAlign: "center",
        transform: `scale(${sc})`,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: 6,
          background: bg,
          border: `2px solid ${edge}`,
          boxShadow: bright ? `0 0 18px ${edge}` : "4px 4px 0 rgba(0,0,0,0.5)",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 1,
          color: fg,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div style={{ width: 2, height: 16, background: edge, margin: "0 auto" }} />
    </div>
  );
};

const TimelineRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // The connecting line extends toward whichever stamp most recently landed —
  // this is what keeps the ribbon changing even while old stamps stay put.
  const target =
    frame >= B5 + 30
      ? STAMP_X[4]
      : frame >= B4 + 20
      ? STAMP_X[3]
      : frame >= B3 + 20
      ? STAMP_X[2]
      : frame >= B2 + 20
      ? STAMP_X[1]
      : STAMP_X[0];
  const prevTarget =
    frame >= B5 + 30
      ? STAMP_X[3]
      : frame >= B4 + 20
      ? STAMP_X[2]
      : frame >= B3 + 20
      ? STAMP_X[1]
      : STAMP_X[0];
  const growFrom = frame >= B5 + 30 ? B5 + 30 : frame >= B4 + 20 ? B4 + 20 : frame >= B3 + 20 ? B3 + 20 : frame >= B2 + 20 ? B2 + 20 : B1;
  const grow = tween(sec(frame, growFrom, fps), 0, 0.6, ease.power3InOut);
  const lineEnd = prevTarget + (target - prevTarget) * grow;
  const final = frame >= B5 + 30;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* product plate — names the product plainly, from beat 1 */}
      <Arrive at={B1 + 4} kind="wipe" box={PLATE} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: PLATE.x,
            top: PLATE.y,
            width: PLATE.w,
            height: PLATE.h,
            background: P.card,
            borderRadius: 6,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          }}
        />
        <div style={{ position: "absolute", left: PLATE.x + 16, top: PLATE.y + 16, width: 140 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: P.accent }}>MY SITE</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.25 }}>
            Portfolio &amp; News
            <br />
            Platform
          </div>
        </div>
      </Arrive>

      {/* the ribbon: a baseline plus a line growing toward the latest stamp */}
      <div style={{ position: "absolute", left: RIBBON_X0, top: RIBBON_Y, width: RIBBON_X1 - RIBBON_X0, height: 2, background: P.border, opacity: 0.4 }} />
      <div
        style={{
          position: "absolute",
          left: STAMP_X[0],
          top: RIBBON_Y,
          width: Math.max(0, lineEnd - STAMP_X[0]),
          height: 2,
          background: final ? P.success : P.accent,
        }}
      />

      <Stamp x={STAMP_X[0]} tone={STAMP_LABELS[0].tone} label={STAMP_LABELS[0].label} appearAt={B1 + 24} />
      <Stamp x={STAMP_X[1]} tone={STAMP_LABELS[1].tone} label={STAMP_LABELS[1].label} appearAt={B2 + 10} />
      <Stamp x={STAMP_X[2]} tone={STAMP_LABELS[2].tone} label={STAMP_LABELS[2].label} appearAt={B3 + 10} />
      <Stamp x={STAMP_X[3]} tone={STAMP_LABELS[3].tone} label={STAMP_LABELS[3].label} appearAt={B4 + 20} />
      <Stamp x={STAMP_X[4]} tone={STAMP_LABELS[4].tone} label={STAMP_LABELS[4].label} appearAt={B5 + 30} bright />
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { text: "claim queue: 7 statements extracted", tone: "muted" },
  { text: "google_cse.search(claim) x21", tone: "accent" },
  { text: "source: single -> status HOLD", tone: "ink" },
  { text: "source: 2 independent -> status CONFIRMED", tone: "success" },
  { text: "conflicting sources -> status HOLD", tone: "ink" },
  { text: "chart data verified before render", tone: "ink" },
  { text: "unconfirmed claims dropped from script", tone: "muted" },
  { text: "digest cleared: 21/21 checks run", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: no fact-checking, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "My digest narrated whatever the source said", kicker: "No questions asked, no second source" }}
      />

      {/* b2 — the exaggerated headline goes straight to video, page scrolled deeper */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          title: "One exaggerated headline, straight to video",
          claims: [
            { text: "Source headline matches the real event", verdict: "no" },
            { text: "Numbers checked against a second source", verdict: "no" },
            { text: "Published to the digest as-is", verdict: "yes" },
          ],
        }}
      />

      {/* b3 — the analogy, no product evidence needed */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "Like repeating a rumor on camera",
          line2: "without calling anyone to confirm it",
          keywords: ["rumor", "confirm"],
        }}
      />
      {/* b3 fill — the caption alone leaves the frame mostly empty; a static
          contrast pair gives the analogy a picture, clear of the caption's
          lower third and the timeline ribbon (y>=600). */}
      {frame >= B3 && frame < B4 && (
        <>
          <IconCard x={150} y={150} w={380} emoji="🗣️" title="Repeating a rumor" sub="No one called to confirm" tone="danger" />
          <IconCard x={750} y={150} w={380} emoji="☎️" title="Calling to confirm" sub="Checked before it airs" tone="success" />
        </>
      )}

      {/* b4 — the fix: no runtime log exists on the VPS, so a LogWindow of the
          checker's own numbers is the evidence, dimmed over the repo's commit
          history. This carries the clip's one tech caption. */}
      {cut(frame, B4, B5) === 1 && (
        <>
          <LiveBackdrop file={shotsFile} shot="commits" from={B4} hold={B5 - B4} />
          <AbsoluteFill style={{ background: "rgba(8,6,16,0.72)" }} />
          <LogWindow lines={LOG_LINES} title="research step · fact-check gate" from={B4 + 14} every={13} opacity={seg(frame, B4 + 6, B4 + 24)} />
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 158,
              fontFamily,
              fontSize: 15,
              fontWeight: 700,
              color: "#F1EAFE",
              opacity: seg(frame, B4 + 6, B4 + 24),
            }}
          >
            Google CSE — an API that searches the web for you
          </div>
        </>
      )}

      {/* b5 — the result: not the product, the number, holds to the end.
          Hand-built static panel (was ratioBars — see header for why). */}
      {frame >= B5 && (
        <Panel x={70} y={70} w={1140} h={480} tone="card" radius={28} opacity={1}>
          <div style={{ padding: "34px 50px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>RESULT</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#101418", marginTop: 4 }}>Independent checks per digest</div>
          </div>
          <div style={{ display: "flex", padding: "40px 50px 0", gap: 50, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#5b6b63" }}>Before (manual trust)</div>
              <div style={{ height: 64, width: "15%", background: "#CBD5D1", borderRadius: 8, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, boxSizing: "border-box" }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#101418" }}>1</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#5b6b63", marginTop: 34 }}>Now (per digest)</div>
              <div style={{ height: 64, width: "100%", background: ACCENT, borderRadius: 8, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, boxSizing: "border-box" }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#101418" }}>21</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 96, fontWeight: 800, color: ACCENT }}>×21.0</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#5b6b63", marginTop: 6, whiteSpace: "nowrap" }}>
                Nothing airs on faith alone
              </div>
            </div>
          </div>
        </Panel>
      )}

      <TimelineRibbon />
    </AbsoluteFill>
  );
};

export const FeatureVerifyBeforeYouShowV21: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
