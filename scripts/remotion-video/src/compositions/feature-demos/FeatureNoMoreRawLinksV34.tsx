/**
 * FeatureNoMoreRawLinksV34 — feature v34 — 1280x720, 1024 frames @ 30fps,
 * VOICE-SYNCED. Archetype 5 "ledger", mood sand (assigned by the
 * orchestrating session — not redrawn here). Hybrid layout: a persistent
 * 300px receipt card on the left (the ledger, alive for the whole clip —
 * two problem rows strike through into fixed rows, a third row appears late,
 * a TOTAL ISSUES number counts 2 -> 1 -> 0) plus an 860px stage on the right
 * that swaps content per beat, the way FeatureCrossPlatformDistribution (p13)
 * runs its ledger and FeatureFillAgentWakesButtonJ75 (j75) runs its stage.
 *
 * UI beats play the REAL product (STEP 0c, 2026-09-06): beat 3 stages a
 * recording of the repo's commit history (the fix landing), beat 4 a
 * recording of the repo's Actions runs (the workflow shipping it). Beats 1,
 * 2 and 5 have no single recordable public page for the exact moment being
 * described (a LinkedIn post body, a run of inconsistent Facebook posts, an
 * internal retry loop) so they stay drawn, per the STEP 0c exception.
 *
 * Beat table (measured voiceover — these frame windows ARE the audio):
 *   b1  15-232  "Every LinkedIn post carried a raw link in the text — exactly
 *                what LinkedIn's algorithm seems to quietly punish." — drawn
 *   b2 241-421  "Facebook was inconsistent too — link, hashtags, source, in
 *                no fixed order."                                   — drawn
 *   b3 430-657  "Now the link never touches the post body. A Supabase Edge
 *                Function publishes first, then drops it into the first
 *                comment."                                — live "commits"
 *   b4 666-842  "Facebook now follows one fixed order, showing the plain
 *                source domain instead of a raw link."     — live "actions"
 *   b5 851-1024 "And if that comment fails, it retries — up to three
 *                times."  — drawn, holds through the tail (no fade-out).
 *
 * Non-crossfade transition: beat 2's Facebook mockup slides fully off to the
 * left as beat 3's live commits window slides in from the right (same
 * mechanism as p14/j75's beat handoffs). Single tech-credibility caption:
 * the "Supabase Edge Function" line under beat 3 only.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { BrowserWindow, CheckBadge, LightBg, StatPill, fontFamily, seg } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/v34.json";

const P = MOODS.sand;

const TAPE_X = 40;
const TAPE_Y = 42;
const TAPE_W = 300;
const TAPE_H = 336;
const PAD = 26;

const STAGE_X = 380;
const STAGE_W = 860;
const STAGE: Win = { x: STAGE_X, y: 128, w: STAGE_W, h: 412 };

/** One receipt line: label, dotted leader, value — with an optional strike-through wipe. */
const LedgerRow: React.FC<{
  y: number;
  label: string;
  value: string;
  tone: "danger" | "success" | "amber";
  opacity?: number;
  strike?: number;
  fontSize?: number;
}> = ({ y, label, value, tone, opacity = 1, strike = 0, fontSize = 14.5 }) => {
  if (opacity <= 0.004) return null;
  const c = tone === "danger" ? P.danger : tone === "amber" ? P.amber : P.success;
  return (
    <div
      style={{
        position: "absolute",
        left: TAPE_X + PAD,
        top: y,
        width: TAPE_W - PAD * 2,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        opacity,
        fontFamily,
      }}
    >
      <span style={{ position: "relative", fontSize: 12.5, fontWeight: 700, color: P.muted }}>{label}</span>
      <span style={{ position: "relative", fontSize, fontWeight: 800, color: c, display: "inline-block" }}>
        {value}
        {strike > 0.004 ? (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              height: 2,
              width: `${Math.min(1, strike) * 100}%`,
              background: P.ink,
            }}
          />
        ) : null}
      </span>
    </div>
  );
};

const Dash: React.FC<{ y: number }> = ({ y }) => (
  <div style={{ position: "absolute", left: TAPE_X + PAD, top: y, width: TAPE_W - PAD * 2, borderBottom: `1.5px dashed ${P.border}` }} />
);

