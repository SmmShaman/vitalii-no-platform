/**
 * FeatureNightlyClipFactoryRotatesV37 — feature v37 — 1280x720, 982 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 0 "split duel" (drawn by the orchestrating session, not re-drawn
 * here): the frame is halved by a moving divider — chaos (danger) on the
 * left, order (success) on the right, both zones alive at once. The divider
 * slides right→left across the clip as the fix takes over more of the frame,
 * settling into its new position just before each beat's content is fully
 * opaque. No centered headline — every label sits inside its own half.
 *
 * UI beats (3, 4, 5) play REAL recordings via LiveWindow, driven by
 * shots/v37.json (STEP 0c): two real commit pages + the feature's own page.
 * Beats 1-2 are drawn (a fabricated night log + a metaphor), per the rule
 * that only UI beats get recordings.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–182  "Our nightly video factory went dark for two nights — and every log still said 'completed.'"
 *  b2 191–365  "Like a worker still clocking in after they'd gone home, its own memory had ballooned unnoticed."
 *  b3 374–577  "Now a Python routine resets the agent's memory before every single run, not after some size limit."
 *  b4 586–712  "One task per clip too, so one failure can't take down the whole night."
 *  b5 721–937  "And if a night still fails, it gets one retry — catching what the old system missed at 47.5 megabytes." — holds to 982.
 *
 * Single tech name in the whole clip: Python (beat 3 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, CaptionBand, Panel, seg, fontFamily } from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shots from "./shots/v37.json";

const P = MOODS.violet;
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

export const FeatureNightlyClipFactoryRotatesV37: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 182, 198));
  const b2 = seg(frame, 191, 207) * (1 - seg(frame, 365, 381));
  const b3 = seg(frame, 374, 390) * (1 - seg(frame, 577, 593));
  const b4 = seg(frame, 586, 602) * (1 - seg(frame, 712, 728));
  const b5 = seg(frame, 721, 737); // holds through 982, no fade-out

  const heroPop5 = pop(721);

  // the divider slides one notch left as each fix beat takes over the frame
  const dividerX = interpolate(
    frame,
    [0, 374, 400, 586, 612, 721, 747, 982],
    [1080, 1080, 760, 760, 540, 540, 260, 260],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );

  const oldLabelOpacity = interpolate(frame, [0, 400, 600], [1, 1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newLabelOpacity = seg(frame, 374, 400);
  const hourglassOpacity = seg(frame, 60, 90) * (1 - seg(frame, 340, 374));

  // beat 2: the session's own memory, creeping toward the real 47.5 MB figure
  const memVal = interpolate(frame, [207, 365], [2, 47.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const memWidth = interpolate(memVal, [2, 47.5], [40, 760], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // beat 4: independent slide-in ramp, the required non-crossfade transition
  const slide4 = interpolate(frame, [586, 620], [56, 0], {
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
          🌙 OLD SYSTEM
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
          ✅ NEW SYSTEM
        </div>
        <StatPill x={1104} y={258} emoji="⏳" text="fix coming" tone="accent" opacity={hourglassOpacity} fontSize={15} />

        {/* ---------------- beat 1 : two dark nights, false "completed" ---------------- */}
        <Group opacity={b1}>
          <Panel x={90} y={120} w={430} h={280} tone="danger" />
          <Panel x={560} y={120} w={430} h={280} tone="danger" />
          <div style={{ position: "absolute", left: 122, top: 148, fontSize: 20, fontWeight: 800, color: P.ink }}>🌙 NIGHT — SEP 6</div>
          <div style={{ position: "absolute", left: 122, top: 190, padding: "4px 12px", borderRadius: 999, background: P.card, border: `1.5px solid ${P.successEdge}`, color: P.success, fontSize: 15, fontWeight: 700 }}>✅ completed</div>
          <div style={{ position: "absolute", left: 122, top: 232, fontSize: 30, fontWeight: 800, color: P.danger }}>0 clips</div>
          <div style={{ position: "absolute", left: 592, top: 148, fontSize: 20, fontWeight: 800, color: P.ink }}>🌙 NIGHT — SEP 7</div>
          <div style={{ position: "absolute", left: 592, top: 190, padding: "4px 12px", borderRadius: 999, background: P.card, border: `1.5px solid ${P.successEdge}`, color: P.success, fontSize: 15, fontWeight: 700 }}>✅ completed</div>
          <div style={{ position: "absolute", left: 592, top: 232, fontSize: 30, fontWeight: 800, color: P.danger }}>0 clips</div>
          <StatPill x={90} y={430} emoji="🌙" text="2 nights, zero output" tone="danger" opacity={b1} />
          <StatPill x={90} y={490} emoji="✅" text="logs still said done" tone="danger" opacity={b1} />
          <CaptionBand y={646} text="Two nights dark — every log still said 'completed.'" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : the metaphor, memory creeping up ---------------- */}
        <Group opacity={b2}>
          <Panel x={90} y={120} w={900} h={280} tone="danger" />
          <StatPill x={130} y={160} emoji="🕐" text="still clocking in, after hours" tone="danger" opacity={b2} />
          <StatPill x={130} y={220} emoji="👀" text="nobody's watching" tone="danger" opacity={b2} />
          <div
            style={{
              position: "absolute",
              left: 130,
              top: 300,
              width: 760,
              height: 34,
              borderRadius: 17,
              background: "#fff",
              border: `1.5px solid ${P.dangerEdge}`,
              overflow: "hidden",
            }}
          >
            <div style={{ width: memWidth, height: "100%", background: P.danger, borderRadius: 17 }} />
          </div>
          <div style={{ position: "absolute", left: 130, top: 344, fontSize: 18, fontWeight: 800, color: P.danger, fontVariantNumeric: "tabular-nums" }}>
            {memVal.toFixed(1)} MB and climbing
          </div>
          <CaptionBand y={646} text="Its own memory had quietly ballooned, unnoticed." tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : real commit, resets memory every run ---------------- */}
        <Group opacity={b3}>
          <FilterChip x={790} y={72} text="Python" icon="🐍" opacity={b3} />
          <LiveWindow
            file={shots}
            shot="fix1"
            title="github.com — commit e030b46 · reset context every wave"
            from={374}
            hold={219}
            opacity={b3}
            win={{ x: 790, y: 110, w: 460, h: 233 }}
          />
          <StatPill x={790} y={353} emoji="♻" text="resets every run" tone="success" opacity={b3} />
          <CaptionBand y={646} text="A Python routine now resets memory before every single run." tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : real commit, one task per clip ---------------- */}
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `translateX(${slide4}px)` }}>
            <LiveWindow
              file={shots}
              shot="fix2"
              title="github.com — commit 01b477a · one task per clip"
              from={586}
              hold={142}
              opacity={b4}
              win={{ x: 570, y: 100, w: 680, h: 325 }}
            />
            <StatPill x={570} y={435} emoji="🧩" text="one task, one 45-min timeout" tone="accent" opacity={b4} />
          </div>
          <CaptionBand y={646} text="One task per clip — one failure can't take down the night." tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : the real page, one retry catches it ---------------- */}
        <Group opacity={b5}>
          {hero("47.5", "MB", "CAUGHT BY THE NEW ROUTINE", P.success, heroPop5)}
          <CheckBadge x={790} y={18} size={44} opacity={b5} scale={heroPop5} />
          <LiveWindow
            file={shots}
            shot="page"
            title="vitalii.no/features/…-v37"
            from={721}
            hold={261}
            opacity={b5}
            win={{ x: 300, y: 110, w: 940, h: 433 }}
          />
          <StatPill x={300} y={553} emoji="🔁" text="one retry only" tone="success" opacity={b5} />
          <CaptionBand y={646} text="One retry catches it now — at 47.5 megabytes." tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
