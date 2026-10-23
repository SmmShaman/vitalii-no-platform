// FeatureOneVpsRunnerReplacedE03 — feature e03 — 1280x720, 973 frames @ 30fps, VOICE-SYNCED.
// archetype 1 timeline ribbon, mood slate. RE-SHOOT (feature-motion skill, 2026-10-22):
// same beats, same sentences, same page/hub backdrops as the original split-duel
// cut — only the picture changed.
//
// Timeline ribbon lives center-stage: five slots run left→right, one per beat,
// each landing as a stamp the instant its beat starts — "3 SERVICES" (red) →
// "VPS RUNNER" (green, the three merge into it) → "DOORS CLOSED" → "ONE HUB" →
// the hero number "682". A connecting line fills in behind the lit stamps as
// time passes, so the ribbon always reads as one continuous timeline, never a
// static row — deleting it leaves no timeline to read. Headline stays small,
// bottom-left, never centered, per the archetype.
//
// No LogWindow: there is no runtime log for this product on the VPS, and the
// real page/hub backdrops in b1/b2 already cover "play the real product" — a
// synthetic log would have cost a beat better spent on the ribbon itself.
//
// Wave D viewer fix (2026-10-22): a blind viewer scored clarity 6/9 on this
// cut. Four changes, no beat windows/duration/palette/archetype/narration
// touched: (1) b1/b2 plate raised 0.66 -> 0.85 — the live page's own body
// text was bleeding through behind the CornerTags/HandoffExplain callouts
// and reading as noise; (2) b4's "three jobs" label now says "NEW" and
// spells out old-vs-new explicitly — the viewer conflated it with the
// earlier three OLD services; (3) ProductPlate text enlarged (13->17/14)
// and given its own accent border — it was the only place the product name
// appeared and was too small to register; (4) b3 gets a drawn
// DoorTillSchematic (three doors swinging shut, then a till) so the spoken
// shop/till analogy has a literal picture instead of only restating itself
// in text.
//
// Beat → effect (unchanged from the split-duel cut — only the staging changed):
// b1 15-321   problem: three outside services, a credits bypass running client-side.
//             cornerTags over the feature's own page (backdrop) — central claim
//             plus four short problem tags.
// b2 321-431  the fix lands: one VPS runner replaces all three.
//             handoffExplain over the features hub (backdrop) — before/now +
//             three mechanism points.
// b3 431-588  analogy: every back door closed, every sale passes the till.
//             keywordCaption, drawn (no backdrop) — "door"/"till" carry the accent.
// b4 588-770  mechanism: the three old dependencies route into the one hub, which
//             now routes out to analysis, playlist generation and billing.
//             hubRouting, drawn (no backdrop).
// b5 770-973  payoff: ~1800 lines of fragile edge-function code deleted for good.
//             ratioBars 1796 (old edge functions) vs 682 (new runner) — drawn (no
//             backdrop), holds to the true end. Never shows the page or hub again.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/e03.json";

const B1 = 15;
const B2 = 321;
const B3 = 431;
const B4 = 588;
const B5 = 770;
const END = 973;

/** slate's native accent (#0E7490) reads muddy on a dark stage — brightened for it. */
const ACCENT = "#38BDF8";
const STAGE = "#0B1420";

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

// Ribbon geometry — a horizontal band dominating the frame; five slots, one per
// beat, landing left→right as the story moves forward.
const RIBBON_Y = 330;
const RIBBON_X0 = 140;
const RIBBON_X1 = 1140;
const SLOT_COUNT = 5;
const slotX = (i: number) => RIBBON_X0 + (i * (RIBBON_X1 - RIBBON_X0)) / (SLOT_COUNT - 1);

type Tone = "danger" | "success" | "accent";
const STAMPS: { at: number; end: number; label: string; tone: Tone; hero?: boolean }[] = [
  { at: B1, end: B2, label: "3 SERVICES", tone: "danger" },
  { at: B2, end: B3, label: "VPS RUNNER", tone: "success" },
  { at: B3, end: B4, label: "DOORS CLOSED", tone: "accent" },
  { at: B4, end: B5, label: "ONE HUB", tone: "accent" },
  { at: B5, end: END, label: "682", tone: "success", hero: true },
];

const LABEL_BOX = { x: 40, y: 606, w: 320, h: 80 };
const PLATE_BOX = { x: 672, y: 598, w: 568, h: 110 };

