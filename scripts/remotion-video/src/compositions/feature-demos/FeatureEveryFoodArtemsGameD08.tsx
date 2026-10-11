// FeatureEveryFoodArtemsGameD08 — feature d08 — 1280x720, 821 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood sand. Motion direction (feature-motion skill, 2026-10-07).
//
// Flow-map lower third: a "serving" block that morphs from a fixed, one-number
// serving (danger) to real per-100g values from Matvaretabellen (success) once
// b3 lands, feeding a "dose" node that stays unlit/waiting until b4, when the
// insulin dose starts following the real grams — the archetype's own hand-off,
// same y>=606 geometry as the flow-map reference (p75).
//
// Beat → effect (data only from the feature row and the two matching commits —
// 4683181 "food by weight, per 100g, editable grams" informs b3; 4a14f3c "dose
// starts with the plate" informs b4; 8e55152 belongs to d07 and is not used):
// b1 15-196   "A slice of bread was always one fixed number — no way to say he
//             only ate half the potatoes." titleTakeover over the features hub.
// b2 196-347  "You couldn't build a sandwich from its real parts, so the carb
//             count was often just wrong." cornerTags over the feature's own page.
// b3 347-527  "Now every food stores its real values per 100 grams, straight
//             from Matvaretabellen." copyCorrection over the feature's own page
//             (second scroll position) — the lower third's block hands off here.
// b4 527-687  "Parents adjust the exact grams he actually ate, and the insulin
//             dose follows." pipelineFlow over the feature's own page (third
//             scroll position, ambient only — no live page shows the
//             calculation itself) — the lower third's dose node lights up here.
// b5 687-821  "Twenty-three foods, weighed instead of guessed." Drawn: a
//             full-stage LogWindow of the real FOODS list, plus the lower
//             third's final stamp. Holds bright to the final frame, no fade.
//
// Persistent element: the flow-map lower third (archetype 4), b1 through b5.
//
// Viewer-fix pass (wave D1fix, 2026-10-10) — a blind viewer scored clarity 6/7
// and named: no product identity on screen beyond the lower third, b4 reads as
// an abstract diagram with no real object behind it, b5's last line reads as
// source code. Three drawn (not recorded — no public repo exists for this
// product) additions, none touching beat windows, duration, palette or the
// lower-third archetype itself:
// - ProductPlate (b1 only): a one-line corner card naming the product and
//   that it is a Type 1 simulator, to kill the "Insulin Simulator vs Artem's
//   Game vs Type 2" confusion the hub page's own unrelated card text caused.
//   b1's MotionInsert plate is also raised 0.66 -> 0.78 to dim that same text.
// - CommitNote (b4 only): a small drawn diff card with the real file name and
//   the real before/after from commit 4a14f3c ("NovoRapid starts with the
//   plate"), plus a one-line gloss on "NovoRapid" — sits in the top-right
//   quarter, clear of PipelineFlow's own centered chain/frame/result layout.
// - b5's LogWindow: last line reworded from "plateSum(): each food ×
//   grams/100" (code) to a plain sentence; still built only from the feature
//   row's own facts, no invented runtime log.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/d08.json";

const B1 = 15;
const B2 = 196;
const B3 = 347;
const B4 = 527;
const B5 = 687;
const END = 821;

