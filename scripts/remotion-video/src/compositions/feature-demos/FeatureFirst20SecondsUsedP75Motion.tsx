// FeatureFirst20SecondsUsedP75Motion — feature p75 — 1280x720, 972 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// The same voice and beat windows as FeatureFirst20SecondsUsedP75; the picture is
// re-directed the way the daily digest was on 2026-10-05: one editorial effect per
// sentence, chosen by what changes on screen, over the real product as evidence,
// one owner of the frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature row and commit 895dfe9):
// b1 15-279   "a generic stock photo, twenty seconds of nothing"
//             titleTakeover over the feature's own page (backdrop). In the lower
//             third the flow-map token crawls the stock-photo block, a counter
//             riding it 0 → 20 s — the only mover after the title has landed.
// b2 288-460  "a slow, content-free intro"
//             cornerTags: the claim + four facts from problem_en, over the page lower down.
// b3 469-649  "cuts straight from one spoken line into the real photos"
//             handoffExplain over the real commit page (895dfe9, ColdOpenScene.tsx).
//             The lower third reroutes: the block shrinks to the greeting, the
//             headline node moves left and lights up as three story photos.
// b4 658-810  "the cut lands exactly on the right word, timed with Remotion"
//             pipelineFlow greeting → word timestamps → photo cut; the one tech
//             name sits on the pipeline frame with its gloss.
// b5 819-972  "eighteen seconds of dead air gone from every episode"
//             ratioBars 20 s vs 2 s (result_en: "within seconds", "roughly 18 s");
//             holds to the end, no fade.
//
// Persistent element: the flow-map lower third (archetype 4), b1 through b5.
// Effects keep the bottom 200/1080 px clear (look.safeBottom) — that is where it sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p75.json";

const B1 = 15;
const B2 = 288;
const B3 = 469;
const B4 = 658;
const B5 = 819;
const END = 972;

