/**
 * FeatureLinkedinGuestApi — feature j15 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: scraping LinkedIn directly risks the personal profile — bans,
 * CAPTCHA, rate limiting → instead, linkedin_scraper.ts (Deno) hits the
 * public Guest API (linkedin.com/jobs/search, location=Norway), parsing
 * JSON-LD with a Cheerio HTML fallback → a strict rate limiter (max 50
 * req/cycle, randomized 1-3s delays) + User-Agent rotation evades
 * detection → 6 months, zero bans, up to 1000 jobs per scan.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const ACC = { x: 460, y: 30, w: 360, h: 80 };
const GUEST = { x: 90, y: 180, w: 320, h: 90 };
const SCRAPER = { x: 500, y: 180, w: 300, h: 90 };
const RATE = { x: 890, y: 180, w: 300, h: 90 };

const ACC_B: Pt = { x: ACC.x + ACC.w / 2, y: ACC.y + ACC.h };
const GUEST_T: Pt = { x: GUEST.x + GUEST.w / 2, y: GUEST.y };
const GUEST_R: Pt = { x: GUEST.x + GUEST.w, y: GUEST.y + GUEST.h / 2 };
const SCRAPER_L: Pt = { x: SCRAPER.x, y: SCRAPER.y + SCRAPER.h / 2 };
const SCRAPER_R: Pt = { x: SCRAPER.x + SCRAPER.w, y: SCRAPER.y + SCRAPER.h / 2 };
const RATE_L: Pt = { x: RATE.x, y: RATE.y + RATE.h / 2 };

const P_ACC_GUEST: Pt[] = [ACC_B, GUEST_T];
const P_GUEST_SCR: Pt[] = [GUEST_R, SCRAPER_L];
const P_SCR_RATE: Pt[] = [SCRAPER_R, RATE_L];

export const FeatureLinkedinGuestApi: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–108): risking the personal profile is unacceptable ──
  const accOp = Math.min(1, pop(4)) * lf;
  const accLit = interpolate(frame, [4, 26, 86, 106], [0, 0.55, 0.55, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const crossScale = pop(38) * interpolate(frame, [86, 106], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const riskPillIn = seg(frame, 42, 64, Easing.out(Easing.cubic));
  const riskPillOp = riskPillIn * interpolate(frame, [88, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap1In = seg(frame, 20, 42, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [92, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (114–246): Guest API → linkedin_scraper.ts (Deno) ──
  const tAg = seg(frame, 116, 138);
  const tAgVis = frame >= 116 && frame < 200 ? 1 : 0;
  const guestOp = appear(120, 18) * lf;
  const guestLit = interpolate(frame, [128, 150, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tGs = seg(frame, 152, 174);
  const tGsVis = frame >= 152 && frame < 330 ? 1 : 0;
  const scrOp = appear(156, 18) * lf;
  const scrLit = interpolate(frame, [164, 186, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const parsePillIn = seg(frame, 188, 210, Easing.out(Easing.cubic));
  const parsePillOp = parsePillIn * interpolate(frame, [240, 260], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap2In = seg(frame, 158, 180, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [240, 260], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (250–352): rate limiter + UA rotation evades detection ──
  const tSr = seg(frame, 252, 274);
  const tSrVis = frame >= 252 && frame < 330 ? 1 : 0;
  const rateOp = appear(256, 18) * lf;
  const rateLit = interpolate(frame, [264, 286, 330, 350], [0, 0.75, 0.75, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const uaPillIn = seg(frame, 288, 310, Easing.out(Easing.cubic));
  const uaPillOp = uaPillIn * interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 258, 280, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [354, 374], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (360–450): result ──
  const finalCapIn = seg(frame, 380, 402, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(386) * lf;
  const metricOp = seg(frame, 366, 388, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      <Connector pts={P_ACC_GUEST} color={T.success} width={2.5} progress={tAg} opacity={0.8 * tAgVis * lf} />
      <Connector pts={P_GUEST_SCR} color={T.accent} width={2.5} progress={tGs} opacity={0.8 * tGsVis * lf} />
      <Connector pts={P_SCR_RATE} color={T.amber} width={2.5} progress={tSr} opacity={0.8 * tSrVis * lf} />

      <SchemaNode {...ACC} state="danger" lit={accLit} opacity={accOp} label="personal LinkedIn profile" fontSize={18}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>bans · CAPTCHA · rate limits</div>
      </SchemaNode>
      <Badge x={ACC.x + ACC.w - 20} y={ACC.y - 18} kind="cross" scale={crossScale} opacity={crossScale} />
      <Pill x={ACC.x - 10} y={ACC.y + ACC.h + 14} text="risking a personal profile is unacceptable" color={T.danger} opacity={riskPillOp} fontSize={16} />

      <SchemaNode {...GUEST} state="success" lit={guestLit} opacity={guestOp} label="Guest API · jobs/search" fontSize={17}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>location=Norway, no login</div>
      </SchemaNode>
      <Token pts={P_ACC_GUEST} t={tAg} color={T.success} opacity={tAgVis * lf} />

      <SchemaNode {...SCRAPER} state="accent" lit={scrLit} opacity={scrOp} label="linkedin_scraper.ts" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>Deno</div>
      </SchemaNode>
      <Token pts={P_GUEST_SCR} t={tGs} opacity={tGsVis * lf} />
      <Pill x={SCRAPER.x - 30} y={SCRAPER.y - 46} text="JSON-LD parsing · Cheerio HTML fallback" color={T.accent} opacity={parsePillOp} fontSize={15} />

      <SchemaNode {...RATE} state="amber" lit={rateLit} opacity={rateOp} label="rate limiter" fontSize={18}>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginTop: 2 }}>max 50 req/cycle · 1-3s delay</div>
      </SchemaNode>
      <Token pts={P_SCR_RATE} t={tSr} color={T.amber} opacity={tSrVis * lf} />
      <Pill x={RATE.x - 30} y={RATE.y + RATE.h + 14} text="User-Agent rotation from a browser pool" color={T.amber} opacity={uaPillOp} fontSize={15} />

      <Caption x={90} y={648} w={1100} text="Bans, CAPTCHA walls, rate limits — a personal profile can't take the risk" color={T.danger} opacity={cap1} fontSize={21} weight={600} />
      <Caption x={90} y={648} w={1100} text="No login needed — the public Guest API returns real job data" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Randomized delays + rotating identity — mimicking legitimate traffic" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Up to 1000 jobs per scan — 95%+ of the Norwegian IT market</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>6 months, zero bans or CAPTCHA</div>
      </div>
    </AbsoluteFill>
  );
};
