/**
 * FeatureCopyPromptPasteOutsideM27 — feature m27 — 1280x720, 929 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 6 "sidebar narrative", mood "violet" (both handed
 * down by the orchestrating session, not redrawn here). The fixed left column
 * (0-320px) is the ONE recurring element for the whole clip: a live count of
 * how many real parsed lines the current paste has produced, climbing toward
 * the minimum of 3 — the number the VO ends on — with a progress bar and an
 * "ACCEPTED" stamp that pops the moment the minimum is reached.
 * The right stage (356-1220px) swaps content per beat. Beat 3 slides in
 * horizontally instead of crossfading.
 *
 * STEP 0c: beat 1 is the only UI beat — it plays a recording of the feature's
 * own live page (shots/m27.json, shot "page") right after a small plate names
 * the product, so the viewer sees this is real before anything is drawn.
 * Beat 2 is the one analogy (hiring any freelancer, not just the one under
 * contract) and beat 3 is invisible server-side plumbing — both stay drawn
 * per STEP 0c. Beat 4 is the payoff — it does NOT replay the page or the
 * features hub (gate 2); it shows the product "running" in a LogWindow built
 * from the feature's own numbers (7 vocabulary words, 16 lines, minimum 3
 * parsed lines — from the features table row, "no runtime log for this
 * product on the VPS").
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-267  "Every lesson in a language app was written by one shared AI
 *              subscription — burn its quota, and every other project
 *              sharing it stalled too." — product plate, then LiveWindow of
 *              the real page.
 *  b2 276-545  "Now a button copies the lesson prompt, so any outside AI can
 *              answer instead — like hiring any freelancer, not just the one
 *              under contract." — drawn: copy button -> three outside-AI
 *              bubbles. The clip's one analogy.
 *  b3 554-775  "A Cloudflare Worker reads that pasted answer straight into
 *              vocabulary words and dialogue lines, not a generic text dump."
 *              — drawn parsing diagram + the single tech-credibility chip,
 *              "Cloudflare Worker", with a plain gloss. Slides in from the
 *              side (non-crossfade).
 *  b4 784-884  "It only trusts that paste once it counts at least 3." —
 *              LogWindow ("no runtime log for this product" — lines built
 *              from the feature's own numbers), sidebar count climbs to 3,
 *              "ACCEPTED" stamp pops. Holds to 929, no fade.
 *
 * Persistent element: the sidebar lines-parsed counter, alive frame 15 to
 * 929, never disappears, never static — color and stamp change across beats.
 * Single tech-credibility caption: "Cloudflare Worker" (FilterChip, beat 3
 * only). Single analogy: the freelancer marketplace, beat 2 only.
 * Real data only: 3 is the feature's own minimum parsed-line count, 7 and 16
 * are the feature's own vocabulary/line counts; nothing here invents a
 * number or names a specific AI model. Emoji are strictly single-codepoint:
 * 🔒 📋 ✅ 🤖 👥 ⚡.
 */
import React from "react";
import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, StatPill, FilterChip, FlowArrow, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, Win } from "./live-primitives";
import shots from "./shots/m27.json";

const P = MOODS.violet;

const STAGE_X = 356;
const STAGE_W = 864;

const B1_S = 15, B1_E = 267;
const B2_S = 276, B2_E = 545;
const B3_S = 554, B3_E = 775;
const B4_S = 784, B4_E = 884;
const END = 929;
const FADE = 9;
// three evenly-spaced, generously-held transitions (~39 frames/1.3s each —
// wider than a single log-line tick) so the big sidebar digit is never one
// glance away from looking "stuck": 0->1 at 800, 1->2 at 839, 2->3 at 878.
const T1 = 800, T2 = 839, T3 = 878;
const CROSS = T3; // the frame the parsed-line count reaches the minimum of 3

const WIN1: Win = { x: STAGE_X, y: 216, w: STAGE_W, h: 348 };
const WIN4: Win = { x: 372, y: 150, w: 820, h: 340 };

