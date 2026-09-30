/**
 * FeatureHomeAgentSurvivesOwnG15 — feature g15 — 1280x720, 932 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (2026-09-30): same narration, new picture. Archetype 5 "ledger",
 * mood "sand" (both handed down). The whole clip is one thermal-paper
 * enforcement receipt: rows print in black/green when things work, in red
 * when they don't, and the payoff literally follows the archetype's own
 * definition — "the same ledger rewritten in green with the total struck
 * through" — as the closing image of beat 6.
 *
 * b1 15-139: product plate (Guard — Family Network Guard) + the receipt
 *   prints its first two lines (router polling / block rules, both green)
 *   + a 4-up row of the actual devices the product watches (Android TV
 *   stick, PlayStation, laptop, phone) — the literal "whole family".
 * b2 148-298: the SAME receipt (non-crossfade append, no crossfade — it
 *   just grows downward) prints a second section in red ink: reboot / wifi
 *   drop / crash, each one zeroing enforcement, ending on a red total
 *   "ENFORCEMENT: 0%".
 * b3 307-416: the receipt tears off and falls away (rotate + translateY,
 *   not a crossfade) — replaced by the stark "nobody was watching" reveal:
 *   a muted bell, a kid's phone, an empty inbox of alerts.
 * b4 425-550: scale-push transition into a recording of the real feature
 *   page (shots/g15.json, shot "page") — the substantiated claim, "a second
 *   machine watches too" — with a small torn-off receipt stub confirming a
 *   new line was just added to the ledger.
 * b5 559-713: non-crossfade slide-in into a drawn leader/standby schematic,
 *   the clip's one tech caption ("Cloudflare Worker") with a plain gloss.
 * b6 722-932 (holds to end, no fade-out): rise-in on the archetype's payoff —
 *   the ledger rewritten in green, its old red total struck through — next
 *   to a LogWindow built only from this feature's own real numbers (no
 *   runtime log exists for this product). Never plays the feature page or
 *   the hub (gate 2).
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
 * The only number anywhere is the real "300 packets / 30s" activity
 * threshold from commit a94dba0 (beat 6 log) — nothing here is invented.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MOODS, PaletteProvider, cardShadow } from "./bright-theme";
import {
  LightBg,
  Headline,
  Panel,
  CaptionBand,
  StatPill,
  IconCard,
  FilterChip,
  FlowArrow,
  CheckBadge,
  seg,
  fontFamily,
} from "./bright-primitives";
import { LiveWindow, LogWindow, LogLine, Win } from "./live-primitives";
import shots from "./shots/g15.json";

const P = MOODS.sand;

const B1_S = 15, B1_E = 139;
const B2_S = 148, B2_E = 298;
const B3_S = 307, B3_E = 416;
const B4_S = 425, B4_E = 550;
const B5_S = 559, B5_E = 713;
const B6_S = 722, B6_E = 887;
const END = 932;
const FADE = 9;

const RECEIPT_X = 380;
const RECEIPT_Y = 104;
const RECEIPT_W = 520;
const H1 = 178;
const H2 = 430;

const WIN4: Win = { x: 374, y: 146, w: 806, h: 396 };
const WIN_LOG: Win = { x: 660, y: 150, w: 540, h: 420 };

const MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';

const pop = (frame: number, start: number, fps: number, damping = 11) =>
  spring({ frame: Math.max(0, frame - start), fps, from: 0, to: 1, config: { damping } });

/** One printed line on the receipt: label, dotted leader, value. */
const ReceiptRow: React.FC<{
  y: number;
  label: string;
  value: string;
  tone?: "ink" | "danger" | "success";
  opacity: number;
  strike?: boolean;
  bold?: boolean;
}> = ({ y, label, value, tone = "ink", opacity, strike, bold }) => {
  if (opacity <= 0.004) return null;
  const color = tone === "danger" ? P.danger : tone === "success" ? P.success : P.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: 26,
        top: y,
        width: RECEIPT_W - 52,
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        opacity,
        fontFamily: MONO,
        fontSize: 18.5,
      }}
    >
      <span style={{ color: P.ink, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ flex: 1, borderBottom: `2px dotted ${P.border}`, transform: "translateY(-5px)" }} />
      <span
        style={{
          color,
          fontWeight: bold ? 800 : 700,
          whiteSpace: "nowrap",
          textDecoration: strike ? "line-through" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
};

/** The receipt tape itself: white card with a torn-paper strip top + bottom. */
const ReceiptCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  rotate?: number;
  dy?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, opacity, rotate = 0, dy = 0, children }) => {
  if (opacity <= 0.004) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity,
        transform: `translateY(${dy}px) rotate(${rotate}deg)`,
        transformOrigin: "50% 0%",
        fontFamily,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: P.card, border: `1.5px solid ${P.border}`, borderRadius: 6, boxShadow: cardShadow }} />
      <div style={{ position: "absolute", left: 10, right: 10, top: 0, height: 5, backgroundImage: `repeating-linear-gradient(90deg, ${P.border} 0 6px, transparent 6px 13px)` }} />
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 0, height: 5, backgroundImage: `repeating-linear-gradient(90deg, ${P.border} 0 6px, transparent 6px 13px)` }} />
      {children}
    </div>
  );
};

