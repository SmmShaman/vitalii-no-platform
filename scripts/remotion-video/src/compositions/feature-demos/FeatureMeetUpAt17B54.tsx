/**
 * FeatureMeetUpAt17B54 — feature b54 — 1280x720, 912 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 4 "flow map" / mood "mint" (pre-assigned, see out/lux-archetypes.md — not
 * redrawn here). The whole frame is one route diagram: SPOND (source) -> COMPARE Δ
 * (decision) -> a fork into ONE TIME (close branch) and the KIOSK / TV (far branch).
 * Before the fix, a dashed shortcut skips COMPARE entirely — the real bug ("copied
 * straight from Spond's own kickoff field"). At beat 4 the shortcut is replaced by the
 * real route through COMPARE, and the token takes the "far apart" branch because the
 * real gap (17:15 vs 18:00) clears the real five-minute threshold from meta-b54.json.
 * The KIOSK node grows into a live recording of the feature's own page at beat 5 — a
 * non-crossfade morph transition; the route rewire at beat 4 is a second one.
 *
 * Beats (voice-synced, do not shift):
 *  b1  15-168  "There are two different times for game day — when to actually show up,
 *               and when the whistle blows." — the two tokens appear at SPOND, not yet
 *               moving.
 *  b2 177-336  "Our kiosk only ever showed the whistle time, copied straight from
 *               Spond's kickoff field." — dashed shortcut SPOND->KIOSK (bypassing
 *               COMPARE), only the kickoff token arrives; the meet-up token is dropped.
 *  b3 345-490  "A kid told to arrive early walked in exactly on time — and still looked
 *               late." — drawn metaphor scene (real number: 15 minutes early, from
 *               meta-b54.json), route stays in its buggy state.
 *  b4 499-647  "Now the kiosk compares both times and shows both when they're far
 *               enough apart." — the shortcut is rewired through COMPARE; both tokens
 *               travel, the gap clears the real 5-minute threshold, the far branch to
 *               KIOSK lights up.
 *  b5 656-867  "A five-minute gap stays simple, but a real one prints clearly — 17:15
 *               to 18:00." — the KIOSK node grows into a LiveWindow of the feature's
 *               own page; hero flips from "1 TIME SHOWN" to "2 TIMES SHOWN". Holds to
 *               912, no fade-out.
 *
 * Single tech-credibility caption: "Spond API" (beat 2 only, next to the SPOND node).
 * Emoji all single-codepoint (🕐🏁📺🔀✕🧒📅), no ZWJ.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LightBg, Group, Panel, FilterChip, StatPill, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shotsFile from "./shots/b54.json";

const B1_S = 15, B1_E = 168;
const B2_S = 177, B2_E = 336;
const B3_S = 345, B3_E = 490;
const B4_S = 499, B4_E = 647;
const B5_S = 656, B5_E = 867;
const END = 912;
const FADE = 9;

type Vec = { x: number; y: number };
const NODE_A: Vec = { x: 170, y: 200 }; // SPOND
const NODE_B: Vec = { x: 620, y: 380 }; // COMPARE
const NODE_C1: Vec = { x: 990, y: 190 }; // close branch -> one time
const NODE_C2: Vec = { x: 1090, y: 560 }; // far branch -> KIOSK

const WIN5: Win = { x: 560, y: 150, w: 600, h: 420 };

const lerp = (a: Vec, b: Vec, t: number): Vec => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

const BeatLabel: React.FC<{ kicker: string; title: string }> = ({ kicker, title }) => {
  const B = usePalette();
  return (
    <div style={{ position: "absolute", left: 70, top: 26, width: 640, fontFamily }}>
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: B.accent, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontSize: 27, fontWeight: 750, color: B.ink, marginTop: 6, lineHeight: 1.25 }}>{title}</div>
    </div>
  );
};

const Node: React.FC<{ pos: Vec; r: number; emoji: string; label: string; tone: string; opacity?: number }> = ({
  pos,
  r,
  emoji,
  label,
  tone,
  opacity = 1,
}) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: pos.x - r, top: pos.y - r, width: r * 2, opacity, fontFamily }}>
      <div
        style={{
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          background: B.card,
          border: `2.5px solid ${tone}`,
          boxShadow: "0 10px 24px rgba(22,35,63,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: r * 0.85,
        }}
      >
        {emoji}
      </div>
      <div
        style={{
          marginTop: 8,
          textAlign: "center",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 0.5,
          color: B.ink,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Route: React.FC<{ a: Vec; b: Vec; color: string; opacity: number; dashed?: boolean }> = ({
  a,
  b,
  color,
  opacity,
  dashed,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
      strokeDasharray={dashed ? "3 14" : undefined}
      opacity={opacity}
    />
  );
};

const Token: React.FC<{ pos: Vec; emoji: string; opacity: number }> = ({ pos, emoji, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: pos.x - 20,
        top: pos.y - 20,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 6px 16px rgba(22,35,63,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        opacity,
      }}
    >
      {emoji}
    </div>
  );
};

export const FeatureMeetUpAt17B54: React.FC = () => {
  const frame = useCurrentFrame();
  const B = MOODS.mint;

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE);

  // permanent rewire: the buggy shortcut is replaced by the real route through COMPARE
  const fixedT = seg(frame, B4_S, B4_S + 18);

  // beat 2: the kickoff token slides straight from SPOND to the KIOSK spot, bypassing COMPARE
  const shortcutProgress = interpolate(frame, [B2_S + 8, B2_E - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const kickoffArrived = seg(frame, B2_S + 90, B2_S + 100);
  const meetupDropped = seg(frame, B2_S + 40, B2_S + 55);

  // beat 4: both tokens travel A -> B, then the far branch B -> C2 lights up
  const legAB = interpolate(frame, [B4_S + 15, B4_S + 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const legBC2 = interpolate(frame, [B4_S + 95, B4_E - 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // beat 4 -> 5: the KIOSK node morphs into a full browser window (non-crossfade)
  const growT = interpolate(frame, [B5_S, B5_S + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const kioskR = 56;
  const morphX = interpolate(growT, [0, 1], [NODE_C2.x - kioskR, WIN5.x]);
  const morphY = interpolate(growT, [0, 1], [NODE_C2.y - kioskR, WIN5.y]);
  const morphW = interpolate(growT, [0, 1], [kioskR * 2, WIN5.w]);
  const morphH = interpolate(growT, [0, 1], [kioskR * 2, WIN5.h]);

  const shortcutOldOpacity = 1 - fixedT;
  const fixedRouteOpacity = fixedT;
  const kioskNodeVisible = 1 - growT; // hide the small node once the window has grown

  return (
    <PaletteProvider value={MOODS.mint}>
      <LightBg />

      {/* ---------------- persistent flow map (all beats) ---------------- */}
      <svg style={{ position: "absolute", inset: 0, width: 1280, height: 720 }}>
        <Route a={NODE_A} b={NODE_C2} color={B.danger} opacity={shortcutOldOpacity * 0.85} dashed />
        <Route a={NODE_A} b={NODE_B} color={B.accent} opacity={fixedRouteOpacity} />
        <Route a={NODE_B} b={NODE_C1} color={B.border} opacity={fixedRouteOpacity * 0.6} dashed />
        <Route a={NODE_B} b={NODE_C2} color={B.success} opacity={fixedRouteOpacity} />
      </svg>

      <Node pos={NODE_A} r={58} emoji="📅" label="SPOND" tone={B.accent} />
      <Node pos={NODE_B} r={64} emoji="🔀" label="COMPARE Δ ≥ 5 MIN" tone={B.accent} opacity={fixedRouteOpacity} />
      <Node pos={NODE_C1} r={46} emoji="🏁" label="ONE TIME" tone={B.border} opacity={fixedRouteOpacity * 0.7} />
      {kioskNodeVisible > 0.02 ? (
        <Node pos={NODE_C2} r={kioskR} emoji="📺" label="KIOSK" tone={B.success} opacity={kioskNodeVisible} />
      ) : null}

      {/* beat 2 shortcut token */}
      <Token pos={lerp(NODE_A, NODE_C2, shortcutProgress)} emoji="🏁" opacity={b2 * (1 - kickoffArrived)} />
      {kickoffArrived > 0.5 ? (
        <div
          style={{
            position: "absolute",
            left: NODE_C2.x - 40,
            top: NODE_C2.y + 60,
            fontSize: 16,
            fontWeight: 800,
            color: B.ink,
            opacity: b2,
            fontFamily,
          }}
        >
          18:00 only
        </div>
      ) : null}

      {/* beat 4 tokens: A -> B, then B -> C2 */}
      {legAB > 0.02 && legAB < 1 ? <Token pos={lerp(NODE_A, NODE_B, legAB)} emoji="🕐" opacity={b4} /> : null}
      {legBC2 > 0.02 ? <Token pos={lerp(NODE_B, NODE_C2, legBC2)} emoji="✅" opacity={b4} /> : null}

      {/* ---------------- beat 1 : two different times exist ---------------- */}
      <Group opacity={b1}>
        <BeatLabel kicker="TWO CLOCKS" title="A meet-up time, and a kickoff time — not the same" />
        <StatPill x={70} y={300} emoji="🕐" text="Meet-up: 17:15" tone="accent" />
        <StatPill x={70} y={352} emoji="🏁" text="Kickoff: 18:00" tone="accent" />
      </Group>

      {/* ---------------- beat 2 : the kiosk only ever showed kickoff ---------------- */}
      <Group opacity={b2}>
        <BeatLabel kicker="THE BUG" title="The kiosk copied the kickoff field, straight through" />
        <FilterChip x={70} y={300} icon="📅" text="Spond API" color={B.accent} />
        <div
          style={{
            position: "absolute",
            left: NODE_A.x - 40,
            top: NODE_A.y + 70,
            fontSize: 26,
            opacity: meetupDropped,
            color: B.danger,
            fontFamily,
          }}
        >
          🕐 ✕
        </div>
      </Group>

      {/* ---------------- beat 3 : the kid metaphor (drawn, no UI) ---------------- */}
      <Group
        opacity={b3}
        dy={interpolate(frame, [B3_S, B3_S + 30], [24, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })}
      >
        <BeatLabel kicker="THE CONSEQUENCE" title="Told to arrive early, still looked late" />
        <Panel x={260} y={430} w={340} h={150} tone="card">
          <div style={{ padding: 18, fontFamily }}>
            <div style={{ fontSize: 40 }}>🧒</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: B.ink, marginTop: 6 }}>
              Told: 15 minutes early
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: B.danger, marginTop: 4 }}>
              Arrived exactly at 18:00 — the whistle, not the meet-up
            </div>
          </div>
        </Panel>
      </Group>

      {/* ---------------- beat 4 : both signals checked, per gap ---------------- */}
      <Group opacity={b4}>
        <BeatLabel kicker="THE FIX" title="Now both times are checked against a real gap" />
        <StatPill x={700} y={300} emoji="🕐" text="Meet-up 17:15" tone="accent" />
        <StatPill x={700} y={350} emoji="🏁" text="Kickoff 18:00" tone="accent" />
        <StatPill x={700} y={400} emoji="✅" text="45 min apart → show both" tone="success" />
      </Group>

      {/* ---------------- beat 5 : the real kiosk page, holds to the end ---------------- */}
      <Group opacity={b5}>
        <BeatLabel kicker="THE RESULT" title="A real gap now prints clearly — not just the whistle" />
        <Panel x={40} y={560} w={210} h={130} tone="success">
          <div style={{ padding: 14, textAlign: "center", fontFamily }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.muted, textDecoration: "line-through" }}>
              1 time shown
            </div>
            <div style={{ fontSize: 48, fontWeight: 800, color: B.success, marginTop: 4 }}>2</div>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: B.muted, marginTop: 2 }}>
              TIMES SHOWN
            </div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: morphX,
            top: morphY,
            width: morphW,
            height: morphH,
            opacity: growT,
          }}
        >
          <LiveWindow
            file={shotsFile}
            shot="page"
            title="vitalii.no/features/…-b54"
            from={B5_S}
            hold={END - B5_S}
            win={{ x: 0, y: 0, w: morphW, h: morphH }}
            opacity={1}
          />
        </div>
      </Group>
    </PaletteProvider>
  );
};
