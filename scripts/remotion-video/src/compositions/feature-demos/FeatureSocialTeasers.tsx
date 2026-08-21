/**
 * FeatureSocialTeasers — feature p04 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+table mockup with
 * real-looking teaser text, platform chips clicked by a cursor, and a big
 * before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — one article needs 9 different social posts (3 platforms x 3
 *     languages), each with its own tone; a plain-language task on a sticky
 *     note; 20-30 minutes of copywriting, repeated for every article. Red zone.
 *  2. Solution — platform chips + "auto-generate on publish" toggle; a table
 *     instantly fills in with real-looking teaser previews for all 9
 *     platform/language combinations, generated from one article.
 *  3. How it works — one prompt per platform (editable, no redeploy), one
 *     Azure OpenAI call writes all 9, the result is cached instantly. One
 *     small tech-credibility line (Supabase Edge Function, Deno).
 *  4. Result — before/after cards: 20-30 min by hand → 1 click, plus the
 *     measured +20-30% LinkedIn engagement lift. Green zone, check badge.
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
  ToggleSwitch,
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

type TeaserRow = { platform: string; en: string; no: string; ua: string };

const TEASERS: TeaserRow[] = [
  { platform: "LinkedIn", en: "We cut video production from 45 min to 3. Here's how →", no: "Vi kuttet videoproduksjon fra 45 til 3 min. Slik →", ua: "Скоротили виробництво відео з 45 до 3 хв →" },
  { platform: "Instagram", en: "45 min → 3 min. Watch the magic ✨", no: "45 min → 3 min. Se magien ✨", ua: "45 хв → 3 хв. Дивіться магію ✨" },
  { platform: "Facebook", en: "Curious how we automated video? Read the story →", no: "Nysgjerrig på hvordan? Les historien →", ua: "Цікаво як? Читайте історію →" },
];

/** Compact real-data table: platform rows, one teaser preview per language column. */
const TeaserGrid: React.FC<{ w: number; rows: TeaserRow[]; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  rows,
  frame,
  appearStart,
  stagger = 9,
}) => {
  const cols = [0.16, 0.28, 0.28, 0.28];
  const heads = ["Platform", "English", "Norwegian", "Ukrainian"];
  const cell = (f: number): React.CSSProperties => ({
    width: w * f - 14,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, fontFamily }}>
      <div
        style={{
          display: "flex",
          padding: "10px 18px",
          gap: 14,
          background: "#F4F7FC",
          borderBottom: `1.5px solid ${B.border}`,
          fontSize: 14,
          fontWeight: 700,
          color: B.muted,
          letterSpacing: 0.4,
        }}
      >
        {heads.map((hd, i) => (
          <div key={hd} style={cell(cols[i])}>
            {hd}
          </div>
        ))}
      </div>
      {rows.map((r, i) => {
        const t = seg(frame, appearStart + i * stagger, appearStart + i * stagger + 12);
        return (
          <div
            key={r.platform}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 18px",
              gap: 14,
              borderBottom: `1px solid ${B.border}`,
              fontSize: 15,
              color: B.ink,
              opacity: t,
              transform: `translateX(${(1 - t) * 26}px)`,
            }}
          >
            <div style={{ ...cell(cols[0]), fontWeight: 700 }}>{r.platform}</div>
            <div style={{ ...cell(cols[1]), fontWeight: 500 }}>{r.en}</div>
            <div style={{ ...cell(cols[2]), color: B.muted, fontWeight: 500 }}>{r.no}</div>
            <div style={{ ...cell(cols[3]), color: B.muted, fontWeight: 500 }}>{r.ua}</div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureSocialTeasers: React.FC = () => {
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
  const chip1 = pop(132);
  const chip2 = pop(142);
  const chip3 = pop(152);
  const chip4 = pop(164);
  const togOn = seg(frame, 180, 192, Easing.inOut(Easing.cubic));
  const cx = interpolate(frame, [124, 134, 152, 166, 182, 205], [700, 235, 480, 660, 1020, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 134, 152, 166, 182, 205], [400, 152, 152, 152, 155, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 205, 218));
  const click1 = seg(frame, 134, 146, Easing.out(Easing.quad));
  const click2 = seg(frame, 152, 164, Easing.out(Easing.quad));
  const click3 = seg(frame, 182, 194, Easing.out(Easing.quad));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

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
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="One article needs" accentText="9 different posts?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="new-article.html — ready to publish" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: LinkedIn, Instagram and Facebook posts — in English, Norwegian and Ukrainian. Nine texts."
        />
        <StatPill x={846} y={340} emoji="✍️" text="9 texts to write" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="⏱️" text="20-30 minutes per article" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="📉" text="5-10 articles a day = all afternoon" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Same story, nine times over — a different tone for every platform and language" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Generate all 9 in" accentText="one click" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={140} y={132} text="LinkedIn" icon="✓" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={340} y={132} text="Instagram" icon="✓" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={540} y={132} text="Facebook" icon="✓" scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={720} y={132} text="3 languages" icon="🌐" scale={chip4} opacity={Math.min(1, chip4)} />
        <ToggleSwitch x={920} y={138} label="Auto-generate on publish" on={togOn} opacity={seg(frame, 172, 184)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="generate-social-teasers — new-article.html" opacity={seg(frame, 168, 182)}>
          <TeaserGrid w={1060} rows={TEASERS} frame={frame} appearStart={184} stagger={9} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 288,
              width: 1060,
              textAlign: "center",
              fontSize: 15.5,
              fontWeight: 600,
              color: B.muted,
              opacity: seg(frame, 214, 228) * 0.9,
            }}
          >
            Cached instantly — every later page view is served free
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="One AI call fills in all 9 — one prompt per platform, stored in ai_prompts" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="Built to run" accentText="on autopilot" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="📝" title="One prompt per platform" sub="stored in ai_prompts, no redeploy" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🤖" title="One Azure OpenAI call" sub="writes all 9 at once" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="💾" title="Cached the first time" sub="free on every later view" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: one Supabase Edge Function (generate-social-teasers) written in Deno"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>20-30 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>9 texts, by hand, every article</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>1 click</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>9 texts, every language, instantly</div>
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
          <span style={{ fontSize: 44, fontWeight: 800, color: B.success }}>+20-30% LinkedIn engagement</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Every article gets a native voice on every platform, in every language.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>AI Social Teasers · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
