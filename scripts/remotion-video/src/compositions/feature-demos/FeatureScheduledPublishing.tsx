/**
 * FeatureScheduledPublishing — feature p25 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real feed mockup showing a
 * "content wall", a spaced-out post timeline, and a big before→after panel.
 *
 * Story (4 beats):
 *  1. Problem — 10-15 articles a day, all posted at once; a feed wall of
 *     "Just now" posts; followers unfollow, the algorithm penalizes it,
 *     and staggering them by hand eats ~30 minutes daily. Red zone.
 *  2. Solution — posts are checked every 5 minutes and released one at a
 *     time, at least 60 seconds apart — a visible, evenly-spaced timeline
 *     instead of a pile-up.
 *  3. How it stays fair — every post waits in one queue, a priority score
 *     lets breaking news skip ahead, and a publish window keeps posts out
 *     of the middle of the night. One tech-credibility line (Deno Edge
 *     Function on a 5-minute GitHub Actions cron).
 *  4. Result — before/after cards: a content wall / ~30 min manual work →
 *     a smooth automatic cadence, engagement up 15-20%. Green zone, check
 *     badge.
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
  IconCard,
  FlowArrow,
  StickyNote,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const POSTS = [
  { title: "AI chip shortage deepens", time: "Just now" },
  { title: "New JS framework ships v2", time: "Just now" },
  { title: "Cloud outage hits EU banks", time: "Just now" },
  { title: "Startup raises Series B", time: "Just now" },
];

export const FeatureScheduledPublishing: React.FC = () => {
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

  // ── Beat 2: the solution ──────────────────────────────────────────
  const cardA = pop(132);
  const cardB = pop(146);
  const chip1 = pop(160);
  const chip2 = pop(170);
  const chip3 = pop(180);
  const chip4 = pop(190);
  const chip5 = pop(200);
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays fair ──────────────────────────────────────
  const card1 = pop(252);
  const card2 = pop(272);
  const card3 = pop(292);
  const arr1 = seg(frame, 262, 278, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 282, 298, Easing.inOut(Easing.cubic));
  const cap3 = seg(frame, 300, 316, Easing.out(Easing.cubic));

  // ── Beat 4: the result ─────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const metricOp = seg(frame, 384, 400, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="10-15 articles a day," accentText="all posted at once" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={124} w={660} h={430} title="LinkedIn feed — @vitalii.no" opacity={Math.min(1, pop(8))}>
          {POSTS.map((p, i) => {
            const t = seg(frame, 24 + i * 12, 24 + i * 12 + 14);
            return (
              <div
                key={p.title}
                style={{
                  position: "absolute",
                  left: 20,
                  top: 16 + i * 96,
                  width: 620,
                  height: 82,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 18px",
                  borderRadius: 14,
                  background: B.dangerBg,
                  border: "1.5px solid #F3C2C7",
                  opacity: t,
                  transform: `translateX(${(1 - t) * 24}px)`,
                }}
              >
                <div style={{ fontSize: 30 }}>📰</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: B.ink }}>{p.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: B.danger, marginTop: 3 }}>{p.time}</div>
                </div>
              </div>
            );
          })}
        </BrowserWindow>
        <StickyNote
          x={780}
          y={150}
          w={380}
          opacity={noteOp}
          text="Every article published the moment it's ready — all 10-15 of them landing on the feed within minutes of each other"
        />
        <StatPill x={796} y={392} emoji="📉" text="Unfollows + algorithm penalty" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={796} y={454} emoji="😩" text="~30 min/day staggering by hand" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <CaptionBand text="A content wall on the feed — followers see everything at once, or nothing" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Now released" accentText="one at a time" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <IconCard x={160} y={166} w={280} emoji="🤖" title="Checked every 5 minutes" sub="an automated queue" tone="accent" scale={cardA} opacity={Math.min(1, cardA)} />
        <IconCard x={840} y={166} w={280} emoji="⏱️" title="60s minimum gap" sub="between any two posts" tone="success" scale={cardB} opacity={Math.min(1, cardB)} />
        <div style={{ position: "absolute", left: 160, top: 358, width: 960, height: 2, background: B.border }} />
        <FilterChip x={168} y={334} text="Post 1" icon="✓" color={B.success} scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={352} y={334} text="Post 2" icon="✓" color={B.success} scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={548} y={334} text="Post 3" icon="✓" color={B.success} scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={744} y={334} text="Post 4" icon="✓" color={B.success} scale={chip4} opacity={Math.min(1, chip4)} />
        <FilterChip x={952} y={334} text="Post 5" icon="✓" color={B.success} scale={chip5} opacity={Math.min(1, chip5)} />
        <CaptionBand text="The queue is checked every 5 minutes and enforces a minimum gap between posts" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS FAIR ════ */}
      <Group opacity={b3}>
        <Headline text="And it's" accentText="fair to breaking news" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🗄️" title="One shared queue" sub="posts_queue table" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🚦" title="Priority score 0-100" sub="breaking news jumps ahead" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="⏰" title="08:00-22:00 window" sub="no posts in the middle of the night" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: a Deno Edge Function, triggered by GitHub Actions every 5 minutes"
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
            <div style={{ fontSize: 34, fontWeight: 800, color: B.ink, marginTop: 14 }}>10-15 posts at once</div>
            <div style={{ fontSize: 24, fontWeight: 650, color: B.muted, marginTop: 6 }}>~30 min/day, by hand</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: B.ink, marginTop: 14 }}>60s+ apart, automatic</div>
            <div style={{ fontSize: 24, fontWeight: 650, color: B.muted, marginTop: 6 }}>zero manual scheduling</div>
          </div>
        </Panel>
        <div style={{ position: "absolute", left: 0, top: 424, width: 1280, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: metricOp, fontFamily }}>
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 46, fontWeight: 800, color: B.success }}>+15-20% engagement</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Breaking news still skips the line — live within minutes, not stuck behind a listicle.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
