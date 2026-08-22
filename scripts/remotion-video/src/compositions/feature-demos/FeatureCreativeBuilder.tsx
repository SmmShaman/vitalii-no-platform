/**
 * FeatureCreativeBuilder — feature p19 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real "tap-based menu" mockup, an
 * icon strip for how the taps become a real prompt, and a big before→after
 * metric.
 *
 * Story (4 beats):
 *  1. Problem — vague feedback like "more corporate" or "warmer colors" isn't
 *     a prompt a model can use; moderators regenerate again and again, 2+
 *     hours of trial and error every day. Red zone.
 *  2. Solution — a 7-category, 6-option tap menu: pick "Color", then pick
 *     "Warm" — no typing, ever. A cursor taps through both steps.
 *  3. How it works — 42 no-code elements, cb_gen compiles every tap into one
 *     real prompt, Azure OpenAI draws the image.
 *  4. Result — before/after cards: 2 hours of trial and error → 15 minutes,
 *     an 87% drop. Green zone, check badge.
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
  FilterChip,
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

export const FeatureCreativeBuilder: React.FC = () => {
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
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);
  const regenPulse = 0.85 + 0.15 * Math.sin(frame / 6);

  // ── Beat 2: the solution — tap a category, then an option ─────────
  const bubbleOp = seg(frame, 120, 134, Easing.out(Easing.cubic));
  const stepHubOp = seg(frame, 132, 148) * (1 - seg(frame, 172, 188));
  const stepOptOp = seg(frame, 172, 188) * (1 - seg(frame, 214, 226));
  const cx = interpolate(frame, [124, 150, 190, 214], [700, 460, 190, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 150, 190, 214], [500, 324, 324, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 214, 224));
  const click1 = seg(frame, 150, 162, Easing.out(Easing.quad));
  const click2 = seg(frame, 190, 202, Easing.out(Easing.quad));
  const cap2 = seg(frame, 204, 220, Easing.out(Easing.cubic)) * (1 - seg(frame, 228, 240));

  // ── Beat 3: how it works ───────────────────────────────────────────
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
  const check = pop(392);
  const resultOp = seg(frame, 388, 404, Easing.out(Easing.cubic));
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Turn " accentText='"warmer colors" into a real prompt?' accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="Image review — needs work" opacity={Math.min(1, pop(8))}>
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 40,
              width: 400,
              height: 250,
              borderRadius: 18,
              background: "linear-gradient(135deg, #E3E9F2, #F4F7FC)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 68,
              opacity: regenPulse,
            }}
          >
            🖼️
          </div>
          <div style={{ position: "absolute", left: 0, top: 306, width: 700, textAlign: "center", fontSize: 16, fontWeight: 600, color: B.muted, fontFamily }}>
            AI-generated image — attempt after attempt
          </div>
          <FilterChip x={270} y={344} text="🔄 Regenerate again" icon="" opacity={0.95} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text={'Feedback so far: "more corporate", "needs to feel warmer", "just... try again"'}
        />
        <StatPill x={846} y={340} emoji="🔄" text="Regenerate, again and again" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="🗣️" text="Vague feedback, no real prompt" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="⏱️" text="2+ hours of trial and error, daily" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Moderators know what looks right — but can't write a prompt for it" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Tap it into" accentText="a real prompt" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <Panel x={110} y={196} w={1060} h={280} tone="accent" opacity={bubbleOp}>
          <div style={{ position: "absolute", left: 30, top: 22, fontSize: 20, fontWeight: 700, color: B.ink, fontFamily }}>
            🎨 Creative Builder — cb_hub
          </div>
          <div style={{ position: "absolute", left: 30, top: 54, fontSize: 15, fontWeight: 600, color: B.muted, fontFamily }}>
            7 categories, 6 options each — no typing, ever
          </div>
          <div style={{ position: "absolute", left: 30, top: 100, fontSize: 16.5, fontWeight: 700, color: B.accent, opacity: stepHubOp, fontFamily }}>
            Step 1 — pick a category
          </div>
          <div style={{ position: "absolute", left: 30, top: 100, fontSize: 16.5, fontWeight: 700, color: B.accent, opacity: stepOptOp, fontFamily }}>
            Step 2 — pick an option for "Color"
          </div>
          <FilterChip x={30} y={140} text="Mood" icon="" opacity={stepHubOp} />
          <FilterChip x={165} y={140} text="Style" icon="" opacity={stepHubOp} />
          <FilterChip x={300} y={140} text="Color" icon="" opacity={stepHubOp} color={B.success} />
          <FilterChip x={435} y={140} text="Lighting" icon="" opacity={stepHubOp} />
          <FilterChip x={570} y={140} text="Composition" icon="" opacity={stepHubOp} />
          <FilterChip x={730} y={140} text="Subject" icon="" opacity={stepHubOp} />
          <FilterChip x={880} y={140} text="Background" icon="" opacity={stepHubOp} />
          <FilterChip x={30} y={140} text="Warm" icon="" opacity={stepOptOp} color={B.success} />
          <FilterChip x={190} y={140} text="Cool" icon="" opacity={stepOptOp} />
          <FilterChip x={330} y={140} text="Pastel" icon="" opacity={stepOptOp} />
          <FilterChip x={480} y={140} text="Bold" icon="" opacity={stepOptOp} />
          <FilterChip x={630} y={140} text="Monochrome" icon="" opacity={stepOptOp} />
          <FilterChip x={820} y={140} text="Vivid" icon="" opacity={stepOptOp} />
          <div style={{ position: "absolute", left: 30, top: 220, fontSize: 14.5, fontWeight: 600, color: B.muted, opacity: Math.max(stepHubOp, stepOptOp) * 0.85, fontFamily }}>
            Every tap saves straight to session state — nothing to type, nothing to lose
          </div>
        </Panel>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1)} />
        <CaptionBand text='Category, then option — "Color" → "Warm" — no prompt engineering needed' tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="Every tap becomes" accentText="part of the image" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🗂️" title="42 elements, no-code" sub="editable anytime in creative_elements" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🧩" title="cb_gen compiles it all" sub="taps + article details → one prompt" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🎨" title="Azure OpenAI draws it" sub="on-brand, every single time" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Taste, translated automatically into a prompt a model can actually use"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>2 hours</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>of trial and error, per article</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>15 minutes</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>42 taps, one clear prompt</div>
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
            opacity: resultOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 48, fontWeight: 800, color: B.success }}>87% less iteration time</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Non-technical moderators, real creative control.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Creative Builder · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
