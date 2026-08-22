/**
 * FeatureTimeZoneTamer — feature p58 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real scheduler dashboard mockup,
 * an icon strip explaining the hourly check, and a big before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — one UTC publish time; NYC sees it at 6 AM (too early), Oslo
 *     at 12 PM (too late). One audience always misses the window.
 *  2. Solution — a scheduler dashboard mockup: an hourly check computes each
 *     city's own 10 AM in UTC and marks it "within window" the moment it
 *     matches, publishing right on time for both.
 *  3. How it works — three icon cards (hourly trigger / per-locale 10 AM /
 *     ±15 min match), one small tech-credibility line (Supabase table).
 *  4. Result — before/after cards: 1 UTC time (wrong for someone) → 2 local
 *     10 AMs (right for everyone), 20-30% higher click-through, first hour.
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
  IconCard,
  FlowArrow,
  StickyNote,
  Cursor,
  CheckBadge,
  CaptionBand,
  StatPill,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

/** Small round clock face showing a fixed time, for the "problem" cards. */
const ClockFace: React.FC<{ hour: number; minute: number; tone: "danger" | "accent" | "success" }> = ({ hour, minute, tone }) => {
  const c = tone === "danger" ? B.danger : tone === "success" ? B.success : B.accent;
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const minAngle = minute * 6 - 90;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64">
      <circle cx={32} cy={32} r={30} fill="#fff" stroke={c} strokeWidth={3} />
      <line
        x1={32}
        y1={32}
        x2={32 + 15 * Math.cos((hourAngle * Math.PI) / 180)}
        y2={32 + 15 * Math.sin((hourAngle * Math.PI) / 180)}
        stroke={B.ink}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1={32}
        y1={32}
        x2={32 + 22 * Math.cos((minAngle * Math.PI) / 180)}
        y2={32 + 22 * Math.sin((minAngle * Math.PI) / 180)}
        stroke={c}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx={32} cy={32} r={3} fill={c} />
    </svg>
  );
};

type SchedRow = { city: string; local: string; utc: string };
const ROWS: SchedRow[] = [
  { city: "New York", local: "10:00 AM EDT", utc: "14:00 UTC" },
  { city: "Oslo", local: "10:00 AM CEST", utc: "08:00 UTC" },
];

/** Scheduler dashboard row that appears and ticks to "within window". */
const SchedRowView: React.FC<{ row: SchedRow; t: number; okT: number }> = ({ row, t, okT }) => {
  if (t <= 0.004) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        marginBottom: 10,
        borderRadius: 12,
        background: "#F4F7FC",
        border: `1.5px solid ${B.border}`,
        opacity: Math.min(1, t * 1.6),
        transform: `translateX(${(1 - Math.min(1, t * 1.6)) * 26}px)`,
      }}
    >
      <div style={{ width: 118, fontSize: 15.5, fontWeight: 700, color: B.ink }}>{row.city}</div>
      <div style={{ width: 140, fontSize: 14, fontWeight: 600, color: B.muted }}>{row.local}</div>
      <div style={{ width: 110, fontSize: 14, fontWeight: 600, color: B.muted }}>{row.utc}</div>
      <div style={{ flex: 1, textAlign: "right" }}>
        {okT > 0.01 ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 10px",
              borderRadius: 999,
              background: B.successBg,
              border: `1px solid #BFE7CD`,
              color: B.success,
              fontSize: 13,
              fontWeight: 700,
              opacity: Math.min(1, okT * 1.6),
              transform: `scale(${0.85 + 0.15 * Math.min(1, okT * 1.6)})`,
            }}
          >
            ✓ within window
          </span>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 600, color: B.muted }}>checking…</span>
        )}
      </div>
    </div>
  );
};

