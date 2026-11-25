// FeatureEveryStageUsedGuessB114 — feature b114 — 1280x720, 933 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Split-duel strip: GUESSING ALONE (chaos, 5 disconnected stage tokens) on the left
// vs ONE SHARED FILE (order, the same 5 tokens wired to a shared-notes hub) on the
// right. A vertical divider sweeps left→right across the whole clip, flipping each
// token from chaos to order as it passes — the only mover the archetype needs.
//
// Beat → effect (data only from the feature row, no commit matches this feature):
// b1 15-220   "each lesson stage guessed the facts fresh" — cornerTags over the
//             feature's own page, names Boytasks plainly, lists the 5 stages.
// b2 220-398  "no memory of subject, child, or yesterday's mistake" — keywordCaption,
//             two short lines, over the page scrolled further.
// b3 398-589  "all five stages now read the same shared notes" — handoffExplain
//             (BEFORE guesses alone → NOW one file per subject/child), over the page.
// b4 589-746  "Claude adds every correction back into those notes" — pipelineFlow,
//             the one tech name (Claude) sits on the pipeline with its gloss, over
//             the features hub.
// b5 746-933  "zero extra model calls" — funnelAbsorption, no backdrop (dark stage
//             only — this feature has no other verified URL), holds to the end.
//
// Persistent element: the split-duel strip (archetype 0), b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b114.json";

const B1 = 15;
const B2 = 220;
const B3 = 398;
const B4 = 589;
const B5 = 746;
const END = 933;

/** Bright mint on a dark stage — mint's own accent (#0B7A5A) is too dark to read here. */
const ACCENT = "#4FD8A1";
const STAGE = "#0C1F16";

// Split-duel strip geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const STAGES = ["base", "plan", "judge", "build", "review"];
const TOKEN_W = 170;
const TOKEN_GAP = 20;
const TOKENS_X = LT.x + 190;
const HUB_X = LT.x + LT.w - 150;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const SplitDuelStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Divider stays left through b1-b2 (still fully chaos), sweeps right across
  // b3-b4 as the stages gain a shared file, settles fully right by b5.
  const progress = frame < B2 ? 0 : tween(sec(frame, B2, fps), 0, (B5 - B2) / fps, ease.power3InOut);
  const dividerX = LT.x + 20 + progress * (LT.w - 40);

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
        <div style={{ position: "absolute", left: LT.x + 16, top: LT.y + 10, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: P.accent }}>
          BOYTASKS
        </div>
        <div style={{ position: "absolute", left: LT.x + 16, top: LT.y + 70, fontSize: 12, fontWeight: 700, color: P.danger }}>
          GUESSING ALONE
        </div>
        <div style={{ position: "absolute", left: HUB_X - 30, top: LT.y + 70, fontSize: 12, fontWeight: 700, color: P.success }}>
          ONE SHARED FILE
        </div>
      </Arrive>

      {/* the 5 stage tokens — flip from chaos (dashed/gray) to order (lit/wired) as the divider passes */}
      {STAGES.map((name, i) => {
        const x = TOKENS_X + i * (TOKEN_W + TOKEN_GAP) * 0.78;
        const flipAt = (i + 0.5) / STAGES.length;
        const lit = progress > flipAt;
        return (
          <Arrive key={name} at={B1 + 24 + i * 6} kind="rise" box={{ x, y: LT.y + 20, w: TOKEN_W * 0.78, h: 56 }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: LT.y + 20,
                width: TOKEN_W * 0.78,
                height: 56,
                borderRadius: 4,
                background: lit ? P.successBg : P.dangerBg,
                border: `2px ${lit ? "solid" : "dashed"} ${lit ? P.successEdge : P.dangerEdge}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: lit ? P.success : P.danger,
                textTransform: "uppercase",
              }}
            >
              {name}
            </div>
            {lit && (
              <div
                style={{
                  position: "absolute",
                  left: x + TOKEN_W * 0.39,
                  top: LT.y + 48,
                  width: Math.max(0, HUB_X - (x + TOKEN_W * 0.39)),
                  height: 2,
                  background: P.successEdge,
                }}
              />
            )}
          </Arrive>
        );
      })}

      {/* the shared-notes hub, right edge — lights up once the first token wires in */}
      <Arrive at={B3} kind="punch" box={{ x: HUB_X, y: LT.y + 16, w: 110, h: 64 }}>
        <div
          style={{
            position: "absolute",
            left: HUB_X,
            top: LT.y + 16,
            width: 110,
            height: 64,
            borderRadius: 4,
            background: progress > 0.1 ? P.success : P.card,
            border: `2px solid ${progress > 0.1 ? P.success : P.border}`,
            color: progress > 0.1 ? "#fff" : P.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            textAlign: "center",
            padding: "0 8px",
            boxSizing: "border-box",
          }}
        >
          shared notes
        </div>
      </Arrive>

      {/* divider — the only continuous mover, sweeping chaos → order */}
      <div
        style={{
          position: "absolute",
          left: dividerX,
          top: LT.y + 6,
          width: 4,
          height: LT.h - 12,
          background: P.ink,
        }}
      />
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, names Boytasks plainly, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Boytasks: every lesson stage guessed the facts fresh",
          tags: ["base stage", "plan stage", "judge stage", "build stage", "review stage"],
        }}
      />

      {/* b2 — no memory of subject, child or mistake, over the page scrolled further */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          line1: "No memory of the subject or child",
          line2: "no memory of yesterday's mistake",
          keywords: ["no memory"],
        }}
      />

      {/* b3 — the fix: one shared file per subject + child, over the page again */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Each stage guesses alone",
          to: "All 5 stages share one file",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["One skill file per subject", "One skill file per child", "base, plan, judge, build, review"],
        }}
      />

      {/* b4 — Claude writes corrections back automatically, over the features hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Teacher review", "Verdict becomes a note", "Note appended to shared file"],
          result: "Added back automatically",
          system: "Claude — AI that writes the notes",
        }}
      />

      {/* b5 — zero extra model calls; no other verified URL for this feature, dark stage only */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          inputs: ["Teacher flags the mistake", "Verdict logged once", "Note appended automatically"],
          result: "Zero extra model calls",
        }}
      />

      <SplitDuelStrip />
    </AbsoluteFill>
  );
};

export const FeatureEveryStageUsedGuessB114: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
