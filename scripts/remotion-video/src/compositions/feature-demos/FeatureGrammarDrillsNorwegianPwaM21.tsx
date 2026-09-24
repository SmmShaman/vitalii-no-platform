/**
 * FeatureGrammarDrillsNorwegianPwaM21 — feature m21 — 1280x720, 911 frames @ 30fps, VOICE-SYNCED.
 *
 * archetype 0 split-duel, mood dawn. A vertical divider halves the frame the
 * whole clip: chaos on the left (random irregular-verb drills, no syllabus),
 * order on the right (the real textbook, reused blocks, Claude's proofreading
 * pass). The divider slides from x=900 (chaos owns almost everything) down to
 * x=380 (order has won) and never disappears — the one surviving element.
 * Both halves carry a persistent zone label ("🔀 RANDOM DRILLS" / "📗 TEXTBOOK
 * SYLLABUS") for the whole clip. No centered headline is used anywhere.
 *
 * UI beats play the real product: shots/m21.json has "hub" (vitalii.no/features)
 * and "page" (the feature's own page) — the only two URLs verified recordable
 * tonight. Beat 2 stages "hub" inside the shrinking chaos zone, beat 3 stages
 * "page" inside the growing order zone. Beat 5 never repeats either recording
 * (gate: last beat must not be the page or hub) — it closes on a LogWindow of
 * grounded facts from the feature row instead.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–206  "My app generated fine vocabulary lessons, but the grammar drills were just random irregular verbs."
 *  b2 215–373  "No connection to the textbook I studied from, and no one checking if the Norwegian was correct."
 *  b3 382–550  "Drills now follow that same textbook's syllabus, and Claude proofreads every one first."
 *  b4 559–719  "Blocks are reused instead of rewritten each time, one fix and it stays fixed."
 *  b5 728–866  "Verb drills now scale all the way up through B2 and C1 level." — holds to 911.
 *
 * Single tech name in the whole clip: Claude (beat 3 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Group,
  Panel,
  StatPill,
  FilterChip,
  CheckBadge,
  CaptionBand,
  StickyNote,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shots from "./shots/m21.json";

const P = MOODS.dawn;
const CARD_SHADOW = "0 10px 30px rgba(22,35,63,0.10)";
const HUB_SHOT = "hub";
const PAGE_SHOT = "page";

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Divider position: 900 (chaos owns the frame) → 380 (order has won). */
const dividerX = (frame: number): number => {
  const t = Math.max(0, Math.min(1, (frame - 15) / (866 - 15)));
  return 900 + (380 - 900) * easeInOut(t);
};

const ROWS: { topic: string; status: "REUSED" | "NEW" }[] = [
  { topic: "Preteritum — uregelrette verb", status: "REUSED" },
  { topic: "Kapittel 4 — perfektum", status: "REUSED" },
  { topic: "Kapittel 5 — modale verb", status: "NEW" },
  { topic: "Uregelrette verb — B2 nivå", status: "NEW" },
];

const LEVELS: { label: string; isNew: boolean }[] = [
  { label: "A1", isNew: false },
  { label: "A2", isNew: false },
  { label: "B1", isNew: false },
  { label: "B2", isNew: true },
  { label: "C1", isNew: true },
];

