/**
 * FeatureJobMap — feature j25 — 1280x720, 15s @ 30fps, silent, loop-friendly.
 *
 * Story: raw city text ("Oslo," "Gjøvik," "Hunndalen," "Bismo") gives zero
 * spatial context, Google Geocoding API would cost $5/1000 requests →
 * JobMap.tsx resolves location via a multi-stage lookup: CITY_COORDS (160+
 * cities) → POSTAL_RANGES fallback → extractLocation() scans job text →
 * color-coded Leaflet markers render on the map → real-time clusters across
 * Innlandet/Oslo/Bergen, $100+/month geocoding cost eliminated.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from "remotion";
import { T, hexA } from "./theme";
import { Bg, SchemaNode, Connector, Token, Caption, Badge, Pill, Pt, seg, loopFade, fontFamily } from "./primitives";

// ── Layout ──────────────────────────────────────────────────────────
const RAW = [
  { x: 90, y: 62, w: 200, h: 78, label: '"Oslo"' },
  { x: 340, y: 62, w: 200, h: 78, label: '"Gjøvik"' },
  { x: 590, y: 62, w: 200, h: 78, label: '"Hunndalen"' },
  { x: 840, y: 62, w: 200, h: 78, label: '"Bismo"' },
];
const RAW_B: Pt[] = RAW.map((r) => ({ x: r.x + r.w / 2, y: r.y + r.h }));

const NOCTX = { x: 445, y: 200, w: 390, h: 90 };
const NOCTX_T: Pt = { x: NOCTX.x + NOCTX.w / 2, y: NOCTX.y };

const EXTRACT = { x: 490, y: 330, w: 300, h: 90 };
const CITY = { x: 130, y: 460, w: 260, h: 90 };
const POSTAL = { x: 490, y: 460, w: 260, h: 90 };
const MARKER = { x: 850, y: 460, w: 260, h: 90 };

const EXTRACT_T: Pt = { x: EXTRACT.x + EXTRACT.w / 2, y: EXTRACT.y };
const EXTRACT_B: Pt = { x: EXTRACT.x + EXTRACT.w / 2, y: EXTRACT.y + EXTRACT.h };
const CITY_T: Pt = { x: CITY.x + CITY.w / 2, y: CITY.y };
const POSTAL_T: Pt = { x: POSTAL.x + POSTAL.w / 2, y: POSTAL.y };
const POSTAL_R: Pt = { x: POSTAL.x + POSTAL.w, y: POSTAL.y + POSTAL.h / 2 };
const MARKER_L: Pt = { x: MARKER.x, y: MARKER.y + MARKER.h / 2 };
const CITY_R: Pt = { x: CITY.x + CITY.w, y: CITY.y + CITY.h / 2 };

const P_EXTRACT_CITY: Pt[] = [EXTRACT_B, CITY_T];
const P_EXTRACT_POSTAL: Pt[] = [EXTRACT_B, POSTAL_T];
const P_CITY_MARKER: Pt[] = [CITY_R, { x: POSTAL.x, y: CITY.y + CITY.h / 2 }, MARKER_L];
const P_POSTAL_MARKER: Pt[] = [POSTAL_R, MARKER_L];

export const FeatureJobMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const lf = loopFade(frame, durationInFrames);

  const pop = (start: number, damping = 11) =>
    frame < start ? 0 : spring({ frame: frame - start, fps, config: { damping, mass: 0.6 } });
  const appear = (start: number, len = 18) =>
    interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Beat 1 (0–112): raw city strings → no spatial context, Google $5/1k too costly ──
  const rawOp = RAW.map((_, i) => appear(6 + i * 8) * lf);
  const rawLit = RAW.map((_, i) =>
    interpolate(frame, [6 + i * 8, 30 + i * 8, 96, 116], [0, 0.4, 0.4, 0.12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * lf,
  );
  const noctxOp = Math.min(1, pop(46)) * lf;
  const noctxLit = interpolate(frame, [46, 68, 96, 116], [0, 0.65, 0.65, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const connRawOp = RAW.map((_, i) => 0.4 * Math.min(rawOp[i], noctxOp));
  const costPillIn = seg(frame, 62, 84, Easing.out(Easing.cubic));
  const costPillOp = costPillIn * interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const costPillDx = (1 - costPillIn) * 40;
  const cap1In = seg(frame, 50, 72, Easing.out(Easing.cubic));
  const cap1Out = interpolate(frame, [102, 122], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap1 = cap1In * cap1Out * lf;

  // ── Beat 2 (128–232): extractLocation() → CITY_COORDS (160+) / POSTAL_RANGES fallback ──
  const extractOp = appear(134, 18) * lf;
  const extractLit = interpolate(frame, [134, 156, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const tEc = seg(frame, 152, 178);
  const tEcVis = frame >= 152 && frame < 200 ? 1 : 0;
  const tEp = seg(frame, 158, 184);
  const tEpVis = frame >= 158 && frame < 206 ? 1 : 0;
  const cityOp = appear(168, 18) * lf;
  const cityLit = interpolate(frame, [176, 198, 330, 350], [0, 0.7, 0.7, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const postalOp = appear(174, 18) * lf;
  const postalLit = interpolate(frame, [182, 204, 330, 350], [0, 0.6, 0.6, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const cityPillIn = seg(frame, 186, 208, Easing.out(Easing.cubic));
  const cityPillOp = cityPillIn * interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cityPillDx = (1 - cityPillIn) * 40;
  const cap2In = seg(frame, 156, 178, Easing.out(Easing.cubic));
  const cap2Out = interpolate(frame, [222, 242], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap2 = cap2In * cap2Out * lf;

  // ── Beat 3 (246–340): fallback when city not found → postal prefix → marker ──
  const tCm = seg(frame, 250, 274);
  const tCmVis = frame >= 250 && frame < 300 ? 1 : 0;
  const tPm = seg(frame, 256, 280);
  const tPmVis = frame >= 256 && frame < 306 ? 1 : 0;
  const markerOp = appear(270, 18) * lf;
  const markerLit = interpolate(frame, [278, 300, 330, 350], [0, 0.75, 0.75, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }) * lf;
  const fallbackPillIn = seg(frame, 262, 284, Easing.out(Easing.cubic));
  const fallbackPillOp = fallbackPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const colorPillIn = seg(frame, 288, 310, Easing.out(Easing.cubic));
  const colorPillOp = colorPillIn * interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * lf;
  const cap3In = seg(frame, 264, 286, Easing.out(Easing.cubic));
  const cap3Out = interpolate(frame, [316, 336], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cap3 = cap3In * cap3Out * lf;

  // ── Beat 4 (346–450): result ──
  const finalCapIn = seg(frame, 372, 394, Easing.out(Easing.cubic));
  const finalCap = finalCapIn * lf;
  const finalCheck = pop(378) * lf;
  const metricOp = seg(frame, 358, 380, Easing.out(Easing.cubic)) * lf;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Bg />

      {RAW_B.map((pts, i) => (
        <Connector key={i} pts={[pts, NOCTX_T]} color={T.danger} width={2} opacity={connRawOp[i]} />
      ))}
      <Connector pts={P_EXTRACT_CITY} color={T.accent} width={2.5} progress={tEc} opacity={0.8 * tEcVis * lf} />
      <Connector pts={P_EXTRACT_POSTAL} color={T.accent} width={2.5} progress={tEp} opacity={0.8 * tEpVis * lf} />
      <Connector pts={P_CITY_MARKER} color={T.success} width={2.5} progress={tCm} opacity={0.8 * tCmVis * lf} />
      <Connector pts={P_POSTAL_MARKER} color={T.amber} width={2.5} progress={tPm} opacity={0.8 * tPmVis * lf} />

      {RAW.map((r, i) => (
        <SchemaNode key={r.label} {...r} state="danger" lit={rawLit[i]} opacity={rawOp[i]} label={r.label} fontSize={22} />
      ))}
      <SchemaNode {...NOCTX} state="danger" lit={noctxLit} opacity={noctxOp} label="Flat list — zero spatial context" fontSize={22} />
      <Pill x={NOCTX.x + 40} y={NOCTX.y + NOCTX.h + 14} dx={costPillDx} text="Google Geocoding: $5 / 1000 requests" color={T.danger} opacity={costPillOp} fontSize={19} />

      <SchemaNode {...EXTRACT} state="accent" lit={extractLit} opacity={extractOp} label="extractLocation()" fontSize={22}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>scans job text, ø/o aware</div>
      </SchemaNode>
      <Token pts={P_EXTRACT_CITY} t={tEc} opacity={tEcVis * lf} />
      <Token pts={P_EXTRACT_POSTAL} t={tEp} opacity={tEpVis * lf} />

      <SchemaNode {...CITY} state="accent" lit={cityLit} opacity={cityOp} label="CITY_COORDS" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>160+ Norwegian cities</div>
      </SchemaNode>
      <SchemaNode {...POSTAL} state="amber" lit={postalLit} opacity={postalOp} label="POSTAL_RANGES" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>4-digit prefix fallback</div>
      </SchemaNode>
      <Pill x={CITY.x - 10} y={CITY.y - 46} dx={cityPillDx} text="Oslo, Gjøvik, Hunndalen, Raufoss…" color={T.accent} opacity={cityPillOp} fontSize={16} />

      <SchemaNode {...MARKER} state="success" lit={markerLit} opacity={markerOp} label="Leaflet marker" fontSize={21}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500, marginTop: 2 }}>color-coded pin on map</div>
      </SchemaNode>
      <Token pts={P_CITY_MARKER} t={tCm} color={T.success} opacity={tCmVis * lf} />
      <Token pts={P_POSTAL_MARKER} t={tPm} color={T.amber} opacity={tPmVis * lf} />
      <Pill x={MARKER.x - 20} y={MARKER.y - 46} text="not found in CITY_COORDS → postal fallback" color={T.amber} opacity={fallbackPillOp} fontSize={15} />
      <Pill x={MARKER.x - 10} y={MARKER.y + MARKER.h + 14} text="green submitted · blue analyzed · yellow in-progress" color={T.success} opacity={colorPillOp} fontSize={14} />

      <Caption x={90} y={648} w={1100} text="Raw text gives zero spatial context — Google Geocoding is too costly at scale" color={T.danger} opacity={cap1} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Static coordinate cache resolves location for free, city-by-city" color={T.text} opacity={cap2} fontSize={22} weight={600} />
      <Caption x={90} y={648} w={1100} text="Postal-code fallback catches every city the static cache misses" color={T.amber} opacity={cap3} fontSize={22} weight={600} />

      <div style={{ position: "absolute", left: 0, top: 598, width: 1280, textAlign: "center", opacity: metricOp }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: T.muted }}>Live clusters across Innlandet, Oslo, Bergen</div>
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
        <div style={{ fontSize: 27, fontWeight: 600, color: T.success }}>$100+/month geocoding cost eliminated</div>
      </div>
    </AbsoluteFill>
  );
};
