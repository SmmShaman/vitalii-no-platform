/**
 * FeaturePlacesRoutePassesButG17 — feature g17 — 1280x720, 982 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (wave B, 2026-10-01): same narration, same five beat windows as the
 * previous cut — only the staging changes (the prior cut used a different,
 * older archetype and a slate mood). This cut is **archetype 7 hero-number,
 * mood violet**.
 *
 * ONE persistent hero figure (fontSize 230, left column, alive frame 15 to
 * 982, never shrunk to a corner badge) owns the frame for the whole clip.
 * Only its VALUE / LABEL / COLOR change per beat — the evidence for each
 * change is built in the right column and the wide window below:
 *   b1  "0/3"  danger   SOURCES FOUND FOR THIS PLACE
 *   b2  "2/21" danger   DAYS SKIPPED, NO SECOND LOOK
 *   b3  "N/3"  accent→success, climbing as the nightly pass reads each source
 *   b4  "N"    accent→success, climbing as Wikidata promotes forgotten spots
 *   b5  "5"    success  REAL SOURCES PER PLACE (final payoff, holds to 982)
 *
 * Voice-synced beat table (identical frame windows to the previous cut):
 *  b1  15-171  "Some places along the route stayed silent forever — there
 *              just wasn't enough written about them." — product plate +
 *              problem StatPill (right column) + a LiveWindow recording of
 *              the real, verified features hub (shots/g17.json, shot "hub")
 *              as proof this is a real, documented feature, not a mockup.
 *  b2 180-316  "Once skipped, a place stayed skipped — nothing ever came
 *              back to look harder." — DRAWN: no verified URL shows a
 *              "days skipped" state, so a LogWindow reconstructs the pattern
 *              from the feature's own real number (2 of the last 21 days).
 *  b3 325-544  "Now a separate nightly process digs deeper — old newspapers,
 *              local-history archives, forgotten books." — DRAWN: this is
 *              invisible plumbing (a nightly cron), so the mechanism is drawn
 *              instead of recorded — three source cards reveal one by one,
 *              plus the real matching commit fd66bbf (its message says
 *              exactly this; GitHub is not a verified URL tonight, so it is
 *              a monospace chip, not a live diff).
 *  b4 553-754  "It even scans nearby Wikidata records, promoting forgotten
 *              spots like old mills and dairies into the route." — DRAWN:
 *              also invisible plumbing, no commit matches this sentence
 *              (402d697 is chapters/revoice, not Wikidata; 7cab206 belongs to
 *              a different feature, g18) — a 150m-radius schematic promotes
 *              two named spots. Single tech-credibility chip: "Wikidata".
 *  b5 763-937  "So every silent place gets a second look through five more
 *              real sources before it's given up on." — DRAWN per gate 2
 *              (the last beat may not play the feature's own page nor the
 *              hub): a LogWindow built from the feature's own real numbers
 *              contrasts old vs new. Holds to 982, no fade-out.
 *
 * Non-crossfade transition: beat3 -> beat4 vertical slide (content exits up,
 * enters from below) — reused unchanged from the previous cut.
 * Single tech-credibility caption in the whole clip: "Wikidata" (beat 4),
 * with a 4-word plain gloss. Real data only: the three named sources, the
 * 21-day window, the 150m radius and the "5 sources" total all come from the
 * feature's own text. Emoji are strictly single-codepoint: 📰 📚 📖 📍 🔇 🌙 🧩.
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
  FlowArrow,
  CheckBadge,
  IconCard,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, Win } from "./live-primitives";
import shotsData from "./shots/g17.json";

const P = MOODS.violet;

const B1_S = 15, B1_E = 171;
const B2_S = 180, B2_E = 316;
const B3_S = 325, B3_E = 544;
const B4_S = 553, B4_E = 754;
const B5_S = 763, B5_E = 937;
const END = 982;
const FADE = 9;

// Leaves the left column to the hero figure, the right column to small
// credibility pieces, and this wide strip to whatever is the evidence.
const WIN_MAIN: Win = { x: 90, y: 330, w: 1100, h: 290 };

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

/** The one hero figure that owns the frame for the whole clip. */
const Hero: React.FC<{ value: string; label: string; color: string; opacity: number }> = ({
  value,
  label,
  color,
  opacity,
}) => {
  if (opacity <= 0.004) return null;
  return (
    <div style={{ position: "absolute", left: HERO_X, top: HERO_Y, width: 480, opacity, fontFamily }}>
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

export const FeaturePlacesRoutePassesButG17: React.FC = () => {
  const frame = useCurrentFrame();

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds full opacity through frame 982 — no fade-out

  const heroOn = seg(frame, B1_S, B1_S + FADE); // the hero fades in once and never fades out

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

  // beat3: the three sources surface one after another as the night job reads them.
  const c3 = [0, 1, 2].map((i) => seg(frame, B3_S + 6 + i * 36, B3_S + 26 + i * 36));
  const c3Sum = c3[0] + c3[1] + c3[2];

  // beat4: the 150m radius check pulses, then two promoted-place cards slide in.
  const radiusPulse = 1 + 0.08 * Math.sin(frame / 6);
  const mill = seg(frame, B4_S + 40, B4_S + 60);
  const dairy = seg(frame, B4_S + 66, B4_S + 86);

  // hero value/label/color for whichever beat is live right now (persistent, hard-switches
  // in the silent gaps between beats — each beat's formula has already settled by then).
  let heroValue = "0/3";
  let heroLabel = "SOURCES FOUND FOR THIS PLACE";
  let heroColor: "danger" | "accent" | "success" = "danger";
  if (frame >= B4_S) {
    const n = Math.min(2, Math.round(mill + dairy));
    heroValue = String(n);
    heroLabel = "FORGOTTEN SPOTS PROMOTED";
    heroColor = n >= 2 ? "success" : "accent";
  } else if (frame >= B3_S) {
    const n = Math.min(3, Math.round(c3Sum));
    heroValue = `${n}/3`;
    heroLabel = "SOURCES READ TONIGHT";
    heroColor = n >= 3 ? "success" : "accent";
  } else if (frame >= B2_S) {
    heroValue = "2/21";
    heroLabel = "DAYS SKIPPED, NO SECOND LOOK";
    heroColor = "danger";
  }
  if (frame >= B5_S) {
    heroValue = "5";
    heroLabel = "REAL SOURCES PER PLACE";
    heroColor = "success";
  }

  return (
    <PaletteProvider value={P}>
      <FrameInner
        b1={b1}
        b2={b2}
        b3={b3}
        b4={b4}
        b5={b5}
        heroOn={heroOn}
        heroValue={heroValue}
        heroLabel={heroLabel}
        heroColor={heroColor}
        b3ExitY={b3ExitY}
        b4EnterY={b4EnterY}
        c3={c3}
        radiusPulse={radiusPulse}
        mill={mill}
        dairy={dairy}
      />
    </PaletteProvider>
  );
};

const FrameInner: React.FC<{
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  heroOn: number;
  heroValue: string;
  heroLabel: string;
  heroColor: "danger" | "accent" | "success";
  b3ExitY: number;
  b4EnterY: number;
  c3: number[];
  radiusPulse: number;
  mill: number;
  dairy: number;
}> = ({ b1, b2, b3, b4, b5, heroOn, heroValue, heroLabel, heroColor, b3ExitY, b4EnterY, c3, radiusPulse, mill, dairy }) => {
  const B = usePalette();
  const heroColorHex = heroColor === "danger" ? B.danger : heroColor === "success" ? B.success : B.accent;

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      <Hero value={heroValue} label={heroLabel} color={heroColorHex} opacity={heroOn} />

      {/* beat 1 — the product, the problem, and proof the page is real */}
      <Group opacity={b1}>
        <div
          style={{
            position: "absolute",
            left: 650,
            top: 40,
            width: 440,
            padding: "14px 18px",
            borderRadius: 14,
            background: B.card,
            border: `1.5px solid ${B.border}`,
            boxShadow: "0 8px 22px rgba(20,30,45,0.10)",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: B.ink }}>Guide — Stories on the Road</div>
          <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.35, color: B.muted, fontWeight: 550 }}>
            A personal audio guide for driving: the phone knows where I am and plays short stories about the places
            around me, in Norwegian and Ukrainian side by side.
          </div>
        </div>
        <StatPill x={650} y={172} emoji="🔇" text="Not enough written — this place stays permanently silent" tone="danger" />
        <LiveWindow
          file={shotsData}
          shot="hub"
          title="vitalii.no/features"
          from={B1_S + 5}
          hold={160}
          opacity={1}
          win={WIN_MAIN}
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
        <BeatLabel x={90} y={636} w={1100} kicker="THE GAP" title="Once skipped, a place stayed skipped" opacity={1} />
      </Group>

      {/* beat 3 — the nightly process digs deeper; the real matching commit */}
      <Group opacity={b3} dy={b3ExitY}>
        <StatPill x={650} y={40} emoji="🌙" text="A separate nightly process digs deeper" tone="accent" />
        <div
          style={{
            position: "absolute",
            left: 650,
            top: 108,
            padding: "10px 16px",
            borderRadius: 10,
            background: B.chipBg,
            border: `1px solid ${B.border}`,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 14,
            color: B.muted,
            maxWidth: 440,
          }}
        >
          fd66bbf · research deeper sources for skipped places on the daily route
        </div>
        {SOURCES.map((s, i) => (
          <IconCard
            key={s.label}
            x={150 + i * 370}
            y={380}
            w={300}
            emoji={s.emoji}
            title={s.label}
            sub="real source found"
            tone="success"
            opacity={c3[i]}
          />
        ))}
        <BeatLabel x={90} y={636} w={1100} kicker="THE PASS" title="Old newspapers, local-history archives, forgotten books" opacity={1} />
      </Group>

      {/* beat 4 — the Wikidata check, promoting forgotten spots. slides in from below. */}
      <Group opacity={b4} dy={b4EnterY}>
        <div style={{ position: "absolute", left: 650, top: 40, width: 440 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `2.5px solid ${B.accent}`,
                background: B.accentBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                transform: `scale(${radiusPulse})`,
              }}
            >
              📍
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: B.ink }}>Wikidata within 150m</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: B.muted }}>checked against the track</div>
            </div>
          </div>
        </div>
        <FilterChip x={650} y={160} text="Wikidata" icon="🧩" color={B.accent} scale={1} opacity={1} />
        <div style={{ position: "absolute", left: 650, top: 208, width: 420, fontSize: 12.5, fontWeight: 550, color: B.muted }}>
          a free facts database
        </div>
        <Panel x={150} y={400} w={430} h={120} tone="success" opacity={mill}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", fontFamily }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: B.success, letterSpacing: 1 }}>PROMOTED</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: B.ink }}>🏚 Old mill</div>
          </div>
        </Panel>
        <Panel x={700} y={400} w={430} h={120} tone="success" opacity={dairy}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", fontFamily }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: B.success, letterSpacing: 1 }}>PROMOTED</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: B.ink }}>🥛 Old dairy</div>
          </div>
        </Panel>
        <FlowArrow x={580} y={452} len={120} color={B.accent} progress={Math.max(mill, dairy)} />
        <BeatLabel x={90} y={636} w={1100} kicker="THE PROMOTION" title="Forgotten spots become new places on the route" opacity={1} />
      </Group>

      {/* beat 5 — the result, in the product's own log. holds to the end, no page or hub (gate 2). */}
      <Group opacity={b5}>
        <LogWindow
          title="guide-research · second pass"
          from={B5_S + 10}
          every={28}
          fontSize={20}
          win={WIN_MAIN}
          opacity={1}
          lines={[
            { t: "OLD", text: "skipped ≥2 of 21 days → given up forever", tone: "danger" },
            { t: "NEW", text: "newspapers, wiki, books, encyclopedia, Wikidata", tone: "accent" },
            { t: "NEW", text: "5 real sources checked before giving up", tone: "success" },
            { t: "NEW", text: "Wikidata 150m → mills, dairies promoted", tone: "success" },
            { t: "NEW", text: "every silent place gets a second look", tone: "success" },
          ]}
        />
        <CheckBadge x={WIN_MAIN.x + WIN_MAIN.w - 30} y={WIN_MAIN.y - 20} />
        <BeatLabel x={90} y={636} w={1100} kicker="THE RESULT" title="Every silent place gets a second, deeper look" opacity={1} />
      </Group>
    </div>
  );
};
