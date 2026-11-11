// FeatureSchoolLettersComeAsB83 — feature b83 — 1280x720, 889 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → picture (data only from this feature's own page + SchoolMessages.tsx):
// b1 15-205   "One shared card, four boys" — titleTakeover over the feature's own
//             LiveBackdrop (shot "page"). Ledger enters the band at "0/4"/danger —
//             nothing personalized yet.
// b2 205-349  "I read it myself, tell each boy by hand" — pipelineFlow, drawn only
//             (the manual sorting step has no public page). Ledger stays "0/4".
// b3 349-536  "Two new Postgres columns, each boy's own voice" — handoffExplain
//             over the feature's own page again. Ledger flips to "4/4"/success here,
//             with a small punch — this is the fix.
// b4 536-692  "Who sent it, to the minute" — cornerTags over the page scrolled to
//             the result section (shot "page2"). Ledger unchanged, "4/4"/success.
// b5 692-889  "Four boys, four distinct letters" — fully drawn: the ledger goes BIG,
//             old 0/4 struck through, 4/4 in green, plus a LogWindow (school_messages)
//             listing SchoolMessages.tsx's own real columns/helpers. Holds to END at
//             full brightness, no fade. Neither the feature page nor the hub appears.
//
// Persistent element: the ledger total (archetype 5) — small in the lower-third band
// (y >= 600) for b1-b4 while a catalog effect owns the stage above it, BIG only in b5
// (the one beat with no competing catalog effect). Gate 2: b5 ends on a drawn result
// (ledger + LogWindow), not a page.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b83.json";

const B1 = 15;
const B2 = 205;
const B3 = 349;
const B4 = 536;
const B5 = 692;
const END = 889;

const ACCENT = "#2563EB";
const STAGE = "#0F172A";

/** Lower-third band (1280x720) — the ledger's 4 boy-chips + total pill while a
    catalog effect sits above it (b1-b4). */
const BAND = { x: 40, y: 605, w: 1200, h: 100 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** archetype 5 — the running ledger total, present every beat, BIG only in b5
    (the one beat with no catalog effect competing for the upper frame). The
    total flips once, at B3, from the stated deficit (0/4) to parity (4/4). */
const LedgerFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= B3;
  const color = flipped ? P.success : P.danger;
  const bg = flipped ? P.successBg : P.dangerBg;
  const status = flipped ? "OWN VOICE" : "NOT YET OWN";
  const value = flipped ? "4/4" : "0/4";

  if (frame >= B5) {
    const t = tween(sec(frame, B5 + 4, fps), 0, 0.5, ease.power3Out);
    const strikeT = tween(sec(frame, B5 + 14, fps), 0, 0.4, ease.power2Out);
    return (
      <div style={{ position: "absolute", left: 80, top: 128, width: 820, fontFamily, opacity: t }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 2, color: "rgba(226,232,240,0.6)" }}>
          PERSONALIZED LETTERS LEDGER
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: P.muted,
              textDecoration: strikeT > 0.5 ? "line-through" : "none",
              opacity: 0.55,
            }}
          >
            0/4
          </div>
          <div style={{ fontSize: 118, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color: P.success }}>
            4/4
          </div>
        </div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <LedgerRow label="SHARED CARD (OLD)" value="1 generic card" P={P} />
          <LedgerRow label="OWN LETTERS (NEW)" value="4 own voices" P={P} />
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
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          ONE CARD BECAME FOUR VOICES
        </div>
      </div>
    );
  }

  const flipPunch = flipped ? Math.max(0, punchScale(sec(frame, B3, fps), 0) - 1) : 0;
  const boys = [1, 2, 3, 4];
  return (
    <Arrive at={B1 + 4} kind="wipe" box={BAND} dur={0.4}>
      <div style={{ position: "absolute", left: BAND.x, top: BAND.y, width: BAND.w, fontFamily }}>
        <div style={{ display: "flex", gap: 18, marginBottom: 12 }}>
          {boys.map((n) => (
            <div
              key={n}
              style={{
                width: 150,
                background: P.card,
                borderRadius: 4,
                border: `1.5px solid ${color}`,
                padding: "8px 14px",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.35)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: P.muted, letterSpacing: 0.5 }}>{`BOY ${n}`}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color }}>{flipped ? "own letter" : "shared card"}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            padding: "7px 20px",
            borderRadius: 4,
            background: bg,
            border: `2px solid ${color}`,
            boxShadow: "4px 4px 0 rgba(0,0,0,0.35)",
            transform: `scale(${1 + flipPunch * 0.15})`,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color, whiteSpace: "nowrap" }}>{value}</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>PERSONALIZED</div>
            <div style={{ fontSize: 13, fontWeight: 800, color }}>{status}</div>
          </div>
        </div>
      </div>
    </Arrive>
  );
};

