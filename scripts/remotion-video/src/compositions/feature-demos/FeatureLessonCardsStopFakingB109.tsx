// FeatureLessonCardsStopFakingB109 — feature b109 — 1280x720, 978 frames @ 30fps, VOICE-SYNCED.
//
// archetype 4 flow-map, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
// WAVE B2 FIX (2026-11-24): the header said archetype 5 (ledger) but the feature was
// actually assigned archetype 4 (flow-map) — this version replaces the receipt-style
// ledger with a flow-map: six scattered slot-type nodes with routes converging on a
// central "drawSpec" hub, which then branches off a check node once the gate lands,
// matching the STEP 0 archetype-4 definition (nodes and routes across the frame, a
// token travels the route and branches). Beat windows, duration, palette and every
// beat's narration are unchanged; only the persistent element changed.
//
// Beat → effect (data only from the feature row, commits e11ac4b / e1fcb49):
// b1  15-224  "A kid learning fractions got a honey pot standing in for a
//              honeycomb — the wrong picture, teaching the wrong idea."
//              titleTakeover over the feature's own page (backdrop "page").
// b2 224-363  "Every lesson card just grabbed the nearest emoji and hoped it
//              matched."
//              cornerTags: the claim + four facts from problem_en, over the
//              page scrolled further (backdrop "page2").
// b3 363-525  "Now a shared kit called drawSpec draws the real shape, at one
//              true scale."
//              WAVE C FIX (2026-11-24): was handoffExplain (drawn, no public UI
//              for an internal module). Its own camera-pan + staggered points
//              are timed off a 4.3s BUILD against this beat's 5.4s window, so
//              at the beat's measured midpoint the "before" paper had already
//              panned off-screen and the points hadn't started — 26/48 filled.
//              Replaced with a static hand-built BEFORE/NOW panel pair plus the
//              same 3 points as IconCards, full-bright for the whole beat.
// b4 525-671  "The same kit checks the answer, so picture and check can
//              never disagree."
//              Drawn beat: a LogWindow plays the content gate checking a
//              picture against the word (lines built from solution_en /
//              result_en — this product keeps no runtime log on the VPS).
// b5 671-978  "No stand-ins: with no exact picture, the card is refused, not
//              shipped wrong — real pictures now, across all 6." (LAST BEAT)
//              cardCounter: the 6 named slot types from result_en, holds to
//              the end at full brightness.
//
// Persistent element (archetype 4, flow-map): a flow diagram in the lower band,
// b1 through END. Six source nodes — one per slot type (stations, splitCompare,
// sortIntoBins, bins, magnifier, revealAnswer) — sit scattered on the left with
// routes converging on a central hub. The hub and its routes read red/"EMOJI GUESS"
// through b1-b2, then flip to green/"DRAWSPEC — REAL SHAPE" the moment b3 names the
// fix. At b4 ("the same kit checks the answer") a token travels the route and
// branches off the hub into a new "✓ CHECK MATCHES" node, visualising the gate.
// At b5 a "6/6 REAL" badge lands on the hub, agreeing with the cardCounter's own
// count of six slot types.
//
// Single tech name in the whole clip: drawSpec (b3 + the flow-map's hub label).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Panel, IconCard } from "./bright-primitives";
import { LogWindow } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b109.json";

const B1 = 15;
const B2 = 224;
const B3 = 363;
const B4 = 525;
const B5 = 671;
const END = 978;

/** Accent tuned for the dark stage (slate's own #0E7490 reads muddy on a plate). */
const ACCENT = "#2DD4BF";
const STAGE = "#131B22";

