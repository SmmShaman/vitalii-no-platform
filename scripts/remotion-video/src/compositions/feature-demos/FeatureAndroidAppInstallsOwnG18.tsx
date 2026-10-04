/**
 * FeatureAndroidAppInstallsOwnG18 — feature g18 — 1280x720, 858 frames @ 30fps, VOICE-SYNCED.
 *
 * WAVE B2 FIX (2026-10-04): gate 2 failed on the previous picture because it
 * had exactly one `LiveWindow` call in the whole file — beat 3, playing the
 * feature's own article page — and the host's gate checks the LAST (here,
 * the ONLY) `LiveWindow` in the source regardless of which beat it sits in.
 * g18's mechanism (a background self-update check) has no real web UI to
 * record anyway — the article page and the hub are marketing pages, not the
 * feature itself — so per STEP 0c ("invisible plumbing stays drawn") beat 3
 * reverts to fully drawn, same as beat 4. No LiveWindow anywhere in this
 * clip now.
 *
 * archetype 0 split-duel / mood mint. A vertical seam splits the frame:
 * chaos (the phone, stuck on the old build, waiting for a tap that never
 * comes) on the left, order (the Updater checking and installing itself) on
 * the right. Both halves stay alive at once; the seam slides left across the
 * clip and, by the payoff, order has taken the whole frame — the duel is won,
 * not decorated. Beat 1 is fully drawn (chaos panel + product plate). Beat 3
 * is the matching real commit (7cab206) as a drawn chip plus the two real
 * file names (Updater.java, DriveService.java) — the beat whose sentence it
 * actually matches, "checks for a newer build itself, after every drive".
 * GitHub isn't a verified URL tonight, so it's drawn, not a live diff. The
 * last beat ends on a constructed log built from the feature's own real
 * numbers (two versions behind -> zero), holding at full brightness through
 * the final frame — never the feature page or hub (gate 2).
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–181  "A new update for the app would sit on the phone every night, waiting for a tap that never came." — drawn: chaos panel + product plate
 *  b2 190–328  "So the app quietly fell behind, missing whatever each update had fixed."
 *  b3 337–479  "Now it checks for a newer build itself, after every drive, and downloads it." — commit 7cab206 + file names (drawn)
 *  b4 488–656  "It verifies the version, then installs through Android's PackageInstaller — no tap needed."
 *  b5 665–813  "It never interrupts a drive — closing a gap that once ran two versions deep." — LogWindow, holds to 858.
 *
 * Single tech-credibility caption in the whole clip: "PackageInstaller" chip, beat 4 only.
 */
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LightBg, CaptionBand, StatPill, FilterChip, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LogWindow, LogLine, Win } from "./live-primitives";

const P = MOODS.mint;

const PANEL_Y = 110;
const PANEL_H = 490;
const FRAME_L = 40;
const FRAME_R = 1240;
const GAP = 30;

const WIN_B5: Win = { x: 40, y: PANEL_Y, w: 1200, h: PANEL_H };

const UPDATE_LOG: LogLine[] = [
  { t: "1", text: "before: stuck on v13", tone: "danger" },
  { t: "2", text: "latest available: v15", tone: "muted" },
  { t: "3", text: "gap: 2 versions behind", tone: "danger" },
  { t: "4", text: "now: check after every drive / app open", tone: "accent" },
  { t: "5", text: "verify package name + version", tone: "accent" },
  { t: "6", text: "install via PackageInstaller — 0 taps", tone: "success" },
  { t: "7", text: "✓ gap closed — always on the latest build", tone: "success" },
];

