// FeatureProjectsWindowFinallyFillsP71 — feature p71 — 1280x720, 922 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood sand.
//
// The Projects window used to pop open dead-center, disconnected from the
// tile you clicked. It now expands straight out of that exact tile, built
// with Radix UI, matching the pattern the rest of the site already used.
//
// b1 15-213: LEFT = LiveWindow playing the feature's own real page (grounds
//   the clip in the real site). RIGHT, crossing the divider = a drawn
//   "popped open, disconnected" box with a broken dashed connector and a
//   danger StatPill. Product plate names the product up top.
// b2 222-370: metaphor — one drawer opens on the left ("Project A"), a
//   totally different drawer slides out far on the right ("???"), joined by
//   a long dashed line "across the room". Exits sliding down (non-crossfade)
//   into b3.
// b3 379-546: enters sliding down from above. The ONE tech caption of this
//   clip — FilterChip "Radix UI" with a plain gloss — sits beside a tile
//   that visibly GROWS into the full window (interpolated rect), proving
//   "expands straight out of the exact tile you clicked".
// b4 555-730: a drawn cross-section of the open window: a fixed cover-image
//   block on the left that never moves, next to an endlessly scrolling
//   column of write-up/feature rows (SkeletonScroll) on the right.
// b5 739-922: hand-inlined LogWindow (no runtime log for this behavior, so
//   every line is built from the feature's own real facts: the tile-origin
//   mount, the fixed/scroll layout, the real commit f8efc7b) + the hero
//   fact "2 files, one shared pattern" + a "Projects <-> Services" parity
//   assertion. Holds at full opacity through frame 922, no fade-out, never
//   shows the feature's own page or the /features hub (gate 2).
//
// Persistent element: a vertical divider at x=638 with "BEFORE" (b1-b2) and
// "AFTER" (b3-b4) side labels — the split-duel archetype. It fades out as
// b5's single merged result takes over (no more two sides).
// Non-crossfade transition: b2 -> b3, vertical slide via Group dy (Easing.
// in/out(Easing.cubic)), the g17/g19/p72 convention.
// Single tech-credibility caption: FilterChip "Radix UI" in b3, plain gloss
// underneath, nowhere else in the clip.
// Real data only: the two verified GitHub commits (7a74954 "tonight's
// clips", 3775a74 "narration measured") describe the clip-factory's own
// process, not this feature, so neither is shown as a diff. The real commit
// that IS this feature — f8efc7b "feat(projects): projects window fills the
// bento grid like the expanded Services window" (components/sections/
// BentoGrid.tsx, components/ui/ProjectsModal.tsx) — has no verified
// recordable URL, so it is used only as text (in b5's LogWindow and hero
// fact), never as a live diff recording. The given day's log lines are all
// unrelated clip-factory bookkeeping (g15/p72/picks), so b5's lines are
// built from this feature's own real facts instead, per the no-noise rule.
// Emoji used (single codepoint only): 🛑 🔀 🧩 🖼 📜 ✅

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette, cardShadow } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  SkeletonScroll,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine } from "./live-primitives";
import shotsFile from "./shots/p71.json";

const FADE = 9;

const B1_S = 15;
const B1_E = 213;
const B2_S = 222;
const B2_E = 370;
const B3_S = 379;
const B3_E = 546;
const B4_S = 555;
const B4_E = 730;
const B5_S = 739;
const END = 922;

const DIVIDER_X = 638;

const ProductPlate: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 40, width: 480, opacity, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: P.ink, letterSpacing: 0.2 }}>
        Portfolio &amp; News Platform
      </div>
      <div style={{ fontSize: 12.5, color: P.muted, lineHeight: 1.4, marginTop: 4, maxWidth: 440 }}>
        my personal site + content pipeline — tech news, trilingual project
        stories, short narrated video
      </div>
    </div>
  );
};

const BeatLabel: React.FC<{
  x: number;
  y: number;
  kicker: string;
  title: string;
  opacity: number;
}> = ({ x, y, kicker, title, opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity }}>
      <div
        style={{
          fontFamily,
          fontSize: 14,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: P.accent,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {kicker}
      </div>
      <div style={{ fontFamily, fontSize: 30, fontWeight: 800, color: P.ink }}>{title}</div>
    </div>
  );
};

