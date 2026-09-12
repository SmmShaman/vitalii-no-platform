/**
 * FeatureSpamProtection — feature p26 — 1280x720 @ 30fps, VOICE-SYNCED (955
 * frames), mood "mint".
 *
 * ARCHETYPE 0 — "split duel". The whole canvas is halved by a divider whose
 * x-position slides over the course of the clip: chaos (spam) lives on the
 * left, order (the 3-tier defense) lives on the right, BOTH alive at once for
 * the entire clip. Early on the chaos side is wide (spam is the problem being
 * described); as the defense gets built and the result lands, the divider
 * slides left and the order side swallows most of the frame — spam visually
 * squeezed into a thin trickle by the end.
 *
 * RE-SHOOT (2026-09-12): narration and beat windows are UNCHANGED — only the
 * picture on the order side changed. Beat 3 (the trap) now plays the real
 * commit that shipped it (github.com/.../commit/8cbd82d, scrolling through
 * the actual honeypot/timing/rate-limit code) instead of three drawn icon
 * cards; beat 4 (bots vs. real people) now plays a real recording of the
 * feature's own page instead of a mockup inbox. The chaos side (a
 * dramatization of an inbox no one has ever screenshotted) and the beat-5
 * payoff number stay drawn, per STEP 0c: metaphor beats stay drawn, real UI
 * beats play the real product.
 *
 * Beats (voice-synced, do not change without re-measuring the VO):
 *  b1  15–304  "...50 spam messages a day — SEO offers, casino links, crypto junk."
 *  b2  313–459 "I didn't want a CAPTCHA... make every real visitor feel like a suspect."
 *  b3  468–669 "...a three-layer trap inside one Edge Function: hidden field, timing, rate limit."
 *  b4  678–823 "Bots trip one of the three instantly; real people never notice."
 *  b5  832–910 "Spam: down 98 percent." (holds full opacity through frame 955)
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, Tone } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  IconCard,
  StatPill,
  FilterChip,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shotsP26 from "./shots/p26.json";

const P = MOODS.mint;

const SPAM_LINES: { icon: string; text: string }[] = [
  { icon: "🎰", text: "CASINO BONUS — claim $500 free spins now!!!" },
  { icon: "💰", text: "Buy crypto with 0% fees — act today" },
  { icon: "🔗", text: "SEO backlinks package — rank #1 fast, cheap" },
  { icon: "💊", text: "Cheap meds, no prescription needed" },
  { icon: "🎰", text: "You won a prize! Click to claim instantly" },
  { icon: "🔗", text: "Guest post offer — link exchange, one time only" },
  { icon: "💰", text: "Double your investment in 24 hours, guaranteed" },
];

/** Scrolling wall of junk subject lines, clipped to whatever width it's given. */
const SpamFeed: React.FC<{ w: number; h: number; offset: number }> = ({ w, h, offset }) => {
  const rowH = 54;
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
              gap: 12,
              padding: "0 16px",
              borderBottom: `1px solid ${P.dangerEdge}`,
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: P.danger,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily,
              }}
            >
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** A clean-inbox row that pops in with a green check — the messages that get through. */
const ArrivalRow: React.FC<{ text: string; t: number }> = ({ text, t }) => {
  if (t <= 0.004) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        marginBottom: 8,
        borderRadius: 10,
        background: P.successBg,
        border: `1.5px solid ${P.successEdge}`,
        opacity: Math.min(1, t * 1.6),
        transform: `translateX(${(1 - Math.min(1, t * 1.6)) * 20}px)`,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          minWidth: 22,
          borderRadius: "50%",
          background: P.success,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        ✓
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: P.ink, fontFamily }}>{text}</div>
    </div>
  );
};

type Technique = { emoji: string; text: string; tone: Tone; activateAt: number };

/** The three layers of the trap — same activation beats as before, now callouts
 *  under the real commit diff instead of standalone icon cards. */
const TECHNIQUES: Technique[] = [
  { emoji: "🍯", text: "Honeypot field — a bot fills it in", tone: "accent", activateAt: 484 },
  { emoji: "⏱", text: "3-second timer — too fast is a bot", tone: "accent", activateAt: 540 },
  { emoji: "🚦", text: "Rate limit — 5 requests / 10 min", tone: "success", activateAt: 600 },
];

/** Order-side window boxes — x/y are relative to the order-side wrapper div
 *  (its own left:dividerX origin), not the full canvas. Sized to fit the
 *  narrowest the order side gets during each beat's active window. */
const COMMIT_WIN = { x: 24, y: 90, w: 480, h: 380 };
const PAGE_WIN = { x: 40, y: 70, w: 600, h: 380 };

