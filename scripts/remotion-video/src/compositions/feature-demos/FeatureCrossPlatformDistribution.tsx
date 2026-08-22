/**
 * FeatureCrossPlatformDistribution — feature p13 — 1280x720, 15s @ 30fps,
 * silent, loop-friendly. BRIGHT INFOGRAPHIC template (v2, 2026-08-22) —
 * written for a NON-TECHNICAL viewer: problem/solution color zones, a
 * platform-icon row, a size-limit comparison, and a before→after time metric.
 *
 * Story (4 beats):
 *  1. Problem — one video, four platforms (YouTube, Reels, LinkedIn,
 *     Facebook), each with its own format/size rules — 30-45 minutes of
 *     manual re-encoding and uploading, one at a time. Red zone.
 *  2. Solution — Remotion renders both formats once (vertical + horizontal),
 *     then four GitHub Actions workflows push straight to each platform's API.
 *  3. How it handles big files — the Bot API caps out at 20MB; MTKruto pulls
 *     the source video straight from Telegram up to 2GB, with a Telegram-embed
 *     fallback if any single upload fails.
 *  4. Result — before/after cards: 30-45 min → 2-3 min of monitoring, one
 *     trigger reaching all four platforms. Green zone, check badge.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B } from "./bright-theme";
import {
  LightBg,
  Group,
  Headline,
  Panel,
  IconCard,
  FlowArrow,
  StatPill,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const PLATFORMS = [
  { emoji: "📺", title: "YouTube", sub: "16:9 horizontal" },
  { emoji: "🔁", title: "Instagram Reels", sub: "9:16 vertical" },
  { emoji: "💼", title: "LinkedIn", sub: "MP4 under 200MB" },
  { emoji: "👍", title: "Facebook", sub: "its own upload flow" },
];

export const FeatureCrossPlatformDistribution: React.FC = () => {
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
  const platCards = [0, 1, 2, 3].map((i) => pop(20 + i * 12));
  const pill1 = pop(78);
  const cap1 = seg(frame, 86, 102);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const cardRem = pop(132);
  const wfCards = [0, 1, 2, 3].map((i) => pop(160 + i * 10));
  const arrDown = seg(frame, 148, 162, Easing.inOut(Easing.cubic));
  const pill2 = pop(190);
  const cap2 = seg(frame, 202, 218);

  // ── Beat 3: handling big files ────────────────────────────────────
  const cardCap = pop(252);
  const cardMtk = pop(268);
  const arrMtk = seg(frame, 272, 288, Easing.inOut(Easing.cubic));
  const pill3 = pop(300);
  const cap3 = seg(frame, 308, 324);
  const techCap = seg(frame, 312, 328);

  // ── Beat 4: the result ────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const speedX = Math.round(
    interpolate(frame, [384, 414], [1, 15], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="One video, four platforms," accentText="one at a time?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        {PLATFORMS.map((p, i) => (
          <IconCard
            key={p.title}
            x={90 + i * 280}
            y={150}
            w={250}
            emoji={p.emoji}
            title={p.title}
            sub={p.sub}
            tone="danger"
            scale={platCards[i]}
            opacity={Math.min(1, platCards[i])}
          />
        ))}
        <StatPill x={430} y={400} emoji="⏱️" text="30–45 minutes of re-encoding and uploading" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <CaptionBand text="Each platform means its own format, size limit and upload flow" tone="danger" opacity={cap1} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Render once," accentText="ship to four" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <IconCard x={490} y={130} w={300} emoji="🎬" title="Remotion renders both formats" sub="1080×1920 + 1920×1080, once" tone="accent" scale={cardRem} opacity={Math.min(1, cardRem)} />
        <FlowArrow x={624} y={228} len={64} progress={arrDown} color={B.accent} />
        {[
          { label: "process-video.yml", sub: "YouTube" },
          { label: "linkedin-video.yml", sub: "LinkedIn" },
          { label: "instagram-video.yml", sub: "Reels" },
          { label: "facebook-video.yml", sub: "Facebook" },
        ].map((wf, i) => (
          <IconCard
            key={wf.label}
            x={90 + i * 280}
            y={300}
            w={250}
            emoji="⚙️"
            title={wf.label}
            sub={wf.sub}
            tone="accent"
            scale={wfCards[i]}
            opacity={Math.min(1, wfCards[i])}
          />
        ))}
        <StatPill x={454} y={478} emoji="🎯" text="one trigger, four platforms" tone="accent" scale={pill2} opacity={Math.min(1, pill2)} />
        <CaptionBand text="GitHub Actions pushes the right format to each platform's own API" tone="accent" opacity={cap2} y={600} />
      </Group>

      {/* ════ Beat 3 — HANDLING BIG FILES ════ */}
      <Group opacity={b3}>
        <Headline text="No file too large —" accentText="up to 2GB" accentColor={B.success} opacity={seg(frame, 240, 254)} />
        <IconCard x={180} y={190} w={340} emoji="🚫" title="Bot API caps at 20MB" sub="most videos don't fit" tone="danger" scale={cardCap} opacity={Math.min(1, cardCap)} />
        <FlowArrow x={540} y={244} len={140} progress={arrMtk} color={B.success} />
        <IconCard x={760} y={190} w={340} emoji="📥" title="MTKruto pulls up to 2GB" sub="straight from Telegram" tone="success" scale={cardMtk} opacity={Math.min(1, cardMtk)} />
        <StatPill x={410} y={422} emoji="🛟" text="Telegram-embed fallback if any upload fails" tone="success" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Large source video streams straight from Telegram — no size ceiling" tone="success" opacity={cap3} y={614} />
        <div style={{ position: "absolute", left: 0, top: 590, width: 1280, textAlign: "center", fontSize: 15, fontWeight: 600, color: B.muted, opacity: techCap, fontFamily }}>
          via MTKruto, a full MTProto client
        </div>
      </Group>

      {/* ════ Beat 4 — RESULT ════ */}
      <Group opacity={b4}>
        <Headline text="The payoff" opacity={seg(frame, 344, 358)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>30–45 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>per video, one platform at a time</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>2–3 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>of monitoring, all four platforms</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{speedX}× faster</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            One click uploads to YouTube, Reels, LinkedIn and Facebook.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Remotion + GitHub Actions · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
