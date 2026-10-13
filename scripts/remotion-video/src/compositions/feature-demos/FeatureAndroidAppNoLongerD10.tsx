// FeatureAndroidAppNoLongerD10 — feature d10 — 1280x720, 793 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood slate. Motion direction (feature-motion skill, 2026-10-07).
//
// Ledger lower third: a receipt-style ticket in the y>=606 band carries two
// login-loss line items that post in red as the problem beats land, then both
// strike through and rewrite in green once the fix arrives — and a TOTAL row
// underneath does the archetype's own move literally: the cost line is struck
// through and the ledger is rewritten in green with the total crossed out and
// replaced (feature-motion skill convention; same band geometry as p75/d09's
// lower third, y=606, h=92).
//
// Only two URLs were verified tonight — the feature's own page and the features
// hub — so b1-b4 each carry one live recording; b5 is drawn (no backdrop), the
// way p77/d13's closing beats already do it in this codebase. Gate 2: neither
// the feature page nor the hub appears in b5.
//
// Beat → picture (data only from the feature row, its two commits, and the
// mechanism the beats themselves describe — polling every 2 seconds, a
// one-time code, a login landing):
// b1 15-149   "You sign into Google, switch back to the app... it still says
//             log in." titleTakeover over a dimmed LiveBackdrop of the
//             feature's own page — names the problem and the product in one
//             line (ProductPlate), no tech name yet. First red ledger line
//             ("Google sign-in — dropped") posts.
// b2 149-347  "While you were in the browser, Android quietly closed the
//             app... it never saw you finish." pipelineFlow over the features
//             hub — the mechanism, stage by stage. Second red ledger line
//             ("App restart — lost the login") posts; TOTAL posts "2 lost".
// b3 347-482  "It was like knocking on a door, then walking away before
//             anyone answered." keywordCaption, drawn (no backdrop) — the
//             metaphor beat. Ledger holds at two open red lines + total.
// b4 482-631  "Now the app leaves a one-time code behind and keeps checking
//             back for it itself." handoffExplain over a second feature-page
//             recording — the one tech name in the whole script lands here,
//             glossed once (TechGloss). Commit 49d9a9f ("reliable Google
//             login") is cited as text inside the effect's own points — no
//             GitHub diff is recorded, since no GitHub URL was verified
//             tonight. Both ledger rows strike through and rewrite green;
//             the TOTAL strikes through right after and rewrites "0 lost".
// b5 631-793  "It checks in every two seconds, until the login lands."
//             drawn only — a full-stage LogWindow built from the feature's
//             own numbers (polling interval, one-time code, login landing),
//             5-8 real lines revealed one by one, paired with a login-status
//             panel that flips PENDING -> SIGNED IN on the log's last line.
//             The real result, no invented metric. Holds bright to frame 792,
//             no fade, no cut to black. Neither the page nor the hub is shown
//             here (Gate 2).
//
// Persistent element: the ledger lower third (archetype 5), b1 through b5,
// y>=606. ProductPlate names "Insulin Simulator" from b1 onward.
//
// Commits: e1e194d is not cited anywhere in this clip — it does not match any
// beat's sentence. 49d9a9f ("reliable Google login") matches b4 exactly and is
// cited as text inside handoffExplain's points; it is never shown as a diff.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/d10.json";

const B1 = 15;
const B2 = 149;
const B3 = 347;
const B4 = 482;
const B5 = 631;
const END = 793;

/** Accent tuned for the dark stage — slate's own #0E7490 reads a little muddy
 * on a dark plate (same fix as p75/d13/d09's sand). */
const ACCENT = "#38BDF8";
const STAGE = "#0B1420";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Ledger geometry — same band as the lower-third references (y>=606).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const PLATE_BOX = { x: 40, y: 28, w: 420, h: 38 };
const GLOSS_BOX = { x: 40, y: 80, w: 480, h: 26 };

type RowState = "hidden" | "red" | "striking" | "resolved";

const rowState = (frame: number, showAt: number, strikeAt: number, strikeDur: number): RowState => {
  if (frame < showAt) return "hidden";
  if (frame < strikeAt) return "red";
  if (frame < strikeAt + strikeDur) return "striking";
  return "resolved";
};

const ROW_STRIKE_DUR = 28;
const TOTAL_STRIKE_DUR = 28;
const ROW1_SHOW = B1 + 20;
const ROW2_SHOW = B2 + 20;
const ROW_STRIKE_AT = B4;
const TOTAL_SHOW = B2 + 40;
const TOTAL_STRIKE_AT = B4 + 40;

