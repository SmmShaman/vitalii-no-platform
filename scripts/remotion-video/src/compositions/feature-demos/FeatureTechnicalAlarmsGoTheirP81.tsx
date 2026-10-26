// FeatureTechnicalAlarmsGoTheirP81 — feature p81 — 1280x720, 958 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline, mood mint. Motion direction (feature-motion skill, 2026-10-07).
//
// One editorial effect per voice beat, over the real product as evidence where a
// commit or page actually proves the sentence, drawn abstractly where it doesn't.
// Neither given commit (7d81dde, 73ce018) touches p81's own files (check-linkedin-token,
// discover-features, publish-feature-social, rewrite-features, send-top-social, the two
// VPS shell scripts) — so b1/b2 use the feature's own page and the features hub (always
// true, always available) and b3-b5 are drawn from the feature row's own words/numbers.
//
// Beat → effect:
// b1 15-280   "my inbox for approving articles was also catching every alarm"
//             titleTakeover over the feature's own page (backdrop "page").
// b2 281-426  "one noisy ping could bury the actual article"
//             cornerTags: the four alarm kinds, over the features hub (backdrop "hub").
// b3 427-599  "a boss's fire drills mixed into your personal mail"
//             keywordCaption — the one plain analogy, drawn, no backdrop.
// b4 600-774  "now those alarms go to their own Telegram bot"
//             handoffExplain — before/after routing, the one tech name (Telegram bot).
// b5 775-958  "six kinds of alerts moved out overnight"
//             funnelAbsorption — the six real call sites converging into the result;
//             holds to the end, no fade (Gate 2: ends on the feature's own result, not
//             the page or hub).
//
// Persistent element: the archetype-1 timeline, a 5-node progress line in the bottom
// band (y>=600), one node lighting up per beat, labelled QUEUE / PING / RULE / SPLIT / CLEAN.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p81.json";

const B1 = 15;
const B2 = 281;
const B3 = 427;
const B4 = 600;
const B5 = 775;
const END = 958;

/** Accent tuned for the dark stage (mint's own accent reads too dark on a plate). */
const ACCENT = "#5FE3B3";
const STAGE = "#0B1512";

