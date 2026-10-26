// FeatureBlogNewsRewritesRunP80 — feature p80 — 1280x720, 890 frames @ 30fps, VOICE-SYNCED.
// archetype 0 split-duel, mood sand. Motion direction (feature-motion skill, 2026-10-07).
//
// Neither given commit (7d81dde, 73ce018) touches p80's own files (the azure-to-
// gemini-shim route, the five rewrite callers, the R2 upload move) so no diff is
// shown; b1/b2 use the feature's own page and the features hub (always true,
// always available), b3-b5 are drawn from the feature row's own words.
//
// Beat → effect:
// b1 15-182   "every rewrite quietly added to a metered API bill"
//             cornerTags (the three languages + per-call) over the feature's own
//             page (backdrop "page").
// b2 183-353  "multiply that across every post, costs added up fast"
//             lineTrend (a rising cost curve) over the features hub (backdrop
//             "hub" — scrolling the many posts being multiplied).
// b3 354-499  "paying per minute for a line you already have unlimited minutes on"
//             keywordCaption — the one plain analogy, drawn, no backdrop.
// b4 500-689  "now those jobs try my Claude subscription first"
//             handoffExplain — old route → new route, the one tech name (Claude).
// b5 690-889  "five content paths switched, the bill dropped to zero"
//             funnelAbsorption — the five real callers converging into the
//             result; holds to the end, no fade (Gate 2: ends on the feature's
//             own result, not the page or hub).
//
// Persistent element: the split-duel card (archetype 0) in the bottom band
// (y>=600) — METERED API vs CLAUDE SUBSCRIPTION, the left card's running cost
// ticking up through b1-b3 and switching off the instant b4 lands, the right
// card lighting from idle to active at the same frame. The product plate
// ("PORTFOLIO & NEWS PLATFORM") sits on the same card from b1.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p80.json";

const B1 = 15;
const B2 = 183;
const B3 = 354;
const B4 = 500;
const B5 = 690;
const END = 890;

/** Accent tuned for the dark stage (sand's #B4531F is too dark on a plate). */
const ACCENT = "#F08A4B";
const STAGE = "#1C1610";

