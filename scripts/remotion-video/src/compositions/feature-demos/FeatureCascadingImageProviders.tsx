/**
 * FeatureCascadingImageProviders — feature p24 — 1280x720, 954 frames @ 30fps.
 * VOICE-SYNCED clip (2026-09-05 rewrite) — narration beats and frame windows
 * are fixed by the committed voiceover measurement; do not shift them.
 * RE-SHOOT (2026-09-08): the picture only — beats 1, 3, 4, 5 now play real
 * recordings of vitalii.no and the vitalii-no-platform repo (shots/p24.json)
 * inside the stage; beat 2 stays drawn (it's an analogy, no real screen for
 * "a coin toss on every call").
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
import { LightBg, Group, FlowArrow, FilterChip, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/p24.json";

const P = MOODS.violet;

const SIDEBAR_W = 320;
const STAGE_L = 372;
const STAGE_W = 848; // 372 .. 1220

const WIN: Win = { x: STAGE_L, y: 112, w: STAGE_W, h: 444 };

// Light-on-dark accents for the sidebar (P.* tones are tuned for light cards).
const SIDE_DANGER = "#FF8FA6";
const SIDE_ACCENT = "#C9BBFA";
const SIDE_AMBER = "#FFCB6B";
const SIDE_SUCCESS = "#7FE8B4";
const SIDE_MUTED = "rgba(255,255,255,0.56)";

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

  // ── Beat 2: single-provider flicker (analogy, stays fully drawn) ────
  const flickerOn = Math.floor(Math.max(0, frame - 263) / 20) % 2 === 0;
  const flickerIcon = flickerOn ? "✓" : "✕";
  const flickerColor = flickerOn ? SIDE_SUCCESS : SIDE_DANGER;

  // ── Beat 3: real commit, slide-up (non-crossfade transition) ────────
  const raceSlide = seg(frame, 479, 511, Easing.out(Easing.cubic));
  const chipPop = pop(524);

  // ── Beat 4: fallback chain — three status chips over the real Actions run
  const chipA = pop(692);
  const chipB = pop(716);
  const chipC = pop(740);

  // ── Beat 5: the payoff ───────────────────────────────────────────────
  const pctNow = Math.round(
    interpolate(frame, [824, 892], [75, 98], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  );
  const badgePop = pop(860);
  const resultChip = seg(frame, 834, 850);

  // ── Sidebar hero swap (mirrors beat windows exactly) ─────────────────
  const sideOp1 = b1;
  const sideOp2 = b2;
  const sideOp3 = b3;
  const sideOp4 = b4;
  const sideOp5 = b5;

  const stageHeadline = (text: string, opacity: number) => (
    <div
      style={{
        position: "absolute",
        left: STAGE_L - 12,
        top: 46,
        width: STAGE_W + 24,
        textAlign: "center",
        fontSize: 29,
        fontWeight: 800,
        color: P.ink,
        opacity,
      }}
    >
      {text}
    </div>
  );

  const stageCaption = (text: string, color: string, opacity: number) => (
    <div
      style={{
        position: "absolute",
        left: STAGE_L - 12,
        top: 578,
        width: STAGE_W + 24,
        textAlign: "center",
        fontSize: 21,
        fontWeight: 650,
        color,
        opacity,
      }}
    >
      {text}
    </div>
  );

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

        {/* ════ Beat 1 — the problem: real hub, a quarter of images broken ════ */}
        <Group opacity={b1}>{stageHeadline("One provider meant playing the odds", seg(frame, 24, 42))}</Group>
        <LiveWindow
          file={shots}
          shot="hub"
          title="vitalii.no/features — 250 shipped"
          from={15}
          hold={255}
          zoom={(t) => 1 + 0.12 * t}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b1}
          win={WIN}
        />
        <Group opacity={b1}>{stageCaption("Every fourth image needed a manual redo", P.danger, seg(frame, 176, 196))}</Group>

        {/* ════ Beat 2 — analogy: single point of failure (stays fully drawn) ════ */}
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

        {/* ════ Beat 3 — solution: the real commit, Edge Function races five providers ════ */}
        <Group opacity={b3} dy={(1 - raceSlide) * 26}>
          {stageHeadline("So an Edge Function races five providers at once", 1)}
        </Group>
        <LiveWindow
          file={shots}
          shot="diff"
          title="github.com/SmmShaman/vitalii-no-platform — commit 5f2b6be"
          from={479}
          hold={200}
          zoom={(t) => 1.06 + 0.06 * t}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={b3}
          win={WIN}
        />
        <Group opacity={b3}>
          <FilterChip x={WIN.x + 20} y={WIN.y + WIN.h - 40} text="Edge Function · 5-provider race" icon="⚡" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          {stageCaption("Whichever finishes first wins — instantly", P.success, seg(frame, 566, 584))}
        </Group>

        {/* ════ Beat 4 — mechanism: the real run, automatic fallback chain ════ */}
        <Group opacity={b4}>{stageHeadline("One stalls, the next steps in — automatically", seg(frame, 676, 694))}</Group>
        <LiveWindow
          file={shots}
          shot="actions"
          title="github.com/SmmShaman/vitalii-no-platform — Actions"
          from={668}
          hold={170}
          zoom={(t) => 1 + 0.05 * t}
          focus={{ x: 0.3, y: 0.35 }}
          opacity={b4}
          win={WIN}
        />
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: WIN.x + 20, top: WIN.y + WIN.h - 40, display: "flex", gap: 10 }}>
            <FilterChip x={0} y={0} text="Provider A · timeout" icon="✕" color={P.danger} scale={chipA} opacity={Math.min(1, chipA)} />
            <FilterChip x={220} y={0} text="Provider B · rejected" icon="✕" color={P.danger} scale={chipB} opacity={Math.min(1, chipB)} />
            <FilterChip x={440} y={0} text="Provider C · delivered" icon="✓" color={P.success} scale={chipC} opacity={Math.min(1, chipC)} />
          </div>
          {stageCaption("No retry button. No one has to notice.", P.muted, seg(frame, 792, 810))}
        </Group>

        {/* ════ Beat 5 — the payoff: the real feature page ════ */}
        <Group opacity={b5}>
          {stageHeadline("Five providers, one Edge Function, zero manual retries", 1)}
          <CheckBadge x={WIN.x + WIN.w - 60} y={WIN.y - 20} size={40} opacity={b5} scale={badgePop} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-cascading-image-providers-p24"
          from={824}
          hold={135}
          zoom={(t) => 1 + 0.08 * t}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b5}
          win={WIN}
        />
        <Group opacity={b5}>
          <div style={{ position: "absolute", left: WIN.x + 20, top: WIN.y + WIN.h - 40, opacity: resultChip }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 20px",
                borderRadius: 999,
                background: P.card,
                border: `1.5px solid ${P.border}`,
                boxShadow: "0 10px 26px rgba(27,23,64,0.12)",
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              <span style={{ color: P.danger }}>75%</span>
              <span style={{ color: P.muted }}>→</span>
              <span style={{ color: P.success }}>{pctNow}%</span>
            </span>
          </div>
          {stageCaption("98% of images succeed now — zero manual retries", P.success, seg(frame, 872, 890))}
        </Group>
      </div>
    </PaletteProvider>
  );
};
