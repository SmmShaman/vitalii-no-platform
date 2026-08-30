/**
 * FeatureLinkedinNativeUpload — feature p14 — 1280x720, 15s @ 30fps, silent,
 * loop-friendly. ART-DIRECTION REWORK (2026-08-30): archetype 6 "sidebar
 * narrative", mood violet. A fixed 320px left column carries the running
 * claim for the whole clip; the stage on the right is the only thing that
 * changes. The old centered-headline + zone-panels + 3-icon-strip +
 * 2-result-cards layout is retired.
 *
 * Kept from the old story: problem → solution → how → number.
 *
 * Story (4 beats, sidebar headline + stage content both swap non-crossfade):
 *  1. (0-125)   Problem — a LinkedIn feed mockup with a small blurry link
 *     card; sidebar claims "Blurry previews cost you readers."
 *  2. (115-235) Solution — the SAME mockup morphs crisp (blur interpolates to
 *     0, media block grows) as one Edge Function runs; sidebar updates.
 *  3. (225-345) How — the mockup slides fully off-stage while a 4-step
 *     Assets API handshake slides in from the right (a real slide, not a
 *     crossfade); one small tech-credibility line.
 *  4. (345-450) Result — the step list is killed, then a big +200% stat and
 *     a "duplicate posts eliminated" line land in the same stage slot.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, BrowserWindow, StatPill, CheckBadge, seg, loopFade, fontFamily } from "./bright-primitives";

const P = MOODS.violet;

const SIDEBAR_W = 320;
const STAGE_X = 390;
const STAGE_W = 760;

const HEADLINES: { text: string; color: string; inAt: number; outAt: number }[] = [
  { text: "Blurry previews cost you readers.", color: P.danger, inAt: 20, outAt: 134 },
  { text: "One Edge Function runs the whole handshake.", color: P.accent, inAt: 134, outAt: 249 },
  { text: "Register → URL → stream → URN.", color: P.accent, inAt: 249, outAt: 359 },
  { text: "+200% impressions. Zero duplicate posts.", color: P.success, inAt: 359, outAt: 9999 },
];

const STEPS = [
  { n: 1, title: "Register asset", sub: "POST /assets?action=registerUpload" },
  { n: 2, title: "Get upload URL", sub: "LinkedIn returns a signed URL" },
  { n: 3, title: "Stream image", sub: "binary uploaded directly" },
  { n: 4, title: "Create UGC post", sub: "asset URN attached, posts → 'posted'" },
];

export const FeatureLinkedinNativeUpload: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Sidebar: which beat, progress dots ─────────────────────────────
  const beatIdx = frame < 134 ? 0 : frame < 249 ? 1 : frame < 359 ? 2 : 3;

  // ── Beat 1→2: the mockup morphs (blur → crisp), no swap needed ─────
  const blurPx = interpolate(frame, [150, 190], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const mediaH = interpolate(frame, [150, 190], [92, 240], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const linkChromeOp = 1 - seg(frame, 150, 188);
  const dupBadgeOp = seg(frame, 160, 176);

  // Stage stat line under mockup (beat 1 / beat 2), kill-then-show
  const stat1Op = seg(frame, 38, 54) * (1 - seg(frame, 150, 166));
  const stat2Op = seg(frame, 166, 182);

  // ── Beat 2→3: a real slide, mockup off-stage left, steps in from right ─
  const mockupX = interpolate(frame, [225, 258], [0, -1500], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const mockupOp = 1 - seg(frame, 225, 258);
  const stepsX = interpolate(frame, [225, 258], [1500, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const stepsOp = seg(frame, 225, 245);

  const stepPop = (i: number) => Math.min(1, pop(268 + i * 20));
  const fallbackOp = seg(frame, 346, 360);
  const techCapOp = seg(frame, 300, 316);

  // ── Beat 3→4: kill steps fully, then land the result in the same slot ──
  const stepsOutOp = 1 - seg(frame, 360, 378);
  const resultOp = seg(frame, 378, 396, Easing.out(Easing.cubic));
  const resultPop = pop(390);
  const checkScale = pop(412);
  const footerOp = seg(frame, 420, 436);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily, opacity: lf }}>
        <LightBg />

        {/* ════ SIDEBAR — the one recurring element ════ */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SIDEBAR_W,
            height: 720,
            background: `linear-gradient(180deg, ${P.accentBg} 0%, ${P.card} 78%)`,
            borderRight: `2px solid ${P.border}`,
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 46, fontSize: 14, fontWeight: 700, letterSpacing: 2.4, color: P.muted }}>
            LINKEDIN NATIVE UPLOAD
          </div>

          <div style={{ position: "absolute", left: 32, top: 90, display: "flex", gap: 8 }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 5,
                  borderRadius: 3,
                  background: i <= beatIdx ? P.accent : P.border,
                }}
              />
            ))}
          </div>

          <div style={{ position: "absolute", left: 32, top: 250, width: 256 }}>
            {HEADLINES.map((h) => (
              <div
                key={h.text}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 256,
                  fontSize: 27,
                  fontWeight: 800,
                  lineHeight: 1.28,
                  color: h.color,
                  opacity:
                    seg(frame, h.inAt, h.inAt + 16) *
                    (h.outAt >= 450 ? 1 : 1 - seg(frame, h.outAt, h.outAt + 14)),
                  fontFamily,
                }}
              >
                {h.text}
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", left: 32, top: 650, display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: P.accent,
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              in
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>LinkedIn Publishing</div>
          </div>
        </div>

        {/* ════ STAGE — mockup (beats 1-2), slides off for beat 3 ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: 118, width: STAGE_W, opacity: mockupOp, transform: `translateX(${mockupX}px)` }}>
          <BrowserWindow x={0} y={0} w={STAGE_W} h={410} title="LinkedIn feed" opacity={Math.min(1, pop(6))}>
            <div style={{ padding: "20px 24px", fontFamily }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: P.accent,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    fontWeight: 800,
                  }}
                >
                  VB
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: P.ink }}>Vitalii Berbeha</div>
                  <div style={{ fontSize: 13, color: P.muted, fontWeight: 500 }}>Full-stack developer &middot; 2nd</div>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: P.successBg,
                    border: `1.5px solid ${P.successEdge}`,
                    color: P.success,
                    fontSize: 13,
                    fontWeight: 700,
                    opacity: dupBadgeOp,
                  }}
                >
                  duplicate check: passed
                </div>
              </div>
              <div style={{ marginTop: 14, fontSize: 16, color: P.ink, fontWeight: 500, lineHeight: 1.35 }}>
                Just shipped a new feature on vitalii.no &mdash; check it out
              </div>
              <div
                style={{
                  marginTop: 16,
                  width: "100%",
                  height: mediaH,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: `1px solid ${P.border}`,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: linkChromeOp > 0.05 ? 100 : "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${P.accent} 0%, #8A6BEE 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: `blur(${blurPx}px)`,
                  }}
                >
                  <svg width="66" height="50" viewBox="0 0 66 50" fill="none">
                    <rect x="1.5" y="1.5" width="63" height="47" rx="6" stroke="#FFFFFF" strokeWidth="3" opacity="0.9" />
                    <circle cx="20" cy="17" r="6" fill="#FFFFFF" opacity="0.9" />
                    <path d="M9 43 L26 24 L38 36 L47 28 L58 43 Z" fill="#FFFFFF" opacity="0.9" />
                  </svg>
                </div>
                <div
                  style={{
                    flex: linkChromeOp > 0.05 ? 1 : 0,
                    background: "#F4F2FC",
                    display: linkChromeOp > 0.05 ? "flex" : "none",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 14px",
                    opacity: linkChromeOp,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: P.ink }}>vitalii.no</div>
                  <div style={{ fontSize: 11.5, color: P.muted }}>Link preview</div>
                </div>
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 24, fontSize: 13, color: P.muted, fontWeight: 600 }}>
                <span>{"👍"} Like</span>
                <span>{"💬"} Comment</span>
                <span>{"↗️"} Share</span>
              </div>
            </div>
          </BrowserWindow>
        </div>
        <StatPill x={STAGE_X + 110} y={550} emoji="📉" text="2-3x fewer impressions with a link card" tone="danger" opacity={stat1Op} />
        <StatPill x={STAGE_X + 110} y={550} emoji="📈" text="Native image, streamed automatically" tone="success" opacity={stat2Op} />

        {/* ════ STAGE — Assets API handshake (beat 3), slides in from the right ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: 130, width: STAGE_W, opacity: stepsOp * stepsOutOp, transform: `translateX(${stepsX}px)` }}>
          {STEPS.map((s, i) => {
            const t = stepPop(i);
            return (
              <div
                key={s.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginBottom: 22,
                  opacity: t,
                  transform: `translateX(${(1 - t) * -30}px)`,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: P.accentBg,
                    border: `2px solid ${P.accentEdge}`,
                    color: P.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 19,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {s.n}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 21, fontWeight: 700, color: P.ink }}>{s.title}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: P.muted, marginTop: 2 }}>{s.sub}</div>
                </div>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: P.successBg,
                    border: `1.5px solid ${P.successEdge}`,
                    color: P.success,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    opacity: t,
                  }}
                >
                  {"✓"}
                </div>
              </div>
            );
          })}
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, opacity: fallbackOp }}>
            {"🛟"} If the image upload fails, it falls back to an ARTICLE link post
          </div>
        </div>
        <div style={{ position: "absolute", left: 90, top: 566, width: 1100, textAlign: "center", fontSize: 16, fontWeight: 600, color: P.muted, opacity: techCapOp * stepsOutOp, fontFamily }}>
          via LinkedIn's Assets API &mdash; register, upload, stream, publish
        </div>

        {/* ════ STAGE — the payoff (beat 4), same slot as the steps ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: 190, width: STAGE_W, textAlign: "center", opacity: resultOp }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: P.success,
              letterSpacing: -2,
              transform: `scale(${0.9 + Math.min(1, resultPop) * 0.1})`,
              opacity: Math.min(1, resultPop),
              fontFamily,
            }}
          >
            +200%
          </div>
          <div style={{ fontSize: 21, fontWeight: 650, color: P.muted, marginTop: 4, opacity: Math.min(1, resultPop) }}>
            average impressions with native image uploads
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 34 }}>
            <div style={{ position: "relative", width: 40, height: 40 }}>
              <CheckBadge x={0} y={0} size={40} scale={checkScale} opacity={Math.min(1, checkScale)} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: P.ink, opacity: Math.min(1, checkScale) }}>
              Duplicate posts &mdash; completely eliminated
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, top: 692, width: 1280, textAlign: "center", fontSize: 14, fontWeight: 600, color: P.accent, opacity: footerOp, fontFamily }}>
          post-to-linkedin &middot; Supabase Edge Function (Deno) &middot; vitalii.no
        </div>
      </div>
    </PaletteProvider>
  );
};