const Ribbon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const toneColor = (tone: Tone) => (tone === "danger" ? P.danger : tone === "success" ? P.success : P.accent);
  const toneBg = (tone: Tone) => (tone === "danger" ? P.dangerBg : tone === "success" ? P.successBg : P.accentBg);
  const toneEdge = (tone: Tone) => (tone === "danger" ? P.dangerEdge : tone === "success" ? P.successEdge : P.accentEdge);

  // active slot index + progress fill from it towards the next slot
  let active = 0;
  for (let i = 0; i < STAMPS.length; i++) if (frame >= STAMPS[i].at) active = i;
  const nextX = active + 1 < SLOT_COUNT ? slotX(active + 1) : slotX(active);
  const segProgress = active + 1 < SLOT_COUNT ? tween(sec(frame, STAMPS[active].at, fps), 0, (STAMPS[active].end - STAMPS[active].at) / fps, ease.sineInOut) : 1;
  const fillX = mix(segProgress, slotX(active), nextX);

  const t = sec(frame, B1, fps);
  const jitter = (seed: number) => Math.sin(t * 2.4 + seed) * 2.5;

  const subChips = [
    { label: "AZURE", seed: 0 },
    { label: "ZVUKOGRAM", seed: 2.1 },
    { label: "STANZA", seed: 4.4 },
  ];
  const chipsDimmed = frame >= B2;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      {/* the band itself, always on once drawn */}
      <div style={{ position: "absolute", left: RIBBON_X0, top: RIBBON_Y - 4, width: RIBBON_X1 - RIBBON_X0, height: 8, borderRadius: 4, background: P.border }} />
      <div style={{ position: "absolute", left: RIBBON_X0, top: RIBBON_Y - 4, width: Math.max(fillX - RIBBON_X0, 0), height: 8, borderRadius: 4, background: P.accentEdge }} />

      {/* stamps land left→right, one per beat, and stay lit once they land */}
      {STAMPS.map((s, i) => {
        if (frame < s.at) return null;
        const x = slotX(i);
        const scale = s.hero ? 1 : punchScale(sec(frame, s.at, fps), 0);
        if (s.hero) {
          // b5 — the hero number, bigger and higher so the frame's top third fills too
          const heroScale = punchScale(sec(frame, s.at, fps), 0);
          return (
            <React.Fragment key={s.label}>
              <div
                style={{
                  position: "absolute",
                  left: x - 16,
                  top: RIBBON_Y - 16,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: toneColor(s.tone),
                  border: `3px solid ${toneEdge(s.tone)}`,
                  boxShadow: `0 0 0 6px ${toneEdge(s.tone)}`,
                  transform: `scale(${heroScale})`,
                  transformOrigin: `${x}px ${RIBBON_Y}px`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x - 220,
                  top: 70,
                  width: 440,
                  height: 160,
                  borderRadius: 10,
                  background: P.card,
                  border: `3px solid ${P.border}`,
                  boxShadow: "8px 8px 0 rgba(0,0,0,0.3)",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily,
                  color: P.ink,
                  transform: `scale(${heroScale})`,
                  transformOrigin: `${x}px 150px`,
                }}
              >
                <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1 }}>682</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8, letterSpacing: 1.2, color: P.muted }}>LINES, DOWN FROM 1,796</div>
              </div>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={s.label}>
            <div
              style={{
                position: "absolute",
                left: x - 15,
                top: RIBBON_Y - 15,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: toneColor(s.tone),
                border: `3px solid ${toneEdge(s.tone)}`,
                boxShadow: `0 0 0 6px ${toneEdge(s.tone)}`,
                transform: `scale(${scale})`,
                transformOrigin: `${x}px ${RIBBON_Y}px`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x - 80,
                top: RIBBON_Y + 26,
                width: 160,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.0,
                color: toneColor(s.tone),
                fontFamily,
              }}
            >
              {s.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* b1's three services, stacked under slot 0, grey out once they merge into VPS RUNNER */}
      {frame < B3 &&
        subChips.map((c, i) => (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: slotX(0) - 52,
              top: RIBBON_Y - 108 + i * 30 + jitter(i),
              padding: "5px 10px",
              borderRadius: 5,
              background: chipsDimmed ? P.chipBg : P.dangerBg,
              border: `1px solid ${chipsDimmed ? P.border : P.dangerEdge}`,
              color: chipsDimmed ? P.muted : P.danger,
              fontFamily,
              fontSize: 12,
              fontWeight: 700,
              opacity: chipsDimmed ? 0.5 : 1,
            }}
          >
            {c.label}
          </div>
        ))}
    </div>
  );
};

const SideLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  const label =
    cut(frame, B1, B2) === 1
      ? "THREE SERVICES, ONE FAILURE"
      : cut(frame, B2, B3) === 1
      ? "ONE RUNNER REPLACES THEM"
      : cut(frame, B3, B4) === 1
      ? "EVERY DOOR CLOSED"
      : cut(frame, B4, B5) === 1
      ? "SAME RUNNER, 3 NEW JOBS"
      : frame >= B5
      ? "RESULT"
      : null;
  if (!label) return null;
  const at = frame >= B5 ? B5 : frame >= B4 ? B4 : frame >= B3 ? B3 : frame >= B2 ? B2 : B1;
  return (
    <Arrive at={at} kind="wipe" box={LABEL_BOX} dur={0.3}>
      <div
        style={{
          position: "absolute",
          left: LABEL_BOX.x,
          top: LABEL_BOX.y,
          width: LABEL_BOX.w,
          height: LABEL_BOX.h,
          background: P.card,
          borderRadius: 4,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1.6, color: P.accent }}>{label}</div>
      </div>
    </Arrive>
  );
};

const ProductPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const P = usePalette();
  if (cut(frame, B1, B2) !== 1) return null;
  return (
    <Arrive at={B1 + 4} kind="wipe" box={PLATE_BOX} dur={0.4}>
      <div
        style={{
          position: "absolute",
          left: PLATE_BOX.x,
          top: PLATE_BOX.y,
          width: PLATE_BOX.w,
          height: PLATE_BOX.h,
          background: P.card,
          borderRadius: 4,
          border: `2px solid ${P.accentEdge}`,
          boxShadow: "6px 6px 0 rgba(0,0,0,0.5)",
          boxSizing: "border-box",
          padding: "12px 22px",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 1.2, color: P.accent }}>🛠 ELVARIKA — TEXT BECOMES A LESSON</div>
        <div style={{ fontSize: 14, color: P.muted, marginTop: 5, lineHeight: 1.3 }}>
          Paste or upload any text — Elvarika turns it into vocabulary and audio playlists.
        </div>
      </div>
    </Arrive>
  );
};

