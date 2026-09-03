/**
 * FeatureMtkrutoVideo — feature p21 — 1280x720, 874 frames @30fps.
 * VOICE-SYNCED (owner rule, 2026-08-31) — the beat windows below are measured
 * from the real voiceover, not a designer's guess. Rebuild the audio and you
 * must rebuild these numbers with it.
 *
 * Art direction handed down by the orchestrating session (STEP 0 of
 * lux-batch-instructions.md), NOT drawn locally:
 *   archetype 3 "card deck" — a single persistent object, a WALL WITH A SLOT
 *     (a literal "mail slot" a video file must pass through) spans the middle
 *     of the frame from frame ~10 to the end. It is a floor-to-ceiling
 *     doorway (175-545 of the 720px canvas), not a thin bar — the dominant,
 *     longest-lived shape in every beat (review pass 2026-09-03 enlarged it
 *     from an 8%-tall strip to this). Video-file cards fly in from above it:
 *     in beats 1-2 they are too wide for the narrow slot and get stamped and
 *     stuck deep inside its mouth; in beat 3 the slot swings open; in beat 4
 *     five cards of escalating size drop through and fan out into an
 *     overlapping deck inside the open doorway; beat 5's payoff number is
 *     delivered inside that same doorway. The wall+slot is the thing that
 *     survives every beat — its width is the whole story, told without a
 *     single centered headline+icon-row layout.
 *   mood "sand" — `<PaletteProvider value={MOODS.sand}>` wraps the whole tree.
 *
 * Beat windows (measured, fps 30):
 *   b1  15-191  "Every time a news video passed 20 megabytes, my pipeline
 *                choked and just dropped it — gone."
 *   b2 200-374  "Telegram's own rules capped downloads that small, like
 *                trying to mail a package through a letter slot."
 *   b3 383-530  "So I built a client with MTKruto that logs in like a real
 *                user, not a bot."
 *   b4 539-732  "Now it pulls anything up to two gigabytes, from short clips
 *                to full documentaries, straight into the feed."
 *   b5 741-829  "Video failures: down 100 percent."
 *   tail 829-874 — b5 HOLDS at full opacity, no fade, no loopFade (no loop).
 *
 * Sync notes: the slot is drawn narrow (90px) through b1/b2 — nothing passes.
 * The ID-badge flip (bot -> real user) happens inside b3's own window, and
 * the slot widening is driven off that flip so the "opens" moment lands on
 * the words "logs in like a real user", not before. Beat 4's four cards do
 * not appear until the slot is already wide, because b4 is the beat that
 * says things get through. The b3->b4 change is a slide+scale push (b3's
 * badge slides left as it leaves, b4's cards push in from the right and
 * scale up), not a plain crossfade. The single tech-credibility caption
 * ("MTProto client, not the Bot API") appears once, inside b3, and nowhere
 * else in the clip.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { MOODS, PaletteProvider, cardShadow, usePalette } from "./bright-theme";
import {
  LightBg,
  Group,
  StatPill,
  FlowArrow,
  CheckBadge,
  CaptionBand,
  seg,
  fontFamily,
} from "./bright-primitives";

const P = MOODS.sand;

/** Measured beat windows — see the header. Do not hand-tune without rebuilding the audio. */
const BEATS = {
  b1: [15, 191],
  b2: [200, 374],
  b3: [383, 530],
  b4: [539, 732],
  b5: [741, 829],
} as const;

// ── Wall geometry (the one object that survives every beat) ──
// Floor-to-ceiling doorway, not a thin bar: the wall now owns the vertical
// middle of the frame (175-545 of 720) so the deck reads as the dominant
// object, not a diagram floating in whitespace (review fix #1/#2).
const WALL_X0 = 130;
const WALL_TOTAL_W = 1020;
const WALL_Y = 175;
const WALL_H = 370;
const WALL_CX = WALL_X0 + WALL_TOTAL_W / 2; // 640

