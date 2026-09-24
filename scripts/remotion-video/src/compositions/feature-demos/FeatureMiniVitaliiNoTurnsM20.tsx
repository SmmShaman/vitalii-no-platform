/**
 * FeatureMiniVitaliiNoTurnsM20 — feature m20 — 1280x720, 858 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 7 hero number, mood slate (handed down by the orchestrating session —
 * not re-drawn here, out/lux-archetypes.md is not touched by this file).
 *
 * One figure owns the frame for the whole clip and MORPHS through the story:
 *   0   "CUSTOM LESSON INPUTS ALLOWED"        (the fixed-menu problem, beats 1-2)
 *   3   "INPUT TYPES: WORD · PDF · PHOTO"     (the Cloudflare Worker, beats 3-4)
 *   ~60s "SECONDS TO FIRST AUDIO"             (the result, beat 5)
 * fontSize stays >= 200 at every frame — it never shrinks into a corner badge.
 *
 * Beats, measured from the edge-tts build (do not hand-tune without rebuilding audio):
 *   b1  15-186  "I wanted to learn Norwegian by ear on the bus, but every app made
 *                me pick from ready-made lessons."               — LiveWindow(hub)
 *   b2 195-357  "I couldn't just say the word I needed, upload a textbook page,
 *                or snap a photo of a menu."                     — drawn, 3 blocked inputs
 *   b3 366-545  "Now a Cloudflare Worker turns any word, PDF, or photo into a
 *                narrated lesson."                                — LiveWindow(page)
 *   b4 554-665  "Less like borrowing someone's tapes, more like recording your own."
 *                                                                  — drawn metaphor, slide-in
 *   b5 674-813  "Playback now starts in about a minute, not after the whole lesson
 *                renders." (holds to 858)                         — LogWindow, grounded lines
 *
 * Only two public URLs are verified for tonight: the feature's own page and the
 * features hub — both used, never in the last beat (Gate 2). No GitHub URL used.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, interpolateColors, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, Panel, StatPill, CheckBadge, CaptionBand, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shots from "./shots/m20.json";

const P = MOODS.slate;
const HUB_SHOT = "hub";
const PAGE_SHOT = "page";

const BEATS = {
  b1: [15, 186],
  b2: [195, 357],
  b3: [366, 545],
  b4: [554, 665],
  b5: [674, 813],
} as const;

/** The three ways in the sentence names, reused across beats 2 (blocked) and 3 (open). */
const INPUTS = [
  { emoji: "🎤", text: "say the word I needed" },
  { emoji: "📄", text: "upload a textbook page" },
  { emoji: "📸", text: "snap a photo of a menu" },
];

