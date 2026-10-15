// FeatureSourceConsolidation — feature p22 — 1280x720, 889 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
// RE-SHOOT: narration unchanged, picture rewritten to the current rules (real product
// evidence + catalog motion effects), replacing the 2026-08 hand-drawn-only build.
//
// One editorial effect per sentence, chosen by what changes on screen, over the real
// product as evidence (the feature's own page, then the real GitHub Actions run history),
// one owner of the frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat -> picture:
// b1 15-264   "I used to check six Telegram channels and 26 RSS feeds every single day,
//             by hand, just hunting for one good story."
//             cardCounter (6 Telegram / 26 RSS) over a LiveBackdrop of the feature's own
//             page (backdrop "page"). Flow-map enters the lower-third band scattered,
//             danger, "NOT YET QUEUED" (the stated manual state).
// b2 264-392  "That's 32 different clocks, all ticking on their own schedule."
//             cornerTags ("32 different clocks" / 6 Telegram, 26 RSS, own schedule), same
//             continuous page recording. Band stays scattered/danger, unchanged.
// b3 392-580  "So I automated the entire intake with GitHub Actions, funneling everything
//             into one queue."
//             hubRouting over a LiveBackdrop of the real GitHub Actions run history
//             (backdrop "actions" — the evidence for "automated ... with GitHub Actions").
//             Band flips to converged/success, "AUTO-QUEUED", with a small punch.
// b4 580-776  "It rotates through sources so none of them throttles me, and batches the
//             rest to keep it fast and cheap."
//             pipelineFlow, same continuous Actions recording — the real round-robin +
//             batching mechanism (realtime-scraper.yml / rss-monitor-v2.yml). Band stays
//             converged, already flipped.
// b5 776-889  "32 sources, one queue."
//             Fully drawn: the flow-map goes BIG — 32 scattered sources (6 Telegram + 26
//             RSS) converging on one labelled queue, "32 -> 1" — plus a LogWindow built
//             from this feature's own numbers (no runtime log for this product on the
//             VPS, so the lines come from the feature row, never invented). Holds to END
//             at full brightness, no fade. Neither the feature page nor the Actions list
//             appears in this beat.
//
// Persistent element: the flow-map (archetype 4) — small in the lower-third band
// (y >= 600) for b1-b4 where a catalog effect owns the stage above it, BIG only in b5 (the
// one beat with no competing catalog effect). Gate 2: b5 ends on a drawn result (flow-map +
// LogWindow), not a page or the hub.
//
// The GitHub Actions run history at github.com/SmmShaman/vitalii-no-platform/actions backs
// b3's "automated ... with GitHub Actions" claim directly, so b3+b4 play that recording
// instead of staying drawn.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p22.json";

const B1 = 15;
const B2 = 264;
const B3 = 392;
const B4 = 580;
const B5 = 776;
const END = 889;

const ACCENT = "#0E7490";
const STAGE = "#0D1620";

/** Lower-third band (1280x720, below the effects' safe bottom at y≈587) — the flow-map's
    SMALL home while a catalog effect sits above it (b1-b4). */
