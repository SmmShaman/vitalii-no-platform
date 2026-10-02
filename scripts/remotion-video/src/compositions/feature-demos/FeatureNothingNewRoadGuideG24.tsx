/**
 * FeatureNothingNewRoadGuideG24 — feature g24 — 1280x720, 879 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 5 "ledger", mood "dawn" (both handed down by the
 * orchestrating session, not re-rolled). One receipt-style ledger card is the
 * recurring element across beats 1 and 2: the drive's status is itemised in
 * red ("Guide: SILENT", zero new places left), then a "REPLAY MODE" section
 * is appended and the SILENT row is struck and replaced with "REPLAYING" —
 * never a crossfade. Beat 3 scale-pushes the real feature page in as the
 * substantiated claim (the 16-hour/priority rule), the second non-crossfade
 * move; beat 4 rises in on a LogWindow, the third.
 *
 * Beats 1 and 2 are the dead-air problem and the replay fix — metaphor/
 * plumbing, so they stay drawn per STEP 0c. Beat 3 is the substantiated
 * claim ("a place only replays after sixteen hours of quiet, and a
 * genuinely new spot always jumps ahead of it"), so it plays a recording of
 * the real feature page (shots/g24.json, shot "page"). Beat 4 does NOT play
 * the feature page or the hub (gate 2): it closes on a LogWindow built from
 * the feature row's own numbers — this product keeps no runtime log on the
 * VPS, so these lines are assembled from problem/solution/result, never
 * invented.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-175  "On roads I drive almost every day, the guide runs out of
 *              new places and goes quiet."
 *  b2 184-389  "Now it replays a story from an earlier drive instead — like
 *              a guide repeating a tale rather than falling silent."
 *  b3 398-602  "A place only replays after sixteen hours of quiet, and a
 *              genuinely new spot always jumps ahead of it."
 *  b4 611-834  "A separate fix also stopped town-wide stories from starting
 *              two point five kilometers early — now they wait until I'm
 *              actually there." — holds to 879.
 *
 * Single tech name in the whole clip: Java (beat 3 chip only — DriveService
 * .java is the file implementing the replay rule; gloss: "the code deciding
 * what plays next, in the car").
 * All numbers on screen (16h replay threshold, 1200m episode-start radius,
 * 2.5km early start now fixed to 0) are the real values from the feature
 * row — nothing here is invented. The commit (79c0513, "replay earlier
 * drives' places instead of silence") is represented only as these derived
 * numbers and function names (REPLAY_AFTER_MS, pickReplay(), EPISODE_MAX_M),
 * never as a live diff — no GitHub commit URL was in the verified-URL list
 * for this feature.
 * Emoji used (single codepoint only): 🛣 🔇 🚗 🔁 🎙 📍 ✅ 🏁 ⏱
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import {
  LightBg,
  Panel,
  Headline,
  CaptionBand,
  StatPill,
  IconCard,
  FilterChip,
  CheckBadge,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/g24.json";

const P = MOODS.dawn;

const B1_S = 15, B1_E = 175;
const B2_S = 184, B2_E = 389;
const B3_S = 398, B3_E = 602;
const B4_S = 611, B4_E = 834;
const END = 879;
const FADE = 16;

const CARD_X = 340;
const CARD_Y = 132;
const CARD_W = 600;
const CARD_H = 400;
const PAD = 28;

const WIN3: Win = { x: 374, y: 146, w: 806, h: 396 };
const WIN_LOG: Win = { x: 280, y: 150, w: 880, h: 414 };

/** One ledger line: label, dotted leader, value — with an optional strike-through wipe. */
const LedgerRow: React.FC<{
  y: number;
  label: string;
  value: string;
  tone: "danger" | "success" | "ink";
  opacity?: number;
  strike?: number;
}> = ({ y, label, value, tone, opacity = 1, strike = 0 }) => {
  if (opacity <= 0.004) return null;
  const c = tone === "danger" ? P.danger : tone === "success" ? P.success : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_X + PAD,
        top: y,
        width: CARD_W - PAD * 2,
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        opacity,
        fontFamily,
      }}
    >
      <span style={{ position: "relative", fontSize: 18, fontWeight: 650, color: P.ink, whiteSpace: "nowrap" }}>
        {label}
        {strike > 0.004 ? (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "54%",
              height: 2,
              width: `${Math.min(1, strike) * 100}%`,
              background: P.danger,
            }}
          />
        ) : null}
      </span>
      <span style={{ flex: 1, borderBottom: `2px dotted ${P.border}`, marginBottom: 5 }} />
      <span style={{ fontSize: 18, fontWeight: 800, color: c, whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
};

const Dash: React.FC<{ y: number; opacity?: number }> = ({ y, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: CARD_X + PAD,
      top: y,
      width: CARD_W - PAD * 2,
      borderBottom: `1.5px dashed ${P.border}`,
      opacity,
    }}
  />
);

