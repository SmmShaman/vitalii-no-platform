/**
 * FeatureSpamProtection — feature p26 — 1280x720 @ 30fps, VOICE-SYNCED (955
 * frames), mood "sand".
 *
 * ARCHETYPE 0 — "split duel". The whole canvas is halved by a divider whose
 * x-position slides over the course of the clip: chaos (spam) lives on the
 * left, order (the 3-tier defense) lives on the right, BOTH alive at once for
 * the entire clip. Early on the chaos side is wide (spam is the problem being
 * described); as the defense gets built and the result lands, the divider
 * slides left and the order side swallows most of the frame — spam visually
 * squeezed into a thin trickle by the end.
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
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.sand;

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

type Check = { emoji: string; title: string; sub: string; tone: Tone; x: number; activateAt: number };

const CHECKS: Check[] = [
  { emoji: "🍯", title: "Honeypot field", sub: "a bot fills it in", tone: "accent", x: 40, activateAt: 484 },
  { emoji: "⏱", title: "3-second timer", sub: "too fast is a bot", tone: "accent", x: 214, activateAt: 540 },
  { emoji: "🚦", title: "Rate limit", sub: "5 per 10 minutes", tone: "success", x: 388, activateAt: 600 },
];

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

  // ── Beat 4: blocked-bot flashes at each checkpoint ─────────────────
  const blockPop = [pop(690), pop(715), pop(740)];

  // ── Beat 4/5: real messages arriving in the clean inbox ────────────
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

        {/* ════ CHAOS SIDE — spam flooding in ════ */}
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

        {/* ════ ORDER SIDE — the 3-tier defense ════ */}
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

          {/* Ghost slots — foreshadow the 3 checkpoints before they activate */}
          {CHECKS.map((c) => {
            const ghostOp = structureOp * (1 - seg(frame, c.activateAt - 10, c.activateAt + 6));
            if (ghostOp <= 0.004) return null;
            return (
              <div
                key={`ghost-${c.title}`}
                style={{
                  position: "absolute",
                  left: c.x + 25,
                  top: 100,
                  width: 110,
                  height: 110,
                  borderRadius: 30,
                  border: `2px dashed ${P.border}`,
                  opacity: ghostOp * 0.7,
                }}
              />
            );
          })}

          {/* The 3 checkpoints, activating in sequence during beat 3 */}
          {CHECKS.map((c) => {
            const s = pop(c.activateAt);
            return (
              <IconCard
                key={c.title}
                x={c.x}
                y={100}
                w={160}
                emoji={c.emoji}
                title={c.title}
                sub={c.sub}
                tone={c.tone}
                scale={s}
                opacity={Math.min(1, s)}
              />
            );
          })}

          {/* Beat 4 — blocked-bot flashes right under each checkpoint */}
          <Group opacity={b4}>
            {CHECKS.map((c, i) => (
              <div
                key={`block-${c.title}`}
                style={{
                  position: "absolute",
                  left: c.x + 55,
                  top: 232,
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: P.dangerBg,
                  border: `2px solid ${P.danger}`,
                  color: P.danger,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 800,
                  transform: `scale(${Math.min(1, blockPop[i])})`,
                  opacity: Math.min(1, blockPop[i]),
                }}
              >
                ✕
              </div>
            ))}
          </Group>

          {/* Beat 4/5 — the clean inbox: real messages get through */}
          <Group opacity={Math.max(b4, b5)}>
            <div style={{ position: "absolute", left: 430, top: 100, width: 340 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  color: P.success,
                  marginBottom: 12,
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

        {/* ════ Beat 1 caption — the problem, hero count on the chaos side ════ */}
        <Group opacity={b1}>
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
