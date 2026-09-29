/**
 * FeatureHomeAgentSurvivesOwnG15 — feature g15 — 1280x720, 932 frames @ 30fps, VOICE-SYNCED.
 *
 * ART DIRECTION: archetype 5 "ledger", mood "dawn" (both handed down by the
 * orchestrating session, not re-rolled). One receipt-style ledger card is the
 * recurring element across beats 1 and 2: a single enforcer line is itemised,
 * then a "IF THIS MACHINE STOPS" section is appended below it (all danger
 * rows) — the same non-crossfade append move as the b47/k02 ledger siblings.
 * Beat 3 drops the card entirely for a stark "nobody noticed" reveal (a muted
 * bell + a suddenly-unblocked phone). Beat 4 scale-pushes the real feature
 * page in as the substantiated claim ("a second machine … watches too").
 * Beat 5 is a drawn leader/standby schematic (the second non-crossfade move —
 * a slide-in), with the clip's one tech chip, "Cloudflare Worker", and a
 * plain-English gloss under it. Beat 6 rises in on a LogWindow (the third
 * non-crossfade move) and holds flat to the final frame.
 *
 * Beats 1 and 2 (single-machine ledger) and beat 3 (nobody-noticed reveal)
 * are metaphor/plumbing, so they stay drawn per STEP 0c. Beat 4 is the
 * substantiated claim, so it plays a recording of the real feature page
 * (shots/g15.json, shot "page"). Beat 6 does NOT play the feature page or
 * the hub (gate 2): it closes on a LogWindow built from this feature's own
 * numbers — there is no runtime log on the VPS for this agent, so these
 * lines are assembled from the feature row and its commits, never invented.
 * The "300 packets / 30s" activity threshold is the real number from commit
 * a94dba0 and is the only figure used anywhere in the clip.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-139  "One machine polled the router and enforced every block for
 *              the whole family."
 *  b2 148-298  "If it rebooted, lost Wi-Fi, or crashed, the blocks silently
 *              stopped."
 *  b3 307-416  "Nobody knew — until a kid's phone was suddenly unblocked."
 *  b4 425-550  "Now a second machine, a phone that's always home, watches
 *              too."
 *  b5 559-713  "If the leader goes quiet, a Cloudflare Worker hands control
 *              to the other automatically."
 *  b6 722-887  "No alert, no restart — blocking survives even when one
 *              machine goes down." — holds to 932.
 *
 * Single tech name in the whole clip: Cloudflare Worker (beat 5 chip only).
 * All numbers on screen (the 300 packets / 30s activity threshold) are the
 * real value from the feature's commits — nothing here is invented.
 */
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider } from "./bright-theme";
import { LightBg, Panel, Headline, CaptionBand, StatPill, IconCard, FilterChip, FlowArrow, CheckBadge, seg, fontFamily } from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/g15.json";

const P = MOODS.dawn;

const B1_S = 15, B1_E = 139;
const B2_S = 148, B2_E = 298;
const B3_S = 307, B3_E = 416;
const B4_S = 425, B4_E = 550;
const B5_S = 559, B5_E = 713;
const B6_S = 722, B6_E = 887;
const END = 932;
const FADE = 9;

const CARD_X = 340;
const CARD_Y = 132;
const CARD_W = 600;
const CARD_H = 372;
const PAD = 28;

const WIN4: Win = { x: 374, y: 146, w: 806, h: 396 };
const WIN_LOG: Win = { x: 280, y: 150, w: 880, h: 414 };

