/**
 * FeatureInstagramPublishing — feature p15 — 1280x720, 907 frames @30fps.
 *
 * FIRST VOICE-SYNCED CLIP (owner rule, 2026-08-31). Everything before this was
 * a 15 s silent loop with a voiceover laid over it afterwards, so the picture
 * repeated twice while the narration said something new — the viewer heard one
 * thing and watched another. From here the ORDER IS REVERSED: the voiceover is
 * written and measured FIRST, and the frame windows below are the measured beat
 * boundaries, not a designer's guess. Rebuild the audio and you must rebuild
 * these numbers with it (`scripts/remotion-video/vo-scripts/p15-beats.py`).
 *
 * Art direction drawn from the feature id (STEP 0 of lux-batch-instructions.md):
 *   archetype 7 "hero number" — (sum of char codes of "p15") % 8 = 6 "sidebar",
 *   already used by the previous logged clip (p14), so the next one down: 7.
 *   mood — moodFor("p15") = violet, used by p14, so the next in MOOD_NAMES: dawn.
 *
 * Beat windows, measured from the edge-tts build (fps 30, 0.5 s lead, 0.3 s gaps):
 *   b1  15-150  "Two out of every five Instagram posts simply vanished. Rejected."
 *   b2 159-340  "Not with a reason — with a number. Error ten. Error twenty-four.
 *                Nothing about what to fix."
 *   b3 349-500  "So the picture is measured before it ever leaves. Wrong shape,
 *                and it never gets sent."
 *   b4 509-691  "For Reels, the function waits, checking every ten seconds until
 *                Instagram says it is ready."
 *   b5 700-862  "Forty percent failing, down to under five. And every error now
 *                arrives with its fix."
 *   tail 862-907
 *
 * The hero figure owns the frame for the whole clip and is the only element that
 * survives every beat: it reads 40% while the problem is described and counts
 * down to <5% exactly while beat 5 says so. Evidence is built AROUND it in the
 * right-hand zone, which is why each beat there must fade out fully before the
 * next fades in — they share the same area.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { moodFor } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  IconCard,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const P = moodFor("p15");

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const BEATS = {
  b1: [15, 150],
  b2: [159, 340],
  b3: [349, 500],
  b4: [509, 691],
  b5: [700, 862],
} as const;

/** A square Instagram post tile; `state` drives whether it is accepted or silently rejected. */
const PostTile: React.FC<{
  x: number;
  y: number;
  size: number;
  rejected: number;
  opacity?: number;
}> = ({ x, y, size, rejected, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: 10,
      background: P.card,
      border: `2px solid ${rejected > 0.5 ? P.dangerEdge : P.border}`,
      boxShadow: "0 4px 14px rgba(20,35,70,0.08)",
      opacity,
      overflow: "hidden",
      fontFamily,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${P.chipBg} 0%, ${P.accentBg} 100%)`,
        opacity: 1 - rejected * 0.75,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.42,
        color: P.danger,
        opacity: rejected,
      }}
    >
      ✕
    </div>
  </div>
);

/** A raw API error code as Instagram actually returns it: a number and nothing else. */
const ErrorChip: React.FC<{
  x: number;
  y: number;
  code: string;
  scale?: number;
  opacity?: number;
}> = ({ x, y, code, scale = 1, opacity = 1 }) => {
  if (opacity <= 0.004 || scale <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: "left top",
        padding: "14px 22px",
        borderRadius: 12,
        background: P.dangerBg,
        border: `1.5px solid ${P.dangerEdge}`,
        color: P.danger,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: 0.5,
        opacity,
        fontFamily,
      }}
    >
      {code}
    </div>
  );
};

export const FeatureInstagramPublishing: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  /**
   * Visibility for a beat that lives in the shared right-hand zone: it fades in
   * after its window opens and is fully gone before the window closes, so two
   * beats never crossfade on top of each other.
   */
  const zone = (name: keyof typeof BEATS) => {
    const [s, e] = BEATS[name];
    return Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));
  };

  const b1 = zone("b1");
  const b2 = zone("b2");
  const b3 = zone("b3");
  const b4 = zone("b4");
  // The last beat has nothing to hand over to, so it holds through the 1.5 s
  // tail instead of fading out into an empty right-hand zone.
  const b5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);

  // ---- Hero figure: 40% for the whole problem, counting down only while beat 5 says it.
  const countStart = BEATS.b5[0] + 26;
  const countEnd = BEATS.b5[0] + 104;
  const counted = interpolate(frame, [countStart, countEnd], [40, 4.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const heroText = frame >= countEnd ? "<5%" : `${Math.round(counted)}%`;
  // The same glyphs are painted twice; the green layer fades in over the red one
  // so the figure changes colour without ever showing two different numbers.
  const heroGreen = seg(frame, countStart, countEnd);
  const heroLabel =
    frame >= countEnd ? "of Instagram posts rejected, today" : "of Instagram posts rejected";

  const heroIn = seg(frame, 6, 26);

  const HeroFigure: React.FC<{ color: string; opacity: number }> = ({ color, opacity }) => (
    <div
      style={{
        position: "absolute",
        left: 78,
        top: 196,
        width: 520,
        fontSize: 208,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -6,
        color,
        opacity,
        fontFamily,
      }}
    >
      {heroText}
    </div>
  );

  return (
    <>
      <LightBg />

      <Group opacity={loopFade(frame, durationInFrames)}>
        {/* ---------- Hero figure: present in every beat, changes only in beat 5 ---------- */}
        <HeroFigure color={P.danger} opacity={heroIn} />
        <HeroFigure color={P.success} opacity={heroIn * heroGreen} />

        <div
          style={{
            position: "absolute",
            left: 84,
            top: 418,
            width: 500,
            fontSize: 27,
            fontWeight: 650,
            color: P.muted,
            opacity: heroIn,
            fontFamily,
          }}
        >
          {heroLabel}
        </div>

        <div
          style={{
            position: "absolute",
            left: 84,
            top: 128,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: P.muted,
            opacity: heroIn,
            fontFamily,
          }}
        >
          Instagram publishing
        </div>

        {/* ---------- Beat 1 — two out of five tiles silently rejected ---------- */}
        <Group opacity={b1}>
          {[0, 1, 2, 3, 4].map((i) => {
            const rejected = i >= 3 ? seg(frame, 52 + (i - 3) * 20, 84 + (i - 3) * 20) : 0;
            return (
              <PostTile
                key={i}
                x={672 + (i % 3) * 178}
                y={214 + Math.floor(i / 3) * 178}
                size={152}
                rejected={rejected}
                opacity={seg(frame, 24 + i * 9, 48 + i * 9)}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 674,
              top: 574,
              width: 520,
              fontSize: 25,
              fontWeight: 650,
              color: P.danger,
              opacity: seg(frame, 96, 118),
              fontFamily,
            }}
          >
            Two of every five never appeared.
          </div>
        </Group>

        {/* ---------- Beat 2 — the API answers with numbers, not reasons ---------- */}
        <Group opacity={b2}>
          {[
            { code: "#10", x: 672, y: 208 },
            { code: "#24", x: 872, y: 208 },
            { code: "#100", x: 672, y: 300 },
            { code: "#190", x: 872, y: 300 },
          ].map((e, i) => (
            <ErrorChip
              key={e.code}
              x={e.x}
              y={e.y}
              code={e.code}
              scale={interpolate(seg(frame, 176 + i * 22, 206 + i * 22), [0, 1], [0.82, 1])}
              opacity={seg(frame, 176 + i * 22, 206 + i * 22)}
            />
          ))}
          <Panel x={664} y={402} w={520} h={132} tone="danger" opacity={seg(frame, 268, 296)}>
            <div
              style={{
                padding: "26px 28px",
                fontSize: 26,
                fontWeight: 650,
                color: P.danger,
                lineHeight: 1.35,
                fontFamily,
              }}
            >
              No field, no dimension, no hint.
              <br />
              Just the number.
            </div>
          </Panel>
        </Group>

        {/* ---------- Beat 3 — the picture is measured locally, before it is sent ---------- */}
        <Group opacity={b3}>
          <Panel x={664} y={186} w={524} h={168} tone="success" opacity={seg(frame, 360, 386)}>
            <div style={{ padding: "22px 26px", fontFamily }}>
              <div style={{ fontSize: 21, fontWeight: 700, color: P.muted, letterSpacing: 1.4 }}>
                1080 × 1350
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: P.success, marginTop: 10 }}>
                4:5 — allowed
              </div>
              <div style={{ fontSize: 20, color: P.muted, marginTop: 8 }}>
                measured here, sent onward
              </div>
            </div>
          </Panel>
          <CheckBadge x={1120} y={206} scale={seg(frame, 388, 412)} opacity={seg(frame, 388, 412)} />

          <Panel x={664} y={372} w={524} h={168} tone="danger" opacity={seg(frame, 414, 440)}>
            <div style={{ padding: "22px 26px", fontFamily }}>
              <div style={{ fontSize: 21, fontWeight: 700, color: P.muted, letterSpacing: 1.4 }}>
                1080 × 500
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: P.danger, marginTop: 10 }}>
                2.16:1 — refused
              </div>
              <div style={{ fontSize: 20, color: P.muted, marginTop: 8 }}>
                stopped before the upload
              </div>
            </div>
          </Panel>
        </Group>

        {/* ---------- Beat 4 — Reels: create the container, then wait patiently ---------- */}
        <Group opacity={b4}>
          {[
            { t: "10s", label: "in progress", i: 0 },
            { t: "20s", label: "in progress", i: 1 },
            { t: "30s", label: "finished", i: 2 },
          ].map((row) => {
            const app = seg(frame, 528 + row.i * 34, 558 + row.i * 34);
            const done = row.i === 2;
            return (
              <StatPill
                key={row.t}
                x={676}
                y={212 + row.i * 78}
                emoji={done ? "✅" : "🕒"}
                text={`${row.t} — ${row.label}`}
                tone={done ? "success" : "accent"}
                opacity={app}
                scale={interpolate(app, [0, 1], [0.9, 1])}
                fontSize={24}
              />
            );
          })}
          <IconCard
            x={676}
            y={452}
            w={508}
            emoji="📤"
            title="Then, and only then, publish"
            sub="up to 30 checks, 10 seconds apart"
            tone="success"
            opacity={seg(frame, 636, 664)}
            scale={interpolate(seg(frame, 636, 664), [0, 1], [0.94, 1])}
          />
        </Group>

        {/* ---------- Beat 5 — the number falls, and errors arrive with their fix ---------- */}
        <Group opacity={b5}>
          <Panel x={664} y={216} w={524} h={150} tone="card" opacity={seg(frame, 782, 812)}>
            <div style={{ padding: "24px 26px", fontFamily }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: P.danger }}>#24</div>
              <div style={{ fontSize: 25, fontWeight: 650, color: P.ink, marginTop: 10 }}>
                → resize to 4:5, then retry
              </div>
            </div>
          </Panel>
          <Panel x={664} y={384} w={524} h={150} tone="success" opacity={seg(frame, 816, 846)}>
            <div style={{ padding: "24px 26px", fontFamily }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: P.success }}>#190</div>
              <div style={{ fontSize: 25, fontWeight: 650, color: P.ink, marginTop: 10 }}>
                → refresh the page token
              </div>
            </div>
          </Panel>
        </Group>

        {/* One tech-credibility line for the whole clip. */}
        <CaptionBand
          y={648}
          text="post-to-instagram — a Deno edge function on Supabase"
          tone="card"
          fontSize={21}
          opacity={seg(frame, 40, 70) * 0.72}
        />
      </Group>
    </>
  );
};