export const FeatureMiniVitaliiNoTurnsM20: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  /** A beat that fades in after its window opens and is fully gone before it closes. */
  const zone = (name: keyof typeof BEATS) => {
    const [s, e] = BEATS[name];
    return Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));
  };

  const b1 = zone("b1");
  const b2 = zone("b2");
  const b3 = zone("b3");
  const b4 = zone("b4");
  // The last beat has nothing to hand over to — it holds through the tail.
  const b5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);

  // Beat 4 slides up instead of crossfading — the one non-crossfade transition.
  const b4dy = (1 - Math.min(1, interpolate(frame, [554, 580], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))) * 26;

  // ── The hero figure: one element, three states, never below fontSize 200 ──
  const heroIn = seg(frame, 6, 26);
  const heroNum = (): number => {
    if (frame < 380) return 0;
    if (frame < 420)
      return Math.round(
        interpolate(frame, [380, 420], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
      );
    if (frame < 700) return 3;
    if (frame < 760)
      return Math.round(
        interpolate(frame, [700, 760], [3, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
      );
    return 60;
  };
  const heroColor = interpolateColors(Math.min(frame, 760), [0, 380, 420, 700, 760], [P.danger, P.danger, P.accent, P.accent, P.success]);
  const heroLabel =
    frame < 420 ? "CUSTOM LESSON INPUTS ALLOWED"
    : frame < 760 ? "INPUT TYPES: WORD · PDF · PHOTO"
    : "SECONDS TO FIRST AUDIO";
  const heroSuffix = frame >= 692 ? "s" : "";
  const heroPrefix = frame >= 760 ? "~" : "";

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Persistent top-right wordmark — never fades, keeps the top row filled ════ */}
        <div
          style={{
            position: "absolute",
            left: 980,
            top: 34,
            width: 260,
            textAlign: "right",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: 1.8,
            color: P.muted,
            opacity: 0.85,
          }}
        >
          🎧 MINI ELVARIKA
        </div>

        {/* ════ THE HERO NUMBER — alive for the whole clip, fontSize never below 200 ════ */}
        <div style={{ position: "absolute", left: 70, top: 128, fontSize: 20, fontWeight: 700, letterSpacing: 2.2, textTransform: "uppercase", color: P.muted, opacity: heroIn }}>
          mini.vitalii.no
        </div>
        <div style={{ position: "absolute", left: 70, top: 168, width: 520, fontSize: 216, lineHeight: 1, fontWeight: 800, letterSpacing: -6, color: heroColor, opacity: heroIn, fontVariantNumeric: "tabular-nums" }}>
          {heroPrefix}
          {heroNum()}
          <span style={{ fontSize: 216 * 0.32 }}>{heroSuffix}</span>
        </div>
        <div style={{ position: "absolute", left: 74, top: 402, width: 480, fontSize: 25, fontWeight: 700, letterSpacing: 2.6, color: P.muted, opacity: heroIn }}>
          {heroLabel}
        </div>

        {/* ════ Beat 1 — the fixed menu, recorded from the real hub ════ */}
        <Group opacity={b1}>
          <Panel x={936} y={78} w={304} h={128} tone="card" opacity={Math.min(1, pop(38))}>
            <div style={{ padding: "16px 20px", fontFamily }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Mini Elvarika</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: P.accent, marginTop: 2 }}>Norwegian by Ear</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: P.muted, marginTop: 6, lineHeight: 1.35 }}>
                A personal listening app — type a word, Claude writes the scene
              </div>
            </div>
          </Panel>
          <LiveWindow
            file={shots as any}
            shot={HUB_SHOT}
            title="vitalii.no/features"
            from={15}
            hold={171}
            zoom={(t) => 1 + 0.14 * t}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={1}
            win={{ x: 640, y: 224, w: 560, h: 340 }}
          />
          <StatPill x={664} y={240} emoji="🔒" text="fixed menu only" tone="danger" scale={Math.min(1, pop(70))} opacity={Math.min(1, pop(70))} fontSize={16} />
          <CaptionBand y={636} text="On the bus, only ready-made lessons to pick from" tone="card" fontSize={20} opacity={seg(frame, 130, 152)} />
        </Group>

        {/* ════ Beat 2 — the three things I could not just do ════ */}
        <Group opacity={b2}>
          {INPUTS.map((it, i) => {
            const s = pop(212 + i * 30);
            return (
              <div
                key={it.text}
                style={{
                  position: "absolute",
                  left: 650,
                  top: 150 + i * 110,
                  width: 520,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: Math.min(1, s),
                  transform: `translateX(${(1 - Math.min(1, s)) * 24}px)`,
                }}
              >
                <div style={{ fontSize: 30 }}>{it.emoji}</div>
                <div style={{ flex: 1, fontSize: 21, fontWeight: 650, color: P.ink }}>{it.text}</div>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: P.dangerBg,
                    border: `1.5px solid ${P.dangerEdge}`,
                    color: P.danger,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  ✕
                </div>
              </div>
            );
          })}
          <CaptionBand y={636} text="Only pick from the list — never type your own" tone="card" fontSize={20} opacity={seg(frame, 320, 342)} />
        </Group>

        {/* ════ Beat 3 — the Cloudflare Worker, recorded from the real page ════ */}
        <Group opacity={b3}>
          <LiveWindow
            file={shots as any}
            shot={PAGE_SHOT}
            title="vitalii.no/features/minivitaliino…m20"
            from={366}
            hold={179}
            zoom={(t) => 1 + 0.15 * t}
            focus={{ x: 0.5, y: 0.4 }}
            opacity={1}
            win={{ x: 600, y: 120, w: 560, h: 360 }}
          />
          {INPUTS.map((it, i) => {
            const s = pop(392 + i * 24);
            return (
              <StatPill
                key={it.text}
                x={620 + i * 190}
                y={82}
                emoji={it.emoji}
                text={it.emoji === "🎤" ? "word" : it.emoji === "📄" ? "PDF" : "photo"}
                tone="success"
                scale={Math.min(1, s)}
                opacity={Math.min(1, s)}
                fontSize={17}
              />
            );
          })}
          <CaptionBand y={648} text="mini-elvarika-runner — a Cloudflare Worker turns it into a narrated lesson" tone="card" fontSize={20} opacity={seg(frame, 470, 496)} />
        </Group>

        {/* ════ Beat 4 — a metaphor, drawn, slides up (not a crossfade) ════ */}
        <Group opacity={b4} dy={b4dy}>
          <Panel x={650} y={210} w={244} h={150} tone="card" opacity={Math.min(1, pop(566))}>
            <div style={{ padding: "20px 22px", fontFamily }}>
              <div style={{ fontSize: 30 }}>📼</div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1.6, color: P.muted, marginTop: 10 }}>BORROWED</div>
              <div style={{ fontSize: 18, fontWeight: 650, color: P.ink, marginTop: 4, lineHeight: 1.3 }}>someone else's tapes</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: 906, top: 268, fontSize: 30, fontWeight: 700, color: P.muted, opacity: Math.min(1, pop(586)) }}>→</div>
          <Panel x={962} y={210} w={244} h={150} tone="success" opacity={Math.min(1, pop(596))}>
            <div style={{ padding: "20px 22px", fontFamily }}>
              <div style={{ fontSize: 30 }}>🎤</div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1.6, color: P.muted, marginTop: 10 }}>YOUR OWN</div>
              <div style={{ fontSize: 18, fontWeight: 650, color: P.success, marginTop: 4, lineHeight: 1.3 }}>recorded for this word</div>
            </div>
          </Panel>
        </Group>

        {/* ════ Beat 5 — the result, held to the end, never the page or the hub ════ */}
        <Group opacity={b5}>
          <LogWindow
            title="mini-elvarika-runner"
            lines={[
              { text: "lesson render requested", tone: "muted" },
              { text: "chunk 1 ready → playback starts", tone: "success" },
              { t: "≈60s", text: "time to first audio, not the full render", tone: "success" },
              { text: "remaining chunks stream in behind it", tone: "accent" },
              { text: "old flow: wait for the whole lesson", tone: "danger" },
            ]}
            from={682}
            every={24}
            opacity={1}
            win={{ x: 600, y: 130, w: 560, h: 380 }}
            fontSize={22}
          />
          <CheckBadge x={70} y={468} scale={Math.min(1, pop(770))} opacity={Math.min(1, pop(770))} size={34} />
          <div
            style={{
              position: "absolute",
              left: 122,
              top: 468,
              width: 428,
              fontSize: 19,
              fontWeight: 650,
              color: P.ink,
              lineHeight: 1.35,
              opacity: Math.min(1, pop(770)),
            }}
          >
            First line audible in ~60s —
            <br />
            not after the whole lesson renders
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
