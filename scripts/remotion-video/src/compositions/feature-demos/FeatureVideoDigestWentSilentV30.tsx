/**
 * FeatureVideoDigestWentSilentV30 — feature v30 — 1280x720, 929 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 1 "timeline ribbon", mood "slate" (both handed down
 * by the orchestrating session). A slim horizontal ribbon runs across the top
 * of the WHOLE clip — the one element that survives every beat. Five stops
 * land left→right, each one's "before" icon being the previous stop's
 * "after" icon, so the ribbon reads as a single relay: nightly voice → paid
 * balance hits zero → nobody can tell why it's silent → switch to a free
 * engine → speaking again. Beat 3's silent-day tally (1→4) pays off as the
 * literal number beat 5 closes on.
 *
 * Beats 1-4 are the pipeline/billing/plumbing story — invisible machinery,
 * not an interface — so they stay drawn per STEP 0c. Beat 5 is the shipped
 * result, so it plays a recording of the real feature page (shots/v30.json,
 * shot "page") the way FeatureTraceabilityScannerLive (p61) closes on its
 * own feature page.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-168  "Every night, a robot voice reads the day's tech news out
 *              loud, in Norwegian."
 *  b2 177-358  "That voice came from a paid service, and when its balance
 *              ran dry, every video broke at that step."
 *  b3 367-485  "Nobody could tell if the voice failed, or the bill was just
 *              unpaid."
 *  b4 494-647  "The fix switches to Edge TTS, a free voice engine, cutting
 *              the middleman out."
 *  b5 656-884  "It also times every word for the subtitles, instead of
 *              guessing from silence. The digest is unblocked after four
 *              days." — holds to 929.
 *
 * Single tech name in the whole clip: Edge TTS (beat 4 chip only). The
 * "4 renders silently failed" tally and the "4 days blocked -> 0 now" close
 * are the real shape of the outage described in the feature record — nothing
 * here is an invented metric.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, BrowserWindow, Panel, FilterChip, StatPill, CheckBadge, CaptionBand, fontFamily, seg } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/v30.json";

const P = MOODS.slate;

const B1_S = 15, B1_E = 168;
const B2_S = 177, B2_E = 358;
const B3_S = 367, B3_E = 485;
const B4_S = 494, B4_E = 647;
const B5_S = 656, B5_E = 884;
const END = 929;
const FADE = 9;

const RIBBON_Y = 100;

type Stop = { x: number; before: string; after: string; effectKey: string; headline: string; land: number };

const STOPS: Stop[] = [
  { x: 160, before: "🌙", after: "🎙", effectKey: "nightly digest", headline: "Every night, a robot voice reads the news.", land: B1_S + 15 },
  { x: 400, before: "🎙", after: "💸", effectKey: "balance: $0", headline: "The paid voice service's balance ran dry.", land: B2_S + 15 },
  { x: 640, before: "💸", after: "❓", effectKey: "silent failure", headline: "No way to tell: broken, or just unpaid?", land: B3_S + 15 },
  { x: 880, before: "❓", after: "🆓", effectKey: "Edge TTS · free", headline: "Switched to a free voice engine instead.", land: B4_S + 15 },
  { x: 1120, before: "🆓", after: "✅", effectKey: "live again", headline: "The nightly digest speaks again.", land: B5_S + 15 },
];

const WIN5: Win = { x: 230, y: 210, w: 820, h: 380 };

const BeatLabel: React.FC<{ kicker: string; title: string; detail: string; color: string; opacity: number; dy?: number }> = ({
  kicker, title, detail, color, opacity, dy = 0,
}) => (
  <div style={{ position: "absolute", left: 70, top: 548, width: 620, opacity, transform: `translateY(${dy}px)`, fontFamily }}>
    <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3, color: P.muted }}>{kicker}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color: P.ink, marginTop: 6, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontSize: 16, fontWeight: 600, color, marginTop: 8 }}>{detail}</div>
  </div>
);

export const FeatureVideoDigestWentSilentV30: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ---- transient beat visibility (fade in AND out, ~9-frame gaps between) ----
  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  // beat 3 -> beat 4 is a SLIDE, not a crossfade, confined to each beat's own window
  const b3ExitY = interpolate(frame, [B3_E - FADE, B3_E], [0, -60], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic),
  });
  const b4EnterY = interpolate(frame, [B4_S, B4_S + FADE], [60, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });

  // ---- the ribbon: alive for the whole clip, the one persistent element ----
  const ribbonOp = Math.min(1, pop(6));

  // beat 3: the silent-day tally, ticks 1 -> 4 (pays off in beat 5)
  const dayCountRaw = interpolate(frame, [B3_S + 20, B3_S + 100], [1, 4], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const dayCount = Math.round(dayCountRaw);
  const tallyOp = seg(frame, B3_S + 14, B3_S + 30);

  // beat 4: the one tech-credibility chip
  const chipPop = pop(B4_S + 30);

  // beat 2: balance ticking down to $0, and the pipeline step that fails
  const balance = Math.max(0, Math.round(interpolate(frame, [B2_S + 10, B2_S + 90], [18, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic),
  })));
  const failTagOp = seg(frame, B2_S + 96, B2_S + 112);

  // ---- beat 5: scale-push the real product in (the other non-crossfade transition) ----
  const pushScale = interpolate(frame, [B5_S, B5_S + 22], [0.92, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const statPop = pop(B5_S + 10);
  const checkPop = pop(B5_S + 130);
  const resultStripIn = seg(frame, B5_S + 60, B5_S + 76);
  const detailPillPop = pop(B5_S + 170);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ THE RIBBON — alive for the whole clip ════ */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 190, opacity: ribbonOp }}>
          <div style={{ position: "absolute", left: 90, top: RIBBON_Y, width: 1100, height: 4, borderRadius: 2, background: P.border }} />
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
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, opacity: 1 - t }}>
                    {s.before}
                  </span>
                  <span
                    style={{
                      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 30, opacity: t, transform: `scale(${0.6 + t * 0.4})`,
                    }}
                  >
                    {s.after}
                  </span>
                </div>
                <div style={{ position: "absolute", left: s.x - 150, top: RIBBON_Y + 46, width: 300, textAlign: "center", opacity: t, fontFamily }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: active ? P.ink : P.muted }}>{s.headline}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: P.accent, marginTop: 4 }}>→ {s.effectKey}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ════ Beat 1 — the nightly routine ════ */}
        <Group opacity={b1}>
          <BrowserWindow x={300} y={210} w={680} h={300} title="daily-video-bot · 01:00 CEST" opacity={Math.min(1, pop(24))}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <div style={{ fontSize: 40 }}>🎙</div>
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 40 }}>
                {Array.from({ length: 14 }).map((_, i) => {
                  const h = 8 + Math.abs(Math.sin((frame + i * 7) * 0.18)) * 32;
                  return <div key={i} style={{ width: 6, height: h, borderRadius: 3, background: P.accent }} />;
                })}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: P.muted }}>"Norway doubles offshore wind capacity…"</div>
            </div>
          </BrowserWindow>
          <BeatLabel
            kicker="DAILY VIDEO DIGEST"
            title="A robot voice reads the news, every night."
            detail="Norwegian narration, generated automatically."
            color={P.accent}
            opacity={1}
          />
        </Group>

        {/* ════ Beat 2 — the balance runs dry ════ */}
        <Group opacity={b2}>
          <Panel x={340} y={216} w={600} h={280} tone="card" opacity={1}>
            <div style={{ position: "absolute", left: 28, top: 22, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted }}>
              PAID TTS RESELLER · BALANCE
            </div>
            <div style={{ position: "absolute", left: 28, top: 48, fontSize: 64, fontWeight: 800, color: balance > 0 ? P.ink : P.danger, fontVariantNumeric: "tabular-nums" }}>
              ${balance}
            </div>
            <div style={{ position: "absolute", left: 28, top: 150, width: 544, display: "flex", alignItems: "center", gap: 10 }}>
              {["Scrape", "Script", "Voiceover", "Render", "Publish"].map((step) => (
                <div
                  key={step}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    background: step === "Voiceover" && failTagOp > 0.5 ? P.dangerBg : P.chipBg,
                    color: step === "Voiceover" && failTagOp > 0.5 ? P.danger : P.muted,
                    border: `1.5px solid ${step === "Voiceover" && failTagOp > 0.5 ? P.dangerEdge : P.border}`,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 28, top: 208, fontSize: 16, fontWeight: 800, color: P.danger, opacity: failTagOp }}>
              ✕ every render dies here
            </div>
          </Panel>
          <BeatLabel
            kicker="OUTAGE TRIGGER"
            title="The paid voice balance ran to zero."
            detail="Every render since has broken at the exact same step."
            color={P.danger}
            opacity={1}
          />
        </Group>

        {/* ════ Beat 3 — nobody can tell why ════ */}
        <Group opacity={b3} dy={b3ExitY}>
          <div style={{ position: "absolute", left: 340, top: 226, width: 600, display: "flex", justifyContent: "center", gap: 40 }}>
            <StatPill x={0} y={0} emoji="🎙" text="Voice engine broken?" tone="danger" opacity={1} />
            <StatPill x={0} y={70} emoji="💳" text="…or bill just unpaid?" tone="danger" opacity={1} />
          </div>
          <div style={{ position: "absolute", left: 490, top: 300, transform: "translateX(-50%)", fontSize: 20, fontWeight: 800, color: P.muted, letterSpacing: 2 }}>
            NO WAY TO TELL
          </div>
          <Panel x={790} y={222} w={150} h={110} tone="danger" opacity={tallyOp}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: P.danger, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{dayCount}</div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", marginTop: 4 }}>
                RENDERS
                <br />
                SILENTLY FAILED
              </div>
            </div>
          </Panel>
          <BeatLabel
            kicker="AMBIGUOUS FAILURE"
            title="Nothing upstream could tell the difference."
            detail="An empty balance looks just like a broken API."
            color={P.muted}
            opacity={1}
          />
        </Group>

        {/* ════ Beat 4 — the fix ════ */}
        <Group opacity={b4} dy={b4EnterY}>
          <div style={{ position: "absolute", left: 340, top: 236, width: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
            <div style={{ padding: "16px 20px", borderRadius: 14, background: P.dangerBg, border: `1.5px solid ${P.dangerEdge}`, textAlign: "center", textDecoration: "line-through", opacity: 0.75 }}>
              <div style={{ fontSize: 26 }}>💳</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.danger, marginTop: 4 }}>Paid reseller</div>
            </div>
            <div style={{ fontSize: 26, color: P.muted }}>→</div>
            <div style={{ padding: "16px 24px", borderRadius: 14, background: P.successBg, border: `1.5px solid ${P.successEdge}`, textAlign: "center" }}>
              <div style={{ fontSize: 26 }}>🆓</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.success, marginTop: 4 }}>Edge TTS · free</div>
            </div>
          </div>
          <FilterChip x={470} y={330} text="Edge TTS" icon="🆓" color={P.success} scale={Math.min(1, chipPop)} opacity={Math.min(1, chipPop)} />
          <BeatLabel
            kicker="THE FIX"
            title="Switch to a free voice engine."
            detail="Same two voices, direct from Microsoft — no middleman."
            color={P.success}
            opacity={1}
          />
        </Group>

        {/* per-beat caption band */}
        <CaptionBand text="A robot voice reads the news in Norwegian, every night" opacity={b1} tone="accent" />
        <CaptionBand text="Its paid voice balance ran dry — every render broke there" opacity={b2} tone="danger" />
        <CaptionBand text="No way to tell a broken API from an empty balance" opacity={b3} tone="card" />
        <CaptionBand text="Edge TTS speaks for free, no paid middleman" opacity={b4} tone="success" />

        {/* ════ Beat 5 : the real page, and the number ════ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN5.x + WIN5.w / 2}px ${WIN5.y + WIN5.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-v30"
            win={WIN5}
            from={B5_S}
            hold={END - B5_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b5}
          />
        </div>
        <Panel x={40} y={200} w={175} h={150} tone="success" opacity={b5 * Math.min(1, statPop)}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: P.muted, textDecoration: "line-through" }}>4 days</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>0</div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", lineHeight: 1.3 }}>
              DAYS BLOCKED
              <br />
              NOW
            </div>
          </div>
        </Panel>
        <StatPill x={40} y={366} emoji="⏱" text="Word-exact subtitle timing" tone="accent" opacity={b5 * Math.min(1, detailPillPop)} scale={Math.min(1, detailPillPop)} />
        <CheckBadge x={WIN5.x + WIN5.w - 42} y={WIN5.y - 22} size={40} opacity={b5} scale={checkPop} />
        <div
          style={{
            position: "absolute",
            left: WIN5.x + 24,
            top: WIN5.y + WIN5.h - 70,
            padding: "12px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.96)",
            border: `1.5px solid ${P.successEdge}`,
            boxShadow: "0 14px 34px rgba(22,35,63,0.16)",
            opacity: b5 * resultStripIn,
            transform: `translateY(${(1 - resultStripIn) * 14}px)`,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          Silent for 4 days — speaking again, for free
        </div>
        <CaptionBand text="Live on vitalii.no now" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
