// FeatureMuseumArchivesAlongRouteG21 — feature g21 — 1280x720, 932 frames @ 30fps, VOICE-SYNCED.
// archetype 3 card-deck, mood mint. RE-SHOOT 2026-11-03: narration and beat windows are
// UNCHANGED (same measured B1..END below) — only the picture changes. The prior pass staged
// archetype 2 (a zoom-in reticle, mood violet); this pass draws a deck of six cards that
// never cuts away — it is a closed pile in b1, scatters into rejected distance tags in b2,
// fans out to scan the archive in b3, splits into two sub-piles in b4, and settles into one
// flat, even row holding the final number in b5. b1 also drops cornerTags (used by e01
// tonight) for keywordCaption instead.
//
// Beat → effect (data only from the feature row, meta-g21.json, no invented numbers):
// b1 15-189   "Kilometers of road went by with nothing to say — real history sat just out
//             of reach." keywordCaption over the feature's own page (LiveBackdrop). Deck:
//             six cards held in a tight closed pile, unlabeled — nothing to say yet.
// b2 189-323  "The places the app already knew were too far off to ever surface it."
//             targetOverrun, base stage only. Deck: the pile breaks apart into a loose
//             scatter, each card now showing the distance that got it rejected (430-610m,
//             all past the 150m reach).
// b3 323-523  "Now it checks DigitaltMuseum's archive — old photographs, museum records —
//             for anything near the track." pipelineFlow, base stage only, plus a gloss
//             caption for the one tech name and the step/result cards already vetted in the
//             prior pass. Deck: the scatter fans out into an arc — "scanning" the archive.
// b4 523-787  "A find near a known place joins its story. A find with nothing nearby becomes
//             a brand-new stop, named after the farm it came from." featureMatrix over a
//             worker LogWindow (no runtime log exists for this product; lines paraphrased
//             straight from meta-g21.json, not invented). Deck: the fan splits into two
//             tight sub-piles — "existing" vs "new stop" — mirroring the matrix's own columns.
// b5 787-932  "The reach: 150 meters off the road." titleTakeover, base stage only (gate:
//             last beat never ends on the feature page or the hub). Deck: the two sub-piles
//             settle into one flat, evenly spaced row, every card holding "150m" — the result
//             that stuck — while the two reach callouts (600m -> 150m, already used in b2)
//             land staggered so the closing beat still visibly builds.
//
// Persistent element: the card deck (archetype 3) — six cards, continuously interpolated
// across all five beats (one re-shuffle, not five cuts) in the y>=596 band the editorial
// effects keep clear; only the text ON the cards switches discretely at each beat boundary.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, IconCard, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { LogWindow, track } from "./live-primitives";
import shotsFile from "./shots/g21.json";

const B1 = 15;
const B2 = 189;
const B3 = 323;
const B4 = 523;
const B5 = 787;
const END = 932;

/** mint's raw accent (#0B7A5A) reads too dark on the dark plate — brighter override. */
const ACCENT = "#22D3A6";
const STAGE = "#0D2019";

// Card-deck band (1280x720, below the effects' safe bottom at y≈587).
const BAND = { x: 40, y: 596, w: 1200, h: 118 };
const TRACK_X = 350;
const TRACK_W = 850;
const CARD_COUNT = 6;

type Pos = { x: number; y: number; rot: number };
const pos = (frac: number, y: number, rot: number): Pos => ({ x: TRACK_X + frac * TRACK_W, y, rot });

// Five hand-placed states, one per beat — a closed pile, a rejected-distance scatter, a
// scanning fan, a two-pile split, and a settled even row. END repeats SETTLE so the deck
// does not keep drifting after the voice ends.
const PILE: Pos[] = [0.08, 0.09, 0.1, 0.11, 0.12, 0.13].map((f, i) => pos(f, 655 - i * 3, -10 + i * 4));
const CLUSTER: Pos[] = [0.05, 0.17, 0.3, 0.45, 0.6, 0.75].map((f, i) =>
  pos(f, i % 2 === 0 ? 641 : 669, -25 + i * 9)
);
const FAN: Pos[] = [0.275, 0.365, 0.455, 0.545, 0.635, 0.725].map((f, i) =>
  pos(f, 655 - (2.5 - Math.abs(i - 2.5)) * 5, -30 + i * 12)
);
const SPLIT: Pos[] = [0.08, 0.16, 0.24, 0.62, 0.7, 0.78].map((f, i) => pos(f, 655, i < 3 ? -8 + i * 8 : -8 + (i - 3) * 8));
const SETTLE: Pos[] = [0.03, 0.218, 0.406, 0.594, 0.782, 0.97].map((f) => pos(f, 655, 0));