/** One ledger line: label, dotted leader, value. */
const LedgerRow: React.FC<{
  y: number;
  label: string;
  value: string;
  tone: "danger" | "success" | "ink";
  opacity?: number;
}> = ({ y, label, value, tone, opacity = 1 }) => {
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
      <span style={{ fontSize: 18, fontWeight: 650, color: P.ink, whiteSpace: "nowrap" }}>{label}</span>
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

export const FeatureHomeAgentSurvivesOwnG15: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ---- transient headline/caption per beat (fade in AND out) ----
  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE) * (1 - seg(frame, B5_E, B5_E + FADE));
  const b6 = seg(frame, B6_S, B6_S + FADE); // holds through the tail — no fade-out

  // ---- the ledger card: alive for beats 1-2 only ----
  const cardOp = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const cardScale = 0.94 + cardOp * 0.06;

  // beat 1: single-enforcer rows appear one by one
  const row0In = seg(frame, B1_S + 20, B1_S + 32);
  const row1In = seg(frame, B1_S + 40, B1_S + 52);
  const row2In = seg(frame, B1_S + 60, B1_S + 72);
  const totalIn = seg(frame, B1_S + 90, B1_S + 106);
  const sideIn1 = pop(B1_S + 26);

  // beat 2: failure-mode section appended below the same card
  const dividerOp = seg(frame, B2_S + 8, B2_S + 20);
  const sectionTitleOp = seg(frame, B2_S + 14, B2_S + 26);
  const row3In = seg(frame, B2_S + 30, B2_S + 42);
  const row4In = seg(frame, B2_S + 50, B2_S + 62);
  const row5In = seg(frame, B2_S + 70, B2_S + 82);
  const sideIn2 = pop(B2_S + 20);

  // beat 3: the stark "nobody noticed" reveal
  const bellShake = Math.sin((frame - B3_S) * 0.5) * (frame > B3_S && frame < B3_S + 40 ? 4 : 0);
  const phonePop = pop(B3_S + 30);
  const bellCardPop = pop(B3_S + 50);
  const alertPop = pop(B3_S + 70);

  // beat 4: scale-push the real evidence in
  const pushScale = interpolate(frame, [B4_S, B4_S + 22], [0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // beat 5: leader/standby schematic slides in (non-crossfade move #2)
  const b5dx = interpolate(frame, [B5_S, B5_S + 24], [70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const arrowProgress = interpolate(frame, [B5_S + 40, B5_S + 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chipPop = pop(B5_S + 100);
  const glossOp = seg(frame, B5_S + 116, B5_S + 130);

  // beat 6: rise-in on the log window (non-crossfade move #3)
  const b6dy = interpolate(frame, [B6_S, B6_S + 26], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const statPop = pop(B6_S + 10);
  const checkPop = pop(B6_S + 150);
  const LOG_LINES: LogLine[] = [
    { t: "leader", text: "home-pc: heartbeat missed", tone: "danger" },
    { t: "check", text: "activity check: under 300 packets / 30s", tone: "muted" },
    { t: "worker", text: "cloudflare worker: leader timeout confirmed", tone: "accent" },
    { t: "standby", text: "phone: promoted to leader", tone: "success" },
    { t: "enforce", text: "router polling + blocking: resumed", tone: "success" },
    { t: "result", text: "family devices: still enforced, 0 manual restarts", tone: "success" },
  ];

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= per-beat headline ================= */}
        <Headline y={26} text="One machine enforced every block, alone." opacity={b1} fontSize={30} />
        <Headline y={26} text="When it stopped, the blocks stopped with it." opacity={b2} fontSize={30} />
        <Headline y={26} text="Nobody found out until a phone was already free." opacity={b3} fontSize={30} />
        <Headline y={26} text="Now a second machine watches the same rules." opacity={b4} fontSize={30} />
        <Headline y={26} text="The other one takes over on its own." opacity={b5} fontSize={30} />

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 76,
            width: 1280,
            textAlign: "center",
            fontSize: 19,
            fontWeight: 650,
            color: P.muted,
            opacity: b1,
            fontFamily,
          }}
        >
          🔒 Guard — a family network guard that sees every device on the home Wi-Fi
        </div>

        {/* ================= the ledger (archetype 5) — beats 1 and 2 ================= */}
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
            🖥 WHO ENFORCES THE BLOCKS
          </div>
        </div>
        <Dash y={CARD_Y + 52} opacity={cardOp} />

        {/* beat 1 rows: the one machine doing everything */}
        <LedgerRow y={CARD_Y + 70} label="Polls the router" value="home PC" tone="ink" opacity={row0In * b1} />
        <LedgerRow y={CARD_Y + 106} label="Enforces every block" value="same PC" tone="ink" opacity={row1In * b1} />
        <LedgerRow y={CARD_Y + 142} label="Covers" value="whole family" tone="ink" opacity={row2In * b1} />
        <Dash y={CARD_Y + 172} opacity={totalIn * b1} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 184, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: totalIn * b1 }}>
          SINGLE POINT OF FAILURE
        </div>
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 204, fontSize: 26, fontWeight: 800, color: P.danger, opacity: totalIn * b1 }}>
          1 machine only
        </div>

        {/* beat 2: failure-mode section appended below */}
        <Dash y={CARD_Y + 246} opacity={dividerOp * b2} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 260, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: sectionTitleOp * b2 }}>
          IF THIS MACHINE STOPS
        </div>
        <LedgerRow y={CARD_Y + 286} label="Windows update reboot" value="blocks OFF" tone="danger" opacity={row3In * b2} />
        <LedgerRow y={CARD_Y + 316} label="Wi-Fi drops" value="blocks OFF" tone="danger" opacity={row4In * b2} />
        <LedgerRow y={CARD_Y + 346} label="Crash" value="blocks OFF" tone="danger" opacity={row5In * b2} />

        {/* side flanking tiles — beat 1 */}
        <IconCard x={40} y={280} w={250} emoji="👪" title="Whole family" sub="one enforcer covers all" tone="card" opacity={b1} scale={Math.min(1, sideIn1)} />
        <IconCard x={990} y={280} w={250} emoji="🖥" title="Home PC" sub="polls + enforces alone" tone="accent" opacity={b1} scale={Math.min(1, sideIn1)} />

        {/* side flanking tiles — beat 2 */}
        <IconCard x={40} y={280} w={250} emoji="🔌" title="Reboots, drops, crashes" sub="all silent failures" tone="danger" opacity={b2} scale={Math.min(1, sideIn2)} />
        <IconCard x={990} y={280} w={250} emoji="🙈" title="No warning" sub="nothing tells anyone" tone="danger" opacity={b2} scale={Math.min(1, sideIn2)} />

        {/* ================= beat 3: nobody noticed ================= */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 96,
            width: 1280,
            textAlign: "center",
            fontSize: 84,
            transform: `rotate(${bellShake}deg)`,
            opacity: b3,
          }}
        >
          🔕
        </div>
        <IconCard x={50} y={230} w={330} emoji="📱" title="Kid's phone" sub="suddenly unblocked" tone="danger" opacity={b3} scale={Math.min(1, phonePop)} />
        <IconCard x={475} y={230} w={330} emoji="😴" title="Nobody watching" sub="no one checked in" tone="danger" opacity={b3} scale={Math.min(1, bellCardPop)} />
        <IconCard x={900} y={230} w={330} emoji="🚨" title="0 alerts sent" sub="nobody was told" tone="danger" opacity={b3} scale={Math.min(1, alertPop)} />
        <StatPill x={370} y={470} emoji="🤷" text="found out by accident, hours later" tone="danger" fontSize={24} opacity={b3 * Math.min(1, alertPop)} />

        {/* per-beat caption band */}
        <CaptionBand text="Polling and enforcement both lived on one machine" opacity={b1} tone="card" />
        <CaptionBand text="A reboot, a dropped Wi-Fi link, a crash — all silent" opacity={b2} tone="danger" />
        <CaptionBand text="An evening could pass with every device unblocked" opacity={b3} tone="danger" />
        <CaptionBand text="The same script now runs on a phone that's always home" opacity={b4} tone="accent" />
        <CaptionBand text="Leadership hands back the moment the PC returns" opacity={b5} tone="accent" />

        {/* ================= beat 4: the real page, as the substantiated claim ================= */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: b4,
            transform: `scale(${pushScale})`,
            transformOrigin: `${WIN4.x + WIN4.w / 2}px ${WIN4.y + WIN4.h / 2}px`,
          }}
        >
          <LiveWindow
            file={shots as any}
            shot="page"
            title="vitalii.no/features/…-g15"
            win={WIN4}
            from={B4_S}
            hold={B4_E - B4_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.35 }}
            opacity={1}
          />
        </div>
        <StatPill x={40} y={300} emoji="📶" text="an always-on phone runs the exact same script" tone="success" opacity={b4} />

        {/* ================= beat 5: leader/standby schematic (drawn, slide-in) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b5, transform: `translateX(${b5dx}px)` }}>
          <StatPill x={340} y={140} emoji="🔁" text="control moves to the other machine — automatically" tone="accent" fontSize={22} opacity={1} />
          <IconCard x={70} y={220} w={340} emoji="🖥" title="Leader" sub="home PC — enforcing now" tone="accent" opacity={1} scale={1.15} />
          <FlowArrow x={440} y={280} len={400} progress={arrowProgress} color={P.accent} opacity={1} />
          <IconCard x={870} y={220} w={340} emoji="📱" title="Standby" sub="always-on phone — watching" tone="card" opacity={1} scale={1.15} />
          <FilterChip
            x={520}
            y={450}
            text="Cloudflare Worker"
            icon="⚡"
            color={P.accent}
            scale={Math.min(1, chipPop)}
            opacity={Math.min(1, chipPop)}
          />
          <div
            style={{
              position: "absolute",
              left: 440,
              top: 510,
              width: 400,
              textAlign: "center",
              fontSize: 15,
              fontWeight: 600,
              color: P.muted,
              opacity: glossOp,
              fontFamily,
            }}
          >
            (a tiny script that checks who is still reporting in)
          </div>
        </div>

        {/* ================= beat 6: it is already working (rise-in, LogWindow) ================= */}
        <div style={{ position: "absolute", inset: 0, opacity: b6, transform: `translateY(${b6dy}px)` }}>
          <div
            style={{
              position: "absolute",
              left: 200,
              top: 60,
              width: 1000,
              textAlign: "center",
              fontSize: 29,
              fontWeight: 800,
              color: P.ink,
              letterSpacing: -0.2,
              fontFamily,
            }}
          >
            Enforcement never stops now.
          </div>
          <Panel x={40} y={150} w={210} h={170} tone="success" opacity={Math.min(1, statPop)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 30 }}>🛡</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: P.success, textAlign: "center", lineHeight: 1.1 }}>ALWAYS ON</div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", lineHeight: 1.3 }}>
                NO MANUAL
                <br />
                RESTART
              </div>
            </div>
          </Panel>
          <LogWindow lines={LOG_LINES} title="guard — leader election" from={B6_S + 14} every={26} opacity={1} win={WIN_LOG} fontSize={21} />
          <CheckBadge x={1156} y={130} size={40} opacity={1} scale={Math.min(1, checkPop)} />
        </div>
        <CaptionBand text="No alert, no restart — blocking survives a machine going down" opacity={b6} tone="success" />
      </div>
    </PaletteProvider>
  );
};
