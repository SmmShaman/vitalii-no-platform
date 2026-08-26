/**
 * FeatureTrilingualUx — feature j29 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2) — rebuilt 2026-08-26 from the dark v1 clip.
 *
 * Story (4 beats):
 *  1. Problem — JobBot's users are Ukrainians in Norway: some think in Norwegian,
 *     some in English, many prefer Ukrainian. Pick one and you lose most of them.
 *     Worse, a choice that doesn't follow you to the next device feels broken.
 *  2. Solution — one switch. The interface, the AI's job analysis and the Telegram
 *     alerts all change language together, on every device you sign in from.
 *  3. How it works — ~200 phrases × 3 languages → the choice is stored on your
 *     account → everything that talks to you reads it. Tech line: LanguageContext
 *     + Supabase user_settings.
 *  4. Result — before: English only, re-picked on every login. Now: 1 switch,
 *     3 languages, everywhere. 600 translated phrases.
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

/** The three phrasings of the same screen line, one per language. */
const COPY = {
  no: { title: "Nye jobber for deg", sub: "5 treff · sortert etter poengsum", cta: "Søk nå", bell: "Varsel sendt på Telegram" },
  en: { title: "New jobs for you", sub: "5 matches · sorted by score", cta: "Apply now", bell: "Alert sent on Telegram" },
  ua: { title: "Нові вакансії для вас", sub: "5 збігів · за рейтингом", cta: "Подати заявку", bell: "Сповіщення в Telegram" },
} as const;

type Lang = keyof typeof COPY;

/** A person avatar card saying which language they think in. */
const PersonCard: React.FC<{
  x: number;
  y: number;
  emoji: string;
  name: string;
  line: string;
  tone?: "danger" | "accent" | "success";
  scale?: number;
  opacity?: number;
}> = ({ x, y, emoji, name, line, tone = "accent", scale = 1, opacity = 1 }) => {
  if (opacity <= 0.004) return null;
  const c = tone === "danger" ? B.danger : tone === "success" ? B.success : B.accent;
  const bg = tone === "danger" ? B.dangerBg : tone === "success" ? B.successBg : B.accentBg;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 300,
        padding: "20px 22px",
        borderRadius: 14,
        background: bg,
        border: `1.5px solid ${c}33`,
        transform: `scale(${0.88 + 0.12 * Math.min(1, scale)})`,
        transformOrigin: "center",
        opacity,
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 34 }}>{emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: B.ink, marginTop: 8 }}>{name}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: c, marginTop: 6, lineHeight: 1.35 }}>{line}</div>
    </div>
  );
};

