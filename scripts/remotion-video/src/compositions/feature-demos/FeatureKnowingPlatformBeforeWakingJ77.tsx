/**
 * FeatureKnowingPlatformBeforeWakingJ77 — feature j77 — 1280x720, 1084 frames @ 30fps, VOICE-SYNCED. RE-SHOOT.
 *
 * Archetype 0 "split-duel", mood sand: the frame is split top-to-bottom by a
 * moving vertical divider into a chaos pane (left, permanently danger-tinted —
 * "the old way") and an order pane (right, phase-tinted locked→accent→
 * success — "the fix"). Both panes are full-bleed for the entire clip, so the
 * canvas is always 100% covered by the duel, never a headline floating over
 * cream space. The divider is the one element that survives every beat: it
 * SLIDES (not crossfades) at the beat3→4 and beat4→5 boundaries as the order
 * pane wins more of the frame, carrying a small phase badge (🌙→🧭→✅).
 *
 * Beats 1-3 are drawn (the overnight run history and the Ford-dealership
 * metaphor are not pages that can be recorded); the right pane shows a locked
 * "platform registry" card as a foreshadow the whole time. Beats 4 and 5 play
 * REAL recordings via LiveWindow, driven by shots/j77.json: beat 4 is the
 * platform-registry commit, beat 5 is the pre-wake-checks commit — the clip
 * ends on a commit page, never on the feature's own vitalii.no article page.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–220  "One day, our job-application bot woke up 17 times — and submitted exactly zero applications."
 *  b2 229–408  "It treated brand-new employer sites as total strangers, even when it already knew their software."
 *  b3 417–590  "Like calling every Ford dealership a mystery, just because you'd never visited that exact one."
 *  b4 599–817  "A Playwright-based registry now recognizes the underlying platform, so a familiar system on a new site counts as known."
 *  b5 826–1039 "It checks for captchas and dead ends before waking at all — never again 17 rows, zero submissions." — holds to 1084, no fade-out.
 *
 * Single tech name in the whole clip: Playwright (beat 4 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, Panel, IconCard, SkeletonScroll, seg, fontFamily } from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shots from "./shots/j77.json";

const P = MOODS.sand;

const LIVE4 = { x: 420, y: 196, w: 820, h: 420 };
const LIVE5 = { x: 150, y: 196, w: 1000, h: 420 };

const PaneLabel: React.FC<{ x: number; y: number; w: number; kicker: string; title: string; color: string }> = ({
  x,
  y,
  w,
  kicker,
  title,
  color,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily }}>
    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 3, color: P.muted }}>{kicker}</div>
    <div style={{ fontSize: 24, fontWeight: 800, color: P.ink, marginTop: 6, lineHeight: 1.2 }}>{title}</div>
    <div style={{ width: 46, height: 3, borderRadius: 2, background: color, marginTop: 10 }} />
  </div>
);

const bigNum = (val: string, label: string, x: number, y: number, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 260,
      textAlign: "center",
      fontFamily,
      transform: `scale(${0.7 + 0.3 * scale})`,
      transformOrigin: "top center",
      opacity: scale,
    }}
  >
    <div style={{ fontSize: 78, fontWeight: 800, color, letterSpacing: -3, fontVariantNumeric: "tabular-nums" }}>{val}</div>
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, color: P.muted, marginTop: 4 }}>{label}</div>
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

  // The divider is the duel: constant while beats 1-3 argue on equal ground,
  // then SLIDES (not a crossfade) as the fix takes over the frame.
  const dividerX = interpolate(
    frame,
    [0, 599, 620, 810, 830, 1084],
    [640, 640, 380, 380, 110, 110],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  const phaseAccent = seg(frame, 599, 630); // registry unlocks, holds
  const phaseSuccess = seg(frame, 810, 840); // checks land, holds on top
  const rightLockedOpacity = seg(frame, 15, 31) * (1 - seg(frame, 599, 615));

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ THE DUEL FIELD — full-bleed for the whole clip ════ */}
        <div style={{ position: "absolute", left: 0, top: 0, width: dividerX, height: 720, background: P.dangerBg }} />
        <div style={{ position: "absolute", left: dividerX, top: 0, width: 1280 - dividerX, height: 720, background: P.chipBg }} />
        <div
          style={{ position: "absolute", left: dividerX, top: 0, width: 1280 - dividerX, height: 720, background: P.accentBg, opacity: phaseAccent }}
        />
        <div
          style={{ position: "absolute", left: dividerX, top: 0, width: 1280 - dividerX, height: 720, background: P.successBg, opacity: phaseSuccess }}
        />

        {/* ════ THE DIVIDER — the one element that survives every beat ════ */}
        <div style={{ position: "absolute", left: dividerX - 3, top: 0, width: 6, height: 720, background: P.ink, opacity: 0.18 }} />
        <div
          style={{
            position: "absolute",
            left: dividerX - 19,
            top: 336,
            width: 38,
            height: 38,
            borderRadius: 19,
            background: P.card,
            border: `2px solid ${P.border}`,
            boxShadow: cardShadow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          <span style={{ position: "absolute", opacity: 1 - phaseAccent }}>🌙</span>
          <span style={{ position: "absolute", opacity: phaseAccent * (1 - phaseSuccess) }}>🧭</span>
          <span style={{ position: "absolute", opacity: phaseSuccess }}>✅</span>
        </div>

        {/* ════ Beat 1 — 17 wakes, 0 applications (left/chaos pane) ════ */}
        <Group opacity={b1}>
          <FilterChip x={60} y={44} text="17 WAKES / NIGHT" icon="🌙" color={P.danger} />
          {bigNum("17", "NIGHTLY WAKES", 50, 150, P.danger, pop(30))}
          {bigNum("0", "APPLICATIONS SENT", 330, 150, P.danger, pop(45))}
          <div style={{ position: "absolute", left: 60, top: 300, width: 560, display: "flex", justifyContent: "space-between" }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{ fontSize: 26, opacity: pop(30 + i * 10) }}>🌙</div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 60, top: 338, width: 560, textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted, fontFamily }}>
            ×17 OVERNIGHT WAKES
          </div>
          <StatPill x={60} y={400} emoji="🌙" text="every log still said it ran" tone="danger" opacity={b1} />
          <PaneLabel x={60} y={470} w={560} kicker="JOB-APPLICATION BOT" title="It woke 17 times and applied nowhere." color={P.danger} />
          <div style={{ position: "absolute", left: 60, top: 600, width: 560, borderRadius: 12, border: `1.5px solid ${P.dangerEdge}`, background: P.card, padding: "10px 16px", boxShadow: cardShadow }}>
            {["02:14 → wake #4 → 0 sent", "03:41 → wake #9 → 0 sent", "05:02 → wake #14 → 0 sent"].map((line, i) => (
              <div key={i} style={{ fontSize: 12.5, fontWeight: 600, color: P.muted, fontFamily, lineHeight: 1.7 }}>{line}</div>
            ))}
          </div>
        </Group>

        {/* ════ Beat 2 — new site, treated as a stranger (left/chaos pane) ════ */}
        <Group opacity={b2}>
          <FilterChip x={60} y={44} text="NEW SITE, SAME PLATFORM" icon="🧩" color={P.danger} />
          <Panel x={60} y={210} w={250} h={170} tone="danger" />
          <Panel x={330} y={210} w={250} h={170} tone="danger" />
          <div style={{ position: "absolute", left: 60, top: 236, width: 250, textAlign: "center", fontSize: 32 }}>🧩</div>
          <div style={{ position: "absolute", left: 330, top: 236, width: 250, textAlign: "center", fontSize: 32 }}>🧩</div>
          <div style={{ position: "absolute", left: 60, top: 310, width: 250, textAlign: "center", fontSize: 13, fontWeight: 700, color: P.ink, fontFamily }}>
            employer-site-a.com
          </div>
          <div style={{ position: "absolute", left: 330, top: 310, width: 250, textAlign: "center", fontSize: 13, fontWeight: 700, color: P.ink, fontFamily }}>
            employer-site-b.com
          </div>
          <div style={{ position: "absolute", left: 280, top: 255, width: 80, textAlign: "center", fontSize: 26, fontWeight: 800, color: P.danger, opacity: pop(260) }}>
            ❓
          </div>
          <PaneLabel x={60} y={410} w={560} kicker="SAME SOFTWARE, NEW ADDRESS" title="Same platform underneath — zero memory of it." color={P.danger} />
          <div style={{ position: "absolute", left: 60, top: 604, width: 560 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: P.muted, fontFamily, marginBottom: 8 }}>
              RECOGNITION CONFIDENCE
            </div>
            <div style={{ width: 560, height: 22, borderRadius: 11, background: P.dangerBg, border: `1.5px solid ${P.dangerEdge}`, overflow: "hidden" }}>
              <div style={{ width: "3%", height: "100%", background: P.danger }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: P.danger, marginTop: 6, fontFamily }}>0% — never seen this address before</div>
          </div>
        </Group>

        {/* ════ Beat 3 — the Ford dealership metaphor (left/chaos pane) ════ */}
        <Group opacity={b3}>
          <FilterChip x={60} y={44} text="ONE BRAND, MANY DOORS" icon="🏪" color={P.accent} />
          <Panel x={60} y={210} w={560} h={170} tone="card" />
          <div style={{ position: "absolute", left: 60, top: 230, width: 560, textAlign: "center", fontSize: 13, fontWeight: 700, color: P.muted, letterSpacing: 1, fontFamily }}>
            THREE DEALERSHIPS, ONE BRAND
          </div>
          <div style={{ position: "absolute", left: 90, top: 270, width: 500, display: "flex", justifyContent: "space-between" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ textAlign: "center", opacity: pop(433 + i * 20) }}>
                <div style={{ fontSize: 32 }}>🏪</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: P.ink, marginTop: 4, fontFamily }}>FORD</div>
                <div style={{ fontSize: 17, marginTop: 2, color: i < 2 ? P.danger : P.muted }}>{i < 2 ? "❓" : ""}</div>
              </div>
            ))}
          </div>
          <PaneLabel x={60} y={430} w={560} kicker="THE ANALOGY" title="Like asking if every Ford dealer sells Fords." color={P.accent} />
          <div style={{ position: "absolute", left: 60, top: 606, width: 560, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: P.danger, fontFamily }}>0 / 3</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: P.muted, fontFamily, lineHeight: 1.4 }}>
              dealerships recognized as
              <br />
              the same underlying platform
            </div>
          </div>
        </Group>

        {/* ════ Locked registry card — the right/order pane's foreshadow through beats 1-3 (one tall panel fills the pane top-to-bottom) ════ */}
        <Group opacity={rightLockedOpacity}>
          <Panel x={680} y={70} w={580} h={580} tone="card" />
          <div style={{ position: "absolute", left: 680, top: 96, width: 580, textAlign: "center", fontSize: 12, fontWeight: 800, letterSpacing: 2, color: P.muted, fontFamily }}>
            COMING IN THIS FIX
          </div>
          <IconCard x={800} y={140} w={340} emoji="🔒" title="Platform registry" sub="not built yet" tone="accent" opacity={rightLockedOpacity} />
          <div style={{ position: "absolute", left: 730, top: 410, width: 480, height: 160, borderRadius: 14, overflow: "hidden", border: `1.5px solid ${P.border}` }}>
            <SkeletonScroll w={480} h={160} offset={frame * 0.5} />
          </div>
          <div style={{ position: "absolute", left: 680, top: 596, width: 580, textAlign: "center", fontSize: 14, fontWeight: 700, color: P.muted, fontFamily }}>
            every unfamiliar site still looks unread
          </div>
        </Group>

        {/* ════ Beat 4 — real commit, the platform registry unlocks (right/order pane) ════ */}
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: 40, top: 270, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: P.muted, fontFamily }}>BEFORE</div>
          <StatPill x={40} y={296} emoji="🌙" text="17 wakes, 0 sent" tone="danger" opacity={b4} scale={0.92} />
          <FilterChip x={LIVE4.x} y={140} text="Playwright" icon="🧭" opacity={b4} color={P.accent} />
          <LiveWindow
            file={shots}
            shot="fix"
            title="github.com — commit 87443d8 · platform registry"
            from={599}
            hold={218}
            opacity={b4}
            win={LIVE4}
          />
          <PaneLabel
            x={LIVE4.x}
            y={LIVE4.y + LIVE4.h + 12}
            w={LIVE4.w}
            kicker="PLATFORM REGISTRY"
            title="A familiar system on a new site now counts as known."
            color={P.accent}
          />
        </Group>

        {/* ════ Beat 5 — real commit, checks before it ever wakes (order pane wins) ════ */}
        <Group opacity={b5}>
          <div style={{ position: "absolute", left: 20, top: 300, width: 70, textAlign: "center" }}>
            <div style={{ fontSize: 22, opacity: 0.35 }}>🌙</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: P.muted, marginTop: 4 }}>0</div>
          </div>
          <CheckBadge x={LIVE5.x + LIVE5.w - 40} y={150} size={40} opacity={b5} scale={pop(850, 11)} />
          <StatPill x={LIVE5.x + 20} y={140} emoji="🔒" text="captchas checked first" tone="success" opacity={b5} />
          <LiveWindow
            file={shots}
            shot="checks"
            title="github.com — commit f28763b · pre-wake checks"
            from={826}
            hold={258}
            opacity={b5}
            win={LIVE5}
          />
          <PaneLabel
            x={LIVE5.x}
            y={LIVE5.y + LIVE5.h + 12}
            w={LIVE5.w}
            kicker="BEFORE IT EVER WAKES"
            title="17 wakes, 0 applications — never again."
            color={P.success}
          />
        </Group>
      </div>
    </PaletteProvider>
  );
};
