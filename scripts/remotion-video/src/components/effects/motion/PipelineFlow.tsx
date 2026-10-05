/**
 * PipelineFlow — stage cards land one by one (left→right, top→bottom in 9:16) joined by linearly drawn
 * arrows; the finished chain is then compacted (scale ~0.6, one camera move) to make room, a solid 7 px
 * frame is drawn around it, a short title is written on the frame LAST, and the result(s) land beyond
 * the frame in accent: one result as the hero block, 2–3 results as a fan leaving one trunk.
 * data: { steps: string[] (3-5), result?: string, results?: string[] (1-3), system?: string }
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { pace, tween, ease, mix, punchScale, wipeLR, clip, look } from "./grammar";

function parseSteps(data: Record<string, unknown>): string[] {
  const raw = Array.isArray(data?.steps) ? (data.steps as unknown[]) : [];
  return raw.map((s) => clip(s, 26)).filter((s) => s.length > 0).slice(0, 5);
}

function parseResults(data: Record<string, unknown>): string[] {
  const raw = Array.isArray(data?.results) ? (data.results as unknown[]) : [];
  const list = raw.map((s) => clip(s, 24)).filter((s) => s.length > 0).slice(0, 3);
  if (list.length > 0) return list;
  const single = data?.result ? clip(data.result, 28) : "";
  return single ? [single] : [];
}

export function hasPipelineFlowData(data: Record<string, unknown>): boolean {
  return !!data && parseSteps(data).length >= 3;
}

type Pt = { x: number; y: number };

/** Polyline with rounded corners (quadratic through each corner). */
function roundedPath(pts: Pt[], r: number): string {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const c = pts[i + 1];
    const l1 = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const l2 = Math.hypot(c.x - b.x, c.y - b.y) || 1;
    const rr = Math.min(r, l1 / 2, l2 / 2);
    d += ` L ${b.x - ((b.x - a.x) / l1) * rr} ${b.y - ((b.y - a.y) / l1) * rr}`;
    d += ` Q ${b.x} ${b.y} ${b.x + ((c.x - b.x) / l2) * rr} ${b.y + ((c.y - b.y) / l2) * rr}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L ${last.x} ${last.y}`;
}

const BUILD_PITCH = 0.5;

