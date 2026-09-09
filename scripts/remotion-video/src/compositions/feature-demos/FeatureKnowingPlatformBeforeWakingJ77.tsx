/**
 * FeatureKnowingPlatformBeforeWakingJ77 — feature j77 — 1280x720, 1084 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 1 "timeline ribbon" (drawn by the orchestrating session, not
 * re-drawn here), mood sand: a slim horizontal band runs across the top of
 * the frame for the whole clip. Four real story beats land on it left→right
 * as stamps (problem, problem, fix, result) — beat 3's metaphor does not get
 * its own stamp, it is a cutaway panel while the ribbon holds. Every beat's
 * headline sits bottom-left, small, never centered — the ribbon carries the
 * shape of the story.
 *
 * UI beats (4, 5) play REAL recordings via LiveWindow, driven by
 * shots/j77.json: the fix's own commit + the feature's own page (the bot's
 * actual overnight run history is not a page that can be recorded, so beats
 * 1-2 stay drawn, and beat 3 is an explicit metaphor).
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–220  "One day, our job-application bot woke up 17 times — and submitted exactly zero applications."
 *  b2 229–408  "It treated brand-new employer sites as total strangers, even when it already knew their software."
 *  b3 417–590  "Like calling every Ford dealership a mystery, just because you'd never visited that exact one."
 *  b4 599–817  "A Playwright-based registry now recognizes the underlying platform, so a familiar system on a new site counts as known."
 *  b5 826–1039 "It checks for captchas and dead ends before waking at all — never again 17 rows, zero submissions." — holds to 1084.
 *
 * Single tech name in the whole clip: Playwright (beat 4 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, Panel, seg, fontFamily } from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shots from "./shots/j77.json";

const P = MOODS.sand;
const RIBBON_Y = 80;
const LIVE_WIN = { x: 175, y: 172, w: 930, h: 428 };

type Stop = { x: number; land: number; icon: string; label: string; tone: "danger" | "accent" | "success"; align: "left" | "center" | "right" };

const STOPS: Stop[] = [
  { x: 220, land: 40, icon: "🌙", label: "17 wakes, 0 applications", tone: "danger", align: "left" },
  { x: 500, land: 250, icon: "👤", label: "new site treated as a stranger", tone: "danger", align: "center" },
  { x: 780, land: 620, icon: "🧭", label: "platform registry recognizes it", tone: "accent", align: "center" },
  { x: 1060, land: 850, icon: "✅", label: "checks before it wakes", tone: "success", align: "right" },
];

const toneColor = (t: Stop["tone"], P2: typeof P) => (t === "danger" ? P2.danger : t === "accent" ? P2.accent : P2.success);
const toneBg = (t: Stop["tone"], P2: typeof P) => (t === "danger" ? P2.dangerBg : t === "accent" ? P2.accentBg : P2.successBg);

const BeatLabel: React.FC<{ kicker: string; title: string; detail?: string; color: string; y?: number; compact?: boolean }> = ({
  kicker,
  title,
  detail,
  color,
  y = 520,
  compact = false,
}) => (
  <div style={{ position: "absolute", left: 66, top: y, width: 900, fontFamily }}>
    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, color: P.muted }}>{kicker}</div>
    <div style={{ fontSize: compact ? 22 : 28, fontWeight: 800, color: P.ink, marginTop: 6, lineHeight: 1.15 }}>{title}</div>
    {detail ? <div style={{ fontSize: 15, fontWeight: 600, color, marginTop: compact ? 4 : 8 }}>{detail}</div> : null}
  </div>
);

const bigNum = (val: string, label: string, x: number, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 220,
      width: 260,
      textAlign: "center",
      fontFamily,
      transform: `scale(${0.7 + 0.3 * scale})`,
      transformOrigin: "top center",
      opacity: scale,
    }}
  >
    <div style={{ fontSize: 92, fontWeight: 800, color, letterSpacing: -3, fontVariantNumeric: "tabular-nums" }}>{val}</div>
    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.6, color: P.muted, marginTop: 4 }}>{label}</div>
  </div>
);

export const FeatureKnowingPlatformBeforeWakingJ77: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 220, 236));
  const b2 = seg(frame, 229, 245) * (1 - seg(frame, 408, 424));
  const b3 = seg(frame, 417, 433) * (1 - seg(frame, 590, 606));
  const b4 = seg(frame, 599, 615) * (1 - seg(frame, 817, 833));
  const b5 = seg(frame, 826, 842); // holds through 1084, no fade-out

  // beat 4 → beat 5 is a SLIDE, not a crossfade: the fix's window pushes
  // left while the result's window pushes in from the right.
  const b4exitX = interpolate(frame, [800, 833], [0, -60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const b5slideX = interpolate(frame, [826, 860], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const ribbonOpacity = seg(frame, 0, 15);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ THE RIBBON — alive for the whole clip ════ */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 170, opacity: ribbonOpacity }}>
          <div
            style={{
              position: "absolute",
              left: 90,
              top: RIBBON_Y,
              width: 1100,
              height: 4,
              borderRadius: 2,
              background: P.border,
            }}
          />
          {STOPS.map((s) => {
            const t = seg(frame, s.land, s.land + 14);
            const active = t > 0.5;
            const color = toneColor(s.tone, P);
            const bg = toneBg(s.tone, P);
            const labelStyle: React.CSSProperties =
              s.align === "left"
                ? { left: s.x - 10, textAlign: "left", width: 300 }
                : s.align === "right"
                ? { left: s.x - 290, textAlign: "right", width: 300 }
                : { left: s.x - 150, textAlign: "center", width: 300 };
            return (
              <div key={s.x}>
                <div
                  style={{
                    position: "absolute",
                    left: s.x - 30,
                    top: RIBBON_Y - 30,
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: active ? bg : P.chipBg,
                    border: `2.5px solid ${active ? color : P.border}`,
                    boxShadow: "0 8px 20px rgba(16,24,40,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 27,
                    opacity: 0.5 + 0.5 * t,
                    transform: `scale(${0.7 + 0.3 * t})`,
                  }}
                >
                  {s.icon}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: RIBBON_Y + 40,
                    fontSize: 14,
                    fontWeight: 700,
                    color: active ? P.ink : P.muted,
                    opacity: t,
                    fontFamily,
                    ...labelStyle,
                  }}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ════ Beat 1 — 17 wakes, 0 applications ════ */}
        <Group opacity={b1}>
          {bigNum("17", "NIGHTLY WAKES", 280, P.danger, pop(30))}
          {bigNum("0", "APPLICATIONS SENT", 680, P.danger, pop(45))}
          <StatPill x={430} y={430} emoji="🌙" text="every log still said it ran" tone="danger" opacity={b1} />
          <BeatLabel
            kicker="JOB-APPLICATION BOT"
            title="It woke 17 times and applied nowhere."
            detail="Not a crash — it just never recognized anything as familiar."
            color={P.danger}
          />
        </Group>

        {/* ════ Beat 2 — new site, treated as a stranger ════ */}
        <Group opacity={b2}>
          <Panel x={310} y={200} w={280} h={170} tone="danger" />
          <Panel x={690} y={200} w={280} h={170} tone="danger" />
          <div style={{ position: "absolute", left: 310, top: 226, width: 280, textAlign: "center", fontSize: 34 }}>🧩</div>
          <div style={{ position: "absolute", left: 690, top: 226, width: 280, textAlign: "center", fontSize: 34 }}>🧩</div>
          <div style={{ position: "absolute", left: 310, top: 300, width: 280, textAlign: "center", fontSize: 14, fontWeight: 700, color: P.ink }}>
            employer-site-a.com
          </div>
          <div style={{ position: "absolute", left: 690, top: 300, width: 280, textAlign: "center", fontSize: 14, fontWeight: 700, color: P.ink }}>
            employer-site-b.com
          </div>
          <div
            style={{
              position: "absolute",
              left: 600,
              top: 250,
              width: 80,
              textAlign: "center",
              fontSize: 30,
              fontWeight: 800,
              color: P.danger,
              opacity: pop(260),
            }}
          >
            ❓
          </div>
          <BeatLabel
            kicker="SAME SOFTWARE, NEW ADDRESS"
            title="Same platform underneath — zero memory of it."
            detail="Every new employer domain looked like a total stranger."
            color={P.danger}
          />
        </Group>

        {/* ════ Beat 3 — the Ford dealership metaphor ════ */}
        <Group opacity={b3}>
          <Panel x={340} y={200} w={600} h={180} tone="card" />
          <div style={{ position: "absolute", left: 340, top: 224, width: 600, textAlign: "center", fontSize: 15, fontWeight: 700, color: P.muted, letterSpacing: 1 }}>
            THREE DEALERSHIPS, ONE BRAND
          </div>
          <div style={{ position: "absolute", left: 370, top: 268, width: 540, display: "flex", justifyContent: "space-between" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ textAlign: "center", opacity: pop(433 + i * 20) }}>
                <div style={{ fontSize: 38 }}>🏪</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: P.ink, marginTop: 4 }}>FORD</div>
                <div style={{ fontSize: 20, marginTop: 2, color: i < 2 ? P.danger : P.muted }}>{i < 2 ? "❓" : ""}</div>
              </div>
            ))}
          </div>
          <BeatLabel
            kicker="THE ANALOGY"
            title="Like asking if every Ford dealer sells Fords."
            detail="You'd never visited that exact one — the brand was never in question."
            color={P.accent}
          />
        </Group>

        {/* ════ Beat 4 — real commit, the platform registry ════ */}
        <Group opacity={b4} dy={0}>
          <div style={{ transform: `translateX(${b4exitX}px)` }}>
            <FilterChip x={LIVE_WIN.x} y={140} text="Playwright" icon="🧭" opacity={b4} />
            <LiveWindow
              file={shots}
              shot="fix"
              title="github.com — commit 87443d8 · platform registry"
              from={599}
              hold={218}
              opacity={b4}
              win={LIVE_WIN}
            />
            <BeatLabel
              kicker="PLATFORM REGISTRY"
              title="A familiar system on a new site now counts as known."
              color={P.accent}
              y={614}
              compact
            />
          </div>
        </Group>

        {/* ════ Beat 5 — real page, checks before it wakes at all ════ */}
        <Group opacity={b5}>
          <div style={{ transform: `translateX(${b5slideX}px)` }}>
            <CheckBadge x={1140} y={210} size={40} opacity={b5} scale={pop(850, 11)} />
            <LiveWindow
              file={shots}
              shot="page"
              title="vitalii.no/features/…-j77"
              from={826}
              hold={258}
              opacity={b5}
              win={LIVE_WIN}
            />
            <StatPill x={LIVE_WIN.x + LIVE_WIN.w - 250} y={140} emoji="🔒" text="captchas checked first" tone="success" opacity={b5} />
            <BeatLabel
              kicker="BEFORE IT EVER WAKES"
              title="17 wakes, 0 applications — never again."
              color={P.success}
              y={614}
              compact
            />
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