/** Accent tuned for the dark stage (sand's #B4531F is too dark on a plate). */
const ACCENT = "#F08A4B";
const STAGE = "#1C1610";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 50;
const BLOCK_X = 268;
const BLOCK_W_OLD = 560;
const BLOCK_W_NEW = 170;
const NODE_W = 196;
const NODE_X_OLD = BLOCK_X + BLOCK_W_OLD + 34;
const NODE_X_NEW = BLOCK_X + BLOCK_W_NEW + 34;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // b1: the token crawls the stock-photo block linearly; the counter rides it.
  const crawl = tween(sec(frame, B1 + 45, fps), 0, (B2 - 12 - (B1 + 45)) / fps, ease.linear);
  // b3: one camera move hands the route to the new opening.
  const hand = tween(sec(frame, B3 + 30, fps), 0, 0.6, ease.power3InOut);
  const isNew = frame >= B3 + 30;
  const blockW = mix(hand, BLOCK_W_OLD, BLOCK_W_NEW);
  const nodeX = mix(hand, NODE_X_OLD, NODE_X_NEW);
  const tokenX = isNew ? BLOCK_X + blockW - 12 : BLOCK_X + 12 + crawl * (BLOCK_W_OLD - 24);
  const seconds = Math.round(crawl * 20);
  const lit = isNew;
  const tone = lit ? P.success : P.danger;

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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: 190 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>THE OPENING</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            vitalii.no daily
            <br />
            news video
          </div>
        </div>
        {/* route line */}
        <div style={{ position: "absolute", left: BLOCK_X - 22, top: LINE_Y - 1, width: 960, height: 2, background: P.border }} />
        <div style={{ position: "absolute", left: BLOCK_X - 30, top: LINE_Y - 8, width: 16, height: 16, borderRadius: 8, background: P.ink }} />
      </Arrive>

      {/* the opening block: stock photo (old) → one-line greeting (new) */}
      <Arrive at={B1 + 20} kind="wipe" box={{ x: BLOCK_X, y: LT.y + 14, w: BLOCK_W_OLD, h: 64 }} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: BLOCK_X,
            top: LT.y + 14,
            width: blockW,
            height: 64,
            background: lit ? P.successBg : P.dangerBg,
            border: `2px solid ${lit ? P.successEdge : P.dangerEdge}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 12, top: 8, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: tone, whiteSpace: "nowrap" }}>
            {lit ? "ONE-LINE GREETING" : "GENERIC STOCK PHOTO"}
          </div>
          {!lit && (
            <div style={{ position: "absolute", left: 0, top: 46, width: crawl * blockW, height: 4, background: P.danger }} />
          )}
        </div>
        {/* token + the counter that rides it */}
        <div style={{ position: "absolute", left: tokenX - 9, top: LINE_Y - 9, width: 18, height: 18, borderRadius: 9, background: tone }} />
        {!lit && (
          <div
            style={{
              position: "absolute",
              left: Math.min(tokenX + 14, BLOCK_X + BLOCK_W_OLD - 70),
              top: LT.y + 30,
              fontSize: 22,
              fontWeight: 800,
              color: P.danger,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {seconds} s
          </div>
        )}
      </Arrive>

      {/* first real headline: unlit at the end of 20 s (old) → lit, right after the greeting (new) */}
      <Arrive at={B1 + 34} kind="rise" box={{ x: NODE_X_OLD, y: LT.y + 14, w: NODE_W, h: 64 }}>
        <div
          style={{
            position: "absolute",
            left: nodeX,
            top: LT.y + 14,
            width: NODE_W,
            height: 64,
            background: lit ? P.success : P.card,
            border: lit ? `2px solid ${P.success}` : `2px dashed ${P.muted}`,
            borderRadius: 4,
            color: lit ? "#fff" : P.muted,
            padding: "8px 12px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6 }}>{lit ? "TOP 3 STORIES" : "FIRST HEADLINE"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{lit ? "real photos" : frame >= B2 ? "after ~20 s" : "waiting…"}</div>
        </div>
      </Arrive>

      {/* b3: the three story photos punch in one by one after the hand-off */}
      {[0, 1, 2].map((i) => {
        const at = B3 + 60 + i * 9;
        if (frame < at) return null;
        const x = NODE_X_NEW + NODE_W + 20 + i * 76;
        const sc = punchScale(sec(frame, at, fps), 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: LT.y + 16,
              width: 64,
              height: 60,
              borderRadius: 4,
              background: [P.accentBg, P.successBg, P.noteBg][i],
              border: `2px solid ${[P.accentEdge, P.successEdge, P.noteBorder][i]}`,
              transform: `scale(${sc})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: P.ink,
            }}
          >
            {i + 1}
          </div>
        );
      })}

      {/* b4: the cut marker lands on the junction greeting → photos */}
      {frame >= B4 + 24 && (
        <div
          style={{
            position: "absolute",
            left: NODE_X_NEW - 19,
            top: LT.y + 6,
            width: 4,
            height: 80,
            background: P.accent,
            transformOrigin: "50% 100%",
            transform: `scaleY(${tween(sec(frame, B4 + 24, fps), 0, 0.3, ease.expoOut)})`,
          }}
        />
      )}

      {/* b5: the result stamp on the headline node */}
      {frame >= B5 + 70 && (
        <div
          style={{
            position: "absolute",
            left: 1010,
            top: LT.y + 18,
            width: 200,
            height: 56,
            borderRadius: 4,
            background: P.ink,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            transform: `scale(${punchScale(sec(frame, B5 + 70, fps), 0)})`,
          }}
        >
          headline in ~2 s
        </div>
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
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "20 seconds of nothing", kicker: "Every episode, before the first real headline" }}
      />

      {/* b2 — what the viewer sat through (problem_en) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A slow, content-free intro",
          tags: ["Generic stock photo", "Unrelated voiceover", "About 20 seconds", "Every single day"],
        }}
      />

      {/* b3 — the fix, over the real commit */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="commit" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Generic stock photo",
          to: "Top 3 story photos",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["One spoken greeting first", "Hard cut into the real photos", "ColdOpenScene.tsx"],
        }}
      />

      {/* b4 — how the cut finds its word, over ColdOpenScene.tsx ("times come from the word timings") */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="code" from={B4} hold={B5 - B4} focus={{ x: 0.3, y: 0.3 }} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Spoken greeting", "Word timestamps", "Photo cut"],
          result: "Lands on the word",
          system: "Remotion (video code)",
        }}
      />

      {/* b5 — the result over the commit summary, holds to the end */}
      {frame >= B5 && <LiveBackdrop file={shotsFile} shot="commit-top" from={B5} hold={END - B5} />}
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Seconds before the first headline",
          a: { label: "Old intro", value: 20 },
          b: { label: "Cold open", value: 2 },
          unit: "s",
          caption: "~18 s saved/episode",
        }}
      />

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureFirst20SecondsUsedP75Motion: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
