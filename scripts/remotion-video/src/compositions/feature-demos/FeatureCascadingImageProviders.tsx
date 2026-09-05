/**
 * FeatureCascadingImageProviders — feature p24 — 1280x720, 954 frames @ 30fps.
 * VOICE-SYNCED clip (2026-09-05 rewrite) — narration beats and frame windows
 * are fixed by the committed voiceover measurement; do not shift them.
 *
 * Archetype 6 — "sidebar narrative": a fixed 320px-wide left column runs the
 * full height for the whole clip, holding a running stat that updates per
 * beat. The big right "stage" (≈960px) carries the primary per-beat visual.
 * Mood: violet.
 *
 * Beats:
 *  b1  15–254  Problem — one provider, a live attempts feed, ~1-in-4 broken.
 *  b2 263–470  Analogy — trusting one provider is a coin toss on every call.
 *  b3 479–659  Solution — an Edge Function races five providers at once.
 *  b4 668–815  Mechanism — automatic fallback chain, 40s timeout per hop.
 *  b5 824–954  Result — 98% success (counts up 75→98, then holds).
 *
 * Vendor names are intentionally never shown — providers are labelled
 * "Provider A".."Provider E"; the single allowed tech label is "Edge
 * Function", shown once, during beat 3.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, BrowserWindow, FlowArrow, CheckBadge, seg, fontFamily } from "./bright-primitives";

const P = MOODS.violet;

const SIDEBAR_W = 320;
const STAGE_L = 372;
const STAGE_W = 848; // 372 .. 1220

// Light-on-dark accents for the sidebar (P.* tones are tuned for light cards).
const SIDE_DANGER = "#FF8FA6";
const SIDE_ACCENT = "#C9BBFA";
const SIDE_AMBER = "#FFCB6B";
const SIDE_SUCCESS = "#7FE8B4";
const SIDE_MUTED = "rgba(255,255,255,0.56)";

type Attempt = { title: string; outcome: "success" | "fail"; reason: string };
const ATTEMPTS: Attempt[] = [
  { title: "Product launch cover", outcome: "success", reason: "Generated" },
  { title: "Funding round teaser", outcome: "fail", reason: "Blank frame" },
  { title: "Weekly market recap", outcome: "success", reason: "Generated" },
  { title: "Startup office feature", outcome: "success", reason: "Generated" },
];

const PROVIDERS5 = ["Provider A", "Provider B", "Provider C", "Provider D", "Provider E"];

/** Sidebar hero stat block — fixed column, content swaps per beat. */
const SideStat: React.FC<{ big: string; color: string; label: string; sub: string; opacity: number }> = ({
  big,
  color,
  label,
  sub,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 32, top: 210, width: SIDEBAR_W - 64, opacity }}>
      <div
        style={{
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1,
          color,
          letterSpacing: -2,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {big}
      </div>
      <div style={{ marginTop: 22, fontSize: 15.5, fontWeight: 800, letterSpacing: 1.6, color: "#FFFFFF", lineHeight: 1.35 }}>
        {label}
      </div>
      <div style={{ marginTop: 14, fontSize: 15.5, fontWeight: 500, color: SIDE_MUTED, lineHeight: 1.4 }}>{sub}</div>
    </div>
  );
};

