// FeatureOnlyAppsCountAsB69 — feature b69 — 1280x720, 897 frames @ 30fps, VOICE-SYNCED.
// archetype 2 zoom-in, mood violet. Motion direction v2 (feature-motion skill, 2026-10-07).
//
// One editorial effect per sentence, chosen by what changes on screen, over the
// real product's own write-up as evidence where there is one, one owner of the
// frame, a reading hold at the end of every beat, cuts not fades.
//
// Beat → effect (data only from the feature row and commit 875a550):
// b1 15-160   "Every new app ... quietly counted as free TV time."
//             titleTakeover over the feature's own page (backdrop). The lower
//             third opens on a wide view of the kiosk's app grid — nothing
//             singled out yet — with a small plate naming the product.
// b2 160-331  "The old rule only gated apps I already knew; anything unfamiliar
//             defaulted to free."
//             cornerTags: the claim + four facts from problem_en, over the page
//             scrolled further. The zoom starts: camera pushes toward the known
//             cluster of app tiles.
// b3 331-452  "Like a guard who only recognizes faces he's already met."
//             drawn (metaphor, no catalog effect) — two badges, a known face and
//             an unknown one waved through as free.
// b4 452-635  "So I flipped it: only three plain apps stay free, everything else
//             now needs the bonus."
//             handoffExplain over vitalii.no/features (hub) as evidence the
//             write-up exists. The zoom lands tight on the three-app allow list;
//             the single tech caption (GuardService.java) is the point that
//             matches this beat's commit, 875a550.
// b5 635-852  "I applied that rule across every device ... four places now."
//             statusFocus: the rule holding in three new surfaces (Android
//             overlay, Termux + Home PC bridge) plus the kiosk's own pre-existing
//             gate — camera is now at its tightest, all four device chips lit.
//             Holds to the end, no fade.
//
// Persistent element: the zoom-in lower third (archetype 2) — a mock kiosk app
// grid the camera pushes into, and a row of four device chips that light up as
// the rule reaches each surface, b1 through b5.
// Effects keep the bottom 200/1080 px clear (look.safeBottom) — that is where
// the lower third sits.
//
// Gate 2: the clip does NOT end on the feature's own page or the hub — b5 has
// no LiveBackdrop at all, only the drawn statusFocus result and the lower third.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut } from "./motion-primitives";
import { tween, ease, mix, punchScale } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/b69.json";

const B1 = 15;
const B2 = 160;
const B3 = 331;
const B4 = 452;
const B5 = 635;
const END = 897;

/** Brighter than violet's #5B37D4 so it reads on the dark plate. */
const ACCENT = "#8C6FF5";
const STAGE = "#140F26";

// Lower third geometry (1280×720, below the effects' safe bottom at y≈587).
const LT = { x: 40, y: 606, w: 1200, h: 92 };
const GRID_X = LT.x + 20;
const GRID_Y = LT.y + 14;
const GRID_W = 230;
const GRID_H = 64;
const CHIP_ROW_X = GRID_X + GRID_W + 46;
const CHIP_W = 196;
const CHIP_H = 64;
const CHIP_GAP = 16;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type AppTile = { label: string; known: boolean };
const APPS: AppTile[] = [
  { label: "NRK", known: true },
  { label: "Prisma", known: true },
  { label: "Kyivstar", known: true },
  { label: "App A", known: false },
  { label: "App B", known: false },
  { label: "App C", known: false },
];