/** Persistent archetype 5 (ledger): two login-loss line items post in red,
 * then strike through and rewrite in green, and a TOTAL row underneath does
 * the same move once more — the archetype's "line after line of cost adding
 * up, then the same ledger rewritten with the total struck through." */
const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const row1 = rowState(frame, ROW1_SHOW, ROW_STRIKE_AT, ROW_STRIKE_DUR);
  const row2 = rowState(frame, ROW2_SHOW, ROW_STRIKE_AT, ROW_STRIKE_DUR);
  const total = rowState(frame, TOTAL_SHOW, TOTAL_STRIKE_AT, TOTAL_STRIKE_DUR);

  const strike1 = tween(sec(frame, ROW_STRIKE_AT, fps), 0, ROW_STRIKE_DUR / fps, ease.power3InOut);
  const strike2 = tween(sec(frame, ROW_STRIKE_AT, fps), 0, ROW_STRIKE_DUR / fps, ease.power3InOut);
  const strikeT = tween(sec(frame, TOTAL_STRIKE_AT, fps), 0, TOTAL_STRIKE_DUR / fps, ease.power3InOut);

  const row1Text = row1 === "resolved" ? "Google sign-in — holds" : "Google sign-in — dropped";
  const row2Text = row2 === "resolved" ? "One-time code — confirms it" : "App restart — lost the login";
  const row1Color = row1 === "resolved" ? P.success : P.danger;
  const row2Color = row2 === "resolved" ? P.success : P.danger;

  const totalText = total === "resolved" ? "TOTAL: 0 lost — confirmed automatically" : "TOTAL: 2 logins lost";
  const totalColor = total === "resolved" ? P.success : P.danger;

  const allResolved = row1 === "resolved" && row2 === "resolved" && (total === "resolved" || total === "striking");

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
            border: `2px solid ${allResolved ? P.successEdge : P.border}`,
            borderRadius: 4,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              top: 6,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.6,
              color: P.muted,
              whiteSpace: "nowrap",
            }}
          >
            🧾 LEDGER
          </div>

          {row1 !== "hidden" && (
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 26,
                fontSize: 13,
                fontWeight: 700,
                color: row1Color,
                whiteSpace: "nowrap",
              }}
            >
              {row1Text}
              {row1 === "striking" && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 7,
                    height: 2,
                    width: "100%",
                    background: P.ink,
                    transformOrigin: "left center",
                    transform: `scaleX(${strike1})`,
                  }}
                />
              )}
            </div>
          )}

          {row2 !== "hidden" && (
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 46,
                fontSize: 13,
                fontWeight: 700,
                color: row2Color,
                whiteSpace: "nowrap",
              }}
            >
              {row2Text}
              {row2 === "striking" && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 7,
                    height: 2,
                    width: "100%",
                    background: P.ink,
                    transformOrigin: "left center",
                    transform: `scaleX(${strike2})`,
                  }}
                />
              )}
            </div>
          )}

          {total !== "hidden" && (
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 68,
                fontSize: 15,
                fontWeight: 800,
                color: totalColor,
                whiteSpace: "nowrap",
              }}
            >
              {totalText}
              {total === "striking" && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 9,
                    height: 2,
                    width: "100%",
                    background: P.ink,
                    transformOrigin: "left center",
                    transform: `scaleX(${strikeT})`,
                  }}
                />
              )}
            </div>
          )}
        </div>
      </Arrive>
    </div>
  );
};

/** "Insulin Simulator" product-name plate — persists from b1, names the app
 * in one plain line (same pill as d07/d08/d13). */
const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B1) return null;
  return (
    <Arrive at={B1} kind="wipe" box={PLATE_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: PLATE_BOX.x,
          top: PLATE_BOX.y,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px",
          borderRadius: 999,
          background: "rgba(11,20,32,0.82)",
          border: `1.5px solid ${ACCENT}`,
          color: "#E8F2FA",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 0.3,
          fontFamily,
        }}
      >
        <span style={{ color: ACCENT, fontWeight: 800 }}>Insulin Simulator</span>
        <span style={{ opacity: 0.85 }}>— a diabetes simulator for my son Artem</span>
      </div>
    </Arrive>
  );
};

