/**
 * FeatureVideoFactory — feature p08 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+mockup with plausible
 * pipeline data, a single "Generate" click, and a big before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — video earns 5-10x the reach of a text post, but a single clip
 *     takes 30-60 minutes to hand-edit; 5-10 articles land every day, so most
 *     never get a video at all. Red zone.
 *  2. Solution — one click on "Generate" and the rest runs itself: script
 *     written, voiceover recorded, video rendered, exported to two formats —
 *     shown as a real browser mockup with plausible counts (18 lines, 92 sec).
 *  3. How it stays reliable — writes the script + voice, renders the video,
 *     and never loses an article (falls back to raw text if a step fails).
 *     One small tech-credibility line (Remotion).
 *  4. Result — before/after cards: 45 min → 3 min, a 93% cut. Green zone,
 *     check badge, two ready-to-post formats every time.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  BrowserWindow,
  SkeletonScroll,
  FilterChip,
  ToggleSwitch,
  StatPill,
  IconCard,
  FlowArrow,
  StickyNote,
  Cursor,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

type StepRow = { icon: string; label: string; detail: string };

const STEPS: StepRow[] = [
  { icon: "📝", label: "Script generated", detail: "18 lines · 92 words" },
  { icon: "🎙️", label: "Voiceover recorded", detail: "92 sec · word-level captions" },
  { icon: "🎬", label: "Video rendered", detail: "subtitles + blurred background" },
  { icon: "📤", label: "Exported, two formats", detail: "1080×1920 and 1920×1080" },
];

/** Custom step list for the "auto render" mockup — same visual language as
 * the table primitives (card rows, ink/muted text) but shaped for a pipeline
 * instead of a data table. */
const StepsList: React.FC<{ w: number; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  frame,
  appearStart,
  stagger = 14,
}) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, fontFamily }}>
    {STEPS.map((s, i) => {
      const t = seg(frame, appearStart + i * stagger, appearStart + i * stagger + 12);
      return (
        <div
          key={s.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 22px",
            borderBottom: i < STEPS.length - 1 ? `1px solid ${B.border}` : "none",
            opacity: t,
            transform: `translateX(${(1 - t) * 26}px)`,
          }}
        >
          <div style={{ fontSize: 26 }}>{s.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: B.ink }}>{s.label}</div>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: B.muted, marginTop: 2 }}>{s.detail}</div>
          </div>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: B.successBg,
              border: `1.5px solid ${B.success}`,
              color: B.success,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              opacity: t,
            }}
          >
            ✓
          </div>
        </div>
      );
    })}
  </div>
);

export const FeatureVideoFactory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows ──────────────────────────────────────────────────
  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: the problem ───────────────────────────────────────────
  const scroll = frame * 2.2;
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const genBtnScale = pop(126);
  const genBtnOp = Math.min(1, genBtnScale);
  const cx = interpolate(frame, [124, 134, 150, 205], [700, 235, 235, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 134, 150, 205], [400, 152, 152, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 150, 163));
  const click = seg(frame, 134, 148, Easing.out(Easing.quad));

  const chip1 = pop(150);
  const chip2 = pop(162);
  const chip3 = pop(174);
  const chip4 = pop(186);
  const togOn = seg(frame, 200, 214, Easing.inOut(Easing.cubic));
  const togOp = seg(frame, 196, 208);
  const cap2 = seg(frame, 200, 216, Easing.out(Easing.cubic));
  const footNoteOp = seg(frame, 214, 228);

  // ── Beat 3: how it stays reliable ─────────────────────────────────
  const card1 = pop(252);
  const card2 = pop(272);
  const card3 = pop(292);
  const arr1 = seg(frame, 262, 278, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 282, 298, Easing.inOut(Easing.cubic));
  const cap3 = seg(frame, 300, 316, Easing.out(Easing.cubic));

  // ── Beat 4: the result ────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const pct = Math.round(
    interpolate(frame, [384, 414], [0, 93], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Great videos take" accentText="45 minutes each?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="content queue — 8 waiting for video" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: script, voiceover, subtitles and export — for every article, every day"
        />
        <StatPill x={846} y={340} emoji="⏱️" text="30-60 min per video" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="📰" text="5-10 new articles a day" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="🚫" text="Most never get made" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Video earns 5-10x more reach than text — but there's no time to make it" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Press start —" accentText="everything else is automatic" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={160} y={132} text="▶  Generate" icon="" scale={genBtnScale} opacity={genBtnOp * (1 - seg(frame, 150, 163))} color={B.accent} />
        <FilterChip x={340} y={132} text="Script" icon="✓" scale={chip1} opacity={Math.min(1, chip1)} color={B.success} />
        <FilterChip x={470} y={132} text="Voiceover" icon="✓" scale={chip2} opacity={Math.min(1, chip2)} color={B.success} />
        <FilterChip x={630} y={132} text="Render" icon="✓" scale={chip3} opacity={Math.min(1, chip3)} color={B.success} />
        <FilterChip x={780} y={132} text="Export" icon="✓" scale={chip4} opacity={Math.min(1, chip4)} color={B.success} />
        <ToggleSwitch x={960} y={138} label="Auto-publish" on={togOn} opacity={togOp} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="video factory — auto render" opacity={seg(frame, 152, 166)}>
          <StepsList w={1060} frame={frame} appearStart={156} stagger={14} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 300,
              width: 1060,
              textAlign: "center",
              fontSize: 15.5,
              fontWeight: 600,
              color: B.muted,
              opacity: footNoteOp * 0.9,
            }}
          >
            Exports both formats automatically — nothing left to edit by hand
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={click} />
        <CaptionBand text="Script, voiceover and video render themselves — you just press start" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS RELIABLE ════ */}
      <Group opacity={b3}>
        <Headline text="One pipeline," accentText="two ready-to-post formats" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="📝" title="Writes the script" sub="and a natural-sounding voiceover" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🎬" title="Renders the video" sub="subtitles, blur, progress bar" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🛟" title="Never loses an article" sub="falls back to raw text if a step fails" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: Remotion renders the subtitles, blur and progress bar"
          opacity={cap3}
          fontSize={21}
          y={580}
        />
      </Group>

      {/* ════ Beat 4 — RESULT ════ */}
      <Group opacity={b4}>
        <Headline text="The payoff" opacity={seg(frame, 344, 358)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>45 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>per video, start to finish</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>3 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>same steps, fully automatic</div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 424,
            width: 1280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            opacity: speedOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>{pct}% faster</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Two formats, ready to post — same quality, every single time.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>AI Video Factory · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