export const FeatureNoMoreRawLinksV34: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat fades: every beat gone before the next opens, b5 holds to the end ──
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 232, 248));
  const b2 = seg(frame, 241, 257) * (1 - seg(frame, 421, 437));
  const b3 = seg(frame, 430, 446) * (1 - seg(frame, 657, 673));
  const b4 = seg(frame, 666, 682) * (1 - seg(frame, 842, 858));
  const b5 = seg(frame, 851, 867);

  const cardPop = pop(4);

  // ── Ledger row 1 — LinkedIn: blocked -> clean, swaps mid beat 3 ──
  const row1StrikeStart = 560;
  const row1StrikeEnd = 572;
  const row1OldGone = 580;
  const row1NewIn = 596;
  const row1Strike = seg(frame, row1StrikeStart, row1StrikeEnd);
  const row1OldOp = 1 - seg(frame, row1StrikeEnd, row1OldGone);
  const row1NewOp = seg(frame, row1OldGone, row1NewIn);

  // ── Ledger row 2 — Facebook: inconsistent -> fixed order, swaps mid beat 4 ──
  const row2StrikeStart = 760;
  const row2StrikeEnd = 772;
  const row2OldGone = 780;
  const row2NewIn = 796;
  const row2Strike = seg(frame, row2StrikeStart, row2StrikeEnd);
  const row2OldOp = 1 - seg(frame, row2StrikeEnd, row2OldGone);
  const row2NewOp = seg(frame, row2OldGone, row2NewIn);

  // ── Ledger row 3 — comment delivery, appears fresh in beat 5 ──
  const row3Op = Math.min(1, pop(890));

  // ── TOTAL ISSUES: 2 (danger) -> 1 (amber) -> 0 (success) ──
  const t1Strike = seg(frame, 596, 608);
  const t2Op = 1 - seg(frame, 608, 616);
  const t1Op = seg(frame, 616, 628) * (1 - seg(frame, 808, 816));
  const t1Strike2 = seg(frame, 796, 808);
  const t0Op = seg(frame, 816, 828);

  // ── Beat 1: LinkedIn raw link sits in the post body ──
  const linkPop = Math.min(1, pop(50));

  // ── Beat 2: Facebook — two posts, two different orders ──
  const postAPop = Math.min(1, pop(266));
  const postBPop = Math.min(1, pop(300));

  // ── Beat 2 -> 3: real slide, Facebook off-stage left, commits in from right ──
  const facebookX = interpolate(frame, [395, 421], [0, -1400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const commitsX = interpolate(frame, [430, 456], [1400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const techCapOp = seg(frame, 480, 496) * (1 - seg(frame, 657, 673));

  // ── Beat 4: Facebook now fixed — plain source domain, one order ──
  const fixedCapOp = seg(frame, 700, 716) * (1 - seg(frame, 842, 858));

  // ── Beat 5: retry loop — two failures, then a success, holds to the end ──
  const try1Pop = Math.min(1, pop(862));
  const try2Pop = Math.min(1, pop(884));
  const try3Pop = Math.min(1, pop(906));
  const heroPop = Math.min(1, pop(930));
  const checkPop = Math.min(1, pop(954));

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ THE LEDGER — alive for the whole clip ════ */}
        <div
          style={{
            position: "absolute",
            left: TAPE_X,
            top: TAPE_Y,
            width: TAPE_W,
            height: TAPE_H,
            borderRadius: 18,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: "0 16px 40px rgba(40,30,16,0.16)",
            opacity: Math.min(1, cardPop),
            transform: `scale(${0.94 + Math.min(1, cardPop) * 0.06})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ position: "absolute", left: PAD, top: 24, fontSize: 13.5, fontWeight: 700, letterSpacing: 1.6, color: P.muted }}>
            {"\u{1F9FE}"} SOCIAL POST CHECKLIST
          </div>
        </div>
        <Dash y={TAPE_Y + 56} />

        <LedgerRow y={TAPE_Y + 76} label="LinkedIn — link in body" value="BLOCKS REACH" tone="danger" opacity={row1OldOp} strike={row1Strike} />
        <LedgerRow y={TAPE_Y + 76} label="LinkedIn — link in comment" value="CLEAN POST" tone="success" opacity={row1NewOp} />

        <LedgerRow y={TAPE_Y + 116} label="Facebook — element order" value="RANDOM EACH TIME" tone="amber" opacity={row2OldOp} strike={row2Strike} />
        <LedgerRow y={TAPE_Y + 116} label="Facebook — element order" value="ONE FIXED ORDER" tone="success" opacity={row2NewOp} />

        <LedgerRow y={TAPE_Y + 156} label="Comment delivery" value="RETRIES UP TO 3x" tone="success" opacity={row3Op} />

        <Dash y={TAPE_Y + 198} />

        <div style={{ position: "absolute", left: TAPE_X + PAD, top: TAPE_Y + 214, fontSize: 12.5, fontWeight: 700, letterSpacing: 1.6, color: P.muted }}>
          ISSUES REMAINING
        </div>
        <div style={{ position: "absolute", left: TAPE_X + PAD, top: TAPE_Y + 236, width: TAPE_W - PAD * 2 }}>
          <span style={{ position: "relative", fontSize: 40, fontWeight: 800, color: P.danger, opacity: t2Op, fontFamily }}>
            2
            {t1Strike > 0.004 ? (
              <span style={{ position: "absolute", left: 0, top: "50%", height: 3, width: `${Math.min(1, t1Strike) * 100}%`, background: P.ink }} />
            ) : null}
          </span>
          <span style={{ position: "absolute", left: 0, top: 0, fontSize: 40, fontWeight: 800, color: P.amber, opacity: t1Op, fontFamily }}>
            1
            {t1Strike2 > 0.004 ? (
              <span style={{ position: "absolute", left: 0, top: "50%", height: 3, width: `${Math.min(1, t1Strike2) * 100}%`, background: P.ink }} />
            ) : null}
          </span>
          <span style={{ position: "absolute", left: 0, top: 0, fontSize: 40, fontWeight: 800, color: P.success, opacity: t0Op, fontFamily }}>0</span>
        </div>

        {/* ════ STAGE — beat 1: LinkedIn post, raw link in the body ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y, width: STAGE_W, opacity: b1 }}>
          <BrowserWindow x={0} y={0} w={STAGE_W} h={STAGE.h} title="LinkedIn — new post" opacity={Math.min(1, pop(15))}>
            <div style={{ padding: "26px 28px", fontFamily }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: P.accentBg, border: `1.5px solid ${P.accentEdge}` }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: P.ink }}>Vitalii Berbeha</div>
                  <div style={{ fontSize: 12.5, color: P.muted }}>2h · portfolio & AI systems</div>
                </div>
              </div>
              <div style={{ fontSize: 15.5, lineHeight: 1.5, color: P.ink }}>
                A small AI startup just closed a seed round to automate customer support triage.{" "}
                <span style={{ color: P.danger, fontWeight: 700, textDecoration: "underline", opacity: linkPop }}>
                  vitalii.no/news/ai-startup-seed-support-triage-2026
                </span>
              </div>
              <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 10, opacity: linkPop }}>
                <div style={{ fontSize: 22 }}>{"\u{1F4C9}"}</div>
                <div style={{ fontSize: 13.5, fontWeight: 650, color: P.danger }}>reach quietly throttled — link sits inside the text</div>
              </div>
            </div>
          </BrowserWindow>
        </div>
        <StatPill x={STAGE_X + 190} y={STAGE.y + STAGE.h + 26} emoji={"\u{1F517}"} text="raw link in the post body" tone="danger" opacity={b1} />

        {/* ════ STAGE — beat 2: Facebook, two posts, two different orders ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y, width: STAGE_W, opacity: b2, transform: `translateX(${facebookX}px)` }}>
          <BrowserWindow x={0} y={0} w={STAGE_W} h={STAGE.h} title="Facebook — recent posts" opacity={Math.min(1, pop(241))}>
            <div style={{ padding: "24px 28px", fontFamily }}>
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 12,
                  background: P.noteBg,
                  border: `1.5px solid ${P.noteBorder}`,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: P.ink,
                  opacity: postAPop,
                  transform: `translateY(${(1 - postAPop) * 12}px)`,
                }}
              >
                <span style={{ color: P.amber, fontWeight: 800 }}>#AI #Startups</span> · vitalii.no ·{" "}
                <span style={{ color: P.amber, fontWeight: 800 }}>vitalii.no/news/ai-startup-seed-2026</span>
              </div>
              <div
                style={{
                  marginTop: 18,
                  padding: "14px 18px",
                  borderRadius: 12,
                  background: P.noteBg,
                  border: `1.5px solid ${P.noteBorder}`,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: P.ink,
                  opacity: postBPop,
                  transform: `translateY(${(1 - postBPop) * 12}px)`,
                }}
              >
                <span style={{ color: P.amber, fontWeight: 800 }}>vitalii.no/news/norway-battery-plant</span> · Source: vitalii.no ·{" "}
                <span style={{ color: P.amber, fontWeight: 800 }}>#Energy</span>
              </div>
            </div>
          </BrowserWindow>
        </div>
        <StatPill
          x={STAGE_X + 130}
          y={STAGE.y + STAGE.h + 26}
          emoji={"\u{1F500}"}
          text="link, hashtags, source — different order every time"
          tone="danger"
          opacity={b2}
        />

        {/* ════ STAGE — beat 3: LIVE commit history, the fix landing ════ */}
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${commitsX}px)` }}>
          <LiveWindow
            file={shots}
            shot="commits"
            title="github.com — vitalii-no-platform — commits"
            from={430}
            hold={243}
            zoom={(t) => 1 + 0.12 * t}
            focus={{ x: 0.5, y: 0.3 }}
            opacity={b3}
            win={STAGE}
          />
        </div>
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y - 62, display: "flex", alignItems: "center", gap: 10, opacity: b3 }}>
          <div style={{ fontSize: 30 }}>{"\u{26A1}"}</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: P.accent }}>the link never touches the post body anymore</div>
        </div>
        <div style={{ position: "absolute", left: STAGE_X, top: 626, width: STAGE_W, textAlign: "center", fontSize: 15, fontWeight: 600, color: P.muted, opacity: techCapOp, fontFamily }}>
          a Supabase Edge Function publishes the post, then drops the link into the first comment
        </div>

        {/* ════ STAGE — beat 4: LIVE Actions runs, the fixed order shipping ════ */}
        <div style={{ position: "absolute", inset: 0, opacity: b4 }}>
          <LiveWindow
            file={shots}
            shot="actions"
            title="github.com — vitalii-no-platform — Actions"
            from={666}
            hold={192}
            zoom={(t) => 1 + 0.1 * t}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b4}
            win={STAGE}
          />
        </div>
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y - 62, display: "flex", alignItems: "center", gap: 10, opacity: b4 }}>
          <div style={{ fontSize: 30 }}>{"\u{2705}"}</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: P.success }}>same fixed order, every single post</div>
        </div>
        <div style={{ position: "absolute", left: STAGE_X, top: 626, width: STAGE_W, textAlign: "center", fontSize: 15, fontWeight: 600, color: P.muted, opacity: fixedCapOp, fontFamily }}>
          plain source domain shown instead of the raw link
        </div>

        {/* ════ STAGE — beat 5: retry loop, drawn, holds to the end ════ */}
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y, width: STAGE_W, opacity: b5 }}>
          <BrowserWindow x={0} y={0} w={STAGE_W} h={STAGE.h} title="comment delivery — retry loop" opacity={Math.min(1, pop(851))}>
            <div style={{ padding: "40px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: 26, fontFamily }}>
              <div style={{ textAlign: "center", opacity: try1Pop, transform: `scale(${0.9 + try1Pop * 0.1})` }}>
                <div style={{ width: 84, height: 84, borderRadius: 16, background: P.dangerBg, border: `3px solid ${P.dangerEdge}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                  {"\u{274C}"}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: P.danger, marginTop: 10 }}>try 1 fails</div>
              </div>
              <div style={{ fontSize: 26, color: P.muted, opacity: try2Pop }}>{"→"}</div>
              <div style={{ textAlign: "center", opacity: try2Pop, transform: `scale(${0.9 + try2Pop * 0.1})` }}>
                <div style={{ width: 84, height: 84, borderRadius: 16, background: P.dangerBg, border: `3px solid ${P.dangerEdge}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                  {"\u{274C}"}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: P.danger, marginTop: 10 }}>try 2 fails</div>
              </div>
              <div style={{ fontSize: 26, color: P.muted, opacity: try3Pop }}>{"→"}</div>
              <div style={{ textAlign: "center", opacity: try3Pop, transform: `scale(${0.9 + try3Pop * 0.1})` }}>
                <div style={{ width: 84, height: 84, borderRadius: 16, background: P.successBg, border: `3px solid ${P.successEdge}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                  {"\u{2705}"}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: P.success, marginTop: 10 }}>try 3 lands</div>
              </div>
            </div>
          </BrowserWindow>
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
            transform: `scale(${0.92 + heroPop * 0.08})`,
          }}
        >
          <div style={{ fontSize: 56, fontWeight: 800, color: P.success, letterSpacing: -1.5 }}>x3</div>
          <div style={{ fontSize: 18, fontWeight: 650, color: P.muted }}>retries before it gives up</div>
        </div>
        <div style={{ position: "absolute", left: STAGE_X, top: STAGE.y + STAGE.h + 20, display: "flex", alignItems: "center", gap: 14, opacity: b5 }}>
          <div style={{ position: "relative", width: 36, height: 36 }}>
            <CheckBadge x={0} y={0} size={36} scale={checkPop} opacity={Math.min(1, checkPop)} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: P.ink, opacity: Math.min(1, checkPop) }}>the first comment always lands eventually</div>
        </div>
      </div>
    </PaletteProvider>
  );
};
