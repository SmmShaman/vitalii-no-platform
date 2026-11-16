// FeatureBlindViewerChecksEveryB98 — feature b98 — 1280x720, 931 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood slate. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Boytasks — a screen-time and task system for my three kids: YouTube access is gated
// by finishing the school and chore tasks in the app first, run on Cloudflare Workers.
// Lesson cards can now render themselves into short videos; nothing checked a render
// before a kid saw it. This clip stages the card deck that is every queued lesson
// video and follows it from an unchecked pile to an all-PASS fan — the deck itself is
// the archetype, never a borrowed layout.
//
// Beat → effect (data only from the feature row and commits 8d2aa7a / 8329700 / 101e647):
// b1 15-181   "nothing checked them before a kid saw them"
//             titleTakeover over the feature's own page (backdrop). The lower third
//             shows the deck as one unchecked pile, label QUEUED.
// b2 181-361  "one broken animation... straight to the TV on the wall"
//             cornerTags: the four risks, over the features hub (backdrop). The pile
//             in the lower third flags red — no one is watching it.
// b3 361-584  "a 'blind viewer' judges a contact sheet... frame by frame"
//             pipelineFlow, drawn (no public capture of the render server exists) —
//             the writer → Contabo render → reviewer + blind viewer chain from
//             8d2aa7a. The deck fans into five cards, each gets a CHECKING badge.
// b4 584-779  "only a passing video... renders unattended on a VPS"
//             drawn LogWindow: lesson-render.timer's own real numbers (systemd timer,
//             nice 19, 2G memory cap, 14-day cleanup, R2 upload) — no logs exist for
//             this project, so every line is built only from the feature's own text.
//             The five cards in the lower third stamp PASS one by one.
// b5 779-931  "every fifteen minutes, nonstop"
//             drawn finale: the deck zooms to fill the frame, all cards PASS, closing
//             on the real cadence number. Holds to the end, no fade.
//
// Persistent element: the card-deck lower third (archetype 3), b1 through b4, then the
// same deck fills the frame for the finale (b5) — the one mover throughout the clip.
// Effects keep the bottom 200/1080 px clear (look.safeBottom) — that is where it sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b98.json";

const B1 = 15;
const B2 = 181;
const B3 = 361;
const B4 = 584;
const B5 = 779;
const END = 931;
void END;

const ACCENT = "#F2A541";
const STAGE = "#15181C";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const CARD_W = 190;
const CARD_GAP = 22;
const CARD_X = (i: number) => LT.x + 40 + i * (CARD_W + CARD_GAP);
const CARDS = ["Miljøgifter", "Fractions", "Water cycle", "Verbs", "Map skills"];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const CardDeckBand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1 || frame >= B5) return null;

  const stage: "pile" | "flag" | "fan" | "pass" =
    frame < B2 ? "pile" : frame < B3 ? "flag" : frame < B4 ? "fan" : "pass";

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
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>LESSON VIDEOS</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            {stage === "pile" && "queued, unchecked"}
            {stage === "flag" && "no one is watching"}
            {stage === "fan" && "blind viewer judging"}
            {stage === "pass" && "only a pass ships"}
          </div>
        </div>
      </Arrive>

      {stage === "pile" && (
        <Arrive at={B1 + 20} kind="rise" box={{ x: LT.x + 260, y: LT.y + 8, w: 180, h: 64 }}>
          <div
            style={{
              position: "absolute",
              left: LT.x + 300,
              top: LT.y + 20,
              width: 160,
              height: 52,
              background: P.card,
              border: `2px dashed ${P.muted}`,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: LT.x + 290,
              top: LT.y + 14,
              width: 160,
              height: 52,
              background: P.card,
              border: `2px dashed ${P.muted}`,
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: LT.x + 280,
              top: LT.y + 8,
              width: 160,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: P.card,
              border: `2px solid ${P.muted}`,
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 800,
              color: P.muted,
            }}
          >
            5 QUEUED
          </div>
        </Arrive>
      )}

      {stage === "flag" && (
        <Arrive at={B2 + 20} kind="punch" box={{ x: LT.x + 280, y: LT.y + 8, w: 160, h: 52 }}>
          <div
            style={{
              position: "absolute",
              left: LT.x + 280,
              top: LT.y + 8,
              width: 160,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: P.dangerBg,
              border: `2px solid ${P.dangerEdge}`,
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 800,
              color: P.danger,
            }}
          >
            NO CHECK YET
          </div>
        </Arrive>
      )}

      {(stage === "fan" || stage === "pass") &&
        CARDS.map((label, i) => {
          const at = B3 + 20 + i * 18;
          const passed = stage === "pass";
          const badgeAt = B4 + 20 + i * 24;
          const showPass = passed && frame >= badgeAt;
          return (
            <Arrive key={i} at={at} kind="wipe" box={{ x: CARD_X(i), y: LT.y + 10, w: CARD_W, h: 72 }} dur={0.4}>
              <div
                style={{
                  position: "absolute",
                  left: CARD_X(i),
                  top: LT.y + 10,
                  width: CARD_W,
                  height: 72,
                  borderRadius: 4,
                  background: showPass ? P.successBg : P.card,
                  border: `2px solid ${showPass ? P.successEdge : P.border}`,
                  padding: "8px 12px",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: P.ink, lineHeight: 1.2 }}>{label}</div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 1.2,
                    marginTop: 6,
                    color: showPass ? P.success : P.accent,
                    transform: showPass ? `scale(${punchScale(sec(frame, badgeAt, fps), 0)})` : undefined,
                  }}
                >
                  {showPass ? "PASS" : "CHECKING"}
                </div>
              </div>
            </Arrive>
          );
        })}
    </div>
  );
};

const FinaleGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B5) return null;
  const in1 = tween(sec(frame, B5 + 4, fps), 0, 0.5, ease.power3Out);
  const TICKS = 8;
  const activeTick = Math.floor(Math.max(0, frame - (B5 + 40)) / 10) % TICKS;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1280,
        height: 720,
        fontFamily,
        opacity: in1,
        transform: `translateY(${(1 - in1) * 14}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 60, top: 46, fontSize: 14, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>
        BOYTASKS — LESSON VIDEOS
      </div>
      <div style={{ position: "absolute", left: 60, top: 70, fontSize: 44, fontWeight: 800, color: P.ink }}>
        Every video, checked.
      </div>

      <div style={{ position: "absolute", left: 50, top: 190, width: 1180, height: 240, display: "flex", gap: 20 }}>
        {CARDS.map((label, i) => {
          const at = B5 + 20 + i * 10;
          const sc = frame >= at ? punchScale(sec(frame, at, fps), 0) : 0;
          return (
            <div
              key={i}
              style={{
                width: 220,
                height: 240,
                borderRadius: 8,
                background: P.successBg,
                border: `2px solid ${P.successEdge}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${sc})`,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, textAlign: "center", padding: "0 10px" }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: P.success, marginTop: 14 }}>PASS</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 60, top: 480, fontSize: 24, fontWeight: 700, color: P.ink }}>
        Checked for new lessons
      </div>
      <div style={{ position: "absolute", left: 60, top: 514, fontSize: 40, fontWeight: 800, color: P.accent }}>
        every fifteen minutes, nonstop.
      </div>

      <div style={{ position: "absolute", left: 60, top: 630, width: 1160, height: 20, display: "flex", gap: 14 }}>
        {Array.from({ length: TICKS }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 10,
              borderRadius: 5,
              background: i === activeTick ? P.accent : P.border,
            }}
          />
        ))}
      </div>
    </div>
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
        data={{ title: "Nothing checked it first", kicker: "Boytasks lesson videos, before a kid ever saw one" }}
      />

      {/* b2 — what could have gone straight to the TV */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "One bad render, nobody watching",
          tags: ["Broken beat", "Overlapping label", "Nonsense animation", "Straight to the TV"],
        }}
      />

      {/* b3 — the blind-viewer chain (8d2aa7a); no public capture exists, so it is drawn */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["Writer scores motion JSON", "Contabo renders the MP4", "Reviewer + blind viewer judge it"],
          result: "Only a pass ships",
          system: "render server (VPS)",
        }}
      />

      {/* b4 — the unattended render server, real numbers only (no runtime log exists) */}
      <LogWindow
        title="lesson-render.timer"
        from={B4}
        every={22}
        opacity={cut(frame, B4, B5)}
        win={{ x: 60, y: 40, w: 1160, h: 540 }}
        fontSize={20}
        lines={[
          { t: "00:00", text: "lesson-render.service started (systemd)", tone: "muted" },
          { t: "00:02", text: "picked up 1 due card, nice 19", tone: "ink" },
          { t: "00:14", text: "contact sheet rendered -> reviewer", tone: "ink" },
          { t: "00:19", text: "blind viewer: PASS", tone: "success" },
          { t: "00:21", text: "uploaded to R2, memory cap 2G held", tone: "ink" },
          { t: "00:22", text: "renders older than 14d cleaned up", tone: "muted" },
          { t: "15:00", text: "next check in 15 min", tone: "accent" },
        ]}
      />

      {/* b5 — the finale, holds to the end, no fade */}
      <FinaleGrid />

      <CardDeckBand />
    </AbsoluteFill>
  );
};

export const FeatureBlindViewerChecksEveryB98: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
