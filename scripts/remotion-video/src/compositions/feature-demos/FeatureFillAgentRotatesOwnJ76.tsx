/**
 * FeatureFillAgentRotatesOwnJ76 — feature j76 — 1280x720, 1057 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 7 "hero-number" (drawn by the orchestrating session, not re-drawn
 * here), mood dawn — same staging family as FeatureTraceabilityScannerLive.tsx
 * (p61): a big number sits top-left for the whole beat while a browser window
 * on the right carries either a real recording of the product or, for the two
 * beats with nothing on a screen to record (the crash count, the invisible
 * conversation growing in the background), a drawn visual instead.
 *
 * UI beats (3, 4, 5) play REAL recordings via LiveWindow, driven by
 * shots/j76.json: the watcher script's own commit, the archive/rotate
 * script's own commit, and the feature's own page. Beats 1-2 describe an
 * internal crash and an invisible growing transcript — nothing on a screen
 * to record — so they stay drawn.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–189  "An automated agent kept crashing mid-task, twice in one week, with nothing to show for it."
 *  b2 198–345  "Each time, its conversation history had quietly grown too large to think."
 *  b3 354–497  "Now it watches itself: a systemd timer checks in every five minutes."
 *  b4 506–754  "Like a whiteboard wiped clean before it overflows, it archives the old conversation and starts over, before failing, not after."
 *  b5 763–1012 "Both real crashes hit past 0.7 megabytes. The new threshold catches it at 0.25, twice as early." — holds to 1057.
 *
 * Single tech name in the whole clip: systemd timer (beat 3 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  BrowserWindow,
  FlowArrow,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, WIN_DEFAULT, WIN_BAR } from "./live-primitives";
import shots from "./shots/j76.json";

const P = MOODS.dawn;
const WIN = WIN_DEFAULT;
const BAR = WIN_BAR;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** The hero number, top-left, leaving the centre of the frame to the product. */
const hero = (value: string, unit: string | undefined, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      top: 34,
      width: 470,
      transform: `scale(${0.86 + 0.14 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div
      style={{
        fontSize: 112,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -4,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
      {unit ? <span style={{ fontSize: 112 * 0.34, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>{label}</div>
  </div>
);

export const FeatureFillAgentRotatesOwnJ76: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 189, 205));
  const b2 = seg(frame, 198, 214) * (1 - seg(frame, 345, 361));
  const b3 = seg(frame, 354, 370) * (1 - seg(frame, 497, 513));
  const b4 = seg(frame, 506, 522) * (1 - seg(frame, 754, 770));
  const b5 = seg(frame, 763, 779); // holds through 1057, no fade-out

  const heroPop1 = pop(15);
  const heroPop2 = pop(198);
  const heroPop3 = pop(354);
  const heroPop4 = pop(506);
  const heroPop5 = pop(763);

  // beat 1: the second real crash lands partway through, echoing the first
  const crash2 = pop(90);

  // beat 2: the transcript size creeping up with no warning, ending on the real crash size
  const growT = interpolate(frame, [214, 330], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const growMb = (growT * 0.73).toFixed(2);

  // beat 3: the tech chip pops in once the recording has settled
  const chipPop = pop(410);

  // beat 4: the wipe-progress bar sweeping across, echoing "wiped clean"
  const wipePct = interpolate(frame, [530, 660], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  // beat 4 → beat 5 is a SLIDE, not a crossfade: the fix's window pushes
  // left while the result's window pushes in from the right.
  const b4exitX = interpolate(frame, [730, 754], [0, -60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const b5slideX = interpolate(frame, [763, 797], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // beat 5: before/after strip + arrow draw
  const stripIn = seg(frame, 900, 920);
  const arrowProgress = interpolate(frame, [912, 948], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : two real crashes, nothing to show for it ---------------- */}
        <Group opacity={b1}>
          {hero("2", undefined, "CRASHES IN ONE WEEK", P.danger, heroPop1)}
          <StatPill x={690} y={52} emoji="🧯" text="no code touched, nothing to show" tone="danger" opacity={b1} />
          <StatPill x={690} y={112} emoji="🌙" text="an always-on background agent" tone="danger" opacity={b1} />
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="fill-agent.log" opacity={b1}>
            <div style={{ position: "absolute", left: 40, top: 44, right: 40 }}>
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "18px 22px",
                    marginTop: i === 0 ? 0 : 20,
                    borderRadius: 14,
                    background: P.dangerBg,
                    border: `1.5px solid ${P.dangerEdge}`,
                    opacity: i === 0 ? 1 : crash2,
                    transform: `translateY(${i === 0 ? 0 : (1 - crash2) * 14}px)`,
                  }}
                >
                  <div style={{ fontSize: 26 }}>❌</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: P.danger }}>fill-agent crashed mid-task</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: P.muted, marginTop: 2 }}>
                      {i === 0 ? "run #1 · Tuesday 03:12" : "run #2 · Friday 02:47"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BrowserWindow>
          <CaptionBand y={664} fontSize={22} text="An automated agent kept crashing mid-task, twice in one week" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : the conversation grew too large to think, quietly ---------------- */}
        <Group opacity={b2}>
          {hero(growMb, "MB", "GROWING WITH NO WARNING", P.amber, heroPop2)}
          <StatPill x={690} y={52} emoji="📈" text="looked nowhere near dangerous" tone="danger" opacity={b2} />
          <StatPill x={690} y={112} emoji="🧠" text="quietly outgrew its own memory" tone="danger" opacity={b2} />
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="conversation history — size over time" opacity={b2}>
            <div style={{ position: "absolute", left: 60, top: 190, width: 860 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 10, borderRadius: 6, background: "#E3E9F2" }} />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 860 * growT,
                  height: 10,
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${P.amber}, ${P.danger})`,
                }}
              />
              <div style={{ position: "absolute", left: 0, top: 26, fontSize: 13, fontWeight: 700, color: P.muted }}>safe</div>
              <div style={{ position: "absolute", left: 800, top: 26, fontSize: 13, fontWeight: 700, color: P.danger }}>crash</div>
            </div>
          </BrowserWindow>
          <CaptionBand y={664} fontSize={22} text="Each time, its conversation history had quietly grown too large to think" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the real watcher, checking in every five minutes ---------------- */}
        <Group opacity={b3}>
          {hero("5", "MIN", "SELF-CHECK INTERVAL", P.accent, heroPop3)}
          <StatPill x={690} y={52} emoji="⏱" text="watches itself while idle" tone="accent" opacity={b3} />
          <StatPill x={690} y={112} emoji="🔍" text="measures only recent growth" tone="accent" opacity={b3} />
        </Group>
        <LiveWindow
          file={shots}
          shot="timer"
          title="github.com — commit 87443d8 · watcher script"
          from={354}
          hold={159}
          zoom={(t) => 1 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b3}
        />
        <Group opacity={b3}>
          <FilterChip x={WIN.x + WIN.w - 220} y={WIN.y + BAR + 14} text="systemd timer" icon="⏱" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand y={664} fontSize={22} text="Now it watches itself: a timer checks in every five minutes" tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : whiteboard wiped clean, archived before it fails ---------------- */}
        <Group opacity={b4}>
          <div style={{ transform: `translateX(${b4exitX}px)` }}>
            {hero("0", undefined, "MANUAL CLEANUP NEEDED", P.accent, heroPop4)}
            <StatPill x={690} y={52} emoji="🧹" text="archives the old conversation" tone="accent" opacity={b4} />
            <StatPill x={690} y={112} emoji="🔄" text="starts fresh before failing" tone="accent" opacity={b4} />
            <LiveWindow
              file={shots}
              shot="archive"
              title="github.com — commit f28763b · archive & rotate"
              from={506}
              hold={264}
              zoom={(t) => 1 + 0.1 * easeOut(t)}
              focus={{ x: 0.5, y: 0.35 }}
              opacity={b4}
            />
            <div
              style={{
                position: "absolute",
                left: WIN.x + WIN.w - 300,
                top: WIN.y + BAR + 14,
                padding: "8px 16px",
                borderRadius: 999,
                background: P.card,
                border: `1.5px solid ${P.accentEdge}`,
                fontSize: 14,
                fontWeight: 700,
                color: P.accent,
                boxShadow: "0 8px 20px rgba(22,35,63,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              🧽 wiping the old conversation clean
            </div>
            <div
              style={{
                position: "absolute",
                left: WIN.x + 40,
                top: WIN.y + WIN.h - 34,
                width: WIN.w - 80,
                height: 6,
                borderRadius: 3,
                background: "#E3E9F2",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, width: `${wipePct}%`, height: "100%", background: P.accent }} />
            </div>
            <CaptionBand
              y={664}
              fontSize={22}
              text="Like a whiteboard wiped clean before it overflows — it starts fresh before failing, not after"
              tone="accent"
              opacity={b4}
            />
          </div>
        </Group>

        {/* ---------------- beat 5 : the feature's own page, twice as early ---------------- */}
        <Group opacity={b5}>
          <div style={{ transform: `translateX(${b5slideX}px)` }}>
            {hero("2", "×", "EARLIER CATCH THAN EITHER CRASH", P.success, heroPop5)}
            <StatPill x={690} y={52} emoji="✅" text="before it fails, not after" tone="success" opacity={b5} />
            <StatPill x={690} y={112} emoji="🩺" text="checks in every five minutes" tone="success" opacity={b5} />
            <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={heroPop5} />
            <LiveWindow
              file={shots}
              shot="page"
              title="vitalii.no/features/…-j76"
              from={763}
              hold={294}
              zoom={(t) => 1 + 0.08 * easeInOut(t)}
              focus={{ x: 0.5, y: 0.4 }}
              opacity={b5}
            />
            <div
              style={{
                position: "absolute",
                left: WIN.x + WIN.w - 470,
                top: WIN.y + WIN.h - 112,
                width: 430,
                padding: "14px 18px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.96)",
                border: `1.5px solid ${P.successEdge}`,
                boxShadow: "0 14px 34px rgba(22,35,63,0.16)",
                opacity: stripIn,
                transform: `translateY(${(1 - stripIn) * 16}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: P.danger, whiteSpace: "nowrap" }}>0.7 MB</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>REAL CRASHES</div>
                </div>
                <div style={{ position: "relative", width: 90, height: 24, flexShrink: 0 }}>
                  <FlowArrow x={0} y={10} len={90} progress={arrowProgress} color={P.success} opacity={stripIn} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: P.success, whiteSpace: "nowrap" }}>0.25 MB</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>NEW THRESHOLD</div>
                </div>
              </div>
            </div>
            <CaptionBand y={664} fontSize={22} text="Both real crashes hit past 0.7 megabytes — the new threshold catches it at 0.25" tone="success" opacity={b5} />
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