/** Accent tuned for the dark stage (sand's #B4531F is too dark on a plate). */
const ACCENT = "#E8954C";
const STAGE = "#1B140C";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 50;
const BLOCK_X = 268;
const BLOCK_W_OLD = 560;
const BLOCK_W_NEW = 170;
const NODE_W = 196;
const NODE_X_OLD = BLOCK_X + BLOCK_W_OLD + 34;
const NODE_X_NEW = BLOCK_X + BLOCK_W_NEW + 34;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // b3: the serving block hands off from one fixed number to real per-100g values.
  const hand1 = tween(sec(frame, B3 + 30, fps), 0, 0.6, ease.power3InOut);
  const isNew = frame >= B3 + 30;
  // b4: the dose node lights up once the insulin dose starts following the grams.
  const isLit = frame >= B4 + 30;
  const blockW = mix(hand1, BLOCK_W_OLD, BLOCK_W_NEW);
  const nodeX = mix(hand1, NODE_X_OLD, NODE_X_NEW);
  const tokenX = BLOCK_X + blockW + 17;
  const tone = isLit ? P.success : P.danger;

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
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 16, width: 190 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>FOOD, BY WEIGHT</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            Insulin Simulator
          </div>
        </div>
        {/* route line */}
        <div style={{ position: "absolute", left: BLOCK_X - 22, top: LINE_Y - 1, width: 960, height: 2, background: P.border }} />
        <div style={{ position: "absolute", left: BLOCK_X - 30, top: LINE_Y - 8, width: 16, height: 16, borderRadius: 8, background: P.ink }} />
      </Arrive>

      {/* the serving block: one fixed number (old) → real per-100g values (new) */}
      <Arrive at={B1 + 20} kind="wipe" box={{ x: BLOCK_X, y: LT.y + 14, w: BLOCK_W_OLD, h: 64 }} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: BLOCK_X,
            top: LT.y + 14,
            width: blockW,
            height: 64,
            background: isNew ? P.successBg : P.dangerBg,
            border: `2px solid ${isNew ? P.successEdge : P.dangerEdge}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 12, top: 8, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: isNew ? P.success : P.danger, whiteSpace: "nowrap" }}>
            {isNew ? "PER 100G · MATVARETABELLEN" : "ONE FIXED SERVING"}
          </div>
          <div style={{ position: "absolute", left: 12, top: 36, fontSize: 14, fontWeight: 700, color: P.ink, whiteSpace: "nowrap" }}>
            {isNew ? "23 foods, editable grams" : "Same number, any plate size"}
          </div>
        </div>
        <div style={{ position: "absolute", left: tokenX - 9, top: LINE_Y - 9, width: 18, height: 18, borderRadius: 9, background: tone }} />
      </Arrive>

      {/* the dose node: waiting on grams (old) → NovoRapid dose, lit (new) */}
      <Arrive at={B1 + 34} kind="rise" box={{ x: NODE_X_OLD, y: LT.y + 14, w: NODE_W, h: 64 }}>
        <div
          style={{
            position: "absolute",
            left: nodeX,
            top: LT.y + 14,
            width: NODE_W,
            height: 64,
            background: isLit ? P.success : P.card,
            border: isLit ? `2px solid ${P.success}` : `2px dashed ${P.muted}`,
            borderRadius: 4,
            color: isLit ? "#fff" : P.muted,
            padding: "8px 12px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6 }}>{isLit ? "NOVORAPID DOSE" : "DOSE"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{isLit ? "follows real grams" : "waiting on grams"}</div>
        </div>
      </Arrive>

      {/* b5: the final stamp */}
      {frame >= B5 + 70 && (
        <div
          style={{
            position: "absolute",
            left: 1010,
            top: LT.y + 18,
            width: 200,
            height: 56,
            borderRadius: 4,
            background: P.ink,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 17,
            fontWeight: 800,
            transform: `scale(${punchScale(sec(frame, B5 + 70, fps), 0)})`,
          }}
        >
          23 foods, weighed
        </div>
      )}
    </div>
  );
};

/** b1 — a one-line product plate, drawn, so identity never depends on the hub page's own text. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  const p = tween(sec(frame, B1 + 10, fps), 0, 0.5, ease.power2Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 40,
        padding: "10px 18px",
        background: P.card,
        border: `2px solid ${P.accent}`,
        borderRadius: 4,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
        opacity: p,
        transform: `translateY(${(1 - p) * -10}px)`,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>INSULIN SIMULATOR</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: P.ink, marginTop: 2 }}>
        Type 1 diabetes game, built for Artem
      </div>
    </div>
  );
};

/** b4 — a small drawn diff card: the real file + the real before/after from commit 4a14f3c,
    standing in for a live recording (no public repo exists for this product to record). */
const CommitNote: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B4, B5) !== 1) return null;
  const p = tween(sec(frame, B4 + 24, fps), 0, 0.5, ease.power2Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 800,
        top: 40,
        width: 440,
        padding: "16px 20px",
        background: P.card,
        border: `2px solid ${P.border}`,
        borderRadius: 4,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
        opacity: p,
        transform: `translateY(${(1 - p) * -10}px)`,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.2, color: P.muted, fontFamily, marginBottom: 8 }}>
        day.js — commit 4a14f3c
      </div>
      <div style={{ fontSize: 16, color: P.danger, fontFamily: '"JetBrains Mono", Menlo, Consolas, monospace' }}>
        - dose = FIXED_SERVING * units
      </div>
      <div style={{ fontSize: 16, color: P.success, marginTop: 4, fontFamily: '"JetBrains Mono", Menlo, Consolas, monospace' }}>
        + dose = plateSum(plate) * units
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: P.ink, fontFamily, marginTop: 10 }}>
        NovoRapid = Artem's fast-acting mealtime insulin
      </div>
    </div>
  );
};

/** b5 — drawn: the real FOODS list, read off as a log (no VPS log for this game). */
const FoodLog: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = cut(frame, B5, END) === 1;
  if (!visible) return null;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: STAGE }} />
      <AbsoluteFill style={{ background: `rgba(8,8,8,${PLATE})` }} />
      <LogWindow
        title="FOODS[] — per 100 grams"
        from={B5}
        every={18}
        opacity={1}
        fontSize={22}
        win={{ x: 40, y: 50, w: 1200, h: 530 }}
        lines={[
          { text: "bread: 49g carbs per 100 grams — split from the old mixed serving" },
          { text: "cheese, margarine, jam — split out the same way" },
          { text: "potato, chicken, lompe, rice — added with real values" },
          { text: "23 foods total, each with its own grams on the plate" },
          { text: "Every dose is grams times that food's real value — never one guess for the whole plate" },
        ]}
      />
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — one fixed number, over the features hub */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{ title: "One Fixed Number", kicker: "No matter how much was really on the plate" }}
      />
      <ProductPlate />

      {/* b2 — can't build a sandwich from its real parts, over the feature's own page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          statement: "Food counted by serving, not parts",
          tags: ["One carb number", "No way to split it", "Sandwich ≠ its parts", "Dose math suffers"],
        }}
      />

      {/* b3 — real per-100g values from Matvaretabellen, over the feature's own page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="copyCorrection"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          wrong: "One fixed serving size",
          right: "Real values per 100 grams (Matvaretabellen, Norway's food database)",
          label: "NOW",
        }}
      />

      {/* b4 — grams on the plate recalculate the dose (drawn, matches commit 4a14f3c),
          over the feature's own page continuing to scroll (ambient fill, same
          pattern as p75's code backdrop under its pipelineFlow) */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Grams entered on the plate", "Per-100g values recalculated", "NovoRapid dose"],
          result: "Dose follows the real grams",
          system: "Matvaretabellen (food database)",
        }}
      />
      <CommitNote />

      {/* b5 — the real FOODS list, holds to the final frame */}
      <FoodLog />

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureEveryFoodArtemsGameD08: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
