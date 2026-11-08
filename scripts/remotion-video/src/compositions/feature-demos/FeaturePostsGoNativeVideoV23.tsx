// FeaturePostsGoNativeVideoV23 — feature v23 — 1280x720, 869 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row; no verified commit for v23, so
// b3/b4 draw the mechanism on a dark plate instead of a LiveBackdrop):
// b1 15-174   "every feature already had its own demo clip, the post was just a photo"
//             titleTakeover over the features hub (many clips already exist).
// b2 174-292  "uploading it by hand, for every post, wasn't sustainable"
//             cornerTags over the feature's own page.
// b3 292-494  "LinkedIn makes you register the upload, then wait for it to finish"
//             pipelineFlow, drawn (register -> push bytes -> poll status).
// b4 494-656  "now one Supabase function does that itself, posts the real clip"
//             handoffExplain, drawn (manual upload -> nano-social-publish).
// b5 656-869  "if the upload fails, the post still goes out as text"
//             no catalog effect: a LogWindow plays the real request/fallback
//             sequence from solution_en, holds to the end.
//
// Persistent element: a 3-card "post format" deck (archetype 3) in the lower
// third, b1 through b5. It starts stacked (TEXT/PHOTO/VIDEO piled, queued one
// at a time), fans out while the upload pipeline runs, re-sorts itself to put
// VIDEO in front once the function posts it, and grows a dashed fallback
// branch back to TEXT in b5 — the pile shrinking/sorting IS the story.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import { LogWindow, type LogLine } from "./live-primitives";
import shotsFile from "./shots/v23.json";

const B1 = 15;
const B2 = 174;
const B3 = 292;
const B4 = 494;
const B5 = 656;
const END = 869;

/** dawn's own accent (#2563EB) reads fine on a dark plate; lighten slightly for the stage. */
const ACCENT = "#5B8DEF";
const STAGE = "#101826";

