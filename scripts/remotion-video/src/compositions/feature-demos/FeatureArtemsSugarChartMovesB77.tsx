// FeatureArtemsSugarChartMovesB77 — feature b77 — 1280x720, 868 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Persistent element (archetype 0, survives every beat b1 through b5): a vertical divider
// splitting the frame into a chaos panel (left, red-tinted) and an order panel (right,
// violet-tinted), each carrying its own corner label ("BEFORE" / "NOW" — no centered
// headline). The divider's x position is the whole story: it starts near the right edge
// (chaos fills almost the frame), blips even further right during the failed first fix,
// then swings hard left once the real fix lands, and resolves to 0 at B5 — order wins
// the whole frame.
//
// Beat -> effect (data only from the feature row, no invented numbers):
// b1 15-225   "the room's TV showed just his number, not whether it moved" — keywordCaption
//             over the article top (shot "wide"). Divider settles near 1180px: almost all
//             chaos, a sliver of order.
// b2 225-365  "a first fix crammed a full chart under the calendar and it ate the screen" —
//             cornerTags over the first-fix paragraph (shot "firstfix"). Divider regresses to
//             1220px — the failed fix makes the chaos panel even bigger, not smaller.
// b3 365-500  "I redrew the line across the bottom of his own camera photo instead" —
//             handoffExplain over the real fix (shot "fix"); one point glosses the file,
//             KioskFrame.tsx — the clip's one tech caption. Divider swings to 640px: the fix
//             lands, order finally gets half the frame.
// b4 500-688  "white = in range, red = low, yellow = high — the room reads his day at a
//             glance" — pipelineFlow over the result paragraph (shot "result"). Divider
//             continues to 260px: order now dominates.
// b5 688-868  "four redesigns in one evening, before the shape finally felt right" — breaks
//             the pattern on purpose (gate: last beat is never the feature page or the hub):
//             no runtime log exists for a kiosk display, so the terminal log is drawn from
//             the feature's own commit history (number-only -> full chart under calendar ->
//             line over the camera photo -> hours/limit values + sharper separators). The
//             divider resolves to 0 at the same moment — order wins the whole frame.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix } from "../../components/effects/motion/grammar";
import { LiveShot, LogWindow, recSize, type LogLine } from "./live-primitives";
import shotsFile from "./shots/b77.json";

const B1 = 15;
const B2 = 225;
const B3 = 365;
const B4 = 500;
const B5 = 688;
const END = 868;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** Accent tuned for the violet palette. */
const ACCENT = "#5B37D4";
const STAGE = "#120F2B";

const FULL_WIN = { x: 0, y: -42, w: 1280, h: 762 };

const { w: REC_W, h: REC_H } = recSize(shotsFile);
const COVER = Math.max(1, 720 / REC_H / (1280 / REC_W));

/** b1 — a one-line product plate, drawn, naming the product and the son plainly. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  const p = tween(sec(frame, B1 + 10, fps), 0, 0.5, ease.power2Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 40,
        padding: "10px 18px",
        background: P.card,
        border: `2px solid ${P.accent}`,
        borderRadius: 4,
        boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
        opacity: p,
        transform: `translateY(${(1 - p) * -10}px)`,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>DIABET</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: P.ink, marginTop: 2 }}>
        The kiosk TV showing my son Artem's glucose
      </div>
    </div>
  );
};

/**
 * Archetype 0 — split duel. The divider's x position (chaos panel width) across the
 * whole clip: holds near the right edge through b1, regresses further during the failed
 * first fix (b2), then swings left as the real fix lands (b3) and keeps shrinking through
 * b4, resolving fully to 0 at b5 — order wins the whole frame.
 */
function dividerX(frame: number, fps: number): number {
  if (frame < B2) {
    const p = tween(sec(frame, B1, fps), 0, 0.6, ease.power2Out);
    return mix(p, 1280, 1180);
  }
  if (frame < B3) {
    const p = tween(sec(frame, B2 + 10, fps), 0, 0.5, ease.power2Out);
    return mix(p, 1180, 1220);
  }
  if (frame < B4) {
    const p = tween(sec(frame, B3 + 6, fps), 0, 0.7, ease.power3Out);
    return mix(p, 1220, 640);
  }
  if (frame < B5) {
    const p = tween(sec(frame, B4 + 6, fps), 0, 0.7, ease.power2Out);
    return mix(p, 640, 260);
  }
  const p = tween(sec(frame, B5 + 6, fps), 0, 0.6, ease.power3Out);
  return mix(p, 260, 0);
}