const CARD_TRACKS: number[][][] = Array.from({ length: CARD_COUNT }, (_, i) => [
  [B1, PILE[i].x, PILE[i].y, PILE[i].rot],
  [B2, CLUSTER[i].x, CLUSTER[i].y, CLUSTER[i].rot],
  [B3, FAN[i].x, FAN[i].y, FAN[i].rot],
  [B4, SPLIT[i].x, SPLIT[i].y, SPLIT[i].rot],
  [B5, SETTLE[i].x, SETTLE[i].y, SETTLE[i].rot],
  [END, SETTLE[i].x, SETTLE[i].y, SETTLE[i].rot],
]);

type StampTone = "neutral" | "danger" | "accent" | "success";
const CARD_LABELS: (string | null)[][] = [
  [null, null, null, null, null, null],
  ["610m", "540m", "480m", "430m", "500m", "600m"],
  ["scan", "match?", "scan", "match?", "scan", "match?"],
  ["existing", "existing", "existing", "new stop", "new stop", "new stop"],
  ["150m", "150m", "150m", "150m", "150m", "150m"],
];
const CARD_TONE: StampTone[][] = [
  ["neutral", "neutral", "neutral", "neutral", "neutral", "neutral"],
  ["danger", "danger", "danger", "danger", "danger", "danger"],
  ["accent", "accent", "accent", "accent", "accent", "accent"],
  ["accent", "accent", "accent", "success", "success", "success"],
  ["success", "success", "success", "success", "success", "success"],
];
const KICKERS = ["PILE", "SCATTERED", "SCANNING", "SPLIT", "SETTLED"];
const HEADLINES = [
  "Guide — Stories on the Road, read while driving",
  "Known places sit too far off the track to surface",
  "DigitaltMuseum's archive checked against the track",
  "Each find joins a place nearby — or becomes a new one",
  "150 meters off the road — nothing near it is missed",
];

