// FeatureElvarikasBackendRefillsCreditsE06 — feature e06 — 1280x720, 831 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood mint. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row; no commit page is verified tonight,
// so the migration beat stays drawn rather than showing an unreadable diff):
// b1 15-257   "someone had to top up accounts by hand... a job got stuck, ran forever"
//             keywordCaption over the feature's own page (backdrop). In the lower
//             third the flow-map names the product, then an unlimited danger block
//             starts "running…" with no cap — the only mover after the label lands.
// b2 257-439  "three doors into the database were wide open... hand themselves credits"
//             cornerTags: the claim + three real write-holes from solution_en, over the hub.
// b3 439-609  "a new PostgreSQL migration shut those doors and gave every job a limit"
//             handoffExplain, drawn (no verified commit page tonight) — the lower-third
//             block morphs from the open/unlimited state to the closed/30-min state,
//             the ONE tech caption ("PostgreSQL migration") lands on the new node.
// b4 609-831  "credits now refill automatically... stuck job killed after just 30 minutes"
//             drawn: three outcome chips branch off the lit node (refill / 30-min kill /
//             3 doors shut) while a LogWindow shows the watchdog and the refill firing.
//             Holds to the end, no fade.
//
// Persistent element: the flow-map lower third (archetype 4), b1 through b4.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, seg } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow } from "./live-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/e06.json";

const B1 = 15;
const B2 = 257;
const B3 = 439;
const B4 = 609;
const END = 831;

/** Bright emerald tuned for the dark stage (mint's own accent is too deep on a plate). */
const ACCENT = "#3DDC97";
const STAGE = "#0E1A16";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 50;
const BLOCK_X = 268;
const BLOCK_W_OLD = 400;
const BLOCK_W_NEW = 230;
const NODE_W = 196;
const NODE_X_OLD = BLOCK_X + BLOCK_W_OLD + 34;
const NODE_X_NEW = BLOCK_X + BLOCK_W_NEW + 34;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // b3: one camera move hands the route from "open/unlimited" to "closed/30-min".
  const hand = tween(sec(frame, B3 + 30, fps), 0, 0.6, ease.power3InOut);
  const isNew = frame >= B3 + 30;
  const blockW = mix(hand, BLOCK_W_OLD, BLOCK_W_NEW);
  const nodeX = mix(hand, NODE_X_OLD, NODE_X_NEW);
  const tone = isNew ? P.success : P.danger;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);

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
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>🌱 ELVARIKA</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            text becomes
            <br />
            a language lesson
          </div>
        </div>
        {/* route line */}
        <div style={{ position: "absolute", left: BLOCK_X - 22, top: LINE_Y - 1, width: 960, height: 2, background: P.border }} />
        <div style={{ position: "absolute", left: BLOCK_X - 30, top: LINE_Y - 8, width: 16, height: 16, borderRadius: 8, background: P.ink }} />
      </Arrive>

      {/* the credits/job block: open & unlimited (old) → closed & 30-min (new) */}
      <Arrive at={B1 + 20} kind="wipe" box={{ x: BLOCK_X, y: LT.y + 14, w: BLOCK_W_OLD, h: 64 }} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: BLOCK_X,
            top: LT.y + 14,
            width: blockW,
            height: 64,
            background: isNew ? P.successBg : P.dangerBg,
            border: `2px solid ${isNew ? P.successEdge : P.dangerEdge}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 12, top: 8, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: tone, whiteSpace: "nowrap" }}>
            {isNew ? "AUTOMATED & CAPPED" : "MANUAL & UNLIMITED"}
          </div>
          {!isNew ? (
            <div style={{ position: "absolute", left: 12, top: 34, fontSize: 15, fontWeight: 700, color: P.danger, opacity: 0.5 + 0.5 * pulse }}>
              running…
            </div>
          ) : (
            <div style={{ position: "absolute", left: 12, top: 34, fontSize: 13, fontWeight: 700, color: P.muted }}>
              PostgreSQL migration
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: nodeXDot(isNew, blockW), top: LINE_Y - 9, width: 18, height: 18, borderRadius: 9, background: tone }} />
      </Arrive>

      {/* the limit node: dashed/waiting (old) → lit at 30 min (new) */}
      <Arrive at={B1 + 34} kind="rise" box={{ x: NODE_X_OLD, y: LT.y + 14, w: NODE_W, h: 64 }}>
        <div
          style={{
            position: "absolute",
            left: nodeX,
            top: LT.y + 14,
            width: NODE_W,
            height: 64,
            background: isNew ? P.success : P.card,
            border: isNew ? `2px solid ${P.success}` : `2px dashed ${P.muted}`,
            borderRadius: 4,
            color: isNew ? "#fff" : P.muted,
            padding: "8px 12px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6 }}>{isNew ? "30-MIN LIMIT" : "NO LIMIT"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{isNew ? "job killed" : "waiting…"}</div>
        </div>
      </Arrive>

      {/* b4: three outcomes branch off the lit node, one by one */}
      {["🔁 monthly", "⏱ 30 min", "🔒 3 shut"].map((label, i) => {
        const at = B3 + 60 + i * 9;
        if (frame < at) return null;
        const x = NODE_X_NEW + NODE_W + 20 + i * 76;
        const sc = punchScale(sec(frame, at, fps), 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: LT.y + 16,
              width: 70,
              height: 60,
              borderRadius: 4,
              background: [P.accentBg, P.successBg, P.successBg][i],
              border: `2px solid ${[P.accentEdge, P.successEdge, P.successEdge][i]}`,
              transform: `scale(${sc})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 800,
              color: P.ink,
              textAlign: "center",
              padding: 4,
              boxSizing: "border-box",
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

/** x-position of the travelling dot on the block edge, old vs new width. */
function nodeXDot(isNew: boolean, blockW: number) {
  return BLOCK_X + blockW - 9;
}

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the human problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ line1: "Credits topped up by hand.", line2: "Stuck jobs ran forever.", keywords: ["by hand", "forever"] }}
      />

      {/* b2 — three open write-holes, over the hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Three doors left wide open",
          tags: ["Self-granted credits", "Writable shared cache", "Public profile reads"],
        }}
      />

      {/* b3 — the fix is invisible plumbing (a migration): drawn, texture only from the page */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B3} hold={B4 - B3} focus={{ x: 0.5, y: 0.2 }} />}
      <MotionInsert
        effect="handoffExplain"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.78}
        base={STAGE}
        data={{
          from: "Open writes, no job limit",
          to: "Closed writes, 30-min limit",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Three write holes sealed", "Every job gets a timeout", "PostgreSQL migration"],
        }}
      />

      {/* b4 — the result: the watchdog and the refill firing, holds to the end */}
      {frame >= B4 && (
        <LogWindow
          title="elvarika-runner"
          from={B4 + 10}
          every={16}
          opacity={seg(frame, B4, B4 + 20)}
          win={{ x: 60, y: 80, w: 1160, h: 510 }}
          fontSize={22}
          lines={[
            { t: "02:14", text: "job a91f stuck 32m → killed", tone: "danger" },
            { t: "02:14", text: "watchdog: timeout threshold 30m", tone: "muted" },
            { t: "01:00", text: "monthly credit refill → applied", tone: "success" },
            { t: "01:00", text: "users.credits reset for all accounts", tone: "muted" },
            { t: "00:41", text: "blocked: self-write to role column", tone: "danger" },
            { t: "00:41", text: "blocked: anon write to word_audio_cache", tone: "danger" },
            { t: "00:41", text: "3 open write paths → closed", tone: "success" },
          ]}
        />
      )}

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureElvarikasBackendRefillsCreditsE06: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
