// FeatureFirst20SecondsUsedP75 — feature p75 — 1280x720, 972 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood sand.
//
// The daily news video used to open with a generic stock photo and twenty
// seconds of dead air before a single real headline showed up. A new
// cold-open scene now cuts straight from a one-line greeting into the real
// photos of the day's top 3 stories, timed to the voiceover's own word
// timestamps.
//
// b1 15-279: the OLD route of the flow-map — ORIGIN node branches up into a
//   wide "GENERIC STOCK PHOTO · ~20s" block, then a still-dashed, unreached
//   "Headline #1" node. A token crawls the whole block's width to dramatize
//   the wait. Small secondary LiveWindow (bottom-right) plays the feature's
//   own real page, grounding the clip without competing with the diagram.
//   Product plate names the product, verbatim, up top.
// b2 288-460: same OLD route, now from the viewer's side — a waiting/clock
//   icon card and a danger pill ("no real headline yet"); the headline node
//   stays dashed/unlit. Exits sliding down (non-crossfade) into b3.
// b3 469-649: enters sliding up from below. The flow-map's second branch —
//   ORIGIN forks down into a short "ONE-LINE GREETING" node, which itself
//   branches into 3 photo-card nodes (today's top 3 stories). A split token
//   travels into all three at once. The real file name that makes this
//   happen — ColdOpenScene.tsx — is drawn as a small code-style tag beside
//   the greeting node (no commit diff: see note below).
// b4 658-810: close-up on the cut itself — a mini waveform/timestamp strip
//   with a marker landing exactly on one word, plus the SegmentDividerScene
//   mechanism (a 3.5s black block + a 1.5s story-count stamp) between two
//   segments. The ONE tech-credibility caption of this clip — FilterChip
//   "Remotion", plain gloss underneath — sits beside the waveform.
// b5 819-972: hand-inlined LogWindow (see note below) + the hero fact "18
//   seconds of dead air gone, every episode" + a check badge. Holds at full
//   opacity through frame 972, no fade-out, never shows the feature's own
//   page or the /features hub (gate 2).
//
// Persistent element: a faint horizontal axis + the ORIGIN node at its left
// end, present from b1 through b4 (fading out only once b5's single result
// takes over — the same convention p71's divider used).
// Non-crossfade transition: b2 -> b3, vertical slide via Group dy (Easing.
// in/out(Easing.cubic)).
// Single tech-credibility caption: FilterChip "Remotion" in b4, plain gloss
// underneath, nowhere else in the clip.
// Real data only: the three given commits (73dc668 "digest-motion skill",
// 6102737 "motion grammar v2", 587a946 "cross-day motion memory + effect
// caps") describe a DIFFERENT feature's story — motion-effect variety
// capping, not this cold-open fix — so none of them proves any sentence in
// this clip's beats and none is shown as a diff. Per the draw-the-mechanism
// rule, b3/b4 instead name the real files from this feature's own solution
// text: ColdOpenScene.tsx, SegmentDividerScene.tsx, DailyNewsShow.tsx and
// daily-compilation.js (fetched live from the features table, id
// fcc84c76-3be9-4bbc-abc5-89f741b8be88). The given day's "real log lines"
// are all unrelated clip-factory/wave-pipeline bookkeeping, so b5's
// LogWindow lines are built from this feature's own real facts instead
// (problem/solution/result text), per the no-noise rule.
// Emoji used (single codepoint only): 🛑 🕐 🎬 🎯 🖼 ✅

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette, cardShadow } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  IconCard,
  FlowArrow,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine } from "./live-primitives";
import shotsFile from "./shots/p75.json";

const FADE = 9;

const B1_S = 15;
const B1_E = 279;
const B2_S = 288;
const B2_E = 460;
const B3_S = 469;
const B3_E = 649;
const B4_S = 658;
const B4_E = 810;
const B5_S = 819;
const END = 972;

const AXIS_Y = 330;
const ORIGIN_X = 150;

