/**
 * FeaturePlacesRoutePassesButG17 — feature g17 — 1280x720, 982 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (wave B, 2026-10-02). Same narration, same five beat windows as
 * every earlier cut — only the picture changes. This cut is **archetype 7
 * hero-number, mood mint**.
 *
 * Why this redraw: two blind viewers scored the last cut 5/10 and asked for
 * three things it did not have — a product name up front, a picture of what
 * the places/route actually ARE (not a scroll of an unrelated features
 * list), and a smooth handoff between the hero number's four metrics instead
 * of a hard text-swap that read as a glitch when paused. All three are fixed
 * below without inventing anything: this product is a native Android app
 * with no public interface to record, so the only verified URL used is the
 * feature's OWN article page (swapped in for the generic features hub the
 * last cut used), and a drawn route-with-pins motif stands in for the actual
 * map/places the narration is about, carried through every beat.
 *
 * ONE persistent hero figure (fontSize 230, left column, alive frame 15 to
 * 982) owns the frame for the whole clip. Its value/label/color CROSSFADE
 * between the four metrics (a dissolve across the ~9-frame gap between
 * beats, not a hard swap) so no frame reads as broken:
 *   b1  "0/3"  danger   SOURCES FOUND FOR THIS PLACE
 *   b2  "2/21" danger   DAYS SKIPPED, NO SECOND LOOK
 *   b3  "N/3"  accent→success, climbing as the nightly pass reads each source
 *   b4  "N"    accent→success, climbing as Wikidata promotes forgotten spots
 *   b5  "5"    success  REAL SOURCES PER PLACE (final payoff, holds to 982)
 *
 * A second persistent element — a small drawn ROUTE with three named place
 * pins (Old chapel, Old mill 🏚, Old dairy 🥛) sitting top-right beside the
 * hero — carries the literal "places along the route" through every beat,
 * changing state each time: silent/gray (b1) → unchanged + a stale-day tally
 * ticking up (b2, visualizing "nothing ever came back") → pins light up one
 * by one as sources are read (b3) → mill & dairy turn green/promoted (b4) →
 * all three resolved, story-ready (b5).
 *
 * Voice-synced beat table (identical frame windows to every earlier cut):
 *  b1  15-171  "Some places along the route stayed silent forever — there
 *              just wasn't enough written about them." — product plate
 *              ("Guide — Stories on the Road") + problem StatPill + the
 *              route/pins all silent + a LiveWindow recording of the
 *              feature's OWN verified article page (shots/g17.json, shot
 *              "page") as grounding that this is a real, documented feature.
 *  b2 180-316  "Once skipped, a place stayed skipped — nothing ever came
 *              back to look harder." — DRAWN: no verified URL shows a "days
 *              skipped" state, so a LogWindow reconstructs the pattern from
 *              the feature's own real number (2 of the last 21 days), while
 *              the route pins stay silent and a tally counts the stale days.
 *  b3 325-544  "Now a separate nightly process digs deeper — old newspapers,
 *              local-history archives, forgotten books." — DRAWN: this is
 *              invisible plumbing (a nightly cron), so the mechanism is
 *              drawn — three source cards reveal one by one and light the
 *              matching pin on the route, plus the real matching commit
 *              fd66bbf (its message says exactly this; GitHub is not a
 *              verified URL tonight, so it is a monospace chip, not a live
 *              diff).
 *  b4 553-754  "It even scans nearby Wikidata records, promoting forgotten
 *              spots like old mills and dairies into the route." — DRAWN:
 *              also invisible plumbing, no commit matches this sentence
 *              (402d697 is chapters/revoice, not Wikidata; 7cab206 belongs
 *              to a different feature, g18) — a radius-check diagram pulls
 *              the mill and dairy markers in, and those two pins on the
 *              route turn green at the same moment. Single tech-credibility
 *              chip: "Wikidata".
 *  b5 763-937  "So every silent place gets a second look through five more
 *              real sources before it's given up on." — DRAWN per gate 2
 *              (the last beat may not play the feature's own page nor the
 *              hub): all three route pins resolve green/story-ready, next to
 *              a LogWindow built from the feature's own real numbers
 *              contrasting old vs new. Holds to 982, no fade-out.
 *
 * Non-crossfade transition: beat3 -> beat4 vertical slide (content exits up,
 * enters from below) — unchanged from every earlier cut.
 * Single tech-credibility caption in the whole clip: "Wikidata" (beat 4),
 * with a 4-word plain gloss. Real data only: the three named sources, the
 * 21-day window, the 150m radius and the "5 sources" total all come from the
 * feature's own text. Emoji are strictly single-codepoint: 📰 📚 📖 📍 🔇 🌙 🧩 ⏳.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  IconCard,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, Win } from "./live-primitives";
import shotsData from "./shots/g17.json";

const P = MOODS.mint;

const B1_S = 15, B1_E = 171;
const B2_S = 180, B2_E = 316;
const B3_S = 325, B3_E = 544;
const B4_S = 553, B4_E = 754;
const B5_S = 763, B5_E = 937;
const END = 982;
const FADE = 9;

// Leaves the top band to the hero figure (left) and the route motif (right),
// this wide strip is whatever is the beat's own evidence.
const WIN_MAIN: Win = { x: 90, y: 330, w: 1100, h: 290 };
const WIN_PAGE: Win = { x: 610, y: 330, w: 580, h: 290 };

const HERO_X = 90;
const HERO_Y = 40;

type Source = { short: string; emoji: string; label: string };
const SOURCES: Source[] = [
  { short: "no source found", emoji: "📰", label: "Newspapers" },
  { short: "no source found", emoji: "📚", label: "Local-history wiki" },
  { short: "no source found", emoji: "📖", label: "Reference books" },
];

const BeatLabel: React.FC<{ x: number; y: number; w: number; kicker: string; title: string; opacity: number }> = ({
  x,
  y,
  w,
  kicker,
  title,
  opacity,
}) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity, fontFamily }}>
      <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 3, color: B.accent, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: B.ink, marginTop: 8, lineHeight: 1.2 }}>{title}</div>
    </div>
  );
};

/** One of the hero's four metric states, crossfaded against its neighbors by `weight`. */
const HeroLayer: React.FC<{ value: string; label: string; color: string; weight: number }> = ({
  value,
  label,
  color,
  weight,
}) => {
  if (weight <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 480, opacity: weight, fontFamily }}>
      <div
        style={{
          fontSize: 230,
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: -6,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 18, fontSize: 22, fontWeight: 800, letterSpacing: 1.6, color }}>{label}</div>
    </div>
  );
};

