// FeatureNovorapidButtonAsksWhatD06 — feature d06 — 1280x720, 899 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real product's own page as evidence where there is one, one owner of the
// frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature row; no invented metrics):
// b1 15-156   "Artem's parents could only use the dose button if they'd already
//             picked his food."
//             keywordCaption over the feature's own page (backdrop "page"). The
//             lower third opens wide: a 3-step dose pipeline, nothing zoomed
//             yet. Product plate names Insulin Simulator here, once.
// b2 156-305  "Any other time, the app just stopped — no numbers, no next step."
//             cornerTags over the features hub (backdrop "hub") — the claim
//             plus four plain facts. Camera starts pushing toward the middle
//             step of the pipeline, the decision point.
// b3 305-475  "Now one button on Cloudflare Workers asks first: food, or no
//             food at all?"
//             handoffExplain over the feature's own page, scrolled further
//             (backdrop "page2") — BEFORE/NOW handoff landing on the new
//             question. The clip's one tech gloss ("Cloudflare Workers") sits
//             top-left, same spot the gloss used in d13. Zoom is now tight on
//             the "FOOD?" tile — no commit diff shown; no GitHub URL was
//             verified tonight, so commit 4a14f3c ("NovoRapid starts with the
//             plate") is reflected only in this beat's wording, not a screenshot.
// b4 475-659  "Choose food and it adds carbs to the correction. Choose none
//             and it doses on correction alone."
//             featureMatrix, drawn only (no backdrop) — the two real branches
//             as a 2-column table. Commit 4683181 ("food by weight") has no
//             single readable hunk for this exact branch, so the mechanism is
//             drawn instead of a diff. Pipeline flips to "resolved" green.
// b5 659-899  "If blood sugar is stale, a Measure Now button appears right
//             there — every path now ends in one tap."
//             Fully drawn: a one-tap result card plus a LogWindow built from
//             the feature's own mechanism (not a real runtime log — labelled
//             as the decision trace). Holds bright to the final frame, no
//             fade. Neither the feature page nor the hub appears in this beat.
//
// Persistent element: the zoom-in lower third (archetype 2) — a 3-tile dose
// pipeline (TAP → FOOD? → DOSE SET) the camera pushes into across b1-b5, and a
// 3-chip path row (food, none, Measure Now) that lights up as each path
// resolves. Effects keep the bottom 200/1080px clear (look.safeBottom) — that
// is where the lower third sits (y=606 in 1280x720).
//
// Gate 2: the clip does NOT end on the feature's own page or the hub — b5 has
// no LiveBackdrop at all, only the drawn result card, LogWindow and the
// persistent lower third.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d06.json";

const B1 = 15;
const B2 = 156;
const B3 = 305;
const B4 = 475;
const B5 = 659;
const END = 899;

