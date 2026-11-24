// FeatureKidsCanAskExplainerB102 — feature b102 — 1280x720, 901 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A persistent receipt-style ledger (archetype 5) lists the feature's four real parts —
// Ask by voice, TTS confirms, Parent sees it, Daily cap — each row flipping from pending
// to active to done as its own beat lands. One editorial effect per voice beat behind
// it, chosen by what changes on screen; cuts not fades; a reading hold at the end.
//
// Beat -> effect (data only from the feature row, no invented numbers):
// b1  15-283   "a curious kid had no way to ask... the question just went nowhere"
//              statusFocus over the feature's own page (backdrop) — the only verified
//              URL used tonight; two claims, both "no".
// b2  283-399  "a child holds one button and simply speaks the question"
//              pipelineFlow (tap the button -> speak -> request captured);
//              ledger row 1 "Ask by voice" flips to done.
// b3  399-551  "text-to-speech reads it back... confirm before it's ever queued"
//              copyCorrection (submitted silently -> TTS reads it back first);
//              ledger row 2 "TTS confirms" = active, then done.
// b4  551-728  "parents see every question land... cancel... or type it themselves"
//              cornerTags (central claim + the two parent controls);
//              ledger row 3 "Parent sees it" = active, then done.
// b5  728-901  "the shared queue is capped at 2 questions per child, every day"
//              no catalog effect — the ledger's total row lands on the real cap, and a
//              LogWindow (no runtime log kept on the VPS for this product, so the lines
//              are built from the feature's own parts) carries the result; holds to END.
//
// Persistent element: the ledger (archetype 5), b1 through b5, always on top.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import { LogWindow, type LogLine } from "./live-primitives";
import shotsFile from "./shots/b102.json";

const B1 = 15;
const B2 = 283;
const B3 = 399;
const B4 = 551;
const B5 = 728;
const END = 901;

const ACCENT = "#5B8DFF";
const STAGE = "#0B1220";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type RowState = "pending" | "active" | "done";

/** One receipt line: label, dotted leader, value. */
const LedgerRow: React.FC<{ y: number; label: string; value: string; state: RowState; punch: number }> = ({
  y,
  label,
  value,
  state,
  punch,
}) => {
  const P = usePalette();
  const color = state === "done" ? P.success : state === "active" ? P.accent : P.muted;
  const text = state === "pending" ? "—" : state === "active" ? "…" : value;
  return (
    <div style={{ position: "absolute", left: 28, top: y, width: 324, display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 17, fontWeight: 700, color: P.ink, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ flex: 1, borderBottom: `2px dotted ${P.border}`, marginBottom: 4 }} />
      <span
        style={{
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: 0.6,
          color,
          transform: `scale(${punch})`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** The ledger: archetype 5, persistent for the whole clip, always on top. */
const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const askState: RowState = frame < B2 ? "active" : "done";
  const ttsState: RowState = frame < B3 ? "pending" : frame < B4 ? "active" : "done";
  const parentState: RowState = frame < B4 ? "pending" : frame < B5 ? "active" : "done";
  const capState: RowState = frame < B5 ? "pending" : "done";

  const punchAt = (at: number) => punchScale(sec(frame, at, fps), 0);

  const X = 860;
  const Y = 70;
  const W = 380;
  const H = 400;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: X,
          top: Y,
          width: W,
          height: H,
          background: "rgba(255,255,255,0.97)",
          border: `2px solid ${P.border}`,
          borderRadius: 10,
          boxShadow: "10px 10px 0 rgba(0,0,0,0.35)",
          padding: "26px 28px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>ASK TO EXPLAIN</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: P.muted, marginTop: 4 }}>Ber · Family Network</div>

        <LedgerRow y={76} label="Ask by voice" value="SPOKEN" state={askState} punch={punchAt(B2)} />
        <LedgerRow y={114} label="TTS confirms" value="PLAYED BACK" state={ttsState} punch={punchAt(B4)} />
        <LedgerRow y={152} label="Parent sees it" value="VISIBLE" state={parentState} punch={punchAt(B5)} />

        <div style={{ position: "absolute", left: 28, top: 200, width: 324, borderTop: `2px solid ${P.border}` }} />

        <div style={{ position: "absolute", left: 28, top: 222, width: 324 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1.2, color: P.ink }}>DAILY CAP</div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: capState === "done" ? P.success : P.muted,
              marginTop: 6,
              transform: `scale(${punchAt(B5)})`,
            }}
          >
            {capState === "done" ? "2 / CHILD" : "— / CHILD"}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Built from the feature's own parts — no runtime log kept on the VPS for this product. */
const RESULT_LOG: LogLine[] = [
  { t: "01", text: "explain_request: voice captured", tone: "muted" },
  { t: "02", text: "tts_playback: confirmed before queue", tone: "accent" },
  { t: "03", text: "parent_dashboard: request visible", tone: "accent" },
  { t: "04", text: "capacity_note: shown before asking", tone: "accent" },
  { t: "05", text: "daily_cap: 2 per child enforced", tone: "success" },
  { t: "06", text: "queue: shared across family", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page (the only verified URL tonight) */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="statusFocus"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{
          title: "Before",
          claims: [
            { text: "Kid can ask for an explainer?", verdict: "no" },
            { text: "Parent sees the question?", verdict: "no" },
          ],
        }}
      />

      {/* b2 — the fix: one button, the question is spoken, the request is captured */}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          steps: ["Tap ❓ Explain", "Speak the question", "Request captured"],
          result: "No typing needed",
          system: "Voice ask",
        }}
      />

      {/* b3 — TTS reads the question back before it is ever queued */}
      <MotionInsert
        effect="copyCorrection"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          wrong: "Question submitted silently",
          right: "TTS reads it back before it's queued",
          label: "Confirm step",
        }}
      />

      {/* b4 — parents see every question land, and can cancel or type one themselves */}
      <MotionInsert
        effect="cornerTags"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          statement: "Parents see every question",
          tags: ["Cancel a pending one", "Or type it themselves"],
        }}
      />

      {/* b5 — the verified result, carried by the ledger total + the log alone; holds to the end, no fade */}
      {frame >= B5 && (
        <LogWindow
          lines={RESULT_LOG}
          title="explain-queue"
          from={B5 + 10}
          every={28}
          opacity={1}
          win={{ x: 70, y: 150, w: 560, h: 420 }}
          fontSize={22}
        />
      )}

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureKidsCanAskExplainerB102: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
