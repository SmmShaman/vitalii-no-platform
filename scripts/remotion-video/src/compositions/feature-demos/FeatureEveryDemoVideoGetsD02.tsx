// FeatureEveryDemoVideoGetsD02 — feature d02 — 1280x720, 873 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar narrative, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, over the real product as evidence, one owner
// of the frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature row and commit 7f94159):
// b1 15-127   "nowhere real to go" — keywordCaption over the feature's own page.
// b2 127-286  "just local files, waiting" — cornerTags: four missing-pieces facts
//             from problem_en, over the page lower down.
// b3 286-443  "one command publishes straight to it" — handoffExplain over the
//             features hub (the public catalog the command fills in).
// b4 443-641  "a single Cloudflare worker ... feeds the same queue" — pipelineFlow,
//             drawn (no recording: this is invisible plumbing, not a page).
// b5 641-828  "the limit holds at exactly ninety five megabytes" — copyCorrection,
//             drawn result, holds to the end, no fade.
//
// Persistent element: the sidebar lower third (archetype 6) — a fixed left claim
// column plus a progress row of pipeline-stage chips, b1 through b5. Effects keep
// the bottom clear (look.safeBottom) — that is where the sidebar sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d02.json";

const B1 = 15;
const B2 = 127;
const B3 = 286;
const B4 = 443;
const B5 = 641;
const END = 873;

/** Accent tuned for the dark stage (mint's own #0B7A5A reads too dark on a plate). */
const ACCENT = "#36D6A5";
const STAGE = "#0D1F18";

// Sidebar geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const CLAIM_W = 340;
const CHIP_W = 150;
const CHIP_GAP = 18;
const STAGE_X = LT.x + CLAIM_W + 24;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const STAGES: { at: number; label: string }[] = [
  { at: B1, label: "Local file" },
  { at: B2, label: "demo.mjs" },
  { at: B3, label: "Project page" },
  { at: B4, label: "Worker + queue" },
  { at: B5, label: "95 MB cap" },
];

const CLAIMS: { at: number; kicker: string; text: string }[] = [
  { at: B1, kicker: "THE PROBLEM", text: "No home for finished videos" },
  { at: B2, kicker: "THE PROBLEM", text: "Waiting to upload by hand" },
  { at: B3, kicker: "THE FIX", text: "One command, one page" },
  { at: B4, kicker: "THE FIX", text: "Worker feeds the daily queue" },
  { at: B5, kicker: "THE RESULT", text: "95 MB limit, enforced" },
];