const ProductPlate: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 38, width: 560, opacity, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: P.ink, letterSpacing: 0.2 }}>
        Portfolio &amp; News Platform
      </div>
      <div style={{ fontSize: 12.5, color: P.muted, lineHeight: 1.4, marginTop: 4, maxWidth: 520 }}>
        My personal site and content pipeline: it collects tech news, writes
        trilingual feature stories about my own projects&apos; commits, and
        renders short narrated video
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

/** Persistent flow-map spine: a faint axis + the ORIGIN node. Fades out once b5 takes over. */
const Axis: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: AXIS_Y,
          width: 1090,
          height: 2,
          background: P.border,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: ORIGIN_X - 26,
          top: AXIS_Y - 26,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: P.card,
          border: `3px solid ${P.accent}`,
          boxShadow: cardShadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          fontSize: 12,
          fontWeight: 800,
          color: P.accent,
        }}
      >
        OPEN
      </div>
    </div>
  );
};

const CodeTag: React.FC<{ x: number; y: number; text: string; opacity: number }> = ({ x, y, text, opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "6px 12px",
        borderRadius: 8,
        background: P.chipBg,
        border: `1px solid ${P.border}`,
        fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
        fontSize: 15,
        fontWeight: 700,
        color: P.ink,
        opacity,
      }}
    >
      {text}
    </div>
  );
};

