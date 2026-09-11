/**
 * FeatureScheduledPublishing — feature p25 — 1280x720, 917 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (2026-09-10): same narration and beat windows as the 2026-09-05
 * "hero number" cut, mood changed dawn -> slate, and the picture rebuilt so the
 * UI beats play a RECORDING of the real product (owner rule, STEP 0c,
 * 2026-09-06) instead of a drawn mockup:
 *
 *   actions  github.com/…/vitalii-no-platform/actions           195 f   beat 3
 *   commit   github.com/…/commit/a02b809 (the real diff)         164 f   beat 4
 *   page     vitalii.no/features/…-p25                           112 f   beat 5
 *
 * Beat 1 (the content-dump problem) and beat 2 (the twelve-gifts analogy) are
 * pure metaphor/problem-framing with no matching public page, so they stay
 * drawn. The commit a02b809 is the real "scheduled publishing queue with
 * engagement windows" change (5-min cron, weight classification) — the
 * strongest "this is the product" shot for a backend feature. "60-second
 * minimum gap" and "every 5 minutes" are the real cadence; the "92" priority
 * score in beat 4 is an illustrative mockup reading, not a claimed metric.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–278   "I was posting 10 to 15 articles a day, sometimes all at once, and it looked like a content dump — followers would just tune out or unfollow."
 *  b2 287–427   "That's like trying to hand someone twelve gifts in one breath instead of spacing them out."
 *  b3 436–631   "So a scheduler now spaces every post automatically, running every five minutes with GitHub Actions."
 *  b4 640–804   "Urgent stories jump the queue instantly, while routine posts wait their turn in the background."
 *  b5 813–872   "Engagement up 20 percent." — holds at full opacity to 917.
 *
 * Single tech name in the whole clip: GitHub Actions (beat 3 chip only).
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
import { LiveShot, WIN_DEFAULT, WIN_BAR } from "./live-primitives";
import shots from "./shots/p25.json";

const P = MOODS.slate;

const WIN = WIN_DEFAULT;
const BAR = WIN_BAR;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const FEED_POSTS = [
  "AI chip shortage deepens",
  "New JS framework ships v2",
  "Cloud outage hits EU banks",
  "Startup raises Series B",
  "Browser adds AI sidebar",
  "Chipmaker unveils roadmap",
  "Data leak hits fintech app",
  "Open-source project forks",
  "Robotics firm goes public",
  "Security patch rushed out",
  "App store policy shifts",
  "GPU prices climb again",
  "Telecom rolls out 5G zone",
  "Ad platform tweaks algorithm",
  "Battery breakthrough claimed",
];

const GIFTS: { x: number; y: number; rot: number }[] = [
  { x: 110, y: 360, rot: -14 },
  { x: 290, y: 402, rot: 10 },
  { x: 470, y: 348, rot: -8 },
  { x: 650, y: 412, rot: 14 },
  { x: 830, y: 352, rot: -12 },
  { x: 1010, y: 404, rot: 9 },
  { x: 180, y: 522, rot: 8 },
  { x: 360, y: 480, rot: -16 },
  { x: 540, y: 526, rot: 12 },
  { x: 720, y: 484, rot: -9 },
  { x: 900, y: 522, rot: 15 },
  { x: 1080, y: 480, rot: -11 },
];

const GHOST_DOTS = [160, 340, 520, 700, 880, 1060];

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

export const FeatureScheduledPublishing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (crossfades overlap the ~9-frame narration gaps) ──
  const b1 = seg(frame, 4, 20) * (1 - seg(frame, 270, 286));
  const b2 = seg(frame, 279, 295) * (1 - seg(frame, 419, 435));
  const b3 = seg(frame, 428, 444) * (1 - seg(frame, 623, 639));
  const b4 = seg(frame, 632, 648) * (1 - seg(frame, 796, 812));
  const b5 = seg(frame, 805, 821); // holds full opacity through frame 917 — no fade-out

  const heroPop1 = pop(20);
  const heroPop2 = pop(295);
  const heroPop3 = pop(444);
  const heroPop4 = pop(648);
  const heroPop5 = pop(821);

  // ── Beat 1: the problem — 15 posts at once (drawn, no matching public page) ──
  const gridX = 66;
  const gridY = 175;
  const cardW = 220;
  const cardH = 100;
  const stat1 = pop(60);
  const stat2 = pop(74);
  const cap1 = seg(frame, 232, 248);

  // ── Beat 2: the analogy — 12 gifts in one breath (metaphor, drawn) ──
  const cap2 = seg(frame, 392, 408);
  const ghostLabelOp = seg(frame, 378, 394);
  const stat2L = pop(300);
  const stat2R = pop(312);
  const b2Dy = interpolate(frame, [279, 311], [-26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Beat 3: the fix — real GitHub Actions run history, non-crossfade scale-push ──
  const stat3L = pop(450);
  const stat3R = pop(462);
  const techBadge = pop(560);
  const cronPop = pop(474);
  const cap3 = seg(frame, 598, 614);
  const pushScale3 = interpolate(frame, [428, 452], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Beat 4: the real commit diff, priority jumps the queue ──
  const stat4L = pop(654);
  const stat4R = pop(666);
  const arrivalPulse = pop(744, 8);
  const cap4 = seg(frame, 758, 774);

  // ── Beat 5: the result — real feature page, +20% engagement ──
  const statR1 = pop(826);
  const statR2 = pop(834);
  const check = pop(838);
  const stripIn = seg(frame, 848, 864);
  const arrowProgress = interpolate(frame, [852, 884], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Beat 1 — a content wall, 15 posts at once ════ */}
        <Group opacity={b1}>
          {hero("15", undefined, "POSTS PUBLISHED AT ONCE", P.danger, heroPop1)}
          <StatPill x={690} y={52} emoji="😩" text="Followers tune out" tone="danger" scale={stat1} opacity={Math.min(1, stat1)} />
          <StatPill x={690} y={112} emoji="📉" text="Algorithm penalty" tone="danger" scale={stat2} opacity={Math.min(1, stat2)} />
          {FEED_POSTS.map((title, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const t = seg(frame, 40 + i * 11, 40 + i * 11 + 14);
            return (
              <div
                key={title}
                style={{
                  position: "absolute",
                  left: gridX + col * (cardW + 12),
                  top: gridY + row * (cardH + 14),
                  width: cardW,
                  height: cardH,
                  borderRadius: 12,
                  background: P.dangerBg,
                  border: `1.5px solid ${P.dangerEdge}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 12px",
                  opacity: t,
                  transform: `translateY(${(1 - t) * 14}px)`,
                }}
              >
                <div style={{ fontSize: 22 }}>📰</div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: P.ink,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: P.danger, marginTop: 2 }}>Just now</div>
                </div>
              </div>
            );
          })}
          <CaptionBand text="A feed wall — followers see everything at once, or nothing" tone="danger" opacity={cap1} y={646} />
        </Group>

        {/* ════ Beat 2 — the analogy: 12 gifts in one breath ════ */}
        <Group opacity={b2} dy={b2Dy}>
          {hero("12", undefined, "GIFTS IN ONE BREATH", P.danger, heroPop2)}
          <StatPill x={690} y={52} emoji="😮‍💨" text="All at once" tone="danger" scale={stat2L} opacity={Math.min(1, stat2L)} />
          <StatPill x={690} y={112} emoji="🙈" text="None of it lands" tone="danger" scale={stat2R} opacity={Math.min(1, stat2R)} />
          {GIFTS.map((g, i) => {
            const t = seg(frame, 300 + i * 7, 300 + i * 7 + 12);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: g.x,
                  top: g.y,
                  fontSize: 44,
                  opacity: t,
                  transform: `rotate(${g.rot}deg) scale(${0.6 + 0.4 * t})`,
                }}
              >
                🎁
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 604,
              width: 1280,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 1.4,
              color: P.muted,
              opacity: ghostLabelOp,
            }}
          >
            INSTEAD — SPACED OUT, ONE AT A TIME
          </div>
          {GHOST_DOTS.map((x, i) => {
            const t = seg(frame, 396 + i * 5, 396 + i * 5 + 10);
            return (
              <div
                key={x}
                style={{
                  position: "absolute",
                  left: x - 9,
                  top: 646,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: P.successBg,
                  border: `2px solid ${P.success}`,
                  opacity: t,
                  transform: `scale(${0.5 + 0.5 * t})`,
                }}
              />
            );
          })}
          <CaptionBand text="A content dump the moment it's ready — instead of one steady drip" tone="danger" opacity={cap2} y={676} fontSize={19} />
        </Group>

        {/* ════ Beat 3 — the real GitHub Actions run history (scale-push, not a crossfade) ════ */}
        <Group opacity={b3}>
          {hero("5", "MIN", "BETWEEN AUTOMATIC CHECKS", P.accent, heroPop3)}
          <StatPill x={690} y={52} emoji="🔁" text="Runs around the clock" tone="accent" scale={stat3L} opacity={Math.min(1, stat3L)} />
          <StatPill x={690} y={112} emoji="🤖" text="Fully automatic" tone="accent" scale={stat3R} opacity={Math.min(1, stat3R)} />
        </Group>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${pushScale3})`,
            transformOrigin: `${WIN.x + WIN.w / 2}px ${WIN.y + WIN.h / 2}px`,
          }}
        >
          <Group opacity={b3}>
            <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="github.com/SmmShaman/vitalii-no-platform — Actions" opacity={b3} />
          </Group>
          <LiveShot
            file={shots as any}
            shot="actions"
            from={428}
            hold={211}
            zoom={(t) => 1 + 0.1 * easeInOut(t)}
            focus={{ x: 0.1, y: 0.35 }}
            opacity={b3}
          />
        </div>
        <Group opacity={b3}>
          <div
            style={{
              position: "absolute",
              left: WIN.x + WIN.w - 230,
              top: WIN.y + BAR + 14,
              padding: "6px 14px",
              borderRadius: 999,
              background: P.card,
              border: `1.5px solid ${P.border}`,
              fontSize: 14,
              fontWeight: 700,
              color: P.accent,
              fontFamily: "ui-monospace, Menlo, monospace",
              boxShadow: "0 8px 20px rgba(22,35,63,0.12)",
              opacity: cronPop,
              transform: `scale(${0.85 + 0.15 * Math.min(1, cronPop)})`,
            }}
          >
            */5 * * * *
          </div>
          <FilterChip
            x={WIN.x + WIN.w - 200}
            y={WIN.y - 40}
            text="GitHub Actions"
            icon="⚙"
            color={P.accent}
            scale={techBadge}
            opacity={Math.min(1, techBadge)}
          />
          <CaptionBand text="60-second minimum gap between posts, enforced every time" tone="accent" opacity={cap3} y={664} fontSize={19} />
        </Group>

        {/* ════ Beat 4 — the real commit diff, priority jumps the queue ════ */}
        <Group opacity={b4}>
          {hero("92", undefined, "PRIORITY SCORE", P.amber, heroPop4)}
          <StatPill x={690} y={52} emoji="🚦" text="Breaking jumps ahead" tone="accent" scale={stat4L} opacity={Math.min(1, stat4L)} />
          <StatPill x={690} y={112} emoji="😌" text="Routine waits calmly" tone="success" scale={stat4R} opacity={Math.min(1, stat4R)} />
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="github.com/…/commit/a02b809 — scheduled publishing queue" opacity={b4} />
        </Group>
        <LiveShot
          file={shots as any}
          shot="commit"
          from={632}
          hold={180}
          zoom={(t) => 1 + 0.08 * easeOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b4}
        />
        <Group opacity={b4}>
          <div
            style={{
              position: "absolute",
              left: WIN.x + WIN.w - 300,
              top: WIN.y + WIN.h - 74,
              padding: "10px 16px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.96)",
              border: `2px solid ${P.amber}`,
              boxShadow: `0 8px 24px rgba(22,35,63,0.16), 0 0 0 ${arrivalPulse * 8}px rgba(245,158,11,0.18)`,
              fontSize: 14.5,
              fontWeight: 800,
              color: P.danger,
              opacity: Math.min(1, arrivalPulse),
              transform: `translateY(${(1 - Math.min(1, arrivalPulse)) * 14}px)`,
            }}
          >
            🚨 Urgent → straight to the front
          </div>
          <CaptionBand text="Routine posts keep waiting quietly in the background" tone="accent" opacity={cap4} y={664} fontSize={19} />
        </Group>

        {/* ════ Beat 5 — the real feature page, +20% engagement ════ */}
        <Group opacity={b5}>
          {hero("20", "%", "MORE ENGAGEMENT", P.success, heroPop5)}
          <StatPill x={690} y={52} emoji="✅" text="Zero manual scheduling" tone="success" scale={statR1} opacity={Math.min(1, statR1)} />
          <StatPill x={690} y={112} emoji="⏱" text="Urgent posts live in minutes" tone="success" scale={statR2} opacity={Math.min(1, statR2)} />
          <CheckBadge x={1080} y={44} size={44} scale={check} opacity={Math.min(1, check)} />
          <BrowserWindow x={WIN.x} y={WIN.y} w={WIN.w} h={WIN.h} title="vitalii.no/features/scheduled-publishing-…-p25" opacity={b5} />
        </Group>
        <LiveShot
          file={shots as any}
          shot="page"
          from={805}
          hold={112}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
        />
        <Group opacity={b5}>
          <div
            style={{
              position: "absolute",
              left: WIN.x + WIN.w - 430,
              top: WIN.y + WIN.h - 100,
              width: 390,
              padding: "12px 18px",
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
                <div style={{ fontSize: 26, fontWeight: 800, color: P.danger, whiteSpace: "nowrap" }}>DUMPED</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>15 AT ONCE</div>
              </div>
              <div style={{ position: "relative", width: 80, height: 24, flexShrink: 0 }}>
                <FlowArrow x={0} y={10} len={80} progress={arrowProgress} color={P.success} opacity={stripIn} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: P.success, whiteSpace: "nowrap" }}>+20%</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>ENGAGEMENT</div>
              </div>
            </div>
          </div>
          <CaptionBand text="Steady posting, steady growth" tone="success" opacity={b5} y={664} fontSize={19} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