const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  let claim = CLAIMS[0];
  let claimAt = B1;
  for (const c of CLAIMS) {
    if (frame >= c.at) {
      claim = c;
      claimAt = c.at;
    }
  }
  const swap = tween(sec(frame, claimAt, fps), 0, 0.35, ease.power3Out);

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
        <div style={{ position: "absolute", left: LT.x + 1, top: LT.y + 1, width: 1, height: LT.h - 2, background: P.border }} />
      </Arrive>

      {/* fixed left column: the running claim, text swaps at each beat */}
      <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: CLAIM_W - 40 }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent, opacity: mix(swap, 0.4, 1) }}>
          {claim.kicker}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: P.ink,
            marginTop: 6,
            lineHeight: 1.22,
            opacity: swap,
            transform: `translateY(${mix(swap, 10, 0)}px)`,
          }}
        >
          {claim.text}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: STAGE_X - 1,
          top: LT.y + 20,
          width: 1,
          height: LT.h - 40,
          background: P.border,
        }}
      />

      {/* right stage: pipeline chips lighting up as the clip progresses */}
      {STAGES.map((st, i) => {
        const x = STAGE_X + i * (CHIP_W + CHIP_GAP);
        const lit = frame >= st.at;
        const justLit = lit ? tween(sec(frame, st.at, fps), 0, 0.3, ease.power3Out) : 0;
        return (
          <div
            key={st.label}
            style={{
              position: "absolute",
              left: x,
              top: LT.y + 26,
              width: CHIP_W,
              height: 40,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 8px",
              background: lit ? P.successBg : P.chipBg,
              border: `2px solid ${lit ? P.successEdge : P.border}`,
              transform: `scale(${mix(justLit, 0.92, 1)})`,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: lit ? P.success : P.muted, lineHeight: 1.1 }}>
              {st.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** b1-only credibility line: names the product plainly, away from the sidebar and the effect's own text. */
const ProductTag: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B2) return null;
  const p = tween(sec(frame, B1 + 6, 30), 0, 0.3, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 36,
        padding: "8px 16px",
        borderRadius: 4,
        background: "rgba(8,8,8,0.55)",
        opacity: p,
        transform: `translateY(${mix(p, -8, 0)}px)`,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>
        Product: Demo Video Pipeline — product demo videos, cataloged and published automatically
      </span>
    </div>
  );
};

/** b4 fill: the worker's own steps spelled out across the open canvas (drawn, no page to show). */
const WorkerFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B4 || frame >= B5) return null;

  const steps = ["R2 bucket stores it", "Timer checks queue", "Feeds video queue", "Marks version live"];
  const stepW = 250;
  const gap = 24;
  const totalW = steps.length * stepW + (steps.length - 1) * gap;
  const startX = (1280 - totalW) / 2;
  const y = 110;
  const footerAt = B4 + 10 + steps.length * 12 + 10;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {steps.map((s, i) => {
        const at = B4 + 10 + i * 12;
        if (frame < at) return null;
        const sc = punchScale(sec(frame, at, fps), 0);
        const x = startX + i * (stepW + gap);
        return (
          <React.Fragment key={s}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: stepW,
                height: 100,
                borderRadius: 6,
                background: P.card,
                border: `2px solid ${P.accentEdge}`,
                boxSizing: "border-box",
                padding: "12px 16px",
                transform: `scale(${sc})`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>STEP {i + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: P.ink, marginTop: 6, lineHeight: 1.25 }}>{s}</div>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: x + stepW + 2,
                  top: y + 38,
                  width: gap - 4,
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  color: P.muted,
                }}
              >
                {"→"}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {frame >= footerAt && (
        <>
          <div
            style={{
              position: "absolute",
              left: startX,
              top: y + 150,
              padding: "10px 20px",
              borderRadius: 6,
              background: P.successBg,
              border: `2px solid ${P.successEdge}`,
              opacity: tween(sec(frame, footerAt, fps), 0, 0.3, ease.power3Out),
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1, color: P.success }}>SYSTEM — Cloudflare Worker</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: startX + totalW - 230,
              top: y + 150,
              padding: "10px 20px",
              borderRadius: 6,
              background: P.chipBg,
              border: `2px solid ${P.border}`,
              opacity: tween(sec(frame, footerAt, fps), 0, 0.3, ease.power3Out),
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1, color: P.ink }}>RESULT — Ships daily</span>
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
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          line1: "Every finished demo video",
          line2: "had nowhere real to go",
          keywords: ["nowhere", "real", "go"],
        }}
      />
      <ProductTag />

      {/* b2 — what was missing (problem_en), over the page lower down */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Just local files, waiting",
          tags: ["No catalog page", "No version history", "No queue link", "Uploaded by hand"],
        }}
      />

      {/* b3 — the fix, over the public features hub the command fills in */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Local file, upload by hand",
          to: "One command, its own page",
          points: ["demo.mjs publish command", "Registers the version", "Gets a public project page"],
        }}
      />

      {/* b4 — the worker and the daily queue: drawn, no recording (invisible plumbing) */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          steps: ["R2 bucket stores it", "Timer checks queue", "Feeds video queue", "Marks version live"],
          result: "Ships daily",
          system: "Cloudflare Worker",
        }}
      />
      <WorkerFlow />

      {/* b5 — the result: drawn, holds to the end, no fade */}
      <MotionInsert
        effect="copyCorrection"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          wrong: "Oversized files failed silently",
          right: "Blocked at exactly 95 megabytes",
          label: "ENFORCED NOW",
        }}
      />

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureEveryDemoVideoGetsD02: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
