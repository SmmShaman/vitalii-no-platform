// FeatureSecondVisualLanguageDemosV24 — feature v24 — 1280x720, 990 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Voice-synced beat table (narration windows, do not shift):
//  b1  15-192  "Every feature demo looked the same: dark, dense, built for people who already read code."
//  b2 201-375  "If you weren't technical, the videos were noise — like reading sheet music instead of hearing the song."
//  b3 384-563  "I built a second visual language in Remotion — bright, plain-English panels anyone can follow."
//  b4 572-743  "Then I gave one feature a voice: a full narrated walkthrough instead of a silent loop."
//  b5 752-945  "That walkthrough runs fifty-four seconds — the first fully narrated demo this project has ever shipped." — holds to 990.
//
// Beat -> effect (data only from the feature row; plan: shots/v24.motion.json):
//  b1 titleTakeover over the feature's own page (backdrop "page").
//  b2 keywordCaption over the features hub (backdrop "hub") — scrolling the old roster.
//  b3 handoffExplain over the repo's commit history (backdrop "commits") — dark style -> bright style.
//  b4 pipelineFlow over the repo's Actions runs (backdrop "actions") — write beats, measure, sync.
//  b5 drawn: the flow-map fork resolves + a LogWindow result panel built from the feature's own
//     numbers (2 visual languages instead of 1, first 54-second narrated walkthrough). Never the
//     feature page or the hub (gate 2).
//
// Persistent element: the flow-map lower third (archetype 4) — one token travels from a single
// source node to a fork, then forks into two routes: "BRIGHT V2 STYLE" lights at b3, "NARRATED
// STORY CUT" lights at b4 and carries the "54 s" result badge from b5.
// Single tech name in the whole clip: Remotion (b3 handoffExplain point only).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { Headline, fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/v24.json";

const B1 = 15;
const B2 = 201;
const B3 = 384;
const B4 = 572;
const B5 = 752;
const END = 990;

const ACCENT = "#5B9DFF";
const STAGE = "#161B22";

