/**
 * FeatureCommentReplies — feature p05 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+table mockup with
 * real-looking comments, platform chips clicked by a cursor, and a big
 * before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — 20+ comments a day across Facebook, Instagram and the blog;
 *     a plain-language task on a sticky note; 1-2 hours reading tone and
 *     typing replies, every single day. Red zone.
 *  2. Solution — platform chips + "auto-draft replies" toggle; a table shows
 *     real-looking comments scored for sentiment with a draft reply ready for
 *     each one, pulled in automatically every 30 minutes.
 *  3. How it works — sentiment scored first, a draft written using the
 *     article as context, then sent to Telegram for a human to approve. One
 *     small tech-credibility line (Azure OpenAI + Supabase Edge Function).
 *  4. Result — before/after cards: 1-2 hours a day → under 10 minutes,
 *     ≈9× faster, human still taps Reply/Edit/Ignore. Green zone, check badge.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { B, toneEdge } from "./bright-theme";
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

type CommentRow = { text: string; platform: string; score: number; emoji: string };

const COMMENTS: CommentRow[] = [
  { text: "This looks amazing, when's it launching?", platform: "Instagram", score: 0.8, emoji: "😊" },
  { text: "How do you handle rate limits?", platform: "Blog", score: 0.2, emoji: "🙂" },
  { text: "Not sure this works for small blogs", platform: "Blog", score: -0.1, emoji: "😐" },
  { text: "Same old AI hype, nothing new here", platform: "Facebook", score: -0.4, emoji: "😕" },
  { text: "🔥 need this yesterday", platform: "Instagram", score: 0.9, emoji: "😍" },
];

/** Real-looking comments with a sentiment score badge and a draft-ready status. */
const CommentsTable: React.FC<{ w: number; rows: CommentRow[]; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  rows,
  frame,
  appearStart,
  stagger = 7,
}) => {
  const cols = [0.44, 0.16, 0.18, 0.22];
  const heads = ["Comment", "Platform", "Sentiment", "Status"];
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
        const tone = r.score > 0.4 ? "success" : r.score < 0 ? "danger" : "accent";
        const toneColor = tone === "success" ? B.success : tone === "danger" ? B.danger : B.accent;
        const toneBg2 = tone === "success" ? B.successBg : tone === "danger" ? B.dangerBg : B.accentBg;
        return (
          <div
            key={r.text}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "9px 18px",
              gap: 14,
              borderBottom: `1px solid ${B.border}`,
              fontSize: 15,
              color: B.ink,
              opacity: t,
              transform: `translateX(${(1 - t) * 26}px)`,
            }}
          >
            <div style={{ ...cell(cols[0]), fontWeight: 600 }}>“{r.text}”</div>
            <div style={{ ...cell(cols[1]), color: B.muted, fontWeight: 500 }}>{r.platform}</div>
            <div style={cell(cols[2])}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "2px 10px",
                  borderRadius: 8,
                  background: toneBg2,
                  border: `1px solid ${toneEdge(tone)}`,
                  color: toneColor,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {r.emoji} {r.score > 0 ? `+${r.score.toFixed(1)}` : r.score.toFixed(1)}
              </span>
            </div>
            <div style={cell(cols[3])}>
              <span
                style={{
                  padding: "2.5px 10px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: B.successBg,
                  border: `1px solid ${toneEdge("success")}`,
                  color: B.success,
                }}
              >
                Draft ready
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureCommentReplies: React.FC = () => {
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
  const speedX = Math.round(interpolate(frame, [384, 414], [1, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Answer 20+ comments a day," accentText="by hand?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="Comments inbox — Facebook, Instagram, Blog" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: read every comment, judge the tone, and reply like a real person — on 3 different platforms"
        />
        <StatPill x={846} y={340} emoji="⏰" text="1-2 hours, every day" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="😣" text="Tone and sentiment easy to miss" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="🌙" text="Comments wait until you're free" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Three platforms, one inbox to read, one reply to type — every single comment" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Sentiment scored, reply drafted" accentText="automatically" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={140} y={132} text="Facebook" icon="✓" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={340} y={132} text="Instagram" icon="✓" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={540} y={132} text="Blog" icon="✓" scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={680} y={132} text="Every 30 min" icon="🔄" scale={chip4} opacity={Math.min(1, chip4)} />
        <ToggleSwitch x={900} y={138} label="Auto-draft replies" on={togOn} opacity={seg(frame, 172, 184)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="sync-comments — new activity" opacity={seg(frame, 168, 182)}>
          <CommentsTable w={1060} rows={COMMENTS} frame={frame} appearStart={184} stagger={7} />
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
            Every draft matches your usual tone — before a human ever sees it
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="Comments in, sentiment scored, a draft written — every 30 minutes, automatically" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="You stay" accentText="in control" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🎯" title="Sentiment scored first" sub="−1 angry to +1 thrilled" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🧠" title="Draft matches your tone" sub="uses the article as context" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="📲" title="Sent to Telegram for review" sub="Reply · Edit · Ignore" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: Azure OpenAI sentiment scoring plus a Supabase Edge Function on Deno"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>1-2 hours</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>typing every reply, every day</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>under 10 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>tap Reply, Edit, or Ignore</div>
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
            Every reply still sounds like you — you just stopped typing them.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>AI Comment Replies · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
