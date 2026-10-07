/**
 * StatusFocus — 2–3 short claims stacked; a highlight band moves from claim to claim and each
 * gets a verdict mark (✓ / ? / ×) once focused. images[0] (optional) = grayscale photo column.
 * data: { "title"?: "...", "claims": [{ "text": "...", "verdict": "yes|unclear|no" }] }
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { clip, DIM, ease, look, mix, pace, tween, wipeLR, useMotionConfig } from "./grammar";

type Verdict = "yes" | "unclear" | "no";
type Claim = { text: string; verdict: Verdict };

function readClaims(data: Record<string, unknown>): Claim[] {
  const raw = Array.isArray(data?.claims) ? data.claims : [];
  const out: Claim[] = [];
  for (const c of raw as any[]) {
    const text = clip(c?.text, 64);
    if (!text) continue;
    const v = String(c?.verdict ?? "").toLowerCase();
    out.push({ text, verdict: v === "yes" || v === "no" ? v : "unclear" });
  }
  return out.slice(0, 3);
}

export function hasStatusFocusData(data: Record<string, unknown>): boolean {
  return !!data && readClaims(data).length >= 2;
}

const Mark: React.FC<{ verdict: Verdict; accent: string; size: number }> = ({ verdict, accent, size }) => {
  const fill = verdict === "yes" ? accent : verdict === "no" ? look.ink : "transparent";
  const stroke = verdict === "unclear" ? look.ink : "#111";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <rect x="2" y="2" width="44" height="44" rx={look.radius} fill={fill} stroke={verdict === "unclear" ? look.ink : fill} strokeWidth="3" />
      {verdict === "yes" && <path d="M12 25 L21 34 L37 14" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="square" />}
      {verdict === "no" && <path d="M14 14 L34 34 M34 14 L14 34" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="square" />}
      {verdict === "unclear" && (
        <>
          <path d="M18 18 Q18 11 24 11 Q31 11 31 18 Q31 22 24 26 L24 30" fill="none" stroke={stroke} strokeWidth="4.5" />
          <rect x="21.5" y="34" width="5" height="5" fill={stroke} />
        </>
      )}
    </svg>
  );
};

const FIRST = 0.5;
const STEP = 1.5;

export const StatusFocus: React.FC<{
  data: Record<string, unknown>;
  accentColor: string;
  images?: string[];
}> = ({ data, accentColor, images }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useMotionConfig();
  if (!hasStatusFocusData(data)) return null;
  const isVertical = height > width;
  const claims = readClaims(data);
  const n = claims.length;
  const title = clip(data.title, 48);
  const photo = images?.[0];
  const build = FIRST + STEP * (n - 1) + 0.45 + 0.3;
  const { t } = pace(frame, fps, durationInFrames, build);

  // layout
  const photoW = photo && !isVertical ? 600 : 0;
  const photoH = photo && isVertical ? 330 : 0;
  const gap = 56;
  const left = look.safeX + (photoW ? photoW + gap : 0);
  const copyW = width - left - look.safeX;
  const titleH = title ? 64 : 0;
  const top0 = look.safeY + photoH + (photoH ? 40 : 0);
  const availH = height - top0 - look.safeBottom - titleH;
  const rowH = Math.min(isVertical ? 250 : 230, Math.floor(availH / n));
  const blockH = rowH * n + titleH;
  const blockTop = top0 + Math.max(0, (availH + titleH - blockH) / 2);
  const rowsTop = blockTop + titleH;
  const fs = isVertical ? 50 : 54;
  const markSize = isVertical ? 72 : 84;

  // focus position (continuous index), band wipe, marks
  let pos = 0;
  for (let i = 1; i < n; i++) pos += tween(t, FIRST + STEP * i, 0.4, ease.power3InOut);
  const bandP = tween(t, FIRST, 0.32, ease.power3Out);
  const rowFocus = (i: number) => Math.max(0, 1 - Math.abs(pos - i)) * (bandP > 0 ? 1 : 0);

  return (
    <AbsoluteFill style={{ fontFamily: look.font }}>
      {photo && (
        <div
          style={{
            position: "absolute",
            left: look.safeX,
            top: look.safeY,
            width: isVertical ? width - look.safeX * 2 : photoW,
            height: isVertical ? photoH : height - look.safeY - look.safeBottom,
            borderRadius: look.radius,
            overflow: "hidden",
            boxShadow: look.shadowHard,
            opacity: tween(t, 0.16, 0.3),
          }}
        >
          <Img src={photo} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.05)" }} />
        </div>
      )}

      {title && (
        <div
          style={{
            position: "absolute",
            left,
            top: blockTop,
            width: copyW,
            color: look.muted,
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: look.tracking.body,
            fontFamily: look.mono,
            textTransform: "uppercase",
            clipPath: wipeLR(tween(t, 0.16, 0.25)),
          }}
        >
          {title}
        </div>
      )}

      {/* focus band */}
      <div
        style={{
          position: "absolute",
          left: left - 24,
          width: copyW + 48,
          top: rowsTop + pos * rowH + 6,
          height: rowH - 12,
          background: look.surface,
          border: `3px solid ${accentColor}`,
          borderRadius: look.radius,
          boxShadow: look.shadowHard,
          clipPath: wipeLR(bandP),
        }}
      />

      {claims.map((c, i) => {
        const f = rowFocus(i);
        const enter = tween(t, 0.2 + 0.06 * i, 0.28);
        const mp = tween(t, FIRST + STEP * i + 0.45, 0.25, ease.power3Out);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              width: copyW,
              top: rowsTop + i * rowH,
              height: rowH,
              display: "flex",
              alignItems: "center",
              gap: 32,
              opacity: enter * mix(f, DIM, 1),
            }}
          >
            <div
              style={{
                flex: 1,
                color: look.ink,
                fontSize: fs,
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: look.tracking.head,
              }}
            >
              {c.text}
            </div>
            <div style={{ width: markSize, height: markSize, opacity: mp > 0 ? 1 : 0, transform: `scale(${mix(mp, 0.7, 1)})` }}>
              <Mark verdict={c.verdict} accent={accentColor} size={markSize} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