export const PipelineFlow: React.FC<{ data: Record<string, unknown>; accentColor: string; images?: string[] }> = ({
  data,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const steps = parseSteps(data);
  if (steps.length < 3) return null;

  const isVertical = height > width;
  const n = steps.length;
  const results = parseResults(data);
  const k = results.length;
  const multi = k > 1;
  const title = clip(data?.system || "Prosessen", 22);

  // ── timeline (absolute seconds) ──
  const stageT = (i: number) => 0.16 + i * BUILD_PITCH;
  const tLast = stageT(n - 1) + 0.33;
  const tCompact = tLast + 0.45;
  const compactDur = 0.75;
  const tFrame = tCompact + compactDur + 0.1;
  const frameDur = 0.6;
  const tTitle = tFrame + frameDur + 0.05;
  const titleDur = 0.3;
  const tOut = tTitle + titleDur + 0.2;
  const outEnd = k === 0 ? tTitle + titleDur : multi ? tOut + (k - 1) * 0.2 + 0.42 + 0.1 : tOut + 0.4 + 0.1 + 0.4;
  const BUILD = Math.max(outEnd, tTitle + titleDur);
  const { t } = pace(frame, fps, durationInFrames, BUILD);

  // ── natural (pre-compaction) chain geometry ──
  const safeX = look.safeX;
  const arrowLen = 64;
  const availW = width - safeX * 2;
  let cw: number;
  let ch: number;
  let font: number;
  if (isVertical) {
    cw = availW;
    ch = n >= 4 ? 200 : 240;
    font = n >= 4 ? 54 : 60;
  } else {
    cw = Math.min(400, (availW - (n - 1) * arrowLen) / n);
    ch = 280;
    font = n <= 3 ? 52 : n === 4 ? 46 : 40;
  }
  const chainW = isVertical ? cw : n * cw + (n - 1) * arrowLen;
  const chainH = isVertical ? n * ch + (n - 1) * arrowLen : ch;
  const gx0 = (width - chainW) / 2;
  const gy0 = (height - chainH) / 2;

  // ── final (compacted) layout ──
  const pad = 40;
  const titleOver = 32; // title slab straddles the frame's top edge
  const gapOut = isVertical ? 110 : 130;
  const resW = isVertical ? 0 : 440;
  const rhSingle = isVertical ? 200 : 220;
  const rhMulti = isVertical ? 210 : 150;
  const rowGap = isVertical ? 24 : 28;
  let s = 0.6;
  if (!isVertical) {
    const avail = availW - (k ? gapOut + resW : 0) - pad * 2;
    s = Math.min(s, avail / chainW);
  }
  const fw = chainW * s + pad * 2;
  const fh = chainH * s + pad * 2;
  const resBlockH = isVertical ? (multi ? rhMulti : rhSingle) : multi ? k * rhMulti + (k - 1) * rowGap : rhSingle;
  let fx: number;
  let fy: number;
  if (isVertical) {
    const totalH = titleOver + fh + (k ? gapOut + resBlockH : 0);
    fx = (width - fw) / 2;
    fy = (height - totalH) / 2 + titleOver;
  } else {
    const totalW = fw + (k ? gapOut + resW : 0);
    fx = (width - totalW) / 2;
    fy = (height - fh) / 2 + titleOver / 2;
  }
  const cf: Pt = { x: fx + fw / 2, y: fy + fh / 2 };

  const compact = tween(t, tCompact, compactDur, ease.power3InOut);
  const sc = mix(compact, 1, s);
  const dx = mix(compact, 0, cf.x - width / 2);
  const dy = mix(compact, 0, cf.y - height / 2);

  const frameP = tween(t, tFrame, frameDur, ease.linear);
  const titleP = tween(t, tTitle, titleDur, ease.power3Out);

  // ── result rectangles + routes ──
  const rects: { x: number; y: number; w: number; h: number }[] = [];
  const routes: string[] = [];
  if (k > 0) {
    if (isVertical) {
      const rowW = availW;
      const w1 = multi ? (rowW - (k - 1) * rowGap) / k : 680;
      const rh = multi ? rhMulti : rhSingle;
      const ry = fy + fh + gapOut;
      const x0 = multi ? safeX : (width - w1) / 2;
      const S: Pt = { x: cf.x, y: fy + fh };
      for (let i = 0; i < k; i++) {
        const rx = x0 + i * (w1 + rowGap);
        rects.push({ x: rx, y: ry, w: w1, h: rh });
        const E: Pt = { x: rx + w1 / 2, y: ry };
        const yt = S.y + gapOut / 2;
        routes.push(
          Math.abs(E.x - S.x) < 1
            ? `M ${S.x} ${S.y} L ${E.x} ${E.y}`
            : roundedPath([S, { x: S.x, y: yt }, { x: E.x, y: yt }, E], 26),
        );
      }
    } else {
      const rh = multi ? rhMulti : rhSingle;
      const blockH = multi ? k * rh + (k - 1) * rowGap : rh;
      const rx = fx + fw + gapOut;
      const y0 = cf.y - blockH / 2;
      const S: Pt = { x: fx + fw, y: cf.y };
      for (let i = 0; i < k; i++) {
        const ry = y0 + i * (rh + rowGap);
        rects.push({ x: rx, y: ry, w: resW, h: rh });
        const E: Pt = { x: rx, y: ry + rh / 2 };
        const xt = S.x + gapOut / 2;
        routes.push(
          Math.abs(E.y - S.y) < 1
            ? `M ${S.x} ${S.y} L ${E.x} ${E.y}`
            : roundedPath([S, { x: xt, y: S.y }, { x: xt, y: E.y }, E], 26),
        );
      }
    }
  }
  const routeStart = (i: number) => (multi ? tOut + i * 0.2 : tOut);
  const routeDur = multi ? 0.42 : 0.4;

  // ── arrows between stages (group coordinates) ──
  const stageRect = (i: number) => ({
    x: isVertical ? 0 : i * (cw + arrowLen),
    y: isVertical ? i * (ch + arrowLen) : 0,
  });
  const arrows = steps.slice(0, -1).map((_, i) => {
    const p = tween(t, stageT(i) + 0.3, 0.22, ease.linear);
    const a = stageRect(i);
    const x1 = isVertical ? a.x + cw / 2 : a.x + cw + 6;
    const y1 = isVertical ? a.y + ch + 6 : a.y + ch / 2;
    const L = arrowLen - 12;
    const ex = isVertical ? x1 : x1 + L * p;
    const ey = isVertical ? y1 + L * p : y1;
    const hs = 16;
    const head = isVertical
      ? `${ex - hs},${ey - hs} ${ex},${ey} ${ex + hs},${ey - hs}`
      : `${ex - hs},${ey - hs} ${ex},${ey} ${ex - hs},${ey + hs}`;
    return (
      <g key={i} opacity={p > 0 ? 1 : 0}>
        <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={look.ink} strokeWidth={5} strokeLinecap="round" />
        <polyline points={head} fill="none" stroke={look.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: look.scrim }} />

      {/* the chain: one locked group, compacted by a single camera move */}
      <div
        style={{
          position: "absolute",
          left: gx0,
          top: gy0,
          width: chainW,
          height: chainH,
          transformOrigin: "50% 50%",
          transform: `translate(${dx}px, ${dy}px) scale(${sc})`,
        }}
      >
        <svg width={chainW} height={chainH} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {arrows}
        </svg>
        {steps.map((label, i) => {
          const p = tween(t, stageT(i), 0.33, ease.power3Out);
          const pos = stageRect(i);
          const tilt = (i % 2 === 0 ? -1 : 1) * 1.2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: cw,
                height: ch,
                boxSizing: "border-box",
                background: look.surface,
                border: `${look.ruleW}px solid ${look.rule}`,
                borderRadius: look.radius,
                boxShadow: look.shadowHard,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: "0 24px",
                opacity: Math.min(1, p * 4),
                transform: `translateY(${(1 - p) * 28}px) rotate(${(1 - p) * tilt}deg)`,
              }}
            >
              <div
                style={{
                  fontFamily: look.mono,
                  fontWeight: 500,
                  fontSize: 26,
                  color: look.muted,
                  marginBottom: 10,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: look.font,
                  fontWeight: 750,
                  fontSize: font,
                  letterSpacing: look.tracking.head,
                  color: look.ink,
                  lineHeight: 1.1,
                  overflowWrap: "anywhere",
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>

      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
        {frameP > 0 && (
          <rect
            x={fx}
            y={fy}
            width={fw}
            height={fh}
            rx={look.radius}
            fill="none"
            stroke={look.ink}
            strokeWidth={7}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - frameP}
          />
        )}
        {routes.map((d, i) => {
          const p = tween(t, routeStart(i), routeDur, ease.linear);
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={accentColor}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              opacity={p > 0 ? 1 : 0}
            />
          );
        })}
      </svg>

      {/* title written last, straddling the frame's top edge */}
      {titleP > 0 && (
        <div
          style={{
            position: "absolute",
            left: fx + 36,
            top: fy - titleOver - 6,
            height: titleOver * 2 + 12,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            background: look.ink,
            color: "#0a0a0a",
            borderRadius: look.radius,
            fontFamily: look.font,
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: look.tracking.head,
            whiteSpace: "nowrap",
            clipPath: wipeLR(titleP),
          }}
        >
          {title}
        </div>
      )}

      {rects.map((r, i) => {
        const start = routeStart(i);
        const arrive = multi ? start + 0.3 : start + routeDur + 0.1;
        const p = tween(t, arrive, 0.26, ease.power3Out);
        const scale = multi ? 1 : punchScale(t, arrive, 0.9, 1.03);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              boxSizing: "border-box",
              background: accentColor,
              color: "#0a0a0a",
              borderRadius: look.radius,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 24px",
              textAlign: "center",
              fontFamily: look.font,
              fontWeight: 850,
              fontSize: multi ? (isVertical ? 38 : 46) : isVertical ? 64 : 58,
              letterSpacing: look.tracking.head,
              lineHeight: 1.08,
              overflowWrap: "anywhere",
              opacity: arrive <= t ? 1 : 0,
              transformOrigin: isVertical ? "50% 0%" : "0% 50%",
              transform: multi
                ? `translate(${isVertical ? 0 : (1 - p) * 24}px, ${isVertical ? (1 - p) * 24 : 0}px)`
                : `scale(${scale})`,
            }}
          >
            {results[i]}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
