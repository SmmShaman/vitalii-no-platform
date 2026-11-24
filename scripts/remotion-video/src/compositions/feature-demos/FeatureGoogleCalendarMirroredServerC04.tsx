// FeatureGoogleCalendarMirroredServerC04 — feature c04 — 1280x720, 933 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood violet. Motion direction (feature-motion skill, 2026-10-07).
//
// The archetype's object is the divider itself: a vertical line that slides from deep in
// the chaos (left) half toward the edge as the narration resolves, with thin colored top/
// bottom bands carrying a small BEFORE/NOW label inside each half (never a centered
// headline). By b5 the divider has slid to x=0 — chaos has nothing left, the order half
// fills the whole stage — "the divider slides to reveal the win."
//
// Beat -> effect (data only from the feature row and its two commits):
// b1 15-183   "browser login the kitchen TV could never sign into"
//             titleTakeover over the feature's own page — names the lockout.
// b2 183-382  "four brothers ... one team name ... couldn't say whose training"
//             cornerTags over the page, scrolled deeper — the ambiguity as four facts.
// b3 382-574  "the server copies every event itself from the iCal feed, every 15 min"
//             pipelineFlow over commit 2d54537 (mirror Google Calendar server-side) —
//             server.ts reads the feed, polls every 15 minutes, mirrors it.
// b4 574-762  "each child gets his own tagged feed ... survives a team rename"
//             handoffExplain over commit 71e5b17 (allow a feed to belong to one child).
// b5 762-933  "four brothers' football, finally sorted by name, not guesswork"
//             drawn only: divider at 0, order half holds a LogWindow with the real facts
//             above and a resolved stat, full brightness to the final frame.

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import shotsFile from "./shots/c04.json";

const B1 = 15;
const B2 = 183;
const B3 = 382;
const B4 = 574;
const B5 = 762;

const ACCENT = "#8B5CF6";
const STAGE = "#111018";

const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 80, w: 460, h: 86 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 80,
          width: 460,
          height: 86,
          background: "#1b1430",
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          padding: "12px 18px",
          boxSizing: "border-box",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: ACCENT }}>CALENDAR BOT</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 4, lineHeight: 1.25 }}>
          Mirrors Google Calendar + Spond for 4 kids&apos; sports
        </div>
      </div>
    </Arrive>
  );
};

/** The persistent archetype object: a sliding divider with colored top/bottom bands
 * and a small in-half label — never a centered headline. Survives every beat. */
const SplitFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;
  const dividerX = interpolate(frame, [B1, B2, B3, B4, B5], [860, 760, 620, 360, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const BAND_H = 56;
  const chaosW = dividerX;
  const orderW = 1280 - dividerX;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: chaosW, height: BAND_H, background: P.danger, opacity: 0.88 }} />
      <div style={{ position: "absolute", left: dividerX, top: 0, width: orderW, height: BAND_H, background: P.success, opacity: 0.88 }} />
      <div style={{ position: "absolute", left: 0, top: 720 - BAND_H, width: chaosW, height: BAND_H, background: P.danger, opacity: 0.88 }} />
      <div
        style={{ position: "absolute", left: dividerX, top: 720 - BAND_H, width: orderW, height: BAND_H, background: P.success, opacity: 0.88 }}
      />
      <div style={{ position: "absolute", left: dividerX - 3, top: 0, width: 6, height: 720, background: "#fff", boxShadow: `0 0 24px ${ACCENT}` }} />
      {chaosW > 90 && (
        <div style={{ position: "absolute", left: 16, top: 16, fontSize: 15, fontWeight: 800, letterSpacing: 1.4, color: "#fff", fontFamily }}>
          BEFORE
        </div>
      )}
      {orderW > 90 && (
        <div
          style={{ position: "absolute", left: dividerX + 16, top: 16, fontSize: 15, fontWeight: 800, letterSpacing: 1.4, color: "#fff", fontFamily }}
        >
          NOW
        </div>
      )}
    </>
  );
};

const RESULT_LOG: LogLine[] = [
  { t: "07:00", text: "Family calendar needed a browser login", tone: "danger" },
  { t: "07:00", text: "Kitchen TV couldn't sign in", tone: "danger" },
  { t: "07:15", text: "server.ts mirrors the calendar's iCal feed", tone: "accent" },
  { t: "07:15", text: "Polled every 15 minutes", tone: "muted" },
  { t: "07:15", text: "Each child's feed tagged (server.ts)", tone: "accent" },
  { t: "07:15", text: "4 brothers' football sorted by name", tone: "success" },
];

const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Arrive at={B5 + 20} kind="punch" box={{ x: 90, y: 150, w: 520, h: 260 }}>
        <div style={{ position: "absolute", left: 90, top: 150, width: 520 }}>
          <div style={{ fontSize: 54, fontWeight: 800, color: P.success, lineHeight: 1.1 }}>SORTED BY NAME</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1.2, color: "#fff", marginTop: 10 }}>4 BROTHERS, 0 GUESSWORK</div>
        </div>
      </Arrive>
      <Arrive at={B5 + 70} kind="rise" box={{ x: 90, y: 440, w: 560, h: 70 }}>
        <div style={{ position: "absolute", left: 90, top: 440, width: 560, fontSize: 22, fontWeight: 700, color: "#E8EEF9", lineHeight: 1.35 }}>
          Four brothers&apos; football, finally sorted by name, not guesswork.
        </div>
      </Arrive>
      <Arrive at={B5 + 100} kind="rise" box={{ x: 90, y: 520, w: 560, h: 40 }}>
        <div style={{ position: "absolute", left: 90, top: 520, fontSize: 15, fontWeight: 700, color: P.accent, letterSpacing: 0.6 }}>
          server.ts — polling the iCal feed every 15 minutes
        </div>
      </Arrive>
      <LogWindow
        lines={RESULT_LOG}
        title="server.ts"
        from={B5 + 14}
        every={16}
        opacity={1}
        win={{ x: 660, y: 100, w: 560, h: 460 }}
        fontSize={18}
      />
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the lockout, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.04} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.72}
        data={{ title: "Locked out of our own calendar", kicker: "BEFORE" }}
      />
      <ProductPlate />

      {/* b2 — the ambiguity, scrolled deeper into the page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} push={0.05} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.72}
        data={{
          statement: "One team name, four confused boys",
          tags: ["No per-child tag", "Guesswork weekly", "Missed practices", "Team renamed often"],
        }}
      />

      {/* b3 — the server mirrors the iCal feed itself, over commit 2d54537 */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="commit-mirror" from={B3} hold={B4 - B3} push={0.07} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.72}
        data={{
          steps: ["Reads the iCal feed", "Every 15 minutes", "Mirrors it server-side"],
          result: "No browser login needed",
          system: "server.ts",
        }}
      />

      {/* b4 — each child gets his own tagged feed, over commit 71e5b17 */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="commit-child" from={B4} hold={B5 - B4} push={0.09} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.72}
        data={{
          from: "One team name, 4 boys",
          to: "Each boy, own tagged feed",
          points: ["Feed tagged per child", "Survives team renames", "server.ts"],
        }}
      />

      <SplitFrame />
      <ClosingBeat />
    </AbsoluteFill>
  );
};

export const FeatureGoogleCalendarMirroredServerC04: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