const BAND = { x: 40, y: 602, w: 1200, h: 96 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Pt = { x: number; y: number };

// normalized 0..1 positions, reused for both the small band and the BIG b5 payoff
const TG_PTS: Pt[] = [
  { x: 0.06, y: 0.22 }, { x: 0.06, y: 0.78 },
  { x: 0.18, y: 0.12 }, { x: 0.18, y: 0.88 },
  { x: 0.3, y: 0.32 }, { x: 0.3, y: 0.68 },
];
const RSS_PTS: Pt[] = Array.from({ length: 26 }, (_, i) => {
  const col = i % 7;
  const row = Math.floor(i / 7);
  const jx = Math.sin(i * 1.7) * 0.018;
  const jy = Math.cos(i * 1.3) * 0.03;
  return { x: 0.06 + col * 0.058 + jx, y: 0.06 + row * 0.26 + jy };
});
const ALL_PTS: Pt[] = [...TG_PTS, ...RSS_PTS];
const TARGET: Pt = { x: 0.88, y: 0.5 };

/** one scattered-source dot + its converging line to the queue, inside a w×h box. */
const FlowDot: React.FC<{ p: Pt; w: number; h: number; big?: boolean; color: string; lineOn: number }> = ({
  p,
  w,
  h,
  big,
  color,
  lineOn,
}) => {
  const cx = p.x * w;
  const cy = p.y * h;
  const tx = TARGET.x * w;
  const ty = TARGET.y * h;
  return (
    <>
      <line x1={cx} y1={cy} x2={tx} y2={ty} stroke={color} strokeWidth={big ? 1.4 : 1} opacity={lineOn * 0.55} />
      <circle cx={cx} cy={cy} r={big ? 5 : 2.4} fill={color} />
    </>
  );
};

const StatRow: React.FC<{ label: string; value: string; P: ReturnType<typeof usePalette> }> = ({ label, value, P }) => (
  <div style={{ display: "flex", justifyContent: "space-between", width: 420, fontSize: 22, fontWeight: 700 }}>
    <span style={{ color: P.ink }}>{label}</span>
    <span style={{ color: P.success }}>{value}</span>
  </div>
);

/** archetype 4 — the flow-map: 32 scattered sources converging on one queue. Small in the
    band (b1-b4), BIG only in b5. Flips once, at B3, from scattered/danger to
    converged/success — the real moment GitHub Actions took over the intake. */
const FlowMapFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B3;
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const status = flipped ? "AUTO-QUEUED" : "NOT YET QUEUED";
  const lineOn = flipped ? tween(sec(frame, B3, fps), 0, 0.6, ease.power2Out) : 0;

  if (frame >= B5) {
    const t = tween(sec(frame, B5 + 4, fps), 0, 0.5, ease.power3Out);
    const W = 460;
    const H = 220;
    return (
      <div style={{ position: "absolute", left: 80, top: 128, width: W + 60, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(16,23,40,0.55)" }}>
          SOURCE CONSOLIDATION
        </div>
        <svg width={W} height={H} style={{ marginTop: 10, overflow: "visible" }}>
          {ALL_PTS.map((p, i) => (
            <FlowDot key={i} p={p} w={W} h={H} big color={P.success} lineOn={1} />
          ))}
          <rect x={TARGET.x * W - 54} y={TARGET.y * H - 30} width={108} height={60} rx={6} fill={P.card} stroke={P.success} strokeWidth={2} />
          <text x={TARGET.x * W} y={TARGET.y * H - 6} textAnchor="middle" fontSize={13} fontWeight={800} fill={P.muted} fontFamily={fontFamily}>
            QUEUE
          </text>
          <text x={TARGET.x * W} y={TARGET.y * H + 18} textAnchor="middle" fontSize={20} fontWeight={800} fill={P.success} fontFamily={fontFamily}>
            32 -&gt; 1
          </text>
        </svg>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <StatRow label="TELEGRAM CHANNELS" value="6" P={P} />
          <StatRow label="RSS FEEDS" value="26" P={P} />
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "10px 22px",
            borderRadius: 4,
            background: bg,
            border: `2px solid ${color}`,
            color,
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          ONE QUEUE — NO THROTTLING
        </div>
      </div>
    );
  }

  const flipPunch = flipped ? Math.max(0, punchScale(sec(frame, B3, fps), 0) - 1) : 0;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={BAND} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: BAND.x,
          top: BAND.y,
          width: BAND.w,
          height: BAND.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 20px",
          fontFamily,
        }}
      >
        <svg width={220} height={BAND.h - 16} style={{ overflow: "visible" }}>
          {ALL_PTS.map((p, i) => (
            <FlowDot key={i} p={p} w={220} h={BAND.h - 16} color={color} lineOn={lineOn} />
          ))}
        </svg>
        <div style={{ width: 1, height: 44, background: P.border }} />
        <div style={{ transform: `scale(${1 + flipPunch * 0.25})` }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>32 SOURCES</div>
          <div style={{ fontSize: 17, fontWeight: 800, color }}>{status}</div>
        </div>
      </div>
    </Arrive>
  );
};

/** b4 — pipelineFlow compacts to a small centered chain for most of its own
    build (frame-outline still drawing at the sampled midpoint, result box later
    still), so even over the "actions" backdrop the frame falls short. A thin
    top ticker restates pipelineFlow's own steps/result, visible from the first
    half-second, in the otherwise-empty top strip above the backdrop's header
    band. b1/b2/b3/b5 already pass and are untouched. */
