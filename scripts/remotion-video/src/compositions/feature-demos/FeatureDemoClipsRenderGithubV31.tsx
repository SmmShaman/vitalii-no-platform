/**
 * FeatureDemoClipsRenderGithubV31 — feature v31 — 1280x720, 941 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 2 (zoom-in), mood mint. One "window" — drawn for the first two
 * beats, a real recording for the last three — sits centered on the same
 * bottom edge (626px) and grows on every beat: 380x230 -> 560x300 -> 760x400
 * -> 940x456 -> 1080x476. The camera pushes in on a single object across the
 * whole clip; nothing crossfades out and back in on its own, the growth IS
 * the beat-to-beat transition. Beats 1-2 are invisible plumbing (an idle
 * laptop, a stuck container) and stay drawn; beats 3-5 are the real GitHub
 * Actions run and the feature's own page, played from shots/v31.json.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–191  "Making one of these clips used to mean a laptop had to stay awake all night running tools nothing else needed."
 *  b2 200–381  "Timing the voice needed those same tools, so an unattended process in a bare container was stuck."
 *  b3 390–561  "Now GitHub Actions measures the voice from the script already written — no laptop required."
 *  b4 570–743  "A second run rebuilds that voice and refuses to render if it drifts past six frames."
 *  b5 752–896  "Two clips have now rendered this way, start to finish, PC switched off." — holds to 941.
 *
 * Single tech name in the whole clip: GitHub Action (beat 3 chip only).
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  Group,
  LightBg,
  BrowserWindow,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/v31.json";

const P = MOODS.mint;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// The one growing window — same bottom edge (626), bigger every beat.
// Centered horizontally, sized to actually fill the 1280x720 canvas instead
// of sitting small in the middle of empty background (fixed 2026-09-09 after
// the contact sheet showed beats 1-2 at under 20% of the frame).
const STAGE1: Win = { x: 300, y: 246, w: 680, h: 380 };
const STAGE2: Win = { x: 210, y: 216, w: 860, h: 410 };
const WIN3: Win = { x: 140, y: 196, w: 1000, h: 430 };
const WIN4: Win = { x: 80, y: 166, w: 1120, h: 460 };
const WIN5: Win = { x: 50, y: 146, w: 1180, h: 480 };

const TERMINAL_LINES = [
  "$ node record-ui.cjs p29",
  "$ node render.js p29 --concurrency=2",
  "rendering frame 812 / 900...",
  "muxing audio + video...",
  "uploading to R2...",
  "waiting on p30, p31...",
];

/** The hero number, fixed top-left slot; fontSize shrinks as the window's top margin does. */
const hero = (value: string, label: string, color: string, scale: number, fontSize = 112) => (
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
        fontSize,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -3,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
    <div style={{ marginTop: 6, fontSize: 15.5, fontWeight: 700, letterSpacing: 1.6, color: P.muted, maxWidth: 420 }}>
      {label}
    </div>
  </div>
);

