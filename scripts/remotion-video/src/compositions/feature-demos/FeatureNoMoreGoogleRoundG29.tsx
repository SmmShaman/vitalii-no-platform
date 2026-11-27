// FeatureNoMoreGoogleRoundG29 — feature g29 — 1280x720, 938 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood sand. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// Beat → effect (data only from the feature row and commit 96f3c588):
// b1 15-194  "every question made the app phone home to Google"
//            keywordCaption over the live product (ghost.vitalii.no). On the flow map
//            the first three question nodes branch off toward a GOOGLE hub and ping
//            it — the round trip the sentence names.
// b2 194-387 "that round trip sat on the critical path, could stall translation"
//            funnelAbsorption over the live product again. Map: a fourth branch (the
//            translation question) routes toward GOOGLE and freezes mid-route.
// b3 387-534 "the token died after an hour, killing the interview"
//            statusFocus — invisible plumbing, no public page to show, drawn only.
//            Map: the GOOGLE hub flashes an EXPIRED tag; the frozen branch stays stuck.
// b4 534-758 "now it checks its own session token locally — Cloudflare Workers does the math"
//            handoffExplain over the real commit (96f3c588, backend/worker/src/index.ts),
//            windowed and zoomed to one hunk. Map: GOOGLE flips to LOCAL, the stuck
//            branch snaps home instantly, two more branches arrive and never leave their node.
// b5 758-938 "sessions now run 12 hours, zero round trips"
//            drawn result, no catalog effect — every branch gets a check mark and
//            a LogWindow reveals the session facts. Holds to the end, no fade.
//
// Persistent element: a flow map (archetype 4) across the lower third — six question
// nodes branch by diagonal route into one GOOGLE/LOCAL hub, a token traveling each
// route and branching per beat; the biggest, most central, longest-lived shape tying
// the five beats together, present b1 through b5. Effects keep the bottom 200/1080 px
// clear (look.safeBottom) — that is where it sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import { punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g29.json";

const B1 = 15;
const B2 = 194;
const B3 = 387;
const B4 = 534;
const B5 = 758;
const END = 938;

/** Accent tuned for the dark stage (sand's #B4531F is too dark on a plate). */
const ACCENT = "#F08A4B";
const STAGE = "#1C1610";

// Flow-map geometry (1280×720, below the effects' safe bottom at y≈587).
// Six question nodes zigzag across two rows and branch by diagonal route into one
// hub node on the right — a map, not a single-row strip.
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const CARD_W = 104;
const CARD_H = 40;
const CARD_X0 = 260;
const CARD_GAP = 118;
const ROW_TOP_Y = LT.y + 8;
const ROW_BOT_Y = LT.y + LT.h - 8 - CARD_H;
const NODE_X = 1040;
const NODE_W = 150;
const NODE_H = 76;
const NODE_Y = LT.y + 8;
const HUB_X = NODE_X;
const HUB_Y = NODE_Y + NODE_H / 2;
const HANDOFF = B4 + 40; // frame the GOOGLE node flips to LOCAL

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const triangle = (p: number) => (p < 0.5 ? p * 2 : (1 - p) * 2);

type CardMode = "trip" | "stall" | "instant";
const CARDS: { label: string; arrive: number; mode: CardMode }[] = [
  { label: "Q1", arrive: B1 + 20, mode: "trip" },
  { label: "Q2", arrive: B1 + 60, mode: "trip" },
  { label: "Q3", arrive: B1 + 100, mode: "trip" },
  { label: "Q4", arrive: B2 + 10, mode: "stall" },
  { label: "Q5", arrive: B4 + 90, mode: "instant" },
  { label: "Q6", arrive: B4 + 150, mode: "instant" },
];

const ProductNamePlate: React.FC = () => {
  const P = usePalette();
  return (
    <Arrive at={B1 + 4} kind="wipe" box={{ x: 40, y: 40, w: 300, h: 56 }} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          width: 300,
          height: 56,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>Ghost Interviewer AI</div>
      </div>
    </Arrive>
  );
};

const TOKEN_AGE_BOX = { x: 920, y: 40, w: 320, h: 72 };

/** b3's top-right readout — the invisible plumbing has no page to show, so the
 * countdown to expiry makes the "died after an hour" claim visible on-screen. */
