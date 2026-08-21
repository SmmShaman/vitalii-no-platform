/**
 * FeatureJobAnalyzer — feature j01 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real browser+table mockup with real
 * job data, filter chips + toggle clicked by a cursor, and a big before→after
 * metric.
 *
 * Story (4 beats):
 *  1. Problem — 500-800+ postings a day from FINN/NAV/LinkedIn; a plain-
 *     language note ("does this fit ME?"); reading every listing yourself
 *     takes ~4 hours and breeds burnout and bias. Red zone.
 *  2. Solution — AI scores every job against your CV in seconds: filter
 *     chips + a "hot jobs only" toggle; the table instantly shows 5 scored
 *     matches (real columns: Position/Company/City/Score/Source/Status).
 *  3. How the AI decides — CV → Azure GPT-4 "Vibe & Fit Scanner" → a 0-100
 *     score with pros/cons. One small tech-credibility line (Deno Edge
 *     Function + GitHub Actions batching).
 *  4. Result — before/after cards: 4+ hours → under 30 minutes, ≈8×
 *     faster, 90% less time wasted on irrelevant listings. Green zone.
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
  JobsTable,
  JobRow,
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

const ROWS: JobRow[] = [
  { role: "Backend Developer", company: "Nordic Fintech AS", city: "Oslo", score: 91, source: "FINN", status: "Hot job", statusTone: "success" },
  { role: "DevOps Engineer", company: "CloudNorth", city: "Bergen", score: 84, source: "LinkedIn", status: "Hot job", statusTone: "success" },
  { role: "Data Analyst", company: "InsightLab", city: "Oslo", score: 76, source: "NAV.no", status: "Hot job", statusTone: "success" },
  { role: "QA Engineer", company: "TestPro Norge", city: "Trondheim", score: 63, source: "FINN", status: "Hot job", statusTone: "success" },
  { role: "Sales Manager", company: "RetailPlus", city: "Oslo", score: 22, source: "LinkedIn", status: "Low match" },
];

export const FeatureJobAnalyzer: React.FC = () => {
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
  const cx = interpolate(frame, [124, 134, 152, 166, 182, 205], [700, 190, 460, 660, 1000, 1080], {
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

  // ── Beat 3: how the AI decides ────────────────────────────────────
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
        <Headline text="Find the right job among" accentText="500+ postings a day?" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="FINN + NAV + LinkedIn — 500-800+/day" opacity={Math.min(1, pop(8))}>
          <SkeletonScroll w={700} h={410} offset={scroll} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: which of these actually fit MY CV and skills — not just my gut feeling"
        />
        <StatPill x={846} y={340} emoji="🖱️" text="Reading every listing yourself" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="⏱️" text="~4 hours, every day" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😫" text="Burnout, bias, missed jobs" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="500-800+ new postings a day — too many to read yourself, every single one" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Let AI score every job in" accentText="seconds" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={140} y={132} text="Score ≥ 50" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={320} y={132} text="Full-time" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={500} y={132} text="All 3 sources" scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={700} y={132} text="This week" icon="📅" scale={chip4} opacity={Math.min(1, chip4)} />
        <ToggleSwitch x={900} y={138} label="Hot jobs only" on={togOn} opacity={seg(frame, 172, 184)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="job_analyzer — AI fit scoring" opacity={seg(frame, 168, 182)}>
          <JobsTable w={1060} rows={ROWS} frame={frame} appearStart={184} stagger={7} />
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
            …every score comes with pros/cons and workplace vibe — sent to Telegram in seconds
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1, click3 % 1)} />
        <CaptionBand text="AI reads each posting against your CV and scores it 0-100, instantly" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW THE AI DECIDES ════ */}
      <Group opacity={b3}>
        <Headline text="How the AI decides" accentText="what's a good fit" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="📄" title="Your CV, anonymized" sub="from user_profiles" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🤖" title="Azure GPT-4 Vibe & Fit Scanner" sub="reads the job + your CV" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="📊" title="0-100 fit score + pros/cons" sub="plus workplace vibe" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: a Deno Edge Function on Supabase, batched via GitHub Actions for 10+ jobs at once"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>4+ hours</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>reading every listing yourself</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>under 30 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>AI scores, you just decide</div>
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
            90% less time wasted on jobs that were never a fit — hot jobs go straight to Telegram.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>job_analyzer · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
