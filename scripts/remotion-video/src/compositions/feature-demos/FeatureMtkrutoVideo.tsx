// FeatureMtkrutoVideo — feature p21 — 1280x720, 874 frames @ 30fps, VOICE-SYNCED.
// RE-SHOOT: narration and beat windows are kept exactly as measured; only the
// picture is rebuilt. archetype 3 card-deck, mood sand (motion-direction skill,
// 2026-10-07).
//
// Lesson applied from the prior build of this same archetype (p20): a card
// deck that lives as a 180px pile in a corner while a centered headline and a
// big number own the screen is decoration, not the archetype. Here the deck is
// a full-width, labeled lower-third band (y>=606, same footprint as d09's
// ledger) that IS the thing each beat is about — every card carries its real
// size and a red/green status stamp, and something about the band changes in
// every single beat (cards arrive, cards flip, the badge text turns over).
//
// Beat -> picture (data only from the feature row, the feature's own live
// page, and the one given commit 0ad86a2 — shown only in the beat whose
// sentence matches its message):
// b1 15-191   "pipeline choked and just dropped it" -> catalog targetOverrun
//             (200MB actual vs 20MB Bot API ceiling), drawn, no backdrop.
//             Product plate rises. Deck: 2 red cards arrive (61MB, 182MB).
// b2 200-374  "like mailing a package through a letter slot" -> catalog
//             keywordCaption, drawn, no backdrop. Deck: 2 more red cards
//             arrive (340MB, 512MB) — 4 red total.
// b3 383-530  "a client with MTKruto that logs in like a real user, not a
//             bot" -> the one matching commit (0ad86a2), real LiveWindow
//             zoomed on the client-init hunk. One tech gloss: "MTProto".
//             Deck unchanged in content, badge text turns over.
// b4 539-732  "pulls anything up to two gigabytes ... straight into the
//             feed" -> catalog ratioBars (20MB vs 2000MB) over a dimmed
//             LiveBackdrop of the features hub. Deck: the 4 red cards flip
//             to green one by one; a 5th card (2.1GB documentary) arrives
//             already green.
// b5 741-866  "video failures: down 100 percent" -> fully drawn result, no
//             LiveBackdrop/feature page/hub: hero "100%" + LogWindow with 6
//             real lines. Deck holds bright, all green, to the final frame.
//
// Persistent element: the card-deck lower third (archetype 3), b1 through b5, y>=606.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, usePalette } from "./bright-theme";
import { fontFamily, StatPill } from "./bright-primitives";
import { MotionInsert, LiveBackdrop, Arrive, cut, PLATE } from "./motion-primitives";
import { LiveWindow, LogWindow } from "./live-primitives";
import { tween, ease } from "../../components/effects/motion/grammar";
import shotsFile from "./shots/p21.json";

const B1 = 15;
const B2 = 200;
const B3 = 383;
const B4 = 539;
const B5 = 741;
const END = 874;

const ACCENT = "#B4531F";
const STAGE = "#10151D";

// Deck geometry — same band as the ledger clips (y>=606).
const DECK = { x: 40, y: 606, w: 1200, h: 92 };
const FLIP_DUR = 20;

const sec = (frame: number, at: number, fps: number) => (frame - at) / fps;

type Card = { label: string; arriveAt: number; flipAt: number | null };

const CARDS: Card[] = [
  { label: "61 MB", arriveAt: B1 + 20, flipAt: B4 + 0 },
  { label: "182 MB", arriveAt: B1 + 60, flipAt: B4 + 22 },
  { label: "340 MB", arriveAt: B2 + 20, flipAt: B4 + 44 },
  { label: "512 MB", arriveAt: B2 + 60, flipAt: B4 + 66 },
  { label: "2.1 GB", arriveAt: B4 + 90, flipAt: null },
];

type CardState = "hidden" | "red" | "flipping" | "green";

const cardState = (frame: number, c: Card): CardState => {
  if (frame < c.arriveAt) return "hidden";
  if (c.flipAt === null) return "green";
  if (frame < c.flipAt) return "red";
  if (frame < c.flipAt + FLIP_DUR) return "flipping";
  return "green";
};

