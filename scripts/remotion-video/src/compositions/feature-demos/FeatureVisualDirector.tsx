/**
 * FeatureVisualDirector — feature p09 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser mockup with plausible
 * phrase-to-effect matches, an 8-effect strip, and a big before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — every auto-generated video looked identical, whatever the
 *     topic — same background, same predictable text animation. Red zone.
 *  2. Solution — one script, 8 possible looks: each phrase is matched to its
 *     own visual effect automatically, shown as a real "script analysis"
 *     mockup with plausible headlines (offshore wind, an AI chip startup,
 *     the Arctic) each tagged with the effect picked for it.
 *  3. How it stays sharp — finds matching photos, pulls real images in, so
 *     every frame fits the story instead of a static background. One small
 *     tech-credibility line (Azure OpenAI).
 *  4. Result — before/after cards: 1 look → 8 looks, matched per phrase;
 *     +20-30% viewer engagement. Green zone, check badge.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  BrowserWindow,
  SkeletonScroll,
  FilterChip,
  StatPill,
  IconCard,
  FlowArrow,
  StickyNote,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

type EffectDef = { key: string; emoji: string };
const EFFECTS: EffectDef[] = [
  { key: "blur-text", emoji: "🌫️" },
  { key: "particles", emoji: "✨" },
  { key: "glitch", emoji: "⚡" },
  { key: "globe", emoji: "🌍" },
  { key: "data-dashboard", emoji: "📊" },
  { key: "perlin-waves", emoji: "🌊" },
  { key: "photo-native", emoji: "🖼️" },
  { key: "infographic", emoji: "📈" },
];

type PhraseRow = { text: string; effectIdx: number };
const PHRASES: PhraseRow[] = [
  { text: "Norway doubles offshore wind capacity by 2030.", effectIdx: 4 }, // data-dashboard
  { text: "Silicon Valley's new AI chip startup raises $200M.", effectIdx: 2 }, // glitch
  { text: "Scientists map deep-sea currents near Svalbard.", effectIdx: 3 }, // globe
];

/** Active highlight window per phrase/effect pick, staggered 26 frames apart. */
const PICK_START = 156;
const PICK_STEP = 26;
const PICK_LEN = 40;

const pickWindow = (k: number): [number, number] => [PICK_START + k * PICK_STEP, PICK_START + k * PICK_STEP + PICK_LEN];

/** Script-analysis rows for the browser mockup: a real-looking headline
 * paired with the visual effect chosen for it. */
const PhraseList: React.FC<{ w: number; frame: number }> = ({ w, frame }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, fontFamily }}>
    {PHRASES.map((p, k) => {
      const [s, e] = pickWindow(k);
      const t = seg(frame, s, s + 14);
      const eff = EFFECTS[p.effectIdx];
      const active = frame >= s && frame < e;
      return (
        <div
          key={p.text}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 22px",
            borderBottom: k < PHRASES.length - 1 ? `1px solid ${B.border}` : "none",
            opacity: t,
            transform: `translateX(${(1 - t) * 26}px)`,
            background: active ? B.accentBg : "transparent",
          }}
        >
          <div style={{ flex: 1, fontSize: 17.5, fontWeight: 600, color: B.ink }}>{p.text}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 999,
              background: active ? B.successBg : B.chipBg,
              border: `1.5px solid ${active ? B.success : B.border}`,
              color: active ? B.success : B.muted,
              fontSize: 15,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 18 }}>{eff.emoji}</span>
            {eff.key}
          </div>
        </div>
      );
    })}
  </div>
);

export const FeatureVisualDirector: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows ──────────────────────────────────────────────────
  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: the problem ───────────────────────────────────────────
  const scroll = frame * 2.2;
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const chipScale = EFFECTS.map((_, i) => Math.min(1, pop(132 + i * 7)));
  const isChipActive = (i: number) => PHRASES.some((p, k) => {
    if (p.effectIdx !== i) return false;
    const [s, e] = pickWindow(k);
    return frame >= s && frame < e;
  });
  const cap2 = seg(frame, 200, 216, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays sharp ─────────────────────────────────────
  const card1 = pop(252);
  const card2 = pop(272);
  const card3 = pop(292);
  const arr1 = seg(frame, 262, 278, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 282, 298, Easing.inOut(Easing.cubic));
  const cap3 = seg(frame, 300, 316, Easing.out(Easing.cubic));

  // ── Beat 4: the result ────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const metricOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Every video looked" accentText="exactly the same?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="video library — 40 clips, same look" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: a visual style that actually matches the story — not the same background every time"
        />
        <StatPill x={846} y={340} emoji="🎨" text="Same background, every video" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="😴" text="Predictable text animations" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="📉" text="Visual monotony, killing engagement" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Nordic energy policy or Silicon Valley AI — every video looked identical" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="One script," accentText="8 possible looks" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        {EFFECTS.map((e, i) => (
          <FilterChip
            key={e.key}
            x={10 + i * 150}
            y={134}
            text={e.key}
            icon={e.emoji}
            scale={chipScale[i]}
            opacity={chipScale[i]}
            color={isChipActive(i) ? B.success : B.accent}
          />
        ))}
        <BrowserWindow x={110} y={210} w={1060} h={330} title="script analysis — 18 phrases" opacity={seg(frame, 150, 164)}>
          <PhraseList w={1060} frame={frame} />
        </BrowserWindow>
        <CaptionBand text="Each phrase gets its own visual match, picked automatically" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS SHARP ════ */}
      <Group opacity={b3}>
        <Headline text="Then real images" accentText="make it come alive" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🔎" title="Finds matching photos" sub="for wind farms, AI chips, the Arctic…" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🖼️" title="Pulls real images in" sub="not just static backgrounds" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🎥" title="Every frame fits the story" sub="a unique look, every single video" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: an Azure OpenAI prompt drives the phrase-by-phrase analysis"
          opacity={cap3}
          fontSize={21}
          y={580}
        />
      </Group>

      {/* ════ Beat 4 — RESULT ════ */}
      <Group opacity={b4}>
        <Headline text="The payoff" opacity={seg(frame, 344, 358)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>1 look</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>used in every video</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>8 looks</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>matched to every phrase</div>
          </div>
        </Panel>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 424,
            width: 1280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            opacity: metricOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>+20-30% engagement</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Every video now has its own visual identity.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Visual Director · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
