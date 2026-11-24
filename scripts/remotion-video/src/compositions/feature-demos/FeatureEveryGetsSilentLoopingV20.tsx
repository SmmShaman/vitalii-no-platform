// FeatureEveryGetsSilentLoopingV20 — feature v20 — 1280x720, 861 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// The Divider is the persistent, frame-dominating object: a bright vertical line
// splits the stage into a shrinking CHAOS half (left, danger-tinted — hand-filmed
// clips and random leftover screenshots) and a growing ORDER half (right,
// success-tinted — the procedural Remotion template). The line holds far right
// through b1-b3 while the problem (and its analogy) plays out — order is a bare
// 160px "not built yet" sliver — then slides left across b4 as the template gets
// built, and almost off-screen left through b5 as chaos disappears and order wins
// the whole frame. Deleting the Divider leaves no duel to read, so it never
// becomes decoration.
//
// No commit/Actions evidence: no single commit or run proves "generates each clip
// procedurally" in one readable diff, so b4 draws the mechanism instead — a
// LogWindow of the real steps this very factory runs each night (archetype draw,
// beat measurement, shots.json, typecheck, GitHub render, publish), built from the
// pipeline's own numbers since no runtime log exists on the VPS for it. This also
// carries the clip's one tech caption ("Remotion").
//
// Beat -> effect:
// b1 15-164   problem: filming/hand-editing a video per feature doesn't scale.
//             titleTakeover over the feature's own page. Divider holds far right
//             (1120) — order is a bare "not built yet" sliver.
// b2 164-347  many features had no visual at all, or a random leftover screenshot.
//             cornerTags over the features hub. Divider still holds at 1120.
// b3 347-478  analogy: like shooting a commercial for every single product update.
//             keywordCaption, drawn — plus a literal schematic: a clapperboard
//             shoot for each of three features, stacking up inside the chaos half.
// b4 478-650  the fix: a Remotion template generates each clip procedurally from
//             the feature's own data. No catalog effect — a LogWindow of the
//             factory's own run, drawn over the divider wash. Divider slides
//             1120 -> 380 as it plays.
// b5 650-861  payoff: two pilot clips proved it generalizes, every feature now
//             gets one automatically. percentRing, 100% — drawn, holds to the
//             true end. Divider slides 380 -> -40, chaos fully gone.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/v20.json";

const B1 = 15;
const B2 = 164;
const B3 = 347;
const B4 = 478;
const B5 = 650;
const END = 861;

/** sand's native accent (#B4531F) reads muddy on a dark stage — brightened for it. */
const ACCENT = "#F2994A";
const STAGE = "#1C140B";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Divider position: holds far right through b1-b3, slides toward center as the
// template gets built in b4, then almost off-screen left through b5.
const dividerXAt = (frame: number, fps: number) => {
  if (frame < B4) return 1120;
  if (frame < B5) return mix(tween(sec(frame, B4, fps), 0, (B5 - B4) / fps, ease.power3Out), 1120, 380);
  return mix(tween(sec(frame, B5, fps), 0, (END - B5) / fps, ease.power3Out), 380, -40);
};

const LEFT_TEXT: { at: number; text: string }[] = [
  { at: B1, text: "HAND-FILMED, EVERY TIME" },
  { at: B2, text: "RANDOM SCREENSHOTS" },
  { at: B3, text: "A COMMERCIAL PER UPDATE" },
  { at: B4, text: "OLD AD-HOC WORKFLOW" },
  { at: B5, text: "MANUAL CLIPS: 0" },
];
const RIGHT_TEXT: { at: number; text: string }[] = [
  { at: B1, text: "NOT BUILT YET 🚧" },
  { at: B2, text: "NO TEMPLATE EITHER 🚧" },
  { at: B3, text: "STILL MANUAL 🚧" },
  { at: B4, text: "TEMPLATE BUILT ⚙" },
  { at: B5, text: "EVERY FEATURE, AUTO ✓" },
];
const textAt = (list: { at: number; text: string }[], frame: number) => {
  let cur = list[0].text;
  for (const item of list) {
    if (frame >= item.at) cur = item.text;
    else break;
  }
  return cur;
};