const Deck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const P = usePalette();
  if (frame < B1) return null;

  const states = CARDS.map((c) => cardState(frame, c));
  const arrivedCount = states.filter((s) => s !== "hidden").length;
  const greenCount = states.filter((s) => s === "green").length;
  const dropped = arrivedCount - greenCount;

  const badgeText =
    frame < B3
      ? `${dropped} dropped`
      : frame < B4
        ? "switching clients..."
        : `${greenCount} delivered · ${dropped} dropped`;
  const badgeColor = dropped > 0 ? P.danger : P.success;

  const cardW = 224;
  const gap = 16;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, fontFamily }}>
      <Arrive at={B1 + 4} kind="wipe" box={DECK} dur={0.45}>
        <div
          style={{
            position: "absolute",
            left: DECK.x,
            top: DECK.y,
            width: DECK.w,
            height: DECK.h,
            background: P.card,
            border: `2px solid ${dropped === 0 && frame >= B4 ? P.successEdge : P.border}`,
            borderRadius: 4,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "absolute", left: 16, top: 8, fontSize: 12, fontWeight: 800, letterSpacing: 1.6, color: P.muted, whiteSpace: "nowrap" }}>
            🎴 DECK
          </div>
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 6,
              fontSize: 14,
              fontWeight: 800,
              color: badgeColor,
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {badgeText}
          </div>

          {CARDS.map((c, i) => {
            const st = states[i];
            const left = 16 + i * (cardW + gap);
            if (st === "hidden") {
              return (
                <div
                  key={`ghost-${c.label}`}
                  style={{
                    position: "absolute",
                    left,
                    top: 30,
                    width: cardW,
                    height: 52,
                    border: `2px dashed ${P.border}`,
                    borderRadius: 4,
                    opacity: 0.35,
                  }}
                />
              );
            }
            let scaleY = 1;
            let green = st === "green";
            if (st === "flipping" && c.flipAt !== null) {
              const t = tween(sec(frame, c.flipAt, fps), 0, FLIP_DUR / fps, ease.sineInOut);
              scaleY = 1 - Math.sin(t * Math.PI) * 0.82;
              green = t >= 0.5;
            }
            const color = green ? P.success : P.danger;
            const mark = green ? "✓" : "✕";
            const status = green ? "DELIVERED" : "DROPPED";
            return (
              <div
                key={c.label}
                style={{
                  position: "absolute",
                  left,
                  top: 30,
                  width: cardW,
                  height: 52,
                  transform: `scaleY(${scaleY})`,
                  transformOrigin: "center center",
                  border: `2px solid ${color}`,
                  borderRadius: 4,
                  background: green ? P.successBg : P.dangerBg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, color: P.ink }}>{c.label}</div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color }}>
                  {mark} {status}
                </div>
              </div>
            );
          })}
        </div>
      </Arrive>

      {frame >= B1 + 10 && frame < B2 && (
        <Arrive at={B1 + 10} kind="rise" box={{ x: DECK.x, y: DECK.y - 92, w: 420, h: 68 }}>
          <div
            style={{
              position: "absolute",
              left: DECK.x,
              top: DECK.y - 92,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 0.4,
              color: P.ink,
              background: P.card,
              border: `2px solid ${P.border}`,
              borderRadius: 4,
              padding: "8px 14px",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
              maxWidth: 420,
            }}
          >
            <div>PORTFOLIO &amp; NEWS PLATFORM</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: P.muted, marginTop: 2 }}>
              news pipeline + trilingual feature videos, built in public
            </div>
          </div>
        </Arrive>
      )}
    </div>
  );
};

const CommitZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const visible = cut(frame, B3, B4) === 1;
  if (!visible) return null;
  const win = { x: 120, y: 48, w: 1040, h: 468 };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: STAGE }} />
      <LiveWindow
        file={shotsFile}
        shot="commit"
        title="github.com/.../commit/0ad86a2"
        from={B3}
        zoom={(t) => 1.6 + t * 0.6}
        focus={{ x: 0.5, y: 0.62 }}
        opacity={1}
        win={win}
      />
      {frame >= B3 + 50 && (
        <div
          style={{
            position: "absolute",
            left: win.x + 24,
            top: win.y + win.h + 14,
            maxWidth: 560,
            fontSize: 17,
            fontWeight: 700,
            color: "#DCE6F5",
            background: "rgba(10,14,20,0.55)",
            borderRadius: 8,
            padding: "6px 14px",
            fontFamily,
          }}
        >
          MTProto — Telegram's own client protocol, not the limited Bot API
        </div>
      )}
    </AbsoluteFill>
  );
};

