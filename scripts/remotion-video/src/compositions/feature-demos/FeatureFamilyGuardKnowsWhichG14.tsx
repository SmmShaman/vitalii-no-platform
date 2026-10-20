// FeatureFamilyGuardKnowsWhichG14 — feature g14 — 1280x720, 811 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, over the real product as evidence, one owner
// of the frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature row):
// b1 15-152   "just another address on the network" — funnelAbsorption over the
//             feature's own page (backdrop). In the lower third the flow-map's
//             router-table block fills with an unlit device count.
// b2 152-280  "no idea which kid is playing, or what game" — cornerTags: three
//             unknowns, over the page lower down.
// b3 280-385  "checking meant walking in and looking at the screen" —
//             keywordCaption over the public features hub.
// b4 385-572  "a small Python script reads the console's own presence feed" —
//             handoffExplain, drawn (invisible plumbing, no page to show). The
//             lower third hands off: the router block lights up as the presence
//             feed, the headline node resolves from "WHO'S PLAYING?" to "PLAYER ID".
// b5 572-811  "sits next to Wi-Fi and the TV stick, in one dashboard. Zero walks
//             down the hall." — hubRouting, drawn result, holds to the end, no fade.
//
// Persistent element: the flow-map lower third (archetype 4), b1 through b5.
// Effects keep the bottom 200/1080 px clear (look.safeBottom) — that is where it sits.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/g14.json";

const B1 = 15;
const B2 = 152;
const B3 = 280;
const B4 = 385;
const B5 = 572;
const END = 811;