// Wave C fill-fix: keywordCaption/hubRouting/ratioBars each leave the top and bottom
// margins empty until late in their own internal reveal. These bands restate data the
// beat already carries (never new facts) in the top/bottom thirds the effects don't use.
const FillCaption: React.FC<{
  from: number;
  dur: number;
  y: number;
  label?: string;
  chips: string[];
  tone?: "accent" | "success" | "danger";
}> = ({ from, dur, y, label, chips, tone = "accent" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < from || frame >= from + dur) return null;
  const opacity = tween(sec(frame, from, fps), 0, 0.3, ease.power2Out);
  const bg = tone === "success" ? P.successBg : tone === "danger" ? P.dangerBg : P.accentBg;
  const edge = tone === "success" ? P.successEdge : tone === "danger" ? P.dangerEdge : P.accentEdge;
  const fg = tone === "success" ? P.success : tone === "danger" ? P.danger : P.accent;
  return (
    <div style={{ position: "absolute", left: 60, top: y, width: 1160, opacity }}>
      {label && (
        <div style={{ fontFamily, fontSize: 28, fontWeight: 800, color: P.ink, marginBottom: 18 }}>{label}</div>
      )}
      <div style={{ display: "flex", justifyContent: chips.length > 1 ? "space-between" : "flex-start", gap: 16 }}>
        {chips.map((c) => (
          <div
            key={c}
            style={{
              padding: "16px 22px",
              borderRadius: 8,
              background: bg,
              border: `1px solid ${edge}`,
              color: fg,
              fontFamily,
              fontSize: 20,
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};

// Wave D fix: the shop/till analogy (b3) was only spoken and captioned — this draws
// it literally: three labeled doors swing shut in sequence, then a till appears.
const DoorTillSchematic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (cut(frame, B3, B4) !== 1) return null;
  const t = sec(frame, B3, fps);
  const doors = ["AZURE", "ZVUKOGRAM", "STANZA"];
  const centerX = 640;
  const doorW = 150;
  const gap = 36;
  const totalW = doors.length * doorW + (doors.length - 1) * gap;
  const startX = centerX - totalW / 2;
  const doorY = 190;
  const doorH = 110;
  const tillCloseAt = 0.4 + (doors.length - 1) * 0.5 + 0.5;
  const tillP = tween(t, tillCloseAt, 0.35, ease.power3Out);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720 }}>
      {doors.map((label, i) => {
        const closeAt = 0.4 + i * 0.5;
        const closeP = tween(t, closeAt, 0.4, ease.power3Out);
        const x = startX + i * (doorW + gap);
        return (
          <div key={label} style={{ position: "absolute", left: x, top: doorY, width: doorW, height: doorH }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 8,
                border: `3px solid ${closeP > 0.5 ? P.border : P.dangerEdge}`,
                background: closeP > 0.5 ? P.chipBg : P.dangerBg,
                boxSizing: "border-box",
                transform: `scaleX(${mix(closeP, 1, 0.08)})`,
                transformOrigin: "left center",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -26,
                textAlign: "center",
                fontFamily,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                color: closeP > 0.5 ? P.muted : P.danger,
              }}
            >
              {label}
            </div>
            {closeP > 0.85 && (
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>
                🔒
              </div>
            )}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: centerX - 110,
          top: 405,
          width: 220,
          height: 70,
          borderRadius: 8,
          background: P.successBg,
          border: `3px solid ${P.successEdge}`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: tillP,
          transform: `scale(${mix(tillP, 0.85, 1)})`,
          fontFamily,
        }}
      >
        <span style={{ fontSize: 22 }}>🧾</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: P.success, letterSpacing: 0.8 }}>EVERY SALE → TILL</span>
      </div>
    </div>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="cornerTags"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.85}
        data={{
          statement: "Three outside services — one failure stalled a lesson",
          tags: ["Any service breaks it", "Billing ran in browser", "Replay = free ride", "Cost on every request"],
        }}
      />

      {/* b2 — the fix lands, over the features hub */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="handoffExplain"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.85}
        data={{
          from: "Three outside services",
          to: "One VPS runner",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["Analysis + playlist, one process", "Credits charged only server-side", "Jobs queue, Postgres trigger wakes it"],
        }}
      />

      {/* b3 — the till analogy, drawn */}
      <MotionInsert
        effect="keywordCaption"
        from={B3}
        dur={B4 - B3}
        accent={ACCENT}
        data={{
          line1: "Every back door closed — every sale passes the till.",
          keywords: ["door", "till"],
        }}
      />
      <FillCaption from={B3} dur={B4 - B3} y={40} label="Three doors, closed" chips={["Azure analysis", "Zvukogram TTS", "Stanza NLP"]} tone="danger" />
      <DoorTillSchematic />
      <FillCaption from={B3} dur={B4 - B3} y={500} chips={["Every sale passes the VPS runner"]} tone="success" />

      {/* b4 — the mechanism, drawn */}
      <MotionInsert
        effect="hubRouting"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        data={{
          inputs: ["Azure analysis", "Zvukogram TTS", "Stanza NLP"],
          hub: "VPS runner",
          outputs: ["Analysis", "Playlist gen", "Billing"],
        }}
      />
      <FillCaption from={B4} dur={B5 - B4} y={40} label="Old 3 services → 3 new internal jobs" chips={["Analysis", "Playlist gen", "Billing"]} tone="success" />
      <FillCaption from={B4} dur={B5 - B4} y={500} chips={["Postgres trigger wakes it — no idle cost"]} tone="accent" />

      {/* b5 — the payoff, drawn, holds to the true end */}
      <MotionInsert
        effect="ratioBars"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        data={{
          title: "Code deleted",
          a: { label: "Old edge functions", value: 1796 },
          b: { label: "New runner", value: 682 },
          unit: "lines",
          caption: "Three services, one file",
        }}
      />
      <FillCaption from={B5} dur={END - B5} y={40} label="1,796 lines → 682 lines" chips={["Old edge functions", "New runner"]} tone="accent" />
      <FillCaption from={B5} dur={END - B5} y={500} chips={["≈2.6× smaller — three services, one file"]} tone="success" />

      <Ribbon />
      <SideLabel />
      <ProductPlate />
    </AbsoluteFill>
  );
};

export const FeatureOneVpsRunnerReplacedE03: React.FC = () => (
  <PaletteProvider value={MOODS.slate}>
    <Inner />
  </PaletteProvider>
);
