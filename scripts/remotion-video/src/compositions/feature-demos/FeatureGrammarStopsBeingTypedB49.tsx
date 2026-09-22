/**
 * FeatureGrammarStopsBeingTypedB49 — feature b49 — 1280x720, 968 frames @ 30fps, VOICE-SYNCED.
 *
 * Archetype 0 "split duel" (pre-assigned, not redrawn here): the frame is
 * halved by a moving divider — typing-by-hand (danger, left) against
 * tap-to-answer (success, right). The divider starts wide-danger through the
 * problem beats (1-3) and slides left as the fix takes over the frame,
 * settling almost fully green for the resolution.
 *
 * UI beats (4, 5) play REAL recordings via LiveWindow, driven by
 * shots/b49.json (STEP 0c): the feature's own write-up page and the
 * features hub — the only two verified public URLs for this feature.
 * Beats 1-3 are drawn (a phone keyboard and a kid's own wrong answers,
 * neither of which is a page a viewer could visit). Beat 4 also carries a
 * drawn schematic of the chunk-and-decoy mechanism, since no commit diff was
 * supplied for this feature.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15–167  "My son typed grammar answers on his phone — zero of eight right in one sitting."
 *  b2 176–347  "Three had the right word, killed by one stray typo. He gave up, started typing junk."
 *  b3 356–459  "A keyboard was punishing spelling, not testing grammar."
 *  b4 468–710  "I replaced typing with tapping — word chunks, shuffled with decoys, built in React. No keyboard, no typos."
 *  b5 719–923  "It even recovers old exercises with no saved answer: seventeen of thirty, fixed automatically." — holds to 968.
 *
 * Single tech name in the whole clip: React (beat 4 chip only).
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Group, StatPill, FilterChip, CheckBadge, CaptionBand, Panel, StickyNote, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shots from "./shots/b49.json";

const P = MOODS.slate;
const STAGE_H = 600;

const hero = (value: string, unit: string | undefined, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: 300,
      top: 12,
      width: 460,
      transform: `scale(${0.85 + 0.15 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 800, letterSpacing: -2, color, fontVariantNumeric: "tabular-nums" }}>
      {value}
      {unit ? <span style={{ fontSize: 64 * 0.36, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, letterSpacing: 1.6, color: P.muted }}>{label}</div>
  </div>
);

const TYPOS = [
  { word: "went", typed: "wemt" },
  { word: "school", typed: "schoool" },
  { word: "played", typed: "plyed" },
] as const;

const CHUNKS = [
  { text: "went", ok: true },
  { text: "to", ok: true },
  { text: "school", ok: true },
  { text: "hordii", ok: false },
  { text: "cvh", ok: false },
] as const;

export const FeatureGrammarStopsBeingTypedB49: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 167, 183));
  const b2 = seg(frame, 176, 192) * (1 - seg(frame, 347, 363));
  const b3 = seg(frame, 356, 372) * (1 - seg(frame, 459, 475));
  const b4 = seg(frame, 468, 484) * (1 - seg(frame, 710, 726));
  const b5 = seg(frame, 719, 735); // holds through 968, no fade-out

  const heroPop5 = pop(719);

  // divider stays wide-danger through the problem beats, then slides left as tapping takes over
  const dividerX = interpolate(
    frame,
    [0, 459, 485, 710, 736, 968],
    [900, 900, 560, 560, 260, 260],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );

  const oldLabelOpacity = interpolate(frame, [0, 468, 650], [1, 1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newLabelOpacity = seg(frame, 459, 485);

  // beat 4: independent slide-in ramp, the required non-crossfade transition
  const slide4 = interpolate(frame, [468, 502], [64, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const chunkBob = (i: number) => Math.sin(frame / 9 + i * 1.3) * 4;

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ---------------- persistent split stage ---------------- */}
        <div style={{ position: "absolute", left: 0, top: 0, width: dividerX, height: STAGE_H, background: P.dangerBg }} />
        <div
          style={{
            position: "absolute",
            left: dividerX,
            top: 0,
            width: 1280 - dividerX,
            height: STAGE_H,
            background: P.successBg,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: dividerX - 3,
            top: 0,
            width: 6,
            height: 620,
            background: P.accent,
            boxShadow: `0 0 18px ${P.accent}`,
          }}
        />
        <div style={{ position: "absolute", left: 0, top: STAGE_H, width: 1280, height: 720 - STAGE_H, background: P.card }} />

        <div
          style={{
            position: "absolute",
            left: 40,
            top: 24,
            padding: "6px 16px",
            borderRadius: 999,
            background: P.dangerBg,
            border: `1.5px solid ${P.dangerEdge}`,
            color: P.danger,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1.2,
            opacity: oldLabelOpacity,
            fontFamily,
          }}
        >
          📱 TYPING BY HAND
        </div>
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 24,
            padding: "6px 16px",
            borderRadius: 999,
            background: P.successBg,
            border: `1.5px solid ${P.successEdge}`,
            color: P.success,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1.2,
            opacity: newLabelOpacity,
            fontFamily,
          }}
        >
          🧩 TAP TO ANSWER
        </div>

        {/* ---------------- beat 1 : zero of eight, typed on a phone ---------------- */}
        <Group opacity={b1}>
          <Panel x={90} y={120} w={620} h={280} tone="danger">
            <div style={{ position: "absolute", left: 32, top: 22, fontSize: 22, fontWeight: 800, color: P.ink }}>🔤 GRAMMAR ON A PHONE</div>
            <div style={{ position: "absolute", left: 32, top: 70, fontSize: 44, fontWeight: 800, color: P.danger, fontVariantNumeric: "tabular-nums" }}>
              0 / 8 correct
            </div>
            <div style={{ position: "absolute", left: 32, top: 128, fontSize: 17, color: P.muted, fontWeight: 600 }}>one sitting, zero right</div>
          </Panel>
          <StickyNote x={760} y={140} w={220} text="📚 Boytasks — a home-learning app for kids" opacity={b1} rotate={-2} />
          <CaptionBand y={646} text="My son typed grammar answers on his phone — zero of eight right." tone="danger" opacity={b1} />
        </Group>

        {/* ---------------- beat 2 : one typo away, then he gave up ---------------- */}
        <Group opacity={b2}>
          <Panel x={60} y={120} w={320} h={280} tone="danger">
            <div style={{ position: "absolute", left: 20, top: 18, fontSize: 17, fontWeight: 800, color: P.ink }}>1 TYPO = WRONG</div>
            {TYPOS.map((t, i) => (
              <div key={t.word} style={{ position: "absolute", left: 20, top: 56 + i * 40, fontSize: 15, fontWeight: 700 }}>
                <span style={{ color: P.success }}>{t.word}</span>
                <span style={{ color: P.muted }}> → </span>
                <span style={{ color: P.danger, textDecoration: "line-through" }}>{t.typed}</span>
                <span> ❌</span>
              </div>
            ))}
          </Panel>
          <Panel x={400} y={120} w={820} h={280} tone="danger" opacity={b2}>
            <div style={{ position: "absolute", left: 32, top: 22, fontSize: 17, fontWeight: 800, color: P.ink }}>😤 THEN HE JUST GAVE UP</div>
            <div style={{ position: "absolute", left: 32, top: 62, fontSize: 15, color: P.muted, fontWeight: 600, width: 750 }}>
              Real answers he typed after the third red X in a row — mashed keys, not attempts at the word:
            </div>
            <div style={{ position: "absolute", left: 32, top: 116, display: "flex", gap: 16, flexWrap: "wrap", width: 750 }}>
              {["Hhh", "Cvh", "asdf", "jjjj"].map((junk) => (
                <div
                  key={junk}
                  style={{
                    padding: "12px 26px",
                    borderRadius: 12,
                    background: P.card,
                    border: `2px solid ${P.dangerEdge}`,
                    color: P.danger,
                    fontWeight: 800,
                    fontSize: 28,
                    fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
                  }}
                >
                  {junk}
                </div>
              ))}
            </div>
          </Panel>
          <CaptionBand y={646} text="Three had the right word, killed by one stray typo." tone="danger" opacity={b2} />
        </Group>

        {/* ---------------- beat 3 : a keyboard punishes spelling, not grammar ---------------- */}
        <Group opacity={b3}>
          <Panel x={90} y={150} w={900} h={200} tone="accent">
            <StatPill x={30} y={30} emoji="🚫" text="typing tests spelling" tone="danger" opacity={b3} />
            <StatPill x={490} y={30} emoji="🧩" text="tapping tests grammar" tone="success" opacity={b3} />
            <div style={{ position: "absolute", left: 30, top: 110, display: "flex", gap: 10 }}>
              {CHUNKS.slice(0, 3).map((c, i) => (
                <div
                  key={c.text}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: P.successBg,
                    border: `1.5px solid ${P.successEdge}`,
                    color: P.success,
                    fontWeight: 800,
                    fontSize: 16,
                    transform: `translateY(${chunkBob(i) * pop(356)}px)`,
                  }}
                >
                  {c.text}
                </div>
              ))}
            </div>
          </Panel>
          <CaptionBand y={646} text="A keyboard was punishing spelling, not testing grammar." tone="accent" opacity={b3} />
        </Group>

        {/* ---------------- beat 4 : tap to build the answer, built in React ---------------- */}
        <Group opacity={b4}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, transform: `translateX(${slide4}px)` }}>
            <FilterChip x={620} y={72} text="React" icon="🧩" opacity={b4} />
            <div style={{ position: "absolute", left: 750, top: 100, width: 260, fontSize: 12, fontWeight: 600, color: P.muted }}>
              React = the code that draws the tap screen.
            </div>
            <LiveWindow
              file={shots}
              shot="page"
              title="vitalii.no/features/…-b49"
              from={468}
              hold={260}
              opacity={b4}
              win={{ x: 620, y: 124, w: 560, h: 220 }}
            />
            <Panel x={60} y={124} w={520} h={220} tone="success" opacity={b4}>
              <div style={{ position: "absolute", left: 24, top: 18, fontSize: 17, fontWeight: 800, color: P.ink }}>🧩 TAP TO BUILD THE ANSWER</div>
              <div style={{ position: "absolute", left: 24, top: 58, display: "flex", flexWrap: "wrap", gap: 10, width: 470 }}>
                {CHUNKS.map((c, i) => (
                  <div
                    key={c.text}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      background: c.ok ? P.successBg : P.chipBg,
                      border: `1.5px solid ${c.ok ? P.successEdge : P.border}`,
                      color: c.ok ? P.success : P.muted,
                      fontWeight: 800,
                      fontSize: 15,
                      transform: `translateY(${chunkBob(i)}px)`,
                    }}
                  >
                    {c.text}
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", left: 24, top: 142, width: 470, fontSize: 13, fontWeight: 700, color: P.muted }}>
                3 real chunks + 2 decoys — one thumb can't misspell a tap
              </div>
            </Panel>
            <LogWindow
              lines={[
                { t: "15:21", text: "(alive, no change) PRESENT=[]", tone: "muted" },
                { t: "15:21", text: "PRESENT=['hordii'] [pushed] (+['hordii'] -[])", tone: "accent" },
                { t: "15:21", text: "PRESENT=['UNKNOWN', 'hordii'] (+['UNKNOWN'] -[])", tone: "muted" },
                { t: "15:25", text: "PRESENT=['egor'] (+[] -['UNKNOWN', 'hordii'])", tone: "success" },
                { t: "15:26", text: "PRESENT=[] [pushed] (+[] -['egor'])", tone: "danger" },
              ]}
              title="boytasks · presence · 2026-08-28 (real, live)"
              from={520}
              every={18}
              opacity={b4}
              fontSize={20}
              win={{ x: 60, y: 360, w: 1120, h: 250 }}
            />
          </div>
          <CaptionBand y={646} text="Tap to build the answer — word chunks, shuffled with decoys." tone="accent" opacity={b4} />
        </Group>

        {/* ---------------- beat 5 : seventeen of thirty, recovered automatically ---------------- */}
        <Group opacity={b5}>
          {hero("17/30", undefined, "OLD EXERCISES RECOVERED AUTOMATICALLY", P.success, heroPop5)}
          <CheckBadge x={790} y={18} size={44} opacity={b5} scale={heroPop5} />
          <LiveWindow
            file={shots}
            shot="hub"
            title="vitalii.no/features"
            from={719}
            hold={260}
            zoom={() => 1.18}
            focus={{ x: 0.5, y: 0.28 }}
            opacity={b5}
            win={{ x: 260, y: 120, w: 860, h: 440 }}
          />
          <StatPill x={260} y={572} emoji="📚" text="the other 13 correctly declined" tone="success" opacity={b5} />
          <CaptionBand y={646} text="Seventeen of thirty exercises recovered automatically." tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
