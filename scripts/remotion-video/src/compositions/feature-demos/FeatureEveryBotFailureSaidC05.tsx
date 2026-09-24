/**
 * FeatureEveryBotFailureSaidC05 — feature c05 — 1280x720, 937 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 1 timeline, mood sand.
 *
 * RE-SHOOT #2 (2026-09-24): narration and beat windows are unchanged from every earlier cut;
 * only the staging is redrawn — the earlier layout is fully replaced by the timeline ribbon
 * below.
 *
 * A slim horizontal time band (the ribbon) runs across the top of the frame for the WHOLE
 * clip — the one persistent, by-design element. Three stamps sit on it left-to-right, one per
 * real failure code (429 quota / 401 key / 404 model). In beat 1 all three read as the exact
 * same generic "processing error" event — the problem. In beat 2 the ribbon is repurposed as a
 * literal calendar axis (APR→AUG) while the three stamps sit dimmed in the background. In beat
 * 3 the raw codes surface above the stamps and funnel into one collapsed message — the
 * mechanism of the bug. In beat 4 the stamps stay dimmed while a LiveWindow shows the real fix
 * commit. In beat 5 — the payoff — each stamp finally morphs into its own icon and name. The
 * headline sits bottom-left, small, never centered; the ribbon itself carries the story, per
 * the archetype.
 *
 * Voice-synced beat table (do not shift):
 *   b1  15-174  "Every time the bot broke, it just said 'processing error' — no matter what
 *                actually failed." — all three ribbon stamps show the same generic icon.
 *   b2 183-372  "That's exactly how a revoked API key sat unnoticed for four months, from
 *                April to August." — ribbon becomes a month axis; a marker crawls APR→AUG;
 *                a LogWindow reconstructs the same five dated facts (no runtime log exists for
 *                this product, so the lines are built from the feature row's own numbers).
 *   b3 381-489  "The bot just looked like it was having a bad day, over and over." — the three
 *                raw codes surface above the stamps and funnel into one collapsed message.
 *   b4 498-630  "Now a classifier reads the raw error text before it reaches the user." — a
 *                LiveWindow shows the real commit history of the fix. Single tech-credibility
 *                chip: "TypeScript".
 *   b5 639-892  "Quota, dead key, retired model — three failures that used to look identical,
 *                now each names itself on the very first message." — the three ribbon stamps
 *                morph into distinct icons+names; a LogWindow contrasts old vs. new. Holds to
 *                937, no fade-out. Never plays the feature's own page nor the hub (gate 2).
 *
 * Persistent element: the ribbon, alive from frame 15 to 937, never disappears.
 * Non-crossfade transition: beat3→beat4 vertical slide (content exits up, enters from below).
 * Single tech-credibility caption: "TypeScript" (FilterChip, beat 4 only).
 * Real data only: the three failure codes and the four-month span, unchanged from the first
 * cut. Emoji are strictly single-codepoint: 📅 ⚠ ⏳ 🔑 🧠 🧩 ✕ ✓.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  FlowArrow,
  StickyNote,
  CheckBadge,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, Win } from "./live-primitives";
import shotsFile from "./shots/c05.json";

const B1_S = 15, B1_E = 174;
const B2_S = 183, B2_E = 372;
const B3_S = 381, B3_E = 489;
const B4_S = 498, B4_E = 630;
const B5_S = 639, B5_E = 892;
const END = 937;
const FADE = 9;

const RIBBON_Y = 108;
const RIBBON_LEFT = 90;
const RIBBON_RIGHT = 1190;

type Stop = { x: number; code: string; short: string; after: string; afterLabel: string; land: number };

const STOPS: Stop[] = [
  { x: 255, code: "429", short: "quota exceeded", after: "⏳", afterLabel: "Quota exceeded", land: B5_S + 24 },
  { x: 640, code: "401", short: "invalid key", after: "🔑", afterLabel: "Key revoked", land: B5_S + 56 },
  { x: 1025, code: "404", short: "model retired", after: "🧠", afterLabel: "Model retired", land: B5_S + 88 },
];

const MONTHS = [
  { x: RIBBON_LEFT, label: "APR" },
  { x: RIBBON_LEFT + (RIBBON_RIGHT - RIBBON_LEFT) * 0.25, label: "MAY" },
  { x: RIBBON_LEFT + (RIBBON_RIGHT - RIBBON_LEFT) * 0.5, label: "JUN" },
  { x: RIBBON_LEFT + (RIBBON_RIGHT - RIBBON_LEFT) * 0.75, label: "JUL" },
  { x: RIBBON_RIGHT, label: "AUG" },
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
const WIN5: Win = { x: 220, y: 190, w: 900, h: 320 };

export const FeatureEveryBotFailureSaidC05: React.FC = () => {
  const frame = useCurrentFrame();
  const B = MOODS.sand;

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE);

  const ribbonOn = seg(frame, B1_S, B1_S + FADE);

  // beat3 -> beat4 is a slide, not a crossfade.
  const b3ExitY = interpolate(frame, [B3_E, B3_E + FADE], [0, -34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const b4EnterY = interpolate(frame, [B4_S, B4_S + FADE], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // the three ribbon stamps are the persistent-but-changing motif: full brightness while
  // they ARE the story (b1 identical / b3 mechanism / b5 payoff), dimmed to background while
  // the ribbon is busy telling a different part of the story (b2 calendar axis / b4 the fix).
  const stopOpacity = b1 * 1 + b2 * 0.16 + b3 * 1 + b4 * 0.3 + b5 * 1;

  // beat3 internal reveal order: raw codes surface first, then funnel into one message.
  const c3Codes = [0, 1, 2].map((i) => seg(frame, B3_S + 6 + i * 10, B3_S + 18 + i * 10));
  const c3Arrow1 = seg(frame, B3_S + 40, B3_S + 58);
  const c3Catch = seg(frame, B3_S + 52, B3_S + 64);
  const c3Arrow2 = seg(frame, B3_S + 62, B3_S + 80);
  const c3BotSays = seg(frame, B3_S + 76, B3_S + 90);

  // beat2: the calendar marker crawls APR -> AUG, dim (unnoticed) for almost the whole span,
  // flashing lit only in the last stretch ("finally seen").
  const b2T = interpolate(frame, [B2_S, B2_E], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const markerX = interpolate(b2T, [0, 1], [RIBBON_LEFT, RIBBON_RIGHT]);
  const markerLit = seg(frame, B2_E - 26, B2_E - 8);

  return (
    <PaletteProvider value={MOODS.sand}>
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

        {/* month axis + crawling marker — beat 2 only */}
        {b2 > 0.004 &&
          MONTHS.map((m) => (
            <div
              key={m.label}
              style={{
                position: "absolute",
                left: m.x - 24,
                top: RIBBON_Y + 16,
                width: 48,
                textAlign: "center",
                fontFamily,
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 1,
                color: B.muted,
                opacity: b2,
              }}
            >
              {m.label}
            </div>
          ))}
        {b2 > 0.004 && (
          <div
            style={{
              position: "absolute",
              left: markerX - 9,
              top: RIBBON_Y - 9,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: markerLit > 0.5 ? B.accent : B.danger,
              boxShadow: markerLit > 0.5 ? `0 0 18px 4px ${B.accent}66` : "none",
              opacity: b2,
              transform: `scale(${1 + markerLit * 0.4})`,
            }}
          />
        )}

        {STOPS.map((s, i) => {
          const t5 = seg(frame, s.land, s.land + 14);
          const pulse = 1 + c3Codes[i] * 0.12;
          return (
            <div key={s.x}>
              <div
                style={{
                  position: "absolute",
                  left: s.x - 33,
                  top: RIBBON_Y - 33,
                  width: 66,
                  height: 66,
                  borderRadius: "50%",
                  background: t5 > 0.5 ? B.successBg : B.dangerBg,
                  border: `2.5px solid ${t5 > 0.5 ? B.success : B.danger}`,
                  boxShadow: "0 8px 20px rgba(16,24,40,0.14)",
                  opacity: stopOpacity,
                  transform: `scale(${pulse})`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    opacity: 1 - t5,
                  }}
                >
                  ⚠
                </span>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    opacity: t5,
                    transform: `scale(${0.6 + t5 * 0.4})`,
                  }}
                >
                  {s.after}
                </span>
              </div>
              {/* beat 1 under-label: the shared, generic message */}
              <div
                style={{
                  position: "absolute",
                  left: s.x - 90,
                  top: RIBBON_Y + 44,
                  width: 180,
                  textAlign: "center",
                  fontFamily,
                  fontSize: 13,
                  fontWeight: 700,
                  color: B.danger,
                  opacity: b1,
                }}
              >
                ⚠ Processing error
              </div>
              {/* beat 5 under-label: the real, distinct name */}
              <div
                style={{
                  position: "absolute",
                  left: s.x - 90,
                  top: RIBBON_Y + 44,
                  width: 180,
                  textAlign: "center",
                  fontFamily,
                  fontSize: 13,
                  fontWeight: 800,
                  color: B.success,
                  opacity: t5,
                }}
              >
                {s.afterLabel}
              </div>
              {/* beat 3 raw-code chip above the stamp */}
              <div
                style={{
                  position: "absolute",
                  left: s.x - 60,
                  top: RIBBON_Y - 78,
                  width: 120,
                  textAlign: "center",
                  fontFamily,
                  fontSize: 13,
                  fontWeight: 800,
                  color: B.danger,
                  opacity: c3Codes[i] * b3,
                }}
              >
                {s.code} {s.short}
              </div>
            </div>
          );
        })}
      </div>

      {/* beat 1 — the product plate + one plain claim: it's always the same message */}
      <Group opacity={b1}>
        <StickyNote
          x={220}
          y={216}
          w={840}
          text="📅 Calendar Telegram Bot — the kids' sports schedule, in one shared stream"
        />
        <StatPill x={430} y={370} emoji="⚠" text="Three different failures, one identical message" tone="danger" />
        <BeatLabel x={70} y={560} w={620} kicker="THE SYMPTOM" title="Every failure showed the same message" opacity={1} />
      </Group>

      {/* beat 2 — the four silent months, reconstructed as a log */}
      <Group opacity={b2}>
        <LogWindow
          title="calendar-bot · telegram"
          from={B2_S + 10}
          every={34}
          fontSize={20}
          win={{ x: 130, y: 220, w: 620, h: 300 }}
          opacity={1}
          lines={[
            { t: "APR", text: "sendMessage → Processing error", tone: "danger" },
            { t: "MAY", text: "sendMessage → Processing error", tone: "danger" },
            { t: "JUN", text: "sendMessage → Processing error", tone: "danger" },
            { t: "JUL", text: "sendMessage → Processing error", tone: "danger" },
            { t: "AUG", text: "key revoked since April — finally seen", tone: "accent" },
          ]}
        />
        <div
          style={{
            position: "absolute",
            left: 820,
            top: 236,
            fontFamily,
            display: "flex",
            alignItems: "baseline",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 120, fontWeight: 800, color: B.accent, letterSpacing: -3 }}>4</span>
        </div>
        <div style={{ position: "absolute", left: 824, top: 372, width: 300, fontFamily, fontSize: 20, fontWeight: 700, color: B.muted }}>
          MONTHS UNNOTICED
        </div>
        <BeatLabel x={70} y={560} w={620} kicker="THE GAP" title="A revoked key sat unnoticed for four months" opacity={1} />
      </Group>

      {/* beat 3 — three distinct causes, funneled into one output */}
      <Group opacity={b3} dy={b3ExitY}>
        <Panel x={140} y={300} w={230} h={130} tone="card">
          <div style={{ padding: 14, fontFamily, fontSize: 13, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            RAW ERROR TEXT
          </div>
          <div style={{ padding: "6px 14px", fontFamily, fontSize: 13, fontWeight: 600, color: B.muted }}>
            three distinct codes, surfaced above
          </div>
        </Panel>
        <FlowArrow x={390} y={355} len={130} color={B.danger} progress={c3Arrow1} />
        <Panel x={540} y={330} w={170} h={90} tone="danger" opacity={c3Catch}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontSize: 16,
              fontWeight: 800,
              color: B.danger,
              fontFamily,
              textAlign: "center",
              padding: "0 8px",
            }}
          >
            ✕ one fallback for everything
          </div>
        </Panel>
        <FlowArrow x={730} y={365} len={90} color={B.border} progress={c3Arrow2 * 0.4} />
        <Panel x={830} y={300} w={280} h={130} tone="card" opacity={c3BotSays}>
          <div style={{ padding: 14, fontFamily, fontSize: 13, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            BOT SAYS
          </div>
          <div style={{ padding: "4px 14px", fontFamily, fontSize: 19, color: B.danger, fontWeight: 800 }}>
            ⚠ Processing error — no matter which one
          </div>
        </Panel>
        <BeatLabel x={70} y={560} w={620} kicker="THE CAUSE" title="Every distinct failure collapsed into one message" opacity={1} />
      </Group>

      {/* beat 4 — the fix, shown as the real commit history */}
      <Group opacity={b4} dy={b4EnterY}>
        <StatPill x={70} y={260} emoji="🧩" text="A classifier reads the raw text first" tone="accent" />
        <LiveWindow
          file={shotsFile}
          shot="commits"
          title="github.com/SmmShaman/calendar-bot"
          from={B4_S}
          hold={B4_E - B4_S}
          win={WIN4}
          opacity={1}
          zoom={() => 2.2}
          focus={{ x: 0.24, y: 0.2 }}
        />
        <FilterChip x={WIN4.x} y={WIN4.y + WIN4.h + 24} icon="🧩" text="TypeScript" color={B.accent} />
        <BeatLabel x={70} y={560} w={560} kicker="THE FIX" title="A classifier reads the raw text before the fallback fires" opacity={1} />
      </Group>

      {/* beat 5 — the result, in the product's own log. holds to the end, no page or hub. */}
      <Group opacity={b5}>
        <LogWindow
          title="calendar-bot · error classifier"
          from={B5_S + 10}
          every={34}
          fontSize={20}
          win={WIN5}
          opacity={1}
          lines={[
            { t: "OLD", text: "429 quota exceeded → ⚠ Processing error", tone: "danger" },
            { t: "OLD", text: "401 invalid key → ⚠ Processing error", tone: "danger" },
            { t: "OLD", text: "404 model retired → ⚠ Processing error", tone: "danger" },
            { t: "NEW", text: "429 quota exceeded → ⏳ Quota exceeded", tone: "success" },
            { t: "NEW", text: "401 invalid key → 🔑 Key revoked", tone: "success" },
            { t: "NEW", text: "404 model retired → 🧠 Model retired", tone: "success" },
          ]}
        />
        <CheckBadge x={WIN5.x + WIN5.w - 30} y={WIN5.y - 20} />
        <BeatLabel x={70} y={560} w={700} kicker="THE RESULT" title="Three failures — each names itself, on the first message" opacity={1} />
      </Group>
    </PaletteProvider>
  );
};
