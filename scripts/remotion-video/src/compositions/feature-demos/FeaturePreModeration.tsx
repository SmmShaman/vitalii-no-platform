/**
 * FeaturePreModeration — feature p01 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+queue mockup with
 * real-looking article headlines, AI verdict badges, and a big before→after
 * metric.
 *
 * Story (4 beats):
 *  1. Problem — 50-80 articles/day pour in from 6 Telegram channels + RSS;
 *     a plain-language need on a sticky note; ~70% of it is spam; 2+ hours
 *     of manual reading, every day. Red zone.
 *  2. Solution — every headline gets an automatic verdict (Approve / Reject
 *     / Flag) in a moderation queue; spam rows turn red and drop out, real
 *     news turns green and stays. One editable rule behind it all.
 *  3. How it works — article comes in → AI reads & scores it → spam never
 *     gets saved. One small tech-credibility line (Jobbot-gpt-4.1-mini).
 *  4. Result — before/after cards: 2+ hours → 15 minutes, ≈8× faster.
 *     Green zone, check badge, plus the "12+ prompt tweaks" bonus fact.
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

type ModRow = {
  headline: string;
  channel: string;
  score: number;
  verdict: "Approved" | "Rejected";
  tone: "success" | "danger";
};

const MOD_ROWS: ModRow[] = [
  { headline: "Anthropic ships Claude Opus 5 for enterprise agents", channel: "AI Channel", score: 94, verdict: "Approved", tone: "success" },
  { headline: "FREE crypto giveaway — send ETH, get 2x back", channel: "Crypto Signals", score: 3, verdict: "Rejected", tone: "danger" },
  { headline: "EU AI Act enforcement begins for high-risk systems", channel: "Tech Digest", score: 88, verdict: "Approved", tone: "success" },
  { headline: "Cheap followers and likes, DM now", channel: "Growth Hacks", score: 2, verdict: "Rejected", tone: "danger" },
  { headline: "Google DeepMind open-sources new robotics model", channel: "AI Channel", score: 91, verdict: "Approved", tone: "success" },
];

/** Local mockup table: incoming headline → channel → AI score → verdict badge. */
const ModerationTable: React.FC<{ w: number; rows: ModRow[]; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  rows,
  frame,
  appearStart,
  stagger = 9,
}) => {
  const cols = [0.46, 0.2, 0.14, 0.2];
  const heads = ["Headline", "Channel", "AI score", "Verdict"];
  const cell = (f: number): React.CSSProperties => ({ width: w * f - 14, overflow: "hidden", whiteSpace: "nowrap" });
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
            key={r.headline}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 18px",
              gap: 14,
              borderBottom: `1px solid ${B.border}`,
              fontSize: 15,
              color: B.ink,
              opacity: t,
              transform: `translateX(${(1 - t) * 26}px)`,
            }}
          >
            <div style={{ ...cell(cols[0]), fontWeight: 600, textOverflow: "ellipsis" }}>{r.headline}</div>
            <div style={{ ...cell(cols[1]), color: B.muted, fontWeight: 500 }}>{r.channel}</div>
            <div style={cell(cols[2])}>
              <span
                style={{
                  display: "inline-block",
                  minWidth: 34,
                  textAlign: "center",
                  padding: "2px 8px",
                  borderRadius: 8,
                  background: r.tone === "success" ? B.successBg : B.dangerBg,
                  border: `1px solid ${toneEdge(r.tone)}`,
                  color: r.tone === "success" ? B.success : B.danger,
                  fontWeight: 700,
                  fontSize: 14.5,
                }}
              >
                {r.score}
              </span>
            </div>
            <div style={cell(cols[3])}>
              <span
                style={{
                  padding: "2.5px 10px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: r.tone === "success" ? B.successBg : B.dangerBg,
                  border: `1px solid ${toneEdge(r.tone)}`,
                  color: r.tone === "success" ? B.success : B.danger,
                }}
              >
                {r.verdict}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FeaturePreModeration: React.FC = () => {
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
  const chip2 = pop(144);
  const chip3 = pop(156);
  const noteOp2 = seg(frame, 168, 184, Easing.out(Easing.cubic));
  const cx = interpolate(frame, [126, 136, 156, 178, 198], [700, 260, 900, 1030, 1030], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [126, 136, 156, 178, 198], [400, 152, 152, 178, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 126, 134) * (1 - seg(frame, 198, 212));
  const click1 = seg(frame, 136, 148, Easing.out(Easing.quad));
  const click2 = seg(frame, 178, 190, Easing.out(Easing.quad));
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
  const speedX = Math.round(interpolate(frame, [384, 414], [1, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="50-80 articles a day," accentText="70% of it spam?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="moderation queue — incoming (50-80/day)" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: only real news in front of me — no crypto giveaways, no follower ads, no fake deals"
        />
        <StatPill x={846} y={340} emoji="📥" text="50-80 articles every day" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="⏱️" text="2+ hours reviewing, daily" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😫" text="~70% of it turns out to be spam" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Six Telegram channels and RSS feeds pour in — real news buried in noise" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="AI reads every one in" accentText="under a second" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={140} y={132} text="Approve" icon="✅" scale={chip1} opacity={Math.min(1, chip1)} color={B.success} />
        <FilterChip x={330} y={132} text="Reject" icon="🚫" scale={chip2} opacity={Math.min(1, chip2)} color={B.danger} />
        <FilterChip x={500} y={132} text="Flag for review" icon="🚩" scale={chip3} opacity={Math.min(1, chip3)} color={B.amber} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="moderation queue — AI verdicts" opacity={seg(frame, 122, 136)}>
          <ModerationTable w={1060} rows={MOD_ROWS} frame={frame} appearStart={138} stagger={7} />
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
              opacity: seg(frame, 210, 224) * 0.9,
            }}
          >
            …rejected items vanish instantly — nothing spammy ever reaches your queue
          </div>
        </BrowserWindow>
        <StickyNote
          x={880}
          y={-4}
          w={330}
          rotate={2}
          opacity={noteOp2}
          text="✏️ The rule lives in one editable prompt — change it anytime, no code deploy"
        />
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1)} />
        <CaptionBand text="Each article gets approved, rejected, or flagged — automatically, before you ever see it" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="How it decides" opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="📥" title="Article comes in" sub="from Telegram or RSS" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🧠" title="AI reads and scores it" sub="checks for spam, ads, duplicates" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🚫" title="Spam never gets saved" sub="rejected before it's ever stored" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: Azure OpenAI's Jobbot-gpt-4.1-mini scores every article against a live, editable prompt"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>2+ hours</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>manual review, every day</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>15 minutes</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>AI pre-filters the rest</div>
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
            The prompt has been refined 12+ times since — zero code changes.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>AI Pre-Moderation · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