// Flow-map band — same lower-third the effects keep clear (y>=600).
const LT = { x: 40, y: 598, w: 1200, h: 104 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Pt = { x: number; y: number };

const SLOT_LABELS = ["stations", "splitCompare", "sortIntoBins", "bins", "magnifier", "revealAnswer"];

// normalized 0..1 positions inside the flow-map's own svg box — six scattered
// slot-type sources converging on one hub.
const SRC_PTS: Pt[] = [
  { x: 0.06, y: 0.1 },
  { x: 0.06, y: 0.34 },
  { x: 0.06, y: 0.58 },
  { x: 0.06, y: 0.82 },
  { x: 0.22, y: 0.22 },
  { x: 0.22, y: 0.7 },
];
const HUB: Pt = { x: 0.88, y: 0.46 };

const FLIP_AT = B3; // "drawSpec draws the real shape" — the hub takes over
const CHECK_AT = B4; // "the same kit checks the answer" — hub branches to a check node
const TOTAL_AT = B5 + 30; // "real pictures now, across all 6" — agrees with the cardCounter

/** one scattered slot-type dot + its converging route into the hub. */
const FlowDot: React.FC<{ p: Pt; w: number; h: number; color: string; lineOn: number }> = ({ p, w, h, color, lineOn }) => {
  const cx = p.x * w;
  const cy = p.y * h;
  const tx = HUB.x * w;
  const ty = HUB.y * h;
  return (
    <>
      <line x1={cx} y1={cy} x2={tx} y2={ty} stroke={color} strokeWidth={1} opacity={lineOn * 0.6} />
      <circle cx={cx} cy={cy} r={2.6} fill={color} />
    </>
  );
};

/** Persistent archetype 4 (flow-map): six slot-type nodes route into a central
 * "drawSpec" hub — red/"EMOJI GUESS" through b1-b2, flipping to green the moment
 * b3 names the fix. At b4 a token travels the route and branches off the hub into
 * a "✓ CHECK MATCHES" node, visualising the gate. At b5 a "6/6 REAL" badge lands,
 * agreeing with the cardCounter's own count of six slot types. */
const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= FLIP_AT;
  const checked = frame >= CHECK_AT;
  const totalled = frame >= TOTAL_AT;

  const color = flipped ? P.success : P.danger;
  const lineOn = flipped ? tween(sec(frame, FLIP_AT, fps), 0, 0.6, ease.power2Out) : 0;
  const hubPunch = flipped ? Math.max(0, punchScale(sec(frame, FLIP_AT, fps), 0) - 1) : 0;

  const svgW = 260;
  const svgH = 80;
  const hubAbsX = 20 + HUB.x * svgW;
  const hubAbsY = (LT.h - svgH) / 2 + HUB.y * svgH;
  const chipCx = 560;
  const chipCy = LT.h / 2;

  const tokenT = checked ? tween(sec(frame, CHECK_AT, fps), 0, 0.5, ease.power2Out) : 0;
  const tokenX = mix(tokenT, hubAbsX, chipCx);
  const tokenY = mix(tokenT, hubAbsY, chipCy);
  const branchOn = checked ? tween(sec(frame, CHECK_AT, fps), 0, 0.4, ease.power2Out) : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: LT.w,
            height: LT.h,
            background: P.card,
            border: `2px solid ${totalled ? P.successEdge : P.border}`,
            borderRadius: 4,
            boxSizing: "border-box",
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              top: 6,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.6,
              color: P.muted,
              whiteSpace: "nowrap",
            }}
          >
            🧭 FLOW — THE PICTURE SLOT
          </div>

          <svg width={svgW} height={svgH} style={{ position: "absolute", left: 20, top: (LT.h - svgH) / 2, overflow: "visible" }}>
            {SRC_PTS.map((p, i) => (
              <FlowDot key={i} p={p} w={svgW} h={svgH} color={color} lineOn={lineOn} />
            ))}
            <circle cx={HUB.x * svgW} cy={HUB.y * svgH} r={6} fill={color} transform={`scale(${1 + hubPunch * 0.3})`} />
          </svg>

          {checked && (
            <svg width={LT.w} height={LT.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <line x1={hubAbsX} y1={hubAbsY} x2={chipCx} y2={chipCy} stroke={P.success} strokeWidth={1.4} opacity={branchOn * 0.6} />
              <circle cx={tokenX} cy={tokenY} r={4} fill={P.success} opacity={tokenT < 1 ? 1 : 0} />
            </svg>
          )}

          <div style={{ position: "absolute", left: 300, top: 20, width: 1, height: 64, background: P.border }} />

          <div style={{ position: "absolute", left: 320, top: 26, transform: `scale(${1 + hubPunch * 0.15})` }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>
              6 SLOT TYPES — {SLOT_LABELS.join(", ")}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color, marginTop: 4, whiteSpace: "nowrap" }}>
              {flipped ? "DRAWSPEC — REAL SHAPE" : "EMOJI GUESS"}
            </div>
          </div>

          {checked && (
            <div
              style={{
                position: "absolute",
                left: 560,
                top: 32,
                padding: "6px 14px",
                borderRadius: 999,
                background: P.successBg,
                border: `2px solid ${P.successEdge}`,
                color: P.success,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                whiteSpace: "nowrap",
                transform: `scale(${punchScale(sec(frame, CHECK_AT, fps), 0)})`,
              }}
            >
              ✓ CHECK MATCHES
            </div>
          )}

          {totalled && (
            <div
              style={{
                position: "absolute",
                left: 780,
                top: 32,
                fontSize: 17,
                fontWeight: 800,
                color: P.success,
                whiteSpace: "nowrap",
                transform: `scale(${punchScale(sec(frame, TOTAL_AT, fps), 0)})`,
              }}
            >
              6/6 REAL
            </div>
          )}
        </div>
      </Arrive>
    </div>
  );
};

