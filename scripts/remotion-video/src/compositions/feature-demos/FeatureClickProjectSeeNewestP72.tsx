// FeatureClickProjectSeeNewestP72 — feature p72 — 1280x720, 1022 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood slate.
//
// Click a project, see its 6 newest features. Every project card used to carry
// a few hardcoded sentences written once at launch; nothing about the work
// since. A Supabase-backed endpoint now reads each project's real tech stack
// and newest commits automatically, on every visit.
//
// b1 15-214: product plate ("Portfolio & News Platform") + a drawn static
//   project card (Atlas Tracker — "launched in 2024", "more details coming
//   soon") with a danger StatPill ("same 3 sentences, forever"). The ribbon
//   marker sits far left, danger-toned, label "static · 0 updates".
// b2 223-368: the metaphor — a shop window with four dusty, unlit items
//   (inventory / services / support / stack), a glass glare sweeping across.
//   Exits sliding down (non-crossfade) into b3.
// b3 377-565: enters sliding down from above. The real mechanism: a
//   Supabase FilterChip (the one tech-credibility caption of this clip, with
//   a plain gloss) feeds `/api/projects/[slug]`, which feeds up to 8 tech-tag
//   chips (React, Next.js, TypeScript, Supabase, Tailwind CSS, Cloudflare R2,
//   GitHub Actions, Remotion) and a "newest feature" row carrying the real
//   commit f8efc7b ("projects window fills the bento grid like Services").
//   Ribbon marker turns accent, label "reading live data".
// b4 574-754: the ONE real-UI beat — LiveWindow plays the feature's own
//   verified page (shots/p72.json, shot "page") inside a browser window,
//   with small "desktop" / "mobile" StatPills either side. Marker label
//   "auto-refreshing".
// b5 763-1022: hand-inlined LogWindow (no runtime log exists for this
//   product; every line is built from the feature's own numbers) — the
//   query, the 8-tag cap, the 6-feature cap, the real commit again, the
//   10-minute revalidate — then the hero result 13 projects, always current.
//   Holds at full opacity through frame 1022, no fade-out, never shows the
//   feature's own page or the /features hub (gate 2).
//
// Persistent element: the horizontal timeline ribbon spanning RIBBON_LEFT..
// RIBBON_RIGHT with a single traveling marker whose tone/label evolve b1-b4,
// then fades out as b5's full-screen log result takes over.
// Non-crossfade transition: b2 -> b3, vertical slide via Group dy (Easing.
// in/out(Easing.cubic)), following the g17/g19 convention.
// Single tech-credibility caption: FilterChip "Supabase" in b3, plain gloss
// underneath, nowhere else in the clip.
// Real data only: the two verified GitHub commits were checked against every
// beat sentence — neither 7a74954 ("tonight's clips") nor 3775a74 ("narration
// measured") describes this feature, so no diff is shown; f8efc7b ("feat
// (projects): projects window fills the bento grid like the expanded
// Services window") DOES match b3/b5's "newest work" and is used as the one
// real example commit. Numbers: 8 tech tags, 6 newest features, 10-minute
// revalidate, 13 projects — all from the feature's own stated numbers.
// Emoji used (single codepoint only): 🛑 📦 🪟 🧺 🎧 💻 🗄 🆕 🖥 📱 ✅ 🏷

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  BrowserWindow,
  StatPill,
  FilterChip,
  FlowArrow,
  IconCard,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine } from "./live-primitives";
import shotsFile from "./shots/p72.json";

const FADE = 9;

const B1_S = 15;
const B1_E = 214;
const B2_S = 223;
const B2_E = 368;
const B3_S = 377;
const B3_E = 565;
const B4_S = 574;
const B4_E = 754;
const B5_S = 763;
const END = 1022;

const RIBBON_Y = 118;
const RIBBON_LEFT = 90;
const RIBBON_RIGHT = 1190;

const MARKER_PTS: Array<[number, number]> = [
  [B1_S, 0.04],
  [B2_E, 0.07],
  [B3_S + 40, 0.1],
  [B3_E, 0.52],
  [B4_E, 0.82],
  [END, 0.97],
];

const markerFrac = (frame: number): number => {
  if (frame <= MARKER_PTS[0][0]) return MARKER_PTS[0][1];
  for (let i = 1; i < MARKER_PTS.length; i++) {
    const [x1, y1] = MARKER_PTS[i];
    if (frame <= x1) {
      const [x0, y0] = MARKER_PTS[i - 1];
      const t = (frame - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return MARKER_PTS[MARKER_PTS.length - 1][1];
};

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

const Ribbon: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: RIBBON_LEFT,
        top: RIBBON_Y,
        width: RIBBON_RIGHT - RIBBON_LEFT,
        height: 2,
        background: P.border,
        opacity,
      }}
    />
  );
};

