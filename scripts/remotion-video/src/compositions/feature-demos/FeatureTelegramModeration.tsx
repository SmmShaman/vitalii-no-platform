/**
 * FeatureTelegramModeration — feature p18 — 1280x720, 1002 frames @30fps.
 * VOICE-SYNCED (owner rule, 2026-08-31) — the beat windows below are measured
 * from the real voiceover, not a designer's guess. Rebuild the audio and you
 * must rebuild these numbers with it.
 *
 * Art direction handed down by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md), NOT drawn locally:
 *   archetype 1 "timeline ribbon" — a horizontal band spans the frame at
 *     y=555; a stamp lands on it, left→right, the moment each beat's event
 *     happens. It is the one element that survives every beat, so the clip
 *     reads as one line of progress instead of five slides.
 *   mood "mint" — `<PaletteProvider value={MOODS.mint}>` wraps the whole tree.
 *
 * Beat windows (measured, edge-tts build, fps 30):
 *   b1  15-216  "Fifty articles a day. Every one of them needed a decision,
 *                and every decision meant opening something else."
 *   b2 225-388  "Pick the picture. Pick the language. Pick where it goes.
 *                Hours of it, every single day."
 *   b3 397-583  "Now it all happens inside one Telegram message, the way a
 *                form fills itself in as you tap."
 *   b4 592-805  "The message rewrites itself after every tap. Same bubble,
 *                next question. Nothing to open, nothing to type."
 *   b5 814-957  "Hours per article became eight seconds. Four taps, and it
 *                is published."
 *   tail 957-1002 — b5 HOLDS, it does not fade to an empty frame.
 *
 * Sync notes: b3 talks about "one message" only conceptually (two icon
 * cards, chat→form) — the actual Telegram bubble mockup does not appear
 * until b4, because b4 is the beat that says it rewrites itself; showing the
 * bubble earlier would foreshadow the payoff before the words land. The
 * b3→b4 change is a slide+scale push along the ribbon, not a plain
 * crossfade: b3's cards slide left as they leave, b4's bubble pushes in
 * from the right and scales up to full size.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  BrowserWindow,
  SkeletonScroll,
  FilterChip,
  StatPill,
  IconCard,
  FlowArrow,
  Cursor,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.mint;

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const BEATS = {
  b1: [15, 216],
  b2: [225, 388],
  b3: [397, 583],
  b4: [592, 805],
  b5: [814, 957],
} as const;

/** Ribbon stamp: a small circle that lands on the timeline and never leaves. */
const Stamp: React.FC<{ x: number; emoji: string; label: string; color: string; scale: number; opacity: number }> = ({
  x,
  emoji,
  label,
  color,
  scale,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 20,
          top: 535,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: P.card,
          border: `2.5px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 19,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          boxShadow: cardShadow,
          opacity,
          fontFamily,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          position: "absolute",
          left: x - 74,
          top: 584,
          width: 148,
          textAlign: "center",
          fontSize: 14.5,
          fontWeight: 700,
          color,
          opacity,
          fontFamily,
        }}
      >
        {label}
      </div>
    </>
  );
};

export const FeatureTelegramModeration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  /** Zone visibility: fades in after the beat opens, fully gone before it closes. */
  const zone = (name: keyof typeof BEATS) => {
    const [s, e] = BEATS[name];
    return Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));
  };

  const b1 = zone("b1");
  const b2 = zone("b2");
  const b3 = zone("b3");
  const b4 = zone("b4");
  // b5 has nothing to hand over to — it holds through the tail instead of fading out.
  const b5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);

  // ── Ribbon spine — present from the first frame, grows as the story moves ──
  const ribbonX0 = 110;
  const ribbonW = 1060;
  const ribbonIn = seg(frame, 8, 24);
  const ribbonProgress = interpolate(frame, [15, 957], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const stamps = [
    { x: ribbonX0, start: BEATS.b1[0] + 6, emoji: "📥", label: "50+ / day", color: P.danger },
    { x: ribbonX0 + 265, start: BEATS.b2[0] + 6, emoji: "🖼️", label: "manual picks", color: P.danger },
    { x: ribbonX0 + 530, start: BEATS.b3[0] + 6, emoji: "💬", label: "one message", color: P.accent },
    { x: ribbonX0 + 795, start: BEATS.b4[0] + 6, emoji: "🔁", label: "rewrites itself", color: P.accent },
    { x: ribbonX0 + 1060, start: BEATS.b5[0] + 6, emoji: "✅", label: "8 seconds", color: P.success },
  ];

  // ── Beat 1: the problem — 50+/day, every one a decision ──
  const scroll = frame * 2.2;
  const pill1 = pop(BEATS.b1[0] + 32);
  const pill2 = pop(BEATS.b1[0] + 44);
  const pill3 = pop(BEATS.b1[0] + 56);
  const numberPop = pop(BEATS.b1[0] + 14);

  // ── Beat 2: the manual ledger — pick, pick, pick, hours of it ──
  const tap2 = [252, 292, 332];
  const rows2 = [
    { emoji: "🖼️", text: "Pick the picture" },
    { emoji: "🌍", text: "Pick the language" },
    { emoji: "📲", text: "Pick where it goes" },
  ];
  const rowOp2 = tap2.map((t) => seg(frame, t - 8, t + 6));
  const cx2 = interpolate(frame, [231, tap2[0], tap2[1], tap2[2], 372], [820, 380, 380, 380, 820], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy2 = interpolate(frame, [231, tap2[0], tap2[1], tap2[2], 372], [420, 156, 250, 344, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp2 = seg(frame, 231, 240) * (1 - seg(frame, 366, 378));
  const click2a = seg(frame, tap2[0], tap2[0] + 12, Easing.out(Easing.quad));
  const click2b = seg(frame, tap2[1], tap2[1] + 12, Easing.out(Easing.quad));
  const click2c = seg(frame, tap2[2], tap2[2] + 12, Easing.out(Easing.quad));
  const totalOp2 = seg(frame, 348, 364, Easing.out(Easing.cubic));

  // ── Beat 3 → 4 push transition (not a plain crossfade) ──
  const b3ExitT = seg(frame, BEATS.b3[1] - 10, BEATS.b3[1] - 2);
  const b3TranslateX = -50 * b3ExitT;
  const b4EnterT = seg(frame, BEATS.b4[0] + 2, BEATS.b4[0] + 16);
  const b4TranslateX = 60 * (1 - b4EnterT);
  const b4Scale = 0.94 + 0.06 * b4EnterT;

  // ── Beat 3: the concept — one message, fills itself in ──
  const card3a = pop(BEATS.b3[0] + 10);
  const card3b = pop(BEATS.b3[0] + 26);
  const arr3 = seg(frame, BEATS.b3[0] + 20, BEATS.b3[0] + 40, Easing.inOut(Easing.cubic));

  // ── Beat 4: the actual bubble, rewriting itself three times ──
  const stepImgOp = seg(frame, 610, 622) * (1 - seg(frame, 672, 684));
  const stepLangOp = seg(frame, 672, 684) * (1 - seg(frame, 738, 750));
  const stepPlatOp = seg(frame, 738, 750) * (1 - seg(frame, 793, 803));
  const cx4 = interpolate(frame, [602, 618, 684, 750, 793], [700, 230, 475, 710, 880], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy4 = interpolate(frame, [602, 618, 684, 750, 793], [400, 300, 300, 300, 350], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp4 = seg(frame, 602, 610) * (1 - seg(frame, 793, 803));
  const click4a = seg(frame, 618, 630, Easing.out(Easing.quad));
  const click4b = seg(frame, 684, 696, Easing.out(Easing.quad));
  const click4c = seg(frame, 750, 762, Easing.out(Easing.quad));
  const creditOp = seg(frame, 700, 716) * (1 - seg(frame, 795, 803));

  // ── Beat 5: the payoff — hours → 8 seconds, 4 taps, published ──
  const beforeIn = seg(frame, BEATS.b5[0] + 6, BEATS.b5[0] + 20);
  const arrRes = seg(frame, BEATS.b5[0] + 18, BEATS.b5[0] + 34, Easing.inOut(Easing.cubic));
  const afterIn = pop(BEATS.b5[0] + 28);
  const check = pop(BEATS.b5[0] + 46);
  const resultOp = seg(frame, BEATS.b5[0] + 44, BEATS.b5[0] + 60, Easing.out(Easing.cubic));

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />
      <PaletteProvider value={P}>
        <Group opacity={loopFade(frame, durationInFrames)}>
          {/* ════ Persistent headline — small, bottom-left, never centered ════ */}
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 626,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: P.accent,
              opacity: seg(frame, 18, 34),
              fontFamily,
            }}
          >
            Telegram moderation
          </div>
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 652,
              fontSize: 20,
              fontWeight: 700,
              color: P.ink,
              opacity: seg(frame, 18, 34),
              fontFamily,
            }}
          >
            One message, edited in place
          </div>

          {/* ════ Ribbon spine — the one element that survives every beat ════ */}
          <div
            style={{
              position: "absolute",
              left: ribbonX0,
              top: 552,
              width: ribbonW,
              height: 6,
              borderRadius: 3,
              background: P.border,
              opacity: ribbonIn,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: ribbonX0,
              top: 552,
              width: ribbonW * ribbonProgress,
              height: 6,
              borderRadius: 3,
              background: P.accent,
              opacity: ribbonIn,
            }}
          />
          {stamps.map((s) => (
            <Stamp
              key={s.label}
              x={s.x}
              emoji={s.emoji}
              label={s.label}
              color={s.color}
              scale={Math.min(1, pop(s.start))}
              opacity={Math.min(1, pop(s.start))}
            />
          ))}

          {/* ════ Beat 1 — PROBLEM ════ */}
          <Group opacity={b1}>
            <BrowserWindow x={80} y={90} w={620} h={330} title="Telegram — moderation queue (50+ waiting)" opacity={1}>
              <SkeletonScroll w={620} h={288} offset={scroll} />
            </BrowserWindow>
            <div
              style={{
                position: "absolute",
                left: 740,
                top: 78,
                fontSize: 132,
                fontWeight: 800,
                letterSpacing: -4,
                color: P.danger,
                opacity: Math.min(1, numberPop),
                fontFamily,
              }}
            >
              50+
            </div>
            <div
              style={{
                position: "absolute",
                left: 744,
                top: 222,
                fontSize: 23,
                fontWeight: 650,
                color: P.muted,
                opacity: Math.min(1, numberPop),
                fontFamily,
              }}
            >
              articles / day, 6 channels + RSS
            </div>
            <StatPill x={744} y={282} emoji="🖼️" text="Pick an image — every article" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
            <StatPill x={744} y={336} emoji="🌍" text="Pick a language — every article" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
            <StatPill x={744} y={390} emoji="📲" text="Pick a platform — every article" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
          </Group>

          {/* ════ Beat 2 — MANUAL LEDGER ════ */}
          <Group opacity={b2}>
            <Panel x={340} y={110} w={600} h={300} tone="danger" opacity={1}>
              {rows2.map((r, i) => (
                <div
                  key={r.text}
                  style={{
                    position: "absolute",
                    left: 40,
                    top: 46 + i * 84,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontSize: 25,
                    fontWeight: 700,
                    color: P.ink,
                    opacity: rowOp2[i],
                    transform: `translateX(${(1 - rowOp2[i]) * 20}px)`,
                    fontFamily,
                  }}
                >
                  <span style={{ fontSize: 32 }}>{r.emoji}</span>
                  {r.text}
                  <span style={{ fontSize: 20, color: P.danger, fontWeight: 700 }}>— by hand</span>
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 40,
                  top: 234,
                  fontSize: 34,
                  fontWeight: 800,
                  color: P.danger,
                  opacity: totalOp2,
                  fontFamily,
                }}
              >
                = Hours, every single day
              </div>
            </Panel>
            <Cursor x={cx2} y={cy2} opacity={cursorOp2} click={Math.max(click2a % 1, click2b % 1, click2c % 1)} />
          </Group>

          {/* ════ Beat 3 — CONCEPT: one message, fills itself in ════ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: b3,
              transform: `translateX(${b3TranslateX}px)`,
              fontFamily,
            }}
          >
            <IconCard x={330} y={150} w={280} emoji="💬" title="One chat message" sub="no new one is ever sent" tone="accent" scale={Math.min(1, card3a)} opacity={Math.min(1, card3a)} />
            <FlowArrow x={636} y={200} len={100} progress={arr3} color={P.accent} />
            <IconCard x={670} y={150} w={280} emoji="📝" title="Fills itself in" sub="as you tap, right there" tone="accent" scale={Math.min(1, card3b)} opacity={Math.min(1, card3b)} />
          </div>

          {/* ════ Beat 4 — THE BUBBLE, rewriting itself ════ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: b4,
              transform: `translateX(${b4TranslateX}px) scale(${b4Scale})`,
              transformOrigin: "center",
              fontFamily,
            }}
          >
            <Panel x={110} y={150} w={1060} h={270} tone="accent" opacity={1}>
              <div style={{ position: "absolute", left: 30, top: 22, fontSize: 20, fontWeight: 700, color: P.ink, fontFamily }}>
                📰 TechCorp raises $10M — ready for review
              </div>
              <div style={{ position: "absolute", left: 30, top: 54, fontSize: 15, fontWeight: 600, color: P.muted, fontFamily }}>
                Same chat bubble, updated at every step
              </div>
              <div style={{ position: "absolute", left: 30, top: 108, fontSize: 16.5, fontWeight: 700, color: P.accent, opacity: stepImgOp, fontFamily }}>
                Step 1 of 3 — choose the photo
              </div>
              <div style={{ position: "absolute", left: 30, top: 108, fontSize: 16.5, fontWeight: 700, color: P.accent, opacity: stepLangOp, fontFamily }}>
                Step 2 of 3 — choose the language
              </div>
              <div style={{ position: "absolute", left: 30, top: 108, fontSize: 16.5, fontWeight: 700, color: P.accent, opacity: stepPlatOp, fontFamily }}>
                Step 3 of 3 — choose the platform
              </div>
              <FilterChip x={30} y={150} text="🖼️ Keep photo" icon="" opacity={stepImgOp} />
              <FilterChip x={280} y={150} text="✨ Generate new" icon="" opacity={stepImgOp} />
              <FilterChip x={30} y={150} text="🇬🇧 English" icon="" opacity={stepLangOp} />
              <FilterChip x={280} y={150} text="🇳🇴 Norwegian" icon="" opacity={stepLangOp} />
              <FilterChip x={530} y={150} text="🇺🇦 Ukrainian" icon="" opacity={stepLangOp} />
              <FilterChip x={30} y={150} text="LinkedIn" icon="" opacity={stepPlatOp} />
              <FilterChip x={280} y={150} text="Instagram" icon="" opacity={stepPlatOp} />
              <FilterChip x={530} y={150} text="Facebook" icon="" opacity={stepPlatOp} />
              <div style={{ position: "absolute", left: 30, top: 220, fontSize: 14.5, fontWeight: 600, color: P.muted, opacity: Math.max(stepImgOp, stepLangOp, stepPlatOp) * 0.85, fontFamily }}>
                No new message is sent — Telegram just edits this one
              </div>
            </Panel>
            <Cursor x={cx4} y={cy4} opacity={cursorOp4} click={Math.max(click4a % 1, click4b % 1, click4c % 1)} />
            <CaptionBand
              y={478}
              text="action_prefix_${newsId} — one code, fits Telegram's 64-byte callback limit"
              tone="card"
              fontSize={18}
              opacity={creditOp * 0.85}
            />
          </div>

          {/* ════ Beat 5 — RESULT, holds through the tail ════ */}
          <Group opacity={b5}>
            <Panel x={150} y={150} w={400} h={190} tone="danger" opacity={beforeIn}>
              <div style={{ padding: "24px 28px", fontFamily }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: P.danger, letterSpacing: 1 }}>BEFORE</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: P.ink, marginTop: 12 }}>Hours</div>
                <div style={{ fontSize: 22, fontWeight: 650, color: P.muted, marginTop: 6 }}>per article, by hand</div>
              </div>
            </Panel>
            <FlowArrow x={568} y={238} len={150} progress={arrRes} color={P.success} />
            <Panel x={730} y={150} w={400} h={190} tone="success" opacity={Math.min(1, afterIn)}>
              <div style={{ padding: "24px 28px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: P.success, letterSpacing: 1 }}>NOW</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: P.ink, marginTop: 12 }}>8 seconds</div>
                <div style={{ fontSize: 22, fontWeight: 650, color: P.muted, marginTop: 6 }}>one message, 4 taps</div>
              </div>
            </Panel>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 384,
                width: 1280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                opacity: resultOp,
                fontFamily,
              }}
            >
              <div style={{ position: "relative", width: 48, height: 48 }}>
                <CheckBadge x={0} y={0} size={48} scale={check} opacity={Math.min(1, check)} />
              </div>
              <span style={{ fontSize: 38, fontWeight: 800, color: P.success }}>4 taps — and it is published</span>
            </div>
          </Group>
        </Group>
      </PaletteProvider>
    </div>
  );
};
