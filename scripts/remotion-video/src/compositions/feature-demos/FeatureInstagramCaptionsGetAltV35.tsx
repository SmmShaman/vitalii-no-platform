/**
 * FeatureInstagramCaptionsGetAltV35 — feature v35 — 1280x720, 949 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 6 (sidebar narrative), mood slate. A fixed 320px left column
 * carries the running claim for all five beats; the stage on the right is
 * the only thing that changes. Beats 1-3 (missing alt text, inconsistent
 * caption order, the Graph API fix) have no verified recording of
 * Instagram's own interface, so they stay drawn — a post mockup, then a
 * three-step diagram. Beats 4-5 show the real proof instead: beat 4 plays
 * the actual commit history (shots/v35.json, shot "commits" — the code that
 * reads the article's own tags), beat 5 plays the feature's own published
 * write-up (shot "page") under the hero number. Beat 2 → 3 is a hard slide,
 * not a crossfade: the post mockup slides fully off-stage left while the
 * Graph API diagram slides in from the right.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–253  "Every photo we posted to Instagram was invisible to screen readers — and its hashtags were guesses, unrelated to the article."
 *  b2 262–427  "The caption order shifted post to post too — no fixed spot for the link or the source."
 *  b3 436–578  "Now the Instagram Graph API adds real alt text to every image."
 *  b4 587–758  "And the hashtags come straight from the article's own tags, in one fixed order every time."
 *  b5 767–904  "The formula lands eight to twelve hashtags — real ones, not guesses." — holds to 949.
 *
 * Single tech name in the whole clip: Instagram Graph API (beat 3 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, BrowserWindow, FilterChip, StatPill, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/v35.json";

const P = MOODS.slate;

const SIDEBAR_W = 320;
const STAGE_X = 390;
const STAGE_W = 760;
const STAGE_WIN: Win = { x: STAGE_X, y: 230, w: STAGE_W, h: 410 };

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const HEADLINES: { text: string; color: string; inAt: number; outAt: number }[] = [
  { text: "Invisible to screen readers. Guessed hashtags.", color: P.danger, inAt: 20, outAt: 262 },
  { text: "No fixed spot for the link or the source either.", color: P.danger, inAt: 262, outAt: 436 },
  { text: "The Instagram Graph API adds real alt text to every image.", color: P.accent, inAt: 436, outAt: 587 },
  { text: "Hashtags now come from the article's own tags.", color: P.accent, inAt: 587, outAt: 767 },
  { text: "8 to 12 real hashtags. Every image, every post.", color: P.success, inAt: 767, outAt: 9999 },
];

const STEPS = [
  { n: 1, title: "Describe the photo", sub: "an AI caption of what's in the image" },
  { n: 2, title: "Attach altText", sub: "sent when the image container is created" },
  { n: 3, title: "Instagram Graph API", sub: "alt text lands on every post" },
];

const ORDER_A = ["caption", "#hashtags", "🔗 link"];
const ORDER_B = ["🔗 link", "caption", "#hashtags"];

export const FeatureInstagramCaptionsGetAltV35: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 253, 269));
  const b2 = seg(frame, 262, 278) * (1 - seg(frame, 427, 443));
  const b3 = seg(frame, 436, 452) * (1 - seg(frame, 578, 594));
  const b4 = seg(frame, 587, 603) * (1 - seg(frame, 758, 774));
  const b5 = seg(frame, 767, 783); // holds through 949

  const beatIdx = frame < 262 ? 0 : frame < 436 ? 1 : frame < 587 ? 2 : frame < 767 ? 3 : 4;

  // ── beat 2 → 3: a real slide, mockup off-stage left, steps in from right ──
  const mockupOut = seg(frame, 420, 452);
  const mockupX = interpolate(frame, [420, 452], [0, -1400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const stepsIn = seg(frame, 436, 468) * (1 - seg(frame, 578, 594));
  const stepsX = interpolate(frame, [436, 468], [1400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const stepPop = (i: number) => Math.min(1, pop(452 + i * 22));
  const chipPop = pop(516);
  const techCapOp = seg(frame, 530, 546);

  // beat 4: hero label under the code proof
  const codeLabelOp = seg(frame, 640, 656);

  // beat 5: hero number pop + the write-up proof
  const heroPop5 = pop(767);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
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
            INSTAGRAM ALT TEXT &amp; HASHTAGS
          </div>

          <div style={{ position: "absolute", left: 32, top: 90, display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4].map((i) => (
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

          <div style={{ position: "absolute", left: 32, top: 240, width: 256 }}>
            {HEADLINES.map((h) => (
              <div
                key={h.text}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 256,
                  fontSize: 25,
                  fontWeight: 800,
                  lineHeight: 1.3,
                  color: h.color,
                  opacity: seg(frame, h.inAt, h.inAt + 16) * (h.outAt >= 949 ? 1 : 1 - seg(frame, h.outAt, h.outAt + 14)),
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
                borderRadius: 9,
                background: `linear-gradient(135deg, ${P.accent} 0%, #8A5CF6 100%)`,
                color: "#fff",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              📸
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>Instagram Publishing</div>
          </div>
        </div>

        {/* ════ STAGE — beat 1+2: one post mockup, reorders, then slides off ════ */}
        <div
          style={{
            position: "absolute",
            left: STAGE_X,
            top: 118,
            width: STAGE_W,
            opacity: 1 - mockupOut,
            transform: `translateX(${mockupX}px)`,
          }}
        >
          <BrowserWindow x={0} y={0} w={STAGE_W} h={410} title="Instagram — new post" opacity={Math.min(1, pop(6))}>
            <div style={{ padding: "22px 26px", fontFamily }}>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ position: "relative", width: 210, height: 210, flexShrink: 0 }}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 14,
                      background: `linear-gradient(135deg, ${P.accent} 0%, #8A5CF6 100%)`,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: -10,
                      top: -10,
                      padding: "5px 11px",
                      borderRadius: 999,
                      background: P.dangerBg,
                      border: `1.5px solid ${P.dangerEdge}`,
                      color: P.danger,
                      fontSize: 12.5,
                      fontWeight: 800,
                      opacity: b1 > 0.02 ? 1 : Math.max(b1, 0.6),
                    }}
                  >
                    alt text: none
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {(beatIdx === 1 ? ORDER_B : ORDER_A).map((row, i) => (
                    <div
                      key={row}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 14,
                        opacity: Math.min(1, pop(20 + i * 8)),
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: P.chipBg,
                          color: P.muted,
                          fontSize: 11,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div
                        style={{
                          height: 26,
                          flex: 1,
                          borderRadius: 8,
                          background: P.chipBg,
                          color: P.muted,
                          fontSize: 14,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 12,
                        }}
                      >
                        {row}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                {["#photo", "#nice", "#instagood", "#follow"].map((tag, i) => (
                  <div
                    key={tag}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: P.chipBg,
                      color: P.muted,
                      fontSize: 13,
                      fontWeight: 600,
                      opacity: Math.min(1, pop(60 + i * 6)),
                    }}
                  >
                    {tag}?
                  </div>
                ))}
              </div>
            </div>
          </BrowserWindow>
        </div>
        <StatPill x={STAGE_X + 110} y={550} emoji="🙈" text="no alt text, on any image" tone="danger" opacity={b1} />
        <StatPill x={STAGE_X + 110} y={550} emoji="🔀" text="link and source, in no fixed spot" tone="danger" opacity={b2} />

        {/* ════ STAGE — beat 3: Instagram Graph API, three steps, slides in from right ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: 150, width: STAGE_W, opacity: stepsIn, transform: `translateX(${stepsX}px)` }}>
          {STEPS.map((s, i) => {
            const t = stepPop(i);
            return (
              <div
                key={s.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginBottom: 26,
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
                  ✓
                </div>
              </div>
            );
          })}
          <FilterChip x={STAGE_X + STAGE_W - 236} y={100} text="Instagram Graph API" icon="⚙" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
        </div>
        <div style={{ position: "absolute", left: 90, top: 566, width: 1100, textAlign: "center", fontSize: 15.5, fontWeight: 600, color: P.muted, opacity: techCapOp * b3, fontFamily }}>
          altText sent on every image container — no photo goes out blank
        </div>

        {/* ════ STAGE — beat 4: the real code, straight from the commit history ════ */}
        <LiveWindow
          file={shots}
          shot="commits"
          title="github.com/SmmShaman/vitalii-no-platform — commits · main"
          from={587}
          hold={187}
          zoom={(t) => 1.05 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b4}
          win={STAGE_WIN}
        />
        <div style={{ position: "absolute", left: 90, top: 656, width: 1100, textAlign: "center", fontSize: 15.5, fontWeight: 600, color: P.accent, opacity: codeLabelOp * b4, fontFamily }}>
          assembleInstagramCaption &middot; generate-social-teasers — the article's own tags, not guesses
        </div>

        {/* ════ STAGE — beat 5: the formula's own published proof ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: 60, width: STAGE_W, opacity: b5, fontFamily }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, transform: `scale(${0.9 + Math.min(1, heroPop5) * 0.1})`, transformOrigin: "left center" }}>
            <div style={{ fontSize: 84, lineHeight: 1, fontWeight: 800, letterSpacing: -3, color: P.success }}>8&ndash;12</div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1.6, color: P.muted, maxWidth: 260 }}>REAL HASHTAGS, DRAWN FROM THE ARTICLE&apos;S OWN TAGS</div>
          </div>
          <div style={{ position: "absolute", right: 6, top: -6 }}>
            <CheckBadge x={0} y={0} size={38} opacity={b5} scale={Math.min(1, heroPop5)} />
          </div>
        </div>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features — instagram-captions-get-alt-text-…-v35"
          from={767}
          hold={182}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
          win={STAGE_WIN}
        />
      </div>
    </PaletteProvider>
  );
};
