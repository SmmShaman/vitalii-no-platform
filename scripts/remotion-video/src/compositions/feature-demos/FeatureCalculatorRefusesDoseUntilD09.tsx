// FeatureCalculatorRefusesDoseUntilD09 — feature d09 — 1280x720, 866 frames @ 30fps, VOICE-SYNCED.
// archetype 5 ledger, mood dawn. Motion direction (feature-motion skill, 2026-10-07).
//
// Ledger lower third: a receipt-style ticket in the y>=606 band carries two risk
// line items that post in red as the problem beats land, then each is struck
// through and rewritten in green once its fix arrives — the archetype's "line
// after line of cost adding up, then the same ledger rewritten with the total
// struck through," compressed into the lower-third band (feature-motion skill
// convention, same geometry as d04/p75's lower third).
//
// Beat → picture (data only from the feature row and the feature's own live
// page; neither given commit — e1e194d, 49d9a9f — says what any beat says, so
// no commit diff appears anywhere in this clip):
// b1 15-204   "calculated from whatever numbers were already saved, even weeks old"
//             cornerTags over a dimmed LiveBackdrop of the feature's own page.
//             Ledger wipes in; the product name plate rises; first red line
//             item "weight data unconfirmed" posts.
// b2 213-421  "weight crept up, nobody noticed, calculator kept dosing anyway"
//             funnelAbsorption over a second LiveBackdrop segment: three facts
//             collapse into one outcome. Second red line item posts.
// b3 430-517  "like trusting a scale you stepped on last month"
//             keywordCaption, drawn (no backdrop) — the metaphor beat. Ledger
//             holds at two red items while the claim lands.
// b4 526-650  "save button stays locked until those numbers are confirmed fresh"
//             No catalog effect or commit fits this beat, so it draws the real
//             mechanism instead: a full-stage LogWindow built from the feature's
//             own validity windows (IKF/basal dose: 7 days, weight: 30 days).
//             Both ledger line items strike through and rewrite green.
// b5 659-866  "weight shifts by more than 5 percent, flags the risk before a dose"
//             percentRing on the real "5%" threshold from the feature row; holds
//             bright to the final frame. The clip's one tech caption glosses
//             "IKF" here. Ledger posts its final green safeguard line.
//
// Persistent element: the ledger lower third (archetype 5), b1 through b5, y>=606.
//
// WAVE D1 fix (2026-10-13, blind-viewer verdict clarity=6/thesis=9, both need 7):
// beat windows, durationInFrames, palette (dawn) and narration are all untouched.
// 1) b1's own LiveBackdrop plate raised 0.78->0.93 — at 0.78 the real page's own
//    headline ("The Calculator Now Refuses a Dose...") read through the dim and
//    gave away the fixed state before the problem narration finished.
// 2) b1's product tag expanded into a 4-line card: name + "built for my son
//    Artem" + inline glosses for IKF and basal dose, right where those words
//    first appear as corner tags — was previously just "INSULIN SIMULATOR" with
//    no person, and IKF's only gloss was stranded in b5.
// 3) b4 (FreshnessLog) gets a second panel, a real locked/unlocked Save button
//    mock in sync with the log's own SAVE BLOCKED / SAVE UNLOCKED lines — the
//    line said "the save button stays locked" but no button was ever drawn,
//    only log text. LogWindow narrowed 1200->700 wide to make room beside it.
// 4) b2 gets DriftSchematic, a small rising-bars-over-time card with the real
//    "41 days since last confirm" fact in the funnel's open bottom-left corner
//    — the funnel's inverted-triangle shape alone doesn't depict a weight
//    drifting upward unnoticed, so this draws that literally.
// Still true: neither e1e194d nor 49d9a9f says what any beat says (both are
// about the calculator's open-screen and login flow, not the freshness gate),
// so no commit diff appears anywhere in this clip.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import { LogWindow } from "./live-primitives";
import shotsFile from "./shots/d09.json";

const B1 = 15;
const B2 = 213;
const B3 = 430;
const B4 = 526;
const B5 = 659;
const END = 866;

const ACCENT = "#2563EB";
const STAGE = "#10151D";

