/**
 * FeatureSourceConsolidation — feature p22 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+table mockup with
 * plausible source data, filter chips clicked by a cursor, and a big
 * before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — 6 Telegram channels + 26 RSS feeds, each its own format and
 *     schedule; a plain-language task on a sticky note; ~2 hours of manual
 *     scanning a day and things still slip through. Red zone.
 *  2. Solution — one admin table where every source lands: Telegram + RSS
 *     chips, a 10-min / 30-min schedule chip, "auto-moderate" toggle, and a
 *     live queue table (source / type / schedule / status).
 *  3. How it stays orderly — two scheduled GitHub Actions pull on their own
 *     cadence (round-robin, batched) so nothing hits a rate limit, then one
 *     AI filter sorts everything before it reaches you.
 *  4. Result — before/after cards: 32 sources checked one by one → 1 queue
 *     that fills itself; a counting "32 → 1" hero number. Green zone, check
 *     badge.
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

type QueueRow = {
  source: string;
  type: string;
  schedule: string;
  status: string;
  statusTone?: "accent" | "success";
};

const ROWS: QueueRow[] = [
  { source: "Tech Digest NO", type: "Telegram", schedule: "every 10 min", status: "Queued" },
  { source: "AI Weekly", type: "Telegram", schedule: "every 10 min", status: "Queued" },
  { source: "DevTo RSS", type: "RSS", schedule: "every 30 min", status: "Queued", statusTone: "success" },
  { source: "HackerNews RSS", type: "RSS", schedule: "every 30 min", status: "Filtered", statusTone: "success" },
  { source: "TechCrunch RSS", type: "RSS", schedule: "every 30 min", status: "Queued" },
];

const QueueTable: React.FC<{ w: number; rows: QueueRow[]; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  rows,
  frame,
  appearStart,
  stagger = 9,
}) => {
  const cols = [0.32, 0.18, 0.24, 0.26];
  const heads = ["Source", "Type", "Schedule", "Status"];
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
            key={r.source}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "9px 18px",
              gap: 14,
              borderBottom: `1px solid ${B.border}`,
              fontSize: 15.5,
              color: B.ink,
              opacity: t,
              transform: `translateX(${(1 - t) * 26}px)`,
            }}
          >
            <div style={{ ...cell(cols[0]), fontWeight: 600 }}>{r.source}</div>
            <div style={{ ...cell(cols[1]), color: B.muted, fontWeight: 500 }}>{r.type}</div>
            <div style={{ ...cell(cols[2]), color: B.muted, fontWeight: 500 }}>{r.schedule}</div>
            <div style={cell(cols[3])}>
              <span
                style={{
                  padding: "2.5px 10px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: r.statusTone === "success" ? B.successBg : B.accentBg,
                  border: `1px solid ${toneEdge(r.statusTone === "success" ? "success" : "accent")}`,
                  color: r.statusTone === "success" ? B.success : B.accent,
                }}
              >
                {r.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureSourceConsolidation: React.FC = () => {
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
  const cx = interpolate(frame, [124, 134, 152, 166, 182, 205], [700, 200, 460, 660, 900, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 134, 152, 166, 182, 205], [400, 152, 152, 152, 152, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 205, 218));
  const click1 = seg(frame, 134, 146, Easing.out(Easing.quad));
  const click2 = seg(frame, 152, 164, Easing.out(Easing.quad));
  const click3 = seg(frame, 182, 194, Easing.out(Easing.quad));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays orderly ──────────────────────────────────
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
  const sourcesLeft = Math.round(
    interpolate(frame, [384, 410], [32, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Manually check" accentText="32 news sources?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="channels & feeds — unsorted" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: today's AI/tech news from every channel and every feed — Telegram AND RSS, none missed"
        />
        <StatPill x={846} y={340} emoji="🖱️" text="6 channels + 26 feeds to check" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="⏱️" text="~2 hours of manual scanning" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😩" text="Something always slips through" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="32 different formats, 32 different schedules — one exhausting daily routine" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="One queue that" accentText="runs itself" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={160} y={132} text="Telegram" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={320} y={132} text="RSS" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={420} y={132} text="Every 10 min" icon="🔁" scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={620} y={132} text="Every 30 min" icon="📅" scale={chip4} opacity={Math.min(1, chip4)} />
        <ToggleSwitch x={860} y={138} label="Auto-moderate" on={togOn} opacity={seg(frame, 172, 184)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="news_sources — moderation queue" opacity={seg(frame, 168, 182)}>
          <QueueTable w={1060} rows={ROWS} frame={frame} appearStart={184} stagger={7} />
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
            …all 32 sources, configured no-code in one admin table
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="Two scheduled jobs pull everything in, then one AI filter sorts it" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS ORDERLY ════ */}
      <Group opacity={b3}>
        <Headline text="And it never hits a" accentText="rate limit" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🔁" title="realtime-scraper.yml" sub="round-robin every 10 min" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="📰" title="rss-monitor-v2.yml" sub="8 feeds × 4 batches, every 30 min" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🧠" title="pre-moderate-news" sub="AI filters before it reaches you" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: GitHub Actions + a Supabase Edge Function, all configured in news_sources"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>32 sources</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>checked one by one, ~2 hrs/day</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>1 queue</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>arrives automatically, filtered</div>
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
          <span style={{ fontSize: 48, fontWeight: 800, color: B.success }}>{sourcesLeft} sources → 1 queue</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Every source, one place, checked automatically — zero rate-limit hits.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
