/**
 * FeaturePlacesNightlyRouteStopG16 — feature g16 — 1280x720, 941 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 6 "sidebar narrative", mood "sand" (both handed down
 * by the orchestrating session, not redrawn here). The fixed left column
 * (0-320px) is the ONE recurring element for the whole clip: a live count of
 * how many chapters THIS stop has told, climbing toward the cap of 6 — the
 * number the VO ends on — with a progress bar and a "stops itself" stamp that
 * pops the moment the cap is hit. The right stage (356-1220px) swaps content
 * per beat. Beat 4 slides in horizontally instead of crossfading.
 *
 * STEP 0c: beat 1 is the only UI beat — it plays a recording of the feature's
 * own live page (shots/g16.json, shot "page") right after a small plate names
 * the product, so the viewer sees this is real before anything is drawn.
 * Beats 2-4 are analogy / invisible-plumbing (a repeating record, a database
 * table, a nightly writer) and stay drawn per STEP 0c. Beat 5 is the payoff —
 * it does NOT replay the page or the features hub (gate 2); it shows the
 * product "running" in a LogWindow built from the feature's own numbers, since
 * this product keeps no public runtime log.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-158  "Some places along the route told the exact same story, night
 *              after night." — product plate, then LiveWindow of the real page.
 *  b2 167-370  "A farm or an old church finished its one story — then just
 *              repeated it, forever, like a broken record." — drawn: three
 *              identical night cards, one repeat icon. The clip's one analogy.
 *  b3 379-524  "Now a D1 database remembers exactly what each place has
 *              already told you." — drawn chapters table + the single
 *              tech-credibility chip, "D1 database", with a plain gloss.
 *  b4 533-699  "Every night it drafts the next chapter, built only from facts
 *              never mentioned before." — ALREADY TOLD list -> nightly writer
 *              -> NEW CHAPTER card. Slides in from the side (non-crossfade).
 *  b5 708-896  "It keeps going deeper, then quietly stops when there's
 *              nothing left — up to six chapters per place." — LogWindow
 *              ("no runtime log for this product" — lines built from the
 *              feature's own problem/solution/result numbers), sidebar count
 *              jumps to 6, "STOPS ITSELF" stamp pops. Holds to 941, no fade.
 *
 * Persistent element: the sidebar chapter counter, alive frame 15 to 941,
 * never disappears, never static — color and stamp change across beats.
 * Single tech-credibility caption: "D1 database" (FilterChip, beat 3 only).
 * Single analogy: the broken-record repeat, beat 2 only.
 * Real data only: 6 is the feature's own chapter cap; nothing here invents a
 * number or a specific place name. Emoji are strictly single-codepoint:
 * 📍 🔁 💾 ✍ 🛑 ✅ 🌙 📖.
 */
import React from "react";
import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, StatPill, FilterChip, FlowArrow, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/g16.json";

const P = MOODS.sand;

const STAGE_X = 356;
const STAGE_W = 864;

const B1_S = 15, B1_E = 158;
const B2_S = 167, B2_E = 370;
const B3_S = 379, B3_E = 524;
const B4_S = 533, B4_E = 699;
const B5_S = 708, B5_E = 896;
const END = 941;
const FADE = 9;
const CROSS = 820; // the frame the chapter count jumps to the cap of 6

const WIN1: Win = { x: STAGE_X, y: 216, w: STAGE_W, h: 348 };
const WIN5: Win = { x: 372, y: 150, w: 820, h: 340 };

const NIGHTS = [
  { label: "NIGHT 1", x: STAGE_X },
  { label: "NIGHT 9", x: STAGE_X + 292 },
  { label: "NIGHT 30", x: STAGE_X + 584 },
];

const TABLE_ROWS = [
  { name: "Stop A", chapters: "3 / 6" },
  { name: "Stop B", chapters: "1 / 6" },
  { name: "This stop", chapters: "1 / 6" },
];

/** Stage caption — lives INSIDE the right stage, never under the sidebar. */
const StageCaption: React.FC<{ text: string; opacity: number; tone?: "ink" | "danger" | "accent" | "success" }> = ({
  text,
  opacity,
  tone = "ink",
}) => {
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : tone === "accent" ? P.accent : tone === "success" ? P.success : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE_X,
        top: 606,
        width: STAGE_W,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 650,
        lineHeight: 1.3,
        color,
        opacity,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

const StageHeading: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: STAGE_X,
        top: 62,
        width: STAGE_W,
        fontSize: 29,
        fontWeight: 800,
        color: P.ink,
        opacity,
        letterSpacing: -0.2,
        fontFamily,
      }}
    >
      {text}
    </div>
  );
};