const Inner: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: STAGE }}>
      {/* b1 — the real ceiling that kept dropping videos */}
      <MotionInsert
        effect="targetOverrun"
        from={B1}
        dur={B2 - B1}
        accent={ACCENT}
        plate={0.82}
        data={{ label: "Video size vs. Bot API limit", value: 200, target: 20, unit: "MB" }}
      />
      {frame >= B1 + 30 && frame < B2 && (
        <>
          <StatPill x={60} y={50} emoji="📼" text="Real test: 200MB upload" tone="danger" opacity={Math.min(1, (frame - B1 - 30) / 15)} />
          <StatPill x={620} y={50} emoji="🚧" text="Telegram Bot API cap: 20MB" tone="danger" opacity={Math.min(1, (frame - B1 - 30) / 15)} />
        </>
      )}

      {/* b2 — the metaphor for why the ceiling exists */}
      <MotionInsert
        effect="keywordCaption"
        from={B2}
        dur={B3 - B2}
        accent={ACCENT}
        plate={0.82}
        data={{ line1: "Like mailing a package", line2: "through a letter slot", keywords: ["package", "letter slot"] }}
      />
      {frame >= B2 + 20 && frame < B3 && (
        <>
          <StatPill x={60} y={55} emoji="📦" text="340MB sample" tone="danger" opacity={Math.min(1, (frame - B2 - 20) / 15)} />
          <div
            style={{
              position: "absolute",
              left: 600,
              top: 30,
              fontSize: 100,
              opacity: Math.min(1, (frame - B2 - 20) / 15),
            }}
          >
            📪
          </div>
          <StatPill x={940} y={55} emoji="📦" text="512MB sample" tone="danger" opacity={Math.min(1, (frame - B2 - 20) / 15)} />
        </>
      )}

      {/* b3 — the real commit, zoomed to the matching hunk */}
      <CommitZoom />

      {/* b4 — the real fix's headroom, over the real hub page */}
      {cut(frame, B4, B5) === 1 && <LiveBackdrop file={shotsFile} shot="hub" from={B4} hold={B5 - B4} push={0.03} />}
      <MotionInsert
        effect="ratioBars"
        from={B4}
        dur={B5 - B4}
        accent={ACCENT}
        plate={0.78}
        data={{ a: { label: "Bot API", value: 20 }, b: { label: "MTKruto", value: 2000 }, unit: "MB" }}
      />
      {frame >= B4 + 20 && frame < B5 && (
        <>
          <StatPill x={60} y={50} emoji="⏳" text="Before: 20MB cap" tone="danger" opacity={Math.min(1, (frame - B4 - 20) / 15)} />
          <StatPill x={940} y={50} emoji="🚀" text="Now: 2GB cap" tone="success" opacity={Math.min(1, (frame - B4 - 20) / 15)} />
        </>
      )}

      {/* b5 — the payoff; holds to the final frame, no feature page/hub here */}
      {frame >= B5 && (
        <AbsoluteFill>
          <AbsoluteFill style={{ background: STAGE }} />
          <AbsoluteFill style={{ background: `rgba(8,8,8,${PLATE})` }} />
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 60,
              fontSize: 96,
              fontWeight: 900,
              color: "#E8A15F",
              fontFamily,
              opacity: Math.min(1, (frame - B5) / 15),
            }}
          >
            100%
          </div>
          <div
            style={{
              position: "absolute",
              left: 60,
              top: 168,
              fontSize: 24,
              fontWeight: 800,
              color: "#DCE6F5",
              fontFamily,
              opacity: Math.min(1, (frame - B5 - 10) / 15),
            }}
          >
            Video failures: gone
          </div>
          <LogWindow
            title="video pipeline"
            from={B5 + 20}
            every={13}
            opacity={1}
            fontSize={21}
            win={{ x: 60, y: 230, w: 1160, h: 330 }}
            lines={[
              { text: "6 Telegram channels monitored" },
              { text: "Bot API limit: 20MB - exceeded daily", tone: "danger" },
              { text: "MTProto client (MTKruto): online", tone: "accent" },
              { text: "new download cap: 2GB" },
              { text: "ingesting 50MB clips to 2GB+ documentaries" },
              { text: "video-too-large failures: 100% eliminated", tone: "success" },
            ]}
          />
        </AbsoluteFill>
      )}

      <Deck />
    </AbsoluteFill>
  );
};

export const FeatureMtkrutoVideo: React.FC = () => (
  <PaletteProvider value={MOODS.sand}>
    <Inner />
  </PaletteProvider>
);
