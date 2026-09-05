/**
 * FeatureScheduledPublishing — feature p25 — 1280x720, 917 frames @ 30fps, VOICE-SYNCED.
 *
 * ART-DIRECTION REWRITE (2026-09-05). Archetype 7 "hero number" / mood "dawn".
 * One enormous numeral owns the frame for the whole clip and MORPHS beat to
 * beat — 15 (posts dumped at once) → 12 (the gift-in-one-breath analogy) →
 * 5 (minutes between automatic checks) → 92 (priority score jumping the
 * queue) → 20% (engagement gain). Every other element is evidence arranged
 * around that number, built to fill the canvas rather than float in it.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–278   "10-15 articles a day, all at once — looked like a dump."
 *  b2  287–427  "Like handing someone twelve gifts in one breath."
 *  b3  436–631  "A scheduler spaces posts, checking every 5 min (GitHub Actions)."
 *  b4  640–804  "Urgent stories jump the queue; routine posts wait quietly."
 *  b5  813–872  "Engagement up 20 percent." — holds at full opacity to 917.
 */
import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.dawn;

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

const TICKS = [100, 316, 532, 748, 964, 1180];

const QUEUE_SLOT_X = (() => {
  const slotW = 170;
  const gap = 20;
  const total = 6 * slotW + 5 * gap;
  const x0 = (1280 - total) / 2;
  return Array.from({ length: 6 }, (_, i) => x0 + i * (slotW + gap));
})();