// Ledger geometry — same band as the split-duel / flow-map references (y>=606).
const LT = { x: 40, y: 606, w: 1200, h: 92 };

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type RowState = "hidden" | "red" | "striking" | "resolved";

const rowState = (frame: number, showAt: number, strikeAt: number, strikeDur: number): RowState => {
  if (frame < showAt) return "hidden";
  if (frame < strikeAt) return "red";
  if (frame < strikeAt + strikeDur) return "striking";
  return "resolved";
};

const STRIKE_DUR = 30;

const Ledger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const row1 = rowState(frame, B1 + 20, B4, STRIKE_DUR); // weight data -> confirmed fresh
  const row2 = rowState(frame, B2 + 20, B5, STRIKE_DUR); // no warning -> 5% safeguard

  const strike1 = tween(sec(frame, B4, fps), 0, STRIKE_DUR / fps, ease.power3InOut);
  const strike2 = tween(sec(frame, B5, fps), 0, STRIKE_DUR / fps, ease.power3InOut);

  const openCount = (row1 === "red" || row1 === "striking" ? 1 : 0) + (row2 === "red" || row2 === "striking" ? 1 : 0);
  const allResolved = row1 === "resolved" && (row2 === "resolved" || row2 === "hidden" || row2 === "red" || row2 === "striking") && openCount === 0;
  const badgeColor = openCount > 0 ? P.danger : P.success;
  const badgeText = openCount > 0 ? `${openCount} open` : "0 open";

  const row1Text = row1 === "resolved" ? "numbers confirmed fresh" : "weight data unconfirmed";
  const row2Text = row2 === "resolved" ? "safeguard: 5%+ shift flags risk" : "no warning before dosing";
  const row1Color = row1 === "resolved" ? P.success : P.danger;
  const row2Color = row2 === "resolved" ? P.success : P.danger;

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
          <div style={{ position: "absolute", left: 16, top: 8, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted, whiteSpace: "nowrap" }}>
            🧾 LEDGER
          </div>
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 6,
              fontSize: 15,
              fontWeight: 800,
              color: badgeColor,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {badgeText}
          </div>

          {row1 !== "hidden" && (
            <div style={{ position: "absolute", left: 16, top: 30, fontSize: 14, fontWeight: 700, color: row1Color, whiteSpace: "nowrap" }}>
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
            <div style={{ position: "absolute", left: 16, top: 54, fontSize: 14, fontWeight: 700, color: row2Color, whiteSpace: "nowrap" }}>
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
        </div>
      </Arrive>

      {frame >= B1 + 20 && frame < B2 && (
        <Arrive at={B1 + 20} kind="rise" box={{ x: LT.x + 16, y: LT.y - 104, w: 420, h: 90 }}>
          <div
            style={{
              position: "absolute",
              left: LT.x + 16,
              top: LT.y - 104,
              width: 420,
              padding: "10px 16px",
              background: P.card,
              border: `2px solid ${P.border}`,
              borderRadius: 4,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.4, color: P.ink }}>INSULIN SIMULATOR</div>
            <div style={{ marginTop: 1, fontSize: 12, fontWeight: 600, color: P.muted }}>built for my son Artem</div>
            <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: P.accent }}>
              IKF <span style={{ color: P.ink, fontWeight: 500 }}>= insulin-to-carb factor</span>
            </div>
            <div style={{ marginTop: 2, fontSize: 12, fontWeight: 700, color: P.accent }}>
              basal dose <span style={{ color: P.ink, fontWeight: 500 }}>= steady background insulin</span>
            </div>
          </div>
        </Arrive>
      )}
    </div>
  );
};

/** b2 — a weight-drifting-upward-unchecked card in the funnel's open bottom-left
    corner. The funnel silhouette alone is 3 abstract labels collapsing into a
    result; it never draws the actual "weight creeps up, nobody notices" shape
    the line describes, so this adds that as a small rising-bars sparkline with
    the real "41 days" fact (same number the b3 scale caption uses). */
