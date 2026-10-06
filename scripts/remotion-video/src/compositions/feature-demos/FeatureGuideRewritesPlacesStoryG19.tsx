/**
 * FeatureGuideRewritesPlacesStoryG19 — feature g19 — 1280x720, 897 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (2026-10-05): narration and beat windows are unchanged — only the
 * picture is rebuilt. archetype 1 "timeline ribbon", mood violet.
 *
 * The ribbon is a 21-night drive-history axis and is the spine of every
 * beat: it is lit, re-ranked and merged differently each time instead of
 * disappearing between four unrelated screens.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–292  "A driving guide narrates places you pass — but a spot that
 *               got a short, thin story early on stayed that way forever,
 *               even on roads you drive nightly."
 *               -> LiveWindow of the feature's own page (the ONLY recording
 *               used tonight); ribbon frozen on night 1, every later night
 *               dim — the car keeps passing, the words never change.
 *  b2 301–491  "Now it checks which places you've actually driven past most
 *               in the last three weeks, and rewrites those first."
 *               -> ribbon becomes the real 21-night window, 18/21 lit for
 *               this place; STORY_GEN=3 / MAX_PLACES=120 re-queue the rest.
 *  b3 500–713  "It also matches Wikidata place names smarter, so the same
 *               farm spelled two ways on two maps stops duplicating."
 *               (slide-in from above — the non-crossfade transition) -> two
 *               name pins on the ribbon merge into one; single tech caption
 *               "Wikidata" with a plain gloss.
 *  b4 722–852  "Your most-driven roads now get up to 10 sentences instead of
 *               6." holds to 897 -> LogWindow (gate 2: never the page/hub
 *               again) with the real numbers + hero "10".
 *
 * No GitHub URL verified tonight for g19, so commit 9ac7ab8 is not shown as
 * a recorded diff — the mechanism is drawn with the project's real names
 * (route_research.py, STORY_GEN, MAX_PLACES, twin()) instead.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine } from "./live-primitives";
import shotsFile from "./shots/g19.json";

const FADE = 9;
const B1_S = 15, B1_E = 292;
const B2_S = 301, B2_E = 491;
const B3_S = 500, B3_E = 713;
const B4_S = 722;
const END = 897;

const RIBBON_Y = 468;
const RIBBON_LEFT = 110;
const RIBBON_RIGHT = 1170;
const tickX = (i: number, n: number) => RIBBON_LEFT + (i / (n - 1)) * (RIBBON_RIGHT - RIBBON_LEFT);

const N1 = 14; // beat 1: many repeated nights, only the first ever lit
const N2 = 21; // beat 2: the real "last 21 nights" window
const B2_UNLIT = new Set([4, 11, 17]); // 3 of 21 unlit -> 18/21 driven

/** The shared spine: a thin horizontal line the ticks sit on. */
const Ribbon: React.FC<{ opacity: number }> = ({ opacity }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: RIBBON_LEFT,
        top: RIBBON_Y,
        width: RIBBON_RIGHT - RIBBON_LEFT,
        height: 6,
        borderRadius: 3,
        background: B.border,
        opacity,
      }}
    />
  );
};

const Tick: React.FC<{ x: number; lit: boolean; opacity: number }> = ({ x, lit, opacity }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  const size = lit ? 18 : 11;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: RIBBON_Y + 3 - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: lit ? B.accent : B.border,
        border: lit ? `2px solid ${B.accentEdge}` : "none",
        boxShadow: lit ? "0 5px 14px rgba(0,0,0,0.25)" : "none",
        opacity,
      }}
    />
  );
};

const TickLabel: React.FC<{
  x: number;
  text: string;
  color?: string;
  opacity: number;
  align?: "left" | "center" | "right";
  bold?: boolean;
}> = ({ x, text, color, opacity, align = "center", bold }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  const tr = align === "left" ? "0%" : align === "right" ? "-100%" : "-50%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: RIBBON_Y + 26,
        transform: `translateX(${tr})`,
        fontSize: 16,
        fontWeight: bold ? 800 : 700,
        letterSpacing: 0.3,
        color: color ?? B.muted,
        whiteSpace: "nowrap",
        opacity,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

const CarMarker: React.FC<{ x: number; opacity: number }> = ({ x, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: x - 19, top: RIBBON_Y - 44, fontSize: 32, opacity }}>🚗</div>
  );
};

const NamePin: React.FC<{ x: number; text: string; tone: "danger" | "success"; opacity: number }> = ({
  x,
  text,
  tone,
  opacity,
}) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  const c = tone === "success" ? B.success : B.danger;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: RIBBON_Y - 86,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          padding: "8px 16px",
          borderRadius: 999,
          background: "#fff",
          border: `2px solid ${c}`,
          color: c,
          fontSize: 17,
          fontWeight: 700,
          whiteSpace: "nowrap",
          boxShadow: "0 6px 16px rgba(22,35,63,0.18)",
          fontFamily,
        }}
      >
        📍 {text}
      </div>
      <div style={{ width: 2, height: 24, background: c, opacity: 0.6 }} />
    </div>
  );
};

