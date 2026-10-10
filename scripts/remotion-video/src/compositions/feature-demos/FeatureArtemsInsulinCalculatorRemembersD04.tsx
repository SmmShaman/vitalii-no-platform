// FeatureArtemsInsulinCalculatorRemembersD04 — feature d04 — 1280x720, 954 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood dawn. Motion direction (feature-motion skill, 2026-10-07).
//
// Split-duel lower third: a danger-toned "chaos" panel (left) against a success-toned
// "order" panel (right), divided by a slider that starts chaos-dominant and slides to
// order-dominant once the automatic logging lands — the archetype's "divider slides to
// reveal the win," compressed into the y>=606 band so the effects above own the rest
// of the stage (feature-motion skill convention, same geometry as p75's lower third).
//
// Beat → picture (data only from the feature row; none of the three given commits —
// 02ed872, f3234bf, df2d642 — say what any beat says, so no commit diff appears):
// b1 15-194   "lived only in their heads, or on a scrap of paper"
//             keywordCaption, dimmed LiveBackdrop of the feature's own page. Lower
//             third wipes in chaos-dominant; the product name plate rises over it.
// b2 203-338  "No record for the doctor. No history of how his settings changed."
//             funnelAbsorption: three missing-record facts collapse into one outcome.
// b3 347-543  "guessing from a label in a language nobody could read fast enough"
//             Drawn scene (no catalog effect or commit fits): a nutrition label card,
//             a stopwatch, a struck-through guessed number.
// b4 552-700  "every dose and setting change gets logged automatically, with a timestamp"
//             Full-stage LogWindow — six timestamped journal lines revealed one by one.
//             The lower third's divider slides chaos → order while an entry counter ticks.
// b5 709-954  "a photo of the meal, read by AI vision, fills in the carbs"
//             copyCorrection: the old guess struck, the one-photo fix arrives and holds
//             to the final frame. The clip's one tech caption glosses "AI vision" here.
//
// Persistent element: the split-duel lower third (archetype 0), b1 through b5, y>=606.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Panel, StickyNote, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/d04.json";

const B1 = 15;
const B2 = 203;
const B3 = 347;
const B4 = 552;
const B5 = 709;
const END = 954;

const ACCENT = "#2563EB";
const STAGE = "#10151D";

// Lower third geometry — same band as the flow-map reference (y>=606, safe-bottom clear above).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const shift = tween(sec(frame, B4, fps), 0, 0.6, ease.power3InOut);
  const chaosFrac = frame >= B4 ? mix(shift, 0.78, 0.16) : 0.78;
  const dividerX = LT.x + chaosFrac * LT.w;
  const entries = frame >= B4 ? Math.min(6, Math.floor((frame - B4) / 20) + 1) : 0;

  const chaosLine = frame < B2 ? "In their heads, or on paper" : frame < B3 ? "No record for the doctor" : "Guessing from an unreadable label";
  const orderLine = frame < B5 ? "Every dose timestamped" : "Carbs read from one photo";

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LT} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LT.x,
            top: LT.y,
            width: dividerX - LT.x,
            height: LT.h,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            borderRadius: 4,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "absolute", left: 16, top: 10, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.danger, whiteSpace: "nowrap" }}>
            🧠 HEADS &nbsp; 📝 PAPER
          </div>
          <div style={{ position: "absolute", left: 16, top: 36, fontSize: 14, fontWeight: 700, color: P.ink, whiteSpace: "nowrap" }}>{chaosLine}</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: dividerX,
            top: LT.y,
            width: LT.x + LT.w - dividerX,
            height: LT.h,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            borderRadius: 4,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "absolute", left: 16, top: 10, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.success, whiteSpace: "nowrap" }}>
            ✅ DOSE JOURNAL
          </div>
          <div style={{ position: "absolute", left: 16, top: 36, fontSize: 14, fontWeight: 700, color: P.ink, whiteSpace: "nowrap" }}>{orderLine}</div>
          {entries > 0 && (
            <div style={{ position: "absolute", right: 16, top: 30, fontSize: 24, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums" }}>
              {entries} logged
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: dividerX - 2, top: LT.y, width: 4, height: LT.h, background: P.ink }} />
      </Arrive>

      {frame >= B1 + 20 && frame < B2 && (
        <Arrive at={B1 + 20} kind="rise" box={{ x: LT.x + 16, y: LT.y - 48, w: 320, h: 34 }}>
          <div
            style={{
              position: "absolute",
              left: LT.x + 16,
              top: LT.y - 48,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0.4,
              color: P.ink,
              background: P.card,
              border: `2px solid ${P.border}`,
              borderRadius: 4,
              padding: "5px 12px",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
            }}
          >
            INSULIN SIMULATOR
          </div>
        </Arrive>
      )}
    </div>
  );
};

const DrawnLabelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const visible = cut(frame, B3, B4) === 1;
  if (!visible) return null;
  const t = Math.min(1, (frame - B3) / 20);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: STAGE }} />
      <AbsoluteFill style={{ background: `rgba(8,8,8,${PLATE})` }} />
      <Panel x={120} y={110} w={560} h={300} tone="card">
        <div style={{ position: "absolute", left: 24, top: 22, fontSize: 13, fontWeight: 800, letterSpacing: 1.8, color: P.muted }}>
          NÆRINGSINNHOLD / PER 100 G
        </div>
        <div style={{ position: "absolute", left: 24, top: 56, fontSize: 32, fontWeight: 800, color: P.ink, opacity: t }}>Karbohydrater: 34,2 g</div>
        <div style={{ position: "absolute", left: 24, top: 108, fontSize: 18, fontWeight: 600, color: P.muted, opacity: t }}>hvorav sukkerarter: 4,1 g</div>
        <div style={{ position: "absolute", left: 24, top: 142, fontSize: 18, fontWeight: 600, color: P.muted, opacity: t }}>Fett: 9,0 g — Protein: 6,3 g</div>
        <div style={{ position: "absolute", left: 24, top: 190, fontSize: 15, fontWeight: 700, color: P.danger }}>a label nobody at the table reads fast</div>
      </Panel>
      <IconCard x={740} y={130} w={200} emoji="⏱" title="No time" sub="to translate it" tone="danger" />
      <StickyNote x={980} y={150} w={220} text="~30 g? guessing" rotate={-4} opacity={Math.min(1, Math.max(0, (frame - B3 - 30) / 20))} />
    </AbsoluteFill>
  );
};

const DoseLog: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = cut(frame, B4, B5) === 1;
  if (!visible) return null;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: STAGE }} />
      <AbsoluteFill style={{ background: `rgba(8,8,8,${PLATE})` }} />
      <LogWindow
        title="dose journal"
        from={B4}
        every={20}
        opacity={1}
        fontSize={22}
        win={{ x: 40, y: 50, w: 1200, h: 530 }}
        lines={[
          { text: "07:42  dose logged: 4.5 U (meal)" },
          { text: "07:42  carbs: 38 g, factor: 1:11" },
          { text: "11:05  correction dose: 1.0 U" },
          { text: "14:30  setting changed: target 5.5 -> 6.0 mmol/L" },
          { text: "18:15  dose logged: 5.0 U (meal)" },
          { text: "18:15  carbs: 45 g, factor: 1:11" },
        ]}
      />
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, dimmed over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.03} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{ line1: "Lived only in their heads", line2: "or on a scrap of paper", keywords: ["heads", "paper"] }}
      />

      {/* b2 — nothing to show the doctor */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        base={STAGE}
        data={{
          inputs: ["No written log", "No dose history", "No settings record"],
          result: "Doctor gets nothing to review",
        }}
      />

      {/* b3 — guessing carbs off an unreadable label (drawn, no catalog/commit fit) */}
      <DrawnLabelScene />

      {/* b4 — automatic timestamped logging, shown as the real journal */}
      <DoseLog />

      {/* b5 — one photo, AI vision fills in the carbs; holds to the final frame */}
      <MotionInsert
        effect="copyCorrection"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{
          wrong: "Guessing carbs from a label you can't read fast enough",
          right: "One photo — AI vision reads the carbs",
          label: "NOW",
        }}
      />
      {frame >= B5 + 40 && (
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 40,
            maxWidth: 420,
            textAlign: "right",
            fontSize: 17,
            fontWeight: 700,
            color: "#DCE6F5",
            background: "rgba(10,14,20,0.55)",
            borderRadius: 8,
            padding: "6px 14px",
            fontFamily,
          }}
        >
          AI vision — software that reads a photo
        </div>
      )}

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureArtemsInsulinCalculatorRemembersD04: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
