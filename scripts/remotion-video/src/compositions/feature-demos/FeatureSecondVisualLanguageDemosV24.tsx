// FeatureSecondVisualLanguageDemosV24 — feature v24 — 1280x720, 990 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
// WAVE B2 FIX (2026-11-14): the host found the header claimed archetype 4 (flow-map)
// while the brief assigned this clip archetype 5 (ledger); the persistent element below
// is rebuilt as a dominant receipt-style ledger column, not a flow-map — beat windows,
// duration, palette and narration are all untouched.
//
// Voice-synced beat table (narration windows, do not shift):
//  b1  15-192  "Every feature demo looked the same: dark, dense, built for people who already read code."
//  b2 201-375  "If you weren't technical, the videos were noise — like reading sheet music instead of hearing the song."
//  b3 384-563  "I built a second visual language in Remotion — bright, plain-English panels anyone can follow."
//  b4 572-743  "Then I gave one feature a voice: a full narrated walkthrough instead of a silent loop."
//  b5 752-945  "That walkthrough runs fifty-four seconds — the first fully narrated demo this project has ever shipped." — holds to 990.
//
// Beat -> effect (data only from the feature row; plan: shots/v24.motion.json):
//  b1 titleTakeover over the feature's own page (backdrop "page").
//  b2 keywordCaption over the features hub (backdrop "hub") — scrolling the old roster.
//  b3 handoffExplain over the repo's commit history (backdrop "commits") — dark style -> bright style.
//  b4 pipelineFlow over the repo's Actions runs (backdrop "actions") — write beats, measure, sync.
//  b5 drawn: the ledger's total row flips + a LogWindow result panel built from the feature's own
//     numbers (2 visual languages instead of 1, first 54-second narrated walkthrough). Never the
//     feature page or the hub (gate 2).
//
// Persistent element: a ledger column (archetype 5) — the biggest, most central,
// longest-lived thing on screen. Three line-item rows ("VISUAL STYLE", "AUDIENCE",
// "NARRATION") each carry a red debit entry that gets struck through and replaced by
// a green credit entry as the clip proves that beat's claim, plus a bottom total row
// that flips at the b5 result ("1 style" -> "2 styles + narrated (54 s)").
// Single tech name in the whole clip: Remotion (b3 handoffExplain point only).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { Headline, fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/v24.json";

const B1 = 15;
const B2 = 201;
const B3 = 384;
const B4 = 572;
const B5 = 752;
const END = 990;

const ACCENT = "#5B9DFF";
const STAGE = "#161B22";

const LEDGER = { x: 860, y: 90, w: 360, h: 560 };
const ROW_TOP0 = LEDGER.y + 70;
const ROW_H = 110;
const TOTAL_TOP = ROW_TOP0 + 3 * ROW_H + 20;
const TOTAL_FLIP = B5 + 40;

type LedgerRowData = { label: string; debit: string; credit: string; appearAt: number; flipAt: number; top: number };

