/**
 * FeatureNetlifyBlockedWholeAccountJ78 — feature j78 — 1280x720, 962 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 1 timeline, mood slate.
 *
 * A slim horizontal ribbon runs across the top of the frame for the WHOLE clip — the one
 * persistent, by-design element. Six stops sit on it left-to-right, one per beat of the real
 * incident: vanished -> blocked -> the trust problem -> moved to its own VPS -> rollback safety
 * net -> back online. Each stop is a dim, unlit outline until its own beat lands, then turns
 * solid and gets its icon + label — and, unlike a "same event, different code" ribbon, every lit
 * stop STAYS lit, so a colored fill bar creeps left-to-right underneath: by beat 6 the whole
 * ribbon reads as the finished timeline of the incident and its fix. The headline sits
 * bottom-left, small, never centered; the ribbon carries the story, per the archetype.
 *
 * Voice-synced beat table (do not shift):
 *   b1  15-148  "One morning, a website just vanished — no warning, no error." — product plate
 *               names JobBot Norway; ribbon stop 1 lands (vanished, no error).
 *   b2 157-307  "The hosting provider blocked the whole account overnight, taking two sites down
 *               with it." — two site cards go dark together; ribbon stop 2 lands (blocked).
 *   b3 316-473  "Trusting someone else's goodwill wasn't a plan — like a landlord who could lock
 *               the door." — the landlord/key analogy; ribbon stop 3 lands (one key, one host).
 *   b4 482-642  "So the site moved onto its own server, deploying straight from GitHub on every
 *               push." — LiveWindow shows the real fix commit (1d3074a, jobbot-norway). Single
 *               tech-credibility chip: "GitHub Actions". Ribbon stop 4 lands (own VPS).
 *   b5 651-774  "A broken deploy rolls itself back instead of leaving the site down." — a
 *               deploy -> health check -> rollback/stays-live schematic. Ribbon stop 5 lands.
 *   b6 783-917  "Back online in a day, deploys landing in two minutes, every time." — a
 *               LogWindow built from the feature's own numbers (no runtime log exists for this
 *               deploy script, so the lines are the real facts, not invented). Ribbon stop 6
 *               lands (back online). Holds to 962, no fade-out. Never plays the feature's own
 *               page nor the hub (gate 2).
 *
 * Persistent element: the ribbon + its fill bar, alive from frame 15 to 962, never disappears;
 * every stop it has already reached stays lit.
 * Non-crossfade transition: beat4->beat5 vertical slide (content exits up, enters from below).
 * Single tech-credibility caption: "GitHub Actions" (FilterChip, beat 4 only).
 * Real data only: the one verified commit (1d3074a, "feat(hosting): serve job.vitalii.no and
 * promo from the VPS"), the 2-minute redeploy timer, the automatic rollback, "back online in a
 * day". Emoji are strictly single-codepoint: ⚠ 🚫 🔒 🔑 🖥 🔁 ✅ ✕.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  IconCard,
  StatPill,
  FilterChip,
  FlowArrow,
  StickyNote,
  CheckBadge,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, Win } from "./live-primitives";
import shotsFile from "./shots/j78.json";

const B1_S = 15, B1_E = 148;
const B2_S = 157, B2_E = 307;
const B3_S = 316, B3_E = 473;
const B4_S = 482, B4_E = 642;
const B5_S = 651, B5_E = 774;
const B6_S = 783, B6_E = 917;
const END = 962;
const FADE = 9;

const RIBBON_Y = 108;
const RIBBON_LEFT = 90;
const RIBBON_RIGHT = 1190;

type Stop = { x: number; icon: string; label: string; land: number; tone: "danger" | "accent" | "success" };

const STOPS: Stop[] = [
  { x: 90, icon: "⚠", label: "Vanished — no warning", land: B1_S + 20, tone: "danger" },
  { x: 310, icon: "🚫", label: "Account blocked overnight", land: B2_S + 20, tone: "danger" },
  { x: 530, icon: "🔒", label: "One host held the key", land: B3_S + 20, tone: "accent" },
  { x: 750, icon: "🖥", label: "Moved to its own VPS", land: B4_S + 20, tone: "accent" },
  { x: 970, icon: "🔁", label: "Bad releases roll back", land: B5_S + 20, tone: "accent" },
  { x: 1190, icon: "✅", label: "Live again, every 2 min", land: B6_S + 20, tone: "success" },
];

const BeatLabel: React.FC<{ x: number; y: number; w: number; kicker: string; title: string; opacity: number }> = ({
  x,
  y,
  w,
  kicker,
  title,
  opacity,
}) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity, fontFamily }}>
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 3, color: B.accent, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: B.ink, marginTop: 8, lineHeight: 1.2 }}>{title}</div>
    </div>
  );
};

const WIN4: Win = { x: 660, y: 190, w: 520, h: 280 };
const WIN6: Win = { x: 220, y: 220, w: 840, h: 320 };

export const FeatureNetlifyBlockedWholeAccountJ78: React.FC = () => {
  const frame = useCurrentFrame();
  const B = MOODS.slate;

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE) * (1 - seg(frame, B5_E, B5_E + FADE));
  const b6 = seg(frame, B6_S, B6_S + FADE);

  const ribbonOn = seg(frame, B1_S, B1_S + FADE);

  // beat4 -> beat5 is a slide, not a crossfade.
  const b4ExitY = interpolate(frame, [B4_E, B4_E + FADE], [0, -34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const b5EnterY = interpolate(frame, [B5_S, B5_S + FADE], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // fill bar creeps from stop to stop as each one lands; it never retreats.
  const fillWidth = interpolate(
    frame,
    STOPS.map((s) => s.land),
    STOPS.map((s) => s.x - RIBBON_LEFT),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // beat5 internal reveal order: deploy -> health check -> branch to rollback / stays live.
  const s5Deploy = seg(frame, B5_S + 6, B5_S + 18);
  const s5Arrow1 = seg(frame, B5_S + 16, B5_S + 34);
  const s5Health = seg(frame, B5_S + 30, B5_S + 42);
  const s5Branch = seg(frame, B5_S + 44, B5_S + 62);
  const s5Outcome = seg(frame, B5_S + 58, B5_S + 72);

  return (
    <PaletteProvider value={MOODS.slate}>
      <LightBg />

      {/* ════ THE RIBBON — persistent, alive from frame 15 to the end ════ */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 210, opacity: ribbonOn }}>
        <div
          style={{
            position: "absolute",
            left: RIBBON_LEFT,
            top: RIBBON_Y,
            width: RIBBON_RIGHT - RIBBON_LEFT,
            height: 4,
            borderRadius: 2,
            background: B.border,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: RIBBON_LEFT,
            top: RIBBON_Y,
            width: Math.max(0, fillWidth),
            height: 4,
            borderRadius: 2,
            background: B.accent,
          }}
        />

        {STOPS.map((s) => {
          const lit = seg(frame, s.land, s.land + 14);
          return (
            <div key={s.x}>
              <div
                style={{
                  position: "absolute",
                  left: s.x - 27,
                  top: RIBBON_Y - 27,
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: lit > 0.5 ? (s.tone === "danger" ? B.dangerBg : s.tone === "success" ? B.successBg : B.accentBg) : B.card,
                  border: `2.5px solid ${lit > 0.5 ? (s.tone === "danger" ? B.danger : s.tone === "success" ? B.success : B.accent) : B.border}`,
                  boxShadow: "0 8px 20px rgba(16,24,40,0.14)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    opacity: lit,
                    transform: `scale(${0.6 + lit * 0.4})`,
                  }}
                >
                  {s.icon}
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: s.x - 100,
                  top: RIBBON_Y + 40,
                  width: 200,
                  textAlign: "center",
                  fontFamily,
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: s.tone === "danger" ? B.danger : s.tone === "success" ? B.success : B.accent,
                  opacity: lit,
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* beat 1 — name the product plainly, then the symptom */}
      <Group opacity={b1}>
        <StickyNote
          x={220}
          y={230}
          w={840}
          text="🖥 JobBot Norway — watches FINN.no job ads for its users, around the clock"
        />
        <StatPill x={430} y={382} emoji="⚠" text="One morning the site was just gone — no warning, no error" tone="danger" />
        <BeatLabel x={70} y={560} w={650} kicker="THE MORNING" title="A website just vanished — no warning, no error" opacity={1} />
      </Group>

      {/* beat 2 — the whole account blocked, two sites down at once */}
      <Group opacity={b2}>
        <IconCard x={130} y={195} w={260} emoji="🚫" title="job.vitalii.no" sub="offline" tone="danger" />
        <IconCard x={560} y={195} w={260} emoji="🚫" title="promo subdomain" sub="offline" tone="danger" />
        <StatPill x={900} y={240} emoji="🚫" text="One block, both sites down at once" tone="danger" />
        <Panel x={90} y={430} w={1100} h={90} tone="danger">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              padding: "0 28px",
              fontFamily,
              fontSize: 19,
              fontWeight: 700,
              color: B.danger,
              lineHeight: 1.3,
            }}
          >
            🚫 Netlify suspended the whole account — every site under it went dark at once
          </div>
        </Panel>
        <BeatLabel x={70} y={560} w={680} kicker="THE BLOCK" title="The whole account blocked overnight, taking two sites down" opacity={1} />
      </Group>

      {/* beat 3 — the landlord/key analogy: relying on someone else's goodwill */}
      <Group opacity={b3}>
        <Panel x={170} y={230} w={420} h={210} tone="card">
          <div style={{ padding: "22px 24px 0", fontFamily, fontSize: 14, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            THE ARRANGEMENT
          </div>
          <div style={{ padding: "8px 24px 0", fontFamily, fontSize: 19, fontWeight: 600, color: B.ink, lineHeight: 1.45 }}>
            One landlord, one key — no lease said they had to hand it back.
          </div>
        </Panel>
        <IconCard x={670} y={225} w={220} emoji="🔒" title="Their goodwill" sub="was the whole plan" tone="danger" />
        <StatPill x={940} y={300} emoji="🔑" text="No second key existed" tone="danger" />
        <BeatLabel x={70} y={560} w={650} kicker="THE RISK" title="Trusting one host's goodwill wasn't a plan" opacity={1} />
      </Group>

      {/* beat 4 — the fix, shown as the real commit */}
      <Group opacity={b4} dy={b4ExitY}>
        <StatPill x={70} y={230} emoji="🖥" text="The site moved onto its own server" tone="accent" />
        <LiveWindow
          file={shotsFile}
          shot="commit"
          title="github.com/SmmShaman/jobbot-norway"
          from={B4_S}
          hold={B4_E - B4_S}
          win={WIN4}
          opacity={1}
          zoom={() => 2.2}
          focus={{ x: 0.26, y: 0.22 }}
        />
        <FilterChip x={WIN4.x} y={WIN4.y + WIN4.h + 24} icon="🐙" text="GitHub Actions" color={B.accent} />
        <BeatLabel x={70} y={560} w={600} kicker="THE FIX" title="Deploying straight from GitHub on every push" opacity={1} />
      </Group>

      {/* beat 5 — the rollback safety net */}
      <Group opacity={b5} dy={b5EnterY}>
        <Panel x={90} y={220} w={230} h={150} tone="card" opacity={s5Deploy}>
          <div style={{ padding: "16px 18px 0", fontFamily, fontSize: 14, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            NEW BUILD
          </div>
          <div style={{ padding: "4px 18px 0", fontFamily, fontSize: 17, fontWeight: 700, color: B.ink }}>
            deploy script runs
          </div>
        </Panel>
        <FlowArrow x={330} y={295} len={100} color={B.accent} progress={s5Arrow1} />
        <Panel x={440} y={220} w={230} h={150} tone="card" opacity={s5Health}>
          <div style={{ padding: "16px 18px 0", fontFamily, fontSize: 14, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            HEALTH CHECK
          </div>
          <div style={{ padding: "4px 18px 0", fontFamily, fontSize: 17, fontWeight: 700, color: B.ink }}>
            does it answer 200 OK?
          </div>
        </Panel>
        <FlowArrow x={680} y={255} len={90} color={B.danger} progress={s5Branch * 0.9} />
        <Panel x={780} y={195} w={250} h={110} tone="danger" opacity={s5Outcome}>
          <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 18px", fontFamily, fontSize: 17, fontWeight: 800, color: B.danger, lineHeight: 1.3 }}>
            ✕ rolls back, marked bad, never served
          </div>
        </Panel>
        <FlowArrow x={680} y={335} len={90} color={B.success} progress={s5Branch * 0.9} />
        <Panel x={780} y={335} w={250} h={110} tone="success" opacity={s5Outcome}>
          <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 18px", fontFamily, fontSize: 17, fontWeight: 800, color: B.success, lineHeight: 1.3 }}>
            ✓ passes, stays live
          </div>
        </Panel>
        <BeatLabel x={70} y={560} w={680} kicker="THE SAFETY NET" title="A broken deploy rolls itself back instead of leaving the site down" opacity={1} />
      </Group>

      {/* beat 6 — the result, in the deploy script's own numbers. holds to the end, no page or hub. */}
      <Group opacity={b6}>
        <LogWindow
          title="deploy-check.timer · job.vitalii.no"
          from={B6_S + 10}
          every={34}
          fontSize={20}
          win={WIN6}
          opacity={1}
          lines={[
            { t: "*/2 min", text: "deploy-check.timer → looking for new build", tone: "muted" },
            { text: "found artifact → unpack release + flip symlink", tone: "ink" },
            { text: "health check → 200 OK", tone: "success" },
            { t: "if fail", text: "roll back, mark release bad, never served", tone: "danger" },
            { t: "result", text: "back online in under a day, zero platform dependency", tone: "success" },
            { t: "now", text: "every push live within 2 minutes", tone: "accent" },
          ]}
        />
        <CheckBadge x={WIN6.x + WIN6.w - 30} y={WIN6.y - 20} />
        <BeatLabel x={70} y={560} w={700} kicker="THE RESULT" title="Back online in a day — deploys land in two minutes, every time" opacity={1} />
      </Group>
    </PaletteProvider>
  );
};