const DL = { x: 40, y: 606, w: 1200, h: 92 };
const CARD_Y = DL.y + 30;
const CARD_H = 54;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const Duel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const costT = Math.min(1, Math.max(0, (Math.min(frame, B4) - B1) / (B4 - B1)));
  const cost = (costT * 4.4).toFixed(2);
  const switched = frame >= B4;
  const flipT = tween(sec(frame, B4, fps), 0, 0.5, ease.power3InOut);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={DL} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: DL.x,
            top: DL.y,
            width: DL.w,
            height: DL.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: DL.x + 20, top: DL.y + 8, fontSize: 12, fontWeight: 800, letterSpacing: 2, color: P.accent }}>
          PORTFOLIO &amp; NEWS PLATFORM
        </div>
      </Arrive>

      {/* left: metered API, cost rising until the switch */}
      <Arrive at={B1 + 20} kind="rise" box={{ x: 60, y: CARD_Y, w: 520, h: CARD_H }}>
        <div
          style={{
            position: "absolute",
            left: 60,
            top: CARD_Y,
            width: 520,
            height: CARD_H,
            background: switched ? P.card : P.dangerBg,
            border: `2px solid ${switched ? P.border : P.dangerEdge}`,
            borderRadius: 4,
            opacity: switched ? 0.55 : 1,
            boxSizing: "border-box",
            padding: "8px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: switched ? P.muted : P.danger }}>METERED API</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: switched ? P.muted : P.danger,
              fontVariantNumeric: "tabular-nums",
              marginTop: 4,
            }}
          >
            {switched ? "OFF" : `$${cost}/call`}
          </div>
        </div>
      </Arrive>

      {/* the duel's divider */}
      <Arrive at={B1 + 28} kind="punch" box={{ x: 620, y: CARD_Y + CARD_H / 2 - 18, w: 40, h: 36 }}>
        <div
          style={{
            position: "absolute",
            left: 620,
            top: CARD_Y + CARD_H / 2 - 18,
            width: 40,
            height: 36,
            borderRadius: 18,
            background: P.ink,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          VS
        </div>
      </Arrive>

      {/* right: Claude subscription, idle until the switch, then active */}
      <Arrive at={B1 + 36} kind="rise" box={{ x: 700, y: CARD_Y, w: 520, h: CARD_H }}>
        <div
          style={{
            position: "absolute",
            left: 700,
            top: CARD_Y,
            width: 520,
            height: CARD_H,
            background: switched ? P.successBg : P.card,
            border: `2px ${switched ? "solid" : "dashed"} ${switched ? P.successEdge : P.muted}`,
            borderRadius: 4,
            boxSizing: "border-box",
            padding: "8px 16px",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: switched ? P.success : P.muted }}>CLAUDE SUBSCRIPTION</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: switched ? P.success : P.muted, marginTop: 4 }}>
            {switched ? "$0 / call" : "idle"}
          </div>
        </div>
      </Arrive>

      {frame >= B4 && frame < B4 + 18 && (
        <div
          style={{
            position: "absolute",
            left: 700,
            top: CARD_Y,
            width: 520,
            height: CARD_H,
            borderRadius: 4,
            background: P.success,
            opacity: (1 - flipT) * 0.5,
          }}
        />
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{ statement: "Billed per call, every rewrite", tags: ["EN", "NO", "UA", "Per API call"] }}
      />

      {/* b2 — the cost rising across every post, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="lineTrend"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          title: "Metered API cost",
          unit: "$",
          points: [
            { label: "Mon", value: 2 },
            { label: "Tue", value: 5 },
            { label: "Wed", value: 9 },
            { label: "Thu", value: 14 },
            { label: "Fri", value: 22 },
          ],
        }}
      />

      {/* b3 — the one plain analogy, drawn */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          line1: "Paying per minute",
          line2: "for a line you already have unlimited minutes on",
          keywords: ["per minute", "unlimited minutes"],
        }}
      />

      {/* b4 — the route switch, the one tech name */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          from: "Metered API first",
          to: "Claude subscription first",
          points: ["Falls back to the metered API only if needed", "One OAuth token, already paid for", "Five content paths switched over"],
        }}
      />

      {/* b4 fill — handoffExplain's own points land late (t~2.95 of 4.3) and its camera
          is still mid-pan at the beat's midpoint, leaving the canvas sparse; these two
          bands restate the same real facts from early in the beat so the frame reads
          full throughout, not just once the pan settles. */}
      {frame >= B4 && frame < B5 && (
        <>
          <Arrive at={B4 + 6} kind="wipe" box={{ x: 40, y: 40, w: 1200, h: 120 }} dur={0.4}>
            <div style={{ position: "absolute", left: 40, top: 40, width: 1200, height: 120, display: "flex", gap: 16 }}>
              {["Falls back to metered API only if needed", "One OAuth token, already paid for", "Five content paths switched over"].map((t, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: P.card,
                    borderRadius: 4,
                    boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
                    padding: "18px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 6,
                    fontFamily,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: P.accent }}>{`STEP ${i + 1}`}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: P.ink, lineHeight: 1.22 }}>{t}</div>
                </div>
              ))}
            </div>
          </Arrive>
          <Arrive at={B4 + 12} kind="rise" box={{ x: 40, y: 528, w: 1200, h: 60 }}>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 528,
                width: 1200,
                height: 60,
                background: P.accentBg,
                border: `1px solid ${P.accentEdge}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 0.6,
                color: P.ink,
              }}
            >
              BEFORE: Metered API first&nbsp;&nbsp;·&nbsp;&nbsp;NOW: Claude subscription first
            </div>
          </Arrive>
        </>
      )}

      {/* b5 — the five real callers converging into the result, holds to the end */}
      <MotionInsert
        effect="funnelAbsorption"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{
          inputs: ["Blog rewrites", "Website publishing", "Translation backfills", "News-to-blog conversion", "Voice-blog processing"],
          result: "Per-call bill: $0",
        }}
      />

      {/* b5 fill — the funnel silhouette reads low-contrast against this dark stage
          and its result text only arrives at t~2.95 of 3.3; these two bands keep the
          mid and lower canvas legible with the same real callers and result all beat. */}
      {frame >= B5 && frame < END && (
        <>
          <Arrive at={B5 + 6} kind="wipe" box={{ x: 190, y: 270, w: 900, h: 90 }} dur={0.4}>
            <div
              style={{
                position: "absolute",
                left: 190,
                top: 270,
                width: 900,
                height: 90,
                background: P.card,
                borderRadius: 4,
                boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 1,
                color: P.ink,
                textAlign: "center",
              }}
            >
              FIVE PATHS, ONE SWITCH
            </div>
          </Arrive>
          <Arrive at={B5 + 12} kind="rise" box={{ x: 40, y: 486, w: 1200, h: 96 }}>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 486,
                width: 1200,
                height: 96,
                background: P.successBg,
                border: `1px solid ${P.successEdge}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily,
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 0.4,
                color: P.ink,
                textAlign: "center",
              }}
            >
              Per-call bill: $0
            </div>
          </Arrive>
        </>
      )}

      <Duel />
    </AbsoluteFill>
  );
};

export const FeatureBlogNewsRewritesRunP80: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
