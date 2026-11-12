// FeatureOneAudioPlayerFollowsE05 — feature e05 — 1280x720, 906 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row):
// b1 15-153   "leaving a page used to cut off whatever you were listening to"
//             quoteMarker over the feature's own page. In the lower third three small
//             player chips sit spread apart — the only mover after the band lands.
// b2 153-324  "three separate players ran the show... never remembered where it stopped"
//             statusFocus (3 claims, all "no") over the hub — many separate cards echo
//             the fragmentation. The three chips draw closer together.
// b3 324-479  "like three radios in one house, each forgetting you"
//             keywordCaption over the page, pushed in tighter. The chips start to overlap.
// b4 479-647  "one player follows you everywhere, built on the Media Session API"
//             handoffExplain, drawn over a tight push-in on the page — the ONE tech
//             caption ("Media Session API") lands as two of the three chips fade and
//             the third enlarges into the surviving PlayerDock.
// b5 647-906  "switching pages no longer stops the sound... three players down to one"
//             drawn: the surviving chip finishes its zoom, a LogWindow shows the
//             provider surviving navigation and the playlist resuming mid-track.
//             Holds to the end, no fade.
//
// Persistent element: the lower-third zoom band (archetype 2) — three player chips
// converge and shrink to one across all five beats, b1 through b5.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, seg } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/e05.json";

const B1 = 15;
const B2 = 153;
const B3 = 324;
const B4 = 479;
const B5 = 647;
const END = 906;

/** Bright violet tuned for the dark stage (the mood's own accent reads muddy on a plate). */
const ACCENT = "#9D7CFF";
const STAGE = "#140F26";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 38;
const BLOCK_X = 268;
const CHIP_W = 64;
const CHIP_H = 48;
const CHIP_Y = LT.y + 14;
const LABEL_Y = LT.y + 66;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const STARTS = [B1, B2, B3, B4, B5];
const LABELS = ["THREE PLAYERS", "EACH ONE ALONE", "FORGOT YOU", "ONE PROVIDER", "FOLLOWS YOU EVERYWHERE"];

/** Continuous position along the 5-stage beat table: which stage, which is next, how far between. */
function stagePos(frame: number, fps: number) {
  let stage = 0;
  for (let i = STARTS.length - 1; i >= 0; i--) {
    if (frame >= STARTS[i]) {
      stage = i;
      break;
    }
  }
  const next = Math.min(stage + 1, STARTS.length - 1);
  const t = stage === next ? 0 : tween(sec(frame, STARTS[stage] + 15, fps), 0, 0.5, ease.power3InOut);
  return { stage, next, t };
}

function at5(frame: number, fps: number, arr: number[]): number {
  const { stage, next, t } = stagePos(frame, fps);
  return mix(t, arr[stage], arr[next]);
}

// chip A = the survivor (learning-session player → the PlayerDock)
const DX_A = [0, 0, 0, 0, 0];
const OP_A = [1, 1, 1, 1, 1];
const SC_A = [1, 1, 1, 1.3, 1.9];
// chip B = playlist player
const DX_B = [92, 42, 20, 20, 20];
const OP_B = [1, 1, 1, 0.15, 0];
const SC_B = [1, 1, 1, 0.85, 0.6];
// chip C = premium playlist view
const DX_C = [184, 84, 38, 38, 38];
const OP_C = [1, 1, 1, 0.15, 0];
const SC_C = [1, 1, 1, 0.85, 0.6];

const CornerFact: React.FC<{ value: string; label: string; corner: "tl" | "tr"; from: number; to: number }> = ({
  value, label, corner, from, to,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < from || frame >= to) return null;
  const t = tween(sec(frame, from, fps), 0, 0.3, ease.power3Out);
  return (
    <div style={{ position: "absolute", top: 26, [corner === "tl" ? "left" : "right"]: 48, textAlign: corner === "tl" ? "left" : "right", opacity: t, fontFamily }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: P.accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: P.muted, marginTop: 4 }}>{label}</div>
    </div>
  );
};

const ZoomThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const techOn = frame >= B4 + 30;
  const label = LABELS[stagePos(frame, fps).stage];
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);

  const chips = [
    { dx: at5(frame, fps, DX_A), op: at5(frame, fps, OP_A), sc: at5(frame, fps, SC_A), icon: "🎓" },
    { dx: at5(frame, fps, DX_B), op: at5(frame, fps, OP_B), sc: at5(frame, fps, SC_B), icon: "🎵" },
    { dx: at5(frame, fps, DX_C), op: at5(frame, fps, OP_C), sc: at5(frame, fps, SC_C), icon: "⭐" },
  ];

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
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>🎧 ELVARIKA</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            one player
            <br />
            follows you
          </div>
        </div>
        <div style={{ position: "absolute", left: BLOCK_X - 22, top: LINE_Y, width: 960, height: 2, background: P.border }} />
      </Arrive>

      {/* three player chips converging into one, b1 through b5 */}
      <Arrive at={B1 + 20} kind="wipe" box={{ x: BLOCK_X, y: CHIP_Y, w: 280, h: CHIP_H }} dur={0.5}>
        {chips.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: BLOCK_X + c.dx,
              top: CHIP_Y,
              width: CHIP_W,
              height: CHIP_H,
              transform: `scale(${c.sc})`,
              transformOrigin: "center center",
              opacity: c.op,
              background: i === 0 && techOn ? P.accentBg : P.card,
              border: `2px solid ${i === 0 && techOn ? P.accentEdge : P.border}`,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {i === 0 && techOn ? (
              <div style={{ fontSize: 11, fontWeight: 800, color: P.accent, textAlign: "center", padding: "0 4px", lineHeight: 1.2 }}>
                Media
                <br />
                Session API
              </div>
            ) : (
              <div style={{ fontSize: 22, opacity: i === 0 ? 1 : 0.5 + 0.5 * pulse }}>{c.icon}</div>
            )}
          </div>
        ))}
        <div style={{ position: "absolute", left: BLOCK_X, top: LABEL_Y, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>
          {label}
        </div>
      </Arrive>

      {/* b5: the 3→1 result lands once the survivor has settled */}
      {frame >= B5 + 60 && (
        <div
          style={{
            position: "absolute",
            left: BLOCK_X + 280,
            top: LT.y + 20,
            width: 90,
            height: 52,
            borderRadius: 4,
            background: P.successBg,
            border: `2px solid ${P.successEdge}`,
            transform: `scale(${punchScale(sec(frame, B5 + 60, fps), 0)})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            color: P.success,
          }}
        >
          3 → 1
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the human problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="quoteMarker"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ quote: "Leaving a page used to cut off whatever you were listening to.", highlight: "cut off" }}
      />

      {/* b2 — three disconnected players, over the hub (many separate cards echo the fragmentation) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="statusFocus"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          title: "Three separate players, none remembered you",
          claims: [
            { text: "Learning session player", verdict: "no" },
            { text: "Playlist player", verdict: "no" },
            { text: "Premium playlist view", verdict: "no" },
          ],
        }}
      />

      {/* b3 — the analogy, pushed in tighter on the page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.35 }} />}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{ line1: "Like three radios in one house.", line2: "Each forgot you when you left the room.", keywords: ["three radios", "forgot"] }}
      />

      {/* b4 — the fix, pushed in tightest on the page where the dock lives */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.85 }} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.72}
        data={{
          from: "Three disconnected players",
          to: "One PlayerProvider, everywhere",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Media Session API", "Persists across pages", "Lock-screen controls"],
        }}
      />
      <CornerFact value="1" label="PLAYERPROVIDER FOR ALL PAGES" corner="tl" from={B4} to={B5} />
      <CornerFact value="04:12" label="RESUME POINT, NOT 00:00" corner="tr" from={B4} to={B5} />

      {/* b5 — the result: provider survives navigation, playlist resumes mid-track, holds to the end */}
      {frame >= B5 && (
        <LogWindow
          title="elvarika-player"
          from={B5 + 10}
          every={16}
          opacity={seg(frame, B5, B5 + 20)}
          win={{ x: 60, y: 70, w: 1160, h: 500 }}
          fontSize={22}
          lines={[
            { t: "nav", text: "route /review → /playlists", tone: "muted" },
            { t: "play", text: "PlayerProvider: audio context kept", tone: "success" },
            { t: "sess", text: "Media Session API: lock-screen active", tone: "muted" },
            { t: "pl", text: "playlist position saved → storage.ts", tone: "success" },
            { t: "pl", text: "resume at 04:12, not 00:00", tone: "success" },
            { t: "old", text: "3 separate players → retired", tone: "danger" },
            { t: "new", text: "1 PlayerProvider → live", tone: "success" },
          ]}
        />
      )}

      <ZoomThird />
    </AbsoluteFill>
  );
};

export const FeatureOneAudioPlayerFollowsE05: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
