/**
 * FeatureNoMoreLoopingPictureV28 — feature v28 — 1280x720, 907 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 0 "split duel" (drawn by the orchestrating session, not re-drawn
 * here): the frame is halved by a moving divider — the old, fixed-length
 * picture (danger) on the left, the new voice-measured pipeline (success) on
 * the right, both zones alive at once. The divider slides right→left as the
 * fix takes over more of the frame, settling just before each beat's content
 * is fully opaque. No centered headline — every label sits inside its own
 * half.
 *
 * UI beats (3, 4, 5) play REAL recordings via LiveWindow, driven by
 * shots/v28.json (STEP 0c): the repo's commit history, its Actions runs, and
 * the feature's own page. Beats 1-2 are drawn — they narrate an old clip and
 * a fixed-length-vs-voice metaphor, not a specific interface.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–103  "Watch an old clip of mine and something feels off."
 *  b2 112–339  "The picture had a fixed length, so when the voice ran longer, it just looped — you'd see the same scene twice while the words moved on."
 *  b3 348–489  "So I flipped it. Now I write the narration first and measure each sentence."
 *  b4 498–663  "The video, built in Remotion, follows those exact measurements, beat by beat."
 *  b5 672–858  "This clip now runs exactly nine hundred seven frames — precisely as long as the voice needs." — holds to 907.
 *
 * Single tech name in the whole clip: Remotion (beat 4 chip only, matching the spoken word).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, CaptionBand, Panel, seg, fontFamily } from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shots from "./shots/v28.json";

const P = MOODS.dawn;
const STAGE_H = 600;

const hero = (value: string, unit: string | undefined, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: 300,
      top: 12,
      width: 460,
      transform: `scale(${0.85 + 0.15 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 800, letterSpacing: -2, color, fontVariantNumeric: "tabular-nums" }}>
      {value}
      {unit ? <span style={{ fontSize: 64 * 0.36, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, letterSpacing: 1.6, color: P.muted }}>{label}</div>
  </div>
);

export const FeatureNoMoreLoopingPictureV28: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 24) * (1 - seg(frame, 103, 112));
  const b2 = seg(frame, 112, 121) * (1 - seg(frame, 339, 348));
  const b3 = seg(frame, 348, 357) * (1 - seg(frame, 489, 498));
  const b4 = seg(frame, 498, 507) * (1 - seg(frame, 663, 672));
  const b5 = seg(frame, 672, 681); // holds through 907, no fade-out

  const heroPop5 = pop(672);

  // the divider slides right→left as the fix takes over more of the frame
  const dividerX = interpolate(
    frame,
    [0, 348, 374, 498, 524, 672, 698, 907],
    [1080, 1080, 760, 760, 540, 540, 260, 260],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );

  const oldLabelOpacity = interpolate(frame, [0, 380, 580], [1, 1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newLabelOpacity = seg(frame, 348, 374);

  // beat 2: fixed picture length vs the voice quietly outrunning it
  const voiceVal = interpolate(frame, [121, 339], [450, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const voiceWidth = interpolate(voiceVal, [450, 620], [420, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const overlapOpacity = seg(frame, 220, 250);

  // beat 4: independent slide-in ramp, the required non-crossfade transition
  const slide4 = interpolate(frame, [498, 532], [56, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- persistent split stage ---------------- */}
        <div style={{ position: "absolute", left: 0, top: 0, width: dividerX, height: STAGE_H, background: P.dangerBg }} />
        <div
          style={{
            position: "absolute",
            left: dividerX,
            top: 0,
            width: 1280 - dividerX,
            height: STAGE_H,
            background: P.successBg,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: dividerX - 3,
            top: 0,
            width: 6,
            height: 620,
            background: P.accent,
            boxShadow: `0 0 18px ${P.accent}`,
          }}
        />
        <div style={{ position: "absolute", left: 0, top: STAGE_H, width: 1280, height: 720 - STAGE_H, background: P.card }} />

        <div
          style={{
            position: "absolute",
            left: 40,
            top: 24,
            padding: "6px 16px",
            borderRadius: 999,
            background: P.dangerBg,
            border: `1.5px solid ${P.dangerEdge}`,
            color: P.danger,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1.2,
            opacity: oldLabelOpacity,
            fontFamily,
          }}
        >
          🔁 OLD: PICTURE FIRST
        </div>
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 24,
            padding: "6px 16px",
            borderRadius: 999,
            background: P.successBg,
            border: `1.5px solid ${P.successEdge}`,
            color: P.success,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1.2,
            opacity: newLabelOpacity,
            fontFamily,
          }}
        >
          ✅ NEW: VOICE FIRST
        </div>

        {/* ---------------- beat 1 : an old clip, something feels off ---------------- */}
        <Group opacity={b1}>
          <Panel x={90} y={120} w={900} h={300} tone="danger" />
          <div style={{ position: "absolute", left: 122, top: 148, fontSize: 20, fontWeight: 800, color: P.ink }}>
            🎬 feature-demo.mp4
          </div>
          <div
            style={{
              position: "absolute",
              left: 122,
              top: 192,
              width: 820,
              height: 120,
              borderRadius: 12,
              background: "#151a24",
              border: `1.5px solid ${P.dangerEdge}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 44, color: "#fff" }}>🔁</div>
          </div>
          <div style={{ position: "absolute", left: 122, top: 328, fontSize: 16, fontWeight: 700, color: P.danger, fontVariantNumeric: "tabular-nums" }}>
            0:15 / 0:15 — REPLAYING
          </div>
          <StatPill x={122} y={380} emoji="👀" text="same scene, second time" tone="danger" opacity={b1} />
          <CaptionBand y={646} text="Watch an old clip of mine — something feels off." tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : fixed picture vs a longer voice ---------------- */}
        <Group opacity={b2}>
          <Panel x={90} y={120} w={900} h={300} tone="danger" />
          <div style={{ position: "absolute", left: 130, top: 150, fontSize: 15, fontWeight: 800, letterSpacing: 1, color: P.muted }}>
            🎞 PICTURE — fixed 450 frames
          </div>
          <div
            style={{
              position: "absolute",
              left: 130,
              top: 176,
              width: 420,
              height: 30,
              borderRadius: 15,
              background: "#fff",
              border: `1.5px solid ${P.dangerEdge}`,
              overflow: "hidden",
            }}
          >
            <div style={{ width: 420, height: "100%", background: P.muted, borderRadius: 15 }} />
          </div>

          <div style={{ position: "absolute", left: 130, top: 238, fontSize: 15, fontWeight: 800, letterSpacing: 1, color: P.danger }}>
            🎙 VOICE — {voiceVal.toFixed(0)} frames and growing
          </div>
          <div
            style={{
              position: "absolute",
              left: 130,
              top: 264,
              width: 700,
              height: 30,
              borderRadius: 15,
              background: "#fff",
              border: `1.5px solid ${P.dangerEdge}`,
              overflow: "hidden",
            }}
          >
            <div style={{ width: voiceWidth, height: "100%", background: P.danger, borderRadius: 15 }} />
          </div>

          <div
            style={{
              position: "absolute",
              left: 130 + 420,
              top: 264,
              width: 280,
              height: 30,
              borderRadius: "0 15px 15px 0",
              background: P.dangerBg,
              border: `1.5px dashed ${P.dangerEdge}`,
              opacity: overlapOpacity,
            }}
          />
          <StatPill x={130} y={340} emoji="🔁" text="same scene twice while the words moved on" tone="danger" opacity={overlapOpacity} />
          <CaptionBand y={646} text="Fixed picture length — so a longer voice just looped." tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : narration first, real commit history ---------------- */}
        <Group opacity={b3}>
          <LiveWindow
            file={shots}
            shot="commits"
            title="github.com — commit history, one beat measured at a time"
            from={348}
            hold={150}
            opacity={b3}
            win={{ x: 790, y: 110, w: 460, h: 233 }}
          />
          <StatPill x={790} y={353} emoji="📝" text="narration written first, then measured" tone="success" opacity={b3} />
          <CaptionBand y={646} text="I flipped it — narration first, each sentence measured." tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : Remotion follows the measurements, real Actions run ---------------- */}
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `translateX(${slide4}px)` }}>
            <FilterChip x={570} y={72} text="Remotion" icon="🎛" opacity={b4} />
            <LiveWindow
              file={shots}
              shot="actions"
              title="github.com — Actions run, rendering beat by beat"
              from={498}
              hold={174}
              opacity={b4}
              win={{ x: 570, y: 100, w: 680, h: 325 }}
            />
            <StatPill x={570} y={435} emoji="📐" text="frame windows follow the measurements" tone="accent" opacity={b4} />
          </div>
          <CaptionBand y={646} text="Built in Remotion — follows those exact measurements, beat by beat." tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : the real page, exact frame count ---------------- */}
        <Group opacity={b5}>
          {hero("907", "frames", "AS LONG AS THE VOICE NEEDS", P.success, heroPop5)}
          <CheckBadge x={790} y={18} size={44} opacity={b5} scale={heroPop5} />
          <LiveWindow
            file={shots}
            shot="page"
            title="vitalii.no/features/…-v28"
            from={672}
            hold={235}
            opacity={b5}
            win={{ x: 300, y: 110, w: 940, h: 433 }}
          />
          <StatPill x={300} y={553} emoji="🎯" text="zero loop, zero drift" tone="success" opacity={b5} />
          <CaptionBand y={646} text="Exactly 907 frames — precisely as long as the voice needs." tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