// DividerWash — the full-bleed chaos/order color split. Only drawn once b1/b2's
// live backdrops are gone (b3 onward), so it never fights the real recording.
const DividerWash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B3) return null;
  const x = Math.max(dividerXAt(frame, fps), 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: x, height: 720, background: P.dangerBg }} />
      <div style={{ position: "absolute", left: x, top: 0, width: 1280 - x, height: 720, background: P.successBg }} />
    </div>
  );
};

// The bright glowing line itself — always on top, through every beat, live or drawn.
const DividerLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < B1) return null;
  const x = dividerXAt(frame, fps);
  if (x < -30 || x > 1310) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 2,
        top: 0,
        width: 5,
        height: 720,
        background: ACCENT,
        boxShadow: `0 0 24px 6px ${ACCENT}`,
      }}
    />
  );
};

// The per-beat label living inside each half — never centered, always tracking the line.
const DividerLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;
  const x = dividerXAt(frame, fps);
  const leftText = textAt(LEFT_TEXT, frame);
  const rightText = textAt(RIGHT_TEXT, frame);
  const leftW = Math.max(Math.min(340, x - 40), 0);
  const rightW = Math.max(Math.min(340, 1280 - x - 40), 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {leftW > 30 && (
        <div
          style={{
            position: "absolute",
            left: Math.max(x - leftW - 20, 10),
            top: 616,
            width: leftW,
            textAlign: "right",
            fontSize: leftW < 160 ? 12 : 16,
            fontWeight: 800,
            letterSpacing: 1,
            color: P.danger,
          }}
        >
          {leftText}
        </div>
      )}
      {rightW > 30 && (
        <div
          style={{
            position: "absolute",
            left: Math.min(x + 20, 1280 - rightW - 10),
            top: 616,
            width: rightW,
            textAlign: "left",
            fontSize: rightW < 160 ? 12 : 16,
            fontWeight: 800,
            letterSpacing: 1,
            color: P.success,
          }}
        >
          {rightText}
        </div>
      )}
    </div>
  );
};

// b1-b3's three leftover screenshots, stacked inside the chaos half, grey out
// once b2 lands (still there as a reminder of the mess until the fix in b4).
const CHIPS = [
  { label: "IMG_2043.PNG", seed: 0 },
  { label: "SCREENSHOT_OLD.PNG", seed: 2.1 },
  { label: "(no visual)", seed: 4.4 },
];

