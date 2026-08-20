/**
 * FeatureLinkedinGuestScraper — feature j43 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: fragile login accounts and IP bans/CAPTCHAs choked reliable scraping →
 * reverse-engineered LinkedIn's undocumented Guest API
 * (voyagerJobsDashJobCards) → linkedin_scraper.py uses httpx + asyncio with
 * User-Agent rotation and randomized 0.5-2s delays, invoked as a Supabase
 * Edge Function → parsed jobs upsert into job_listings with
 * ON CONFLICT (job_id) DO UPDATE → 500-700 jobs/day, 99.8% uptime, zero bans.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const OLD = { x: 80, y: 44, w: 300, h: 90 };
const WALL = { x: 830, y: 44, w: 370, h: 90 };

const SCRAPER = { x: 70, y: 250, w: 300, h: 96 };
const GUEST = { x: 480, y: 250, w: 300, h: 96 };
const DB = { x: 900, y: 250, w: 290, h: 96 };

const OLD_R: Pt = { x: OLD.x + OLD.w, y: OLD.y + OLD.h / 2 };
const WALL_L: Pt = { x: WALL.x, y: WALL.y + WALL.h / 2 };
const SCR_R: Pt = { x: SCRAPER.x + SCRAPER.w, y: SCRAPER.y + SCRAPER.h / 2 };
const GST_L: Pt = { x: GUEST.x, y: GUEST.y + GUEST.h / 2 };
const GST_R: Pt = { x: GUEST.x + GUEST.w, y: GUEST.y + GUEST.h / 2 };
const DB_L: Pt = { x: DB.x, y: DB.y + DB.h / 2 };

const P_OW: Pt[] = [OLD_R, WALL_L];
const P_SG: Pt[] = [SCR_R, GST_L];
const P_GD: Pt[] = [GST_R, DB_L];

export const FeatureLinkedinGuestScraper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–118): login accounts + IP bans + CAPTCHAs ──
  const oldOp = Math.min(1, pop(10)) * lf;
  const oldLit = 0.3 * lf;
  const wallOp = appear(30, 18) * lf;
  const wallLit = interpolate(frame, [40, 62, 96, 116], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tOw = seg(frame, 36, 58);
  const tOwVis = frame >= 36 && frame < 96 ? 1 : 0;
  const crossScale = pop(50) * interpolate(frame, [96, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (124–246): Guest API reverse-engineered, Edge Function ──
  const scraperOp = appear(126, 18) * lf;
  const scraperLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tSg = seg(frame, 148, 172);
  const tSgVis = frame >= 148 && frame < 206 ? 1 : 0;
  const guestOp = appear(150, 18) * lf;
  const guestLit = interpolate(frame, [158, 180, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGd = seg(frame, 182, 206);
  const tGdVis = frame >= 182 && frame < 236 ? 1 : 0;
  const dbOp = appear(184, 18) * lf;
  const dbLit = interpolate(frame, [192, 214, 330, 350], [0, 0.75, 0.75, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cap2In = seg(frame, 154, 176, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [232, 252], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;
  const uaPillIn = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const uaPillOp = uaPillIn * interpolate(frame, [230, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;

  // ── Beat 3 (238–340): upsert with ON CONFLICT DO UPDATE ──
  const upsertScale = pop(250) * lf;
  const upsertPillIn = seg(frame, 246, 268, Easing.out(Easing.cubic));
  const upsertPillOp = upsertPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 266, 288, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [326, 346], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (350–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_OW} color={T.danger} width={2.5} progress={tOw} opacity={0.8 * tOwVis * lf} />
      <Connector pts={P_SG} color={T.accent} width={2.5} progress={tSg} opacity={0.8 * tSgVis * lf} />
      <Connector pts={P_GD} color={T.accent} width={2.5} progress={tGd} opacity={0.8 * tGdVis * lf} />

      <SchemaNode {...OLD} state="danger" lit={oldLit} opacity={oldOp} label="Fragile login accounts" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>security + maintenance risk</div>
      </SchemaNode>
      <SchemaNode {...WALL} state="danger" lit={wallLit} opacity={wallOp} label="IP bans + CAPTCHAs" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>hours daily fighting rate limits</div>
      </SchemaNode>
      <Token pts={P_OW} t={tOw} color={T.danger} opacity={tOwVis * lf} />
      <Badge x={WALL.x + WALL.w / 2 - 18} y={WALL.y + WALL.h + 10} kind="cross" scale={crossScale} opacity={crossScale} />

      <SchemaNode {...SCRAPER} state="accent" lit={scraperLit} opacity={scraperOp} label="linkedin_scraper.py" fontSize={19}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>httpx + asyncio, concurrent</div>
      </SchemaNode>
      <SchemaNode {...GUEST} state="accent" lit={guestLit} opacity={guestOp} label="LinkedIn Guest API" fontSize={19}>
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 500, marginTop: 2 }}>voyagerJobsDashJobCards, no login</div>
      </SchemaNode>
      <SchemaNode {...DB} state="success" lit={dbLit} opacity={dbOp} label="job_listings" fontSize={20}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Supabase PostgreSQL</div>
      </SchemaNode>
      <Token pts={P_SG} t={tSg} opacity={tSgVis * lf} />
      <Token pts={P_GD} t={tGd} opacity={tGdVis * lf} />
      <Pill x={GUEST.x + 10} y={GUEST.y - 46} dx={0} text="UA rotation + randomized 0.5-2s delays" color={T.amber} opacity={uaPillOp} fontSize={16} />

      <div style={{ position: "absolute", left: DB.x - 30, top: DB.y + DB.h + 40, opacity: upsertScale, transform: `scale(${upsertScale})`, fontFamily }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.success }}>ON CONFLICT (job_id) DO UPDATE</div>
      </div>
      <Badge x={DB.x - 34} y={DB.y + DB.h + 34} kind="check" scale={upsertScale} opacity={upsertScale} size={26} />
      <Pill x={DB.x - 30} y={DB.y + DB.h + 78} text="data integrity, no duplicate listings" color={T.success} opacity={upsertPillOp} fontSize={16} />

      <Caption x={90} y={648} w={1100} text="Login accounts and IP bans were choking reliable data collection" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Reverse-engineered LinkedIn's Guest API — zero logins, zero CAPTCHAs" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Every job upserted safely — never a duplicate row" color={T.success} opacity={cap3} fontSize={23} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>500-700 jobs/day · 99.8% uptime · zero bans, 6 months</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 640,
          width: 1280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: finalCap,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.success,
            color: "#12321c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 21,
            fontWeight: 700,
            transform: `scale(${finalCheck})`,
            boxShadow: `0 0 16px ${hexA(T.success, 0.5)}`,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>300% more coverage, zero login management</div>
      </div>
    </AbsoluteFill>
  );
};