const SplitDuel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const x = dividerX(frame, fps);
  const leftW = Math.max(0, x);
  const rightW = Math.max(0, 1280 - x);
  const leftLabelOp = Math.max(0, Math.min(1, (leftW - 20) / 50));
  const rightLabelOp = Math.max(0, Math.min(1, (rightW - 20) / 50));
  const chipX = Math.min(x + 16, 1280 - 112);

  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: leftW, height: 720, background: "rgba(194,42,91,0.14)" }} />
      <div style={{ position: "absolute", left: x, top: 0, width: rightW, height: 720, background: "rgba(91,55,212,0.16)" }} />
      <div
        style={{
          position: "absolute",
          left: Math.max(0, x - 2),
          top: 0,
          width: 4,
          height: 720,
          background: P.accent,
          boxShadow: `0 0 18px ${P.accent}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 16,
          padding: "6px 14px",
          borderRadius: 4,
          background: "rgba(0,0,0,0.55)",
          border: `1.5px solid ${P.danger}`,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 1.4,
          color: "#fff",
          opacity: leftLabelOp,
        }}
      >
        BEFORE
      </div>
      <div
        style={{
          position: "absolute",
          left: chipX,
          top: 16,
          padding: "6px 14px",
          borderRadius: 4,
          background: "rgba(0,0,0,0.55)",
          border: `1.5px solid ${P.accent}`,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 1.4,
          color: "#fff",
          opacity: rightLabelOp,
        }}
      >
        NOW
      </div>
    </>
  );
};

const resultLines: LogLine[] = [
  { t: "v1", text: "number only, no trend", tone: "danger" },
  { t: "v2", text: "full calendar chart — ate the screen", tone: "danger" },
  { t: "v3", text: "line redrawn across the camera photo", tone: "accent" },
  { t: "v4", text: "hours + limit values, sharper day separators", tone: "accent" },
  { text: "white = in range, red = low, yellow = high", tone: "success" },
  { text: "KioskFrame.tsx — no new screen needed", tone: "muted" },
  { text: "room reads Artem's day at a glance", tone: "success" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      {/* b1 — the room's TV showed just his number */}
      {cut(frame, B1, B2) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="wide"
          from={B1}
          hold={B2 - B1}
          zoom={(t) => COVER * (1 + 0.08 * t)}
          focus={{ x: 0.5, y: 0.25 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          line1: "The room's TV showed just his number",
          line2: "not whether it had moved all day",
          keywords: ["number"],
        }}
      />
      <ProductPlate />

      {/* b2 — a first fix crammed a full chart under the calendar */}
      {cut(frame, B2, B3) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="firstfix"
          from={B2}
          hold={B3 - B2}
          zoom={(t) => COVER * (1.3 + 0.1 * t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A first chart ate the whole screen",
          tags: ["Full calendar strip", "Hard to read", "Screen gone", "Try again"],
        }}
      />

      {/* b3 — redrawn across the bottom of his own camera photo instead */}
      {cut(frame, B3, B4) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="fix"
          from={B3}
          hold={B4 - B3}
          zoom={(t) => COVER * (1.65 + 0.13 * t)}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          fromLabel: "BEFORE",
          toLabel: "NOW",
          from: "Full chart under the calendar",
          to: "Line across his camera photo",
          points: [
            "Redrawn in KioskFrame.tsx",
            "No new screen needed",
            "Reuses his existing photo",
          ],
        }}
      />

      {/* b4 — white in range, red low, yellow high */}
      {cut(frame, B4, B5) === 1 && (
        <LiveShot
          file={shotsFile}
          shot="result"
          from={B4}
          hold={B5 - B4}
          zoom={(t) => COVER * (2.0 + 0.15 * t)}
          focus={{ x: 0.5, y: 0.6 }}
          opacity={1}
          win={FULL_WIN}
        />
      )}
      <MotionInsert
        effect="pipelineFlow"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          steps: ["White = in range", "Red = low", "Yellow = high"],
          result: "Room reads his day at a glance",
        }}
      />

      {/* b5 — four redesigns in one evening (never the feature page or the hub) */}
      {frame >= B5 && (
        <>
          <Arrive at={B5 + 2} kind="wipe" box={{ x: 0, y: 40, w: 1280, h: 92 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 40,
                width: 1280,
                height: 92,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: "#fff",
              }}
            >
              Four redesigns in one evening
            </div>
          </Arrive>
          <LogWindow
            lines={resultLines}
            title="KioskFrame.tsx"
            from={B5 + 14}
            every={16}
            opacity={1}
            win={{ x: 110, y: 130, w: 1060, h: 430 }}
            fontSize={24}
          />
        </>
      )}
      <SplitDuel />
    </AbsoluteFill>
  );
};

export const FeatureArtemsSugarChartMovesB77: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
