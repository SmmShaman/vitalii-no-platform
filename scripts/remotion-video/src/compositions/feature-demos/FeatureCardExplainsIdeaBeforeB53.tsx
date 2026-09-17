/**
 * FeatureCardExplainsIdeaBeforeB53 — feature b53 — 1280x720, 1028 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 2 (zoom-in), mood slate. The camera starts wide on the features
 * hub, then keeps pushing in — into the feature's own page, then into its
 * result section — across the three beats that record the real product;
 * the two beats in between are metaphor (the shaded quarter-bar) and
 * invisible plumbing (the research agents + verification gate), so they
 * stay drawn per STEP 0c. Motion is camera, not fade.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15–230  "My son writes a math question. The old system matched a template to its shape and printed a card — no explanation."
 *  b2 239–393  "A kid who doesn't know a quarter equals 25% learns nothing from a shaded bar."
 *  b3 402–605  "Now every card explains the idea first, names the misconception it fights, then shows one example."
 *  b4 614–790  "AI agents dig up the real teaching method with a source attached — no citation, no card."
 *  b5 799–983  "Nine verified teaching ideas live on the wall now, each traceable to a real source." — holds to 1028.
 *
 * Single tech name in the whole clip: TypeScript (beat 4 chip only, the verification script).
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
import shots from "./shots/b53.json";

const P = MOODS.slate;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const WIN_WIDE: Win = { x: 150, y: 150, w: 980, h: 470 };
const WIN_TIGHT: Win = { x: 260, y: 120, w: 760, h: 520 };

export const FeatureCardExplainsIdeaBeforeB53: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ── Beat windows (audio-measured, do not shift) ────────────────────
  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 230, 246));
  const b2 = seg(frame, 239, 255) * (1 - seg(frame, 393, 409));
  const b3 = seg(frame, 402, 418) * (1 - seg(frame, 605, 621));
  const b4 = seg(frame, 614, 630) * (1 - seg(frame, 790, 806));
  const b5 = seg(frame, 799, 815); // holds through 1028

  // beat 2: the shaded quarter-bar metaphor, filling in as it's described
  const fillProgress = interpolate(frame, [255, 340], [0, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // beat 4: the drawn plumbing slides up (not a plain crossfade)
  const slideUp4 = interpolate(frame, [614, 644], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const chipPop = pop(660);
  const blockedPop = pop(700);

  // beat 5: the final push-in number
  const heroPop5 = pop(799);
  const hero9 = Math.min(1, heroPop5 + 0.6);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- beat 1 : wide view, the old shape-matching system ---------------- */}
        <Group opacity={b1}>
          <div style={{ position: "absolute", left: 0, top: 40, width: 1280, textAlign: "center", fontSize: 24, fontWeight: 700, color: P.ink, opacity: b1 }}>
            One question in. One template out.
          </div>
          <StatPill x={70} y={630} emoji="😐" text="No explanation, just a printed card" tone="danger" opacity={b1} />
          <CaptionBand y={680} text="Matched a template. Never taught the idea." tone="danger" opacity={b1} />
        </Group>
        <LiveWindow
          file={shots}
          shot="hub"
          title="vitalii.no/features"
          from={15}
          hold={231}
          zoom={(t) => 1 + 0.05 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={b1}
          win={WIN_WIDE}
        />

        {/* ---------------- beat 2 : the misconception, drawn (metaphor) ---------------- */}
        <Group opacity={b2}>
          <div style={{ position: "absolute", left: 0, top: 60, width: 1280, textAlign: "center", fontSize: 24, fontWeight: 700, color: P.ink, opacity: b2 }}>
            A quarter shaded means nothing on its own.
          </div>
          <div
            style={{
              position: "absolute",
              left: 340,
              top: 260,
              width: 600,
              height: 90,
              borderRadius: 12,
              border: `2px solid ${P.dangerEdge}`,
              overflow: "hidden",
              background: P.card,
            }}
          >
            <div style={{ width: `${fillProgress * 100}%`, height: "100%", background: P.dangerBg, borderRight: `2px solid ${P.danger}` }} />
          </div>
          <div style={{ position: "absolute", left: 340, top: 380, fontSize: 46, fontWeight: 800, color: P.danger }}>25%</div>
          <div style={{ position: "absolute", left: 500, top: 392, fontSize: 30, fontWeight: 700, color: P.muted }}>=</div>
          <div style={{ position: "absolute", left: 560, top: 380, fontSize: 46, fontWeight: 800, color: P.danger }}>1/4</div>
          <div style={{ position: "absolute", left: 780, top: 392, fontSize: 30, fontWeight: 700, color: P.muted }}>?</div>
          <CaptionBand y={646} text="No idea behind the bar, nothing is learned" tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : the fix, zoomed into the card itself ---------------- */}
        <Group opacity={b3}>
          <StatPill x={70} y={70} emoji="🧩" text="Idea → misconception → one example" tone="accent" opacity={b3} />
          <CaptionBand y={680} text="Every card teaches the idea before it asks" tone="accent" opacity={b3} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/…-b53"
          from={402}
          hold={219}
          zoom={(t) => 1 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.45 }}
          opacity={b3}
          win={WIN_TIGHT}
        />

        {/* ---------------- beat 4 : the sourcing gate, drawn (invisible plumbing) ---------------- */}
        <Group opacity={b4} dy={slideUp4}>
          <Panel x={150} y={140} w={980} h={130} tone="accent" opacity={b4}>
            <div style={{ padding: "20px 26px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ fontSize: 34 }}>🤖</div>
              <div>
                <div style={{ fontSize: 19, fontWeight: 700, color: P.ink }}>AI agents research the real teaching method</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: P.muted, marginTop: 4 }}>every model paired with a verbatim source quote</div>
              </div>
            </div>
          </Panel>
          <Panel x={150} y={300} w={470} h={140} tone="danger" opacity={Math.min(1, blockedPop)}>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: P.danger }}>📄 claim, no quote attached</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: P.danger, marginTop: 10 }}>❌ blocked</div>
            </div>
          </Panel>
          <Panel x={660} y={300} w={470} h={140} tone="success" opacity={Math.min(1, blockedPop)}>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: P.success }}>📄 claim, source quoted</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: P.success, marginTop: 10 }}>✅ on the wall</div>
            </div>
          </Panel>
          <FilterChip x={150} y={470} text="TypeScript" icon="🔍" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand y={646} text="No citation, no card" tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : the result, zoomed in furthest ---------------- */}
        <Group opacity={b5}>
          <div style={{ position: "absolute", left: 150, top: 40, width: 470, opacity: hero9 }}>
            <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 800, letterSpacing: -4, color: P.success, fontVariantNumeric: "tabular-nums" }}>9</div>
            <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>VERIFIED TEACHING MODELS ON THE WALL</div>
          </div>
          <CheckBadge x={640} y={50} size={44} opacity={b5} scale={heroPop5} />
          <CaptionBand y={680} text="Nine verified teaching ideas, each traceable to a real source" tone="success" opacity={b5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="result"
          title="vitalii.no/features/…-b53"
          from={799}
          hold={229}
          zoom={(t) => 1 + 0.14 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.5 }}
          opacity={b5}
          win={WIN_TIGHT}
        />
      </div>
    </PaletteProvider>
  );
};