/** Brighter than violet's #5B37D4 so it reads on the dark plate. */
const ACCENT = "#8C6FF5";
const STAGE = "#140F26";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const GRID_X = LT.x + 20;
const GRID_Y = LT.y + 14;
const GRID_W = 230;
const GRID_H = 64;
const CHIP_ROW_X = GRID_X + GRID_W + 46;
const CHIP_W = 196;
const CHIP_H = 64;
const CHIP_GAP = 16;
const GLOSS_BOX = { x: 40, y: 80, w: 460, h: 26 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Tile = { label: string; icon: string; relevant: boolean };
const TILES: Tile[] = [
  { label: "TAP DOSE", icon: "💉", relevant: false },
  { label: "FOOD?", icon: "❓", relevant: true },
  { label: "DOSE SET", icon: "✅", relevant: true },
];

type Chip = { label: string; icon: string };
const CHIPS: Chip[] = [
  { label: "Food → +carbs", icon: "🍽" },
  { label: "None → correction", icon: "🚫" },
  { label: "Measure Now", icon: "🩸" },
];

/** archetype 2 zoom-in lower third: wide pipeline → tight on the FOOD? tile → resolved. */
const DecisionStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Camera push: wide (b1) → toward FOOD? tile (b2/b3) → resolved, tightest (b4/b5).
  const h1 = tween(sec(frame, B2 + 20, fps), 0, 0.5, ease.power3InOut);
  const h2 = tween(sec(frame, B4 + 20, fps), 0, 0.5, ease.power3InOut);
  const h3 = tween(sec(frame, B5 + 20, fps), 0, 0.5, ease.power3InOut);
  const scale = mix(h3, mix(h2, mix(h1, 1.0, 1.18), 1.42), 1.6);
  const originX = mix(h2, 0.5, 0.62);
  const originY = 0.5;

  const flipped = frame >= B4;
  const label = flipped ? "PATH CONFIRMED" : "FOOD OR NONE?";
  const sub = flipped ? "carbs added, or correction alone" : "asked before every single dose";

  // Chips: food path, none path, Measure Now — light up as commit 4683181 /
  // the stale-reading check reaches each path.
  const litAt = [B4, B4 + 40, B5];
  const pop0 = (f: number, at: number, fps2: number) => punchScale(sec(f, at, fps2), 0) - 1;
  const chipGlow = (i: number) => (frame >= litAt[i] ? pop0(frame, litAt[i], fps) : 0);

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
      </Arrive>

      {/* product plate, b1 only */}
      {cut(frame, B1, B2) === 1 && (
        <div
          style={{
            position: "absolute",
            left: LT.x + 14,
            top: LT.y - 42,
            padding: "7px 16px",
            background: "rgba(10,8,20,0.85)",
            border: `1.5px solid ${P.accentEdge}`,
            borderRadius: 4,
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: 1.3,
            color: "#F5F5F5",
          }}
        >
          INSULIN SIMULATOR <span style={{ fontWeight: 500, opacity: 0.85 }}>· a diabetes simulator for my son Artem</span>
        </div>
      )}

      {/* zoom-in mock dose pipeline */}
      <div
        style={{
          position: "absolute",
          left: GRID_X,
          top: GRID_Y,
          width: GRID_W,
          height: GRID_H,
          overflow: "hidden",
          borderRadius: 4,
          border: `2px dashed ${P.accentEdge}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: GRID_W - 12,
            height: GRID_H - 10,
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: `${originX * 100}% ${originY * 100}%`,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
          }}
        >
          {TILES.map((tl) => {
            const resolved = flipped && tl.relevant;
            const tone = resolved ? P.success : P.muted;
            const bg = resolved ? P.successBg : P.chipBg;
            return (
              <div
                key={tl.label}
                style={{
                  background: bg,
                  border: `1.5px solid ${tone}`,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8.5,
                  fontWeight: 800,
                  color: tone,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  gap: 2,
                }}
              >
                <span>{tl.icon}</span>
                <span>{tl.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: GRID_X, top: GRID_Y + GRID_H + 4, width: GRID_W, fontSize: 12, fontWeight: 800, color: flipped ? P.success : P.accent, whiteSpace: "nowrap" }}>
        {label}
      </div>
      <div style={{ position: "absolute", left: GRID_X, top: GRID_Y + GRID_H + 20, width: GRID_W, fontSize: 11, fontWeight: 600, color: P.muted, whiteSpace: "nowrap" }}>
        {sub}
      </div>

      {/* three path chips, lighting up as each resolves */}
      {CHIPS.map((c, i) => {
        const glow = chipGlow(i);
        const lit = frame >= litAt[i];
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: CHIP_ROW_X + i * (CHIP_W / 2.6 + CHIP_GAP),
              top: LT.y + 14,
              width: CHIP_W / 2.6,
              height: CHIP_H,
              borderRadius: 4,
              background: lit ? P.successBg : P.chipBg,
              border: `1.5px solid ${lit ? P.success : P.border}`,
              transform: `scale(${1 + Math.max(0, glow) * 0.08})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            <div>{c.icon}</div>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: lit ? P.success : P.muted, textAlign: "center", lineHeight: 1.1, marginTop: 2 }}>{c.label}</div>
          </div>
        );
      })}
      {frame >= B5 && (
        <div
          style={{
            position: "absolute",
            left: CHIP_ROW_X,
            top: LT.y - 20,
            fontSize: 12,
            fontWeight: 800,
            color: P.success,
            opacity: tween(sec(frame, B5, fps), 0, 0.3, ease.power2Out),
          }}
        >
          ONE TAP, EVERY TIME
        </div>
      )}
    </div>
  );
};

