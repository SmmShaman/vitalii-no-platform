// FeatureFourSecondCrashesWipedB111 — feature b111 — 1280x720, 901 frames @ 30fps, VOICE-SYNCED.
// archetype 6 sidebar narrative, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat -> effect (commit a299a18 is this feature's own pipeline rewrite; no verified
// GitHub URL exists this run, so its evidence is drawn, never recorded):
// b1 15-205   "the whole queue for a school day just disappeared"
//             cornerTags over the feature's own page (backdrop "page").
// b2 206-458  "four tiny glitches... burning every retry before a real attempt ran"
//             drawn by hand (title panel + 4 crash IconCards + total panel). cardCounter
//             centers itself on the full 1920 stage and lost its left "list" column under
//             the 320px sidebar, leaving the beat's measured midpoint mostly empty — wave C.
// b3 459-698  "a crash or a glitch no longer spends one of its limited tries"
//             drawn by hand (old/new rule panels + 3 bullet IconCards) — matches commit
//             a299a18 (the pipeline rewrite). handoffExplain had the same sidebar-clipping
//             problem as b2's cardCounter — wave C. No verified URL shows the diff, so this
//             stays a schematic with the real rule change, not a recording.
// b4 699-901  "the exact four three-second crashes... can't do it again"
//             drawn only — a result panel plus a LogWindow built from this run's own
//             numbers. Never the feature page or the hub (gate 2).
//
// Persistent element: the sidebar archetype, b1 through b4 — a fixed 320px left column
// holding the running claim (a big number plus a short label) that snaps to a new value
// and new label at every beat; the big stage to its right swaps content per beat.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, Panel, IconCard, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { LogWindow, LogLine } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b111.json";

const B1 = 15;
const B2 = 206;
const B3 = 459;
const B4 = 699;
const END = 901;

/** Dawn's own accent (#2563EB) lifted brighter so it reads on the dark stage. */
const ACCENT = "#5B8DEF";
const STAGE = "#0F172A";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Sidebar geometry (1280x720): a fixed 320px left column, full height.
const COL_W = 320;

const BEATS = [
  { at: B1, value: 0, label: "LESSONS LEFT\nAFTER NOV 21" },
  { at: B2, value: 4, label: "TRIES BURNED\nBY 3-SEC GLITCHES" },
  { at: B3, value: 0, label: "TRIES A GLITCH\nCAN BURN NOW" },
  { at: B4, value: 0, label: "TRIES LOST\nNOV 23" },
];