const StepTicker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B4 || frame >= B5) return null;
  const t = tween(sec(frame, B4 + 4, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 56,
        width: 1200,
        height: 64,
        background: P.card,
        borderRadius: 4,
        boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 22px",
        opacity: t,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, color: P.muted }}>INTAKE</span>
      <span style={{ fontSize: 19, fontWeight: 800, color: P.ink }}>Round-robin across sources</span>
      <span style={{ fontSize: 19, fontWeight: 800, color: P.muted }}>&gt;</span>
      <span style={{ fontSize: 19, fontWeight: 800, color: P.ink }}>Batch the rest</span>
      <span style={{ fontSize: 19, fontWeight: 800, color: P.muted }}>&gt;</span>
      <span style={{ fontSize: 19, fontWeight: 800, color: P.success }}>No throttling</span>
    </div>
  );
};

/** b1 — small product plate naming the real product, over the LiveBackdrop + effect. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B1, B2) !== 1) return null;
  const t = tween(sec(frame, B1 + 4, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 24,
        padding: "7px 16px",
        background: "rgba(13,22,32,0.85)",
        border: "1.5px solid #8FC6D9",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        color: "#F5F7FA",
        opacity: t,
        maxWidth: 560,
        lineHeight: 1.4,
        fontFamily,
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>VITALII.NO — PORTFOLIO & NEWS PLATFORM</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>32 sources checked by hand, every day, before this</span>
    </div>
  );
};

const LOG_LINES: Array<{ t?: string; text: string; tone: "ink" | "muted" | "danger" | "success" | "accent" }> = [
  { text: "6 Telegram channels + 26 RSS feeds = 32 sources", tone: "muted" },
  { text: "old process: manual, one at a time", tone: "danger" },
  { text: "new process: GitHub Actions intake", tone: "ink" },
  { text: "round-robin rotation -> no throttling", tone: "accent" },
  { text: "batched fetch -> fast & cheap", tone: "accent" },
  { text: "result: 32 sources -> 1 moderation queue", tone: "success" },
];

/** b5 — the result, fully drawn: LogWindow built from this feature's own real numbers
    (no runtime log exists for this product). Holds to END at full brightness, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const captionIn = tween(t, 1.3, 0.3, ease.power2Out);
  return (
    <>
      <LogWindow
        lines={LOG_LINES}
        title="source_intake"
        from={B5 + 14}
        every={16}
        opacity={1}
        win={{ x: 680, y: 56, w: 540, h: 470 }}
        fontSize={18}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 572,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#101828",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Thirty-two different clocks now check themselves — one queue, no manual rounds.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1+b2 — the manual-checking problem, then the "32 clocks" framing, over the feature's own page (continuous recording, no restart) */}
      {cut(frame, B1, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B3 - B1} push={0.03} />}
      <MotionInsert
        effect="cardCounter"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{
          cards: [
            { label: "Telegram channels", value: 6 },
            { label: "RSS feeds", value: 26 },
          ],
          unit: "sources",
          totalLabel: "All sources",
        }}
      />
      <ProductPlate />

      {/* b2 — "32 different clocks", same continuous backdrop */}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.78}
        data={{
          statement: "32 different clocks",
          tags: ["6 Telegram", "26 RSS", "own schedule"],
        }}
      />

      {/* b3+b4 — the fix: automated with GitHub Actions, over the real Actions run history */}
      {cut(frame, B3, B5) === 1 && <LiveBackdrop file={shotsFile} shot="actions" from={B3} hold={B5 - B3} push={0.03} />}
      <MotionInsert
        effect="hubRouting"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.78}
        data={{
          inputs: ["Telegram channels", "RSS feeds"],
          hub: "GitHub Actions intake",
          output: "One moderation queue",
        }}
      />

      {/* b4 — round-robin + batching, same continuous backdrop */}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.78}
        data={{
          steps: ["Round-robin across sources", "Batch the rest", "Stay fast & cheap"],
          result: "No throttling",
          system: "GitHub Actions",
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <StepTicker />
      <FlowMapFigure />
    </AbsoluteFill>
  );
};

export const FeatureSourceConsolidation: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