export const FeatureSpamProtection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── The moving divider — chaos wide early, order swallows the frame late ──
  const dividerX = interpolate(
    frame,
    [0, 304, 459, 669, 823, 910, 955],
    [860, 830, 760, 480, 260, 130, 130],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const leftW = dividerX;
  const rightW = 1280 - dividerX;

  const structureOp = seg(frame, 0, 14);

  // ── Beat windows (fade-in + fade-out per beat; b5 holds to the end) ──────
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 288, 304));
  const b2 = seg(frame, 313, 329) * (1 - seg(frame, 443, 459));
  const b3 = seg(frame, 468, 484) * (1 - seg(frame, 653, 669));
  const b4 = seg(frame, 678, 694) * (1 - seg(frame, 807, 823));
  const b5 = seg(frame, 832, 848);

  // ── Chaos side (left) ─────────────────────────────────────────────
  const scroll = frame * 1.8;
  const headerFade = structureOp * (1 - seg(frame, 600, 650));
  const pillPop = pop(40);
  const pillOp = Math.min(1, pillPop) * (1 - seg(frame, 600, 650));
  const spamCount = Math.round(
    interpolate(frame, [20, 140], [0, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  );

  // ── Beat 2: the CAPTCHA idea, sliding down onto the divider ────────
  const capScale = pop(322, 9);
  const capY = interpolate(frame, [313, 345], [130, 258], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Beat 3: the real commit diff, tech-credit chip pop, techniques list ──
  const chipPop = pop(478, 9);

  // ── Beat 4: real messages arriving in the clean inbox, under the recording ──
  const arrival = [
    seg(frame, 700, 716, Easing.out(Easing.cubic)),
    seg(frame, 724, 740, Easing.out(Easing.cubic)),
    seg(frame, 748, 764, Easing.out(Easing.cubic)),
  ];

  // ── Beat 5: the payoff number ───────────────────────────────────────
  const pct = Math.round(
    interpolate(frame, [840, 900], [0, 98], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  );

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily, opacity: structureOp }}>
        <LightBg />

        {/* ════ CHAOS SIDE — spam flooding in (dramatization, stays drawn) ════ */}
        <div style={{ position: "absolute", left: 0, top: 0, width: leftW, height: 720, overflow: "hidden" }}>
          <Panel x={0} y={0} w={leftW} h={720} tone="danger" radius={0} />
          <div
            style={{
              position: "absolute",
              left: 18,
              top: 16,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0.6,
              color: P.danger,
              opacity: headerFade,
              whiteSpace: "nowrap",
              fontFamily,
            }}
          >
            📥 UNFILTERED INBOX
          </div>
          <div style={{ position: "absolute", left: 0, top: 54, width: leftW, height: 666, overflow: "hidden" }}>
            <SpamFeed w={leftW} h={666} offset={scroll} />
          </div>
          <div style={{ position: "absolute", left: 16, bottom: 30, opacity: pillOp }}>
            <StatPill x={0} y={0} emoji="📧" text={`${spamCount}/day`} tone="danger" scale={1} opacity={1} />
          </div>
        </div>

        {/* ════ ORDER SIDE — the 3-tier defense, now proven with the real product ════ */}
        <div style={{ position: "absolute", left: dividerX, top: 0, width: rightW, height: 720, overflow: "hidden" }}>
          <Panel x={0} y={0} w={rightW} h={720} tone="success" radius={0} />
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 16,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0.6,
              color: P.success,
              opacity: structureOp,
              whiteSpace: "nowrap",
              fontFamily,
            }}
          >
            🛡 YOUR DEFENSE
          </div>

          {/* Beat 3 — the real commit that shipped the trap, with the three
              techniques it contains popping in as it scrolls past them */}
          <Group opacity={b3}>
            <LiveWindow
              file={shotsP26}
              shot="commit"
              title="github.com/.../commit/8cbd82d"
              from={468}
              hold={201}
              zoom={(t) => 1 + 0.05 * t}
              focus={{ x: 0.5, y: 0.3 }}
              opacity={b3}
              win={COMMIT_WIN}
            />
            <FilterChip
              x={COMMIT_WIN.x + COMMIT_WIN.w - 226}
              y={COMMIT_WIN.y + 42 + 14}
              text="send-contact-email/index.ts"
              icon="⚙"
              color={P.accent}
              scale={Math.min(1.05, chipPop)}
              opacity={Math.min(1, chipPop)}
            />
            {TECHNIQUES.map((t, i) => {
              const s = pop(t.activateAt);
              return (
                <StatPill
                  key={t.text}
                  x={COMMIT_WIN.x}
                  y={COMMIT_WIN.y + COMMIT_WIN.h + 16 + i * 44}
                  emoji={t.emoji}
                  text={t.text}
                  tone={t.tone}
                  fontSize={15}
                  scale={Math.min(1.05, s)}
                  opacity={Math.min(1, s)}
                />
              );
            })}
          </Group>

          {/* Beat 4 — the real page, undisturbed, while real messages arrive
              underneath it */}
          <Group opacity={b4}>
            <LiveWindow
              file={shotsP26}
              shot="page"
              title="vitalii.no/features/3-tier-spam-protection..."
              from={678}
              hold={145}
              zoom={(t) => 1 + 0.04 * t}
              focus={{ x: 0.5, y: 0.35 }}
              opacity={b4}
              win={PAGE_WIN}
            />
            <div style={{ position: "absolute", left: PAGE_WIN.x, top: PAGE_WIN.y + PAGE_WIN.h + 12, width: 400 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  color: P.success,
                  marginBottom: 10,
                  fontFamily,
                }}
              >
                REAL MESSAGES GET THROUGH
              </div>
              <ArrivalRow text="Kari N. — pricing question" t={arrival[0]} />
              <ArrivalRow text="Ola H. — project inquiry" t={arrival[1]} />
              <ArrivalRow text="Team @ Acme — collab request" t={arrival[2]} />
            </div>
          </Group>

          {/* Beat 5 — the payoff number, dominating the now-huge order side */}
          <Group opacity={b5}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 430,
                width: rightW,
                textAlign: "center",
                fontFamily,
              }}
            >
              <div
                style={{
                  fontSize: 118,
                  lineHeight: 1,
                  fontWeight: 800,
                  letterSpacing: -3,
                  color: P.success,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pct}%
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  color: P.muted,
                }}
              >
                FEWER SPAM MESSAGES
              </div>
            </div>
          </Group>
        </div>

        {/* ════ Divider — slides left as order takes over ════ */}
        <div
          style={{
            position: "absolute",
            left: dividerX - 3,
            top: 0,
            width: 6,
            height: 720,
            background: P.ink,
            opacity: 0.85 * structureOp,
            boxShadow: "0 0 18px rgba(0,0,0,0.25)",
          }}
        />

        {/* ════ Caption backdrop — keeps every CaptionBand legible over the
             full-bleed spam feed / live recordings behind it ════ */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 606,
            width: 1280,
            height: 114,
            background: "linear-gradient(180deg, rgba(240,250,246,0) 0%, rgba(240,250,246,0.92) 28%, rgba(240,250,246,0.92) 100%)",
          }}
        />

        {/* ════ Beat 1 caption — the problem, hero count on the chaos side ════ */}
        <Group opacity={b1}>
          <div
            style={{
              position: "absolute",
              left: Math.max(0, leftW / 2 - 260),
              top: 96,
              width: 520,
              height: 216,
              borderRadius: 26,
              background: "rgba(240,250,246,0.9)",
              boxShadow: "0 16px 36px rgba(0,0,0,0.22)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 130,
              width: Math.max(leftW, 300),
              textAlign: "center",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 132, lineHeight: 1, fontWeight: 800, color: P.danger }}>{spamCount}</div>
            <div style={{ marginTop: 8, fontSize: 20, fontWeight: 700, letterSpacing: 1.2, color: P.muted }}>
              SPAM MESSAGES / DAY
            </div>
          </div>
          <CaptionBand
            text="Within days of launching, my contact form was buried under spam — SEO offers, casino links, crypto junk."
            tone="danger"
          />
        </Group>

        {/* ════ Beat 2 caption — no CAPTCHA, sliding onto the divider ════ */}
        <Group opacity={b2}>
          <IconCard
            x={dividerX - 90}
            y={capY}
            w={180}
            emoji="🧩"
            title="No CAPTCHA"
            sub="real visitors never feel like suspects"
            tone="danger"
            scale={Math.min(1.05, capScale)}
            opacity={Math.min(1, capScale)}
          />
          <CaptionBand text="I didn't want a CAPTCHA — that treats every real visitor like a suspect." tone="accent" />
        </Group>

        {/* ════ Beat 3 caption — the trap, the one tech mention ════ */}
        <Group opacity={b3}>
          <CaptionBand
            text="A three-layer trap inside one Edge Function: a hidden field, a timing check, and a rate limit."
            tone="accent"
          />
        </Group>

        {/* ════ Beat 4 caption ════ */}
        <Group opacity={b4}>
          <CaptionBand text="Bots trip one of the three instantly — real people never even notice it's there." />
        </Group>

        {/* ════ Beat 5 caption — holds to the end ════ */}
        <Group opacity={b5}>
          <CaptionBand text="Spam: down 98 percent." tone="success" fontSize={26} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
