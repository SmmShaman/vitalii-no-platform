/**
 * HubRouting — an accent hero hub lands first; the inputs then connect to it one at a time (item,
 * drawn route, travelling dot); after a short pause the hub routes out to 1–4 outputs.
 * data: { inputs: string[] (2-5), hub: string, output?: string, outputs?: string[] (1-4) }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pace, tween, ease, punchScale, clip, look, useMotionConfig } from "./grammar";

function parseInputs(data: Record<string, unknown>): string[] {
  const raw = Array.isArray(data?.inputs) ? (data.inputs as unknown[]) : [];
  return raw.map((s) => clip(s, 26)).filter((s) => s.length > 0).slice(0, 5);
}

function parseOutputs(data: Record<string, unknown>): string[] {
  const raw = Array.isArray(data?.outputs) ? (data.outputs as unknown[]) : [];
  const list = raw.map((s) => clip(s, 26)).filter((s) => s.length > 0).slice(0, 4);
  if (list.length > 0) return list;
  const one = data?.output ? clip(data.output, 26) : "";
  return one ? [one] : [];
}

export function hasHubRoutingData(data: Record<string, unknown>): boolean {
  return !!data && parseInputs(data).length >= 2 && clip(data.hub, 24).length > 0;
}

type Pt = { x: number; y: number };
type Route = { d: string; at: (p: number) => Pt };

/** Turns a sampled point list into an SVG path plus an arc-length position lookup. */
function makeRoute(pts: Pt[]): Route {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cum[cum.length - 1] || 1;
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const at = (p: number): Pt => {
    const target = Math.max(0, Math.min(1, p)) * total;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < target) i++;
    const seg = cum[i] - cum[i - 1] || 1;
    const u = (target - cum[i - 1]) / seg;
    return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * u, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * u };
  };
  return { d, at };
}

function sCurve(s: Pt, e: Pt): Route {
  const c1: Pt = { x: s.x + (e.x - s.x) * 0.55, y: s.y };
  const c2: Pt = { x: e.x - (e.x - s.x) * 0.45, y: e.y };
  const pts: Pt[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const u = 1 - t;
    pts.push({
      x: u * u * u * s.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * e.x,
      y: u * u * u * s.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * e.y,
    });
  }
  return makeRoute(pts);
}

/** Two-segment elbow (vertical then horizontal) with a rounded corner. */
function elbow(s: Pt, e: Pt, r = 28): Route {
  if (Math.abs(e.x - s.x) < 1) return makeRoute([s, e]);
  const corner: Pt = { x: s.x, y: e.y };
  const rr = Math.min(r, Math.abs(e.y - s.y), Math.abs(e.x - s.x));
  const dirX = Math.sign(e.x - s.x);
  const a: Pt = { x: s.x, y: corner.y - rr };
  const b: Pt = { x: s.x + dirX * rr, y: corner.y };
  const pts: Pt[] = [s, a];
  for (let i = 1; i <= 10; i++) {
    const t = i / 10;
    const u = 1 - t;
    pts.push({ x: u * u * a.x + 2 * u * t * corner.x + t * t * b.x, y: u * u * a.y + 2 * u * t * corner.y + t * t * b.y });
  }
  pts.push(e);
  return makeRoute(pts);
}