const CHART_BARS = [30, 42, 55, 70, 88, 108];

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

  const b4Dy = interpolate(frame, [632, 664], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const b2Dy = interpolate(frame, [279, 311], [-26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const hero = (value: string, unit: string | undefined, label: string, color: string, scale: number) => (
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

  // ── Beat 1: the problem — 15 posts at once ─────────────────────────
  const heroPop1 = pop(20);
  const gridX = 70;
  const gridY = 322;
  const cardW = 220;
  const cardH = 86;
  const stat1 = pop(60);
  const stat2 = pop(74);
  const cap1 = seg(frame, 232, 248);

  // ── Beat 2: the analogy — 12 gifts in one breath ────────────────────
  const heroPop2 = pop(295);
  const cap2 = seg(frame, 392, 408);
  const ghostLabelOp = seg(frame, 378, 394);

  // ── Beat 3: the fix — 5-minute automatic cadence ───────────────────
  const heroPop3 = pop(444);
  const techBadge = pop(596);
  const cap3 = seg(frame, 598, 614);

  // ── Beat 4: priority jump ───────────────────────────────────────────
  const heroPop4 = pop(648);
  const urgentX = interpolate(frame, [672, 744], [QUEUE_SLOT_X[5], QUEUE_SLOT_X[0]], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const arrivalPulse = pop(744, 8);
  const cap4 = seg(frame, 758, 774);

  // ── Beat 5: the result — +20% engagement ────────────────────────────
  const heroPop5 = pop(821);
  const check = pop(838);
  const footOp = seg(frame, 848, 864);
  const statR1 = pop(826);
  const statR2 = pop(834);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Beat 1 — a content wall, 15 posts at once ════ */}
        <Group opacity={b1}>
          {hero("15", undefined, "POSTS PUBLISHED AT ONCE", P.danger, heroPop1)}
          <StatPill x={68} y={150} emoji="😩" text="Followers tune out" tone="danger" scale={stat1} opacity={Math.min(1, stat1)} />
          <StatPill x={906} y={150} emoji="📉" text="Algorithm penalty" tone="danger" scale={stat2} opacity={Math.min(1, stat2)} />
          {FEED_POSTS.map((title, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const t = seg(frame, 40 + i * 11, 40 + i * 11 + 14);
            return (
              <div
                key={title}
                style={{
                  position: "absolute",
                  left: gridX + col * (cardW + 10),
                  top: gridY + row * (cardH + 10),
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

        {/* ════ Beat 3 — the fix: checked every 5 minutes ════ */}
        <Group opacity={b3}>
          {hero("5", "MIN", "BETWEEN AUTOMATIC CHECKS", P.accent, heroPop3)}
          <div style={{ position: "absolute", left: 90, top: 520, width: 1100, height: 3, background: P.border }} />
          {TICKS.map((x, i) => {
            const t = seg(frame, 462 + i * 16, 462 + i * 16 + 14, Easing.out(Easing.cubic));
            return (
              <div key={x} style={{ position: "absolute", left: x - 22, top: 470, opacity: t, transform: `translateY(${(1 - t) * -18}px)` }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: P.successBg,
                    border: `2px solid ${P.success}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 800,
                    color: P.success,
                  }}
                >
                  ✓
                </div>
                <div style={{ marginTop: 8, textAlign: "center", fontSize: 13, fontWeight: 700, color: P.muted }}>
                  Post {i + 1}
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 372,
              width: 1280,
              textAlign: "center",
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: 1.6,
              color: P.muted,
              opacity: seg(frame, 452, 468),
            }}
          >
            60-SECOND MINIMUM GAP, ENFORCED EVERY TIME
          </div>
          <FilterChip
            x={958}
            y={628}
            text="GitHub Actions"
            icon="⚙"
            color={P.accent}
            scale={techBadge}
            opacity={Math.min(1, techBadge)}
          />
          <CaptionBand text="One post released at a time — never a pile-up again" tone="accent" opacity={cap3} y={664} fontSize={19} />
        </Group>

        {/* ════ Beat 4 — priority jumps the queue ════ */}
        <Group opacity={b4} dy={b4Dy}>
          {hero("92", undefined, "PRIORITY SCORE", P.amber, heroPop4)}
          {[1, 2, 3, 4, 5].map((slot) => {
            const t = pop(648 + slot * 6);
            return (
              <div
                key={slot}
                style={{
                  position: "absolute",
                  left: QUEUE_SLOT_X[slot],
                  top: 480,
                  width: 170,
                  height: 110,
                  borderRadius: 14,
                  background: P.chipBg,
                  border: `1.5px solid ${P.border}`,
                  opacity: Math.min(1, t),
                  transform: `scale(${0.85 + 0.15 * Math.min(1, t)})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <div style={{ fontSize: 26 }}>📄</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: P.muted }}>Routine</div>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: urgentX,
              top: 480,
              width: 170,
              height: 110,
              borderRadius: 14,
              background: P.dangerBg,
              border: `2px solid ${P.amber}`,
              boxShadow: `0 0 0 ${arrivalPulse * 8}px rgba(245,158,11,0.18)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              opacity: Math.min(1, pop(648)),
            }}
          >
            <div style={{ fontSize: 26 }}>🚨</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: P.danger }}>Breaking</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 610,
              width: 1280,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
              color: P.amber,
              opacity: Math.min(1, arrivalPulse),
            }}
          >
            Jumps straight to the front
          </div>
          <CaptionBand text="Routine posts keep waiting quietly in the background" tone="accent" opacity={cap4} y={660} fontSize={19} />
        </Group>

        {/* ════ Beat 5 — the result: +20% engagement ════ */}
        <Group opacity={b5}>
          {hero("20", "%", "MORE ENGAGEMENT", P.success, heroPop5)}
          <StatPill x={64} y={150} emoji="✅" text="Zero manual scheduling" tone="success" scale={statR1} opacity={Math.min(1, statR1)} />
          <StatPill x={882} y={150} emoji="⏱" text="Urgent posts live in minutes" tone="success" scale={statR2} opacity={Math.min(1, statR2)} />
          {CHART_BARS.map((h, i) => {
            const t = seg(frame, 826 + i * 5, 826 + i * 5 + 12, Easing.out(Easing.cubic));
            const barW = 100;
            const gap = 25;
            const x0 = (1280 - (6 * barW + 5 * gap)) / 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x0 + i * (barW + gap),
                  top: 650 - h * t,
                  width: barW,
                  height: Math.max(2, h * t),
                  borderRadius: "8px 8px 0 0",
                  background: i === 5 ? P.success : P.successEdge,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 0, top: 654, width: 1280, height: 2, background: P.border }} />
          <CheckBadge x={880} y={70} size={48} scale={check} opacity={Math.min(1, check)} />
          <div style={{ position: "absolute", left: 0, top: 672, width: 1280, textAlign: "center", fontSize: 18, fontWeight: 650, color: P.muted, opacity: footOp }}>
            Steady posting, steady growth
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