const CardDeck: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (frame < B1) return null;
  const beatIndex = frame >= B5 ? 4 : frame >= B4 ? 3 : frame >= B3 ? 2 : frame >= B2 ? 1 : 0;
  const labels = CARD_LABELS[beatIndex];
  const tones = CARD_TONE[beatIndex];

  const toneColor = (tone: StampTone) =>
    tone === "danger"
      ? { fg: P.danger, bg: P.dangerBg, edge: P.dangerEdge }
      : tone === "accent"
      ? { fg: P.accent, bg: P.accentBg, edge: P.accentEdge }
      : tone === "success"
      ? { fg: P.success, bg: P.successBg, edge: P.successEdge }
      : { fg: P.muted, bg: P.chipBg, edge: P.border };

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={BAND} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: BAND.x,
            top: BAND.y,
            width: BAND.w,
            height: BAND.h,
            background: P.card,
            borderRadius: 4,
            boxShadow: "6px 6px 0 rgba(0,0,0,0.55)",
          }}
        />
        <div style={{ position: "absolute", left: BAND.x + 22, top: BAND.y + 16, width: 260 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2.2, color: P.accent }}>{KICKERS[beatIndex]}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: P.ink, marginTop: 4, lineHeight: 1.25 }}>{HEADLINES[beatIndex]}</div>
        </div>

        {CARD_TRACKS.map((trk, i) => {
          const [x, y, rot] = track(trk, frame);
          const { fg, bg, edge } = toneColor(tones[i]);
          const label = labels[i];
          const emphasize = beatIndex === 4 && i === CARD_COUNT - 1;
          const w = emphasize ? 84 : 72;
          const h = emphasize ? 104 : 90;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                borderRadius: 8,
                background: label ? bg : P.chipBg,
                border: `2px solid ${label ? edge : P.border}`,
                transform: `rotate(${rot}deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: emphasize ? 15 : 12,
                fontWeight: 800,
                color: fg,
                boxShadow: "3px 3px 0 rgba(0,0,0,0.35)",
              }}
            >
              {label ?? ""}
            </div>
          );
        })}
      </Arrive>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — real history out of reach, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} push={0.14} />}
      <MotionInsert
        effect="keywordCaption"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{
          line1: "Kilometers of road went by with nothing to say",
          line2: "real history sat just out of reach",
          keywords: ["nothing to say", "just out of reach"],
        }}
      />
      {/* product-line plate, carried for the length of b1 — plain text, not a competing effect */}
      {frame >= B1 && frame < B2 && (
        <div style={{ position: "absolute", left: 90, top: 28, fontSize: 18, fontWeight: 750, color: "#DFF7EC", fontFamily }}>
          🧭 Guide — Stories on the Road — a personal audio guide for driving: the phone knows
          where I am and plays short stories about the places around me, in Norwegian and
          Ukrainian side by side.
        </div>
      )}

      {/* b2 — known places were too far off to ever surface it, base stage only */}
      <MotionInsert
        effect="targetOverrun"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          label: "Known places, distance off the road",
          value: 600,
          target: 150,
          unit: "m",
          note: "Up to 600m off the road — too far for the 150m reach",
        }}
      />

      {/* b3 — DigitaltMuseum archive check, drawn mechanism (no public UI for the match itself) */}
      <MotionInsert
        effect="pipelineFlow"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        base={STAGE}
        data={{
          steps: ["Walk the drive track", "Check DigitaltMuseum", "Match finds near track"],
          result: "Real history surfaces",
          system: "DigitaltMuseum",
        }}
      />
      {/* a legible gloss, outside pipelineFlow's own frame-title clip() */}
      {frame >= B3 && frame < B4 && (
        <div style={{ position: "absolute", left: 90, top: 28, fontSize: 18, fontWeight: 750, color: "#DFF7EC", fontFamily, width: 900 }}>
          🏛 DigitaltMuseum — Norway's national museum archive of old photographs and local records
        </div>
      )}
      {frame >= B3 && frame < B4 && (
        <>
          <IconCard x={90} y={70} w={300} emoji="📍" title="Known places" sub="already on the map" tone="accent" />
          <IconCard x={640} y={70} w={300} emoji="🚶" title="Walk the drive track" sub="step one" tone="accent" />
          <IconCard x={890} y={70} w={300} emoji="🏛" title="DigitaltMuseum" sub="museum archive" tone="accent" />
          <StatPill x={110} y={590} emoji="🗺" text="Match finds near track" tone="accent" />
          <StatPill x={700} y={590} emoji="✅" text="Real history surfaces" tone="success" />
        </>
      )}

      {/* b4 — join existing place or become a new stop; no runtime log exists, so the worker
          window shows real behaviour paraphrased from the feature's own description. */}
      {cut(frame, B4, B5) === 1 && (
        <LogWindow
          win={{ x: 150, y: 150, w: 980, h: 430 }}
          title="archive match worker"
          from={B4 + 10}
          every={16}
          opacity={1}
          lines={[
            { text: "find within 150m of drive track", tone: "muted" },
            { text: "known place nearby? check radius", tone: "muted" },
            { text: "yes -> append to that place's story", tone: "accent" },
            { text: "no -> create new place", tone: "accent" },
            { text: "name new place after the farm it came from", tone: "muted" },
            { text: "flows into the normal story pipeline", tone: "muted" },
            { text: "catalog gains a confirmed stop", tone: "success" },
          ]}
        />
      )}
      <MotionInsert
        effect="featureMatrix"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          options: ["Near a known place", "Nothing nearby"],
          rows: [
            { label: "Becomes", values: ["Joins its story", "New stop"] },
            { label: "Named after", values: ["the existing place", "the farm"] },
          ],
        }}
      />

      {/* b5 — the reach, no page or hub behind it — the deck settles onto this result */}
      <MotionInsert
        effect="titleTakeover"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        base={STAGE}
        data={{ title: "150 meters off the road", kicker: "History, no longer out of reach" }}
      />
      {frame >= B5 && frame < END && (
        <>
          <Arrive at={B5 + 15} kind="rise" box={{ x: 110, y: 100, w: 320, h: 56 }}>
            <StatPill x={110} y={100} emoji="📍" text="Old reach: 600 m" tone="accent" opacity={0.75} />
          </Arrive>
          <Arrive at={B5 + 45} kind="rise" box={{ x: 760, y: 100, w: 320, h: 56 }}>
            <StatPill x={760} y={100} emoji="✅" text="New reach: 150 m" tone="success" />
          </Arrive>
        </>
      )}

      <CardDeck />
    </AbsoluteFill>
  );
};

export const FeatureMuseumArchivesAlongRouteG21: React.FC = () => (
  <PaletteProvider value={MOODS.mint}>
    <Inner />
  </PaletteProvider>
);
