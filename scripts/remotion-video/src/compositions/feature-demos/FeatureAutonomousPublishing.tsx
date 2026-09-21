/**
 * FeatureAutonomousPublishing — feature p20 — 1280x720, 939 frames @ 30fps, VOICE-SYNCED. RE-SHOOT.
 *
 * Art direction drawn by the orchestrating session (STEP 0):
 *   archetype 2 "zoom-in" — beat 1 is a wide view of the editorial queue board
 *   with several article tickets, each carrying the same six-tap checklist;
 *   the camera pushes continuously into one ticket through beats 2-3 until its
 *   checklist fills the frame, revealing the same steps repeated with no belt
 *   connecting them. Beat 3->4 the push continues straight through into the
 *   real commit diff (scale-continuing, non-crossfade). mood — sand (warm
 *   paper / terracotta), via MOODS.sand.
 *
 *   Calibration note: the OLD version of this exact clip is the failure
 *   example cited in lux-batch-instructions.md — its archetype (card deck)
 *   rendered as a 180px pile in a corner while a centered headline owned the
 *   screen, and beat 2's four narrated actions were told, not shown. This
 *   rebuild makes the zooming world the dominant frame-filling element start
 *   to finish, and gives beat 2's four actions four visible tap-through chips.
 *
 * STEP 0c — real product beats: the editorial admin queue is not a public,
 * recordable page, so beats 1-3 stay a drawn metaphor. Beat 4 is real: the
 * commit that built the pipeline (shots/p20.json "commit", the one commit
 * whose message matches this beat's sentence), followed by a LogWindow —
 * this project keeps no runtime log page, so its lines are built strictly
 * from the feature's own real function names (fetch-news, analyze-rss-article,
 * auto-publish-news), never invented metrics. Beat 5 is the features hub
 * (shots/p20.json "hub") — NOT the feature's own page, satisfying gate 2.
 *
 * Voice-synced beat table (do not shift — re-shoot keeps the narration):
 *  b1  15-177  "Forty taps a day. Sometimes sixty. Just to move articles from one step to the next."
 *  b2 186-369  "Generate the picture. Rewrite it in three languages. Put it on the site. Post it. Repeat."
 *  b3 378-551  "None of it was thinking. It was the same buttons in the same order, a factory line with no conveyor."
 *  b4 560-762  "So one Supabase function became the conveyor. It runs the chain and stops only to ask when something looks wrong."
 *  b5 771-894  "Fifteen minutes per article became two. And the taps went to zero."
 *  tail 894-939 — beat 5 HOLDS at full opacity through the very last frame; no loop, no fade-out.
 *
 * Single tech name in the whole clip: auto-publish-news (beat 4 chip only).
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
  StickyNote,
  CheckBadge,
  CaptionBand,
  Cursor,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import shots from "./shots/p20.json";

const P = MOODS.sand;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// ── The editorial queue board — fixed "world" layout for beats 1-3 ──
const CARD_Y = 190;
const CARD_W = 220;
const CARD_H = 220;
const CARDS = [
  { x: 220, label: "Article #118" },
  { x: 500, label: "Article #119" },
  { x: 780, label: "Article #120" },
];
const STUCK_X = 500;
const STUCK_CX = STUCK_X + CARD_W / 2; // 610
const STUCK_CY = CARD_Y + CARD_H / 2; // 300

// checklist steps shown per ticket — the four narrated actions of beat 2
const STEPS = [
  { emoji: "🖼️", label: "Generate picture" },
  { emoji: "🌐", label: "Rewrite EN · NO · UA" },
  { emoji: "🌍", label: "Put it on the site" },
  { emoji: "📣", label: "Post it" },
];

// Camera: wide board (b1) -> push into one ticket's checklist (b2) -> push
// further into the repeated pile with no conveyor between steps (b3). Center
// never moves once locked onto the stuck ticket, only the scale grows.
const CAM_F = [15, 168, 210, 369, 400, 551];
const CAM_S = [0.72, 0.72, 1.55, 1.55, 2.3, 2.3];

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

export const FeatureAutonomousPublishing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  const b1 = seg(frame, 15, 31) * (1 - seg(frame, 161, 177));
  const b2 = seg(frame, 186, 202) * (1 - seg(frame, 353, 369));
  const b3 = seg(frame, 378, 394) * (1 - seg(frame, 535, 551));
  const b4 = seg(frame, 560, 576) * (1 - seg(frame, 746, 762));
  const b5 = seg(frame, 771, 787); // holds through 939

  const heroPop1 = pop(15);
  const heroPop2 = pop(186);
  const heroPop3 = pop(378);
  const heroPop4 = pop(560);
  const heroPop5 = pop(771);

  // continuous camera push across beats 1-3, locked on the stuck ticket
  const camS = interpolate(frame, CAM_F, CAM_S, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const tx = 640 - STUCK_CX * camS;
  const ty = 360 - STUCK_CY * camS;

  // beat 2: a cursor taps through the four steps in sequence
  const stepIdx = Math.max(0, Math.min(3, Math.floor((frame - 186) / 46)));
  const stepY = CARD_Y + 56 + stepIdx * 40;
  const tapClick =
    seg(frame, 186 + stepIdx * 46 + 8, 186 + stepIdx * 46 + 20) *
    (1 - seg(frame, 186 + stepIdx * 46 + 30, 186 + stepIdx * 46 + 40));

  // beat 4: commit diff first half, LogWindow second half of the window
  const commitOn = seg(frame, 560, 576) * (1 - seg(frame, 636, 652));
  const logOn = seg(frame, 644, 660) * (1 - seg(frame, 746, 762));
  const chipPop = pop(636);

  const logLines = [
    { t: "14:02", text: "fetch-news → new article found", tone: "ink" as const },
    { t: "14:02", text: "analyze-rss-article → approved", tone: "accent" as const },
    { t: "14:03", text: "auto-publish-news → image generated", tone: "accent" as const },
    { t: "14:03", text: "auto-publish-news → rewritten EN · NO · UA", tone: "accent" as const },
    { t: "14:03", text: "auto-publish-news → image looked off, paused for review", tone: "danger" as const },
    { t: "14:04", text: "auto-publish-news → approved, published live", tone: "success" as const },
    { t: "14:04", text: "auto-publish-news → posted to LinkedIn + Facebook", tone: "success" as const },
  ];

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ════ beats 1-3 : the queue board, drawn, camera pushes in continuously ════ */}
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
              <Panel key={c.label} x={c.x} y={CARD_Y} w={CARD_W} h={CARD_H} tone={stuck ? "danger" : "card"} opacity={b1}>
                <div style={{ padding: "16px 18px", fontFamily }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: P.ink }}>{c.label}</div>
                  {STEPS.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: P.danger,
                      }}
                    >
                      <span style={{ fontSize: 15 }}>{s.emoji}</span>
                      {s.label}
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}

          {/* ── beat 2 : the stuck ticket, tapped through one step at a time ── */}
          <Group opacity={b2}>
            <div
              style={{
                position: "absolute",
                left: STUCK_X + CARD_W + 26,
                top: CARD_Y,
                width: 260,
                fontFamily,
              }}
            >
              {STEPS.map((s, i) => {
                const done = i < stepIdx || (i === stepIdx && frame - (186 + stepIdx * 46) > 24);
                const active = i === stepIdx;
                return (
                  <div
                    key={s.label}
                    style={{
                      marginTop: i === 0 ? 0 : 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: P.card,
                      border: `1.5px solid ${active ? P.accentEdge : P.border}`,
                      opacity: active ? 1 : done ? 0.55 : 0.85,
                      boxShadow: active ? "0 6px 16px rgba(120,70,20,0.18)" : undefined,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{done ? "✅" : s.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: P.ink }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
            <Cursor x={STUCK_X + CARD_W + 46} y={stepY} click={tapClick} />
          </Group>

          {/* ── beat 3 : the same checklist, piled — no conveyor between steps ── */}
          <Group opacity={b3}>
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                style={{
                  position: "absolute",
                  left: STUCK_X - 40 + row * 18,
                  top: CARD_Y + CARD_H + 30 + row * 96,
                  width: CARD_W + 80,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: P.card,
                  border: `1.5px dashed ${P.dangerEdge}`,
                  display: "flex",
                  gap: 10,
                  opacity: 0.92 - row * 0.12,
                }}
              >
                {STEPS.map((s) => (
                  <span key={s.label} style={{ fontSize: 20 }}>
                    {s.emoji}
                  </span>
                ))}
              </div>
            ))}
          </Group>
        </div>

        {/* ════ beat 1 : hero + product name + pills + caption (screen-fixed) ════ */}
        <Group opacity={b1}>
          {hero("40", "/DAY", "MANUAL TAPS, SOMETIMES 60", P.danger, heroPop1)}
          <StickyNote x={690} y={40} w={330} text="📰 vitalii.no — my portfolio & news platform" opacity={b1} />
          <StatPill x={690} y={168} emoji="🔁" text="same steps, every article" tone="danger" opacity={b1} />
          <CaptionBand y={664} fontSize={22} text="Forty taps a day, sometimes sixty, just to move one article along" tone="danger" opacity={b1} />
        </Group>

        {/* ════ beat 2 : hero + pills + caption (screen-fixed) ════ */}
        <Group opacity={b2}>
          {hero("4", "STEPS", "REPEATED FOR EVERY ARTICLE", P.danger, heroPop2)}
          <StatPill x={690} y={52} emoji="🖱️" text="tap, wait, tap again" tone="danger" opacity={b2} />
          <StatPill x={690} y={112} emoji="🔂" text="same order, every time" tone="danger" opacity={b2} />
          <CaptionBand y={664} fontSize={22} text="Generate the picture. Rewrite it in three languages. Publish it. Post it. Repeat." tone="danger" opacity={b2} />
        </Group>

        {/* ════ beat 3 : hero + pills + caption (screen-fixed) ════ */}
        <Group opacity={b3}>
          {hero("0", undefined, "AUTOMATION CONNECTING THE STEPS", P.danger, heroPop3)}
          <StatPill x={690} y={52} emoji="🧠" text="none of it was thinking" tone="danger" opacity={b3} />
          <StatPill x={690} y={112} emoji="🏭" text="a line with no conveyor" tone="danger" opacity={b3} />
          <CaptionBand y={664} fontSize={22} text="Same buttons, same order — a factory line with no conveyor" tone="danger" opacity={b3} />
        </Group>

        {/* ════ beat 4 : the real fix — commit, then the pipeline running ════ */}
        <Group opacity={b4}>
          {hero("1", undefined, "FUNCTION THAT RUNS THE CHAIN", P.accent, heroPop4)}
          <StatPill x={690} y={52} emoji="⚙️" text="generate → translate → publish → post" tone="accent" opacity={b4} />
          <StatPill x={690} y={112} emoji="🛑" text="stops only when something looks wrong" tone="accent" opacity={b4} />
        </Group>
        <LiveWindow
          file={shots}
          shot="commit"
          title="github.com/SmmShaman/vitalii-no-platform — commit 4b99fcc"
          from={560}
          hold={92}
          zoom={(t) => 1 + 0.1 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={commitOn}
        />
        <Group opacity={commitOn}>
          <FilterChip x={870} y={238} text="auto-publish-news" icon="🔧" color={P.accent} scale={chipPop} opacity={Math.min(1, chipPop)} />
        </Group>
        <LogWindow lines={logLines} title="auto-publish-news · production" from={644} every={16} opacity={logOn} />
        <Group opacity={b4}>
          <CaptionBand y={664} fontSize={22} text="One Supabase function became the conveyor — it stops only to ask when something looks wrong" tone="accent" opacity={b4} />
        </Group>

        {/* ════ beat 5 : the payoff, the features hub (NOT the feature's own page) ════ */}
        <Group opacity={b5}>
          {hero("2", "MIN", "PER ARTICLE, DOWN FROM 15", P.amber, heroPop5)}
          <StatPill x={690} y={52} emoji="✅" text="zero taps" tone="success" opacity={b5} />
          <StatPill x={690} y={112} emoji="🚀" text="fifteen minutes → two" tone="success" opacity={b5} />
          <CheckBadge x={1080} y={44} size={44} opacity={b5} scale={heroPop5} />
        </Group>
        <LiveWindow
          file={shots}
          shot="hub"
          title="vitalii.no/features"
          from={771}
          hold={168}
          zoom={(t) => 1 + 0.08 * easeInOut(t)}
          focus={{ x: 0.5, y: 0.4 }}
          opacity={b5}
        />
        <Group opacity={b5}>
          <CaptionBand y={664} fontSize={22} text="Fifteen minutes per article became two — and the taps went to zero" tone="success" opacity={b5} />
        </Group>
      </div>
    </PaletteProvider>
  );
};
