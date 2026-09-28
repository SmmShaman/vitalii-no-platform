/**
 * FeatureNetlifyBlockedAccountOverP70 — feature p70 — 1280x720, 925 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 0 split-duel / mood dawn. A vertical seam splits the frame:
 * chaos (Netlify, blocked) on the left, order (the self-hosted VPS) on the
 * right. Both halves stay alive at once; the seam slides left across the
 * clip and, by the payoff, order has taken the whole frame — the duel is won,
 * not decorated. Evidence on the order side is real: commit 214e310 (b3) and
 * the GitHub Actions runs list (b4). The last beat never plays the feature's
 * own page or the hub — it ends on a constructed deploy log built from the
 * feature's own real numbers (40 health checks, 2-minute redeploy), holding
 * at full brightness through the final frame.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–172  "One morning the whole site vanished. My hosting account had been blocked, without warning."
 *  b2 181–390  "Netlify had cut me off. Crawlers indexing the site had quietly burned through the account's entire monthly quota."
 *  b3 399–538  "So I stopped renting space and moved the site onto a server I fully control." — LIVE: commit 214e310
 *  b4 547–709  "Now every push builds itself, tests itself healthy, and goes live on its own." — LIVE: GitHub Actions runs
 *  b5 718–880  "If a release breaks, it rolls itself back — the whole thing redeploys in 2 minutes." — LogWindow, holds to 925.
 *
 * Single tech-credibility caption in the whole clip: "GitHub Actions" chip, beat 4 only.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { LightBg, CaptionBand, StatPill, FilterChip, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/p70.json";

const P = MOODS.dawn;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const PANEL_Y = 110;
const PANEL_H = 490;
const FRAME_L = 40;
const FRAME_R = 1240;
const GAP = 30;

const WIN_B3: Win = { x: 650, y: PANEL_Y, w: 560, h: PANEL_H };
const WIN_B4: Win = { x: 410, y: PANEL_Y, w: 800, h: PANEL_H };
const WIN_B5: Win = { x: 40, y: PANEL_Y, w: 1200, h: PANEL_H };

const DEPLOY_LOG: LogLine[] = [
  { t: "1", text: "git push origin main", tone: "muted" },
  { t: "2", text: "build standalone server + upload artifact", tone: "ink" },
  { t: "3", text: "VPS: unpack release, flip symlink", tone: "ink" },
  { t: "4", text: "health check 1/40 ... 40/40", tone: "accent" },
  { t: "5", text: "✓ new release healthy — traffic switched", tone: "success" },
  { t: "6", text: "watchdog timer rechecks every 2 min", tone: "muted" },
  { t: "7", text: "on failure: auto-rollback to last release", tone: "danger" },
  { t: "8", text: "✓ redeployed in 2 minutes", tone: "success" },
];

export const FeatureNetlifyBlockedAccountOverP70: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Beat windows — fade windows sized to the 9-frame gaps so beats that
  // share the order-panel screen area never crossfade: the earlier one hits
  // 0 exactly as the next begins to rise. ──────────────────────────────────
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 172, 181));
  const b2 = seg(frame, 181, 197) * (1 - seg(frame, 390, 399));
  const b3 = seg(frame, 399, 415) * (1 - seg(frame, 538, 547));
  const b4 = seg(frame, 547, 563) * (1 - seg(frame, 709, 718));
  const b5 = seg(frame, 718, 734); // holds full opacity through frame 925 — no fade-out

  // ── The moving seam: chaos-left / order-right, wipes to a full order win.
  const dividerX = interpolate(
    frame,
    [0, 390, 430, 538, 570, 709, 750, 925],
    [860, 860, 620, 620, 380, 380, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const orderX = dividerX + GAP;
  const chaosWidth = Math.max(0, dividerX - FRAME_L);
  const orderWidth = Math.max(0, FRAME_R - orderX);
  const chaosLabelOp = Math.min(1, chaosWidth / 200);

  const unlock = seg(frame, 390, 405); // order side "unlocks" as the reveal begins
  const lockOp = 1 - unlock;

  const chipPop = interpolate(frame, [560, 580], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Beat 2 — quota gauge fills toward the block ─────────────────────────
  const quotaFill = interpolate(frame, [200, 370], [0.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        quotaFill={quotaFill}
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
  quotaFill: number;
}> = ({ frame, b1, b2, b3, b4, b5, dividerX, orderX, chaosWidth, orderWidth, chaosLabelOp, lockOp, chipPop, quotaFill }) => {
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
            boxShadow: "0 8px 22px rgba(22,35,63,0.10)",
            opacity: b1,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: B.ink }}>Portfolio &amp; News Platform</div>
          <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.35, color: B.muted, fontWeight: 550 }}>
            My personal site and content pipeline: it collects tech news, writes trilingual feature stories about my
            own projects&apos; commits, and renders short narrated video.
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
            <StatPill x={0} y={0} emoji="🚫" text="NETLIFY — BLOCKED" tone="danger" opacity={1} fontSize={15} />
          </div>

          {/* beat 1 — the block */}
          <div style={{ position: "absolute", left: 30, top: 110, width: 700, opacity: b1 }}>
            <div style={{ fontSize: 76, lineHeight: 1 }}>🚫</div>
            <div style={{ marginTop: 18, fontSize: 34, fontWeight: 800, color: B.danger }}>ACCOUNT BLOCKED</div>
            <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600, color: B.muted }}>
              Function-invocation quota exhausted — no warning
            </div>
          </div>

          {/* beat 2 — crawlers burned the quota */}
          <div style={{ position: "absolute", left: 30, top: 100, width: 700, opacity: b2 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: B.ink }}>CRAWLERS BURNED THE QUOTA</div>
            <div style={{ marginTop: 14, display: "flex", gap: 14 }}>
              <FilterChip x={0} y={0} text="/news" icon="🤖" color={B.danger} scale={1} opacity={1} />
              <FilterChip x={0} y={0} text="/blog" icon="🤖" color={B.danger} scale={1} opacity={1} />
            </div>
            <div style={{ marginTop: 30 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.2, color: B.muted }}>MONTHLY FUNCTION QUOTA</div>
              <div style={{ marginTop: 8, width: 420, height: 22, borderRadius: 11, background: "#F0D9DC", overflow: "hidden" }}>
                <div style={{ width: `${quotaFill * 100}%`, height: "100%", borderRadius: 11, background: B.danger }} />
              </div>
              {quotaFill > 0.97 ? (
                <div style={{ marginTop: 8, fontSize: 15, fontWeight: 700, color: B.danger }}>EXHAUSTED — hosting cut off</div>
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
            <StatPill x={0} y={0} emoji="🖥️" text="SELF-HOSTED VPS" tone="success" opacity={1} fontSize={15} />
            <div style={{ marginLeft: 6, fontSize: 12.5, fontWeight: 600, color: B.muted }}>your own server</div>
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

      {/* ════ beat 3 : LIVE — the commit that moved hosting to the VPS ════ */}
      <div style={{ position: "absolute", left: WIN_B3.x, top: WIN_B3.y - 58, opacity: b3 }}>
        <StatPill x={0} y={0} emoji="🔧" text="commit 214e310 — serve from the VPS" tone="accent" opacity={b3} />
      </div>
      <LiveWindow
        file={shots}
        shot="commit"
        title="github.com/…/commit/214e310"
        from={399}
        hold={139}
        zoom={(t) => 2.0 + 0.3 * easeInOut(t)}
        focus={{ x: 0.5, y: 0.35 }}
        opacity={b3}
        win={WIN_B3}
      />

      {/* ════ beat 4 : LIVE — the pipeline that redeploys itself ════ */}
      <div style={{ position: "absolute", left: WIN_B4.x, top: WIN_B4.y - 58, opacity: b4 }}>
        <StatPill x={0} y={0} emoji="🚀" text="every push builds, tests, and ships itself" tone="accent" opacity={b4} />
      </div>
      <div style={{ position: "absolute", left: WIN_B4.x + WIN_B4.w - 190, top: WIN_B4.y - 58 }}>
        <FilterChip x={0} y={0} text="GitHub Actions" icon="⚙️" color={B.accent} scale={Math.min(1, chipPop)} opacity={Math.min(1, chipPop)} />
      </div>
      <LiveWindow
        file={shots}
        shot="actions"
        title="github.com/…/actions"
        from={547}
        hold={162}
        zoom={(t) => 1 + 0.08 * easeInOut(t)}
        focus={{ x: 0.5, y: 0.3 }}
        opacity={b4}
        win={WIN_B4}
      />

      {/* ════ beat 5 : the result — constructed from the feature's own numbers ════ */}
      <div style={{ position: "absolute", left: WIN_B5.x, top: WIN_B5.y - 58, opacity: b5 }}>
        <StatPill x={0} y={0} emoji="🔁" text="a broken release rolls itself back" tone="success" opacity={b5} />
      </div>
      <LogWindow lines={DEPLOY_LOG} title="deploy watchdog" from={734} every={16} opacity={b5} win={WIN_B5} fontSize={22} />

      {/* ════ Captions ════ */}
      <CaptionBand text="Blocked without warning — the whole site went dark" tone="danger" opacity={b1} />
      <CaptionBand text="Crawlers had quietly burned the entire monthly quota" tone="danger" opacity={b2} />
      <CaptionBand text="Now it runs on a server I fully control" tone="accent" opacity={b3} />
      <CaptionBand text="Every push builds, tests itself healthy, and ships on its own" tone="accent" opacity={b4} />
      <CaptionBand text="A broken release rolls itself back — redeployed in 2 minutes" tone="success" opacity={b5} />
    </div>
  );
};