export const FeatureDemoClipsRenderGithubV31: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 191, 207));
  const b2 = seg(frame, 200, 216) * (1 - seg(frame, 381, 397));
  const b3 = seg(frame, 390, 406) * (1 - seg(frame, 561, 577));
  const b4 = seg(frame, 570, 586) * (1 - seg(frame, 743, 759));
  const b5 = seg(frame, 752, 768); // holds through 941

  const heroPop1 = pop(15);
  const heroPop2 = pop(200);
  const heroPop3 = pop(390);
  const heroPop4 = pop(570);
  const heroPop5 = pop(752);
  const chipPop = pop(430);

  const settle = (start: number) =>
    interpolate(frame, [start, start + 32], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // beat 1: terminal lines type on, one by one, and the cursor blinks the whole time
  const lineIn = (i: number) => seg(frame, 15 + 30 + i * 16, 15 + 40 + i * 16);
  const cursorOn = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  // beat 2: the gear spins for 40 frames, then freezes mid-turn — stuck
  const gearAngle = interpolate(frame, [200, 240], [0, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stuckPulse = 0.55 + 0.35 * Math.sin(frame / 6);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : a laptop has to stay awake all night (drawn) ---------------- */}
        <Group opacity={b1} dy={settle(15)}>
          {hero("1", "LAPTOP HAD TO STAY UP ALL NIGHT", P.danger, heroPop1)}
          <StatPill x={690} y={52} emoji="🌙" text="running since 23:14" tone="danger" opacity={b1} />
          <StatPill x={690} y={112} emoji="🔌" text="screen has to stay on" tone="danger" opacity={b1} />
          <BrowserWindow x={STAGE1.x} y={STAGE1.y} w={STAGE1.w} h={STAGE1.h} title="render-feature-clip.sh — running" opacity={b1}>
            <div style={{ position: "absolute", inset: 0, background: "#12201A", padding: "12px 16px", fontFamily: "ui-monospace, Menlo, monospace" }}>
              {TERMINAL_LINES.map((line, i) => (
                <div
                  key={line}
                  style={{
                    fontSize: 11.5,
                    lineHeight: "17px",
                    color: i % 3 === 2 ? "#7FE0A8" : "#CFE7DA",
                    opacity: lineIn(i),
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {line}
                  {i === TERMINAL_LINES.length - 1 ? <span style={{ opacity: cursorOn }}>_</span> : null}
                </div>
              ))}
            </div>
          </BrowserWindow>
          <CaptionBand y={646} fontSize={21} text="All night, one laptop, running nothing but this" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : timing the voice needed the same tools — stuck (drawn) ---------------- */}
        <Group opacity={b2} dy={settle(200)}>
          {hero("0", "PROGRESS MADE WHILE STUCK", P.danger, heroPop2)}
          <StatPill x={690} y={52} emoji="🔒" text="unattended container" tone="danger" opacity={b2} />
          <StatPill x={690} y={112} emoji="🧊" text="frozen mid-job" tone="danger" opacity={b2} />
          <BrowserWindow x={STAGE2.x} y={STAGE2.y} w={STAGE2.w} h={STAGE2.h} title="container: voice-timing (unattended)" opacity={b2}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div style={{ fontSize: 64, transform: `rotate(${gearAngle}deg)` }}>⚙</div>
              <div
                style={{
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: P.dangerBg,
                  border: `1.5px solid ${P.dangerEdge}`,
                  color: P.danger,
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  opacity: stuckPulse,
                }}
              >
                STUCK
              </div>
              <div style={{ width: 260, height: 10, borderRadius: 6, background: "#D8E7DD", overflow: "hidden" }}>
                <div style={{ width: "42%", height: "100%", background: P.danger }} />
              </div>
            </div>
          </BrowserWindow>
          <CaptionBand y={646} fontSize={21} text="Timing the voice needed the same tools — stuck the moment nobody was watching" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : GitHub Actions measures the voice (real recording) ---------------- */}
        <Group opacity={b3} dy={settle(390)}>
          {hero("0", "LAPTOPS NEEDED — MEASURED IN THE CLOUD", P.success, heroPop3, 112)}
          <StatPill x={690} y={52} emoji="🤖" text="GitHub Actions runner" tone="success" opacity={b3} />
          <StatPill x={690} y={112} emoji="🎙" text="voice measured automatically" tone="success" opacity={b3} />
        </Group>
        <LiveWindow
          file={shots}
          shot="actions"
          title="github.com — Actions"
          from={390}
          hold={187}
          zoom={(t) => 1 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b3}
          win={WIN3}
        />
        <Group opacity={b3}>
          <FilterChip x={WIN3.x + WIN3.w - 230} y={WIN3.y + 42 + 14} text="GitHub Action" icon="⚙" color={P.success} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand y={646} fontSize={21} text="GitHub Actions measures the voice from the script already written" tone="success" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : a second run rebuilds it, six-frame tolerance (real recording) ---------------- */}
        <Group opacity={b4} dy={settle(570)}>
          {hero("6", "MAX FRAME DRIFT BEFORE IT STOPS", P.accent, heroPop4, 84)}
        </Group>
        <LiveWindow
          file={shots}
          shot="runs"
          title="github.com — Actions · run history"
          from={570}
          hold={189}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b4}
          win={WIN4}
        />
        <Group opacity={b4}>
          <CaptionBand y={646} fontSize={21} text="A second run rebuilds it and refuses to render past six frames of drift" tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : two clips rendered, PC off the whole time (real recording) ---------------- */}
        <Group opacity={b5} dy={settle(752)}>
          {hero("2", "CLIPS RENDERED, PC OFF THE WHOLE TIME", P.success, heroPop5, 65)}
          <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={heroPop5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-v31"
          from={752}
          hold={189}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
          win={WIN5}
        />
        <Group opacity={b5}>
          <CaptionBand y={646} fontSize={21} text="Two clips rendered this way already, start to finish, PC switched off" tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