/** The one hero figure that owns the frame for the whole clip — a dissolve between metrics. */
const Hero: React.FC<{
  opacity: number;
  w1: number;
  w2: number;
  w3: number;
  w4: number;
  w5: number;
  n3: number;
  n4: number;
  colors: { danger: string; accent: string; success: string };
}> = ({ opacity, w1, w2, w3, w4, w5, n3, n4, colors }) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: HERO_X, top: HERO_Y, width: 480, height: 300, opacity }}>
      <HeroLayer value="0/3" label="SOURCES FOUND FOR THIS PLACE" color={colors.danger} weight={w1} />
      <HeroLayer value="2/21" label="DAYS SKIPPED, NO SECOND LOOK" color={colors.danger} weight={w2} />
      <HeroLayer
        value={`${n3}/3`}
        label="SOURCES READ TONIGHT"
        color={n3 >= 3 ? colors.success : colors.accent}
        weight={w3}
      />
      <HeroLayer
        value={String(n4)}
        label="FORGOTTEN SPOTS PROMOTED"
        color={n4 >= 2 ? colors.success : colors.accent}
        weight={w4}
      />
      <HeroLayer value="5" label="REAL SOURCES PER PLACE" color={colors.success} weight={w5} />
    </div>
  );
};

type PinState = "silent" | "reading" | "promoted";
const RoutePin: React.FC<{ x: number; name: string; icon: string; state: PinState; glowOpacity: number }> = ({
  x,
  name,
  icon,
  state,
  glowOpacity,
}) => {
  const B = usePalette();
  const color = state === "promoted" ? B.success : state === "reading" ? B.accent : B.muted;
  const bg = state === "promoted" ? B.successBg : state === "reading" ? B.accentBg : B.chipBg;
  return (
    <div style={{ position: "absolute", left: x - 42, top: 0, width: 84, textAlign: "center", fontFamily }}>
      <div
        style={{
          width: 52,
          height: 52,
          margin: "0 auto",
          borderRadius: "50%",
          background: bg,
          border: `2.5px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          position: "relative",
        }}
      >
        {state === "silent" ? "🔇" : icon}
        {state === "promoted" ? (
          <div
            style={{
              position: "absolute",
              right: -6,
              top: -6,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: B.success,
              color: "#fff",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: glowOpacity,
            }}
          >
            📖
          </div>
        ) : null}
      </div>
      <div style={{ marginTop: 8, fontSize: 12.5, fontWeight: 700, color }}>{name}</div>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: B.muted, marginTop: 1 }}>
        {state === "silent" ? "no story yet" : state === "reading" ? "being read" : "story ready"}
      </div>
    </div>
  );
};

/** The route motif: three named places strung along a dashed road, top-right, alive the whole clip. */
const RouteStrip: React.FC<{
  opacity: number;
  chapelState: PinState;
  millState: PinState;
  dairyState: PinState;
  readIcon: [string, string, string];
  readOn: [number, number, number];
  promotedOn: number;
}> = ({ opacity, chapelState, millState, dairyState, readIcon, readOn, promotedOn }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  const roadY = 112;
  return (
    <div style={{ position: "absolute", left: 620, top: 40, width: 570, height: 150, opacity, fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: 20,
          top: roadY,
          width: 530,
          height: 0,
          borderTop: `3px dashed ${B.border}`,
        }}
      />
      <RoutePin x={62} name="Old chapel" icon={readIcon[0]} state={chapelState} glowOpacity={promotedOn} />
      <RoutePin x={285} name="Old mill" icon={readIcon[1]} state={millState} glowOpacity={promotedOn} />
      <RoutePin x={508} name="Old dairy" icon={readIcon[2]} state={dairyState} glowOpacity={promotedOn} />
    </div>
  );
};

export const FeaturePlacesRoutePassesButG17: React.FC = () => {
  const frame = useCurrentFrame();
  const B = usePalette();

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds full opacity through frame 982 — no fade-out

  const heroOn = seg(frame, B1_S, B1_S + FADE); // the hero fades in once and never fades out

  // Hero's four metrics dissolve into each other across the ~9-frame gap
  // between beats instead of hard-swapping (the fix for the "glitch" the
  // viewer flagged).
  const w1 = 1 - seg(frame, B2_S, B2_S + FADE);
  const w2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B3_S, B3_S + FADE));
  const w3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B4_S, B4_S + FADE));
  const w4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B5_S, B5_S + FADE));
  const w5 = seg(frame, B5_S, B5_S + FADE);

  // beat3 -> beat4 is a slide, not a crossfade.
  const b3ExitY = interpolate(frame, [B3_E, B3_E + FADE], [0, -34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const b4EnterY = interpolate(frame, [B4_S, B4_S + FADE], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // beat2: the stale-day tally ticks 0 -> 21 while nothing comes back to look harder.
  const staleDays = Math.round(interpolate(frame, [B2_S + 6, B2_E - 10], [0, 21], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // beat3: the three sources surface one after another as the night job reads them.
  const c3 = [0, 1, 2].map((i) => seg(frame, B3_S + 6 + i * 36, B3_S + 26 + i * 36));
  const c3Sum = c3[0] + c3[1] + c3[2];
  const n3 = Math.min(3, Math.round(c3Sum));

  // beat4: the 150m radius check pulses, then mill & dairy are confirmed and promoted.
  const radiusPulse = 1 + 0.08 * Math.sin(frame / 6);
  const mill = seg(frame, B4_S + 40, B4_S + 60);
  const dairy = seg(frame, B4_S + 66, B4_S + 86);
  const n4 = Math.min(2, Math.round(mill + dairy));

  // beat5: the chapel (the last silent pin) resolves too — every place gets its second look.
  const chapelResolved = seg(frame, B5_S + 20, B5_S + 40);

  // Route pin states, computed once from the live beat/animation values above.
  let chapelState: PinState = "silent";
  let millState: PinState = "silent";
  let dairyState: PinState = "silent";
  const readIcon: [string, string, string] = ["📰", "📚", "📖"];
  const readOn: [number, number, number] = [c3[0], c3[1], c3[2]];
  if (frame >= B3_S) {
    chapelState = c3[0] >= 0.5 ? "reading" : "silent";
    millState = c3[1] >= 0.5 ? "reading" : "silent";
    dairyState = c3[2] >= 0.5 ? "reading" : "silent";
  }
  if (frame >= B4_S) {
    millState = mill >= 0.5 ? "promoted" : "reading";
    dairyState = dairy >= 0.5 ? "promoted" : "reading";
  }
  if (frame >= B5_S) {
    chapelState = chapelResolved >= 0.5 ? "promoted" : "reading";
  }
  const promotedOn = Math.max(mill, dairy, chapelResolved, frame >= B5_S ? 1 : 0) > 0.5 ? 1 : seg(frame, B4_S + 40, B4_S + 60);

  const heroColors = { danger: B.danger, accent: B.accent, success: B.success };

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        <Hero opacity={heroOn} w1={w1} w2={w2} w3={w3} w4={w4} w5={w5} n3={n3} n4={n4} colors={heroColors} />

        <RouteStrip
          opacity={heroOn}
          chapelState={chapelState}
          millState={millState}
          dairyState={dairyState}
          readIcon={readIcon}
          readOn={readOn}
          promotedOn={promotedOn}
        />

        {/* beat 1 — the product, the problem, and proof the page is real */}
        <Group opacity={b1}>
          <div
            style={{
              position: "absolute",
              left: WIN_MAIN.x,
              top: WIN_MAIN.y,
              width: 460,
              padding: "14px 18px",
              borderRadius: 14,
              background: B.card,
              border: `1.5px solid ${B.border}`,
              boxShadow: "0 8px 22px rgba(20,30,45,0.10)",
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 800, color: B.ink }}>Guide — Stories on the Road</div>
            <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.35, color: B.muted, fontWeight: 550 }}>
              A personal audio guide for driving: the phone knows where I am and plays short stories about the
              places around me, in Norwegian and Ukrainian side by side.
            </div>
          </div>
          <StatPill
            x={WIN_MAIN.x}
            y={WIN_MAIN.y + 132}
            emoji="🔇"
            text="Not enough written — this place stays permanently silent"
            tone="danger"
          />
          <LiveWindow
            file={shotsData}
            shot="page"
            title="vitalii.no/features"
            from={B1_S + 8}
            hold={150}
            opacity={1}
            win={WIN_PAGE}
          />
          <BeatLabel x={90} y={636} w={1100} kicker="THE PROBLEM" title="Some places never got a story" opacity={1} />
        </Group>

        {/* beat 2 — stayed skipped forever, reconstructed as a log (no verified URL shows this) */}
        <Group opacity={b2}>
          <LogWindow
            title="guide-research · nightly pass"
            from={B2_S + 10}
            every={24}
            fontSize={20}
            win={WIN_MAIN}
            opacity={1}
            lines={[
              { t: "pass", text: "harvest: wiki + geosearch", tone: "muted" },
              { t: "pass", text: "not enough written → skip", tone: "danger" },
              { t: "pass", text: "harvest: wiki + geosearch", tone: "muted" },
              { t: "pass", text: "not enough written → skip", tone: "danger" },
              { t: "day 21", text: "2 of 21 days skipped — given up for good", tone: "danger" },
            ]}
          />
          <div
            style={{
              position: "absolute",
              left: 870,
              top: 200,
              width: 180,
              textAlign: "center",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: B.danger, letterSpacing: 1 }}>⏳ STILL SILENT</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: B.danger, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
              {staleDays} days
            </div>
          </div>
          <BeatLabel x={90} y={636} w={1100} kicker="THE GAP" title="Once skipped, a place stayed skipped" opacity={1} />
        </Group>

        {/* beat 3 — the nightly process digs deeper; the real matching commit */}
        <Group opacity={b3} dy={b3ExitY}>
          <StatPill x={870} y={168} emoji="🌙" text="A separate nightly process digs deeper" tone="accent" />
          <div
            style={{
              position: "absolute",
              left: 870,
              top: 236,
              padding: "10px 16px",
              borderRadius: 10,
              background: B.chipBg,
              border: `1px solid ${B.border}`,
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: 13.5,
              color: B.muted,
              maxWidth: 300,
            }}
          >
            fd66bbf · research deeper sources for skipped places
          </div>
          <Panel x={WIN_MAIN.x} y={WIN_MAIN.y} w={820} h={WIN_MAIN.h} tone="card" opacity={1}>
            {SOURCES.map((s, i) => (
              <IconCard
                key={s.label}
                x={30 + i * 260}
                y={55}
                w={230}
                emoji={s.emoji}
                title={s.label}
                sub="real source found"
                tone="success"
                opacity={c3[i]}
                scale={1.1}
              />
            ))}
          </Panel>
          <BeatLabel
            x={90}
            y={636}
            w={1100}
            kicker="THE PASS"
            title="Old newspapers, local-history archives, forgotten books"
            opacity={1}
          />
        </Group>

        {/* beat 4 — the Wikidata check, promoting forgotten spots. slides in from below. */}
        <Group opacity={b4} dy={b4EnterY}>
          <div
            style={{
              position: "absolute",
              left: 400,
              top: 400,
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: `3px solid ${B.accent}`,
              background: B.accentBg,
              transform: `scale(${radiusPulse})`,
            }}
          />
          <div style={{ position: "absolute", left: 400, top: 495, width: 220, textAlign: "center", fontFamily }}>
            <div style={{ fontSize: 32 }}>📍</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: B.ink, marginTop: 2 }}>Wikidata within 150m</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 300 + mill * 180,
              top: 300 + mill * 60,
              fontSize: 30,
              opacity: mill,
              transition: "none",
            }}
          >
            🏚
          </div>
          <div
            style={{
              position: "absolute",
              left: 740 - dairy * 180,
              top: 300 + dairy * 60,
              fontSize: 30,
              opacity: dairy,
            }}
          >
            🥛
          </div>
          <FilterChip x={760} y={400} text="Wikidata" icon="🧩" color={B.accent} scale={1} opacity={1} />
          <div style={{ position: "absolute", left: 760, top: 448, width: 300, fontSize: 12.5, fontWeight: 550, color: B.muted }}>
            a free facts database
          </div>
          <BeatLabel
            x={90}
            y={636}
            w={1100}
            kicker="THE PROMOTION"
            title="Forgotten spots become new places on the route"
            opacity={1}
          />
        </Group>

        {/* beat 5 — the result, in the product's own log, plus the route fully resolved. holds to the end, no page or hub (gate 2). */}
        <Group opacity={b5}>
          <LogWindow
            title="guide-research · second pass"
            from={B5_S + 10}
            every={26}
            fontSize={20}
            win={{ x: WIN_MAIN.x, y: WIN_MAIN.y, w: 740, h: WIN_MAIN.h }}
            opacity={1}
            lines={[
              { t: "OLD", text: "skipped ≥2 of 21 days → given up forever", tone: "danger" },
              { t: "NEW", text: "newspapers, wiki, books, encyclopedia, Wikidata", tone: "accent" },
              { t: "NEW", text: "5 real sources checked before giving up", tone: "success" },
              { t: "NEW", text: "every silent place gets a second look", tone: "success" },
            ]}
          />
          <Panel x={860} y={WIN_MAIN.y} w={330} h={WIN_MAIN.h} tone="success" opacity={1}>
            <div style={{ padding: "20px 24px", fontFamily }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: B.success, letterSpacing: 1 }}>THE ROUTE NOW</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: B.ink, marginTop: 10 }}>🔇 Old chapel → 📖</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: B.ink, marginTop: 6 }}>🏚 Old mill → 📖</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: B.ink, marginTop: 6 }}>🥛 Old dairy → 📖</div>
            </div>
          </Panel>
          <BeatLabel x={90} y={636} w={1100} kicker="THE RESULT" title="Every silent place gets a second, deeper look" opacity={1} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
