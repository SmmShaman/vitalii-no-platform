/**
 * FeatureLiveDashboard — feature j30 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2) — rebuilt 2026-08-26 from the dark v1 clip.
 *
 * Story (4 beats):
 *  1. Problem — the scanner finds 5-10 jobs every 15 minutes, but the page stayed
 *     frozen until you pressed F5. Every reload cost 3-5 seconds, and between two
 *     reloads an "apply today" posting could come and go unseen. Red.
 *  2. Solution — the list behaves like a chat feed: new rows slide in by
 *     themselves, 1-2 seconds after the backend finds them. No key pressed.
 *  3. How it works — a job is written to the database → pushed down an open
 *     connection → appears in the list. Tech line: Supabase Realtime WebSocket.
 *  4. Result — F5 every few minutes → zero refreshes, 5-10 minutes saved per
 *     session. Green zone.
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
  JobsTable,
  JobRow,
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

const STALE: JobRow[] = [
  { role: "QA Engineer", company: "QualityFirst", city: "Gjøvik", score: 72, source: "LinkedIn", status: "Seen" },
  { role: "Support Engineer", company: "HelpDesk AS", city: "Hamar", score: 64, source: "FINN", status: "Seen" },
  { role: "Junior Developer", company: "StartLab", city: "Lillehammer", score: 61, source: "Indeed", status: "Seen" },
];

const LIVE: JobRow[] = [
  { role: "Frontend Developer", company: "TechCorp", city: "Gjøvik", score: 92, source: "FINN", status: "New" },
  { role: "Backend Developer", company: "DataSolve", city: "Gjøvik", score: 88, source: "LinkedIn", status: "New" },
  { role: "Fullstack Developer", company: "InnoWare", city: "Gjøvik", score: 85, source: "FINN", status: "New" },
  { role: "DevOps Engineer", company: "CloudNet", city: "Hamar", score: 80, source: "Indeed", status: "New" },
  { role: "QA Engineer", company: "QualityFirst", city: "Gjøvik", score: 72, source: "LinkedIn", status: "Seen", statusTone: "success" },
];

/** The "press F5" key cap that keeps getting hit in beat 1. */
const KeyCap: React.FC<{ x: number; y: number; press: number; opacity?: number }> = ({ x, y, press, opacity = 1 }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 108,
        height: 92,
        borderRadius: 14,
        background: B.card,
        border: `2px solid ${B.border}`,
        boxShadow: `0 ${8 - 6 * press}px ${18 - 10 * press}px rgba(22,35,63,0.18)`,
        transform: `translateY(${press * 5}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 34,
        fontWeight: 800,
        color: press > 0.5 ? B.danger : B.ink,
        opacity,
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      F5
    </div>
  );
};

export const FeatureLiveDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 0, 10) * (1 - seg(frame, 104, 118)) * lf;
  const b2 = seg(frame, 112, 126) * (1 - seg(frame, 228, 242)) * lf;
  const b3 = seg(frame, 236, 250) * (1 - seg(frame, 332, 346)) * lf;
  const b4 = seg(frame, 340, 354) * lf;

  // ── Beat 1: the stale page ────────────────────────────────────────
  // F5 gets pressed three times; each press dims the window (a reload).
  const pressAt = [30, 58, 86];
  const press = Math.max(...pressAt.map((p) => seg(frame, p, p + 5) * (1 - seg(frame, p + 5, p + 13))));
  const reloadDim = press * 0.55;
  const noteOp = seg(frame, 22, 38, Easing.out(Easing.cubic));
  const pill1 = pop(44);
  const pill2 = pop(62);
  const pill3 = pop(80);

  // ── Beat 2: rows arrive on their own ──────────────────────────────
  const winIn = seg(frame, 126, 140, Easing.out(Easing.cubic));
  // Rows start landing right after the window settles — waiting until 158 left a
  // visibly empty green box on screen for half a second.
  const badgeCount = frame < 146 ? 0 : frame < 164 ? 1 : frame < 182 ? 2 : frame < 200 ? 3 : 4;
  const badgeIn = pop(146);
  // a soft green flash each time a row lands
  const landFlash = Math.max(
    ...[146, 164, 182, 200].map((f) => seg(frame, f, f + 4) * (1 - seg(frame, f + 4, f + 14))),
  );
  const secs = interpolate(frame, [140, 216], [0, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = seg(frame, 206, 220, Easing.out(Easing.cubic));

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
  const minutes = Math.round(
    interpolate(frame, [384, 414], [0, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }),
  );
  const minOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="New jobs were already there —" accentText="the page just didn't say so" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={140} w={700} h={420} title="jobbot — my jobs (last loaded 14 minutes ago)" opacity={Math.min(1, pop(8))}>
          <div style={{ position: "relative", width: 700, height: 378 }}>
            <JobsTable w={700} rows={STALE} frame={frame} appearStart={12} stagger={6} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#16233F",
                opacity: reloadDim * 0.22,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 250,
                width: 700,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 650,
                color: B.muted,
                opacity: seg(frame, 20, 34) * 0.85,
                fontFamily,
              }}
            >
              Nothing new here… as far as this page knows.
            </div>
          </div>
        </BrowserWindow>
        <KeyCap x={846} y={150} press={press} opacity={seg(frame, 18, 30)} />
        <StickyNote
          x={830}
          y={262}
          w={350}
          opacity={noteOp}
          text="The scanner finds 5-10 new jobs every 15 minutes — you just can't see them until you reload"
        />
        <StatPill x={846} y={430} emoji="⌨️" text="F5 every few minutes" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={492} emoji="⏳" text="3-5 seconds per reload" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={554} emoji="😖" text="Missed same-day openings" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="A live job hunt behind a page that only updates when you ask it to" tone="danger" opacity={seg(frame, 90, 102)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Now the jobs" accentText="arrive by themselves" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <BrowserWindow x={110} y={182} w={860} h={396} title="jobbot — my jobs · live" opacity={winIn}>
          <div style={{ position: "relative", width: 860, height: 354 }}>
            <div style={{ position: "absolute", inset: 0, background: B.success, opacity: landFlash * 0.09 }} />
            <JobsTable w={860} rows={LIVE} frame={frame} appearStart={146} stagger={18} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 290,
                width: 860,
                textAlign: "center",
                fontSize: 16.5,
                fontWeight: 600,
                color: B.muted,
                opacity: seg(frame, 214, 228) * 0.9,
                fontFamily,
              }}
            >
              No key pressed. No page reload. The list simply grew.
            </div>
          </div>
        </BrowserWindow>
        <Panel x={1000} y={214} w={190} h={116} tone="success" opacity={Math.min(1, badgeIn)}>
          <div style={{ padding: "16px 18px", textAlign: "center", fontFamily }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: B.success }}>+{badgeCount}</div>
            <div style={{ fontSize: 15.5, fontWeight: 650, color: B.muted, marginTop: 2 }}>new since you looked</div>
          </div>
        </Panel>
        <Panel x={1000} y={352} w={190} h={116} tone="accent" opacity={winIn}>
          <div style={{ padding: "16px 18px", textAlign: "center", fontFamily }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.accent }}>{secs.toFixed(1)}s</div>
            <div style={{ fontSize: 15.5, fontWeight: 650, color: B.muted, marginTop: 2 }}>from found to on screen</div>
          </div>
        </Panel>
        <CaptionBand text="Like a chat feed — a new message just appears, you never refresh a chat" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="An open line" accentText="between you and the scanner" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🔎" title="The scanner finds a job" sub="5-10 every 15 minutes" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="📡" title="It's pushed straight to you" sub="down a connection kept open" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="📋" title="The row slides into the list" sub="and only yours — never anyone else's" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: a Supabase Realtime WebSocket on the jobs table, row-level secured, updates batched every 2 seconds"
          opacity={cap3}
          fontSize={20}
          y={580}
        />
      </Group>

      {/* ════ Beat 4 — RESULT ════ */}
      <Group opacity={b4}>
        <Headline text="The payoff" opacity={seg(frame, 344, 358)} />
        <Panel x={140} y={170} w={400} h={210} tone="danger" opacity={beforeIn}>
          <div style={{ padding: "26px 30px", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.danger, letterSpacing: 1 }}>BEFORE</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>F5, again</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>every few minutes</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>0 refreshes</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>new jobs in 1-2 seconds</div>
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
            opacity: minOp,
            fontFamily,
          }}
        >
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <CheckBadge x={0} y={0} size={52} scale={check} opacity={Math.min(1, check)} />
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>up to {minutes} min saved per session</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            The "apply today" posting no longer slips past you between two reloads.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>JobBot · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