const STAGE_TICKS = [
  { frac: 0.06, label: "static" },
  { frac: 0.5, label: "endpoint" },
  { frac: 0.94, label: "live" },
];

const StageTicks: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <>
      {STAGE_TICKS.map((s, i) => {
        const x = RIBBON_LEFT + s.frac * (RIBBON_RIGHT - RIBBON_LEFT);
        return (
          <div key={i} style={{ position: "absolute", left: x - 30, top: RIBBON_Y + 10, opacity, textAlign: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: P.accent, margin: "0 auto 6px" }} />
            <div style={{ fontFamily, fontSize: 12, color: P.muted, letterSpacing: 1 }}>{s.label}</div>
          </div>
        );
      })}
    </>
  );
};

const ProjectMarker: React.FC<{
  x: number;
  opacity: number;
  tone: "danger" | "accent" | "success";
  label: string;
}> = ({ x, opacity, tone, label }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : tone === "success" ? P.success : P.accent;
  const bg = tone === "danger" ? P.dangerBg : tone === "success" ? P.successBg : P.accentBg;
  return (
    <div style={{ position: "absolute", left: x - 80, top: RIBBON_Y - 54, opacity, textAlign: "center", width: 160 }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: color,
          margin: "0 auto 8px",
          boxShadow: `0 0 0 5px ${bg}`,
        }}
      />
      <div
        style={{
          fontFamily,
          fontSize: 15,
          fontWeight: 700,
          color,
          background: bg,
          padding: "4px 10px",
          borderRadius: 8,
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const QueueRow: React.FC<{
  x: number;
  y: number;
  w: number;
  emoji: string;
  text: string;
  tag: string;
  tone: "danger" | "accent" | "success";
  opacity: number;
}> = ({ x, y, w, emoji, text, tag, tone, opacity }) => {
  const P = usePalette();
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : tone === "success" ? P.success : P.accent;
  const bg = tone === "danger" ? P.dangerBg : tone === "success" ? P.successBg : P.accentBg;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: P.card,
        border: `1px solid ${P.border}`,
        borderRadius: 12,
        padding: "10px 16px",
        fontFamily,
      }}
    >
      <div style={{ fontSize: 16, color: P.ink, fontWeight: 600 }}>
        {emoji} {text}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color, background: bg, padding: "3px 9px", borderRadius: 7 }}>
        {tag}
      </div>
    </div>
  );
};

const TECH_TAGS = ["React", "Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Cloudflare R2", "GitHub Actions", "Remotion"];

