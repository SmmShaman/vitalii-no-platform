// FeatureArtemsBloodSugarRidesB75 — feature b75 — 1280x720, 889 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Boytasks: Artem's blood sugar lived in its own app, checked separately from the
// kitchen calendar screen the family actually looks at. Fixed in commit ac7ca49 —
// a small route on the same Cloudflare Worker that already gates YouTube now pulls
// his level, trend and age onto a badge over the calendar tile; past 15 minutes old
// the badge greys out instead of showing a number that might be wrong.
// (Commit 1cb1828 is a different feature — the 30-min parent-unlock timer — and is
// not used here.)
//
// Beat → effect (data only from the feature row and commit ac7ca49):
// b1 15-263   "blood sugar lived in its own app, checking from the kitchen meant a phone"
//             titleTakeover over the feature's own page (backdrop). Duel bar: chaos
//             (phone-only) fills most of the band, order side empty — "no badge yet".
// b2 263-479  "a small route on the Worker pulls level, trend and age onto the tile"
//             handoffExplain over the page scrolled deeper — duel bar divider slides
//             to center, order side gains a live number.
// b3 479-657  "past fifteen minutes old, the badge turns grey instead of a wrong number"
//             targetOverrun, dark stage (no recording of the Worker's age check) —
//             duel bar holds at center while the badge demonstrates its own safeguard.
// b4 657-889  "his sugar and trend now sit right there on the kiosk, never silently stale"
//             pure drawn split-duel finale — no effect, no backdrop (gate 2). Divider
//             slides from center to the far left; order fills the frame with the live
//             badge + a 2-item result checklist, holds to END at full brightness.
//
// Persistent element: the split-duel divider (archetype 0) runs the whole clip. In
// b1-b3 it is compressed into the bottom band (y >= 600, the effects keep it clear);
// in b4 it expands to own the full frame for the result (gate 1).

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b75.json";

const B1 = 15;
const B2 = 263;
const B3 = 479;
const B4 = 657;
const END = 889;

/** Accent tuned for the mint mood. */
const ACCENT = "#2F9E7A";
const STAGE = "#0E1512";

// Duel-bar geometry (1280x720, bottom band y >= 600 the effects keep clear).
const BAR = { x: 40, y: 600, w: 1200, h: 104 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

/** Compressed split-duel bar, b1-b3 only — the archetype element that survives every beat. */
const DuelBar: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1 || frame >= B4) return null;

  const phase = frame < B2 ? 1 : frame < B3 ? 2 : 3;
  const dividerFrac = phase === 1 ? 0.22 : 0.56;
  const dividerX = BAR.x + BAR.w * dividerFrac;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={BAR} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: BAR.x,
            top: BAR.y,
            width: BAR.w,
            height: BAR.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
            overflow: "hidden",
          }}
        >
          {/* chaos half */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: dividerX - BAR.x,
              height: BAR.h,
              background: P.dangerBg,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.danger }}>📱 PHONE APP</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4 }}>Checked separately</div>
          </div>
          {/* order half */}
          <div
            style={{
              position: "absolute",
              left: dividerX - BAR.x,
              top: 0,
              width: BAR.w - (dividerX - BAR.x),
              height: BAR.h,
              background: phase >= 2 ? P.successBg : P.noteBg,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 2.2,
                color: phase >= 2 ? P.success : P.muted,
              }}
            >
              🗓️ KIOSK BADGE
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4 }}>
              {phase === 1 ? "No badge yet" : phase === 2 ? "118 mg/dL — live" : "Guards its own age"}
            </div>
          </div>
          {/* divider line */}
          <div
            style={{
              position: "absolute",
              left: dividerX - BAR.x - 2,
              top: 0,
              width: 4,
              height: BAR.h,
              background: P.accent,
            }}
          />
        </div>
      </Arrive>
    </div>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B4) return null;

  const t = sec(frame, B4, fps);
  const dividerP = tween(t, 0, 1.3, ease.power3Out);
  const dividerX = 640 - dividerP * 480;
  const punch = punchScale(sec(frame, B4 + 24, fps), 0);
  const underline = tween(t, 0.9, 1.4, ease.power3Out);

  return (
    <AbsoluteFill style={{ background: STAGE, fontFamily, overflow: "hidden" }}>
      {/* chaos half, shrinking */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: Math.max(0, dividerX),
          height: 720,
          background: "#1A2420",
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 300, fontSize: 48 }}>📱</div>
        <div style={{ position: "absolute", left: 40, top: 370, width: 300, fontSize: 18, fontWeight: 700, color: "#7C8A84" }}>
          Before: open an app,
          <br />
          dig for a phone
        </div>
      </div>
      {/* order half, filling */}
      <div
        style={{
          position: "absolute",
          left: Math.max(0, dividerX),
          top: 0,
          width: 1280 - Math.max(0, dividerX),
          height: 720,
          background: `radial-gradient(circle at 70% 40%, ${P.accentBg} 0%, ${STAGE} 62%)`,
        }}
      >
        {dividerX < 900 && (
          <>
            <div style={{ position: "absolute", left: 540, top: 130, transform: `scale(${punch})`, transformOrigin: "left top" }}>
              <div style={{ fontSize: 220, fontWeight: 900, color: P.accent, lineHeight: 0.85, letterSpacing: -4 }}>118</div>
            </div>
            <div style={{ position: "absolute", left: 548, top: 400, fontSize: 36, fontWeight: 800, color: "#F2F7F4", letterSpacing: 3 }}>
              mg/dL ↗ · updated 2 min ago
            </div>
            <div style={{ position: "absolute", left: 548, top: 450, width: underline * 480, height: 4, background: P.accent }} />
            {["Live on the kiosk", "Never stale past 15 min"].map((label, i) => {
              const at = B4 + 90 + i * 8;
              if (frame < at) return null;
              const sc = punchScale(sec(frame, at, fps), 0);
              return (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    left: 548,
                    top: 490 + i * 62,
                    width: 440,
                    height: 50,
                    borderRadius: 6,
                    background: P.successBg,
                    border: `2px solid ${P.successEdge}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingLeft: 18,
                    fontSize: 19,
                    fontWeight: 700,
                    color: P.success,
                    transform: `scale(${sc})`,
                    transformOrigin: "left center",
                  }}
                >
                  <span>✅</span>
                  <span>{label}</span>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 548, top: 630, fontSize: 15, fontWeight: 600, color: "#7FA596" }}>
              Cloudflare Workers — small backend programs
            </div>
          </>
        )}
      </div>
      {/* divider line */}
      <div style={{ position: "absolute", left: Math.max(0, dividerX) - 2, top: 0, width: 4, height: 720, background: P.accent }} />
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "One App, One Phone", kicker: "Blood sugar lived apart from the kitchen calendar" }}
      />

      {/* b2 — the fix, scrolled deeper on the same page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Checked in a separate app",
          to: "Badge on the calendar tile",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Level, trend and age", "Pulled by the Cloudflare Worker", "No phone needed in the kitchen"],
        }}
      />

      {/* b3 — the safeguard: no verified recording of the Worker's age check, dark stage */}
      <MotionInsert
        effect="targetOverrun"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{ label: "Badge age", value: 16, target: 15, unit: "min" }}
      />

      <DuelBar />

      {/* b4 — split-duel finale, holds to END */}
      <Finale />
    </AbsoluteFill>
  );
};

export const FeatureArtemsBloodSugarRidesB75: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