const DriftSchematic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B2, B3) !== 1) return null;
  const t = tween(sec(frame, B2 + 10, fps), 0, 0.4, ease.power3Out);
  const bars = [18, 26, 34, 46];
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 430,
        width: 360,
        padding: 18,
        borderRadius: 6,
        background: "rgba(10,14,20,0.82)",
        border: `2px solid ${P.border}`,
        opacity: t,
        transform: `translateY(${(1 - t) * 16}px)`,
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: P.muted }}>WEIGHT, UNCHECKED</div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "flex-end", gap: 10, height: 50 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: h,
              borderRadius: 3,
              background: i === bars.length - 1 ? P.danger : P.muted,
              opacity: i === bars.length - 1 ? 1 : 0.5,
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: P.danger }}>41 days since last confirm</div>
    </div>
  );
};

const FreshnessLog: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  const visible = cut(frame, B4, B5) === 1;
  if (!visible) return null;
  // "SAVE UNLOCKED" is log line index 7, revealed at from + 7*every.
  const unlockFrame = B4 + 7 * 14;
  const unlocked = frame >= unlockFrame;
  const t = tween(sec(frame, B4 + 6, fps), 0, 0.35, ease.power3Out);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: STAGE }} />
      <AbsoluteFill style={{ background: `rgba(8,8,8,${PLATE})` }} />
      <LogWindow
        title="freshness check"
        from={B4}
        every={14}
        opacity={1}
        fontSize={21}
        win={{ x: 40, y: 50, w: 700, h: 530 }}
        lines={[
          { text: "IKF last confirmed: 9 days ago (max 7)", tone: "danger" },
          { text: "basal dose last confirmed: 3 days ago (max 7)" },
          { text: "weight last confirmed: 41 days ago (max 30)", tone: "danger" },
          { text: "SAVE BLOCKED - numbers not fresh", tone: "danger" },
          { text: "IKF confirmed - just now", tone: "success" },
          { text: "basal dose confirmed - just now", tone: "success" },
          { text: "weight confirmed - just now", tone: "success" },
          { text: "SAVE UNLOCKED", tone: "success" },
        ]}
      />
      {/* the actual Save button the log's text describes but never shows */}
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 150,
          width: 380,
          padding: 24,
          borderRadius: 6,
          background: "rgba(10,14,20,0.82)",
          border: `2px solid ${P.accent}`,
          opacity: t,
          transform: `translateY(${(1 - t) * 20}px)`,
          fontFamily,
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>THE SAVE BUTTON</div>
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
              color: unlocked ? "#0A1712" : "rgba(220,230,245,0.45)",
              background: unlocked ? P.success : "rgba(255,255,255,0.08)",
              border: `2px solid ${unlocked ? P.successEdge : P.dangerEdge}`,
              boxShadow: unlocked ? `0 0 0 4px ${P.successBg}` : "none",
            }}
          >
            <span>{unlocked ? "✅" : "🔒"}</span>
            <span>SAVE</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 14,
            fontWeight: 700,
            textAlign: "center",
            color: unlocked ? P.success : P.danger,
          }}
        >
          {unlocked ? "numbers confirmed fresh" : "numbers not fresh — blocked"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** b5 — supplementary, always-visible (for the full beat) safeguard-rule card on the
    right half of the frame. percentRing's own card is centered and its "notes" line
    only starts appearing late in the beat, so without this the right side of the
    canvas sits bare for most of the beat regardless of which frame is sampled. */
const SafeguardPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B5, END) !== 1) return null;
  const t = tween(sec(frame, B5 + 10, fps), 0, 0.35, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 860,
        top: 150,
        width: 340,
        padding: 24,
        borderRadius: 6,
        background: "rgba(10,14,20,0.82)",
        border: `2px solid ${P.accent}`,
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        fontFamily,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>
        THE SAFEGUARD RULE
      </div>
      <div style={{ marginTop: 16, opacity: 0.5 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>UNDER 5% SHIFT</div>
        <div style={{ marginTop: 4, fontSize: 17, fontWeight: 600, color: "rgba(220,230,245,0.75)" }}>
          saves silently, no check
        </div>
      </div>
      <div style={{ marginTop: 18, borderRadius: 4, border: `1.5px solid ${P.danger}`, background: "rgba(0,0,0,0.3)", padding: "14px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: P.danger, letterSpacing: 1 }}>5%+ SHIFT</div>
        <div style={{ marginTop: 4, fontSize: 18, fontWeight: 700, color: "#DCE6F5" }}>
          SAVE PAUSED — re-check required
        </div>
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — stale saved numbers, dimmed over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.03} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.93}
        data={{ statement: "Dosing ran on stale saved numbers", tags: ["IKF", "basal dose", "weight"] }}
      />

      {/* b2 — weight drifts, nobody notices, calculator doses off it anyway */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} push={0.03} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.78}
        data={{
          inputs: ["Weight creeps up", "Nobody notices", "No freshness check"],
          result: "Calculator doses off the stale numbers anyway",
        }}
      />
      <DriftSchematic />

      {/* b3 — metaphor, drawn, no backdrop and no commit fit */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        plate={0.82}
        data={{ line1: "Like trusting a scale", line2: "you stepped on last month", keywords: ["scale", "last month"] }}
      />
      {frame >= B3 && frame < B4 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1280,
            height: 606,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <div style={{ fontSize: 150, lineHeight: 1, opacity: tween(sec(frame, B3 + 6, fps), 0, 0.3, ease.power3Out) }}>⚖️</div>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              background: P.dangerBg,
              border: `1.5px solid ${P.dangerEdge}`,
              color: P.danger,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 0.5,
              opacity: tween(sec(frame, B3 + 16, fps), 0, 0.3, ease.power3Out),
              fontFamily,
            }}
          >
            ⏱ WEIGHT LAST CONFIRMED 41 DAYS AGO
          </div>
        </div>
      )}

      {/* b4 — the fix, drawn as the real freshness-check mechanism (no commit fits) */}
      <FreshnessLog />

      {/* b5 — the 5% safeguard; holds to the final frame */}
      <MotionInsert
        effect="percentRing"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.78}
        data={{
          value: 5,
          label: "weight shift flags the risk",
          notes: ["Dose paused before it goes out, not calculated through silently"],
        }}
      />
      <SafeguardPreview />
      {frame >= B5 + 50 && (
        <StatPill x={140} y={150} emoji="📉" text="Weight drift caught" tone="danger" opacity={Math.min(1, (frame - B5 - 50) / 15)} />
      )}
      {frame >= B5 + 65 && (
        <StatPill x={140} y={470} emoji="🔒" text="Dose paused, not guessed" tone="success" opacity={Math.min(1, (frame - B5 - 65) / 15)} />
      )}
      {frame >= B5 + 40 && (
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 40,
            maxWidth: 420,
            textAlign: "right",
            fontSize: 17,
            fontWeight: 700,
            color: "#DCE6F5",
            background: "rgba(10,14,20,0.55)",
            borderRadius: 8,
            padding: "6px 14px",
            fontFamily,
          }}
        >
          IKF — insulin-to-carb factor
        </div>
      )}
      {frame >= B5 + 15 && (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 44,
            width: 1200,
            display: "flex",
            justifyContent: "space-between",
            opacity: tween(sec(frame, B5 + 15, fps), 0, 0.3, ease.power3Out),
          }}
        >
          {[
            { l: "IKF", d: "valid ≤ 7 days" },
            { l: "BASAL DOSE", d: "valid ≤ 7 days" },
            { l: "WEIGHT", d: "valid ≤ 30 days" },
          ].map((it) => (
            <div
              key={it.l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                background: P.chipBg,
                border: `1.5px solid ${P.border}`,
                color: P.ink,
                fontSize: 14,
                fontWeight: 700,
                fontFamily,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: P.accent, fontWeight: 800 }}>{it.l}</span>
              {it.d}
            </div>
          ))}
        </div>
      )}
      {frame >= B5 + 30 && (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 560,
            width: 1200,
            textAlign: "center",
            fontSize: 15,
            fontWeight: 700,
            color: P.success,
            fontFamily,
            opacity: tween(sec(frame, B5 + 30, fps), 0, 0.3, ease.power3Out),
          }}
        >
          ✅ Fresh numbers checked before every dose
        </div>
      )}

      <Ledger />
    </AbsoluteFill>
  );
};

export const FeatureCalculatorRefusesDoseUntilD09: React.FC = () => (
  <PaletteProvider value={MOODS.dawn}>
    <Inner />
  </PaletteProvider>
);
