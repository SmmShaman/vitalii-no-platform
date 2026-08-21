/**
 * FeatureContentRewrite — feature p02 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser mockup showing one
 * article turned into three native-sounding versions, and a big before→after
 * metric.
 *
 * Story (4 beats):
 *  1. Problem — one new article, three audiences to reach (Norwegians,
 *     Ukrainian diaspora, international tech readers); a plain-language need
 *     on a sticky note; hours of manual translation, every single article.
 *     Red zone.
 *  2. Solution — three language tabs (EN/NO/UA) picked one by one; each
 *     reveals a natural, differently-toned headline for the same story —
 *     not a robotic translation.
 *  3. How it works — article is published → a template per language is
 *     pulled → three AI rewrites run at once. One small tech-credibility
 *     line (Azure OpenAI + Supabase Edge Functions).
 *  4. Result — before/after cards: 1 language, by hand → 3 languages, one
 *     publish, ≈3× more content. Green zone, check badge.
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
  Cursor,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

type LangCard = {
  code: string;
  headline: string;
  tag: string;
};

const CARDS: LangCard[] = [
  { code: "EN", headline: "Norway's Largest Offshore Wind Farm Breaks Ground", tag: "SEO-friendly, conversational" },
  { code: "NO", headline: "Norges største havvindprosjekt er i gang", tag: "formal Bokmål" },
  { code: "UA", headline: "Найбільший офшорний вітропарк Норвегії розпочав будівництво", tag: "native, warm tone" },
];

/** One rewritten-article preview card inside the browser mockup. */
const LangPreview: React.FC<{ x: number; w: number; card: LangCard; opacity: number }> = ({ x, w, card, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 22,
        width: w,
        opacity,
        transform: `translateY(${(1 - opacity) * 18}px)`,
        fontFamily,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "3px 12px",
          borderRadius: 999,
          background: B.accentBg,
          border: `1px solid #C4D7FB`,
          color: B.accent,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        {card.code}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: B.ink, marginTop: 14, lineHeight: 1.35 }}>{card.headline}</div>
      <div style={{ fontSize: 14.5, fontWeight: 600, color: B.success, marginTop: 12 }}>{card.tag}</div>
    </div>
  );
};

export const FeatureContentRewrite: React.FC = () => {
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
  const scroll = frame * 1.6;
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const chip1 = pop(132);
  const chip2 = pop(146);
  const chip3 = pop(160);
  const cx = interpolate(frame, [126, 138, 152, 166, 186], [700, 235, 480, 730, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [126, 138, 152, 166, 186], [400, 152, 152, 152, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 126, 134) * (1 - seg(frame, 186, 200));
  const click1 = seg(frame, 138, 150, Easing.out(Easing.quad));
  const click2 = seg(frame, 152, 164, Easing.out(Easing.quad));
  const click3 = seg(frame, 166, 178, Easing.out(Easing.quad));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));
  const preview1 = seg(frame, 140, 156, Easing.out(Easing.cubic));
  const preview2 = seg(frame, 154, 170, Easing.out(Easing.cubic));
  const preview3 = seg(frame, 168, 184, Easing.out(Easing.cubic));

  // ── Beat 3: how it works ──────────────────────────────────────────
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
  const speedX = Math.round(interpolate(frame, [384, 414], [1, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="One new article," accentText="three audiences?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="draft — one language only" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: this read naturally in Norwegian, Ukrainian, and English — not a robotic translation"
        />
        <StatPill x={846} y={340} emoji="📰" text="5-10 new articles every day" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="⏱️" text="hours to translate, by hand" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😫" text="3 versions needed, every time" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Local Norwegians, the Ukrainian diaspora, and international tech readers — one story, three audiences" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="AI rewrites it in" accentText="3 languages at once" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={220} y={132} text="EN" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={340} y={132} text="NO" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={460} y={132} text="UA" scale={chip3} opacity={Math.min(1, chip3)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="process-news — 3 rewrites, one article" opacity={seg(frame, 122, 136)}>
          <LangPreview x={24} w={320} card={CARDS[0]} opacity={preview1} />
          <LangPreview x={370} w={320} card={CARDS[1]} opacity={preview2} />
          <LangPreview x={716} w={320} card={CARDS[2]} opacity={preview3} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 300,
              width: 1060,
              textAlign: "center",
              fontSize: 15.5,
              fontWeight: 600,
              color: B.muted,
              opacity: seg(frame, 210, 224) * 0.9,
            }}
          >
            …each one gets its own tone, and its own web address
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="Same story, three natural voices — formal for Norway, warm for Ukraine, punchy for tech readers" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="How it happens" opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="📰" title="Article gets published" sub="a webhook fires instantly" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🗂️" title="Right template per language" sub="editable, no code deploy" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🤖" title="3 rewrites, at the same time" sub="not a queue — all at once" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: a Supabase Edge Function fires 3 concurrent Azure OpenAI calls, one per language"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>1 language</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>translated by hand</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>3 languages</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>one publish, done automatically</div>
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
            opacity: speedOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{speedX}× more content</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Native Ukrainian tone, formal Norwegian, SEO English — not a generic translation.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Content Rewrite · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
