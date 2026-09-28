/**
 * FeaturePlacesRoutePassesButG17 — feature g17 — 1280x720, 982 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 1 timeline, mood slate.
 *
 * A slim horizontal ribbon runs across the top of the frame for the WHOLE clip — the one
 * persistent element (alive frame 15 to 982). Three stops sit on it left-to-right, one per
 * real source the nightly research script digs into (newspapers / local-history wiki /
 * reference books, from this feature's own commit message). In beat 1 all three stops read as
 * the exact same "nothing found" mark — the problem. In beat 2 the ribbon is repurposed as a
 * 21-day axis with two skipped days marked, and a LogWindow reconstructs the same bleak pattern
 * (no runtime log exists for this product, so the lines are built from the feature row's own
 * numbers: 2 of the last 21 days). In beat 3 the three stops differentiate into their real icons
 * as the nightly process reads them — the real matching commit (fd66bbf, "research deeper
 * sources for skipped places on the daily route") is shown as a drawn code chip, since GitHub is
 * not a verified URL tonight. In beat 4 a fourth, separate check (Wikidata within 150m) promotes
 * forgotten spots — old mills, dairies — while the three stops stay dimmed in the background. In
 * beat 5 — the payoff — the ribbon's three stops stay lit and two more join (encyclopedia,
 * Wikidata) for the total the title promises: 5 sources, shown in a LogWindow contrasting old vs
 * new. The headline sits bottom-left, small, never centered; the ribbon carries the story.
 *
 * Voice-synced beat table (do not shift):
 *  b1  15-171  "Some places along the route stayed silent forever — there just wasn't enough
 *              written about them." — all three ribbon stops show the same "nothing found" mark;
 *              drawn: product plate + problem StatPill (no LiveWindow — see note below).
 *  b2 180-316  "Once skipped, a place stayed skipped — nothing ever came back to look harder." —
 *              ribbon becomes a 21-day axis, two days marked skipped; LogWindow reconstructs the
 *              pattern from the feature's own "2 of 21 days" number.
 *  b3 325-544  "Now a separate nightly process digs deeper — old newspapers, local-history
 *              archives, forgotten books." — the three stops morph into their real icons; drawn
 *              commit chip fd66bbf (matches this sentence, GitHub not recorded tonight).
 *  b4 553-754  "It even scans nearby Wikidata records, promoting forgotten spots like old mills
 *              and dairies into the route." — a 150m radius check appears beside the ribbon;
 *              "old mill" / "dairy" cards slide in as promoted. Single tech-credibility chip:
 *              "Wikidata".
 *  b5 763-937  "So every silent place gets a second look through five more real sources before
 *              it's given up on." — the three stops stay lit, two more join for the total of 5;
 *              LogWindow contrasts old vs new. Holds to 982, no fade-out. Never plays the
 *              feature's own page nor the hub (gate 2).
 *
 * No LiveWindow anywhere in this clip: the feature's own page and the hub are never staged at
 * all, not even in beat 1, so there is no "final LiveWindow" that could read as playing the
 * page/hub — beat 1 is fully drawn (product plate + problem StatPill + ribbon).
 *
 * Persistent element: the ribbon, alive from frame 15 to 982, never disappears.
 * Non-crossfade transition: beat3 -> beat4 vertical slide (content exits up, enters from below).
 * Single tech-credibility caption: "Wikidata" (FilterChip, beat 4 only), with a plain gloss.
 * Real data only: the three named sources, the 21-day window, the 150m radius and the "5
 * sources" total all come from the feature's own text. Emoji are strictly single-codepoint:
 * ❌ 📰 📚 📖 📍 🔇 ⚠ ✓.
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
  seg,
  fontFamily,
} from "./bright-primitives";
import { LogWindow, Win } from "./live-primitives";

const P = MOODS.slate;

const B1_S = 15, B1_E = 171;
const B2_S = 180, B2_E = 316;
const B3_S = 325, B3_E = 544;
const B4_S = 553, B4_E = 754;
const B5_S = 763, B5_E = 937;
const END = 982;
const FADE = 9;

const RIBBON_Y = 108;
const RIBBON_LEFT = 90;
const RIBBON_RIGHT = 1190;

const WIN5: Win = { x: 220, y: 300, w: 900, h: 300 };

type Stop = { x: number; short: string; after: string; afterLabel: string; land: number };

const STOPS: Stop[] = [
  { x: 255, short: "no source found", after: "📰", afterLabel: "Newspapers", land: B3_S + 40 },
  { x: 640, short: "no source found", after: "📚", afterLabel: "Local-history wiki", land: B3_S + 72 },
  { x: 1025, short: "no source found", after: "📖", afterLabel: "Reference books", land: B3_S + 104 },
];

const DAYS = [
  { x: RIBBON_LEFT, label: "day 1" },
  { x: RIBBON_LEFT + (RIBBON_RIGHT - RIBBON_LEFT) * 0.25, label: "day 6" },
  { x: RIBBON_LEFT + (RIBBON_RIGHT - RIBBON_LEFT) * 0.5, label: "day 12" },
  { x: RIBBON_LEFT + (RIBBON_RIGHT - RIBBON_LEFT) * 0.75, label: "day 17" },
  { x: RIBBON_RIGHT, label: "day 21" },
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

export const FeaturePlacesRoutePassesButG17: React.FC = () => {
  const frame = useCurrentFrame();

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds full opacity through frame 982 — no fade-out

  const ribbonOn = seg(frame, B1_S, B1_S + FADE);

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

  // the three ribbon stops are the persistent-but-changing motif: full brightness while they
  // ARE the story (b1 identical / b3 differentiation / b5 payoff), dimmed to background while
  // the ribbon is busy telling a different part of the story (b2 day axis / b4 Wikidata check).
  const stopOpacity = b1 * 1 + b2 * 0.16 + b3 * 1 + b4 * 0.3 + b5 * 1;

  // beat3 internal reveal: the three sources surface one after another as the night job reads them.
  const c3Codes = [0, 1, 2].map((i) => seg(frame, B3_S + 6 + i * 12, B3_S + 20 + i * 12));

  // beat2: a marker crawls day1 -> day21, flashing red twice (the two skipped days).
  const b2T = interpolate(frame, [B2_S, B2_E], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const markerX = interpolate(b2T, [0, 1], [RIBBON_LEFT, RIBBON_RIGHT]);
  const skip1 = seg(frame, B2_S + 22, B2_S + 34) * (1 - seg(frame, B2_S + 46, B2_S + 58));
  const skip2 = seg(frame, B2_S + 74, B2_S + 86) * (1 - seg(frame, B2_S + 98, B2_S + 110));

  // beat4: the 150m radius check pulses, then two promoted-place cards slide in.
  const radiusPulse = 1 + 0.08 * Math.sin(frame / 6);
  const mill = seg(frame, B4_S + 40, B4_S + 60);
  const dairy = seg(frame, B4_S + 66, B4_S + 86);

  // beat5: two more sources join the three lit stops for the total of 5.
  const join1 = seg(frame, B5_S + 20, B5_S + 40);
  const join2 = seg(frame, B5_S + 40, B5_S + 60);

  return (
    <PaletteProvider value={P}>
      <FrameInner
        frame={frame}
        b1={b1}
        b2={b2}
        b3={b3}
        b4={b4}
        b5={b5}
        ribbonOn={ribbonOn}
        b3ExitY={b3ExitY}
        b4EnterY={b4EnterY}
        stopOpacity={stopOpacity}
        c3Codes={c3Codes}
        markerX={markerX}
        skip1={skip1}
        skip2={skip2}
        radiusPulse={radiusPulse}
        mill={mill}
        dairy={dairy}
        join1={join1}
        join2={join2}
      />
    </PaletteProvider>
  );
};

const FrameInner: React.FC<{
  frame: number;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  ribbonOn: number;
  b3ExitY: number;
  b4EnterY: number;
  stopOpacity: number;
  c3Codes: number[];
  markerX: number;
  skip1: number;
  skip2: number;
  radiusPulse: number;
  mill: number;
  dairy: number;
  join1: number;
  join2: number;
}> = ({ b1, b2, b3, b4, b5, ribbonOn, b3ExitY, b4EnterY, stopOpacity, c3Codes, markerX, skip1, skip2, radiusPulse, mill, dairy, join1, join2 }) => {
  const B = usePalette();

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />

      {/* ════ THE RIBBON — persistent, alive from frame 15 to the end ════ */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 210, opacity: ribbonOn }}>
        <div
          style={{
            position: "absolute",
            left: RIBBON_LEFT,
            top: RIBBON_Y,
            width: RIBBON_RIGHT - RIBBON_LEFT,
            height: 4,
            borderRadius: 2,
            background: B.border,
          }}
        />

        {/* day axis + crawling marker — beat 2 only */}
        {b2 > 0.004 &&
          DAYS.map((d) => (
            <div
              key={d.label}
              style={{
                position: "absolute",
                left: d.x - 26,
                top: RIBBON_Y + 16,
                width: 52,
                textAlign: "center",
                fontFamily,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: B.muted,
                opacity: b2,
              }}
            >
              {d.label}
            </div>
          ))}
        {b2 > 0.004 && (
          <div
            style={{
              position: "absolute",
              left: markerX - 9,
              top: RIBBON_Y - 9,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: skip1 + skip2 > 0.5 ? B.danger : B.muted,
              boxShadow: skip1 + skip2 > 0.5 ? `0 0 18px 4px ${B.danger}66` : "none",
              opacity: b2,
              transform: `scale(${1 + (skip1 + skip2) * 0.4})`,
            }}
          />
        )}

      </div>

      <RibbonStops stopOpacity={stopOpacity} c3Codes={c3Codes} b1={b1} b3={b3} />

      {/* beat 1 — the product plate + proof of the real page + the silent problem */}
      <Group opacity={b1}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 216,
            width: 420,
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
        <StatPill x={90} y={380} emoji="🔇" text="Not enough written — this place stays permanently silent" tone="danger" />
        <BeatLabel x={90} y={560} w={620} kicker="THE PROBLEM" title="Some places never got a story" opacity={1} />
      </Group>
      {/* beat 2 — stayed skipped forever, reconstructed as a log */}
      <Group opacity={b2}>
        <LogWindow
          title="guide-research · nightly pass"
          from={B2_S + 10}
          every={30}
          fontSize={20}
          win={{ x: 130, y: 220, w: 620, h: 300 }}
          opacity={1}
          lines={[
            { t: "pass", text: "harvest: wiki + geosearch", tone: "muted" },
            { t: "pass", text: "not enough written → skip", tone: "danger" },
            { t: "pass", text: "harvest: wiki + geosearch", tone: "muted" },
            { t: "pass", text: "not enough written → skip", tone: "danger" },
            { t: "day 21", text: "2 of 21 days skipped — given up for good", tone: "danger" },
          ]}
        />
        <div style={{ position: "absolute", left: 820, top: 236, fontFamily, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 110, fontWeight: 800, color: B.danger, letterSpacing: -3 }}>2/21</span>
        </div>
        <div style={{ position: "absolute", left: 824, top: 360, width: 300, fontFamily, fontSize: 18, fontWeight: 700, color: B.muted }}>
          DAYS SKIPPED, NO SECOND LOOK
        </div>
        <BeatLabel x={90} y={560} w={640} kicker="THE GAP" title="Once skipped, a place stayed skipped" opacity={1} />
      </Group>

      {/* beat 3 — the nightly process digs deeper; the real matching commit */}
      <Group opacity={b3} dy={b3ExitY}>
        <StatPill x={90} y={230} emoji="🌙" text="A separate nightly process digs deeper" tone="accent" />
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 280,
            padding: "10px 16px",
            borderRadius: 10,
            background: B.chipBg,
            border: `1px solid ${B.border}`,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 14,
            color: B.muted,
            maxWidth: 460,
          }}
        >
          fd66bbf · research deeper sources for skipped places on the daily route
        </div>
        <BeatLabel x={90} y={560} w={700} kicker="THE PASS" title="Old newspapers, local-history archives, forgotten books" opacity={1} />
      </Group>

      {/* beat 4 — the Wikidata check, promoting forgotten spots. slides in from below. */}
      <Group opacity={b4} dy={b4EnterY}>
        <div style={{ position: "absolute", left: 90, top: 230, width: 460 }}>
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
          <div style={{ marginTop: 12, fontSize: 12.5, fontWeight: 550, color: B.muted, maxWidth: 400 }}>
            a free structured database of facts
          </div>
        </div>
        <FilterChip x={90} y={340} text="Wikidata" icon="🧩" color={B.accent} scale={1} opacity={1} />
        <Panel x={620} y={220} w={280} h={110} tone="success" opacity={mill}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", fontFamily }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: B.success, letterSpacing: 1 }}>PROMOTED</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: B.ink }}>🏚 Old mill</div>
          </div>
        </Panel>
        <Panel x={920} y={220} w={280} h={110} tone="success" opacity={dairy}>
          <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px", fontFamily }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: B.success, letterSpacing: 1 }}>PROMOTED</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: B.ink }}>🥛 Old dairy</div>
          </div>
        </Panel>
        <FlowArrow x={410} y={272} len={190} color={B.accent} progress={Math.max(mill, dairy)} />
        <BeatLabel x={90} y={560} w={700} kicker="THE PROMOTION" title="Forgotten spots become new places on the route" opacity={1} />
      </Group>

      {/* beat 5 — the result, in the product's own log. holds to the end, no page or hub. */}
      <Group opacity={b5}>
        <LogWindow
          title="guide-research · second pass"
          from={B5_S + 10}
          every={28}
          fontSize={20}
          win={WIN5}
          opacity={1}
          lines={[
            { t: "OLD", text: "skipped ≥2 of 21 days → given up forever", tone: "danger" },
            { t: "NEW", text: "newspapers, wiki, books, encyclopedia, Wikidata", tone: "accent" },
            { t: "NEW", text: "5 real sources checked before giving up", tone: "success" },
            { t: "NEW", text: "Wikidata 150m → mills, dairies promoted", tone: "success" },
            { t: "NEW", text: "✓ every silent place gets a second look", tone: "success" },
          ]}
        />
        <CheckBadge x={WIN5.x + WIN5.w - 30} y={WIN5.y - 20} />
        <div style={{ position: "absolute", left: 220, top: 210, fontFamily, display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 130, fontWeight: 800, color: B.success, letterSpacing: -4 }}>5</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: B.muted, maxWidth: 260, opacity: Math.min(1, join1 + join2 + b5 * 0.4) }}>
            REAL SOURCES PER PLACE
          </span>
        </div>
        <BeatLabel x={90} y={630} w={760} kicker="THE RESULT" title="Every silent place gets a second, deeper look" opacity={1} />
      </Group>
    </div>
  );
};

