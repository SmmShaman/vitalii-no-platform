/**
 * FeatureEdgeFunctionsCost — feature p23 — 1280x720, 815 frames @30fps.
 * VOICE-SYNCED (owner rule, 2026-08-31) — the beat windows below are measured
 * from the real voiceover, not a designer's guess. Rebuild the audio and you
 * must rebuild these numbers with it.
 *
 * Art direction handed down by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md), NOT drawn locally:
 *   archetype 5 "ledger" — a single receipt/invoice card (x300 y36 680x648)
 *     owns the centre of the frame from the first frame to the last; it is
 *     the one element that survives every beat (its shell, header and
 *     footer never fade), while the itemized body inside it is rewritten
 *     beat by beat — idle-server line → office-rent analogy → 43 function
 *     rows tallying up → cold-start/redeploy line items → a final struck-
 *     through total collapsing to $0/month. The clip reads as one ledger
 *     being corrected, not five slides.
 *   mood "mint" — `<PaletteProvider value={MOODS.mint}>` wraps the whole tree.
 *
 * Beat windows (measured, fps 30):
 *   b1  15-213  "My site sits quiet almost all day, then spikes without
 *                warning — and I was paying for a server to just wait
 *                around."
 *   b2 222-338  "That's like renting a whole office for a meeting that
 *                happens twice a week."
 *   b3 347-544  "I replaced it with 43 small Edge Functions that only run,
 *                and only get billed, the instant they're needed."
 *   b4 553-687  "Each one wakes up in under half a second and redeploys in
 *                about ten."
 *   b5 696-770  "The bill: $0 a month."
 *   tail 770-815 — b5 HOLDS at full opacity, no fade to empty frame.
 *
 * Sync notes: no dollar figure is invented for the "before" state — the
 * problem beat visualises "always-on, billed the same whether idle or
 * spiking" as "24/7" (a plain fact of an always-on server, not a claimed
 * metric) plus a flat-then-spike mini bar chart; the only quoted number in
 * the office analogy is "2 meetings a week" because that is literally in
 * the narration. Every other number on screen (43, <500ms, ~10s, $0/month)
 * is a real fact from the feature data. The b2→b3 change is a paper-feed
 * push (content lifts and fades out upward, the next line rises up from
 * below into place), not a plain crossfade — the ledger "feeds" to its next
 * line the way a receipt printer advances paper.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, CheckBadge, seg, fontFamily } from "./bright-primitives";

const P = MOODS.mint;

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const BEATS = {
  b1: [15, 213],
  b2: [222, 338],
  b3: [347, 544],
  b4: [553, 687],
  b5: [696, 770],
} as const;

const FN_ROWS = [
  "telegram-scraper",
  "fetch-news",
  "pre-moderate-news",
  "process-image",
  "post-to-linkedin",
  "generate-social-teasers",
];

const RECEIPT = { x: 300, y: 36, w: 680, h: 648 };
const BODY = { x: RECEIPT.x + 40, w: RECEIPT.w - 80, top: 140, bottom: 624 };

export const FeatureEdgeFunctionsCost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  /** Zone visibility: fades in after the beat opens, fully gone before it closes. */
  const zone = (name: keyof typeof BEATS) => {
    const [s, e] = BEATS[name];
    return Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));
  };

  const b1 = zone("b1");
  const b2 = zone("b2");
  const b3 = zone("b3");
  const b4 = zone("b4");
  // b5 has nothing to hand over to — it holds through the tail instead of fading out.
  const b5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);

  // ── Persistent chrome — receipt shell, header, footer. Appears once, never fades. ──
  const chromeIn = seg(frame, 8, 24);
  const headlineIn = seg(frame, 18, 34);

  // ── Beat 1: the problem — an always-on server, billed 24/7, idle most of the time ──
  const barStarts = Array.from({ length: 12 }, (_, i) => BEATS.b1[0] + 30 + i * 6);
  const barHeights = [12, 10, 15, 11, 9, 13, 10, 12, 80, 32, 11, 9];
  const heroLabel1 = seg(frame, BEATS.b1[0] + 118, BEATS.b1[0] + 132);
  const hero1Pop = pop(BEATS.b1[0] + 122);
  const pill1 = pop(BEATS.b1[0] + 158);
  const pill2 = pop(BEATS.b1[0] + 172);

  // ── Beat 2: the analogy — a whole office for two meetings a week ──
  const b2ExitT = seg(frame, BEATS.b2[1] - 10, BEATS.b2[1] - 2);
  const b2TranslateY = -36 * b2ExitT;
  const officeIcon = pop(BEATS.b2[0] + 18);
  const officePrice = seg(frame, BEATS.b2[0] + 24, BEATS.b2[0] + 40, Easing.out(Easing.cubic));
  const meetingIcon = pop(BEATS.b2[0] + 56);
  const capOp2 = seg(frame, BEATS.b2[0] + 84, BEATS.b2[0] + 100, Easing.out(Easing.cubic));

  // ── Beat 3: the solution — 43 Edge Functions, billed only when they run ──
  const b3EnterT = seg(frame, BEATS.b3[0] + 2, BEATS.b3[0] + 16);
  const b3TranslateY = 36 * (1 - b3EnterT);
  const heroCount = Math.round(
    interpolate(frame, [BEATS.b3[0] + 10, BEATS.b3[0] + 90], [0, 43], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );
  const hero3Pop = pop(BEATS.b3[0] + 8);
  const rowStagger = 22;
  const rowStart = BEATS.b3[0] + 30;

  // ── Beat 4: the mechanics — cold start under 500ms, redeploy in ~10s ──
  const rowAIn = seg(frame, BEATS.b4[0] + 10, BEATS.b4[0] + 24, Easing.out(Easing.cubic));
  const rowBIn = seg(frame, BEATS.b4[0] + 62, BEATS.b4[0] + 76, Easing.out(Easing.cubic));
  const techCapOp = seg(frame, BEATS.b4[0] + 90, BEATS.b4[0] + 104) * (1 - seg(frame, BEATS.b4[1] - 12, BEATS.b4[1] - 4));

  // ── Beat 5: the payoff — struck-through "always-on", the total collapses to $0 ──
  const strikeIn = seg(frame, BEATS.b5[0] + 4, BEATS.b5[0] + 16, Easing.out(Easing.cubic));
  const arrowIn = seg(frame, BEATS.b5[0] + 14, BEATS.b5[0] + 24);
  const heroZero = pop(BEATS.b5[0] + 26);
  const subIn = seg(frame, BEATS.b5[0] + 46, BEATS.b5[0] + 60, Easing.out(Easing.cubic));
  const check = pop(BEATS.b5[0] + 50);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />
      <PaletteProvider value={P}>
        {/* ════ Persistent receipt shell — the ledger itself, the archetype's object ════ */}
        <div
          style={{
            position: "absolute",
            left: RECEIPT.x,
            top: RECEIPT.y,
            width: RECEIPT.w,
            height: RECEIPT.h,
            borderRadius: 26,
            background: P.card,
            border: `2px solid ${P.border}`,
            boxShadow: "0 24px 60px rgba(16,40,29,0.16)",
            opacity: chromeIn,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: BODY.x,
            top: 58,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: P.muted,
            opacity: chromeIn,
            fontFamily,
          }}
        >
          Edge Functions — cost ledger
        </div>
        <div
          style={{
            position: "absolute",
            left: BODY.x,
            top: 82,
            fontSize: 23,
            fontWeight: 800,
            color: P.ink,
            opacity: chromeIn,
            fontFamily,
          }}
        >
          Backend billing, itemized
        </div>
        <div
          style={{
            position: "absolute",
            left: BODY.x,
            top: 122,
            width: BODY.w,
            borderTop: `2px dashed ${P.border}`,
            opacity: chromeIn,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: BODY.x,
            top: 636,
            width: BODY.w,
            borderTop: `2px dashed ${P.border}`,
            opacity: chromeIn,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: BODY.x,
            top: 652,
            fontSize: 13.5,
            fontWeight: 600,
            color: P.muted,
            letterSpacing: 0.5,
            opacity: chromeIn,
            fontFamily,
          }}
        >
          No. 0043 · vitalii.no
        </div>
        <div style={{ position: "absolute", left: BODY.x + BODY.w - 210, top: 652, display: "flex", gap: 2.5, opacity: chromeIn * 0.8 }}>
          {[3, 1.5, 2, 4, 1.5, 3, 2, 1.5, 4, 2, 1.5, 3, 2, 4, 1.5, 2, 3, 1.5, 2, 4].map((w, i) => (
            <div key={i} style={{ width: w, height: 16, background: P.ink, opacity: 0.55 }} />
          ))}
        </div>

        {/* ════ Persistent small headline — off to the side, never centered ════ */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 626,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2.4,
            textTransform: "uppercase",
            color: P.accent,
            opacity: headlineIn,
            fontFamily,
          }}
        >
          43 Edge Functions
        </div>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 652,
            fontSize: 19,
            fontWeight: 700,
            color: P.ink,
            opacity: headlineIn,
            fontFamily,
          }}
        >
          $0/month backend,
          <br />
          always ready
        </div>

        {/* ════ Beat 1 — PROBLEM: always-on, billed 24/7 ════ */}
        <Group opacity={b1}>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 146,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: P.danger,
              fontFamily,
            }}
          >
            Always-on server
          </div>
          <div style={{ position: "absolute", left: BODY.x, top: 270, width: BODY.w, height: 2, background: P.border }} />
          {barHeights.map((h, i) => {
            const t = Math.min(1, pop(barStarts[i]));
            const spike = i === 8;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: BODY.x + i * 46,
                  top: 270 - h * t,
                  width: 40,
                  height: h * t,
                  borderRadius: 4,
                  background: spike ? P.danger : P.border,
                  opacity: t,
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 296,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: P.muted,
              opacity: heroLabel1,
              fontFamily,
            }}
          >
            Billed
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 314,
              fontSize: 128,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1,
              color: P.danger,
              transform: `scale(${0.85 + 0.15 * Math.min(1, hero1Pop)})`,
              transformOrigin: "left top",
              opacity: Math.min(1, hero1Pop),
              fontFamily,
            }}
          >
            24/7
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 470,
              fontSize: 21,
              fontWeight: 650,
              color: P.muted,
              opacity: heroLabel1,
              fontFamily,
            }}
          >
            even on the quiet days
          </div>
          <StatPill x={BODY.x} y={506} emoji="😴" text="Mostly idle" tone="danger" scale={pill1} opacity={Math.min(1, pill1)} />
          <StatPill x={BODY.x} y={558} emoji="⚡" text="Then spikes without warning" tone="danger" scale={pill2} opacity={Math.min(1, pill2)} />
        </Group>

        {/* ════ Beat 2 — ANALOGY: a whole office for two meetings a week ════ */}
        <div style={{ position: "absolute", inset: 0, opacity: b2, transform: `translateY(${b2TranslateY}px)`, fontFamily }}>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 150,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: P.muted,
              fontFamily,
            }}
          >
            That's like…
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 192,
              display: "flex",
              alignItems: "center",
              gap: 20,
              transform: `scale(${0.9 + 0.1 * Math.min(1, officeIcon)})`,
              transformOrigin: "left center",
              opacity: Math.min(1, officeIcon),
            }}
          >
            <span style={{ fontSize: 56 }}>🏢</span>
            <span style={{ fontSize: 36, fontWeight: 800, color: P.danger }}>Renting a whole office</span>
          </div>
          <div style={{ position: "absolute", left: BODY.x, top: 270, fontSize: 20, fontWeight: 700, color: P.danger, opacity: officePrice, fontFamily }}>
            — paid in full, every single day
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 322,
              display: "flex",
              alignItems: "center",
              gap: 20,
              transform: `scale(${0.9 + 0.1 * Math.min(1, meetingIcon)})`,
              transformOrigin: "left center",
              opacity: Math.min(1, meetingIcon),
            }}
          >
            <span style={{ fontSize: 44 }}>🗓</span>
            <span style={{ fontSize: 27, fontWeight: 700, color: P.ink }}>for a meeting held twice a week</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 410,
              width: BODY.w,
              fontSize: 22,
              fontWeight: 650,
              color: P.danger,
              opacity: capOp2,
              fontFamily,
            }}
          >
            Full price, occasional use.
          </div>
        </div>

        {/* ════ Beat 3 — SOLUTION: 43 Edge Functions, billed only on demand ════ */}
        <div style={{ position: "absolute", inset: 0, opacity: b3, transform: `translateY(${b3TranslateY}px)`, fontFamily }}>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 148,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: P.muted,
              fontFamily,
            }}
          >
            Replaced with
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 182,
              fontSize: 168,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
              color: P.accent,
              transform: `scale(${0.85 + 0.15 * Math.min(1, hero3Pop)})`,
              transformOrigin: "left top",
              opacity: Math.min(1, hero3Pop),
              fontFamily,
            }}
          >
            {heroCount}
          </div>
          <div style={{ position: "absolute", left: BODY.x, top: 392, fontSize: 26, fontWeight: 700, color: P.ink, opacity: Math.min(1, hero3Pop), fontFamily }}>
            Edge Functions
          </div>

          {FN_ROWS.map((name, i) => {
            const t = seg(frame, rowStart + i * rowStagger, rowStart + i * rowStagger + 14);
            return (
              <div
                key={name}
                style={{
                  position: "absolute",
                  left: BODY.x + 280,
                  top: 158 + i * 44,
                  width: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: t,
                  transform: `translateX(${(1 - t) * 22}px)`,
                  fontFamily,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: P.ink, fontFamily: "monospace" }}>{name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: P.success }}>on-demand</span>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: BODY.x + 280,
              top: 158 + FN_ROWS.length * 44,
              width: 320,
              opacity: seg(frame, rowStart + FN_ROWS.length * rowStagger, rowStart + FN_ROWS.length * rowStagger + 14),
              fontSize: 16,
              fontWeight: 650,
              fontStyle: "italic",
              color: P.muted,
              fontFamily,
            }}
          >
            + 37 more, same model
          </div>
        </div>

        {/* ════ Beat 4 — MECHANICS: cold start under 500ms, redeploy in ~10s ════ */}
        <Group opacity={b4}>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 168,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: P.muted,
              fontFamily,
            }}
          >
            Every one of them
          </div>
          <div style={{ position: "absolute", left: BODY.x, top: 206, display: "flex", alignItems: "baseline", gap: 18, opacity: rowAIn, fontFamily }}>
            <span style={{ fontSize: 27, fontWeight: 700, color: P.ink }}>⚡ Cold start</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: P.muted }}>(e.g. process-image)</span>
          </div>
          <div style={{ position: "absolute", left: BODY.x, top: 244, fontSize: 68, fontWeight: 800, color: P.success, opacity: rowAIn, fontFamily }}>
            &lt;500ms
          </div>
          <div style={{ position: "absolute", left: BODY.x, top: 340, borderTop: `2px dashed ${P.border}`, width: BODY.w, opacity: rowAIn }} />
          <div style={{ position: "absolute", left: BODY.x, top: 364, display: "flex", alignItems: "baseline", gap: 18, opacity: rowBIn, fontFamily }}>
            <span style={{ fontSize: 27, fontWeight: 700, color: P.ink }}>🔁 Redeploy</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: P.muted }}>(one function, alone)</span>
          </div>
          <div style={{ position: "absolute", left: BODY.x, top: 402, fontSize: 68, fontWeight: 800, color: P.success, opacity: rowBIn, fontFamily }}>
            ~10s
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 500,
              width: BODY.w,
              fontSize: 17,
              fontWeight: 600,
              color: P.muted,
              opacity: techCapOp,
              fontFamily,
            }}
          >
            Deno runtime · supabase/functions/&lt;name&gt;/index.ts
          </div>
        </Group>

        {/* ════ Beat 5 — PAYOFF, holds through the tail ════ */}
        <Group opacity={b5}>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 150,
              fontSize: 30,
              fontWeight: 700,
              color: P.danger,
              textDecoration: "line-through",
              textDecorationThickness: 3,
              opacity: strikeIn,
              fontFamily,
            }}
          >
            Always-on server, billed 24/7
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 198,
              fontSize: 44,
              fontWeight: 800,
              color: P.muted,
              opacity: arrowIn,
              fontFamily,
            }}
          >
            ↓
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 250,
              fontSize: 172,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
              color: P.success,
              transform: `scale(${0.85 + 0.15 * Math.min(1, heroZero)})`,
              transformOrigin: "left top",
              opacity: Math.min(1, heroZero),
              fontFamily,
            }}
          >
            $0<span style={{ fontSize: 54 }}>/month</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: BODY.x,
              top: 470,
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: subIn,
              fontFamily,
            }}
          >
            <div style={{ position: "relative", width: 40, height: 40 }}>
              <CheckBadge x={0} y={0} size={40} scale={check} opacity={Math.min(1, check)} />
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: P.ink }}>43 functions — billed only when used</span>
          </div>
        </Group>
      </PaletteProvider>
    </div>
  );
};