const BeatHead: React.FC<{ kicker: string; title: string; opacity: number }> = ({ kicker, title, opacity }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 36,
          width: 1280,
          textAlign: "center",
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: 1.6,
          textTransform: "uppercase",
          color: B.accent,
          opacity,
          fontFamily,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 64,
          width: 1280,
          textAlign: "center",
          fontSize: 33,
          fontWeight: 800,
          color: B.ink,
          opacity,
          fontFamily,
        }}
      >
        {title}
      </div>
    </>
  );
};

const QueueBar: React.FC<{ label: string; pct: number; tone: "success" | "muted" }> = ({ label, pct, tone }) => {
  const B = usePalette();
  const color = tone === "success" ? B.success : B.border;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 190, fontSize: 17, fontWeight: 700, color: B.ink, fontFamily }}>{label}</div>
      <div style={{ height: 16, width: Math.max(10, pct * 210), borderRadius: 8, background: color }} />
    </div>
  );
};

const LogWindowG19: React.FC<{ opacity: number }> = ({ opacity }) => {
  const B = usePalette();
  const lines: LogLine[] = [
    { t: "21d", text: "drive history scored per place, most-recent 3 weeks", tone: "muted" },
    { t: "→", text: "this place: 18/21 nights — most-driven", tone: "accent" },
    { t: "gen", text: "STORY_GEN=3 → stale + skipped stories re-queued", tone: "ink" },
    { t: "cap", text: "MAX_PLACES=120 researched per run, busiest first", tone: "ink" },
    { t: "wiki", text: "twin(): Stabo nedre = Nedre Stabu → merged", tone: "success" },
    { t: "len", text: "story_prompt(): sentence budget 6 → 10", tone: "success" },
  ];
  return (
    <>
      <LogWindow
        lines={lines}
        title="guide · route_research.py"
        from={B4_S + 6}
        every={16}
        opacity={opacity}
        win={{ x: 150, y: 96, w: 980, h: 300 }}
        fontSize={21}
      />
      <div style={{ position: "absolute", left: 150, top: 418, opacity, fontFamily }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, color: B.ink, lineHeight: 1 }}>10</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: B.muted }}>sentences</div>
        </div>
        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 650, color: B.success }}>
          up from 6 — on your most-driven roads
        </div>
      </div>
      <CheckBadge x={1100} y={424} opacity={opacity} />
    </>
  );
};

