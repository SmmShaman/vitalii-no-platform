// FeatureTimesUpUsedThrowB110 — feature b110 — archetype 5 ledger, mood violet —
// 1280x720, 916 frames @ 30fps, VOICE-SYNCED. Motion direction v2 (feature-motion skill).
// WAVE B2 FIX (2026-11-24): the host found the header claimed archetype 4 (flow-map)
// while the brief assigned this clip archetype 5 (ledger); the persistent element below
// is rebuilt as a dominant receipt-style ledger column, not a flow-map — beat windows,
// duration, palette and narration are all untouched.
//
// Boytasks: a screen-time/task gate for 3 kids on the family TV, Android TV app,
// built on Cloudflare Workers. When a kid's tasks ran out the kiosk used to cover
// the paused film completely and send the child to the launcher — effective at
// cutting the TV off, but it threw away exactly where the film was. One evening
// the fix was rebuilt twice: v1 pressed the media-pause key and drew a parent QR
// over the kiosk while a background task tried to auto-resume — on this Android
// build the auto-resume never fired. v2 moved the fix onto the stick itself: a
// focusable full-screen overlay loads the parent scan page directly over the
// still-visible paused film, swallowing every remote key so the film can't
// restart behind it. The fallback route now waits 15 s in place before trying
// anything else.
//
// Beat → effect (data only from the feature row, problem/solution/result):
// b1 15-209   "the film just vanished, gone, like pulling the plug on movie night"
//             titleTakeover over the feature's own page (backdrop). Names the
//             product in the kicker, per the viewer test.
// b2 209-387  "relaunching everything... the kid lost their place in the story"
//             cornerTags: the four real facts of the old behaviour, over the hub.
// b3 387-572  "pauses exactly where it was... one QR code scan brings it right back"
//             handoffExplain over the feature's own page — the mechanism, drawn
//             (no commit page tonight; only the page and the hub are verified).
//             One small tech gloss sits beside it ("a scan-to-unlock signal").
// b4 572-751  "built twice in one evening — the first auto-resume didn't work"
//             timelineNodes: v1 (pause key + QR drawn) -> test (auto-resume silent)
//             -> v2 (full-screen overlay), over the hub.
// b5 751-916  "it waits fifteen seconds in place before trying anything else"
//             drawn: a LogWindow with the real overlay/fallback facts, ending on
//             the 15 s number, headline above it, holds bright to END.
//
// Persistent element: a ledger column (archetype 5) — the biggest, most central,
// longest-lived thing on screen, right side (x:860-1220, y:90-650), present from
// b1 through END. Two line-item rows ("ON EXPIRY", "AUTO-RESUME") each carry a red
// debit entry that gets struck through and replaced by a green credit entry as the
// clip proves that beat's claim (row 1 flips at the b3 mechanism reveal, row 2 at
// the b4 rebuild), plus a bottom total row ("FALLBACK WAIT") that flips at the b5
// result from "0s" to "15s, in place". A small BOYTASKS product plate names the
// app in b1, clear of the ledger.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, type LogLine } from "./live-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b110.json";

const B1 = 15;
const B2 = 209;
const B3 = 387;
const B4 = 572;
const B5 = 751;
const END = 916;

/** Violet's native accent reads too muted on the dark plate; brightened for contrast. */
const ACCENT = "#B894FF";
const STAGE = "#1A1530";

// Ledger column (archetype 5) — right side, clear of every catalog effect's
// center stage, the biggest and longest-lived thing on screen.
const LEDGER = { x: 860, y: 90, w: 360, h: 560 };
const ROW_TOP0 = LEDGER.y + 70;
const ROW_H = 110;
const TOTAL_TOP = ROW_TOP0 + 2 * ROW_H + 20;
const ROW1_FLIP = B3 + 30;
const ROW2_FLIP = B4 + 10;
const TOTAL_FLIP = B5 + 40;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type LedgerRowData = { label: string; debit: string; credit: string; appearAt: number; flipAt: number; top: number };

const ROWS: LedgerRowData[] = [
  { label: "ON EXPIRY", debit: "App closes, kid relaunches", credit: "Paused in place, QR resumes", appearAt: B1 + 16, flipAt: ROW1_FLIP, top: ROW_TOP0 + 0 * ROW_H },
  { label: "AUTO-RESUME", debit: "v1: silent, never fires", credit: "v2: full-screen overlay, instant", appearAt: B2 + 16, flipAt: ROW2_FLIP, top: ROW_TOP0 + 1 * ROW_H },
];