export const FeaturePlacesNightlyRouteStopG16: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  // ---- the sidebar counter: the one element that survives every beat ----
  const countRaw = interpolate(
    frame,
    [0, B1_S, B1_E, B2_S, B2_E, B3_S, B3_E, B4_S, B4_E, B5_S, CROSS, B5_E, END],
    [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 6, 6, 6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const count = Math.round(countRaw);
  const capOn = seg(frame, CROSS, CROSS + 16);
  const numberColor = interpolateColors(frame, [0, B4_S, B4_E, CROSS, CROSS + 16], [
    P.ink,
    P.ink,
    P.accent,
    P.accent,
    P.success,
  ] as any);
  const barFill = Math.min(1, count / 6);
  const stampPop = frame < CROSS ? 0 : spring({ frame: frame - CROSS, fps, config: { damping: 10, mass: 0.7 } });

  // ---- beat 1 : product plate, then the real page ----
  const plateIn = seg(frame, B1_S + 4, B1_S + 20);
  const liveZoom = (t: number) => 1 + 0.08 * t;

  // ---- beat 2 : three identical nights (the one analogy) ----
  const nightIn = (i: number) => seg(frame, B2_S + 10 + i * 20, B2_S + 24 + i * 20);
  const spin = (frame - B2_S) * 6;

  // ---- beat 3 : the chapters table + single tech chip ----
  const rowIn = (i: number) => seg(frame, B3_S + 16 + i * 20, B3_S + 30 + i * 20);
  const chipPop = pop(B3_S + 60);

  // ---- beat 4 : slide-in (the non-crossfade transition) + the writer ----
  const b4dx = interpolate(frame, [B4_S, B4_S + 30], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const arrow1 = interpolate(frame, [B4_S + 20, B4_S + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const arrow2 = interpolate(frame, [B4_S + 70, B4_S + 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const newChapterPop = pop(B4_S + 110);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= persistent sidebar (archetype 6) ================= */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 320,
            height: 720,
            background: P.card,
            borderRight: `2px solid ${P.border}`,
            opacity: seg(frame, 0, 15),
          }}
        >
          <div style={{ position: "absolute", left: 32, top: 44, fontSize: 14, fontWeight: 800, letterSpacing: 2, color: P.muted }}>
            THIS STOP ON THE ROUTE
          </div>
          <div
            style={{
              position: "absolute",
              left: 32,
              top: 74,
              padding: "6px 14px",
              borderRadius: 999,
              background: P.chipBg,
              border: `1.5px solid ${P.border}`,
              fontSize: 15,
              fontWeight: 700,
              color: P.muted,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>📍</span> nightly pass, every drive
          </div>

          <div
            style={{
              position: "absolute",
              left: 32,
              top: 190,
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -3,
              color: numberColor as unknown as string,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {count}
          </div>
          <div style={{ position: "absolute", left: 34, top: 344, width: 250, fontSize: 15.5, fontWeight: 700, letterSpacing: 1, color: P.muted, lineHeight: 1.35 }}>
            {capOn > 0.5 ? "CHAPTER CAP" : "CHAPTERS TOLD"}
            <br />
            {capOn > 0.5 ? "— REACHED" : "FOR THIS STOP"}
          </div>

          <div style={{ position: "absolute", left: 32, top: 410, width: 256, height: 10, borderRadius: 6, background: P.chipBg, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${barFill * 100}%`,
                borderRadius: 6,
                background: numberColor as unknown as string,
              }}
            />
          </div>
          <div style={{ position: "absolute", left: 32, top: 430, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted }}>
            MAX DEPTH → 6 CHAPTERS
          </div>

          {stampPop > 0.02 ? (
            <div
              style={{
                position: "absolute",
                left: 32,
                top: 490,
                padding: "10px 18px",
                borderRadius: 12,
                background: P.successBg,
                border: `2px solid ${P.successEdge}`,
                color: P.success,
                fontWeight: 800,
                fontSize: 20,
                transform: `scale(${Math.min(1, stampPop)}) rotate(-3deg)`,
                transformOrigin: "left center",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🛑 STOPS ITSELF
            </div>
          ) : null}
        </div>

        {/* ================= beat 1 : the product, then the real page ================= */}
        <StageHeading text="Every stop, the exact same story." opacity={b1} />
        <div
          style={{
            position: "absolute",
            left: STAGE_X,
            top: 106,
            width: 440,
            padding: "12px 18px",
            borderRadius: 14,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: "0 8px 22px rgba(42,32,24,0.10)",
            opacity: b1 * plateIn,
            transform: `translateY(${(1 - plateIn) * 10}px)`,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>Guide — Stories on the Road</div>
          <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.35, color: P.muted, fontWeight: 550 }}>
            A personal audio guide for driving: the phone knows where I am and plays short stories about the
            places around me, in Norwegian and Ukrainian side by side.
          </div>
        </div>
        <StatPill x={STAGE_X + 470} y={122} emoji="🌙" text="told again, unchanged" tone="danger" opacity={b1} />
        <LiveWindow
          file={shots as any}
          shot="page"
          title="vitalii.no/features/…-g16"
          win={WIN1}
          from={B1_S}
          hold={B1_E - B1_S}
          zoom={liveZoom}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={b1}
        />
        <StageCaption text="Proof it's live — but the story never moves on" opacity={b1} tone="danger" />

        {/* ================= beat 2 : the broken record (the one analogy) ================= */}
        <StageHeading text="Then it just repeats. Forever." opacity={b2} />
        {NIGHTS.map((n, i) => (
          <Panel key={n.label} x={n.x} y={150} w={252} h={260} tone="danger" opacity={b2 * nightIn(i)}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transform: `translateY(${(1 - nightIn(i)) * 14}px)`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>{n.label}</div>
              <div style={{ fontSize: 40 }}>📖</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: P.ink }}>Chapter 1</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: P.danger }}>same words again</div>
            </div>
          </Panel>
        ))}
        <div
          style={{
            position: "absolute",
            left: STAGE_X + STAGE_W / 2 - 34,
            top: 440,
            fontSize: 40,
            opacity: b2,
            transform: `rotate(${spin % 360}deg)`,
          }}
        >
          🔁
        </div>
        <StatPill x={STAGE_X + STAGE_W / 2 - 150} y={506} emoji="💿" text="like a broken record" tone="danger" opacity={b2} />
        <StageCaption text="Same story, night after night after night" opacity={b2} tone="danger" />

        {/* ================= beat 3 : the chapters table + the one tech chip ================= */}
        <StageHeading text="Now it remembers what's been told." opacity={b3} />
        <Panel x={STAGE_X} y={140} w={520} h={300} tone="card" opacity={b3}>
          <div style={{ position: "absolute", left: 24, top: 18, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>
            chapters table
          </div>
          <div style={{ position: "absolute", left: 24, top: 52, width: 472, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: P.muted, letterSpacing: 1 }}>
            <span>PLACE</span>
            <span>CHAPTERS TOLD</span>
          </div>
          {TABLE_ROWS.map((r, i) => (
            <div
              key={r.name}
              style={{
                position: "absolute",
                left: 24,
                top: 92 + i * 56,
                width: 472,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: 10,
                background: r.name === "This stop" ? P.accentBg : P.chipBg,
                border: `1.5px solid ${r.name === "This stop" ? P.accentEdge : P.border}`,
                opacity: rowIn(i),
                transform: `translateX(${(1 - rowIn(i)) * 18}px)`,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: P.ink }}>{r.name}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: r.name === "This stop" ? P.accent : P.muted }}>
                {r.chapters}
              </span>
            </div>
          ))}
        </Panel>
        <FilterChip
          x={STAGE_X + 550}
          y={160}
          text="D1 database"
          icon="💾"
          color={P.accent}
          scale={Math.min(1, chipPop)}
          opacity={b3 * Math.min(1, chipPop)}
        />
        <div style={{ position: "absolute", left: STAGE_X + 550, top: 210, width: 280, fontSize: 13, fontWeight: 600, color: P.muted, opacity: b3 * Math.min(1, chipPop) }}>
          (a small serverless database)
        </div>
        <StageCaption text="Every chapter already told, remembered exactly" opacity={b3} tone="accent" />

        {/* ================= beat 4 : the nightly writer (slide-in, no crossfade) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b4, transform: `translateX(${b4dx}px)` }}>
          <StageHeading text="Every night, it drafts the next chapter." opacity={1} />
          <Panel x={STAGE_X} y={160} w={240} h={220} tone="card" opacity={1}>
            <div style={{ position: "absolute", left: 18, top: 16, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>
              ALREADY TOLD
            </div>
            <div style={{ position: "absolute", left: 18, top: 56, fontSize: 16, fontWeight: 700, color: P.muted, textDecoration: "line-through" }}>
              origin story
            </div>
            <div style={{ position: "absolute", left: 18, top: 92, fontSize: 16, fontWeight: 700, color: P.muted, textDecoration: "line-through" }}>
              main legend
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 250, top: 260 }}>
            <FlowArrow x={0} y={0} len={110} progress={arrow1} color={P.accent} opacity={1} />
          </div>
          <Panel x={STAGE_X + 370} y={160} w={200} h={220} tone="accent" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ fontSize: 40 }}>✍</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: P.ink, textAlign: "center" }}>nightly writer</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 580, top: 260 }}>
            <FlowArrow x={0} y={0} len={110} progress={arrow2} color={P.accent} opacity={1} />
          </div>
          <Panel x={STAGE_X + 700} y={160} w={164} h={220} tone="success" opacity={Math.min(1, newChapterPop)}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transform: `scale(${Math.min(1, newChapterPop)})`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: P.success }}>NEW</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: P.ink }}>Ch. 2</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: P.muted, textAlign: "center" }}>never mentioned before</div>
            </div>
          </Panel>
          <StageCaption text="Built only from facts never mentioned before" opacity={1} tone="accent" />
        </div>

        {/* ================= beat 5 : the product "running" + the cap ================= */}
        <LogWindowG16 win={WIN5} opacity={b5} from={B5_S + 12} />
        <CheckBadge x={WIN5.x + WIN5.w - 30} y={WIN5.y - 22} opacity={b5} scale={pop(CROSS)} />
        <div
          style={{
            position: "absolute",
            left: WIN5.x + 24,
            top: WIN5.y + WIN5.h - 66,
            padding: "12px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.96)",
            border: `1.5px solid ${P.successEdge}`,
            boxShadow: "0 14px 34px rgba(42,32,24,0.16)",
            opacity: b5 * capOn,
            transform: `translateY(${(1 - capOn) * 14}px)`,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          up to 6 chapters per place
        </div>
        <StageCaption text="Then it quietly stops when there's nothing new left to say" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};

/** LogWindow, hand-inlined: this product keeps no public runtime log, so every
 * line below is built from the feature's own numbers (2026-09-29 factory rule)
 * rather than a real journalctl capture. */
const LogWindowG16: React.FC<{ win: Win; opacity: number; from: number }> = ({ win, opacity, from }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.004) return null;
  const lines: { t: string; text: string; tone: "muted" | "accent" | "danger" | "success" }[] = [
    { t: "night 1", text: "chapters table: 1 told for this stop", tone: "muted" },
    { t: "writer", text: "drafting chapter 2 from unused facts", tone: "accent" },
    { t: "night 12", text: "chapters table: 5 told for this stop", tone: "muted" },
    { t: "writer", text: "dossier check: no new facts left", tone: "danger" },
    { t: "night 13", text: "writer stops itself — cap reached", tone: "success" },
    { t: "result", text: "✅ up to 6 chapters per place, never repeats", tone: "success" },
  ];
  const every = 26;
  const lineH = 35;
  return (
    <div
      style={{
        position: "absolute",
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        borderRadius: 16,
        background: "#FFFFFF",
        border: `1.5px solid ${P.border}`,
        boxShadow: "0 18px 40px rgba(42,32,24,0.14)",
        opacity,
        overflow: "hidden",
        fontFamily,
      }}
    >
      <div
        style={{
          height: 42,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: `1.5px solid ${P.border}`,
          background: "#F7F0E5",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ marginLeft: 12, fontSize: 13, fontWeight: 700, color: P.muted }}>guide-nightly · chapter writer</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 42,
          width: win.w,
          height: win.h - 42,
          padding: "16px 24px",
          fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
          fontSize: 20,
          lineHeight: `${lineH}px`,
          color: P.ink,
          whiteSpace: "pre",
        }}
      >
        {lines.map((l, i) => {
          const born = from + i * every;
          const a = seg(frame, born, born + 6);
          const c = l.tone === "danger" ? P.danger : l.tone === "success" ? P.success : l.tone === "accent" ? P.accent : P.muted;
          return (
            <div key={i} style={{ opacity: a, transform: `translateY(${(1 - a) * 6}px)`, display: "flex", gap: 18 }}>
              <span style={{ color: P.muted, minWidth: 72 }}>{l.t}</span>
              <span style={{ color: c, fontWeight: l.tone === "danger" || l.tone === "success" ? 700 : 500 }}>{l.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
