/**
 * FeatureBoundedAutoReconEndingJ71 — feature j71 — 1280x720, 888 frames @ 30fps, VOICE-SYNCED.
 *
 * Art direction drawn by the orchestrating session (STEP 0):
 *   archetype 2 "zoom-in" — beat 1 is a wide view of the job queue board across
 *   several platforms; beat 2 is a camera push into the one stuck card until it
 *   fills the frame. Beats 3-5 continue the same "push in" language through the
 *   LiveShot zoom parameter, this time on real recordings (STEP 0c).
 *   mood — sand (warm paper / terracotta), via MOODS.sand.
 *
 * STEP 0c — real product beats: the agent itself has no public UI (unknown
 * platforms, internal consent buttons), so beats 1-2 stay a drawn metaphor —
 * a queue board with one platform stuck behind a missed consent window. Beats
 * 3-5 are recordings of the actual GitHub repo and the feature's own page,
 * from shots/j71.json: commits (the real code fix), Actions (the workflow that
 * runs it), and the published feature page (the payoff).
 *
 * Voice-synced beat table (do not shift):
 *  b1  15-168  "For two weeks, jobs kept piling up on a site my agent had never seen before."
 *  b2 177-313  "Unlocking it needed one tap within a two-hour window — and I kept missing it."
 *  b3 322-453  "So I let the agent grant itself permission, capped at two new sites a day."
 *  b4 462-624  "It spends that budget on whichever queue is busiest first, before it even wakes up."
 *  b5 633-843  "Learning one new site costs about 6.8 million tokens — capped, so the backlog finally clears."
 *  tail 843-888 — beat 5 HOLDS at full opacity through the very last frame; no loop, no fade-out.
 *
 * Single tech name in the whole clip: patch-agent-pollers.cjs (beat 3 chip only).
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
  Cursor,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow } from "./live-primitives";
import shots from "./shots/j71.json";

const P = MOODS.sand;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// ── The queue board — one fixed layout in "world" coordinates (beats 1-2) ──
const CARD_Y = 200;
const CARD_W = 200;
const CARD_H = 130;
const CARDS = [
  { x: 260, name: "TechJobs.no" },
  { x: 500, name: "NorskKarriere" },
  { x: 740, name: "DevHub Oslo" },
];
const STUCK_X = 500;
const STUCK_CX = STUCK_X + CARD_W / 2; // 600
const STUCK_CY = CARD_Y + CARD_H / 2; // 265

// Camera push: wide board (b1) -> tight on the stuck card (b2). Center never
// moves, only the scale, so the transition is a pure zoom, not a pan.
const CAM_F = [15, 155, 190, 313];
const CAM_S = [0.85, 0.85, 2.0, 2.0];

/** The hero number, top-left, leaving the centre of the frame to the product. */
const hero = (value: string, unit: string | undefined, label: string, color: string, scale: number) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      top: 34,
      width: 470,
      transform: `scale(${0.86 + 0.14 * Math.min(1, scale)})`,
      transformOrigin: "left top",
      fontFamily,
    }}
  >
    <div
      style={{
        fontSize: 100,
        lineHeight: 1,
        fontWeight: 800,
        letterSpacing: -3,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
      {unit ? <span style={{ fontSize: 100 * 0.34, marginLeft: 6 }}>{unit}</span> : null}
    </div>
    <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: P.muted }}>{label}</div>
  </div>
);