const LogWindowP72: React.FC<{ opacity: number }> = ({ opacity }) => {
  const P = usePalette();
  const frame = useCurrentFrame();
  if (opacity <= 0.004) return null;
  const lines: LogLine[] = [
    { t: "query", text: "GET /api/projects/[slug] -> Supabase", tone: "muted" },
    { t: "tags", text: "tech_stack capped at 8 tags", tone: "accent" },
    { t: "latest", text: "6 newest features per project", tone: "accent" },
    { t: "commit", text: 'f8efc7b "projects window fills the bento grid"', tone: "success" },
    { t: "cache", text: "revalidate every 10 minutes", tone: "muted" },
    { t: "result", text: "13 projects, always current", tone: "success" },
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity }}>
      <div style={{ position: "absolute", left: 100, top: 60, fontFamily, fontSize: 14, color: P.muted, letterSpacing: 1 }}>
        Portfolio &amp; News Platform · project endpoint
      </div>
      <StatPill x={960} y={50} emoji="🔁" text="every 10 min" tone="accent" opacity={1} />
      <LogWindow
        title="projects-live · endpoint"
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
        <div style={{ fontFamily, fontSize: 72, fontWeight: 800, color: P.success }}>13</div>
        <div style={{ fontFamily, fontSize: 16, color: P.muted, lineHeight: 1.3 }}>
          projects
          <br />
          always current
        </div>
        <div style={{ fontFamily, fontSize: 40, fontWeight: 800, color: P.accent }}>8</div>
        <div style={{ fontFamily, fontSize: 14, color: P.muted, lineHeight: 1.3 }}>
          tech tags
          <br />
          max
        </div>
        <div style={{ fontFamily, fontSize: 40, fontWeight: 800, color: P.accent }}>6</div>
        <div style={{ fontFamily, fontSize: 14, color: P.muted, lineHeight: 1.3 }}>
          newest
          <br />
          features
        </div>
        <CheckBadge x={1130} y={0} scale={0.9} opacity={1} size={60} />
      </div>
      <CaptionBand
        text="13 projects. Always current. Zero manual edits."
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

  const ribbonOpacity = Math.min(1, b1 * 0.5 + b2 * 0.9 + b3 * 0.9 + b4 * 0.9);
  const ticksOpacity = Math.min(1, b2 * 0.8 + b3 + b4 * 0.7);

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

  const markerX = RIBBON_LEFT + markerFrac(frame) * (RIBBON_RIGHT - RIBBON_LEFT);
  const markerTone: "danger" | "accent" | "success" = frame < B3_S ? "danger" : frame < B4_E ? "accent" : "success";
  const markerLabel =
    frame < B2_E ? "static · 0 updates" : frame < B3_E ? "reading live data" : frame < B4_E ? "auto-refreshing" : "always current";

  const tagChipAt = (i: number) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    return { x: 140 + col * 250, y: 310 + row * 56 };
  };

  return (
    <AbsoluteFillLocal>
      <LightBg />
      <Ribbon opacity={ribbonOpacity} />
      <StageTicks opacity={ticksOpacity} />
      <ProjectMarker x={markerX} opacity={ribbonOpacity} tone={markerTone} label={markerLabel} />

      {/* Beat 1: the stale project card */}
      <Group opacity={b1}>
        <ProductPlate opacity={seg(frame, B1_S + 5, B1_S + 5 + FADE)} />
        <BeatLabel x={60} y={600} kicker="every project page" title="three sentences, never touched" opacity={1} />
        <BrowserWindow
          x={150}
          y={160}
          w={620}
          h={390}
          title="vitalii.no/projects/atlas-tracker"
          opacity={seg(frame, B1_S + 15, B1_S + 15 + FADE)}
        >
          <div style={{ padding: 28 }}>
            <div style={{ fontFamily, fontSize: 22, fontWeight: 800, color: P.ink }}>Atlas Tracker</div>
            <div style={{ fontFamily, fontSize: 15, color: P.muted, marginTop: 14, lineHeight: 1.6 }}>
              &quot;Built with Node.js and Postgres.&quot;
              <br />
              &quot;Launched in 2024.&quot;
              <br />
              &quot;More details coming soon.&quot;
            </div>
            <div
              style={{
                fontFamily,
                marginTop: 26,
                display: "inline-block",
                padding: "5px 12px",
                borderRadius: 8,
                background: P.dangerBg,
                color: P.danger,
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              unchanged since launch day
            </div>
          </div>
        </BrowserWindow>
        <StatPill
          x={830}
          y={180}
          emoji="🛑"
          text="same 3 sentences, forever"
          tone="danger"
          opacity={seg(frame, B1_S + 45, B1_S + 45 + FADE)}
        />
        <StatPill
          x={830}
          y={240}
          emoji="📦"
          text="hardcoded once, at launch"
          tone="danger"
          opacity={seg(frame, B1_S + 75, B1_S + 75 + FADE)}
        />
        <CaptionBand
          text="click into a project, see what I wrote once — nothing about the work since"
          opacity={seg(frame, B1_S + 110, B1_S + 110 + FADE)}
        />
      </Group>

      {/* Beat 2: shop-window metaphor, exits sliding down */}
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
          the page, from the visitor&apos;s side
        </div>
        <BeatLabel x={60} y={600} kicker="like a shop window" title="never restocked, no matter what's inside" opacity={1} />
        <Panel x={150} y={140} w={980} h={330} tone="card" opacity={seg(frame, B2_S + 10, B2_S + 10 + FADE)}>
          <div
            style={{
              position: "absolute",
              left: -40,
              top: -40,
              width: 200,
              height: 420,
              background: "rgba(255,255,255,0.35)",
              transform: "rotate(18deg)",
            }}
          />
          <IconCard x={60} y={60} w={200} emoji="📦" title="inventory list" sub="unchanged" tone="danger" opacity={seg(frame, B2_S + 30, B2_S + 30 + FADE)} scale={0.9} />
          <IconCard x={290} y={60} w={200} emoji="💻" title="tech stack" sub="unchanged" tone="danger" opacity={seg(frame, B2_S + 55, B2_S + 55 + FADE)} scale={0.9} />
          <IconCard x={520} y={60} w={200} emoji="🧺" title="services list" sub="unchanged" tone="danger" opacity={seg(frame, B2_S + 80, B2_S + 80 + FADE)} scale={0.9} />
          <IconCard x={750} y={60} w={200} emoji="🎧" title="support info" sub="unchanged" tone="danger" opacity={seg(frame, B2_S + 105, B2_S + 105 + FADE)} scale={0.9} />
        </Panel>
        <StatPill x={520} y={490} emoji="🪟" text="same display, every single visit" tone="danger" opacity={seg(frame, B2_S + 120, B2_S + 120 + FADE)} />
        <CaptionBand
          text="it's like a shop window that's never restocked — no matter how much changes inside"
          opacity={seg(frame, B2_S + 130, B2_S + 130 + FADE)}
        />
      </Group>

      {/* Beat 3: Supabase endpoint mechanism, enters sliding down from above */}
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
          a Supabase-backed endpoint — reads automatically
        </div>
        <BeatLabel x={60} y={600} kicker="now, automatic" title="the endpoint reads it for you" opacity={1} />
        <FilterChip x={150} y={130} text="Supabase" icon="🗄" color={P.accent} opacity={seg(frame, B3_S + 12, B3_S + 12 + FADE)} />
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 190,
            fontFamily,
            fontSize: 14,
            color: P.muted,
            maxWidth: 260,
            lineHeight: 1.4,
            opacity: seg(frame, B3_S + 18, B3_S + 18 + FADE),
          }}
        >
          a hosted database + instant API
        </div>
        <FlowArrow x={340} y={140} len={120} progress={seg(frame, B3_S + 24, B3_S + 24 + FADE)} />
        <div
          style={{
            position: "absolute",
            left: 480,
            top: 120,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 15,
            fontWeight: 700,
            color: P.ink,
            background: P.chipBg,
            border: `1.5px solid ${P.border}`,
            borderRadius: 10,
            padding: "8px 14px",
            opacity: seg(frame, B3_S + 30, B3_S + 30 + FADE),
          }}
        >
          /api/projects/[slug]
        </div>
        <FlowArrow x={720} y={140} len={120} progress={seg(frame, B3_S + 36, B3_S + 36 + FADE)} />
        <Panel x={860} y={100} w={280} h={170} tone="accent" opacity={seg(frame, B3_S + 42, B3_S + 42 + FADE)}>
          <div style={{ position: "absolute", left: 18, top: 14, fontFamily, fontSize: 13, color: P.muted, letterSpacing: 1 }}>
            TECH TAGS
          </div>
          <div style={{ position: "absolute", left: 18, top: 40, display: "flex", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontFamily, fontSize: 40, fontWeight: 800, color: P.accent }}>8</div>
            <div style={{ fontFamily, fontSize: 13, color: P.muted, maxWidth: 160, lineHeight: 1.3 }}>max per project, real stack</div>
          </div>
        </Panel>
        {TECH_TAGS.map((tag, i) => {
          const pos = tagChipAt(i);
          return (
            <div
              key={tag}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                fontFamily,
                fontSize: 14,
                fontWeight: 700,
                color: P.accent,
                background: P.accentBg,
                border: `1px solid ${P.accentEdge}`,
                borderRadius: 999,
                padding: "6px 14px",
                opacity: seg(frame, B3_S + 48 + Math.floor(i / 4) * 8, B3_S + 48 + Math.floor(i / 4) * 8 + FADE),
              }}
            >
              🏷 {tag}
            </div>
          );
        })}
        <QueueRow
          x={150}
          y={480}
          w={980}
          emoji="🆕"
          text='"projects window fills the bento grid like Services"'
          tag="f8efc7b"
          tone="success"
          opacity={seg(frame, B3_S + 64, B3_S + 64 + FADE)}
        />
        <CaptionBand
          text="a Supabase-backed endpoint reads each project's real tech stack and newest work — automatically"
          opacity={seg(frame, B3_S + 74, B3_S + 74 + FADE)}
        />
      </Group>

      {/* Beat 4: the real page, live */}
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
          the real page — every visit
        </div>
        <BeatLabel x={60} y={620} kicker="every visit" title="refreshes itself — no edits from me" opacity={1} />
        <LiveWindow
          file={shotsFile as any}
          shot="page"
          title="vitalii.no/features/click-a-project-see…"
          from={B4_S + 20}
          hold={B4_E - (B4_S + 20) - 10}
          zoom={() => 1.05}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={1}
          win={{ x: 150, y: 140, w: 980, h: 420 }}
        />
        <StatPill x={980} y={60} emoji="🖥" text="desktop" tone="accent" opacity={seg(frame, B4_S + 30, B4_S + 30 + FADE)} />
        <StatPill x={980} y={110} emoji="📱" text="mobile" tone="accent" opacity={seg(frame, B4_S + 55, B4_S + 55 + FADE)} />
        <CaptionBand
          text="every project page refreshes itself, on desktop and mobile — without me touching a thing"
          opacity={seg(frame, B4_S + 80, B4_S + 80 + FADE)}
        />
      </Group>

      {/* Beat 5: hand-inlined LogWindow, holds to END, no fade-out */}
      <LogWindowP72 opacity={b5} />
    </AbsoluteFillLocal>
  );
};

const AbsoluteFillLocal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, overflow: "hidden" }}>{children}</div>
);

export const FeatureClickProjectSeeNewestP72: React.FC = () => {
  const frame = useCurrentFrame();

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE);

  return (
    <PaletteProvider value={MOODS.slate}>
      <FrameInner b1={b1} b2={b2} b3={b3} b4={b4} b5={b5} />
    </PaletteProvider>
  );
};