const LedgerRow: React.FC<{ label: string; value: string; P: ReturnType<typeof usePalette> }> = ({ label, value, P }) => (
  <div style={{ display: "flex", justifyContent: "space-between", width: 420, fontSize: 24, fontWeight: 700 }}>
    <span style={{ color: P.ink }}>{label}</span>
    <span style={{ color: P.success }}>{value}</span>
  </div>
);

/** b1 — small product plate naming the real product and the real page, over the
    LiveBackdrop + titleTakeover. Carries the clip's one emoji (single codepoint). */
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
        background: "rgba(15,23,42,0.85)",
        border: "1.5px solid #93C5FD",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        color: "#F8FAFC",
        opacity: t,
        maxWidth: 560,
        lineHeight: 1.4,
        fontFamily,
      }}
    >
      <span style={{ fontWeight: 800, letterSpacing: 1 }}>💬 VITALII.NO — SCHOOL MESSAGES</span>
      <br />
      <span style={{ fontWeight: 500, opacity: 0.85 }}>one shared card, read out for every boy at once</span>
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { text: "SchoolMessages.tsx -> say_no / say_ua columns", tone: "accent" },
  { text: "4 boys, 4 distinct first-person letters", tone: "success" },
  { text: "formatWhen() -> sender + exact minute", tone: "ink" },
  { text: "cropped photo per sender", tone: "muted" },
  { text: "0 shared cards left", tone: "danger" },
  { text: "4/4 personalized", tone: "success" },
];

/** b5 — the result, fully drawn: LogWindow with this feature's own real fields.
    Holds to END at full brightness, no fade. */
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
        title="school_messages"
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
          top: 540,
          width: 1100,
          fontSize: 24,
          fontWeight: 700,
          color: "#E2E8F0",
          opacity: captionIn,
          fontFamily,
        }}
      >
        Four boys, four distinct letters — each in his own voice, not one shared card.
      </div>
    </>
  );
};

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
        plate={0.78}
        data={{ title: "One shared card", kicker: "Four boys, one school tone, every letter" }}
      />
      <ProductPlate />

      {/* b2 — the manual sorting step, drawn only (no public page for it) */}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.78}
        data={{
          steps: ["One shared card arrives", "I read it myself", "I tell each boy by hand"],
          result: "Sorted by hand, every time",
          system: "SchoolMessages.tsx",
        }}
      />

      {/* b3 — the fix, over the feature's own page again */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.78}
        data={{
          from: "One shared, formal card",
          to: "Each boy's own voice",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Two new Postgres columns", "First-person, NO + UA", "SchoolMessages.tsx"],
        }}
      />

      {/* b4 — the evidence, over the page scrolled to the result section */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="cornerTags"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.78}
        data={{
          statement: "Who sent it, to the minute",
          tags: ["His own cropped photo", "Sender from the signature", "Received, to the minute"],
        }}
      />

      {/* b5 — the result, fully drawn, holds to the end */}
      <ClosingBeat />

      <LedgerFigure />
    </AbsoluteFill>
  );
};

export const FeatureSchoolLettersComeAsB83: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
