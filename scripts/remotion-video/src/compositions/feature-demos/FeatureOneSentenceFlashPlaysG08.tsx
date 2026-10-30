// FeatureOneSentenceFlashPlaysG08 — feature g08 — 1280x720, 977 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
// RE-SHOOT 2026-10-30: same narration/beat windows as before, re-staged from archetype 7
// (hero-number) to archetype 1 (timeline ribbon) — the picture now tells the story as a
// sequence of events landing left-to-right instead of one number owning the centre.
//
// Voice-synced beat windows (immutable): b1 15-185, b2 185-336, b3 336-510, b4 510-684,
// b5 684-808, b6 808-977 (holds to end).
//
// Beat -> effect (data only from the feature row and commit 0437e5f):
// b1  "driving through a valley, a story about a farm you were never headed toward"
//     quoteMarker over the feature's own write-up page (backdrop). Ribbon: first stamp
//     lands — "Random story".
// b2  "every story just started mid-sentence, no warning before it began"
//     cornerTags: the claim + four facts, over the hub. Ribbon: second stamp — "No warning".
// b3  "GPS now checks whether your road actually passes the place" (0437e5f DriveService)
//     pipelineFlow over the write-up scrolled to the on-route paragraph. Ribbon: third
//     stamp — "GPS road check".
// b4  "a short heads-up first — in 200 metres, right — before anything plays"
//     titleTakeover ("200M"), drawn only. Ribbon: fourth stamp — "200m heads-up".
// b5  "only a one-line flash follows, full narration waits"
//     keywordCaption, drawn only, lower-third. Ribbon: fifth stamp — "Flash only".
// b6  "full narration only starts once you've stayed close for eight seconds"
//     drawn finale (archetype 1's own climax, not a catalog effect): the compressed
//     ribbon expands to own the frame, lands its sixth and final stamp — "8s reached" —
//     and the result sits bottom-left, tied to the ribbon by a connector line. Holds to
//     the end. Drawn only — gate 2 (last beat is the result, not the page or the hub).
//
// Archetype rule (STEP 0): the timeline ribbon is the element that survives every beat —
// compressed into the bottom band (y >= 600, the effects keep it clear) through b1-b5,
// then expands to own the full frame for the b6 result (gate 1).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g08.json";

const B1 = 15;
const B2 = 185;
const B3 = 336;
const B4 = 510;
const B5 = 684;
const B6 = 808;
const END = 977;

const ACCENT = "#5B37D4";
const STAGE = "#110D24";

const BAR = { x: 40, y: 612, w: 1200, h: 80 };

