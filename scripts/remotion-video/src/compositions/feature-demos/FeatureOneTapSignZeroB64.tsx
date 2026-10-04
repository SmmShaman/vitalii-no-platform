/**
 * FeatureOneTapSignZeroB64 — feature b64 — 1280x720, 855 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 4 "flow map", mood "dawn" (handed down, not re-drawn).
 *
 * Staged as a horizontal pipeline, same idea as the other flow-map clips: a
 * dominant central "Boytasks App" gate sits dead-center of the frame. Two
 * lanes feed it — Install (top) and Sign-in (bottom). In beats 1-2 the gate
 * is dashed/empty and both lanes pile up ghost duplicates against it (the
 * problem: three phones by hand, a PIN every time). Beat 3 fixes the
 * Sign-in lane — the gate's "sign-in" row flips to "one tap" — and is the
 * one UI beat (per STEP 0c): a LiveWindow recording of the feature's own
 * real page scale-pushes in as proof, next to the single tech-credibility
 * chip (Credential Manager). Beat 4 fixes the Install lane — the gate's
 * "install" row flips to "auto" — drawn with the real file/path names from
 * the build, since no verified GitHub URL exists for this feature to record
 * live. Beat 5 does not play the feature page or hub (gate 2): it closes on
 * a LogWindow built only from the numbers already in the narration.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-165  "Every time I shipped a new build, I had to plug in three
 *              phones and install it by hand."
 *  b2 174-333  "And logging in meant typing a PIN, even on a phone already
 *              signed into the right account."
 *  b3 342-497  "Now the app checks for your Google account with Credential
 *              Manager, and signs you in with one tap."
 *  b4 506-681  "A new build checks itself for updates and installs
 *              automatically, no cable, no laptop."
 *  b5 690-810  "Three manual installs, every release, down to zero." —
 *              holds to 855, no fade-out.
 *
 * Single tech name in the whole clip: Credential Manager (one FilterChip,
 * beat 3 only). The numbers (3 phones, 0 after) come straight from the
 * narration — nothing here is an invented statistic.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import { Headline, StatPill, FilterChip, CaptionBand, CheckBadge, FlowArrow, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/b64.json";

const P = MOODS.dawn;

const B1_S = 15, B1_E = 165;
const B2_S = 174, B2_E = 333;
const B3_S = 342, B3_E = 497;
const B4_S = 506, B4_E = 681;
const B5_S = 690, B5_E = 810;
const FADE = 9;

const WIN3: Win = { x: 230, y: 150, w: 820, h: 430 };
const WIN_LOG: Win = { x: 250, y: 150, w: 880, h: 420 };

const GATE = { x: 560, y: 150, w: 160, h: 460 };
const SOURCE_X = 60;
const OUTPUT_X = 990;
const CARD_W = 230;
const CARD_H = 140;
const LANE_Y = { install: 170, signin: 450 };

/** One rectangular lane card (source or output), top-left anchored. */
const LaneCard: React.FC<{
  x: number;
  y: number;
  emoji: string;
  label: string;
  sub: string;
  tone: "danger" | "success" | "idle";
  opacity: number;
  dashed?: boolean;
}> = ({ x, y, emoji, label, sub, tone, opacity, dashed }) => {
  if (opacity <= 0.004) return null;
  const bg = tone === "success" ? P.successBg : tone === "danger" ? P.dangerBg : P.chipBg;
  const edge = tone === "success" ? P.successEdge : tone === "danger" ? P.dangerEdge : P.border;
  const subColor = tone === "success" ? P.success : tone === "danger" ? P.danger : P.muted;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 18,
        background: tone === "idle" ? "rgba(255,255,255,0.6)" : P.card,
        border: `1.5px ${dashed ? "dashed" : "solid"} ${edge}`,
        boxShadow: tone === "idle" ? "none" : cardShadow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        opacity,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 28, filter: tone === "idle" ? "grayscale(0.6)" : undefined }}>{emoji}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: tone === "idle" ? P.muted : P.ink }}>{label}</div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: subColor,
          background: bg,
          borderRadius: 8,
          padding: "3px 10px",
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </div>
    </div>
  );
};