type Device = { label: string; icon: string };
const DEVICES: Device[] = [
  { label: "TV kiosk", icon: "📺" },
  { label: "Android overlay", icon: "🤖" },
  { label: "Termux phone", icon: "📱" },
  { label: "Home PC bridge", icon: "🖥" },
];

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  // Camera push: wide (b1) → known cluster (b2) → allow-list, tight (b4) → tightest (b5).
  const h1 = tween(sec(frame, B2 + 20, fps), 0, 0.5, ease.power3InOut);
  const h2 = tween(sec(frame, B4 + 20, fps), 0, 0.5, ease.power3InOut);
  const h3 = tween(sec(frame, B5 + 20, fps), 0, 0.5, ease.power3InOut);
  const scale = mix(h3, mix(h2, mix(h1, 1.0, 1.18), 1.42), 1.6);
  const originX = mix(h2, 0.5, 0.18);
  const originY = 0.5;

  const flipped = frame >= B4;
  const label = flipped ? "ONLY 3 STAY FREE" : "ANY NEW APP = FREE";
  const sub = flipped ? "everything else needs the bonus" : "silent by default";

  // Device chips: TV kiosk was already gated; the other three light up as
  // commit 875a550 reaches each surface.
  const litAt = [0, B4 + 40, B4 + 100, B5];
  const chipGlow = (i: number) => (frame >= litAt[i] ? pop0(frame, litAt[i], fps) : 0);
  const pop0 = (f: number, at: number, fps2: number) => punchScale(sec(f, at, fps2), 0) - 1;

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
      </Arrive>

      {/* product plate, b1 only */}
      {cut(frame, B1, B2) === 1 && (
        <div style={{ position: "absolute", left: LT.x + 14, top: LT.y - 30, fontSize: 13, fontWeight: 800, letterSpacing: 1.6, color: "#F5F5F5" }}>
          BOYTASKS <span style={{ fontWeight: 500, opacity: 0.8 }}>· screen-time &amp; tasks, 3 kids</span>
        </div>
      )}

      {/* zoom-in mock kiosk app grid */}
      <div
        style={{
          position: "absolute",
          left: GRID_X,
          top: GRID_Y,
          width: GRID_W,
          height: GRID_H,
          overflow: "hidden",
          borderRadius: 4,
          border: `2px dashed ${P.accentEdge}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: GRID_W - 12,
            height: GRID_H - 10,
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: `${originX * 100}% ${originY * 100}%`,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
          }}
        >
          {APPS.map((a, i) => {
            const relevant = a.known;
            const tone = flipped ? (relevant ? P.success : P.danger) : P.muted;
            const bg = flipped ? (relevant ? P.successBg : P.dangerBg) : P.chipBg;
            return (
              <div
                key={a.label}
                style={{
                  background: bg,
                  border: `1.5px solid ${tone}`,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 800,
                  color: tone,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {a.label}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: GRID_X, top: GRID_Y + GRID_H + 4, width: GRID_W, fontSize: 12, fontWeight: 800, color: flipped ? P.success : P.danger, whiteSpace: "nowrap" }}>
        {label}
      </div>
      <div style={{ position: "absolute", left: GRID_X, top: GRID_Y + GRID_H + 20, width: GRID_W, fontSize: 11, fontWeight: 600, color: P.muted, whiteSpace: "nowrap" }}>
        {sub}
      </div>

      {/* four device chips, lighting up as the rule reaches each surface */}
      {DEVICES.map((d, i) => {
        const glow = chipGlow(i);
        const lit = frame >= litAt[i];
        return (
          <div
            key={d.label}
            style={{
              position: "absolute",
              left: CHIP_ROW_X + i * (CHIP_W / 2.6 + CHIP_GAP),
              top: LT.y + 14,
              width: CHIP_W / 2.6,
              height: CHIP_H,
              borderRadius: 4,
              background: lit ? P.successBg : P.chipBg,
              border: `1.5px solid ${lit ? P.success : P.border}`,
              transform: `scale(${1 + Math.max(0, glow) * 0.08})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            <div>{d.icon}</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: lit ? P.success : P.muted, textAlign: "center", lineHeight: 1.1, marginTop: 2 }}>{d.label}</div>
          </div>
        );
      })}
      {frame >= B5 && (
        <div
          style={{
            position: "absolute",
            left: CHIP_ROW_X,
            top: LT.y - 20,
            fontSize: 12,
            fontWeight: 800,
            color: P.success,
            opacity: tween(sec(frame, B5, fps), 0, 0.3, ease.power2Out),
          }}
        >
          SAME RULE, ×4
        </div>
      )}
    </div>
  );
};

/** b3 — "a guard who only recognizes faces he's already met." Drawn, no catalog effect.
    Two big labelled panels pushed to the frame's edges (not two small icons adrift in the
    middle) so the canvas reads full even with no backdrop and no lower-third zoom. */