const FrameInner: React.FC = () => {
  const B = usePalette();
  const frame = useCurrentFrame();

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E - FADE, B1_E));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E - FADE, B2_E));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E - FADE, B3_E));
  const b4 = seg(frame, B4_S, B4_S + FADE); // holds to END, no fade-out

  // beat 1: the car keeps passing (oscillates) while the "last rewrite" flag stays pinned
  const carOsc1 = (Math.sin((frame / 26) * Math.PI) + 1) / 2;
  const carX1 = tickX(0, N1) + carOsc1 * (tickX(3, N1) - tickX(0, N1));

  // beat 2: the car's position tracks how far through the 21-night window we are
  const carProg2 = interpolate(frame, [B2_S, B2_E], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const carX2 = tickX(0, N2) + carProg2 * (tickX(N2 - 1, N2) - tickX(0, N2));

  // beat 3: slide in from above instead of a plain crossfade
  const b3Slide = interpolate(frame, [B3_S - 36, B3_S + 10], [-70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pinXa = RIBBON_LEFT + 0.4 * (RIBBON_RIGHT - RIBBON_LEFT);
  const pinXb = RIBBON_LEFT + 0.6 * (RIBBON_RIGHT - RIBBON_LEFT);
  const mergedX = RIBBON_LEFT + 0.5 * (RIBBON_RIGHT - RIBBON_LEFT);
  const splitOn = seg(frame, B3_S + 14, B3_S + 40) * (1 - seg(frame, B3_S + 92, B3_S + 118));
  const mergedOn = seg(frame, B3_S + 104, B3_S + 140);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ---------------- beat 1 : one pass writes the story, forever ---------------- */}
      <Group opacity={b1}>
        <BeatHead kicker="Guide — Stories on the Road" title="one pass writes the story. forever." opacity={b1} />
        <StatPill x={120} y={150} emoji="🔁" text="told once — frozen since" tone="danger" opacity={b1} />
        <Panel x={120} y={210} w={470} h={160} tone="card" opacity={b1}>
          <div style={{ padding: "24px 28px", fontSize: 19, fontWeight: 600, color: B.ink, lineHeight: 1.45, fontFamily }}>
            Every night you drive past, the guide reads the same thin
            paragraph it wrote the very first time.
          </div>
        </Panel>
        <LiveWindow
          file={shotsFile as any}
          shot="page"
          title="vitalii.no/features/…-g19"
          from={B1_S + 26}
          hold={230}
          zoom={() => 1.08}
          focus={{ x: 0.45, y: 0.35 }}
          opacity={b1}
          win={{ x: 660, y: 130, w: 470, h: 270 }}
        />
        <Ribbon opacity={b1} />
        {Array.from({ length: N1 }, (_, i) => (
          <Tick key={i} x={tickX(i, N1)} lit={i === 0} opacity={b1} />
        ))}
        <TickLabel x={tickX(0, N1)} text="NIGHT 1 — WRITTEN" color={B.accent} opacity={b1} align="left" bold />
        <TickLabel x={tickX(N1 - 1, N1)} text="NIGHT 40+ — SAME TEXT" opacity={b1} align="right" />
        <CarMarker x={carX1} opacity={b1} />
        <CaptionBand text="A thin story, written once — never touched again." tone="danger" opacity={b1} />
      </Group>

      {/* ---------------- beat 2 : most-driven roads rewrite first ---------------- */}
      <Group opacity={b2}>
        <BeatHead kicker="Last 21 Nights" title="most-driven roads rewrite first" opacity={b2} />
        <StatPill x={120} y={140} emoji="🔁" text="STORY_GEN=3 → re-queue stale stories" tone="accent" opacity={b2} />
        <StatPill x={120} y={200} emoji="🧭" text="MAX_PLACES=120 per run, busiest first" tone="accent" opacity={b2} />
        <Panel x={660} y={130} w={470} h={230} tone="card" opacity={b2}>
          <div style={{ padding: "26px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.ink, fontFamily }}>most-driven-first ordering</div>
            <QueueBar label="this place" pct={1} tone="success" />
            <QueueBar label="quiet side street" pct={0.42} tone="muted" />
            <QueueBar label="back road" pct={0.22} tone="muted" />
          </div>
        </Panel>
        <Ribbon opacity={b2} />
        {Array.from({ length: N2 }, (_, i) => (
          <Tick key={i} x={tickX(i, N2)} lit={!B2_UNLIT.has(i)} opacity={b2} />
        ))}
        <TickLabel x={tickX(0, N2)} text="21-NIGHT WINDOW" opacity={b2} align="left" />
        <TickLabel x={tickX(N2 - 1, N2)} text="18/21 DRIVEN" color={B.success} opacity={b2} align="right" bold />
        <CarMarker x={carX2} opacity={b2} />
        <CaptionBand text="It checks the last three weeks and rewrites the busiest roads first." tone="accent" opacity={b2} />
      </Group>

      {/* ---------------- beat 3 : Wikidata place matching (slide-in, non-crossfade) ---------------- */}
      <Group opacity={b3} dy={b3Slide}>
        <BeatHead kicker="Wikidata Place Matching" title="two spellings, one place" opacity={b3} />
        <StatPill x={120} y={150} emoji="🧩" text="Wikidata twin() lookup" tone="accent" opacity={b3} />
        <StatPill x={120} y={210} emoji="🔗" text="duplicate farm names merge" tone="accent" opacity={b3} />
        <Panel x={660} y={130} w={470} h={160} tone="card" opacity={b3}>
          <div style={{ padding: "22px 28px", fontSize: 18, fontWeight: 600, color: B.ink, lineHeight: 1.45, fontFamily }}>
            Two different spellings of the same farm used to get two
            separate, half-written stories instead of one good one.
          </div>
        </Panel>
        <Ribbon opacity={b3 * 0.4} />
        {Array.from({ length: N2 }, (_, i) => (
          <Tick key={i} x={tickX(i, N2)} lit={i === 10} opacity={b3 * 0.4} />
        ))}
        <NamePin x={pinXa} text="Stabo nedre" tone="danger" opacity={splitOn * b3} />
        <NamePin x={pinXb} text="Nedre Stabu" tone="danger" opacity={splitOn * b3} />
        <NamePin x={mergedX} text="Stabo nedre" tone="success" opacity={mergedOn * b3} />
        <CheckBadge x={mergedX + 46} y={RIBBON_Y - 118} opacity={mergedOn * b3} />
        <FilterChip x={120} y={540} text="Wikidata" icon="🧩" color={B.accent} opacity={b3} />
        <Panel x={110} y={580} w={330} h={66} tone="card" opacity={b3}>
          <div style={{ padding: "10px 18px", fontSize: 15, fontWeight: 600, color: B.muted, lineHeight: 1.3, fontFamily }}>
            a free structured database of facts
          </div>
        </Panel>
        <Panel x={790} y={540} w={340} h={106} tone="card" opacity={b3}>
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.ink, fontFamily }}>nedre · øvre · søndre · vestre</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: B.muted, fontFamily }}>
              direction words normalized automatically
            </div>
          </div>
        </Panel>
        <CaptionBand text="Same farm, two spellings — now one place on the map." tone="success" opacity={b3} />
      </Group>

      {/* ---------------- beat 4 : the real result, holds to the end ---------------- */}
      <Group opacity={b4}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 40,
            width: 1280,
            textAlign: "center",
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 1.6,
            textTransform: "uppercase",
            color: B.accent,
            opacity: b4,
            fontFamily,
          }}
        >
          Guide — Stories on the Road · Result
        </div>
        <LogWindowG19 opacity={b4} />
        <CaptionBand text="The same drive, a richer story — every single night." tone="success" opacity={b4} />
      </Group>
    </div>
  );
};

export const FeatureGuideRewritesPlacesStoryG19: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <FrameInner />
  </PaletteProvider>
);