/** Fan of ghost duplicates piling up against the closed gate — "nothing
 * stops it, it just repeats" visual for the problem beats. */
const DuplicateStack: React.FC<{ laneY: number; opacity: number }> = ({ laneY, opacity }) => {
  if (opacity <= 0.004) return null;
  const startX = SOURCE_X + CARD_W + 26;
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: startX + i * 78,
            top: laneY + i * 16,
            width: 150,
            height: CARD_H - 20,
            borderRadius: 16,
            border: `1.5px dashed ${P.dangerEdge}`,
            background: "rgba(255,255,255,0.5)",
            opacity: opacity * (0.5 - i * 0.13),
          }}
        />
      ))}
    </>
  );
};

/** Faint grayscale tiling of the beat's own repeating icon — a full-canvas
 * grid so the single active lane still leaves the whole frame textured. */
const RepeatWallpaper: React.FC<{ opacity: number; emoji: string }> = ({ opacity, emoji }) => {
  if (opacity <= 0.004) return null;
  const cols = 7;
  const rows = 4;
  const stepX = 165;
  const stepY = 128;
  const startX = 44;
  const startY = 156;
  return (
    <>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <div
            key={`w-${r}-${c}`}
            style={{
              position: "absolute",
              left: startX + c * stepX,
              top: startY + r * stepY,
              fontSize: 30,
              opacity: opacity * 0.16,
              filter: "grayscale(1)",
            }}
          >
            {emoji}
          </div>
        ))
      )}
    </>
  );
};

/** The dominant central element: the app itself, with two status rows that
 * flip from red to green the moment their lane's fix lands — and stay that
 * way for the rest of the clip. */
const GateBox: React.FC<{ opacity: number; signinOn: number; installOn: number }> = ({ opacity, signinOn, installOn }) => {
  if (opacity <= 0.004) return null;
  const bothOn = signinOn > 0.5 && installOn > 0.5;
  const anyOn = signinOn > 0.5 || installOn > 0.5;
  const row = (on: boolean, icon: string, onText: string, offText: string) => (
    <div
      style={{
        fontSize: 14,
        fontWeight: 700,
        padding: "5px 12px",
        borderRadius: 10,
        background: on ? P.successBg : P.dangerBg,
        color: on ? P.success : P.danger,
        whiteSpace: "nowrap",
      }}
    >
      {icon} {on ? onText : offText}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: GATE.x,
        top: GATE.y,
        width: GATE.w,
        height: GATE.h,
        borderRadius: 24,
        background: bothOn ? P.successBg : P.chipBg,
        border: anyOn ? `3px solid ${P.accent}` : `3px dashed ${P.accentEdge}`,
        boxShadow: anyOn ? cardShadow : "none",
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 32 }}>📲</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, textAlign: "center" }}>Boytasks App</div>
      {row(signinOn > 0.5, "🔑", "one tap", "PIN")}
      {row(installOn > 0.5, "📦", "auto", "manual")}
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "before", text: "install: 3 phones + cable, by hand, every release", tone: "danger" },
  { t: "before", text: "login: PIN typed every time, even on a signed-in phone", tone: "danger" },
  { t: "check", text: "signIn → Credential Manager, phone's Google account", tone: "accent" },
  { t: "check", text: "build → self-update check, no cable, no laptop", tone: "accent" },
  { t: "after", text: "login: one tap, no PIN", tone: "success" },
  { t: "after", text: "install: automatic, zero phones plugged in", tone: "success" },
  { t: "result", text: "manual installs per release: 3 → 0", tone: "success" },
];

