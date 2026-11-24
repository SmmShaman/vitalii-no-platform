// FeatureFourKidsOneBankidB79 — feature b79 — 1280x720, 968 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood dawn. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// The archetype's object is the CAMERA itself, not a drawn shape: b1 opens windowed and
// wide (LiveWindow, shot "hub", zoom locked at 1 — "a whole interface, small-scale"). b2-b4
// cut to full-bleed LiveBackdrop with push-in rising beat over beat (0.04 -> 0.09 -> 0.14),
// each panned further into the feature's own page. b5 has nothing left to zoom into — the
// camera's target was never a page, it was the single answer — so it lands on a drawn
// result instead (gate 2: the last beat is never the feature's own page or the hub).
//
// Beat -> effect (data only from the feature row and its three commits):
// b1 15-278   "four different kids' pages by hand ... long message threads"
//             cornerTags over the hub (wide view) — the clutter as four short facts.
// b2 278-460  "one BankID login, done once, keeps all four accounts open all day"
//             handoffExplain over the feature's own page — flyt-login.mjs replaces four
//             logins with one, the session stays open on HOME-PC (commits 470a99a, 3cd13d5).
// b3 460-615  "a background job checks every child's messages ... every half hour"
//             pipelineFlow over the page, panned further in — flyt_poll.py (commit 6226fa4).
// b4 615-778  "AI reads the vague homework notes and turns them into one clear task"
//             funnelAbsorption over the page, panned furthest in — three messy inputs fold
//             into one task per child.
// b5 778-968  "one login, four kids' homework sorted automatically, every school day"
//             drawn only: LogWindow with the real facts above, a 4 -> 1 result stat, holds
//             at full brightness through the final frame, no fade, no page, no hub.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { LogWindow, LiveWindow, type LogLine } from "./live-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import shotsFile from "./shots/b79.json";

const B1 = 15;
const B2 = 278;
const B3 = 460;
const B4 = 615;
const B5 = 778;

const ACCENT = "#4F8FFF";
const STAGE = "#101826";

const ProductPlate: React.FC = () => {
  const P = usePalette();
  const frame = useCurrentFrame();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 24, w: 460, h: 86 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 24,
          width: 460,
          height: 86,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          padding: "12px 18px",
          boxSizing: "border-box",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>BOYTASKS</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.25 }}>
          YouTube unlocks only after school &amp; chore tasks are done
        </div>
      </div>
    </Arrive>
  );
};

const RESULT_LOG: LogLine[] = [
  { t: "07:58", text: "4 separate kid logins — by hand", tone: "danger" },
  { t: "08:00", text: "BankID login once (flyt-login.mjs)", tone: "accent" },
  { t: "08:00", text: "session kept alive on HOME-PC", tone: "muted" },
  { t: "08:30", text: "flyt_poll.py checks all 4 inboxes", tone: "muted" },
  { t: "08:31", text: "vague note -> 1 clear task per child", tone: "accent" },
  { t: "08:31", text: "4 kids sorted, 0 manual logins", tone: "success" },
];

const ClosingBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B5) return null;
  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily }}>
      <Arrive at={B5 + 20} kind="punch" box={{ x: 90, y: 150, w: 480, h: 300 }}>
        <div style={{ position: "absolute", left: 90, top: 150, width: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ fontSize: 150, fontWeight: 800, color: P.danger, lineHeight: 1 }}>4</div>
            <div style={{ fontSize: 44, color: P.muted }}>&rarr;</div>
            <div style={{ fontSize: 150, fontWeight: 800, color: P.success, lineHeight: 1 }}>1</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1.4, color: "#fff", marginTop: 12 }}>
            LOGINS, EVERY MORNING -&gt; ONE
          </div>
        </div>
      </Arrive>
      <Arrive at={B5 + 70} kind="rise" box={{ x: 90, y: 480, w: 520, h: 70 }}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 480,
            width: 520,
            fontSize: 22,
            fontWeight: 700,
            color: "#E8EEF9",
            lineHeight: 1.35,
          }}
        >
          Four kids, one login, homework sorted — every school day.
        </div>
      </Arrive>
      <Arrive at={B5 + 100} kind="rise" box={{ x: 90, y: 560, w: 560, h: 40 }}>
        <div style={{ position: "absolute", left: 90, top: 560, fontSize: 15, fontWeight: 700, color: P.accent, letterSpacing: 0.6 }}>
          Cloudflare Workers — polling every half hour, day and night
        </div>
      </Arrive>
      <LogWindow
        lines={RESULT_LOG}
        title="flyt_poll.py"
        from={B5 + 14}
        every={16}
        opacity={1}
        win={{ x: 660, y: 70, w: 560, h: 460 }}
        fontSize={18}
      />
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the clutter, wide and small-scale, over the hub */}
      {cut(frame, B1, B2) === 1 && (
        <LiveWindow file={shotsFile} shot="hub" title="vitalii.no/features" from={B1} hold={B2 - B1} opacity={1} />
      )}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          statement: "Four kids, four separate logins",
          tags: ["4 pages by hand", "Long message threads", "Every school morning", "Easy to miss"],
        }}
      />
      <ProductPlate />

      {/* b2 — one BankID login replaces four; the camera cuts to full-bleed */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} push={0.04} />}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "4 logins, every morning",
          to: "1 BankID login, all day",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["flyt-login.mjs signs in once", "Session stays open on HOME-PC", "All four accounts reachable"],
        }}
      />

      {/* b3 — the half-hourly poll, panned further in */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B3} hold={B4 - B3} push={0.09} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          steps: ["Poll every 30 min", "Check each child's inbox", "Check announcements"],
          result: "New items queued",
          system: "flyt_poll.py",
        }}
      />

      {/* b4 — the AI reads it, panned furthest in */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page3" from={B4} hold={B5 - B4} push={0.14} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["Vague homework note", "Announcement text", "Message thread"],
          result: "One clear task per child",
        }}
      />

      <ClosingBeat />
    </AbsoluteFill>
  );
};

export const FeatureFourKidsOneBankidB79: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