const EVENTS = [
  { beat: B1, label: "Random story", icon: "🎧" },
  { beat: B2, label: "No warning", icon: "❗" },
  { beat: B3, label: "GPS road check", icon: "🧭" },
  { beat: B4, label: "200m heads-up", icon: "📍" },
  { beat: B5, label: "Flash only", icon: "⚡" },
];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** Compressed timeline ribbon, b1-b5 only — the archetype element that survives every beat. */
const TimelineRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 || frame >= B6) return null;

  const idx = frame < B2 ? 0 : frame < B3 ? 1 : frame < B4 ? 2 : frame < B5 ? 3 : 4;
  const lineW = ((idx + 1) / 5) * BAR.w;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="rise" box={BAR} dur={0.4}>
        <div style={{ position: "absolute", left: BAR.x, top: BAR.y, width: BAR.w, height: BAR.h }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 24,
              width: BAR.w,
              height: 4,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 24,
              width: lineW,
              height: 4,
              background: P.accent,
              borderRadius: 2,
            }}
          />
          {EVENTS.map((ev, i) => {
            if (frame < ev.beat) return null;
            const x = ((i + 0.5) / 5) * BAR.w;
            const sc = punchScale(sec(frame, ev.beat + 2, fps), 0);
            const active = i === idx;
            return (
              <div
                key={ev.label}
                style={{
                  position: "absolute",
                  left: x - 70,
                  top: 0,
                  width: 140,
                  textAlign: "center",
                  transform: `scale(${sc})`,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    margin: "0 auto",
                    background: active ? P.accent : "#3A3365",
                    border: `2px solid ${P.accent}`,
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: active ? "#FFFFFF" : "#8A81B8",
                    marginTop: 8,
                  }}
                >
                  {ev.icon} {ev.label}
                </div>
              </div>
            );
          })}
        </div>
      </Arrive>
      <div style={{ position: "absolute", left: 40, bottom: 10, fontSize: 13, fontWeight: 700, color: "#9C93C9" }}>
        One drive, timed
      </div>
    </div>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B6) return null;

  const t = sec(frame, B6, fps);
  const expand = tween(t, 0, 0.9, ease.power3Out);
  const ribbonY = BAR.y - expand * 220;
  const punch = punchScale(sec(frame, B6 + 14, fps), 0);
  const textIn = tween(t, 0.3, 0.8, ease.power3Out);

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: BAR.x, top: ribbonY, width: BAR.w, height: BAR.h }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 24,
            width: BAR.w,
            height: 4,
            background: P.accent,
            borderRadius: 2,
            opacity: 0.6,
          }}
        />
        {EVENTS.map((ev, i) => {
          const x = ((i + 0.5) / 6) * BAR.w;
          return (
            <div key={ev.label} style={{ position: "absolute", left: x - 60, top: 0, width: 120, textAlign: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, margin: "0 auto", background: P.accent }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7A71A8", marginTop: 6 }}>{ev.icon}</div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: (5.5 / 6) * BAR.w - 90,
            top: -6,
            width: 180,
            textAlign: "center",
            transform: `scale(${punch})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, margin: "0 auto", background: P.success }} />
          <div style={{ fontSize: 15, fontWeight: 800, color: P.success, marginTop: 6 }}>✅ 8s reached</div>
        </div>
        {/* connector tying the ribbon's final node to the result below */}
        <div
          style={{
            position: "absolute",
            left: (5.5 / 6) * BAR.w,
            top: 30,
            width: 3,
            height: Math.max(0, 640 - ribbonY - BAR.h),
            background: P.accent,
            opacity: 0.5 * punch,
          }}
        />
      </div>

      <div style={{ position: "absolute", left: 60, top: 460, opacity: textIn }}>
        <div style={{ fontSize: 120, fontWeight: 800, color: P.success, lineHeight: 1, letterSpacing: -2 }}>8s</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#E7E3F8", marginTop: 12, letterSpacing: 2 }}>
          DWELL REACHED
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#9C93C9", marginTop: 8 }}>Full narration begins.</div>
      </div>
    </AbsoluteFill>
  );
};

/** Beat 1 only: names the product in one plain line (owner rule, STEP 0e). */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B2) return null;
  const t = tween(sec(frame, B1 + 2, 30), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 18,
        width: 1280,
        textAlign: "center",
        opacity: t,
        fontFamily,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: P.accent }}>
        GUIDE — STORIES ON THE ROAD
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#2A2456", marginTop: 2 }}>
        Knows where you are. Plays short stories about places nearby — Norwegian + Ukrainian.
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own write-up */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-top" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="quoteMarker"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          quote: "Driving through a valley, you'd hear a story about a farm you were never actually headed toward.",
          highlight: "never actually headed toward",
          source: "Every drive, before today",
        }}
      />
      <ProductPlate />

      {/* b2 — no warning, mid-sentence, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile as any} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "No warning. It just began mid-sentence.",
          tags: ["Any nearby place", "On your road or not", "No heads-up first", "Full story, every time"],
        }}
      />

      {/* b3 — the fix: on-route check (0437e5f DriveService), over the write-up */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile as any} shot="page-mid" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Live GPS position", "Match to road path", "Check distance to place"],
          result: "On-route only",
          system: "0437e5f DriveService",
        }}
      />

      {/* b4 — the heads-up number, drawn only */}
      <MotionInsert
        effect="titleTakeover"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        plate={0}
        data={{
          title: "200M",
          kicker: "Heads-up first — before anything plays.",
        }}
      />

      {/* b5 — the flash-only line, drawn only, lower-third */}
      <MotionInsert
        effect="keywordCaption"
        from={B5}
        dur={B6 - B5}
        accent={ACCENT}
        base={STAGE}
        plate={0}
        data={{
          line1: "Only a one-line flash follows.",
          line2: "Full narration waits.",
          keywords: ["one-line", "waits"],
        }}
      />

      <TimelineRibbon />

      {/* b6 — timeline finale, holds to END */}
      <Finale />
    </AbsoluteFill>
  );
};

export const FeatureOneSentenceFlashPlaysG08: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