const Sidebar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  let idx = 0;
  for (let i = 0; i < BEATS.length; i++) if (frame >= BEATS[i].at) idx = i;
  const { at, value, label } = BEATS[idx];
  const scale = punchScale(sec(frame, at, fps), 0);
  const fade = tween(sec(frame, at, fps), 0, 0.3, ease.power2Out);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: COL_W,
        height: 720,
        background: P.card,
        borderRight: `3px solid ${P.border}`,
        fontFamily,
        boxShadow: "6px 0 0 rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ position: "absolute", left: 28, top: 36, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        BOYTASKS
      </div>
      <div style={{ position: "absolute", left: 28, top: 58, width: 260, fontSize: 13, fontWeight: 600, color: P.muted, lineHeight: 1.3 }}>
        Screen time unlocks after school &amp; chore tasks
      </div>

      <div
        style={{
          position: "absolute",
          left: 28,
          top: 230,
          fontSize: 150,
          fontWeight: 800,
          color: P.ink,
          lineHeight: 1,
          opacity: fade,
          transform: `scale(${scale})`,
          transformOrigin: "left center",
        }}
      >
        {value}
      </div>

      <div
        style={{
          position: "absolute",
          left: 28,
          top: 420,
          width: 260,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 0.8,
          color: P.accent,
          lineHeight: 1.35,
          whiteSpace: "pre-line",
          opacity: fade,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const RESULT_LINES: LogLine[] = [
  { t: "nov23", text: "00:30 — nightly run starts", tone: "muted" },
  { text: "step attempt 1 — glitch caught", tone: "danger" },
  { text: "glitch does NOT burn a try", tone: "accent" },
  { text: "step attempt 1 — finished, passed", tone: "success" },
  { text: "caps held: 400 / 200 / 120 attempts", tone: "muted" },
  { text: "07:00 — window closes", tone: "muted" },
  { text: "0 tries lost to a crash", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem: a day's wall-lessons vanished, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "A day's wall-lessons vanished",
          tags: ["4 crashes", "3 sec each", "Nov 21", "0 real attempts"],
        }}
      />

      {/* b2 — drawn: four tiny glitches, each burning a real try. Full-width title
          panel, 4 crash cards spread across the stage, and a bottom total panel —
          clear of the sidebar (x >= 360), filling the frame the way b4 already does. */}
      {frame >= B2 && frame < B3 && (
        <Panel x={360} y={60} w={860} h={160} tone="danger" radius={28} opacity={1}>
          <div style={{ padding: "24px 40px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>FOUR 3-SECOND GLITCHES</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#101418", marginTop: 4 }}>
              Each crash burned one real try
            </div>
          </div>
          <StatPill x={40} y={100} emoji="💥" text="4 crashes" tone="danger" />
          <StatPill x={280} y={100} emoji="🎟️" text="4 tries burned" tone="danger" />
        </Panel>
      )}
      {frame >= B2 && frame < B3 && (
        <>
          <IconCard x={360} y={260} w={205} emoji="1️⃣" title="Crash 1" sub="1 try burned" tone="danger" />
          <IconCard x={590} y={260} w={205} emoji="2️⃣" title="Crash 2" sub="1 try burned" tone="danger" />
          <IconCard x={820} y={260} w={205} emoji="3️⃣" title="Crash 3" sub="1 try burned" tone="danger" />
          <IconCard x={1050} y={260} w={205} emoji="4️⃣" title="Crash 4" sub="1 try burned" tone="danger" />
        </>
      )}
      {frame >= B2 && frame < B3 && (
        <Panel x={360} y={500} w={860} h={140} tone="card" radius={28} opacity={1}>
          <div style={{ padding: "26px 40px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>BEFORE NOV 23</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#101418", marginTop: 4 }}>
              Every crash spent one of the day's limited tries
            </div>
          </div>
        </Panel>
      )}

      {/* b3 — drawn: the pipeline rewrite. Old/new rule side by side plus 3 bullet
          IconCards, clear of the sidebar — matches commit a299a18. No verified URL
          shows the diff, so this stays a schematic, not a recording. */}
      {frame >= B3 && frame < B4 && (
        <>
          <Panel x={360} y={60} w={410} h={140} tone="danger" radius={24} opacity={1}>
            <div style={{ padding: "24px 30px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: ACCENT }}>OLD RULE</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#101418", marginTop: 8 }}>Crash = real try burned</div>
            </div>
          </Panel>
          <Panel x={810} y={60} w={410} h={140} tone="success" radius={24} opacity={1}>
            <div style={{ padding: "24px 30px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: ACCENT }}>NEW RULE</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#101418", marginTop: 8 }}>Crash = free retry</div>
            </div>
          </Panel>
          <IconCard x={360} y={250} w={270} emoji="✅" title="Finished attempt" sub="Only that burns a try" tone="success" />
          <IconCard x={660} y={250} w={270} emoji="🔓" title="Leftover folder" sub="No longer blocks the run" tone="success" />
          <IconCard x={960} y={250} w={270} emoji="🤖" title="Two AI reviews" sub="Capped at two rounds" tone="accent" />
          <Panel x={360} y={500} w={860} h={140} tone="card" radius={28} opacity={1}>
            <div style={{ padding: "26px 40px 0" }}>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>RESULT</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#101418", marginTop: 4 }}>
                A crash no longer costs a limited try
              </div>
            </div>
          </Panel>
        </>
      )}

      {/* b4 — drawn: the exact four crashes that wiped Nov 21 can't do it again.
          Ends on the feature's own result, never the feature page or the hub (gate 2). */}
      {frame >= B4 && (
        <Panel x={370} y={70} w={840} h={210} tone="success" radius={28} opacity={1}>
          <div style={{ padding: "26px 40px 0" }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2.4, color: ACCENT }}>NOV 23 — SAME GLITCH, NEW RULE</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#101418", marginTop: 4 }}>
              4 crashes hit again — 0 tries lost
            </div>
          </div>
          <StatPill x={40} y={140} emoji="💥" text="4 crashes, same as Nov 21" tone="danger" />
          <StatPill x={420} y={140} emoji="✅" text="0 real attempts burned" tone="success" />
        </Panel>
      )}
      {frame >= B4 && (
        <>
          <IconCard x={370} y={300} w={260} emoji="🔁" title="Caps held" sub="400 / 200 / 120 attempts" tone="accent" />
          <IconCard x={660} y={300} w={260} emoji="🌙" title="Window" sub="00:30 – 07:00" tone="accent" />
          <IconCard x={950} y={300} w={260} emoji="🔓" title="No lockout" sub="Leftover folder cleared" tone="success" />
        </>
      )}
      {frame >= B4 + 45 && (
        <LogWindow
          lines={RESULT_LINES}
          title="nightly run log"
          from={B4 + 45}
          every={16}
          opacity={1}
          fontSize={22}
          win={{ x: 370, y: 430, w: 840, h: 230 }}
        />
      )}

      <Sidebar />
    </AbsoluteFill>
  );
};

export const FeatureFourSecondCrashesWipedB111: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
