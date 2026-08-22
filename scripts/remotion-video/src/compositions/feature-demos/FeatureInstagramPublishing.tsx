/**
 * FeatureInstagramPublishing — feature p15 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a realistic Instagram post mockup,
 * an automated validate→publish checklist, and a big before→after failure-rate metric.
 *
 * Story (4 beats):
 *  1. Problem — cryptic error codes (#10, #24, #100, #190) and strict aspect
 *     ratio rules silently reject 40% of posts. Red zone.
 *  2. Solution — validate the image locally first, then create a Reels
 *     container, poll until it's ready, and publish — all automatic.
 *  3. How it works — aspect-ratio pre-check, patient polling (every 10s, up
 *     to 30 tries), and an error → fix map for every failure code.
 *  4. Result — before/after cards: 40% failure rate → under 5%, cryptic
 *     codes → self-diagnosable fixes. Green zone, check badge.
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

/** Small Instagram-feed post mockup: square media block, caption, either an error banner or a like row. */
const InstaCard: React.FC<{ w: number; ok: boolean }> = ({ w, ok }) => (
  <div style={{ width: w, padding: "18px 20px", fontFamily }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${B.danger}, ${B.accent})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: "#fff",
          fontWeight: 800,
        }}
      >
        VB
      </div>
      <div style={{ fontSize: 14.5, fontWeight: 700, color: B.ink }}>vitalii.no</div>
    </div>
    <div
      style={{
        marginTop: 12,
        width: "100%",
        aspectRatio: ok ? "4 / 5" : "1 / 1",
        borderRadius: 10,
        border: `2px solid ${ok ? "#BFE7CD" : B.danger}`,
        background: ok ? `linear-gradient(135deg, ${B.success} 0%, #43C97F 100%)` : "#F0D8DA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 42,
        position: "relative",
      }}
    >
      {ok ? "🎬" : "🖼️"}
      {!ok && (
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            bottom: 10,
            padding: "6px 10px",
            borderRadius: 8,
            background: B.danger,
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Error #100 — media not published
        </div>
      )}
    </div>
    <div style={{ marginTop: 12, display: "flex", gap: 22, fontSize: 13, color: B.muted, fontWeight: 600 }}>
      <span>{ok ? "❤️ Liked" : "❤️"}</span>
      <span>💬 Comment</span>
      <span>📤 Share</span>
    </div>
  </div>
);

export const FeatureInstagramPublishing: React.FC = () => {
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
  const drop = Math.round(interpolate(frame, [384, 414], [0, 88], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Instagram rejects your post with" accentText="cryptic errors?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={520} h={452} title="Instagram — publish failed" opacity={Math.min(1, pop(8))}>
          <InstaCard w={520} ok={false} />
        </BrowserWindow>
        <StickyNote
          x={650}
          y={150}
          w={510}
          opacity={noteOp}
          text="Need: this photo published as a Reel, without babysitting the upload every time"
        />
        <StatPill x={666} y={340} emoji="🚫" text="Error #10 · #24 · #100 · #190" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={666} y={402} emoji="📐" text="Strict aspect ratio, 4:5 to 1.91:1" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={666} y={464} emoji="📉" text="40% of posts silently rejected" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Cryptic codes and strict rules — a coin-flip on whether the post even goes live" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Check first," accentText="publish with confidence" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={150} y={132} text="Validate ratio" icon="✓" color={B.success} scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={390} y={132} text="Create container" icon="✓" color={B.success} scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={650} y={132} text="Poll status" icon="✓" color={B.success} scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={870} y={132} text="Publish" icon="✓" color={B.success} scale={chip4} opacity={Math.min(1, chip4)} />
        <BrowserWindow x={390} y={196} w={500} h={420} title="Instagram — published" opacity={postWinOp}>
          <InstaCard w={500} ok />
        </BrowserWindow>
        <CaptionBand text="Bad media never even reaches Instagram — it's caught before the upload starts" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="What happens" accentText="behind the scenes" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="📐" title="Aspect-ratio check" sub="parses headers locally, rejects upfront" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="⏱️" title="Patient polling" sub="every 10s, up to 30 tries" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🗺️" title="Error → fix map" sub="every code becomes a clear next step" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: one post-to-instagram Deno Edge Function talking to the Graph API"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>40% fail</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>Cryptic, unfixable errors</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>Under 5% fail</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>Every error, self-diagnosable</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>-{drop}% failures</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            No more sifting through obtuse documentation for every failed post.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Instagram Publishing · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
