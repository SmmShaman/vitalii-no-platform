// FeatureTwoKidsOneRemoteB100 — feature b100 — 1280x720, 850 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat -> effect (data only from the feature row; the three given commits
// f5dafae/14717b6/40da4b2 are all "feat(explain): ..." — a different feature,
// b99 — so none of them prove anything b100 says and none are used anywhere):
// b1 15-176   "two kids, one remote, no way to tell whose turn it was"
//             titleTakeover over the feature's own page (backdrop "page").
// b2 177-304  "each player taps in with their own PIN before every move"
//             cornerTags: PIN + random X/O + parent PIN facts, over the same
//             page scrolled further (backdrop "page2").
// b3 305-455  "a Cloudflare Worker keeps the score table running"
//             statusFocus, three claims (was handoffExplain — its camera-pan
//             gap left the frame near-empty at the beat's midpoint). No
//             recording: a background Worker has no page to show, so this is drawn.
// b4 456-654  "one tap opens the rules mid-game" — drawn only (archetype +
//             a mockup rules sheet). No verified URL shows the mid-game kiosk
//             popup, so this stays drawn rather than faked as a recording.
// b5 655-850  "one remote, one TV, a full nine-board match, no confusion" —
//             drawn only: a LogWindow built from the feature's own real
//             numbers (nine boards, PIN per player), never the page or the
//             hub (gate 2), holding at full brightness to the end.
//
// Persistent element: the card-deck archetype, b1 through b5 — nine small
// cards (one per board) start stacked ("whose turn?"), peel apart as the two
// PINs are assigned, grow a score tab, flip a RULES card, then fan into their
// final 3x3 grid with the winning line lit — the pile sorting itself is the
// through-line the archetype promises.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Panel, IconCard } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, LogLine } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b100.json";

const B1 = 15;
const B2 = 177;
const B3 = 305;
const B4 = 456;
const B5 = 655;
const END = 850;