const LOG_LINES: LogLine[] = [
  { t: "leader", text: "home-pc: heartbeat missed", tone: "danger" },
  { t: "check", text: "activity check: under 300 packets / 30s", tone: "muted" },
  { t: "worker", text: "cloudflare worker: leader timeout confirmed", tone: "accent" },
  { t: "standby", text: "phone: promoted to leader", tone: "success" },
  { t: "enforce", text: "router polling + blocking: resumed", tone: "success" },
  { t: "result", text: "family devices: still enforced, 0 manual restarts", tone: "success" },
];

export const FeatureHomeAgentSurvivesOwnG15: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2only = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE) * (1 - seg(frame, B4_E, B4_E + FADE));
  const b5 = seg(frame, B5_S, B5_S + FADE) * (1 - seg(frame, B5_E, B5_E + FADE));
  const b6 = seg(frame, B6_S, B6_S + FADE);

  // The receipt: alive across beats 1+2, tears off at the end of beat 2.
  const cardIn = seg(frame, B1_S, B1_S + FADE);
  const cardOut = seg(frame, B2_E, B2_E + FADE);
  const cardOp = cardIn * (1 - cardOut);
  const growT = interpolate(frame, [B2_S, B2_S + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardH = H1 + (H2 - H1) * growT;
  const cardRot = cardOut * -7;
  const cardDy = cardOut * 60;

  const row1 = seg(frame, B1_S + 6, B1_S + 16) * cardIn;
  const row2 = seg(frame, B1_S + 24, B1_S + 34) * cardIn;

  const sec = seg(frame, B2_S + 8, B2_S + 18) * cardOp;
  const rowReboot = seg(frame, B2_S + 24, B2_S + 34) * cardOp;
  const rowWifi = seg(frame, B2_S + 42, B2_S + 52) * cardOp;
  const rowCrash = seg(frame, B2_S + 60, B2_S + 70) * cardOp;
  const rowTotal = seg(frame, B2_S + 82, B2_S + 92) * cardOp;

  // Beat 4: scale-push entrance for the live feature page.
  const pushT = seg(frame, B4_S, B4_S + 16);
  const pushScale = 0.86 + 0.14 * pushT;

  // Beat 5: slide-in schematic.
  const slideT = seg(frame, B5_S, B5_S + 16);
  const slideX = (1 - slideT) * 90;

  // Beat 6: rise-in.
  const riseT = seg(frame, B6_S, B6_S + 16);
  const riseDy = (1 - riseT) * 40;

  const bellShake = Math.sin(frame / 3) * (1 - seg(frame, B3_S + 40, B3_S + 70)) * 6;

  return (
    <PaletteProvider value={P}>
      <LightBg />

      {/* ───────── beat 1: product plate + receipt opens + the family's devices ───────── */}
      <Panel x={260} y={16} w={760} h={94} tone="card" opacity={b1}>
        <div style={{ position: "absolute", left: 24, top: 14, display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ fontSize: 34 }}>🛡</div>
          <div>
            <div style={{ fontSize: 23, fontWeight: 800, color: P.ink }}>
              Guard <span style={{ color: P.accent, fontWeight: 700 }}>— Family Network Guard</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: P.muted, marginTop: 5, maxWidth: 690, lineHeight: 1.35 }}>
              A private family-network guard that sees every device on the home Wi-Fi, the Android
              TV stick, and the PlayStation, and lets a parent name, time-limit, and block each one.
            </div>
          </div>
        </div>
      </Panel>
      <StatPill x={22} y={34} emoji="🔁" text="24/7" tone="accent" opacity={b1} fontSize={15} scale={0.85} />
      <StatPill x={1078} y={34} emoji="🖥" text="1 machine" tone="accent" opacity={b1} fontSize={15} scale={0.85} />

      <IconCard x={40} y={160} w={150} emoji="👪" title="Whole family" tone="accent" opacity={b1} scale={pop(frame, B1_S + 10, fps)} />
      <IconCard x={1090} y={160} w={150} emoji="🖥" title="One machine" tone="accent" opacity={b1} scale={pop(frame, B1_S + 18, fps)} />

      {[
        { x: 85, e: "📺", t: "TV stick" },
        { x: 405, e: "🎮", t: "PlayStation" },
        { x: 725, e: "💻", t: "Laptop" },
        { x: 1045, e: "📱", t: "Phone" },
      ].map((d, i) => (
        <IconCard key={d.t} x={d.x} y={368} w={150} emoji={d.e} title={d.t} tone="card" opacity={b1} scale={pop(frame, B1_S + 30 + i * 8, fps)} />
      ))}
      <StatPill x={58} y={508} emoji="⏱" text="since boot" tone="card" opacity={b1} fontSize={14.5} scale={0.85} />
      <StatPill x={1000} y={508} emoji="📶" text="wifi ok" tone="success" opacity={b1} fontSize={14.5} scale={0.85} />

      <CaptionBand text="One machine enforces every block for the whole family" opacity={b1} tone="accent" />

      {/* ───────── beats 1+2: the receipt tape (one physical object, grows down) ───────── */}
      <ReceiptCard x={RECEIPT_X} y={RECEIPT_Y} w={RECEIPT_W} h={cardH} opacity={cardOp} rotate={cardRot} dy={cardDy}>
        <div style={{ position: "absolute", left: 26, top: 14, fontSize: 19, fontWeight: 800, color: P.ink, display: "flex", alignItems: "center", gap: 8 }}>
          🧾 ENFORCEMENT LEDGER
        </div>
        <div style={{ position: "absolute", left: 26, top: 42, fontSize: 13, fontWeight: 600, color: P.muted }}>home-pc · router polling</div>
        <ReceiptRow y={76} label="router polling" value="ON" tone="success" opacity={row1} />
        <ReceiptRow y={104} label="block rules · all devices" value="ON" tone="success" opacity={row2} />

        <div style={{ position: "absolute", left: 26, top: 152, width: RECEIPT_W - 52, height: 0, borderTop: `2px dashed ${P.border}`, opacity: sec }} />
        <div style={{ position: "absolute", left: 26, top: 166, fontSize: 15.5, fontWeight: 800, color: P.danger, opacity: sec, letterSpacing: 0.3 }}>
          IF THIS MACHINE STOPS:
        </div>
        <ReceiptRow y={198} label="reboot" value="blocking OFF" tone="danger" opacity={rowReboot} />
        <ReceiptRow y={230} label="wifi drop" value="blocking OFF" tone="danger" opacity={rowWifi} />
        <ReceiptRow y={262} label="crash" value="blocking OFF" tone="danger" opacity={rowCrash} />
        <div style={{ position: "absolute", left: 26, top: 300, width: RECEIPT_W - 52, height: 0, borderTop: `1.5px solid ${P.border}`, opacity: rowTotal }} />
        <ReceiptRow y={312} label="ENFORCEMENT" value="0%" tone="danger" opacity={rowTotal} bold />
      </ReceiptCard>

      <IconCard x={40} y={480} w={150} emoji="🔌" title="Reboots, drops, crashes" tone="danger" opacity={b2only} scale={pop(frame, B2_S + 10, fps)} />
      <IconCard x={1090} y={480} w={150} emoji="🔕" title="No warning" tone="danger" opacity={b2only} scale={pop(frame, B2_S + 18, fps)} />
      <StatPill x={22} y={34} emoji="🔌" text="outage" tone="danger" opacity={b2only} fontSize={15} scale={0.85} />
      <StatPill x={1090} y={34} emoji="🔕" text="silent" tone="danger" opacity={b2only} fontSize={15} scale={0.85} />
      <CaptionBand text="Every outage silently cancels every rule" opacity={b2only} tone="danger" />

      {/* ───────── beat 3: nobody was watching ───────── */}
      <div style={{ position: "absolute", left: 565, top: 96, opacity: b3, transform: `rotate(${bellShake}deg)`, transformOrigin: "50% 0%" }}>
        <IconCard x={0} y={0} w={150} emoji="🔕" title="Silent outage" tone="danger" opacity={1} />
      </div>
      {[
        { x: 120, e: "📱", t: "Kid's phone", s: "suddenly unblocked" },
        { x: 565, e: "🙈", t: "Nobody watching", s: "no dashboard, no check" },
        { x: 1010, e: "📭", t: "0 alerts sent", s: "no message, no call" },
      ].map((d, i) => (
        <IconCard key={d.t} x={d.x} y={320} w={150} emoji={d.e} title={d.t} sub={d.s} tone="danger" opacity={b3} scale={pop(frame, B3_S + 16 + i * 10, fps)} />
      ))}
      <StatPill x={430} y={540} emoji="🤷" text="found out by accident, hours later" tone="danger" opacity={b3} />
      <StatPill x={24} y={34} emoji="🚨" text="no alert" tone="danger" opacity={b3} fontSize={15} scale={0.85} />
      <StatPill x={1050} y={34} emoji="🚨" text="no restart" tone="danger" opacity={b3} fontSize={15} scale={0.85} />
      <CaptionBand text="Nobody knew — until a kid's phone was suddenly unblocked" opacity={b3} tone="danger" />

      {/* ───────── beat 4: the real feature page — a second machine watches too ───────── */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity: b4, transform: `scale(${pushScale})`, transformOrigin: "50% 45%" }}>
        <LiveWindow
          file={shots as any}
          shot="page"
          title="vitalii.no/features/the-home-agent-now-survives-its-own-pc-going-offline-g15"
          win={WIN4}
          from={B4_S}
          hold={B4_E - B4_S}
          zoom={(t) => 1 + 0.08 * t}
          focus={{ x: 0.5, y: 0.35 }}
          opacity={1}
        />
      </div>
      <IconCard x={40} y={300} w={150} emoji="📱" title="Always-on standby" tone="success" opacity={b4} scale={pop(frame, B4_S + 12, fps)} />
      <div style={{ position: "absolute", left: 1080, top: 130, opacity: b4 * seg(frame, B4_S + 10, B4_S + 24) }}>
        <div style={{ width: 150, padding: "10px 12px", background: P.card, border: `1.5px dashed ${P.successEdge}`, borderRadius: 6, fontFamily: MONO, fontSize: 13, color: P.success, fontWeight: 700, boxShadow: cardShadow }}>
          🧾 +1 line
          <div style={{ fontSize: 12, fontWeight: 600, color: P.muted, marginTop: 2 }}>phone: standby added</div>
        </div>
      </div>
      <CaptionBand text="A phone that's always on the network starts polling too" opacity={b4} tone="success" />

      {/* ───────── beat 5: leader / standby schematic ───────── */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity: b5, transform: `translateX(${slideX}px)` }}>
        <IconCard x={220} y={150} w={200} emoji="🖥" title="Leader" sub="home-pc, normally" tone="accent" opacity={1} scale={pop(frame, B5_S + 8, fps)} />
        <IconCard x={860} y={150} w={200} emoji="📱" title="Standby" sub="always-home phone" tone="accent" opacity={1} scale={pop(frame, B5_S + 16, fps)} />
        <FlowArrow x={470} y={200} len={340} progress={seg(frame, B5_S + 24, B5_S + 50)} color={P.accent} opacity={1} />
        <FilterChip x={498} y={360} text="Cloudflare Worker" icon="⚙" opacity={seg(frame, B5_S + 40, B5_S + 54)} scale={pop(frame, B5_S + 40, fps)} />
        <div style={{ position: "absolute", left: 398, top: 414, width: 480, textAlign: "center", fontSize: 15, fontWeight: 600, color: P.muted, opacity: seg(frame, B5_S + 50, B5_S + 64) }}>
          (a tiny script that checks who is still reporting in)
        </div>
        <div style={{ position: "absolute", left: 560, top: 470, opacity: seg(frame, B5_S + 60, B5_S + 74) }}>
          <div style={{ width: 160, padding: "8px 12px", background: P.card, border: `1.5px dashed ${P.border}`, borderRadius: 6, fontFamily: MONO, fontSize: 13, color: P.ink, fontWeight: 700, textAlign: "center", boxShadow: cardShadow }}>
            🧾 ledger continues
          </div>
        </div>
      </div>
      <CaptionBand text="If the leader goes quiet, the worker hands control to the other" opacity={b5} tone="accent" />

      {/* ───────── beat 6: archetype payoff — the ledger rewritten in green ───────── */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, opacity: b6, transform: `translateY(${riseDy}px)` }}>
        <Headline y={32} text="Enforcement never stops now." opacity={1} fontSize={30} />
        <ReceiptCard x={80} y={128} w={480} h={430} opacity={1}>
          <div style={{ position: "absolute", left: 26, top: 14, fontSize: 18, fontWeight: 800, color: P.success, display: "flex", alignItems: "center", gap: 8 }}>
            🧾 ENFORCEMENT LEDGER — rewritten
          </div>
          <div style={{ position: "absolute", left: 26, top: 42, fontSize: 13, fontWeight: 600, color: P.muted }}>home-pc + phone · shared</div>
          <ReceiptRow y={78} label="reboot" value="still enforced ✓" tone="success" opacity={seg(frame, B6_S + 8, B6_S + 18)} />
          <ReceiptRow y={108} label="wifi drop" value="still enforced ✓" tone="success" opacity={seg(frame, B6_S + 18, B6_S + 28)} />
          <ReceiptRow y={138} label="crash" value="still enforced ✓" tone="success" opacity={seg(frame, B6_S + 28, B6_S + 38)} />
          <div style={{ position: "absolute", left: 26, top: 178, width: 480 - 52, height: 0, borderTop: `1.5px solid ${P.border}` }} />
          <ReceiptRow y={196} label="old total" value="0%" tone="danger" opacity={seg(frame, B6_S + 38, B6_S + 48)} strike />
          <ReceiptRow y={228} label="ENFORCEMENT" value="100% · ALWAYS" tone="success" opacity={seg(frame, B6_S + 48, B6_S + 60)} bold />
          <CheckBadge x={400} y={340} scale={pop(frame, B6_S + 55, fps)} opacity={1} />
        </ReceiptCard>
        <LogWindow lines={LOG_LINES} title="watchdog log" win={WIN_LOG} from={B6_S + 14} every={16} opacity={1} fontSize={18.5} />
        <CaptionBand text="No alert, no restart — blocking survives a machine going down" opacity={1} tone="success" />
      </div>
    </PaletteProvider>
  );
};