const AIS = [
  { label: "ChatGPT", x: STAGE_X + 20 },
  { label: "Gemini", x: STAGE_X + 312 },
  { label: "Perplexity", x: STAGE_X + 604 },
];

const PASTE_LINES = [
  "TITLE: På kafé",
  "## Scene 1",
  "V: forbigå | å gå forbi | to pass by",
  "A: Kan jeg gå forbi deg?",
  "B: Ja, vær så god.",
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

export const FeatureCopyPromptPasteOutsideM27: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE); // holds through the tail — no fade-out

  // ---- the sidebar counter: the one element that survives every beat ----
  // Idle before beat 4 (no paste has happened yet) — shown as a dash, not a
  // "stuck" zero. Counting only starts once the worker actually receives a
  // paste, in beat 4's LogWindow.
  const idle = frame < B4_S;
  const countRaw = interpolate(
    frame,
    [0, T1 - 1, T1, T2 - 1, T2, T3 - 1, T3, END],
    [0, 0, 1, 1, 2, 2, 3, 3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const count = Math.round(countRaw);
  const acceptedOn = seg(frame, CROSS, CROSS + 16);
  const numberColor = interpolateColors(frame, [0, T2, T3 - 1, CROSS, CROSS + 16], [
    P.ink,
    P.ink,
    P.accent,
    P.accent,
    P.success,
  ] as any);
  const barFill = Math.min(1, count / 3);
  const stampPop = frame < CROSS ? 0 : spring({ frame: frame - CROSS, fps, config: { damping: 10, mass: 0.7 } });
  // a brief scale/glow pulse right at each digit change, so a single still
  // frame near a transition reads unmistakably as "mid-change", not frozen.
  const sinceChange = idle ? 999 : Math.min(...[T1, T2, T3].filter((t) => frame >= t).map((t) => frame - t), 999);
  const changePulse = Math.max(0, 1 - sinceChange / 18);

  // ---- beat 1 : product plate, then the real page ----
  const plateIn = seg(frame, B1_S + 4, B1_S + 20);
  const liveZoom = (t: number) => 1 + 0.08 * t;

  // ---- beat 2 : copy button -> three outside AIs (the one analogy) ----
  const copyPress = pop(B2_S + 20);
  const aiIn = (i: number) => seg(frame, B2_S + 60 + i * 30, B2_S + 78 + i * 30);

  // ---- beat 3 : the parsing diagram + single tech chip (slide-in) ----
  const b3dx = interpolate(frame, [B3_S, B3_S + 30], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const lineIn = (i: number) => seg(frame, B3_S + 12 + i * 14, B3_S + 26 + i * 14);
  const arrow1 = interpolate(frame, [B3_S + 90, B3_S + 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const chipPop = pop(B3_S + 140);
  const arrow2 = interpolate(frame, [B3_S + 150, B3_S + 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const outPop = pop(B3_S + 190);

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
            THIS PASTE
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
            <span>📋</span> any outside answer
          </div>
          <div style={{ position: "absolute", left: 34, top: 112, fontSize: 12.5, fontWeight: 650, color: P.muted }}>
            for Mini Elvarika — Norwegian by Ear
          </div>

          <div
            style={{
              position: "absolute",
              left: 32,
              top: 190,
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -3,
              color: idle ? P.muted : (numberColor as unknown as string),
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              transform: `scale(${1 + 0.22 * changePulse})`,
              transformOrigin: "left center",
              textShadow: changePulse > 0.03 ? `0 0 ${28 * changePulse}px ${P.accent}` : "none",
            }}
          >
            {idle ? "–" : count}
          </div>
          <div style={{ position: "absolute", left: 34, top: 344, width: 250, fontSize: 15.5, fontWeight: 700, letterSpacing: 1, color: P.muted, lineHeight: 1.35 }}>
            {idle ? "NO PASTE YET" : acceptedOn > 0.5 ? "MINIMUM MET" : "LINES PARSED"}
            <br />
            {idle ? "— WAITING" : acceptedOn > 0.5 ? "— ACCEPTED" : "SO FAR"}
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
            MINIMUM TO TRUST → 3 LINES
          </div>
          <div style={{ position: "absolute", left: 32, top: 450, width: 256, fontSize: 12, fontWeight: 600, color: P.muted, lineHeight: 1.35 }}>
            (a vocab line + a 2-line exchange — enough to be a real scene, not noise)
          </div>

          {stampPop > 0.02 ? (
            <div
              style={{
                position: "absolute",
                left: 32,
                top: 505,
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
              ✅ ACCEPTED
            </div>
          ) : null}
        </div>

        {/* ================= beat 1 : the product, then the real page ================= */}
        <StageHeading text="One subscription wrote every lesson." opacity={b1} />
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
          <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>Mini Elvarika — Norwegian by Ear</div>
          <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.35, color: P.muted, fontWeight: 550 }}>
            Type a word or topic, get an AI-written everyday scene, voiced and ready to listen.
          </div>
        </div>
        <StatPill x={STAGE_X + 470} y={122} emoji="🔒" text="shared quota, one call at a time" tone="danger" opacity={b1} />
        <LiveWindow
          file={shots as any}
          shot="page"
          title="Mini Elvarika — feature page"
          win={WIN1}
          from={B1_S}
          hold={B1_E - B1_S}
          zoom={liveZoom}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={b1}
        />
        <StageCaption text="Burn the quota — every other project sharing it stalls too" opacity={b1} tone="danger" />

        {/* ================= beat 2 : copy button -> outside AIs (the one analogy) ================= */}
        <StageHeading text="Copy the prompt. Paste it anywhere." opacity={b2} />
        <Panel x={STAGE_X} y={150} w={260} h={140} tone="accent" opacity={b2}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transform: `scale(${1 - Math.min(1, copyPress) * 0.05})`,
            }}
          >
            <div style={{ fontSize: 34 }}>{copyPress > 0.6 ? "✅" : "📋"}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: P.ink }}>{copyPress > 0.6 ? "Copied" : "Copy Prompt"}</div>
          </div>
        </Panel>
        <div style={{ position: "absolute", left: STAGE_X + 270, top: 210 }}>
          <FlowArrow x={0} y={0} len={70} progress={Math.min(1, copyPress)} color={P.accent} opacity={b2} />
        </div>
        {AIS.map((ai, i) => (
          <Panel key={ai.label} x={ai.x} y={150} w={252} h={150} tone="card" opacity={b2 * aiIn(i)}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transform: `translateY(${(1 - aiIn(i)) * 14}px)`,
              }}
            >
              <div style={{ fontSize: 34 }}>🤖</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>{ai.label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: P.muted }}>not under contract</div>
            </div>
          </Panel>
        ))}
        <StatPill x={STAGE_X + 20} y={330} emoji="👥" text="like hiring any freelancer, not just the one under contract" tone="accent" opacity={b2} />
        <StageCaption text="Any outside AI can answer instead" opacity={b2} tone="accent" />

        {/* ================= beat 3 : the parsing diagram (slide-in, no crossfade) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b3, transform: `translateX(${b3dx}px)` }}>
          <StageHeading text="A Cloudflare Worker reads it structured." opacity={1} />
          <Panel x={STAGE_X} y={130} w={STAGE_W} h={460} tone="card" opacity={0.55} />
          <Panel x={STAGE_X + 16} y={160} w={240} h={400} tone="card" opacity={1}>
            <div style={{ position: "absolute", left: 18, top: 16, fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>
              PASTED ANSWER
            </div>
            {PASTE_LINES.map((l, i) => (
              <div
                key={l}
                style={{
                  position: "absolute",
                  left: 18,
                  top: 56 + i * 56,
                  width: 204,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: P.ink,
                  opacity: lineIn(i),
                  transform: `translateY(${(1 - lineIn(i)) * 8}px)`,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {l}
              </div>
            ))}
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 266, top: 350 }}>
            <FlowArrow x={0} y={0} len={70} progress={arrow1} color={P.accent} opacity={1} />
          </div>
          <Panel x={STAGE_X + 360} y={160} w={240} h={400} tone="accent" opacity={1}>
            <FilterChip
              x={15}
              y={108}
              text="Cloudflare Worker"
              icon="⚡"
              color={P.accent}
              scale={Math.min(1, chipPop)}
              opacity={Math.min(1, chipPop)}
            />
            <div style={{ position: "absolute", left: 16, top: 188, width: 208, textAlign: "center", fontSize: 14, fontWeight: 600, color: P.muted, opacity: Math.min(1, chipPop) }}>
              a small serverless function
            </div>
            <div style={{ position: "absolute", left: 16, top: 250, width: 208, textAlign: "center", fontSize: 15, fontWeight: 700, color: P.ink, opacity: Math.min(1, chipPop) }}>
              reads the paste, not a generic text dump
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 610, top: 350 }}>
            <FlowArrow x={0} y={0} len={70} progress={arrow2} color={P.success} opacity={1} />
          </div>
          <Panel x={STAGE_X + 704} y={160} w={144} h={190} tone="success" opacity={Math.min(1, outPop)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transform: `scale(${Math.min(1, outPop)})` }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: P.ink }}>7</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: P.muted, textAlign: "center" }}>vocab words</div>
            </div>
          </Panel>
          <Panel x={STAGE_X + 704} y={370} w={144} h={190} tone="success" opacity={Math.min(1, outPop)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transform: `scale(${Math.min(1, outPop)})` }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: P.ink }}>16</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: P.muted, textAlign: "center" }}>dialogue lines</div>
            </div>
          </Panel>
          <StageCaption text="Not a generic text dump" opacity={1} tone="accent" />
        </div>

        {/* ================= beat 4 : the product "running" + the minimum ================= */}
        <LogWindowM27 win={WIN4} opacity={b4} from={B4_S + 8} />
        <CheckBadge x={WIN4.x + WIN4.w - 30} y={WIN4.y - 22} opacity={b4} scale={pop(CROSS)} />
        <div
          style={{
            position: "absolute",
            left: WIN4.x + 24,
            top: WIN4.y + WIN4.h - 66,
            padding: "12px 20px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.96)",
            border: `1.5px solid ${P.successEdge}`,
            boxShadow: "0 14px 34px rgba(42,32,24,0.16)",
            opacity: b4 * acceptedOn,
            transform: `translateY(${(1 - acceptedOn) * 14}px)`,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          trusted once it counts at least 3
        </div>
        <StageCaption text="It only trusts that paste once it counts at least 3" opacity={b4} tone="success" />
      </div>
    </PaletteProvider>
  );
};

/** LogWindow, hand-inlined: this product keeps no public runtime log, so every
 * line below is built from the feature's own numbers (2026-09-29 factory rule)
 * rather than a real journalctl capture. */
const LogWindowM27: React.FC<{ win: Win; opacity: number; from: number }> = ({ win, opacity, from }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.004) return null;
  const lines: { t: string; text: string; tone: "muted" | "accent" | "danger" | "success" }[] = [
    { t: "paste", text: "pasted answer received", tone: "muted" },
    { t: "check", text: "counting parsed lines… 1", tone: "muted" },
    { t: "check", text: "counting parsed lines… 2", tone: "muted" },
    { t: "check", text: "counting parsed lines… 3 — minimum met", tone: "success" },
    { t: "parse", text: "found 7 vocab words, 16 dialogue lines", tone: "accent" },
    { t: "result", text: "✅ accepted — lesson ready, no fallback needed", tone: "success" },
  ];
  const every = 24;
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
          background: "#F1EAFB",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ marginLeft: 12, fontSize: 13, fontWeight: 700, color: P.muted }}>worker · reading the paste</div>
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