// Lower third geometry (1280x720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 50;
const CAPTION_W = 190;
const ROUTE_X0 = LT.x + CAPTION_W + 48;
const STACK_X = ROUTE_X0 + 40;
const FAN_X = [STACK_X, STACK_X + 112, STACK_X + 224];
const CARD_W = 94;
const CARD_H = 60;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LOG_LINES: LogLine[] = [
  { t: "[LinkedIn]", text: "registerUpload -> feedshare-video", tone: "accent" },
  { t: "[LinkedIn]", text: "PUT video bytes (<=50MB)", tone: "ink" },
  { t: "[LinkedIn]", text: "poll asset status every 5s, up to 120s", tone: "muted" },
  { t: "[LinkedIn]", text: "asset FAILED", tone: "danger" },
  { t: "[fallback]", text: "falling back to text-only post", tone: "accent" },
  { t: "[Facebook]", text: "POST /{pageId}/videos", tone: "ink" },
  { t: "[post]", text: "published", tone: "success" },
];

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // b2: a red "by hand" meter crawls while the upload is manual.
  const byHand = tween(sec(frame, B2 + 10, fps), 0, (B3 - 10 - (B2 + 10)) / fps, ease.linear);
  // b3: the deck fans out from the stacked pile.
  const fan = tween(sec(frame, B3 + 15, fps), 0, 0.6, ease.power3InOut);
  // b4: VIDEO re-sorts to the front of the deck.
  const sorted = frame >= B4 + 15;
  const resort = tween(sec(frame, B4 + 15, fps), 0, 0.45, ease.power3InOut);
  const order = sorted ? ["VIDEO", "PHOTO", "TEXT"] : ["TEXT", "PHOTO", "VIDEO"];
  const prevOrder = ["TEXT", "PHOTO", "VIDEO"];
  const posFor = (label: string) => {
    const now = order.indexOf(label);
    const prev = prevOrder.indexOf(label);
    const idx = mix(resort, prev, now);
    return idx;
  };
  const stacked = frame < B3 + 15;

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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: CAPTION_W }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>POST FORMAT</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            {frame < B2 ? "queued, one at a time" : frame < B3 ? "uploading by hand" : frame < B4 ? "LinkedIn Assets API" : "posted automatically"}
          </div>
        </div>
        <div style={{ position: "absolute", left: ROUTE_X0 - 22, top: LINE_Y - 1, width: 1200 - CAPTION_W - 90, height: 2, background: P.border }} />
      </Arrive>

      {/* the deck: TEXT / PHOTO / VIDEO, stacked -> fanned -> re-sorted */}
      {["TEXT", "PHOTO", "VIDEO"].map((label) => {
        const idx = posFor(label);
        const x = stacked ? STACK_X + ["TEXT", "PHOTO", "VIDEO"].indexOf(label) * 8 : mix(fan, STACK_X, FAN_X[Math.round(idx)]);
        const isVideo = label === "VIDEO";
        const lit = isVideo && sorted;
        const tone = lit ? P.success : P.muted;
        return (
          <Arrive key={label} at={B1 + 20} kind="rise" box={{ x: STACK_X, y: LT.y + 14, w: CARD_W, h: CARD_H }}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: LT.y + 14,
                width: CARD_W,
                height: CARD_H,
                background: lit ? P.successBg : P.chipBg,
                border: `2px solid ${lit ? P.successEdge : P.border}`,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: isVideo && frame >= B4 + 15 ? `scale(${punchScale(sec(frame, B4 + 15, fps), 0)})` : undefined,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: tone }}>{label}</div>
              {isVideo && lit && <div style={{ fontSize: 11, fontWeight: 700, color: P.success, marginTop: 2 }}>posted</div>}
            </div>
          </Arrive>
        );
      })}

      {/* b2: the manual-upload meter */}
      {frame >= B2 + 10 && frame < B3 + 15 && (
        <div style={{ position: "absolute", left: STACK_X, top: LT.y + 78, width: CARD_W, height: 4, background: P.chipBg }}>
          <div style={{ width: byHand * CARD_W, height: 4, background: P.danger }} />
        </div>
      )}

      {/* b3: three route dots lighting left->right (register -> push -> poll) */}
      {frame >= B3 + 15 &&
        frame < B4 &&
        [0, 1, 2].map((i) => {
          const at = B3 + 30 + i * 36;
          if (frame < at) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: ROUTE_X0 + i * 26,
                top: LINE_Y - 5,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: P.accent,
                transform: `scale(${punchScale(sec(frame, at, fps), 0)})`,
              }}
            />
          );
        })}

      {/* b5: the dashed fallback branch back to TEXT */}
      {frame >= B5 + 30 && (
        <Arrive at={B5 + 30} kind="rise" box={{ x: STACK_X, y: LT.y + 14, w: 260, h: 30 }}>
          <div
            style={{
              position: "absolute",
              left: STACK_X,
              top: LT.y + 80,
              fontSize: 12,
              fontWeight: 700,
              color: P.muted,
              borderTop: `2px dashed ${P.border}`,
              paddingTop: 4,
              width: 260,
            }}
          >
            fails? → still goes out as TEXT, never lost
          </div>
        </Arrive>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const logOpacity = frame >= B5 ? tween(sec(frame, B5 + 6, 30), 0, 0.4, ease.power2Out) : 0;

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — every feature already had a clip, the post was just a photo */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Clip ready. Post? A photo.", kicker: "Every feature already had its own demo clip" }}
      />

      {/* b2 — manual upload, every post, not sustainable */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Manual upload, every single post",
          tags: ["One video file", "One post", "Every feature ships", "Not sustainable"],
        }}
      />

      {/* b3 — LinkedIn: register, push bytes, then wait (no public commit, draw it) */}
      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          title: "Then publish — LinkedIn Assets API",
          claims: [
            { text: "Register upload", verdict: "yes" },
            { text: "Push video bytes", verdict: "yes" },
            { text: "Poll asset status", verdict: "yes" },
          ],
        }}
      />

      {/* b4 — nano-social-publish does the hand-off itself (no public commit, draw it) */}
      <MotionInsert
        effect="featureMatrix"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          options: ["Manual", "Function"],
          rows: [
            { label: "Registers + uploads clip", values: [false, true] },
            { label: "Posts real demo video", values: [false, true] },
            { label: "Needs a human, every post", values: [true, false] },
          ],
        }}
      />

      {/* b5 — the fallback, shown as the real request/fallback sequence, holds to the end */}
      {frame >= B5 && (
        <LogWindow
          lines={LOG_LINES}
          title="nano-social-publish log"
          from={B5 + 10}
          every={22}
          opacity={logOpacity}
          win={{ x: 150, y: 120, w: 980, h: 420 }}
        />
      )}

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeaturePostsGoNativeVideoV23: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