const TL = { x: 40, y: 606, w: 1200, h: 80 };
const LINE_Y = TL.y + 40;
const NODES = [
  { at: B1, x: 140, label: "QUEUE" },
  { at: B2, x: 390, label: "PING" },
  { at: B3, x: 640, label: "RULE" },
  { at: B4, x: 890, label: "SPLIT" },
  { at: B5, x: 1140, label: "CLEAN" },
];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const lastAt = NODES[NODES.length - 1].at;
  const lastX = NODES[NODES.length - 1].x;
  const progressFrac = Math.max(0, Math.min(1, (frame - B1) / (lastAt - B1)));
  const lineW = tween(progressFrac, 0, 1, ease.linear) * (lastX - NODES[0].x);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={TL} dur={0.4}>
        <div
          style={{
            position: "absolute",
            left: TL.x,
            top: TL.y,
            width: TL.w,
            height: TL.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: TL.x + 22, top: TL.y + 10, fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
          ALARM ROUTE
        </div>
      </Arrive>

      {/* base line + the growing filled segment */}
      <div style={{ position: "absolute", left: NODES[0].x, top: LINE_Y - 1, width: lastX - NODES[0].x, height: 2, background: P.border }} />
      <div style={{ position: "absolute", left: NODES[0].x, top: LINE_Y - 1, width: lineW, height: 2, background: P.accent }} />

      {NODES.map((n, i) => {
        if (frame < n.at) return null;
        const sc = punchScale(sec(frame, n.at, fps), 0);
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: n.x - 9,
                top: LINE_Y - 9,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: P.success,
                border: `2px solid ${P.successEdge}`,
                transform: `scale(${sc})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: n.x - 32,
                top: LINE_Y + 14,
                width: 64,
                textAlign: "center",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.4,
                color: P.ink,
              }}
            >
              {n.label}
            </div>
          </div>
        );
      })}

      {/* the single tech-credibility caption, once, near the SPLIT node */}
      {frame >= B4 + 20 && (
        <div
          style={{
            position: "absolute",
            left: NODES[3].x - 70,
            top: TL.y + 10,
            fontSize: 12,
            fontWeight: 700,
            color: P.muted,
            opacity: tween(sec(frame, B4 + 20, fps), 0, 0.3, ease.power3Out),
          }}
        >
          2 Supabase secrets
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Too Many Alarms", kicker: "Where I approve every article" }}
      />

      {/* b2 — the four alarm kinds, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "One ping can bury the real article",
          tags: ["Token alerts", "Discovery reports", "Rewrite stats", "Watchdog pings"],
        }}
      />

      {/* b3 — the one plain analogy, drawn */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "Like a boss's fire drills",
          line2: "mixed into your personal mail",
          keywords: ["fire drills", "personal mail"],
        }}
      />

      {/* b4 — before/after routing, the one tech name */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          from: "Alarms -> content bot",
          to: "Alarms -> tech bot",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Two Supabase secrets, that's it", "Content chat stays content-only", "Six places switch automatically"],
        }}
      />

      {/* b4 fill — handoffExplain's own points land late (t~2.95 of 4.3) and its camera
          is still mid-pan at the beat's midpoint, leaving the canvas sparse; these two
          bands restate the same real facts from early in the beat so the frame reads
          full throughout, not just once the pan settles. */}
      {frame >= B4 && frame < B5 && (
        <>
          <Arrive at={B4 + 6} kind="wipe" box={{ x: 40, y: 40, w: 1200, h: 120 }} dur={0.4}>
            <div style={{ position: "absolute", left: 40, top: 40, width: 1200, height: 120, display: "flex", gap: 16 }}>
              {["2 Supabase secrets", "Content chat stays content-only", "6 places switch automatically"].map((t, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: P.card,
                    borderRadius: 4,
                    boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
                    padding: "18px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 6,
                    fontFamily,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: P.accent }}>{`STEP ${i + 1}`}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: P.ink, lineHeight: 1.22 }}>{t}</div>
                </div>
              ))}
            </div>
          </Arrive>
          <Arrive at={B4 + 12} kind="rise" box={{ x: 40, y: 528, w: 1200, h: 60 }}>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 528,
                width: 1200,
                height: 60,
                background: P.accentBg,
                border: `1px solid ${P.accentEdge}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 0.6,
                color: P.ink,
              }}
            >
              BEFORE: Alarms → content bot&nbsp;&nbsp;·&nbsp;&nbsp;NOW: Alarms → tech bot
            </div>
          </Arrive>
        </>
      )}

      {/* b5 — the six real call sites converging into the result, holds to the end */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{
          inputs: [
            "check-linkedin-token",
            "discover-features",
            "publish-feature-social",
            "rewrite-features",
            "send-top-social",
            "2 VPS shell scripts",
          ],
          result: "Content chat: 0 tech alarms",
        }}
      />

      {/* b5 fill — the funnel silhouette reads low-contrast against this dark stage
          and its result text only arrives at t~2.95 of 3.3; these two bands keep the
          mid and lower canvas legible with the same real routes and result all beat. */}
      {frame >= B5 && frame < END && (
        <>
          <Arrive at={B5 + 6} kind="wipe" box={{ x: 190, y: 270, w: 900, h: 90 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 190,
                top: 270,
                width: 900,
                height: 90,
                background: P.card,
                borderRadius: 4,
                boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 1,
                color: P.ink,
                textAlign: "center",
              }}
            >
              SIX ROUTES, ONE SWITCH
            </div>
          </Arrive>
          <Arrive at={B5 + 12} kind="rise" box={{ x: 40, y: 486, w: 1200, h: 96 }}>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 486,
                width: 1200,
                height: 96,
                background: P.successBg,
                border: `1px solid ${P.successEdge}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 0.4,
                color: P.ink,
                textAlign: "center",
              }}
            >
              Content chat: 0 tech alarms
            </div>
          </Arrive>
        </>
      )}

      <Timeline />
    </AbsoluteFill>
  );
};

export const FeatureTechnicalAlarmsGoTheirP81: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
