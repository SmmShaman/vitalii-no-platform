/**
 * FeatureLinkedinNativeUpload — feature p14 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a realistic LinkedIn post mockup,
 * an automated step checklist, and a big before→after impressions metric.
 *
 * Story (4 beats):
 *  1. Problem — the default LinkedIn share card is a tiny blurry thumbnail;
 *     2-3x fewer impressions than a native image. Red zone.
 *  2. Solution — one publish trigger runs 4 checks automatically, and the
 *     feed post now carries a big crisp native image instead of a link card.
 *  3. How it works — duplicate guard (checks posted + pending), the Assets
 *     API handshake (register → upload URL → stream → URN), and an
 *     ARTICLE-type fallback if the image upload ever fails.
 *  4. Result — before/after cards: blurry preview → native image,
 *     impressions +200%, double-posting bug gone. Green zone, check badge.
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
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

/** Small LinkedIn-feed post mockup: avatar, name, text, and a swappable media block. */
const PostCard: React.FC<{
  w: number;
  crisp: boolean;
  mediaOpacity?: number;
}> = ({ w, crisp, mediaOpacity = 1 }) => (
  <div style={{ width: w, padding: "18px 20px", fontFamily }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: B.accent,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 800,
        }}
      >
        VB
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: B.ink }}>Vitalii Berbeha</div>
        <div style={{ fontSize: 12.5, color: B.muted, fontWeight: 500 }}>Full-stack developer · 2nd</div>
      </div>
    </div>
    <div style={{ marginTop: 12, fontSize: 15, color: B.ink, fontWeight: 500, lineHeight: 1.35 }}>
      Just shipped a new feature on vitalii.no — check it out 👇
    </div>
    <div
      style={{
        marginTop: 14,
        width: "100%",
        height: crisp ? 220 : 78,
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid ${B.border}`,
        opacity: mediaOpacity,
        display: "flex",
      }}
    >
      {crisp ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${B.accent} 0%, #4C8CFF 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 46,
            filter: "none",
          }}
        >
          🖼️
        </div>
      ) : (
        <div
          style={{
            width: 96,
            height: "100%",
            background: "#DCE3EF",
            filter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          🖼️
        </div>
      )}
      {!crisp && (
        <div style={{ flex: 1, background: "#F4F7FC", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 14px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: B.ink }}>vitalii.no</div>
          <div style={{ fontSize: 11.5, color: B.muted }}>Link preview</div>
        </div>
      )}
    </div>
    <div style={{ marginTop: 12, display: "flex", gap: 22, fontSize: 13, color: B.muted, fontWeight: 600 }}>
      <span>👍 Like</span>
      <span>💬 Comment</span>
      <span>↗️ Share</span>
    </div>
  </div>
);

export const FeatureLinkedinNativeUpload: React.FC = () => {
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
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);

  // ── Beat 2: the solution ──────────────────────────────────────────
  const chip1 = pop(132);
  const chip2 = pop(142);
  const chip3 = pop(152);
  const chip4 = pop(164);
  const postWinOp = seg(frame, 168, 184);
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
  const pct = Math.round(interpolate(frame, [384, 414], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Your LinkedIn post shows a" accentText="blurry preview?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={620} h={452} title="LinkedIn feed — default share card" opacity={Math.min(1, pop(8))}>
          <PostCard w={620} crisp={false} />
        </BrowserWindow>
        <StickyNote
          x={750}
          y={150}
          w={410}
          opacity={noteOp}
          text="Need: a sharp, branded image that actually makes people stop scrolling"
        />
        <StatPill x={766} y={340} emoji="🖼️" text="Tiny, blurry link thumbnail" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={766} y={402} emoji="📉" text="2-3x fewer impressions" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={766} y={464} emoji="🧩" text="5-step upload API, done by hand" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="A default link preview is small, blurry, and completely out of your control" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="One publish trigger," accentText="fully automatic" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={130} y={132} text="Check duplicates" icon="✓" color={B.success} scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={360} y={132} text="Register asset" icon="✓" color={B.success} scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={580} y={132} text="Stream image" icon="✓" color={B.success} scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={780} y={132} text="Publish native post" icon="✓" color={B.success} scale={chip4} opacity={Math.min(1, chip4)} />
        <BrowserWindow x={330} y={196} w={620} h={420} title="LinkedIn feed — native image" opacity={postWinOp}>
          <PostCard w={620} crisp />
        </BrowserWindow>
        <CaptionBand text="No clicking through 5 steps by hand — one trigger runs the whole handshake" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="What happens" accentText="behind the scenes" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🔁" title="Duplicate guard" sub="checks posted + pending" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="📦" title="Assets API handshake" sub="register → URL → stream → URN" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🛟" title="Safety net" sub="falls back to a link post if upload fails" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: a single post-to-linkedin Deno Edge Function drives the whole flow"
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
            <div style={{ fontSize: 34, fontWeight: 800, color: B.ink, marginTop: 14 }}>Blurry preview</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>2-3x fewer impressions</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: B.ink, marginTop: 14 }}>Native image</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>Zero duplicate posts</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>+{pct}% impressions</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Reliable, high-impact delivery to LinkedIn — with zero manual oversight.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>LinkedIn Publishing · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