/** Mint's own accent (#0B7A5A) reads fine on the dark stage, lifted slightly. */
const ACCENT = "#2FD9A0";
const STAGE = "#0E1813";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Card-deck geometry (1280x720, below the effects' safe bottom at y~587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const GRID_X = 300;
const GRID_Y = 609;
const CELL_W = 30;
const CELL_H = 26;
const GAP = 4;
const STACK_X = GRID_X + (CELL_W + GAP) * 1;
const STACK_Y = GRID_Y + (CELL_H + GAP) * 1;

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const fan = tween(sec(frame, B5 + 20, fps), 0, 0.8, ease.power3InOut);
  const isFanned = frame >= B5 + 20;
  const lineLit = frame >= B5 + 55;

  const status =
    frame < B2
      ? "9 BOARDS · WHOSE TURN?"
      : frame < B3
      ? "PIN → P1 = X  ·  PIN → P2 = O"
      : frame < B4
      ? "SCORE SAVED (WORKER)"
      : frame < B5
      ? "RULES CARD FLIPPED"
      : "9/9 BOARDS · MATCH WON";
  const statusTone = frame >= B5 ? P.success : frame >= B3 ? P.accent : P.muted;

  // b4: the center card (index 4) flips from "?" to "RULES".
  const flipT = tween(sec(frame, B4 + 10, fps), 0, 0.5, ease.power3InOut);
  const flipped = flipT >= 1;
  const flipDeg = mix(flipT, 0, 180);

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
        <div style={{ position: "absolute", left: LT.x + 22, top: LT.y + 14, width: 210 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>ULTIMATE</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            Tic-Tac-Toe
            <br />
            on the family TV
          </div>
        </div>
      </Arrive>

      {Array.from({ length: 9 }, (_, i) => {
        const r = Math.floor(i / 3);
        const c = i % 3;
        const finalX = GRID_X + c * (CELL_W + GAP);
        const finalY = GRID_Y + r * (CELL_H + GAP);
        const stackJitterX = (i % 3) * 2 - 2;
        const stackJitterY = (i % 4) * 2 - 3;
        const x = mix(fan, STACK_X + stackJitterX, finalX);
        const y = mix(fan, STACK_Y + stackJitterY, finalY);
        const onDiag = i === 0 || i === 4 || i === 8;
        const lit = isFanned && onDiag && lineLit;
        const isCenter = i === 4;

        if (isCenter && frame >= B4 + 10 && frame < B5 + 20) {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: CELL_W,
                height: CELL_H,
                perspective: 300,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 4,
                  background: flipped ? P.accentBg : P.card,
                  border: `1.5px solid ${flipped ? P.accentEdge : P.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: flipped ? 8 : 12,
                  fontWeight: 800,
                  color: flipped ? P.accent : P.muted,
                  transform: `rotateY(${flipDeg}deg)`,
                }}
              >
                {flipped ? "RULES" : "?"}
              </div>
            </div>
          );
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: CELL_W,
              height: CELL_H,
              borderRadius: 4,
              background: lit ? P.success : P.card,
              border: `1.5px solid ${lit ? P.success : P.border}`,
              boxShadow: "2px 2px 0 rgba(0,0,0,0.35)",
            }}
          />
        );
      })}

      <Arrive at={B1 + 20} kind="rise" box={{ x: GRID_X, y: LT.y - 2, w: 420, h: 20 }}>
        <div
          style={{
            position: "absolute",
            left: GRID_X,
            top: LT.y - 2,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: statusTone,
            whiteSpace: "nowrap",
          }}
        >
          {status}
        </div>
      </Arrive>
    </div>
  );
};

const RULES_LINES: LogLine[] = [
  { t: "P1", text: "PIN verified → X", tone: "accent" },
  { t: "P2", text: "PIN verified → O", tone: "accent" },
  { text: "9 boards in play", tone: "muted" },
  { text: "Big board: 3 in a row", tone: "success" },
  { text: "Match result: 9-board win", tone: "success" },
  { text: "Score table updated (Worker)", tone: "accent" },
  { text: "Next match ready — PIN only", tone: "muted" },
];

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
        data={{ title: "Whose turn was it?", kicker: "Two kids, one remote, one TV" }}
      />

      {/* b2 — PIN login, random X/O, parent PIN */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Every player taps in with their own PIN",
          tags: ["PIN before every move", "Random X or O", "Parents get a PIN too", "Kiosk game button"],
        }}
      />

      {/* b3 — the Cloudflare Worker score table (invisible plumbing, no page to show) */}
      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Score tracking",
          claims: [
            { text: "Score used to reset after every match", verdict: "no" },
            { text: "Now the score is saved match to match", verdict: "yes" },
            { text: "Runs on a Cloudflare Worker — no extra sign-in", verdict: "yes" },
          ],
        }}
      />

      {/* b4 — drawn: the mid-game rules sheet (no verified URL for this popup) */}
      {frame >= B4 && frame < B5 && (
        <Panel x={140} y={90} w={1000} h={420} tone="note" radius={28} opacity={1}>
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "space-around", padding: "0 40px" }}>
            <IconCard x={0} y={0} w={260} emoji="📖" title="Rules button" sub="Opens mid-game" tone="accent" />
            <IconCard x={0} y={0} w={260} emoji="🧩" title="Board stays" sub="Nothing resets" tone="success" />
            <IconCard x={0} y={0} w={260} emoji="🧒" title="Kid-level text" sub="Small board wins the big one" tone="danger" />
          </div>
        </Panel>
      )}

      {/* b5 — drawn: the product "in action" via a built log, ending on the real result */}
      {frame >= B5 && (
        <LogWindow lines={RULES_LINES} title="match log" from={B5 + 10} every={16} opacity={1} fontSize={22} />
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureTwoKidsOneRemoteB100: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