const LT = { x: 40, y: 600, w: 1200, h: 106 };
const SRC = { x: LT.x + 10, y: LT.y + 10, w: 180, h: 86 };
const FORK_X = SRC.x + SRC.w + 56;
const NODE_W = 300;
const NODE_X = FORK_X + 70;
const TOP_Y = LT.y + 8;
const BOT_Y = LT.y + 60;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const toFork = tween(sec(frame, B1 + 20, fps), 0, (B3 - 20 - (B1 + 20)) / fps, ease.linear);
  const litUp = frame >= B3 + 10;
  const litDown = frame >= B4 + 10;
  const tokenX = mix(toFork, SRC.x + SRC.w + 4, FORK_X);
  const tokenY = LT.y + LT.h / 2 - 9;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: SRC.x,
            top: SRC.y,
            width: SRC.w,
            height: SRC.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 14px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.4, color: P.ink, textAlign: "center", lineHeight: 1.3 }}>
            FEATURE
            <br />
            DEMOS
          </div>
        </div>
        <div style={{ position: "absolute", left: SRC.x + SRC.w, top: tokenY + 9, width: FORK_X - (SRC.x + SRC.w), height: 2, background: P.border }} />
        <div style={{ position: "absolute", left: FORK_X, top: TOP_Y + 16, width: 2, height: BOT_Y + 16 - (TOP_Y + 16), background: P.border }} />
        <div style={{ position: "absolute", left: FORK_X, top: TOP_Y + 16, width: NODE_X - FORK_X, height: 2, background: P.border }} />
        <div style={{ position: "absolute", left: FORK_X, top: BOT_Y + 16, width: NODE_X - FORK_X, height: 2, background: P.border }} />
      </Arrive>

      <Arrive at={B2 + 30} kind="rise" box={{ x: NODE_X, y: TOP_Y, w: NODE_W, h: 34 }}>
        <div
          style={{
            position: "absolute",
            left: NODE_X,
            top: TOP_Y,
            width: NODE_W,
            height: 34,
            borderRadius: 4,
            background: litUp ? P.success : P.card,
            border: litUp ? `2px solid ${P.success}` : `2px dashed ${P.muted}`,
            color: litUp ? "#fff" : P.muted,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            boxSizing: "border-box",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1,
            transform: `scale(${litUp ? punchScale(sec(frame, B3 + 10, fps), 0) : 1})`,
          }}
        >
          BRIGHT V2 STYLE
        </div>
      </Arrive>
      <Arrive at={B2 + 30} kind="rise" box={{ x: NODE_X, y: BOT_Y, w: NODE_W, h: 34 }}>
        <div
          style={{
            position: "absolute",
            left: NODE_X,
            top: BOT_Y,
            width: NODE_W,
            height: 34,
            borderRadius: 4,
            background: litDown ? P.success : P.card,
            border: litDown ? `2px solid ${P.success}` : `2px dashed ${P.muted}`,
            color: litDown ? "#fff" : P.muted,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
            boxSizing: "border-box",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1,
            transform: `scale(${litDown ? punchScale(sec(frame, B4 + 10, fps), 0) : 1})`,
          }}
        >
          NARRATED STORY CUT
        </div>
      </Arrive>

      {frame < B3 + 10 && (
        <div style={{ position: "absolute", left: tokenX - 9, top: tokenY, width: 18, height: 18, borderRadius: 9, background: P.accent }} />
      )}

      {frame >= B5 + 40 && (
        <>
          <div
            style={{
              position: "absolute",
              left: NODE_X + NODE_W + 14,
              top: BOT_Y - 3,
              width: 90,
              height: 40,
              borderRadius: 4,
              background: P.ink,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 800,
              transform: `scale(${punchScale(sec(frame, B5 + 40, fps), 0)})`,
            }}
          >
            54 s
          </div>
          <div style={{ position: "absolute", left: NODE_X + NODE_W + 104, top: BOT_Y + 16, width: 1220 - (NODE_X + NODE_W + 104), height: 2, background: P.success }} />
        </>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the old dark style, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Only for people who code", kicker: "Every feature demo, until now" }}
      />

      {/* b2 — the cost of the old style, over the hub roster */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "If you don't read code,", line2: "the videos were just noise.", keywords: ["don't read code", "noise"] }}
      />

      {/* b3 — the fix, over the repo's commit history */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="commits" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Dark terminal style",
          to: "Bright explainer panels",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Problem/solution zones", "Real browser mockups", "Remotion (video code)"],
        }}
      />

      {/* b4 — giving one feature a voice, over the repo's render runs */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="actions" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Write voice beats", "Measure durations", "Sync picture to words"],
          result: "Narrated walkthrough",
        }}
      />

      {/* b5 — the result, drawn: never the feature page or the hub (gate 2) */}
      {frame >= B5 && (
        <>
          <div style={{ position: "absolute", left: 40, top: 22, fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.muted, fontFamily }}>
            FEATURE DEMOS PIPELINE
          </div>
          <div style={{ position: "absolute", left: 1100, top: 22, fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.muted, fontFamily }}>
            V24
          </div>
          <Headline y={64} text="Two visual languages now" accentText="instead of one" accentColor={P.success} fontSize={34} />
          <LogWindow
            win={{ x: 80, y: 150, w: 1120, h: 400 }}
            title="feature-demos pipeline"
            from={B5 + 10}
            every={16}
            opacity={cut(frame, B5, END)}
            lines={[
              { t: "before", text: "demo styles available: 1 (dark, silent loop)", tone: "muted" },
              { t: "now", text: "demo styles available: 2 (dark + bright)", tone: "accent" },
              { t: "today", text: "first narrated walkthrough shipped", tone: "success" },
              { t: "runtime", text: "54 seconds, voice-synced end to end", tone: "success" },
              { t: "timing", text: "picture baked from the measured voice track", tone: "ink" },
            ]}
          />
        </>
      )}

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureSecondVisualLanguageDemosV24: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
