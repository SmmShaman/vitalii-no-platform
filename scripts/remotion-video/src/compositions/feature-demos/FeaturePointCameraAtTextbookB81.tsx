// FeaturePointCameraAtTextbookB81 — feature b81 — 1280x720, 883 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card deck, mood violet. Motion direction v2 (feature-motion skill, 2026-11-10).
//
// Beat → effect (data only from the feature row; no commit matches this story, so the
// mechanism is drawn from the feature's own words — ingestion script, lookup script,
// AI agent, database — never from the three "flyt" login commits):
// b1 15-168   "a child gets stuck on a printed page with no digital copy"
//             cornerTags: the one fact (no digital copy) ringed by who/what/where/how-much.
// b2 168-418  "someone dug up the book, flipped, worked it out by hand — every time"
//             pipelineFlow: the three manual steps, landing on "redone every single time".
// b3 418-580  "now one photo is read once, the answer saved in a database"
//             handoffExplain: flip-and-solve (before) → photographed-and-read-once (now).
// b4 580-707  "next time that page comes up again, it's just pulled back up"
//             copyCorrection: "explain again" struck through, "pulled back up" approved.
// b5 707-883  "read once, reused forever — no page gets explained twice"
//             keywordCaption holding to the end; the card deck itself shows the result.
//
// Persistent element: the card deck lower third (archetype 3) — five page cards in a
// pile; one peels into the database at b3, pulses to show reuse at b4, the rest fan
// out as still-unseen pages at b5. Effects keep the bottom clear (look.safeBottom) —
// that is where the deck sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, CaptionBand } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b81.json";

const B1 = 15;
const B2 = 168;
const B3 = 418;
const B4 = 580;
const B5 = 707;
const END = 883;

/** Accent tuned for the dark stage (violet's #5B37D4 reads flat on a plate). */
const ACCENT = "#B9A6FF";
const STAGE = "#140F2B";

// Lower third geometry (1280x720, below the effects' safe bottom at y~587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LABEL_X = LT.x + 22;
const PILE_X = 310;
const PILE_Y = LT.y + 14;
const CARD_W = 46;
const CARD_H = 62;
const DB_X = 540;
const DB_Y = LT.y + 14;
const FAN_X = 760;
const FAN_GAP = 68;

const PEEL_AT = 440;
const PEEL_DUR = 70;
const PULSE_AT = 600;
const FAN_AT = 717;
const FAN_DUR = 40;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

function labelFor(frame: number): [string, string] {
  if (frame < B2) return ["5 pages,", "0 lookups"];
  if (frame < B3) return ["Flip the book,", "solve by hand"];
  if (frame < B4) return ["Page 1: read once,", "saved to the database"];
  if (frame < B5) return ["Same page?", "Pulled back up"];
  return ["Any page,", "solved forever"];
}

const Card: React.FC<{ x: number; y: number; tone: "danger" | "success"; label: string }> = ({ x, y, tone, label }) => {
  const P = usePalette();
  const bg = tone === "success" ? P.successBg : P.dangerBg;
  const edge = tone === "success" ? P.successEdge : P.dangerEdge;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        background: bg,
        border: `2px solid ${edge}`,
        borderRadius: 5,
        boxShadow: "3px 3px 0 rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
      }}
    >
      {label}
    </div>
  );
};

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const [line1, line2] = labelFor(frame);

  const peelP = tween(sec(frame, PEEL_AT, fps), 0, PEEL_DUR / fps, ease.power3Out);
  const peeled = frame >= PEEL_AT + PEEL_DUR;
  const card0X = mix(peelP, PILE_X, DB_X);
  const card0Y = mix(peelP, PILE_Y, DB_Y);

  const fanP = tween(sec(frame, FAN_AT, fps), 0, FAN_DUR / fps, ease.power3Out);

  const pulse = frame >= PULSE_AT ? punchScale(sec(frame, PULSE_AT, fps), 0, 1, 1.12, 0.18, 0.22) : 1;

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
        <div style={{ position: "absolute", left: LABEL_X, top: LT.y + 16, width: 220 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>THE STACK</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            {line1}
            <br />
            {line2}
          </div>
        </div>
      </Arrive>

      {/* pile cards 1-4: still-unseen pages, fan out at b5 */}
      {[1, 2, 3, 4].map((i) => {
        const j = i - 1;
        const pileX = PILE_X + i * 7;
        const pileY = PILE_Y - i * 5;
        const fanX = FAN_X + j * FAN_GAP;
        const x = mix(fanP, pileX, fanX);
        const y = mix(fanP, pileY, PILE_Y);
        return <Card key={i} x={x} y={y} tone="danger" label="📄" />;
      })}

      {/* card 0: the page that gets read once and parked in the database */}
      <div style={{ transform: `scale(${peeled ? pulse : 1})`, transformOrigin: `${card0X + CARD_W / 2}px ${card0Y + CARD_H / 2}px` }}>
        <Card x={card0X} y={card0Y} tone={peeled ? "success" : "danger"} label={peeled ? "💾" : "📄"} />
      </div>

      {frame >= PULSE_AT && (
        <div
          style={{
            position: "absolute",
            left: DB_X + CARD_W + 10,
            top: DB_Y + 18,
            fontSize: 14,
            fontWeight: 800,
            color: P.success,
            opacity: tween(sec(frame, PULSE_AT, fps), 0, 0.3, ease.power2Out),
          }}
        >
          reused ✓
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A child is stuck on a printed textbook page",
          tags: ["One specific child", "Printed textbook", "One exact page", "Zero digital copies"],
        }}
      />
      {frame >= B1 && frame < B2 && (
        <CaptionBand
          y={26}
          tone="accent"
          fontSize={17}
          text="🎒 Boytasks — YouTube unlocks only after school and chore tasks are done"
          opacity={tween(sec(frame, B1, 30), 0, 0.4, ease.power2Out)}
        />
      )}

      {/* b2 — the manual loop, over the feature's own page further down */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Dig up the real book", "Flip to the page", "Work it out by hand"],
          result: "Redone every single time",
          system: "No lookup existed",
        }}
      />

      {/* b3 — the fix: drawn, no commit matches this feature */}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          from: "Flip pages, solve by hand",
          to: "Photographed, read once",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["One photo of the page taken", "AI agent reads it once", "Answer saved to a database"],
        }}
      />

      {/* b4 — reuse, drawn */}
      <MotionInsert
        effect="copyCorrection"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          wrong: "Explain this page again",
          right: "Pulled back up instantly",
          label: "Next time",
        }}
      />

      {/* b5 — the result, holds to the end; the card deck itself shows it, never the page */}
      <MotionInsert
        effect="keywordCaption"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        plate={0.7}
        data={{
          line1: "Read once,",
          line2: "reused forever.",
          keywords: ["once", "reused", "forever"],
        }}
      />

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeaturePointCameraAtTextbookB81: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
