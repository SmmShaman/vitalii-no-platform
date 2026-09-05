/**
 * FeatureTraceabilityScanner — feature p61 — 1280x720, 891 frames @ 30fps, VOICE-SYNCED.
 *
 * ART-DIRECTION REWRITE (2026-09-05). Archetype 7 "hero number" / mood "dawn".
 * One enormous morphing figure owns the frame from beat 1 onward — 100 features,
 * then 30 minutes per manual lookup, then 500+ commits to read for one answer,
 * then 0 minutes of digging once the Action runs, then the 95% payoff. Everything
 * else (feature grid, terminal scroll, diary pages, features.json, before/after
 * strip) is evidence staged around that number, never a competing centerpiece.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–165  "A hundred features. Five repos. And I couldn't remember where any of them came from."
 *  b2 174–345  "Verifying one feature meant fifteen to thirty minutes of digging through commit histories by hand."
 *  b3 354–490  "It was like reading a stranger's diary hoping to find the one page that mattered."
 *  b4 499–662  "A GitHub Action now scans every repo and links each feature straight to its commit."
 *  b5 671–846  "What took thirty minutes now takes seconds — investigation time down ninety-five percent." — holds to 891.
 *
 * Single tech name in the whole clip: GitHub Action (beat 4 chip only).
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  BrowserWindow,
  SkeletonScroll,
  Panel,
  StickyNote,
  FlowArrow,
  seg,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.dawn;

type FeatureRow = { name: string; repo: string };
const FEATURES: FeatureRow[] = [
  { name: "AI Creative Builder", repo: "vitalii-portfolio" },
  { name: "43 Edge Functions", repo: "vitalii-portfolio" },
  { name: "Feature Traceability", repo: "vitalii-portfolio" },
  { name: "Scheduled Publishing", repo: "vitalii-portfolio" },
  { name: "Time Zone Tamer", repo: "vitalii-portfolio" },
  { name: "Multi-Repo Discovery", repo: "vitalii-portfolio" },
  { name: "LinkedIn Image Upload", repo: "vitalii-portfolio" },
  { name: "MTKruto Video Bypass", repo: "vitalii-portfolio" },
  { name: "Two-Tier Screen Gate", repo: "boytasks" },
  { name: "Skyvern VPS Deploy", repo: "jobbot-no" },
];

const LINKED: { name: string; hash: string }[] = [
  { name: "AI Creative Builder", hash: "a1b2c3d" },
  { name: "43 Edge Functions", hash: "9f0e8d7" },
  { name: "Feature Traceability", hash: "4c5b6a1" },
  { name: "Scheduled Publishing", hash: "2d3e4f5" },
];

const DIARY_LINES = [0.72, 0.9, 0.58, 0.81, 0.68, 0.4, 0.85, 0.63];

const hero = (
  value: string,
  unit: string | undefined,
  label: string,
  color: string,
  scale: number
) => (
  <div
    style={{
      position: "absolute",
      left: 340,
      top: 30,
      width: 600,
      textAlign: "center",
      transform: `scale(${0.86 + 0.14 * Math.min(1, scale)})`,
      transformOrigin: "center top",
      fontFamily,
    }}
  >
    <div
      style={{
        fontSize: 232,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -6,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
      {unit ? <span style={{ fontSize: 232 * 0.32, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 10, fontSize: 21, fontWeight: 700, letterSpacing: 2.6, color: P.muted }}>{label}</div>
  </div>
);

export const FeatureTraceabilityScanner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 165, 181));
  const b2 = seg(frame, 174, 190) * (1 - seg(frame, 345, 361));
  const b3 = seg(frame, 354, 370) * (1 - seg(frame, 490, 506));
  const b4 = seg(frame, 499, 515) * (1 - seg(frame, 662, 678));
  const b5 = seg(frame, 671, 687); // holds full opacity through frame 891 — no fade-out

  const heroPop1 = pop(15);
  const heroPop2 = pop(174);
  const heroPop3 = pop(354);
  const heroPop4 = pop(499);
  const heroPop5 = pop(671);

  const b3Dy = interpolate(frame, [354, 386], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const b4Dy = interpolate(frame, [499, 531], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // beat 2: scrolling terminal + commit counter
  const scrollOffset = interpolate(frame, [190, 330], [0, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const commitN = Math.floor(
    interpolate(frame, [190, 330], [1, 47], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  // beat 3: the one diary line that matters lights up partway through
  const highlightOn = seg(frame, 424, 440);

  // beat 4: rows land one at a time, chip pops after them
  const rowReveal = (i: number) => seg(frame, 540 + i * 22, 556 + i * 22);
  const chipPop = pop(632);

  // beat 5: before/after strip + arrow draw
  const stripIn = seg(frame, 700, 720);
  const arrowProgress = interpolate(frame, [712, 748], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : the pile of unlinked features ---------------- */}
        <Group opacity={b1}>
          {hero("100", undefined, "FEATURES ACROSS 5 REPOS", P.danger, heroPop1)}
          <StatPill x={68} y={150} emoji="😩" text="no idea which repo" tone="danger" opacity={b1} />
          <StatPill x={862} y={150} emoji="🔍" text="15-30 min just to check" tone="danger" opacity={b1} />

          {FEATURES.map((f, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const cardW = 176;
            const gap = 16;
            const x0 = 168;
            const t = seg(frame, 40 + i * 10, 54 + i * 10);
            return (
              <div
                key={f.name}
                style={{
                  position: "absolute",
                  left: x0 + col * (cardW + gap),
                  top: 350 + row * 118,
                  width: cardW,
                  height: 102,
                  background: P.card,
                  border: `1.5px solid ${P.border}`,
                  borderRadius: 14,
                  boxShadow: "0 8px 20px rgba(22,35,63,0.08)",
                  opacity: t,
                  transform: `translateY(${(1 - t) * 14}px)`,
                  padding: "12px 14px",
                }}
              >
                <div style={{ fontSize: 22 }}>🧩</div>
                <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: P.ink, lineHeight: 1.25 }}>{f.name}</div>
                <div style={{ marginTop: 4, fontSize: 11.5, fontWeight: 600, color: P.muted }}>{f.repo}</div>
              </div>
            );
          })}
          <CaptionBand text="A hundred features, and no map back to where any of them live" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : fifteen to thirty minutes, by hand ---------------- */}
        <Group opacity={b2}>
          {hero("30", "MIN", "TO VERIFY ONE FEATURE, BY HAND", P.danger, heroPop2)}
          <StatPill x={68} y={150} emoji="📜" text="full commit history to read" tone="danger" opacity={b2} />
          <StatPill x={862} y={150} emoji="⏱" text="every single time" tone="danger" opacity={b2} />

          <div style={{ position: "absolute", left: 340, top: 320, width: 600, textAlign: "center", fontSize: 17, fontWeight: 700, color: P.muted }}>
            🧩 AI Creative Builder — which repo? which commit?
          </div>

          <BrowserWindow x={340} y={356} w={600} h={230} title="terminal — git log">
            <SkeletonScroll w={600} h={230} offset={scrollOffset} />
          </BrowserWindow>
          <div
            style={{
              position: "absolute",
              left: 340 + 600 - 190,
              top: 356 + 14,
              padding: "6px 14px",
              borderRadius: 999,
              background: P.card,
              border: `1.5px solid ${P.border}`,
              fontSize: 13.5,
              fontWeight: 700,
              color: P.muted,
              zIndex: 2,
            }}
          >
            Commit {commitN} of 47
          </div>

          <CaptionBand text="Reading commit histories in five different places, one repo at a time" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : a stranger's diary ---------------- */}
        <Group opacity={b3} dy={b3Dy}>
          {hero("500", "+", "COMMITS TO READ FOR ONE ANSWER", P.amber, heroPop3)}
          <StatPill x={68} y={150} emoji="📔" text="hundreds of commits" tone="danger" opacity={b3} />
          <StatPill x={862} y={150} emoji="🎯" text="one that matters" tone="accent" opacity={b3} />

          <Panel x={190} y={340} w={430} h={280} tone="card">
            {DIARY_LINES.map((w, i) => (
              <div
                key={`l-${i}`}
                style={{
                  position: "absolute",
                  left: 26,
                  top: 30 + i * 30,
                  width: 430 * w - 52,
                  height: 11,
                  borderRadius: 6,
                  background: "#E3E9F2",
                }}
              />
            ))}
          </Panel>

          <Panel x={660} y={340} w={430} h={280} tone="card">
            {DIARY_LINES.map((w, i) => {
              const isTarget = i === 5;
              const glow = isTarget ? highlightOn : 0;
              return (
                <div
                  key={`r-${i}`}
                  style={{
                    position: "absolute",
                    left: 26,
                    top: 30 + i * 30,
                    width: 430 * w - 52,
                    height: 11,
                    borderRadius: 6,
                    background: isTarget ? `rgba(255,183,77,${0.35 + glow * 0.5})` : "#E3E9F2",
                    boxShadow: isTarget && glow > 0.2 ? `0 0 ${10 * glow}px rgba(255,183,77,0.7)` : "none",
                  }}
                />
              );
            })}
            <div
              style={{
                position: "absolute",
                left: 430 * DIARY_LINES[5],
                top: 30 + 5 * 30 - 20,
                fontSize: 26,
                opacity: highlightOn,
                transform: `translateX(${(1 - highlightOn) * 16}px)`,
              }}
            >
              🎯
            </div>
          </Panel>

          <CaptionBand text="Like reading a stranger's diary hoping one page has the answer" tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : one Action links every feature ---------------- */}
        <Group opacity={b4} dy={b4Dy}>
          {hero("0", undefined, "MANUAL DIGGING NEEDED NOW", P.accent, heroPop4)}
          <StatPill x={68} y={150} emoji="🔗" text="every feature linked" tone="accent" opacity={b4} />
          <StatPill x={862} y={150} emoji="🔧" text="manual override when needed" tone="accent" opacity={b4} />

          <BrowserWindow x={310} y={330} w={620} h={260} title="features.json — auto-generated">
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%" }}>
              {LINKED.map((f, i) => (
                <div
                  key={f.name}
                  style={{
                    position: "absolute",
                    left: 20,
                    right: 20,
                    top: 16 + i * 52,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 15.5,
                    opacity: rowReveal(i),
                    transform: `translateX(${(1 - rowReveal(i)) * 18}px)`,
                  }}
                >
                  <span style={{ fontWeight: 700, color: P.ink }}>{f.name}</span>
                  <span style={{ color: P.accent, fontWeight: 700 }}>🔗 {f.hash}</span>
                </div>
              ))}
            </div>
          </BrowserWindow>

          <FilterChip x={470} y={606} text="GitHub Action" icon="⚙" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />

          <StickyNote
            x={950}
            y={330}
            w={280}
            rotate={6}
            text="🔧 FeatureAdminPanel catches edge cases — 10+ manual overrides, data stays 100% accurate"
          />

          <CaptionBand text="One GitHub Action scans every repo, links every feature to its commit" tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : ninety-five percent ---------------- */}
        <Group opacity={b5}>
          {hero("95", "%", "LESS INVESTIGATION TIME", P.success, heroPop5)}
          <StatPill x={68} y={150} emoji="✅" text="100% auditable" tone="success" opacity={b5} />
          <StatPill x={862} y={150} emoji="⚡" text="seconds, not minutes" tone="success" opacity={b5} />
          <CheckBadge x={880} y={70} size={48} opacity={b5} scale={heroPop5} />

          <div style={{ position: "absolute", left: 340, top: 500, width: 600, opacity: stripIn }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: P.danger }}>30 MIN</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: P.muted, letterSpacing: 1 }}>MANUAL DIGGING</div>
              </div>
              <FlowArrow x={0} y={-2} len={110} progress={arrowProgress} color={P.success} opacity={stripIn} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 34, fontWeight: 800, color: P.success }}>3 SEC</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: P.muted, letterSpacing: 1 }}>ONE CLICK</div>
              </div>
            </div>
          </div>

          <CaptionBand text="Every feature, one click from its commit" tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
