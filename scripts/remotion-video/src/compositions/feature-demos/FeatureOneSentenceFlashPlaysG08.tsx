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
  const ribbonY = BAR.y - expand * 540;
  const punch = punchScale(sec(frame, B6 + 14, fps), 0);
  const textIn = tween(t, 0.3, 0.8, ease.power3Out);
  const gaugeIn = tween(t, 0.5, 1.1, ease.power3Out);

  const R = 130;
  const CX = 850;
  const CY = 480;

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 70% 55%, ${P.accentBg} 0%, ${STAGE} 65%)`,
        }}
      />
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
              <div style={{ width: 18, height: 18, borderRadius: 9, margin: "0 auto", background: P.accent }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: "#B2A9E0", marginTop: 8 }}>{ev.icon}</div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: (5.5 / 6) * BAR.w - 90,
            top: -8,
            width: 180,
            textAlign: "center",
            transform: `scale(${punch})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ width: 22, height: 22, borderRadius: 11, margin: "0 auto", background: P.success }} />
          <div style={{ fontSize: 17, fontWeight: 800, color: P.success, marginTop: 8 }}>✅ 8s reached</div>
        </div>
        {/* connector tying the ribbon's final node to the result below */}
        <div
          style={{
            position: "absolute",
            left: (5.5 / 6) * BAR.w,
            top: 36,
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

      <div style={{ position: "absolute", left: CX - R - 20, top: CY - R - 20, width: (R + 20) * 2, height: (R + 20) * 2, opacity: gaugeIn }}>
        <svg width={(R + 20) * 2} height={(R + 20) * 2}>
          <circle cx={R + 20} cy={R + 20} r={R} fill="none" stroke="#3A3365" strokeWidth={16} />
          <circle
            cx={R + 20}
            cy={R + 20}
            r={R}
            fill="none"
            stroke={P.success}
            strokeWidth={16}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - gaugeIn}
            transform={`rotate(-90 ${R + 20} ${R + 20})`}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "#F5F3FF" }}>8/8s</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: P.success, marginTop: 4, letterSpacing: 1 }}>DWELL COMPLETE</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** b3 only — pipelineFlow's own chain sits in a mid-frame band; this fills the empty top
 *  margin and the narrow gap above the persistent TimelineRibbon the dark stage leaves around it. */
const GpsCheckFill: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;
  const t = tween(sec(frame, B3 + 6, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>🧭</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.accent }}>LIVE GPS CHECK</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 820 }}>
            Your position is matched against the road path before any story is picked — commit 0437e5f
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 544,
          width: 1160,
          height: 46,
          borderRadius: 6,
          background: P.card,
          border: `2px solid ${P.accent}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingLeft: 20,
          fontSize: 15,
          fontWeight: 700,
          color: P.ink,
        }}
      >
        <span>✅</span>
        <span>No road match → the story is skipped, not just delayed</span>
      </div>
    </div>
  );
};

/** b4 only — titleTakeover's "200M" sits centered; this fills the wide empty margins top,
 *  left and right with the distance ladder the number is standing for. */
const HeadsUpFill: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B4 || frame >= B5) return null;
  const t = tween(sec(frame, B4 + 6, 30), 0, 0.35, ease.power3Out);
  const rows = [
    { d: "600m", note: "approaching" },
    { d: "400m", note: "getting close" },
    { d: "200m", note: "heads-up fires" },
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>📍</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.accent }}>HEADS-UP, NOT INTERRUPTION</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 820 }}>
            The countdown ticks down as you approach the place
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 230, width: 290, display: "flex", flexDirection: "column", gap: 16 }}>
        {rows.map((row, i) => (
          <div
            key={row.d}
            style={{
              borderRadius: 6,
              background: i === rows.length - 1 ? P.successBg : P.card,
              border: `2px solid ${i === rows.length - 1 ? P.successEdge : P.accent}`,
              padding: "10px 16px",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: i === rows.length - 1 ? P.success : P.ink }}>{row.d}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: P.muted, marginTop: 2 }}>{row.note}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 970,
          top: 250,
          width: 270,
          borderRadius: 6,
          background: P.card,
          border: `2px solid ${P.accent}`,
          padding: "14px 18px",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, color: P.accent }}>WHY 200M</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: P.ink, marginTop: 6 }}>Enough runway to react before the story starts</div>
      </div>
    </div>
  );
};

/** b5 only — keywordCaption's lower-third caption leaves the top ~60% empty; this fills it
 *  with a preview of the one-line flash notification the caption is describing. */
const FlashPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5 || frame >= B6) return null;
  const t = tween(sec(frame, B5 + 6, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily, opacity: t }}>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 38 }}>⚡</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: P.accent }}>WHAT APPEARS</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: P.muted, marginTop: 4, maxWidth: 820 }}>
            A short flash notification — not the full story, not yet
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 170,
          width: 520,
          borderRadius: 10,
          background: P.card,
          border: `2px solid ${P.accent}`,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          padding: "18px 24px",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 2, color: P.accent }}>📍 NEARBY</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: P.ink, marginTop: 8 }}>A story about this valley is ready.</div>
      </div>
    </div>
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
      <GpsCheckFill />

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
      <HeadsUpFill />

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
      <FlashPreview />

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