const LogWindowP75: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  const frame = useCurrentFrame();
  if (opacity <= 0.004) return null;
  const lines: LogLine[] = [
    { t: "before", text: "generic stock photo · ~20s · no headline", tone: "danger" },
    { t: "fix", text: "ColdOpenScene.tsx: greeting -> top 3 photos", tone: "accent" },
    { t: "sync", text: "cut timed to voiceover word timestamps", tone: "accent" },
    { t: "divider", text: "SegmentDividerScene.tsx: 3.5s + story stamp", tone: "accent" },
    { t: "wired", text: "DailyNewsShow.tsx + daily-compilation.js", tone: "muted" },
    { t: "result", text: "18s of dead air removed, every episode", tone: "success" },
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity }}>
      <div style={{ position: "absolute", left: 100, top: 56, fontFamily, fontSize: 14, color: P.muted, letterSpacing: 1 }}>
        Portfolio &amp; News Platform · daily video cold-open
      </div>
      <StatPill x={960} y={46} emoji="✅" text="cold-open fixed" tone="success" opacity={1} />
      <LogWindow
        title="daily-compilation · cold-open"
        from={B5_S + 8}
        every={22}
        fontSize={21}
        win={{ x: 100, y: 130, w: 1080, h: 320 }}
        opacity={1}
        lines={lines}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 490,
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: seg(frame, B5_S + 130, B5_S + 130 + FADE),
        }}
      >
        <div style={{ fontFamily, fontSize: 72, fontWeight: 800, color: P.success }}>18</div>
        <div style={{ fontFamily, fontSize: 16, color: P.muted, lineHeight: 1.3, maxWidth: 230 }}>
          seconds of dead air gone
          <br />
          from every episode
        </div>
        <div style={{ fontFamily, fontSize: 24, fontWeight: 800, color: P.ink }}>stock photo ⇄ top 3 stories</div>
        <CheckBadge x={1120} y={-6} scale={0.9} opacity={1} size={60} />
      </div>
      <CaptionBand
        text="the video now reaches the real top 3 stories within seconds, not after a 20-second stock photo"
        tone="success"
        opacity={seg(frame, B5_S + 150, B5_S + 150 + FADE)}
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

  const axisOpacity = Math.min(1, b1 * 0.9 + b2 * 0.9 + b3 * 0.9 + b4 * 0.9);

  const b2ExitY = interpolate(frame, [B2_E, B2_E + FADE], [0, 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const b3EnterY = interpolate(frame, [B3_S, B3_S + FADE], [-36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // OLD-route token: crawls the stock-photo block through b1 into early b2,
  // dramatizing the ~20s wait. Independent of the per-beat Group opacity so
  // it can cross the b1/b2 boundary as one continuous motion.
  const tokenOpacity = seg(frame, B1_S + 25, B1_S + 25 + FADE) * (1 - seg(frame, B2_S + 40, B2_S + 40 + FADE));
  const tokenX = interpolate(frame, [B1_S + 25, B2_S + 40], [310, 660], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // b3 split: the token forks into 3, traveling from the greeting node to
  // each of the 3 story nodes.
  const splitT = seg(frame, B3_S + 90, B3_S + 150);
  const storyY = [390, 470, 550];

  return (
    <AbsoluteFillLocal>
      <LightBg />
      <Axis opacity={axisOpacity} />

      {/* Beat 1: OLD route — stock-photo block, unreached headline node, token crawls, real page small/secondary */}
      <Group opacity={b1}>
        <ProductPlate opacity={seg(frame, B1_S + 5, B1_S + 5 + FADE)} />
        <div
          style={{
            position: "absolute",
            left: 900,
            top: 44,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: seg(frame, B1_S + 10, B1_S + 10 + FADE),
          }}
        >
          old route
        </div>
        <BeatLabel x={60} y={610} kicker="every day" title="20 seconds of nothing before the news" opacity={1} />
        <FlowArrow x={176} y={224} len={120} color={P.danger} progress={seg(frame, B1_S + 15, B1_S + 35)} opacity={1} />
        <Panel x={300} y={170} w={380} h={110} tone="danger" opacity={seg(frame, B1_S + 30, B1_S + 30 + FADE)}>
          <div style={{ padding: 18 }}>
            <div style={{ fontFamily, fontSize: 19, fontWeight: 800, color: P.ink }}>Generic stock photo</div>
            <div style={{ fontFamily, fontSize: 13.5, color: P.muted, marginTop: 6 }}>
              ~20 seconds · unrelated voiceover · no real headline
            </div>
          </div>
        </Panel>
        <FlowArrow x={690} y={224} len={70} color={P.border} progress={seg(frame, B1_S + 50, B1_S + 70)} opacity={1} />
        <div
          style={{
            position: "absolute",
            left: 770,
            top: 170,
            width: 180,
            height: 110,
            borderRadius: 16,
            border: `2px dashed ${P.border}`,
            opacity: seg(frame, B1_S + 70, B1_S + 70 + FADE),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontSize: 15,
            fontWeight: 700,
            color: P.muted,
          }}
        >
          Headline #1 — not yet
        </div>
        <StatPill x={300} y={300} emoji="🛑" text="20s of dead air, every episode" tone="danger" opacity={seg(frame, B1_S + 90, B1_S + 90 + FADE)} />
        <IconCard x={90} y={390} w={300} emoji="🕐" title="viewer waits" sub="before anything I wrote today" tone="danger" opacity={seg(frame, B1_S + 110, B1_S + 110 + FADE)} />
        <LiveWindow
          file={shotsFile as any}
          shot="page"
          title="vitalii.no/features/the-first-20-seconds…"
          from={B1_S + 90}
          hold={130}
          zoom={() => 1.05}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={seg(frame, B1_S + 90, B1_S + 90 + FADE)}
          win={{ x: 810, y: 430, w: 340, h: 200 }}
        />
        <CaptionBand
          text="every day my video opened with a generic stock photo — twenty seconds of nothing before a single real headline showed up"
          opacity={seg(frame, B1_S + 130, B1_S + 130 + FADE)}
        />
      </Group>

      {/* Traveling OLD-route token, crosses the b1/b2 boundary as one motion */}
      <div
        style={{
          position: "absolute",
          left: tokenX,
          top: AXIS_Y - 106,
          width: 22,
          height: 22,
          borderRadius: 11,
          background: P.danger,
          boxShadow: cardShadow,
          opacity: tokenOpacity,
        }}
      />

      {/* Beat 2: viewer's side — waiting continues, headline still unlit, exits sliding down */}
      <Group opacity={b2} dy={b2ExitY}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 44,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 1,
            opacity: seg(frame, B2_S + 5, B2_S + 5 + FADE),
          }}
        >
          from the viewer&apos;s side, every single day
        </div>
        <BeatLabel x={60} y={610} kicker="still waiting" title="nothing I wrote shows up yet" opacity={1} />
        <Panel x={300} y={170} w={380} h={110} tone="danger" opacity={seg(frame, B2_S + 10, B2_S + 10 + FADE)}>
          <div style={{ padding: 18 }}>
            <div style={{ fontFamily, fontSize: 19, fontWeight: 800, color: P.ink }}>Generic stock photo</div>
            <div style={{ fontFamily, fontSize: 13.5, color: P.muted, marginTop: 6 }}>
              still playing — still nothing real on screen
            </div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 770,
            top: 170,
            width: 180,
            height: 110,
            borderRadius: 16,
            border: `2px dashed ${P.border}`,
            opacity: seg(frame, B2_S + 15, B2_S + 15 + FADE),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontSize: 15,
            fontWeight: 700,
            color: P.muted,
          }}
        >
          Headline #1 — not yet
        </div>
        <IconCard x={830} y={320} w={280} emoji="🕐" title="clock keeps running" sub="slow, content-free intro" tone="danger" opacity={seg(frame, B2_S + 50, B2_S + 50 + FADE)} />
        <StatPill x={300} y={310} emoji="🛑" text="no real headline yet" tone="danger" opacity={seg(frame, B2_S + 70, B2_S + 70 + FADE)} />
        <IconCard x={90} y={470} w={320} emoji="📺" title="viewers sat through it" sub="every single episode, before mine" tone="danger" opacity={seg(frame, B2_S + 95, B2_S + 95 + FADE)} />
        <CaptionBand
          text="viewers sat through a slow, content-free intro before seeing anything I'd actually written that day"
          opacity={seg(frame, B2_S + 115, B2_S + 115 + FADE)}
        />
      </Group>

      {/* Beat 3: NEW route — greeting node branches into 3 real story nodes, enters sliding up */}
      <Group opacity={b3} dy={b3EnterY}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 44,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: seg(frame, B3_S + 5, B3_S + 5 + FADE),
          }}
        >
          new route
        </div>
        <BeatLabel x={60} y={610} kicker="now" title="straight into today's real top 3" opacity={1} />
        <FlowArrow x={176} y={AXIS_Y + 60} len={110} color={P.success} progress={seg(frame, B3_S + 15, B3_S + 40)} opacity={1} />
        <Panel x={290} y={AXIS_Y + 30} w={260} h={80} tone="success" opacity={seg(frame, B3_S + 40, B3_S + 40 + FADE)}>
          <div style={{ padding: 14 }}>
            <div style={{ fontFamily, fontSize: 16, fontWeight: 800, color: P.ink }}>One-line greeting</div>
            <div style={{ fontFamily, fontSize: 12.5, color: P.muted, marginTop: 4 }}>spoken, then a hard cut</div>
          </div>
        </Panel>
        <CodeTag x={290} y={AXIS_Y + 118} text="ColdOpenScene.tsx" opacity={seg(frame, B3_S + 55, B3_S + 55 + FADE)} />
        {storyY.map((y, i) => {
          const branchOpacity = seg(frame, B3_S + 90 + i * 10, B3_S + 90 + i * 10 + FADE);
          return (
            <React.Fragment key={i}>
              <FlowArrow x={560} y={y + 15} len={110} color={P.success} progress={seg(frame, B3_S + 90 + i * 10, B3_S + 90 + i * 10 + 25)} opacity={1} />
              <div
                style={{
                  position: "absolute",
                  left: 690,
                  top: y,
                  width: 150,
                  height: 90,
                  borderRadius: 14,
                  background: P.successBg,
                  border: `2px solid ${P.successEdge}`,
                  boxShadow: cardShadow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  fontFamily,
                  opacity: branchOpacity,
                }}
              >
                <div style={{ fontSize: 26 }}>🖼</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: P.success, marginTop: 4 }}>Story {i + 1}</div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 660 + splitT * 60,
                  top: y + 35,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: P.success,
                  opacity: branchOpacity * (1 - seg(frame, B3_S + 150, B3_S + 150 + FADE)),
                }}
              />
            </React.Fragment>
          );
        })}
        <StatPill x={880} y={300} emoji="🎯" text="cuts straight to the real photos" tone="success" opacity={seg(frame, B3_S + 130, B3_S + 130 + FADE)} />
        <CaptionBand
          text="now it cuts straight from one spoken line into the real photos of today's top three stories"
          opacity={seg(frame, B3_S + 150, B3_S + 150 + FADE)}
        />
      </Group>

      {/* Beat 4: the cut itself — word-level timestamp sync + segment divider, the one tech caption */}
      <Group opacity={b4}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 44,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            letterSpacing: 1,
            opacity: seg(frame, B4_S + 5, B4_S + 5 + FADE),
          }}
        >
          timed to the word, not guessed
        </div>
        <BeatLabel x={60} y={610} kicker="exact cut" title="lands on the right word, every time" opacity={1} />
        <FilterChip x={90} y={120} text="Remotion" icon="🎬" color={P.accent} opacity={seg(frame, B4_S + 15, B4_S + 15 + FADE)} />
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 178,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            maxWidth: 260,
            lineHeight: 1.4,
            opacity: seg(frame, B4_S + 25, B4_S + 25 + FADE),
          }}
        >
          a toolkit that renders video frame-by-frame in code
        </div>
        <Panel x={390} y={150} w={700} h={150} tone="card" opacity={seg(frame, B4_S + 35, B4_S + 35 + FADE)}>
          <div style={{ position: "absolute", left: 24, top: 20, fontFamily, fontSize: 13, color: P.muted, fontWeight: 700 }}>
            voiceover word timestamps
          </div>
          <div style={{ position: "absolute", left: 24, top: 60, width: 652, height: 50, display: "flex", alignItems: "center", gap: 4 }}>
            {Array.from({ length: 22 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 10 + (i % 5) * 7,
                  background: i === 13 ? P.accent : P.chipBg,
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 24 + 13 * 26,
              top: 56,
              width: 3,
              height: 70,
              background: P.accent,
              opacity: seg(frame, B4_S + 55, B4_S + 55 + FADE),
            }}
          />
          <StatPill x={520} y={5} emoji="🎯" text="photo swap lands right here" tone="accent" opacity={seg(frame, B4_S + 60, B4_S + 60 + FADE)} />
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 390,
            top: 330,
            width: 700,
            height: 70,
            borderRadius: 12,
            background: P.ink,
            opacity: seg(frame, B4_S + 90, B4_S + 90 + FADE),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <CodeTag x={0} y={0} text="SegmentDividerScene.tsx" opacity={1} />
          <div style={{ fontFamily, fontSize: 14, color: "#fff", fontWeight: 700 }}>3.5s black · 1.5s story-count stamp</div>
        </div>
        <IconCard x={90} y={440} w={620} emoji="✅" title="wired into the real show" sub="DailyNewsShow.tsx + daily-compilation.js" tone="success" opacity={seg(frame, B4_S + 115, B4_S + 115 + FADE)} />
        <CaptionBand
          text="the cut lands exactly on the right word, timed with Remotion to match the voice"
          opacity={seg(frame, B4_S + 135, B4_S + 135 + FADE)}
        />
      </Group>

      {/* Beat 5: hand-inlined LogWindow, holds to END, no fade-out */}
      <LogWindowP75 opacity={b5} />
    </AbsoluteFillLocal>
  );
};

const AbsoluteFillLocal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, overflow: "hidden" }}>{children}</div>
);

export const FeatureFirst20SecondsUsedP75: React.FC = () => {
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