export const FeatureGrammarDrillsNorwegianPwaM21: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const globalIn = seg(frame, 0, 15); // persistent chrome, never fades out

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 190, 206));
  const b2 = seg(frame, 215, 231) * (1 - seg(frame, 357, 373));
  const b3 = seg(frame, 382, 398) * (1 - seg(frame, 534, 550));
  const b4 = seg(frame, 559, 575) * (1 - seg(frame, 703, 719));
  const b5 = seg(frame, 728, 744); // holds through 911

  const dx = dividerX(frame);
  const chaosW = Math.max(0, dx - 40);
  const orderX = dx + 20;
  const orderW = Math.max(0, 1240 - dx);

  const checkPop = pop(410);
  const chipPop = pop(430);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- persistent chrome: the split that never leaves ---------------- */}
        <Panel x={20} y={110} w={chaosW} h={470} tone="danger" opacity={globalIn} />
        <Panel x={orderX} y={110} w={orderW} h={470} tone="success" opacity={globalIn} />
        <div
          style={{
            position: "absolute",
            left: dx - 1,
            top: 90,
            width: 2,
            height: 520,
            background: P.ink,
            opacity: 0.18 * globalIn,
          }}
        />
        <StatPill x={40} y={34} emoji="🔀" text="RANDOM DRILLS" tone="danger" opacity={globalIn} />
        <StatPill x={940} y={34} emoji="📗" text="TEXTBOOK SYLLABUS" tone="success" opacity={globalIn} />

        {/* ---------------- beat 1 : random verbs, no plan ---------------- */}
        <Group opacity={b1}>
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 24,
              padding: "10px 20px",
              borderRadius: 999,
              background: P.card,
              border: `1.5px solid ${P.accentEdge}`,
              boxShadow: CARD_SHADOW,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 17,
              fontWeight: 700,
              color: P.ink,
            }}
          >
            <span style={{ fontSize: 22 }}>🎧</span> Mini Elvarika — Norwegian by Ear
          </div>
          <StickyNote x={40} y={110} w={170} rotate={-6} text="gi → ga → gitt" opacity={b1} />
          <StickyNote x={230} y={115} w={170} rotate={4} text="se → så → sett" opacity={b1} />
          <StickyNote x={600} y={165} w={190} rotate={-3} text="dra → dro → dratt" opacity={b1} />
          <StickyNote x={60} y={500} w={170} rotate={5} text="ta → tok → tatt" opacity={b1} />
          <StickyNote x={300} y={505} w={180} rotate={-4} text="gå → gikk → gått" opacity={b1} />
          <CaptionBand tone="danger" opacity={b1} text="Vocabulary lessons were solid — grammar drills were just random verbs." />
        </Group>

        {/* ---------------- beat 2 : the real hub, no link to a book ---------------- */}
        <Group opacity={b2} dy={interpolate(frame, [215, 231], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}>
          <LiveWindow
            file={shots}
            shot={HUB_SHOT}
            title="vitalii.no/features"
            from={215}
            hold={158}
            zoom={(t) => 1 + 0.14 * easeInOut(t)}
            focus={{ x: 0.5, y: 0.4 }}
            opacity={b2}
            win={{ x: 50, y: 140, w: 560, h: 380 }}
          />
          <div style={{ position: "absolute", left: 150, top: 534, fontSize: 36, opacity: b2 }}>📘</div>
          <div style={{ position: "absolute", left: 330, top: 534, fontSize: 36, opacity: b2 }}>✕</div>
          <div style={{ position: "absolute", left: 510, top: 534, fontSize: 36, opacity: b2 }}>🧩</div>
          <CaptionBand tone="danger" opacity={b2} text="No link to the textbook, and nobody checking if the Norwegian was right." />
        </Group>

        {/* ---------------- beat 3 : the real page, Claude checks every drill ---------------- */}
        <Group opacity={b3} dy={interpolate(frame, [382, 398], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}>
          <LiveWindow
            file={shots}
            shot={PAGE_SHOT}
            title="vitalii.no/features/…-m21"
            from={382}
            hold={168}
            zoom={(t) => 1 + 0.1 * easeInOut(t)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={b3}
            win={{ x: 750, y: 140, w: 460, h: 380 }}
          />
          <CheckBadge x={1170} y={118} size={42} opacity={b3} scale={checkPop} />
          <FilterChip x={990} y={536} text="Claude" icon="🤖" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <div style={{ position: "absolute", left: 850, top: 582, width: 320, textAlign: "center", fontSize: 13, fontWeight: 600, color: P.muted, opacity: b3 }}>
            reads every drill before it's saved
          </div>
          <CaptionBand tone="accent" opacity={b3} text="Drills now follow that same textbook, and Claude checks each one first." />
        </Group>

        {/* ---------------- beat 4 : blocks reused, not rewritten ---------------- */}
        <Group opacity={b4} dy={interpolate(frame, [559, 575], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}>
          <Panel x={560} y={140} w={660} h={380} tone="card" opacity={b4}>
            <div style={{ position: "absolute", left: 28, top: 18, fontSize: 15, fontWeight: 800, letterSpacing: 1, color: P.muted }}>
              grammar_blocks — reused before regenerated
            </div>
            {ROWS.map((r, i) => {
              const t = seg(frame, 575 + i * 14, 591 + i * 14);
              const isNew = r.status === "NEW";
              return (
                <div
                  key={r.topic}
                  style={{
                    position: "absolute",
                    left: 28,
                    top: 64 + i * 56,
                    width: 604,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    opacity: t,
                    transform: `translateX(${(1 - t) * 18}px)`,
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 700, color: P.ink }}>{r.topic}</span>
                  <span
                    style={{
                      padding: "3px 12px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      background: isNew ? P.accentBg : P.chipBg,
                      border: `1.5px solid ${isNew ? P.accentEdge : P.border}`,
                      color: isNew ? P.accent : P.muted,
                    }}
                  >
                    {r.status}
                  </span>
                </div>
              );
            })}
            <div
              style={{
                position: "absolute",
                left: 28,
                top: 300,
                width: 604,
                fontSize: 15,
                fontWeight: 700,
                color: P.accent,
                opacity: seg(frame, 650, 666),
              }}
            >
              🔧 One fix, saved once — reused everywhere it repeats.
            </div>
          </Panel>
          <CaptionBand tone="accent" opacity={b4} text="Blocks are reused, not rewritten — fix it once, and it stays fixed." />
        </Group>

        {/* ---------------- beat 5 : verb drills reach B2 and C1 ---------------- */}
        <Group opacity={b5}>
          <LogWindow
            win={{ x: 470, y: 140, w: 740, h: 360 }}
            title="grammar drills"
            from={740}
            every={18}
            opacity={b5}
            fontSize={22}
            lines={[
              { t: "syllabus", text: "God i norsk 1/2 — page-linked", tone: "ink" },
              { t: "blocks", text: "grammar_blocks — reused, not rewritten", tone: "ink" },
              { t: "check", text: "Claude proofread — before every save", tone: "success" },
              { t: "pace", text: "interval — configurable per topic", tone: "muted" },
              { t: "levels", text: "verb drills — now A1 through B2 · C1", tone: "accent" },
            ]}
          />
          <div style={{ position: "absolute", left: 470, top: 516, width: 740, display: "flex", justifyContent: "space-between" }}>
            {LEVELS.map((lv, i) => {
              const t = seg(frame, 744 + i * 8, 760 + i * 8);
              return (
                <div
                  key={lv.label}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 800,
                    background: lv.isNew ? P.accentBg : P.chipBg,
                    border: `1.5px solid ${lv.isNew ? P.accentEdge : P.border}`,
                    color: lv.isNew ? P.accent : P.muted,
                    opacity: t,
                    transform: `translateY(${(1 - t) * 8}px)`,
                  }}
                >
                  {lv.label}
                </div>
              );
            })}
          </div>
          <CaptionBand tone="success" opacity={b5} text="Verb drills now reach all the way through B2 and C1." />
        </Group>
      </div>
    </PaletteProvider>
  );
};
