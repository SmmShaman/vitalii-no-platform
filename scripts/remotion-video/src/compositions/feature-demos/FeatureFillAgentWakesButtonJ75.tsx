/**
 * FeatureFillAgentWakesButtonJ75 — feature j75 — 1280x720, 857 frames @ 30fps,
 * VOICE-SYNCED. Archetype 6 "sidebar narrative", mood violet (assigned by the
 * orchestrating session — not redrawn here). A fixed 320px left column carries
 * the running claim across all 5 beats; the 760px stage on the right is the
 * only thing that changes, the way FeatureLinkedinNativeUpload (p14) does it.
 *
 * UI beats play the REAL product (STEP 0c, 2026-09-06): beat 4 stages a
 * recording of the feature's own bridge-script commit diff on GitHub, beat 5
 * a recording of the feature's own page on vitalii.no. Beats 1-3 have no
 * recordable public page (a Telegram chat, an internal poller loop, and a
 * pure metaphor) so they stay drawn, per the STEP 0c exception.
 *
 * Beat table (measured voiceover — these frame windows ARE the audio):
 *   b1  15-148   "I'd tap 'confirm' on a job in Telegram, and nothing
 *                 happened right away."                         — drawn
 *   b2 157-323   "The agent only checked every two to five minutes, so a
 *                 tap could sit ignored that long."              — drawn
 *   b3 332-466   "Like pressing a crosswalk button that does nothing until
 *                 the light changes anyway."                     — drawn
 *   b4 475-617   "Now the button press sends a webhook straight to the
 *                 agent the instant it fires."          — live "webhook"
 *   b5 626-812   "The old pollers still run, but only as a 30-minute safety
 *                 net, not the main way work gets found." — live "page",
 *                 holds through the tail (no fade-out).
 *
 * Non-crossfade transition: beat 3's crosswalk illustration slides fully off
 * to the left as beat 4's live window slides in from the right (same
 * mechanism as p14's beat2→beat3 handoff). Single tech-credibility caption:
 * the footer line under beat 4 only.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { BrowserWindow, CheckBadge, LightBg, StatPill, fontFamily, seg } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/j75.json";

const P = MOODS.violet;

const SIDEBAR_W = 320;
const STAGE_X = 390;
const STAGE_W = 760;
const STAGE: Win = { x: STAGE_X, y: 128, w: STAGE_W, h: 412 };

const HEADLINES: { text: string; color: string; inAt: number; outAt: number }[] = [
  { text: "Confirming a job didn't wake the agent.", color: P.danger, inAt: 15, outAt: 148 },
  { text: "It just sat there for the next 2-5 min poll.", color: P.danger, inAt: 157, outAt: 323 },
  { text: "A crosswalk button that changes nothing.", color: P.amber, inAt: 332, outAt: 466 },
  { text: "Now a webhook fires the instant you tap.", color: P.accent, inAt: 475, outAt: 617 },
  { text: "Pollers are a 30-min safety net now, not the plan.", color: P.success, inAt: 626, outAt: 9999 },
];

export const FeatureFillAgentWakesButtonJ75: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const beatIdx = frame < 157 ? 0 : frame < 332 ? 1 : frame < 475 ? 2 : frame < 626 ? 3 : 4;

  // ── Beat fades: every beat gone before the next opens, b5 holds to the end ──
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 148, 164));
  const b2 = seg(frame, 157, 173) * (1 - seg(frame, 323, 339));
  const b3 = seg(frame, 332, 348) * (1 - seg(frame, 466, 482));
  const b4 = seg(frame, 475, 491) * (1 - seg(frame, 617, 633));
  const b5 = seg(frame, 626, 646);

  // ── Beat 1: tap registers, nothing changes — elapsed seconds tick up ──
  const elapsedSec = Math.min(9, Math.max(0, Math.floor((frame - 40) / 30)));
  const tapPop = Math.min(1, pop(60));

  // ── Beat 2: two pollers, both far away ──
  const pollerPop1 = Math.min(1, pop(190));
  const pollerPop2 = Math.min(1, pop(216));
  const queuePop = Math.min(1, pop(246));

  // ── Beat 3: crosswalk metaphor, presses do nothing ──
  const pressPop = Math.min(1, pop(360));
  const stillRedOp = seg(frame, 380, 400);

  // ── Beat 3 → 4: real slide, crosswalk off-stage left, webhook in from right ──
  const crosswalkX = interpolate(frame, [440, 466], [0, -1400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const webhookX = interpolate(frame, [475, 501], [1400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const boltPop = Math.min(1, pop(520));
  const techCapOp = seg(frame, 540, 556) * (1 - seg(frame, 617, 633));

  // ── Beat 5: safety-net number + closing checkmark ──
  const numPop = Math.min(1, pop(646));
  const checkPop = Math.min(1, pop(700));

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ SIDEBAR — the one recurring element ════ */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SIDEBAR_W,
            height: 720,
            background: `linear-gradient(180deg, ${P.accentBg} 0%, ${P.card} 78%)`,
            borderRight: `2px solid ${P.border}`,
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 46, fontSize: 14, fontWeight: 700, letterSpacing: 2.4, color: P.muted }}>
            THE CONFIRM BUTTON
          </div>

          <div style={{ position: "absolute", left: 32, top: 90, display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 20,
                  height: 5,
                  borderRadius: 3,
                  background: i <= beatIdx ? P.accent : P.border,
                }}
              />
            ))}
          </div>

          <div style={{ position: "absolute", left: 32, top: 240, width: 256 }}>
            {HEADLINES.map((h) => (
              <div
                key={h.text}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 256,
                  fontSize: 25,
                  fontWeight: 800,
                  lineHeight: 1.3,
                  color: h.color,
                  opacity:
                    seg(frame, h.inAt, h.inAt + 16) *
                    (h.outAt >= 857 ? 1 : 1 - seg(frame, h.outAt, h.outAt + 14)),
                  fontFamily,
                }}
              >
                {h.text}
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", left: 32, top: 650, display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: P.accent,
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ⚡
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: P.ink }}>Fill Agent</div>
          </div>
        </div>

        {/* ════ STAGE — beat 1: Telegram confirm mockup, nothing happens ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y, width: STAGE_W, opacity: b1 }}>
          <BrowserWindow x={0} y={0} w={STAGE_W} h={STAGE.h} title="Telegram — job bot" opacity={Math.min(1, pop(15))}>
            <div style={{ padding: "26px 28px", fontFamily }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: P.ink, marginBottom: 6 }}>Frontend Developer — Acme AS</div>
              <div style={{ fontSize: 14, color: P.muted, marginBottom: 18 }}>Oslo · full-time · posted 2h ago</div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 22px",
                  borderRadius: 12,
                  background: P.successBg,
                  border: `1.5px solid ${P.successEdge}`,
                  color: P.success,
                  fontSize: 17,
                  fontWeight: 700,
                  transform: `scale(${0.94 + tapPop * 0.06})`,
                }}
              >
                {"✅"} Confirm
              </div>
              <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 10, opacity: tapPop }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: P.muted }}>{"⏳"} waiting…</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: P.muted, fontVariantNumeric: "tabular-nums" }}>
                  0:0{elapsedSec}
                </div>
              </div>
            </div>
          </BrowserWindow>
        </div>
        <StatPill x={STAGE_X + 130} y={STAGE.y + STAGE.h + 26} emoji="📵" text="tap registers — agent never hears about it" tone="danger" opacity={b1} />

        {/* ════ STAGE — beat 2: the two pollers, both far away ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y, width: STAGE_W, opacity: b2 }}>
          <BrowserWindow x={0} y={0} w={STAGE_W} h={STAGE.h} title="fill-agent — scheduler" opacity={Math.min(1, pop(157))}>
            <div style={{ padding: "26px 28px", fontFamily }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: P.muted, letterSpacing: 1.2, marginBottom: 16 }}>QUEUE — 1 job waiting</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: P.dangerBg,
                  border: `1.5px solid ${P.dangerEdge}`,
                  opacity: queuePop,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: P.ink }}>Frontend Developer — Acme AS</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: P.danger }}>pending</div>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
                <div
                  style={{
                    flex: 1,
                    padding: "16px 18px",
                    borderRadius: 12,
                    background: P.card,
                    border: `1.5px solid ${P.border}`,
                    opacity: pollerPop1,
                    transform: `translateY(${(1 - pollerPop1) * 14}px)`,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: P.muted }}>POLLER A</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: P.ink, marginTop: 4 }}>2 min</div>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "16px 18px",
                    borderRadius: 12,
                    background: P.card,
                    border: `1.5px solid ${P.border}`,
                    opacity: pollerPop2,
                    transform: `translateY(${(1 - pollerPop2) * 14}px)`,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: P.muted }}>POLLER B</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: P.ink, marginTop: 4 }}>5 min</div>
                </div>
              </div>
            </div>
          </BrowserWindow>
        </div>
        <StatPill x={STAGE_X + 150} y={STAGE.y + STAGE.h + 26} emoji="🐌" text="a single tap can wait almost as long as the poll itself" tone="danger" opacity={b2} />

        {/* ════ STAGE — beat 3: crosswalk metaphor, slides off-stage for beat 4 ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y, width: STAGE_W, opacity: b3, transform: `translateX(${crosswalkX}px)` }}>
          <BrowserWindow x={0} y={0} w={STAGE_W} h={STAGE.h} title="the crosswalk analogy" opacity={Math.min(1, pop(332))}>
            <div style={{ padding: "34px 28px", display: "flex", alignItems: "center", gap: 40, fontFamily }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: P.accentBg,
                    border: `3px solid ${P.accentEdge}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 42,
                    margin: "0 auto",
                    transform: `scale(${0.92 + pressPop * 0.08})`,
                  }}
                >
                  {"👆"}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 12 }}>you press it</div>
              </div>
              <div style={{ fontSize: 32, color: P.muted }}>{"→"}</div>
              <div style={{ textAlign: "center", opacity: stillRedOp }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 18,
                    background: P.dangerBg,
                    border: `3px solid ${P.dangerEdge}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 42,
                    margin: "0 auto",
                  }}
                >
                  {"🚦"}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: P.danger, marginTop: 12 }}>still red</div>
              </div>
            </div>
          </BrowserWindow>
        </div>

        {/* ════ STAGE — beat 4: LIVE webhook bridge commit, slides in from the right ════ */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${webhookX}px)` }}>
          <LiveWindow
            file={shots}
            shot="webhook"
            title="github.com — commit 87443d8 · webhook bridge"
            from={475}
            hold={160}
            zoom={(t) => 1 + 0.12 * t}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b4}
            win={STAGE}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: STAGE_X,
            top: STAGE.y - 62,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: b4,
            transform: `scale(${0.9 + boltPop * 0.1})`,
          }}
        >
          <div style={{ fontSize: 30 }}>{"⚡"}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: P.accent }}>instant handoff, no waiting for the next poll</div>
        </div>
        <div style={{ position: "absolute", left: STAGE_X, top: 626, width: STAGE_W, textAlign: "center", fontSize: 15, fontWeight: 600, color: P.muted, opacity: techCapOp, fontFamily }}>
          a tiny local webhook endpoint — same path for auto-resolved jobs too
        </div>

        {/* ════ STAGE — beat 5: LIVE feature page + the safety-net number ════ */}
        <div style={{ position: "absolute", inset: 0, opacity: b5 }}>
          <LiveWindow
            file={shots}
            shot="page"
            title="vitalii.no/features — the-fill-agent-wakes-…-j75"
            from={626}
            hold={232}
            zoom={(t) => 1 + 0.1 * t}
            focus={{ x: 0.5, y: 0.4 }}
            opacity={b5}
            win={STAGE}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: STAGE_X,
            top: STAGE.y - 66,
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            opacity: b5,
            transform: `scale(${0.92 + numPop * 0.08})`,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 800, color: P.success, letterSpacing: -1.5 }}>30 min</div>
          <div style={{ fontSize: 18, fontWeight: 650, color: P.muted }}>safety net, not the main path</div>
        </div>
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y + STAGE.h + 20, display: "flex", alignItems: "center", gap: 14, opacity: b5 }}>
          <div style={{ position: "relative", width: 36, height: 36 }}>
            <CheckBadge x={0} y={0} size={36} scale={checkPop} opacity={Math.min(1, checkPop)} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: P.ink, opacity: Math.min(1, checkPop) }}>
            confirming a job now wakes the agent immediately
          </div>
        </div>
      </div>
    </PaletteProvider>
  );
};
