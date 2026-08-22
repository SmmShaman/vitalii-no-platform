/**
 * FeatureDailyDigest — feature p10 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: a manual-production checklist that eats a whole crew's day, then
 * one automated pipeline that ranks, scripts, voices and renders the same
 * show by itself, with a real-looking segment run-sheet on screen.
 *
 * Story (4 beats):
 *  1. Problem — curate, script, record, edit: a 3-5 person crew, 24-40
 *     man-hours for one 10-minute daily broadcast. Red zone.
 *  2. Solution — daily-video-bot ranks, scripts and voices 10 segments in
 *     one pass; a real-looking run-sheet fills in on its own, zero clicks.
 *  3. How it finishes — Azure OpenAI ranks & scripts, AI voiceover records,
 *     Remotion renders the branded show (one tech-credibility caption).
 *  4. Result — 24-40 man-hours/day → under 10 minutes of compute,
 *     ≈140× less manual work. Green zone, check badge.
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

const TASKS: { emoji: string; label: string; time: string }[] = [
  { emoji: "🗞️", label: "Curate today's top stories", time: "60-90 min" },
  { emoji: "✍️", label: "Write 10 sixty-second scripts", time: "3-4 hrs" },
  { emoji: "🎙️", label: "Record voiceover for every segment", time: "2-3 hrs" },
  { emoji: "✂️", label: "Edit, add transitions, export", time: "4-6 hrs" },
];

type SegRow = { headline: string; len: string; status: string; statusTone?: "accent" | "success" };

const SEGMENTS: SegRow[] = [
  { headline: "OpenAI ships a faster coding model", len: "58s", status: "Voiced", statusTone: "success" },
  { headline: "EU tightens AI Act enforcement", len: "61s", status: "Voiced", statusTone: "success" },
  { headline: "Nvidia unveils next-gen GPU line", len: "55s", status: "Scripted" },
  { headline: "Robotics startup raises $40M round", len: "60s", status: "Scripted" },
  { headline: "Cloud outage hits three continents", len: "57s", status: "Ranked" },
];

export const FeatureDailyDigest: React.FC = () => {
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
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it finishes ────────────────────────────────────────
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
  const speedX = Math.round(interpolate(frame, [384, 414], [1, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="Producing one daily video news show needs" accentText="24-40 man-hours" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="daily show — manual production checklist" opacity={Math.min(1, pop(8))}>
          <div style={{ padding: "8px 0" }}>
            {TASKS.map((t, i) => {
              const start = 20 + i * 16;
              const op = seg(frame, start, start + 16);
              return (
                <div
                  key={t.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "22px 26px",
                    borderBottom: `1px solid ${B.border}`,
                    opacity: op,
                    transform: `translateY(${(1 - op) * 16}px)`,
                  }}
                >
                  <div style={{ fontSize: 34 }}>{t.emoji}</div>
                  <div style={{ flex: 1, fontSize: 19, fontWeight: 700, color: B.ink }}>{t.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: B.danger, whiteSpace: "nowrap" }}>{t.time}</div>
                </div>
              );
            })}
          </div>
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="Need: a 10-minute daily news broadcast — curated, scripted, voiced and edited. Every single day."
        />
        <StatPill x={846} y={340} emoji="👥" text="3-5 person crew" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="⏱️" text="24-40 man-hours a day" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="😩" text="Unsustainable, solo" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="Curating, scripting, recording, editing — a full crew, every single day" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="One pipeline runs the whole show in" accentText="under 10 minutes" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <FilterChip x={110} y={132} text="Rank stories" icon="✓" scale={chip1} opacity={Math.min(1, chip1)} />
        <FilterChip x={330} y={132} text="Write scripts" icon="✓" scale={chip2} opacity={Math.min(1, chip2)} />
        <FilterChip x={560} y={132} text="Add voice" icon="✓" scale={chip3} opacity={Math.min(1, chip3)} />
        <FilterChip x={780} y={132} text="Stitch video" icon="✓" scale={chip4} opacity={Math.min(1, chip4)} />
        <BrowserWindow x={110} y={196} w={1060} h={396} title="daily-video-bot — today's run" opacity={seg(frame, 168, 182)}>
          <div style={{ width: 1060, fontFamily }}>
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
              <div style={{ width: 1060 * 0.06 }}>#</div>
              <div style={{ width: 1060 * 0.56 }}>Segment</div>
              <div style={{ width: 1060 * 0.14 }}>Length</div>
              <div style={{ width: 1060 * 0.2 }}>Status</div>
            </div>
            {SEGMENTS.map((s, i) => {
              const t = seg(frame, 184 + i * 7, 184 + i * 7 + 12);
              return (
                <div
                  key={s.headline}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 18px",
                    gap: 14,
                    borderBottom: `1px solid ${B.border}`,
                    fontSize: 15.5,
                    color: B.ink,
                    opacity: t,
                    transform: `translateX(${(1 - t) * 26}px)`,
                  }}
                >
                  <div style={{ width: 1060 * 0.06 - 14, color: B.muted, fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ width: 1060 * 0.56 - 14, fontWeight: 600, overflow: "hidden", whiteSpace: "nowrap" }}>{s.headline}</div>
                  <div style={{ width: 1060 * 0.14 - 14, color: B.muted, fontWeight: 500 }}>{s.len}</div>
                  <div style={{ width: 1060 * 0.2 - 14 }}>
                    <span
                      style={{
                        padding: "2.5px 10px",
                        borderRadius: 999,
                        fontSize: 13.5,
                        fontWeight: 600,
                        background: s.statusTone === "success" ? B.successBg : B.accentBg,
                        border: `1px solid ${s.statusTone === "success" ? "#BFE7CD" : "#C4D7FB"}`,
                        color: s.statusTone === "success" ? B.success : B.accent,
                      }}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
            …all 10 segments ranked, scripted and voiced automatically
          </div>
        </BrowserWindow>
        <CaptionBand text="Stories ranked, scripts written, voices recorded — one pipeline, zero manual steps" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT FINISHES ════ */}
      <Group opacity={b3}>
        <Headline text="Then it renders the final broadcast" accentText="automatically" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🤖" title="Azure OpenAI ranks & scripts" sub="10 stories → 10 scripts" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🎙️" title="Natural-sounding voiceover" sub="every segment, fully voiced" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🎬" title="Renders the branded show" sub="intro, transitions, end card" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: Remotion (React) stitches every asset into one branded broadcast"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>24-40 hrs</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>3-5 person crew, daily</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>&lt;10 min</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>fully automated, solo</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>≈{speedX}× less manual work</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            One tap ranks, scripts, voices and renders — the same broadcast, every day.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>Daily Video Digest · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
