/**
 * FeatureLinkedinPostingsGetGradedJ74 — feature j74 — 1280x720, 1159 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 5 "ledger", mood "mint". A receipt-style scoring ledger occupies
 * the right ~30% of the frame for the whole clip and never disappears — only
 * its rows and total cross-fade per beat, ending with the total struck
 * through in red and rewritten in green. The left ~60% is the stage: real
 * recordings of vitalii.no/features and the jobbot-norway repo for beats
 * 1, 3, 4, 5 (shots/j74.json); beat 2 is a drawn side-by-side comparison
 * (metaphor/example, no UI to record).
 *
 * Voice-synced beat table (do not shift):
 *  b1   15–291  "My AI screened every LinkedIn posting with one generic prompt — and let scores above 70 slip past missing degrees and experience gaps."
 *  b2  300–563  "A junior role needing a degree, a manager role needing a master's — both scored high anyway; the language check only caught exact phrases."
 *  b3  572–787  "So a Groq model now reports language, paid years, and education as structured facts, not a soft opinion."
 *  b4  796–992  "Code then applies hard caps from those facts — missing degree, wrong language, years that don't add up."
 *  b5 1001–1114 "Postings that used to score seventy or higher now score zero." — holds to 1159.
 *
 * Single tech name in the whole clip: Groq (beat 3 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, Panel, StatPill, FilterChip, CheckBadge, CaptionBand, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/j74.json";

const P = MOODS.mint;

const WIN: Win = { x: 40, y: 100, w: 780, h: 452 };

const LED_X = 850;
const LED_Y = 60;
const LED_W = 380;
const LED_H = 560;

const dashed = (x: number, y: number, w: number) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 1,
      background: `repeating-linear-gradient(to right, ${P.border} 0 6px, transparent 6px 12px)`,
    }}
  />
);

const ledgerRow = (
  y: number,
  role: string,
  sub: string,
  right: React.ReactNode,
  opacity: number,
  note?: string,
  noteOpacity?: number,
  noteColor?: string
) => (
  <div style={{ position: "absolute", left: LED_X + 24, top: y, width: LED_W - 48, opacity, fontFamily }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: P.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {role} <span style={{ color: P.muted, fontWeight: 500 }}>— {sub}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, whiteSpace: "nowrap", flexShrink: 0 }}>{right}</div>
    </div>
    {note ? (
      <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: noteColor ?? P.danger, opacity: noteOpacity ?? 1 }}>
        {note}
      </div>
    ) : null}
  </div>
);

const factRow = (y: number, role: string, field: string, opacity: number) => (
  <div style={{ position: "absolute", left: LED_X + 24, top: y, width: LED_W - 48, opacity, fontFamily }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: P.ink }}>{role}</div>
    <div style={{ marginTop: 3, fontSize: 13.5, fontWeight: 650, color: P.accent }}>{field}</div>
  </div>
);

export const FeatureLinkedinPostingsGetGradedJ74: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 23) * (1 - seg(frame, 291, 299));
  const b2 = seg(frame, 300, 308) * (1 - seg(frame, 563, 571));
  const b3 = seg(frame, 572, 580) * (1 - seg(frame, 787, 795));
  const b4 = seg(frame, 796, 804) * (1 - seg(frame, 992, 1000));
  const b5 = seg(frame, 1001, 1009); // holds through 1159

  const dy2 = interpolate(frame, [300, 332], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const dy5 = interpolate(frame, [1001, 1033], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const chipPop = pop(612);
  const badgePop = pop(1030);

  // rows 1 & 4 never get a gate applied — visible whenever the normal (non-fact) row layout is on screen
  const rowsNormalOpacity = Math.max(b1, b2, b4, b5);

  // header subtitle phases
  const subA = Math.max(b1, b2);
  const subB = b3;
  const subC = Math.max(b4, b5);

  // total line: unresolved during b1/b2/b3/b4, struck-through + green once b5 starts
  const totalBefore = Math.max(b1, b2, b3, b4);
  const totalAfter = b5;

  const headline = (text: string) => (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 34,
        width: 780,
        fontSize: 28,
        fontWeight: 800,
        lineHeight: 1.25,
        color: P.ink,
        fontFamily,
      }}
    >
      {text}
    </div>
  );

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- persistent ledger shell (never disappears) ---------------- */}
        <Panel x={LED_X} y={LED_Y} w={LED_W} h={LED_H} tone="card" opacity={1} radius={18} />
        <div style={{ position: "absolute", left: LED_X + 24, top: LED_Y + 22, fontSize: 12.5, fontWeight: 800, letterSpacing: 2.4, color: P.muted }}>
          SCORING LEDGER
        </div>
        <div style={{ position: "absolute", left: LED_X + 24, top: LED_Y + 46, width: LED_W - 48, height: 24 }}>
          <div style={{ position: "absolute", left: 0, top: 0, fontSize: 15.5, fontWeight: 750, color: P.danger, opacity: subA }}>
            One generic prompt for every posting
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, fontSize: 15.5, fontWeight: 750, color: P.accent, opacity: subB }}>
            Structured facts extracted
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, fontSize: 15.5, fontWeight: 750, color: P.success, opacity: subC }}>
            Deterministic caps applied in code
          </div>
        </div>
        {dashed(LED_X + 24, LED_Y + 92, LED_W - 48)}

        {/* normal rows (b1 / b2 / b4 / b5) — role identity persists across those beats */}
        {ledgerRow(LED_Y + 112, "Backend Engineer", "Oslo", <span style={{ color: P.success }}>84 ✓</span>, rowsNormalOpacity)}

        {/* row: Junior Developer — three content phases at the same slot */}
        {ledgerRow(
          LED_Y + 174,
          "Junior Developer",
          "Trondheim",
          <span style={{ color: P.ink }}>82 ✓</span>,
          Math.max(b1, b2),
          "⚠ CS degree not met",
          b2
        )}
        {ledgerRow(LED_Y + 174, "Junior Developer", "Trondheim", <span style={{ color: P.amber }}>82 ⬇</span>, b4, "capping…", b4, P.amber)}
        {ledgerRow(
          LED_Y + 174,
          "Junior Developer",
          "Trondheim",
          <>
            <span style={{ textDecoration: "line-through", color: P.danger, marginRight: 8 }}>82</span>
            <span style={{ color: P.success }}>0</span>
          </>,
          b5,
          "✓ capped — degree not met",
          b5,
          P.success
        )}

        {/* row: Program Manager — three content phases at the same slot */}
        {ledgerRow(
          LED_Y + 236,
          "Program Manager",
          "Stavanger",
          <span style={{ color: P.ink }}>91 ✓</span>,
          Math.max(b1, b2),
          "⚠ master's + years not met",
          b2
        )}
        {ledgerRow(LED_Y + 236, "Program Manager", "Stavanger", <span style={{ color: P.amber }}>91 ⬇</span>, b4, "capping…", b4, P.amber)}
        {ledgerRow(
          LED_Y + 236,
          "Program Manager",
          "Stavanger",
          <>
            <span style={{ textDecoration: "line-through", color: P.danger, marginRight: 8 }}>91</span>
            <span style={{ color: P.success }}>0</span>
          </>,
          b5,
          "✓ capped — master's + years",
          b5,
          P.success
        )}

        {ledgerRow(LED_Y + 298, "Data Analyst", "Bergen", <span style={{ color: P.success }}>77 ✓</span>, rowsNormalOpacity)}

        {/* fact-mode rows (b3 only) */}
        {factRow(LED_Y + 112, "Junior Developer — Trondheim", "education: Bachelor required → NOT MET", b3)}
        {factRow(LED_Y + 186, "Program Manager — Stavanger", "years: 5 required → 2 evidenced", b3)}
        {factRow(LED_Y + 260, "Sales Consultant — Bergen", "language: fluent Norwegian required → not stated", b3)}

        {dashed(LED_X + 24, LED_Y + 430, LED_W - 48)}

        {/* total line */}
        <div style={{ position: "absolute", left: LED_X + 24, top: LED_Y + 450, width: LED_W - 48 }}>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: totalBefore }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>SCORED 70+ THIS MONTH</div>
            <div style={{ marginTop: 4, fontSize: 34, fontWeight: 800, color: P.danger }}>11</div>
          </div>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: totalAfter }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted }}>WRONGLY APPROVED — NOW CAUGHT</div>
            <div style={{ marginTop: 4, fontSize: 34, fontWeight: 800 }}>
              <span style={{ textDecoration: "line-through", color: P.danger, marginRight: 12 }}>11</span>
              <span style={{ color: P.success }}>0</span>
            </div>
          </div>
        </div>
        {dashed(LED_X + 24, LED_Y + LED_H - 26, LED_W - 48)}

        {/* ---------------- beat 1 : the real hub, a generic score for everything ---------------- */}
        <Group opacity={b1}>
          {headline("Every posting got the same generic score")}
        </Group>
        <LiveWindow
          file={shots}
          shot="hub"
          title="vitalii.no/features — 250 shipped"
          from={15}
          hold={292}
          zoom={(t) => 1 + 0.14 * t}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b1}
          win={WIN}
        />
        <CaptionBand
          y={646}
          fontSize={21}
          text="One of 250 shipped features: an AI pipeline that screens every LinkedIn posting"
          tone="danger"
          opacity={b1}
        />

        {/* ---------------- beat 2 : drawn comparison, the brittle language gate ---------------- */}
        <Group opacity={b2} dy={dy2}>
          {headline("A junior role needing a degree. A manager needing a master's.")}
          <Panel x={45} y={104} w={360} h={420} tone="card">
            <div style={{ position: "absolute", left: 20, top: 20, width: 320, fontSize: 19, fontWeight: 800, color: P.ink }}>
              Junior Developer — Trondheim
            </div>
            <div style={{ position: "absolute", left: 20, top: 56, fontSize: 15, fontWeight: 600, color: P.muted }}>
              Requires: Bachelor's in CS 🎓
            </div>
            <StatPill x={20} y={94} emoji="✕" text="degree not met" tone="danger" fontSize={15} />
            <div style={{ position: "absolute", left: 20, top: 168, fontSize: 30, fontWeight: 800, color: P.ink }}>
              Auto-score: 82
            </div>
            <div style={{ position: "absolute", left: 20, top: 206, fontSize: 14, fontWeight: 700, color: P.danger }}>
              ≥ 70 → auto-approved
            </div>
          </Panel>
          <Panel x={435} y={104} w={360} h={420} tone="card">
            <div style={{ position: "absolute", left: 20, top: 20, width: 320, fontSize: 19, fontWeight: 800, color: P.ink }}>
              Program Manager — Stavanger
            </div>
            <div style={{ position: "absolute", left: 20, top: 56, fontSize: 15, fontWeight: 600, color: P.muted }}>
              Requires: Master's + 5y consulting 🎓
            </div>
            <StatPill x={20} y={94} emoji="✕" text="master's & years not met" tone="danger" fontSize={15} />
            <div style={{ position: "absolute", left: 20, top: 168, fontSize: 30, fontWeight: 800, color: P.ink }}>
              Auto-score: 91
            </div>
            <div style={{ position: "absolute", left: 20, top: 206, fontSize: 14, fontWeight: 700, color: P.danger }}>
              ≥ 70 → auto-approved
            </div>
          </Panel>
        </Group>
        <Group opacity={b2}>
          <CaptionBand
            y={646}
            fontSize={20}
            text="The language check only caught exact phrases like 'fluent Norwegian' — not paraphrases"
            tone="danger"
            opacity={b2}
          />
        </Group>

        {/* ---------------- beat 3 : the real commit history, structured facts instead of a verdict ---------------- */}
        <Group opacity={b3}>
          {headline("So a Groq model reports facts, not a verdict")}
        </Group>
        <LiveWindow
          file={shots}
          shot="commits"
          title="github.com/SmmShaman/jobbot-norway — commits · main"
          from={572}
          hold={231}
          zoom={(t) => 1.08 + 0.06 * t}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={b3}
          win={WIN}
        />
        <Group opacity={b3}>
          <FilterChip x={WIN.x + 20} y={WIN.y + 62} text="Groq · structured extraction" icon="⚙" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand
            y={646}
            fontSize={21}
            text="Language, paid years, and education — reported as structured facts, not a soft opinion"
            tone="accent"
            opacity={b3}
          />
        </Group>

        {/* ---------------- beat 4 : the real Action, gates applied in code ---------------- */}
        <Group opacity={b4}>
          {headline("Code applies hard caps from those facts")}
        </Group>
        <LiveWindow
          file={shots}
          shot="actions"
          title="github.com/SmmShaman/jobbot-norway — Actions"
          from={796}
          hold={212}
          zoom={(t) => 1 + 0.06 * t}
          focus={{ x: 0.3, y: 0.35 }}
          opacity={b4}
          win={WIN}
        />
        <Group opacity={b4}>
          <div
            style={{
              position: "absolute",
              left: WIN.x + 20,
              top: WIN.y + WIN.h - 96,
              display: "flex",
              gap: 10,
            }}
          >
            <FilterChip x={0} y={0} text="Language gate" icon="✓" color={P.amber} />
            <FilterChip x={190} y={0} text="Years gate" icon="✓" color={P.amber} />
            <FilterChip x={340} y={0} text="Education gate" icon="✓" color={P.amber} />
          </div>
          <CaptionBand
            y={646}
            fontSize={21}
            text="Missing degree, wrong language, years that don't add up — capped automatically"
            tone="accent"
            opacity={b4}
          />
        </Group>

        {/* ---------------- beat 5 : the feature's own page, the ledger closes clean ---------------- */}
        <Group opacity={b5} dy={dy5}>
          {headline("Postings that scored 70+ now score zero")}
          <CheckBadge x={WIN.x + WIN.w - 60} y={WIN.y - 20} size={40} opacity={b5} scale={badgePop} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-linkedin-postings-j74"
          from={1001}
          hold={158}
          zoom={(t) => 1 + 0.08 * t}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b5}
          win={WIN}
        />
        <Group opacity={b5}>
          <CaptionBand y={646} fontSize={21} text="70+ used to mean approved. Now it means capped and rejected." tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
