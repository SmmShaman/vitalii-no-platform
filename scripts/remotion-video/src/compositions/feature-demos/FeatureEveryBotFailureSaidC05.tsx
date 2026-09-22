/**
 * FeatureEveryBotFailureSaidC05 — feature c05 — 1280x720, 937 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 1 "timeline ribbon" / mood "dawn" (pre-assigned by the orchestrating session,
 * see out/lux-archetypes.md — not redrawn here).
 *
 * The ribbon IS the four silent months: five stops APR·MAY·JUN·JUL·AUG span the top of the
 * frame. It lands twice, permanently: each stop turns "danger" as its month passes during
 * beat 2 (the sentence "from April to August"), then every stop flips to a green, named
 * state mid-beat 4, the exact moment the classifier ships — matching "now a classifier reads
 * the raw error text". Beat 5 inherits that fixed ribbon and adds the three distinct,
 * now-named failures below the live hub.
 *
 * Voice-synced beat table (do not shift):
 *   b1  15-174  "Every time the bot broke, it just said 'processing error' — no matter what
 *                actually failed." — drawn Telegram chat: three identical red bubbles, plus
 *                a StickyNote naming the product.
 *   b2 183-372  "That's exactly how a revoked API key sat unnoticed for four months, from
 *                April to August." — the ribbon lands (APR→AUG); a LogWindow reconstructs
 *                five dated lines from that same fact (no runtime log exists for this
 *                product, so lines are built from meta-c05.json's own numbers).
 *   b3 381-489  "The bot just looked like it was having a bad day, over and over." — drawn
 *                plumbing: three distinct raw error codes collapse through one catch-all
 *                into the same "Processing error" output.
 *   b4 498-630  "Now a classifier reads the raw error text before it reaches the user." —
 *                LiveWindow: the real commit history of the fix, plus the same three codes
 *                now diverging into three distinct labelled outputs. Ribbon flips to green
 *                here (frames 523-545). Single tech-credibility chip: "TypeScript".
 *   b5 639-892  "Quota, dead key, retired model — three failures that used to look
 *                identical, now each names itself on the very first message." — LiveWindow:
 *                the real features hub (never the feature's own page); three result pills
 *                name the three failures explicitly. Holds to 937, no fade-out.
 *
 * Persistent element: the 5-stop APR-AUG ribbon across the top, alive every beat.
 * Non-crossfade transition: beat3→beat4 vertical slide (content exits up, enters from below).
 * Single tech-credibility caption: "TypeScript" (FilterChip, beat 4 only). Real data only:
 * the three failure types and the four-month span from meta-c05.json. Emoji all
 * single-codepoint (⚠️🔑👀✅🧩🔌🧠⏳), no ZWJ.
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

const RIBBON_Y = 110;

type StopKind = "keyDied" | "repeat" | "discovered";
type Stop = { x: number; month: string; kind: StopKind; land: number };

const STOPS: Stop[] = [
  { x: 220, month: "APR", kind: "keyDied", land: B2_S + 12 },
  { x: 460, month: "MAY", kind: "repeat", land: B2_S + 55 },
  { x: 700, month: "JUN", kind: "repeat", land: B2_S + 95 },
  { x: 940, month: "JUL", kind: "repeat", land: B2_S + 135 },
  { x: 1180, month: "AUG", kind: "discovered", land: B2_S + 175 },
];

const FIX_S = B4_S + 25;
const FIX_E = B4_S + 45;

const BeatLabel: React.FC<{ kicker: string; title: string; opacity: number }> = ({ kicker, title, opacity }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 566, width: 680, opacity, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: B.accent, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontSize: 27, fontWeight: 750, color: B.ink, marginTop: 6, lineHeight: 1.25 }}>{title}</div>
    </div>
  );
};

const Ribbon: React.FC<{ frame: number }> = ({ frame }) => {
  const B = usePalette();
  const fixT = seg(frame, FIX_S, FIX_E);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 170 }}>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: RIBBON_Y,
          width: 1080,
          height: 3,
          background: B.border,
          borderRadius: 2,
        }}
      />
      {STOPS.map((s) => {
        const badgeT = seg(frame, s.land, s.land + 14);
        const fixed = fixT > 0.5;
        const icon = fixed ? "✅" : badgeT > 0.5 ? (s.kind === "keyDied" ? "🔑" : s.kind === "discovered" ? "👀" : "⚠️") : "⚫";
        const dotBg = fixed ? B.successBg : badgeT > 0.5 ? B.dangerBg : B.card;
        const dotEdge = fixed ? B.successEdge : badgeT > 0.5 ? B.dangerEdge : B.border;
        const label = fixed ? "NAMED" : badgeT > 0.5 ? (s.kind === "keyDied" ? "KEY REVOKED" : s.kind === "discovered" ? "FOUND" : "SILENT") : "";
        const labelColor = fixed ? B.success : B.danger;
        return (
          <div key={s.month} style={{ position: "absolute", left: s.x - 90, top: 0, width: 180, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: B.muted }}>{s.month}</div>
            <div
              style={{
                margin: "6px auto 0",
                width: 58,
                height: 58,
                borderRadius: "50%",
                background: dotBg,
                border: `2px solid ${dotEdge}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              {icon}
            </div>
            {label ? (
              <div style={{ marginTop: 6, fontSize: 12, fontWeight: 800, letterSpacing: 1, color: labelColor }}>
                {label}
              </div>
            ) : null}
          </div>
        );
      })}
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
        ⚠️ Processing error
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
      <span style={{ fontSize: 16 }}>🗓️</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: B.muted }}>Calendar Telegram Bot</span>
    </div>
  );
};

const WIN4: Win = { x: 130, y: 200, w: 680, h: 300 };
const WIN5: Win = { x: 250, y: 210, w: 880, h: 400 };

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

  const pushScale = interpolate(frame, [B5_S, B5_S + 20], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // beat 3 internal reveal order: distinct codes first, then the funnel, then
  // the collapsed output last — matching the narration's own arc ("looked
  // like a bad day, over and over" -> the mechanism only explains itself by
  // the end of the beat, instead of the whole diagram appearing at once).
  const c3Codes = [0, 1, 2].map((i) => seg(frame, B3_S + 6 + i * 10, B3_S + 18 + i * 10));
  const c3Arrow1 = seg(frame, B3_S + 40, B3_S + 58);
  const c3Catch = seg(frame, B3_S + 52, B3_S + 64);
  const c3Arrow2 = seg(frame, B3_S + 62, B3_S + 80);
  const c3BotSays = seg(frame, B3_S + 76, B3_S + 90);

  const cornerTag = seg(frame, B1_E, B1_E + FADE);

  return (
    <PaletteProvider value={MOODS.dawn}>
      <LightBg />
      <Ribbon frame={frame} />
      <CornerTag opacity={cornerTag} />

      {/* beat 1 — the same message, no matter what actually broke */}
      <Group opacity={b1}>
        <ChatBubble x={110} y={210} time="Tue 09:14" />
        <ChatBubble x={110} y={310} time="Thu 22:03" />
        <ChatBubble x={110} y={410} time="Sun 06:41" />
        <StickyNote
          x={600}
          y={220}
          w={470}
          text="🗓️ Calendar Telegram Bot — one shared calendar bot for the kids' sports schedule"
        />
        <StatPill x={600} y={340} emoji="❓" text="Same message, every failure" tone="danger" />
        <BeatLabel kicker="THE SYMPTOM" title="Every failure showed the same message" opacity={1} />
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
        <BeatLabel kicker="THE GAP" title="A revoked key sat unnoticed for four months" opacity={1} />
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 18, fontWeight: 800, color: B.danger, fontFamily, textAlign: "center", padding: "0 8px" }}>
            ✕ one fallback for everything
          </div>
        </Panel>
        <FlowArrow x={740} y={310} len={110} color={B.border} progress={c3Arrow2 * 0.4} />
        <Panel x={870} y={210} w={300} h={220} tone="card" opacity={c3BotSays}>
          <div style={{ padding: 16, fontFamily, fontSize: 15, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            BOT SAYS
          </div>
          <div style={{ padding: "36px 16px", fontFamily, fontSize: 21, color: B.danger, fontWeight: 800 }}>
            ⚠️ Processing error
          </div>
          <div style={{ padding: "0 16px", fontFamily, fontSize: 14, color: B.muted, fontWeight: 600 }}>
            no matter which one
          </div>
        </Panel>
        <BeatLabel kicker="THE CAUSE" title="Every distinct failure collapsed into one message" opacity={1} />
      </Group>

      {/* beat 4 — the fix, shown in the real commit history */}
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
        <div style={{ position: "absolute", left: WIN4.x, top: WIN4.y + WIN4.h + 8, width: WIN4.w, fontFamily, fontSize: 14, fontWeight: 700, color: B.muted, lineHeight: 1.3 }}>
          the real commit that swapped the catch-all for a classifier
        </div>
        <StatPill x={850} y={210} emoji="⏳" text="429 → Quota exceeded" tone="accent" />
        <StatPill x={850} y={258} emoji="🔑" text="401 → Key revoked" tone="accent" />
        <StatPill x={850} y={306} emoji="🧠" text="404 → Model retired" tone="accent" />
        <FilterChip x={850} y={360} icon="🧩" text="TypeScript" color={B.accent} />
        <div style={{ position: "absolute", left: 850, top: 408, width: 250, fontFamily, fontSize: 14, fontWeight: 600, color: B.muted, lineHeight: 1.35 }}>
          the language the whole classifier runs on
        </div>
        <BeatLabel kicker="THE FIX" title="A classifier reads the raw text before the fallback fires" opacity={1} />
      </Group>

      {/* beat 5 — proven on the live hub, three failures now named, holds to the end */}
      <Group opacity={b5}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `scale(${pushScale})`, transformOrigin: "50% 55%" }}>
          <LiveWindow
            file={shotsFile}
            shot="hub"
            title="vitalii.no/features"
            from={B5_S}
            hold={END - B5_S}
            win={WIN5}
            opacity={1}
            zoom={() => 1.35}
            focus={{ x: 0.5, y: 0.22 }}
          />
        </div>
        <StatPill x={40} y={220} emoji="⏳" text="Quota exceeded" tone="success" />
        <StatPill x={40} y={268} emoji="🔑" text="Key revoked" tone="success" />
        <StatPill x={40} y={316} emoji="🧠" text="Model retired" tone="success" />
        <CheckBadge x={WIN5.x + WIN5.w - 30} y={WIN5.y - 20} />
        <BeatLabel kicker="THE RESULT" title="Three failures — each names itself, on the first message" opacity={1} />
      </Group>
    </PaletteProvider>
  );
};