/** A video-file card — the deck's unit of currency. */
const FileCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  emoji: string;
  size: string;
  label: string;
  tone?: "danger" | "success" | "neutral";
  stamp?: "reject" | "accept";
  stampOpacity?: number;
  opacity?: number;
  scaleY?: number;
  rotate?: number;
}> = ({ x, y, w = 220, h = 88, emoji, size, label, tone = "neutral", stamp, stampOpacity = 0, opacity = 1, scaleY = 1, rotate = 0 }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  const edge = tone === "danger" ? B.danger : tone === "success" ? B.success : B.border;
  const bg = tone === "danger" ? B.dangerBg : tone === "success" ? B.successBg : B.card;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        transform: `scaleY(${scaleY}) rotate(${rotate}deg)`,
        transformOrigin: "center",
        borderRadius: 14,
        background: bg,
        border: `2px solid ${edge}`,
        boxShadow: cardShadow,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        fontFamily,
      }}
    >
      <span style={{ fontSize: 32 }}>{emoji}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color: B.ink, whiteSpace: "nowrap" }}>{size}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: B.muted, whiteSpace: "nowrap" }}>{label}</div>
      </div>
      {stamp && stampOpacity > 0.004 ? (
        <div
          style={{
            position: "absolute",
            right: -14,
            top: -14,
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: stamp === "reject" ? B.danger : B.success,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 19,
            fontWeight: 900,
            opacity: stampOpacity,
            transform: `scale(${Math.min(1, stampOpacity * 1.3)})`,
            boxShadow: cardShadow,
          }}
        >
          {stamp === "reject" ? "✕" : "✓"}
        </div>
      ) : null}
    </div>
  );
};

/** The persistent wall-with-a-slot. Present from ~frame 10 to the end. */
const Wall: React.FC<{ opacity: number; slotWidth: number; openness: number }> = ({ opacity, slotWidth, openness }) => {
  const B = usePalette();
  if (opacity <= 0.004) return null;
  const leftW = Math.max(0, WALL_CX - slotWidth / 2 - WALL_X0);
  const rightX = WALL_CX + slotWidth / 2;
  const rightW = Math.max(0, WALL_X0 + WALL_TOTAL_W - rightX);
  const slotTint = openness > 0.5 ? B.successBg : B.dangerBg;
  const slotEdge = openness > 0.5 ? B.success : B.danger;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: WALL_CX - slotWidth / 2,
          top: WALL_Y - 6,
          width: slotWidth,
          height: WALL_H + 12,
          borderRadius: 10,
          background: slotTint,
          border: `2.5px dashed ${slotEdge}`,
          opacity: opacity * 0.95,
        }}
      />
      <div style={{ position: "absolute", left: WALL_X0, top: WALL_Y, width: leftW, height: WALL_H, borderRadius: 10, background: B.ink, opacity: opacity * 0.92 }} />
      <div style={{ position: "absolute", left: rightX, top: WALL_Y, width: rightW, height: WALL_H, borderRadius: 10, background: B.ink, opacity: opacity * 0.92 }} />
    </>
  );
};