export const FeatureBoundedAutoReconEndingJ71: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 152, 168));
  const b2 = seg(frame, 177, 193) * (1 - seg(frame, 297, 313));
  const b3 = seg(frame, 322, 338) * (1 - seg(frame, 437, 453));
  const b4 = seg(frame, 462, 478) * (1 - seg(frame, 608, 624));
  const b5 = seg(frame, 633, 649); // holds through 888

  const heroPop1 = pop(15);
  const heroPop2 = pop(177);
  const heroPop3 = pop(322);
  const heroPop4 = pop(462);
  const heroPop5 = pop(633);

  // beat 1 -> 2 camera: pure push-in on the stuck card, no pan.
  const camS = interpolate(frame, CAM_F, CAM_S, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const tx = 640 - STUCK_CX * camS;
  const ty = 360 - STUCK_CY * camS;

  // beat 2: the consent countdown, ticking down and missed
  const countdownMin = Math.max(
    0,
    Math.round(interpolate(frame, [193, 288], [120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
  );
  const clockPulse = 0.9 + 0.1 * Math.sin(frame / 5);
  const missedPop = pop(288, 9);
  const cursorX = 630 + 6 * Math.sin(frame / 14);
  const cursorY = 372 + 4 * Math.cos(frame / 11);

  // beat 3: chip pop for the one tech credibility caption in the whole clip
  const chipPop = pop(360);

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ beats 1-2 : the queue board, drawn, camera pushes in ════ */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1280,
            height: 720,
            transform: `translate(${tx}px, ${ty}px) scale(${camS})`,
            transformOrigin: "0 0",
          }}
        >
          {CARDS.map((c) => {
            const stuck = c.x === STUCK_X;
            return (
              <Panel key={c.name} x={c.x} y={CARD_Y} w={CARD_W} h={CARD_H} tone={stuck ? "danger" : "card"} opacity={b1}>
                <div style={{ padding: "16px 18px", fontFamily }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: P.ink }}>{c.name}</div>
                  {stuck ? (
                    <>
                      <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 700, color: P.danger }}>🔒 NEW PLATFORM</div>
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            marginTop: 8,
                            height: 10,
                            width: 150 - i * 14,
                            borderRadius: 5,
                            background: P.dangerEdge,
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <div style={{ marginTop: 12, fontSize: 13.5, fontWeight: 700, color: P.success }}>✅ processing normally</div>
                  )}
                </div>
              </Panel>
            );
          })}

          {/* ── beat 2 : zoomed on the stuck card — countdown, missed tap ── */}
          <div style={{ position: "absolute", left: STUCK_X, top: CARD_Y + CARD_H + 16, width: CARD_W, opacity: b2, fontFamily }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: countdownMin < 20 ? P.danger : P.ink,
                textAlign: "center",
                transform: `scale(${clockPulse})`,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ⏳ {countdownMin} MIN
            </div>
            <div
              style={{
                marginTop: 10,
                padding: "8px 0",
                borderRadius: 12,
                background: P.card,
                border: `1.5px solid ${P.accentEdge}`,
                color: P.accent,
                fontSize: 14,
                fontWeight: 700,
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(42,32,24,0.10)",
              }}
            >
              TAP TO UNLOCK ACCESS
            </div>
          </div>
          <Cursor x={cursorX} y={cursorY} opacity={b2} />
          <div
            style={{
              position: "absolute",
              left: STUCK_X + CARD_W - 30,
              top: CARD_Y - 26,
              transform: `rotate(-12deg) scale(${missedPop})`,
              fontSize: 26,
              fontWeight: 800,
              color: P.danger,
              opacity: Math.min(1, missedPop) * b2,
              fontFamily,
            }}
          >
            ❌ MISSED
          </div>
        </div>

        {/* ════ beat 1 : hero + pills + caption (screen-fixed) ════ */}
        <Group opacity={b1}>
          {hero("0", undefined, "JOBS SENT IN TWO WEEKS", P.danger, heroPop1)}
          <StatPill x={690} y={52} emoji="📥" text="jobs piling up, unseen" tone="danger" opacity={b1} />
          <StatPill x={690} y={112} emoji="🔍" text="scanning still worked fine" tone="accent" opacity={b1} />
          <CaptionBand y={664} fontSize={22} text="Jobs kept piling up on a site the agent had never learned" tone="danger" opacity={b1} />
        </Group>

        {/* ════ beat 2 : hero + pills + caption (screen-fixed) ════ */}
        <Group opacity={b2}>
          {hero("120", "MIN", "CONSENT WINDOW TO TAP", P.danger, heroPop2)}
          <StatPill x={690} y={52} emoji="👆" text="needed one tap in time" tone="danger" opacity={b2} />
          <StatPill x={690} y={112} emoji="😩" text="kept missing the window" tone="danger" opacity={b2} />
          <CaptionBand y={664} fontSize={22} text="One tap in a two-hour window — and I kept missing it" tone="danger" opacity={b2} />
        </Group>

        {/* ════ beat 3 : the real fix, GitHub commits ════ */}
        <Group opacity={b3}>
          {hero("2", undefined, "NEW PLATFORMS ALLOWED PER DAY", P.accent, heroPop3)}
          <StatPill x={690} y={52} emoji="🤖" text="agent grants itself access" tone="accent" opacity={b3} />
          <StatPill x={690} y={112} emoji="🔓" text="no more missed taps" tone="accent" opacity={b3} />
        </Group>
        <LiveWindow
          file={shots}
          shot="commits"
          title="github.com/SmmShaman/jobbot-norway — commits · main"
          from={322}
          hold={131}
          zoom={(t) => 1 + 0.12 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b3}
        />
        <Group opacity={b3}>
          <FilterChip x={870} y={238} text="patch-agent-pollers.cjs" icon="🔧" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
          <CaptionBand y={664} fontSize={22} text="The agent now grants itself access — capped at two new platforms a day" tone="accent" opacity={b3} />
        </Group>

        {/* ════ beat 4 : the real workflow, GitHub Actions ════ */}
        <Group opacity={b4}>
          {hero("1", "×", "GRANT SPENT PER JOB ROW", P.accent, heroPop4)}
          <StatPill x={690} y={52} emoji="📊" text="busiest queue served first" tone="accent" opacity={b4} />
          <StatPill x={690} y={112} emoji="⏰" text="decided before it wakes up" tone="accent" opacity={b4} />
        </Group>
        <LiveWindow
          file={shots}
          shot="actions"
          title="github.com/SmmShaman/jobbot-norway — Actions"
          from={462}
          hold={162}
          zoom={(t) => 1 + 0.04 * easeOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={b4}
        />
        <Group opacity={b4}>
          <CaptionBand y={664} fontSize={22} text="It spends that budget on the busiest queue first, before it even wakes up" tone="accent" opacity={b4} />
        </Group>

        {/* ════ beat 5 : the payoff, the feature's own page ════ */}
        <Group opacity={b5}>
          {hero("6.8M", undefined, "TOKENS TO LEARN ONE PLATFORM", P.amber, heroPop5)}
          <StatPill x={690} y={52} emoji="✅" text="backlog finally clears" tone="success" opacity={b5} />
          <StatPill x={690} y={112} emoji="🔁" text="capped, not unlimited" tone="success" opacity={b5} />
          <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={heroPop5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="page"
          title="vitalii.no/features/bounded-auto-recon-…-j71"
          from={633}
          hold={255}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
        />
        <Group opacity={b5}>
          <CaptionBand y={664} fontSize={22} text="Capped at 6.8 million tokens a platform — so the backlog finally clears" tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