export const FeatureOneTapSignZeroB64: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  const checkPop3 = Math.min(1, pop(B3_S + 24));
  const checkPop4 = Math.min(1, pop(B4_S + 30));
  const signinOn = Math.min(1, pop(B3_S)); // flips at beat 3, stays flipped
  const installOn = Math.min(1, pop(B4_S)); // flips at beat 4, stays flipped
  const gateOpacity = Math.max(b1, b2, b3, b4);

  // ---- beat 3 : scale-push the real page in (non-crossfade transition) ----
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arrowIn = (start: number) => interpolate(frame, [start, start + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <PaletteProvider value={MOODS.dawn}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(165deg, ${P.bgTop} 0%, ${P.bgBottom} 100%)`,
          }}
        />

        {/* ================= beat headlines ================= */}
        <Headline y={42} text="Every new build meant plugging in" accentText="three phones, by hand." accentColor={P.danger} opacity={b1} fontSize={30} />
        <Headline y={42} text="Logging in always meant typing a" accentText="PIN — even on the right phone." accentColor={P.danger} opacity={b2} fontSize={30} />
        <Headline y={42} text="Now the app checks your Google account and signs in with" accentText="one tap." accentColor={P.accent} opacity={b3} fontSize={27} />
        <Headline y={42} text="A new build checks itself and installs" accentText="automatically — no cable." accentColor={P.success} opacity={b4} fontSize={29} />
        <Headline y={42} text="Three manual installs, every release," accentText="down to zero." accentColor={P.success} opacity={b5} fontSize={30} />

        {/* ================= beat 1 : product line ================= */}
        <div style={{ position: "absolute", left: 90, top: 96, fontSize: 20, fontWeight: 750, color: P.ink, opacity: b1 }}>
          👪 Boytasks — a screen-time app for three kids, on Cloudflare Workers
        </div>

        {/* ================= the Boytasks App gate — dominant central bar, every beat ================= */}
        <GateBox opacity={gateOpacity} signinOn={signinOn} installOn={installOn} />

        {/* ================= beats 1-2 : lanes piling up against the closed gate ================= */}
        <RepeatWallpaper opacity={b1} emoji="📱" />
        <RepeatWallpaper opacity={b2} emoji="🔢" />

        <LaneCard x={SOURCE_X} y={LANE_Y.install} emoji="📱" label="New Build" sub="3 phones + cable" tone="danger" opacity={b1} />
        <DuplicateStack laneY={LANE_Y.install} opacity={b1} />
        <StatPill x={90} y={LANE_Y.install + CARD_H + 20} emoji="⚠" text="plugged in by hand — every release" tone="danger" opacity={b1} />
        <LaneCard x={SOURCE_X} y={LANE_Y.signin} emoji="🔢" label="Login" sub="PIN every time" tone="idle" dashed opacity={b1 * 0.55} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.install} emoji="📱" label="New Build" sub="waiting…" tone="idle" dashed opacity={b1 * 0.4} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.signin} emoji="🔢" label="Login" sub="waiting…" tone="idle" dashed opacity={b1 * 0.4} />

        <LaneCard x={SOURCE_X} y={LANE_Y.signin} emoji="🔢" label="Login" sub="PIN every time" tone="danger" opacity={b2} />
        <StatPill x={90} y={LANE_Y.signin + CARD_H + 20} emoji="⚠" text="typed even on the right, signed-in phone" tone="danger" opacity={b2} />
        <LaneCard x={SOURCE_X} y={LANE_Y.install} emoji="📱" label="New Build" sub="3 phones + cable" tone="idle" dashed opacity={b2 * 0.55} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.install} emoji="📱" label="New Build" sub="waiting…" tone="idle" dashed opacity={b2 * 0.4} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.signin} emoji="🔢" label="Login" sub="waiting…" tone="idle" dashed opacity={b2 * 0.4} />

        {/* ================= beat 3 : sign-in lane flows through, fixed ================= */}
        <FlowArrow x={SOURCE_X + CARD_W + 10} y={LANE_Y.signin + CARD_H / 2 - 3} len={GATE.x - (SOURCE_X + CARD_W + 10) - 10} progress={arrowIn(B3_S)} color={P.accent} opacity={b3} />
        <FlowArrow x={GATE.x + GATE.w + 10} y={LANE_Y.signin + CARD_H / 2 - 3} len={OUTPUT_X - (GATE.x + GATE.w + 10) - 10} progress={arrowIn(B3_S + 14)} color={P.accent} opacity={b3} />
        <LaneCard x={SOURCE_X} y={LANE_Y.signin} emoji="🔑" label="Login" sub="Credential Manager" tone="success" opacity={b3} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.signin} emoji="✅" label="Login" sub="one tap ✓" tone="success" opacity={b3} />
        <CheckBadge x={OUTPUT_X + CARD_W - 10} y={LANE_Y.signin - 6} size={30} opacity={b3} scale={checkPop3} />
        <LaneCard x={SOURCE_X} y={LANE_Y.install} emoji="📱" label="New Build" sub="3 phones + cable" tone="idle" dashed opacity={b3 * 0.55} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.install} emoji="📱" label="New Build" sub="waiting…" tone="idle" dashed opacity={b3 * 0.4} />
        <FilterChip x={GATE.x - 30} y={GATE.y - 46} text="Credential Manager" icon="🔑" color={P.accent} scale={Math.min(1, pop(B3_S))} opacity={b3} />

        {/* ================= beat 4 : install lane flows through, fixed ================= */}
        <FlowArrow x={SOURCE_X + CARD_W + 10} y={LANE_Y.install + CARD_H / 2 - 3} len={GATE.x - (SOURCE_X + CARD_W + 10) - 10} progress={arrowIn(B4_S)} color={P.success} opacity={b4} />
        <FlowArrow x={GATE.x + GATE.w + 10} y={LANE_Y.install + CARD_H / 2 - 3} len={OUTPUT_X - (GATE.x + GATE.w + 10) - 10} progress={arrowIn(B4_S + 14)} color={P.success} opacity={b4} />
        <LaneCard x={SOURCE_X} y={LANE_Y.install} emoji="📦" label="New Build" sub="self-update check" tone="success" opacity={b4} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.install} emoji="📦" label="New Build" sub="auto-installs ✓" tone="success" opacity={b4} />
        <CheckBadge x={OUTPUT_X + CARD_W - 10} y={LANE_Y.install - 6} size={30} opacity={b4} scale={checkPop4} />
        <LaneCard x={SOURCE_X} y={LANE_Y.signin} emoji="✅" label="Login" sub="one tap ✓" tone="success" opacity={b4 * 0.7} />
        <LaneCard x={OUTPUT_X} y={LANE_Y.signin} emoji="✅" label="Login" sub="one tap ✓" tone="success" opacity={b4 * 0.7} />
        <StatPill x={90} y={LANE_Y.install + CARD_H + 20} emoji="🗂" text="android-app.yml → kids.vitalii.no/boytasks.apk" tone="success" opacity={b4} />

        {/* ================= per-beat captions ================= */}
        <CaptionBand text="Three phones, one cable, every single release." opacity={b1} tone="danger" />
        <CaptionBand text="Typing a PIN — even already signed into the right account." opacity={b2} tone="danger" />
        <CaptionBand text="Checks your Google account, signs in with one tap." opacity={b3} tone="accent" />
        <CaptionBand text="Checks itself, updates itself — no cable, no laptop." opacity={b4} tone="success" />

        {/* ================= beat 3 : the real page, scale-pushed in ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN3.x + WIN3.w / 2}px ${WIN3.y + WIN3.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-b64"
            win={WIN3}
            from={B3_S}
            hold={B3_E - B3_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b3}
          />
        </div>

        {/* ================= beat 5 : the result, from real numbers only (gate 2: never the feature page/hub) ================= */}
        <LogWindow lines={LOG_LINES} title="boytasks — build & sign-in" from={B5_S + 10} every={16} opacity={b5} win={WIN_LOG} fontSize={21} />
        <CaptionBand text="Three manual installs, every release — down to zero." opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