export const FeatureCascadingImageProviders: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (voice-synced; fade-in 16f, fade-out 16f, b5 holds) ──
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 254, 270));
  const b2 = seg(frame, 263, 279) * (1 - seg(frame, 470, 486));
  const b3 = seg(frame, 479, 495) * (1 - seg(frame, 659, 675));
  const b4 = seg(frame, 668, 684) * (1 - seg(frame, 815, 831));
  const b5 = seg(frame, 824, 840); // no fade-out — stays full through 954

  // ── Beat 2: single-provider flicker (analogy) ─────────────────────
  const flickerOn = Math.floor(Math.max(0, frame - 263) / 20) % 2 === 0;
  const flickerIcon = flickerOn ? "✓" : "✕";
  const flickerColor = flickerOn ? SIDE_SUCCESS : SIDE_DANGER;

  // ── Beat 3: five-lane race ─────────────────────────────────────────
  const raceSlide = seg(frame, 479, 511, Easing.out(Easing.cubic)); // slide-up (non-crossfade transition)
  const laneFill = (i: number) => {
    // Provider C (idx 2) wins fastest; others keep climbing then get cut.
    const speed = [0.62, 0.78, 1.05, 0.7, 0.5][i];
    const raw = interpolate(frame, [500, 600], [0, 100 * speed], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return Math.min(100, raw);
  };
  const raceWon = frame >= 566;
  const techOp = seg(frame, 486, 502, Easing.out(Easing.cubic));

  // ── Beat 4: fallback chain ──────────────────────────────────────────
  const countdown = Math.max(0, Math.round(interpolate(frame, [668, 730], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const timeoutHit = frame >= 730;
  const cardB_check = seg(frame, 742, 754);
  const cardB_fail = frame >= 760;
  const arr1 = seg(frame, 726, 744, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 762, 780, Easing.inOut(Easing.cubic));
  const successPop = pop(782);

  // ── Beat 5: the payoff ───────────────────────────────────────────────
  const pctNow = Math.round(
    interpolate(frame, [824, 892], [75, 98], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  );
  const heroScale = pop(824);
  const check5 = pop(860);
  const chipOp = seg(frame, 834, 850);

  // ── Sidebar hero swap (mirrors beat windows exactly) ─────────────────
  const sideOp1 = b1;
  const sideOp2 = b2;
  const sideOp3 = b3;
  const sideOp4 = b4;
  const sideOp5 = b5;

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ FIXED SIDEBAR — never moves, content swaps per beat ════ */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SIDEBAR_W,
            height: 720,
            background: `linear-gradient(165deg, ${P.ink} 0%, #130F34 100%)`,
            boxShadow: "10px 0 34px rgba(10,7,30,0.35)",
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 46, fontSize: 15, fontWeight: 800, letterSpacing: 3.2, color: "rgba(255,255,255,0.5)" }}>
            IMAGE PIPELINE
          </div>
          <div style={{ position: "absolute", left: 32, top: 74, width: 236, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.16)" }} />

          <SideStat big="25%" color={SIDE_DANGER} label="OF IMAGES CAME BACK BROKEN" sub="Blank, malformed, or just wrong" opacity={sideOp1} />
          <SideStat big="1" color={SIDE_DANGER} label="PROVIDER, TAKE IT OR LEAVE IT" sub="No second opinion when it stalled" opacity={sideOp2} />
          <SideStat big="5" color={SIDE_ACCENT} label="PROVIDERS RACE AT ONCE" sub="Whichever finishes first wins" opacity={sideOp3} />
          <SideStat big="40s" color={SIDE_AMBER} label="MAX WAIT BEFORE FALLBACK" sub="Then the next one steps in" opacity={sideOp4} />
          <SideStat big={`${pctNow}%`} color={SIDE_SUCCESS} label="IMAGES SUCCEED NOW" sub="Zero manual retries" opacity={sideOp5} />

          <div style={{ position: "absolute", left: 32, top: 656, fontSize: 13.5, fontWeight: 700, letterSpacing: 1.4, color: "rgba(255,255,255,0.34)" }}>
            vitalii.no
          </div>
        </div>

        {/* ════ Beat 1 — the problem: one provider, a live feed ════ */}
        <Group opacity={b1}>
          <div style={{ position: "absolute", left: STAGE_L - 12, top: 46, width: STAGE_W + 24, textAlign: "center", fontSize: 29, fontWeight: 800, color: P.ink, opacity: seg(frame, 24, 42) }}>
            One provider meant playing the odds
          </div>
          <BrowserWindow x={STAGE_L} y={112} w={STAGE_W} h={444} title="image generator — single provider" opacity={Math.min(1, pop(24))}>
            {ATTEMPTS.map((a, i) => {
              const t = seg(frame, 40 + i * 28, 40 + i * 28 + 16);
              const fail = a.outcome === "fail";
              return (
                <div
                  key={a.title}
                  style={{
                    position: "absolute",
                    left: 24,
                    top: 18 + i * 100,
                    width: STAGE_W - 48,
                    height: 86,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "0 22px",
                    borderRadius: 14,
                    background: fail ? P.dangerBg : P.successBg,
                    border: `1.5px solid ${fail ? P.dangerEdge : P.successEdge}`,
                    opacity: t,
                    transform: `translateX(${(1 - t) * 28}px)`,
                  }}
                >
                  <div style={{ fontSize: 32 }}>{fail ? "🚫" : "🖼"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: P.ink }}>{a.title}</div>
                    <div style={{ fontSize: 14.5, fontWeight: 650, color: fail ? P.danger : P.success, marginTop: 4 }}>
                      {fail ? "✕ " : "✓ "}
                      {a.reason}
                    </div>
                  </div>
                </div>
              );
            })}
          </BrowserWindow>
          <div
            style={{
              position: "absolute",
              left: STAGE_L - 12,
              top: 578,
              width: STAGE_W + 24,
              textAlign: "center",
              fontSize: 21,
              fontWeight: 650,
              color: P.danger,
              opacity: seg(frame, 176, 196),
            }}
          >
            Every fourth image needed a manual redo
          </div>
        </Group>

        {/* ════ Beat 2 — analogy: single point of failure ════ */}
        <Group opacity={b2}>
          <div style={{ position: "absolute", left: STAGE_L - 12, top: 46, width: STAGE_W + 24, textAlign: "center", fontSize: 29, fontWeight: 800, color: P.ink, opacity: seg(frame, 272, 290) }}>
            One provider. Every request. No backup.
          </div>

          {[0, 1, 2, 3].map((i) => {
            const t = pop(300 + i * 14);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 396,
                  top: 140 + i * 92,
                  width: 176,
                  height: 56,
                  borderRadius: 12,
                  background: P.card,
                  border: `1.5px solid ${P.border}`,
                  boxShadow: "0 8px 18px rgba(27,23,64,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15.5,
                  fontWeight: 650,
                  color: P.muted,
                  opacity: Math.min(1, t),
                  transform: `scale(${t}) translateX(${(1 - Math.min(1, t)) * -20}px)`,
                }}
              >
                Image request
              </div>
            );
          })}
          <FlowArrow x={588} y={306} len={78} progress={seg(frame, 350, 368)} color={P.muted} />

          <div
            style={{
              position: "absolute",
              left: 690,
              top: 150,
              width: 300,
              height: 360,
              borderRadius: 32,
              background: P.card,
              border: `2.5px solid ${flickerColor}`,
              boxShadow: "0 16px 40px rgba(27,23,64,0.16)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity: Math.min(1, pop(296)),
              transform: `scale(${pop(296)})`,
            }}
          >
            <div style={{ fontSize: 74, fontWeight: 800, color: flickerColor, transition: "none" }}>{flickerIcon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: P.ink, letterSpacing: 0.5 }}>SINGLE PROVIDER</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: P.muted }}>outcome: unpredictable</div>
          </div>

          <FlowArrow x={1002} y={330} len={78} progress={seg(frame, 380, 398)} color={flickerColor} />
          <div
            style={{
              position: "absolute",
              left: 1090,
              top: 264,
              width: 128,
              height: 128,
              borderRadius: 18,
              background: flickerOn ? P.successBg : P.dangerBg,
              border: `1.5px solid ${flickerOn ? P.successEdge : P.dangerEdge}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 46,
              fontWeight: 800,
              color: flickerColor,
              opacity: Math.min(1, pop(410)),
            }}
          >
            {flickerIcon}
          </div>

          <div
            style={{
              position: "absolute",
              left: STAGE_L - 12,
              top: 578,
              width: STAGE_W + 24,
              textAlign: "center",
              fontSize: 21,
              fontWeight: 650,
              color: P.muted,
              opacity: seg(frame, 422, 440),
            }}
          >
            The result was a guess, every single time
          </div>
        </Group>

        {/* ════ Beat 3 — solution: Edge Function races five providers ════ */}
        <Group opacity={b3} dy={(1 - raceSlide) * 26}>
          <div
            style={{
              position: "absolute",
              left: STAGE_L - 12,
              top: 44,
              width: STAGE_W + 24,
              textAlign: "center",
              opacity: techOp,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "9px 22px",
                borderRadius: 999,
                background: P.accentBg,
                border: `1.5px solid ${P.accentEdge}`,
                fontSize: 18,
                fontWeight: 800,
                color: P.accent,
                letterSpacing: 0.6,
              }}
            >
              ⚡ EDGE FUNCTION — image race
            </span>
          </div>

          {PROVIDERS5.map((label, i) => {
            const fill = laneFill(i);
            const isWinner = i === 2;
            const cut = raceWon && !isWinner;
            const y = 132 + i * 78;
            const rowOp = Math.min(1, pop(479 + i * 6));
            return (
              <div key={label} style={{ position: "absolute", left: STAGE_L, top: y, width: STAGE_W, display: "flex", alignItems: "center", gap: 18, opacity: rowOp }}>
                <div style={{ width: 148, fontSize: 17.5, fontWeight: 700, color: P.ink }}>{label}</div>
                <div style={{ flex: 1, height: 22, borderRadius: 11, background: P.chipBg, border: `1.5px solid ${P.border}`, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${fill}%`,
                      height: "100%",
                      borderRadius: 11,
                      background: isWinner ? P.success : cut ? P.dangerEdge : P.accent,
                      opacity: cut ? 0.55 : 1,
                    }}
                  />
                </div>
                <div style={{ width: 44, textAlign: "center", fontSize: 24 }}>
                  {isWinner && raceWon ? "✓" : cut ? "✕" : ""}
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              left: STAGE_L - 12,
              top: 570,
              width: STAGE_W + 24,
              textAlign: "center",
              fontSize: 21,
              fontWeight: 650,
              color: P.success,
              opacity: seg(frame, 566, 584),
            }}
          >
            Whichever finishes first wins — instantly
          </div>
        </Group>

        {/* ════ Beat 4 — automatic fallback chain ════ */}
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: STAGE_L - 12, top: 46, width: STAGE_W + 24, textAlign: "center", fontSize: 29, fontWeight: 800, color: P.ink, opacity: seg(frame, 676, 694) }}>
            One stalls, the next steps in — automatically
          </div>

          {/* Provider A — timeout */}
          <div
            style={{
              position: "absolute",
              left: STAGE_L + 6,
              top: 190,
              width: 240,
              height: 340,
              borderRadius: 20,
              background: timeoutHit ? P.dangerBg : P.card,
              border: `2px solid ${timeoutHit ? P.dangerEdge : P.border}`,
              boxShadow: "0 12px 30px rgba(27,23,64,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity: Math.min(1, pop(668)),
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Provider A</div>
            {!timeoutHit ? (
              <>
                <div style={{ fontSize: 54, fontWeight: 800, color: P.amber, fontVariantNumeric: "tabular-nums" }}>{countdown}s</div>
                <div style={{ fontSize: 14.5, fontWeight: 650, color: P.muted }}>waiting for a response</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 54, fontWeight: 800, color: P.danger }}>✕</div>
                <div style={{ fontSize: 14.5, fontWeight: 650, color: P.danger }}>timed out at 40s</div>
              </>
            )}
          </div>

          <FlowArrow x={STAGE_L + 254} y={358} len={64} progress={arr1} color={P.danger} />

          {/* Provider B — fast fail */}
          <div
            style={{
              position: "absolute",
              left: STAGE_L + 300,
              top: 190,
              width: 240,
              height: 340,
              borderRadius: 20,
              background: cardB_fail ? P.dangerBg : P.card,
              border: `2px solid ${cardB_fail ? P.dangerEdge : P.border}`,
              boxShadow: "0 12px 30px rgba(27,23,64,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity: Math.min(1, cardB_check),
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Provider B</div>
            {!cardB_fail ? (
              <div style={{ fontSize: 15.5, fontWeight: 650, color: P.muted }}>checking response…</div>
            ) : (
              <>
                <div style={{ fontSize: 54, fontWeight: 800, color: P.danger }}>✕</div>
                <div style={{ fontSize: 14.5, fontWeight: 650, color: P.danger }}>unusable result</div>
              </>
            )}
          </div>

          <FlowArrow x={STAGE_L + 548} y={358} len={64} progress={arr2} color={P.success} />

          {/* Provider C — success */}
          <div
            style={{
              position: "absolute",
              left: STAGE_L + 594,
              top: 190,
              width: 240,
              height: 340,
              borderRadius: 20,
              background: successPop > 0.1 ? P.successBg : P.card,
              border: `2px solid ${successPop > 0.1 ? P.successEdge : P.border}`,
              boxShadow: "0 12px 30px rgba(27,23,64,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              opacity: Math.min(1, pop(680)),
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: P.ink }}>Provider C</div>
            <div style={{ transform: `scale(${Math.min(1, successPop)})` }}>
              <CheckBadge x={0} y={0} size={56} scale={1} opacity={Math.min(1, successPop)} />
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 650, color: P.success, opacity: Math.min(1, successPop) }}>image delivered</div>
          </div>

          <div
            style={{
              position: "absolute",
              left: STAGE_L - 12,
              top: 560,
              width: STAGE_W + 24,
              textAlign: "center",
              fontSize: 21,
              fontWeight: 650,
              color: P.muted,
              opacity: seg(frame, 792, 810),
            }}
          >
            No retry button. No one has to notice.
          </div>
        </Group>

        {/* ════ Beat 5 — the payoff ════ */}
        <Group opacity={b5}>
          <div style={{ position: "absolute", left: STAGE_L - 12, top: 96, width: STAGE_W + 24, textAlign: "center", opacity: chipOp }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 24px",
                borderRadius: 999,
                background: P.card,
                border: `1.5px solid ${P.border}`,
                boxShadow: "0 10px 26px rgba(27,23,64,0.12)",
                fontSize: 19,
                fontWeight: 700,
              }}
            >
              <span style={{ color: P.danger }}>75%</span>
              <span style={{ color: P.muted }}>→</span>
              <span style={{ color: P.success }}>98%</span>
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              left: STAGE_L - 12,
              top: 216,
              width: STAGE_W + 24,
              textAlign: "center",
              transform: `scale(${0.72 + Math.min(1, heroScale) * 0.28})`,
              transformOrigin: "center",
              opacity: Math.min(1, heroScale),
            }}
          >
            <div style={{ fontSize: 198, fontWeight: 800, lineHeight: 1, color: P.success, letterSpacing: -6, fontVariantNumeric: "tabular-nums" }}>
              {pctNow}%
            </div>
            <div style={{ marginTop: 10, fontSize: 24, fontWeight: 700, color: P.ink, letterSpacing: 0.5 }}>image success rate</div>
          </div>

          <div style={{ position: "absolute", left: STAGE_L - 12 + STAGE_W / 2 - 26, top: 552 }}>
            <CheckBadge x={0} y={0} size={52} scale={check5} opacity={Math.min(1, check5)} />
          </div>
          <div
            style={{
              position: "absolute",
              left: STAGE_L - 12,
              top: 618,
              width: STAGE_W + 24,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 650,
              color: P.muted,
              opacity: seg(frame, 872, 890),
            }}
          >
            Five providers, one Edge Function, zero manual retries
          </div>
        </Group>
      </div>
    </PaletteProvider>
  );
};
