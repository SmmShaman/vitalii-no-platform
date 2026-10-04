/**
 * FeatureRetiredAgentsGet403G25 — feature g25 — 1280x720, 949 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 6 "sidebar narrative", mood "sand" (both handed down
 * by the orchestrating session, not redrawn here). The fixed left column
 * (0-320px) is the ONE recurring element for the whole clip: a status word
 * for the retired agent's identity, climbing through the exact danger states
 * the VO describes (still active, waking up, won leader), then flipping at
 * the fix to the one real number the clip ends on — 403 — with an
 * "ENFORCED" stamp. The right stage (356-1220px) swaps content per beat.
 * Beat 4 slides in horizontally instead of crossfading.
 *
 * STEP 0c: beat 1 is the only UI beat — right after the product plate names
 * "Guard — Family Network Guard", it plays a recording of the feature's own
 * live page (shots/g25.json, shot "page") as proof this shipped, using the
 * ONLY two verified public URLs for this feature (the page itself and the
 * features hub is not used — a single recording is enough). Beats 2-4 are
 * metaphor / invisible-plumbing (a repeating wake-up clock, a leader-election
 * schematic, a request/KV-check flow) and stay drawn per STEP 0c, since
 * there is no verified GitHub URL to record a real commit diff from — the
 * mechanism is drawn instead, with the real names from commit da36fa9
 * (agent/guard_agent.py, worker/src/index.js, the agents_disabled KV key).
 * Beat 5 is the payoff — it does NOT replay the page or the features hub
 * (gate 2); it shows the product "running" in a LogWindow built from the
 * feature's own problem/solution/result text, since this product keeps no
 * public runtime log on the VPS.
 *
 * Voice-synced beat table (narration windows, MEASURED — do not shift):
 *  b1  15-157  "Imagine firing an employee, but they still show up and
 *              sometimes run the meeting." — product plate, then LiveWindow
 *              of the real page.
 *  b2 166-347  "That's what was happening to one of my automated agents. A
 *              retired one kept waking up on its own schedule." — drawn:
 *              three identical wake-up cards, same time, same ghost. The
 *              clip's one analogy (the repeating alarm).
 *  b3 356-520  "Sometimes it even won the leader election and took over
 *              control with old, outdated code." — drawn: three-agent
 *              leader-election schematic, crown lands on the outdated one.
 *  b4 529-732  "Now every agent sends its identity with each request,
 *              checked against a disabled list on Cloudflare Workers." —
 *              request -> worker -> KV list -> 403 flow, with the single
 *              tech-credibility chip, "Cloudflare Workers", and the two real
 *              file names from the fix. Slides in from the side
 *              (non-crossfade).
 *  b5 741-904  "Any retired id gets rejected instantly, every time, with a
 *              403." — LogWindow ("no public runtime log for this product"
 *              — lines built from the feature's own request/response
 *              shape), sidebar flips to 403, "ENFORCED" stamp pops. Holds to
 *              949, no fade-out.
 *
 * Persistent element: the sidebar identity-status readout, alive frame 15 to
 * 949, never disappears, never static — word and color change across beats,
 * then becomes the clip's one real number.
 * Single tech-credibility caption: "Cloudflare Workers" (FilterChip, beat 4
 * only). Single analogy: the repeating wake-up alarm, beat 2 only.
 * Real data only: 403 is the feature's own HTTP status; agents_disabled,
 * X-Agent-Id, agent/guard_agent.py and worker/src/index.js are the feature's
 * real key, header and file names — nothing here invents a metric. Emoji
 * are strictly single-codepoint: 👻 🪪 ⏰ 🧟 👑 🏆 📋 🤖 🛑 ✅.
 */
import React from "react";
import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, StatPill, FilterChip, IconCard, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, Win } from "./live-primitives";
import shots from "./shots/g25.json";

const P = MOODS.sand;

const STAGE_X = 356;
const STAGE_W = 864;

const B1_S = 15, B1_E = 157;
const B2_S = 166, B2_E = 347;
const B3_S = 356, B3_E = 520;
const B4_S = 529, B4_E = 732;
const B5_S = 741, B5_E = 904;
const END = 949;
const FADE = 9;
const CROSS = 760; // the frame the sidebar flips from "WON LEADER" to the real 403

const WIN1: Win = { x: STAGE_X, y: 216, w: STAGE_W, h: 348 };
const WIN5: Win = { x: 372, y: 150, w: 820, h: 340 };