const Divider: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: DIVIDER_X,
        top: 96,
        width: 2,
        height: 520,
        background: P.border,
        opacity,
      }}
    />
  );
};

const SideLabel: React.FC<{ x: number; y: number; text: string; opacity: number }> = ({ x, y, text, opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily,
        fontSize: 14,
        letterSpacing: 3,
        fontWeight: 800,
        color: P.muted,
        opacity,
      }}
    >
      {text}
    </div>
  );
};

const LogWindowP71: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  const frame = useCurrentFrame();
  if (opacity <= 0.004) return null;
  const lines: LogLine[] = [
    { t: "click", text: "tile rect -> ProjectsModal(origin)", tone: "muted" },
    { t: "mount", text: "Radix UI dialog opens at that origin", tone: "accent" },
    { t: "layout", text: "cover image: fixed; body: scroll container", tone: "accent" },
    { t: "commit", text: "f8efc7b: BentoGrid.tsx + ProjectsModal.tsx", tone: "success" },
    { t: "parity", text: "same pattern as the Services window", tone: "success" },
    { t: "result", text: "Projects window: fixed", tone: "success" },
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity }}>
      <div style={{ position: "absolute", left: 100, top: 60, fontFamily, fontSize: 14, color: P.muted, letterSpacing: 1 }}>
        Portfolio &amp; News Platform · Projects window
      </div>
      <StatPill x={980} y={50} emoji="✅" text="origin-anchored" tone="success" opacity={1} />
      <LogWindow
        title="bento-grid · projects modal"
        from={B5_S + 8}
        every={24}
        fontSize={21}
        win={{ x: 100, y: 140, w: 1080, h: 340 }}
        opacity={1}
        lines={lines}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 522,
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: seg(frame, B5_S + 140, B5_S + 140 + FADE),
        }}
      >
        <div style={{ fontFamily, fontSize: 72, fontWeight: 800, color: P.success }}>2</div>
        <div style={{ fontFamily, fontSize: 16, color: P.muted, lineHeight: 1.3, maxWidth: 220 }}>
          files, one shared pattern
          <br />
          (BentoGrid + ProjectsModal)
        </div>
        <div style={{ fontFamily, fontSize: 26, fontWeight: 800, color: P.ink }}>Projects ⇄ Services</div>
        <CheckBadge x={1130} y={0} scale={0.9} opacity={1} size={60} />
      </div>
      <CaptionBand
        text="The Projects window finally behaves the way the rest of the site always has."
        tone="success"
        opacity={seg(frame, B5_S + 160, B5_S + 160 + FADE)}
      />
    </div>
  );
};