export const FeatureTimeZoneTamer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (matches reference clip exactly) ──────────────────
  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: the problem ───────────────────────────────────────────
  const noteOp = seg(frame, 24, 40, Easing.out(Easing.cubic));
  const pill1 = pop(46);
  const pill2 = pop(58);
  const pill3 = pop(70);
  const clocksOp = seg(frame, 20, 36);
  const arrLeft = seg(frame, 30, 46, Easing.inOut(Easing.cubic));
  const arrRight = seg(frame, 30, 46, Easing.inOut(Easing.cubic));

  // ── Beat 2: the solution ──────────────────────────────────────────
  const boardOp = seg(frame, 116, 130);
  const cx = interpolate(frame, [124, 148, 168], [700, 300, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [124, 148, 168], [420, 232, 232], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 124, 132) * (1 - seg(frame, 176, 190));
  const click1 = seg(frame, 148, 162, Easing.out(Easing.quad));
  const row1T = seg(frame, 164, 184, Easing.out(Easing.cubic));
  const row2T = seg(frame, 176, 196, Easing.out(Easing.cubic));
  const ok1 = seg(frame, 188, 204, Easing.out(Easing.cubic));
  const ok2 = seg(frame, 198, 214, Easing.out(Easing.cubic));
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it works ──────────────────────────────────────────
  const card1 = pop(252);
  const card2 = pop(272);
  const card3 = pop(292);
  const arr1 = seg(frame, 262, 278, Easing.inOut(Easing.cubic));
  const arr2 = seg(frame, 282, 298, Easing.inOut(Easing.cubic));
  const cap3 = seg(frame, 300, 316, Easing.out(Easing.cubic));

  // ── Beat 4: the result ─────────────────────────────────────────────
  const beforeIn = seg(frame, 350, 364, Easing.out(Easing.cubic));
  const arrRes = seg(frame, 362, 378, Easing.inOut(Easing.cubic));
  const afterIn = pop(372);
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="One post time can't please" accentText="two timezones" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <div style={{ position: "absolute", left: 0, top: 130, width: 1280, display: "flex", justifyContent: "center", gap: 80, opacity: clocksOp }}>
          <div style={{ position: "static", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <ClockFace hour={6} minute={0} tone="danger" />
            <div style={{ fontSize: 20, fontWeight: 800, color: B.ink }}>New York — 6:00 AM</div>
            <div style={{ fontSize: 15, fontWeight: 650, color: B.danger }}>too early</div>
          </div>
          <div style={{ position: "static", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: 0.85 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: B.muted, letterSpacing: 0.5 }}>ONE POST</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: B.ink }}>10:00 AM UTC</div>
          </div>
          <div style={{ position: "static", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <ClockFace hour={12} minute={0} tone="danger" />
            <div style={{ fontSize: 20, fontWeight: 800, color: B.ink }}>Oslo — 12:00 PM</div>
            <div style={{ fontSize: 15, fontWeight: 650, color: B.danger }}>too late</div>
          </div>
        </div>
        <FlowArrow x={420} y={198} len={100} progress={arrLeft} color={B.danger} />
        <FlowArrow x={760} y={198} len={100} progress={arrRight} color={B.danger} />
        <StickyNote
          x={880}
          y={300}
          w={310}
          opacity={noteOp}
          text="Post once, and someone always sees it at the worst possible time"
        />
        <StatPill x={100} y={430} emoji="🌍" text="2 target audiences" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={100} y={492} emoji="😴" text="NYC misses it at 6 AM" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={100} y={554} emoji="🌙" text="Oslo sees it too late" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="A single UTC time can't be right for two timezones at once" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="A script finds each city's own" accentText="10 AM" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <BrowserWindow x={190} y={196} w={900} h={340} title="vitalii.no — feature scheduler" opacity={boardOp}>
          <div style={{ padding: "20px 24px", fontFamily }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 16px 10px",
                fontSize: 13,
                fontWeight: 700,
                color: B.muted,
                letterSpacing: 0.4,
              }}
            >
              <div style={{ width: 118 }}>LOCALE</div>
              <div style={{ width: 140 }}>TARGET 10 AM</div>
              <div style={{ width: 110 }}>UTC</div>
              <div style={{ flex: 1, textAlign: "right" }}>STATUS</div>
            </div>
            <SchedRowView row={ROWS[0]} t={row1T} okT={ok1} />
            <SchedRowView row={ROWS[1]} t={row2T} okT={ok2} />
            <div
              style={{
                marginTop: 6,
                width: 168,
                height: 36,
                borderRadius: 10,
                background: B.accent,
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Run hourly check
            </div>
          </div>
        </BrowserWindow>
        <Cursor x={cx} y={cy} opacity={cursorOp} click={click1 % 1} />
        <CaptionBand text="Every hour, it converts each city's own 10 AM into UTC and checks for a match" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="One check, every hour," accentText="both cities on time" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="⏰" title="Hourly GitHub Action" sub="runs quietly in the background" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🧮" title="Local 10 AM → UTC" sub="computed per locale" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🎯" title="±15 min match window" sub="then it publishes" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="A TypeScript script checks Supabase's scheduled_posts table once an hour, for every locale"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>1 UTC time</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>always wrong somewhere</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>2 local 10 AMs</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>right on time, every day</div>
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
          <span style={{ fontSize: 44, fontWeight: 800, color: B.success }}>20-30% higher click-through, first hour</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            10 AM in New York. 10 AM in Oslo. Same feature, right on time for both.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no · Feature scheduler</div>
        </div>
      </Group>
    </div>
  );
};