const WAKES = [
  { label: "MON · 03:14", x: STAGE_X },
  { label: "WED · 03:14", x: STAGE_X + 292 },
  { label: "FRI · 03:14", x: STAGE_X + 584 },
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

export const FeatureRetiredAgentsGet403G25: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE); // holds through the tail — no fade-out

  // ---- the sidebar readout: the one element that survives every beat ----
  const phase = frame < B2_S ? 1 : frame < B3_S ? 2 : frame < CROSS ? 3 : 4;
  const flipped = phase === 4;
  const numberColor = interpolateColors(frame, [0, CROSS, CROSS + 16], [P.danger, P.danger, P.success] as any);
  const barFill = interpolate(frame, [CROSS, CROSS + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampPop = frame < CROSS + 10 ? 0 : spring({ frame: frame - (CROSS + 10), fps, config: { damping: 10, mass: 0.7 } });
  const phaseStart = phase === 1 ? 15 : phase === 2 ? B2_S : phase === 3 ? B3_S : CROSS;
  const swapScale = Math.min(1, 0.85 + 0.15 * pop(phaseStart));

  // ---- beat 1 : product plate, then the real page ----
  const plateIn = seg(frame, B1_S + 4, B1_S + 20);
  const liveZoom = (t: number) => 1 + 0.08 * t;

  // ---- beat 2 : three identical wake-ups (the one analogy) ----
  const wakeIn = (i: number) => seg(frame, B2_S + 10 + i * 20, B2_S + 24 + i * 20);

  // ---- beat 3 : the leader-election schematic ----
  const nodeIn = (i: number) => seg(frame, B3_S + 14 + i * 18, B3_S + 28 + i * 18);
  const crownPop = pop(B3_S + 90);

  // ---- beat 4 : slide-in (the non-crossfade transition) + the check ----
  const b4dx = interpolate(frame, [B4_S, B4_S + 30], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const arrow1 = interpolate(frame, [B4_S + 18, B4_S + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow2 = interpolate(frame, [B4_S + 58, B4_S + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow3 = interpolate(frame, [B4_S + 98, B4_S + 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chipPop = pop(B4_S + 40);
  const resultPop = pop(B4_S + 150);

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
            AGENT ACCESS CONTROL
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
            <span>🪪</span> X-Agent-Id header
          </div>

          <div
            style={{
              position: "absolute",
              left: 32,
              top: flipped ? 190 : 210,
              fontSize: flipped ? 132 : 58,
              fontWeight: 800,
              letterSpacing: flipped ? -3 : -0.5,
              color: numberColor as unknown as string,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.05,
              whiteSpace: "pre-line",
              transform: `scale(${swapScale})`,
              transformOrigin: "left center",
            }}
          >
            {flipped ? "403" : phase === 1 ? "ACTIVE?" : phase === 2 ? "WAKING\nUP" : "WON\nLEADER"}
          </div>
          <div style={{ position: "absolute", left: 34, top: 344, width: 250, fontSize: 15.5, fontWeight: 700, letterSpacing: 1, color: P.muted, lineHeight: 1.35 }}>
            {flipped ? "HTTP STATUS" : "RETIRED AGENT"}
            <br />
            {flipped ? "— ENFORCED" : "STILL HAS A KEY"}
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
            ENFORCEMENT ON KV LIST
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
              🛑 BLOCKED FOR GOOD
            </div>
          ) : null}
        </div>

        {/* ================= beat 1 : the product, then the real page ================= */}
        <StageHeading text="Fired — but it still shows up." opacity={b1} />
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
          <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>Guard — Family Network Guard</div>
          <div style={{ marginTop: 4, fontSize: 11.5, lineHeight: 1.35, color: P.muted, fontWeight: 550 }}>
            A private family-network guard that sees every device on the home Wi-Fi, the Android TV
            stick and the PlayStation, and lets a parent name, time-limit and block any of them.
          </div>
        </div>
        <StatPill x={STAGE_X + 470} y={122} emoji="👻" text="retired, but still logged in" tone="danger" opacity={b1} />
        <LiveWindow
          file={shots as any}
          shot="page"
          title="vitalii.no/features/…-g25"
          win={WIN1}
          from={B1_S}
          hold={B1_E - B1_S}
          zoom={liveZoom}
          focus={{ x: 0.5, y: 0.3 }}
          opacity={b1}
        />
        <StageCaption text="Proof it's real — but a retired key still opened the door" opacity={b1} tone="danger" />

        {/* ================= beat 2 : the repeating alarm (the one analogy) ================= */}
        <StageHeading text="It kept waking up — on its own schedule." opacity={b2} />
        {WAKES.map((w, i) => (
          <Panel key={w.label} x={w.x} y={150} w={252} h={240} tone="danger" opacity={b2 * wakeIn(i)}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transform: `translateY(${(1 - wakeIn(i)) * 14}px)`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted }}>{w.label}</div>
              <div style={{ fontSize: 40 }}>⏰</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: P.ink }}>👻 wakes up</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: P.danger }}>uninvited, again</div>
            </div>
          </Panel>
        ))}
        <StatPill
          x={STAGE_X + STAGE_W / 2 - 190}
          y={420}
          emoji="🪪"
          text='no id set — defaults to "default"'
          tone="danger"
          opacity={b2}
        />
        <StageCaption text="Same time, every time, with nothing to tell it apart" opacity={b2} tone="danger" />

        {/* ================= beat 3 : the leader-election schematic ================= */}
        <StageHeading text="Sometimes it even won the leader election." opacity={b3} />
        <div style={{ position: "absolute", left: STAGE_X, top: 150, width: STAGE_W, textAlign: "center", fontSize: 13, fontWeight: 800, letterSpacing: 1.5, color: P.muted, opacity: b3 }}>
          AMONG 3 AUTOMATED AGENTS
        </div>
        <IconCard x={STAGE_X + 40} y={200} w={200} emoji="🤖" title="Agent A" tone="accent" opacity={b3 * nodeIn(0)} scale={Math.min(1, nodeIn(0))} />
        <IconCard x={STAGE_X + 332} y={200} w={200} emoji="🤖" title="Agent B" tone="accent" opacity={b3 * nodeIn(1)} scale={Math.min(1, nodeIn(1))} />
        <div style={{ position: "absolute", left: STAGE_X + 624, top: 200, width: 200 }}>
          <IconCard x={0} y={0} w={200} emoji="🧟" title="Outdated code" sub="already replaced everywhere else" tone="danger" opacity={b3 * nodeIn(2)} scale={Math.min(1, nodeIn(2))} />
          {crownPop > 0.02 ? (
            <div style={{ position: "absolute", left: 76, top: -46, fontSize: 40, transform: `scale(${Math.min(1, crownPop)}) rotate(-8deg)`, transformOrigin: "center" }}>
              👑
            </div>
          ) : null}
        </div>
        <StatPill
          x={STAGE_X + STAGE_W / 2 - 160}
          y={440}
          emoji="🏆"
          text="elected leader, with old code"
          tone="danger"
          opacity={b3 * Math.min(1, crownPop)}
        />
        <StageCaption text="The retired one took over control of the whole system" opacity={b3} tone="danger" />

        {/* ================= beat 4 : the identity check (slide-in, no crossfade) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b4, transform: `translateX(${b4dx}px)` }}>
          <StageHeading text="Now every agent proves its identity." opacity={1} />
          <Panel x={STAGE_X} y={210} w={160} h={190} tone="card" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 34 }}>🤖</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: P.ink, textAlign: "center" }}>agent request</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: P.muted, fontFamily: "monospace" }}>guard_agent.py</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 170, top: 295, width: 76, height: 7, borderRadius: 4, background: P.accent, opacity: arrow1 }} />
          <FilterChip x={STAGE_X + 276} y={178} text="Cloudflare Workers" icon="📋" color={P.accent} scale={Math.min(1, chipPop)} opacity={Math.min(1, chipPop)} />
          <Panel x={STAGE_X + 262} y={210} w={210} h={190} tone="accent" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 34 }}>🛡</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: P.ink, textAlign: "center" }}>checks the id</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: P.muted, fontFamily: "monospace" }}>index.js</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 472, top: 295, width: 76, height: 7, borderRadius: 4, background: P.accent, opacity: arrow2 }} />
          <Panel x={STAGE_X + 548} y={210} w={160} h={190} tone="card" opacity={1}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontSize: 34 }}>📋</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: P.ink, textAlign: "center" }}>agents_disabled</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: P.muted }}>KV list</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 718, top: 295, width: 76, height: 7, borderRadius: 4, background: P.danger, opacity: arrow3 }} />
          <Panel x={STAGE_X + 710} y={210} w={154} h={190} tone="danger" opacity={Math.min(1, resultPop)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${Math.min(1, resultPop)})` }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: P.danger }}>IF LISTED</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: P.ink }}>403</div>
            </div>
          </Panel>
          <div style={{ position: "absolute", left: STAGE_X + 262, top: 410, width: 210, textAlign: "center", fontSize: 12.5, fontWeight: 600, color: P.muted }}>
            (serverless edge functions)
          </div>
          <StageCaption text="Checked against a disabled list on every single request" opacity={1} tone="accent" />
        </div>

        {/* ================= beat 5 : the product "running" + the real result ================= */}
        <LogWindow
          win={WIN5}
          title="worker log · agent identity check"
          from={B5_S + 12}
          every={22}
          fontSize={20}
          opacity={b5}
          lines={[
            { t: "req", text: "X-Agent-Id: default", tone: "muted" },
            { t: "worker", text: "checking agents_disabled in KV…", tone: "muted" },
            { t: "kv", text: 'agents_disabled = ["default"]', tone: "accent" },
            { t: "worker", text: "match found — rejecting request", tone: "danger" },
            { t: "response", text: '403 { error: "agent disabled" }', tone: "danger" },
            { t: "election", text: "leader check now reads X-Agent-Id too", tone: "accent" },
            { t: "result", text: "✅ retired ids rejected, every time", tone: "success" },
          ]}
        />
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
            opacity: b5 * barFill,
            transform: `translateY(${(1 - barFill) * 14}px)`,
            fontSize: 18,
            fontWeight: 800,
            color: P.success,
          }}
        >
          403 for every disabled id, instantly
        </div>
        <StageCaption text="Only a human editing the list brings an id back" opacity={b5} tone="success" />
      </div>
    </PaletteProvider>
  );
};
