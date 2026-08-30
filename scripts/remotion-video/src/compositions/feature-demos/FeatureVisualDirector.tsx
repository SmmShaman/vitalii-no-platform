/**
 * FeatureVisualDirector — feature p09 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * ART-DIRECTION (2026-08-30): archetype 1 "timeline ribbon", mood "slate".
 * A slim horizontal time band runs across the top of the frame for the
 * WHOLE clip. Three real script phrases land on it left→right as stamps:
 * each stop starts as the same generic clip icon (the problem — every
 * video looks identical), then morphs into its own distinct visual-effect
 * icon the instant the AI assigns it (the solution). The headline sits
 * bottom-left, small, never centered — the ribbon itself carries the story.
 *
 * Story (4 beats, 450 frames):
 *  1. 0-114    Problem — all three timeline stops show the same bland clip
 *              icon; a browser mockup scrolls an identical-looking video
 *              library underneath.
 *  2. 106-252  Solution — each stop morphs into its real effect (data
 *              dashboard, glitch, globe) as a real headline is read; a
 *              label pops under the ribbon for each landing.
 *  3. 244-340  How — a matching photo swatch drops under every lit stop
 *              (ContextualImageFetcher); one tech-credibility caption.
 *  4. 332-450  Result — SLIDES up (not a crossfade): ribbon stays lit on
 *              top, big hero number "8" replaces the old "1", +20-30%
 *              engagement, check badge.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  BrowserWindow,
  SkeletonScroll,
  StatPill,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.slate;

type Stop = { x: number; before: string; after: string; effectKey: string; headline: string; land: number };

const STOPS: Stop[] = [
  { x: 255, before: "🎬", after: "📊", effectKey: "data-dashboard", headline: "Norway doubles offshore wind capacity by 2030.", land: 132 },
  { x: 640, before: "🎬", after: "⚡", effectKey: "glitch", headline: "Silicon Valley's new AI chip startup raises $200M.", land: 168 },
  { x: 1025, before: "🎬", after: "🌍", effectKey: "globe", headline: "Scientists map deep-sea currents near Svalbard.", land: 204 },
];

const RIBBON_Y = 100;

const BeatLabel: React.FC<{ kicker: string; title: string; detail: string; color: string }> = ({ kicker, title, detail, color }) => (
  <div style={{ position: "absolute", left: 66, top: 552, width: 640, fontFamily }}>
    <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 3, color: P.muted }}>{kicker}</div>
    <div style={{ fontSize: 34, fontWeight: 800, color: P.ink, marginTop: 8, lineHeight: 1.15 }}>{title}</div>
    <div style={{ fontSize: 18, fontWeight: 600, color, marginTop: 10 }}>{detail}</div>
  </div>
);

export const FeatureVisualDirector: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows: 4 beats, deliberately not the retired 0/104/228/340 split ──
  const b1 = seg(frame, 0, 12) * (1 - seg(frame, 98, 114)) * lf;
  const b2 = seg(frame, 106, 122) * (1 - seg(frame, 236, 252)) * lf;
  const b3 = seg(frame, 244, 260) * (1 - seg(frame, 326, 340)) * lf;

  // beat 3 → beat 4 is a SLIDE, not a crossfade: the "how" stage exits
  // upward while the result stage pushes in from below.
  const b3exitY = interpolate(frame, [326, 356], [0, -70], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const b4slideY = interpolate(frame, [330, 366], [90, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const b4 = seg(frame, 332, 350) * lf;

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ THE RIBBON — alive for the whole clip ════ */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 190, opacity: lf }}>
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
                    background: active ? P.accentBg : P.chipBg,
                    border: `2.5px solid ${active ? P.accent : P.border}`,
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
                      fontSize: 30,
                      opacity: 1 - t,
                    }}
                  >
                    {s.before}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 30,
                      opacity: t,
                      transform: `scale(${0.6 + t * 0.4})`,
                    }}
                  >
                    {s.after}
                  </span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: s.x - 160,
                    top: RIBBON_Y + 46,
                    width: 320,
                    textAlign: "center",
                    opacity: t,
                    fontFamily,
                  }}
                >
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: active ? P.ink : P.muted }}>{s.headline}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: P.accent, marginTop: 4 }}>→ {s.effectKey}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ════ Beat 1 — PROBLEM ════ */}
        <Group opacity={b1}>
          <BrowserWindow x={310} y={198} w={660} h={300} title="video library — 40 clips, same look" opacity={Math.min(1, pop(10))}>
            <SkeletonScroll w={660} h={300} offset={frame * 2.2} />
          </BrowserWindow>
          <BeatLabel
            kicker="AI VIDEO PIPELINE"
            title="Every video looked exactly the same."
            detail="Same background, same text animation — whatever the topic."
            color={P.danger}
          />
        </Group>

        {/* ════ Beat 2 — SOLUTION ════ */}
        <Group opacity={b2}>
          <BeatLabel
            kicker="VISUAL DIRECTOR"
            title="Each phrase gets its own look."
            detail="A live AI read picks 1 of 8 visual effects per line, automatically."
            color={P.accent}
          />
          <StatPill x={760} y={480} emoji="🎯" text="3 of 8 effects picked so far" tone="accent" scale={Math.min(1, pop(210))} opacity={Math.min(1, pop(210))} />
          <StatPill x={760} y={540} emoji="✅" text="Zero manual picking" tone="success" scale={Math.min(1, pop(224))} opacity={Math.min(1, pop(224))} />
        </Group>

        {/* ════ Beat 3 — HOW IT STAYS SHARP ════ */}
        <Group opacity={b3} dy={b3exitY}>
          {STOPS.map((s) => {
            const t = seg(frame, s.land + 40, s.land + 54);
            return (
              <div
                key={s.x}
                style={{
                  position: "absolute",
                  left: s.x - 42,
                  top: 300,
                  width: 84,
                  height: 58,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${P.accentEdge}, ${P.successEdge})`,
                  border: `1.5px solid ${P.border}`,
                  opacity: t,
                  transform: `translateY(${(1 - t) * -14}px)`,
                  boxShadow: "0 8px 18px rgba(16,24,40,0.12)",
                }}
              />
            );
          })}
          <BeatLabel
            kicker="CONTEXTUAL IMAGE FETCHER"
            title="Then a real photo lands on every stop."
            detail="Not a static background — an image that matches the story."
            color={P.accent}
          />
          <CaptionBand
            text="Under the hood: an Azure OpenAI prompt scores every phrase for effect + image search terms"
            tone="card"
            fontSize={17}
            y={200}
            opacity={seg(frame, 268, 284)}
          />
        </Group>

        {/* ════ Beat 4 — RESULT (slides up; does not crossfade) ════ */}
        <Group opacity={b4} dy={b4slideY}>
          <div style={{ position: "absolute", left: 66, top: 152, fontFamily }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
              <span style={{ fontSize: 46, fontWeight: 800, color: P.muted, textDecoration: "line-through", opacity: 0.7 }}>1 look</span>
              <span style={{ fontSize: 30, color: P.muted }}>→</span>
              <span style={{ fontSize: 128, fontWeight: 800, color: P.success, letterSpacing: -4 }}>8</span>
              <span style={{ fontSize: 30, fontWeight: 700, color: P.ink }}>distinct looks</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 70, top: 312, fontSize: 20, fontWeight: 600, color: P.muted, fontFamily }}>
            matched to every phrase, automatically
          </div>
          <CheckBadge x={70} y={372} size={46} scale={Math.min(1, pop(360))} opacity={Math.min(1, pop(360))} />
          <div
            style={{
              position: "absolute",
              left: 136,
              top: 378,
              fontSize: 44,
              fontWeight: 800,
              color: P.success,
              fontFamily,
              opacity: Math.min(1, pop(360)),
            }}
          >
            +20-30% engagement
          </div>
          <div style={{ position: "absolute", left: 70, top: 470, fontSize: 20, fontWeight: 650, color: P.muted, fontFamily, opacity: seg(frame, 380, 396) }}>
            Every video now has its own visual identity.
          </div>
          <div style={{ position: "absolute", left: 70, top: 506, fontSize: 17, fontWeight: 600, color: P.accent, fontFamily, opacity: seg(frame, 386, 402) }}>
            Visual Director · vitalii.no
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