/** One plain gloss for the one tech name in the script, shown only during b4. */
const TechGloss: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B4 || frame >= B5) return null;
  return (
    <Arrive at={B4} kind="rise" box={GLOSS_BOX} dur={0.35}>
      <div
        style={{
          position: "absolute",
          left: GLOSS_BOX.x,
          top: GLOSS_BOX.y,
          fontFamily,
          fontSize: 15,
          fontWeight: 600,
          color: "#CBDCEA",
        }}
      >
        <span style={{ color: ACCENT, fontWeight: 800 }}>one-time code</span> — a token the app keeps and checks for
        itself
      </div>
    </Arrive>
  );
};

/** b5 — the product "running": a full-stage terminal log built from the
 * feature's own mechanism (2-second polling, a one-time code, a login
 * landing), paired with a status panel that flips once the log's last line
 * lands. Drawn only — neither the feature page nor the hub appears here. */
const LoginLog: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const visible = cut(frame, B5, END) === 1;
  if (!visible) return null;
  const lines = [
    { text: "google sign-in: starting", tone: "muted" as const },
    { text: "google account confirmed", tone: "accent" as const },
    { text: "returning to app...", tone: "muted" as const },
    { text: "android closed the app in background", tone: "danger" as const },
    { text: "one-time code saved: 7f2a91", tone: "accent" as const },
    { text: "polling for login status (every 2s)", tone: "muted" as const },
    { text: "polling for login status (every 2s)", tone: "muted" as const },
    { text: "login confirmed — code 7f2a91", tone: "success" as const },
  ];
  const every = 14;
  // the last line (index 7) is when the status panel flips
  const unlockFrame = B5 + 7 * every;
  const signedIn = frame >= unlockFrame;
  const t = tween(sec(frame, B5 + 6, fps), 0, 0.35, ease.power3Out);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: STAGE }} />
      <AbsoluteFill style={{ background: `rgba(8,8,8,${PLATE})` }} />
      <LogWindow
        title="google sign-in"
        from={B5}
        every={every}
        opacity={1}
        fontSize={21}
        win={{ x: 40, y: 50, w: 700, h: 530 }}
        lines={lines}
      />
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 150,
          width: 380,
          padding: 24,
          borderRadius: 6,
          background: "rgba(10,20,32,0.82)",
          border: `2px solid ${P.accent}`,
          opacity: t,
          transform: `translateY(${(1 - t) * 20}px)`,
          fontFamily,
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>LOGIN STATUS</div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 260,
              height: 56,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 0.5,
              color: signedIn ? "#0A1712" : "rgba(220,230,245,0.45)",
              background: signedIn ? P.success : "rgba(255,255,255,0.08)",
              border: `2px solid ${signedIn ? P.successEdge : P.dangerEdge}`,
              boxShadow: signedIn ? `0 0 0 4px ${P.successBg}` : "none",
            }}
          >
            <span>{signedIn ? "✅" : "🔒"}</span>
            <span>{signedIn ? "SIGNED IN" : "PENDING"}</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 14,
            fontWeight: 700,
            textAlign: "center",
            color: signedIn ? P.success : P.danger,
          }}
        >
          {signedIn ? "code matched — login landed" : "waiting on the one-time code"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — still says log in, even after signing into Google */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.03} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.78}
        data={{ title: "Still says log in", kicker: "Even after signing in with Google" }}
      />

      {/* b2 — the mechanism: Android quietly closes the app before it saw you finish */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} push={0.03} />}
      <MotionInsert
        effect="pipelineFlow"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.76}
        data={{
          steps: ["Sign in with Google", "Switch back to app", "Android kills the app", "Login never confirmed"],
          result: "Still logged out",
          system: "Android background limits",
        }}
      />

      {/* b3 — the metaphor, drawn, no backdrop and no commit fit */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.82}
        base={STAGE}
        data={{
          line1: "You knocked on the door,",
          line2: "then walked away before anyone answered.",
          keywords: ["knocked", "answered"],
        }}
      />

      {/* b4 — the fix: a one-time code the app leaves itself and polls for */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B4} hold={B5 - B4} push={0.03} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.8}
        data={{
          from: "Walks away after knocking",
          to: "Leaves a code, keeps checking",
          points: ["One-time code = a retry token", "Polls every 2 seconds", "Commit 49d9a9f: reliable Google login"],
          fromLabel: "BEFORE",
          toLabel: "NOW",
        }}
      />
      <TechGloss />

      {/* b5 — the result, drawn only; neither the page nor the hub appears here */}
      <LoginLog />

      <ProductPlate />
      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureAndroidAppNoLongerD10: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
