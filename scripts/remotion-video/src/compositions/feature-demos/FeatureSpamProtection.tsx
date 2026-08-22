/**
 * FeatureSpamProtection — feature p26 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+form mockup, a
 * server-side checklist ticking off in real time, and a big before→after
 * metric.
 *
 * Story (4 beats):
 *  1. Problem — the contact form inbox scrolls with junk: casino bonuses,
 *     crypto scams, fake SEO deals. 50+ a day, real messages buried inside.
 *  2. Solution — the same contact form, but a hidden honeypot field and a
 *     server-side checklist quietly verify every submission before it's
 *     treated as real: honeypot empty, filled in over 3s, first request
 *     from this IP in the last 10 minutes.
 *  3. How it works — three tiers as icon cards (honeypot / timer / rate
 *     limit), one small tech-credibility line (Deno Edge Function).
 *  4. Result — before/after cards: 50+/day → 0-1/day, a 98% reduction badge,
 *     zero false positives, no CAPTCHA needed.
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
  Cursor,
  CheckBadge,
  CaptionBand,
  StatPill,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const SPAM_LINES: { icon: string; text: string }[] = [
  { icon: "🎰", text: "CASINO BONUS — claim $500 free spins now!!!" },
  { icon: "💰", text: "Buy crypto with 0% fees — act today" },
  { icon: "🔗", text: "SEO backlinks package — rank #1 fast, cheap" },
  { icon: "💊", text: "Cheap meds, no prescription needed" },
  { icon: "🎰", text: "You won a prize! Click to claim instantly" },
  { icon: "🔗", text: "Guest post opportunity — link exchange offer" },
  { icon: "💰", text: "Double your investment in 24 hours, guaranteed" },
];

/** Scrolling wall of junk subject lines — "an inbox drowning in spam". */
const SpamScroll: React.FC<{ w: number; h: number; offset: number }> = ({ w, h, offset }) => {
  const rowH = 58;
  const count = Math.ceil(h / rowH) + 2;
  const shift = offset % rowH;
  return (
    <div style={{ position: "absolute", left: 0, top: -shift, width: w }}>
      {Array.from({ length: count }, (_, i) => {
        const item = SPAM_LINES[i % SPAM_LINES.length];
        return (
          <div
            key={i}
            style={{
              height: rowH,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 18px",
              borderBottom: `1px solid ${B.border}`,
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: B.danger, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** One row of a mock contact form field. */
const FormField: React.FC<{ label: string; value: string; dashed?: boolean; badge?: string }> = ({
  label,
  value,
  dashed = false,
  badge,
}) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: B.muted, marginBottom: 5, display: "flex", alignItems: "center", gap: 8 }}>
      {label}
      {badge ? (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: B.accent,
            background: B.accentBg,
            border: `1px solid ${B.border}`,
            borderRadius: 999,
            padding: "1px 8px",
          }}
        >
          {badge}
        </span>
      ) : null}
    </div>
    <div
      style={{
        height: 34,
        borderRadius: 9,
        background: dashed ? "transparent" : "#F4F7FC",
        border: dashed ? `1.5px dashed ${B.border}` : `1.5px solid ${B.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        fontSize: 14,
        fontWeight: 500,
        color: dashed ? B.muted : B.ink,
      }}
    >
      {value}
    </div>
  </div>
);

/** Checklist row that pops in and turns into a green check. */
const CheckRow: React.FC<{ text: string; sub: string; t: number }> = ({ text, sub, t }) => {
  if (t <= 0.004) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        marginBottom: 10,
        borderRadius: 12,
        background: B.successBg,
        border: `1.5px solid #BFE7CD`,
        opacity: Math.min(1, t * 1.6),
        transform: `translateX(${(1 - Math.min(1, t * 1.6)) * 24}px)`,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          minWidth: 26,
          borderRadius: "50%",
          background: B.success,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          fontWeight: 800,
          transform: `scale(${Math.min(1, t * 1.4)})`,
        }}
      >
        ✓
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: B.ink }}>{text}</div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: B.muted, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
};

export const FeatureSpamProtection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (matches reference clip exactly) ──────────────────
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

  // ── Beat 2: the solution ──────────────────────────────────────────
  const formOp = seg(frame, 116, 130);
  const cx = interpolate(frame, [124, 150, 168], [700, 335, 335], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 150, 168], [420, 552, 552], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 176, 190));
  const click1 = seg(frame, 150, 164, Easing.out(Easing.quad));
  const check1 = seg(frame, 170, 190, Easing.out(Easing.cubic));
  const check2 = seg(frame, 182, 202, Easing.out(Easing.cubic));
  const check3 = seg(frame, 194, 214, Easing.out(Easing.cubic));
  const verifiedOp = seg(frame, 210, 224, Easing.out(Easing.cubic));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it works ──────────────────────────────────────────
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
  const pct = Math.round(
    interpolate(frame, [384, 410], [0, 98], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Your contact form gets" accentText="50+ spam messages a day" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="vitalii.no — inbox (unfiltered)" opacity={Math.min(1, pop(8))}>
          <SpamScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Casino bonuses, crypto scams, fake SEO deals — real messages get buried inside"
        />
        <StatPill x={846} y={340} emoji="📧" text="50+ spam / day" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="🎰" text="Casino, crypto, SEO junk" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😤" text="Drowning within the first week" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Every single day, spam drowns out the messages that actually matter" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="3 invisible checks run" accentText="before any email is sent" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <BrowserWindow x={90} y={196} w={560} h={396} title="vitalii.no — contact form" opacity={formOp}>
          <div style={{ padding: "22px 24px", fontFamily }}>
            <FormField label="NAME" value="Kari Nordmann" />
            <FormField label="EMAIL" value="kari@example.com" />
            <FormField label="EMAIL_CONFIRM" value="(left empty)" dashed badge="🍯 hidden field" />
            <FormField label="MESSAGE" value="Hi, I'd like to ask about..." />
            <div
              style={{
                marginTop: 16,
                width: 140,
                height: 38,
                borderRadius: 10,
                background: B.accent,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Send message
            </div>
          </div>
        </BrowserWindow>
        <Panel x={680} y={196} w={490} h={396} tone="card" opacity={formOp}>
          <div style={{ padding: "20px 20px 0", fontFamily }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: B.muted, letterSpacing: 0.4, marginBottom: 12 }}>
              SERVER-SIDE CHECKS
            </div>
            <CheckRow text="Honeypot field is empty" sub="a bot would have filled it in" t={check1} />
            <CheckRow text="Took 4.2 seconds to fill in" sub="over the 3-second minimum" t={check2} />
            <CheckRow text="1st request from this IP in 10 min" sub="under the 5-request limit" t={check3} />
            <div
              style={{
                marginTop: 6,
                padding: "12px 14px",
                borderRadius: 12,
                background: B.accentBg,
                border: `1.5px solid #C4D7FB`,
                textAlign: "center",
                fontSize: 16,
                fontWeight: 800,
                color: B.accent,
                opacity: verifiedOp,
                transform: `scale(${0.94 + 0.06 * verifiedOp})`,
              }}
            >
              ✅ Verified — sending now
            </div>
          </div>
        </Panel>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={click1 % 1} />
        <CaptionBand text="Real visitors pass without ever noticing a thing" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="Three quiet tiers," accentText="one Edge Function" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🍯" title="Hidden honeypot field" sub="bots fill it in, humans never see it" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="⏱️" title="3-second minimum" sub="blocks instant auto-submits" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🚦" title="IP rate limit" sub="5 requests per 10 minutes" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="All three checks run inside one Deno Edge Function — before Resend ever sends an email"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>50+ / day</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>spam submissions</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>0-1 / day</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>zero false positives</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>{pct}% fewer spam messages</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            No CAPTCHA, no friction — just three quiet checks running in the background.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no · Contact form</div>
        </div>
      </Group>
    </div>
  );
};