export const HubRouting: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useMotionConfig();
  const inputs = parseInputs(data);
  const outputs = parseOutputs(data);
  const hub = clip(data?.hub, 24);
  if (inputs.length < 2 || !hub) return null;

  const isVertical = height > width;
  const n = inputs.length;
  const m = outputs.length;

  // ── timeline (absolute seconds) ──
  const hubT = 0.16;
  const inT = (i: number) => 0.55 + i * 0.35; // item lands; its route starts 0.2 s later
  const inRouteDur = 0.6;
  const inEnd = inT(n - 1) + 0.2 + inRouteDur;
  const outT = inEnd + 0.5; // the pause between the two halves
  const outStep = 0.22;
  const outRouteDur = 0.55;
  const BUILD = m > 0 ? outT + (m - 1) * outStep + outRouteDur + 0.35 : inEnd;
  const { t } = pace(frame, fps, durationInFrames, BUILD);

  // ── geometry ──
  const safeX = look.safeX;
  const itemW = isVertical ? 480 : 460;
  const itemH = isVertical ? 112 : 120;
  const pitch = isVertical ? 136 : Math.min(150, 760 / Math.max(n, m, 1));
  const hubW = isVertical ? 300 : 440;
  const hubH = isVertical ? 300 : 360;
  const font = 42;

  const inH = (n - 1) * pitch + itemH;
  const outH = m > 0 ? (m - 1) * pitch + itemH : 0;

  let hubC: Pt;
  let inY0: number;
  let outPts: { x: number; y: number }[] = [];
  const inX = safeX;
  if (isVertical) {
    const gapV = 100;
    const topBlock = Math.max(inH, hubH);
    const totalH = topBlock + (m ? gapV + outH : 0);
    const y0 = (height - totalH) / 2;
    hubC = { x: width - safeX - hubW / 2, y: y0 + topBlock / 2 };
    inY0 = y0 + (topBlock - inH) / 2;
    const oy0 = y0 + topBlock + gapV;
    outPts = outputs.map((_, j) => ({ x: inX, y: oy0 + j * pitch }));
  } else {
    hubC = { x: m ? width / 2 : width * 0.62, y: height / 2 };
    inY0 = height / 2 - inH / 2;
    const oy0 = height / 2 - outH / 2;
    const outX = width - safeX - itemW;
    outPts = outputs.map((_, j) => ({ x: outX, y: oy0 + j * pitch }));
  }
  const hubL = hubC.x - hubW / 2;
  const hubR = hubC.x + hubW / 2;
  const hubB = hubC.y + hubH / 2;
  const spread = (i: number, cnt: number) => (cnt <= 1 ? 0 : (i - (cnt - 1) / 2) * Math.min(52, (hubH - 80) / (cnt - 1)));

  const inPos = inputs.map((_, i) => ({ x: inX, y: inY0 + i * pitch }));
  const inRoutes = inputs.map((_, i) =>
    sCurve({ x: inPos[i].x + itemW, y: inPos[i].y + itemH / 2 }, { x: hubL, y: hubC.y + spread(i, n) }),
  );
  const outRoutes = outputs.map((_, j) =>
    isVertical
      ? elbow({ x: hubC.x, y: hubB }, { x: outPts[j].x + itemW, y: outPts[j].y + itemH / 2 })
      : sCurve({ x: hubR, y: hubC.y + spread(j, m) }, { x: outPts[j].x, y: outPts[j].y + itemH / 2 }),
  );

  const hubScale = punchScale(t, hubT, 0.88);
  const hubVisible = t >= hubT;

  const itemBase: React.CSSProperties = {
    position: "absolute",
    width: itemW,
    height: itemH,
    boxSizing: "border-box",
    borderRadius: look.radius,
    display: "flex",
    alignItems: "center",
    padding: "0 26px",
    fontFamily: look.font,
    fontWeight: 700,
    fontSize: font,
    letterSpacing: look.tracking.head,
    lineHeight: 1.05,
    overflowWrap: "anywhere",
  };

  const route = (r: Route, p: number, key: string, color: string, w: number) => (
    <g key={key}>
      {p > 0 && (
        <path
          d={r.d}
          fill="none"
          stroke={color}
          strokeWidth={w}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      )}
      {p > 0 && p < 1 && <circle cx={r.at(p).x} cy={r.at(p).y} r={12} fill={accentColor} />}
    </g>
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: look.scrim }} />
      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
        {inRoutes.map((r, i) => route(r, tween(t, inT(i) + 0.2, inRouteDur, ease.power2Out), `i${i}`, look.ink, 4))}
        {outRoutes.map((r, j) => route(r, tween(t, outT + j * outStep, outRouteDur, ease.power2Out), `o${j}`, accentColor, 5))}
      </svg>

      {inputs.map((label, i) => {
        const p = tween(t, inT(i), 0.3, ease.power3Out);
        return (
          <div
            key={i}
            style={{
              ...itemBase,
              left: inPos[i].x,
              top: inPos[i].y,
              background: look.surface,
              border: `${look.ruleW}px solid ${look.rule}`,
              color: look.ink,
              opacity: Math.min(1, p * 4),
              transform: `translateX(${(1 - p) * -30}px)`,
            }}
          >
            {label}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: hubL,
          top: hubC.y - hubH / 2,
          width: hubW,
          height: hubH,
          boxSizing: "border-box",
          background: accentColor,
          color: "#0a0a0a",
          borderRadius: look.radius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 28px",
          textAlign: "center",
          fontFamily: look.font,
          fontWeight: 850,
          fontSize: hub.length > 16 ? 56 : hub.length > 10 ? 66 : 80,
          letterSpacing: look.tracking.hero,
          lineHeight: 1.04,
          overflowWrap: "anywhere",
          opacity: hubVisible ? 1 : 0,
          transform: `scale(${hubScale})`,
        }}
      >
        {hub}
      </div>

      {outputs.map((label, j) => {
        const start = outT + j * outStep;
        const p = tween(t, start + 0.4, 0.3, ease.power3Out);
        return (
          <div
            key={j}
            style={{
              ...itemBase,
              left: outPts[j].x,
              top: outPts[j].y,
              background: look.ink,
              color: "#0a0a0a",
              fontWeight: 800,
              opacity: t >= start + 0.4 ? 1 : 0,
              transform: `translateX(${(1 - p) * 30}px)`,
            }}
          >
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
