/**
 * FeatureEveryBotFailureSaidC05 — feature c05 — 1280x720, 937 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (2026-09-23): narration and beat windows are unchanged from the first cut; only
 * the staging is redrawn. The old cut ended beat 5 on a scroll through the public features
 * hub, which gate 2 (added 2026-09-21/22) now bans as an ending. This cut never touches the
 * hub or the feature's own page.
 *
 * Archetype 0 "split duel" / mood "dawn". A vertical divider halves the frame: chaos wash
 * left, order wash right. Both halves are alive at once; the divider is the one element that
 * survives every beat (STEP 0b throughline). It sits far right through beats 1-3 (chaos owns
 * almost the whole frame — the bot has been broken a long time), slides to the middle across
 * beat 4 (the fix lands), and recedes to a thin left sliver for beat 5 (order wins — the
 * shrunken chaos sliver keeps one struck-through "Processing error" ghost as the only trace
 * of the old behaviour). Per the archetype, there is no centered headline: each beat's
 * kicker+title sits inside whichever half it belongs to.
 *
 * Voice-synced beat table (do not shift):
 *   b1  15-174  "Every time the bot broke, it just said 'processing error' — no matter what
 *                actually failed." — chaos half: three identical red chat bubbles plus a
 *                StickyNote naming the product in plain language.
 *   b2 183-372  "That's exactly how a revoked API key sat unnoticed for four months, from
 *                April to August." — chaos half: a LogWindow reconstructs five dated lines
 *                from that same fact (no runtime log exists for this product, so the lines
 *                are built from the feature row's own numbers, never invented).
 *   b3 381-489  "The bot just looked like it was having a bad day, over and over." — chaos
 *                half: three distinct raw error codes collapse through one catch-all into the
 *                same "Processing error" output.
 *   b4 498-630  "Now a classifier reads the raw error text before it reaches the user." — the
 *                divider slides toward the middle, uncovering a LiveWindow of the real commit
 *                history of the fix. Single tech-credibility chip: "TypeScript".
 *   b5 639-892  "Quota, dead key, retired model — three failures that used to look
 *                identical, now each names itself on the very first message." — the divider
 *                recedes to a sliver; order half fills with a LogWindow contrasting the same
 *                three codes before/after. Holds to 937, no fade-out.
 *
 * Persistent element: the divider + its two colour washes, alive from frame 0 to 937.
 * Non-crossfade transition: beat3→beat4 vertical slide (content exits up, enters from below).
 * Single tech-credibility caption: "TypeScript" (FilterChip, beat 4 only). Real data only:
 * the three failure codes and the four-month span, reused from the first cut. Emoji are all
 * strictly single-codepoint (no variation selectors): 📅 ❓ 🔑 🧩 ⏳ 🧠 🔴 ⚠ ✕.
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

const DIVIDER_CHAOS = 1160;
const DIVIDER_MID = 640;
const DIVIDER_ORDER = 160;

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
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: B.accent, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontSize: 26, fontWeight: 750, color: B.ink, marginTop: 6, lineHeight: 1.25 }}>{title}</div>
    </div>
  );
};

const ChatBubble: React.FC<{ x: number; y: number; time: string }> = ({ x, y, time }) => {
  const B = usePalette();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 380, fontFamily }}>
      <div
        style={{
          padding: "13px 18px",
          borderRadius: 16,
          background: B.dangerBg,
          border: `1.5px solid ${B.dangerEdge}`,
          color: B.danger,
          fontSize: 19,
          fontWeight: 700,
        }}
      >
        ⚠ Processing error
      </div>
      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: B.muted, paddingLeft: 4 }}>{time}</div>
    </div>
  );
};

const CodePill: React.FC<{ x: number; y: number; text: string; opacity?: number }> = ({ x, y, text, opacity = 1 }) => (
  <StatPill x={x} y={y} emoji="🔴" text={text} tone="danger" fontSize={15} opacity={opacity} />
);

const CornerTag: React.FC<{ opacity: number }> = ({ opacity }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 60,
        bottom: 46,
        opacity,
        fontFamily,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        background: B.card,
        border: `1.5px solid ${B.border}`,
      }}
    >
      <span style={{ fontSize: 16 }}>📅</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: B.muted }}>Calendar Telegram Bot</span>
    </div>
  );
};

const SideTag: React.FC<{ x: number; align: "left" | "right"; text: string; color: string; opacity: number }> = ({
  x,
  align,
  text,
  color,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : undefined,
        right: align === "right" ? 1280 - x : undefined,
        top: 36,
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: 3,
        color,
        opacity,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

const WIN4: Win = { x: 660, y: 180, w: 520, h: 290 };
const WIN5: Win = { x: 220, y: 170, w: 900, h: 340 };

export const FeatureEveryBotFailureSaidC05: React.FC = () => {
  const frame = useCurrentFrame();
  const B = MOODS.dawn;

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE);

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

  // the divider is the persistent element: far right through the chaos beats,
  // slides to the middle as the fix lands (b4), recedes to a thin sliver once
  // order has won (b5) — literally "the divider slides to reveal the win".
  const dividerX = interpolate(
    frame,
    [B4_S, B4_E, B5_S, B5_S + 60],
    [DIVIDER_CHAOS, DIVIDER_MID, DIVIDER_MID, DIVIDER_ORDER],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );

  // beat 3 internal reveal order: distinct codes first, then the funnel, then
  // the collapsed output last — the mechanism only explains itself by the end
  // of the beat, matching "looked like a bad day, over and over".
  const c3Codes = [0, 1, 2].map((i) => seg(frame, B3_S + 6 + i * 10, B3_S + 18 + i * 10));
  const c3Arrow1 = seg(frame, B3_S + 40, B3_S + 58);
  const c3Catch = seg(frame, B3_S + 52, B3_S + 64);
  const c3Arrow2 = seg(frame, B3_S + 62, B3_S + 80);
  const c3BotSays = seg(frame, B3_S + 76, B3_S + 90);

  const cornerTag = seg(frame, B1_E, B1_E + FADE) * (1 - seg(frame, B4_S, B4_S + FADE));
  const chaosOn = Math.min(1, b1 + b2 + b3);
  const orderOn = Math.min(1, b4 + b5);

  return (
    <PaletteProvider value={MOODS.dawn}>
      <LightBg />

      {/* the duel: two washes + the sliding divider bar */}
      <div style={{ position: "absolute", left: 0, top: 0, width: dividerX, height: 720, background: B.dangerBg }} />
      <div
        style={{
          position: "absolute",
          left: dividerX,
          top: 0,
          width: 1280 - dividerX,
          height: 720,
          background: B.successBg,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: dividerX - 3,
          top: 0,
          width: 6,
          height: 720,
          background: B.ink,
          opacity: 0.22,
          boxShadow: `0 0 24px 2px ${B.ink}33`,
        }}
      />
      <SideTag x={40} align="left" text="CHAOS" color={B.danger} opacity={chaosOn} />
      <SideTag x={1240} align="right" text="ORDER" color={B.success} opacity={orderOn} />
      <CornerTag opacity={cornerTag} />

      {/* beat 1 — the same message, no matter what actually broke */}
      <Group opacity={b1}>
        <StickyNote
          x={90}
          y={92}
          w={560}
          text="📅 Calendar Telegram Bot — one shared calendar bot for the kids' sports schedule"
        />
        <ChatBubble x={90} y={228} time="Tue 09:14" />
        <ChatBubble x={260} y={318} time="Thu 22:03" />
        <ChatBubble x={90} y={408} time="Sun 06:41" />
        <StatPill x={520} y={230} emoji="❓" text="Same message, every failure" tone="danger" />
        <BeatLabel x={90} y={566} w={560} kicker="THE SYMPTOM" title="Every failure showed the same message" opacity={1} />
      </Group>

      {/* beat 2 — the four silent months, reconstructed as a log */}
      <Group opacity={b2}>
        <LogWindow
          title="calendar-bot · telegram"
          from={B2_S + 10}
          every={34}
          fontSize={22}
          win={{ x: 150, y: 196, w: 980, h: 340 }}
          opacity={1}
          lines={[
            { t: "APR", text: "sendMessage → Processing error", tone: "danger" },
            { t: "MAY", text: "sendMessage → Processing error", tone: "danger" },
            { t: "JUN", text: "sendMessage → Processing error", tone: "danger" },
            { t: "JUL", text: "sendMessage → Processing error", tone: "danger" },
            { t: "AUG", text: "key revoked since April — finally seen", tone: "accent" },
          ]}
        />
        <BeatLabel x={90} y={566} w={560} kicker="THE GAP" title="A revoked key sat unnoticed for four months" opacity={1} />
      </Group>

      {/* beat 3 — three distinct causes, one collapsed output */}
      <Group opacity={b3} dy={b3ExitY}>
        <Panel x={110} y={210} w={260} h={220} tone="card">
          <div style={{ padding: 16, fontFamily, fontSize: 15, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            RAW ERROR TEXT
          </div>
          <div style={{ padding: "0 16px" }}>
            <CodePill x={0} y={0} text="429 quota exceeded" opacity={c3Codes[0]} />
          </div>
          <div style={{ padding: "50px 16px 0" }}>
            <CodePill x={0} y={0} text="401 invalid key" opacity={c3Codes[1]} />
          </div>
          <div style={{ padding: "50px 16px 0" }}>
            <CodePill x={0} y={0} text="404 model retired" opacity={c3Codes[2]} />
          </div>
        </Panel>
        <FlowArrow x={390} y={310} len={140} color={B.danger} progress={c3Arrow1} />
        <Panel x={550} y={260} w={170} h={100} tone="danger" opacity={c3Catch}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontSize: 18,
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
        <FlowArrow x={730} y={310} len={95} color={B.border} progress={c3Arrow2 * 0.4} />
        <Panel x={830} y={210} w={280} h={220} tone="card" opacity={c3BotSays}>
          <div style={{ padding: 16, fontFamily, fontSize: 15, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            BOT SAYS
          </div>
          <div style={{ padding: "36px 16px", fontFamily, fontSize: 21, color: B.danger, fontWeight: 800 }}>
            ⚠ Processing error
          </div>
          <div style={{ padding: "0 16px", fontFamily, fontSize: 14, color: B.muted, fontWeight: 600 }}>
            no matter which one
          </div>
        </Panel>
        <BeatLabel x={90} y={566} w={560} kicker="THE CAUSE" title="Every distinct failure collapsed into one message" opacity={1} />
      </Group>

      {/* beat 4 — the fix, uncovered as the divider slides toward the middle */}
      <Group opacity={b4} dy={b4EnterY}>
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
        <div
          style={{
            position: "absolute",
            left: WIN4.x,
            top: WIN4.y + WIN4.h + 10,
            width: WIN4.w,
            fontFamily,
            fontSize: 14,
            fontWeight: 700,
            color: B.muted,
            lineHeight: 1.3,
          }}
        >
          the real commit that taught the bot to read the actual error
        </div>
        <FilterChip x={WIN4.x} y={WIN4.y + WIN4.h + 48} icon="🧩" text="TypeScript" color={B.accent} />
        <div
          style={{
            position: "absolute",
            left: WIN4.x,
            top: WIN4.y + WIN4.h + 96,
            width: 300,
            fontFamily,
            fontSize: 13,
            fontWeight: 600,
            color: B.muted,
            lineHeight: 1.35,
          }}
        >
          the language the fix runs on
        </div>
        <BeatLabel
          x={WIN4.x}
          y={WIN4.y + WIN4.h + 140}
          w={520}
          kicker="THE FIX"
          title="A classifier reads the raw text before the fallback fires"
          opacity={1}
        />
      </Group>

      {/* beat 5 — the result, in the product's own log, no page or hub. holds to the end */}
      <Group opacity={b5}>
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 330,
            width: 130,
            fontFamily,
            fontSize: 12,
            fontWeight: 700,
            color: B.danger,
            opacity: 0.55,
            textDecoration: "line-through",
            lineHeight: 1.3,
          }}
        >
          OLD: ⚠ Processing error
        </div>
        <LogWindow
          title="calendar-bot · error classifier"
          from={B5_S + 10}
          every={34}
          fontSize={21}
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
        <BeatLabel
          x={WIN5.x}
          y={WIN5.y + WIN5.h + 40}
          w={700}
          kicker="THE RESULT"
          title="Three failures — each names itself, on the first message"
          opacity={1}
        />
      </Group>
    </PaletteProvider>
  );
};
