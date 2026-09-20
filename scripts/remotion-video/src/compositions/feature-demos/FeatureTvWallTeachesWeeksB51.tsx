/**
 * FeatureTvWallTeachesWeeksB51 — feature b51 — 1280x720, 836 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 0 "split duel" (pre-assigned, not redrawn here): the frame is
 * halved by a moving divider — homework-only history (danger) on the left,
 * the week's curriculum plan (success) on the right. The divider starts
 * wide-left through the problem beats and slides left as the fix takes over
 * the frame, settling almost fully green for the resolution.
 *
 * UI beats (4, 5) play REAL recordings via LiveWindow, driven by
 * shots/b51.json (STEP 0c): the feature's own write-up page and the
 * features hub — the only two verified public URLs for this feature.
 * Beats 1-3 are drawn (the family problem + the wall's internal sourcing
 * logic, neither of which is a page a viewer could visit).
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–132  "One kid here can go a whole term without ever earning TV time."
 *  b2 141–315  "The teaching wall was his only lesson, though three of four subjects came from his own finished homework."
 *  b3 324–438  "So it fell silent for exactly the child it existed to teach."
 *  b4 447–597  "Now every subject builds from the week's own curriculum plan, not past homework."
 *  b5 606–791  "All four subjects now teach from that same weekly plan — even for the kid who never turns on the TV." — holds to 836.
 *
 * Single tech name in the whole clip: Cloudflare Workers (beat 4 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, CaptionBand, Panel, seg, fontFamily } from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shots from "./shots/b51.json";

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

const SUBJECTS = [
  { label: "Grammar", ok: false },
  { label: "Norwegian", ok: false },
  { label: "English", ok: false },
  { label: "Math", ok: true },
] as const;

export const FeatureTvWallTeachesWeeksB51: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 132, 148));
  const b2 = seg(frame, 141, 157) * (1 - seg(frame, 315, 331));
  const b3 = seg(frame, 324, 340) * (1 - seg(frame, 438, 454));
  const b4 = seg(frame, 447, 463) * (1 - seg(frame, 597, 613));
  const b5 = seg(frame, 606, 622); // holds through 836, no fade-out

  const heroPop5 = pop(606);

  // divider stays wide-danger through the problem beats, then slides left as the fix takes over
  const dividerX = interpolate(
    frame,
    [0, 438, 464, 597, 623, 836],
    [1080, 1080, 640, 640, 220, 220],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );

  const oldLabelOpacity = interpolate(frame, [0, 447, 650], [1, 1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newLabelOpacity = seg(frame, 438, 464);

  // beat 2: three of the four subjects sourced from homework, one from curriculum — staggered reveal
  const subjectReveal = (i: number) => seg(frame, 157 + i * 24, 173 + i * 24);

  // beat 4: independent slide-in ramp, the required non-crossfade transition
  const slide4 = interpolate(frame, [447, 481], [64, 0], {
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
          📺 HOMEWORK-ONLY WALL
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
          ✅ WEEKLY CURRICULUM PLAN
        </div>

        {/* ---------------- beat 1 : one kid, no TV time all term ---------------- */}
        <Group opacity={b1}>
          <Panel x={90} y={120} w={900} h={280} tone="danger" />
          <div style={{ position: "absolute", left: 122, top: 152, fontSize: 22, fontWeight: 800, color: P.ink }}>🧒 ONE KID, ONE TERM</div>
          <div style={{ position: "absolute", left: 122, top: 200, fontSize: 44, fontWeight: 800, color: P.danger, fontVariantNumeric: "tabular-nums" }}>0 sessions</div>
          <div style={{ position: "absolute", left: 122, top: 258, fontSize: 17, color: P.muted, fontWeight: 600 }}>never earned TV time this term</div>
          <StatPill x={122} y={330} emoji="📴" text="the wall was his only lesson" tone="danger" opacity={b1} />
          <CaptionBand y={646} text="One kid can go a whole term without ever earning TV time." tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : three of four subjects need finished homework ---------------- */}
        <Group opacity={b2}>
          {SUBJECTS.map((s, i) => (
            <Panel key={s.label} x={90 + i * 225} y={120} w={200} h={220} tone={s.ok ? "success" : "danger"} opacity={subjectReveal(i)}>
              <div style={{ position: "absolute", left: 18, top: 16, fontSize: 17, fontWeight: 800, color: P.ink }}>{s.label}</div>
              <div style={{ position: "absolute", left: 18, top: 52, fontSize: 30 }}>{s.ok ? "✅" : "🚫"}</div>
              <div style={{ position: "absolute", left: 18, top: 100, width: 164, fontSize: 13, fontWeight: 700, color: s.ok ? P.success : P.danger }}>
                {s.ok ? "reads current unit" : "needs his own finished homework"}
              </div>
            </Panel>
          ))}
          <CaptionBand y={646} text="Three of four subjects came from his own finished homework." tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the wall falls silent for exactly this kid ---------------- */}
        <Group opacity={b3}>
          <Panel x={90} y={120} w={900} h={280} tone="danger" />
          <div style={{ position: "absolute", left: 122, top: 150, fontSize: 26, fontWeight: 800, color: P.danger }}>📺 WALL: SILENT</div>
          <div style={{ position: "absolute", left: 122, top: 200, fontSize: 17, color: P.ink, fontWeight: 600, width: 820 }}>
            No finished homework days → no material → nothing to teach.
          </div>
          <StatPill x={122} y={280} emoji="🔇" text="silent for exactly the child it existed to teach" tone="danger" opacity={b3} />
          <CaptionBand y={646} text="So it fell silent for exactly the child it existed to teach." tone="danger" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : real write-up, one curriculum lookup for every subject ---------------- */}
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `translateX(${slide4}px)` }}>
            <FilterChip x={660} y={72} text="Cloudflare Workers" icon="⚡" opacity={b4} />
            <LiveWindow
              file={shots}
              shot="detail"
              title="vitalii.no/features/…-b51"
              from={447}
              hold={166}
              opacity={b4}
              win={{ x: 660, y: 110, w: 560, h: 330 }}
            />
            <StatPill x={660} y={455} emoji="🗂" text="one lookup, whole week's unit" tone="success" opacity={b4} />
          </div>
          <CaptionBand y={646} text="Every subject now builds from the week's own curriculum plan." tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : the real hub, all four subjects on one plan ---------------- */}
        <Group opacity={b5}>
          {hero("4/4", undefined, "SUBJECTS ON THE SAME WEEKLY PLAN", P.success, heroPop5)}
          <CheckBadge x={790} y={18} size={44} opacity={b5} scale={heroPop5} />
          <LiveWindow
            file={shots}
            shot="hub"
            title="vitalii.no/features"
            from={606}
            hold={230}
            opacity={b5}
            win={{ x: 300, y: 110, w: 940, h: 433 }}
          />
          <StatPill x={300} y={553} emoji="🌙" text="even for the kid who never turns it on" tone="success" opacity={b5} />
          <CaptionBand y={646} text="All four subjects now teach from that same weekly plan." tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