const GuardMetaphor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (cut(frame, B3, B4) !== 1) return null;
  const t = sec(frame, B3, fps);
  const leftIn = tween(t, 0.15, 0.3, ease.power3Out);
  const rightIn = tween(t, 0.4, 0.3, ease.power3Out);
  const arrowIn = tween(t, 0.7, 0.3, ease.power2Out);
  const captionIn = tween(t, 0.9, 0.3, ease.power2Out);

  const CARD_W = 400;
  const CARD_H = 360;
  const CARD_Y = 110;
  const LEFT_X = 90;
  const RIGHT_X = 1280 - 90 - CARD_W;

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 42%, rgba(30,20,60,0.5), rgba(0,0,0,0.25))" }}>
      <div
        style={{
          position: "absolute",
          left: LEFT_X,
          top: CARD_Y,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 16,
          background: "rgba(143,227,176,0.08)",
          border: "2px solid rgba(143,227,176,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: leftIn,
          transform: `translateY(${mix(leftIn, 24, 0)}px)`,
        }}
      >
        <div style={{ fontSize: 120 }}>🪪</div>
        <div style={{ marginTop: 16, fontSize: 30, fontWeight: 800, color: "#8FE3B0", letterSpacing: 1 }}>FACE I KNOW</div>
        <div style={{ marginTop: 6, fontSize: 17, fontWeight: 600, color: "#CFCCE0" }}>recognized · gated</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: RIGHT_X,
          top: CARD_Y,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 16,
          background: "rgba(242,193,119,0.08)",
          border: "2px solid rgba(242,193,119,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: rightIn,
          transform: `translateY(${mix(rightIn, 24, 0)}px)`,
        }}
      >
        <div style={{ fontSize: 120 }}>❓</div>
        <div style={{ marginTop: 16, fontSize: 30, fontWeight: 800, color: "#F2C177", letterSpacing: 1 }}>NEW FACE</div>
        <div style={{ marginTop: 6, fontSize: 17, fontWeight: 600, color: "#CFCCE0" }}>never seen · waved through</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: LEFT_X + CARD_W,
          top: CARD_Y + CARD_H / 2 - 24,
          width: RIGHT_X - (LEFT_X + CARD_W),
          textAlign: "center",
          fontSize: 22,
          fontWeight: 800,
          color: "#F2C177",
          opacity: arrowIn,
        }}
      >
        → FREE
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: CARD_Y + CARD_H + 40,
          width: 1280,
          textAlign: "center",
          fontSize: 28,
          fontWeight: 700,
          color: "#F5F5F5",
          opacity: captionIn,
        }}
      >
        Like a guard who only recognizes faces he's already met
      </div>
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the problem, over the feature's own page */}
      {cut(frame, B1, B2) === 1 && <LiveBackdrop file={shotsFile} shot="page" from={B1} hold={B2 - B1} />}
      <MotionInsert
        effect="titleTakeover"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        data={{ title: "New App, Free TV", kicker: "Installed quietly, counted as plain time by default" }}
      />

      {/* b2 — the old rule's blind spot (problem_en) */}
      {cut(frame, B2, B3) === 1 && <LiveBackdrop file={shotsFile} shot="page2" from={B2} hold={B3 - B2} />}
      <MotionInsert
        effect="cornerTags"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.7}
        data={{
          statement: "Only known apps were ever gated",
          tags: ["Unknown app = free", "No manual review", "Silent by default", "Same for every app"],
        }}
      />

      {/* b3 — the metaphor, fully drawn */}
      <GuardMetaphor />

      {/* b4 — the fix, over vitalii.no/features as evidence the write-up exists */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} focus={{ x: 0.5, y: 0.3 }} />}
      <MotionInsert
        effect="handoffExplain"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.7}
        data={{
          from: "Unfamiliar app = free",
          to: "Only 3 apps stay free",
          fromLabel: "BEFORE",
          toLabel: "NOW",
          points: ["NRK, Prisma, Kyivstar only", "Every other app needs the bonus", "GuardService.java enforces it"],
        }}
      />

      {/* b5 — the result, drawn only (no page/hub), holds to the end */}
      <MotionInsert
        effect="statusFocus"
        from={B5}
        dur={END - B5}
        accent={ACCENT}
        plate={0.7}
        base={STAGE}
        data={{
          title: "Same rule, four places",
          claims: [
            { text: "TV kiosk gate", verdict: "yes" },
            { text: "Android overlay guard", verdict: "yes" },
            { text: "Termux + Home PC bridge", verdict: "yes" },
          ],
        }}
      />

      <LowerThird />
    </AbsoluteFill>
  );
};

export const FeatureOnlyAppsCountAsB69: React.FC = () => (
  <PaletteProvider value={MOODS.violet}>
    <Inner />
  </PaletteProvider>
);
