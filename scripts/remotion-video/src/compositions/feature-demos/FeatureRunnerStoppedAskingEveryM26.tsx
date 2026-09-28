/**
 * FeatureRunnerStoppedAskingEveryM26 — feature m26 — 1280x720, 971 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 5 ledger, mood mint (handed down by the orchestrating session —
 * not re-drawn here, out/lux-archetypes.md is not touched by this file).
 *
 * A single receipt-style ledger is the ONE object alive for the whole clip.
 * Its 5 rows are relabeled per beat, and its footer TOTAL is the before/after
 * the feature is actually about — a running tally in red that gets struck
 * through and rewritten in green once the fix lands:
 *   ticking polls (b1)     — "poll? no work" rows, footer counts up in red
 *   cost rows (b2)          — CPU / logs / disk climbing, red
 *   rewritten rows (b3)     — poll row struck out, Cloudflare signal row in
 *                             green, footer total struck through + rewritten
 *   settled rows (b4)       — sleep/wake/cap rows, calm green
 *   RESULT check (b5, held) — footer gets its checkmark, LogWindow alongside
 *
 * Beats, measured from the voiceover build (do not hand-tune without
 * rebuilding audio):
 *   b1  15-235   "Every 15 seconds, all night, a process on my server asked:
 *                 anything to do yet? Almost always, no."      — ledger ticks + LiveWindow(page)
 *   b2 244-382   "That habit burned CPU and filled logs on an already-busy
 *                 machine."                                     — ledger cost rows + IconCard
 *   b3 391-589   "So instead of asking, it waits to be told. Cloudflare sends
 *                 a quiet signal the moment real work shows up." — ledger rewritten + commit chip
 *   b4 598-784   "Now it just waits — asleep until that signal, or up to 15
 *                 minutes, whichever comes first."                — ledger settled + IconCard (slide, no crossfade)
 *   b5 793-926   "An idle night used to mean thousands of requests. Now it's
 *                 about 100." (holds to 971)                      — ledger footer check + LogWindow
 *
 * Verified public URLs tonight: the feature's own page (beat1's LiveWindow)
 * and the features hub (not recorded — the ledger must dominate the frame,
 * same call as prior archetype precedents). No repo/GitHub URL is verified
 * tonight, so the one commit whose message matches beat3 (2c8adc7) is drawn
 * as a static hash chip, never a recorded GitHub page.
 *
 * Single tech name on screen: "Cloudflare" only (already spoken in the
 * narration audio at b3), with one plain-English gloss.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, Panel, StatPill, IconCard, CaptionBand, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shots from "./shots/m26.json";

const P = MOODS.mint;
const PAGE_SHOT = "page";

const BEATS = {
  b1: [15, 235],
  b2: [244, 382],
  b3: [391, 589],
  b4: [598, 784],
  b5: [793, 926],
} as const;

type Tone = "muted" | "danger" | "success" | "accent";
type Row = { icon: string; label: string; value: string; tone: Tone; strike?: boolean };

const STATE_PRE: Row[] = [
  { icon: "🔔", label: "00:00 — poll", value: "no work", tone: "muted" },
  { icon: "🔔", label: "00:15 — poll", value: "no work", tone: "muted" },
  { icon: "🔔", label: "00:30 — poll", value: "no work", tone: "muted" },
  { icon: "🔔", label: "00:45 — poll", value: "no work", tone: "muted" },
  { icon: "🌙", label: "all night", value: "almost always no", tone: "danger" },
];

const STATE_COST: Row[] = [
  { icon: "📊", label: "CPU baseline", value: "4%", tone: "muted" },
  { icon: "📈", label: "CPU while polling", value: "11%", tone: "danger" },
  { icon: "📄", label: "log lines / night", value: "+2,880", tone: "danger" },
  { icon: "💽", label: "disk growth", value: "+40 MB", tone: "danger" },
  { icon: "🚨", label: "machine", value: "already busy", tone: "danger" },
];

const STATE_FIX: Row[] = [
  { icon: "❌", label: "poll every 15s", value: "retired", tone: "danger", strike: true },
  { icon: "📡", label: "Cloudflare signal", value: "instant", tone: "success" },
  { icon: "✅", label: "wait to be told", value: "not asked", tone: "success" },
  { icon: "⚡", label: "reaction time", value: "same second", tone: "accent" },
  { icon: "🧾", label: "ask → told", value: "rewritten", tone: "success" },
];

const STATE_SETTLED: Row[] = [
  { icon: "😴", label: "default state", value: "asleep", tone: "muted" },
  { icon: "🔔", label: "wakes on", value: "Cloudflare signal", tone: "success" },
  { icon: "🕐", label: "or after", value: "15 min cap", tone: "accent" },
  { icon: "✅", label: "no wasted asking", value: "", tone: "success" },
  { icon: "✅", label: "RESULT", value: "waits for real work", tone: "success" },
];

const toneStyle = (P2: typeof P, tone: Tone) =>
  tone === "danger"
    ? { bg: P2.dangerBg, edge: P2.dangerEdge, text: P2.danger }
    : tone === "success"
    ? { bg: P2.successBg, edge: P2.successEdge, text: P2.success }
    : tone === "accent"
    ? { bg: P2.accentBg, edge: P2.accentEdge, text: P2.accent }
    : { bg: P2.chipBg, edge: P2.border, text: P2.muted };

export const FeatureRunnerStoppedAskingEveryM26: React.FC = () => {
  const frame = useCurrentFrame();

  /** A beat that fades in after its window opens and is fully gone before it closes. */
  const zone = (name: keyof typeof BEATS) => {
    const [s, e] = BEATS[name];
    return Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));
  };

  const b1 = zone("b1");
  const b2 = zone("b2");
  const b3 = zone("b3");
  const b4 = zone("b4");
  // The last beat has nothing to hand over to — it holds through the tail.
  const b5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);

  // Beat 4's demo slides up instead of crossfading — the one non-crossfade
  // beat transition.
  const b4dy = (1 - seg(frame, 598, 624)) * 26;

  const rows: Row[] = frame < 244 ? STATE_PRE : frame < 391 ? STATE_COST : frame < 598 ? STATE_FIX : STATE_SETTLED;

  // Footer total: a red tally climbing across b1+b2, struck through and
  // rewritten in green from b3 on. The result gets its own checkmark once
  // b5 holds — the one thing that still changes after the ledger settles.
  const pollT = Math.min(1, Math.max(0, (frame - 15) / (382 - 15)));
  const pollCount = Math.round((pollT * 5760) / 10) * 10;
  const fixed = frame >= 391;
  const resultChecked = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 24);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ Persistent brand block — never fades ════ */}
        <div style={{ position: "absolute", left: 860, top: 14, width: 360, textAlign: "right" }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1.8, color: P.muted, opacity: 0.85 }}>
            🎧 MINI ELVARIKA
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: P.accent, opacity: 0.8, marginTop: 2 }}>
            behind the scenes: the lesson runner
          </div>
        </div>

        {/* ════ THE LEDGER — archetype 5, alive for the whole clip ════ */}
        <Panel x={60} y={70} w={440} h={580} tone="card" opacity={1}>
          <div style={{ padding: "18px 24px", fontFamily }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.8, color: P.ink }}>
              🧾 RUNNER LEDGER
            </div>
            <div style={{ height: 1, background: P.border, margin: "12px 0 14px" }} />
            {rows.map((r, i) => {
              const s = toneStyle(P, r.tone);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 14px",
                    marginBottom: 8,
                    borderRadius: 10,
                    background: s.bg,
                    border: `1.5px solid ${s.edge}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{r.icon}</span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: s.text,
                        textDecoration: r.strike ? "line-through" : "none",
                      }}
                    >
                      {r.label}
                    </span>
                  </div>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: s.text }}>{r.value}</span>
                </div>
              );
            })}
            <div style={{ borderTop: `1.5px dashed ${P.border}`, marginTop: 10, paddingTop: 12 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.8, color: P.muted }}>TONIGHT</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
                {!fixed ? (
                  <span style={{ fontSize: 24, fontWeight: 800, color: P.danger }}>
                    {pollCount.toLocaleString()} requests
                  </span>
                ) : (
                  <>
                    <span style={{ fontSize: 19, fontWeight: 800, color: P.danger, opacity: 0.65, textDecoration: "line-through" }}>
                      5,760
                    </span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: P.success }}>→ ~100 requests</span>
                    <span style={{ fontSize: 22, opacity: Math.min(1, resultChecked), transform: `scale(${Math.min(1, resultChecked)})` }}>✅</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Panel>

        {/* ════ Beat 1 — the real page, corner window ════ */}
        <Group opacity={b1}>
          <StatPill x={760} y={250} emoji="🔔" text="poll every 15 seconds, all night" tone="danger" fontSize={16} opacity={seg(frame, 45, 67)} />
          <LiveWindow
            file={shots as any}
            shot={PAGE_SHOT}
            title="vitalii.no/features/…-m26"
            from={65}
            hold={120}
            zoom={(t) => 1 + 0.1 * t}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={1}
            win={{ x: 760, y: 300, w: 430, h: 300 }}
          />
          <CaptionBand y={664} text="Every 15 seconds, all night, a process asked: anything to do yet? Almost always, no." tone="card" fontSize={19} opacity={seg(frame, 60, 82)} />
        </Group>

        {/* ════ Beat 2 — the cost of asking on an already-busy machine ════ */}
        <Group opacity={b2}>
          <IconCard x={760} y={280} w={400} emoji="🚨" title="Already a busy machine" sub="CPU and logs climbing all night for nothing" tone="danger" opacity={seg(frame, 260, 282)} />
          <CaptionBand y={664} text="That habit burned CPU and filled logs on an already-busy machine." tone="card" fontSize={19} opacity={seg(frame, 300, 322)} />
        </Group>

        {/* ════ Beat 3 — the ledger is rewritten, one commit did it ════ */}
        <Group opacity={b3}>
          <StatPill x={760} y={250} emoji="📡" text="a quiet signal the moment work shows up" tone="success" fontSize={16} opacity={seg(frame, 405, 427)} />
          <div style={{ position: "absolute", left: 760, top: 296, fontSize: 13, fontWeight: 600, color: P.muted, maxWidth: 420, lineHeight: 1.3, opacity: seg(frame, 420, 442) }}>
            Cloudflare = the network that tells the server the moment there's real work
          </div>
          <div style={{ position: "absolute", left: 760, top: 336, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: P.muted, opacity: seg(frame, 436, 458) }}>
            THE ACTUAL CODE CHANGE
          </div>
          <div
            style={{
              position: "absolute",
              left: 760,
              top: 354,
              padding: "9px 16px",
              borderRadius: 10,
              background: P.chipBg,
              border: `1px solid ${P.border}`,
              fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
              fontSize: 14,
              color: P.muted,
              maxWidth: 430,
              opacity: seg(frame, 436, 458),
            }}
          >
            2c8adc7 · queued topics wake the runner, not polling every 15s
          </div>
          <CaptionBand y={664} text="So instead of asking, it waits to be told. Cloudflare sends a quiet signal the moment real work shows up." tone="card" fontSize={19} opacity={seg(frame, 470, 492)} />
        </Group>

        {/* ════ Beat 4 — asleep by default, capped wait ════ */}
        <Group opacity={b4} dy={b4dy}>
          <IconCard x={760} y={280} w={400} emoji="😴" title="Asleep by default" sub="wakes on the signal, or after 15 minutes — whichever first" tone="accent" opacity={seg(frame, 640, 662)} />
          <CaptionBand y={664} text="Now it just waits — asleep until that signal, or up to 15 minutes, whichever comes first." tone="card" fontSize={19} opacity={seg(frame, 660, 682)} />
        </Group>

        {/* ════ Beat 5 — the ledger's real numbers, holds to the end ════ */}
        <Group opacity={b5}>
          <LogWindow
            title="runner: idle_night_stats()"
            lines={[
              { text: "idle night: request count", tone: "muted" },
              { text: "before: poll every 15s", tone: "danger" },
              { text: "  -> ~5,760 requests", tone: "danger" },
              { text: "after: wait for Cloudflare signal", tone: "accent" },
              { text: "  -> ~100 requests", tone: "success" },
              { text: "idle night: quiet", tone: "success" },
            ]}
            from={805}
            every={18}
            opacity={1}
            win={{ x: 760, y: 130, w: 420, h: 460 }}
            fontSize={20}
          />
          <CaptionBand y={664} text="An idle night used to mean thousands of requests. Now it's about 100." tone="card" fontSize={20} opacity={seg(frame, 815, 837)} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
