/**
 * FeatureCascadingImageProviders — feature p24 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 * BRIGHT INFOGRAPHIC template (v2, 2026-08-22) — written for a NON-TECHNICAL
 * viewer: problem/solution color zones, a real feed mockup, a two-provider
 * hand-off, and a big before→after success-rate meter.
 *
 * Story (4 beats):
 *  1. Problem — one AI image provider is a coin-flip: 4 recent attempts, one
 *     dead on arrival (rate limited). ~25% failure rate, manual retries
 *     every day. Red zone.
 *  2. Solution — every image tries Plan A first (Grok), and if it stalls
 *     past a hard timeout, Plan B (Gemini) picks it up automatically. No
 *     retry button, no waiting.
 *  3. How it stays reliable — every attempt is logged per provider, the
 *     cascade order can be changed live from the admin panel, and the
 *     worst performer quietly drops to the back. One tech-credibility line
 *     (40-second Promise.race timeout).
 *  4. Result — before/after cards: ~75% success → 98%+ success, visualized
 *     as a filling meter. Green zone, check badge.
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
  StatPill,
  CheckBadge,
  CaptionBand,
  seg,
  loopFade,
  fontFamily,
} from "./bright-primitives";

type Attempt = { title: string; outcome: "success" | "fail"; reason: string };

const ATTEMPTS: Attempt[] = [
  { title: "AI chip shortage deepens", outcome: "fail", reason: "Rate limited" },
  { title: "New JS framework ships v2", outcome: "success", reason: "Generated" },
  { title: "Cloud outage hits EU banks", outcome: "success", reason: "Generated" },
  { title: "Startup raises Series B", outcome: "success", reason: "Generated" },
];

export const FeatureCascadingImageProviders: React.FC = () => {
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

  // ── Beat 2: the solution ──────────────────────────────────────────
  const cardA = pop(132);
  const cardB = pop(158);
  const arrAB = seg(frame, 140, 156, Easing.inOut(Easing.cubic));
  const timeoutPill = pop(176);
  const cap2 = seg(frame, 196, 212, Easing.out(Easing.cubic));

  // ── Beat 3: how it stays reliable ─────────────────────────────────
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
  const pctNow = Math.round(
    interpolate(frame, [384, 414], [75, 98], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );
  const meterOp = seg(frame, 384, 398, Easing.out(Easing.cubic));
  const check = pop(392);
  const footOp = seg(frame, 402, 418);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ Beat 1 — PROBLEM ════ */}
      <Group opacity={b1}>
        <Headline text="One AI image provider is" accentText="a coin-flip" accentColor={B.danger} opacity={seg(frame, 4, 18)} />
        <BrowserWindow x={80} y={124} w={660} h={430} title="image generator — Grok only" opacity={Math.min(1, pop(8))}>
          {ATTEMPTS.map((a, i) => {
            const t = seg(frame, 24 + i * 12, 24 + i * 12 + 14);
            const fail = a.outcome === "fail";
            return (
              <div
                key={a.title}
                style={{
                  position: "absolute",
                  left: 20,
                  top: 16 + i * 96,
                  width: 620,
                  height: 82,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 18px",
                  borderRadius: 14,
                  background: fail ? B.dangerBg : B.successBg,
                  border: `1.5px solid ${fail ? "#F3C2C7" : "#BFE7CD"}`,
                  opacity: t,
                  transform: `translateX(${(1 - t) * 24}px)`,
                }}
              >
                <div style={{ fontSize: 30 }}>{fail ? "🚫" : "🖼️"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: B.ink }}>{a.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: fail ? B.danger : B.success, marginTop: 3 }}>
                    {fail ? "❌ " : "✅ "}
                    {a.reason}
                  </div>
                </div>
              </div>
            );
          })}
        </BrowserWindow>
        <StickyNote
          x={780}
          y={150}
          w={380}
          opacity={noteOp}
          text="Grok rate-limited, Gemini sometimes flagged, Together AI a coin toss — every fourth image just didn't happen"
        />
        <StatPill x={796} y={392} emoji="🎲" text="~25% failure rate" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
        <StatPill x={796} y={454} emoji="😤" text="Manual retries, every day" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        <CaptionBand text="One provider meant a coin-flip on every image generation" tone="danger" opacity={seg(frame, 30, 46)} />
      </Group>

      {/* ════ Beat 2 — SOLUTION ════ */}
      <Group opacity={b2}>
        <Headline text="So every image tries" accentText="Plan A, then Plan B" accentColor={B.success} opacity={seg(frame, 116, 130)} />
        <IconCard x={260} y={190} w={320} emoji="🚀" title="Grok tries first" sub="every single call" tone="accent" scale={cardA} opacity={Math.min(1, cardA)} />
        <IconCard x={700} y={190} w={320} emoji="🛟" title="Gemini steps in" sub="automatic fallback" tone="success" scale={cardB} opacity={Math.min(1, cardB)} />
        <FlowArrow x={594} y={234} len={92} progress={arrAB} color={B.accent} />
        <StatPill x={330} y={344} emoji="⏱️" text="40s timeout on every call" tone="accent" scale={timeoutPill} opacity={Math.min(1, timeoutPill)} />
        <CaptionBand text="Every call is wrapped in a hard timeout — if Grok stalls, Gemini takes over instantly" tone="accent" opacity={cap2} />
      </Group>

      {/* ════ Beat 3 — HOW IT STAYS RELIABLE ════ */}
      <Group opacity={b3}>
        <Headline text="And it keeps" accentText="getting smarter" accentColor={B.accent} opacity={seg(frame, 240, 254)} />
        <IconCard x={110} y={218} w={300} emoji="🗄️" title="Every attempt logged" sub="success/failure, per provider" tone="accent" scale={card1} opacity={Math.min(1, card1)} />
        <IconCard x={490} y={218} w={300} emoji="🎛️" title="Reorder the cascade live" sub="from the admin panel" tone="accent" scale={card2} opacity={Math.min(1, card2)} />
        <IconCard x={870} y={218} w={300} emoji="🔁" title="Worst performer drops back" sub="the cascade adapts itself" tone="success" scale={card3} opacity={Math.min(1, card3)} />
        <FlowArrow x={412} y={262} len={76} progress={arr1} />
        <FlowArrow x={792} y={262} len={76} progress={arr2} color={B.success} />
        <CaptionBand
          text="Under the hood: each provider call wrapped in a 40-second Promise.race timeout"
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
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>~75% success</div>
            <div style={{ fontSize: 24, fontWeight: 650, color: B.muted, marginTop: 6 }}>one provider, no fallback</div>
          </div>
        </Panel>
        <FlowArrow x={560} y={264} len={150} progress={arrRes} color={B.success} />
        <Panel x={740} y={170} w={400} h={210} tone="success" opacity={Math.min(1, afterIn)}>
          <div style={{ padding: "26px 30px", transform: `scale(${0.9 + 0.1 * Math.min(1, afterIn)})`, transformOrigin: "center", fontFamily }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: B.success, letterSpacing: 1 }}>NOW</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, marginTop: 14 }}>98%+ success</div>
            <div style={{ fontSize: 24, fontWeight: 650, color: B.muted, marginTop: 6 }}>Grok → Gemini, automatically</div>
          </div>
        </Panel>
        <div style={{ position: "absolute", left: 340, top: 424, width: 600, opacity: meterOp, fontFamily }}>
          <div style={{ width: 600, height: 20, borderRadius: 999, background: B.dangerBg, border: `1.5px solid #F3C2C7`, overflow: "hidden" }}>
            <div style={{ width: `${pctNow}%`, height: "100%", borderRadius: 999, background: B.success }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 14 }}>
            <div style={{ position: "relative", width: 44, height: 44 }}>
              <CheckBadge x={0} y={0} size={44} scale={check} opacity={Math.min(1, check)} />
            </div>
            <span style={{ fontSize: 40, fontWeight: 800, color: B.success }}>{pctNow}% of images generate successfully</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 570, width: 1280, textAlign: "center", opacity: footOp, fontFamily }}>
          <div style={{ fontSize: 22, fontWeight: 650, color: B.muted }}>
            Reordered live from the admin panel — zero code, zero redeploy.
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: B.accent, marginTop: 12 }}>vitalii.no</div>
        </div>
      </Group>
    </div>
  );
};
