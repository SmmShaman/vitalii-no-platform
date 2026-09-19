/**
 * FeatureWallCardStopsBeingB52 — feature b52 — 1280x720, 910 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 2 (zoom-in), mood sand. The camera starts wide on the features
 * hub, then keeps pushing in — into the feature's own page, then deeper into
 * its diagram examples, then into the result strip — across the three beats
 * that record the real product; beat 2 is the retired flat card, drawn as a
 * metaphor since the live site no longer shows it (STEP 0c). Motion is
 * camera, not fade.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–217  "My son looked at his study card and said, 'I see no change' — every subject was the same wall of text."
 *  b2 226–380  "A big question, a big answer, a rule underneath — nothing worth looking at."
 *  b3 389–514  "I rebuilt it in React to draw a real diagram from that same data."
 *  b4 523–722  "Compound words split apart now, math steps get their own layout, grammar rules sit in a fixed footer."
 *  b5 731–865  "The card now draws through thirty templates across six diagram styles." — holds to 910.
 *
 * Single tech name in the whole clip: React (beat 3 chip only).
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/b52.json";

const P = MOODS.sand;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const WIN_WIDE: Win = { x: 150, y: 150, w: 980, h: 470 };
const WIN_TIGHT: Win = { x: 260, y: 120, w: 760, h: 520 };

export const FeatureWallCardStopsBeingB52: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (audio-measured, do not shift) ────────────────────
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 217, 233));
  const b2 = seg(frame, 226, 242) * (1 - seg(frame, 380, 396));
  const b3 = seg(frame, 389, 405) * (1 - seg(frame, 514, 530));
  const b4 = seg(frame, 523, 539) * (1 - seg(frame, 722, 738));
  const b5 = seg(frame, 731, 747); // holds through 910

  // beat 4: the three drawn labels slide up into place (not a plain crossfade)
  const slideUp4 = interpolate(frame, [523, 553], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const chipPop = pop(430);
  const labelPop1 = pop(540);
  const labelPop2 = pop(575);
  const labelPop3 = pop(610);

  // beat 5: the final push-in number
  const heroPop5 = pop(731);
  const hero30 = Math.min(1, heroPop5 + 0.6);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : wide view, one wall, every subject the same ---------------- */}
        <Group opacity={b1}>
          <div style={{ position: "absolute", left: 0, top: 40, width: 1280, textAlign: "center", fontSize: 24, fontWeight: 700, color: P.ink, opacity: b1 }}>
            "I see no change." — every subject, one wall of text.
          </div>
          <StatPill x={70} y={630} emoji="😐" text="Same flat card, no matter the subject" tone="danger" opacity={b1} />
          <CaptionBand y={680} text="A wall of study cards, all printed the same" tone="danger" opacity={b1} />
        </Group>
        <LiveWindow
          file={shots}
          shot="hub"
          title="vitalii.no/features"
          from={15}
          hold={218}
          zoom={(t) => 1 + 0.05 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={b1}
          win={WIN_WIDE}
        />

        {/* ---------------- beat 2 : the flat card, drawn (retired state) ---------------- */}
        <Group opacity={b2}>
          <div style={{ position: "absolute", left: 0, top: 60, width: 1280, textAlign: "center", fontSize: 24, fontWeight: 700, color: P.ink, opacity: b2 }}>
            A question. An answer. A rule underneath.
          </div>
          <Panel x={390} y={150} w={500} h={330} tone="danger" opacity={1}>
            <div style={{ padding: "26px 30px" }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: P.muted, letterSpacing: 1.4 }}>QUESTION</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: P.ink, marginTop: 8 }}>7 + 5 = ?</div>
              <div style={{ height: 1.5, background: P.dangerEdge, margin: "22px 0" }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: P.muted, letterSpacing: 1.4 }}>ANSWER</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: P.ink, marginTop: 8 }}>12</div>
              <div style={{ height: 1.5, background: P.dangerEdge, margin: "22px 0" }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: P.muted, letterSpacing: 1.4 }}>RULE</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: P.danger, marginTop: 8 }}>Add straight across.</div>
            </div>
          </Panel>
          <CaptionBand y={646} text="Same layout for a compound word, a fraction, a verb" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the fix, zoomed into the real diagram card ---------------- */}
        <Group opacity={b3}>
          <StatPill x={70} y={70} emoji="🔀" text="Same data, drawn as a real diagram" tone="accent" opacity={b3} />
          <CaptionBand y={680} text="React draws the shape the answer actually has" tone="accent" opacity={b3} />
          <FilterChip x={70} y={130} text="React" icon="⚛" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-b52"
          from={389}
          hold={141}
          zoom={(t) => 1 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b3}
          win={WIN_TIGHT}
        />

        {/* ---------------- beat 4 : three template families, live backdrop + drawn labels ---------------- */}
        <Group opacity={b4} dy={slideUp4}>
          <div style={{ position: "absolute", left: 70, top: 70, display: "flex", flexDirection: "column", gap: 14, opacity: Math.min(1, labelPop1) }}>
            <StatPill x={0} y={0} emoji="🔤" text="Compound words split apart" tone="accent" opacity={Math.min(1, labelPop1)} />
          </div>
          <div style={{ position: "absolute", left: 70, top: 130, opacity: Math.min(1, labelPop2) }}>
            <StatPill x={0} y={0} emoji="➗" text="Math steps get their own layout" tone="accent" opacity={Math.min(1, labelPop2)} />
          </div>
          <div style={{ position: "absolute", left: 70, top: 190, opacity: Math.min(1, labelPop3) }}>
            <StatPill x={0} y={0} emoji="📐" text="Grammar rules sit in a fixed footer" tone="accent" opacity={Math.min(1, labelPop3)} />
          </div>
          <CaptionBand y={680} text="Thirty templates, one for each shape of answer" tone="accent" opacity={b4} />
        </Group>
        <LiveWindow
          file={shots}
          shot="detail"
          title="vitalii.no/features/…-b52"
          from={523}
          hold={215}
          zoom={(t) => 1 + 0.12 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={b4}
          win={WIN_TIGHT}
        />

        {/* ---------------- beat 5 : the result, zoomed in furthest ---------------- */}
        <Group opacity={b5}>
          <div style={{ position: "absolute", left: 150, top: 40, width: 470, opacity: hero30 }}>
            <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 800, letterSpacing: -4, color: P.success, fontVariantNumeric: "tabular-nums" }}>30</div>
            <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>TEMPLATES ACROSS SIX DIAGRAM STYLES</div>
          </div>
          <CheckBadge x={640} y={50} size={44} opacity={b5} scale={heroPop5} />
          <CaptionBand y={680} text="Verified live: a framed card, a composition badge, a rule that renders" tone="success" opacity={b5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="result"
          title="vitalii.no/features/…-b52"
          from={731}
          hold={179}
          zoom={(t) => 1 + 0.14 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={b5}
          win={WIN_TIGHT}
        />
      </div>
    </PaletteProvider>
  );
};