export const FeatureMtkrutoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  /** Zone visibility: fades in after the beat opens, fully gone before it closes. */
  const zone = (name: keyof typeof BEATS) => {
    const [s, e] = BEATS[name];
    return Math.min(seg(frame, s + 2, s + 16), 1 - seg(frame, e - 10, e - 2));
  };

  const b1 = zone("b1");
  const b2 = zone("b2");
  const b3 = zone("b3");
  const b4 = zone("b4");
  // b5 has nothing to hand over to — it holds through the tail instead of fading out.
  const b5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);

  // ── The wall — persistent, opens exactly as beat 3's login lands ──
  const wallIn = seg(frame, 8, 24);
  const flip = seg(frame, BEATS.b3[0] + 20, BEATS.b3[0] + 70); // 403-453
  const gateOpen = interpolate(frame, [423, 523], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const slotWidth = interpolate(gateOpen, [0, 1], [90, 560]);
  const tagRedOp = interpolate(gateOpen, [0, 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagGreenOp = interpolate(gateOpen, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1: the problem — three videos fall, all too wide, all rejected ──
  // Columns spread across the full doorway width; cards land deep inside the
  // tall wall's mouth (not hovering above a thin bar) — review fix #1/#2.
  const cardsB1 = [
    { col: 260, size: "187 MB", label: "news clip", emoji: "🎬", start: 25 },
    { col: 640, size: "412 MB", label: "interview", emoji: "🎤", start: 70 },
    { col: 1020, size: "96 MB", label: "explainer", emoji: "📹", start: 115 },
  ];
  const cornerScale = Math.min(1, pop(60));

  // ── Beat 2: the letter-slot squeeze — one package, pressed and bounced ──
  // Pushes deep into the tall doorway before bouncing back, so the struggle
  // reads against the full height of the wall, not a thin bar (review fix #1).
  const packageY = interpolate(
    frame,
    [210, 240, 270, 300, 320, 374],
    [160, 260, 380, 290, 310, 310],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const packageSquish = interpolate(frame, [255, 270, 285], [1, 0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const packageStamp = seg(frame, 310, 326);
  const packageNote = seg(frame, 314, 330);

  // ── Beat 3 -> 4 push transition (not a plain crossfade) ──
  const b3ExitT = seg(frame, BEATS.b3[1] - 10, BEATS.b3[1] - 2);
  const b3TranslateX = -50 * b3ExitT;
  const b4EnterT = seg(frame, BEATS.b4[0] + 2, BEATS.b4[0] + 16);
  const b4TranslateX = 60 * (1 - b4EnterT);
  const b4Scale = 0.94 + 0.06 * b4EnterT;

  // ── Beat 3: MTKruto logs in — badge flips, the wall widens because of it ──
  const angle = flip * Math.PI;
  const badgeScaleAbs = Math.abs(Math.cos(angle));
  const frontVisible = flip <= 0.5;
  const arrow3 = seg(frame, 410, 460, Easing.inOut(Easing.cubic));
  const techCaption = seg(frame, 460, 476);

  // ── Beat 4: everything gets through — five sizes fan out inside the wide-
  // open doorway, escalating small-to-large left to right (review fix #3:
  // the sampled frame must read as a real deck, not two lonely cards). All
  // five values are real facts already used elsewhere in this file (45 MB /
  // 96 MB / 340 MB / 890 MB / 1.9 GB) — none invented. Tight staggering
  // means most of the beat shows the full fanned deck at once.
  const FAN_CY = 345; // vertical center of the fan, inside the tall doorway
  const cardsB4 = [
    { size: "45 MB", label: "short clip", gridX: WALL_CX - 220, gridY: FAN_CY + 30, rot: -14, start: 545 },
    { size: "96 MB", label: "explainer", gridX: WALL_CX - 110, gridY: FAN_CY + 10, rot: -7, start: 565 },
    { size: "340 MB", label: "weekly recap", gridX: WALL_CX, gridY: FAN_CY, rot: 0, start: 585 },
    { size: "890 MB", label: "long interview", gridX: WALL_CX + 110, gridY: FAN_CY + 10, rot: 7, start: 605 },
    { size: "1.9 GB", label: "full documentary", gridX: WALL_CX + 220, gridY: FAN_CY + 30, rot: 14, start: 625 },
  ];
  const caption4 = seg(frame, 610, 626);

  // ── Beat 5: the payoff — 100%, held through the tail ──
  const eyebrow5 = seg(frame, BEATS.b5[0] + 2, BEATS.b5[0] + 16);
  const numberPop = Math.min(1.08, pop(750));
  const numberOp = seg(frame, 745, 761);
  const row5 = seg(frame, 770, 786);
  const check5 = Math.min(1, pop(778));
  const chip5 = Math.min(1, pop(762));
  const chip5Op = seg(frame, 760, 776);

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily }}>
      <LightBg />
      <PaletteProvider value={P}>
        <Group opacity={1}>
          {/* ════ Persistent headline — small, bottom-left, never centered ════ */}
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 650,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: P.accent,
              opacity: seg(frame, 18, 34),
              fontFamily,
            }}
          >
            MTKruto video pipeline
          </div>
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 676,
              fontSize: 20,
              fontWeight: 700,
              color: P.ink,
              opacity: seg(frame, 18, 34),
              fontFamily,
            }}
          >
            20 MB wall, wide open now
          </div>

          {/* ════ The wall — the one object that survives every beat ════ */}
          <Wall opacity={wallIn} slotWidth={slotWidth} openness={gateOpen} />
          <div
            style={{
              position: "absolute",
              left: WALL_CX - 130,
              top: WALL_Y - 35,
              width: 260,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 800,
              color: P.danger,
              opacity: tagRedOp * wallIn,
              fontFamily,
            }}
          >
            {"🚪 20 MB opening"}
          </div>
          <div
            style={{
              position: "absolute",
              left: WALL_CX - 130,
              top: WALL_Y - 35,
              width: 260,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 800,
              color: P.success,
              opacity: tagGreenOp * wallIn,
              fontFamily,
            }}
          >
            {"🚪 2 GB opening"}
          </div>

          {/* ════ Beat 1 — PROBLEM: three videos, three rejections ════ */}
          <Group opacity={b1}>
            <CaptionBand
              y={84}
              text="Every video over 20 MB just vanished — dropped, not delivered."
              tone="danger"
              opacity={seg(frame, 40, 56)}
            />
            <StatPill
              x={800}
              y={18}
              emoji="📡"
              text="6 channels · 50-500 MB+ videos"
              tone="danger"
              opacity={cornerScale}
              scale={cornerScale}
            />
            {cardsB1.map((c) => {
              const land = c.start + 34;
              const y = interpolate(frame, [c.start, land], [140, WALL_Y + 90], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });
              const shake =
                frame >= land && frame < land + 12
                  ? Math.sin((frame - land) * 1.4) * (8 * (1 - (frame - land) / 12))
                  : 0;
              const cardOp = seg(frame, c.start, c.start + 8);
              const stampOp = seg(frame, land + 2, land + 14);
              return (
                <FileCard
                  key={c.label}
                  x={c.col + shake}
                  y={y}
                  w={240}
                  h={100}
                  size={c.size}
                  label={c.label}
                  emoji={c.emoji}
                  tone="danger"
                  stamp="reject"
                  stampOpacity={stampOp}
                  opacity={cardOp}
                />
              );
            })}
          </Group>

          {/* ════ Beat 2 — LETTER SLOT: a package too big for the opening ════ */}
          <Group opacity={b2}>
            <CaptionBand
              y={84}
              text="Telegram's own limit acts like a narrow letter slot, not a doorway."
              tone="danger"
              opacity={seg(frame, 222, 238)}
            />
            <FileCard
              x={WALL_CX}
              y={packageY}
              w={320}
              h={150}
              size="340 MB"
              label="weekly recap video"
              emoji="🎥"
              tone="danger"
              scaleY={packageSquish}
              stamp="reject"
              stampOpacity={packageStamp}
              opacity={seg(frame, 205, 218)}
            />
            <div
              style={{
                position: "absolute",
                left: WALL_CX - 200,
                top: WALL_Y + WALL_H + 20,
                width: 400,
                textAlign: "center",
                fontSize: 17,
                fontWeight: 700,
                color: P.danger,
                opacity: packageNote,
                fontFamily,
              }}
            >
              Too big for the opening — bounced back every time
            </div>
          </Group>

          {/* ════ Beat 3 — MTKRUTO LOGS IN: badge flips, wall widens ════ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: b3,
              transform: `translateX(${b3TranslateX}px)`,
              fontFamily,
            }}
          >
            <CaptionBand
              y={84}
              text="MTKruto: a full MTProto client, not the Bot API"
              tone="accent"
              opacity={techCaption}
            />
            <div style={{ position: "absolute", left: 240, top: 230, width: 280, height: 130 }}>
              {frontVisible ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `scaleX(${badgeScaleAbs})`,
                    transformOrigin: "center",
                    borderRadius: 16,
                    background: P.dangerBg,
                    border: `2px solid ${P.danger}`,
                    boxShadow: cardShadow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    color: P.danger,
                    textAlign: "center",
                    padding: "0 12px",
                    fontFamily,
                  }}
                >
                  {"🤖 Bot API session"}
                </div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `scaleX(${badgeScaleAbs})`,
                    transformOrigin: "center",
                    borderRadius: 16,
                    background: P.successBg,
                    border: `2px solid ${P.success}`,
                    boxShadow: cardShadow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    color: P.success,
                    textAlign: "center",
                    padding: "0 12px",
                    fontFamily,
                  }}
                >
                  {"👤 Real user (MTKruto)"}
                </div>
              )}
            </div>
            <FlowArrow x={530} y={284} len={110} progress={arrow3} color={P.accent} />
          </div>

          {/* ════ Beat 4 — EVERYTHING GETS THROUGH: five sizes fan into a deck ════ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: b4,
              transform: `translateX(${b4TranslateX}px) scale(${b4Scale})`,
              transformOrigin: "center",
              fontFamily,
            }}
          >
            <CaptionBand
              y={84}
              text="From a 45 MB clip to a 1.9 GB documentary — everything gets through now."
              tone="success"
              opacity={caption4}
            />
            {cardsB4.map((c) => {
              const land = c.start + 50;
              // Drop straight down through the open slot, then fan out sideways
              // into a stacked, overlapping deck (not a thin 2x2 grid) — the
              // escalating sizes read left-to-right across the fan.
              const x = interpolate(frame, [c.start, c.start + 28, land], [WALL_CX, WALL_CX, c.gridX], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.inOut(Easing.cubic),
              });
              const y = interpolate(frame, [c.start, c.start + 28, land], [10, 220, c.gridY], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.inOut(Easing.cubic),
              });
              const rotate = interpolate(frame, [c.start, c.start + 28, land], [0, 0, c.rot], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.inOut(Easing.cubic),
              });
              const cardOp = seg(frame, c.start, c.start + 8);
              const stampOp = seg(frame, land + 2, land + 14);
              return (
                <FileCard
                  key={c.label}
                  x={x}
                  y={y}
                  w={180}
                  h={84}
                  rotate={rotate}
                  size={c.size}
                  label={c.label}
                  emoji="🎬"
                  tone="success"
                  stamp="accept"
                  stampOpacity={stampOp}
                  opacity={cardOp}
                />
              );
            })}
          </div>

          {/* ════ Beat 5 — RESULT, delivered inside the now wide-open doorway,
               holds through the tail (review fix #2: the wall stays the frame's
               dominant element right through the payoff, not just beats 1-4) ════ */}
          <Group opacity={b5}>
            <StatPill
              x={90}
              y={104}
              emoji="📦"
              text="20 MB → 2 GB per file"
              tone="success"
              opacity={chip5Op}
              scale={chip5}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: WALL_Y + 20,
                width: 1280,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 2.4,
                textTransform: "uppercase",
                color: P.accent,
                opacity: eyebrow5,
                fontFamily,
              }}
            >
              Result
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 260,
                width: 1280,
                textAlign: "center",
                fontSize: 140,
                fontWeight: 900,
                letterSpacing: -4,
                color: P.success,
                opacity: numberOp,
                transform: `scale(${numberPop})`,
                transformOrigin: "center",
                fontFamily,
              }}
            >
              100%
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: WALL_Y + WALL_H - 70,
                width: 1280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                opacity: row5,
                fontFamily,
              }}
            >
              <div style={{ position: "relative", width: 46, height: 46 }}>
                <CheckBadge x={0} y={0} size={46} scale={check5} opacity={check5} />
              </div>
              <span style={{ fontSize: 30, fontWeight: 800, color: P.success }}>Video failures — eliminated</span>
            </div>
          </Group>
        </Group>
      </PaletteProvider>
    </div>
  );
};
