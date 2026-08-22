/**
 * FeatureTelegramModeration — feature p18 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real "chat message" mockup that
 * edits itself in place, an icon strip for the smart shortcuts, and a big
 * before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — 50+ articles a day from 6 Telegram channels + RSS, each one
 *     needing 3 picks by hand: an image, a language, a platform. Red zone.
 *  2. Solution — one chat message that edits itself three times: photo →
 *     language → platform — a cursor taps through all three, same bubble.
 *  3. How it stays fast — action_prefix_${newsId} fits Telegram's 64-byte
 *     limit, the smartest photo is always picked automatically, video posts
 *     skip straight to publish.
 *  4. Result — before/after cards: hours per article → 8 seconds, 4 taps.
 *     Green zone, check badge.
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

export const FeatureTelegramModeration: React.FC = () => {
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

  // ── Beat 2: the solution — one bubble, edited 3 times ─────────────
  const bubbleOp = seg(frame, 120, 134, Easing.out(Easing.cubic));
  const stepImgOp = seg(frame, 132, 144) * (1 - seg(frame, 160, 172));
  const stepLangOp = seg(frame, 160, 172) * (1 - seg(frame, 188, 200));
  const stepPlatOp = seg(frame, 188, 200) * (1 - seg(frame, 214, 226));
  const cx = interpolate(frame, [124, 140, 168, 196, 214], [700, 230, 475, 710, 880], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 140, 168, 196, 214], [500, 364, 364, 364, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 214, 224));
  const click1 = seg(frame, 140, 152, Easing.out(Easing.quad));
  const click2 = seg(frame, 168, 180, Easing.out(Easing.quad));
  const click3 = seg(frame, 196, 208, Easing.out(Easing.quad));
  const cap2 = seg(frame, 204, 220, Easing.out(Easing.cubic)) * (1 - seg(frame, 228, 240));

  // ── Beat 3: how it stays fast ─────────────────────────────────────
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
  const check = pop(392);
  const resultOp = seg(frame, 388, 404, Easing.out(Easing.cubic));
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Moderate" accentText="50+ articles a day, by hand?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="Telegram — moderation queue (50+ waiting)" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Every article needs 3 picks: an image, a language (EN/NO/UA), and a platform — LinkedIn, Instagram, or Facebook"
        />
        <StatPill x={846} y={340} emoji="🖼️" text="Pick an image — every article" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="🌍" text="Pick a language — every article" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="📲" text="Pick a platform — every article" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="6 Telegram channels plus RSS, all needing the same 3 picks by hand" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="One message that" accentText="edits itself" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <Panel x={110} y={196} w={1060} h={280} tone="accent" opacity={bubbleOp}>
          <div style={{ position: "absolute", left: 30, top: 22, fontSize: 20, fontWeight: 700, color: B.ink, fontFamily }}>
            📰 TechCorp raises $10M — ready for review
          </div>
          <div style={{ position: "absolute", left: 30, top: 54, fontSize: 15, fontWeight: 600, color: B.muted, fontFamily }}>
            Same chat bubble, updated at every step
          </div>
          <div style={{ position: "absolute", left: 30, top: 108, fontSize: 16.5, fontWeight: 700, color: B.accent, opacity: stepImgOp, fontFamily }}>
            Step 1 of 3 — choose the photo
          </div>
          <div style={{ position: "absolute", left: 30, top: 108, fontSize: 16.5, fontWeight: 700, color: B.accent, opacity: stepLangOp, fontFamily }}>
            Step 2 of 3 — choose the language
          </div>
          <div style={{ position: "absolute", left: 30, top: 108, fontSize: 16.5, fontWeight: 700, color: B.accent, opacity: stepPlatOp, fontFamily }}>
            Step 3 of 3 — choose the platform
          </div>
          <FilterChip x={30} y={150} text="🖼️ Keep photo" icon="" opacity={stepImgOp} />
          <FilterChip x={280} y={150} text="✨ Generate new" icon="" opacity={stepImgOp} />
          <FilterChip x={30} y={150} text="🇬🇧 English" icon="" opacity={stepLangOp} />
          <FilterChip x={280} y={150} text="🇳🇴 Norwegian" icon="" opacity={stepLangOp} />
          <FilterChip x={530} y={150} text="🇺🇦 Ukrainian" icon="" opacity={stepLangOp} />
          <FilterChip x={30} y={150} text="LinkedIn" icon="" opacity={stepPlatOp} />
          <FilterChip x={280} y={150} text="Instagram" icon="" opacity={stepPlatOp} />
          <FilterChip x={530} y={150} text="Facebook" icon="" opacity={stepPlatOp} />
          <div style={{ position: "absolute", left: 30, top: 220, fontSize: 14.5, fontWeight: 600, color: B.muted, opacity: Math.max(stepImgOp, stepLangOp, stepPlatOp) * 0.85, fontFamily }}>
            No new message is sent — Telegram just edits this one
          </div>
        </Panel>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="Same message, edited three times — photo, then language, then platform" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS FAST ════ */}
      <Group opacity={b3}>
        <Headline text="Smart shortcuts" accentText="skip extra taps" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🔑" title="One tap, one code" sub="fits Telegram's 64-byte limit" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🖼️" title="Smartest photo wins" sub="AI photo, then original, then none" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🎥" title="Video posts skip ahead" sub="straight to publish, no extra step" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="A single telegram-webhook handler decides what to skip and what to ask"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>Hours</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>per article, 8+ chat messages</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>8 seconds</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>one message, 4 taps</div>
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
            opacity: resultOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 44, fontWeight: 800, color: B.success }}>4 taps — done, no scrolling</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            50+ articles a day, every one moderated the same simple way.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>telegram-webhook · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