/** Accent tuned for the dark stage (violet's own #5B37D4 reads too dark on a plate). */
const ACCENT = "#8B6FEF";
const STAGE = "#160F2E";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const LINE_Y = LT.y + 50;
const BLOCK_X = 268;
const BLOCK_W_OLD = 560;
const BLOCK_W_NEW = 170;
const NODE_W = 196;
const NODE_X_OLD = BLOCK_X + BLOCK_W_OLD + 34;
const NODE_X_NEW = BLOCK_X + BLOCK_W_NEW + 34;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // b1: the token crawls the router block; the counter rides it, tallying devices.
  const crawl = tween(sec(frame, B1 + 45, fps), 0, (B2 - 12 - (B1 + 45)) / fps, ease.linear);
  // b4: one hand-off lands the route on the presence feed.
  const hand = tween(sec(frame, B3 + 30, fps), 0, 0.6, ease.power3InOut);
  const isNew = frame >= B3 + 30;
  const blockW = mix(hand, BLOCK_W_OLD, BLOCK_W_NEW);
  const nodeX = mix(hand, NODE_X_OLD, NODE_X_NEW);
  const tokenX = isNew ? BLOCK_X + blockW - 12 : BLOCK_X + 12 + crawl * (BLOCK_W_OLD - 24);
  const deviceCount = Math.min(4, Math.round(crawl * 4));
  const lit = isNew;
  const tone = lit ? P.success : P.danger;

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
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.4, color: P.accent }}>THE NETWORK</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.2 }}>
            PlayStation on
            <br />
            the home Wi-Fi
          </div>
        </div>
        {/* route line */}
        <div style={{ position: "absolute", left: BLOCK_X - 22, top: LINE_Y - 1, width: 960, height: 2, background: P.border }} />
        <div style={{ position: "absolute", left: BLOCK_X - 30, top: LINE_Y - 8, width: 16, height: 16, borderRadius: 8, background: P.ink }} />
      </Arrive>

      {/* the router block: unlit address table (old) → lit presence feed (new) */}
      <Arrive at={B1 + 20} kind="wipe" box={{ x: BLOCK_X, y: LT.y + 14, w: BLOCK_W_OLD, h: 64 }} dur={0.5}>
        <div
          style={{
            position: "absolute",
            left: BLOCK_X,
            top: LT.y + 14,
            width: blockW,
            height: 64,
            background: lit ? P.successBg : P.dangerBg,
            border: `2px solid ${lit ? P.successEdge : P.dangerEdge}`,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 12, top: 8, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: tone, whiteSpace: "nowrap" }}>
            {lit ? "PRESENCE FEED" : "ROUTER TABLE"}
          </div>
          {!lit && (
            <div style={{ position: "absolute", left: 0, top: 46, width: crawl * blockW, height: 4, background: P.danger }} />
          )}
        </div>
        {/* token + the counter that rides it */}
        <div style={{ position: "absolute", left: tokenX - 9, top: LINE_Y - 9, width: 18, height: 18, borderRadius: 9, background: tone }} />
        {!lit && (
          <div
            style={{
              position: "absolute",
              left: Math.min(tokenX + 14, BLOCK_X + BLOCK_W_OLD - 90),
              top: LT.y + 30,
              fontSize: 22,
              fontWeight: 800,
              color: P.danger,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {deviceCount} devices
          </div>
        )}
      </Arrive>

      {/* headline node: unknown identity (old) → lit, right after the hand-off (new) */}
      <Arrive at={B1 + 34} kind="rise" box={{ x: NODE_X_OLD, y: LT.y + 14, w: NODE_W, h: 64 }}>
        <div
          style={{
            position: "absolute",
            left: nodeX,
            top: LT.y + 14,
            width: NODE_W,
            height: 64,
            background: lit ? P.success : P.card,
            border: lit ? `2px solid ${P.success}` : `2px dashed ${P.muted}`,
            borderRadius: 4,
            color: lit ? "#fff" : P.muted,
            padding: "8px 12px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.6 }}>{lit ? "PLAYER ID" : "WHO'S PLAYING?"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{lit ? "name + game" : frame >= B2 ? "unknown" : "waiting…"}</div>
        </div>
      </Arrive>

      {/* b4: the three presence facts punch in one by one after the hand-off */}
      {[0, 1, 2].map((i) => {
        const at = B3 + 60 + i * 9;
        if (frame < at) return null;
        const x = NODE_X_NEW + NODE_W + 20 + i * 76;
        const sc = punchScale(sec(frame, at, fps), 0);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: LT.y + 16,
              width: 64,
              height: 60,
              borderRadius: 4,
              background: [P.accentBg, P.successBg, P.noteBg][i],
              border: `2px solid ${[P.accentEdge, P.successEdge, P.noteBorder][i]}`,
              transform: `scale(${sc})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: P.ink,
            }}
          >
            {i + 1}
          </div>
        );
      })}

      {/* b4: the cut marker lands on the junction router → feed */}
      {frame >= B4 + 24 && (
        <div
          style={{
            position: "absolute",
            left: NODE_X_NEW - 19,
            top: LT.y + 6,
            width: 4,
            height: 80,
            background: P.accent,
            transformOrigin: "50% 100%",
            transform: `scaleY(${tween(sec(frame, B4 + 24, fps), 0, 0.3, ease.expoOut)})`,
          }}
        />
      )}

      {/* b5: the result stamp on the headline node */}
      {frame >= B5 + 70 && (
        <div
          style={{
            position: "absolute",
            left: 1010,
            top: LT.y + 18,
            width: 200,
            height: 56,
            borderRadius: 4,
            background: P.ink,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            transform: `scale(${punchScale(sec(frame, B5 + 70, fps), 0)})`,
          }}
        >
          0 walks / night
        </div>
      )}
    </div>
  );
};

/** b1-only credibility line: names the product plainly, away from the lower third and the effect's own text. */
const ProductTag: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < B1 || frame >= B2) return null;
  const p = tween(sec(frame, B1 + 6, 30), 0, 0.3, ease.power3Out);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 36,
        padding: "8px 16px",
        borderRadius: 4,
        background: "rgba(8,8,8,0.55)",
        opacity: p,
        transform: `translateY(${mix(p, -8, 0)}px)`,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>
        Product: Family Network Guard — sees every device on the home Wi-Fi, the TV stick, and the PlayStation
      </span>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — just another address, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="funnelAbsorption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.7}
        data={{
          inputs: ["Phone", "Laptop", "Smart TV", "Game console"],
          result: "Just another address on the Wi-Fi table",
        }}
      />
      <ProductTag />

      {/* b2 — no idea who's playing, over the page lower down */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "No idea who's playing",
          tags: ["Which kid?", "What game?", "Playing or idle?"],
        }}
      />

      {/* b3 — checking meant walking in, over the public features hub */}
      {cut(frame, B3, B4) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B3} hold={B4 - B3} />}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          line1: "Checking meant walking in",
          line2: "and looking at the screen",
          keywords: ["walking", "looking"],
        }}
      />

      {/* b4 — the script reads the console's own feed: drawn (invisible plumbing) */}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          from: "Walk in, check the screen",
          to: "Script reads presence feed",
          points: ["psn.py — a small Python script", "Authenticates via parent account", "Reads online status + current game"],
        }}
      />

      {/* b5 — the result: drawn, holds to the end, no fade */}
      <MotionInsert
        effect="hubRouting"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          inputs: ["Wi-Fi devices", "Android TV stick", "PlayStation"],
          hub: "Guard dashboard",
          output: "Zero walks down the hall",
        }}
      />

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureFamilyGuardKnowsWhichG14: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
