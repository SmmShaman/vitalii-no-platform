// FeatureFiveNewMiniLessonsD07 — feature d07 — 1280x720, 880 frames @ 30fps, VOICE-SYNCED.
// archetype 4 flow-map, mood violet. Motion direction (feature-motion skill, 2026-10-07;
// rebuilt 2026-10-12 — the first pass drew a card deck under a "flow-map" header, which
// failed the directing gate).
//
// The map is the game's five real lessons (from the commit below), not abstract chips,
// laid out as nodes on a zigzag level-map path that spans almost the whole 1280x720 frame,
// joined by route lines. It breathes through the clip: the nodes sit dim in the bottom
// band while nothing is taught yet (b1-b2, muted under the live recordings), unfurl out
// onto the big zigzag path for the reveal (b3), collapse back into the band so the matrix
// panel can own the centre (b4, room made for each lesson's ending), then expand onto the
// path again for the finale: a single token walks the route node by node, ticking each
// green as it arrives, ending on a bright "5 / 5" stamp (b5). One path, one set of nodes,
// zoomed in and out — never a stack, never a fan.
//
// Beat → effect (data only from the feature row and the one matching commit —
// 8e55152 "five game lessons — food to sugar, insulin key, type 2 rusty lock, too
// little insulin, low sugar help" informs b3 directly; 4a14f3c "NovoRapid starts
// with the plate" and 4683181 "food by weight, per 100g" both belong to feature
// d08 and are not used here):
// b1 15-188   "A kid could play the diabetes game for hours and never actually
//             learn why any of it happens." keywordCaption over the features hub
//             (titleTakeover opened d08 most recently, so b1 does not repeat it).
// b2 188-381  "The simulation ran, but nothing stopped to explain what insulin
//             does, or why type 2 is different." cornerTags over the feature's
//             own page.
// b3 381-551  "Five guided lessons now walk through that reasoning step by step,
//             right on the level map." Drawn: no live page shows this — the
//             archetype's own hand-off, the five real lesson names (commit
//             8e55152) unfurl from the dim band onto the lit zigzag level-map path.
// b4 551-693  "Each one ends in a quiz or a hands-on round, scored with stars."
//             featureMatrix, drawn (the path collapses back into the band so the
//             matrix panel owns the centre) — each node also gains its own
//             star / hands-on badge.
// b5 693-880  "A Playwright test plays every lesson through to completion — five
//             for five." Drawn: the path expands back out, a token walks it node
//             by node, each one ticking green in turn, ending on a bright "5 / 5"
//             stamp. Holds bright to the final frame, no fade.
//
// Persistent element: the level-map (archetype 4), b1 through b5 — the same five
// lesson nodes and the route joining them throughout; only the path's scale (band
// vs. full zigzag) and each node's markings change.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/d07.json";

const B1 = 15;
const B2 = 188;
const B3 = 381;
const B4 = 551;
const B5 = 693;
const END = 880;

/** Bright violet tuned for the dark stage — the palette's own #5B37D4 reads muddy on a plate. */
const ACCENT = "#A78BFA";
const STAGE = "#17123A";

// Resting band (dim home row for b1-b2, and the collapsed row during b4) vs. the
// big zigzag level-map path used for the b3 reveal and the b5 finale.
const BAND = { x: 40, y: 606, w: 1200, h: 92 };
const NODE_W = 196;
const NODE_H = 160;
const PATH_X = [90, 365, 640, 915, 1190];
const PATH_Y = [560, 300, 560, 300, 560];

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Rect = { x: number; y: number; w: number; h: number };
const mixRect = (p: number, a: Rect, b: Rect): Rect => ({
  x: mix(p, a.x, b.x),
  y: mix(p, a.y, b.y),
  w: mix(p, a.w, b.w),
  h: mix(p, a.h, b.h),
});

type Lesson = { key: string; label: string; handsOn?: boolean };
/** The real five lessons from commit 8e55152, in commit order. */
const LESSONS: Lesson[] = [
  { key: "food", label: "Food → Sugar" },
  { key: "ikey", label: "Insulin Key" },
  { key: "rusty", label: "Type 2: Rusty Lock" },
  { key: "low", label: "Too Little Insulin", handsOn: true },
  { key: "help", label: "Low Sugar Help" },
];
const N = LESSONS.length;

const FlowMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Home layout: a tidy row of five slots inside BAND — dim while nothing is taught (b1-b2),
  // and the collapsed shape the path returns to while the matrix panel owns the centre (b4).
  const PAD = 10;
  const GAP = 6;
  const slotW = (BAND.w - PAD * 2 - GAP * (N - 1)) / N;
  const rowH = BAND.h - PAD * 2;
  const rowY = BAND.y + PAD;
  const pileCx = BAND.x + BAND.w / 2;

  const shrink = tween(sec(frame, B4, fps), 0, 0.4, ease.power3InOut);
  const expand = tween(sec(frame, B5, fps), 0, 0.4, ease.power3InOut);
  // 0 = home (band) row, 1 = big zigzag path — collapses home through b4, big again from b5.
  const bigness = mix(expand, 1 - shrink, 1);

  const showQuestion = frame < B3;
  const kicker =
    frame >= B5
      ? "PLAYWRIGHT: FIVE FOR FIVE"
      : frame >= B4
      ? "QUIZ OR HANDS-ON, SCORED IN STARS"
      : frame >= B3
      ? "FIVE GUIDED LESSONS"
      : "NO LESSONS, JUST PLAY";

  const stampStart = B5 + 140;
  const showStamp = frame >= stampStart;
  const stampPop = showStamp ? punchScale(sec(frame, stampStart, fps), 0) : 1;

  // Each node's current rect: home row (small) <-> its own stop on the big zigzag path.
  const nodeRects: Rect[] = LESSONS.map((_, i) => {
    const smallRect: Rect = { x: BAND.x + PAD + i * (slotW + GAP), y: rowY, w: slotW, h: rowH };
    const bigRect: Rect = { x: PATH_X[i] - NODE_W / 2, y: PATH_Y[i] - NODE_H / 2, w: NODE_W, h: NODE_H };
    const settled = mixRect(bigness, smallRect, bigRect);
    const foldT = tween(sec(frame, B3, fps), i * 0.07, 0.5, ease.power3Out);
    // Before the b3 unfurl, nodes sit directly in the home row (no stack, no fan).
    return mixRect(foldT, smallRect, settled);
  });
  const centerOf = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

  // The token that walks the route node-by-node through the finale (b5), arriving at
  // each node exactly when it ticks green.
  const arrivesAt = (i: number) => B5 + i * 25;
  const tokenCenter = (() => {
    const centers = nodeRects.map(centerOf);
    if (frame <= arrivesAt(0)) return centers[0];
    if (frame >= arrivesAt(N - 1)) return centers[N - 1];
    for (let i = 1; i < N; i++) {
      if (frame <= arrivesAt(i)) {
        const t = tween(sec(frame, arrivesAt(i - 1), fps), 0, (arrivesAt(i) - arrivesAt(i - 1)) / fps, ease.power2Out);
        return { x: mix(t, centers[i - 1].x, centers[i].x), y: mix(t, centers[i - 1].y, centers[i].y) };
      }
    }
    return centers[N - 1];
  })();

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      {/* the route — the same line joining every node, flat in the band, a zigzag on the big path */}
      {nodeRects.slice(0, -1).map((r, i) => {
        const a = centerOf(r);
        const b = centerOf(nodeRects[i + 1]);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <div
            key={`route-${i}`}
            style={{
              position: "absolute",
              left: a.x,
              top: a.y,
              width: len,
              height: 3,
              background: P.border,
              transform: `rotate(${angleDeg}deg)`,
              transformOrigin: "0 50%",
              borderRadius: 2,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 2,
          color: ACCENT,
          opacity: frame >= B1 + 10 ? 1 : 0,
        }}
      >
        {kicker}
      </div>

      {showQuestion && (
        <div
          style={{
            position: "absolute",
            left: pileCx - 14,
            top: BAND.y - 46,
            width: 28,
            height: 28,
            borderRadius: 14,
            background: P.dangerBg,
            border: `2px solid ${P.dangerEdge}`,
            color: P.danger,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
          }}
        >
          ?
        </div>
      )}

      {showStamp && (
        <div
          style={{
            position: "absolute",
            left: 1280 / 2 - 90,
            top: 36,
            width: 180,
            height: 56,
            borderRadius: 6,
            background: P.success,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 800,
            transform: `scale(${stampPop})`,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
          }}
        >
          5 / 5
        </div>
      )}

      {LESSONS.map((lesson, i) => {
        const rect = nodeRects[i];

        const foldT = tween(sec(frame, B3, fps), i * 0.07, 0.5, ease.power3Out);
        const arriveT = sec(frame, B1 + 4, fps);
        const entranceScale = punchScale(arriveT, i * 0.05);
        const entranceOpacity = tween(arriveT, i * 0.05, 0.12, ease.linear);

        const landed = foldT > 0.5;
        const bg = landed ? P.successBg : P.chipBg;
        const edge = landed ? P.successEdge : P.border;
        const fg = landed ? P.success : P.muted;
        const big = rect.h > 150;

        const badgeT = frame >= B4 ? tween(sec(frame, B4 + i * 10, fps), 0, 0.3, ease.power3Out) : 0;
        const checkStart = arrivesAt(i);
        const checkT = frame >= B5 ? tween(sec(frame, checkStart, fps), 0, 0.25, ease.power3Out) : 0;

        return (
          <div
            key={lesson.key}
            style={{
              position: "absolute",
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              transform: `scale(${entranceScale})`,
              opacity: entranceOpacity,
              zIndex: i + 1,
              borderRadius: 999,
              background: bg,
              border: `2px solid ${edge}`,
              boxShadow: "6px 6px 0 rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: big ? 20 : 13, fontWeight: 800, color: fg, textAlign: "center", lineHeight: 1.2 }}>
              {lesson.label}
            </div>
            {badgeT > 0.01 && (
              <div
                style={{
                  marginTop: big ? 12 : 6,
                  fontSize: big ? 22 : 14,
                  fontWeight: 800,
                  color: P.amber,
                  opacity: badgeT,
                  transform: `scale(${mix(badgeT, 0.6, 1)})`,
                }}
              >
                {lesson.handsOn ? "✋" : "★★★"}
              </div>
            )}
            {checkT > 0.01 && (
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  top: -10,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: P.success,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  transform: `scale(${mix(checkT, 0.4, 1)})`,
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.35)",
                }}
              >
                ✓
              </div>
            )}
          </div>
        );
      })}

      {/* the token walking the route, b5 only */}
      {frame >= B5 && (
        <div
          style={{
            position: "absolute",
            left: tokenCenter.x - 16,
            top: tokenCenter.y - 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: P.card,
            border: `2.5px solid ${P.accent}`,
            boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            zIndex: N + 1,
          }}
        >
          ▶
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // b1 — a one-line product plate: who this is, named plainly for a blind viewer.
  const plateT = tween(sec(frame, B1 + 4, fps), 0, 0.3, ease.power3Out);
  const plateOpacity = frame >= B1 && frame < B2 ? plateT : 0;

  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — plays for hours, learns nothing, over the features hub */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ line1: "Plays for hours,", line2: "learns nothing.", keywords: ["hours", "nothing"] }}
      />
      {plateOpacity > 0.004 && (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 28,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(23,18,58,0.8)",
            border: `1.5px solid ${ACCENT}`,
            color: "#F3EEFF",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.3,
            fontFamily,
            opacity: plateOpacity,
            transform: `translateY(${(1 - plateOpacity) * -8}px)`,
          }}
        >
          <span style={{ color: ACCENT, fontWeight: 800 }}>Insulin Simulator</span>
          <span style={{ opacity: 0.85 }}>— built for my son Artem</span>
        </div>
      )}

      {/* b2 — insulin and type 2 never explained, over the feature's own page */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        data={{
          statement: "The simulation ran, unexplained",
          tags: ["Insulin? Never explained", "Type 1 vs Type 2? Unclear", "No pause to teach", "Quizzes, but no lessons"],
        }}
      />

      {/* b3 — archetype only: the five real lesson names (commit 8e55152) unfurl onto the level-map path */}

      {/* b4 — each lesson's own ending, drawn (no live page shows this); the row shrinks to make room */}
      <MotionInsert
        effect="featureMatrix"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        base={STAGE}
        data={{
          options: ["Ends with", "Scored"],
          rows: [
            { label: "4 lessons", values: ["Multiple-choice quiz", "★★★"] },
            { label: "1 lesson", values: ["Hands-on round", "★★★"] },
          ],
        }}
      />

      {/* b5 — archetype only: the token walks the route, five green checks, then the "5 / 5" stamp, holds to the end */}

      <FlowMap />
    </AbsoluteFill>
  );
};

export const FeatureFiveNewMiniLessonsD07: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
