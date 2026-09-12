/**
 * FeatureCancelledGameStaysCalendarC06 — feature c06 — 1280x720, 935 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 1 "timeline ribbon" / mood "slate" (pre-assigned, see out/lux-archetypes.md — not redrawn here).
 * The ribbon IS the family's weekly calendar: four fixed stops (Mon/Wed/Thu/Sat). Two of
 * them are real events from meta-c06.json (Wed "vs Kolbu" moved, Thu "Training" declined);
 * the other two are normal, unaffected fixtures kept as a visual control. The ribbon starts
 * identical across all four stops (the bug) and only changes twice, permanently: once when
 * the fix flags the two affected stops (mid beat 4) and once when the kiosk's real
 * grey+strikethrough treatment lands (start of beat 5) — matching the real per-child
 * cancelled/declined signal handling described in meta-c06.json.
 *
 * Beats (voice-synced, do not shift):
 *   b1  15-176  "A cancelled game or a declined practice still looked like a normal event
 *                on the calendar." — drawn calendar mockup, all 4 rows identically "Confirmed".
 *   b2 185-352  "Parents assumed everything was still on, because nothing on the calendar
 *                ever said otherwise." — same mockup, overlay pills on the false assumption.
 *   b3 361-500  "Our calendar just wasn't reading Spond's own cancel and decline signals."
 *                — drawn plumbing: two signals flow in, hit an "ignored" wall, calendar
 *                receives nothing.
 *   b4 509-680  "Now it checks both signals, per child, and marks the event clearly instead
 *                of just hiding it." — LiveWindow: real GitHub commit history (the shipped
 *                fix) + drawn signal-check stack. Ribbon badges flip here (frames 554, 604).
 *   b5 689-890  "A moved fixture, a declined training — two mixed-up games, finally shown
 *                correctly, not deleted." — LiveWindow: the feature's own vitalii.no page;
 *                hero number "2 REAL EVENTS FIXED"; holds to 935, no fade-out. Ribbon's
 *                final grey+strikethrough state lands here (frame 689).
 *
 * Persistent element: the 4-stop calendar ribbon across the top, alive across every beat.
 * Non-crossfade transitions: beat3->beat4 slide (content exits/enters vertically), beat4->beat5
 * scale-push on the LiveWindow. Single tech-credibility caption: "Spond API" (FilterChip,
 * beat 4 only). Real data only: the two named events from meta-c06.json, hero number 2
 * (two real events fixed). Emoji all single-codepoint (⚽🔁🚫🧑👀🔌🏷✕✓), no ZWJ.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  BrowserWindow,
  StatPill,
  FilterChip,
  FlowArrow,
  CheckBadge,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shotsFile from "./shots/c06.json";

const B1_S = 15, B1_E = 176;
const B2_S = 185, B2_E = 352;
const B3_S = 361, B3_E = 500;
const B4_S = 509, B4_E = 680;
const B5_S = 689, B5_E = 890;
const END = 935;
const FADE = 9;

const RIBBON_Y = 110;

type StopKind = "normal" | "moved" | "declined";
type Stop = { x: number; day: string; label: string; kind: StopKind; land: number };

const STOPS: Stop[] = [
  { x: 220, day: "MON", label: "Training", kind: "normal", land: 0 },
  { x: 500, day: "WED", label: "vs Kolbu", kind: "moved", land: B4_S + 45 },
  { x: 780, day: "THU", label: "Training", kind: "declined", land: B4_S + 95 },
  { x: 1060, day: "SAT", label: "Tournament", kind: "normal", land: 0 },
];

const BeatLabel: React.FC<{ kicker: string; title: string; opacity: number }> = ({ kicker, title, opacity }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 566, width: 640, opacity, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: B.accent, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontSize: 27, fontWeight: 750, color: B.ink, marginTop: 6, lineHeight: 1.25 }}>{title}</div>
    </div>
  );
};

const Ribbon: React.FC<{ frame: number }> = ({ frame }) => {
  const B = usePalette();
  const finalT = seg(frame, B5_S, B5_S + 20);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 170 }}>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: RIBBON_Y,
          width: 980,
          height: 3,
          background: B.border,
          borderRadius: 2,
        }}
      />
      {STOPS.map((s) => {
        const badgeT = s.land > 0 ? seg(frame, s.land, s.land + 14) : 0;
        const icon = s.kind === "moved" ? (badgeT > 0.5 ? "🔁" : "⚽") : s.kind === "declined" ? (badgeT > 0.5 ? "🚫" : "⚽") : "⚽";
        const grey = finalT > 0.5 && s.kind !== "normal";
        const dotBg = grey ? B.chipBg : badgeT > 0.5 ? (s.kind === "moved" ? B.noteBg : B.dangerBg) : B.card;
        const dotEdge = grey ? B.border : badgeT > 0.5 ? (s.kind === "moved" ? B.noteBorder : B.dangerEdge) : B.accentEdge;
        const tagText = s.kind === "moved" ? "MOVED" : s.kind === "declined" ? "DECLINED" : "";
        const tagColor = s.kind === "moved" ? B.amber : B.danger;
        return (
          <div key={s.day} style={{ position: "absolute", left: s.x - 90, top: 0, width: 180, textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: B.muted }}>{s.day}</div>
            <div
              style={{
                margin: "6px auto 0",
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: dotBg,
                border: `2px solid ${dotEdge}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {icon}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 16,
                fontWeight: 650,
                color: grey ? B.muted : B.ink,
                textDecoration: grey ? "line-through" : "none",
              }}
            >
              {s.label}
            </div>
            {badgeT > 0.5 && !grey && tagText ? (
              <div style={{ marginTop: 3, fontSize: 12, fontWeight: 800, letterSpacing: 1, color: tagColor }}>
                {tagText}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const CalendarMock: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const B = usePalette();
  const rows: [string, string][] = [
    ["MON  Training", "Confirmed"],
    ["WED  vs Kolbu", "Confirmed"],
    ["THU  Training", "Confirmed"],
    ["SAT  Tournament", "Confirmed"],
  ];
  return (
    <BrowserWindow x={x} y={y} w={680} h={310} title="Family Calendar — This Week" opacity={1}>
      <div style={{ padding: "20px 26px" }}>
        {rows.map(([label, tag]) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 4px",
              borderBottom: `1px solid ${B.border}`,
              fontSize: 20,
              fontWeight: 600,
              color: B.ink,
            }}
          >
            <span>{label}</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: B.success,
                background: B.successBg,
                border: `1.5px solid ${B.successEdge}`,
                borderRadius: 999,
                padding: "5px 14px",
              }}
            >
              {tag}
            </span>
          </div>
        ))}
      </div>
    </BrowserWindow>
  );
};

const WIN4: Win = { x: 130, y: 210, w: 700, h: 320 };
const WIN5: Win = { x: 250, y: 216, w: 880, h: 400 };

export const FeatureCancelledGameStaysCalendarC06: React.FC = () => {
  const frame = useCurrentFrame();
  const B = MOODS.slate;

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

  return (
    <PaletteProvider value={MOODS.slate}>
      <LightBg />
      <Ribbon frame={frame} />

      {/* beat 1 — the calendar shows nothing unusual */}
      <Group opacity={b1}>
        <CalendarMock x={300} y={220} />
        <BeatLabel kicker="THE CALENDAR" title="A cancelled game still looked like any other event" opacity={1} />
      </Group>

      {/* beat 2 — parents trust the (unchanged) calendar */}
      <Group opacity={b2}>
        <CalendarMock x={300} y={220} />
        <StatPill x={720} y={230} emoji="🧑" text="Assumed the game was still on" tone="accent" />
        <StatPill x={720} y={280} emoji="👀" text="Nothing on the calendar said otherwise" tone="accent" />
        <BeatLabel kicker="THE ASSUMPTION" title="Parents assumed the game was still on" opacity={1} />
      </Group>

      {/* beat 3 — the ignored signals */}
      <Group opacity={b3} dy={b3ExitY}>
        <Panel x={150} y={220} w={260} h={180} tone="card">
          <div style={{ padding: 16, fontFamily, fontSize: 15, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            INCOMING SIGNALS
          </div>
          <div style={{ padding: "0 16px" }}>
            <StatPill x={0} y={0} emoji="🚫" text="cancelled: true" tone="danger" scale={0.85} />
          </div>
          <div style={{ padding: "44px 16px 0" }}>
            <StatPill x={0} y={0} emoji="🙅" text="declinedIds: […]" tone="accent" scale={0.85} />
          </div>
        </Panel>
        <FlowArrow x={430} y={300} len={140} color={B.danger} />
        <Panel x={590} y={250} w={160} h={100} tone="danger">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 22, fontWeight: 800, color: B.danger, fontFamily }}>
            ✕ ignored
          </div>
        </Panel>
        <FlowArrow x={770} y={300} len={100} color={B.border} progress={0.4} />
        <Panel x={890} y={220} w={260} h={180} tone="card">
          <div style={{ padding: 16, fontFamily, fontSize: 15, fontWeight: 800, color: B.muted, letterSpacing: 1 }}>
            OUR CALENDAR
          </div>
          <div style={{ padding: "40px 16px", fontFamily, fontSize: 17, color: B.muted, fontWeight: 600 }}>
            receives nothing
          </div>
        </Panel>
        <BeatLabel kicker="THE CAUSE" title="Spond's cancel and decline signals were ignored" opacity={1} />
      </Group>

      {/* beat 4 — the fix, shown in the real commit history */}
      <Group opacity={b4} dy={b4EnterY}>
        <LiveWindow file={shotsFile} shot="commits" title="github.com/SmmShaman/calendar-bot" from={B4_S} hold={B4_E - B4_S} win={WIN4} opacity={1} />
        <StatPill x={870} y={220} emoji="🚫" text="cancelled: true" tone="danger" />
        <StatPill x={870} y={268} emoji="🙅" text="declinedIds: […]" tone="accent" />
        <FlowArrow x={935} y={318} len={60} color={B.success} />
        <StatPill x={870} y={356} emoji="🏷" text="labeled, not hidden" tone="success" />
        <FilterChip x={870} y={410} icon="🔌" text="Spond API" color={B.accent} />
        <BeatLabel kicker="THE FIX" title="Now both signals are checked, per child" opacity={1} />
      </Group>

      {/* beat 5 — proven on the live page, holds to the end */}
      <Group opacity={b5}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `scale(${pushScale})`, transformOrigin: "50% 55%" }}>
          <LiveWindow file={shotsFile} shot="page" title="vitalii.no/features" from={B5_S} hold={END - B5_S} win={WIN5} opacity={1} />
        </div>
        <Panel x={40} y={216} w={180} h={170} tone="success">
          <div style={{ padding: 16, textAlign: "center", fontFamily }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: B.muted, textDecoration: "line-through" }}>
              looked normal
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: B.success, marginTop: 6 }}>2</div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: B.muted, marginTop: 4 }}>
              REAL EVENTS FIXED
            </div>
          </div>
        </Panel>
        <CheckBadge x={WIN5.x + WIN5.w - 30} y={WIN5.y - 20} />
        <BeatLabel kicker="THE RESULT" title="Two mixed-up games — shown correctly, not deleted" opacity={1} />
      </Group>
    </PaletteProvider>
  );
};
