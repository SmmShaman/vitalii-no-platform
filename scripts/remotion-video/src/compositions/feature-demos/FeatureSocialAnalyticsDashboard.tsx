/**
 * FeatureSocialAnalyticsDashboard — feature p16 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+invoice mockup and a
 * real dashboard mockup, an icon strip for how the sync works, and a big
 * before→after cost metric.
 *
 * Story (4 beats):
 *  1. Problem — Shield App bills $25/month per profile for analytics built
 *     from data the platform already owns. Red zone, invoice mockup.
 *  2. Solution — flip "Live sync" on: a real admin dashboard appears with
 *     Impressions / Engagement rate / Followers cards, synced automatically.
 *  3. How it stays current — Facebook Graph API + Instagram Media API +
 *     follower_history feed a Recharts dashboard every 6 hours (one small
 *     tech-credibility line: Recharts).
 *  4. Result — before/after cards: $25/month per profile → $0/month,
 *     100% of that cost eliminated. Green zone, check badge.
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

export const FeatureSocialAnalyticsDashboard: React.FC = () => {
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
  const price = pop(18);
  const item1 = pop(56);
  const item2 = pop(66);
  const item3 = pop(76);
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution ───────────────────────────────────────────
  const card1 = pop(132);
  const card2 = pop(142);
  const card3 = pop(152);
  const togOn = seg(frame, 160, 172, Easing.inOut(Easing.cubic));
  const cx = interpolate(frame, [124, 150, 168], [560, 900, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 150, 168], [420, 152, 152], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 176, 188));
  const click1 = seg(frame, 160, 172, Easing.out(Easing.quad));
  const winOp = seg(frame, 168, 182, Easing.out(Easing.cubic));
  const barsAppear = 186;
  const footNoteOp = seg(frame, 214, 228) * 0.9;
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays current ────────────────────────────────────
  const icard1 = pop(252);
  const icard2 = pop(272);
  const icard3 = pop(292);
  const arr1 = seg(frame, 262, 278, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 282, 298, Easing.inOut(Easing.cubic));
  const cap3 = seg(frame, 300, 316, Easing.out(Easing.cubic));

  // ── Beat 4: the result ────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const pctSaved = Math.round(
    interpolate(frame, [384, 414], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  const BARS = [38, 52, 44, 68, 58, 82, 74];

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Still paying" accentText="$25/month for your own data?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="Shield App — subscription" opacity={Math.min(1, pop(8))}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 700, padding: "30px 36px", fontFamily }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: B.muted, letterSpacing: 0.6 }}>SHIELD APP · SUBSCRIPTION</div>
            <div style={{ fontSize: 27, fontWeight: 800, color: B.ink, marginTop: 10 }}>Analytics Pro</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 16, opacity: Math.min(1, price) }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: B.danger }}>$25.00</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: B.muted }}>/ month / profile</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: B.muted, marginTop: 6, opacity: Math.min(1, price) }}>
              × 2 profiles = $50/month
            </div>
            <div style={{ height: 1, background: B.border, margin: "24px 0 18px" }} />
            {[
              { op: item1, text: "Facebook post analytics" },
              { op: item2, text: "Instagram post analytics" },
              { op: item3, text: "Follower growth history" },
            ].map((row) => (
              <div
                key={row.text}
                style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, opacity: Math.min(1, row.op) }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: B.successBg,
                    border: `1.5px solid #BFE7CD`,
                    color: B.success,
                    fontSize: 13,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: 18, fontWeight: 600, color: B.ink }}>{row.text}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: B.muted, marginLeft: "auto" }}>already in our DB</span>
              </div>
            ))}
          </div>
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Our own pipeline already stores this exact data — every post, every day"
        />
        <StatPill x={846} y={340} emoji="💸" text="$25/month, per profile" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="🗄️" text="Data already in our own DB" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😩" text="Paying twice for our own numbers" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="A monthly bill for insights already sitting in our own database" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Now it's built in —" accentText="for $0" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <ToggleSwitch x={860} y={138} label="Live sync" on={togOn} opacity={seg(frame, 138, 150)} />
        <Cursor x={cx} y={cy} opacity={cursorOp} click={click1 % 1} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="admin — social analytics" opacity={winOp}>
          <Panel x={24} y={20} w={320} h={112} tone="accent" opacity={Math.min(1, card1)}>
            <div style={{ padding: "18px 22px", fontFamily }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: B.muted, letterSpacing: 0.4 }}>IMPRESSIONS</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: B.ink, marginTop: 6 }}>12,400</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.success, marginTop: 4 }}>▲ 18% vs last week</div>
            </div>
          </Panel>
          <Panel x={372} y={20} w={320} h={112} tone="accent" opacity={Math.min(1, card2)}>
            <div style={{ padding: "18px 22px", fontFamily }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: B.muted, letterSpacing: 0.4 }}>ENGAGEMENT RATE</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: B.ink, marginTop: 6 }}>4.2%</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.success, marginTop: 4 }}>▲ 0.6pp vs last week</div>
            </div>
          </Panel>
          <Panel x={720} y={20} w={320} h={112} tone="accent" opacity={Math.min(1, card3)}>
            <div style={{ padding: "18px 22px", fontFamily }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: B.muted, letterSpacing: 0.4 }}>FOLLOWERS</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: B.ink, marginTop: 6 }}>3,180</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.success, marginTop: 4 }}>▲ 54 this week</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: 24, top: 158, width: 1012 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: B.muted, letterSpacing: 0.4, marginBottom: 10 }}>
              ENGAGEMENT — LAST 7 DAYS
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 110 }}>
              {BARS.map((h, i) => {
                const t = seg(frame, barsAppear + i * 6, barsAppear + i * 6 + 14, Easing.out(Easing.cubic));
                return (
                  <div
                    key={i}
                    style={{
                      width: 44,
                      height: Math.max(4, h * t),
                      borderRadius: 8,
                      background: i === BARS.length - 1 ? B.success : B.accent,
                      opacity: 0.85,
                    }}
                  />
                );
              })}
            </div>
          </div>
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
              opacity: footNoteOp,
            }}
          >
            Top posts · follower trends · CSV export — all in one place
          </div>
        </BrowserWindow>
        <CaptionBand text="Facebook + Instagram, engagement and followers — one dashboard" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS CURRENT ════ */}
      <Group opacity={b3}>
        <Headline text="Kept fresh" accentText="every 6 hours" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🔵" title="Facebook Graph API" sub="posts + engagement" tone="accent" scale={icard1} opacity={Math.min(1, icard1)} />
        <IconCard x={490} y={218} w={300} emoji="📷" title="Instagram Media API" sub="posts + engagement" tone="accent" scale={icard2} opacity={Math.min(1, icard2)} />
        <IconCard x={870} y={218} w={300} emoji="📈" title="Recharts dashboard" sub="updated automatically" tone="success" scale={icard3} opacity={Math.min(1, icard3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Built with Recharts, reading data that's already synced every 6 hours"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>$25/month</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>per profile, 3rd-party tool</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>$0/month</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>our own dashboard</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>{pctSaved}% of that cost — gone</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Same Facebook + Instagram data, now inside our own admin panel.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
