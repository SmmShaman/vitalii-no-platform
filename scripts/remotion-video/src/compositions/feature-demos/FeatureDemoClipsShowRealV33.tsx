/**
 * FeatureDemoClipsShowRealV33 — feature v33 — 1280x720, 989 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 4 (flow-map), mood dawn. Beat 3 is the flow-map proper: three
 * small recordings of the real sources (commit history, live Actions runs,
 * the site itself) converge through one hub — the single tech name in this
 * clip, Playwright — into one output. Beats 2 and 5 play recordings of the
 * real product via LiveWindow (shots/v33.json); beats 1 and 4 are drawn
 * (comparison / mechanism, no UI to record).
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–167  "My feature demo clips looked close to the real product — but a redrawn screen isn't it."
 *  b2 176–363  "Compared side by side against a real recording, the hand-drawn version was obviously the weaker copy."
 *  b3 372–571  "So every interface beat plays a Playwright recording — commit history, live runs, the site itself."
 *  b4 580–776  "The old built-in video capture drifted one-point-one times off the clock, walking narration off the picture."
 *  b5 785–944  "Now it's one screenshot per frame — locked exactly to the voice, with zero drift." — holds to 989.
 *
 * Single tech name in the whole clip: Playwright (beat 3 chip only).
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  BrowserWindow,
  SkeletonScroll,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  FlowArrow,
  IconCard,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/v33.json";

const P = MOODS.dawn;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const RIGHT_WIN: Win = { x: 680, y: 170, w: 560, h: 380 };
const SRC1: Win = { x: 36, y: 78, w: 300, h: 172 };
const SRC2: Win = { x: 36, y: 264, w: 300, h: 172 };
const SRC3: Win = { x: 36, y: 450, w: 300, h: 172 };
const PAGE_WIN: Win = { x: 150, y: 196, w: 980, h: 450 };

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

export const FeatureDemoClipsShowRealV33: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 167, 183));
  const b2 = seg(frame, 176, 192) * (1 - seg(frame, 363, 379));
  const b3 = seg(frame, 372, 388) * (1 - seg(frame, 571, 587));
  const b4 = seg(frame, 580, 596) * (1 - seg(frame, 776, 792));
  const b5 = seg(frame, 785, 801); // holds through 989

  const heroPop1 = pop(15);
  const heroPop4 = pop(580);
  const heroPop5 = pop(785);

  // beat 2: the hand-drawn skeleton scrolling under the real capture
  const scrollOffset = interpolate(frame, [192, 360], [0, 640], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // beat 3: the flow-map — sources merge into the hub, hub feeds the output
  const slideIn3 = interpolate(frame, [372, 404], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mergeProgress = interpolate(frame, [396, 432], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outProgress = interpolate(frame, [432, 468], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chipPop = pop(452);

  // beat 4: the 1.1x drift, drawn as two timelines pulling apart
  const barLen = 900;
  const driftProgress = interpolate(frame, [596, 760], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const voiceLen = barLen * driftProgress;
  const captureLen = Math.min(barLen, barLen * driftProgress * 1.1);
  const gapLabel = seg(frame, 700, 724);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : redrawn vs real (problem, drawn) ---------------- */}
        <Group opacity={b1}>
          <Headline y={50} text="Looked right." accentText="Wasn't the real thing." accentColor={P.danger} opacity={b1} />
          <IconCard x={195} y={210} w={380} emoji="🖥" title="The real product" sub="what a viewer actually sees" tone="accent" opacity={b1} scale={heroPop1} />
          <IconCard x={705} y={210} w={380} emoji="📝" title="A redrawn copy" sub="close, but not it" tone="danger" opacity={b1} scale={heroPop1} />
          <div style={{ position: "absolute", left: 600, top: 248, fontSize: 60, fontWeight: 800, color: P.danger, opacity: b1 }}>≠</div>
          <StatPill x={150} y={560} emoji="👁" text="Looks right. Isn't real." tone="danger" opacity={b1} />
          <CaptionBand y={646} text="A redrawn screen isn't the real thing" tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : side by side against a real recording ---------------- */}
        <Group opacity={b2}>
          <Headline y={40} text="Side by side, one of them is real." opacity={b2} fontSize={30} />
          <BrowserWindow x={40} y={170} w={560} h={380} title="hand-drawn recreation" opacity={b2}>
            <SkeletonScroll w={560} h={338} offset={scrollOffset} />
          </BrowserWindow>
          <div style={{ position: "absolute", left: 612, top: 340, fontSize: 28, fontWeight: 800, color: P.muted, opacity: b2 }}>VS</div>
          <StatPill x={40} y={566} emoji="📝" text="mockup" tone="danger" opacity={b2} />
          <StatPill x={900} y={566} emoji="✅" text="real capture" tone="success" opacity={b2} />
          <CaptionBand y={646} text="Compared side by side, the real recording won" tone="success" opacity={b2} />
        </Group>
        <LiveWindow
          file={shots}
          shot="hub"
          title="vitalii.no/features"
          from={176}
          hold={203}
          zoom={(t) => 1 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b2}
          win={RIGHT_WIN}
        />

        {/* ---------------- beat 3 : the flow-map — every source, one recording each ---------------- */}
        <Group opacity={b3} dy={slideIn3}>
          <Headline y={30} text="One system records everything." opacity={b3} fontSize={26} />
        </Group>
        <LiveWindow file={shots} shot="commits" title="commit history" from={372} hold={215} zoom={(t) => 1 + 0.05 * easeInOut(t)} focus={{ x: 0.5, y: 0.4 }} opacity={b3} win={SRC1} />
        <LiveWindow file={shots} shot="actions" title="live runs" from={372} hold={215} zoom={(t) => 1 + 0.05 * easeInOut(t)} focus={{ x: 0.5, y: 0.4 }} opacity={b3} win={SRC2} />
        <LiveWindow file={shots} shot="page-mini" title="the site itself" from={372} hold={215} zoom={(t) => 1 + 0.05 * easeInOut(t)} focus={{ x: 0.5, y: 0.4 }} opacity={b3} win={SRC3} />
        <Group opacity={b3}>
          <div
            style={{
              position: "absolute",
              left: 336,
              top: 78,
              width: 3,
              height: 544,
              background: P.accent,
              opacity: mergeProgress,
              borderRadius: 2,
            }}
          />
          <FlowArrow x={339} y={347} len={84} progress={mergeProgress} color={P.accent} opacity={b3} />
          <Panel x={423} y={264} w={210} h={172} tone="accent" opacity={b3}>
            <div style={{ textAlign: "center", paddingTop: 92, fontSize: 14, fontWeight: 600, color: P.muted }}>
              records every beat
            </div>
          </Panel>
          <FilterChip x={448} y={288} text="Playwright" icon="🎭" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <FlowArrow x={633} y={347} len={90} progress={outProgress} color={P.accent} opacity={b3} />
          <Panel x={723} y={170} w={400} h={380} tone="card" opacity={b3}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 14, opacity: outProgress }}>
              <div style={{ fontSize: 64 }}>🎬</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: P.ink, textAlign: "center" }}>Recorded, not redrawn</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: P.accent, textAlign: "center", padding: "0 30px" }}>
                every UI beat is a real capture
              </div>
            </div>
          </Panel>
          <CaptionBand y={646} text="Commit history, live runs, the site itself — one recording of each" tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : the drift, and why not the built-in capture (drawn) ---------------- */}
        <Group opacity={b4}>
          {hero("1.1", "×", "TIMELINE DRIFT, WALL CLOCK VS CAPTURE", P.danger, heroPop4)}
          <StatPill x={690} y={52} emoji="😵" text="narration walks off the picture" tone="danger" opacity={b4} />
          <StatPill x={690} y={112} emoji="⏱" text="drifts more with every beat" tone="danger" opacity={b4} />

          <div style={{ position: "absolute", left: 150, top: 330, width: voiceLen, height: 7, borderRadius: 4, background: P.accent }} />
          <div style={{ position: "absolute", left: 150 + voiceLen - 14, top: 316, fontSize: 15, fontWeight: 700, color: P.accent }}>VOICE</div>

          <div style={{ position: "absolute", left: 150, top: 400, width: captureLen, height: 7, borderRadius: 4, background: P.danger }} />
          <div style={{ position: "absolute", left: 150 + captureLen - 14, top: 414, fontSize: 15, fontWeight: 700, color: P.danger }}>OLD CAPTURE</div>

          <div
            style={{
              position: "absolute",
              left: 150 + Math.min(barLen, captureLen) + 20,
              top: 350,
              fontSize: 15,
              fontWeight: 700,
              color: P.danger,
              opacity: gapLabel,
            }}
          >
            gap keeps growing →
          </div>

          <CaptionBand y={646} text="The picture drifted, the words didn't" tone="danger" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : zero drift, locked to the voice ---------------- */}
        <Group opacity={b5}>
          {hero("0", undefined, "FRAMES OF DRIFT, LOCKED TO THE VOICE", P.success, heroPop5)}
          <StatPill x={690} y={52} emoji="🎬" text="one shot per frame" tone="success" opacity={b5} />
          <StatPill x={690} y={112} emoji="✅" text="zero timeline drift" tone="success" opacity={b5} />
          <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={heroPop5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-v33"
          from={785}
          hold={204}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
          win={PAGE_WIN}
        />
        <Group opacity={b5}>
          <CaptionBand y={646} text="Locked exactly to the voice, every time" tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
