// FeatureAdminCanSwitchExplainerB103 — feature b103 — 1280x720, 964 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// A persistent admin-nav sidebar (archetype 6) lists the feature's three real parts —
// Narration Voice, TTS Fallback, Cost Tracking — each moving from pending to done as
// its own beat lands. One editorial effect per voice beat behind it, chosen by what
// changes on screen; cuts not fades; a reading hold at the end.
//
// Beat -> effect (data only from the feature row, no invented numbers):
// b1  15-252   "the voice was hardcoded, nobody could see the cost"
//              cornerTags over the feature's own page (backdrop) — the only verified
//              URL used tonight. Sidebar item 1 = problem state.
// b2  261-403  "an admin card swaps the voice per language, no deploy"
//              copyCorrection (hardcoded in code -> admin switches, no deploy);
//              sidebar item 1 flips to done.
// b3  403-589  "every render tries one TTS engine first, falls back if it fails"
//              pipelineFlow (primary engine -> call fails -> fallback engine);
//              sidebar item 2 = active, then done.
// b4  589-786  "AI time, voice, and render minutes get logged instead of guessed"
//              funnelAbsorption (three cost inputs -> one tracked number);
//              sidebar item 3 = active.
// b5  786-919  "one card now shows all three costs, added up, per video"
//              no catalog effect — a LogWindow (no runtime log kept on the VPS for
//              this project, so the lines are built from the feature's own parts)
//              carries the result alone; sidebar item 3 flips to done; holds to END.
//
// Persistent element: the sidebar (archetype 6), b1 through b5, always on top.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import { LogWindow, type LogLine } from "./live-primitives";
import shotsFile from "./shots/b103.json";

const B1 = 15;
const B2 = 261;
const B3 = 403;
const B4 = 589;
const B5 = 786;
const END = 964;

const ACCENT = "#C9712E";
const STAGE = "#17120B";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type ItemState = "pending" | "active" | "done";

const SidebarItem: React.FC<{ y: number; title: string; note: string; state: ItemState; punch: number }> = ({
  y,
  title,
  note,
  state,
  punch,
}) => {
  const P = usePalette();
  const dot = state === "done" ? P.success : state === "active" ? P.accent : P.muted;
  const bg = state === "done" ? P.successBg : state === "active" ? P.accentBg : "transparent";
  const border = state === "done" ? P.successEdge : state === "active" ? P.accentEdge : "transparent";
  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        top: y,
        width: 240,
        height: 112,
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 6,
        padding: "16px 18px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: dot,
            transform: `scale(${punch})`,
          }}
        />
        <div style={{ fontSize: 18, fontWeight: 800, color: P.ink, letterSpacing: 0.2 }}>{title}</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.4, color: P.muted, marginTop: 10 }}>
        {state === "pending" ? "PENDING" : note}
      </div>
    </div>
  );
};

/** The sidebar: archetype 6, persistent for the whole clip, always on top. */
const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const voiceState: ItemState = frame < B2 ? "active" : "done";
  const fallbackState: ItemState = frame < B3 ? "pending" : frame < B4 ? "active" : "done";
  const costState: ItemState = frame < B4 ? "pending" : frame < B5 ? "active" : "done";

  const punchAt = (at: number) => punchScale(sec(frame, at, fps), 0);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 280,
          height: 720,
          background: "rgba(14,11,7,0.94)",
          borderRight: `2px solid ${P.border}`,
        }}
      />
      <div style={{ position: "absolute", left: 20, top: 52, fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        ADMIN · EXPLAIN
      </div>
      <SidebarItem y={100} title="Narration Voice" note="PER LANGUAGE" state={voiceState} punch={punchAt(B2)} />
      <SidebarItem y={236} title="TTS Fallback" note="AUTOMATIC" state={fallbackState} punch={punchAt(B4)} />
      <SidebarItem y={372} title="Cost Tracking" note="PER VIDEO" state={costState} punch={punchAt(B5)} />
    </div>
  );
};

/** Built from the feature's own parts — no runtime log kept on the VPS for this project. */
const RESULT_LOG: LogLine[] = [
  { t: "01", text: "render start: engine = primary TTS", tone: "muted" },
  { t: "02", text: "ai_time: logged", tone: "accent" },
  { t: "03", text: "voice_generation: logged", tone: "accent" },
  { t: "04", text: "render_minutes: logged", tone: "accent" },
  { t: "05", text: "cost_total: computed per video", tone: "success" },
  { t: "06", text: "admin_card: shows combined total", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page (the only verified URL tonight) */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{
          statement: "Hardcoded voice, no cost visibility",
          tags: ["Change needs a deploy", "No per-video cost"],
        }}
      />

      {/* b2 — the fix: an admin card swaps the voice, no deploy */}
      <MotionInsert
        effect="copyCorrection"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          wrong: "Voice hardcoded in code",
          right: "Admin switches voice, no deploy",
          label: "Voice settings",
        }}
      />

      {/* b3 — the fallback chain: primary engine -> call fails -> fallback engine */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          steps: ["Primary TTS engine", "Call fails", "Fallback engine"],
          result: "Line still spoken",
          system: "TTS fallback chain",
        }}
      />

      {/* b4 — three cost inputs funnel into one tracked number */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          inputs: ["AI time", "Voice generation", "Render minutes"],
          result: "One cost number, per video",
        }}
      />

      {/* b5 — the verified result, carried by the log alone; holds to the end, no fade */}
      {frame >= B5 && (
        <LogWindow
          lines={RESULT_LOG}
          title="explain-render"
          from={B5 + 10}
          every={28}
          opacity={1}
          win={{ x: 340, y: 150, w: 560, h: 420 }}
          fontSize={22}
        />
      )}

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureAdminCanSwitchExplainerB103: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