const RibbonStops: React.FC<{ stopOpacity: number; c3Codes: number[]; b1: number; b3: number }> = ({
  stopOpacity,
  c3Codes,
  b1,
  b3,
}) => {
  const frame = useCurrentFrame();
  const B = usePalette();
  return (
    <>
      {STOPS.map((s, i) => {
        const t5 = seg(frame, s.land, s.land + 14);
        const pulse = 1 + c3Codes[i] * 0.12;
        return (
          <div key={s.x}>
            <div
              style={{
                position: "absolute",
                left: s.x - 33,
                top: RIBBON_Y - 33,
                width: 66,
                height: 66,
                borderRadius: "50%",
                background: t5 > 0.5 ? B.successBg : B.dangerBg,
                border: `2.5px solid ${t5 > 0.5 ? B.success : B.danger}`,
                boxShadow: "0 8px 20px rgba(16,24,40,0.14)",
                opacity: stopOpacity,
                transform: `scale(${pulse})`,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  opacity: 1 - t5,
                }}
              >
                ❌
              </span>
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  opacity: t5,
                  transform: `scale(${0.6 + t5 * 0.4})`,
                }}
              >
                {s.after}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                left: s.x - 90,
                top: RIBBON_Y + 44,
                width: 180,
                textAlign: "center",
                fontFamily,
                fontSize: 13,
                fontWeight: 700,
                color: B.danger,
                opacity: b1,
              }}
            >
              ⚠ {s.short}
            </div>
            <div
              style={{
                position: "absolute",
                left: s.x - 90,
                top: RIBBON_Y + 44,
                width: 180,
                textAlign: "center",
                fontFamily,
                fontSize: 13,
                fontWeight: 800,
                color: B.success,
                opacity: t5,
              }}
            >
              {s.afterLabel}
            </div>
          </div>
        );
      })}
    </>
  );
};