const LedgerRow: React.FC<LedgerRowData> = ({ label, debit, credit, appearAt, flipAt, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < appearAt) return null;
  const flipped = frame >= flipAt;
  const strike = flipped ? tween(sec(frame, flipAt, fps), 0, 0.3, ease.power2Out) : 0;
  const creditIn = flipped ? tween(sec(frame, flipAt + 6, fps), 0, 0.3, ease.power2Out) : 0;
  return (
    <div style={{ position: "absolute", left: LEDGER.x + 24, top, width: LEDGER.w - 48, fontFamily }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>{label}</div>
      <div style={{ position: "relative", marginTop: 6, fontSize: 18, fontWeight: 700, color: P.danger, display: "inline-block" }}>
        {debit}
        <div style={{ position: "absolute", left: 0, top: "50%", height: 2, width: `${strike * 100}%`, background: P.danger }} />
      </div>
      {flipped && (
        <div
          style={{
            marginTop: 6,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
            opacity: creditIn,
            transform: `translateY(${(1 - creditIn) * 8}px)`,
          }}
        >
          {credit}
        </div>
      )}
    </div>
  );
};

/** archetype 5 — the ledger, present every beat, right column, always on top. */
const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const flipped = frame >= TOTAL_FLIP;
  const strike = flipped ? tween(sec(frame, TOTAL_FLIP, fps), 0, 0.3, ease.power2Out) : 0;
  const creditIn = flipped ? tween(sec(frame, TOTAL_FLIP + 6, fps), 0, 0.3, ease.power2Out) : 0;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={LEDGER} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: LEDGER.x,
            top: LEDGER.y,
            width: LEDGER.w,
            height: LEDGER.h,
            background: P.card,
            borderRadius: 10,
            boxShadow: "10px 10px 0 rgba(0,0,0,0.5)",
            border: `2px solid ${P.border}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: 48,
              borderRadius: "8px 8px 0 0",
              background: P.ink,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 1.6,
            }}
          >
            PAUSE GUARD LEDGER
          </div>
          <div style={{ position: "absolute", left: 24, right: 24, top: 56, height: 2, background: P.border }} />
        </div>
      </Arrive>

      {ROWS.map((row) => (
        <LedgerRow key={row.label} {...row} />
      ))}

      <div style={{ position: "absolute", left: LEDGER.x + 24, top: TOTAL_TOP - 10, width: LEDGER.w - 48, height: 2, background: P.border }} />
      <div style={{ position: "absolute", left: LEDGER.x + 24, top: TOTAL_TOP, width: LEDGER.w - 48 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>FALLBACK WAIT</div>
        <div style={{ position: "relative", marginTop: 6, fontSize: 21, fontWeight: 800, color: P.danger, display: "inline-block" }}>
          0s — straight to relaunch
          <div style={{ position: "absolute", left: 0, top: "50%", height: 2, width: `${strike * 100}%`, background: P.danger }} />
        </div>
        {flipped && (
          <div
            style={{
              marginTop: 6,
              fontSize: 21,
              fontWeight: 800,
              color: P.success,
              opacity: creditIn,
              transform: `translateY(${(1 - creditIn) * 8}px)`,
            }}
          >
            15s, in place
          </div>
        )}
      </div>
    </div>
  );
};

/** b1 only — names the product, bottom-left, clear of the ledger column. */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  const t = tween(sec(frame, B1 + 30, 30), 0, 0.35, ease.power3Out);
  return (
    <div style={{ position: "absolute", left: 40, top: 636, display: "flex", alignItems: "center", gap: 16, fontFamily, opacity: t }}>
      <div style={{ fontSize: 34 }}>📺</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1, color: P.accent }}>BOYTASKS</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 2, maxWidth: 740 }}>
          Screen-time/task gate for 3 kids on the family TV, Android TV app
        </div>
      </div>
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "guard", text: "screen_time_expired → pause()", tone: "accent" },
  { t: "v1", text: "KEYCODE_MEDIA_PAUSE sent + QR overlay drawn", tone: "ink" },
  { t: "v1", text: "auto-resume: no action on this Android build", tone: "danger" },
  { t: "v2", text: "PauseOverlay: focusable, full-screen, over kiosk", tone: "ink" },
  { t: "v2", text: "swallows ALL remote keys — film can't restart", tone: "ink" },
  { t: "scan", text: "parent QR verified → resume()", tone: "success" },
  { t: "fallback", text: "wait 15s in place before trying anything else", tone: "accent" },
];

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the film just vanishes, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "Pulled the plug, mid-movie", kicker: "Boytasks screen-time guard — the film was just gone" }}
      />
      <ProductPlate />

      {/* b2 — relaunching lost the kid's place, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "A parent's unlock meant relaunching — and the kid lost their place",
          tags: ["App closed, not paused", "Relaunch from scratch", "Progress lost", "Story restarts"],
        }}
      />

      {/* b3 — the mechanism: pauses in place, one QR scan resumes it, over the page */}
      {cut(frame, B3, B4) === 1 && (
        <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.25 }} />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "App closed, relaunch required",
          to: "Paused in place, QR resumes it",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: [
            "Media pause key freezes the frame",
            "Parent QR scan unlocks and resumes",
            "Child picks up right where they left off",
          ],
        }}
      />
      {frame >= B3 + 120 && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 560,
            fontSize: 18,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.78)",
            opacity: tween(sec(frame, B3 + 120, fps), 0, 0.3, ease.power3Out),
          }}
        >
          QR code — a scan-to-unlock signal
        </div>
      )}

      {/* b4 — built twice in one evening, over the hub */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} />}
      <MotionInsert
        effect="timelineNodes"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          nodes: [
            { date: "v1", label: "Pause key + parent QR drawn over kiosk" },
            { date: "test", label: "Auto-resume didn't fire on this Android build" },
            { date: "v2", label: "Full-screen overlay swallows every key" },
          ],
          activeIndex: 2,
        }}
      />

      {/* b5 — the result: the real wait, drawn as a worker log; no page/hub here (gate 2) */}
      {frame >= B5 && (
        <AbsoluteFill style={{ background: `rgba(8,8,8,0.66)` }}>
          <Arrive at={B5 + 6} kind="wipe" box={{ x: 150, y: 120, w: 980, h: 60 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 150,
                top: 120,
                width: 980,
                fontSize: 34,
                fontWeight: 800,
                color: "#fff",
                fontFamily,
              }}
            >
              Paused in place. One QR scan. Resumed.
            </div>
          </Arrive>
          <LogWindow
            lines={LOG_LINES}
            title="guard.log"
            from={B5 + 40}
            every={16}
            opacity={1}
            win={{ x: 150, y: 196, w: 980, h: 450 }}
            fontSize={20}
          />
        </AbsoluteFill>
      )}

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureTimesUpUsedThrowB110: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
