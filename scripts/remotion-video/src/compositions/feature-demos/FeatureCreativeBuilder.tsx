/**
 * FeatureCreativeBuilder — feature p19 — 1280x720, 982 frames @30fps.
 *
 * VOICE-SYNCED (owner rule, 2026-08-31): the beat windows below are measured
 * from the real voiceover, not a designer's guess — rebuild the audio and you
 * must rebuild these numbers with it.
 *
 * Art direction drawn by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md):
 *   archetype 2 "zoom-in" — beat 1 is a wide, small-scale view of the whole
 *   Telegram bot screen; every following beat is a camera push into ONE part
 *   of that same screen until it fills the frame. Beat 5 reverses the move —
 *   a pull-BACK that reveals a result card beside the (now small) phone. The
 *   phone is the one element that survives every beat.
 *   mood — sand (warm paper / terracotta), via MOODS.sand.
 *
 * Beat windows, measured (fps 30):
 *   b1  15-187  "Make it warmer. Make it more corporate. Everyone knows what
 *                they want, nobody can write it down."
 *   b2 196-360  "So the picture came back wrong again, and someone tried
 *                again. Two hours of guessing per article."
 *   b3 369-559  "Now nobody writes anything. You tap. Colour, mood, lighting,
 *                like ordering from a menu."
 *   b4 568-774  "Forty-two options, and every tap is assembled into one
 *                instruction that Azure OpenAI can actually read."
 *   b5 783-937  "Two hours of trial and error became fifteen minutes.
 *                Eighty-seven percent gone."
 *   tail 937-982 — beat 5 HOLDS here at full opacity through the very last
 *   frame; there is nothing to hand over to, so no fade-out of any kind.
 *
 * The camera is one transform (`translate(tx,ty) scale(s)`) applied to a
 * single "world" div that holds the whole phone screen laid out once, at
 * fixed coordinates. Each beat just moves/scales that one camera — nothing
 * ever crossfades with anything that shares its screen area, because each
 * beat's content lives at a different, non-overlapping y-band inside the
 * phone and the camera has physically moved on by the time the next band's
 * content appears.
 */
import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Panel,
  StatPill,
  FilterChip,
  Cursor,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.sand;

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const BEATS = {
  b1: [15, 187],
  b2: [196, 360],
  b3: [369, 559],
  b4: [568, 774],
  b5: [783, 937],
} as const;

// ── The phone screen — one fixed layout in "world" coordinates ───────────
const PHONE_X = 360;
const PHONE_Y = 26;
const PHONE_W = 460;
const PHONE_H = 668;
const PHONE_CX = PHONE_X + PHONE_W / 2; // 590

// Non-overlapping y-bands inside the phone, one per beat.
const HEADER_Y = 26;
const F_Y = 100; // beat 1 — vague feedback
const R_Y = 220; // beat 2 — rejected image, tried again
const K_Y = 366; // beat 3 — tap the menu
const PR_Y = 536; // beat 4 — compiled prompt

// Camera targets: [center-x, center-y, scale]. A wide establishing shot,
// three progressively tighter pushes into the phone, then a pull-back that
// reveals the result card beside it.
const CAM_F = [0, 178, 204, 352, 378, 551, 577, 766, 792, 982];
const CAM_CX = [590, 590, 590, 590, 590, 590, 590, 590, 830, 830];
const CAM_CY = [360, 360, 285, 285, 443, 443, 600, 600, 360, 360];
const CAM_S = [0.95, 0.95, 1.9, 1.9, 2.5, 2.5, 3.15, 3.15, 0.75, 0.75];