export const FeatureNothingNewRoadGuideG24: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ---- transient captions/headline per beat (fade in AND out) ----
  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE); // holds through the tail — no fade-out

  // ---- the ledger card: alive continuously for beats 1-2, gone for 3-4 ----
  const cardOp = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const cardScale = 0.94 + cardOp * 0.06;

  // beat 1: drive status, row by row
  const plateOp = seg(frame, B1_S + 10, B1_S + 22);
  const row0In = seg(frame, B1_S + 20, B1_S + 32);
  const row1In = seg(frame, B1_S + 40, B1_S + 52);
  const row2In = seg(frame, B1_S + 60, B1_S + 72);
  const totalIn = seg(frame, B1_S + 90, B1_S + 106);
  const sideIn1 = pop(B1_S + 26);

  // beat 2: REPLAY MODE section appended, then the SILENT -> REPLAYING flip
  const dividerOp = seg(frame, B2_S + 10, B2_S + 22);
  const sectionTitleOp = seg(frame, B2_S + 16, B2_S + 28);
  const row3In = seg(frame, B2_S + 20, B2_S + 32);
  const row4In = seg(frame, B2_S + 40, B2_S + 52);
  const sideIn2 = pop(B2_S + 16);
  const strike1S = B2_S + 60, strike1E = strike1S + 14;
  const old1Gone = strike1E + 10;
  const new1In = old1Gone + 14;

  // beat 3: scale-push the real evidence in + the two rule callouts
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ladderPop = pop(B3_S + 40);
  const toppedUpPop = pop(B3_S + 92);
  const chipPop = pop(B3_S + 140);

  // beat 4: the LogWindow close — the 2.5km early-start bug, now fixed
  const b4dy = interpolate(frame, [B4_S, B4_S + 26], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const heroRaw = interpolate(frame, [B4_S + 20, B4_S + 140], [2.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const hero = Math.round(heroRaw * 10) / 10;
  const statPop = pop(B4_S + 10);
  const checkPop = pop(B4_S + 150);
  const LOG_LINES: LogLine[] = [
    { t: "rule", text: "REPLAY_AFTER_MS = 16h -> place becomes replayable", tone: "muted" },
    { t: "pick", text: "pickReplay(): by-the-road places only", tone: "accent" },
    { t: "priority", text: "new place found mid-drive -> always wins", tone: "success" },
    { t: "episode", text: "EPISODE_MAX_M = 1200m start radius", tone: "muted" },
    { t: "bug", text: "Kapp's road episode started ~2.5km early", tone: "danger" },
    { t: "fix", text: "now waits until arrival -> 0km early", tone: "success" },
  ];

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= per-beat headline ================= */}
        <Headline y={26} text="The guide runs out of things to say." opacity={b1} fontSize={30} />
        <Headline y={26} text="Now it tells an old story instead of none." opacity={b2} fontSize={30} />
        <Headline y={26} text="Replays wait — new places never do." opacity={b3} fontSize={30} />
        <Headline y={26} text="No more starting the story too soon." opacity={b4} fontSize={30} />

        {/* product plate — beat 1 only */}
        <Panel x={40} y={96} w={430} h={132} tone="card" opacity={plateOp * b1}>
          <div style={{ position: "absolute", left: 20, top: 16, right: 20 }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: P.ink }}>🛣 Guide — Stories on the Road</div>
            <div style={{ fontSize: 14, color: P.muted, lineHeight: 1.4, marginTop: 8 }}>
              A personal audio guide for driving: the phone knows where I am
              and plays short stories about the places around me, in
              Norwegian and Ukrainian side by side.
            </div>
          </div>
        </Panel>

        {/* ================= the ledger (archetype 5) — beats 1-2 ================= */}
        <div
          style={{
            position: "absolute",
            left: CARD_X,
            top: CARD_Y,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 18,
            background: P.card,
            border: `1.5px solid ${P.border}`,
            boxShadow: "0 16px 40px rgba(22,35,63,0.16)",
            opacity: cardOp,
            transform: `scale(${cardScale})`,
            transformOrigin: "center",
          }}
        >
          <div style={{ position: "absolute", left: PAD, top: 22, fontSize: 14, fontWeight: 700, letterSpacing: 2, color: P.muted }}>
            🛣 TONIGHT'S DRIVE — STATUS
          </div>
        </div>
        <Dash y={CARD_Y + 52} opacity={cardOp} />

        {/* beat 1 rows: the dead-air status */}
        <LedgerRow y={CARD_Y + 70} label="Road" value="familiar — driven daily" tone="ink" opacity={row0In * cardOp} />
        <LedgerRow y={CARD_Y + 106} label="New places nearby" value="0" tone="danger" opacity={row1In * cardOp} />
        {/* Guide status row: SILENT (beat 1), struck and replaced by REPLAYING (beat 2) */}
        <LedgerRow
          y={CARD_Y + 142}
          label="Guide"
          value="SILENT"
          tone="danger"
          strike={seg(frame, strike1S, strike1E)}
          opacity={cardOp * row2In * (1 - seg(frame, strike1E, old1Gone))}
        />
        <LedgerRow y={CARD_Y + 142} label="Guide" value="REPLAYING" tone="success" opacity={seg(frame, old1Gone, new1In) * b2} />
        <Dash y={CARD_Y + 172} opacity={totalIn * cardOp} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 184, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: totalIn * cardOp }}>
          RESULT
        </div>
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 204, fontSize: 26, fontWeight: 800, color: P.danger, opacity: totalIn * cardOp }}>
          dead air
        </div>

        {/* beat 2: REPLAY MODE section appended below */}
        <Dash y={CARD_Y + 246} opacity={dividerOp * b2} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 260, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: sectionTitleOp * b2 }}>
          REPLAY MODE — ADDED
        </div>
        <LedgerRow y={CARD_Y + 286} label="Source" value="earlier drive" tone="success" opacity={row3In * b2} />
        <LedgerRow y={CARD_Y + 318} label="Replayed place" value="already heard once" tone="success" opacity={row4In * b2} />

        {/* side flanking tiles — beat 1 */}
        <IconCard x={40} y={280} w={250} emoji="🚗" title="Familiar road" sub="driven almost every day" tone="accent" opacity={b1} scale={Math.min(1, sideIn1)} />
        <IconCard x={990} y={280} w={250} emoji="🔇" title="Nothing new" sub="guide goes quiet" tone="danger" opacity={b1} scale={Math.min(1, sideIn1)} />

        {/* side flanking tiles — beat 2 */}
        <IconCard x={40} y={280} w={250} emoji="🔁" title="Replays now" sub="story from an earlier drive" tone="success" opacity={b2} scale={Math.min(1, sideIn2)} />
        <IconCard x={990} y={280} w={250} emoji="🎙" title="Not silence" sub="repeats a tale instead" tone="accent" opacity={b2} scale={Math.min(1, sideIn2)} />

        {/* per-beat caption band */}
        <CaptionBand text="On familiar roads, the guide runs out of new places and goes quiet" opacity={b1} tone="danger" />
        <CaptionBand text="Now it replays a story from an earlier drive instead of falling silent" opacity={b2} tone="accent" />
        <CaptionBand text="Replays wait sixteen hours — a genuinely new place always jumps the queue" opacity={b3} tone="accent" />
        <CaptionBand text="No more early starts — the guide waits until I'm actually there" opacity={b4} tone="success" />

        {/* ================= beat 3: the real page, and the two rule callouts ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: b3,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN3.x + WIN3.w / 2}px ${WIN3.y + WIN3.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-g24"
            win={WIN3}
            from={B3_S}
            hold={B3_E - B3_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.4 }}
            opacity={1}
          />
        </div>
        <Panel x={40} y={180} w={290} h={90} tone="accent" opacity={b3 * Math.min(1, ladderPop)}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: P.accent }}>⏱ 16h replay threshold</div>
          </div>
        </Panel>
        <StatPill x={40} y={300} emoji="🏁" text="a new place always wins" tone="success" opacity={b3 * Math.min(1, toppedUpPop)} />
        <FilterChip
          x={40}
          y={380}
          text="Java"
          icon="☕"
          color={P.accent}
          scale={Math.min(1, chipPop)}
          opacity={b3 * Math.min(1, chipPop)}
        />
        <div style={{ position: "absolute", left: 40, top: 424, width: 290, fontSize: 14, color: P.muted, lineHeight: 1.35, opacity: b3 * Math.min(1, chipPop) }}>
          the code deciding what plays next, in the car
        </div>

        {/* ================= beat 4: the fix is already running (rise-in, LogWindow) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b4, transform: `translateY(${b4dy}px)` }}>
          <div
            style={{
              position: "absolute",
              left: 260,
              top: 60,
              width: 900,
              fontSize: 29,
              fontWeight: 800,
              color: P.ink,
              letterSpacing: -0.2,
              fontFamily,
            }}
          >
            The fix is already running.
          </div>
          <Panel x={40} y={150} w={210} h={170} tone="success" opacity={Math.min(1, statPop)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 30 }}>📍</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{hero}km</div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", lineHeight: 1.3 }}>
                EARLY START
                <br />
                (NOW FIXED)
              </div>
            </div>
          </Panel>
          <LogWindow lines={LOG_LINES} title="guide-drive — replay &amp; episode rules" from={B4_S + 14} every={26} opacity={1} win={WIN_LOG} fontSize={21} />
          <CheckBadge x={1156} y={130} size={40} opacity={1} scale={Math.min(1, checkPop)} />
        </div>
      </div>
    </PaletteProvider>
  );
};