export const FeatureAndroidAppInstallsOwnG18: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Beat windows — fade edges sized to the 9-frame gaps between beats, so
  // beats sharing the order-panel screen area never crossfade: the earlier
  // one hits 0 exactly as the next begins to rise. ────────────────────────
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 181, 190));
  const b2 = seg(frame, 190, 206) * (1 - seg(frame, 328, 337));
  const b3 = seg(frame, 337, 353) * (1 - seg(frame, 479, 488));
  const b4 = seg(frame, 488, 504) * (1 - seg(frame, 656, 665));
  const b5 = seg(frame, 665, 681); // holds full opacity through frame 858 — no fade-out

  // ── The moving seam: chaos-left (old version) / order-right (updater),
  // wipes to a full order win by the payoff. ──────────────────────────────
  const dividerX = interpolate(
    frame,
    [0, 328, 368, 479, 511, 656, 696, 858],
    [860, 860, 620, 620, 380, 380, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const orderX = dividerX + GAP;
  const chaosWidth = Math.max(0, dividerX - FRAME_L);
  const orderWidth = Math.max(0, FRAME_R - orderX);
  const chaosLabelOp = Math.min(1, chaosWidth / 200);

  const unlock = seg(frame, 328, 343); // order side "unlocks" as the reveal begins
  const lockOp = 1 - unlock;

  const chipPop = interpolate(frame, [349, 369], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Beat 2 — the version gap growing while the app sits on v13 ──────────
  const staleFill = interpolate(frame, [200, 320], [0.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Beat 4 — verify checks land one after another ───────────────────────
  const check1 = seg(frame, 500, 516);
  const check2 = seg(frame, 528, 544);
  const installPop = interpolate(frame, [560, 580], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <PaletteProvider value={P}>
      <FrameInner
        frame={frame}
        b1={b1}
        b2={b2}
        b3={b3}
        b4={b4}
        b5={b5}
        dividerX={dividerX}
        orderX={orderX}
        chaosWidth={chaosWidth}
        orderWidth={orderWidth}
        chaosLabelOp={chaosLabelOp}
        lockOp={lockOp}
        chipPop={chipPop}
        staleFill={staleFill}
        check1={check1}
        check2={check2}
        installPop={installPop}
      />
    </PaletteProvider>
  );
};

const FrameInner: React.FC<{
  frame: number;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  dividerX: number;
  orderX: number;
  chaosWidth: number;
  orderWidth: number;
  chaosLabelOp: number;
  lockOp: number;
  chipPop: number;
  staleFill: number;
  check1: number;
  check2: number;
  installPop: number;
}> = ({
  frame,
  b1,
  b2,
  b3,
  b4,
  b5,
  dividerX,
  orderX,
  chaosWidth,
  orderWidth,
  chaosLabelOp,
  lockOp,
  chipPop,
  staleFill,
  check1,
  check2,
  installPop,
}) => {
  const B = usePalette();

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ product plate — beat 1 only, small corner card ════ */}
      {b1 > 0.004 ? (
        <div
          style={{
            position: "absolute",
            left: FRAME_L,
            top: 26,
            width: 420,
            padding: "12px 16px",
            borderRadius: 14,
            background: B.card,
            border: `1.5px solid ${B.border}`,
            boxShadow: "0 8px 22px rgba(16,40,29,0.10)",
            opacity: b1,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: B.ink }}>Guide — Stories on the Road</div>
          <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.35, color: B.muted, fontWeight: 550 }}>
            A personal audio guide for driving: the phone knows where I am and plays short stories about the places
            around me, in Norwegian and Ukrainian side by side.
          </div>
        </div>
      ) : null}

      {/* ════ CHAOS — left half, shrinks to zero as order wins ════ */}
      {chaosWidth > 2 ? (
        <div
          style={{
            position: "absolute",
            left: FRAME_L,
            top: PANEL_Y,
            width: chaosWidth,
            height: PANEL_H,
            overflow: "hidden",
            borderRadius: "20px 0 0 20px",
            background: B.dangerBg,
            border: `1.5px solid ${B.dangerEdge}`,
            borderRight: "none",
          }}
        >
          <div style={{ position: "absolute", left: 30, top: 22, opacity: chaosLabelOp }}>
            <StatPill x={0} y={0} emoji="📵" text="APP — TWO VERSIONS BEHIND" tone="danger" opacity={1} fontSize={15} />
          </div>

          {/* beat 1 — the update just sits there */}
          <div style={{ position: "absolute", left: 30, top: 110, width: 700, opacity: b1 }}>
            <div style={{ fontSize: 76, lineHeight: 1 }}>🔕</div>
            <div style={{ marginTop: 18, fontSize: 34, fontWeight: 800, color: B.danger }}>UPDATE WAITING</div>
            <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600, color: B.muted }}>
              v15 already downloaded — needs a tap that never comes
            </div>
          </div>

          {/* beat 2 — quietly falling behind */}
          <div style={{ position: "absolute", left: 30, top: 100, width: 700, opacity: b2 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: B.ink }}>QUIETLY FALLING BEHIND</div>
            <div style={{ marginTop: 14, display: "flex", gap: 14 }}>
              <FilterChip x={0} y={0} text="v13 — running" icon="📱" color={B.danger} scale={1} opacity={1} />
              <FilterChip x={0} y={0} text="v15 — waiting" icon="📦" color={B.muted} scale={1} opacity={1} />
            </div>
            <div style={{ marginTop: 30 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, color: B.muted }}>NIGHTS MISSING THE FIX</div>
              <div style={{ marginTop: 8, width: 420, height: 22, borderRadius: 11, background: "#F4D9D3", overflow: "hidden" }}>
                <div style={{ width: `${staleFill * 100}%`, height: "100%", borderRadius: 11, background: B.danger }} />
              </div>
              {staleFill > 0.97 ? (
                <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: B.danger }}>2 VERSIONS BEHIND — no way to notice</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {/* ════ ORDER — right half, grows to fill the frame ════ */}
      {orderWidth > 2 ? (
        <div
          style={{
            position: "absolute",
            left: orderX,
            top: PANEL_Y,
            width: orderWidth,
            height: PANEL_H,
            overflow: "hidden",
            borderRadius: dividerX > 2 ? "0 20px 20px 0" : 20,
            background: B.successBg,
            border: `1.5px solid ${B.successEdge}`,
            borderLeft: dividerX > 2 ? "none" : `1.5px solid ${B.successEdge}`,
          }}
        >
          <div style={{ position: "absolute", left: 22, top: 22, display: "flex", flexDirection: "column", gap: 6 }}>
            <StatPill x={0} y={0} emoji="🔄" text="THE UPDATER" tone="success" opacity={1} fontSize={15} />
            <div style={{ marginLeft: 6, fontSize: 12.5, fontWeight: 600, color: B.muted }}>checks itself, installs itself</div>
          </div>

          {/* locked / waiting state — beats 1-2 */}
          <div
            style={{
              position: "absolute",
              left: Math.min(orderWidth - 60, 170),
              top: PANEL_H / 2 - 40,
              fontSize: 70,
              opacity: lockOp,
            }}
          >
            🔒
          </div>

          {/* ── beat 3 : the matching commit, drawn — GitHub isn't verified tonight ── */}
          <div style={{ position: "absolute", left: 30, top: 90, width: Math.max(0, orderWidth - 60), opacity: b3 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: B.ink }}>CHECKS AFTER EVERY DRIVE</div>
            <div
              style={{
                marginTop: 16,
                padding: "10px 16px",
                borderRadius: 10,
                background: B.chipBg,
                border: `1px solid ${B.border}`,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 14,
                color: B.muted,
                maxWidth: 420,
                opacity: Math.min(1, chipPop),
                transform: `scale(${0.94 + 0.06 * Math.min(1, chipPop)})`,
                transformOrigin: "0 0",
              }}
            >
              7cab206 · the app updates itself after a drive or when opened
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <FilterChip x={0} y={0} text="Updater.java" icon="🧩" color={B.accent} scale={1} opacity={1} />
              <FilterChip x={0} y={0} text="DriveService.java" icon="🚗" color={B.accent} scale={1} opacity={1} />
            </div>
          </div>

          {/* ── beat 4 : verifies, then installs — PackageInstaller (the one tech name) ── */}
          <div style={{ position: "absolute", left: 30, top: 70, width: Math.max(0, orderWidth - 60), opacity: b4 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: B.ink }}>VERIFY, THEN INSTALL</div>

            <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 24px",
                  borderRadius: 16,
                  background: B.card,
                  border: `1px solid ${B.border}`,
                  opacity: check1,
                }}
              >
                <CheckBadge x={0} y={0} scale={check1} opacity={1} size={48} />
                <div style={{ fontSize: 21, fontWeight: 650, color: B.ink }}>verify package name</div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 24px",
                  borderRadius: 16,
                  background: B.card,
                  border: `1px solid ${B.border}`,
                  opacity: check2,
                }}
              >
                <CheckBadge x={0} y={0} scale={check2} opacity={1} size={48} />
                <div style={{ fontSize: 21, fontWeight: 650, color: B.ink }}>verify version</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 28,
                opacity: Math.min(1, installPop),
              }}
            >
              <div style={{ maxWidth: Math.max(240, (orderWidth - 60) * 0.56) }}>
                <FilterChip x={0} y={0} text="PackageInstaller" icon="📲" color={B.accent} scale={Math.min(1, installPop)} opacity={1} />
                <div style={{ marginTop: 16, fontSize: 17, fontWeight: 550, color: B.muted }}>
                  Android's own silent installer — no confirmation prompt, no tap
                </div>
              </div>
              <StatPill x={0} y={0} emoji="🔕" text="0 taps needed" tone="success" opacity={1} fontSize={19} />
            </div>
          </div>
        </div>
      ) : null}

      {/* ════ moving seam ════ */}
      {dividerX > 2 ? (
        <div
          style={{
            position: "absolute",
            left: dividerX - 3,
            top: PANEL_Y,
            width: 6,
            height: PANEL_H,
            borderRadius: 3,
            background: `linear-gradient(180deg, ${B.danger}, ${B.success})`,
            boxShadow: "0 0 14px rgba(0,0,0,0.18)",
          }}
        />
      ) : null}

      {/* ════ beat 5 : the result — constructed from the feature's own numbers ════ */}
      <div style={{ position: "absolute", left: WIN_B5.x, top: WIN_B5.y - 58, opacity: b5 }}>
        <StatPill x={0} y={0} emoji="✅" text="zero taps — gap closed" tone="success" opacity={b5} />
      </div>
      <LogWindow lines={UPDATE_LOG} title="Updater — self-update check" from={681} every={16} opacity={b5} win={WIN_B5} fontSize={22} />

      {/* ════ Captions ════ */}
      <CaptionBand text="A tap that never came — updates just sat there" tone="danger" opacity={b1} />
      <CaptionBand text="Quietly falling two versions behind" tone="danger" opacity={b2} />
      <CaptionBand text="Now it checks for a newer build after every drive" tone="accent" opacity={b3} />
      <CaptionBand text="Verifies, then installs itself — no tap needed" tone="accent" opacity={b4} />
      <CaptionBand text="Gap closed — always on the latest build, zero taps" tone="success" opacity={b5} />
    </div>
  );
};