const TokenAgeReadout: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B3 || frame >= B4) return null;
  const secs = Math.min(3600, Math.round(((frame - B3) / (B4 - B3)) * 3600));
  const mm = Math.floor(secs / 60);
  const ss = secs % 60;
  const expired = secs >= 3600;
  return (
    <Arrive at={B3 + 4} kind="wipe" box={TOKEN_AGE_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: TOKEN_AGE_BOX.x,
          top: TOKEN_AGE_BOX.y,
          width: TOKEN_AGE_BOX.w,
          height: TOKEN_AGE_BOX.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 16px",
          boxSizing: "border-box",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: P.muted }}>TOKEN AGE</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: expired ? P.danger : P.ink, marginTop: 2 }}>
          {expired ? "EXPIRED at 60:00" : `${mm}:${String(ss).padStart(2, "0")} / 60:00`}
        </div>
      </div>
    </Arrive>
  );
};

/** A straight route segment between two node centers, as a rotated bar. */
const Branch: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; opacity: number }> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  opacity,
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y1 - 1,
        width: len,
        height: 2,
        background: color,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "0 50%",
        opacity,
      }}
    />
  );
};

const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;

  const nodeLabel = frame < HANDOFF ? "GOOGLE" : "LOCAL";
  const nodeSub = frame < HANDOFF ? "re-verify every question" : "Cloudflare Workers";
  const nodeTone = frame < HANDOFF ? P.danger : P.success;
  const nodeBg = frame < HANDOFF ? P.dangerBg : P.successBg;
  const nodeEdge = frame < HANDOFF ? P.dangerEdge : P.successEdge;
  const expired = frame >= B3 + 40 && frame < HANDOFF;
  const inResult = frame >= B5;

  const title = inResult ? "0 ROUND TRIPS" : "SESSION CHECK";
  const subtitle = inResult ? "12h sessions" : frame < HANDOFF ? "checking Google every question" : "local check, no network";

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
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>{title}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.25 }}>{subtitle}</div>
        </div>
      </Arrive>

      {/* GOOGLE / LOCAL hub node — every branch routes here */}
      <Arrive at={B1 + 4} kind="punch" box={{ x: NODE_X, y: NODE_Y, w: NODE_W, h: NODE_H }}>
        <div
          style={{
            position: "absolute",
            left: NODE_X,
            top: NODE_Y,
            width: NODE_W,
            height: NODE_H,
            background: nodeBg,
            border: `2px solid ${nodeEdge}`,
            borderRadius: 8,
            padding: "9px 10px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: nodeTone, letterSpacing: 1 }}>{nodeLabel}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: P.muted, marginTop: 2 }}>{nodeSub}</div>
        </div>
        {expired && (
          <div
            style={{
              position: "absolute",
              left: NODE_X + 10,
              top: NODE_Y - 26,
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              background: P.danger,
              borderRadius: 3,
              padding: "3px 8px",
            }}
          >
            ✕ TOKEN EXPIRED
          </div>
        )}
      </Arrive>

      {/* Six question nodes zigzag across two rows, each branching into the hub */}
      {CARDS.map((c, i) => {
        if (frame < c.arrive) return null;
        const x = CARD_X0 + i * CARD_GAP;
        const rowY = i % 2 === 0 ? ROW_TOP_Y : ROW_BOT_Y;
        const cx = x + CARD_W / 2;
        const cy = rowY + CARD_H / 2;
        const hx = HUB_X;
        const hy = HUB_Y;
        const t = frame - c.arrive;
        const TRIP = 26;

        let tokenP = 0; // 0 = home, 1 = at hub (via triangle)
        let tag = "";
        let tagTone = P.muted;
        let tagBg = P.chipBg;
        let branchOpacity = 0.55;

        if (c.mode === "trip") {
          tokenP = triangle(clamp01(t / TRIP));
          tag = t >= TRIP ? "called Google" : "";
          tagTone = P.danger;
          tagBg = P.dangerBg;
          branchOpacity = 0.75;
        } else if (c.mode === "stall") {
          if (frame < HANDOFF) {
            tokenP = Math.min(triangle(clamp01(t / TRIP)), 0.5);
            tag = frame >= B2 + 40 ? "stalled" : "";
            tagTone = P.danger;
            tagBg = P.dangerBg;
            branchOpacity = 0.85;
          } else {
            const back = clamp01((frame - HANDOFF) / 10);
            tokenP = 0.5 * (1 - back);
            tag = back >= 1 ? "local, instant" : "unstalling…";
            tagTone = P.success;
            tagBg = P.successBg;
            branchOpacity = 0.3;
          }
        } else {
          // branch exists but is never traveled — the zero-round-trip case
          tokenP = 0;
          tag = "local, instant";
          tagTone = P.success;
          tagBg = P.successBg;
          branchOpacity = 0.12;
        }

        const tokenX = cx + (hx - cx) * tokenP;
        const tokenY = cy + (hy - cy) * tokenP;
        const scale = punchScale(t / 30, 0);
        const showTokenDot = c.mode !== "instant" && (c.mode === "stall" || t < TRIP + 4);
        const checked = inResult && frame >= B5 + i * 12;

        return (
          <React.Fragment key={c.label}>
            <Branch x1={cx} y1={cy} x2={hx} y2={hy} color={tagTone} opacity={branchOpacity} />
            {showTokenDot && (
              <div
                style={{
                  position: "absolute",
                  left: tokenX - 6,
                  top: tokenY - 6,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: tagTone,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                left: x,
                top: rowY,
                width: CARD_W,
                height: CARD_H,
                transform: `scale(${scale})`,
                transformOrigin: `${cx}px ${cy}px`,
                background: checked ? P.successBg : P.card,
                border: `2px solid ${checked ? P.successEdge : P.border}`,
                borderRadius: 20,
                padding: "4px 10px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: P.ink, lineHeight: 1.1 }}>
                {c.label} {checked ? "✓" : ""}
              </div>
              {tag && <div style={{ fontSize: 9, fontWeight: 700, color: tagTone, background: tagBg, borderRadius: 3, padding: "0 4px", marginTop: 1, display: "inline-block" }}>{tag}</div>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — every question phones home to Google, over the live product */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="product" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ line1: "Every single question", line2: "called home to Google", keywords: ["every question", "Google"] }}
      />
      {cut(frame, B1, B2) === 1 && <ProductNamePlate />}

      {/* b2 — the round trip stalls translation mid-sentence */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="product2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["AI answer call", "Live translation", "Session re-check"],
          result: "Both wait on one slow network check",
        }}
      />

      {/* b3 — the token dies after an hour (invisible plumbing, no public page) */}
      <MotionInsert
        effect="statusFocus"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          title: "Session check",
          claims: [
            { text: "Re-verified on every question", verdict: "yes" },
            { text: "Survives past 1 hour", verdict: "no" },
          ],
        }}
      />
      {cut(frame, B3, B4) === 1 && <ProductNamePlate />}
      <TokenAgeReadout />

      {/* b4 — the fix, over the real commit, zoomed to one hunk */}
      {cut(frame, B4, B5) === 1 && (
        <LiveWindow
          file={shotsFile}
          shot="commit"
          title="github.com/SmmShaman/Ghost-Interviewer-AI/commit/96f3c588"
          from={B4}
          hold={B5 - B4}
          zoom={() => 2.2}
          focus={{ x: 0.5, y: 0.42 }}
          opacity={1}
          win={{ x: 40, y: 40, w: 1200, h: 540 }}
        />
      )}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.72}
        data={{
          from: "Network call to Google",
          to: "Local session-token check",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Signed with Web Crypto API", "Verified with zero network calls", "96f3c588"],
        }}
      />

      {/* b5 — the result: zero round trips, twelve-hour sessions. Drawn, holds to the end. */}
      {frame >= B5 && (
        <LogWindow
          title="auth worker"
          from={B5 + 20}
          every={16}
          opacity={1}
          win={{ x: 140, y: 70, w: 1000, h: 480 }}
          fontSize={22}
          lines={[
            { t: "01", text: "session_token: issued (HMAC-SHA256)", tone: "accent" },
            { t: "02", text: "audience check: client_id matches — pass", tone: "success" },
            { t: "03", text: "ttl: 12h", tone: "ink" },
            { t: "04", text: "google_verify_calls: 0", tone: "success" },
            { t: "05", text: "round_trips_this_session: 0", tone: "success" },
            { t: "06", text: "status: session valid, no network needed", tone: "success" },
          ]}
        />
      )}

      <FlowMap />
    </AbsoluteFill>
  );
};

export const FeatureNoMoreGoogleRoundG29: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