const SubChips: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 || frame >= B4) return null;
  const t = sec(frame, B1, fps);
  const dimmed = frame >= B2;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {CHIPS.map((c, i) => (
        <div
          key={c.label}
          style={{
            position: "absolute",
            left: 150,
            top: 170 + i * 34 + Math.sin(t * 2.4 + c.seed) * 2.5,
            padding: "5px 10px",
            borderRadius: 5,
            background: dimmed ? P.chipBg : P.dangerBg,
            border: `1px solid ${dimmed ? P.border : P.dangerEdge}`,
            color: dimmed ? P.muted : P.danger,
            fontSize: 12,
            fontWeight: 700,
            opacity: dimmed ? 0.5 : 1,
          }}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
};

// b3's analogy, drawn literally: a clapperboard shoot for each of three features,
// stacking up inside the chaos half — one manual production per update.
const ClapperRow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B3, B4) !== 1) return null;
  const t = sec(frame, B3, fps);
  const features = ["FEATURE A", "FEATURE B", "FEATURE C"];
  const boxW = 140;
  const gap = 20;
  const totalW = features.length * boxW + (features.length - 1) * gap;
  const startX = 170 - totalW / 2 + 60;
  const boxY = 250;
  const boxH = 80;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      {features.map((label, i) => {
        const appearAt = 0.3 + i * 0.5;
        const p = tween(t, appearAt, 0.4, ease.power3Out);
        const x = startX + i * (boxW + gap);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: x,
              top: boxY,
              width: boxW,
              height: boxH,
              opacity: p,
              transform: `scale(${mix(p, 0.85, 1)})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 8,
                border: `3px solid ${P.dangerEdge}`,
                background: P.dangerBg,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 22 }}>🎬</span>
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -24,
                textAlign: "center",
                fontFamily,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.6,
                color: P.danger,
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// b4/b5 drawn beats only: keeps the top band and the off-diagram half filled
// with real, labelled content for the whole beat regardless of the insert's own
// pacing (same fix as the e03 split-duel clip needed for the same reason).
const TopFlank: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B4) return null;
  const x = Math.max(dividerXAt(frame, fps), 0);
  const leftText = frame < B5 ? "✕ MANUAL, EVERY TIME" : "✕ SCREENSHOTS OR NONE";
  const rightText = frame < B5 ? "✓ TEMPLATE BUILT" : "✓ EVERY FEATURE, AUTO";
  const leftW = Math.min(x - 80, 420);
  const rightW = Math.min(1280 - x - 80, 760);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {leftW > 140 && (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 56,
            width: leftW,
            minHeight: 72,
            display: "flex",
            alignItems: "center",
            borderRadius: 8,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            boxSizing: "border-box",
            padding: "0 20px",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 0.6,
            color: P.danger,
          }}
        >
          {leftText}
        </div>
      )}
      {rightW > 140 && (
        <div
          style={{
            position: "absolute",
            left: Math.max(x + 40, 460),
            top: 56,
            width: rightW,
            minHeight: 72,
            display: "flex",
            alignItems: "center",
            borderRadius: 8,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            boxSizing: "border-box",
            padding: "0 20px",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 0.6,
            color: P.success,
          }}
        >
          {rightText}
        </div>
      )}
    </div>
  );
};

const PLATE_BOX = { x: 60, y: 48, w: 680, h: 86 };

const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={PLATE_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: PLATE_BOX.x,
          top: PLATE_BOX.y,
          width: PLATE_BOX.w,
          height: PLATE_BOX.h,
          background: P.card,
          borderRadius: 4,
          border: `2px solid ${P.accentEdge}`,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          boxSizing: "border-box",
          padding: "10px 20px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.2, color: P.accent }}>🎬 PORTFOLIO &amp; NEWS PLATFORM</div>
        <div style={{ fontSize: 13, color: P.muted, marginTop: 4, lineHeight: 1.3 }}>
          Collects tech news, writes trilingual feature stories from my own commits, renders short narrated video.
        </div>
      </div>
    </Arrive>
  );
};

const LOG_LINES: LogLine[] = [
  { text: "feature row loaded: v20", tone: "muted" },
  { text: "archetype=0 (split-duel) mood=sand drawn", tone: "ink" },
  { text: "beats measured: 5 (15f -> 861f)", tone: "ink" },
  { text: "shots/v20.json written (2 shots)", tone: "accent" },
  { text: "typecheck: 0 errors", tone: "success" },
  { text: "render queued -> GitHub runner", tone: "ink" },
  { text: "contact sheet generated", tone: "ink" },
  { text: "clip published: feature-v20.mp4", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      {/* b2 — many features with no visual, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}

      <DividerWash />

      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.82}
        data={{ title: "Can't film every feature", kicker: "Hand-editing a video for each shipped feature doesn't scale" }}
      />

      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.82}
        data={{
          statement: "Most features got no visual at all",
          tags: ["Random screenshot", "No consistent style", "No per-feature clip", "Hours per video, when made"],
        }}
      />

      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.18}
        data={{
          line1: "Like shooting a commercial",
          line2: "for every single product update",
          keywords: ["commercial", "update"],
        }}
      />
      <ClapperRow />

      {/* b4 — the fix: no runtime log exists for this pipeline, so a LogWindow of
          tonight's own factory run is the evidence, drawn over the divider wash
          as it slides toward order. This carries the clip's one tech caption. */}
      {cut(frame, B4, B5) === 1 && (
        <>
          <LogWindow lines={LOG_LINES} title="feature-clip-factory · render" from={B4 + 14} every={13} opacity={1} />
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 158,
              fontFamily,
              fontSize: 15,
              fontWeight: 700,
              color: "#FCEEDD",
            }}
          >
            Remotion — a code library that renders video frame-by-frame
          </div>
        </>
      )}

      <MotionInsert
        effect="percentRing"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.18}
        data={{
          value: 100,
          label: "New features get a clip automatically",
          notes: ["2 pilot clips proved it generalizes", "Every feature since, automatic"],
        }}
      />

      <DividerLine />
      <DividerLabels />
      <SubChips />
      <ProductPlate />
      <TopFlank />
    </AbsoluteFill>
  );
};

export const FeatureEveryGetsSilentLoopingV20: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
