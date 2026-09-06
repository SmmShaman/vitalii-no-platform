/**
 * FeatureTraceabilityScannerLive — feature p61 — 1280x720, 891 frames @ 30fps, VOICE-SYNCED.
 *
 * PILOT (2026-09-06): the same narration, the same beat windows and the same
 * "hero number" / dawn staging as FeatureTraceabilityScanner.tsx — but the
 * centre of every UI beat is a RECORDING OF THE REAL PRODUCT, not a drawn
 * mockup. The recordings are made by tools/record-ui.cjs from shots/p61.json
 * (one screenshot per frame of the live page, scroll and mouse computed from
 * the frame number, so there is no timeline drift) into public/rec/p61-<shot>.mp4:
 *
 *   hub      vitalii.no/features                        150 f   beat 1
 *   commits  github.com/…/vitalii-no-platform/commits    171 f   beat 2
 *   actions  github.com/…/actions/workflows/discover…    100 f   beat 4 (then frozen)
 *   page     vitalii.no/features/…-p61                   220 f   beat 5
 *
 * Beat 3 is a metaphor ("a stranger's diary") and has no UI, so it stays drawn.
 * The commit hashes in beat 4 are real rows from vitalii.no/api/features.
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
  Panel,
  FlowArrow,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveShot, WIN_DEFAULT, WIN_BAR } from "./live-primitives";
import shots from "./shots/p61.json";

const P = MOODS.dawn;

// The recordings: shots/p61.json is what tools/record-ui.cjs recorded, and
// LiveShot plays each one inside the window with a camera move.
const WIN = WIN_DEFAULT;
const BAR = WIN_BAR;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Real rows from vitalii.no/api/features (title · first commit), 2026-09-06.
const LINKED: { name: string; hash: string }[] = [
  { name: "Kiosk's Empty Week Fills In", hash: "516a87e" },
  { name: "Google Calendar, Mirrored Server-Side", hash: "2d54537" },
  { name: "Auto-Deploy Closes the Gap", hash: "093230c" },
  { name: "Boytasks Is Now Installable", hash: "71682b9" },
];

const DIARY_LINES = [0.72, 0.9, 0.58, 0.81, 0.68, 0.4, 0.85, 0.63];

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

export const FeatureTraceabilityScannerLive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 165, 181));
  const b2 = seg(frame, 174, 190) * (1 - seg(frame, 345, 361));
  const b3 = seg(frame, 354, 370) * (1 - seg(frame, 490, 506));
  const b4 = seg(frame, 499, 515) * (1 - seg(frame, 662, 678));
  const b5 = seg(frame, 671, 687); // holds through 891

  const heroPop1 = pop(15);
  const heroPop2 = pop(174);
  const heroPop3 = pop(354);
  const heroPop4 = pop(499);
  const heroPop5 = pop(671);

  // beat 2: how deep into the history the hand-search is
  const commitN = Math.floor(
    interpolate(frame, [190, 340], [1, 47], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  // beat 3: the one diary line that matters lights up partway through
  const highlightOn = seg(frame, 424, 440);

  // beat 4: the linked rows land over the Action list once it has settled
  const rowReveal = (i: number) => seg(frame, 584 + i * 12, 598 + i * 12);
  const panelIn = seg(frame, 578, 594);
  const chipPop = pop(636);

  // beat 5: before/after strip + arrow draw
  const stripIn = seg(frame, 720, 740);
  const arrowProgress = interpolate(frame, [732, 768], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : the real wall of features ---------------- */}
        <Group opacity={b1}>
          {hero("100", undefined, "FEATURES ACROSS 5 REPOS", P.danger, heroPop1)}
          <StatPill x={690} y={52} emoji="😩" text="no idea which repo" tone="danger" opacity={b1} />
          <StatPill x={690} y={112} emoji="🔍" text="15-30 min just to check" tone="danger" opacity={b1} />
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="vitalii.no/features" opacity={b1} />
        </Group>
        <LiveShot
          file={shots}
          shot="hub"
          from={15}
          hold={166}
          zoom={(t) => 1 + 0.16 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.45 }}
          opacity={b1}
        />
        <Group opacity={b1}>
          <CaptionBand y={664} fontSize={22} text="A hundred features, and no map back to where any of them live" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : the real commit history, by hand ---------------- */}
        <Group opacity={b2}>
          {hero("30", "MIN", "TO VERIFY ONE FEATURE, BY HAND", P.danger, heroPop2)}
          <StatPill x={690} y={52} emoji="📜" text="full commit history to read" tone="danger" opacity={b2} />
          <StatPill x={690} y={112} emoji="⏱" text="every single time" tone="danger" opacity={b2} />
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="github.com/SmmShaman/vitalii-no-platform — commits · main" opacity={b2} />
        </Group>
        <LiveShot
          file={shots}
          shot="commits"
          from={174}
          hold={172}
          zoom={(t) => 1.1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={b2}
        />
        <Group opacity={b2}>
          <div
            style={{
              position: "absolute",
              left: WIN.x + WIN.w - 200,
              top: WIN.y + BAR + 14,
              padding: "6px 14px",
              borderRadius: 999,
              background: P.card,
              border: `1.5px solid ${P.border}`,
              fontSize: 14,
              fontWeight: 700,
              color: P.danger,
              boxShadow: "0 8px 20px rgba(22,35,63,0.12)",
            }}
          >
            Commit {commitN} of 47 · still no answer
          </div>
          <CaptionBand y={664} fontSize={22} text="Reading commit histories in five different places, one repo at a time" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : a stranger's diary (metaphor, stays drawn) ---------------- */}
        <Group opacity={b3} dy={interpolate(frame, [354, 386], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}>
          {hero("500", "+", "COMMITS TO READ FOR ONE ANSWER", P.amber, heroPop3)}
          <StatPill x={690} y={52} emoji="📔" text="hundreds of commits" tone="danger" opacity={b3} />
          <StatPill x={690} y={112} emoji="🎯" text="one that matters" tone="accent" opacity={b3} />

          <Panel x={190} y={300} w={430} h={300} tone="card">
            {DIARY_LINES.map((w, i) => (
              <div
                key={`l-${i}`}
                style={{
                  position: "absolute",
                  left: 26,
                  top: 34 + i * 32,
                  width: 430 * w - 52,
                  height: 11,
                  borderRadius: 6,
                  background: "#E3E9F2",
                }}
              />
            ))}
          </Panel>
          <Panel x={660} y={300} w={430} h={300} tone="card">
            {DIARY_LINES.map((w, i) => {
              const isTarget = i === 5;
              const glow = isTarget ? highlightOn : 0;
              return (
                <div
                  key={`r-${i}`}
                  style={{
                    position: "absolute",
                    left: 26,
                    top: 34 + i * 32,
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
                top: 34 + 5 * 32 - 20,
                fontSize: 26,
                opacity: highlightOn,
                transform: `translateX(${(1 - highlightOn) * 16}px)`,
              }}
            >
              🎯
            </div>
          </Panel>
          <CaptionBand y={664} fontSize={22} text="Like reading a stranger's diary hoping one page has the answer" tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : the real Action, and the rows it links ---------------- */}
        <Group opacity={b4} dy={interpolate(frame, [499, 531], [36, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}>
          {hero("0", undefined, "MANUAL DIGGING NEEDED NOW", P.accent, heroPop4)}
          <StatPill x={690} y={52} emoji="🔗" text="every feature linked" tone="accent" opacity={b4} />
          <StatPill x={690} y={112} emoji="🔧" text="manual override when needed" tone="accent" opacity={b4} />
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="github.com — Actions · Discover Features, every night" opacity={b4} />
        </Group>
        <LiveShot
          file={shots}
          shot="actions"
          from={499}
          hold={164}
          zoom={(t) => 1 + 0.08 * easeOut(t)}
          focus={{ x: 0, y: 0.3 }}
          opacity={b4}
        />
        <Group opacity={b4}>
          <div
            style={{
              position: "absolute",
              left: WIN.x + WIN.w - 420,
              top: WIN.y + BAR + 60,
              width: 380,
              padding: "14px 18px 10px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.96)",
              border: `1.5px solid ${P.accentEdge}`,
              boxShadow: "0 14px 34px rgba(22,35,63,0.16)",
              opacity: panelIn,
              transform: `translateY(${(1 - panelIn) * 18}px)`,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: P.muted }}>LINKED BY THE ACTION</div>
            {LINKED.map((f, i) => (
              <div
                key={f.hash}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  marginTop: i === 0 ? 10 : 8,
                  fontSize: 14.5,
                  opacity: rowReveal(i),
                  transform: `translateX(${(1 - rowReveal(i)) * 18}px)`,
                }}
              >
                <span style={{ fontWeight: 700, color: P.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                <span style={{ color: P.accent, fontWeight: 700, fontFamily: "ui-monospace, Menlo, monospace", flexShrink: 0 }}>🔗 {f.hash}</span>
              </div>
            ))}
          </div>
          <FilterChip x={WIN.x + WIN.w - 210} y={WIN.y + BAR + 14} text="GitHub Action" icon="⚙" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand y={664} fontSize={22} text="One GitHub Action scans every repo, links every feature to its commit" tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : the feature's own page, ninety-five percent ---------------- */}
        <Group opacity={b5}>
          {hero("95", "%", "LESS INVESTIGATION TIME", P.success, heroPop5)}
          <StatPill x={690} y={52} emoji="✅" text="100% auditable" tone="success" opacity={b5} />
          <StatPill x={690} y={112} emoji="⚡" text="seconds, not minutes" tone="success" opacity={b5} />
          <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={heroPop5} />
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="vitalii.no/features/feature-traceability-…-p61" opacity={b5} />
        </Group>
        <LiveShot
          file={shots}
          shot="page"
          from={671}
          hold={220}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
        />
        <Group opacity={b5}>
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
                <div style={{ fontSize: 30, fontWeight: 800, color: P.danger, whiteSpace: "nowrap" }}>30 MIN</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>MANUAL DIGGING</div>
              </div>
              <div style={{ position: "relative", width: 90, height: 24, flexShrink: 0 }}>
                <FlowArrow x={0} y={10} len={90} progress={arrowProgress} color={P.success} opacity={stripIn} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: P.success, whiteSpace: "nowrap" }}>3 SEC</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>ONE CLICK</div>
              </div>
            </div>
          </div>
          <CaptionBand y={664} fontSize={22} text="Every feature, one click from its commit" tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