export const FeatureCreativeBuilder: React.FC = () => {
  const frame = useCurrentFrame();

  const camAt = (values: readonly number[]) =>
    interpolate(frame, CAM_F, values, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  const camCx = camAt(CAM_CX);
  const camCy = camAt(CAM_CY);
  const camS = camAt(CAM_S);
  const tx = 640 - camCx * camS;
  const ty = 360 - camCy * camS;

  // ── Beat 1 — the moderator can't write down what they want ─────────────
  // Fully gone by 184, well clear of the 9-frame gap before b2 opens at 196.
  const b1Out = 1 - seg(frame, 166, 184);
  const fF = seg(frame, 22, 42) * b1Out;
  const fTag = seg(frame, 60, 80) * b1Out;

  // ── Beat 2 — wrong again, tried again, two hours gone ───────────────────
  // Fully gone by 360 (b2's own end), clear of the gap before b3 opens at 369.
  const b2Out = 1 - seg(frame, 344, 360);
  const rIn = seg(frame, 204, 224) * b2Out;
  const regenPulse = 0.85 + 0.15 * Math.sin(frame / 6);
  const rTag = seg(frame, 250, 270) * b2Out;
  const rStat = seg(frame, 286, 306) * b2Out;

  // ── Beat 3 — tap a category, then an option ──────────────────────────────
  // Fully gone by 562, clear of the gap before b4 opens at 568 (this is what
  // was leaking the green "Saved to session" chip into b4 before the fix).
  const b3Out = 1 - seg(frame, 546, 562);
  const catLabel = seg(frame, 380, 398) * (1 - seg(frame, 452, 466));
  const optLabel = seg(frame, 452, 466) * b3Out;
  const catChips = catLabel;
  const optChips = optLabel;
  const cx = interpolate(frame, [398, 428, 466, 496], [860, 770, 770, 450], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cy = interpolate(frame, [398, 428, 466, 496], [520, 424, 424, 424], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const cursorOp = seg(frame, 398, 410) * (1 - seg(frame, 508, 520));
  const click1 = seg(frame, 428, 440, Easing.out(Easing.quad));
  const click2 = seg(frame, 496, 508, Easing.out(Easing.quad));
  const colorHighlight = seg(frame, 434, 448);
  const warmHighlight = seg(frame, 502, 516);
  const savedTag = seg(frame, 520, 538) * b3Out;

  // ── Beat 4 — every tap assembled into one prompt ─────────────────────────
  // Fully gone by 774 (b4's own end), clear of the gap before b5 opens at 783.
  const b4Out = 1 - seg(frame, 758, 774);
  const promptIn = seg(frame, 578, 600) * b4Out;
  const techTag = seg(frame, 630, 650) * b4Out;
  const promptStat = seg(frame, 660, 680) * b4Out;

  // ── Beat 5 — the number, and the payoff ───────────────────────────────────
  const cardIn = seg(frame, 792, 814);
  const beforeAfter = seg(frame, 816, 838);
  const heroPct = seg(frame, 846, 872);
  const check = seg(frame, 872, 890);
  const resultSub = seg(frame, 892, 912);

  // No tail fade: this clip does not loop and has nothing to hand over to,
  // so beat 5 holds at full opacity through the very last rendered frame.
  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* Small persistent eyebrow — screen-fixed, never moves with the camera */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 40,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            color: P.muted,
            opacity: seg(frame, 10, 26),
            fontFamily,
          }}
        >
          AI Creative Builder
        </div>

        {/* ════ The world — one camera transform over the whole phone ════ */}
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
          {/* Phone shell — the one element that survives every beat */}
          <Panel x={PHONE_X} y={PHONE_Y} w={PHONE_W} h={PHONE_H} tone="card" radius={40} opacity={1} />

          {/* Header — persistent chrome */}
          <div style={{ position: "absolute", left: PHONE_X, top: HEADER_Y, width: PHONE_W, height: 64, opacity: seg(frame, 8, 24), fontFamily }}>
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 12,
                width: 40,
                height: 40,
                borderRadius: 20,
                background: P.accentBg,
                border: `2px solid ${P.accentEdge}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 21,
              }}
            >
              🎨
            </div>
            <div style={{ position: "absolute", left: 72, top: 14, fontSize: 18, fontWeight: 700, color: P.ink }}>
              Creative Builder Bot
            </div>
            <div style={{ position: "absolute", left: 72, top: 38, fontSize: 13, fontWeight: 600, color: P.muted }}>
              online — tap to direct the image
            </div>
          </div>

          {/* ════ Beat 1 — vague feedback ════ */}
          <Panel x={PHONE_X + 20} y={F_Y} w={PHONE_W - 40} h={92} tone="danger" opacity={fF}>
            <div style={{ padding: "16px 20px", fontFamily }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: P.danger, lineHeight: 1.5 }}>
                💬 "more corporate, please"
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: P.danger, lineHeight: 1.5, marginTop: 4 }}>
                💬 "needs to feel warmer..."
              </div>
            </div>
          </Panel>
          <StatPill
            x={PHONE_X + 20}
            y={F_Y + 100}
            emoji="🗣️"
            text="Vague feedback, no real prompt"
            tone="danger"
            opacity={fTag}
            fontSize={15}
          />

          {/* ════ Beat 2 — wrong again, tried again ════ */}
          <div
            style={{
              position: "absolute",
              left: PHONE_X + 20,
              top: R_Y,
              width: 84,
              height: 84,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${P.chipBg}, ${P.card})`,
              border: `1.5px solid ${P.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              opacity: rIn * regenPulse,
              fontFamily,
            }}
          >
            🖼️
          </div>
          <div style={{ position: "absolute", left: PHONE_X + 120, top: R_Y + 14 }}>
            <FilterChip x={0} y={0} text="Regenerate, again" icon="🔄" opacity={rIn} />
          </div>
          <div style={{ position: "absolute", left: PHONE_X + 120, top: R_Y + 56, opacity: rTag, fontFamily }}>
            <FilterChip x={0} y={0} text="Still not right..." icon="" opacity={1} color={P.danger} />
          </div>
          <StatPill
            x={PHONE_X + 20}
            y={R_Y + 100}
            emoji="⏱️"
            text="2 hours of guessing, per article"
            tone="danger"
            opacity={rStat}
            fontSize={15}
          />

          {/* ════ Beat 3 — tap the menu ════ */}
          <div style={{ position: "absolute", left: PHONE_X + 20, top: K_Y, fontSize: 16, fontWeight: 700, color: P.accent, opacity: catLabel, fontFamily }}>
            Step 1 — tap a category
          </div>
          <div style={{ position: "absolute", left: PHONE_X + 20, top: K_Y, fontSize: 16, fontWeight: 700, color: P.accent, opacity: optLabel, fontFamily }}>
            Step 2 — tap an option for "Color"
          </div>
          <FilterChip x={PHONE_X + 20} y={K_Y + 34} text="Mood" icon="" opacity={catChips} />
          <FilterChip x={PHONE_X + 150} y={K_Y + 34} text="Style" icon="" opacity={catChips} />
          <FilterChip x={PHONE_X + 280} y={K_Y + 34} text="Color" icon="" opacity={catChips} scale={1 + colorHighlight * 0.12} color={colorHighlight > 0.4 ? P.success : undefined} />
          <FilterChip x={PHONE_X + 20} y={K_Y + 34} text="Warm" icon="" opacity={optChips} scale={1 + warmHighlight * 0.12} color={warmHighlight > 0.4 ? P.success : undefined} />
          <FilterChip x={PHONE_X + 140} y={K_Y + 34} text="Cool" icon="" opacity={optChips} />
          <FilterChip x={PHONE_X + 250} y={K_Y + 34} text="Pastel" icon="" opacity={optChips} />
          <Cursor x={cx} y={cy} opacity={cursorOp} click={Math.max(click1 % 1, click2 % 1)} />
          <StatPill x={PHONE_X + 20} y={K_Y + 100} emoji="✅" text="Saved to session — no typing" tone="success" opacity={savedTag} fontSize={15} />

          {/* ════ Beat 4 — one prompt, assembled ════ */}
          <Panel x={PHONE_X + 20} y={PR_Y} w={PHONE_W - 40} h={78} tone="accent" opacity={promptIn}>
            <div style={{ padding: "14px 20px", fontFamily }}>
              <div style={{ fontSize: 14.5, fontWeight: 650, color: P.ink, lineHeight: 1.45 }}>
                "Warm palette, soft studio light, confident corporate mood, centered subject"
              </div>
            </div>
          </Panel>
          {/* Shifted in from PHONE_X+20 to PHONE_X+40: at beat 4's 3.15x push the
              visible world-x window starts at ~386.8px, and flush left text at
              PHONE_X+20 (=380) got its leading glyph sliced off the frame. */}
          <div
            style={{
              position: "absolute",
              left: PHONE_X + 40,
              top: PR_Y + 86,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.4,
              color: P.muted,
              opacity: techTag,
              fontFamily,
            }}
          >
            cb_gen_7f3a → Azure OpenAI
          </div>
          <StatPill x={PHONE_X + 40} y={PR_Y + 108} emoji="🧩" text="42 taps → 1 real prompt" tone="accent" opacity={promptStat} fontSize={15} />

          {/* ════ Beat 5 — the payoff, revealed beside the phone ════ */}
          <Panel x={900} y={170} w={330} h={370} tone="success" opacity={cardIn}>
            <div style={{ padding: "26px 28px", fontFamily }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1.4, color: P.muted, opacity: beforeAfter }}>
                THE RESULT
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: P.ink, marginTop: 10, opacity: beforeAfter }}>
                2 hours <span style={{ color: P.muted }}>→</span> 15 minutes
              </div>
              <div
                style={{
                  fontSize: 108,
                  fontWeight: 800,
                  color: P.success,
                  marginTop: 12,
                  lineHeight: 1,
                  opacity: Math.min(1, heroPct),
                  transform: `scale(${0.85 + 0.15 * Math.min(1, heroPct)})`,
                  transformOrigin: "left center",
                }}
              >
                87%
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, opacity: Math.min(1, check) }}>
                <div style={{ position: "relative", width: 34, height: 34 }}>
                  <CheckBadge x={0} y={0} size={34} scale={check} opacity={Math.min(1, check)} />
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: P.success }}>less iteration time</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: P.muted, marginTop: 18, lineHeight: 1.4, opacity: resultSub }}>
                Non-technical moderators, real creative control.
              </div>
            </div>
          </Panel>
        </div>

        {/* ════ Bottom caption band — screen-fixed, one line per beat ════ */}
        <CaptionBand text='Nobody could turn "warmer" or "more corporate" into a real prompt' tone="danger" opacity={Math.min(seg(frame, 30, 50), 1 - seg(frame, 176, 190))} />
        <CaptionBand text="Every wrong guess cost another try — two hours of guessing, per article" tone="danger" opacity={Math.min(seg(frame, 210, 228), 1 - seg(frame, 348, 362))} />
        <CaptionBand text='Now nobody writes anything — you just tap: colour, mood, lighting' tone="accent" opacity={Math.min(seg(frame, 384, 402), 1 - seg(frame, 546, 560))} />
        <CaptionBand text="42 options, assembled into one instruction Azure OpenAI can read" opacity={Math.min(seg(frame, 588, 606), 1 - seg(frame, 760, 776))} />
        <CaptionBand text="2 hours of trial and error became 15 minutes — 87% gone" tone="success" opacity={seg(frame, 800, 818)} />
      </div>
    </PaletteProvider>
  );
};
