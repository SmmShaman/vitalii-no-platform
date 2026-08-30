/**
 * FeatureDailyDigest — feature p10 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * ART-DIRECTION (2026-08-30): archetype 2 "zoom-in", mood "dawn".
 * A single camera pushes through one big "daily-video-bot" control room.
 * Beat 1 is a wide, small-scale establishing shot of the whole pipeline;
 * every following beat is the SAME camera scaling/panning INTO one module
 * until it fills the frame. Motion is camera (scale + pan), never a fade
 * between beats — content itself still fades in as the camera arrives.
 *
 * Story (5 beats, 450 frames, 90 each):
 *  1. 0-92     Wide shot — four faint modules of the whole pipeline, plus
 *              a floating "24-40 HRS BY HAND" label (the problem).
 *  2. 92-182   Zoom into Curate & Rank — Azure OpenAI ranks today's real
 *              stories by relevance score.
 *  3. 182-272  Zoom into Script & Voice — a real 58s script snippet plus a
 *              Zvukogram TTS waveform. One tech-credibility caption.
 *  4. 272-362  Zoom into Render — daily-compilation.js stitches intro,
 *              10 segments and an end card on a growing timeline.
 *  5. 362-450  Zoom into Output — the payoff: 24-40 hrs/day → under
 *              10 minutes, Telegram review → one-click YouTube publish.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, BrowserWindow, CheckBadge, CaptionBand, seg, loopFade, fontFamily } from "./bright-primitives";

const P = MOODS.dawn;

const VW = 1920;
const VH = 1080;

type ModuleDef = { key: string; x: number; y: number; w: number; h: number; emoji: string; label: string; ghostStart: number; ghostEnd: number; contentStart: number };

const MODULES: ModuleDef[] = [
  { key: "curate", x: 80, y: 120, w: 740, h: 380, emoji: "📋", label: "Curate & rank", ghostStart: 66, ghostEnd: 92, contentStart: 92 },
  { key: "script", x: 1100, y: 120, w: 740, h: 380, emoji: "✍️", label: "Script & voice", ghostStart: 156, ghostEnd: 182, contentStart: 182 },
  { key: "render", x: 80, y: 620, w: 740, h: 340, emoji: "🎬", label: "Render", ghostStart: 246, ghostEnd: 272, contentStart: 272 },
  { key: "output", x: 1100, y: 620, w: 740, h: 340, emoji: "📤", label: "Deliver", ghostStart: 336, ghostEnd: 362, contentStart: 362 },
];

const STORIES: { headline: string; score: number }[] = [
  { headline: "OpenAI ships a faster coding model", score: 9.4 },
  { headline: "EU tightens AI Act enforcement", score: 9.1 },
  { headline: "Nvidia unveils next-gen GPU line", score: 8.7 },
  { headline: "Robotics startup raises $40M round", score: 8.2 },
  { headline: "Cloud outage hits three continents", score: 7.9 },
];

const WAVEFORM = Array.from({ length: 36 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 0.7 + 0.3)));

const CAPTIONS: { s: number; e: number; text: string; tone: "danger" | "accent" | "success"; fontSize?: number }[] = [
  { s: 10, e: 70, text: "Every day, this whole show has to be produced from scratch.", tone: "danger" },
  { s: 96, e: 160, text: "An AI reads today's news and ranks what matters most.", tone: "accent" },
  { s: 186, e: 250, text: "Under the hood: Azure OpenAI writes the scripts, Zvukogram TTS voices them.", tone: "accent", fontSize: 17 },
  { s: 276, e: 340, text: "One pipeline turns scripts and voice into a finished broadcast.", tone: "accent" },
  { s: 366, e: 430, text: "Ready for a quick Telegram review, then one click to YouTube.", tone: "success" },
];

export const FeatureDailyDigest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── The camera: one continuous path, 4 stops, scale+pan (not fades) ──
  const FR = [0, 70, 92, 166, 182, 256, 272, 346, 362, 436, 450];
  const S = interpolate(frame, FR, [0.58, 0.58, 1.55, 1.55, 1.55, 1.55, 1.55, 1.55, 1.6, 1.6, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const OX = interpolate(frame, FR, [960, 960, 450, 450, 1470, 1470, 450, 450, 1470, 1470, 1470], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const OY = interpolate(frame, FR, [540, 540, 310, 310, 310, 310, 790, 790, 790, 790, 790], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const scriptSweep = interpolate(frame, [182, 250], [0, WAVEFORM.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const renderFill = seg(frame, 272, 340, Easing.out(Easing.cubic));
  const activeCaption = CAPTIONS.find((c) => frame >= c.s && frame < c.e);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ THE CAMERA — one world, one continuous zoom/pan ════ */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: lf }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: VW,
              height: VH,
              transformOrigin: "0 0",
              transform: `translate(640px,360px) scale(${S}) translate(${-OX}px, ${-OY}px)`,
            }}
          >
            {/* wide-shot problem label — camera pans past it, no fade needed */}
            <div style={{ position: "absolute", left: 560, top: 30, width: 800, textAlign: "center", fontFamily }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.danger }}>24-40 HRS · 3-5 PEOPLE · EVERY SINGLE DAY</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: P.muted, marginTop: 6 }}>Producing one daily video news show, entirely by hand</div>
            </div>

            {/* ghost previews — the "whole interface" seen from the wide shot */}
            {MODULES.map((m) => {
              const ghostOp = 1 - seg(frame, m.ghostStart, m.ghostEnd);
              if (ghostOp <= 0.004) return null;
              return (
                <div
                  key={`ghost-${m.key}`}
                  style={{
                    position: "absolute",
                    left: m.x,
                    top: m.y,
                    width: m.w,
                    height: m.h,
                    borderRadius: 20,
                    background: P.chipBg,
                    border: `2px solid ${P.border}`,
                    opacity: ghostOp,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                  }}
                >
                  <div style={{ fontSize: 64 }}>{m.emoji}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: P.muted, letterSpacing: 1 }}>{m.label}</div>
                </div>
              );
            })}

            {/* ════ Module: Curate & Rank ════ */}
            <BrowserWindow x={80} y={120} w={740} h={380} title="today's stories — ranked by Azure OpenAI" opacity={seg(frame, 92, 116)}>
              <div style={{ width: 740, fontFamily }}>
                {STORIES.map((s, i) => {
                  const t = seg(frame, 108 + i * 12, 108 + i * 12 + 14);
                  return (
                    <div
                      key={s.headline}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "16px 24px",
                        borderBottom: `1px solid ${P.border}`,
                        opacity: t,
                        transform: `translateX(${(1 - t) * 24}px)`,
                      }}
                    >
                      <div style={{ width: 26, color: P.muted, fontWeight: 800 }}>{i + 1}</div>
                      <div style={{ flex: 1, fontSize: 18, fontWeight: 650, color: P.ink }}>{s.headline}</div>
                      <div
                        style={{
                          padding: "3px 12px",
                          borderRadius: 999,
                          background: P.successBg,
                          border: `1px solid ${P.successEdge}`,
                          color: P.success,
                          fontWeight: 800,
                          fontSize: 15,
                        }}
                      >
                        {s.score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </BrowserWindow>

            {/* ════ Module: Script & Voice ════ */}
            <BrowserWindow x={1100} y={120} w={740} h={380} title="generate-script.js — segment 1" opacity={seg(frame, 182, 206)}>
              <div style={{ padding: "24px 28px", fontFamily }}>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.5, color: P.accent, opacity: seg(frame, 196, 212) }}>
                  SEGMENT 1 · 58s SCRIPT
                </div>
                <div style={{ fontSize: 19, fontWeight: 600, color: P.ink, lineHeight: 1.4, marginTop: 12, opacity: seg(frame, 202, 220) }}>
                  "OpenAI shipped a faster, cheaper coding model today — cutting inference cost by roughly 40% versus its predecessor."
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.5, color: P.accent, marginTop: 28, opacity: seg(frame, 214, 230) }}>
                  ZVUKOGRAM TTS — VOICING NOW
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 64, marginTop: 14, opacity: seg(frame, 214, 230) }}>
                  {WAVEFORM.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: 12,
                        height: 64 * h,
                        borderRadius: 4,
                        background: i < scriptSweep ? P.accent : P.chipBg,
                        border: `1px solid ${i < scriptSweep ? P.accent : P.border}`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </BrowserWindow>

            {/* ════ Module: Render ════ */}
            <BrowserWindow x={80} y={620} w={740} h={340} title="daily-compilation.js — assembling the broadcast" opacity={seg(frame, 272, 296)}>
              <div style={{ padding: "30px 30px", fontFamily }}>
                <div style={{ fontSize: 18, fontWeight: 650, color: P.ink, opacity: seg(frame, 286, 302) }}>
                  Intro → 10 voiced segments → branded end card
                </div>
                <div
                  style={{
                    marginTop: 22,
                    width: 680,
                    height: 22,
                    borderRadius: 11,
                    background: P.chipBg,
                    border: `1.5px solid ${P.border}`,
                    overflow: "hidden",
                    opacity: seg(frame, 292, 308),
                  }}
                >
                  <div style={{ width: 680 * renderFill, height: "100%", background: P.accent, opacity: 0.88 }} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const t = seg(frame, 296 + i * 5, 296 + i * 5 + 8);
                    return (
                      <div
                        key={i}
                        style={{
                          width: 50,
                          height: 30,
                          borderRadius: 6,
                          background: t > 0.5 ? P.accentBg : P.chipBg,
                          border: `1.5px solid ${t > 0.5 ? P.accentEdge : P.border}`,
                          opacity: Math.min(1, t + 0.35),
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </BrowserWindow>

            {/* ════ Module: Output ════ */}
            <div style={{ position: "absolute", left: 1100, top: 620, width: 740, fontFamily, opacity: seg(frame, 362, 386) }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: P.muted, textDecoration: "line-through", opacity: 0.7 }}>24-40 hrs</span>
                <span style={{ fontSize: 26, color: P.muted }}>→</span>
                <span style={{ fontSize: 68, fontWeight: 800, color: P.success, letterSpacing: -2 }}>&lt;10 min</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 650, color: P.muted, marginTop: 6 }}>≈140× less manual work, every single day</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30 }}>
                <CheckBadge x={0} y={0} size={44} scale={Math.min(1, pop(400))} opacity={Math.min(1, pop(400))} />
                <div style={{ fontSize: 18, fontWeight: 650, color: P.ink, width: 540, lineHeight: 1.3 }}>
                  A quick Telegram review, then one click publishes to YouTube.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ Screen-space caption band (stays legible while the camera moves) ════ */}
        {activeCaption ? (
          <CaptionBand
            text={activeCaption.text}
            tone={activeCaption.tone}
            fontSize={activeCaption.fontSize ?? 22}
            opacity={Math.min(seg(frame, activeCaption.s, activeCaption.s + 14), 1 - seg(frame, activeCaption.e - 14, activeCaption.e))}
            y={654}
          />
        ) : null}

        {/* ════ Tiny fixed corner tag ════ */}
        <div style={{ position: "absolute", left: 26, top: 22, fontSize: 14, fontWeight: 700, color: P.muted, opacity: lf, fontFamily }}>
          daily-video-bot · fully automated
        </div>
      </div>
    </PaletteProvider>
  );
};
