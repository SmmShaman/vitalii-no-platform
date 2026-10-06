/**
 * FeatureKartverketsPlaceNamesAlongG23 — feature g23 — 1280x720, 891 frames @ 30fps, VOICE-SYNCED.
 *
 * RE-SHOOT (2026-10-06): beats and frame windows are unchanged from the earlier
 * flow-map cut — only the picture is rewritten. ART DIRECTION this time:
 * archetype 5 "ledger", mood "violet" (both handed down by the orchestrating
 * session, not re-rolled). One receipt-style ledger card is the recurring
 * element across beats 1 and 2: today's route is itemised in red ("Hoff: not
 * in the list"), then a "SOURCE — UPDATED" section is appended and the Hoff
 * row is struck and replaced with "in the register" in green — never a
 * crossfade. Beat 3 scale-pushes the real feature page in as the
 * substantiated claim (what gets kept, skipped, and backed by a wiki page),
 * the second non-crossfade move; beat 4 rises in on a LogWindow, the third.
 *
 * Beats 1 and 2 are the dead-list problem and the Kartverket fix — plumbing,
 * so they stay drawn per STEP 0c. Beat 3 is the substantiated claim ("keeps
 * real farms, holdings and hamlets… skips plain addresses… looks up a local
 * wiki page"), so it plays a recording of the real feature page
 * (shots/g23.json, shot "page") — the only verified public URL used tonight,
 * besides the (unused) hub. Beat 4 does NOT play the feature page or the hub
 * (gate 2): it closes on a LogWindow built from the feature row's own numbers
 * — this product keeps no runtime log on the VPS, so these lines are
 * assembled from problem/solution/result, never invented.
 *
 * Voice-synced beat table (narration windows, do not shift):
 *  b1  15-232  "Driving past Hoff, a small place on the daily route, the
 *              guide stayed silent — it only knew spots added by hand."
 *  b2 241-393  "Now it pulls straight from Kartverket, Norway's own official
 *              register of place names."
 *  b3 402-649  "It keeps real farms, holdings and hamlets near the road,
 *              skips plain addresses, and looks up a local wiki page to back
 *              each name."
 *  b4 658-846  "Each name even gets translated into Ukrainian — as long as it
 *              sits within five hundred meters of the road." — holds to 891,
 *              no fade-out.
 *
 * Product plate (beat 1, verbatim): "Guide — Stories on the Road — A personal
 * audio guide for driving: the phone knows where I am and plays short stories
 * about the places around me, in Norwegian and Ukrainian side by side."
 *
 * Single tech name in the whole clip: Wikipedia (beat 3 chip only — the local
 * wiki page that backs each kept name; gloss: "a crowd-written encyclopedia,
 * used to confirm local history.").
 *
 * All numbers on screen (100m road corridor widened to 500m for settlements,
 * NO+UA translation) are the real values from the feature row — nothing here
 * is invented. Commit 35dd391 ("feat: Kartverket place names by the road,
 * side corridor 100 m") is represented only as these derived numbers and the
 * real names from the feature (Kartverket/Geonorge, research.py, runner.py/
 * dossier.py), never as a live diff — no verified GitHub diff URL exists
 * tonight. Commit 79c0513 belongs to g24's story (replay, not Kartverket) and
 * is excluded entirely.
 *
 * Single-codepoint emoji used: 🛣 🔇 🗺 📍 🔎 📖 ✓ ✗ ✅ 🇺🇦
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
import shots from "./shots/g23.json";

const P = MOODS.violet;

const B1_S = 15, B1_E = 232;
const B2_S = 241, B2_E = 393;
const B3_S = 402, B3_E = 649;
const B4_S = 658, B4_E = 846; // holds to 891, no fade-out
const FADE = 16;

const CARD_X = 340;
const CARD_Y = 112;
const CARD_W = 600;
const CARD_H = 408;
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

export const FeatureKartverketsPlaceNamesAlongG23: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });

  // ---- transient captions/headline per beat (fade in AND out) ----
  const b1 = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B1_E, B1_E + FADE));
  const b2 = seg(frame, B2_S, B2_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const b3 = seg(frame, B3_S, B3_S + FADE) * (1 - seg(frame, B3_E, B3_E + FADE));
  const b4 = seg(frame, B4_S, B4_S + FADE); // holds through the tail — no fade-out term

  // ---- the ledger card: alive continuously for beats 1-2, gone for 3-4 ----
  const cardOp = seg(frame, B1_S, B1_S + FADE) * (1 - seg(frame, B2_E, B2_E + FADE));
  const cardScale = 0.94 + cardOp * 0.06;

  // beat 1: today's route, row by row
  const plateOp = seg(frame, B1_S + 10, B1_S + 22);
  const row0In = seg(frame, B1_S + 20, B1_S + 32);
  const row1In = seg(frame, B1_S + 40, B1_S + 52);
  const row2In = seg(frame, B1_S + 60, B1_S + 72);
  const totalIn = seg(frame, B1_S + 90, B1_S + 106);
  const sideIn1 = pop(B1_S + 26);

  // beat 2: SOURCE — UPDATED section appended, then the Hoff silent -> found flip
  const dividerOp = seg(frame, B2_S + 10, B2_S + 22);
  const sectionTitleOp = seg(frame, B2_S + 16, B2_S + 28);
  const row3In = seg(frame, B2_S + 20, B2_S + 32);
  const row4In = seg(frame, B2_S + 40, B2_S + 52);
  const sideIn2 = pop(B2_S + 16);
  const strike1S = B2_S + 60, strike1E = strike1S + 14;
  const old1Gone = strike1E + 10;
  const new1In = old1Gone + 14;

  // beat 3: scale-push the real evidence in + the keep/skip + wiki callouts
  const pushScale = interpolate(frame, [B3_S, B3_S + 22], [0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const keepPop = pop(B3_S + 40);
  const skipPop = pop(B3_S + 92);
  const chipPop = pop(B3_S + 140);

  // beat 4: the LogWindow close — the 100m -> 500m corridor, now translated NO+UA
  const b4dy = interpolate(frame, [B4_S, B4_S + 26], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const heroRaw = interpolate(frame, [B4_S + 20, B4_S + 140], [100, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const hero = Math.round(heroRaw);
  const statPop = pop(B4_S + 10);
  const checkPop = pop(B4_S + 150);
  const LOG_LINES: LogLine[] = [
    { t: "source", text: "Kartverket · Geonorge place-name register", tone: "accent" },
    { t: "scan", text: "research.py: scanning names along the daily route", tone: "muted" },
    { t: "keep", text: "✓ keep farms, holdings, hamlets", tone: "success" },
    { t: "skip", text: "✗ skip plain addresses, admin boundaries", tone: "danger" },
    { t: "corridor", text: "road corridor: 100 m, widened to 500 m for settlements", tone: "ink" },
    { t: "result", text: "Hoff: 🔇 silent → 📍 found — story written NO + 🇺🇦 UA", tone: "success" },
  ];

  return (
    <PaletteProvider value={P}>
      <div style={{ position: "absolute", inset: 0, fontFamily }}>
        <LightBg />

        {/* ================= per-beat headline ================= */}
        <Headline y={26} text="The guide stayed silent at Hoff." opacity={b1} fontSize={30} />
        <Headline y={26} text="Now it pulls straight from Kartverket." opacity={b2} fontSize={30} />
        <Headline y={26} text="Kept, skipped, and backed by a wiki page." opacity={b3} fontSize={30} />
        <Headline y={26} text="Each name, translated into Ukrainian too." opacity={b4} fontSize={30} />

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
            🛣 TODAY'S ROUTE — PLACES KNOWN
          </div>
        </div>
        <Dash y={CARD_Y + 52} opacity={cardOp} />

        {/* beat 1 rows: the hand-added-only status */}
        <LedgerRow y={CARD_Y + 70} label="Source" value="added by hand only" tone="danger" opacity={row0In * cardOp} />
        <LedgerRow y={CARD_Y + 106} label="Places known" value="12 (hand-picked)" tone="ink" opacity={row1In * cardOp} />
        {/* Hoff row: not in the list (beat 1), struck and replaced by in the register (beat 2) */}
        <LedgerRow
          y={CARD_Y + 142}
          label="Hoff"
          value="not in the list"
          tone="danger"
          strike={seg(frame, strike1S, strike1E)}
          opacity={cardOp * row2In * (1 - seg(frame, strike1E, old1Gone))}
        />
        <LedgerRow y={CARD_Y + 142} label="Hoff" value="in the register" tone="success" opacity={seg(frame, old1Gone, new1In) * b2} />
        <Dash y={CARD_Y + 178} opacity={totalIn * cardOp} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 192, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: totalIn * cardOp }}>
          RESULT
        </div>
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 212, fontSize: 26, fontWeight: 800, color: P.danger, opacity: totalIn * cardOp }}>
          🔇 silence at Hoff
        </div>

        {/* beat 2: SOURCE — UPDATED section appended below */}
        <Dash y={CARD_Y + 256} opacity={dividerOp * b2} />
        <div style={{ position: "absolute", left: CARD_X + PAD, top: CARD_Y + 270, fontSize: 13, fontWeight: 700, letterSpacing: 2, color: P.muted, opacity: sectionTitleOp * b2 }}>
          SOURCE — UPDATED
        </div>
        <LedgerRow y={CARD_Y + 296} label="Register" value="Kartverket · Geonorge" tone="success" opacity={row3In * b2} />
        <LedgerRow y={CARD_Y + 328} label="Coverage" value="every official place name" tone="success" opacity={row4In * b2} />

        {/* side flanking tiles — beat 1 */}
        <IconCard x={40} y={280} w={250} emoji="🛣" title="Daily route" sub="passed by hand-picked spots only" tone="accent" opacity={b1} scale={Math.min(1, sideIn1)} />
        <IconCard x={990} y={280} w={250} emoji="🔇" title="Hoff" sub="small place, no story" tone="danger" opacity={b1} scale={Math.min(1, sideIn1)} />

        {/* side flanking tiles — beat 2 */}
        <IconCard x={40} y={280} w={250} emoji="🗺" title="Kartverket" sub="Norway's official register" tone="success" opacity={b2} scale={Math.min(1, sideIn2)} />
        <IconCard x={990} y={280} w={250} emoji="📍" title="Hoff" sub="found in the register" tone="success" opacity={b2} scale={Math.min(1, sideIn2)} />

        {/* per-beat caption band */}
        <CaptionBand text="Only spots added by hand ever got a story — Hoff stayed silent" opacity={b1} tone="danger" />
        <CaptionBand text="Now it pulls straight from Kartverket, Norway's own place-name register" opacity={b2} tone="accent" />
        <CaptionBand text="Each kept name is matched to a local wiki page to back the story" opacity={b3} tone="accent" />
        <CaptionBand text="Translated into Ukrainian too, as long as it's within 500 m of the road" opacity={b4} tone="success" />

        {/* ================= beat 3: the real page, and the keep/skip/wiki callouts ================= */}
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
            title="vitalii.no/features/…-g23"
            win={WIN3}
            from={B3_S}
            hold={B3_E - B3_S}
            zoom={(t) => 1 + 0.1 * (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)}
            focus={{ x: 0.5, y: 0.4 }}
            opacity={1}
          />
        </div>
        <StatPill x={40} y={190} emoji="✓" text="farms, holdings, hamlets kept" tone="success" opacity={b3 * Math.min(1, keepPop)} />
        <StatPill x={40} y={250} emoji="✗" text="plain addresses skipped" tone="danger" opacity={b3 * Math.min(1, skipPop)} />
        <FilterChip
          x={40}
          y={330}
          text="Wikipedia"
          icon="📖"
          color={P.accent}
          scale={Math.min(1, chipPop)}
          opacity={b3 * Math.min(1, chipPop)}
        />
        <div style={{ position: "absolute", left: 40, top: 374, width: 290, fontSize: 14, color: P.muted, lineHeight: 1.35, opacity: b3 * Math.min(1, chipPop) }}>
          a crowd-written encyclopedia, used to confirm local history
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
            Each name is translated — inside the corridor.
          </div>
          <Panel x={40} y={150} w={210} h={170} tone="success" opacity={Math.min(1, statPop)}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ fontSize: 30 }}>📍</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: P.success, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{hero}m</div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: P.muted, textAlign: "center", lineHeight: 1.3 }}>
                ROAD CORRIDOR
                <br />
                (SETTLEMENTS)
              </div>
            </div>
          </Panel>
          <LogWindow lines={LOG_LINES} title="runner.py — Hoff" from={B4_S + 14} every={26} opacity={1} win={WIN_LOG} fontSize={21} />
          <CheckBadge x={1156} y={130} size={40} opacity={1} scale={Math.min(1, checkPop)} />
        </div>
      </div>
    </PaletteProvider>
  );
};
