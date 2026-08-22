/**
 * FeatureMtkrutoVideo — feature p21 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a browser mockup of the stuck video
 * queue, an animated bypass-then-distribute chain, and a big before→after
 * capacity metric.
 *
 * Story (4 beats):
 *  1. Problem — 6 Telegram channels send 50-500MB+ videos; the Bot API's
 *     hard 20MB ceiling rejects them; content is uningested, opportunities
 *     missed. Red zone.
 *  2. Solution — MTKruto connects as a full MTProto client, sidestepping
 *     the Bot API entirely, downloading up to 2GB per file.
 *  3. How it stays smooth — processAndUploadVideo() hands the big files to
 *     GitHub Actions, which uploads to YouTube (unlisted) and pushes to
 *     LinkedIn/Instagram/Facebook — no Edge Function size limit involved.
 *  4. Result — before/after cards: 20MB ceiling → 2GB per file, ≈100× more
 *     capacity, 100% of "video too large" failures gone. Green zone.
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
  StickyNote,
  StatPill,
  CheckBadge,
  CaptionBand,
  BrowserWindow,
  SkeletonScroll,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

const DIST = [
  { emoji: "🎬", title: "One function, every platform", sub: "processAndUploadVideo()", tone: "accent" as const },
  { emoji: "⚙️", title: "GitHub Actions", sub: "handles the big files", tone: "accent" as const },
  { emoji: "📲", title: "YouTube · LinkedIn · IG · FB", sub: "uploaded automatically", tone: "success" as const },
];

export const FeatureMtkrutoVideo: React.FC = () => {
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
  const scroll = frame * 2.0;
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution — MTKruto bypasses the wall ───────────────
  const card1Pop = pop(134);
  const card2Pop = pop(160);
  const bypassArr = seg(frame, 150, 170, Easing.inOut(Easing.cubic));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays smooth — distribution ────────────────────
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
  const capX = Math.round(interpolate(frame, [384, 414], [1, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Bot API chokes on" accentText="big videos" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="Telegram — video queue (6 channels)" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Videos keep arriving at 50-500MB+ — the Bot API's hard limit is 20MB"
        />
        <StatPill x={846} y={340} emoji="📦" text="20MB Bot API ceiling" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="🎥" text="Real videos: 50-500MB+" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="🚫" text="Uningested, opportunities missed" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="One hard wall stops every large video before it even starts downloading" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="MTKruto opens" accentText="the back door" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <IconCard x={160} y={210} w={340} emoji="📡" title="MTKruto" sub="full MTProto client, not Bot API" tone="accent" scale={card1Pop} opacity={Math.min(1, card1Pop)} />
        <IconCard x={780} y={210} w={340} emoji="⬇️" title="Up to 2GB per file" sub="20MB wall bypassed entirely" tone="success" scale={card2Pop} opacity={Math.min(1, card2Pop)} />
        <FlowArrow x={500} y={254} len={280} progress={bypassArr} color={B.success} />
        <CaptionBand
          text="MTKruto connects as a full MTProto client — no more 20MB Bot API ceiling"
          tone="accent"
          opacity={cap2}
        />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS SMOOTH ════ */}
      <Group opacity={b3}>
        <Headline text="Then it flows" accentText="straight out" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji={DIST[0].emoji} title={DIST[0].title} sub={DIST[0].sub} tone={DIST[0].tone} scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji={DIST[1].emoji} title={DIST[1].title} sub={DIST[1].sub} tone={DIST[1].tone} scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji={DIST[2].emoji} title={DIST[2].title} sub={DIST[2].sub} tone={DIST[2].tone} scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="The heavy lifting happens off to the side — nothing here ever hits a size limit again"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>20MB limit</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>big videos rejected</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>2GB per file</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>every video ingested</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{capX}× more capacity</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            100% of "video too large" failures gone — from 50MB clips to full documentaries.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>MTKruto Video Pipeline · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