const LOG_WIN = { x: 150, y: 150, w: 980, h: 410 };

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Wrong Picture, Wrong Idea", kicker: "A honey pot stood in for a honeycomb" }}
      />

      {/* b2 — every card guessed with emoji (problem_en facts) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Picked the nearest emoji, hoped it matched",
          tags: ["No shared scale", "One-off per effect", "Near-miss pictures", "Taught the wrong thing"],
        }}
      />

      {/* b3 — the fix: drawSpec draws the real shape (no public UI, stays drawn).
          Hand-built, clear of the flow-map band (y>=598) — see header for why
          handoffExplain was replaced. */}
      {frame >= B3 && frame < B4 && (
        <>
          <Panel x={70} y={60} w={500} h={150} tone="danger" radius={24} opacity={1}>
            <div style={{ padding: "22px 30px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: ACCENT }}>BEFORE</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#101418", marginTop: 8 }}>Emoji guesswork</div>
            </div>
          </Panel>
          <Panel x={650} y={60} w={500} h={150} tone="success" radius={24} opacity={1}>
            <div style={{ padding: "22px 30px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: ACCENT }}>NOW</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#101418", marginTop: 8 }}>drawSpec real shapes</div>
            </div>
          </Panel>
          <IconCard x={70} y={260} w={360} emoji="🧩" title="Polygons, grids, bars" sub="One drawing kit for every slot" tone="accent" />
          <IconCard x={460} y={260} w={360} emoji="📐" title="One shared scale" sub="Same true scale, every card" tone="accent" />
          <IconCard x={850} y={260} w={360} emoji="✅" title="Feeds the check" sub="Same output the gate reads" tone="success" />
        </>
      )}

      {/* b4 — the gate checking a real picture against the word */}
      {cut(frame, B4, B5) === 1 && (
        <LogWindow
          title="content gate"
          from={B4}
          every={14}
          opacity={1}
          win={LOG_WIN}
          lines={[
            { t: "honeycomb", text: "searching OpenMoji + NO keywords…", tone: "muted" },
            { t: "match", text: "no exact picture found", tone: "danger" },
            { t: "gate", text: "card refused — no lookalike shipped", tone: "danger" },
            { t: "honey pot", text: "searching OpenMoji + NO keywords…", tone: "muted" },
            { t: "match", text: "exact picture found", tone: "success" },
            { t: "drawSpec", text: "shape drawn at one true scale", tone: "success" },
            { t: "slots", text: "stations, splitCompare, sortIntoBins, bins…", tone: "ink" },
            { t: "result", text: "6 of 6 slot types now draw real pictures", tone: "success" },
          ]}
        />
      )}

      {/* b5 — the result: holds to the end at full brightness */}
      <MotionInsert
        effect="cardCounter"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        plate={0.5}
        data={{
          cards: [
            { label: "stations", value: 1 },
            { label: "splitCompare", value: 1 },
            { label: "sortIntoBins", value: 1 },
            { label: "bins", value: 1 },
            { label: "magnifier target", value: 1 },
            { label: "revealAnswer", value: 1 },
          ],
          totalLabel: "slot types now draw real pictures",
        }}
      />

      <FlowMap />
    </AbsoluteFill>
  );
};

export const FeatureLessonCardsStopFakingB109: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
