/**
 * FeatureMultiLlm — feature p07 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-21) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real settings-panel mockup, and a
 * big before→after metric.
 *
 * Story (4 beats):
 *  1. Problem — a January outage: Azure OpenAI goes dark for 4 hours and
 *     every dependent job (spam filter, translations, image prompts) stops
 *     with it. Red zone, a status panel full of "STOPPED" badges.
 *  2. Solution — an admin panel with 4 AI providers; the moment Azure goes
 *     quiet, traffic reroutes to Gemini automatically, no clicks needed.
 *  3. How it works — one router tries providers in priority order; image
 *     generation cascades too (Grok for creative prompts, Gemini for
 *     technical illustrations). One small tech-credibility line
 *     (LLMProviderService in Supabase, live-edited priorities).
 *  4. Result — before/after cards: 1 vendor / 4-hour outage → 4 vendors /
 *     zero downtime since. Green zone, check badge.
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

type JobRow = { name: string; stopped: boolean };
const JOBS: JobRow[] = [
  { name: "Spam filter (pre-moderation)", stopped: true },
  { name: "Article rewrite — EN / NO / UA", stopped: true },
  { name: "Image prompt generation", stopped: true },
];

type ProviderRow = { name: string; status: string; tone: "danger" | "success" | "accent" };
const PROVIDERS: ProviderRow[] = [
  { name: "Azure OpenAI", status: "Down — skipped automatically", tone: "danger" },
  { name: "Google Gemini", status: "Active — now serving requests", tone: "success" },
  { name: "Grok (XAI)", status: "Standby", tone: "accent" },
  { name: "Groq", status: "Standby", tone: "accent" },
];

/** Status panel: 3 pipeline jobs, all stopped, with a ticking outage timer. */
const StatusPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const timerMin = Math.min(252, Math.floor((frame - 20) * 0.9));
  const h = Math.max(0, Math.floor(timerMin / 60));
  const m = Math.max(0, timerMin % 60);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 700, fontFamily }}>
      <div
        style={{
          margin: "18px 20px 6px",
          padding: "10px 16px",
          borderRadius: 10,
          background: B.dangerBg,
          border: `1.5px solid #F3C2C7`,
          fontSize: 15.5,
          fontWeight: 700,
          color: B.danger,
          opacity: seg(frame, 16, 30),
        }}
      >
        ⚠ Azure OpenAI: no response — outage {h}h {m.toString().padStart(2, "0")}m
      </div>
      {JOBS.map((j, i) => {
        const t = seg(frame, 34 + i * 12, 46 + i * 12);
        return (
          <div
            key={j.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              margin: "0 20px",
              padding: "13px 18px",
              borderBottom: `1px solid ${B.border}`,
              opacity: t,
              transform: `translateX(${(1 - t) * 24}px)`,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 650, color: B.ink }}>{j.name}</div>
            <span
              style={{
                padding: "3px 12px",
                borderRadius: 999,
                fontSize: 13.5,
                fontWeight: 700,
                background: B.dangerBg,
                border: `1px solid #F3C2C7`,
                color: B.danger,
              }}
            >
              STOPPED
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** Admin panel: 4 providers with live status pills, staggered entrance. */
const ProvidersTable: React.FC<{ w: number; frame: number; appearStart: number; stagger?: number }> = ({
  w,
  frame,
  appearStart,
  stagger = 10,
}) => {
  const toneColor = (t: ProviderRow["tone"]) => (t === "danger" ? B.danger : t === "success" ? B.success : B.accent);
  const toneBg2 = (t: ProviderRow["tone"]) => (t === "danger" ? B.dangerBg : t === "success" ? B.successBg : B.accentBg);
  const toneEdge2 = (t: ProviderRow["tone"]) => (t === "danger" ? "#F3C2C7" : t === "success" ? "#BFE7CD" : "#C4D7FB");
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, fontFamily }}>
      <div
        style={{
          display: "flex",
          padding: "10px 24px",
          gap: 14,
          background: "#F4F7FC",
          borderBottom: `1.5px solid ${B.border}`,
          fontSize: 14,
          fontWeight: 700,
          color: B.muted,
          letterSpacing: 0.4,
        }}
      >
        <div style={{ width: w * 0.32 }}>Provider</div>
        <div style={{ width: w * 0.5 }}>Status</div>
        <div style={{ width: w * 0.15 }}>Priority</div>
      </div>
      {PROVIDERS.map((p, i) => {
        const t = seg(frame, appearStart + i * stagger, appearStart + i * stagger + 14);
        const highlight = p.tone === "success" ? interpolate(frame, [appearStart + i * stagger + 20, appearStart + i * stagger + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        return (
          <div
            key={p.name}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "13px 24px",
              gap: 14,
              borderBottom: `1px solid ${B.border}`,
              fontSize: 16,
              color: B.ink,
              opacity: t,
              transform: `translateX(${(1 - t) * 26}px)`,
              background: p.tone === "success" ? `rgba(24,154,74,${0.08 * highlight})` : undefined,
            }}
          >
            <div style={{ width: w * 0.32, fontWeight: 700 }}>{p.name}</div>
            <div style={{ width: w * 0.5 }}>
              <span
                style={{
                  padding: "3px 12px",
                  borderRadius: 999,
                  fontSize: 13.5,
                  fontWeight: 650,
                  background: toneBg2(p.tone),
                  border: `1px solid ${toneEdge2(p.tone)}`,
                  color: toneColor(p.tone),
                }}
              >
                {p.status}
              </span>
            </div>
            <div style={{ width: w * 0.15, fontWeight: 700, color: B.muted }}>#{i + 1}</div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureMultiLlm: React.FC = () => {
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
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it works ───────────────────────────────────────────
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
  const providerCount = Math.round(
    interpolate(frame, [384, 414], [1, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
  );
  const speedOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="One vendor down," accentText="whole pipeline dead" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={116} w={700} h={452} title="content pipeline — status" opacity={Math.min(1, pop(8))}>
          <StatusPanel frame={frame} />
        </BrowserWindow>
        <StickyNote
          x={830}
          y={150}
          w={350}
          opacity={noteOp}
          text="January: Azure OpenAI went down for 4 hours — everything that depends on it just... stopped"
        />
        <StatPill x={846} y={340} emoji="🔌" text="1 vendor, 1 point of failure" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={846} y={402} emoji="⏱️" text="4-hour outage" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <StatPill x={846} y={464} emoji="📭" text="Zero articles published" tone="danger" scale={pill3} opacity={Math.min(1, pill3)} />
        <CaptionBand text="A single vendor outage took the entire content pipeline down with it" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="Now it just" accentText="routes around the problem" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <BrowserWindow x={110} y={150} w={1060} h={442} title="admin panel — AI providers" opacity={seg(frame, 122, 136)}>
          <ProvidersTable w={1060} frame={frame} appearStart={140} stagger={16} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 320,
              width: 1060,
              textAlign: "center",
              fontSize: 15.5,
              fontWeight: 600,
              color: B.muted,
              opacity: seg(frame, 214, 228) * 0.9,
            }}
          >
            …no code deploy needed — priorities are edited live, right here
          </div>
        </BrowserWindow>
        <CaptionBand text="The moment Azure goes quiet, traffic reroutes automatically — no one has to click anything" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT WORKS ════ */}
      <Group opacity={b3}>
        <Headline text="One router," accentText="four vendors" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🔀" title="Tries providers in priority order" sub="Azure → Gemini → Grok → Groq" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🎨" title="Grok writes creative prompts" sub="image generation, stage 1" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🔬" title="Gemini handles technical shots" sub="image generation, stage 2" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: one LLMProviderService in Supabase, priorities edited live from the admin panel"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>1 vendor</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>4-hour outage, everything stopped</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>4 vendors</div>
            <div style={{ fontSize: 26, fontWeight: 650, color: B.muted, marginTop: 6 }}>zero downtime since</div>
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
          <span style={{ fontSize: 52, fontWeight: 800, color: B.success }}>{providerCount} vendors, 0 outages</span>
        </div>
        <div style={{ position: "absolute", left: 0, top: 540, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Priorities change live in the admin panel — never a redeploy.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>LLMProviderService · vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
