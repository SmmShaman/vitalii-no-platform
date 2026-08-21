/**
 * FeatureDupeDetection — feature p06 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+list mockup with
 * plausible article data, and a big before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — breaking news hits all 6 Telegram/RSS channels at once; the
 *     same headline shows up 6 times in the incoming feed. Red zone.
 *  2. Solution — a duplicate scanner compares each new title against a 48h
 *     cache: 5 near-identical copies get rejected instantly, 1 genuinely new
 *     story passes through.
 *  3. How it stays cheap — a cheap free title match catches almost
 *     everything; only the truly ambiguous ones get an expensive embeddings
 *     check. One small tech-credibility line (Azure OpenAI + Supabase vector DB).
 *  4. Result — before/after cards: ~40% duplicate rate → under 3%,
 *     ≈13× fewer duplicates, daily review time near zero. Green zone.
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

const HEADLINE = "Government unveils new AI regulation framework";

const INCOMING: { channel: string; time: string }[] = [
  { channel: "NRK Tech", time: "08:14" },
  { channel: "TechCrunch NO", time: "08:14" },
  { channel: "Norway Today", time: "08:15" },
  { channel: "AI Norge", time: "08:15" },
  { channel: "VG Teknologi", time: "08:16" },
  { channel: "Digi.no", time: "08:16" },
];

type MatchRow = { channel: string; headline: string; match: number; verdict: "dup" | "unique" };

const MATCHES: MatchRow[] = [
  { channel: "NRK Tech", headline: HEADLINE, match: 98, verdict: "dup" },
  { channel: "TechCrunch NO", headline: HEADLINE, match: 96, verdict: "dup" },
  { channel: "Norway Today", headline: "Gov't unveils new AI regulation framework", match: 94, verdict: "dup" },
  { channel: "AI Norge", headline: "New AI regulation framework unveiled by gov't", match: 92, verdict: "dup" },
  { channel: "VG Teknologi", headline: HEADLINE, match: 90, verdict: "dup" },
  { channel: "Digi.no", headline: "Oslo announces winter energy subsidy plan", match: 11, verdict: "unique" },
];

/** Six rows with the same headline arriving from six different channels. */
const IncomingList: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 700, fontFamily }}>
    {INCOMING.map((d, i) => {
      const t = seg(frame, 14 + i * 10, 26 + i * 10);
      return (
        <div
          key={d.channel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "13px 20px",
            borderBottom: `1px solid ${B.border}`,
            opacity: t,
            transform: `translateX(${(1 - t) * 24}px)`,
          }}
        >
          <div style={{ width: 140, fontSize: 15, fontWeight: 700, color: B.danger, flexShrink: 0 }}>{d.channel}</div>
          <div
            style={{
              flex: 1,
              fontSize: 15.5,
              fontWeight: 600,
              color: B.ink,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {HEADLINE}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: B.muted, flexShrink: 0 }}>{d.time}</div>
        </div>
      );
    })}
  </div>
);

/** Duplicate-scanner table: channel, headline, match %, verdict. */
const MatchesTable: React.FC<{ w: number; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  frame,
  appearStart,
  stagger = 7,
}) => {
  const cols = [0.17, 0.5, 0.14, 0.19];
  const heads = ["Channel", "Headline", "Match", "Verdict"];
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
      {MATCHES.map((r, i) => {
        const t = seg(frame, appearStart + i * stagger, appearStart + i * stagger + 12);
        const dup = r.verdict === "dup";
        return (
          <div
            key={r.channel}
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
            <div style={{ ...cell(cols[0]), fontWeight: 600, color: B.muted }}>{r.channel}</div>
            <div style={{ ...cell(cols[1]), fontWeight: 500 }}>{r.headline}</div>
            <div style={cell(cols[2])}>
              <span style={{ fontWeight: 700, color: dup ? B.danger : B.success }}>{r.match}%</span>
            </div>
            <div style={cell(cols[3])}>
              <span
                style={{
                  padding: "2.5px 10px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  background: dup ? B.dangerBg : B.successBg,
                  border: `1px solid ${dup ? "#F3C2C7" : "#BFE7CD"}`,
                  color: dup ? B.danger : B.success,
                }}
              >
                {dup ? "✕ Duplicate" : "✓ Unique"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureDupeDetection: React.FC = () => {
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

  // ── Beat 3: how it stays cheap ─────────────────────────────────────
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
  const speedX = Math.round(
    interpolate(frame, [384, 414], [1, 13], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="The same big story hits" accentText="6 channels at once" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="scraper — incoming (last 10 min)" opacity={Math.min(1, pop(8))}>
          <IncomingList frame={frame} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Same headline, 6 different channels — my queue fills up with copies of the same story"
        />
        <StatPill x={846} y={340} emoji="📋" text="~40% of the queue is duplicates" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="🕒" text="1-2 hours sifting, daily" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😫" text="Exhausting, every day" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Breaking news hits every channel at once — the same article, over and over" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Stage 1 catches" accentText="5 out of 6 instantly" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={160} y={132} text="Levenshtein < 3" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={380} y={132} text="48h rolling cache" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={630} y={132} text="Free & instant" icon="⚡" scale={chip3} opacity={Math.min(1, chip3)} />
        <ToggleSwitch x={880} y={138} label="Auto-reject" on={togOn} opacity={seg(frame, 172, 184)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="pre-moderate-news — duplicate scanner" opacity={seg(frame, 168, 182)}>
          <MatchesTable w={1060} frame={frame} appearStart={184} stagger={7} />
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
            …only the unique one moves on to my moderation queue
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="Title, cache and free/instant check — combined in one automatic scan" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS CHEAP ════ */}
      <Group opacity={b3}>
        <Headline text="Only the ambiguous ones" accentText="need the expensive check" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🗂️" title="48-hour title cache" sub="fuzzy match, free & instant" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🔍" title="Most duplicates caught here" sub="Stage 1 — title comparison" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🧬" title="True unknowns get a deep check" sub="Stage 2 — semantic comparison" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: Azure OpenAI embeddings compared inside a Supabase vector database"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>~40%</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>duplicate rate in the queue</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>&lt;3%</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>review time near zero</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{speedX}× fewer duplicates</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Stage 1 is free and instant. Stage 2 only runs when it truly has to.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>pre-moderate-news · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