/** b3 — the clip's one tech-term gloss, same slot d13 used. */
const WorkersGloss: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B3 || frame >= B4) return null;
  return (
    <Arrive at={B3} kind="rise" box={GLOSS_BOX} dur={0.35}>
      <div style={{ position: "absolute", left: GLOSS_BOX.x, top: GLOSS_BOX.y, fontFamily, fontSize: 15, fontWeight: 600, color: "#D9CBB8" }}>
        <span style={{ color: ACCENT, fontWeight: 800 }}>Cloudflare Workers</span> — runs the check the instant dose is tapped
      </div>
    </Arrive>
  );
};

const RESULT_LOG: LogLine[] = [
  { t: "00:00", text: "dose button tapped", tone: "accent" },
  { t: "00:00", text: "Cloudflare Worker asks: food or none?", tone: "accent" },
  { t: "00:01", text: "food chosen → carbs added to correction", tone: "success" },
  { t: "00:01", text: "none chosen → correction dose alone", tone: "muted" },
  { t: "00:02", text: "glucose reading older than 15 min", tone: "danger" },
  { t: "00:02", text: "Measure Now button offered", tone: "accent" },
  { t: "00:03", text: "new reading taken, dose recalculated", tone: "accent" },
  { t: "00:04", text: "dose confirmed in one tap", tone: "success" },
];

/** b5 — the result, fully drawn: a one-tap hero card plus the decision trace. Holds to END, no fade. */
const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B5, END) !== 1) return null;
  const t = sec(frame, B5, fps);
  const resultIn = tween(t, 0.1, 0.3, ease.power3Out);
  const captionIn = tween(t, 0.95, 0.3, ease.power2Out);

  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 86, width: 420, opacity: resultIn, fontFamily }}>
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 2, color: "rgba(245,245,242,0.6)" }}>
          EVERY PATH NOW ENDS IN
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, lineHeight: 1, color: "#34D399", marginTop: 4 }}>1</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 10,
            padding: "9px 18px",
            borderRadius: 4,
            background: "rgba(52,211,153,0.14)",
            border: "2px solid #34D399",
            color: "#34D399",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          TAP
        </div>
      </div>
      <LogWindow
        lines={RESULT_LOG}
        title="dose-decision"
        from={B5 + 14}
        every={14}
        opacity={1}
        win={{ x: 760, y: 56, w: 460, h: 470 }}
      />
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 586,
          width: 1200,
          fontSize: 22,
          fontWeight: 700,
          color: "#F5F5F2",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Food, none, or a stale reading — one tap always finishes the dose.
      </div>
    </>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the old rule, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.8}
        data={{
          line1: "The dose button only worked",
          line2: "if Artem's food was picked first",
          keywords: ["only worked", "picked first"],
        }}
      />

      {/* b2 — the blind spot, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.8}
        data={{
          statement: "Any other time, the app just stopped",
          tags: ["No numbers shown", "No next step", "Every single time", "Food had to come first"],
        }}
      />

      {/* b3 — the fix, over the feature's own page, scrolled further */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.3 }} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.8}
        data={{
          from: "Pick food, then find the dose button",
          to: "Button asks food or none, first",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["One Cloudflare Workers check", "Runs the instant dose is tapped", "No food picked still works"],
        }}
      />
      <WorkersGloss />

      {/* b4 — the two branches, drawn only (no backdrop) */}
      <MotionInsert
        effect="featureMatrix"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        base={STAGE}
        data={{
          options: ["Food chosen", "No food"],
          rows: [
            { label: "Carbs added", values: ["Yes", "No"] },
            { label: "Dose basis", values: ["Carbs + correction", "Correction only"] },
          ],
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <DecisionStage />
    </AbsoluteFill>
  );
};

export const FeatureNovorapidButtonAsksWhatD06: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