export const FeatureTrilingualUx: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: three people, one interface ───────────────────────────
  const p1 = pop(14);
  const p2 = pop(28);
  const p3 = pop(42);
  const noteOp = seg(frame, 58, 74, Easing.out(Easing.cubic));

  // ── Beat 2: one switch changes everything ─────────────────────────
  // Which language the mockup is showing right now.
  const lang: Lang = frame < 168 ? "en" : frame < 200 ? "no" : "ua";
  const chipOn = (l: Lang) => (lang === l ? 1 : 0.35);
  const winIn = seg(frame, 128, 142, Easing.out(Easing.cubic));
  // a quick flash when the copy swaps, so the change is unmissable
  const swapFlash = Math.max(seg(frame, 168, 176) * (1 - seg(frame, 176, 186)), seg(frame, 200, 208) * (1 - seg(frame, 208, 218)));
  const cx = interpolate(frame, [130, 160, 172, 196, 216], [660, 452, 452, 604, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [130, 160, 172, 196, 216], [420, 160, 160, 160, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 130, 138) * (1 - seg(frame, 216, 226));
  const click1 = seg(frame, 162, 174, Easing.out(Easing.quad));
  const click2 = seg(frame, 194, 206, Easing.out(Easing.quad));
  const cap2 = seg(frame, 206, 220, Easing.out(Easing.cubic));

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
  const phrases = Math.round(
    interpolate(frame, [384, 414], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  );
  const phrasesOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  const c = COPY[lang];

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Same app, three people," accentText="three languages" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <PersonCard x={90} y={166} emoji="🧭" name="Ola" line="Reads Norwegian at work — bokmål or nothing" tone="accent" scale={p1} opacity={Math.min(1, p1)} />
        <PersonCard x={490} y={166} emoji="💻" name="Sam" line="Works in English, moved here last year" tone="accent" scale={p2} opacity={Math.min(1, p2)} />
        <PersonCard x={890} y={166} emoji="🌻" name="Oksana" line="Thinks in Ukrainian, job-hunting in Norway" tone="accent" scale={p3} opacity={Math.min(1, p3)} />
        <StickyNote
          x={330}
          y={392}
          w={620}
          opacity={noteOp}
          rotate={-1}
          text="Hardcode one language and you lose the other two. And if the choice doesn't follow you to your phone, the app feels broken every time you sign in."
        />
        <CaptionBand text="A job hunt is stressful enough without reading it in your third-best language" tone="danger" opacity={seg(frame, 78, 94)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="One switch —" accentText="everything follows" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={452} y={140} text="EN" scale={1} opacity={winIn * chipOn("en")} />
        <FilterChip x={556} y={140} text="NO" scale={1} opacity={winIn * chipOn("no")} />
        <FilterChip x={660} y={140} text="UA" scale={1} opacity={winIn * chipOn("ua")} />
        <BrowserWindow x={150} y={208} w={620} h={352} title="jobbot — dashboard" opacity={winIn}>
          <div style={{ padding: "24px 28px", fontFamily, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: -24,
                background: B.accent,
                opacity: swapFlash * 0.1,
                borderRadius: 12,
              }}
            />
            <div style={{ fontSize: 30, fontWeight: 800, color: B.ink }}>{c.title}</div>
            <div style={{ fontSize: 19, fontWeight: 600, color: B.muted, marginTop: 8 }}>{c.sub}</div>
            <div style={{ height: 1, background: B.border, margin: "20px 0" }} />
            <div style={{ fontSize: 20, fontWeight: 700, color: B.ink }}>Frontend Developer · TechCorp</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: B.muted, marginTop: 6 }}>Gjøvik · 92 / 100</div>
            <div
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "10px 22px",
                borderRadius: 10,
                background: B.accent,
                color: "#fff",
                fontSize: 19,
                fontWeight: 800,
              }}
            >
              {c.cta}
            </div>
          </div>
        </BrowserWindow>
        <Panel x={812} y={228} w={340} h={132} tone="accent" opacity={winIn}>
          <div style={{ padding: "20px 22px", fontFamily }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.accent, letterSpacing: 0.8 }}>TELEGRAM</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: B.ink, marginTop: 10, lineHeight: 1.3 }}>🔔 {c.bell}</div>
          </div>
        </Panel>
        <Panel x={812} y={384} w={340} h={176} tone="success" opacity={winIn}>
          <div style={{ padding: "20px 22px", fontFamily }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.success, letterSpacing: 0.8 }}>AI ANALYSIS</div>
            <div style={{ fontSize: 18, fontWeight: 650, color: B.ink, marginTop: 10, lineHeight: 1.35 }}>
              {lang === "no" ? "Fordeler og ulemper skrevet på norsk" : lang === "ua" ? "Плюси й мінуси — українською" : "Pros and cons written in English"}
            </div>
          </div>
        </Panel>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1)} />
        <CaptionBand text="Interface, AI verdict and Telegram alerts — all three switch together" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="Chosen once," accentText="remembered everywhere" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        {/* 🌐 not 🗣️ — the speaking-head glyph renders as the same grey bust as 👤
            in headless Chrome, and two identical icons side by side read as a bug. */}
        <IconCard x={110} y={218} w={300} emoji="🌐" title="~200 phrases, 3 languages" sub="Norwegian · English · Ukrainian" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="👤" title="Saved to your account" sub="not to this one browser" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="📱" title="Same on laptop and phone" sub="sign in anywhere, it follows" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: a React LanguageContext reading one field in Supabase user_settings — the AI Edge Function reads it too"
          opacity={cap3}
          fontSize={20}
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
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>re-picked every login</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>3 languages</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>one switch, everywhere</div>
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
            opacity: phrasesOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>{phrases} phrases translated</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Even the AI's verdict on a job comes back in the language you chose.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>JobBot · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