const FrameInner: React.FC<{
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
}> = ({ b1, b2, b3, b4, b5 }) => {
  const frame = useCurrentFrame();
  const P = usePalette();

  const dividerOpacity = Math.min(1, b1 * 0.6 + b2 * 0.9 + b3 * 0.9 + b4 * 0.9);
  const beforeOpacity = Math.min(1, b1 + b2 * 0.8);
  const afterOpacity = Math.min(1, b3 + b4 * 0.8);

  const b2ExitY = interpolate(frame, [B2_E, B2_E + FADE], [0, -34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const b3EnterY = interpolate(frame, [B3_S, B3_S + FADE], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const growT = seg(frame, B3_S + 50, B3_S + 95);
  const tileRect = { x: 860, y: 260, w: 150, h: 110 };
  const modalRect = { x: 650, y: 140, w: 480, h: 380 };
  const gx = tileRect.x + (modalRect.x - tileRect.x) * growT;
  const gy = tileRect.y + (modalRect.y - tileRect.y) * growT;
  const gw = tileRect.w + (modalRect.w - tileRect.w) * growT;
  const gh = tileRect.h + (modalRect.h - tileRect.h) * growT;

  return (
    <AbsoluteFillLocal>
      <LightBg />
      <Divider opacity={dividerOpacity} />
      <SideLabel x={150} y={66} text="BEFORE" opacity={beforeOpacity} />
      <SideLabel x={970} y={66} text="AFTER" opacity={afterOpacity} />

      {/* Beat 1: real page (left) + drawn disconnected box (right) */}
      <Group opacity={b1}>
        <ProductPlate opacity={seg(frame, B1_S + 5, B1_S + 5 + FADE)} />
        <BeatLabel x={60} y={620} kicker="click a project tile" title="a box pops open, disconnected" opacity={1} />
        <LiveWindow
          file={shotsFile as any}
          shot="page"
          title="vitalii.no/features/the-projects-window…"
          from={B1_S + 15}
          hold={B1_E - (B1_S + 15) - 15}
          zoom={() => 1.05}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={1}
          win={{ x: 100, y: 150, w: 460, h: 380 }}
        />
        <Panel x={660} y={260} w={460} h={260} tone="danger" opacity={seg(frame, B1_S + 40, B1_S + 40 + FADE)}>
          <div style={{ padding: 24 }}>
            <div style={{ fontFamily, fontSize: 20, fontWeight: 800, color: P.ink }}>Project title…</div>
            <div style={{ fontFamily, fontSize: 14, color: P.muted, marginTop: 10, lineHeight: 1.5 }}>
              centered on screen — not anchored to anything
            </div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 330,
            width: 110,
            height: 0,
            borderTop: `3px dashed ${P.danger}`,
            opacity: seg(frame, B1_S + 60, B1_S + 60 + FADE),
          }}
        />
        <StatPill
          x={660}
          y={175}
          emoji="🛑"
          text="disconnected from the tile"
          tone="danger"
          opacity={seg(frame, B1_S + 70, B1_S + 70 + FADE)}
        />
        <CaptionBand
          text="clicking a project tile popped open a box centered on screen, disconnected from the tile you'd just clicked"
          opacity={seg(frame, B1_S + 100, B1_S + 100 + FADE)}
        />
      </Group>

      {/* Beat 2: drawer metaphor, exits sliding down */}
      <Group opacity={b2} dy={b2ExitY}>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 40,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 1,
            opacity: seg(frame, B2_S + 5, B2_S + 5 + FADE),
          }}
        >
          the old behavior, from the visitor&apos;s side
        </div>
        <BeatLabel x={60} y={620} kicker="like two different drawers" title="open one, a different one slides out" opacity={1} />
        <div style={{ position: "absolute", left: 140, top: 220, width: 360, height: 240, opacity: seg(frame, B2_S + 20, B2_S + 20 + FADE) }}>
          <div
            style={{
              background: P.card,
              border: `2px solid ${P.border}`,
              borderRadius: 14,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              boxShadow: cardShadow,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Drawer: Project A</div>
            <div style={{ fontSize: 14, color: P.muted, marginTop: 8 }}>the one you opened</div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 500,
            top: 335,
            width: 300,
            height: 0,
            borderTop: `3px dashed ${P.danger}`,
            opacity: seg(frame, B2_S + 45, B2_S + 45 + FADE),
          }}
        />
        <div style={{ position: "absolute", left: 800, top: 220, width: 340, height: 240, opacity: seg(frame, B2_S + 70, B2_S + 70 + FADE) }}>
          <div
            style={{
              background: P.dangerBg,
              border: `2px solid ${P.dangerEdge}`,
              borderRadius: 14,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              boxShadow: cardShadow,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: P.danger }}>Drawer: ???</div>
            <div style={{ fontSize: 14, color: P.danger, marginTop: 8 }}>somewhere else entirely</div>
          </div>
        </div>
        <StatPill
          x={470}
          y={480}
          emoji="🔀"
          text="wrong drawer, every time"
          tone="danger"
          opacity={seg(frame, B2_S + 95, B2_S + 95 + FADE)}
        />
        <CaptionBand
          text="it's like opening one drawer and having a totally different one slide out across the room"
          opacity={seg(frame, B2_S + 110, B2_S + 110 + FADE)}
        />
      </Group>

      {/* Beat 3: Radix UI — tile grows into the window, enters sliding down from above */}
      <Group opacity={b3} dy={b3EnterY}>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 40,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 1,
            opacity: seg(frame, B3_S + 5, B3_S + 5 + FADE),
          }}
        >
          built with Radix UI — anchored to the tile
        </div>
        <BeatLabel x={60} y={620} kicker="now, anchored" title="the window grows out of the tile itself" opacity={1} />
        <FilterChip x={150} y={120} text="Radix UI" icon="🧩" color={P.accent} opacity={seg(frame, B3_S + 15, B3_S + 15 + FADE)} />
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 180,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            maxWidth: 260,
            lineHeight: 1.4,
            opacity: seg(frame, B3_S + 25, B3_S + 25 + FADE),
          }}
        >
          a toolkit for accessible pop-up UI
        </div>
        <div
          style={{
            position: "absolute",
            left: tileRect.x,
            top: tileRect.y,
            width: tileRect.w,
            height: tileRect.h,
            borderRadius: 12,
            border: `2px solid ${P.accent}`,
            background: P.accentBg,
            opacity: seg(frame, B3_S + 35, B3_S + 35 + FADE) * (1 - growT * 0.7),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: gx,
            top: gy,
            width: gw,
            height: gh,
            borderRadius: 16,
            background: P.card,
            border: `2px solid ${P.accent}`,
            boxShadow: cardShadow,
            opacity: seg(frame, B3_S + 35, B3_S + 35 + FADE),
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 24, opacity: seg(frame, B3_S + 100, B3_S + 100 + FADE) }}>
            <div style={{ fontFamily, fontSize: 20, fontWeight: 800, color: P.ink }}>Project title</div>
            <div style={{ fontFamily, fontSize: 14, color: P.muted, marginTop: 8 }}>
              opens from right here, every time
            </div>
          </div>
        </div>
        <CaptionBand
          text="now, built with Radix UI, the window expands straight out of the exact tile you clicked"
          opacity={seg(frame, B3_S + 145, B3_S + 145 + FADE)}
        />
      </Group>

      {/* Beat 4: fixed cover + endlessly scrolling write-up/features */}
      <Group opacity={b4}>
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 40,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 1,
            opacity: seg(frame, B4_S + 5, B4_S + 5 + FADE),
          }}
        >
          inside the open window
        </div>
        <BeatLabel x={60} y={620} kicker="inside the window" title="the cover stays still — everything else scrolls" opacity={1} />
        <Panel x={390} y={140} w={500} h={400} tone="card" opacity={seg(frame, B4_S + 15, B4_S + 15 + FADE)}>
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 24,
              width: 150,
              height: 150,
              borderRadius: 14,
              background: P.accentBg,
              border: `2px solid ${P.accentEdge}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            🖼
          </div>
          <div style={{ position: "absolute", left: 24, top: 184, fontFamily, fontSize: 13, color: P.muted, fontWeight: 700, maxWidth: 150 }}>
            cover image — fixed
          </div>
          <div style={{ position: "absolute", left: 198, top: 24, width: 278, height: 352, overflow: "hidden", borderLeft: `1px solid ${P.border}` }}>
            <SkeletonScroll w={278} h={352} offset={Math.max(0, frame - B4_S) * 2} rowH={38} />
          </div>
        </Panel>
        <StatPill
          x={150}
          y={420}
          emoji="📜"
          text="write-up + features scroll on their own"
          tone="accent"
          opacity={seg(frame, B4_S + 45, B4_S + 45 + FADE)}
        />
        <CaptionBand
          text="inside, the cover image stays fixed while the write-up and features scroll past it on their own"
          opacity={seg(frame, B4_S + 70, B4_S + 70 + FADE)}
        />
      </Group>

      {/* Beat 5: hand-inlined LogWindow, holds to END, no fade-out */}
      <LogWindowP71 opacity={b5} />
    </AbsoluteFillLocal>
  );
};

const AbsoluteFillLocal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, overflow: "hidden" }}>{children}</div>
);

export const FeatureProjectsWindowFinallyFillsP71: React.FC = () => {
  const frame = useCurrentFrame();

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE);

  return (
    <PaletteProvider value={MOODS.sand}>
      <FrameInner b1={b1} b2={b2} b3={b3} b4={b4} b5={b5} />
    </PaletteProvider>
  );
};
