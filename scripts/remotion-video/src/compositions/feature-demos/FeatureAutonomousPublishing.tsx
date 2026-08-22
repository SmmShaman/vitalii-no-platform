/**
 * FeatureAutonomousPublishing — feature p20 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a checklist-style browser mockup,
 * an animated 4-step pipeline chain, and a big before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — every article needs 4 manual actions (image, rewrite ×3,
 *     publish, post); 10-15 articles a day means 40-60 repetitive taps. Red zone.
 *  2. Solution — one function chains all 4 steps end to end: DALL-E 3 image →
 *     Claude 3 Haiku rewrite (3 languages) → website → social ×4. 8+ manual
 *     pings become 4 automated status updates.
 *  3. How it stays controlled — source_config toggles auto/manual per
 *     source, schedule-publisher paces timing windows and cadence, and
 *     rate limits are respected on every platform.
 *  4. Result — before/after cards: 8+ pings · 15 min → 4 pings · 2 min,
 *     87% faster. Green zone, check badge.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  IconCard,
  FlowArrow,
  StickyNote,
  StatPill,
  CheckBadge,
  CaptionBand,
  BrowserWindow,
  SkeletonScroll,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const CHAIN = [
  { x: 80, emoji: "🎨", title: "DALL-E 3", sub: "image generated" },
  { x: 380, emoji: "🌍", title: "Claude 3 Haiku", sub: "rewritten × 3 languages" },
  { x: 680, emoji: "🌐", title: "Website", sub: "published live" },
  { x: 980, emoji: "📢", title: "Social ×4", sub: "Telegram · X · LinkedIn · FB" },
];

const CONTROL = [
  { emoji: "🎛️", title: "source_config table", sub: "full auto or manual, per source", tone: "accent" as const },
  { emoji: "🕒", title: "schedule-publisher", sub: "timing windows & cadence", tone: "accent" as const },
  { emoji: "🔁", title: "Rate limits respected", sub: "across every platform", tone: "success" as const },
];

export const FeatureAutonomousPublishing: React.FC = () => {
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
  const scroll = frame * 2.0;
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution — the pipeline chain ──────────────────────
  const cardPop = [pop(134), pop(150), pop(166), pop(182)];
  const arr1 = seg(frame, 142, 158, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 158, 174, Easing.inOut(Easing.cubic));
  const arr3 = seg(frame, 174, 190, Easing.inOut(Easing.cubic));
  const zeroTouch = pop(120);
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays controlled ───────────────────────────────
  const card1 = pop(252);
  const card2 = pop(272);
  const card3 = pop(292);
  const carr1 = seg(frame, 262, 278, Easing.inOut(Easing.cubic));
  const carr2 = seg(frame, 282, 298, Easing.inOut(Easing.cubic));
  const cap3 = seg(frame, 300, 316, Easing.out(Easing.cubic));

  // ── Beat 4: the result ────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const pct = Math.round(interpolate(frame, [384, 414], [1, 87], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Every article needs" accentText="4 manual actions" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="publishing queue — 12 articles waiting" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="New article: generate image → rewrite in 3 languages → publish site → post to socials. Repeat 10-15 times, every day."
        />
        <StatPill x={846} y={340} emoji="🖱️" text="4 manual actions per article" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="📰" text="10-15 articles a day" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😫" text="40-60 taps, every single day" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="The same four steps, tapped out by hand, for every article, every day" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="One function chains" accentText="all 4 steps" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <StatPill x={520} y={128} emoji="⚡" text="Zero manual taps" tone="success" scale={zeroTouch} opacity={Math.min(1, zeroTouch)} />
        {CHAIN.map((c, i) => (
          <IconCard key={c.title} x={c.x} y={210} w={220} emoji={c.emoji} title={c.title} sub={c.sub} tone="accent" scale={cardPop[i]} opacity={Math.min(1, cardPop[i])} />
        ))}
        <FlowArrow x={300} y={254} len={80} progress={arr1} />
        <FlowArrow x={600} y={254} len={80} progress={arr2} />
        <FlowArrow x={900} y={254} len={80} progress={arr3} color={B.success} />
        <CaptionBand
          text="auto-publish-news chains DALL-E 3 → Claude 3 Haiku → website → social — 8+ manual pings become 4 automated updates"
          tone="accent"
          opacity={cap2}
        />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS CONTROLLED ════ */}
      <Group opacity={b3}>
        <Headline text="And it stays" accentText="under control" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji={CONTROL[0].emoji} title={CONTROL[0].title} sub={CONTROL[0].sub} tone={CONTROL[0].tone} scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji={CONTROL[1].emoji} title={CONTROL[1].title} sub={CONTROL[1].sub} tone={CONTROL[1].tone} scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji={CONTROL[2].emoji} title={CONTROL[2].title} sub={CONTROL[2].sub} tone={CONTROL[2].tone} scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={carr1} />
        <FlowArrow x={792} y={262} len={76} progress={carr2} color={B.success} />
        <CaptionBand
          text="source_config and schedule-publisher keep automation controlled, not chaotic"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>8+ pings</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>~15 minutes, fully manual</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>4 pings</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>~2 minutes, mostly automatic</div>
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
            Now a strategic exception reviewer — capacity limited only by API rate limits.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Autonomous Publishing · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