const ROWS: LedgerRowData[] = [
  { label: "VISUAL STYLE", debit: "Dark, code-only", credit: "Bright, plain-English", appearAt: B1 + 16, flipAt: B3 + 10, top: ROW_TOP0 + 0 * ROW_H },
  { label: "AUDIENCE", debit: "Developers only", credit: "Anyone watching", appearAt: B1 + 46, flipAt: B3 + 10, top: ROW_TOP0 + 1 * ROW_H },
  { label: "NARRATION", debit: "Silent loop", credit: "Full voice track", appearAt: B2 + 16, flipAt: B4 + 10, top: ROW_TOP0 + 2 * ROW_H },
];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LedgerRow: React.FC<LedgerRowData> = ({ label, debit, credit, appearAt, flipAt, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < appearAt) return null;
  const flipped = frame >= flipAt;
  const strike = flipped ? tween(sec(frame, flipAt, fps), 0, 0.3, ease.power2Out) : 0;
  const creditIn = flipped ? tween(sec(frame, flipAt + 6, fps), 0, 0.3, ease.power2Out) : 0;
  return (
    <div style={{ position: "absolute", left: LEDGER.x + 24, top, width: LEDGER.w - 48, fontFamily }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>{label}</div>
      <div style={{ position: "relative", marginTop: 6, fontSize: 19, fontWeight: 700, color: P.danger, display: "inline-block" }}>
        {debit}
        <div style={{ position: "absolute", left: 0, top: "50%", height: 2, width: `${strike * 100}%`, background: P.danger }} />
      </div>
      {flipped && (
        <div
          style={{
            marginTop: 6,
            fontSize: 19,
            fontWeight: 800,
            color: P.success,
            opacity: creditIn,
            transform: `translateY(${(1 - creditIn) * 8}px)`,
          }}
        >
          {credit}
        </div>
      )}
    </div>
  );
};

const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= TOTAL_FLIP;
  const strike = flipped ? tween(sec(frame, TOTAL_FLIP, fps), 0, 0.3, ease.power2Out) : 0;
  const creditIn = flipped ? tween(sec(frame, TOTAL_FLIP + 6, fps), 0, 0.3, ease.power2Out) : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LEDGER} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LEDGER.x,
            top: LEDGER.y,
            width: LEDGER.w,
            height: LEDGER.h,
            background: P.card,
            borderRadius: 10,
            boxShadow: "10px 10px 0 rgba(0,0,0,0.5)",
            border: `2px solid ${P.border}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: 48,
              borderRadius: "8px 8px 0 0",
              background: P.ink,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 1.6,
            }}
          >
            DEMO STYLE LEDGER
          </div>
          <div style={{ position: "absolute", left: 24, right: 24, top: 56, height: 2, background: P.border }} />
        </div>
      </Arrive>

      {ROWS.map((row) => (
        <LedgerRow key={row.label} {...row} />
      ))}

      <div style={{ position: "absolute", left: LEDGER.x + 24, top: TOTAL_TOP - 10, width: LEDGER.w - 48, height: 2, background: P.border }} />
      <div style={{ position: "absolute", left: LEDGER.x + 24, top: TOTAL_TOP, width: LEDGER.w - 48 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>DEMO STYLES SHIPPED</div>
        <div style={{ position: "relative", marginTop: 6, fontSize: 21, fontWeight: 800, color: P.danger, display: "inline-block" }}>
          1 style
          <div style={{ position: "absolute", left: 0, top: "50%", height: 2, width: `${strike * 100}%`, background: P.danger }} />
        </div>
        {flipped && (
          <div
            style={{
              marginTop: 6,
              fontSize: 21,
              fontWeight: 800,
              color: P.success,
              opacity: creditIn,
              transform: `translateY(${(1 - creditIn) * 8}px)`,
            }}
          >
            2 styles + narrated (54 s)
          </div>
        )}
      </div>
    </div>
  );
};

/** b1 only — names the actual product behind this whole clip (WAVE D1 fix,
 *  2026-11-14): a blind viewer could not tell what business/software this is,
 *  since every other beat is about the demo-video pipeline itself, not the
 *  product it renders demos for. Bottom-left, clear of the ledger column. */
const ProductPlate: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < from) return null;
  const t = tween(sec(frame, from, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 40, top: 636, display: "flex", alignItems: "center", gap: 16, fontFamily, opacity: t }}>
      <div style={{ fontSize: 34 }}>📰</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1, color: "#fff" }}>vitalii.no</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 2, maxWidth: 760 }}>
          News site + pipeline that writes and narrates its own feature videos
        </div>
      </div>
    </div>
  );
};

/** b3 only — handoffExplain's camera pan leaves a near-black band above and below
 *  its hero box + points column (both sit roughly mid-screen); name the fix up top
 *  so the ledger column on the right stays the only thing anchored at the bottom. */
const HandoffFill: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < from) return null;
  const t = tween(sec(frame, from + 6, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>🧭</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.accent }}>SECOND VISUAL LANGUAGE</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 1040 }}>
            Every beat now gets a bright, plain-English version — no code required
          </div>
        </div>
      </div>
    </div>
  );
};

/** b4 only — pipelineFlow's own chain sits in a mid-frame band; name the feature in
 *  the empty top margin, leaving the ledger column on the right undisturbed. */
const PipelineFill: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < from) return null;
  const t = tween(sec(frame, from + 6, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>🎙️</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.accent }}>ONE FEATURE GETS A VOICE</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 1040 }}>
            Beats are written, timed against the real voice track, then the picture is synced frame by frame
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 40,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 18px",
          borderRadius: 999,
          background: P.accentBg,
          border: `2px solid ${P.accentEdge}`,
        }}
      >
        <span style={{ fontSize: 20 }}>🔊</span>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.2, color: P.accent }}>FULL NARRATED WALKTHROUGH</span>
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the old dark style, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Only for people who code", kicker: "Every feature demo, until now" }}
      />
      {cut(frame, B1, B2) === 1 && <ProductPlate from={B1 + 30} />}

      {/* b2 — the cost of the old style, over the hub roster */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{ line1: "If you don't read code,", line2: "the videos were just noise.", keywords: ["don't read code", "noise"] }}
      />

      {/* b3 — the fix, over the repo's commit history */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="commits" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Dark terminal style",
          to: "Bright explainer panels",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Problem/solution zones", "Real browser mockups", "Remotion (video code)"],
        }}
      />
      {cut(frame, B3, B4) === 1 && <HandoffFill from={B3} />}

      {/* b4 — giving one feature a voice, over the repo's render runs */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="actions" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Write voice beats", "Measure durations", "Sync picture to words"],
          result: "Narrated walkthrough",
          // WAVE D1 fix (2026-11-14): pipelineFlow falls back to a hard-coded
          // Norwegian title ("Prosessen") when data.system is omitted, which a
          // blind viewer flagged as an unexplained foreign word. Set explicitly.
          system: "The Process",
        }}
      />
      {cut(frame, B4, B5) === 1 && <PipelineFill from={B4} />}

      {/* b5 — the result, drawn: never the feature page or the hub (gate 2) */}
      {frame >= B5 && (
        <>
          <div style={{ position: "absolute", left: 40, top: 22, fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.muted, fontFamily }}>
            FEATURE DEMOS PIPELINE
          </div>
          <div style={{ position: "absolute", left: 1100, top: 22, fontSize: 14, fontWeight: 800, letterSpacing: 1.6, color: P.muted, fontFamily }}>
            V24
          </div>
          <Headline y={64} text="Two visual languages now" accentText="instead of one" accentColor={P.success} fontSize={34} />
          <LogWindow
            win={{ x: 60, y: 150, w: 760, h: 400 }}
            title="feature-demos pipeline"
            from={B5 + 10}
            every={16}
            opacity={cut(frame, B5, END)}
            lines={[
              { t: "before", text: "demo styles available: 1 (dark, silent loop)", tone: "muted" },
              { t: "now", text: "demo styles available: 2 (dark + bright)", tone: "accent" },
              { t: "today", text: "first narrated walkthrough shipped", tone: "success" },
              { t: "runtime", text: "54 seconds, voice-synced end to end", tone: "success" },
              { t: "timing", text: "picture baked from the measured voice track", tone: "ink" },
            ]}
          />
        </>
      )}

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureSecondVisualLanguageDemosV24: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
